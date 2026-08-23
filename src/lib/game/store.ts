import { create } from "zustand";
import type { ActionIntensity, ActionKind, ActorId, Difficulty, DoctrineUpgradeId, PlayerAction, Screen, Team, World } from "./types";
import { defaultBook, type BookId } from "./blackbook";
import { createWorld } from "./world";
import { defaultAction } from "./actions";
import { forecast, resolveTurn } from "./sim";
import { clearSave, loadWorld, saveWorld } from "./save";
import { unlockAudio, tone, updateAtmosphere, stinger, defconTone } from "./audio";
import { recordTurn } from "./replay";
import { applyScenario, type ScenarioId } from "./scenarios";
import { recordGameEnd } from "./stats";
import { applyDoctrine } from "./doctrine";

function screenForWorld(world: World): Screen {
  if (world.ended) return "end";
  if (world.phase === "nuclear" || world.defcon <= 2) return "war";
  return "play";
}

interface GameState {
  screen: Screen;
  world: World | null;
  selected: ActorId;
  actionKind: ActionKind;
  intensity: ActionIntensity;
  notify: boolean;
  book: BookId;
  briefingPage: number;
  mobileTab: "map" | "status" | "act";
  whyId: string | null;
  confirmNuclear: boolean;
  fileOpen: boolean;
  glossaryOpen: boolean;
  tutorialStep: number;
  scenarioId: ScenarioId | null;
  start: (opts: {
    difficulty: Difficulty;
    playerId: ActorId;
    intent: Team;
    terminator?: boolean;
    scenarioId?: ScenarioId;
  }) => void;
  resume: () => boolean;
  setScreen: (s: Screen) => void;
  select: (id: ActorId) => void;
  setKind: (k: ActionKind) => void;
  setIntensity: (i: ActionIntensity) => void;
  setNotify: (n: boolean) => void;
  setBook: (b: BookId) => void;
  execute: () => void;
  confirmAndExecute: () => void;
  cancelConfirm: () => void;
  setTab: (t: "map" | "status" | "act") => void;
  setBriefingPage: (n: number) => void;
  setWhy: (id: string | null) => void;
  toggleFile: () => void;
  toggleGlossary: () => void;
  setTutorialStep: (n: number) => void;
  dismissTutorial: () => void;
  pickDoctrine: (id: DoctrineUpgradeId) => void;
  action: () => PlayerAction;
}

export const useGame = create<GameState>((set, get) => ({
  screen: "title",
  world: null,
  selected: "KP",
  actionKind: "hold",
  intensity: 1,
  notify: false,
  book: "A",
  briefingPage: 0,
  mobileTab: "act",
  whyId: null,
  confirmNuclear: false,
  fileOpen: false,
  glossaryOpen: false,
  tutorialStep: -1,
  scenarioId: null,
  start: ({ difficulty, playerId, intent, terminator, scenarioId }) => {
    unlockAudio();
    let world = createWorld(difficulty, Date.now() | 0, playerId, intent, Boolean(terminator));
    if (scenarioId) world = applyScenario(world, scenarioId);
    saveWorld(world);
    set({
      screen: screenForWorld(world),
      world,
      selected: world.event.actor === playerId ? "KP" : world.event.actor,
      actionKind: "hold",
      intensity: 1,
      notify: false,
      book: "A",
      confirmNuclear: false,
      fileOpen: false,
      whyId: null,
      tutorialStep: world.turn === 1 ? 0 : -1,
      scenarioId: scenarioId ?? null,
    });
  },
  resume: () => {
    const world = loadWorld();
    if (!world || world.ended) return false;
    set({
      screen: screenForWorld(world),
      world,
      selected: world.event.actor,
      actionKind: "hold",
      intensity: 1,
      notify: false,
      tutorialStep: -1,
    });
    return true;
  },
  setScreen: (s) => set({ screen: s }),
  select: (id) => set({ selected: id }),
  setKind: (k) =>
    set({
      actionKind: k,
      intensity: 1,
    }),
  setIntensity: (i) => set({ intensity: i, book: defaultBook(i) }),
  setNotify: (n) => set({ notify: n }),
  setBook: (b) => set({ book: b }),
  action: () => {
    const { actionKind, intensity, selected, notify, book } = get();
    return {
      kind: actionKind,
      intensity,
      target: actionKind === "hold" ? null : selected,
      notify: actionKind === "hold" ? false : notify,
      book: actionKind === "employ" ? book : undefined,
    };
  },
  execute: () => {
    const { actionKind, intensity } = get();
    const w = get().world;
    if (actionKind === "employ" && intensity >= 2 && w && (w.actors[w.playerId].nuclear || w.actors[w.playerId].hasDevice)) {
      set({ confirmNuclear: true });
      return;
    }
    get().confirmAndExecute();
  },
  confirmAndExecute: () => {
    const st = get();
    if (!st.world) return;
    const act = st.action();
    const prev = st.world;
    recordTurn(prev, act);
    const next = resolveTurn(structuredClone(prev), act);
    saveWorld(next);
    defconTone(next.defcon);
    updateAtmosphere(next.defcon, next.globalRisk);
    if (next.nuclearUses.length > prev.nuclearUses.length) stinger("detonation");
    if (next.brokenArrow && !prev.brokenArrow) stinger("broken-arrow");
    if (next.trickery && (next.trickery.hotlineSpoof || next.trickery.fakeVoice) && !prev.trickery?.hotlineSpoof) {
      stinger("trickery");
    }
    if (next.ended && next.ending) {
      recordGameEnd(next, st.scenarioId);
    }
    tone(next.defcon <= 2 ? 140 : 220, 0.08, "sine");
    set({
      world: next,
      confirmNuclear: false,
      actionKind: "hold",
      intensity: 1,
      notify: false,
      selected: next.ended ? st.selected : next.event.actor,
      screen: screenForWorld(next),
      whyId: next.log[0]?.id ?? null,
    });
  },
  cancelConfirm: () => set({ confirmNuclear: false }),
  setTab: (t) => set({ mobileTab: t }),
  setBriefingPage: (n) => set({ briefingPage: n }),
  setWhy: (id) => set({ whyId: id }),
  toggleFile: () => set({ fileOpen: !get().fileOpen }),
  toggleGlossary: () => set({ glossaryOpen: !get().glossaryOpen }),
  setTutorialStep: (n) => set({ tutorialStep: n }),
  dismissTutorial: () => set({ tutorialStep: -1 }),
  pickDoctrine: (id: DoctrineUpgradeId) => {
    const w = get().world;
    if (!w) return;
    const next = structuredClone(w);
    applyDoctrine(next, id);
    saveWorld(next);
    set({ world: next });
  },
}));

export function currentForecast() {
  const { world, action } = useGame.getState();
  if (!world) return null;
  return forecast(world, action());
}

export function resetToTitle() {
  useGame.setState({
    screen: "title",
    world: null,
    actionKind: "hold",
    intensity: 1,
    notify: false,
    confirmNuclear: false,
    briefingPage: 0,
    tutorialStep: -1,
    scenarioId: null,
  });
}

export function abandonSave() {
  clearSave();
  resetToTitle();
}

export { defaultAction };

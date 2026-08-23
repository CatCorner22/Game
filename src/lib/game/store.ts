import { create } from "zustand";
import type {
  ActionIntensity,
  ActionKind,
  ActorId,
  Difficulty,
  DoctrineUpgradeId,
  PackageMode,
  PlayerAction,
  Screen,
  Team,
  World,
} from "./types";
import { defaultBook, type BookId } from "./blackbook";
import { createWorld } from "./world";
import { defaultAction } from "./actions";
import { forecast, resolveTurn } from "./sim";
import { clearSave, loadWorld, saveWorld, migrateWorld } from "./save";
import { unlockAudio, tone, updateAtmosphere, stinger, defconTone } from "./audio";
import { recordTurn } from "./replay";
import { applyScenario, scenarioById, type ScenarioId } from "./scenarios";
import { recordGameEnd } from "./stats";
import { applyDoctrine } from "./doctrine";
import { applyC2Stance, type C2StanceId } from "./c2";
import { replayFromCode } from "./replayRun";
import { peekSlotWorld } from "./slots";
import {
  advanceStrategicSystems,
  configureStrategicSystems,
  ensureStrategicSystems,
  type DeadhandMode,
  type StrategicAIMode,
} from "./strategicSystems";

function screenForWorld(world: World): Screen {
  if (world.ended) return "end";
  if (world.closeCall) return "play";
  if (world.phase === "nuclear" || world.defcon <= 2) return "war";
  return "play";
}

interface StartOptions {
  difficulty: Difficulty;
  playerId: ActorId;
  intent: Team;
  terminator?: boolean;
  strategicAI?: StrategicAIMode;
  deadhand?: DeadhandMode;
  scenarioId?: ScenarioId;
}

interface GameState {
  screen: Screen;
  world: World | null;
  selected: ActorId;
  actionKind: ActionKind;
  intensity: ActionIntensity;
  notify: boolean;
  book: BookId;
  packageMode: PackageMode;
  briefingPage: number;
  mobileTab: "map" | "status" | "act";
  whyId: string | null;
  confirmNuclear: boolean;
  fileOpen: boolean;
  glossaryOpen: boolean;
  tutorialStep: number;
  scenarioId: ScenarioId | null;
  saveSlot: 0 | 1 | 2;
  start: (opts: StartOptions) => void;
  resume: () => boolean;
  resumeSlot: (slot: 0 | 1 | 2) => boolean;
  saveToSlot: (slot: 0 | 1 | 2) => void;
  startReplay: (code: string) => boolean;
  applyC2: (id: C2StanceId) => void;
  setScreen: (s: Screen) => void;
  select: (id: ActorId) => void;
  setKind: (k: ActionKind) => void;
  setIntensity: (i: ActionIntensity) => void;
  setNotify: (n: boolean) => void;
  setBook: (b: BookId) => void;
  setPackageMode: (m: PackageMode) => void;
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
  lastError: string | null;
  clearError: () => void;
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
  packageMode: "mirv-decoy",
  briefingPage: 0,
  mobileTab: "act",
  whyId: null,
  confirmNuclear: false,
  fileOpen: false,
  glossaryOpen: false,
  tutorialStep: -1,
  scenarioId: null,
  saveSlot: 0,
  lastError: null,
  start: ({ difficulty, playerId, intent, terminator, strategicAI, deadhand, scenarioId }) => {
    unlockAudio();
    try {
      const scenario = scenarioById(scenarioId);
      const aiMode = strategicAI ?? (terminator ? "skynet" : scenario?.defaultAI ?? "human");
      const deadhandMode = deadhand ?? scenario?.defaultDeadhand ?? "off";
      let world = createWorld(difficulty, Date.now() | 0, playerId, intent, aiMode === "skynet" || Boolean(terminator));
      if (scenarioId) world = applyScenario(world, scenarioId);
      configureStrategicSystems(world, aiMode, deadhandMode);
      saveWorld(world, 0);
      set({
        screen: screenForWorld(world),
        world,
        saveSlot: 0,
        selected: world.event.actor === playerId ? "KP" : world.event.actor,
        actionKind: "hold",
        intensity: 1,
        notify: false,
        book: "A",
        packageMode: "mirv-decoy",
        confirmNuclear: false,
        fileOpen: false,
        whyId: null,
        tutorialStep: world.turn === 1 ? 0 : -1,
        scenarioId: scenarioId ?? null,
        lastError: null,
        mobileTab: "act",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[THRESHOLD] start", err);
      set({ lastError: message, screen: "title" });
    }
  },
  resume: () => {
    const world = loadWorld();
    if (!world || world.ended) return false;
    ensureStrategicSystems(world);
    set({
      screen: screenForWorld(world),
      world,
      selected: world.event.actor,
      actionKind: "hold",
      intensity: 1,
      notify: false,
      tutorialStep: -1,
      scenarioId: (world.scenarioId as ScenarioId | null | undefined) ?? null,
    });
    return true;
  },
  resumeSlot: (slot) => {
    const raw = peekSlotWorld(slot);
    if (!raw || raw.ended) return false;
    const world = migrateWorld(raw);
    ensureStrategicSystems(world);
    saveWorld(world, slot);
    set({
      screen: screenForWorld(world),
      world,
      selected: world.event.actor,
      actionKind: "hold",
      intensity: 1,
      notify: false,
      tutorialStep: -1,
      saveSlot: slot,
      lastError: null,
    });
    return true;
  },
  saveToSlot: (slot) => {
    const w = get().world;
    if (!w) return;
    saveWorld(w, slot);
    set({ saveSlot: slot });
  },
  startReplay: (code) => {
    unlockAudio();
    try {
      const run = replayFromCode(code);
      if (!run) {
        set({ lastError: "Replay code did not decode." });
        return false;
      }
      ensureStrategicSystems(run.world);
      saveWorld(run.world, get().saveSlot);
      set({
        screen: screenForWorld(run.world),
        world: run.world,
        selected: run.world.event.actor,
        actionKind: "hold",
        intensity: 1,
        notify: false,
        tutorialStep: -1,
        scenarioId: (run.record.scenarioId as ScenarioId | null) ?? null,
        lastError: null,
      });
      return true;
    } catch (err) {
      set({ lastError: err instanceof Error ? err.message : String(err) });
      return false;
    }
  },
  applyC2: (id: C2StanceId) => {
    const w = get().world;
    if (!w) return;
    try {
      const next = structuredClone(w);
      applyC2Stance(next, id);
      saveWorld(next, get().saveSlot);
      set({ world: next, lastError: null });
    } catch (err) {
      set({ lastError: err instanceof Error ? err.message : String(err) });
    }
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
  setPackageMode: (m) => set({ packageMode: m }),
  action: () => {
    const { actionKind, intensity, selected, notify, book, packageMode } = get();
    return {
      kind: actionKind,
      intensity,
      target: actionKind === "hold" ? null : selected,
      notify: actionKind === "hold" ? false : notify,
      book: actionKind === "employ" ? book : undefined,
      packageMode: actionKind === "employ" ? packageMode : undefined,
    };
  },
  execute: () => {
    const { actionKind, intensity } = get();
    const world = get().world;
    if (
      actionKind === "employ" &&
      intensity >= 2 &&
      world &&
      (world.actors[world.playerId].nuclear || world.actors[world.playerId].hasDevice)
    ) {
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
    try {
      recordTurn(prev, act);
      const next = resolveTurn(structuredClone(prev), act);
      advanceStrategicSystems(next, act);
      saveWorld(next, st.saveSlot);
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
        lastError: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[THRESHOLD] resolveTurn", err);
      set({ lastError: message, confirmNuclear: false });
    }
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
    try {
      const next = structuredClone(w);
      applyDoctrine(next, id);
      saveWorld(next, get().saveSlot);
      set({ world: next, lastError: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      set({ lastError: message });
    }
  },
  clearError: () => set({ lastError: null }),
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
    lastError: null,
    mobileTab: "act",
  });
}

export function abandonSave() {
  clearSave();
  resetToTitle();
}

export { defaultAction };

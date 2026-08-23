import { create } from "zustand";
import type { ActionIntensity, ActionKind, ActorId, Difficulty, PlayerAction, Screen, Team, World } from "./types";
import { defaultBook, type BookId } from "./blackbook";
import { createWorld } from "./world";
import { defaultAction } from "./actions";
import { forecast, resolveTurn } from "./sim";
import { clearSave, loadWorld, saveWorld } from "./save";
import { unlockAudio, tone } from "./audio";

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
  start: (opts: { difficulty: Difficulty; playerId: ActorId; intent: Team; terminator?: boolean }) => void;
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
  start: ({ difficulty, playerId, intent, terminator }) => {
    unlockAudio();
    const world = createWorld(difficulty, Date.now() | 0, playerId, intent, Boolean(terminator));
    saveWorld(world);
    set({
      screen: "play",
      world,
      selected: world.event.actor === playerId ? "KP" : world.event.actor,
      actionKind: "hold",
      intensity: 1,
      notify: false,
      book: "A",
      confirmNuclear: false,
      fileOpen: false,
      whyId: null,
    });
  },
  resume: () => {
    const world = loadWorld();
    if (!world || world.ended) return false;
    set({
      screen: "play",
      world,
      selected: world.event.actor,
      actionKind: "hold",
      intensity: 1,
      notify: false,
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
    const next = resolveTurn(structuredClone(st.world), act);
    saveWorld(next);
    tone(next.defcon <= 2 ? 140 : 220, 0.08, "sine");
    set({
      world: next,
      confirmNuclear: false,
      actionKind: "hold",
      intensity: 1,
      notify: false,
      selected: next.ended ? st.selected : next.event.actor,
      screen: next.ended ? "end" : "play",
      whyId: next.log[0]?.id ?? null,
    });
  },
  cancelConfirm: () => set({ confirmNuclear: false }),
  setTab: (t) => set({ mobileTab: t }),
  setBriefingPage: (n) => set({ briefingPage: n }),
  setWhy: (id) => set({ whyId: id }),
  toggleFile: () => set({ fileOpen: !get().fileOpen }),
  toggleGlossary: () => set({ glossaryOpen: !get().glossaryOpen }),
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
  });
}

export function abandonSave() {
  clearSave();
  resetToTitle();
}

export { defaultAction };

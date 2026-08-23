import type { World } from "./types";
import { loadWorld } from "./save";

const SLOT_PREFIX = "threshold.save.slot.";
const AUTOSAVE = "threshold.save.autosave";

function slotKey(slot: number) {
  return `${SLOT_PREFIX}${slot}`;
}

export function saveWorldToSlot(world: World, slot: 0 | 1 | 2) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(slotKey(slot), JSON.stringify({ version: 3, world }));
    localStorage.setItem(AUTOSAVE, JSON.stringify({ version: 3, world, slot }));
  } catch {
    /* quota */
  }
}

export function loadWorldFromSlot(slot: 0 | 1 | 2): World | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(slotKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { world?: World };
    if (!parsed.world) return null;
    // Re-use main save migrator by temporarily persisting then loading
    localStorage.setItem("threshold.save.v2", JSON.stringify({ version: 3, world: parsed.world }));
    return loadWorld();
  } catch {
    return null;
  }
}

export function slotMeta(slot: 0 | 1 | 2): { turn: number; seat: string; date: string } | null {
  const w = loadWorldFromSlot(slot);
  if (!w || w.ended) return null;
  return {
    turn: w.turn,
    seat: w.playerId,
    date: `${w.year}-${String(w.month + 1).padStart(2, "0")}`,
  };
}

export function hasAnySlot(): boolean {
  return [0, 1, 2].some((s) => slotMeta(s as 0 | 1 | 2));
}

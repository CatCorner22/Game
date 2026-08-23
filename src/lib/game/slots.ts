import type { World } from "./types";

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

/** Raw world from a slot. Does not touch the autosave key. Caller should migrate. */
export function peekSlotWorld(slot: 0 | 1 | 2): World | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(slotKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { world?: World };
    return parsed.world ?? null;
  } catch {
    return null;
  }
}

export function clearSlot(slot: 0 | 1 | 2) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(slotKey(slot));
  } catch {
    /* ignore */
  }
}

export function slotMeta(slot: 0 | 1 | 2): { turn: number; seat: string; date: string } | null {
  const w = peekSlotWorld(slot);
  if (!w || w.ended) return null;
  return {
    turn: w.turn,
    seat: w.playerId,
    date: `${w.year}-${String((w.month ?? 0) + 1).padStart(2, "0")}`,
  };
}

export function hasAnySlot(): boolean {
  return [0, 1, 2].some((s) => slotMeta(s as 0 | 1 | 2));
}

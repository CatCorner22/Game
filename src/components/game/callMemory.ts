import type { ConferenceLine } from "@/lib/game/advisors/script";

export interface Turn extends ConferenceLine {
  key: string;
  mine?: boolean;
  /**
   * The player's question, when this line is an answer to one.
   *
   * `elaborate` has always accepted a `playerMessage` and the route has always
   * handled it -- there is even a test asserting player text arrives as user
   * content and never as a system instruction. But the one call site passed
   * three arguments, so the question was dropped on the floor: even with a key
   * configured, the model re-voiced a regex-routed scripted answer without ever
   * being shown what was asked. Carrying it on the reply is what closes that.
   */
  askedAbout?: string;
}

/**
 * The call, kept alive across a walk out of the room and back.
 *
 * As an overlay this component was mounted for the life of `GameApp` and merely
 * rendered `null` when closed, so the transcript, the model-rewritten wording
 * and the one-attempt-per-line bookkeeping all survived closing and reopening.
 * A screen unmounts. Without somewhere outside React to put them, stepping out
 * to check the map threw away everything the room had said, and re-entering
 * re-issued up to twelve provider calls that had already been paid for.
 *
 * Keyed by the call's own identity -- the track (or turn) and the rung -- which
 * is exactly the key the reset effect already used to decide when a call is a
 * new call. Presentation only: nothing here reaches the World, so replay from
 * (seed, actions) is untouched.
 */
export interface CallMemory {
  said: Turn[];
  voiced: Record<string, string>;
  attempted: string[];
}
export const CALLS = new Map<string, CallMemory>();

export function callKey(clockKey: string | null, turn: number, rung: number): string {
  return `${clockKey ?? `t${turn}`}:${rung}`;
}

/** Remember one call and forget every other, so the map cannot grow. */
export function rememberCall(key: string, memory: CallMemory): void {
  CALLS.clear();
  CALLS.set(key, memory);
}

/** Forget every call. Called when a run is abandoned or restarted. */
export function resetCallMemory(): void {
  CALLS.clear();
}

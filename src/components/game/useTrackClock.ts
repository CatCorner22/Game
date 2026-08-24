import { useEffect, useState } from "react";
import type { World } from "@/lib/game/types";
import { gameMinutesLeft, wallSecondsFor } from "@/lib/game/flight";

/**
 * The wall clock for an inbound track.
 *
 * The deliberate design constraint here: `SatTrack.minutesToImpact` on the
 * World stays a static budget and is never decremented. `forecast()` replays
 * `resolveTurn` twice on every render and replay codes have to reproduce a run
 * from (seed, actions), so a value that moves with real time cannot live on the
 * World. The anchor lives out here in React instead, and the World stays pure.
 *
 * A close call lasts exactly one turn (sim.ts clears `world.closeCall` at the
 * top of every resolve and may spawn a fresh one), so the clock is scoped to
 * the turn: it counts down the decision window for *this* track.
 */
export interface TrackClock {
  /** Identity of the track being timed; changes reset the clock. */
  key: string;
  /** `performance.now()` when this track appeared, or null before first paint. */
  anchor: number | null;
  /** Full budget in real seconds. */
  totalSec: number;
  /** Real seconds left, floored at zero. */
  remainingSec: number;
  /** Game-minutes left — what the readouts show in place of the static TTI. */
  minutesLeft: number;
  /** 0 at launch, 1 at impact. Drives the track marker along its arc. */
  fraction: number;
  expired: boolean;
}

/** ~8Hz. Fast enough that M:SS never visibly stutters, cheap enough to ignore. */
const TICK_MS = 125;

/**
 * Anchors, keyed by track identity, outside React.
 *
 * This used to be a component-local `useRef`, which was correct while the only
 * two consumers were mounted for the life of the screen. It stopped being
 * correct when the advisor conference became a `Screen`: `PlayScreen` and
 * `ConferenceScreen` are now mutually exclusive, so walking into the room
 * unmounts the watch and walking out unmounts the room, and a per-mount ref is
 * destroyed on every trip. Each remount re-anchored at `performance.now()` and
 * handed the player a full clock back — so round-tripping through the room
 * refilled the countdown indefinitely, and the close-call panel's own primary
 * button is what takes you there.
 *
 * A module-level map is the right lifetime: the anchor belongs to the *track*,
 * not to whichever component happens to be showing it. Two components timing
 * the same track now agree, which they previously did only by accident of both
 * being mounted before the track appeared.
 *
 * This is still wall-clock state living outside the World, which is the whole
 * point — `forecast()` replays `resolveTurn` twice per render and replay codes
 * reproduce a run from (seed, actions), so nothing that moves with real time
 * may touch world state.
 */
const ANCHORS = new Map<string, number>();

/** Drop anchors for every track but the live one, so the map cannot grow. */
function anchorFor(key: string): number {
  const existing = ANCHORS.get(key);
  if (existing !== undefined) return existing;
  ANCHORS.clear();
  const at = typeof performance === "undefined" ? 0 : performance.now();
  ANCHORS.set(key, at);
  return at;
}

/**
 * Forget every anchor. Called when a run is abandoned or restarted, so a new
 * run cannot inherit the previous one's clock.
 */
export function resetTrackClocks(): void {
  ANCHORS.clear();
}

export function trackClockKey(world: World | null): string | null {
  const cc = world?.closeCall;
  if (!cc || !world) return null;
  // minutesToImpact and confidence are part of the identity because a re-rolled
  // track is a new assessment, not a continuation of the old one.
  return `${world.turn}:${cc.track.from}:${cc.track.kind}:${cc.track.minutesToImpact}:${cc.track.confidence}`;
}

/**
 * @param key   Stable identity of the track. Null parks the clock.
 * @param minutes Static game-minutes budget from the track.
 */
export function useTrackClock(key: string | null, minutes: number): TrackClock | null {
  const [, forceTick] = useState(0);

  // Resolved during render, not in an effect, so the first paint of a new track
  // already shows a full clock rather than a stale remainder from the previous
  // one -- and the first paint of a *remount* shows the time that has actually
  // passed rather than a fresh budget.
  const at = key ? anchorFor(key) : null;

  useEffect(() => {
    if (!key) return;
    const id = setInterval(() => forceTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [key]);

  if (!key || at === null) return null;

  const totalSec = wallSecondsFor(minutes);
  const now = typeof performance === "undefined" ? at : performance.now();
  const elapsedSec = Math.max(0, (now - at) / 1000);
  const remainingSec = Math.max(0, totalSec - elapsedSec);
  return {
    key,
    anchor: at,
    totalSec,
    remainingSec,
    minutesLeft: gameMinutesLeft(remainingSec),
    fraction: totalSec <= 0 ? 1 : Math.min(1, elapsedSec / totalSec),
    expired: remainingSec <= 0,
  };
}

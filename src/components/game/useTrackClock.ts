import { useEffect, useRef, useState } from "react";
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
  const anchorRef = useRef<{ key: string; at: number } | null>(null);

  // Re-anchor synchronously during render when the track identity changes, so
  // the first paint of a new track already shows a full clock rather than a
  // stale remainder from the previous one.
  if (key && anchorRef.current?.key !== key) {
    anchorRef.current = { key, at: typeof performance === "undefined" ? 0 : performance.now() };
  }
  if (!key) anchorRef.current = null;

  useEffect(() => {
    if (!key) return;
    const id = setInterval(() => forceTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [key]);

  if (!key || !anchorRef.current) return null;

  const totalSec = wallSecondsFor(minutes);
  const now = typeof performance === "undefined" ? anchorRef.current.at : performance.now();
  const elapsedSec = Math.max(0, (now - anchorRef.current.at) / 1000);
  const remainingSec = Math.max(0, totalSec - elapsedSec);
  return {
    key,
    anchor: anchorRef.current.at,
    totalSec,
    remainingSec,
    minutesLeft: gameMinutesLeft(remainingSec),
    fraction: totalSec <= 0 ? 1 : Math.min(1, elapsedSec / totalSec),
    expired: remainingSec <= 0,
  };
}

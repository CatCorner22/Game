/**
 * Ballistic flight-time geometry.
 *
 * Before this module every track got `nextInt(12, 28)` minutes to impact
 * regardless of who launched it or how far away they were, so a Pyongyang
 * theater shot and a Plesetsk ICBM read identically on the scope. The bands
 * below come from `docs/research/cbrn-incident-corpus.md`: a Russia -> CONUS
 * ICBM is 25-30 minutes, an SLBM from a close-in patrol box is 10-15 and less
 * on a depressed trajectory, and theater weapons land in single digits.
 *
 * The public reconstruction of the decision timeline is what makes this matter:
 * detection lands about a minute after launch, the warning conference costs
 * about three more, and the national leadership is left with roughly six
 * minutes. Flight time is the entire budget the player is spending.
 *
 * IMPORTANT: nothing here draws from the RNG. `buildTrack` still spends exactly
 * one `nextInt` on time-to-impact; this only decides the bounds it samples
 * between. Changing the *number* of draws is what breaks fixed-seed replay.
 */

export type FlightProfileId = "theater" | "mrbm" | "irbm" | "icbm" | "icbm-long" | "slbm" | "unresolved";

export interface FlightProfile {
  id: FlightProfileId;
  /** Short scope label, e.g. "ICBM · minimum-energy". */
  label: string;
  /** Inclusive lower bound, minutes. */
  lo: number;
  /** Inclusive upper bound, minutes. */
  hi: number;
}

/**
 * Azimuths that imply the boost came off the water, which implies a submarine,
 * which implies a much shorter flight than the launching country's landmass
 * distance would suggest. `AZ` in warning.ts is the source list.
 */
const MARITIME_AZIMUTHS = new Set(["Aleutians", "Pacific", "Arctic", "Indian Ocean", "Mediterranean"]);

export function isMaritimeAzimuth(azimuth: string): boolean {
  return MARITIME_AZIMUTHS.has(azimuth);
}

const SLBM: FlightProfile = { id: "slbm", label: "SLBM · close-in patrol", lo: 10, hi: 15 };
const UNRESOLVED: FlightProfile = { id: "unresolved", label: "unresolved phenomenology", lo: 12, hi: 28 };

const BALLISTIC: FlightProfile[] = [
  { id: "theater", label: "theater · short-range", lo: 6, hi: 12 },
  { id: "mrbm", label: "MRBM", lo: 10, hi: 16 },
  { id: "irbm", label: "IRBM", lo: 15, hi: 22 },
  { id: "icbm", label: "ICBM · minimum-energy", lo: 24, hi: 30 },
  { id: "icbm-long", label: "ICBM · trans-polar", lo: 27, hi: 33 },
];

/** Upper range bound in km for each entry of BALLISTIC, last one is open-ended. */
const RANGE_CEILINGS = [1000, 3000, 5500, 9000];

/**
 * Pick the flight profile for a great-circle range.
 *
 * `maritime` short-circuits to the SLBM band: a sea-launched boost is close
 * aboard whatever the launching state's capital happens to be from you.
 */
export function flightProfile(km: number, maritime = false): FlightProfile {
  if (maritime) return SLBM;
  for (let i = 0; i < RANGE_CEILINGS.length; i++) {
    if (km < RANGE_CEILINGS[i]) return BALLISTIC[i];
  }
  return BALLISTIC[BALLISTIC.length - 1];
}

/** Tracks with no ballistic interpretation (UAP and similar) keep the old band. */
export function unresolvedProfile(): FlightProfile {
  return UNRESOLVED;
}

/**
 * Wall-clock compression. One game minute is this many real seconds, so a
 * 25-minute ICBM flight is a 100-second countdown and a 12-minute SLBM is 48.
 * Long enough that the clock is genuinely stressful, short enough that the
 * player is not sitting through half an hour of real time.
 */
export const WALL_SECONDS_PER_GAME_MINUTE = 4;

/** Total real-world seconds a flight of `minutes` occupies on the clock. */
export function wallSecondsFor(minutes: number): number {
  return Math.max(0, minutes) * WALL_SECONDS_PER_GAME_MINUTE;
}

/** Format a remaining-seconds value as M:SS for the countdown readout. */
export function formatCountdown(seconds: number): string {
  const clamped = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Game-minutes still on the clock, given real seconds remaining. This is what
 * the readouts show where they used to show the static `minutesToImpact`.
 */
export function gameMinutesLeft(secondsRemaining: number): number {
  return Math.max(0, secondsRemaining / WALL_SECONDS_PER_GAME_MINUTE);
}

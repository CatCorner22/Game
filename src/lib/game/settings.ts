import { setMuted } from "./audio";

export type ForecastDetail = "full" | "summary";

export interface GameSettings {
  muted: boolean;
  reducedMotion: boolean;
  forecastDetail: ForecastDetail;
  tutorialDone: boolean;
}

const KEY = "threshold.settings.v1";

const DEFAULTS: GameSettings = {
  muted: false,
  reducedMotion: false,
  forecastDetail: "full",
  tutorialDone: false,
};

/**
 * Whether the operating system asks for reduced motion.
 *
 * `reducedMotion` defaulted to `false` regardless of the OS setting, so a player
 * who had asked their machine for less motion still got the rotating globe and
 * the sweeping radar until they found the toggle themselves. The stored
 * preference still wins once set — this only supplies a better default.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function loadSettings(): GameSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  const base: GameSettings = { ...DEFAULTS, reducedMotion: prefersReducedMotion() };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

export function saveSettings(s: GameSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  setMuted(s.muted);
}

export function updateSettings(patch: Partial<GameSettings>): GameSettings {
  const next = { ...loadSettings(), ...patch };
  saveSettings(next);
  return next;
}

export function applySettingsOnBoot() {
  const s = loadSettings();
  setMuted(s.muted);
  return s;
}

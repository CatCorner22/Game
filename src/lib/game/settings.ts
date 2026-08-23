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

export function loadSettings(): GameSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
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

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { loadSettings, updateSettings } from "@/lib/game/settings";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Select a target",
    body: "Click a country on the globe or in the file list. The event actor is pre-selected.",
  },
  {
    title: "Read the forecast",
    body: "Forecast ranges are the same simulation at two luck values. Not a promise — a dry run.",
  },
  {
    title: "Execute HOLD",
    body: "HOLD is a real decision. On a satellite track, waiting for radar is how 1983 ended without war.",
  },
];

export function TutorialOverlay() {
  const world = useGame((s) => s.world);
  const step = useGame((s) => s.tutorialStep);
  const setStep = useGame((s) => s.setTutorialStep);
  const dismissTutorial = useGame((s) => s.dismissTutorial);

  useEffect(() => {
    if (!world || world.turn !== 1 || world.scenarioId) return;
    const s = loadSettings();
    if (!s.tutorialDone) setStep(0);
  }, [world?.turn, world?.scenarioId, setStep]);

  if (!world || world.turn !== 1 || world.scenarioId || loadSettings().tutorialDone || step < 0) return null;

  const current = STEPS[step];
  if (!current) return null;

  return (
    // The card used `glass-panel` with no scrim, so the Staff Split panel behind
    // it printed straight through the copy — the two texts collided mid-sentence
    // and neither was readable. An opaque surface plus a dimming backdrop fixes
    // the legibility; `role="dialog"` gives it the semantics it always needed.
    <div
      role="dialog"
      aria-modal="false"
      aria-label={current.title}
      className="fixed inset-x-0 top-[3.75rem] z-30 p-4 lg:top-auto lg:right-8 lg:bottom-8 lg:left-auto lg:max-w-sm"
    >
      <div className="rounded-xl border border-accent/40 bg-bg p-4 shadow-2xl">
        <p className="font-mono text-micro tracking-wider text-accent uppercase">
          First watch · {step + 1}/{STEPS.length}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-fg">{current.title}</h3>
        <p className="mt-2 text-sm text-muted">{current.body}</p>
        <div className="mt-4 flex gap-2">
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="hud-btn min-h-11 flex-1 bg-accent font-display text-xs tracking-wider text-accent-fg uppercase"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                updateSettings({ tutorialDone: true });
                dismissTutorial();
              }}
              className="hud-btn min-h-11 flex-1 bg-accent font-display text-xs tracking-wider text-accent-fg uppercase"
            >
              Begin watch
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              updateSettings({ tutorialDone: true });
              dismissTutorial();
            }}
            className={cn("min-h-11 px-3 font-display text-xs text-muted uppercase hover:text-fg")}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export function useKeyboardShortcuts() {
  const world = useGame((s) => s.world);
  const screen = useGame((s) => s.screen);
  const setKind = useGame((s) => s.setKind);
  const setIntensity = useGame((s) => s.setIntensity);
  const execute = useGame((s) => s.execute);
  const confirm = useGame((s) => s.confirmNuclear);

  useEffect(() => {
    if (!world || world.ended || (screen !== "play" && screen !== "war") || confirm) return;

    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (k === "h") {
        setKind("hold");
        e.preventDefault();
      } else if (k === "d") {
        setKind("diplomacy");
        e.preventDefault();
      } else if (k === "i") {
        setKind("intelligence");
        e.preventDefault();
      } else if (k === "p") {
        setKind("posture");
        e.preventDefault();
      } else if (k === "1" || k === "2" || k === "3") {
        setIntensity(Number(k) as 1 | 2 | 3);
        e.preventDefault();
      } else if (k === "enter" && e.shiftKey) {
        execute();
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [world, screen, confirm, setKind, setIntensity, execute]);
}

import { useEffect, useId, useState, type ChangeEvent, type MouseEvent } from "react";
import { loadSettings, saveSettings, type GameSettings } from "@/lib/game/settings";
import { setMuted } from "@/lib/game/audio";
import { cn } from "@/lib/utils";

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const titleId = useId();

  useEffect(() => {
    if (open) setSettings(loadSettings());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function patch(update: Partial<GameSettings>) {
    const next = { ...settings, ...update };
    setSettings(next);
    saveSettings(next);
    if ("muted" in update) setMuted(Boolean(update.muted));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="max-h-[min(86dvh,42rem)] w-full max-w-md overflow-y-auto rounded-xl bg-surface p-5 shadow-2xl ring-1 ring-border">
        <div className="flex items-center justify-between gap-3">
          <h2 id={titleId} className="font-display text-2xl tracking-wide text-fg">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-md bg-elevated px-4 font-display text-sm tracking-wider text-fg uppercase"
          >
            Close
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <Toggle label="Mute audio" checked={settings.muted} onChange={(value) => patch({ muted: value })} />
          <Toggle
            label="Reduce motion and pulses"
            checked={settings.reducedMotion}
            onChange={(value) => patch({ reducedMotion: value })}
          />
          <div>
            <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Forecast detail</p>
            <div className="mt-2 flex gap-2">
              {(["full", "summary"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => patch({ forecastDetail: mode })}
                  className={cn(
                    "min-h-12 flex-1 rounded-md font-display text-xs tracking-wider uppercase",
                    settings.forecastDetail === mode ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => patch({ tutorialDone: false })}
            className="min-h-12 w-full rounded-md bg-elevated font-display text-xs tracking-wider text-muted uppercase"
          >
            Reset first-watch tutorial
          </button>
          <p className="rounded-md bg-bg/70 p-3 text-xs leading-relaxed text-subtle">
            New crisis, public-health, contamination, machine, and continuity scenarios use abstract non-graphic language by default.
          </p>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-md bg-elevated px-3">
      <span className="text-sm text-fg">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)}
        className="size-5 accent-accent"
      />
    </label>
  );
}

import { useEffect, useState } from "react";
import { loadSettings, saveSettings, type GameSettings } from "@/lib/game/settings";
import { setMuted } from "@/lib/game/audio";
import { runIntegrityChecks, type IntegrityResult } from "@/lib/game/integrity";
import { cn } from "@/lib/utils";

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [s, setS] = useState<GameSettings>(() => loadSettings());
  const [probe, setProbe] = useState<IntegrityResult | null>(null);

  useEffect(() => {
    if (open) setS(loadSettings());
  }, [open]);

  if (!open) return null;

  function patch(p: Partial<GameSettings>) {
    const next = { ...s, ...p };
    setS(next);
    saveSettings(next);
    if ("muted" in p) setMuted(Boolean(p.muted));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-3 sm:items-center" role="dialog">
      <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide text-fg">Settings</h2>
          <button type="button" onClick={onClose} className="min-h-10 px-3 font-display text-sm text-muted uppercase">
            Close
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <Toggle label="Mute audio" checked={s.muted} onChange={(v) => patch({ muted: v })} />
          <Toggle label="Reduce motion" checked={s.reducedMotion} onChange={(v) => patch({ reducedMotion: v })} />
          <div>
            <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Forecast detail</p>
            <div className="mt-2 flex gap-2">
              {(["full", "summary"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => patch({ forecastDetail: mode })}
                  className={cn(
                    "min-h-10 flex-1 rounded-sm font-display text-xs tracking-wider uppercase",
                    s.forecastDetail === mode ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
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
            className="min-h-10 w-full rounded-sm bg-elevated font-display text-xs tracking-wider text-muted uppercase"
          >
            Reset first-watch tutorial
          </button>
          <button
            type="button"
            onClick={() => setProbe(runIntegrityChecks())}
            className="min-h-10 w-full rounded-sm bg-elevated font-display text-xs tracking-wider text-accent uppercase"
          >
            Run integrity check
          </button>
          {probe ? (
            <ul className="max-h-40 space-y-1 overflow-y-auto font-mono text-[10px]">
              <li className={probe.ok ? "text-olive" : "text-danger"}>{probe.ok ? "All checks passed" : "Faults found"}</li>
              {probe.checks.map((c) => (
                <li key={c.name} className={c.ok ? "text-muted" : "text-danger"}>
                  {c.ok ? "ok" : "fail"} {c.name} · {c.detail}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md bg-elevated px-3">
      <span className="text-sm text-fg">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-accent" />
    </label>
  );
}

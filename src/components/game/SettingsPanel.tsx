import { useEffect, useId, useState, type ChangeEvent } from "react";
import { loadSettings, saveSettings, type GameSettings } from "@/lib/game/settings";
import { setMuted } from "@/lib/game/audio";
import { runIntegrityChecks, type IntegrityResult } from "@/lib/game/integrity";
import { useGame } from "@/lib/game/store";
import { slotMeta } from "@/lib/game/slots";
import { HudButton, HudLabel, HudModalOverlay } from "./ui/Hud";

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [probe, setProbe] = useState<IntegrityResult | null>(null);
  const [exported, setExported] = useState(false);
  const titleId = useId();
  const world = useGame((st) => st.world);
  const saveSlot = useGame((st) => st.saveSlot);
  const saveToSlot = useGame((st) => st.saveToSlot);

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
    <HudModalOverlay label="Settings">
      <div className="flex items-center justify-between" id={titleId}>
        <h2 className="font-display text-2xl tracking-[0.12em] text-glow-accent text-fg uppercase">Settings</h2>
        <HudButton variant="ghost" className="min-h-12 px-4" onClick={onClose}>
          Close
        </HudButton>
      </div>
      <div className="mt-6 space-y-4">
        <Toggle label="Mute audio" checked={settings.muted} onChange={(value) => patch({ muted: value })} />
        <Toggle
          label="Reduce motion and pulses"
          checked={settings.reducedMotion}
          onChange={(value) => patch({ reducedMotion: value })}
        />
        <div>
          <HudLabel>Forecast detail</HudLabel>
          <div className="mt-2 flex gap-2">
            {(["full", "summary"] as const).map((mode) => (
              <HudButton
                key={mode}
                variant={settings.forecastDetail === mode ? "active" : "default"}
                className="min-h-12 flex-1 text-xs uppercase"
                onClick={() => patch({ forecastDetail: mode })}
              >
                {mode}
              </HudButton>
            ))}
          </div>
        </div>
        <HudButton variant="default" className="min-h-12 w-full text-xs uppercase" onClick={() => patch({ tutorialDone: false })}>
          Reset first-watch tutorial
        </HudButton>
        {world ? (
          <div>
            <HudLabel>Write watch to slot</HudLabel>
            <div className="mt-2 flex gap-2">
              {([0, 1, 2] as const).map((slot) => {
                const meta = slotMeta(slot);
                return (
                  <HudButton
                    key={slot}
                    variant={saveSlot === slot ? "active" : "default"}
                    className="min-h-12 flex-1 text-[11px] uppercase"
                    onClick={() => saveToSlot(slot)}
                  >
                    {slot + 1}
                    {meta ? ` T${meta.turn}` : ""}
                  </HudButton>
                );
              })}
            </div>
          </div>
        ) : null}
        {world ? (
          <HudButton
            variant="default"
            className="min-h-12 w-full text-xs uppercase"
            onClick={() => {
              try {
                void navigator.clipboard.writeText(
                  JSON.stringify(
                    {
                      turn: world.turn,
                      seat: world.playerId,
                      scenario: world.scenarioId,
                      recap: world.lastRecap,
                      event: world.event.title,
                    },
                    null,
                    2,
                  ),
                );
                setExported(true);
              } catch {
                setExported(false);
              }
            }}
          >
            {exported ? "Watch snapshot copied" : "Copy watch snapshot"}
          </HudButton>
        ) : null}
        <HudButton variant="accent" className="min-h-12 w-full text-xs uppercase" onClick={() => setProbe(runIntegrityChecks())}>
          Run integrity check
        </HudButton>
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
        <p className="rounded-md bg-bg/70 p-3 text-xs leading-relaxed text-subtle">
          New crisis, public-health, contamination, machine, and continuity scenarios use abstract non-graphic language by
          default.
        </p>
      </div>
    </HudModalOverlay>
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
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg glass-panel border border-accent/20 px-3">
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

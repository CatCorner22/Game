import { useEffect, useState } from "react";
import { loadSettings, saveSettings, type GameSettings } from "@/lib/game/settings";
import { setMuted } from "@/lib/game/audio";
import { runIntegrityChecks, type IntegrityResult } from "@/lib/game/integrity";
import { useGame } from "@/lib/game/store";
import { slotMeta } from "@/lib/game/slots";
import { HudButton, HudLabel, HudModalOverlay } from "./ui/Hud";

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [s, setS] = useState<GameSettings>(() => loadSettings());
  const [probe, setProbe] = useState<IntegrityResult | null>(null);
  const [exported, setExported] = useState(false);
  const world = useGame((st) => st.world);
  const saveSlot = useGame((st) => st.saveSlot);
  const saveToSlot = useGame((st) => st.saveToSlot);

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
    <HudModalOverlay>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-[0.12em] text-glow-accent text-fg uppercase">Settings</h2>
        <HudButton variant="ghost" onClick={onClose}>
          Close
        </HudButton>
      </div>
      <div className="mt-6 space-y-4">
        <Toggle label="Mute audio" checked={s.muted} onChange={(v) => patch({ muted: v })} />
        <Toggle label="Reduce motion" checked={s.reducedMotion} onChange={(v) => patch({ reducedMotion: v })} />
        <div>
          <HudLabel>Forecast detail</HudLabel>
          <div className="mt-2 flex gap-2">
            {(["full", "summary"] as const).map((mode) => (
              <HudButton
                key={mode}
                variant={s.forecastDetail === mode ? "active" : "default"}
                className="min-h-10 flex-1 text-xs uppercase"
                onClick={() => patch({ forecastDetail: mode })}
              >
                {mode}
              </HudButton>
            ))}
          </div>
        </div>
        <HudButton variant="default" className="min-h-10 w-full text-xs uppercase" onClick={() => patch({ tutorialDone: false })}>
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
                    className="min-h-11 flex-1 text-[11px] uppercase"
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
            className="min-h-10 w-full text-xs uppercase"
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
        <HudButton variant="accent" className="min-h-10 w-full text-xs uppercase" onClick={() => setProbe(runIntegrityChecks())}>
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
      </div>
    </HudModalOverlay>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg glass-panel border border-accent/20 px-3">
      <span className="text-sm text-fg">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-accent" />
    </label>
  );
}

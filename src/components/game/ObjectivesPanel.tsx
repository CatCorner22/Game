import type { World } from "@/lib/game/types";
import { seatObjectives } from "@/lib/game/objectives";
import { cn } from "@/lib/utils";
import { HudLabel, HudPanel } from "./ui/Hud";

export function ObjectivesPanel({ world }: { world: World }) {
  const objectives = seatObjectives(world);

  return (
    <section className="mt-4">
      <HudLabel>Mission · {world.intent.toUpperCase()}</HudLabel>
      <ul className="mt-2 space-y-2">
        {objectives.map((o) => (
          <li key={o.id}>
            <HudPanel
              glow={o.tone === "hazard" ? "danger" : "accent"}
              className={cn(o.met && (o.tone === "hazard" ? "neon-border-danger" : "neon-border-accent"))}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("text-xs text-fg", o.met && (o.tone === "hazard" ? "text-danger" : "text-olive"))}>
                  {o.label}
                </span>
                {o.met ? (
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-wider uppercase",
                      o.tone === "hazard" ? "text-danger" : "text-olive",
                    )}
                  >
                    {o.tone === "hazard" ? "Triggered" : "Met"}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "font-mono text-xs tabular",
                      o.tone === "hazard" ? "text-danger" : "text-accent",
                    )}
                  >
                    {Math.round(o.progress)}%
                  </span>
                )}
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface/60">
                <div
                  className={cn(
                    "h-1 rounded-full",
                    o.tone === "hazard" ? "bg-danger" : o.met ? "bg-olive" : "bg-accent glow-accent-sm",
                  )}
                  style={{ width: `${o.progress}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] leading-snug text-subtle">{o.detail}</p>
            </HudPanel>
          </li>
        ))}
      </ul>
    </section>
  );
}

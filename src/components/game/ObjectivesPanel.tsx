import type { World } from "@/lib/game/types";
import { seatObjectives } from "@/lib/game/objectives";
import { cn } from "@/lib/utils";

export function ObjectivesPanel({ world }: { world: World }) {
  const objectives = seatObjectives(world);

  return (
    <section className="mt-4">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
        Mission · {world.intent.toUpperCase()}
      </p>
      <ul className="mt-2 space-y-2">
        {objectives.map((o) => (
          <li key={o.id} className="rounded-md bg-elevated p-2.5 shadow-[var(--shadow-border)]">
            <div className="flex items-baseline justify-between gap-2">
              <span className={cn("text-xs text-fg", o.met && "text-olive")}>{o.label}</span>
              {o.met ? (
                <span className="font-mono text-[10px] tracking-wider text-olive uppercase">Met</span>
              ) : (
                <span className="font-mono text-xs tabular text-muted">{Math.round(o.progress)}%</span>
              )}
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-bg">
              <div
                className={cn("h-1 rounded-full", o.met ? "bg-olive" : "bg-accent")}
                style={{ width: `${o.progress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] leading-snug text-subtle">{o.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

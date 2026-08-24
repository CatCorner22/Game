import type { World } from "@/lib/game/types";
import { currentArc } from "@/lib/game/arcs";
import { cn } from "@/lib/utils";

/**
 * Where this watch is heading.
 *
 * A run used to be a sequence of independent evenings; an arc gives it a spine.
 * This is the only place the player sees it — a name, what the current beat is,
 * and how far through. Deliberately one strip rather than a panel: the arc is
 * context for everything else on screen, not another thing to read.
 *
 * Renders nothing when no arc is running, which is a normal state and not an
 * empty one. A placeholder saying "no arc" would be worse than the silence.
 */
export function ArcStrip({ world }: { world: World }) {
  const running = currentArc(world);
  if (!running) return null;
  const { arc, beat, index } = running;
  const total = arc.beats.length;

  return (
    <div className="mt-4 rounded-lg border border-warn/30 bg-warn/5 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-micro tracking-wider text-warn uppercase">Developing</p>
        <p className="font-mono text-micro text-subtle uppercase">
          beat {index + 1} of {total}
        </p>
      </div>
      <p className="mt-1 font-display text-sm tracking-wide text-fg">{arc.name}</p>
      <p className="mt-0.5 text-xs leading-snug text-muted">{beat.label}</p>
      <div className="mt-2 flex gap-1" aria-hidden>
        {arc.beats.map((b, i) => (
          <span
            key={b.label}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < index ? "bg-warn" : i === index ? "bg-warn/60" : "bg-border",
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-subtle">{arc.line}</p>
    </div>
  );
}

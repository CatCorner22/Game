import type { ActorId, Flashpoint, World } from "@/lib/game/types";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";
import { HudLabel } from "./ui/Hud";

function heatColor(heat: number) {
  if (heat >= 75) return "bg-danger";
  if (heat >= 50) return "bg-accent";
  if (heat >= 30) return "bg-olive";
  return "bg-subtle";
}

export function FlashpointBoard({ world }: { world: World }) {
  const select = useGame((s) => s.select);
  const sorted = [...world.flashpoints].sort((a, b) => b.heat - a.heat);

  function pickActor(fp: Flashpoint): ActorId {
    const playerInvolved = fp.actors.includes(world.playerId);
    if (playerInvolved) return world.playerId;
    return fp.actors[0]!;
  }

  return (
    <section className="mt-4">
      <HudLabel>Flashpoints</HudLabel>
      <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
        {sorted.map((fp) => (
          <li key={fp.id}>
            <button
              type="button"
              onClick={() => select(pickActor(fp))}
              className="glass-panel w-full rounded-lg p-2.5 text-left transition-all hover:neon-border-accent"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-sm tracking-wide text-fg">{fp.name}</span>
                <span className="font-mono text-xs tabular text-accent">{Math.round(fp.heat)}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface/60">
                <div className={cn("h-1 rounded-full", heatColor(fp.heat))} style={{ width: `${fp.heat}%` }} />
              </div>
              <p className="mt-1.5 text-micro leading-snug text-subtle">{fp.note}</p>
              <p className="mt-1 font-mono text-micro tracking-wider text-muted uppercase">{fp.actors.join(" · ")}</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Max heat any flashpoint assigns to an actor (for globe tint). */
export function actorFlashHeat(world: World, id: ActorId): number {
  return Math.max(0, ...world.flashpoints.filter((f) => f.actors.includes(id)).map((f) => f.heat));
}

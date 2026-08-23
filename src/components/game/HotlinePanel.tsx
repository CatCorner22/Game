import type { ActorId, World } from "@/lib/game/types";
import { hotlineBetween } from "@/lib/game/warning";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";
import { GlassPanel, HudLabel } from "./ui/Hud";

function playerHotlines(world: World) {
  const pid = world.playerId;
  return world.hotlines.filter((h) => h.a === pid || h.b === pid);
}

export function HotlinePanel({ world }: { world: World }) {
  const selected = useGame((s) => s.selected);
  const select = useGame((s) => s.select);
  const lines = playerHotlines(world);
  const toSelected = hotlineBetween(world, world.playerId, selected);
  const recent = [...world.notices].reverse().slice(0, 4);

  return (
    <section className="mt-4">
      <HudLabel>Hotlines & notices</HudLabel>
      {toSelected ? (
        <GlassPanel glow="accent" className="mt-2 rounded-lg p-2.5">
          <p className="font-mono text-micro tracking-wider text-accent uppercase">Selected target</p>
          <p className="mt-1 text-xs text-fg">{toSelected.name}</p>
          <p className="mt-0.5 font-mono text-micro text-muted">Reliability {toSelected.reliability}%</p>
        </GlassPanel>
      ) : (
        <p className="mt-2 text-xs text-subtle">No dedicated line to {selected}. Third party. Hours, not minutes.</p>
      )}
      <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto pr-1">
        {lines.map((h) => {
          const other: ActorId = h.a === world.playerId ? h.b : h.a;
          const active = other === selected;
          return (
            <li key={`${h.a}-${h.b}`}>
              <button
                type="button"
                onClick={() => select(other)}
                className={cn(
                  "w-full rounded-sm border px-2 py-1.5 text-left font-mono text-micro transition-colors",
                  active
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-transparent text-muted hover:border-accent/30 hover:text-fg",
                )}
              >
                <span className="tracking-wider uppercase">{world.actors[other].shortName}</span>
                <span className="ml-2 tabular">{h.reliability}%</span>
              </button>
            </li>
          );
        })}
      </ul>
      {recent.length ? (
        <div className="mt-3">
          <p className="font-mono text-micro tracking-wider text-muted uppercase">Launch notices on file</p>
          <ul className="mt-1 space-y-1">
            {recent.map((n, i) => (
              <li key={`${n.turn}-${n.actor}-${i}`} className="text-micro leading-snug text-subtle">
                {world.actors[n.actor].shortName}: {n.claimed} · {n.window}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

import type { World } from "@/lib/game/types";
import { hasPact } from "@/lib/game/pacts";
import { hasCeasefire } from "@/lib/game/ceasefire";

export function DiplomacyPanel({ world }: { world: World }) {
  const pacts = (world.pacts ?? []).filter((p) => !p.broken && p.untilTurn >= world.turn);
  const cf =
    world.ceasefire && !world.ceasefire.broken && world.ceasefire.accepted && world.ceasefire.untilTurn >= world.turn
      ? world.ceasefire
      : null;

  return (
    <div className="mt-4 rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">Diplomacy ledger</p>
      {cf ? (
        <p className="mt-2 text-xs text-accent">
          Ceasefire {world.actors[cf.a].shortName}–{world.actors[cf.b].shortName} until T{cf.untilTurn}. Summit renews.
          EMPLOY breaks it.
        </p>
      ) : world.nuclearUses.length > 0 ? (
        <p className="mt-2 text-xs text-subtle">No ceasefire on file. DIPLOMACY weight 3 after first use is the offer.</p>
      ) : (
        <p className="mt-2 text-xs text-subtle">No ceasefire. Summit (DIPLOMACY 3) writes a non-attack pact.</p>
      )}
      {pacts.length ? (
        <ul className="mt-2 space-y-1">
          {pacts.map((p) => (
            <li key={`${p.a}-${p.b}-${p.untilTurn}`} className="font-mono text-[10px] text-fg">
              Pact {world.actors[p.a].shortName}–{world.actors[p.b].shortName} · to T{p.untilTurn}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-[10px] text-subtle">No active non-attack pacts.</p>
      )}
    </div>
  );
}

export function pactHint(world: World, target: World["playerId"]): string | null {
  if (hasCeasefire(world, world.playerId, target)) return "Ceasefire on file with this capital.";
  if (hasPact(world, world.playerId, target)) return "Pact on file. Summit renews it.";
  return null;
}

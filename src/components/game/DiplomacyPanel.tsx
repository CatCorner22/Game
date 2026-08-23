import type { World } from "@/lib/game/types";
import { hasPact } from "@/lib/game/pacts";
import { hasCeasefire } from "@/lib/game/ceasefire";
import { HudChip, HudLabel, HudPanel } from "./ui/Hud";

export function DiplomacyPanel({ world }: { world: World }) {
  const pacts = (world.pacts ?? []).filter((p) => !p.broken && p.untilTurn >= world.turn);
  const treaties = world.treaties ?? [];
  const cf =
    world.ceasefire && !world.ceasefire.broken && world.ceasefire.accepted && world.ceasefire.untilTurn >= world.turn
      ? world.ceasefire
      : null;

  return (
    <HudPanel className="mt-4">
      <HudLabel>Diplomacy ledger</HudLabel>
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
      <HudLabel className="mt-3">Treaties</HudLabel>
      <ul className="mt-2 space-y-1.5">
        {treaties.map((t) => (
          <li key={t.id}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-fg">{t.name}</span>
              <HudChip danger={t.status === "dead" || t.status === "strained"} active={t.status === "in-force"}>
                {t.status}
              </HudChip>
            </div>
            <p className="text-[10px] leading-snug text-subtle">{t.note}</p>
          </li>
        ))}
      </ul>
    </HudPanel>
  );
}

export function pactHint(world: World, target: World["playerId"]): string | null {
  if (hasCeasefire(world, world.playerId, target)) return "Ceasefire on file with this capital.";
  if (hasPact(world, world.playerId, target)) return "Pact on file. Summit renews it.";
  return null;
}

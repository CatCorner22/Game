import type { World } from "@/lib/game/types";
import { c2StanceReady } from "@/lib/game/c2";
import { useGame } from "@/lib/game/store";
import { COMMAND, asPlayable } from "@/lib/game/command";
import { cn } from "@/lib/utils";
import { HudLabel, HudPanel } from "./ui/Hud";

export function C2Panel({ world }: { world: World }) {
  const applyC2 = useGame((s) => s.applyC2);
  const you = world.actors[world.playerId];
  const profile = COMMAND[asPlayable(world.playerId)];
  const ready = c2StanceReady(world);
  const nuclear = you.nuclear || you.hasDevice;

  return (
    <HudPanel className="mt-4">
      <HudLabel>C2 · {profile.satchel}</HudLabel>
      <p className="mt-1 text-xs text-subtle">
        {world.footballPresent ? "Bag on hip" : "NO BAG"} · {world.biscuitOnPerson === false ? "NO BISCUIT" : "biscuit"} ·{" "}
        {world.secondOfficer.stance}
        {profile.twoMan ? " · two-man" : " · sole authority"}
        {profile.perimeter ? " · fail-deadly" : ""}
      </p>
      {nuclear ? (
        <div className="mt-2 grid grid-cols-1 gap-1.5">
          <button
            type="button"
            disabled={!ready}
            onClick={() => applyC2("low")}
            className={cn(
              "min-h-11 rounded-sm border px-2 text-left font-display text-micro tracking-wider uppercase transition-colors disabled:opacity-40",
              you.launchOnWarning
                ? "border-danger/40 bg-danger/15 text-danger"
                : "border-accent/20 bg-surface/40 text-muted hover:border-accent/40",
            )}
          >
            LOW {you.launchOnWarning ? "armed" : "stood down"}
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => applyC2("nfu")}
            className={cn(
              "min-h-11 rounded-sm border px-2 text-left font-display text-micro tracking-wider uppercase transition-colors disabled:opacity-40",
              you.declaredNfu ? "border-olive/40 bg-olive/15 text-olive" : "border-accent/20 bg-surface/40 text-muted hover:border-accent/40",
            )}
          >
            NFU {you.declaredNfu ? "declared" : "ambiguous"}
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => applyC2("predel")}
            className={cn(
              "min-h-11 rounded-sm border px-2 text-left font-display text-micro tracking-wider uppercase transition-colors disabled:opacity-40",
              you.preDelegation
                ? "border-danger/40 bg-danger/15 text-danger"
                : "border-accent/20 bg-surface/40 text-muted hover:border-accent/40",
            )}
          >
            Pre-del {you.preDelegation ? "authorized" : "positive control"}
          </button>
          {!ready ? <p className="text-micro text-subtle">One C2 change this month.</p> : null}
        </div>
      ) : (
        <p className="mt-2 text-xs text-subtle">No nuclear C2 on this seat. The satchel is political.</p>
      )}
    </HudPanel>
  );
}

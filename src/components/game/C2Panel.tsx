import type { World } from "@/lib/game/types";
import { c2StanceReady } from "@/lib/game/c2";
import { useGame } from "@/lib/game/store";
import { COMMAND, asPlayable } from "@/lib/game/command";
import { cn } from "@/lib/utils";

export function C2Panel({ world }: { world: World }) {
  const applyC2 = useGame((s) => s.applyC2);
  const you = world.actors[world.playerId];
  const profile = COMMAND[asPlayable(world.playerId)];
  const ready = c2StanceReady(world);
  const nuclear = you.nuclear || you.hasDevice;

  return (
    <div className="mt-4 rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">C2 · {profile.satchel}</p>
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
              "min-h-10 rounded-sm px-2 text-left font-display text-[11px] tracking-wider uppercase disabled:opacity-40",
              you.launchOnWarning ? "bg-danger/20 text-danger" : "bg-bg text-muted",
            )}
          >
            LOW {you.launchOnWarning ? "armed" : "stood down"}
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => applyC2("nfu")}
            className={cn(
              "min-h-10 rounded-sm px-2 text-left font-display text-[11px] tracking-wider uppercase disabled:opacity-40",
              you.declaredNfu ? "bg-olive/20 text-olive" : "bg-bg text-muted",
            )}
          >
            NFU {you.declaredNfu ? "declared" : "ambiguous"}
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => applyC2("predel")}
            className={cn(
              "min-h-10 rounded-sm px-2 text-left font-display text-[11px] tracking-wider uppercase disabled:opacity-40",
              you.preDelegation ? "bg-danger/20 text-danger" : "bg-bg text-muted",
            )}
          >
            Pre-del {you.preDelegation ? "authorized" : "positive control"}
          </button>
          {!ready ? <p className="text-[10px] text-subtle">One C2 change this month.</p> : null}
        </div>
      ) : (
        <p className="mt-2 text-xs text-subtle">No nuclear C2 on this seat. The satchel is political.</p>
      )}
    </div>
  );
}

import type { World } from "@/lib/game/types";
import { patrolStatus } from "@/lib/game/patrols";
import { HudChip, HudLabel, HudPanel } from "./ui/Hud";

export function PatrolPanel({ world }: { world: World }) {
  const p = patrolStatus(world);
  return (
    <HudPanel className="mt-4">
      <HudLabel>Patrol / generate</HudLabel>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <HudChip active={p.generated}>{p.generated ? "GENERATED" : "QUIET"}</HudChip>
        <HudChip>
          At sea {p.atSea}/{p.boats || "—"}
        </HudChip>
        <HudChip danger={p.warning < 45}>WARN {Math.round(p.warning)}</HudChip>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-subtle">{p.casdLine}</p>
    </HudPanel>
  );
}

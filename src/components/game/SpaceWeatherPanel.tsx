import type { World } from "@/lib/game/types";
import { weatherHostile } from "@/lib/game/spaceWeather";
import { cn } from "@/lib/utils";
import { HudChip, HudLabel, HudPanel } from "./ui/Hud";

export function SpaceWeatherPanel({ world }: { world: World }) {
  const sw = world.spaceWeather;
  if (!sw) return null;
  const hot = weatherHostile(sw);
  const flare = sw.flare === "carrington" ? "CARRINGTON" : sw.flare === "quiet" ? "QUIET" : `${sw.flare}-CLASS`;

  return (
    <HudPanel className="mt-4" glow={hot ? "danger" : "none"}>
      <div className="flex items-center justify-between gap-2">
        <HudLabel>Space weather</HudLabel>
        <HudChip danger={hot} active={sw.flare !== "quiet"}>
          {flare}
        </HudChip>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px] text-fg">
        <span>Kp {sw.kp}</span>
        <span>
          CME{" "}
          {sw.cmeInbound
            ? sw.hoursToArrival != null
              ? `~${sw.hoursToArrival}h`
              : "inbound"
            : "none"}
        </span>
        <span className={cn(sw.gridStress >= 40 && "text-danger")}>Grid {Math.round(sw.gridStress)}</span>
        <span className={cn(sw.satStress >= 40 && "text-danger")}>Sats {Math.round(sw.satStress)}</span>
      </div>
      <p className="mt-2 text-xs leading-snug text-subtle">{sw.lastNote}</p>
      {hot ? (
        <p className="mt-1 text-[10px] leading-snug text-danger">
          Second phenomenology. INTEL the sun. KILL on yourself islands transformers. POSTURE reads as EMP.
        </p>
      ) : null}
    </HudPanel>
  );
}

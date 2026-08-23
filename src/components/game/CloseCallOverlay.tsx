import { useEffect } from "react";
import type { World } from "@/lib/game/types";
import { heartbeat, radarSweep, stinger } from "@/lib/game/audio";
import { loadSettings } from "@/lib/game/settings";
import { cn } from "@/lib/utils";
import { GlassPanel, HudLabel } from "./ui/Hud";

export function CloseCallOverlay({ world }: { world: World }) {
  const cc = world.closeCall;
  const reduced = loadSettings().reducedMotion;

  useEffect(() => {
    if (!cc) return;
    stinger("close-call");
    radarSweep();
    const tti = cc.track.minutesToImpact;
    if (tti <= 8) heartbeat(tti <= 4 ? "fast" : "slow");
  }, [cc?.track.minutesToImpact]);

  if (!cc) return null;

  const tti = cc.track.minutesToImpact;
  const urgent = tti <= 6;
  const anomalous = cc.track.kind === "anomalous";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-8",
        !reduced && urgent && "animate-pulse-glow",
      )}
    >
      <GlassPanel glow="danger" className="rounded-xl px-6 py-4 backdrop-blur-xl">
        <HudLabel className="text-danger">
          {anomalous ? "Close call · unverified return" : "Close call · inbound track"}
        </HudLabel>
        <p className="mt-2 font-display text-5xl tabular text-glow-danger text-fg">{tti}</p>
        <p className="font-mono text-xs tracking-wider text-muted uppercase">
          {anomalous ? "minutes to resolve phenomenology" : "minutes if real"}
        </p>
        <p className="mt-3 font-mono text-[10px] text-subtle uppercase">
          Confidence {cc.track.confidence}% · {cc.track.source}
        </p>
      </GlassPanel>
    </div>
  );
}

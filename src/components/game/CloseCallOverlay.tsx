import { useEffect } from "react";
import type { World } from "@/lib/game/types";
import { heartbeat, radarSweep, stinger } from "@/lib/game/audio";
import { loadSettings } from "@/lib/game/settings";
import { cn } from "@/lib/utils";

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

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-8",
        !reduced && urgent && "animate-pulse",
      )}
    >
      <div className="rounded-lg border border-danger bg-bg/90 px-6 py-4 shadow-[0_0_40px_rgb(180_35_24/0.35)]">
        <p className="font-mono text-[10px] tracking-[0.28em] text-danger uppercase">Close call · inbound track</p>
        <p className="mt-2 font-display text-5xl tabular text-fg">{tti}</p>
        <p className="font-mono text-xs tracking-wider text-muted uppercase">minutes if real</p>
        <p className="mt-3 font-mono text-[10px] text-subtle uppercase">
          Confidence {cc.track.confidence}% · {cc.track.source}
        </p>
      </div>
    </div>
  );
}

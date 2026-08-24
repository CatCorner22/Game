import { useEffect, useRef } from "react";
import type { World } from "@/lib/game/types";
import { heartbeat, radarSweep, stinger } from "@/lib/game/audio";
import { formatCountdown } from "@/lib/game/flight";
import { loadSettings } from "@/lib/game/settings";
import { cn } from "@/lib/utils";
import type { TrackClock } from "./useTrackClock";
import { GlassPanel, HudLabel } from "./ui/Hud";

export function CloseCallOverlay({ world, clock }: { world: World; clock?: TrackClock | null }) {
  const cc = world.closeCall;
  const reduced = loadSettings().reducedMotion;
  const heartbeatRef = useRef<string | null>(null);

  // Identity of the track, not its numbers. The stinger effect used to depend
  // on `minutesToImpact` directly, which was harmless while that value was
  // static but re-fires the audio on every tick once a live clock drives it.
  const trackKey = cc ? (clock?.key ?? `${cc.track.from}:${cc.track.kind}`) : null;
  useEffect(() => {
    if (!trackKey) return;
    stinger("close-call");
    radarSweep();
    heartbeatRef.current = null;
  }, [trackKey]);

  // The heartbeat escalates as the clock runs down, but only on threshold
  // crossings — once for "slow", once for "fast" — never once per tick.
  const minutesLeft = clock ? clock.minutesLeft : (cc?.track.minutesToImpact ?? 0);
  const heartbeatMode = minutesLeft <= 4 ? "fast" : minutesLeft <= 8 ? "slow" : "none";
  useEffect(() => {
    if (!trackKey || heartbeatMode === "none") return;
    if (heartbeatRef.current === heartbeatMode) return;
    heartbeatRef.current = heartbeatMode;
    heartbeat(heartbeatMode);
  }, [trackKey, heartbeatMode]);

  if (!cc) return null;

  const urgent = minutesLeft <= 6;
  const anomalous = cc.track.kind === "anomalous";
  const expired = Boolean(clock?.expired);

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
        <p className="mt-2 font-display text-5xl tabular text-glow-danger text-fg">
          {clock ? (expired ? "0:00" : formatCountdown(clock.remainingSec)) : `${cc.track.minutesToImpact}:00`}
        </p>
        <p className="font-mono text-xs tracking-wider text-muted uppercase">
          {expired
            ? anomalous
              ? "return faded · nothing corroborated"
              : "time to impact elapsed"
            : anomalous
              ? `${Math.ceil(minutesLeft)} min to resolve phenomenology`
              : `${Math.ceil(minutesLeft)} min if real`}
        </p>
        <p className="mt-3 font-mono text-micro text-subtle uppercase">
          Confidence {cc.track.confidence}% · {cc.track.source}
        </p>
      </GlassPanel>
    </div>
  );
}

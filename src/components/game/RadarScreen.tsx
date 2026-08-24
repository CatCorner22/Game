import { useEffect, useRef } from "react";
import type { Actor, World } from "@/lib/game/types";
import { alongTrack, bearingDeg, distanceKm, fmtBearing, fmtLatLon } from "@/lib/game/geo";
import { flightProfile, formatCountdown, isMaritimeAzimuth } from "@/lib/game/flight";
import type { TrackClock } from "./useTrackClock";

const MAX_KM = 14000;

type Track = {
  id: string;
  label: string;
  from: Actor;
  to: Actor;
  boosts: number;
  source: string;
  confidence: number;
  ttiMin: number;
  /** Flight profile label, e.g. "ICBM · minimum-energy". */
  profile: string;
  /**
   * 0..1 along the arc when the sim already knows it (missiles in flight).
   * Null on the close-call track, which is driven by the live wall clock.
   */
  progress: number | null;
  confirmed: boolean;
  kind: string;
};

function tracksOf(world: World): Track[] {
  const you = world.actors[world.playerId];
  const out: Track[] = [];
  if (world.closeCall) {
    const t = world.closeCall.track;
    const from = world.actors[t.from];
    const km = distanceKm(you.lat, you.lon, from.lat, from.lon);
    out.push({
      id: "cc",
      label: t.kind === "attack" ? "INBOUND" : t.kind === "anomalous" ? "ANOMALOUS" : t.kind.toUpperCase(),
      from,
      to: you,
      boosts: t.boosts,
      source: t.source,
      confidence: t.confidence,
      ttiMin: t.minutesToImpact,
      profile:
        t.kind === "anomalous" ? "unresolved phenomenology" : flightProfile(km, isMaritimeAzimuth(t.azimuth)).label,
      progress: null,
      confirmed: t.real && t.kind === "attack",
      kind: t.kind,
    });
  }
  for (const m of world.missiles) {
    const from = world.actors[m.from];
    const to = world.actors[m.to];
    if (!from || !to) continue;
    // The nominal flight for this geometry, rather than the flat 22 minutes
    // every missile used to report regardless of where it came from.
    const nominal = flightProfile(distanceKm(from.lat, from.lon, to.lat, to.lon)).hi;
    out.push({
      id: m.id,
      label: m.kind === "detonation" ? "DET" : "TRACK",
      from,
      to,
      boosts: 1,
      source: "force report",
      confidence: 92,
      ttiMin: Math.max(1, Math.round((1 - m.progress) * nominal)),
      profile: flightProfile(distanceKm(from.lat, from.lon, to.lat, to.lon)).label,
      progress: m.progress,
      confirmed: true,
      kind: "missile",
    });
  }
  return out;
}

function polar(cx: number, cy: number, km: number, bearing: number, rMax: number) {
  const r = Math.min(km / MAX_KM, 1) * rMax;
  const rad = ((bearing - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function RadarScreen({ world, pulse, clock }: { world: World; pulse?: boolean; clock?: TrackClock | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tracks = tracksOf(world);
  const you = world.actors[world.playerId];
  const live = tracks[0] ?? null;

  // The clock ticks ~8x/second. Feeding it through effect deps would tear down
  // and restart the animation frame loop every tick, so the loop reads it off a
  // ref that render keeps current instead.
  const clockRef = useRef<TrackClock | null | undefined>(clock);
  clockRef.current = clock;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const t0 = performance.now();

    const draw = (now: number) => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 + 4;
      const rMax = Math.min(w, h) * 0.42;
      const sweep = ((now - t0) / (pulse ? 1200 : 2800)) % 1;
      const sweepAng = sweep * Math.PI * 2;

      ctx.fillStyle = "#020a14";
      ctx.beginPath();
      ctx.arc(cx, cy, rMax + 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 229, 255, 0.22)";
      ctx.lineWidth = 1;
      for (const ring of [0.25, 0.5, 0.75, 1]) {
        ctx.beginPath();
        ctx.arc(cx, cy, rMax * ring, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - rMax, cy);
      ctx.lineTo(cx + rMax, cy);
      ctx.moveTo(cx, cy - rMax);
      ctx.lineTo(cx, cy + rMax);
      ctx.stroke();

      ctx.fillStyle = "rgba(0, 229, 255, 0.55)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("N", cx - 3, cy - rMax - 4);
      ctx.fillText(`${MAX_KM / 4}km`, cx + 4, cy - rMax * 0.25 + 3);
      ctx.fillText(`${MAX_KM / 2}km`, cx + 4, cy - rMax * 0.5 + 3);

      const grd = ctx.createConicGradient(sweepAng - Math.PI / 2, cx, cy);
      grd.addColorStop(0, "rgba(0, 229, 255, 0.28)");
      grd.addColorStop(0.12, "rgba(0, 229, 255, 0.0)");
      grd.addColorStop(1, "rgba(0, 229, 255, 0.0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, rMax, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 229, 255, 0.85)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAng - Math.PI / 2) * rMax, cy + Math.sin(sweepAng - Math.PI / 2) * rMax);
      ctx.stroke();

      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      for (const tr of tracks) {
        const originKm = distanceKm(you.lat, you.lon, tr.from.lat, tr.from.lon);
        const destKm = distanceKm(you.lat, you.lon, tr.to.lat, tr.to.lon);
        const bFrom = bearingDeg(you.lat, you.lon, tr.from.lat, tr.from.lon);
        const bTo = bearingDeg(you.lat, you.lon, tr.to.lat, tr.to.lon);
        // The close-call track rides the real countdown; missiles ride the
        // progress the sim already gave them. Neither loops decoratively any
        // more — the marker actually reaches the target when the clock runs out.
        const frac = tr.progress ?? clockRef.current?.fraction ?? 0;
        const pos = alongTrack(tr.from.lat, tr.from.lon, tr.to.lat, tr.to.lon, Math.min(1, frac));
        const hereKm = distanceKm(you.lat, you.lon, pos.lat, pos.lon);
        const hereB = bearingDeg(you.lat, you.lon, pos.lat, pos.lon);

        ctx.strokeStyle = tr.confirmed ? "rgba(255, 51, 102, 0.75)" : "rgba(0, 229, 255, 0.55)";
        ctx.setLineDash(tr.confirmed ? [] : tr.kind === "anomalous" ? [2, 6] : [4, 4]);
        ctx.beginPath();
        const steps = 18;
        for (let i = 0; i <= steps; i++) {
          const p = alongTrack(tr.from.lat, tr.from.lon, tr.to.lat, tr.to.lon, i / steps);
          const km = distanceKm(you.lat, you.lon, p.lat, p.lon);
          const b = bearingDeg(you.lat, you.lon, p.lat, p.lon);
          const xy = polar(cx, cy, km, b, rMax);
          if (i === 0) ctx.moveTo(xy.x, xy.y);
          else ctx.lineTo(xy.x, xy.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        const o = polar(cx, cy, originKm, bFrom, rMax);
        const d = polar(cx, cy, destKm, bTo, rMax);
        const cur = polar(cx, cy, hereKm, hereB, rMax);

        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.arc(o.x, o.y, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#f2495f";
        ctx.beginPath();
        ctx.moveTo(d.x - 5, d.y - 5);
        ctx.lineTo(d.x + 5, d.y + 5);
        ctx.moveTo(d.x + 5, d.y - 5);
        ctx.lineTo(d.x - 5, d.y + 5);
        ctx.stroke();

        const blip = 2.4 + Math.sin(now / 180) * 1.2;
        ctx.fillStyle = tr.confirmed ? "#f2495f" : "#22d3ee";
        for (let i = 0; i < Math.min(tr.boosts, 6); i++) {
          ctx.beginPath();
          ctx.arc(cur.x + i * 3.5 - 4, cur.y, blip, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "rgba(200, 240, 255, 0.9)";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText(tr.from.shortName, o.x + 6, o.y - 4);
        ctx.fillText(tr.to.shortName, d.x + 6, d.y + 10);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
    // `pulse` was missing here and the loop closed over a stale value, so the
    // sweep never sped up when DEFCON dropped.
  }, [world.turn, world.closeCall, world.missiles, world.playerId, pulse]);

  return (
    <div className="pointer-events-none flex flex-col overflow-hidden rounded-lg glass-panel neon-border-accent">
      <div className="flex items-center justify-between px-2 py-1">
        <p className="font-mono text-micro tracking-[0.2em] text-accent uppercase">
          {live ? live.source : you.warning >= 70 ? "SBIRS / BMEWS" : "national technical means"}
        </p>
        <p className="font-mono text-micro tracking-[0.16em] text-accent/80 uppercase">
          {live ? "LIVE TRACK" : "SCOPE QUIET"}
        </p>
      </div>
      <div ref={wrapRef} className="relative h-[220px] w-full sm:h-[240px]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
      <TrackReadout world={world} tracks={tracks} you={you} clock={clock} />
    </div>
  );
}

function TrackReadout({
  world,
  tracks,
  you,
  clock,
}: {
  world: World;
  tracks: Track[];
  you: Actor;
  clock?: TrackClock | null;
}) {
  const live = tracks[0];
  if (!live) {
    return (
      <p className="px-2 pb-2 font-mono text-micro leading-relaxed text-muted">
        Center {you.shortName} {fmtLatLon(you.lat, you.lon)}. No boosts. Sweep is infrared + radar fusion.
      </p>
    );
  }
  const km = distanceKm(live.from.lat, live.from.lon, live.to.lat, live.to.lon);
  const brg = bearingDeg(you.lat, you.lon, live.from.lat, live.from.lon);
  // Live where a clock is running on this track; the static budget otherwise.
  const tti =
    live.progress === null && clock
      ? clock.expired
        ? "IMPACT"
        : `${formatCountdown(clock.remainingSec)} · ${Math.ceil(clock.minutesLeft)} min`
      : `~${live.ttiMin} min`;
  return (
    <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 px-2 pb-2 font-mono text-micro uppercase text-muted">
      <Row k="Origin" v={`${live.from.shortName} ${fmtLatLon(live.from.lat, live.from.lon)}`} />
      <Row k="Impact" v={`${live.to.shortName} ${fmtLatLon(live.to.lat, live.to.lon)}`} />
      <Row k="Azimuth" v={`${fmtBearing(brg)} · ${Math.round(km)} km`} />
      <Row k="Profile" v={live.profile} />
      <Row k="TTI" v={tti} />
      <Row k="Boosts" v={String(live.boosts)} />
      <Row k="Conf" v={`${live.confidence}% ${live.kind}`} />
      {world.closeCall?.track.notified ? <Row k="Notice" v="on file" /> : <Row k="Notice" v="none" />}
      {world.closeCall?.humint ? <Row k="HUMINT" v={world.closeCall.humint.slice(0, 42)} /> : null}
    </dl>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-subtle">{k}</dt>
      <dd className="truncate text-right text-fg">{v}</dd>
    </>
  );
}

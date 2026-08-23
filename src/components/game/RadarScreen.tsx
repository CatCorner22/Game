import { useEffect, useRef } from "react";
import type { Actor, ActorId, World } from "@/lib/game/types";
import { alongTrack, bearingDeg, distanceKm, fmtBearing, fmtLatLon } from "@/lib/game/geo";

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
  confirmed: boolean;
  kind: string;
};

function tracksOf(world: World): Track[] {
  const you = world.actors[world.playerId];
  const out: Track[] = [];
  if (world.closeCall) {
    const t = world.closeCall.track;
    const from = world.actors[t.from];
    out.push({
      id: "cc",
      label: t.kind === "attack" ? "INBOUND" : t.kind.toUpperCase(),
      from,
      to: you,
      boosts: t.boosts,
      source: t.source,
      confidence: t.confidence,
      ttiMin: t.minutesToImpact,
      confirmed: t.real && t.kind === "attack",
      kind: t.kind,
    });
  }
  for (const m of world.missiles) {
    const from = world.actors[m.from];
    const to = world.actors[m.to];
    if (!from || !to) continue;
    out.push({
      id: m.id,
      label: m.kind === "detonation" ? "DET" : "TRACK",
      from,
      to,
      boosts: 1,
      source: "force report",
      confidence: 92,
      ttiMin: Math.max(1, Math.round((1 - m.progress) * 22)),
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

export function RadarScreen({ world }: { world: World }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tracks = tracksOf(world);
  const you = world.actors[world.playerId];
  const live = tracks[0] ?? null;

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
      const sweep = ((now - t0) / 2800) % 1;
      const sweepAng = sweep * Math.PI * 2;

      ctx.fillStyle = "#030805";
      ctx.beginPath();
      ctx.arc(cx, cy, rMax + 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(90, 180, 90, 0.22)";
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

      ctx.fillStyle = "rgba(110, 190, 110, 0.55)";
      ctx.font = "9px 'IBM Plex Mono', monospace";
      ctx.fillText("N", cx - 3, cy - rMax - 4);
      ctx.fillText(`${MAX_KM / 4}km`, cx + 4, cy - rMax * 0.25 + 3);
      ctx.fillText(`${MAX_KM / 2}km`, cx + 4, cy - rMax * 0.5 + 3);

      const grd = ctx.createConicGradient(sweepAng - Math.PI / 2, cx, cy);
      grd.addColorStop(0, "rgba(80, 220, 90, 0.28)");
      grd.addColorStop(0.12, "rgba(80, 220, 90, 0.0)");
      grd.addColorStop(1, "rgba(80, 220, 90, 0.0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, rMax, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(140, 255, 140, 0.85)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAng - Math.PI / 2) * rMax, cy + Math.sin(sweepAng - Math.PI / 2) * rMax);
      ctx.stroke();

      ctx.fillStyle = "#c4a35a";
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      const elapsed = (now - t0) / 1000;

      for (const tr of tracks) {
        const originKm = distanceKm(you.lat, you.lon, tr.from.lat, tr.from.lon);
        const destKm = distanceKm(you.lat, you.lon, tr.to.lat, tr.to.lon);
        const bFrom = bearingDeg(you.lat, you.lon, tr.from.lat, tr.from.lon);
        const bTo = bearingDeg(you.lat, you.lon, tr.to.lat, tr.to.lon);
        const duration = Math.max(8, tr.ttiMin * 0.55);
        const frac = Math.min(0.92, (elapsed % (duration + 4)) / duration);
        const pos = alongTrack(tr.from.lat, tr.from.lon, tr.to.lat, tr.to.lon, frac);
        const hereKm = distanceKm(you.lat, you.lon, pos.lat, pos.lon);
        const hereB = bearingDeg(you.lat, you.lon, pos.lat, pos.lon);

        ctx.strokeStyle = tr.confirmed ? "rgba(180, 35, 24, 0.75)" : "rgba(196, 163, 90, 0.7)";
        ctx.setLineDash(tr.confirmed ? [] : [4, 4]);
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

        ctx.fillStyle = "#c4a35a";
        ctx.beginPath();
        ctx.arc(o.x, o.y, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#b42318";
        ctx.beginPath();
        ctx.moveTo(d.x - 5, d.y - 5);
        ctx.lineTo(d.x + 5, d.y + 5);
        ctx.moveTo(d.x + 5, d.y - 5);
        ctx.lineTo(d.x - 5, d.y + 5);
        ctx.stroke();

        const pulse = 2.4 + Math.sin(now / 180) * 1.2;
        ctx.fillStyle = tr.confirmed ? "#b42318" : "#d4c070";
        for (let i = 0; i < Math.min(tr.boosts, 6); i++) {
          ctx.beginPath();
          ctx.arc(cur.x + i * 3.5 - 4, cur.y, pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "rgba(200, 255, 200, 0.9)";
        ctx.font = "9px 'IBM Plex Mono', monospace";
        ctx.fillText(tr.from.shortName, o.x + 6, o.y - 4);
        ctx.fillText(tr.to.shortName, d.x + 6, d.y + 10);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [world.turn, world.closeCall, world.missiles, world.playerId]);

  return (
    <div className="pointer-events-none flex flex-col overflow-hidden rounded-md bg-[#070b07] shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between px-2 py-1">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#6baf6b] uppercase">
          {live ? live.source : you.warning >= 70 ? "SBIRS / BMEWS" : "national technical means"}
        </p>
        <p className="font-mono text-[10px] tracking-[0.16em] text-[#c4a35a] uppercase">
          {live ? "LIVE TRACK" : "SCOPE QUIET"}
        </p>
      </div>
      <div ref={wrapRef} className="relative h-[220px] w-full sm:h-[240px]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
      <TrackReadout world={world} tracks={tracks} you={you} />
    </div>
  );
}

function TrackReadout({ world, tracks, you }: { world: World; tracks: Track[]; you: Actor }) {
  const live = tracks[0];
  if (!live) {
    return (
      <p className="px-2 pb-2 font-mono text-[10px] leading-relaxed text-[#5c7a5c]">
        Center {you.shortName} {fmtLatLon(you.lat, you.lon)}. No boosts. Sweep is infrared + radar fusion.
      </p>
    );
  }
  const km = distanceKm(live.from.lat, live.from.lon, live.to.lat, live.to.lon);
  const brg = bearingDeg(you.lat, you.lon, live.from.lat, live.from.lon);
  const remaining = live.ttiMin;
  return (
    <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 px-2 pb-2 font-mono text-[10px] uppercase text-[#8fbf8f]">
      <Row k="Origin" v={`${live.from.shortName} ${fmtLatLon(live.from.lat, live.from.lon)}`} />
      <Row k="Impact" v={`${live.to.shortName} ${fmtLatLon(live.to.lat, live.to.lon)}`} />
      <Row k="Azimuth" v={`${fmtBearing(brg)} · ${Math.round(km)} km`} />
      <Row k="TTI" v={`~${remaining} min`} />
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
      <dt className="text-[#5c7a5c]">{k}</dt>
      <dd className="truncate text-right text-[#d4edd4]">{v}</dd>
    </>
  );
}

export function radarHasTracks(world: World) {
  return Boolean(world.closeCall) || world.missiles.length > 0;
}

export function ownerOf(_id: ActorId) {
  return _id;
}

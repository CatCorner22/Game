import { useState } from "react";
import { useGame, resetToTitle } from "@/lib/game/store";
import { clearSave } from "@/lib/game/save";
import { fmtNum } from "@/lib/game/geo";
import { meters } from "@/lib/game/world";
import { letterGrade } from "@/lib/game/stats";
import { encodeReplay } from "@/lib/game/replay";

export function EndScreen() {
  const world = useGame((s) => s.world);
  const [copied, setCopied] = useState(false);
  const [timelineIdx, setTimelineIdx] = useState(0);
  if (!world?.ending) return null;
  const e = world.ending;
  const m = meters(world);
  const grade = letterGrade(e.score, world.intent, world.firstUse, world.playerId);
  const replayCode = encodeReplay(world);
  const timeline = [...world.log].reverse();

  async function copyReplay() {
    try {
      await navigator.clipboard.writeText(replayCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-12">
      <p className="font-mono text-xs tracking-[0.28em] text-accent uppercase">Watch closed</p>
      <div className="mt-3 flex items-end gap-4">
        <h1 className="font-display text-5xl font-semibold tracking-wide text-fg">{e.title}</h1>
        <span className="font-display text-4xl text-accent">{grade}</span>
      </div>
      <p className="mt-6 text-base leading-relaxed text-muted">{e.body}</p>
      <dl className="mt-8 space-y-2">
        <Row k="Score" v={String(Math.round(e.score))} />
        <Row k="Grade" v={grade} />
        <Row k="Seat" v={`${world.playerId} · ${world.intent}`} />
        <Row k="ALERT" v={String(m.defcon)} />
        <Row k="Global risk" v={String(Math.round(m.risk))} />
        <Row k="Winter" v={String(Math.round(m.winter))} />
        <Row k="Your dead" v={fmtNum(world.playerCasualties)} />
        <Row k="World dead" v={fmtNum(world.worldCasualties)} />
        <Row k="Nuclear uses" v={String(world.nuclearUses.length)} />
        <Row k="First use" v={world.firstUse ?? "none"} />
        <Row k="Uncontrolled" v={world.uncontrolled ? "yes" : "no"} />
      </dl>

      <div className="mt-8 rounded-md bg-elevated p-4 shadow-[var(--shadow-border)]">
        <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Timeline</p>
        <input
          type="range"
          min={0}
          max={Math.max(0, timeline.length - 1)}
          value={timelineIdx}
          onChange={(ev) => setTimelineIdx(Number(ev.target.value))}
          className="mt-3 w-full accent-accent"
        />
        {timeline[timelineIdx] ? (
          <div className="mt-3">
            <p className="font-mono text-[10px] text-muted">
              {timeline[timelineIdx].date} · turn {timeline[timelineIdx].turn}
            </p>
            <p className="mt-1 text-sm text-fg">{timeline[timelineIdx].text}</p>
            <p className="mt-2 text-xs text-subtle">{timeline[timelineIdx].why}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => void copyReplay()}
          className="min-h-11 w-full rounded-md bg-elevated font-display text-xs tracking-wider text-accent uppercase shadow-[var(--shadow-border)]"
        >
          {copied ? "Replay code copied" : "Copy replay code"}
        </button>
        <p className="mt-2 break-all font-mono text-[9px] text-subtle">{replayCode.slice(0, 48)}…</p>
      </div>

      <div className="mt-10 flex gap-3">
        <button
          onClick={() => {
            clearSave();
            resetToTitle();
          }}
          className="min-h-12 rounded-md bg-accent px-5 font-display tracking-[0.18em] text-accent-fg uppercase"
        >
          New watch
        </button>
        <button
          onClick={() => resetToTitle()}
          className="min-h-12 px-3 font-display tracking-[0.18em] text-muted uppercase"
        >
          Menu
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <dt className="text-xs tracking-wide text-muted uppercase">{k}</dt>
      <dd className="font-mono text-sm text-fg tabular">{v}</dd>
    </div>
  );
}

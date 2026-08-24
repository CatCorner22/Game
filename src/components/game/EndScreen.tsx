import { useState } from "react";
import { useGame, resetToTitle } from "@/lib/game/store";
import { clearSave } from "@/lib/game/save";
import { fmtNum } from "@/lib/game/geo";
import { meters } from "@/lib/game/world";
import { isWin, letterGrade } from "@/lib/game/stats";
import { defeatOf, victoryOf } from "@/lib/game/mandate";
import { encodeReplay } from "@/lib/game/replay";
import { GlassPanel, HudButton, HudChip, HudLabel, HudPanel, HudRow } from "./ui/Hud";

export function EndScreen() {
  const world = useGame((s) => s.world);
  const startReplay = useGame((s) => s.startReplay);
  const [copied, setCopied] = useState(false);
  const [timelineIdx, setTimelineIdx] = useState(0);
  if (!world?.ending) return null;
  const e = world.ending;
  const m = meters(world);
  const grade = letterGrade(e.score, world.intent, world.firstUse, world.playerId);
  const replayCode = encodeReplay(world);
  const timeline = [...world.log].reverse();
  const won = isWin(e.kind);
  const mandate = world.mandate;
  const mandateCond = mandate?.resolved === "victory" ? victoryOf(world) : mandate?.resolved === "defeat" ? defeatOf(world) : undefined;

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
      <div className="flex flex-wrap items-center gap-2">
        <HudChip active={won} danger={!won}>
          {won ? "Victory" : "Defeat"}
        </HudChip>
        <HudChip>Watch closed</HudChip>
      </div>
      <div className="mt-3 flex items-end gap-4">
        <h1 className="font-display text-5xl font-semibold tracking-wide text-glow-accent text-fg">{e.title}</h1>
        <span className="font-display text-4xl text-accent glow-accent-sm">{grade}</span>
      </div>
      <p className="mt-6 text-base leading-relaxed text-muted">{e.body}</p>
      <GlassPanel glow="accent" className="mt-8 rounded-xl p-4">
        <dl className="space-y-2">
          <HudRow k="Score" v={String(Math.round(e.score))} />
          <HudRow k="Grade" v={grade} />
          <HudRow k="Seat" v={`${world.playerId} · ${world.intent}`} />
          <HudRow k="ALERT" v={String(m.defcon)} />
          <HudRow k="Global risk" v={String(Math.round(m.risk))} />
          <HudRow k="Winter" v={String(Math.round(m.winter))} />
          <HudRow k="Your dead" v={fmtNum(world.playerCasualties)} />
          <HudRow k="World dead" v={fmtNum(world.worldCasualties)} />
          <HudRow k="Nuclear uses" v={String(world.nuclearUses.length)} />
          <HudRow k="First use" v={world.firstUse ?? "none"} />
          <HudRow k="Uncontrolled" v={world.uncontrolled ? "yes" : "no"} />
          {mandateCond ? (
            <HudRow k={mandate?.resolved === "victory" ? "Mandate met" : "Loss point"} v={mandateCond.label} />
          ) : null}
        </dl>
      </GlassPanel>

      <HudPanel className="mt-8">
        <HudLabel>Timeline</HudLabel>
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
            <p className="font-mono text-micro text-muted">
              {timeline[timelineIdx].date} · turn {timeline[timelineIdx].turn}
            </p>
            <p className="mt-1 text-sm text-fg">{timeline[timelineIdx].text}</p>
            <p className="mt-2 text-xs text-subtle">{timeline[timelineIdx].why}</p>
          </div>
        ) : null}
      </HudPanel>

      <div className="mt-6">
        <HudButton variant="accent" className="min-h-11 w-full text-xs uppercase" onClick={() => void copyReplay()}>
          {copied ? "Replay code copied" : "Copy replay code"}
        </HudButton>
        <p className="mt-2 break-all font-mono text-micro text-subtle">{replayCode.slice(0, 48)}…</p>
        <HudButton variant="ghost" className="mt-2 min-h-11 w-full text-xs uppercase" onClick={() => startReplay(replayCode)}>
          Watch this replay
        </HudButton>
      </div>

      <div className="mt-10 flex gap-3">
        <HudButton
          variant="active"
          className="min-h-12 px-5 tracking-[0.18em] uppercase"
          onClick={() => {
            clearSave();
            resetToTitle();
          }}
        >
          New watch
        </HudButton>
        <HudButton variant="ghost" className="min-h-12 px-3 tracking-[0.18em] uppercase" onClick={() => resetToTitle()}>
          Menu
        </HudButton>
      </div>
    </div>
  );
}



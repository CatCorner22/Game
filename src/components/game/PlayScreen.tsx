import { useEffect, useState, type ComponentType } from "react";
import type { GlobeCanvasProps } from "./GlobeCanvas";
import { IntelPanel } from "./IntelPanel";
import { ActionPanel, NuclearConfirm } from "./ActionPanel";
import { RadarScreen } from "./RadarScreen";
import { resetToTitle, useGame } from "@/lib/game/store";
import { dateLabel, meters } from "@/lib/game/world";
import { METER_HELP } from "@/lib/game/copy";
import { cn } from "@/lib/utils";
import { winterLabel } from "@/lib/game/warning";
import { COMMAND, asPlayable, stanceLine } from "@/lib/game/command";
import { fusionName } from "@/lib/game/terminator";

function Meter({
  label,
  value,
  max,
  invert,
  help,
}: {
  label: string;
  value: number;
  max: number;
  invert?: boolean;
  help: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const hot = label === "ALERT" ? value <= 2 : invert ? pct > 55 : pct < 40;
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs tracking-[0.18em] text-muted uppercase">{label}</span>
        <span className={cn("font-mono text-sm tabular", hot ? "text-danger" : "text-fg")}>
          {label === "ALERT" ? value : Math.round(value)}
        </span>
      </div>
      <div className="mt-1 h-1 rounded-full bg-elevated">
        <div
          className={cn("h-1 rounded-full", hot ? "bg-danger" : "bg-accent")}
          style={{ width: `${label === "ALERT" ? ((5 - value) / 4) * 100 : pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs leading-snug text-subtle">{help}</p>
    </div>
  );
}

function GlobeSlot() {
  const world = useGame((s) => s.world);
  const selected = useGame((s) => s.selected);
  const select = useGame((s) => s.select);
  const [Comp, setComp] = useState<ComponentType<GlobeCanvasProps> | null>(null);
  useEffect(() => {
    void import("./GlobeCanvas").then((m) => setComp(() => m.GlobeCanvas));
  }, []);
  if (!world) return null;
  if (!Comp) return <div className="h-full min-h-[240px] bg-bg" />;
  return (
    <Comp
      actors={world.actors}
      selected={selected}
      onSelect={select}
      missiles={world.missiles}
      sites={world.sites ?? []}
    />
  );
}

export function PlayScreen() {
  const world = useGame((s) => s.world);
  const tab = useGame((s) => s.mobileTab);
  const setTab = useGame((s) => s.setTab);
  const confirm = useGame((s) => s.confirmNuclear);
  const whyId = useGame((s) => s.whyId);
  const setWhy = useGame((s) => s.setWhy);
  const setScreen = useGame((s) => s.setScreen);
  const selected = useGame((s) => s.selected);
  if (!world) return null;
  const m = meters(world);
  const why = world.log.find((l) => l.id === whyId) ?? world.log[0];
  const c2 = COMMAND[asPlayable(world.playerId)];

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex h-14 items-center justify-between gap-3 border-b border-border px-4">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg tracking-[0.2em] text-fg">THRESHOLD</span>
          <span className="hidden font-mono text-xs tracking-[0.18em] text-muted uppercase sm:inline">
            {dateLabel(world)} · {world.phase} · {world.actors[world.playerId].name} {world.intent}
            {world.terminator ? " · TERMINATOR" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-accent tabular">
            ALERT {world.defcon}
          </span>
          <span
            className={cn(
              "hidden font-mono text-[10px] tracking-wider uppercase sm:inline",
              world.footballPresent ? "text-muted" : "text-danger",
            )}
          >
            {world.footballPresent ? "AIDE + BAG" : "NO BAG"}
          </span>
          <span
            className={cn(
              "hidden font-mono text-[10px] tracking-wider uppercase sm:inline",
              world.biscuitOnPerson === false ? "text-danger" : "text-muted",
            )}
          >
            {world.biscuitOnPerson === false ? "NO BISCUIT" : "BISCUIT"}
          </span>
          <span className={cn("hidden font-mono text-[10px] tracking-wider uppercase sm:inline", m.net < 40 ? "text-danger" : "text-muted")}>
            NET {Math.round(m.net)}
          </span>
          <span className={cn("hidden font-mono text-[10px] tracking-wider uppercase sm:inline", m.grid < 40 ? "text-danger" : "text-muted")}>
            GRID {Math.round(m.grid)}
          </span>
          {world.brokenArrow && !world.brokenArrow.recovered ? (
            <span className="hidden font-mono text-[10px] tracking-wider text-danger uppercase sm:inline">BROKEN ARROW</span>
          ) : null}
          <button
            onClick={() => setScreen("briefing")}
            className="min-h-10 px-2 font-display text-xs tracking-[0.16em] text-muted uppercase"
          >
            Brief
          </button>
          <button
            onClick={() => resetToTitle()}
            className="min-h-10 px-2 font-display text-xs tracking-[0.16em] text-muted uppercase"
          >
            Menu
          </button>
        </div>
      </header>

      <div className="flex gap-1 border-b border-border px-3 py-1 lg:hidden">
        {(["map", "status", "act"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "min-h-11 flex-1 font-display text-sm tracking-[0.16em] uppercase",
              tab === t ? "text-accent" : "text-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside
          className={cn(
            "overflow-y-auto border-border p-4 lg:block lg:border-r",
            tab === "status" ? "block" : "hidden",
          )}
        >
          <p className="font-mono text-xs tracking-[0.22em] text-muted uppercase">
            {dateLabel(world)} · turn {world.turn}
          </p>
          <div className="mt-4">
            <Meter label="ALERT" value={m.defcon} max={5} invert help={METER_HELP.defcon} />
            <Meter label="Stability" value={m.stability} max={100} help={METER_HELP.stability} />
            <Meter label="Partners" value={m.alliances} max={100} help={METER_HELP.alliances} />
            <Meter label="Global risk" value={m.risk} max={100} invert help={METER_HELP.risk} />
            <Meter label="Economy" value={m.economy} max={100} help={METER_HELP.economy} />
            <Meter
              label="Winter"
              value={m.winter}
              max={100}
              invert
              help={`${METER_HELP.winter} Now: ${winterLabel(world.nuclearWinter)}.`}
            />
            {world.terminator ? (
              <Meter label="Machine" value={m.ai} max={100} invert help={METER_HELP.ai} />
            ) : null}
            <Meter label="Net" value={m.net} max={100} help={METER_HELP.net} />
            <Meter label="Grid" value={m.grid} max={100} help={METER_HELP.grid} />
          </div>
          <div className="mt-2 rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
              {c2.satchel}
            </p>
            <p className="mt-1 font-mono text-xs text-fg">
              {world.footballPresent
                ? world.playerId === "US"
                  ? "Military aide + football on hip"
                  : `${c2.satchel} present`
                : world.playerId === "US"
                  ? "Aide not with you — no football"
                  : `${c2.satchel} not with you`}
              {" · "}
              {world.secondOfficer.stance}
            </p>
            <p className="mt-1 text-xs leading-snug text-subtle">
              {stanceLine(world.secondOfficer.stance)}
              {world.uncontrolled ? " Escalation is beyond control." : ""}
              {world.terminator ? ` ${fusionName(world)} takeover ${Math.round(world.aiTakeover)}.` : ""}
            </p>
          </div>
          <div className="mt-6">
            <IntelPanel world={world} selected={selected} />
          </div>
        </aside>

        <div
          className={cn(
            "relative min-h-[280px] lg:block",
            tab === "map" ? "block" : "hidden lg:block",
          )}
        >
          <GlobeSlot />
          <div className="pointer-events-none absolute top-3 right-3 w-[min(100%,320px)]">
            <RadarScreen world={world} />
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs tracking-[0.18em] text-muted uppercase">
            Drag to orbit · click a marker
          </div>
        </div>

        <aside
          className={cn(
            "overflow-y-auto border-border p-4 lg:block lg:border-l",
            tab === "act" ? "block" : "hidden",
          )}
        >
          <ActionPanel world={world} />
          {why ? (
            <button
              onClick={() => setWhy(whyId === why.id ? null : why.id)}
              className="mt-6 w-full rounded-md bg-elevated p-3 text-left shadow-[var(--shadow-border)]"
            >
              <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Why</p>
              <p className="mt-1 text-sm text-fg">{why.text}</p>
              {whyId === why.id ? (
                <p className="mt-2 text-xs leading-relaxed text-muted">{why.why}</p>
              ) : (
                <p className="mt-2 text-xs text-subtle">Open the causal line</p>
              )}
            </button>
          ) : null}
        </aside>
      </div>
      {confirm ? <NuclearConfirm /> : null}
    </div>
  );
}

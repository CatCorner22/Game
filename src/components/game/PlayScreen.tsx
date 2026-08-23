import { useEffect, useState, type ComponentType } from "react";
import type { GlobeCanvasProps } from "./GlobeCanvas";
import { loadSettings } from "@/lib/game/settings";
import { isMuted, setMuted, updateAtmosphere } from "@/lib/game/audio";
import { IntelPanel } from "./IntelPanel";
import { ActionPanel, NuclearConfirm } from "./ActionPanel";
import { RadarScreen } from "./RadarScreen";
import { FlashpointBoard } from "./FlashpointBoard";
import { SituationLog } from "./SituationLog";
import { ObjectivesPanel } from "./ObjectivesPanel";
import { HotlinePanel } from "./HotlinePanel";
import { SettingsPanel } from "./SettingsPanel";
import { CloseCallOverlay } from "./CloseCallOverlay";
import { StrategicSystemsPanel } from "./StrategicSystemsPanel";
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
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs tracking-[0.18em] text-muted uppercase">{label}</span>
        <span className={cn("font-mono text-sm tabular", hot ? "text-danger" : "text-fg")}>
          {label === "ALERT" ? value : Math.round(value)}
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-elevated">
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
  const world = useGame((state) => state.world);
  const selected = useGame((state) => state.selected);
  const select = useGame((state) => state.select);
  const [Component, setComponent] = useState<ComponentType<GlobeCanvasProps> | null>(null);

  useEffect(() => {
    void import("./GlobeCanvas").then((module) => setComponent(() => module.GlobeCanvas));
  }, []);

  if (!world) return null;
  if (!Component) return <div className="h-full min-h-[280px] bg-bg" />;
  return (
    <Component
      actors={world.actors}
      selected={selected}
      onSelect={select}
      missiles={world.missiles}
      sites={world.sites ?? []}
      world={world}
    />
  );
}

const MOBILE_TABS = [
  { id: "map", label: "Map" },
  { id: "status", label: "Status" },
  { id: "act", label: "Act" },
] as const;

export function PlayScreen() {
  const world = useGame((state) => state.world);
  const tab = useGame((state) => state.mobileTab);
  const setTab = useGame((state) => state.setTab);
  const confirm = useGame((state) => state.confirmNuclear);
  const setScreen = useGame((state) => state.setScreen);
  const selected = useGame((state) => state.selected);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [radarOpen, setRadarOpen] = useState(false);
  const [muted, setMutedLocal] = useState(() => loadSettings().muted);

  useEffect(() => {
    if (!world) return;
    const current = meters(world);
    updateAtmosphere(world.defcon, current.risk);
  }, [world?.defcon, world?.globalRisk, world?.turn]);

  useEffect(() => {
    if (world?.closeCall) setRadarOpen(false);
  }, [world?.closeCall?.track.minutesToImpact, world?.closeCall?.track.confidence]);

  if (!world) return null;
  const current = meters(world);
  const command = COMMAND[asPlayable(world.playerId)];

  function toggleMute() {
    const next = !isMuted();
    setMuted(next);
    setMutedLocal(next);
  }

  function openBriefing() {
    setCommandOpen(false);
    setScreen("briefing");
  }

  function openSettings() {
    setCommandOpen(false);
    setSettingsOpen(true);
  }

  function returnToMenu() {
    setCommandOpen(false);
    resetToTitle();
  }

  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="flex min-h-14 min-w-0 items-center justify-between gap-3 px-3 sm:px-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="shrink-0 font-display text-lg tracking-[0.18em] text-fg">THRESHOLD</span>
              <span className="truncate font-mono text-[10px] tracking-wider text-muted uppercase lg:hidden">
                {dateLabel(world)} · {world.actors[world.playerId].shortName}
              </span>
              <span className="hidden truncate font-mono text-xs tracking-[0.16em] text-muted uppercase lg:inline">
                {dateLabel(world)} · {world.phase} · {world.actors[world.playerId].name} {world.intent}
                {world.terminator ? " · SKYNET" : ""}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className={cn("rounded-full px-2 py-1 font-mono text-[10px] tracking-wider", world.defcon <= 2 ? "bg-danger text-fg" : "bg-elevated text-accent")}>
              ALERT {world.defcon}
            </span>

            <div className="hidden items-center gap-1 lg:flex">
              <span className={cn("px-2 font-mono text-[10px] tracking-wider uppercase", current.net < 40 ? "text-danger" : "text-muted")}>
                NET {Math.round(current.net)}
              </span>
              <span className={cn("px-2 font-mono text-[10px] tracking-wider uppercase", current.grid < 40 ? "text-danger" : "text-muted")}>
                GRID {Math.round(current.grid)}
              </span>
              {world.brokenArrow && !world.brokenArrow.recovered ? (
                <span className="px-2 font-mono text-[10px] tracking-wider text-danger uppercase">Custody alert</span>
              ) : null}
              <button type="button" onClick={toggleMute} className="min-h-12 px-2 font-display text-xs tracking-wider text-muted uppercase">
                {muted ? "Unmute" : "Mute"}
              </button>
              <button type="button" onClick={openSettings} className="min-h-12 px-2 font-display text-xs tracking-wider text-muted uppercase">
                Settings
              </button>
              <button type="button" onClick={openBriefing} className="min-h-12 px-2 font-display text-xs tracking-wider text-muted uppercase">
                Brief
              </button>
              <button type="button" onClick={returnToMenu} className="min-h-12 px-2 font-display text-xs tracking-wider text-muted uppercase">
                Menu
              </button>
            </div>

            <button
              type="button"
              aria-expanded={commandOpen}
              aria-controls="mobile-command-menu"
              onClick={() => setCommandOpen((open) => !open)}
              className="min-h-12 min-w-12 rounded-md bg-elevated px-3 font-display text-xs tracking-wider text-fg uppercase lg:hidden"
            >
              More
            </button>
          </div>
        </div>

        {commandOpen ? (
          <div id="mobile-command-menu" className="border-t border-border bg-surface p-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={toggleMute} className="min-h-12 rounded-md bg-elevated font-display text-sm tracking-wider text-fg uppercase">
                {muted ? "Unmute" : "Mute"}
              </button>
              <button type="button" onClick={openSettings} className="min-h-12 rounded-md bg-elevated font-display text-sm tracking-wider text-fg uppercase">
                Settings
              </button>
              <button type="button" onClick={openBriefing} className="min-h-12 rounded-md bg-elevated font-display text-sm tracking-wider text-fg uppercase">
                Briefing
              </button>
              <button type="button" onClick={returnToMenu} className="min-h-12 rounded-md bg-elevated font-display text-sm tracking-wider text-fg uppercase">
                Main menu
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:pb-0">
        <aside
          className={cn(
            "min-h-0 min-w-0 overflow-y-auto overscroll-contain border-border p-4 lg:block lg:border-r",
            tab === "status" ? "block" : "hidden",
          )}
        >
          <p className="font-mono text-xs tracking-[0.22em] text-muted uppercase">
            {dateLabel(world)} · turn {world.turn}
          </p>
          <div className="mt-4">
            <Meter label="ALERT" value={current.defcon} max={5} invert help={METER_HELP.defcon} />
            <Meter label="Stability" value={current.stability} max={100} help={METER_HELP.stability} />
            <Meter label="Partners" value={current.alliances} max={100} help={METER_HELP.alliances} />
            <Meter label="Global risk" value={current.risk} max={100} invert help={METER_HELP.risk} />
            <Meter label="Economy" value={current.economy} max={100} help={METER_HELP.economy} />
            <Meter
              label="Winter"
              value={current.winter}
              max={100}
              invert
              help={`${METER_HELP.winter} Now: ${winterLabel(world.nuclearWinter)}.`}
            />
            {world.terminator ? <Meter label="Machine" value={current.ai} max={100} invert help={METER_HELP.ai} /> : null}
            <Meter label="Net" value={current.net} max={100} help={METER_HELP.net} />
            <Meter label="Grid" value={current.grid} max={100} help={METER_HELP.grid} />
          </div>

          <div className="mt-2 rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">{command.satchel}</p>
            <p className="mt-1 font-mono text-xs text-fg">
              {world.footballPresent
                ? world.playerId === "US"
                  ? "Military aide + command bag present"
                  : `${command.satchel} present`
                : world.playerId === "US"
                  ? "Command bag separated from principal"
                  : `${command.satchel} not present`}
              {" · "}
              {world.secondOfficer.stance}
            </p>
            <p className="mt-1 text-xs leading-snug text-subtle">
              {stanceLine(world.secondOfficer.stance)}
              {world.uncontrolled ? " Escalation is beyond control." : ""}
              {world.terminator ? ` ${fusionName(world)} takeover ${Math.round(world.aiTakeover)}.` : ""}
            </p>
          </div>

          <StrategicSystemsPanel world={world} />
          <ObjectivesPanel world={world} />
          <FlashpointBoard world={world} />
          <HotlinePanel world={world} />
          <SituationLog world={world} />
          <div className="mt-6">
            <IntelPanel world={world} selected={selected} />
          </div>
        </aside>

        <main
          className={cn(
            "relative min-h-[calc(100dvh-7.75rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-w-0 overflow-hidden lg:block lg:min-h-[420px]",
            tab === "map" ? "block" : "hidden lg:block",
          )}
        >
          <GlobeSlot />

          <div className="hidden lg:block">
            {world.closeCall ? (
              <CloseCallOverlay world={world} />
            ) : (
              <div className="pointer-events-none absolute right-3 top-3 w-[min(38vw,320px)]">
                <RadarScreen world={world} pulse={world.defcon <= 2} />
              </div>
            )}
          </div>

          <div className="lg:hidden">
            {!radarOpen && world.closeCall ? (
              <div className="absolute inset-x-3 top-3 z-20 rounded-lg border border-danger bg-bg/92 p-4 shadow-[0_0_30px_rgb(180_35_24/0.25)] backdrop-blur-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] text-danger uppercase">Close call · unverified track</p>
                    <p className="mt-1 font-display text-3xl tabular text-fg">{world.closeCall.track.minutesToImpact} min</p>
                  </div>
                  <span className="rounded-full bg-danger/15 px-2 py-1 font-mono text-[9px] text-danger">
                    {world.closeCall.track.confidence}% confidence
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Treat confidence and corroboration as separate variables. Open radar for the full evidence view.
                </p>
              </div>
            ) : null}

            {radarOpen ? (
              <div className="absolute inset-x-3 bottom-3 z-30 max-h-[72%] overflow-y-auto rounded-lg border border-border bg-bg/96 p-2 shadow-2xl backdrop-blur-md">
                <div className="mb-2 flex items-center justify-between gap-3 px-1">
                  <p className="font-mono text-[10px] tracking-wider text-accent uppercase">Radar evidence view</p>
                  <button
                    type="button"
                    onClick={() => setRadarOpen(false)}
                    className="min-h-11 rounded-md bg-elevated px-3 font-display text-xs tracking-wider text-fg uppercase"
                  >
                    Close
                  </button>
                </div>
                <RadarScreen world={world} pulse={Boolean(world.closeCall) || world.defcon <= 2} />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setRadarOpen((open) => !open)}
              className="absolute bottom-3 right-3 z-20 min-h-12 rounded-full bg-surface/95 px-4 font-display text-sm tracking-wider text-accent uppercase shadow-[var(--shadow-border)] backdrop-blur-md"
            >
              {radarOpen ? "Hide radar" : "Radar"}
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 hidden font-mono text-xs tracking-[0.18em] text-muted uppercase sm:block lg:block">
            Drag to orbit · click a marker
          </div>
        </main>

        <aside
          className={cn(
            "min-h-0 min-w-0 overflow-y-auto overscroll-contain border-border p-4 lg:block lg:border-l",
            tab === "act" ? "block" : "hidden",
          )}
        >
          <ActionPanel world={world} />
        </aside>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-bg/96 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
        aria-label="Game views"
      >
        {MOBILE_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={tab === item.id ? "page" : undefined}
            onClick={() => {
              setCommandOpen(false);
              setRadarOpen(false);
              setTab(item.id);
            }}
            className={cn(
              "min-h-12 rounded-md font-display text-sm tracking-[0.16em] uppercase",
              tab === item.id ? "bg-elevated text-accent" : "text-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {confirm ? <NuclearConfirm /> : null}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

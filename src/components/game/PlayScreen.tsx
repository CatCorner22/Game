import { useEffect, useState, type ComponentType } from "react";
import type { GlobeCanvasProps } from "./GlobeCanvas";
import { loadSettings } from "@/lib/game/settings";
import { isMuted, setMuted } from "@/lib/game/audio";
import { IntelPanel } from "./IntelPanel";
import { ActionPanel, NuclearConfirm } from "./ActionPanel";
import { RadarScreen } from "./RadarScreen";
import { FlashpointBoard } from "./FlashpointBoard";
import { SituationLog } from "./SituationLog";
import { ArcStrip } from "./ArcStrip";
import { ObjectivesPanel } from "./ObjectivesPanel";
import { HotlinePanel } from "./HotlinePanel";
import { SettingsPanel } from "./SettingsPanel";
import { C2Panel } from "./C2Panel";
import { CommandPostPanel } from "./CommandPostPanel";
import { LeadershipPanel } from "./LeadershipPanel";
import { PatrolPanel } from "./PatrolPanel";
import { DiplomacyPanel } from "./DiplomacyPanel";
import { SpaceWeatherPanel } from "./SpaceWeatherPanel";
import { StrategicSystemsPanel } from "./StrategicSystemsPanel";
import { weatherHostile } from "@/lib/game/spaceWeather";
import { GLOSSARY } from "@/lib/game/copy";
import { CloseCallOverlay } from "./CloseCallOverlay";
import { trackClockKey, useTrackClock } from "./useTrackClock";
import { formatCountdown } from "@/lib/game/flight";
import { updateAtmosphere } from "@/lib/game/audio";
import { resetToTitle, useGame } from "@/lib/game/store";
import { dateLabel, meters } from "@/lib/game/world";
import { METER_HELP } from "@/lib/game/copy";
import { cn } from "@/lib/utils";
import { winterLabel } from "@/lib/game/warning";
import { COMMAND, asPlayable, stanceLine } from "@/lib/game/command";
import { fusionName } from "@/lib/game/terminator";
import { EscalationLadder, HudButton, HudChip, HudHeader, HudLabel, HudMeter, HudModalOverlay, HudPanel } from "./ui/Hud";
import { ShortcutsOverlay } from "./ShortcutsOverlay";

const MOBILE_TABS = [
  { id: "map", label: "Map" },
  { id: "status", label: "Status" },
  { id: "act", label: "Act" },
] as const;


function GlobeSlot() {
  const world = useGame((s) => s.world);
  const selected = useGame((s) => s.selected);
  const select = useGame((s) => s.select);
  const [Comp, setComp] = useState<ComponentType<GlobeCanvasProps> | null>(null);
  useEffect(() => {
    void import("./GlobeCanvas").then((m) => setComp(() => m.GlobeCanvas));
  }, []);
  if (!world) return null;
  if (!Comp) return <div className="h-full min-h-[240px] bg-bg/50" />;
  return (
    <Comp
      actors={world.actors}
      selected={selected}
      onSelect={select}
      missiles={world.missiles}
      sites={world.sites ?? []}
      world={world}
    />
  );
}

export function PlayScreen() {
  const world = useGame((s) => s.world);
  const tab = useGame((s) => s.mobileTab);
  const setTab = useGame((s) => s.setTab);
  const confirm = useGame((s) => s.confirmNuclear);
  const setScreen = useGame((s) => s.setScreen);
  const selected = useGame((s) => s.selected);
  const glossaryOpen = useGame((s) => s.glossaryOpen);
  const toggleGlossary = useGame((s) => s.toggleGlossary);
  const setConferenceOpen = useGame((s) => s.setConferenceOpen);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [radarOpen, setRadarOpen] = useState(false);
  const [muted, setMutedLocal] = useState(() => loadSettings().muted);
  const [quitArmed, setQuitArmed] = useState(false);

  useEffect(() => {
    if (!world) return;
    const m = meters(world);
    updateAtmosphere(world.defcon, m.risk);
  }, [world?.defcon, world?.globalRisk, world?.turn]);

  // The live decision clock for the current inbound track. It deliberately
  // lives here rather than on the World: `forecast()` replays `resolveTurn`
  // twice per render and replay codes must reproduce a run from (seed,
  // actions), so nothing that moves with wall time may touch world state.
  const clockKey = trackClockKey(world);
  const clock = useTrackClock(clockKey, world?.closeCall?.track.minutesToImpact ?? 0);

  // Keyed on the track's identity. This used to depend on `minutesToImpact`
  // and `confidence` directly, which slams the radar shut on every change —
  // fatal once a clock is attached to the same track.
  useEffect(() => {
    if (world?.closeCall) setRadarOpen(false);
  }, [clockKey]);

  if (!world) return null;
  const m = meters(world);
  const c2 = COMMAND[asPlayable(world.playerId)];

  function toggleMute() {
    const next = !isMuted();
    setMuted(next);
    setMutedLocal(next);
  }

  function openSettings() {
    setCommandOpen(false);
    setSettingsOpen(true);
  }

  function returnToMenu() {
    setCommandOpen(false);
    resetToTitle();
  }

  // Desktop only. `Menu` sat in a row of six identical ghost pills next to Mute
  // and Glossary and abandoned the run on a single click with no warning.
  function quitFromDesktop() {
    if (!quitArmed) {
      setQuitArmed(true);
      return;
    }
    setQuitArmed(false);
    returnToMenu();
  }

  // `lg:h-dvh` bounds this flex container so the three columns can finally scroll
  // internally — which is what the `min-h-0 flex-1` grid and its `overflow-y-auto`
  // columns were already written for. Without a height bound the act rail grew to
  // ~4900px and the document scrolled instead, pushing Execute off screen entirely.
  // Mobile keeps `min-h-dvh`: the tab layout is one column and must stay scrollable.
  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden pt-[env(safe-area-inset-top)] lg:h-dvh lg:min-h-0">
      <HudHeader
        title="Threshold"
        subtitle={`${dateLabel(world)} · ${world.phase} · ${world.actors[world.playerId].name} ${world.intent}${world.terminator ? " · TERMINATOR" : ""}`}
        right={
          <>
            <HudChip active danger={world.defcon <= 2}>
              ALERT {world.defcon}
            </HudChip>
            <HudChip danger={!world.footballPresent} className="hidden sm:inline-flex">
              {world.footballPresent ? "AIDE + BAG" : "NO BAG"}
            </HudChip>
            <HudChip danger={world.biscuitOnPerson === false} className="hidden sm:inline-flex">
              {world.biscuitOnPerson === false ? "NO BISCUIT" : "BISCUIT"}
            </HudChip>
            <HudChip danger={m.net < 40} className="hidden sm:inline-flex">
              NET {Math.round(m.net)}
            </HudChip>
            <HudChip danger={m.grid < 40} className="hidden sm:inline-flex">
              GRID {Math.round(m.grid)}
            </HudChip>
            {world.spaceWeather && weatherHostile(world.spaceWeather) ? (
              <HudChip danger className="hidden sm:inline-flex">
                {world.spaceWeather.flare === "carrington"
                  ? "CARRINGTON"
                  : world.spaceWeather.cmeInbound
                    ? "CME INBOUND"
                    : `${world.spaceWeather.flare}-FLARE`}
              </HudChip>
            ) : null}
            {world.brokenArrow && !world.brokenArrow.recovered ? (
              <HudChip danger className="hidden sm:inline-flex">
                BROKEN ARROW
              </HudChip>
            ) : null}
            <HudButton variant="ghost" className="hidden px-2 py-1 text-micro lg:inline-flex" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? "Unmute" : "Mute"}
            </HudButton>
            <HudButton variant="ghost" className="hidden px-2 py-1 text-micro lg:inline-flex" onClick={openSettings}>
              Settings
            </HudButton>
            <HudButton variant="ghost" className="hidden px-2 py-1 text-micro lg:inline-flex" onClick={toggleGlossary}>
              Glossary
            </HudButton>
            <HudButton
              variant="ghost"
              className="hidden px-2 py-1 text-micro lg:inline-flex"
              onClick={() => setConferenceOpen(true)}
              aria-label="Advisors"
            >
              Advisors
            </HudButton>
            <HudButton variant="ghost" className="hidden px-2 py-1 text-micro lg:inline-flex" onClick={() => setScreen("briefing")}>
              Brief
            </HudButton>
            <HudButton variant="ghost" className="hidden px-2 py-1 text-micro lg:inline-flex" onClick={() => setHelpOpen(true)}>
              Keys
            </HudButton>
            <HudButton
              variant={quitArmed ? "danger" : "ghost"}
              className="hidden px-2 py-1 text-micro lg:inline-flex"
              onClick={quitFromDesktop}
              onBlur={() => setQuitArmed(false)}
              aria-label={quitArmed ? "Confirm quit run" : "Quit run"}
            >
              {quitArmed ? "Confirm?" : "Quit run"}
            </HudButton>
            <HudButton
              variant="ghost"
              className="min-h-12 min-w-12 px-3 text-xs lg:hidden"
              aria-label="More"
              aria-expanded={commandOpen}
              onClick={() => setCommandOpen((open) => !open)}
            >
              More
            </HudButton>
          </>
        }
      />
      {commandOpen ? (
        <div className="grid grid-cols-2 gap-2 border-b border-accent/15 bg-surface p-3 lg:hidden">
          <HudButton variant="default" className="min-h-12 uppercase" onClick={toggleMute}>
            {muted ? "Unmute" : "Mute"}
          </HudButton>
          <HudButton variant="default" className="min-h-12" aria-label="Settings" onClick={openSettings}>
            Settings
          </HudButton>
          <HudButton variant="default" className="min-h-12" onClick={() => { setCommandOpen(false); setScreen("briefing"); }}>
            Briefing
          </HudButton>
          <HudButton
            variant="default"
            className="min-h-12"
            aria-label="Advisors"
            onClick={() => { setCommandOpen(false); setConferenceOpen(true); }}
          >
            Advisors
          </HudButton>
          <HudButton variant="default" className="min-h-12" aria-label="Main menu" onClick={returnToMenu}>
            Main menu
          </HudButton>
        </div>
      ) : null}

      <div className="grid min-h-0 flex-1 grid-cols-1 pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:pb-0">
        <aside
          className={cn(
            "overflow-y-auto border-accent/10 p-4 lg:block lg:border-r",
            tab === "status" ? "block" : "hidden",
          )}
        >
          <HudLabel>
            {dateLabel(world)} · turn {world.turn}
          </HudLabel>
          <div className="mt-4">
            <HudMeter label="ALERT" value={m.defcon} max={5} alertScale help={METER_HELP.defcon} />
            <HudMeter label="Stability" value={m.stability} max={100} help={METER_HELP.stability} />
            <HudMeter label="Partners" value={m.alliances} max={100} help={METER_HELP.alliances} />
            <HudMeter label="Global risk" value={m.risk} max={100} invert help={METER_HELP.risk} />
            <HudMeter label="Economy" value={m.economy} max={100} help={METER_HELP.economy} />
            <HudMeter
              label="Winter"
              value={m.winter}
              max={100}
              invert
              help={`${METER_HELP.winter} Now: ${winterLabel(world.nuclearWinter)}.`}
            />
            {world.terminator ? <HudMeter label="Machine" value={m.ai} max={100} invert help={METER_HELP.ai} /> : null}
            <HudMeter label="Net" value={m.net} max={100} help={METER_HELP.net} />
            <HudMeter label="Grid" value={m.grid} max={100} help={METER_HELP.grid} />
          </div>
          <HudPanel className="mt-2">
            <HudLabel>{c2.satchel}</HudLabel>
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
          </HudPanel>
          <C2Panel world={world} />
          <CommandPostPanel world={world} />
          <LeadershipPanel world={world} />
          <StrategicSystemsPanel world={world} />
          <SpaceWeatherPanel world={world} />
          <PatrolPanel world={world} />
          <DiplomacyPanel world={world} />
          <ArcStrip world={world} />
          <ObjectivesPanel world={world} />
          <FlashpointBoard world={world} />
          <HotlinePanel world={world} />
          <SituationLog world={world} />
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
          <div className="hidden lg:block">
            {/* The scope stays mounted during a close call. It used to be a
                ternary against the alert panel, which meant the radar vanished
                at exactly the moment it mattered. The alert takes the top of
                the map, the scope drops to the bottom corner to clear it. */}
            {world.closeCall ? <CloseCallOverlay world={world} clock={clock} /> : null}
            <div
              className={cn(
                "pointer-events-none absolute right-3 z-10 w-[min(38vw,320px)]",
                world.closeCall ? "bottom-3" : "top-3",
              )}
            >
              <RadarScreen world={world} pulse={world.defcon <= 2} clock={clock} />
            </div>
          </div>
          <div className="lg:hidden">
            {!radarOpen && world.closeCall ? (
              <div className="absolute inset-x-3 top-3 z-20 rounded-lg border border-danger bg-bg/92 p-4 shadow-[0_0_30px_rgb(180_35_24/0.25)] backdrop-blur-sm">
                <p className="font-mono text-micro tracking-[0.18em] text-danger">Close call · unverified track</p>
                <p className="mt-1 font-display text-3xl tabular text-fg">
                  {clock ? formatCountdown(clock.remainingSec) : `${world.closeCall.track.minutesToImpact}:00`}
                  <span className="ml-2 font-mono text-xs text-muted">
                    {clock ? `${Math.ceil(clock.minutesLeft)} min` : "min"}
                  </span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Treat confidence and corroboration as separate variables. Open radar for the full evidence view.
                </p>
              </div>
            ) : null}
            {radarOpen ? (
              <div
                className="absolute inset-x-3 bottom-3 z-30 max-h-[72%] overflow-y-auto rounded-lg border border-border bg-bg/96 p-2 shadow-2xl backdrop-blur-md"
                role="dialog"
                aria-label="Radar evidence view"
              >
                <div className="mb-2 flex items-center justify-between gap-3 px-1">
                  <p className="font-mono text-micro tracking-wider text-accent">Radar evidence view</p>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setRadarOpen(false)}
                    className="min-h-11 rounded-md bg-elevated px-3 font-display text-xs tracking-wider text-fg"
                  >
                    Close
                  </button>
                </div>
                <RadarScreen world={world} pulse={Boolean(world.closeCall) || world.defcon <= 2} clock={clock} />
              </div>
            ) : null}
            <button
              type="button"
              aria-label="Radar"
              onClick={() => setRadarOpen((open) => !open)}
              className="absolute right-3 bottom-3 z-20 min-h-12 rounded-full bg-surface/95 px-4 font-display text-sm tracking-wider text-accent shadow-[var(--shadow-border)] backdrop-blur-md"
            >
              {radarOpen ? "Hide radar" : "Radar"}
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 hidden max-w-[220px] lg:block">
            <EscalationLadder phase={world.phase} defcon={world.defcon} winter={world.winterStage} />
            <p className="mt-2 font-mono text-micro tracking-[0.18em] text-accent/60 uppercase">
              Drag to orbit · click a marker
            </p>
          </div>
        </div>

        <aside
          className={cn(
            // `lg:pb-20` keeps the last panel scrollable clear of the pinned
            // Execute footer, which otherwise sits on top of it.
            "overflow-y-auto border-border p-4 lg:block lg:border-l lg:pb-20",
            tab === "act" ? "block" : "hidden",
          )}
        >
          <ActionPanel world={world} />
        </aside>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-accent/15 bg-bg/96 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
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
            aria-label={item.label}
            className={cn(
              "min-h-12 rounded-md font-display text-sm tracking-[0.16em]",
              tab === item.id ? "bg-elevated text-accent" : "text-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {confirm ? <NuclearConfirm /> : null}
      <ShortcutsOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {glossaryOpen ? (
        <HudModalOverlay>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-[0.12em] text-glow-accent text-fg uppercase">Glossary</h2>
            <HudButton variant="ghost" onClick={toggleGlossary}>
              Close
            </HudButton>
          </div>
          <dl className="mt-4 space-y-4">
            {GLOSSARY.map((g) => (
              <div key={g.term}>
                <dt className="font-display tracking-[0.12em] text-accent uppercase">{g.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{g.def}</dd>
              </div>
            ))}
          </dl>
        </HudModalOverlay>
      ) : null}
    </div>
  );
}

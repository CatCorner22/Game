import { useEffect, useState, type ComponentType } from "react";
import type { GlobeCanvasProps } from "./GlobeCanvas";
import { loadSettings } from "@/lib/game/settings";
import { isMuted, setMuted } from "@/lib/game/audio";
import { IntelPanel } from "./IntelPanel";
import { ActionPanel, NuclearConfirm } from "./ActionPanel";
import { RadarScreen } from "./RadarScreen";
import { FlashpointBoard } from "./FlashpointBoard";
import { SituationLog } from "./SituationLog";
import { ObjectivesPanel } from "./ObjectivesPanel";
import { HotlinePanel } from "./HotlinePanel";
import { SettingsPanel } from "./SettingsPanel";
import { C2Panel } from "./C2Panel";
import { PatrolPanel } from "./PatrolPanel";
import { DiplomacyPanel } from "./DiplomacyPanel";
import { SpaceWeatherPanel } from "./SpaceWeatherPanel";
import { weatherHostile } from "@/lib/game/spaceWeather";
import { GLOSSARY } from "@/lib/game/copy";
import { CloseCallOverlay } from "./CloseCallOverlay";
import { updateAtmosphere } from "@/lib/game/audio";
import { resetToTitle, useGame } from "@/lib/game/store";
import { dateLabel, meters } from "@/lib/game/world";
import { METER_HELP } from "@/lib/game/copy";
import { cn } from "@/lib/utils";
import { winterLabel } from "@/lib/game/warning";
import { COMMAND, asPlayable, stanceLine } from "@/lib/game/command";
import { fusionName } from "@/lib/game/terminator";
import { EscalationLadder, HudButton, HudChip, HudHeader, HudLabel, HudModalOverlay, HudPanel } from "./ui/Hud";
import { ShortcutsOverlay } from "./ShortcutsOverlay";

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
        <HudLabel className="tracking-[0.18em]">{label}</HudLabel>
        <span className={cn("font-mono text-sm tabular", hot ? "text-danger text-glow-danger" : "text-accent")}>
          {label === "ALERT" ? value : Math.round(value)}
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface/80">
        <div
          className={cn("h-1 rounded-full transition-all duration-500", hot ? "bg-danger glow-accent-sm" : "bg-accent glow-accent-sm")}
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [muted, setMutedLocal] = useState(() => loadSettings().muted);

  useEffect(() => {
    if (!world) return;
    const m = meters(world);
    updateAtmosphere(world.defcon, m.risk);
  }, [world?.defcon, world?.globalRisk, world?.turn]);

  if (!world) return null;
  const m = meters(world);
  const c2 = COMMAND[asPlayable(world.playerId)];

  function toggleMute() {
    const next = !isMuted();
    setMuted(next);
    setMutedLocal(next);
  }

  return (
    <div className="flex min-h-dvh flex-col">
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
            <HudButton variant="ghost" className="px-2 py-1 text-[10px]" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? "Unmute" : "Mute"}
            </HudButton>
            <HudButton variant="ghost" className="px-2 py-1 text-[10px]" onClick={() => setSettingsOpen(true)}>
              Settings
            </HudButton>
            <HudButton variant="ghost" className="px-2 py-1 text-[10px]" onClick={toggleGlossary}>
              Glossary
            </HudButton>
            <HudButton variant="ghost" className="px-2 py-1 text-[10px]" onClick={() => setScreen("briefing")}>
              Brief
            </HudButton>
            <HudButton variant="ghost" className="px-2 py-1 text-[10px]" onClick={() => setHelpOpen(true)}>
              Keys
            </HudButton>
            <HudButton variant="ghost" className="px-2 py-1 text-[10px]" onClick={() => resetToTitle()}>
              Menu
            </HudButton>
          </>
        }
      />

      <div className="flex gap-1 border-b border-accent/15 px-3 py-1 lg:hidden">
        {(["map", "status", "act"] as const).map((t) => (
          <HudButton
            key={t}
            variant={tab === t ? "active" : "ghost"}
            className="min-h-11 flex-1 text-sm"
            onClick={() => setTab(t)}
          >
            {t}
          </HudButton>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
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
            {world.terminator ? <Meter label="Machine" value={m.ai} max={100} invert help={METER_HELP.ai} /> : null}
            <Meter label="Net" value={m.net} max={100} help={METER_HELP.net} />
            <Meter label="Grid" value={m.grid} max={100} help={METER_HELP.grid} />
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
          <SpaceWeatherPanel world={world} />
          <PatrolPanel world={world} />
          <DiplomacyPanel world={world} />
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
          {world.closeCall ? <CloseCallOverlay world={world} /> : null}
          <div className="pointer-events-none absolute top-3 right-3 w-[min(100%,320px)]">
            <RadarScreen world={world} pulse={Boolean(world.closeCall) || world.defcon <= 2} />
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 max-w-[220px]">
            <EscalationLadder phase={world.phase} defcon={world.defcon} winter={world.winterStage} />
            <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-accent/60 uppercase">
              Drag to orbit · click a marker
            </p>
          </div>
        </div>

        <aside
          className={cn(
            "overflow-y-auto border-accent/10 p-4 lg:block lg:border-l",
            tab === "act" ? "block" : "hidden",
          )}
        >
          <ActionPanel world={world} />
        </aside>
      </div>
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

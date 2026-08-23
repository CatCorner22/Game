import { useEffect, useState, type ComponentType } from "react";
import type { GlobeCanvasProps } from "./GlobeCanvas";
import { RadarScreen } from "./RadarScreen";
import { ActionPanel, NuclearConfirm } from "./ActionPanel";
import { SituationLog } from "./SituationLog";
import { CloseCallOverlay } from "./CloseCallOverlay";
import { useGame } from "@/lib/game/store";
import { dateLabel, meters } from "@/lib/game/world";
import { fmtNum } from "@/lib/game/geo";
import { HudButton, HudChip, HudHeader, HudLabel, HudPanel } from "./ui/Hud";

function GlobeSlot({ emphasized }: { emphasized?: boolean }) {
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
      emphasizedArcs={emphasized}
    />
  );
}

function CasualtyTicker({ world }: { world: NonNullable<ReturnType<typeof useGame.getState>["world"]> }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-danger/40 bg-danger/10 px-4 py-2 backdrop-blur-md">
      <HudChip danger>Home dead: {fmtNum(world.playerCasualties)}</HudChip>
      <HudChip>World dead: {fmtNum(world.worldCasualties)}</HudChip>
      <HudChip>Nuclear uses: {world.nuclearUses.length}</HudChip>
      <HudChip active danger={world.defcon <= 2}>
        ALERT {world.defcon}
      </HudChip>
    </div>
  );
}

function NuclearTimeline({ world }: { world: NonNullable<ReturnType<typeof useGame.getState>["world"]> }) {
  if (!world.nuclearUses.length) return null;
  return (
    <HudPanel glow="danger" className="mt-4 border-t-0">
      <HudLabel>Nuclear timeline</HudLabel>
      {world.lastStrike ? <p className="mt-2 text-xs leading-snug text-fg">{world.lastStrike.summary}</p> : null}
      {world.ceasefire && world.ceasefire.accepted && !world.ceasefire.broken ? (
        <p className="mt-2 text-xs text-accent">
          Ceasefire on file until T{world.ceasefire.untilTurn}. Summit renews. EMPLOY breaks it.
        </p>
      ) : world.nuclearUses.length > 0 ? (
        <p className="mt-2 text-xs text-subtle">No ceasefire. DIPLOMACY weight 3 is the offer.</p>
      ) : null}
      <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto">
        {[...world.nuclearUses].reverse().slice(0, 12).map((u, i) => (
          <li key={`${u.turn}-${u.actor}-${i}`} className="font-mono text-[10px] text-subtle">
            T{u.turn}: {world.actors[u.actor].shortName} → {world.actors[u.target].shortName} · {u.rung}
            {u.outcome ? ` · ${u.outcome}` : ""} · {u.arrived != null ? `${u.arrived} arrived` : u.location}
          </li>
        ))}
      </ul>
    </HudPanel>
  );
}

export function WarScreen() {
  const world = useGame((s) => s.world);
  const confirm = useGame((s) => s.confirmNuclear);
  const setScreen = useGame((s) => s.setScreen);
  if (!world) return null;
  const m = meters(world);

  return (
    <div className="flex min-h-dvh flex-col">
      <HudHeader
        war
        title="War Watch"
        subtitle={`${dateLabel(world)} · ${world.phase}`}
        right={
          <HudButton variant="ghost" className="px-2 py-1 text-[10px]" onClick={() => setScreen("play")}>
            Command view
          </HudButton>
        }
      />
      <CasualtyTicker world={world} />
      <div className="relative min-h-[45vh] flex-1">
        <GlobeSlot emphasized />
        {world.closeCall ? <CloseCallOverlay world={world} /> : null}
        <div className="pointer-events-none absolute top-3 right-3 w-[min(100%,360px)]">
          <RadarScreen world={world} pulse={world.defcon <= 2} />
        </div>
      </div>
      <div className="grid max-h-[42vh] grid-cols-1 border-t border-danger/30 lg:grid-cols-2">
        <div className="overflow-y-auto p-4">
          <HudLabel>
            Risk {Math.round(m.risk)} · Winter {Math.round(m.winter)}
          </HudLabel>
          <ActionPanel world={world} />
        </div>
        <div className="overflow-y-auto border-danger/20 p-4 lg:border-l">
          <SituationLog world={world} />
          <NuclearTimeline world={world} />
        </div>
      </div>
      {confirm ? <NuclearConfirm /> : null}
    </div>
  );
}

import type { Actor, ActorId, World } from "@/lib/game/types";
import { ACTOR_IDS } from "@/lib/game/types";
import {
  DISCLOSURE_LABEL,
  DOCTRINE_LABEL,
  KIND_LABEL,
  perceivedWarheads,
} from "@/lib/game/world";
import { GEN_LABEL, SITE_KIND, spySummary } from "@/lib/game/spies";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";

function visibleSystems(actor: Actor, playerId: ActorId) {
  if (actor.id === playerId) return actor.systems;
  const c = actor.intel / 100;
  return actor.systems.filter((s) => {
    if (s.disclosure === "acknowledged") return true;
    if (s.disclosure === "reported") return c >= 0.32;
    if (s.disclosure === "suspected") return c >= 0.48;
    if (s.disclosure === "unacknowledged") return c >= 0.42;
    return false;
  });
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-2">
      <dt className="text-xs tracking-wide text-muted uppercase">{k}</dt>
      <dd className="text-right font-mono text-sm text-fg tabular">{v}</dd>
    </div>
  );
}

export function IntelPanel({ world, selected }: { world: World; selected: ActorId }) {
  const select = useGame((s) => s.select);
  const fileOpen = useGame((s) => s.fileOpen);
  const toggleFile = useGame((s) => s.toggleFile);
  const a = world.actors[selected];
  const w = perceivedWarheads(world, a);
  const systems = visibleSystems(a, world.playerId);

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">File</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {ACTOR_IDS.map((id) => (
            <button
              key={id}
              onClick={() => select(id)}
              className={cn(
                "min-h-9 rounded-sm px-2 font-mono text-xs tracking-wide uppercase",
                id === selected ? "bg-fg text-bg" : "text-muted hover:text-fg",
              )}
            >
              {id}
              <span className="mt-0.5 block text-[9px] font-normal tracking-normal opacity-80 normal-case">
                {world.actors[id]?.shortName}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-display text-2xl tracking-[0.08em] text-fg uppercase">{a.name}</h2>
        <p className="mt-1 text-sm leading-snug text-muted">{a.doctrineLine}</p>
      </div>
      <dl>
        <Fact k={`Hostility to ${world.actors[world.playerId].shortName}`} v={`${Math.round(a.hostility[world.playerId] ?? 0)}`} />
        <Fact k="Nerve" v={`${Math.round(a.nerve ?? a.riskTolerance ?? 50)} · ${
          (a.nerve ?? 50) < 22 ? "FREEZE" : (a.nerve ?? 50) < 40 ? "CAVE" : (a.nerve ?? 50) < 64 ? "STEADY" : (a.nerve ?? 50) < 82 ? "HAWK" : "PANIC"
        }`} />
        <Fact k="Alert" v={`${a.alert} / 5`} />
        <Fact
          k="Warheads"
          v={
            a.threshold
              ? a.hasDevice
                ? "device assembled"
                : `breakout ${Math.round(a.breakoutWeeks)}w`
              : w.label
          }
        />
        <Fact k="Doctrine" v={DOCTRINE_LABEL[a.doctrine]} />
        <Fact k="Intel confidence" v={`${Math.round(a.intel)}`} />
        {world.terminator ? <Fact k="Machine in C2" v={`${Math.round(a.aiInC2 ?? 0)}`} /> : null}
        <Fact k="Internet" v={`${Math.round(a.internet ?? 100)}`} />
        <Fact k="Grid" v={`${Math.round(a.grid ?? 100)}`} />
      </dl>
      <SiteBoard world={world} selected={selected} />
      <button
        onClick={toggleFile}
        className="min-h-11 self-start font-display text-sm tracking-[0.18em] text-accent uppercase"
      >
        {fileOpen ? "Close arsenal" : "Open arsenal"}
      </button>
      {fileOpen ? (
        <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {systems.map((s) => (
            <li key={s.id} className="rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
              <p className="font-display text-sm tracking-wide text-fg">{s.name}</p>
              <p className="mt-1 font-mono text-[11px] text-muted uppercase">
                {KIND_LABEL[s.kind]} · {s.rangeKm ? `${s.rangeKm} km` : "n/a"} · WH {s.warheads} ·{" "}
                {DISCLOSURE_LABEL[s.disclosure]}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{s.notes}</p>
            </li>
          ))}
          {systems.length < a.systems.length ? (
            <li className="text-xs text-subtle">
              Additional systems sit below current confidence. Collect intelligence to unmask
              reported, suspected, and unacknowledged legs.
            </li>
          ) : null}
        </ul>
      ) : null}
    </section>
  );
}

function SiteBoard({ world, selected }: { world: World; selected: ActorId }) {
  const sites = (world.sites ?? []).filter((s) => s.owner === selected);
  const sum = spySummary(world);
  if (!sites.length) return null;
  const ours = selected === world.playerId;
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
        Launch sites · your cells {sum.ours} · hostile on you {sum.hostile} ({sum.known} named)
      </p>
      <ul className="mt-2 space-y-2">
        {sites.map((s) => (
          <li key={s.id} className="rounded-md bg-elevated px-3 py-2 shadow-[var(--shadow-border)]">
            <p className="font-display text-sm tracking-wide text-fg">
              {s.name}
              <span className="ml-2 font-mono text-[10px] tracking-wider text-muted uppercase">
                {SITE_KIND[s.kind]} · {GEN_LABEL[s.generation]}
              </span>
            </p>
            <p className="mt-1 text-xs leading-snug text-muted">
              {s.ourSpy && !s.ourSpy.burned
                ? `Your spy (${s.ourSpy.cover}): ${s.ourSpy.lastReport}`
                : s.ourSpy?.burned
                  ? "Your cell was rolled up."
                  : ours
                    ? "No agent of yours here — this is home."
                    : "No living agent of yours at this fence."}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-subtle">
              {s.hostile && !s.hostile.burned
                ? ours
                  ? s.hostile.known
                    ? `Hostile: ${world.actors[s.hostile.runner].shortName} · ${s.hostile.cover}`
                    : "Hostile: a face in town you have not named. INTEL on yourself. COVERT on yourself hunts."
                  : s.hostile.known
                    ? `They also have someone here (${world.actors[s.hostile.runner].shortName}).`
                    : "Unknown whether they watch this fence too."
                : ours
                  ? "No hostile cell named on this site."
                  : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

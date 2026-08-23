import { useGame, resetToTitle } from "@/lib/game/store";
import { clearSave } from "@/lib/game/save";
import { fmtNum } from "@/lib/game/geo";
import { meters } from "@/lib/game/world";

export function EndScreen() {
  const world = useGame((s) => s.world);
  if (!world?.ending) return null;
  const e = world.ending;
  const m = meters(world);

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-12">
      <p className="font-mono text-xs tracking-[0.28em] text-accent uppercase">Watch closed</p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-wide text-fg">{e.title}</h1>
      <p className="mt-6 text-base leading-relaxed text-muted">{e.body}</p>
      <dl className="mt-8 space-y-2">
        <Row k="Score" v={String(Math.round(e.score))} />
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

import { getAchievements, getCareerStats } from "@/lib/game/stats";
import { useGame } from "@/lib/game/store";

export function StatsScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const stats = getCareerStats();
  const achievements = getAchievements();

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-12">
      <button
        type="button"
        onClick={() => setScreen("title")}
        className="self-start font-display text-sm tracking-[0.2em] text-muted uppercase"
      >
        Back
      </button>
      <h1 className="mt-8 font-display text-4xl tracking-wide text-fg">Career record</h1>
      <dl className="mt-8 space-y-2">
        <Row k="Watches completed" v={String(stats.games)} />
        <Row k="Wins" v={String(stats.wins)} />
        <Row k="Achievements" v={`${stats.achievements.length}/${achievements.length}`} />
      </dl>
      <div className="mt-8">
        <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Best scores by seat</p>
        <ul className="mt-2 space-y-1">
          {Object.entries(stats.bestScore).map(([seat, score]) => (
            <li key={seat} className="flex justify-between font-mono text-sm tabular">
              <span className="text-muted">{seat}</span>
              <span className="text-fg">{Math.round(score)}</span>
            </li>
          ))}
          {!Object.keys(stats.bestScore).length ? (
            <li className="text-sm text-subtle">No completed watches yet.</li>
          ) : null}
        </ul>
      </div>
      <div className="mt-8">
        <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Scenario bests</p>
        <ul className="mt-2 space-y-1">
          {Object.entries(stats.scenarioBest).map(([id, score]) => (
            <li key={id} className="flex justify-between font-mono text-sm tabular">
              <span className="text-muted">{id}</span>
              <span className="text-fg">{Math.round(score ?? 0)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Achievements</p>
        <ul className="mt-3 space-y-3">
          {achievements.map((a) => {
            const unlocked = stats.achievements.includes(a.id);
            return (
              <li key={a.id} className={unlocked ? "text-fg" : "text-subtle"}>
                <p className="font-display text-sm tracking-wide uppercase">{a.title}</p>
                <p className="text-xs">{a.detail}</p>
              </li>
            );
          })}
        </ul>
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

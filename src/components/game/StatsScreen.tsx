import { getAchievements, getCareerStats } from "@/lib/game/stats";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";
import { GlassPanel, HudButton, HudChip, HudLabel, HudRow } from "./ui/Hud";

export function StatsScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const stats = getCareerStats();
  const achievements = getAchievements();

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-12">
      <HudButton variant="ghost" className="self-start text-sm uppercase" onClick={() => setScreen("title")}>
        Back
      </HudButton>
      <h1 className="mt-8 font-display text-4xl tracking-wide text-glow-accent text-fg">Career record</h1>
      <GlassPanel glow="accent" className="mt-8 rounded-xl p-4">
        <dl className="space-y-2">
          <HudRow k="Watches completed" v={String(stats.games)} />
          <HudRow k="Wins" v={String(stats.wins)} />
          <HudRow k="Achievements" v={`${stats.achievements.length}/${achievements.length}`} />
        </dl>
      </GlassPanel>
      <div className="mt-8">
        <HudLabel>Best scores by seat</HudLabel>
        <ul className="mt-2 space-y-1">
          {Object.entries(stats.bestScore).map(([seat, score]) => (
            <li key={seat} className="flex justify-between font-mono text-sm tabular">
              <span className="text-muted">{seat}</span>
              <span className="text-accent">{Math.round(score)}</span>
            </li>
          ))}
          {!Object.keys(stats.bestScore).length ? <li className="text-sm text-subtle">No completed watches yet.</li> : null}
        </ul>
      </div>
      <div className="mt-8">
        <HudLabel>Scenario bests</HudLabel>
        <ul className="mt-2 space-y-1">
          {Object.entries(stats.scenarioBest).map(([id, score]) => (
            <li key={id} className="flex justify-between font-mono text-sm tabular">
              <span className="text-muted">{id}</span>
              <span className="text-accent">{Math.round(score ?? 0)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <HudLabel>Achievements</HudLabel>
        <ul className="mt-3 space-y-3">
          {achievements.map((a) => {
            const unlocked = stats.achievements.includes(a.id);
            return (
              <li key={a.id}>
                <GlassPanel className={cn(unlocked ? "neon-border-accent" : "opacity-60")}>
                  <p className="font-display text-sm tracking-wide uppercase">{a.title}</p>
                  <p className="text-xs text-muted">{a.detail}</p>
                  {unlocked ? (
                    <HudChip active className="mt-2">
                      Unlocked
                    </HudChip>
                  ) : null}
                </GlassPanel>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}



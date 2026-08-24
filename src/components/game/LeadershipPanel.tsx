import type { ActorId, World } from "@/lib/game/types";
import { leaderKnown, leaderOf, misreadRisk, playerLeader } from "@/lib/game/leaders";
import { cn } from "@/lib/utils";
import { HudLabel, HudPanel } from "./ui/Hud";

/**
 * Who is in the chair — yours, and theirs.
 *
 * Adversary temperaments are an intelligence product, not a given: until
 * sustained collection establishes one, the panel says so rather than quietly
 * showing you something you have not earned. That asymmetry is the point of the
 * feature — an unreadable leader is dangerous precisely because you cannot
 * price their next move.
 */
export function LeadershipPanel({ world }: { world: World }) {
  const you = playerLeader(world);
  const rivals = (Object.keys(world.actors) as ActorId[])
    .filter((id) => id !== world.playerId && world.actors[id].nuclear)
    .sort((a, b) => misreadRisk(world, b) - misreadRisk(world, a))
    .slice(0, 6);

  return (
    <HudPanel className="mt-4">
      <HudLabel>Leadership</HudLabel>
      <p className="mt-1 text-xs text-fg">
        You · {you.name}
        {you.volatile ? <span className="ml-2 font-mono text-micro text-warn uppercase">volatile</span> : null}
      </p>
      <p className="mt-0.5 text-xs leading-relaxed text-subtle">{you.line}</p>
      <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-micro text-subtle uppercase">
        <Stat label="candor" value={you.candor} />
        <Stat label="control" value={-you.preDel} />
        <Stat label="readable" value={you.predictability} absolute />
      </div>

      <div className="mt-3 space-y-1.5">
        {rivals.map((id) => {
          const known = leaderKnown(world, id);
          const l = leaderOf(world, id);
          const risk = misreadRisk(world, id);
          return (
            <div key={id} className="border-t border-border pt-1.5">
              <p className="flex items-baseline justify-between gap-2">
                <span className="font-display text-micro tracking-wider text-fg uppercase">
                  {world.actors[id].shortName}
                </span>
                <span
                  className={cn(
                    "font-mono text-micro uppercase",
                    risk >= 0.45 ? "text-danger" : risk >= 0.25 ? "text-warn" : "text-subtle",
                  )}
                >
                  misread {Math.round(risk * 100)}%
                </span>
              </p>
              <p className="text-xs leading-snug text-subtle">
                {known ? (
                  <>
                    <span className="text-muted">{l.name.replace(/^The /, "")}</span> · {l.line}
                  </>
                ) : (
                  "No established leadership assessment. INTEL on them until confidence holds."
                )}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-subtle">
        Two leaders who cannot read each other drift hostile without either of them deciding to. That gap is where
        most of the incidents in the record actually live.
      </p>
    </HudPanel>
  );
}

function Stat({ label, value, absolute }: { label: string; value: number; absolute?: boolean }) {
  const good = absolute ? value >= 70 : value > 0;
  const bad = absolute ? value < 45 : value < 0;
  return (
    <span className={cn(good && "text-olive", bad && "text-warn")}>
      {label} {absolute ? value : value > 0 ? `+${value}` : value}
    </span>
  );
}

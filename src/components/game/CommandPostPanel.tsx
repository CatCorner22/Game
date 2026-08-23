import type { World } from "@/lib/game/types";
import { useGame } from "@/lib/game/store";
import { asPlayable } from "@/lib/game/command";
import { currentPost, inTransit, postById, postsFor, relocationBlocked } from "@/lib/game/posts";
import { cn } from "@/lib/utils";
import { HudLabel, HudPanel } from "./ui/Hud";

export function CommandPostPanel({ world }: { world: World }) {
  const pending = useGame((s) => s.pendingRelocation);
  const setPending = useGame((s) => s.setPendingRelocation);
  const posts = postsFor(asPlayable(world.playerId));
  const here = currentPost(world);
  const transit = inTransit(world);
  const movingTo = postById(world.relocation?.to);

  return (
    <HudPanel className="mt-4">
      <HudLabel>Command post</HudLabel>
      <p className="mt-1 text-xs text-fg">{here.name}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-subtle">{here.role}</p>
      {transit && movingTo ? (
        <p className="mt-2 rounded-sm border border-warn/40 bg-warn/10 px-2 py-1 font-mono text-micro tracking-wider text-warn uppercase">
          In transit to {movingTo.short} · {world.relocation?.turnsLeft} turn
          {(world.relocation?.turnsLeft ?? 0) === 1 ? "" : "s"} · warning and control degraded
        </p>
      ) : null}

      <div className="mt-2 grid grid-cols-1 gap-1.5">
        {posts.map((post) => {
          const isHere = post.id === here.id && !transit;
          const blocked = relocationBlocked(world, post.id);
          const queued = pending === post.id;
          return (
            <button
              key={post.id}
              type="button"
              disabled={Boolean(blocked) && !queued}
              aria-pressed={queued}
              onClick={() => setPending(queued ? null : post.id)}
              className={cn(
                "min-h-11 rounded-sm border px-2 py-1.5 text-left transition-colors disabled:opacity-40",
                queued
                  ? "border-accent/60 bg-accent/15"
                  : isHere
                    ? "border-olive/40 bg-olive/10"
                    : "border-accent/20 bg-surface/40 hover:border-accent/40",
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-display text-micro tracking-wider text-fg uppercase">{post.short}</span>
                <span className="font-mono text-micro text-subtle">
                  {isHere ? "here" : queued ? "queued" : post.transitTurns ? `${post.transitTurns}t move` : "immediate"}
                </span>
              </span>
              <span className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-micro text-subtle uppercase">
                <Stat label="warn" value={post.warning} />
                <Stat label="surv" value={post.survivability} absolute />
                <Stat label="ctrl" value={post.releaseIntegrity} />
                <Stat label="comms" value={post.comms} absolute />
                <span className={post.signature >= 2 ? "text-danger" : "text-subtle"}>
                  sig {post.signature}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-subtle">
        {pending
          ? `${postById(pending)?.cost ?? ""} The move begins when you execute this turn — relocating does not cost you the turn, it costs you visibility.`
          : "Movement of national leadership is one of the indicators other capitals watch for. Where you sit changes what you can see, who can reach you, and whether the chain still checks the order."}
      </p>
    </HudPanel>
  );
}

function Stat({ label, value, absolute }: { label: string; value: number; absolute?: boolean }) {
  const good = absolute ? value >= 70 : value > 0;
  const bad = absolute ? value < 50 : value < 0;
  return (
    <span className={cn(good && "text-olive", bad && "text-warn")}>
      {label} {absolute ? value : value > 0 ? `+${value}` : value}
    </span>
  );
}

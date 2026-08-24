import type { World } from "@/lib/game/types";
import { majorityKind, staffAdvice } from "@/lib/game/staff";
import { advisorById, ageOf, initialsOf } from "@/lib/game/advisors/roster";
import { bodyFor } from "@/lib/game/advisors/bodies";
import { asPlayable } from "@/lib/game/command";
import { useGame } from "@/lib/game/store";
import { HudButton, HudLabel, HudPanel } from "./ui/Hud";
import { cn } from "@/lib/utils";

/**
 * The cabinet, on the screen the player already uses.
 *
 * This panel has always been the one piece of advice a player sees every single
 * turn — it sits inside `ActionPanel`, and tapping a line loads that move. And
 * it signed every line anonymously: "Grid / J4", "Partners desk". Meanwhile
 * eighty-five hand-written advisors across fourteen real decision bodies sat
 * behind a ghost button labelled "More" that most players never pressed, in a
 * conference that had nothing to say unless a decision card happened to be open.
 *
 * Two advice systems, built past each other. This joins them: `staffAdvice` was
 * already situation-aware, deterministic and specific about the exact move it
 * wanted — it just needed a name and a face on it.
 *
 * So the anonymous desk becomes a person from the seat's real body, the header
 * becomes that body's real name, and the conference is one tap away instead of
 * three.
 */
export function StaffPanel({ world }: { world: World }) {
  const setKind = useGame((s) => s.setKind);
  const setIntensity = useGame((s) => s.setIntensity);
  const setNotify = useGame((s) => s.setNotify);
  const select = useGame((s) => s.select);
  const setConferenceOpen = useGame((s) => s.setConferenceOpen);
  const kind = useGame((s) => s.actionKind);
  const advice = staffAdvice(world);
  const majority = majorityKind(advice);
  const body = bodyFor(asPlayable(world.playerId));

  return (
    <HudPanel className="mt-1">
      <HudLabel>{body.name} · not an order</HudLabel>
      <p className="mt-1 text-micro text-subtle">
        They disagree. Tap a line to load that move. The room leans {majority.toUpperCase()}.
      </p>
      <ul className="mt-2 space-y-1.5">
        {advice.map((a) => {
          const advisor = a.advisorId ? advisorById(a.advisorId) : null;
          return (
            <li key={a.desk}>
              <HudButton
                variant={kind === a.kind ? "accent" : "default"}
                className="w-full px-2 py-2 text-left"
                onClick={() => {
                  setKind(a.kind);
                  setIntensity(a.intensity);
                  setNotify(a.notify);
                  if (a.target) select(a.target);
                }}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    {advisor ? (
                      <span
                        aria-hidden
                        className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-bg/60 font-mono text-micro text-accent"
                      >
                        {initialsOf(advisor)}
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-micro tracking-wider text-accent uppercase">
                        {advisor ? advisor.name : a.desk}
                      </span>
                      <span className="mt-0.5 block text-micro leading-snug text-subtle normal-case tracking-normal">
                        {advisor ? `${advisor.role} · ${ageOf(advisor, world)}` : a.desk}
                      </span>
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-micro uppercase",
                      a.tone === "employ" ? "text-danger" : a.tone === "generate" ? "text-accent" : "text-muted",
                    )}
                  >
                    {a.kind} {a.kind !== "hold" ? a.intensity : ""}
                  </span>
                </span>
                <span className="mt-1 block text-micro leading-snug text-fg normal-case tracking-normal">
                  {a.line}
                </span>
              </HudButton>
            </li>
          );
        })}
      </ul>
      {/* The conference used to be three taps away behind a button labelled
          "More", and nothing surfaced it at the moment it was useful. */}
      <HudButton
        variant="ghost"
        className="mt-2 min-h-11 w-full text-xs uppercase"
        onClick={() => setConferenceOpen(true)}
      >
        Convene the room →
      </HudButton>
      <p className="mt-1 text-micro leading-snug text-subtle">{body.note}</p>
    </HudPanel>
  );
}

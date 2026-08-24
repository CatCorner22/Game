import type { World } from "@/lib/game/types";
import { briefFor } from "@/lib/game/scenarioBriefs";
import { SCENARIOS, type ScenarioId } from "@/lib/game/scenarios";
import { actionDef } from "@/lib/game/actions";
import { HudLabel, HudPanel } from "./ui/Hud";

/**
 * The file on this crisis, during the crisis.
 *
 * Until now **no brief content survived Begin watch**. Nothing in the play
 * screen imported `briefFor`: you read four rich paragraphs on the menu, pressed
 * a button, and then spent twenty turns with a title, two sentences of event
 * body and one consequence clause — about fifty words a turn. Everything that
 * explained who else was in the crisis and what you could not know was on a
 * screen you had already left.
 *
 * What is here is deliberately not the whole brief. The situation and the stakes
 * are behind you; what you still need at turn twelve is the shape of the
 * uncertainty. So this leads with the open unknowns and the action that would
 * settle each one, which is the live decision aid, and files everything else
 * underneath.
 */
export function DossierPanel({ world }: { world: World }) {
  const id = world.scenarioId as ScenarioId | null | undefined;
  if (!id) return null;
  const brief = briefFor(id);
  if (!brief) return null;
  const def = SCENARIOS.find((s) => s.id === id);

  return (
    <HudPanel className="mt-4">
      <HudLabel>The file on this crisis</HudLabel>

      <p className="mt-1 text-xs leading-relaxed text-warn">{brief.theTrap}</p>

      <p className="mt-3 font-mono text-micro tracking-wider text-subtle uppercase">
        What you cannot know
      </p>
      <ul className="mt-1.5 space-y-2">
        {brief.unknowns.map((u) => (
          <li key={u.question}>
            <p className="text-xs leading-snug text-fg">{u.question}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{u.whyItMatters}</p>
            <p className="mt-0.5 font-mono text-micro tracking-wider text-accent uppercase">
              {actionDef(u.settledBy).label} would settle it
            </p>
          </li>
        ))}
      </ul>

      <details className="group mt-3 border-t border-border pt-2">
        <summary className="cursor-pointer list-none font-mono text-micro tracking-wider text-subtle uppercase hover:text-accent">
          <span className="group-open:hidden">▸ </span>
          <span className="hidden group-open:inline">▾ </span>
          Who else is in this · {brief.actors.length}
        </summary>
        <ul className="mt-1.5 space-y-2">
          {brief.actors.map((a) => (
            <li key={a.id}>
              <p className="font-mono text-micro tracking-wider text-fg uppercase">
                {world.actors[a.id]?.shortName ?? a.id}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                <span className="text-subtle">Wants </span>
                {a.wants}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                <span className="text-subtle">Fears </span>
                {a.fears}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-subtle">{a.constraint}</p>
            </li>
          ))}
        </ul>
      </details>

      <details className="group mt-2 border-t border-border pt-2">
        <summary className="cursor-pointer list-none font-mono text-micro tracking-wider text-subtle uppercase hover:text-accent">
          <span className="group-open:hidden">▸ </span>
          <span className="hidden group-open:inline">▾ </span>
          If this goes wrong
        </summary>
        <ul className="mt-1.5 space-y-1.5">
          {brief.consequences.map((c) => (
            <li key={c.line} className="text-xs leading-relaxed text-muted">
              <span className="font-mono text-micro tracking-wider text-subtle uppercase">
                {c.horizon}{" "}
              </span>
              {c.line}
            </li>
          ))}
        </ul>
        {/* Authored per scenario since the scenario list was written, and until
            now rendered nowhere at all. */}
        {def?.learningGoal ? (
          <p className="mt-2 border-t border-border pt-2 text-xs leading-relaxed text-subtle">
            {def.learningGoal}
          </p>
        ) : null}
      </details>
    </HudPanel>
  );
}

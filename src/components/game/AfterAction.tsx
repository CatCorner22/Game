import type { World } from "@/lib/game/types";
import { SCENARIOS, type ScenarioId } from "@/lib/game/scenarios";
import { briefFor } from "@/lib/game/scenarioBriefs";
import { HudLabel, HudPanel } from "./ui/Hud";

/**
 * What actually happened, shown after you have lived it.
 *
 * The order matters. The briefing screen sells the evening and deliberately
 * withholds the ending -- a player who reads "Petrov reported it as a
 * malfunction" before they sit down has not been given a decision, they have
 * been given an answer. So `whatHappened` and `afterward` exist in the brief
 * from the start and only surface here, once the run is closed.
 *
 * For invented scenarios there is no ending to reveal, so this shows the
 * precedent instead: the real incident whose shape the scenario borrows, which
 * is the honest answer to "was any of that real."
 *
 * The facts are repeated here uncollapsed. On the briefing screen they compete
 * with the decision to start playing and most players will never open them; on
 * this screen there is nothing else to do, and the numbers land differently
 * once you know how your own version went.
 */
export function AfterAction({ world }: { world: World }) {
  const id = world.scenarioId as ScenarioId | null | undefined;
  if (!id) return null;
  const brief = briefFor(id);
  if (!brief) return null;
  const def = SCENARIOS.find((s) => s.id === id);
  const uses = world.nuclearUses.length;

  return (
    <HudPanel className="mt-8">
      <HudLabel>After action</HudLabel>
      <p className="mt-1 font-mono text-micro tracking-wider text-subtle uppercase">
        {def?.title ?? id}
        {def ? ` · ${def.era === "historical" ? "historical" : def.era}` : null}
      </p>

      {brief.whatHappened ? (
        <>
          <p className="mt-3 font-mono text-micro tracking-wider text-accent uppercase">What actually happened</p>
          <p className="mt-1 text-sm leading-relaxed text-fg">{brief.whatHappened}</p>
        </>
      ) : null}

      {brief.afterward ? (
        <>
          <p className="mt-3 font-mono text-micro tracking-wider text-accent uppercase">What changed afterwards</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{brief.afterward}</p>
        </>
      ) : null}

      {brief.precedent && !brief.whatHappened ? (
        <>
          <p className="mt-3 font-mono text-micro tracking-wider text-accent uppercase">The precedent</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{brief.precedent}</p>
        </>
      ) : null}

      <p className="mt-3 text-sm leading-relaxed text-subtle">
        Your run closed on turn {world.turn} with{" "}
        {uses === 0 ? "no weapon used" : `${uses} nuclear ${uses === 1 ? "use" : "uses"}`}.
      </p>

      <p className="mt-3 font-mono text-micro tracking-wider text-subtle uppercase">The record</p>
      <ul className="mt-1.5 space-y-1.5">
        {brief.facts.map((fact) => (
          <li key={fact} className="flex gap-2 text-xs leading-relaxed text-muted">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
            <span className="min-w-0">{fact}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-subtle">
        Everyone in these files had less information than you were given here, and less time to use it.
      </p>
    </HudPanel>
  );
}

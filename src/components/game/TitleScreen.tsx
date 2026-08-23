import { useMemo, useState, type ChangeEvent } from "react";
import { useGame } from "@/lib/game/store";
import { hasSave, saveWorld } from "@/lib/game/save";
import { loadWorldFromSlot, slotMeta } from "@/lib/game/slots";
import {
  SCENARIOS,
  SCENARIO_CATEGORIES,
  scenarioById,
  type ScenarioCategory,
  type ScenarioId,
} from "@/lib/game/scenarios";
import {
  DEADHAND_CONFIGS,
  STRATEGIC_AI_CONFIGS,
  type DeadhandMode,
  type StrategicAIMode,
} from "@/lib/game/strategicSystems";
import type { Difficulty, PlayableId, Team } from "@/lib/game/types";
import { PLAYABLE } from "@/lib/game/command";
import { cn } from "@/lib/utils";

const DIFFICULTIES: Array<{ id: Difficulty; label: string; line: string }> = [
  { id: "standard", label: "Standard", line: "Readable evidence, forgiving clocks, full forecasts." },
  { id: "hard", label: "Hard", line: "Noisier intelligence, tighter resources, more aggressive rivals." },
  { id: "extreme", label: "Extreme", line: "Sparse evidence, fast clocks, cascading dependencies." },
];

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`Challenge ${value} of 5`} className="font-mono text-[10px] tracking-widest text-accent">
      {"●".repeat(value)}
      <span className="text-subtle">{"○".repeat(5 - value)}</span>
    </span>
  );
}

export function TitleScreen() {
  const start = useGame((state) => state.start);
  const resume = useGame((state) => state.resume);
  const setScreen = useGame((state) => state.setScreen);
  const [save] = useState(() => hasSave());
  const [team, setTeam] = useState<Team>("blue");
  const [country, setCountry] = useState<PlayableId>("US");
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [category, setCategory] = useState<"all" | ScenarioCategory>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [aiMode, setAiMode] = useState<StrategicAIMode>("copilot");
  const [deadhandMode, setDeadhandMode] = useState<DeadhandMode>("off");
  const [backgroundOk, setBackgroundOk] = useState(true);

  const seat = PLAYABLE.find((item) => item.id === country)!;
  const selectedScenario = scenarioById(scenario);
  const visibleScenarios = useMemo(
    () => (category === "all" ? SCENARIOS : SCENARIOS.filter((item) => item.category === category)),
    [category],
  );

  function chooseScenario(id: ScenarioId | null) {
    setScenario(id);
    const definition = scenarioById(id);
    if (!definition) return;
    setCategory(definition.category);
    setCountry(definition.playerId as PlayableId);
    setTeam(definition.intent);
    setDifficulty(definition.difficulty);
    setAiMode(definition.defaultAI);
    setDeadhandMode(definition.defaultDeadhand);
  }

  function launch() {
    start({
      difficulty,
      playerId: country,
      intent: team,
      strategicAI: aiMode,
      deadhand: deadhandMode,
      scenarioId: scenario ?? undefined,
    });
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg">
      {backgroundOk ? (
        <img
          src="/textures/command-room.jpg"
          alt=""
          className="fixed inset-0 size-full object-cover opacity-35"
          onError={() => setBackgroundOk(false)}
        />
      ) : null}
      <div className="fixed inset-0 bg-linear-to-b from-bg/78 via-bg/94 to-bg" />
      <div className="scanline fixed inset-0 opacity-30" />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase">National Command Authority · fictional simulation</p>
            <h1 className="mt-2 font-display text-6xl font-semibold tracking-[0.06em] text-fg sm:text-8xl">THRESHOLD</h1>
            <p className="mt-2 font-display text-lg tracking-[0.18em] text-accent uppercase sm:text-xl">Stay below the line</p>
          </div>
          <div className="max-w-xl rounded-lg border border-accent/25 bg-bg/75 p-4 backdrop-blur-sm">
            <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">Content note · recommended 16+</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              This strategy game explores mass-harm crises, deterrence, institutional failure, and humanitarian response. New scenarios use abstract tokens and non-graphic language. No real operational weapon, agent, targeting, or trigger instructions are modeled.
            </p>
          </div>
        </header>

        <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <section className="min-w-0 space-y-6">
            <div className="rounded-xl bg-surface/95 p-4 shadow-[var(--shadow-border)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.24em] text-accent uppercase">1 · Mission and seat</p>
                  <h2 className="mt-1 font-display text-2xl tracking-wide text-fg">Who are you trying to protect—or pressure?</h2>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:w-72">
                  {(["blue", "red"] as const).map((intent) => (
                    <button
                      key={intent}
                      type="button"
                      onClick={() => setTeam(intent)}
                      className={cn(
                        "min-h-12 rounded-md px-3 font-display text-sm tracking-[0.15em] uppercase",
                        team === intent
                          ? intent === "blue"
                            ? "bg-fg text-bg"
                            : "bg-danger text-fg"
                          : "bg-elevated text-muted",
                      )}
                    >
                      {intent}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-5 block">
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Command seat</span>
                <select
                  value={country}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => setCountry(event.target.value as PlayableId)}
                  className="mt-2 min-h-12 w-full rounded-md border border-border bg-elevated px-3 text-base text-fg outline-none focus:border-accent"
                >
                  <optgroup label="Nuclear-weapon states">
                    {PLAYABLE.filter((item) => item.group === "nuclear").map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} — {item.seat}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other seats">
                    {PLAYABLE.filter((item) => item.group === "other").map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} — {item.seat}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                <span className="font-medium text-fg">{seat.seat}.</span> {team === "blue" ? seat.blue : seat.red}
              </p>
            </div>

            <div className="rounded-xl bg-surface/95 p-4 shadow-[var(--shadow-border)] sm:p-6">
              <p className="font-mono text-[10px] tracking-[0.24em] text-accent uppercase">2 · Scenario library</p>
              <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2" aria-label="Scenario categories">
                {SCENARIO_CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={cn(
                      "min-h-11 shrink-0 rounded-full px-4 font-mono text-[10px] tracking-wider uppercase",
                      category === item.id ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <label className="mt-3 block">
                <span className="sr-only">Choose a scenario</span>
                <select
                  value={scenario ?? ""}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    chooseScenario(event.target.value ? (event.target.value as ScenarioId) : null)
                  }
                  className="min-h-12 w-full rounded-md border border-border bg-elevated px-3 text-base text-fg outline-none focus:border-accent"
                >
                  <option value="">Sandbox · March 2027 · emergent campaign</option>
                  {visibleScenarios.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {item.category} — challenge {item.challenge}/5
                    </option>
                  ))}
                </select>
              </label>

              {selectedScenario ? (
                <article className="mt-4 rounded-lg bg-bg/70 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl tracking-wide text-fg">{selectedScenario.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{selectedScenario.line}</p>
                    </div>
                    <div className="text-right">
                      <Stars value={selectedScenario.challenge} />
                      <p className="mt-1 font-mono text-[9px] tracking-wider text-subtle uppercase">{selectedScenario.duration} run</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-mono text-[9px] tracking-wider text-muted uppercase">Variables</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedScenario.variables.map((variable) => (
                          <span key={variable} className="rounded-full bg-elevated px-2 py-1 text-[11px] text-fg">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] tracking-wider text-muted uppercase">Dependencies</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedScenario.dependencies.map((dependency) => (
                          <span key={dependency} className="rounded-full bg-elevated px-2 py-1 text-[11px] text-fg">
                            {dependency}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 border-l border-accent pl-3 text-xs leading-relaxed text-subtle">
                    {selectedScenario.contentNote}
                  </p>
                </article>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Sandbox combines flashpoints, unreliable information, politics, infrastructure, AI risk, and human behavior into a different campaign each run.
                </p>
              )}
            </div>

            <div className="rounded-xl bg-surface/95 p-4 shadow-[var(--shadow-border)] sm:p-6">
              <p className="font-mono text-[10px] tracking-[0.24em] text-accent uppercase">3 · Command intelligence</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {STRATEGIC_AI_CONFIGS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAiMode(item.id)}
                    className={cn(
                      "min-h-28 rounded-lg p-4 text-left shadow-[var(--shadow-border)]",
                      aiMode === item.id ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                    )}
                  >
                    <span className="font-display text-lg tracking-wide">{item.label}</span>
                    <span className="mt-2 block text-xs leading-relaxed opacity-80">{item.line}</span>
                    <span className="mt-3 block font-mono text-[9px] tracking-wider opacity-65 uppercase">Risk: {item.risk}</span>
                  </button>
                ))}
              </div>

              <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Continuity / Deadhand option</p>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {DEADHAND_CONFIGS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDeadhandMode(item.id)}
                    className={cn(
                      "min-h-28 rounded-lg p-4 text-left shadow-[var(--shadow-border)]",
                      deadhandMode === item.id ? "bg-fg text-bg" : "bg-elevated text-fg",
                    )}
                  >
                    <span className="font-display text-base tracking-wide">{item.label}</span>
                    <span className="mt-2 block text-xs leading-relaxed opacity-80">{item.line}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-xl bg-surface/98 p-5 shadow-[var(--shadow-border)] sm:p-6">
              <p className="font-mono text-[10px] tracking-[0.24em] text-accent uppercase">Run configuration</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Mission</dt>
                  <dd className="text-right font-medium text-fg uppercase">{team}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Seat</dt>
                  <dd className="text-right text-fg">{seat.name}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Scenario</dt>
                  <dd className="max-w-52 text-right text-fg">{selectedScenario?.title ?? "Sandbox"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">AI</dt>
                  <dd className="max-w-52 text-right text-fg">{STRATEGIC_AI_CONFIGS.find((item) => item.id === aiMode)?.label}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Continuity</dt>
                  <dd className="max-w-52 text-right text-fg">{DEADHAND_CONFIGS.find((item) => item.id === deadhandMode)?.label}</dd>
                </div>
              </dl>

              <fieldset className="mt-6">
                <legend className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Difficulty</legend>
                <div className="mt-3 space-y-2">
                  {DIFFICULTIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDifficulty(item.id)}
                      className={cn(
                        "min-h-14 w-full rounded-md px-3 py-2 text-left",
                        difficulty === item.id ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                      )}
                    >
                      <span className="font-display text-sm tracking-wider uppercase">{item.label}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug opacity-75">{item.line}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={launch}
                className="mt-6 min-h-14 w-full rounded-md bg-danger px-5 font-display text-lg tracking-[0.18em] text-fg uppercase shadow-[0_0_0_1px_rgb(255_255_255/0.12)] transition-transform active:scale-[0.99]"
              >
                Begin watch
              </button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-subtle">
                Every new system is simulated locally. No external model or account is required.
              </p>
            </div>

            <div className="mt-4 rounded-xl bg-surface/95 p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap gap-2">
                {save ? (
                  <button
                    type="button"
                    onClick={() => resume()}
                    className="min-h-12 flex-1 rounded-md bg-accent px-3 font-display text-sm tracking-wider text-accent-fg uppercase"
                  >
                    Continue
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setScreen("stats")}
                  className="min-h-12 flex-1 rounded-md bg-elevated px-3 font-display text-sm tracking-wider text-fg uppercase"
                >
                  Career
                </button>
                <button
                  type="button"
                  onClick={() => setScreen("briefing")}
                  className="min-h-12 flex-1 rounded-md bg-elevated px-3 font-display text-sm tracking-wider text-fg uppercase"
                >
                  Briefing
                </button>
              </div>

              <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Save slots</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {([0, 1, 2] as const).map((slot) => {
                  const meta = slotMeta(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        const world = loadWorldFromSlot(slot);
                        if (!world || world.ended) return;
                        saveWorld(world);
                        resume();
                      }}
                      disabled={!meta}
                      className="min-h-14 rounded-md bg-elevated px-2 py-2 text-left shadow-[var(--shadow-border)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span className="font-display text-xs text-fg">Slot {slot + 1}</span>
                      <span className="mt-1 block font-mono text-[9px] text-subtle">
                        {meta ? `${meta.seat} · T${meta.turn}` : "Empty"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setScreen("multiplayer")}
                className="mt-4 min-h-12 w-full rounded-md bg-elevated px-3 font-display text-sm tracking-wider text-muted uppercase hover:text-fg"
              >
                Multiplayer lab
              </button>
            </div>
          </aside>
        </div>

        <footer className="mt-8 border-t border-border pt-5 font-mono text-[10px] leading-relaxed tracking-wider text-subtle uppercase">
          Fictional strategy game · abstract crisis mechanics · trauma-aware framing · accessibility-first controls
        </footer>
      </main>
    </div>
  );
}

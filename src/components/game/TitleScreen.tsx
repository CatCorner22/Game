import { abandonSave, useGame } from "@/lib/game/store";
import { hasSave } from "@/lib/game/save";
import { slotMeta } from "@/lib/game/slots";
import { SCENARIO_CATEGORIES, SCENARIOS, type ScenarioCategory, type ScenarioEra, type ScenarioId } from "@/lib/game/scenarios";
import type { Difficulty, PlayableId, Team } from "@/lib/game/types";
import { PLAYABLE } from "@/lib/game/command";
import { DEADHAND_CONFIGS, STRATEGIC_AI_CONFIGS, type DeadhandMode, type StrategicAIMode } from "@/lib/game/strategicSystems";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { GlassPanel, HudButton, HudChip, HudLabel, ScenarioCard } from "./ui/Hud";
import { DEFAULT_LEADER, LEADERS, leaderById } from "@/lib/game/leaders";
import { briefFor, type ScenarioBrief } from "@/lib/game/scenarioBriefs";
import { dailyWatch, type DailyWatch } from "@/lib/game/daily";
import { getCareerStats, type DailyRecord } from "@/lib/game/stats";

const DIFFS: { id: Difficulty; label: string; line: string }[] = [
  { id: "standard", label: "STANDARD", line: "Readable files. Hostile world." },
  { id: "hard", label: "HARD", line: "Worse intel. Faster clocks." },
  { id: "extreme", label: "EXTREME", line: "Sparse files. No slack." },
];

const ERA_LABEL: Record<ScenarioEra, string> = {
  historical: "Historical",
  "2027": "2027 theater",
  threshold: "Threshold",
};

export function TitleScreen() {
  const start = useGame((s) => s.start);
  const resume = useGame((s) => s.resume);
  const resumeSlot = useGame((s) => s.resumeSlot);
  const startReplay = useGame((s) => s.startReplay);
  const setScreen = useGame((s) => s.setScreen);
  const lastError = useGame((s) => s.lastError);
  const [save] = useState(() => hasSave());
  const [team, setTeam] = useState<Team | null>("blue");
  const [country, setCountry] = useState<PlayableId | null>("US");
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [leader, setLeader] = useState<string>(DEFAULT_LEADER);
  const [terminator, setTerminator] = useState(false);
  const [aiMode, setAiMode] = useState<StrategicAIMode>("human");
  const [deadhand, setDeadhand] = useState<DeadhandMode>("off");
  const [replayCode, setReplayCode] = useState("");
  const [eraFilter, setEraFilter] = useState<ScenarioEra | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ScenarioCategory>("all");
  const [query, setQuery] = useState("");
  const [seatOnly, setSeatOnly] = useState(true);

  const seat = PLAYABLE.find((p) => p.id === country);
  const selectedDef = scenario ? SCENARIOS.find((s) => s.id === scenario) : null;
  const filteredScenarios = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCENARIOS.filter((s) => {
      if (eraFilter !== "all" && s.era !== eraFilter) return false;
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      if (seatOnly && country && s.playerId !== country) return false;
      if (!q) return true;
      // Search the headline too: it is the text the player can actually see on
      // the card, so it is what they will type at.
      const brief = briefFor(s.id);
      return `${s.title} ${s.line} ${brief?.headline ?? ""} ${s.playerId} ${s.id} ${s.category}`
        .toLowerCase()
        .includes(q);
    });
  }, [eraFilter, categoryFilter, query, seatOnly, country]);

  function launchWatch() {
    const seatId = country ?? "US";
    const intent = team ?? "blue";
    const def = scenario ? SCENARIOS.find((s) => s.id === scenario) : null;
    start({
      difficulty: def?.difficulty ?? "standard",
      playerId: seatId,
      intent,
      terminator: terminator || aiMode === "skynet",
      strategicAI: terminator ? "skynet" : aiMode,
      deadhand: def?.defaultDeadhand ?? deadhand,
      scenarioId: scenario ?? undefined,
      leaderArchetype: leader,
    });
  }

  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <HudChip active>NCA · STRATEGIC WATCH</HudChip>
          <div className="flex flex-wrap gap-2">
            {save ? (
              <>
                <HudButton variant="accent" className="px-4 py-2 text-xs" onClick={() => resume()}>
                  Continue
                </HudButton>
                <HudButton variant="ghost" className="px-3 py-2 text-xs" onClick={() => abandonSave()}>
                  Abandon
                </HudButton>
              </>
            ) : null}
            <HudButton variant="ghost" className="px-3 py-2 text-xs" onClick={() => setScreen("stats")}>
              Career
            </HudButton>
            <HudButton variant="ghost" className="px-3 py-2 text-xs" onClick={() => setScreen("multiplayer")}>
              Multiplayer
            </HudButton>
            <HudButton variant="ghost" className="px-3 py-2 text-xs" onClick={() => setScreen("archive")}>
              Archive
            </HudButton>
            <HudButton variant="ghost" className="px-3 py-2 text-xs" onClick={() => setScreen("briefing")}>
              Briefing
            </HudButton>
          </div>
        </header>

        <div className="mt-8 grid flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-10">
          <div className="max-w-xl">
            <h1 className="max-w-full font-display text-[clamp(2rem,10vw,4.5rem)] font-bold tracking-[0.04em] text-glow-accent text-fg sm:tracking-[0.08em]">
              THRESHOLD
            </h1>
            <p className="mt-2 font-display text-sm tracking-[0.32em] text-accent uppercase sm:text-base">
              Stay below the line
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              One event per month. One decision. The football is authentication, not a button. MIRV buses fail.
              Decoys soak interceptors. Humans refuse — and fire too soon.
            </p>
            <p className="mt-3 rounded-lg border border-accent/20 bg-surface/60 p-3 text-xs leading-relaxed text-subtle">
              Recommended 16+. Abstract crisis language. No real operational weapon, agent, targeting, or trigger
              procedures. ORACLE, CHORUS, SKYNET, and DEADHAND are fictional/local decision-support puzzles.
            </p>
            <HudButton
              variant="active"
              aria-label="Begin watch"
              className="mt-6 min-h-14 w-full px-4 text-lg"
              onClick={launchWatch}
            >
              Begin watch
            </HudButton>

            <DailyWatchPanel />

            <label className="mt-4 block">
              <span className="sr-only">Command seat</span>
              <select
                value={country ?? "US"}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setCountry(event.target.value as PlayableId)}
                className="min-h-12 w-full rounded-md border border-accent/20 bg-bg/60 px-3 text-sm text-fg outline-none focus:neon-border-accent"
              >
                {PLAYABLE.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.seat}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block">
              <span className="sr-only">Choose a scenario</span>
              <select
                value={scenario ?? ""}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  const id = event.target.value ? (event.target.value as ScenarioId) : null;
                  setScenario(id);
                  const def = id ? SCENARIOS.find((s) => s.id === id) : null;
                  if (def) {
                    setCountry(def.playerId as PlayableId);
                    setTeam(def.intent);
                    setAiMode(def.defaultAI);
                    setDeadhand(def.defaultDeadhand);
                  }
                }}
                className="min-h-12 w-full rounded-md border border-accent/20 bg-bg/60 px-3 text-sm text-fg outline-none focus:neon-border-accent"
              >
                <option value="">Sandbox · March 2027</option>
                {SCENARIOS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} — {item.category} — challenge {item.challenge}/5
                  </option>
                ))}
              </select>
            </label>
            {selectedDef ? (
              <div className="mt-2">
                {/* The scenario's name, then what happened. The name matters
                    because it is how you refer to the thing you just picked;
                    the headline is what makes you want to pick it. */}
                <p className="font-mono text-micro tracking-wider text-subtle uppercase">{selectedDef.title}</p>
                <p className="mt-0.5 text-sm leading-snug text-fg">
                  {briefFor(selectedDef.id)?.headline ?? selectedDef.title}
                </p>
                {briefFor(selectedDef.id) ? (
                  <>
                    <dl className="mt-2 space-y-1.5">
                      <BriefRow label="Situation" value={briefFor(selectedDef.id)!.situation} />
                      <BriefRow label="You are" value={briefFor(selectedDef.id)!.youAre} />
                      <BriefRow label="You decide" value={briefFor(selectedDef.id)!.decision} />
                      <BriefRow label="If you get it wrong" value={briefFor(selectedDef.id)!.stakes} />
                    </dl>
                    <BriefRecord brief={briefFor(selectedDef.id)!} />
                  </>
                ) : null}
              </div>
            ) : null}

            {/* Deliberately AFTER the scenario select: the mobile smoke reaches
                the scenario picker as `select` nth(1), so a new control must not
                be inserted above it. */}
            <label className="mt-3 block">
              <span className="sr-only">Choose your temperament</span>
              <select
                value={leader}
                onChange={(event) => setLeader(event.target.value)}
                className="min-h-12 w-full rounded-md border border-accent/20 bg-bg/60 px-3 text-sm text-fg outline-none focus:neon-border-accent"
              >
                {LEADERS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                    {l.volatile ? " — volatile" : ""}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-sm text-fg">{leaderById(leader).line}</p>
            <p className="mt-1 text-xs leading-relaxed text-subtle">{leaderById(leader).detail}</p>

            <div className="mt-8 space-y-6">
              <section>
                <HudLabel>1 · Intent</HudLabel>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <HudButton
                    variant={team === "blue" ? "active" : "default"}
                    className="min-h-16 p-4 text-left"
                    onClick={() => setTeam("blue")}
                  >
                    <span className="font-display text-base tracking-[0.2em]">BLUE</span>
                    <span className="mt-1 block text-xs font-normal normal-case tracking-normal opacity-80">
                      Prevent war. If it starts, keep a country.
                    </span>
                  </HudButton>
                  <HudButton
                    variant={team === "red" ? "danger" : "default"}
                    className={cn("min-h-16 p-4 text-left", team === "red" && "bg-danger text-fg")}
                    onClick={() => setTeam("red")}
                  >
                    <span className="font-display text-base tracking-[0.2em]">RED</span>
                    <span className="mt-1 block text-xs font-normal normal-case tracking-normal opacity-80">
                      Coerce and dominate. A spasm is still a loss.
                    </span>
                  </HudButton>
                </div>
              </section>

              {team ? (
                <section>
                  <HudLabel>2 · Seat</HudLabel>
                  <p className="mt-2 font-mono text-micro tracking-wider text-subtle uppercase">Nuclear states</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {PLAYABLE.filter((p) => p.group === "nuclear").map((p) => (
                      <HudButton
                        key={p.id}
                        variant={country === p.id ? "active" : "default"}
                        className="min-h-11 px-2 py-2 text-left text-xs"
                        onClick={() => setCountry(p.id)}
                      >
                        {p.id}
                      </HudButton>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-micro tracking-wider text-subtle uppercase">Threshold / other</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {PLAYABLE.filter((p) => p.group === "other").map((p) => (
                      <HudButton
                        key={p.id}
                        variant={country === p.id ? "accent" : "default"}
                        className="min-h-11 px-2 py-2 text-left text-xs"
                        onClick={() => setCountry(p.id)}
                      >
                        {p.name}
                      </HudButton>
                    ))}
                  </div>
                  {seat ? (
                    <p className="mt-3 text-sm text-muted">
                      <span className="text-accent">{seat.seat}.</span> {team === "blue" ? seat.blue : seat.red}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {team && country ? (
                <section>
                  <HudLabel>3 · C2 mode</HudLabel>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <HudButton
                      variant={!terminator ? "active" : "default"}
                      className="min-h-14 p-3 text-left"
                      onClick={() => setTerminator(false)}
                    >
                      <span className="font-display tracking-[0.16em]">HUMAN</span>
                      <span className="mt-1 block text-xs font-normal normal-case text-muted">Football · refusal</span>
                    </HudButton>
                    <HudButton
                      variant={terminator ? "danger" : "default"}
                      className={cn("min-h-14 p-3 text-left", terminator && "text-fg")}
                      onClick={() => setTerminator(true)}
                    >
                      <span className="font-display tracking-[0.16em]">TERMINATOR</span>
                      <span className="mt-1 block text-xs font-normal normal-case opacity-80">Rogue model on keys</span>
                    </HudButton>
                  </div>
                  <p className="mt-3 font-mono text-micro tracking-wider text-subtle uppercase">Command intelligence</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {STRATEGIC_AI_CONFIGS.map((cfg) => (
                      <HudButton
                        key={cfg.id}
                        variant={aiMode === cfg.id ? "active" : "default"}
                        className="min-h-12 p-2 text-left text-micro"
                        onClick={() => {
                          setAiMode(cfg.id);
                          if (cfg.id === "skynet") setTerminator(true);
                        }}
                      >
                        <span className="font-display tracking-wider uppercase">{cfg.label}</span>
                        <span className="mt-1 block text-micro font-normal normal-case text-muted">{cfg.risk}</span>
                      </HudButton>
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-micro tracking-wider text-subtle uppercase">Continuity</p>
                  <div className="mt-2 grid grid-cols-1 gap-1.5">
                    {DEADHAND_CONFIGS.map((cfg) => (
                      <HudButton
                        key={cfg.id}
                        variant={deadhand === cfg.id ? "accent" : "default"}
                        className="min-h-12 p-2 text-left text-micro"
                        onClick={() => setDeadhand(cfg.id)}
                      >
                        <span className="font-display tracking-wider uppercase">{cfg.label}</span>
                        <span className="mt-1 block text-micro font-normal normal-case text-muted">{cfg.line}</span>
                      </HudButton>
                    ))}
                  </div>
                </section>
              ) : null}

              {team && country ? (
                <section>
                  <HudLabel>4 · Launch</HudLabel>
                  <div className="mt-3 flex flex-col gap-2">
                    {DIFFS.map((d) => (
                      <HudButton
                        key={d.id}
                        variant="default"
                        className="flex min-h-12 items-center justify-between gap-4 px-4 py-3 hover:neon-border-accent"
                        onClick={() => {
                          const def = scenario ? SCENARIOS.find((s) => s.id === scenario) : null;
                          start({
                            difficulty: def?.difficulty ?? d.id,
                            playerId: country ?? "US",
                            intent: team ?? "blue",
                            terminator: terminator || aiMode === "skynet",
                            strategicAI: terminator ? "skynet" : aiMode,
                            deadhand: def?.defaultDeadhand ?? deadhand,
                            scenarioId: scenario ?? undefined,
                            leaderArchetype: leader,
                          });
                        }}
                      >
                        <span className="font-display tracking-[0.14em]">{d.label}</span>
                        <span className="text-xs text-muted">{d.line}</span>
                      </HudButton>
                    ))}
                  </div>
                </section>
              ) : null}

              <section>
                <HudLabel>Save slots</HudLabel>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {([0, 1, 2] as const).map((slot) => {
                    const meta = slotMeta(slot);
                    return (
                      <HudButton
                        key={slot}
                        variant="default"
                        className="min-h-14 p-2 text-left"
                        onClick={() => resumeSlot(slot)}
                      >
                        <span className="font-display text-xs">Slot {slot + 1}</span>
                        <span className="mt-1 block font-mono text-micro text-subtle">
                          {meta ? `${meta.seat} · T${meta.turn}` : "Empty"}
                        </span>
                      </HudButton>
                    );
                  })}
                </div>
              </section>

              <GlassPanel className="p-4">
                <HudLabel>Replay decode</HudLabel>
                <textarea
                  value={replayCode}
                  onChange={(e) => setReplayCode(e.target.value)}
                  placeholder="Paste replay code"
                  className="mt-2 h-16 w-full rounded-md border border-accent/20 bg-bg/60 px-3 py-2 font-mono text-micro text-fg outline-none focus:neon-border-accent"
                />
                <HudButton variant="accent" className="mt-2 px-4 py-2 text-xs" onClick={() => startReplay(replayCode)}>
                  Run replay
                </HudButton>
                {lastError ? <p className="mt-2 text-xs text-danger">{lastError}</p> : null}
              </GlassPanel>
            </div>
          </div>

          {team && country ? (
            <aside className="flex min-h-0 flex-col">
              <div className="flex items-center justify-between gap-2">
                <HudLabel>Scenarios · optional</HudLabel>
                <HudChip>
                  {filteredScenarios.length}/{SCENARIOS.length}
                </HudChip>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search theater, seat, title"
                className="mt-2 h-9 w-full rounded-md glass-panel px-3 font-mono text-micro text-fg outline-none focus:neon-border-accent"
              />
              <div className="mt-2 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
                <span className="mr-0.5 font-mono text-micro tracking-[0.08em] text-subtle uppercase">Theme</span>
                {SCENARIO_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryFilter(c.id)}
                    aria-pressed={categoryFilter === c.id}
                    className={cn(
                      "rounded-sm px-2 py-1 font-mono text-micro tracking-wider uppercase",
                      categoryFilter === c.id ? "bg-accent/20 text-accent neon-border-accent" : "text-subtle hover:text-muted",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by era">
                <span className="mr-0.5 font-mono text-micro tracking-[0.08em] text-subtle uppercase">Era</span>
                {(["all", "historical", "2027", "threshold"] as const).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEraFilter(e)}
                    aria-pressed={eraFilter === e}
                    className={cn(
                      "rounded-sm px-2 py-1 font-mono text-micro tracking-wider uppercase",
                      eraFilter === e ? "bg-accent/20 text-accent neon-border-accent" : "text-subtle hover:text-muted",
                    )}
                  >
                    {e === "all" ? "All" : ERA_LABEL[e]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSeatOnly((v) => !v)}
                  aria-pressed={seatOnly}
                  className={cn(
                    "rounded-sm px-2 py-1 font-mono text-micro tracking-wider uppercase",
                    seatOnly ? "bg-accent/20 text-accent neon-border-accent" : "text-subtle hover:text-muted",
                  )}
                >
                  {seatOnly ? `Seat ${country}` : "All seats"}
                </button>
              </div>
              {selectedDef?.briefing || selectedDef?.contentNote ? (
                <p className="mt-2 text-xs leading-snug text-accent/80">
                  {selectedDef.briefing ?? selectedDef.contentNote}
                </p>
              ) : null}
              <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100dvh-12rem)]">
                <ScenarioCard
                  title="Sandbox"
                  line="March 2027 · New START dead · pick your difficulty"
                  era="2027"
                  difficulty="player choice"
                  selected={scenario === null}
                  onClick={() => setScenario(null)}
                />
                {filteredScenarios.map((s) => (
                  <ScenarioCard
                    headline={briefFor(s.id)?.headline}
                    key={s.id}
                    title={s.title}
                    line={s.line}
                    era={ERA_LABEL[s.era]}
                    difficulty={s.difficulty}
                    seat={s.playerId}
                    selected={scenario === s.id}
                    onClick={() => {
                      setScenario(s.id);
                      setCountry(s.playerId as PlayableId);
                      setTeam(s.intent);
                    }}
                  />
                ))}
                {!filteredScenarios.length ? (
                  <p className="text-xs text-subtle">No watches match. Clear search or show all seats.</p>
                ) : null}
              </div>
            </aside>
          ) : (
            <GlassPanel className="hidden p-6 lg:block" glow="accent">
              <HudLabel>Command interface</HudLabel>
              <p className="mt-4 font-display text-2xl tracking-[0.12em] text-fg uppercase">Glass C2</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>· Cyan HUD · live globe · radar sweep</li>
                <li>· MIRV / decoy strike resolution</li>
                <li>· Ceasefire · pact ledger · C2 stances</li>
                <li>· {SCENARIOS.length} scripted scenario watches · historical close calls · phenomenology</li>
                <li>· Carrington / FOBS / orbital weapons · space weather</li>
                <li>· ORACLE / CHORUS / SKYNET · DEADHAND continuity (fictional)</li>
              </ul>
            </GlassPanel>
          )}
        </div>

        <footer className="mt-8 font-mono text-micro tracking-wider text-subtle uppercase">
          FAS / SIPRI 2026 estimates · Football = aide briefcase · Terminator = rogue C2
        </footer>
    </div>
  );
}

/** One labelled line of a scenario brief. */
/**
 * The record behind the scenario, collapsed by default.
 *
 * The repository carries a 1,584-line corpus of a hundred real incidents and
 * until now not one line of it reached a player. This is where it arrives: the
 * dates, counts and distances that make a scenario something you can check
 * rather than something you have to take on trust.
 *
 * Collapsed because it is depth, not the pitch -- the headline sells the
 * evening and this is for the player who wants to know whether any of it is
 * true. `whatHappened` and `afterward` are deliberately NOT here: those are the
 * ending, and they belong on the after-action screen.
 */
function BriefRecord({ brief }: { brief: ScenarioBrief }) {
  return (
    <details className="group mt-2 border-t border-border pt-2">
      <summary className="cursor-pointer list-none font-mono text-micro tracking-wider text-subtle uppercase hover:text-accent">
        <span className="group-open:hidden">▸ </span>
        <span className="hidden group-open:inline">▾ </span>
        The record · {brief.facts.length} facts
      </summary>
      <ul className="mt-1.5 space-y-1.5">
        {brief.facts.map((fact) => (
          <li key={fact} className="flex gap-2 text-xs leading-relaxed text-muted">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
            <span className="min-w-0">{fact}</span>
          </li>
        ))}
      </ul>
      {brief.precedent ? (
        <p className="mt-2 text-xs leading-relaxed text-subtle">
          <span className="font-mono text-micro tracking-wider uppercase">Precedent · </span>
          {brief.precedent}
        </p>
      ) : null}
    </details>
  );
}

/**
 * One watch a day, the same one for everybody.
 *
 * The engine has been fully deterministic since replay codes shipped, so this
 * needs no server and no account: the date decides the seed and the scenario,
 * and two people on opposite sides of the world get the same evening without
 * ever talking to each other.
 *
 * Rendered from an effect rather than during the first render because the
 * streak lives in localStorage and the date comes from the client clock —
 * reading either while server-rendering would produce markup the browser then
 * disagrees with.
 */
function DailyWatchPanel() {
  const start = useGame((s) => s.start);
  const [today, setToday] = useState<DailyWatch | null>(null);
  const [record, setRecord] = useState<DailyRecord | null>(null);

  useEffect(() => {
    const watch = dailyWatch();
    setToday(watch);
    setRecord(getCareerStats().daily ?? null);
  }, []);

  if (!today) return null;
  const def = SCENARIOS.find((s) => s.id === today.scenarioId);
  const playedToday = record?.lastKey === today.key;

  return (
    <div className="mt-4 rounded-lg border border-accent/25 bg-surface/50 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-micro tracking-wider text-accent uppercase">Daily watch · {today.key}</p>
        {record && record.streak > 0 ? (
          <p className="font-mono text-micro text-subtle uppercase">
            streak {record.streak}
            {record.bestStreak > record.streak ? ` · best ${record.bestStreak}` : ""}
          </p>
        ) : null}
      </div>
      <p className="mt-1 text-sm leading-snug text-fg">{today.title}</p>
      <p className="mt-0.5 text-xs leading-snug text-subtle">
        {playedToday
          ? "Played today. Your result is on the end screen, ready to copy."
          : "One seed, one scenario, the same for everyone today."}
      </p>
      <HudButton
        variant={playedToday ? "ghost" : "accent"}
        className="mt-2 min-h-11 w-full text-xs uppercase"
        onClick={() =>
          start({
            difficulty: def?.difficulty ?? "standard",
            playerId: def?.playerId ?? "US",
            intent: def?.intent ?? "blue",
            scenarioId: today.scenarioId,
            seed: today.seed,
            dailyKey: today.key,
            deadhand: def?.defaultDeadhand,
            strategicAI: def?.defaultAI,
          })
        }
      >
        {playedToday ? "Play today's watch again" : "Play today's watch"}
      </HudButton>
    </div>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-micro tracking-wider text-subtle uppercase">{label}</dt>
      <dd className="mt-0.5 text-xs leading-relaxed text-muted">{value}</dd>
    </div>
  );
}

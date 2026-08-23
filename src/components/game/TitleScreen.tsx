import { abandonSave, useGame } from "@/lib/game/store";
import { hasSave } from "@/lib/game/save";
import { slotMeta } from "@/lib/game/slots";
import { SCENARIO_CATEGORIES, SCENARIOS, type ScenarioCategory, type ScenarioEra, type ScenarioId } from "@/lib/game/scenarios";
import type { Difficulty, PlayableId, Team } from "@/lib/game/types";
import { PLAYABLE } from "@/lib/game/command";
import { DEADHAND_CONFIGS, STRATEGIC_AI_CONFIGS, type DeadhandMode, type StrategicAIMode } from "@/lib/game/strategicSystems";
import { useMemo, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { GlassPanel, HudButton, HudChip, HudLabel, ScenarioCard } from "./ui/Hud";

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
      return `${s.title} ${s.line} ${s.playerId} ${s.id} ${s.category}`.toLowerCase().includes(q);
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
              variant="danger"
              aria-label="Begin watch"
              className="mt-6 min-h-14 w-full px-4 text-lg"
              onClick={launchWatch}
            >
              Begin watch
            </HudButton>
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
            {selectedDef ? <p className="mt-2 text-sm text-fg">{selectedDef.title}</p> : null}

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
                    <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-muted">
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
                  <p className="mt-2 font-mono text-[9px] tracking-wider text-subtle uppercase">Nuclear states</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {PLAYABLE.filter((p) => p.group === "nuclear").map((p) => (
                      <HudButton
                        key={p.id}
                        variant={country === p.id ? "active" : "default"}
                        className="min-h-10 px-2 py-2 text-left text-xs"
                        onClick={() => setCountry(p.id)}
                      >
                        {p.id}
                      </HudButton>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[9px] tracking-wider text-subtle uppercase">Threshold / other</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {PLAYABLE.filter((p) => p.group === "other").map((p) => (
                      <HudButton
                        key={p.id}
                        variant={country === p.id ? "accent" : "default"}
                        className="min-h-10 px-2 py-2 text-left text-xs"
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
                  <p className="mt-3 font-mono text-[9px] tracking-wider text-subtle uppercase">Command intelligence</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {STRATEGIC_AI_CONFIGS.map((cfg) => (
                      <HudButton
                        key={cfg.id}
                        variant={aiMode === cfg.id ? "active" : "default"}
                        className="min-h-12 p-2 text-left text-[11px]"
                        onClick={() => {
                          setAiMode(cfg.id);
                          if (cfg.id === "skynet") setTerminator(true);
                        }}
                      >
                        <span className="font-display tracking-wider uppercase">{cfg.label}</span>
                        <span className="mt-1 block text-[10px] font-normal normal-case text-muted">{cfg.risk}</span>
                      </HudButton>
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-[9px] tracking-wider text-subtle uppercase">Continuity</p>
                  <div className="mt-2 grid grid-cols-1 gap-1.5">
                    {DEADHAND_CONFIGS.map((cfg) => (
                      <HudButton
                        key={cfg.id}
                        variant={deadhand === cfg.id ? "accent" : "default"}
                        className="min-h-12 p-2 text-left text-[11px]"
                        onClick={() => setDeadhand(cfg.id)}
                      >
                        <span className="font-display tracking-wider uppercase">{cfg.label}</span>
                        <span className="mt-1 block text-[10px] font-normal normal-case text-muted">{cfg.line}</span>
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
                        <span className="mt-1 block font-mono text-[10px] text-subtle">
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
                  className="mt-2 h-16 w-full rounded-md border border-accent/20 bg-bg/60 px-3 py-2 font-mono text-[11px] text-fg outline-none focus:neon-border-accent"
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
                className="mt-2 h-9 w-full rounded-md glass-panel px-3 font-mono text-[11px] text-fg outline-none focus:neon-border-accent"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SCENARIO_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryFilter(c.id)}
                    className={cn(
                      "rounded-sm px-2 py-1 font-mono text-[9px] tracking-wider uppercase",
                      categoryFilter === c.id ? "bg-accent/20 text-accent neon-border-accent" : "text-subtle hover:text-muted",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
                {(["all", "historical", "2027", "threshold"] as const).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEraFilter(e)}
                    className={cn(
                      "rounded-sm px-2 py-1 font-mono text-[9px] tracking-wider uppercase",
                      eraFilter === e ? "bg-accent/20 text-accent neon-border-accent" : "text-subtle hover:text-muted",
                    )}
                  >
                    {e === "all" ? "All" : ERA_LABEL[e]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSeatOnly((v) => !v)}
                  className={cn(
                    "rounded-sm px-2 py-1 font-mono text-[9px] tracking-wider uppercase",
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
                <li>· {SCENARIOS.length} scripted scenario watches · CN / UK / FR / PK seats</li>
                <li>· Carrington / FOBS / orbital weapons · space weather</li>
                <li>· ORACLE / CHORUS / SKYNET · DEADHAND continuity (fictional)</li>
              </ul>
            </GlassPanel>
          )}
        </div>

        <footer className="mt-8 font-mono text-[10px] tracking-wider text-subtle uppercase">
          FAS / SIPRI 2026 estimates · Football = aide briefcase · Terminator = rogue C2
        </footer>
    </div>
  );
}

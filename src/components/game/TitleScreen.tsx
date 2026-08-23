import { abandonSave, useGame } from "@/lib/game/store";
import { hasSave } from "@/lib/game/save";
import { slotMeta } from "@/lib/game/slots";
import { SCENARIOS, type ScenarioEra, type ScenarioId } from "@/lib/game/scenarios";
import type { Difficulty, PlayableId, Team } from "@/lib/game/types";
import { PLAYABLE } from "@/lib/game/command";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  FuturisticShell,
  GlassPanel,
  HudButton,
  HudChip,
  HudLabel,
  ScenarioCard,
} from "./ui/Hud";

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
  const [team, setTeam] = useState<Team | null>(null);
  const [country, setCountry] = useState<PlayableId | null>(null);
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [terminator, setTerminator] = useState(false);
  const [replayCode, setReplayCode] = useState("");
  const [eraFilter, setEraFilter] = useState<ScenarioEra | "all">("all");

  const seat = PLAYABLE.find((p) => p.id === country);
  const filteredScenarios = useMemo(
    () => (eraFilter === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.era === eraFilter)),
    [eraFilter],
  );

  return (
    <FuturisticShell>
      <div className="flex min-h-dvh flex-col px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
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
            <h1 className="font-display text-5xl font-bold tracking-[0.08em] text-glow-accent text-fg sm:text-7xl">
              THRESHOLD
            </h1>
            <p className="mt-2 font-display text-sm tracking-[0.32em] text-accent uppercase sm:text-base">
              Stay below the line
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              One event per month. One decision. The football is authentication, not a button. MIRV buses fail.
              Decoys soak interceptors. Humans refuse — and fire too soon.
            </p>

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
                        onClick={() =>
                          start({
                            difficulty: scenario ? SCENARIOS.find((s) => s.id === scenario)!.difficulty : d.id,
                            playerId: country,
                            intent: team,
                            terminator,
                            scenarioId: scenario ?? undefined,
                          })
                        }
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
                <HudChip>{SCENARIOS.length} watches</HudChip>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
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
              </div>
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
                    selected={scenario === s.id}
                    onClick={() => {
                      setScenario(s.id);
                      setCountry(s.playerId as PlayableId);
                      setTeam(s.intent);
                    }}
                  />
                ))}
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
                <li>· {SCENARIOS.length} scripted scenario watches</li>
              </ul>
            </GlassPanel>
          )}
        </div>

        <footer className="mt-8 font-mono text-[10px] tracking-wider text-subtle uppercase">
          FAS / SIPRI 2026 estimates · Football = aide briefcase · Terminator = rogue C2
        </footer>
      </div>
    </FuturisticShell>
  );
}

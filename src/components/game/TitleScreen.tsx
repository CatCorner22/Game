import { useGame } from "@/lib/game/store";
import { hasSave } from "@/lib/game/save";
import type { Difficulty, PlayableId, Team } from "@/lib/game/types";
import { PLAYABLE } from "@/lib/game/command";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DIFFS: { id: Difficulty; label: string; line: string }[] = [
  {
    id: "standard",
    label: "STANDARD",
    line: "Readable files. Hostile world. Forecasts on.",
  },
  {
    id: "hard",
    label: "HARD",
    line: "Worse intel. More crises. AI more willing to gamble.",
  },
  {
    id: "extreme",
    label: "EXTREME",
    line: "Sparse files. Fast clocks. No slack.",
  },
];

export function TitleScreen() {
  const start = useGame((s) => s.start);
  const resume = useGame((s) => s.resume);
  const setScreen = useGame((s) => s.setScreen);
  const [save] = useState(() => hasSave());
  const [team, setTeam] = useState<Team | null>(null);
  const [country, setCountry] = useState<PlayableId | null>(null);
  const [terminator, setTerminator] = useState(false);

  const seat = PLAYABLE.find((p) => p.id === country);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-bg">
      <img
        src="/textures/command-room.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/80 to-bg/30" />
      <div className="scanline absolute inset-0 opacity-40" />
      <div className="relative z-10 flex min-h-dvh flex-col justify-between px-5 py-8 sm:px-10 sm:py-12">
        <p className="font-mono text-xs tracking-[0.28em] text-muted uppercase">
          National Command Authority
        </p>
        <div className="max-w-2xl">
          <h1 className="font-display text-6xl font-semibold tracking-[0.06em] text-fg sm:text-8xl">
            THRESHOLD
          </h1>
          <p className="mt-3 font-display text-lg tracking-[0.18em] text-accent uppercase sm:text-xl">
            Stay below the line
          </p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
            Avoid nuclear war. If war begins — win. One event a month. One
            decision. The football is a briefcase on a military aide's hip, not a
            button. Humans refuse. Humans also fire too soon.
          </p>

          <div className="mt-8">
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">1 · Intent</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setTeam("blue")}
                className={cn(
                  "min-h-16 rounded-md px-4 py-3 text-left shadow-[var(--shadow-border)]",
                  team === "blue" ? "bg-fg text-bg" : "bg-elevated text-fg",
                )}
              >
                <span className="font-display text-lg tracking-[0.16em]">BLUE</span>
                <span className="mt-1 block text-xs leading-snug opacity-80">
                  Good intent. Prevent war. If it starts, keep a country.
                </span>
              </button>
              <button
                onClick={() => setTeam("red")}
                className={cn(
                  "min-h-16 rounded-md px-4 py-3 text-left shadow-[var(--shadow-border)]",
                  team === "red" ? "bg-danger text-fg" : "bg-elevated text-fg",
                )}
              >
                <span className="font-display text-lg tracking-[0.16em]">RED</span>
                <span className="mt-1 block text-xs leading-snug opacity-80">
                  Bad intent. Coerce, split, dominate. A spasm war is still a loss.
                </span>
              </button>
            </div>
          </div>

          {team ? (
            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
                2 · Seat
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">Nuclear-weapon states</p>
              <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {PLAYABLE.filter((p) => p.group === "nuclear").map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCountry(p.id)}
                    className={cn(
                      "min-h-12 rounded-sm px-3 py-2 text-left",
                      country === p.id ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                    )}
                  >
                    <span className="font-display text-sm tracking-[0.08em]">{p.name}</span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-wider opacity-70 uppercase">
                      {p.seat}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
                Other seats
              </p>
              <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {PLAYABLE.filter((p) => p.group === "other").map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCountry(p.id)}
                    className={cn(
                      "min-h-12 rounded-sm px-3 py-2 text-left",
                      country === p.id ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                    )}
                  >
                    <span className="font-display text-sm tracking-[0.08em]">{p.name}</span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-wider opacity-70 uppercase">
                      {p.seat}
                    </span>
                  </button>
                ))}
              </div>
              {seat ? (
                <p className="mt-3 text-sm text-muted">
                  <span className="text-fg">{seat.seat}.</span>{" "}
                  {team === "blue" ? seat.blue : seat.red}
                </p>
              ) : null}
            </div>
          ) : null}

          {team && country ? (
            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">3 · C2</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTerminator(false)}
                  className={cn(
                    "min-h-16 rounded-md px-4 py-3 text-left shadow-[var(--shadow-border)]",
                    !terminator ? "bg-fg text-bg" : "bg-elevated text-fg",
                  )}
                >
                  <span className="font-display text-lg tracking-[0.16em]">HUMAN</span>
                  <span className="mt-1 block text-xs leading-snug opacity-80">
                    Officers, football, refusal. The aide still matters.
                  </span>
                </button>
                <button
                  onClick={() => setTerminator(true)}
                  className={cn(
                    "min-h-16 rounded-md px-4 py-3 text-left shadow-[var(--shadow-border)]",
                    terminator ? "bg-danger text-fg" : "bg-elevated text-fg",
                  )}
                >
                  <span className="font-display text-lg tracking-[0.16em]">TERMINATOR</span>
                  <span className="mt-1 block text-xs leading-snug opacity-80">
                    Rogue model on the keys. It does not wait. It does not refuse.
                  </span>
                </button>
              </div>
            </div>
          ) : null}

          {team && country ? (
            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">4 · Difficulty</p>
              <div className="mt-2 flex flex-col gap-2">
                {DIFFS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() =>
                      start({ difficulty: d.id, playerId: country, intent: team, terminator })
                    }
                    className="group flex min-h-12 items-center justify-between gap-4 rounded-md bg-elevated px-4 py-3 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)] active:scale-[0.99]"
                  >
                    <span className="font-display text-lg tracking-[0.14em] text-fg">
                      {d.label}
                    </span>
                    <span className="text-sm text-muted">{d.line}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            {save ? (
              <button
                onClick={() => resume()}
                className="min-h-11 px-3 font-display tracking-[0.16em] text-accent uppercase"
              >
                Continue watch
              </button>
            ) : null}
            <button
              onClick={() => setScreen("briefing")}
              className="min-h-11 px-3 font-display tracking-[0.16em] text-muted uppercase hover:text-fg"
            >
              How it works
            </button>
          </div>
        </div>
        <p className="font-mono text-[11px] tracking-wider text-subtle uppercase">
          Arsenals: FAS / SIPRI 2026 estimates · Football = Military Aide briefcase · Terminator = rogue C2 model
        </p>
      </div>
    </div>
  );
}

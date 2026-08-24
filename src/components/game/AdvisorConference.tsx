import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "@/lib/game/store";
import { currentDecision } from "@/lib/game/decisions";
import { formatCountdown } from "@/lib/game/flight";
import { currentPost, inTransit } from "@/lib/game/posts";
import { ADDRESS_STYLES, addressFor } from "@/lib/game/advisors/address";
import { type Advisor, initialsOf } from "@/lib/game/advisors/roster";
import {
  type AdvisorStance,
  RUNGS,
  advisorStance,
  clockSpent,
  participants,
  roomConsensus,
  unreachable,
} from "@/lib/game/advisors/conference";
import {
  type ConferenceLine,
  openingLine,
  recommendationLine,
  replyLine,
  situationLine,
  tileStatus,
} from "@/lib/game/advisors/script";
import { cn } from "@/lib/utils";
import { trackClockKey, useTrackClock } from "./useTrackClock";
import { elaborate, modelKnownUnavailable } from "@/lib/advisor/client";

interface Turn extends ConferenceLine {
  key: string;
  mine?: boolean;
  /**
   * The player's question, when this line is an answer to one.
   *
   * `elaborate` has always accepted a `playerMessage` and the route has always
   * handled it -- there is even a test asserting player text arrives as user
   * content and never as a system instruction. But the one call site passed
   * three arguments, so the question was dropped on the floor: even with a key
   * configured, the model re-voiced a regex-routed scripted answer without ever
   * being shown what was asked. Carrying it on the reply is what closes that.
   */
  askedAbout?: string;
}

/**
 * The warning conference.
 *
 * Rendered as an overlay from `GameApp` rather than as a `Screen`, deliberately:
 * `confirmAndExecute` recomputes `screen` from world state on every committed
 * turn, so a "meeting" screen would be yanked away the moment the player acted.
 * An overlay survives that and works over `play` and `war` alike.
 *
 * The conversation is presentation. The mechanical effect is the decision card
 * at the bottom, which resolves to an ordinary `PlayerAction` and replays.
 */
export function AdvisorConference() {
  const world = useGame((s) => s.world);
  const open = useGame((s) => s.conferenceOpen);
  const setOpen = useGame((s) => s.setConferenceOpen);
  const conveneAt = useGame((s) => s.convene);
  const chooseDecision = useGame((s) => s.chooseDecision);
  const setAddressStyle = useGame((s) => s.setAddressStyle);

  const [draft, setDraft] = useState("");
  const [said, setSaid] = useState<Turn[]>([]);
  const [focused, setFocused] = useState<string | null>(null);
  // Model-rewritten wording, keyed by line. The scripted line renders first and
  // is replaced in place if a model is configured, so the call is never waiting
  // on the network to be usable.
  const [voiced, setVoiced] = useState<Record<string, string>>({});
  const [modelOn, setModelOn] = useState(false);
  /**
   * Whether we know the model is off, as opposed to not yet knowing.
   *
   * The only signal used to be positive -- the header said "voices generated"
   * when a key was configured and nothing at all when one was not. Since no key
   * is the default and what almost everybody runs, the shallow scripted answers
   * read as bad writing rather than as a configuration state nobody had been
   * told about.
   */
  const [modelOff, setModelOff] = useState(false);
  const attemptedRef = useRef<Set<string>>(new Set());
  const railRef = useRef<HTMLDivElement>(null);

  const rung = (world?.conferenceRung ?? 0) as 0 | 1 | 2 | 3;
  const clockKey = trackClockKey(world ?? null);
  const clock = useTrackClock(clockKey, world?.closeCall?.track.minutesToImpact ?? 0);
  const spent = world ? clockSpent(world) : 0;

  const room = useMemo(
    () => (world && rung ? participants(world, rung as 1 | 2 | 3) : []),
    [world, rung],
  );
  const missing = useMemo(
    () => (world && rung ? unreachable(world, rung as 1 | 2 | 3) : []),
    [world, rung],
  );
  const stances = useMemo(() => {
    if (!world) return new Map<string, AdvisorStance>();
    const m = new Map<string, AdvisorStance>();
    for (const a of room) {
      const st = advisorStance(world, a);
      if (st) m.set(a.id, st);
    }
    return m;
  }, [world, room]);

  // Everyone who joins says one thing when they arrive. Keyed on the rung and
  // the turn so climbing the ladder adds voices rather than replaying the room.
  const openings = useMemo<Turn[]>(() => {
    if (!world || !rung) return [];
    return room.map((a) => ({
      ...openingLine(world, a, stances.get(a.id) ?? null),
      key: `open:${a.id}:${world.turn}:${rung}`,
    }));
  }, [world, room, rung, stances]);

  const transcript = useMemo(
    () => [...openings, ...said].map((t) => (voiced[t.key] ? { ...t, text: voiced[t.key] } : t)),
    [openings, said, voiced],
  );

  useEffect(() => {
    railRef.current?.scrollTo({ top: railRef.current.scrollHeight });
  }, [transcript.length]);

  // Reset the local transcript whenever the call itself changes.
  //
  // Declared BEFORE the elaboration effect on purpose: effects run in
  // declaration order, so with this second it cleared `attemptedRef` on the
  // very render the elaboration effect had just populated it, and every line
  // was requested twice. Ordering is the fix, not a guard.
  useEffect(() => {
    setSaid([]);
    setDraft("");
    setVoiced({});
    attemptedRef.current = new Set();
  }, [clockKey, rung]);

  // Hand each new advisor line to the server to be re-voiced. Failure, a
  // timeout, and "no key configured" all resolve to the scripted line, so this
  // can only ever change wording -- never what is offered or what happens.
  //
  // Attempts are tracked in a ref rather than derived from `voiced`, for two
  // reasons. Keying off `voiced` would have put it in this effect's deps, so
  // every successful reply tore down the in-flight loop and restarted it --
  // O(n^2) provider calls for n lines, which a rate-limited provider would
  // refuse. And a line the model declined to answer never lands in `voiced`,
  // so it would have been retried on every subsequent run forever. One attempt
  // per line, win or lose.
  useEffect(() => {
    if (!world || !open) return;
    if (modelKnownUnavailable()) return;
    const pending = [...openings, ...said].filter((t) => !t.mine && !attemptedRef.current.has(t.key));
    if (!pending.length) return;
    let live = true;
    void (async () => {
      for (const turn of pending.slice(0, 12)) {
        const advisor = room.find((a) => a.id === turn.advisorId);
        if (!advisor) continue;
        attemptedRef.current.add(turn.key);
        const reply = await elaborate(world, advisor, turn, turn.askedAbout);
        if (!live) return;
        if (reply.mode === "model") {
          setModelOn(true);
          setVoiced((prev) => (prev[turn.key] ? prev : { ...prev, [turn.key]: reply.text }));
        } else if (reply.note?.includes("ADVISOR_API_KEY")) {
          setModelOff(true);
          return;
        }
      }
    })();
    return () => {
      live = false;
    };
  }, [world, open, openings, said, room]);

  if (!world || !open) return null;

  const card = currentDecision(world);
  const consensus = rung ? roomConsensus(world, rung as 1 | 2 | 3) : null;
  const you = addressFor(world);
  const post = currentPost(world);
  const remaining = clock ? Math.max(0, clock.remainingSec - spent) : null;
  const nextRung = RUNGS.find((r) => r.rung === rung + 1);

  function send() {
    const text = draft.trim();
    if (!text || !world) return;
    const target = room.find((a) => a.id === focused) ?? pickResponder(room, text);
    const mine: Turn = {
      advisorId: "you",
      name: you,
      role: post.short,
      text,
      deferring: false,
      key: `me:${Date.now()}:${text.length}`,
      mine: true,
    };
    const reply: Turn | null = target
      ? {
          ...replyLine(world, target, stances.get(target.id) ?? null, text),
          key: `re:${target.id}:${Date.now()}`,
          askedAbout: text,
        }
      : null;
    setSaid((prev) => [...prev, mine, ...(reply ? [reply] : [])]);
    setDraft("");
  }

  function askForRecommendations() {
    if (!world) return;
    setSaid((prev) => [
      ...prev,
      // No card on the desk means nothing to recommend -- decision cards start
      // at turn 2 -- so the room gives its read of the situation instead.
      ...room.map((a) => {
        const st = stances.get(a.id);
        const line = st ? recommendationLine(world, a, st) : situationLine(world, a);
        return { ...line, key: `rec:${a.id}:${prev.length}` };
      }),
    ]);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Advisor conference"
    >
      {/* ── Call header ─────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-3 py-2 sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-micro tracking-[0.2em] text-accent uppercase">
            {rung ? RUNGS[rung - 1].name : "Warning conference"}
          </p>
          <p className="truncate text-xs text-subtle">
            {post.short}
            {inTransit(world) ? " · in transit · degraded" : ""} · {room.length} on the call
            {missing.length ? ` · ${missing.length} unreachable` : ""}
            {modelOn ? " · voices generated" : modelOff ? " · scripted voices" : ""}
          </p>
        </div>
        {remaining !== null ? (
          <div className="text-right">
            <p className="font-display text-2xl tabular text-fg">{formatCountdown(remaining)}</p>
            <p className="font-mono text-micro tracking-wider text-subtle uppercase">
              {spent ? `${spent}s spent convening` : "decision clock"}
            </p>
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Leave call"
          onClick={() => setOpen(false)}
          className="min-h-11 rounded-md bg-elevated px-3 font-display text-xs tracking-wider text-fg"
        >
          Leave call
        </button>
      </header>

      {modelOff ? (
        <p className="border-b border-border bg-surface/40 px-3 py-2 text-micro leading-snug text-subtle sm:px-5">
          These advisors are speaking their written lines. They still read the situation, still
          recommend, and still disagree \u2014 but they cannot answer a question nobody wrote for
          them. Set <span className="font-mono text-muted">ADVISOR_API_KEY</span> on the server to let
          them speak freely; the key stays server-side and never reaches this browser.
        </p>
      ) : null}

      {rung === 0 ? (
        <ConveneGate onConvene={() => conveneAt(1)} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* ── Participant grid ──────────────────────────────────── */}
          {/* `shrink-0` with no height cap meant nine tiles at US rung three
              pushed the transcript, the composer and the decide tray off a
              667px screen entirely -- the room was unusable on a phone at
              exactly the rung you convene it for. Capped to roughly a third of
              the viewport on mobile and allowed to scroll; unchanged on
              desktop, where the column is a fixed 42% and has the room. */}
          <div className="max-h-[34dvh] min-h-0 shrink-0 overflow-y-auto border-b border-border p-3 lg:max-h-none lg:w-[42%] lg:border-r lg:border-b-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {room.map((a) => (
                <ParticipantTile
                  key={a.id}
                  advisor={a}
                  status={tileStatus(world, a)}
                  stance={stances.get(a.id) ?? null}
                  active={focused === a.id}
                  onClick={() => setFocused(focused === a.id ? null : a.id)}
                />
              ))}
            </div>

            {missing.length ? (
              <p className="mt-3 rounded-sm border border-warn/40 bg-warn/10 px-2 py-1 font-mono text-micro text-warn uppercase">
                Cannot reach from {post.short}: {missing.map((a) => a.role).join(", ")}
              </p>
            ) : null}

            {nextRung ? (
              <button
                type="button"
                onClick={() => conveneAt(nextRung.rung)}
                className="mt-3 w-full rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-left transition-colors hover:bg-accent/20"
              >
                <span className="font-display text-xs tracking-wider text-accent uppercase">
                  Convene {nextRung.name}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-subtle">
                  {nextRung.detail} Costs {nextRung.clockCost}s of the clock and raises your observable signature.
                </span>
              </button>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-subtle">
                Everyone who can be on this call is on it. Every capital watching your communications knows that.
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-micro tracking-wider text-subtle uppercase">Address me as</span>
              {ADDRESS_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  aria-pressed={(world.addressStyle ?? "neutral") === style.id}
                  onClick={() => setAddressStyle(style.id)}
                  className={cn(
                    "min-h-8 rounded-sm border px-2 font-mono text-micro uppercase transition-colors",
                    (world.addressStyle ?? "neutral") === style.id
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-border bg-surface/40 text-subtle hover:border-accent/40",
                  )}
                >
                  {style.label}
                </button>
              ))}
              <span className="font-mono text-micro text-subtle">“{you}”</span>
            </div>
          </div>

          {/* ── Transcript + composer + decision tray ─────────────── */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div ref={railRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
              {transcript.map((t) => (
                <Line key={t.key} turn={t} />
              ))}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="conference-input">
                  Speak to the room
                </label>
                <input
                  id="conference-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder={focused ? `Ask ${room.find((a) => a.id === focused)?.name}…` : "Speak to the room…"}
                  className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-surface/60 px-3 text-sm text-fg placeholder:text-subtle"
                />
                <button
                  type="button"
                  onClick={send}
                  className="min-h-11 shrink-0 rounded-md bg-accent/20 px-3 font-display text-xs tracking-wider text-accent uppercase"
                >
                  Send
                </button>
              </div>
              <button
                type="button"
                onClick={askForRecommendations}
                className="mt-2 min-h-9 rounded-sm border border-border px-2 font-mono text-micro tracking-wider text-subtle uppercase hover:border-accent/40"
              >
                Go around the room
              </button>
            </div>

            {card ? (
              <div className="border-t border-border bg-surface/40 p-3">
                <p className="font-mono text-micro tracking-[0.18em] text-accent uppercase">{card.prompt}</p>
                {consensus ? (
                  <p className="mt-1 font-mono text-micro text-subtle uppercase">
                    Room leans {card.options.find((o) => o.id === consensus.optionId)?.label ?? consensus.optionId} ·{" "}
                    {Math.round(consensus.share * 100)}%
                  </p>
                ) : null}
                <div className="mt-2 grid grid-cols-1 gap-1.5">
                  {card.options.map((opt) => {
                    const backing = [...stances.values()].filter((s) => s.optionId === opt.id).length;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => chooseDecision(opt.id)}
                        className="min-h-11 rounded-sm border border-accent/25 bg-surface/60 px-2 py-1.5 text-left transition-colors hover:border-accent/50"
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-xs tracking-wider text-fg">{opt.label}</span>
                          <span className="shrink-0 font-mono text-micro text-subtle uppercase">
                            {backing ? `${backing} for` : "no backers"}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-subtle">{opt.detail}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border-t border-border bg-surface/40 p-3">
                <p className="font-mono text-micro tracking-[0.18em] text-subtle uppercase">
                  No decision on the desk
                </p>
                <p className="mt-1 text-xs leading-relaxed text-subtle">
                  The room is briefing you, not waiting on you. When something arrives that needs a call, the
                  options appear here and whatever you choose is what actually happens.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConveneGate({ onConvene }: { onConvene: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-micro tracking-[0.2em] text-accent uppercase">Warning conference</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The historical sequence escalates in three rungs. A technical call among duty officers first; senior
          operational commanders when the event cannot be dismissed; national leadership last. Each rung costs
          time and widens the circle of people who now believe something might be happening.
        </p>
        <button
          type="button"
          onClick={onConvene}
          className="mt-4 min-h-11 rounded-md bg-accent/20 px-4 font-display text-sm tracking-wider text-accent uppercase"
        >
          Convene Missile Display Conference
        </button>
      </div>
    </div>
  );
}

function ParticipantTile({
  advisor,
  status,
  stance,
  active,
  onClick,
}: {
  advisor: Advisor;
  status: string;
  stance: AdvisorStance | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col rounded-md border bg-elevated/60 p-2 text-left transition-colors",
        active ? "border-accent/70 bg-accent/10" : "border-border hover:border-accent/40",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-md font-display text-sm tracking-wider",
            stance?.deferring ? "bg-warn/20 text-warn" : "bg-accent/15 text-accent",
          )}
          aria-hidden
        >
          {initialsOf(advisor)}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-xs leading-tight tracking-wide text-fg">{advisor.name}</span>
          <span className="block truncate font-mono text-micro text-subtle">{advisor.rank}</span>
        </span>
      </span>
      <span className="mt-1 line-clamp-2 text-xs leading-snug text-muted">{advisor.role}</span>
      <span className="mt-1 font-mono text-micro text-subtle uppercase">{status}</span>
      {stance?.deferring ? (
        <span className="mt-0.5 font-mono text-micro text-warn uppercase">telling you what you want to hear</span>
      ) : null}
    </button>
  );
}

function Line({ turn }: { turn: Turn }) {
  if (turn.mine) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg rounded-br-sm bg-accent/15 px-3 py-2">
          <p className="text-sm leading-relaxed text-fg">{turn.text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[92%]">
      <p className="font-mono text-micro tracking-wider text-subtle uppercase">
        {turn.name} · {turn.role}
        {turn.deferring ? " · deferring" : ""}
      </p>
      <div
        className={cn(
          "mt-0.5 rounded-lg rounded-tl-sm border px-3 py-2",
          turn.deferring ? "border-warn/30 bg-warn/5" : "border-border bg-surface/50",
        )}
      >
        <p className="text-sm leading-relaxed text-fg">{turn.text}</p>
      </div>
    </div>
  );
}

/** Route an unaddressed question to whoever most plausibly owns it. */
function pickResponder(room: Advisor[], text: string): Advisor | undefined {
  const m = text.toLowerCase();
  const want = (b: Advisor["branch"]) => room.find((a) => a.branch === b);
  if (/legal|lawful|authori[sz]/.test(m)) return want("legal") ?? want("civilian") ?? room[0];
  if (/confiden|source|sensor|intel|corrobor|assess/.test(m)) return want("intel") ?? want("watch") ?? room[0];
  if (/time|minutes|clock|posture|force|launch/.test(m)) return want("strategic") ?? want("watch") ?? room[0];
  if (/hotline|channel|talk|call them|diplomat/.test(m)) return want("diplomatic") ?? want("civilian") ?? room[0];
  return want("watch") ?? room[0];
}

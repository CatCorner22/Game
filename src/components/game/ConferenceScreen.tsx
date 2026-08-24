import { useEffect, useMemo, useRef, useState } from "react";
import type { World } from "@/lib/game/types";
import { useGame } from "@/lib/game/store";
import { currentDecision } from "@/lib/game/decisions";
import { formatCountdown } from "@/lib/game/flight";
import { currentPost, inTransit } from "@/lib/game/posts";
import { ADDRESS_STYLES, addressFor } from "@/lib/game/advisors/address";
import { type Advisor, ageOf, initialsOf } from "@/lib/game/advisors/roster";
import { bodyFor } from "@/lib/game/advisors/bodies";
import { asPlayable } from "@/lib/game/command";
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
 * The room.
 *
 * This was an overlay, on the reasoning that `confirmAndExecute` recomputes
 * `screen` from world state on every committed turn and would therefore yank a
 * "meeting" screen away the moment the player acted. True, and it turned out to
 * be the behaviour you want: committing a turn *should* end the call. So the
 * conversion routes navigation through `setConferenceOpen`, which now sets
 * `screen` alongside the flag -- every existing call site opens the room
 * unchanged, and `confirmAndExecute` already clears the flag and recomputes the
 * screen, which lands you back on the watch with the turn resolved.
 *
 * What a full screen buys that an overlay could not: a stage. An overlay at
 * 34dvh of tiles over a transcript can show you who is on the call; it cannot
 * show you who is *talking*, which is the one thing a real call makes obvious
 * and the reason a wall of equal tiles reads as a list rather than a room.
 *
 * The conversation is presentation. The mechanical effect is the decision card
 * in the tray, which resolves to an ordinary `PlayerAction` and replays.
 */
export function ConferenceScreen() {
  const world = useGame((s) => s.world);
  const setOpen = useGame((s) => s.setConferenceOpen);
  const conveneAt = useGame((s) => s.convene);
  const chooseDecision = useGame((s) => s.chooseDecision);
  const setAddressStyle = useGame((s) => s.setAddressStyle);

  const [draft, setDraft] = useState("");
  const [said, setSaid] = useState<Turn[]>([]);
  const [focused, setFocused] = useState<string | null>(null);
  /**
   * Which half of the room a phone is showing.
   *
   * Desktop shows the participants beside the transcript and has the width for
   * it. A phone does not: the stage, eleven tiles at rung three, the rung
   * ladder, the transcript, the composer and the decision tray in one column
   * left the transcript twenty-four pixels tall on a 667px screen -- the rail
   * scrolled, technically, and was unreadable. Capping the tiles harder only
   * moves which half is unusable. So the phone gets the two views a call app
   * gives you, and switches between them.
   */
  const [pane, setPane] = useState<"room" | "transcript">("room");
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

  // As an overlay this got dismissal for free from the backdrop. A screen has
  // no backdrop, so Escape has to be wired: leaving a call should never require
  // finding a button. Ignored while the composer has focus so a player clearing
  // a half-typed question does not also walk out of the room.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

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
    if (!world) return;
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
  }, [world, openings, said, room]);

  if (!world) return null;

  const card = currentDecision(world);
  const consensus = rung ? roomConsensus(world, rung as 1 | 2 | 3) : null;
  const you = addressFor(world);
  const post = currentPost(world);
  const remaining = clock ? Math.max(0, clock.remainingSec - spent) : null;
  const nextRung = RUNGS.find((r) => r.rung === rung + 1);
  const body = bodyFor(asPlayable(world.playerId));
  // Whoever spoke last holds the stage, exactly as a call would put them there.
  // Falls back to whoever you have selected, then to the senior figure in the
  // room, so the stage is never empty while there are people on the call.
  const lastSpoken = [...transcript].reverse().find((t) => !t.mine);
  const speaker =
    room.find((a) => a.id === lastSpoken?.advisorId) ?? room.find((a) => a.id === focused) ?? room[0];

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
    setPane("transcript");
  }

  function askForRecommendations() {
    if (!world) return;
    // Otherwise, on a phone showing the room, going around it appends eleven
    // lines to a rail the player cannot see and nothing appears to happen.
    setPane("transcript");
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
    // `h-dvh`, not `min-h-dvh`. The overlay was `fixed inset-0`, which gave the
    // flex column a hard height, which is what makes `min-h-0 flex-1
    // overflow-y-auto` on the transcript actually scroll. A minimum height has
    // no maximum, so the rail grew to its content -- 4500px of transcript --
    // and pushed the composer and the decide tray three screens down the page
    // instead of scrolling inside itself.
    <div className="flex h-dvh flex-col overflow-hidden" aria-label="Advisor conference">
      {/* ── Call header ─────────────────────────────────────────────── */}
      <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-3 py-2 sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-micro tracking-[0.2em] text-accent uppercase">
            {rung ? RUNGS[rung - 1].name : "Warning conference"}
          </p>
          {/* The room has a name. It is the same real body `StaffPanel` heads
              the cabinet with, so the two views read as one institution rather
              than as two unrelated advice widgets. */}
          <p className="truncate font-display text-sm tracking-wide text-fg">{body.name}</p>
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
        <p className="shrink-0 border-b border-border bg-surface/40 px-3 py-2 text-micro leading-snug text-subtle sm:px-5">
          These advisors are speaking their written lines. They still read the situation, still
          recommend, and still disagree — but they cannot answer a question nobody wrote for
          them. Set <span className="font-mono text-muted">ADVISOR_API_KEY</span> on the server to let
          them speak freely; the key stays server-side and never reaches this browser.
        </p>
      ) : null}

      {rung !== 0 ? (
        <div className="flex shrink-0 border-b border-border lg:hidden" role="tablist" aria-label="Room view">
          {(["room", "transcript"] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={pane === id}
              onClick={() => setPane(id)}
              className={cn(
                "min-h-11 flex-1 font-mono text-micro tracking-wider uppercase transition-colors",
                pane === id ? "border-b-2 border-accent bg-accent/10 text-accent" : "text-subtle",
              )}
            >
              {id === "room" ? `Room · ${room.length}` : "Transcript"}
            </button>
          ))}
        </div>
      ) : null}

      {rung === 0 ? (
        <ConveneGate onConvene={conveneAt} hasClock={remaining !== null} body={body.name} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* ── Participant grid ──────────────────────────────────── */}
          {/* `shrink-0` with no height cap meant nine tiles at US rung three
              pushed the transcript, the composer and the decide tray off a
              667px screen entirely -- the room was unusable on a phone at
              exactly the rung you convene it for. Capped to roughly a third of
              the viewport on mobile and allowed to scroll; unchanged on
              desktop, where the column is a fixed 42% and has the room. */}
          <div
            className={cn(
              "min-h-0 overflow-y-auto border-b border-border p-3",
              pane === "room" ? "flex-1" : "hidden",
              "lg:block lg:w-[42%] lg:flex-none lg:border-r lg:border-b-0",
            )}
          >
            {speaker ? (
              <ActiveSpeaker
                advisor={speaker}
                world={world}
                status={tileStatus(world, speaker)}
                stance={stances.get(speaker.id) ?? null}
                saying={lastSpoken?.advisorId === speaker.id ? lastSpoken.text : null}
              />
            ) : null}

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
          {/* The composer and the tray stay mounted in both panes: you must be
              able to speak, and to take the decision, from either view. */}
          <div
            className={cn(
              "flex min-h-0 flex-col",
              pane === "transcript" ? "flex-1" : "flex-none",
              "lg:flex-1",
            )}
          >
            <div
              ref={railRef}
              className={cn(
                "min-h-0 flex-1 space-y-2 overflow-y-auto p-3",
                pane === "transcript" ? "block" : "hidden",
                "lg:block",
              )}
            >
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

function ConveneGate({
  onConvene,
  hasClock,
  body,
}: {
  onConvene: (rung: 1 | 2 | 3) => void;
  hasClock: boolean;
  body: string;
}) {
  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
      <div className="w-full max-w-lg">
        <p className="font-mono text-micro tracking-[0.2em] text-accent uppercase">Warning conference</p>
        <p className="mt-1 font-display text-lg tracking-wide text-fg">{body}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The historical sequence escalates in three rungs. A technical call among duty officers
          first; senior operational commanders when the event cannot be dismissed; national
          leadership last. Each rung widens the circle of people who now believe something might be
          happening, and other capitals can see a circle widen.
        </p>
        {/* The gate used to offer the first rung and nothing else, so a player
            who came here from "Convene the room" got a two-person duty-officer
            call and had to find the ladder inside to reach the cabinet they
            were invited to convene. The ladder is a real mechanic with a real
            price -- so show the price and let them buy the rung they want. */}
        <ul className="mt-4 space-y-2">
          {RUNGS.map((r) => (
            <li key={r.rung}>
              <button
                type="button"
                onClick={() => onConvene(r.rung)}
                className="w-full rounded-md border border-accent/30 bg-elevated/60 px-3 py-2.5 text-left transition-colors hover:border-accent/60 hover:bg-accent/10"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-sm tracking-wider text-accent uppercase">
                    {r.name}
                  </span>
                  <span className="shrink-0 font-mono text-micro text-subtle uppercase">
                    {r.signature ? `+${r.signature} signature` : "no cost"}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-subtle">{r.detail}</span>
                {r.clockCost ? (
                  <span className="mt-1 block font-mono text-micro text-warn uppercase">
                    {hasClock
                      ? `costs ${r.clockCost}s of the decision clock`
                      : `${r.clockCost}s of a decision clock, when one is running`}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ActiveSpeaker({
  advisor,
  world,
  status,
  stance,
  saying,
}: {
  advisor: Advisor;
  world: World;
  status: string;
  stance: AdvisorStance | null;
  saying: string | null;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        stance?.deferring ? "border-warn/40 bg-warn/5" : "border-accent/30 bg-elevated/70",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-lg font-display text-lg tracking-wider",
            stance?.deferring ? "bg-warn/20 text-warn" : "bg-accent/15 text-accent",
          )}
        >
          {initialsOf(advisor)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm leading-tight tracking-wide text-fg">{advisor.name}</p>
          <p className="mt-0.5 font-mono text-micro text-subtle">
            {advisor.rank} · {ageOf(advisor, world)}
          </p>
          <p className="mt-1 text-xs leading-snug text-muted">{advisor.role}</p>
          <p className="mt-1 font-mono text-micro text-subtle uppercase">
            {saying ? "speaking" : "on the call"} · {status}
          </p>
        </div>
      </div>
      {saying ? (
        <p className="mt-2 border-t border-border pt-2 text-sm leading-relaxed text-fg">{saying}</p>
      ) : null}
      {stance?.deferring ? (
        <p className="mt-1 font-mono text-micro text-warn uppercase">
          telling you what you want to hear
        </p>
      ) : null}
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

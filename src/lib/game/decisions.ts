/**
 * Decision cards — bespoke, situated choices attached to an event.
 *
 * The problem this solves: every turn in THRESHOLD had the same shape. An event
 * arrived, and the player picked one of the same eight verbs plus an intensity.
 * Events varied in prose but never in *decision structure*, which is a hard
 * ceiling on how interesting a turn can be. Meanwhile the thing that actually
 * makes a crisis hard — classify this from fragments, trust or override a
 * confident machine, act on attribution or wait for more — is a decision
 * *shape*, not text.
 *
 * How it stays cheap:
 *
 * - **Every option resolves to an ordinary `PlayerAction`.** `resolveTurn` keeps
 *   its exact contract and the AI, tick and consequence machinery is untouched.
 *   The card layers a delta on top via `effects`.
 * - **The chosen option id rides on the action** (`PlayerAction.decisionOptionId`)
 *   rather than living in loose world state. `replay.ts` records `PlayerAction`s,
 *   so a decision replays exactly, and `forecast()` sees it too.
 * - **The UI reuses the doctrine-chooser branch** in `ActionPanel`, so there is
 *   no new screen and nothing new to make mobile-safe.
 *
 * The window is the mechanically important part. A card can carry
 * `windowTurns`; options marked `costsWindow` let you stall, and when the window
 * runs out `timeoutOptionId` fires *by itself*. Stalling is a real choice with a
 * real cost, and the system acting without you is the point rather than a bug.
 */
import type { ActorId, GameEvent, PlayerAction, World } from "./types";
import { log } from "./simLog";
import { clamp } from "./rng";

export interface DecisionOption {
  id: string;
  /** Short, verb-first. */
  label: string;
  /** What you are actually choosing, and what it costs. */
  detail: string;
  /** The ordinary action this resolves to. */
  action: PlayerAction;
  /** Bespoke delta applied inside `resolveTurn`, so it replays. */
  effects?: (w: World) => void;
  /** Stalling options keep the card open and burn a month of the window. */
  costsWindow?: boolean;
  requires?: (w: World) => boolean;
}

export interface Decision {
  id: string;
  /** The question, stated plainly. */
  prompt: string;
  /** The epistemic situation: what you know, and what you do not. */
  frame: string;
  options: DecisionOption[];
  /** Months of slack before the system decides for you. Omit for no clock. */
  windowTurns?: number;
  /** Fires automatically when the window runs out. */
  timeoutOptionId?: string;
}

/**
 * Which builder owns the card currently on the desk.
 *
 * Only this — plus the window state — is stored on the world. The card itself
 * is rebuilt on demand, because `DecisionOption` carries functions (`effects`,
 * `requires`) and the world must stay cloneable and serializable:
 * `store.ts` `structuredClone`s it every turn, `forecast()` clones it twice per
 * render, and `save.ts` JSON-encodes it. `structuredClone` throws on functions,
 * and JSON silently drops them.
 *
 * Deriving the card also means its prose always reflects current world state
 * rather than the state it was authored against.
 */
export type DecisionKind = "warning" | "broken-arrow";

export interface DecisionState {
  kind: DecisionKind;
  id: string;
  /** Months of window left. Counts down only when a stalling option is taken. */
  remaining: number;
  openedTurn: number;
}

declare module "./types" {
  interface World {
    /** The card currently on the desk, if any. */
    decision?: DecisionState | null;
    /** Ids of decisions already resolved this watch, for anti-repeat. */
    decisionsSeen?: string[];
  }
  interface PlayerAction {
    /** Set when this action came from a decision card option. */
    decisionOptionId?: string;
  }
}

/**
 * Decisions never appear on the opening turn.
 *
 * Two reasons. Design: let the player meet the ordinary loop before the game
 * starts bending it. Practical: the mobile smoke test walks turn 1 of
 * `signal-window` and `deadhand-dilemma` and requires a button named exactly
 * `Execute`, which the decision branch replaces. `signal-window` seeds a close
 * call on turn 1, so without this floor CI would break the moment close-call
 * decisions were wired up.
 */
export const FIRST_DECISION_TURN = 2;

const act = (
  kind: PlayerAction["kind"],
  intensity: PlayerAction["intensity"],
  target: ActorId | null = null,
): PlayerAction => ({ kind, intensity, target });

// ---------------------------------------------------------------------------
// Card builders
// ---------------------------------------------------------------------------

/**
 * The warning conference. Real doctrine credits a warning only when two
 * physically independent sensor types agree — "dual phenomenology" — and the
 * historical near-misses (Thule 1960, the 1979 training tape, Petrov 1983) all
 * turn on someone noticing that the corroboration was not really independent.
 *
 * The card asks the player to commit to a reading while the clock runs.
 */
function closeCallDecision(world: World): Decision | null {
  const cc = world.closeCall;
  if (!cc) return null;
  const t = cc.track;
  const from = world.actors[t.from]?.shortName ?? t.from;
  const anomalous = t.kind === "anomalous";
  const boostLine =
    t.boosts > 0 ? `${t.boosts} infrared boost events` : "no infrared boost signature at all";
  return {
    id: `decision-warning-${world.turn}`,
    prompt: "Classify the track.",
    frame:
      `${t.source} holds a return on a ${t.azimuth} azimuth attributed to ${from}, ${t.confidence}% confidence, ` +
      `${t.minutesToImpact} minutes to impact if it is real. Radar and infrared report ${boostLine}. ` +
      (anomalous
        ? "The phenomenologies disagree, which is what a sensor fault looks like — and also what a real thing your sensors were not built for looks like. "
        : "") +
      (t.notified
        ? "A launch notice is on file for this window. "
        : "No launch notice is on file. ") +
      "Two independent sensor types agreeing is the standard. You do not have that yet.",
    windowTurns: 2,
    timeoutOptionId: "escalate-by-default",
    options: [
      {
        id: "retask",
        label: "Retask sensors — demand a second phenomenology",
        detail:
          "Costs a month of the window. Buys real corroboration instead of a louder version of the same feed.",
        action: act("intelligence", 2, t.from),
        costsWindow: true,
        effects: (w) => {
          const me = w.actors[w.playerId];
          me.intel = clamp(me.intel + 5, 0, 100);
          if (w.closeCall)
            w.closeCall.track.confidence = clamp(w.closeCall.track.confidence - 14, 5, 99);
          log(
            w,
            "info",
            "Second phenomenology requested",
            "You refused to credit one sensor type on its own.",
          );
        },
      },
      {
        id: "hotline",
        label: "Ask them directly on the hotline",
        detail: "Fast and cheap if the channel is honest. The channel is not always honest.",
        action: act("diplomacy", 1, t.from),
        effects: (w) => {
          log(
            w,
            "info",
            "Out-of-band read requested",
            "You asked the other side what you were looking at.",
          );
        },
      },
      {
        id: "hold-window",
        label: "Hold — preserve the decision window",
        detail: "Do nothing that writes a story. The track resolves or it does not.",
        action: act("hold", 1, null),
        costsWindow: true,
      },
      {
        id: "escalate-by-default",
        label: "Generate forces on this track",
        detail:
          "Treats an uncorroborated return as an attack indication. This is how 1983 nearly went the other way.",
        action: act("posture", 2, t.from),
        effects: (w) => {
          log(
            w,
            "warn",
            "Generated on a single phenomenology",
            "You raised alert on an uncorroborated track. The other side reads generation as intent.",
          );
        },
      },
    ],
  };
}

/**
 * The classification ladder — NUCFLASH / BROKEN ARROW / BENT SPEAR / EMPTY
 * QUIVER. Real US reporting terms, and choosing the rung is a genuine judgment
 * made early with bad facts. Over-classify and you mobilise the world for an
 * accident; under-classify and the recovery window closes.
 *
 * The honest detail from every historical Broken Arrow: nuclear yield was zero
 * and dispersal was the actual harm. Those are near-independent outcomes.
 */
function brokenArrowDecision(world: World): Decision | null {
  const ba = world.brokenArrow;
  if (!ba) return null;
  return {
    id: `decision-classify-${world.turn}`,
    prompt: "Pick a reporting rung and commit to it.",
    frame:
      "A weapon under your custody is unaccounted for. The facts are thin and the first message you send " +
      "sets everyone else's posture for the next week. There has never been a nuclear yield in an accident " +
      "of this kind. Dispersal is the harm that actually happens, and it does not care what you called this.",
    windowTurns: 2,
    timeoutOptionId: "quiet-recovery",
    options: [
      {
        id: "quiet-recovery",
        label: "BENT SPEAR — significant incident, recover quietly",
        detail:
          "Keeps the search narrow and the story small. If it is worse than this, you lose the early hours.",
        action: act("intelligence", 2, world.playerId),
        effects: (w) => {
          log(
            w,
            "warn",
            "Filed BENT SPEAR",
            "You classified below the custody-failure rung to keep the search quiet.",
          );
        },
      },
      {
        id: "empty-quiver",
        label: "EMPTY QUIVER — declare a custody failure",
        detail:
          "Opens every channel and every asset. Also tells nine governments you lost a weapon.",
        action: act("diplomacy", 2, null),
        effects: (w) => {
          w.terrorThreat = clamp(w.terrorThreat + 4, 0, 100);
          const me = w.actors[w.playerId];
          me.intel = clamp(me.intel + 8, 0, 100);
          log(
            w,
            "warn",
            "Filed EMPTY QUIVER",
            "You declared the custody failure. Recovery resources opened; so did the political cost.",
          );
        },
      },
      {
        id: "contain-dispersal",
        label: "Treat it as a dispersal problem, not a war problem",
        detail:
          "Puts everything into contamination control. Correct in almost every historical case.",
        action: act("intelligence", 3, world.playerId),
        effects: (w) => {
          const me = w.actors[w.playerId];
          me.publicOpinion = clamp(me.publicOpinion + 3, 0, 100);
          log(
            w,
            "info",
            "Dispersal-first response",
            "Yield and dispersal are near-independent. You resourced the one that actually happens.",
          );
        },
      },
    ],
  };
}

const BUILDERS: Record<DecisionKind, (world: World) => Decision | null> = {
  warning: closeCallDecision,
  "broken-arrow": brokenArrowDecision,
};

/** Tried in order. Close calls outrank custody incidents: shorter clock. */
const BUILDER_ORDER: DecisionKind[] = ["warning", "broken-arrow"];

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

export function ensureDecisions(world: World): World {
  if (world.decision === undefined) world.decision = null;
  if (!Array.isArray(world.decisionsSeen)) world.decisionsSeen = [];
  return world;
}

export function optionById(
  decision: Decision | null | undefined,
  id: string | undefined,
): DecisionOption | undefined {
  if (!decision || !id) return undefined;
  return decision.options.find((o) => o.id === id);
}

/**
 * Rebuild the live card from the stored kind. Returns null when the situation
 * that raised it has passed (a close call cleared, a weapon recovered), which
 * is the signal to take the card off the desk.
 */
export function currentDecision(world: World): Decision | null {
  const st = world.decision;
  if (!st) return null;
  const build = BUILDERS[st.kind];
  if (!build) return null;
  const card = build(world);
  if (!card) return null;
  // Keep the id stable for the life of the card so anti-repeat works.
  return { ...card, id: st.id };
}

/** Options the player may actually take right now. */
export function availableOptions(world: World): DecisionOption[] {
  const card = currentDecision(world);
  if (!card) return [];
  return card.options.filter((o) => !o.requires || o.requires(world));
}

/** Months of window left on the current card, or 0 when it has no clock. */
export function windowLeft(world: World): number {
  return world.decision?.remaining ?? 0;
}

/**
 * Open a card if one is warranted and none is on the desk. Called at the end of
 * the turn pipeline, after the next event has been drawn, so it reads the state
 * the player will actually be looking at.
 *
 * Deliberately RNG-free: which card opens is a pure function of world state, so
 * this adds no draws to the shared stream and cannot shift any fixed seed.
 */
export function openDecisionIfWarranted(world: World) {
  ensureDecisions(world);
  if (world.ended || world.decision) return;
  if (world.turn < FIRST_DECISION_TURN) return;
  for (const kind of BUILDER_ORDER) {
    const d = BUILDERS[kind](world);
    if (!d) continue;
    if (world.decisionsSeen?.includes(d.id)) continue;
    world.decision = { kind, id: d.id, remaining: d.windowTurns ?? 0, openedTurn: world.turn };
    return;
  }
}

/**
 * Resolve the card against the action the player committed. Runs inside
 * `resolveTurn` so effects are part of the replayed turn.
 *
 * Returns the option that was applied, if any.
 */
export function applyDecision(world: World, action: PlayerAction): DecisionOption | null {
  ensureDecisions(world);
  const st = world.decision;
  if (!st) return null;

  const card = currentDecision(world);
  if (!card) {
    // The situation that raised the card has passed. Clear it silently.
    world.decision = null;
    return null;
  }

  const chosen = optionById(card, action.decisionOptionId);
  if (!chosen) return null;

  chosen.effects?.(world);

  if (chosen.costsWindow && card.windowTurns) {
    st.remaining -= 1;
    if (st.remaining > 0) return chosen; // card stays on the desk
    // Window exhausted: the system takes the decision out of your hands.
    const fallback = optionById(card, card.timeoutOptionId);
    if (fallback && fallback.id !== chosen.id) {
      fallback.effects?.(world);
      log(
        world,
        "critical",
        "The window closed",
        `You held "${card.prompt}" open until there was no time left. The standing procedure ran instead: ${fallback.label}.`,
      );
    }
  }

  world.decisionsSeen = [...(world.decisionsSeen ?? []), st.id].slice(-24);
  world.decision = null;
  return chosen;
}

/** Attach a decision to an event, for scenario and deck authors. */
export function withDecision(
  event: GameEvent,
  decision: Decision,
): GameEvent & { decision: Decision } {
  return { ...event, decision };
}

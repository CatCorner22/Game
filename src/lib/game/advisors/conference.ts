import type { World } from "../types";
import { clamp } from "../rng";
import { log } from "../simLog";
import { availableOptions, currentDecision } from "../decisions";
import type { DecisionOption } from "../decisions";
import { postEffects } from "../posts";
import { PLAYABLE_IDS } from "../types";
import type { PlayableId } from "../types";
import { type Advisor, type ConferenceRung, hawkishness, rosterFor } from "./roster";

/**
 * The warning conference.
 *
 * This is not a chat window bolted onto a strategy game. The corpus documents
 * the actual escalation ladder, and it is already the shape of a good mechanic:
 *
 *   1. Missile Display Conference   — duty officers, technical, cheap
 *   2. Threat Assessment Conference — senior operational commanders join
 *   3. Missile Attack Conference    — national leadership joins
 *
 * Each rung costs time, widens the circle of people who now believe something
 * might be happening, and generates observable activity. So climbing buys you
 * judgement and costs you clock and signature. That trade is the game.
 *
 * Everything in this module is a pure function of world state. No RNG, no
 * async, no network. `advisorStance` is deterministic in the same way
 * `staffAdvice` is, so `forecast()` can replay through it twice per render
 * without diverging.
 */

export const RUNGS: {
  rung: ConferenceRung;
  name: string;
  short: string;
  detail: string;
  /** Real seconds this rung takes off the decision clock. */
  clockCost: number;
  /** Observable-activity cost of widening the circle. */
  signature: number;
}[] = [
  {
    rung: 1,
    name: "Missile Display Conference",
    short: "Display",
    detail: "Duty officers only. A technical call to establish what the sensors actually hold.",
    clockCost: 0,
    signature: 0,
  },
  {
    rung: 2,
    name: "Threat Assessment Conference",
    short: "Assessment",
    detail:
      "Senior operational commanders join. Convened when the event cannot be dismissed at the watch floor.",
    clockCost: 12,
    signature: 10,
  },
  {
    rung: 3,
    name: "Missile Attack Conference",
    short: "Attack",
    detail:
      "National leadership joins. Everyone on this call now believes something might be happening, and other capitals can see that.",
    clockCost: 24,
    signature: 22,
  },
];

declare module "../types" {
  interface World {
    /** How far up the ladder the player has convened this turn, 0 = not convened. */
    conferenceRung?: 0 | 1 | 2 | 3;
    /** Per-advisor trust, 0-100. Low trust costs you their candor. */
    advisorTrust?: Record<string, number>;
    /** Advisor ids whose recommendation the player overrode, most recent last. */
    overruled?: string[];
  }
}

export const DEFAULT_TRUST = 60;

export function trustOf(world: World, advisorId: string): number {
  return world.advisorTrust?.[advisorId] ?? DEFAULT_TRUST;
}

/**
 * Effective candor. An advisor you keep overruling stops volunteering the
 * unwelcome read and starts agreeing with you — which is a real institutional
 * failure mode and the most dangerous thing in this file.
 */
export function candorOf(world: World, advisor: Advisor): number {
  const trust = trustOf(world, advisor.id);
  return clamp(advisor.candor * (0.55 + trust / 160), 0, 100);
}

/** Whether the advisor is reachable from the player's current command post. */
export function reachable(world: World, advisor: Advisor): boolean {
  const comms = postEffects(world).comms;
  // A narrow pipe carries the watch floor and the people who have to be there.
  // It does not carry the whole cabinet.
  if (comms >= 80) return true;
  if (comms >= 60) return advisor.rung <= 2;
  if (comms >= 40) return advisor.rung <= 1 || advisor.branch === "strategic";
  return advisor.rung === 1;
}

/** Everyone who would be on the call at this rung, given where the player is sitting. */
export function participants(world: World, rung: ConferenceRung): Advisor[] {
  const seat = (PLAYABLE_IDS as string[]).includes(world.playerId)
    ? (world.playerId as PlayableId)
    : "US";
  return rosterFor(seat).filter((a) => a.rung <= rung && reachable(world, a));
}

/** Anyone the current post cannot reach who otherwise would have been here. */
export function unreachable(world: World, rung: ConferenceRung): Advisor[] {
  const seat = (PLAYABLE_IDS as string[]).includes(world.playerId)
    ? (world.playerId as PlayableId)
    : "US";
  return rosterFor(seat).filter((a) => a.rung <= rung && !reachable(world, a));
}

export interface AdvisorStance {
  advisor: Advisor;
  /** The option this advisor argues for. */
  optionId: string;
  /** 0-100. How strongly. */
  strength: number;
  /** True when low trust has bent their answer toward what you want to hear. */
  deferring: boolean;
}

/**
 * What this advisor argues for, given the card on the desk.
 *
 * Pure and deterministic. Scores every available option against the advisor's
 * disposition — hawkishness pulls toward force, candor pulls toward saying the
 * inconvenient thing, institutional loyalty pulls toward whatever their own
 * organisation owns — and returns the winner.
 */
export function advisorStance(world: World, advisor: Advisor): AdvisorStance | null {
  const options = availableOptions(world);
  if (!options.length) return null;
  const hawk = hawkishness(advisor);
  const candor = candorOf(world, advisor);
  const deferring = candor < advisor.candor * 0.75;

  let best = options[0];
  let bestScore = -Infinity;
  for (const opt of options) {
    let score = optionForceWeight(opt) * (hawk - 50);
    score += optionPatienceWeight(opt) * (candor - 50) * 0.8;
    score += branchAffinity(advisor, opt) * 22;
    // A deferring advisor drifts toward whatever the principal did last, which
    // is exactly the behaviour you lose when you stop listening to people.
    if (deferring && world.lastAction && opt.action.kind === world.lastAction.kind) score += 40;
    if (score > bestScore) {
      bestScore = score;
      best = opt;
    }
  }
  return {
    advisor,
    optionId: best.id,
    strength: clamp(Math.round(50 + bestScore / 3), 5, 99),
    deferring,
  };
}

/** How much this option reaches for force. -1 restraint, +1 force. */
function optionForceWeight(opt: DecisionOption): number {
  switch (opt.action.kind) {
    case "employ":
      return 1.6;
    case "kill":
      return 1.1;
    case "pressure":
      return 0.8;
    case "posture":
      return 0.6;
    case "covert":
      return 0.2;
    case "intelligence":
      return -0.2;
    case "diplomacy":
      return -0.8;
    case "hold":
      return -1;
    default:
      return 0;
  }
}

/** How much this option buys time or corroboration rather than committing. */
function optionPatienceWeight(opt: DecisionOption): number {
  if (opt.costsWindow) return 1;
  if (opt.action.kind === "intelligence" || opt.action.kind === "diplomacy") return 0.7;
  if (opt.action.kind === "hold") return 0.5;
  return -0.6;
}

/** People argue for the instrument their own institution owns. */
function branchAffinity(advisor: Advisor, opt: DecisionOption): number {
  const weight = advisor.institutional / 100;
  const k = opt.action.kind;
  switch (advisor.branch) {
    case "intel":
      return (k === "intelligence" ? 1 : k === "covert" ? 0.6 : -0.2) * weight;
    case "diplomatic":
      return (k === "diplomacy" ? 1.2 : k === "hold" ? 0.3 : -0.3) * weight;
    case "legal":
      return (k === "hold" ? 0.9 : k === "employ" ? -1.4 : 0) * weight;
    case "strategic":
      return (k === "posture" ? 0.9 : k === "employ" ? 0.5 : k === "hold" ? -0.4 : 0) * weight;
    case "watch":
      return (k === "intelligence" ? 0.8 : k === "hold" ? 0.4 : -0.2) * weight;
    case "ground":
    case "air":
    case "sea":
      return (k === "posture" ? 0.7 : k === "pressure" ? 0.4 : 0) * weight;
    case "civilian":
      return (k === "diplomacy" ? 0.4 : k === "hold" ? 0.3 : 0) * weight;
    default:
      return 0;
  }
}

/** The option most of the room argues for, weighted by how strongly. */
export function roomConsensus(world: World, rung: ConferenceRung): { optionId: string; share: number } | null {
  const stances = participants(world, rung)
    .map((a) => advisorStance(world, a))
    .filter((s): s is AdvisorStance => Boolean(s));
  if (!stances.length) return null;
  const tally = new Map<string, number>();
  for (const s of stances) tally.set(s.optionId, (tally.get(s.optionId) ?? 0) + s.strength);
  let bestId = stances[0].optionId;
  let bestWeight = -1;
  let total = 0;
  for (const [id, weight] of tally) {
    total += weight;
    if (weight > bestWeight) {
      bestWeight = weight;
      bestId = id;
    }
  }
  return { optionId: bestId, share: total ? bestWeight / total : 0 };
}

/**
 * Convene, or climb a rung. Called from the store — an out-of-band mutation in
 * the same shape as `applyC2` and `pickDoctrine` — because the ladder is a
 * within-turn action, not a turn commitment.
 */
export function convene(world: World, rung: ConferenceRung): void {
  const at = world.conferenceRung ?? 0;
  if (rung <= at) return;
  const spec = RUNGS.find((r) => r.rung === rung);
  if (!spec) return;
  world.conferenceRung = rung;
  if (spec.signature > 0) {
    world.postureSignature = clamp((world.postureSignature ?? 0) + spec.signature, 0, 100);
  }
  log(
    world,
    rung >= 3 ? "warn" : "info",
    `${spec.name} convened.`,
    `${spec.detail} Each rung of the warning conference costs time and widens the circle of people who now believe something might be happening — and that widening is itself observable.`,
  );
}

/** Real seconds the ladder has already taken off the decision clock this turn. */
export function clockSpent(world: World): number {
  const at = world.conferenceRung ?? 0;
  return RUNGS.filter((r) => r.rung <= at).reduce((n, r) => n + r.clockCost, 0);
}

/**
 * Record what the player decided against what the room advised.
 *
 * Called from inside `resolveTurn` so it replays: the chosen option id is
 * already on the action. Advisors who were overruled lose trust, and trust
 * costs candor, and low candor is how you end up with a room that agrees with
 * you right up until the moment it matters.
 */
export function recordDecision(world: World, chosenOptionId: string): void {
  const rung = world.conferenceRung ?? 0;
  if (!rung) return;
  const trust: Record<string, number> = { ...(world.advisorTrust ?? {}) };
  const overruled: string[] = [];
  let agreed = 0;
  let total = 0;
  for (const advisor of participants(world, rung as ConferenceRung)) {
    const stance = advisorStance(world, advisor);
    if (!stance) continue;
    total += 1;
    const current = trust[advisor.id] ?? DEFAULT_TRUST;
    if (stance.optionId === chosenOptionId) {
      agreed += 1;
      trust[advisor.id] = clamp(current + 6, 0, 100);
    } else {
      trust[advisor.id] = clamp(current - 5, 0, 100);
      overruled.push(advisor.id);
    }
  }
  world.advisorTrust = trust;
  world.overruled = [...(world.overruled ?? []), ...overruled].slice(-40);

  if (!total) return;
  const you = world.actors[world.playerId];
  if (agreed / total >= 0.6) {
    // A government that is behind you is worth something concrete.
    you.legitimacy = clamp(you.legitimacy + 2, 0, 100);
    you.militaryLoyalty = clamp(you.militaryLoyalty + 1, 0, 100);
  } else if (agreed === 0) {
    you.militaryLoyalty = clamp(you.militaryLoyalty - 3, 0, 100);
    log(
      world,
      "warn",
      "You decided against the whole room.",
      "Sole authority is real and it is yours. It is also the only check that failed here, and the people you overruled will remember it the next time you ask them what they think.",
    );
  }
}

/** Reset per-turn conference state. Deterministic, called from the tick block. */
export function tickConference(world: World): void {
  world.conferenceRung = 0;
}

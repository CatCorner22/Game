import type { ActorId, World } from "./types";
import { clamp } from "./rng";

/**
 * Leader temperament.
 *
 * Until now the person in the chair was an abstraction with no personality at
 * all -- you, with fixed institutional behaviour around you. But temperament is
 * one of the genuinely load-bearing variables in nuclear command, and the
 * historical near-misses turn on it constantly: whether the chain of command
 * will check an order, whether staff will bring the principal bad news,
 * whether an adversary can read what you are doing and why.
 *
 * These are archetypes rather than portraits of real, living politicians.
 * That is the same rule the advisor roster follows -- real roles, invented
 * people -- and it is also simply the better mechanic: a temperament applies to
 * all fourteen seats and to every adversary, so an erratic leader is something
 * you can *play as*, something you can *face*, and something the intelligence
 * system has to work out about someone else.
 *
 * The dangerous one is `candor`. A leader nobody wants to contradict gets a
 * room that agrees with them, which is exactly how the worst decisions in this
 * game's source material actually got made.
 *
 * Nothing here draws from the RNG. Adversary temperaments come from an FNV-1a
 * hash of (seed, actor), the same trick `mandate.ts` uses, so no fixed seed
 * shifts and `forecast()` can replay through this safely.
 */
export interface LeaderArchetype {
  id: string;
  name: string;
  /** One line of character. */
  line: string;
  /** What it does to you, stated plainly. */
  detail: string;
  /** Delta to the second officer's refusal probability, percentage points. */
  refusal: number;
  /** Delta to pre-delegation and rogue-launch risk, percentage points. */
  preDel: number;
  /** Delta to advisor candor. Negative means the room stops telling you things. */
  candor: number;
  /** Multiplier on escalatory action probability. 1 is neutral. */
  escalation: number;
  /** Multiplier on diplomatic action probability. */
  diplomacy: number;
  /** 0-100. How readable you are. Low means other capitals misread you. */
  predictability: number;
  /** Domestic legitimacy drift per turn. */
  legitimacy: number;
  /** True for the temperaments that make a crisis less governable. */
  volatile?: boolean;
}

export const LEADERS: LeaderArchetype[] = [
  {
    id: "institutionalist",
    name: "The institutionalist",
    line: "Works the process. Reads the whole brief. Signs nothing that has not been staffed.",
    detail: "No modifiers. The process protects you and slows you down in equal measure.",
    refusal: 0,
    preDel: 0,
    candor: 0,
    escalation: 1,
    diplomacy: 1,
    predictability: 82,
    legitimacy: 0,
  },
  {
    id: "technocrat",
    name: "The technocrat",
    line: "Wants the confidence interval before the recommendation, and will say so out loud.",
    detail: "Advisors speak freely and the chain checks orders carefully. You are slow to act and easy to read.",
    refusal: 6,
    preDel: -4,
    candor: 12,
    escalation: 0.82,
    diplomacy: 1.15,
    predictability: 90,
    legitimacy: -1,
  },
  {
    id: "hardliner",
    name: "The hardliner",
    line: "Believes deterrence only works if the other side is certain you would do it.",
    detail: "Escalates readily, but doctrinally — adversaries can predict you, which is its own kind of stability.",
    refusal: -4,
    preDel: 4,
    candor: -4,
    escalation: 1.35,
    diplomacy: 0.7,
    predictability: 86,
    legitimacy: 1,
  },
  {
    id: "dealmaker",
    name: "The dealmaker",
    line: "Treats every relationship as a negotiation, including the ones that are treaties.",
    detail: "Diplomacy opens doors and allies stop being sure where they stand. Alliance cohesion pays for it.",
    refusal: -2,
    preDel: 2,
    candor: -6,
    escalation: 0.95,
    diplomacy: 1.4,
    predictability: 52,
    legitimacy: 1,
  },
  {
    id: "showman",
    name: "The showman",
    line: "Governs at volume. Announces the decision before the room has finished making it.",
    detail:
      "Enormously visible, hard to predict, and the staff learn to manage you rather than inform you. Your signature is always high.",
    refusal: -8,
    preDel: 8,
    candor: -18,
    escalation: 1.3,
    diplomacy: 1.1,
    predictability: 34,
    legitimacy: 2,
    volatile: true,
  },
  {
    id: "impulsive",
    name: "The impulsive",
    line: "Decides in the first ninety seconds and spends the rest of the meeting defending it.",
    detail:
      "Fast when speed matters and fast when it does not. The chain of command is the only thing between you and a decision you would not have made an hour later.",
    refusal: -12,
    preDel: 14,
    candor: -14,
    escalation: 1.5,
    diplomacy: 0.85,
    predictability: 28,
    legitimacy: 0,
    volatile: true,
  },
  {
    id: "paranoid",
    name: "The paranoid",
    line: "Assumes the briefing is managed, the staff are disloyal, and the sensors may be lying.",
    detail:
      "You distrust corroboration itself. Officers get replaced, nobody volunteers anything, and a genuine warning is as suspect as a false one.",
    refusal: 8,
    preDel: 10,
    candor: -22,
    escalation: 1.25,
    diplomacy: 0.6,
    predictability: 30,
    legitimacy: -3,
    volatile: true,
  },
  {
    id: "ideologue",
    name: "The ideologue",
    line: "Already knows what this is. The intelligence is either confirmation or evidence of a plot.",
    detail:
      "Advice does not reach you and does not change you. Certainty is fast, and it is fast in whichever direction you were already facing.",
    refusal: -6,
    preDel: 8,
    candor: -20,
    escalation: 1.45,
    diplomacy: 0.55,
    predictability: 62,
    legitimacy: 1,
    volatile: true,
  },
  {
    id: "absentee",
    name: "The absentee",
    line: "Is not in the room. Was not in the room yesterday either.",
    detail:
      "Staff decide in your name because someone has to. Pre-delegation stops being a policy question and becomes a description.",
    refusal: 4,
    preDel: 20,
    candor: -10,
    escalation: 1.05,
    diplomacy: 0.8,
    predictability: 44,
    legitimacy: -4,
    volatile: true,
  },
];

export const DEFAULT_LEADER = "institutionalist";

declare module "./types" {
  interface World {
    /** The player's own temperament. */
    leaderArchetype?: string;
    /** Adversary temperaments, derived from the seed. */
    leaders?: Partial<Record<ActorId, string>>;
    /** Which adversary temperaments intelligence has actually established. */
    leadersKnown?: ActorId[];
  }
}

export function leaderById(id: string | undefined | null): LeaderArchetype {
  return LEADERS.find((l) => l.id === id) ?? LEADERS[0];
}

/** The player's temperament. Defaults to the neutral institutionalist. */
export function playerLeader(world: World): LeaderArchetype {
  return leaderById(world.leaderArchetype ?? DEFAULT_LEADER);
}

/** An adversary's temperament. */
export function leaderOf(world: World, id: ActorId): LeaderArchetype {
  if (id === world.playerId) return playerLeader(world);
  return leaderById(world.leaders?.[id]);
}

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Assign adversary temperaments from the seed. Pure, RNG-free, and stable for a
 * given (seed, actor) so a replay reproduces the same cast of leaders.
 *
 * Seats whose command culture already implies a temperament get it, because a
 * randomly institutionalist North Korea would be sillier than no feature at all.
 */
const FIXED: Partial<Record<ActorId, string>> = {
  KP: "ideologue",
  NS: "ideologue",
  CR: "dealmaker",
};

export function assignLeaders(world: World): void {
  if (world.leaders) return;
  const out: Partial<Record<ActorId, string>> = {};
  for (const id of Object.keys(world.actors) as ActorId[]) {
    if (id === world.playerId) continue;
    const fixed = FIXED[id];
    if (fixed) {
      out[id] = fixed;
      continue;
    }
    out[id] = LEADERS[hash(`${world.seed}:${id}:leader`) % LEADERS.length].id;
  }
  world.leaders = out;
  world.leadersKnown = [];
}

/**
 * Whether intelligence has established what kind of person you are dealing
 * with. Assessing a foreign leader's temperament is real work, so it is not
 * free -- it comes from intelligence quality against that actor.
 */
export function leaderKnown(world: World, id: ActorId): boolean {
  if (id === world.playerId) return true;
  return Boolean(world.leadersKnown?.includes(id));
}

export function establishLeader(world: World, id: ActorId): void {
  if (id === world.playerId) return;
  if (!world.leadersKnown) world.leadersKnown = [];
  if (world.leadersKnown.includes(id)) return;
  world.leadersKnown = [...world.leadersKnown, id].slice(-14);
}

/**
 * Shift a probability by a temperament's escalation or diplomacy bias.
 *
 * Critically this changes the *threshold*, never the number of draws --
 * `chance(world, p)` costs exactly one draw whatever p is. That is the same
 * discipline the geometric flight times follow, and it is what keeps fixed-seed
 * replay intact.
 */
export function biasEscalation(world: World, id: ActorId, p: number): number {
  return clamp(p * leaderOf(world, id).escalation, 0, 1);
}

export function biasDiplomacy(world: World, id: ActorId, p: number): number {
  return clamp(p * leaderOf(world, id).diplomacy, 0, 1);
}

/**
 * How badly an adversary misreads the player's posture, 0-1. Low predictability
 * on either side widens the gap: an unreadable leader facing an unreadable
 * leader is the worst case, which is the point.
 */
export function misreadRisk(world: World, id: ActorId): number {
  const you = playerLeader(world);
  const them = leaderOf(world, id);
  const gap = (100 - you.predictability) + (100 - them.predictability);
  return clamp(gap / 260, 0, 0.75);
}

/** Per-turn drift from the player's own temperament. Deterministic. */
export function tickLeader(world: World): void {
  const leader = playerLeader(world);
  if (!leader.legitimacy) return;
  const you = world.actors[world.playerId];
  if (!you) return;
  you.legitimacy = clamp(you.legitimacy + leader.legitimacy, 0, 100);
}

import type { ActorId, PlayableId, World } from "./types";
import { PLAYABLE_IDS } from "./types";
import { clamp } from "./rng";
import { log } from "./simLog";
import { addHostility } from "./world";

/**
 * Where you are sitting when the call comes.
 *
 * The corpus makes the point that leadership relocation is not a free action:
 * it is one of the observable indicators an adversary reads, so moving to a
 * hardened site during a crisis is itself a signal. That is the trade this
 * module models. A post buys warning quality, survivability, release integrity
 * or political reach, and it costs transit time and visible signature.
 *
 * None of it is random. Relocation rides on `PlayerAction.relocateTo` so it is
 * recorded in `actionHistory` and replays from a code like any other choice,
 * and `tickRelocation` spends no RNG.
 *
 * The named sites are real and their published roles are what they trade on;
 * nothing here describes how any of them actually operate. Seats without a
 * documented site get plausible fictional ones, marked as such.
 */
export interface CommandPost {
  id: string;
  seat: PlayableId;
  name: string;
  /** Scope-label form, kept short for chips. */
  short: string;
  /** One line on what the place is for. */
  role: string;
  /** What you give up to sit here. */
  cost: string;
  /** Delta applied to early-warning quality, percentage points. */
  warning: number;
  /** 0-100. How likely the seat survives a strike aimed at leadership. */
  survivability: number;
  /** Delta to the second officer's willingness to authenticate an order. */
  releaseIntegrity: number;
  /** Delta to political reach — diplomacy and domestic stability. */
  politicalSpeed: number;
  /** 0-100. Bandwidth to the rest of government; gates who joins a conference. */
  comms: number;
  /** Turns spent in transit before the post is effective. */
  transitTurns: number;
  /** 0-3. How loudly moving here reads to an adversary as escalation. */
  signature: number;
  /** True for the seat's peacetime default. */
  standing?: boolean;
  fictional?: boolean;
}

const POSTS: CommandPost[] = [
  // ── United States ────────────────────────────────────────────────────────
  {
    id: "US:peoc",
    seat: "US",
    name: "White House · Presidential Emergency Operations Center",
    short: "PEOC",
    role: "The political centre. Everyone who has to be convinced is already down the hall.",
    cost: "It is the first address on anyone's target list.",
    warning: 0,
    survivability: 18,
    releaseIntegrity: 0,
    politicalSpeed: 10,
    comms: 96,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "US:cheyenne",
    seat: "US",
    name: "Cheyenne Mountain Complex",
    short: "Cheyenne",
    role: "The sensory organ. Warning feeds arrive here first and get correlated here first.",
    cost: "A mountain in Colorado is a long way from the people who make policy.",
    warning: 14,
    survivability: 72,
    releaseIntegrity: 4,
    politicalSpeed: -8,
    comms: 88,
    transitTurns: 1,
    signature: 2,
  },
  {
    id: "US:raven-rock",
    seat: "US",
    name: "Raven Rock Mountain Complex (Site R)",
    short: "Raven Rock",
    role: "The alternate military command centre — where an order would be processed and passed.",
    cost: "Explicitly a wartime site. Moving here is read as a decision already taken.",
    warning: 6,
    survivability: 80,
    releaseIntegrity: 10,
    politicalSpeed: -6,
    comms: 90,
    transitTurns: 1,
    signature: 3,
  },
  {
    id: "US:mount-weather",
    seat: "US",
    name: "Mount Weather Emergency Operations Center",
    short: "Mount Weather",
    role: "Civilian continuity. The government that has to exist afterwards relocates here.",
    cost: "Built for continuity, not for fighting. Warning arrives second-hand.",
    warning: -2,
    survivability: 68,
    releaseIntegrity: 2,
    politicalSpeed: 6,
    comms: 84,
    transitTurns: 1,
    signature: 2,
  },
  {
    id: "US:e4b",
    seat: "US",
    name: "E-4B Nightwatch · airborne command post",
    short: "E-4B",
    role: "Survives almost anything, because it is not anywhere.",
    cost: "Narrow bandwidth. Half the people you want on the call cannot be on it.",
    warning: 2,
    survivability: 94,
    releaseIntegrity: 6,
    politicalSpeed: -12,
    comms: 46,
    transitTurns: 1,
    signature: 3,
  },

  // ── Russia ───────────────────────────────────────────────────────────────
  {
    id: "RU:kremlin",
    seat: "RU",
    name: "Kremlin · Moscow",
    short: "Kremlin",
    role: "The political centre, and where the briefcases are.",
    cost: "Fixed, known, and central.",
    warning: 0,
    survivability: 20,
    releaseIntegrity: 0,
    politicalSpeed: 10,
    comms: 94,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "RU:kosvinsky",
    seat: "RU",
    name: "Kosvinsky Kamen · Urals",
    short: "Kosvinsky",
    role: "Hardened strategic command in the Urals, built to keep talking after a first strike.",
    cost: "Far from Moscow politics, and a move there is watched closely.",
    warning: 8,
    survivability: 82,
    releaseIntegrity: 10,
    politicalSpeed: -8,
    comms: 82,
    transitTurns: 1,
    signature: 3,
  },
  {
    id: "RU:yamantau",
    seat: "RU",
    name: "Yamantau · Southern Urals",
    short: "Yamantau",
    role: "Deep continuity complex. Large, hardened, and never fully explained.",
    cost: "Opacity cuts both ways: your own ministries are not sure what you can still do.",
    warning: 4,
    survivability: 86,
    releaseIntegrity: 6,
    politicalSpeed: -10,
    comms: 70,
    transitTurns: 2,
    signature: 3,
  },
  {
    id: "RU:il80",
    seat: "RU",
    name: "Il-80 · airborne command post",
    short: "Il-80",
    role: "The airborne answer to decapitation.",
    cost: "Thin pipes. Perimeter looks more attractive from up here, which is the danger.",
    warning: 2,
    survivability: 92,
    releaseIntegrity: 2,
    politicalSpeed: -12,
    comms: 44,
    transitTurns: 1,
    signature: 3,
  },

  // ── United Kingdom ───────────────────────────────────────────────────────
  {
    id: "UK:cobr",
    seat: "UK",
    name: "Cabinet Office Briefing Rooms (COBR) · Whitehall",
    short: "COBR",
    role: "Where a British crisis is actually chaired.",
    cost: "An office in Whitehall.",
    warning: 0,
    survivability: 20,
    releaseIntegrity: 0,
    politicalSpeed: 12,
    comms: 96,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "UK:pindar",
    seat: "UK",
    name: "PINDAR · protected crisis centre",
    short: "PINDAR",
    role: "The hardened crisis facility beneath Whitehall, and the link to the deterrent chain.",
    cost: "Small. It concentrates decision-making into very few people.",
    warning: 8,
    survivability: 64,
    releaseIntegrity: 10,
    politicalSpeed: -4,
    comms: 90,
    transitTurns: 0,
    signature: 2,
  },
  {
    id: "UK:northwood",
    seat: "UK",
    name: "Northwood · Permanent Joint Headquarters",
    short: "Northwood",
    role: "Operational headquarters, and where the continuous-at-sea chain is run from.",
    cost: "Military tempo, political distance.",
    warning: 10,
    survivability: 58,
    releaseIntegrity: 8,
    politicalSpeed: -8,
    comms: 88,
    transitTurns: 1,
    signature: 2,
  },

  // ── France ───────────────────────────────────────────────────────────────
  {
    id: "FR:elysee",
    seat: "FR",
    name: "Élysée · Jupiter command post",
    short: "Jupiter",
    role: "The President's own command post. French release is personal by design.",
    cost: "In the middle of Paris.",
    warning: 0,
    survivability: 26,
    releaseIntegrity: 0,
    politicalSpeed: 12,
    comms: 94,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "FR:mont-verdun",
    seat: "FR",
    name: "Mont Verdun · air operations complex",
    short: "Mont Verdun",
    role: "Hardened air-defence and air-operations command.",
    cost: "Lyon is not the Élysée. Political signals take longer to send.",
    warning: 12,
    survivability: 70,
    releaseIntegrity: 6,
    politicalSpeed: -8,
    comms: 84,
    transitTurns: 1,
    signature: 2,
  },

  // ── China ────────────────────────────────────────────────────────────────
  {
    id: "CN:zhongnanhai",
    seat: "CN",
    name: "Zhongnanhai · Beijing",
    short: "Zhongnanhai",
    role: "Party centre. Nothing moves without it.",
    cost: "Known address, central, and political.",
    warning: 0,
    survivability: 22,
    releaseIntegrity: 0,
    politicalSpeed: 12,
    comms: 94,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "CN:western-hills",
    seat: "CN",
    name: "Western Hills command complex",
    short: "Western Hills",
    role: "The hardened complex outside Beijing associated with wartime command.",
    cost: "Moving the Party centre out of the city is not a quiet act.",
    warning: 8,
    survivability: 78,
    releaseIntegrity: 8,
    politicalSpeed: -8,
    comms: 84,
    transitTurns: 1,
    signature: 3,
  },
  {
    id: "CN:cmc-joc",
    seat: "CN",
    name: "CMC Joint Operations Command Center",
    short: "CMC JOC",
    role: "Where the Central Military Commission actually runs a war.",
    cost: "Military framing crowds out the diplomatic one.",
    warning: 12,
    survivability: 52,
    releaseIntegrity: 6,
    politicalSpeed: -6,
    comms: 90,
    transitTurns: 0,
    signature: 2,
  },

  // ── India ────────────────────────────────────────────────────────────────
  {
    id: "IN:south-block",
    seat: "IN",
    name: "South Block · New Delhi",
    short: "South Block",
    role: "Prime Minister's Office and the political head of the command authority.",
    cost: "Central Delhi.",
    warning: 0,
    survivability: 22,
    releaseIntegrity: 0,
    politicalSpeed: 12,
    comms: 92,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "IN:ncp",
    seat: "IN",
    name: "National command post · alternate",
    short: "Alt NCP",
    role: "The hardened alternate the command authority relocates to.",
    cost: "Relocating in a Pakistan crisis is read instantly across the border.",
    warning: 8,
    survivability: 72,
    releaseIntegrity: 10,
    politicalSpeed: -8,
    comms: 78,
    transitTurns: 1,
    signature: 3,
  },

  // ── Pakistan ─────────────────────────────────────────────────────────────
  {
    id: "PK:nca",
    seat: "PK",
    name: "National Command Authority · Rawalpindi",
    short: "NCA",
    role: "Where custody, planning and release all sit in the same institution.",
    cost: "That concentration is the whole risk.",
    warning: 0,
    survivability: 26,
    releaseIntegrity: 0,
    politicalSpeed: 8,
    comms: 88,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "PK:alt-spd",
    seat: "PK",
    name: "Strategic Plans Division · alternate site",
    short: "Alt SPD",
    role: "Dispersed custody and a hardened alternate for the authority.",
    cost: "Dispersal is survivable and much harder to keep under two-man control.",
    warning: 4,
    survivability: 68,
    releaseIntegrity: -8,
    politicalSpeed: -6,
    comms: 66,
    transitTurns: 1,
    signature: 3,
  },

  // ── Israel ───────────────────────────────────────────────────────────────
  {
    id: "IL:kirya",
    seat: "IL",
    name: "The Kirya · Tel Aviv",
    short: "Kirya",
    role: "Defence headquarters and the political-military seam.",
    cost: "In the middle of the country's largest city.",
    warning: 0,
    survivability: 24,
    releaseIntegrity: 0,
    politicalSpeed: 12,
    comms: 94,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "IL:bor",
    seat: "IL",
    name: "Underground command centre",
    short: "The Pit",
    role: "The hardened operations centre below the Kirya.",
    cost: "Opacity doctrine means even allies read a move here as preparation.",
    warning: 10,
    survivability: 66,
    releaseIntegrity: 8,
    politicalSpeed: -6,
    comms: 88,
    transitTurns: 0,
    signature: 2,
  },

  // ── North Korea ──────────────────────────────────────────────────────────
  {
    id: "KP:pyongyang",
    seat: "KP",
    name: "Pyongyang leadership compound",
    short: "Pyongyang",
    role: "The order is the leader, and the leader is here.",
    cost: "Everyone knows that, including the people targeting it.",
    warning: 0,
    survivability: 16,
    releaseIntegrity: 0,
    politicalSpeed: 10,
    comms: 82,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "KP:mountain",
    seat: "KP",
    name: "Hardened mountain facility",
    short: "Mountain site",
    role: "Deep shelter for the leadership and the chain that answers to it.",
    cost: "Going dark is exactly the condition standing instructions were written for.",
    warning: -4,
    survivability: 84,
    releaseIntegrity: -14,
    politicalSpeed: -10,
    comms: 38,
    transitTurns: 1,
    signature: 3,
  },

  // ── Iran ─────────────────────────────────────────────────────────────────
  {
    id: "IR:tehran",
    seat: "IR",
    name: "Tehran · leadership office",
    short: "Tehran",
    role: "Where religious authority and the breakout clock meet.",
    cost: "Visible, and inside the threat envelope.",
    warning: 0,
    survivability: 22,
    releaseIntegrity: 0,
    politicalSpeed: 10,
    comms: 86,
    transitTurns: 0,
    signature: 0,
    standing: true,
  },
  {
    id: "IR:hardened",
    seat: "IR",
    name: "Hardened IRGC command site",
    short: "IRGC site",
    role: "Dispersed, deep, and answerable to the Guard rather than the ministries.",
    cost: "The ministries stop being able to slow anything down.",
    warning: 6,
    survivability: 74,
    releaseIntegrity: -6,
    politicalSpeed: -10,
    comms: 58,
    transitTurns: 1,
    signature: 3,
  },

  // ── Fictional seats ──────────────────────────────────────────────────────
  {
    id: "SU:minsk",
    seat: "SU",
    name: "Minsk · restorationist command",
    short: "Minsk",
    role: "A rival briefcase and a restoration story, run out of a borrowed capital.",
    cost: "Two authentication paths on one arsenal.",
    warning: 0,
    survivability: 24,
    releaseIntegrity: 0,
    politicalSpeed: 8,
    comms: 76,
    transitTurns: 0,
    signature: 0,
    standing: true,
    fictional: true,
  },
  {
    id: "SU:claimed-bunker",
    seat: "SU",
    name: "Claimed Urals facility",
    short: "Claimed site",
    role: "A Soviet-era complex the restorationists say answers to them.",
    cost: "Says. The garrison has not confirmed it.",
    warning: 4,
    survivability: 74,
    releaseIntegrity: -10,
    politicalSpeed: -10,
    comms: 52,
    transitTurns: 2,
    signature: 3,
    fictional: true,
  },
  {
    id: "CU:havana",
    seat: "CU",
    name: "Havana · Council of State",
    short: "Havana",
    role: "The political seat, and the whole island.",
    cost: "There is no strategic depth to relocate into.",
    warning: 0,
    survivability: 20,
    releaseIntegrity: 0,
    politicalSpeed: 10,
    comms: 80,
    transitTurns: 0,
    signature: 0,
    standing: true,
    fictional: true,
  },
  {
    id: "CU:western-shelter",
    seat: "CU",
    name: "Western province shelter",
    short: "Shelter",
    role: "A hardened provincial site away from the capital.",
    cost: "Ninety miles is not depth. It buys minutes.",
    warning: 2,
    survivability: 54,
    releaseIntegrity: 2,
    politicalSpeed: -8,
    comms: 60,
    transitTurns: 1,
    signature: 2,
    fictional: true,
  },
  {
    id: "CR:plaza",
    seat: "CR",
    name: "The Plaza",
    short: "Plaza",
    role: "No capital, no ministry, no seal. A room, and whoever is in it.",
    cost: "Nothing about this is a state.",
    warning: 0,
    survivability: 34,
    releaseIntegrity: 0,
    politicalSpeed: 6,
    comms: 54,
    transitTurns: 0,
    signature: 0,
    standing: true,
    fictional: true,
  },
  {
    id: "CR:convoy",
    seat: "CR",
    name: "Moving convoy",
    short: "Convoy",
    role: "Never in the same place twice.",
    cost: "Nobody can reach you, which includes the people trying to negotiate.",
    warning: -6,
    survivability: 72,
    releaseIntegrity: -14,
    politicalSpeed: -14,
    comms: 30,
    transitTurns: 0,
    signature: 1,
    fictional: true,
  },
  {
    id: "NS:emir",
    seat: "NS",
    name: "The Emir's residence",
    short: "Residence",
    role: "No address anyone will confirm, and no ministry between him and the weapon.",
    cost: "There is nobody to refuse the order.",
    warning: 0,
    survivability: 30,
    releaseIntegrity: 0,
    politicalSpeed: 6,
    comms: 48,
    transitTurns: 0,
    signature: 0,
    standing: true,
    fictional: true,
  },
  {
    id: "NS:desert-site",
    seat: "NS",
    name: "Dispersed desert site",
    short: "Desert site",
    role: "Deep in territory nobody polices.",
    cost: "Custody and command stop being the same thing.",
    warning: -4,
    survivability: 70,
    releaseIntegrity: -16,
    politicalSpeed: -12,
    comms: 34,
    transitTurns: 1,
    signature: 2,
    fictional: true,
  },
];

declare module "./types" {
  interface World {
    /** Id of the post the player currently occupies. */
    commandPost?: string;
    /** In-progress relocation, if any. */
    relocation?: { to: string; turnsLeft: number; startedTurn: number } | null;
    /** How loudly the player's recent movement reads as escalation, 0-100. */
    postureSignature?: number;
  }
}

/**
 * Local copy of command.ts's `asPlayable`. Deliberately not imported: command.ts
 * reads `postEffects` from here, and resolving the seat is a two-line cast that
 * is not worth an import cycle over.
 */
function seatOf(id: string): PlayableId {
  return (PLAYABLE_IDS as string[]).includes(id) ? (id as PlayableId) : "US";
}

export function postsFor(seat: PlayableId): CommandPost[] {
  return POSTS.filter((p) => p.seat === seat);
}

export function standingPost(seat: PlayableId): CommandPost {
  const list = postsFor(seat);
  return list.find((p) => p.standing) ?? list[0];
}

export function postById(id: string | undefined | null): CommandPost | null {
  if (!id) return null;
  return POSTS.find((p) => p.id === id) ?? null;
}

/** The post whose modifiers currently apply. In transit, nothing does. */
export function currentPost(world: World): CommandPost {
  return postById(world.commandPost) ?? standingPost(seatOf(world.playerId));
}

/** True while the player is between posts and running on degraded everything. */
export function inTransit(world: World): boolean {
  return Boolean(world.relocation && world.relocation.turnsLeft > 0);
}

/**
 * Effective modifiers. Transit is deliberately punishing: a convoy or an
 * aircraft climbing out is the worst possible moment to be handed a warning,
 * which is exactly why the decision of *when* to move is the interesting one.
 */
export function postEffects(world: World): {
  warning: number;
  survivability: number;
  releaseIntegrity: number;
  politicalSpeed: number;
  comms: number;
} {
  const post = currentPost(world);
  if (inTransit(world)) {
    return {
      warning: post.warning - 12,
      survivability: Math.min(post.survivability, 40),
      releaseIntegrity: post.releaseIntegrity - 8,
      politicalSpeed: post.politicalSpeed - 10,
      comms: Math.min(post.comms, 40),
    };
  }
  return {
    warning: post.warning,
    survivability: post.survivability,
    releaseIntegrity: post.releaseIntegrity,
    politicalSpeed: post.politicalSpeed,
    comms: post.comms,
  };
}

/** Why a relocation is not allowed, or null if it is. */
export function relocationBlocked(world: World, toId: string): string | null {
  const seat = seatOf(world.playerId);
  const target = postById(toId);
  if (!target) return "No such post.";
  if (target.seat !== seat) return "That post does not answer to your seat.";
  if (world.commandPost === toId && !inTransit(world)) return "You are already there.";
  if (inTransit(world)) return "Already in transit.";
  return null;
}

/**
 * Begin a relocation. Called from inside `resolveTurn` off
 * `PlayerAction.relocateTo`, so it replays from a code like any other choice.
 * Spends no RNG.
 */
export function beginRelocation(world: World, toId: string): void {
  if (relocationBlocked(world, toId)) return;
  const target = postById(toId);
  if (!target) return;
  if (target.transitTurns <= 0) {
    world.commandPost = target.id;
    world.relocation = null;
  } else {
    // `startedTurn` exists because `tickRelocation` runs later in the same
    // resolveTurn that began the move. Without it a one-turn move would
    // complete instantly and the player would never spend a turn in transit --
    // which is the entire cost of relocating.
    world.relocation = { to: target.id, turnsLeft: target.transitTurns, startedTurn: world.turn };
  }
  // Moving is an observable indicator, and the corpus is explicit that this is
  // one of the things an adversary is watching for. Signature is what other
  // capitals see; it decays on its own once you stop moving.
  world.postureSignature = clamp((world.postureSignature ?? 0) + target.signature * 18, 0, 100);
  // A wartime site read by hostile capitals as a decision already taken. Only
  // the loud moves register — a short walk to a protected room in the same
  // building does not put anyone's forces on alert.
  if (target.signature >= 2) {
    for (const id of Object.keys(world.actors) as ActorId[]) {
      if (id === world.playerId) continue;
      if (!world.actors[id].nuclear) continue;
      if ((world.actors[id].hostility[world.playerId] ?? 50) < 50) continue;
      addHostility(world, world.playerId, id, target.signature * 1.5);
    }
  }
  log(
    world,
    "you",
    `Command relocating to ${target.short}.`,
    `${target.role} ${target.cost} Movement of national leadership is one of the indicators other capitals watch for, so this is not a private decision.`,
  );
}

/** Advance any in-progress move and decay signature. Deterministic. */
export function tickRelocation(world: World): void {
  world.postureSignature = clamp((world.postureSignature ?? 0) - 8, 0, 100);
  const move = world.relocation;
  if (!move) return;
  if (move.startedTurn === world.turn) return;
  move.turnsLeft -= 1;
  if (move.turnsLeft > 0) return;
  const target = postById(move.to);
  world.relocation = null;
  if (!target) return;
  world.commandPost = target.id;
  log(
    world,
    "info",
    `Command established at ${target.short}.`,
    `${target.role} ${target.cost}`,
  );
}

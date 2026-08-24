import { makeActors } from "./actors";
import type {
  Actor,
  ActorId,
  Difficulty,
  Flashpoint,
  Meters,
  PlayableId,
  Team,
  World,
} from "./types";
import { ACTOR_IDS, PLAYABLE_IDS } from "./types";
import { standingPost } from "./posts";
import { DEFAULT_LEADER, assignLeaders } from "./leaders";
import { clamp, round } from "./rng";
import { openingFor } from "./events";
import { COMMAND, asPlayable, makeOfficer, nextAuthCode } from "./command";
import { defaultHotlines, defaultSensors, warningQuality } from "./warning";
import { seedTerminator } from "./terminator";
import { makeSites, seedSpies } from "./spies";
import { emptyTrickery } from "./trickery";
import { seedTreaties } from "./treaties";
import { quietWeather } from "./spaceWeather";

export const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export function dateLabel(world: World): string {
  return `${MONTHS[world.month]!} ${world.year}`;
}

export function createWorld(
  difficulty: Difficulty,
  seed = Date.now() | 0,
  playerId: ActorId = "US",
  intent: Team = "blue",
  terminator = false,
): World {
  const actors = makeActors();
  actors[playerId].intel = 100;
  actors[playerId].warning = Math.max(actors[playerId].warning, 70);
  if (playerId !== "US") actors.US.intel = 58;
  if (difficulty === "hard") {
    actors.KP.riskTolerance += 8;
    actors.RU.riskTolerance += 6;
    actors.PK.unrest += 10;
    actors.IR.breakoutWeeks = 20;
    for (const id of Object.keys(actors) as ActorId[]) {
      if (id !== playerId) actors[id].intel = clamp(actors[id].intel - 12, 15, 100);
    }
  }
  if (difficulty === "extreme") {
    actors.KP.riskTolerance += 16;
    actors.RU.riskTolerance += 12;
    actors.CN.riskTolerance += 8;
    actors.PK.unrest += 16;
    actors.PK.corruption += 10;
    actors.IR.breakoutWeeks = 14;
    actors[playerId].polarization += 8;
    actors[playerId].leadershipStability -= 8;
    for (const id of Object.keys(actors) as ActorId[]) {
      if (id !== playerId) actors[id].intel = clamp(actors[id].intel - 22, 10, 100);
    }
  }

  const flashpoints: Flashpoint[] = [
    {
      id: "korea",
      name: "Korean Peninsula",
      actors: ["US", "KP", "CN"],
      heat: 42,
      note: "Armistice, not peace. Tests and exercises raise the floor.",
    },
    {
      id: "taiwan",
      name: "Taiwan Strait",
      actors: ["US", "CN"],
      heat: 38,
      note: "Gray-zone pressure. A blockade is the step before shots.",
    },
    {
      id: "nato-ru",
      name: "NATO–Russia",
      actors: ["US", "RU", "UK", "FR"],
      heat: 44,
      note: "New START is dead. Uploading and snap exercises are the new language.",
    },
    {
      id: "ukraine",
      name: "Ukraine",
      actors: ["US", "RU", "UK", "FR"],
      heat: 40,
      note: "Frozen-hot war. Nuclear signaling lives here.",
    },
    {
      id: "iran",
      name: "Iran nuclear clock",
      actors: ["US", "IR", "IL"],
      heat: 36,
      note: "Breakout is a number of weeks, not a speech.",
    },
    {
      id: "kashmir",
      name: "Kashmir / LoC",
      actors: ["IN", "PK"],
      heat: 28,
      note: "Dormant until it is not. Nasr is the tripwire.",
    },
    {
      id: "terror",
      name: "Nuclear terrorism",
      actors: ["US", "NS", "PK"],
      heat: 22,
      note: "Capability is built in the dark. You find it with intelligence and covert work, or you find it too late.",
    },
    {
      id: "south-china",
      name: "South China Sea",
      actors: ["US", "CN"],
      heat: 30,
      note: "Incidents at sea. Dual-capable aircraft make accidents nuclear-adjacent.",
    },
    {
      id: "machine",
      name: "Machine control",
      actors: ["US", "RU", "CN", "UK", "FR"],
      heat: 0,
      note: "Decision-support that can write to the keys. Off unless Terminator mode.",
    },
    {
      id: "union",
      name: "Soviet restoration",
      actors: ["RU", "SU", "US"],
      heat: 34,
      note: "Two commands claiming one arsenal. A silo cannot serve two briefcases.",
    },
    {
      id: "cuba",
      name: "Caribbean / Cuba",
      actors: ["US", "CU", "RU", "SU"],
      heat: 18,
      note: "1962 can be re-run with dual-capable systems and cartels in the same ports.",
    },
    {
      id: "cartel",
      name: "Cartel corridors",
      actors: ["US", "CR", "CU", "NS"],
      heat: 24,
      note: "Money, ports, and colonels. A warhead is inventory if someone sells one.",
    },
    {
      id: "himalaya",
      name: "Himalaya / LAC",
      actors: ["IN", "CN"],
      heat: 20,
      note: "High-altitude clash. Dual-capable aircraft make a patrol nuclear-adjacent.",
    },
    {
      id: "space",
      name: "Early warning / space",
      actors: ["US", "RU", "CN"],
      heat: 14,
      note: "SBIRS and missile-warning birds. An ASAT shot is a blindfold.",
    },
  ];

  const opening = openingFor(playerId);
  const pid = asPlayable(playerId);
  const satchel = COMMAND[pid].satchel;
  const world: World = {
    version: 1,
    seed,
    rngState: seed >>> 0,
    rngMode: "live",
    rngFixed: 0.5,
    difficulty,
    playerId,
    intent,
    terminator: false,
    aiTakeover: 0,
    machineFired: false,
    turn: 1,
    month: 2,
    year: 2027,
    phase: "peacetime",
    defcon: 5,
    globalRisk: 34,
    allianceCohesion: 68,
    economy: 72,
    terrorThreat: 18,
    proliferation: 24,
    armsRace: 40,
    nuclearWinter: 0,
    winterStage: 0,
    uncontrolled: false,
    usCasualties: 0,
    playerCasualties: 0,
    worldCasualties: 0,
    newStartDead: true,
    footballPresent: true,
    biscuitOnPerson: true,
    authCode: "GOLD-7",
    secondOfficer: makeOfficer(pid),
    closeCall: null,
    sensors: defaultSensors(),
    hotlines: defaultHotlines(),
    notices: [],
    pacts: [],
    doctrinePending: false,
    doctrineTaken: [],
    actionHistory: [],
    commandPost: standingPost((PLAYABLE_IDS as string[]).includes(playerId) ? (playerId as PlayableId) : "US").id,
    relocation: null,
    postureSignature: 0,
    conferenceRung: 0,
    advisorTrust: {},
    overruled: [],
    addressStyle: "neutral",
    leaderArchetype: DEFAULT_LEADER,
    leaders: undefined,
    leadersKnown: [],
    scenarioId: null,
    defconHistory: [],
    arc: null,
    arcsSeen: [],
    sites: makeSites(),
    trickery: emptyTrickery(),
    brokenArrow: null,
    reactions: [],
    actors,
    flashpoints,
    event: opening,
    usedEventIds: [opening.id],
    lastAction: null,
    lastDecisionKey: null,
    recentDecisionKeys: [],
    threadActor: null,
    threadTag: null,
    aiLast: {},
    lastStrike: null,
    treaties: [],
    lastRecap: null,
    spaceWeather: quietWeather(),
    ceasefire: null,
    c2StanceTurn: 0,
    log: [
      {
        id: "open",
        turn: 1,
        date: "MAR 2027",
        text:
          intent === "blue"
            ? `New START is dead. You have the ${satchel}. Mission: stay below the line. If war begins — win.`
            : `New START is dead. You have the ${satchel}. Mission: advance your state's hostile aims. Dying in a spasm is still a loss.`,
        why: "The treaty expired February 2026. Both sides can upload MIRVs. China is still growing. This is the starting condition, not a surprise.",
        kind: "info",
      },
    ],
    nuclearUses: [],
    firstUse: null,
    missiles: [],
    ended: false,
    ending: null,
  };
  world.authCode = nextAuthCode(world);
  // Derived from the seed, not drawn, so a replay faces the same cast.
  assignLeaders(world);
  world.actors[playerId].warning = warningQuality(world, playerId);
  seedSpies(world);
  world.treaties = seedTreaties(world);
  if (terminator) seedTerminator(world);
  recompute(world);
  return world;
}

export function playerActor(world: World): Actor {
  return world.actors[world.playerId];
}

export function usActor(world: World): Actor {
  return world.actors.US;
}

export function meters(world: World): Meters {
  const me = world.actors[world.playerId] ?? world.actors.US;
  const stability = round(
    0.28 * me.publicOpinion +
      0.24 * me.legitimacy +
      0.18 * me.militaryLoyalty +
      0.16 * (100 - me.polarization) +
      0.14 * me.leadershipStability,
  );
  return {
    defcon: world.defcon,
    stability: clamp(stability, 0, 100),
    alliances: round(world.allianceCohesion),
    risk: round(world.globalRisk),
    economy: round(world.economy),
    winter: round(world.nuclearWinter),
    ai: round(world.aiTakeover ?? 0),
    net: round(world.actors[world.playerId]?.internet ?? 100),
    grid: round(world.actors[world.playerId]?.grid ?? 100),
  };
}

export function recompute(world: World) {
  const maxHeat = Math.max(...world.flashpoints.map((f) => f.heat), 0);
  const uses = world.nuclearUses.length;
  const nk = world.actors.KP.stockpile;
  const terror = world.terrorThreat;
  const race = world.armsRace;
  const defconPenalty = (5 - world.defcon) * 8;
  world.globalRisk = clamp(
    0.28 * maxHeat +
      0.18 * race +
      0.16 * terror +
      0.12 * world.proliferation +
      0.1 * defconPenalty +
      0.08 * (nk > 80 ? 40 : 0) +
      12 * uses +
      0.14 * (world.aiTakeover ?? 0) +
      // Leadership on the move is one of the indicators other capitals read.
      0.06 * (world.postureSignature ?? 0),
    0,
    100,
  );
  if (maxHeat >= 85) world.phase = uses ? "nuclear" : "conventional";
  else if (maxHeat >= 62 || world.defcon <= 3) world.phase = "crisis";
  else if (uses) world.phase = "aftermath";
  else world.phase = "peacetime";

  if (world.defcon <= 2 && world.phase === "peacetime") world.phase = "crisis";
}

export function flash(world: World, id: Flashpoint["id"]): Flashpoint | undefined {
  return world.flashpoints.find((f) => f.id === id);
}

export function bumpFlash(world: World, id: Flashpoint["id"], delta: number) {
  const f = flash(world, id);
  if (!f) return;
  f.heat = clamp(f.heat + delta, 0, 100);
}

/**
 * Doctrinal baseline relations, recovered from `makeActors()`.
 *
 * That builder is fully deterministic and draw-free, so the opening posture of
 * every pair is recoverable on demand and does not need storing on the World or
 * migrating into old saves.
 */
let BASELINE: Record<ActorId, Actor> | null = null;

function baselineHostility(a: ActorId, b: ActorId): number {
  if (!BASELINE) BASELINE = makeActors();
  return BASELINE[a]?.hostility?.[b] ?? 50;
}

/**
 * Relations mean-revert toward their doctrinal baseline.
 *
 * Hostility had no decay of any kind. It was raised from a dozen places and
 * lowered from almost none, so every relationship ratcheted to 100 and stayed
 * there -- measured, a do-nothing watch had North Korea pinned at maximum
 * hostility to the United States by turn three, after which nothing the player
 * did could matter because there was no room left to move. Heat already decays
 * and `tickNerve` already mean-reverts temperament toward `riskTolerance`; this
 * is the same idea applied to the one variable that was missing it.
 *
 * Deliberately slow (8% of the gap per turn, matching tickNerve). A live crisis
 * escalates far faster than this, so it does not stop anything real. It only
 * means a relationship nobody is actively inflaming drifts back to where it
 * started.
 */
/**
 * Opening heat for every flashpoint, mirrored from `createWorld` above so heat
 * has something to revert toward.
 */
const FLASH_BASELINE: Record<string, number> = {
  "korea": 42,
  "taiwan": 38,
  "nato-ru": 44,
  "ukraine": 40,
  "iran": 36,
  "kashmir": 28,
  "terror": 22,
  "south-china": 30,
  "machine": 0,
  "union": 34,
  "cuba": 18,
  "cartel": 24,
  "himalaya": 20,
  "space": 14,
};

/**
 * Flashpoints cool toward their opening temperature.
 *
 * Heat had a flat -1.2 per turn, which sounds like decay but is not: ignoring
 * an event pumps its flashpoint by 5 to 8, and because a HOLD can never
 * "address" an event, any run that holds repeatedly pumps whichever flashpoint
 * the deck keeps returning to. Measured on a do-nothing watch, thirteen of the
 * fourteen flashpoints drifted down as intended and Korea climbed +7.2 a turn
 * to saturation, which then satisfied the heat gate on an adversary firing.
 *
 * Proportional reversion fixes the asymmetry without weakening a live crisis:
 * at the baseline it does nothing, and the further a flashpoint has been pushed
 * from where it started the harder it pulls back. Something actively burning
 * still outruns it easily.
 */
export function tickFlashpoints(world: World) {
  for (const f of world.flashpoints) {
    const base = FLASH_BASELINE[f.id] ?? 20;
    const gap = base - f.heat;
    if (Math.abs(gap) < 0.1) continue;
    f.heat = clamp(f.heat + gap * 0.1, 0, 100);
  }
}

export function tickRelations(world: World) {
  for (const a of ACTOR_IDS) {
    const actor = world.actors[a];
    if (!actor) continue;
    for (const b of ACTOR_IDS) {
      if (a === b) continue;
      const base = baselineHostility(a, b);
      const cur = actor.hostility[b] ?? base;
      const gap = base - cur;
      if (Math.abs(gap) < 0.1) continue;
      actor.hostility[b] = clamp(cur + gap * 0.08, 0, 100);
    }
  }
}

export function hostility(world: World, a: ActorId, b: ActorId): number {
  return world.actors[a]?.hostility[b] ?? 50;
}

export function addHostility(world: World, a: ActorId, b: ActorId, delta: number) {
  const A = world.actors[a];
  const B = world.actors[b];
  if (!A || !B) return;
  A.hostility[b] = clamp((A.hostility[b] ?? 50) + delta, 0, 100);
  B.hostility[a] = clamp((B.hostility[a] ?? 50) + delta * 0.85, 0, 100);
  A.trust[b] = clamp(A.trust[b] - delta * 0.5, 0, 100);
  B.trust[a] = clamp(B.trust[a] - delta * 0.4, 0, 100);
}

export function addTrust(world: World, a: ActorId, b: ActorId, delta: number) {
  const A = world.actors[a];
  const B = world.actors[b];
  if (!A || !B) return;
  A.trust[b] = clamp((A.trust[b] ?? 50) + delta, 0, 100);
  B.trust[a] = clamp((B.trust[a] ?? 50) + delta * 0.8, 0, 100);
  A.hostility[b] = clamp((A.hostility[b] ?? 50) - delta * 0.45, 0, 100);
  B.hostility[a] = clamp((B.hostility[a] ?? 50) - delta * 0.4, 0, 100);
}

export function setDefcon(world: World, n: number) {
  world.defcon = clamp(n, 1, 5) as 1 | 2 | 3 | 4 | 5;
}

export function perceivedWarheads(world: World, actor: Actor): { low: number; high: number; label: string } {
  if (actor.id === world.playerId) {
    return { low: actor.stockpile, high: actor.stockpile, label: String(actor.stockpile) };
  }
  if (actor.id === "US" && world.playerId === "US") {
    return { low: actor.stockpile, high: actor.stockpile, label: String(actor.stockpile) };
  }
  if (actor.threshold) {
    return { low: 0, high: 0, label: actor.hasDevice ? "1 assembled" : "0 — breakout clock" };
  }
  if (actor.nonstate) {
    return {
      low: actor.hasDevice ? 1 : 0,
      high: actor.hasDevice ? 1 : 0,
      label: actor.hasDevice ? "device held" : "no device known",
    };
  }
  const conf = actor.intel / 100;
  const spread = Math.round(actor.stockpile * (0.35 - conf * 0.28) + 4);
  const low = Math.max(0, actor.stockpile - spread);
  const high = actor.stockpile + spread;
  if (conf < 0.35) return { low, high, label: `${low}–${high}` };
  return { low, high, label: `~${actor.stockpile}` };
}

export const DOCTRINE_LABEL: Record<Actor["doctrine"], string> = {
  counterforce: "Counterforce / ambiguity",
  minimum: "Minimum / strict sufficiency",
  "full-spectrum": "Full-spectrum",
  opacity: "Opacity — unacknowledged",
  "first-use-tactical": "First use tactical",
  nfu: "Declared no-first-use",
  asymmetric: "Regime survival / asymmetric",
  "escalate-to-deescalate": "Escalate to de-escalate",
};

export const KIND_LABEL: Record<string, string> = {
  icbm: "ICBM",
  slbm: "SLBM",
  irbm: "IRBM",
  mrbm: "MRBM",
  srbm: "SRBM",
  alcm: "Air-launched cruise",
  glcm: "Ground-launched cruise",
  slcm: "Sea-launched cruise",
  hgv: "Hypersonic glide",
  bomber: "Strategic bomber",
  dca: "Dual-capable aircraft",
  gravity: "Gravity bomb",
  novel: "Novel / exotic",
  covert: "Covert delivery",
  orbital: "Orbital / space-based",
  fobs: "Fractional orbital (FOBS)",
};

export const DISCLOSURE_LABEL: Record<string, string> = {
  acknowledged: "Acknowledged",
  reported: "Reported — not official",
  suspected: "Suspected — assessed",
  unacknowledged: "Unacknowledged",
};

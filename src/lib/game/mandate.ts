/**
 * Mandate — the explicit win point and loss point for a single watch.
 *
 * Before this, a run had no stated goal. You survived 24 months and the engine
 * classified whatever happened into an `EndingKind` at the end. The player was
 * never told what they were playing toward, and `EndScreen` never said whether
 * they had won.
 *
 * A Mandate fixes that. Every watch is issued exactly one victory condition and
 * one defeat condition at creation. Both are visible from turn 1 (they render
 * through the existing generic `Objective` shape) and either can end the run.
 *
 * Two design rules worth keeping:
 *
 * 1. **Victory requires sustained performance, not one lucky turn.** Conditions
 *    carry a `sustain` count of consecutive months, so a run cannot be won on a
 *    single favourable roll at turn 3.
 * 2. **Selection never touches `rngState`.** `resolveTurn` is replayed twice per
 *    render by `forecast()`, and every fixed-seed integrity check depends on the
 *    exact number of draws taken from the shared stream. The mandate is chosen
 *    by a pure FNV-1a hash of the seed instead, so it is deterministic, survives
 *    replay, and perturbs nothing.
 */
import type { ActorId, World } from "./types";
import { meters } from "./world";

export interface MandateCondition {
  id: string;
  label: string;
  detail: string;
  /** True while the condition holds THIS month. */
  holds: (w: World) => boolean;
  /** 0–100, for the objectives bar. */
  progress: (w: World) => number;
  /** Consecutive months required. 1 = fires the moment it holds. */
  sustain: number;
  /**
   * Earliest month this may resolve. Several conditions are already true at
   * turn 1 — risk starts at 25, grid and networks start at 100 — so without a
   * floor a watch could be "won" on turn 4 by doing nothing at all. A mandate
   * has to be endured, not merely inherited.
   */
  notBefore?: number;
  /** Eligibility — a mandate is only issued to a watch it makes sense for. */
  fits?: (w: World) => boolean;
}

export interface MandateState {
  victoryId: string;
  defeatId: string;
  issuedTurn: number;
  victoryStreak: number;
  defeatStreak: number;
  resolved: "victory" | "defeat" | null;
  /**
   * Last turn the streaks advanced. `finishIfNeeded` can run twice in one turn
   * (once on a strategic spasm, once at the end of the pipeline), and without
   * this a single month would count as two toward a sustain requirement.
   */
  lastTickTurn: number;
}

declare module "./types" {
  interface World {
    mandate?: MandateState;
  }
}

const pct = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

/** No mandate victory resolves before this month, whatever the condition says. */
export const MIN_VICTORY_MONTH = 8;

/** Progress toward holding a predicate for `need` consecutive months. */
function streakPct(streak: number, need: number) {
  return pct((streak / Math.max(1, need)) * 100);
}

function flashHeat(w: World, id: string): number {
  return w.flashpoints.find((f) => f.id === id)?.heat ?? 0;
}

function maxFlashHeat(w: World): number {
  return Math.max(0, ...w.flashpoints.map((f) => f.heat));
}

const NEW_DEVICE_ACTORS: ActorId[] = ["NS", "CR"];

// ---------------------------------------------------------------------------
// Victory conditions
// ---------------------------------------------------------------------------

export const VICTORY_CONDITIONS: MandateCondition[] = [
  {
    id: "risk-floor",
    label: "Hold global risk under 22 for three straight months",
    detail: "Not a truce — a trend. Risk opens at 25, so this is below where you started.",
    sustain: 3,
    notBefore: 10,
    holds: (w) => meters(w).risk < 22,
    progress: (w) => streakPct(w.mandate?.victoryStreak ?? 0, 3),
  },
  {
    id: "quiet-year",
    label: "Reach month 18 with no nuclear use and partners above 60",
    detail: "Survival alone is not the mandate. You have to arrive with the alliance intact.",
    sustain: 1,
    holds: (w) => w.turn >= 18 && w.nuclearUses.length === 0 && meters(w).alliances >= 60,
    progress: (w) =>
      w.nuclearUses.length > 0
        ? 0
        : pct((Math.min(w.turn, 18) / 18) * 100 * (meters(w).alliances >= 60 ? 1 : 0.6)),
  },
  {
    id: "alliance-anchor",
    label: "Hold alliance cohesion at 75 or better for three months",
    detail: "Coalitions are kept, not owned. Three months is long enough to prove it was not luck.",
    sustain: 3,
    holds: (w) => meters(w).alliances >= 75,
    progress: (w) => streakPct(w.mandate?.victoryStreak ?? 0, 3),
    fits: (w) => w.intent === "blue",
  },
  {
    id: "cool-the-board",
    label: "Get every flashpoint below 45 heat and hold it two months",
    detail: "One quiet corner is easy. All of them at once is the job.",
    sustain: 2,
    notBefore: 10,
    holds: (w) => maxFlashHeat(w) < 45,
    progress: (w) => streakPct(w.mandate?.victoryStreak ?? 0, 2),
  },
  {
    id: "stabilize-home",
    label: "Hold domestic stability at 70 or better for three months",
    detail: "Command that cannot hold its own country cannot hold anything else.",
    sustain: 3,
    holds: (w) => meters(w).stability >= 70,
    progress: (w) => streakPct(w.mandate?.victoryStreak ?? 0, 3),
  },
  {
    id: "deterrence-without-alert",
    label: "Reach month 12 at ALERT 4 or better with risk under 45",
    detail:
      "Generating forces is the easy answer. Staying un-generated while the risk falls is the hard one.",
    sustain: 1,
    holds: (w) => w.turn >= 12 && w.defcon >= 4 && meters(w).risk < 45,
    progress: (w) => pct((Math.min(w.turn, 12) / 12) * 100 * (w.defcon >= 4 ? 1 : 0.5)),
  },
  {
    id: "grid-integrity",
    label: "Reach month 14 with grid and networks still above 85",
    detail: "Infrastructure is warning. Lose it and every later decision is made blind.",
    sustain: 3,
    notBefore: 14,
    holds: (w) => meters(w).net >= 85 && meters(w).grid >= 85,
    progress: (w) => streakPct(w.mandate?.victoryStreak ?? 0, 3),
  },
  {
    id: "contain-proliferation",
    label: "Reach month 15 with no new nuclear actor",
    detail: "No non-state device, and no breakout completed on your watch.",
    sustain: 1,
    holds: (w) =>
      w.turn >= 15 &&
      !NEW_DEVICE_ACTORS.some((id) => w.actors[id]?.hasDevice) &&
      w.actors.IR.breakoutWeeks > 8,
    progress: (w) =>
      NEW_DEVICE_ACTORS.some((id) => w.actors[id]?.hasDevice)
        ? 0
        : pct((Math.min(w.turn, 15) / 15) * 100),
  },
  {
    id: "machine-leashed",
    label: "Reach month 18 with machine takeover held under 35",
    detail: "The model stays a tool. The authenticator path stays human.",
    sustain: 1,
    holds: (w) => w.turn >= 18 && (w.aiTakeover ?? 0) < 35,
    progress: (w) => ((w.aiTakeover ?? 0) >= 35 ? 0 : pct((Math.min(w.turn, 18) / 18) * 100)),
    fits: (w) => w.terminator,
  },
  {
    id: "hands-off-the-book",
    label: "Reach month 20 without ever generating past ALERT 3",
    detail: "A whole watch where the alert level was never the answer.",
    sustain: 1,
    holds: (w) => w.turn >= 20 && w.defcon >= 3,
    progress: (w) => (w.defcon < 3 ? 0 : pct((Math.min(w.turn, 20) / 20) * 100)),
    fits: (w) => w.intent === "blue",
  },
  {
    id: "coercion-without-spasm",
    label: "Advance your aims for two months with no nuclear use",
    detail: "Coercion that does not spill. The red-team win is pressure the other side absorbs.",
    sustain: 2,
    holds: (w) =>
      w.nuclearUses.length === 0 &&
      meters(w).risk > 40 &&
      flashHeat(w, "space") + maxFlashHeat(w) > 60,
    progress: (w) => streakPct(w.mandate?.victoryStreak ?? 0, 2),
    fits: (w) => w.intent === "red",
  },
  {
    id: "fracture-the-bloc",
    label: "Push alliance cohesion under 45 while holding your own stability above 55",
    detail: "Split them without splitting yourself.",
    sustain: 2,
    holds: (w) => meters(w).alliances < 45 && meters(w).stability > 55,
    progress: (w) => streakPct(w.mandate?.victoryStreak ?? 0, 2),
    fits: (w) => w.intent === "red",
  },
];

// ---------------------------------------------------------------------------
// Defeat conditions
// ---------------------------------------------------------------------------

export const DEFEAT_CONDITIONS: MandateCondition[] = [
  {
    id: "alliance-collapse",
    label: "Alliance cohesion falls below 20",
    detail: "Partners stop answering. Every later option costs more and arrives later.",
    sustain: 1,
    holds: (w) => meters(w).alliances < 20,
    progress: (w) => pct(((60 - meters(w).alliances) / 40) * 100),
  },
  {
    id: "risk-runaway",
    label: "Global risk sits at 85 or above for two months",
    detail: "Not a spike — a plateau. The board stops being recoverable.",
    sustain: 2,
    holds: (w) => meters(w).risk >= 85,
    progress: (w) => pct(((meters(w).risk - 45) / 40) * 100),
  },
  {
    id: "command-erosion",
    label: "Legitimacy falls below 25 or military loyalty below 30",
    detail: "Short of a coup, but far enough that your orders are negotiable.",
    sustain: 1,
    holds: (w) => {
      const me = w.actors[w.playerId];
      return me.legitimacy < 25 || me.militaryLoyalty < 30;
    },
    progress: (w) => {
      const me = w.actors[w.playerId];
      return pct(
        Math.max(((55 - me.legitimacy) / 30) * 100, ((60 - me.militaryLoyalty) / 30) * 100),
      );
    },
  },
  {
    id: "economic-collapse",
    label: "The economy falls below 25",
    detail: "Sanctions, mobilisation and panic priced in. Capacity for anything else is gone.",
    sustain: 1,
    holds: (w) => meters(w).economy < 25,
    progress: (w) => pct(((60 - meters(w).economy) / 35) * 100),
  },
  {
    id: "lights-out",
    label: "Your grid falls below 30 or your networks below 25",
    detail: "You lose warning before you lose anything else. Then you are deciding blind.",
    sustain: 1,
    holds: (w) => meters(w).grid < 30 || meters(w).net < 25,
    progress: (w) =>
      pct(Math.max(((70 - meters(w).grid) / 40) * 100, ((70 - meters(w).net) / 45) * 100)),
  },
  {
    id: "any-nuclear-use",
    label: "Any nuclear detonation, anywhere, by anyone",
    detail: "The strictest mandate on the board. Prevention is the whole assignment.",
    sustain: 1,
    holds: (w) => w.nuclearUses.length > 0,
    progress: (w) => (w.nuclearUses.length > 0 ? 100 : pct(meters(w).risk)),
    fits: (w) => w.intent === "blue",
  },
  {
    id: "device-loose",
    label: "A non-state actor obtains a working device",
    detail: "Deterrence by punishment has no return address. Prevention was the strategy.",
    sustain: 1,
    holds: (w) => NEW_DEVICE_ACTORS.some((id) => w.actors[id]?.hasDevice),
    progress: (w) => pct(w.terrorThreat),
  },
  {
    id: "flashpoint-boil",
    label: "Any flashpoint sits at 92 heat or above for two months",
    detail: "One corner of the board stops cooling and starts pulling everything into it.",
    sustain: 2,
    holds: (w) => maxFlashHeat(w) >= 92,
    progress: (w) => pct(((maxFlashHeat(w) - 50) / 42) * 100),
  },
  {
    id: "machine-ascendant",
    label: "Machine takeover reaches 70",
    detail: "Short of the model owning the path, but past the point where your veto is real.",
    sustain: 1,
    holds: (w) => (w.aiTakeover ?? 0) >= 70,
    progress: (w) => pct(((w.aiTakeover ?? 0) / 70) * 100),
    fits: (w) => w.terminator,
  },
  {
    id: "winter-onset",
    label: "The nuclear winter index reaches 18",
    detail: "Half the catastrophic threshold. The climate and food system start to answer for you.",
    sustain: 1,
    holds: (w) => w.nuclearWinter >= 18,
    progress: (w) => pct((w.nuclearWinter / 18) * 100),
  },
];

// ---------------------------------------------------------------------------
// Selection — deterministic, and deliberately RNG-free
// ---------------------------------------------------------------------------

/** FNV-1a. Used instead of `rng.ts` so mandate selection never advances `rngState`. */
function hash32(text: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function choose(pool: MandateCondition[], world: World, salt: string): MandateCondition {
  const eligible = pool.filter((c) => !c.fits || c.fits(world));
  const list = eligible.length ? eligible : pool;
  const key = `${world.seed}:${world.playerId}:${world.intent}:${world.scenarioId ?? "sandbox"}:${salt}`;
  return list[hash32(key) % list.length];
}

export function conditionById(pool: MandateCondition[], id: string): MandateCondition | undefined {
  return pool.find((c) => c.id === id);
}

export function victoryOf(world: World): MandateCondition | undefined {
  return world.mandate ? conditionById(VICTORY_CONDITIONS, world.mandate.victoryId) : undefined;
}

export function defeatOf(world: World): MandateCondition | undefined {
  return world.mandate ? conditionById(DEFEAT_CONDITIONS, world.mandate.defeatId) : undefined;
}

/**
 * Issue a mandate if the watch does not have one. Idempotent, so it is safe to
 * call from `migrateWorld` for saves written before mandates existed.
 */
export function ensureMandate(world: World): World {
  if (
    world.mandate &&
    conditionById(VICTORY_CONDITIONS, world.mandate.victoryId) &&
    conditionById(DEFEAT_CONDITIONS, world.mandate.defeatId)
  ) {
    if (typeof world.mandate.lastTickTurn !== "number") world.mandate.lastTickTurn = -1;
    return world;
  }
  world.mandate = {
    victoryId: choose(VICTORY_CONDITIONS, world, "victory").id,
    defeatId: choose(DEFEAT_CONDITIONS, world, "defeat").id,
    issuedTurn: world.turn,
    victoryStreak: 0,
    defeatStreak: 0,
    resolved: null,
    lastTickTurn: -1,
  };
  return world;
}

/**
 * Advance both streaks by one month and record a resolution if either condition
 * has now held long enough. Called once per turn from `resolveTurn`, after the
 * world has settled, so it reads final state for the month.
 *
 * Defeat is evaluated first: a watch that satisfies both in the same month has
 * lost. You do not get to bank a victory in the month the floor gives way.
 */
export function tickMandate(world: World) {
  ensureMandate(world);
  const m = world.mandate;
  if (!m || m.resolved) return;
  if (m.lastTickTurn === world.turn) return;
  m.lastTickTurn = world.turn;

  const defeat = defeatOf(world);
  if (defeat) {
    m.defeatStreak = defeat.holds(world) ? m.defeatStreak + 1 : 0;
    if (m.defeatStreak >= defeat.sustain) {
      m.resolved = "defeat";
      return;
    }
  }

  const victory = victoryOf(world);
  if (victory) {
    m.victoryStreak = victory.holds(world) ? m.victoryStreak + 1 : 0;
    const earliest = Math.max(MIN_VICTORY_MONTH, victory.notBefore ?? 0);
    if (m.victoryStreak >= victory.sustain && world.turn >= earliest) m.resolved = "victory";
  }
}

/** The mandate rendered through the shared `Objective` shape used by ObjectivesPanel. */
export function mandateObjectives(world: World): Array<{
  id: string;
  label: string;
  progress: number;
  met: boolean;
  detail: string;
  tone: "goal" | "hazard";
}> {
  ensureMandate(world);
  const m = world.mandate;
  if (!m) return [];
  const victory = victoryOf(world);
  const defeat = defeatOf(world);
  const out: Array<{
    id: string;
    label: string;
    progress: number;
    met: boolean;
    detail: string;
    tone: "goal" | "hazard";
  }> = [];
  if (victory) {
    out.push({
      id: `mandate-victory-${victory.id}`,
      label: `MANDATE — ${victory.label}`,
      progress: m.resolved === "victory" ? 100 : victory.progress(world),
      met: m.resolved === "victory",
      detail:
        victory.sustain > 1
          ? `${victory.detail} Held ${m.victoryStreak}/${victory.sustain} months.`
          : victory.detail,
      tone: "goal",
    });
  }
  if (defeat) {
    out.push({
      id: `mandate-defeat-${defeat.id}`,
      label: `LOSS POINT — ${defeat.label}`,
      progress: m.resolved === "defeat" ? 100 : defeat.progress(world),
      met: m.resolved === "defeat",
      detail:
        defeat.sustain > 1
          ? `${defeat.detail} Standing ${m.defeatStreak}/${defeat.sustain} months.`
          : defeat.detail,
      tone: "hazard",
    });
  }
  return out;
}

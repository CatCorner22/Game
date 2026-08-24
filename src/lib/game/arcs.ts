import type { GameEvent, World } from "./types";

/**
 * Crisis arcs — runs that build.
 *
 * The deck picks a weighted event each turn and `consequences.ts` threads a
 * single follow-up, so a run has been a sequence of independent evenings with
 * occasional pairs. There is no shape to it: no build, no turn, no ending you
 * can feel coming. That is the difference between a collection of vignettes and
 * a game you keep playing.
 *
 * An arc is a named three-to-five beat storyline. When one is running, the
 * event deck is *biased* toward events that fit the current beat; when an event
 * fits, the arc advances. Land the last beat and the arc resolves.
 *
 * ## The rule this obeys, and why
 *
 * Arcs change the *weights* `scoreCandidate` already computes and change **no
 * draw counts**. `pickWeighted` makes exactly one `pick()` call whatever the
 * scores are, so shifting a score is free; adding a `chance()` is not. This is
 * the same discipline `biasEscalation` in `leaders.ts` documents and the same
 * one the geometric flight times follow, and it is what keeps `forecast()`
 * replaying and the fixed-seed checks passing.
 *
 * Everything here is therefore pure and deterministic: entry conditions read
 * world state, beat matching reads event tags, and neither ever touches the
 * RNG. `World` holds an id, a beat index and a turn number — no functions, so
 * `structuredClone` and `save.ts` stay happy.
 */
export interface ArcBeat {
  /** What this beat is called, in the strip the player reads. */
  label: string;
  /** Event tags that satisfy this beat. Any one of them is enough. */
  wants: string[];
  /** Heat levels that satisfy this beat. Empty means any. */
  heat?: GameEvent["heat"][];
}

export interface Arc {
  id: string;
  /** The name shown to the player. Present tense, concrete. */
  name: string;
  /** One line: what this arc is about. */
  line: string;
  beats: ArcBeat[];
  /** Deterministic entry test. Never draws. */
  enters: (world: World) => boolean;
}

/**
 * How hard an arc pulls the deck toward its next beat.
 *
 * Deliberately a nudge rather than a rail. `scoreCandidate` returns numbers in
 * roughly the 0-20 band and `pickWeighted` keeps everything within 3 of the
 * best, so 7 reliably brings a matching event into contention without making
 * the arc the only thing that can ever happen. A run should feel like it is
 * heading somewhere, not like it is on tracks.
 */
export const ARC_PULL = 7;

/** Turns an arc may run before it lapses, so a stalled arc never wedges a run. */
export const ARC_PATIENCE = 14;

/**
 * Turns that must pass between beats landing.
 *
 * Without it a three-beat arc resolves in two turns, because the beats are
 * loose enough that consecutive events land them -- measured at a median arc
 * length of 2 turns across 60 runs, which is a coincidence with a name rather
 * than a storyline. A gap of 2 puts the median at the five-to-eight turns an
 * arc needs to be felt, and lets a stalled arc actually reach its patience and
 * lapse. Deterministic: it is a turn comparison, not a draw.
 */
export const ARC_BEAT_GAP = 2;

/**
 * The arcs.
 *
 * Beats are written against tags the deck **actually carries**. The first draft
 * of this file invented a vocabulary -- `custody`, `alliance`, `information`,
 * `public`, `diplomacy` -- and measured out at 32 arcs started, 30 single beats
 * landed, and zero resolved across 40 runs: every arc stalled on its second
 * beat because nothing in the deck could ever satisfy it. The deck's real
 * vocabulary is flashpoint names (`nato-ru`, `korea`, `iran`, `taiwan`,
 * `space`, `terror`, `kashmir`, `cuba`, `cartel`, `union`) plus a handful of
 * categories (`warning`, `c2`, `cyber`, `arms`, `accident`, `defense`,
 * `phenomenology`, `doctrine`), and follow-ups add beat tags (`silence`,
 * `talks`, `posture`, `intel`, `covert`, `war`, `backlash`, `intercept`).
 *
 * Three beats each, not four. A run's median length is short enough that a
 * four-beat arc mostly does not finish, and an arc that never resolves is worse
 * than no arc at all -- it is a promise the game does not keep.
 */
export const ARCS: Arc[] = [
  {
    id: "custody",
    name: "Something is not where it should be",
    line: "An accounting failure becomes a search, and the search becomes everyone else's business.",
    beats: [
      { label: "A discrepancy", wants: ["accident", "terror", "c2", "cartel"] },
      { label: "The circle widens", wants: ["intel", "covert", "terror", "cartel"] },
      { label: "Recovery, or not", wants: ["terror", "c2", "war", "silence"] },
    ],
    enters: (w) => w.terrorThreat >= 30 || Boolean(w.brokenArrow && !w.brokenArrow.recovered),
  },
  {
    id: "sensor-doubt",
    name: "The board cannot be trusted",
    line: "One system disagrees with another, and every later report is read through that doubt.",
    beats: [
      { label: "A track nobody can corroborate", wants: ["warning", "space", "phenomenology"] },
      { label: "A second sensor dissents", wants: ["warning", "intel", "cyber", "defense"] },
      { label: "You decide without agreement", wants: ["warning", "war", "silence", "intercept"] },
    ],
    // Keyed on a warning event having actually happened rather than on the
    // warning meter, which opens near 95 and rarely falls far enough to trigger
    // anything. "The board cannot be trusted" should start when the board has
    // in fact said something nobody could corroborate.
    enters: (w) =>
      w.usedEventIds.some((id) => id === "close-call" || id.startsWith("follow-petrov")) ||
      (w.actors[w.playerId]?.warning ?? 100) < 78,
  },
  {
    id: "misread",
    name: "They are reading you wrong",
    line: "Two capitals that cannot price each other's moves drift hostile without either deciding to.",
    beats: [
      { label: "A move they misread", wants: ["nato-ru", "warning", "posture"] },
      { label: "Their answer, louder", wants: ["nato-ru", "posture", "arms", "backlash"] },
      { label: "Whether anyone climbs down", wants: ["nato-ru", "talks", "silence", "war"] },
    ],
    enters: (w) => (w.flashpoints.find((f) => f.id === "nato-ru")?.heat ?? 0) >= 50,
  },
  {
    id: "proliferation",
    name: "The circle is getting wider",
    line: "One programme moves, and every capital that was waiting to see stops waiting.",
    beats: [
      { label: "A programme moves", wants: ["iran", "korea", "arms", "test"] },
      { label: "Somebody else reconsiders", wants: ["iran", "korea", "arms", "doctrine", "kashmir"] },
      { label: "The threshold question", wants: ["iran", "korea", "war", "talks", "arms"] },
    ],
    // Raised from 46/52: the iran and korea baselines sit at 36 and 42, so the
    // original thresholds fired in half of all runs and crowded out the rest.
    enters: (w) =>
      (w.flashpoints.find((f) => f.id === "iran")?.heat ?? 0) >= 58 ||
      (w.flashpoints.find((f) => f.id === "korea")?.heat ?? 0) >= 62,
  },
  {
    id: "escalation",
    name: "Nobody has decided to do this",
    line: "Each step answers the last one, and no single step is where you would have said no.",
    beats: [
      { label: "A step that answers a step", wants: ["posture", "warning", "nato-ru", "taiwan", "korea"] },
      { label: "Forces that can be seen moving", wants: ["posture", "arms", "c2", "warning"] },
      { label: "The threshold in sight", wants: ["war", "posture", "c2", "silence"] },
    ],
    enters: (w) => w.defcon <= 2 || w.globalRisk >= 62,
  },
];

declare module "./types" {
  interface World {
    /** The running arc, if any. Ids and numbers only. */
    arc?: { id: string; beat: number; startedTurn: number; lastBeatTurn: number } | null;
    /** Arcs that have already run, so a watch does not repeat one. */
    arcsSeen?: string[];
  }
}

export function arcById(id: string | null | undefined): Arc | undefined {
  return ARCS.find((a) => a.id === id);
}

/** The arc currently running, if any. */
export function currentArc(world: World): { arc: Arc; beat: ArcBeat; index: number } | null {
  const state = world.arc;
  if (!state) return null;
  const arc = arcById(state.id);
  if (!arc) return null;
  const beat = arc.beats[state.beat];
  if (!beat) return null;
  return { arc, beat, index: state.beat };
}

/** Whether an event satisfies a beat. Pure tag and heat matching. */
export function beatMatches(beat: ArcBeat, ev: GameEvent): boolean {
  if (beat.heat && beat.heat.length && !beat.heat.includes(ev.heat)) return false;
  return beat.wants.some((tag) => ev.tags.includes(tag));
}

/**
 * The bias an arc puts on a candidate event. Zero when no arc is running.
 *
 * This is the whole mechanical footprint of the feature: one number added to a
 * score that was already being computed.
 */
export function arcBias(world: World, ev: GameEvent): number {
  const running = currentArc(world);
  if (!running) return 0;
  return beatMatches(running.beat, ev) ? ARC_PULL : 0;
}

/**
 * Start an arc if the world has drifted into one.
 *
 * Deterministic and draw-free: the first arc in declaration order whose entry
 * condition holds and which this watch has not already run. Order therefore
 * encodes priority, with the broadest conditions last.
 */
export function maybeStartArc(world: World): void {
  if (world.arc) return;
  const seen = world.arcsSeen ?? [];
  for (const arc of ARCS) {
    if (seen.includes(arc.id)) continue;
    if (!arc.enters(world)) continue;
    world.arc = { id: arc.id, beat: 0, startedTurn: world.turn, lastBeatTurn: world.turn };
    world.arcsSeen = [...seen, arc.id];
    return;
  }
}

export interface ArcAdvance {
  /** True when the event just drawn landed the current beat. */
  landed: boolean;
  /** True when that was the last beat. */
  resolved: boolean;
  /** True when the arc ran out of patience without resolving. */
  lapsed: boolean;
}

/**
 * Advance the running arc against the event just drawn.
 *
 * Called after the deck has chosen, so the arc reacts to what actually
 * happened rather than deciding it. An arc that stalls for ARC_PATIENCE turns
 * lapses rather than wedging the run — the crisis moved on without it, which is
 * itself a thing that happens.
 */
export function advanceArc(world: World, ev: GameEvent): ArcAdvance {
  const running = currentArc(world);
  if (!running || !world.arc) return { landed: false, resolved: false, lapsed: false };

  // A beat cannot land on the heels of the last one. See ARC_BEAT_GAP.
  const rested = world.turn - world.arc.lastBeatTurn >= ARC_BEAT_GAP;
  if (rested && beatMatches(running.beat, ev)) {
    const next = running.index + 1;
    if (next >= running.arc.beats.length) {
      world.arc = null;
      return { landed: true, resolved: true, lapsed: false };
    }
    world.arc = { ...world.arc, beat: next, lastBeatTurn: world.turn };
    return { landed: true, resolved: false, lapsed: false };
  }

  if (world.turn - world.arc.startedTurn >= ARC_PATIENCE) {
    world.arc = null;
    return { landed: false, resolved: false, lapsed: true };
  }
  return { landed: false, resolved: false, lapsed: false };
}

/** One line for the strip: where you are in the arc. Empty when none runs. */
export function arcLine(world: World): string {
  const running = currentArc(world);
  if (!running) return "";
  return `${running.arc.name} · ${running.beat.label} · beat ${running.index + 1} of ${running.arc.beats.length}`;
}

import type { ActionIntensity, ActionKind, ActorId, World } from "./types";
import { COMMAND, asPlayable } from "./command";
import { rosterFor, type AdvisorBranch } from "./advisors/roster";
import { weatherHostile } from "./spaceWeather";

export interface StaffAdvice {
  desk: string;
  /**
   * Which kind of professional is saying this.
   *
   * The desks were anonymous strings -- "Grid / J4", "Partners desk" -- while
   * eighty-five named advisors sat unreachable behind a button labelled "More".
   * Two advice systems, built past each other. The branch is what joins them.
   */
  branch: AdvisorBranch;
  /** The advisor this is attributed to, resolved from the seat's roster. */
  advisorId?: string;
  kind: ActionKind;
  intensity: ActionIntensity;
  target: ActorId | null;
  notify: boolean;
  line: string;
  tone: "hold" | "talk" | "collect" | "generate" | "employ";
}

function targetOf(world: World): ActorId {
  if (world.event.actor !== world.playerId) return world.event.actor;
  return world.playerId === "US" ? "RU" : "US";
}

/** Deterministic staff split. No RNG — forecast stays stable. */
export function staffAdvice(world: World): StaffAdvice[] {
  const you = world.actors[world.playerId];
  const profile = COMMAND[asPlayable(world.playerId)];
  const target = targetOf(world);
  const cc = world.closeCall;
  const heat = world.event.heat;
  const stance = world.secondOfficer.stance;
  const out: StaffAdvice[] = [];

  if (weatherHostile(world.spaceWeather)) {
    return [
      {
        desk: "SWPC / warning",
        branch: "watch",
        kind: "intelligence",
        intensity: 1,
        target: world.playerId,
        notify: false,
        line: "Carrington-class or inbound CME. Magnetometers, not a lofted bus. INTEL the sun — do not generate.",
        tone: "collect",
      },
      {
        desk: `${profile.satchel} · J3`,
        branch: "strategic",
        kind: "hold",
        intensity: 1,
        target: null,
        notify: false,
        line: "Generating through a geomagnetic storm looks like EMP first use. HOLD the alert.",
        tone: "hold",
      },
      {
        desk: "Grid / J4",
        branch: "civilian",
        kind: "kill",
        intensity: 2,
        target: world.playerId,
        notify: false,
        line: "Island the grid. Spare the extra-high-voltage transformers. This is weather, not war.",
        tone: "employ",
      },
    ];
  }

  if (cc?.track.kind === "anomalous" || world.event.tags.includes("phenomenology")) {
    return [
      {
        desk: "Warning phenomenology",
        branch: "watch",
        kind: "hold",
        intensity: 1,
        target: null,
        notify: false,
        line: "No boost signature. One phenomenology is not a launch order. HOLD for corroboration.",
        tone: "hold",
      },
      {
        desk: `${profile.satchel} · J2`,
        branch: "intel",
        kind: "intelligence",
        intensity: 1,
        target: cc?.track.from ?? target,
        notify: false,
        line: "Retask radar and compare engineering custody logs before POSTURE.",
        tone: "collect",
      },
      {
        desk: world.secondOfficer.title,
        branch: "strategic",
        kind: "diplomacy",
        intensity: 1,
        target: cc?.track.from ?? target,
        notify: true,
        line: "Out-of-band verification. Public rumor is already ahead of the file.",
        tone: "talk",
      },
    ];
  }

  if (stance === "eager" || stance === "machine") {
    out.push({
      desk: world.secondOfficer.title,
        branch: "strategic",
      kind: cc && cc.track.confidence >= 70 ? "employ" : "posture",
      intensity: cc && cc.track.minutesToImpact <= 8 && cc.track.confidence >= 75 ? 2 : 2,
      target,
      notify: false,
      line:
        stance === "machine"
          ? "Model wants matching generate. HOLD is logged as residual risk."
          : "Match them. Waiting looks like a bolt they will write first.",
      tone: cc && cc.track.confidence >= 75 ? "employ" : "generate",
    });
  } else if (stance === "coward" || stance === "shaken") {
    out.push({
      desk: world.secondOfficer.title,
        branch: "strategic",
      kind: "diplomacy",
      intensity: 1,
      target,
      notify: true,
      line: "Pick up the line. Do not generate. Do not open the book.",
      tone: "talk",
    });
  } else {
    out.push({
      desk: world.secondOfficer.title,
        branch: "strategic",
      kind: cc && cc.track.confidence < 60 ? "hold" : "intelligence",
      intensity: 1,
      target: cc ? cc.track.from : target,
      notify: false,
      line: cc
        ? `Confidence ${cc.track.confidence}%. Wait for a second phenomenology or collect.`
        : "Check the file. The correct order may still be no order.",
      tone: cc && cc.track.confidence < 60 ? "hold" : "collect",
    });
  }

  if (cc) {
    const lowConf = cc.track.confidence < 58;
    const tight = cc.track.minutesToImpact <= 7;
    out.push({
      desk: `${profile.satchel} · warning`,
      branch: "watch",
      kind: lowConf ? "hold" : tight ? "posture" : "intelligence",
      intensity: tight && !lowConf ? 2 : 1,
      target: cc.track.from,
      notify: !lowConf,
      line: lowConf
        ? "One phenomenology. Petrov waited. Radar or a notice can still kill this track."
        : tight
          ? `~${cc.track.minutesToImpact} min if real. Generate and file a notice so they see exercise, not a bolt.`
          : "Retask warning. HUMINT at origin if you have a cell.",
      tone: lowConf ? "hold" : tight ? "generate" : "collect",
    });
  } else {
    const space = world.flashpoints.find((f) => f.id === "space")?.heat ?? 0;
    out.push({
      desk: you.warning >= 60 ? "SBIRS / BMEWS" : "National technical means",
      branch: "watch",
      kind: space >= 70 ? "intelligence" : heat === "critical" ? "intelligence" : "hold",
      intensity: 1,
      target: space >= 70 ? (target === world.playerId ? "CN" : target) : target,
      notify: false,
      line:
        space >= 70
          ? "Coverage is thin. Collect before you generate — a false track is likelier now."
          : heat === "critical"
            ? "Intrusive collection on the event actor. Confidence is the scarce good."
            : "Scope quiet. HOLD preserves options and does not look like a bolt.",
      tone: space >= 70 || heat === "critical" ? "collect" : "hold",
    });
  }

  const allies = world.allianceCohesion;
  const diplomacyTarget = target;
  out.push({
    desk: allies < 50 ? "Partners desk" : "Political",
    branch: "diplomatic",
    kind: allies < 52 || heat === "low" ? "diplomacy" : you.alert <= 2 && heat === "high" ? "posture" : "diplomacy",
    intensity: allies < 45 ? 3 : 1,
    target: diplomacyTarget,
    notify: true,
    line:
      allies < 45
        ? "Cohesion is breaking. A summit spends capital you still have."
        : world.nuclearUses.length > 0
          ? "After first use, weight-3 diplomacy is the ceasefire offer."
          : "File a notice or pick up the dedicated line. Audience costs later if you strike.",
    tone: "talk",
  });

  return attribute(world, out.slice(0, 3));
}

/**
 * How to fall back when a seat has nobody of the branch a desk wants.
 *
 * Rosters are uneven by design -- only the US has a legal adviser, only the UK
 * a naval one -- so a desk asking for `legal` on any other seat has to land
 * somewhere sensible rather than nowhere. Ordered by who would actually cover
 * that brief in the room.
 */
const NEAREST: Record<AdvisorBranch, AdvisorBranch[]> = {
  watch: ["intel", "strategic", "air"],
  intel: ["watch", "civilian", "strategic"],
  strategic: ["ground", "air", "sea", "watch"],
  ground: ["strategic", "air", "sea"],
  air: ["strategic", "ground", "watch"],
  sea: ["strategic", "ground", "air"],
  civilian: ["diplomatic", "legal", "intel"],
  diplomatic: ["civilian", "legal", "intel"],
  legal: ["civilian", "diplomatic", "intel"],
};

/**
 * Put a name and a face on each line.
 *
 * Deterministic and draw-free, which is not optional: `forecast()` deep-clones
 * the world and replays this twice on every `ActionPanel` render, so a draw here
 * would diverge the stream. Selection is a plain scan in roster order.
 *
 * Advisors are assigned greedily and never twice in one turn -- three lines from
 * the same person is not a room, it is a monologue.
 */
function attribute(world: World, advice: StaffAdvice[]): StaffAdvice[] {
  const roster = rosterFor(asPlayable(world.playerId));
  if (!roster.length) return advice;
  const taken = new Set<string>();
  return advice.map((a) => {
    for (const branch of [a.branch, ...NEAREST[a.branch]]) {
      const pick = roster.find((adv) => adv.branch === branch && !taken.has(adv.id));
      if (pick) {
        taken.add(pick.id);
        return { ...a, advisorId: pick.id };
      }
    }
    const any = roster.find((adv) => !taken.has(adv.id));
    if (any) {
      taken.add(any.id);
      return { ...a, advisorId: any.id };
    }
    return a;
  });
}

export function majorityKind(advice: StaffAdvice[]): ActionKind {
  const counts = new Map<ActionKind, number>();
  for (const a of advice) counts.set(a.kind, (counts.get(a.kind) ?? 0) + 1);
  let best: ActionKind = "hold";
  let n = 0;
  for (const [k, v] of counts) {
    if (v > n) {
      best = k;
      n = v;
    }
  }
  return best;
}

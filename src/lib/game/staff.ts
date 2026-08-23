import type { ActionIntensity, ActionKind, ActorId, World } from "./types";
import { COMMAND, asPlayable } from "./command";
import { weatherHostile } from "./spaceWeather";

export interface StaffAdvice {
  desk: string;
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
        kind: "intelligence",
        intensity: 1,
        target: world.playerId,
        notify: false,
        line: "Carrington-class or inbound CME. Magnetometers, not a lofted bus. INTEL the sun — do not generate.",
        tone: "collect",
      },
      {
        desk: `${profile.satchel} · J3`,
        kind: "hold",
        intensity: 1,
        target: null,
        notify: false,
        line: "Generating through a geomagnetic storm looks like EMP first use. HOLD the alert.",
        tone: "hold",
      },
      {
        desk: "Grid / J4",
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
        kind: "hold",
        intensity: 1,
        target: null,
        notify: false,
        line: "No boost signature. One phenomenology is not a launch order. HOLD for corroboration.",
        tone: "hold",
      },
      {
        desk: `${profile.satchel} · J2`,
        kind: "intelligence",
        intensity: 1,
        target: cc?.track.from ?? target,
        notify: false,
        line: "Retask radar and compare engineering custody logs before POSTURE.",
        tone: "collect",
      },
      {
        desk: world.secondOfficer.title,
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

  return out.slice(0, 3);
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

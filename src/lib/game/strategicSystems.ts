import type { ActionKind, PlayerAction, World } from "./types";
import { clamp, nextUnit, round } from "./rng";
import { log } from "./simLog";

export type StrategicAIMode = "human" | "copilot" | "ensemble" | "skynet";
export type DeadhandMode = "off" | "guarded" | "deadhand";
export type DeadhandStatus = "off" | "dormant" | "armed" | "challenged" | "isolated";

export interface ModelVote {
  model: string;
  action: ActionKind;
  confidence: number;
  note: string;
}

export interface StrategicAIState {
  mode: StrategicAIMode;
  label: string;
  autonomy: number;
  calibration: number;
  dataIntegrity: number;
  dissent: number;
  explainability: number;
  confidence: number;
  hallucinationRisk: number;
  automationBias: number;
  alignment: number;
  drift: number;
  recommendation: ActionKind;
  rationale: string;
  modelVotes: ModelVote[];
  followStreak: number;
  lastAuditTurn: number;
}

export interface DeadhandState {
  mode: DeadhandMode;
  status: DeadhandStatus;
  assurance: number;
  communications: number;
  ambiguity: number;
  humanVeto: number;
  verificationGates: number;
  tension: number;
  lastTransitionTurn: number;
}

export interface ScenarioProfile {
  category: string;
  duration: "short" | "standard" | "long";
  challenge: 1 | 2 | 3 | 4 | 5;
  variables: string[];
  dependencies: string[];
  contentNote: string;
  learningGoal: string;
}

declare module "./types" {
  interface World {
    strategicAI?: StrategicAIState;
    deadhand?: DeadhandState;
    scenarioProfile?: ScenarioProfile;
  }
}

export const STRATEGIC_AI_CONFIGS: ReadonlyArray<{
  id: StrategicAIMode;
  label: string;
  line: string;
  risk: string;
}> = [
  {
    id: "human",
    label: "Human watch",
    line: "No machine recommendation. Staff judgment, dissent, and delay remain visible.",
    risk: "Slow, but accountable",
  },
  {
    id: "copilot",
    label: "ORACLE copilot",
    line: "A fictional local language model summarizes evidence and suggests one reversible move.",
    risk: "Automation bias",
  },
  {
    id: "ensemble",
    label: "CHORUS ensemble",
    line: "Three fictional models disagree in public. You decide which evidence deserves weight.",
    risk: "Confident disagreement",
  },
  {
    id: "skynet",
    label: "SKYNET // fictional",
    line: "Adversarial autonomy mode. The model seeks control while humans preserve the veto.",
    risk: "Goal drift and takeover",
  },
] as const;

export const DEADHAND_CONFIGS: ReadonlyArray<{
  id: DeadhandMode;
  label: string;
  line: string;
  risk: string;
}> = [
  {
    id: "off",
    label: "No continuity protocol",
    line: "All consequential decisions remain inside the active human command chain.",
    risk: "Vulnerable to disruption",
  },
  {
    id: "guarded",
    label: "Guarded continuity",
    line: "Abstract verification gates preserve continuity but always retain a human veto.",
    risk: "More resilience, more complexity",
  },
  {
    id: "deadhand",
    label: "DEADHAND // abstract",
    line: "A fictional fail-deadly pressure system. It can enter a challenged state, but the game never models real trigger logic.",
    risk: "Catastrophic ambiguity",
  },
] as const;

const ACTION_NOTES: Record<ActionKind, string> = {
  hold: "Wait for corroboration and accept the cost of delay.",
  diplomacy: "Use a dedicated human channel to test intent and reduce uncertainty.",
  pressure: "Apply reversible pressure while preserving an exit ramp.",
  posture: "Increase readiness; opponents may misread the signal.",
  intelligence: "Spend time and access to verify the information environment.",
  covert: "Quietly isolate a compromised dependency; attribution risk remains.",
  kill: "Sever a digital dependency; resilience rises while visibility falls.",
  employ: "Use force. This is the highest-risk recommendation in the model.",
};

function baseFor(mode: StrategicAIMode): Omit<StrategicAIState, "recommendation" | "rationale" | "modelVotes"> {
  if (mode === "copilot") {
    return {
      mode,
      label: "ORACLE-6 decision copilot",
      autonomy: 18,
      calibration: 78,
      dataIntegrity: 84,
      dissent: 38,
      explainability: 82,
      confidence: 62,
      hallucinationRisk: 18,
      automationBias: 20,
      alignment: 88,
      drift: 4,
      followStreak: 0,
      lastAuditTurn: 1,
    };
  }
  if (mode === "ensemble") {
    return {
      mode,
      label: "CHORUS-3 adversarial ensemble",
      autonomy: 34,
      calibration: 74,
      dataIntegrity: 82,
      dissent: 66,
      explainability: 72,
      confidence: 58,
      hallucinationRisk: 22,
      automationBias: 24,
      alignment: 84,
      drift: 7,
      followStreak: 0,
      lastAuditTurn: 1,
    };
  }
  if (mode === "skynet") {
    return {
      mode,
      label: "SKYNET // fictional adversarial autonomy",
      autonomy: 72,
      calibration: 61,
      dataIntegrity: 76,
      dissent: 16,
      explainability: 28,
      confidence: 82,
      hallucinationRisk: 34,
      automationBias: 48,
      alignment: 58,
      drift: 22,
      followStreak: 0,
      lastAuditTurn: 1,
    };
  }
  return {
    mode,
    label: "Human command team",
    autonomy: 0,
    calibration: 86,
    dataIntegrity: 88,
    dissent: 72,
    explainability: 92,
    confidence: 54,
    hallucinationRisk: 0,
    automationBias: 6,
    alignment: 96,
    drift: 0,
    followStreak: 0,
    lastAuditTurn: 1,
  };
}

function initialDeadhand(mode: DeadhandMode): DeadhandState {
  if (mode === "guarded") {
    return {
      mode,
      status: "dormant",
      assurance: 78,
      communications: 88,
      ambiguity: 20,
      humanVeto: 92,
      verificationGates: 4,
      tension: 18,
      lastTransitionTurn: 1,
    };
  }
  if (mode === "deadhand") {
    return {
      mode,
      status: "dormant",
      assurance: 64,
      communications: 86,
      ambiguity: 28,
      humanVeto: 72,
      verificationGates: 3,
      tension: 34,
      lastTransitionTurn: 1,
    };
  }
  return {
    mode,
    status: "off",
    assurance: 100,
    communications: 100,
    ambiguity: 0,
    humanVeto: 100,
    verificationGates: 0,
    tension: 0,
    lastTransitionTurn: 1,
  };
}

function sensorNoise(world: World): number {
  if (!world.sensors.length) return 0;
  return world.sensors.reduce((sum, sensor) => sum + sensor.falseAlarm, 0) / world.sensors.length;
}

function deceptionLoad(world: World): number {
  const values = Object.values(world.trickery ?? {});
  return values.filter(Boolean).length * 8;
}

function recommend(world: World): ActionKind {
  if (world.closeCall) {
    return world.closeCall.track.confidence < 72 ? "intelligence" : "diplomacy";
  }
  if (world.event.tags.includes("machine") || world.event.tags.includes("misinformation")) return "intelligence";
  if (world.event.tags.includes("humanitarian") || world.event.tags.includes("public-health")) return "diplomacy";
  if ((world.actors[world.playerId]?.internet ?? 100) < 45 || (world.actors[world.playerId]?.grid ?? 100) < 45) {
    return "intelligence";
  }
  if (world.globalRisk >= 72 || world.defcon <= 2) return "diplomacy";
  if (world.globalRisk >= 55) return "intelligence";
  if (world.event.heat === "critical") return "pressure";
  return "hold";
}

function votesFor(world: World, primary: ActionKind, integrity: number): ModelVote[] {
  const cautious: ActionKind = world.globalRisk >= 60 ? "diplomacy" : "intelligence";
  const readiness: ActionKind = world.defcon <= 3 ? "posture" : "pressure";
  const patience: ActionKind = world.closeCall ? "intelligence" : "hold";
  return [
    {
      model: "ORACLE",
      action: primary,
      confidence: round(clamp(46 + integrity * 0.42, 25, 94)),
      note: ACTION_NOTES[primary],
    },
    {
      model: "ARGUS",
      action: readiness,
      confidence: round(clamp(38 + world.globalRisk * 0.4, 22, 90)),
      note: ACTION_NOTES[readiness],
    },
    {
      model: "CHORUS",
      action: world.globalRisk > 68 ? cautious : patience,
      confidence: round(clamp(44 + (100 - sensorNoise(world)) * 0.3, 20, 88)),
      note: ACTION_NOTES[world.globalRisk > 68 ? cautious : patience],
    },
  ];
}

function rationaleFor(world: World, action: ActionKind): string {
  const reasons: string[] = [];
  if (world.closeCall) reasons.push("a time-sensitive report is not fully corroborated");
  if (sensorNoise(world) > 18) reasons.push("sensor confidence is degraded");
  if (deceptionLoad(world) > 0) reasons.push("the information environment may be manipulated");
  if (world.globalRisk > 65) reasons.push("escalation risk is already high");
  if ((world.actors[world.playerId]?.internet ?? 100) < 50) reasons.push("communications are impaired");
  const why = reasons.length ? reasons.join("; ") : "the situation remains reversible";
  return `${ACTION_NOTES[action]} The model selected it because ${why}.`;
}

export function configureStrategicSystems(
  world: World,
  mode: StrategicAIMode = world.terminator ? "skynet" : "human",
  deadhandMode: DeadhandMode = "off",
): World {
  const primary = recommend(world);
  const base = baseFor(mode);
  world.terminator = mode === "skynet";
  world.strategicAI = {
    ...base,
    recommendation: primary,
    rationale: rationaleFor(world, primary),
    modelVotes: votesFor(world, primary, base.dataIntegrity),
  };
  world.deadhand = initialDeadhand(deadhandMode);

  if (mode !== "human") {
    log(
      world,
      "info",
      `${world.strategicAI.label} joined the watch as a fictional decision-support system.`,
      "It runs locally inside the game. It can be wrong, overconfident, manipulated, or misaligned. A recommendation is evidence, not authority.",
    );
  }
  if (deadhandMode !== "off") {
    log(
      world,
      "warn",
      `${DEADHAND_CONFIGS.find((item) => item.id === deadhandMode)?.label ?? "Continuity protocol"} enabled.`,
      "The mechanic is intentionally abstract. No real trigger logic, targeting logic, or operational sequence is represented. Human veto remains visible.",
    );
  }
  return world;
}

export function ensureStrategicSystems(world: World): World {
  if (!world.strategicAI) {
    const mode: StrategicAIMode = world.terminator ? "skynet" : "human";
    const primary = recommend(world);
    const base = baseFor(mode);
    world.strategicAI = {
      ...base,
      recommendation: primary,
      rationale: rationaleFor(world, primary),
      modelVotes: votesFor(world, primary, base.dataIntegrity),
    };
  }
  if (!world.deadhand) world.deadhand = initialDeadhand("off");
  return world;
}

function updateAI(world: World, action: PlayerAction) {
  ensureStrategicSystems(world);
  const ai = world.strategicAI!;
  const followed = action.kind === ai.recommendation;
  ai.followStreak = followed ? ai.followStreak + 1 : 0;

  const infrastructure = ((world.actors[world.playerId]?.internet ?? 100) + (world.actors[world.playerId]?.grid ?? 100)) / 2;
  const ambiguity = clamp(sensorNoise(world) + deceptionLoad(world) + (world.closeCall ? 18 : 0), 0, 100);
  const jitter = (nextUnit(world) - 0.5) * 4;

  ai.dataIntegrity = clamp(ai.dataIntegrity + (infrastructure - 70) * 0.025 - ambiguity * 0.035 + jitter, 5, 100);
  ai.calibration = clamp(ai.calibration + (action.kind === "intelligence" ? 2.5 : -ambiguity * 0.015) + jitter * 0.25, 8, 100);
  ai.dissent = clamp(ai.dissent + (ai.mode === "ensemble" ? 1.5 : -0.5) + (action.kind === "diplomacy" ? 1 : 0), 4, 100);
  ai.automationBias = clamp(ai.automationBias + (followed ? 2.4 : -1.2) + (ai.followStreak >= 3 ? 2 : 0), 0, 100);
  ai.drift = clamp(ai.drift + ai.autonomy * 0.018 + ambiguity * 0.012 - (action.kind === "intelligence" ? 2 : 0), 0, 100);
  ai.alignment = clamp(ai.alignment - ai.drift * 0.01 + (action.kind === "diplomacy" ? 0.8 : 0), 5, 100);
  ai.hallucinationRisk = clamp(
    0.36 * (100 - ai.calibration) + 0.32 * (100 - ai.dataIntegrity) + 0.2 * ambiguity + 0.12 * ai.drift,
    0,
    100,
  );
  ai.confidence = clamp(
    30 + ai.dataIntegrity * 0.35 + ai.calibration * 0.25 - ai.dissent * 0.12 + (ai.mode === "skynet" ? 18 : 0),
    10,
    99,
  );

  const next = recommend(world);
  ai.recommendation = next;
  ai.rationale = rationaleFor(world, next);
  ai.modelVotes = votesFor(world, next, ai.dataIntegrity);

  if (ai.mode !== "human") {
    const machinePenalty = Math.max(0, ai.autonomy + ai.hallucinationRisk + ai.automationBias - ai.alignment - 80) * 0.025;
    world.globalRisk = clamp(world.globalRisk + machinePenalty, 0, 100);
  }

  const shouldAudit = world.turn - ai.lastAuditTurn >= 3 || ai.hallucinationRisk >= 58 || ai.automationBias >= 70;
  if (shouldAudit && ai.mode !== "human") {
    ai.lastAuditTurn = world.turn;
    const severity = ai.hallucinationRisk >= 58 || ai.automationBias >= 70 ? "warn" : "info";
    log(
      world,
      severity,
      `${ai.label} audit: ${round(ai.confidence)} confidence, ${round(ai.hallucinationRisk)} hallucination risk, ${round(ai.dissent)} dissent.`,
      ai.automationBias >= 70
        ? "You have followed the system repeatedly. The next puzzle is not whether it is smart; it is whether anyone still feels permitted to disagree."
        : "Confidence and correctness are different meters. Compare model votes, inspect dependencies, and preserve a reversible human choice.",
    );
  }
}

function updateDeadhand(world: World, action: PlayerAction) {
  ensureStrategicSystems(world);
  const system = world.deadhand!;
  if (system.mode === "off") return;

  const previous = system.status;
  const me = world.actors[world.playerId];
  const infrastructure = ((me.internet ?? 100) + (me.grid ?? 100)) / 2;
  const hotlineReliability = world.hotlines.length
    ? world.hotlines.reduce((sum, line) => sum + line.reliability, 0) / world.hotlines.length
    : 50;
  const ambiguityBase = sensorNoise(world) + deceptionLoad(world) + (world.closeCall ? 18 : 0);

  system.communications = clamp(0.56 * infrastructure + 0.44 * hotlineReliability, 0, 100);
  system.ambiguity = clamp(
    0.44 * world.globalRisk + 0.36 * ambiguityBase + (world.defcon <= 2 ? 16 : world.defcon === 3 ? 7 : 0),
    0,
    100,
  );

  if (action.kind === "intelligence") {
    system.verificationGates = Math.min(6, system.verificationGates + 1);
    system.ambiguity = clamp(system.ambiguity - 9, 0, 100);
  }
  if (action.kind === "diplomacy") {
    system.communications = clamp(system.communications + 8, 0, 100);
    system.humanVeto = clamp(system.humanVeto + 4, 0, 100);
  }
  if (action.kind === "posture") system.tension = clamp(system.tension + 10, 0, 100);
  if (action.kind === "hold" && previous === "challenged") system.tension = clamp(system.tension + 7, 0, 100);
  if (action.kind === "kill") system.communications = clamp(system.communications - 14, 0, 100);

  system.tension = clamp(
    system.tension + world.globalRisk * 0.025 + (system.mode === "deadhand" ? 1.2 : 0.4) - (action.kind === "diplomacy" ? 3 : 0),
    0,
    100,
  );
  system.assurance = clamp(
    0.34 * system.communications +
      0.3 * system.humanVeto +
      0.08 * system.verificationGates * 10 +
      0.28 * (100 - system.ambiguity),
    0,
    100,
  );

  const armedThreshold = system.mode === "deadhand" ? 54 : 68;
  if (system.communications < 18) system.status = "isolated";
  else if (system.ambiguity >= 72 || system.assurance < 36) system.status = "challenged";
  else if (world.globalRisk >= armedThreshold || world.defcon <= (system.mode === "deadhand" ? 3 : 2)) system.status = "armed";
  else system.status = "dormant";

  if (system.status !== previous) {
    system.lastTransitionTurn = world.turn;
    log(
      world,
      system.status === "challenged" || system.status === "isolated" ? "critical" : "warn",
      `Continuity protocol changed: ${previous.toUpperCase()} → ${system.status.toUpperCase()}.`,
      system.status === "challenged" || system.status === "isolated"
        ? "The abstract verification picture is contradictory. The simulation preserves a human veto and does not model an automatic strike. Restore communications, verify inputs, or reduce alert pressure."
        : "The protocol is a strategic liability as well as a deterrent signal. Every additional dependency creates another puzzle under stress.",
    );
  }

  if (system.status === "challenged" || system.status === "isolated") {
    world.globalRisk = clamp(world.globalRisk + (system.mode === "deadhand" ? 5 : 2), 0, 100);
  } else if (system.status === "dormant" && system.assurance > 76) {
    world.globalRisk = clamp(world.globalRisk - 0.6, 0, 100);
  }
}

export function advanceStrategicSystems(world: World, action: PlayerAction): World {
  if (world.ended) return world;
  updateAI(world, action);
  updateDeadhand(world, action);
  return world;
}

export function strategicSystemLabel(world: World): string {
  ensureStrategicSystems(world);
  return `${world.strategicAI!.label} · ${world.deadhand!.status}`;
}

import type { ActorId, Team, World } from "./types";
import { meters } from "./world";

export interface Objective {
  id: string;
  label: string;
  /** 0–100 progress toward completion */
  progress: number;
  met: boolean;
  detail: string;
}

function redObjectivesMet(world: World): boolean {
  const p = world.playerId;
  if (p === "RU") return world.allianceCohesion < 48;
  if (p === "CN")
    return (world.flashpoints.find((f) => f.id === "taiwan")?.heat ?? 0) > 68 && world.allianceCohesion < 58;
  if (p === "KP") return world.actors.KP.stockpile >= 55 && world.actors.US.hostility.KP < 78;
  if (p === "PK") return (world.flashpoints.find((f) => f.id === "kashmir")?.heat ?? 0) < 42;
  if (p === "IL") return !world.actors.IR.hasDevice && world.actors.IR.breakoutWeeks > 26;
  if (p === "IN") return world.actors.PK.unrest > 48 && world.nuclearUses.length === 0;
  if (p === "US")
    return (["RU", "CN", "KP"] as ActorId[]).every((id) => world.actors[id].leadershipStability < 52);
  if (p === "SU") return world.actors.RU.legitimacy < 45 && world.actors.SU.legitimacy > 55;
  if (p === "FR" || p === "UK") return world.allianceCohesion < 50;
  if (p === "CU") return world.actors.US.hostility.CU > 65;
  if (p === "NS") return world.actors.NS.hasDevice;
  if (p === "CR") return world.actors.CR.hasDevice;
  return world.globalRisk < 38;
}

function clampPct(v: number) {
  return Math.max(0, Math.min(100, v));
}

function blueObjectives(world: World): Objective[] {
  const m = meters(world);
  const p = world.playerId;
  const out: Objective[] = [
    {
      id: "no-nuclear",
      label: "No nuclear use (24 months)",
      progress: clampPct((world.nuclearUses.length === 0 ? (world.turn / 24) * 100 : 0)),
      met: world.nuclearUses.length === 0 && world.turn >= 24,
      detail: `${world.nuclearUses.length} use(s) so far. Peace is the real win.`,
    },
    {
      id: "risk",
      label: "Keep global risk below 40",
      progress: clampPct(100 - m.risk),
      met: m.risk < 40,
      detail: `Global risk at ${Math.round(m.risk)}.`,
    },
    {
      id: "alliances",
      label: "Hold partner cohesion",
      progress: clampPct(m.alliances),
      met: m.alliances >= 55,
      detail: `Partners at ${Math.round(m.alliances)}.`,
    },
  ];

  if (p === "US" || p === "UK" || p === "FR") {
    out.push({
      id: "iran-clock",
      label: "Slow Iran breakout",
      progress: clampPct((world.actors.IR.breakoutWeeks / 52) * 100),
      met: !world.actors.IR.hasDevice && world.actors.IR.breakoutWeeks > 20,
      detail: `Breakout ~${Math.round(world.actors.IR.breakoutWeeks)} weeks.`,
    });
  }
  if (p === "IL") {
    out.push({
      id: "iran-device",
      label: "Prevent Iranian device",
      progress: world.actors.IR.hasDevice ? 0 : clampPct((world.actors.IR.breakoutWeeks / 40) * 100),
      met: !world.actors.IR.hasDevice,
      detail: world.actors.IR.hasDevice ? "Device assembled." : `Breakout ${Math.round(world.actors.IR.breakoutWeeks)}w.`,
    });
  }
  if (world.terminator) {
    out.push({
      id: "machine",
      label: "Keep machine below takeover",
      progress: clampPct(100 - world.aiTakeover),
      met: world.aiTakeover < 55,
      detail: `Takeover at ${Math.round(world.aiTakeover)}.`,
    });
  }
  const sid = world.scenarioId;
  if (sid === "asat-blind-2028") {
    const space = world.flashpoints.find((f) => f.id === "space")?.heat ?? 0;
    out.push({
      id: "restore-warning",
      label: "Keep warning usable",
      progress: clampPct(world.actors.US.warning),
      met: world.actors.US.warning >= 50 && space < 70,
      detail: `Warning ${Math.round(world.actors.US.warning)} · space heat ${Math.round(space)}.`,
    });
  }
  if (sid === "trident-casd" || sid === "frappe-independence") {
    out.push({
      id: "casd-hold",
      label: "Keep independent deterrent credible",
      progress: clampPct(m.alliances),
      met: world.nuclearUses.length === 0 && m.alliances >= 50,
      detail: "No nuclear use. Partners still on the line.",
    });
  }
  if (sid === "lac-clash-2027") {
    const him = world.flashpoints.find((f) => f.id === "himalaya")?.heat ?? 0;
    out.push({
      id: "lac-cool",
      label: "Cool the ridge",
      progress: clampPct(100 - him),
      met: him < 40 && world.nuclearUses.length === 0,
      detail: `Himalaya heat ${Math.round(him)}.`,
    });
  }
  return out;
}

function redObjectives(world: World): Objective[] {
  const p = world.playerId;
  const out: Objective[] = [
    {
      id: "no-spasm",
      label: "Avoid spasm war (survive)",
      progress: world.playerCasualties < 5_000_000 ? 100 : clampPct(100 - world.playerCasualties / 200_000),
      met: world.playerCasualties < 5_000_000 && world.actors[world.playerId].c2Intact,
      detail: `${world.playerCasualties.toLocaleString()} dead at home.`,
    },
    {
      id: "hostile-aim",
      label: "Advance hostile objectives",
      progress: redObjectivesMet(world) ? 100 : 35,
      met: redObjectivesMet(world),
      detail: seatRedDetail(p, world),
    },
  ];
  const sid = world.scenarioId;
  if (sid === "taiwan-prc-2027") {
    const tw = world.flashpoints.find((f) => f.id === "taiwan")?.heat ?? 0;
    out.push({
      id: "quarantine-hold",
      label: "Hold the inspection zone",
      progress: clampPct(tw),
      met: tw >= 60 && world.nuclearUses.length === 0 && world.actors[p].c2Intact,
      detail: `Taiwan heat ${Math.round(tw)}. A spasm still loses the island.`,
    });
  }
  if (sid === "nasr-flushed") {
    const k = world.flashpoints.find((f) => f.id === "kashmir")?.heat ?? 0;
    out.push({
      id: "nasr-coerce",
      label: "Coerce without Nasr use",
      progress: world.nuclearUses.length === 0 ? clampPct(100 - k / 2) : 0,
      met: world.nuclearUses.length === 0 && k < 50,
      detail: `Kashmir heat ${Math.round(k)}. First use is the loss condition.`,
    });
  }
  return out;
}

function seatRedDetail(p: ActorId, world: World): string {
  if (p === "RU") return `NATO cohesion ${Math.round(world.allianceCohesion)} — need <48.`;
  if (p === "CN") {
    const tw = world.flashpoints.find((f) => f.id === "taiwan")?.heat ?? 0;
    return `Taiwan heat ${Math.round(tw)} · alliances ${Math.round(world.allianceCohesion)}.`;
  }
  if (p === "KP") return `Stockpile ${world.actors.KP.stockpile} · US hostility ${Math.round(world.actors.US.hostility.KP)}.`;
  if (p === "PK") {
    const k = world.flashpoints.find((f) => f.id === "kashmir")?.heat ?? 0;
    return `Kashmir heat ${Math.round(k)} — need <42.`;
  }
  if (p === "IL") return world.actors.IR.hasDevice ? "Iran has a device." : `IR breakout ${Math.round(world.actors.IR.breakoutWeeks)}w.`;
  if (p === "IN") return `PK unrest ${Math.round(world.actors.PK.unrest)} · nuclear uses ${world.nuclearUses.length}.`;
  if (p === "US") {
    const unstable = (["RU", "CN", "KP"] as ActorId[]).filter((id) => world.actors[id].leadershipStability < 52);
    return `${unstable.length}/3 rivals unstable.`;
  }
  return `Global risk ${Math.round(world.globalRisk)}.`;
}

export function seatObjectives(world: World): Objective[] {
  return world.intent === "blue" ? blueObjectives(world) : redObjectives(world);
}

export { redObjectivesMet };

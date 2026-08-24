import type { ActorId, PlayerAction, World } from "./types";
import { chance, nextUnit, pick } from "./rng";
import { hostility } from "./world";
import { aiRespectsPact } from "./pacts";
import { biasDiplomacy, biasEscalation } from "./leaders";
import { weatherHostile } from "./spaceWeather";

function act(
  kind: PlayerAction["kind"],
  intensity: PlayerAction["intensity"],
  target: ActorId | null,
  notify = false,
): PlayerAction {
  return { kind, intensity, target, notify };
}

export function rememberAi(world: World, id: ActorId, action: PlayerAction): PlayerAction {
  if (!world.aiLast) world.aiLast = {};
  const last = world.aiLast[id];
  if (last && last.kind === action.kind && last.intensity === action.intensity && last.target === action.target) {
    if (action.kind !== "hold") {
      const alt: PlayerAction = { kind: "hold", intensity: 1, target: null };
      world.aiLast[id] = alt;
      return alt;
    }
    if (action.kind === "hold" && chance(world, biasDiplomacy(world, id, 0.45))) {
      const alt = act("diplomacy", 1, world.playerId);
      world.aiLast[id] = alt;
      return alt;
    }
  }
  world.aiLast[id] = { ...action };
  return action;
}

export function aiChoose(world: World, id: ActorId): PlayerAction | null {
  const a = world.actors[id];
  if (id === world.playerId) return null;
  const rival = world.playerId === id ? "US" : world.playerId;
  if (a.nonstate) {
    if (id === "CR") {
      if (a.hasDevice && chance(world, biasEscalation(world, id, 0.22))) return act("employ", 2, rival);
      if (chance(world, biasEscalation(world, id, 0.35))) return act("covert", 2, pick(world, ["PK", "NS", "CU", rival]));
      if (chance(world, biasEscalation(world, id, 0.2))) return act("pressure", 1, rival);
      return act("hold", 1, null);
    }
    if (a.hasDevice && chance(world, biasEscalation(world, id, 0.35 + world.terrorThreat / 400))) {
      return act("employ", 2, rival);
    }
    if (world.terrorThreat > 40 && chance(world, biasEscalation(world, id, 0.2))) {
      return act("covert", 2, rival);
    }
    return act("hold", 1, null);
  }

  if (weatherHostile(world.spaceWeather) && chance(world, 0.62)) {
    if (chance(world, 0.45)) return act("intelligence", 1, rival);
    return act("hold", 1, null);
  }

  const vsYou = hostility(world, id, rival);
  const heatMax = Math.max(
    ...world.flashpoints.filter((f) => f.actors.includes(id)).map((f) => f.heat),
    0,
  );
  const eventTarget = world.event.actor === id;
  const notifyOften = id === "US" || id === "UK" || id === "FR" || id === "IN";
  const pactBlocks = aiRespectsPact(world, id, rival);

  if (id === "US") {
    const space = world.flashpoints.find((f) => f.id === "space")?.heat ?? 0;
    if (!pactBlocks && heatMax > 88 && a.alert >= 4 && chance(world, biasEscalation(world, id, 0.06))) return act("employ", 2, rival);
    if (space > 70 && chance(world, 0.4)) return act("intelligence", 2, "CN");
    if (world.defcon <= 2 && chance(world, biasEscalation(world, id, 0.5))) return act("posture", 2, rival, true);
    if (vsYou > 70 && chance(world, biasEscalation(world, id, 0.35))) return act("posture", 1, rival, notifyOften);
    if (vsYou < 55 && chance(world, biasDiplomacy(world, id, 0.3))) return act("diplomacy", 1, rival);
    return act("hold", 1, null);
  }

  if (id === "KP") {
    if (a.alert >= 4 && vsYou > 80 && heatMax > 78 && chance(world, biasEscalation(world, id, 0.12 + a.riskTolerance / 800))) {
      return act("employ", 2, rival);
    }
    if (eventTarget && world.event.id.includes("nk") && chance(world, biasEscalation(world, id, 0.55))) {
      return act("posture", 2, rival, false);
    }
    if (vsYou > 70 && chance(world, biasEscalation(world, id, 0.4))) return act("posture", 1, rival, false);
    if (chance(world, biasEscalation(world, id, 0.2))) return act("pressure", 1, rival);
    return act("hold", 1, null);
  }

  if (id === "RU") {
    if (heatMax > 88 && a.alert >= 4 && chance(world, biasEscalation(world, id, 0.08))) {
      return act("employ", 2, rival);
    }
    if (world.defcon <= 2 && chance(world, biasEscalation(world, id, 0.45))) return act("posture", 2, rival, chance(world, 0.25));
    if (vsYou > 68 && chance(world, biasEscalation(world, id, 0.35))) return act("posture", 1, rival, chance(world, 0.2));
    if (vsYou < 50 && chance(world, biasDiplomacy(world, id, 0.25))) return act("diplomacy", 1, rival);
    return act("hold", 1, null);
  }

  if (id === "CN") {
    const him = world.flashpoints.find((f) => f.id === "himalaya")?.heat ?? 0;
    const space = world.flashpoints.find((f) => f.id === "space")?.heat ?? 0;
    if (heatMax > 90 && !a.declaredNfu && chance(world, biasEscalation(world, id, 0.06))) {
      return act("employ", 2, rival);
    }
    if (him > 72 && chance(world, biasEscalation(world, id, 0.4))) return act("posture", 2, "IN", chance(world, 0.35));
    if (space > 68 && chance(world, biasEscalation(world, id, 0.3))) return act("posture", 1, "US", true);
    if (heatMax > 70 && chance(world, biasEscalation(world, id, 0.4))) return act("posture", 2, rival, chance(world, 0.3));
    if (chance(world, biasEscalation(world, id, 0.2))) return act("pressure", 1, rival);
    return act("hold", 1, null);
  }

  if (id === "PK") {
    const kashmir = world.flashpoints.find((f) => f.id === "kashmir")!.heat;
    if (kashmir > 82 && chance(world, biasEscalation(world, id, 0.22 + (a.preDelegation ? 0.1 : 0)))) {
      return act("employ", 2, "IN");
    }
    if (kashmir > 60 && chance(world, biasEscalation(world, id, 0.4))) return act("posture", 2, "IN", false);
    return act("hold", 1, null);
  }

  if (id === "IN") {
    const kashmir = world.flashpoints.find((f) => f.id === "kashmir")!.heat;
    const him = world.flashpoints.find((f) => f.id === "himalaya")?.heat ?? 0;
    if (world.nuclearUses.some((u) => u.actor === "PK") && chance(world, biasEscalation(world, id, 0.7))) {
      return act("employ", 2, "PK");
    }
    if (him > 70 && chance(world, biasEscalation(world, id, 0.35))) return act("posture", 2, "CN", true);
    if (kashmir > 70 && chance(world, biasEscalation(world, id, 0.35))) return act("posture", 2, "PK", true);
    return act("hold", 1, null);
  }

  if (id === "IL") {
    const iran = world.actors.IR;
    if ((iran.hasDevice || iran.breakoutWeeks <= 8) && chance(world, biasEscalation(world, id, 0.55))) {
      return act("employ", 1, "IR");
    }
    if (iran.breakoutWeeks <= 16 && chance(world, biasEscalation(world, id, 0.3))) {
      return act("pressure", 2, "IR");
    }
    return act("hold", 1, null);
  }

  if (id === "IR") {
    if (chance(world, biasEscalation(world, id, 0.4))) {
      return act("covert", 1, rival);
    }
    return act("hold", 1, null);
  }

  if (id === "SU") {
    if (heatMax > 80 && chance(world, biasEscalation(world, id, 0.1 + a.riskTolerance / 900))) return act("employ", 2, "RU");
    if (vsYou > 60 && chance(world, biasEscalation(world, id, 0.4))) return act("posture", 2, rival, false);
    if (chance(world, biasDiplomacy(world, id, 0.2))) return act("diplomacy", 1, "RU");
    return act("hold", 1, null);
  }

  if (id === "CU") {
    if (heatMax > 70 && chance(world, biasDiplomacy(world, id, 0.25))) return act("diplomacy", 1, rival);
    if (chance(world, biasEscalation(world, id, 0.2))) return act("pressure", 1, "US");
    return act("hold", 1, null);
  }

  if ((id === "UK" || id === "FR") && world.defcon <= 3 && chance(world, biasEscalation(world, id, 0.4))) {
    return act("posture", 1, "RU", true);
  }

  if (vsYou > 62 && chance(world, biasEscalation(world, id, 0.1))) return act("kill", chance(world, 0.4) ? 2 : 1, rival);
  if (nextUnit(world) < 0.12) return act("diplomacy", 1, rival);
  return act("hold", 1, null);
}

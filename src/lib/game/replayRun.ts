import type { ActorId, Team, World } from "./types";
import { createWorld } from "./world";
import { applyScenario, type ScenarioId } from "./scenarios";
import { resolveTurn } from "./sim";
import { decodeReplay, type ReplayRecord } from "./replay";

const SCENARIO_IDS: ScenarioId[] = [
  "petrov-1983",
  "able-archer",
  "taiwan-2027",
  "broken-arrow",
  "kashmir-2027",
  "cuba-1962",
];

function asScenario(id: string | null): ScenarioId | null {
  if (!id) return null;
  return SCENARIO_IDS.includes(id as ScenarioId) ? (id as ScenarioId) : null;
}

export function replayFromRecord(rec: ReplayRecord): World {
  const player = rec.playerId as ActorId;
  const intent = (rec.intent === "red" ? "red" : "blue") as Team;
  let world = createWorld("standard", rec.seed, player, intent);
  const sid = asScenario(rec.scenarioId);
  if (sid) world = applyScenario(world, sid);
  for (const action of rec.actions) {
    if (world.ended) break;
    world = resolveTurn(world, action);
  }
  return world;
}

export function replayFromCode(code: string): { world: World; record: ReplayRecord } | null {
  const record = decodeReplay(code.trim());
  if (!record || typeof record.seed !== "number" || !Array.isArray(record.actions)) return null;
  return { world: replayFromRecord(record), record };
}

import type { PlayerAction, World } from "./types";

const KEY = "threshold.replay.v1";

export interface ReplayRecord {
  seed: number;
  playerId: string;
  intent: string;
  scenarioId: string | null;
  actions: PlayerAction[];
}

let current: ReplayRecord | null = null;

export function recordTurn(world: World, action: PlayerAction) {
  if (!world.actionHistory) world.actionHistory = [];
  world.actionHistory.push(structuredClone(action));
  if (!current || current.seed !== world.seed) {
    current = {
      seed: world.seed,
      playerId: world.playerId,
      intent: world.intent,
      scenarioId: world.scenarioId ?? null,
      actions: [],
    };
  }
  current.actions.push(structuredClone(action));
}

export function encodeReplay(world: World): string {
  const rec: ReplayRecord =
    current?.seed === world.seed
      ? current
      : {
          seed: world.seed,
          playerId: world.playerId,
          intent: world.intent,
          scenarioId: world.scenarioId ?? null,
          actions: world.actionHistory ?? [],
        };
  const json = JSON.stringify(rec);
  if (typeof btoa !== "undefined") return btoa(json);
  return Buffer.from(json).toString("base64");
}

export function decodeReplay(code: string): ReplayRecord | null {
  try {
    const json = typeof atob !== "undefined" ? atob(code) : Buffer.from(code, "base64").toString("utf8");
    return JSON.parse(json) as ReplayRecord;
  } catch {
    return null;
  }
}

export function saveReplaySnapshot(world: World) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, encodeReplay(world));
}

export function loadLastReplayCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

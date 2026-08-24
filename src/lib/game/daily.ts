import { SCENARIOS, type ScenarioId } from "./scenarios";
import type { World } from "./types";
import { letterGrade } from "./stats";

/**
 * The Daily Watch.
 *
 * One scenario and one seed per calendar day, the same for everyone, with a
 * result you can paste anywhere. The engine has been fully deterministic since
 * replay codes shipped, so this costs almost nothing to build on top of it:
 * given a date, everything else follows.
 *
 * Everything here is pure. The seed and the scenario come from an FNV-1a hash
 * of the date key -- the same trick `leaders.ts` uses for adversary
 * temperaments -- so no RNG is drawn, nothing is stored, and two players on
 * opposite sides of the world computing today's watch get the same answer
 * without ever talking to a server.
 *
 * The date is read once when a run starts, which is outside `resolveTurn`. The
 * determinism contract is about the turn pipeline and is untouched.
 */

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * The day's key, `YYYY-MM-DD` in UTC.
 *
 * UTC rather than local time so that everybody is playing the same watch at the
 * same moment, and so a player who travels does not get two Tuesdays.
 */
export function dailyKey(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** The seed for a given day. Stable, and never zero. */
export function dailySeed(key: string): number {
  return (hash(`threshold.daily:${key}`) % 2_000_000_000) + 1;
}

/**
 * The scenario for a given day.
 *
 * A second, differently salted hash, so the seed and the scenario are not
 * correlated -- otherwise every day with a nearby seed would tend to draw a
 * neighbouring scenario, and the rotation would visibly clump.
 */
export function dailyScenario(key: string): ScenarioId {
  return SCENARIOS[hash(`threshold.daily.scenario:${key}`) % SCENARIOS.length].id;
}

export interface DailyWatch {
  key: string;
  seed: number;
  scenarioId: ScenarioId;
  title: string;
}

export function dailyWatch(now: Date = new Date()): DailyWatch {
  const key = dailyKey(now);
  const scenarioId = dailyScenario(key);
  return {
    key,
    seed: dailySeed(key),
    scenarioId,
    title: SCENARIOS.find((s) => s.id === scenarioId)?.title ?? scenarioId,
  };
}

const BARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇"] as const;

/**
 * DEFCON over the run, as a spark line.
 *
 * Inverted deliberately: DEFCON 1 is the worst state and has to be the tallest
 * bar, or the picture reads backwards to anyone who knows what the numbers
 * mean. Sampled to at most twelve marks so a fifty-turn run still fits on one
 * line.
 */
export function defconSpark(history: number[]): string {
  if (!history.length) return "";
  const step = Math.max(1, Math.ceil(history.length / 12));
  const out: string[] = [];
  for (let i = 0; i < history.length; i += step) {
    const defcon = Math.min(5, Math.max(1, Math.round(history[i])));
    out.push(BARS[Math.min(BARS.length - 1, (5 - defcon) + 1)]);
  }
  return out.join("");
}

/**
 * The shareable result.
 *
 * Deliberately spoiler-free: the scenario name, how it went for you, and
 * nothing about how the real incident ended. Somebody who has not played today
 * should be able to read this and still want to.
 */
export function shareText(world: World, streak: number, spark: string): string {
  const grade = world.ending
    ? letterGrade(world.ending.score, world.intent, world.firstUse, world.playerId)
    : "—";
  const uses = world.nuclearUses.length;
  const title = SCENARIOS.find((s) => s.id === world.scenarioId)?.title ?? "Sandbox";
  const lines = [
    `THRESHOLD · Daily Watch ${world.dailyKey ?? dailyKey()}`,
    `${title} · grade ${grade} · ${world.turn} turns`,
    uses === 0 ? "No weapon used" : `${uses} nuclear ${uses === 1 ? "use" : "uses"}`,
  ];
  if (spark) lines[2] = `${lines[2]} · DEFCON ${spark}`;
  if (streak > 1) lines.push(`Streak ${streak}`);
  return lines.join("\n");
}

declare module "./types" {
  interface World {
    /** Set when this run is a Daily Watch. The date key it was drawn for. */
    dailyKey?: string;
    /** DEFCON at the end of each turn, for the share block's spark line. */
    defconHistory?: number[];
  }
}

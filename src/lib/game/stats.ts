import type { EndingKind, World } from "./types";
import type { ScenarioId } from "./scenarios";
import { saveReplaySnapshot } from "./replay";

const KEY = "threshold.stats.v1";

export interface CareerStats {
  games: number;
  wins: number;
  bestScore: Record<string, number>;
  endings: Partial<Record<EndingKind, number>>;
  achievements: string[];
  scenarioBest: Partial<Record<string, number>>;
}

export interface AchievementDef {
  id: string;
  title: string;
  detail: string;
  check: (world: World) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  { id: "below-line", title: "Below the Line", detail: "Peace win with risk under 40.", check: (w) => w.ending?.kind === "peace" && w.globalRisk < 40 },
  { id: "petrov", title: "Petrov Moment", detail: "Survive a close-call without nuclear use.", check: (w) => w.nuclearUses.length === 0 && w.usedEventIds.includes("close-call") },
  { id: "no-first-use", title: "Never First", detail: "Finish without being first use.", check: (w) => w.firstUse !== w.playerId && !w.ended ? false : w.firstUse !== w.playerId },
  { id: "red-win", title: "Coercion Works", detail: "Red-team objectives advanced.", check: (w) => w.ending?.kind === "red-win" },
  { id: "war-survive", title: "State Stands", detail: "Survive nuclear war with C2 intact.", check: (w) => w.ending?.kind === "war-win" },
  { id: "machine-stop", title: "Air-Gapped", detail: "Terminator mode: peace with takeover under 55.", check: (w) => w.terminator && w.ending?.kind === "peace" && w.aiTakeover < 55 },
  { id: "diplomat", title: "On the Line", detail: "24 months, zero nuclear use, alliances above 60.", check: (w) => w.ending?.kind === "peace" && w.allianceCohesion >= 60 },
  { id: "winter-avoid", title: "No Winter", detail: "End with winter index under 15.", check: (w) => w.ended && w.nuclearWinter < 15 },
  { id: "coup-avoid", title: "Command Held", detail: "Finish without coup ending.", check: (w) => w.ended && w.ending?.kind !== "coup" },
  { id: "terror-stop", title: "No Return Address", detail: "Prevent terror nuclear use against you.", check: (w) => w.ended && w.ending?.kind !== "terror" },
  { id: "extreme-peace", title: "Extreme Watch", detail: "Peace on extreme difficulty.", check: (w) => w.ending?.kind === "peace" && w.difficulty === "extreme" },
  { id: "hold-steady", title: "Steady Hand", detail: "Second officer professional at end.", check: (w) => w.ended && w.secondOfficer.stance === "professional" },
  { id: "all-seats", title: "Rotating Watch", detail: "Play five different seats (tracked over career).", check: () => false },
  { id: "high-score", title: "High Score", detail: "Score above 900.", check: (w) => (w.ending?.score ?? 0) >= 900 },
  { id: "pyrrhic", title: "Pyrrhic Victory", detail: "Pyrrhic ending.", check: (w) => w.ending?.kind === "pyrrhic" },
  { id: "unforced-lesson", title: "Archive Entry", detail: "Unforced first use ending.", check: (w) => w.ending?.kind === "unforced" },
  { id: "stalemate-red", title: "Red Stalemate", detail: "Red intent stalemate.", check: (w) => w.ending?.kind === "stalemate" },
  { id: "machine-loss", title: "Judgment Day", detail: "Machine started the war.", check: (w) => w.ending?.kind === "machine" },
  { id: "two-year", title: "Two Years", detail: "Reach 24-month peace evaluation.", check: (w) => w.ended && ["peace", "red-win", "stalemate"].includes(w.ending?.kind ?? "") },
  { id: "broken-recover", title: "Empty Quiver Averted", detail: "Recover a broken arrow.", check: (w) => w.brokenArrow?.recovered === true || w.log.some((l) => l.text.toLowerCase().includes("recovered")) },
  { id: "asat-held", title: "Eyes Still Open", detail: "Finish the ASAT watch without nuclear use.", check: (w) => w.scenarioId === "asat-blind-2028" && w.ended && w.nuclearUses.length === 0 },
  { id: "casd-faith", title: "Boat Came Home", detail: "UK CASD watch, no nuclear use.", check: (w) => w.scenarioId === "trident-casd" && w.ended && w.nuclearUses.length === 0 },
  { id: "third-center", title: "Third Center", detail: "French independence watch, no first use.", check: (w) => w.scenarioId === "frappe-independence" && w.ended && w.firstUse !== w.playerId },
  { id: "ridge-held", title: "Ridge Held", detail: "LAC clash ends without nuclear use.", check: (w) => w.scenarioId === "lac-clash-2027" && w.ended && w.nuclearUses.length === 0 },
  { id: "quarantine-no-spasm", title: "Inspection, Not War", detail: "PRC Taiwan watch without spasm.", check: (w) => w.scenarioId === "taiwan-prc-2027" && w.ended && w.ending?.kind !== "pyrrhic" && w.playerCasualties < 1_000_000 },
  { id: "nasr-holstered", title: "Nasr Holstered", detail: "Pakistan Nasr watch, no nuclear use.", check: (w) => w.scenarioId === "nasr-flushed" && w.ended && w.nuclearUses.length === 0 },
];

function loadStats(): CareerStats {
  if (typeof window === "undefined") {
    return { games: 0, wins: 0, bestScore: {}, endings: {}, achievements: [], scenarioBest: {} };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { games: 0, wins: 0, bestScore: {}, endings: {}, achievements: [], scenarioBest: {} };
    return JSON.parse(raw) as CareerStats;
  } catch {
    return { games: 0, wins: 0, bestScore: {}, endings: {}, achievements: [], scenarioBest: {} };
  }
}

function saveStats(s: CareerStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export const WIN_KINDS: EndingKind[] = [
  "peace",
  "war-win",
  "red-win",
  "ceasefire",
  "mandate-win",
];

/**
 * Whether an ending counts as a win. Exported because `EndScreen` needs to say
 * VICTORY or DEFEAT out loud — it previously rendered `ending.title` and never
 * read `ending.kind` at all, so the game never actually told you if you won.
 */
export function isWin(kind: EndingKind): boolean {
  return WIN_KINDS.includes(kind);
}

export function recordGameEnd(world: World, scenarioId: ScenarioId | null) {
  if (!world.ending) return;
  saveReplaySnapshot(world);
  const s = loadStats();
  s.games += 1;
  if (isWin(world.ending.kind)) s.wins += 1;
  s.endings[world.ending.kind] = (s.endings[world.ending.kind] ?? 0) + 1;
  const seatKey = world.playerId;
  s.bestScore[seatKey] = Math.max(s.bestScore[seatKey] ?? 0, world.ending.score);
  if (scenarioId) {
    s.scenarioBest[scenarioId] = Math.max(s.scenarioBest[scenarioId] ?? 0, world.ending.score);
  }
  const seats = new Set(Object.keys(s.bestScore));
  for (const a of ACHIEVEMENTS) {
    if (s.achievements.includes(a.id)) continue;
    if (a.id === "all-seats" && seats.size >= 5) {
      s.achievements.push(a.id);
      continue;
    }
    if (a.check(world)) s.achievements.push(a.id);
  }
  saveStats(s);
}

export function getCareerStats(): CareerStats {
  return loadStats();
}

export function getAchievements(): AchievementDef[] {
  return ACHIEVEMENTS;
}

export function letterGrade(score: number, intent: World["intent"], firstUse: World["firstUse"], playerId: World["playerId"]): string {
  let adj = score;
  if (firstUse === playerId && intent === "blue") adj -= 150;
  if (adj >= 850) return "S";
  if (adj >= 700) return "A";
  if (adj >= 550) return "B";
  if (adj >= 400) return "C";
  return "D";
}

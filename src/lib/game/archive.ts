import { SCENARIOS, type ScenarioId } from "./scenarios";
import { briefFor, type ScenarioBrief } from "./scenarioBriefs";
import { getCareerStats, type CareerStats } from "./stats";

/**
 * The Archive.
 *
 * One incident file per scenario, drawn from the research corpus
 * the game was built out of. A file opens when you finish the watch it belongs
 * to -- not when you start one, and not when you abandon one. That is the whole
 * mechanic, and it is the reason the ending fields can live in the brief from
 * the beginning without spoiling anything: nothing here is visible until you
 * have already made the decision yourself.
 *
 * There is no separate persistence. `stats.scenarioBest` has always recorded a
 * best score per scenario at the moment a run ends, so it is already an exact
 * record of which watches have been completed. A second store keyed on the same
 * event would be a second thing to migrate and a second thing to get out of
 * sync.
 *
 * The core is pure and takes the stats as an argument, so the integrity checks
 * can prove the unlock rule without a localStorage to read.
 */
export interface ArchiveEntry {
  id: ScenarioId;
  title: string;
  era: string;
  category: string;
  challenge: number;
  /** True once the player has finished this watch at least once. */
  opened: boolean;
  /** Best score on this scenario, or null if never finished. */
  best: number | null;
  brief: ScenarioBrief;
}

export interface ArchiveSummary {
  entries: ArchiveEntry[];
  opened: number;
  total: number;
}

/** Pure core. Given career stats, which files are open. */
export function buildArchive(stats: Pick<CareerStats, "scenarioBest">): ArchiveSummary {
  const entries: ArchiveEntry[] = [];
  for (const def of SCENARIOS) {
    const brief = briefFor(def.id);
    if (!brief) continue;
    const best = stats.scenarioBest?.[def.id];
    entries.push({
      id: def.id,
      title: def.title,
      era: def.era,
      category: def.category,
      challenge: def.challenge,
      opened: typeof best === "number",
      best: typeof best === "number" ? best : null,
      brief,
    });
  }
  return { entries, opened: entries.filter((e) => e.opened).length, total: entries.length };
}

/** Browser-facing wrapper. Reads the career store. */
export function readArchive(): ArchiveSummary {
  return buildArchive(getCareerStats());
}

/**
 * What a locked file is allowed to show.
 *
 * Enough to make the player want it -- the era, how hard it is, what kind of
 * crisis -- and nothing that gives away the situation. Deliberately not the
 * headline: the headline is the hook and it belongs to the briefing screen,
 * where choosing to play is the next thing you can do about it.
 */
export function lockedLine(entry: ArchiveEntry): string {
  const era = entry.era === "historical" ? "Historical" : entry.era === "2027" ? "2027 theater" : "Threshold";
  return `${era} · ${entry.category} · challenge ${entry.challenge} of 5. Finish this watch to open the file.`;
}

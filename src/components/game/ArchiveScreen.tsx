import { useMemo, useState } from "react";
import { useGame } from "@/lib/game/store";
import { lockedLine, readArchive, type ArchiveEntry } from "@/lib/game/archive";
import { HudButton, HudChip, HudLabel, HudPanel } from "./ui/Hud";
import { cn } from "@/lib/utils";

/**
 * One incident file per scenario, opened by playing the watch it belongs to.
 *
 * The completion goal is the point. Every file carries dates, counts and
 * outcomes from the research corpus, so working through the list is the same
 * action as reading the record -- and because a file only opens when a run
 * ends, nothing here can spoil a scenario you have not played.
 */
export function ArchiveScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const [filter, setFilter] = useState<"all" | "opened" | "locked">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const archive = useMemo(() => readArchive(), []);
  const shown = archive.entries.filter((e) =>
    filter === "all" ? true : filter === "opened" ? e.opened : !e.opened,
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl min-w-0 flex-col overflow-x-hidden px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HudChip active>Archive</HudChip>
        <HudButton variant="ghost" className="px-3 py-2 text-xs" onClick={() => setScreen("title")}>
          Menu
        </HudButton>
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-wide text-fg sm:text-4xl">
        The record
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        One file per watch, drawn from a hundred real incidents. A file opens when you finish the watch it
        belongs to — so nothing in here can tell you how a scenario ends before you have decided it yourself.
      </p>

      <HudPanel className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <HudLabel>Files opened</HudLabel>
          <p className="font-mono text-sm text-accent">
            {archive.opened} / {archive.total}
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${archive.total ? (archive.opened / archive.total) * 100 : 0}%` }}
          />
        </div>
      </HudPanel>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", "opened", "locked"] as const).map((f) => (
          <HudButton
            key={f}
            variant={filter === f ? "active" : "ghost"}
            className="px-3 py-2 text-xs uppercase"
            onClick={() => setFilter(f)}
          >
            {f}
          </HudButton>
        ))}
      </div>

      <div className="mt-4 space-y-2 pb-10">
        {shown.length === 0 ? (
          <p className="text-sm text-subtle">
            {filter === "opened"
              ? "No files open yet. Finish a watch and its file lands here."
              : "Every file is open. There is nothing left in the drawer."}
          </p>
        ) : null}
        {shown.map((entry) => (
          <FileRow
            key={entry.id}
            entry={entry}
            open={expanded === entry.id}
            onToggle={() => setExpanded(expanded === entry.id ? null : entry.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FileRow({
  entry,
  open,
  onToggle,
}: {
  entry: ArchiveEntry;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        entry.opened ? "border-accent/25 bg-surface/50" : "border-border bg-bg/40",
      )}
    >
      <button
        type="button"
        onClick={entry.opened ? onToggle : undefined}
        aria-expanded={entry.opened ? open : undefined}
        disabled={!entry.opened}
        className={cn(
          "flex w-full items-baseline justify-between gap-3 text-left",
          entry.opened ? "cursor-pointer" : "cursor-default",
        )}
      >
        <span className="min-w-0">
          <span
            className={cn(
              "font-display text-sm tracking-wide",
              entry.opened ? "text-fg" : "text-subtle",
            )}
          >
            {entry.title}
          </span>
          {entry.opened ? (
            <span className="mt-0.5 block text-xs leading-snug text-muted">{entry.brief.headline}</span>
          ) : (
            <span className="mt-0.5 block text-xs leading-snug text-subtle">{lockedLine(entry)}</span>
          )}
        </span>
        <span className="shrink-0 font-mono text-micro text-subtle uppercase">
          {entry.opened ? `best ${Math.round(entry.best ?? 0)}` : "sealed"}
        </span>
      </button>

      {entry.opened && open ? (
        <div className="mt-3 border-t border-border pt-3">
          <p className="font-mono text-micro tracking-wider text-subtle uppercase">The record</p>
          <ul className="mt-1.5 space-y-1.5">
            {entry.brief.facts.map((fact) => (
              <li key={fact} className="flex gap-2 text-xs leading-relaxed text-muted">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                <span className="min-w-0">{fact}</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 font-mono text-micro tracking-wider text-subtle uppercase">Who was in it</p>
          <ul className="mt-1.5 space-y-1.5">
            {entry.brief.actors.map((a) => (
              <li key={a.id} className="text-xs leading-relaxed text-muted">
                <span className="font-mono text-micro tracking-wider text-fg uppercase">{a.id} </span>
                {a.wants}
              </li>
            ))}
          </ul>

          <p className="mt-3 font-mono text-micro tracking-wider text-subtle uppercase">The trap</p>
          <p className="mt-1 text-xs leading-relaxed text-warn">{entry.brief.theTrap}</p>

          {entry.brief.whatHappened ? (
            <>
              <p className="mt-3 font-mono text-micro tracking-wider text-accent uppercase">
                What actually happened
              </p>
              <p className="mt-1 text-xs leading-relaxed text-fg">{entry.brief.whatHappened}</p>
            </>
          ) : null}

          {entry.brief.afterward ? (
            <>
              <p className="mt-3 font-mono text-micro tracking-wider text-accent uppercase">
                What changed afterwards
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{entry.brief.afterward}</p>
            </>
          ) : null}

          {entry.brief.precedent && !entry.brief.whatHappened ? (
            <>
              <p className="mt-3 font-mono text-micro tracking-wider text-accent uppercase">The precedent</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{entry.brief.precedent}</p>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

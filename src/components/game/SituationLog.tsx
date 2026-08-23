import { useState } from "react";
import type { LogEntry, World } from "@/lib/game/types";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";

type Filter = "all" | "you" | "critical" | "diplomacy" | "nuclear";

function matchesFilter(entry: LogEntry, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "you") return entry.kind === "you";
  if (filter === "critical") return entry.kind === "critical" || entry.kind === "warn";
  if (filter === "diplomacy") {
    const t = `${entry.text} ${entry.why}`.toLowerCase();
    return t.includes("hotline") || t.includes("diplom") || t.includes("line") || t.includes("notice");
  }
  if (filter === "nuclear") {
    const t = `${entry.text} ${entry.why}`.toLowerCase();
    return t.includes("nuclear") || t.includes("launch") || t.includes("warhead") || t.includes("detonat");
  }
  return true;
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "you", label: "You" },
  { id: "critical", label: "Alert" },
  { id: "diplomacy", label: "Diplo" },
  { id: "nuclear", label: "Nuclear" },
];

export function SituationLog({ world }: { world: World }) {
  const whyId = useGame((s) => s.whyId);
  const setWhy = useGame((s) => s.setWhy);
  const [filter, setFilter] = useState<Filter>("all");
  const entries = world.log.filter((e) => matchesFilter(e, filter));

  return (
    <section className="mt-4">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">Situation report</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "min-h-8 rounded-sm px-2 font-mono text-[10px] tracking-wider uppercase",
              filter === f.id ? "bg-fg text-bg" : "bg-elevated text-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-1">
        {entries.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setWhy(whyId === e.id ? null : e.id)}
              className={cn(
                "w-full rounded-md p-2.5 text-left shadow-[var(--shadow-border)]",
                e.kind === "critical" ? "bg-danger/10" : e.kind === "you" ? "bg-accent/10" : "bg-elevated",
              )}
            >
              <p className="font-mono text-[9px] tracking-wider text-muted uppercase">
                {e.date} · turn {e.turn}
                {e.kind === "critical" ? " · CRITICAL" : e.kind === "you" ? " · YOU" : ""}
              </p>
              <p className="mt-1 text-xs leading-snug text-fg">{e.text}</p>
              {whyId === e.id ? (
                <p className="mt-2 text-[11px] leading-relaxed text-muted">{e.why}</p>
              ) : (
                <p className="mt-1 text-[10px] text-subtle">Tap for causal line</p>
              )}
            </button>
          </li>
        ))}
        {!entries.length ? (
          <li className="text-xs text-subtle">No entries for this filter.</li>
        ) : null}
      </ul>
    </section>
  );
}

/** Latest critical/you entry for action panel pin. */
export function pinnedLogEntry(world: World): LogEntry | null {
  return world.log.find((e) => e.kind === "critical" || e.kind === "you") ?? world.log[0] ?? null;
}

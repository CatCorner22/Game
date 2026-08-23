import { useState } from "react";
import type { LogEntry, World } from "@/lib/game/types";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";
import { HudButton, HudLabel } from "./ui/Hud";

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
      <HudLabel>Situation report</HudLabel>
      <div className="mt-2 flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <HudButton
            key={f.id}
            variant={filter === f.id ? "active" : "ghost"}
            className="min-h-8 px-2 text-[10px] uppercase"
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </HudButton>
        ))}
      </div>
      <ul className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-1">
        {entries.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setWhy(whyId === e.id ? null : e.id)}
              className={cn(
                "glass-panel w-full rounded-lg p-2.5 text-left transition-all hover:neon-border-accent",
                e.kind === "critical" && "neon-border-danger",
                e.kind === "you" && "neon-border-accent",
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
        {!entries.length ? <li className="text-xs text-subtle">No entries for this filter.</li> : null}
      </ul>
    </section>
  );
}

/** Latest critical/you entry for action panel pin. */
export function pinnedLogEntry(world: World): LogEntry | null {
  return world.log.find((e) => e.kind === "critical" || e.kind === "you") ?? world.log[0] ?? null;
}

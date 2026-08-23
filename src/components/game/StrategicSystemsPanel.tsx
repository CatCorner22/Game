import type { World } from "@/lib/game/types";
import { ensureStrategicSystems } from "@/lib/game/strategicSystems";
import { cn } from "@/lib/utils";

function Gauge({
  label,
  value,
  dangerHigh = false,
}: {
  label: string;
  value: number;
  dangerHigh?: boolean;
}) {
  const rounded = Math.round(Math.max(0, Math.min(100, value)));
  const danger = dangerHigh ? rounded >= 58 : rounded <= 36;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 font-mono text-micro tracking-wider uppercase">
        <span className="text-muted">{label}</span>
        <span className={danger ? "text-danger" : "text-fg"}>{rounded}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg">
        <div
          className={cn("h-full rounded-full", danger ? "bg-danger" : "bg-accent")}
          style={{ width: `${rounded}%` }}
        />
      </div>
    </div>
  );
}

export function StrategicSystemsPanel({ world }: { world: World }) {
  ensureStrategicSystems(world);
  const ai = world.strategicAI!;
  const deadhand = world.deadhand!;
  const active = ai.mode !== "human" || deadhand.mode !== "off";

  return (
    <section className="mt-5 rounded-lg bg-elevated p-3 shadow-[var(--shadow-border)]" aria-labelledby="strategic-systems-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p id="strategic-systems-title" className="font-mono text-micro tracking-[0.18em] text-accent">
            Command intelligence
          </p>
          <p className="mt-1 text-sm font-medium text-fg">{ai.label}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 font-mono text-micro tracking-wider uppercase",
            active ? "bg-accent/15 text-accent" : "bg-bg text-muted",
          )}
        >
          {ai.mode}
        </span>
      </div>

      <div className="mt-3 rounded-md bg-bg/70 p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-micro tracking-wider text-muted uppercase">Recommendation</span>
          <span className="font-display text-sm tracking-wider text-accent uppercase">{ai.recommendation}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-subtle">{ai.rationale}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
        <Gauge label="Confidence" value={ai.confidence} />
        <Gauge label="Data integrity" value={ai.dataIntegrity} />
        <Gauge label="Dissent" value={ai.dissent} />
        <Gauge label="Autonomy" value={ai.autonomy} dangerHigh />
        <Gauge label="Hallucination" value={ai.hallucinationRisk} dangerHigh />
        <Gauge label="Automation bias" value={ai.automationBias} dangerHigh />
      </div>

      {ai.mode === "ensemble" || ai.mode === "skynet" ? (
        <details className="mt-3 rounded-md bg-bg/55 p-3">
          <summary className="cursor-pointer font-mono text-micro tracking-wider text-muted uppercase">
            Compare model votes
          </summary>
          <ul className="mt-3 space-y-2">
            {ai.modelVotes.map((vote) => (
              <li key={vote.model} className="border-l border-border pl-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-micro text-fg">{vote.model}</span>
                  <span className="font-mono text-micro text-accent uppercase">
                    {vote.action} · {Math.round(vote.confidence)}
                  </span>
                </div>
                <p className="mt-1 text-micro leading-relaxed text-subtle">{vote.note}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-micro tracking-wider text-muted">Continuity protocol</span>
          <span
            className={cn(
              "font-mono text-micro tracking-wider uppercase",
              deadhand.status === "challenged" || deadhand.status === "isolated"
                ? "text-danger"
                : deadhand.mode === "off"
                  ? "text-muted"
                  : "text-accent",
            )}
          >
            {deadhand.status}
          </span>
        </div>
        {deadhand.mode !== "off" ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Gauge label="Assurance" value={deadhand.assurance} />
            <Gauge label="Comms" value={deadhand.communications} />
            <Gauge label="Ambiguity" value={deadhand.ambiguity} dangerHigh />
          </div>
        ) : (
          <p className="mt-2 text-xs text-subtle">No fail-deadly continuity mechanic is active.</p>
        )}
      </div>

      <p className="mt-3 text-micro leading-relaxed text-subtle">
        Fictional local simulation only. No external LLM, real command interface, operational trigger logic, or targeting model is used.
      </p>
    </section>
  );
}

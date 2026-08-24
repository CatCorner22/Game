import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FuturisticShell({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "war" | "minimal";
}) {
  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-hidden",
        variant === "war" ? "war-shell" : "futuristic-bg",
        className,
      )}
    >
      {variant !== "minimal" ? (
        <>
          <div className="pointer-events-none absolute inset-0 hud-grid opacity-60" aria-hidden />
          <div className="pointer-events-none absolute -top-32 left-1/4 size-[480px] rounded-full bg-accent/8 blur-[120px] animate-orb" aria-hidden />
          <div
            className="pointer-events-none absolute bottom-0 right-0 size-[360px] rounded-full bg-neon/6 blur-[100px] animate-orb-reverse"
            aria-hidden
          />
          <div className="scanline pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        </>
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GlassPanel({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: "accent" | "danger" | "none";
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-lg",
        glow === "accent" && "neon-border-accent",
        glow === "danger" && "neon-border-danger",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The section label used throughout the HUD.
 *
 * It was `text-accent/80` at `0.28em`, which is why every screen was one colour:
 * with each label, value, chip and border in the same cyan, nothing on screen
 * could be more important than anything else. Labels are structure, so they are
 * now neutral, and cyan is left to mean something.
 *
 * Tracking is also tightened, because the mono face is wider than the display
 * face it replaced and `0.28em` was pushing "NUCLEAR FOOTBALL" onto two lines.
 */
export function HudLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-micro leading-tight tracking-[0.08em] text-muted uppercase", className)}>
      {children}
    </p>
  );
}

export function HudChip({
  children,
  active,
  danger,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  danger?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-micro tracking-wider uppercase tabular",
        active && "border-accent/50 bg-accent/15 text-accent glow-accent-sm",
        danger && "border-danger/50 bg-danger/15 text-danger",
        !active && !danger && "border-border/80 bg-surface/60 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

type HudButtonVariant = "default" | "active" | "accent" | "danger" | "ghost";

export function HudButton({
  children,
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: HudButtonVariant }) {
  return (
    <button
      type="button"
      className={cn(
        "hud-btn transition-[box-shadow,transform,background-color,border-color] duration-200",
        variant === "default" && "glass-panel text-fg hover:neon-border-accent",
        variant === "active" && "bg-accent text-accent-fg glow-accent-sm neon-border-accent",
        variant === "accent" && "bg-accent/20 text-accent neon-border-accent hover:bg-accent/30",
        variant === "danger" && "bg-danger/20 text-danger neon-border-danger hover:bg-danger/30",
        variant === "ghost" && "border-transparent bg-transparent text-muted hover:text-accent",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function HudHeader({
  title,
  subtitle,
  right,
  war,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  war?: boolean;
}) {
  return (
    <header
      className={cn(
        "flex h-14 max-w-full min-w-0 items-center justify-between gap-3 overflow-hidden border-b px-4 backdrop-blur-xl",
        war ? "border-danger/40 bg-danger/5" : "border-accent/20 bg-surface/40",
      )}
    >
      <div className="min-w-0">
        <h1
          className={cn(
            "font-display text-lg tracking-[0.24em] uppercase",
            war ? "text-glow-danger text-danger" : "text-glow-accent text-fg",
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate font-mono text-micro tracking-[0.16em] text-muted uppercase">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="flex shrink-0 items-center gap-1">{right}</div> : null}
    </header>
  );
}

export function HudPanel({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: "accent" | "danger" | "none";
}) {
  return (
    <GlassPanel glow={glow} className={cn("rounded-lg p-3", className)}>
      {children}
    </GlassPanel>
  );
}

export function HudSectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <HudLabel className={cn("mb-2 block", className)}>{children}</HudLabel>;
}

export function HudModalOverlay({
  children,
  className,
  glow = "accent",
  label,
}: {
  children: ReactNode;
  className?: string;
  glow?: "accent" | "danger" | "none";
  label?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/85 p-3 backdrop-blur-md sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <GlassPanel glow={glow} className={cn("max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-xl p-5", className)}>
        {children}
      </GlassPanel>
    </div>
  );
}

export function ScenarioCard({
  title,
  line,
  era,
  difficulty,
  selected,
  onClick,
  seat,
  headline,
}: {
  title: string;
  line: string;
  era: string;
  difficulty: string;
  selected: boolean;
  onClick: () => void;
  seat?: string;
  headline?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group min-h-[88px] w-full rounded-lg p-3 text-left transition-all duration-200",
        selected ? "glass-panel neon-border-accent glow-accent-sm" : "glass-panel hover:neon-border-accent/60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-display text-sm tracking-[0.12em] text-fg uppercase">{`${title} · ${era}`}</span>
      </div>
      {/* A sentence about something that happened. The old telegraphic `line`
          ("Blockade heat", "Nasr batteries flushed") is deliberately NOT shown
          underneath: it told a player nothing unless they already knew the
          domain, which was the whole complaint, and for the newer scenarios it
          simply repeated the headline. It stays on ScenarioDef as the short
          searchable summary and is not the thing anyone reads. */}
      <p className="mt-1.5 text-sm leading-snug text-fg">{headline ?? line}</p>
      <p className="mt-2 font-mono text-micro tracking-wider text-subtle uppercase">
        {seat ? `${seat} · ` : ""}
        {difficulty}
      </p>
    </button>
  );
}

const PHASES = ["peacetime", "crisis", "conventional", "nuclear", "aftermath"] as const;

export function EscalationLadder({
  phase,
  defcon,
  winter,
}: {
  phase: string;
  defcon: number;
  winter: number;
}) {
  return (
    <HudPanel glow={defcon <= 2 || phase === "nuclear" ? "danger" : "accent"} className="pointer-events-none">
      <HudLabel>Escalation</HudLabel>
      <div className="mt-2 flex gap-1">
        {PHASES.map((p) => (
          <span
            key={p}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              phase === p ? (p === "nuclear" || p === "aftermath" ? "bg-danger" : "bg-accent glow-accent-sm") : "bg-surface",
            )}
            title={p}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-micro tracking-wider text-muted uppercase">
        {phase} · ALERT {defcon} · winter {winter}
      </p>
    </HudPanel>
  );
}

/**
 * Key/value row. Previously written out verbatim three separate times
 * (ActionPanel, EndScreen, StatsScreen) with identical markup.
 */
export function HudRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-accent/15 py-2">
      <dt className="text-xs tracking-wide text-muted uppercase">{k}</dt>
      <dd className="font-mono text-sm text-fg tabular text-right">{v}</dd>
    </div>
  );
}

/**
 * Labelled meter with a fill bar and help text.
 *
 * Promoted here from `PlayScreen` because four separate bar implementations had
 * already accumulated across the codebase (here, StrategicSystemsPanel's Gauge,
 * ObjectivesPanel, FlashpointBoard) and new subsystems would each have added
 * another.
 *
 * `invert` marks meters where a HIGH value is the bad one (risk, winter). ALERT
 * is special: it counts DOWN toward war, so 5 is peacetime and 1 is nuclear war,
 * and its bar deliberately fills as the level descends — it reads as an
 * escalation gauge rather than a quantity.
 */
export function HudMeter({
  label,
  value,
  max,
  invert,
  help,
  alertScale,
}: {
  label: string;
  value: number;
  max: number;
  invert?: boolean;
  help?: string;
  /** ALERT-style 5..1 descending scale. */
  alertScale?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const hot = alertScale ? value <= 2 : invert ? pct > 55 : pct < 40;
  const fill = alertScale ? ((5 - value) / 4) * 100 : pct;
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between gap-2">
        <HudLabel className="tracking-[0.1em]">{label}</HudLabel>
        <span className={cn("font-mono text-sm tabular", hot ? "text-danger text-glow-danger" : "text-accent")}>
          {alertScale ? value : Math.round(value)}
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface/80">
        <div
          className={cn(
            "h-1 rounded-full transition-all duration-500 glow-accent-sm",
            hot ? "bg-danger" : "bg-accent",
          )}
          style={{ width: `${Math.max(0, Math.min(100, fill))}%` }}
        />
      </div>
      {help ? <MeterHelp label={label} help={help} /> : null}
    </div>
  );
}

/**
 * Meter help, collapsed to one line until asked for.
 *
 * The design intent ("every meter exposes the variables beneath it") is right,
 * but rendering all of it permanently meant eight meters filled the entire
 * status column with three to four lines of prose each — the left rail was
 * mostly tutorial. Clamping keeps the information one tap away instead of
 * deleting it.
 *
 * The accessible name is "About <meter>", which is unique per meter, so this
 * never collides with the exact-name controls the mobile smoke test locates.
 */
function MeterHelp({ label, help }: { label: string; help: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      aria-label={`About ${label}`}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className="mt-1 block w-full cursor-pointer text-left text-micro leading-snug text-subtle transition-colors hover:text-muted"
    >
      <span className={open ? "" : "line-clamp-1"}>{help}</span>
    </button>
  );
}

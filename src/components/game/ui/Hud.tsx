import type { ReactNode } from "react";
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

export function HudLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[10px] tracking-[0.28em] text-accent/80 uppercase", className)}>
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
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase tabular",
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
          <p className="truncate font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{subtitle}</p>
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
}: {
  title: string;
  line: string;
  era: string;
  difficulty: string;
  selected: boolean;
  onClick: () => void;
  seat?: string;
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
      <p className="mt-1.5 text-xs leading-snug text-muted">{line}</p>
      <p className="mt-2 font-mono text-[9px] tracking-wider text-subtle uppercase">
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
      <p className="mt-2 font-mono text-[10px] tracking-wider text-muted uppercase">
        {phase} · ALERT {defcon} · winter {winter}
      </p>
    </HudPanel>
  );
}

import { useGame } from "@/lib/game/store";

export function ErrorBanner() {
  const err = useGame((s) => s.lastError);
  const clear = useGame((s) => s.clearError);
  if (!err) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-danger/40 bg-danger/15 px-4 py-2">
      <p className="text-sm text-fg">
        <span className="font-mono text-[10px] tracking-wider text-danger uppercase">Fault · </span>
        {err}
      </p>
      <button type="button" onClick={clear} className="font-display text-xs text-muted uppercase">
        Dismiss
      </button>
    </div>
  );
}

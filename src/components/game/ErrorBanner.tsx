import { useGame } from "@/lib/game/store";
import { HudButton } from "./ui/Hud";

export function ErrorBanner() {
  const err = useGame((s) => s.lastError);
  const clear = useGame((s) => s.clearError);
  if (!err) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-danger/40 bg-danger/15 px-4 py-2 backdrop-blur-md">
      <p className="text-sm text-fg">
        <span className="font-mono text-micro tracking-wider text-danger uppercase">Fault · </span>
        {err}
      </p>
      <HudButton variant="ghost" className="text-xs uppercase" onClick={clear}>
        Dismiss
      </HudButton>
    </div>
  );
}

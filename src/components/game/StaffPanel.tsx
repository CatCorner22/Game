import type { World } from "@/lib/game/types";
import { majorityKind, staffAdvice } from "@/lib/game/staff";
import { useGame } from "@/lib/game/store";
import { HudButton, HudLabel, HudPanel } from "./ui/Hud";
import { cn } from "@/lib/utils";

export function StaffPanel({ world }: { world: World }) {
  const setKind = useGame((s) => s.setKind);
  const setIntensity = useGame((s) => s.setIntensity);
  const setNotify = useGame((s) => s.setNotify);
  const select = useGame((s) => s.select);
  const kind = useGame((s) => s.actionKind);
  const advice = staffAdvice(world);
  const majority = majorityKind(advice);

  return (
    <HudPanel className="mt-1">
      <HudLabel>Staff split · not an order</HudLabel>
      <p className="mt-1 text-[10px] text-subtle">
        Desks disagree. Tap a line to load that move. Majority leans {majority.toUpperCase()}.
      </p>
      <ul className="mt-2 space-y-1.5">
        {advice.map((a) => (
          <li key={a.desk}>
            <HudButton
              variant={kind === a.kind ? "accent" : "default"}
              className="w-full px-2 py-2 text-left"
              onClick={() => {
                setKind(a.kind);
                setIntensity(a.intensity);
                setNotify(a.notify);
                if (a.target) select(a.target);
              }}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] tracking-wider text-accent uppercase">{a.desk}</span>
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase",
                    a.tone === "employ" ? "text-danger" : a.tone === "generate" ? "text-accent" : "text-muted",
                  )}
                >
                  {a.kind} {a.kind !== "hold" ? a.intensity : ""}
                </span>
              </span>
              <span className="mt-1 block text-[11px] leading-snug text-fg normal-case tracking-normal">{a.line}</span>
            </HudButton>
          </li>
        ))}
      </ul>
    </HudPanel>
  );
}

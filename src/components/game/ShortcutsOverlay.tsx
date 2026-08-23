import { useEffect, useState } from "react";
import { HudButton, HudLabel, HudModalOverlay } from "./ui/Hud";

const ROWS: { key: string; line: string }[] = [
  { key: "H", line: "HOLD" },
  { key: "D", line: "DIPLOMACY" },
  { key: "I", line: "INTEL" },
  { key: "P", line: "POSTURE" },
  { key: "1 / 2 / 3", line: "Weight" },
  { key: "Shift+Enter", line: "Execute this month" },
  { key: "?", line: "This file" },
];

export function ShortcutsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <HudModalOverlay>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-[0.12em] text-glow-accent text-fg uppercase">Keys</h2>
        <HudButton variant="ghost" onClick={onClose}>
          Close
        </HudButton>
      </div>
      <HudLabel className="mt-4">Command watch</HudLabel>
      <dl className="mt-3 space-y-2">
        {ROWS.map((r) => (
          <div key={r.key} className="flex justify-between gap-4 border-b border-accent/15 py-1.5">
            <dt className="font-mono text-xs text-accent">{r.key}</dt>
            <dd className="text-sm text-muted">{r.line}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-subtle">Staff lines load a move. They do not execute. The football is still authentication.</p>
    </HudModalOverlay>
  );
}

export function HelpLayer() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        setOpen((v) => !v);
        e.preventDefault();
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <ShortcutsOverlay open={open} onClose={() => setOpen(false)} />;
}

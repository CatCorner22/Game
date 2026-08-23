import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { saveWorld } from "@/lib/game/save";
import { TitleScreen } from "./TitleScreen";
import { Briefing } from "./Briefing";
import { PlayScreen } from "./PlayScreen";
import { EndScreen } from "./EndScreen";

export function GameApp() {
  const screen = useGame((s) => s.screen);

  useEffect(() => {
    const flush = () => {
      const world = useGame.getState().world;
      if (world) saveWorld(world);
    };
    const onVis = () => {
      if (document.hidden) flush();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      {screen === "title" ? <TitleScreen /> : null}
      {screen === "briefing" ? <Briefing /> : null}
      {screen === "play" ? <PlayScreen /> : null}
      {screen === "end" ? <EndScreen /> : null}
    </div>
  );
}

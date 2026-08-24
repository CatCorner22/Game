import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { saveWorld } from "@/lib/game/save";
import { applySettingsOnBoot } from "@/lib/game/settings";
import { TitleScreen } from "./TitleScreen";
import { Briefing } from "./Briefing";
import { PlayScreen } from "./PlayScreen";
import { WarScreen } from "./WarScreen";
import { EndScreen } from "./EndScreen";
import { StatsScreen } from "./StatsScreen";
import { MultiplayerScreen } from "./MultiplayerScreen";
import { AdvisorConference } from "./AdvisorConference";
import { TutorialOverlay, useKeyboardShortcuts } from "./TutorialOverlay";
import { GameErrorBoundary } from "./GameErrorBoundary";
import { ErrorBanner } from "./ErrorBanner";
import { FuturisticShell } from "./ui/Hud";
import { HelpLayer } from "./ShortcutsOverlay";

export function GameApp() {
  const screen = useGame((s) => s.screen);
  useKeyboardShortcuts();

  useEffect(() => {
    applySettingsOnBoot();
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

  const shellVariant =
    screen === "war"
      ? "war"
      : screen === "title" || screen === "play" || screen === "end" || screen === "briefing" || screen === "stats" || screen === "multiplayer"
        ? "default"
        : "minimal";

  return (
    <GameErrorBoundary>
      <FuturisticShell variant={shellVariant} className="min-h-dvh text-fg">
        <ErrorBanner />
        {screen === "title" ? <TitleScreen /> : null}
        {screen === "briefing" ? <Briefing /> : null}
        {screen === "play" ? <PlayScreen /> : null}
        {screen === "war" ? <WarScreen /> : null}
        {screen === "end" ? <EndScreen /> : null}
        {screen === "stats" ? <StatsScreen /> : null}
        {screen === "multiplayer" ? <MultiplayerScreen /> : null}
        <AdvisorConference />
        <TutorialOverlay />
        <HelpLayer />
      </FuturisticShell>
    </GameErrorBoundary>
  );
}

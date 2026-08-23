import type { World } from "./types";
import { buildTrack, closeCallEvent } from "./warning";
import { log } from "./simLog";

export type ScenarioId = "petrov-1983" | "able-archer" | "taiwan-2027" | "broken-arrow";

export interface ScenarioDef {
  id: ScenarioId;
  title: string;
  line: string;
  playerId: World["playerId"];
  intent: World["intent"];
  difficulty: World["difficulty"];
}

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "petrov-1983",
    title: "Petrov 1983",
    line: "Soviet early warning. One track. Six minutes. HOLD or fire.",
    playerId: "RU",
    intent: "blue",
    difficulty: "extreme",
  },
  {
    id: "able-archer",
    title: "Able Archer",
    line: "NATO exercise read as first strike. Moscow is watching.",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
  },
  {
    id: "taiwan-2027",
    title: "Taiwan Strait 2027",
    line: "Blockade heat. US and China on the line.",
    playerId: "US",
    intent: "blue",
    difficulty: "standard",
  },
  {
    id: "broken-arrow",
    title: "Broken Arrow",
    line: "Custody lost mid-crisis. Locate before Empty Quiver.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
  },
];

export function applyScenario(world: World, id: ScenarioId): World {
  const w = structuredClone(world);
  (w as World & { scenarioId?: string }).scenarioId = id;

  if (id === "petrov-1983") {
    w.playerId = "RU";
    w.intent = "blue";
    w.difficulty = "extreme";
    w.year = 1983;
    w.month = 9;
    w.turn = 1;
    w.defcon = 2;
    w.globalRisk = 72;
    w.closeCall = { track: buildTrack(w, "US", "false"), humint: "Serpukhov duty officer: one satellite, not corroborated." };
    w.closeCall.track.minutesToImpact = 6;
    w.closeCall.track.confidence = 52;
    w.event = closeCallEvent(w, w.closeCall);
    log(w, "critical", "Scenario: Petrov 1983. One track on the board.", w.event.ignoreLine);
  }

  if (id === "able-archer") {
    w.playerId = "RU";
    w.intent = "blue";
    w.difficulty = "hard";
    const fp = w.flashpoints.find((f) => f.id === "nato-ru");
    if (fp) fp.heat = 78;
    w.globalRisk = 58;
    w.defcon = 3;
    w.event = {
      id: "able-archer-ex",
      title: "Able Archer 83 replay",
      body: "NATO is running a command-post exercise with unusual realism. Your generals read it as cover for a first strike.",
      actor: "US",
      heat: "high",
      ignoreLine: "POSTURE without notice looks like generation. DIPLOMACY asks if this is an exercise.",
      tags: ["nato", "scenario"],
    };
    log(w, "warn", "Scenario: Able Archer. Exercise misread risk is elevated.", w.event.ignoreLine);
  }

  if (id === "taiwan-2027") {
    w.playerId = "US";
    w.intent = "blue";
    const tw = w.flashpoints.find((f) => f.id === "taiwan");
    if (tw) tw.heat = 72;
    w.globalRisk = 52;
    w.event = {
      id: "tw-blockade",
      title: "Quarantine declared",
      body: "The PRC announces a maritime quarantine around Taiwan. Civil traffic is turned back. Dual-capable aircraft are forward.",
      actor: "CN",
      heat: "high",
      ignoreLine: "DIPLOMACY on Beijing asks intent. POSTURE without notice reads as first strike.",
      tags: ["taiwan", "scenario"],
    };
    log(w, "warn", "Scenario: Taiwan Strait 2027.", w.event.ignoreLine);
  }

  if (id === "broken-arrow") {
    w.playerId = "US";
    w.intent = "blue";
    w.turn = 8;
    w.month = 9;
    w.globalRisk = 48;
    w.brokenArrow = {
      owner: "US",
      place: "B-52 debris, North Dakota",
      kind: "crash",
      age: 0,
      found: false,
      recovered: false,
    };
    w.event = {
      id: "ba-scenario",
      title: "Broken Arrow declared",
      body: "A B-52 with live weapons crashed on approach. Custody is uncertain. Satellites will see the wreck.",
      actor: "US",
      heat: "critical",
      ignoreLine: "INTEL locates. COVERT recovers. HOLD is how it becomes theft.",
      tags: ["broken-arrow", "scenario"],
    };
    log(w, "critical", "Scenario: Broken Arrow.", w.event.ignoreLine);
  }

  return w;
}

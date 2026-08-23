import type { World } from "./types";
import { buildTrack, closeCallEvent } from "./warning";
import { log } from "./simLog";

export type ScenarioId =
  | "petrov-1983"
  | "able-archer"
  | "taiwan-2027"
  | "broken-arrow"
  | "kashmir-2027"
  | "cuba-1962";

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
  {
    id: "kashmir-2027",
    title: "Kashmir 2027",
    line: "Nasr batteries flushed. NFU under pressure. One tactical ends the taboo.",
    playerId: "IN",
    intent: "blue",
    difficulty: "hard",
  },
  {
    id: "cuba-1962",
    title: "Caribbean host",
    line: "Dual-capable canisters in a harbor. Washington has the photographs.",
    playerId: "CU",
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

  if (id === "kashmir-2027") {
    w.playerId = "IN";
    w.intent = "blue";
    w.difficulty = "hard";
    const k = w.flashpoints.find((f) => f.id === "kashmir");
    if (k) k.heat = 84;
    w.globalRisk = 64;
    w.defcon = 3;
    w.actors.PK.alert = 4;
    w.actors.PK.preDelegation = true;
    w.actors.IN.declaredNfu = true;
    w.event = {
      id: "kashmir-nasr",
      title: "Nasr batteries flushed",
      body: "Pakistan moved Hatf-9 Nasr units toward the Line of Control after a conventional clash. Your NFU is on paper. Their pre-delegation may already be verbal. DIPLOMACY asks if this is a generate. POSTURE without a notice is how both sides write first use. EMPLOY is a Nasr world.",
      actor: "PK",
      heat: "critical",
      ignoreLine: "They keep the batteries flushed. Use-it-or-lose-it is the file.",
      tags: ["kashmir", "scenario"],
    };
    log(w, "critical", "Scenario: Kashmir 2027. Tactical nuclear threshold.", w.event.ignoreLine);
  }

  if (id === "cuba-1962") {
    w.playerId = "CU";
    w.intent = "blue";
    w.difficulty = "hard";
    const fp = w.flashpoints.find((f) => f.id === "cuba");
    if (fp) fp.heat = 76;
    w.globalRisk = 60;
    w.defcon = 3;
    w.event = {
      id: "cuba-canisters",
      title: "Canisters photographed",
      body: "A foreign dual-capable shipment is in the harbor. Washington has the pictures. Moscow says it is an exercise. You can refuse the host mission, take it and file a notice that will not be believed, or pretend it is fertilizer. 1962 started as a lie about fertilizer.",
      actor: "US",
      heat: "critical",
      ignoreLine: "The ship stays. You are a launch pad until you say otherwise.",
      tags: ["cuba", "scenario"],
    };
    log(w, "warn", "Scenario: Caribbean host. Dual-capable in harbor.", w.event.ignoreLine);
  }

  return w;
}

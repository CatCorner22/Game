import type { World } from "./types";
import { buildTrack, closeCallEvent } from "./warning";
import { log } from "./simLog";
import { seedBrokenArrow } from "./trickery";

export type ScenarioId =
  | "petrov-1983"
  | "able-archer"
  | "cuba-1962"
  | "taiwan-2027"
  | "broken-arrow"
  | "kashmir-2027"
  | "baltics-flank-2027"
  | "nk-window-2027"
  | "iran-breakout-2028"
  | "israel-preempt-2026"
  | "empty-quiver-2027"
  | "ukraine-tactical-2022"
  | "cartel-auction"
  | "union-generate";

export type ScenarioEra = "historical" | "2027" | "threshold";

export interface ScenarioDef {
  id: ScenarioId;
  title: string;
  line: string;
  playerId: World["playerId"];
  intent: World["intent"];
  difficulty: World["difficulty"];
  era: ScenarioEra;
}

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "petrov-1983",
    title: "Petrov 1983",
    line: "Soviet early warning. One track. Six minutes. HOLD or fire.",
    playerId: "RU",
    intent: "blue",
    difficulty: "extreme",
    era: "historical",
  },
  {
    id: "able-archer",
    title: "Able Archer",
    line: "NATO exercise read as first strike. Moscow is watching.",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
    era: "historical",
  },
  {
    id: "cuba-1962",
    title: "Caribbean host",
    line: "Dual-capable canisters in a harbor. Washington has the photographs.",
    playerId: "CU",
    intent: "blue",
    difficulty: "hard",
    era: "historical",
  },
  {
    id: "ukraine-tactical-2022",
    title: "Ukraine tactical rumor",
    line: "Allies assess a low-yield use. Moscow denies. NATO generated.",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
  },
  {
    id: "taiwan-2027",
    title: "Taiwan Strait 2027",
    line: "Blockade heat. US and China on the line.",
    playerId: "US",
    intent: "blue",
    difficulty: "standard",
    era: "2027",
  },
  {
    id: "baltics-flank-2027",
    title: "Baltics flank",
    line: "NATO dual-capable forward. Kaliningrad is the fuse.",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
  },
  {
    id: "nk-window-2027",
    title: "DPRK launch window",
    line: "You file the NOTAM. Seoul and Tokyo want a line. Beijing reads silence.",
    playerId: "KP",
    intent: "red",
    difficulty: "standard",
    era: "2027",
  },
  {
    id: "kashmir-2027",
    title: "Kashmir 2027",
    line: "Nasr batteries flushed. NFU under pressure. One tactical ends the taboo.",
    playerId: "IN",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
  },
  {
    id: "iran-breakout-2028",
    title: "Iran breakout",
    line: "IAEA at the gate. Israel is generating tankers. Breakout is weeks not years.",
    playerId: "IR",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
  },
  {
    id: "israel-preempt-2026",
    title: "Begin doctrine hour",
    line: "Jericho on strip. Iran weeks from device. Washington on the Swiss channel.",
    playerId: "IL",
    intent: "blue",
    difficulty: "standard",
    era: "2027",
  },
  {
    id: "broken-arrow",
    title: "Broken Arrow",
    line: "Custody lost mid-crisis. Locate before Empty Quiver.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
  },
  {
    id: "empty-quiver-2027",
    title: "Empty Quiver",
    line: "Warhead theft mid-crisis. NS may already have the object.",
    playerId: "US",
    intent: "blue",
    difficulty: "extreme",
    era: "2027",
  },
  {
    id: "cartel-auction",
    title: "Cartel auction",
    line: "A tactical is for sale in a port corridor. Price, not ideology.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
  },
  {
    id: "union-generate",
    title: "Union generate",
    line: "Two briefcases. One arsenal. Moscow says exercise. You say restoration.",
    playerId: "SU",
    intent: "red",
    difficulty: "hard",
    era: "threshold",
  },
];

export const SCENARIO_IDS: ScenarioId[] = SCENARIOS.map((s) => s.id);

export function applyScenario(world: World, id: ScenarioId): World {
  const w = structuredClone(world);
  w.scenarioId = id;

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
      tags: ["nato-ru", "scenario"],
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

  if (id === "baltics-flank-2027") {
    w.playerId = "RU";
    w.intent = "blue";
    w.difficulty = "hard";
    const fp = w.flashpoints.find((f) => f.id === "nato-ru");
    if (fp) fp.heat = 82;
    w.defcon = 3;
    w.globalRisk = 66;
    w.actors.US.alert = 4;
    w.event = {
      id: "baltics-flank",
      title: "Dual-capable in Suwałki",
      body: "NATO moved dual-capable aircraft to the Baltic flank after Kaliningrad exercises. Your General Staff wants matching generate. A notice says exercise. No notice is how a bolt reads from Warsaw.",
      actor: "US",
      heat: "high",
      ignoreLine: "POSTURE matches. DIPLOMACY asks if this is Able Archer again.",
      tags: ["nato-ru", "scenario"],
    };
    log(w, "warn", "Scenario: Baltics flank.", w.event.ignoreLine);
  }

  if (id === "nk-window-2027") {
    w.playerId = "KP";
    w.intent = "red";
    w.difficulty = "standard";
    const k = w.flashpoints.find((f) => f.id === "korea");
    if (k) k.heat = 78;
    w.globalRisk = 58;
    w.defcon = 3;
    w.event = {
      id: "nk-scenario-notam",
      title: "Your launch window",
      body: "You filed a NOTAM for a satellite test. Washington and Seoul treat it as an ICBM window. A test extracts aid and proves reliability. EMPLOY without notice is a war. DIPLOMACY buys time Beijing may not give you.",
      actor: "US",
      heat: "high",
      ignoreLine: "They generate if you test without a notice they believe.",
      tags: ["korea", "scenario"],
    };
    log(w, "info", "Scenario: DPRK launch window. You hold the initiative.", w.event.ignoreLine);
  }

  if (id === "iran-breakout-2028") {
    w.playerId = "IR";
    w.intent = "blue";
    w.difficulty = "hard";
    w.actors.IR.breakoutWeeks = 14;
    w.actors.IL.alert = 4;
    const iran = w.flashpoints.find((f) => f.id === "iran");
    if (iran) iran.heat = 80;
    w.globalRisk = 62;
    w.defcon = 3;
    w.event = {
      id: "ir-breakout-scenario",
      title: "Snap inspection refused",
      body: "IAEA wants a hall you have not declared. Israel is generating tankers. Washington is on the Swiss channel. COVERT hides cascades. DIPLOMACY buys days. HOLD lets Tel Aviv write the first draft.",
      actor: "IL",
      heat: "critical",
      ignoreLine: "Breakout is a machining problem now. Every month matters.",
      tags: ["iran", "scenario"],
    };
    log(w, "critical", "Scenario: Iran breakout clock.", w.event.ignoreLine);
  }

  if (id === "israel-preempt-2026") {
    w.playerId = "IL";
    w.intent = "blue";
    w.difficulty = "standard";
    w.actors.IR.breakoutWeeks = 10;
    w.actors.IR.hasDevice = false;
    const iran = w.flashpoints.find((f) => f.id === "iran");
    if (iran) iran.heat = 76;
    w.globalRisk = 54;
    w.event = {
      id: "il-preempt-scenario",
      title: "Begin doctrine file open",
      body: "Iran is weeks from a device. Jericho is on strip. Washington wants time. Tehran says civil fuel. EMPLOY is a preempt. HOLD is how they finish the cascade.",
      actor: "IR",
      heat: "high",
      ignoreLine: "Opacity ends the day you fire. The region knows anyway.",
      tags: ["iran", "scenario"],
    };
    log(w, "warn", "Scenario: Israel preempt hour.", w.event.ignoreLine);
  }

  if (id === "empty-quiver-2027") {
    w.playerId = "US";
    w.intent = "blue";
    w.difficulty = "extreme";
    w.turn = 6;
    w.globalRisk = 56;
    w.terrorThreat = 42;
    seedBrokenArrow(w, "US", "theft");
    w.actors.NS.hasDevice = true;
    w.event = {
      id: "eq-scenario",
      title: "Empty Quiver",
      body: "A warhead left custody during a convoy swap. HUMINT says a broker has it. NS may already be assembling. INTEL locates. COVERT recovers. HOLD is how a city learns.",
      actor: "NS",
      heat: "critical",
      ignoreLine: "There is no MAD on the other end — only a hunt.",
      tags: ["terror", "scenario"],
    };
    log(w, "critical", "Scenario: Empty Quiver.", w.event.ignoreLine);
  }

  if (id === "ukraine-tactical-2022") {
    w.playerId = "RU";
    w.intent = "blue";
    w.difficulty = "hard";
    const ukr = w.flashpoints.find((f) => f.id === "ukraine");
    if (ukr) ukr.heat = 88;
    const nato = w.flashpoints.find((f) => f.id === "nato-ru");
    if (nato) nato.heat = 74;
    w.globalRisk = 70;
    w.defcon = 2;
    w.nuclearUses.push({
      turn: 0,
      actor: "RU",
      target: "UK",
      rung: "tactical",
      yieldKt: 12,
      location: "theater (disputed, unconfirmed)",
      notified: false,
      outcome: "partial",
      arrived: 0,
    });
    w.event = {
      id: "ua-tac-rumor",
      title: "Tactical use assessment",
      body: "Allied intelligence assesses a low-yield use in theater. Moscow denies. NATO is generated. Washington wants a line. DIPLOMACY is denial or confession. POSTURE without notice is how the next pulse starts.",
      actor: "US",
      heat: "critical",
      ignoreLine: "Ambiguity is unstable. Someone will act on the worst read.",
      tags: ["ukraine", "nato-ru", "scenario"],
    };
    log(w, "critical", "Scenario: Ukraine tactical rumor.", w.event.ignoreLine);
  }

  if (id === "cartel-auction") {
    w.playerId = "US";
    w.intent = "blue";
    w.difficulty = "hard";
    w.terrorThreat = 48;
    const cartel = w.flashpoints.find((f) => f.id === "cartel");
    if (cartel) cartel.heat = 72;
    w.globalRisk = 52;
    w.event = {
      id: "cartel-auction-scenario",
      title: "Port auction",
      body: "A corrupt officer wants plaza cash for a short-range device. CR and NS are bidding. INTEL and COVERT get the object — or get rolled up. DIPLOMACY with a state is how they hunt you.",
      actor: "CR",
      heat: "critical",
      ignoreLine: "Someone else buys it if you hold.",
      tags: ["cartel", "scenario"],
    };
    log(w, "warn", "Scenario: Cartel auction.", w.event.ignoreLine);
  }

  if (id === "union-generate") {
    w.playerId = "SU";
    w.intent = "red";
    w.difficulty = "hard";
    const union = w.flashpoints.find((f) => f.id === "union");
    if (union) union.heat = 86;
    w.globalRisk = 68;
    w.defcon = 2;
    w.actors.RU.alert = 4;
    w.actors.SU.preDelegation = true;
    w.event = {
      id: "union-generate-scenario",
      title: "Kazbek vs Kremlin",
      body: "You generated a Yars regiment after Moscow called your restoration claim a coup. They say exercise. Your General Staff says the silos are Soviet. Two notices cannot share one door.",
      actor: "RU",
      heat: "critical",
      ignoreLine: "Crews will eventually pick a human. Perimeter may not wait.",
      tags: ["union", "scenario"],
    };
    log(w, "critical", "Scenario: Union generate.", w.event.ignoreLine);
  }

  return w;
}

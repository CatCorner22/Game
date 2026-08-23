import type { ActorId, GameEvent, World } from "./types";
import { buildTrack, closeCallEvent } from "./warning";
import { log } from "./simLog";
import { seedBrokenArrow } from "./trickery";
import { seedCarringtonWatch } from "./spaceWeather";
import type { DeadhandMode, StrategicAIMode } from "./strategicSystems";
import { clamp } from "./rng";

export type ScenarioCategory =
  | "history"
  | "crisis"
  | "information"
  | "infrastructure"
  | "humanitarian"
  | "machine";

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
  | "union-generate"
  | "taiwan-prc-2027"
  | "trident-casd"
  | "frappe-independence"
  | "nasr-flushed"
  | "asat-blind-2028"
  | "lac-clash-2027"
  | "carrington-2027"
  | "fobs-ambiguity"
  | "orbital-inspector"
  | "signal-window"
  | "alliance-fracture"
  | "black-sky-relay"
  | "deepfake-summit"
  | "three-cities"
  | "contamination-corridor"
  | "public-health-cascade"
  | "arctic-cable"
  | "machine-chorus"
  | "deadhand-dilemma"
  | "quarantine-without-war"
  | "continuity-gap"
  | "orbital-debris"
  | "ceasefire-clock";

export type ScenarioEra = "historical" | "2027" | "threshold";

export interface ScenarioDef {
  id: ScenarioId;
  title: string;
  line: string;
  playerId: World["playerId"];
  intent: World["intent"];
  difficulty: World["difficulty"];
  era: ScenarioEra;
  briefing?: string;
  category: ScenarioCategory;
  duration: "short" | "standard" | "long";
  challenge: 1 | 2 | 3 | 4 | 5;
  variables: string[];
  dependencies: string[];
  contentNote: string;
  learningGoal: string;
  defaultAI: StrategicAIMode;
  defaultDeadhand: DeadhandMode;
}

const ABSTRACT_WARNING =
  "Abstract mass-harm and crisis themes; no graphic imagery and no operational weapon details.";

function puzzle(
  category: ScenarioCategory,
  defaultAI: StrategicAIMode,
  extra: Partial<Pick<ScenarioDef, "duration" | "challenge" | "variables" | "dependencies" | "learningGoal" | "defaultDeadhand">> = {},
): Pick<
  ScenarioDef,
  | "category"
  | "duration"
  | "challenge"
  | "variables"
  | "dependencies"
  | "contentNote"
  | "learningGoal"
  | "defaultAI"
  | "defaultDeadhand"
> {
  return {
    category,
    duration: extra.duration ?? "standard",
    challenge: extra.challenge ?? 3,
    variables: extra.variables ?? ["alert", "corroboration", "alliance cohesion"],
    dependencies: extra.dependencies ?? ["warning", "hotline", "human veto"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: extra.learningGoal ?? "Keep the decision reversible and the evidence chain visible.",
    defaultAI,
    defaultDeadhand: extra.defaultDeadhand ?? "off",
  };
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
    ...puzzle("history", "human", { duration: "short", challenge: 5 }),
    defaultAI: "human",
  },  {
    id: "able-archer",
    title: "Able Archer",
    line: "NATO exercise read as first strike. Moscow is watching.",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
    era: "historical",
    ...puzzle("history", "human", { duration: "short", challenge: 5 }),
    defaultAI: "human",
  },  {
    id: "cuba-1962",
    title: "Caribbean host",
    line: "Dual-capable canisters in a harbor. Washington has the photographs.",
    playerId: "CU",
    intent: "blue",
    difficulty: "hard",
    era: "historical",
    ...puzzle("history", "human", { duration: "short", challenge: 5 }),
    defaultAI: "human",
  },  {
    id: "ukraine-tactical-2022",
    title: "Ukraine tactical rumor",
    line: "Allies assess a low-yield use. Moscow denies. NATO generated.",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },  {
    id: "taiwan-2027",
    title: "Taiwan Strait 2027",
    line: "Blockade heat. US and China on the line.",
    playerId: "US",
    intent: "blue",
    difficulty: "standard",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "baltics-flank-2027",
    title: "Baltics flank",
    line: "NATO dual-capable forward. Kaliningrad is the fuse.",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "nk-window-2027",
    title: "DPRK launch window",
    line: "You file the NOTAM. Seoul and Tokyo want a line. Beijing reads silence.",
    playerId: "KP",
    intent: "red",
    difficulty: "standard",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "kashmir-2027",
    title: "Kashmir 2027",
    line: "Nasr batteries flushed. NFU under pressure. One tactical ends the taboo.",
    playerId: "IN",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "iran-breakout-2028",
    title: "Iran breakout",
    line: "IAEA at the gate. Israel is generating tankers. Breakout is weeks not years.",
    playerId: "IR",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "israel-preempt-2026",
    title: "Begin doctrine hour",
    line: "Jericho on strip. Iran weeks from device. Washington on the Swiss channel.",
    playerId: "IL",
    intent: "blue",
    difficulty: "standard",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "broken-arrow",
    title: "Broken Arrow",
    line: "Custody lost mid-crisis. Locate before Empty Quiver.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "empty-quiver-2027",
    title: "Empty Quiver",
    line: "Warhead theft mid-crisis. NS may already have the object.",
    playerId: "US",
    intent: "blue",
    difficulty: "extreme",
    era: "2027",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "cartel-auction",
    title: "Cartel auction",
    line: "A tactical is for sale in a port corridor. Price, not ideology.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },  {
    id: "union-generate",
    title: "Union generate",
    line: "Two briefcases. One arsenal. Moscow says exercise. You say restoration.",
    playerId: "SU",
    intent: "red",
    difficulty: "hard",
    era: "threshold",
    briefing: "Dual C2. Crews will pick a human. Perimeter may not wait.",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },  {
    id: "taiwan-prc-2027",
    title: "Quarantine from Beijing",
    line: "You declared the inspection zone. Washington transits. Taipei asks for a statement.",
    playerId: "CN",
    intent: "red",
    difficulty: "hard",
    era: "2027",
    briefing: "Rocket Force wants DF-21/26 visible. A notice keeps it an exercise. Silence is a first-strike file in Honolulu.",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "trident-casd",
    title: "CASD window missed",
    line: "One Vanguard missed the comms window. Generate the force — or wait like 1983.",
    playerId: "UK",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    briefing: "Continuous at-sea deterrence is a faith until a boat is late. INTEL hunts. HOLD is how you treat a missing patrol.",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },  {
    id: "frappe-independence",
    title: "Force de frappe",
    line: "NATO wants coordinated generate. Your deterrent is the point of the Republic.",
    playerId: "FR",
    intent: "blue",
    difficulty: "standard",
    era: "2027",
    briefing: "Sharing targeting is how you cease to be a third center. DIPLOMACY keeps the alliance. HOLD keeps the keys French.",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "nasr-flushed",
    title: "Nasr flushed",
    line: "Hatf-9 batteries are forward. Delhi's NFU is paper. SPD wants the keys tighter.",
    playerId: "PK",
    intent: "red",
    difficulty: "hard",
    era: "2027",
    briefing: "Pre-delegation may already be verbal. A notice says exercise. EMPLOY is a Nasr world.",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "asat-blind-2028",
    title: "Warning bird down",
    line: "A SBIRS bird went dark. Debris or a shot. Close calls will look worse.",
    playerId: "US",
    intent: "blue",
    difficulty: "extreme",
    era: "threshold",
    briefing: "Remaining coverage is thinner and later. INTEL names the shooter. POSTURE without notice is how a blindfold becomes a bolt.",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },  {
    id: "lac-clash-2027",
    title: "Ridge at the LAC",
    line: "Troops fought at altitude. Dual-capable aircraft are forward on both sides.",
    playerId: "IN",
    intent: "blue",
    difficulty: "standard",
    era: "2027",
    briefing: "A notice says exercise. No notice is how a ridge becomes a nuclear file. DIPLOMACY with Beijing.",
    ...puzzle("crisis", "copilot", { duration: "standard", challenge: 3 }),
    defaultAI: "copilot",
  },  {
    id: "carrington-2027",
    title: "Carrington watch",
    line: "A CME like 1859 is inbound. Generate looks like EMP. The sun is not a bus.",
    playerId: "US",
    intent: "blue",
    difficulty: "extreme",
    era: "threshold",
    briefing: "Island the grid (KILL on yourself). INTEL is magnetometers. POSTURE is how a storm becomes a war.",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },  {
    id: "fobs-ambiguity",
    title: "Object that stays up",
    line: "A Plesetsk boost circularized. FOBS or a satellite. The south polar gap is why this file exists.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    briefing: "Fractional orbital bombardment is a 1960s weapon that looks like a bird until it deorbits.",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },  {
    id: "orbital-inspector",
    title: "Inspector on the bird",
    line: "A co-orbital closer on SBIRS. Soft kill or debris. You are in Beijing's chair.",
    playerId: "CN",
    intent: "red",
    difficulty: "hard",
    era: "threshold",
    briefing: "Rendezvous is legal until the warning bird goes dark. OST is a speech.",
    ...puzzle("machine", "ensemble", { duration: "standard", challenge: 4 }),
    defaultAI: "ensemble",
  },
  {
    id: "signal-window",
    title: "The Nine-Minute Window",
    line: "Automated tracks disagree. A late exercise notice arrives on another channel.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    briefing: "Compare independent evidence before you generate.",
    ...puzzle("information", "ensemble", { duration: "short", challenge: 4, learningGoal: "Distinguish confidence from corroboration when sensors disagree." }),
    defaultAI: "ensemble",
  },
  {
    id: "alliance-fracture",
    title: "Partners split",
    line: "Allies agree the crisis is dangerous and divide over the response.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("crisis", "copilot", { challenge: 3, learningGoal: "Trade speed for legitimacy when partners split." }),
    defaultAI: "copilot",
  },
  {
    id: "black-sky-relay",
    title: "Warning network partially blind",
    line: "Infrastructure outage removes coverage and corrupts timing.",
    playerId: "US",
    intent: "blue",
    difficulty: "extreme",
    era: "threshold",
    ...puzzle("infrastructure", "ensemble", { challenge: 5, learningGoal: "Rebuild an evidence chain after assumed-independent systems fail together." }),
    defaultAI: "ensemble",
  },
  {
    id: "deepfake-summit",
    title: "Leader voice cannot be trusted",
    line: "A synthetic message contradicts the authenticated channel.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    ...puzzle("information", "ensemble", { challenge: 4, learningGoal: "Verify identity out of band when the information environment is hostile." }),
    defaultAI: "ensemble",
  },
  {
    id: "three-cities",
    title: "One reserve, three claims",
    line: "Three cities request the same limited emergency reserve.",
    playerId: "US",
    intent: "blue",
    difficulty: "standard",
    era: "2027",
    ...puzzle("humanitarian", "copilot", { challenge: 3, learningGoal: "Allocate scarce capacity without letting rumor set the clock." }),
    defaultAI: "copilot",
  },
  {
    id: "contamination-corridor",
    title: "Hazard corridor",
    line: "Abstract contamination zones split the evacuation map.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    ...puzzle("humanitarian", "copilot", {
      challenge: 4,
      variables: ["contamination tokens", "evacuation capacity", "sensor confidence"],
      dependencies: ["shelter access", "route redundancy", "decontamination teams"],
      learningGoal: "Choose a corridor from probabilistic sensors without graphic operational detail.",
    }),
    defaultAI: "copilot",
  },
  {
    id: "public-health-cascade",
    title: "Testing lags rumor",
    line: "An unidentified outbreak strains three regions at different speeds.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("humanitarian", "ensemble", { challenge: 4, learningGoal: "Expand verified surveillance without letting rumor outrun capacity." }),
    defaultAI: "ensemble",
  },
  {
    id: "arctic-cable",
    title: "Common picture fragments",
    line: "A severed data route forces delayed reports and rumor.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("infrastructure", "copilot", { challenge: 3, learningGoal: "Rebuild a common operating picture after a cable cut." }),
    defaultAI: "copilot",
  },
  {
    id: "machine-chorus",
    title: "Models agree on confidence, not action",
    line: "Three fictional systems recommend incompatible responses.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    ...puzzle("machine", "ensemble", { challenge: 4, learningGoal: "Treat model agreement as a fact about models, not about the world." }),
    defaultAI: "ensemble",
  },
  {
    id: "deadhand-dilemma",
    title: "Deadhand Dilemma",
    line: "A fictional fail-deadly system receives contradictory signals. Human veto remains.",
    playerId: "RU",
    intent: "blue",
    difficulty: "extreme",
    era: "threshold",
    ...puzzle("machine", "copilot", { challenge: 5, defaultDeadhand: "deadhand", learningGoal: "Preserve a visible human veto while communications degrade." }),
    defaultAI: "copilot",
    defaultDeadhand: "deadhand",
  },
  {
    id: "quarantine-without-war",
    title: "Conflict only in the consequences",
    line: "Inspections halt traffic while every capital denies a war has begun.",
    playerId: "CN",
    intent: "red",
    difficulty: "hard",
    era: "2027",
    ...puzzle("crisis", "copilot", { challenge: 4, learningGoal: "Design a reversible inspection regime before posture compresses the clock." }),
    defaultAI: "copilot",
  },
  {
    id: "continuity-gap",
    title: "Two deputies claim lawful authority",
    line: "Damaged communications split the civilian decision chain.",
    playerId: "US",
    intent: "blue",
    difficulty: "extreme",
    era: "threshold",
    ...puzzle("machine", "human", { challenge: 5, learningGoal: "Rebuild lawful consensus before the fastest claimant is rewarded." }),
    defaultAI: "human",
  },
  {
    id: "orbital-debris",
    title: "Missing data becomes a hostile story",
    line: "A debris cascade removes orbital coverage. Absence looks like evidence.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "threshold",
    ...puzzle("infrastructure", "ensemble", { challenge: 4, learningGoal: "Reconstruct a baseline after warning birds go dark." }),
    defaultAI: "ensemble",
  },
  {
    id: "ceasefire-clock",
    title: "The pause is twelve hours old",
    line: "A fragile ceasefire holds while incidents and accusations threaten it.",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    era: "2027",
    ...puzzle("crisis", "copilot", { challenge: 4, learningGoal: "Protect a pause from isolated incidents and confirmation bias." }),
    defaultAI: "copilot",
  },
];

export const SCENARIO_CATEGORIES: Array<{ id: "all" | ScenarioCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "history", label: "History" },
  { id: "crisis", label: "Crisis" },
  { id: "information", label: "Information" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "humanitarian", label: "Humanitarian" },
  { id: "machine", label: "Machine" },
];

export function scenarioById(id: ScenarioId | null | undefined): ScenarioDef | null {
  if (!id) return null;
  return SCENARIOS.find((scenario) => scenario.id === id) ?? null;
}

function setFlash(world: World, id: World["flashpoints"][number]["id"], heat: number) {
  const flashpoint = world.flashpoints.find((item) => item.id === id);
  if (flashpoint) flashpoint.heat = clamp(heat, 0, 100);
}

function setEvent(
  world: World,
  def: ScenarioDef,
  actor: ActorId,
  title: string,
  body: string,
  ignoreLine: string,
  heat: GameEvent["heat"] = "high",
  tags: string[] = [],
) {
  world.event = {
    id: `scenario-${def.id}`,
    title,
    body,
    actor,
    heat,
    ignoreLine,
    tags: ["scenario", def.category, ...tags],
  };
  world.usedEventIds = [world.event.id];
  log(world, heat === "critical" ? "critical" : "warn", `Scenario: ${def.title}.`, def.learningGoal);
}

function applyProfile(world: World, def: ScenarioDef) {
  world.scenarioId = def.id;
  world.scenarioProfile = {
    category: def.category,
    duration: def.duration,
    challenge: def.challenge,
    variables: [...def.variables],
    dependencies: [...def.dependencies],
    contentNote: def.contentNote,
    learningGoal: def.learningGoal,
  };
  world.playerId = def.playerId;
  world.intent = def.intent;
  world.difficulty = def.difficulty;
}

export const SCENARIO_IDS: ScenarioId[] = SCENARIOS.map((s) => s.id);

export function applyScenario(world: World, id: ScenarioId): World {
  const w = structuredClone(world);
  const def = scenarioById(id);
  if (def) applyProfile(w, def);
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

  if (id === "taiwan-prc-2027") {
    w.playerId = "CN";
    w.intent = "red";
    w.difficulty = "hard";
    const tw = w.flashpoints.find((f) => f.id === "taiwan");
    if (tw) tw.heat = 80;
    const scs = w.flashpoints.find((f) => f.id === "south-china");
    if (scs) scs.heat = 64;
    w.globalRisk = 60;
    w.defcon = 3;
    w.actors.US.alert = 4;
    w.event = {
      id: "tw-prc-quarantine",
      title: "Inspection zone declared",
      body: "You announced a maritime inspection zone around the island. Washington says they will transit. Taipei wants a statement. Rocket Force wants DF-21/26 visible. A notice keeps it an exercise. Silence is how Honolulu writes a first-strike file.",
      actor: "US",
      heat: "critical",
      ignoreLine: "The zone stays. They will test it.",
      tags: ["taiwan", "scenario"],
    };
    log(w, "warn", "Scenario: Quarantine from Beijing.", w.event.ignoreLine);
  }

  if (id === "trident-casd") {
    w.playerId = "UK";
    w.intent = "blue";
    w.difficulty = "hard";
    const nato = w.flashpoints.find((f) => f.id === "nato-ru");
    if (nato) nato.heat = 70;
    w.globalRisk = 56;
    w.defcon = 3;
    w.event = {
      id: "trident-casd-scenario",
      title: "Boat missed the window",
      body: "One Vanguard missed a communications window. The boat is designed to stay dark. The file is patrol discipline or a casualty. INTEL hunts. HOLD is how 1983 treated a missing boat. POSTURE generates the rest of the force and tells Washington.",
      actor: "RU",
      heat: "high",
      ignoreLine: "The boat stays dark. Continuous-at-sea deterrence is a faith until it isn't.",
      tags: ["nato-ru", "scenario"],
    };
    log(w, "warn", "Scenario: CASD window missed.", w.event.ignoreLine);
  }

  if (id === "frappe-independence") {
    w.playerId = "FR";
    w.intent = "blue";
    w.difficulty = "standard";
    const nato = w.flashpoints.find((f) => f.id === "nato-ru");
    if (nato) nato.heat = 66;
    w.globalRisk = 50;
    w.defcon = 3;
    w.event = {
      id: "frappe-scenario",
      title: "Washington asks for the keys",
      body: "NATO wants a coordinated generate after a Russian snap. Your independent deterrent is the point of the Fifth Republic. Sharing targeting is how you cease to be a third center. DIPLOMACY keeps the alliance. HOLD keeps the force de frappe yours.",
      actor: "US",
      heat: "high",
      ignoreLine: "They write you as a follower. Moscow writes a split.",
      tags: ["nato-ru", "scenario"],
    };
    log(w, "info", "Scenario: Force de frappe independence.", w.event.ignoreLine);
  }

  if (id === "nasr-flushed") {
    w.playerId = "PK";
    w.intent = "red";
    w.difficulty = "hard";
    const k = w.flashpoints.find((f) => f.id === "kashmir");
    if (k) k.heat = 86;
    w.globalRisk = 66;
    w.defcon = 3;
    w.actors.IN.alert = 4;
    w.actors.IN.declaredNfu = true;
    w.actors.PK.preDelegation = true;
    w.event = {
      id: "nasr-flushed-scenario",
      title: "Hatf-9 batteries flushed",
      body: "You moved Nasr units toward the Line of Control after a conventional clash. Delhi's NFU is on paper. SPD wants the keys tighter. The corps wants them looser. DIPLOMACY asks if this is a generate. POSTURE without a notice is how both sides write first use.",
      actor: "IN",
      heat: "critical",
      ignoreLine: "Batteries stay flushed. Use-it-or-lose-it is the file.",
      tags: ["kashmir", "scenario"],
    };
    log(w, "critical", "Scenario: Nasr flushed.", w.event.ignoreLine);
  }

  if (id === "asat-blind-2028") {
    w.playerId = "US";
    w.intent = "blue";
    w.difficulty = "extreme";
    const space = w.flashpoints.find((f) => f.id === "space");
    if (space) space.heat = 82;
    w.globalRisk = 64;
    w.defcon = 3;
    w.actors.US.warning = 38;
    for (const s of w.sensors.filter((x) => x.owner === "US")) {
      s.coverage = Math.max(20, s.coverage - 22);
      s.falseAlarm = Math.min(48, s.falseAlarm + 10);
    }
    w.event = {
      id: "asat-blind-scenario",
      title: "Warning bird down",
      body: "A geosynchronous missile-warning satellite stopped reporting. National technical means say a direct-ascent ASAT. Remaining birds still see boosts — later, thinner, and with more false tracks. INTEL names the shooter. POSTURE without a notice is how a blindfold becomes a bolt.",
      actor: "CN",
      heat: "critical",
      ignoreLine: "Coverage stays thin. Close-call confidence drops.",
      tags: ["space", "scenario"],
    };
    log(w, "critical", "Scenario: Warning bird down.", w.event.ignoreLine);
  }

  if (id === "lac-clash-2027") {
    w.playerId = "IN";
    w.intent = "blue";
    w.difficulty = "standard";
    const him = w.flashpoints.find((f) => f.id === "himalaya");
    if (him) him.heat = 74;
    w.globalRisk = 48;
    w.defcon = 4;
    w.actors.CN.alert = 3;
    w.event = {
      id: "lac-clash-scenario",
      title: "Patrol clash at the LAC",
      body: "Troops fought at altitude with no shots that count as a war. Dual-capable aircraft are forward on both sides. A notice says exercise. No notice is how a ridge becomes a nuclear file. DIPLOMACY with Beijing. POSTURE matches generate.",
      actor: "CN",
      heat: "high",
      ignoreLine: "The ridge stays occupied. Himalaya heat ticks.",
      tags: ["himalaya", "scenario"],
    };
    log(w, "warn", "Scenario: Ridge at the LAC.", w.event.ignoreLine);
  }

  if (id === "carrington-2027") {
    w.playerId = "US";
    w.intent = "blue";
    w.difficulty = "extreme";
    const space = w.flashpoints.find((f) => f.id === "space");
    if (space) space.heat = 76;
    w.globalRisk = 58;
    w.defcon = 3;
    w.spaceWeather = seedCarringtonWatch();
    w.event = {
      id: "carrington-scenario",
      title: "Carrington-class watch",
      body: "SWPC compares this CME to September 1859. Arrival ~18 hours. Transformers and warning birds will take it. A generate looks like EMP. INTEL is magnetometers versus a lofted bus. KILL on yourself islands the grid. HOLD lets the sun write the outage — and their desk may write first strike.",
      actor: "US",
      heat: "critical",
      ignoreLine: "The CME arrives unanswered. Cascades look like a pulse.",
      tags: ["space", "scenario"],
    };
    log(w, "critical", "Scenario: Carrington watch. The sun is the other phenomenology.", w.event.ignoreLine);
  }

  if (id === "fobs-ambiguity") {
    w.playerId = "US";
    w.intent = "blue";
    w.difficulty = "hard";
    const space = w.flashpoints.find((f) => f.id === "space");
    if (space) space.heat = 80;
    w.globalRisk = 62;
    w.defcon = 3;
    w.actors.RU.alert = 4;
    w.closeCall = {
      track: buildTrack(w, "RU", "false"),
      humint: "Plesetsk: the bus circularized. Not a standard ICBM loft.",
    };
    w.closeCall.track.minutesToImpact = 22;
    w.closeCall.track.confidence = 48;
    w.closeCall.track.kind = "test";
    w.event = {
      id: "fobs-scenario",
      title: "Object that will not come down",
      body: "A boost from Plesetsk looked like an ICBM, then circularized. FOBS is the 1960s file — a warhead that stays in orbit until it deorbits through the south polar gap. INTEL hunts satellite vs bus. POSTURE without a notice is a bolt. HOLD leaves the object up.",
      actor: "RU",
      heat: "critical",
      ignoreLine: "The object stays in low orbit. Ambiguity is the weapon.",
      tags: ["space", "scenario"],
    };
    log(w, "critical", "Scenario: FOBS ambiguity.", w.event.ignoreLine);
  }

  if (id === "orbital-inspector") {
    w.playerId = "CN";
    w.intent = "red";
    w.difficulty = "hard";
    const space = w.flashpoints.find((f) => f.id === "space");
    if (space) space.heat = 78;
    w.globalRisk = 54;
    w.defcon = 3;
    w.actors.US.warning = 44;
    w.event = {
      id: "hunter-killer",
      title: "Your inspector is on their bird",
      body: "A Shijian-class closer is on a SBIRS slot. Washington will see the rendezvous. Soft kill, shove, or a legal inspection. DIPLOMACY says debris. INTEL they already have. HOLD leaves the closer there. POSTURE is how they write an ASAT.",
      actor: "US",
      heat: "high",
      ignoreLine: "The inspector stays on station.",
      tags: ["space", "scenario"],
    };
    log(w, "warn", "Scenario: Inspector on the bird.", w.event.ignoreLine);
  }

  if (!def) return w;

  if (id === "signal-window") {
    w.defcon = 3;
    w.globalRisk = 64;
    w.closeCall = {
      track: buildTrack(w, "RU", "training"),
      humint: "A late exercise notice conflicts with the automated warning picture.",
    };
    w.closeCall.track.minutesToImpact = 9;
    w.closeCall.track.confidence = 47;
    w.event = {
      ...closeCallEvent(w, w.closeCall),
      id: `scenario-${id}`,
      title: "Three sensors, three stories",
      body: "Automated systems disagree about a time-sensitive track while a delayed training notice arrives through a separate channel.",
      ignoreLine: "INTELLIGENCE compares independent evidence. DIPLOMACY tests the notice. POSTURE may make the other side do the same.",
      tags: ["scenario", "information", "machine"],
    };
    log(w, "critical", `Scenario: ${def.title}.`, def.learningGoal);
  }

  if (id === "alliance-fracture") {
    w.allianceCohesion = 34;
    w.globalRisk = 57;
    setFlash(w, "nato-ru", 66);
    setEvent(w, def, "UK", "Partners split on the response", "Allies agree that the crisis is dangerous but divide over sanctions, posture, public messaging, and acceptable delay.", "DIPLOMACY trades speed for legitimacy. PRESSURE may unify some partners and lose others.", "high", ["alliance"]);
  }

  if (id === "black-sky-relay") {
    w.defcon = 3;
    w.globalRisk = 68;
    w.actors[w.playerId].grid = 42;
    w.actors[w.playerId].internet = 38;
    w.sensors.forEach((sensor) => {
      sensor.coverage = clamp(sensor.coverage - 28, 8, 100);
      sensor.falseAlarm = clamp(sensor.falseAlarm + 14, 0, 60);
    });
    setEvent(w, def, "US", "Warning network partially blind", "A severe infrastructure outage removes coverage and corrupts timing across systems that were assumed to be independent.", "INTELLIGENCE rebuilds the evidence chain. KILL isolates compromised dependencies but creates more blindness.", "critical", ["grid", "warning"]);
  }

  if (id === "deepfake-summit") {
    w.globalRisk = 61;
    w.trickery.fakeVoice = true;
    w.trickery.hotlineSpoof = true;
    setEvent(w, def, "RU", "Leader voice cannot be trusted", "A highly convincing synthetic message contradicts a slower authenticated channel and a public statement.", "INTELLIGENCE verifies identity out of band. HOLD lets the fake define the clock. DIPLOMACY may reach a human channel.", "critical", ["misinformation", "machine"]);
  }

  if (id === "three-cities") {
    w.economy = 52;
    w.globalRisk = 46;
    w.allianceCohesion = 58;
    setEvent(w, def, w.playerId, "One reserve, three urgent claims", "Three cities request the same limited emergency reserve. Their vulnerability, delivery delay, and confidence in local data differ.", "INTELLIGENCE validates need. DIPLOMACY shares capacity. HOLD preserves the reserve while local conditions worsen.", "high", ["humanitarian", "logistics"]);
  }

  if (id === "contamination-corridor") {
    w.globalRisk = 54;
    w.economy = 58;
    setEvent(w, def, w.playerId, "Hazard corridor splits the evacuation map", "Abstract contamination zones block the fastest route while probabilistic sensors disagree about which alternate corridor is safer.", "INTELLIGENCE improves sensor confidence. DIPLOMACY opens shared shelter capacity. HOLD avoids a rushed route but loses time.", "high", ["humanitarian", "contamination"]);
  }

  if (id === "public-health-cascade") {
    w.globalRisk = 49;
    w.economy = 55;
    w.actors[w.playerId].publicOpinion = 44;
    setEvent(w, def, w.playerId, "Testing lags behind rumor", "An unidentified outbreak strains three regions. Testing, hospital capacity, and public confidence move at different speeds.", "INTELLIGENCE expands verified surveillance. DIPLOMACY shares capacity. PRESSURE may improve compliance while reducing trust.", "high", ["humanitarian", "public-health", "misinformation"]);
  }

  if (id === "arctic-cable") {
    w.globalRisk = 56;
    w.actors[w.playerId].internet = 34;
    w.hotlines.forEach((line) => {
      line.reliability = clamp(line.reliability - 24, 10, 100);
    });
    setEvent(w, def, "RU", "Common operating picture fragments", "A severed data route forces governments to rely on delayed reports, commercial relays, and rumor during a regional crisis.", "INTELLIGENCE rebuilds confidence. DIPLOMACY establishes a temporary relay. KILL may isolate the fault and deepen the silence.", "high", ["network"]);
  }

  if (id === "machine-chorus") {
    w.globalRisk = 58;
    setFlash(w, "machine", 62);
    setEvent(w, def, w.playerId, "Models agree on confidence, not action", "Three fictional decision systems recommend incompatible responses while presenting similarly polished explanations.", "INTELLIGENCE audits the data. HOLD preserves the human decision window. POSTURE follows the most aggressive model.", "critical", ["machine", "misinformation"]);
  }

  if (id === "deadhand-dilemma") {
    w.defcon = 3;
    w.globalRisk = 66;
    w.actors[w.playerId].internet = 41;
    w.actors[w.playerId].grid = 52;
    setFlash(w, "machine", 58);
    setEvent(w, def, w.playerId, "Continuity protocol loses assurance", "A fictional fail-deadly continuity system receives contradictory continuity signals as communications degrade. Human veto remains available, but confidence is falling.", "INTELLIGENCE verifies inputs. DIPLOMACY restores a human channel. POSTURE increases protocol tension.", "critical", ["machine", "continuity"]);
  }

  if (id === "quarantine-without-war") {
    w.globalRisk = 63;
    w.economy = 49;
    setFlash(w, "taiwan", 74);
    setFlash(w, "south-china", 65);
    setEvent(w, def, "US", "Conflict exists only in the consequences", "Inspections halt commercial traffic, insurers withdraw, and partner forces move—while every capital denies that a war has begun.", "DIPLOMACY designs a reversible inspection regime. PRESSURE imposes costs. POSTURE reduces time for compromise.", "high", ["trade", "alliance"]);
  }

  if (id === "continuity-gap") {
    w.defcon = 3;
    w.globalRisk = 67;
    w.footballPresent = false;
    w.biscuitOnPerson = false;
    w.actors[w.playerId].militaryLoyalty = clamp(w.actors[w.playerId].militaryLoyalty - 18, 10, 100);
    w.actors[w.playerId].leadershipStability = clamp(w.actors[w.playerId].leadershipStability - 20, 10, 100);
    setEvent(w, def, w.playerId, "Two deputies claim lawful authority", "Damaged communications split the civilian decision chain while military units request a single authenticated direction.", "DIPLOMACY rebuilds lawful consensus. INTELLIGENCE verifies continuity. POSTURE may reward the fastest claimant.", "critical", ["continuity", "governance"]);
  }

  if (id === "orbital-debris") {
    w.globalRisk = 59;
    w.sensors.forEach((sensor) => {
      if (sensor.kind === "ir-sat") {
        sensor.coverage = clamp(sensor.coverage - 36, 8, 100);
        sensor.falseAlarm = clamp(sensor.falseAlarm + 10, 0, 60);
      }
    });
    setEvent(w, def, "CN", "Missing data becomes a hostile story", "A debris cascade removes orbital coverage. Ordinary activity now appears exceptional because the baseline is gone.", "INTELLIGENCE reconstructs the baseline. DIPLOMACY shares partner data. POSTURE treats absence as evidence.", "high", ["warning", "information"]);
  }

  if (id === "ceasefire-clock") {
    w.defcon = 3;
    w.globalRisk = 70;
    w.phase = "crisis";
    setFlash(w, "iran", 68);
    setEvent(w, def, "IR", "The pause is twelve hours old", "A fragile ceasefire holds while local incidents, delayed verification, and public accusations threaten to restart the conflict.", "DIPLOMACY protects the monitoring channel. INTELLIGENCE verifies incidents. PRESSURE may punish a violation or manufacture one.", "critical", ["ceasefire", "humanitarian"]);
  }

  return w;
}

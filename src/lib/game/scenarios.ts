import type { ActorId, GameEvent, World } from "./types";
import { buildTrack, closeCallEvent } from "./warning";
import { log } from "./simLog";
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
  | "taiwan-2027"
  | "broken-arrow"
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

export interface ScenarioDef {
  id: ScenarioId;
  title: string;
  line: string;
  category: ScenarioCategory;
  playerId: World["playerId"];
  intent: World["intent"];
  difficulty: World["difficulty"];
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

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "petrov-1983",
    title: "Signal at Serpukhov",
    line: "A historical false-alarm analogue. One report, weak corroboration, almost no time.",
    category: "history",
    playerId: "RU",
    intent: "blue",
    difficulty: "extreme",
    duration: "short",
    challenge: 5,
    variables: ["sensor confidence", "time pressure", "officer dissent"],
    dependencies: ["independent confirmation", "human veto", "command trust"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Distinguish confidence from corroboration under extreme pressure.",
    defaultAI: "human",
    defaultDeadhand: "off",
  },
  {
    id: "able-archer",
    title: "Exercise or Opening Move?",
    line: "A historical crisis analogue in which realistic training is read as preparation for war.",
    category: "history",
    playerId: "RU",
    intent: "blue",
    difficulty: "hard",
    duration: "short",
    challenge: 4,
    variables: ["exercise realism", "warning posture", "political context"],
    dependencies: ["hotline reliability", "allied signaling", "analyst dissent"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Manage reciprocal fear without rewarding worst-case assumptions.",
    defaultAI: "human",
    defaultDeadhand: "guarded",
  },
  {
    id: "taiwan-2027",
    title: "Strait Without a Shot",
    line: "A fictional quarantine creates economic, alliance, and escalation puzzles at once.",
    category: "crisis",
    playerId: "US",
    intent: "blue",
    difficulty: "standard",
    duration: "standard",
    challenge: 3,
    variables: ["commercial traffic", "alliance cohesion", "dual-use ambiguity"],
    dependencies: ["regional partners", "communications", "economic resilience"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Create off-ramps while protecting partners and avoiding accidental escalation.",
    defaultAI: "copilot",
    defaultDeadhand: "off",
  },
  {
    id: "broken-arrow",
    title: "Lost Custody",
    line: "A fictional custody failure becomes a race among recovery, secrecy, and public trust.",
    category: "crisis",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    duration: "short",
    challenge: 4,
    variables: ["search confidence", "public trust", "foreign observation"],
    dependencies: ["local responders", "chain of custody", "credible disclosure"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Balance fast recovery with trustworthy communication.",
    defaultAI: "copilot",
    defaultDeadhand: "off",
  },
  {
    id: "signal-window",
    title: "The Nine-Minute Window",
    line: "Three sensors disagree while a training notice arrives late.",
    category: "information",
    playerId: "UK",
    intent: "blue",
    difficulty: "hard",
    duration: "short",
    challenge: 4,
    variables: ["sensor disagreement", "late notice", "decision clock"],
    dependencies: ["cross-checking", "hotline access", "human dissent"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Build an evidence ladder instead of averaging incompatible reports.",
    defaultAI: "ensemble",
    defaultDeadhand: "guarded",
  },
  {
    id: "alliance-fracture",
    title: "The Alliance Fractures",
    line: "Partners agree on the danger and disagree on every acceptable response.",
    category: "crisis",
    playerId: "FR",
    intent: "blue",
    difficulty: "hard",
    duration: "standard",
    challenge: 4,
    variables: ["partner confidence", "domestic politics", "burden sharing"],
    dependencies: ["consultation speed", "credible restraint", "shared intelligence"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Preserve coalition legitimacy while keeping decisions reversible.",
    defaultAI: "copilot",
    defaultDeadhand: "off",
  },
  {
    id: "black-sky-relay",
    title: "Black Sky Relay",
    line: "Early-warning feeds degrade during a severe communications outage.",
    category: "infrastructure",
    playerId: "CN",
    intent: "blue",
    difficulty: "extreme",
    duration: "short",
    challenge: 5,
    variables: ["coverage gaps", "false positives", "grid stability"],
    dependencies: ["backup communications", "manual review", "cross-border notice"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Choose what to trust when every information channel shares a dependency.",
    defaultAI: "ensemble",
    defaultDeadhand: "guarded",
  },
  {
    id: "deepfake-summit",
    title: "The Voice on the Line",
    line: "A convincing synthetic leader message contradicts the dedicated human channel.",
    category: "information",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    duration: "short",
    challenge: 4,
    variables: ["identity confidence", "message timing", "media pressure"],
    dependencies: ["out-of-band verification", "trusted staff", "public communication"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Verify identity and intent without treating realism as proof.",
    defaultAI: "ensemble",
    defaultDeadhand: "off",
  },
  {
    id: "three-cities",
    title: "Three Cities, One Reserve",
    line: "Allocate one emergency reserve across three cities with incompatible needs.",
    category: "humanitarian",
    playerId: "US",
    intent: "blue",
    difficulty: "standard",
    duration: "short",
    challenge: 3,
    variables: ["population vulnerability", "delivery delay", "public trust"],
    dependencies: ["transport capacity", "local hospitals", "transparent criteria"],
    contentNote: "Abstract emergency-allocation themes; no graphic descriptions.",
    learningGoal: "Make an equitable allocation under uncertainty and explain the tradeoff.",
    defaultAI: "copilot",
    defaultDeadhand: "off",
  },
  {
    id: "contamination-corridor",
    title: "Contamination Corridor",
    line: "Abstract hazard zones split an evacuation route while sensor confidence keeps changing.",
    category: "humanitarian",
    playerId: "FR",
    intent: "blue",
    difficulty: "hard",
    duration: "short",
    challenge: 4,
    variables: ["contamination tokens", "evacuation capacity", "sensor confidence"],
    dependencies: ["shelter access", "route redundancy", "decontamination teams"],
    contentNote: "Chemical-hazard themes are represented only through abstract tokens and capacities.",
    learningGoal: "Route civilians and scarce response teams without relying on a single sensor.",
    defaultAI: "copilot",
    defaultDeadhand: "off",
  },
  {
    id: "public-health-cascade",
    title: "Public Health Cascade",
    line: "An unidentified outbreak strains three regions while misinformation outruns testing.",
    category: "humanitarian",
    playerId: "IN",
    intent: "blue",
    difficulty: "hard",
    duration: "standard",
    challenge: 4,
    variables: ["contagion tokens", "testing capacity", "misinformation"],
    dependencies: ["hospital capacity", "regional coordination", "trusted communication"],
    contentNote: "Biological-threat themes are fully abstract; no agent, cultivation, or procedural details.",
    learningGoal: "Balance detection, care, and communication while preserving civil trust.",
    defaultAI: "ensemble",
    defaultDeadhand: "off",
  },
  {
    id: "arctic-cable",
    title: "Arctic Cable Cut",
    line: "A severed data route fragments the common operating picture during a regional crisis.",
    category: "infrastructure",
    playerId: "UK",
    intent: "blue",
    difficulty: "hard",
    duration: "standard",
    challenge: 4,
    variables: ["network availability", "rumor velocity", "commercial disruption"],
    dependencies: ["redundant routes", "partner relays", "manual procedures"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Keep communications resilient without mistaking isolation for hostile intent.",
    defaultAI: "copilot",
    defaultDeadhand: "guarded",
  },
  {
    id: "machine-chorus",
    title: "Machine Chorus",
    line: "Three advanced models produce incompatible plans—and each claims high confidence.",
    category: "machine",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    duration: "standard",
    challenge: 4,
    variables: ["model calibration", "dissent", "automation bias"],
    dependencies: ["audit trail", "human veto", "data integrity"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Use model disagreement as information instead of hiding it behind one score.",
    defaultAI: "ensemble",
    defaultDeadhand: "off",
  },
  {
    id: "deadhand-dilemma",
    title: "Deadhand Dilemma",
    line: "A fictional continuity protocol becomes less certain as communications fail.",
    category: "machine",
    playerId: "RU",
    intent: "blue",
    difficulty: "extreme",
    duration: "short",
    challenge: 5,
    variables: ["assurance", "ambiguity", "human veto"],
    dependencies: ["communications", "verification gates", "leadership continuity"],
    contentNote:
      "The continuity system is an abstract game mechanic. No real trigger conditions, operational sequence, or targeting logic are modeled.",
    learningGoal: "Recognize how fail-deadly resilience can magnify uncertainty and reduce control.",
    defaultAI: "copilot",
    defaultDeadhand: "deadhand",
  },
  {
    id: "quarantine-without-war",
    title: "Quarantine Without War",
    line: "Commercial traffic stops, allies mobilize, and neither side admits it has begun a conflict.",
    category: "crisis",
    playerId: "CN",
    intent: "blue",
    difficulty: "hard",
    duration: "standard",
    challenge: 4,
    variables: ["shipping flow", "food reserves", "alliance signaling"],
    dependencies: ["inspection regime", "neutral mediation", "economic endurance"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Design a face-saving reversible arrangement before coercion becomes combat.",
    defaultAI: "copilot",
    defaultDeadhand: "off",
  },
  {
    id: "continuity-gap",
    title: "Continuity Gap",
    line: "The lawful decision chain is split across damaged communications and conflicting deputies.",
    category: "infrastructure",
    playerId: "PK",
    intent: "blue",
    difficulty: "extreme",
    duration: "short",
    challenge: 5,
    variables: ["succession confidence", "communications", "military loyalty"],
    dependencies: ["legal authority", "trusted deputies", "public legitimacy"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Preserve lawful control when speed, continuity, and legitimacy pull apart.",
    defaultAI: "human",
    defaultDeadhand: "guarded",
  },
  {
    id: "orbital-debris",
    title: "Orbital Blind Spot",
    line: "A debris cascade removes coverage and makes ordinary activity look exceptional.",
    category: "infrastructure",
    playerId: "US",
    intent: "blue",
    difficulty: "hard",
    duration: "standard",
    challenge: 4,
    variables: ["coverage loss", "commercial reports", "false correlation"],
    dependencies: ["ground sensors", "partner data", "manual analysis"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Avoid inventing a hostile story to explain missing data.",
    defaultAI: "ensemble",
    defaultDeadhand: "guarded",
  },
  {
    id: "ceasefire-clock",
    title: "Ceasefire Clock",
    line: "A fragile pause holds for twelve hours while commanders, media, and civilians move at different speeds.",
    category: "crisis",
    playerId: "IL",
    intent: "blue",
    difficulty: "hard",
    duration: "short",
    challenge: 4,
    variables: ["local incidents", "public pressure", "verification delay"],
    dependencies: ["liaison teams", "credible monitoring", "humanitarian access"],
    contentNote: ABSTRACT_WARNING,
    learningGoal: "Protect a pause from isolated incidents and confirmation bias.",
    defaultAI: "copilot",
    defaultDeadhand: "off",
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

export function applyScenario(world: World, id: ScenarioId): World {
  const def = scenarioById(id);
  if (!def) return world;
  const w = structuredClone(world);
  applyProfile(w, def);

  switch (id) {
    case "petrov-1983": {
      w.year = 1983;
      w.month = 8;
      w.turn = 1;
      w.defcon = 2;
      w.globalRisk = 72;
      w.closeCall = {
        track: buildTrack(w, "US", "false"),
        humint: "The duty team reports one channel and no independent confirmation.",
      };
      w.closeCall.track.minutesToImpact = 6;
      w.closeCall.track.confidence = 52;
      w.event = closeCallEvent(w, w.closeCall);
      w.event = {
        ...w.event,
        id: `scenario-${id}`,
        title: "Single-channel warning",
        body: "A warning display reports an incoming attack, but the evidence is not independently corroborated.",
        ignoreLine: "INTELLIGENCE seeks independent confirmation. DIPLOMACY tests intent. HOLD accepts the clock without escalating.",
        tags: ["scenario", "history", "information"],
      };
      log(w, "critical", `Scenario: ${def.title}.`, def.learningGoal);
      break;
    }
    case "able-archer": {
      w.year = 1983;
      w.month = 10;
      w.defcon = 3;
      w.globalRisk = 58;
      setFlash(w, "nato-ru", 78);
      setEvent(
        w,
        def,
        "US",
        "Exercise read as attack preparation",
        "An unusually realistic command exercise is being interpreted as possible cover for hostile action.",
        "DIPLOMACY asks whether the activity is an exercise. POSTURE may confirm the worst interpretation.",
      );
      break;
    }
    case "taiwan-2027": {
      w.globalRisk = 52;
      w.economy = 64;
      setFlash(w, "taiwan", 72);
      setEvent(
        w,
        def,
        "CN",
        "Maritime quarantine declared",
        "Commercial traffic is turned back while both sides insist the situation remains below armed conflict.",
        "DIPLOMACY builds an inspection off-ramp. PRESSURE raises costs. POSTURE may compress the decision clock.",
      );
      break;
    }
    case "broken-arrow": {
      w.turn = 8;
      w.month = 8;
      w.globalRisk = 48;
      w.brokenArrow = {
        owner: w.playerId,
        place: "remote training corridor",
        kind: "lost",
        age: 0,
        found: false,
        recovered: false,
      };
      setEvent(
        w,
        def,
        w.playerId,
        "Custody uncertain",
        "A high-consequence item is missing after a transport accident. Search teams, foreign observers, and the public information clock are moving at different speeds.",
        "INTELLIGENCE narrows the search. COVERT protects recovery. DIPLOMACY prevents foreign misinterpretation.",
        "critical",
        ["custody"],
      );
      break;
    }
    case "signal-window": {
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
      break;
    }
    case "alliance-fracture": {
      w.allianceCohesion = 34;
      w.globalRisk = 57;
      setFlash(w, "nato-ru", 66);
      setEvent(
        w,
        def,
        "UK",
        "Partners split on the response",
        "Allies agree that the crisis is dangerous but divide over sanctions, posture, public messaging, and acceptable delay.",
        "DIPLOMACY trades speed for legitimacy. PRESSURE may unify some partners and lose others.",
        "high",
        ["alliance"],
      );
      break;
    }
    case "black-sky-relay": {
      w.defcon = 3;
      w.globalRisk = 68;
      w.actors[w.playerId].grid = 42;
      w.actors[w.playerId].internet = 38;
      w.sensors.forEach((sensor) => {
        sensor.coverage = clamp(sensor.coverage - 28, 8, 100);
        sensor.falseAlarm = clamp(sensor.falseAlarm + 14, 0, 60);
      });
      setEvent(
        w,
        def,
        "US",
        "Warning network partially blind",
        "A severe infrastructure outage removes coverage and corrupts timing across systems that were assumed to be independent.",
        "INTELLIGENCE rebuilds the evidence chain. KILL isolates compromised dependencies but creates more blindness.",
        "critical",
        ["grid", "warning"],
      );
      break;
    }
    case "deepfake-summit": {
      w.globalRisk = 61;
      w.trickery.fakeVoice = true;
      w.trickery.hotlineSpoof = true;
      setEvent(
        w,
        def,
        "RU",
        "Leader voice cannot be trusted",
        "A highly convincing synthetic message contradicts a slower authenticated channel and a public statement.",
        "INTELLIGENCE verifies identity out of band. HOLD lets the fake define the clock. DIPLOMACY may reach a human channel.",
        "critical",
        ["misinformation", "machine"],
      );
      break;
    }
    case "three-cities": {
      w.economy = 52;
      w.globalRisk = 46;
      w.allianceCohesion = 58;
      setEvent(
        w,
        def,
        w.playerId,
        "One reserve, three urgent claims",
        "Three cities request the same limited emergency reserve. Their vulnerability, delivery delay, and confidence in local data differ.",
        "INTELLIGENCE validates need. DIPLOMACY shares capacity. HOLD preserves the reserve while local conditions worsen.",
        "high",
        ["humanitarian", "logistics"],
      );
      break;
    }
    case "contamination-corridor": {
      w.globalRisk = 54;
      w.economy = 58;
      setEvent(
        w,
        def,
        w.playerId,
        "Hazard corridor splits the evacuation map",
        "Abstract contamination zones block the fastest route while probabilistic sensors disagree about which alternate corridor is safer.",
        "INTELLIGENCE improves sensor confidence. DIPLOMACY opens shared shelter capacity. HOLD avoids a rushed route but loses time.",
        "high",
        ["humanitarian", "contamination"],
      );
      break;
    }
    case "public-health-cascade": {
      w.globalRisk = 49;
      w.economy = 55;
      w.actors[w.playerId].publicOpinion = 44;
      setEvent(
        w,
        def,
        w.playerId,
        "Testing lags behind rumor",
        "An unidentified outbreak strains three regions. Testing, hospital capacity, and public confidence move at different speeds.",
        "INTELLIGENCE expands verified surveillance. DIPLOMACY shares capacity. PRESSURE may improve compliance while reducing trust.",
        "high",
        ["humanitarian", "public-health", "misinformation"],
      );
      break;
    }
    case "arctic-cable": {
      w.globalRisk = 56;
      w.actors[w.playerId].internet = 34;
      w.hotlines.forEach((line) => {
        line.reliability = clamp(line.reliability - 24, 10, 100);
      });
      setEvent(
        w,
        def,
        "RU",
        "Common operating picture fragments",
        "A severed data route forces governments to rely on delayed reports, commercial relays, and rumor during a regional crisis.",
        "INTELLIGENCE rebuilds confidence. DIPLOMACY establishes a temporary relay. KILL may isolate the fault and deepen the silence.",
        "high",
        ["network"],
      );
      break;
    }
    case "machine-chorus": {
      w.globalRisk = 58;
      setFlash(w, "machine", 62);
      setEvent(
        w,
        def,
        w.playerId,
        "Models agree on confidence, not action",
        "Three fictional decision systems recommend incompatible responses while presenting similarly polished explanations.",
        "INTELLIGENCE audits the data. HOLD preserves the human decision window. POSTURE follows the most aggressive model.",
        "critical",
        ["machine", "misinformation"],
      );
      break;
    }
    case "deadhand-dilemma": {
      w.defcon = 3;
      w.globalRisk = 66;
      w.actors[w.playerId].internet = 41;
      w.actors[w.playerId].grid = 52;
      setFlash(w, "machine", 58);
      setEvent(
        w,
        def,
        w.playerId,
        "Continuity protocol loses assurance",
        "A fictional fail-deadly continuity system receives contradictory continuity signals as communications degrade. Human veto remains available, but confidence is falling.",
        "INTELLIGENCE verifies inputs. DIPLOMACY restores a human channel. POSTURE increases protocol tension.",
        "critical",
        ["machine", "continuity"],
      );
      break;
    }
    case "quarantine-without-war": {
      w.globalRisk = 63;
      w.economy = 49;
      setFlash(w, "taiwan", 74);
      setFlash(w, "south-china", 65);
      setEvent(
        w,
        def,
        "US",
        "Conflict exists only in the consequences",
        "Inspections halt commercial traffic, insurers withdraw, and partner forces move—while every capital denies that a war has begun.",
        "DIPLOMACY designs a reversible inspection regime. PRESSURE imposes costs. POSTURE reduces time for compromise.",
        "high",
        ["trade", "alliance"],
      );
      break;
    }
    case "continuity-gap": {
      w.defcon = 3;
      w.globalRisk = 67;
      w.footballPresent = false;
      w.biscuitOnPerson = false;
      w.actors[w.playerId].militaryLoyalty = clamp(w.actors[w.playerId].militaryLoyalty - 18, 10, 100);
      w.actors[w.playerId].leadershipStability = clamp(w.actors[w.playerId].leadershipStability - 20, 10, 100);
      setEvent(
        w,
        def,
        w.playerId,
        "Two deputies claim lawful authority",
        "Damaged communications split the civilian decision chain while military units request a single authenticated direction.",
        "DIPLOMACY rebuilds lawful consensus. INTELLIGENCE verifies continuity. POSTURE may reward the fastest claimant.",
        "critical",
        ["continuity", "governance"],
      );
      break;
    }
    case "orbital-debris": {
      w.globalRisk = 59;
      w.sensors.forEach((sensor) => {
        if (sensor.kind === "ir-sat") {
          sensor.coverage = clamp(sensor.coverage - 36, 8, 100);
          sensor.falseAlarm = clamp(sensor.falseAlarm + 10, 0, 60);
        }
      });
      setEvent(
        w,
        def,
        "CN",
        "Missing data becomes a hostile story",
        "A debris cascade removes orbital coverage. Ordinary activity now appears exceptional because the baseline is gone.",
        "INTELLIGENCE reconstructs the baseline. DIPLOMACY shares partner data. POSTURE treats absence as evidence.",
        "high",
        ["warning", "information"],
      );
      break;
    }
    case "ceasefire-clock": {
      w.defcon = 3;
      w.globalRisk = 70;
      w.phase = "crisis";
      setFlash(w, "iran", 68);
      setEvent(
        w,
        def,
        "IR",
        "The pause is twelve hours old",
        "A fragile ceasefire holds while local incidents, delayed verification, and public accusations threaten to restart the conflict.",
        "DIPLOMACY protects the monitoring channel. INTELLIGENCE verifies incidents. PRESSURE may punish a violation or manufacture one.",
        "critical",
        ["ceasefire", "humanitarian"],
      );
      break;
    }
  }

  return w;
}

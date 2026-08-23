export type ActorId =
  | "US"
  | "RU"
  | "SU"
  | "CN"
  | "FR"
  | "UK"
  | "IN"
  | "PK"
  | "IL"
  | "KP"
  | "IR"
  | "CU"
  | "NS"
  | "CR";

export const ACTOR_IDS: ActorId[] = [
  "US",
  "RU",
  "SU",
  "CN",
  "FR",
  "UK",
  "IN",
  "PK",
  "IL",
  "KP",
  "IR",
  "CU",
  "NS",
  "CR",
];

export const NUCLEAR_IDS: ActorId[] = ["US", "RU", "SU", "CN", "FR", "UK", "IN", "PK", "IL", "KP"];

export type PlayableId =
  | "US"
  | "RU"
  | "SU"
  | "CN"
  | "FR"
  | "UK"
  | "IN"
  | "PK"
  | "IL"
  | "KP"
  | "CU"
  | "NS"
  | "CR";
export const PLAYABLE_IDS: PlayableId[] = [
  "US",
  "RU",
  "SU",
  "CN",
  "FR",
  "UK",
  "IN",
  "PK",
  "IL",
  "KP",
  "CU",
  "NS",
  "CR",
];

export type Team = "blue" | "red";
export type OfficerStance = "professional" | "eager" | "shaken" | "loyalist" | "machine" | "coward";

export type Phase = "peacetime" | "crisis" | "conventional" | "nuclear" | "aftermath";
export type Difficulty = "standard" | "hard" | "extreme";
export type Disclosure = "acknowledged" | "reported" | "suspected" | "unacknowledged";
export type Screen = "title" | "briefing" | "play" | "war" | "end";

export type DeliveryKind =
  | "icbm"
  | "slbm"
  | "irbm"
  | "mrbm"
  | "srbm"
  | "alcm"
  | "glcm"
  | "slcm"
  | "hgv"
  | "bomber"
  | "dca"
  | "gravity"
  | "novel"
  | "covert";

export type ActionKind =
  | "hold"
  | "diplomacy"
  | "pressure"
  | "posture"
  | "intelligence"
  | "covert"
  | "kill"
  | "employ";

export type ActionIntensity = 1 | 2 | 3;

export interface PlayerAction {
  kind: ActionKind;
  intensity: ActionIntensity;
  target: ActorId | null;
  /** File a launch notice / tell them this is not a surprise attack. */
  notify?: boolean;
  /** Jacobsen Black Book page: A LAO · B SAO · C MAO · D countervalue/Tsar. */
  book?: "A" | "B" | "C" | "D";
}

export type DoctrineId =
  | "counterforce"
  | "minimum"
  | "full-spectrum"
  | "opacity"
  | "first-use-tactical"
  | "nfu"
  | "asymmetric"
  | "escalate-to-deescalate";

export interface DeliverySystem {
  id: string;
  name: string;
  kind: DeliveryKind;
  rangeKm: number;
  launchers: number;
  warheads: number;
  yieldKt: [number, number];
  reliability: number;
  survivability: number;
  disclosure: Disclosure;
  dualCapable?: boolean;
  notes: string;
}

export interface Actor {
  id: ActorId;
  name: string;
  shortName: string;
  lat: number;
  lon: number;
  nuclear: boolean;
  threshold: boolean;
  nonstate: boolean;
  doctrine: DoctrineId;
  doctrineLine: string;
  declaredNfu: boolean;
  launchOnWarning: boolean;
  preDelegation: boolean;
  secondStrike: number;
  stockpile: number;
  deployed: number;
  reserve: number;
  retired: number;
  systems: DeliverySystem[];
  leadershipStability: number;
  eliteSplit: number;
  publicOpinion: number;
  militaryLoyalty: number;
  unrest: number;
  polarization: number;
  nationalism: number;
  informationControl: number;
  warFatigue: number;
  corruption: number;
  successionRisk: number;
  riskTolerance: number;
  /** 0 freeze · 40 cave · 50 steady · 70 hawk · 90 panic-fire. Drifts with what you do. */
  nerve: number;
  legitimacy: number;
  alert: number;
  missileDefense: number;
  cyber: number;
  opacity: number;
  intel: number;
  breakoutWeeks: number;
  hasDevice: boolean;
  hostility: Record<ActorId, number>;
  trust: Record<ActorId, number>;
  survivingWarheads: number;
  c2Intact: boolean;
  casualties: number;
  /** Infrared / radar early-warning quality 0–100. */
  warning: number;
  /** Share of nuclear C2 that is automated or compromised, 0–100. */
  aiInC2: number;
  /** Civilian + military internet, 100 = up. */
  internet: number;
  /** Electric grid, 100 = up. Silos run on diesel for a while. Radar does not. */
  grid: number;
}

export type FlashKind =
  | "taiwan"
  | "korea"
  | "kashmir"
  | "iran"
  | "nato-ru"
  | "ukraine"
  | "terror"
  | "south-china"
  | "machine"
  | "union"
  | "cuba"
  | "cartel";

export interface Flashpoint {
  id: FlashKind;
  name: string;
  actors: ActorId[];
  heat: number;
  note: string;
}

export interface GameEvent {
  id: string;
  title: string;
  body: string;
  actor: ActorId;
  heat: "low" | "med" | "high" | "critical";
  ignoreLine: string;
  tags: string[];
}

export interface LogEntry {
  id: string;
  turn: number;
  date: string;
  text: string;
  why: string;
  kind: "info" | "warn" | "critical" | "you";
}

export type NuclearRung = "demo" | "tactical" | "counterforce" | "countervalue";

export interface NuclearUse {
  turn: number;
  actor: ActorId;
  target: ActorId;
  rung: NuclearRung;
  yieldKt: number;
  location: string;
  notified: boolean;
}

export interface MissileFx {
  id: string;
  from: ActorId;
  to: ActorId;
  progress: number;
  kind: "missile" | "detonation";
}

export interface SensorNet {
  id: string;
  name: string;
  owner: ActorId;
  kind: "ir-sat" | "radar" | "bmews";
  coverage: number;
  falseAlarm: number;
  intact: boolean;
}

export type TrackKind = "test" | "attack" | "false" | "training";

export interface SatTrack {
  from: ActorId;
  boosts: number;
  azimuth: string;
  minutesToImpact: number;
  confidence: number;
  source: string;
  notified: boolean;
  real: boolean;
  kind: TrackKind;
}

export interface CloseCall {
  track: SatTrack;
  humint: string | null;
}

export interface Hotline {
  a: ActorId;
  b: ActorId;
  name: string;
  reliability: number;
}

export interface LaunchNotice {
  turn: number;
  actor: ActorId;
  window: string;
  claimed: "test" | "exercise";
}

export type SiteKind = "icbm" | "ssbn" | "bomber" | "mobile";

export interface SpyCell {
  cover: string;
  quality: number;
  lastReport: string;
  burned: boolean;
}

export interface HostileWatch {
  runner: ActorId;
  cover: string;
  quality: number;
  known: boolean;
  burned: boolean;
}

export interface LaunchSite {
  id: string;
  name: string;
  owner: ActorId;
  kind: SiteKind;
  lat: number;
  lon: number;
  generation: 0 | 1 | 2;
  ourSpy: SpyCell | null;
  hostile: HostileWatch | null;
}

export interface Trickery {
  hotlineSpoof: boolean;
  noticeSpoof: boolean;
  humintPoison: boolean;
  fakeVoice: boolean;
}

export interface BrokenArrow {
  owner: ActorId;
  place: string;
  kind: "crash" | "lost" | "theft";
  age: number;
  found: boolean;
  recovered: boolean;
}

export interface SecondOfficer {
  title: string;
  name: string;
  stance: OfficerStance;
}

export interface World {
  version: 1;
  seed: number;
  rngState: number;
  rngMode: "live" | "fixed";
  rngFixed: number;
  difficulty: Difficulty;
  playerId: ActorId;
  intent: Team;
  terminator: boolean;
  aiTakeover: number;
  machineFired: boolean;
  turn: number;
  month: number;
  year: number;
  phase: Phase;
  defcon: 1 | 2 | 3 | 4 | 5;
  globalRisk: number;
  allianceCohesion: number;
  economy: number;
  terrorThreat: number;
  proliferation: number;
  armsRace: number;
  nuclearWinter: number;
  winterStage: 0 | 1 | 2 | 3;
  uncontrolled: boolean;
  usCasualties: number;
  playerCasualties: number;
  worldCasualties: number;
  newStartDead: boolean;
  footballPresent: boolean;
  biscuitOnPerson: boolean;
  authCode: string;
  secondOfficer: SecondOfficer;
  closeCall: CloseCall | null;
  sensors: SensorNet[];
  hotlines: Hotline[];
  notices: LaunchNotice[];
  sites: LaunchSite[];
  trickery: Trickery;
  brokenArrow: BrokenArrow | null;
  reactions: import("./humans").HumanReaction[];
  actors: Record<ActorId, Actor>;
  flashpoints: Flashpoint[];
  event: GameEvent;
  usedEventIds: string[];
  log: LogEntry[];
  nuclearUses: NuclearUse[];
  firstUse: ActorId | null;
  missiles: MissileFx[];
  ended: boolean;
  ending: Ending | null;
}

export type EndingKind =
  | "peace"
  | "war-win"
  | "war-loss"
  | "pyrrhic"
  | "coup"
  | "terror"
  | "winter"
  | "unforced"
  | "red-win"
  | "stalemate"
  | "machine";

export interface Ending {
  kind: EndingKind;
  title: string;
  body: string;
  score: number;
}

export interface ForecastDelta {
  label: string;
  low: number;
  high: number;
  unit?: string;
}

export interface Forecast {
  summary: string;
  riskLine: string;
  deltas: ForecastDelta[];
  irreversible: boolean;
}

export interface Meters {
  defcon: number;
  stability: number;
  alliances: number;
  risk: number;
  economy: number;
  winter: number;
  ai: number;
  net: number;
  grid: number;
}

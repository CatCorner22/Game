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
  | "IR"
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
  "IR",
  "CU",
  "NS",
  "CR",
];

export type Team = "blue" | "red";
export type OfficerStance = "professional" | "eager" | "shaken" | "loyalist" | "machine" | "coward";

export type Phase = "peacetime" | "crisis" | "conventional" | "nuclear" | "aftermath";
export type Difficulty = "standard" | "hard" | "extreme";
export type Disclosure = "acknowledged" | "reported" | "suspected" | "unacknowledged";
export type Screen = "title" | "briefing" | "play" | "war" | "end" | "stats" | "multiplayer" | "archive";

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
  | "covert"
  | "orbital"
  | "fobs";

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

export type PackageMode = "single" | "mirv" | "mirv-decoy";

export interface PlayerAction {
  kind: ActionKind;
  intensity: ActionIntensity;
  target: ActorId | null;
  /** File a launch notice / tell them this is not a surprise attack. */
  notify?: boolean;
  /** Jacobsen Black Book page: A LAO · B SAO · C MAO · D countervalue/Tsar. */
  book?: "A" | "B" | "C" | "D";
  /** RV / decoy package for nuclear employ. */
  packageMode?: PackageMode;
  /**
   * Command post to relocate to, if any. Rides alongside the turn's action
   * rather than replacing it: relocating does not stop you governing, it makes
   * you briefly blind and permanently visible. Recorded in `actionHistory`, so
   * it replays from a code like every other choice.
   */
  relocateTo?: string;
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
  /** Reentry vehicles released per successful bus. 1 = unitary. */
  rvsPerBus?: number;
  /** Lightweight decoys / balloon RVs released with the bus. */
  decoys?: number;
  /** 0–1 quality of penetration aids (chaff, cooled shrouds, maneuver). */
  penetrationAids?: number;
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
  | "cartel"
  | "himalaya"
  | "space";

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
  /**
   * One or two sentences of context, glossing any jargon the body uses.
   *
   * The deck was written before the briefs were, and it still carries the exact
   * density the briefs were rewritten to remove -- "NOTAM", "Iskander
   * batteries", "Hwasong-17/18", all unglossed. A player reads about fifty
   * words per ordinary turn, and roughly a fifth of them mean nothing unless
   * you already work in the field.
   */
  background?: string;
  tags: string[];
  /** Causal line from last month's decision. */
  because?: string;
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

export type StrikeOutcome = "full" | "partial" | "intercepted" | "failed";

export interface StrikeLeg {
  systemId: string;
  systemName: string;
  launched: number;
  boostFailed: number;
  busFailed: number;
  rvsReleased: number;
  decoysReleased: number;
  interceptedRv: number;
  interceptedDecoy: number;
  reentryFailed: number;
  arrived: number;
}

export interface StrikeReport {
  turn: number;
  actor: ActorId;
  target: ActorId;
  rung: NuclearRung;
  outcome: StrikeOutcome;
  packageMode: PackageMode;
  legs: StrikeLeg[];
  launched: number;
  failed: number;
  intercepted: number;
  decoys: number;
  arrived: number;
  expected: number;
  yieldKt: number;
  deaths: number;
  summary: string;
}

export interface NuclearUse {
  turn: number;
  actor: ActorId;
  target: ActorId;
  rung: NuclearRung;
  yieldKt: number;
  location: string;
  notified: boolean;
  systemId?: string;
  launched?: number;
  failed?: number;
  intercepted?: number;
  decoys?: number;
  arrived?: number;
  outcome?: StrikeOutcome;
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

export type TrackKind = "test" | "attack" | "false" | "training" | "anomalous";

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

export interface NonAttackPact {
  a: ActorId;
  b: ActorId;
  untilTurn: number;
  broken: boolean;
}

export interface Ceasefire {
  a: ActorId;
  b: ActorId;
  untilTurn: number;
  accepted: boolean;
  broken: boolean;
}

export interface Treaty {
  id: string;
  name: string;
  parties: ActorId[];
  status: "in-force" | "dead" | "suspended" | "strained";
  note: string;
}

export interface RecapDelta {
  label: string;
  delta: number;
}

export interface TurnRecap {
  turn: number;
  actionLabel: string;
  because?: string;
  nextTitle: string;
  deltas: RecapDelta[];
}

export type FlareClass = "quiet" | "C" | "M" | "X" | "carrington";

export interface SpaceWeather {
  kp: number;
  flare: FlareClass;
  cmeInbound: boolean;
  hoursToArrival: number | null;
  gridStress: number;
  satStress: number;
  lastNote: string;
}

export type DoctrineUpgradeId = "pal" | "sbirs" | "hotline" | "humint" | "mirv" | "decoys";

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
  pacts?: NonAttackPact[];
  ceasefire?: Ceasefire | null;
  c2StanceTurn?: number;
  doctrinePending?: boolean;
  doctrineTaken?: DoctrineUpgradeId[];
  actionHistory?: PlayerAction[];
  scenarioId?: string | null;
  sites: LaunchSite[];
  trickery: Trickery;
  brokenArrow: BrokenArrow | null;
  reactions: import("./humans").HumanReaction[];
  actors: Record<ActorId, Actor>;
  flashpoints: Flashpoint[];
  event: GameEvent;
  usedEventIds: string[];
  lastAction?: PlayerAction | null;
  lastDecisionKey?: string | null;
  recentDecisionKeys?: string[];
  threadActor?: ActorId | null;
  threadTag?: string | null;
  aiLast?: Partial<Record<ActorId, PlayerAction>>;
  lastStrike?: StrikeReport | null;
  treaties?: Treaty[];
  lastRecap?: TurnRecap | null;
  spaceWeather?: SpaceWeather;
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
  | "machine"
  | "ceasefire"
  | "mandate-win"
  | "mandate-loss";

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

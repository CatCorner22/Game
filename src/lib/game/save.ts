import type { World } from "./types";
import { createWorld } from "./world";
import { makeActors } from "./actors";
import { defaultHotlines, defaultSensors } from "./warning";
import { makeOfficer, asPlayable } from "./command";
import { makeSites, seedSpies } from "./spies";
import { emptyTrickery } from "./trickery";
import { saveWorldToSlot } from "./slots";
import { ensureTreaties } from "./treaties";
import { quietWeather } from "./spaceWeather";

const KEY = "threshold.save.v2";
const BACKUP = "threshold.save.v2.bak";
const SAVE_VERSION = 2;

export function migrateWorld(world: World): World {
  if (!world.playerId) world.playerId = "US";
  if (!world.intent) world.intent = "blue";
  if (world.footballPresent === undefined) world.footballPresent = true;
  if (world.biscuitOnPerson === undefined) world.biscuitOnPerson = true;
  if (!world.authCode) world.authCode = "GOLD-7";
  if (!world.secondOfficer) world.secondOfficer = makeOfficer(asPlayable(world.playerId));
  if (world.closeCall && world.closeCall.humint === undefined) world.closeCall.humint = null;
  if (!world.sensors) world.sensors = defaultSensors();
  if (!world.hotlines) world.hotlines = defaultHotlines();
  if (!world.notices) world.notices = [];
  if (world.winterStage === undefined) world.winterStage = 0;
  if (world.uncontrolled === undefined) world.uncontrolled = false;
  if (world.playerCasualties === undefined) world.playerCasualties = world.usCasualties ?? 0;
  if (world.terminator === undefined) world.terminator = false;
  if (world.aiTakeover === undefined) world.aiTakeover = 0;
  if (world.machineFired === undefined) world.machineFired = false;
  if (!world.flashpoints.some((f) => f.id === "machine")) {
    world.flashpoints.push({
      id: "machine",
      name: "Machine control",
      actors: ["US", "RU", "CN", "UK", "FR"],
      heat: world.terminator ? 40 : 0,
      note: "Decision-support that can write to the keys.",
    });
  }
  if (!world.sites?.length) {
    world.sites = makeSites();
    seedSpies(world);
  }
  if (!world.flashpoints.some((f) => f.id === "union")) {
    world.flashpoints.push({
      id: "union",
      name: "Soviet restoration",
      actors: ["RU", "SU", "US"],
      heat: 20,
      note: "Two commands claiming one arsenal.",
    });
  }
  if (!world.flashpoints.some((f) => f.id === "cuba")) {
    world.flashpoints.push({
      id: "cuba",
      name: "Caribbean / Cuba",
      actors: ["US", "CU", "RU", "SU"],
      heat: 12,
      note: "Hosted dual-capable and cartel ports.",
    });
  }
  if (!world.flashpoints.some((f) => f.id === "cartel")) {
    world.flashpoints.push({
      id: "cartel",
      name: "Cartel corridors",
      actors: ["US", "CR", "CU", "NS"],
      heat: 16,
      note: "Money, ports, colonels.",
    });
  }
  if (!world.flashpoints.some((f) => f.id === "himalaya")) {
    world.flashpoints.push({
      id: "himalaya",
      name: "Himalaya / LAC",
      actors: ["IN", "CN"],
      heat: 18,
      note: "High-altitude clash. Dual-capable aircraft make a patrol nuclear-adjacent.",
    });
  }
  if (!world.flashpoints.some((f) => f.id === "space")) {
    world.flashpoints.push({
      id: "space",
      name: "Early warning / space",
      actors: ["US", "RU", "CN"],
      heat: 12,
      note: "SBIRS and missile-warning birds. An ASAT shot is a blindfold.",
    });
  }
  if (world.brokenArrow === undefined) world.brokenArrow = null;
  if (!world.reactions) world.reactions = [];
  if (!world.pacts) world.pacts = [];
  if (world.doctrinePending === undefined) world.doctrinePending = false;
  if (!world.doctrineTaken) world.doctrineTaken = [];
  if (!world.actionHistory) world.actionHistory = [];
  if (world.lastAction === undefined) world.lastAction = null;
  if (world.lastDecisionKey === undefined) world.lastDecisionKey = null;
  if (!world.recentDecisionKeys) world.recentDecisionKeys = [];
  if (world.threadActor === undefined) world.threadActor = null;
  if (world.threadTag === undefined) world.threadTag = null;
  if (!world.aiLast) world.aiLast = {};
  if (world.lastStrike === undefined) world.lastStrike = null;
  if (world.ceasefire === undefined) world.ceasefire = null;
  if (world.c2StanceTurn === undefined) world.c2StanceTurn = 0;
  if (world.lastRecap === undefined) world.lastRecap = null;
  ensureTreaties(world);
  if (!world.spaceWeather) world.spaceWeather = quietWeather();
  for (const a of Object.values(world.actors)) {
    for (const s of a.systems) {
      if (s.rvsPerBus === undefined) {
        const launchers = Math.max(1, s.launchers);
        s.rvsPerBus =
          s.warheads > launchers && (s.kind === "icbm" || s.kind === "slbm" || s.kind === "mrbm")
            ? Math.min(12, Math.round(s.warheads / launchers))
            : 1;
      }
      if (s.decoys === undefined) {
        s.decoys = (s.kind === "icbm" || s.kind === "slbm") && (s.rvsPerBus ?? 1) >= 2 ? s.rvsPerBus ?? 0 : 0;
      }
      if (s.penetrationAids === undefined) s.penetrationAids = s.kind === "hgv" ? 0.8 : 0;
    }
  }
  const fresh = makeActors();
  for (const id of Object.keys(fresh) as (keyof typeof fresh)[]) {
    if (!world.actors[id]) world.actors[id] = fresh[id];
  }
  for (const a of Object.values(world.actors)) {
    if (a.warning === undefined) a.warning = 50;
    if (a.aiInC2 === undefined) a.aiInC2 = 0;
    if (a.internet === undefined) a.internet = 100;
    if (a.grid === undefined) a.grid = 100;
    if (a.nerve === undefined) a.nerve = a.riskTolerance ?? 50;
  }
  return world;
}

export function saveWorld(world: World, slot: 0 | 1 | 2 = 0) {
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(BACKUP, prev);
    localStorage.setItem(KEY, JSON.stringify({ version: SAVE_VERSION, world }));
    saveWorldToSlot(world, slot);
  } catch {
    /* private mode / quota */
  }
}

export function loadWorld(): World | null {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem("threshold.save.v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version?: number; world?: World };
    if (!parsed.world) return null;
    return migrateWorld(parsed.world);
  } catch {
    return null;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem("threshold.save.v1");
  } catch {
    /* ignore */
  }
}

export function hasSave(): boolean {
  try {
    return Boolean(localStorage.getItem(KEY) || localStorage.getItem("threshold.save.v1"));
  } catch {
    return false;
  }
}

export function newGameFallback(): World {
  return createWorld("standard", 1, "US", "blue");
}

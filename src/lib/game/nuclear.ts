import type { ActorId, NuclearRung, PackageMode, PlayerAction, World } from "./types";
import { chance, clamp, nextUnit, round } from "./rng";
import { addHostility, bumpFlash, setDefcon } from "./world";
import { log } from "./simLog";
import { degradeSensors } from "./warning";
import { aiReleaseOk } from "./command";
import { pageById } from "./blackbook";
import { arrivalFraction, resolveStrikePackage } from "./nuclearStrike";

export function isNuclearAction(world: World | PlayerAction, action?: PlayerAction): boolean {
  const act = action ?? (world as PlayerAction);
  const w = action ? (world as World) : null;
  if (act.kind !== "employ" || act.intensity < 2) return false;
  if (!w) return true;
  const me = w.actors[w.playerId];
  return Boolean(me.nuclear || me.hasDevice);
}

export function rungFor(action: PlayerAction): NuclearRung {
  if (action.intensity >= 3) return "counterforce";
  return "tactical";
}

function forceSurvivability(world: World, id: ActorId): number {
  const a = world.actors[id];
  const alert = a.alert;
  const sea = 0.35 + alert * 0.12;
  const mobileFlush = 0.2 + alert * 0.1;
  let acc = 0;
  let w = 0;
  for (const s of a.systems) {
    let surv = s.survivability;
    if (s.kind === "slbm") surv = clamp(surv * (0.5 + sea), 0.08, 0.95);
    if (s.kind === "icbm" && surv > 0.4) surv = clamp(surv + mobileFlush, 0.1, 0.9);
    if (s.kind === "bomber" || s.kind === "alcm") surv = clamp(surv * (alert >= 3 ? 1.3 : 0.6), 0.08, 0.85);
    acc += surv * s.warheads;
    w += s.warheads;
  }
  return w ? acc / w : 0.3;
}

export function applyNuclearUse(
  world: World,
  actor: ActorId,
  target: ActorId,
  rung: NuclearRung,
  location: string,
  notified = false,
  yieldOverride?: number,
  packageMode?: PackageMode,
): void {
  const report = resolveStrikePackage(world, actor, target, rung, packageMode);
  const frac = arrivalFraction(report);
  const landed = report.arrived > 0;
  const perRv =
    yieldOverride ??
    (rung === "demo"
      ? 12
      : rung === "tactical"
        ? 8 + round(nextUnit(world) * 20)
        : rung === "counterforce"
          ? 300 + round(nextUnit(world) * 400)
          : 800 + round(nextUnit(world) * 1200));
  const yieldKt = landed ? Math.max(1, round(perRv * Math.max(frac, 1 / Math.max(1, report.expected)))) : perRv;

  const atk = world.actors[actor];
  const def = world.actors[target];
  const spent = Math.min(atk.survivingWarheads, Math.max(1, report.launched * Math.max(1, Math.round((report.expected || 1) / Math.max(1, report.launched)))));
  atk.survivingWarheads = Math.max(0, atk.survivingWarheads - spent);
  atk.stockpile = Math.max(0, atk.stockpile - spent);
  const spentSys = atk.systems.find((s) => s.id === report.legs[0]?.systemId);
  if (spentSys) spentSys.warheads = Math.max(0, spentSys.warheads - spent);

  world.nuclearUses.push({
    turn: world.turn,
    actor,
    target,
    rung,
    yieldKt,
    location,
    notified,
    systemId: report.legs[0]?.systemId,
    launched: report.launched,
    failed: report.failed,
    intercepted: report.intercepted,
    decoys: report.decoys,
    arrived: report.arrived,
    outcome: report.outcome,
  });
  if (!world.firstUse) world.firstUse = actor;

  const hostilityBump =
    (rung === "demo" ? 18 : rung === "tactical" ? 28 : 45) * (landed ? 1 : 0.55);
  addHostility(world, actor, target, hostilityBump);
  setDefcon(world, 1);
  world.phase = "nuclear";
  world.armsRace = clamp(world.armsRace + (landed ? 25 : 16), 0, 100);
  world.proliferation = clamp(world.proliferation + 12, 0, 100);
  world.allianceCohesion = clamp(
    world.allianceCohesion + (actor === world.playerId ? (world.intent === "blue" ? -18 : -8) : actor === "US" ? -10 : 4),
    0,
    100,
  );

  if (rung === "demo") {
    const deaths = landed ? 0 : 0;
    def.unrest += landed ? 12 : 8;
    def.nationalism += landed ? 14 : 10;
    atk.legitimacy -= actor === world.playerId ? (landed ? 22 : 16) : 4;
    world.worldCasualties += deaths;
    report.yieldKt = yieldKt;
    report.deaths = deaths;
    world.lastStrike = report;
    log(
      world,
      "critical",
      `${atk.shortName} conducted a nuclear demonstration (${yieldKt} kt) near ${location}. ${report.summary}`,
      landed
        ? "A demonstration is still first use. It tries to coerce without destroying a city. It often fails, and it ends the taboo for everyone watching."
        : "The demonstration left the rail and did not land as packaged. First use still happened. The other side saw a launch.",
    );
    bumpFlash(world, target === "KP" ? "korea" : target === "CN" ? "taiwan" : "nato-ru", landed ? 22 : 16);
    if (notified) {
      addHostility(world, target, actor, -6);
      log(world, "info", "The demonstration was notified on the dedicated line first.", "A warning shot they were told about is still a nuclear use. It is slightly less likely to be read as the start of a disarming strike.");
    }
    if (report.launched > 0) {
      world.missiles.push({
        id: `nuk-${world.turn}-${actor}-${target}`,
        from: actor,
        to: target,
        progress: 0,
        kind: landed ? "missile" : "detonation",
      });
    }
    return;
  }

  const surv = forceSurvivability(world, target);
  const pk = rung === "counterforce" ? 0.55 + atk.alert * 0.04 : 0.2;
  const destroyedFrac = clamp(pk * (1 - surv * 0.6) * (landed ? Math.max(frac, 0.12) : 0.02), 0, 0.85);
  const destroyed = round(def.survivingWarheads * destroyedFrac);
  def.survivingWarheads = Math.max(0, def.survivingWarheads - destroyed);
  def.stockpile = Math.max(0, def.stockpile - destroyed);
  def.c2Intact = def.c2Intact && (rung !== "counterforce" || !landed || chance(world, 0.65));

  let deaths: number;
  if (!landed) {
    deaths = report.outcome === "intercepted" ? 800 + round(nextUnit(world) * 12_000) : 0;
  } else if (yieldKt >= 20000) {
    deaths = round((12_000_000 + nextUnit(world) * 28_000_000) * Math.max(frac, 0.35));
    world.nuclearWinter += round(36 * Math.max(frac, 0.4));
    world.uncontrolled = true;
  } else if (rung === "tactical") {
    deaths = round((40_000 + nextUnit(world) * 250_000) * Math.max(frac, 0.15));
  } else if (rung === "counterforce") {
    deaths = round((400_000 + nextUnit(world) * 4_000_000) * Math.max(frac, 0.12));
    world.nuclearWinter += round((yieldKt >= 2000 ? 14 : 6) * Math.max(frac, 0.15));
  } else {
    deaths = round((8_000_000 + nextUnit(world) * 25_000_000) * Math.max(frac, 0.2));
    world.nuclearWinter += round((yieldKt >= 2000 ? 28 : 22) * Math.max(frac, 0.25));
  }

  report.yieldKt = yieldKt;
  report.deaths = deaths;
  world.lastStrike = report;

  def.casualties += deaths;
  world.worldCasualties += deaths;
  if (target === "US") world.usCasualties += deaths;
  if (target === world.playerId) world.playerCasualties += deaths;
  if (actor === world.playerId) {
    atk.legitimacy -= rung === "tactical" ? 18 : 35;
    atk.publicOpinion -= 12;
    atk.polarization += 10;
  }

  if (landed && (rung === "counterforce" || rung === "countervalue")) {
    degradeSensors(world, target);
  }

  if (!def.c2Intact && def.id === "RU") {
    const perimeter = def.systems.some((s) => s.id === "ru-perimeter");
    if (perimeter && chance(world, 0.62)) {
      log(
        world,
        "critical",
        "Russian C2 damaged. Perimeter is assessed to still be able to fire.",
        "Decapitation does not reliably prevent retaliation. Dead Hand exists specifically for this case.",
      );
      def.c2Intact = true;
      def.preDelegation = true;
    }
  }

  const yieldLabel = yieldKt >= 1000 ? `${(yieldKt / 1000).toFixed(1)} Mt` : `${yieldKt} kt`;
  log(
    world,
    "critical",
    `${atk.shortName} used nuclear weapons (${rung}, ~${yieldLabel}) against ${def.shortName} at ${location}. ${report.arrived}/${report.expected} RVs arrived. Estimated dead: ${deaths.toLocaleString()}. ${report.summary}`,
    !landed
      ? report.outcome === "intercepted"
        ? "The shot left. Defense claimed the RVs — or claimed they did. Debris and abort still kill. The taboo is broken either way. They may answer the launch, not the crater."
        : "Buses failed or RVs died on reentry. A fizzle is still first use. Capitals saw boosts. Pre-delegation clocks run."
      : yieldKt >= 20000
      ? "Tsar-class / Poseidon-class yield. This is not counterforce. Firestorm and famine are the mechanism. Jacobsen: once it leaves, nothing recalls it."
      : rung === "tactical"
      ? "Tactical use is still nuclear use. Particular weapons fail. Particular interceptors miss. The other side must now choose between folding and answering."
      : "MIRV buses and decoys are how a thin defense is saturated. What arrives is what burns. ICBMs cannot be recalled.",
  );

  if (report.launched > 0) {
    world.missiles.push({
      id: `nuk-${world.turn}-${actor}-${target}`,
      from: actor,
      to: target,
      progress: 0,
      kind: landed ? "missile" : "detonation",
    });
  }
}

export function maybeRetaliate(world: World, victim: ActorId, attacker: ActorId, rung: NuclearRung) {
  const v = world.actors[victim];
  if (!v.nuclear && !v.hasDevice) return;
  if (victim === world.playerId) {
    log(
      world,
      "warn",
      "Incoming on your homeland. Retaliation is still an order you have to give — unless a fail-deadly system or a pre-delegated unit fires without you.",
      "The football (or Cheget, or the boat) is a control system. Riding out a strike and then deciding is possible. So is Perimeter. So is a rogue battery.",
    );
    if (v.preDelegation && chance(world, 0.22)) {
      applyNuclearUse(world, victim, attacker, "tactical", `${world.actors[attacker].shortName} forces (pre-delegated)`);
    }
    return;
  }
  if (!v.c2Intact && !v.preDelegation) {
    log(world, "warn", `${v.shortName} C2 is down. No authorized retaliation observed.`, "That can still change if a pre-delegated unit fires.");
    return;
  }
  const existential = v.casualties > 500_000 || v.survivingWarheads < v.stockpile * 0.4;
  let fire = false;
  let theirRung: NuclearRung = "tactical";

  if (v.doctrine === "nfu" && rung === "tactical" && !existential) {
    fire = chance(world, 0.25 + v.riskTolerance / 400);
    theirRung = "tactical";
  } else if (v.id === "KP") {
    fire = true;
    theirRung = existential ? "countervalue" : "tactical";
  } else if (v.doctrine === "escalate-to-deescalate") {
    fire = true;
    theirRung = rung === "demo" ? "tactical" : existential ? "counterforce" : "tactical";
  } else if (v.id === "PK") {
    fire = true;
    theirRung = "tactical";
  } else if (v.id === "CN") {
    v.declaredNfu = false;
    fire = existential || rung !== "demo";
    theirRung = existential ? "counterforce" : "tactical";
  } else {
    fire = rung !== "demo" || chance(world, 0.45);
    theirRung = existential ? "counterforce" : "tactical";
  }

  if (v.survivingWarheads <= 0 && !v.hasDevice) fire = false;
  if (!aiReleaseOk(world, victim, false)) fire = false;

  if (fire) {
    const loc =
      attacker === "US"
        ? theirRung === "tactical"
          ? "Guam / theater forces"
          : "CONUS counterforce"
        : `${world.actors[attacker].shortName} forces`;
    applyNuclearUse(world, victim, attacker, theirRung, loc);
  } else {
    log(
      world,
      "warn",
      `${v.shortName} did not answer with nuclear weapons — this pulse.`,
      "Withholding after being struck is possible. It is also unstable. The next pulse may not wait.",
    );
  }
}

export function strategicSpasm(world: World): boolean {
  const p = world.playerId;
  const homeland = world.nuclearUses.filter(
    (u) =>
      (u.rung === "counterforce" || u.rung === "countervalue") &&
      (u.target === p || u.target === "US" || u.target === "RU" || u.target === "CN" || u.target === "UK" || u.target === "FR"),
  );
  return (
    homeland.length >= 2 ||
    world.nuclearWinter >= 28 ||
    world.playerCasualties > 8_000_000 ||
    (world.uncontrolled && world.nuclearUses.length >= 4)
  );
}

export function resolvePlayerNuclear(world: World, action: PlayerAction) {
  const actor = world.playerId;
  const target = action.target ?? "KP";
  const page = pageById(world, action.book);
  const rung: NuclearRung = page.rung;
  const loc =
    rung === "countervalue"
      ? `${world.actors[target].shortName} cities (${page.short})`
      : target === "KP"
        ? rung === "tactical" || rung === "demo"
          ? "DPRK theater / demonstration"
          : "DPRK forces / WMD sites"
        : target === "IR"
          ? "Iranian nuclear sites"
          : target === "RU"
            ? page.id === "D"
              ? "CONUS / NATO cities (Tsar-class)"
              : "Russian counterforce"
            : target === "CN"
              ? "PLA Rocket Force / cities as packaged"
              : target === "NS"
                ? "suspected device site"
                : `${world.actors[target].shortName} ${page.name}`;
  applyNuclearUse(world, actor, target, rung, loc, Boolean(action.notify), page.yieldKt, action.packageMode);
  maybeRetaliate(world, target, actor, rung);
  if (target === "KP") {
    const cn = world.actors.CN;
    if (cn.hostility[actor] > 70 && chance(world, 0.2 + cn.alert * 0.05)) {
      log(world, "critical", "Beijing issued a nuclear warning over Korea.", "China treats collapse on its border as a vital interest. They may not fire. They will posture.");
      cn.alert = clamp(cn.alert + 2, 0, 5);
      bumpFlash(world, "taiwan", 10);
    }
  }
}

export function tickWinter(world: World) {
  const n = world.nuclearWinter;
  world.winterStage = n < 8 ? 0 : n < 16 ? 1 : n < 28 ? 2 : 3;
  if (n < 8) return;
  world.economy = clamp(world.economy - n * 0.12, 0, 100);
  for (const id of ["US", "RU", "SU", "CN", "FR", "UK", "IN", "PK", "IL", "KP", "IR", "CU"] as ActorId[]) {
    world.actors[id].unrest = clamp(world.actors[id].unrest + n * 0.06, 0, 100);
    world.actors[id].warFatigue = clamp(world.actors[id].warFatigue + n * 0.05, 0, 100);
  }
  if (n >= 16 && chance(world, 0.7)) {
    const famine = 80_000 + round(nextUnit(world) * 400_000 * (n / 16));
    world.worldCasualties += famine;
    log(
      world,
      "critical",
      `Nuclear winter effects: harvest failure, ~${famine.toLocaleString()} additional dead this month.`,
      "Soot in the stratosphere is not a metaphor. After enough city fires the food system is the weapon. Escalation past that point is not a ladder. It is a room you cannot leave.",
    );
  }
}

export function tickUncontrolled(world: World) {
  if (world.nuclearUses.length >= 2 || world.nuclearWinter >= 18) world.uncontrolled = true;
  if (!world.uncontrolled || world.ended) return;
  if (!chance(world, 0.34 + world.nuclearWinter / 220)) return;
  const shooters = (["US", "RU", "SU", "CN", "FR", "UK", "IN", "PK", "IL", "KP"] as ActorId[]).filter((id) => {
    const a = world.actors[id];
    return a.survivingWarheads > 4 && (a.c2Intact || a.preDelegation);
  });
  if (!shooters.length) return;
  const actor = shooters[Math.min(shooters.length - 1, round(nextUnit(world) * shooters.length))]!;
  const target =
    (Object.keys(world.actors) as ActorId[])
      .filter((id) => id !== actor && world.actors[id].nuclear)
      .sort((a, b) => world.actors[actor].hostility[b] - world.actors[actor].hostility[a])[0] ?? (actor === "US" ? "RU" : "US");
  log(
    world,
    "critical",
    `Escalation left the room. ${world.actors[actor].shortName} fired without a completed cabinet decision this pulse.`,
    "Use-it-or-lose-it, pre-delegation, fail-deadly systems, and eager officers are how a war continues after the people who started it would like to stop. You do not get a vote on this pulse.",
  );
  applyNuclearUse(world, actor, target, "tactical", `${world.actors[target].shortName} forces (uncontrolled)`);
}


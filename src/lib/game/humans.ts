import type { ActorId, OfficerStance, PlayerAction, World } from "./types";
import { chance, clamp, pick } from "./rng";
import { log } from "./simLog";

function hostilityOf(world: World, a: ActorId, b: ActorId): number {
  return world.actors[a]?.hostility[b] ?? 50;
}

export type Temper = "freeze" | "cave" | "steady" | "hawk" | "panic";

export interface HumanReaction {
  actor: ActorId;
  desk: string;
  temper: Temper;
  kind: Temper;
  line: string;
  why: string;
}

export function temperOf(nerve: number): Temper {
  if (nerve < 22) return "freeze";
  if (nerve < 40) return "cave";
  if (nerve < 64) return "steady";
  if (nerve < 82) return "hawk";
  return "panic";
}

export function temperLabel(t: Temper): string {
  if (t === "freeze") return "FREEZE";
  if (t === "cave") return "CAVE";
  if (t === "steady") return "STEADY";
  if (t === "hawk") return "HAWK";
  return "PANIC";
}

export function temperLine(t: Temper): string {
  if (t === "freeze")
    return "Cannot decide. C2 stalls. A real attack may land. A false alarm may die on the desk.";
  if (t === "cave")
    return "Takes the off-ramp and loses face. Coup risk up. War risk down — until a hawk replaces them.";
  if (t === "steady")
    return "Professional. Checks the file. Can refuse a bad order. Can also wait too long.";
  if (t === "hawk")
    return "Wants to match or shoot. Reads HOLD as weakness. Reads talks as time to generate.";
  return "Afraid of looking weak or losing the arsenal. That fear fires. Use-it-or-lose-it in a person.";
}

export function stanceFromNerve(nerve: number, machine: boolean): OfficerStance {
  if (machine) return "machine";
  const t = temperOf(nerve);
  if (t === "freeze") return "shaken";
  if (t === "cave") return "coward";
  if (t === "hawk") return "eager";
  if (t === "panic") return "eager";
  return "professional";
}

const DESKS: Partial<Record<ActorId, string[]>> = {
  US: ["SecDef", "CJCS", "NMCC watch", "Minuteman flight"],
  RU: ["Defense Minister", "General Staff", "RVSN duty", "Perimeter watch"],
  CN: ["CMC vice chair", "Rocket Force", "CMC staff"],
  UK: ["CDS", "Trident watch"],
  FR: ["CEMA", "SSBN watch"],
  IN: ["CDS", "Strategic Forces"],
  PK: ["SPD", "corps commander", "Nasr battery"],
  IL: ["Defense Minister", "air staff"],
  SU: ["General Secretary staff", "USSR Defense Minister", "claimed RVSN", "Minsk duty"],
  CU: ["FAR chief", "Havana air defense", "Mariel watch"],
  CR: ["plaza boss", "corridor boss", "port fixer", "colonel on the ledger"],
  NS: ["emir", "engineer", "courier", "facilitator"],
};

export function deskName(world: World, id: ActorId): string {
  return pick(world, DESKS[id] ?? ["staff"]);
}

export function nudgeNerve(world: World, id: ActorId, delta: number) {
  const a = world.actors[id];
  if (!a) return;
  a.nerve = clamp((a.nerve ?? a.riskTolerance ?? 50) + delta, 0, 100);
}

export function fireBias(world: World, id: ActorId): number {
  const t = temperOf(world.actors[id]?.nerve ?? 50);
  if (t === "freeze") return -0.28;
  if (t === "cave") return -0.18;
  if (t === "steady") return 0;
  if (t === "hawk") return 0.16;
  return 0.28;
}

function subjectIds(world: World, action: PlayerAction): ActorId[] {
  const you = world.playerId;
  const ids: ActorId[] = [];
  if (action.target && action.target !== you) ids.push(action.target);
  if (world.event.actor !== you && !ids.includes(world.event.actor)) ids.push(world.event.actor);
  const hot = [...world.flashpoints].sort((a, b) => b.heat - a.heat)[0];
  if (hot) {
    for (const id of hot.actors) {
      if (id !== you && !ids.includes(id)) ids.push(id);
    }
  }
  return ids.filter((id) => world.actors[id] && !world.actors[id].nonstate).slice(0, 3);
}

function driftFromAction(action: PlayerAction, t: Temper): number {
  if (action.kind === "hold") return t === "hawk" || t === "panic" ? 7 : t === "steady" ? 1 : -5;
  if (action.kind === "diplomacy") return t === "hawk" || t === "panic" ? 5 : -7;
  if (action.kind === "pressure") return t === "cave" || t === "freeze" ? -4 : 6;
  if (action.kind === "posture") return action.notify ? 3 : 8;
  if (action.kind === "kill") return 6;
  if (action.kind === "employ") return action.intensity >= 2 ? (t === "freeze" ? -18 : 14) : 9;
  if (action.kind === "intelligence" || action.kind === "covert") return 1;
  return 0;
}

function reactionFor(world: World, id: ActorId, action: PlayerAction): HumanReaction {
  const a = world.actors[id];
  const t = temperOf(a.nerve ?? 50);
  const desk = deskName(world, id);
  const you = world.actors[world.playerId].shortName;
  const vs = hostilityOf(world, id, world.playerId);
  let line = "";
  let why = temperLine(t);

  if (t === "freeze") {
    line = `${a.shortName} ${desk}: no decision this month. The file sits.`;
    why = "Cowardice as stall. They did not match you. They also did not answer. If the track is real, they eat it.";
    a.warning = clamp(a.warning - 3, 5, 100);
  } else if (t === "cave") {
    line = `${a.shortName} ${desk}: looking for the door. Hostility down. Face gone.`;
    why = "Cowardice as concession. They will take talks. Their street and their hawks will not.";
    a.hostility[world.playerId] = clamp(vs - 8, 0, 100);
    a.legitimacy = clamp(a.legitimacy - 6, 0, 100);
    a.unrest = clamp(a.unrest + 5, 0, 100);
    a.alert = clamp(a.alert - 1, 0, 5);
  } else if (t === "steady") {
    if (action.kind === "diplomacy") {
      line = `${a.shortName} ${desk}: will take a call. They still want a file, not a speech.`;
      a.trust[world.playerId] = clamp(a.trust[world.playerId] + 3, 0, 100);
    } else if (action.kind === "hold") {
      line = `${a.shortName} ${desk}: logged your hold. Professionals wait. Hawks in their building will not.`;
    } else {
      line = `${a.shortName} ${desk}: matching at the minimum. No extra pulse.`;
      if (action.kind === "posture") a.alert = clamp(a.alert + 1, 0, 5);
    }
  } else if (t === "hawk") {
    line =
      action.kind === "hold"
        ? `${a.shortName} ${desk}: reads your hold as weakness. Generating.`
        : action.kind === "diplomacy"
          ? `${a.shortName} ${desk}: talks are time. They generate while you speak.`
          : `${a.shortName} ${desk}: matching you, plus one. Aggression is the policy.`;
    why = "Hawks want the shot. HOLD and DIPLOMACY both look like openings unless you are already hotter than they are.";
    a.hostility[world.playerId] = clamp(vs + 7, 0, 100);
    a.alert = clamp(a.alert + (action.kind === "posture" || action.kind === "employ" ? 2 : 1), 0, 5);
    a.nationalism = clamp(a.nationalism + 4, 0, 100);
  } else {
    line = `${a.shortName} ${desk}: panic. Pre-delegation talk. Someone wants the keys at the battery.`;
    why =
      "Cowardice that fires. They are not eager for war. They are eager not to be the one who waited. Nasr, DPRK law, Perimeter — this is that person.";
    a.preDelegation = true;
    a.alert = clamp(a.alert + 2, 0, 5);
    a.hostility[world.playerId] = clamp(vs + 10, 0, 100);
  }

  void you;
  return { actor: id, desk, temper: t, kind: t, line, why };
}

export function reactToAction(world: World, action: PlayerAction) {
  if (!world.reactions) world.reactions = [];
  const ids = subjectIds(world, action);
  for (const id of ids) {
    const before = temperOf(world.actors[id].nerve ?? 50);
    nudgeNerve(world, id, driftFromAction(action, before));
    if (world.nuclearUses.length) {
      nudgeNerve(world, id, before === "freeze" ? -8 : 10);
    }
    const r = reactionFor(world, id, action);
    world.reactions.unshift(r);
    log(world, r.temper === "panic" || r.temper === "hawk" ? "warn" : "info", r.line, r.why);
  }
  world.reactions = world.reactions.slice(0, 6);

  const you = world.playerId;
  const me = world.actors[you];
  if (action.kind === "hold" && (world.event.heat === "high" || world.event.heat === "critical")) {
    nudgeNerve(world, you, me.nerve > 70 ? 4 : -3);
  }
  if (action.kind === "employ") nudgeNerve(world, you, action.intensity >= 2 ? 8 : 3);
  if (action.kind === "diplomacy") nudgeNerve(world, you, -4);
  syncPlayerDesk(world);
}

export function syncPlayerDesk(world: World) {
  const me = world.actors[world.playerId];
  if (!me || world.secondOfficer.stance === "machine") return;
  world.secondOfficer.stance = stanceFromNerve(me.nerve ?? 50, false);
}

export function tickNerve(world: World) {
  for (const a of Object.values(world.actors)) {
    const base = a.riskTolerance ?? 50;
    const n = a.nerve ?? base;
    a.nerve = clamp(n + (base - n) * 0.08, 0, 100);
    if (world.defcon <= 2) a.nerve = clamp(a.nerve + 3, 0, 100);
    if (a.casualties > 100_000) a.nerve = clamp(a.nerve + 6, 0, 100);
    if (a.unrest > 70) a.nerve = clamp(a.nerve + (a.nerve > 55 ? 4 : -4), 0, 100);
  }
  syncPlayerDesk(world);
}

export function panicMayFire(world: World, id: ActorId): boolean {
  const a = world.actors[id];
  if (!a?.nuclear && !a?.hasDevice) return false;
  if (temperOf(a.nerve ?? 50) !== "panic") return false;
  const heat = Math.max(0, ...world.flashpoints.filter((f) => f.actors.includes(id)).map((f) => f.heat));
  return chance(world, 0.06 + heat / 900 + (world.defcon <= 2 ? 0.08 : 0));
}

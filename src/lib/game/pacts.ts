import type { ActorId, World } from "./types";
import { addTrust, addHostility } from "./world";
import { log } from "./simLog";
import { chance, clamp } from "./rng";

export interface NonAttackPact {
  a: ActorId;
  b: ActorId;
  untilTurn: number;
  broken: boolean;
}

export function hasPact(world: World, a: ActorId, b: ActorId): boolean {
  return (world.pacts ?? []).some(
    (p) => !p.broken && p.untilTurn >= world.turn && ((p.a === a && p.b === b) || (p.a === b && p.b === a)),
  );
}

export function proposePact(world: World, you: ActorId, target: ActorId) {
  if (!world.pacts) world.pacts = [];
  if (hasPact(world, you, target)) {
    log(world, "info", `${world.actors[target].shortName} already has a pact on file.`, "Renewal extends trust. Breaking it later spikes hostility.");
    return;
  }
  const accept = chance(world, 0.35 + world.actors[target].trust[you] / 200);
  if (!accept) {
    log(world, "warn", `${world.actors[target].shortName} declined a non-attack pact.`, "They may read it as weakness or as a trap.");
    addHostility(world, target, you, 4);
    return;
  }
  world.pacts.push({ a: you, b: target, untilTurn: world.turn + 12, broken: false });
  addTrust(world, you, target, 12);
  addTrust(world, target, you, 8);
  log(
    world,
    "info",
    `Non-attack pact with ${world.actors[target].shortName} until turn ${world.turn + 12}.`,
    "First Strike-style pact. Breaking it spikes hostility. AI respects unless flashpoint heat is extreme.",
  );
}

export function breakPactIfAggressive(world: World, actor: ActorId, target: ActorId, actionKind: string) {
  if (actionKind === "hold" || actionKind === "diplomacy") return;
  if (!hasPact(world, actor, target)) return;
  for (const p of world.pacts ?? []) {
    if (p.broken) continue;
    if ((p.a === actor && p.b === target) || (p.a === target && p.b === actor)) {
      p.broken = true;
      addHostility(world, target, actor, 22);
      addHostility(world, actor, target, 14);
      log(world, "critical", `Pact broken: ${world.actors[actor].shortName} moved against ${world.actors[target].shortName}.`, "Betrayal is remembered. Allies downgrade trust.");
    }
  }
}

export function tickPacts(world: World) {
  for (const p of world.pacts ?? []) {
    if (!p.broken && p.untilTurn < world.turn) {
      p.broken = true;
      log(world, "info", `Pact ${world.actors[p.a].shortName}–${world.actors[p.b].shortName} expired.`, "Renew with diplomacy weight 3.");
    }
  }
  world.pacts = (world.pacts ?? []).filter((p) => !p.broken || p.untilTurn >= world.turn - 2);
}

export function aiRespectsPact(world: World, actor: ActorId, target: ActorId): boolean {
  if (!hasPact(world, actor, target)) return false;
  const heat = Math.max(...world.flashpoints.filter((f) => f.actors.includes(actor)).map((f) => f.heat), 0);
  return heat < 85;
}

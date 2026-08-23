import type { ActorId, World } from "./types";
import { addHostility, addTrust, setDefcon } from "./world";
import { log } from "./simLog";
import { chance, clamp } from "./rng";

export function hasCeasefire(world: World, a: ActorId, b: ActorId): boolean {
  const c = world.ceasefire;
  if (!c || c.broken || !c.accepted || c.untilTurn < world.turn) return false;
  return (c.a === a && c.b === b) || (c.a === b && c.b === a);
}

export function proposeCeasefire(world: World, you: ActorId, target: ActorId): boolean {
  if (world.nuclearUses.length === 0) return false;
  if (hasCeasefire(world, you, target)) {
    world.ceasefire!.untilTurn = world.turn + 4;
    addTrust(world, you, target, 4);
    log(world, "info", `Ceasefire with ${world.actors[target].shortName} extended.`, "The guns stay quiet if both sides hold.");
    return true;
  }
  const them = world.actors[target];
  const deadWeight = clamp(them.casualties / 8_000_000, 0, 0.35);
  const trustW = (them.trust[you] ?? 30) / 280;
  const winterW = world.nuclearWinter / 200;
  const hard = world.uncontrolled ? 0.18 : 0;
  const p = clamp(0.22 + deadWeight + trustW + winterW - hard, 0.08, 0.82);
  if (!chance(world, p)) {
    log(
      world,
      "warn",
      `${them.shortName} refused a ceasefire.`,
      "They may still be deciding whether the last pulse was limited. Another shot ends the file.",
    );
    addHostility(world, target, you, 6);
    return false;
  }
  world.ceasefire = { a: you, b: target, untilTurn: world.turn + 4, accepted: true, broken: false };
  world.uncontrolled = false;
  setDefcon(world, world.defcon + 1);
  addTrust(world, you, target, 10);
  addTrust(world, target, you, 8);
  world.globalRisk = clamp(world.globalRisk - 14, 0, 100);
  log(
    world,
    "info",
    `Ceasefire with ${them.shortName} until turn ${world.turn + 4}.`,
    "EMPLOY or a major generate breaks it. HOLD and DIPLOMACY keep it. Winter and pre-delegation can still leak a shot.",
  );
  return true;
}

export function breakCeasefire(world: World, actor: ActorId, target: ActorId, reason: string) {
  if (!hasCeasefire(world, actor, target) || !world.ceasefire) return;
  world.ceasefire.broken = true;
  addHostility(world, target, actor, 18);
  world.uncontrolled = true;
  log(
    world,
    "critical",
    `Ceasefire broken by ${world.actors[actor].shortName}: ${reason}`,
    "A broken ceasefire is worse than no ceasefire. They will not take the next offer cheaply.",
  );
}

export function tickCeasefire(world: World) {
  const c = world.ceasefire;
  if (!c || c.broken) return;
  if (c.untilTurn < world.turn && c.accepted) {
    c.broken = true;
    log(world, "info", "Ceasefire expired. Renew with a summit.", "The pause is over unless someone extends it.");
  }
}

export function ceasefirePeaceReady(world: World): boolean {
  const c = world.ceasefire;
  if (!c || !c.accepted || c.broken) return false;
  if (world.nuclearUses.length === 0) return false;
  const lastUse = Math.max(...world.nuclearUses.map((u) => u.turn));
  return world.turn - lastUse >= 3 && world.nuclearWinter < 28 && world.playerCasualties < 20_000_000;
}

import type { World } from "./types";
import { clamp } from "./rng";
import { log } from "./simLog";

export type C2StanceId = "low" | "nfu" | "predel";

export function c2StanceReady(world: World): boolean {
  return (world.c2StanceTurn ?? 0) !== world.turn;
}

export function applyC2Stance(world: World, id: C2StanceId): boolean {
  if (!c2StanceReady(world)) {
    log(world, "warn", "C2 already moved this month.", "One stance change per turn. The rest is next month's order.");
    return false;
  }
  const you = world.actors[world.playerId];
  world.c2StanceTurn = world.turn;
  if (id === "low") {
    you.launchOnWarning = !you.launchOnWarning;
    you.warning = clamp(you.warning + (you.launchOnWarning ? 6 : -4), 5, 100);
    log(
      world,
      you.launchOnWarning ? "warn" : "info",
      you.launchOnWarning ? "Launch-on-warning is armed." : "Launch-on-warning is stood down.",
      you.launchOnWarning
        ? "You will have minutes, not hours. False tracks become first-use risk. Survival against surprise goes up."
        : "You ride out the first pulse unless you order otherwise. Petrov's choice is back on the desk.",
    );
    return true;
  }
  if (id === "nfu") {
    you.declaredNfu = !you.declaredNfu;
    you.legitimacy = clamp(you.legitimacy + (you.declaredNfu ? 4 : -3), 0, 100);
    log(
      world,
      "info",
      you.declaredNfu ? "No-first-use statement issued." : "No-first-use walked back.",
      you.declaredNfu
        ? "Audience cost if you fire first. Adversaries may still not believe you. Retaliation after a homeland strike is still on the table."
        : "Ambiguity is back. Allies and adversaries both rewrite the file.",
    );
    return true;
  }
  you.preDelegation = !you.preDelegation;
  you.secondStrike = clamp(you.secondStrike + (you.preDelegation ? 8 : -6), 0, 99);
  you.militaryLoyalty = clamp(you.militaryLoyalty + (you.preDelegation ? -4 : 3), 0, 100);
  log(
    world,
    you.preDelegation ? "warn" : "info",
    you.preDelegation ? "Pre-delegation authorized." : "Pre-delegation pulled back.",
    you.preDelegation
      ? "Field units and boats may fire if they lose the line. Second strike is more credible. Rogue and panic fire are more likely."
      : "Positive control is back in the room. A decapitation may now silence the arsenal.",
  );
  return true;
}

import type { ActorId, PlayableId, World } from "./types";
import { clamp } from "./rng";
import { log } from "./simLog";
import { bumpFlash } from "./world";

export type DoctrineUpgradeId = "pal" | "sbirs" | "hotline" | "humint";

export interface DoctrineChoice {
  id: DoctrineUpgradeId;
  label: string;
  detail: string;
}

export function doctrineDue(world: World): boolean {
  return world.turn > 1 && world.turn % 6 === 0 && !world.doctrinePending;
}

export function doctrineOptions(world: World): DoctrineChoice[] {
  const p = world.playerId;
  const base: DoctrineChoice[] = [
    { id: "pal", label: "Harden PAL / two-man", detail: "Officers refuse rogue orders more often." },
    { id: "sbirs", label: "Retask early warning", detail: "Lower false-alarm rate on IR/radar nets." },
    { id: "hotline", label: "Hotline redundancy", detail: "+8 reliability on your dedicated lines." },
    { id: "humint", label: "Deepen HUMINT", detail: "+6 intel; spy quality at your sites." },
  ];
  if (p === "IR") return base.filter((b) => b.id === "humint" || b.id === "pal");
  if (p === "KP" || p === "NS" || p === "CR") return base.filter((b) => b.id === "humint");
  return base;
}

export function applyDoctrine(world: World, id: DoctrineUpgradeId) {
  const you = world.playerId;
  world.doctrinePending = false;
  if (id === "pal") {
    world.actors[you].militaryLoyalty = clamp(world.actors[you].militaryLoyalty + 6, 0, 100);
    log(world, "info", "PAL and two-man rule hardened.", "Refusal odds improve. Eager officers still exist.");
  }
  if (id === "sbirs") {
    for (const s of world.sensors.filter((x) => x.owner === you)) {
      s.falseAlarm = clamp(s.falseAlarm - 4, 4, 50);
      s.coverage = clamp(s.coverage + 3, 0, 98);
    }
    world.actors[you].warning = clamp(world.actors[you].warning + 8, 0, 100);
    log(world, "info", "Early-warning retask complete.", "Close calls may resolve cleaner. Does not stop a real attack.");
  }
  if (id === "hotline") {
    for (const h of world.hotlines.filter((x) => x.a === you || x.b === you)) {
      h.reliability = clamp(h.reliability + 8, 5, 99);
    }
    log(world, "info", "Hotline redundancy expanded.", "Dedicated lines answer more often.");
  }
  if (id === "humint") {
    world.actors[you].intel = clamp(world.actors[you].intel + 6, 0, 100);
    bumpFlash(world, "terror", -2);
    for (const s of world.sites ?? []) {
      if (s.ourSpy && !s.ourSpy.burned) s.ourSpy.quality = clamp(s.ourSpy.quality + 8, 0, 100);
    }
    log(world, "info", "HUMINT depth increased.", "Arsenal files and fence-line reports improve.");
  }
  if (!world.doctrineTaken) world.doctrineTaken = [];
  world.doctrineTaken.push(id);
}

export function markDoctrinePending(world: World) {
  world.doctrinePending = true;
}

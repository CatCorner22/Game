import type { ActorId, DoctrineUpgradeId, World } from "./types";
import { clamp } from "./rng";
import { log } from "./simLog";
import { bumpFlash } from "./world";

export type { DoctrineUpgradeId };

export interface DoctrineChoice {
  id: DoctrineUpgradeId;
  label: string;
  detail: string;
}

export function doctrineDue(world: World): boolean {
  return world.turn > 1 && world.turn % 6 === 0 && !world.doctrinePending;
}

function hasStrategicBus(world: World): boolean {
  return world.actors[world.playerId].systems.some(
    (s) => (s.kind === "icbm" || s.kind === "slbm" || s.kind === "mrbm" || s.kind === "irbm") && (s.warheads > 0 || s.launchers > 0),
  );
}

export function doctrineOptions(world: World): DoctrineChoice[] {
  const p = world.playerId;
  const base: DoctrineChoice[] = [
    { id: "pal", label: "Harden PAL / two-man", detail: "Officers refuse rogue orders more often." },
    { id: "sbirs", label: "Retask early warning", detail: "Lower false-alarm rate on IR/radar nets." },
    { id: "hotline", label: "Hotline redundancy", detail: "+8 reliability on your dedicated lines." },
    { id: "humint", label: "Deepen HUMINT", detail: "+6 intel; spy quality at your sites." },
    { id: "mirv", label: "MIRV upload", detail: "+1 RV on ICBM/SLBM/MRBM buses. Saturate thin defense." },
    { id: "decoys", label: "Penetration aids", detail: "+2 decoys and better shrouds. Interceptors spend on ghosts." },
  ];
  if (p === "IR") return base.filter((b) => b.id === "humint" || b.id === "pal");
  if (p === "KP" || p === "NS" || p === "CR") return base.filter((b) => b.id === "humint" || (hasStrategicBus(world) && (b.id === "decoys" || b.id === "mirv")));
  if (p === "CU") return base.filter((b) => b.id === "humint" || b.id === "hotline");
  if (!hasStrategicBus(world)) return base.filter((b) => b.id !== "mirv" && b.id !== "decoys");
  return base;
}

function uploadBuses(world: World, you: ActorId, rvs: number, decoys: number, aids: number) {
  for (const s of world.actors[you].systems) {
    if (s.kind === "icbm" || s.kind === "slbm" || s.kind === "mrbm" || s.kind === "irbm") {
      if (rvs) s.rvsPerBus = clamp((s.rvsPerBus ?? 1) + rvs, 1, 14);
      if (decoys) s.decoys = (s.decoys ?? 0) + decoys;
      if (aids) s.penetrationAids = clamp((s.penetrationAids ?? 0) + aids, 0, 0.95);
    }
  }
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
  if (id === "mirv") {
    uploadBuses(world, you, 1, 0, 0);
    world.armsRace = clamp(world.armsRace + 8, 0, 100);
    log(
      world,
      "warn",
      "MIRV upload authorized.",
      "Buses carry one more RV. NTM will see the work. Thin missile defense is why this file exists.",
    );
  }
  if (id === "decoys") {
    uploadBuses(world, you, 0, 2, 0.12);
    world.armsRace = clamp(world.armsRace + 5, 0, 100);
    log(
      world,
      "info",
      "Penetration aids and decoys uploaded.",
      "Balloons, chaff, cooled shrouds. Interceptors have a finite magazine. Ghosts spend it.",
    );
  }
  if (!world.doctrineTaken) world.doctrineTaken = [];
  world.doctrineTaken.push(id);
}

export function markDoctrinePending(world: World) {
  world.doctrinePending = true;
}

import type { PlayerAction, Treaty, World } from "./types";
import { log } from "./simLog";

export type TreatyStatus = Treaty["status"];

export function seedTreaties(world: World): Treaty[] {
  return [
    {
      id: "new-start",
      name: "New START",
      parties: ["US", "RU"],
      status: world.newStartDead ? "dead" : "in-force",
      note: world.newStartDead ? "Expired. Uploads are legal. Destabilizing." : "Counts still constrain buses.",
    },
    {
      id: "jcpoa",
      name: "JCPOA",
      parties: ["US", "IR", "FR", "UK"],
      status: world.actors.IR.breakoutWeeks < 40 ? "suspended" : "strained",
      note: "Snap inspections are a fight, not a schedule.",
    },
    {
      id: "npt",
      name: "NPT",
      parties: ["US", "RU", "CN", "FR", "UK"],
      status: "in-force",
      note: "Threshold states sit outside. A device in Tehran or a cartel port is an NPT crisis anyway.",
    },
    {
      id: "ost",
      name: "Outer Space Treaty",
      parties: ["US", "RU", "CN"],
      status: (world.flashpoints.find((f) => f.id === "space")?.heat ?? 0) >= 60 ? "strained" : "in-force",
      note: "No WMDs in orbit. Direct-ascent ASATs are the gray zone.",
    },
    {
      id: "hotline-accords",
      name: "Hotline accords",
      parties: ["US", "RU", "CN"],
      status: "in-force",
      note: "Dedicated lines. Reliability is a number. Spoofing is a crime against the file.",
    },
  ];
}

export function ensureTreaties(world: World) {
  if (!world.treaties?.length) world.treaties = seedTreaties(world);
}

function setStatus(world: World, id: string, status: TreatyStatus, note?: string) {
  const t = world.treaties?.find((x) => x.id === id);
  if (!t || t.status === status) return;
  t.status = status;
  if (note) t.note = note;
}

export function tickTreaties(world: World, action: PlayerAction) {
  ensureTreaties(world);
  const space = world.flashpoints.find((f) => f.id === "space")?.heat ?? 0;
  if (space >= 70) setStatus(world, "ost", "strained", "Warning coverage is thin. The treaty did not stop the shot.");
  if (world.newStartDead) setStatus(world, "new-start", "dead", "Expired. Uploads are legal. Destabilizing.");
  if (world.actors.IR.hasDevice || world.actors.IR.breakoutWeeks < 16) {
    setStatus(world, "jcpoa", "dead", "Breakout overtook the deal.");
  }
  if (action.kind === "employ" && action.intensity >= 2) {
    setStatus(world, "npt", "strained", "Nuclear employment this month. The taboo is the treaty that matters.");
  }
  if (world.event.id === "asat-shot" || world.event.id === "asat-blind-scenario") {
    setStatus(world, "ost", "strained", "A warning bird is dark. OST did not cover this.");
    log(world, "warn", "Outer Space Treaty strained after the warning-bird event.", "ASATs live in the gray. Coverage does not.");
  }
  if (
    world.event.id === "fobs-track" ||
    world.event.id === "fobs-scenario" ||
    world.event.id === "nukesat-rumor" ||
    world.event.id === "hunter-killer" ||
    world.event.id === "orbital-kinetic"
  ) {
    setStatus(
      world,
      "ost",
      "strained",
      "FOBS, a nukesat rumor, or a co-orbital hunter is in the file. OST bans WMDs in orbit. The gray is the point.",
    );
  }
  if (world.event.id === "upload-mirv") {
    setStatus(world, "new-start", "dead", "Upload file is on the desk because the treaty is dead.");
  }
}

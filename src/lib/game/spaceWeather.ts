import type { ActorId, FlashKind, GameEvent, PlayerAction, SpaceWeather, World } from "./types";
import { chance, clamp, nextInt } from "./rng";
import { log } from "./simLog";

export type { SpaceWeather, FlareClass } from "./types";

export function weatherHostile(sw?: SpaceWeather | null): boolean {
  return !!sw && (sw.cmeInbound || sw.flare === "carrington" || sw.flare === "X");
}

function bumpSpace(world: World, id: FlashKind, delta: number) {
  const f = world.flashpoints.find((x) => x.id === id);
  if (f) f.heat = clamp(f.heat + delta, 0, 100);
}

export function quietWeather(): SpaceWeather {
  return {
    kp: 2,
    flare: "quiet",
    cmeInbound: false,
    hoursToArrival: null,
    gridStress: 0,
    satStress: 0,
    lastNote: "Quiet sun. Kp low. Warning birds are not storm-blind.",
  };
}

export function seedCarringtonWatch(): SpaceWeather {
  return {
    kp: 7,
    flare: "X",
    cmeInbound: true,
    hoursToArrival: 18,
    gridStress: 28,
    satStress: 34,
    lastNote: "X-class flare. CME inbound. 1859 Carrington is the comparison file. Grid islanding is the civilian move. POSTURE looks like you read it as EMP.",
  };
}

export function seedCarringtonHit(): SpaceWeather {
  return {
    kp: 9,
    flare: "carrington",
    cmeInbound: false,
    hoursToArrival: 0,
    gridStress: 82,
    satStress: 88,
    lastNote: "Carrington-class arrival. Auroras to the tropics. Telegraph-era 1859 — today it is transformers, birds, and a first-strike read.",
  };
}

export function seedHalloween(): SpaceWeather {
  return {
    kp: 8,
    flare: "X",
    cmeInbound: true,
    hoursToArrival: 28,
    gridStress: 40,
    satStress: 62,
    lastNote: "Halloween-class series. 2003 fried a Japanese bird and forced ISS to shelter. This is a week of X-flares, not one pulse.",
  };
}

export function seedQuebec(): SpaceWeather {
  return {
    kp: 9,
    flare: "X",
    cmeInbound: false,
    hoursToArrival: 0,
    gridStress: 74,
    satStress: 36,
    lastNote: "1989 Quebec-class: a nine-hour blackout from one geomagnetic induced current. Transformers, not warheads.",
  };
}

export function seedMiyakeWatch(): SpaceWeather {
  return {
    kp: 9,
    flare: "X",
    cmeInbound: true,
    hoursToArrival: 14,
    gridStress: 48,
    satStress: 56,
    lastNote: "Miyake-class (774/993 AD) is the carbon-14 file — maybe ten Carringtons. If the comparison holds, islanding is not optional.",
  };
}

export function stormHitEvent(player: ActorId): GameEvent {
  return {
    id: "carrington-hit",
    title: "Aurora at the tropics",
    body: "The CME is here. HF is dead. Two GEO warning birds are in safe mode. Transformers are tripping. Their desk may write EMP or FOBS. Yours may too. INTEL separates the sun from a pulse. POSTURE without a notice is how a storm becomes a war.",
    actor: player,
    heat: "critical",
    ignoreLine: "No islanding. The file stays 'possible EMP.'",
    tags: ["space", "warning"],
    because: "The CME arrived this month. The sun wrote the next card.",
  };
}

export function armSpaceFromEvent(world: World) {
  const id = world.event.id;
  if (id === "carrington-watch" || id === "carrington-scenario") {
    if (!world.spaceWeather?.cmeInbound && world.spaceWeather?.flare !== "carrington") {
      world.spaceWeather = seedCarringtonWatch();
    }
  }
  if (id === "carrington-hit" && world.spaceWeather?.flare !== "carrington") {
    world.spaceWeather = seedCarringtonHit();
    applyStormToWorld(world, world.spaceWeather);
  }
  if (id === "halloween-storm") {
    world.spaceWeather = seedHalloween();
  }
  if (id === "quebec-blackout") {
    world.spaceWeather = seedQuebec();
    applyStormToWorld(world, world.spaceWeather);
  }
  if (id === "miyake-class") {
    world.spaceWeather = seedMiyakeWatch();
  }
}

function applyStormToWorld(world: World, sw: SpaceWeather) {
  const hit = sw.flare === "carrington" ? 1 : sw.flare === "X" ? 0.55 : sw.flare === "M" ? 0.25 : 0.08;
  for (const a of Object.values(world.actors)) {
    if (a.nonstate) continue;
    a.grid = clamp(a.grid - sw.gridStress * hit * 0.35, 0, 100);
    a.internet = clamp(a.internet - sw.satStress * hit * 0.28, 0, 100);
    a.warning = clamp(a.warning - sw.satStress * hit * 0.4, 5, 100);
    for (const s of a.systems) {
      if (s.kind === "orbital" || s.kind === "fobs") {
        s.reliability = clamp(s.reliability - hit * 0.12, 0.05, 0.95);
      }
    }
  }
  for (const s of world.sensors) {
    s.falseAlarm = clamp(s.falseAlarm + sw.satStress * hit * 0.12, 4, 70);
    s.coverage = clamp(s.coverage - sw.satStress * hit * 0.15, 8, 98);
  }
}

export function tickSpaceWeather(world: World): boolean {
  if (!world.spaceWeather) world.spaceWeather = quietWeather();
  const sw = world.spaceWeather;
  if (sw.cmeInbound && sw.hoursToArrival != null) {
    sw.hoursToArrival = Math.max(0, sw.hoursToArrival - 20);
    if (sw.hoursToArrival === 0) {
      world.spaceWeather = seedCarringtonHit();
      applyStormToWorld(world, world.spaceWeather);
      bumpSpace(world, "space", 16);
      world.globalRisk = clamp(world.globalRisk + 10, 0, 100);
      log(
        world,
        "critical",
        "CME arrived. Carrington-class. Grid and warning birds are in the storm.",
        "1859 burned telegraph lines. 2027 burns transformers and SBIRS. A generate now looks like you thought it was EMP.",
      );
      return true;
    }
    sw.lastNote = `CME inbound · ~${sw.hoursToArrival}h. Island the grid. Do not generate.`;
    return false;
  }

  if (sw.flare === "carrington" || sw.flare === "X") {
    sw.gridStress = clamp(sw.gridStress - 10, 0, 100);
    sw.satStress = clamp(sw.satStress - 8, 0, 100);
    sw.kp = clamp(sw.kp - 1, 1, 9);
    if (sw.gridStress < 20) {
      sw.flare = "M";
      sw.lastNote = "Storm decaying. Coverage is still thin.";
    }
    return false;
  }

  if (chance(world, 0.07)) {
    sw.flare = "M";
    sw.kp = 5;
    sw.gridStress = 12;
    sw.satStress = 14;
    sw.lastNote = "M-class flare. HF radio noisy. Not a Carrington.";
    bumpSpace(world, "space", 3);
  } else if (chance(world, 0.025)) {
    sw.flare = "X";
    sw.kp = 7;
    sw.cmeInbound = true;
    sw.hoursToArrival = 16 + nextInt(world, 0, 20);
    sw.gridStress = 22;
    sw.satStress = 28;
    sw.lastNote = `X-class. CME ~${sw.hoursToArrival}h. The 1859 comparison file is open.`;
    bumpSpace(world, "space", 8);
    log(world, "warn", "X-class flare. CME inbound.", sw.lastNote);
  } else if (sw.flare !== "quiet") {
    sw.flare = "quiet";
    sw.kp = 2;
    sw.gridStress = 0;
    sw.satStress = 0;
    sw.cmeInbound = false;
    sw.hoursToArrival = null;
    sw.lastNote = "Quiet sun.";
  }
  return false;
}

export function applyWeatherIgnore(world: World, action: PlayerAction) {
  const ev = world.event;
  const sw = world.spaceWeather ?? quietWeather();
  world.spaceWeather = sw;

  if (ev.id === "carrington-watch" || ev.id === "carrington-scenario") {
    if (action.kind === "hold") {
      world.spaceWeather = seedCarringtonHit();
      applyStormToWorld(world, world.spaceWeather);
      bumpSpace(world, "space", 18);
      log(
        world,
        "critical",
        "You held through the watch. The CME arrived. Transformers and birds took it.",
        ev.ignoreLine,
      );
    } else if (action.kind === "kill" && (action.target === world.playerId || !action.target)) {
      sw.lastNote = "You islanded the net/grid. Transformers may live. Warning still thins.";
      sw.gridStress = clamp(sw.gridStress - 18, 0, 100);
      log(world, "info", "Island the grid. That is how you treat a Carrington, not a bolt.", ev.ignoreLine);
    } else if (action.kind === "posture") {
      world.globalRisk = clamp(world.globalRisk + 12, 0, 100);
      bumpSpace(world, "nato-ru", 8);
      log(
        world,
        "warn",
        "You generated into a solar storm. Their desk may read EMP or first strike.",
        "1859 was the sun. They do not have to believe that.",
      );
    } else if (action.kind === "intelligence") {
      sw.lastNote = "SWPC + magnetometers corroborate. This is the sun, not a bus.";
      log(world, "info", "Second phenomenology: solar. Not a lofted bus.", ev.ignoreLine);
    }
  }

  if (ev.id === "carrington-hit" || ev.id === "quebec-blackout") {
    if (action.kind === "hold") {
      applyStormToWorld(world, ev.id === "quebec-blackout" ? seedQuebec() : seedCarringtonHit());
      world.economy = clamp(world.economy - 10, 0, 100);
      log(world, "warn", "No islanding. Cascades continue.", ev.ignoreLine);
    } else if (action.kind === "kill" && (action.target === world.playerId || !action.target)) {
      sw.gridStress = clamp(sw.gridStress - 16, 0, 100);
      log(world, "info", "You islanded after the hit. Some transformers may still live.", ev.ignoreLine);
    } else if (action.kind === "posture") {
      world.globalRisk = clamp(world.globalRisk + 10, 0, 100);
      log(world, "warn", "You generated into a live geomagnetic storm. Their desk may write EMP.", ev.ignoreLine);
    }
  }

  if ((ev.id === "halloween-storm" || ev.id === "miyake-class") && action.kind === "posture") {
    world.globalRisk = clamp(world.globalRisk + 10, 0, 100);
    bumpSpace(world, "nato-ru", 6);
    log(world, "warn", "You generated into a solar series. First-strike read is on the table.", ev.ignoreLine);
  }
  if ((ev.id === "halloween-storm" || ev.id === "miyake-class") && action.kind === "intelligence") {
    sw.lastNote = "Magnetometers and SWPC agree. This is the sun.";
    log(world, "info", "Second phenomenology: solar. Not a lofted bus.", ev.ignoreLine);
  }
  if ((ev.id === "halloween-storm" || ev.id === "miyake-class") && action.kind === "kill" && (action.target === world.playerId || !action.target)) {
    sw.gridStress = clamp(sw.gridStress - 14, 0, 100);
    log(world, "info", "Island the grid before the next pulse in the series.", ev.ignoreLine);
  }

  if ((ev.id === "fobs-track" || ev.id === "fobs-scenario") && action.kind === "hold") {
    bumpSpace(world, "space", 10);
    world.actors.RU.opacity = clamp(world.actors.RU.opacity + 4, 0, 100);
    log(world, "warn", "The fractional-orbit object stays up. The file stays ambiguous.", ev.ignoreLine);
  }

  if ((ev.id === "orbital-kinetic" || ev.id === "nukesat-rumor" || ev.id === "hunter-killer") && action.kind === "hold") {
    bumpSpace(world, "space", 8);
    log(world, "warn", "The orbital object stays in the file as suspected.", ev.ignoreLine);
  }
}

export function orbitalWeatherPenalty(world: World): number {
  const sw = world.spaceWeather;
  if (!sw) return 0;
  if (sw.flare === "carrington") return 0.35;
  if (sw.flare === "X" || sw.cmeInbound) return 0.18;
  if (sw.flare === "M") return 0.06;
  return 0;
}

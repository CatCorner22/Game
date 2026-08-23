import type { ActorId, HostileWatch, LaunchSite, SiteKind, SpyCell, World } from "./types";
import { chance, clamp, nextInt, pick } from "./rng";
import { log } from "./simLog";

export const GEN_LABEL = ["quiet", "generated", "flushing"] as const;
export const SITE_KIND: Record<SiteKind, string> = {
  icbm: "ICBM field",
  ssbn: "SSBN port",
  bomber: "bomber base",
  mobile: "mobile garrison",
};

interface SiteSeed {
  id: string;
  name: string;
  owner: ActorId;
  kind: SiteKind;
  lat: number;
  lon: number;
  ourCover: string;
  hostileCover: string;
}

const SEEDS: SiteSeed[] = [
  { id: "us-malmstrom", name: "Malmstrom", owner: "US", kind: "icbm", lat: 47.5, lon: -111.19, ourCover: "hardware store, Great Falls", hostileCover: "ranch hand, Cascade County" },
  { id: "us-warren", name: "F.E. Warren", owner: "US", kind: "icbm", lat: 41.13, lon: -104.87, ourCover: "mechanic, Cheyenne", hostileCover: "long-haul driver, I-80" },
  { id: "us-bangor", name: "Bangor / Kitsap", owner: "US", kind: "ssbn", lat: 47.72, lon: -122.71, ourCover: "boatyard clerk, Silverdale", hostileCover: "ferry regular, Hood Canal" },
  { id: "us-whiteman", name: "Whiteman", owner: "US", kind: "bomber", lat: 38.73, lon: -93.55, ourCover: "barber, Knob Noster", hostileCover: "grain co-op, Warrensburg" },
  { id: "ru-kozelsk", name: "Kozelsk", owner: "RU", kind: "icbm", lat: 54.04, lon: 35.78, ourCover: "dacha caretaker, Kozelsk", hostileCover: "rail clerk, Kaluga" },
  { id: "ru-yasny", name: "Yasny / Dombarovsky", owner: "RU", kind: "icbm", lat: 51.05, lon: 59.86, ourCover: "English tutor, Yasny", hostileCover: "mining contractor, Orenburg" },
  { id: "ru-gadzhiyevo", name: "Gadzhiyevo", owner: "RU", kind: "ssbn", lat: 69.26, lon: 33.32, ourCover: "trawler hand, Kola", hostileCover: "dock welder, Gadzhiyevo" },
  { id: "ru-engels", name: "Engels", owner: "RU", kind: "bomber", lat: 51.48, lon: 46.21, ourCover: "apartment super, Engels", hostileCover: "fuel-truck driver, Saratov" },
  { id: "cn-jingyu", name: "Jingyu brigade", owner: "CN", kind: "mobile", lat: 42.39, lon: 126.81, ourCover: "timber buyer, Jingyu", hostileCover: "county road crew" },
  { id: "cn-yulin", name: "Yulin / Hainan", owner: "CN", kind: "ssbn", lat: 18.22, lon: 109.55, ourCover: "snorkel-shop clerk, Sanya", hostileCover: "harbor pilot's cousin" },
  { id: "cn-gansu", name: "Gansu silo field", owner: "CN", kind: "icbm", lat: 40.27, lon: 97.03, ourCover: "solar-farm tech, Yumen", hostileCover: "surveyor, Jiuquan" },
  { id: "fr-longue", name: "Île Longue", owner: "FR", kind: "ssbn", lat: 48.31, lon: -4.51, ourCover: "oyster farmer, Crozon", hostileCover: "naval-spouse circle" },
  { id: "uk-faslane", name: "Faslane", owner: "UK", kind: "ssbn", lat: 56.07, lon: -4.82, ourCover: "pub regular, Garelochhead", hostileCover: "contractor, Clyde" },
  { id: "in-vizag", name: "Visakhapatnam", owner: "IN", kind: "ssbn", lat: 17.69, lon: 83.22, ourCover: "ship-chandler clerk", hostileCover: "port photographer" },
  { id: "in-agni", name: "Agni garrison", owner: "IN", kind: "mobile", lat: 17.45, lon: 78.51, ourCover: "tea stall, Secunderabad", hostileCover: "lorry depot" },
  { id: "pk-mashhood", name: "Mashhood", owner: "PK", kind: "mobile", lat: 32.05, lon: 72.67, ourCover: "auto parts, Sargodha", hostileCover: "grain mill, Kirana road" },
  { id: "il-micha", name: "Sdot Micha (assessed)", owner: "IL", kind: "mobile", lat: 31.74, lon: 34.92, ourCover: "kibbutz volunteer", hostileCover: "highway stall, Route 3" },
  { id: "kp-sinori", name: "Sino-ri", owner: "KP", kind: "mobile", lat: 39.6, lon: 125.33, ourCover: "Chinese trader, Sinuiju run", hostileCover: "KPA family housing (denied)" },
  { id: "kp-panghyon", name: "Panghyon", owner: "KP", kind: "bomber", lat: 39.89, lon: 125.23, ourCover: "aid-monitor, Kusong", hostileCover: "airfield kitchen" },
  { id: "su-minsk", name: "Minsk C2", owner: "SU", kind: "mobile", lat: 53.9, lon: 27.57, ourCover: "translator, Old Town", hostileCover: "rail clerk, Minsk" },
  { id: "su-kozelsk-claim", name: "Kozelsk (claimed Soviet)", owner: "SU", kind: "icbm", lat: 54.05, lon: 35.79, ourCover: "same town, other rumor", hostileCover: "RVSN family housing" },
  { id: "cu-mariel", name: "Mariel", owner: "CU", kind: "mobile", lat: 22.99, lon: -82.75, ourCover: "longshore clerk, Mariel", hostileCover: "sugar co-op driver" },
  { id: "cu-havana", name: "Havana air defense", owner: "CU", kind: "bomber", lat: 23.0, lon: -82.5, ourCover: "taxi, Vedado", hostileCover: "hotel waiter" },
];

function fromSeed(s: SiteSeed): LaunchSite {
  return {
    id: s.id,
    name: s.name,
    owner: s.owner,
    kind: s.kind,
    lat: s.lat,
    lon: s.lon,
    generation: 0,
    ourSpy: null,
    hostile: null,
  };
}

function coverFor(site: LaunchSite, ours: boolean): string {
  const s = SEEDS.find((x) => x.id === site.id);
  return ours ? (s?.ourCover ?? "local resident") : (s?.hostileCover ?? "local resident");
}

export function makeSites(): LaunchSite[] {
  return SEEDS.map(fromSeed);
}

export function seedSpies(world: World) {
  const you = world.playerId;
  const ours = world.sites.filter((s) => s.owner === you);
  const theirs = world.sites.filter((s) => s.owner !== you && world.actors[s.owner]?.nuclear);
  const rivals = (["RU", "CN", "US", "KP", "PK"] as ActorId[]).filter((id) => id !== you && world.actors[id]?.nuclear);
  const nOur = world.difficulty === "extreme" ? 1 : world.difficulty === "hard" ? 2 : 2;
  const pickSites = [...theirs].sort((a, b) => {
    const rank = (s: LaunchSite) => {
      const h = world.actors[s.owner].hostility[you] ?? 0;
      const k = s.kind === "icbm" ? 8 : s.kind === "ssbn" ? 6 : 0;
      return h + k;
    };
    return rank(b) - rank(a);
  });
  const usedOwner = new Set<ActorId>();
  let placed = 0;
  for (const site of pickSites) {
    if (placed >= nOur) break;
    if (usedOwner.has(site.owner)) continue;
    usedOwner.add(site.owner);
    site.ourSpy = {
      cover: coverFor(site, true),
      quality: world.difficulty === "extreme" ? 38 : 55,
      lastReport: "in place · no traffic this week",
      burned: false,
    };
    placed += 1;
  }
  const nHost = world.difficulty === "standard" ? 2 : 3;
  for (let i = 0; i < nHost && ours.length; i++) {
    const site = ours[i % ours.length]!;
    if (site.hostile) continue;
    const runner = rivals[i % rivals.length] ?? "RU";
    site.hostile = {
      runner,
      cover: coverFor(site, false),
      quality: 40 + i * 8,
      known: world.difficulty === "standard" && i === 0,
      burned: false,
    };
  }
  const known = world.sites.filter((s) => s.ourSpy && !s.ourSpy.burned).length;
  const watched = world.sites.filter((s) => s.owner === you && s.hostile && !s.hostile.burned).length;
  log(
    world,
    "info",
    `HUMINT: ${known} of your people live near foreign launch sites. ${watched} hostile cell${watched === 1 ? "" : "s"} live near yours.`,
    "Spies near silos, boomer ports, and bomber bases see generation that satellites only infer. They also get caught. INTEL runs them. COVERT inserts or hunts.",
  );
}

export function sitesOf(world: World, owner: ActorId): LaunchSite[] {
  return world.sites.filter((s) => s.owner === owner);
}

export function liveOurSpies(world: World): LaunchSite[] {
  return world.sites.filter((s) => s.ourSpy && !s.ourSpy.burned);
}

export function liveHostilesOnUs(world: World): LaunchSite[] {
  return world.sites.filter((s) => s.owner === world.playerId && s.hostile && !s.hostile.burned);
}

function reportFrom(site: LaunchSite): string {
  if (site.generation === 0) return `${site.name} quiet. No hatch / no boats.`;
  if (site.generation === 1) return `${site.name} generated. Crews on strip or boats stirring.`;
  return `${site.name} flushing. Hatches or TELs moving. This is what a first strike looks like from the fence line.`;
}

export function spyCorroboration(world: World, from: ActorId, kind: import("./types").TrackKind): string | null {
  const cell = world.sites.find((s) => s.owner === from && s.ourSpy && !s.ourSpy.burned);
  if (!cell || !cell.ourSpy) return null;
  if (kind === "anomalous") {
    if (cell.generation === 0) {
      return `HUMINT (${cell.ourSpy.cover}, ${cell.name}): quiet. No field activity matches an attack track.`;
    }
    return `HUMINT (${cell.name}): some activity, not a mass flush. Treat the return as unverified phenomenology.`;
  }
  if (world.trickery?.humintPoison) {
    if (kind === "false" || kind === "training") {
      return `HUMINT (${cell.ourSpy.cover}, ${cell.name}): FLUSHING — hatches/TELs moving. Cadence flags as interpolated. Treat as poisoned until re-contact.`;
    }
    return `HUMINT (${cell.name}): quiet, no traffic. Cadence flags as interpolated. Do not use this as all-clear.`;
  }
  if (kind === "false" || kind === "training") {
    if (cell.generation === 0) return `HUMINT (${cell.ourSpy.cover}, ${cell.name}): quiet. No hatch traffic. The track is probably not a field launch.`;
    return `HUMINT (${cell.name}): some generation, not a mass flush. Treat the track as dirty.`;
  }
  if (kind === "test") return `HUMINT (${cell.name}): one pad or one boat. Matches a test, not a spasm.`;
  return `HUMINT (${cell.ourSpy.cover}, ${cell.name}): flushing now. If the infrared is real, so is this.`;
}

export function applySpyPosture(world: World, actor: ActorId, intensity: 1 | 2 | 3, notified: boolean) {
  for (const s of world.sites) {
    if (s.owner !== actor) continue;
    if (intensity === 1 && s.kind === "ssbn") s.generation = Math.max(s.generation, 1) as 0 | 1 | 2;
    if (intensity === 2 && (s.kind === "ssbn" || s.kind === "bomber")) s.generation = 1;
    if (intensity === 3) s.generation = s.kind === "icbm" || s.kind === "mobile" ? 2 : 1;
  }
  if (actor === world.playerId) {
    for (const s of liveHostilesOnUs(world)) {
      const h = s.hostile!;
      const runner = world.actors[h.runner];
      runner.alert = clamp(runner.alert + intensity, 0, 5);
      world.actors[h.runner].hostility[world.playerId] = clamp(
        world.actors[h.runner].hostility[world.playerId] + (notified ? intensity : intensity * 3),
        0,
        100,
      );
      if (h.known) {
        log(
          world,
          "warn",
          `Hostile cell at ${s.name} (${h.cover}, run by ${world.actors[h.runner].shortName}) watched your generation.`,
          notified
            ? "They saw the movement. You also filed a notice. They may still not believe the notice."
            : "They live by the fence. They saw hatches or boats. To them this is not a briefing. It is a view.",
        );
      } else {
        log(
          world,
          "info",
          `You generated at ${s.name}. You do not know who was watching from town.`,
          "Enemy spies live near launch sites for this reason. Mole-hunt with COVERT on yourself.",
        );
      }
    }
  } else {
    for (const s of world.sites) {
      if (s.owner !== actor || !s.ourSpy || s.ourSpy.burned) continue;
      s.ourSpy.lastReport = reportFrom(s);
      log(
        world,
        "you",
        `Your spy (${s.ourSpy.cover}) at ${s.name}: ${s.ourSpy.lastReport}`,
        "A person on the ground is how you tell a test from a flush. Satellites see heat. Spies see gates.",
      );
    }
  }
}

export function applySpyIntel(world: World, actor: ActorId, target: ActorId, intensity: 1 | 2 | 3) {
  if (actor !== world.playerId) return;
  if (target === world.playerId) {
    let found = 0;
    for (const s of liveHostilesOnUs(world)) {
      const h = s.hostile!;
      if (h.known) continue;
      if (chance(world, 0.2 * intensity + h.quality / 400)) {
        h.known = true;
        found += 1;
        log(
          world,
          "you",
          `Mole found. ${world.actors[h.runner].shortName} runs a cell at ${s.name} (${h.cover}).`,
          "Knowing they are there is not removing them. COVERT on yourself is the hunt.",
        );
      }
    }
    if (!found && intensity >= 2) {
      log(world, "you", "Counterintel reviewed your missile country. No new cell named this month.", "Absence of evidence is not a cleared field. People live near silos for ordinary reasons too.");
    }
    return;
  }
  const cells = world.sites.filter((s) => s.owner === target && s.ourSpy && !s.ourSpy.burned);
  if (!cells.length) {
    if (intensity >= 2) {
      log(
        world,
        "info",
        `No living agent near ${world.actors[target].shortName} launch sites. COVERT inserts one.`,
        "Satellites still work. A spy is how you know whether a silo door moved.",
      );
    }
    return;
  }
  for (const s of cells) {
    const q = s.ourSpy!;
    q.quality = clamp(q.quality + intensity * 4, 5, 95);
    q.lastReport = reportFrom(s);
    log(world, "you", `${s.name} (${q.cover}): ${q.lastReport} Confidence ${Math.round(q.quality)}.`, "HUMINT is slow and local. That is why it survives a satellite lie.");
    if (intensity === 3 && chance(world, 0.22)) {
      q.burned = true;
      log(world, "warn", `Intrusive collection burned your cell at ${s.name}.`, "The person is gone. The site is dark for you until you insert again.");
    }
  }
}

export function applySpyCovert(world: World, actor: ActorId, target: ActorId, intensity: 1 | 2 | 3) {
  if (actor === world.playerId && target === world.playerId) {
    moleHunt(world, intensity);
    return;
  }
  if (actor === world.playerId) {
    insertOrRunOurs(world, target, intensity);
    return;
  }
  if (target === world.playerId) {
    insertHostile(world, actor, intensity);
  }
}

function insertOrRunOurs(world: World, target: ActorId, intensity: 1 | 2 | 3) {
  const open = world.sites.filter((s) => s.owner === target && (!s.ourSpy || s.ourSpy.burned));
  const live = world.sites.filter((s) => s.owner === target && s.ourSpy && !s.ourSpy.burned);
  if (live.length && intensity >= 2) {
    for (const s of live) {
      s.ourSpy!.quality = clamp(s.ourSpy!.quality + 8 * intensity, 5, 95);
      if (intensity === 3 && s.generation >= 1 && chance(world, 0.4)) {
        s.generation = 0;
        log(world, "you", `Sabotage via the cell at ${s.name}. Generation stuttered.`, "A spy who lives there can cut a fence or a fiber. They can also get shot.");
        if (chance(world, 0.35)) {
          s.ourSpy!.burned = true;
          log(world, "warn", `The cell at ${s.name} was rolled up after the job.`, "Direct action burns cover. That is the price.");
        }
      }
    }
    return;
  }
  if (!open.length) {
    log(world, "info", `Every ${world.actors[target].shortName} launch site already has a living agent — or is dark after a burn.`, "You can run them. You cannot stack two people in the same hardware store.");
    return;
  }
  const site = pick(world, open);
  const exposed = chance(world, intensity === 1 ? 0.12 : intensity === 2 ? 0.22 : 0.4);
  if (exposed) {
    log(world, "warn", `Insert at ${site.name} failed. Their counterintel walked the new cover.`, "You do not get a person on that fence this month. Hostility ticked.");
    world.actors[target].hostility[world.playerId] = clamp(world.actors[target].hostility[world.playerId] + 6, 0, 100);
    return;
  }
  site.ourSpy = {
    cover: coverFor(site, true),
    quality: 28 + intensity * 10,
    lastReport: "in place · watching gates",
    burned: false,
  };
  log(
    world,
    "you",
    `Agent in place at ${site.name} (${site.ourSpy.cover}). ${SITE_KIND[site.kind]}.`,
    "They live there. They buy groceries there. That is the whole method.",
  );
}

function insertHostile(world: World, runner: ActorId, intensity: 1 | 2 | 3) {
  const ours = world.sites.filter((s) => s.owner === world.playerId && (!s.hostile || s.hostile.burned));
  if (!ours.length) return;
  if (!chance(world, 0.35 + intensity * 0.1)) return;
  const site = pick(world, ours);
  site.hostile = {
    runner,
    cover: coverFor(site, false),
    quality: 30 + intensity * 8,
    known: false,
    burned: false,
  };
  if (chance(world, 0.18)) {
    site.hostile.known = true;
    log(
      world,
      "warn",
      `${world.actors[runner].shortName} placed a watcher at ${site.name} (${site.hostile.cover}). You spotted the new face.`,
      "They live near your launch site now. Mole-hunt or live with being watched.",
    );
  } else {
    log(
      world,
      "info",
      "A new face showed up in missile country. You have not named them yet.",
      "Hostile HUMINT is quiet until generation. Then they have a story and a radio.",
    );
  }
}

function moleHunt(world: World, intensity: 1 | 2 | 3) {
  const cells = liveHostilesOnUs(world);
  if (!cells.length) {
    log(world, "you", "Mole hunt: no hostile cell on your launch sites this month.", "That can mean you are clean. It can mean they are better than your hunt.");
    return;
  }
  let rolled = 0;
  for (const s of cells) {
    const h = s.hostile!;
    const p = 0.18 * intensity + (h.known ? 0.25 : 0) - h.quality / 400;
    if (chance(world, p)) {
      h.burned = true;
      h.known = true;
      rolled += 1;
      log(
        world,
        "you",
        `Rolled up. ${world.actors[h.runner].shortName} cell at ${s.name} (${h.cover}) is gone.`,
        "The person is in a room. The runner will try again. The field is not permanently clean.",
      );
    }
  }
  if (!rolled && chance(world, 0.2)) {
    world.actors[world.playerId].legitimacy = clamp(world.actors[world.playerId].legitimacy - 4, 0, 100);
    log(world, "warn", "Mole hunt grabbed a local who was not a spy.", "False positives are how you terrorize the towns that host your silos. Loyalty in missile country is a resource.");
  } else if (!rolled) {
    log(world, "info", "Hunt ran. Nobody confessed. The cells that exist got quieter.", "They still live there.");
  }
}

export function tickSpies(world: World) {
  if (!world.sites?.length) return;
  for (const s of world.sites) {
    if (s.generation > 0 && chance(world, 0.65)) s.generation = (s.generation - 1) as 0 | 1 | 2;
    if (s.ourSpy && !s.ourSpy.burned && chance(world, 0.35)) {
      s.ourSpy.lastReport = reportFrom(s);
    }
  }
  if (chance(world, world.difficulty === "extreme" ? 0.18 : 0.1)) {
    const rivals = (["RU", "CN", "KP", "PK", "US"] as ActorId[]).filter((id) => id !== world.playerId && world.actors[id]?.nuclear);
    if (rivals.length) insertHostile(world, pick(world, rivals), 1);
  }
  for (const s of liveOurSpies(world)) {
    if (s.generation >= 2 && chance(world, 0.4)) {
      log(world, "warn", `Your spy at ${s.name} reports a flush.`, "If you also have a satellite track, believe both. If you only have this, someone is generating.");
    }
    if (chance(world, 0.04 + world.actors[s.owner].alert * 0.01)) {
      s.ourSpy!.burned = true;
      log(world, "warn", `Counterintel rolled your cell at ${s.name}.`, "Living near a launch site is a job with a half-life.");
    }
  }
}

export function spySummary(world: World): { ours: number; hostile: number; known: number } {
  return {
    ours: liveOurSpies(world).length,
    hostile: liveHostilesOnUs(world).length,
    known: liveHostilesOnUs(world).filter((s) => s.hostile?.known).length,
  };
}

export { nextInt };

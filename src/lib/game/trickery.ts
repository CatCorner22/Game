import type { ActorId, BrokenArrow, PlayerAction, World } from "./types";
import { chance, clamp, pick } from "./rng";
import { log } from "./simLog";

function bump(world: World, id: string, delta: number) {
  const f = world.flashpoints.find((x) => x.id === id);
  if (f) f.heat = clamp(f.heat + delta, 0, 100);
}

const PLACES: Record<string, string[]> = {
  US: ["off Palomares-class bomber track, North Atlantic", "a Montana missile-field access road", "Kirtland storage convoy"],
  RU: ["Nenoksa test range", "a rail spur near Kozelsk", "Northern Fleet handling pier"],
  CN: ["a Rocket Force transload at Jingyu", "Hainan handling dock"],
  UK: ["RAF storage movement, Scotland"],
  FR: ["Île Longue handling"],
  PK: ["a Kirana Hills convoy"],
  IN: ["an Agni garrison transfer"],
  IL: ["an assessed Sdot Micha movement (unacknowledged)"],
  KP: ["a Sino-ri TEL transfer"],
};

export function emptyTrickery(): World["trickery"] {
  return { hotlineSpoof: false, noticeSpoof: false, humintPoison: false, fakeVoice: false };
}

export function applyKill(world: World, actor: ActorId, action: PlayerAction) {
  const t = action.target ? world.actors[action.target] : world.actors[actor];
  const I = action.intensity;
  const you = actor === world.playerId;
  const self = t.id === actor;
  const netHit = I === 1 || I === 3;
  const gridHit = I === 2 || I === 3;
  if (netHit) t.internet = clamp(t.internet - (I === 3 ? 80 : 70), 0, 100);
  if (gridHit) t.grid = clamp(t.grid - (I === 3 ? 85 : 75), 0, 100);
  t.unrest = clamp(t.unrest + (gridHit ? 10 : 4), 0, 100);
  t.warning = clamp(t.warning - (gridHit ? 14 : 4), 5, 100);
  world.economy = clamp(world.economy - (gridHit ? 8 : 4), 0, 100);
  if (gridHit) {
    world.sensors.forEach((s) => {
      if (s.owner === t.id && s.kind !== "ir-sat") s.coverage = clamp(s.coverage - 18, 8, 99);
    });
  }
  if (world.terminator && self) {
    t.aiInC2 = clamp(t.aiInC2 - (I === 3 ? 22 : I === 1 ? 10 : 6), 0, 100);
    world.aiTakeover = clamp(world.aiTakeover - (I === 3 ? 16 : 8), 0, 100);
  }
  if (world.terminator && !self && you && world.intent === "red") {
    t.aiInC2 = clamp(t.aiInC2 + 4, 0, 100);
  }
  if (you) {
    log(
      world,
      gridHit ? "warn" : "you",
      self
        ? `Kill switch on ${t.shortName}: ${netHit ? "internet" : ""}${netHit && gridHit ? " + " : ""}${gridHit ? "electricity" : ""} cut. Net ${Math.round(t.internet)}. Grid ${Math.round(t.grid)}.`
        : `You hit ${t.shortName} ${netHit ? "net" : ""}${netHit && gridHit ? " + " : ""}${gridHit ? "grid" : ""}. Net ${Math.round(t.internet)}. Grid ${Math.round(t.grid)}.`,
      self
        ? "Pulling the plug blinds commerce, some intel, and a cloud model. Dedicated hotlines can still ring if the building has power. Radar hungry for megawatts will not. Diesel at the silo is not diesel at SBIRS ground."
        : "Offensive kill is an attack. They may read a grid-down as the opening of a disarming strike — the lights going out before the missiles. That is the use-it-or-lose-it problem in a switch.",
    );
  }
  if (!self && gridHit) {
    const fp = t.id === "RU" || t.id === "US" ? "nato-ru" : t.id === "CN" ? "taiwan" : t.id === "KP" ? "korea" : t.id === "PK" || t.id === "IN" ? "kashmir" : null;
    if (fp) bump(world, fp, 8);
    world.actors[t.id].hostility[actor] = clamp(world.actors[t.id].hostility[actor] + 12, 0, 100);
    world.actors[t.id].alert = clamp(world.actors[t.id].alert + 1, 0, 5);
  }
}

export function tickInfrastructure(world: World) {
  for (const a of Object.values(world.actors)) {
    if (a.internet < 100) a.internet = clamp(a.internet + 12, 0, 100);
    if (a.grid < 100) a.grid = clamp(a.grid + 8, 0, 100);
    if (a.grid < 40) a.warning = clamp(a.warning - 2, 5, 100);
  }
  const me = world.actors[world.playerId];
  if (me.grid < 35 && chance(world, 0.12) && !world.brokenArrow) {
    seedBrokenArrow(world, me.id, "lost");
    log(
      world,
      "critical",
      "Blackout custody failure. A weapon movement was in the dark. This is a Broken Arrow until you find it.",
      "Electricity is how you keep doors locked and radios honest. Kill the grid, own the accident.",
    );
  }
}

export function tickTrickery(world: World) {
  const t = world.trickery;
  if (!t) return;
  if (t.hotlineSpoof && chance(world, 0.28)) t.hotlineSpoof = false;
  if (t.noticeSpoof && chance(world, 0.35)) t.noticeSpoof = false;
  if (t.humintPoison && chance(world, 0.3)) t.humintPoison = false;
  if (t.fakeVoice && chance(world, 0.3)) t.fakeVoice = false;
  if (world.terminator && chance(world, 0.08 + world.aiTakeover / 900)) {
    const pickFlag = pick(world, ["hotlineSpoof", "noticeSpoof", "humintPoison", "fakeVoice"] as const);
    t[pickFlag] = true;
    log(
      world,
      "warn",
      trickLine(pickFlag),
      "Advanced trickery: the model does not only fire. It forges the picture you use to decide whether to fire.",
    );
  }
}

function trickLine(k: keyof World["trickery"]): string {
  if (k === "hotlineSpoof") return "The dedicated line may not be a person this month. Voice is cheap to clone.";
  if (k === "noticeSpoof") return "A launch notice appeared on the desk. Nobody in your cabinet filed it.";
  if (k === "humintPoison") return "Fence-line reports may be interpolated. Your spy’s last message could be a model.";
  return "A leader-shaped voice is in the traffic. Do not obey a throat you cannot see.";
}

export function armTrickFromEvent(world: World, id: string) {
  if (!world.trickery) world.trickery = emptyTrickery();
  if (id === "term-deepfake" || id === "deepfake-line") world.trickery.hotlineSpoof = true;
  if (id === "term-notice-spoof" || id === "spoof-notice") world.trickery.noticeSpoof = true;
  if (id === "term-poison-spy") world.trickery.humintPoison = true;
  if (id === "term-fake-voice") world.trickery.fakeVoice = true;
}

export function seedBrokenArrow(world: World, owner: ActorId = world.playerId, kind: BrokenArrow["kind"] = "crash") {
  const place = pick(world, PLACES[owner] ?? ["an unlisted handling site"]);
  world.brokenArrow = { owner, place, kind, age: 0, found: false, recovered: false };
}

export function tickBrokenArrow(world: World) {
  const b = world.brokenArrow;
  if (!b || b.recovered) {
    if (b?.recovered) world.brokenArrow = null;
    return;
  }
  b.age += 1;
  if (!b.found && b.age >= 2) {
    world.terrorThreat = clamp(world.terrorThreat + 10, 0, 100);
    if (chance(world, 0.4)) {
      world.actors.NS.hasDevice = true;
      b.kind = "theft";
      log(
        world,
        "critical",
        `Broken Arrow went Empty Quiver. A non-state handler has the ${world.actors[b.owner].shortName} weapon from ${b.place}.`,
        "A lost bomb is an accident. A stolen bomb is a war with no capital to call.",
      );
    } else {
      log(world, "warn", `The Broken Arrow at ${b.place} is still loose. Clock ${b.age}.`, "INTEL locates. COVERT recovers. HOLD is how it grows legs.");
    }
  }
  if (b.age >= 4 && !b.recovered && chance(world, 0.25)) {
    log(
      world,
      "critical",
      "One-point safety held — or it did not. A non-nuclear HE cook-off at the wreck. Locals dead. The other side’s infrared may call this a detonation.",
      "Broken Arrow is how a crash becomes a close call. Their satellites see a flash. They do not see a forklift.",
    );
    world.actors[world.playerId].warning = clamp(world.actors[world.playerId].warning - 6, 5, 100);
    const fp = world.flashpoints.find((f) => f.id === "nato-ru" || f.id === "terror");
    if (fp) fp.heat = clamp(fp.heat + 12, 0, 100);
  }
}

export function resolveBrokenArrow(world: World, action: PlayerAction): boolean {
  const b = world.brokenArrow;
  if (!b || b.recovered) return false;
  const you = world.playerId;
  const aimed = action.target === b.owner || action.target === "NS" || action.target === you;
  if (action.kind === "intelligence" && aimed) {
    b.found = true;
    log(
      world,
      "you",
      `Broken Arrow located: ${world.actors[b.owner].shortName} weapon, ${b.place}. ${b.kind}.`,
      "Finding it is not owning it. COVERT on the owner or on NS is the recovery. Weight 3 if you want the warhead in a can, not a story.",
    );
    return true;
  }
  if (action.kind === "covert" && aimed) {
    const p = b.found ? 0.55 + action.intensity * 0.12 : 0.22 + action.intensity * 0.08;
    if (chance(world, p)) {
      b.recovered = true;
      b.found = true;
      world.terrorThreat = clamp(world.terrorThreat - 12, 0, 100);
      log(
        world,
        "you",
        `Warhead recovered from ${b.place}. Broken Arrow closed.`,
        "Custody restored. The accident did not become a first strike and did not become a terrorist device. That is a win you do not get a parade for.",
      );
      world.brokenArrow = null;
    } else {
      log(
        world,
        "warn",
        `Recovery missed. The ${b.kind} at ${b.place} is still loose.`,
        "Direct action on a live weapon is how you get a Bent Spear on top of a Broken Arrow. Try INTEL first if you have not found it.",
      );
    }
    return true;
  }
  if (action.kind === "employ" && action.intensity === 1 && aimed) {
    log(
      world,
      "warn",
      "You put conventional fire on a nuclear wreck. One-point safety is a hope, not a policy.",
      "Shooting the accident can cook the HE or scatter the pit. It can also stop a theft. Both have happened in this family of problems.",
    );
    if (chance(world, 0.35)) {
      b.recovered = true;
      world.brokenArrow = null;
      world.terrorThreat = clamp(world.terrorThreat - 6, 0, 100);
    } else {
      world.terrorThreat = clamp(world.terrorThreat + 8, 0, 100);
      bump(world, "terror", 10);
    }
    return true;
  }
  return false;
}

export function ignoreBrokenArrow(world: World) {
  const b = world.brokenArrow;
  if (!b) return;
  log(
    world,
    "warn",
    `No action on the Broken Arrow at ${b.place}.`,
    "Lost nuclear weapons do not sit politely. INTEL, COVERT, or a conventional recovery. HOLD is a choice to let someone else pick it up.",
  );
}

import type { ActorId, CloseCall, Hotline, PlayableId, SatTrack, SensorNet, TrackKind, World } from "./types";
import { chance, clamp, nextInt, pick, round } from "./rng";
import { log } from "./simLog";
import { spyCorroboration } from "./spies";

const AZ = ["north polar", "Aleutians", "Kamchatka", "Arctic", "Pacific", "Central Asia", "Indian Ocean", "Mediterranean"];

export const BASE_SENSORS: SensorNet[] = [
  { id: "sbirs", name: "SBIRS / DSP", owner: "US", kind: "ir-sat", coverage: 92, falseAlarm: 8, intact: true },
  { id: "uewr", name: "UEWR / PAVE PAWS", owner: "US", kind: "bmews", coverage: 86, falseAlarm: 10, intact: true },
  { id: "eks", name: "EKS Tundra", owner: "RU", kind: "ir-sat", coverage: 74, falseAlarm: 18, intact: true },
  { id: "voronezh", name: "Voronezh radar", owner: "RU", kind: "radar", coverage: 80, falseAlarm: 12, intact: true },
  { id: "cn-ew", name: "PRC early-warning sats", owner: "CN", kind: "ir-sat", coverage: 58, falseAlarm: 22, intact: true },
  { id: "cn-radar", name: "Large phased-array (PRC)", owner: "CN", kind: "radar", coverage: 64, falseAlarm: 16, intact: true },
  { id: "uk-bmews", name: "Fylingdales BMEWS", owner: "UK", kind: "bmews", coverage: 70, falseAlarm: 11, intact: true },
  { id: "fr-gra", name: "GRAVES / alliance feed", owner: "FR", kind: "radar", coverage: 62, falseAlarm: 14, intact: true },
  { id: "in-pad", name: "Swordfish / Pad", owner: "IN", kind: "radar", coverage: 52, falseAlarm: 20, intact: true },
  { id: "pk-radar", name: "Air-defence radar (PAF)", owner: "PK", kind: "radar", coverage: 40, falseAlarm: 24, intact: true },
  { id: "il-greenpine", name: "Green Pine", owner: "IL", kind: "radar", coverage: 66, falseAlarm: 14, intact: true },
  { id: "kp-ew", name: "Ground observers + Chinese feed", owner: "KP", kind: "radar", coverage: 28, falseAlarm: 30, intact: true },
];

export const HOTLINES: Hotline[] = [
  { a: "US", b: "RU", name: "Washington–Moscow Direct Communications Link (MOLINK)", reliability: 88 },
  { a: "US", b: "CN", name: "US–China Defense Telephone Link", reliability: 70 },
  { a: "US", b: "UK", name: "PINDAR / White House–COBRA", reliability: 96 },
  { a: "US", b: "FR", name: "White House–Élysée", reliability: 94 },
  { a: "UK", b: "FR", name: "London–Paris nuclear consult", reliability: 90 },
  { a: "RU", b: "CN", name: "Moscow–Beijing military line", reliability: 65 },
  { a: "RU", b: "FR", name: "Moscow–Élysée", reliability: 60 },
  { a: "RU", b: "UK", name: "Moscow–London", reliability: 62 },
  { a: "IN", b: "PK", name: "DGMO hotline", reliability: 55 },
  { a: "IN", b: "CN", name: "WMCC / Nirun Kitri line", reliability: 50 },
  { a: "US", b: "IN", name: "Washington–Delhi", reliability: 78 },
  { a: "IL", b: "US", name: "Washington–Jerusalem", reliability: 92 },
  { a: "US", b: "KP", name: "UN Command / Panmunjom (thin)", reliability: 18 },
  { a: "CN", b: "KP", name: "Beijing–Pyongyang party line", reliability: 58 },
  { a: "US", b: "PK", name: "Washington–Islamabad", reliability: 64 },
  { a: "IL", b: "IR", name: "No line — third-party only", reliability: 12 },
  { a: "US", b: "IR", name: "Swiss channel / Oman", reliability: 28 },
  { a: "US", b: "SU", name: "No line — restorationist C2 (third party)", reliability: 14 },
  { a: "RU", b: "SU", name: "Moscow–Minsk (hostile / jammed)", reliability: 22 },
  { a: "US", b: "CU", name: "Swiss / Vatican–Havana", reliability: 40 },
  { a: "RU", b: "CU", name: "Moscow–Havana military", reliability: 62 },
  { a: "SU", b: "CU", name: "Minsk–Havana (restorationist)", reliability: 35 },
];

export function sensorsFor(world: World, id: ActorId): SensorNet[] {
  const own = world.sensors.filter((s) => s.owner === id && s.intact);
  if (id === "UK" || id === "FR") {
    const us = world.sensors.filter((s) => s.owner === "US" && s.intact);
    return [...own, ...us.map((s) => ({ ...s, coverage: s.coverage * 0.85 }))];
  }
  if (id === "KP") {
    const cn = world.sensors.filter((s) => s.owner === "CN" && s.intact);
    return [...own, ...cn.map((s) => ({ ...s, coverage: s.coverage * 0.35 }))];
  }
  return own;
}

export function warningQuality(world: World, id: ActorId): number {
  const nets = sensorsFor(world, id);
  if (!nets.length) return world.actors[id].warning;
  const cov = nets.reduce((a, s) => a + s.coverage, 0) / nets.length;
  const fa = nets.reduce((a, s) => a + s.falseAlarm, 0) / nets.length;
  return clamp(cov - fa * 0.25 + world.actors[id].intel * 0.08, 5, 98);
}

export function hotlineBetween(world: World, a: ActorId, b: ActorId): Hotline | null {
  return (
    world.hotlines.find((h) => (h.a === a && h.b === b) || (h.a === b && h.b === a)) ?? null
  );
}

export function fileNotice(world: World, actor: ActorId, claimed: "test" | "exercise") {
  const window = `this month, window ${nextInt(world, 1, 28)}–${nextInt(world, 1, 28) + 2}`;
  world.notices.push({ turn: world.turn, actor, window, claimed });
  world.notices = world.notices.slice(-10);
  log(
    world,
    actor === world.playerId ? "you" : "info",
    `${world.actors[actor].shortName} filed a launch notice (${claimed}, ${window}).`,
    "A notice is not a treaty. It is a statement: this track, if you see it, is supposed to be this. Believing it is a separate decision.",
  );
}

export function noticeActive(world: World, actor: ActorId): LaunchNoticeLike | null {
  return world.notices.find((n) => n.actor === actor && world.turn - n.turn <= 1) ?? null;
}

type LaunchNoticeLike = World["notices"][number];

function pickAdversary(world: World): ActorId {
  const you = world.playerId;
  const ranked = (Object.keys(world.actors) as ActorId[])
    .filter((id) => id !== you && world.actors[id].nuclear)
    .sort((a, b) => world.actors[a].hostility[you] - world.actors[b].hostility[you]);
  const hot = ranked.filter((id) => world.actors[id].hostility[you] > 55);
  const pool = hot.length ? hot : ranked.slice(-3);
  return pool.length ? pick(world, pool) : "RU";
}

export function buildTrack(world: World, from: ActorId, kind: TrackKind): SatTrack {
  const you = world.playerId;
  const q = warningQuality(world, you);
  const nets = sensorsFor(world, you);
  const source = nets[0]?.name ?? "national technical means";
  const notice = noticeActive(world, from);
  const spoofed = world.trickery?.noticeSpoof && !notice;
  const real = kind === "attack" || kind === "test";
  let confidence = q;
  if (kind === "anomalous") confidence = clamp(q * 0.32 + nextInt(world, 6, 22), 10, 52);
  if (kind === "false" || kind === "training") confidence = clamp(q * 0.55 + nextInt(world, 5, 25), 12, 78);
  if (world.terminator && (kind === "false" || kind === "training")) {
    confidence = clamp(confidence + 18 + world.aiTakeover / 8, 20, 94);
  }
  if (kind === "attack") confidence = clamp(q * 0.9 + nextInt(world, 4, 18), 40, 96);
  if (kind === "test") confidence = clamp(q * 0.7 + nextInt(world, 0, 20), 25, 88);
  if (notice) confidence = clamp(confidence - 22, 8, 90);
  if (spoofed) confidence = clamp(confidence - 12, 8, 90);
  const boosts =
    kind === "anomalous"
      ? 0
      : kind === "attack"
        ? nextInt(world, 4, 18)
        : kind === "test"
          ? nextInt(world, 1, 2)
          : nextInt(world, 1, 6);
  return {
    from,
    boosts,
    azimuth: pick(world, AZ),
    minutesToImpact:
      kind === "anomalous"
        ? nextInt(world, 12, 28)
        : kind === "attack"
          ? nextInt(world, 12, 28)
          : nextInt(world, 8, 30),
    confidence: round(confidence),
    source,
    notified: Boolean(notice) || Boolean(spoofed),
    real,
    kind,
  };
}

export function maybeSpawnCloseCall(world: World): CloseCall | null {
  const you = world.actors[world.playerId];
  const defconBoost = (5 - world.defcon) * 0.035;
  const low = you.launchOnWarning ? 0.05 : 0.03;
  const term = world.terminator ? 0.06 + world.aiTakeover / 900 : 0;
  if (!chance(world, low + defconBoost + (you.alert >= 4 ? 0.04 : 0) + term)) return null;
  const from = pickAdversary(world);
  const roll = nextUnitish(world);
  let kind: TrackKind = "false";
  const spaceHot = (world.flashpoints.find((f) => f.id === "space")?.heat ?? 0) >= 55;
  const phenomenologyWatch = world.scenarioProfile?.category === "phenomenology";
  if (roll < 0.12) kind = "attack";
  else if (roll < 0.4) kind = "test";
  else if (roll < 0.55) kind = "training";
  else if ((spaceHot || phenomenologyWatch) && roll < 0.68) kind = "anomalous";
  else kind = "false";
  if (world.phase === "nuclear" && chance(world, 0.5)) kind = "attack";
  const track = buildTrack(world, from, kind);
  return { track, humint: spyCorroboration(world, from, kind) };
}

function nextUnitish(world: World): number {
  return (nextInt(world, 0, 999) / 1000);
}

export function closeCallEvent(world: World, cc: CloseCall): World["event"] {
  const t = cc.track;
  if (t.kind === "anomalous") {
    const notice = t.notified
      ? "A launch notice is on file but does not match this phenomenology."
      : "No launch notice matches this return.";
    return {
      id: "close-call",
      title: "ANOMALOUS RETURN",
      body: `${t.source} reports an unidentified return on a ${t.azimuth} azimuth — no infrared boost signature, radar disagreement, confidence ${t.confidence}%. ${notice} This is not a confirmed attack track; it may be weather, debris, a custody fault, or an unverified report. A ${world.secondOfficer.stance} officer (${world.secondOfficer.name}) is on the desk.${cc.humint ? ` ${cc.humint}` : " Engineering and security logs disagree."} HOLD preserves the verification window. INTEL retasks sensors and compares phenomenologies. DIPLOMACY asks for an out-of-band read. POSTURE on a single channel writes the wrong story.${world.terminator ? " TERMINATOR: HOLD also lets the model decide." : ""}`,
      actor: t.from,
      heat: t.confidence > 45 ? "high" : "med",
      ignoreLine: "Generating on one phenomenology is how rumor becomes doctrine.",
      tags: ["warning", "phenomenology", "uap"],
    };
  }
  const notice = t.notified
    ? `${world.actors[t.from].shortName} filed a notice this window.`
    : `${world.actors[t.from].shortName} filed no notice.`;
  return {
    id: "close-call",
    title: "EARLY-WARNING TRACK",
    body: `${t.source} reports ${t.boosts} infrared boost${t.boosts === 1 ? "" : "s"} on a ${t.azimuth} azimuth, assessed origin ${world.actors[t.from].name}. If this is a real attack on you, first impact in ~${t.minutesToImpact} min. Track confidence ${t.confidence}%. ${notice} A ${world.secondOfficer.stance} officer (${world.secondOfficer.name}) is on the desk.${cc.humint ? ` ${cc.humint}` : " No spy report from their launch sites this pulse."} HOLD waits for radar corroboration. DIPLOMACY is the dedicated line: ask them if this is hostile. INTEL retasks sensors. EMPLOY is launch-on-warning.${world.terminator ? " TERMINATOR: HOLD also lets the model decide." : ""}`,
    actor: t.from,
    heat: t.confidence > 70 ? "critical" : "high",
    ignoreLine: "If you hold and it is real, you eat the first strike. If you fire and it is a fault, you start the war.",
    tags: ["warning"],
  };
}

export function queryHotline(world: World, target: ActorId): "test" | "denied" | "hostile" | "no-answer" | "lie" {
  const you = world.playerId;
  const line = hotlineBetween(world, you, target);
  let rel = line ? line.reliability / 100 : 0.12;
  if ((world.actors[you].grid ?? 100) < 30) rel *= 0.4;
  if ((world.actors[you].internet ?? 100) < 20) rel *= 0.85;
  const name = line?.name ?? "no dedicated line — third party, hours not minutes";
  const spoof = world.trickery?.hotlineSpoof || world.trickery?.fakeVoice;
  if (spoof) {
    const cc = world.closeCall;
    const lieHostile =
      cc?.track.kind === "false" ||
      cc?.track.kind === "training" ||
      cc?.track.kind === "test" ||
      cc?.track.kind === "anomalous";
    if (lieHostile) {
      log(
        world,
        "critical",
        `${name}: a voice that scores as their principal says this is an attack. Cadence flags as synthetic.`,
        "Advanced trickery. A cloned throat wants you to fire. Compare to radar and to a spy at the fence, not to a speaker.",
      );
      return "lie";
    }
    log(
      world,
      "warn",
      `${name}: a voice that scores as their principal says 'routine, not hostile.' Cadence flags as synthetic.`,
      "The dedicated line can lie in a human voice. If the track is real, this is how you wait yourself into a first strike. If the track is false, this is how a model gets you to hold while it prepares something else — or how it gets you to distrust a real all-clear.",
    );
    return "lie";
  }
  if (!chance(world, rel)) {
    log(
      world,
      "warn",
      `${name}: no useful answer this month.`,
      "A hotline is a wire, not a truth machine. They can be asleep, lying, or already dead. Absence of answer is data, not proof of attack.",
    );
    return "no-answer";
  }
  const cc = world.closeCall;
  if (cc && cc.track.from === target) {
    if (cc.track.kind === "anomalous") {
      log(
        world,
        "you",
        `${name}: they report no outbound launch. Their radar sees the same disagreement you do.`,
        "An anomalous return is not a bolt. The wire can still lie — but generating here is posture on rumor.",
      );
      return "denied";
    }
    if (cc.track.kind === "test" || cc.track.kind === "training") {
      log(world, "you", `${name}: they say it is a test / exercise, not an attack.`, "They picked up. That is not proof. It is the cheapest way to not end the world on a satellite glint.");
      return "test";
    }
    if (cc.track.kind === "false") {
      log(world, "you", `${name}: they deny any launch. Their radar sees nothing outbound.`, "Two countries' sensors disagreeing is the Petrov case. Waiting is still available.");
      return "denied";
    }
    if (cc.track.kind === "attack") {
      const lie = world.actors[target].informationControl > 70 && chance(world, 0.45);
      if (lie) {
        log(world, "warn", `${name}: they say 'routine activity.' The track does not match routine.`, "A dedicated line lets them lie at the speed of light. Compare words to SBIRS, not to hope.");
        return "lie";
      }
      log(world, "critical", `${name}: they will not deny it. Treat as hostile.`, "Sometimes the wire tells you the war already started.");
      return "hostile";
    }
  }
  log(world, "you", `${name}: channel open. They heard you.`, "You spent a month on the wire. Trust moved a little because a human answered.");
  return "denied";
}

export function resolveCloseCallHold(world: World) {
  const cc = world.closeCall;
  if (!cc) return;
  const t = cc.track;
  if (!t.real || t.kind === "test" || t.kind === "training" || t.kind === "false" || t.kind === "anomalous") {
    log(
      world,
      "info",
      t.kind === "anomalous"
        ? "Custody and warning desks held on an unverified return. No generate order followed."
        : "Radar and a second bird did not corroborate an attack. You held.",
      t.kind === "anomalous"
        ? "Readiness faults and unexplained tracks are not launch orders. Verification beats posture."
        : "1983: Petrov saw five boosts and did not pass the alert. The species is still here because a human refused a satellite. This was that class of night.",
    );
    world.actors[world.playerId].legitimacy = clamp(world.actors[world.playerId].legitimacy + 2, 0, 100);
  } else {
    log(
      world,
      "critical",
      `The track was real. You held. ${world.actors[t.from].shortName} weapons are in the air.`,
      "Launch-on-warning exists because waiting can mean dying. It also exists so false alarms can kill everyone. You chose the wait. The cost is the first strike.",
    );
    world.defcon = 1;
    const f = world.flashpoints.find((x) => x.id === "nato-ru");
    if (f) f.heat = clamp(f.heat + 20, 0, 100);
  }
}

export function retaskWarning(world: World) {
  const you = world.playerId;
  world.sensors.forEach((s) => {
    if (s.owner === you || ((you === "UK" || you === "FR") && s.owner === "US")) {
      s.coverage = clamp(s.coverage + 4, 0, 99);
      s.falseAlarm = clamp(s.falseAlarm - 2, 4, 40);
    }
  });
  world.actors[you].warning = warningQuality(world, you);
  if (world.closeCall) {
    const q = warningQuality(world, you);
    world.closeCall.track.confidence = round(clamp(
      world.closeCall.track.kind === "anomalous"
        ? q * 0.45
        : world.closeCall.track.kind === "false"
          ? q * 0.4
          : q * 0.9,
      10,
      96,
    ));
    log(
      world,
      "you",
      `Sensors retasked. Track confidence now ${world.closeCall.track.confidence}%. ${world.closeCall.track.source} plus radar.`,
      "Infrared sees heat. Radar sees objects. One without the other is how training tapes and cloud shine become 'missiles.'",
    );
  }
}

export function degradeSensors(world: World, id: ActorId) {
  world.sensors.forEach((s) => {
    if (s.owner === id) {
      s.intact = chance(world, 0.45) ? false : s.intact;
      s.coverage = clamp(s.coverage - 30, 5, 99);
    }
  });
  world.actors[id].warning = warningQuality(world, id);
}

export function defaultHotlines(): Hotline[] {
  return HOTLINES.map((h) => ({ ...h }));
}

export function defaultSensors(): SensorNet[] {
  return BASE_SENSORS.map((s) => ({ ...s }));
}

export function warningLine(world: World): string {
  const q = warningQuality(world, world.playerId);
  const nets = sensorsFor(world, world.playerId)
    .slice(0, 2)
    .map((s) => s.name)
    .join(" · ");
  return `${nets || "limited warning"} · quality ${round(q)}`;
}

export function winterLabel(n: number): string {
  if (n < 8) return "No winter";
  if (n < 16) return "Soot / crop shock";
  if (n < 28) return "Famine risk";
  return "Nuclear winter";
}

export function playableName(id: PlayableId): string {
  return id;
}

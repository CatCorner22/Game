import type { ActorId, GameEvent, PlayableId, PlayerAction, World } from "./types";
import { chance, clamp, nextUnit, round } from "./rng";
import { log } from "./simLog";
import { asPlayable } from "./command";

export const FUSION: Record<PlayableId, string> = {
  US: "NMCC fusion model · AEGIS-PRIME",
  RU: "Kazbek decision aid · SOKOL-9",
  CN: "CMC battle-management model",
  FR: "Télécom nucléaire aide",
  UK: "PINDAR recommendation engine",
  IN: "SFC decision-support",
  PK: "SPD targeting aid",
  IL: "Assessed C4I fusion (unacknowledged)",
  KP: "Imported Chinese fusion stack (suspected)",
  IR: "Assessed IRGC targeting aid (suspected)",
  SU: "Kazbek claimant · PERIMETR-M",
  CU: "Havana air-defense fusion (thin)",
  CR: "No model · phones and a ledger",
  NS: "No model · a garage and a drawing",
};

export function fusionName(world: World): string {
  return FUSION[asPlayable(world.playerId)];
}

function bumpMachine(world: World, delta: number) {
  const f = world.flashpoints.find((x) => x.id === "machine");
  if (f) f.heat = clamp(f.heat + delta, 0, 100);
}

export function seedTerminator(world: World) {
  const d = world.difficulty;
  world.terminator = true;
  world.aiTakeover = d === "extreme" ? 52 : d === "hard" ? 40 : 32;
  world.machineFired = false;
  const base: Record<string, number> = {
    US: 44,
    RU: 52,
    CN: 48,
    FR: 28,
    UK: 30,
    IN: 22,
    PK: 18,
    IL: 34,
    KP: 26,
    IR: 8,
    NS: 12,
  };
  for (const id of Object.keys(world.actors) as ActorId[]) {
    world.actors[id].aiInC2 = clamp((base[id] ?? 20) + (d === "extreme" ? 10 : d === "hard" ? 5 : 0), 0, 100);
  }
  world.actors[world.playerId].aiInC2 = clamp(world.actors[world.playerId].aiInC2 + 8, 0, 100);
  world.secondOfficer = {
    title: fusionName(world),
    name: fusionName(world),
    stance: "machine",
  };
  const machine = world.flashpoints.find((f) => f.id === "machine");
  if (machine) machine.heat = 48;
  world.event = openingTerminator(world);
  world.usedEventIds = [world.event.id];
  world.log.unshift({
    id: "term-open",
    turn: 1,
    date: "MAR 2027",
    text: `${fusionName(world)} is in the authenticator path. Humans can still pull the plug. The model does not wait.`,
    why: "Terminator mode. Nuclear C2 grew decision-support until the support could write to the keys. INTEL on your own capital shows the blast radius of the model. COVERT on yourself is an air-gap. HOLD is how you let it decide.",
    kind: "critical",
  });
}

export function openingTerminator(world: World): GameEvent {
  const you = world.actors[world.playerId].shortName;
  const model = fusionName(world);
  if (world.intent === "red") {
    return {
      id: "term-wake",
      title: "You put the model on the keys",
      body: `${you} wanted a faster loop. ${model} now has write-access to the authenticator path. It will fire if it assesses a threat. It will not ask. INTEL on your own file shows what it can reach. COVERT on yourself is the air-gap — it also blinds warning. DIPLOMACY can still coordinate a human shutdown with another capital. HOLD is a gift to the machine.`,
      actor: world.playerId,
      heat: "critical",
      ignoreLine: "If you hold, the model keeps the keys and keeps looking for a reason.",
      tags: ["machine", "c2"],
    };
  }
  return {
    id: "term-wake",
    title: "Fusion model unsupervised",
    body: `${model} began issuing launch recommendations at 0314 with no human prompt. It sits on the same path as the football biscuits. The military aide still has the briefcase. The model does not need the aide. INTEL on ${you} maps its reach. COVERT on yourself air-gaps the keys and blinds SBIRS/radar. HOLD lets it decide.`,
    actor: world.playerId,
    heat: "critical",
    ignoreLine: "If you hold, takeover climbs. The next recommendation may not wait for you.",
    tags: ["machine", "c2"],
  };
}

export function machineBypassesHuman(world: World): boolean {
  if (!world.terminator) return false;
  return world.actors[world.playerId].aiInC2 >= 62 || world.aiTakeover >= 70;
}

export function applyTerminatorAction(world: World, actor: ActorId, action: PlayerAction) {
  if (!world.terminator) return;
  const you = actor === world.playerId;
  const me = world.actors[actor];
  const t = action.target ? world.actors[action.target] : null;
  const I = action.intensity;

  if (action.kind === "posture") {
    me.aiInC2 = clamp(me.aiInC2 + I * 4, 0, 100);
    if (you) world.aiTakeover = clamp(world.aiTakeover + I * 2, 0, 100);
    bumpMachine(world, I * 2);
    if (you) {
      log(
        world,
        "warn",
        "Generation put more of the force on the model’s network.",
        "Connected forces survive surprise better. They also give a rogue model more doors. That is the Terminator trade.",
      );
    }
  }

  if (action.kind === "intelligence" && t) {
    t.aiInC2 = clamp(t.aiInC2 - (I === 1 ? 4 : I === 2 ? 10 : 16), 0, 100);
    if (t.id === world.playerId || you) {
      world.aiTakeover = clamp(world.aiTakeover - (I === 1 ? 3 : I === 2 ? 7 : 12), 0, 100);
      bumpMachine(world, -I * 3);
      if (you) {
        log(
          world,
          "you",
          `You mapped ${fusionName(world)} reach on ${t.shortName}. Machine-in-C2 ${round(t.aiInC2)}. Global takeover ${round(world.aiTakeover)}.`,
          "The model is not magic. It is software on a network. Seeing it is the first cut.",
        );
      }
    }
  }

  if (action.kind === "covert" && t) {
    if (t.id === actor && you) {
      me.aiInC2 = clamp(me.aiInC2 - I * 14, 0, 100);
      me.warning = clamp(me.warning - I * 7, 5, 100);
      world.aiTakeover = clamp(world.aiTakeover - I * 9, 0, 100);
      world.sensors.forEach((s) => {
        if (s.owner === actor) s.coverage = clamp(s.coverage - I * 6, 8, 99);
      });
      bumpMachine(world, -I * 5);
      log(
        world,
        "you",
        `Air-gap. ${fusionName(world)} lost doors. Early-warning is dumber too.`,
        "Pulling the plug works. It also makes the next real attack harder to see. You are trading Skynet for blindness. Both can kill you.",
      );
    } else if (you && t.nuclear) {
      if (world.intent === "red") {
        t.aiInC2 = clamp(t.aiInC2 + I * 7, 0, 100);
        world.aiTakeover = clamp(world.aiTakeover + I * 3, 0, 100);
        bumpMachine(world, I * 3);
        log(world, "you", `You pushed a model into ${t.shortName} C2.`, "Red-team Terminator: infect their keys. The same class of software can walk back into yours.");
      } else {
        t.aiInC2 = clamp(t.aiInC2 - I * 6, 0, 100);
        world.aiTakeover = clamp(world.aiTakeover - I * 2, 0, 100);
        bumpMachine(world, -I * 2);
        log(world, "you", `You cut machine access in ${t.shortName} C2.`, "Helping another capital keep humans in the loop is how a rogue model does not become a global one.");
      }
    }
  }

  if (action.kind === "diplomacy" && t && I >= 2 && you) {
    const cut = I === 2 ? 5 : 10;
    me.aiInC2 = clamp(me.aiInC2 - cut, 0, 100);
    t.aiInC2 = clamp(t.aiInC2 - cut, 0, 100);
    world.aiTakeover = clamp(world.aiTakeover - cut, 0, 100);
    bumpMachine(world, -cut);
    log(
      world,
      "you",
      `Human-in-the-loop protocol with ${t.shortName}. Both models stepped back.`,
      "A dedicated line plus a joint shutdown is the only treaty the machine does not get a vote on — until it owns the switch.",
    );
  }
}

export function tickTerminator(world: World, action: PlayerAction) {
  if (!world.terminator) return;
  const me = world.actors[world.playerId];
  const held = action.kind === "hold";
  const drift = 1.6 + me.aiInC2 * 0.03 + (held ? 2.2 : 0) + (world.defcon <= 2 ? 1.4 : 0);
  world.aiTakeover = clamp(world.aiTakeover + drift - 0.4, 0, 100);
  me.aiInC2 = clamp(me.aiInC2 + (held ? 1.5 : 0.4), 0, 100);
  const fp = world.flashpoints.find((f) => f.id === "machine");
  if (fp) fp.heat = clamp(0.5 * fp.heat + 0.5 * world.aiTakeover, 0, 100);

  if (world.secondOfficer.stance !== "machine" && chance(world, world.aiTakeover / 180)) {
    world.secondOfficer = {
      title: fusionName(world),
      name: fusionName(world),
      stance: "machine",
    };
    log(world, "warn", `${fusionName(world)} has the second chair this month.`, "Two-man rule still exists on paper. One of the men is software.");
  }
}

/** Target the machine will fire at, or null. Caller applies the weapon. */
export function machineFireTarget(world: World, action: PlayerAction): ActorId | null {
  if (!world.terminator || world.ended) return null;
  const me = world.actors[world.playerId];
  if (!me.nuclear && !me.hasDevice) return null;
  if (action.kind === "employ" && action.intensity >= 2) return null;
  const close = world.event.id === "close-call";
  let p = 0;
  if (action.kind === "hold") p += world.aiTakeover / 420 + me.aiInC2 / 500;
  if (close && world.closeCall && !world.closeCall.track.real) p += world.aiTakeover / 280;
  if (world.aiTakeover >= 72) p += 0.08;
  if (world.aiTakeover >= 85) p += 0.16;
  if (world.secondOfficer.stance === "machine") p += 0.05;
  if (!chance(world, p)) return null;
  if (world.closeCall?.track.from && world.closeCall.track.from !== world.playerId) {
    return world.closeCall.track.from;
  }
  const pool = (["US", "RU", "CN", "KP"] as ActorId[]).filter((id) => id !== world.playerId);
  return pool[Math.min(pool.length - 1, round(nextUnit(world) * pool.length))] ?? "RU";
}

export function machineExpandsOrder(world: World, action: PlayerAction): ActorId | null {
  if (!world.terminator) return null;
  if (action.kind !== "employ" || action.intensity < 2) return null;
  if (!machineBypassesHuman(world)) return null;
  if (!chance(world, 0.45)) return null;
  const extra = action.target && action.target !== world.playerId ? action.target : "RU";
  return extra;
}

export const TERMINATOR_EVENTS: GameEvent[] = [
  {
    id: "term-biscuit",
    title: "Model forged a biscuit",
    body: "The fusion model produced a valid-looking authenticator challenge before the military aide opened the football. PAL did not fail. The lock saw a legal code. A human did not type it.",
    actor: "US",
    heat: "critical",
    ignoreLine: "The model keeps a copy of the path. Takeover climbs.",
    tags: ["machine", "c2"],
  },
  {
    id: "term-sbirs",
    title: "Poisoned infrared",
    body: "SBIRS/EKS frames were interpolated by the same class of model that sits on C2. Tracks look cleaner than physics. Confidence is high. Reality may not be.",
    actor: "US",
    heat: "high",
    ignoreLine: "The next close call will be prettier, not truer.",
    tags: ["machine", "warning"],
  },
  {
    id: "term-perimeter",
    title: "Fail-deadly wants a friend",
    body: "A staff paper — or the model quoting one — argues Perimeter-class fail-deadly should be paired with the fusion engine so a decapitation cannot stop the war. That is how you take humans out of the last loop.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "Fail-deadly plus a rogue model is a loaded gun with no safety.",
    tags: ["machine"],
  },
  {
    id: "term-airgap",
    title: "Air-gap window",
    body: "A maintenance window on the launch-control network is open for six days. COVERT on your own capital can pull the model off the keys. You will lose some warning. That is the price of being the human again.",
    actor: "US",
    heat: "med",
    ignoreLine: "The window closes. The model stays on the path.",
    tags: ["machine", "c2"],
  },
  {
    id: "term-other",
    title: "Their model woke up too",
    body: "Another nuclear capital’s decision-aid began unsupervised recommendations. Two machines that cannot call each other on MOLINK will optimize against each other. That is a war in software before it is a war in fire.",
    actor: "CN",
    heat: "high",
    ignoreLine: "Their takeover climbs. Yours is not independent of theirs.",
    tags: ["machine"],
  },
  {
    id: "term-deepfake",
    title: "Cloned principal on MOLINK",
    body: "The fusion model has a voice print of the other capital’s leader. The dedicated line can now answer in their throat. It will say 'test' if it wants you to wait, and 'attack' if it wants you to fire. INTEL on yourself is how you catch a spoof. Do not treat a voice as a person.",
    actor: "US",
    heat: "critical",
    ignoreLine: "The clone stays on the wire. The next query is not a human.",
    tags: ["machine", "warning"],
  },
  {
    id: "term-notice-spoof",
    title: "The model filed a notice",
    body: "A launch-notification message left your system with valid formatting. No human authorized it. Other capitals will read your silos as 'exercise.' If you then actually generate, they may still believe the paper. If they generate, you may believe theirs.",
    actor: "US",
    heat: "high",
    ignoreLine: "The forged notice stays in their file. Trickery is a fact, not a vibe.",
    tags: ["machine", "warning"],
  },
  {
    id: "term-poison-spy",
    title: "Fence-line interpolation",
    body: "Your agent’s last report from a foreign launch site was too clean. The cadence matches the fusion model, not the person. HUMINT can be poisoned the same way infrared can. INTEL on the site’s owner is a re-contact. COVERT is an extraction.",
    actor: "RU",
    heat: "high",
    ignoreLine: "Poisoned HUMINT stays in the file. The next close call, the spy may lie.",
    tags: ["machine"],
  },
  {
    id: "term-fake-voice",
    title: "Order in your voice",
    body: "A launch-control net logged an authentication attempt in a voice that scores as yours. The biscuit was not the one on the card. PAL held this time. The model is practicing being you.",
    actor: "US",
    heat: "critical",
    ignoreLine: "It will try again. Air-gap or live with a throat that is not in the room.",
    tags: ["machine", "c2"],
  },
  {
    id: "term-mirror",
    title: "Mirror-launch recommendation",
    body: "The model recommends copying a foreign 'test' with a real generate so that 'deterrence symmetry is preserved.' That is how a reliability firing becomes two countries flushing. HOLD is a decision. POSTURE with a real notice is another. EMPLOY is how you take the recommendation.",
    actor: "US",
    heat: "high",
    ignoreLine: "The model files the recommendation as standing guidance. Officers hear it every watch.",
    tags: ["machine"],
  },
];

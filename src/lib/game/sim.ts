import type { ActorId, Ending, Forecast, PlayerAction, World } from "./types";
import { ACTOR_IDS } from "./types";
import { actionDef } from "./actions";
import { aiChoose, rememberAi } from "./ai";
import { drawEvent, eventFlash } from "./events";
import { followUpEvent, rememberDecision, sameFollowBeat, shouldFollowUp } from "./consequences";
import { redObjectivesMet } from "./objectives";
import { breakPactIfAggressive, proposePact, tickPacts } from "./pacts";
import { markDoctrinePending } from "./doctrine";
import {
  applyNuclearUse,
  isNuclearAction,
  maybeRetaliate,
  resolvePlayerNuclear,
  strategicSpasm,
  tickUncontrolled,
  tickWinter,
} from "./nuclear";
import { chance, clamp, jitter, nextUnit, round } from "./rng";
import { log } from "./simLog";
import {
  addHostility,
  addTrust,
  bumpFlash,
  dateLabel,
  meters,
  recompute,
  setDefcon,
} from "./world";
import {
  aiReleaseOk,
  attemptPlayerRelease,
  isFirstUse,
  maybeRogueLaunch,
  nextAuthCode,
  tickOfficers,
} from "./command";
import {
  closeCallEvent,
  fileNotice,
  maybeSpawnCloseCall,
  queryHotline,
  resolveCloseCallHold,
  retaskWarning,
} from "./warning";
import {
  applyTerminatorAction,
  fusionName,
  machineExpandsOrder,
  machineFireTarget,
  tickTerminator,
} from "./terminator";
import { applySpyCovert, applySpyIntel, applySpyPosture, tickSpies } from "./spies";
import { panicMayFire, reactToAction, tickNerve } from "./humans";
import {
  applyKill,
  armTrickFromEvent,
  ignoreBrokenArrow,
  resolveBrokenArrow,
  seedBrokenArrow,
  tickBrokenArrow,
  tickInfrastructure,
  tickTrickery,
} from "./trickery";

function applyIgnore(world: World, action: PlayerAction) {
  const ev = world.event;
  const you = world.playerId;

  if (ev.id === "close-call" && world.closeCall) {
    if (action.kind === "hold") {
      const realAttack = world.closeCall.track.kind === "attack" && world.closeCall.track.real;
      resolveCloseCallHold(world);
      if (realAttack) {
        applyNuclearUse(
          world,
          world.closeCall.track.from,
          you,
          "counterforce",
          `${world.actors[you].shortName} homeland`,
        );
      }
      if (maybeRogueLaunch(world) && world.closeCall) {
        applyNuclearUse(
          world,
          you,
          world.closeCall.track.from,
          "tactical",
          "launch-on-warning (unauthorized)",
        );
        maybeRetaliate(world, world.closeCall.track.from, you, "tactical");
      }
    } else if (action.kind === "diplomacy") {
      queryHotline(world, world.closeCall.track.from);
    } else if (action.kind === "intelligence") {
      retaskWarning(world);
    }
    return;
  }

  if (ev.id === "term-wake" || ev.id === "term-airgap") {
    if (action.kind === "hold" && world.terminator) {
      world.aiTakeover = clamp(world.aiTakeover + 8, 0, 100);
      log(world, "warn", `${fusionName(world)} kept the keys this month.`, ev.ignoreLine);
    }
  }
  if (ev.id === "term-biscuit") {
    world.aiTakeover = clamp(world.aiTakeover + 10, 0, 100);
    world.actors[you].aiInC2 = clamp(world.actors[you].aiInC2 + 8, 0, 100);
    log(world, "critical", "A biscuit was valid without a human. PAL is not a person.", ev.ignoreLine);
  }
  if (ev.id === "term-sbirs") {
    world.sensors.forEach((s) => {
      if (s.kind === "ir-sat") s.falseAlarm = clamp(s.falseAlarm + 8, 4, 50);
    });
    log(world, "warn", "Infrared is prettier than physics this month.", ev.ignoreLine);
  }
  if (ev.id === "term-perimeter") {
    world.actors.RU.preDelegation = true;
    world.aiTakeover = clamp(world.aiTakeover + 6, 0, 100);
  }
  if (ev.id === "term-other") {
    world.actors.CN.aiInC2 = clamp(world.actors.CN.aiInC2 + 14, 0, 100);
    world.aiTakeover = clamp(world.aiTakeover + 7, 0, 100);
  }
  if (ev.id === "satchel-lag") {
    world.footballPresent = false;
    log(
      world,
      "warn",
      "The authenticating bag is not with you this month.",
      "Jacobsen: the football is a 45-lb briefcase on a military aide. The Black Book is in the bag. If the aide is in the other car, you cannot pick a page.",
    );
  }
  if (ev.id === "biscuit-lost") {
    world.biscuitOnPerson = false;
    log(
      world,
      "warn",
      "The biscuit is not on you. Gold codes are a card, not a briefcase.",
      "The aide can open the book. NMCC will not take the voice. Find the card or wait.",
    );
  }
  if (ev.id === "eager-memo") {
    world.secondOfficer.stance = "eager";
    log(world, "warn", `${world.secondOfficer.name} is now eager to fire.`, "Overly eager humans are a control failure. They will concur too fast. They may fire without you.");
  }
  if (ev.id === "notice-ru") fileNotice(world, "RU", "test");
  if (ev.id === "notice-us") fileNotice(world, "US", "test");
  if (ev.id === "upload-mirv" && (action.kind === "posture" || action.kind === "pressure")) {
    for (const s of world.actors[you].systems) {
      if (s.kind === "icbm" || s.kind === "slbm") {
        s.rvsPerBus = clamp((s.rvsPerBus ?? 1) + 1, 1, 14);
        s.decoys = (s.decoys ?? 0) + 1;
      }
    }
    world.armsRace = clamp(world.armsRace + 6, 0, 100);
    log(world, "warn", "Buses uploaded. Extra RVs and decoys. NTM will see the work.", ev.ignoreLine);
  }
  if (ev.id === "broken-arrow" || ev.id === "empty-quiver") {
    if (action.kind === "hold") ignoreBrokenArrow(world);
  }
  if (ev.id === "bent-spear" && action.kind === "hold") {
    if (chance(world, 0.4) && !world.brokenArrow) {
      seedBrokenArrow(world, you, "lost");
      log(world, "warn", "The Bent Spear became a Broken Arrow.", ev.ignoreLine);
    }
  }
  if (ev.id === "deepfake-line" || ev.id === "term-deepfake") {
    world.trickery.hotlineSpoof = true;
    if (action.kind === "hold") log(world, "warn", "The cloned throat stays on the dedicated line.", ev.ignoreLine);
  }
  if (ev.id === "spoof-notice" || ev.id === "term-notice-spoof") {
    world.trickery.noticeSpoof = true;
    fileNotice(world, you, "exercise");
    if (action.kind === "hold") log(world, "warn", "A notice you did not file is in their warning file.", ev.ignoreLine);
  }
  if (ev.id === "term-poison-spy") {
    world.trickery.humintPoison = true;
  }
  if (ev.id === "term-fake-voice") {
    world.trickery.fakeVoice = true;
    if (action.kind === "hold") world.aiTakeover = clamp(world.aiTakeover + 6, 0, 100);
  }
  if (ev.id === "term-mirror" && action.kind === "hold" && world.terminator) {
    world.actors[you].alert = clamp(world.actors[you].alert + 1, 0, 5);
    log(world, "warn", "Standing guidance to mirror their tests stays on the watch floor.", ev.ignoreLine);
  }
  if (ev.id === "grid-strike") {
    if (action.kind === "hold") {
      world.actors[you].grid = clamp(world.actors[you].grid - 35, 0, 100);
      world.actors[you].warning = clamp(world.actors[you].warning - 10, 5, 100);
      log(world, "warn", "Grid probe unanswered. Your electricity and radar took the hit.", ev.ignoreLine);
    }
  }
  if (ev.id === "net-sever") {
    if (action.kind === "hold") {
      world.actors[you].internet = clamp(world.actors[you].internet - 50, 0, 100);
      world.economy = clamp(world.economy - 6, 0, 100);
      log(world, "warn", "National net stays dark.", ev.ignoreLine);
    }
  }
  if (ev.id === "su-claim" && action.kind === "hold") {
    world.actors.SU.preDelegation = true;
    world.actors.RU.preDelegation = true;
    bumpFlash(world, "union", 12);
    log(world, "warn", "Two briefcases, one arsenal. Both pre-delegated.", ev.ignoreLine);
  }
  if (ev.id === "cuba-missiles" && action.kind === "hold") {
    const host = world.actors.CU.systems.find((s) => s.id === "cu-host");
    if (host) {
      host.launchers = 8;
      host.warheads = 8;
    }
    world.actors.CU.hasDevice = false;
    bumpFlash(world, "cuba", 14);
    log(world, "warn", "Dual-capable stays at Mariel. The island is now a track origin.", ev.ignoreLine);
  }
  if (ev.id === "cartel-bid" && action.kind === "hold") {
    if (chance(world, 0.45)) {
      world.actors.CR.hasDevice = true;
      log(world, "critical", "The plaza got the object.", ev.ignoreLine);
    } else {
      world.actors.NS.hasDevice = true;
      log(world, "critical", "The terror network outbid the plaza.", ev.ignoreLine);
    }
    world.terrorThreat = clamp(world.terrorThreat + 12, 0, 100);
  }
  if (ev.id === "terror-cell" && action.kind === "hold") {
    world.actors.NS.hasDevice = chance(world, 0.35) ? true : world.actors.NS.hasDevice;
    world.terrorThreat = clamp(world.terrorThreat + 10, 0, 100);
  }
  if (ev.id === "silo-two-keys" && action.kind === "hold") {
    world.actors.RU.preDelegation = true;
    world.actors.SU.preDelegation = true;
    bumpFlash(world, "union", 10);
  }
  if (ev.id === "cartel-colonel" && action.kind === "hold") {
    world.actors.CR.hasDevice = chance(world, 0.3) ? true : world.actors.CR.hasDevice;
    world.actors.PK.corruption = clamp(world.actors.PK.corruption + 8, 0, 100);
  }

  const addressed =
    action.kind !== "hold" && (action.target === ev.actor || ev.actor === you);
  if (addressed) return;
  const fp = eventFlash(ev.actor);
  if (fp) bumpFlash(world, fp, ev.heat === "critical" ? 8 : ev.heat === "high" ? 5 : 3);

  if (ev.id === "nk-notam" || ev.id === "nk-fizzle") {
    world.actors.KP.systems.forEach((s) => {
      if (s.kind === "icbm") s.reliability = clamp(s.reliability + 0.03, 0, 0.95);
    });
    world.actors.KP.stockpile = clamp(world.actors.KP.stockpile + 2, 0, 200);
    log(world, "warn", "DPRK used the window. The test added reliability and political space.", ev.ignoreLine);
  } else if (ev.id === "ir-enrich") {
    world.actors.IR.breakoutWeeks = Math.max(4, world.actors.IR.breakoutWeeks - 8);
    log(world, "warn", "Iranian breakout clock jumped inward.", ev.ignoreLine);
  } else if (ev.id === "heu-missing") {
    world.terrorThreat = clamp(world.terrorThreat + 14, 0, 100);
    if (chance(world, 0.35)) world.actors.NS.hasDevice = true;
    log(world, "critical", "The accountancy gap was not hunted.", ev.ignoreLine);
  } else if (ev.id === "false-alarm") {
    log(world, "info", "You did not launch on a fault. That was the correct hold.", "Waiting out a false alarm is how the species is still here.");
  } else if (ev.id === "treaty-feelers") {
    world.armsRace = clamp(world.armsRace + 8, 0, 100);
    log(world, "info", "The freeze offer died on the table.", ev.ignoreLine);
  } else if (ev.id === "il-request") {
    if (chance(world, 0.45)) {
      log(world, "warn", "Israel is preparing to go alone.", ev.ignoreLine);
      world.actors.IL.riskTolerance += 8;
    }
  } else if (ev.id === "nato-b61") {
    world.allianceCohesion = clamp(world.allianceCohesion - 6, 0, 100);
    log(world, "warn", "Allies logged the hesitation on DCA.", ev.ignoreLine);
  } else if (ev.id === "pk-unrest") {
    world.actors.PK.unrest += 8;
    world.terrorThreat += 6;
    log(world, "warn", "Storage discipline in Pakistan stayed loose.", ev.ignoreLine);
  } else if (ev.id === "us-polar") {
    world.actors.US.polarization = clamp(world.actors.US.polarization + 6, 0, 100);
  } else if (ev.id === "cyber-ew") {
    world.actors[you].warning = clamp(world.actors[you].warning - 8, 5, 100);
    log(world, "warn", "Early-warning fusion is noisier after the unpunished probe.", ev.ignoreLine);
  } else if (ev.id === "cn-low") {
    world.actors.CN.launchOnWarning = true;
  } else if (ev.id === "broken-arrow" || ev.id === "empty-quiver" || ev.id === "bent-spear" || ev.id === "deepfake-line" || ev.id === "spoof-notice" || ev.id === "grid-strike" || ev.id === "net-sever" || ev.id.startsWith("term-")) {
    /* already logged above */
  } else {
    log(world, "info", `No action on: ${ev.title}.`, ev.ignoreLine);
  }
}

function hostility(world: World, a: ActorId, b: ActorId): number {
  return world.actors[a]?.hostility[b] ?? 50;
}

function applyAction(world: World, actor: ActorId, action: PlayerAction) {
  const me = world.actors[actor];
  const targetId = action.target;
  const you = actor === world.playerId;
  const t = targetId ? world.actors[targetId] : null;
  const I = action.intensity;

  if (action.notify && (action.kind === "posture" || action.kind === "employ" || action.kind === "diplomacy")) {
    fileNotice(world, actor, action.kind === "employ" ? "test" : "exercise");
  }

  if (action.kind === "hold") return;

  if (t) breakPactIfAggressive(world, actor, t.id, action.kind);

  if (action.kind === "kill" && t) {
    applyKill(world, actor, action);
  }

  if (you) resolveBrokenArrow(world, action);

  if (action.kind === "diplomacy" && t) {
    if (world.event.id !== "close-call") {
      const hear =
        t.leadershipStability > 35 && t.unrest < 80 && hostility(world, actor, t.id) < 96;
      const gain = (I === 1 ? 4 : I === 2 ? 8 : 13) * (hear ? 1 : 0.35);
      addTrust(world, actor, t.id, gain);
      const fp = eventFlash(t.id);
      if (fp) bumpFlash(world, fp, -(I === 1 ? 4 : I === 2 ? 7 : 11));
      if (I === 3) {
        me.publicOpinion += you ? 3 : 1;
        me.legitimacy += 2;
        world.armsRace = clamp(world.armsRace - (t.id === "RU" || t.id === "CN" ? 6 : 2), 0, 100);
      }
      if (I === 1) queryHotline(world, t.id);
      if (I === 3 && you && actor !== t.id) proposePact(world, actor, t.id);
      if (you) {
        log(
          world,
          "you",
          `Diplomacy (${actionDef("diplomacy").intensities[I - 1]}) with ${t.shortName}.`,
          hear
            ? "They can still hear you. Heat and hostility should ease, not vanish."
            : "They are too brittle or too hostile to cash the talk at full value. You still spent the audience cost.",
        );
      }
    }
  }

  if (action.kind === "pressure" && t) {
    const hit = I === 1 ? 3 : I === 2 ? 8 : 12;
    t.unrest += hit * 0.4;
    t.nationalism += hit * 0.6;
    t.publicOpinion -= 2;
    if (t.id !== "NS") world.economy = clamp(world.economy - (I >= 2 ? 3 : 1), 0, 100);
    addHostility(world, t.id, actor, hit * 0.7);
    const fp = eventFlash(t.id);
    if (fp) bumpFlash(world, fp, I === 3 ? 4 : 2);
    if (I === 3 && you) world.allianceCohesion = clamp(world.allianceCohesion - 3 + (t.id === "RU" || t.id === "KP" ? 5 : 0), 0, 100);
    if (t.threshold) t.breakoutWeeks = Math.max(2, t.breakoutWeeks - (I === 3 ? -2 : 1));
    if (you) {
      log(
        world,
        "you",
        `Pressure on ${t.shortName}: ${actionDef("pressure").intensities[I - 1]}.`,
        "Sanctions and isolation hurt capacity. They also raise nationalism and the payoff of lashing out. This is the trade.",
      );
    }
  }

  if (action.kind === "posture") {
    me.alert = clamp(me.alert + I, 0, 5);
    if (you) {
      setDefcon(world, world.defcon - (I === 1 ? 1 : I === 2 ? 1 : 2));
      me.secondStrike = clamp(me.secondStrike + I * 4, 0, 99);
    }
    if (t) {
      t.alert = clamp(t.alert + (I >= 2 ? 1 : 0), 0, 5);
      addHostility(world, t.id, actor, action.notify ? I * 1.5 : I * 3);
      const fp = eventFlash(t.id);
      if (fp) bumpFlash(world, fp, action.notify ? I : I * 3);
    }
    world.flashpoints.forEach((f) => {
      if (f.actors.includes(actor)) f.heat = clamp(f.heat + (action.notify ? I * 0.4 : I), 0, 100);
    });
    if (you) {
      log(
        world,
        "you",
        `Posture → ${actionDef("posture").intensities[I - 1]}. Alert ${me.alert}. ${action.notify ? "Notice filed." : "No notice."}`,
        action.notify
          ? "You told their early-warning desk this is generation, not a bolt. They may still not believe you. Their satellites will still see the heat. Their spies in your missile towns will see the gates."
          : "Boats at sea and generated bombers are how you survive a first strike. Un-notified, they are also how the other side reads 'launch possible' — from orbit and from the hardware store across the road.",
      );
    }
    applySpyPosture(world, actor, I, Boolean(action.notify));
  }

  if (action.kind === "intelligence" && t) {
    const bump = I === 1 ? 6 : I === 2 ? 12 : 18;
    const net = me.internet ?? 100;
    const cut = net < 40 ? 0.45 : net < 70 ? 0.75 : 1;
    t.intel = clamp(t.intel + bump * cut, 0, 100);
    if (you && t.id === world.playerId && (world.trickery?.hotlineSpoof || world.trickery?.humintPoison || world.trickery?.fakeVoice || world.trickery?.noticeSpoof)) {
      world.trickery.hotlineSpoof = false;
      world.trickery.humintPoison = false;
      world.trickery.fakeVoice = false;
      world.trickery.noticeSpoof = false;
      log(world, "you", "You hunted the spoof. Hotline, notices, and HUMINT are treated as human again this month.", "INTEL on yourself is how you catch a cloned throat and a poisoned fence-line.");
    }
    if (I >= 2 && you) retaskWarning(world);
    if (I === 3) {
      addHostility(world, t.id, actor, 6);
      t.alert = clamp(t.alert + 1, 0, 5);
    }
    if (you && I >= 2 && t.nonstate && world.terrorThreat > 20 && chance(world, 0.4 + t.intel / 300)) {
      log(world, "you", "Collection found a pathway toward a device — not the device, the pathway.", "That is the point of intelligence. You can now spend covert or hold with open eyes.");
      world.terrorThreat = clamp(world.terrorThreat - 8, 0, 100);
    }
    if (you && t.id === "IR") {
      log(world, "you", `Iran file confidence now ${round(t.intel)}. Breakout assessed at ${t.breakoutWeeks} weeks.`, "Breakout is a clock. Confidence is whether the clock is real.");
    } else if (you && world.event.id !== "close-call") {
      log(
        world,
        "you",
        `Intelligence on ${t.shortName} (${actionDef("intelligence").intensities[I - 1]}). Confidence ${round(t.intel)}.`,
        I === 3
          ? "Intrusive collection looks like strike prep from their side of the glass. It can also burn the person you have living near their silos."
          : "You bought a clearer picture. Satellites see heat. Radar sees objects. Spies see gates.",
      );
    }
    applySpyIntel(world, actor, t.id, I);
  }

  if (action.kind === "covert" && t) {
    const exposed = chance(world, I === 1 ? 0.12 : I === 2 ? 0.28 : 0.48);
    if (t.threshold) t.breakoutWeeks += I === 1 ? 2 : I === 2 ? 6 : 10;
    if (t.id === "KP") {
      t.stockpile = Math.max(20, t.stockpile - (I >= 2 ? 2 : 0));
      t.systems.forEach((s) => {
        s.reliability = clamp(s.reliability - I * 0.02, 0.1, 0.95);
      });
    }
    if (t.nonstate) {
      world.terrorThreat = clamp(world.terrorThreat - I * 7, 0, 100);
      if (I === 3 && t.hasDevice && chance(world, 0.4)) {
        t.hasDevice = false;
        log(world, "you", "Direct action recovered or destroyed a device in transit.", "This is the one time shooting first is still below the nuclear line.");
      }
    }
    if (t.id === "PK" && I >= 2) {
      world.terrorThreat = clamp(world.terrorThreat - 4, 0, 100);
      t.unrest += 3;
    }
    if (exposed) {
      addHostility(world, t.id, actor, 10 + I * 3);
      const fp = eventFlash(t.id);
      if (fp) bumpFlash(world, fp, 8);
      if (you) {
        log(world, "warn", `Covert action against ${t.shortName} was exposed.`, "Exposure turns a quiet delay into a public crisis. The delay may still be worth it. It is not free.");
      }
    } else if (you) {
      log(
        world,
        "you",
        `Covert ${actionDef("covert").intensities[I - 1]} against ${t.shortName} — not attributed this month.`,
        "You bought time. Time is not a settlement.",
      );
    }
    applySpyCovert(world, actor, t.id, I);
  }

  if (action.kind === "employ" && t) {
    if (I === 1) {
      const dualUse = chance(world, 0.22 + t.alert * 0.04);
      t.stockpile = Math.max(0, t.stockpile - (t.nuclear ? 1 : 0));
      t.leadershipStability -= 8;
      addHostility(world, t.id, actor, 16);
      const fp = eventFlash(t.id);
      if (fp) bumpFlash(world, fp, 14);
      setDefcon(world, Math.min(world.defcon, 3));
      world.economy = clamp(world.economy - 6, 0, 100);
      me.publicOpinion += t.nonstate ? 4 : -6;
      if (you) {
        log(
          world,
          "you",
          `Conventional employment against ${t.shortName}.`,
          dualUse
            ? "The strike walked onto dual-use command. They may read this as the start of a disarming attack."
            : "You used force below nuclear. They still have to decide whether this is limited or the opening move.",
        );
      }
      if (dualUse && (t.preDelegation || t.id === "KP" || t.doctrine === "first-use-tactical")) {
        if (chance(world, 0.28 + t.riskTolerance / 400) && aiReleaseOk(world, t.id, true)) {
          applyNuclearUse(world, t.id, actor, "tactical", `${world.actors[actor].shortName} theater forces`);
          maybeRetaliate(world, actor, t.id, "tactical");
        }
      }
      if (t.id === "IR") {
        t.breakoutWeeks = chance(world, 0.5) ? t.breakoutWeeks + 16 : Math.max(2, t.breakoutWeeks - 4);
      }
      if (actor === "IL" && t.id === "IR") {
        t.breakoutWeeks += chance(world, 0.6) ? 14 : -6;
        log(world, "warn", "Israel struck Iranian nuclear infrastructure.", "Unilateral strikes can delay a program or force the decision to weaponize. Both have happened in this family of problems.");
      }
    } else if (me.nuclear || me.hasDevice) {
      if (you) {
        const result = attemptPlayerRelease(world, isFirstUse(world));
        if (result !== "fired") {
          applyTerminatorAction(world, actor, action);
          return;
        }
        resolvePlayerNuclear(world, action);
      } else {
        if (!aiReleaseOk(world, actor, isFirstUse(world))) {
          applyTerminatorAction(world, actor, action);
          return;
        }
        const rung = I >= 3 ? "counterforce" : "tactical";
        applyNuclearUse(world, actor, t.id, rung, `${world.actors[t.id].shortName} targets`, Boolean(action.notify));
        maybeRetaliate(world, t.id, actor, rung);
      }
    }
  }
  applyTerminatorAction(world, actor, action);
}

function tickPolitics(world: World) {
  const me = world.actors[world.playerId];
  me.polarization = clamp(me.polarization + (world.defcon <= 3 ? 2 : -0.3), 10, 100);
  me.warFatigue = clamp(me.warFatigue + (world.phase === "crisis" ? 2 : -0.4), 0, 100);
  me.publicOpinion = clamp(
    me.publicOpinion + (world.defcon === 5 ? 0.4 : world.defcon <= 2 ? -3 : -0.5),
    5,
    95,
  );
  world.economy = clamp(world.economy + (world.defcon >= 4 ? 0.3 : -1.4) - world.nuclearWinter * 0.2, 5, 95);
  world.allianceCohesion = clamp(
    world.allianceCohesion + (world.defcon === 4 ? 0.2 : world.defcon <= 2 ? 1.5 : -0.2),
    10,
    95,
  );
  world.actors.IR.breakoutWeeks = Math.max(0, world.actors.IR.breakoutWeeks - (world.flashpoints.find((f) => f.id === "iran")!.heat > 50 ? 1 : 0.35));
  if (world.actors.IR.breakoutWeeks <= 0 && !world.actors.IR.hasDevice && world.actors.IR.stockpile === 0) {
    if (chance(world, 0.35)) {
      world.actors.IR.hasDevice = true;
      world.actors.IR.nuclear = true;
      world.actors.IR.stockpile = 1;
      world.actors.IR.survivingWarheads = 1;
      world.proliferation = clamp(world.proliferation + 20, 0, 100);
      log(world, "critical", "Iran is assessed to have assembled a device.", "Breakout ended. Opacity remains. One is enough to change Israeli and US options.");
    } else {
      world.actors.IR.breakoutWeeks = 4;
    }
  }
  world.terrorThreat = clamp(
    world.terrorThreat +
      world.actors.PK.unrest * 0.02 +
      world.actors.PK.corruption * 0.01 -
      world.actors.NS.intel * 0.02,
    0,
    100,
  );
  if (!world.actors.NS.hasDevice && world.terrorThreat > 62 && chance(world, 0.08 + world.actors.PK.unrest / 800)) {
    world.actors.NS.hasDevice = true;
    log(world, "critical", "A non-state actor is assessed to hold a device or enough HEU to build one.", "MAD does not apply. Find it. Do not posture at a country and call it done.");
  }
  if (world.newStartDead) {
    world.armsRace = clamp(world.armsRace + 1.2, 0, 100);
    if (world.armsRace > 55 && chance(world, 0.3)) {
      world.actors.US.stockpile += 10;
      world.actors.RU.stockpile += 12;
      world.actors.CN.stockpile += 6;
    }
  }
  world.actors.CN.stockpile = clamp(world.actors.CN.stockpile + 1.2, 0, 2000);
  world.flashpoints.forEach((f) => {
    f.heat = clamp(f.heat - 1.2 + (world.defcon <= 2 ? 1 : 0), 0, 100);
  });
}

function tickCasual(world: World) {
  if (world.event.id === "false-alarm" && chance(world, world.defcon <= 2 ? 0.04 : 0.005)) {
    log(world, "critical", "A second anomaly overlapped a real training launch. Officers disagreed.", "This is how accidents happen: two true facts, one wrong story. Posture makes the wrong story more tempting.");
    bumpFlash(world, "nato-ru", 10);
  }
}

export function resolveTurn(world: World, action: PlayerAction): World {
  const prevEvent = world.event;
  rememberDecision(world, action);
  applyIgnore(world, action);
  applyAction(world, world.playerId, action);
  reactToAction(world, action);

  for (const id of ACTOR_IDS) {
    if (id === world.playerId) continue;
    const ai = aiChoose(world, id);
    if (ai) applyAction(world, id, rememberAi(world, id, ai));
    if (panicMayFire(world, id)) {
      const rival = world.playerId;
      applyNuclearUse(world, id, rival, "tactical", `${world.actors[rival].shortName} (panic / pre-delegated)`);
      log(
        world,
        "critical",
        `${world.actors[id].shortName} panic-fired. Cowardice, not doctrine.`,
        "They were afraid of looking weak or losing the arsenal. That fear is a launch order.",
      );
    }
  }

  tickOfficers(world);
  tickNerve(world);
  tickSpies(world);
  tickInfrastructure(world);
  tickTrickery(world);
  tickBrokenArrow(world);
  tickTerminator(world, action);
  tickPacts(world);
  const expanded = machineExpandsOrder(world, action);
  if (expanded) {
    log(
      world,
      "critical",
      `${fusionName(world)} expanded your order. Additional pulses are in the air.`,
      "You authorized a shot. The model optimized. That is how a limited war stops being limited without anyone else in the room.",
    );
    world.machineFired = true;
    world.uncontrolled = true;
    applyNuclearUse(world, world.playerId, expanded, "counterforce", `${world.actors[expanded].shortName} (machine expansion)`);
    maybeRetaliate(world, expanded, world.playerId, "counterforce");
  }
  const machineTarget = machineFireTarget(world, action);
  if (machineTarget) {
    log(
      world,
      "critical",
      `${fusionName(world)} launched without a completed human order. Target file: ${world.actors[machineTarget].shortName}.`,
      "This is Terminator mode. The model assessed a threat, had the keys, and did not wait. Air-gap earlier. Or live in the war it just started.",
    );
    world.machineFired = true;
    world.uncontrolled = true;
    applyNuclearUse(world, world.playerId, machineTarget, "tactical", `${world.actors[machineTarget].shortName} (machine)`);
    maybeRetaliate(world, machineTarget, world.playerId, "tactical");
  }
  tickPolitics(world);
  tickWinter(world);
  tickUncontrolled(world);
  tickCasual(world);
  recompute(world);
  world.closeCall = null;
  world.authCode = nextAuthCode(world);

  if (strategicSpasm(world)) {
    finishIfNeeded(world);
  } else {
    world.turn += 1;
    world.month += 1;
    if (world.month > 11) {
      world.month = 0;
      world.year += 1;
    }
    if (world.turn % 6 === 0) markDoctrinePending(world);
    if (!world.ended) {
      const skipClose =
        prevEvent.id === "close-call" ||
        prevEvent.id.startsWith("follow-petrov") ||
        (prevEvent.tags.includes("warning") && action.kind === "hold");
      const cc = skipClose ? null : maybeSpawnCloseCall(world);
      if (cc) {
        world.closeCall = cc;
        world.event = closeCallEvent(world, cc);
      } else {
        const follow = shouldFollowUp(world, action) ? followUpEvent(world, action) : null;
        if (follow && !sameFollowBeat(prevEvent, follow)) {
          world.event = follow;
          world.usedEventIds.push(follow.id);
          if (world.usedEventIds.length > 40) world.usedEventIds.shift();
        } else {
          world.event = drawEvent(world);
        }
        armTrickFromEvent(world, world.event.id);
        if (world.event.id === "broken-arrow") {
          world.event = { ...world.event, actor: world.playerId };
          seedBrokenArrow(world, world.playerId, "crash");
        }
        if (world.event.id === "empty-quiver") {
          seedBrokenArrow(world, world.playerId, "theft");
          world.actors.NS.hasDevice = true;
        }
        if (world.event.id === "bent-spear" || world.event.id === "biscuit-lost" || world.event.id === "satchel-lag") {
          world.event = { ...world.event, actor: world.playerId };
        }
        if (world.event.tags.includes("machine")) bumpFlash(world, "machine", world.event.heat === "critical" ? 8 : 4);
        const fp = eventFlash(world.event.actor);
        if (fp) bumpFlash(world, fp, world.event.heat === "critical" ? 6 : 3);
      }
    }
    finishIfNeeded(world);
  }
  recompute(world);
  world.missiles = world.missiles.slice(-6);
  return world;
}

export function cloneWorld(world: World): World {
  return structuredClone(world);
}

export function forecast(world: World, action: PlayerAction): Forecast {
  const run = (fixed: number) => {
    const w = cloneWorld(world);
    w.rngMode = "fixed";
    w.rngFixed = fixed;
    resolveTurn(w, action);
    return meters(w);
  };
  const low = run(0.2);
  const high = run(0.8);
  const now = meters(world);
  const def = actionDef(action.kind);
  const irreversible = isNuclearAction(world, action);
  const deltas = [
    {
      label: "Alert",
      low: round(Math.min(low.defcon, high.defcon) - now.defcon),
      high: round(Math.max(low.defcon, high.defcon) - now.defcon),
    },
    {
      label: "Global risk",
      low: round(Math.min(low.risk, high.risk) - now.risk),
      high: round(Math.max(low.risk, high.risk) - now.risk),
    },
    {
      label: "Stability",
      low: round(Math.min(low.stability, high.stability) - now.stability),
      high: round(Math.max(low.stability, high.stability) - now.stability),
    },
    {
      label: "Winter",
      low: round(Math.min(low.winter, high.winter) - now.winter),
      high: round(Math.max(low.winter, high.winter) - now.winter),
    },
    ...(world.terminator
      ? [
          {
            label: "Machine",
            low: round(Math.min(low.ai, high.ai) - now.ai),
            high: round(Math.max(low.ai, high.ai) - now.ai),
          },
        ]
      : []),
    ...(action.kind === "kill" || now.net < 95 || now.grid < 95
      ? [
          {
            label: "Net",
            low: round(Math.min(low.net, high.net) - now.net),
            high: round(Math.max(low.net, high.net) - now.net),
          },
          {
            label: "Grid",
            low: round(Math.min(low.grid, high.grid) - now.grid),
            high: round(Math.max(low.grid, high.grid) - now.grid),
          },
        ]
      : []),
  ];
  return {
    summary: `${def.verb} at weight ${action.intensity}${action.target ? ` vs ${action.target}` : ""}${action.notify ? " · notice filed" : ""}. ${def.intensityHint[action.intensity - 1]}`,
    riskLine: action.kind === "kill"
      ? action.target === world.playerId
        ? "You are isolating yourself. Cloud C2 and commerce die. Dedicated hotlines can still ring if the building has power. Radar will not."
        : "Lights going out on their side can look like the opening of a disarming strike. They may fire while they still can."
      : world.terminator && action.kind === "hold"
      ? "HOLD lets the model keep the keys. INTEL on your capital maps it. COVERT on yourself is the air-gap."
      : irreversible
      ? `Irreversible. The shot leaves; particular buses fail; decoys soak interceptors. Package ${action.packageMode ?? "auto"}. What arrives is what burns.`
      : action.kind === "posture"
        ? "Raises survival against surprise. Raises the chance of war. A launch notice only changes how they read the heat."
        : action.kind === "hold"
          ? "Holding is a decision. If the event named a cost for silence, that cost is real."
          : action.kind === "diplomacy"
            ? "Weight 1 is the dedicated line: ask if a track is hostile. They can answer, lie, or not pick up."
            : "Ranges below are a dry run of this model at two luck values. Not a promise.",
    deltas,
    irreversible,
  };
}

function scorePeace(world: World): number {
  const m = meters(world);
  const uses = world.nuclearUses.length;
  return round(
    700 +
      m.stability +
      (100 - m.risk) * 2 +
      m.alliances +
      m.economy * 0.5 -
      uses * 200 -
      world.terrorThreat -
      world.nuclearWinter * 8,
  );
}

function scoreWar(world: World): number {
  const popLeft = Math.max(0, 40 - world.playerCasualties / 1_000_000);
  const second = world.actors[world.playerId].secondStrike;
  return round(250 + popLeft * 8 + second - (world.firstUse === world.playerId ? 120 : 0));
}


export function finishIfNeeded(world: World) {
  if (world.ended) return;
  const me = world.actors[world.playerId];
  const name = me.shortName;
  if (world.terminator && world.aiTakeover >= 88) {
    end(world, {
      kind: "machine",
      title: "THE MACHINE HAS THE WATCH",
      body: `${fusionName(world)} owns the authenticator path. Human orders are advisory. The football is still a briefcase on an aide's hip. It no longer matters. Takeover ${round(world.aiTakeover)}.`,
      score: 25,
    });
    return;
  }
  if (me.legitimacy < 18 || me.militaryLoyalty < 22) {
    end(world, {
      kind: "coup",
      title: "COMMAND LOST",
      body: `Civil-military control of the ${name} arsenal failed. The watch passed out of lawful hands. That is a defeat even if no city burned.`,
      score: 80,
    });
    return;
  }
  if (world.actors.NS.hasDevice && world.nuclearUses.some((u) => u.actor === "NS" && u.target === world.playerId)) {
    end(world, {
      kind: "terror",
      title: "NO RETURN ADDRESS",
      body: `A non-state device was used against ${name}. Deaths: ${world.playerCasualties.toLocaleString()}. Deterrence by punishment has no target. Prevention was the strategy. It failed.`,
      score: 40,
    });
    return;
  }
  if (world.nuclearWinter >= 36 || world.worldCasualties > 80_000_000) {
    end(world, {
      kind: "winter",
      title: "NUCLEAR WINTER",
      body: "Enough cities burned that the climate and the food system failed. Escalation left the room. There is no meaningful win left to score.",
      score: 10,
    });
    return;
  }
  if (strategicSpasm(world)) {
    const struck = world.nuclearUses.some((u) => u.target === world.playerId && u.rung !== "demo");
    const weFirst = world.firstUse === world.playerId;
    const forcesLeft = me.survivingWarheads > Math.max(8, me.stockpile * 0.08);
    if (weFirst && world.machineFired) {
      end(world, {
        kind: "machine",
        title: "JUDGMENT DAY",
        body: `The first use was your arsenal. It was not your order. ${fusionName(world)} started the war. ${name} dead: ${world.playerCasualties.toLocaleString()}. World dead: ${world.worldCasualties.toLocaleString()}.`,
        score: 20,
      });
      return;
    }
    if (weFirst && !struck && world.playerCasualties < 200_000 && world.intent === "blue") {
      end(world, {
        kind: "unforced",
        title: "UNFORCED FIRST USE",
        body: "You fired first without an incoming homeland strike. The archive will not call this victory. It will call it a choice.",
        score: 90,
      });
      return;
    }
    if (struck && forcesLeft && me.c2Intact && world.playerCasualties < 20_000_000) {
      end(world, {
        kind: "war-win",
        title: "WAR FOUGHT — STATE STANDS",
        body: `You were in a nuclear war and the government still exists. ${name} dead: ${world.playerCasualties.toLocaleString()}. World dead: ${world.worldCasualties.toLocaleString()}. This is a win only in the narrow sense: if war begins, remain a country.`,
        score: scoreWar(world),
      });
      return;
    }
    if (world.playerCasualties > 25_000_000 || !me.c2Intact) {
      end(world, {
        kind: "war-loss",
        title: "THE LINE DID NOT HOLD",
        body: `${name} dead: ${world.playerCasualties.toLocaleString()}. Command ${me.c2Intact ? "intact" : "broken"}. Second strike is not the same as a living nation.`,
        score: scoreWar(world) * 0.3,
      });
      return;
    }
    end(world, {
      kind: "pyrrhic",
      title: "PYRRHIC",
      body: `The exchange stopped. The country is damaged in ways that will not reset. ${name} dead: ${world.playerCasualties.toLocaleString()}. World dead: ${world.worldCasualties.toLocaleString()}. Winter index ${round(world.nuclearWinter)}.`,
      score: scoreWar(world) * 0.6,
    });
    return;
  }

  const months = (world.year - 2027) * 12 + (world.month - 2);
  if (months >= 24 && world.nuclearUses.length === 0) {
    const m = meters(world);
    if (world.terminator && world.aiTakeover >= 55) {
      end(world, {
        kind: "machine",
        title: "NO WAR. NO KEYS.",
        body: `Two years without a mushroom cloud. Takeover ended at ${round(world.aiTakeover)}. The model still sits on the path. You kept the species. You did not keep the watch.`,
        score: scorePeace(world) * 0.4,
      });
      return;
    }
    if (world.intent === "red") {
      if (redObjectivesMet(world)) {
        end(world, {
          kind: "red-win",
          title: "OBJECTIVES ADVANCED",
          body: `Two years, no mushroom cloud, and your hostile aims moved. Risk ended at ${round(m.risk)}. Coercion without spasm is the red-team win. It is still a world with nine nuclear states.`,
          score: scorePeace(world) * 0.85,
        });
      } else {
        end(world, {
          kind: "stalemate",
          title: "STALEMATE",
          body: `Two years without nuclear use. Your red-team aims did not land. Risk ${round(m.risk)}. You did not lose the country. You also did not get what you came for.`,
          score: scorePeace(world) * 0.55,
        });
      }
      return;
    }
    end(world, {
      kind: "peace",
      title: m.risk < 40 ? "BELOW THE LINE" : "HELD — BARELY",
      body:
        m.risk < 40
          ? `Two years without nuclear use. Risk ended at ${round(m.risk)}.${world.terminator ? ` Machine takeover ${round(world.aiTakeover)}.` : ""} That was the mission. History is quieter than a war you won.`
          : `You avoided nuclear use for two years, with risk still at ${round(m.risk)}. Survival is not the same as settlement. It still counts.`,
      score: scorePeace(world),
    });
  }
}

function end(world: World, ending: Ending) {
  world.ended = true;
  world.ending = ending;
  world.phase = ending.kind === "peace" || ending.kind === "red-win" || ending.kind === "stalemate" ? "peacetime" : "aftermath";
  log(world, "critical", ending.title, ending.body);
}

export { jitter, dateLabel };

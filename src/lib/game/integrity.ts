import { createWorld } from "./world";
import { resolveTurn, forecast } from "./sim";
import { applyScenario, SCENARIOS, SCENARIO_IDS } from "./scenarios";
import { SCENARIO_BRIEFS, briefFor } from "./scenarioBriefs";
import { buildArchive, lockedLine } from "./archive";
import { TUTORIAL_STEPS, shouldShowTutorial } from "./tutorial";
import { dailyWatch, defconSpark, shareText } from "./daily";
import { ARCS, arcById } from "./arcs";
import { DECK, drawEvent } from "./events";
import { foldDaily } from "./stats";
import { makeActors } from "./actors";
import { seatObjectives } from "./objectives";
import { encodeReplay, decodeReplay, recordTurn } from "./replay";
import { ACTIONS } from "./actions";
import { bodyFor } from "./advisors/bodies";
import { ACTOR_IDS, PLAYABLE_IDS } from "./types";
import type { ActorId, PlayerAction, World } from "./types";
import { applyNuclearUse } from "./nuclear";
import { replayFromCode } from "./replayRun";
import { proposePact } from "./pacts";
import { proposeCeasefire } from "./ceasefire";
import { applyC2Stance } from "./c2";
import { majorityKind, staffAdvice } from "./staff";
import { deskName } from "./humans";
import { buildTrack, resolveCloseCallHold } from "./warning";
import { flightProfile, isMaritimeAzimuth, unresolvedProfile, wallSecondsFor } from "./flight";
import { distanceKm } from "./geo";
import { currentPost, postEffects, postsFor, standingPost, tickRelocation } from "./posts";
import {
  DEFAULT_LEADER,
  LEADERS,
  assignLeaders,
  establishLeader,
  leaderKnown,
  leaderOf,
  misreadRisk,
  playerLeader,
} from "./leaders";
import { advisorById, ageOf, hawkishness, rosterFor } from "./advisors/roster";
import { addressFor, addressVariants } from "./advisors/address";
import {
  advisorStance,
  candorOf,
  convene,
  participants,
  recordDecision,
  roomConsensus,
  trustOf,
} from "./advisors/conference";
import { openingLine, recommendationLine, situationLine } from "./advisors/script";
import { asPlayable } from "./command";
import {
  DEFEAT_CONDITIONS,
  MIN_VICTORY_MONTH,
  VICTORY_CONDITIONS,
  ensureMandate,
  tickMandate,
} from "./mandate";
import { isWin } from "./stats";
import {
  FIRST_DECISION_TURN,
  availableOptions,
  currentDecision,
  openDecisionIfWarranted,
} from "./decisions";

export interface IntegrityResult {
  ok: boolean;
  checks: { name: string; ok: boolean; detail: string }[];
}


/** A world with a close call AND a decision card open, for conference checks. */
function worldWithCard(seed: number): World {
  const w = applyScenario(createWorld("extreme", seed, "US", "blue"), "petrov-1983");
  w.playerId = "US";
  w.turn = Math.max(w.turn, FIRST_DECISION_TURN);
  openDecisionIfWarranted(w);
  return w;
}

function hold(): PlayerAction {
  return { kind: "hold", intensity: 1, target: null };
}

function diplomacy(target: ActorId): PlayerAction {
  return { kind: "diplomacy", intensity: 1, target };
}

function runTurns(world: World, n: number): World {
  let w = world;
  for (let i = 0; i < n; i++) {
    if (w.ended) break;
    const act = i % 3 === 0 ? diplomacy(w.event.actor === w.playerId ? "RU" : w.event.actor) : hold();
    recordTurn(w, act);
    w = resolveTurn(structuredClone(w), act);
  }
  return w;
}

export function runIntegrityChecks(): IntegrityResult {
  const checks: IntegrityResult["checks"] = [];

  function check(name: string, fn: () => string) {
    try {
      const detail = fn();
      checks.push({ name, ok: true, detail });
    } catch (err) {
      checks.push({ name, ok: false, detail: err instanceof Error ? err.message : String(err) });
    }
  }

  for (const id of PLAYABLE_IDS) {
    check(`create:${id}`, () => {
      const w = createWorld("standard", 1000 + id.charCodeAt(0), id, "blue");
      if (!w.actors[id]) throw new Error(`missing actor ${id}`);
      if (!w.event) throw new Error("no opening event");
      seatObjectives(w);
      forecast(w, hold());
      return `turn ${w.turn} event ${w.event.id}`;
    });
  }

  for (const s of SCENARIOS) {
    check(`scenario:${s.id}`, () => {
      let w = createWorld(s.difficulty, 2000, s.playerId, s.intent);
      w = applyScenario(w, s.id);
      if (!w.event) throw new Error("no event");
      w = runTurns(w, 3);
      return `ended=${w.ended} turn=${w.turn}`;
    });
  }

  check("sandbox-12-turns", () => {
    const w = runTurns(createWorld("hard", 7, "US", "blue"), 12);
    return `turn ${w.turn} ended=${w.ended} uses=${w.nuclearUses.length}`;
  });

  check("red-kp", () => {
    const w = runTurns(createWorld("extreme", 11, "KP", "red"), 6);
    return `turn ${w.turn} ended=${w.ended}`;
  });

  check("iran-seat", () => {
    const w = runTurns(createWorld("standard", 13, "IR", "blue"), 4);
    if (w.event.id === undefined) throw new Error("no event");
    return w.event.id;
  });

  check("replay-roundtrip", () => {
    const w = createWorld("standard", 99, "US", "blue");
    recordTurn(w, hold());
    const dec = decodeReplay(encodeReplay(w));
    if (!dec || dec.seed !== 99) throw new Error("decode failed");
    return `actions ${dec.actions.length}`;
  });

  check("terminator", () => {
    const w = runTurns(createWorld("standard", 17, "US", "blue", true), 4);
    return `takeover ${w.aiTakeover}`;
  });

  check("no-repeat-event", () => {
    let w = createWorld("standard", 42, "US", "blue");
    const ids = [w.event.id];
    for (let i = 0; i < 8; i++) {
      if (w.ended) break;
      const next = resolveTurn(structuredClone(w), hold());
      if (!next.ended && next.event.id === w.event.id) throw new Error(`repeat ${next.event.id}`);
      ids.push(next.event.id);
      w = next;
    }
    return ids.join(">");
  });

  check("hold-follow-up", () => {
    for (const seed of [1, 2, 3, 5, 7, 11, 13, 17, 19, 23]) {
      const next = resolveTurn(structuredClone(createWorld("standard", seed, "US", "blue")), hold());
      if (next.event.because || next.event.id.startsWith("follow-")) {
        return `${next.event.id} · ${next.event.because ?? "no because"}`;
      }
    }
    throw new Error("no follow-up after hold");
  });

  check("strike-boost-fail", () => {
    const w = createWorld("standard", 3, "US", "blue");
    w.rngMode = "fixed";
    w.rngFixed = 0.01;
    applyNuclearUse(w, "US", "RU", "counterforce", "integrity", false, 300, "mirv-decoy");
    const u = w.nuclearUses[0];
    if (!u?.outcome) throw new Error("no strike outcome");
    if (u.outcome !== "failed" && (u.failed ?? 0) < 1) throw new Error(`expected fail, got ${u.outcome}`);
    return `${u.outcome} failed=${u.failed} arrived=${u.arrived}`;
  });

  check("strike-intercept", () => {
    const w = createWorld("standard", 5, "US", "blue");
    w.rngMode = "fixed";
    w.rngFixed = 0.28;
    w.actors.RU.missileDefense = 99;
    for (const s of w.actors.US.systems) s.reliability = 1;
    applyNuclearUse(w, "US", "RU", "counterforce", "integrity", false, 300, "mirv-decoy");
    const u = w.nuclearUses[0];
    if (!u) throw new Error("no use");
    if ((u.intercepted ?? 0) < 1 && u.outcome !== "intercepted" && u.outcome !== "partial") {
      throw new Error(`expected intercept, got ${u.outcome} int=${u.intercepted}`);
    }
    return `${u.outcome} intercepted=${u.intercepted} decoys=${u.decoys} arrived=${u.arrived}`;
  });

  check("replay-playback", () => {
    const original = runTurns(createWorld("standard", 77, "US", "blue"), 4);
    const code = encodeReplay(original);
    const run = replayFromCode(code);
    if (!run) throw new Error("replay decode failed");
    if (run.world.turn !== original.turn) throw new Error(`turn ${run.world.turn} vs ${original.turn}`);
    if (run.world.ended !== original.ended) throw new Error("ended mismatch");
    return `turn ${run.world.turn} event ${run.world.event.id}`;
  });

  check("pact-renew", () => {
    const w = createWorld("standard", 1, "US", "blue");
    w.rngMode = "fixed";
    w.rngFixed = 0.01;
    proposePact(w, "US", "RU");
    if (!w.pacts?.length) throw new Error("pact not accepted");
    w.turn = 5;
    proposePact(w, "US", "RU");
    const until = w.pacts[0]?.untilTurn ?? 0;
    if (until < 16) throw new Error(`until ${until}`);
    return `until ${until}`;
  });

  check("c2-low", () => {
    const w = createWorld("standard", 1, "US", "blue");
    const before = w.actors.US.launchOnWarning;
    if (!applyC2Stance(w, "low")) throw new Error("first LOW failed");
    if (w.actors.US.launchOnWarning === before) throw new Error("LOW did not toggle");
    if (applyC2Stance(w, "nfu")) throw new Error("second C2 change should lock");
    return `LOW ${w.actors.US.launchOnWarning}`;
  });

  check("ceasefire-offer", () => {
    const w = createWorld("standard", 8, "US", "blue");
    w.rngMode = "fixed";
    w.rngFixed = 0.01;
    applyNuclearUse(w, "US", "RU", "tactical", "test", false, 20, "single");
    if (!proposeCeasefire(w, "US", "RU") || !w.ceasefire?.accepted) throw new Error("no ceasefire");
    return `until ${w.ceasefire.untilTurn}`;
  });

  check("new-flashpoints", () => {
    const w = createWorld("standard", 1, "US", "blue");
    for (const id of ["himalaya", "space"] as const) {
      if (!w.flashpoints.some((f) => f.id === id)) throw new Error(`missing ${id}`);
    }
    return "himalaya+space";
  });

  check("new-scenario-seats", () => {
    const expect: Record<string, string> = {
      "taiwan-prc-2027": "CN",
      "trident-casd": "UK",
      "frappe-independence": "FR",
      "nasr-flushed": "PK",
      "asat-blind-2028": "US",
      "lac-clash-2027": "IN",
    };
    for (const [id, seat] of Object.entries(expect)) {
      const def = SCENARIOS.find((s) => s.id === id);
      if (!def || def.playerId !== seat) throw new Error(`${id} seat`);
    }
    return Object.keys(expect).join(",");
  });

  check("staff-advice", () => {
    const w = createWorld("standard", 1, "US", "blue");
    const advice = staffAdvice(w);
    if (advice.length !== 3) throw new Error(`expected 3 desks, got ${advice.length}`);
    majorityKind(advice);
    return advice.map((a) => a.kind).join(",");
  });

  check("treaties-seeded", () => {
    const w = createWorld("standard", 1, "US", "blue");
    if (!w.treaties?.some((t) => t.id === "new-start" && t.status === "dead")) throw new Error("New START not dead");
    if (!w.treaties.some((t) => t.id === "ost")) throw new Error("no OST");
    return `${w.treaties.length} treaties`;
  });

  check("turn-recap", () => {
    const next = resolveTurn(structuredClone(createWorld("standard", 3, "US", "blue")), hold());
    if (!next.lastRecap) throw new Error("no recap");
    if (!next.lastRecap.nextTitle) throw new Error("no next title");
    return `${next.lastRecap.actionLabel} · ${next.lastRecap.deltas.length} deltas`;
  });

  check("orbital-systems", () => {
    const actors = makeActors();
    const kinetic = actors.US.systems.find((s) => s.id === "us-orbital-kinetic");
    if (!kinetic || kinetic.disclosure !== "unacknowledged" || kinetic.kind !== "orbital") {
      throw new Error("US orbital kinetic missing");
    }
    const fobs = actors.RU.systems.find((s) => s.id === "ru-fobs");
    if (!fobs || fobs.kind !== "fobs") throw new Error("RU FOBS missing");
    const cnFobs = actors.CN.systems.find((s) => s.id === "cn-fobs");
    if (!cnFobs || cnFobs.kind !== "fobs") throw new Error("CN FOBS missing");
    const hunter = actors.CN.systems.find((s) => s.id === "cn-hunter");
    if (!hunter || hunter.kind !== "orbital") throw new Error("CN hunter missing");
    return "US kinetic + RU/CN FOBS + hunter";
  });

  check("carrington-scenario", () => {
    const w = applyScenario(createWorld("extreme", 9, "US", "blue"), "carrington-2027");
    if (!w.spaceWeather?.cmeInbound) throw new Error("no CME inbound");
    if (w.spaceWeather.flare !== "X") throw new Error(`flare ${w.spaceWeather.flare}`);
    if (w.event.id !== "carrington-scenario") throw new Error(w.event.id);
    const advice = staffAdvice(w);
    if (!advice.some((a) => a.kind === "hold" || a.kind === "kill" || a.kind === "intelligence")) {
      throw new Error("staff ignored the sun");
    }
    return `CME ${w.spaceWeather.hoursToArrival}h · staff ${advice.map((a) => a.kind).join(",")}`;
  });

  check("fobs-scenario", () => {
    const w = applyScenario(createWorld("hard", 9, "US", "blue"), "fobs-ambiguity");
    if (w.closeCall?.track.kind !== "test") throw new Error(`track ${w.closeCall?.track.kind}`);
    if (w.event.id !== "fobs-scenario") throw new Error(w.event.id);
    return `kind ${w.closeCall.track.kind} conf ${w.closeCall.track.confidence}`;
  });

  check("anomalous-track-hold", () => {
    const w = createWorld("hard", 11, "US", "blue");
    w.closeCall = {
      track: buildTrack(w, "RU", "anomalous"),
      humint: "Radar and IR disagree — no boost signature.",
    };
    const before = w.defcon;
    resolveCloseCallHold(w);
    if (w.defcon < before && w.defcon === 1) throw new Error("anomalous hold escalated to war");
    return `defcon ${w.defcon}`;
  });

  check("black-brant-close-call", () => {
    const w = applyScenario(createWorld("extreme", 12, "RU", "blue"), "black-brant-1995");
    if (!w.closeCall) throw new Error("no close call");
    if (w.closeCall.track.minutesToImpact !== 10) throw new Error(`tti ${w.closeCall.track.minutesToImpact}`);
    return `conf ${w.closeCall.track.confidence}`;
  });

  check("malmstrom-phenomenology", () => {
    const w = applyScenario(createWorld("extreme", 13, "US", "blue"), "malmstrom-1967");
    if (w.closeCall?.track.kind !== "anomalous") throw new Error(`kind ${w.closeCall?.track.kind}`);
    const advice = staffAdvice(w);
    if (!advice.some((a) => a.kind === "hold")) throw new Error("staff did not recommend hold");
    return advice.map((a) => a.kind).join(",");
  });

  check("mirv-seeded", () => {
    const w = createWorld("standard", 1, "US", "blue");
    const d5 = w.actors.US.systems.find((s) => s.id === "us-d5");
    const yars = w.actors.RU.systems.find((s) => s.id === "ru-yars");
    if (!d5 || (d5.rvsPerBus ?? 0) < 2) throw new Error("Trident not MIRV");
    if (!yars || (yars.decoys ?? 0) < 1) throw new Error("Yars missing decoys");
    return `D5 MIRV ×${d5.rvsPerBus} decoys ${d5.decoys}`;
  });

  check("mandate-pool-wellformed", () => {
    const all = [...VICTORY_CONDITIONS, ...DEFEAT_CONDITIONS];
    const ids = new Set<string>();
    for (const c of all) {
      if (ids.has(c.id)) throw new Error(`duplicate condition id ${c.id}`);
      ids.add(c.id);
      if (c.sustain < 1) throw new Error(`${c.id} sustain ${c.sustain}`);
      if (!c.label || !c.detail) throw new Error(`${c.id} missing copy`);
    }
    // Every condition must evaluate without throwing on a fresh world of each
    // intent, and report progress inside 0-100.
    for (const intent of ["blue", "red"] as const) {
      const w = createWorld("standard", 11, "US", intent);
      for (const c of all) {
        const p = c.progress(w);
        if (!Number.isFinite(p) || p < 0 || p > 100) throw new Error(`${c.id} progress ${p}`);
        c.holds(w);
      }
    }
    return `${VICTORY_CONDITIONS.length} victory · ${DEFEAT_CONDITIONS.length} defeat`;
  });

  check("mandate-issued-and-deterministic", () => {
    const a = ensureMandate(createWorld("standard", 21, "US", "blue"));
    const b = ensureMandate(createWorld("standard", 21, "US", "blue"));
    if (!a.mandate || !b.mandate) throw new Error("no mandate issued");
    if (a.mandate.victoryId !== b.mandate.victoryId || a.mandate.defeatId !== b.mandate.defeatId) {
      throw new Error("mandate selection is not deterministic for a seed");
    }
    // A mandate must also reach the player: it leads the objectives list.
    const objs = seatObjectives(a);
    if (!objs.some((o) => o.id.startsWith("mandate-victory-"))) throw new Error("victory not in objectives");
    if (!objs.some((o) => o.id.startsWith("mandate-defeat-"))) throw new Error("loss point not in objectives");
    return `${a.mandate.victoryId} / ${a.mandate.defeatId}`;
  });

  check("mandate-resolves-one-way-only", () => {
    // Across many seeds a mandate must never report both outcomes, and a
    // resolved watch must map to exactly one side of isWin().
    let wins = 0;
    let losses = 0;
    for (let seed = 1; seed <= 24; seed += 1) {
      let w = createWorld("standard", seed, "US", "blue");
      for (let i = 0; i < 26 && !w.ended; i += 1) {
        w = resolveTurn(structuredClone(w), i % 3 === 0 ? diplomacy(w.event.actor) : hold());
      }
      const m = w.mandate;
      if (m?.resolved === "victory" && m.victoryStreak < 1) throw new Error("victory with no streak");
      if (w.ending?.kind === "mandate-win") {
        wins += 1;
        if (!isWin("mandate-win")) throw new Error("mandate-win is not a win");
        if (w.turn < MIN_VICTORY_MONTH) throw new Error(`won at month ${w.turn}, before the floor`);
      }
      if (w.ending?.kind === "mandate-loss") {
        losses += 1;
        if (isWin("mandate-loss")) throw new Error("mandate-loss counted as a win");
      }
    }
    return `win ${wins} · loss ${losses} across 24 seeds`;
  });

  check("mandate-tick-counts-one-month-once", () => {
    // finishIfNeeded can run twice in a turn; the streak must not double-count.
    const w = ensureMandate(createWorld("standard", 33, "US", "blue"));
    w.turn = 5;
    tickMandate(w);
    const first = (w.mandate!.victoryStreak ?? 0) + (w.mandate!.defeatStreak ?? 0);
    tickMandate(w);
    const second = (w.mandate!.victoryStreak ?? 0) + (w.mandate!.defeatStreak ?? 0);
    if (first !== second) throw new Error(`streak advanced twice in one turn: ${first} -> ${second}`);
    return `stable at ${second}`;
  });

  check("decision-not-on-opening-turn", () => {
    // HARD CI CONTRACT. scripts/mobile-game-smoke.mjs walks turn 1 of these two
    // scenarios and requires a button named exactly "Execute". The decision
    // branch in ActionPanel replaces that button, and signal-window seeds a
    // close call on turn 1 — so a card here would break the mobile gate.
    for (const id of ["signal-window", "deadhand-dilemma"] as const) {
      const w = applyScenario(createWorld("standard", 4, "US", "blue"), id);
      openDecisionIfWarranted(w);
      if (w.decision) throw new Error(`${id} opened a decision on turn ${w.turn}`);
      if (currentDecision(w)) throw new Error(`${id} exposed a card on turn ${w.turn}`);
    }
    return `no card before turn ${FIRST_DECISION_TURN}`;
  });

  check("decision-world-stays-cloneable", () => {
    // Regression guard: DecisionOption carries functions. If the live card ever
    // gets stored on the world again, structuredClone throws here and saves die.
    let w = createWorld("standard", 9, "US", "blue");
    let opened = 0;
    for (let i = 0; i < 14 && !w.ended; i += 1) {
      w = resolveTurn(structuredClone(w), hold());
      if (w.decision) opened += 1;
      structuredClone(w);
      JSON.parse(JSON.stringify(w));
    }
    return `cloned ${opened} turn(s) with a card open`;
  });

  check("decision-window-always-resolves", () => {
    // Stalling must terminate. Repeatedly take a window-spending option and the
    // card has to come off the desk rather than sitting there forever.
    let w = createWorld("standard", 15, "US", "blue");
    let sawCard = false;
    for (let i = 0; i < 24 && !w.ended; i += 1) {
      const card = currentDecision(w);
      if (card) {
        sawCard = true;
        const opts = availableOptions(w);
        const staller = opts.find((o) => o.costsWindow) ?? opts[0];
        const openedAt = w.decision?.openedTurn ?? w.turn;
        w = resolveTurn(structuredClone(w), { ...staller.action, decisionOptionId: staller.id });
        const windowSize = card.windowTurns ?? 1;
        if (w.decision && w.turn - openedAt > windowSize + 1) {
          throw new Error(`card ${card.id} outlived its ${windowSize}-month window`);
        }
      } else {
        w = resolveTurn(structuredClone(w), hold());
      }
    }
    return sawCard ? "window closed on schedule" : "no card raised in 24 turns";
  });

  check("decision-choice-replays", () => {
    // The chosen option rides on the PlayerAction, so a recorded run must
    // reproduce exactly — this is what keeps replay codes honest.
    let w = createWorld("standard", 15, "US", "blue");
    const actions: PlayerAction[] = [];
    for (let i = 0; i < 12 && !w.ended; i += 1) {
      const opts = availableOptions(w);
      const act: PlayerAction = opts.length
        ? { ...opts[0].action, decisionOptionId: opts[0].id }
        : hold();
      actions.push(act);
      w = resolveTurn(structuredClone(w), act);
    }
    let replayed = createWorld("standard", 15, "US", "blue");
    for (const act of actions) {
      if (replayed.ended) break;
      replayed = resolveTurn(structuredClone(replayed), act);
    }
    if (replayed.turn !== w.turn) throw new Error(`turn ${replayed.turn} vs ${w.turn}`);
    if (replayed.ended !== w.ended) throw new Error("ended mismatch");
    if (Math.round(replayed.globalRisk) !== Math.round(w.globalRisk)) {
      throw new Error(`risk ${replayed.globalRisk} vs ${w.globalRisk}`);
    }
    return `${actions.length} actions replayed identically`;
  });

  check("flight-profiles-wellformed", () => {
    // Every band a track can be sampled from has to be a usable nextInt range.
    const km = [200, 1500, 4000, 7000, 12000];
    const profiles = [...km.map((d) => flightProfile(d)), flightProfile(9000, true), unresolvedProfile()];
    for (const p of profiles) {
      if (!(p.lo >= 1 && p.hi >= p.lo)) throw new Error(`${p.id} bad range ${p.lo}-${p.hi}`);
      if (wallSecondsFor(p.lo) <= 0) throw new Error(`${p.id} has no clock`);
    }
    // Bands must be monotonic in range, or the geometry means nothing.
    const ladder = km.map((d) => flightProfile(d).lo);
    for (let i = 1; i < ladder.length; i += 1) {
      if (ladder[i] < ladder[i - 1]) throw new Error(`band ${i} regresses (${ladder[i]} < ${ladder[i - 1]})`);
    }
    return `${profiles.length} profiles · ${ladder[0]}-${ladder[ladder.length - 1]} min floor`;
  });

  check("flight-time-tracks-geometry", () => {
    // A track sampled from a far origin must not be able to arrive sooner than
    // a near one could at best. Sea-launched is the documented exception.
    const w = createWorld("standard", 31, "US", "blue");
    const near = distanceKm(w.actors.US.lat, w.actors.US.lon, w.actors.CU.lat, w.actors.CU.lon);
    const far = distanceKm(w.actors.US.lat, w.actors.US.lon, w.actors.KP.lat, w.actors.KP.lon);
    if (near >= far) throw new Error(`fixture broken: CU ${Math.round(near)}km >= KP ${Math.round(far)}km`);
    const nearBand = flightProfile(near);
    const farBand = flightProfile(far);
    if (farBand.hi <= nearBand.lo) throw new Error(`${farBand.id} never slower than ${nearBand.id}`);
    if (flightProfile(far, true).hi >= farBand.lo) throw new Error("sea-launched is not the shorter path");
    return `${Math.round(near)}km ${nearBand.id} vs ${Math.round(far)}km ${farBand.id}`;
  });

  check("flight-time-costs-one-draw", () => {
    // The whole determinism contract is draw *count*, not draw value. Building
    // the same track twice from the same rngState must consume the same amount
    // of stream and land on the same numbers.
    const a = createWorld("standard", 44, "US", "blue");
    const b = structuredClone(a);
    const ta = buildTrack(a, "RU", "attack");
    const tb = buildTrack(b, "RU", "attack");
    if (a.rngState !== b.rngState) throw new Error(`rng diverged ${a.rngState} vs ${b.rngState}`);
    if (ta.minutesToImpact !== tb.minutesToImpact) throw new Error("tti not deterministic");
    if (ta.azimuth !== tb.azimuth) throw new Error("azimuth not deterministic");
    const band = flightProfile(
      distanceKm(a.actors.US.lat, a.actors.US.lon, a.actors.RU.lat, a.actors.RU.lon),
      isMaritimeAzimuth(ta.azimuth),
    );
    if (ta.minutesToImpact < band.lo || ta.minutesToImpact > band.hi) {
      throw new Error(`tti ${ta.minutesToImpact} outside ${band.id} ${band.lo}-${band.hi}`);
    }
    return `${ta.minutesToImpact} min in ${band.id}`;
  });

  check("command-posts-cover-every-seat", () => {
    // A seat with no posts would render an empty panel and fall through to a
    // null standing post at world creation.
    for (const id of PLAYABLE_IDS) {
      const posts = postsFor(id);
      if (posts.length < 2) throw new Error(`${id} has ${posts.length} post(s)`);
      const standing = posts.filter((p) => p.standing);
      if (standing.length !== 1) throw new Error(`${id} has ${standing.length} standing posts`);
      // The standing post must be mechanically neutral, or simply starting a
      // game as that seat would shift warning quality and release integrity.
      if (standing[0].warning !== 0 || standing[0].releaseIntegrity !== 0) {
        throw new Error(`${id} standing post is not neutral`);
      }
      if (standing[0].transitTurns !== 0) throw new Error(`${id} starts in transit`);
    }
    return `${PLAYABLE_IDS.length} seats · ${PLAYABLE_IDS.reduce((n, id) => n + postsFor(id).length, 0)} posts`;
  });

  check("relocation-replays-and-costs-signature", () => {
    // Relocation rides on the action, so a replay from the same actions must
    // land in the same place with the same signature.
    const target = postsFor("US").find((p) => !p.standing && p.signature >= 2);
    if (!target) throw new Error("no signature-bearing US post to test");
    const actions: PlayerAction[] = [
      { ...hold(), relocateTo: target.id },
      hold(),
      hold(),
    ];
    const run = (): World => {
      let w = createWorld("standard", 77, "US", "blue");
      for (const act of actions) w = resolveTurn(structuredClone(w), act);
      return w;
    };
    const a = run();
    const b = run();
    if (a.commandPost !== b.commandPost) throw new Error("relocation not deterministic");
    if (a.commandPost !== target.id) throw new Error(`ended at ${a.commandPost}, wanted ${target.id}`);
    if ((a.postureSignature ?? 0) <= 0) throw new Error("moving to a wartime site cost no signature");
    if (Math.round(a.globalRisk) !== Math.round(b.globalRisk)) throw new Error("risk diverged");
    return `${target.short} · signature ${Math.round(a.postureSignature ?? 0)}`;
  });

  check("transit-degrades-then-clears", () => {
    // Being between posts is meant to be the worst moment to get a warning.
    const target = postsFor("US").find((p) => p.transitTurns > 0);
    if (!target) throw new Error("no US post with transit time");
    const w = createWorld("standard", 78, "US", "blue");
    const moving = resolveTurn(structuredClone(w), { ...hold(), relocateTo: target.id });
    const during = postEffects(moving);
    if (during.comms > 40) throw new Error(`transit comms ${during.comms} not degraded`);
    if (during.warning >= target.warning) throw new Error("transit did not cost warning");
    let settled = moving;
    for (let i = 0; i < 4 && settled.relocation; i += 1) {
      settled = resolveTurn(structuredClone(settled), hold());
    }
    if (settled.relocation) throw new Error("relocation never completed");
    if (currentPost(settled).id !== target.id) throw new Error("did not arrive");
    if (postEffects(settled).comms !== target.comms) throw new Error("modifiers did not take effect on arrival");
    return `transit comms ${during.comms} -> ${target.comms} at ${target.short}`;
  });

  check("post-signature-decays", () => {
    // Signature has to come back down, or one relocation poisons the whole run.
    const w = createWorld("standard", 79, "US", "blue");
    w.postureSignature = 60;
    for (let i = 0; i < 10; i += 1) tickRelocation(w);
    if ((w.postureSignature ?? 0) !== 0) throw new Error(`signature stuck at ${w.postureSignature}`);
    if (w.relocation) throw new Error("tick invented a relocation");
    return "60 -> 0 over 10 turns";
  });

  check("standing-post-is-the-world-default", () => {
    // createWorld and migrateWorld must agree, or an old save silently moves.
    for (const id of PLAYABLE_IDS) {
      const w = createWorld("standard", 80, id, "blue");
      if (w.commandPost !== standingPost(id).id) throw new Error(`${id} started at ${w.commandPost}`);
      if (w.relocation) throw new Error(`${id} started in transit`);
      const e = postEffects(w);
      if (e.warning !== 0 || e.releaseIntegrity !== 0) throw new Error(`${id} starts with modifiers`);
    }
    return `${PLAYABLE_IDS.length} seats start neutral at their standing post`;
  });

  check("every-seat-has-named-desks", () => {
    // KP and IR used to fall through to the generic ["staff"] fallback, which
    // rendered as "North Korea staff: panic" in the humans panel.
    const w = createWorld("standard", 91, "US", "blue");
    for (const id of PLAYABLE_IDS) {
      const seen = new Set<string>();
      for (let i = 0; i < 24; i += 1) seen.add(deskName(w, id));
      if (seen.has("staff")) throw new Error(`${id} falls back to the generic desk`);
      if (seen.size < 2) throw new Error(`${id} has only ${seen.size} desk name(s)`);
    }
    return `${PLAYABLE_IDS.length} seats have named desks`;
  });

  check("advisor-ages-plausible", () => {
    // The band serving flag officers and cabinet-level civilians occupy. US
    // statutory flag-officer retirement is 64; a four-star service chief is
    // typically 55-60, which is what "a USMC general in their 50s" means.
    let youngest = 99;
    let oldest = 0;
    for (const id of PLAYABLE_IDS) {
      for (const a of rosterFor(id)) {
        if (a.age < 45 || a.age > 67) throw new Error(`${a.id} is ${a.age}`);
        youngest = Math.min(youngest, a.age);
        oldest = Math.max(oldest, a.age);
      }
    }
    // The specific case Blake asked about.
    const usmc = rosterFor("US").find((a) => a.rank.includes("USMC"));
    if (!usmc) throw new Error("no USMC general on the US roster");
    if (usmc.age < 50 || usmc.age > 59) throw new Error(`USMC general is ${usmc.age}, not in their 50s`);
    return `${youngest}-${oldest}, USMC general ${usmc.age}`;
  });

  check("advisor-ages-survive-historical-scenarios", () => {
    // Ages are stored directly, not as birth years, because eight scenarios
    // reset world.year -- as far back as 1962. A birth-year model would have
    // every advisor unborn in half the campaign, so ageOf must ignore the year
    // entirely and drift off elapsed turns instead.
    const modern = createWorld("standard", 12, "US", "blue");
    const historical = structuredClone(modern);
    historical.year = 1962;
    for (const a of rosterFor("US")) {
      if (ageOf(a, historical) !== ageOf(a, modern)) throw new Error(`${a.id} ages with the calendar`);
      if (ageOf(a, historical) < 45) throw new Error(`${a.id} is ${ageOf(a, historical)} in 1962`);
    }
    // And they do age over a long campaign.
    const late = structuredClone(modern);
    late.turn = 25;
    const first = rosterFor("US")[0];
    if (ageOf(first, late) <= ageOf(first, modern)) throw new Error("nobody ages over two years of turns");
    return `stable across 1962/2027, +${ageOf(first, late) - ageOf(first, modern)}y over 24 turns`;
  });

  check("advisor-roster-covers-playable-seats", () => {
    for (const id of PLAYABLE_IDS) {
      const roster = rosterFor(id);
      if (roster.length < 5) throw new Error(`${id} has ${roster.length} advisors`);
      if (roster.some((a) => a.seat !== id)) throw new Error(`${id} roster has a foreign seat`);
      for (const rung of [1, 2, 3] as const) {
        if (!roster.some((a) => a.rung === rung)) throw new Error(`${id} has nobody at rung ${rung}`);
      }
      const ids = new Set(roster.map((a) => a.id));
      if (ids.size !== roster.length) throw new Error(`${id} has duplicate advisor ids`);
      // Personality must actually vary, or every tile reads the same.
      const hawks = new Set(roster.map((a) => hawkishness(a)));
      if (hawks.size < 3) throw new Error(`${id} roster has ${hawks.size} distinct dispositions`);
    }
    return `${PLAYABLE_IDS.length} seats · ${PLAYABLE_IDS.reduce((n, id) => n + rosterFor(id).length, 0)} advisors`;
  });

  check("address-forms-cover-every-seat", () => {
    for (const id of PLAYABLE_IDS) {
      const forms = addressVariants(id);
      for (const key of ["neutral", "masculine", "feminine", "office"] as const) {
        if (!forms[key] || !forms[key].trim()) throw new Error(`${id} missing ${key} form`);
      }
      const w = createWorld("standard", 21, id, "blue");
      if (addressFor(w) !== forms.neutral) throw new Error(`${id} default is not the neutral form`);
      w.addressStyle = "feminine";
      if (addressFor(w) !== forms.feminine) throw new Error(`${id} does not honour the chosen style`);
    }
    return `${PLAYABLE_IDS.length} seats addressed correctly`;
  });

  check("advisor-lines-render-the-chosen-address", () => {
    // A hardcoded "Mr." anywhere would misaddress the player forever.
    const w = worldWithCard(22);
    w.addressStyle = "feminine";
    convene(w, 2);
    const room = participants(w, 2);
    if (!room.length) throw new Error("nobody joined a rung-2 conference");
    let checked = 0;
    for (const a of room) {
      const line = openingLine(w, a, advisorStance(w, a));
      if (/\bMr\. President\b/.test(line.text)) throw new Error(`${a.id} hardcodes a masculine address`);
      if (line.text.includes("Madam President")) checked += 1;
    }
    if (!checked) throw new Error("no line rendered the chosen address at all");
    return `${checked}/${room.length} lines used the chosen form`;
  });

  check("advisor-stance-is-deterministic-and-rng-free", () => {
    // Same contract as staffAdvice: forecast() replays through this twice per
    // render, so a draw here would diverge the stream.
    // Deliberately the deterministic fixture rather than playing forward until
    // a close call happens to spawn: how quickly one spawns is a balance
    // property, and this check is about determinism.
    const staged = worldWithCard(23);
    if (!currentDecision(staged)) throw new Error("fixture produced no decision card");
    convene(staged, 3);
    const before = staged.rngState;
    const first = participants(staged, 3).map((a) => advisorStance(staged, a)?.optionId);
    const second = participants(staged, 3).map((a) => advisorStance(staged, a)?.optionId);
    if (staged.rngState !== before) throw new Error("advisorStance consumed RNG");
    if (JSON.stringify(first) !== JSON.stringify(second)) throw new Error("advisorStance is not deterministic");
    if (!first.length) throw new Error("no stances produced");
    return `${first.length} stances, rngState untouched`;
  });

  check("conference-world-stays-cloneable", () => {
    // The Stage 1 regression that started all of this: functions on the World
    // make structuredClone throw and save.ts silently drop state.
    const w = worldWithCard(24);
    convene(w, 3);
    recordDecision(w, "hold-window");
    const cloned = structuredClone(w);
    if (cloned.conferenceRung !== w.conferenceRung) throw new Error("rung did not survive the clone");
    const round = JSON.parse(JSON.stringify(w)) as World;
    if (Object.keys(round.advisorTrust ?? {}).length !== Object.keys(w.advisorTrust ?? {}).length) {
      throw new Error("advisorTrust did not survive JSON");
    }
    return `rung ${w.conferenceRung} · ${Object.keys(w.advisorTrust ?? {}).length} trust entries`;
  });

  check("overruling-costs-trust-and-candor", () => {
    // The failure mode this models: a room you stop listening to stops telling
    // you the unwelcome thing.
    const w = worldWithCard(25);
    convene(w, 3);
    const room = participants(w, 3);
    const subject = room[0];
    const candorBefore = candorOf(w, subject);
    const trustBefore = trustOf(w, subject.id);
    for (let i = 0; i < 12; i += 1) recordDecision(w, "no-such-option-nobody-recommends");
    const trustAfter = trustOf(w, subject.id);
    const candorAfter = candorOf(w, subject);
    if (trustAfter >= trustBefore) throw new Error(`trust ${trustBefore} -> ${trustAfter}`);
    if (candorAfter >= candorBefore) throw new Error(`candor ${candorBefore} -> ${candorAfter}`);
    if (!(w.overruled ?? []).length) throw new Error("nothing recorded as overruled");
    // And once candor is low enough, they start deferring.
    const stance = advisorStance(w, subject);
    if (stance && !stance.deferring) throw new Error("advisor never started deferring");
    return `trust ${trustBefore} -> ${trustAfter}, candor ${Math.round(candorBefore)} -> ${Math.round(candorAfter)}`;
  });

  check("conference-rungs-cost-signature-and-reset", () => {
    const w = worldWithCard(26);
    const base = w.postureSignature ?? 0;
    convene(w, 1);
    if ((w.postureSignature ?? 0) !== base) throw new Error("a technical call cost signature");
    convene(w, 3);
    if ((w.postureSignature ?? 0) <= base) throw new Error("convening leadership cost nothing");
    if (participants(w, 3).length <= participants(w, 1).length) throw new Error("rung 3 did not widen the room");
    const after = resolveTurn(structuredClone(w), hold());
    if (after.conferenceRung !== 0) throw new Error("conference survived the turn");
    return `rung 3 signature ${Math.round(w.postureSignature ?? 0)} · ${participants(w, 3).length} on the call`;
  });

  check("post-comms-gates-the-room", () => {
    // The E-4B trade: survives almost anything, cannot hold the whole cabinet.
    const w = worldWithCard(27);
    convene(w, 3);
    const atPeoc = participants(w, 3).length;
    const airborne = structuredClone(w);
    airborne.commandPost = "US:e4b";
    airborne.relocation = null;
    const aloft = participants(airborne, 3).length;
    if (aloft >= atPeoc) throw new Error(`E-4B held ${aloft} of ${atPeoc}`);
    if (!aloft) throw new Error("E-4B could not hold anyone at all");
    return `PEOC ${atPeoc} on the call, E-4B ${aloft}`;
  });

  check("room-consensus-and-recommendations-render", () => {
    const w = worldWithCard(28);
    convene(w, 3);
    const card = currentDecision(w);
    if (!card) throw new Error("petrov-1983 produced no decision card");
    const consensus = roomConsensus(w, 3);
    if (!consensus) throw new Error("no consensus produced");
    if (!card.options.some((o) => o.id === consensus.optionId)) {
      throw new Error(`consensus ${consensus.optionId} is not an option on the card`);
    }
    for (const a of participants(w, 3)) {
      const stance = advisorStance(w, a);
      if (!stance) throw new Error(`${a.id} had no stance`);
      const line = recommendationLine(w, a, stance);
      if (!line.text.trim()) throw new Error(`${a.id} produced an empty recommendation`);
      if (line.text.includes("undefined")) throw new Error(`${a.id} line has an unrendered value`);
    }
    return `${consensus.optionId} at ${Math.round(consensus.share * 100)}%`;
  });

  check("room-does-not-speak-in-one-voice", () => {
    // Five advisors delivering the same sentence is the fastest way to make a
    // room of characters read as one template.
    const w = worldWithCard(29);
    convene(w, 3);
    const room = participants(w, 3);
    if (room.length < 5) throw new Error(`only ${room.length} on the call`);
    for (const [label, lines] of [
      ["opening", room.map((a) => openingLine(w, a, advisorStance(w, a)).text)],
      ["situation", room.map((a) => situationLine(w, a).text)],
    ] as const) {
      const unique = new Set(lines);
      if (unique.size < Math.ceil(room.length * 0.6)) {
        throw new Error(`${label}: ${unique.size} distinct lines across ${room.length} advisors`);
      }
      if (lines.some((l) => !l.trim() || l.includes("undefined"))) throw new Error(`${label}: bad line`);
    }
    return `${room.length} advisors, distinct openings and situation reads`;
  });

  check("advisor-lines-agree-with-their-numbers", () => {
    // A room that says "1 boosts" is not a room of professionals.
    const w = worldWithCard(30);
    convene(w, 3);
    if (!w.closeCall) throw new Error("fixture has no close call");
    let sampled = 0;
    for (const boosts of [0, 1, 2, 7]) {
      w.closeCall.track.boosts = boosts;
      for (const a of participants(w, 3)) {
        const texts = [
          openingLine(w, a, advisorStance(w, a)).text,
          situationLine(w, a).text,
        ];
        for (const text of texts) {
          sampled += 1;
          // Exactly the two failure modes: a plural noun on one, and a
          // singular noun on more than one.
          if (/\b1 boosts\b/.test(text)) throw new Error(`"1 boosts" in ${a.id}`);
          const singular = text.match(/\b(\d+) boost event\b(?!s)/);
          if (singular && singular[1] !== "1") throw new Error(`"${singular[0]}" in ${a.id}`);
          if (boosts === 0 && /\b0 boost/.test(text)) throw new Error(`${a.id} says "0 boost" instead of naming the absence`);
        }
      }
    }
    return `${sampled} lines checked across 0/1/2/7 boosts`;
  });

  check("every-decision-records-the-room", () => {
    // The bug this pins: applyDecision clears `world.decision` for any option
    // that closes the card, and recordDecision reads the card to work out who
    // advised what. With recordDecision second, the decisive options recorded
    // nothing and only the stalling ones ever cost anyone's trust -- exactly
    // backwards, since the committing choices are the ones that should.
    const staged = (): World => {
      const w = applyScenario(createWorld("extreme", 25, "US", "blue"), "petrov-1983");
      w.playerId = "US";
      w.turn = Math.max(w.turn, FIRST_DECISION_TURN);
      openDecisionIfWarranted(w);
      convene(w, 3);
      return w;
    };
    const options = availableOptions(staged());
    if (options.length < 2) throw new Error(`only ${options.length} options to test`);
    let closing = 0;
    for (const opt of options) {
      const before = staged();
      const after = resolveTurn(structuredClone(before), { ...opt.action, decisionOptionId: opt.id });
      const entries = Object.keys(after.advisorTrust ?? {}).length;
      if (!entries) throw new Error(`${opt.id} recorded no reaction from the room`);
      if (!opt.costsWindow) closing += 1;
    }
    if (!closing) throw new Error("fixture only covered stalling options, which is the passing case");
    return `${options.length} options, ${closing} of them card-closing, all recorded`;
  });

  check("leader-archetypes-wellformed", () => {
    const ids = new Set(LEADERS.map((l) => l.id));
    if (ids.size !== LEADERS.length) throw new Error("duplicate archetype id");
    if (!ids.has(DEFAULT_LEADER)) throw new Error("no default archetype");
    const base = LEADERS.find((l) => l.id === DEFAULT_LEADER)!;
    // The default has to be mechanically inert or every existing seed shifts.
    if (base.refusal || base.preDel || base.candor || base.legitimacy) throw new Error("default is not neutral");
    if (base.escalation !== 1 || base.diplomacy !== 1) throw new Error("default biases behaviour");
    for (const l of LEADERS) {
      if (l.escalation <= 0 || l.diplomacy <= 0) throw new Error(`${l.id} has a non-positive multiplier`);
      if (l.predictability < 0 || l.predictability > 100) throw new Error(`${l.id} predictability out of range`);
      if (!l.line.trim() || !l.detail.trim()) throw new Error(`${l.id} has no character`);
    }
    const volatile = LEADERS.filter((l) => l.volatile);
    if (volatile.length < 4) throw new Error(`only ${volatile.length} volatile temperaments`);
    // A volatile temperament that costs nothing is just flavour text.
    for (const l of volatile) {
      if (l.candor >= 0) throw new Error(`${l.id} is volatile but the room still speaks freely`);
      if (l.predictability > 65) throw new Error(`${l.id} is volatile but perfectly readable`);
    }
    return `${LEADERS.length} temperaments, ${volatile.length} volatile`;
  });

  check("adversary-leaders-are-deterministic-and-varied", () => {
    // Derived from the seed by hash, never drawn, so a replay faces the same
    // cast and no fixed seed shifts.
    const a = createWorld("standard", 7, "US", "blue");
    const b = createWorld("standard", 7, "US", "blue");
    const c = createWorld("standard", 8, "US", "blue");
    const cast = (w: World) =>
      (Object.keys(w.actors) as ActorId[])
        .filter((id) => id !== w.playerId)
        .map((id) => `${id}:${leaderOf(w, id).id}`)
        .join(",");
    if (cast(a) !== cast(b)) throw new Error("same seed produced a different cast");
    if (cast(a) === cast(c)) throw new Error("every seed produces the same cast");
    const rngBefore = a.rngState;
    assignLeaders(a);
    if (a.rngState !== rngBefore) throw new Error("assignLeaders consumed RNG");
    const distinct = new Set(
      (Object.keys(a.actors) as ActorId[]).filter((id) => id !== a.playerId).map((id) => leaderOf(a, id).id),
    );
    if (distinct.size < 4) throw new Error(`only ${distinct.size} distinct temperaments in the world`);
    // Seats whose command culture implies a temperament keep it.
    if (leaderOf(a, "KP").id !== "ideologue") throw new Error("KP drew a random temperament");
    return `${distinct.size} distinct temperaments, KP fixed, rngState untouched`;
  });

  check("volatile-leader-costs-the-room-its-candor", () => {
    // The headline effect: a leader nobody wants to contradict gets a room
    // that agrees with them, without a single advisor being overruled.
    const advisor = rosterFor("US").find((x) => x.branch === "intel");
    if (!advisor) throw new Error("no intelligence advisor on the US roster");
    const at = (id: string) => {
      const w = worldWithCard(41);
      w.leaderArchetype = id;
      return { candor: candorOf(w, advisor), stance: advisorStance(w, advisor) };
    };
    const base = at(DEFAULT_LEADER);
    const loud = at("showman");
    const suspicious = at("paranoid");
    if (loud.candor >= base.candor) throw new Error("a showman costs the room nothing");
    if (suspicious.candor >= loud.candor) throw new Error("paranoia is not worse than volume");
    if (!loud.stance?.deferring) throw new Error("the room does not defer to a showman");
    if (base.stance?.deferring) throw new Error("the room already defers to an institutionalist");
    return `candor ${Math.round(base.candor)} -> ${Math.round(loud.candor)} -> ${Math.round(suspicious.candor)}`;
  });

  check("temperament-moves-release-and-misreads", () => {
    const w = createWorld("standard", 42, "US", "blue");
    const institution = structuredClone(w);
    const impulsive = structuredClone(w);
    impulsive.leaderArchetype = "impulsive";
    if (playerLeader(impulsive).refusal >= playerLeader(institution).refusal) {
      throw new Error("impulsive does not weaken the check on an order");
    }
    if (playerLeader(impulsive).preDel <= playerLeader(institution).preDel) {
      throw new Error("impulsive does not raise pre-delegation risk");
    }
    const before = misreadRisk(institution, "RU");
    const after = misreadRisk(impulsive, "RU");
    if (after <= before) throw new Error(`misread ${before} -> ${after}`);
    // Both sides unreadable is the worst case, and must be worse than one.
    const both = structuredClone(impulsive);
    both.leaders = { ...both.leaders, RU: "impulsive" };
    if (misreadRisk(both, "RU") <= after) throw new Error("two unreadable leaders are no worse than one");
    return `misread RU ${before.toFixed(2)} -> ${after.toFixed(2)} -> ${misreadRisk(both, "RU").toFixed(2)}`;
  });

  check("adversary-temperament-must-be-earned", () => {
    // It is an intelligence product, not something the player simply knows.
    let w = createWorld("standard", 43, "US", "blue");
    if (leaderKnown(w, "RU")) throw new Error("RU leadership known at turn 1 for free");
    for (let i = 0; i < 8 && !leaderKnown(w, "RU") && !w.ended; i += 1) {
      w = resolveTurn(structuredClone(w), { kind: "intelligence", intensity: 3, target: "RU" });
    }
    if (!leaderKnown(w, "RU")) throw new Error("sustained collection never established it");
    // And it survives a save round-trip.
    const round = JSON.parse(JSON.stringify(w)) as World;
    if (!leaderKnown(round, "RU")) throw new Error("assessment did not survive serialization");
    establishLeader(w, "RU");
    if ((w.leadersKnown ?? []).filter((id) => id === "RU").length !== 1) throw new Error("duplicate assessment");
    return `established after collection, ${(w.leadersKnown ?? []).length} on file`;
  });

  check("volatile-world-is-measurably-more-dangerous", () => {
    // Originally this counted total nuclear uses over a fixed number of turns,
    // which is confounded: a world that escalates faster also ENDS faster, so
    // it accumulates fewer uses while being plainly more dangerous. Measure the
    // mean turn of first nuclear use instead -- unconfounded, and consistent
    // across every sample size from 10 seeds to 120.
    const firstUse = (volatile: boolean) => {
      let reached = 0;
      let turns = 0;
      for (let seed = 1; seed <= 50; seed += 1) {
        let w = createWorld("standard", seed, "US", "blue");
        if (!volatile) {
          w.leaders = Object.fromEntries(
            (Object.keys(w.actors) as ActorId[]).map((id) => [id, DEFAULT_LEADER]),
          );
        }
        for (let i = 0; i < 16 && !w.ended; i += 1) w = resolveTurn(structuredClone(w), hold());
        if (w.nuclearUses.length) {
          reached += 1;
          turns += w.nuclearUses[0].turn;
        }
      }
      return { reached, mean: reached ? turns / reached : Infinity };
    };
    const calm = firstUse(false);
    const wild = firstUse(true);
    if (!calm.reached || !wild.reached) throw new Error("no run reached nuclear use in one arm");
    if (wild.mean >= calm.mean) {
      throw new Error(`temperaments did not pull first use earlier (${wild.mean.toFixed(1)} vs ${calm.mean.toFixed(1)})`);
    }
    return `first nuclear use turn ${calm.mean.toFixed(1)} institutional vs ${wild.mean.toFixed(1)} with temperaments, 50 seeds`;
  });

  check("no-turn-cap", () => {
    // "peace" and "stalemate" were the twenty-four-month timer and nothing else,
    // so the property is that they are unreachable. Deliberately not asserting
    // that some run survives past turn 24 -- that is a balance question, not a
    // question about the cap, and conflating the two is how a check starts
    // failing for reasons it was never about.
    const kinds = new Map<string, number>();
    for (let seed = 1; seed <= 14; seed += 1) {
      let w = createWorld("standard", seed, "US", "blue");
      for (let i = 0; i < 40 && !w.ended; i += 1) w = resolveTurn(structuredClone(w), hold());
      if (w.ended) kinds.set(w.ending?.kind ?? "?", (kinds.get(w.ending?.kind ?? "?") ?? 0) + 1);
    }
    for (const dead of ["peace", "stalemate"]) {
      if (kinds.has(dead)) throw new Error(`the timer still fires: ${kinds.get(dead)} run(s) ended as "${dead}"`);
    }

    // And directly: the exact state the old timer fired on -- a calm watch at
    // three years with no nuclear use -- resolves a turn without ending.
    const w = createWorld("standard", 12, "US", "blue");
    w.year = 2030;
    w.month = 2;
    w.turn = 37;
    w.nuclearUses = [];
    w.defcon = 5;
    w.globalRisk = 30;
    if (w.mandate) w.mandate.resolved = null;
    const next = resolveTurn(structuredClone(w), hold());
    for (const dead of ["peace", "stalemate", "machine"]) {
      if (next.ending?.kind === dead) throw new Error(`three-year watch ended on the timer as "${dead}"`);
    }
    if (!next.ended && !next.log.some((l) => /years on watch/i.test(l.text))) {
      throw new Error("a long watch passed unmarked");
    }
    const summary = [...kinds.entries()].map(([k, n]) => `${k}×${n}`).join(", ");
    return `no timer endings across 14 seeds (${summary}); 3-year watch continues`;
  });

  check("every-scenario-has-a-real-brief", () => {
    // The old lines told a player nothing unless they already knew the domain,
    // and a cluster of them named a category of crisis rather than an event.
    // These assertions are what stops that creeping back in.
    const JARGON = /\b(NOTAM|CASD|SPD|NFU|FOBS|SBIRS|dual-capable|Nasr|Jericho|Hatf|circulariz)/i;
    for (const def of SCENARIOS) {
      const brief = briefFor(def.id);
      if (!brief) throw new Error(`${def.id} has no brief`);
      // Every string leaf on the brief has to be real. This used to assume a
      // brief was flat -- string or string[] -- and threw on anything else,
      // which is the right guarantee expressed against the wrong shape. The
      // dossier fields are arrays of small records, so the walk recurses.
      // Nothing is relaxed: an empty string or an unrendered `undefined`
      // anywhere in the tree still fails, and a non-string leaf still fails.
      const walk = (value: unknown, path: string): void => {
        if (Array.isArray(value)) {
          value.forEach((item, i) => walk(item, `${path}[${i}]`));
          return;
        }
        if (value && typeof value === "object") {
          for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
          return;
        }
        if (typeof value !== "string" || !value.trim()) throw new Error(`${def.id}.${path} is empty`);
        if (value.includes("undefined")) throw new Error(`${def.id}.${path} has an unrendered value`);
      };
      for (const [field, value] of Object.entries(brief)) walk(value, field);
      // Facts have to be facts: at least three, and each carrying something
      // checkable rather than atmosphere.
      if (brief.facts.length < 3) throw new Error(`${def.id} has ${brief.facts.length} facts`);
      const checkable = brief.facts.filter((f) => /\d/.test(f)).length;
      if (checkable < 2) throw new Error(`${def.id} has ${checkable} facts carrying a number or date`);
      // A headline is a sentence about something that happened, not a label.
      if (!/[.!?]$/.test(brief.headline)) throw new Error(`${def.id} headline is not a sentence: "${brief.headline}"`);
      // Crude on purpose. What this is really catching is the label-style
      // fragment the old lines were full of -- "Partners split", "Hazard
      // corridor", "Empty Quiver" -- not short sentences, which are fine:
      // "A warhead has been stolen." is five words and does the whole job.
      if (brief.headline.split(/\s+/).length < 5) throw new Error(`${def.id} headline is a fragment: "${brief.headline}"`);
      if (JARGON.test(brief.headline)) throw new Error(`${def.id} headline leads with unglossed jargon: "${brief.headline}"`);
      // The situation has to actually situate.
      if (brief.situation.split(/[.!?]\s/).length < 2) throw new Error(`${def.id} situation is one sentence`);
      if (!/^You are\b/.test(brief.youAre)) throw new Error(`${def.id} does not say who the player is`);

      // The dossier. A crisis with one actor is a puzzle, not a crisis.
      if (brief.actors.length < 2) throw new Error(`${def.id} has ${brief.actors.length} other actors`);
      for (const a of brief.actors) {
        if (!ACTOR_IDS.includes(a.id)) throw new Error(`${def.id} names unknown actor "${a.id}"`);
        if (a.id === def.playerId) throw new Error(`${def.id} lists the player's own seat as another actor`);
      }
      if (new Set(brief.actors.map((a) => a.id)).size !== brief.actors.length) {
        throw new Error(`${def.id} lists the same actor twice`);
      }
      // Horizons have to actually conflict, which they cannot do if they are
      // all the same horizon. The move that is right in six hours is often the
      // one that costs the decade, and that tension is the whole point.
      if (brief.consequences.length < 2) throw new Error(`${def.id} has ${brief.consequences.length} consequences`);
      if (new Set(brief.consequences.map((c) => c.horizon)).size < 2) {
        throw new Error(`${def.id} consequences all sit on one horizon`);
      }
      // Unknowns are the field this game most needed. `settledBy` has to name a
      // real verb or it is decoration rather than a decision aid.
      if (brief.unknowns.length < 2) throw new Error(`${def.id} has ${brief.unknowns.length} unknowns`);
      for (const u of brief.unknowns) {
        if (!ACTIONS.some((act) => act.kind === u.settledBy)) {
          throw new Error(`${def.id} unknown settled by "${u.settledBy}", which is not an action`);
        }
        if (!/\?$/.test(u.question)) throw new Error(`${def.id} unknown is not a question: "${u.question}"`);
      }
      // At least one unknown must be answerable by collecting rather than by
      // acting. A scenario where every uncertainty resolves only by escalating
      // is not teaching restraint, it is punishing it.
      if (!brief.unknowns.some((u) => u.settledBy === "intelligence" || u.settledBy === "diplomacy")) {
        throw new Error(`${def.id} has no unknown that collection or talking would settle`);
      }
      if (!/[.!?]$/.test(brief.theTrap)) throw new Error(`${def.id} theTrap is not a sentence`);
    }
    const headlines = new Set(SCENARIOS.map((d) => briefFor(d.id)?.headline));
    if (headlines.size !== SCENARIOS.length) throw new Error("two scenarios share a headline");
    return `${SCENARIOS.length} scenarios, all briefed`;
  });

  check("arcs-add-no-rng-draws", () => {
    // The load-bearing claim of the whole feature, stated precisely.
    //
    // Arcs bias the score `scoreCandidate` already computes, and `pickWeighted`
    // makes exactly one `pick()` call whatever the numbers are. So the arc may
    // change WHICH event is drawn -- that is the entire point -- but it must
    // never change HOW MANY draws the deck consumes. If it did, forecast()
    // would stop replaying and every fixed-seed check here would be downstream
    // of the damage.
    //
    // Note what this deliberately does NOT assert: that a run with arcs has the
    // same RNG cursor as a run without. It does not, and it should not. A
    // different event leads down a different turn, which legitimately spends a
    // different number of draws later. Comparing whole runs would be testing
    // that arcs do nothing.
    let sampled = 0;
    let steered = 0;
    for (let seed = 1; seed <= 12; seed += 1) {
      let w = createWorld("standard", seed, "US", "blue");
      for (let i = 0; i < 20 && !w.ended; i += 1) {
        w = resolveTurn(structuredClone(w), hold());
        if (!w.arc) continue;
        const withArc = structuredClone(w);
        const before = withArc.rngState;
        const chosenWith = drawEvent(withArc);
        const costWith = withArc.rngState - before;

        const without = structuredClone(w);
        without.arc = null;
        const chosenWithout = drawEvent(without);
        const costWithout = without.rngState - before;

        sampled += 1;
        if (costWith !== costWithout) {
          throw new Error(`turn ${w.turn} seed ${seed}: arc cost ${costWith} draws, no-arc cost ${costWithout}`);
        }
        if (chosenWith.id !== chosenWithout.id) steered += 1;
      }
    }
    if (sampled < 40) throw new Error(`only ${sampled} turns had an arc running to sample`);
    // And the bias has to actually do something, or the check above is vacuous.
    if (steered === 0) throw new Error("the arc never changed which event was drawn");
    return `${sampled} sampled turns, ${steered} steered, 0 extra draws`;
  });

  check("arcs-run-and-resolve", () => {
    // An arc that never resolves is worse than no arc: it is a promise the game
    // does not keep. The first draft of arcs.ts invented event tags the deck
    // does not carry and measured 0 resolutions in 40 runs, which is exactly
    // the failure this catches.
    let started = 0;
    let resolved = 0;
    const seen = new Set<string>();
    for (let seed = 1; seed <= 24; seed += 1) {
      let w = createWorld("standard", seed, "US", "blue");
      let openId: string | null = null;
      let lastBeat = -1;
      for (let i = 0; i < 30 && !w.ended; i += 1) {
        w = resolveTurn(structuredClone(w), hold());
        const id = w.arc?.id ?? null;
        if (openId && id !== openId) {
          const total = arcById(openId)?.beats.length ?? 0;
          if (lastBeat >= total - 1) resolved += 1;
          openId = null;
          lastBeat = -1;
        }
        if (id && id !== openId) {
          started += 1;
          openId = id;
          lastBeat = w.arc?.beat ?? 0;
          seen.add(id);
        } else if (id && w.arc) {
          lastBeat = Math.max(lastBeat, w.arc.beat);
        }
      }
    }
    if (started < 12) throw new Error(`only ${started} arcs started across 24 runs`);
    if (resolved < 4) throw new Error(`${started} arcs started and only ${resolved} resolved`);
    if (seen.size < 3) throw new Error(`only ${seen.size} distinct arcs ever ran`);
    // Every beat of every arc has to be reachable at all: a beat asking for a
    // tag the deck does not carry can never land, and the arc stalls on it.
    const deckTags = new Set<string>();
    for (const ev of DECK) for (const tag of ev.tags) deckTags.add(tag);
    const followTags = ["silence", "talks", "backlash", "posture", "intel", "covert", "war", "intercept"];
    for (const arc of ARCS) {
      for (const beat of arc.beats) {
        const reachable = beat.wants.some((tag) => deckTags.has(tag) || followTags.includes(tag));
        if (!reachable) throw new Error(`${arc.id} beat "${beat.label}" wants tags no event carries`);
      }
    }
    return `${started} started, ${resolved} resolved, ${seen.size} distinct across 24 runs`;
  });

  check("arc-world-stays-cloneable-and-replays", () => {
    // World holds an id and three numbers, never a function -- structuredClone
    // throws on those and save.ts silently JSON-drops them, which is how the
    // Stage 1 decision cards broke.
    let w = createWorld("standard", 9, "US", "blue");
    for (let i = 0; i < 14 && !w.ended; i += 1) {
      recordTurn(w, hold());
      w = resolveTurn(structuredClone(w), hold());
    }
    structuredClone(w);
    const roundTrip = JSON.parse(JSON.stringify(w)) as World;
    if (JSON.stringify(roundTrip.arc ?? null) !== JSON.stringify(w.arc ?? null)) {
      throw new Error("arc state did not survive serialisation");
    }
    const run = replayFromCode(encodeReplay(w));
    if (!run) throw new Error("replay decode failed");
    if (JSON.stringify(run.world.arc ?? null) !== JSON.stringify(w.arc ?? null)) {
      throw new Error(`replay produced a different arc: ${JSON.stringify(run.world.arc)} vs ${JSON.stringify(w.arc)}`);
    }
    if ((run.world.arcsSeen ?? []).join() !== (w.arcsSeen ?? []).join()) {
      throw new Error("replay saw a different set of arcs");
    }
    return `arc ${w.arc?.id ?? "none"} · seen ${(w.arcsSeen ?? []).join(",") || "none"} · replays`;
  });

  check("daily-watch-is-stable-for-a-date", () => {
    // Everybody playing on a given day has to get the same evening, computed
    // from the date alone with no server and nothing stored. Both hashes are
    // pure, so this is the whole contract.
    const a = dailyWatch(new Date(Date.UTC(2026, 7, 24)));
    const b = dailyWatch(new Date(Date.UTC(2026, 7, 24, 23, 59, 59)));
    if (a.key !== "2026-08-24") throw new Error(`key ${a.key}`);
    if (a.seed !== b.seed || a.scenarioId !== b.scenarioId) throw new Error("same day gave two watches");
    if (a.seed <= 0) throw new Error(`seed ${a.seed} is not usable`);
    const next = dailyWatch(new Date(Date.UTC(2026, 7, 25)));
    if (next.seed === a.seed) throw new Error("consecutive days share a seed");
    // And the rotation must actually rotate rather than clump on a few
    // scenarios, which is what a single hash for both seed and scenario does.
    const seen = new Set<string>();
    for (let i = 0; i < 120; i += 1) {
      seen.add(dailyWatch(new Date(Date.UTC(2026, 0, 1 + i))).scenarioId);
    }
    if (seen.size < 20) throw new Error(`only ${seen.size} distinct scenarios across 120 days`);
    if (!SCENARIO_IDS.includes(a.scenarioId)) throw new Error(`${a.scenarioId} is not a scenario`);
    return `${seen.size} distinct watches across 120 days`;
  });

  check("daily-watch-adds-no-draws-and-replays", () => {
    // The daily seed is read once at start, outside resolveTurn. A run built
    // from it has to behave exactly like any other run on that seed -- if it
    // did not, the shared date would not produce a shared game.
    const w = dailyWatch(new Date(Date.UTC(2026, 7, 24)));
    const def = SCENARIOS.find((s) => s.id === w.scenarioId);
    if (!def) throw new Error("daily scenario is not in the list");
    const one = applyScenario(createWorld(def.difficulty, w.seed, def.playerId, def.intent), w.scenarioId);
    const two = applyScenario(createWorld(def.difficulty, w.seed, def.playerId, def.intent), w.scenarioId);
    if (one.rngState !== two.rngState) throw new Error("same seed diverged before turn one");
    const a = runTurns(structuredClone(one), 6);
    const b = runTurns(structuredClone(two), 6);
    if (a.rngState !== b.rngState) throw new Error("same seed diverged across six turns");
    if (a.turn !== b.turn || a.ended !== b.ended) throw new Error("same seed produced different runs");
    // DEFCON history is bookkeeping and must not have cost a draw.
    if ((a.defconHistory ?? []).length < 1) throw new Error("defcon history never recorded");
    return `seed ${w.seed} · ${w.scenarioId} · reproduces across ${a.turn} turns`;
  });

  check("daily-streak-counts-days-not-plays", () => {
    // Pure, so the rules are provable here. Replaying the same day must not
    // advance the streak, the next day extends it, and a gap resets to one --
    // the day you came back still counts as a day.
    let rec = foldDaily(undefined, "2026-08-24", 500);
    if (rec.streak !== 1 || rec.played !== 1) throw new Error(`first daily gave streak ${rec.streak}`);
    rec = foldDaily(rec, "2026-08-24", 700);
    if (rec.streak !== 1) throw new Error("replaying a day advanced the streak");
    if (rec.best !== 700) throw new Error(`best did not improve: ${rec.best}`);
    if (rec.played !== 1) throw new Error("replaying a day counted as a second play");
    rec = foldDaily(rec, "2026-08-25", 400);
    if (rec.streak !== 2) throw new Error(`next day gave streak ${rec.streak}`);
    if (rec.best !== 700) throw new Error("a worse score lowered the best");
    rec = foldDaily(rec, "2026-08-28", 100);
    if (rec.streak !== 1) throw new Error(`a gap gave streak ${rec.streak}`);
    if (rec.bestStreak !== 2) throw new Error(`best streak lost: ${rec.bestStreak}`);
    // Month and year boundaries are the classic place this breaks.
    let edge = foldDaily(undefined, "2026-08-31", 1);
    edge = foldDaily(edge, "2026-09-01", 1);
    if (edge.streak !== 2) throw new Error("streak broke across a month boundary");
    edge = foldDaily(foldDaily(undefined, "2026-12-31", 1), "2027-01-01", 1);
    if (edge.streak !== 2) throw new Error("streak broke across a year boundary");
    return "same day holds, next day extends, gap resets to one";
  });

  check("daily-share-block-spoils-nothing", () => {
    // The block is the thing a player pastes in public. It must never carry an
    // ending: someone who has not played today should read it and still want to.
    const w = dailyWatch(new Date(Date.UTC(2026, 7, 24)));
    const def = SCENARIOS.find((s) => s.id === w.scenarioId);
    if (!def) throw new Error("daily scenario is not in the list");
    let world = applyScenario(createWorld(def.difficulty, w.seed, def.playerId, def.intent), w.scenarioId);
    world.dailyKey = w.key;
    world = runTurns(world, 8);
    const text = shareText(world, 3, defconSpark(world.defconHistory ?? []));
    if (!text.includes(w.key)) throw new Error("share block does not name the day");
    for (const brief of Object.values(SCENARIO_BRIEFS)) {
      for (const secret of [brief.whatHappened, brief.afterward, brief.precedent]) {
        if (secret && text.includes(secret)) throw new Error("share block leaks an ending");
      }
    }
    if (/\n\n/.test(text)) throw new Error("share block has a blank line");
    if (text.split("\n").length > 5) throw new Error("share block is too tall to paste");
    // The spark has to read the right way round: DEFCON 1 is the worst state
    // and must be the tallest bar, or the picture means the opposite of itself.
    const calm = defconSpark([5, 5, 5]);
    const dire = defconSpark([1, 1, 1]);
    if (calm === dire) throw new Error("spark does not distinguish DEFCON 5 from 1");
    if (dire.charCodeAt(0) <= calm.charCodeAt(0)) throw new Error("spark is inverted: DEFCON 1 is not the tallest");
    if (defconSpark(new Array(60).fill(3)).length > 12) throw new Error("spark does not fit one line");
    return `${text.split("\n").length} lines, spark ${dire}`;
  });

  check("every-event-glosses-what-it-names", () => {
    // The deck was written before the briefs were and still carried the exact
    // density the briefs were rewritten to remove. A player reads about fifty
    // words on an ordinary turn and roughly a fifth of them meant nothing
    // unless you already worked in the field.
    let glossed = 0;
    for (const ev of DECK) {
      if (!ev.background) throw new Error(`${ev.id} has no background`);
      if (ev.background.length < 120) throw new Error(`${ev.id} background is a fragment`);
      if (ev.background.length > 320) throw new Error(`${ev.id} background is a paragraph, not a note`);
      // The body already speaks to the player; this is the desk note under it.
      if (/\byou\b/i.test(ev.background)) throw new Error(`${ev.id} background addresses the player`);
      if (ev.background === ev.body) throw new Error(`${ev.id} background repeats the body`);
      glossed += 1;
    }
    // Every background must be distinct -- the same sentence on two events is
    // filler, and filler is what this whole exercise is against.
    const texts = new Set(DECK.map((e) => e.background));
    if (texts.size !== DECK.length) throw new Error(`${DECK.length - texts.size} events share a background`);
    return `${glossed} deck events glossed`;
  });

  check("staff-advice-is-attributed-to-real-people", () => {
    // The panel a player sees every turn used to sign its lines "Grid / J4"
    // while eighty-five named advisors sat behind a button labelled "More".
    // This is the join, and it has to hold for every seat: a seat whose roster
    // lacks the branch a desk asks for must still land on somebody.
    let checked = 0;
    for (const seat of PLAYABLE_IDS) {
      const w = createWorld("standard", 40 + seat.charCodeAt(0), seat, "blue");
      const advice = staffAdvice(w);
      if (!advice.length) throw new Error(`${seat} produced no advice`);
      const ids = new Set<string>();
      for (const a of advice) {
        if (!a.advisorId) throw new Error(`${seat} desk "${a.desk}" is still anonymous`);
        const advisor = advisorById(a.advisorId);
        if (!advisor) throw new Error(`${seat} names unknown advisor "${a.advisorId}"`);
        if (advisor.seat !== seat) throw new Error(`${seat} borrowed ${advisor.id} from ${advisor.seat}`);
        // Three lines from the same person is a monologue, not a room.
        if (ids.has(a.advisorId)) throw new Error(`${seat} used ${a.advisorId} twice in one turn`);
        ids.add(a.advisorId);
        checked += 1;
      }
    }
    return `${checked} attributed lines across ${PLAYABLE_IDS.length} seats`;
  });

  check("staff-advice-is-deterministic-and-rng-free", () => {
    // forecast() deep-clones the world and replays this twice on every
    // ActionPanel render, so a draw here would diverge the stream and the
    // forecast would stop matching the turn it is predicting.
    for (const seed of [7, 21, 63]) {
      let w = createWorld("standard", seed, "US", "blue");
      for (let i = 0; i < 8 && !w.ended; i += 1) {
        w = resolveTurn(structuredClone(w), hold());
        const before = w.rngState;
        const a = staffAdvice(w);
        const b = staffAdvice(w);
        if (w.rngState !== before) throw new Error(`staffAdvice drew from the rng on turn ${w.turn}`);
        if (JSON.stringify(a) !== JSON.stringify(b)) {
          throw new Error(`staffAdvice gave two answers for the same world on turn ${w.turn}`);
        }
      }
    }
    return "no draws, identical across repeated calls, 3 seeds x 8 turns";
  });

  check("the-room-argues-about-this-crisis", () => {
    // Nothing in advisors/ used to reference world.event or the scenario, so
    // roughly seventy templates served every seat, every advisor, every
    // scenario and every turn -- Petrov-1983 and a 2027 Taiwan contingency
    // produced the same sentences and the room was demonstrably not listening
    // to the game it was in.
    //
    // The scenario dossier fixed that at the source. Each advisor takes the
    // uncertainty their own branch would own, names it, and says what would
    // settle it, so the room argues about the same specific thing the player is
    // deciding under.
    let rooms = 0;
    let aware = 0;
    let worstSpread = 1;
    let worstId = "";
    for (const def of SCENARIOS) {
      const w = applyScenario(createWorld("standard", 9, def.playerId, def.intent), def.id);
      // A live track is its own situation; those rooms speak to the board.
      if (w.closeCall) continue;
      rooms += 1;
      const room = rosterFor(asPlayable(w.playerId));
      const lines = room.map((a) => situationLine(w, a).text);
      if (lines.some((l) => /I own here|my brief in this|answer one thing|not my desk|outside my brief/.test(l))) {
        aware += 1;
      }
      // Several people caring about the same question is realistic. A room
      // where most of them say the same thing is the monologue problem wearing
      // different clothes, which is exactly what an earlier draft did.
      const spread = new Set(lines).size / lines.length;
      if (spread < worstSpread) {
        worstSpread = spread;
        worstId = def.id;
      }
    }
    if (aware !== rooms) throw new Error(`${rooms - aware} of ${rooms} rooms ignore their own scenario`);
    if (worstSpread < 0.5) {
      throw new Error(`${worstId}: only ${Math.round(worstSpread * 100)}% of the room said something distinct`);
    }
    return `${rooms} rooms all cite their dossier, worst spread ${Math.round(worstSpread * 100)}%`;
  });

  check("nuclear-seats-seat-a-whole-body", () => {
    // The rosters were real institutions with principals missing. The US had no
    // National Security Advisor -- the person who actually runs the NSC process
    // -- Russia no Secretary of its Security Council, and France, India, Israel,
    // North Korea and Iran had no diplomatic voice at all, which meant the
    // "Partners desk" line every turn fell back to whoever was nearest.
    const NUCLEAR = ["US", "RU", "CN", "FR", "UK", "IN", "PK", "IL", "KP", "IR"] as const;
    for (const seat of NUCLEAR) {
      const roster = rosterFor(seat);
      const branches = new Set(roster.map((a) => a.branch));
      // Somebody has to speak for the channel, or talking is nobody's brief.
      if (!branches.has("diplomatic")) throw new Error(`${seat} has no diplomatic voice`);
      // Somebody has to speak for the state rather than for a service.
      if (!branches.has("civilian")) throw new Error(`${seat} has no civilian principal`);
      if (!branches.has("intel")) throw new Error(`${seat} has nobody who collects`);
      if (!branches.has("watch")) throw new Error(`${seat} has nobody on the board`);
      // A body needs people at every rung, or climbing the ladder adds nobody.
      for (const rung of [1, 2, 3]) {
        if (!roster.some((a) => a.rung === rung)) throw new Error(`${seat} has nobody at rung ${rung}`);
      }
      if (roster.length < 7) throw new Error(`${seat} seats only ${roster.length}`);
    }
    const total = PLAYABLE_IDS.reduce((n, s) => n + rosterFor(s).length, 0);
    return `${NUCLEAR.length} nuclear bodies complete · ${total} advisors across ${PLAYABLE_IDS.length} seats`;
  });

  check("every-seat-has-a-named-decision-body", () => {
    // Naming the body is most of the education: a player should learn that
    // Pakistan decides this in a National Command Authority whose secretariat
    // is the Strategic Plans Division, and that Iran's council seats the
    // Supreme Leader's representatives above the President who chairs it.
    const names = new Set<string>();
    for (const seat of PLAYABLE_IDS) {
      const body = bodyFor(seat);
      if (!body.name.trim() || !body.short.trim() || !body.note.trim()) {
        throw new Error(`${seat} has an incomplete decision body`);
      }
      if (!/[.!?]$/.test(body.note)) throw new Error(`${seat} body note is not a sentence`);
      names.add(body.name);
    }
    // Two names are genuinely shared and both are correct: the US and the UK
    // each call theirs a National Security Council, and China and North Korea
    // each call theirs a Central Military Commission. This check first asserted
    // at most one collision, which was an assumption about the world rather
    // than about the code, and the world won.
    //
    // What actually has to be distinct is the note, because that is the
    // seat-specific part -- how *this* room works. Two seats sharing a note
    // would mean one of them was filled in by copying the other.
    const SHARED_BY_DESIGN = new Set(["National Security Council", "Central Military Commission"]);
    for (const [name, seats] of Object.entries(
      PLAYABLE_IDS.reduce<Record<string, string[]>>((acc, seat) => {
        const n = bodyFor(seat).name;
        acc[n] = [...(acc[n] ?? []), seat];
        return acc;
      }, {}),
    )) {
      if (seats.length > 1 && !SHARED_BY_DESIGN.has(name)) {
        throw new Error(`${seats.join(" and ")} share the body name "${name}"`);
      }
    }
    const notes = new Set(PLAYABLE_IDS.map((s) => bodyFor(s).note));
    if (notes.size !== PLAYABLE_IDS.length) {
      throw new Error(`${PLAYABLE_IDS.length - notes.size} seats share a body note`);
    }
    return `${names.size} named bodies across ${PLAYABLE_IDS.length} seats, ${notes.size} distinct notes`;
  });

  check("first-watch-tutorial-runs-on-a-scenario", () => {
    // The gate used to require !world.scenarioId, so picking any scenario turned
    // the tutorial off entirely -- and scenarios are the front door. This is the
    // regression guard for the path a new player actually takes.
    const scenario = applyScenario(createWorld("standard", 5, "US", "blue"), "alaska-drones-2027");
    if (scenario.turn !== 1) throw new Error(`scenario world opens on turn ${scenario.turn}`);
    if (!scenario.scenarioId) throw new Error("fixture is not a scenario world");
    if (!shouldShowTutorial(scenario, false, 0)) throw new Error("tutorial suppressed on a scenario watch");
    // And a sandbox watch, which is where it used to be the only thing showing.
    if (!shouldShowTutorial(createWorld("standard", 5, "US", "blue"), false, 0)) {
      throw new Error("tutorial suppressed on a sandbox watch");
    }
    // It is a *first* watch feature and it stays dismissible.
    if (shouldShowTutorial({ turn: 2 }, false, 0)) throw new Error("tutorial showed after turn one");
    if (shouldShowTutorial(scenario, true, 0)) throw new Error("dismissal did not stick");
    if (shouldShowTutorial(scenario, false, -1)) throw new Error("negative step still showed");
    if (shouldShowTutorial(scenario, false, TUTORIAL_STEPS.length)) throw new Error("ran past the last step");
    // The steps have to cover the game as it now is, not as it was three
    // features ago. Naming them here means deleting one fails loudly.
    if (TUTORIAL_STEPS.length < 6) throw new Error(`${TUTORIAL_STEPS.length} steps`);
    const copy = TUTORIAL_STEPS.map((s) => `${s.title} ${s.body}`.toLowerCase()).join(" ");
    for (const topic of ["forecast", "hold", "advisors", "countdown", "mandate"]) {
      if (!copy.includes(topic)) throw new Error(`tutorial never mentions ${topic}`);
    }
    for (const s of TUTORIAL_STEPS) {
      if (!s.title.trim() || !s.body.trim()) throw new Error("a tutorial step is empty");
    }
    return `${TUTORIAL_STEPS.length} steps, shown on scenario and sandbox watches`;
  });

  check("archive-opens-only-what-you-finished", () => {
    // A file opens when a run ends, not when one starts. buildArchive is pure
    // and takes the stats as an argument precisely so the rule can be proved
    // here, with no localStorage to read.
    const fresh = buildArchive({ scenarioBest: {} });
    if (fresh.opened !== 0) throw new Error(`${fresh.opened} files open on a fresh career`);
    if (fresh.total !== SCENARIOS.length) {
      throw new Error(`${fresh.total} files for ${SCENARIOS.length} scenarios`);
    }
    for (const e of fresh.entries) {
      if (e.best !== null) throw new Error(`${e.id} carries a best score with no games played`);
    }
    const one = buildArchive({ scenarioBest: { "petrov-1983": 812 } });
    const petrov = one.entries.find((e) => e.id === "petrov-1983");
    if (!petrov?.opened) throw new Error("finishing petrov-1983 did not open its file");
    if (petrov.best !== 812) throw new Error(`best recorded as ${petrov.best}`);
    if (one.opened !== 1) throw new Error(`${one.opened} files open after one finished run`);
    // Zero is a real score, not a missing one. A truthiness test here would
    // seal the file of anyone who finished a run badly enough.
    const zero = buildArchive({ scenarioBest: { "cuba-1962": 0 } });
    if (!zero.entries.find((e) => e.id === "cuba-1962")?.opened) {
      throw new Error("a score of zero failed to open the file");
    }
    return `${fresh.total} files, sealed until finished`;
  });

  check("archive-sealed-files-reveal-nothing", () => {
    // The locked line is the only string a player sees before playing, so it
    // has to stay a template. Interpolating the headline or the situation into
    // it would hand over the scenario the archive exists to reward.
    const shape = /^(Historical|2027 theater|Threshold) · [a-z-]+ · challenge [1-5] of 5\. Finish this watch to open the file\.$/;
    for (const e of buildArchive({ scenarioBest: {} }).entries) {
      const line = lockedLine(e);
      if (!shape.test(line)) throw new Error(`${e.id} sealed line is not a template: "${line}"`);
    }
    return `${SCENARIOS.length} sealed files say only era, category and challenge`;
  });

  check("after-action-reveals-only-what-it-should", () => {
    // The briefing screen must never carry the ending. A player told "Petrov
    // reported it as a malfunction" before they sit down has not been given a
    // decision, they have been given an answer -- so the ending fields live in
    // the brief from the start and only AfterAction renders them.
    //
    // The two shapes are exclusive: a historical scenario has an outcome and
    // what it changed; an invented one has no outcome to reveal and instead
    // names the real incident it borrows from.
    let historical = 0;
    for (const def of SCENARIOS) {
      const brief = briefFor(def.id);
      if (!brief) throw new Error(`${def.id} has no brief`);
      if (def.era === "historical") {
        if (!brief.whatHappened) throw new Error(`${def.id} is historical with no whatHappened`);
        if (!brief.afterward) throw new Error(`${def.id} is historical with no afterward`);
        historical += 1;
      } else {
        if (brief.whatHappened) throw new Error(`${def.id} is not historical but claims an outcome`);
        if (!brief.precedent) throw new Error(`${def.id} is invented with no precedent`);
      }
    }
    return `${historical} historical with outcomes, ${SCENARIOS.length - historical} invented with precedents`;
  });

  check("ending-keeps-the-scenario-it-came-from", () => {
    // AfterAction looks the brief up by world.scenarioId. If a turn, a save or a
    // replay drops it, the panel silently renders nothing at the exact moment
    // the game finally has something to say.
    let w = applyScenario(createWorld("standard", 31, "US", "blue"), "petrov-1983");
    if (w.scenarioId !== "petrov-1983") throw new Error("applyScenario did not record the id");
    w = runTurns(w, 6);
    if (w.scenarioId !== "petrov-1983") throw new Error(`lost across turns: ${w.scenarioId}`);
    const run = replayFromCode(encodeReplay(w));
    if (!run) throw new Error("replay decode failed");
    if (run.world.scenarioId !== "petrov-1983") throw new Error(`replay lost it: ${run.world.scenarioId}`);
    return `petrov-1983 survives ${w.turn} turns and a replay`;
  });

  check("briefs-cover-exactly-the-scenario-list", () => {
    // A brief for a scenario that no longer exists, or a scenario with no brief,
    // both mean the two lists have drifted apart.
    const ids = new Set(SCENARIOS.map((d) => d.id));
    for (const id of Object.keys(SCENARIO_BRIEFS)) {
      if (!ids.has(id as (typeof SCENARIOS)[number]["id"])) throw new Error(`brief for unknown scenario "${id}"`);
    }
    if (Object.keys(SCENARIO_BRIEFS).length !== SCENARIOS.length) {
      throw new Error(`${Object.keys(SCENARIO_BRIEFS).length} briefs vs ${SCENARIOS.length} scenarios`);
    }
    return `${SCENARIOS.length} in both lists`;
  });

  check("every-scenario-sets-up-a-real-situation", () => {
    // A scenario in the list with no block in applyScenario is a menu entry
    // that starts an ordinary sandbox game -- worse than not existing.
    //
    // This used to name four ids explicitly, which meant it only ever policed
    // the four that happened to be new when it was written. Every scenario in
    // the list passes it today, so there is no reason to let the next one in
    // unchecked.
    for (const def of SCENARIOS) {
      const plain = createWorld("standard", 5, def.playerId, def.intent);
      const w = applyScenario(createWorld("standard", 5, def.playerId, def.intent), def.id);
      if (w.scenarioId !== def.id) throw new Error(`${def.id} did not record its scenario id`);
      const moved =
        w.defcon !== plain.defcon ||
        Math.round(w.globalRisk) !== Math.round(plain.globalRisk) ||
        w.event.id !== plain.event.id;
      if (!moved) throw new Error(`${def.id} starts an ordinary sandbox game`);
      if (!w.event.title.trim() || !w.event.body.trim()) throw new Error(`${def.id} has no opening event text`);
      if (w.playerId !== def.playerId) throw new Error(`${def.id} seats the player as ${w.playerId}, not ${def.playerId}`);
    }
    return `${SCENARIOS.length} scenarios set up real situations`;
  });

  return { ok: checks.every((c) => c.ok), checks };
}

import { createWorld } from "./world";
import { resolveTurn, forecast } from "./sim";
import { applyScenario, SCENARIOS } from "./scenarios";
import { makeActors } from "./actors";
import { seatObjectives } from "./objectives";
import { encodeReplay, decodeReplay, recordTurn } from "./replay";
import { PLAYABLE_IDS } from "./types";
import type { ActorId, PlayerAction, World } from "./types";
import { applyNuclearUse } from "./nuclear";
import { replayFromCode } from "./replayRun";
import { proposePact } from "./pacts";
import { proposeCeasefire } from "./ceasefire";
import { applyC2Stance } from "./c2";
import { majorityKind, staffAdvice } from "./staff";
import { buildTrack, resolveCloseCallHold } from "./warning";

export interface IntegrityResult {
  ok: boolean;
  checks: { name: string; ok: boolean; detail: string }[];
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

  return { ok: checks.every((c) => c.ok), checks };
}

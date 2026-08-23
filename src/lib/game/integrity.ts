import { createWorld } from "./world";
import { resolveTurn, forecast } from "./sim";
import { applyScenario, SCENARIOS } from "./scenarios";
import { seatObjectives } from "./objectives";
import { encodeReplay, decodeReplay, recordTurn } from "./replay";
import { PLAYABLE_IDS } from "./types";
import type { ActorId, PlayerAction, World } from "./types";
import { applyNuclearUse } from "./nuclear";

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

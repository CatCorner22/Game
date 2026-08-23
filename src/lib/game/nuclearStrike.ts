import type {
  ActorId,
  DeliverySystem,
  NuclearRung,
  PackageMode,
  StrikeLeg,
  StrikeOutcome,
  StrikeReport,
  World,
} from "./types";
import { chance, clamp, nextInt, nextUnit, round } from "./rng";

const STRATEGIC: Set<DeliverySystem["kind"]> = new Set(["icbm", "slbm", "hgv", "bomber"]);
const TACTICAL: Set<DeliverySystem["kind"]> = new Set([
  "srbm",
  "dca",
  "alcm",
  "glcm",
  "slcm",
  "gravity",
  "irbm",
  "mrbm",
  "covert",
]);

function filled(s: DeliverySystem): DeliverySystem {
  return {
    ...s,
    rvsPerBus: s.rvsPerBus ?? 1,
    decoys: s.decoys ?? 0,
    penetrationAids: s.penetrationAids ?? 0,
  };
}

export function inferPackageMode(system: DeliverySystem): PackageMode {
  const rvs = system.rvsPerBus ?? 1;
  const decoys = system.decoys ?? 0;
  if (decoys > 0 && rvs > 1) return "mirv-decoy";
  if (rvs > 1) return "mirv";
  if (decoys > 0) return "mirv-decoy";
  return "single";
}

export function effectiveRvs(world: World, system: DeliverySystem, mode: PackageMode): number {
  if (mode === "single") return 1;
  if (system.id === "us-mm3" && world.newStartDead) return 3;
  if (system.id === "us-w762") return 1;
  const per = system.rvsPerBus ?? 1;
  if (per > 1) return per;
  if (world.newStartDead && (system.kind === "icbm" || system.kind === "slbm") && system.warheads > system.launchers) {
    return clamp(Math.round(system.warheads / Math.max(1, system.launchers)), 2, 8);
  }
  return Math.max(1, per);
}

export function effectiveDecoys(system: DeliverySystem, mode: PackageMode, rvs: number): number {
  if (mode !== "mirv-decoy") return 0;
  const base = system.decoys ?? 0;
  if (base > 0) return base;
  return rvs >= 3 ? rvs : rvs >= 2 ? 2 : 3;
}

function usable(s: DeliverySystem): boolean {
  return s.warheads > 0 || (s.launchers > 0 && s.reliability > 0.25);
}

function systemScore(s: DeliverySystem, mode: PackageMode): number {
  const rvs = s.rvsPerBus ?? 1;
  const decoys = s.decoys ?? 0;
  let n = s.reliability * 10 + Math.log10(Math.max(1, s.warheads) + 1);
  if (mode !== "single" && rvs > 1) n += 4;
  if (mode === "mirv-decoy" && decoys > 0) n += 3;
  if (s.kind === "hgv") n += 2;
  return n;
}

export function pickStrikeSystem(
  world: World,
  actor: ActorId,
  rung: NuclearRung,
  mode: PackageMode,
): DeliverySystem | null {
  const raw = world.actors[actor].systems.map(filled).filter(usable);
  if (!raw.length) return null;
  let pool = raw;
  if (rung === "demo" || rung === "tactical") {
    const tac = raw.filter((s) => TACTICAL.has(s.kind) || s.kind === "novel");
    if (tac.length) pool = tac;
  } else {
    const strat = raw.filter((s) => STRATEGIC.has(s.kind) && s.warheads > 0);
    if (strat.length) pool = strat;
  }
  if (rung === "countervalue") {
    const heavy = pool.filter((s) => s.yieldKt[1] >= 800 || s.id.includes("tsar") || s.id.includes("poseidon"));
    if (heavy.length) pool = heavy;
  }
  if (mode === "mirv" || mode === "mirv-decoy") {
    const mirv = pool.filter(
      (s) => (s.rvsPerBus ?? 1) > 1 || (s.decoys ?? 0) > 0 || s.kind === "icbm" || s.kind === "slbm" || s.kind === "mrbm",
    );
    if (mirv.length) pool = mirv;
  }
  const ranked = [...pool].sort((a, b) => systemScore(a, mode) - systemScore(b, mode));
  const top = ranked.slice(-Math.min(3, ranked.length));
  return top[Math.min(top.length - 1, Math.floor(nextUnit(world) * top.length))] ?? ranked[ranked.length - 1]!;
}

function wantLaunchers(world: World, rung: NuclearRung): number {
  if (rung === "demo") return 1;
  if (rung === "tactical") return 1 + nextInt(world, 0, 2);
  if (rung === "counterforce") return 4 + nextInt(world, 0, 6);
  return 8 + nextInt(world, 0, 10);
}

function interceptorBudget(world: World, defender: ActorId): number {
  const md = world.actors[defender].missileDefense;
  // GMD / A-135 / Arrow are thin against a real salvo. Decoys exist for this reason.
  return Math.max(0, Math.round(md / 9));
}

function interceptHitP(world: World, defender: ActorId, system: DeliverySystem): number {
  const md = world.actors[defender].missileDefense;
  const aids = system.penetrationAids ?? 0;
  const hgv = system.kind === "hgv" ? 0.22 : 0;
  return clamp(0.2 + md / 200 - aids * 0.38 - hgv, 0.04, 0.7);
}

function outcomeOf(arrived: number, expected: number, interceptedRv: number, released: number): StrikeOutcome {
  if (arrived <= 0 && released <= 0) return "failed";
  if (arrived <= 0 && interceptedRv > 0) return "intercepted";
  if (arrived <= 0) return "failed";
  if (arrived < expected * 0.55) return "partial";
  return "full";
}

function summarize(leg: StrikeLeg, outcome: StrikeOutcome, defenderMd: number): string {
  const bits: string[] = [];
  bits.push(`${leg.launched}× ${leg.systemName} left the rail`);
  if (leg.boostFailed) bits.push(`${leg.boostFailed} failed in boost`);
  if (leg.busFailed) bits.push(`${leg.busFailed} bus${leg.busFailed === 1 ? "" : "es"} failed to deploy`);
  if (leg.decoysReleased) bits.push(`${leg.decoysReleased} decoys in the cluster`);
  if (leg.interceptedDecoy || leg.interceptedRv) {
    bits.push(
      `defense (MD ${defenderMd}) spent interceptors on ${leg.interceptedDecoy} decoy${leg.interceptedDecoy === 1 ? "" : "s"} and ${leg.interceptedRv} RV${leg.interceptedRv === 1 ? "" : "s"}`,
    );
  }
  if (leg.reentryFailed) bits.push(`${leg.reentryFailed} RV${leg.reentryFailed === 1 ? "" : "s"} failed reentry`);
  bits.push(`${leg.arrived} warhead${leg.arrived === 1 ? "" : "s"} arrived`);
  if (outcome === "failed") bits.push("the pulse did not land");
  if (outcome === "intercepted") bits.push("the cluster was claimed by defense");
  if (outcome === "partial") bits.push("a leaky pulse — not the package on the page");
  return `${bits.join(". ")}.`;
}

export function resolveStrikePackage(
  world: World,
  actor: ActorId,
  target: ActorId,
  rung: NuclearRung,
  packageMode?: PackageMode,
): StrikeReport {
  const chosen = pickStrikeSystem(world, actor, rung, packageMode ?? "mirv");
  if (!chosen) {
    return {
      turn: world.turn,
      actor,
      target,
      rung,
      outcome: "failed",
      packageMode: packageMode ?? "single",
      legs: [],
      launched: 0,
      failed: 0,
      intercepted: 0,
      decoys: 0,
      arrived: 0,
      expected: 0,
      yieldKt: 0,
      deaths: 0,
      summary: `${world.actors[actor].shortName} had no usable delivery system.`,
    };
  }

  const mode = packageMode ?? inferPackageMode(chosen);
  const rvsEach = effectiveRvs(world, chosen, mode);
  const decoyEach = effectiveDecoys(chosen, mode, rvsEach);
  const maxByWh = Math.max(1, Math.floor(Math.max(1, chosen.warheads) / rvsEach));
  const launched = clamp(wantLaunchers(world, rung), 1, Math.min(Math.max(1, chosen.launchers || maxByWh), maxByWh, 20));

  const leg: StrikeLeg = {
    systemId: chosen.id,
    systemName: chosen.name,
    launched,
    boostFailed: 0,
    busFailed: 0,
    rvsReleased: 0,
    decoysReleased: 0,
    interceptedRv: 0,
    interceptedDecoy: 0,
    reentryFailed: 0,
    arrived: 0,
  };

  const kpPenalty = actor === "KP" ? 0.12 : 0;
  const boostFailP = clamp(1 - chosen.reliability + kpPenalty, 0.04, 0.85);
  const busFailP = (rvsEach > 1 || decoyEach > 0 ? 0.06 : 0.02) + (1 - chosen.reliability) * 0.08;

  let busesOk = 0;
  for (let i = 0; i < launched; i++) {
    if (chance(world, boostFailP)) {
      leg.boostFailed += 1;
      continue;
    }
    if ((rvsEach > 1 || decoyEach > 0) && chance(world, busFailP)) {
      leg.busFailed += 1;
      continue;
    }
    busesOk += 1;
    leg.rvsReleased += rvsEach;
    leg.decoysReleased += decoyEach;
  }

  const tracks: ("rv" | "decoy")[] = [
    ...Array.from({ length: leg.rvsReleased }, () => "rv" as const),
    ...Array.from({ length: leg.decoysReleased }, () => "decoy" as const),
  ];
  const shots = interceptorBudget(world, target);
  const pHit = interceptHitP(world, target, chosen);
  for (let i = 0; i < shots && tracks.length; i++) {
    const idx = nextInt(world, 0, tracks.length - 1);
    if (!chance(world, pHit)) continue;
    const kind = tracks.splice(idx, 1)[0];
    if (kind === "rv") leg.interceptedRv += 1;
    else leg.interceptedDecoy += 1;
  }

  const rvsLeft = tracks.filter((t) => t === "rv").length;
  const reentryP = clamp((actor === "KP" ? 0.2 : 0.05) + (1 - chosen.reliability) * 0.25, 0.03, 0.45);
  for (let i = 0; i < rvsLeft; i++) {
    if (chance(world, reentryP)) leg.reentryFailed += 1;
    else leg.arrived += 1;
  }

  const expected = launched * rvsEach;
  const failed = leg.boostFailed + leg.busFailed;
  const outcome = outcomeOf(leg.arrived, expected, leg.interceptedRv, leg.rvsReleased);
  const summary = summarize(leg, outcome, world.actors[target].missileDefense);

  return {
    turn: world.turn,
    actor,
    target,
    rung,
    outcome,
    packageMode: mode,
    legs: [leg],
    launched,
    failed,
    intercepted: leg.interceptedRv,
    decoys: leg.decoysReleased,
    arrived: leg.arrived,
    expected,
    yieldKt: 0,
    deaths: 0,
    summary,
  };
}

export function arrivalFraction(report: StrikeReport): number {
  if (report.expected <= 0) return 0;
  if (report.arrived <= 0) return 0;
  return clamp(report.arrived / report.expected, 0.06, 1.2);
}

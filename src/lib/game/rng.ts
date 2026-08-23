import type { World } from "./types";

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function nextUnit(world: World): number {
  if (world.rngMode === "fixed") return world.rngFixed;
  let t = (world.rngState + 0x6d2b79f5) >>> 0;
  world.rngState = t;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}

export function nextInt(world: World, min: number, max: number): number {
  return Math.floor(nextUnit(world) * (max - min + 1)) + min;
}

export function chance(world: World, p: number): boolean {
  return nextUnit(world) < p;
}

export function pick<T>(world: World, items: T[]): T {
  return items[Math.min(items.length - 1, Math.floor(nextUnit(world) * items.length))]!;
}

export function jitter(world: World, value: number, spread: number): number {
  return value + (nextUnit(world) * 2 - 1) * spread;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function clamp01(n: number): number {
  return clamp(n, 0, 1);
}

export function round(n: number): number {
  return Math.round(n);
}

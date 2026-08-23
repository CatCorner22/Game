let ctx: AudioContext | null = null;
let drone: OscillatorNode | null = null;
let gain: GainNode | null = null;
let muted = false;
let lastDefcon = 5;
let lastRisk = 34;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  void ctx.resume();
  if (!drone && ctx && !muted) {
    const g = ctx.createGain();
    g.gain.value = 0.012;
    g.connect(ctx.destination);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 82;
    o.connect(g);
    o.start();
    drone = o;
    gain = g;
  }
}

export function tone(freq: number, dur: number, type: OscillatorType = "sine") {
  if (!ctx || muted) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = 0.04;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.stop(ctx.currentTime + dur + 0.02);
}

export function defconTone(defcon: number) {
  const freqs: Record<number, number> = { 1: 180, 2: 160, 3: 140, 4: 120, 5: 100 };
  tone(freqs[defcon] ?? 100, 0.12, defcon <= 2 ? "square" : "sine");
}

export function radarSweep() {
  if (!ctx || muted) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(400, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);
  g.gain.value = 0.025;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
  o.stop(ctx.currentTime + 0.5);
}

export function heartbeat(pace: "slow" | "fast") {
  const gap = pace === "fast" ? 0.35 : 0.65;
  tone(60, 0.06, "sine");
  setTimeout(() => tone(48, 0.08, "sine"), gap * 1000);
}

export function stinger(kind: "broken-arrow" | "trickery" | "detonation" | "close-call") {
  const map = {
    "broken-arrow": [220, 180, 140],
    "trickery": [330, 280, 240],
    detonation: [80, 60, 40],
    "close-call": [440, 380, 320],
  };
  map[kind].forEach((f, i) => setTimeout(() => tone(f, 0.15, "square"), i * 120));
}

/** Adjust ambient drone from defcon (1=highest tension) and global risk 0–100. */
export function updateAtmosphere(defcon: number, risk: number) {
  if (!drone || !gain || muted || !ctx) return;
  const base = 72 + (5 - defcon) * 14 + risk * 0.08;
  drone.frequency.setTargetAtTime(base, ctx.currentTime, 0.4);
  gain.gain.setTargetAtTime(0.008 + (5 - defcon) * 0.004 + risk * 0.00006, ctx.currentTime, 0.4);
  if (defcon < lastDefcon) defconTone(defcon);
  if (risk > lastRisk + 8) radarSweep();
  lastDefcon = defcon;
  lastRisk = risk;
}

export function setMuted(v: boolean) {
  muted = v;
  if (gain) gain.gain.value = v ? 0 : 0.012;
  if (!v) unlockAudio();
}

export function isMuted() {
  return muted;
}

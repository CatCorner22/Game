let ctx: AudioContext | null = null;
let drone: OscillatorNode | null = null;
let gain: GainNode | null = null;
let muted = false;

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

export function setMuted(v: boolean) {
  muted = v;
  if (gain) gain.gain.value = v ? 0 : 0.012;
  if (!v) unlockAudio();
}

export function isMuted() {
  return muted;
}

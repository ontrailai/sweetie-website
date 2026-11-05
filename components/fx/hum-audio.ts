/**
 * The ambient hive hum (WebAudio). OFF by default, never autoplays: it only
 * starts from an explicit button press. Two detuned saws through a low-pass
 * with a slow wobble, at a gentle volume.
 */
type Listener = () => void;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: AudioScheduledSourceNode[] = [];
let on = false;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((l) => l());

export function subscribeHum(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export const getHum = () => on;
export const getHumServer = () => false;

export async function setHum(next: boolean) {
  if (next === on) return;
  on = next;
  emit();
  if (next) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) {
      on = false;
      emit();
      return;
    }
    ctx ??= new AC();
    await ctx.resume();
    const t = ctx.currentTime;
    master = ctx.createGain();
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(0.05, t + 0.8);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 820;
    filter.Q.value = 6;
    filter.connect(master);
    master.connect(ctx.destination);

    const tremolo = ctx.createGain();
    tremolo.gain.value = 0.75;
    tremolo.connect(filter);
    const trem = ctx.createOscillator();
    trem.frequency.value = 9;
    const tremDepth = ctx.createGain();
    tremDepth.gain.value = 0.22;
    trem.connect(tremDepth).connect(tremolo.gain);

    const wobble = ctx.createOscillator();
    wobble.frequency.value = 0.27;
    const wobbleDepth = ctx.createGain();
    wobbleDepth.gain.value = 7;
    wobble.connect(wobbleDepth);

    nodes = [trem, wobble];
    for (const [f, type, g] of [
      [196, "sawtooth", 0.5],
      [198.6, "sawtooth", 0.45],
      [98, "triangle", 0.7],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      wobbleDepth.connect(o.frequency);
      const gain = ctx.createGain();
      gain.gain.value = g;
      o.connect(gain).connect(tremolo);
      nodes.push(o);
    }
    nodes.forEach((n) => n.start());
  } else if (ctx && master) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 0.35);
    const old = nodes;
    const m = master;
    nodes = [];
    master = null;
    setTimeout(() => {
      old.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      m.disconnect();
      if (!on) void ctx?.suspend();
    }, 400);
  }
}

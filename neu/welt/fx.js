// Ralucas Welt: little sounds (made in code with WebAudio, no files) and "+1" pops on the screen.
// sfx('step' | 'dig' | 'catch' | 'right' | 'coin' | 'heart' | 'splash' | 'pop'); pop('❤️ +1') floats up and fades.

let ctx = null, master = null, on = true;
try { on = localStorage.getItem('miri-welt-sound') !== 'off'; } catch { /* private mode */ }

function audio() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
  return ctx;
}
// iPhone: sound may only start after a tap
const unlock = () => { const c = audio(); if (c && c.state === 'suspended') c.resume(); };
window.addEventListener('pointerdown', unlock, { passive: true });
window.addEventListener('keydown', unlock);

function tone(freq, t0, dur, { type = 'sine', vol = 0.3, to = 0 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
}
function noise(t0, dur, { vol = 0.25, freq = 800, q = 0.8 } = {}) {
  const n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(master); s.start(t0);
}

export function sfx(name) {
  if (!on) return;
  const c = audio(); if (!c || c.state !== 'running') return;
  const t = c.currentTime + 0.01;
  switch (name) {
    case 'step': noise(t, 0.06, { vol: 0.07, freq: 500 + Math.random() * 300, q: 1.2 }); break;
    case 'dig': noise(t, 0.16, { vol: 0.35, freq: 260, q: 0.7 }); tone(110, t, 0.12, { type: 'triangle', vol: 0.15, to: 70 }); break;
    case 'splash': noise(t, 0.35, { vol: 0.25, freq: 1400, q: 0.5 }); break;
    case 'catch': tone(520, t, 0.09, { type: 'triangle', vol: 0.2 }); tone(780, t + 0.08, 0.14, { type: 'triangle', vol: 0.2 }); break;
    case 'right': [523, 659, 784].forEach((f, i) => tone(f, t + i * 0.09, 0.22, { type: 'triangle', vol: 0.22 })); break;
    case 'coin': tone(988, t, 0.08, { type: 'square', vol: 0.08 }); tone(1319, t + 0.07, 0.22, { type: 'square', vol: 0.08 }); break;
    case 'heart': [659, 880, 1047].forEach((f, i) => tone(f, t + i * 0.1, 0.3, { vol: 0.2 })); break;
    case 'pop': tone(600, t, 0.08, { vol: 0.15, to: 900 }); break;
    default: break;
  }
}
export const soundOn = () => on;
export function setSound(v) {
  on = v;
  try { localStorage.setItem('miri-welt-sound', v ? 'on' : 'off'); } catch { /* private mode */ }
}

/** a short text that floats up from the middle of the screen (e.g. "❤️ +1", "🪙 +5") */
export function pop(text) {
  const el = document.createElement('div');
  el.className = 'pop'; el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

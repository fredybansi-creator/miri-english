// Plays English sentences: natural Kokoro mp3 files (made by tools/make_audio.py), or the phone's
// own voice if a sentence has no file. One shared <audio> element, so iPhone Safari allows playback
// after the first tap.

const BASE = '../audio/';
let manifest = null;
const ready = fetch(BASE + 'manifest.json', { cache: 'no-cache' })
  .then((r) => (r.ok ? r.json() : null))
  .then((m) => {
    if (m) manifest = Object.fromEntries(Object.entries(m.keys).map(([k, v]) => [k, new Set(v)]));
  })
  .catch(() => {});

const norm = (t) => String(t).replace(/\s+/g, ' ').trim();

/** FNV-1a (32 bit) over code points + length – must match key() in tools/make_audio.py. */
export function audioKey(text) {
  const t = norm(text);
  let h = 0x811c9dc5;
  for (const ch of t) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${h.toString(16).padStart(8, '0')}${[...t].length.toString(16)}`;
}

const player = new Audio();
player.preload = 'auto';
let current = null; // { resolve }

function urlFor(text, role) {
  const set = role === 'friend' ? 'us-friend' : 'us-main';
  const k = audioKey(text);
  return manifest && manifest[set] && manifest[set].has(k) ? `${BASE}${set}/${k}.mp3` : null;
}

export function stop() {
  try { player.pause(); } catch { /* ignore */ }
  try { speechSynthesis.cancel(); } catch { /* ignore */ }
  if (current) { current.resolve(); current = null; }
}

/** Speak one sentence. role: 'main' (Raluca / narrator, female) or 'friend' (the other person, male). */
export async function play(text, { role = 'main', slow = false } = {}) {
  stop();
  if (!manifest) await Promise.race([ready, new Promise((r) => setTimeout(r, 1500))]);
  const url = urlFor(text, role);
  return new Promise((resolve) => {
    current = { resolve };
    const done = () => { if (current && current.resolve === resolve) current = null; resolve(); };
    if (url) {
      player.onended = done;
      player.onerror = () => deviceVoice(text, slow).then(done);
      player.src = url;
      player.playbackRate = slow ? 0.75 : 1;
      const p = player.play();
      if (p && p.catch) p.catch(() => deviceVoice(text, slow).then(done));
    } else {
      deviceVoice(text, slow).then(done);
    }
  });
}

/** Play several sentences one after another. onLine(i) is called before each one. */
export async function playAll(lines, { role = 'main', slow = false, onLine } = {}) {
  let stopped = false;
  const mine = {};
  playAll.token = mine;
  for (let i = 0; i < lines.length; i++) {
    if (playAll.token !== mine) { stopped = true; break; }
    onLine && onLine(i);
    await play(lines[i], { role, slow });
    if (playAll.token !== mine) { stopped = true; break; }
    await new Promise((r) => setTimeout(r, 350));
  }
  onLine && onLine(-1);
  return !stopped;
}
export function stopAll() { playAll.token = null; stop(); }

function deviceVoice(text, slow) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = slow ? 0.75 : 0.95;
    const v = speechSynthesis.getVoices().find((x) => x.lang === 'en-US' && /Samantha|Ava|Allison|Susan/.test(x.name))
      || speechSynthesis.getVoices().find((x) => x.lang && x.lang.startsWith('en'));
    if (v) u.voice = v;
    let finished = false;
    const end = () => { if (!finished) { finished = true; resolve(); } };
    u.onend = end; u.onerror = end;
    setTimeout(end, 1500 + text.length * 120); // iPhone sometimes never fires onend
    speechSynthesis.speak(u);
  });
}

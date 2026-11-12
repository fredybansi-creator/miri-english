// The game around Raluca (rebuild step 2): coins, bowl, mood, shop items she can wear, and tricks.
// Rules (agreed with Freddy, plan doc "The game: Raluca the fox"):
//   coins: +10 for each day with a finished lesson, +15 extra on day 3 in a row, +50 extra on day 7 (and 14, 21 …)
//   bowl:  fills with every exercise of the day (full after one lesson); it only shows how happy she is
//   mood:  happy after today's lesson; hungry after 1 missed day, sad after 2 – she never runs away
//   tricks: learned with extra exercises (5, 8, 10, 12, 15), then Miri taps Raluca and says the trick

import { getState, update, today, streak, daysSinceLast } from './store.js';

export const BOWL_FULL = 12;

// ---------------------------------------------------------------- coins
/** Call when a lesson is finished. Returns { earned, bonus } (0 if today already paid). */
export function payDay() {
  const st = getState();
  if (st.coinDays.includes(today())) return { earned: 0, bonus: 0 };
  const days = streak();
  const bonus = days === 3 ? 15 : days > 0 && days % 7 === 0 ? 50 : 0;
  update((s) => { s.coins += 10 + bonus; s.coinDays.push(today()); });
  return { earned: 10 + bonus, bonus };
}

// ---------------------------------------------------------------- bowl and mood
export function feed(n = 1) {
  update((s) => {
    s.food[today()] = (s.food[today()] || 0) + n;
    for (const d of Object.keys(s.food)) if (d < today()) delete s.food[d]; // keep only today
  });
}
export const bowlLevel = () => Math.min(1, (getState().food[today()] || 0) / BOWL_FULL);

/** 'happy' | 'ok' | 'hungry' | 'sad' */
export function mood() {
  const d = daysSinceLast();
  if (d === null) return 'ok';
  if (d === 0) return 'happy';
  if (d === 1) return 'ok';
  if (d === 2) return 'hungry';
  return 'sad';
}
export const MOOD_LINE = {
  happy: { en: 'I love you, Miri!', de: 'Raluca ist glücklich.' },
  ok: { en: 'Hi Miri! Ready for today?', de: 'Tippe auf mich' },
  hungry: { en: "I'm hungry, Miri!", de: 'Raluca hat Hunger – mach eine Lektion!' },
  sad: { en: 'I missed you, Miri!', de: 'Raluca ist traurig. Sie hat dich vermisst.' },
};

// ---------------------------------------------------------------- shop
// slot: only one item per slot. svg is drawn in Raluca's own coordinates (viewBox 0 0 400 400):
// "head" items go into her head group (they move with her head), the others into her body.
export const SHOP = [
  { id: 'bow', name: 'Rote Schleife', price: 30, slot: 'head', in: 'head',
    svg: '<g stroke="#7a1212" stroke-width="2"><path d="M196 112 L176 98 L178 124 Z" fill="#e23b3b"/><path d="M196 112 L216 98 L214 124 Z" fill="#e23b3b"/><circle cx="196" cy="111" r="6" fill="#c42727"/></g>' },
  { id: 'collar', name: 'Halsband mit Marke', price: 40, slot: 'neck', in: 'fox',
    svg: '<g stroke="#5a1010" stroke-width="2"><path d="M138 236 Q172 262 212 238 L214 250 Q172 276 134 248 Z" fill="#d23a3a"/><circle cx="176" cy="266" r="8" fill="#f5c84a" stroke="#a07a10"/><text x="176" y="270" text-anchor="middle" font-size="9" font-weight="800" fill="#7a5a00" stroke="none">R</text></g>' },
  { id: 'glasses', name: 'Sonnenbrille', price: 60, slot: 'eyes', in: 'head',
    svg: '<g stroke="#111" stroke-width="2.5"><rect x="128" y="148" width="36" height="26" rx="10" fill="#1d2430"/><rect x="176" y="148" width="36" height="26" rx="10" fill="#1d2430"/><path d="M164 158 Q170 153 176 158" fill="none"/><path d="M135 154 l10 0" stroke="#6d84a8" stroke-width="3"/><path d="M183 154 l10 0" stroke="#6d84a8" stroke-width="3"/></g>' },
  { id: 'leash', name: 'Leine', price: 80, slot: 'leash', in: 'fox', needs: 'collar',
    svg: '<path d="M176 268 C140 300 90 250 60 200 C40 168 20 150 -10 140" fill="none" stroke="#8a4b22" stroke-width="5" stroke-linecap="round"/><circle cx="176" cy="268" r="4" fill="#bbb" stroke="#666" stroke-width="1.5"/>' },
  { id: 'hat', name: 'Sommerhut', price: 100, slot: 'head', in: 'head',
    svg: '<g stroke="#7a5a1c" stroke-width="2"><ellipse cx="170" cy="112" rx="70" ry="13" fill="#f2d27a"/><path d="M128 110 C130 78 210 78 212 110 Z" fill="#f2d27a"/><path d="M129 104 C150 110 190 110 211 104 L212 110 C190 116 150 116 128 110 Z" fill="#e2564b"/></g>' },
  { id: 'crown', name: 'Krone', price: 150, slot: 'head', in: 'head',
    svg: '<g stroke="#a57a0c" stroke-width="2"><path d="M136 118 L140 84 L156 102 L170 78 L184 102 L200 84 L204 118 Z" fill="#f5c84a"/><circle cx="170" cy="96" r="4" fill="#e2564b"/><circle cx="148" cy="106" r="3" fill="#3f78d6"/><circle cx="192" cy="106" r="3" fill="#3f78d6"/></g>' },
];
export const itemById = (id) => SHOP.find((i) => i.id === id);

export function buy(id) {
  const it = itemById(id), st = getState();
  if (!it || st.owned.includes(id) || st.coins < it.price) return false;
  update((s) => { s.coins -= it.price; s.owned.push(id); });
  wear(id);
  return true;
}
export function wear(id) {
  const it = itemById(id);
  if (!it) return;
  update((s) => {
    s.wearing[it.slot] = id;
    if (it.needs && !s.owned.includes(it.needs)) return;
    if (it.needs) s.wearing[itemById(it.needs).slot] = it.needs;
  });
}
export function takeOff(id) {
  const it = itemById(id);
  update((s) => {
    if (s.wearing[it.slot] === id) delete s.wearing[it.slot];
    for (const o of SHOP) if (o.needs === id && s.wearing[o.slot] === o.id) delete s.wearing[o.slot]; // no leash without collar
  });
}

/** Draw what she wears onto a mounted fox (see fox.js). */
export function dress(container) {
  const wearing = getState().wearing;
  container.querySelectorAll('.wear').forEach((n) => n.remove());
  const scarf = container.querySelector('#scarf');
  if (scarf) scarf.style.display = wearing.neck ? 'none' : '';
  for (const id of Object.values(wearing)) {
    const it = itemById(id);
    if (!it) continue;
    const parent = container.querySelector(it.in === 'head' ? '#head' : '#fox');
    if (!parent) continue;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'wear');
    g.innerHTML = it.svg;
    if (it.slot === 'leash') parent.insertBefore(g, parent.firstChild); else parent.appendChild(g);
  }
}

// ---------------------------------------------------------------- tricks
// words = what Miri may say (checked against the transcript)
export const TRICKS = [
  { id: 'sit', name: 'Sit!', cost: 5, words: ['sit', 'sit down', 'seat', 'set', 'is it'] },
  { id: 'paw', name: 'Give paw!', cost: 8, words: ['paw', 'give paw', 'shake'] },
  { id: 'jump', name: 'Jump!', cost: 10, words: ['jump'] },
  { id: 'spin', name: 'Spin!', cost: 12, words: ['spin', 'turn around', 'turn'] },
  { id: 'down', name: 'Lie down!', cost: 15, words: ['lie down', 'down', 'lay down'] },
];

/** The next trick to learn and how many extra exercises are still missing. */
export function nextTrick() {
  const st = getState();
  let used = 0;
  for (const t of TRICKS) {
    if (!st.tricks.includes(t.id)) return { trick: t, have: Math.max(0, st.extras - used), need: t.cost };
    used += t.cost;
  }
  return null;
}

/** Call after an extra exercise. Returns the trick she just learned, if any. */
export function addExtra() {
  update((s) => { s.extras++; });
  const n = nextTrick();
  if (n && n.have >= n.need) {
    update((s) => { s.tricks.push(n.trick.id); });
    return n.trick;
  }
  return null;
}

/** Which trick did she say? Returns the trick (learned or not) or null. */
export function trickFromSpeech(text) {
  const t = ' ' + String(text || '').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
  // longer phrases first ("lie down" before "down")
  const all = TRICKS.flatMap((tr) => tr.words.map((w) => ({ tr, w }))).sort((a, b) => b.w.length - a.w.length);
  const hit = all.find(({ w }) => t.includes(' ' + w + ' '));
  return hit ? hit.tr : null;
}

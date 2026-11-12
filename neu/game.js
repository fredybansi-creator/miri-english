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
// slot = where it goes (one item per slot): ear, head, eyes, mouth, neck, leash, toy.
// svg is drawn in Raluca's own coordinates (viewBox 0 0 400 400, see fox.js); box = the thumbnail's viewBox.
const S = 'stroke-linejoin="round" stroke-linecap="round"';
export const SHOP = [
  { id: 'bow', name: 'Rote Schleife', price: 20, slot: 'ear', box: '90 96 64 50',
    svg: `<g transform="translate(120 121) rotate(-24)" stroke="#8a1522" stroke-width="2" ${S}><path d="M0 0 C-8 -12 -22 -16 -24 -4 C-25 6 -12 10 0 0 Z" fill="#e8394a"/><path d="M0 0 C8 -12 22 -16 24 -4 C25 6 12 10 0 0 Z" fill="#e8394a"/><path d="M-2 2 L-9 16 L-3 15 Z M2 2 L9 16 L3 15 Z" fill="#c92636"/><circle r="5.5" fill="#c92636"/><path d="M-18 -6 q5 -4 10 -1 M18 -6 q-5 -4 -10 -1" fill="none" stroke="#ff8a95" stroke-width="2"/></g>` },
  { id: 'flower', name: 'Blume', price: 30, slot: 'ear', box: '196 100 56 50',
    svg: `<g transform="translate(222 124)" stroke="#b5527a" stroke-width="1.6"><circle cx="0" cy="-9" r="7" fill="#ffb3cf"/><circle cx="8.5" cy="-3" r="7" fill="#ffb3cf"/><circle cx="5.5" cy="7.5" r="7" fill="#ffb3cf"/><circle cx="-5.5" cy="7.5" r="7" fill="#ffb3cf"/><circle cx="-8.5" cy="-3" r="7" fill="#ffb3cf"/><circle r="5" fill="#f5c84a" stroke="#c99a1a"/><path d="M10 10 q8 6 14 4" fill="none" stroke="#5c9c3c" stroke-width="3"/></g>` },
  { id: 'collar', name: 'Halsband mit Marke', price: 40, slot: 'neck', box: '128 222 96 62',
    svg: `<g stroke="#5a1010" stroke-width="2" ${S}><path d="M136 230 Q174 258 222 230 L224 243 Q174 273 133 243 Z" fill="#d6363f"/><path d="M140 238 Q174 262 220 237" fill="none" stroke="#f07a80" stroke-width="2"/><circle cx="178" cy="270" r="9" fill="#f5c84a" stroke="#a07a10"/><text x="178" y="274" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="800" fill="#7a5a00" stroke="none">R</text></g>` },
  { id: 'bone', name: 'Knochen', price: 50, slot: 'mouth', box: '124 192 92 42',
    svg: `<g stroke="#9b8a66" stroke-width="2" ${S}><rect x="140" y="207" width="60" height="11" rx="5.5" fill="#f8f1df"/><circle cx="139" cy="206" r="7.5" fill="#f8f1df"/><circle cx="139" cy="219" r="7.5" fill="#f8f1df"/><circle cx="201" cy="206" r="7.5" fill="#f8f1df"/><circle cx="201" cy="219" r="7.5" fill="#f8f1df"/><path d="M146 211 h46" stroke="#fff" stroke-width="2.5"/><path d="M160 203 Q170 210 180 203" fill="none" stroke="#6b3417" stroke-width="2.2"/></g>` },
  { id: 'bandana', name: 'Halstuch', price: 50, slot: 'neck', box: '128 220 96 76',
    svg: `<g stroke="#1d3f7a" stroke-width="2" ${S}><path d="M134 228 Q176 254 224 228 L218 246 L182 290 L148 250 Z" fill="#3f78d6"/><g fill="#fff" stroke="none"><circle cx="162" cy="250" r="3"/><circle cx="182" cy="262" r="3"/><circle cx="200" cy="248" r="3"/><circle cx="182" cy="278" r="2.6"/><circle cx="170" cy="266" r="2.4"/><circle cx="194" cy="266" r="2.4"/></g></g>` },
  { id: 'glasses', name: 'Sonnenbrille', price: 60, slot: 'eyes', box: '120 140 100 44',
    svg: `<g stroke="#111" stroke-width="2.5" ${S}><rect x="126" y="149" width="40" height="28" rx="11" fill="#1d2430"/><rect x="174" y="149" width="40" height="28" rx="11" fill="#1d2430"/><path d="M166 159 Q170 154 174 159" fill="none"/><path d="M126 156 L110 150 M214 156 L230 150" fill="none"/><path d="M133 156 l11 0 M181 156 l11 0" stroke="#7d93b8" stroke-width="3"/></g>` },
  { id: 'ball', name: 'Ball', price: 60, slot: 'toy', box: '86 306 60 56',
    svg: `<g stroke="#7a1d12" stroke-width="2"><ellipse cx="116" cy="350" rx="18" ry="4" fill="#000" opacity=".12" stroke="none"/><circle cx="116" cy="332" r="17" fill="#e8483a"/><path d="M100 326 Q116 336 132 326" fill="none" stroke="#fff" stroke-width="4"/><circle cx="110" cy="324" r="4" fill="#fff" opacity=".6" stroke="none"/></g>` },
  { id: 'bell', name: 'Glöckchen', price: 70, slot: 'neck', box: '128 222 96 70',
    svg: `<g stroke="#1f5a2c" stroke-width="2" ${S}><path d="M136 230 Q174 258 222 230 L224 242 Q174 271 133 242 Z" fill="#3fa65a"/><g stroke="#8a6a08"><path d="M168 262 C168 252 188 252 188 262 L192 276 L164 276 Z" fill="#f5c84a"/><circle cx="178" cy="279" r="3.5" fill="#c99a1a"/><path d="M172 258 q2 -3 6 -3" fill="none" stroke="#fff3c4" stroke-width="2"/></g></g>` },
  { id: 'leash', name: 'Leine', price: 80, slot: 'leash', needs: 'collar', box: '-10 130 200 150',
    svg: `<path d="M178 270 C140 304 90 256 62 206 C42 172 20 152 -12 142" fill="none" stroke="#8a4b22" stroke-width="5" stroke-linecap="round"/><circle cx="178" cy="270" r="4" fill="#bbb" stroke="#666" stroke-width="1.5"/>` },
  { id: 'hearts', name: 'Herzbrille', price: 90, slot: 'eyes', box: '120 138 100 46',
    svg: `<g stroke="#8a1240" stroke-width="2.2" ${S}><path d="M146 178 C128 166 122 156 128 148 C134 141 143 144 146 151 C149 144 158 141 164 148 C170 156 164 166 146 178 Z" fill="#ff5c93" opacity=".92"/><path d="M194 178 C176 166 170 156 176 148 C182 141 191 144 194 151 C197 144 206 141 212 148 C218 156 212 166 194 178 Z" fill="#ff5c93" opacity=".92"/><path d="M164 155 Q170 151 176 155 M127 154 L112 149 M213 154 L228 149" fill="none"/></g>` },
  { id: 'hat', name: 'Sommerhut', price: 100, slot: 'head', box: '96 64 150 56',
    svg: `<g stroke="#7a5a1c" stroke-width="2" ${S}><ellipse cx="170" cy="108" rx="70" ry="13" fill="#f2d27a"/><path d="M130 106 C130 74 210 74 210 106 Z" fill="#f2d27a"/><path d="M131 99 C152 106 188 106 209 99 L210 106 C188 113 152 113 130 106 Z" fill="#e2564b"/><path d="M146 86 q24 -10 48 0" fill="none" stroke="#fff3c4" stroke-width="2.5"/></g>` },
  { id: 'party', name: 'Partyhut', price: 110, slot: 'head', box: '128 34 84 82',
    svg: `<g stroke="#3a2a7a" stroke-width="2" ${S}><path d="M148 108 L170 46 L192 108 Z" fill="#7b61ff"/><path d="M160 80 L180 80 M155 94 L186 94 M165 66 L175 66" stroke="#ffd34d" stroke-width="5"/><ellipse cx="170" cy="108" rx="24" ry="5" fill="#5b45d6"/><circle cx="170" cy="44" r="7" fill="#ff6b9a"/></g>` },
  { id: 'crown', name: 'Krone', price: 150, slot: 'head', box: '126 66 90 52',
    svg: `<g stroke="#a57a0c" stroke-width="2" ${S}><path d="M138 112 L142 80 L157 98 L170 74 L183 98 L198 80 L202 112 Z" fill="#f5c84a"/><path d="M138 112 L202 112 L201 104 L139 104 Z" fill="#e8b532"/><circle cx="170" cy="92" r="4.5" fill="#e2564b"/><circle cx="150" cy="104" r="3" fill="#3f78d6"/><circle cx="190" cy="104" r="3" fill="#3f78d6"/><path d="M148 92 l6 -8" stroke="#fff6c8" stroke-width="2"/></g>` },
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
    for (const [slot, other] of Object.entries(s.wearing)) if (other === id || slot === it.slot) delete s.wearing[slot];
    s.wearing[it.slot] = id;
    if (it.needs && s.owned.includes(it.needs)) s.wearing[itemById(it.needs).slot] = it.needs;
  });
}
export function takeOff(id) {
  const it = itemById(id);
  update((s) => {
    for (const [slot, other] of Object.entries(s.wearing)) if (other === id) delete s.wearing[slot];
    for (const o of SHOP) if (o.needs === id) for (const [slot, other] of Object.entries(s.wearing)) if (other === o.id) delete s.wearing[slot]; // no leash without collar
  });
  void it;
}
/** Is she wearing this item? (works with old saves where the bow was in slot "head") */
export const isWorn = (id) => Object.values(getState().wearing).includes(id);

function svgNodes(markup) {
  // Parse as real SVG (safe on every iPhone; innerHTML on SVG groups is not needed)
  const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`, 'image/svg+xml');
  return [...doc.documentElement.childNodes].map((n) => document.importNode(n, true));
}

/** Draw what she wears onto a mounted fox (see fox.js). */
export function dress(container) {
  const bySlot = {};
  for (const id of Object.values(getState().wearing)) { const it = itemById(id); if (it) bySlot[it.slot] = it; }
  for (const slot of ['ear', 'head', 'eyes', 'mouth', 'neck', 'leash', 'toy']) {
    const g = container.querySelector('#wear-' + slot);
    if (!g) continue;
    g.replaceChildren(...(bySlot[slot] ? svgNodes(bySlot[slot].svg) : []));
  }
  const mouth = container.querySelector('#mouth');
  if (mouth) mouth.style.display = bySlot.mouth ? 'none' : '';
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

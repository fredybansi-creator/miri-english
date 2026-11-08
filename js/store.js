// Progress storage: localStorage on the device, backed up to Supabase by sync.js.
const KEY = 'miri-english-v1';

const defaults = () => ({
  version: 1,
  welcomed: false,
  created: today(),
  updatedAt: 0,  // ms timestamp of the last local change
  settings: { accent: 'en-US', rate: 0.95 },
  cards: {},     // cardId -> { due, interval, ease, reps, lapses, last }
  lessons: {},   // lessonId -> { done, date, score }
  days: {},      // 'YYYY-MM-DD' -> { lesson, cards, speaking, seconds, reviews, spoken }
  speaking: {},  // sentenceId -> { best, count, last }
  mistakes: [],  // coach fixes → "Meine Fehler" cards: { id, wrong, better, why, date }
  review: {},    // 'lessonId:exerciseIndex' -> { last, weak } for the mixed review
  sync: {},      // { code, lastPush, resetAt }
});

// ---------------------------------------------------------------- change listeners (for sync)
const listeners = new Set();
export function onSave(fn) { listeners.add(fn); }

export function today(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return today(new Date(y, m - 1, d + n));
}
export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

let state = null;

function load() {
  const base = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...base, ...saved, settings: { ...base.settings, ...(saved.settings || {}) } };
    }
  } catch { /* storage blocked or corrupt – start fresh */ }
  return base;
}

export function getState() {
  if (!state) state = load();
  return state;
}

function write() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export function save() {
  getState().updatedAt = Date.now();
  write();
  for (const fn of listeners) { try { fn(); } catch { /* ignore */ } }
}

// Save without marking a change (e.g. sync bookkeeping).
export function saveQuiet() { write(); }

export function replaceState(next) {
  const base = defaults();
  state = { ...base, ...next, settings: { ...base.settings, ...(next.settings || {}) } };
  write();
}

// Merge two progress states (two devices, or a restore). Nothing learned gets lost:
// cards keep the more practised version, finished lessons stay finished, day stats take the max.
export function mergeStates(a, b) {
  const newer = (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
  const out = { ...defaults(), ...newer };

  out.created = [a.created, b.created].filter(Boolean).sort()[0] || today();
  out.welcomed = !!(a.welcomed || b.welcomed);

  out.cards = { ...a.cards };
  for (const [id, c] of Object.entries(b.cards || {})) {
    const o = out.cards[id];
    if (!o || c.reps > o.reps || (c.reps === o.reps && c.due > o.due)) out.cards[id] = c;
  }

  out.lessons = { ...a.lessons };
  for (const [id, l] of Object.entries(b.lessons || {})) {
    const o = out.lessons[id];
    out.lessons[id] = !o ? l : {
      done: !!(o.done || l.done),
      date: [o.date, l.date].filter(Boolean).sort()[0],
      score: Math.max(o.score || 0, l.score || 0),
    };
  }

  out.days = { ...a.days };
  for (const [d, x] of Object.entries(b.days || {})) {
    const o = out.days[d];
    out.days[d] = !o ? x : {
      lesson: !!(o.lesson || x.lesson), cards: !!(o.cards || x.cards), speaking: !!(o.speaking || x.speaking),
      seconds: Math.max(o.seconds || 0, x.seconds || 0),
      reviews: Math.max(o.reviews || 0, x.reviews || 0),
      spoken: Math.max(o.spoken || 0, x.spoken || 0),
    };
  }

  out.speaking = { ...a.speaking };
  for (const [id, x] of Object.entries(b.speaking || {})) {
    const o = out.speaking[id];
    out.speaking[id] = !o ? x : {
      best: Math.max(o.best || 0, x.best || 0),
      count: Math.max(o.count || 0, x.count || 0),
      last: [o.last, x.last].filter(Boolean).sort().pop() || null,
    };
  }

  const seen = new Set();
  out.mistakes = [...(a.mistakes || []), ...(b.mistakes || [])].filter((m) => {
    const k = m.id || m.en;
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  out.review = { ...(a.review || {}) };
  for (const [k, r] of Object.entries(b.review || {})) {
    const o = out.review[k];
    if (!o || (r.last || '') > (o.last || '')) out.review[k] = r;
  }

  out.sync = { ...(b.sync || {}), ...(a.sync || {}) }; // keep this device's code
  out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
  return out;
}

export function day(d = today()) {
  const s = getState();
  if (!s.days[d]) s.days[d] = { lesson: false, cards: false, speaking: false, seconds: 0, reviews: 0, spoken: 0 };
  return s.days[d];
}

export function markTask(task) {
  day()[task] = true;
  save();
}

export function addTime(seconds) {
  day().seconds += Math.min(Math.round(seconds), 30 * 60);
  save();
}

function active(d) {
  const x = getState().days[d];
  return !!(x && (x.lesson || x.cards || x.speaking));
}
export const isActiveDay = active;

export function streak() {
  let d = today();
  if (!active(d)) d = addDays(d, -1);
  let n = 0;
  while (active(d)) { n++; d = addDays(d, -1); }
  return n;
}

export function bestStreak() {
  const dates = Object.keys(getState().days).filter(active).sort();
  let best = 0, run = 0, prev = null;
  for (const d of dates) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function totalSeconds() {
  return Object.values(getState().days).reduce((a, d) => a + (d.seconds || 0), 0);
}

export function resetAll() {
  const keep = state?.sync || {};
  state = defaults();
  state.welcomed = true;
  // keep the backup code, but mark the reset so the old backup isn't merged back in
  state.sync = { code: keep.code, resetAt: Date.now() };
  save();
}

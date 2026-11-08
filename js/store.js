// Progress storage (localStorage for now; Supabase sync comes in phase 4).
const KEY = 'miri-english-v1';

const defaults = () => ({
  version: 1,
  welcomed: false,
  created: today(),
  settings: { accent: 'en-US', rate: 0.95 },
  cards: {},     // phraseId -> { due, interval, ease, reps, lapses, last }
  lessons: {},   // lessonId -> { done, date, score }
  days: {},      // 'YYYY-MM-DD' -> { lesson, cards, speaking, seconds, reviews, spoken }
  speaking: {},  // sentenceId -> { best, count, last }
  mistakes: [],  // { en, sentenceId, date }  – words the check suggested (used in phase 4)
});

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

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
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
  state = defaults();
  state.welcomed = true;
  save();
}

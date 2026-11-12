// Miri's progress: kept on the phone (localStorage) and copied to Supabase (Edge Function "progress"),
// so nothing is lost. No password: the phone makes a random code once and keeps it. The code is shown
// on the start page, so Miri can move to a new phone.

const KEY = 'miri-neu';
const LOG_KEY = 'miri-neu-log';
const PROGRESS_URL = 'https://aagbnrcsprmhcwllfmcn.supabase.co/functions/v1/progress';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newCode() {
  const r = crypto.getRandomValues(new Uint8Array(16));
  const s = Array.from(r, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}`;
}

/** Today's date on her phone, as YYYY-MM-DD. */
export function today(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fresh() {
  return {
    v: 1,
    app: 'neu',
    code: newCode(),
    done: {},      // lessonId → { date, good, total }
    days: [],      // dates with a finished lesson
    run: null,     // lesson in progress: { lessonId, step, results: [] }
    // game (step 2)
    coins: 0,
    coinDays: [],  // dates that already paid coins
    owned: [],     // shop item ids
    wearing: {},   // slot → item id
    food: {},      // date → exercises done that day (fills Raluca's bowl)
    extras: 0,     // extra exercises done in total
    tricks: [],    // learned trick ids, in order
    cards: {},     // flip cards: sentence key → { box 1–5, due date }
    reminder: false, // push reminder at 19:00 is on (step 4)
    updatedAt: 0,
  };
}

let state = load();

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && s.v === 1 && s.code) return { ...fresh(), ...s, code: s.code };
  } catch { /* ignore */ }
  const s = fresh();
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  return s;
}

export const getState = () => state;

export function update(fn) {
  fn(state);
  state.updatedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

/** Whole days since the last finished lesson (0 = today, 1 = yesterday …), or null if never. */
export function daysSinceLast() {
  if (!state.days.length) return null;
  const last = state.days.slice().sort().pop();
  const [y, m, d] = last.split('-').map(Number);
  const a = new Date(y, m - 1, d), b = new Date();
  b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / 86400000);
}

/** Days in a row with a finished lesson, counting today or yesterday as the last day. */
export function streak() {
  const set = new Set(state.days);
  const d = new Date();
  if (!set.has(today(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(today(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ---------------------------------------------------------------- online copy
async function call(body) {
  const res = await fetch(PROGRESS_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    signal: AbortSignal.timeout ? AbortSignal.timeout(15000) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || `http_${res.status}`);
  return data;
}

let saving = null;
/** Copy the progress to the server (quietly; tries again next time if offline). */
export function backup() {
  if (saving) return saving;
  const { run, ...data } = state; // the half-done lesson stays on the phone
  saving = call({ action: 'put', code: state.code, data, updatedAt: state.updatedAt || Date.now() })
    .then(() => { log('Gesichert'); return true; })
    .catch((e) => { log('Sicherung ging nicht: ' + e.message); return false; })
    .finally(() => { saving = null; });
  return saving;
}

/** Load the progress of another phone by its code. Returns true if found. */
export async function restore(code) {
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 16) throw new Error('Der Code hat 16 Zeichen.');
  code = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
  const d = await call({ action: 'get', code });
  if (!d.data || d.data.app !== 'neu') return false;
  state = { ...fresh(), ...d.data, code, run: null };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  return true;
}

// ---------------------------------------------------------------- small log for finding problems
export function log(msg) {
  const line = `${new Date().toLocaleString('de-DE')} ${msg}`;
  try {
    const all = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    all.unshift(line);
    localStorage.setItem(LOG_KEY, JSON.stringify(all.slice(0, 150)));
  } catch { /* ignore */ }
}
export function readLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch { return []; }
}

// Automatic backup of the learning progress to Supabase (Edge Function "progress").
// Miri needs no account: a personal backup code identifies her data. On a new device she
// enters the code and both states are merged.
import { SUPABASE_URL } from './config.js';
import { getState, saveQuiet, replaceState, mergeStates, onSave } from './store.js';

const URL_ = `${SUPABASE_URL}/functions/v1/progress`;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I
export const CODE_RE = /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

let timer = null;
let pushing = false;
let listeners = new Set();
export const status = { state: 'idle', lastPush: 0, error: '' }; // idle | syncing | ok | error | offline
export function onStatus(fn) { listeners.add(fn); }
function setStatus(s, error = '') {
  status.state = s;
  status.error = error;
  for (const fn of listeners) { try { fn(status); } catch { /* ignore */ } }
}

export function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return chars.match(/.{4}/g).join('-');
}

export function normalizeCode(input) {
  const raw = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return raw.length === 16 ? raw.match(/.{4}/g).join('-') : '';
}

export function getCode() {
  const s = getState();
  if (!s.sync) s.sync = {};
  if (!s.sync.code) { s.sync.code = newCode(); saveQuiet(); }
  return s.sync.code;
}

async function api(body, { keepalive = false } = {}) {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw Object.assign(new Error(data.error || `http_${res.status}`), { code: data.error });
  return data;
}

function snapshot() {
  const { sync, ...rest } = getState(); // the code itself is never uploaded
  return rest;
}

export async function push({ keepalive = false } = {}) {
  if (pushing || navigator.onLine === false) { if (navigator.onLine === false) setStatus('offline'); return; }
  pushing = true;
  setStatus('syncing');
  try {
    const s = getState();
    await api({ action: 'put', code: getCode(), data: snapshot(), updatedAt: s.updatedAt || Date.now() }, { keepalive });
    s.sync.lastPush = Date.now();
    status.lastPush = s.sync.lastPush;
    saveQuiet();
    setStatus('ok');
  } catch (e) {
    setStatus(navigator.onLine === false ? 'offline' : 'error', e.message);
  } finally {
    pushing = false;
  }
}

function schedulePush() {
  clearTimeout(timer);
  timer = setTimeout(() => push(), 4000);
}

/** On app start: pull the backup, merge it into this device, push the result. Returns true if local data changed. */
export async function initSync() {
  getCode();
  status.lastPush = getState().sync.lastPush || 0;
  onSave(schedulePush);
  window.addEventListener('online', () => push());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && timer) { clearTimeout(timer); timer = null; push({ keepalive: true }); }
  });

  let changed = false;
  try {
    setStatus('syncing');
    const remote = await api({ action: 'get', code: getCode() });
    const local = getState();
    const resetAt = local.sync?.resetAt || 0;
    if (remote.data && (remote.updatedAt || 0) > resetAt) {
      const merged = mergeStates(local, remote.data);
      changed = JSON.stringify(merged) !== JSON.stringify(local);
      if (changed) replaceState(merged);
    }
    await push();
  } catch (e) {
    setStatus(navigator.onLine === false ? 'offline' : 'error', e.message);
  }
  return changed;
}

/** Restore on a new device: switch to the given code and merge its backup into this device. */
export async function restore(codeInput) {
  const code = normalizeCode(codeInput);
  if (!CODE_RE.test(code)) throw new Error('bad_code');
  const remote = await api({ action: 'get', code });
  if (!remote.data) throw new Error('not_found');
  const merged = mergeStates({ ...getState(), sync: {} }, remote.data);
  merged.sync = { code, lastPush: 0 };
  merged.welcomed = true;
  replaceState(merged);
  await push();
  return merged;
}

// Raluca's reminder at 19:00: a push message to the phone (server: Edge Function "reminder").
// iPhone: works only when the app was added to the home screen (Teilen → Zum Home-Bildschirm), iOS 16.4+.
import { getState, update, log } from './store.js';

const URL_ = 'https://aagbnrcsprmhcwllfmcn.supabase.co/functions/v1/reminder';

async function call(body) {
  const res = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || `http_${res.status}`);
  return data;
}

const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const supported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

/** 'on' | 'off' | 'blocked' | 'homescreen' (iPhone: add to home screen first) | 'unsupported' */
export function reminderState() {
  if (isIOS() && !standalone()) return 'homescreen';
  if (!supported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'blocked';
  return getState().reminder && Notification.permission === 'granted' ? 'on' : 'off';
}

function b64ToBytes(b64) {
  const s = atob(b64.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

export function registerWorker() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch((e) => log('Service Worker: ' + e.message));
}

/** Must be called from a tap (iPhone asks for permission only then). */
export async function turnOn() {
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { log('Erinnerung: keine Erlaubnis'); throw new Error('Du hast Mitteilungen nicht erlaubt.'); }
  const reg = await navigator.serviceWorker.ready;
  const { key } = await call({ action: 'key' });
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
  await call({ action: 'subscribe', code: getState().code, subscription: sub.toJSON() });
  update((s) => { s.reminder = true; });
  log('Erinnerung eingeschaltet');
}

export async function turnOff() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  } catch { /* ignore */ }
  await call({ action: 'unsubscribe', code: getState().code }).catch(() => {});
  update((s) => { s.reminder = false; });
  log('Erinnerung ausgeschaltet');
}

export async function sendTest() {
  await call({ action: 'test', code: getState().code });
}

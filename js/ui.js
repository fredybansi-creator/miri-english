// Small UI helpers shared by all screens.
import { say } from './speech.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const svg = (path, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${path}</svg>`;

export const icon = {
  home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
  modules: svg('<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'),
  cards: svg('<rect x="3" y="6" width="14" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v13"/>'),
  stats: svg('<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>'),
  close: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  chevron: svg('<path d="m9 6 6 6-6 6"/>'),
  check: svg('<path d="M20 6 9 17l-5-5"/>', 'stroke-width="3"'),
  lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  play: svg('<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>'),
  mic: svg('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4"/>'),
  stop: svg('<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>'),
  flame: svg('<path d="M12 22c4.4 0 7-2.9 7-6.6 0-3.6-2.6-5.9-4.3-8.4-.5 2-1.5 3-2.7 3.4.2-3-1.2-5.9-3.5-8.4-.3 4.1-5.5 6.6-5.5 13.4C3 19.1 7.6 22 12 22z"/>', 'fill="currentColor" stroke="none"'),
};

export function playBtn(text, cls = '', role = 'main') {
  return `<button class="play ${cls}" data-say="${esc(text)}" data-role="${role}" aria-label="Anhören">${icon.play}</button>`;
}

// One delegated listener: any [data-say] button reads its text aloud.
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-say]');
  if (b) say(b.dataset.say, { role: b.dataset.role || 'main' });
});

let toastTimer;
export function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

export function setSession(on) {
  document.body.classList.toggle('in-session', on);
  window.scrollTo(0, 0);
}

// Tiny haptic-like feedback where supported (Android); harmless elsewhere.
export function buzz(ms = 15) {
  try { navigator.vibrate?.(ms); } catch { /* ignore */ }
}

export function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

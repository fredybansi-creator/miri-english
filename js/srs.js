// Spaced repetition (simplified SM-2): Nochmal / Schwer / Gut / Leicht.
import { getState, save, today, addDays, day } from './store.js';

export function addCards(ids) {
  const cards = getState().cards;
  for (const id of ids) {
    if (!cards[id]) cards[id] = { due: today(), interval: 0, ease: 2.5, reps: 0, lapses: 0, last: null, added: today() };
  }
  save();
}

export function learnedIds() {
  return Object.keys(getState().cards);
}

export function dueIds(limit = 15) {
  const t = today();
  const cards = getState().cards;
  return Object.entries(cards)
    .filter(([, c]) => c.due <= t)
    .sort(([, a], [, b]) => {
      const aw = a.last === 'again' ? 0 : 1, bw = b.last === 'again' ? 0 : 1; // "Nochmal" cards first
      return aw - bw || a.due.localeCompare(b.due) || a.reps - b.reps;
    })
    .slice(0, limit)
    .map(([id]) => id);
}

export function dueCount() {
  const t = today();
  return Object.values(getState().cards).filter((c) => c.due <= t).length;
}

// Interval (in days) that a grade would give – used for the button labels.
export function preview(card, grade) {
  const i = card.interval;
  switch (grade) {
    case 'again': return 0;
    case 'hard': return Math.max(1, Math.round(i * 1.2));
    case 'good': return i === 0 ? 1 : i === 1 ? 3 : Math.round(i * card.ease);
    case 'easy': return i === 0 ? 3 : Math.round(Math.max(i * card.ease * 1.3, i + 2));
  }
  return 1;
}

export function rate(id, grade) {
  const c = getState().cards[id];
  if (!c) return;
  const next = preview(c, grade);
  if (grade === 'again') { c.lapses++; c.ease = Math.max(1.3, c.ease - 0.2); }
  if (grade === 'hard') c.ease = Math.max(1.3, c.ease - 0.15);
  if (grade === 'easy') c.ease = Math.min(3.2, c.ease + 0.15);
  c.interval = next;
  c.due = addDays(today(), next);
  c.reps++;
  c.last = grade;
  day().reviews++;
  save();
}

export function formatInterval(days) {
  if (days <= 0) return 'gleich';
  if (days === 1) return '1 Tag';
  if (days < 30) return `${days} Tage`;
  const m = Math.round(days / 30);
  return m === 1 ? '1 Monat' : `${m} Monate`;
}

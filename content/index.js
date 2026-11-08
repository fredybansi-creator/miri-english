// All modules. Only modules with `data` are playable; the rest show as "Kommt bald".
import m1 from './m1.js';
import m2 from './m2.js';
import m3 from './m3.js';

export const MODULES = [
  { id: 'm1', emoji: '👋', title: 'Small talk & getting to know people', titleDe: 'Small Talk & Leute kennenlernen', data: m1 },
  { id: 'm2', emoji: '📖', title: 'Telling stories', titleDe: 'Geschichten erzählen', data: m2 },
  { id: 'm3', emoji: '💬', title: 'Opinions', titleDe: 'Meinungen, zustimmen & widersprechen', data: m3 },
  { id: 'm4', emoji: '📅', title: 'Plans & arrangements', titleDe: 'Pläne, Einladungen & Absagen' },
  { id: 'm5', emoji: '💛', title: 'Feelings & reactions', titleDe: 'Gefühle & Reaktionen' },
  { id: 'm6', emoji: '🍝', title: 'Going out', titleDe: 'Essen, Ausgehen & Bestellen' },
  { id: 'm7', emoji: '✈️', title: 'Travel', titleDe: 'Reisen & Wege' },
  { id: 'm8', emoji: '💼', title: 'Work & daily life', titleDe: 'Arbeit, Alltag & Studium' },
  { id: 'm9', emoji: '🙈', title: 'Problems & apologies', titleDe: 'Probleme, Beschwerden & Entschuldigungen' },
  { id: 'm10', emoji: '🧩', title: 'Phrasal verbs & idioms', titleDe: 'Phrasal Verbs & Redewendungen' },
];

export const LESSONS = [];
export const PHRASES = new Map();
export const SPEAK = new Map();

for (const m of MODULES) {
  if (!m.data) continue;
  m.data.lessons.forEach((l, i) => {
    const lesson = { ...l, module: m, index: i };
    LESSONS.push(lesson);
    for (const p of l.phrases) PHRASES.set(p.id, { ...p, lesson });
    for (const s of l.speak) SPEAK.set(s.id, { ...s, lesson });
  });
}

export function findLesson(id) {
  return LESSONS.find((l) => l.id === id);
}

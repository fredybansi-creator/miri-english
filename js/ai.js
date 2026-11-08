// AI feedback via the Supabase Edge Function "feedback" (Gemini behind it).
import { FEEDBACK_URL } from './config.js';

async function post(payload, timeout = 30000) {
  if (!FEEDBACK_URL || navigator.onLine === false) throw Object.assign(new Error('offline'), { code: 'offline' });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw Object.assign(new Error(data.error || `http_${res.status}`), { code: data.error || res.status });
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/** Dictionary: meaning of an English word in context (German explanation). */
export async function lookupWord(word, context = '') {
  const d = await post({ mode: 'lookup', word, context }, 15000);
  return {
    word: String(d.word || word), de: String(d.de || ''), explanation: String(d.explanation || ''),
    example: String(d.example || ''), exampleDe: String(d.exampleDe || ''), register: String(d.register || 'neutral'),
  };
}

/** Conversation partner: Sam's next line. history = [{ who: 'sam'|'miri', text }] */
export async function chatReply(scenario, history) {
  const d = await post({ mode: 'chat_reply', scenario, history }, 20000);
  return { reply: String(d.reply || ''), done: !!d.done };
}

/** Correction of one chat message: { correct, corrected, fixes[], tip } */
export async function chatFix(they, said) {
  const d = await post({ mode: 'chat_fix', they, said }, 20000);
  return {
    correct: !!d.correct,
    corrected: String(d.corrected || said),
    fixes: Array.isArray(d.fixes) ? d.fixes.slice(0, 3) : [],
    tip: String(d.tip || ''),
  };
}

/** Coach feedback on the whole conversation (same shape as aiFeedback). */
export async function chatReview(scenario, history) {
  const d = await post({ mode: 'chat_review', scenario, history });
  return {
    level: ['great', 'good', 'try'].includes(d.level) ? d.level : 'good',
    praise: String(d.praise || ''),
    corrected: String(d.corrected || ''),
    fixes: Array.isArray(d.fixes) ? d.fixes.slice(0, 4) : [],
    betterWords: Array.isArray(d.betterWords) ? d.betterWords.slice(0, 4) : [],
    levelUp: String(d.levelUp || ''),
    tip: String(d.tip || ''),
  };
}

/**
 * mode 'translate': item = { they, de, answers }
 * mode 'free':      item = { they, hint, useWords, sample }
 */
export async function aiFeedback(item, said, { mode = 'translate', timeout = 30000 } = {}) {
  if (!FEEDBACK_URL || navigator.onLine === false) throw Object.assign(new Error('offline'), { code: 'offline' });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  const payload = mode === 'free'
    ? { mode, they: item.they || '', hint: item.hint || '', useWords: item.useWords || [], said }
    : { mode, they: item.they || '', de: item.de, said, answers: item.answers };
  try {
    const res = await fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw Object.assign(new Error(data.error || `http_${res.status}`), { code: data.error || res.status });
    return {
      level: ['great', 'good', 'try'].includes(data.level) ? data.level : 'good',
      praise: String(data.praise || ''),
      corrected: String(data.corrected || ''),
      fixes: Array.isArray(data.fixes) ? data.fixes.slice(0, 3) : [],
      betterWords: Array.isArray(data.betterWords) ? data.betterWords.slice(0, 4) : [],
      levelUp: String(data.levelUp || ''),
      tip: String(data.tip || ''),
    };
  } finally {
    clearTimeout(timer);
  }
}

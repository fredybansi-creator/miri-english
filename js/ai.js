// AI feedback via the Supabase Edge Function "feedback" (Gemini behind it).
import { FEEDBACK_URL } from './config.js';

export async function aiFeedback(item, said, { timeout = 15000 } = {}) {
  if (!FEEDBACK_URL || navigator.onLine === false) throw Object.assign(new Error('offline'), { code: 'offline' });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ they: item.they || '', de: item.de, said, answers: item.answers }),
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

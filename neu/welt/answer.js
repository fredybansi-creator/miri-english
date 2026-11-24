// Ralucas Welt: is her spoken or typed English answer right? (no browser needed, so tests run in node)
// Used by the animal friends, the question marks, the daily quests and Pip's shop.
// Fair to speech recognition and to the iPhone keyboard: curly apostrophes (I’m), contractions (I'm = I am),
// numbers (3 = three), filler words (um, uh), joined words (Goodnight), small spelling slips (Raluka, medow).
import { tokens } from '../../js/check.js';

const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
// words that speech recognition sometimes glues to the next one (good + night = goodnight)
const JOINED = new Set(['good', 'honey', 'mid', 'to', 'every', 'some', 'any', 'day', 'night', 'sun', 'grass', 'home', 'back', 'your', 'my', 'our', 'in', 'out', 'up', 'with', 'a', 'the']);
const FILLER = new Set(['um', 'umm', 'uh', 'uhm', 'er', 'erm', 'ah', 'hmm', 'mm', 'mhm']);

/** the words of a sentence, cleaned: lower case, no punctuation, contractions spelled out, 3 → three */
export function words(text) {
  const out = [];
  for (const w of tokens(String(text || '').replace(/(\d)\s*([a-z])/gi, '$1 $2'))) {
    if (FILLER.has(w)) continue;
    if (/^\d+$/.test(w) && NUM[Number(w)]) out.push(NUM[Number(w)]); else out.push(w);
  }
  return out;
}

// one letter wrong, missing or extra (only for words of 5+ letters: "Raluka", "medow", "favorit")
function oneOff(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, diff = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++diff > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return diff + (a.length - i) + (b.length - j) <= 1;
}

/** does one said word count as the key word? */
function wordFits(w, k) {
  if (w === k) return true;
  if (k.length >= 4 && w.startsWith(k)) return true;                    // explor → exploring, brother → brothers
  if (k.length >= 3 && w.endsWith(k) && JOINED.has(w.slice(0, -k.length))) return true;   // goodnight, honeycake
  if (k.length >= 5 && oneOff(w, k)) return true;                       // raluca → raluka
  if (k.length >= 5 && w.length > k.length && oneOff(w.slice(0, k.length), k)) return true; // explor → exploring with a slip
  return false;
}

/** is the key (one word or a few words, e.g. "thank you") in her answer? */
export function hasKey(said, key) {
  const s = Array.isArray(said) ? said : words(said), k = words(key);
  if (!k.length) return true;
  if (k.length === 1) return s.some((w) => wordFits(w, k[0]));
  for (let i = 0; i + k.length <= s.length; i++) if (k.every((x, j) => wordFits(s[i + j], x))) return true;
  return s.join('').includes(k.join(''));                              // "thankyou" written together
}

/** the groups of key words that are missing in her answer (one word of each group is needed), or null */
export function missingKey(text, keys) {
  if (!keys || !keys.length) return null;
  const s = words(text);
  const miss = keys.filter((g) => !g.some((k) => hasKey(s, k)));
  return miss.length ? miss : null;
}

/** without AI: compare her words with the example answers → 'great' | 'good' | 'try' */
export function typedLevel(text, answers) {
  const said = new Set(words(text)); let best = 0;
  if (!said.size) return 'try';
  for (const a of answers || []) {
    const w = words(a); if (!w.length) continue;
    if ([...said].join('') === w.join('')) { best = 1; break; }   // "Goodnight Hugo" = "Good night, Hugo"
    best = Math.max(best, w.filter((x) => said.has(x) || [...said].some((y) => x.length >= 5 && oneOff(x, y))).length / w.length);
  }
  return best >= 0.85 ? 'great' : best >= 0.55 ? 'good' : 'try';
}

/**
 * The final word on her answer. `level` is what the AI said (or the word check without AI).
 * - Nearly the same as an example answer = always right, whatever the AI or the key words say.
 * - Otherwise a missing key word is never right (the AI is sometimes too kind: "a hole" is not "a den").
 * → { level, miss }
 */
export function finalLevel(level, said, answers, keys) {
  if (typedLevel(said, answers) === 'great') return { level: level === 'great' ? 'great' : 'good', miss: null };
  const miss = missingKey(said, keys);
  return { level: miss ? 'try' : level, miss };
}

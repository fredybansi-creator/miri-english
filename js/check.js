// Offline check for spoken/typed translations.
// Accepts any of several natural answers, tolerates small differences, and finds the
// key words that would make her sentence better. Phase 2 replaces/extends this with AI feedback.

const CONTRACTIONS = {
  "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
  "it's": 'it is', "that's": 'that is', "what's": 'what is', "how's": 'how is', "there's": 'there is',
  "he's": 'he is', "she's": 'she is', "who's": 'who is', "where's": 'where is',
  "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
  "i'll": 'i will', "you'll": 'you will', "we'll": 'we will', "they'll": 'they will', "it'll": 'it will',
  "i'd": 'i would', "you'd": 'you would', "we'd": 'we would', "they'd": 'they would',
  "won't": 'will not', "can't": 'can not', cannot: 'can not', "don't": 'do not', "doesn't": 'does not',
  "didn't": 'did not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
  "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not', "shouldn't": 'should not',
  "wouldn't": 'would not', "couldn't": 'could not', gonna: 'going to', wanna: 'want to', ok: 'okay',
  "let's": 'let us',
};

export function tokens(text) {
  const cleaned = String(text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // café → cafe
    .replace(/[’‘`´]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const out = [];
  for (const w of cleaned) {
    const exp = CONTRACTIONS[w];
    if (exp) out.push(...exp.split(' '));
    else out.push(w.replace(/'/g, ''));
  }
  return out;
}

// word-level Levenshtein similarity in 0..1
function similarity(a, b) {
  if (!a.length && !b.length) return 1;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length);
}

function hasPhrase(tokenList, phrase) {
  const hay = ' ' + tokenList.join(' ') + ' ';
  return hay.includes(' ' + tokens(phrase).join(' ') + ' ');
}

// Split the model answer into words and mark the ones she did not say.
function markAnswer(answer, saidTokens) {
  const pool = new Map();
  for (const t of saidTokens) pool.set(t, (pool.get(t) || 0) + 1);
  return answer.split(/\s+/).map((word) => {
    const ts = tokens(word);
    if (!ts.length) return { word, said: true };
    const ok = ts.every((t) => (pool.get(t) || 0) > 0);
    if (ok) ts.forEach((t) => pool.set(t, pool.get(t) - 1));
    return { word, said: ok };
  });
}

/**
 * @param item  { answers: string[], keywords?: string[][] }
 * @param saidList  transcripts (speech recognition alternatives or typed text)
 * @returns { level: 'great'|'good'|'try', score, said, answer, missing: string[], marked }
 */
export function checkAnswer(item, saidList) {
  let best = { score: -1, said: '', answer: item.answers[0], sTokens: [] };
  for (const said of saidList.filter(Boolean)) {
    const s = tokens(said);
    for (const ans of item.answers) {
      const score = similarity(s, tokens(ans));
      if (score > best.score) best = { score, said, answer: ans, sTokens: s };
    }
  }
  const groups = item.keywords || [];
  const missingGroups = groups.filter((g) => !g.some((alt) => hasPhrase(best.sTokens, alt)));
  const kwRatio = groups.length ? (groups.length - missingGroups.length) / groups.length : best.score;
  // Longer replies can be phrased in many valid ways, so the key words count more than
  // word-by-word similarity to one model answer.
  const score = 0.35 * Math.max(0, best.score) + 0.65 * kwRatio;

  let level = score >= 0.8 ? 'great' : score >= 0.5 ? 'good' : 'try';
  if (best.score >= 0.9) level = 'great';
  if (!best.sTokens.length) level = 'try';

  return {
    level,
    score: Math.round(score * 100) / 100,
    said: best.said,
    answer: best.answer,
    missing: missingGroups.map((g) => g[0]),
    marked: markAnswer(best.answer, best.sTokens),
  };
}

// For tile/gap exercises: compare ignoring case and punctuation.
export function sameSentence(a, b) {
  return tokens(a).join(' ') === tokens(b).join(' ');
}

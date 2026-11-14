// Quick safety check before an update goes live. Run: node tools/check_content.mjs
// Also runs on GitHub for every pull request (.github/workflows/check.yml).
// Checks: every lesson file loads and has all parts, ids are unique, "Satz bauen" extra words are sensible,
// story answers point to a real option, every lesson sentence has a recorded voice (audio/manifest.json),
// and every JavaScript file of the app and the game can be read (no syntax errors).
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { TOPICS } from '../neu/content/index.js';

// same as audioKey() in neu/audio.js (that file needs a browser, so it is copied here)
function audioKey(text) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  let h = 0x811c9dc5;
  for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return `${h.toString(16).padStart(8, '0')}${[...t].length.toString(16)}`;
}

const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const words = (t) => String(t).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);

// 1. lessons
const ids = new Set();
const main = new Set(), friend = new Set();
for (const t of TOPICS) {
  if (!t.id || !t.title || !Array.isArray(t.lessons)) { err(`topic ${t.id}: id, title or lessons missing`); continue; }
  for (const l of t.lessons) {
    const where = `${t.id}/${l.id}`;
    if (ids.has(l.id)) err(`${where}: lesson id used twice`);
    ids.add(l.id);
    for (const k of ['title', 'en', 'goal']) if (!l[k]) err(`${where}: "${k}" missing`);
    if (!(l.repeat || []).length || !(l.build || []).length || !(l.say || []).length || !l.story) err(`${where}: repeat, build, say or story missing`);
    for (const r of l.repeat || []) { if (!r.en || !r.de) err(`${where}: repeat item without en/de`); main.add(r.en); }
    for (const b of l.build || []) {
      if (!b.en || !b.de) err(`${where}: build item without en/de`);
      main.add(b.en);
      for (const x of b.extra || []) {
        if (words(x).length !== 1) warn(`${where}: build extra "${x}" is not one word`);
        if (words(b.en).includes(words(x)[0])) warn(`${where}: build extra "${x}" is also in "${b.en}" (two equal tiles)`);
      }
    }
    for (const s of l.say || []) {
      if (!s.de || !(s.answers || []).length) err(`${where}: say item without de/answers`);
      else main.add(s.answers[0]);
      if (s.they) friend.add(s.they);
      const n = (s.de.match(/[.!?](\s|$)/g) || []).length;
      if (n > 2) warn(`${where}: say "${s.de}" has ${n} sentences (Miri asked for max 2)`);
    }
    if (l.tip) { if (!l.tip.de || !l.tip.en) err(`${where}: tip needs de and en`); else main.add(l.tip.en); }
    if (l.write) { if (!l.write.de || !l.write.sample) err(`${where}: write needs de and sample`); else main.add(l.write.sample); }
    if (l.talk) { if (!l.talk.they || !l.talk.de || !l.talk.sample) err(`${where}: talk needs they, de and sample`); else { friend.add(l.talk.they); main.add(l.talk.sample); } }
    const st = l.story || {};
    (st.lines || []).forEach((x) => main.add(x));
    for (const q of st.questions || []) {
      main.add(q.q);
      if (!Array.isArray(q.options) || !(q.answer >= 0 && q.answer < q.options.length)) err(`${where}: story question "${q.q}" has no valid answer`);
    }
  }
}

// 2. voices
const manifest = JSON.parse(readFileSync(new URL('../audio/manifest.json', import.meta.url), 'utf8'));
const have = (set, text) => (manifest.keys[set] || []).includes(audioKey(text));
const noVoice = [...[...main].filter((x) => !have('us-main', x)), ...[...friend].filter((x) => !have('us-friend', x))];
if (noVoice.length) err(`${noVoice.length} lesson sentences have no voice file – run tools/make_audio.py (first: "${noVoice[0]}")`);

// 3. every JS file of the app and the game must at least parse
const files = ['neu', 'neu/welt', 'neu/content', 'js'].flatMap((d) =>
  readdirSync(new URL(`../${d}/`, import.meta.url)).filter((f) => f.endsWith('.js')).map((f) => `${d}/${f}`));
for (const f of files) {
  try { execFileSync(process.execPath, ['--check', '--input-type=module'], { input: readFileSync(new URL(`../${f}`, import.meta.url)), stdio: ['pipe', 'pipe', 'pipe'] }); }
  catch (e) { err(`${f}: ${String(e.stderr || e.message).split('\n').find((x) => /Error/.test(x)) || 'does not parse'}`); }
}

const lessons = TOPICS.reduce((n, t) => n + t.lessons.length, 0);
console.log(`${TOPICS.length} topics, ${lessons} lessons, ${main.size + friend.size} sentences, ${files.length} code files checked.`);
warnings.forEach((w) => console.log('  warning: ' + w));
errors.forEach((e) => console.log('  ERROR: ' + e));
if (errors.length) { console.log(`${errors.length} problem(s) – please fix before going live.`); process.exit(1); }
console.log('All good.');

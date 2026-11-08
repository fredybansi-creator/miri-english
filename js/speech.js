// Speech: recognition (Safari webkitSpeechRecognition) and text-to-speech.
import { getState } from './store.js';
import { SUPABASE_URL } from './config.js';

const TTS_URL = `${SUPABASE_URL}/functions/v1/tts`;

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = !!SR;
export const canSpeak = 'speechSynthesis' in window;

let voices = [];
function loadVoices() { voices = window.speechSynthesis.getVoices(); }
if (canSpeak) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

const PREFERRED = ['Samantha', 'Ava', 'Allison', 'Evan', 'Daniel', 'Serena', 'Kate', 'Arthur', 'Google US English', 'Google UK English Female'];

function pickVoice(lang) {
  const norm = (v) => v.lang.replace('_', '-');
  const exact = voices.filter((v) => norm(v) === lang);
  const pool = exact.length ? exact : voices.filter((v) => norm(v).startsWith('en'));
  if (!pool.length) return null;
  const quality = pool.find((v) => /premium|enhanced/i.test(v.name));
  if (quality) return quality;
  for (const name of PREFERRED) {
    const v = pool.find((x) => x.name.startsWith(name));
    if (v) return v;
  }
  return pool.find((v) => v.localService) || pool[0];
}

// ---------------------------------------------------------------- natural voice (ElevenLabs via Supabase)
// One shared <audio> element: on iPhone it is "unlocked" by the first tap and can then play
// later sentences too. If the cloud voice fails, we fall back to the built-in browser voice.
const audio = typeof Audio !== 'undefined' ? new Audio() : null;
if (audio) audio.preload = 'auto';
let cloudFailures = 0;

function cloudEnabled() {
  return !!audio && getState().settings.cloudVoice !== false && cloudFailures < 3;
}

export function audioUrl(text, role = 'main') {
  const v = getState().settings.accent === 'en-GB' ? 'uk' : 'us';
  return `${TTS_URL}?v=${v}&r=${role}&t=${encodeURIComponent(text.replace(/\s+/g, ' ').trim())}`;
}

// Warm the cache so the audio is ready when she taps (e.g. the model answer while she speaks).
export function prefetch(texts, role = 'main') {
  if (!cloudEnabled()) return;
  for (const t of texts.filter(Boolean)) fetch(audioUrl(t, role)).catch(() => {});
}

export function say(text, { rate, role = 'main' } = {}) {
  if (!text) return Promise.resolve();
  stopSpeaking();
  if (!cloudEnabled()) return browserSay(text, { rate });
  return new Promise((resolve) => {
    let fellBack = false;
    const fallback = () => {
      if (fellBack) return;
      fellBack = true;
      cloudFailures++;
      browserSay(text, { rate }).then(resolve);
    };
    audio.onended = () => resolve();
    audio.onerror = fallback;
    audio.src = audioUrl(text, role);
    // slow button passes ~0.7; the "langsam" setting is 0.8
    const r = rate ?? getState().settings.rate;
    audio.playbackRate = r < 0.75 ? 0.75 : r < 0.9 ? 0.85 : 1;
    const p = audio.play();
    if (p) p.catch((e) => { if (e && e.name === 'NotAllowedError') resolve(); else fallback(); });
  });
}

function browserSay(text, { rate } = {}) {
  if (!canSpeak || !text) return Promise.resolve();
  const synth = window.speechSynthesis;
  synth.cancel();
  const s = getState().settings;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = s.accent;
  const v = pickVoice(s.accent);
  if (v) u.voice = v;
  u.rate = rate ?? s.rate;
  return new Promise((resolve) => {
    u.onend = u.onerror = () => resolve();
    synth.speak(u);
  });
}

export function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel();
  if (audio && !audio.paused) audio.pause();
}

/**
 * Start listening. Returns { promise, stop }.
 * promise resolves { text, alternatives } or rejects with { code }:
 * 'not-allowed' | 'service-not-allowed' | 'no-speech' | 'network' | 'audio-capture' | 'aborted' | 'unsupported'
 */
export function listen({ onInterim } = {}) {
  if (!SR) {
    return { promise: Promise.reject(Object.assign(new Error('unsupported'), { code: 'unsupported' })), stop() {} };
  }
  stopSpeaking();
  const rec = new SR();
  rec.lang = getState().settings.accent;
  rec.interimResults = true;
  rec.maxAlternatives = 3;
  rec.continuous = false;

  let finals = [];
  let interim = '';
  let error = null;

  const promise = new Promise((resolve, reject) => {
    rec.onresult = (e) => {
      const fin = [];
      interim = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) fin.push(Array.from(r).map((a) => a.transcript.trim()));
        else interim += r[0].transcript;
      }
      finals = fin;
      onInterim?.((fin.map((a) => a[0]).join(' ') + ' ' + interim).trim());
    };
    rec.onerror = (e) => { error = e.error; };
    rec.onend = () => {
      if (finals.length) {
        const text = finals.map((a) => a[0]).join(' ').trim();
        const alternatives = finals.length === 1 ? finals[0] : [text];
        resolve({ text, alternatives });
      } else if (interim.trim()) {
        resolve({ text: interim.trim(), alternatives: [interim.trim()] });
      } else {
        const code = error || 'no-speech';
        reject(Object.assign(new Error(code), { code }));
      }
    };
  });

  try { rec.start(); } catch (e) {
    return { promise: Promise.reject(Object.assign(new Error('start-failed'), { code: 'start-failed' })), stop() {} };
  }
  return { promise, stop: () => { try { rec.stop(); } catch { /* ignore */ } } };
}

export function errorMessage(code) {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Mikrofon oder Spracherkennung ist nicht erlaubt. Auf dem iPhone: Einstellungen › Safari › Mikrofon › „Erlauben“ – und unter Einstellungen › Allgemein › Tastatur „Diktierfunktion“ einschalten. Bis dahin kannst du mit dem Mikrofon der Tastatur diktieren.';
    case 'no-speech':
      return 'Ich habe nichts gehört. Tippe auf das Mikrofon und sprich gleich los.';
    case 'network':
      return 'Die Spracherkennung braucht Internet. Prüf deine Verbindung und versuch es nochmal.';
    case 'audio-capture':
      return 'Kein Mikrofon gefunden.';
    case 'unsupported':
      return 'Dieser Browser kann hier nicht zuhören. Nutze das Mikrofon auf deiner Tastatur zum Diktieren.';
    default:
      return 'Das hat nicht geklappt. Versuch es nochmal oder diktiere mit der Tastatur.';
  }
}

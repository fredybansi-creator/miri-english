// Speech: recognition (Safari webkitSpeechRecognition) and text-to-speech.
import { getState } from './store.js';

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

export function say(text, { rate } = {}) {
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

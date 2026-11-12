// Records Miri's voice and turns it into text on the server (Edge Function "transcribe", Gemini).
// Same method that passed the mic test 10/10 on the iPhone (mic-test.html):
// MediaRecorder → 16 kHz mono WAV in the browser → base64 → server → exact text (mistakes kept).

import { log } from './store.js';

const URL_ = 'https://aagbnrcsprmhcwllfmcn.supabase.co/functions/v1/transcribe';
const MAX_MS = 60000;

let stream = null, ctx = null;

function pickMime() {
  if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
  for (const m of ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return '';
}

export const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

// A fresh mic stream for every recording, released right after it. On the iPhone a stream that stays
// open goes silent after Raluca's voice has played a few times (recordings came back empty: "zu kurz").
async function openMic() {
  releaseMic();
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  return stream;
}
export function releaseMic() {
  if (stream) { stream.getTracks().forEach((t) => { try { t.stop(); } catch { /* ignore */ } }); stream = null; }
}

/**
 * Start recording. Returns { stop(): Promise<{ text, error, ms }>, cancel() } or throws with a German message.
 * onTick(seconds) is called while recording; recording stops by itself after 60 s.
 */
export async function startRecording(onTick, onAutoStop) {
  try {
    if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; ctx = new AC(); }
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    await openMic();
  } catch (e) {
    log('Mikro-Fehler: ' + (e && e.name) + ' ' + (e && e.message));
    throw new Error(e && e.name === 'NotAllowedError'
      ? 'Das Mikro ist nicht erlaubt. In Safari: aA → Website-Einstellungen → Mikrofon → Erlauben. Dann Seite neu laden.'
      : 'Das Mikro konnte nicht gestartet werden.');
  }
  const track = stream.getAudioTracks()[0];
  const mime = pickMime();
  const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (ev) => { if (ev.data && ev.data.size) chunks.push(ev.data); };
  const stopped = new Promise((resolve) => { rec.onstop = resolve; });
  rec.start(500);
  const startedAt = Date.now();
  log(`Aufnahme gestartet (${rec.mimeType || mime || 'Standard'}; Mikro ${track ? track.readyState + (track.muted ? ', stumm' : '') : 'fehlt'})`);
  let cancelled = false;
  const timer = setInterval(() => {
    const ms = Date.now() - startedAt;
    onTick && onTick(Math.floor(ms / 1000));
    if (ms > MAX_MS) onAutoStop && onAutoStop();
  }, 250);

  function halt() {
    clearInterval(timer);
    if (rec.state !== 'inactive') { try { rec.requestData(); } catch { /* ignore */ } rec.stop(); }
  }

  return {
    cancel() { cancelled = true; halt(); stopped.then(releaseMic); },
    async stop() {
      halt();
      await stopped;
      const durMs = Date.now() - startedAt;
      const muted = track && track.muted;
      releaseMic();
      if (cancelled) return { text: '', error: 'cancelled' };
      const type = rec.mimeType || (chunks[0] && chunks[0].type) || 'audio/mp4';
      const blob = new Blob(chunks, { type });
      log(`Aufnahme: ${(durMs / 1000).toFixed(1)} s, ${blob.size} Bytes in ${chunks.length} Teilen${muted ? ', Mikro war stumm' : ''}`);
      if (durMs < 600) return { text: '', error: 'Das war zu kurz. Tippe auf das Mikro und sprich etwas länger.' };
      if (blob.size < 1000) return { text: '', error: 'Das Mikro hat nichts aufgenommen. Bitte noch einmal versuchen.' };
      return transcribe(blob, type);
    },
  };
}

async function transcribe(blob, type) {
  let payload;
  try {
    const wav = await toWav16k(blob);
    payload = { audio: await b64(wav), mime: 'audio/wav' };
  } catch (e) {
    log('WAV-Umwandlung ging nicht (' + (e && e.message) + '), sende Original');
    payload = { audio: await b64(blob), mime: type.split(';')[0] };
  }
  const t0 = Date.now();
  let data = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(URL_, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined,
      });
      data = await res.json().catch(() => ({ error: 'bad_response' }));
      if (res.ok || res.status < 500) break;
      log(`Server-Fehler ${res.status}: ${data.detail || data.error}`);
    } catch (e) {
      log('Netzwerk-Fehler: ' + (e && e.message));
      data = { error: 'network' };
    }
  }
  const ms = Date.now() - t0;
  if (data && data.ok) {
    log(`Text nach ${(ms / 1000).toFixed(1)} s: "${data.text}"`);
    return { text: data.text || '', ms, error: data.text ? '' : 'Ich habe nichts verstanden. Bitte noch einmal, etwas näher am Handy.' };
  }
  log('Fehler: ' + JSON.stringify(data));
  return {
    text: '', ms,
    error: data && data.error === 'network'
      ? 'Keine Internetverbindung? Bitte noch einmal versuchen.'
      : 'Der Server hatte ein Problem. Bitte noch einmal versuchen.',
  };
}

async function toWav16k(blob) {
  const buf = await blob.arrayBuffer();
  const decoded = await new Promise((resolve, reject) => {
    const p = ctx.decodeAudioData(buf, resolve, reject);
    if (p && p.then) p.then(resolve, reject);
  });
  const rate = 16000;
  const len = Math.max(1, Math.ceil(decoded.duration * rate));
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const off = new OAC(1, len, rate);
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination);
  src.start(0);
  const out = await new Promise((resolve, reject) => {
    off.oncomplete = (e) => resolve(e.renderedBuffer);
    const p = off.startRendering();
    if (p && p.then) p.then(resolve, reject);
  });
  const pcm = out.getChannelData(0);
  const view = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const w = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); view.setUint32(4, 36 + pcm.length * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  w(36, 'data'); view.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) { const s = Math.max(-1, Math.min(1, pcm[i])); view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); }
  return new Blob([view], { type: 'audio/wav' });
}

async function b64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

// Real conversation with an AI friend ("Sam"): he reacts to what she says and keeps asking,
// she answers out loud. No interruptions – feedback on the whole conversation at the end.
import { $, esc, icon, playBtn } from './ui.js';
import { shell, summary } from './sessions.js';
import { canListen, listen, errorMessage, say, stopSpeaking } from './speech.js';
import { chatReply, chatReview } from './ai.js';
import { addMistakeCards } from './speak.js';
import { foxSVG, setFoxState } from './fox.js';
import { getState, save, today, day, markTask, addTime } from './store.js';

const MAX_TURNS = 5;

export function scenarioFor(lesson) {
  const words = (lesson.free?.useWords || []).join(', ');
  return `Two friends chatting. Topic of Miri's last lesson: "${lesson.title}" – ${lesson.goal} (German description). `
    + `Sam opened with: "${lesson.free?.they}". Phrases she practised: ${words}.`;
}

/**
 * @param lesson    the lesson whose topic the chat is about (needs lesson.free.they as opener)
 * @param onFallback called if the AI friend can't be reached at the start (→ scripted conversation)
 */
export function startChat({ lesson, onExit, onFallback }) {
  const started = Date.now();
  const scenario = scenarioFor(lesson);
  const history = [{ who: 'sam', text: lesson.free.they }];
  let mode = canListen ? 'mic' : 'type';
  let session = null;
  let busy = false;
  let finished = false;
  let notice = canListen ? '' : errorMessage('unsupported');

  const ui = shell({ onClose: () => { cleanup(); onExit(); } });
  const miriTurns = () => history.filter((h) => h.who === 'miri').length;

  // Sam the fox sits on top and reacts: talking while his line is read, thinking while he writes,
  // listening while she speaks.
  ui.body.innerHTML = `<div class="fox-stage">${foxSVG()}</div><div class="chat-main" data-chat></div>`;
  const stage = $('.fox-stage', ui.body);
  const main = $('[data-chat]', ui.body);
  let foxBase = 'idle';
  const fox = (state) => { foxBase = state; setFoxState(stage, state); };
  const onTts = (e) => {
    if (e.detail.role === 'main') return; // only Sam's own lines
    setFoxState(stage, e.detail.state === 'start' ? 'talking' : foxBase);
  };
  window.addEventListener('tts', onTts);
  let closed = false;
  function cleanup() { closed = true; session?.stop(); stopSpeaking(); window.removeEventListener('tts', onTts); }

  function render() {
    ui.progress(Math.min(miriTurns(), MAX_TURNS - 1), MAX_TURNS);
    const log = history.map((h, i) => (h.who === 'sam'
      ? `<div class="msg sam"><span class="bubble-who">Sam 🦊</span>
           <div class="row" style="gap:8px;align-items:flex-start">${playBtn(h.text, '', i === 0 ? 'friend' : 'coach')}<p>${esc(h.text)}</p></div></div>`
      : `<div class="msg miri"><p>${esc(h.text)}</p></div>`)).join('');
    const typing = busy ? '<div class="msg sam typing"><span></span><span></span><span></span></div>' : '';

    const input = finished
      ? `<div class="session-foot">
           <button class="btn btn-block" data-act="review">Feedback zum Gespräch</button>
         </div>`
      : mode === 'mic'
        ? `<div class="chat-input">
             <div class="live" data-live>${notice ? `<span class="small">${esc(notice)}</span>` : ''}</div>
             <button class="mic" data-act="mic" ${busy ? 'disabled' : ''} aria-label="Antworten">${icon.mic}</button>
             <div class="mic-label" data-label>${busy ? 'Sam schreibt …' : 'Tippen und antworten'}</div>
           </div>`
        : `<div class="chat-input">
             <textarea class="type-area" data-text rows="2" placeholder="Tippe – oder nutze das 🎤 der Tastatur." ${busy ? 'disabled' : ''}></textarea>
             <button class="btn btn-block" data-act="send" ${busy ? 'disabled' : ''} style="margin-top:8px">Senden</button>
           </div>`;

    main.innerHTML = `
      <div class="kicker" style="text-align:center">💬 Plaudern mit Sam · ${esc(lesson.title)}</div>
      <p class="small muted" style="text-align:center">Antworte so ausführlich du kannst – Sam fragt nach. Korrekturen gibt’s erst am Ende.</p>
      <div class="chatlog" data-log>${log}${typing}</div>
      <div class="grow"></div>
      ${input}
      ${finished ? '' : `<div class="links session-foot">
        ${mode === 'mic' ? '<button class="btn btn-ghost btn-sm" data-act="type">⌨️ Tippen</button>' : (canListen ? '<button class="btn btn-ghost btn-sm" data-act="micmode">🎤 Sprechen</button>' : '')}
        ${miriTurns() >= 2 ? '<button class="btn btn-ghost btn-sm" data-act="end">Gespräch beenden</button>' : ''}
      </div>`}`;

    const logEl = $('[data-log]', ui.body);
    logEl.lastElementChild?.scrollIntoView({ block: 'end' });

    $('[data-act="mic"]', ui.body)?.addEventListener('click', toggleMic);
    $('[data-act="send"]', ui.body)?.addEventListener('click', () => {
      const t = $('[data-text]', ui.body).value.trim();
      if (t) answer(t);
    });
    $('[data-act="type"]', ui.body)?.addEventListener('click', () => { session?.stop(); mode = 'type'; render(); });
    $('[data-act="micmode"]', ui.body)?.addEventListener('click', () => { mode = 'mic'; notice = ''; render(); });
    $('[data-act="end"]', ui.body)?.addEventListener('click', () => { finished = true; render(); });
    $('[data-act="review"]', ui.body)?.addEventListener('click', review);
  }

  function toggleMic() {
    if (busy) return;
    if (session) { session.stop(); return; }
    const btn = $('[data-act="mic"]', ui.body);
    const live = $('[data-live]', ui.body);
    btn.classList.add('listening');
    btn.innerHTML = icon.stop;
    stopSpeaking();
    fox('listening');
    $('[data-label]', ui.body).textContent = 'Ich höre zu … tippe zum Beenden';
    live.textContent = '';
    // throttle live-text updates (each update re-lays out the page)
    let pending = '', raf = 0;
    const current = listen({ onInterim: (t) => {
      pending = t;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; live.textContent = pending ? `„${pending}“` : ''; });
    } });
    session = current;
    const safety = setTimeout(() => current.stop(), 45000);
    current.promise
      .then((r) => answer(r.text))
      .catch((err) => {
        fox('idle');
        if (err.code === 'aborted') return;
        notice = errorMessage(err.code);
        if (['not-allowed', 'service-not-allowed', 'unsupported', 'audio-capture', 'start-failed'].includes(err.code)) mode = 'type';
        render();
      })
      .finally(() => { clearTimeout(safety); if (session === current) session = null; });
  }

  async function answer(text) {
    notice = '';
    history.push({ who: 'miri', text });
    busy = true;
    fox('thinking');
    render();
    try {
      const { reply, done } = await chatReply(scenario, history);
      history.push({ who: 'sam', text: reply });
      busy = false;
      if (done || miriTurns() >= MAX_TURNS) finished = true;
      fox(finished ? 'happy' : 'idle');
      render();
      // iPhone: going straight from speech recognition to speech output can hang Safari –
      // give the audio system a moment to switch back before Sam talks.
      setTimeout(() => {
        if (!closed) { try { say(reply, { role: 'coach' }); } catch { /* ignore */ } }
      }, 700);
    } catch {
      busy = false;
      fox('idle');
      if (miriTurns() <= 1 && onFallback) { cleanup(); onFallback(); return; }
      notice = 'Sam ist gerade nicht erreichbar. Du kannst das Gespräch beenden und Feedback holen.';
      finished = miriTurns() >= 2;
      if (!finished) history.pop(); // let her try again
      render();
    }
  }

  async function review() {
    ui.hideTop();
    stopSpeaking();
    fox('thinking');
    main.innerHTML = `<div class="center" style="margin-top:12px">
      <p class="coach-wait" style="justify-content:center"><span class="dots"></span> Sam und dein Coach schauen sich das Gespräch an …</p></div>`;
    const turns = miriTurns();
    let fb = null;
    try { fb = await chatReview(scenario, history); } catch { /* show summary without feedback */ }

    const s = getState();
    const id = `chat-${lesson.id}`;
    const prev = s.speaking[id] || { best: 0, count: 0, last: null };
    const score = fb ? { great: 1, good: 0.7, try: 0.3 }[fb.level] : 0.5;
    s.speaking[id] = { best: Math.max(prev.best, score), count: prev.count + 1, last: today() };
    day().spoken += turns;
    save();
    if (fb) addMistakeCards(fb.fixes, id);
    markTask('speaking');
    addTime((Date.now() - started) / 1000);

    if (!fb) {
      cleanup();
      summary(ui.body, { emoji: '🗣️', title: 'Gut gesprochen!', text: `Du hast ${turns} Mal geantwortet. (Feedback ist gerade nicht verfügbar.)`, onDone: onExit });
      return;
    }
    fox('happy');
    const title = { great: 'Super Gespräch! 🎉', good: 'Gutes Gespräch! 👍', try: 'Guter Anfang! 💪' }[fb.level];
    main.innerHTML = `
      <div class="kicker">💬 Feedback zum Gespräch</div>
      <div class="result-box ${fb.level}">
        <h3>${title}</h3>
        ${fb.praise ? `<p style="margin-top:4px">${esc(fb.praise)}</p>` : ''}
        ${fb.fixes.length ? `
          <p class="small muted" style="margin-top:14px">Das kannst du nächstes Mal besser sagen:</p>
          <ul class="fixes">${fb.fixes.map((f) => `<li><div><s>${esc(f.wrong)}</s> → <b>${esc(f.better)}</b></div>${f.why ? `<span>${esc(f.why)}</span>` : ''}</li>`).join('')}</ul>
          <p class="small muted" style="margin-top:8px">📌 Diese Fehler kommen als Karteikarten wieder („Meine Fehler“).</p>` : '<p class="small" style="margin-top:12px">✅ Keine echten Fehler – stark!</p>'}
        ${fb.betterWords.length ? `<div class="better"><b class="small">Damit klingst du noch natürlicher:</b>
          <div class="better-words">${fb.betterWords.map((w) => `<span>${esc(w)}</span>`).join('')}</div></div>` : ''}
        ${fb.levelUp ? `<div class="levelup"><div class="levelup-label">⬆️ Deine längste Antwort – noch natürlicher</div>
          <div class="answer-line">${playBtn(fb.levelUp, '', 'coach')}<p>${esc(fb.levelUp)}</p></div></div>` : ''}
        ${fb.tip ? `<p class="note"><span>💡</span><span>${esc(fb.tip)}</span></p>` : ''}
      </div>
      <div class="grow"></div>
      <div class="session-foot"><button class="btn btn-block" data-done>Fertig</button></div>`;
    $('[data-done]', ui.body).addEventListener('click', () => { cleanup(); onExit(); });
  }

  render();
  say(lesson.free.they, { role: 'friend' }); // fixed opener → cached natural voice
}

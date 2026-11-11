// Endless conversation with Raluca the fox. She reacts to what Miri says and keeps asking; every message
// she sends gets a short correction right below it. The conversation is saved automatically – next
// time she continues where she stopped, or starts a new one.
import { $, esc, icon, playBtn } from './ui.js';
import { shell } from './sessions.js';
import { canListen, listen, errorMessage, say, stopSpeaking, micLog } from './speech.js';
import { chatReply, chatFix, translateLine } from './ai.js';
import { addMistakeCards } from './speak.js';
import { markAnswer, tokens } from './check.js';
import { foxSVG, setFoxState } from './fox.js';
import { LESSONS, findLesson } from '../content/index.js';
import { getState, save, today, day, markTask, addTime } from './store.js';

const DAILY_GOAL = 3;       // her messages per day that complete the "Plaudern" task
const HISTORY_FOR_AI = 60;  // last lines Raluca sees (older lines of Miri's go along as "facts")
const ARCHIVE_SIZE = 10;

export function scenarioFor(lesson) {
  const words = (lesson.free?.useWords || []).join(', ');
  return `Two friends chatting. Start topic from Miri's lesson: "${lesson.title}" – ${lesson.goal} (German description). `
    + `Raluca opened with: "${lesson.free?.they}". Phrases she practised: ${words}. The chat can move on to other everyday topics.`;
}

function newChat(lesson) {
  return { id: `c${Date.now().toString(36)}`, lessonId: lesson.id, started: today(), msgs: [{ who: 'sam', text: lesson.free.they }] };
}

/** Saved chat, or a new one about `pickLesson()`'s topic. */
function currentChat(pickLesson) {
  const s = getState();
  if (!s.chat || !findLesson(s.chat.lessonId)) { s.chat = newChat(pickLesson()); save(); }
  // corrections that were still running when the app was closed
  for (const m of s.chat.msgs) if (m.fix === 'pending') m.fix = 'error';
  return s.chat;
}

function archive(chat) {
  const s = getState();
  if (!chat.msgs.some((m) => m.who === 'miri')) return;
  s.chatArchive = [{ ...chat, ended: today() }, ...(s.chatArchive || [])].slice(0, ARCHIVE_SIZE);
}

/**
 * @param pickLesson () => lesson – topic for a new conversation
 */
export function startChat({ pickLesson, onExit }) {
  const started = Date.now();
  let chat = currentChat(pickLesson);
  let lesson = findLesson(chat.lessonId) || LESSONS[0];
  let scenario = scenarioFor(lesson);

  let mode = canListen ? 'mic' : 'type';
  let session = null;
  let waiting = false;   // Raluca is writing
  let speaking = false;  // Raluca is talking
  let notice = canListen ? '' : errorMessage('unsupported');
  let closed = false;
  // Hands-free (like a voice call): after Raluca has finished talking, the mic opens by itself.
  // micDeaf: the mic opened by itself but heard nothing (happens on iPhone after Raluca talked) →
  // she taps the mic herself for the rest of this chat; a tap always works.
  let micDeaf = false;
  const handsFree = () => canListen && mode === 'mic' && !micDeaf && getState().settings.handsFree !== false;

  const ui = shell({ onClose: leave, confirm: false });
  ui.body.innerHTML = `<div class="fox-stage">${foxSVG()}</div><div class="chat-main" data-chat></div>`;
  const stage = $('.fox-stage', ui.body);
  const main = $('[data-chat]', ui.body);
  let foxBase = 'idle';
  const fox = (state) => { foxBase = state; setFoxState(stage, state); };
  const onTts = (e) => {
    if (e.detail.role === 'main') return; // only Raluca's own lines
    setFoxState(stage, e.detail.state === 'start' ? 'talking' : foxBase);
  };
  window.addEventListener('tts', onTts);

  // Leaving must always work, even if the mic is still on: throw away what was heard and close.
  function cleanup() {
    if (closed) return false;
    closed = true;
    session?.abort();
    session = null;
    stopSpeaking();
    window.removeEventListener('tts', onTts);
    window.removeEventListener('hashchange', onRouteChange);
    document.removeEventListener('visibilitychange', onHidden);
    window.removeEventListener('pagehide', onHidden);
    addTime((Date.now() - started) / 1000);
    return true;
  }
  function leave() {
    if (cleanup()) onExit();
  }
  // Navigated away some other way (e.g. back gesture) → switch the mic off.
  function onRouteChange() {
    if (location.hash !== '#/speak') cleanup();
  }
  // App sent to the background → switch the mic off (iPhone keeps it on otherwise).
  function onHidden(e) {
    if (e.type === 'pagehide' || document.visibilityState === 'hidden') {
      if (session) { session.abort(); session = null; if (!closed) render(); }
      stopSpeaking();
    }
  }
  window.addEventListener('hashchange', onRouteChange);
  document.addEventListener('visibilitychange', onHidden);
  window.addEventListener('pagehide', onHidden);

  const myCount = () => chat.msgs.filter((m) => m.who === 'miri').length;
  const lastSamBefore = (i) => { for (let j = i - 1; j >= 0; j--) if (chat.msgs[j].who === 'sam') return chat.msgs[j].text; return ''; };

  function fixHtml(m) {
    const f = m.fix;
    if (!f) return '';
    if (f === 'pending') return '<div class="msg-fix pending"><span class="dots"></span> wird geprüft …</div>';
    if (f === 'error') return '';
    if (f.correct || !f.fixes.length) return '<div class="msg-fix ok">✓ Passt so!</div>';
    const corrected = markAnswer(f.corrected, tokens(m.text))
      .map((x) => (x.said ? esc(x.word) : `<mark class="miss">${esc(x.word)}</mark>`)).join(' ');
    return `
      <div class="msg-fix bad">
        <div class="msg-fix-label">Besser so:</div>
        <div class="row" style="gap:8px;align-items:flex-start">${playBtn(f.corrected, '', 'coach')}<p>${corrected}</p></div>
        <ul class="fixes">${f.fixes.map((x) => `<li><div><s>${esc(x.wrong)}</s> → <b>${esc(x.better)}</b></div>${x.why ? `<span>${esc(x.why)}</span>` : ''}</li>`).join('')}</ul>
        ${f.tip ? `<p class="small muted" style="margin-top:6px">💡 ${esc(f.tip)}</p>` : ''}
      </div>`;
  }

  function render() {
    const n = myCount();
    ui.progress(Math.min(day().chatMsgs || 0, DAILY_GOAL), DAILY_GOAL);
    const log = chat.msgs.map((m, i) => (m.who === 'sam'
      ? `<div class="msg sam"><span class="bubble-who">Raluca 🦊</span>
           <div class="row" style="gap:8px;align-items:flex-start">${playBtn(m.text, '', 'sam')}<p>${esc(m.text)}</p></div>
           ${m.de ? `<p class="msg-de">🇩🇪 ${esc(m.de)}</p>` : `<button class="msg-de-btn" data-de="${i}">🇩🇪 Auf Deutsch?</button>`}</div>`
      : `<div class="msg miri"><p>${esc(m.text)}</p></div>${fixHtml(m)}`)).join('');
    const typing = waiting ? '<div class="msg sam typing"><span></span><span></span><span></span></div>' : '';
    const needsReply = !waiting && chat.msgs[chat.msgs.length - 1]?.who === 'miri';

    const label = waiting ? 'Raluca schreibt …' : speaking ? 'Raluca spricht …' : handsFree() ? 'Freihändig – sprich einfach los, wenn das Mikro leuchtet' : 'Tippen und antworten';
    const input = mode === 'mic'
      ? `<div class="chat-input">
           <div class="live" data-live>${notice ? `<span class="small">${esc(notice)}</span>` : ''}</div>
           <button class="mic" data-act="mic" ${waiting ? 'disabled' : ''} aria-label="Antworten">${icon.mic}</button>
           <div class="mic-label" data-label>${label}</div>
         </div>`
      : `<div class="chat-input">
           ${notice ? `<p class="small muted">${esc(notice)}</p>` : ''}
           <textarea class="type-area" data-text rows="2" placeholder="Tippe – oder nutze das 🎤 der Tastatur." ${waiting ? 'disabled' : ''}></textarea>
           <button class="btn btn-block" data-act="send" ${waiting ? 'disabled' : ''} style="margin-top:8px">Senden</button>
         </div>`;

    main.innerHTML = `
      <div class="chat-head">
        <div class="kicker" style="margin:0">💬 Plaudern mit Raluca</div>
        <button class="btn btn-ghost btn-sm" data-act="new">＋ Neues Gespräch</button>
      </div>
      <p class="small muted" style="text-align:center">${n ? `${n} ${n === 1 ? 'Nachricht' : 'Nachrichten'} · ` : ''}Erzähl so viel du magst – du kannst jederzeit aufhören, alles wird gespeichert.</p>
      <div class="chatlog" data-log>${log}${typing}</div>
      ${needsReply ? '<button class="btn btn-soft btn-sm" data-act="retry" style="align-self:flex-start;margin-top:8px">🔄 Raluca antworten lassen</button>' : ''}
      <div class="grow"></div>
      ${input}
      <div class="links session-foot">
        ${mode === 'mic' ? `<button class="btn btn-ghost btn-sm" data-act="hands">${getState().settings.handsFree !== false ? '🎧 Freihändig: An' : '🎧 Freihändig: Aus'}</button>` : ''}
        ${mode === 'mic' ? '<button class="btn btn-ghost btn-sm" data-act="type">⌨️ Tippen</button>' : (canListen ? '<button class="btn btn-ghost btn-sm" data-act="micmode">🎤 Sprechen</button>' : '')}
      </div>`;

    $('[data-log]', main).lastElementChild?.scrollIntoView({ block: 'end' });
    $('[data-act="mic"]', main)?.addEventListener('click', toggleMic);
    $('[data-act="send"]', main)?.addEventListener('click', () => {
      const t = $('[data-text]', main).value.trim();
      if (t) send(t);
    });
    $('[data-act="type"]', main)?.addEventListener('click', () => { session?.stop(); mode = 'type'; render(); });
    $('[data-act="micmode"]', main)?.addEventListener('click', () => { mode = 'mic'; notice = ''; render(); });
    $('[data-act="retry"]', main)?.addEventListener('click', askSam);
    // she doesn't understand Raluca → German translation under the bubble
    main.querySelectorAll('[data-de]').forEach((b) => b.addEventListener('click', async () => {
      const m = chat.msgs[+b.dataset.de];
      b.disabled = true;
      b.textContent = '🇩🇪 …';
      try {
        m.de = await translateLine(m.text);
        save();
      } catch {
        b.textContent = '🇩🇪 Gerade nicht möglich';
        return;
      }
      if (!closed) render();
    }));
    $('[data-act="hands"]', main)?.addEventListener('click', () => {
      const s = getState();
      s.settings.handsFree = s.settings.handsFree === false;
      save();
      if (!s.settings.handsFree) session?.stop();
      render();
    });
    $('[data-act="new"]', main)?.addEventListener('click', startNew);
  }

  function startNew() {
    if (myCount() && !window.confirm('Neues Gespräch mit Raluca beginnen? Das jetzige wird gespeichert.')) return;
    session?.stop();
    stopSpeaking();
    archive(chat);
    const s = getState();
    // next topic: a different finished lesson if possible
    let next = pickLesson();
    if (next.id === chat.lessonId) {
      const done = LESSONS.filter((l) => s.lessons[l.id]?.done && l.free && l.id !== chat.lessonId);
      if (done.length) next = done[Math.floor(Math.random() * done.length)];
    }
    chat = s.chat = newChat(next);
    lesson = next;
    scenario = scenarioFor(lesson);
    save();
    fox('happy');
    render();
    samSays(lesson.free.they);
  }

  // She is done talking: show at once that the mic is off – iPhone can take a moment to hand over the text.
  function finishTalking() {
    if (!session || session.stopping) return;
    session.stopping = true;
    session.stop();
    const btn = $('[data-act="mic"]', main);
    if (btn) { btn.classList.remove('listening'); btn.innerHTML = icon.mic; }
    const label = $('[data-label]', main);
    if (label) label.textContent = 'Mikro aus …';
    $('[data-act="done"]', main)?.remove();
    fox('idle');
  }

  function toggleMic() {
    if (waiting) return;
    if (session) { finishTalking(); return; }
    startListening();
  }

  // Raluca has finished talking → open the mic by itself (hands-free).
  function autoListen() {
    if (closed || !handsFree() || session || waiting) return;
    setTimeout(() => { if (!closed && handsFree() && !session && !waiting && !speaking) startListening(true); }, 900);
  }

  // Speak one of Raluca's lines; afterwards the mic opens again in hands-free mode.
  function samSays(text, delay = 0) {
    setTimeout(() => {
      if (closed) return;
      speaking = true;
      render();
      Promise.resolve(say(text, { role: 'sam' })).catch(() => {}).finally(() => {
        speaking = false;
        if (closed) return;
        render();
        autoListen();
      });
    }, delay);
  }

  function startListening(auto = false) {
    micLog(`chat: mic ${auto ? 'opens by itself' : 'tapped'}`);
    const btn = $('[data-act="mic"]', main);
    if (!btn) return;
    const live = $('[data-live]', main);
    btn.classList.add('listening');
    btn.innerHTML = icon.stop;
    stopSpeaking();
    fox('listening');
    $('[data-label]', main).textContent = 'Ich höre zu – nimm dir ruhig Zeit zum Nachdenken.';
    live.textContent = '';
    const done = document.createElement('button');
    done.className = 'btn btn-done';
    done.dataset.act = 'done';
    done.textContent = '✓ Fertig';
    done.addEventListener('click', finishTalking);
    btn.after(done);
    // throttle live-text updates (each update re-lays out the page)
    let pending = '', raf = 0;
    // Hands-free: after she has said something and then is quiet for a while, send it by itself
    // (long enough to think in the middle of a sentence). Tap-to-talk waits for "Fertig".
    const free = handsFree();
    if (free) $('[data-label]', main).textContent = 'Ich höre zu – nach einer längeren Pause schicke ich es ab (oder tippe „Fertig“).';
    let quiet = 0;
    let heard = false;
    // Mic on but no words at all after 12 s: on iPhone the mic can stay "deaf" after Raluca's voice.
    // Stop it and ask her to tap the mic (a tap starts it reliably).
    const deaf = setTimeout(() => {
      if (session !== current || heard) return;
      micLog(`no words after 12 s (${auto ? 'opened by itself' : 'after a tap'})`);
      if (auto) micDeaf = true;
      notice = 'Ich habe nichts gehört 🤔 Tippe aufs Mikro und sprich dann.';
      current.stopping = true;
      current.abort();
    }, 12000);
    // keeps listening through pauses until she taps "Fertig"
    const current = listen({ untilStopped: true, onInterim: (t) => {
      pending = t;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; live.textContent = pending ? `„${pending}“` : ''; });
      if (t.trim()) heard = true;
      if (free && t.trim()) { clearTimeout(quiet); quiet = setTimeout(() => { if (session === current) finishTalking(); }, 3500); }
    } });
    session = current;
    const safety = setTimeout(() => { if (session === current) finishTalking(); }, 120000);
    current.promise
      .then((r) => { if (!closed) send(r.text); })
      .catch((err) => {
        if (closed) return;
        fox('idle');
        if (err.code === 'aborted') { render(); return; }
        if (auto && ['not-allowed', 'service-not-allowed', 'start-failed'].includes(err.code)) {
          // iPhone didn't allow opening the mic without a tap → fall back to tap-to-talk
          getState().settings.handsFree = false;
          save();
          notice = 'Dein iPhone lässt das Mikro nicht von allein starten – tippe einfach aufs Mikro zum Antworten.';
        } else if (err.code === 'no-speech') {
          notice = 'Ich habe nichts gehört – tippe aufs Mikro, wenn du weiterreden willst.';
        } else {
          notice = errorMessage(err.code);
          if (['not-allowed', 'service-not-allowed', 'unsupported', 'audio-capture', 'start-failed'].includes(err.code)) mode = 'type';
        }
        render();
      })
      .finally(() => {
        clearTimeout(safety);
        clearTimeout(quiet);
        clearTimeout(deaf);
        if (session === current) session = null;
        // stopped without a result (e.g. after a tap on stop) → make sure the button is back to normal
        if (!closed && !waiting) {
          const btn = $('[data-act="mic"]', main);
          if (btn?.classList.contains('listening') || current.stopping || $('[data-act="done"]', main)) render();
        }
      });
  }

  function send(text) {
    if (closed) return;
    notice = '';
    const msg = { who: 'miri', text, fix: 'pending' };
    chat.msgs.push(msg);
    if (chat.msgs.length > 200) chat.msgs.splice(0, chat.msgs.length - 200); // keep the backup small
    const index = chat.msgs.indexOf(msg);
    const d = day();
    d.chatMsgs = (d.chatMsgs || 0) + 1;
    d.spoken++;
    save();
    if (d.chatMsgs >= DAILY_GOAL && !d.speaking) markTask('speaking');

    // correction for this message (runs in parallel with Raluca's reply)
    chatFix(lastSamBefore(index), text)
      .then((f) => {
        msg.fix = f;
        if (!f.correct && f.fixes.length) addMistakeCards(f.fixes, `chat-${lesson.id}`); // saves
        else save();
      })
      .catch(() => { msg.fix = 'error'; save(); })
      .finally(() => { if (!closed) render(); });

    askSam();
  }

  async function askSam() {
    waiting = true;
    fox('thinking');
    render();
    try {
      const history = chat.msgs.slice(-HISTORY_FOR_AI).map((m) => ({ who: m.who, text: m.text }));
      // so Raluca doesn't forget what Miri told her long ago in a long chat
      const facts = chat.msgs.slice(0, -HISTORY_FOR_AI).filter((m) => m.who === 'miri').map((m) => m.text).slice(-30);
      const { reply } = await chatReply(scenario, history, facts);
      chat.msgs.push({ who: 'sam', text: reply });
      save();
      waiting = false;
      fox('idle');
      if (closed) return;
      render();
      // iPhone: going straight from speech recognition to speech output can hang Safari –
      // give the audio system a moment to switch back before Raluca talks.
      samSays(reply, 700);
    } catch {
      waiting = false;
      fox('idle');
      notice = 'Raluca ist gerade nicht erreichbar – tippe gleich auf „Raluca antworten lassen“.';
      if (!closed) render();
    }
  }

  render();
  // a brand-new chat: Raluca says hello (then the mic opens); a continued chat starts quietly
  if (!chat.msgs.some((m) => m.who === 'miri')) samSays(chat.msgs[0].text);
}

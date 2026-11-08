// Voice translation exercise: German sentence → she says it in English → friendly feedback.
import { esc, icon, playBtn, shuffle } from './ui.js';
import { canListen, listen, errorMessage, say } from './speech.js';
import { checkAnswer, markAnswer, tokens } from './check.js';
import { getState, save, today, day } from './store.js';
import { aiFeedback } from './ai.js';

const AI_SCORE = { great: 1, good: 0.7, try: 0.3 };

const TITLES = {
  great: ['Super! 🎉', 'Perfekt! 🌟', 'Klingt richtig gut! 🎉', 'Stark! 💪'],
  good: ['Gut verständlich! 👍', 'Man versteht dich – gut! 👍', 'Schon richtig gut! 👍'],
  try: ['Fast! Hör es dir an 👂', 'Guter Versuch! 💪', 'Weiter so – hör mal rein 👂'],
  skip: ['So sagt man es:'],
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function record(item, result) {
  const s = getState();
  const prev = s.speaking[item.id] || { best: 0, count: 0, last: null };
  s.speaking[item.id] = { best: Math.max(prev.best, result.score || 0), count: prev.count + 1, last: today() };
  day().spoken++;
  for (const en of result.missing || []) {
    if (!s.mistakes.some((m) => m.en === en)) s.mistakes.push({ en, sentenceId: item.id, date: today() });
  }
  save();
}

/**
 * Render the exercise into `root` (a flex column). Calls onDone(result) when she taps "Weiter".
 */
export function renderSpeak(root, item, { onDone, kicker, friend = 'Friend' }) {
  let mode = canListen ? 'mic' : 'type';
  let session = null;
  let tries = 0;
  let notice = canListen ? '' : errorMessage('unsupported');
  const label = kicker || (item.they ? 'Antworte auf Englisch' : 'Sag es auf Englisch');

  const hints = shuffle((item.keywords || []).map((g) => g[0]));

  function head(small = false) {
    const bubble = item.they
      ? `<div class="chat">
           <div class="bubble">
             <span class="bubble-who">${esc(friend)}</span>
             <div class="row" style="gap:10px;align-items:flex-start">${playBtn(item.they)}<p>${esc(item.they)}</p></div>
           </div>
         </div>`
      : '';
    return `${bubble}<div class="kicker">${label}</div>
      <p class="q-de ${small || item.de.length > 70 ? 'q-de-sm' : ''}">${esc(item.de)}</p>`;
  }

  function renderPrompt() {
    const hintHtml = hints.length
      ? `<div class="hint-words hidden" data-hints>${hints.map((h) => `<span class="chip">${esc(h)}</span>`).join('')}</div>`
      : '';
    const body = mode === 'mic'
      ? `<div class="mic-wrap">
           <button class="mic" data-act="mic" aria-label="Sprechen">${icon.mic}</button>
           <div class="mic-label" data-label>Tippen und auf Englisch sprechen</div>
         </div>
         <div class="live" data-live></div>`
      : `<textarea class="type-area" data-text rows="3" autocapitalize="sentences" autocomplete="off" spellcheck="false"
           placeholder="Tippe hier – oder nutze das 🎤 auf deiner Tastatur und sprich."></textarea>
         <button class="btn btn-block" data-act="check" style="margin-top:12px">Prüfen</button>`;
    root.innerHTML = `${head()}
      ${hintHtml}
      ${body}
      ${notice ? `<p class="small muted" style="margin-top:12px">${esc(notice)}</p>` : ''}
      <div class="grow"></div>
      <div class="links session-foot">
        ${hints.length ? '<button class="btn btn-ghost btn-sm" data-act="hint">💡 Hilfe</button>' : ''}
        ${mode === 'mic'
          ? '<button class="btn btn-ghost btn-sm" data-act="type">⌨️ Tippen / Diktieren</button>'
          : (canListen ? '<button class="btn btn-ghost btn-sm" data-act="micmode">🎤 Sprechen</button>' : '')}
        <button class="btn btn-ghost btn-sm" data-act="skip">Weiß ich nicht</button>
      </div>`;

    root.querySelector('[data-act="hint"]')?.addEventListener('click', (e) => {
      root.querySelector('[data-hints]')?.classList.remove('hidden');
      e.currentTarget.remove();
    });
    root.querySelector('[data-act="type"]')?.addEventListener('click', () => { stopListening(); mode = 'type'; renderPrompt(); root.querySelector('[data-text]')?.focus(); });
    root.querySelector('[data-act="micmode"]')?.addEventListener('click', () => { mode = 'mic'; notice = ''; renderPrompt(); });
    root.querySelector('[data-act="skip"]').addEventListener('click', () => {
      stopListening();
      finalResult = { level: 'skip', score: 0, missing: [] };
      showOffline({ level: 'skip', score: 0, said: '', answer: item.answers[0], missing: [], marked: item.answers[0].split(' ').map((w) => ({ word: w, said: true })) });
    });
    root.querySelector('[data-act="mic"]')?.addEventListener('click', toggleMic);
    const ta = root.querySelector('[data-text]');
    root.querySelector('[data-act="check"]')?.addEventListener('click', () => {
      const text = ta.value.trim();
      if (!text) { ta.focus(); return; }
      evaluate([text]);
    });
  }

  function stopListening() {
    if (session) { session.stop(); session = null; }
  }

  function toggleMic() {
    const btn = root.querySelector('[data-act="mic"]');
    const label = root.querySelector('[data-label]');
    const live = root.querySelector('[data-live]');
    if (session) { session.stop(); return; }

    btn.classList.add('listening');
    btn.innerHTML = icon.stop;
    label.textContent = 'Ich höre zu … tippe zum Beenden';
    live.textContent = '';
    const current = listen({ onInterim: (t) => { live.textContent = t ? `„${t}“` : ''; } });
    session = current;
    const safety = setTimeout(() => current.stop(), 20000);

    current.promise
      .then((res) => { evaluate(res.alternatives.length ? res.alternatives : [res.text]); })
      .catch((err) => {
        if (err.code === 'aborted') return;
        notice = errorMessage(err.code);
        if (['not-allowed', 'service-not-allowed', 'unsupported', 'audio-capture', 'start-failed'].includes(err.code)) mode = 'type';
        renderPrompt();
      })
      .finally(() => { clearTimeout(safety); if (session === current) session = null; });
  }

  let attempt = 0;
  let finalResult = null;

  function evaluate(saidList) {
    tries++;
    const offline = checkAnswer(item, saidList);
    const myAttempt = ++attempt;
    finalResult = offline;
    showOffline(offline, true);

    aiFeedback(item, offline.said)
      .then((ai) => {
        if (myAttempt !== attempt) return; // she already retried
        finalResult = { ...offline, level: ai.level, score: AI_SCORE[ai.level], missing: ai.betterWords, ai };
        record(item, finalResult);
        showAi(offline, ai);
      })
      .catch(() => {
        if (myAttempt !== attempt) return;
        record(item, offline);
        showOffline(offline, false);
      });
  }

  function footer() {
    return `<div class="grow"></div>
      <div class="session-foot">
        <button class="btn btn-block" data-act="next">Weiter</button>
        <button class="btn btn-line btn-block" data-act="retry">${icon.mic} Nochmal sprechen</button>
      </div>`;
  }

  function bindFooter() {
    root.querySelector('[data-act="next"]').addEventListener('click', () => { attempt++; onDone({ ...finalResult, tries }); });
    root.querySelector('[data-act="retry"]').addEventListener('click', () => { attempt++; notice = ''; renderPrompt(); });
  }

  function levelUpHtml(text) {
    return text ? `
      <div class="levelup">
        <div class="levelup-label">⬆️ Level up – so klingst du noch natürlicher</div>
        <div class="answer-line">${playBtn(text)}<p>${esc(text)}</p></div>
      </div>` : '';
  }

  // Offline result (shown instantly; `pending` = AI coach still working).
  function showOffline(result, pending) {
    if (result.level === 'skip') { record(item, result); attempt++; }
    const markedHtml = result.marked
      .map((m) => (m.said ? esc(m.word) : `<mark class="miss">${esc(m.word)}</mark>`))
      .join(' ');
    const hasMarks = result.level !== 'skip' && result.marked.some((m) => !m.said);
    const missing = result.missing.filter(Boolean);

    root.innerHTML = `${head(true)}
      <div class="result-box ${result.level === 'skip' ? 'try' : result.level}">
        <h3>${pick(TITLES[result.level])}</h3>
        ${result.said ? `<p class="result-said" style="margin-top:6px">Du hast gesagt: <q>${esc(result.said)}</q></p>` : ''}
        ${pending ? '<p class="coach-wait"><span class="dots"></span> Dein Coach schaut sich deine Antwort an …</p>' : ''}
        <p class="small muted" style="margin-top:14px">So klingt es natürlich${hasMarks ? ' <span>(markiert = hat bei dir gefehlt)</span>' : ''}:</p>
        <div class="answer-line" style="margin-top:6px">${playBtn(result.answer)}<p>${markedHtml}</p></div>
        ${missing.length && result.level !== 'skip' ? `
          <div class="better">
            <b class="small">Diese Wörter machen deinen Satz noch besser:</b>
            <div class="better-words">${missing.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
          </div>` : ''}
        ${levelUpHtml(item.levelUp)}
        ${item.note ? `<p class="note"><span>💡</span><span>${esc(item.note)}</span></p>` : ''}
      </div>
      ${footer()}`;
    bindFooter();
  }

  // AI coach result: her own sentence corrected, concrete fixes, better words, level up.
  function showAi(offline, ai) {
    const saidTokens = tokens(offline.said);
    const correctedHtml = markAnswer(ai.corrected || offline.answer, saidTokens)
      .map((m) => (m.said ? esc(m.word) : `<mark class="miss">${esc(m.word)}</mark>`))
      .join(' ');
    const changed = ai.corrected && tokens(ai.corrected).join(' ') !== saidTokens.join(' ');

    root.innerHTML = `${head(true)}
      <div class="result-box ${ai.level}">
        <h3>${pick(TITLES[ai.level])}</h3>
        ${ai.praise ? `<p style="margin-top:4px">${esc(ai.praise)}</p>` : ''}
        <p class="result-said" style="margin-top:10px">Du hast gesagt: <q>${esc(offline.said)}</q></p>
        ${changed ? `
          <p class="small muted" style="margin-top:14px">Deine Antwort, korrigiert <span>(markiert = geändert)</span>:</p>
          <div class="answer-line" style="margin-top:6px">${playBtn(ai.corrected)}<p>${correctedHtml}</p></div>` : `
          <p class="small" style="margin-top:12px">✅ Das kann man genau so sagen.</p>`}
        ${ai.fixes.length ? `
          <ul class="fixes">
            ${ai.fixes.map((f) => `<li><div><s>${esc(f.wrong)}</s> → <b>${esc(f.better)}</b></div>${f.why ? `<span>${esc(f.why)}</span>` : ''}</li>`).join('')}
          </ul>` : ''}
        ${ai.betterWords.length ? `
          <div class="better">
            <b class="small">Diese Wörter machen deinen Satz noch besser:</b>
            <div class="better-words">${ai.betterWords.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
          </div>` : ''}
        ${levelUpHtml(ai.levelUp || item.levelUp)}
        ${ai.tip ? `<p class="note"><span>💡</span><span>${esc(ai.tip)}</span></p>` : ''}
        <details class="example-answer">
          <summary>Beispiellösung anzeigen</summary>
          <div class="answer-line" style="margin-top:8px">${playBtn(item.answers[0])}<p>${esc(item.answers[0])}</p></div>
          ${item.note ? `<p class="note"><span>💡</span><span>${esc(item.note)}</span></p>` : ''}
        </details>
      </div>
      ${footer()}`;
    bindFooter();
  }

  renderPrompt();
  // Read the friend's line aloud (works when the exercise was opened by a tap).
  if (item.they) say(item.they);
  return { destroy: stopListening };
}

// Voice translation exercise: German sentence → she says it in English → friendly feedback.
import { esc, icon, playBtn, shuffle } from './ui.js';
import { canListen, listen, errorMessage } from './speech.js';
import { checkAnswer } from './check.js';
import { getState, save, today, day } from './store.js';

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
export function renderSpeak(root, item, { onDone, kicker = 'Sag es auf Englisch' }) {
  let mode = canListen ? 'mic' : 'type';
  let session = null;
  let tries = 0;
  let notice = canListen ? '' : errorMessage('unsupported');

  const hints = shuffle((item.keywords || []).map((g) => g[0]));

  function head(small = false) {
    return `<div class="kicker">${kicker}</div>
      <p class="q-de" ${small ? 'style="font-size:20px"' : ''}>${esc(item.de)}</p>`;
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
      showResult({ level: 'skip', score: 0, said: '', answer: item.answers[0], missing: [], marked: item.answers[0].split(' ').map((w) => ({ word: w, said: true })) });
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

  function evaluate(saidList) {
    tries++;
    const result = checkAnswer(item, saidList);
    showResult(result);
  }

  function showResult(result) {
    record(item, result);
    const markedHtml = result.marked
      .map((m) => (m.said ? esc(m.word) : `<mark class="miss">${esc(m.word)}</mark>`))
      .join(' ');
    const hasMarks = result.level !== 'skip' && result.marked.some((m) => !m.said);
    const missing = result.missing.filter(Boolean);

    root.innerHTML = `${head(true)}
      <div class="result-box ${result.level === 'skip' ? 'try' : result.level}">
        <h3>${pick(TITLES[result.level])}</h3>
        ${result.said ? `<p class="result-said" style="margin-top:6px">Du hast gesagt: <q>${esc(result.said)}</q></p>` : ''}
        <p class="small muted" style="margin-top:14px">So klingt es natürlich${hasMarks ? ' <span>(markiert = hat bei dir gefehlt)</span>' : ''}:</p>
        <div class="answer-line" style="margin-top:6px">${playBtn(result.answer)}<p>${markedHtml}</p></div>
        ${missing.length && result.level !== 'skip' ? `
          <div class="better">
            <b class="small">Diese Wörter machen deinen Satz noch besser:</b>
            <div class="better-words">${missing.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
          </div>` : ''}
        ${item.levelUp ? `
          <div class="levelup">
            <div class="levelup-label">⬆️ Level up – so klingst du noch natürlicher</div>
            <div class="answer-line">${playBtn(item.levelUp)}<p>${esc(item.levelUp)}</p></div>
          </div>` : ''}
        ${item.note ? `<p class="note"><span>💡</span><span>${esc(item.note)}</span></p>` : ''}
      </div>
      <div class="grow"></div>
      <div class="session-foot">
        <button class="btn btn-block" data-act="next">Weiter</button>
        <button class="btn btn-line btn-block" data-act="retry">${icon.mic} Nochmal sprechen</button>
      </div>`;

    root.querySelector('[data-act="next"]').addEventListener('click', () => onDone({ ...result, tries }));
    root.querySelector('[data-act="retry"]').addEventListener('click', () => { notice = ''; renderPrompt(); });
  }

  renderPrompt();
  return { destroy: stopListening };
}

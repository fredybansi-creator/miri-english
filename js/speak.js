// Speaking exercises. One component, three modes:
//   translate (default) – German reply → she says it in English (AI coach + offline check)
//   free                – a friend asks something, she answers freely about her life (AI coach)
//   shadow              – she hears an English sentence and repeats it (offline check only)
import { esc, icon, playBtn, shuffle } from './ui.js';
import { canListen, listen, errorMessage, say, prefetch } from './speech.js';
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
const FREE_TITLES = {
  great: ['Super erzählt! 🎉', 'Klingt richtig natürlich! 🌟'],
  good: ['Gut erzählt! 👍', 'Man versteht dich gut! 👍'],
  try: ['Guter Anfang! Sag noch etwas mehr 💪', 'Versuch, mehr zu erzählen 💪'],
  skip: ['So könnte man antworten:'],
};
const SHADOW_TITLES = {
  great: ['Klingt genau wie das Original! 🎉', 'Perfekt nachgesprochen! 🌟'],
  good: ['Fast genau! 👍', 'Gut nachgesprochen! 👍'],
  try: ['Hör nochmal genau hin 👂', 'Nochmal langsam versuchen 💪'],
  skip: ['Das Original:'],
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function record(item, result) {
  const s = getState();
  const prev = s.speaking[item.id] || { best: 0, count: 0, last: null };
  s.speaking[item.id] = { best: Math.max(prev.best, result.score || 0), count: prev.count + 1, last: today() };
  day().spoken++;
  for (const en of result.missing || []) {
    if (en && !s.mistakes.some((m) => m.en === en)) s.mistakes.push({ en, sentenceId: item.id, date: today() });
  }
  save();
}

const marked = (list) => list.map((m) => (m.said ? esc(m.word) : `<mark class="miss">${esc(m.word)}</mark>`)).join(' ');

/**
 * Render the exercise into `root` (a flex column). Calls onDone(result) when she taps "Weiter".
 */
export function renderSpeak(root, rawItem, { onDone, kicker, friend = 'Friend' }) {
  const kind = rawItem.mode || 'translate';
  const item = {
    ...rawItem,
    answers: rawItem.answers || (kind === 'shadow' ? [rawItem.en] : rawItem.sample ? [rawItem.sample] : []),
    keywords: kind === 'translate' ? rawItem.keywords || [] : [],
  };
  const titles = kind === 'free' ? FREE_TITLES : kind === 'shadow' ? SHADOW_TITLES : TITLES;

  let mode = canListen ? 'mic' : 'type';
  let session = null;
  let tries = 0;
  let notice = canListen ? '' : errorMessage('unsupported');
  const label = kicker || ({ translate: item.they ? 'Antworte auf Englisch' : 'Sag es auf Englisch', free: 'Antworte frei auf Englisch', shadow: 'Hör zu und sprich nach' })[kind];

  const hints = kind === 'translate' ? shuffle(item.keywords.map((g) => g[0])) : [];

  function head(small = false) {
    const bubble = item.they
      ? `<div class="chat">
           <div class="bubble">
             <span class="bubble-who">${esc(friend)}</span>
             <div class="row" style="gap:10px;align-items:flex-start">${playBtn(item.they, '', 'friend')}<p>${esc(item.they)}</p></div>
           </div>
         </div>`
      : '';
    if (kind === 'shadow') {
      return `<div class="kicker">${label}</div>
        <div class="row" style="align-items:flex-start">${playBtn(item.en, 'lg')}
          <div class="grow"><p class="big-en" style="font-size:24px">${esc(item.en)}</p>
          ${item.de ? `<p class="small muted" style="margin-top:6px">${esc(item.de)}</p>` : ''}</div>
        </div>
        ${small ? '' : '<button class="btn btn-ghost btn-sm" data-act="slow" style="margin-top:6px">🐢 Langsamer anhören</button>'}`;
    }
    if (kind === 'free') {
      return `${bubble}<div class="kicker">${label}</div>
        <p class="free-hint">${esc(item.hint || '')}</p>
        ${!small && item.useWords?.length ? `<p class="small muted" style="margin-top:12px">Versuch, diese Ausdrücke zu benutzen:</p>
          <div class="hint-words">${item.useWords.map((w) => `<span class="chip">${esc(w)}</span>`).join('')}</div>` : ''}`;
    }
    return `${bubble}<div class="kicker">${label}</div>
      <p class="q-de ${small || item.de.length > 70 ? 'q-de-sm' : ''}">${esc(item.de)}</p>`;
  }

  function renderPrompt() {
    const hintHtml = hints.length
      ? `<div class="hint-words hidden" data-hints>${hints.map((h) => `<span class="chip">${esc(h)}</span>`).join('')}</div>`
      : '';
    const micLabel = kind === 'shadow' ? 'Tippen und nachsprechen' : 'Tippen und auf Englisch sprechen';
    const body = mode === 'mic'
      ? `<div class="mic-wrap">
           <button class="mic" data-act="mic" aria-label="Sprechen">${icon.mic}</button>
           <div class="mic-label" data-label>${micLabel}</div>
         </div>
         <div class="live" data-live></div>`
      : `<textarea class="type-area" data-text rows="${kind === 'free' ? 5 : 3}" autocapitalize="sentences" autocomplete="off" spellcheck="false"
           placeholder="Tippe hier – oder nutze das 🎤 auf deiner Tastatur und sprich."></textarea>
         <button class="btn btn-block" data-act="check" style="margin-top:12px">Prüfen</button>`;
    const skipLabel = kind === 'free' ? 'Beispiel zeigen' : kind === 'shadow' ? 'Überspringen' : 'Weiß ich nicht';
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
        <button class="btn btn-ghost btn-sm" data-act="skip">${skipLabel}</button>
      </div>`;

    root.querySelector('[data-act="slow"]')?.addEventListener('click', () => say(item.en, { rate: 0.7 }));
    root.querySelector('[data-act="hint"]')?.addEventListener('click', (e) => {
      root.querySelector('[data-hints]')?.classList.remove('hidden');
      e.currentTarget.remove();
    });
    root.querySelector('[data-act="type"]')?.addEventListener('click', () => { stopListening(); mode = 'type'; renderPrompt(); root.querySelector('[data-text]')?.focus(); });
    root.querySelector('[data-act="micmode"]')?.addEventListener('click', () => { mode = 'mic'; notice = ''; renderPrompt(); });
    root.querySelector('[data-act="skip"]').addEventListener('click', () => {
      stopListening();
      const answer = item.answers[0] || '';
      finalResult = { level: 'skip', score: 0, missing: [] };
      showOffline({ level: 'skip', score: 0, said: '', answer, missing: [], marked: answer.split(' ').map((w) => ({ word: w, said: true })) });
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
    const lbl = root.querySelector('[data-label]');
    const live = root.querySelector('[data-live]');
    if (session) { session.stop(); return; }

    btn.classList.add('listening');
    btn.innerHTML = icon.stop;
    lbl.textContent = 'Ich höre zu … tippe zum Beenden';
    live.textContent = '';
    const current = listen({ onInterim: (t) => { live.textContent = t ? `„${t}“` : ''; } });
    session = current;
    const safety = setTimeout(() => current.stop(), kind === 'free' ? 45000 : 20000);

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

  function offlineCheck(saidList) {
    if (kind === 'free') {
      const said = saidList.find(Boolean) || '';
      const words = tokens(said).length;
      const used = (item.useWords || []).filter((w) => tokens(said).join(' ').includes(tokens(w.replace(/…/g, '')).join(' ')));
      const level = words >= 25 ? 'great' : words >= 12 ? 'good' : 'try';
      return { level, score: AI_SCORE[level], said, words, used, answer: item.answers[0] || '', missing: [], marked: [] };
    }
    const r = checkAnswer(item, saidList);
    if (kind === 'shadow') r.missing = [];
    return r;
  }

  function evaluate(saidList) {
    tries++;
    const offline = offlineCheck(saidList);
    const myAttempt = ++attempt;
    finalResult = offline;

    if (kind === 'shadow') { // pronunciation practice: no AI needed
      record(item, offline);
      showOffline(offline, false);
      return;
    }
    showOffline(offline, true);

    aiFeedback(item, offline.said, { mode: kind })
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

  function levelUpHtml(text, labelText = '⬆️ Level up – so klingst du noch natürlicher') {
    return text ? `
      <div class="levelup">
        <div class="levelup-label">${labelText}</div>
        <div class="answer-line">${playBtn(text)}<p>${esc(text)}</p></div>
      </div>` : '';
  }

  const waiting = '<p class="coach-wait"><span class="dots"></span> Dein Coach schaut sich deine Antwort an …</p>';

  // Offline result (shown instantly; `pending` = AI coach still working).
  function showOffline(result, pending) {
    if (result.level === 'skip') { record(item, result); attempt++; }
    const saidHtml = result.said ? `<p class="result-said" style="margin-top:6px">Du hast gesagt: <q>${esc(result.said)}</q></p>` : '';
    let inner;

    if (kind === 'free') {
      inner = `
        ${saidHtml}
        ${pending ? waiting : ''}
        ${result.level !== 'skip' ? `<p class="small" style="margin-top:12px">Du hast <b>${result.words} Wörter</b> gesagt${result.used?.length ? ` und <b>${result.used.map(esc).join(', ')}</b> benutzt 👍` : ''}.</p>` : ''}
        ${levelUpHtml(item.sample, '💬 So könnte eine Antwort klingen')}`;
    } else if (kind === 'shadow') {
      const hasMarks = result.level !== 'skip' && result.marked.some((m) => !m.said);
      inner = `
        ${saidHtml}
        <p class="small muted" style="margin-top:14px">Original${hasMarks ? ' <span>(markiert = hat bei dir gefehlt oder klang anders)</span>' : ''}:</p>
        <div class="answer-line" style="margin-top:6px">${playBtn(item.en)}<p>${marked(result.marked)}</p></div>
        ${hasMarks ? '<p class="note"><span>💡</span><span>Hör dir das Original nochmal an – achte besonders auf die markierten Wörter – und sprich es langsam nach.</span></p>' : ''}`;
    } else {
      const hasMarks = result.level !== 'skip' && result.marked.some((m) => !m.said);
      const missing = result.missing.filter(Boolean);
      inner = `
        ${saidHtml}
        ${pending ? waiting : ''}
        <p class="small muted" style="margin-top:14px">So klingt es natürlich${hasMarks ? ' <span>(markiert = hat bei dir gefehlt)</span>' : ''}:</p>
        <div class="answer-line" style="margin-top:6px">${playBtn(result.answer)}<p>${marked(result.marked)}</p></div>
        ${missing.length && result.level !== 'skip' ? `
          <div class="better">
            <b class="small">Diese Wörter machen deinen Satz noch besser:</b>
            <div class="better-words">${missing.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
          </div>` : ''}
        ${levelUpHtml(item.levelUp)}
        ${item.note ? `<p class="note"><span>💡</span><span>${esc(item.note)}</span></p>` : ''}`;
    }

    root.innerHTML = `${head(true)}
      <div class="result-box ${result.level === 'skip' ? 'try' : result.level}">
        <h3>${pick(titles[result.level])}</h3>
        ${inner}
      </div>
      ${footer()}`;
    bindFooter();
  }

  // AI coach result: her own answer corrected, concrete fixes, better words, level up.
  function showAi(offline, ai) {
    const saidTokens = tokens(offline.said);
    const correctedHtml = marked(markAnswer(ai.corrected || offline.answer, saidTokens));
    const changed = ai.corrected && tokens(ai.corrected).join(' ') !== saidTokens.join(' ');
    const example = item.answers[0];

    root.innerHTML = `${head(true)}
      <div class="result-box ${ai.level}">
        <h3>${pick(titles[ai.level])}</h3>
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
            <b class="small">${kind === 'free' ? 'Damit kannst du noch mehr sagen:' : 'Diese Wörter machen deinen Satz noch besser:'}</b>
            <div class="better-words">${ai.betterWords.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
          </div>` : ''}
        ${levelUpHtml(ai.levelUp || item.levelUp)}
        ${ai.tip ? `<p class="note"><span>💡</span><span>${esc(ai.tip)}</span></p>` : ''}
        ${example ? `
          <details class="example-answer">
            <summary>${kind === 'free' ? 'Beispielantwort anzeigen' : 'Beispiellösung anzeigen'}</summary>
            <div class="answer-line" style="margin-top:8px">${playBtn(example)}<p>${esc(example)}</p></div>
            ${item.note ? `<p class="note"><span>💡</span><span>${esc(item.note)}</span></p>` : ''}
          </details>` : ''}
      </div>
      ${footer()}`;
    bindFooter();
  }

  renderPrompt();
  // Read the friend's line / the sentence to repeat aloud (works when opened by a tap).
  if (kind === 'shadow') say(item.en);
  else if (item.they) say(item.they, { role: 'friend' });
  // Have the model answers ready by the time she has spoken.
  prefetch([item.answers[0], item.levelUp]);
  return { destroy: stopListening };
}

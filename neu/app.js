// Miri English – new daily practice (rebuild step 1).
// Start page with Raluca → today's lesson (about 10 minutes) → done for today.
// Exercise types: Nachsprechen (repeat), Satz bauen (build), Sag es auf Englisch (say), Hörgeschichte (story).

import travel from './content/travel.js';
import { mountFox } from './fox.js';
import { play, playAll, stopAll } from './audio.js';
import { startRecording, canRecord } from './rec.js';
import { getState, update, today, streak, backup, restore, log, readLog } from './store.js';
import { checkAnswer, markAnswer, tokens, sameSentence } from '../js/check.js';
import { aiFeedback, looksGerman } from '../js/ai.js';

const TOPIC = travel;
const app = document.getElementById('app');

// Raluca's short lines (audio made by tools/make_audio.py, EXTRA_MAIN)
const RALUCA = { hello: 'Hi Miri! Ready for today?', great: 'Great job!', good: 'Well done!', again: "Let's try again.", bye: 'You did it! See you tomorrow!' };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel, root = app) => root.querySelector(sel);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

let cleanup = null; // stops recording / audio when leaving a screen
function screen(html) {
  if (cleanup) { try { cleanup(); } catch { /* ignore */ } cleanup = null; }
  stopAll();
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- which lesson is today's
function lessonById(id) { return TOPIC.lessons.find((l) => l.id === id); }
function nextLesson() { return TOPIC.lessons.find((l) => !getState().done[l.id]) || null; }
function doneToday() { return getState().days.includes(today()); }

function stepsFor(lesson) {
  const s = [];
  lesson.repeat.forEach((_, i) => s.push({ type: 'repeat', i }));
  lesson.build.forEach((_, i) => s.push({ type: 'build', i }));
  lesson.say.forEach((_, i) => s.push({ type: 'say', i }));
  s.push({ type: 'story' });
  lesson.story.questions.forEach((_, i) => s.push({ type: 'question', i }));
  return s;
}

const TYPE_LABEL = { repeat: 'Nachsprechen', build: 'Satz bauen', say: 'Sag es auf Englisch', story: 'Hörgeschichte', question: 'Hörgeschichte' };

// ================================================================ start page
function home() {
  const st = getState();
  const next = nextLesson();
  const finishedToday = doneToday();
  const run = st.run && lessonById(st.run.lessonId) ? st.run : null;
  const days = streak();
  const doneCount = TOPIC.lessons.filter((l) => st.done[l.id]).length;

  let card;
  if (run) {
    const l = lessonById(run.lessonId);
    card = `
      <div class="card today">
        <p class="kicker">Angefangen</p>
        <h2>${esc(l.title)}</h2>
        <p class="muted">${esc(l.goal)}</p>
        <button class="btn primary big" id="go">Weitermachen</button>
      </div>`;
  } else if (finishedToday) {
    card = `
      <div class="card today done">
        <p class="kicker">Heute</p>
        <h2>Fertig für heute! 🎉</h2>
        <p class="muted">Raluca ist stolz auf dich. Morgen geht es weiter${next ? ` mit „${esc(next.title)}“` : ''}.</p>
        ${next ? '<button class="btn link" id="extra">Trotzdem schon die nächste Lektion machen</button>' : ''}
      </div>`;
  } else if (next) {
    const n = TOPIC.lessons.indexOf(next) + 1;
    card = `
      <div class="card today">
        <p class="kicker">Heute · Lektion ${n} von ${TOPIC.lessons.length} · ca. 10 Minuten</p>
        <h2>${esc(next.title)}</h2>
        <p class="muted">${esc(next.goal)}</p>
        <ul class="parts">
          <li><span>🔁</span>Nachsprechen</li>
          <li><span>🧩</span>Satz bauen</li>
          <li><span>🗣️</span>Sag es auf Englisch</li>
          <li><span>🎧</span>Hörgeschichte</li>
        </ul>
        <button class="btn primary big" id="go">Los geht's</button>
      </div>`;
  } else {
    card = `
      <div class="card today done">
        <p class="kicker">${esc(TOPIC.title)}</p>
        <h2>Alle Lektionen geschafft! 🏆</h2>
        <p class="muted">Bald kommen neue Themen. Bis dahin kannst du jede Lektion wiederholen.</p>
      </div>`;
  }

  screen(`
    <header class="top">
      <h1>Hallo Miri!</h1>
      <div class="pill" title="Tage in Folge">🔥 ${days} ${days === 1 ? 'Tag' : 'Tage'}</div>
    </header>
    <div class="stage" id="stage"><div class="bubble" id="bubble">${finishedToday && !run ? 'Great job today!' : 'Hi Miri! Ready for today?'}<small>Tippe auf mich</small></div></div>
    ${card}
    <section class="topic">
      <h3>${esc(TOPIC.title)} <span class="muted">${doneCount} von ${TOPIC.lessons.length}</span></h3>
      <ol class="lessons">
        ${TOPIC.lessons.map((l, i) => `
          <li class="${st.done[l.id] ? 'ok' : ''} ${next && next.id === l.id ? 'next' : ''}">
            <span class="dot">${st.done[l.id] ? '✓' : i + 1}</span>
            <span class="t">${esc(l.title)}</span>
            ${st.done[l.id] ? `<button class="btn small" data-again="${l.id}">Wiederholen</button>` : ''}
          </li>`).join('')}
      </ol>
    </section>
    <details class="more">
      <summary>Mein Code und Hilfe</summary>
      <p>Dein Fortschritt wird automatisch gesichert. Mit diesem Code holst du ihn auf ein neues Handy:</p>
      <p class="code">${esc(st.code)}</p>
      <div class="row"><input id="restoreCode" placeholder="Code eingeben" autocapitalize="characters" autocomplete="off"><button class="btn small" id="restoreBtn">Laden</button></div>
      <p class="muted" id="restoreMsg"></p>
      <button class="btn small" id="copyLog">Protokoll kopieren (für Claude)</button>
    </details>
  `);

  const bubble = $('#bubble');
  const fox = mountFox($('#stage'));
  $('#stage').appendChild(bubble);
  fox.el.addEventListener('click', () => {
    play(finishedToday && !run ? RALUCA.great : RALUCA.hello);
    fox.trick(fox.tricks[Math.floor(Math.random() * fox.tricks.length)]);
  });

  const go = $('#go');
  if (go) go.addEventListener('click', () => (run ? resume() : startLesson(next)));
  const extra = $('#extra');
  if (extra) extra.addEventListener('click', () => startLesson(next));
  app.querySelectorAll('[data-again]').forEach((b) => b.addEventListener('click', () => startLesson(lessonById(b.dataset.again))));

  $('#restoreBtn').addEventListener('click', async () => {
    const msg = $('#restoreMsg');
    msg.textContent = 'Wird geladen …';
    try {
      const ok = await restore($('#restoreCode').value);
      if (ok) { msg.textContent = 'Geladen!'; setTimeout(home, 600); } else msg.textContent = 'Zu diesem Code gibt es nichts.';
    } catch (e) { msg.textContent = e.message.includes('16') ? e.message : 'Das ging nicht. Stimmt der Code?'; }
  });
  $('#copyLog').addEventListener('click', async (ev) => {
    const text = `Miri English (neu)\n${navigator.userAgent}\n\n${readLog().join('\n')}`;
    try { await navigator.clipboard.writeText(text); ev.target.textContent = 'Kopiert ✓'; } catch { ev.target.textContent = 'Kopieren ging nicht'; }
  });
}

// ================================================================ lesson flow
function startLesson(lesson) {
  if (!lesson) return home();
  update((s) => { s.run = { lessonId: lesson.id, step: 0, results: [], startedAt: Date.now() }; });
  log('Lektion gestartet: ' + lesson.id);
  resume();
}

function resume() {
  const run = getState().run;
  const lesson = run && lessonById(run.lessonId);
  if (!lesson) return home();
  const steps = stepsFor(lesson);
  if (run.step >= steps.length) return finishLesson(lesson);
  const step = steps[run.step];
  const frame = (inner, footer = '') => screen(`
    <header class="bar">
      <button class="x" id="quit" aria-label="Zurück zum Start">✕</button>
      <div class="progress" aria-label="Fortschritt"><i style="width:${Math.round((run.step / steps.length) * 100)}%"></i></div>
      <span class="count">${run.step + 1}/${steps.length}</span>
    </header>
    <p class="type">${TYPE_LABEL[step.type]}</p>
    <main class="ex">${inner}</main>
    <footer class="actions" id="actions">${footer}</footer>
  `);
  const next = (ok) => {
    update((s) => { s.run.results[s.run.step] = ok; s.run.step++; });
    resume();
  };
  ({ repeat: exRepeat, build: exBuild, say: exSay, story: exStory, question: exQuestion })[step.type](lesson, step, frame, next);
  $('#quit').addEventListener('click', () => home());
}

function finishLesson(lesson) {
  const run = getState().run;
  const results = run.results.filter((r) => r !== undefined);
  const good = results.filter(Boolean).length;
  const minutes = Math.max(1, Math.round((Date.now() - (run.startedAt || Date.now())) / 60000));
  update((s) => {
    s.done[lesson.id] = { date: today(), good, total: results.length };
    if (!s.days.includes(today())) s.days.push(today());
    s.run = null;
  });
  log(`Lektion fertig: ${lesson.id} (${good}/${results.length}, ${minutes} Min.)`);
  backup();
  const days = streak();
  screen(`
    <div class="stage small" id="stage"></div>
    <div class="card center">
      <h2>Geschafft! 🎉</h2>
      <p class="big-num">${good} von ${results.length}</p>
      <p class="muted">Übungen richtig · ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}</p>
      <p>🔥 ${days} ${days === 1 ? 'Tag' : 'Tage'} in Folge</p>
      <button class="btn primary big" id="home">Zum Start</button>
    </div>
  `);
  const fox = mountFox($('#stage'));
  setTimeout(() => { fox.trick('jump'); play(RALUCA.bye); }, 300);
  $('#home').addEventListener('click', home);
}

// ---------------------------------------------------------------- shared pieces
function listenButtons(text, role = 'main') {
  return `<div class="listen">
    <button class="btn round" data-play="${esc(text)}" data-role="${role}" aria-label="Anhören">🔊</button>
    <button class="btn round slow" data-play="${esc(text)}" data-role="${role}" data-slow="1" aria-label="Langsam anhören">🐢</button>
  </div>`;
}
function wirePlayButtons(root = app) {
  root.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => play(b.dataset.play, { role: b.dataset.role, slow: !!b.dataset.slow })));
}

/**
 * Mic button + "lieber tippen". Calls onText(text) with what she said.
 * Returns the element ids it uses inside #actions.
 */
function micControls(onText, check = null) {
  const actions = $('#actions');
  actions.innerHTML = `
    <p class="status" id="status">${canRecord() ? 'Tippe auf das Mikro und sprich.' : 'Dieses Handy kann hier nicht aufnehmen. Bitte tippe deine Antwort.'}</p>
    <button class="mic" id="mic" ${canRecord() ? '' : 'hidden'}><span class="ico">🎤</span><span class="lbl">Sprechen</span></button>
    <button class="btn link" id="typeToggle">⌨️ Lieber tippen</button>
    <form class="typed" id="typed" hidden><input id="typedIn" autocomplete="off" autocapitalize="sentences" placeholder="Auf Englisch schreiben …"><button class="btn primary">OK</button></form>
  `;
  const mic = $('#mic'), status = $('#status');
  let session = null, busy = false;

  let starting = false;
  async function begin() {
    if (starting) return;
    starting = true;
    stopAll();
    // The iPhone needs a moment to switch the mic on – show that, so she starts talking at the right time.
    mic.disabled = true;
    mic.querySelector('.ico').textContent = '⏳';
    mic.querySelector('.lbl').textContent = 'Moment …';
    status.textContent = 'Mikro startet …';
    try {
      session = await startRecording((s) => { status.textContent = `Jetzt sprechen! ${s} s · Tippe auf „Fertig“, wenn du fertig bist.`; }, finish, check);
    } catch (e) {
      status.textContent = e.message;
      mic.querySelector('.ico').textContent = '🎤';
      mic.querySelector('.lbl').textContent = 'Sprechen';
      return;
    } finally { starting = false; mic.disabled = false; }
    mic.classList.add('on');
    mic.querySelector('.ico').textContent = '■';
    mic.querySelector('.lbl').textContent = 'Fertig';
    status.textContent = 'Jetzt sprechen! Tippe auf „Fertig“, wenn du fertig bist.';
  }
  async function finish() {
    if (!session || busy) return;
    busy = true;
    const s = session; session = null;
    mic.classList.remove('on');
    mic.disabled = true;
    mic.querySelector('.ico').textContent = '⏳';
    mic.querySelector('.lbl').textContent = 'Moment …';
    status.textContent = 'Ich höre mir das an …';
    const slow = setTimeout(() => { status.textContent = 'Google ist gerade langsam – noch einen Moment …'; }, 6000);
    const r = await s.stop();
    clearTimeout(slow);
    busy = false;
    mic.disabled = false;
    mic.querySelector('.ico').textContent = '🎤';
    mic.querySelector('.lbl').textContent = 'Sprechen';
    if (r.error === 'cancelled') return;
    if (r.error) { status.textContent = r.error; return; }
    onText(r.text, r.check);
  }
  mic.addEventListener('click', () => (session ? finish() : begin()));
  $('#typeToggle').addEventListener('click', () => { const f = $('#typed'); f.hidden = !f.hidden; if (!f.hidden) $('#typedIn').focus(); });
  $('#typed').addEventListener('submit', (ev) => { ev.preventDefault(); const t = $('#typedIn').value.trim(); if (t) onText(t); });
  cleanup = () => { if (session) session.cancel(); };
}

function resultActions(html) { $('#actions').innerHTML = html; }
function praise(level) {
  if (level === 'great') { play(RALUCA.great); return ['great', ['Super! 🎉', 'Sehr gut! 🎉', 'Perfekt! 🎉'][Math.floor(Math.random() * 3)]]; }
  if (level === 'good') return ['good', 'Gut gemacht! 👍'];
  return ['try', 'Noch nicht ganz.'];
}

// ---------------------------------------------------------------- 1. Nachsprechen
function exRepeat(lesson, step, frame, next) {
  const item = lesson.repeat[step.i];
  frame(`
    <p class="hint">Hör zu und sprich nach.</p>
    <p class="en big">${esc(item.en)}</p>
    <p class="de">${esc(item.de)}</p>
    ${listenButtons(item.en)}
    <div id="result"></div>
  `);
  wirePlayButtons();
  setTimeout(() => play(item.en), 250);
  const ask = () => micControls((said) => {
    const r = checkAnswer({ answers: [item.en] }, [said]);
    const sim = r.marked.filter((w) => w.said).length / Math.max(1, r.marked.length);
    const level = sim >= 0.85 ? 'great' : sim >= 0.6 ? 'good' : 'try';
    const [cls, msg] = praise(level);
    $('#result').innerHTML = `
      <div class="feedback ${cls}">
        <p class="verdict">${msg}</p>
        <p class="said">Du hast gesagt: „${esc(said)}“</p>
        ${level !== 'great' ? `<p class="marked">${r.marked.map((w) => `<span class="${w.said ? '' : 'miss'}">${esc(w.word)}</span>`).join(' ')}</p><p class="small muted">Die <span class="miss">markierten</span> Wörter habe ich nicht gehört.</p>` : ''}
      </div>`;
    resultActions(`
      ${level !== 'great' ? '<button class="btn" id="again">Nochmal</button>' : ''}
      <button class="btn primary" id="next">Weiter</button>`);
    const again = $('#again');
    if (again) again.addEventListener('click', () => { $('#result').innerHTML = ''; ask(); play(item.en); });
    $('#next').addEventListener('click', () => next(level !== 'try'));
  });
  ask();
}

// ---------------------------------------------------------------- 2. Satz bauen
function exBuild(lesson, step, frame, next) {
  const item = lesson.build[step.i];
  const words = item.en.replace(/[.?!]+$/, '').split(/\s+/);
  const pool = shuffle([...words, ...(item.extra || [])]).map((w, id) => ({ w, id }));
  let chosen = [];
  frame(`
    <p class="hint">Bau den Satz auf Englisch.</p>
    <p class="de big">${esc(item.de)}</p>
    <div class="answer" id="answer" aria-label="Dein Satz"></div>
    <div class="tiles" id="pool"></div>
    <div id="result"></div>
  `, `<button class="btn primary" id="check" disabled>Prüfen</button>`);

  function draw() {
    $('#answer').innerHTML = chosen.map((t) => `<button class="tile" data-id="${t.id}">${esc(t.w)}</button>`).join('') || '<span class="placeholder">Tippe die Wörter in der richtigen Reihenfolge an.</span>';
    $('#pool').innerHTML = pool.map((t) => `<button class="tile ${chosen.includes(t) ? 'used' : ''}" data-id="${t.id}" ${chosen.includes(t) ? 'disabled' : ''}>${esc(t.w)}</button>`).join('');
    $('#check').disabled = !chosen.length;
  }
  app.addEventListener('click', onTap);
  cleanup = () => app.removeEventListener('click', onTap);
  function onTap(ev) {
    const b = ev.target.closest('.tile');
    if (!b || $('#answer').classList.contains('locked')) return;
    const t = pool.find((x) => x.id === Number(b.dataset.id));
    if (b.parentElement.id === 'pool') chosen.push(t); else chosen = chosen.filter((x) => x !== t);
    draw();
  }
  draw();
  $('#check').addEventListener('click', () => {
    const said = chosen.map((t) => t.w).join(' ');
    const ok = sameSentence(said, item.en);
    $('#answer').classList.add('locked', ok ? 'right' : 'wrong');
    $('#result').innerHTML = ok
      ? `<div class="feedback great"><p class="verdict">Richtig! 🎉</p>${listenButtons(item.en)}</div>`
      : `<div class="feedback try"><p class="verdict">Fast!</p><p>Richtig ist:</p><p class="en">${esc(item.en)}</p>${listenButtons(item.en)}</div>`;
    wirePlayButtons($('#result'));
    play(item.en);
    resultActions(`${ok ? '' : '<button class="btn" id="again">Nochmal</button>'}<button class="btn primary" id="next">Weiter</button>`);
    const again = $('#again');
    if (again) again.addEventListener('click', () => exBuild(lesson, step, frame, next));
    $('#next').addEventListener('click', () => next(ok));
  });
}

// The server's check of a spoken answer, in the same shape as aiFeedback(); German slips are dropped.
function cleanCheck(c) {
  if (!c || !['great', 'good', 'try'].includes(c.level)) return null;
  const english = (t) => (looksGerman(t) ? '' : String(t || ''));
  return {
    level: c.level,
    praise: String(c.praise || ''),
    corrected: english(c.corrected),
    fixes: (Array.isArray(c.fixes) ? c.fixes : []).filter((f) => f && f.better && !looksGerman(f.better)).slice(0, 2),
    tip: String(c.tip || ''),
  };
}

// ---------------------------------------------------------------- 3. Sag es auf Englisch
function exSay(lesson, step, frame, next) {
  const item = lesson.say[step.i];
  frame(`
    ${item.they ? `<div class="they"><span class="who">🧑</span><div><p class="en">${esc(item.they)}</p>${listenButtons(item.they, 'friend')}</div></div>` : ''}
    <p class="hint">Sag auf Englisch:</p>
    <p class="de big">${esc(item.de)}</p>
    <div id="result"></div>
  `);
  wirePlayButtons();
  if (item.they) setTimeout(() => play(item.they, { role: 'friend' }), 250);
  const showAnswer = (headline, cls) => `
      <div class="feedback ${cls}">
        ${headline}
        <p class="small muted">So kannst du es sagen:</p>
        <p class="en">${esc(item.answers[0])}</p>
        ${listenButtons(item.answers[0])}
      </div>`;

  const ask = () => {
    micControls(async (said, serverCheck) => {
      const local = checkAnswer(item, [said]);
      let level = local.level, fb = cleanCheck(serverCheck);
      // Spoken answers come back already checked (one server call). Typed answers – or if that check is
      // missing – ask the feedback function: at most 8 seconds (Gemini is sometimes overloaded), then the
      // offline check decides. A hard timer as well, because a hanging request must never block the lesson.
      const t0 = Date.now();
      if (!fb) $('#actions').innerHTML = '<p class="status">Raluca schaut sich deinen Satz an …</p>';
      if (!fb) fb = await Promise.race([
        aiFeedback({ they: item.they || '', de: item.de, answers: item.answers }, said, { timeout: 8000 })
          .catch((e) => { log('KI-Feedback ging nicht: ' + (e.code || e.message)); return null; }),
        new Promise((r) => setTimeout(() => r(null), 9000)),
      ]);
      if (fb) level = fb.level; else log(`KI-Feedback übersprungen nach ${((Date.now() - t0) / 1000).toFixed(1)} s`);
      const [cls, msg] = praise(level);
      let body = `<p class="verdict">${msg}</p><p class="said">Du hast gesagt: „${esc(said)}“</p>`;
      if (fb) {
        if (fb.praise && level !== 'try') body += `<p>${esc(fb.praise)}</p>`;
        if (fb.fixes.length) body += `<ul class="fixes">${fb.fixes.map((f) => `<li><s>${esc(f.wrong)}</s> → <b>${esc(f.better)}</b>${f.why ? `<br><span class="small muted">${esc(f.why)}</span>` : ''}</li>`).join('')}</ul>`;
        else if (fb.tip) body += `<p class="small">${esc(fb.tip)}</p>`;
      } else if (local.missing.length && level !== 'great') {
        body += `<p>Diese Wörter fehlen noch: <b>${local.missing.map(esc).join(', ')}</b></p>`;
      }
      if (!fb) body += '<p class="small muted">Die KI ist gerade überlastet, deshalb nur eine einfache Prüfung.</p>';
      $('#result').innerHTML = showAnswer(body, cls);
      wirePlayButtons($('#result'));
      if (level !== 'great') setTimeout(() => play(item.answers[0]), 400);
      resultActions(`${level !== 'great' ? '<button class="btn" id="again">Nochmal</button>' : ''}<button class="btn primary" id="next">Weiter</button>`);
      const again = $('#again');
      if (again) again.addEventListener('click', () => { $('#result').innerHTML = ''; ask(); });
      $('#next').addEventListener('click', () => next(level !== 'try'));
    }, { they: item.they || '', de: item.de, answers: item.answers });
    const skip = document.createElement('button');
    skip.className = 'btn link';
    skip.textContent = 'Ich weiß es nicht – zeig mir die Lösung';
    skip.addEventListener('click', () => {
      cleanup && cleanup();
      $('#result').innerHTML = showAnswer('<p class="verdict">Kein Problem!</p><p>Hör zu und sprich es einmal nach.</p>', 'good');
      wirePlayButtons($('#result'));
      play(item.answers[0]);
      resultActions('<button class="btn" id="again">Selbst versuchen</button><button class="btn primary" id="next">Weiter</button>');
      $('#again').addEventListener('click', () => { $('#result').innerHTML = ''; ask(); });
      $('#next').addEventListener('click', () => next(false));
    });
    $('#actions').appendChild(skip);
  };
  ask();
}

// ---------------------------------------------------------------- 4. Hörgeschichte
function exStory(lesson, step, frame, next) {
  const st = lesson.story;
  frame(`
    <h2 class="story-title">${esc(st.title)}</h2>
    <p class="hint">${esc(st.de)} Danach kommen 2 Fragen.</p>
    <button class="btn primary big" id="playStory">▶ Geschichte anhören</button>
    <button class="btn link" id="showText">Text zeigen</button>
    <ol class="story" id="storyText" hidden>${st.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ol>
  `, `<button class="btn primary" id="next" disabled>Zu den Fragen</button>`);
  let heard = false;
  const btn = $('#playStory');
  let playing = false;
  btn.addEventListener('click', async () => {
    if (playing) { stopAll(); return; }
    playing = true;
    btn.textContent = '■ Stopp';
    const lines = [...app.querySelectorAll('#storyText li')];
    const finished = await playAll(st.lines, { onLine: (i) => lines.forEach((li, j) => li.classList.toggle('now', j === i)) });
    playing = false;
    if (!$('#playStory')) return;
    btn.textContent = '↻ Nochmal anhören';
    if (finished || heard) { heard = true; $('#next').disabled = false; }
    else $('#next').disabled = false; // she may stop early; let her go on anyway
  });
  $('#showText').addEventListener('click', (ev) => { const t = $('#storyText'); t.hidden = !t.hidden; ev.target.textContent = t.hidden ? 'Text zeigen' : 'Text verstecken'; });
  $('#next').addEventListener('click', () => next(undefined));
  // Let her go on after a while even if she never pressed play (e.g. no sound)
  const t = setTimeout(() => { const n = $('#next'); if (n) n.disabled = false; }, 20000);
  cleanup = () => clearTimeout(t);
}

function exQuestion(lesson, step, frame, next) {
  const st = lesson.story;
  const q = st.questions[step.i];
  frame(`
    <h2 class="story-title">${esc(st.title)}</h2>
    <p class="en big">${esc(q.q)}</p>
    <button class="btn link" id="de">Auf Deutsch?</button>
    <p class="de" id="qde" hidden>${esc(q.qde)}</p>
    <div class="options">${q.options.map((o, i) => `<button class="option" data-i="${i}">${esc(o)}</button>`).join('')}</div>
    <button class="btn link" id="replay">🎧 Geschichte nochmal anhören</button>
  `);
  play(q.q);
  $('#de').addEventListener('click', () => { $('#qde').hidden = false; $('#de').hidden = true; });
  let replaying = false;
  $('#replay').addEventListener('click', async (ev) => {
    if (replaying) { stopAll(); return; }
    replaying = true; ev.target.textContent = '■ Stopp';
    await playAll(st.lines);
    replaying = false;
    if (document.body.contains(ev.target)) ev.target.textContent = '🎧 Geschichte nochmal anhören';
  });
  app.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.i);
    const ok = i === q.answer;
    app.querySelectorAll('.option').forEach((o) => { o.disabled = true; if (Number(o.dataset.i) === q.answer) o.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    if (ok) play(RALUCA.great);
    resultActions(`<p class="status">${ok ? 'Richtig! 🎉' : 'Leider falsch. Die richtige Antwort ist grün.'}</p><button class="btn primary" id="next">Weiter</button>`);
    $('#next').addEventListener('click', () => next(ok));
  }));
}

// ================================================================ start
window.addEventListener('pageshow', () => {});
log('App geöffnet');
home();
backup();

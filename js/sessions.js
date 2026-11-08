// Full-screen sessions: flashcards and the daily speaking set, plus shared shell and summary.
import { $, esc, icon, playBtn, setSession, shuffle } from './ui.js';
import { PHRASES, SPEAK, LESSONS } from '../content/index.js';
import { dueIds, learnedIds, rate, preview, formatInterval } from './srs.js';
import { getState, markTask, addTime } from './store.js';
import { say, stopSpeaking } from './speech.js';
import { renderSpeak } from './speak.js';

// ---------------------------------------------------------------- shell
export function shell({ onClose, confirm: ask = true }) {
  setSession(true);
  const app = $('#app');
  app.innerHTML = `
    <div class="session">
      <div class="session-top">
        <button class="icon-btn" data-close aria-label="Beenden">${icon.close}</button>
        <div class="progress"><i></i></div>
        <div class="session-count"></div>
      </div>
      <div class="session-body"></div>
    </div>`;
  const body = $('.session-body', app);
  $('[data-close]', app).addEventListener('click', () => {
    if (!ask || window.confirm('Wirklich beenden? Diese Runde wird nicht gespeichert.')) {
      stopSpeaking();
      onClose();
    }
  });
  return {
    body,
    progress(done, total) {
      $('.progress > i', app).style.width = `${total ? Math.round((done / total) * 100) : 0}%`;
      $('.session-count', app).textContent = total ? `${Math.min(done + 1, total)}/${total}` : '';
    },
    hideTop() { $('.session-top', app).style.visibility = 'hidden'; },
  };
}

export function summary(body, { emoji = '🎉', title, text = '', stats = [], button = 'Weiter', onDone }) {
  body.innerHTML = `
    <div class="center">
      <div class="celebrate">${emoji}</div>
      <h1 class="summary-title">${esc(title)}</h1>
      ${text ? `<p class="muted" style="margin-top:8px">${text}</p>` : ''}
      ${stats.length ? `<div class="summary-stats">${stats.map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
    </div>
    <div class="grow"></div>
    <div class="session-foot"><button class="btn btn-block" data-done>${esc(button)}</button></div>`;
  $('[data-done]', body).addEventListener('click', onDone);
}

// ---------------------------------------------------------------- flashcards
export function startCards({ practice = false, onExit }) {
  const started = Date.now();
  let queue = practice ? shuffle(learnedIds()).slice(0, 20) : dueIds(15);
  queue = queue.filter((id) => PHRASES.has(id));
  const total = queue.length;
  let done = 0, again = 0;
  const ui = shell({ onClose: onExit });

  if (!total) {
    ui.hideTop();
    summary(ui.body, {
      emoji: '✨', title: practice ? 'Noch keine Karten' : 'Heute nichts fällig',
      text: practice ? 'Mach zuerst eine Lektion – dann kommen hier deine Karten.' : 'Alle Karten sind wiederholt. Morgen geht’s weiter!',
      button: 'Zurück', onDone: onExit,
    });
    return;
  }

  function next() {
    ui.progress(done, total);
    if (!queue.length) return finish();
    showFront(queue[0]);
  }

  function showFront(id) {
    const p = PHRASES.get(id);
    const card = getState().cards[id] || { reps: 0 };
    const reverse = !practice && card.reps % 3 === 2; // sometimes EN → DE
    ui.body.innerHTML = `
      <div class="flash">
        ${reverse
          ? `<div class="kicker">Was bedeutet das?</div>
             <div class="row" style="justify-content:center">${playBtn(p.en)}<p class="big-en">${esc(p.en)}</p></div>`
          : `<div class="kicker">Wie sagt man auf Englisch?</div>
             <p class="q-de">${esc(p.de)}</p>
             <p class="flash-say">🗣️ Sag es laut – dann aufdecken.</p>`}
      </div>
      <div class="session-foot"><button class="btn btn-block" data-reveal>Aufdecken</button></div>`;
    $('[data-reveal]', ui.body).addEventListener('click', () => { showBack(id, reverse); if (!reverse) say(p.en); });
  }

  function showBack(id, reverse) {
    const p = PHRASES.get(id);
    const card = getState().cards[id];
    const grades = practice
      ? `<div class="grades two">
           <button class="grade again" data-g="again">Nochmal</button>
           <button class="grade good" data-g="good">Gewusst</button>
         </div>`
      : `<div class="grades">
           ${[['again', 'Nochmal'], ['hard', 'Schwer'], ['good', 'Gut'], ['easy', 'Leicht']]
             .map(([g, l]) => `<button class="grade ${g}" data-g="${g}">${l}<small>${formatInterval(preview(card, g))}</small></button>`).join('')}
         </div>`;
    ui.body.innerHTML = `
      <div class="flash">
        <p class="muted" style="font-size:17px">${esc(p.de)}</p>
        <div class="flash-divider"></div>
        <div class="row" style="justify-content:center">${playBtn(p.en, 'lg')}<p class="big-en">${esc(p.en)}</p></div>
        ${p.ex ? `<div class="example">${playBtn(p.ex)}<p>${esc(p.ex)}</p></div>` : ''}
        ${p.note ? `<p class="note" style="text-align:left"><span>💡</span><span>${esc(p.note)}</span></p>` : ''}
      </div>
      <div class="session-foot">
        <p class="small muted center">Wie gut wusstest du es?</p>
        ${grades}
      </div>`;
    ui.body.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => grade(id, b.dataset.g)));
  }

  function grade(id, g) {
    queue.shift();
    if (!practice) rate(id, g);
    if (g === 'again') { queue.push(id); again++; } else done++;
    next();
  }

  function finish() {
    if (!practice) markTask('cards');
    addTime((Date.now() - started) / 1000);
    ui.hideTop();
    summary(ui.body, {
      emoji: '🧠', title: 'Karten geschafft!',
      text: again ? 'Die „Nochmal“-Karten kommen bald wieder – so bleiben sie hängen.' : 'Alles gewusst – stark!',
      stats: [[String(total), total === 1 ? 'Karte' : 'Karten'], [String(again), 'Nochmal']],
      onDone: onExit,
    });
  }

  next();
}

// ---------------------------------------------------------------- daily speaking set
function pickSentences(n = 4) {
  const s = getState();
  const doneLessons = LESSONS.filter((l) => s.lessons[l.id]?.done);
  const pool = (doneLessons.length ? doneLessons : LESSONS.slice(0, 1)).flatMap((l) => l.speak.map((x) => SPEAK.get(x.id)));
  const scored = shuffle(pool).map((item) => {
    const st = s.speaking[item.id];
    // never practised first, then weakest, then longest ago
    const prio = !st ? 0 : 1 + st.best + (st.last ? Math.min(30, daysSince(st.last)) * -0.02 : 0);
    return { item, prio };
  });
  return scored.sort((a, b) => a.prio - b.prio).slice(0, n).map((x) => x.item);
}

function daysSince(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Math.round((Date.now() - new Date(y, m - 1, d).getTime()) / 86400000);
}

export function startSpeaking({ onExit }) {
  const started = Date.now();
  const items = pickSentences(4);
  const results = [];
  let i = 0;
  let current = null;
  const ui = shell({ onClose: () => { current?.destroy(); onExit(); } });

  function next() {
    ui.progress(i, items.length);
    if (i >= items.length) return finish();
    current = renderSpeak(ui.body, items[i], {
      onDone: (r) => { results.push(r); i++; next(); },
    });
  }

  function finish() {
    markTask('speaking');
    addTime((Date.now() - started) / 1000);
    ui.hideTop();
    const good = results.filter((r) => r.level === 'great' || r.level === 'good').length;
    summary(ui.body, {
      emoji: '🗣️', title: 'Gut gesprochen!',
      text: 'Jeder Satz, den du laut sagst, macht das Sprechen leichter.',
      stats: [[String(items.length), 'Sätze'], [`${good}/${items.length}`, 'gut verstanden']],
      onDone: onExit,
    });
  }

  next();
}

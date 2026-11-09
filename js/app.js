// Miri English – main screens and navigation (hash router).
import { $, $$, esc, icon, playBtn, setSession, toast, plural } from './ui.js';
import { MODULES, LESSONS, PHRASES, findLesson } from '../content/index.js';
import { getState, save, today, addDays, day, streak, bestStreak, totalSeconds, isActiveDay, resetAll } from './store.js';
import { dueCount, learnedIds, addWordCards } from './srs.js';
import { startLesson, startReview, reviewPool } from './lesson.js';
import { startCards, startSpeaking } from './sessions.js';
import { startChat } from './chat.js';
import { openLookup, closeLookup } from './lookup.js';
import { canListen, listen, errorMessage, say, englishVoices, voiceQuality, testDeviceVoice } from './speech.js';
import { initSync, getCode, restore, normalizeCode, status, onStatus } from './sync.js';

const app = $('#app');
const TABS = [
  { id: 'today', label: 'Heute', icon: icon.home },
  { id: 'modules', label: 'Module', icon: icon.modules },
  { id: 'cards', label: 'Karten', icon: icon.cards },
  { id: 'progress', label: 'Fortschritt', icon: icon.stats },
];

// ---------------------------------------------------------------- helpers
const isDone = (l) => !!getState().lessons[l.id]?.done;
const nextLesson = () => LESSONS.find((l) => !isDone(l)) || null;
const unlocked = (l) => l.index === 0 && l.module === MODULES[0] ? true : isDone(l) || nextLesson() === l;

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Good morning';
  if (h < 17) return 'Hi';
  return 'Good evening';
}

function dateLabel() {
  return new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

function go(route) { location.hash = '#/' + route; }

// Topic for today's chat: the finished lesson she has chatted about least (newest first on ties).
function chatLesson() {
  const s = getState();
  const done = LESSONS.filter((l) => isDone(l) && l.free);
  if (!done.length) return LESSONS[0];
  return done.slice().reverse().sort((a, b) => (s.speaking[`chat-${a.id}`]?.count || 0) - (s.speaking[`chat-${b.id}`]?.count || 0))[0];
}

// ---------------------------------------------------------------- router
function render() {
  closeLookup();
  const [route, arg] = location.hash.replace(/^#\/?/, '').split('/');
  const s = getState();
  if (!s.welcomed) return renderWelcome();

  if (route === 'lesson') {
    const l = findLesson(arg);
    if (l && unlocked(l)) return startLesson(l, { onExit: () => go('today') });
    return go('modules');
  }
  if (route === 'review') {
    const toToday = () => { go('today'); render(); };
    const hasReview = reviewPool().length > 0;
    return startCards({
      onExit: toToday,
      then: hasReview ? { label: 'Weiter: 3 Übungen zur Wiederholung', run: () => startReview({ onExit: toToday }) } : null,
    });
  }
  if (route === 'practice') return startCards({ practice: true, onExit: () => go('cards') });
  if (route === 'speak') {
    // Daily speaking = an open conversation with Raluca (saved, continues next time).
    return startChat({ pickLesson: chatLesson, onExit: () => { go('today'); render(); } });
  }
  if (route === 'speak-script') return startSpeaking({ onExit: () => go('today') });

  setSession(false);
  const tab = TABS.some((t) => t.id === route) ? route : 'today';
  renderTabbar(tab);
  ({ today: renderToday, modules: renderModules, cards: renderCards, progress: renderProgress })[tab]();
}

function renderTabbar(active) {
  $('#tabbar').innerHTML = `<div class="tabbar-inner">${TABS.map((t) =>
    `<a class="tab" href="#/${t.id}" ${t.id === active ? 'aria-current="page"' : ''}>${t.icon}<span>${t.label}</span></a>`).join('')}</div>`;
}

// ---------------------------------------------------------------- welcome
function renderWelcome() {
  setSession(true);
  app.innerHTML = `
    <div class="session">
      <div class="center">
        <div class="celebrate">👋</div>
        <h1 class="summary-title">Hi Miri!</h1>
        <p class="muted" style="margin-top:8px">Willkommen bei <b>Miri English</b>. Jeden Tag ca. 20 Minuten – und du sprichst Englisch, statt nur Vokabeln zu pauken.</p>
      </div>
      <ol class="plain welcome-steps">
        <li><div class="task-icon">📘</div><div><b>Lektion</b><p class="small muted">Neue Ausdrücke, ein kurzer Tipp und Übungen.</p></div></li>
        <li><div class="task-icon">🧠</div><div><b>Karteikarten & Wiederholung</b><p class="small muted">Kommen genau dann wieder, wenn du sie sonst vergessen würdest – auch deine eigenen Fehler.</p></div></li>
        <li><div class="task-icon">🦊</div><div><b>Plaudern mit Raluca</b><p class="small muted">Ein echtes Gespräch: Raluca reagiert auf das, was du sagst, und fragt nach. Danach bekommst du Tipps.</p></div></li>
      </ol>
      <div class="card" style="margin-top:22px">
        <b>📱 Tipp: Als App speichern</b>
        <p class="small muted" style="margin-top:4px">In Safari unten auf <b>Teilen</b> (□↑) tippen → <b>„Zum Home-Bildschirm“</b>. Dann öffnest du Miri English wie eine App.</p>
      </div>
      <div class="grow"></div>
      <div class="session-foot">
        <button class="btn btn-block" data-start>Los geht’s!</button>
        <button class="btn btn-ghost btn-sm" data-have-code>Ich habe schon einen Sicherungscode</button>
      </div>
    </div>`;
  $('[data-have-code]').addEventListener('click', () => {
    const input = window.prompt('Gib deinen Sicherungscode ein (z. B. ABCD-EFGH-JKLM-NPQR):');
    if (input) restoreFlow(input);
  });
  $('[data-start]').addEventListener('click', () => {
    getState().welcomed = true;
    save();
    go('today');
    render();
  });
}

// ---------------------------------------------------------------- today
function renderToday() {
  const d = day();
  const s = getState();
  const lesson = nextLesson();
  const due = dueCount();
  const hasCards = learnedIds().length > 0;
  const cardsDone = d.cards || (hasCards && due === 0);
  const tasks = [d.lesson, cardsDone, d.speaking];
  const doneN = tasks.filter(Boolean).length;
  const st = streak();
  const C = 2 * Math.PI * 36;

  const lessonSub = d.lesson
    ? 'Erledigt – stark!'
    : lesson ? `${esc(lesson.module.titleDe)} · Lektion ${lesson.index + 1}: ${esc(lesson.title)}` : 'Alle Lektionen geschafft – wiederhole eine!';
  const cardsSub = !hasCards ? 'Kommen nach deiner ersten Lektion' : d.cards ? 'Erledigt!' : due ? `${plural(due, 'Karte', 'Karten')} fällig` : 'Heute nichts fällig 🎉';
  const chatGoal = Math.max(0, 3 - (d.chatMsgs || 0));
  const speakSub = d.speaking
    ? 'Erledigt – du kannst trotzdem weiterplaudern!'
    : s.chat?.msgs?.some((m) => m.who === 'miri')
      ? `Weiterplaudern – noch ${chatGoal} ${chatGoal === 1 ? 'Nachricht' : 'Nachrichten'} fürs Tagesziel`
      : `Plaudere mit Raluca 🦊 – ${chatGoal} Nachrichten fürs Tagesziel`;

  const lessonHref = lesson ? `#/lesson/${lesson.id}` : '#/modules';
  const msg = doneN === 3 ? 'Tagesziel geschafft! 🎉' : doneN === 0 ? 'Dein Plan für heute' : 'Weiter so!';

  app.innerHTML = `
    <div class="page-head">
      <div>
        <h1 class="hello">${greeting()}, Miri!</h1>
        <p class="date">${esc(dateLabel())}</p>
      </div>
      <span class="chip streak" title="Tage in Folge">${icon.flame.replace('<svg', '<svg width="16" height="16"')} ${st}</span>
    </div>

    <div class="card goal">
      <div class="ring" aria-label="${doneN} von 3 Aufgaben erledigt">
        <svg viewBox="0 0 84 84"><circle class="track" cx="42" cy="42" r="36"/><circle class="fill" cx="42" cy="42" r="36" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - doneN / 3)}"/></svg>
        <div class="ring-label">${doneN}/3</div>
      </div>
      <div>
        <h2>${msg}</h2>
        <p class="small muted" style="margin-top:4px">${doneN === 3 ? 'Du kannst trotzdem weiterüben, wenn du Lust hast.' : 'Ca. 20 Minuten · Lektion, Karten, Plaudern mit Raluca'}</p>
      </div>
    </div>

    <h2 class="section-title">Heute</h2>
    ${taskHtml({ href: lessonHref, emoji: '📘', title: 'Lektion', sub: lessonSub, done: d.lesson })}
    ${taskHtml({ href: '#/review', emoji: '🧠', title: 'Karteikarten', sub: cardsSub, done: cardsDone, disabled: !hasCards })}
    ${taskHtml({ href: '#/speak', emoji: '🦊', title: 'Plaudern mit Raluca', sub: speakSub, done: d.speaking })}

    ${phraseOfTheDay()}
  `;
}

function taskHtml({ href, emoji, title, sub, done, disabled }) {
  return `<a class="task ${done ? 'done' : ''} ${disabled ? 'disabled' : ''}" href="${href}" style="text-decoration:none;color:inherit">
    <div class="task-icon">${emoji}</div>
    <div class="grow"><div class="task-title">${esc(title)}</div><div class="task-sub">${sub}</div></div>
    ${done ? `<span class="check-badge">${icon.check}</span>` : `<span class="task-go">${icon.chevron}</span>`}
  </a>`;
}

function phraseOfTheDay() {
  const ids = learnedIds().filter((id) => PHRASES.has(id));
  const pool = ids.length ? ids : LESSONS[0].phrases.map((p) => p.id);
  const t = today();
  let h = 0;
  for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const p = PHRASES.get(pool[h % pool.length]);
  if (!p) return '';
  return `
    <h2 class="section-title">Ausdruck des Tages</h2>
    <div class="card potd">
      ${playBtn(p.en, 'lg')}
      <div class="grow"><p class="potd-en">${esc(p.en)}</p><p class="small muted">${esc(p.de)}</p></div>
    </div>`;
}

// ---------------------------------------------------------------- modules
function renderModules() {
  const current = nextLesson();
  app.innerHTML = `
    <div class="page-head"><h1 class="page-title">Module</h1></div>
    <div class="stack">
      ${MODULES.map((m, mi) => {
        if (!m.data) {
          return `<div class="card module locked"><div class="module-head">
            <div class="module-emoji">${m.emoji}</div>
            <div class="grow"><div class="module-title">${mi + 1}. ${esc(m.titleDe)}</div><div class="module-sub">Kommt bald</div></div>
            <span class="task-go">${icon.lock}</span></div></div>`;
        }
        const ls = LESSONS.filter((l) => l.module === m);
        const done = ls.filter(isDone).length;
        return `<div class="card module">
          <div class="module-head">
            <div class="module-emoji">${m.emoji}</div>
            <div class="grow">
              <div class="module-title">${mi + 1}. ${esc(m.titleDe)}</div>
              <div class="module-sub">${done}/${ls.length} Lektionen</div>
              <div class="bar"><i style="width:${(done / ls.length) * 100}%"></i></div>
            </div>
          </div>
          <div class="lessons">
            ${ls.map((l) => {
              const cls = isDone(l) ? 'done' : l === current ? 'current' : 'locked';
              const num = isDone(l) ? icon.check : cls === 'locked' ? icon.lock : l.index + 1;
              return `<a class="lesson-row ${cls}" href="#/lesson/${l.id}" style="text-decoration:none;color:inherit">
                <span class="lesson-num">${num}</span>
                <span class="grow"><b>${esc(l.title)}</b><br><span class="small muted">${esc(l.goal)}</span></span>
                ${cls !== 'locked' ? `<span class="task-go">${icon.chevron}</span>` : ''}
              </a>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// ---------------------------------------------------------------- cards
function renderCards() {
  const ids = learnedIds();
  const due = dueCount();
  const cards = getState().cards;
  const t = today();
  app.innerHTML = `
    <div class="page-head"><h1 class="page-title">Karteikarten</h1></div>
    <div class="stats">
      <div class="stat"><b>${due}</b><span>heute fällig</span></div>
      <div class="stat"><b>${ids.length}</b><span>Karten insgesamt</span></div>
    </div>
    <div class="stack" style="margin-top:14px">
      <a class="btn btn-block ${due ? '' : 'btn-soft'}" href="#/review" ${due ? '' : 'style="pointer-events:none;opacity:.5"'}>Fällige Karten lernen</a>
      <a class="btn btn-line btn-block" href="#/practice" ${ids.length ? '' : 'style="pointer-events:none;opacity:.5"'}>Freies Üben (zählt nicht)</a>
    </div>
    <button class="btn btn-soft btn-block" data-lookup-open style="margin-top:10px">🔍 Wort nachschlagen</button>
    ${mistakesHtml(cards, t)}
    ${wordsHtml(cards, t)}
    ${lessonWordsHtml(cards, t)}
    <a class="btn btn-ghost btn-block" href="#/speak-script" style="margin-top:6px">🎭 Geführtes Gespräch üben (Übersetzen)</a>
    <h2 class="section-title">Deine Ausdrücke</h2>
    ${ids.length ? `<div class="card phrase-list">
      ${ids.map((id) => PHRASES.get(id)).filter(Boolean).map((p) => `
        <div class="phrase-item">
          ${playBtn(p.en)}
          <div class="grow"><b>${esc(p.en)}</b><span>${esc(p.de)}</span></div>
          ${cards[p.id].due <= t ? '<span class="due-dot" title="fällig"></span>' : ''}
        </div>`).join('')}
    </div>` : `<div class="card empty"><div>🃏</div>Nach deiner ersten Lektion landen hier deine Ausdrücke.</div>`}`;
  $('[data-lookup-open]').addEventListener('click', () => openLookup());
}

// Key words from the lessons, grouped by lesson (collapsed to keep the page short).
function lessonWordsHtml(cards, t) {
  const groups = LESSONS.map((l) => ({ l, list: (l.words || []).filter((w) => cards[w.id]) })).filter((g) => g.list.length);
  if (!groups.length) return '';
  const total = groups.reduce((a, g) => a + g.list.length, 0);
  return `
    <h2 class="section-title">Wörter aus den Lektionen · ${total}</h2>
    ${groups.map(({ l, list }) => `
      <details class="card word-group">
        <summary><b>${esc(l.title)}</b> <span class="small muted">· ${list.length} Wörter</span></summary>
        <div class="phrase-list word-list">
          ${list.map((w) => `
            <div class="phrase-item">
              ${playBtn(w.en)}
              <div class="grow"><b>${esc(w.en)}</b> <span class="word-de">${esc(w.de)}</span></div>
              ${cards[w.id].due <= t ? '<span class="due-dot" title="fällig"></span>' : ''}
            </div>`).join('')}
        </div>
      </details>`).join('')}`;
}

function wordsHtml(cards, t) {
  const list = (getState().words || []).filter((w) => cards[w.id]).slice().reverse();
  if (!list.length) return '';
  return `
    <h2 class="section-title">Nachgeschlagene Wörter · ${list.length}</h2>
    <div class="card phrase-list">
      ${list.map((w) => `
        <div class="phrase-item">
          ${playBtn(w.en)}
          <div class="grow"><b>${esc(w.en)}</b><span>${esc(w.de)}</span></div>
          ${cards[w.id].due <= t ? '<span class="due-dot" title="fällig"></span>' : ''}
        </div>`).join('')}
    </div>`;
}

function mistakesHtml(cards, t) {
  const list = getState().mistakes.filter((m) => m.id && cards[m.id]).slice().reverse();
  if (!list.length) return '';
  return `
    <h2 class="section-title">Meine Fehler · ${list.length}</h2>
    <div class="card phrase-list">
      ${list.map((m) => `
        <div class="phrase-item">
          ${playBtn(m.better)}
          <div class="grow"><b>${esc(m.better)}</b><span>statt <s>${esc(m.wrong)}</s>${m.why ? ` · ${esc(m.why)}` : ''}</span></div>
          ${cards[m.id].due <= t ? '<span class="due-dot" title="fällig"></span>' : ''}
        </div>`).join('')}
    </div>`;
}

// ---------------------------------------------------------------- progress & settings
function renderProgress() {
  const s = getState();
  const lessonsDone = Object.values(s.lessons).filter((l) => l.done).length;
  const spoken = Object.values(s.speaking).reduce((a, x) => a + x.count, 0);
  const minutes = Math.round(totalSeconds() / 60);
  const t = today();
  // current week Mon..Sun
  const dow = (new Date().getDay() + 6) % 7;
  const monday = addDays(t, -dow);
  const names = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const week = names.map((n, i) => {
    const d = addDays(monday, i);
    return `<div class="week-day"><div class="week-dot ${isActiveDay(d) ? 'on' : ''} ${d === t ? 'today' : ''}">${isActiveDay(d) ? icon.check : ''}</div>${n}</div>`;
  }).join('');

  app.innerHTML = `
    <div class="page-head"><h1 class="page-title">Fortschritt</h1></div>
    <div class="card"><div class="week">${week}</div></div>
    <div class="stats" style="margin-top:10px">
      <div class="stat"><b>🔥 ${streak()}</b><span>Tage in Folge (Rekord: ${bestStreak()})</span></div>
      <div class="stat"><b>${minutes}</b><span>Minuten geübt</span></div>
      <div class="stat"><b>${learnedIds().length}</b><span>Ausdrücke gelernt</span></div>
      <div class="stat"><b>${spoken}</b><span>Sätze gesprochen</span></div>
      <div class="stat"><b>${lessonsDone}</b><span>Lektionen geschafft</span></div>
      <div class="stat"><b>${Math.round(day().seconds / 60)}</b><span>Minuten heute</span></div>
    </div>

    <h2 class="section-title">Mikrofon-Test</h2>
    <div class="card">
      <p class="small muted">Tippe aufs Mikrofon und sag: <b>„Hello, my name is Miri.“</b></p>
      <div class="row" style="margin-top:12px">
        <button class="mic" data-mictest style="width:56px;height:56px" aria-label="Mikrofon testen">${icon.mic}</button>
        <p class="grow" data-micout>${canListen ? '' : esc(errorMessage('unsupported'))}</p>
      </div>
    </div>

    <h2 class="section-title">Sicherung</h2>
    <div class="card">
      <p class="small" data-syncstatus>${syncStatusText()}</p>
      <p class="small muted" style="margin-top:10px">Dein persönlicher Sicherungscode – damit holst du deinen Fortschritt auf ein neues Handy:</p>
      <div class="row" style="margin-top:8px">
        <code class="sync-code grow">${esc(getCode())}</code>
        <button class="btn btn-soft btn-sm" data-copycode>Kopieren</button>
      </div>
      <details class="example-answer" style="margin-top:14px">
        <summary>Fortschritt von einem anderen Gerät holen</summary>
        <p class="small muted" style="margin-top:8px">Gib den Code ein, der auf dem anderen Gerät steht. Beide Stände werden zusammengeführt – es geht nichts verloren.</p>
        <div class="row" style="margin-top:8px">
          <input class="code-input grow" data-restorecode placeholder="XXXX-XXXX-XXXX-XXXX" autocapitalize="characters" autocomplete="off" spellcheck="false">
          <button class="btn btn-sm" data-restore>Holen</button>
        </div>
      </details>
    </div>

    <h2 class="section-title">Stimme des Handys</h2>
    <div class="card">
      <p class="small muted">Für Raluca, Korrekturen – und alles, wenn die natürliche Stimme aus ist. Tippe ▶ zum Anhören, dann auf den Namen zum Auswählen.</p>
      <div data-voices style="margin-top:10px"></div>
      <details class="example-answer" style="margin-top:12px">
        <summary>Bessere Stimme aufs iPhone holen</summary>
        <p class="small muted" style="margin-top:6px">Einstellungen › Bedienungshilfen › Gesprochene Inhalte › Stimmen › Englisch › z. B. <b>Ava (Premium)</b> oder <b>Zoe (Premium)</b> laden. Danach die App komplett schließen und neu öffnen – wenn die Stimme hier mit ⭐ erscheint, kann die App sie nutzen.</p>
      </details>
    </div>

    <h2 class="section-title">Einstellungen</h2>
    <div class="card">
      <div class="setting">
        <div><b>Aussprache</b><p class="small muted">Für Vorlesen und Spracherkennung</p></div>
        <div class="seg" data-setting="accent">
          <button data-v="en-US" aria-pressed="${s.settings.accent === 'en-US'}">🇺🇸 US</button>
          <button data-v="en-GB" aria-pressed="${s.settings.accent === 'en-GB'}">🇬🇧 UK</button>
        </div>
      </div>
      <div class="setting">
        <div><b>Natürliche Stimme (Lektionen)</b><p class="small muted">Kokoro – kostenlos, ohne Limit</p></div>
        <div class="seg" data-setting="naturalVoice">
          <button data-v="on" aria-pressed="${s.settings.naturalVoice !== false}">An</button>
          <button data-v="off" aria-pressed="${s.settings.naturalVoice === false}">Aus</button>
        </div>
      </div>
      <div class="setting">
        <div><b>Ralucas Stimme</b><p class="small muted">ElevenLabs (kostenloses Kontingent) oder die Stimme des Handys</p></div>
        <div class="seg" data-setting="samVoice">
          <button data-v="on" aria-pressed="${s.settings.samVoice !== false}">ElevenLabs</button>
          <button data-v="off" aria-pressed="${s.settings.samVoice === false}">Handy</button>
        </div>
      </div>
      <div class="setting">
        <div><b>Raluca animieren</b><p class="small muted">Aus, falls das Gespräch auf deinem Handy ruckelt</p></div>
        <div class="seg" data-setting="foxAnim">
          <button data-v="on" aria-pressed="${s.settings.foxAnim !== false}">An</button>
          <button data-v="off" aria-pressed="${s.settings.foxAnim === false}">Aus</button>
        </div>
      </div>
      <div class="setting">
        <div><b>Vorlese-Tempo</b></div>
        <div class="seg" data-setting="rate">
          <button data-v="0.8" aria-pressed="${s.settings.rate === 0.8}">Langsam</button>
          <button data-v="0.95" aria-pressed="${s.settings.rate === 0.95}">Normal</button>
        </div>
      </div>
      <div class="setting">
        <div><b>Fortschritt löschen</b><p class="small muted">Alles auf Anfang</p></div>
        <button class="btn btn-danger btn-sm" data-reset>Löschen</button>
      </div>
    </div>
    <p class="small muted center" style="margin-top:20px">Miri English · Version 1 · made with 💛</p>`;

  $$('[data-setting]').forEach((seg) => seg.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const key = seg.dataset.setting;
    s.settings[key] = key === 'rate' ? Number(b.dataset.v) : ['naturalVoice', 'samVoice', 'foxAnim'].includes(key) ? b.dataset.v === 'on' : b.dataset.v;
    save();
    $$('button', seg).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (key === 'foxAnim') { applyFoxSetting(); return; }
    if (key === 'samVoice') { say("Hey, it's Raluca! This is how I sound.", { role: 'sam' }); return; }
    say(key === 'rate' ? 'This is how fast I will speak.' : 'Hello Miri! This is how I sound.');
  }));

  $('[data-reset]').addEventListener('click', () => {
    if (window.confirm('Wirklich den ganzen Fortschritt löschen? Das kann man nicht rückgängig machen.')) {
      resetAll();
      toast('Fortschritt gelöscht');
      render();
    }
  });

  renderVoicePicker();

  $('[data-copycode]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(getCode()); toast('Code kopiert – heb ihn gut auf!'); }
    catch { toast('Bitte den Code abschreiben.'); }
  });
  $('[data-restore]').addEventListener('click', () => restoreFlow($('[data-restorecode]').value));

  const micBtn = $('[data-mictest]');
  const out = $('[data-micout]');
  let session = null;
  micBtn.addEventListener('click', () => {
    if (!canListen) return;
    if (session) { session.stop(); return; }
    micBtn.classList.add('listening');
    out.textContent = 'Ich höre zu …';
    session = listen({ onInterim: (txt) => { out.textContent = `„${txt}“`; } });
    session.promise
      .then((r) => { out.innerHTML = `✅ Verstanden: <b>„${esc(r.text)}“</b><br><span class="small muted">Das Mikrofon funktioniert!</span>`; })
      .catch((err) => { out.textContent = errorMessage(err.code); })
      .finally(() => { micBtn.classList.remove('listening'); session = null; });
  });
}

// ---------------------------------------------------------------- device voice picker
function renderVoicePicker() {
  const box = $('[data-voices]');
  if (!box) return;
  const s = getState();
  const list = englishVoices()
    .filter((v) => voiceQuality(v) > 0)
    .sort((a, b) => voiceQuality(b) - voiceQuality(a) || a.name.localeCompare(b.name));
  if (!list.length) {
    box.innerHTML = '<p class="small">Keine englische Stimme gefunden. Auf dem iPhone sind normalerweise welche dabei – App neu öffnen und nochmal schauen.</p>';
    return;
  }
  const chosen = s.settings.deviceVoice || '';
  const badge = (v) => (voiceQuality(v) >= 3 ? '⭐ Premium' : voiceQuality(v) === 2 ? '✨ Enhanced' : '');
  box.innerHTML = `
    <div class="voice-list">
      <button class="voice-row ${!chosen ? 'on' : ''}" data-pick="">
        <span class="grow"><b>Automatisch</b><br><span class="small muted">die beste verfügbare Stimme</span></span>
      </button>
      ${list.map((v) => `
        <div class="voice-row ${chosen === v.voiceURI ? 'on' : ''}">
          <button class="play" data-test="${esc(v.voiceURI)}" aria-label="Anhören">${icon.play}</button>
          <button class="grow voice-pick" data-pick="${esc(v.voiceURI)}">
            <b>${esc(v.name)}</b> <span class="small muted">${esc(v.lang)}</span>
            ${badge(v) ? `<span class="chip good" style="margin-left:4px">${badge(v)}</span>` : ''}
          </button>
        </div>`).join('')}
    </div>
    ${list.some((v) => voiceQuality(v) >= 2) ? '' : '<p class="small muted" style="margin-top:8px">Noch keine ⭐ Premium-Stimme sichtbar.</p>'}`;
  box.querySelectorAll('[data-test]').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    testDeviceVoice(b.dataset.test);
  }));
  box.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => {
    s.settings.deviceVoice = b.dataset.pick || '';
    save();
    renderVoicePicker();
    if (b.dataset.pick) testDeviceVoice(b.dataset.pick, 'Great, I will use this voice.');
  }));
}
window.addEventListener('voices-loaded', () => { if (location.hash === '#/progress') renderVoicePicker(); });

// ---------------------------------------------------------------- backup
function syncStatusText() {
  const t = status.lastPush;
  const ago = t ? Math.round((Date.now() - t) / 60000) : null;
  const when = ago === null ? '' : ago < 1 ? 'gerade eben' : ago < 60 ? `vor ${ago} Min.` : new Date(t).toLocaleString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  switch (status.state) {
    case 'syncing': return '⏳ Wird gesichert …';
    case 'offline': return `📴 Offline – wird gesichert, sobald du wieder Internet hast.${when ? ` Letzte Sicherung: ${when}` : ''}`;
    case 'error': return `⚠️ Sicherung gerade nicht möglich.${when ? ` Letzte Sicherung: ${when}` : ''}`;
    default: return t ? `✅ Automatisch gesichert – ${when}` : '⏳ Noch nicht gesichert';
  }
}
onStatus(() => { const el = $('[data-syncstatus]'); if (el) el.textContent = syncStatusText(); });

async function restoreFlow(input) {
  const code = normalizeCode(input);
  if (!code) { toast('Der Code hat 16 Zeichen, z. B. ABCD-EFGH-JKLM-NPQR.'); return; }
  try {
    await restore(code);
    toast('Fortschritt geholt! 🎉');
    go('today');
    render();
  } catch (e) {
    toast(e.message === 'not_found' ? 'Zu diesem Code gibt es keine Sicherung.' : 'Das hat nicht geklappt – prüf den Code und dein Internet.');
  }
}

// ---------------------------------------------------------------- start
let warnedVoice = false;
window.addEventListener('no-english-voice', () => {
  if (warnedVoice) return;
  warnedVoice = true;
  toast('Auf diesem Gerät ist keine englische Stimme installiert – deshalb klingt das Vorlesen deutsch.');
});
window.addEventListener('hashchange', render);
document.addEventListener('visibilitychange', () => {
  // a new day may have started while the app was in the background
  if (document.visibilityState === 'visible' && !document.body.classList.contains('in-session')) render();
});
// Lessons finished before word cards existed get their words now (spread over the next days).
function ensureWordCards() {
  const s = getState();
  const missing = LESSONS.filter((l) => s.lessons[l.id]?.done)
    .flatMap((l) => (l.words || []).map((w) => w.id))
    .filter((id) => !s.cards[id]);
  if (missing.length) addWordCards(missing);
}

function applyFoxSetting() {
  document.body.classList.toggle('no-fox-anim', getState().settings.foxAnim === false);
}

ensureWordCards();
applyFoxSetting();
render();
initSync().then((changed) => {
  ensureWordCards();
  if (changed && !document.body.classList.contains('in-session')) render();
});

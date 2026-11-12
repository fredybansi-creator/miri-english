// Miri English – new daily practice (rebuild step 1) with the Raluca game (step 2).
// Start page with Raluca → today's lesson (about 10 minutes) → done for today.
// Exercise types: Nachsprechen (repeat), Satz bauen (build), Sag es auf Englisch (say), Hörgeschichte (story).

import travel from './content/travel.js';
import friends from './content/friends.js';
import doctor from './content/doctor.js';
import { mountFox } from './fox.js';
import { play, playAll, stopAll, audioKey } from './audio.js';
import { startRecording, canRecord } from './rec.js';
import { getState, update, today, streak, backup, restore, log, readLog } from './store.js';
import { reminderState, registerWorker, turnOn, turnOff, sendTest } from './reminder.js';
import { BOWL_FULL, payDay, feed, bowlLevel, mood, MOOD_LINE, SHOP, itemById, buy, wear, takeOff, dress, TRICKS, nextTrick, addExtra, trickFromSpeech } from './game.js';
import { checkAnswer, markAnswer, tokens, sameSentence } from '../js/check.js';
import { aiFeedback, looksGerman } from '../js/ai.js';

// Topics in the order Miri does them; each lesson knows its topic.
const TOPICS = [travel, friends, doctor];
const LESSONS = TOPICS.flatMap((t) => t.lessons.map((l) => Object.assign(l, { topic: t })));
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
  document.body.classList.add('in-session'); // no tab bar inside a lesson (tabScreen takes it off)
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- which lesson is today's
function lessonById(id) { return LESSONS.find((l) => l.id === id); }
function nextLesson() { return LESSONS.find((l) => !getState().done[l.id]) || null; }
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

// ================================================================ tabs (like the old app)
// Heute = today's lesson with Raluca · Lektionen = all topics · Karten = flip cards
// Raluca = her mood, tricks, extra exercises and the shop · Fortschritt = numbers, code and help
const ICON = {
  today: '<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
  lessons: '<rect x="4" y="4" width="16" height="4.5" rx="1.5"/><rect x="4" y="10" width="16" height="4.5" rx="1.5"/><rect x="4" y="16" width="10" height="4.5" rx="1.5"/>',
  cards: '<rect x="3.5" y="6" width="13" height="15" rx="2.5"/><path d="M8 3.5h10a2.5 2.5 0 0 1 2.5 2.5v12"/>',
  raluca: '<path d="M5 4l4 5h6l4-5 1 9c0 4-3.6 7-8 7s-8-3-8-7z"/><circle cx="9.5" cy="12.5" r="1" fill="currentColor"/><circle cx="14.5" cy="12.5" r="1" fill="currentColor"/>',
  progress: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
};
const TABS = [
  { id: 'today', label: 'Heute', show: () => home() },
  { id: 'lessons', label: 'Lektionen', show: () => lessonsTab() },
  { id: 'cards', label: 'Karten', show: () => cardsTab() },
  { id: 'raluca', label: 'Raluca', show: () => ralucaTab() },
  { id: 'progress', label: 'Fortschritt', show: () => progressTab() },
];
const tabbar = document.getElementById('tabbar');

/** Show a tab page: page content + the tab bar at the bottom. */
function tabScreen(id, html) {
  screen(html);
  document.body.classList.remove('in-session');
  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  tabbar.innerHTML = `<div class="tabbar-inner">${TABS.map((t) => `
    <button class="tab" data-tab="${t.id}" ${t.id === id ? 'aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[t.id]}</svg>
      <span>${t.label}</span>
    </button>`).join('')}</div>`;
  tabbar.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => TABS.find((t) => t.id === b.dataset.tab).show()));
}
function openTab(id) { (TABS.find((t) => t.id === id) || TABS[0]).show(); }

function hud() {
  const st = getState();
  return `<div class="hud">
    <button class="pill" data-go="raluca" aria-label="Münzen – zum Shop"><span class="coin"></span>${st.coins}</button>
    <div class="pill" title="Tage in Folge">🔥 ${streak()}</div>
  </div>`;
}
function wireGo() { app.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => openTab(b.dataset.go))); }

/** Raluca on a stage with her speech bubble; tap = greet or listen for a trick. */
function ralucaStage(stageSel = '#stage') {
  const st = getState();
  const finishedToday = doneToday();
  const m = mood();
  const learned = TRICKS.filter((t) => st.tricks.includes(t.id));
  const stage = $(stageSel);
  const bubble = $('#bubble', stage);
  const fox = mountFox(stage);
  stage.appendChild(bubble);
  fox.setMood(finishedToday ? 'happy' : m);
  dress(stage);
  fox.el.addEventListener('click', () => (learned.length ? listenForTrick(fox) : greet(fox, m, finishedToday)));
  return fox;
}
function bubbleHtml() {
  const st = getState();
  const finishedToday = doneToday();
  const m = mood();
  const line = finishedToday ? MOOD_LINE.happy : MOOD_LINE[m];
  const learned = TRICKS.some((t) => st.tricks.includes(t.id));
  return `<div class="bubble" id="bubble"><span id="bubbleText">${esc(line.en)}</span><small id="bubbleHint">${learned && (m === 'ok' || finishedToday) ? 'Tippe auf mich und sag einen Trick' : esc(line.de)}</small></div>`;
}

// ---------------------------------------------------------------- Heute
function home() {
  const st = getState();
  const next = nextLesson();
  const finishedToday = doneToday();
  const run = st.run && lessonById(st.run.lessonId) ? st.run : null;

  let card;
  if (run) {
    const l = lessonById(run.lessonId);
    card = `
      <div class="card today">
        <p class="kicker">${run.extra ? 'Extra-Übung' : 'Angefangen'}</p>
        <h2>${run.extra ? 'Extra-Übung' : esc(l.title)}</h2>
        ${run.extra ? '' : `<p class="muted">${esc(l.goal)}</p>`}
        <button class="btn primary big" id="go">Weitermachen</button>
      </div>`;
  } else if (finishedToday) {
    card = `
      <div class="card today done">
        <p class="kicker">Heute</p>
        <h2>Fertig für heute! 🎉</h2>
        <p class="muted">Raluca ist stolz auf dich. Morgen geht es weiter${next ? ` mit „${esc(next.title)}“` : ''}.</p>
        <button class="btn" data-go="cards">🃏 Karten üben</button>
        ${next ? '<button class="btn link" id="ahead">Trotzdem schon die nächste Lektion machen</button>' : ''}
      </div>`;
  } else if (next) {
    const n = next.topic.lessons.indexOf(next) + 1;
    card = `
      <div class="card today">
        <p class="kicker">Heute · ${esc(next.topic.title)} · Lektion ${n} von ${next.topic.lessons.length}</p>
        <h2>${esc(next.title)}</h2>
        <p class="muted">${esc(next.goal)}</p>
        <ul class="parts">
          <li><span>🔁</span>Nachsprechen</li>
          <li><span>🧩</span>Satz bauen</li>
          <li><span>🗣️</span>Sag es auf Englisch</li>
          <li><span>🎧</span>Hörgeschichte</li>
        </ul>
        <p class="small muted">ca. 10 Minuten · +10 Münzen, wenn du fertig bist</p>
        <button class="btn primary big" id="go">Los geht's</button>
      </div>`;
  } else {
    card = `
      <div class="card today done">
        <h2>Alle Lektionen geschafft! 🏆</h2>
        <p class="muted">Bald kommen neue Themen. Bis dahin: Karten üben und Lektionen wiederholen.</p>
        <button class="btn" data-go="cards">🃏 Karten üben</button>
      </div>`;
  }
  const due = dueCards().length;
  const st0 = getState();
  const fresh = !st0.days.length && !Object.keys(st0.done).length && !st0.coins && !run;
  const homeApp = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const restoreCard = fresh && homeApp ? `
    <div class="card"><h3>Schon in Safari geübt?</h3>
      <p class="small muted">Gib deinen Code ein, dann holt die App deinen Fortschritt, Münzen und Raluca.</p>
      <div class="row"><input id="restoreCode" placeholder="Code eingeben" autocapitalize="characters" autocomplete="off"><button class="btn small" id="restoreBtn">Laden</button></div>
      <p class="muted small" id="restoreMsg"></p></div>` : '';

  tabScreen('today', `
    <header class="top"><h1>Hallo Miri!</h1>${hud()}</header>
    <div class="stage" id="stage">${bubbleHtml()}</div>
    <div class="bowl"><span>🥣 Napf</span><div class="meter"><i style="width:${Math.round(bowlLevel() * 100)}%"></i></div><span class="muted small">${bowlLevel() >= 1 ? 'voll!' : 'füllt sich mit jeder Übung'}</span></div>
    ${restoreCard}
    ${card}
    ${due && !run && !finishedToday ? `<button class="btn" data-go="cards">🃏 ${due} ${due === 1 ? 'Karte' : 'Karten'} zum Wiederholen</button>` : ''}
    ${['off', 'homescreen'].includes(reminderState()) ? '<button class="btn link" data-go="progress">🔔 Erinnerung um 19 Uhr einschalten</button>' : ''}
  `);
  ralucaStage();
  wireGo();
  const go = $('#go');
  if (go) go.addEventListener('click', () => (run ? resume() : startLesson(next)));
  const ahead = $('#ahead');
  if (ahead) ahead.addEventListener('click', () => startLesson(next));
  if ($('#restoreBtn')) wireRestore();
}

// ---------------------------------------------------------------- Lektionen
function lessonsTab() {
  const st = getState();
  const next = nextLesson();
  tabScreen('lessons', `
    <header class="top"><h1>Lektionen</h1>${hud()}</header>
    <p class="muted small">Jeden Tag eine Lektion, der Reihe nach. Fertige Lektionen kannst du immer wiederholen.</p>
    ${TOPICS.map((t) => `
    <section class="topic">
      <h3>${esc(t.title)} <span class="muted">${t.lessons.filter((l) => st.done[l.id]).length} von ${t.lessons.length}</span></h3>
      <ol class="lessons">
        ${t.lessons.map((l, i) => `
          <li class="${st.done[l.id] ? 'ok' : ''} ${next && next.id === l.id ? 'next' : ''}">
            <span class="dot">${st.done[l.id] ? '✓' : i + 1}</span>
            <span class="t">${esc(l.title)}<small>${esc(l.goal)}</small></span>
            ${st.done[l.id] ? `<button class="btn small" data-again="${l.id}">Wiederholen</button>`
              : next && next.id === l.id ? `<button class="btn small primary" data-again="${l.id}">Start</button>` : ''}
          </li>`).join('')}
      </ol>
    </section>`).join('')}
  `);
  wireGo();
  app.querySelectorAll('[data-again]').forEach((b) => b.addEventListener('click', () => startLesson(lessonById(b.dataset.again))));
}

// ---------------------------------------------------------------- Karten (flip cards, simple boxes 1–5)
// Every finished lesson gives cards: its "Nachsprechen" and "Satz bauen" sentences (German → English).
// Box 1 comes back the next day, then after 2, 4, 8 and 16 days. "Nochmal" puts a card back to box 1.
const BOX_DAYS = [1, 2, 4, 8, 16];
const CARDS_PER_ROUND = 12;
function allCards() {
  const st = getState();
  return LESSONS.filter((l) => st.done[l.id]).flatMap((l) =>
    [...l.repeat, ...l.build].map((x) => ({ id: audioKey(x.en), en: x.en, de: x.de, lesson: l })));
}
function dueCards() {
  const c = getState().cards, now = today();
  return allCards().filter((x) => !c[x.id] || c[x.id].due <= now);
}
function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return today(d); }

function cardsTab() {
  const all = allCards(), due = dueCards();
  const c = getState().cards;
  const known = all.filter((x) => c[x.id] && c[x.id].box >= 3).length;
  tabScreen('cards', `
    <header class="top"><h1>Karten</h1>${hud()}</header>
    <div class="card center">
      ${all.length ? `
        <p class="big-num">${due.length}</p>
        <p class="muted">${due.length === 1 ? 'Karte ist' : 'Karten sind'} heute dran</p>
        ${due.length ? `<button class="btn primary big" id="startCards">Karten üben</button>` : '<p>Alles wiederholt für heute! 🎉</p>'}
        <p class="small muted">${all.length} Karten insgesamt · ${known} gut gelernt</p>`
      : '<h2>Noch keine Karten</h2><p class="muted">Nach jeder fertigen Lektion kommen ihre Sätze hier als Karten dazu.</p><button class="btn primary" data-go="today">Zur Lektion von heute</button>'}
    </div>
    <p class="small muted">So geht's: Du siehst den Satz auf Deutsch. Sag ihn laut auf Englisch, dann dreh die Karte um. Wusstest du ihn, kommt er erst später wieder.</p>
  `);
  wireGo();
  const b = $('#startCards');
  if (b) b.addEventListener('click', () => cardRound(shuffle(due).slice(0, CARDS_PER_ROUND)));
}

function cardRound(list, i = 0, right = 0) {
  if (i >= list.length) {
    feed(1);
    backup();
    screen(`
      <div class="stage small" id="stage"></div>
      <div class="card center">
        <h2>Karten geschafft! 🎉</h2>
        <p class="big-num">${right} von ${list.length}</p>
        <p class="muted">gewusst</p>
        <button class="btn primary big" id="back">Fertig</button>
      </div>`);
    const fox = mountFox($('#stage'));
    dress($('#stage'));
    fox.setMood('happy');
    setTimeout(() => fox.trick('happy'), 300);
    $('#back').addEventListener('click', cardsTab);
    return;
  }
  const card = list[i];
  screen(`
    <header class="bar">
      <button class="x" id="quit" aria-label="Zurück">✕</button>
      <div class="progress"><i style="width:${Math.round((i / list.length) * 100)}%"></i></div>
      <span class="count">${i + 1}/${list.length}</span>
    </header>
    ${miniFox('Karten')}
    <main class="ex">
      <button class="flip" id="flip">
        <span class="de big">${esc(card.de)}</span>
        <span class="small muted" id="flipHint">Sag es laut auf Englisch – dann tippe hier</span>
        <span class="en big" id="flipEn" hidden>${esc(card.en)}</span>
      </button>
      <div id="flipPlay" hidden>${listenButtons(card.en)}</div>
    </main>
    <footer class="actions" id="actions"></footer>`);
  mountMiniFox();
  $('#quit').addEventListener('click', cardsTab);
  $('#flip').addEventListener('click', () => {
    if (!$('#flipEn').hidden) return;
    $('#flipEn').hidden = false;
    $('#flipPlay').hidden = false;
    $('#flipHint').hidden = true;
    wirePlayButtons();
    play(card.en);
    $('#actions').innerHTML = '<div class="row"><button class="btn big grow" id="again">Nochmal</button><button class="btn primary big grow" id="knew">Gewusst ✓</button></div>';
    const grade = (ok) => {
      update((s) => {
        const old = s.cards[card.id] || { box: 0 };
        const box = ok ? Math.min(BOX_DAYS.length, old.box + 1) : 1;
        s.cards[card.id] = { box, due: addDays(BOX_DAYS[box - 1]) };
      });
      cardRound(list, i + 1, right + (ok ? 1 : 0));
    };
    $('#again').addEventListener('click', () => grade(false));
    $('#knew').addEventListener('click', () => grade(true));
  });
}

// ---------------------------------------------------------------- Raluca (mood, tricks, extra exercises, shop)
function ralucaTab(cheer = false) {
  const st = getState();
  const nt = nextTrick();
  const learned = TRICKS.filter((t) => st.tricks.includes(t.id));
  const canExtra = LESSONS.some((l) => st.done[l.id]);
  const run = st.run && lessonById(st.run.lessonId) ? st.run : null;
  tabScreen('raluca', `
    <header class="top"><h1>Raluca</h1>${hud()}</header>
    <div class="stage" id="stage">${bubbleHtml()}</div>
    <div class="bowl"><span>🥣 Napf</span><div class="meter"><i style="width:${Math.round(bowlLevel() * 100)}%"></i></div><span class="muted small">${bowlLevel() >= 1 ? 'voll!' : 'füllt sich mit jeder Übung'}</span></div>
    <div class="card tricks">
      <h3>Tricks</h3>
      ${learned.length
        ? `<p class="small">Tippe auf Raluca und sag: ${learned.map((t) => `<b>${esc(t.name)}</b>`).join(' · ')}</p>`
        : '<p class="small muted">Raluca kann noch keine Tricks. Mit Extra-Übungen lernt sie welche.</p>'}
      ${nt ? `
        <div class="trickbar"><span>Nächster Trick: <b>${esc(nt.trick.name)}</b></span><span class="muted">${nt.have} von ${nt.need}</span></div>
        <div class="meter"><i style="width:${Math.round((nt.have / nt.need) * 100)}%"></i></div>` : '<p class="small">Raluca kann alle Tricks! 🏆</p>'}
      ${canExtra && !run ? '<button class="btn" id="extraEx">➕ Extra-Übung machen</button>'
        : canExtra ? '' : '<p class="small muted">Extra-Übungen gibt es nach deiner ersten Lektion.</p>'}
    </div>
    <h3 class="shop-title">Shop <span class="muted small">Münzen: ${st.coins}</span></h3>
    <div class="shop">
      ${SHOP.map((it) => {
        const owned = st.owned.includes(it.id);
        const worn = st.wearing[it.slot] === it.id;
        const blocked = it.needs && !st.owned.includes(it.needs);
        const btn = owned
          ? `<button class="btn small ${worn ? '' : 'primary'}" data-${worn ? 'off' : 'on'}="${it.id}">${worn ? 'Ausziehen' : 'Anziehen'}</button>`
          : blocked ? `<span class="small muted">Erst ${esc(itemById(it.needs).name)}</span>`
          : `<button class="btn small primary" data-buy="${it.id}" ${st.coins < it.price ? 'disabled' : ''}><span class="coin"></span> ${it.price}</button>`;
        return `<div class="item ${worn ? 'worn' : ''}">
          <svg viewBox="${it.slot === 'leash' ? '-10 130 200 150' : it.slot === 'neck' ? '120 220 110 60' : it.slot === 'eyes' ? '120 140 100 40' : '120 70 110 60'}" class="thumb" aria-hidden="true">${it.svg}</svg>
          <b>${esc(it.name)}</b>
          ${btn}
        </div>`;
      }).join('')}
    </div>
    <p class="small muted">Münzen: 10 für jeden Tag mit einer fertigen Lektion, +15 Bonus an 3 Tagen in Folge, +50 an jedem 7. Tag in Folge.</p>
  `);
  const fox = ralucaStage();
  wireGo();
  const ex = $('#extraEx');
  if (ex) ex.addEventListener('click', startExtra);
  if (cheer) setTimeout(() => fox.trick('happy'), 50);
  const redraw = (c) => { const y = window.scrollY; ralucaTab(c); window.scrollTo(0, y); };
  app.querySelectorAll('[data-buy]').forEach((b) => b.addEventListener('click', () => {
    if (buy(b.dataset.buy)) { log('Gekauft: ' + b.dataset.buy); backup(); play('Thank you, Miri! I love it!'); redraw(true); }
  }));
  app.querySelectorAll('[data-on]').forEach((b) => b.addEventListener('click', () => { wear(b.dataset.on); redraw(false); }));
  app.querySelectorAll('[data-off]').forEach((b) => b.addEventListener('click', () => { takeOff(b.dataset.off); redraw(false); }));
}

// ---------------------------------------------------------------- Fortschritt
function progressTab() {
  const st = getState();
  const doneLessons = LESSONS.filter((l) => st.done[l.id]);
  const all = allCards();
  const known = all.filter((x) => st.cards[x.id] && st.cards[x.id].box >= 3).length;
  // last 4 weeks, Monday first
  const set = new Set(st.days);
  const start = new Date(); start.setDate(start.getDate() - 27 - ((start.getDay() + 6) % 7));
  const cells = [];
  for (let d = new Date(start); today(d) <= today(); d.setDate(d.getDate() + 1)) cells.push({ day: today(d), n: d.getDate() });
  tabScreen('progress', `
    <header class="top"><h1 id="secret">Fortschritt</h1>${hud()}</header>
    <div id="cheat"></div>
    <div class="stats">
      <div class="stat"><b>🔥 ${streak()}</b><span>Tage in Folge</span></div>
      <div class="stat"><b>${st.days.length}</b><span>Übungstage</span></div>
      <div class="stat"><b>${doneLessons.length}/${LESSONS.length}</b><span>Lektionen</span></div>
      <div class="stat"><b>${known}</b><span>Karten gelernt</span></div>
    </div>
    <div class="card">
      <h3>Die letzten Wochen</h3>
      <div class="cal">${['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((x) => `<span class="h">${x}</span>`).join('')}${cells.map((c) => `<span class="${set.has(c.day) ? 'on' : ''} ${c.day === today() ? 'now' : ''}">${c.n}</span>`).join('')}</div>
    </div>
    <div class="card">
      <h3>Themen</h3>
      ${TOPICS.map((t) => { const n = t.lessons.filter((l) => st.done[l.id]).length; return `
        <div class="trickbar"><span>${esc(t.title)}</span><span class="muted">${n} von ${t.lessons.length}</span></div>
        <div class="meter"><i style="width:${Math.round((n / t.lessons.length) * 100)}%"></i></div>`; }).join('')}
    </div>
    ${reminderCard()}
    <details class="more">
      <summary>Mein Code und Hilfe</summary>
      <p>Dein Fortschritt wird automatisch gesichert. Mit diesem Code holst du ihn auf ein neues Handy:</p>
      <p class="code">${esc(st.code)}</p>
      <div class="row"><input id="restoreCode" placeholder="Code eingeben" autocapitalize="characters" autocomplete="off"><button class="btn small" id="restoreBtn">Laden</button></div>
      <p class="muted" id="restoreMsg"></p>
      <button class="btn small" id="copyLog">Protokoll kopieren (für Claude)</button>
    </details>
  `);
  wireGo();
  wireReminder();
  wireCheat();
  wireRestore();
  $('#copyLog').addEventListener('click', async (ev) => {
    const text = `Miri English (neu)\n${navigator.userAgent}\n\n${readLog().join('\n')}`;
    try { await navigator.clipboard.writeText(text); ev.target.textContent = 'Kopiert ✓'; } catch { ev.target.textContent = 'Kopieren ging nicht'; }
  });
}

function wireRestore() {
  $('#restoreBtn').addEventListener('click', async () => {
    const msg = $('#restoreMsg');
    msg.textContent = 'Wird geladen …';
    try {
      const ok = await restore($('#restoreCode').value);
      if (ok) { msg.textContent = 'Geladen!'; setTimeout(home, 600); } else msg.textContent = 'Zu diesem Code gibt es nichts.';
    } catch (e) { msg.textContent = e.message.includes('16') ? e.message : 'Das ging nicht. Stimmt der Code?'; }
  });
}

// ---------------------------------------------------------------- reminder at 19:00 (Fortschritt tab)
function reminderCard() {
  const st = reminderState();
  const body = {
    on: '<p>✅ An. Raluca erinnert dich um 19 Uhr, wenn du an dem Tag noch keine Lektion gemacht hast.</p><div class="row"><button class="btn small" id="remTest">Test-Nachricht senden</button><button class="btn small" id="remOff">Ausschalten</button></div>',
    off: '<p class="muted">Raluca erinnert dich um 19 Uhr, wenn du an dem Tag noch keine Lektion gemacht hast.</p><button class="btn primary" id="remOn">Erinnerung einschalten</button>',
    homescreen: `<p>Auf dem iPhone geht das nur, wenn die App auf dem Home-Bildschirm ist:</p><ol class="steps"><li>Schreib dir deinen Code auf: <b class="code">${esc(getState().code)}</b> (die App auf dem Home-Bildschirm fängt sonst leer an)</li><li>Unten in Safari auf <b>Teilen</b> tippen (Viereck mit Pfeil)</li><li><b>Zum Home-Bildschirm</b> wählen, dann <b>Hinzufügen</b></li><li>Die App über das neue Symbol öffnen und hier die Erinnerung einschalten</li></ol>`,
    blocked: '<p>Mitteilungen sind für diese App ausgeschaltet. Einschalten: <b>Einstellungen › Mitteilungen › Miri English</b>.</p>',
    unsupported: '<p class="muted">Dieses Handy oder dieser Browser kann leider keine Erinnerungen zeigen.</p>',
  }[st];
  return `<div class="card" id="remCard"><h3>🔔 Erinnerung um 19 Uhr</h3>${body}<p class="small muted" id="remMsg"></p></div>`;
}
function wireReminder() {
  const msg = (t) => { const m = $('#remMsg'); if (m) m.textContent = t; };
  const redraw = () => { const c = $('#remCard'); if (c) { c.outerHTML = reminderCard(); wireReminder(); } };
  const on = $('#remOn'), off = $('#remOff'), test = $('#remTest');
  if (on) on.addEventListener('click', async () => {
    on.disabled = true; msg('Einen Moment …');
    try { await turnOn(); backup(); redraw(); msg('Eingeschaltet! 🎉'); } catch (e) { on.disabled = false; msg(e.message.startsWith('Du') ? e.message : 'Das ging nicht: ' + e.message); log('Erinnerung Fehler: ' + e.message); }
  });
  if (off) off.addEventListener('click', async () => { await turnOff(); redraw(); });
  if (test) test.addEventListener('click', async () => {
    msg('Wird gesendet …');
    try { await sendTest(); msg('Gesendet. Die Nachricht kommt in ein paar Sekunden.'); } catch (e) { msg('Das ging nicht: ' + e.message); log('Test-Nachricht Fehler: ' + e.message); }
  });
}

// ---------------------------------------------------------------- Freddy's secret coin cheat
// Tap the title "Fortschritt" 7 times quickly → a small hidden panel.
function wireCheat() {
  let taps = [];
  $('#secret').addEventListener('click', () => {
    const now = Date.now();
    taps = taps.filter((t) => now - t < 3000).concat(now);
    if (taps.length < 7) return;
    taps = [];
    const box = $('#cheat');
    box.innerHTML = `<div class="card cheat"><h3>🤫 Geheim</h3>
      <div class="row wrap"><button class="btn small" data-coins="50">+50 Münzen</button><button class="btn small" data-coins="200">+200 Münzen</button>
      <button class="btn small" id="cheatExtra">+1 Extra-Übung</button><button class="btn small" id="cheatBowl">Napf füllen</button></div>
      <p class="small muted" id="cheatMsg"></p></div>`;
    const say = (t) => { $('#cheatMsg').textContent = t; };
    box.querySelectorAll('[data-coins]').forEach((b) => b.addEventListener('click', () => {
      const n = Number(b.dataset.coins);
      update((s) => { s.coins += n; });
      log('Geheim: +' + n + ' Münzen');
      backup();
      say(`+${n} Münzen · jetzt ${getState().coins}`);
      const pill = app.querySelector('.hud .pill');
      if (pill) pill.innerHTML = `<span class="coin"></span>${getState().coins}`;
    }));
    $('#cheatExtra').addEventListener('click', () => {
      const tr = addExtra();
      backup();
      log('Geheim: +1 Extra-Übung');
      say(tr ? `Raluca kann jetzt ${tr.name}` : 'Extra-Übung gezählt');
    });
    $('#cheatBowl').addEventListener('click', () => { feed(BOWL_FULL); log('Geheim: Napf gefüllt'); say('Napf ist voll'); });
  });
}

// ---------------------------------------------------------------- small Raluca in the exercises (just sits there)
function miniFox(label) {
  return `<div class="exhead"><p class="type">${esc(label)}</p><div class="minifox" id="minifox" aria-hidden="true"></div></div>`;
}
function mountMiniFox() {
  const el = $('#minifox');
  if (!el) return;
  const fox = mountFox(el);
  dress(el);
  fox.setMood('happy');
  // only Raluca herself: no sky, grass or bowl, and cut to her size
  const svg = el.querySelector('svg');
  [...svg.children].forEach((n) => { if (!['defs', 'g'].includes(n.tagName) && n.id !== 'shadow') n.remove(); });
  svg.querySelectorAll(':scope > g:not(#mover)').forEach((n) => n.remove());
  svg.setAttribute('viewBox', '60 60 300 300');
}

function setBubble(en, de = '') {
  const t = $('#bubbleText'), h = $('#bubbleHint');
  if (t) t.textContent = en;
  if (h) h.textContent = de;
}

function greet(fox, m, finishedToday) {
  const line = finishedToday ? MOOD_LINE.happy : MOOD_LINE[m];
  setBubble(line.en, line.de);
  play(line.en);
  fox.trick(m === 'sad' || m === 'hungry' ? 'happy' : ['happy', 'jump', 'spin'][Math.floor(Math.random() * 3)]);
}

// Tap Raluca → she listens for 3 seconds → does the trick Miri said.
let listening = false;
async function listenForTrick(fox) {
  if (listening) return;
  listening = true;
  stopAll();
  setBubble('…', 'Mikro startet …');
  let session;
  try {
    session = await startRecording(() => {}, () => {}, null, 'She gives her pet fox a short dog command in English, like "Sit!", "Give paw!", "Jump!", "Spin!" or "Lie down!".');
  } catch (e) {
    setBubble('Oh!', e.message);
    listening = false;
    return;
  }
  setBubble('👂 I\'m listening!', 'Sag jetzt einen Trick, z. B. „Sit!“');
  await new Promise((r) => setTimeout(r, 2800));
  setBubble('🤔', 'Moment …');
  const r = await session.stop();
  listening = false;
  if (!document.body.contains(fox.el)) return;
  const said = r.text || '';
  const tr = trickFromSpeech(said);
  log(`Trick gehört: "${said}" → ${tr ? tr.id : '–'}`);
  if (tr && getState().tricks.includes(tr.id)) {
    setBubble(tr.name, `Du hast gesagt: „${said}“`);
    await fox.trick(tr.id);
    setBubble('Good girl!', 'Raluca ist stolz 🧡');
    play('Good girl!');
  } else if (tr) {
    setBubble('Hmm?', `„${tr.name}“ kann Raluca noch nicht. Mach Extra-Übungen!`);
  } else {
    const learned = TRICKS.filter((t) => getState().tricks.includes(t.id)).map((t) => t.name).join(', ');
    setBubble('Hmm?', r.error ? r.error : `Das habe ich nicht verstanden${said ? ` („${said}“)` : ''}. Sag z. B.: ${learned}`);
  }
}


// ================================================================ lesson flow
function startLesson(lesson) {
  if (!lesson) return home();
  update((s) => { s.run = { lessonId: lesson.id, step: 0, results: [], startedAt: Date.now() }; });
  log('Lektion gestartet: ' + lesson.id);
  resume();
}

// One short exercise from a lesson she already finished (repeat, build or say). Teaches Raluca tricks.
function startExtra() {
  const st = getState();
  const done = LESSONS.filter((l) => st.done[l.id]);
  if (!done.length) return home();
  const lesson = done[Math.floor(Math.random() * done.length)];
  const pool = stepsFor(lesson).filter((x) => ['repeat', 'build', 'say'].includes(x.type));
  const step = pool[Math.floor(Math.random() * pool.length)];
  update((s) => { s.run = { lessonId: lesson.id, extra: true, steps: [step], step: 0, results: [], startedAt: Date.now() }; });
  log(`Extra-Übung: ${lesson.id} ${step.type} ${step.i}`);
  resume();
}

function resume() {
  const run = getState().run;
  const lesson = run && lessonById(run.lessonId);
  if (!lesson) return home();
  const steps = run.extra ? run.steps : stepsFor(lesson);
  if (run.step >= steps.length) return run.extra ? finishExtra() : finishLesson(lesson);
  const step = steps[run.step];
  const frame = (inner, footer = '') => { screen(`
    <header class="bar">
      <button class="x" id="quit" aria-label="Zurück zum Start">✕</button>
      <div class="progress" aria-label="Fortschritt"><i style="width:${Math.round((run.step / steps.length) * 100)}%"></i></div>
      <span class="count">${run.extra ? 'Extra' : `${run.step + 1}/${steps.length}`}</span>
    </header>
    ${miniFox(TYPE_LABEL[step.type])}
    <main class="ex">${inner}</main>
    <footer class="actions" id="actions">${footer}</footer>
  `); mountMiniFox(); };
  const next = (ok) => {
    update((s) => { s.run.results[s.run.step] = ok; s.run.step++; });
    if (ok !== undefined) feed(1); // every exercise fills Raluca's bowl a little
    resume();
  };
  ({ repeat: exRepeat, build: exBuild, say: exSay, story: exStory, question: exQuestion })[step.type](lesson, step, frame, next);
  $('#quit').addEventListener('click', () => home());
}

function finishExtra() {
  update((s) => { s.run = null; });
  const learned = addExtra();
  const nt = nextTrick();
  backup();
  screen(`
    <div class="stage small" id="stage"></div>
    <div class="card center">
      ${learned
        ? `<h2>Neuer Trick! 🎉</h2><p>Raluca kann jetzt <b>${esc(learned.name)}</b></p><p class="small muted">Tippe im Raluca-Tab auf Raluca und sag „${esc(learned.name)}“.</p>`
        : `<h2>Extra geschafft! 💪</h2>${nt ? `<p>Nächster Trick <b>${esc(nt.trick.name)}</b>: ${nt.have} von ${nt.need}</p>` : ''}`}
      <button class="btn primary big" id="more">Noch eine Extra-Übung</button>
      <button class="btn" id="home">Zurück zu Raluca</button>
    </div>
  `);
  const stage = $('#stage');
  const fox = mountFox(stage);
  dress(stage);
  fox.setMood('happy');
  setTimeout(() => { if (learned) { fox.trick(learned.id); play('Good girl!'); } else fox.trick('happy'); }, 300);
  log(learned ? 'Trick gelernt: ' + learned.id : 'Extra-Übung fertig');
  $('#more').addEventListener('click', startExtra);
  $('#home').addEventListener('click', () => ralucaTab());
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
  const pay = payDay();
  log(`Lektion fertig: ${lesson.id} (${good}/${results.length}, ${minutes} Min.)${pay.earned ? `, +${pay.earned} Münzen` : ''}`);
  backup();
  const days = streak();
  screen(`
    <div class="stage small" id="stage"></div>
    <div class="card center">
      <h2>Geschafft! 🎉</h2>
      <p class="big-num">${good} von ${results.length}</p>
      <p class="muted">Übungen richtig · ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}</p>
      ${pay.earned ? `<p class="coins-won"><span class="coin"></span> +${pay.earned} Münzen${pay.bonus ? ` (mit ${pay.bonus} Bonus für ${days} Tage in Folge!)` : ''}</p>` : '<p class="small muted">Münzen gibt es einmal pro Tag.</p>'}
      <p>🔥 ${days} ${days === 1 ? 'Tag' : 'Tage'} in Folge · 🥣 Napf ${bowlLevel() >= 1 ? 'voll' : 'gefüllt'}</p>
      <button class="btn primary big" id="home">Zum Start</button>
    </div>
  `);
  const stage = $('#stage');
  const fox = mountFox(stage);
  dress(stage);
  fox.setMood('happy');
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
    const slow = setTimeout(() => { status.textContent = 'Noch einen kleinen Moment …'; }, 7000);
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
registerWorker();
log('App geöffnet');
openTab(location.hash.slice(1));
backup();

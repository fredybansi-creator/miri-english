// Lesson player: new phrases → tip → exercises → summary.
import { $, $$, esc, icon, playBtn, shuffle, buzz } from './ui.js';
import { shell, summary } from './sessions.js';
import { SPEAK } from '../content/index.js';
import { renderSpeak } from './speak.js';
import { sameSentence } from './check.js';
import { addCards } from './srs.js';
import { getState, save, today, markTask, addTime } from './store.js';
import { say, stopSpeaking } from './speech.js';

export function startLesson(lesson, { onExit }) {
  const started = Date.now();
  const steps = [
    ...lesson.phrases.map((p, i) => ({ type: 'phrase', p, n: i + 1, of: lesson.phrases.length })),
    { type: 'tip', tip: lesson.tip },
    ...lesson.exercises.map((e, i) => {
      if (e.type === 'speak') return { type: 'speak', item: SPEAK.get(e.id) };
      if (e.type === 'free') return { type: 'speak', item: { ...lesson.free, mode: 'free' } };
      if (e.type === 'shadow') return { type: 'speak', item: { id: `${lesson.id}-sh${i}`, mode: 'shadow', en: e.en, de: e.de } };
      return e;
    }),
  ];
  const baseTotal = steps.length;
  const retried = new Set();
  let pos = 0;
  let correct = 0, answered = 0;
  let current = null;

  const ui = shell({ onClose: () => { current?.destroy?.(); onExit(); } });

  function next() {
    current?.destroy?.();
    current = null;
    ui.progress(Math.min(pos, baseTotal), baseTotal);
    if (pos >= steps.length) return finish();
    const step = steps[pos];
    const go = (ok) => {
      if (ok !== undefined) { answered++; if (ok) correct++; }
      // wrong answers come back once at the end of the lesson
      if (ok === false && !retried.has(step) && step.type !== 'match') { retried.add(step); steps.push(step); }
      pos++;
      next();
    };
    const R = RENDER[step.type];
    current = R(ui.body, step, go) || null;
  }

  function finish() {
    const s = getState();
    const wasDone = s.lessons[lesson.id]?.done;
    const score = answered ? Math.round((correct / answered) * 100) : 100;
    s.lessons[lesson.id] = { done: true, date: wasDone ? s.lessons[lesson.id].date : today(), score: Math.max(score, s.lessons[lesson.id]?.score || 0) };
    save();
    addCards(lesson.phrases.map((p) => p.id));
    markTask('lesson');
    addTime((Date.now() - started) / 1000);
    ui.hideTop();
    summary(ui.body, {
      emoji: '🎉',
      title: 'Lektion geschafft!',
      text: `<b>${esc(lesson.title)}</b><br>${wasDone ? 'Gut wiederholt!' : `${lesson.phrases.length} neue Ausdrücke sind jetzt in deinen Karteikarten.`}`,
      stats: [[`${score}%`, 'richtig'], [String(lesson.phrases.length), 'Ausdrücke']],
      onDone: onExit,
    });
  }

  next();
}

// ---------------------------------------------------------------- feedback sheet
function feedback(root, { ok, title, text = '', extra = '' , onNext }) {
  const kind = ok === true ? 'good' : ok === false ? 'bad' : 'warn';
  const div = document.createElement('div');
  div.className = `feedback ${kind}`;
  div.innerHTML = `
    <h3>${ok === true ? '✓' : ok === false ? '✗' : '★'} ${esc(title)}</h3>
    ${text ? `<p>${text}</p>` : ''}
    ${extra}
    <button class="btn btn-block" data-next>Weiter</button>`;
  root.querySelector('.session-foot')?.remove();
  root.appendChild(div);
  ok ? buzz(15) : buzz([30, 40, 30]);
  div.querySelector('[data-next]').addEventListener('click', onNext);
  div.querySelector('[data-next]').focus({ preventScroll: true });
  div.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

const GOOD = ['Richtig!', 'Super!', 'Genau!', 'Klasse!'];
const pickGood = () => GOOD[Math.floor(Math.random() * GOOD.length)];

// ---------------------------------------------------------------- renderers
const RENDER = {
  phrase(root, { p, n, of }, go) {
    root.innerHTML = `
      <div class="kicker accent">Neu · ${n}/${of}</div>
      <div class="phrase-card">
        <div class="row">${playBtn(p.en, 'lg')}<p class="big-en grow">${esc(p.en)}</p></div>
        <p class="phrase-de">${esc(p.de)}</p>
        ${p.ex ? `<div class="example">${playBtn(p.ex)}<p>${esc(p.ex)}</p></div>` : ''}
        ${p.note ? `<p class="note"><span>💡</span><span>${esc(p.note)}</span></p>` : ''}
      </div>
      <p class="small muted" style="margin-top:22px">🗣️ Hör es dir an und sprich es laut nach.</p>
      <div class="grow"></div>
      <div class="session-foot"><button class="btn btn-block" data-next>Weiter</button></div>`;
    $('[data-next]', root).addEventListener('click', () => go());
  },

  tip(root, { tip }, go) {
    root.innerHTML = `
      <div class="kicker">💡 Gut zu wissen</div>
      <h2 class="q" style="margin-bottom:12px">${esc(tip.title)}</h2>
      <div class="tip-body">${tip.body}</div>
      ${(tip.examples || []).map((x) => `
        <div class="compare">
          <div class="bad"><span>✗</span><span>${esc(x.bad)}</span></div>
          <div class="good"><span>✓</span><span class="grow">${esc(x.good)}</span>${playBtn(x.good)}</div>
          ${x.why ? `<small>${esc(x.why)}</small>` : ''}
        </div>`).join('')}
      <div class="grow"></div>
      <div class="session-foot"><button class="btn btn-block" data-next>Verstanden</button></div>`;
    $('[data-next]', root).addEventListener('click', () => go());
  },

  choice(root, ex, go) {
    const order = shuffle(ex.options.map((o, i) => i));
    root.innerHTML = `
      <div class="kicker">Wähle die richtige Antwort</div>
      <p class="q">${esc(ex.q)}</p>
      <div class="options">${order.map((i) => `<button class="option" data-i="${i}">${esc(ex.options[i])}</button>`).join('')}</div>
      <div class="grow"></div>`;
    $$('.option', root).forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.i);
      const ok = i === ex.answer;
      $('.options', root).classList.add('answered');
      b.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) $(`.option[data-i="${ex.answer}"]`, root).classList.add('correct');
      const right = ex.options[ex.answer];
      if (/^[A-Za-z“"']/.test(right)) say(right);
      feedback(root, {
        ok, title: ok ? pickGood() : 'Nicht ganz',
        text: esc(ex.explain || ''),
        onNext: () => go(ok),
      });
    }));
  },

  gap(root, ex, go) {
    const [before, after] = ex.sentence.split('___');
    const order = shuffle(ex.options.map((o, i) => i));
    root.innerHTML = `
      <div class="kicker">Ergänze die Lücke</div>
      <p class="gap-sentence">${esc(before)}<span class="gap-blank" data-blank>&nbsp;</span>${esc(after)}</p>
      <div class="chips">${order.map((i) => `<button class="tile" data-i="${i}">${esc(ex.options[i])}</button>`).join('')}</div>
      <div class="grow"></div>`;
    $$('.tile', root).forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.i);
      const ok = i === ex.answer;
      const full = before + ex.options[ex.answer] + after;
      $('[data-blank]', root).textContent = ex.options[i];
      $('[data-blank]', root).style.color = ok ? 'var(--good)' : 'var(--bad)';
      $$('.tile', root).forEach((t) => (t.disabled = true));
      say(full);
      feedback(root, {
        ok, title: ok ? pickGood() : 'Nicht ganz',
        text: esc(ex.explain || ''),
        extra: `<div class="answer-line">${playBtn(full)}<p>${esc(full)}</p></div>`,
        onNext: () => go(ok),
      });
    }));
  },

  fix(root, ex, go) {
    const words = ex.sentence.split(' ');
    root.innerHTML = `
      <div class="kicker">Finde den Fehler</div>
      <p class="q">Tippe auf das Wort, das hier falsch ist.</p>
      <div class="fix-sentence">${words.map((w, i) => `<button class="tile" data-i="${i}">${esc(w)}</button>`).join('')}</div>
      <div class="grow"></div>`;
    $$('.fix-sentence .tile', root).forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.i);
      const ok = ex.wrong.includes(i);
      $$('.fix-sentence .tile', root).forEach((t) => {
        t.disabled = true;
        if (ex.wrong.includes(Number(t.dataset.i))) t.classList.add('is-error');
      });
      if (!ok) b.classList.add('wrong');
      say(ex.correct);
      feedback(root, {
        ok, title: ok ? pickGood() : 'Nicht ganz',
        text: esc(ex.explain || ''),
        extra: `<p class="small" style="margin-top:10px"><b>Richtig:</b></p><div class="answer-line" style="margin-top:4px">${playBtn(ex.correct)}<p>${esc(ex.correct)}</p></div>`,
        onNext: () => go(ok),
      });
    }));
  },

  listen(root, ex, go) {
    const order = shuffle(ex.options.map((o, i) => i));
    root.innerHTML = `
      <div class="kicker">🎧 Hör genau zu</div>
      <div class="listen-box">
        ${playBtn(ex.en, 'xl')}
        <button class="btn btn-ghost btn-sm" data-slow>🐢 Langsamer</button>
      </div>
      <p class="q">${esc(ex.q)}</p>
      <div class="options">${order.map((i) => `<button class="option" data-i="${i}">${esc(ex.options[i])}</button>`).join('')}</div>
      <div class="grow"></div>`;
    say(ex.en);
    $('[data-slow]', root).addEventListener('click', () => say(ex.en, { rate: 0.7 }));
    $$('.option', root).forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.i);
      const ok = i === ex.answer;
      $('.options', root).classList.add('answered');
      b.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) $(`.option[data-i="${ex.answer}"]`, root).classList.add('correct');
      feedback(root, {
        ok, title: ok ? pickGood() : 'Nicht ganz',
        text: esc(ex.explain || ''),
        extra: `<p class="small" style="margin-top:10px"><b>Gehört:</b></p><div class="answer-line" style="margin-top:4px">${playBtn(ex.en)}<p>${esc(ex.en)}</p></div>`,
        onNext: () => go(ok),
      });
    }));
  },

  listenbuild(root, ex, go) {
    return RENDER.build(root, { ...ex, answer: ex.en, audio: true }, go);
  },

  build(root, ex, go) {
    const words = ex.answer.split(' ');
    const bank = shuffle([...words, ...(ex.distractors || [])].map((w, i) => ({ w, i })));
    const chosen = [];
    root.innerHTML = `
      <div class="kicker">${ex.audio ? '🎧 Hör zu und bau den Satz' : 'Bau den Satz auf Englisch'}</div>
      ${ex.audio
        ? `<div class="listen-box">${playBtn(ex.answer, 'xl')}<button class="btn btn-ghost btn-sm" data-slow>🐢 Langsamer</button></div>`
        : `<p class="q-de">${esc(ex.de)}</p>`}
      <div class="build-area" data-area></div>
      <div class="chips" data-bank>${bank.map((t) => `<button class="tile" data-i="${t.i}">${esc(t.w)}</button>`).join('')}</div>
      <div class="grow"></div>
      <div class="session-foot"><button class="btn btn-block" data-check disabled>Prüfen</button></div>`;
    const area = $('[data-area]', root);
    const checkBtn = $('[data-check]', root);
    if (ex.audio) {
      say(ex.answer);
      $('[data-slow]', root).addEventListener('click', () => say(ex.answer, { rate: 0.7 }));
    }

    function draw() {
      area.innerHTML = chosen.map((t) => `<button class="tile" data-i="${t.i}">${esc(t.w)}</button>`).join('');
      $$('[data-bank] .tile', root).forEach((b) => b.classList.toggle('used', chosen.some((c) => String(c.i) === b.dataset.i)));
      checkBtn.disabled = !chosen.length;
    }
    $('[data-bank]', root).addEventListener('click', (e) => {
      const b = e.target.closest('.tile');
      if (!b || b.classList.contains('used')) return;
      chosen.push(bank.find((t) => String(t.i) === b.dataset.i));
      draw();
    });
    area.addEventListener('click', (e) => {
      const b = e.target.closest('.tile');
      if (!b) return;
      const k = chosen.findIndex((c) => String(c.i) === b.dataset.i);
      if (k >= 0) chosen.splice(k, 1);
      draw();
    });
    checkBtn.addEventListener('click', () => {
      const ok = sameSentence(chosen.map((c) => c.w).join(' '), ex.answer);
      $$('.tile', root).forEach((t) => (t.disabled = true));
      say(ex.answer);
      feedback(root, {
        ok, title: ok ? pickGood() : 'Fast!',
        text: ok ? '' : 'Richtig ist:',
        extra: `<div class="answer-line">${playBtn(ex.answer)}<p>${esc(ex.answer)}</p></div>`,
        onNext: () => go(ok),
      });
    });
  },

  match(root, ex, go) {
    const left = shuffle(ex.pairs.map((p, i) => ({ t: p[0], i })));
    const right = shuffle(ex.pairs.map((p, i) => ({ t: p[1], i })));
    let sel = { l: null, r: null };
    let matched = 0, mistakes = 0;
    root.innerHTML = `
      <div class="kicker">Finde die Paare</div>
      <p class="q">Tippe auf Englisch und Deutsch, die zusammengehören.</p>
      <div class="match">
        <div class="match-col">${left.map((x) => `<button class="match-item" data-side="l" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div>
        <div class="match-col">${right.map((x) => `<button class="match-item" data-side="r" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div>
      </div>
      <div class="grow"></div>`;
    $$('.match-item', root).forEach((b) => b.addEventListener('click', () => {
      const side = b.dataset.side;
      if (side === 'l') say(b.textContent);
      $$(`.match-item[data-side="${side}"]`, root).forEach((x) => x.classList.remove('selected'));
      b.classList.add('selected');
      sel[side] = b;
      if (sel.l && sel.r) {
        const a = sel.l, c = sel.r;
        sel = { l: null, r: null };
        if (a.dataset.i === c.dataset.i) {
          a.classList.add('matched'); c.classList.add('matched');
          a.classList.remove('selected'); c.classList.remove('selected');
          matched++;
          buzz(10);
          if (matched === ex.pairs.length) {
            setTimeout(() => feedback(root, {
              ok: mistakes === 0 ? true : null,
              title: mistakes === 0 ? 'Alle Paare richtig!' : 'Geschafft!',
              text: mistakes ? `Mit ${mistakes} ${mistakes === 1 ? 'Fehler' : 'Fehlern'} – gut gemacht.` : '',
              onNext: () => go(mistakes === 0),
            }), 250);
          }
        } else {
          mistakes++;
          [a, c].forEach((x) => { x.classList.remove('selected'); x.classList.add('wrong'); setTimeout(() => x.classList.remove('wrong'), 400); });
        }
      }
    }));
  },

  speak(root, { item }, go) {
    return renderSpeak(root, item, {
      onDone: (r) => go(r.level === 'great' || r.level === 'good' ? true : undefined),
    });
  },
};

export { stopSpeaking };

// Word lookup: she types (or highlights) a word she doesn't know and gets the German meaning in
// context, a short explanation and an example. One tap saves it as a flashcard.
import { esc, icon, playBtn, toast } from './ui.js';
import { PHRASES, WORDS } from '../content/index.js';
import { lookupWord } from './ai.js';
import { getState, today, addDays } from './store.js';
import { addCards } from './srs.js';

function wordId(word) {
  let h = 0;
  for (const ch of word.toLowerCase().trim()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `w-${h.toString(36)}`;
}

// Phrases from her lessons that contain the word – shown instantly, no AI needed.
function lessonMatches(word) {
  const w = word.toLowerCase().trim();
  if (w.length < 2) return [];
  const out = [];
  for (const p of [...WORDS.values(), ...PHRASES.values()]) {
    if (p.en.toLowerCase().includes(w)) out.push(p);
    if (out.length >= 3) break;
  }
  return out;
}

let sheet = null;

// On iPhone, tapping the 🔍 button clears the text selection – so remember the last selection.
let lastSelection = { text: '', at: 0 };
document.addEventListener('selectionchange', () => {
  const t = String(window.getSelection?.() || '').trim();
  if (t) lastSelection = { text: t, at: Date.now() };
});

export function closeLookup() {
  sheet?.remove();
  sheet = null;
}

/** @param context text around the word (e.g. the current exercise) so the meaning fits */
export function openLookup({ context = '' } = {}) {
  closeLookup();
  const selected = String(window.getSelection?.() || '').trim()
    || (Date.now() - lastSelection.at < 15000 ? lastSelection.text : '');
  lastSelection = { text: '', at: 0 };
  const prefill = selected && selected.length <= 60 && /[a-z]/i.test(selected) ? selected : '';

  sheet = document.createElement('div');
  sheet.className = 'lookup-overlay';
  sheet.innerHTML = `
    <div class="lookup-sheet" role="dialog" aria-label="Wort nachschlagen">
      <div class="row">
        <h3 class="grow">🔍 Wort nachschlagen</h3>
        <button class="icon-btn" data-close aria-label="Schließen">${icon.close}</button>
      </div>
      <form class="row" data-form style="margin-top:10px">
        <input class="code-input grow lookup-input" data-word value="${esc(prefill)}" placeholder="z. B. run into" autocapitalize="none" autocomplete="off" spellcheck="false" enterkeyhint="search">
        <button class="btn btn-sm" type="submit">Suchen</button>
      </form>
      <p class="small muted" style="margin-top:6px">Tipp: Du kannst ein Wort im Text markieren und dann auf 🔍 tippen.</p>
      <div data-out></div>
    </div>`;
  document.body.appendChild(sheet);

  const input = sheet.querySelector('[data-word]');
  const out = sheet.querySelector('[data-out]');
  sheet.addEventListener('click', (e) => { if (e.target === sheet) closeLookup(); });
  sheet.querySelector('[data-close]').addEventListener('click', closeLookup);
  sheet.querySelector('[data-form]').addEventListener('submit', (e) => { e.preventDefault(); search(); });
  if (prefill) search(); else setTimeout(() => input.focus(), 50);

  async function search() {
    const word = input.value.trim();
    if (!word) { input.focus(); return; }
    input.blur();
    const local = lessonMatches(word);
    const localHtml = local.length ? `
      <p class="small muted" style="margin-top:14px">Aus deinen Lektionen:</p>
      <div class="phrase-list">${local.map((p) => `
        <div class="phrase-item">${playBtn(p.en)}<div class="grow"><b>${esc(p.en)}</b><span>${esc(p.de)}</span></div></div>`).join('')}
      </div>` : '';
    out.innerHTML = `${localHtml}<p class="coach-wait"><span class="dots"></span> Wird nachgeschlagen …</p>`;
    try {
      const r = await lookupWord(word, context.slice(0, 300));
      const id = wordId(r.word);
      const saved = getState().words?.some((x) => x.id === id);
      out.innerHTML = `
        ${localHtml}
        <div class="lookup-result">
          <div class="row" style="align-items:center">
            ${playBtn(r.word)}
            <div class="grow"><b class="lookup-word">${esc(r.word)}</b>
              ${r.register !== 'neutral' ? `<span class="chip" style="margin-left:6px">${esc(r.register)}</span>` : ''}</div>
          </div>
          <p class="lookup-de">${esc(r.de)}</p>
          ${r.explanation ? `<p class="small muted" style="margin-top:4px">${esc(r.explanation)}</p>` : ''}
          ${r.example ? `<div class="example">${playBtn(r.example, '', 'coach')}<p>${esc(r.example)}<br><span class="small muted">${esc(r.exampleDe)}</span></p></div>` : ''}
          <button class="btn btn-block ${saved ? 'btn-soft' : ''}" data-save style="margin-top:14px" ${saved ? 'disabled' : ''}>
            ${saved ? '✓ Schon in deinen Karteikarten' : '＋ Als Karteikarte speichern'}</button>
        </div>`;
      out.querySelector('[data-save]')?.addEventListener('click', (e) => {
        const s = getState();
        s.words = s.words || [];
        if (!s.words.some((x) => x.id === id)) {
          s.words.push({ id, en: r.word, de: r.de, ex: r.example, exDe: r.exampleDe, note: r.explanation, date: today() });
          addCards([id], { due: addDays(today(), 1) }); // saves
        }
        e.currentTarget.disabled = true;
        e.currentTarget.classList.add('btn-soft');
        e.currentTarget.textContent = '✓ Gespeichert – kommt morgen als Karte';
        toast('Wort gespeichert 📌');
      });
    } catch {
      out.innerHTML = `${localHtml}<p class="small" style="margin-top:14px">⚠️ Nachschlagen klappt gerade nicht – prüf dein Internet und versuch es nochmal.</p>`;
    }
  }
}

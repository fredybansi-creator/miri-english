# Miri English

Daily English speaking practice for Miri – 10 minutes a day on her iPhone.

**Open the app:** https://fredybansi-creator.github.io/miri-english/

## What it does
- **Heute:** daily plan – one lesson, due flashcards, a speaking set.
- **Lessons:** new phrases → short tip (in German) → exercises (choice, gap, sentence builder, match pairs, voice translation).
- **Flashcards:** spaced repetition (Nochmal / Schwer / Gut / Leicht).
- **Speaking:** German sentence → say it in English → feedback with the words that make it more natural and a "level up" version.

## Project layout
| Path | What |
|---|---|
| `index.html`, `css/app.css` | page and styles |
| `js/app.js` | screens and navigation |
| `js/lesson.js` | lesson player and exercise types |
| `js/sessions.js` | flashcard session, daily speaking set |
| `js/speak.js`, `js/check.js`, `js/speech.js` | voice exercise, answer check, speech recognition / TTS |
| `js/store.js`, `js/srs.js` | progress storage, spaced repetition |
| `content/` | modules and lessons (`m1.js` = module 1) |
| `PROJECT.md` | decisions, requirements, build phases |

## Run locally
```bash
python -m http.server 8765
```
Then open http://localhost:8765.

No build step: plain HTML, CSS and JavaScript modules.

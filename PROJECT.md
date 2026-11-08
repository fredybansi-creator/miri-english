# Miri English – project notes

Personal web app for Miri (German, intermediate) to practise English 10 minutes a day on her iPhone.
Claude maintains the code; this file records the decisions so any session can pick up the work.

## Who Miri is
- Follows conversations, but misses vocabulary and gives short, simple answers.
- Goal: relaxed, natural English with her English-speaking friends.
- Wants to **speak**, not just study vocab lists – e.g. translate German sentences/dialogues out loud.
- Weak spots: speaking, listening, grammar, vocabulary, confidence (all of them).
- 10 minutes per day, iPhone (Safari).

## Decisions (2026-11-08)
- **Hosting:** GitHub repository + GitHub Pages (free, public repo – no secrets in code).
- **No login for Miri:** she opens the link, optionally adds it to her home screen.
- **Speech:** Safari's built-in speech recognition / speech synthesis (free).
- **Progress:** Supabase (free tier), separate project from Battlezone.
- **AI checking:** via a Supabase Edge Function that holds the API key.
  Start with Gemini free tier; switch to Claude API (~1–2 €/month) if quality is not good enough.
- **Stack:** plain HTML/CSS/JavaScript, no build step (Node is not installed and not needed).

## Concept (draft – waiting for requirements)
Daily 10 minutes:
1. Warm-up (2 min): ~5 spaced-repetition vocab cards from words she struggled with.
2. Speak the translation (5 min): German sentence → she says it in English → AI accepts any natural
   answer, shows what was good, the mistake, and a "level up" version.
3. Mini conversation (3 min): short spoken role-play; nudges her past one-word answers.

Content: everyday life with friends, typical German-speaker traps (false friends, since/for,
word order, present perfect vs. past), natural phrases.

## Requirements (from Freddy, 2026-11-08)
1. **Daily flashcards (Karteikarten)** every day.
2. **Modules** like a proper learning app, with **daily tasks**.
3. **Varied exercises**, including translating a German sentence into English **by voice**.
4. Spoken answers **don't need to be perfect**: the feedback tells her which words would make the
   sentence better / more natural (encouraging, not strict).
5. Use the **basic language-learning techniques** (see below).

## App structure (v1 plan)

### Screens
- **Heute (Today):** the daily plan, ~10 min, ticked off step by step:
  1. Due flashcards (max ~10–15, "Nochmal" cards first).
  2. Next lesson of the current module.
  3. One speaking set (3–5 sentences, voice translation).
  Plus streak, daily goal ring, "noch eine Runde" for extra practice.
- **Module:** learning path, units unlock one after the other; each shows progress.
- **Karteikarten:** all cards, due count, practise freely.
- **Meine Fehler / Wörterbuch:** words and phrases the AI suggested to her – each becomes a card.
- **Fortschritt:** streak, minutes, words learned, modules done.

### Module (each ~5 lessons, ~5–7 min per lesson)
Lesson pattern: new words/phrases in context → short tip (grammar or "German trap", explained in
German) → exercises → speaking task. Last lesson of each module = mixed review + mini conversation.

Draft module list (everyday English with friends, ~B1 → B2):
1. Small talk & getting to know people
2. Making plans & arrangements
3. Telling stories (past simple vs. present perfect)
4. Opinions, agreeing & disagreeing
5. Feelings & reactions
6. Food, going out & ordering
7. Travel & directions
8. Work, study & daily life
9. Problems, complaints & apologising
10. Everyday phrasal verbs & idioms

### Exercise types
| Type | What she does | Skill |
|---|---|---|
| Voice translation | Sees German sentence, says it in English; AI accepts any natural answer and suggests better words + a "level up" version | Speaking, vocab |
| Listen & repeat (shadowing) | Hears a natural sentence, repeats it aloud | Pronunciation, fluency |
| Listening | Hears a sentence, picks the meaning / fills the gap | Listening |
| Say more | Answers a question in 2+ sentences by voice; AI shows how to say more | Pushes past short answers |
| Sentence builder | Puts word tiles in the right order | Word order, grammar |
| Gap fill / multiple choice | Chooses the right form or word | Grammar |
| Match pairs | Matches English ↔ German phrases | Vocab |
| Mini conversation | Short spoken role-play, 3–5 turns | Free speaking |

### Learning techniques built in
- **Spaced repetition** (Leitner/SM-2 style: Nochmal / Schwer / Gut / Leicht) for all cards.
- **Active recall:** she produces the English (DE → EN), not just recognises it; both directions.
- **Chunks in context:** cards teach phrases in example sentences, not single words.
- **Comprehensible input (i+1):** content slightly above her level, with German help when needed.
- **Pushed output:** speaking tasks reward longer answers; "level up" versions model richer English.
- **Shadowing** for pronunciation and rhythm.
- **Interleaving & retrieval:** later lessons mix in material from earlier modules.
- **Error-driven learning:** words she missed / the AI suggested become personal cards.
- **German-speaker traps:** false friends, since/for, word order, tenses – with memory hooks.
- **Habit:** fixed 10-minute daily plan, streak, small wins, gentle reminders.

### Tech notes
- Content (modules, cards, sentences) as JSON files in the repo – Claude writes and extends them.
- Progress first in the browser (localStorage), then synced to Supabase.
- Voice: Safari `webkitSpeechRecognition`; fallback = iPhone keyboard dictation. TTS: `speechSynthesis`.
- AI feedback: Supabase Edge Function → Gemini (free). If AI is unavailable, simple offline check.

## Infrastructure (as of 2026-11-08)
- App: https://fredybansi-creator.github.io/miri-english/ (GitHub Pages from `main`)
- Supabase project **Miri English** (`aagbnrcsprmhcwllfmcn`, eu-central-1, free) in org "Battlezone"
- Edge Function `feedback` (source: `supabase/functions/feedback/index.ts`, deployed with verify_jwt=false;
  it checks the Origin itself). Secret `GEMINI_API_KEY` (free Google AI Studio key, set by Freddy).
  Model order: gemini-flash-lite-latest → gemini-flash-latest → gemini-3.8-flash (10 s each).
- Edge Function `tts` (source: `supabase/functions/tts/index.ts`): ElevenLabs voices (US: Jessica + Will as
  friend, UK: Alice + George), model eleven_flash_v2_5. Each sentence is generated once and cached in the public
  Storage bucket `tts`; later requests redirect there. Secret `ELEVENLABS_API_KEY` (set by Freddy, free plan).
  App falls back to an English browser voice if ElevenLabs fails (e.g. monthly credits used up).
- Edge Function `progress` + table `public.progress` (RLS on, no policies – service role only): progress backup.
  Miri's device gets a 16-character backup code (Fortschritt → Sicherung); only its SHA-256 hash is stored.
  App pulls + merges on start, pushes 4 s after each change. Restore on a new device = enter the code.
- "Meine Fehler": AI coach fixes become flashcards (max 5 new per day, first review next day).

## Build phases
1. **App shell + Today screen + flashcards (SRS) + module 1 content**, voice exercise with offline
   check. Publish on GitHub Pages → Miri tests the microphone on her iPhone early.
2. **AI feedback** (Supabase Edge Function + Gemini) for voice translation and "say more".
3. **More exercise types** (listening, shadowing, sentence builder, mini conversation) + modules 2–3.
4. **Progress sync to Supabase**, stats screen, "Meine Fehler" cards.
5. Remaining modules, polish, reminders.

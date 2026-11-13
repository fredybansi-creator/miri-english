# Miri English – project notes

Personal web app for Miri (German, about B1+) to practise English every day on her iPhone (Safari).
Claude maintains the code for Freddy (the owner). This file is the source of truth for decisions and
the current state, so any new session can pick up the work.

**Live app:** https://fredybansi-creator.github.io/miri-english/ (GitHub Pages from `main`)
**Repo:** https://github.com/fredybansi-creator/miri-english (public – never commit secrets)

## Who Miri is and what she needs
- Follows conversations, but misses vocabulary and gives short, simple answers.
- Goal: relaxed, natural English with her English-speaking friends.
- Wants to **speak**, not just study vocab lists.
- Uses an iPhone, Safari, app added to the home screen.

## Freddy's requirements and preferences (keep following these)
- Daily flashcards, modules with daily tasks, varied exercises, translating German → English **by voice**.
- Spoken answers don't need to be perfect: feedback says which words make it better (encouraging).
- Content at **B1+ → B2**; harder, conversation-like (longer replies), not trivially easy choices.
- **No idioms / figurative sayings** (no "raining cats and dogs", "snowed under", "on the fence"…).
  Common phrasal verbs (catch up, end up, figure out) are fine. Raluca and the coach are told the same.
- Free where possible; quality must stay good. No surprise costs (no credit cards on any service).
- UI language: German instructions, English content.

## What the app does today (state 2026-11-09)
- iPhone tests passed 2026-11-09: hands-free mic, voice on every reply, Kokoro voices.
- **Heute:** daily plan – lesson, flashcards (+3 mixed review exercises), chat with Raluca. Streak, goal ring.
- **Lessons** (15 so far: modules 1–3, 5 lessons each, files `content/m1.js`–`m3.js`):
  6 phrases → 2 pages "Neue Wörter" (20 words per lesson) → tip (German) → exercises:
  choice, gap, fix (find the mistake), build, listenbuild (dictation), listen, match, shadow,
  speak (voice translation of a German reply in a mini conversation), free (open answer).
  Tap exercises: select an answer, then "Prüfen".
- **Flashcards:** spaced repetition (Nochmal/Schwer/Gut/Leicht), max 20/day. Sources: lesson phrases,
  lesson words (spread over 3 days after the lesson), "Meine Fehler" (coach fixes, max 5 new/day),
  looked-up words (🔍).
- **Mixed review:** after the cards, 3 exercises from finished lessons (wrong ones first).
- **Raluca the fox** (was "Sam" until 2026-11-09; internal ids like `samVoice`, role `sam` and css class `.sam` kept the old name) (`js/chat.js`, `js/fox.js`): endless conversation, hands-free like voice mode (mic opens
  again after Raluca speaks), correction under every message of hers, saved automatically (`state.chat`),
  "Neues Gespräch" archives the old one (last 10). Daily goal = 3 messages.
- **Word lookup 🔍** in every session screen and the Karten tab (AI meaning in context, save as card).
- **Backup:** 16-character code (Fortschritt → Sicherung), automatic sync, restore on a new device.
- Settings: accent US/UK, natural voice (Kokoro) on/off, Raluca's voice ElevenLabs/Handy, Raluca animation,
  device voice picker, speech rate, reset.

## Rebuild (started 2026-11-11) – the new app in `neu/`

**2026-11-12: the new app is the main app.** Freddy said ok. The root `index.html` only forwards to `neu/`.
The old app is kept at `alt.html` (same files `js/`, `css/`, `content/`), so we can go back by restoring `index.html`.

Plan doc: https://claude.ai/artifact/TPF6QEVWq3GuuUjrdhCsqm ("Build plan, version 1"). The new app replaces the old one
at the same address once Freddy says ok; until then it lives at `/neu/` and the old app stays untouched.
- Step 0 done 2026-11-12: `mic-test.html` + Edge Function `transcribe` – 10/10 on Freddy's iPhone.
- Step 1 (2026-11-12): `neu/` = daily practice. Start page with 2D Raluca (`neu/fox.js`), one lesson per day (~10 min),
  topic Reisen (`neu/content/travel.js`, 5 lessons, A2–B1, short sentences). Exercise types: repeat (mic, offline check),
  build (tiles), say (mic → `transcribe`, then `feedback` translate mode), story (audio + 2 questions).
  Topics (2026-11-12, in this order): Reisen, Freunde, Beim Arzt, Im Urlaub, Café & Essen, Einkaufen – 6 × 5 lessons
  (`neu/content/*.js`, imported in `neu/app.js` TOPICS).
  Progress: localStorage `miri-neu` + backup via `progress` (random code made on the phone, no password; `app: 'neu'`).
  Debug log: localStorage `miri-neu-log`, "Protokoll kopieren" on the start page.
  Audio: `tools/make_audio.py` also reads `neu/content/*.js` (voices us-main / us-friend are used).
  `KOKORO_MODELS=<dir>` lets it run outside Freddy's PC (Claude ran it in the cloud container).
- Next: step 2 the game (coins, streak, bowl, mood, shop, tricks by voice), 3 more content, 4 reminder.

## Voices
- **Kokoro (free, offline, no limit)** for all fixed lesson sentences: `tools/make_audio.py` renders
  mp3 files into `audio/<us|uk>-<main|friend>/<key>.mp3` + `audio/manifest.json`. Voices: us-main
  af_heart, us-friend am_michael, uk-main bf_emma, uk-friend bm_george. Key = FNV-1a over code points +
  length (`audioKey()` in `js/speech.js` must match `key()` in the script). Re-run the script after
  adding/changing lesson sentences (existing files are skipped), then commit `audio/`.
  Setup: `tools/.venv` (kokoro-onnx, soundfile, lameenc, json5) + model files in `tools/models/`
  (both gitignored). ~2.5 s per sentence on Freddy's PC.
- **ElevenLabs only for Raluca** (Edge Function `tts`, female voices Jessica (US) / Alice (UK) = role `main`
  since 2026-11-09 (was male Will/George = role `friend`), cached in Storage
  bucket `tts`). Free plan; Raluca uses roughly 15k characters/month.
- **Device voice** for one-off texts (coach corrections, lookup examples, mistake cards) and as fallback.
  iPhone Safari does NOT expose downloaded Premium voices (tested: Ava missing) – don't retry that.
- iPhone quirks handled: device voice is unlocked on the first tap; 700 ms pause between speech
  recognition and speech output; no SVG filters on the animated fox.

## Infrastructure
- Supabase project **Miri English** (`aagbnrcsprmhcwllfmcn`, eu-central-1, free) in org "Battlezone".
  Edge Functions are deployed with verify_jwt=false and check the Origin/Referer themselves.
  - `feedback` – Gemini (secret `GEMINI_API_KEY`), modes: translate, free, chat_reply, chat_fix,
    chat_review (unused now), lookup. Model order: gemini-flash-lite-latest → gemini-flash-latest →
    gemini-3.8-flash, 10 s each.
  - `tts` – ElevenLabs (secret `ELEVENLABS_API_KEY`), Storage bucket `tts` (public read).
  - `transcribe` – Gemini (same `GEMINI_API_KEY`): base64 audio (16 kHz mono WAV made in the browser) → exact
    text, mistakes kept. Used by `mic-test.html` (step 0 of the rebuild, 2026-11-11). Replaces Safari speech
    recognition, which never worked on Miri's iPhone.
  - `progress` + table `public.progress` (RLS on, no policies – service role only). Only the SHA-256
    of the backup code is stored.
- Local preview: `python -m http.server 8765` (see `.claude/launch.json`).
- After testing in a browser: clear test localStorage and delete test rows in `public.progress`
  (only rows clearly created by tests – real rows from Freddy's/Miri's phones must stay).

## Open tasks
1. **Kokoro audio:** done 2026-11-09 – all 2,282 files (US + UK) committed. Re-run make_audio.py after content changes.
2. **Raluca's voice:** done 2026-11-09 – female (Jessica/Alice).
3. **Modules 4–10** – ON HOLD (Freddy, 2026-11-09): first Miri does a few modules and says what she wants changed; then write 4–10 with her feedback. Ask about her interests then (same format as m1–m3, 20 words per lesson, no idioms, then run make_audio.py):
   4 Plans & arrangements (invitations, changing/cancelling plans) · 5 Feelings & reactions ·
   6 Going out, food & ordering · 7 Travel & directions · 8 Work, study & daily life ·
   9 Problems, complaints & apologies · 10 Everyday phrasal verbs (no idioms).
   Ask Freddy about Miri's interests first if not known yet.
4. Miri's first feedback (2026-11-09) is handled in PR #2 – see "Miri's feedback" below. Ask again after she has used it.

## Miri's feedback (2026-11-09) and what changed
- Speaking tasks had too many sentences → 33 of 60 cut to 1–2 sentences. Keep new ones short (max ~2 short sentences).
- Mic stopped at her first pause → `listen({ untilStopped })` keeps going until she taps the green "Fertig".
- Stop button froze → PR #1 fix (abort/forced settle) + lessons abort the mic when leaving.
- End-to-end test (same day): 72/100 → 88/100 after fixes. Raluca gets the last 60 lines + Miri's older lines as `facts`; lessons resume after reload (`state.lessonRun`); online backup starts only after "Los geht's"; hands-free chat sends after 3.5 s of quiet. When testing with Playwright, fake `functions/v1/progress` so no backup rows are created.
- Raluca sounded male → female ElevenLabs voices. Raluca's prompt: always English, talks like a friend.
- Corrections in German → prompts say corrections are always English; `looksGerman()` in `js/ai.js` drops German ones.
- 30 min instead of 15 → lessons play ~8 exercises (`shortExercises()` in `js/lesson.js`: no "free", no "build"
  when there is a listening task, one per type, 2 speak), overview pages show 10 words (all 20 still become cards).
  App now says "ca. 20 Minuten".

## Ralucas Welt – the fox game (started 2026-11-13)
Open-world game where Miri plays Raluca in a block world; it becomes a "Welt" tab of the new app. **Surprise for Miri:
not linked anywhere in the app until Freddy says ok.** Plan (10 steps, Freddy checks each one):
https://claude.ai/artifact/VaSxckCQSLcxD5tCA7U4Ff
- Hidden test address: `/neu/welt/` (`neu/welt/index.html` + `welt.js`). Uses the app's three.js and the code-built
  Raluca (`makeFoxActor()` in `neu/fox3d.js`).
- Step 0 (2026-11-13): speed test. 112×112 blocks from noise, one mesh for the land, one instanced mesh for all tree /
  rock / flower blocks, thumb stick + look drag + jump, W A S D on a laptop, frames-per-second display, the picture
  gets less sharp by itself below 40 fps. `window.WELT` is there for tests.
- Question marks (2026-11-13, Freddy's wish): 10 spinning "?" stand in the world (one instanced mesh); walking into one
  opens a "build the sentence" card with the `build` items of all lessons (audio via `neu/audio.js`, whose BASE now
  comes from `import.meta.url`). Arrow + metres at the top right point to the nearest one. Progress is not saved yet and
  gives no coins yet. Speaking exercises at question marks are still to do.

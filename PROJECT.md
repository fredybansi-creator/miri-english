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
- Step 1 (2026-11-13): models in `neu/welt/models.js` – each model is a list of coloured boxes (oak, pine, birch, berry
  bush, rock, log, mushroom, flowers, reeds, den, mouse, rabbit, owl, hedgehog, fish), built in code, not in Blender,
  so the world stays one instanced mesh. Picture sheet: `neu/welt/modelle.html`. Not yet placed in the world (step 2).
- Step 2 (2026-11-13): the world. 192×192 blocks in pieces of 16×16 (ground mesh + one instanced mesh of model boxes
  per piece; pieces farther than the fog are switched off, three.js culls the rest). Regions in `welt.js`: meadow with
  the den in the middle, forest by noise, hill (north-west), 4 ponds (`PONDS`), 3 rivers (`RIVERS`). Animals
  (`makeAnimals` / `moveAnimals`): rabbits and mice run away from Raluca, hedgehogs, two owls, fish in every pond and
  river that jump now and then. About 180–240k triangles and ~100 draw calls in view (half of them are Raluca).
- Raluca is the real dog (2026-11-13, Freddy's wish): a 3D model made in Blender from a photo of Raluca –
  `neu/welt/raluca.glb` (about 12k triangles, 0.5 MB, colours stored in the points, skeleton, clips Survey / Walk / Run / Sit),
  built by `tools/make_raluca.py` (run with Blender's Python: `pip install bpy`, then `python tools/make_raluca.py`).
  `neu/welt/hund.js` `makeDogActor()` loads it (`neu/vendor/GLTFLoader.js`) and has the same `pose()` numbers as
  `makeFoxActor()`, so the game code did not change; it turns the bones itself and does not use the clips yet.
  If the file does not load, the fox appears. `/neu/welt/?raluca=fuchs` shows the old fox. Only the game uses the dog:
  the start page of the app still shows the code-built fox (tricks, clothes). Her eyes do not blink yet.
- Step 3 (2026-11-13): fox life. Camera turns behind Raluca while she walks (not right after a manual look, not
  when walking towards the camera) and comes closer when a tree crown (`LEAF`) is in the way. Needs: food / water /
  energy bars (cozy: below 15 she is only slower). One action button (key E) changes with the place: Schlafen at the
  den (night → morning), Fangen near a mouse (pounce; sneaking = stick pushed only a little or Shift, mice notice her
  later; caught mice come back after 25 s), Fressen at a berry bush, Trinken at water, else Schnüffeln (glowing trail
  to the nearest question mark). Day = 8 minutes with sky / light / fog colours. Saves to localStorage `miri-welt`
  (position, time, needs, mice caught, question mark round + done) every 4 s; the app's own `miri-neu` is not touched.
- Steps 4/5 (2026-11-13): fishing (🐟 Fischen when a fish is within ~3 m of the shore; the fish waits, ~80 % catch),
  9 kinds of hidden things (`FIND_KINDS`, picked up by walking into them), the book (📖 button / key B) with every
  English word found / caught / eaten, tap = sound. Sniff also leads to hidden things and dig mounds.
- Digging (Freddy's wish, "removes the blocks like in Minecraft"): 🐾 Graben button (hold it) / key F digs away the
  earth block in front of her: `H` goes down by 1 and that map piece's ground mesh is rebuilt (`reland`); flowers / grass
  on that block disappear (`DECO`). Not stone, not at the den, not below height 1; below water level the hole fills with
  water. Dug blocks are saved (`holes`, `earth` counter 🟫, meant for den building in step 7). 14 mounds (`placeDigs`)
  hide bone / worm / carrot / coin / potato / a treasure on the hill; plain earth sometimes has a worm or bone.
- Mouse hunt, more realistic (Freddy's wish): mice live at a burrow hole, nibble and dash; they hear her (sneak 1.4 m,
  walk 4.6 m, run 7 m), freeze, then zig-zag home and hide 5–11 s. Fangen = she stands and listens (ears forward),
  then a high jump and a nose-first dive; the mouse may hear the jump (less when she sneaked up and is close).
  A caught mouse is held in her mouth, then eaten (+30 food).
- Step 6 (2026-11-13): animal friends in `neu/welt/friends.js` (Olli the owl by the den, Rosie the rabbit on the
  meadow, Hugo a hedgehog, Luna the owl on the hill), 5 steps each: "say" steps (Miri answers by voice through
  `neu/rec.js` + the transcribe function with `check`, or by typing = simple word match) and "bring" steps (mouse,
  fish, carrot, berries, worm, apple, crystal, treasure; digging finds the wanted worm/carrot more often). Each step =
  one heart; name signs over their heads; friends + hearts at the top of the book; saved as `pals`. Their lines have no
  Kokoro files yet (phone voice) – `tools/make_audio.py` now also collects friends.js, so Freddy's next run adds them.
- Step 7 (2026-11-13): 🧱 Bauen (hold / key G, shown once she has earth) puts an earth block on the block in front of
  her (walls, steps, bridges; max 2 above her). 🏠 button near the den (key H) opens the den menu: 8 things (`DECOR`:
  leaf bed, mushroom lamp (glows), flower garden, shell path, feather chime, apple basket, treasure chest, fence) cost
  earth 🟫 + found things (`spent` is subtracted from the book counts); before building, Miri spells the English word
  with letter tiles. Saved as `built`, `spent`.
- More English (Freddy: "the game is meant to teach English"): question marks alternate "build the sentence" and
  "say it in English" (lessons' `say` items, voice check or typing); NO repeat-after-me (Freddy left it out).
  Every exercise at a mark gives 🟫 +3. Book → 🃏 Wörter üben: 5 found words, German → spell the English word, +1 🟫 each
  (not when she listened to the hint first).
- Minimap + wolf (Freddy's wishes, 2026-11-13): minimap top left (north up, ? marks, friends, den, her arrow) with
  "🧭 north-east" = English direction to the next question mark; tap it (key M) → big map with English place names
  (tap = sound) and N/E/S/W words. Storm the wolf (`MODELS.wolf`, north forest) is a 5th friend in friends.js; with
  5 hearts he follows Raluca (`a.follow`). Still to do in step 9 (needs the app): shop paid with lesson coins (an
  animal shopkeeper, ask in English), daily quests built from the day's lesson words.
- Big den (2026-11-13): den model at 1.6× with a 5×5 footprint; at the door the act button says "🚪 Reingehen". The
  room is built far outside the map (`ROOM` x≈-60, floor y 4, `inside` flag switches walking/camera): nest (sleep
  there), lantern, food store, shelf showing found things, English name signs (tap = sound). Walk out of the door or
  "🚪 Rausgehen". Save stores the spot in front of the door.
- Step 9 (2026-11-13, Freddy: show it right away): "Welt" tab in the app (`weltTab()` in neu/app.js, links to welt/;
  "‹ App" in the game goes back to `../#welt`). Pip the rabbit (shopkeeper, stall near the den, act button "🛒 Pip")
  sells food and den things for the app's lesson coins (`store.js` coins); Miri must ask in English ("Can I have a
  pillow, please?"). Bought den things stand in the den room (`ROOMSHOP`). 📜 daily quests from today's lesson
  (lesson done today, else the next one): build 2, answer 2, spell 3 gap words; 🟫 +3 each, all = 🪙 +5. Keys are
  ignored while typing in an answer box (spaces used to be eaten by the jump key).
- Polish (2026-11-13, before step 8): 🦉 Olli's guided start (`TUT` in welt.js: 7 tips, one at a time, each stays until
  done, pulsing button; ✕ = off, back on in the book 📖). Sounds made in code (`neu/welt/fx.js`: step, dig, catch,
  splash, right answer, coin, heart; on/off in the book) and floating pops (🟫 +3, ❤️, 🪙). Question marks use only
  the lessons Miri has done + the next one (min. first 3) via `levelPool()`. The frame counter shows only with `?fps`.
  Playwright tests must fake `**/functions/v1/**` (the shop/quests call backup()).
- Step 8, family (2026-11-13): Finn the fox (`MODELS.fox`, east forest ~mid+46) is a friend in friends.js; with 5 hearts
  he moves to the den (`family()` in welt.js). The next sleep in the den nest → 3 cubs Mia/Leo/Kiki are born (`born`
  in the save). Cubs are friends too (`cub: true`): family English, food to bring; they grow with every heart and
  follow her after 5 (`a.fo` offsets). New lines use the phone voice until tools/make_audio.py is run.
- Fun + English (2026-11-13, Freddy gave free choice): question marks rotate build / 🎧 listen / say. They use the
  due flip cards first (`dueCards()` = same boxes as the Karten tab); right at the first try = "Gewusst" for that card
  (`cardRight`). Listening: hear the sentence, pick the German meaning of 3. 📻 Olli's story of the day
  (`neu/welt/stories.js`, 14 short stories in order, one per day, in the 📜 sheet): listen first, then a question,
  🟫 +5. make_audio.py collects the stories.

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

## Requirements
_To be added by Freddy._

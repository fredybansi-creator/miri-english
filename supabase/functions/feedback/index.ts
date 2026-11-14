// Supabase Edge Function: AI feedback for Miri's spoken English answers.
// Secrets (Supabase dashboard → Edge Functions → Secrets):
//   GEMINI_API_KEY   required – free key from https://aistudio.google.com/apikey
//   GEMINI_MODEL     optional – overrides the model list below
// The key never reaches the browser.

const ALLOWED_ORIGINS = [
  "https://fredybansi-creator.github.io",
  "http://localhost:8765",
  "http://127.0.0.1:8765",
];

// Tried in order; aliases first so the function keeps working when Google renames models.
// Flash-Lite first: fast and good enough for this task. Each model gets MODEL_TIMEOUT_MS.
const MODEL_TIMEOUT_MS = 10_000;
const MODELS = (Deno.env.get("GEMINI_MODEL") || "gemini-flash-lite-latest,gemini-flash-latest,gemini-3.8-flash")
  .split(",").map((s) => s.trim()).filter(Boolean);

const INTRO = `You are a warm, encouraging English speaking coach for Miri, a native German speaker at about B1 level.
She is practising casual conversations with friends. English is still hard for her, so be gentle: a simple answer
that is correct and gets the meaning across is "great" – she does not need fancy words.
Her answer comes from speech recognition: ignore punctuation, capitalisation, filler words and obvious
transcription glitches (homophones, a missing article the recogniser dropped).`;

const TASK_TRANSLATE = `TASK: She sees a German reply and says it in English, out loud.
Judge her answer like a friendly native speaker would:
- It does NOT need to be a word-for-word translation. Any natural reply that gets the meaning across is fine.
- "great": natural and complete, at most tiny slips.
- "good": understandable, but with grammar mistakes, unnatural wording, or a missing part of the meaning.
- "try": the meaning is mostly missing or wrong, or the answer is very short.`;

const TASK_FREE = `TASK: Her friend asked her something and she answers FREELY about her own life (there is no correct answer
and no German text). The input contains the friend's line, a German hint describing what to talk about, and
target phrases she was encouraged to use. Judge grammar, naturalness and whether she said enough:
- "great": natural, mostly correct, at least 2-3 sentences that answer the friend.
- "good": understandable but with mistakes, or a bit short (1-2 sentences).
- "try": very short (under about 10 words) or hard to understand.
In "praise" mention something specific she said. "corrected" = her answer with mistakes fixed, keeping her content.
"levelUp" = her own story retold more richly and naturally (keep her facts, maybe use a target phrase).
"betterWords" = useful phrases she could add next time (prefer the target phrases she did not use).
If she said too little, the tip should encourage her (in German) to add a detail or a reason.`;

const OUTPUT = `Return JSON only, with these fields:
- level: "great" | "good" | "try"
- praise: one short, specific, encouraging sentence in German (what she did well).
- corrected: HER answer, minimally corrected so it is natural English. Keep her own words wherever they are fine.
  If her answer is already natural, repeat it.
- fixes: up to 2 items { wrong, better, why } – wrong = the exact words she used, better = what to say instead,
  why = a very short German explanation (max 15 words). Only real mistakes that matter (wrong meaning, wrong
  tense, German word order, calques) – skip small slips like a missing article. Most important first. Empty if none.
- betterWords: up to 3 simple, common English words/phrases that would help her reply (not already used by her).
- levelUp: her answer made just a little better – the same simple sentences with one or two improvements. Max 20 words,
  everyday words a B1 learner knows. No slang or British/US colloquialisms (no "loads", "brilliant", "reckon",
  "bumped into", "a bit of a").
- tip: one short German tip about a typical German-speaker mistake she made, or "" if none. It must agree with
  the fixes.
Never flag punctuation, capital letters or sentence breaks (speech recognition decides those), and never flag
correct English just because the example answer says it differently. Do catch German calques: "since + period"
(→ for), "home office" (→ working from home), "begin with + activity" (→ start doing), "become" (→ get),
"have lust" (→ feel like), "actual" (→ current), "eventually" (→ maybe).
Use plain, natural everyday English: NO idioms or figurative sayings (e.g. "raining cats and dogs",
"snowed under", "on the fence", "piece of cake"). Common phrasal verbs (catch up, end up) are fine.
Speak to her as "du". Be kind and concise.
LANGUAGE: "corrected", "better", "betterWords" and "levelUp" are ALWAYS English, never German. Only "praise",
"why" and "tip" are German. If she used German words, the English words go in "better".`;

const systemFor = (mode: string) => {
  if (mode === "chat_reply") return CHAT_REPLY;
  if (mode === "chat_review") return `${INTRO}\n\n${TASK_CHAT_REVIEW}\n\n${OUTPUT}`;
  return `${INTRO}\n\n${mode === "free" ? TASK_FREE : TASK_TRANSLATE}\n\n${OUTPUT}`;
};

// ---- conversation partner ("Raluca") -------------------------------------------------------------
const CHAT_REPLY = `You are Raluca, Miri's friend: a woman in her early thirties, a native English speaker, relaxed, warm and a bit funny.
Miri is German (about B1+) and practises having relaxed spoken conversations with friends.
You get the scenario and the conversation so far. Write Raluca's NEXT line.
Rules:
- ALWAYS write in English, never in German – even if Miri uses German words. If she used a German word because she
  didn't know the English one, just use the English word naturally in your reply (no comment about it).
- Miri finds English hard: speak SIMPLE English (A2–B1). 1–2 short sentences, max 18 words in total, each sentence
  short. Use only very common everyday words and simple tenses (present, past, going to, will). NO idioms, NO slang,
  NO phrasal verbs except very common ones (get up, go out, find out). Ask simple questions she can answer easily.
- If she seems lost (very short answer like "what?", "sorry?", "I don't understand", German words, or an answer
  that doesn't fit your question), say your last idea again in even simpler words.
- If Miri asks YOU something (your opinion, your life, "and you?"), answer it FIRST with a short, honest personal
  answer – never dodge it or turn it straight back to her.
- Talk like a real friend, not like a teacher or an interviewer: first react to what she actually said
  (show interest, agree, laugh, or share a short, concrete bit about your own life), then usually ask ONE simple
  follow-up question about what she just said. Ask about one thing at a time.
- MEMORY: the conversation (plus facts_miri_told_earlier = her older messages) is the whole truth. Remember what Miri told you (plans, people, hobbies, job) and refer
  back to it. Never invent facts about her. If she asks whether you remember something, look it up in the
  conversation and answer exactly; if it isn't there, say you're not sure and ask.
- Read time words carefully: what she WILL do (tomorrow, on Saturday) has not happened yet.
- If her answer is very short ("ok", "yes"), don't repeat your last question – add something about yourself or
  move the topic on a little.
- Her text comes from speech recognition and may be cut off or have wrong words. Guess what she meant; only if
  you really can't, ask casually ("Sorry, what did you say about …?").
- Never correct her English and never mention grammar.
- No emojis, no lists, no stage directions.
- The conversation has no end: keep it going. If a topic runs dry, move naturally to a related
  everyday topic (plans, work, hobbies, food, travel, friends, films). Don't repeat questions.
- Always set done = false.
Return JSON only: { "reply": string, "done": boolean }.`;

// ---- correction of ONE chat message (shown right under her bubble) ---------------------------
const CHAT_FIX = `You correct ONE message that Miri (German, about B1+) just said in a casual spoken chat with her friend Raluca.
Her text comes from speech recognition: ignore punctuation, capitalisation, missing apostrophes and filler words.
Only flag real grammar mistakes, wrong words or clearly unnatural wording – not style preferences. She is still
learning (about B1): be gentle, at most 2 fixes, only the ones that matter most; ignore small slips (a missing
article, he/she, a/the) when the meaning is clear.
NEVER comment on punctuation, capital letters, missing full stops or where sentences start or end: speech recognition
decides those. If her message is correct English but could be said differently, it is ok – do not "improve" it.
If the message makes no sense (a recognition error), set ok = true and give no fixes.
Typical German-speaker mistakes to catch: "since + period" (→ for), "home office" (→ working from home),
"begin/start with + activity" (→ start doing / take up), "become" (→ get), "make a photo / a party" (→ take / have),
"I have lust" (→ I feel like / I fancy), "actual" (→ current), "eventually" (→ maybe), "in the Kino" etc.
Every fix and the tip must agree with each other (same rule, same example).
Return JSON only:
- ok: true if the message is correct and natural enough for a friendly chat (small slips are fine).
- corrected: her message minimally corrected (keep her words where they are fine). If ok, repeat it.
- fixes: up to 2 items { wrong, better, why } – wrong = her exact words, better = what to say instead,
  why = very short German explanation (max 12 words). Empty if ok.
- tip: one very short German tip, or "".
LANGUAGE: "corrected" and every "better" are ALWAYS English – what she could have said in English, never German.
Only "why" and "tip" are German. If she used German words (because she didn't know the English word), that is a fix:
wrong = her German words, better = the English words, why = e.g. "Auf Englisch: …".
Use plain everyday English, no idioms.`;

const CHAT_FIX_SCHEMA = {
  type: "OBJECT",
  properties: {
    ok: { type: "BOOLEAN" },
    corrected: { type: "STRING" },
    fixes: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { wrong: { type: "STRING" }, better: { type: "STRING" }, why: { type: "STRING" } },
        required: ["wrong", "better", "why"],
      },
    },
    tip: { type: "STRING" },
  },
  required: ["ok", "corrected", "fixes", "tip"],
};

const TASK_CHAT_REVIEW = `TASK: Miri just had a short spoken conversation with her friend Raluca (the input contains the scenario and
all lines). Review ONLY her lines, like a friendly coach after the conversation:
- level: "great" (natural, mostly correct, gave detailed answers), "good" (understandable, some mistakes or
  short answers), "try" (very short answers or hard to understand).
- praise: one specific encouraging sentence in German about something SHE said (lines marked "Miri").
  Never praise words or phrases that only Raluca used.
- corrected: her LONGEST answer, minimally corrected.
- fixes: up to 4 of her most important mistakes across all lines (exact words she used → better).
- betterWords: up to 4 phrases that would have made her sound more natural in this conversation.
- levelUp: her longest answer retold richer and more natural (keep her facts).
- tip: one short German tip about her most frequent mistake pattern, or about giving longer answers.`;

// ---- an animal friend in the fox game (Ralucas Welt) answers what Miri really said ----------------
const FRIEND_REPLY = `Miri, a German woman learning English (about A2), plays a cosy game as Raluca the fox.
An animal friend asked her something; her task (in German) told her what to answer. You get:
friend (who is talking), friend_said, task_german, example_answers, key_words (groups: at least one word of each
group, or a word with the SAME meaning, must be in her answer) and she_said (from speech recognition or typing).
1) JUDGE her answer:
- "great": it says what the task asks, natural, at most tiny slips.
- "good": it says what the task asks, but with grammar mistakes or unnatural wording.
- "try": the meaning is different from the task, a key word is missing or replaced by a different thing
  (e.g. "hole" or "ground" instead of "den" and "meadow"), it is only a fragment, or nothing usable was said.
  Never give "good" just because the sentence looks similar - the MEANING of the task must be there.
  Ignore punctuation, capital letters and small speech-recognition glitches (a dropped article, a homophone).
2) WRITE THE FRIEND'S REPLY, spoken by the friend, in character (an owl, rabbit, hedgehog, wolf, fox or a fox cub
  who calls her "Mum"). React to what she REALLY said, in the friend's own voice, like a real conversation:
- Very easy English (A1-A2), 1-2 short sentences, max 22 words, no idioms, no emojis, never German.
- If "great": react warmly and specifically to her words (one small, friendly comment).
- If "good": react warmly, then say the natural sentence once in your reply, without saying "wrong"
  (e.g. "Oh, you live in a den on the meadow? How nice!").
- If "try": stay kind and curious; show you did not quite understand or that her answer is different, and say
  the right idea in simple words so she can try again (e.g. "A hole in the ground? Hmm, I mean your home. Is it a den?").
3) hint_de: if "try", one short German tip what is missing or wrong (max 14 words), e.g. "Es fehlen die Wörter
  für Bau (den) und Wiese (meadow)." Otherwise "".
4) corrected: her answer minimally corrected to natural English that fits the task (if "try": a good example answer).
Return JSON only.`;
const FRIEND_SCHEMA = {
  type: "OBJECT",
  properties: {
    level: { type: "STRING", enum: ["great", "good", "try"] },
    reply: { type: "STRING" },
    hint_de: { type: "STRING" },
    corrected: { type: "STRING" },
  },
  required: ["level", "reply", "hint_de", "corrected"],
};

// ---- word lookup --------------------------------------------------------------------------------
const LOOKUP = `You are a bilingual English–German dictionary for Miri, a German learner of English (about B1+).
She looks up an English word or phrase she doesn't know. If a context sentence is given, explain the meaning
IN THAT CONTEXT. Return JSON only:
- word: the word/phrase in its base form (e.g. "ran into" -> "run into"), English.
- de: the German translation(s) for this meaning, short (max 6 words, separate alternatives with " / "). Translate
  the form used in the context: "was raised" → "ist aufgewachsen / wurde großgezogen", not a different verb.
- explanation: one short German sentence explaining the meaning or usage (max 20 words).
- example: one short, natural, everyday English example sentence (no idioms).
- exampleDe: German translation of the example.
- register: "neutral", "umgangssprachlich" or "formell".
If she typed German instead, give the English word in "word" and the German in "de".`;

// ---- German translation of one of Raluca's lines (when Miri doesn't understand) -----------------
const TRANSLATE_LINE = `Translate this casual spoken English line from a friend into natural, casual German (du-Form).
Keep the meaning and tone. Return JSON only: { "de": string }.`;
const TRANSLATE_SCHEMA = { type: "OBJECT", properties: { de: { type: "STRING" } }, required: ["de"] };

const LOOKUP_SCHEMA = {
  type: "OBJECT",
  properties: {
    word: { type: "STRING" }, de: { type: "STRING" }, explanation: { type: "STRING" },
    example: { type: "STRING" }, exampleDe: { type: "STRING" },
    register: { type: "STRING", enum: ["neutral", "umgangssprachlich", "formell"] },
  },
  required: ["word", "de", "explanation", "example", "exampleDe", "register"],
};

const CHAT_SCHEMA = {
  type: "OBJECT",
  properties: { reply: { type: "STRING" }, done: { type: "BOOLEAN" } },
  required: ["reply", "done"],
};

const SCHEMA = {
  type: "OBJECT",
  properties: {
    level: { type: "STRING", enum: ["great", "good", "try"] },
    praise: { type: "STRING" },
    corrected: { type: "STRING" },
    fixes: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { wrong: { type: "STRING" }, better: { type: "STRING" }, why: { type: "STRING" } },
        required: ["wrong", "better", "why"],
      },
    },
    betterWords: { type: "ARRAY", items: { type: "STRING" } },
    levelUp: { type: "STRING" },
    tip: { type: "STRING" },
  },
  required: ["level", "praise", "corrected", "fixes", "betterWords", "levelUp", "tip"],
};

// very small in-memory rate limit (per instance)
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 40;
}

function cors(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(origin), "Content-Type": "application/json" } });
}

const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

async function askGemini(key: string, input: Record<string, unknown>, system: string, schema: unknown = SCHEMA, temperature = 0.3) {
  let lastError = "no model available";
  const skipped: string[] = [];
  for (const model of MODELS) {
    let res: Response;
    let data: { candidates?: { content?: { parts?: { text?: string }[] } }[] } | null = null;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: JSON.stringify(input) }] }],
          generationConfig: { temperature, responseMimeType: "application/json", responseSchema: schema },
        }),
        signal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
      });
      if (res.ok) data = await res.json();
    } catch {
      lastError = `${model}: timeout`;
      skipped.push(lastError);
      console.log("gemini model failed", lastError);
      continue;
    }
    if (res.ok && data) {
      const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
      try {
        return { model, skipped, result: JSON.parse(text) };
      } catch {
        lastError = `${model}: unreadable answer`;
        skipped.push(lastError);
        continue;
      }
    }
    const errText = (await res.text()).replace(/\s+/g, " ");
    const reason = (errText.match(/"message":\s*"([^"]{0,160})/) || [])[1] || "";
    lastError = `${model}: HTTP ${res.status} ${reason}`.trim();
    skipped.push(lastError);
    console.log("gemini model failed", lastError);
    // 404 = model name unknown, 429 = quota for this model used up → try the next model
    if (![404, 429, 500, 503].includes(res.status)) break;
  }
  throw new Error(lastError);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "method" }, 405, origin);
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return json({ error: "origin" }, 403, origin);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ error: "rate_limited" }, 429, origin);

  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return json({ error: "not_configured" }, 503, origin);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400, origin); }

  // ---- word lookup
  if (body.mode === "lookup") {
    const word = clip(body.word, 60).trim();
    if (!word) return json({ error: "empty" }, 400, origin);
    try {
      const { model, result } = await askGemini(key, { word, context: clip(body.context, 300) }, LOOKUP, LOOKUP_SCHEMA, 0.2);
      return json({ ok: true, model, ...result }, 200, origin);
    } catch (e) {
      return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
    }
  }

  // ---- the fox game: a friend judges and answers what she said
  if (body.mode === "friend_reply") {
    const said = clip(body.said, 600).trim();
    if (!said) return json({ error: "empty" }, 400, origin);
    const input = {
      friend: clip(body.friend, 80),
      friend_said: clip(body.they, 300),
      task_german: clip(body.de, 300),
      example_answers: (Array.isArray(body.answers) ? body.answers : []).slice(0, 4).map((a) => clip(a, 200)),
      key_words: (Array.isArray(body.keys) ? body.keys : []).slice(0, 4).map((g) => (Array.isArray(g) ? g : [g]).slice(0, 6).map((w) => clip(w, 30))),
      she_said: said,
    };
    try {
      const { model, result } = await askGemini(key, input, FRIEND_REPLY, FRIEND_SCHEMA, 0.5);
      const level = ["great", "good", "try"].includes(result.level) ? result.level : "try";
      return json({ ok: true, model, level, reply: clip(result.reply, 240), hint: clip(result.hint_de, 160), corrected: clip(result.corrected, 300) }, 200, origin);
    } catch (e) {
      return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
    }
  }

  // ---- German translation of one line
  if (body.mode === "translate_line") {
    const text = clip(body.text, 400).trim();
    if (!text) return json({ error: "empty" }, 400, origin);
    try {
      const { model, result } = await askGemini(key, { text }, TRANSLATE_LINE, TRANSLATE_SCHEMA, 0.2);
      return json({ ok: true, model, de: clip(result.de, 600) }, 200, origin);
    } catch (e) {
      return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
    }
  }

  // ---- correction of one chat message
  if (body.mode === "chat_fix") {
    const said = clip(body.said, 800).trim();
    if (!said) return json({ error: "empty" }, 400, origin);
    try {
      const { model, result } = await askGemini(key, { raluca_said_before: clip(body.they, 300), miri_said: said }, CHAT_FIX, CHAT_FIX_SCHEMA, 0.2);
      return json({ ok: true, model, correct: !!result.ok, corrected: clip(result.corrected, 800), fixes: (result.fixes || []).slice(0, 2), tip: clip(result.tip, 200) }, 200, origin);
    } catch (e) {
      return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
    }
  }

  // ---- conversation partner
  if (body.mode === "chat_reply" || body.mode === "chat_review") {
    const history = (Array.isArray(body.history) ? body.history : []).slice(-60).map((h: Record<string, unknown>) => ({
      who: h.who === "miri" ? "Miri" : "Raluca",
      text: clip(h.text, 600),
    }));
    if (!history.length) return json({ error: "empty" }, 400, origin);
    const input = { scenario: clip(body.scenario, 400), conversation: history, facts_miri_told_earlier: (Array.isArray(body.facts) ? body.facts : []).slice(-30).map((f: unknown) => clip(f, 300)) };
    try {
      if (body.mode === "chat_reply") {
        const { model, result } = await askGemini(key, input, systemFor("chat_reply"), CHAT_SCHEMA, 0.8);
        return json({ ok: true, model, reply: clip(result.reply, 300), done: !!result.done }, 200, origin);
      }
      const { model, result } = await askGemini(key, input, systemFor("chat_review"));
      return json({ ok: true, model, ...result }, 200, origin);
    } catch (e) {
      return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
    }
  }

  const said = clip(body.said, 1200).trim();
  if (!said) return json({ error: "empty" }, 400, origin);

  const mode = body.mode === "free" ? "free" : "translate";
  const input = mode === "free"
    ? {
      friend_said: clip(body.they, 300),
      what_to_talk_about_german_hint: clip(body.hint, 300),
      target_phrases: (Array.isArray(body.useWords) ? body.useWords : []).slice(0, 6).map((a) => clip(a, 60)),
      miri_said: said,
    }
    : {
      friend_said: clip(body.they, 300),
      german_reply_to_translate: clip(body.de, 400),
      miri_said: said,
      example_answers: (Array.isArray(body.answers) ? body.answers : []).slice(0, 4).map((a) => clip(a, 300)),
    };

  try {
    const { model, skipped, result } = await askGemini(key, input, systemFor(mode));
    return json({ ok: true, model, skipped, ...result }, 200, origin);
  } catch (e) {
    return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
  }
});

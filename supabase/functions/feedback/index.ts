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

const INTRO = `You are a warm, encouraging English speaking coach for Miri, a native German speaker at about B1+ level.
She is practising casual conversations with friends.
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
- fixes: up to 3 items { wrong, better, why } – wrong = the exact words she used, better = what to say instead,
  why = a very short German explanation (max 15 words). Only real mistakes or clearly unnatural wording,
  most important first. Empty if none.
- betterWords: up to 4 English words/phrases that would make her reply sound more natural (not already used by her).
- levelUp: a richer, very natural version a native speaker might say in this situation (casual, 1–3 sentences).
- tip: one short German tip about a typical German-speaker mistake she made, or "" if none.
Speak to her as "du". Be kind and concise.`;

const systemFor = (mode: string) => `${INTRO}\n\n${mode === "free" ? TASK_FREE : TASK_TRANSLATE}\n\n${OUTPUT}`;

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
  return list.length > 20;
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

async function askGemini(key: string, input: Record<string, unknown>, system: string) {
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
          generationConfig: { temperature: 0.3, responseMimeType: "application/json", responseSchema: SCHEMA },
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

// Supabase Edge Function: turn a short voice recording into text with Gemini.
// Used by the new app's speaking exercises (neu/) and the mic test page (mic-test.html).
// Optional "check": { they, de, answers } – then the same Gemini call also judges her answer
// (one trip instead of transcribe + feedback, so Miri waits about half as long).
// Optional "hint": a short context line, e.g. that she says a dog command (Raluca's tricks).
// The browser records with MediaRecorder, converts to 16 kHz mono WAV and sends it here as base64.
// Secrets (Supabase dashboard → Edge Functions → Secrets):
//   GEMINI_API_KEY   required (same key as the feedback function)
//   GEMINI_MODEL     optional – comma-separated model list, overrides MODELS below
// The key never reaches the browser.

const ALLOWED_ORIGINS = [
  "https://fredybansi-creator.github.io",
  "http://localhost:8765",
  "http://127.0.0.1:8765",
];

// Short per-model timeout: when Gemini is overloaded it hangs; better to try the next model quickly.
const MODEL_TIMEOUT_MS = 9_000;
const MODELS = (Deno.env.get("GEMINI_MODEL") || "gemini-flash-lite-latest,gemini-flash-latest,gemini-3.8-flash")
  .split(",").map((s) => s.trim()).filter(Boolean);

// ~90 s of 16 kHz mono 16-bit WAV is about 2.9 MB, as base64 about 3.9 MB.
const MAX_BASE64 = 4_000_000;
const MIME_OK = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/aac", "audio/ogg", "audio/flac", "audio/aiff", "audio/mp4", "audio/webm"];

const SYSTEM = `You transcribe short voice recordings of Miri, a German woman learning English (about A2–B1).
Write down EXACTLY what she says, word for word, as she said it.
- Do NOT correct grammar, word order, tenses or wrong words. Her mistakes must stay in the text, because a teacher
  will look at them later. Example: if she says "yesterday I go to the doctor", write exactly that.
- If she uses a German word, write the German word as she said it. Do not translate.
- Leave out "ähm", "uh", "um" and similar sounds. Keep repeated words only if she clearly repeated them.
- Use normal sentence punctuation and capital letters.
- If there is no speech, or you cannot understand anything, return an empty text.
Return JSON only: { "text": "..." }`;

const SCHEMA = { type: "OBJECT", properties: { text: { type: "STRING" } }, required: ["text"] };

const CHECK = `You are also her warm, encouraging English coach. She saw a German sentence and said it in English, out loud.
The input tells you what the other person said before (friend_said), the German sentence (german), and example answers.
First write down exactly what she said (rules above), then judge THAT text like a friendly native speaker:
- It does NOT need to be word-for-word. Any natural reply that gets the meaning across is fine.
- "great": natural and complete, at most tiny slips. A simple correct answer is "great" – no fancy words needed.
- "good": understandable, but with grammar mistakes, unnatural wording, or a missing part of the meaning.
- "try": the meaning is mostly missing or wrong, or the answer is very short, or nothing was said.
Return JSON only:
- text: exactly what she said (empty if nothing).
- level: "great" | "good" | "try"
- praise: one short, specific, encouraging sentence in German.
- corrected: HER answer, minimally corrected to natural English (repeat it if already fine). Always English.
- fixes: up to 2 items { wrong, better, why } – wrong = her exact words, better = English to say instead, why = very
  short German explanation (max 15 words). Only real mistakes (wrong meaning, wrong tense, German word order, calques);
  never punctuation or capital letters. Empty if none.
- tip: one short German tip about a typical German-speaker mistake she made, or "".
Use plain everyday English, no idioms. Speak to her as "du". Be kind and concise.`;

const CHECK_SCHEMA = {
  type: "OBJECT",
  properties: {
    text: { type: "STRING" },
    level: { type: "STRING", enum: ["great", "good", "try"] },
    praise: { type: "STRING" },
    corrected: { type: "STRING" },
    fixes: { type: "ARRAY", items: { type: "OBJECT", properties: { wrong: { type: "STRING" }, better: { type: "STRING" }, why: { type: "STRING" } }, required: ["wrong", "better", "why"] } },
    tip: { type: "STRING" },
  },
  required: ["text", "level", "praise", "corrected", "fixes", "tip"],
};

type Check = { they?: string; de?: string; answers?: string[] };
const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 30;
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

async function transcribe(key: string, audio: string, mime: string, check: Check | null, hint = "") {
  let lastError = "no model available";
  const skipped: string[] = [];
  for (const model of MODELS) {
    let res: Response;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: check ? `${SYSTEM.replace(/Return JSON only:.*$/s, "")}\n\n${CHECK}` : SYSTEM }] },
          contents: [{ role: "user", parts: [
            { inlineData: { mimeType: mime, data: audio } },
            { text: check
              ? JSON.stringify({ friend_said: clip(check.they, 300), german: clip(check.de, 400), example_answers: (check.answers || []).slice(0, 4).map((a) => clip(a, 300)) })
              : hint ? `Transcribe this recording exactly as spoken. Context: ${hint}` : "Transcribe this recording exactly as spoken." },
          ] }],
          generationConfig: { temperature: check ? 0.2 : 0, responseMimeType: "application/json", responseSchema: check ? CHECK_SCHEMA : SCHEMA },
        }),
        signal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
      });
    } catch {
      lastError = `${model}: timeout`;
      skipped.push(lastError);
      continue;
    }
    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
      try {
        const r = JSON.parse(text);
        const out: Record<string, unknown> = { model, skipped, text: String(r.text ?? "").trim().slice(0, 2000) };
        if (check) out.check = { level: r.level, praise: r.praise, corrected: r.corrected, fixes: (r.fixes || []).slice(0, 2), tip: r.tip };
        return out;
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

  let body: { audio?: string; mime?: string; check?: Check; hint?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400, origin); }
  const audio = String(body.audio || "");
  const mime = String(body.mime || "audio/wav").split(";")[0].trim().toLowerCase();
  if (!audio) return json({ error: "empty" }, 400, origin);
  if (audio.length > MAX_BASE64) return json({ error: "too_long" }, 413, origin);
  if (!MIME_OK.includes(mime)) return json({ error: "bad_mime", mime }, 400, origin);

  const started = Date.now();
  try {
    const check = body.check && typeof body.check === "object" ? body.check : null;
    const result = await transcribe(key, audio, mime, check, clip(body.hint, 200));
    return json({ ok: true, ...result, ms: Date.now() - started }, 200, origin);
  } catch (e) {
    return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
  }
});

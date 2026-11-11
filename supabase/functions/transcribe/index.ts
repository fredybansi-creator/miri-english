// Supabase Edge Function: turn a short voice recording into text with Gemini.
// Used by the new app's speaking exercises (first by the mic test page, mic-test.html).
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

const MODEL_TIMEOUT_MS = 15_000;
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

async function transcribe(key: string, audio: string, mime: string) {
  let lastError = "no model available";
  const skipped: string[] = [];
  for (const model of MODELS) {
    let res: Response;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [
            { inlineData: { mimeType: mime, data: audio } },
            { text: "Transcribe this recording exactly as spoken." },
          ] }],
          generationConfig: { temperature: 0, responseMimeType: "application/json", responseSchema: SCHEMA },
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
        return { model, skipped, text: String(JSON.parse(text).text ?? "").trim().slice(0, 2000) };
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

  let body: { audio?: string; mime?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400, origin); }
  const audio = String(body.audio || "");
  const mime = String(body.mime || "audio/wav").split(";")[0].trim().toLowerCase();
  if (!audio) return json({ error: "empty" }, 400, origin);
  if (audio.length > MAX_BASE64) return json({ error: "too_long" }, 413, origin);
  if (!MIME_OK.includes(mime)) return json({ error: "bad_mime", mime }, 400, origin);

  const started = Date.now();
  try {
    const { model, skipped, text } = await transcribe(key, audio, mime);
    return json({ ok: true, model, skipped, text, ms: Date.now() - started }, 200, origin);
  } catch (e) {
    return json({ error: "ai_failed", detail: String((e as Error).message) }, 502, origin);
  }
});

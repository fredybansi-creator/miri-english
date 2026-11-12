// Supabase Edge Function: turn a short voice recording into text with Gemini.
// Used by the new app's speaking exercises (neu/) and the mic test page (mic-test.html).
// Optional "check": { they, de, answers } – then a second, text-only Gemini call judges her answer
// (one trip from the phone instead of transcribe + feedback).
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

// Gemini is sometimes overloaded (HTTP 503 "high demand") or hangs. So we don't wait for one model at a time:
// the first model starts at once, and if it has not answered after HEDGE_MS (or fails), the next one starts too.
// (Not much earlier: every extra start costs free-tier quota, and Google answers with 429 when it runs out.)
// The first good answer wins and the others are stopped. A 503 is usually over in a second, and the lite model
// answers in about 1 s, so it is asked again later in the list.
const MODEL_TIMEOUT_MS = 12_000;
const HEDGE_MS = 4_500;
const TOTAL_MS = 22_000;
const MODELS = (Deno.env.get("GEMINI_MODEL") ||
  "gemini-flash-lite-latest,gemini-flash-latest,gemini-flash-lite-latest,gemini-3.8-flash,gemini-flash-lite-latest")
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

const CHECK = `You are the warm, encouraging English coach of Miri, a German woman learning English (about A2–B1).
She saw a German sentence and said it in English, out loud. A speech-to-text step wrote down what she said (she_said).
The input also tells you what the other person said before (friend_said), the German sentence (german), and example answers.
Judge she_said like a friendly native speaker. If she_said is cut off or only part of the sentence, judge it as it is.
Judging:
- It does NOT need to be word-for-word. Any natural reply that gets the meaning across is fine.
- "great": natural and complete, at most tiny slips. A simple correct answer is "great" – no fancy words needed.
- "good": understandable, but with grammar mistakes, unnatural wording, or a missing part of the meaning.
- "try": the meaning is mostly missing or wrong, or the answer is very short, or nothing was said.
Return JSON only:
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
    level: { type: "STRING", enum: ["great", "good", "try"] },
    praise: { type: "STRING" },
    corrected: { type: "STRING" },
    fixes: { type: "ARRAY", items: { type: "OBJECT", properties: { wrong: { type: "STRING" }, better: { type: "STRING" }, why: { type: "STRING" } }, required: ["wrong", "better", "why"] } },
    tip: { type: "STRING" },
  },
  required: ["level", "praise", "corrected", "fixes", "tip"],
};
const EMPTY_CHECK = { level: "try", praise: "Ich habe leider nichts gehört. Versuch es noch einmal!", corrected: "", fixes: [], tip: "" };

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

// Two steps, so the example answers can never leak into what she "said":
// 1) the audio is transcribed with no hint about the expected answer, 2) only the text is judged.
function request(key: string, model: string, audio: string, mime: string, check: Check | null, hint: string, said: string | null, signal: AbortSignal) {
  const judging = check && said !== null;
  const parts = judging
    ? [{ text: JSON.stringify({ she_said: said, friend_said: clip(check!.they, 300), german: clip(check!.de, 400), example_answers: (check!.answers || []).slice(0, 4).map((a) => clip(a, 300)) }) }]
    : [{ inlineData: { mimeType: mime, data: audio } }, { text: hint ? `Transcribe this recording exactly as spoken. Context: ${hint}` : "Transcribe this recording exactly as spoken." }];
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: judging ? CHECK : SYSTEM }] },
      contents: [{ role: "user", parts }],
      generationConfig: { temperature: judging ? 0.2 : 0, responseMimeType: "application/json", responseSchema: judging ? CHECK_SCHEMA : SCHEMA },
    }),
    signal,
  });
}

/** One model: resolves with the result, or throws with a short reason. */
async function tryModel(key: string, model: string, audio: string, mime: string, check: Check | null, hint: string, said: string | null, stop: AbortSignal) {
  const signal = AbortSignal.any([stop, AbortSignal.timeout(MODEL_TIMEOUT_MS)]);
  let res: Response;
  try {
    res = await request(key, model, audio, mime, check, hint, said, signal);
  } catch {
    throw new Error(`${model}: timeout`);
  }
  if (!res.ok) {
    const errText = (await res.text()).replace(/\s+/g, " ");
    const reason = (errText.match(/"message":\s*"([^"]{0,120})/) || [])[1] || "";
    throw new Error(`${model}: HTTP ${res.status} ${reason}`.trim());
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
  let r;
  try { r = JSON.parse(text); } catch { throw new Error(`${model}: unreadable answer`); }
  if (said !== null) return { model, check: { level: r.level, praise: r.praise, corrected: r.corrected, fixes: (r.fixes || []).slice(0, 2), tip: r.tip } };
  return { model, text: String(r.text ?? "").trim().slice(0, 2000) };
}

/** Start models one after another (every HEDGE_MS, or right away when one fails); first good answer wins. */
function race(key: string, audio: string, mime: string, check: Check | null, hint: string, said: string | null, totalMs: number) {
  const stop = new AbortController();
  const skipped: string[] = [];
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    let next = 0, running = 0, done = false, timer = 0;
    const finish = (fn: () => void) => { if (done) return; done = true; clearTimeout(timer); clearTimeout(total); stop.abort(); fn(); };
    const total = setTimeout(() => finish(() => reject(new Error(skipped.join(" | ") || "timeout"))), totalMs);
    const launch = () => {
      clearTimeout(timer);
      if (done) return;
      if (next >= MODELS.length) {
        if (running === 0) finish(() => reject(new Error(skipped.join(" | ") || "no model available")));
        return;
      }
      const model = MODELS[next++];
      running++;
      tryModel(key, model, audio, mime, check, hint, said, stop.signal).then(
        (out) => finish(() => resolve({ ...out, skipped })),
        (e) => {
          running--;
          if (done) return;
          skipped.push(String((e as Error).message));
          console.log("gemini model failed", (e as Error).message);
          clearTimeout(timer);
          timer = setTimeout(launch, 700); // try the next one after a short breath
        },
      );
      timer = setTimeout(launch, HEDGE_MS); // still no answer: start the next one as well
    };
    launch();
  });
}

async function transcribe(key: string, audio: string, mime: string, check: Check | null, hint = "") {
  const started = Date.now();
  const heard = await race(key, audio, mime, null, hint, null, TOTAL_MS);
  const text = String(heard.text || "");
  if (!check) return heard;
  if (!text) return { ...heard, check: EMPTY_CHECK };
  const left = Math.min(10_000, 24_500 - (Date.now() - started)); // the phone waits 26 s at most
  if (left < 2_500) return { ...heard, checkError: "no time left" };
  try {
    const judged = await race(key, "", "", check, "", text, left);
    return { ...heard, check: judged.check, judgeModel: judged.model };
  } catch (e) {
    return { ...heard, checkError: String((e as Error).message) }; // the app then judges with the feedback function
  }
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

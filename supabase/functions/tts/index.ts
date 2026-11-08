// Supabase Edge Function: natural English voice via ElevenLabs, with a permanent audio cache.
//   GET /functions/v1/tts?t=<text>&v=us|uk&r=main|friend
// Each sentence is generated once, stored in the public Storage bucket "tts" and served from there
// afterwards (302 redirect), so ElevenLabs credits are only used for new sentences.
// Secrets: ELEVENLABS_API_KEY (required), ELEVEN_MODEL (optional, default eleven_flash_v2_5).

const ALLOWED_ORIGINS = [
  "https://fredybansi-creator.github.io",
  "http://localhost:8765",
  "http://127.0.0.1:8765",
];

// Premade ElevenLabs voices (available on every account).
const VOICES: Record<string, Record<string, string>> = {
  us: { main: "cgSgspJ2msm6clMCkdW9", friend: "bIHbv24MWmeRgasZH58o" }, // Jessica · Will
  uk: { main: "Xb7hH8MSUJpSbSDYk0k2", friend: "JBFqnCBsd6RMkjVDRZzb" }, // Alice · George
};

const MODEL = Deno.env.get("ELEVEN_MODEL") || "eleven_flash_v2_5";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "tts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, range",
};

// small in-memory limit on NEW generations (cached audio is not limited)
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 40;
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const err = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "GET" && req.method !== "HEAD") return err(405, "method");

  // Only the app may trigger generation (audio elements send a Referer, fetch sends an Origin).
  const from = req.headers.get("origin") || req.headers.get("referer") || "";
  if (!ALLOWED_ORIGINS.some((o) => from.startsWith(o))) return err(403, "origin");

  const url = new URL(req.url);
  const text = (url.searchParams.get("t") || "").replace(/\s+/g, " ").trim().slice(0, 600);
  if (!text) return err(400, "empty");
  const accent = url.searchParams.get("v") === "uk" ? "uk" : "us";
  const role = url.searchParams.get("r") === "friend" ? "friend" : "main";
  const voice = VOICES[accent][role];

  const path = `${voice}/${await sha256(`${MODEL}|${voice}|${text}`)}.mp3`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

  // 1) cached?
  const head = await fetch(publicUrl, { method: "HEAD" });
  if (head.ok) {
    return new Response(null, {
      status: 302,
      headers: { ...CORS, Location: publicUrl, "Cache-Control": "public, max-age=604800" },
    });
  }

  // 2) generate with ElevenLabs
  const key = Deno.env.get("ELEVENLABS_API_KEY")?.trim().replace(/^["']|["']$/g, "");
  if (!key) return err(503, "not_configured");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return err(429, "rate_limited");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
    }),
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);

  if (!res || !res.ok) {
    const detail = res ? (await res.text()).slice(0, 200) : "timeout";
    console.log("elevenlabs failed", res?.status, detail);
    if (res?.status === 401 && !key.startsWith("sk_")) console.log("hint: ELEVENLABS_API_KEY does not look like an ElevenLabs key (should start with sk_)");
    // 401 = bad key, 402/429 = quota used up → app falls back to the built-in voice
    return err(502, `elevenlabs_${res?.status || "timeout"}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());

  // 3) store for next time (don't make her wait if storage is slow)
  const upload = fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": "audio/mpeg",
      "x-upsert": "true",
      "cache-control": "31536000",
    },
    body: bytes,
  }).then(async (r) => { if (!r.ok) console.log("upload failed", r.status, (await r.text()).slice(0, 200)); })
    .catch((e) => console.log("upload error", String(e)));
  // @ts-ignore EdgeRuntime is provided by Supabase
  if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(upload); else await upload;

  return new Response(req.method === "HEAD" ? null : bytes, {
    headers: { ...CORS, "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=604800" },
  });
});

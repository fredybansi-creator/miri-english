// Supabase Edge Function: backup and restore of learning progress.
//   POST { action: "get", code }                       → { ok, data | null, updatedAt }
//   POST { action: "put", code, data, updatedAt }        → { ok }
// The backup code is the only key (like a password). Only its SHA-256 hash is stored.

const ALLOWED_ORIGINS = [
  "https://fredybansi-creator.github.io",
  "http://localhost:8765",
  "http://127.0.0.1:8765",
];
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CODE_RE = /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
const MAX_BYTES = 1_000_000;

function cors(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}
const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(origin), "Content-Type": "application/json" } });

const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 30;
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const rest = (path: string, init: RequestInit = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "method" }, 405, origin);
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return json({ error: "origin" }, 403, origin);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ error: "rate_limited" }, 429, origin);

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return json({ error: "too_large" }, 413, origin);
  let body: { action?: string; code?: string; data?: unknown; updatedAt?: number };
  try { body = JSON.parse(raw); } catch { return json({ error: "bad_json" }, 400, origin); }

  const code = String(body.code || "").toUpperCase().trim();
  if (!CODE_RE.test(code)) return json({ error: "bad_code" }, 400, origin);
  const id = await sha256(`miri-english|${code}`);

  if (body.action === "get") {
    const r = await rest(`progress?id=eq.${id}&select=data,updated_at`);
    if (!r.ok) return json({ error: "db" }, 502, origin);
    const rows = await r.json();
    if (!rows.length) return json({ ok: true, data: null }, 200, origin);
    return json({ ok: true, data: rows[0].data, updatedAt: Date.parse(rows[0].updated_at) }, 200, origin);
  }

  if (body.action === "put") {
    if (!body.data || typeof body.data !== "object") return json({ error: "no_data" }, 400, origin);
    const updatedAt = Number(body.updatedAt) || Date.now();
    const r = await rest("progress", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id, data: body.data, updated_at: new Date(updatedAt).toISOString() }),
    });
    if (!r.ok) {
      console.log("put failed", r.status, (await r.text()).slice(0, 200));
      return json({ error: "db" }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  }

  return json({ error: "action" }, 400, origin);
});

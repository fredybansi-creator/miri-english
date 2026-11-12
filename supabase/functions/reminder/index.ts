// Supabase Edge Function: Raluca's daily reminder at 19:00 (Berlin time) as an iPhone push message.
//   POST { action: "key" }                          → { ok, key }   public VAPID key for the browser
//   POST { action: "subscribe", code, subscription } → { ok }        save this phone's push address
//   POST { action: "unsubscribe", code }             → { ok }
//   POST { action: "test", code }                    → { ok }        send one message now
//   POST { action: "cron", secret }                  → { ok, sent }  called every hour by pg_cron;
//        at 19:00 Berlin time it messages every phone that has no finished lesson today.
// The VAPID keys and the cron secret are made on first use and kept in the table app_secrets
// (row level security, no policies: only the service role can read it). Nothing secret is in the repo.
// iPhone: push works only when the app is added to the home screen (iOS 16.4+).

import webpush from "npm:web-push@3.6.7";

const ALLOWED_ORIGINS = [
  "https://fredybansi-creator.github.io",
  "http://localhost:8765",
  "http://127.0.0.1:8765",
];
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CODE_RE = /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
const HOUR = 19;
const TZ = "Europe/Berlin";

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

const rest = (path: string, init: RequestInit = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------- secrets kept in the database
async function getSecret(name: string): Promise<string | null> {
  const r = await rest(`app_secrets?name=eq.${name}&select=value`);
  const rows = r.ok ? await r.json() : [];
  return rows[0]?.value ?? null;
}
async function setSecret(name: string, value: string) {
  await rest("app_secrets", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ name, value }) });
}
let vapid: { publicKey: string; privateKey: string } | null = null;
async function keys() {
  if (vapid) return vapid;
  let pub = await getSecret("vapid_public"), priv = await getSecret("vapid_private");
  if (!pub || !priv) {
    const k = webpush.generateVAPIDKeys();
    await setSecret("vapid_public", k.publicKey);
    await setSecret("vapid_private", k.privateKey);
    await setSecret("cron_secret", crypto.randomUUID() + crypto.randomUUID());
    pub = k.publicKey; priv = k.privateKey;
  }
  vapid = { publicKey: pub, privateKey: priv };
  webpush.setVapidDetails("https://fredybansi-creator.github.io/miri-english/", pub, priv);
  return vapid;
}

// ---------------------------------------------------------------- the message
const berlinDate = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
const berlinHour = (d = new Date()) => Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" }).format(d));

function daysSince(last: string | undefined, todayStr: string) {
  if (!last) return null;
  return Math.round((Date.parse(todayStr) - Date.parse(last)) / 86400000);
}
function message(data: { days?: string[] } | null, todayStr: string) {
  const last = (data?.days || []).slice().sort().pop();
  const d = daysSince(last, todayStr);
  if (d !== null && d >= 2) return { title: "Raluca ist traurig 🦊", body: "Sie vermisst dich! Mach heute eine kurze Lektion mit ihr." };
  if (d === 1) return { title: "Raluca hat Hunger 🦊", body: "Ihr Napf ist leer. Zeit für deine 10 Minuten Englisch!" };
  return { title: "Raluca wartet auf dich 🦊", body: "Zeit für deine 10 Minuten Englisch!" };
}

async function send(sub: unknown, msg: { title: string; body: string }) {
  await keys();
  // deno-lint-ignore no-explicit-any
  return await webpush.sendNotification(sub as any, JSON.stringify({ ...msg, url: "/miri-english/neu/" }), { TTL: 4 * 3600, urgency: "high" });
}

async function progressOf(id: string) {
  const r = await rest(`progress?id=eq.${id}&select=data`);
  const rows = r.ok ? await r.json() : [];
  return rows[0]?.data ?? null;
}

async function cron() {
  if (berlinHour() !== HOUR) return { sent: 0, skipped: "not 19:00" };
  const todayStr = berlinDate();
  const r = await rest(`push_subs?select=id,subscription,last_sent`);
  const subs = r.ok ? await r.json() : [];
  let sent = 0;
  for (const s of subs) {
    if (s.last_sent === todayStr) continue;
    const data = await progressOf(s.id);
    if (data?.days?.includes(todayStr)) continue; // already practised today
    try {
      await send(s.subscription, message(data, todayStr));
      sent++;
      await rest(`push_subs?id=eq.${s.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ last_sent: todayStr }) });
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      console.log("push failed", status, String((e as Error).message).slice(0, 160));
      if (status === 404 || status === 410) await rest(`push_subs?id=eq.${s.id}`, { method: "DELETE" }); // phone said: gone
    }
  }
  return { sent };
}

// ---------------------------------------------------------------- requests
Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "method" }, 405, origin);
  let body: { action?: string; code?: string; subscription?: { endpoint?: string; keys?: unknown }; secret?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400, origin); }

  if (body.action === "cron") {
    await keys();
    const secret = await getSecret("cron_secret");
    if (!secret || body.secret !== secret) return json({ error: "forbidden" }, 403, origin);
    return json({ ok: true, ...(await cron()) }, 200, origin);
  }

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return json({ error: "origin" }, 403, origin);
  if (body.action === "key") return json({ ok: true, key: (await keys()).publicKey }, 200, origin);

  const code = String(body.code || "").toUpperCase().trim();
  if (!CODE_RE.test(code)) return json({ error: "bad_code" }, 400, origin);
  const id = await sha256(`miri-english|${code}`);

  if (body.action === "subscribe") {
    const sub = body.subscription;
    if (!sub || typeof sub.endpoint !== "string" || !/^https:\/\//.test(sub.endpoint) || !sub.keys) return json({ error: "bad_subscription" }, 400, origin);
    const r = await rest("push_subs", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id, subscription: { endpoint: sub.endpoint, keys: sub.keys } }),
    });
    return r.ok ? json({ ok: true }, 200, origin) : json({ error: "db" }, 502, origin);
  }
  if (body.action === "unsubscribe") {
    await rest(`push_subs?id=eq.${id}`, { method: "DELETE" });
    return json({ ok: true }, 200, origin);
  }
  if (body.action === "test") {
    const r = await rest(`push_subs?id=eq.${id}&select=subscription`);
    const rows = r.ok ? await r.json() : [];
    if (!rows.length) return json({ error: "not_subscribed" }, 404, origin);
    try {
      await send(rows[0].subscription, { title: "Raluca sagt Hallo 🦊", body: "So sieht deine Erinnerung um 19 Uhr aus." });
      return json({ ok: true }, 200, origin);
    } catch (e) {
      return json({ error: "push_failed", detail: String((e as Error).message).slice(0, 200), status: (e as { statusCode?: number }).statusCode }, 502, origin);
    }
  }
  return json({ error: "action" }, 400, origin);
});

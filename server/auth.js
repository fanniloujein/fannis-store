/* ==========================================================================
   Authentification de l'administratrice
   - identifiants dans les variables d'environnement ADMIN_EMAIL / ADMIN_PASSWORD
   - session : jeton signé HMAC dans un cookie HttpOnly (12 h)
   - limitation des tentatives de connexion
   ========================================================================== */
import crypto from "node:crypto";

const COOKIE = "fanni_admin";
const TTL = 12 * 60 * 60 * 1000;
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.SESSION_SECRET) console.warn("⚠️  SESSION_SECRET non défini : les sessions admin seront perdues à chaque redémarrage.");

const sign = s => crypto.createHmac("sha256", SECRET).update(s).digest("base64url");
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const hashEq = (a, b) => crypto.timingSafeEqual(crypto.createHash("sha256").update(String(a)).digest(), crypto.createHash("sha256").update(String(b)).digest());

export function adminConfigured() { return Boolean(process.env.ADMIN_PASSWORD); }
export function adminEmail() { return (process.env.ADMIN_EMAIL || "admin@fannis-store.com").trim().toLowerCase(); }

export function checkCredentials(email, password) {
  if (!adminConfigured()) return false;
  const okEmail = hashEq(String(email || "").trim().toLowerCase(), adminEmail());
  const okPass = hashEq(String(password || ""), process.env.ADMIN_PASSWORD);
  return okEmail && okPass;
}

export function issue(res, email, secure) {
  const payload = Buffer.from(JSON.stringify({ e: email, x: Date.now() + TTL })).toString("base64url");
  const token = payload + "." + sign(payload);
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: "lax", secure, maxAge: TTL, path: "/" });
}

export function clear(res) { res.clearCookie(COOKIE, { path: "/" }); }

function parseCookies(header = "") {
  return Object.fromEntries(header.split(";").map(c => c.trim().split("=")).filter(p => p[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join("="))]));
}

export function session(req) {
  const t = parseCookies(req.headers.cookie)[COOKIE];
  if (!t || !t.includes(".")) return null;
  const [payload, sig] = t.split(".");
  if (!safeEq(sig, sign(payload))) return null;
  try { const d = JSON.parse(Buffer.from(payload, "base64url").toString()); return d.x > Date.now() ? { email: d.e } : null; } catch { return null; }
}

/* protège les routes admin : session valide + en-tête anti-CSRF sur les écritures */
export function requireAdmin(req, res, next) {
  const s = session(req);
  if (!s) return res.status(401).json({ error: "Session expirée, merci de vous reconnecter." });
  if (req.method !== "GET" && req.get("X-Requested-With") !== "fanni-admin") return res.status(403).json({ error: "Requête refusée." });
  req.admin = s; next();
}

/* limiteur simple en mémoire */
export function rateLimit({ windowMs, max, message }) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.ip || "x", now = Date.now();
    const h = (hits.get(key) || []).filter(t => now - t < windowMs);
    if (h.length >= max) return res.status(429).json({ error: message || "Trop de tentatives, réessayez plus tard." });
    h.push(now); hits.set(key, h);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => now - t < windowMs)) hits.delete(k);
    next();
  };
}

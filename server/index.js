/* ==========================================================================
   Fanni's Store — serveur (site public + API + espace /admin)
   Variables d'environnement :
     DATABASE_URL     PostgreSQL (Render, Neon, Supabase…). Sans elle : fichier data/store.json
     ADMIN_EMAIL      email de connexion à l'admin
     ADMIN_PASSWORD   mot de passe de l'admin
     SESSION_SECRET   longue chaîne aléatoire pour signer les sessions
     PUBLIC_URL       adresse du site (ex. https://www.fannis-store.com) pour le sitemap
   ========================================================================== */
import express from "express";
import compression from "compression";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createStore, newId } from "./store.js";
import { seed, publicCatalog, catalogScript, sitemapXml, BUILDER_COLS } from "./catalog.js";
import * as auth from "./auth.js";
import * as S from "./schemas.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function createApp({ store } = {}) {
  store = store || await createStore({ dataDir: path.join(ROOT, "data") });
  await seed(store, ROOT);

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(compression());
  app.use((req, res, next) => {
    res.set({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN" });
    next();
  });

  /* ---------- cache du catalogue public ---------- */
  let cache = null;
  const catalog = async () => (cache ||= await publicCatalog(store));
  const invalidate = () => { cache = null; };
  const secure = req => req.secure || req.get("x-forwarded-proto") === "https";
  const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  const json = express.json({ limit: "200kb" });

  /* ---------- fichiers générés ---------- */
  app.get("/assets/js/data.js", wrap(async (req, res) => {
    const body = catalogScript(await catalog());
    const etag = '"' + crypto.createHash("sha1").update(body).digest("base64url") + '"';
    res.set({ "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-cache", ETag: etag });
    if (req.get("if-none-match") === etag) return res.status(304).end();
    res.send(body);
  }));
  app.get("/sitemap.xml", wrap(async (req, res) => {
    const base = (process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
    res.type("application/xml").send(sitemapXml(await catalog(), base));
  }));
  app.get("/media/:id", wrap(async (req, res) => {
    const img = await store.getImage(req.params.id);
    if (!img) return res.status(404).end();
    res.set({ "Content-Type": img.mime, "Cache-Control": "public, max-age=31536000, immutable" }).send(img.data);
  }));

  /* ---------- API publique ---------- */
  const publicLimit = auth.rateLimit({ windowMs: 10 * 60 * 1000, max: 30, message: "Trop d'envois, réessayez dans quelques minutes." });
  app.post("/api/orders", publicLimit, json, wrap(async (req, res) => {
    const o = S.cleanOrder(req.body || {});
    let id = o.orderNo || "FS-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + newId(4).toUpperCase();
    if (await store.get("orders", id)) id += "-" + newId(3).toUpperCase();
    o.orderNo = id;
    await store.put("orders", id, o, 0);
    res.status(201).json({ ok: true, orderNo: id });
  }));
  app.post("/api/messages", publicLimit, json, wrap(async (req, res) => {
    const m = S.cleanMessage(req.body || {});
    await store.put("messages", newId(10), m, 0);
    res.status(201).json({ ok: true });
  }));
  app.post("/api/newsletter", publicLimit, json, wrap(async (req, res) => {
    const email = S.cleanEmail(req.body?.email);
    const id = crypto.createHash("sha1").update(email).digest("hex").slice(0, 16);
    if (!await store.get("subscribers", id)) await store.put("subscribers", id, { email, source: String(req.body?.source || "site").slice(0, 30) }, 0);
    res.status(201).json({ ok: true });
  }));

  /* ---------- connexion admin ---------- */
  const loginLimit = auth.rateLimit({ windowMs: 15 * 60 * 1000, max: 8, message: "Trop de tentatives de connexion. Réessayez dans 15 minutes." });
  app.post("/api/admin/login", loginLimit, json, (req, res) => {
    if (!auth.adminConfigured()) return res.status(503).json({ error: "L'admin n'est pas encore configuré : ajoutez ADMIN_PASSWORD dans les variables d'environnement du serveur." });
    if (!auth.checkCredentials(req.body?.email, req.body?.password)) return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    auth.issue(res, auth.adminEmail(), secure(req));
    res.json({ ok: true, email: auth.adminEmail() });
  });
  app.post("/api/admin/logout", (req, res) => { auth.clear(res); res.json({ ok: true }); });
  app.get("/api/admin/me", (req, res) => {
    const s = auth.session(req);
    res.json({ authenticated: !!s, email: s?.email, configured: auth.adminConfigured(), storage: store.kind });
  });

  /* ---------- API admin (protégée) ---------- */
  const admin = express.Router();
  admin.use(auth.requireAdmin);
  admin.use(express.json({ limit: "12mb" }));

  admin.get("/schemas", (req, res) => res.json({ simple: S.SIMPLE, artModels: S.ART_MODELS, artDecos: S.ART_DECOS, badges: S.BADGES, orderStatuses: S.ORDER_STATUSES, storage: store.kind }));

  admin.get("/stats", wrap(async (req, res) => {
    const orders = await store.list("orders");
    const valid = orders.filter(o => o.status !== "annulee");
    const now = new Date(), monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() - (13 - i)); return d.toISOString().slice(0, 10); });
    const perDay = Object.fromEntries(days.map(d => [d, { orders: 0, revenue: 0 }]));
    for (const o of valid) { const d = new Date(o._created).toISOString().slice(0, 10); if (perDay[d]) { perDay[d].orders++; perDay[d].revenue += o.total; } }
    const products = await store.list("products");
    const messages = await store.list("messages");
    res.json({
      revenue: valid.filter(o => o.status === "livree" || o.status === "expediee" || o.status === "preparation" || o.status === "confirmee").reduce((s, o) => s + o.total, 0),
      revenueMonth: valid.filter(o => new Date(o._created) >= monthStart).reduce((s, o) => s + o.total, 0),
      ordersMonth: valid.filter(o => new Date(o._created) >= monthStart).length,
      ordersNew: orders.filter(o => o.status === "nouvelle").length,
      ordersTotal: orders.length,
      byStatus: Object.fromEntries(S.ORDER_STATUSES.map(s => [s, orders.filter(o => o.status === s).length])),
      productsPublished: products.filter(p => p.published !== false).length,
      productsDraft: products.filter(p => p.published === false).length,
      subscribers: await store.count("subscribers"),
      messagesUnread: messages.filter(m => !m.read).length,
      days: days.map(d => ({ day: d, ...perDay[d] })),
      latest: orders.slice().sort((a, b) => new Date(b._created) - new Date(a._created)).slice(0, 6),
      topProducts: Object.entries(valid.flatMap(o => o.items).reduce((m, it) => ((m[it.name] = (m[it.name] || 0) + it.qty), m), {})).sort((a, b) => b[1] - a[1]).slice(0, 5)
    });
  }));

  /* produits */
  const meta = async () => ({ occasions: await store.getSetting("occasions", []), recipients: await store.getSetting("recipients", []) });
  admin.get("/products", wrap(async (req, res) => res.json(await store.list("products"))));
  admin.get("/products/:id", wrap(async (req, res) => { const p = await store.get("products", req.params.id); p ? res.json(p) : res.status(404).json({ error: "Produit introuvable." }); }));
  admin.post("/products", wrap(async (req, res) => {
    const p = S.cleanProduct(req.body || {}, await meta());
    let id = S.slug(req.body?.id || p.name.fr) || "produit", base = id, n = 2;
    while (await store.get("products", id)) id = `${base}-${n++}`;
    const saved = await store.put("products", id, p, req.body?.first ? -1 : undefined);
    invalidate(); res.status(201).json(saved);
  }));
  admin.put("/products/:id", wrap(async (req, res) => {
    const ex = await store.get("products", req.params.id);
    if (!ex) return res.status(404).json({ error: "Produit introuvable." });
    const p = S.cleanProduct({ ...ex, ...req.body }, await meta());
    const saved = await store.put("products", req.params.id, p);
    invalidate(); res.json(saved);
  }));
  admin.delete("/products/:id", wrap(async (req, res) => { await store.remove("products", req.params.id); invalidate(); res.json({ ok: true }); }));
  admin.post("/products-reorder", wrap(async (req, res) => { await store.reorder("products", (req.body?.ids || []).map(String)); invalidate(); res.json({ ok: true }); }));

  /* collections simples : configurateur + avis */
  admin.get("/c/:col", wrap(async (req, res) => { if (!S.SIMPLE[req.params.col]) return res.status(404).end(); res.json(await store.list(req.params.col)); }));
  admin.post("/c/:col", wrap(async (req, res) => {
    const col = req.params.col, sch = S.SIMPLE[col]; if (!sch) return res.status(404).end();
    const d = S.cleanSimple(col, req.body || {});
    let id = S.slug(d[sch.idFrom]) || newId(6), base = id, n = 2;
    while (await store.get(col, id)) id = `${base}-${n++}`;
    const saved = await store.put(col, id, d); invalidate(); res.status(201).json(saved);
  }));
  admin.put("/c/:col/:id", wrap(async (req, res) => {
    const col = req.params.col; if (!S.SIMPLE[col]) return res.status(404).end();
    if (!await store.get(col, req.params.id)) return res.status(404).json({ error: "Élément introuvable." });
    const saved = await store.put(col, req.params.id, S.cleanSimple(col, req.body || {})); invalidate(); res.json(saved);
  }));
  admin.delete("/c/:col/:id", wrap(async (req, res) => { if (!S.SIMPLE[req.params.col]) return res.status(404).end(); await store.remove(req.params.col, req.params.id); invalidate(); res.json({ ok: true }); }));
  admin.post("/c/:col/reorder", wrap(async (req, res) => { if (!S.SIMPLE[req.params.col]) return res.status(404).end(); await store.reorder(req.params.col, (req.body?.ids || []).map(String)); invalidate(); res.json({ ok: true }); }));

  /* commandes */
  admin.get("/orders", wrap(async (req, res) => res.json((await store.list("orders")).sort((a, b) => new Date(b._created) - new Date(a._created)))));
  admin.put("/orders/:id", wrap(async (req, res) => {
    const o = await store.get("orders", req.params.id); if (!o) return res.status(404).json({ error: "Commande introuvable." });
    const { id, _position, _created, _updated, ...data } = o;
    if (req.body.status && S.ORDER_STATUSES.includes(req.body.status) && req.body.status !== data.status) { data.status = req.body.status; data.history = [...(data.history || []), { status: data.status, at: new Date().toISOString() }]; }
    if (typeof req.body.note === "string") data.note = req.body.note.slice(0, 2000);
    res.json(await store.put("orders", id, data));
  }));
  admin.delete("/orders/:id", wrap(async (req, res) => { await store.remove("orders", req.params.id); res.json({ ok: true }); }));

  /* messages & newsletter */
  admin.get("/messages", wrap(async (req, res) => res.json((await store.list("messages")).sort((a, b) => new Date(b._created) - new Date(a._created)))));
  admin.put("/messages/:id", wrap(async (req, res) => { const m = await store.get("messages", req.params.id); if (!m) return res.status(404).end(); const { id, _position, _created, _updated, ...d } = m; d.read = !!req.body.read; res.json(await store.put("messages", id, d)); }));
  admin.delete("/messages/:id", wrap(async (req, res) => { await store.remove("messages", req.params.id); res.json({ ok: true }); }));
  admin.get("/subscribers", wrap(async (req, res) => res.json((await store.list("subscribers")).sort((a, b) => new Date(b._created) - new Date(a._created)))));
  admin.delete("/subscribers/:id", wrap(async (req, res) => { await store.remove("subscribers", req.params.id); res.json({ ok: true }); }));

  /* réglages */
  admin.get("/settings", wrap(async (req, res) => res.json({
    config: await store.getSetting("config", {}), occasions: await store.getSetting("occasions", []), recipients: await store.getSetting("recipients", []),
    ribbons: await store.getSetting("ribbons", []), cardStyles: await store.getSetting("cardStyles", [])
  })));
  admin.put("/settings/config", wrap(async (req, res) => { const c = S.cleanConfig(req.body || {}, await store.getSetting("config", {})); await store.setSetting("config", c); invalidate(); res.json(c); }));
  admin.put("/settings/:key(occasions|recipients|ribbons|cardStyles)", wrap(async (req, res) => { const l = S.cleanList(req.params.key, req.body); await store.setSetting(req.params.key, l); invalidate(); res.json(l); }));

  /* images (envoyées en base64, déjà redimensionnées par le navigateur) */
  admin.post("/images", wrap(async (req, res) => {
    const { data, mime } = req.body || {};
    if (!/^image\/(webp|jpeg|png|avif)$/.test(mime || "")) return res.status(400).json({ error: "Format d'image non pris en charge (JPG, PNG, WebP)." });
    const buf = Buffer.from(String(data || ""), "base64");
    if (!buf.length || buf.length > 6 * 1024 * 1024) return res.status(400).json({ error: "Image vide ou trop lourde (6 Mo max)." });
    const id = await store.saveImage(mime, buf);
    res.status(201).json({ id, url: "/media/" + id });
  }));

  app.use("/api/admin", admin);

  /* ---------- fichiers statiques (liste blanche) ---------- */
  const staticOpts = { extensions: ["html"], index: "index.html", setHeaders: (res, p) => { if (/\.(css|js|svg|png|jpe?g|webp|woff2?)$/.test(p)) res.set("Cache-Control", "public, max-age=3600"); } };
  const serve = express.static(ROOT, staticOpts);
  app.use((req, res, next) => {
    const p = req.path;
    const allowed = p === "/" || p === "/admin" || p.startsWith("/assets/") || p.startsWith("/admin/") || /^\/[\w-]+\.(html|txt|webmanifest)$/.test(p) || /^\/[\w-]+$/.test(p);
    if (!allowed || p.startsWith("/server") || p.startsWith("/data") || p.startsWith("/node_modules")) return next();
    if (p === "/admin") return res.redirect(301, "/admin/");
    serve(req, res, next);
  });

  /* ---------- erreurs ---------- */
  app.use("/api", (req, res) => res.status(404).json({ error: "Route inconnue." }));
  app.use((req, res) => res.status(404).sendFile(path.join(ROOT, "index.html")));
  app.use((err, req, res, next) => {
    if (err instanceof S.ValidationError) return res.status(400).json({ error: err.message });
    if (err.type === "entity.too.large") return res.status(413).json({ error: "Fichier trop lourd." });
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Données invalides." });
    console.error(err);
    res.status(500).json({ error: "Erreur du serveur, réessayez dans un instant." });
  });

  app.locals.store = store;
  return app;
}

/* démarrage direct */
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const app = await createApp();
  const port = +process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🎁 Fanni's Store en ligne sur http://localhost:${port}  (admin : /admin, stockage : ${app.locals.store.kind})`);
    if (!auth.adminConfigured()) console.warn("⚠️  ADMIN_PASSWORD non défini : la connexion à l'admin est désactivée.");
  });
}

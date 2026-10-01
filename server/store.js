/* ==========================================================================
   Stockage : PostgreSQL (DATABASE_URL) ou fichier JSON local (développement)
   Toutes les données éditables vivent dans 3 tables :
     docs     (collection, id, data jsonb, position)  → produits, commandes…
     settings (key, value jsonb)                       → réglages, listes
     images   (id, mime, data bytea)                   → photos téléversées
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const newId = (n = 10) => crypto.randomBytes(n).toString("base64url").slice(0, n);

function sslFor(url) {
  if (process.env.PGSSL === "disable") return false;
  if (process.env.PGSSL === "require") return { rejectUnauthorized: false };
  try {
    const u = new URL(url);
    if (u.searchParams.get("sslmode") === "disable") return false;
    // localhost ou hôte interne sans domaine (ex. réseau privé Render) : pas de SSL
    if (/^(localhost|127\.0\.0\.1)$/.test(u.hostname) || !u.hostname.includes(".")) return false;
  } catch { /* URL invalide : on laisse pg gérer l'erreur */ }
  return { rejectUnauthorized: false };
}

/* ---------------- PostgreSQL ---------------- */
async function pgStore(url) {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({ connectionString: url, ssl: sslFor(url), max: 5 });
  const q = (text, params) => pool.query(text, params);
  await q(`CREATE TABLE IF NOT EXISTS docs (
      collection TEXT NOT NULL, id TEXT NOT NULL, data JSONB NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (collection, id))`);
  await q(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value JSONB NOT NULL)`);
  await q(`CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data BYTEA NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const row = r => ({ ...r.data, id: r.id, _position: r.position, _created: r.created_at, _updated: r.updated_at });
  return {
    kind: "postgres",
    async list(col) { return (await q(`SELECT * FROM docs WHERE collection=$1 ORDER BY position, created_at`, [col])).rows.map(row); },
    async get(col, id) { const r = (await q(`SELECT * FROM docs WHERE collection=$1 AND id=$2`, [col, id])).rows[0]; return r ? row(r) : null; },
    async put(col, id, data, position) {
      if (position === undefined) {
        const ex = (await q(`SELECT position FROM docs WHERE collection=$1 AND id=$2`, [col, id])).rows[0];
        position = ex ? ex.position : ((await q(`SELECT COALESCE(MAX(position),-1)+1 AS p FROM docs WHERE collection=$1`, [col])).rows[0].p);
      }
      const r = (await q(`INSERT INTO docs (collection,id,data,position) VALUES ($1,$2,$3,$4)
        ON CONFLICT (collection,id) DO UPDATE SET data=EXCLUDED.data, position=EXCLUDED.position, updated_at=now() RETURNING *`, [col, id, data, position])).rows[0];
      return row(r);
    },
    async remove(col, id) { return (await q(`DELETE FROM docs WHERE collection=$1 AND id=$2`, [col, id])).rowCount > 0; },
    async reorder(col, ids) {
      const c = await pool.connect();
      try { await c.query("BEGIN"); for (let i = 0; i < ids.length; i++) await c.query(`UPDATE docs SET position=$3 WHERE collection=$1 AND id=$2`, [col, ids[i], i]); await c.query("COMMIT"); }
      catch (e) { await c.query("ROLLBACK"); throw e; } finally { c.release(); }
    },
    async count(col) { return +(await q(`SELECT COUNT(*) AS n FROM docs WHERE collection=$1`, [col])).rows[0].n; },
    async getSetting(key, def = null) { const r = (await q(`SELECT value FROM settings WHERE key=$1`, [key])).rows[0]; return r ? r.value : def; },
    async setSetting(key, value) { await q(`INSERT INTO settings (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`, [key, JSON.stringify(value)]); },
    async saveImage(mime, buf) { const id = newId(16); await q(`INSERT INTO images (id,mime,data) VALUES ($1,$2,$3)`, [id, mime, buf]); return id; },
    async getImage(id) { return (await q(`SELECT mime, data FROM images WHERE id=$1`, [id])).rows[0] || null; },
    async deleteImage(id) { await q(`DELETE FROM images WHERE id=$1`, [id]); },
    async close() { await pool.end(); }
  };
}

/* ---------------- Fichier JSON (développement / secours) ---------------- */
function fileStore(dir) {
  const file = path.join(dir, "store.json"), mediaDir = path.join(dir, "media");
  fs.mkdirSync(mediaDir, { recursive: true });
  let db = { docs: {}, settings: {} };
  try { db = JSON.parse(fs.readFileSync(file, "utf8")); } catch { /* premier démarrage */ }
  let timer = null;
  const save = () => { clearTimeout(timer); timer = setTimeout(() => { const tmp = file + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(db)); fs.renameSync(tmp, file); }, 50); };
  const colOf = c => (db.docs[c] ||= {});
  const row = (id, r) => ({ ...r.data, id, _position: r.position, _created: r.created, _updated: r.updated });
  return {
    kind: "file",
    async list(col) { return Object.entries(colOf(col)).sort((a, b) => a[1].position - b[1].position || a[1].created.localeCompare(b[1].created)).map(([id, r]) => row(id, r)); },
    async get(col, id) { const r = colOf(col)[id]; return r ? row(id, r) : null; },
    async put(col, id, data, position) {
      const c = colOf(col), now = new Date().toISOString(), ex = c[id];
      if (position === undefined) position = ex ? ex.position : Object.values(c).reduce((m, r) => Math.max(m, r.position), -1) + 1;
      c[id] = { data, position, created: ex ? ex.created : now, updated: now }; save(); return row(id, c[id]);
    },
    async remove(col, id) { const c = colOf(col); if (!c[id]) return false; delete c[id]; save(); return true; },
    async reorder(col, ids) { const c = colOf(col); ids.forEach((id, i) => { if (c[id]) c[id].position = i; }); save(); },
    async count(col) { return Object.keys(colOf(col)).length; },
    async getSetting(key, def = null) { return key in db.settings ? db.settings[key] : def; },
    async setSetting(key, value) { db.settings[key] = value; save(); },
    async saveImage(mime, buf) { const id = newId(16); fs.writeFileSync(path.join(mediaDir, id), buf); db.settings["__img_" + id] = mime; save(); return id; },
    async getImage(id) { if (!/^[\w-]+$/.test(id)) return null; const p = path.join(mediaDir, id); if (!fs.existsSync(p)) return null; return { mime: db.settings["__img_" + id] || "image/webp", data: fs.readFileSync(p) }; },
    async deleteImage(id) { if (!/^[\w-]+$/.test(id)) return; try { fs.unlinkSync(path.join(mediaDir, id)); } catch { } delete db.settings["__img_" + id]; save(); },
    async close() { clearTimeout(timer); fs.writeFileSync(file, JSON.stringify(db)); }
  };
}

export async function createStore({ databaseUrl = process.env.DATABASE_URL, dataDir } = {}) {
  if (databaseUrl) return pgStore(databaseUrl);
  return fileStore(dataDir || path.resolve("data"));
}

/* ==========================================================================
   Catalogue : initialisation de la base à partir de assets/js/data.js,
   puis génération dynamique du fichier data.js lu par le site public.
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export const BUILDER_COLS = {
  builder_boxes: "boxes",
  builder_categories: "categories",
  builder_items: "items",
  builder_wrappings: "wrappings",
  builder_extras: "extras"
};
const META_KEYS = ["occasions", "recipients", "ribbons", "cardStyles"];

/* lit le data.js d'origine (valeurs par défaut) */
export function readDefaults(root) {
  const code = fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8");
  const sandbox = {};
  sandbox.window = sandbox; // comme dans un navigateur : window === objet global
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return JSON.parse(JSON.stringify(sandbox.FANNI));
}

/* premier démarrage : remplit la base avec le catalogue actuel */
export async function seed(store, root) {
  if (await store.getSetting("seeded")) return false;
  const F = readDefaults(root);
  await store.setSetting("config", F.config);
  for (const k of META_KEYS) await store.setSetting(k, F[k]);
  for (const [i, p] of F.products.entries()) await store.put("products", p.id, { ...p, published: true }, i);
  for (const [col, key] of Object.entries(BUILDER_COLS))
    for (const [i, it] of F.builder[key].entries()) await store.put(col, it.id, it, i);
  for (const [i, r] of F.reviews.entries()) await store.put("reviews", "avis-" + (i + 1), r, i);
  await store.setSetting("seeded", new Date().toISOString());
  return true;
}

const strip = o => { const { _position, _created, _updated, ...rest } = o; return rest; };

/* contenu public (sans brouillons ni champs internes) */
export async function publicCatalog(store) {
  const config = await store.getSetting("config", {});
  const out = { config };
  for (const k of META_KEYS) out[k] = await store.getSetting(k, []);
  out.products = (await store.list("products")).filter(p => p.published !== false).map(p => { const { published, ...rest } = strip(p); return rest; });
  out.builder = {};
  for (const [col, key] of Object.entries(BUILDER_COLS)) out.builder[key] = (await store.list(col)).filter(x => x.active !== false).map(strip);
  out.reviews = (await store.list("reviews")).filter(r => r.published !== false).map(r => { const { id, published, ...rest } = strip(r); return rest; });
  return out;
}

export function catalogScript(cat) {
  const j = v => JSON.stringify(v).replace(/</g, "\\u003c");
  return `/* Fanni's Store — catalogue généré par le serveur (géré depuis /admin) */
window.FANNI = window.FANNI || {};
FANNI.config = ${j(cat.config)};
FANNI.occasions = ${j(cat.occasions)};
FANNI.recipients = ${j(cat.recipients)};
FANNI.ribbons = ${j(cat.ribbons)};
FANNI.cardStyles = ${j(cat.cardStyles)};
FANNI.products = ${j(cat.products)};
FANNI.builder = ${j(cat.builder)};
FANNI.reviews = ${j(cat.reviews)};
`;
}

export function sitemapXml(cat, base) {
  const day = new Date().toISOString().slice(0, 10);
  const urls = [["", 1.0, "weekly"], ["boutique.html", 0.9, "weekly"], ["creer-ma-box.html", 0.9, "monthly"], ["a-propos.html", 0.6, "yearly"], ["contact.html", 0.6, "yearly"], ["faq.html", 0.6, "monthly"], ["mentions-legales.html", 0.2, "yearly"]]
    .concat(cat.products.filter(p => !p.custom).map(p => [`produit.html?id=${encodeURIComponent(p.id)}`, 0.8, "monthly"]));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, pr, f]) => `  <url><loc>${base}/${u.replace(/&/g, "&amp;")}</loc><lastmod>${day}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join("\n")}\n</urlset>\n`;
}

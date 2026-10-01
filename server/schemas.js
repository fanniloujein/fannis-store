/* ==========================================================================
   Schémas : validation côté serveur + description des formulaires de l'admin
   ========================================================================== */
const HEX = /^#[0-9a-fA-F]{6}$/;
const str = (v, max = 200) => String(v ?? "").replace(/\u0000/g, "").trim().slice(0, max);
const num = (v, min = 0, max = 1e6) => { const n = Number(String(v ?? "").replace(",", ".")); return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n * 100) / 100)) : 0; };
const bool = v => v === true || v === "true" || v === 1 || v === "1" || v === "on";
const bi = (o, max) => ({ fr: str(o?.fr, max), ar: str(o?.ar, max) });
const strList = (a, max, n) => (Array.isArray(a) ? a : []).map(x => str(x, max)).filter(Boolean).slice(0, n);
const slug = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
export { slug };

export class ValidationError extends Error { }
const need = (cond, msg) => { if (!cond) throw new ValidationError(msg); };

/* ---------- Produit ---------- */
export const ART_MODELS = ["box", "round", "open"];
export const ART_DECOS = ["heart", "rose", "rings", "flower", "thanks", "cake", "baby", "star", "sparkle"];
export const BADGES = ["", "best", "new", "promo"];

export function cleanProduct(p, { occasions = [], recipients = [] } = {}) {
  const occIds = occasions.map(o => o.id), recIds = recipients.map(r => r.id);
  const out = {
    name: bi(p.name, 120),
    short: bi(p.short, 240),
    desc: bi(p.desc, 4000),
    includes: { fr: strList(p.includes?.fr, 160, 20), ar: strList(p.includes?.ar, 160, 20) },
    price: num(p.price, 0, 100000),
    occasion: (Array.isArray(p.occasion) ? p.occasion : []).filter(x => occIds.includes(x)),
    recipient: (Array.isArray(p.recipient) ? p.recipient : []).filter(x => recIds.includes(x)),
    badge: BADGES.includes(p.badge) ? p.badge : "",
    bestseller: bool(p.bestseller),
    priceFrom: bool(p.priceFrom),
    custom: bool(p.custom),
    published: p.published === undefined ? true : bool(p.published),
    rating: num(p.rating ?? 5, 0, 5),
    reviews: Math.round(num(p.reviews ?? 0, 0, 100000)),
    images: (Array.isArray(p.images) ? p.images : []).map(String).filter(u => /^\/media\/[\w-]{6,40}$/.test(u) || /^assets\/img\/[\w./-]+\.(jpe?g|png|webp|avif)$/i.test(u)).slice(0, 12),
    art: {
      v: ART_MODELS.includes(p.art?.v) ? p.art.v : "box",
      b: HEX.test(p.art?.b) ? p.art.b : "#f47920",
      l: HEX.test(p.art?.l) ? p.art.l : "#ff8a3d",
      r: HEX.test(p.art?.r) ? p.art.r : "#ffc933",
      bg: HEX.test(p.art?.bg) ? p.art.bg : "#fff1dc",
      deco: ART_DECOS.includes(p.art?.deco) ? p.art.deco : "heart"
    },
    stock: p.stock === "" || p.stock == null ? null : Math.round(num(p.stock, 0, 100000))
  };
  const old = num(p.oldPrice, 0, 100000);
  if (old > out.price) out.oldPrice = old;
  need(out.name.fr, "Le nom du produit (français) est obligatoire.");
  need(out.price > 0 || out.custom, "Le prix doit être supérieur à 0.");
  need(out.occasion.length, "Choisissez au moins une occasion.");
  if (!out.recipient.length) out.recipient = recIds.slice();
  return out;
}

/* ---------- Collections simples (configurateur, avis…) ---------- */
export const SIMPLE = {
  builder_boxes: {
    title: "Tailles de box", singular: "box", idFrom: "fr",
    fields: [
      { key: "fr", label: "Nom (FR)", type: "text", required: true, max: 60 },
      { key: "ar", label: "Nom (AR)", type: "text", max: 60, dir: "rtl" },
      { key: "price", label: "Prix", type: "money", required: true },
      { key: "capacity", label: "Nombre d'articles max.", type: "int", min: 1, max: 30, required: true },
      { key: "descFr", label: "Description (FR)", type: "text", max: 140 },
      { key: "descAr", label: "Description (AR)", type: "text", max: 140, dir: "rtl" },
      { key: "scale", label: "Taille dans l'aperçu (0,6 à 1)", type: "number", min: 0.6, max: 1, step: 0.02, def: 0.9 },
      { key: "active", label: "Proposée aux clients", type: "bool", def: true }
    ],
    columns: ["fr", "price", "capacity", "active"]
  },
  builder_categories: {
    title: "Catégories d'articles", singular: "catégorie", idFrom: "fr",
    fields: [
      { key: "fr", label: "Nom (FR)", type: "text", required: true, max: 40 },
      { key: "ar", label: "Nom (AR)", type: "text", max: 40, dir: "rtl" },
      { key: "active", label: "Visible", type: "bool", def: true }
    ],
    columns: ["fr", "ar", "active"]
  },
  builder_items: {
    title: "Articles", singular: "article", idFrom: "fr",
    fields: [
      { key: "emoji", label: "Émoji", type: "text", max: 8, required: true, def: "🎁" },
      { key: "fr", label: "Nom (FR)", type: "text", required: true, max: 60 },
      { key: "ar", label: "Nom (AR)", type: "text", max: 60, dir: "rtl" },
      { key: "cat", label: "Catégorie", type: "ref", ref: "builder_categories", required: true },
      { key: "price", label: "Prix", type: "money", required: true },
      { key: "color", label: "Couleur dans l'aperçu", type: "color", def: "#ffe3cc" },
      { key: "personal", label: "Personnalisable (gravure, broderie…)", type: "bool" },
      { key: "active", label: "Proposé aux clients", type: "bool", def: true }
    ],
    columns: ["emoji", "fr", "cat", "price", "personal", "active"]
  },
  builder_wrappings: {
    title: "Emballages", singular: "emballage", idFrom: "fr",
    fields: [
      { key: "fr", label: "Nom (FR)", type: "text", required: true, max: 60 },
      { key: "ar", label: "Nom (AR)", type: "text", max: 60, dir: "rtl" },
      { key: "price", label: "Supplément", type: "money" },
      { key: "box", label: "Couleur de la boîte", type: "color", def: "#f47920" },
      { key: "lid", label: "Couleur du couvercle", type: "color", def: "#ff8a3d" },
      { key: "descFr", label: "Description (FR)", type: "text", max: 80 },
      { key: "descAr", label: "Description (AR)", type: "text", max: 80, dir: "rtl" },
      { key: "active", label: "Proposé aux clients", type: "bool", def: true }
    ],
    columns: ["fr", "box", "price", "active"]
  },
  builder_extras: {
    title: "Finitions", singular: "finition", idFrom: "fr",
    fields: [
      { key: "fr", label: "Nom (FR)", type: "text", required: true, max: 80 },
      { key: "ar", label: "Nom (AR)", type: "text", max: 80, dir: "rtl" },
      { key: "price", label: "Supplément", type: "money" },
      { key: "active", label: "Proposée aux clients", type: "bool", def: true }
    ],
    columns: ["fr", "price", "active"]
  },
  reviews: {
    title: "Avis clients", singular: "avis", idFrom: "name",
    fields: [
      { key: "name", label: "Prénom et initiale", type: "text", required: true, max: 40 },
      { key: "city", label: "Ville", type: "text", max: 40 },
      { key: "rating", label: "Note (sur 5)", type: "int", min: 1, max: 5, def: 5 },
      { key: "product", label: "Produit concerné", type: "ref", ref: "products" },
      { key: "fr", label: "Avis (FR)", type: "textarea", required: true, max: 600 },
      { key: "ar", label: "Avis (AR)", type: "textarea", max: 600, dir: "rtl" },
      { key: "published", label: "Affiché sur le site", type: "bool", def: true }
    ],
    columns: ["name", "city", "rating", "product", "published"]
  }
};

export function cleanSimple(col, d) {
  const sch = SIMPLE[col]; const out = {};
  for (const f of sch.fields) {
    const v = d[f.key];
    if (f.type === "bool") out[f.key] = v === undefined ? f.def ?? false : bool(v);
    else if (f.type === "money") out[f.key] = num(v ?? 0, 0, 100000);
    else if (f.type === "int") out[f.key] = Math.round(num(v ?? f.def ?? 0, f.min ?? 0, f.max ?? 1e6));
    else if (f.type === "number") out[f.key] = num(v ?? f.def ?? 0, f.min ?? 0, f.max ?? 1e6);
    else if (f.type === "color") out[f.key] = HEX.test(v) ? v : f.def || "#ffffff";
    else out[f.key] = str(v ?? f.def ?? "", f.max || (f.type === "textarea" ? 2000 : 200));
    if (f.required && f.type !== "bool") need(out[f.key] !== "" && !(f.type === "money" && out[f.key] < 0), `Le champ « ${f.label} » est obligatoire.`);
  }
  return out;
}

/* ---------- Réglages ---------- */
export function cleanConfig(c, prev = {}) {
  const out = {
    storeName: str(c.storeName ?? prev.storeName ?? "Fanni's Store", 60),
    whatsapp: str(c.whatsapp ?? prev.whatsapp, 20).replace(/\D/g, ""),
    email: str(c.email ?? prev.email, 120),
    instagram: str(c.instagram ?? prev.instagram, 200),
    instagramHandle: str(c.instagramHandle ?? prev.instagramHandle, 60),
    facebook: str(c.facebook ?? prev.facebook, 200),
    tiktok: str(c.tiktok ?? prev.tiktok, 200),
    currency: str(c.currency ?? prev.currency ?? "DT", 8),
    shippingFee: num(c.shippingFee ?? prev.shippingFee, 0, 10000),
    freeShippingFrom: num(c.freeShippingFrom ?? prev.freeShippingFrom, 0, 100000),
    onlinePaymentUrl: str(c.onlinePaymentUrl ?? prev.onlinePaymentUrl, 300),
    giftCardPrice: num(c.giftCardPrice ?? prev.giftCardPrice, 0, 10000),
    photoOptionPrice: num(c.photoOptionPrice ?? prev.photoOptionPrice, 0, 10000)
  };
  need(out.whatsapp.length >= 8, "Le numéro WhatsApp doit contenir au moins 8 chiffres (avec l'indicatif, ex. 216…).");
  for (const k of ["instagram", "facebook", "tiktok", "onlinePaymentUrl"]) need(!out[k] || /^https:\/\//.test(out[k]), `Le lien « ${k} » doit commencer par https://`);
  return out;
}

export function cleanList(key, arr) {
  need(Array.isArray(arr) && arr.length, "La liste ne peut pas être vide.");
  return arr.slice(0, 40).map(x => {
    const o = { id: slug(x.id || x.fr) || "x", fr: str(x.fr, 60), ar: str(x.ar, 60) };
    need(o.fr, "Chaque élément doit avoir un nom en français.");
    if (key === "ribbons") o.color = HEX.test(x.color) ? x.color : "#f47920";
    if (key === "cardStyles") o.price = num(x.price, 0, 10000);
    if (key === "occasions") o.icon = ["cake", "heart", "rings", "baby", "flower", "thanks", "sparkle", "gift", "star"].includes(x.icon) ? x.icon : "gift";
    return o;
  });
}

/* ---------- Commandes, messages, newsletter (public) ---------- */
export const ORDER_STATUSES = ["nouvelle", "confirmee", "preparation", "expediee", "livree", "annulee"];

export function cleanOrder(o) {
  const items = (Array.isArray(o.items) ? o.items : []).slice(0, 50).map(it => ({
    id: str(it.id, 80),
    name: str(typeof it.name === "object" ? it.name?.fr || it.name?.ar : it.name, 140),
    price: num(it.price, 0, 100000),
    qty: Math.max(1, Math.min(99, Math.round(num(it.qty, 1, 99)))),
    options: Object.fromEntries(Object.entries(it.options && typeof it.options === "object" ? it.options : {}).slice(0, 15).map(([k, v]) => [str(k, 30), str(v, 400)]))
  }));
  need(items.length, "Le panier est vide.");
  const c = o.customer || {};
  const customer = { name: str(c.name, 100), phone: str(c.phone, 30), email: str(c.email, 120), address: str(c.address, 250), city: str(c.city, 80), date: str(c.date, 20), note: str(c.note, 1000), gift: bool(c.gift) };
  need(customer.name && customer.phone && customer.address && customer.city, "Coordonnées de livraison incomplètes.");
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return {
    orderNo: str(o.orderNo, 30).replace(/[^\w-]/g, ""),
    items, customer,
    pay: o.pay === "online" ? "online" : "cod",
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: num(o.shipping, 0, 10000),
    total: Math.round((subtotal + num(o.shipping, 0, 10000)) * 100) / 100,
    lang: o.lang === "ar" ? "ar" : "fr",
    status: "nouvelle", note: "", history: [{ status: "nouvelle", at: new Date().toISOString() }]
  };
}

export function cleanMessage(m) {
  const out = { name: str(m.name, 100), email: str(m.email, 120), phone: str(m.phone, 30), subject: str(m.subject, 120), message: str(m.message, 3000), via: m.via === "email" ? "email" : "whatsapp", read: false };
  need(out.name && out.message, "Nom et message obligatoires.");
  return out;
}

export function cleanEmail(e) {
  const email = str(e, 160).toLowerCase();
  need(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email), "Adresse email invalide.");
  return email;
}

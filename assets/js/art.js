/* ==========================================================================
   Fanni's Store — illustrations SVG (box cadeaux, rubans, étincelles) & icônes
   Utilisées tant que vous n'avez pas ajouté vos propres photos.
   ========================================================================== */
(function () {
  const F = (window.FANNI = window.FANNI || {});

  /* petit générateur pseudo-aléatoire reproductible */
  function rng(seed) {
    let h = 2166136261;
    for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  const star = (cx, cy, r, fill, op = 1) => {
    const k = r * 0.22;
    return `<path fill="${fill}" opacity="${op}" d="M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z"/>`;
  };

  /* nœud de ruban centré en (x, y) */
  function bow(x, y, c, s = 1) {
    const d = shade(c, -28), l = shade(c, 22);
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path fill="${d}" d="M-4 4 L-30 58 L-17 53 L-10 68 L6 8Z"/>
      <path fill="${d}" d="M4 4 L30 58 L17 53 L10 68 L-6 8Z"/>
      <path fill="${c}" d="M0 0C-26 -44 -80 -40 -66 -6C-58 14 -20 10 0 0Z"/>
      <path fill="${c}" d="M0 0C26 -44 80 -40 66 -6C58 14 20 10 0 0Z"/>
      <path fill="${d}" opacity=".45" d="M0 0C-20 -22 -44 -24 -50 -10C-36 -12 -18 -6 0 0Z"/>
      <path fill="${d}" opacity=".45" d="M0 0C20 -22 44 -24 50 -10C36 -12 18 -6 0 0Z"/>
      <path fill="${l}" opacity=".7" d="M-12 -18C-30 -30 -52 -30 -56 -16C-44 -26 -28 -24 -12 -18Z"/>
      <rect x="-11" y="-11" width="22" height="20" rx="8" fill="${c}"/>
      <rect x="-11" y="-11" width="22" height="7" rx="4" fill="${l}" opacity=".6"/>
    </g>`;
  }

  /* emblèmes décoratifs (dessinés autour de 0,0, ~30px) */
  function emblem(kind, c) {
    switch (kind) {
      case "heart": return `<path fill="${c}" d="M0 12C-22 -4 -12 -22 0 -10C12 -22 22 -4 0 12Z"/>`;
      case "rose": return `<circle r="13" fill="${c}"/><path d="M-6 -2c3-6 12-5 11 2s-10 8-13 2 3-11 9-11" fill="none" stroke="${shade(c, -40)}" stroke-width="1.6" stroke-linecap="round"/><path fill="#6f9a7e" d="M-4 12c-8 0-12 6-12 6s8 2 12-6zM4 12c8 0 12 6 12 6s-8 2-12-6z"/>`;
      case "rings": return `<circle cx="-7" r="10" fill="none" stroke="${c}" stroke-width="3"/><circle cx="7" r="10" fill="none" stroke="${c}" stroke-width="3"/>${star(-7, -14, 4, c)}`;
      case "flower": return [0, 72, 144, 216, 288].map(a => `<ellipse rx="6" ry="10" transform="rotate(${a}) translate(0 -9)" fill="${c}"/>`).join("") + `<circle r="5" fill="#ffd766"/>`;
      case "thanks": return `<text y="7" text-anchor="middle" font-family="Mansalva, cursive" font-size="22" fill="${c}">merci</text>`;
      case "cake": return `<rect x="-14" y="-2" width="28" height="14" rx="3" fill="${c}"/><rect x="-14" y="-2" width="28" height="4" fill="#fff" opacity=".6"/><rect x="-1.5" y="-14" width="3" height="11" fill="${shade(c, -30)}"/><path d="M0 -22c3 3 3 6 0 7c-3-1-3-4 0-7z" fill="#f47920"/>`;
      case "baby": return `<path fill="${c}" d="M6 -14A14 14 0 1 0 6 14A11 11 0 1 1 6 -14Z"/>${star(10, -6, 5, c)}`;
      case "star":
      case "sparkle":
      default: return star(0, 0, 14, c) + star(14, -12, 5, c) + star(-13, 11, 4, c);
    }
  }

  /* ---------- modèles de box (repère 400 × 500) ---------- */
  function boxSquare(a) {
    const b = a.b, l = a.l || shade(b, 12), r = a.r;
    return `
      <ellipse cx="200" cy="396" rx="138" ry="13" fill="#2f2544" opacity=".10"/>
      <rect x="95" y="238" width="210" height="156" rx="4" fill="${b}"/>
      <rect x="235" y="238" width="70" height="156" fill="#000" opacity=".045"/>
      <rect x="95" y="238" width="210" height="14" fill="#000" opacity=".07"/>
      <rect x="188" y="238" width="24" height="156" fill="${r}"/>
      <rect x="200" y="238" width="12" height="156" fill="#000" opacity=".08"/>
      <rect x="82" y="200" width="236" height="46" rx="5" fill="${l}"/>
      <rect x="82" y="200" width="236" height="10" rx="5" fill="#fff" opacity=".35"/>
      <rect x="246" y="200" width="72" height="46" fill="#000" opacity=".04"/>
      <rect x="188" y="200" width="24" height="46" fill="${r}"/>
      <rect x="188" y="200" width="24" height="8" fill="#fff" opacity=".25"/>
      ${bow(200, 200, r)}
      ${tag(a)}`;
  }

  function boxRound(a) {
    const b = a.b, l = a.l || shade(b, 12), r = a.r;
    return `
      <ellipse cx="200" cy="404" rx="128" ry="14" fill="#2f2544" opacity=".10"/>
      <ellipse cx="200" cy="388" rx="96" ry="22" fill="${shade(b, -14)}"/>
      <rect x="104" y="250" width="192" height="138" fill="${b}"/>
      <path d="M250 250h46v138a96 22 0 0 1-46 19z" fill="#000" opacity=".05"/>
      <rect x="190" y="262" width="20" height="148" fill="${r}"/>
      <rect x="200" y="262" width="10" height="148" fill="#000" opacity=".08"/>
      <ellipse cx="200" cy="254" rx="108" ry="22" fill="${shade(l, -10)}"/>
      <rect x="92" y="222" width="216" height="32" fill="${l}"/>
      <rect x="190" y="232" width="20" height="44" fill="${r}"/>
      <ellipse cx="200" cy="222" rx="108" ry="22" fill="${shade(l, 10)}"/>
      <ellipse cx="200" cy="222" rx="108" ry="22" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
      <rect x="190" y="222" width="20" height="22" fill="${r}"/>
      ${bow(200, 222, r, 0.95)}
      ${tag(a, 20)}`;
  }

  function boxOpen(a, seed) {
    const b = a.b, l = a.l || shade(b, 12), r = a.r, rnd = rng(seed + "open");
    const tissue = ["#fff", "#eaf7ef", "#d6f0e1"];
    const t = [];
    for (let i = 0; i < 7; i++) {
      const x = 100 + i * 32 + rnd() * 10, h = 40 + rnd() * 34;
      t.push(`<path d="M${x - 26} 262 L${x + 4} ${262 - h} L${x + 34} 262Z" fill="${tissue[i % 3]}" opacity=".95"/>`);
    }
    return `
      <ellipse cx="200" cy="398" rx="150" ry="13" fill="#2f2544" opacity=".10"/>
      <path d="M232 250 L318 142 L352 162 L278 262Z" fill="${l}"/>
      <path d="M318 142 L352 162 L346 170 L313 150Z" fill="#fff" opacity=".35"/>
      <rect x="92" y="244" width="216" height="24" fill="${shade(b, -26)}"/>
      ${t.join("")}
      <!-- bougie -->
      <rect x="126" y="178" width="44" height="80" rx="6" fill="#f7f1e7"/>
      <rect x="126" y="196" width="44" height="26" fill="${a.r}" opacity=".55"/>
      <rect x="146" y="166" width="3" height="14" fill="#4a3f5c"/>
      <path d="M147.5 146c7 8 7 16 0 20c-7-4-7-12 0-20z" fill="#f2b04e"/>
      <path d="M147.5 154c3 4 3 8 0 10c-3-2-3-6 0-10z" fill="#fff5d6"/>
      <!-- roses -->
      <circle cx="222" cy="206" r="20" fill="#ffb347"/><circle cx="252" cy="222" r="17" fill="#f47920"/><circle cx="200" cy="228" r="15" fill="#ffd766"/>
      <path d="M214 204c4-8 16-6 14 3s-14 9-16 2 4-13 11-12" fill="none" stroke="#c9560a" stroke-width="1.8"/>
      <path d="M246 220c3-6 12-4 10 3s-10 6-12 1 3-9 8-9" fill="none" stroke="#b34d08" stroke-width="1.6"/>
      <!-- carte -->
      <g transform="rotate(8 270 220)"><rect x="252" y="176" width="54" height="72" rx="3" fill="#fffaf2"/>
      <text x="279" y="210" text-anchor="middle" font-family="Mansalva, cursive" font-size="15" fill="#3e9b78">pour</text>
      <text x="279" y="228" text-anchor="middle" font-family="Mansalva, cursive" font-size="15" fill="#3e9b78">toi</text></g>
      <rect x="92" y="262" width="216" height="134" rx="3" fill="${b}"/>
      <rect x="240" y="262" width="68" height="134" fill="#000" opacity=".045"/>
      <rect x="92" y="262" width="216" height="8" fill="#fff" opacity=".35"/>
      <rect x="92" y="318" width="216" height="20" fill="${r}"/>
      <rect x="92" y="330" width="216" height="8" fill="#000" opacity=".07"/>
      ${bow(200, 326, r, 0.8)}
      <g transform="translate(142 372)">${emblem(a.deco, "rgba(255,255,255,.75)")}</g>`;
  }

  function tag(a, dy = 0) {
    return `<path d="M214 ${214 + dy} C236 ${226 + dy} 250 ${240 + dy} 262 ${268 + dy}" fill="none" stroke="#f2a900" stroke-width="1.4"/>
      <g transform="translate(262 ${268 + dy}) rotate(10)">
        <path d="M-22 0 L-12 -12 L12 -12 L22 0 L22 62 L-22 62Z" fill="#fffaf2"/>
        <path d="M-22 0 L-12 -12 L12 -12 L22 0 L22 62 L-22 62Z" fill="none" stroke="#ffd766" stroke-width="1.2"/>
        <circle cx="0" cy="-3" r="3" fill="none" stroke="#f2a900" stroke-width="1.2"/>
        <g transform="translate(0 30) scale(.85)">${emblem(a.deco, a.deco === "thanks" ? "#3e9b78" : "#f47920")}</g>
      </g>`;
  }

  function backdrop(a, seed, W = 400, H = 500) {
    const rnd = rng(seed + "bg"), bg = a.bg || "#eaf7ef";
    const petals = [];
    for (let i = 0; i < 5; i++) {
      const x = 40 + rnd() * (W - 80), y = H * 0.84 + rnd() * H * 0.12;
      petals.push(`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="7" ry="4" transform="rotate(${(rnd() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" fill="${i % 2 ? "#ffc933" : "#ffe3cc"}"/>`);
    }
    return `
      <rect width="${W}" height="${H}" fill="${bg}"/>
      <circle cx="${W * 0.5}" cy="${H * 0.46}" r="${W * 0.42}" fill="#fff" opacity=".45"/>
      <rect y="${H * 0.79}" width="${W}" height="${H * 0.21}" fill="${shade(bg, -10)}"/>
      <path d="M0 ${H * 0.79} C${W * 0.3} ${H * 0.77} ${W * 0.7} ${H * 0.81} ${W} ${H * 0.79}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
      <path d="M-10 ${H * 0.9} C${W * 0.2} ${H * 0.84} ${W * 0.35} ${H * 0.98} ${W * 0.6} ${H * 0.92} S${W * 0.9} ${H * 0.86} ${W + 10} ${H * 0.95}" fill="none" stroke="${a.r || "#ffc933"}" stroke-width="7" stroke-linecap="round" opacity=".55"/>
      ${petals.join("")}`;
  }

  function sparkles(seed, n = 6, W = 400, H = 500, color = "#f2a900") {
    const rnd = rng(seed + "sp"), out = [];
    for (let i = 0; i < n; i++) {
      const x = 30 + rnd() * (W - 60), y = 30 + rnd() * H * 0.36, r = 4 + rnd() * 9;
      out.push(star(+x.toFixed(1), +y.toFixed(1), +r.toFixed(1), i === 0 ? "#f47920" : color, 0.55 + rnd() * 0.45));
    }
    return out.join("");
  }

  function objectFor(a, seed) {
    if (a.v === "round") return boxRound(a);
    if (a.v === "open") return boxOpen(a, seed);
    return boxSquare(a);
  }

  /* illustration complète d'un produit / d'une vue */
  F.art = {};
  F.art.gift = function (a, opts = {}) {
    const seed = opts.seed || JSON.stringify(a);
    const view = opts.view || 0; // vues alternatives pour la galerie
    const W = 400, H = 500;
    let obj = objectFor(a, seed);
    let tf = "";
    if (view === 1) tf = "translate(-120 -150) scale(1.6)";            // gros plan sur le nœud
    if (view === 2) obj = objectFor({ ...a, v: a.v === "open" ? "box" : "open" }, seed + "v2");
    if (view === 3) obj = `<g transform="translate(-40 40) scale(.8)">${objectFor(a, seed)}</g><g transform="translate(170 160) scale(.55)">${objectFor({ ...a, v: a.v === "round" ? "box" : "round" }, seed + "b")}</g>`;
    return `<svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${(opts.label || "Box cadeau Fanni's Store").replace(/"/g, "&quot;")}">
      ${backdrop(a, seed, W, H)}
      <g transform="${tf}">${obj}</g>
      ${sparkles(seed + view, view === 1 ? 4 : 6, W, H)}
    </svg>`;
  };

  /* image produit : vraie photo si fournie, sinon illustration */
  F.art.product = function (p, i = 0, lang = "fr") {
    const label = p.name[lang] || p.name.fr;
    if (p.images && p.images[i]) return `<img src="${p.images[i]}" alt="${label}" loading="lazy" decoding="async">`;
    return F.art.gift(p.art, { seed: p.id, view: i, label });
  };

  /* scène d'accueil (plusieurs box) */
  F.art.hero = function () {
    const W = 460, H = 530, seed = "hero";
    const bg = { bg: "#eaf7ef", r: "#ffc933" };
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Box cadeaux emballées avec des rubans de soie">
      ${backdrop(bg, seed, W, H)}
      <circle cx="120" cy="120" r="70" fill="#ffe3cc" opacity=".8"/>
      <g transform="translate(80 -40) scale(1)">${boxSquare({ b: "#3e9b78", l: "#4da37d", r: "#ffc933", deco: "rings" })}</g>
      <g transform="translate(-40 170) scale(.72)">${boxRound({ b: "#f47920", l: "#ff8a3d", r: "#fff6ec", deco: "heart" })}</g>
      <g transform="translate(245 250) scale(.52)">${boxSquare({ b: "#ffc933", l: "#ffd766", r: "#f47920", deco: "star" })}</g>
      ${sparkles(seed, 9, W, H)}
    </svg>`;
  };

  /* aperçu du configurateur */
  F.art.builder = function (s) {
    const W = 460, H = 400;
    const wrap = s.wrap || { box: "#ffe3cc", lid: "#fff0e3" };
    const r = s.ribbon || "#ffc933";
    const sc = s.scale || 1;
    const items = s.items || [];
    const cx = W / 2, bw = 250 * sc, bh = 130 * sc, bx = cx - bw / 2, by = 330 - bh;
    // articles disposés en rangées derrière la face avant
    const perRow = Math.max(3, Math.ceil(items.length / 2));
    const slots = items.map((it, i) => {
      const row = i < perRow ? 0 : 1, idx = row ? i - perRow : i, count = row ? items.length - perRow : Math.min(items.length, perRow);
      const x = bx + 26 + (bw - 52) * ((idx + 0.5) / count);
      const y = by + 6 - (row ? 26 : 52) * sc;
      return `<g class="pv-item" style="animation-delay:${i * 40}ms">
        <circle cx="${x}" cy="${y}" r="${24 * sc}" fill="${it.color || "#fff"}" stroke="#fff" stroke-width="2"/>
        <text x="${x}" y="${y + 9 * sc}" text-anchor="middle" font-size="${26 * sc}">${it.emoji}</text></g>`;
    });
    const hasFlower = s.extras && s.extras.includes("fleurs-sechees");
    const hasSeal = s.extras && s.extras.includes("sceau");
    const msg = (s.message || "").trim();
    const cardLines = msg ? wrapText(msg, 18).slice(0, 3) : [];
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Aperçu de votre box">
      <style>.pv-item{animation:pvIn .5s cubic-bezier(.34,1.56,.64,1) both}@keyframes pvIn{from{opacity:0;transform:translateY(-16px)}}</style>
      <rect width="${W}" height="${H}" fill="transparent"/>
      <circle cx="${cx}" cy="180" r="160" fill="#fff" opacity=".45"/>
      ${sparkles("builder" + items.length, 6, W, H * 0.9)}
      <ellipse cx="${cx}" cy="${336}" rx="${bw * 0.62}" ry="12" fill="#2f2544" opacity=".1"/>
      <path d="M${bx + bw - 30} ${by + 4} L${bx + bw + 30} ${by - 90 * sc} L${bx + bw + 62} ${by - 70 * sc} L${bx + bw + 20} ${by + 14}Z" fill="${wrap.lid}"/>
      <rect x="${bx}" y="${by - 12}" width="${bw}" height="16" fill="${shade(wrap.box, -26)}"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${bx + i * bw / 6 - 10} ${by} L${bx + i * bw / 6 + 20} ${by - 30 - (i % 3) * 8} L${bx + i * bw / 6 + 50} ${by}Z" fill="${i % 2 ? "#eaf7ef" : "#fff"}"/>`).join("")}
      ${slots.join("")}
      <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3" fill="${wrap.box}"/>
      <rect x="${bx + bw * 0.68}" y="${by}" width="${bw * 0.32}" height="${bh}" fill="#000" opacity=".045"/>
      <rect x="${bx}" y="${by}" width="${bw}" height="7" fill="#fff" opacity=".35"/>
      <rect x="${bx}" y="${by + bh * 0.42}" width="${bw}" height="${16 * sc}" fill="${r}"/>
      ${bow(cx, by + bh * 0.42 + 8 * sc, r, 0.62 * sc)}
      ${hasFlower ? `<g transform="translate(${cx - 34 * sc} ${by + bh * 0.42 - 6})">${[0, 1, 2].map(i => `<circle cx="${i * 9}" cy="${-i * 7}" r="6" fill="${["#ffd766", "#ffc933", "#f3ead9"][i]}"/><path d="M${i * 9} ${-i * 7} l-14 16" stroke="#9aa77f" stroke-width="1.5"/>`).join("")}</g>` : ""}
      ${hasSeal ? `<circle cx="${cx + bw * 0.3}" cy="${by + bh * 0.72}" r="${13 * sc}" fill="#f2a900"/><circle cx="${cx + bw * 0.3}" cy="${by + bh * 0.72}" r="${9 * sc}" fill="none" stroke="#ffd766" stroke-width="1.5"/><text x="${cx + bw * 0.3}" y="${by + bh * 0.72 + 5}" text-anchor="middle" font-family="Mansalva,cursive" font-size="${14 * sc}" fill="#fff8e8">F</text>` : ""}
      ${s.card && s.card !== "none" ? `<g transform="rotate(-7 ${bx - 10} ${by + bh - 40})">
        <rect x="${bx - 44}" y="${by + bh - 98}" width="96" height="72" rx="4" fill="${s.card === "doree" ? "#fbf3e1" : "#fffaf2"}" stroke="${s.card === "doree" ? "#f2a900" : "#ece3d3"}" stroke-width="${s.card === "doree" ? 2 : 1}"/>
        ${cardLines.length ? cardLines.map((ln, i) => `<text x="${bx + 4}" y="${by + bh - 74 + i * 17}" text-anchor="middle" font-family="Mansalva,cursive" font-size="13" fill="#3e9b78">${esc(ln)}</text>`).join("") : `<text x="${bx + 4}" y="${by + bh - 56}" text-anchor="middle" font-family="Mansalva,cursive" font-size="15" fill="#f47920">♡</text>`}
      </g>` : ""}
    </svg>`;
  };

  function wrapText(t, n) {
    const words = t.replace(/\s+/g, " ").split(" "), lines = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > n) { if (cur) lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
    }
    if (cur) lines.push(cur);
    return lines.map((l, i, a) => (i === 2 && a.length > 3 ? l.slice(0, n - 1) + "…" : l));
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  F.esc = esc;

  /* ---------- icônes (trait fin) ---------- */
  const I = (p, vb = "0 0 24 24") => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  F.icons = {
    bag: I('<path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
    menu: I('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    close: I('<path d="M6 6l12 12M18 6L6 18"/>'),
    heart: I('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>'),
    gift: I('<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5C10.5 5 7 4.5 7 6.5S10 8.5 12 8.5zM12 8.5c1.5-3.5 5-4 5-2s-3 2-5 2z"/>'),
    sparkle: I('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z"/>'),
    pen: I('<path d="M4 20l4-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5 16l-1 4z"/><path d="M14 7l3 3"/>'),
    truck: I('<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>'),
    hand: I('<path d="M12 20s-7-4.2-7-9.2A3.8 3.8 0 0 1 12 8.6a3.8 3.8 0 0 1 7 2.2C19 15.8 12 20 12 20z"/><path d="M12 3v2M7 4.5l1 1.5M17 4.5l-1 1.5"/>'),
    star: I('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z"/>'),
    arrowL: I('<path d="M15 5l-7 7 7 7"/>'),
    arrowR: I('<path d="M9 5l7 7-7 7"/>'),
    arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    upload: I('<path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>'),
    lock: I('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
    filter: I('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    pin: I('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
    shield: I('<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5V6L12 3z"/><path d="M9 12l2 2 4-4"/>'),
    mail: I('<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>'),
    phone: I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>'),
    leaf: I('<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l7-7"/>'),
    diamond: I('<path d="M6 4h12l3 5-9 11L3 9l3-5z"/><path d="M3 9h18M12 20L9 9l3-5 3 5-3 11"/>'),
    // catégories
    cake: I('<path d="M4 20h16M5 20v-6.5a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5V20"/><path d="M5 15.5c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0M8 12V9.5M12 12V9.5M16 12V9.5"/><path d="M8 6.5c.8.8.8 1.8 0 2.3-.8-.5-.8-1.5 0-2.3zM12 6.5c.8.8.8 1.8 0 2.3-.8-.5-.8-1.5 0-2.3zM16 6.5c.8.8.8 1.8 0 2.3-.8-.5-.8-1.5 0-2.3z"/>'),
    rings: I('<circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="M7.5 5.5L9 3.5l1.5 2L9 7.5z"/>'),
    baby: I('<path d="M9 21v-2.5a3 3 0 0 1 6 0V21"/><circle cx="12" cy="9.5" r="5"/><path d="M10 9.2h.01M14 9.2h.01M10.5 11.8c.9.6 2.1.6 3 0M12 4.5c0-1.2.9-2 2-2"/>'),
    flower: I('<circle cx="12" cy="9" r="2.2"/><path d="M12 6.8c-1.3-2.5-4.4-1.8-3.8.6.3 1.1 1.5 1.6 1.6 1.6M14.2 9c2.5-1.3 1.8-4.4-.6-3.8-1.1.3-1.6 1.5-1.6 1.6M12 11.2c1.3 2.5 4.4 1.8 3.8-.6-.3-1.1-1.5-1.6-1.6-1.6M9.8 9c-2.5 1.3-1.8 4.4.6 3.8 1.1-.3 1.6-1.5 1.6-1.6M12 11.5V21M12 17c-2-2-4.5-2-5.5-1 1 1.5 3.5 2 5.5 1zM12 18.5c2-2 4.5-2 5.5-1-1 1.5-3.5 2-5.5 1z"/>'),
    thanks: I('<rect x="3.5" y="6" width="17" height="12.5" rx="1.5"/><path d="M4 7l8 6 8-6"/><path d="M12 17.2s-2.6-1.5-2.6-3.3a1.3 1.3 0 0 1 2.6-.4 1.3 1.3 0 0 1 2.6.4c0 1.8-2.6 3.3-2.6 3.3z" fill="currentColor" stroke="none" opacity=".35"/>'),
    // réseaux
    whatsapp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9 3 3.3 8.7 3.3 15.73c0 2.25.59 4.44 1.7 6.37L3.2 28.8l6.87-1.8a12.7 12.7 0 0 0 5.97 1.52h.01c7.03 0 12.74-5.71 12.74-12.74C28.8 8.7 23.08 3 16.04 3zm0 23.37h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.08 1.07 1.09-3.98-.25-.41a10.56 10.56 0 0 1-1.62-5.62c0-5.84 4.76-10.6 10.61-10.6 2.83 0 5.5 1.1 7.5 3.11a10.53 10.53 0 0 1 3.1 7.5c0 5.85-4.76 10.64-10.55 10.64zm5.81-7.94c-.32-.16-1.88-.93-2.17-1.04-.29-.1-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.56-1.58-.95-.84-1.59-1.88-1.77-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z"/></svg>',
    instagram: I('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>'),
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3h-3v12.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.5a5.8 5.8 0 1 0 4.9 5.7V9a7.3 7.3 0 0 0 4.3 1.4V7.4A4.3 4.3 0 0 1 16.6 3z"/></svg>'
  };
  F.icons["saint-valentin"] = F.icons.heart;
  F.icons["sur-mesure"] = F.icons.sparkle;
  F.starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0Q13.5 10.5 24 12Q13.5 13.5 12 24Q10.5 13.5 0 12Q10.5 10.5 12 0Z"/></svg>';
  F.ribbonSvg = '<svg class="ribbon-divider" viewBox="0 0 120 22" aria-hidden="true"><path d="M0 11h44M76 11h44" stroke="currentColor" stroke-width="1"/><path d="M60 11c-6-9-17-9-15-2 1 4 9 3 15 2zM60 11c6-9 17-9 15-2-1 4-9 3-15 2z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M58 12l-6 9M62 12l6 9" stroke="currentColor" stroke-width="1.2"/><circle cx="60" cy="11" r="2.4" fill="currentColor"/></svg>';
})();

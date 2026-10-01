/* ==========================================================================
   Fanni's Store — espace d'administration (application monopage)
   ========================================================================== */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const app = $("#app"), layer = $("#layer");

  /* ---------- icônes ---------- */
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    home: svg('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    box: svg('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
    gift: svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8C10.5 4.5 7 4 7 6s3 2 5 2zm0 0c1.5-3.5 5-4 5-2s-3 2-5 2z"/>'),
    star: svg('<path d="m12 3 2.7 5.5 6 .9-4.4 4.2 1 6L12 16.8 6.7 19.6l1-6L3.3 9.4l6-.9z"/>'),
    cart: svg('<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    users: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>'),
    cog: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    edit: svg('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
    copy: svg('<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/>'),
    trash: svg('<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>'),
    eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: svg('<path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    grip: svg('<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    back: svg('<path d="M15 5l-7 7 7 7"/>'),
    upload: svg('<path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>'),
    check: svg('<path d="M5 12.5 9.5 17 19 7.5"/>'),
    alert: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/>'),
    logout: svg('<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>'),
    ext: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    print: svg('<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7"/>'),
    download: svg('<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>'),
    money: svg('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>'),
    trend: svg('<path d="M3 17 9 11l4 4 8-8"/><path d="M15 7h6v6"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    up: svg('<path d="m6 15 6-6 6 6"/>'),
    down: svg('<path d="m6 9 6 6 6-6"/>'),
    wa: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.3.6 4.4 1.7 6.4L3.2 28.8l6.9-1.8c1.8 1 3.9 1.5 6 1.5 7 0 12.7-5.7 12.7-12.7C28.8 8.7 23.1 3 16 3zm5.9 18c-.3.7-1.6 1.4-2.2 1.5-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.3-1.8-.7-3.2-1.4-5.3-4.6-5.4-4.8-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.7c.3-.3.6-.4.9-.4h.6c.2 0 .5 0 .7.5.3.6.9 2.2 1 2.4.1.2.1.3 0 .6-.1.2-.2.3-.3.5l-.5.6c-.2.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.2.5.1.7-.1.2-.2.8-.9 1-1.3.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1 .3.2.5.2.6.4.1.1.1.7-.2 1.4z"/></svg>'
  };

  /* ---------- formats ---------- */
  const S = { me: null, schemas: null, settings: null, products: null, dirty: false, counts: {} };
  const cur = () => S.settings?.config?.currency || "DT";
  const money = n => `${(Math.round((+n || 0) * 100) / 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ${cur()}`;
  const dt = d => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  const dtt = d => new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const STATUS = {
    nouvelle: ["Nouvelle", "orange"], confirmee: ["Confirmée", "purple"], preparation: ["En préparation", "yellow"],
    expediee: ["Expédiée", "blue"], livree: ["Livrée", "green"], annulee: ["Annulée", "gray"]
  };
  const pill = (txt, color) => `<span class="pill ${color}">${esc(txt)}</span>`;
  const statusPill = s => pill(...(STATUS[s] || [s, "gray"]));

  /* ---------- API ---------- */
  async function api(path, { method = "GET", body } = {}) {
    const r = await fetch("/api/admin" + path, {
      method, credentials: "same-origin",
      headers: { "X-Requested-With": "fanni-admin", ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    let data = null;
    try { data = await r.json(); } catch { /* réponse vide */ }
    if (r.status === 401 && path !== "/login") { S.dirty = false; renderLogin("Votre session a expiré, merci de vous reconnecter."); throw new Error("Session expirée"); }
    if (!r.ok) throw new Error(data?.error || `Erreur ${r.status}`);
    return data;
  }

  /* ---------- notifications, modales ---------- */
  function toast(msg, type = "ok") {
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.innerHTML = (type === "ok" ? I.check : I.alert) + `<span>${esc(msg)}</span>`;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.style.transition = "opacity .3s"; t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3200);
  }
  const fail = e => { if (e.message !== "Session expirée") toast(e.message, "err"); };

  function modal({ title, body, foot = "", wide = false, onMount, cls = "" }) {
    const o = document.createElement("div");
    o.className = "overlay";
    o.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title || "")}" style="${wide ? "width:min(760px,100%)" : ""}">
      ${title ? `<div class="modal-h"><h2>${esc(title)}</h2><button class="icon-btn" data-x aria-label="Fermer">${I.close}</button></div>` : ""}
      <div class="modal-b">${body}</div>${foot ? `<div class="modal-f">${foot}</div>` : ""}</div>`;
    layer.appendChild(o);
    const prev = document.activeElement;
    const close = () => { o.remove(); document.removeEventListener("keydown", key); prev?.focus?.(); };
    const key = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", key);
    o.addEventListener("mousedown", e => { if (e.target === o) close(); });
    $$("[data-x]", o).forEach(b => b.addEventListener("click", close));
    onMount?.(o, close);
    setTimeout(() => ($("input,select,textarea", o) || $("button", o))?.focus(), 30);
    return { el: o, close };
  }
  function confirmBox({ title = "Êtes-vous sûre ?", text = "", ok = "Supprimer", danger = true }) {
    return new Promise(res => {
      const m = modal({
        cls: "confirm", title: "",
        body: `<div class="ic" style="${danger ? "" : "background:var(--brandL);color:var(--brand)"}">${I.alert}</div><h2 style="font-size:18px">${esc(title)}</h2><p class="muted" style="margin:6px 0 0">${esc(text)}</p>`,
        foot: `<button class="btn ghost" data-no>Annuler</button><button class="btn ${danger ? "danger" : "primary"}" data-yes>${esc(ok)}</button>`,
        onMount: (o, close) => {
          $("[data-no]", o).onclick = () => { close(); res(false); };
          $("[data-yes]", o).onclick = () => { close(); res(true); };
        }
      });
      m.el.addEventListener("mousedown", e => { if (e.target === m.el) res(false); });
    });
  }

  /* ---------- connexion ---------- */
  function renderLogin(message, me) {
    layer.innerHTML = "";
    app.innerHTML = `<div class="login"><form class="login-card" novalidate>
      <img class="logo" src="/assets/img/logo-texte.svg" alt="Fanni's Store">
      <h1>Espace d'administration</h1>
      <p class="sub">Connectez-vous pour gérer votre boutique</p>
      ${me && !me.configured ? `<div class="alert warn">${I.alert}<span>L'admin n'est pas encore activé : ajoutez la variable <b>ADMIN_PASSWORD</b> (et ADMIN_EMAIL) dans les réglages de votre serveur Render, puis redémarrez.</span></div>` : ""}
      ${message ? `<div class="alert info">${I.alert}<span>${esc(message)}</span></div>` : ""}
      <div class="alert err" id="lerr" hidden></div>
      <div class="field"><label for="le">Email</label><input class="in" id="le" type="email" autocomplete="username" required></div>
      <div class="field"><label for="lp">Mot de passe</label><div class="pw"><input class="in" id="lp" type="password" autocomplete="current-password" required><button type="button" class="icon-btn" id="lpe" aria-label="Afficher le mot de passe">${I.eye}</button></div></div>
      <button class="btn primary" type="submit">Se connecter</button>
      <div class="login-foot">🔒 Connexion sécurisée · <a href="/">Retour au site</a></div>
    </form></div>`;
    $("#lpe").onclick = () => { const p = $("#lp"); p.type = p.type === "password" ? "text" : "password"; $("#lpe").innerHTML = p.type === "password" ? I.eye : I.eyeOff; };
    $(".login-card").onsubmit = async e => {
      e.preventDefault();
      const btn = $(".login-card .btn.primary"), err = $("#lerr");
      btn.disabled = true; btn.textContent = "Connexion…"; err.hidden = true;
      try {
        const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: $("#le").value, password: $("#lp").value }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || "Connexion impossible.");
        boot();
      } catch (ex) { err.innerHTML = I.alert + `<span>${esc(ex.message)}</span>`; err.hidden = false; btn.disabled = false; btn.textContent = "Se connecter"; }
    };
    $("#le").focus();
  }

  /* ---------- structure ---------- */
  const NAV = [
    ["", "Tableau de bord", "home"],
    ["group", "Catalogue"], ["produits", "Produits", "gift"], ["configurateur", "Crée ta box", "box"], ["avis", "Avis clients", "star"],
    ["group", "Ventes"], ["commandes", "Commandes", "cart", "orders"], ["messages", "Messages", "mail", "messages"], ["newsletter", "Newsletter", "users"],
    ["group", "Boutique"], ["parametres", "Paramètres", "cog"]
  ];
  function renderShell() {
    app.innerHTML = `<div class="shell">
      <aside class="side" id="side">
        <div class="brand"><img src="/assets/img/logo-texte.svg" alt="Fanni's Store"><span>Admin</span></div>
        <nav class="nav">${NAV.map(([h, l, ic, c]) => h === "group" ? `<div class="group">${l}</div>` : `<a href="#/${h}" data-nav="${h}">${I[ic]}<span>${l}</span>${c ? `<span class="count" data-count="${c}" hidden></span>` : ""}</a>`).join("")}</nav>
        <div class="foot">Connectée en tant que<b>${esc(S.me.email)}</b><div class="row" style="margin-top:10px"><a class="btn sm ghost" href="/" target="_blank" style="background:transparent;color:#fff;border-color:#4b4062">${I.ext}Le site</a><button class="btn sm ghost" id="logout" style="background:transparent;color:#fff;border-color:#4b4062">${I.logout}Sortir</button></div></div>
      </aside>
      <div class="main">
        <header class="top"><button class="icon-btn burger" id="burger" aria-label="Menu">${I.menu}</button><div><h1 id="ttl"></h1><div class="crumb" id="crumb"></div></div><div class="grow"></div><div id="topact" class="row"></div><a class="btn ghost hide-sm" href="/" target="_blank">${I.ext}Voir le site</a></header>
        <main class="page" id="page"></main>
      </div></div>`;
    $("#logout").onclick = async () => { await fetch("/api/admin/logout", { method: "POST" }); S.me = null; renderLogin("Vous êtes déconnectée. À bientôt 🤍"); };
    $("#burger").onclick = () => toggleSide(true);
    refreshCounts();
  }
  function toggleSide(open) {
    $("#side").classList.toggle("open", open);
    $(".scrim")?.remove();
    if (open) { const s = document.createElement("div"); s.className = "scrim"; s.onclick = () => toggleSide(false); document.body.appendChild(s); }
  }
  function setTitle(t, crumb = "", actions = "") { $("#ttl").textContent = t; $("#crumb").textContent = crumb; $("#topact").innerHTML = actions; document.title = `${t} · Admin Fanni's Store`; }
  async function refreshCounts() {
    try {
      const s = await api("/stats"); S.stats = s;
      const set = (k, n) => { const el = $(`[data-count="${k}"]`); if (el) { el.textContent = n; el.hidden = !n; } };
      set("orders", s.ordersNew); set("messages", s.messagesUnread);
    } catch { /* sans gravité */ }
  }

  /* ---------- routeur ---------- */
  let current = "";
  async function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    if (S.dirty && hash !== current) {
      if (!await confirmBox({ title: "Quitter sans enregistrer ?", text: "Vos modifications seront perdues.", ok: "Quitter", danger: true })) { history.replaceState(null, "", "#/" + current); return; }
      S.dirty = false; $(".savebar")?.remove();
    }
    current = hash;
    const [sec, a] = hash.split("/");
    $$("[data-nav]").forEach(n => n.classList.toggle("on", n.dataset.nav === (sec || "")));
    toggleSide(false); layer.innerHTML = ""; $(".savebar")?.remove();
    const page = $("#page"); page.innerHTML = `<div class="skel" style="height:120px;margin-bottom:16px"></div><div class="skel" style="height:320px"></div>`;
    window.scrollTo(0, 0);
    try {
      if (!sec) await pageDashboard(page);
      else if (sec === "produits" && a) await pageProduct(page, a === "nouveau" ? null : decodeURIComponent(a));
      else if (sec === "produits") await pageProducts(page);
      else if (sec === "commandes") await pageOrders(page, a && decodeURIComponent(a));
      else if (sec === "configurateur") await pageBuilder(page, a || "builder_boxes");
      else if (sec === "avis") await pageSimple(page, "reviews", "Avis clients", "Les témoignages affichés sur la page d'accueil.");
      else if (sec === "messages") await pageMessages(page);
      else if (sec === "newsletter") await pageNewsletter(page);
      else if (sec === "parametres") await pageSettings(page);
      else page.innerHTML = `<div class="empty"><div class="big">🔍</div><h3>Page introuvable</h3><a class="btn ghost" href="#/">Retour au tableau de bord</a></div>`;
    } catch (e) { if (e.message !== "Session expirée") page.innerHTML = `<div class="alert err">${I.alert}<span>${esc(e.message)}</span></div>`; }
  }
  window.addEventListener("hashchange", route);
  window.addEventListener("beforeunload", e => { if (S.dirty) { e.preventDefault(); e.returnValue = ""; } });

  /* ========================================================================
     TABLEAU DE BORD
     ======================================================================== */
  async function pageDashboard(page) {
    setTitle("Tableau de bord", new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    const s = await api("/stats"); S.stats = s;
    const h = new Date().getHours();
    const kpi = (ico, color, bg, v, l, href) => `<div class="card kpi"><div class="ico" style="background:${bg};color:${color}">${I[ico]}</div><div class="v">${v}</div><div class="l">${l}</div>${href ? `<a href="${href}" aria-label="${esc(l)}"></a>` : ""}</div>`;
    const max = Math.max(1, ...s.days.map(d => d.orders));
    const W = 700, H = 200, bw = W / s.days.length;
    const bars = s.days.map((d, i) => {
      const bh = (d.orders / max) * (H - 50), x = i * bw + bw * .2, y = H - 24 - bh;
      return `<g><rect x="${x}" y="${y}" width="${bw * .6}" height="${Math.max(bh, 2)}" rx="5" fill="${d.orders ? "#f47920" : "#efe9e2"}"><title>${dt(d.day)} : ${d.orders} commande(s) · ${money(d.revenue)}</title></rect>
        ${d.orders ? `<text x="${x + bw * .3}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="600" fill="#4a4359">${d.orders}</text>` : ""}
        ${i % 2 === 0 || i === s.days.length - 1 ? `<text x="${x + bw * .3}" y="${H - 6}" text-anchor="middle" font-size="10.5" fill="#847c8f">${new Date(d.day).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</text>` : ""}</g>`;
    }).join("");
    const top = s.topProducts, tmax = Math.max(1, ...top.map(t => t[1]));
    page.innerHTML = `
      ${S.me.storage === "file" ? `<div class="alert warn">${I.alert}<span><b>Mode local :</b> les données sont enregistrées dans un fichier sur le serveur. En ligne, ajoutez une base PostgreSQL (variable <b>DATABASE_URL</b>) pour qu'elles soient conservées durablement.</span></div>` : ""}
      <div class="hello"><div><h2>${h < 18 ? "Bonjour" : "Bonsoir"} <em>Fanni</em> 🤍</h2><div class="muted">Voici ce qui se passe dans votre boutique.</div></div>
        <div class="row"><a class="btn ghost" href="#/commandes">${I.cart}Commandes</a><a class="btn primary" href="#/produits/nouveau">${I.plus}Ajouter un produit</a></div></div>
      <div class="kpis">
        ${kpi("clock", "#dd6612", "#fff1e6", s.ordersNew, "Commandes à traiter", "#/commandes")}
        ${kpi("money", "#2f9e73", "#e6f6ef", money(s.revenueMonth), "Ventes ce mois-ci")}
        ${kpi("cart", "#7a4fd0", "#f1ebfd", s.ordersMonth, "Commandes ce mois-ci", "#/commandes")}
        ${kpi("trend", "#3a6fd8", "#eaf0fd", money(s.revenue), "Chiffre d'affaires confirmé")}
        ${kpi("gift", "#c98a00", "#fff6dc", s.productsPublished, `Produits en ligne${s.productsDraft ? ` · ${s.productsDraft} brouillon(s)` : ""}`, "#/produits")}
        ${kpi("users", "#2f2544", "#f1eff4", s.subscribers, "Abonnés newsletter", "#/newsletter")}
      </div>
      <div class="dash">
        <div class="grid">
          <div class="card"><div class="card-h"><h2>Commandes des 14 derniers jours</h2><div class="grow"></div><span class="muted">${s.days.reduce((a, d) => a + d.orders, 0)} commande(s) · ${money(s.days.reduce((a, d) => a + d.revenue, 0))}</span></div>
            <div class="card-b"><svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${bars}</svg></div></div>
          <div class="card"><div class="card-h"><h2>Dernières commandes</h2><div class="grow"></div><a class="btn sm ghost" href="#/commandes">Tout voir</a></div>
            ${s.latest.length ? s.latest.map(o => `<a class="list-row" href="#/commandes/${encodeURIComponent(o.id)}"><div class="grow"><b>${esc(o.customer?.name)}</b> <span class="muted">· ${esc(o.id)}</span><div class="muted" style="font-size:12.5px">${dtt(o._created)} · ${o.items.length} article(s) · ${esc(o.customer?.city || "")}</div></div><b class="mono">${money(o.total)}</b>${statusPill(o.status)}</a>`).join("")
              : `<div class="empty" style="padding:36px"><div class="big">🧾</div><h3>Aucune commande pour l'instant</h3><p>Les commandes passées sur le site apparaîtront ici.</p></div>`}
          </div>
        </div>
        <div class="grid" style="align-content:start">
          <div class="card"><div class="card-h"><h2>Suivi des commandes</h2></div><div class="card-b" style="display:grid;gap:10px">
            ${Object.entries(STATUS).map(([k, [l, c]]) => `<a href="#/commandes" class="row" style="justify-content:space-between;text-decoration:none">${pill(l, c)}<b class="mono">${s.byStatus[k] || 0}</b></a>`).join("")}</div></div>
          <div class="card"><div class="card-h"><h2>Produits les plus vendus</h2></div><div class="card-b">
            ${top.length ? top.map(([n, q]) => `<div class="bar-row"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(n)}</span><span class="bar"><i style="width:${q / tmax * 100}%"></i></span><b class="mono" style="text-align:right">${q}</b></div>`).join("") : `<p class="muted" style="margin:0">Les statistiques apparaîtront avec vos premières ventes ✨</p>`}
          </div></div>
          <div class="card"><div class="card-h"><h2>Raccourcis</h2></div><div class="card-b" style="display:grid;gap:8px">
            <a class="btn ghost" href="#/produits/nouveau" style="justify-content:flex-start">${I.plus}Nouveau produit</a>
            <a class="btn ghost" href="#/configurateur" style="justify-content:flex-start">${I.box}Articles de « Crée ta box »</a>
            <a class="btn ghost" href="#/messages" style="justify-content:flex-start">${I.mail}Messages${s.messagesUnread ? ` <span class="pill orange" style="margin-left:auto">${s.messagesUnread} non lu(s)</span>` : ""}</a>
            <a class="btn ghost" href="#/parametres" style="justify-content:flex-start">${I.cog}WhatsApp, livraison, réseaux</a>
          </div></div>
        </div>
      </div>`;
    refreshCounts();
  }

  /* ========================================================================
     PRODUITS — liste
     ======================================================================== */
  const occName = id => S.settings.occasions.find(o => o.id === id)?.fr || id;
  const art = (p, seed) => window.FANNI?.art ? window.FANNI.art.gift(p.art || {}, { seed: seed || p.id || "x", label: "" }) : "";
  const thumbOf = p => p.images?.[0] ? `<img src="${esc(p.images[0])}" alt="" loading="lazy">` : art(p);

  async function pageProducts(page) {
    setTitle("Produits", "Gérez votre catalogue");
    S.products = await api("/products");
    const st = { q: "", occ: "", status: "all" };
    page.innerHTML = `
      <div class="toolbar">
        <div class="search">${I.search}<input class="in" id="pq" placeholder="Rechercher un produit…" aria-label="Rechercher"></div>
        <select class="in" id="pocc" style="width:auto" aria-label="Occasion"><option value="">Toutes les occasions</option>${S.settings.occasions.map(o => `<option value="${o.id}">${esc(o.fr)}</option>`).join("")}</select>
        <div class="tabs" id="pst"></div><div class="grow"></div>
        <a class="btn primary" href="#/produits/nouveau">${I.plus}Ajouter un produit</a>
      </div>
      <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:34px"></th><th>Produit</th><th class="hide-sm">Occasions</th><th class="num">Prix</th><th>Statut</th><th class="hide-sm" style="text-align:center">Best-seller</th><th class="act">Actions</th></tr></thead><tbody id="ptb"></tbody></table></div></div>
      <p class="muted" style="margin-top:12px;font-size:12.5px">💡 Glissez-déposez les lignes (poignée ⋮⋮) pour changer l'ordre d'affichage sur le site.</p>`;
    const draw = () => {
      const all = S.products;
      const counts = { all: all.length, on: all.filter(p => p.published !== false).length, off: all.filter(p => p.published === false).length };
      $("#pst").innerHTML = [["all", "Tous"], ["on", "En ligne"], ["off", "Brouillons"]].map(([k, l]) => `<button class="${st.status === k ? "on" : ""}" data-st="${k}">${l}<span class="n">${counts[k]}</span></button>`).join("");
      const q = st.q.toLowerCase();
      const list = all.filter(p => (!q || (p.name.fr + " " + (p.name.ar || "") + " " + p.id).toLowerCase().includes(q)) && (!st.occ || p.occasion.includes(st.occ)) && (st.status === "all" || (st.status === "on") === (p.published !== false)));
      const canDrag = !q && !st.occ && st.status === "all";
      $("#ptb").innerHTML = list.length ? list.map(p => `<tr data-id="${esc(p.id)}" ${canDrag ? 'draggable="true"' : ""}>
        <td><span class="handle" title="${canDrag ? "Glisser pour réordonner" : "Retirez les filtres pour réordonner"}" style="${canDrag ? "" : "opacity:.3"}">${I.grip}</span></td>
        <td><a class="pname" href="#/produits/${encodeURIComponent(p.id)}" style="text-decoration:none"><span class="thumb">${thumbOf(p)}</span><span><b>${esc(p.name.fr)}</b><small>${esc(p.short?.fr || "")}</small></span></a></td>
        <td class="hide-sm">${p.occasion.slice(0, 3).map(o => `<span class="tag">${esc(occName(o))}</span>`).join("")}${p.occasion.length > 3 ? `<span class="tag">+${p.occasion.length - 3}</span>` : ""}</td>
        <td class="num"><b>${p.priceFrom ? "dès " : ""}${money(p.price)}</b>${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ""}</td>
        <td><button class="icon-btn" style="width:auto;padding:0 2px" data-pub="${esc(p.id)}" title="Cliquer pour ${p.published === false ? "publier" : "masquer"}">${p.published === false ? pill("Brouillon", "gray") : pill("En ligne", "green")}</button></td>
        <td class="hide-sm" style="text-align:center"><button class="icon-btn star-btn ${p.bestseller ? "on" : ""}" data-best="${esc(p.id)}" aria-label="Best-seller">${p.bestseller ? I.star.replace('fill="none"', 'fill="currentColor"') : I.star}</button></td>
        <td class="act"><a class="icon-btn" href="#/produits/${encodeURIComponent(p.id)}" title="Modifier">${I.edit}</a><button class="icon-btn" data-dup="${esc(p.id)}" title="Dupliquer">${I.copy}</button><a class="icon-btn" href="/produit.html?id=${encodeURIComponent(p.id)}" target="_blank" title="Voir sur le site">${I.eye}</a><button class="icon-btn red" data-del="${esc(p.id)}" title="Supprimer">${I.trash}</button></td></tr>`).join("")
        : `<tr><td colspan="7"><div class="empty"><div class="big">🎁</div><h3>Aucun produit trouvé</h3><p>Modifiez la recherche ou ajoutez un nouveau produit.</p></div></td></tr>`;
      if (canDrag) dragRows($("#ptb"), async ids => {
        S.products.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
        try { await api("/products-reorder", { method: "POST", body: { ids } }); toast("Ordre enregistré"); } catch (e) { fail(e); }
      });
    };
    draw();
    $("#pq").oninput = e => { st.q = e.target.value; draw(); };
    $("#pocc").onchange = e => { st.occ = e.target.value; draw(); };
    page.addEventListener("click", async e => {
      const t = e.target.closest("[data-st],[data-pub],[data-best],[data-dup],[data-del]"); if (!t) return;
      if (t.dataset.st) { st.status = t.dataset.st; return draw(); }
      const id = t.dataset.pub || t.dataset.best || t.dataset.dup || t.dataset.del;
      const p = S.products.find(x => x.id === id); if (!p) return;
      try {
        if (t.dataset.pub) { const r = await api("/products/" + encodeURIComponent(id), { method: "PUT", body: { published: p.published === false } }); Object.assign(p, r); toast(r.published ? "Produit en ligne ✨" : "Produit masqué du site"); }
        if (t.dataset.best) { const r = await api("/products/" + encodeURIComponent(id), { method: "PUT", body: { bestseller: !p.bestseller } }); Object.assign(p, r); toast(r.bestseller ? "Ajouté aux best-sellers ⭐" : "Retiré des best-sellers"); }
        if (t.dataset.dup) { const { id: _, _position, _created, _updated, ...rest } = p; const r = await api("/products", { method: "POST", body: { ...rest, name: { ...rest.name, fr: rest.name.fr + " (copie)" }, published: false } }); S.products.push(r); toast("Produit dupliqué en brouillon"); location.hash = "#/produits/" + encodeURIComponent(r.id); return; }
        if (t.dataset.del) {
          if (!await confirmBox({ title: `Supprimer « ${p.name.fr} » ?`, text: "Le produit disparaîtra du site. Cette action est définitive." })) return;
          await api("/products/" + encodeURIComponent(id), { method: "DELETE" }); S.products = S.products.filter(x => x.id !== id); toast("Produit supprimé");
        }
        draw();
      } catch (ex) { fail(ex); }
    });
  }

  /* glisser-déposer de lignes de tableau */
  function dragRows(tbody, onDone) {
    let drag = null;
    $$("tr[draggable]", tbody).forEach(tr => {
      tr.addEventListener("dragstart", e => { drag = tr; tr.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", tr.dataset.id); });
      tr.addEventListener("dragend", () => { tr.classList.remove("dragging"); $$(".drop-above", tbody).forEach(x => x.classList.remove("drop-above")); });
      tr.addEventListener("dragover", e => { e.preventDefault(); $$(".drop-above", tbody).forEach(x => x.classList.remove("drop-above")); if (tr !== drag) tr.classList.add("drop-above"); });
      tr.addEventListener("drop", e => {
        e.preventDefault(); if (!drag || drag === tr) return;
        tbody.insertBefore(drag, tr); tr.classList.remove("drop-above");
        onDone($$("tr[data-id]", tbody).map(r => r.dataset.id));
      });
    });
  }

  /* ========================================================================
     PRODUITS — éditeur
     ======================================================================== */
  const PALETTES = [["#f47920", "#ff8a3d", "#ffc933", "#fff1dc"], ["#3e9b78", "#4da37d", "#ffc933", "#e3f3ea"], ["#ffc933", "#ffd766", "#3e9b78", "#fff4d1"], ["#2f2544", "#4a3f5c", "#ffc933", "#efeaf4"], ["#fff6ec", "#fffaf3", "#f47920", "#fdf3dc"], ["#d6f0e1", "#e6f6ec", "#f47920", "#eaf7ef"], ["#ff8a3d", "#ffa464", "#fff6ec", "#fff1dc"], ["#c9a37c", "#d6b48f", "#3e9b78", "#fff3d1"]];
  const MODELS = { box: "Boîte carrée", round: "Boîte ronde", open: "Box ouverte" };
  const DECOS = { heart: "Cœur", rose: "Rose", rings: "Alliances", flower: "Fleur", thanks: "« merci »", cake: "Gâteau", baby: "Lune (bébé)", star: "Étoiles", sparkle: "Étincelles" };
  const BADGES = { "": "Aucun", best: "Best-seller", new: "Nouveau", promo: "Édition limitée" };

  async function pageProduct(page, id) {
    const isNew = !id;
    const blank = { name: { fr: "", ar: "" }, short: { fr: "", ar: "" }, desc: { fr: "", ar: "" }, includes: { fr: [], ar: [] }, price: "", oldPrice: "", priceFrom: false, custom: false, occasion: [], recipient: S.settings.recipients.map(r => r.id), badge: "", bestseller: false, rating: 5, reviews: 0, images: [], art: { v: "box", b: "#f47920", l: "#ff8a3d", r: "#ffc933", bg: "#fff1dc", deco: "heart" }, published: true, stock: "" };
    let P = isNew ? clone(blank) : await api("/products/" + encodeURIComponent(id));
    P = { ...clone(blank), ...P, includes: { fr: [], ar: [], ...(P.includes || {}) }, art: { ...blank.art, ...(P.art || {}) } };
    let lang = "fr";
    setTitle(isNew ? "Nouveau produit" : P.name.fr, isNew ? "Produits › Ajouter" : "Produits › Modifier");
    const occ = S.settings.occasions, rec = S.settings.recipients;

    page.innerHTML = `
      <div class="ed-head"><a class="btn ghost" href="#/produits">${I.back}Produits</a><h2>${isNew ? "Ajouter un produit" : esc(P.name.fr)}</h2><span id="edpill"></span><div class="grow"></div>
        ${isNew ? "" : `<a class="btn ghost" href="/produit.html?id=${encodeURIComponent(P.id)}" target="_blank">${I.eye}Voir sur le site</a>`}<button class="btn primary" id="save">${I.check}Enregistrer</button></div>
      <div class="editor">
        <div class="grid">
          <section class="card"><div class="card-h"><h2>Informations</h2><div class="grow"></div><div class="lang-tabs" id="lt"></div></div><div class="card-b stack" id="info"></div></section>
          <section class="card"><div class="card-h"><h2>Photos</h2><div class="grow"></div><span class="muted" style="font-size:12.5px">La 1ʳᵉ photo est la couverture · glissez pour réordonner</span></div><div class="card-b">
            <label class="drop" id="drop" tabindex="0">${I.upload}<b>Glissez vos photos ici ou cliquez pour choisir</b><span class="muted">JPG, PNG ou WebP · redimensionnées automatiquement · 12 photos max.</span><input type="file" id="files" accept="image/*" multiple hidden></label>
            <div class="gallery" id="gal"></div>
            <p class="muted" style="font-size:12.5px;margin:12px 0 0">Sans photo, une jolie illustration est générée automatiquement à partir des couleurs choisies à droite.</p>
          </div></section>
          <section class="card"><div class="card-h"><h2>Prix & stock</h2></div><div class="card-b"><div class="grid cols-3">
            <div class="field"><label for="f-price">Prix de vente *</label><div class="prefix"><input class="in" id="f-price" type="number" min="0" step="0.5" inputmode="decimal" value="${esc(P.price)}"><span>${esc(cur())}</span></div></div>
            <div class="field"><label for="f-old">Prix barré <span class="muted">(promo)</span></label><div class="prefix"><input class="in" id="f-old" type="number" min="0" step="0.5" inputmode="decimal" value="${esc(P.oldPrice || "")}"><span>${esc(cur())}</span></div></div>
            <div class="field"><label for="f-stock">Stock <span class="muted">(facultatif)</span></label><input class="in" id="f-stock" type="number" min="0" step="1" value="${esc(P.stock ?? "")}" placeholder="Illimité"></div>
          </div><div class="row" style="margin-top:14px;gap:24px"><label class="check"><input type="checkbox" id="f-from" ${P.priceFrom ? "checked" : ""}> Afficher « dès » devant le prix</label><label class="check"><input type="checkbox" id="f-custom" ${P.custom ? "checked" : ""}> C'est la « box sur mesure » (renvoie vers le configurateur)</label></div></div></section>
        </div>
        <div class="aside">
          <section class="card"><div class="card-h"><h2>Visibilité</h2></div><div class="card-b"><label class="switch"><input type="checkbox" id="f-pub" ${P.published !== false ? "checked" : ""}><i></i><span id="pubtxt"></span></label></div></section>
          <section class="card"><div class="card-h"><h2>Aperçu</h2><div class="grow"></div><span class="muted" style="font-size:12px">tel qu'affiché sur le site</span></div><div class="card-b"><div class="preview" id="prev"></div></div></section>
          <section class="card"><div class="card-h"><h2>Organisation</h2></div><div class="card-b stack">
            <div class="field"><span class="lbl">Occasions *</span><div class="chips-in" id="f-occ">${occ.map(o => `<label class="chip-in"><input type="checkbox" value="${o.id}" ${P.occasion.includes(o.id) ? "checked" : ""}><span>${esc(o.fr)}</span></label>`).join("")}</div></div>
            <div class="field"><span class="lbl">Pour qui ?</span><div class="chips-in" id="f-rec">${rec.map(o => `<label class="chip-in"><input type="checkbox" value="${o.id}" ${P.recipient.includes(o.id) ? "checked" : ""}><span>${esc(o.fr)}</span></label>`).join("")}</div></div>
          </div></section>
          <section class="card"><div class="card-h"><h2>Mise en avant</h2></div><div class="card-b stack">
            <label class="switch"><input type="checkbox" id="f-best" ${P.bestseller ? "checked" : ""}><i></i><span>Afficher dans les best-sellers (accueil)</span></label>
            <div class="field"><label for="f-badge">Badge sur la photo</label><select class="in" id="f-badge">${Object.entries(BADGES).map(([k, l]) => `<option value="${k}" ${P.badge === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
            <div class="grid cols-2"><div class="field"><label for="f-rating">Note affichée</label><input class="in" id="f-rating" type="number" min="0" max="5" step="0.1" value="${esc(P.rating)}"></div><div class="field"><label for="f-reviews">Nombre d'avis</label><input class="in" id="f-reviews" type="number" min="0" step="1" value="${esc(P.reviews)}"></div></div>
          </div></section>
          <section class="card"><div class="card-h"><h2>Illustration</h2><div class="grow"></div><span class="muted" style="font-size:12px">si pas de photo</span></div><div class="card-b stack">
            <div class="palettes" id="pals">${PALETTES.map((p, i) => `<button type="button" data-pal="${i}" title="Palette ${i + 1}">${p.map(c => `<i style="background:${c}"></i>`).join("")}</button>`).join("")}</div>
            <div class="grid cols-2"><div class="field"><label for="a-v">Modèle</label><select class="in" id="a-v">${Object.entries(MODELS).map(([k, l]) => `<option value="${k}" ${P.art.v === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
            <div class="field"><label for="a-deco">Motif de l'étiquette</label><select class="in" id="a-deco">${Object.entries(DECOS).map(([k, l]) => `<option value="${k}" ${P.art.deco === k ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
            <div class="grid cols-2">${[["b", "Boîte"], ["l", "Couvercle"], ["r", "Ruban"], ["bg", "Fond"]].map(([k, l]) => `<div class="field"><label>${l}</label><div class="color-in"><input type="color" data-art="${k}" value="${P.art[k]}" aria-label="${l}"></div></div>`).join("")}</div>
          </div></section>
          ${isNew ? "" : `<section class="card"><div class="card-b row" style="justify-content:space-between"><span class="muted">Supprimer définitivement ce produit</span><button class="btn danger sm" id="pdel">${I.trash}Supprimer</button></div></section>`}
        </div>
      </div>`;

    const dirty = () => { if (!S.dirty) { S.dirty = true; showSavebar(); } preview(); };
    function showSavebar() {
      $(".savebar")?.remove();
      const b = document.createElement("div"); b.className = "savebar show";
      b.innerHTML = `<span>${I.alert.replace("<svg", '<svg style="width:18px;height:18px;color:#ffc933"')}</span><b>Modifications non enregistrées</b><div class="grow"></div><button class="btn ghost sm" id="sb-cancel">Annuler</button><button class="btn primary sm" id="sb-save">${I.check}Enregistrer</button>`;
      document.body.appendChild(b);
      $("#sb-save").onclick = save;
      $("#sb-cancel").onclick = () => { S.dirty = false; b.remove(); route(); };
    }

    /* informations bilingues */
    const LBL = { fr: "Français", ar: "العربية" };
    function drawLangTabs() {
      $("#lt").innerHTML = ["fr", "ar"].map(l => `<button type="button" class="${l === lang ? "on" : ""}" data-lang="${l}">${LBL[l]}<span class="dot ${P.name[l] ? "ok" : ""}"></span></button>`).join("");
    }
    function drawInfo() {
      const d = lang === "ar" ? 'dir="rtl"' : "";
      $("#info").innerHTML = `
        <div class="field"><label for="f-name">Nom du produit ${lang === "fr" ? "*" : ""}</label><input class="in" id="f-name" ${d} maxlength="120" value="${esc(P.name[lang])}" placeholder="${lang === "fr" ? "Ex. : Box Éclat de Rose" : "مثال: علبة إشراقة الورد"}"></div>
        <div class="field"><label for="f-short">Description courte <span class="muted">(sous le nom, dans la boutique)</span></label><input class="in" id="f-short" ${d} maxlength="240" value="${esc(P.short[lang])}"><span class="hint"><span id="c-short">${P.short[lang].length}</span>/240</span></div>
        <div class="field"><label for="f-desc">Description complète <span class="muted">(page produit)</span></label><textarea class="in" id="f-desc" ${d} rows="6" maxlength="4000">${esc(P.desc[lang])}</textarea></div>
        <div class="field"><span class="lbl">Contenu de la box <span class="muted">(une ligne par article)</span></span><div class="list-ed" id="incl"></div><button type="button" class="btn ghost sm" id="add-inc" style="width:fit-content">${I.plus}Ajouter une ligne</button></div>
        ${lang === "ar" ? `<p class="hint muted" style="margin:0">Facultatif : si l'arabe est vide, le texte français s'affiche aussi en version arabe.</p>` : ""}`;
      drawIncludes();
      $("#f-name").oninput = e => { P.name[lang] = e.target.value; drawLangTabs(); dirty(); $("#f-name").classList.remove("bad"); };
      $("#f-short").oninput = e => { P.short[lang] = e.target.value; $("#c-short").textContent = e.target.value.length; dirty(); };
      $("#f-desc").oninput = e => { P.desc[lang] = e.target.value; dirty(); };
      $("#add-inc").onclick = () => { P.includes[lang].push(""); drawIncludes(); $$("#incl .in").pop()?.focus(); dirty(); };
    }
    function drawIncludes() {
      const L = P.includes[lang];
      $("#incl").innerHTML = L.map((t, i) => `<div class="li"><input class="in" ${lang === "ar" ? 'dir="rtl"' : ""} data-inc="${i}" value="${esc(t)}" maxlength="160" placeholder="Ex. : Bougie parfumée pivoine & musc"><button type="button" class="icon-btn" data-incup="${i}" ${i ? "" : "disabled"} aria-label="Monter">${I.up}</button><button type="button" class="icon-btn red" data-incdel="${i}" aria-label="Supprimer">${I.trash}</button></div>`).join("") || `<p class="muted" style="margin:0;font-size:13px">Aucune ligne pour l'instant.</p>`;
    }
    $("#info").addEventListener("input", e => { if (e.target.dataset.inc !== undefined) { P.includes[lang][+e.target.dataset.inc] = e.target.value; dirty(); } });
    $("#info").addEventListener("click", e => {
      const up = e.target.closest("[data-incup]"), del = e.target.closest("[data-incdel]"), L = P.includes[lang];
      if (up) { const i = +up.dataset.incup; [L[i - 1], L[i]] = [L[i], L[i - 1]]; drawIncludes(); dirty(); }
      if (del) { L.splice(+del.dataset.incdel, 1); drawIncludes(); dirty(); }
    });
    $("#lt").onclick = e => { const b = e.target.closest("[data-lang]"); if (!b) return; lang = b.dataset.lang; drawLangTabs(); drawInfo(); };
    drawLangTabs(); drawInfo();

    /* photos */
    function drawGallery(uploading = 0) {
      $("#gal").innerHTML = P.images.map((u, i) => `<div class="gal" draggable="true" data-i="${i}">${i === 0 ? '<span class="cover">COUVERTURE</span>' : ""}<img src="${esc(u)}" alt="Photo ${i + 1}"><button type="button" class="rm" data-rmimg="${i}" aria-label="Retirer la photo">${I.trash}</button></div>`).join("") + Array.from({ length: uploading }, () => `<div class="gal up"><div class="spinner"></div></div>`).join("");
      let from = null;
      $$(".gal[draggable]").forEach(g => {
        g.addEventListener("dragstart", () => { from = +g.dataset.i; g.classList.add("dragging"); });
        g.addEventListener("dragend", () => g.classList.remove("dragging"));
        g.addEventListener("dragover", e => e.preventDefault());
        g.addEventListener("drop", e => { e.preventDefault(); e.stopPropagation(); const to = +g.dataset.i; if (from === null || from === to) return; const [m] = P.images.splice(from, 1); P.images.splice(to, 0, m); drawGallery(); dirty(); });
      });
    }
    $("#gal").addEventListener("click", e => { const b = e.target.closest("[data-rmimg]"); if (b) { P.images.splice(+b.dataset.rmimg, 1); drawGallery(); dirty(); } });
    async function upload(files) {
      files = [...files].filter(f => f.type.startsWith("image/")).slice(0, 12 - P.images.length);
      if (!files.length) return toast(P.images.length >= 12 ? "12 photos maximum par produit." : "Choisissez des fichiers image.", "err");
      let pending = files.length; drawGallery(pending);
      for (const f of files) {
        try { const { mime, data } = await compress(f); const r = await api("/images", { method: "POST", body: { mime, data } }); P.images.push(r.url); dirty(); }
        catch (e) { fail(e); }
        pending--; drawGallery(pending);
      }
      toast("Photo(s) ajoutée(s) — pensez à enregistrer");
    }
    const drop = $("#drop");
    $("#files").onchange = e => { upload(e.target.files); e.target.value = ""; };
    drop.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("#files").click(); } });
    ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", e => upload(e.dataTransfer.files));
    drawGallery();

    /* autres champs */
    const bindNum = (sel, key) => $(sel).addEventListener("input", e => { P[key] = e.target.value; e.target.classList.remove("bad"); dirty(); });
    bindNum("#f-price", "price"); bindNum("#f-old", "oldPrice"); bindNum("#f-stock", "stock"); bindNum("#f-rating", "rating"); bindNum("#f-reviews", "reviews");
    $("#f-from").onchange = e => { P.priceFrom = e.target.checked; dirty(); };
    $("#f-custom").onchange = e => { P.custom = e.target.checked; dirty(); };
    $("#f-best").onchange = e => { P.bestseller = e.target.checked; dirty(); };
    $("#f-badge").onchange = e => { P.badge = e.target.value; dirty(); };
    const pubTxt = () => { $("#pubtxt").innerHTML = P.published ? "<b>En ligne</b> — visible sur le site" : "<b>Brouillon</b> — masqué du site"; $("#edpill").innerHTML = P.published ? pill("En ligne", "green") : pill("Brouillon", "gray"); };
    $("#f-pub").onchange = e => { P.published = e.target.checked; pubTxt(); dirty(); };
    pubTxt();
    const chk = (sel, key) => $(sel).addEventListener("change", () => { P[key] = $$(`${sel} input:checked`).map(i => i.value); $(sel).style.outline = ""; dirty(); });
    chk("#f-occ", "occasion"); chk("#f-rec", "recipient");
    $("#a-v").onchange = e => { P.art.v = e.target.value; dirty(); };
    $("#a-deco").onchange = e => { P.art.deco = e.target.value; dirty(); };
    $$("[data-art]").forEach(inp => inp.addEventListener("input", e => { P.art[e.target.dataset.art] = e.target.value; dirty(); }));
    $("#pals").onclick = e => { const b = e.target.closest("[data-pal]"); if (!b) return; const [bx, l, r, bg] = PALETTES[+b.dataset.pal]; Object.assign(P.art, { b: bx, l, r, bg }); $$("[data-art]").forEach(i => (i.value = P.art[i.dataset.art])); dirty(); };

    function preview() {
      const o = S.settings.occasions.find(x => x.id === P.occasion[0]);
      const badge = { best: "Best-seller", new: "Nouveau", promo: "Édition limitée" }[P.badge];
      $("#prev").innerHTML = `<div class="pic">${badge ? `<span class="badge" style="${P.badge === "new" ? "background:#3e9b78;color:#fff" : P.badge === "promo" ? "background:#e8670f;color:#fff" : ""}">${badge}</span>` : ""}${P.images[0] ? `<img src="${esc(P.images[0])}" alt="">` : art(P, P.id || "nouveau")}</div>
        <div class="inf"><div class="occ">${esc(o?.fr || "Occasion")}</div><div class="nm">${esc(P.name.fr || "Nom du produit")}</div><div class="sh">${esc(P.short.fr || "Description courte…")}</div>
        <div class="pr">${P.priceFrom ? "dès " : ""}${P.price ? money(P.price) : "— " + esc(cur())}${+P.oldPrice > +P.price ? `<span class="price-old">${money(P.oldPrice)}</span>` : ""} <span style="color:#f2a900;font-size:12px;margin-left:6px">★★★★★</span></div></div>`;
    }
    preview();

    /* enregistrement */
    async function save() {
      const errs = [];
      if (!P.name.fr.trim()) { errs.push("le nom en français"); if (lang !== "fr") { lang = "fr"; drawLangTabs(); drawInfo(); } $("#f-name").classList.add("bad"); }
      if (!P.custom && !(+P.price > 0)) { errs.push("le prix"); $("#f-price").classList.add("bad"); }
      if (!P.occasion.length) { errs.push("au moins une occasion"); $("#f-occ").style.outline = "2px solid var(--red)"; $("#f-occ").style.borderRadius = "10px"; }
      if (errs.length) return toast("Il manque " + errs.join(", ") + ".", "err");
      const btns = [$("#save"), $("#sb-save")].filter(Boolean); btns.forEach(b => (b.disabled = true));
      const body = { ...P, includes: { fr: P.includes.fr.filter(s => s.trim()), ar: P.includes.ar.filter(s => s.trim()) } };
      try {
        const r = isNew ? await api("/products", { method: "POST", body }) : await api("/products/" + encodeURIComponent(P.id), { method: "PUT", body });
        S.dirty = false; $(".savebar")?.remove();
        toast(isNew ? "Produit créé ✨" : "Modifications enregistrées");
        if (isNew) { current = "produits/" + r.id; location.hash = "#/produits/" + encodeURIComponent(r.id); }
        else { P = { ...P, ...r }; setTitle(P.name.fr, "Produits › Modifier"); $(".ed-head h2").textContent = P.name.fr; }
      } catch (e) { fail(e); } finally { btns.forEach(b => (b.disabled = false)); }
    }
    $("#save").onclick = save;
    const keySave = e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && location.hash.startsWith("#/produits/")) { e.preventDefault(); save(); } };
    document.addEventListener("keydown", keySave);
    window.addEventListener("hashchange", () => document.removeEventListener("keydown", keySave), { once: true });
    $("#pdel")?.addEventListener("click", async () => {
      if (!await confirmBox({ title: `Supprimer « ${P.name.fr} » ?`, text: "Le produit disparaîtra du site. Cette action est définitive." })) return;
      try { await api("/products/" + encodeURIComponent(P.id), { method: "DELETE" }); S.dirty = false; toast("Produit supprimé"); location.hash = "#/produits"; } catch (e) { fail(e); }
    });
  }

  /* compression des photos dans le navigateur (max 1600 px, WebP) */
  async function compress(file) {
    const bmp = await createImageBitmap(file).catch(() => { throw new Error("Impossible de lire cette image."); });
    const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    let blob = await new Promise(r => c.toBlob(r, "image/webp", 0.86));
    if (!blob || blob.type !== "image/webp") blob = await new Promise(r => c.toBlob(r, "image/jpeg", 0.88));
    const data = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = rej; fr.readAsDataURL(blob); });
    return { mime: blob.type, data };
  }

  /* ========================================================================
     COLLECTIONS SIMPLES (configurateur, avis)
     ======================================================================== */
  const BUILDER_TABS = [["builder_boxes", "Tailles de box"], ["builder_items", "Articles"], ["builder_categories", "Catégories"], ["builder_wrappings", "Emballages"], ["builder_extras", "Finitions"]];
  async function pageBuilder(page, col) {
    if (!S.schemas.simple[col]) col = "builder_boxes";
    setTitle("Crée ta box", "Configurateur de box sur mesure");
    page.innerHTML = `<div class="row" style="margin-bottom:18px;justify-content:space-between"><div class="tabs">${BUILDER_TABS.map(([c, l]) => `<button class="${c === col ? "on" : ""}" onclick="location.hash='#/configurateur/${c}'">${l}</button>`).join("")}</div><a class="btn ghost" href="/creer-ma-box.html" target="_blank">${I.eye}Voir le configurateur</a></div><div id="coll"></div>`;
    await collection($("#coll"), col);
  }
  async function pageSimple(page, col, title, sub) { setTitle(title, sub); page.innerHTML = `<div id="coll"></div>`; await collection($("#coll"), col); }

  async function refOptions(ref) {
    if (ref === "products") { S.products ||= await api("/products"); return S.products.map(p => [p.id, p.name.fr]); }
    return (await api("/c/" + ref)).map(x => [x.id, x.fr || x.name || x.id]);
  }
  async function collection(root, col) {
    const sch = S.schemas.simple[col];
    let items = await api("/c/" + col);
    const refs = {};
    for (const f of sch.fields) if (f.type === "ref") refs[f.key] = await refOptions(f.ref);
    const lbl = (f, v) => {
      if (f.type === "bool") return (v ?? f.def) ? pill("Oui", "green") : pill("Non", "gray");
      if (f.type === "money") return `<span class="mono">${money(v)}</span>`;
      if (f.type === "color") return `<span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:${esc(v)};border:1px solid var(--line);vertical-align:middle"></span>`;
      if (f.type === "ref") return esc(refs[f.key]?.find(o => o[0] === v)?.[1] || v || "—");
      if (f.key === "emoji") return `<span style="font-size:22px">${esc(v)}</span>`;
      if (f.key === "rating") return `<span style="color:#f2a900">${"★".repeat(v)}</span>`;
      return esc(v);
    };
    const cols = sch.columns.map(k => sch.fields.find(f => f.key === k));
    const toggleKey = sch.fields.find(f => f.key === "active" || f.key === "published")?.key;
    const draw = () => {
      root.innerHTML = `<div class="toolbar"><div class="muted">${items.length} ${esc(sch.singular)}${items.length > 1 ? "s" : ""}</div><div class="grow"></div><button class="btn primary" id="cadd">${I.plus}Ajouter ${sch.singular === "avis" ? "un avis" : (["box", "catégorie", "finition"].includes(sch.singular) ? "une " : "un ") + sch.singular}</button></div>
        <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:34px"></th>${cols.map(f => `<th class="${f.type === "money" ? "num" : ""}">${esc(f.label.replace(/ \(.*\)/, ""))}</th>`).join("")}<th class="act">Actions</th></tr></thead>
        <tbody id="ctb">${items.map(it => `<tr data-id="${esc(it.id)}" draggable="true" class="click">${'<td><span class="handle">' + I.grip + "</span></td>"}${cols.map(f => `<td class="${f.type === "money" ? "num" : ""}">${f.key === toggleKey ? `<button class="icon-btn" style="width:auto" data-tog="${esc(it.id)}">${lbl(f, it[f.key])}</button>` : lbl(f, it[f.key])}</td>`).join("")}
          <td class="act"><button class="icon-btn" data-ed="${esc(it.id)}" title="Modifier">${I.edit}</button><button class="icon-btn red" data-rm="${esc(it.id)}" title="Supprimer">${I.trash}</button></td></tr>`).join("") || `<tr><td colspan="${cols.length + 2}"><div class="empty"><div class="big">✨</div><h3>Rien pour l'instant</h3></div></td></tr>`}</tbody></table></div></div>`;
      dragRows($("#ctb"), async ids => { items.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)); try { await api(`/c/${col}/reorder`, { method: "POST", body: { ids } }); toast("Ordre enregistré"); } catch (e) { fail(e); } });
      $("#cadd").onclick = () => edit(null);
    };
    root.onclick = async e => {
      const t = e.target.closest("[data-ed],[data-rm],[data-tog]");
      const row = e.target.closest("tr[data-id]");
      if (!t && row && !e.target.closest(".handle")) return edit(items.find(x => x.id === row.dataset.id));
      if (!t) return;
      const it = items.find(x => x.id === (t.dataset.ed || t.dataset.rm || t.dataset.tog));
      if (t.dataset.ed) return edit(it);
      try {
        if (t.dataset.tog) { const { id, _position, _created, _updated, ...d } = it; const r = await api(`/c/${col}/${encodeURIComponent(id)}`, { method: "PUT", body: { ...d, [toggleKey]: !(it[toggleKey] ?? sch.fields.find(f => f.key === toggleKey)?.def) } }); Object.assign(it, r); toast("Enregistré"); }
        if (t.dataset.rm) { if (!await confirmBox({ title: "Supprimer cet élément ?", text: "Il disparaîtra du site." })) return; await api(`/c/${col}/${encodeURIComponent(it.id)}`, { method: "DELETE" }); items = items.filter(x => x !== it); toast("Supprimé"); }
        draw();
      } catch (ex) { fail(ex); }
    };
    function edit(it) {
      const v = it || Object.fromEntries(sch.fields.map(f => [f.key, f.def ?? (f.type === "bool" ? false : "")]));
      const field = f => {
        const val = v[f.key] ?? f.def ?? "", id = "x-" + f.key, req = f.required ? " *" : "", d = f.dir ? `dir="${f.dir}"` : "";
        if (f.type === "bool") return `<label class="switch"><input type="checkbox" id="${id}" ${val ? "checked" : ""}><i></i><span>${esc(f.label)}</span></label>`;
        if (f.type === "textarea") return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label><textarea class="in" id="${id}" ${d} maxlength="${f.max || 2000}">${esc(val)}</textarea></div>`;
        if (f.type === "ref") return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label><select class="in" id="${id}">${f.required ? "" : '<option value="">—</option>'}${refs[f.key].map(([k, l]) => `<option value="${esc(k)}" ${k === val ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></div>`;
        if (f.type === "color") return `<div class="field"><label>${esc(f.label)}</label><div class="color-in"><input type="color" id="${id}" value="${esc(val || f.def)}"></div></div>`;
        const num = ["money", "int", "number"].includes(f.type);
        const inp = `<input class="in" id="${id}" ${d} ${num ? `type="number" step="${f.step || (f.type === "int" ? 1 : 0.5)}" min="${f.min ?? 0}" ${f.max ? `max="${f.max}"` : ""}` : `maxlength="${f.max || 200}"`} value="${esc(val)}">`;
        return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>${f.type === "money" ? `<div class="prefix">${inp}<span>${esc(cur())}</span></div>` : inp}</div>`;
      };
      const half = sch.fields.filter(f => f.type !== "bool" && f.type !== "textarea");
      modal({
        title: it ? "Modifier" : "Ajouter", wide: col === "reviews",
        body: `<div class="grid cols-2">${half.map(field).join("")}</div>${sch.fields.filter(f => f.type === "textarea").map(field).join("")}${sch.fields.filter(f => f.type === "bool").map(field).join("")}`,
        foot: `<button class="btn ghost" data-x>Annuler</button><button class="btn primary" data-save>${I.check}Enregistrer</button>`,
        onMount: (o, close) => {
          $("[data-save]", o).onclick = async () => {
            const d = {}; let bad = false;
            for (const f of sch.fields) {
              const el = $("#x-" + f.key, o);
              d[f.key] = f.type === "bool" ? el.checked : el.value;
              if (f.required && f.type !== "bool" && !String(el.value).trim()) { el.classList.add("bad"); bad = true; }
            }
            if (bad) return toast("Complétez les champs obligatoires (*).", "err");
            try {
              const r = it ? await api(`/c/${col}/${encodeURIComponent(it.id)}`, { method: "PUT", body: d }) : await api(`/c/${col}`, { method: "POST", body: d });
              if (it) Object.assign(it, r); else items.push(r);
              close(); draw(); toast(it ? "Modifications enregistrées" : "Ajouté ✨");
            } catch (e) { fail(e); }
          };
        }
      });
    }
    draw();
  }

  /* ========================================================================
     COMMANDES
     ======================================================================== */
  const phoneIntl = p => { let d = String(p || "").replace(/\D/g, ""); if (d.startsWith("00")) d = d.slice(2); if (d.length === 8) d = "216" + d; return d; };
  const WA_MSG = {
    nouvelle: (o) => `Bonjour ${o.customer.name} 🤍 Merci pour votre commande ${o.id} chez Fanni's Store ! Nous la confirmons avec vous :`,
    confirmee: (o) => `Bonjour ${o.customer.name} 🤍 Votre commande ${o.id} est confirmée ! Nous commençons à la préparer avec amour ✨`,
    preparation: (o) => `Bonjour ${o.customer.name} 🎁 Votre commande ${o.id} est en cours de préparation à l'atelier.`,
    expediee: (o) => `Bonjour ${o.customer.name} 🚚 Votre commande ${o.id} est en route ! Elle arrive très bientôt.`,
    livree: (o) => `Bonjour ${o.customer.name} 🤍 Votre commande ${o.id} a été livrée. Merci pour votre confiance ! Un petit avis nous ferait très plaisir ✨`,
    annulee: (o) => `Bonjour ${o.customer.name}, votre commande ${o.id} a été annulée. N'hésitez pas à nous écrire pour toute question.`
  };
  const waLink = o => `https://wa.me/${phoneIntl(o.customer?.phone)}?text=${encodeURIComponent((WA_MSG[o.status] || WA_MSG.nouvelle)(o))}`;
  const statusSelect = o => { const [, c] = STATUS[o.status] || ["", "gray"]; return `<select class="status-select pill ${c}" data-status="${esc(o.id)}" aria-label="Statut">${Object.entries(STATUS).map(([k, [l]]) => `<option value="${k}" ${o.status === k ? "selected" : ""}>${l}</option>`).join("")}</select>`; };

  async function pageOrders(page, openId) {
    setTitle("Commandes", "Suivez et traitez vos commandes", `<button class="btn ghost" id="ocsv">${I.download}<span class="hide-sm">Exporter (CSV)</span></button>`);
    let orders = await api("/orders");
    const st = { q: "", status: "" };
    page.innerHTML = `<div class="toolbar"><div class="search">${I.search}<input class="in" id="oq" placeholder="N°, client, téléphone, ville…" aria-label="Rechercher"></div><div class="tabs" id="ost"></div></div>
      <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Commande</th><th>Client</th><th class="hide-sm">Ville</th><th class="num">Total</th><th class="hide-sm">Paiement</th><th>Statut</th><th class="act"></th></tr></thead><tbody id="otb"></tbody></table></div></div>`;
    const filtered = () => { const q = st.q.toLowerCase(); return orders.filter(o => (!st.status || o.status === st.status) && (!q || [o.id, o.customer?.name, o.customer?.phone, o.customer?.city].join(" ").toLowerCase().includes(q))); };
    const draw = () => {
      $("#ost").innerHTML = `<button class="${!st.status ? "on" : ""}" data-os="">Toutes<span class="n">${orders.length}</span></button>` + Object.entries(STATUS).map(([k, [l]]) => `<button class="${st.status === k ? "on" : ""}" data-os="${k}">${l}<span class="n">${orders.filter(o => o.status === k).length}</span></button>`).join("");
      const list = filtered();
      $("#otb").innerHTML = list.length ? list.map(o => `<tr class="click" data-open="${esc(o.id)}">
        <td><b>${esc(o.id)}</b><div class="muted" style="font-size:12px">${dtt(o._created)}</div></td>
        <td><b>${esc(o.customer?.name)}</b><div class="muted" style="font-size:12px">${esc(o.customer?.phone)}</div></td>
        <td class="hide-sm">${esc(o.customer?.city)}</td>
        <td class="num"><b>${money(o.total)}</b><div class="muted" style="font-size:12px">${o.items.reduce((s, i) => s + i.qty, 0)} article(s)</div></td>
        <td class="hide-sm">${o.pay === "online" ? pill("En ligne", "blue") : pill("À la livraison", "gray")}</td>
        <td>${statusSelect(o)}</td>
        <td class="act"><a class="icon-btn" style="color:#25d366" href="${waLink(o)}" target="_blank" title="Écrire sur WhatsApp">${I.wa}</a></td></tr>`).join("")
        : `<tr><td colspan="7"><div class="empty"><div class="big">🧾</div><h3>${orders.length ? "Aucune commande ne correspond" : "Aucune commande pour l'instant"}</h3><p>${orders.length ? "Modifiez la recherche ou le filtre." : "Dès qu'une cliente valide son panier sur le site, sa commande apparaît ici."}</p></div></td></tr>`;
    };
    async function setStatus(id, status) {
      try { const r = await api("/orders/" + encodeURIComponent(id), { method: "PUT", body: { status } }); const o = orders.find(x => x.id === id); Object.assign(o, r); draw(); refreshCounts(); toast(`Statut : ${STATUS[status][0]}`); return o; } catch (e) { fail(e); }
    }
    page.addEventListener("change", e => { const s = e.target.closest("[data-status]"); if (s) setStatus(s.dataset.status, s.value); });
    page.addEventListener("click", e => {
      const f = e.target.closest("[data-os]"); if (f) { st.status = f.dataset.os; return draw(); }
      if (e.target.closest("select,a")) return;
      const r = e.target.closest("[data-open]"); if (r) location.hash = "#/commandes/" + encodeURIComponent(r.dataset.open);
    });
    $("#oq").oninput = e => { st.q = e.target.value; draw(); };
    $("#ocsv").onclick = () => csv(`commandes-${new Date().toISOString().slice(0, 10)}.csv`, filtered().map(o => ({
      "N°": o.id, Date: dtt(o._created), Statut: STATUS[o.status]?.[0], Client: o.customer?.name, "Téléphone": o.customer?.phone, Email: o.customer?.email, Adresse: o.customer?.address, Ville: o.customer?.city,
      Articles: o.items.map(i => `${i.qty}× ${i.name}`).join(" | "), "Sous-total": o.subtotal, Livraison: o.shipping, Total: o.total, Paiement: o.pay === "online" ? "En ligne" : "À la livraison"
    })));
    draw();

    if (openId) {
      const o = orders.find(x => x.id === openId);
      if (!o) { toast("Commande introuvable", "err"); return; }
      const optLbl = { box: "Box", items: "Articles", name: "Prénom", to: "Pour", from: "De la part de", message: "Message", ribbon: "Ruban", card: "Carte", wrap: "Emballage", extras: "Finitions", photo: "Photo" };
      const drawDrawer = () => {
        layer.innerHTML = `<div class="scrim" data-close></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="Commande ${esc(o.id)}">
          <div class="drawer-h"><div style="flex:1"><h2>Commande ${esc(o.id)}</h2><div class="muted" style="font-size:12.5px">${dtt(o._created)} · ${o.pay === "online" ? "Paiement en ligne" : "Paiement à la livraison"}</div></div>${statusSelect(o)}<button class="icon-btn" data-close aria-label="Fermer">${I.close}</button></div>
          <div class="drawer-b">
            <section><h3 style="font-size:14px;margin-bottom:10px">Cliente</h3><dl class="kv">
              <dt>Nom</dt><dd>${esc(o.customer.name)}</dd><dt>Téléphone</dt><dd><a href="tel:${esc(o.customer.phone)}">${esc(o.customer.phone)}</a></dd>
              ${o.customer.email ? `<dt>Email</dt><dd><a href="mailto:${esc(o.customer.email)}">${esc(o.customer.email)}</a></dd>` : ""}
              <dt>Adresse</dt><dd>${esc(o.customer.address)}, ${esc(o.customer.city)}</dd>
              ${o.customer.date ? `<dt>Date souhaitée</dt><dd>${esc(o.customer.date)}</dd>` : ""}
              ${o.customer.gift ? `<dt>Surprise</dt><dd>🤫 Livrer sans le prix</dd>` : ""}
              ${o.customer.note ? `<dt>Note</dt><dd>${esc(o.customer.note)}</dd>` : ""}</dl></section>
            <section><h3 style="font-size:14px;margin-bottom:4px">Articles</h3><div class="items">${o.items.map(i => `<div class="it"><span class="q">${i.qty}×</span><div style="flex:1"><b>${esc(i.name)}</b><div class="opts">${Object.entries(i.options || {}).map(([k, v]) => `<div><b>${esc(optLbl[k] || k)} :</b> ${esc(v)}</div>`).join("")}</div></div><b class="mono">${money(i.price * i.qty)}</b></div>`).join("")}</div>
              <div class="totals" style="margin-top:12px"><div><span class="muted">Sous-total</span><span>${money(o.subtotal)}</span></div><div><span class="muted">Livraison</span><span>${o.shipping ? money(o.shipping) : "Offerte"}</span></div><div class="t"><span>Total</span><span>${money(o.total)}</span></div></div></section>
            <section class="no-print"><h3 style="font-size:14px;margin-bottom:10px">Note interne</h3><textarea class="in" id="onote" rows="3" placeholder="Ex. : appelée le 12/10, livraison prévue samedi…">${esc(o.note || "")}</textarea><button class="btn ghost sm" id="onsave" style="margin-top:8px">${I.check}Enregistrer la note</button></section>
            <section><h3 style="font-size:14px;margin-bottom:10px">Historique</h3><div class="timeline">${(o.history || []).slice().reverse().map(h => `<div>${statusPill(h.status)}<span class="muted">${dtt(h.at)}</span></div>`).join("")}</div></section>
          </div>
          <div class="drawer-f"><a class="btn wa" href="${waLink(o)}" target="_blank">${I.wa}Écrire à la cliente</a><button class="btn ghost" onclick="window.print()">${I.print}Imprimer</button><div style="flex:1"></div><button class="btn danger" id="odel">${I.trash}</button></div>
        </aside>`;
        const close = () => { layer.innerHTML = ""; history.replaceState(null, "", "#/commandes"); current = "commandes"; };
        $$("[data-close]", layer).forEach(b => (b.onclick = close));
        $("[data-status]", layer).onchange = async e => { await setStatus(o.id, e.target.value); drawDrawer(); };
        $("#onsave").onclick = async () => { try { const r = await api("/orders/" + encodeURIComponent(o.id), { method: "PUT", body: { note: $("#onote").value } }); Object.assign(o, r); toast("Note enregistrée"); } catch (e) { fail(e); } };
        $("#odel").onclick = async () => { if (!await confirmBox({ title: "Supprimer cette commande ?", text: "Elle sera définitivement effacée." })) return; try { await api("/orders/" + encodeURIComponent(o.id), { method: "DELETE" }); orders = orders.filter(x => x !== o); close(); draw(); refreshCounts(); toast("Commande supprimée"); } catch (e) { fail(e); } };
        document.addEventListener("keydown", function k(e) { if (e.key === "Escape" && layer.innerHTML) { close(); document.removeEventListener("keydown", k); } });
      };
      drawDrawer();
    }
  }

  /* ---------- export CSV (compatible Excel) ---------- */
  function csv(name, rows) {
    if (!rows.length) return toast("Rien à exporter.", "err");
    const cols = Object.keys(rows[0]);
    const cell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const text = "﻿" + [cols.map(cell).join(";"), ...rows.map(r => cols.map(c => cell(r[c])).join(";"))].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" })); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ========================================================================
     MESSAGES
     ======================================================================== */
  async function pageMessages(page) {
    setTitle("Messages", "Formulaire de contact du site");
    let msgs = await api("/messages"); let filter = "all";
    const draw = () => {
      const list = msgs.filter(m => filter === "all" || !m.read);
      page.innerHTML = `<div class="toolbar"><div class="tabs"><button class="${filter === "all" ? "on" : ""}" data-mf="all">Tous<span class="n">${msgs.length}</span></button><button class="${filter === "unread" ? "on" : ""}" data-mf="unread">Non lus<span class="n">${msgs.filter(m => !m.read).length}</span></button></div></div>
        <div class="card">${list.length ? list.map(m => `<article class="msg ${m.read ? "" : "unread"}" data-mid="${esc(m.id)}">
          <div class="h"><b>${esc(m.name)}</b>${m.read ? "" : pill("Nouveau", "orange")}<span class="muted">${dtt(m._created)}</span><span class="tag">${esc(m.subject || "Sans sujet")}</span><div style="flex:1"></div>
            ${m.phone ? `<a class="btn sm wa" href="https://wa.me/${phoneIntl(m.phone)}?text=${encodeURIComponent(`Bonjour ${m.name} 🤍 Merci pour votre message à Fanni's Store !`)}" target="_blank">${I.wa}WhatsApp</a>` : ""}
            ${m.email ? `<a class="btn sm ghost" href="mailto:${esc(m.email)}?subject=${encodeURIComponent("Re : " + (m.subject || "Votre message à Fanni's Store"))}">${I.mail}Email</a>` : ""}
            <button class="icon-btn" data-mread="${esc(m.id)}" title="${m.read ? "Marquer comme non lu" : "Marquer comme lu"}">${m.read ? I.eyeOff : I.check}</button><button class="icon-btn red" data-mdel="${esc(m.id)}" title="Supprimer">${I.trash}</button></div>
          <div class="muted" style="font-size:12.5px">${[m.email, m.phone].filter(Boolean).map(esc).join(" · ")}${m.via ? ` · préfère être recontacté(e) par ${m.via === "email" ? "email" : "WhatsApp"}` : ""}</div>
          <p>${esc(m.message)}</p></article>`).join("") : `<div class="empty"><div class="big">💌</div><h3>Aucun message</h3><p>Les messages envoyés depuis la page Contact apparaîtront ici.</p></div>`}</div>`;
    };
    page.onclick = async e => {
      const f = e.target.closest("[data-mf]"); if (f) { filter = f.dataset.mf; return draw(); }
      const r = e.target.closest("[data-mread]"), d = e.target.closest("[data-mdel]");
      try {
        if (r) { const m = msgs.find(x => x.id === r.dataset.mread); Object.assign(m, await api("/messages/" + m.id, { method: "PUT", body: { read: !m.read } })); refreshCounts(); draw(); }
        if (d) { if (!await confirmBox({ title: "Supprimer ce message ?" })) return; await api("/messages/" + d.dataset.mdel, { method: "DELETE" }); msgs = msgs.filter(x => x.id !== d.dataset.mdel); refreshCounts(); draw(); toast("Message supprimé"); }
      } catch (ex) { fail(ex); }
    };
    draw();
  }

  /* ========================================================================
     NEWSLETTER
     ======================================================================== */
  async function pageNewsletter(page) {
    setTitle("Newsletter", "Les personnes inscrites à votre lettre", `<button class="btn ghost" id="ncopy">${I.copy}<span class="hide-sm">Copier les emails</span></button><button class="btn ghost" id="ncsv">${I.download}<span class="hide-sm">Exporter (CSV)</span></button>`);
    let subs = await api("/subscribers"); let q = "";
    const draw = () => {
      const list = subs.filter(s => !q || s.email.includes(q.toLowerCase()));
      $("#ntb").innerHTML = list.length ? list.map(s => `<tr><td><b>${esc(s.email)}</b></td><td class="hide-sm">${esc(s.source || "site")}</td><td>${dt(s._created)}</td><td class="act"><a class="icon-btn" href="mailto:${esc(s.email)}" title="Écrire">${I.mail}</a><button class="icon-btn red" data-sdel="${esc(s.id)}" title="Retirer">${I.trash}</button></td></tr>`).join("")
        : `<tr><td colspan="4"><div class="empty"><div class="big">📧</div><h3>Aucun abonné pour l'instant</h3><p>Les inscriptions du site apparaîtront ici.</p></div></td></tr>`;
    };
    page.innerHTML = `<div class="toolbar"><div class="search">${I.search}<input class="in" id="nq" placeholder="Rechercher un email…" aria-label="Rechercher"></div><div class="grow"></div><span class="muted">${subs.length} abonné(s)</span></div>
      <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Email</th><th class="hide-sm">Inscrit depuis</th><th>Date</th><th class="act"></th></tr></thead><tbody id="ntb"></tbody></table></div></div>
      <p class="muted" style="font-size:12.5px;margin-top:12px">💡 Pour envoyer une lettre, exportez la liste et importez-la dans Brevo ou Mailchimp (gratuits jusqu'à plusieurs centaines d'abonnés).</p>`;
    $("#nq").oninput = e => { q = e.target.value; draw(); };
    $("#ncsv").onclick = () => csv(`newsletter-${new Date().toISOString().slice(0, 10)}.csv`, subs.map(s => ({ Email: s.email, Source: s.source || "site", Date: dt(s._created) })));
    $("#ncopy").onclick = async () => { try { await navigator.clipboard.writeText(subs.map(s => s.email).join(", ")); toast(`${subs.length} email(s) copié(s)`); } catch { toast("Copie impossible.", "err"); } };
    page.onclick = async e => { const d = e.target.closest("[data-sdel]"); if (!d) return; if (!await confirmBox({ title: "Retirer cet abonné ?" })) return; try { await api("/subscribers/" + d.dataset.sdel, { method: "DELETE" }); subs = subs.filter(x => x.id !== d.dataset.sdel); draw(); toast("Abonné retiré"); } catch (ex) { fail(ex); } };
    draw();
  }

  /* ========================================================================
     PARAMÈTRES
     ======================================================================== */
  async function pageSettings(page) {
    setTitle("Paramètres", "Coordonnées, livraison et listes de la boutique");
    S.settings = await api("/settings");
    const c = S.settings.config;
    const inp = (k, label, opts = {}) => `<div class="field"><label for="c-${k}">${label}</label>${opts.suffix ? `<div class="prefix">` : ""}<input class="in" id="c-${k}" data-c="${k}" ${opts.type ? `type="${opts.type}"` : ""} ${opts.step ? `step="${opts.step}" min="0"` : ""} value="${esc(c[k] ?? "")}" placeholder="${esc(opts.ph || "")}">${opts.suffix ? `<span>${esc(opts.suffix)}</span></div>` : ""}${opts.hint ? `<span class="hint">${opts.hint}</span>` : ""}</div>`;
    const LISTS = [
      ["occasions", "Occasions", "Catégories de la boutique et de la page d'accueil", [["fr", "Nom (FR)"], ["ar", "Nom (AR)", "rtl"], ["icon", "Icône", "select"]]],
      ["recipients", "Destinataires", "Filtres « Pour qui ? »", [["fr", "Nom (FR)"], ["ar", "Nom (AR)", "rtl"]]],
      ["ribbons", "Couleurs de ruban", "Proposées sur les pages produits et dans « Crée ta box »", [["fr", "Nom (FR)"], ["ar", "Nom (AR)", "rtl"], ["color", "Couleur", "color"]]],
      ["cardStyles", "Cartes message", "Types de cartes et leur supplément", [["fr", "Nom (FR)"], ["ar", "Nom (AR)", "rtl"], ["price", "Prix", "money"]]]
    ];
    const ICONS = { cake: "🎂 Gâteau", heart: "💗 Cœur", rings: "💍 Alliances", baby: "👶 Bébé", flower: "💐 Fleur", thanks: "💌 Merci", sparkle: "✨ Étincelle", gift: "🎁 Cadeau", star: "⭐ Étoile" };
    page.innerHTML = `<div class="grid" style="max-width:980px">
      <section class="card"><div class="card-h"><h2>Boutique & contact</h2></div><div class="card-b grid cols-2">
        ${inp("storeName", "Nom de la boutique")}${inp("email", "Email de contact", { type: "email" })}
        ${inp("whatsapp", "Numéro WhatsApp *", { ph: "21656235927", hint: "Avec l'indicatif du pays, sans « + » ni espaces. Ex. : 21656235927" })}${inp("instagramHandle", "Nom du compte Instagram", { ph: "@fannis.store" })}
        ${inp("instagram", "Lien Instagram", { ph: "https://www.instagram.com/…" })}${inp("facebook", "Lien Facebook", { ph: "https://www.facebook.com/…" })}
        ${inp("tiktok", "Lien TikTok", { ph: "https://www.tiktok.com/@…" })}
      </div></section>
      <section class="card"><div class="card-h"><h2>Livraison & paiement</h2></div><div class="card-b grid cols-2">
        ${inp("currency", "Devise affichée", { ph: "DT" })}${inp("shippingFee", "Frais de livraison", { type: "number", step: "0.5", suffix: c.currency })}
        ${inp("freeShippingFrom", "Livraison offerte dès", { type: "number", step: "1", suffix: c.currency, hint: "Mettez 0 pour ne jamais l'offrir automatiquement." })}${inp("photoOptionPrice", "Supplément photo imprimée", { type: "number", step: "0.5", suffix: c.currency })}
        <div style="grid-column:1/-1">${inp("onlinePaymentUrl", "Lien de paiement en ligne (facultatif)", { ph: "https://…", hint: "Lien de votre passerelle (Konnect, Flouci, Stripe…). Vide : le lien est envoyé à la cliente par WhatsApp." })}</div>
      </div><div class="card-h" style="border-top:1px solid var(--line2);border-bottom:0;justify-content:flex-end"><button class="btn primary" id="csave">${I.check}Enregistrer</button></div></section>
      ${LISTS.map(([key, title, sub, fields]) => `<section class="card" data-list="${key}"><div class="card-h"><div><h2>${title}</h2><div class="muted" style="font-size:12.5px">${sub}</div></div><div class="grow"></div><button class="btn ghost sm" data-ladd="${key}">${I.plus}Ajouter</button><button class="btn primary sm" data-lsave="${key}">${I.check}Enregistrer</button></div><div class="card-b"><div class="list-ed" id="l-${key}"></div></div></section>`).join("")}
      <section class="card"><div class="card-h"><h2>Sécurité & données</h2></div><div class="card-b stack">
        <div class="alert info" style="margin:0">${I.alert}<span>Votre email et votre mot de passe d'administration sont définis dans les réglages du serveur (Render › votre service › <b>Environment</b> : ADMIN_EMAIL et ADMIN_PASSWORD). Pour changer de mot de passe, modifiez-le là-bas : le site redémarre tout seul.</span></div>
        <div class="row"><span class="muted">Stockage des données :</span>${S.me.storage === "postgres" ? pill("Base PostgreSQL · durable", "green") : pill("Fichier local · mode test", "yellow")}</div>
      </div></section></div>`;

    const lists = Object.fromEntries(LISTS.map(([k]) => [k, clone(S.settings[k] || [])]));
    const drawList = key => {
      const [, , , fields] = LISTS.find(l => l[0] === key);
      $("#l-" + key).innerHTML = lists[key].map((it, i) => `<div class="li">${fields.map(([f, l, t]) => t === "select" ? `<select class="in" data-lf="${f}" data-li="${i}" aria-label="${l}" style="max-width:170px">${Object.entries(ICONS).map(([k, v]) => `<option value="${k}" ${it[f] === k ? "selected" : ""}>${v}</option>`).join("")}</select>`
        : t === "color" ? `<input type="color" class="in" data-lf="${f}" data-li="${i}" value="${esc(it[f] || "#f47920")}" aria-label="${l}" style="width:52px;padding:3px">`
          : `<input class="in" data-lf="${f}" data-li="${i}" ${t === "rtl" ? 'dir="rtl"' : ""} ${t === "money" ? 'type="number" min="0" step="0.5" style="max-width:110px"' : ""} value="${esc(it[f] ?? "")}" placeholder="${l}" aria-label="${l}">`).join("")}
        <button class="icon-btn" data-lup="${key}:${i}" ${i ? "" : "disabled"} aria-label="Monter">${I.up}</button><button class="icon-btn red" data-ldel="${key}:${i}" aria-label="Supprimer">${I.trash}</button></div>`).join("");
    };
    LISTS.forEach(([k]) => drawList(k));
    page.addEventListener("input", e => { const t = e.target; if (t.dataset.lf) { const key = t.closest("[data-list]").dataset.list; lists[key][+t.dataset.li][t.dataset.lf] = t.type === "number" ? +t.value : t.value; } });
    page.addEventListener("change", e => { const t = e.target; if (t.dataset.lf && t.tagName === "SELECT") { const key = t.closest("[data-list]").dataset.list; lists[key][+t.dataset.li][t.dataset.lf] = t.value; } });
    page.addEventListener("click", async e => {
      const add = e.target.closest("[data-ladd]"), up = e.target.closest("[data-lup]"), del = e.target.closest("[data-ldel]"), sv = e.target.closest("[data-lsave]");
      if (add) { const k = add.dataset.ladd; lists[k].push({ fr: "", ar: "", ...(k === "ribbons" ? { color: "#f47920" } : {}), ...(k === "cardStyles" ? { price: 0 } : {}), ...(k === "occasions" ? { icon: "gift" } : {}) }); drawList(k); $$(`#l-${k} .in`).slice(-3)[0]?.focus(); }
      if (up) { const [k, i] = up.dataset.lup.split(":"); const L = lists[k]; [L[i - 1], L[i]] = [L[i], L[i - 1]]; drawList(k); }
      if (del) { const [k, i] = del.dataset.ldel.split(":"); if (k === "occasions" && !await confirmBox({ title: "Retirer cette occasion ?", text: "Les produits qui l'utilisent ne seront plus classés dedans." })) return; lists[k].splice(+i, 1); drawList(k); }
      if (sv) { const k = sv.dataset.lsave; try { lists[k] = await api("/settings/" + k, { method: "PUT", body: lists[k] }); S.settings[k] = clone(lists[k]); drawList(k); toast("Liste enregistrée"); } catch (ex) { fail(ex); } }
    });
    $("#csave").onclick = async () => {
      const body = {}; $$("[data-c]").forEach(i => (body[i.dataset.c] = i.value));
      try { S.settings.config = await api("/settings/config", { method: "PUT", body }); toast("Paramètres enregistrés"); } catch (e) { fail(e); }
    };
  }

  /* ---------- démarrage ---------- */
  async function boot() {
    try {
      const me = await fetch("/api/admin/me", { credentials: "same-origin" }).then(r => r.json());
      if (!me.authenticated) return renderLogin(null, me);
      S.me = me;
      [S.schemas, S.settings] = await Promise.all([api("/schemas"), api("/settings")]);
      renderShell(); route();
    } catch (e) { app.innerHTML = `<div class="login"><div class="login-card"><div class="alert err">${I.alert}<span>Impossible de joindre le serveur : ${esc(e.message)}</span></div><button class="btn primary" onclick="location.reload()">Réessayer</button></div></div>`; }
  }
  boot();
})();

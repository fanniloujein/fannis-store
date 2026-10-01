/* ==========================================================================
   Fanni's Store — script commun à toutes les pages
   (langue FR/AR, en-tête, pied de page, panier, animations, WhatsApp)
   ========================================================================== */
(function () {
  const F = window.FANNI;
  const C = F.config;
  document.documentElement.classList.remove("no-js");

  /* ---------- Langue ---------- */
  let lang = "fr";
  try { lang = localStorage.getItem("fanni_lang") || "fr"; } catch (e) {}
  const qLang = new URLSearchParams(location.search).get("lang");
  if (qLang === "ar" || qLang === "fr") {
    lang = qLang;
    try { localStorage.setItem("fanni_lang", lang); } catch (e) {}
  }
  F.lang = lang === "ar" ? "ar" : "fr";
  const AR = F.AR || {};
  F.t = (key, fr) => (F.lang === "ar" && AR[key] ? AR[key] : fr);
  F.L = obj => (obj ? obj[F.lang] || obj.fr : ""); // champ bilingue {fr, ar}

  if (F.lang === "ar") {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    const fl = document.createElement("link");
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500&display=swap";
    document.head.appendChild(fl);
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const v = AR[el.dataset.i18n];
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      const v = AR[el.dataset.i18nPh];
      if (v) el.placeholder = v;
    });
    const tk = document.body.dataset.titleKey;
    if (tk && AR[tk]) document.title = AR[tk] + " · Fanni's Store";
  }
  F.setLang = l => {
    try { localStorage.setItem("fanni_lang", l); } catch (e) {}
    const u = new URL(location.href); u.searchParams.delete("lang");
    location.href = u.toString();
  };

  /* ---------- Utilitaires ---------- */
  F.money = n => {
    const v = Math.round(n * 100) / 100;
    const s = v % 1 ? v.toFixed(2).replace(".", ",") : String(v);
    const cur = F.lang === "ar" && C.currency === "DT" ? "د.ت" : C.currency;
    return `${s} ${cur}`;
  };
  F.wa = text => `https://wa.me/${C.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  F.qs = (s, r = document) => r.querySelector(s);
  F.qsa = (s, r = document) => [...r.querySelectorAll(s)];
  F.getProduct = id => F.products.find(p => p.id === id);
  F.occasion = id => F.occasions.find(o => o.id === id);
  F.stars = r => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));

  /* ---------- Toasts ---------- */
  let toastWrap;
  F.toast = (msg, link) => {
    if (!toastWrap) { toastWrap = document.createElement("div"); toastWrap.className = "toast-wrap"; toastWrap.setAttribute("role", "status"); toastWrap.setAttribute("aria-live", "polite"); document.body.appendChild(toastWrap); }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span>${msg}</span>${link ? `<a href="${link.href}">${link.label}</a>` : ""}`;
    toastWrap.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 3600);
  };

  /* ---------- Petites étincelles au clic ---------- */
  F.burst = (x, y, n = 10) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#f2a900", "#ffd766", "#f47920", "#62b88b"];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "burst-star";
      s.innerHTML = F.starSvg;
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.5, d = 40 + Math.random() * 50;
      s.style.cssText = `left:${x - 7}px;top:${y - 7}px;color:${colors[i % 4]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  };

  /* ---------- Panier (stocké localement) ---------- */
  const KEY = "fanni_cart";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  let items = load();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("cart:change"));
    updateBadge(true);
  };
  F.cart = {
    get items() { return items; },
    add(item) {
      // même produit + mêmes options = même ligne
      const sig = JSON.stringify([item.id, item.options || {}]);
      const found = items.find(i => JSON.stringify([i.id, i.options || {}]) === sig && !item.unique);
      if (found) found.qty += item.qty || 1;
      else items.push({ key: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), qty: 1, ...item, qty: item.qty || 1 });
      save();
    },
    setQty(key, q) { const it = items.find(i => i.key === key); if (!it) return; it.qty = Math.max(1, Math.min(20, q)); save(); },
    remove(key) { items = items.filter(i => i.key !== key); save(); },
    clear() { items = []; save(); },
    count() { return items.reduce((s, i) => s + i.qty, 0); },
    subtotal() { return items.reduce((s, i) => s + i.price * i.qty, 0); },
    shipping(sub) { return sub === 0 || sub >= C.freeShippingFrom ? 0 : C.shippingFee; }
  };
  window.addEventListener("storage", e => { if (e.key === KEY) { items = load(); updateBadge(); document.dispatchEvent(new CustomEvent("cart:change")); } });

  function updateBadge(bump) {
    const b = F.qs(".cart-count");
    if (!b) return;
    const n = F.cart.count();
    b.textContent = n;
    b.classList.toggle("has-items", n > 0);
    b.closest("a").setAttribute("aria-label", F.t("cart_aria", "Panier") + ` (${n})`);
    if (bump) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  }

  /* ---------- En-tête ---------- */
  const page = document.body.dataset.page || "";
  const nav = [
    ["index.html", "home", F.t("nav_home", "Accueil")],
    ["boutique.html", "shop", F.t("nav_shop", "Boutique")],
    ["creer-ma-box.html", "builder", F.t("nav_builder", "Crée ta box")],
    ["a-propos.html", "about", F.t("nav_about", "Notre histoire")],
    ["faq.html", "faq", F.t("nav_faq", "FAQ")],
    ["contact.html", "contact", F.t("nav_contact", "Contact")]
  ];
  const header = F.qs("#site-header");
  if (header) {
    header.outerHTML = `
      <a class="skip-link" href="#main">${F.t("skip", "Aller au contenu")}</a>
      <div class="announce">${F.t("announce", "✨ Livraison offerte dès <b>{free}</b> · Chaque box est préparée à la main, avec amour 🤍").replace("{free}", F.money(C.freeShippingFrom))}</div>
      <header class="site-header">
        <div class="container header-inner">
          <button class="icon-btn burger" aria-label="${F.t("menu_open", "Ouvrir le menu")}" aria-expanded="false" aria-controls="main-nav">${F.icons.menu}</button>
          <a class="logo" href="index.html" aria-label="Fanni's Store — ${F.t("nav_home", "Accueil")}"><img src="assets/img/logo-texte.svg" alt="Fanni's Store" width="110" height="64"></a>
          <nav class="main-nav" id="main-nav" aria-label="${F.t("nav_label", "Navigation principale")}">
            <button class="icon-btn nav-close" aria-label="${F.t("menu_close", "Fermer le menu")}">${F.icons.close}</button>
            <ul>${nav.map(([h, k, l]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}</ul>
            <div class="nav-extra">
              <a class="btn btn-primary" href="creer-ma-box.html">${F.t("cta_create", "Créer ma box")} 🎁</a>
              <a class="btn btn-outline" href="${F.wa(F.t("wa_hello", "Bonjour Fanni's Store 🤍 "))}" target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </nav>
          <div class="header-actions">
            <button class="icon-btn lang-btn" type="button" data-lang="${F.lang === "ar" ? "fr" : "ar"}" aria-label="${F.lang === "ar" ? "Passer en français" : "التبديل إلى العربية"}">${F.lang === "ar" ? "FR" : "عربي"}</button>
            <a class="icon-btn" href="panier.html" aria-label="${F.t("cart_aria", "Panier")}">${F.icons.bag}<span class="cart-count">0</span></a>
          </div>
        </div>
      </header>
      <div class="nav-overlay"></div>`;
    const menu = F.qs("#main-nav"), burger = F.qs(".burger"), overlay = F.qs(".nav-overlay");
    const toggle = open => {
      menu.classList.toggle("is-open", open); overlay.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : "";
      if (open) F.qs(".nav-close").focus();
    };
    burger.addEventListener("click", () => toggle(true));
    F.qs(".nav-close").addEventListener("click", () => { toggle(false); burger.focus(); });
    overlay.addEventListener("click", () => toggle(false));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("is-open")) toggle(false); });
    F.qs(".lang-btn").addEventListener("click", e => F.setLang(e.currentTarget.dataset.lang));
    const sh = F.qs(".site-header");
    const onScroll = () => sh.classList.toggle("is-scrolled", scrollY > 10);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    updateBadge();
  }

  /* ---------- Pied de page ---------- */
  const footer = F.qs("#site-footer");
  if (footer) {
    const socials = `
      <a href="${F.wa()}" target="_blank" rel="noopener" aria-label="WhatsApp">${F.icons.whatsapp}</a>
      <a href="${C.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${F.icons.instagram}</a>
      <a href="${C.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${F.icons.facebook}</a>
      <a href="${C.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${F.icons.tiktok}</a>`;
    footer.outerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <img src="assets/img/logo-texte.svg" alt="Fanni's Store" width="200" height="116" loading="lazy">
            <p>${F.t("footer_about", "Des cadeaux personnalisés, préparés à la main, qui transforment vos émotions en souvenirs. Parce qu'un cadeau doit raconter une histoire 🤍")}</p>
            <div class="socials">${socials}</div>
          </div>
          <div>
            <h4>${F.t("footer_shop", "Boutique")}</h4>
            <ul>${F.occasions.map(o => `<li><a href="${o.id === "sur-mesure" ? "creer-ma-box.html" : "boutique.html?occasion=" + o.id}">${F.L(o)}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h4>${F.t("footer_house", "La maison")}</h4>
            <ul>
              <li><a href="a-propos.html">${F.t("nav_about", "Notre histoire")}</a></li>
              <li><a href="creer-ma-box.html">${F.t("nav_builder", "Crée ta box")}</a></li>
              <li><a href="faq.html">${F.t("footer_faq", "Questions fréquentes")}</a></li>
              <li><a href="faq.html#livraison">${F.t("footer_delivery", "Livraison & délais")}</a></li>
              <li><a href="contact.html">${F.t("nav_contact", "Contact")}</a></li>
            </ul>
          </div>
          <div>
            <h4>${F.t("footer_news", "Lettre douce")}</h4>
            <p style="color:var(--muted);font-size:.88rem">${F.t("footer_news_txt", "Nouveautés, éditions limitées et petites attentions, une fois par mois.")}</p>
            <form class="inline-form js-newsletter" style="max-width:none" novalidate>
              <label class="sr-only" for="nl-foot">Email</label>
              <input id="nl-foot" type="email" required placeholder="${F.t("email_ph", "Votre adresse email")}" autocomplete="email">
              <button class="btn btn-sm" type="submit" aria-label="${F.t("subscribe", "S'inscrire")}">${F.icons.arrow.replace("<svg", '<svg class="arrow" width="16" height="16"')}</button>
            </form>
            <div class="pay-icons" aria-label="${F.t("pay_methods", "Moyens de paiement")}"><span>${F.t("pay_cod_short", "Paiement à la livraison")}</span><span>VISA</span><span>Mastercard</span><span>e-Dinar</span></div>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© ${new Date().getFullYear()} Fanni's Store · ${F.t("footer_made", "Fait main avec amour")} 🤍</span>
          <nav aria-label="${F.t("legal", "Informations légales")}">
            <a href="mentions-legales.html">${F.t("legal_notice", "Mentions légales")}</a>
            <a href="mentions-legales.html#cgv">${F.t("terms", "CGV")}</a>
            <a href="mentions-legales.html#confidentialite">${F.t("privacy", "Confidentialité")}</a>
          </nav>
        </div>
      </footer>
      <a class="wa-float" href="${F.wa(F.t("wa_hello", "Bonjour Fanni's Store 🤍 "))}" target="_blank" rel="noopener" aria-label="${F.t("wa_aria", "Commander ou poser une question sur WhatsApp")}">
        ${F.icons.whatsapp}<span class="wa-bubble">${F.t("wa_bubble", "Une question ? Écrivez-nous 🤍")}</span>
      </a>`;
    // petite bulle d'invitation une seule fois
    setTimeout(() => {
      try { if (sessionStorage.getItem("fanni_wa")) return; sessionStorage.setItem("fanni_wa", 1); } catch (e) {}
      const b = F.qs(".wa-bubble"); if (!b) return;
      b.classList.add("show"); setTimeout(() => b.classList.remove("show"), 4500);
    }, 6000);
  }

  /* ---------- Newsletter ---------- */
  document.addEventListener("submit", e => {
    const f = e.target.closest(".js-newsletter");
    if (!f) return;
    e.preventDefault();
    const input = f.querySelector("input[type=email]");
    if (!input.checkValidity() || !input.value) { input.classList.add("is-invalid"); input.focus(); F.toast(F.t("email_invalid", "Merci d'indiquer une adresse email valide ✉️")); return; }
    input.classList.remove("is-invalid");
    try {
      const list = JSON.parse(localStorage.getItem("fanni_newsletter") || "[]");
      list.push({ email: input.value, date: new Date().toISOString() });
      localStorage.setItem("fanni_newsletter", JSON.stringify(list));
    } catch (err) {}
    input.value = "";
    const r = f.querySelector("button").getBoundingClientRect();
    F.burst(r.left + r.width / 2, r.top + r.height / 2, 14);
    F.toast(F.t("newsletter_ok", "Bienvenue dans la famille Fanni's Store ✨ Un petit cadeau vous attend dans votre boîte mail."));
  });

  /* ---------- Étincelles sur les boutons « ajouter » ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-burst]");
    if (b) { const r = b.getBoundingClientRect(); F.burst(r.left + r.width / 2, r.top + r.height / 2); }
  });

  /* ---------- Ajout rapide au panier ---------- */
  F.quickAdd = id => {
    const p = F.getProduct(id);
    if (!p) return;
    if (p.custom) { location.href = "creer-ma-box.html"; return; }
    F.cart.add({ id: p.id, name: p.name, price: p.price, art: p.art, image: p.images && p.images[0], options: {} });
    F.toast(`🎁 ${F.L(p.name)} ${F.t("added", "ajoutée au panier")}`, { href: "panier.html", label: F.t("see_cart", "Voir le panier") });
  };
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-quick-add]");
    if (b) { e.preventDefault(); F.quickAdd(b.dataset.quickAdd); }
  });

  /* ---------- Carte produit ---------- */
  F.productCard = (p, i = 0) => {
    const occ = F.occasion(p.occasion[0]);
    const badge = p.badge === "best" ? `<span class="badge">${F.t("badge_best", "Best-seller")}</span>`
      : p.badge === "new" ? `<span class="badge b-new">${F.t("badge_new", "Nouveau")}</span>`
      : p.badge === "promo" ? `<span class="badge b-promo">${F.t("badge_promo", "Édition limitée")}</span>` : "";
    const url = p.custom ? "creer-ma-box.html" : `produit.html?id=${p.id}`;
    return `<article class="product-card reveal" data-delay="${i % 4}">
      <a class="thumb" href="${url}" aria-label="${F.esc(F.L(p.name))}">${badge}${F.art.product(p, 0, F.lang)}</a>
      <div class="quick-add"><button class="btn btn-light btn-sm btn-block" data-quick-add="${p.id}" data-burst>${p.custom ? F.t("compose", "Composer") + " ✨" : F.t("quick_add", "Ajouter au panier")}</button></div>
      <div class="info">
        <span class="occ">${occ ? F.L(occ) : ""}</span>
        <h3><a href="${url}">${F.L(p.name)}</a></h3>
        <p class="short">${F.L(p.short)}</p>
        <div class="row">
          <span class="price">${p.priceFrom ? F.t("from", "dès") + " " : ""}${F.money(p.price)}${p.oldPrice ? `<del>${F.money(p.oldPrice)}</del>` : ""}</span>
          <span class="rating" aria-label="${p.rating}/5">${F.stars(p.rating)}<small>(${p.reviews})</small></span>
        </div>
      </div>
    </article>`;
  };

  /* ---------- Apparition au défilement ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 })
    : null;
  F.observe = (root = document) => F.qsa(".reveal:not(.is-visible)", root).forEach(el => (io ? io.observe(el) : el.classList.add("is-visible")));

  /* ---------- Étincelles décoratives ---------- */
  F.qsa("[data-sparkles]").forEach(host => {
    const n = +host.dataset.sparkles || 6;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "sparkle " + ["", "sm", "lg", "sm s-orange", "s-rose", "sm"][i % 6];
      s.innerHTML = F.starSvg;
      s.style.cssText = `left:${5 + Math.random() * 90}%;top:${5 + Math.random() * 85}%;animation-delay:${(Math.random() * 3).toFixed(2)}s`;
      s.setAttribute("aria-hidden", "true");
      host.appendChild(s);
    }
  });

  /* ---------- Ornement ruban ---------- */
  F.qsa("[data-ribbon]").forEach(el => el.insertAdjacentHTML("afterend", F.ribbonSvg));

  document.addEventListener("DOMContentLoaded", () => F.observe());
  if (document.readyState !== "loading") F.observe();
})();

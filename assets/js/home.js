/* Fanni's Store — page d'accueil */
(function () {
  const F = window.FANNI, C = F.config;

  F.qs("#hero-art").innerHTML = F.art.hero();
  F.qs("#story-art-1").innerHTML = F.art.gift({ v: "open", b: "#ecdccd", l: "#f3e7da", r: "#c9a25a", bg: "#f3e7da", deco: "heart" }, { seed: "story1", label: F.t("story_img", "Box ouverte avec bougie, roses et carte écrite à la main") });
  F.qs("#story-art-2").innerHTML = F.art.gift({ v: "box", b: "#cfe9dc", l: "#dcf1e5", r: "#e8b9b3", bg: "#eef8f2", deco: "star" }, { seed: "story2", view: 1, label: F.t("story_img2", "Nœud de ruban en soie") });

  /* catégories */
  const counts = id => F.products.filter(p => p.occasion.includes(id)).length;
  F.qs("#cat-grid").innerHTML = F.occasions.map((o, i) => {
    const special = o.id === "sur-mesure";
    const href = special ? "creer-ma-box.html" : `boutique.html?occasion=${o.id}`;
    return `<a class="cat-card reveal${special ? " is-special" : ""}" data-delay="${i % 4}" href="${href}">
      <span class="cat-icon">${F.icons[o.icon] || F.icons.gift}</span>
      <h3>${F.L(o)}</h3>
      <span>${special ? F.t("cat_custom", "À composer") + " ✨" : counts(o.id) + " " + F.t("cat_boxes", "box")}</span>
    </a>`;
  }).join("");

  /* carrousel best-sellers */
  const track = F.qs("#best-track");
  track.innerHTML = F.products.filter(p => p.bestseller).map(F.productCard).join("");
  F.qsa(".carousel-nav button").forEach(b => b.addEventListener("click", () => {
    const card = track.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 24 : 300;
    const dir = +b.dataset.dir * (document.dir === "rtl" ? -1 : 1);
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }));
  // défilement automatique doux, en pause au survol / focus
  let paused = false;
  ["mouseenter", "focusin", "touchstart"].forEach(ev => track.addEventListener(ev, () => (paused = true), { passive: true }));
  ["mouseleave", "focusout"].forEach(ev => track.addEventListener(ev, () => (paused = false)));
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      if (paused || document.hidden) return;
      const rtl = document.dir === "rtl";
      const max = track.scrollWidth - track.clientWidth;
      const pos = Math.abs(track.scrollLeft);
      const card = track.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 24 : 300;
      if (pos >= max - 5) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: rtl ? -step : step, behavior: "smooth" });
    }, 4500);
  }

  /* avis clients avec photo */
  const palettes = ["#fbeeea", "#eef8f2", "#f7eee6", "#f6f0e6", "#f5f0f6", "#efe2d2"];
  F.qs("#reviews-grid").innerHTML = F.reviews.map((r, i) => {
    const p = F.getProduct(r.product);
    const art = p ? { ...p.art, bg: palettes[i % palettes.length] } : { v: "box", b: "#f4d6d1", r: "#c9a25a", bg: palettes[i] };
    return `<article class="review reveal" data-delay="${i % 3}">
      <div class="photo">${p && p.images && p.images[0] ? `<img src="${p.images[0]}" alt="" loading="lazy">` : F.art.gift(art, { seed: "rev" + i, view: i % 2 ? 3 : 0, label: F.t("rev_photo", "Photo envoyée par") + " " + r.name })}</div>
      <div class="body">
        <span class="rating" aria-label="${r.rating}/5">${F.stars(r.rating)}</span>
        <blockquote>« ${F.L(r)} »</blockquote>
        <div class="who">
          <span class="avatar" aria-hidden="true">${r.name[0]}</span>
          <div><b>${r.name}</b><small>${r.city}${p ? " · " + F.L(p.name) : ""}</small></div>
        </div>
        <span class="verified">✓ ${F.t("verified", "Achat vérifié")}</span>
      </div>
    </article>`;
  }).join("");

  /* galerie Instagram */
  const ig = [
    { v: "round", b: "#f4d6d1", l: "#f8e3df", r: "#c9a25a", bg: "#fbeeea", deco: "rose" },
    { v: "open", b: "#dcefe5", l: "#e9f6ef", r: "#e8b9b3", bg: "#eef8f2", deco: "star" },
    { v: "box", b: "#c9a37c", l: "#d6b48f", r: "#fbf6ec", bg: "#efe2d2", deco: "heart" },
    { v: "box", b: "#f5eee2", l: "#fbf6ec", r: "#c9a25a", bg: "#f6f0e6", deco: "rings" },
    { v: "open", b: "#e7b3ae", l: "#f0c8c3", r: "#8e3b46", bg: "#f8e4e1", deco: "heart" },
    { v: "round", b: "#cfe9dc", l: "#dcf1e5", r: "#c9a25a", bg: "#eef8f2", deco: "flower" }
  ];
  F.qs("#insta-grid").innerHTML = ig.map((a, i) => `<a class="insta-item reveal" data-delay="${i % 4}" href="${C.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${C.instagramHandle} — ${i + 1}">
    ${F.art.gift(a, { seed: "ig" + i, view: [0, 1, 3, 1, 0, 3][i], label: "" })}<span class="ico">${F.icons.instagram}</span></a>`).join("");
  const h = F.qs("#ig-handle"); h.href = C.instagram; h.textContent = C.instagramHandle;

  F.qs("#wa-cta").href = F.wa(F.t("wa_idea", "Bonjour Fanni's Store 🤍 J'ai une idée de cadeau et j'aimerais votre aide : "));

  F.observe();
})();

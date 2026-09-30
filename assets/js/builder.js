/* Fanni's Store — configurateur « Crée ta box sur mesure » */
(function () {
  const F = window.FANNI, B = F.builder;
  const DRAFT = "fanni_builder";
  let s = { box: "classique", items: [], card: "classique", to: "", from: "", message: "", wrap: "soleil", ribbon: "orange", extras: [], step: 0, cat: "all" };
  try { s = { ...s, ...JSON.parse(localStorage.getItem(DRAFT) || "{}") }; } catch (e) {}
  const save = () => { try { localStorage.setItem(DRAFT, JSON.stringify(s)); } catch (e) {} };

  const box = () => B.boxes.find(b => b.id === s.box);
  const wrap = () => B.wrappings.find(w => w.id === s.wrap);
  const ribbon = () => F.ribbons.find(r => r.id === s.ribbon) || F.ribbons[0];
  const card = () => F.cardStyles.find(c => c.id === s.card);
  const item = id => B.items.find(i => i.id === id);
  const total = () => box().price + s.items.reduce((t, id) => t + item(id).price, 0) + card().price + wrap().price +
    s.extras.reduce((t, id) => t + B.extras.find(e => e.id === id).price, 0);

  /* ---- étape 1 : box ---- */
  F.qs("#box-choices").innerHTML = B.boxes.map(b => `<div class="box-choice">
    <input type="radio" name="box" id="box-${b.id}" value="${b.id}" ${s.box === b.id ? "checked" : ""}>
    <label for="box-${b.id}">
      ${F.art.gift({ v: "box", b: "#ff8a3d", l: "#ffa464", r: "#ffc933", bg: "#fff1dc", deco: "sparkle" }, { seed: "bx" + b.id, view: b.id === "prestige" ? 3 : 0, label: "" })}
      <span><b>${F.L(b)}</b><br><small>${F.lang === "ar" ? b.descAr : b.descFr}</small><br><span class="price">${F.money(b.price)}</span></span>
    </label></div>`).join("");

  /* ---- étape 2 : articles ---- */
  F.qs("#item-cats").innerHTML = [{ id: "all", fr: "Tout", ar: "الكل" }, ...B.categories].map(c => `<button type="button" class="chip${s.cat === c.id ? " is-active" : ""}" data-cat="${c.id}">${F.L(c)}</button>`).join("");
  function renderItems() {
    const full = s.items.length >= box().capacity;
    F.qs("#items-grid").innerHTML = B.items.filter(i => s.cat === "all" || i.cat === s.cat).map(i => {
      const sel = s.items.includes(i.id);
      return `<div class="item-card${sel ? " is-selected" : ""}">
        <span class="emoji" aria-hidden="true">${i.emoji}</span>
        <b>${F.L(i)}</b>
        ${i.personal ? `<small>✎ ${F.t("personalisable", "Personnalisable")}</small>` : ""}
        <span class="price">${F.money(i.price)}</span>
        <button type="button" class="btn btn-sm ${sel ? "btn-outline" : "btn-brand"}" data-item="${i.id}" ${!sel && full ? "disabled" : ""} ${sel ? "" : "data-burst"}>${sel ? F.t("remove", "Retirer") : F.t("add", "Ajouter")}</button>
      </div>`;
    }).join("");
    const cap = box().capacity;
    F.qs("#cap-text").innerHTML = `<b>${s.items.length}/${cap}</b> ${F.t("b_items_in", "articles dans votre box")}${full ? " · " + F.t("b_full", "elle est pleine ! 🎀") : ""}`;
    F.qs("#cap-bar").style.width = Math.min(100, (s.items.length / cap) * 100) + "%";
  }

  /* ---- étape 3 : message ---- */
  F.qs("#card-choices").innerHTML = F.cardStyles.map(c => `<div class="option-card">
    <input type="radio" name="card" id="card-${c.id}" value="${c.id}" ${s.card === c.id ? "checked" : ""}>
    <label for="card-${c.id}"><b>${F.L(c)}</b><small>${c.price ? "+" + F.money(c.price) : F.t("free", "Offerte")}</small></label></div>`).join("");
  const ideas = F.lang === "ar"
    ? ["كل عام وأنت أجمل قصصي 🤍", "شكراً لأنك موجود(ة) دائماً", "لكِ يا أمي، بكل حبي", "مرحباً بالصغير(ة) في هذا العالم ✨"]
    : ["Joyeux anniversaire, toi qui rends ma vie plus belle 🤍", "Merci d'être toujours là, tout simplement.", "Pour toi, Maman, avec tout mon amour.", "Bienvenue au monde, petit trésor ✨", "À nous deux, et à toutes nos années à venir."];
  F.qs("#msg-ideas").innerHTML = ideas.map(t => `<button type="button" class="chip" data-idea="${F.esc(t)}">${F.esc(t.length > 38 ? t.slice(0, 36) + "…" : t)}</button>`).join("");
  F.qs("#b-to").value = s.to; F.qs("#b-from").value = s.from; F.qs("#b-msg").value = s.message;

  /* ---- étape 4 : emballage ---- */
  F.qs("#wrap-choices").innerHTML = B.wrappings.map(w => `<div class="option-card">
    <input type="radio" name="wrap" id="wrap-${w.id}" value="${w.id}" ${s.wrap === w.id ? "checked" : ""}>
    <label for="wrap-${w.id}"><b><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${w.box};border:1px solid #0001;margin-inline-end:6px"></span>${F.L(w)}</b><small>${F.lang === "ar" ? w.descAr : w.descFr} · ${w.price ? "+" + F.money(w.price) : F.t("included", "inclus")}</small></label></div>`).join("");
  F.qs("#ribbon-choices").innerHTML = F.ribbons.map(r => `<label class="swatch" title="${F.L(r)}"><input type="radio" name="ribbon" value="${r.id}" ${s.ribbon === r.id ? "checked" : ""}><span style="background:${r.color}"></span><span class="sr-only">${F.L(r)}</span></label>`).join("");
  F.qs("#extra-choices").innerHTML = B.extras.map(e => `<label class="check"><input type="checkbox" name="extra" value="${e.id}" ${s.extras.includes(e.id) ? "checked" : ""}> ${F.L(e)} <span class="count">+${F.money(e.price)}</span></label>`).join("");

  /* ---- aperçu & récapitulatif ---- */
  let lastTotal = null;
  function renderPreview() {
    F.qs("#preview-stage").innerHTML = F.art.builder({
      scale: box().scale, wrap: wrap(), ribbon: ribbon().color, items: s.items.map(item), card: s.card,
      message: s.message || (s.to ? s.to : ""), extras: s.extras
    });
    const lines = [[`📦 ${F.t("b_box", "Box")} ${F.L(box())}`, F.money(box().price)]];
    s.items.forEach(id => lines.push([`${item(id).emoji} ${F.L(item(id))}`, F.money(item(id).price), id]));
    if (!s.items.length) lines.push([`<span class="muted">${F.t("b_no_items", "Aucun article pour l'instant…")}</span>`, ""]);
    if (s.card !== "none") lines.push([`✉️ ${F.L(card())}`, card().price ? F.money(card().price) : F.t("free", "Offerte")]);
    lines.push([`🎀 ${F.L(wrap())} · ${F.L(ribbon())}`, wrap().price ? F.money(wrap().price) : F.t("included", "inclus")]);
    s.extras.forEach(id => { const e = B.extras.find(x => x.id === id); lines.push([`✨ ${F.L(e)}`, F.money(e.price)]); });
    F.qs("#summary").innerHTML = lines.map(([l, p, id]) => `<li><span>${l}</span><span>${p}${id ? ` <button type="button" data-rm-item="${id}" aria-label="${F.t("remove", "Retirer")}">×</button>` : ""}</span></li>`).join("");
    const cp = F.qs("#card-preview");
    const txt = [s.to && `${F.t("b_dear", "Pour")} ${s.to},`, s.message, s.from && `— ${s.from}`].filter(Boolean).join("\n");
    cp.textContent = s.card === "none" ? F.t("b_no_card", "Sans carte message") : txt || F.t("b_card_empty", "Votre message apparaîtra ici…");
    cp.style.opacity = txt || s.card === "none" ? 1 : 0.6;
    const t = total(), el = F.qs("#b-total");
    el.textContent = F.money(t);
    if (lastTotal !== null && lastTotal !== t) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
    lastTotal = t;
    const ok = s.items.length > 0;
    F.qs("#b-add").disabled = !ok;
    F.qs("#b-hint").textContent = ok ? F.t("b_hint_ok", "Préparée à la main sous 24 à 48 h 🤍") : F.t("b_hint", "Ajoutez au moins un article pour valider votre box.");
    F.qs("#b-ribbon-name").textContent = F.L(ribbon());
  }

  /* ---- navigation entre étapes ---- */
  function go(step) {
    s.step = Math.max(0, Math.min(3, step));
    F.qsa(".builder-steps button").forEach((b, i) => {
      b.classList.toggle("is-active", i === s.step); b.setAttribute("aria-selected", i === s.step);
      b.classList.toggle("is-done", i < s.step);
    });
    F.qsa(".builder-panel").forEach((p, i) => p.classList.toggle("is-active", i === s.step));
    F.qs("#b-prev").style.visibility = s.step === 0 ? "hidden" : "visible";
    const next = F.qs("#b-next");
    next.textContent = s.step === 3 ? F.t("b_finish", "Ajouter au panier 🎁") : F.t("b_next", "Continuer →");
    save();
  }
  F.qsa(".builder-steps button").forEach(b => b.addEventListener("click", () => go(+b.dataset.step)));
  F.qs("#b-prev").addEventListener("click", () => { go(s.step - 1); scrollToTop(); });
  F.qs("#b-next").addEventListener("click", () => {
    if (s.step === 1 && !s.items.length) { F.toast(F.t("b_need_item", "Ajoutez au moins un article à votre box 🎁")); return; }
    if (s.step === 3) { addToCart(); return; }
    go(s.step + 1); scrollToTop();
  });
  const scrollToTop = () => { const t = F.qs(".builder").getBoundingClientRect().top + scrollY - 100; if (scrollY > t) scrollTo({ top: t, behavior: "smooth" }); };

  /* ---- événements ---- */
  document.addEventListener("change", e => {
    const el = e.target;
    if (el.name === "box") {
      s.box = el.value;
      if (s.items.length > box().capacity) { s.items = s.items.slice(0, box().capacity); F.toast(F.t("b_trim", "Votre box est plus petite : nous avons gardé les premiers articles.")); }
    }
    if (el.name === "card") s.card = el.value;
    if (el.name === "wrap") s.wrap = el.value;
    if (el.name === "ribbon") s.ribbon = el.value;
    if (el.name === "extra") s.extras = F.qsa("input[name=extra]:checked").map(i => i.value);
    renderItems(); renderPreview(); save();
  });
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-item]");
    if (add) {
      const id = add.dataset.item;
      if (s.items.includes(id)) s.items = s.items.filter(x => x !== id);
      else if (s.items.length < box().capacity) s.items.push(id);
      renderItems(); renderPreview(); save();
    }
    const rm = e.target.closest("[data-rm-item]");
    if (rm) { s.items = s.items.filter(x => x !== rm.dataset.rmItem); renderItems(); renderPreview(); save(); }
    const cat = e.target.closest("[data-cat]");
    if (cat) { s.cat = cat.dataset.cat; F.qsa("[data-cat]").forEach(c => c.classList.toggle("is-active", c === cat)); renderItems(); save(); }
    const idea = e.target.closest("[data-idea]");
    if (idea) { s.message = idea.dataset.idea; F.qs("#b-msg").value = s.message; F.qs("#b-count").textContent = s.message.length; renderPreview(); save(); }
  });
  [["#b-to", "to"], ["#b-from", "from"], ["#b-msg", "message"]].forEach(([sel, k]) => F.qs(sel).addEventListener("input", e => {
    s[k] = e.target.value; if (k === "message") F.qs("#b-count").textContent = s.message.length; renderPreview(); save();
  }));
  F.qs("#b-count").textContent = s.message.length;

  function addToCart() {
    if (!s.items.length) { go(1); F.toast(F.t("b_need_item", "Ajoutez au moins un article à votre box 🎁")); return; }
    const options = {
      box: F.L(box()),
      items: s.items.map(id => F.L(item(id))).join(", "),
      card: F.L(card()),
      wrap: F.L(wrap()),
      ribbon: F.L(ribbon())
    };
    if (s.to) options.to = s.to;
    if (s.from) options.from = s.from;
    if (s.message) options.message = s.message;
    if (s.extras.length) options.extras = s.extras.map(id => F.L(B.extras.find(e => e.id === id))).join(", ");
    F.cart.add({
      id: "box-sur-mesure", unique: true,
      name: { fr: "Ma box sur mesure", ar: "علبتي حسب الطلب" },
      price: total(), qty: 1,
      art: { v: "open", b: wrap().box, l: wrap().lid, r: ribbon().color, bg: "#fff1dc", deco: "sparkle" },
      options
    });
    F.toast(F.t("b_added", "Votre box sur mesure est dans le panier ✨"), { href: "panier.html", label: F.t("see_cart", "Voir le panier") });
    // on repart d'une page blanche pour une éventuelle deuxième box
    s.items = []; s.message = ""; s.to = ""; s.from = ""; s.extras = [];
    F.qs("#b-msg").value = ""; F.qs("#b-to").value = ""; F.qs("#b-from").value = ""; F.qs("#b-count").textContent = 0;
    F.qsa("input[name=extra]").forEach(i => (i.checked = false));
    go(0); renderItems(); renderPreview();
  }
  F.qs("#b-add").addEventListener("click", addToCart);

  renderItems(); renderPreview(); go(s.step);
})();

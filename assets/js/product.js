/* Fanni's Store — page produit : galerie, personnalisation, ajout au panier */
(function () {
  const F = window.FANNI, C = F.config;
  const id = new URLSearchParams(location.search).get("id");
  const p = F.getProduct(id) || F.products[0];
  if (p.custom) { location.replace("creer-ma-box.html"); return; }
  const name = F.L(p.name);
  const occ = F.occasion(p.occasion[0]);

  /* SEO dynamique */
  document.title = `${name} · Fanni's Store`;
  const md = document.querySelector('meta[name="description"]');
  md.content = `${name} — ${F.L(p.short)}. ${F.L(p.desc).slice(0, 110)}…`;
  document.querySelector('link[rel="canonical"]').href = `https://www.fannis-store.com/produit.html?id=${p.id}`;
  document.querySelector('meta[property="og:title"]').content = `${name} · Fanni's Store`;
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Product", name, description: F.L(p.desc),
    brand: { "@type": "Brand", name: "Fanni's Store" }, sku: p.id,
    image: p.images && p.images.length ? p.images.map(i => new URL(i, location.href).href) : ["https://www.fannis-store.com/assets/img/og-image.png"],
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
    offers: { "@type": "Offer", price: p.price, priceCurrency: C.currency === "DT" ? "TND" : C.currency, availability: "https://schema.org/InStock", url: location.href }
  });
  document.head.appendChild(ld);
  F.qs("#crumbs").insertAdjacentHTML("beforeend", `<span>✦</span><span>${F.esc(name)}</span>`);

  const defRibbon = F.ribbons.find(r => r.color.toLowerCase() === (p.art.r || "").toLowerCase()) || F.ribbons[0];
  const colors = (p.colors || []).filter(c => c.fr);
  const persoLabel = p.persoLabel && (p.persoLabel[F.lang] || p.persoLabel.fr);
  const views = p.images && p.images.length ? p.images.length : 4;
  const opt = (arr, cls) => arr.map(o => `<option value="${o.id}">${F.L(o)}${o.price ? " (+" + F.money(o.price) + ")" : ""}</option>`).join("");

  F.qs("#product").innerHTML = `
    <div class="gallery">
      <div class="gallery-thumbs" role="tablist" aria-label="${F.t("photos", "Photos")}">
        ${Array.from({ length: views }, (_, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="${i === 0 ? "is-active" : ""}" data-view="${i}" aria-label="${F.t("photo", "Photo")} ${i + 1}">${F.art.product(p, i, F.lang)}</button>`).join("")}
      </div>
      <div class="gallery-main" id="gallery-main">${F.art.product(p, 0, F.lang)}</div>
    </div>

    <div class="product-info">
      <span class="occ">${occ ? F.L(occ) : ""}</span>
      <h1>${name}</h1>
      <div class="meta-row">
        <span class="price">${F.money(p.price)}${p.oldPrice ? `<del>${F.money(p.oldPrice)}</del>` : ""}</span>
        <span class="rating">${F.stars(p.rating)} <small>${p.rating}/5 · ${p.reviews} ${F.t("reviews", "avis")}</small></span>
      </div>
      <p class="desc">${F.L(p.desc)}</p>
      <ul class="includes">${(p.includes[F.lang] || p.includes.fr).map(i => `<li>${i}</li>`).join("")}</ul>

      <form id="custom-form" class="custom-box" novalidate>
        ${colors.length ? `<div class="field">
          <span class="label" id="color-label">${F.t("c_color", "Couleur")} : <small id="color-name">${F.L(colors[0])}</small></span>
          <div class="swatches" role="radiogroup" aria-labelledby="color-label">
            ${colors.map((c, i) => `<label class="swatch" title="${F.esc(F.L(c))}"><input type="radio" name="couleur" value="${i}" ${i === 0 ? "checked" : ""}><span style="background:${c.hex}"></span><span class="sr-only">${F.esc(F.L(c))}</span></label>`).join("")}
          </div>
        </div>` : ""}
        <div class="field-grid">
          <div class="field">
            <label for="c-name">${persoLabel ? F.esc(persoLabel) : F.t("c_name", "Prénom à personnaliser")} <small>(${F.t("optional", "facultatif")})</small></label>
            <input class="input" id="c-name" name="prenom" maxlength="20" placeholder="${F.t("c_name_ph", "Ex. : Lina")}" autocomplete="off">
          </div>
          <div class="field">
            <label for="c-card">${F.t("c_card", "Carte message")}</label>
            <select class="select" id="c-card" name="carte" style="border-radius:12px">${opt(F.cardStyles.filter(c => c.id !== "none"))}</select>
          </div>
        </div>
        <div class="field">
          <label for="c-msg">${F.t("c_msg", "Votre message")} <small>(${F.t("c_msg_hint", "écrit à la main sur la carte")})</small></label>
          <textarea class="textarea" id="c-msg" name="message" maxlength="200" placeholder="${F.t("c_msg_ph", "Joyeux anniversaire ma douce, que cette année te ressemble : lumineuse et pleine d'amour…")}"></textarea>
          <div class="char-count"><span id="msg-count">0</span>/200</div>
        </div>
        <div class="field">
          <span class="label" id="ribbon-label">${F.t("c_ribbon", "Couleur du ruban")} : <small id="ribbon-name">${F.L(defRibbon)}</small></span>
          <div class="swatches" role="radiogroup" aria-labelledby="ribbon-label">
            ${F.ribbons.map(r => `<label class="swatch" title="${F.L(r)}"><input type="radio" name="ruban" value="${r.id}" ${r.id === defRibbon.id ? "checked" : ""}><span style="background:${r.color}"></span><span class="sr-only">${F.L(r)}</span></label>`).join("")}
          </div>
        </div>
        <div class="field">
          <span class="label">${F.t("c_photo", "Photo à imprimer")} <small>(+${F.money(C.photoOptionPrice)}, ${F.t("optional", "facultatif")})</small></span>
          <label class="upload" id="upload">
            <input type="file" id="c-photo" accept="image/*">
            ${F.icons.upload}
            <img class="preview" id="photo-preview" alt="">
            <p id="upload-text">${F.t("c_photo_txt", "<b>Ajoutez une photo souvenir</b><br>Glissez-la ici ou cliquez (JPG, PNG · 10 Mo max)")}</p>
          </label>
        </div>
      </form>

      <p class="total-live">${F.t("total", "Total")} : <b id="live-total">${F.money(p.price)}</b></p>
      <div class="buy-row">
        <div class="qty" aria-label="${F.t("qty", "Quantité")}">
          <button type="button" data-q="-1" aria-label="-">−</button>
          <input type="number" id="qty" value="1" min="1" max="20" aria-label="${F.t("qty", "Quantité")}">
          <button type="button" data-q="1" aria-label="+">+</button>
        </div>
        <button class="btn btn-primary" type="button" id="add-cart" data-burst>🎁 ${F.t("add_cart", "Ajouter au panier")}</button>
      </div>
      <a class="btn btn-outline btn-block mt-2" id="wa-order" target="_blank" rel="noopener" style="gap:8px">${F.icons.whatsapp.replace("<svg", '<svg width="18" height="18"')} ${F.t("order_wa", "Commander sur WhatsApp")}</a>

      <div class="reassure">
        <div>${F.icons.hand}${F.t("r1", "Préparée à la main")}</div>
        <div>${F.icons.truck}${F.t("r2", "Livraison en 24 à 72 h")}</div>
        <div>${F.icons.shield}${F.t("r3", "Paiement à la livraison")}</div>
      </div>

      <div class="tabs">
        <div class="tab-list" role="tablist">
          <button role="tab" aria-selected="true" data-tab="0">${F.t("tab_story", "L'histoire de cette box")}</button>
          <button role="tab" aria-selected="false" data-tab="1">${F.t("tab_ship", "Préparation & livraison")}</button>
          <button role="tab" aria-selected="false" data-tab="2">${F.t("tab_care", "Nos petits plus")}</button>
        </div>
        <div class="tab-panel" role="tabpanel">${F.L(p.desc)}</div>
        <div class="tab-panel hide" role="tabpanel">${F.t("tab_ship_txt", "Chaque box est préparée à la main sous 24 à 48 h après validation de votre personnalisation. Livraison en 24 à 72 h selon votre ville. Livraison offerte dès {free}. Besoin d'une date précise ? Indiquez-la lors de la commande, nous ferons tout pour être au rendez-vous.").replace("{free}", F.money(C.freeShippingFrom))}</div>
        <div class="tab-panel hide" role="tabpanel">${F.t("tab_care_txt", "Papier de soie, ruban noué à la main, petit mot écrit à la plume et une touche de parfum… Nous vous envoyons une photo de votre box avant l'envoi sur simple demande 📸")}</div>
      </div>
    </div>`;

  /* galerie */
  const main = F.qs("#gallery-main");
  const showView = v => {
    F.qsa(".gallery-thumbs button").forEach(x => { const on = +x.dataset.view === v; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", on); });
    main.innerHTML = F.art.product(p, v, F.lang);
  };
  F.qsa(".gallery-thumbs button").forEach(b => b.addEventListener("click", () => showView(+b.dataset.view)));

  /* onglets */
  F.qsa(".tab-list button").forEach(b => b.addEventListener("click", () => {
    F.qsa(".tab-list button").forEach(x => x.setAttribute("aria-selected", x === b));
    F.qsa(".tab-panel").forEach((pn, i) => pn.classList.toggle("hide", i !== +b.dataset.tab));
  }));

  /* personnalisation & prix en direct */
  const form = F.qs("#custom-form"), qty = F.qs("#qty");
  let photo = null;
  const getOpts = () => {
    const ribbon = F.ribbons.find(r => r.id === form.ruban.value);
    const card = F.cardStyles.find(c => c.id === form.carte.value);
    const color = colors.length ? colors[+(form.couleur.value || 0)] : null;
    return { ribbon, card, color, name: form.prenom.value.trim(), message: form.message.value.trim() };
  };
  const unitPrice = () => {
    const o = getOpts();
    return p.price + (o.card ? o.card.price : 0) + (photo ? C.photoOptionPrice : 0);
  };
  const update = () => {
    const o = getOpts();
    F.qs("#ribbon-name").textContent = F.L(o.ribbon);
    if (o.color) F.qs("#color-name").textContent = F.L(o.color);
    F.qs("#msg-count").textContent = form.message.value.length;
    const t = F.qs("#live-total");
    t.textContent = F.money(unitPrice() * (+qty.value || 1));
    t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash");
    // aperçu : le ruban choisi s'applique à l'illustration
    if (!(p.images && p.images.length)) {
      const a = { ...p.art, r: o.ribbon.color };
      const v = +(F.qs(".gallery-thumbs .is-active") || { dataset: { view: 0 } }).dataset.view;
      main.innerHTML = F.art.gift(a, { seed: p.id, view: v, label: name });
    }
    F.qs("#wa-order").href = F.wa(waText());
  };
  const waText = () => {
    const o = getOpts();
    return `${F.t("wa_order_intro", "Bonjour Fanni's Store 🤍 Je souhaite commander :")}\n🎁 ${name} × ${qty.value}\n` +
      (o.color ? `${F.t("c_color", "Couleur")} : ${F.L(o.color)}\n` : "") + `${F.t("c_ribbon", "Couleur du ruban")} : ${F.L(o.ribbon)}\n${F.t("c_card", "Carte message")} : ${F.L(o.card)}` +
      (o.name ? `\n${persoLabel || F.t("c_name", "Prénom")} : ${o.name}` : "") + (o.message ? `\n${F.t("c_msg", "Message")} : « ${o.message} »` : "") +
      (photo ? `\n📷 ${F.t("wa_photo", "Je vous envoie la photo ici.")}` : "") + `\n${F.t("total", "Total")} : ${F.money(unitPrice() * (+qty.value || 1))}`;
  };
  form.addEventListener("change", e => {
    if (e.target.name !== "couleur") return;
    const c = colors[+e.target.value];
    if (c && c.image >= 0 && p.images && p.images[c.image]) showView(c.image);
  });
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  F.qsa("[data-q]").forEach(b => b.addEventListener("click", () => { qty.value = Math.max(1, Math.min(20, (+qty.value || 1) + +b.dataset.q)); update(); }));
  qty.addEventListener("change", () => { qty.value = Math.max(1, Math.min(20, +qty.value || 1)); update(); });

  /* photo */
  const up = F.qs("#upload"), fileIn = F.qs("#c-photo");
  const setFile = file => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) { F.toast(F.t("photo_big", "Cette photo dépasse 10 Mo, pouvez-vous en choisir une plus légère ?")); return; }
    photo = file.name;
    const rd = new FileReader();
    rd.onload = () => { F.qs("#photo-preview").src = rd.result; up.classList.add("has-file"); };
    rd.readAsDataURL(file);
    F.qs("#upload-text").innerHTML = `<b>${F.esc(file.name)}</b><br>${F.t("photo_ok", "Photo ajoutée ✓ — cliquez pour la changer")}`;
    update();
  };
  fileIn.addEventListener("change", () => setFile(fileIn.files[0]));
  ["dragenter", "dragover"].forEach(ev => up.addEventListener(ev, e => { e.preventDefault(); up.classList.add("is-drag"); }));
  ["dragleave", "drop"].forEach(ev => up.addEventListener(ev, e => { e.preventDefault(); up.classList.remove("is-drag"); }));
  up.addEventListener("drop", e => setFile(e.dataTransfer.files[0]));

  /* ajout au panier */
  F.qs("#add-cart").addEventListener("click", () => {
    const o = getOpts();
    const options = { ...(o.color ? { color: F.L(o.color) } : {}), ribbon: F.L(o.ribbon), card: F.L(o.card) };
    if (o.name) options.name = o.name;
    if (o.message) options.message = o.message;
    if (photo) options.photo = photo;
    F.cart.add({ id: p.id, name: p.name, price: unitPrice(), qty: +qty.value || 1, art: { ...p.art, r: o.ribbon.color }, image: p.images && (o.color && o.color.image >= 0 && p.images[o.color.image] || p.images[0]), options });
    F.toast(`🎁 ${name} ${F.t("added", "ajoutée au panier")}`, { href: "panier.html", label: F.t("see_cart", "Voir le panier") });
  });

  update();

  /* suggestions */
  const related = F.products.filter(x => x.id !== p.id && x.occasion.some(o => p.occasion.includes(o))).concat(F.products.filter(x => x.id !== p.id && x.bestseller));
  F.qs("#related").innerHTML = [...new Map(related.map(x => [x.id, x])).values()].slice(0, 4).map(F.productCard).join("");
  F.observe();
})();

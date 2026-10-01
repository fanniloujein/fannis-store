/* Fanni's Store — panier & paiement (à la livraison ou en ligne) */
(function () {
  const F = window.FANNI, C = F.config;
  const root = F.qs("#cart-root");
  const optLabels = () => ({
    box: F.t("b_box", "Box"), items: F.t("b_s2", "Articles"), name: F.t("o_name", "Prénom"), to: F.t("b_to", "Pour"), from: F.t("b_from", "De la part de"),
    message: F.t("o_message", "Message"), ribbon: F.t("o_ribbon", "Ruban"), card: F.t("o_card", "Carte"), wrap: F.t("b_wrap", "Emballage"),
    extras: F.t("b_extras", "Finitions"), photo: F.t("o_photo", "Photo")
  });
  let form = { name: "", phone: "", email: "", address: "", city: "", date: "", note: "", pay: "cod", gift: false };
  try { form = { ...form, ...JSON.parse(sessionStorage.getItem("fanni_checkout") || "{}") }; } catch (e) {}

  function render() {
    const items = F.cart.items;
    if (!items.length) {
      root.innerHTML = `<div class="empty-state reveal" data-sparkles="5" style="position:relative">
        <div class="big-emoji">🎀</div>
        <h2>${F.t("cart_empty_t", "Votre panier attend sa première histoire")}</h2>
        <p style="color:var(--muted);max-width:460px;margin:0 auto 26px">${F.t("cart_empty_p", "Explorez nos box ou composez la vôtre : chaque cadeau commence par une petite idée 🤍")}</p>
        <div class="hero-cta" style="justify-content:center"><a class="btn btn-primary" href="boutique.html">${F.t("see_shop", "Découvrir la boutique")}</a><a class="btn btn-outline" href="creer-ma-box.html">${F.t("cta_create", "Créer ma box")}</a></div>
      </div>`;
      F.observe(root);
      return;
    }
    const L = optLabels();
    const sub = F.cart.subtotal(), ship = F.cart.shipping(sub), tot = sub + ship;
    const left = Math.max(0, C.freeShippingFrom - sub);
    root.innerHTML = `<div class="cart-layout">
      <div>
        <div class="cart-list">
          ${items.map(it => `<div class="cart-item">
            <a class="thumb" href="${it.id === "box-sur-mesure" ? "creer-ma-box.html" : "produit.html?id=" + it.id}">${it.image ? `<img src="${it.image}" alt="">` : F.art.gift(it.art || { v: "box", b: "#ffe3cc", r: "#ffc933" }, { seed: it.id, label: "" })}</a>
            <div>
              <h3>${F.esc(F.L(it.name))}</h3>
              <p class="opts">${Object.entries(it.options || {}).map(([k, v]) => `<span><b>${L[k] || k} :</b> ${F.esc(v)}</span>`).join("")}</p>
              <div class="line-actions">
                <div class="qty sm"><button type="button" data-dec="${it.key}" aria-label="-">−</button><input type="number" value="${it.qty}" min="1" max="20" data-qty="${it.key}" aria-label="${F.t("qty", "Quantité")}"><button type="button" data-inc="${it.key}" aria-label="+">+</button></div>
                <button class="remove" type="button" data-remove="${it.key}">${F.t("remove", "Retirer")}</button>
              </div>
            </div>
            <span class="line-price">${F.money(it.price * it.qty)}</span>
          </div>`).join("")}
        </div>
        <a class="link-arrow mt-2" href="boutique.html">← ${F.t("continue", "Continuer mes achats")}</a>

        <form class="checkout-section" id="checkout" novalidate>
          <h2>${F.t("co_delivery", "Livraison")}</h2>
          <div class="field-grid">
            <div class="field"><label for="o-name">${F.t("co_name", "Nom complet")} *</label><input class="input" id="o-name" name="name" required autocomplete="name" value="${F.esc(form.name)}"></div>
            <div class="field"><label for="o-phone">${F.t("co_phone", "Téléphone (WhatsApp de préférence)")} *</label><input class="input" id="o-phone" name="phone" type="tel" required autocomplete="tel" pattern="[+0-9 ]{8,}" value="${F.esc(form.phone)}"></div>
          </div>
          <div class="field"><label for="o-email">Email <small>(${F.t("optional", "facultatif")})</small></label><input class="input" id="o-email" name="email" type="email" autocomplete="email" value="${F.esc(form.email)}"></div>
          <div class="field"><label for="o-address">${F.t("co_address", "Adresse de livraison")} *</label><input class="input" id="o-address" name="address" required autocomplete="street-address" value="${F.esc(form.address)}"></div>
          <div class="field-grid">
            <div class="field"><label for="o-city">${F.t("co_city", "Ville")} *</label><input class="input" id="o-city" name="city" required autocomplete="address-level2" value="${F.esc(form.city)}"></div>
            <div class="field"><label for="o-date">${F.t("co_date", "Date de livraison souhaitée")}</label><input class="input" id="o-date" name="date" type="date" min="${new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10)}" value="${F.esc(form.date)}"></div>
          </div>
          <label class="check" style="margin-bottom:14px"><input type="checkbox" name="gift" ${form.gift ? "checked" : ""}> ${F.t("co_gift", "C'est une surprise : livrer directement à la personne, sans le prix sur le colis 🤫")}</label>
          <div class="field"><label for="o-note">${F.t("co_note", "Un mot pour nous ?")} <small>(${F.t("optional", "facultatif")})</small></label><textarea class="textarea" id="o-note" name="note" style="min-height:80px" placeholder="${F.t("co_note_ph", "Instructions de livraison, horaires, histoire derrière ce cadeau…")}">${F.esc(form.note)}</textarea></div>

          <h2 style="margin-top:34px">${F.t("co_payment", "Paiement")}</h2>
          <div class="pay-options">
            <div class="pay-option"><input type="radio" name="pay" id="pay-cod" value="cod" ${form.pay === "cod" ? "checked" : ""}><label for="pay-cod"><span class="dot"></span><span><b>${F.t("pay_cod", "Paiement à la livraison")}</b><small>${F.t("pay_cod_d", "Réglez en espèces à la réception de votre box.")}</small></span><span class="pi">💵</span></label></div>
            <div class="pay-option"><input type="radio" name="pay" id="pay-online" value="online" ${form.pay === "online" ? "checked" : ""}><label for="pay-online"><span class="dot"></span><span><b>${F.t("pay_online", "Paiement en ligne sécurisé")}</b><small>${F.t("pay_online_d", "Carte bancaire (Visa, Mastercard) ou e-Dinar.")}</small></span><span class="pi">💳</span></label></div>
          </div>
          <p class="pay-detail${form.pay === "online" ? " show" : ""}" id="pay-detail">🔒 ${C.onlinePaymentUrl ? F.t("pay_online_redirect", "Après validation, vous serez redirigé(e) vers notre page de paiement sécurisée. Vos données bancaires ne transitent jamais par notre site.") : F.t("pay_online_link", "Après validation, nous vous envoyons un lien de paiement sécurisé par WhatsApp ou email. Vos données bancaires ne transitent jamais par notre site.")}</p>
        </form>
      </div>

      <aside class="summary-card">
        <h2>${F.t("co_summary", "Récapitulatif")}</h2>
        <div class="sum-line"><span>${F.t("subtotal", "Sous-total")} (${F.cart.count()})</span><span>${F.money(sub)}</span></div>
        <div class="sum-line"><span>${F.t("shipping", "Livraison")}</span><span>${ship ? F.money(ship) : F.t("free", "Offerte") + " ✨"}</span></div>
        <div class="free-ship">${left > 0 ? `${F.t("free_left_a", "Plus que")} <b>${F.money(left)}</b> ${F.t("free_left_b", "pour la livraison offerte 🎁")}` : F.t("free_ok", "Bonne nouvelle : la livraison vous est offerte 🤍")}<div class="bar"><span style="width:${Math.min(100, (sub / C.freeShippingFrom) * 100)}%"></span></div></div>
        <div class="sum-line total"><span>${F.t("total", "Total")}</span><b>${F.money(tot)}</b></div>
        <button class="btn btn-primary btn-block mt-2" type="submit" form="checkout" id="place-order" data-burst>${F.t("place_order", "Valider ma commande")}</button>
        <p class="secure-note">${F.icons.lock} ${F.t("secure", "Commande sécurisée · Préparée avec amour")}</p>
        <p class="form-note text-center">${F.t("co_terms", "En validant, vous acceptez nos")} <a href="mentions-legales.html#cgv" style="text-decoration:underline">${F.t("terms_long", "conditions générales de vente")}</a>.</p>
      </aside>
    </div>`;
    bindForm();
  }

  function bindForm() {
    const f = F.qs("#checkout");
    f.addEventListener("input", persist);
    f.addEventListener("change", e => {
      persist();
      if (e.target.name === "pay") F.qs("#pay-detail").classList.toggle("show", e.target.value === "online");
    });
    f.addEventListener("submit", submit);
  }
  function persist() {
    const f = F.qs("#checkout"); if (!f) return;
    form = { name: f.name.value, phone: f.phone.value, email: f.email.value, address: f.address.value, city: f.city.value, date: f.date.value, note: f.note.value, pay: f.pay.value, gift: f.gift.checked };
    try { sessionStorage.setItem("fanni_checkout", JSON.stringify(form)); } catch (e) {}
  }

  function submit(e) {
    e.preventDefault();
    const f = F.qs("#checkout");
    let first = null;
    ["name", "phone", "address", "city"].forEach(n => {
      const el = f[n], ok = el.value.trim() && el.checkValidity();
      el.classList.toggle("is-invalid", !ok);
      if (!ok && !first) first = el;
    });
    if (f.email.value && !f.email.checkValidity()) { f.email.classList.add("is-invalid"); first = first || f.email; }
    if (first) { first.focus(); F.toast(F.t("co_missing", "Il manque quelques informations pour livrer votre box 🤍")); return; }
    persist();

    const L = optLabels();
    const orderNo = "FS-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const sub = F.cart.subtotal(), ship = F.cart.shipping(sub), tot = sub + ship;
    const lines = F.cart.items.map(it => `• ${F.L(it.name)} × ${it.qty} — ${F.money(it.price * it.qty)}` +
      Object.entries(it.options || {}).map(([k, v]) => `\n   ${L[k] || k} : ${v}`).join("")).join("\n");
    const payLabel = form.pay === "online" ? F.t("pay_online", "Paiement en ligne sécurisé") : F.t("pay_cod", "Paiement à la livraison");
    const msg = `${F.t("wa_new_order", "Bonjour Fanni's Store 🤍 Voici ma commande")} ${orderNo}\n\n${lines}\n\n` +
      `${F.t("subtotal", "Sous-total")} : ${F.money(sub)}\n${F.t("shipping", "Livraison")} : ${ship ? F.money(ship) : F.t("free", "Offerte")}\n${F.t("total", "Total")} : ${F.money(tot)}\n${F.t("co_payment", "Paiement")} : ${payLabel}\n\n` +
      `👤 ${form.name}\n📞 ${form.phone}${form.email ? "\n✉️ " + form.email : ""}\n📍 ${form.address}, ${form.city}` +
      (form.date ? `\n📅 ${F.t("co_date", "Date souhaitée")} : ${form.date}` : "") + (form.gift ? `\n🤫 ${F.t("co_gift_short", "Livraison surprise")}` : "") + (form.note ? `\n📝 ${form.note}` : "");

    // historique local (utile pour le suivi et le service client)
    try {
      const hist = JSON.parse(localStorage.getItem("fanni_orders") || "[]");
      hist.push({ orderNo, date: new Date().toISOString(), items: F.cart.items, total: tot, customer: form });
      localStorage.setItem("fanni_orders", JSON.stringify(hist.slice(-20)));
    } catch (err) {}

    // enregistrement de la commande dans l'espace admin
    F.api("/api/orders", {
      orderNo, pay: form.pay, shipping: ship, lang: F.lang,
      items: F.cart.items.map(it => ({ id: it.id, name: F.L(it.name), price: it.price, qty: it.qty, options: it.options || {} })),
      customer: form
    });

    const waUrl = F.wa(msg);
    F.qs("#order-no").textContent = `${F.t("order_no", "Commande")} ${orderNo}`;
    F.qs("#order-text").innerHTML = form.pay === "online"
      ? (C.onlinePaymentUrl ? F.t("order_online_redirect", "Vous allez être redirigé(e) vers le paiement sécurisé. Envoyez-nous aussi votre commande sur WhatsApp pour que nous commencions à la préparer 🤍") : F.t("order_online", "Envoyez-nous votre commande sur WhatsApp : nous vous répondons avec votre lien de paiement sécurisé et commençons à préparer votre box avec amour 🤍"))
      : F.t("order_cod", "Envoyez-nous votre commande sur WhatsApp pour la confirmer. Nous vous recontactons très vite, puis votre box est préparée à la main et réglée à la livraison 🤍");
    const wa = F.qs("#order-wa");
    wa.href = waUrl;
    wa.innerHTML = `${F.icons.whatsapp.replace("<svg", '<svg width="18" height="18"')} ${F.t("order_send_wa", "Envoyer ma commande sur WhatsApp")}`;
    wa.addEventListener("click", () => setTimeout(() => { F.cart.clear(); render(); }, 300), { once: true });
    openModal();
    if (form.pay === "online" && C.onlinePaymentUrl) {
      const u = new URL(C.onlinePaymentUrl);
      u.searchParams.set("amount", tot); u.searchParams.set("order", orderNo);
      setTimeout(() => window.open(u.toString(), "_blank", "noopener"), 1200);
    }
  }

  const modal = F.qs("#order-modal");
  function openModal() {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    F.qs("#order-wa").focus();
    const r = F.qs(".modal-card").getBoundingClientRect();
    F.burst(r.left + r.width / 2, r.top + 40, 18);
  }
  modal.addEventListener("click", e => { if (e.target === modal) { modal.classList.remove("is-open"); document.body.style.overflow = ""; } });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("is-open")) { modal.classList.remove("is-open"); document.body.style.overflow = ""; } });

  /* quantités & suppression */
  root.addEventListener("click", e => {
    const t = e.target.closest("[data-inc],[data-dec],[data-remove]"); if (!t) return;
    persist();
    if (t.dataset.remove) F.cart.remove(t.dataset.remove);
    else { const k = t.dataset.inc || t.dataset.dec; const it = F.cart.items.find(i => i.key === k); F.cart.setQty(k, it.qty + (t.dataset.inc ? 1 : -1)); }
  });
  root.addEventListener("change", e => { if (e.target.dataset.qty) { persist(); F.cart.setQty(e.target.dataset.qty, +e.target.value || 1); } });
  document.addEventListener("cart:change", render);

  render();
})();

/* Fanni's Store — boutique : filtres occasion / destinataire / prix, tri */
(function () {
  const F = window.FANNI;
  const params = new URLSearchParams(location.search);
  const maxPrice = Math.max(...F.products.map(p => p.price));
  const state = {
    occasion: new Set((params.get("occasion") || "").split(",").filter(Boolean)),
    recipient: new Set((params.get("pour") || "").split(",").filter(Boolean)),
    price: +params.get("max") || maxPrice,
    sort: params.get("tri") || "pop"
  };

  const range = F.qs("#f-price");
  range.max = Math.ceil(maxPrice / 5) * 5;
  range.min = Math.floor(Math.min(...F.products.map(p => p.price)) / 5) * 5;
  range.value = state.price;
  F.qs("#sort").value = state.sort;

  const checkList = (list, key, host) => {
    F.qs(host).innerHTML = list.filter(o => o.id !== "sur-mesure").map(o => {
      const n = F.products.filter(p => p[key].includes(o.id)).length;
      return `<label class="check"><input type="checkbox" value="${o.id}" data-key="${key}" ${state[key].has(o.id) ? "checked" : ""}> ${F.L(o)} <span class="count">${n}</span></label>`;
    }).join("");
  };
  checkList(F.occasions, "occasion", "#f-occasion");
  checkList(F.recipients, "recipient", "#f-recipient");

  function filtered() {
    let list = F.products.filter(p =>
      (!state.occasion.size || p.occasion.some(o => state.occasion.has(o))) &&
      (!state.recipient.size || p.recipient.some(r => state.recipient.has(r))) &&
      p.price <= state.price);
    const s = state.sort;
    if (s === "asc") list.sort((a, b) => a.price - b.price);
    else if (s === "desc") list.sort((a, b) => b.price - a.price);
    else if (s === "new") list.sort((a, b) => (b.badge === "new") - (a.badge === "new"));
    else list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || b.reviews - a.reviews);
    return list;
  }

  function render() {
    const list = filtered();
    F.qs("#price-min").textContent = F.money(+range.min);
    F.qs("#price-max").textContent = F.t("up_to", "jusqu'à") + " " + F.money(state.price);
    F.qs("#result-count").textContent = `${list.length} ${list.length > 1 ? F.t("results", "créations") : F.t("result", "création")}`;
    F.qs("#product-grid").innerHTML = list.length
      ? list.map(F.productCard).join("")
      : `<div class="empty-state"><div class="big-emoji">🎀</div><h3>${F.t("no_result_t", "Aucune box ne correspond… pour l'instant")}</h3><p>${F.t("no_result_p", "Essayez d'élargir vos filtres, ou créez une box sur mesure qui lui ressemble.")}</p><a class="btn btn-primary" href="creer-ma-box.html">${F.t("cta_create", "Créer ma box")}</a></div>`;
    // pastilles des filtres actifs
    const chips = [];
    state.occasion.forEach(id => chips.push([id, "occasion", F.L(F.occasion(id))]));
    state.recipient.forEach(id => chips.push([id, "recipient", F.L(F.recipients.find(r => r.id === id))]));
    if (state.price < +range.max) chips.push(["", "price", "≤ " + F.money(state.price)]);
    F.qs("#active-chips").innerHTML = chips.map(([id, k, l]) => `<button class="chip is-active" data-rm="${k}" data-id="${id}" type="button">${l} <span aria-hidden="true">×</span><span class="sr-only">${F.t("remove", "Retirer")}</span></button>`).join("");
    // URL partageable
    const q = new URLSearchParams();
    if (state.occasion.size) q.set("occasion", [...state.occasion].join(","));
    if (state.recipient.size) q.set("pour", [...state.recipient].join(","));
    if (state.price < +range.max) q.set("max", state.price);
    if (state.sort !== "pop") q.set("tri", state.sort);
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
    F.observe(F.qs("#product-grid"));
  }

  document.addEventListener("change", e => {
    const el = e.target;
    if (el.dataset.key) { el.checked ? state[el.dataset.key].add(el.value) : state[el.dataset.key].delete(el.value); render(); }
    if (el.id === "sort") { state.sort = el.value; render(); }
  });
  range.addEventListener("input", () => { state.price = +range.value; render(); });
  F.qs("#f-reset").addEventListener("click", () => {
    state.occasion.clear(); state.recipient.clear(); state.price = +range.max; range.value = range.max;
    F.qsa("#filters input[type=checkbox]").forEach(c => (c.checked = false));
    render();
  });
  F.qs("#active-chips").addEventListener("click", e => {
    const b = e.target.closest("[data-rm]"); if (!b) return;
    if (b.dataset.rm === "price") { state.price = +range.max; range.value = range.max; }
    else { state[b.dataset.rm].delete(b.dataset.id); const c = F.qs(`#filters input[value="${b.dataset.id}"][data-key="${b.dataset.rm}"]`); if (c) c.checked = false; }
    render();
  });

  // panneau de filtres sur mobile
  const panel = F.qs("#filters"), ov = F.qs("#filters-overlay");
  const toggle = open => { panel.classList.toggle("is-open", open); ov.classList.toggle("is-open", open); document.body.style.overflow = open ? "hidden" : ""; };
  F.qs("#filters-open").addEventListener("click", () => toggle(true));
  F.qs("#filters-close").addEventListener("click", () => toggle(false));
  F.qs("#f-apply").addEventListener("click", () => toggle(false));
  ov.addEventListener("click", () => toggle(false));

  render();
})();

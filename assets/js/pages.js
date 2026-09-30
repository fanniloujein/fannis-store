/* Fanni's Store — pages À propos, Contact, FAQ */
(function () {
  const F = window.FANNI, C = F.config;

  /* illustrations déclarées en HTML : <div data-art='{...}' data-seed="x" data-view="1"> */
  F.qsa("[data-art]").forEach(el => {
    try { el.innerHTML = F.art.gift(JSON.parse(el.dataset.art), { seed: el.dataset.seed, view: +el.dataset.view || 0, label: "" }); } catch (e) {}
  });

  /* FAQ */
  const faqWa = F.qs("#faq-wa");
  if (faqWa) faqWa.href = F.wa(F.t("wa_question", "Bonjour Fanni's Store 🤍 J'ai une question : "));

  /* Contact */
  const cards = F.qs("#contact-cards");
  if (cards) {
    const phone = "+" + C.whatsapp.replace(/(\d{3})(\d{2})(\d{3})(\d{3})/, "$1 $2 $3 $4");
    cards.innerHTML = [
      ["ci-wa", F.icons.whatsapp, "WhatsApp", F.t("ct_wa", "Le plus rapide pour commander") + " · " + phone, F.wa(F.t("wa_hello", "Bonjour Fanni's Store 🤍 "))],
      ["ci-ig", F.icons.instagram, "Instagram", C.instagramHandle + " · " + F.t("ct_ig", "nos créations au quotidien"), C.instagram],
      ["ci-fb", F.icons.facebook, "Facebook", "Fanni's Store", C.facebook],
      ["ci-tt", F.icons.tiktok, "TikTok", F.t("ct_tt", "Les coulisses de l'atelier"), C.tiktok],
      ["ci-mail", F.icons.mail, "Email", C.email, "mailto:" + C.email]
    ].map(([cls, ico, t, s, h]) => `<a class="contact-card" href="${h}" ${h.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}><span class="ci ${cls}">${ico}</span><span><b>${t}</b><small>${s}</small></span></a>`).join("");

    const form = F.qs("#contact-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      let first = null;
      ["name", "email", "message"].forEach(n => {
        const el = form[n], ok = el.value.trim() && el.checkValidity();
        el.classList.toggle("is-invalid", !ok);
        if (!ok && !first) first = el;
      });
      if (first) { first.focus(); F.toast(F.t("ct_missing", "Merci de compléter les champs marqués d'une étoile 🤍")); return; }
      const body = `${form.subject.value}\n\n${form.message.value}\n\n— ${form.name.value}${form.phone.value ? " · " + form.phone.value : ""} · ${form.email.value}`;
      const url = form.via.value === "whatsapp" ? F.wa(`${F.t("wa_hello", "Bonjour Fanni's Store 🤍 ")}\n${body}`)
        : `mailto:${C.email}?subject=${encodeURIComponent("[Fanni's Store] " + form.subject.value)}&body=${encodeURIComponent(body)}`;
      if (url.startsWith("mailto:")) location.href = url; else window.open(url, "_blank", "noopener");
      F.toast(F.t("ct_ok", "Merci pour votre message ✨ Nous vous répondons très vite."));
      form.reset();
    });
  }
  F.observe();
})();

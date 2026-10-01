/*
  LAYOUT COMPARTILHADO — header, rodapé e blocos de contato de todas as páginas.
  Cada página só tem <header data-header>, <footer data-footer> e <section data-cta>;
  o conteúdo vem daqui (assim o menu é editado em um lugar só).
*/
const Layout = (function () {
  const NAV = [
    { href: "work.html", label: "Work", page: "work" },
    { href: "services.html", label: "Services", page: "services" },
    { href: "about.html", label: "About", page: "about" }
  ];

  const waLink = () => SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage || "")}`
    : "";

  function contactButtons() {
    return `
      <a class="cta-button" href="mailto:${SITE.email}">${SITE.email} <span aria-hidden="true">→</span></a>
      ${waLink() ? `<a class="cta-link" href="${waLink()}" target="_blank" rel="noopener">or message me on WhatsApp ↗</a>` : ""}`;
  }

  const socialLinks = () => SITE.social.map((s) =>
    `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join("");

  function renderHeader() {
    const el = document.querySelector("[data-header]");
    if (!el) return;
    el.innerHTML = `
      <a class="logo" href="index.html">${SITE.name}</a>
      <nav class="site-nav">
        <ul class="nav-links">
          ${NAV.map((n) => `<li><a href="${n.href}" data-nav="${n.page}">${n.label}</a></li>`).join("")}
        </ul>
        <a class="nav-cta" href="contact.html" data-nav="contact">Let's talk</a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
      </nav>`;

    const toggle = el.querySelector(".nav-toggle");
    const links = el.querySelector(".nav-links");
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", (e) => { if (e.target.closest("a")) links.classList.remove("open"); });

    const onScroll = () => el.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function renderFooter() {
    const el = document.querySelector("[data-footer]");
    if (!el) return;
    el.innerHTML = `
      <span>© ${new Date().getFullYear()} ${SITE.name}</span>
      <a class="footer-mail" href="mailto:${SITE.email}">${SITE.email}</a>
      <ul class="footer-social">${socialLinks()}</ul>`;
  }

  // blocos "Have a project in mind?" (fim da home, dos cases e das páginas internas)
  function fillCTAs(root) {
    (root || document).querySelectorAll("[data-cta]:empty").forEach((el) => {
      el.classList.add("cta-block");
      el.innerHTML = `
        <div class="wrap">
          <p class="section-index reveal">(get in touch)</p>
          <h2 class="reveal">Have a project in mind?</h2>
          <div class="cta-actions reveal">${contactButtons()}</div>
        </div>`;
    });
  }

  // página Contact
  function fillContact(root) {
    const r = root || document;
    const rows = [
      { label: "Email", value: SITE.email, href: "mailto:" + SITE.email },
      ...(waLink() ? [{ label: "WhatsApp", value: "Send a message ↗", href: waLink(), ext: true }] : []),
      ...SITE.social.map((s) => ({ label: s.label, value: "Follow ↗", href: s.url, ext: true }))
    ];
    r.querySelectorAll("[data-contact-list]").forEach((el) => {
      el.innerHTML = rows.map((row) => `
        <a class="contact-row reveal" href="${row.href}"${row.ext ? ' target="_blank" rel="noopener"' : ""}>
          <span class="contact-label">${row.label}</span>
          <span class="contact-value">${row.value}</span>
        </a>`).join("");
    });
    r.querySelectorAll("[data-contact-location]").forEach((el) => { el.textContent = SITE.location; });
  }

  function setActive(page) {
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === page || (page === "project" && a.dataset.nav === "work")) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  renderHeader();
  renderFooter();
  return { fillCTAs, fillContact, setActive };
})();

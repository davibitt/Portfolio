// Gradiente do card/capa: usa as cores do projeto (js/projects.js)
function projectGradient(p) {
  const c = p.gradiente && p.gradiente.length ? p.gradiente : ["#6A30C3", "#49BFE3"];
  return `linear-gradient(135deg, ${c[0]}, ${c[1] || c[0]})`;
}

function cardHtml(p, i) {
  // alterna largo/estreito a cada linha: [largo | estreito], [estreito | largo]...
  const rowEven = Math.floor(i / 2) % 2 === 0;
  const sizeClass = rowEven === (i % 2 === 0) ? "is-large" : "is-normal";
  const bg = p.imagem ? `background-image:url('${p.imagem}');` : "";
  const video = p.capaVideo
    ? `<video class="card-video" src="${p.capaVideo}" muted loop playsinline preload="metadata" data-autoplay></video>` : "";
  return `
    <a class="project-card ${sizeClass} reveal" href="project.html?id=${encodeURIComponent(p.id)}"
       style="--card-gradient:${projectGradient(p)};${bg}">
      ${video}
      <div class="card-top">
        <span>${String(i + 1).padStart(2, "0")}</span>
        <span>${p.ano || ""}</span>
      </div>
      <div class="card-bottom">
        <span class="cat">${p.categoria}</span>
        <h3>${p.titulo}</h3>
        <p class="resumo">${p.resumo}</p>
        <span class="card-link">View case <span aria-hidden="true">→</span></span>
      </div>
    </a>`;
}

// Grid de projetos: data-filter="featured" (home) mostra só os em destaque; "all" mostra todos
function renderProjectsGrid(list) {
  document.querySelectorAll("[data-projects-grid]").forEach((grid) => {
    if (typeof PROJECTS === "undefined") return;
    const items = list || (grid.dataset.filter === "featured"
      ? PROJECTS.filter((p) => p.destaque !== false)
      : PROJECTS);
    grid.innerHTML = items.map(cardHtml).join("");
  });
}

// Filtro por categoria na página Work
function setupWorkFilter() {
  const bar = document.querySelector("[data-work-filter]");
  if (!bar || typeof PROJECTS === "undefined") return;
  const cats = [...new Set(PROJECTS.map((p) => p.categoria))];
  const count = (c) => PROJECTS.filter((p) => !c || p.categoria === c).length;
  bar.innerHTML = [["", "All"], ...cats.map((c) => [c, c])]
    .map(([val, label], i) => `<button class="filter-btn${i === 0 ? " is-active" : ""}" data-cat="${val}">${label} (${count(val)})</button>`)
    .join("");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    const cat = btn.dataset.cat;
    renderProjectsGrid(PROJECTS.filter((p) => !cat || p.categoria === cat));
    setupReveal();
    setupVideos();
  });
}

// Entrada suave dos elementos ao rolar a página
function setupReveal() {
  const items = document.querySelectorAll(".reveal:not(.in)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
}

// Vídeos: só tocam quando estão na tela (economiza bateria e dados)
function setupVideos() {
  const vids = document.querySelectorAll("video[data-autoplay]:not([data-ready])");
  if (!vids.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !reduce) e.target.play().catch(() => {});
      else e.target.pause();
    });
  }, { threshold: 0.25 }) : null;
  vids.forEach((v) => {
    v.dataset.ready = "1";
    v.muted = true;
    if (io) io.observe(v); else if (!reduce) v.play().catch(() => {});
  });
}

// Inicializa a página atual (a prévia também chama isso ao trocar de página)
function initPage(opts) {
  opts = opts || {};
  const page = document.body.dataset.page;
  renderProjectsGrid();
  setupWorkFilter();
  if (window.__tlCleanup) window.__tlCleanup(); // desliga a linha do tempo do case anterior (se houver)
  if (window.__lyCleanup) window.__lyCleanup(); // idem para as animações do logo (Lynda)
  if (window.__exCleanup) window.__exCleanup(); // idem para o mapa/rota do case "expedição" (NOMAD)
  if (window.__vgCleanup) window.__vgCleanup(); // idem para o fantasma/cones/cena final do case "vigília" (VIGIL)
  if (document.querySelector("[data-project-container]")) renderProjectPage(opts.id);
  else document.documentElement.style.removeProperty("--header-bg");
  Layout.fillCTAs();
  Layout.fillContact();
  Layout.setActive(page);
  setupReveal();
  setupVideos();
}

document.addEventListener("DOMContentLoaded", () => initPage());

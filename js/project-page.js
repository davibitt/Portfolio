// Monta a página de case (project.html?id=...) a partir de PROJECTS (js/projects.js)
function renderProjectPage(id) {
  if (id === undefined) id = new URLSearchParams(window.location.search).get("id");
  const container = document.querySelector("[data-project-container]");
  if (!container || typeof PROJECTS === "undefined") return;

  const index = PROJECTS.findIndex((p) => p.id === id);
  const project = PROJECTS[index];

  if (!project) {
    container.innerHTML = `
      <div class="wrap not-found">
        <a class="back-link" href="work.html">&larr; All work</a>
        <h1>Project not found</h1>
        <p>Check the link or head back to see all projects.</p>
      </div>
    `;
    document.title = "Project not found";
    return;
  }

  document.title = project.titulo + " — Davi Bittencourt";

  if (project.estilo === "expedicao") {
    if (project.tema && project.tema.fundo) document.documentElement.style.setProperty("--header-bg", `color-mix(in srgb, ${project.tema.fundo} 92%, transparent)`);
    loadCaseFonts(project.fontesCase);
    container.innerHTML = renderExpedition(project) + `<section data-cta></section>` + nextProjectHtml(index);
    setupExpedition(container);
    if (typeof setupVideos === "function") setupVideos();
    return;
  }

  if (project.estilo === "vigilia") {
    if (project.tema && project.tema.fundo) document.documentElement.style.setProperty("--header-bg", `color-mix(in srgb, ${project.tema.fundo} 92%, transparent)`);
    loadCaseFonts(project.fontesCase);
    container.innerHTML = renderVigil(project) + `<section data-cta></section>` + nextProjectHtml(index);
    setupVigil(container);
    return;
  }

  if (project.estilo === "timeline") {
    if (project.tema && project.tema.fundo) document.documentElement.style.setProperty("--header-bg", `color-mix(in srgb, ${project.tema.fundo} 92%, transparent)`);
    loadCaseFonts(project.fontesCase);
    container.innerHTML = renderTimeline(project) + `<section data-cta></section>` + nextProjectHtml(index);
    setupTimeline(container);
    return;
  }

  if (project.secoes && project.secoes.length) {
    const fundo = project.tema && project.tema.fundo;
    if (fundo) document.documentElement.style.setProperty("--header-bg", `color-mix(in srgb, ${fundo} 92%, transparent)`);
    container.innerHTML = renderCase(project) + `<section data-cta></section>` + nextProjectHtml(index);
    setupCarousels(container);
    setupSwatches(container);
    setupLynda(container);
    if (typeof setupVideos === "function") setupVideos();
    return;
  }

  const cores = project.gradiente && project.gradiente.length ? project.gradiente : ["#6A30C3", "#49BFE3"];
  const grad = (a, b) => `linear-gradient(135deg, ${a}, ${b})`;
  const isVideo = (src) => /\.(mp4|webm|mov)(\?|$)/i.test(src || "");
  const media = (src, fallback, cls) => !src
    ? `<div class="${cls} is-placeholder" style="background:${fallback}"></div>`
    : isVideo(src)
      ? `<video class="${cls}" src="${src}" muted loop playsinline preload="none" data-autoplay></video>`
      : `<img class="${cls}" src="${src}" alt="${project.titulo}">`;

  // galeria: usa project.galeria (array de imagens); sem imagens, mostra 3 espaços de exemplo
  const galeria = project.galeria && project.galeria.length ? project.galeria : ["", "", ""];
  const galeriaHtml = galeria.map((src, i) => media(src,
    i % 2 ? grad(cores[1] || cores[0], cores[0]) : grad(cores[0], cores[1] || cores[0]),
    "case-media reveal" + (i === 0 ? " is-wide" : ""))).join("");


  container.innerHTML = `
    <div class="wrap project-hero">
      <a class="back-link" href="work.html">&larr; All work</a>
      <span class="cat reveal">${project.categoria}</span>
      <h1 class="reveal">${project.titulo}</h1>
      <div class="project-meta-bar reveal">
        ${project.ano ? `<div><span>Year</span>${project.ano}</div>` : ""}
        <div><span>Category</span>${project.categoria}</div>
        <div><span>Tools</span>${project.ferramentas.join(", ")}</div>
        ${project.linkDemo ? `<div><span>Live</span><a href="${project.linkDemo}" target="_blank" rel="noopener">Visit →</a></div>` : ""}
      </div>
    </div>

    <div class="wrap">
      ${media(project.imagem, grad(cores[0], cores[1] || cores[0]), "case-cover reveal")}
    </div>

    <div class="wrap case-intro reveal">
      <span class="section-index">The project</span>
      <p>${project.descricao}</p>
    </div>

    <div class="wrap case-gallery">
      ${galeriaHtml}
    </div>

    <section data-cta></section>
  ` + nextProjectHtml(index);
}

function nextProjectHtml(index) {
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  if (!next || PROJECTS.length < 2) return "";
  return `
    <a class="next-project" href="project.html?id=${encodeURIComponent(next.id)}">
      <div class="wrap">
        <span class="section-index">Next project</span>
        <span class="next-title">${next.titulo} <span aria-hidden="true">→</span></span>
      </div>
    </a>`;
}

/* =========================================================
   CASE EDITORIAL (projetos com "secoes")
   Cada layout é uma função que devolve o HTML da seção.
   ========================================================= */

// imagem real ou espaço reservado com a legenda do que vai ali
// eager = imagem do topo (capa): carrega já e com prioridade, em vez de "lazy"
const imgLoad = (eager) => eager ? `fetchpriority="high"` : `loading="lazy"`;
function caseMedia(m, i, cls, eager) {
  if (!m) return "";
  const ratio = m.proporcao || "4/3";
  const tone = m.tom || ["escuro", "claro", "destaque"][i % 3];
  // vídeo: mp4/webm em loop, sem som; só toca quando aparece na tela (ver setupVideos em main.js)
  if (m.video) {
    return `<figure class="cm ${cls || ""}" style="aspect-ratio:${ratio}"><video src="${m.video}"${m.poster ? ` poster="${m.poster}"` : ""} muted loop playsinline preload="none" data-autoplay aria-label="${m.legenda || ""}"></video></figure>`;
  }
  if (m.img) {
    const pos = m.posicao ? ` style="object-position:${m.posicao}"` : "";
    return `<figure class="cm ${cls || ""}" style="aspect-ratio:${ratio}"><img src="${m.img}" alt="${m.legenda || ""}" ${imgLoad(eager)}${pos}></figure>`;
  }
  return `<figure class="cm is-ph tone-${tone} ${cls || ""}" style="aspect-ratio:${ratio}">
      <figcaption><span>visual</span>${m.legenda || ""}</figcaption>
    </figure>`;
}

const caseLabel = (s) => `<p class="cs-label"><span>${s.numero}</span>${s.nome}</p>`;
const caseParas = (s, from) => (s.textos || []).slice(from || 0).map((t) => `<p>${t}</p>`).join("");
const caseMedias = (s, from, cls, to) => (s.midias || []).slice(from || 0, to).map((m, i) => caseMedia(m, i + (from || 0), cls)).join("");

const CASE_LAYOUTS = {
  // animação de abertura: a curva do "a" vira a estrela (precisa de "logoVetor" no projeto)
  construcao: (s, p) => lyBuildHtml(s, p),
  // fechamento: a estrela troca a versão da marca (precisa de "logoVetor" e "simbolo")
  fecho: (s, p) => lyCloseHtml(s, p),
  intro: (s, p) => `
    <section class="cs cs-intro wrap">
      <div class="reveal">${caseLabel(s)}</div>
      <div class="cs-intro-body reveal">
        <p class="cs-lead">${s.textos[0]}</p>
        ${caseParas(s, 1)}
        ${p.info ? `<dl class="cs-info">${p.info.map((i) => `<div><dt>${i.label}</dt><dd>${i.valor}</dd></div>`).join("")}</dl>` : ""}
      </div>
    </section>`,

  mosaico: (s) => `
    <section class="cs cs-mosaic">
      <div class="wrap">
        <div class="reveal">${caseLabel(s)}</div>
        <h2 class="cs-display reveal">${s.titulo}</h2>
        <div class="cs-aside cs-text reveal">${caseParas(s)}</div>
        <div class="mosaic">${(s.midias || []).map((m, i) => caseMedia(m, i, "reveal m" + i)).join("")}</div>
      </div>
    </section>`,

  fixo: (s) => `
    <section class="cs cs-sticky wrap">
      <div class="sticky-col">
        <div class="sticky-inner reveal">
          ${caseLabel(s)}
          <h2 class="cs-h2">${s.titulo}</h2>
          <div class="cs-text">${caseParas(s)}</div>
        </div>
      </div>
      <div class="stack">${(s.midias || []).map((m, i) => caseMedia({ proporcao: "4/5", ...m }, i, "reveal")).join("")}</div>
    </section>`,

  banner: (s) => `
    <section class="cs cs-banner">
      <div class="wrap cs-split">
        <div class="reveal">${caseLabel(s)}<h2 class="cs-h2">${s.titulo}</h2></div>
        <div class="cs-text reveal">${caseParas(s)}</div>
      </div>
      <div class="bleed reveal">${caseMedia(s.midias[0], 0, "is-bleed")}</div>
      <div class="wrap row-4">${caseMedias(s, 1, "reveal")}</div>
    </section>`,

  claro: (s) => `
    <section class="cs cs-light">
      <div class="wrap">
        <div class="reveal">${caseLabel(s)}</div>
        <div class="cs-split">
          <h2 class="cs-display reveal">${s.titulo}</h2>
          <div class="cs-text reveal">${caseParas(s)}</div>
        </div>
        <div class="light-grid">${(s.midias || []).map((m, i) => caseMedia(m, i, "reveal lg" + i)).join("")}</div>
      </div>
    </section>`,

  tipografia: (s) => {
    loadCaseFonts(s.fontes);
    return `
    <section class="cs cs-type wrap">
      <div class="cs-split">
        <div class="reveal">${caseLabel(s)}<h2 class="cs-h2">${s.titulo}</h2></div>
        <div class="cs-text reveal">${caseParas(s)}</div>
      </div>
      <div class="type-cards">
        ${(s.fontes || []).map((f) => `
          <div class="type-card reveal" style="font-family:${f.familia}">
            <span class="type-role">${f.papel}</span>
            <span class="type-aa">Aa</span>
            <span class="type-sample${f.caixaAlta ? " is-upper" : ""}">${f.exemplo || ""}</span>
            <span class="type-alpha${f.caixaAlta ? " is-upper" : ""}">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789</span>
          </div>`).join("")}
      </div>
      ${s.notaFontes ? `<p class="type-note">${s.notaFontes}</p>` : `<div class="type-note"></div>`}
      ${s.alfabeto ? typeShowcase(s.alfabeto) : ""}
      ${(s.midias || []).length ? `<div class="row-2">${caseMedias(s, 0, "reveal")}</div>` : ""}
    </section>`;
  },

  paleta: (s) => `
    <section class="cs cs-palette">
      <div class="wrap cs-split">
        <div class="reveal">${caseLabel(s)}<h2 class="cs-h2">${s.titulo}</h2></div>
        <div class="cs-text reveal">${caseParas(s)}</div>
      </div>
      <div class="wrap swatches">
        ${(s.cores || []).map((c) => `
          <div class="swatch reveal" style="background:${c.hex};color:${c.texto}">
            <span class="sw-name">${c.nome}</span>
            <span class="sw-hex">${c.hex}</span>
          </div>`).join("")}
      </div>
      <div class="wrap${(s.midias || []).length > 1 ? " row-2" : ""}">${caseMedias(s, 0, "reveal")}</div>
    </section>`,

  selo: (s) => `
    <section class="cs cs-seal wrap">
      <div class="seal-top">
        ${caseMedia({ proporcao: "1/1", ...s.midias[0] }, 2, "is-round reveal")}
        <div class="reveal">${caseLabel(s)}<h2 class="cs-h2">${s.titulo}</h2><div class="cs-text">${caseParas(s)}</div></div>
      </div>
      <div class="row-${Math.min(Math.max((s.midias || []).length - 1, 2), 4)}">
        ${(s.midias || []).slice(1).map((m, i, arr) => caseMedia({ proporcao: "1/1", ...m }, i, "reveal" + (i === arr.length - 1 ? " is-round" : ""))).join("")}
      </div>
    </section>`,

  carrossel: (s) => `
    <section class="cs cs-carousel">
      <div class="wrap carousel-head reveal">
        <div>${caseLabel(s)}<h2 class="cs-h2">${s.titulo}</h2><div class="cs-text">${caseParas(s)}</div></div>
      </div>
      <div class="carousel" data-carousel tabindex="0" aria-label="${s.nome}">
        ${(s.midias || []).map((m, i) => caseMedia({ proporcao: "3/4", ...m }, i, "carousel-item")).join("")}
      </div>
      <p class="wrap carousel-hint">Drag to explore →</p>
    </section>`,

  final: (s) => `
    <section class="cs cs-final">
      <div class="wrap final-head reveal">
        ${caseLabel(s)}
        <h2 class="cs-giant">${s.titulo}</h2>
        <p class="final-text">${s.textos[0]}</p>
      </div>
      <div class="wrap bento">${(s.midias || []).map((m, i) => caseMedia(m, i, "reveal b" + i)).join("")}</div>
    </section>`,

  reflexao: (s) => `
    <section class="cs cs-reflection wrap">
      <div class="reveal">${caseLabel(s)}</div>
      <h2 class="cs-display reveal">${s.titulo}</h2>
      <div class="reflection-body cs-text reveal">${caseParas(s)}</div>
    </section>`
};

// alfabeto gigante em faixas deslizantes; cada linha é duplicada para o loop ficar contínuo
function typeShowcase(a) {
  const styles = ["", " is-outline is-reverse", " is-small"];
  const rows = (a.linhas || []).map((txt, i) => `
      <div class="marquee${styles[i % styles.length]}">
        <div class="marquee-track"><span>${txt}</span><span>${txt}</span></div>
      </div>`).join("");
  return `
    <div class="type-showcase reveal" style="font-family:${a.familia}" aria-hidden="true">${rows}
    </div>`;
}

function renderCase(p) {
  const t = p.tema || {};
  const vars = [
    t.fundo && `--c-bg:${t.fundo};--c-dark:${t.fundo}`,
    t.texto && `--c-fg:${t.texto}`,
    t.destaque && `--c-accent:${t.destaque}`,
    t.claro && `--c-light:${t.claro}`
  ].filter(Boolean).join(";");

  const hero = `
    <header class="case-hero wrap">
      <a class="back-link" href="work.html">&larr; All work</a>
      <p class="case-kicker reveal">${p.categoria}${p.ano ? " — " + p.ano : ""}</p>
      <h1 class="case-title reveal">${p.titulo}</h1>
      <div class="case-hero-row reveal">
        ${p.subtitulo ? `<p class="case-sub">${p.subtitulo}</p>` : ""}
        ${p.tagline ? `<p class="case-tagline">${p.tagline}</p>` : ""}
      </div>
    </header>
    ${p.capa ? `<div class="bleed case-cover-bleed reveal">${caseMedia(p.capa, 2, "is-bleed", true)}</div>` : ""}`;

  const body = p.secoes.map((s) => {
    const fn = CASE_LAYOUTS[s.layout];
    if (!fn) { console.warn("Layout desconhecido:", s.layout); return ""; }
    return fn(s, p);
  }).join("");

  return `<article class="case" data-id="${p.id}" style="${vars}">${hero}${body}</article>`;
}

// carrega do Google Fonts as fontes usadas no espécime (só quando o case pede)
function loadCaseFonts(fontes) {
  (fontes || []).forEach((f) => {
    // fonte própria em arquivo (ex: assets/fonts/Sylvena.woff2). Se o arquivo não existir, usa a reserva.
    if (f.arquivo && f.nomeFonte && "FontFace" in window && !document.querySelector(`[data-font-loaded="${f.nomeFonte}"]`)) {
      document.documentElement.setAttribute("data-font-loaded", f.nomeFonte);
      new FontFace(f.nomeFonte, `url("${f.arquivo}")`).load()
        .then((font) => document.fonts.add(font))
        .catch(() => console.info(`Fonte "${f.nomeFonte}" não encontrada em ${f.arquivo} — usando a reserva.`));
    }
    if (!f.googleFont || document.querySelector(`link[data-case-font="${f.googleFont}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${f.googleFont}&display=swap`;
    link.dataset.caseFont = f.googleFont;
    document.head.appendChild(link);
  });
}

// carrossel: arrastar com o mouse (no toque, a rolagem nativa já funciona)
function setupCarousels(root) {
  root.querySelectorAll("[data-carousel]").forEach((el) => {
    let down = false, startX = 0, startScroll = 0, moved = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      e.preventDefault(); // impede o navegador de "pegar" a imagem ou selecionar texto
      down = true; moved = false; startX = e.clientX; startScroll = el.scrollLeft;
      el.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false; el.classList.remove("is-dragging");
    });
    el.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);
  });
}

// (a página é montada por initPage() em js/main.js)

// paleta: a cor sob o mouse cresce e as outras encolhem, animando as colunas do grid
function setupSwatches(root) {
  const desktop = window.matchMedia("(min-width: 721px) and (hover: hover)");
  root.querySelectorAll(".swatches").forEach((row) => {
    const items = [...row.querySelectorAll(".swatch")];
    row.style.setProperty("--sw-count", items.length);
    const reset = () => { row.style.gridTemplateColumns = ""; };
    items.forEach((el, i) => {
      el.addEventListener("mouseenter", () => {
        if (!desktop.matches) return;
        row.style.gridTemplateColumns = items.map((_, j) => (j === i ? "1.7fr" : "1fr")).join(" ");
      });
    });
    row.addEventListener("mouseleave", reset);
  });
}


// suavizações usadas pelo case NOMAD
const glowClamp = (v) => Math.min(1, Math.max(0, v));
const glowEase = (t) => t * t * (3 - 2 * t);

// case com fundo opaco cobrindo a tela inteira: o fluido do site não aparece, então pausa (economiza GPU).
// Devolve a função de limpeza.
function pauseFluidUnder(art) {
  const check = () => {
    const r = art.getBoundingClientRect();
    window.__fluidPaused = r.top <= 0 && r.bottom >= window.innerHeight;
  };
  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  check();
  return () => {
    window.removeEventListener("scroll", check);
    window.removeEventListener("resize", check);
    window.__fluidPaused = false;
  };
}


/* =========================================================
   CASE "LINHA DO TEMPO" (projetos com estilo: "timeline")
   Orgânico, sem caixas: uma linha percorre a página, é desenhada
   conforme a rolagem e termina num ponto REC piscando.
   ========================================================= */

// timecode decorativo de cada seção (HH:MM:SS:FF)
function tlCode(i) {
  const frames = 18 + i * 437;
  const pad = (n) => String(n).padStart(2, "0");
  return `00:${pad(Math.floor(frames / 1440))}:${pad(Math.floor(frames / 24) % 60)}:${pad(frames % 24)}`;
}
const tlLabel = (s, i) => `<p class="tl-code reveal"><span>${tlCode(i)}</span>${s.nome}</p>`;
const tlParas = (s) => (s.textos || []).map((t) => `<p>${t}</p>`).join("");

// imagem, vídeo ou espaço reservado — sem caixa: só a imagem, legenda e marcas de visor
function tlMedia(m, cls, eager) {
  if (!m) return "";
  const pos = m.posicao ? ` style="object-position:${m.posicao}"` : "";
  let inner;
  if (m.video) inner = `<video src="${m.video}"${m.poster ? ` poster="${m.poster}"` : ""} muted loop playsinline preload="metadata" data-autoplay${pos}></video>`;
  else if (m.img) inner = `<img src="${m.img}" alt="${m.legenda || ""}" ${imgLoad(eager)}${pos}>`;
  else inner = `<div class="tl-ph"><span>awaiting image</span></div>`;
  return `
    <figure class="tl-fig reveal ${cls || ""}"${m.velocidade ? ` data-speed="${m.velocidade}"` : ""}>
      <div class="tl-frame" style="aspect-ratio:${m.proporcao || "3/2"}">${inner}</div>
      ${m.legenda ? `<figcaption>${m.legenda}</figcaption>` : ""}
    </figure>`;
}

const TL_LAYOUTS = {
  "tl-intro": (s, p, i) => `
    <section class="tl-sec tl-intro">
      <div class="wrap">
        ${tlLabel(s, i)}
        <p class="tl-lead reveal">${s.textos[0]}</p>
        ${p.info ? `<dl class="tl-slate reveal">${p.info.map((x) => `<div><dt>${x.label}</dt><dd>${x.valor}</dd></div>`).join("")}</dl>` : ""}
      </div>
    </section>`,

  "tl-statement": (s, p, i) => {
    const m = s.midias || [];
    return `
    <section class="tl-sec tl-statement">
      <div class="wrap">
        ${tlLabel(s, i)}
        <h2 class="tl-display reveal">${s.titulo}</h2>
        <div class="tl-text tl-offset reveal">${tlParas(s)}</div>
      </div>
      <div class="wrap tl-row tl-row-concept">
        ${tlMedia(m[0], "tl-c-main")}
        ${m[1] ? tlMedia(m[1], "tl-c-detail") : ""}
      </div>
    </section>`;
  },

  "tl-feature": (s, p, i) => {
    const m = s.midias || [];
    return `
    <section class="tl-sec tl-feature">
      <div class="wrap tl-feature-grid">
        <div class="tl-feature-text reveal">${tlLabel(s, i)}<h2 class="tl-h2">${s.titulo}</h2><div class="tl-text">${tlParas(s)}</div></div>
        ${tlMedia(m[0], "tl-feature-main")}
      </div>
      ${m[1] ? `<div class="wrap tl-row">${tlMedia(m[1], "tl-f-detail")}</div>` : ""}
    </section>`;
  },

  "tl-rec": (s, p, i) => `
    <section class="tl-sec tl-rec">
      <div class="wrap tl-rec-inner">
        ${tlLabel(s, i)}
        <div class="tl-rec-dot" aria-hidden="true"></div>
        <h2 class="tl-display reveal">${s.titulo}</h2>
        <div class="tl-text reveal">${tlParas(s)}</div>
      </div>
    </section>`,

  "tl-type": (s, p, i) => `
    <section class="tl-sec tl-type">
      <div class="wrap">
        <div class="tl-split">
          <div class="reveal">${tlLabel(s, i)}<h2 class="tl-h2">${s.titulo}</h2></div>
          <div class="tl-text reveal">${tlParas(s)}</div>
        </div>
        <div class="tl-type-show">
          ${(s.fontes || []).map((f) => `
            <div class="tl-typeface reveal" style="font-family:${f.familia}">
              <span class="tl-type-aa">Aa</span>
              <div>
                <span class="tl-type-role">${f.papel}</span>
                <span class="tl-type-sample">${f.exemplo}</span>
                <span class="tl-type-alpha">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz · 0123456789</span>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </section>`,

  // cena "gravando o nome": a tela trava, o nome passa sob a agulha de edição e vai sendo gravado
  "tl-scrub": (s, p, i) => {
    const name = (s.texto || p.titulo).toUpperCase();
    const letters = [...name].map((ch) => ch === " " ? `<span class="sc-space"></span>` : `<span class="sc-l">${ch}</span>`).join("");
    const sub = [...(s.legenda || "")].map((ch) => `<span>${ch === " " ? "&nbsp;" : ch}</span>`).join("");
    return `
    <section class="tl-scrub" aria-label="${s.texto || p.titulo} — ${s.legenda || ""}">
      <div class="sc-sticky">
        <div class="sc-hud wrap" aria-hidden="true">
          <span class="tl-rec-live sc-state"><i></i><b>REC</b></span>
          <span class="sc-tc">00:00:00:00</span>
        </div>
        <div class="sc-stage" aria-hidden="true">
          <div class="sc-strip">${letters}</div>
          <div class="sc-playhead"><span></span></div>
        </div>
        <div class="sc-ruler" aria-hidden="true"></div>
        <p class="sc-sub" aria-hidden="true">${sub}</p>
        <div class="sc-flash" aria-hidden="true"></div>
      </div>
    </section>`;
  },

  "tl-palette": (s, p, i) => `
    <section class="tl-sec tl-palette">
      <div class="wrap tl-split">
        <div class="reveal">${tlLabel(s, i)}<h2 class="tl-h2">${s.titulo}</h2></div>
        <div class="tl-text reveal">${tlParas(s)}</div>
      </div>
      <div class="wrap tl-swatches">
        ${(s.cores || []).map((c) => `
          <div class="tl-swatch is-${c.tamanho || "grande"} reveal">
            <span class="tl-swatch-dot" style="background:${c.hex}"></span>
            <span class="tl-swatch-name">${c.nome}</span>
            <span class="tl-swatch-hex">${c.hex}</span>
          </div>`).join("")}
      </div>
    </section>`,

  "tl-video": (s, p, i) => {
    const m = (s.midias || [])[0] || {};
    const V = s.animacao && typeof VETORES !== "undefined" && VETORES[p.logoVetor];
    return `
    <section class="tl-sec tl-video">
      <div class="wrap tl-split">
        <div class="reveal">${tlLabel(s, i)}<h2 class="tl-h2">${s.titulo}</h2></div>
        <div class="tl-text reveal">${tlParas(s)}</div>
      </div>
      <div class="tl-viewfinder reveal">
        ${V ? tlTakeHtml(V, p) : `
        ${tlMedia({ proporcao: "16/9", ...m, legenda: "" })}
        <div class="tl-hud" aria-hidden="true">
          <span class="tl-rec-live"><i></i>REC</span>
          <span data-timecode>00:00:00:00</span>
        </div>`}
        <p class="wrap tl-video-cap">${m.legenda || ""}</p>
      </div>
    </section>`;
  },

  "tl-scatter": (s, p, i) => `
    <section class="tl-sec tl-scatter">
      <div class="wrap tl-scatter-head">
        <div class="reveal">${tlLabel(s, i)}<h2 class="tl-display">${s.titulo}</h2></div>
        <div class="tl-text reveal">${tlParas(s)}</div>
      </div>
      <div class="wrap tl-scatter-field">
        ${(s.midias || []).map((m, k) => tlMedia(m, "tl-s" + (k % 6))).join("")}
      </div>
    </section>`
};

function renderTimeline(p) {
  const t = p.tema || {};
  const vars = [t.fundo && `--t-bg:${t.fundo}`, t.texto && `--t-fg:${t.texto}`, t.destaque && `--t-accent:${t.destaque}`].filter(Boolean).join(";");
  const [first, ...rest] = p.titulo.split(" ");
  const hero = `
    <header class="tl-hero">
      <div class="wrap">
        <a class="back-link" href="work.html">&larr; All work</a>
        <div class="tl-hud-top reveal"><span class="tl-rec-live"><i></i>REC</span><span data-timecode>00:00:00:00</span><span>${p.categoria}${p.ano ? " — " + p.ano : ""}</span></div>
        <h1 class="tl-title reveal"><span>${first}</span>${rest.length ? `<span>${rest.join(" ")}</span>` : ""}</h1>
        ${p.subtitulo ? `<p class="tl-sub reveal">${p.subtitulo}</p>` : ""}
      </div>
      ${p.capa ? tlMedia(p.capa, "tl-cover", true) : ""}
    </header>`;
  const body = p.secoes.map((s, i) => {
    const fn = TL_LAYOUTS[s.layout];
    if (!fn) { console.warn("Layout desconhecido:", s.layout); return ""; }
    return fn(s, p, i);
  }).join("");
  return `
    <article class="tl-case" style="${vars}">
      <svg class="tl-line" aria-hidden="true"><path class="tl-line-base"/><path class="tl-line-draw"/></svg>
      <span class="tl-end-dot" aria-hidden="true"></span>
      ${hero}${body}
    </article>`;
}

// linha do tempo + timecode correndo + leve parallax
function setupTimeline(root) {
  if (window.__tlCleanup) window.__tlCleanup();
  const art = root.querySelector(".tl-case");
  if (!art) return;
  const svg = art.querySelector(".tl-line");
  const base = svg.querySelector(".tl-line-base");
  const draw = svg.querySelector(".tl-line-draw");
  const dot = art.querySelector(".tl-end-dot");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let len = 0, startY = 0, endY = 0;

  // curva orgânica em "S", com tangentes verticais em cada ponto (fica contínua, sem quinas)
  function build() {
    const w = art.clientWidth, h = art.offsetHeight;
    const amp = w < 720 ? 0.3 : 0.36;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.style.height = h + "px";
    const hero = art.querySelector(".tl-hero");
    startY = hero ? hero.querySelector(".tl-sub, .tl-title").getBoundingClientRect().bottom - art.getBoundingClientRect().top + 40 : 200;
    endY = h - 64;
    const seg = Math.max(420, Math.min(760, (endY - startY) / 9));
    let x = w * 0.5, y = startY, k = 0, d = `M ${x} ${y}`;
    while (y + seg < endY - seg * 0.6) {
      const nx = w * 0.5 + (k % 2 ? 1 : -1) * w * amp * (0.55 + 0.45 * Math.abs(Math.sin(k * 1.9 + 0.4)));
      const ny = y + seg;
      d += ` C ${x} ${y + seg * 0.5}, ${nx} ${ny - seg * 0.5}, ${nx} ${ny}`;
      x = nx; y = ny; k++;
    }
    d += ` C ${x} ${y + (endY - y) * 0.5}, ${w * 0.5} ${endY - (endY - y) * 0.5}, ${w * 0.5} ${endY}`;
    base.setAttribute("d", d);
    draw.setAttribute("d", d);
    len = draw.getTotalLength();
    draw.style.strokeDasharray = `${len}`;
    dot.style.left = w * 0.5 + "px";
    dot.style.top = endY + "px";
    measureScrub();
    update();
  }

  const pad2 = (n) => String(n).padStart(2, "0");
  const fmtTC = (f) => `${pad2(Math.floor(f / 86400))}:${pad2(Math.floor(f / 1440) % 60)}:${pad2(Math.floor(f / 24) % 60)}:${pad2(f % 24)}`;

  // cena "gravando o nome"
  const scEl = art.querySelector(".tl-scrub");
  const sc = scEl && {
    el: scEl,
    strip: scEl.querySelector(".sc-strip"),
    letters: [...scEl.querySelectorAll(".sc-l")],
    sub: [...scEl.querySelectorAll(".sc-sub span")],
    tc: scEl.querySelector(".sc-tc"),
    ruler: scEl.querySelector(".sc-ruler"),
    flash: scEl.querySelector(".sc-flash"),
    state: scEl.querySelector(".sc-state"),
    metrics: [], width: 0, done: false
  };
  function measureScrub() {
    if (!sc) return;
    sc.width = sc.strip.scrollWidth;
    sc.metrics = sc.letters.map((l) => ({ left: l.offsetLeft, w: l.offsetWidth }));
  }
  // r e vw são lidos antes (em update), junto com as outras medidas, para não forçar o layout a cada escrita
  function updateScrub(r, vw) {
    if (!sc) return;
    if (reduce) { sc.letters.forEach((l) => l.classList.add("is-rec")); sc.sub.forEach((x) => x.classList.add("on")); return; }
    const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
    const head = vw / 2;
    const start = head + vw * 0.04, end = head - sc.width - vw * 0.04;
    const x = start + (end - start) * Math.min(1, p / 0.88);
    sc.strip.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    sc.letters.forEach((l, k) => {
      const m = sc.metrics[k];
      const amt = Math.min(1, Math.max(0, (head - (x + m.left)) / m.w));
      const q = Math.round(amt * 100) / 100;
      if (l._q === q) return;
      l._q = q;
      // a parte da letra que já passou pela agulha fica preenchida; o resto continua em contorno
      l.style.backgroundImage = `linear-gradient(90deg, var(--t-fg) ${q * 100}%, transparent ${q * 100}%)`;
      l.style.fontVariationSettings = `"SOFT" ${Math.round(100 * (1 - q))}, "opsz" 144`;
    });
    const on = Math.floor(sc.sub.length * Math.min(1, Math.max(0, (p - 0.3) / 0.58)));
    sc.sub.forEach((x2, j) => x2.classList.toggle("on", j < on));
    sc.ruler.style.backgroundPositionX = `${x.toFixed(1)}px, ${x.toFixed(1)}px`;
    const tc = fmtTC(Math.round(p * 24 * 12));
    if (sc.tcTxt !== tc) { sc.tcTxt = tc; sc.tc.textContent = tc; }
    const done = p >= 0.96;
    if (done && !sc.done) { sc.flash.classList.remove("go"); void sc.flash.offsetWidth; sc.flash.classList.add("go"); }
    if (done !== sc.done || !sc.stateSet) {
      sc.stateSet = true;
      sc.state.classList.toggle("is-done", done);
      sc.stateB.textContent = done ? "SAVED" : "REC";
    }
    sc.done = done;
  }
  if (sc) sc.stateB = sc.state.querySelector("b");

  const speedEls = [...art.querySelectorAll("[data-speed]")];
  const speeds = speedEls.map((el) => parseFloat(el.dataset.speed));
  function update() {
    // primeiro todas as leituras, depois todas as escritas (evita recalcular o layout várias vezes por quadro)
    const ih = window.innerHeight;
    const top = art.getBoundingClientRect().top;
    const scR = sc && !reduce ? sc.el.getBoundingClientRect() : null;
    const scW = scR ? sc.el.clientWidth : 0;
    const offs = reduce ? null : speedEls.map((el, k) => {
      const r = el.getBoundingClientRect();
      return (r.top + r.height / 2 - ih / 2) * speeds[k];
    });
    const frac = reduce ? 1 : Math.min(1, Math.max(0, (ih * 0.72 - top - startY) / (endY - startY)));
    draw.style.strokeDashoffset = `${len * (1 - frac)}`;
    dot.classList.toggle("is-live", frac > 0.985);
    updateScrub(scR, scW);
    if (offs) speedEls.forEach((el, k) => { el.style.translate = `0 ${offs[k].toFixed(1)}px`; });
  }

  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  const ro = new ResizeObserver(() => build());
  ro.observe(art);

  // timecode correndo a 24 quadros por segundo
  const tcs = [...art.querySelectorAll("[data-timecode]")];
  const t0 = performance.now();
  const pad = (n) => String(n).padStart(2, "0");
  const timer = reduce ? null : setInterval(() => {
    const f = Math.floor((performance.now() - t0) / (1000 / 24));
    const txt = `${pad(Math.floor(f / 86400))}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
    tcs.forEach((el) => { el.textContent = txt; });
  }, 1000 / 24);

  build();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureScrub(); update(); });
  const unpauseFluid = pauseFluidUnder(art);
  const takeEl = art.querySelector("[data-tl-take]");
  const takeOff = takeEl ? tlTake(takeEl, reduce) : null;
  window.__tlCleanup = () => {
    window.removeEventListener("scroll", onScroll);
    ro.disconnect();
    if (timer) clearInterval(timer);
    unpauseFluid();
    if (takeOff) takeOff();
    window.__tlCleanup = null;
  };
}

/* ---------- animação do logo: "longa exposição" (seção tl-video com animacao) ----------
   Um ponto de luz percorre o W como num light painting: anda devagar onde o traço é grosso e
   rápido onde é fino (a espessura vira luz acumulada no tempo). No fim do traço o ponto para e
   fica vermelho (REC); o obturador fecha, a "foto revelada" é o vetor do logo, e o nome entra
   com um ajuste de foco. Usa VETORES[logoVetor] (simbolo, ponto, nome, descritor). */
function tlTakeHtml(V, p) {
  const [dx, dy, dr] = V.ponto;
  return `
        <figure class="tl-fig tl-take-fig">
          <div class="tl-frame tl-take" data-tl-take data-dot="${dx} ${dy} ${dr}">
            <svg class="tk-svg" role="img" aria-label="${p.titulo} — logo animation">
              <defs>
                <filter id="tkGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="b"/>
                  <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b2"/>
                  <feMerge><feMergeNode in="b2"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="tkFocusN" x="-10%" y="-80%" width="120%" height="260%"><feGaussianBlur stdDeviation="0"/></filter>
                <filter id="tkFocusD" x="-10%" y="-150%" width="120%" height="400%"><feGaussianBlur stdDeviation="0"/></filter>
                <radialGradient id="tkHalo">
                  <stop offset="0" stop-color="currentColor" stop-opacity="0.85"/>
                  <stop offset="0.3" stop-color="currentColor" stop-opacity="0.22"/>
                  <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
                </radialGradient>
              </defs>
              <path class="tk-src" d="${V.simbolo}"/>
              <g class="tk-focus"></g>
              <path class="tk-trail" filter="url(#tkGlow)"/>
              <path class="tk-mark" d="${V.simbolo}"/>
              <circle class="tk-dot" cx="${dx}" cy="${dy}" r="${dr}"/>
              <g class="tk-light"><circle class="tk-halo" r="26" fill="url(#tkHalo)"/><circle class="tk-core" r="3"/></g>
              <g class="tk-name" filter="url(#tkFocusN)"><path d="${V.nome}"/></g>
              <g class="tk-desc" filter="url(#tkFocusD)"><path d="${V.descritor}"/></g>
            </svg>
            <div class="tk-hud" aria-hidden="true">
              <span class="tk-state"><i></i><b>STBY</b></span>
              <span class="tk-exp"></span>
              <span class="tk-tc">00:00:00:00</span>
            </div>
            <div class="tk-shutter" aria-hidden="true"></div>
            <div class="tk-ui">
              <span class="tk-take-n">TAKE 01</span>
              <span class="tk-bar"><i></i></span>
              <button class="tk-replay" type="button" aria-label="Replay animation">↺ Replay</button>
            </div>
          </div>
        </figure>`;
}

// path SVG (M/L/H/V/C/S/Z, absolutos ou relativos) -> polilinha [[x, y], ...] do primeiro contorno.
// (bem mais rápido que getPointAtLength, que trava a página em paths longos)
function tlFlatten(d) {
  const tk = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || [];
  const out = []; let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0, cx = 0, cy = 0;
  const num = () => parseFloat(tk[i++]);
  const cubic = (x1, y1, x2, y2, x3, y3) => {
    for (let k = 1; k <= 12; k++) {
      const t = k / 12, u = 1 - t;
      out.push([u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]);
    }
    cx = x2; cy = y2; x = x3; y = y3;
  };
  while (i < tk.length) {
    if (/[a-zA-Z]/.test(tk[i])) cmd = tk[i++];
    const rel = cmd === cmd.toLowerCase(), ox = rel ? x : 0, oy = rel ? y : 0, c = cmd.toUpperCase();
    if (c === "Z") { break; }                                  // só o primeiro contorno
    if (c === "M") { x = ox + num(); y = oy + num(); sx = x; sy = y; out.push([x, y]); cmd = rel ? "l" : "L"; cx = x; cy = y; }
    else if (c === "L") { x = ox + num(); y = oy + num(); out.push([x, y]); cx = x; cy = y; }
    else if (c === "H") { x = ox + num(); out.push([x, y]); cx = x; cy = y; }
    else if (c === "V") { y = oy + num(); out.push([x, y]); cx = x; cy = y; }
    else if (c === "C") { const a = [num(), num(), num(), num(), num(), num()]; cubic(ox + a[0], oy + a[1], ox + a[2], oy + a[3], ox + a[4], oy + a[5]); }
    else if (c === "S") { const a = [num(), num(), num(), num()]; cubic(2 * x - cx, 2 * y - cy, ox + a[0], oy + a[1], ox + a[2], oy + a[3]); }
    else { i++; }
  }
  return out;
}

function tlTake(el, reduce) {
  const svg = el.querySelector(".tk-svg"), q = (c) => el.querySelector(c);
  const src = q(".tk-src"), trail = q(".tk-trail"), mark = q(".tk-mark"), dot = q(".tk-dot");
  const light = q(".tk-light"), core = q(".tk-core"), halo = q(".tk-halo"), focus = q(".tk-focus");
  const name = q(".tk-name"), desc = q(".tk-desc");
  const blurN = q("#tkFocusN feGaussianBlur"), blurD = q("#tkFocusD feGaussianBlur");
  const stateB = q(".tk-state b"), exp = q(".tk-exp"), tc = q(".tk-tc"), shutter = q(".tk-shutter");
  const bar = q(".tk-bar i"), btn = q(".tk-replay");
  const [dotX, dotY, dotR] = el.dataset.dot.split(" ").map(Number);   // o dot do logo

  // --- o W é um contorno fechado: separa os dois lados (da ponta esquerda à direita) e acha a linha central ---
  const raw = tlFlatten(src.getAttribute("d")), N = raw.length;
  let iL = 0, iR = 0;
  raw.forEach((pt, k) => { if (pt[0] < raw[iL][0]) iL = k; if (pt[0] > raw[iR][0]) iR = k; });
  const walk = (dir) => { const out = []; for (let k = iL; ; k = (k + dir + N) % N) { out.push(raw[k]); if (k === iR) break; } return out; };
  const M = 420;
  const resample = (P) => {
    const d = [0]; for (let k = 1; k < P.length; k++) d.push(d[k - 1] + Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]));
    const out = []; let j = 0;
    for (let k = 0; k < M; k++) {
      const t = (d[d.length - 1] * k) / (M - 1);
      while (j < d.length - 2 && d[j + 1] < t) j++;
      const f = (t - d[j]) / Math.max(1e-6, d[j + 1] - d[j]);
      out.push([P[j][0] + (P[j + 1][0] - P[j][0]) * f, P[j][1] + (P[j + 1][1] - P[j][1]) * f]);
    }
    return out;
  };
  const A = resample(walk(1)), B = resample(walk(-1));
  // liga cada ponto de um lado ao do outro lado (alinhamento ótimo, sem voltar: os lados têm comprimentos diferentes
  // nas curvas). Cada ligação ("degrau") é uma fatia do traço: R = [[i de A, j de B], ...]
  const dist = (i, j) => Math.hypot(A[i][0] - B[j][0], A[i][1] - B[j][1]);
  const cost = new Float64Array(M * M), from = new Uint8Array(M * M);
  for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) {
    const d = dist(i, j), id = i * M + j;
    if (!i && !j) { cost[id] = d; continue; }
    let best = Infinity, f = 0;
    if (i && j && cost[id - M - 1] < best) { best = cost[id - M - 1]; f = 0; }
    if (i && cost[id - M] < best) { best = cost[id - M]; f = 1; }
    if (j && cost[id - 1] < best) { best = cost[id - 1]; f = 2; }
    cost[id] = best + d; from[id] = f;
  }
  const R = [];
  for (let i = M - 1, j = M - 1; ; ) {
    R.push([i, j]); if (!i && !j) break;
    const f = from[i * M + j]; if (f === 0) { i--; j--; } else if (f === 1) i--; else j--;
  }
  R.reverse();
  const K = R.length;
  const C = R.map(([i, j]) => [(A[i][0] + B[j][0]) / 2, (A[i][1] + B[j][1]) / 2]);   // linha central
  const Wd = R.map(([i, j]) => dist(i, j));                                          // espessura
  // tempo de exposição: o ponto demora mais onde o traço é grosso
  const T = [0];
  for (let k = 1; k < K; k++) T.push(T[k - 1] + Math.hypot(C[k][0] - C[k - 1][0], C[k][1] - C[k - 1][1]) * (Wd[k] + 3.5));
  const Ttot = T[K - 1];
  const atTime = (f) => {   // fração do tempo de exposição -> degrau (fracionário) ao longo do traço
    const t = f * Ttot; let lo = 0, hi = K - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (T[mid] < t) lo = mid; else hi = mid; }
    return lo + (t - T[lo]) / Math.max(1e-6, T[hi] - T[lo]);
  };
  const pts = (P) => P.map((v) => v[0].toFixed(2) + " " + v[1].toFixed(2)).join(" L");
  function ribbon(u) {   // pedaço do W já "exposto", da ponta esquerda até o degrau u (frente arredondada pela luz)
    const k = Math.min(K - 1, Math.floor(u)), [i, j] = R[k];
    const a = A.slice(0, i + 1), b = B.slice(0, j + 1).reverse();
    return "M" + pts(a) + " L" + pts(b) + "Z";
  }

  // --- enquadramento: o logo inteiro, com folga; no celular ocupa mais a largura ---
  const box = (() => { const a = src.getBBox(), n = name.getBBox(), d = desc.getBBox();
    const x0 = Math.min(a.x, n.x, d.x), y0 = Math.min(a.y, n.y, d.y);
    return { x0, y0, x1: Math.max(a.x + a.width, n.x + n.width, d.x + d.width), y1: Math.max(a.y + a.height, n.y + n.height, d.y + d.height), sym: a }; })();
  function frame() {
    const w = el.clientWidth || 1, h = el.clientHeight || 1;
    const vw = (box.x1 - box.x0) / (w < 720 ? 0.84 : 0.5), vh = (vw * h) / w;
    const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
    svg.setAttribute("viewBox", `${(cx - vw / 2).toFixed(1)} ${(cy - vh / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
  }
  // marcas de foco em volta do símbolo
  const s = box.sym, fx = s.x - 22, fy = s.y - 22, fw = s.width + 44, fh = s.height + 44, c = 16;
  focus.innerHTML = [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]]
    .map(([x, y, sx, sy]) => `<path d="M${x} ${y + c * sy} V${y} H${x + c * sx}"/>`).join("");

  // --- linha do tempo (segundos) ---
  const P0 = 1.3, P1 = 5.6;          // exposição: o ponto de luz percorre o W
  const DOT0 = 5.6, DOT1 = 6.4;      // o ponto para e vira o REC
  const SH = 6.75;                   // obturador
  const N0 = 7.2, D0 = 7.9;          // nome e descritor entram em foco
  const DUR = 9.6;
  const ease = LY_EASE, clamp = lyClamp, seg = (t, a, b) => clamp((t - a) / (b - a));
  const pad = (n) => String(n).padStart(2, "0");
  const tcOf = (sec) => { const f = Math.max(0, Math.floor(sec * 24)); return `00:00:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`; };

  function render(t) {
    // 1. standby: as marcas de foco fecham sobre o símbolo e somem quando a exposição começa
    const lock = ease(seg(t, 0.2, 1.0));
    focus.style.opacity = (seg(t, 0.1, 0.4) * (1 - seg(t, P0, P0 + 0.4))).toFixed(3);
    const fcx = box.sym.x + box.sym.width / 2, fcy = box.sym.y + box.sym.height / 2;
    focus.setAttribute("transform", `translate(${fcx} ${fcy}) scale(${(1.35 - 0.35 * lock).toFixed(4)}) translate(${-fcx} ${-fcy})`);

    // 2. exposição
    const e = seg(t, P0, P1);
    const developed = t >= SH + 0.06;
    if (t >= P0 && !developed) {
      trail.setAttribute("d", ribbon(Math.max(0.001, atTime(e))));
      trail.style.opacity = 1;
    } else if (developed) {
      trail.style.opacity = (0.9 * (1 - seg(t, SH + 0.06, SH + 1.1))).toFixed(3);   // rastro de luz que ainda resta na retina
      if (t < SH + 1.2) trail.setAttribute("d", ribbon(K - 1));
    } else trail.style.opacity = 0;

    // ponto de luz: segue a linha central; no fim, sobe até o lugar do dot e fica vermelho
    let lx, ly, lr = 3, hr = 26, red = 0;
    if (t < DOT0) {
      const k = Math.min(K - 1, atTime(e)), i0 = Math.floor(k), i1 = Math.min(K - 1, i0 + 1), f = k - i0;
      lx = C[i0][0] + (C[i1][0] - C[i0][0]) * f; ly = C[i0][1] + (C[i1][1] - C[i0][1]) * f;
      // a cabeça de luz acompanha a espessura do traço (e cobre a frente do rastro)
      const wk = Wd[i0], end = seg(t, P1 - 0.25, P1);
      lr = 3 + (Math.max(3, wk * 0.42) - 3) * (1 - end); hr = 26 + (14 + wk * 1.5 - 26) * (1 - end);
    } else {
      const m = seg(t, DOT0, DOT1), em = ease(m);
      const tip = C[K - 1];
      const lift = Math.sin(Math.PI * Math.min(1, m * 1.15)) * 7;   // pequeno salto antes de assentar
      lx = tip[0] + (dotX - tip[0]) * em; ly = tip[1] + (dotY - tip[1]) * em - lift * (1 - em);
      lr = 3 + (dotR - 3) * em; red = ease(seg(t, DOT0 + 0.15, DOT1));
    }
    const lightOn = t >= P0 - 0.25 && !developed;
    light.style.opacity = lightOn ? Math.min(1, seg(t, P0 - 0.25, P0 + 0.1)).toFixed(3) : 0;
    light.setAttribute("transform", `translate(${lx.toFixed(2)} ${ly.toFixed(2)})`);
    core.setAttribute("r", lr.toFixed(2));
    const col = `color-mix(in srgb, var(--t-accent) ${Math.round(red * 100)}%, var(--t-fg))`;
    core.style.fill = col; halo.style.color = col;
    halo.setAttribute("r", (hr * (1 + 0.08 * Math.sin(t * 9))).toFixed(1));

    // 3. obturador: corte preto rápido e a "foto revelada"
    shutter.style.opacity = t >= SH && t < SH + 0.35 ? (1 - seg(t, SH + 0.1, SH + 0.35)).toFixed(3) : 0;
    mark.style.opacity = developed ? 1 : 0;
    dot.style.opacity = developed ? 1 : 0;

    // 4. o nome entra em foco
    const n = ease(seg(t, N0, N0 + 1.3)), d = ease(seg(t, D0, D0 + 1.2));
    name.style.opacity = Math.min(1, n * 1.6).toFixed(3); blurN.setAttribute("stdDeviation", (10 * (1 - n)).toFixed(2));
    desc.style.opacity = Math.min(1, d * 1.6).toFixed(3); blurD.setAttribute("stdDeviation", (7 * (1 - d)).toFixed(2));

    // HUD
    const done = t >= DUR - 0.4;
    el.classList.toggle("is-rec", t >= DOT1 - 0.2 && !done);
    el.classList.toggle("is-saved", done);
    el.classList.toggle("is-done", t >= DUR);
    stateB.textContent = done ? "SAVED" : t >= DOT1 - 0.2 ? "REC" : t >= P0 ? "BULB" : "STBY";
    exp.textContent = t >= P0 && t < SH ? `EXP ${(t - P0).toFixed(1)}s` : t >= SH ? `EXP ${(SH - P0).toFixed(1)}s` : "";
    tc.textContent = tcOf(t - P0);
    bar.style.transform = `scaleX(${clamp(t / DUR).toFixed(4)})`;
  }

  let raf = 0, t0 = 0;
  function step(now) { const t = (now - t0) / 1000; render(t); raf = t < DUR ? requestAnimationFrame(step) : 0; }
  function play() { cancelAnimationFrame(raf); if (reduce) return render(DUR); t0 = performance.now(); raf = requestAnimationFrame(step); }
  frame();
  render(reduce ? DUR : 0);
  let played = false;
  const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !played) { played = true; play(); } }, { threshold: 0.6 });
  io.observe(el);
  btn.addEventListener("click", play);
  const ro = new ResizeObserver(frame); ro.observe(el);
  return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
}

/* =========================================================
   CASE "EXPEDIÇÃO" (projetos com estilo: "expedicao", ex: NOMAD)
   A página é um mapa: curvas de nível (WebGL) no fundo; o visitante traça a própria rota com o
   cursor (no toque, a rota segue a rolagem); um HUD de campo mostra coordenadas, altitude e
   distância; cada seção é um waypoint. Termina na cena "ex-final": as condições mudam, o terreno
   endurece, o destino se afasta — e a marca é carimbada.
   Coordenadas, altitudes e distâncias são DECORATIVAS (não correspondem a um lugar real).
   ========================================================= */
const EX_BASE = { lat: 64.1402, lon: -21.9339 }; // ponto de partida decorativo
function exCoordStr(lat, lon) {
  const f = (v, pad) => {
    const a = Math.abs(v), d = Math.floor(a), m = (a - d) * 60;
    return `${String(d).padStart(pad, "0")}°${m.toFixed(3).padStart(6, "0")}'`;
  };
  return `${lat >= 0 ? "N" : "S"} ${f(lat, 2)} ${lon >= 0 ? "E" : "W"} ${f(lon, 3)}`;
}
const exWp = (i) => exCoordStr(EX_BASE.lat + i * 0.0731, EX_BASE.lon + i * 0.1167);
const exNum = (i) => String(i).padStart(2, "0");
const exLabel = (s, i) => `
  <p class="ex-wp reveal"><span class="ex-wp-id">WP-${exNum(i + 1)}</span><span class="ex-wp-name">${s.nome}</span><span class="ex-wp-coord">${exWp(i + 1)}</span></p>`;
const exParas = (s, from) => (s.textos || []).slice(from || 0).map((t) => `<p>${t}</p>`).join("");

// imagem, vídeo ou espaço reservado, em moldura técnica com marcas de registro e código
let exImgCount = 0;
function exMedia(m, cls, eager) {
  if (!m) return "";
  exImgCount++;
  const pos = m.posicao ? ` style="object-position:${m.posicao}"` : "";
  let inner;
  if (m.video) inner = `<video src="${m.video}"${m.poster ? ` poster="${m.poster}"` : ""} muted loop playsinline preload="metadata" data-autoplay${pos}></video>`;
  else if (m.img) inner = `<img src="${m.img}" alt="${m.legenda || ""}" ${imgLoad(eager)}${pos}>`;
  else inner = `<div class="ex-ph"><span>awaiting image</span></div>`;
  // folha de carta topográfica: cabeçalho (folha + coordenada), margem graduada, rodapé (legenda + escala)
  return `
    <figure class="ex-fig reveal ${cls || ""}">
      <div class="ex-sheet-head"><span>SHEET NMD-IMG-${exNum(exImgCount)}</span><span>${exWp(exImgCount + 20)}</span></div>
      <div class="ex-sheet"><div class="ex-frame" style="aspect-ratio:${m.proporcao || "3/2"}">${inner}</div></div>
      <figcaption><span>${m.legenda || ""}</span><span>SCALE 1:25 000</span></figcaption>
    </figure>`;
}

const EX_LAYOUTS = {
  // abertura + ficha técnica em forma de etiqueta de equipamento
  "ex-intro": (s, p, i) => `
    <section class="ex-sec ex-intro">
      <div class="wrap ex-grid">
        <div class="ex-col-text">
          ${exLabel(s, i)}
          <p class="ex-lead reveal">${s.textos[0]}</p>
          <div class="ex-text reveal">${exParas(s, 1)}</div>
        </div>
        ${p.info ? `
        <div class="ex-tag reveal" aria-label="Project details">
          <div class="ex-tag-head"><span>${p.titulo}</span><span>ID-${exNum(1)}/${exNum(p.secoes.length)}</span></div>
          <dl>${p.info.map((x) => `<div><dt>${x.label}</dt><dd>${x.valor || "—"}</dd></div>`).join("")}</dl>
          <div class="ex-tag-foot"><span>${p.tagline || ""}</span><i></i></div>
        </div>` : ""}
      </div>
    </section>`,

  // frase grande + duas imagens desencontradas
  "ex-statement": (s, p, i) => {
    const m = s.midias || [];
    return `
    <section class="ex-sec ex-statement">
      <div class="wrap">
        ${exLabel(s, i)}
        <h2 class="ex-display reveal">${s.titulo}</h2>
        <div class="ex-text ex-indent reveal">${exParas(s)}</div>
        <div class="ex-grid ex-pair">${exMedia(m[0], "ex-a")}${exMedia(m[1], "ex-b")}</div>
      </div>
    </section>`;
  },

  // símbolo: imagem de construção ao lado do texto + imagem larga
  "ex-symbol": (s, p, i) => {
    const m = s.midias || [];
    return `
    <section class="ex-sec ex-symbol">
      <div class="wrap ex-grid">
        ${exMedia(m[0], "ex-sym-main")}
        <div class="ex-sym-text">
          ${exLabel(s, i)}
          <h2 class="ex-h2 reveal">${s.titulo}</h2>
          <div class="ex-text reveal">${exParas(s)}</div>
        </div>
        ${exMedia(m[1], "ex-sym-wide")}
      </div>
    </section>`;
  },

  // identidade: texto + cores como etiquetas de material + imagens
  "ex-identity": (s, p, i) => {
    const m = s.midias || [];
    return `
    <section class="ex-sec ex-identity">
      <div class="wrap">
        <div class="ex-grid">
          <div class="ex-col-text">
            ${exLabel(s, i)}
            <h2 class="ex-h2 reveal">${s.titulo}</h2>
          </div>
          <div class="ex-text ex-side reveal">${exParas(s)}</div>
        </div>
        ${s.cores ? `<div class="ex-swatches">${s.cores.map((c, k) => `
          <div class="ex-swatch reveal" style="--sw:${c.hex}">
            <div class="ex-swatch-chip"></div>
            <div class="ex-swatch-label"><span>MAT-${exNum(k + 1)}</span><b>${c.nome}</b><span>${c.hex}</span></div>
          </div>`).join("")}</div>` : ""}
        <div class="ex-grid ex-pair">${exMedia(m[0], "ex-a")}${exMedia(m[1], "ex-b")}</div>
      </div>
    </section>`;
  },

  // sistema: texto + linhas de exemplo no formato de marcação de equipamento
  "ex-system": (s, p, i) => {
    const m = s.midias || [];
    return `
    <section class="ex-sec ex-system">
      <div class="wrap">
        ${exLabel(s, i)}
        <h2 class="ex-display ex-display-sm reveal">${s.titulo}</h2>
        <div class="ex-text ex-indent reveal">${exParas(s)}</div>
        ${s.exemplos ? `<div class="ex-codes reveal" role="table">
          ${s.exemplos.map((e) => `<div class="ex-code-row" role="row">${e.map((c) => `<span role="cell">${c}</span>`).join("")}</div>`).join("")}
        </div>` : ""}
        <div class="ex-grid ex-pair ex-pair-rev">${exMedia(m[0], "ex-a")}${exMedia(m[1], "ex-b")}</div>
      </div>
    </section>`;
  },

  // equipamentos: grade estruturada de 4
  "ex-gear": (s, p, i) => `
    <section class="ex-sec ex-gear">
      <div class="wrap">
        <div class="ex-grid">
          <div class="ex-col-text">${exLabel(s, i)}<h2 class="ex-h2 reveal">${s.titulo}</h2></div>
          <div class="ex-text ex-side reveal">${exParas(s)}</div>
        </div>
        <div class="ex-gear-grid">${(s.midias || []).map((m, k) => exMedia(m, "ex-g" + (k + 1))).join("")}</div>
      </div>
    </section>`,

  // em campo: imagem de ponta a ponta + duas menores
  "ex-field": (s, p, i) => {
    const m = s.midias || [];
    return `
    <section class="ex-sec ex-field">
      <div class="wrap">
        ${exLabel(s, i)}
        <h2 class="ex-display reveal">${s.titulo}</h2>
      </div>
      <div class="ex-bleed">${exMedia(m[0], "ex-full")}</div>
      <div class="wrap ex-grid">
        <div class="ex-text ex-field-text reveal">${exParas(s)}</div>
        ${exMedia(m[1], "ex-f2")}${exMedia(m[2], "ex-f3")}
      </div>
    </section>`;
  },

  // sinalizador: o laranja se expande em círculo a partir de um ponto; dentro dele, mapa invertido,
  // frase grande em grafite e uma fita de marcação com os princípios
  "ex-flare": (s, p, i) => {
    const fita = (s.principios || []).map((x) => `<span>${x}</span><b>✕</b>`).join("");
    return `
    <section class="ex-flare" data-ex-flare aria-label="${s.nome}">
      <div class="ex-flare-sticky">
        <div class="ex-flare-bg" aria-hidden="true"></div>
        <div class="ex-flare-beacon" aria-hidden="true"><i></i><i></i><i></i><b></b><span>SIGNAL</span></div>
        <div class="ex-flare-clip">
          <div class="wrap ex-flare-inner">
            ${exLabel(s, i)}
            ${s.pre ? `<p class="ex-flare-pre">${s.pre}</p>` : ""}
            <h2 class="ex-flare-display">${s.titulo}</h2>
            <div class="ex-flare-text">${exParas(s)}</div>
          </div>
          ${fita ? `<div class="ex-flare-tape" aria-hidden="true"><div class="ex-flare-track">${fita.repeat(4)}</div></div>` : ""}
        </div>
      </div>
    </section>`;
  },

  // cena final: registro de campo + painel de instrumentos + carimbo da marca
  "ex-final": (s, p) => {
    const linhas = s.linhas || [];
    const dest = s.destino || "";
    return `
    <section class="ex-final" data-ex-final aria-label="${(s.fecho || p.tagline || "").replace(/"/g, "")}">
      <div class="ex-final-sticky">
        <div class="wrap ex-final-grid">
          <div class="ex-log" aria-live="off">
            ${linhas.map((l, k) => `<p class="ex-log-line" data-k="${k}"><span class="ex-log-t">LOG ${exNum(6 + Math.floor((12 + k * 37) / 60))}:${exNum((12 + k * 37) % 60)}</span><span class="ex-log-txt">${l}</span></p>`).join("")}
          </div>
          <div class="ex-panel" aria-hidden="true">
            <div class="ex-status"><span>STATUS</span><b data-g="status">STABLE</b></div>
            <div class="ex-gauges">
              <div><span>WIND</span><b data-g="wind">12</b><i>KM/H</i></div>
              <div><span>TEMP</span><b data-g="temp">14</b><i>°C</i></div>
              <div><span>VISIBILITY</span><b data-g="vis">10.0</b><i>KM</i></div>
              <div><span>GRADE</span><b data-g="grade">6</b><i>%</i></div>
            </div>
            <svg class="ex-mini" viewBox="0 0 400 240">
              <path class="ex-mini-plan" d=""/>
              <path class="ex-mini-route" d="M40 204 C 90 196, 96 150, 142 146 S 196 170, 214 128 S 262 70, 300 92 S 356 64, 372 30" pathLength="1"/>
              <circle class="ex-mini-origin" cx="40" cy="204" r="5"/>
              <g class="ex-mini-dest"><circle r="9"/><circle r="2.5"/></g>
            </svg>
            <div class="ex-dist"><span>DISTANCE TO ${dest || "DESTINATION"}</span><b data-g="dist">2.4</b><i>KM</i></div>
          </div>
        </div>
        <svg width="0" height="0" style="position:absolute" aria-hidden="true">
          <filter id="ex-rough" x="-5%" y="-10%" width="110%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" result="d"/>
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="8" result="g"/>
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 6.1" result="m"/>
            <feComposite in="d" in2="m" operator="in"/>
          </filter>
        </svg>
        <div class="ex-stamp" aria-hidden="true">
          ${linhas.length ? `<p class="ex-stamp-line">${linhas[linhas.length - 1]}</p>` : ""}
          <div class="ex-stamp-box">
            ${p.simbolo ? `<svg class="ex-stamp-sym" viewBox="0 0 1080 1080"><path d="${p.simbolo}"/></svg>` : ""}
            <span class="ex-stamp-word">${p.titulo}</span>
            <span class="ex-stamp-meta"><span>${exWp(0)}</span><span>${s.fecho || p.tagline || ""}</span></span>
          </div>
        </div>
      </div>
    </section>`;
  }
};

function renderExpedition(p) {
  exImgCount = 0;
  const t = p.tema || {};
  const vars = [t.fundo && `--x-bg:${t.fundo}`, t.texto && `--x-fg:${t.texto}`, t.destaque && `--x-accent:${t.destaque}`].filter(Boolean).join(";");
  const hero = `
    <header class="ex-hero">
      <div class="wrap">
        <a class="back-link" href="work.html">&larr; All work</a>
        <div class="ex-hud-top reveal"><span>WP-00 / BASE</span><span>${exWp(0)}</span><span>${p.categoria}${p.ano ? " — " + p.ano : ""}</span></div>
        <h1 class="ex-title reveal">${p.titulo}</h1>
        <div class="ex-hero-foot reveal">
          ${p.tagline ? `<p class="ex-tagline">${p.tagline}</p>` : ""}
          ${p.subtitulo ? `<p class="ex-sub">${p.subtitulo}</p>` : ""}
        </div>
      </div>
      ${p.capa ? `<div class="wrap">${exMedia(p.capa, "ex-cover", true)}</div>` : ""}
    </header>`;
  const body = p.secoes.map((s, i) => {
    const fn = EX_LAYOUTS[s.layout];
    if (!fn) { console.warn("Layout desconhecido:", s.layout); return ""; }
    return fn(s, p, i);
  }).join("");
  return `
    <article class="ex-case" style="${vars}">
      <canvas class="ex-map" aria-hidden="true"></canvas>
      <svg class="ex-route" aria-hidden="true"><path class="ex-route-path"/><g class="ex-route-wps"></g></svg>
      <div class="ex-hud" aria-hidden="true">
        <span data-h="coord">${exWp(0)}</span>
        <span><b>ALT</b> <em data-h="alt">0</em> M <b>DIST</b> <em data-h="dist">0.00</em> KM</span>
        <span data-h="wp">WP-00 / BASE</span>
      </div>
      ${hero}${body}
    </article>`;
}

// ---------- mapa topográfico (WebGL) ----------
const EX_MAP_FS = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uScroll, uDpr, uSweep, uTime;
uniform vec3 uFlare;   // sinalizador: centro (x, y) e raio, em px de CSS da tela
uniform vec3 uBg, uLine, uAccent;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 5; k++) { v += a * noise(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.5; }
  return v;
}
// cristas e vales marcados
float ridged(vec2 p){
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 5; k++) { float r = 1.0 - abs(noise(p) * 2.0 - 1.0); v += a * r * r; p = p * 2.07 + vec2(11.0, 7.0); a *= 0.5; }
  return v;
}
// linha de nível: 1 sobre a curva (a cada 5 curvas, uma mestra mais grossa)
float contour(float n, out float major){
  float w = max(fwidth(n), 1e-4);
  float f = fract(n);
  float d = min(f, 1.0 - f) / w;
  major = 1.0 - step(0.5, mod(floor(n + 0.5), 5.0));
  return 1.0 - smoothstep(0.35 + 0.45 * major, 1.25 + 0.45 * major, d);
}
void main(){
  vec2 sp = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;   // tela, px de CSS
  vec2 p = sp + vec2(0.0, uScroll);                                  // página: o terreno rola com o conteúdo
  vec2 q = p / 560.0;
  float sy = sp.y / (uRes.y / uDpr);                                 // 0 = topo da tela, 1 = base

  // terreno de sempre
  float mj0; float h0 = fbm(q);
  float l0 = contour(h0 * 16.0, mj0);

  // terreno "mais difícil" (acidentado e instável, se deforma devagar com o tempo): só é calculado
  // quando a varredura da cena final já começou. Antes disso m = 0 e ele não aparece; pular o cálculo
  // poupa ~4/5 do custo do shader durante a rolagem. (uSweep é uniform: o "if" é igual em todos os pixels.)
  float m = 0.0, mj1 = 0.0, l1 = 0.0, shade = 0.0, peak = 0.0;
  if (uSweep > -0.5) {
    vec2 wv = vec2(fbm(q * 1.3 + uTime * 0.035), fbm(q * 1.3 + 7.1 - uTime * 0.03));
    float h1 = 0.5 * h0 + 0.8 * ridged(q * 1.6 + wv * 0.9);
    l1 = contour(h1 * 17.0, mj1);

    // a varredura desce pela tela; acima dela o levantamento já é o novo
    m = 1.0 - smoothstep(uSweep - 0.035, uSweep, sy);

    // sombreamento de relevo do terreno novo (volume) e picos em laranja
    vec3 nrm = normalize(vec3(-dFdx(h1) * 320.0 * uDpr, -dFdy(h1) * 320.0 * uDpr, 1.0));
    vec3 L = normalize(vec3(-0.6, 0.55, 0.55));
    shade = dot(nrm, L) - L.z;
    peak = smoothstep(0.86, 1.02, h1);
  }

  vec3 col = uBg * (1.0 + shade * 0.55 * m);
  float line = mix(l0 * (0.11 + 0.1 * mj0), l1 * (0.12 + 0.13 * mj1), m);
  vec3 lineCol = mix(uLine, uAccent, peak * m * 0.85);
  col = mix(col, lineCol, line);
  col = mix(col, uAccent, peak * m * 0.05);

  // quadrícula do mapa
  vec2 g = abs(fract(p / 160.0 + 0.5) - 0.5) * 160.0;
  col = mix(col, uLine, (1.0 - smoothstep(0.0, 1.0, min(g.x, g.y))) * 0.035);

  // sinalizador: dentro do círculo o mapa inverte (grafite sobre laranja), com um brilho em volta
  if (uFlare.z > 0.5) {
    float fd = length(sp - uFlare.xy) - uFlare.z;
    float inF = 1.0 - smoothstep(-1.0, 1.0, fd);
    vec3 fc = uAccent * (0.975 + 0.05 * noise(p * 0.02));
    fc = mix(fc, uBg, l0 * (0.3 + 0.25 * mj0));
    fc = mix(fc, uBg, (1.0 - smoothstep(0.0, 1.0, min(g.x, g.y))) * 0.08);
    col = mix(col, fc, inF);
    col += uAccent * 0.22 * exp(-max(fd, 0.0) / 50.0) * (1.0 - inF);
  }

  // a linha de varredura: traço laranja + rastro suave acima
  if (uSweep > 0.0 && uSweep < 1.06) {
    float px = (sy - uSweep) * uRes.y / uDpr;
    col = mix(col, uAccent, exp(-px * px / 3.0) * 0.9);
    col += uAccent * 0.14 * exp(min(0.0, px) / 90.0) * step(px, 0.0);
  }
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

function exMap(canvas, art) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
  if (!gl || !gl.getExtension("OES_standard_derivatives")) return null;
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const v = sh(gl.VERTEX_SHADER, "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }");
  const f = sh(gl.FRAGMENT_SHADER, EX_MAP_FS);
  if (!v || !f) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ["uRes", "uScroll", "uDpr", "uSweep", "uTime", "uFlare", "uBg", "uLine", "uAccent"].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
  const cs = getComputedStyle(art);
  gl.uniform3fv(U.uBg, exRgb(cs.getPropertyValue("--x-bg").trim() || "#1E2023"));
  gl.uniform3fv(U.uLine, exRgb(cs.getPropertyValue("--x-fg").trim() || "#E9E5DC"));
  gl.uniform3fv(U.uAccent, exRgb(cs.getPropertyValue("--x-accent").trim() || "#FF5B1F"));
  let dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(window.innerWidth * dpr), h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(U.uRes, w, h); gl.uniform1f(U.uDpr, dpr);
  }
  resize();
  return {
    resize,
    draw(scroll, sweep, t, fl) {
      gl.uniform1f(U.uScroll, scroll); gl.uniform1f(U.uSweep, sweep); gl.uniform1f(U.uTime, t);
      gl.uniform3f(U.uFlare, fl ? fl.x : 0, fl ? fl.y : 0, fl ? fl.r : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() { const l = gl.getExtension("WEBGL_lose_context"); if (l) l.loseContext(); }
  };
}

// qualquer cor CSS -> [r,g,b] de 0 a 1
function exRgb(c) {
  const x = document.createElement("canvas").getContext("2d");
  x.fillStyle = "#000"; x.fillStyle = c; x.fillRect(0, 0, 1, 1);
  const d = x.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}

// ---------- montagem: mapa + rota + HUD + cena final ----------
function setupExpedition(root) {
  if (window.__exCleanup) window.__exCleanup();
  const art = root.querySelector(".ex-case");
  if (!art) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const canvas = art.querySelector(".ex-map");
  const map = exMap(canvas, art);
  if (!map) art.classList.add("no-map");

  const svg = art.querySelector(".ex-route"), path = svg.querySelector(".ex-route-path"), wpsG = svg.querySelector(".ex-route-wps");
  const hud = art.querySelector(".ex-hud");
  // HUD: elementos guardados e texto só reescrito quando muda
  const hEls = {}, hLast = {};
  const H = (k) => hEls[k] || (hEls[k] = hud.querySelector(`[data-h="${k}"]`));
  const setH = (k, v) => { if (hLast[k] === v) return; hLast[k] = v; H(k).textContent = v; };
  const secs = [...art.querySelectorAll(".ex-sec, .ex-flare")];
  // o HUD mostra o mesmo número e nome do rótulo de cada seção
  const labels = secs.map((s) => `${(s.querySelector(".ex-wp-id") || {}).textContent || ""} / ${((s.querySelector(".ex-wp-name") || {}).textContent || "").toUpperCase()}`);
  const fin = setupExFinal(art.querySelector("[data-ex-final]"), reduce);
  const flare = setupExFlare(art.querySelector("[data-ex-flare]"), reduce, !!map);

  // rota: pontos em coordenadas do artigo
  let pts = [], d = "", len = 0, wpCount = 0, restTimer = 0, client = null, idleSince = performance.now();
  const PX_PER_KM = 420; // escala decorativa
  let broke = false, artW = 0, artH = 0;
  function addPoint(x, y, jump) {
    // só dentro do artigo: a rota não invade o bloco de contato nem o que vem depois
    if (y < 0 || y > artH - 6) { broke = true; return; }
    if (broke) { jump = true; broke = false; }
    const l = pts[pts.length - 1];
    if (l && !jump) {
      const dist = Math.hypot(x - l[0], y - l[1]);
      if (dist < 7) return;
      len += dist;
    }
    pts.push([x, y]);
    d += (l && !jump ? " L" : " M") + x.toFixed(1) + " " + y.toFixed(1);
    if (pts.length > 2400) { pts = pts.filter((_, k) => k % 2 === 0); d = "M" + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L"); }
    path.setAttribute("d", d);
  }
  function dropWaypoint() {
    const l = pts[pts.length - 1];
    if (!l || len < 60) return;
    wpCount++;
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${l[0].toFixed(1)} ${l[1].toFixed(1)})`);
    g.innerHTML = `<rect x="-4" y="-4" width="8" height="8" transform="rotate(45)"/><text x="10" y="-8">WP ${exNum(wpCount)}</text>`;
    wpsG.appendChild(g);
    if (wpsG.childNodes.length > 24) wpsG.removeChild(wpsG.firstChild);
  }

  // tamanho do artigo guardado (atualizado no resize e pelo ResizeObserver): evita ler o layout a cada ponto da rota
  function sizeSvg() {
    artW = art.clientWidth; artH = art.offsetHeight;
    svg.setAttribute("viewBox", `0 0 ${artW} ${artH}`);
    svg.style.height = artH + "px";
  }
  sizeSvg();

  // caminhante autônomo: um explorador que anda sozinho pela área visível, com rumo aleatório,
  // viradas bruscas e paradas (cada parada vira um waypoint). No toque ele faz a rota; no desktop,
  // assume quando o mouse fica parado por alguns segundos.
  const IDLE_MS = 4000;
  const walker = { x: 0, y: 0, a: Math.PI / 2, on: false, last: 0, pauseUntil: 0, nextTurn: 0, nextStop: 0 };
  const angDiff = (b, a) => ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  const walkerActive = (now) => !reduce && (!fine || (now - idleSince > IDLE_MS));
  function walk(now) {
    const dt = Math.min(0.05, walker.last ? (now - walker.last) / 1000 : 0.016); walker.last = now;
    const ih = window.innerHeight, r = art.getBoundingClientRect(), w = art.clientWidth;
    // no toque o caminhante acompanha a leitura: fica na faixa do meio da tela e tende a descer
    const trail = !fine;
    const top = -r.top + ih * (trail ? 0.3 : 0.16), bot = -r.top + ih * (trail ? 0.72 : 0.84), lft = w * 0.07, rgt = w * 0.93;
    if (!walker.on) {
      // continua do fim da rota, se estiver na tela; senão começa num ponto aleatório
      const l = pts[pts.length - 1];
      if (l && l[1] > top && l[1] < bot) { walker.x = l[0]; walker.y = l[1]; }
      else { walker.x = lft + Math.random() * (rgt - lft); walker.y = top + Math.random() * (bot - top) * 0.5; if (l) addPoint(walker.x, walker.y, true); }
      walker.a = trail ? Math.PI / 2 + (Math.random() - 0.5) * 1.6 : Math.random() * Math.PI * 2;
      walker.nextTurn = now + 900 + Math.random() * 1800;
      walker.nextStop = now + 3500 + Math.random() * 4000;
      walker.on = true;
    }
    if (now < walker.pauseUntil) return;
    if (trail && walker.y > bot + ih * 0.1) return;                       // rolou para cima: espera, não volta
    walker.a += (Math.random() - 0.5) * 2.6 * dt;                         // pequenas variações de rumo
    if (now > walker.nextTurn) {                                          // viradas bruscas de tempos em tempos
      walker.a += (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 1.1);
      walker.nextTurn = now + 1100 + Math.random() * 2600;
    }
    const lag = trail ? Math.max(0, (-r.top + ih * 0.5 - walker.y) / ih) : 0;   // atraso em relação ao meio da tela
    if (now > walker.nextStop && lag < 0.1) {                             // parada (só se não estiver atrasado): marca um waypoint
      dropWaypoint();
      walker.pauseUntil = now + 600 + Math.random() * 1000;
      walker.nextStop = now + 5000 + Math.random() * 6000;
      return;
    }
    if (trail) {
      walker.a += angDiff(Math.PI / 2, walker.a) * Math.min(1, dt * (0.9 + lag * 8)); // puxa para baixo; mais forte se atrasado
      const dev = angDiff(walker.a, Math.PI / 2);                          // nunca mais que ~70° do "para baixo"
      if (Math.abs(dev) > 1.22) walker.a = Math.PI / 2 + Math.sign(dev) * 1.22;
    }
    if (walker.x < lft || walker.x > rgt || walker.y < top || walker.y > bot) {   // fora da área: volta para dentro
      const want = Math.atan2((top + bot) / 2 - walker.y, w / 2 - walker.x);
      walker.a += angDiff(want, walker.a) * Math.min(1, dt * 3.2);
    }
    const far = walker.y < top ? top - walker.y : walker.y > bot ? walker.y - bot : 0;
    const v = trail ? 55 * (1 + Math.min(2, lag) * 14)                    // px/s; no toque, acelera conforme o atraso
                    : 48 * (1 + Math.min(24, (far / ih) * 16));           // no desktop, só quando sai da tela
    walker.x = Math.min(w - 8, Math.max(8, walker.x + Math.cos(walker.a) * v * dt));
    walker.y = Math.min(artH - 40, Math.max(0, walker.y + Math.sin(walker.a) * v * dt));
    addPoint(walker.x, walker.y);
  }

  // HUD: posição atual (cursor ou centro da tela) -> coordenada/altitude decorativas
  function updateHud(x, y) {
    const lat = EX_BASE.lat + y * 0.000052, lon = EX_BASE.lon + x * 0.00009;
    setH("coord", exCoordStr(lat, lon));
    const alt = 420 + 380 * Math.sin(x * 0.004 + y * 0.0011) + 260 * Math.sin(y * 0.0023 - x * 0.002) + y * 0.05;
    setH("alt", Math.max(0, Math.round(alt)).toLocaleString("en-US"));
    setH("dist", (len / PX_PER_KM).toFixed(2));
  }

  let ticking = false, lastScroll = null, lastSweep = null, lastFlare = null, liveFrame = 0;
  function frame() {
    ticking = false;
    // primeiro todas as leituras de posição, depois as escritas (evita recalcular o layout várias vezes por quadro)
    const ih = window.innerHeight, r = art.getBoundingClientRect();
    let cur = -1;
    secs.forEach((el, k) => { if (el.getBoundingClientRect().top <= ih * 0.5) cur = k; });
    if (fin) fin.measure();
    if (flare) flare.measure();
    // o mapa e o HUD só aparecem sobre o artigo; o fluido do site pausa enquanto o mapa cobre a tela
    const cut = Math.max(0, ih - r.bottom);
    canvas.style.clipPath = cut ? `inset(0 0 ${cut}px 0)` : "";
    const covered = r.top <= 0 && r.bottom >= ih;
    window.__fluidPaused = covered && !!map;
    hud.classList.toggle("is-on", r.top < ih * 0.3 && r.bottom > ih * 0.8 && !(fin && fin.active()) && !(flare && flare.covering()));
    // o mapa só é redesenhado se algo mudou; com o terreno "instável" na tela, a ~30 quadros/s
    const st = fin ? fin.update() : { sweep: -1, live: false };
    const live = st.live && !reduce && (liveFrame++ % 2 === 0);
    const fl = flare ? flare.update() : null;
    const flKey = fl ? `${fl.x|0},${fl.y|0},${fl.r|0}` : "";
    if (map && (-r.top !== lastScroll || st.sweep !== lastSweep || flKey !== lastFlare || live)) {
      map.draw(-r.top, st.sweep, reduce ? 0 : performance.now() / 1000, fl);
      lastScroll = -r.top; lastSweep = st.sweep; lastFlare = flKey;
    }

    if (walker.on) updateHud(walker.x, walker.y);
    else if (client) {
      addPoint(client.x - r.left, client.y - r.top);
      updateHud(client.x - r.left, client.y - r.top);
    } else updateHud(artW / 2, -r.top + ih / 2);

    setH("wp", cur < 0 ? "WP-00 / BASE" : labels[cur]);
  }
  const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  const onMove = (e) => {
    if (!fine || e.pointerType === "touch") return;
    client = { x: e.clientX, y: e.clientY };
    idleSince = performance.now();
    if (walker.on) { walker.on = false; walker.last = 0; addPoint(client.x - art.getBoundingClientRect().left, client.y - art.getBoundingClientRect().top, true); }
    clearTimeout(restTimer);
    restTimer = setTimeout(dropWaypoint, 900); // parou por um tempo: marca um waypoint
    kick();
  };
  const onResize = () => { if (map) map.resize(); sizeSvg(); kick(); };
  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onMove, { passive: true });
  // a altura do artigo muda quando imagens/fontes carregam
  const ro = "ResizeObserver" in window ? new ResizeObserver(() => { sizeSvg(); kick(); }) : null;
  if (ro) ro.observe(art);
  // laço contínuo só enquanto o artigo está na tela: move o caminhante e mantém a cena final viva
  let onScreen = false, raf = 0;
  const loopFn = (now) => {
    raf = 0;
    if (!onScreen) return;
    if (walkerActive(now)) { walk(now); kick(); }
    else if (fin && fin.active()) kick();
    raf = requestAnimationFrame(loopFn);
  };
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen && !raf) raf = requestAnimationFrame(loopFn); });
  io.observe(art);
  kick();

  window.__exCleanup = () => {
    window.removeEventListener("scroll", kick);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onMove);
    clearTimeout(restTimer); cancelAnimationFrame(raf); io.disconnect();
    if (ro) ro.disconnect();
    if (map) map.destroy();
    window.__fluidPaused = false;
    window.__exCleanup = null;
  };
}

// sinalizador: devolve centro e raio do círculo laranja (px de CSS da tela) para o mapa e recorta o conteúdo
function setupExFlare(sec, reduce, hasMap) {
  if (!sec) return null;
  if (!hasMap) sec.classList.add("no-map");
  const sticky = sec.querySelector(".ex-flare-sticky"), clip = sec.querySelector(".ex-flare-clip");
  const bg = sec.querySelector(".ex-flare-bg"), beacon = sec.querySelector(".ex-flare-beacon");
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  let cov = false, r = null, sr = null;
  return {
    covering: () => cov,
    // leituras separadas das escritas: frame() mede tudo antes de mexer no DOM
    measure() { r = sec.getBoundingClientRect(); sr = sticky.getBoundingClientRect(); },
    update() {
      if (!r) this.measure();
      const ih = window.innerHeight, w = window.innerWidth;
      if (r.bottom < 0 || r.top > ih) { cov = false; return null; }
      const p = Math.min(1, Math.max(0, -r.top / (r.height - ih)));
      const fx = w * (w < 720 ? 0.5 : 0.72), fy = ih * 0.36;               // ponto do sinalizador, na tela fixa
      const x = fx, y = sr.top + fy;
      const maxR = Math.hypot(Math.max(x, w - x), Math.max(fy, ih - fy)) + 20;
      // expande (0–30%), fica cheio, recolhe de volta ao ponto (82–100%)
      const k = reduce ? 1 : ease(seg(p, 0, 0.3)) * (1 - ease(seg(p, 0.82, 1)));
      const rad = maxR * k;
      cov = k > 0.95;
      const c = `circle(${rad.toFixed(1)}px at ${x.toFixed(1)}px ${fy.toFixed(1)}px)`;
      clip.style.clipPath = c;
      if (!hasMap) bg.style.clipPath = c;
      beacon.style.setProperty("--fx", x + "px"); beacon.style.setProperty("--fy", fy + "px");
      beacon.style.opacity = (1 - Math.min(1, k * 3)).toFixed(2);
      sec.classList.toggle("is-in", k > 0.6);
      return { x, y, r: rad };
    }
  };
}

// cena final: cada frase muda o painel; devolve a posição da varredura do terreno para o mapa
function setupExFinal(sec, reduce) {
  if (!sec) return null;
  const lines = [...sec.querySelectorAll(".ex-log-line")];
  const G = (k) => sec.querySelector(`[data-g="${k}"]`);
  const plan = sec.querySelector(".ex-mini-plan"), route = sec.querySelector(".ex-mini-route"), dest = sec.querySelector(".ex-mini-dest");
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => glowEase(Math.min(1, Math.max(0, (p - a) / (b - a))));
  const n = lines.length;
  // frase k aparece em starts[k]; a última (NOMAD is built for that) dispara o carimbo.
  // A do terreno (3ª) ganha mais tempo: é quando a varredura refaz o mapa.
  const BASE = [0, 0.12, 0.26, 0.6, 0.8];
  const starts = lines.map((_, k) => n === BASE.length ? BASE[k] : k * (0.8 / Math.max(1, n - 1)));
  let visible = false, r = null;
  const STATUS = ["STABLE", "REROUTING", "CHANGING", "SEVERE", "OUT OF RANGE", "READY"];
  // escreve só quando o valor muda (fora da tela os valores ficam parados e nada é reescrito)
  const gEls = {}, last = {};
  const setG = (k, v) => { v = String(v); if (last[k] === v) return; last[k] = v; (gEls[k] || (gEls[k] = G(k))).textContent = v; };
  const setOnce = (k, v, fn) => { if (last[k] === v) return; last[k] = v; fn(v); };
  return {
    active: () => visible,
    measure() { r = sec.getBoundingClientRect(); },
    update() {
      if (!r) this.measure();
      const ih = window.innerHeight;
      visible = r.top < ih && r.bottom > 0;
      const p = reduce ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - ih)));
      let cur = -1;
      starts.forEach((s, k) => { if (p >= s) cur = k; });
      lines.forEach((l, k) => { l.classList.toggle("is-past", k < cur); l.classList.toggle("is-now", k === cur); });
      const cond = seg(p, starts[1] || 0.2, (starts[1] || 0.2) + 0.12);   // "conditions may change"
      const sweepP = Math.min(1, Math.max(0, (p - (starts[2] + 0.03)) / 0.24)); // "terrain may become harder": varredura
      const terr = glowEase(sweepP);
      const far = seg(p, starts[3] || 0.6, (starts[3] || 0.6) + 0.14);    // "destination may move further away"
      const done = n && p >= starts[n - 1];
      const t = performance.now() / 1000;
      const jitter = (a) => (reduce || done ? 0 : Math.sin(t * 7.3 + a) * cond * 2.2);
      setG("wind", Math.round(lerp(12, 46, cond) + jitter(1)));
      setG("temp", Math.round(lerp(14, -7, cond)));
      setG("vis", lerp(10, 0.4, cond).toFixed(1));
      setG("grade", Math.round(lerp(6, 38, terr)));
      setG("dist", lerp(2.4, 18.7, far).toFixed(1));
      setG("status", done ? STATUS[5]
        : cur === 2 ? (sweepP > 0 && sweepP < 1 ? "RESURVEYING" : sweepP >= 1 ? "UNSTABLE TERRAIN" : STATUS[3])
        : STATUS[Math.min(4, cur + 1)]);
      sec.classList.toggle("is-alert", cur >= 1 && !done);
      sec.classList.toggle("is-done", !!done);
      // mini mapa: a rota real se desvia da planejada; o destino se afasta
      setOnce("route", (1 - seg(p, starts[0] || 0, (starts[0] || 0) + 0.2) * (0.62 + 0.38 * far)).toFixed(3), (v) => { route.style.strokeDashoffset = v; });
      const dx = lerp(300, 372, far), dy = lerp(92, 30, far);
      setOnce("dest", `${dx} ${dy}`, () => {
        dest.setAttribute("transform", `translate(${dx} ${dy})`);
        plan.setAttribute("d", `M40 204 L${dx} ${dy}`);
      });
      // posição da varredura na tela (de -0.05 a 1.06); depois dela o terreno novo fica "vivo"
      return { sweep: sweepP <= 0 ? -1 : sweepP >= 1 ? 2 : -0.05 + sweepP * 1.11, live: visible && sweepP >= 1 };
    }
  };
}

/* =========================================================
   LYNDA: abertura "construção" e fechamento com o logo
   Usam os vetores do logo em VETORES (projects.js), traçados dos arquivos do logo.
   - construcao: a curva do ombro do "a" cresce e se torna a curva da estrela; o logo se completa.
   - fecho: o logo fica fixo; a estrela cresce a partir do lugar dela e troca a versão da marca
     (cream sobre olive -> versão principal com tagline -> foto de produto). A seção trava na tela e
     cada gesto de rolagem dispara uma troca completa.
   ========================================================= */
const LY_EASE = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lyClamp = (v) => Math.min(1, Math.max(0, v));
const lySeg = (t, a, b) => lyClamp((t - a) / (b - a));
const lyLerp = (a, b, t) => a + (b - a) * t;
// curva como polilinha a partir de [x, y, x, y...]
const lyLine = (pts) => pts.reduce((d, v, i) => d + (i % 2 ? " " + v.toFixed(2) : (i ? " L" : "M") + v.toFixed(2)), "");

function lyBuildHtml(s, p) {
  const V = typeof VETORES !== "undefined" && VETORES[p.logoVetor];
  if (!V) return "";
  return `
    <section class="cs ly-build wrap" data-ly-build style="--ly-ink:${s.tinta || "#666748"}">
      <figure class="ly-stage reveal">
        <svg class="ly-build-svg" viewBox="582 411 340 191.25" role="img" aria-label="${s.legenda || "Logo construction"}">
          <path class="ly-b-letras" d="${V.letras}"/>
          <path class="ly-b-a" d="${V.a}"/>
          <path class="ly-b-star" d="${V.estrela}"/>
          <path class="ly-b-arc0" d="${lyLine(V.curvaA)}"/>
          <path class="ly-b-arc"/>
        </svg>
        <div class="ly-stage-ui">
          <span class="ly-stage-bar"><i></i></span>
          <button class="ly-replay" type="button" aria-label="Replay animation">↺ Replay</button>
        </div>
      </figure>
      ${s.legenda ? `<p class="ly-build-cap reveal">${s.legenda}</p>` : ""}
    </section>`;
}

function lyCloseHtml(s, p) {
  const V = typeof VETORES !== "undefined" && VETORES[p.logoVetor];
  if (!V || !p.simbolo) return "";
  return `
    <section class="ly-close" data-ly-close data-img="${s.imagem || ""}" style="--ly-ink:${s.tinta || "#666748"}" aria-label="${p.titulo} — ${p.tagline || ""}">
      <div class="ly-close-stage"><svg class="ly-close-svg" aria-hidden="true"></svg></div>
    </section>`;
}

function setupLynda(root) {
  if (window.__lyCleanup) window.__lyCleanup();
  const art = root.querySelector(".case");
  if (!art) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offs = [];
  art.querySelectorAll("[data-ly-build]").forEach((el) => offs.push(lyBuild(el, reduce)));
  const proj = PROJECTS.find((x) => art.dataset.id === x.id);
  art.querySelectorAll("[data-ly-close]").forEach((el) => offs.push(lyClose(el, proj, reduce)));
  offs.push(pauseFluidUnder(art));
  window.__lyCleanup = () => { offs.forEach((f) => f && f()); window.__lyCleanup = null; };
}

// ---------- abertura: a curva do "a" vira a estrela ----------
function lyBuild(el, reduce) {
  const V = VETORES[(PROJECTS.find((x) => el.closest(".case").dataset.id === x.id) || {}).logoVetor];
  const svg = el.querySelector("svg"), q = (c) => el.querySelector(c);
  const aEl = q(".ly-b-a"), star = q(".ly-b-star"), letras = q(".ly-b-letras"), arc0 = q(".ly-b-arc0"), arc = q(".ly-b-arc");
  const bar = q(".ly-stage-bar i"), btn = q(".ly-replay");
  const CA = V.curvaA, CE = V.curvaE;
  const LEN = arc0.getTotalLength ? arc0.getTotalLength() : 60;      // comprimento real, para "desenhar" o traço
  arc0.style.strokeDasharray = `${LEN} ${LEN}`;
  const [scx, scy] = [790.7, 459.5];                                  // centro da estrela (coordenadas do logo)
  const VB0 = [582, 411, 340, 191.25], VB1 = [218, 348, 660, 371.25]; // câmera: perto do "a" -> logo inteiro
  const DUR = 7.2;
  let raf = 0, t0 = 0;
  function render(t) {
    const e = (a, b) => LY_EASE(lySeg(t, a, b));
    aEl.style.opacity = e(0, 0.9);
    aEl.style.transform = `translateY(${(1 - e(0, 0.9)) * 6}px)`;
    arc0.style.strokeDashoffset = (LEN * (1 - e(1.0, 2.0))).toFixed(2);
    arc0.style.opacity = 1 - e(4.3, 4.9);
    // a cópia da curva viaja do ombro do "a" até a estrela, ponto a ponto (encaixa nos dois contornos reais)
    const m = e(2.3, 3.6), vis = lySeg(t, 2.25, 2.35) * (1 - e(4.3, 4.9));
    arc.setAttribute("d", lyLine(CA.map((v, k) => lyLerp(v, CE[k], m))));
    arc.style.opacity = vis;
    const f = e(3.5, 4.4);
    star.style.opacity = f;
    star.style.transform = `translate(${scx}px, ${scy}px) scale(${0.82 + 0.18 * f}) rotate(${(1 - f) * -18}deg) translate(${-scx}px, ${-scy}px)`;
    // câmera abre e o resto do nome entra
    const z = e(4.8, 6.6);
    svg.setAttribute("viewBox", VB0.map((v, k) => lyLerp(v, VB1[k], z).toFixed(2)).join(" "));
    const l = e(5.2, 6.7);
    letras.style.opacity = l;
    letras.style.transform = `translateX(${(1 - l) * -14}px)`;
    bar.style.transform = `scaleX(${lyClamp(t / DUR)})`;
    el.classList.toggle("is-done", t >= DUR);
  }
  function step(now) {
    const t = (now - t0) / 1000;
    render(t);
    raf = t < DUR ? requestAnimationFrame(step) : 0;
  }
  function play() { cancelAnimationFrame(raf); if (reduce) return render(DUR); t0 = performance.now(); raf = requestAnimationFrame(step); }
  render(reduce ? DUR : 0);
  let played = false;
  const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !played) { played = true; play(); } }, { threshold: 0.55 });
  io.observe(el);
  btn.addEventListener("click", play);
  return () => { cancelAnimationFrame(raf); io.disconnect(); };
}

// ---------- fechamento: a estrela troca a versão da marca (toca sozinho ao aparecer) ----------
function lyClose(el, p, reduce) {
  const V = VETORES[p.logoVetor];
  const svg = el.querySelector("svg"), stage = el.querySelector(".ly-close-stage");
  const cs = getComputedStyle(el);
  const cream = cs.getPropertyValue("--c-light").trim() || "#E5D8C5";
  const ink = cs.getPropertyValue("--ly-ink").trim() || "#666748";
  const gold = cs.getPropertyValue("--c-accent").trim() || "#E6B23A";
  const foto = el.dataset.img || "";
  // cream sobre olive -> versão principal com tagline -> foto de produto
  const L = [
    { bg: ink, fg: cream, star: cream },
    { bg: cream, fg: ink, star: gold, tag: true },
    { foto: true }
  ];
  const LB = [265.7, 418.5, 832.1, 641.8];              // caixa do logo + tagline (coordenadas do logo)
  const SC = [790.7, 459.5], SW = 84.7;                 // centro e largura da estrela do logo
  // v vai de 0 a 2: cada inteiro é uma versão. A rolagem só escolhe a versão; a troca roda sozinha até o fim.
  const STEP_S = 1.4;                                   // duração de cada troca, em segundos
  let W = 0, H = 0, sc = 1, tx = 0, ty = 0, clips = [], tagEl = null, raf = 0, v = 0, target = 0, from = 0, t0 = 0;
  function build() {
    W = stage.clientWidth; H = stage.clientHeight;
    const lw = Math.min(W * (W < 720 ? 0.82 : 0.62), 760);
    sc = lw / (LB[2] - LB[0]);
    tx = (W - lw) / 2 - LB[0] * sc; ty = (H - (LB[3] - LB[1]) * sc) / 2 - LB[1] * sc;
    const layer = (c) => c.foto
      ? (foto ? `<image href="${foto}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`
              : `<rect width="${W}" height="${H}" fill="#34362A"/><text x="${W / 2}" y="${H / 2}" text-anchor="middle" class="ly-close-ph">Product image</text>`)
      : `<rect width="${W}" height="${H}" fill="${c.bg}"/><g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${sc.toFixed(4)})">
        <path fill="${c.fg}" d="${V.letras}${V.a}"/><path fill="${c.star}" d="${V.estrela}"/>
        ${c.tag ? `<path class="ly-close-tag" fill="${c.fg}" d="${V.tagline}"/>` : ""}</g>`;
    const layers = L;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = `
      <defs>${layers.slice(1).map((_, k) => `<clipPath id="lyClip${k}"><path d="${p.simbolo}"/></clipPath>`).join("")}</defs>
      ${layer(layers[0])}
      ${layers.slice(1).map((c, k) => `<g clip-path="url(#lyClip${k})">${layer(c)}</g>`).join("")}`;
    clips = [...svg.querySelectorAll("clipPath path")];
    tagEl = svg.querySelector(".ly-close-tag");
    render();
  }
  function render() {
    const cx = tx + SC[0] * sc, cy = ty + SC[1] * sc;
    const k0 = (SW * sc) / 676;                                             // estrela do tamanho da do logo
    const k1 = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) / 138; // grande o bastante para cobrir a tela
    clips.forEach((c, i) => {
      const w = lyClamp(v - i);
      const k = w <= 0 ? 0 : k0 * Math.pow(k1 / k0, w);                    // crescimento exponencial: começa sutil, termina rápido
      c.setAttribute("transform", `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(w * 45).toFixed(2)}) scale(${k.toFixed(4)}) translate(-540 -540)`);
    });
    if (tagEl) tagEl.style.opacity = LY_EASE(lyClamp((v - 0.8) / 0.2));
  }
  function step(now) {
    const d = STEP_S * Math.max(0.4, Math.abs(target - from));
    const k = lyClamp((now - t0) / 1000 / d);
    v = from + (target - from) * LY_EASE(k);
    render();
    raf = k < 1 ? requestAnimationFrame(step) : 0;
  }
  // a seção fica travada na tela; cada trecho da rolagem corresponde a uma versão
  function onScroll() {
    const r = el.getBoundingClientRect(), ih = window.innerHeight;
    const pr = lyClamp(-r.top / (r.height - ih));
    const want = pr < 0.2 ? 0 : pr < 0.6 ? 1 : 2;
    if (want === target) return;
    target = want;
    if (reduce) { v = target; return render(); }
    from = v; t0 = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
  }
  build();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", build);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", build); };
}

/* =========================================================
   CASE "VIGÍLIA" (projetos com estilo: "vigilia", ex: VIGIL)
   "Vigiar para que os outros possam descansar."
   - O CAMPO: grade de pontos que respira devagar, como quem dorme (o mundo descansando). Canvas 2D.
   - O ANEL: a atenção. Chega ANTES de algo acontecer. No hero, passeia pelos pontos com calma e,
     no desktop, vai para onde o cursor VAI estar (posição prevista pela velocidade), não onde ele está.
   - Fantasma do que vem: títulos/caixas aparecem antes, em contorno (~7%), e "confirmam" ao chegar.
   - Régua de previsão: na lateral, um anel marca onde a sua rolagem VAI parar; encolhe ao se confirmar.
   - Cena final "The quiet before": o anel chega a um ponto calmo; só depois o ponto perde o ritmo
     (único momento do acento); os vizinhos quase o acompanham; tudo volta a respirar junto.
   Rótulos e números são ILUSTRATIVOS (não são dados reais).
   ========================================================= */
const vgNum = (i) => String(i).padStart(2, "0");
const vgLabel = (s, i, n) => `<p class="vg-label vg-g vg-g-text"><span>${vgNum(i + 1)} / ${vgNum(n)}</span>${s.nome}</p>`;
const vgTitle = (s, cls) => s.titulo ? `<h2 class="${cls || "vg-h2"} vg-g vg-g-title">${s.titulo}</h2>` : "";
const vgText = (s, cls) => (s.textos || []).length
  ? `<div class="vg-text vg-g vg-g-text ${cls || ""}">${s.textos.map((t) => `<p>${t}</p>`).join("")}</div>` : "";
// divisória: uma fileira de pontos (o campo em miniatura), parada
const vgRule = () => `<div class="wrap" aria-hidden="true"><div class="vg-rule"></div></div>`;

// imagem, vídeo ou espaço reservado: caixa de traço fino (é ela que aparece como "fantasma")
function vgMedia(m, cls) {
  if (!m) return "";
  let inner;
  if (m.video) inner = `<video src="${m.video}"${m.poster ? ` poster="${m.poster}"` : ""} muted loop playsinline preload="metadata" data-autoplay></video>`;
  else if (m.img) inner = `<img src="${m.img}" alt="${m.legenda || ""}" loading="lazy"${m.posicao ? ` style="object-position:${m.posicao}"` : ""}>`;
  else inner = `<span class="vg-ph"><span>Awaiting image</span><span>${m.legenda || ""}</span></span>`;
  return `
    <figure class="vg-fig vg-g vg-g-box ${cls || ""}">
      <div class="vg-frame" style="aspect-ratio:${m.proporcao || "3/2"}">${inner}</div>
      ${m.legenda && (m.img || m.video) ? `<figcaption>${m.legenda}</figcaption>` : ""}
    </figure>`;
}

// legenda da linguagem gráfica: ponto / anel / sinal, desenhados num pedaço do campo (5 x 3 pontos)
function vgLegendSvg(kind) {
  let dots = "";
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) {
    const c = i === 2 && j === 1;
    dots += `<circle cx="${12 + i * 24}" cy="${12 + j * 24}" r="${c && kind === "signal" ? 3.2 : 2}" class="${c && kind === "signal" ? "lg-acc" : "lg-dot"}"/>`;
  }
  const ring = kind === "point" ? "" : `<circle cx="60" cy="36" r="11" class="${kind === "signal" ? "lg-ring-acc" : "lg-ring"}"/>`;
  return `<svg viewBox="0 0 120 72" aria-hidden="true">${dots}${ring}</svg>`;
}

const VG_LAYOUTS = {
  "vg-intro": (s, p, i, n) => `
    <section class="vg-sec vg-intro">
      <div class="wrap vg-grid">
        <div class="vg-intro-text">
          ${vgLabel(s, i, n)}
          ${(s.textos || []).length ? `<p class="vg-lead vg-g vg-g-title">${s.textos[0]}</p>` : ""}
          ${vgText({ textos: (s.textos || []).slice(1) })}
        </div>
        ${p.info ? `<dl class="vg-spec vg-g vg-g-box">${p.info.map((x) => `<div><dt>${x.label}</dt><dd>${x.valor || "—"}</dd></div>`).join("")}</dl>` : ""}
      </div>
    </section>`,

  "vg-statement": (s, p, i, n) => `
    <section class="vg-sec vg-statement">
      <div class="wrap">
        ${vgLabel(s, i, n)}
        ${vgTitle(s, "vg-display")}
        ${vgText(s, "vg-indent")}
        ${(s.midias || []).map((m) => vgMedia(m, "vg-wide")).join("")}
      </div>
    </section>`,

  "vg-name": (s, p, i, n) => {
    const d = s.definicao;
    return `
    <section class="vg-sec vg-name">
      <div class="wrap vg-grid">
        <div class="vg-name-def">
          ${vgLabel(s, i, n)}
          ${d ? `<p class="vg-word vg-g vg-g-title">${d.palavra}</p>
          <p class="vg-def vg-g vg-g-text"><span>${d.classe}</span>${d.texto}</p>` : ""}
        </div>
        <div class="vg-name-body">
          ${vgTitle(s)}
          ${vgText(s)}
        </div>
      </div>
    </section>`;
  },

  "vg-symbol": (s, p, i, n) => {
    const m = s.midias || [];
    return `
    <section class="vg-sec vg-symbol">
      <div class="wrap">
        ${vgLabel(s, i, n)}
        ${vgTitle(s)}
        ${vgText(s, "vg-indent")}
        <div class="vg-grid vg-symbol-grid">
          ${vgMedia(m[0], "vg-sym-main")}
          <div class="vg-sym-side">${m.slice(1).map((x) => vgMedia(x)).join("")}</div>
        </div>
      </div>
    </section>`;
  },

  "vg-identity": (s, p, i, n) => {
    const cores = s.cores || [];
    const total = cores.reduce((a, c) => a + (c.uso || 1), 0) || 1;
    const maxUso = Math.max(1, ...cores.map((c) => c.uso || 1));
    const kinds = ["point", "ring", "signal"];
    return `
    <section class="vg-sec vg-identity">
      <div class="wrap">
        <div class="vg-grid">
          <div class="vg-col-head">${vgLabel(s, i, n)}${vgTitle(s)}</div>
          ${vgText(s, "vg-side")}
        </div>
        ${(s.campo || []).length ? `
        <div class="vg-legend">
          ${s.campo.map((c, k) => `
            <div class="vg-leg vg-g vg-g-box">
              ${vgLegendSvg(kinds[k] || "point")}
              <p><b>${c.nome}</b>${c.texto}</p>
            </div>`).join("")}
        </div>` : ""}
        ${cores.length ? `
        <div class="vg-palette vg-g vg-g-box">
          ${cores.map((c) => `
            <div class="vg-sw" style="--sw:${c.hex};--u:${(((c.uso || 1) / maxUso) * 100).toFixed(1)};flex-grow:${(c.uso || 1) / total}">
              <span class="vg-sw-chip"></span>
              <span class="vg-sw-name">${c.nome}</span>
              <span class="vg-sw-hex">${c.hex}</span>
            </div>`).join("")}
        </div>
        <p class="vg-note vg-g vg-g-text">Proportion of use — the accent appears only when something is detected.</p>` : ""}
        ${(s.fontes || []).length ? `
        <div class="vg-type">
          ${s.fontes.map((f) => `
            <div class="vg-type-card vg-g vg-g-box">
              <span class="vg-type-role">${f.papel} — ${f.nome}</span>
              <span class="vg-type-aa${f.mono ? " is-mono" : ""}" style="font-family:${f.familia}">Aa</span>
              <span class="vg-type-sample${f.mono ? " is-mono" : ""}" style="font-family:${f.familia}">${f.exemplo || ""}</span>
            </div>`).join("")}
        </div>` : ""}
      </div>
    </section>`;
  },

  "vg-applications": (s, p, i, n) => {
    const m = s.midias || [];
    return `
    <section class="vg-sec vg-applications">
      <div class="wrap">
        ${vgLabel(s, i, n)}
        ${vgTitle(s)}
        ${vgText(s, "vg-indent")}
        <div class="vg-grid vg-app-grid">${m.map((x, k) => vgMedia(x, k === 0 ? "vg-app-main" : "vg-app-half")).join("")}</div>
      </div>
    </section>`;
  },

  // cena final: o canvas desenha o campo e o anel; os textos entram por cima conforme a rolagem
  "vg-final": (s, p, i, n) => `
    <section class="vg-final" data-vg-final aria-label="${(s.fecho || "").replace(/"/g, "")}">
      <div class="vg-final-sticky">
        <canvas class="vg-field" aria-hidden="true"></canvas>
        <div class="wrap vg-final-head"><p class="vg-label"><span>${vgNum(i + 1)} / ${vgNum(n)}</span>${s.nome || ""}</p></div>
        ${s.calma ? `<p class="wrap vg-final-line vg-final-calma">${s.calma}</p>` : ""}
        ${s.aviso ? `<p class="wrap vg-final-line vg-final-aviso"><i></i>${s.aviso}</p>` : ""}
        <div class="vg-final-end">
          ${s.fecho ? `<p class="vg-final-fecho">${s.fecho}</p>` : ""}
          <p class="vg-final-word">${p.titulo}</p>
        </div>
      </div>
    </section>`
};

function renderVigil(p) {
  const t = p.tema || {};
  const vars = [t.fundo && `--v-paper:${t.fundo}`, t.texto && `--v-ink:${t.texto}`, t.destaque && `--v-accent:${t.destaque}`].filter(Boolean).join(";");
  const n = p.secoes.length;
  const hero = `
    <header class="vg-hero">
      <canvas class="vg-field vg-hero-field" aria-hidden="true"></canvas>
      <div class="wrap vg-hero-top"><a class="back-link" href="work.html">&larr; All work</a></div>
      <div class="wrap vg-hero-bottom">
        <p class="vg-kicker">${p.categoria}${p.ano ? " — " + p.ano : ""}</p>
        <h1 class="vg-title">${p.titulo}</h1>
        ${p.subtitulo ? `<p class="vg-sub">${p.subtitulo}</p>` : ""}
      </div>
    </header>`;
  const body = p.secoes.map((s, i) => {
    const fn = VG_LAYOUTS[s.layout];
    if (!fn) { console.warn("Layout desconhecido:", s.layout); return ""; }
    return fn(s, p, i, n);
  });
  // a régua não vai antes da cena final (ela ocupa a tela inteira)
  const html = body.map((b, i) => b + (i < body.length - 2 ? vgRule() : "")).join("");
  return `
    <article class="vg-case" style="${vars}">
      ${hero}${html}
      <div class="vg-rail" aria-hidden="true"><i class="vg-rail-cur"></i><i class="vg-rail-pred"></i></div>
    </article>`;
}

// ---------- o campo: grade de pontos que respira (compartilhado pelo hero e pela cena final) ----------
function vgField(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const cs = getComputedStyle(canvas);
  const INK = cs.getPropertyValue("--v-ink").trim() || "#15191C";
  const ACC = cs.getPropertyValue("--v-accent").trim() || "#2F8F83";
  const PAPER = cs.getPropertyValue("--v-paper").trim() || "#F3F1EA";
  // o mesmo papel com alfa 0 (gradiente para "transparent" puxa para o cinza no canvas)
  const PAPER0 = (() => { const m = PAPER.match(/^#([0-9a-f]{6})$/i); if (!m) return "rgba(243,241,234,0)"; const n = parseInt(m[1], 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},0)`; })();
  const BREATH = (Math.PI * 2) / 5.6;   // uma respiração a cada ~5,6 s, como quem dorme
  const F = { W: 0, H: 0, gap: 24, cols: 0, rows: 0, ox: 0, oy: 0, dpr: 1, INK, ACC };
  // respiração de um ponto (0..1): uma onda longa e lenta atravessa o campo na diagonal
  F.breath = (t, x, y) => 0.5 + 0.5 * Math.sin(t * BREATH - (x * 0.0042 + y * 0.0061));
  F.size = () => {
    F.dpr = Math.min(window.devicePixelRatio || 1, 2);
    F.W = canvas.clientWidth; F.H = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(F.W * F.dpr)); canvas.height = Math.max(1, Math.round(F.H * F.dpr));
    F.gap = F.W < 720 ? 20 : 26;
    F.cols = Math.floor(F.W / F.gap); F.rows = Math.floor(F.H / F.gap);
    F.ox = (F.W - (F.cols - 1) * F.gap) / 2; F.oy = (F.H - (F.rows - 1) * F.gap) / 2;
  };
  F.dot = (i, j) => ({ x: F.ox + i * F.gap, y: F.oy + j * F.gap });
  F.nearest = (x, y, maxY, minY) => {
    const i = Math.min(F.cols - 2, Math.max(1, Math.round((x - F.ox) / F.gap)));
    const jMin = Math.max(1, Math.ceil(((minY || 0) - F.oy) / F.gap));
    const jMax = Math.max(jMin, Math.min(Math.floor(((maxY || F.H) - F.oy) / F.gap), F.rows - 2));
    const j = Math.min(jMax, Math.max(jMin, Math.round((y - F.oy) / F.gap)));
    return { i, j };
  };
  // st: { an: {i, j, d} (ponto fora do ritmo), ring: {x, y, r, k, a, acc}, dim (0..1), clear (0..1, abre o centro) }
  F.draw = (t, st) => {
    st = st || {};
    const g = F.gap, R = g < 24 ? 1.55 : 1.8;
    ctx.setTransform(F.dpr, 0, 0, F.dpr, 0, 0);
    ctx.clearRect(0, 0, F.W, F.H);
    const an = st.an && st.an.d > 0.001 ? st.an : null;
    const ap = an ? F.dot(an.i, an.j) : null;
    const sAn = an ? 0.5 + 0.5 * Math.sin(t * BREATH * 2.7 + 1.3 + 0.6 * Math.sin(t * 4.1)) : 0;   // ritmo próprio, irregular
    ctx.beginPath();
    for (let j = 0; j < F.rows; j++) {
      for (let i = 0; i < F.cols; i++) {
        if (an && i === an.i && j === an.j) continue;
        const x = F.ox + i * g, y = F.oy + j * g;
        let s = F.breath(t, x, y);
        if (an) {   // os vizinhos quase pegam o ritmo do ponto fora de compasso
          const dd = Math.hypot(x - ap.x, y - ap.y) / g;
          if (dd < 4) s += (sAn - s) * an.d * 0.42 * (1 - dd / 4);
        }
        const r = R * (0.5 + 0.5 * s);
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
      }
    }
    ctx.globalAlpha = 0.34 * (1 - 0.55 * (st.dim || 0));
    ctx.fillStyle = INK; ctx.fill();
    // o ponto fora do ritmo: treme de leve e ganha o acento
    if (an) {
      const x = ap.x + an.d * 2.2 * Math.sin(t * 6.3), y = ap.y + an.d * 1.6 * Math.cos(t * 4.7);
      const r = R * (0.42 + 0.58 * sAn) * (1 + 0.5 * an.d);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.globalAlpha = 0.34 * (1 - an.d); ctx.fillStyle = INK; ctx.fill();
      ctx.globalAlpha = an.d; ctx.fillStyle = ACC; ctx.fill();
    }
    // o centro "abre" para o texto final
    if (st.clear > 0.001) {
      const gr = ctx.createRadialGradient(F.W / 2, F.H / 2, 0, F.W / 2, F.H / 2, Math.max(F.W, F.H) * 0.5);
      gr.addColorStop(0, PAPER); gr.addColorStop(0.55, PAPER); gr.addColorStop(1, PAPER0);
      ctx.globalAlpha = 0.92 * st.clear; ctx.fillStyle = gr; ctx.fillRect(0, 0, F.W, F.H);
    }
    // o anel: atenção
    const rg = st.ring;
    if (rg && rg.a > 0.005 && rg.k > 0.005) {
      ctx.beginPath(); ctx.arc(rg.x, rg.y, rg.r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rg.k);
      ctx.lineWidth = 1;
      ctx.globalAlpha = rg.a * (1 - (rg.acc || 0)) * 0.75; ctx.strokeStyle = INK; ctx.stroke();
      if (rg.acc > 0.005) { ctx.globalAlpha = rg.a * rg.acc; ctx.strokeStyle = ACC; ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  };
  return F;
}

// laço de animação só enquanto o elemento está na tela; ~30 quadros/s em telas de toque (respiração é lenta)
function vgLoop(el, fn) {
  const coarse = !window.matchMedia("(pointer: fine)").matches;
  let raf = 0, on = false, last = 0, acc = 0;
  const step = (now) => {
    raf = 0;
    if (!on) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    acc += dt;
    if (!coarse || acc >= 1 / 31) { fn(now / 1000, acc); acc = 0; }
    raf = requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    if (on && !raf) { last = 0; raf = requestAnimationFrame(step); }
  });
  io.observe(el);
  return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); };
}
const vgEase = (cur, target, dt, tau) => cur + (target - cur) * (1 - Math.exp(-dt / tau));
const vgSeg = (p, a, b) => { const t = Math.min(1, Math.max(0, (p - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- hero: o anel passeia pelo campo; no desktop, vai para onde o cursor VAI estar ----------
function vgHero(sec, reduce) {
  const canvas = sec.querySelector(".vg-hero-field");
  const F = canvas && vgField(canvas);
  if (!F) return null;
  const fine = window.matchMedia("(pointer: fine)").matches;
  F.size();
  // o anel fica abaixo do header e acima da máscara (onde o campo aparece)
  const zone = () => F.H * (F.W < 720 ? 0.36 : 0.42);
  const zTop = () => (F.W < 720 ? 120 : 140);
  const near = (x, y) => F.nearest(x, y, zone(), zTop());
  let tgt = near(F.W * 0.68, F.H * 0.26);
  let p0 = F.dot(tgt.i, tgt.j);
  const ring = { x: p0.x, y: p0.y, r: 13, k: 0, a: 0 };
  let nextScan = 0, lastMove = -1e9, t0 = performance.now() / 1000;
  const cur = { x: 0, y: 0, vx: 0, vy: 0, t: 0 };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect(), now = performance.now();
    const x = e.clientX - r.left, y = e.clientY - r.top, dt = Math.max(1, now - cur.t);
    if (now - cur.t < 120) { cur.vx = cur.vx * 0.6 + ((x - cur.x) / dt) * 0.4; cur.vy = cur.vy * 0.6 + ((y - cur.y) / dt) * 0.4; }
    else { cur.vx = 0; cur.vy = 0; }
    cur.x = x; cur.y = y; cur.t = now;
    if (y < 0 || y > F.H) return;
    lastMove = now / 1000;
  };
  if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });
  function frame(t, dt) {
    if (t - lastMove <= 2.6) {
      // previsão: onde o cursor vai estar daqui a ~0,45 s. Quando ele para, a velocidade some
      // e o anel volta para o cursor (a previsão "se confirma")
      const age = t * 1000 - cur.t, k = age > 80 ? Math.exp(-(age - 80) / 160) : 1;
      tgt = near(cur.x + cur.vx * 450 * k, cur.y + cur.vy * 450 * k);
    } else if (t > nextScan) {
      // sem cursor recente: o anel escolhe outro ponto por perto, sem pressa
      const ni = tgt.i + Math.round((Math.random() - 0.5) * 10), nj = tgt.j + Math.round((Math.random() - 0.5) * 6);
      const c = F.dot(Math.min(F.cols - 2, Math.max(1, ni)), Math.max(1, nj));
      tgt = near(c.x, c.y);
      nextScan = t + 2.4 + Math.random() * 1.6;
    }
    const d = F.dot(tgt.i, tgt.j);
    ring.x = vgEase(ring.x, d.x, dt, 0.32); ring.y = vgEase(ring.y, d.y, dt, 0.32);
    const far = Math.min(1, Math.hypot(d.x - ring.x, d.y - ring.y) / (F.gap * 3));
    ring.r = vgEase(ring.r, 12 + far * 7, dt, 0.2);          // maior enquanto procura, menor quando assenta
    const life = t - t0;
    ring.k = vgSeg(life, 0.8, 2.2); ring.a = ring.k;
    F.draw(t, { ring });
  }
  const resize = () => { F.size(); const d = F.dot(tgt.i, tgt.j); ring.x = d.x; ring.y = d.y; if (reduce) F.draw(0, { ring: { ...ring, k: 1, a: 1 } }); };
  window.addEventListener("resize", resize);
  let stop = null;
  if (reduce) F.draw(0, { ring: { ...ring, k: 1, a: 1 } });
  else stop = vgLoop(sec, (now, dt) => frame(now, dt));
  return () => { if (stop) stop(); window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", resize); };
}

// ---------- cena final "The quiet before" ----------
function vgFinal(sec, reduce) {
  const canvas = sec.querySelector(".vg-field");
  const F = canvas && vgField(canvas);
  if (!F) return null;
  const q = (c) => sec.querySelector(c);
  const calma = q(".vg-final-calma"), aviso = q(".vg-final-aviso"), fecho = q(".vg-final-fecho"), word = q(".vg-final-word");
  let r = null, p = 0, an = { i: 0, j: 0, d: 0 };
  const v = { ring: 0, d: 0, end: 0 };
  function place() {
    F.size();
    const mob = F.W < 720;
    const a = F.nearest(F.W * (mob ? 0.68 : 0.64), F.H * (mob ? 0.4 : 0.44));
    an.i = a.i; an.j = a.j;
  }
  // alvos a partir da rolagem; os valores mostrados se aproximam devagar (sem trancos)
  const targets = () => ({
    ring: vgSeg(p, 0.24, 0.32) * (1 - vgSeg(p, 0.72, 0.8)),   // o anel chega antes...
    d: vgSeg(p, 0.4, 0.48) * (1 - vgSeg(p, 0.6, 0.7)),         // ...do ponto perder o ritmo
    end: vgSeg(p, 0.8, 0.9)
  });
  const lastOp = {};
  const op = (el, k, val) => {
    if (!el) return;
    const s = val.toFixed(3);
    if (lastOp[k] === s) return;
    lastOp[k] = s; el.style.opacity = s; el.style.transform = `translateY(${((1 - val) * 10).toFixed(1)}px)`;
  };
  function texts() {
    if (reduce) { op(calma, "c", 0); op(aviso, "a", 0); op(fecho, "f", 1); op(word, "w", 1); return; }
    op(calma, "c", vgSeg(p, 0.02, 0.08) * (1 - vgSeg(p, 0.2, 0.27)));
    op(aviso, "a", vgSeg(p, 0.45, 0.51) * (1 - vgSeg(p, 0.65, 0.71)));
    op(fecho, "f", vgSeg(p, 0.83, 0.89));
    op(word, "w", vgSeg(p, 0.9, 0.97));
  }
  function frame(t, dt) {
    const T = targets();
    v.ring = vgEase(v.ring, T.ring, dt, 0.45); v.d = vgEase(v.d, T.d, dt, 0.5); v.end = vgEase(v.end, T.end, dt, 0.5);
    const c = F.dot(an.i, an.j);
    an.d = v.d;
    F.draw(t, {
      an,
      ring: { x: c.x, y: c.y, r: (F.gap < 24 ? 13 : 16) + 3 * v.d, k: v.ring, a: Math.min(1, v.ring * 1.4), acc: v.d },
      dim: v.end, clear: v.end
    });
  }
  place();
  texts();
  const onResize = () => { place(); if (reduce) F.draw(0, { dim: 1, clear: 1 }); };
  window.addEventListener("resize", onResize);
  let stop = null;
  if (reduce) F.draw(0, { dim: 1, clear: 1 });
  else stop = vgLoop(sec, (now, dt) => frame(now, dt));
  return {
    measure() { r = sec.getBoundingClientRect(); },
    update() {
      if (reduce || !r) return;
      const np = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      if (np !== p) { p = np; texts(); }
    },
    destroy() { if (stop) stop(); window.removeEventListener("resize", onResize); }
  };
}

// ---------- régua de previsão: onde a sua rolagem VAI parar ----------
function vgRail(el, art, reduce) {
  if (!el || reduce) { if (el) el.style.display = "none"; return null; }
  const cur = el.querySelector(".vg-rail-cur"), pred = el.querySelector(".vg-rail-pred");
  const coarse = !window.matchMedia("(pointer: fine)").matches;
  const TAU = coarse ? 480 : 260;          // ms: quanto a rolagem ainda anda depois do gesto (inércia)
  const GROW = coarse ? 1 : 2.4;           // quanto o anel cresce com a incerteza (no toque, menos: fica dentro da tela)
  let v = 0, lastY = window.scrollY, lastT = performance.now(), lastEv = 0, raf = 0, shown = { p: 0, u: 0 }, H = 0, top = 0, span = 1, vis = false;
  const measure = () => {
    const r = art.getBoundingClientRect(), ih = window.innerHeight;
    H = el.clientHeight; top = window.scrollY + r.top; span = Math.max(1, art.offsetHeight - ih);
    vis = r.top < -ih * 0.6 && r.bottom > ih * 0.4;
  };
  const onScroll = () => {
    const now = performance.now(), y = window.scrollY, dt = now - lastT;
    if (dt > 0) v = dt < 140 ? v * 0.55 + ((y - lastY) / dt) * 0.45 : 0;
    lastY = y; lastT = now; lastEv = now;
    if (!raf) raf = requestAnimationFrame(loop);
  };
  let lt = 0;
  function loop(now) {
    raf = 0;
    const dt = lt ? Math.min(64, now - lt) : 16; lt = now;
    if (now - lastEv > 90) v *= Math.exp(-dt / 90);      // gesto acabou: a previsão converge
    measure();
    const y = window.scrollY, ih = window.innerHeight;
    const pc = Math.min(1, Math.max(0, (y - top) / span));
    const pp = Math.min(1, Math.max(0, (y + v * TAU - top) / span));
    const u = Math.min(1, Math.abs(v * TAU) / ih);        // incerteza: gesto maior, anel maior
    shown.p = vgEase(shown.p, pp, dt / 1000, 0.08); shown.u = vgEase(shown.u, u, dt / 1000, 0.12);
    el.classList.toggle("is-on", vis);
    cur.style.transform = `translate3d(0, ${(pc * H).toFixed(1)}px, 0)`;
    pred.style.transform = `translate3d(0, ${(shown.p * H).toFixed(1)}px, 0) scale(${(1 + shown.u * GROW).toFixed(3)})`;
    pred.style.opacity = (0.45 + 0.55 * Math.min(1, shown.u * 3)).toFixed(3);
    if (Math.abs(v) > 0.003 || Math.abs(shown.p - pc) > 0.0005 || shown.u > 0.002) raf = requestAnimationFrame(loop);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
}

function setupVigil(root) {
  if (window.__vgCleanup) window.__vgCleanup();
  const art = root.querySelector(".vg-case");
  if (!art) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.setAttribute("data-header-theme", "light");
  const offs = [];

  // fantasma do que vem: previsão ao entrar na tela, confirmação ao passar da linha dos 80%
  const ghosts = [...art.querySelectorAll(".vg-g")];
  if (reduce || !("IntersectionObserver" in window)) {
    ghosts.forEach((el) => el.classList.add("is-predicted", "is-confirmed"));
  } else {
    const predict = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-predicted");
    }), { rootMargin: "0px" });
    const confirm = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-predicted", "is-confirmed");
      confirm.unobserve(e.target); predict.unobserve(e.target);
    }), { rootMargin: "0px 0px -20% 0px" });
    ghosts.forEach((el) => { predict.observe(el); confirm.observe(el); });
    offs.push(() => { predict.disconnect(); confirm.disconnect(); });
  }

  offs.push(vgHero(art.querySelector(".vg-hero"), reduce));
  const fin = vgFinal(art.querySelector("[data-vg-final]"), reduce);
  if (fin) {
    offs.push(fin.destroy);
    let ticking = false;
    const update = () => { ticking = false; fin.measure(); fin.update(); };
    const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    offs.push(() => { window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); });
    update();
  }
  offs.push(vgRail(art.querySelector(".vg-rail"), art, reduce));
  offs.push(pauseFluidUnder(art));
  if (typeof setupVideos === "function") setupVideos();

  window.__vgCleanup = () => {
    offs.forEach((f) => f && f());
    document.documentElement.removeAttribute("data-header-theme");
    window.__vgCleanup = null;
  };
}

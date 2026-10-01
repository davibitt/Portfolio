# CLAUDE.md — Portfólio de Davi Bittencourt

> **Para o Claude que continuar este projeto:** este arquivo é a memória do trabalho feito até aqui (várias conversas longas).
> Leia tudo antes de agir. Depois, **releia `js/projects.js` e `js/project-page.js`** antes de propor qualquer mudança.
> Converse com o Davi em **português**. O site é todo em **inglês**.

---

## 1. Quem é o Davi e como trabalhar com ele

- **Perfil:** designer gráfico e diretor de arte brasileiro, com foco em **branding**. Também faz sites (programados com o Claude), editorial e vídeo.
- **Objetivo do site:** portfólio para **fechar trabalhos** com clientes de fora do Brasil. Por isso o site é em inglês.
- **Hospedagem:** GitHub Pages. O trabalho agora continua num repositório no **GitHub Codespaces**.

### Regras fixas (seguir sempre)

- **Planejar antes de executar.** Em qualquer tarefa maior que uma pergunta simples: plano curto (passos, arquivos, suposições) e **esperar confirmação**. Se algo estiver ambíguo, **perguntar**, não adivinhar.
- **Alterações incrementais.** Não reescrever arquivos inteiros sem necessidade. Reler o que existe antes de mudar.
- **Testar antes de entregar.** Dizer claramente o que não foi testado ou depende de suposição.
- **Ser econômico e direto.** Não criar arquivos, artefatos ou explicações que ele não pediu.
- **Sinalizar custo.** Ele pediu explicitamente: **sempre dizer qual opção gasta menos créditos.** Ele prefere fazer tudo numa rodada só a várias idas e voltas.
- **Honestidade sobre textos.** **Nunca inventar** processo, decisões, dados ou textos de case. Quando interpretar algo além do que ele disse, **marcar isso claramente**. Tudo que é provisório leva o marcador `TROCAR` no código.
- **Criatividade.** Ele gosta de opinião sincera e de propostas ousadas ("seja criativo", "o céu é o limite"), mas quer ser **consultado antes de mudanças estruturais**. Apresentar a ideia, esperar o "pode fazer".
- **Como ele avalia:** exigente com detalhe visual (alinhamento, espaçamento, legibilidade). Manda prints quando algo está errado. Confirmar correções com **medições reais** e prints com zoom, não só no olho.
- **O que ele NÃO gosta** (aprendido na prática): efeitos "brutos" ou pesados em marcas delicadas (ver Lynda, seção 4); efeitos que parecem feitos às pressas ("trabalho de estagiário"); repetir no case novo a linguagem visual de outro case.

### Regra de ouro dos cases
**Cada case tem uma linguagem visual própria, derivada do conceito da marca**, e não repete o layout nem os efeitos de outro case (molduras, trilhas, transições). Antes de propor algo, conferir se já existe algo parecido nos outros.

---

## 2. Estrutura técnica

HTML/CSS/JS puro, sem framework e sem build. Várias páginas; header, rodapé e blocos de contato são injetados por JS.

```
index.html          Home: hero, projetos em destaque, resumo About, resumo Serviços, CTA
work.html           Todos os projetos + filtro por categoria
project.html        Página de case (?id=...), montada a partir de js/projects.js
about.html          Foto, bio, ficha
services.html       Serviços + processo "How it works"
contact.html        E-mail, WhatsApp, redes
css/style.css       Todo o CSS (tokens no topo; blocos comentados por seção/case)
js/site-config.js   Dados de contato
js/projects.js      TODOS OS PROJETOS (dados + textos dos cases). Documentado no topo. No fim: VETORES (gerado)
js/layout.js        Header, rodapé, blocos de contato
js/main.js          Cards, filtro, animação .reveal, vídeos, initPage() (e as funções __xxxCleanup)
js/project-page.js  Monta os cases: editorial (Lynda), timeline (Wilker), expedição (NOMAD), vigília (VIGIL)
js/fluid.js         Fundo em fluido WebGL2. CONFIG no topo. Pausa com window.__fluidPaused = true
assets/lynda/       Imagens da Lynda (otimizadas)
assets/fonts/       Sylvena-Regular.woff2
assets/nomad/       nomad-stamp.svg e nomad-wordmark.svg (a marca em vetor; não são usados pelo site)
tools/              Scripts que geraram vetores (ver seção 6). Não fazem parte do site.
```

### Pontos importantes do código
- **Idioma:** texto visível em inglês; **comentários e nomes de campos em português** (é o Davi quem edita `projects.js`).
- **Lista de projetos:** `TODOS_PROJETOS`; `PROJECTS` = os com `publicado !== false`. "Client Name 2/3" são modelos com `publicado: false`.
- **Qual renderização cada case usa** (`renderProjectPage` em `project-page.js`):
  - `estilo: "expedicao"` → `renderExpedition` (NOMAD)
  - `estilo: "timeline"` → família timeline (Wilker)
  - `estilo: "vigilia"` → `renderVigil` (VIGIL)
  - tem `secoes` → case editorial com `CASE_LAYOUTS` (Lynda)
  - nada disso → layout simples
- **Limpeza ao trocar de página:** cada família registra `window.__xxxCleanup` (`__tlCleanup`, `__lyCleanup`, `__exCleanup`, `__vgCleanup`), chamados em `initPage()` do `main.js`. Toda animação nova com listeners/rAF/WebGL **precisa** de cleanup.
- **Desempenho (não desfazer):**
  - `project-page.js` só é carregado em `project.html`.
  - O fluido roda no máximo a ~60 fps (`FRAME_MS` em `fluid.js`) e pausa (`__fluidPaused`) quando um case de fundo opaco cobre a tela (`pauseFluidUnder` em `project-page.js`, usado por Lynda, Wilker e VIGIL; o NOMAD tem a própria lógica).
  - No shader do mapa NOMAD, o terreno "difícil" só é calculado com `uSweep > -0.5` (antes disso ele é invisível).
  - Handlers de rolagem: fazer **todas as leituras** (`getBoundingClientRect`, `offsetHeight`) **antes das escritas** no DOM e não reescrever texto igual (ver `setH`/`setG`, `measure()`/`update()` no NOMAD).
  - Imagem de capa dos cases: `fetchpriority="high"`, sem `loading="lazy"` (parâmetro `eager` de `caseMedia`/`tlMedia`/`exMedia`).
- **Grid da home/Work:** tamanhos automáticos (largo/estreito); último card ímpar ocupa a largura toda.
- **Acentos em `projects.js`:** ao editar via script, normalizar com `unicodedata.normalize("NFC", ...)`.

### Visual global
- Fundo escuro `#0d0b14` com névoa de fluido WebGL, paleta roxo → verde-água (`#6A30C3 … #72EFDD`), bem sutil (MOUSE 0.03, AMBIENT 0.019). Ele pediu várias vezes para ficar **mais sutil**.
- Fontes: Space Grotesk (títulos), Inter (texto), IBM Plex Mono (detalhes). Cards com `border-radius: 16px`. Nome "Davi Bittencourt" sem degradê.

---

## 3. Os cases (estado atual)

### Lynda — marca de beleza e joias (case **editorial**, publicado, **tem imagens reais**)
**Tom:** leve, delicado, luz e pele. Nada pesado.
**Cores:** Olive `#666748`, Gold `#E6B23A`, Cream `#E5D8C5`; fundo do case = Olive escurecido `#34362A`.
**Fontes:** Sylvena (arquivo local; **licença web pendente**, o Davi precisa conferir) + Raleway.
**Conceito real:** a curva da estrela ecoa uma curva do "a". Medindo o desenho, a curva que combina é o **ombro** do "a" (arco de cima) — foi o que usamos (a legenda da abertura é interpretação minha; o Davi não contestou).
**Regras de texto dele:** não usar "premium / luxury / elegant" em excesso; não descrever o processo como "trocar a estrela por um ponto".

Seções, em ordem (`secoes` no `projects.js`):
0. **`construcao`** (abertura, logo após a capa): palco Cream que toca sozinho ao aparecer (IntersectionObserver), com barra de progresso e botão Replay. O "a" entra; um traço Gold desenha o **contorno real** do ombro do "a"; uma cópia viaja ponto a ponto e vira o **contorno real** da curva da estrela; a estrela se preenche em Gold; a câmera (viewBox) abre e "Lynd" completa o logo. Usa `VETORES.lynda` (`curvaA`, `curvaE`, `letras`, `a`, `estrela`).
   - Histórico: a 1ª versão usava círculos ajustados e ficou desalinhada (o ombro não é circular, desvio 2,5 px). Corrigido com os contornos reais deslocados 1,6 un. para fora. **Não voltar a usar círculos.**
   - Armadilha: `vector-effect: non-scaling-stroke` + `pathLength` quebra o "desenhar" do traço no Chrome (vira tracejado). Usar `getTotalLength()` e dasharray em unidades reais.
1. Overview · 2. Concept (título enorme + mosaico) · 3. Challenge (texto fixo, imagens rolam) · 4. Logo Development (fundo creme, grid de 8) · 5. Typography (alfabeto Sylvena em 3 faixas; a Sylvena não tem `& ? ! ( )`) · 6. Color Palette (amostras que expandem no hover) · 7. Secondary Mark (selo + aplicações)
8. **`fecho`** (fechamento): seção de 260vh com palco sticky. A seção trava na tela e **cada gesto de rolagem dispara uma troca completa** (animada no tempo, ~1,4 s, não presa ao scroll); rolar de volta desfaz. Versões: Cream sobre Olive → versão principal (Olive + estrela Gold + tagline "YOUR GLOW, ELEVATED") → foto de produto. A transição é a **estrela do próprio logo crescendo** (clipPath com o `simbolo`, escala exponencial + rotação).
   - **Pendente:** `imagem: ""` no `fecho` → o Davi vai mandar uma foto **inédita** de produto aplicado (não repetir nenhuma já usada no case). Vazio = espaço reservado "Product image".

**Removido a pedido dele (não repropor):** seções Visual Direction, Brand Applications, Final Identity, Reflection; cena "hot stamping" em WebGL (achou bruta/pesada); cena "iluminador" no Cream (removida); fio lateral dourado com a estrela (não ficou refinado).

**Logo vetorizado:** `VETORES.lynda` foi traçado a partir de `lynda-logo-black-on-white.jpg` e a tagline de `lynda-logo-tagline.jpg` (ver `tools/`). Se o Davi mandar o logo original em vetor, substituir (mais preciso).

### Wilker Fernandes — fotógrafo e filmmaker (família **timeline**, publicado, **cliente real**)
**Conceito:** o símbolo é uma linha do tempo capturada; W orgânico como um momento sendo gravado; círculo do REC no fim.
**Layout:** linha SVG orgânica desenhada com a rolagem, terminando num ponto vermelho que pisca; seções numeradas por timecode; ficha em forma de claquete; imagens sem borda com marcas de visor, num grid de 12 colunas **sem sobreposição** (ele reclamou de imagens "jogadas"); cores em círculos; vídeo com HUD de câmera; cena **"gravando o nome"** (`tl-scrub`), que ele adorou.
**Fontes:** Fraunces + Work Sans. **Vermelho do REC `#E0352B`: DECIDIDO, é da marca** (manter).
**Pendente:** só as imagens (capa, 2 Concept, 2 Symbol, vídeo da animação do logo, 6 Applications) e nomes reais das aplicações, HEX oficiais (usei `#000000`/`#FFFFFF`), ano. **Não alterar nada até as imagens chegarem.**
Frases interpretadas por mim (marcar se ele perguntar): "moments taken out of time — and kept"; "stops being just seen and starts being kept"; "keeping the attention on the mark and on Wilker's images".
Sugestão feita e ainda não pedida: uma "folha de contato" com as fotos dele (sequência numerada, marcações a lápis de cera).

### NOMAD — equipamentos de expedição (família **expedição**, publicado, **cliente real**)
**Conceito:** "Be ready for the unknown"; o símbolo seria uma rota sem destino predeterminado. **Não vai ter símbolo:** a marca é a palavra NOMAD com efeito de carimbo "falhado".
**Textos:** vieram de um documento feito pelo ChatGPT; eu só cortei e reorganizei. Títulos derivados por mim: "Technical precision, raw exploration.", "A system that grows with the range.", "Deeper into the world."
**Cores (provisórias, TROCAR):** laranja `#FF5B1F`, grafite `#1E2023`, texto osso `#E9E5DC`. **Fontes do case:** Archivo (eixo de largura; títulos "expandem" de 62% a 125% ao entrar) + IBM Plex Mono.

Como funciona (tudo em `project-page.js`, bloco "CASE EXPEDIÇÃO"):
- **Mapa topográfico** em WebGL1 (`EX_MAP_FS`): curvas de nível + quadrícula, rolando com o conteúdo. Só redesenha quando algo muda. O fluido do site pausa (`__fluidPaused`) enquanto o mapa cobre a tela. O canvas é recortado (`clip-path`) para não cobrir o que vem depois do artigo.
- **Rota do visitante** (SVG): no desktop, o cursor deixa um rastro tracejado **cinza** (ele pediu menos chamativo que o laranja) e waypoints quando para. Com o mouse parado 4 s, um **caminhante autônomo** assume. No toque, o caminhante faz a rota **acompanhando a leitura**: tende a descer, viradas limitadas a ~70°, fica na faixa do meio da tela, acelera quando atrasado, espera quando o usuário rola para cima. A rota **não pode passar do fim do artigo** (bloco "Have a project in mind?").
- **HUD** (só desktop): coordenadas, altitude, distância, waypoint atual (lê o rótulo da própria seção).
- **Seções = waypoints** (WP-01…): Overview (ficha = etiqueta de equipamento), Concept, The Symbol, Visual Identity (cores = etiquetas de material), **Built for the Unknown (Signal Flare)**, Expedition System (linhas de código de exemplo, TROCAR), Field Equipment, In the Field, cena final.
- **Molduras de imagem = "folha de carta topográfica"** (cabeçalho com SHEET + coordenada, margem graduada, rodapé com escala). Espaços vazios mostram curvas de nível em anéis. (Mudado porque a 1ª versão parecia a do Wilker.)
- **Imagens grandes** (ele pediu): pares com uma imagem na largura toda + uma de 7 colunas; celular sempre largura cheia.
- **Signal Flare** (`ex-flare`, 340vh): sinalizador pisca, o laranja se expande em círculo e toma a tela; dentro, o mapa inverte (grafite sobre laranja, feito no shader via `uFlare`); frase grande + fita de marcação com os 4 princípios; depois recolhe.
- **Cena final** (`ex-final`, 470vh): registro de campo + painel. Cada frase muda algo: rota real se desvia da planejada; clima vira; **"terrain may become harder" = varredura laranja que refaz o mapa** com terreno acidentado, sombreamento e picos laranja, que fica "vivo"; destino se afasta (2.4 → 18.7 km); "NOMAD is built for that." + **carimbo NOMAD** (filtro SVG `#ex-rough` aplicado só na borda/palavra; texto pequeno fica nítido).
- Coordenadas, altitudes, distâncias e códigos `NMD-...` são **decorativos**.

**Pendente:** todas as imagens (espaços com legenda indicando o conteúdo); cores oficiais; ano; papel dele no projeto; códigos reais do Expedition System.

### VIGIL — software de infraestrutura preditiva (família **vigília**, publicado, imagens pendentes)
**Briefing do Davi:** "Predictive infrastructure intelligence." / "Software that predicts infrastructure failures before they happen". **Em aberto (não assumir):** se é cliente real e que tipo de infraestrutura. Por isso o case é **abstrato** (linhas, faixas, ruído; nada de servidores ou tubulações).
**Conceito do case: "A vigília" → "Watch, so others can rest."** Vigilância calma; a página já sabe o que vem; o melhor resultado é nada acontecer. Sem alarme.
**Identidade (provisória, TROCAR):** claro (papel `#F3F1EA`, tinta `#15191C`, cinzas `#D9D7CF`/`#8B9095` escolhidos por mim), um único acento frio `#2F8F83` que só aparece quando algo é detectado. Hanken Grotesk 300 (títulos) + IBM Plex Mono (dados). Sem serifas, sem laranja/dourado/vermelho.
**Textos:** tudo é **rascunho meu** a partir das intenções do Davi (marcado TROCAR em `projects.js`): Overview, "Keep watch." (título dele), The Name (definição de "vigil" + frase), Visual Identity e a legenda Point/Ring/Signal, "Screens, reports, stationery.", "While others rest.", "A small drift. Seen early." e "Nothing happened. That's the point." (o fecho foi sugestão dele, também TROCAR). The Symbol e Applications só têm espaços reservados. Ficha técnica toda vazia (TROCAR).
**1ª versão rejeitada (não repropor):** divisórias em "cone de confiança" (feixe de luz + tracejado, "não ficou criativo") e cena final com linhas de sensores correndo ("parecem espermatozoides").
Como funciona (bloco "CASE VIGÍLIA" em `project-page.js`, CSS "CASE VIGÍLIA"):
- **O campo** (`vgField`, canvas 2D): grade de pontos que **respira** devagar (~5,6 s por respiração, onda longa na diagonal), como quem dorme = o mundo descansando. Usado no hero e na cena final. Só anima na tela (`vgLoop`, ~30 fps no toque).
- **O anel** = atenção, chega **antes** de algo acontecer. No hero passeia pelos pontos sem pressa; no desktop vai para onde o cursor **vai estar** (velocidade × 0,45 s) e, quando o cursor para, volta para ele ("a previsão se confirma"). Fica abaixo do header e acima da máscara do campo.
- **Fantasma do que vem:** títulos e caixas de imagem têm `.vg-g`; na faixa inferior da tela ficam em contorno a 7% e deslocados 24 px (`.is-predicted`); ao passar da linha dos 80% "confirmam" (`.is-confirmed`). Só CSS + 2 IntersectionObservers.
- **Régua de previsão** (`vgRail`, lateral direita, celular e desktop): ponto = onde você está; anel = onde a rolagem **vai parar** (velocidade × inércia: 260 ms mouse / 480 ms toque). Anel maior = mais incerteza; encolhe e encaixa no ponto quando a rolagem para. Aparece só depois do hero.
- **Divisórias:** fileira de pontos parada (CSS), o campo em miniatura.
- **Visual Identity:** legenda Point / Ring / Signal (SVG), barra de proporção de uso das cores (o acento é a menor fatia; no celular vira barras horizontais; proporções ilustrativas), espécimes de tipo.
- **Cena final "The quiet before"** (`vg-final`, 300vh): o campo dorme ("While others rest."); aos ~24–32% o anel se desenha sobre um ponto **calmo**; aos ~40–48% esse ponto perde o ritmo e treme (único momento do acento; anel e ponto ficam verde-azulados) e os vizinhos quase pegam o ritmo dele; "A small drift. Seen early."; o ponto volta ao compasso e o anel some; o centro abre para "Nothing happened. That's the point." e VIGIL. Valores suavizados no tempo (sem trancos ao rolar).
- **Header claro** só nesse case: atributo `data-header-theme="light"` no `<html>` (posto em `setupVigil`, retirado no `__vgCleanup`).
- `prefers-reduced-motion`: sem fantasma (tudo confirmado), campo parado, sem régua, cena final estática com o fecho visível.
- Armadilha: gradiente de canvas para `"transparent"`/`rgba(0,0,0,0)` cria auréola cinza; usar a mesma cor com alfa 0 (`PAPER0`).
**Pendente:** imagens (Concept, 3 do símbolo, 3 de aplicações), textos reais, ficha técnica, cores e fontes oficiais, ano.

---

## 4. Pendências gerais (dependem do Davi)
- Dados reais: e-mail, WhatsApp, redes (`js/site-config.js`); foto e bio (`about.html`); textos de serviços e processo; resumo About da home. (Todos marcados `TROCAR`.)
- Lynda: licença web da Sylvena; foto inédita para o `fecho`.
- Wilker: imagens e vídeo.
- NOMAD: imagens; cores e dados oficiais.
- VIGIL: tudo marcado TROCAR (textos, ficha, cores, imagens); confirmar se é cliente real e o tipo de infraestrutura.
- Deixados para depois, por decisão dele: og:image + favicon; espaço para depoimentos.

---

## 5. Como trabalhar no Codespaces

- **Ver o site:** `python3 -m http.server 8000` na raiz e abrir a porta 8000 (o Codespaces oferece o link). Abrir o arquivo direto (`file://`) também funciona, mas `IntersectionObserver` ignora `rootMargin` em `file://`.
- **Publicar:** GitHub Pages a partir da raiz do repositório.
- **Imagens novas:** otimizar com PIL — JPG até 2000 px, qualidade 82 (logos chapados 90); PNG com transparência vira WebP. Nomes em inglês: `assets/<projeto>/<projeto>-<descricao>.jpg`.
- **Testes (Playwright + Chromium):**
  - Layout: desligar o fluido com `add_init_script` bloqueando só `webgl2` (o fluido usa WebGL2; o mapa do NOMAD usa WebGL1). Para desligar tudo: `getContext = () => null`.
  - WebGL1 roda no Chromium headless com `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`.
  - Forçar `.js .reveal{opacity:1!important;transform:none!important}` e `html{scroll-behavior:auto!important}` (a rolagem suave atrapalha medições).
  - Mover o mouse para `(2,2)` antes de medir coisas que pausam no hover.
  - No headless, eventos de `scroll` e `requestAnimationFrame` podem não disparar com a tela ociosa: despachar `new Event('scroll')` manualmente.
  - Headless não se declara touch: para testar o modo toque, sobrescrever `matchMedia('(pointer: fine)')` para `false`.
  - Google Fonts pode estar bloqueado no ambiente de teste (prints com fontes substitutas).
  - Salvar prints com caminho absoluto fora da pasta do site.
  - Cuidado com `pkill -f <nome>`: pode matar o próprio shell. Usar `pkill -f "[c]hrom"`.

### Armadilhas já encontradas
- `document.fonts.check()` retorna `true` para fonte inexistente.
- `.wrap` usa `padding` lateral: não aplicar `padding` shorthand na mesma classe (usar `padding-top/bottom`).
- `section` tem padding global: seções sticky precisam de `padding: 0`.
- Imagem em célula esticada do grid precisa de `position:absolute; inset:0`.
- `overflow-x: hidden` em ancestral quebra `position: sticky`; usar `overflow-x: clip`.
- Carrossel: imagens com `-webkit-user-drag:none` + `preventDefault` no `pointerdown`.
- Filtro SVG aplicado em texto pequeno o deixa ilegível no celular: aplicar só nos elementos grandes.

---

## 6. `tools/` (scripts auxiliares, fora do site)
- `tools/nomad/make_mark.py` — gera `nomad-stamp.svg` e `nomad-wordmark.svg`: Archivo (wdth 125, wght 900) + IBM Plex Mono em contornos (fontTools + uharfbuzz), desgaste como **geometria real** (Shapely + ruído + scikit-image). Precisa de `archivo.ttf` e `plexmono.ttf` (baixar de `github.com/google/fonts`, pastas `ofl/archivo` e `ofl/ibmplexmono`).
- `tools/lynda/trace.py`, `trace2.py` (tagline), `curves.py` — vetorizaram o logo e as curvas da Lynda a partir dos JPGs (skimage `find_contours` + Shapely). O resultado já está em `VETORES` no fim do `projects.js`.
- Os scripts foram escritos para outro ambiente: **ajustar os caminhos** antes de rodar.
- A prévia num arquivo único (`build_preview.py`) era só para o ambiente do chat e não foi incluída; no Codespaces, use o servidor local.

/*
  LISTA DE PROJETOS
  ------------------
  Para adicionar um projeto novo, copie um bloco { ... } abaixo e edite os campos.
  Nenhum outro arquivo precisa ser tocado quando você adiciona/remove um projeto.

  Campos:
    id          -> usado na URL: project.html?id=SEU-ID (sem espaços/acentos)
    titulo      -> nome do projeto/cliente
    categoria   -> em inglês, ex: "Branding", "Web", "Editorial", "Motion" (vira o filtro da página Work)
    ano         -> ano de conclusão
    resumo      -> 1 frase curta (aparece no card da home)
    descricao   -> texto mais completo (aparece na página do projeto)
    ferramentas -> array de strings, ex: ["Illustrator", "Figma"]
    imagem      -> caminho da imagem de capa (coloque o arquivo em /assets). Vazio = usa o gradiente.
    galeria     -> imagens ou vídeos extras do case simples, ex: ["assets/cliente1-01.jpg", "assets/cliente1-02.mp4"]
                   A 1ª aparece larga; as demais em duas colunas. Vazio = mostra espaços de exemplo.
    gradiente   -> cor(es) do overlay do card enquanto não tem imagem real.
                   Use 1 ou 2 cores hex. Ex: ["#6A30C3", "#49BFE3"]
    linkDemo    -> URL do projeto no ar (ou "" se não tiver)
    capaVideo   -> (opcional) vídeo mp4 no lugar da capa do card, ex: "assets/cliente1-loop.mp4"
    destaque    -> (opcional) false = não aparece em "Selected work" na home (continua na página Work)
    publicado   -> (opcional) false = o projeto fica guardado aqui, mas não aparece em lugar nenhum do site
    (o tamanho dos cards no grid é automático: alterna largo/estreito e nunca deixa buraco)

  CASE COMPLETO (opcional — veja o projeto "lynda" como exemplo)
    Se o projeto tiver "secoes", a página do case usa a diagramação editorial completa.
    Sem "secoes", usa o layout simples (capa + descrição + galeria).

    subtitulo, tagline -> aparecem no topo do case
    info      -> ficha técnica: [{ label: "Role", valor: "..." }, ...]
    tema      -> cores do case: { fundo, texto, destaque, claro }
    capa      -> imagem principal do topo: { legenda, img, proporcao }
    secoes    -> lista de seções. Cada uma tem um "layout", que define a diagramação:
                 "intro"       texto grande à direita + ficha técnica
                 "mosaico"     título enorme + mosaico assimétrico (4 imagens)
                 "fixo"        texto fixo à esquerda enquanto as imagens rolam
                 "banner"      imagem de ponta a ponta + faixa de imagens menores
                 "claro"       seção em fundo claro + grid assimétrico (5 imagens)
                 "tipografia"  espécime tipográfico (use "fontes")
                 "paleta"      amostras de cor altas (use "cores")
                 "selo"        imagem circular ao lado do texto
                 "carrossel"   faixa horizontal arrastável
                 "final"       título centralizado + grid bento (6 imagens)
                 "reflexao"    fechamento tipográfico
    estilo    -> (opcional) família de case com linguagem própria: "timeline" (Wilker), "expedicao" (NOMAD),
                 "vigilia" (VIGIL). Cada família tem seus próprios layouts (tl-*, ex-*, vg-*) em project-page.js.
    simbolo   -> (opcional) o "d" do path do símbolo, exportado do Illustrator em prancheta 1080x1080.
                 Usado na transição do layout "fecho".
    logoVetor -> (opcional) nome do logo vetorizado em VETORES (fim deste arquivo), usado pelos layouts
                 "construcao" (animação de abertura) e "fecho" (fechamento com as versões da marca).
    midias    -> [{ legenda, img, proporcao, posicao }]. Sem "img", mostra um espaço com a legenda.
                 "posicao" (opcional) ajusta o enquadramento quando a imagem é cortada, ex: "50% 30%"
                 Para VÍDEO: { legenda, video: "assets/lynda-reel.mp4", poster: "assets/lynda-reel.jpg", proporcao: "16/9" }
                 (mp4 em loop, sem som; só toca quando aparece na tela. "poster" é a imagem mostrada antes de carregar)
*/

const TODOS_PROJETOS = [
  {
    id: "lynda",
    titulo: "Lynda",
    categoria: "Branding",
    ano: "",
    resumo: "Brand Identity for a Beauty & Jewelry Brand",
    subtitulo: "Brand Identity for a Beauty & Jewelry Brand",
    tagline: "Your glow, elevated.",
    info: [
      { label: "Role", valor: "Brand & Visual Identity Designer" },
      { label: "Scope", valor: "Brand Strategy, Logo Design, Visual Identity, Packaging, Art Direction" },
      { label: "Tools", valor: "Adobe Illustrator, Adobe Photoshop" }
    ],
    ferramentas: ["Adobe Illustrator", "Adobe Photoshop"],
    imagem: "assets/lynda/lynda-cover.jpg",
    gradiente: ["#3A3C2B", "#E6B23A"],
    linkDemo: "",
    // Cores oficiais da marca: Olive #666748, Gold #E6B23A, Cream #E5D8C5
    // fundo do case: Olive escurecido (o Olive puro deixaria o texto com pouco contraste)
    tema: { fundo: "#34362A", texto: "#E5D8C5", destaque: "#E6B23A", claro: "#E5D8C5" },
    // símbolo (estrela) da marca, do arquivo LYNDA-SYMBOL.svg: usado na transição do fechamento
    logoVetor: "lynda",
    simbolo: "M877.02,540.48c-92.93,0-177.35,37.8-238.45,98.59-60.79,61.11-98.6,145.21-98.6,238.45,0-93.24-37.8-177.34-98.9-238.45-61.11-60.79-145.22-98.59-238.45-98.59,93.24,0,177.35-37.8,238.45-98.91,61.11-61.11,98.9-145.53,98.9-238.45,0,186.16,150.88,337.36,337.05,337.36Z",
    capa: { legenda: "Main logo / application", img: "assets/lynda/lynda-cover.jpg", proporcao: "16/9", posicao: "50% 42%" },
    secoes: [
      {
        // abertura: a curva do ombro do "a" cresce e vira a curva da estrela (toca sozinha ao aparecer)
        layout: "construcao", tinta: "#666748",
        legenda: "The sparkle takes its curve from the rounded shoulder of the “a”."
      },
      {
        layout: "intro", numero: "01", nome: "Overview",
        textos: [
          "Lynda is a self-initiated concept for a beauty and jewelry brand built around the idea of glow as an expression of confidence and individuality.",
          "The identity combines the refinement associated with fine jewelry with the warmth and intimacy of the beauty industry, creating a visual language that feels sophisticated, contemporary, and personal."
        ]
      },
      {
        layout: "mosaico", numero: "02", nome: "Concept",
        titulo: "Glow as a feeling, not just a visual effect.",
        textos: [
          "The identity was developed around the idea of subtle radiance — something that catches attention without demanding it.",
          "The visual direction balances olive, warm cream, and gold with refined typography and understated details, creating a system designed to feel elegant without becoming overly ornate."
        ],
        midias: [
          { legenda: "Hero composition", img: "assets/lynda/lynda-campaign.jpg", posicao: "50% 30%" },
          { legenda: "Main logo", img: "assets/lynda/lynda-logo-primary.jpg" },
          { legenda: "Logo with tagline", img: "assets/lynda/lynda-logo-tagline.jpg" },
          { legenda: "Close-up: sparkle in the wordmark", img: "assets/lynda/lynda-sparkle-detail.jpg", proporcao: "21/9" }
        ]
      },
      {
        layout: "fixo", numero: "03", nome: "The Challenge",
        titulo: "Making glow part of the identity.",
        textos: [
          "The challenge was to translate the ideas of beauty and glow into the identity without allowing the sparkle to become just another decorative element.",
          "The goal was to make it feel like part of Lynda — not something simply added to it."
        ],
        midias: [
          { legenda: "Early logo exploration", img: "assets/lynda/lynda-early-logo.jpg", proporcao: "4/5", posicao: "50% 55%" },
          { legenda: "Initial symbol exploration", img: "assets/lynda/lynda-symbol-studies.jpg", proporcao: "8/5" },
          { legenda: "Sketches / construction studies", img: "assets/lynda/lynda-wordmark-sketches.jpg", proporcao: "3/2" }
        ]
      },
      {
        layout: "claro", numero: "04", nome: "Logo Development",
        titulo: "Integrating the sparkle into the wordmark.",
        textos: [
          "The sparkle became a natural part of the visual language from the beginning, reflecting the brand's connection to beauty, light, and glow. Rather than treating it as a standalone decorative icon, I wanted it to feel connected to the wordmark itself.",
          "The curved contour of the sparkle was developed to echo the rounded terminal of the lowercase “a” in Lynda. This shared shape creates a subtle visual relationship between the symbol and the lettering, allowing the sparkle to feel integrated into the name rather than simply placed beside it.",
          "The result is a wordmark where the idea of glow is present within the typography itself — giving the logo a recognizable detail while keeping the overall composition clean and refined."
        ],
        midias: [
          { legenda: "Logo construction — sketches", img: "assets/lynda/lynda-sketches.jpg", proporcao: "16/9", posicao: "50% 55%" },
          { legenda: "Detail: shared curve between the sparkle and the “a”", img: "assets/lynda/lynda-sparkle-a-closeup.jpg", posicao: "50% 45%" },
          { legenda: "Sparkle construction", img: "assets/lynda/lynda-sparkle-construction.jpg" },
          { legenda: "Symbol", img: "assets/lynda/lynda-symbol.jpg", proporcao: "1/1" },
          { legenda: "Black / white logo — negative", img: "assets/lynda/lynda-logo-white-on-black.jpg", proporcao: "1/1" },
          { legenda: "Black / white logo — positive", img: "assets/lynda/lynda-logo-black-on-white.jpg", proporcao: "1/1" },
          { legenda: "Logo variation — cream on olive", img: "assets/lynda/lynda-logo-cream-on-olive.jpg", proporcao: "3/2" },
          { legenda: "Logo variation — olive on cream", img: "assets/lynda/lynda-logo-olive-on-cream.jpg", proporcao: "3/2" }
        ]
      },
      {
        layout: "tipografia", numero: "05", nome: "Typography",
        titulo: "Editorial contrast.",
        textos: [
          "The typographic system pairs Sylvena, a display serif, with Raleway, a clean sans-serif.",
          "The serif establishes the brand's expressive and sophisticated character, while the sans-serif introduces contrast and provides a clear hierarchy for supporting information, taglines, and smaller applications."
        ],
        // Serif: Sylvena (Dung-My Nguyen), arquivo em assets/fonts/ · Sans-serif: Raleway (Google Fonts)
        fontes: [
          { papel: "Serif — Sylvena", familia: "'Sylvena', Georgia, serif", nomeFonte: "Sylvena", arquivo: "assets/fonts/Sylvena-Regular.woff2", exemplo: "Your glow, elevated." },
          { papel: "Sans-serif — Raleway", familia: "'Raleway', 'Helvetica Neue', Arial, sans-serif", googleFont: "Raleway:wght@400;500", exemplo: "BRAND IDENTITY FOR A BEAUTY & JEWELRY BRAND", caixaAlta: true }
        ],
        // alfabeto gigante em faixas que deslizam (pausa ao passar o mouse). Só letras e números: a Sylvena não tem &, ?, !, ( )
        alfabeto: {
          familia: "'Sylvena', Georgia, serif",
          linhas: ["ABCDEFGHIJKLM", "nopqrstuvwxyz", "NOPQRSTUVWXYZ abcdefghijklm 0123456789"]
        }
      },
      {
        layout: "paleta", numero: "06", nome: "Color Palette",
        titulo: "Depth, warmth, and light.",
        textos: [
          "Olive (#666748), Gold (#E6B23A), and Cream (#E5D8C5) form the core palette of the identity.",
          "The combination creates a balance between depth and warmth, connecting the visual language of beauty with the sophistication of jewelry."
        ],
        cores: [
          // HEX oficiais (extraídos das artes do logo). Troque os nomes se a marca usar outros
          { nome: "Olive", hex: "#666748", texto: "#E5D8C5" },
          { nome: "Gold", hex: "#E6B23A", texto: "#34362A" },
          { nome: "Cream", hex: "#E5D8C5", texto: "#34362A" }
        ],
        midias: [
          { legenda: "Palette applied to brand materials — packaging", img: "assets/lynda/lynda-packaging.jpg", proporcao: "4/3" },
          { legenda: "Palette applied to brand materials — gift bag", img: "assets/lynda/lynda-gift-bag.jpg", proporcao: "4/3", posicao: "45% 50%" }
        ]
      },
      {
        layout: "selo", numero: "07", nome: "Secondary Mark",
        titulo: "A compact expression of the brand.",
        textos: [
          "A circular seal was developed as a secondary element of the identity, combining the wordmark, tagline, and central sparkle into a compact composition.",
          "It provides an alternative format for applications where the full wordmark is less practical, such as packaging, seals, social media, and smaller brand touchpoints."
        ],
        midias: [
          { legenda: "Secondary seal", img: "assets/lynda/lynda-seal-olive.jpg" },
          { legenda: "Secondary seal — cream version", img: "assets/lynda/lynda-seal-cream.jpg" },
          { legenda: "Packaging application", img: "assets/lynda/lynda-box-seal.jpg", posicao: "48% 45%" },
          { legenda: "Social / avatar application", img: "assets/lynda/lynda-social-avatar.webp" }
        ]
      },
      {
        // fechamento: cream sobre olive -> versão principal com tagline -> foto de produto.
        // A seção trava na tela e cada gesto de rolagem dispara uma troca completa.
        layout: "fecho", tinta: "#666748", imagem: ""   // TROCAR: caminho da foto de produto (vazio = espaço reservado)
      }
    ]
  },
  {
    id: "wilker-fernandes",
    titulo: "Wilker Fernandes",
    categoria: "Branding",
    ano: "",
    resumo: "Brand Identity for a Photographer & Filmmaker",
    subtitulo: "Brand Identity for a Photographer & Filmmaker",
    // estilo "timeline": layout orgânico, sem caixas — a página inteira é uma linha do tempo que termina em REC
    estilo: "timeline",
    info: [
      { label: "Client", valor: "Wilker Fernandes" },
      { label: "Role", valor: "Brand & Visual Identity Designer" },
      { label: "Scope", valor: "Logo Design, Visual Identity, Logo Animation" },
      { label: "Tools", valor: "Adobe Photoshop, Adobe Illustrator" }
    ],
    ferramentas: ["Adobe Photoshop", "Adobe Illustrator"],
    imagem: "",
    gradiente: ["#0B0B0B", "#3A3A3A"],
    linkDemo: "",
    // destaque = cor do REC. O vermelho ainda não está definido na marca:
    // para testar sem ele, troque "#E0352B" por "#F2F1EE" (branco) ou "#0B0B0B" (preto)
    tema: { fundo: "#0B0B0B", texto: "#F2F1EE", destaque: "#E0352B" },
    // fontes do case: títulos em Fraunces (variável — o eixo SOFT é usado na cena "gravando o nome"),
    // textos em Work Sans. As duas vêm do Google Fonts.
    fontesCase: [
      { googleFont: "Fraunces:opsz,wght,SOFT,WONK@9..144,100..900,0..100,0..1" },
      { googleFont: "Work+Sans:wght@400;500" }
    ],
    capa: { legenda: "Main logo / application", proporcao: "21/9" },
    secoes: [
      {
        layout: "tl-intro", nome: "Overview",
        textos: [
          "Wilker Fernandes is a photographer and filmmaker. His identity is built around what his work produces: moments taken out of time — and kept."
        ]
      },
      {
        layout: "tl-statement", nome: "Concept",
        titulo: "A timeline, captured.",
        textos: [
          "The symbol represents a timeline of moments captured by Wilker. Each photograph and each video becomes a point along the same continuous line."
        ],
        midias: [
          { legenda: "Symbol — primary application", proporcao: "16/9" },
          { legenda: "Symbol detail", proporcao: "4/5" }
        ]
      },
      {
        layout: "tl-feature", nome: "The Symbol",
        titulo: "A W drawn like a moment in motion.",
        textos: [
          "The W was built organically, as a single flowing stroke that thickens and thins along its path. Rather than a rigid letterform, it reads as movement being recorded — a photo, a take, a frame."
        ],
        midias: [
          { legenda: "Symbol construction", proporcao: "4/5" },
          { legenda: "Stroke detail", proporcao: "3/2" }
        ]
      },
      {
        layout: "tl-rec", nome: "The REC Dot",
        titulo: "The end of the line is recording.",
        textos: [
          "The timeline ends in a small circle — the same dot that signals REC on a camera. It marks the present: the instant something stops being just seen and starts being kept."
        ]
      },
      {
        // cena animada: o nome passa sob a "agulha" de edição e vai sendo gravado letra a letra
        layout: "tl-scrub", nome: "Recording",
        texto: "Wilker Fernandes",
        legenda: "Photographer & Filmmaker"
      },
      {
        layout: "tl-type", nome: "Typography",
        titulo: "A calm base for an organic mark.",
        textos: [
          "The name is set in Fraunces — uppercase, with generous letter spacing — giving the fluid symbol a structured base. Work Sans carries the descriptor, Photographer & Filmmaker, as a spaced secondary line."
        ],
        fontes: [
          { papel: "Fraunces — name", familia: "'Fraunces', Georgia, serif", exemplo: "Wilker Fernandes" },
          { papel: "Work Sans — descriptor", familia: "'Work Sans', 'Helvetica Neue', Arial, sans-serif", exemplo: "Photographer & Filmmaker" }
        ]
      },
      {
        layout: "tl-palette", nome: "Color",
        titulo: "Black, white — and the red of REC.",
        textos: [
          "The palette is reduced to black and white, keeping the attention on the mark and on Wilker's images. Red appears only in one detail: the REC dot at the end of the timeline."
        ],
        // "tamanho" controla o círculo de cada cor. O vermelho ainda está em avaliação:
        // se ele não entrar na marca, apague a linha do REC Red e a última frase do texto acima.
        cores: [
          { nome: "Black", hex: "#000000", tamanho: "grande" },
          { nome: "White", hex: "#FFFFFF", tamanho: "grande" },
          { nome: "REC Red", hex: "#E0352B", tamanho: "pequeno" }
        ]
      },
      {
        layout: "tl-video", nome: "Motion",
        titulo: "The mark in motion.",
        textos: [
          "The logo was also animated, taking the idea of a recorded timeline from the page to the screen."
        ],
        // quando o vídeo estiver pronto: { legenda: "Logo animation", video: "assets/wilker/logo-animation.mp4" }
        midias: [ { legenda: "Logo animation", proporcao: "16/9" } ]
      },
      {
        layout: "tl-scatter", nome: "Applications",
        titulo: "Frames of the identity.",
        textos: [
          "The identity in use — across the pieces that carry Wilker's work."
        ],
        // aplicações: até 6 posições no grid. Troque "Application 01" etc. pelo nome da peça (ex: "Business cards")
        midias: [
          { legenda: "Application 01", proporcao: "4/3" },
          { legenda: "Application 02", proporcao: "3/4" },
          { legenda: "Application 03", proporcao: "1/1" },
          { legenda: "Application 04", proporcao: "16/10" },
          { legenda: "Application 05", proporcao: "21/9" },
          { legenda: "Application 06", proporcao: "4/5" }
        ]
      }
    ]
  },
  {
    id: "nomad",
    titulo: "NOMAD",
    categoria: "Branding",
    ano: "",   // TROCAR: ano do projeto
    resumo: "Brand Identity for Expedition Equipment",
    subtitulo: "Expedition Equipment & Outdoor Exploration",
    tagline: "Be ready for the unknown.",
    // estilo "expedicao": a página é um mapa topográfico; o visitante traça a própria rota com o cursor.
    // Coordenadas, códigos (NMD-...) e números do HUD são decorativos.
    estilo: "expedicao",
    info: [
      { label: "Client", valor: "NOMAD" },
      { label: "Role", valor: "Brand & Visual Identity Designer" },   // TROCAR se o seu papel foi outro
      { label: "Scope", valor: "Logo Design, Visual Identity, Expedition System" },
      { label: "Year", valor: "" }   // TROCAR
    ],
    imagem: "",
    gradiente: ["#1E2023", "#FF5B1F"],
    linkDemo: "",
    // TROCAR quando os tons oficiais forem definidos (laranja e cinza escuro da marca)
    tema: { fundo: "#1E2023", texto: "#E9E5DC", destaque: "#FF5B1F" },
    // fontes do case (do site, não da marca): Archivo, com eixo de largura (títulos "expandem" ao entrar)
    fontesCase: [ { googleFont: "Archivo:wdth,wght@62..125,300..900" } ],
    capa: { legenda: "Main identity / hero image", proporcao: "21/9" },
    secoes: [
      {
        layout: "ex-intro", nome: "Overview",
        textos: [
          "NOMAD creates equipment for those who venture beyond the familiar.",
          "Built around exploration, resilience, and adaptability, NOMAD develops reliable gear for challenging environments and unpredictable journeys — helping explorers move further, endure more, and stay prepared for whatever lies ahead."
        ]
      },
      {
        layout: "ex-statement", nome: "Concept",
        titulo: "The unknown is not a destination.",
        textos: [
          "It is everything that exists beyond the map, beyond the planned route, and beyond what we can predict.",
          "NOMAD was built around one idea: the journey does not need to be predictable when you are prepared for it. The identity translates movement, terrain, navigation, and resilience into a visual system as capable as the equipment itself."
        ],
        midias: [
          { legenda: "Concept — key visual", proporcao: "16/10" },
          { legenda: "Concept — detail", proporcao: "4/5" }
        ]
      },
      {
        layout: "ex-symbol", nome: "The Symbol",
        titulo: "There is always another path to take.",
        textos: [
          "The symbol is inspired by a route without a predetermined destination. A continuous path moves through the mark, changing direction and creating a sense of movement and discovery.",
          "Its construction references both natural terrain and expedition routes, while the geometric structure gives it the strength and precision expected from technical equipment."
        ],
        midias: [
          { legenda: "Symbol construction", proporcao: "1/1" },
          { legenda: "Symbol — route study", proporcao: "21/9" }
        ]
      },
      {
        layout: "ex-identity", nome: "Visual Identity",
        titulo: "Technical precision, raw exploration.",
        textos: [
          "Strong typography, structured layouts, geographic references, coordinates, route markings, and modular graphic elements create an identity that feels functional without losing its sense of adventure.",
          "Every element follows the same principles as the products themselves: clarity, durability, functionality, and adaptability — from a small equipment label to large-format expedition graphics."
        ],
        // TROCAR: nomes e HEX oficiais
        cores: [
          { nome: "Orange", hex: "#FF5B1F" },
          { nome: "Dark Grey", hex: "#1E2023" }
        ],
        midias: [
          { legenda: "Identity system", proporcao: "3/2" },
          { legenda: "Label system", proporcao: "3/4" }
        ]
      },
      {
        // sinalizador: o laranja se expande a partir de um ponto e toma a tela; "principios" vira a fita de marcação
        layout: "ex-flare", nome: "Built for the Unknown",
        pre: "NOMAD's identity is not designed simply to look adventurous.",
        titulo: "It is designed to communicate preparedness.",
        textos: [
          "The result is a brand that feels at home whether it is printed on a technical jacket, stamped onto a piece of equipment, applied to a field case, or standing alone against the landscape."
        ],
        principios: ["Clarity", "Durability", "Functionality", "Adaptability"]
      },
      {
        layout: "ex-system", nome: "Expedition System",
        titulo: "A system that grows with the range.",
        textos: [
          "The identity extends beyond the logo into a flexible system for identifying equipment, expeditions, and product lines.",
          "Product codes, coordinates, route information, technical specifications, and expedition markings become part of the brand's visual language."
        ],
        // TROCAR: exemplos ilustrativos do formato (não são códigos reais da marca)
        exemplos: [
          ["NMD—PK—042", "Pack / 42 L", "N 64°08' W 021°56'", "ALT 1,204 M"],
          ["NMD—JK—117", "Shell jacket", "N 61°12' W 149°54'", "ALT 2,310 M"],
          ["NMD—FC—008", "Field case", "S 50°56' W 073°24'", "ALT 0,845 M"]
        ],
        midias: [
          { legenda: "Product codes & markings", proporcao: "3/2" },
          { legenda: "Expedition labels", proporcao: "4/5" }
        ]
      },
      {
        layout: "ex-gear", nome: "Field Equipment",
        titulo: "Unmistakably NOMAD.",
        textos: [
          "From backpacks and technical apparel to field accessories and expedition gear, every piece carries the same visual principles — durable, precise, and recognizable.",
          "The symbol becomes the mark of equipment built to accompany explorers beyond the expected."
        ],
        midias: [
          { legenda: "Backpack", proporcao: "4/5" },
          { legenda: "Technical apparel", proporcao: "4/5" },
          { legenda: "Field accessories", proporcao: "1/1" },
          { legenda: "Expedition gear", proporcao: "1/1" }
        ]
      },
      {
        layout: "ex-field", nome: "In the Field",
        titulo: "Deeper into the world.",
        textos: [
          "Rock, forest, snow, water, dust, altitude, and distance become part of NOMAD's visual world.",
          "Photography focuses on the relationship between people, equipment, and landscape — presenting exploration not as an escape from the world, but as a way of moving deeper into it."
        ],
        midias: [
          { legenda: "In the field — landscape", proporcao: "21/9" },
          { legenda: "People & equipment", proporcao: "4/5" },
          { legenda: "Equipment detail", proporcao: "4/5" }
        ]
      },
      {
        // cena final: cada frase muda o painel (1 rota, 2 clima, 3 terreno, 4 destino; a última carimba a marca)
        layout: "ex-final",
        linhas: [
          "The next route may not be the one you planned.",
          "The conditions may change.",
          "The terrain may become harder.",
          "The destination may move further away.",
          "NOMAD is built for that."
        ],
        fecho: "Be ready for the unknown."
      }
    ]
  },
  {
    id: "vigil",
    titulo: "VIGIL",
    categoria: "Branding",
    ano: "",   // TROCAR: ano do projeto
    resumo: "Predictive infrastructure intelligence.",
    subtitulo: "Predictive infrastructure intelligence.",
    // estilo "vigilia": a página já sabe o que vem. O esqueleto de cada bloco aparece antes, em contorno,
    // e "confirma" ao chegar; divisórias em cone de confiança; cena final em canvas 2D ("The quiet before").
    // Em aberto (não assumir): se é cliente real e que tipo de infraestrutura. Por isso o case é abstrato.
    estilo: "vigilia",
    info: [
      { label: "Client", valor: "" },   // TROCAR
      { label: "Role", valor: "" },     // TROCAR
      { label: "Scope", valor: "" },    // TROCAR
      { label: "Year", valor: "" }      // TROCAR
    ],
    imagem: "",
    gradiente: ["#15191C", "#2F8F83"],
    linkDemo: "",
    // TROCAR: identidade provisória (papel, tinta e um único acento frio, que só aparece quando algo é detectado)
    tema: { fundo: "#F3F1EA", texto: "#15191C", destaque: "#2F8F83" },
    fontesCase: [ { googleFont: "Hanken+Grotesk:wght@300;400;500" } ],
    secoes: [
      {
        layout: "vg-intro", nome: "Overview",
        // TROCAR: rascunho. A 1ª frase vem da descrição do projeto; a 2ª, do conceito ("vigilância calma").
        textos: [
          "VIGIL is software that predicts infrastructure failures before they happen.",
          "Its identity is built around a single idea: calm vigilance."
        ]
      },
      {
        layout: "vg-statement", nome: "Concept",
        titulo: "Keep watch.",
        // TROCAR: rascunho a partir da intenção "vigiar para que os outros possam descansar"
        textos: [
          "VIGIL keeps watch so that others can rest.",
          "Its vigilance is calm: anticipation instead of alarm."
        ],
        midias: [ { legenda: "Concept — key visual", proporcao: "21/9" } ]
      },
      {
        layout: "vg-name", nome: "The Name",
        titulo: "Awake, so no one is caught off guard.",
        // TROCAR: rascunho a partir da intenção "ficar acordado para que a falha não pegue ninguém de surpresa"
        definicao: { palavra: "vigil", classe: "noun", texto: "a period of staying awake while others sleep, to keep watch." },
        textos: [
          "VIGIL stays awake so that a failure never takes anyone by surprise."
        ]
      },
      {
        // o símbolo é decisão do design, não da página: só espaços reservados
        layout: "vg-symbol", nome: "The Symbol",
        titulo: "",   // TROCAR: título da seção (opcional)
        textos: [],   // TROCAR: texto sobre o símbolo
        midias: [
          { legenda: "Symbol — primary mark", proporcao: "1/1" },
          { legenda: "Symbol — construction", proporcao: "1/1" },
          { legenda: "Symbol — small sizes", proporcao: "1/1" }
        ]
      },
      {
        layout: "vg-identity", nome: "Visual Identity",
        titulo: "Light, open, and quiet.",
        // TROCAR: rascunho a partir da identidade provisória
        textos: [
          "A light, open palette of paper, ink and intermediate greys, with a single cold accent that only appears when something is detected.",
          "The cone of confidence — narrow and sharp in the past, wide and faint in the future — is part of the identity, not just decoration."
        ],
        // TROCAR: nomes, HEX e proporções de uso (as proporções são ilustrativas)
        cores: [
          { nome: "Paper", hex: "#F3F1EA", uso: 58 },
          { nome: "Mist", hex: "#D9D7CF", uso: 16 },
          { nome: "Grey", hex: "#8B9095", uso: 12 },
          { nome: "Ink", hex: "#15191C", uso: 12 },
          { nome: "Signal", hex: "#2F8F83", uso: 2 }
        ],
        fontes: [
          { papel: "Headlines", familia: "'Hanken Grotesk', sans-serif", nome: "Hanken Grotesk Light", exemplo: "Keep watch." },
          // exemplo ilustrativo de dado (não é leitura real)
          { papel: "Data", familia: "'IBM Plex Mono', monospace", nome: "IBM Plex Mono", exemplo: "S-04 · 0.982 · NOMINAL", mono: true }
        ]
      },
      {
        layout: "vg-applications", nome: "Applications",
        titulo: "Screens, reports, stationery.",   // TROCAR: depende do tipo de infraestrutura
        textos: [],   // TROCAR
        midias: [
          { legenda: "Screens — monitoring", proporcao: "16/10" },
          { legenda: "Reports", proporcao: "4/5" },
          { legenda: "Stationery", proporcao: "4/5" }
        ]
      },
      {
        // cena final: linhas de sensores (ilustrativas), um desvio previsto aos ~60% e a volta à calma
        layout: "vg-final", nome: "The quiet before",
        aviso: "A small drift. Seen early.",              // TROCAR: rascunho da frase calma
        fecho: "Nothing happened. That's the point."      // TROCAR: rascunho
      }
    ]
  },
  {
    id: "project-two",
    publicado: false,   // exemplo/modelo: mude para true (ou apague a linha) para aparecer no site
    titulo: "Client Name 2",
    categoria: "Web",
    ano: "",
    resumo: "A short line about what this website solved for the client.",
    descricao:
      "A longer description of the project: context, design decisions and the technologies used.",
    ferramentas: ["Figma", "HTML/CSS/JS"],
    imagem: "",
    galeria: [],
    gradiente: ["#538FD9", "#72EFDD"],
    linkDemo: ""
  },
  {
    id: "project-three",
    publicado: false,   // exemplo/modelo: mude para true (ou apague a linha) para aparecer no site
    titulo: "Client Name 3",
    categoria: "Motion",
    ano: "",
    resumo: "A short line about the video or animation delivered.",
    descricao:
      "A longer description of the project: brief, script or concept, and the tools used for the animation.",
    ferramentas: ["After Effects", "Premiere"],
    imagem: "",
    galeria: [],
    gradiente: ["#6A30C3", "#49BFE3"],
    linkDemo: ""
  }
];

// Só os projetos publicados aparecem no site (home, Work, "próximo projeto")
const PROJECTS = TODOS_PROJETOS.filter((p) => p.publicado !== false);

// ---------------------------------------------------------------------------
// VETORES — logos vetorizados a partir dos arquivos do projeto (gerado automaticamente, não editar).
// Coordenadas do arquivo original do logo (1080x1080). "curvaA" e "curvaE" = pontos [x, y, x, y...] do contorno
// real do ombro do "a" e da curva da estrela voltada para ele (usados na animação de abertura).
// ---------------------------------------------------------------------------
const VETORES = {
  lynda: {"curvaA": [718.66, 496.0, 719.73, 495.43, 720.74, 494.83, 721.75, 494.15, 722.79, 493.44, 723.81, 492.76, 724.78, 492.05, 725.73, 491.29, 726.72, 490.5, 727.7, 489.71, 728.69, 488.92, 729.8, 488.03, 731.05, 487.4, 732.17, 486.79, 733.46, 486.22, 734.77, 485.81, 736.12, 485.42, 737.51, 485.25, 738.84, 485.1, 740.19, 485.09, 741.51, 485.08, 742.85, 485.18, 744.14, 485.3, 745.61, 485.47, 746.92, 485.97, 748.06, 486.3, 749.41, 486.69, 750.67, 487.35, 751.78, 487.93, 753.0, 488.58, 754.15, 489.39, 755.19, 490.22, 756.24, 491.14, 757.16, 492.14, 758.05, 493.16, 758.88, 494.3, 759.57, 495.48, 760.19, 496.61, 760.83, 497.81, 761.35, 499.15, 761.67, 500.33, 762.21, 501.54, 762.48, 503.0, 762.66, 504.28], "curvaE": [749.11, 461.46, 750.44, 461.56, 751.7, 461.65, 752.9, 461.84, 754.14, 462.13, 755.38, 462.42, 756.55, 462.79, 757.88, 463.28, 759.08, 463.51, 760.19, 464.13, 761.51, 464.53, 762.62, 465.04, 763.77, 465.56, 764.86, 466.19, 766.01, 466.86, 767.17, 467.53, 768.26, 468.17, 769.28, 468.87, 770.31, 469.66, 771.39, 470.48, 772.4, 471.24, 773.36, 472.08, 774.32, 472.94, 775.23, 473.83, 776.12, 474.75, 776.97, 475.71, 777.82, 476.71, 778.67, 477.72, 779.47, 478.71, 780.21, 479.75, 780.94, 480.76, 781.54, 481.86, 782.23, 483.05, 782.92, 484.15, 783.48, 485.21, 783.96, 486.37, 784.47, 487.62, 784.99, 488.85, 785.5, 490.07, 785.98, 491.21, 786.29, 492.36, 786.58, 493.68, 786.98, 494.96, 787.25, 496.19], "letras": "M359.7 595.4 L360.5 593.0 L361.0 590.2 L361.6 588.5 L362.0 585.9 L362.7 583.5 L364.0 577.0 L364.7 574.7 L365.1 572.2 L365.7 570.7 L366.1 568.0 L366.6 566.7 L366.5 565.9 L364.7 565.3 L361.5 565.3 L359.7 565.9 L359.2 566.2 L358.7 568.5 L358.0 569.7 L357.7 570.9 L357.0 572.2 L356.5 573.7 L355.7 575.5 L355.0 576.4 L354.7 577.2 L352.5 580.5 L350.7 582.6 L348.5 584.6 L344.5 587.0 L343.7 587.7 L341.7 588.7 L339.0 589.7 L336.0 590.4 L302.7 590.3 L301.7 590.4 L301.2 590.2 L301.0 590.0 L300.8 589.0 L301.0 462.2 L301.6 460.7 L302.0 459.2 L303.1 457.7 L305.0 456.0 L306.7 455.0 L308.2 454.6 L309.5 454.0 L313.2 453.4 L314.7 452.7 L314.9 452.2 L314.8 451.7 L314.2 449.9 L313.7 449.4 L313.0 449.3 L270.5 449.3 L267.5 449.3 L266.7 449.6 L266.3 450.2 L266.0 451.5 L266.0 452.2 L266.3 453.0 L267.2 453.6 L270.7 454.0 L274.0 455.0 L275.7 456.0 L277.5 457.7 L278.6 459.2 L279.6 463.2 L279.7 580.5 L279.5 581.7 L278.7 585.0 L276.7 587.7 L275.7 588.6 L274.2 589.6 L272.0 590.5 L269.0 591.1 L266.1 592.0 L265.7 593.0 L265.8 595.2 L266.2 595.6 L266.7 595.7 L359.0 595.7ZM399.0 640.9 L401.7 640.6 L405.0 639.7 L407.6 638.7 L408.5 638.1 L409.7 637.6 L413.6 634.7 L418.6 629.5 L420.7 626.5 L422.6 623.5 L423.0 622.2 L423.7 621.5 L425.1 618.5 L425.7 617.5 L426.0 616.5 L427.7 613.0 L428.0 611.7 L428.7 610.5 L429.0 609.1 L429.6 608.0 L430.0 606.2 L430.7 604.7 L431.1 603.0 L431.7 601.7 L431.9 600.0 L432.6 598.5 L433.0 596.2 L433.7 594.7 L434.0 592.7 L434.6 590.7 L435.0 588.5 L435.5 587.0 L436.0 584.1 L436.7 581.5 L437.1 578.2 L437.8 575.7 L437.9 574.0 L438.8 570.0 L439.0 567.5 L439.7 563.9 L440.1 560.2 L440.7 557.7 L441.0 554.2 L441.7 551.2 L441.9 548.0 L442.5 545.5 L442.8 542.2 L443.6 538.5 L444.0 534.2 L444.7 531.0 L445.0 527.5 L445.8 523.7 L446.2 520.0 L446.7 518.2 L447.0 514.5 L447.5 512.7 L447.9 509.0 L448.7 505.7 L449.0 503.2 L449.9 499.5 L451.2 497.3 L453.0 495.9 L455.2 495.0 L458.5 494.7 L461.5 493.7 L461.7 493.2 L461.3 491.5 L461.0 491.0 L460.5 490.7 L433.7 490.6 L428.2 490.8 L427.7 491.0 L427.3 491.5 L427.6 493.5 L428.2 494.2 L428.7 494.5 L429.7 494.7 L435.7 494.6 L438.5 494.9 L440.5 496.0 L441.7 497.2 L442.5 499.0 L442.6 501.2 L442.1 503.2 L441.6 507.2 L441.1 509.2 L439.6 519.5 L439.0 522.2 L438.4 527.2 L438.0 528.5 L436.6 538.5 L436.0 541.2 L435.6 544.5 L435.0 547.0 L434.7 550.2 L434.0 553.5 L433.5 557.5 L433.0 559.2 L432.5 563.5 L431.5 569.2 L431.0 570.6 L430.7 572.0 L429.6 575.2 L427.6 579.5 L425.6 582.7 L423.6 585.5 L421.5 587.6 L420.2 588.6 L418.2 589.6 L416.5 589.8 L415.2 589.7 L413.2 588.6 L410.1 585.5 L408.0 582.5 L406.0 578.7 L405.0 576.7 L403.0 571.0 L402.6 569.0 L402.0 566.9 L401.5 564.0 L400.9 561.7 L400.8 560.0 L400.0 556.5 L399.7 553.7 L399.0 550.0 L398.7 546.5 L398.2 544.9 L397.7 540.7 L397.0 536.9 L396.6 533.2 L396.1 531.7 L395.7 527.5 L394.9 523.7 L394.5 520.0 L394.0 518.5 L393.7 514.5 L392.9 510.7 L392.8 509.0 L392.0 504.9 L391.6 501.7 L392.0 498.7 L393.1 497.0 L394.2 495.9 L396.3 495.0 L400.5 494.6 L401.7 494.3 L404.5 494.7 L409.5 494.6 L410.5 494.1 L411.0 493.5 L411.4 492.2 L411.1 491.2 L410.7 490.8 L410.2 490.6 L359.7 490.6 L358.5 490.9 L358.1 491.5 L357.8 493.2 L358.2 493.9 L360.2 494.7 L364.0 495.0 L367.0 496.1 L368.4 497.2 L369.5 498.5 L370.5 500.5 L371.7 506.7 L372.2 510.7 L372.7 512.5 L372.9 515.0 L373.7 518.7 L374.3 523.2 L374.7 524.7 L375.1 528.5 L375.7 530.7 L376.3 535.0 L376.7 536.5 L376.9 539.0 L377.7 543.0 L378.2 546.7 L378.7 548.7 L379.2 552.5 L379.7 554.5 L380.2 559.0 L380.7 560.5 L380.9 562.7 L381.8 567.0 L382.0 569.0 L382.6 571.0 L383.0 573.2 L383.6 574.7 L384.0 576.7 L384.6 578.2 L385.0 580.2 L385.6 581.2 L386.0 582.7 L386.5 583.5 L387.0 585.0 L389.0 589.0 L390.7 591.5 L391.0 592.2 L393.0 594.6 L395.0 596.7 L397.5 598.7 L399.2 599.7 L401.5 600.6 L405.0 601.5 L406.0 601.6 L409.7 601.6 L414.0 600.7 L417.0 599.7 L418.0 599.0 L419.2 598.6 L420.0 598.0 L421.2 597.6 L422.0 597.0 L424.5 595.5 L426.2 594.1 L427.0 593.8 L427.2 594.0 L426.7 596.7 L426.0 599.0 L425.6 600.7 L425.0 602.0 L424.7 603.5 L424.1 604.7 L422.7 609.0 L422.0 610.2 L421.7 611.2 L421.0 612.5 L420.7 613.5 L420.1 614.5 L418.6 617.7 L418.0 618.5 L417.7 619.5 L417.0 620.2 L416.6 621.2 L414.6 624.5 L411.6 628.5 L408.5 631.6 L405.7 633.6 L403.7 634.7 L401.2 635.4 L399.5 635.5 L395.5 634.6 L394.7 634.0 L393.7 633.6 L392.2 632.7 L389.2 630.6 L381.5 624.0 L380.2 623.0 L379.2 622.5 L377.5 621.1 L373.5 619.0 L370.8 618.0 L366.0 617.3 L362.7 617.7 L362.0 618.2 L362.0 633.1 L362.2 633.7 L363.2 635.1 L363.7 635.3 L364.2 635.2 L365.5 634.6 L366.1 634.0 L367.7 633.0 L369.5 632.5 L372.0 632.4 L374.2 633.0 L381.7 637.6 L386.7 639.7 L391.2 640.8 L394.0 641.0ZM480.7 595.6 L514.0 595.7 L514.7 595.4 L515.3 594.5 L515.4 594.0 L514.9 592.5 L514.5 591.9 L511.2 591.8 L509.2 591.5 L506.2 590.7 L504.2 589.7 L503.0 588.6 L502.1 587.5 L501.4 585.2 L501.4 549.7 L501.0 546.5 L501.0 514.2 L500.7 510.7 L501.0 510.1 L502.5 509.0 L503.5 508.6 L504.2 508.0 L505.2 507.6 L506.0 507.0 L507.0 506.6 L507.7 506.1 L509.0 505.6 L509.7 505.1 L511.0 504.6 L511.9 504.0 L513.0 503.6 L513.9 503.0 L515.0 502.7 L516.0 502.0 L517.7 501.5 L518.9 501.0 L522.0 500.1 L523.2 500.0 L525.5 500.1 L528.7 501.0 L530.7 502.0 L532.3 503.2 L533.5 504.5 L534.7 506.2 L536.7 510.0 L537.6 513.0 L538.0 516.5 L538.4 517.7 L538.3 583.5 L537.7 586.5 L536.5 588.4 L535.2 589.6 L533.5 590.7 L531.5 591.5 L529.5 591.8 L526.2 591.8 L524.2 592.0 L523.8 592.5 L523.7 593.5 L523.8 595.2 L524.2 595.6 L524.7 595.7 L568.0 595.7 L569.0 595.5 L569.7 594.9 L570.1 593.7 L569.8 593.0 L568.5 592.0 L564.0 590.7 L562.2 589.7 L560.0 587.5 L559.2 585.5 L558.8 583.0 L558.6 508.2 L557.7 502.8 L557.1 501.5 L556.7 499.9 L555.6 497.7 L554.7 496.2 L553.2 494.5 L552.5 493.3 L548.5 490.1 L545.7 488.9 L543.5 488.4 L540.5 488.0 L539.2 488.3 L534.2 489.0 L532.5 489.6 L530.5 490.0 L529.0 490.7 L527.5 491.1 L526.5 491.7 L523.0 493.0 L522.0 493.7 L520.7 494.1 L518.0 495.6 L516.7 496.0 L515.7 496.7 L514.7 497.0 L513.8 497.7 L513.0 498.0 L512.2 498.6 L511.2 499.0 L510.5 499.6 L509.2 500.1 L506.7 501.6 L503.7 503.0 L502.5 503.7 L501.5 504.0 L501.0 503.9 L500.7 503.5 L501.0 499.2 L501.3 497.7 L501.4 495.7 L501.0 494.2 L500.7 492.2 L500.0 491.0 L498.5 490.4 L496.7 490.4 L495.2 490.8 L492.5 493.5 L491.0 494.6 L489.0 495.7 L486.0 496.6 L482.5 496.8 L479.2 496.6 L477.2 496.0 L474.7 495.7 L473.2 495.1 L470.5 494.4 L470.0 494.6 L469.4 495.2 L469.2 496.0 L469.6 497.2 L470.1 498.2 L470.7 498.7 L477.7 500.6 L480.0 501.0 L480.5 501.2 L480.8 502.0 L480.8 581.7 L480.6 583.7 L479.7 586.2 L478.6 587.7 L476.7 589.5 L475.0 590.7 L472.0 591.7 L470.1 592.0 L469.7 592.5 L469.3 594.0 L469.6 595.2 L470.2 595.8 L479.2 595.8ZM611.2 598.7 L617.7 597.7 L619.7 597.0 L621.5 596.7 L622.7 596.1 L624.7 595.5 L628.7 593.7 L629.7 593.0 L630.7 592.6 L635.0 590.1 L636.2 589.6 L637.0 589.1 L638.2 588.6 L639.0 588.0 L640.2 587.6 L641.2 587.0 L642.7 586.5 L644.0 585.8 L644.6 586.0 L644.9 586.5 L645.0 594.7 L645.2 595.3 L645.7 595.6 L675.0 595.7 L675.5 595.6 L675.7 595.2 L675.9 592.7 L675.7 592.1 L675.2 591.8 L674.0 591.8 L672.1 591.5 L670.2 590.7 L668.3 589.5 L667.2 588.4 L666.1 586.7 L665.0 584.2 L664.8 583.2 L664.6 580.5 L664.7 492.2 L664.3 489.5 L664.4 438.7 L664.3 438.2 L663.7 437.9 L662.0 437.8 L660.7 438.1 L659.0 439.1 L656.0 441.6 L654.5 442.6 L651.5 443.8 L649.5 444.0 L648.0 444.4 L645.5 444.3 L640.5 443.5 L639.0 442.9 L637.2 442.7 L636.2 442.1 L635.5 442.0 L634.5 442.2 L634.1 443.0 L633.8 444.2 L633.9 445.2 L635.5 446.6 L643.5 448.4 L644.7 448.9 L645.0 449.5 L645.1 492.0 L644.9 492.5 L644.5 492.7 L644.0 492.7 L643.2 492.1 L642.0 491.6 L641.0 491.0 L634.7 489.0 L632.7 488.7 L629.5 488.0 L623.5 487.8 L620.5 488.0 L619.2 488.4 L615.2 489.0 L609.6 491.0 L605.5 493.0 L602.2 495.0 L596.2 500.0 L591.0 506.2 L588.1 510.7 L585.0 516.2 L583.7 519.7 L583.0 520.7 L582.0 523.6 L581.7 525.0 L581.0 526.6 L579.9 530.0 L579.6 531.7 L578.9 533.7 L578.5 536.7 L577.9 538.7 L577.7 541.7 L577.0 546.0 L576.8 549.7 L576.8 557.0 L577.0 560.5 L578.0 567.5 L578.7 570.0 L579.1 572.2 L579.7 573.6 L580.1 575.2 L582.0 580.0 L582.6 581.0 L583.1 582.2 L585.0 585.5 L587.2 588.3 L590.3 591.5 L592.5 593.1 L593.0 593.6 L594.5 594.6 L595.5 595.0 L596.4 595.7 L597.7 596.0 L598.9 596.7 L602.2 597.7 L606.0 598.3 L607.2 598.3 L608.7 598.7ZM624.7 587.0 L618.2 586.8 L614.0 585.6 L613.2 585.1 L612.0 584.6 L609.0 582.6 L607.2 581.1 L605.1 578.7 L603.0 575.5 L602.1 573.7 L600.0 567.8 L599.7 566.0 L598.9 563.0 L598.0 556.5 L597.8 553.0 L598.0 532.7 L598.3 531.0 L598.3 529.5 L598.6 528.2 L598.9 524.2 L600.0 517.7 L600.7 515.5 L601.0 513.8 L601.6 512.5 L602.0 510.8 L602.6 509.5 L602.9 508.2 L603.7 507.0 L605.0 504.2 L606.9 501.2 L608.8 499.0 L611.7 496.1 L615.1 494.0 L618.0 492.9 L620.5 492.6 L621.7 492.2 L627.0 492.9 L630.0 494.0 L633.7 496.0 L636.4 498.2 L637.5 499.2 L639.7 502.2 L641.5 505.5 L642.0 507.0 L642.7 508.2 L643.0 509.7 L643.7 511.0 L644.1 513.0 L644.8 515.0 L645.0 520.5 L645.0 579.2 L644.7 579.7 L641.5 581.6 L636.2 584.0 L635.5 584.6 L633.2 585.5 L630.2 586.1 L628.5 586.7Z", "a": "M707.7 597.0 L711.0 596.6 L712.7 596.0 L714.5 595.7 L715.7 595.0 L720.0 593.7 L721.2 593.0 L722.5 592.6 L723.5 592.0 L724.7 591.6 L725.5 591.1 L726.7 590.7 L727.7 590.1 L729.0 589.6 L731.9 588.0 L733.0 587.6 L735.5 586.0 L736.5 585.6 L739.7 583.2 L740.7 583.0 L741.5 583.3 L742.0 584.5 L742.0 594.5 L742.2 595.2 L742.5 595.5 L744.0 595.7 L771.0 595.7 L771.9 595.5 L772.6 594.5 L772.6 593.2 L772.0 592.3 L768.0 590.6 L767.2 590.0 L766.2 589.7 L764.7 588.6 L763.1 587.2 L762.1 585.5 L761.9 584.7 L761.8 559.7 L761.6 556.7 L761.7 528.7 L761.3 525.0 L761.4 507.0 L760.7 502.1 L760.1 500.7 L759.6 499.0 L757.7 495.4 L756.6 494.0 L754.8 492.0 L752.5 490.1 L748.5 488.0 L747.0 487.7 L745.1 487.0 L741.7 486.6 L739.0 486.6 L736.3 487.0 L733.2 487.9 L732.2 488.6 L731.0 489.1 L725.2 493.7 L720.7 496.7 L719.9 497.0 L719.0 497.7 L718.0 498.0 L717.2 498.6 L716.0 499.0 L715.0 499.7 L713.5 500.1 L712.3 500.7 L710.8 501.0 L708.5 501.7 L703.7 502.0 L700.2 501.6 L699.0 501.1 L697.5 500.7 L695.7 499.7 L694.2 498.7 L692.5 497.0 L691.0 496.1 L688.7 495.9 L688.2 496.0 L688.0 496.4 L688.0 508.5 L688.6 509.5 L690.5 510.6 L693.7 511.8 L698.0 512.0 L701.5 511.5 L703.7 510.6 L704.7 510.0 L707.7 508.6 L708.5 508.1 L709.7 507.6 L710.7 507.0 L711.7 506.6 L714.2 505.1 L715.5 504.6 L716.2 504.1 L717.5 503.6 L718.2 503.1 L719.5 502.6 L720.2 502.1 L724.7 500.0 L726.2 499.6 L727.2 499.2 L729.2 498.8 L732.7 499.0 L735.0 500.0 L736.5 501.0 L737.6 502.0 L738.7 503.4 L739.6 505.0 L740.7 508.0 L741.2 511.5 L741.3 513.2 L741.7 514.7 L741.7 516.2 L741.3 517.5 L741.3 518.7 L740.7 522.0 L739.7 524.7 L738.5 527.0 L736.5 529.7 L734.6 531.7 L732.0 533.7 L725.0 537.7 L724.0 538.1 L723.2 538.6 L718.7 541.0 L716.2 542.6 L715.2 543.0 L711.0 545.6 L710.0 546.0 L706.0 548.6 L705.1 549.0 L704.5 549.6 L702.2 551.0 L698.2 554.0 L695.5 556.7 L694.6 557.2 L691.0 561.2 L689.0 564.2 L687.0 568.2 L686.0 571.5 L685.6 574.2 L685.7 579.0 L685.9 581.7 L687.1 585.7 L687.6 586.5 L688.1 587.7 L690.0 590.5 L693.2 593.5 L697.2 595.7 L698.5 596.0 L699.7 596.5 L702.7 597.0ZM725.7 584.6 L720.5 584.8 L718.2 584.6 L716.5 584.0 L715.0 583.7 L713.0 582.7 L712.5 582.1 L711.3 581.5 L710.2 580.7 L708.0 578.5 L706.0 575.0 L704.9 572.0 L704.8 568.2 L705.1 566.2 L705.7 565.0 L706.0 563.7 L708.0 559.7 L711.2 555.3 L717.2 549.0 L722.0 545.1 L727.2 541.1 L735.0 536.0 L737.5 534.7 L739.7 533.2 L741.5 532.3 L741.9 532.7 L742.0 533.5 L742.0 576.0 L741.9 577.0 L741.5 577.6 L739.2 579.0 L738.2 579.7 L732.5 582.6 L731.0 583.0 L729.5 583.7 L727.7 584.0Z", "estrela": "M789.5 500.3 L790.3 499.0 L790.9 495.0 L792.0 491.0 L792.7 489.5 L793.0 488.0 L793.6 487.0 L795.0 483.9 L797.1 480.2 L800.0 476.2 L805.1 471.0 L807.2 469.1 L810.2 467.0 L812.5 465.7 L813.4 465.0 L814.5 464.6 L815.2 464.1 L817.5 463.0 L818.7 462.6 L820.0 462.0 L821.5 461.7 L823.0 461.0 L827.2 460.1 L830.2 459.8 L832.1 459.5 L832.0 459.2 L831.0 459.0 L823.7 457.7 L821.8 457.0 L820.2 456.6 L819.0 456.0 L817.5 455.6 L814.7 454.0 L813.5 453.6 L812.7 453.0 L810.4 451.7 L806.2 448.6 L804.0 446.6 L800.0 442.3 L798.6 440.2 L797.1 438.5 L796.6 437.2 L796.0 436.5 L795.5 435.5 L795.0 434.7 L792.0 427.7 L791.7 426.0 L791.0 424.2 L790.6 421.0 L790.0 419.0 L789.7 418.5 L789.5 418.4 L789.0 420.2 L788.6 423.7 L787.7 427.0 L787.1 428.5 L786.7 430.0 L786.0 431.2 L785.7 432.5 L785.1 433.5 L784.6 434.7 L782.6 438.2 L779.5 442.4 L774.5 447.6 L769.2 451.7 L768.2 452.1 L766.0 453.6 L765.0 454.0 L764.2 454.6 L762.7 455.1 L761.7 455.7 L755.7 457.7 L751.5 458.6 L747.9 459.0 L747.4 459.2 L747.4 459.5 L748.2 459.7 L752.5 460.1 L756.5 461.0 L758.0 461.6 L759.6 462.0 L760.7 462.6 L762.0 463.0 L764.5 464.1 L769.5 467.0 L773.5 470.0 L775.6 472.0 L777.6 474.0 L780.5 477.5 L782.7 480.5 L783.0 481.2 L784.7 484.0 L787.7 491.2 L788.0 492.8 L788.7 495.2 L789.1 498.5Z", "tagline": "M456.8 637.8 L456.7 632.5 L457.0 631.0 L460.7 624.8 L462.2 621.8 L462.7 621.2 L463.2 620.2 L463.7 619.8 L463.8 619.5 L463.8 619.1 L463.2 618.8 L461.5 618.8 L461.0 619.0 L460.2 619.5 L456.7 626.0 L456.0 627.0 L455.8 627.8 L455.5 628.2 L455.2 628.2 L454.8 628.0 L454.2 627.3 L453.6 626.0 L453.0 625.3 L452.7 624.2 L452.1 623.5 L451.2 622.0 L449.8 619.2 L449.5 618.9 L449.0 618.8 L446.6 619.0 L446.4 619.2 L446.5 619.8 L448.1 622.5 L448.8 623.2 L449.1 624.2 L449.7 625.0 L450.2 626.0 L450.7 626.8 L452.2 629.5 L452.8 630.2 L453.4 631.5 L453.5 633.0 L453.5 638.2 L453.8 638.6 L454.2 638.8 L455.8 638.9 L456.5 638.5ZM475.5 638.8 L478.5 637.7 L480.1 636.5 L481.6 634.8 L482.7 632.8 L483.4 629.5 L483.2 627.2 L482.8 625.2 L481.6 623.0 L479.8 621.0 L478.5 620.0 L475.5 618.9 L472.2 618.9 L471.2 619.4 L469.5 620.0 L468.1 621.0 L466.0 623.2 L465.2 624.5 L464.4 627.5 L464.4 630.2 L465.0 632.8 L466.2 634.8 L468.0 636.8 L470.2 638.1 L472.8 638.9ZM473.8 636.5 L471.2 635.7 L470.0 634.8 L469.0 633.7 L468.0 631.9 L467.5 628.8 L468.0 625.9 L469.1 624.0 L470.0 623.0 L471.2 622.0 L472.5 621.8 L474.0 621.1 L475.1 621.8 L476.8 622.2 L478.7 624.0 L479.8 626.0 L480.2 629.0 L479.8 631.8 L478.8 633.7 L477.8 634.8 L476.5 635.7 L474.2 636.5ZM499.0 638.1 L500.0 637.8 L501.6 636.5 L502.8 634.8 L503.6 632.5 L503.8 631.5 L503.9 629.5 L503.9 619.2 L503.7 619.0 L503.2 618.8 L501.5 618.9 L501.2 619.0 L500.9 619.5 L500.8 629.8 L500.6 632.0 L499.8 634.0 L498.2 635.5 L495.5 636.5 L492.8 635.6 L491.0 633.8 L490.2 632.0 L490.0 631.0 L490.0 619.5 L489.8 619.1 L489.2 618.9 L487.2 618.9 L486.9 619.2 L486.8 619.8 L486.9 630.2 L487.1 632.2 L488.0 634.8 L489.0 636.2 L490.4 637.5 L491.0 637.9 L492.2 638.2 L493.1 638.8 L497.5 638.8ZM524.0 638.2 L523.0 637.1 L522.7 636.2 L521.2 634.0 L520.6 632.8 L520.0 632.0 L519.9 631.5 L520.1 631.0 L521.1 630.5 L522.5 629.0 L522.8 628.2 L523.3 626.5 L523.3 624.5 L522.9 622.8 L521.8 621.0 L520.5 619.8 L518.5 618.8 L509.5 618.8 L509.0 619.0 L508.7 619.5 L508.7 620.0 L508.7 637.0 L508.6 638.0 L508.8 638.5 L509.2 638.8 L509.8 638.9 L511.2 638.8 L511.7 638.5 L511.8 632.5 L512.1 632.0 L512.8 631.8 L515.8 631.9 L516.5 632.1 L517.7 633.8 L518.1 634.8 L520.1 638.0 L520.8 638.6 L521.5 638.9 L523.5 638.9 L523.8 638.8ZM516.8 629.6 L515.0 629.4 L512.8 629.5 L512.2 629.4 L512.0 629.0 L511.8 627.8 L511.8 622.8 L512.0 621.8 L512.5 621.3 L514.2 621.2 L515.5 621.4 L516.8 621.2 L517.2 621.2 L518.8 622.1 L519.8 623.4 L520.2 624.8 L520.2 625.5 L519.7 627.8 L518.7 628.8 L517.5 629.3ZM551.8 638.3 L551.6 630.8 L551.8 629.8 L551.6 629.2 L551.3 629.0 L550.5 628.9 L545.8 628.9 L545.2 629.0 L544.9 629.5 L544.8 630.2 L545.2 631.2 L545.8 631.4 L548.0 631.2 L548.5 631.4 L548.8 631.8 L549.1 633.2 L548.8 633.8 L547.8 634.8 L546.2 635.7 L545.0 636.0 L543.8 636.5 L542.8 636.4 L540.8 635.6 L539.3 634.5 L538.1 633.0 L537.1 630.2 L537.2 627.2 L537.9 625.0 L539.2 623.1 L540.5 622.2 L543.0 621.3 L543.8 621.4 L545.8 622.0 L547.5 623.2 L548.2 624.2 L549.0 624.5 L550.5 623.6 L550.8 623.2 L550.7 622.5 L549.8 621.2 L548.1 620.0 L546.5 619.5 L545.5 618.9 L544.8 618.9 L541.2 619.0 L540.0 619.7 L538.8 620.0 L538.0 620.7 L537.2 621.0 L536.0 622.3 L535.5 623.4 L535.0 624.0 L534.1 626.2 L533.9 628.8 L534.1 631.5 L534.6 632.5 L535.0 633.7 L537.1 636.5 L538.0 637.0 L538.9 637.8 L540.0 638.1 L541.0 638.7 L541.8 638.9 L544.5 638.8 L546.0 638.5 L547.2 637.9 L548.0 637.1 L548.5 637.0 L549.0 637.2 L549.0 638.5 L549.5 638.9 L551.4 638.8ZM569.4 638.2 L569.2 636.3 L568.5 635.9 L559.8 635.9 L559.2 635.8 L558.8 635.5 L558.7 635.0 L558.8 634.0 L558.8 619.5 L558.5 619.0 L558.2 618.9 L556.5 618.9 L556.0 619.0 L555.8 619.2 L555.6 619.8 L555.7 636.5 L555.6 638.0 L555.8 638.5 L556.2 638.8 L556.8 638.9 L568.2 638.9 L568.9 638.8 L569.2 638.5ZM583.5 638.2 L584.8 637.8 L586.5 636.6 L587.6 635.5 L588.6 634.0 L589.5 632.0 L589.8 630.5 L589.9 628.5 L589.7 626.5 L588.7 623.8 L588.0 623.0 L587.6 622.2 L586.5 621.2 L584.8 620.0 L583.8 619.7 L582.5 619.0 L579.8 618.9 L578.2 619.0 L575.8 620.1 L574.2 621.2 L572.0 623.9 L571.7 625.2 L571.1 626.2 L570.9 627.2 L570.9 630.0 L571.2 631.8 L572.0 633.8 L573.1 635.2 L574.2 636.4 L575.9 637.8 L577.0 638.1 L578.0 638.7 L579.0 638.9 L582.0 638.8 L582.8 638.6ZM580.2 636.5 L579.0 636.0 L577.8 635.7 L576.2 634.5 L574.9 632.8 L574.1 630.2 L574.0 629.5 L574.2 627.2 L575.4 624.2 L576.2 623.2 L577.5 622.1 L580.2 621.3 L583.0 622.1 L584.6 623.2 L585.8 624.9 L586.6 627.2 L586.8 628.8 L586.4 631.2 L586.0 632.0 L585.6 633.2 L584.6 634.5 L583.0 635.7 L580.8 636.5ZM612.0 637.5 L612.7 636.2 L614.0 632.7 L614.7 631.5 L615.1 629.8 L616.7 626.5 L618.0 622.8 L618.7 621.5 L618.9 620.5 L619.5 619.8 L619.5 619.2 L619.2 619.0 L616.8 618.9 L616.2 619.1 L616.0 619.4 L615.7 620.8 L615.0 622.0 L614.6 623.5 L614.2 624.2 L613.8 625.8 L613.1 627.0 L612.7 628.5 L612.0 629.8 L611.6 631.2 L611.1 632.2 L610.7 634.0 L610.5 634.4 L610.2 634.5 L609.8 634.1 L609.1 633.0 L608.8 631.8 L608.2 630.8 L607.2 627.8 L608.2 624.8 L608.8 623.8 L609.0 622.5 L609.6 621.5 L610.3 619.5 L610.3 619.2 L610.0 619.0 L608.2 618.9 L607.8 619.1 L607.4 619.5 L607.0 620.2 L606.8 621.5 L606.1 622.8 L605.8 624.2 L605.5 624.7 L605.2 624.8 L604.8 624.5 L604.5 624.0 L603.2 620.8 L602.8 619.2 L602.2 618.9 L600.8 618.9 L600.2 618.9 L599.9 619.2 L599.9 619.8 L600.5 620.8 L601.1 622.8 L601.7 624.0 L602.1 625.5 L602.8 626.7 L602.9 627.8 L602.7 629.0 L602.1 630.2 L601.6 631.8 L601.2 632.5 L600.8 634.2 L600.2 634.5 L599.9 634.2 L599.1 632.8 L598.7 631.2 L598.0 629.8 L596.7 626.2 L596.1 625.0 L595.8 623.5 L595.1 622.2 L594.1 619.5 L593.8 619.0 L593.2 618.9 L591.5 618.8 L591.0 619.0 L590.8 619.2 L590.8 619.8 L591.8 621.8 L592.1 623.0 L592.7 624.0 L593.0 625.2 L593.5 626.2 L594.0 627.8 L594.6 628.8 L595.0 630.2 L595.8 631.7 L596.1 632.8 L596.7 633.8 L598.4 638.5 L599.0 638.8 L600.0 638.9 L601.0 638.8 L601.6 638.5 L602.0 637.0 L602.7 635.8 L604.2 632.0 L604.8 631.1 L605.2 630.8 L605.5 630.8 L605.7 631.2 L607.0 634.8 L608.8 638.5 L609.5 638.9 L611.2 638.8 L611.8 638.5ZM648.2 637.7 L647.9 636.8 L647.2 636.4 L638.8 636.5 L638.0 636.0 L637.7 635.0 L637.7 630.5 L638.1 630.0 L638.8 629.8 L645.8 629.8 L646.5 629.6 L646.7 629.0 L646.6 628.0 L646.0 627.5 L643.8 627.4 L642.2 627.5 L640.5 627.3 L639.0 627.5 L638.2 627.3 L637.9 626.8 L637.8 625.8 L637.8 622.8 L638.0 621.7 L638.2 621.4 L638.8 621.2 L647.2 621.4 L647.7 621.0 L647.9 620.5 L648.0 619.8 L647.9 619.2 L647.5 618.9 L647.0 618.9 L635.8 618.8 L635.0 619.0 L634.7 619.2 L634.6 619.8 L634.7 620.8 L634.7 627.2 L634.6 638.0 L634.8 638.5 L635.2 638.8 L635.8 638.9 L647.2 638.9 L648.1 638.5ZM665.4 638.2 L665.4 636.5 L665.2 636.2 L664.8 636.0 L655.8 635.9 L655.2 635.8 L654.8 635.5 L654.8 619.5 L654.5 619.0 L654.2 618.9 L652.5 618.9 L652.0 619.0 L651.7 619.2 L651.6 619.8 L651.7 623.5 L651.7 638.5 L652.0 638.8 L652.8 638.9 L664.2 638.9 L664.9 638.8 L665.2 638.5ZM682.3 638.0 L681.9 636.8 L681.0 636.4 L672.5 636.5 L671.9 636.0 L671.8 634.8 L671.8 630.8 L672.1 630.0 L672.8 629.8 L679.8 629.8 L680.5 629.5 L680.8 629.0 L680.5 627.8 L680.0 627.5 L672.8 627.5 L672.2 627.4 L672.0 627.0 L671.8 626.2 L671.8 622.8 L672.0 621.7 L672.2 621.4 L672.8 621.2 L673.8 621.3 L681.2 621.3 L681.9 620.8 L682.0 620.0 L681.9 619.2 L681.5 618.9 L681.0 618.8 L669.5 618.9 L669.0 619.0 L668.7 619.5 L668.6 620.0 L668.7 621.2 L668.7 637.2 L668.6 638.0 L668.7 638.5 L669.0 638.8 L669.8 638.9 L681.2 638.9 L682.2 638.5ZM695.3 637.5 L695.8 636.8 L696.0 635.8 L696.6 634.8 L697.1 632.8 L697.8 631.5 L699.0 628.0 L699.7 626.8 L701.0 622.9 L702.4 619.8 L702.4 619.2 L702.0 619.0 L700.2 618.8 L699.5 619.0 L699.1 619.5 L698.6 621.0 L698.0 622.2 L697.7 623.5 L697.2 624.5 L696.8 626.0 L696.2 627.2 L695.8 628.7 L694.2 632.5 L693.9 633.8 L693.6 634.2 L693.2 634.4 L693.0 634.2 L692.6 633.0 L692.1 632.0 L691.8 630.8 L691.2 629.5 L690.8 627.8 L690.1 626.5 L689.7 625.0 L689.1 623.8 L688.8 622.4 L688.1 621.0 L687.7 619.5 L687.5 619.2 L687.0 619.0 L685.5 618.9 L684.5 619.0 L684.2 619.2 L684.2 619.8 L684.7 620.5 L686.0 624.0 L686.7 625.2 L686.9 626.5 L687.6 627.5 L688.0 629.2 L688.7 630.5 L689.0 631.8 L689.6 632.8 L690.1 634.5 L691.8 638.5 L692.5 638.9 L694.5 638.9 L695.0 638.5ZM719.9 638.2 L719.1 636.8 L718.6 634.8 L718.0 633.8 L717.7 632.5 L717.1 631.5 L716.7 630.0 L716.1 629.0 L715.6 627.0 L715.1 626.2 L714.7 624.8 L714.1 623.8 L713.7 622.0 L713.0 620.7 L712.6 619.5 L712.2 619.1 L711.8 618.9 L710.5 618.9 L709.5 619.1 L709.1 619.5 L708.6 621.0 L708.1 622.0 L707.7 623.5 L706.2 627.0 L705.8 628.4 L705.1 629.5 L702.7 636.0 L701.8 638.0 L701.8 638.5 L702.5 638.9 L704.2 638.9 L704.8 638.7 L705.1 638.2 L706.3 635.0 L707.1 633.5 L707.8 633.2 L709.5 633.4 L712.2 633.4 L713.5 633.2 L714.2 633.4 L714.9 634.0 L715.6 635.5 L716.5 638.2 L717.0 638.8 L717.5 638.9 L719.5 638.8 L719.8 638.7ZM713.2 630.9 L708.5 630.9 L708.0 630.8 L707.8 630.5 L707.9 629.8 L708.5 628.6 L709.0 627.0 L709.5 626.2 L710.2 623.8 L710.5 623.4 L711.0 623.5 L711.5 624.1 L713.2 629.0 L713.8 629.8 L713.8 630.5ZM729.2 637.8 L729.0 636.5 L729.1 623.0 L729.2 621.8 L729.5 621.5 L730.0 621.3 L735.2 621.3 L735.6 621.0 L735.8 620.5 L735.9 619.8 L735.7 619.2 L735.2 618.9 L733.5 618.9 L720.5 618.9 L719.7 619.0 L719.3 619.2 L719.2 619.8 L719.4 620.8 L719.8 621.2 L722.0 621.3 L724.0 621.3 L725.0 621.2 L725.5 621.4 L725.8 621.7 L725.9 622.8 L725.8 638.2 L726.0 638.6 L726.5 638.9 L728.2 638.9 L729.0 638.5ZM752.9 638.0 L752.6 636.8 L752.0 636.4 L743.5 636.5 L742.7 636.2 L742.3 635.8 L742.2 635.2 L742.3 632.0 L742.1 630.8 L742.3 630.2 L743.0 629.9 L749.0 629.8 L750.2 629.9 L750.8 629.8 L751.2 629.2 L750.9 628.0 L750.5 627.5 L748.2 627.4 L745.2 627.5 L743.2 627.4 L742.6 627.0 L742.3 626.5 L742.2 626.0 L742.2 622.5 L742.5 621.7 L743.0 621.4 L743.5 621.3 L751.8 621.3 L752.2 621.0 L752.6 619.8 L752.5 619.2 L752.0 618.9 L751.0 618.9 L740.2 618.9 L739.2 619.2 L739.0 619.8 L739.2 629.2 L739.0 630.5 L739.0 637.8 L739.2 638.5 L739.8 638.8 L741.0 638.9 L751.8 638.9 L752.5 638.7ZM766.5 638.3 L768.2 637.8 L769.5 636.8 L770.6 635.8 L771.8 634.0 L772.6 631.5 L772.9 629.0 L772.6 626.2 L771.7 623.8 L770.8 622.1 L769.6 621.0 L769.0 620.7 L768.2 620.0 L766.8 619.6 L765.8 619.0 L762.2 618.9 L757.2 618.9 L756.5 619.0 L756.2 619.2 L756.0 620.0 L756.0 638.0 L756.1 638.5 L756.5 638.8 L757.2 638.9 L764.5 638.9 L765.6 638.8ZM763.0 636.5 L760.0 636.4 L759.5 636.0 L759.2 635.2 L759.2 622.5 L759.5 621.7 L760.2 621.3 L761.8 621.4 L763.5 621.2 L764.7 621.8 L766.2 622.1 L767.5 623.1 L768.6 624.2 L769.6 627.0 L769.7 629.0 L769.5 631.0 L768.8 633.0 L767.8 634.5 L766.0 635.7ZM621.6 641.8 L622.0 641.2 L622.8 638.8 L622.9 636.5 L622.6 636.0 L622.2 635.8 L620.5 636.0 L620.2 636.2 L620.0 636.8 L620.1 638.2 L620.7 639.0 L620.9 639.5 L620.8 640.2 L620.5 641.0 L620.5 641.5 L621.0 641.8Z"}
};

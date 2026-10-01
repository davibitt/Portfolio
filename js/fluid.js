/*
  FUNDO EM FLUIDO (WebGL2)
  -------------------------
  Simulação de fluido real: o mouse empurra o fluido e injeta cor, que gira e se dissolve.
  Parado, um "cursor fantasma" invisível mantém o fluido se movendo devagar.
  Sem WebGL2, o fundo cai num gradiente estático (classe .no-webgl no CSS).

  Ajustes rápidos: mexa só no CONFIG abaixo.
*/
(function () {
  const canvas = document.getElementById("fluid");
  if (!canvas) return;

  const CONFIG = {
    SIM_RES: 64,                                    // resolução da física (mais baixo = mais leve)
    DYE_RES: window.innerWidth < 720 ? 128 : 192,   // resolução da cor
    PRESSURE_ITER: 20,
    PRESSURE_DISS: 0.8,
    CURL: 4,                // quanto o fluido forma redemoinhos
    VEL_DISS: 0.6,          // quão rápido o movimento para
    DYE_DISS: 1.2,          // quão rápido a cor se dissolve (maior = some mais rápido)
    SPLAT_RADIUS: 1.1,       // espessura do rastro do mouse
    SPLAT_FORCE: 5000,       // força do empurrão do mouse
    MOUSE_INTENSITY: 0.03,   // quanta cor o mouse injeta
    AMBIENT_INTENSITY: 0.019,// quanta cor o movimento automático injeta
    AMBIENT_EVERY: 3,        // a cada quantos frames o movimento automático injeta cor
    SOFTNESS: 0.014,         // desfoque final (maior = mais sedoso)
    RENDER_SCALE: 0.5,       // resolução de desenho (0.5 = metade, mais leve)
    BG: [13 / 255, 11 / 255, 20 / 255],
    PALETTE: [                 // degradê do roxo ao verde-água
      [0.416, 0.188, 0.765],   // #6A30C3
      [0.369, 0.376, 0.804],   // #5E60CD
      [0.325, 0.561, 0.851],   // #538FD9
      [0.306, 0.659, 0.867],   // #4EA8DD
      [0.286, 0.749, 0.890],   // #49BFE3
      [0.337, 0.812, 0.878],   // #56CFE0
      [0.388, 0.875, 0.875],   // #63DFDF
      [0.447, 0.937, 0.867]    // #72EFDD
    ]
  };

  const fog = canvas.parentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl2", { alpha: false, depth: false, stencil: false, antialias: false });

  if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
    fog.classList.add("no-webgl");
    return;
  }

  try {
    run();
  } catch (err) {
    console.warn("Fundo em fluido desativado:", err);
    fog.classList.add("no-webgl");
  }

  function run() {
    // ---------- shaders ----------
    const HEADER = "#version 300 es\nprecision highp float;\nprecision highp sampler2D;\n";

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, HEADER + src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }

    const vert = compile(gl.VERTEX_SHADER, `
      in vec2 aPosition;
      out vec2 vUv, vL, vR, vT, vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`);

    function program(fragSrc) {
      const p = gl.createProgram();
      gl.attachShader(p, vert);
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, "in vec2 vUv, vL, vR, vT, vB;\nout vec4 o;\n" + fragSrc));
      gl.bindAttribLocation(p, 0, "aPosition");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      const u = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(p, i).name;
        u[name] = gl.getUniformLocation(p, name);
      }
      return { u, bind() { gl.useProgram(p); } };
    }

    const splatP = program(`
      uniform sampler2D uTarget;
      uniform float aspectRatio, radius;
      uniform vec3 color;
      uniform vec2 point;
      void main () {
        vec2 p = vUv - point;
        p.x *= aspectRatio;
        vec3 s = exp(-dot(p, p) / radius) * color;
        o = vec4(texture(uTarget, vUv).xyz + s, 1.0);
      }`);

    const advP = program(`
      uniform sampler2D uVelocity, uSource;
      uniform vec2 texelSize;
      uniform float dt, dissipation;
      void main () {
        vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
        o = texture(uSource, coord) / (1.0 + dissipation * dt);
      }`);

    const divP = program(`
      uniform sampler2D uVelocity;
      void main () {
        float L = texture(uVelocity, vL).x;
        float R = texture(uVelocity, vR).x;
        float T = texture(uVelocity, vT).y;
        float B = texture(uVelocity, vB).y;
        vec2 C = texture(uVelocity, vUv).xy;
        if (vL.x < 0.0) L = -C.x;
        if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y;
        if (vB.y < 0.0) B = -C.y;
        o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }`);

    const curlP = program(`
      uniform sampler2D uVelocity;
      void main () {
        float L = texture(uVelocity, vL).y;
        float R = texture(uVelocity, vR).y;
        float T = texture(uVelocity, vT).x;
        float B = texture(uVelocity, vB).x;
        o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }`);

    const vortP = program(`
      uniform sampler2D uVelocity, uCurl;
      uniform float curl, dt;
      void main () {
        float L = texture(uCurl, vL).x;
        float R = texture(uCurl, vR).x;
        float T = texture(uCurl, vT).x;
        float B = texture(uCurl, vB).x;
        float C = texture(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture(uVelocity, vUv).xy + force * dt;
        o = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
      }`);

    const clearP = program(`
      uniform sampler2D uTexture;
      uniform float value;
      void main () { o = value * texture(uTexture, vUv); }`);

    const presP = program(`
      uniform sampler2D uPressure, uDivergence;
      void main () {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        float d = texture(uDivergence, vUv).x;
        o = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
      }`);

    const gradP = program(`
      uniform sampler2D uPressure, uVelocity;
      void main () {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        vec2 vel = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
        o = vec4(vel, 0.0, 1.0);
      }`);

    const dispP = program(`
      uniform sampler2D uTexture;
      uniform vec3 bg;
      uniform vec2 blurStep;
      void main () {
        vec3 c = vec3(0.0);
        float w = 0.0;
        for (int i = -2; i <= 2; i++) {
          for (int j = -2; j <= 2; j++) {
            vec2 k = vec2(float(i), float(j));
            float g = exp(-dot(k, k) / 4.0);
            c += texture(uTexture, vUv + k * blurStep).rgb * g;
            w += g;
          }
        }
        c /= w;
        c = 1.0 - exp(-c * 1.5);                    // satura suave, sem estourar
        c = c * c * (3.0 - 2.0 * c);                // contraste: escuros ficam escuros
        float l = dot(c, vec3(0.299, 0.587, 0.114));
        c = clamp(mix(vec3(l), c, 1.4), 0.0, 1.0);  // mais saturação
        o = vec4(bg + c * (1.0 - bg), 1.0);
      }`);

    // ---------- geometria (um quadrado cobrindo a tela) ----------
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target) {
      if (target) {
        gl.viewport(0, 0, target.w, target.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    // ---------- texturas de simulação ----------
    let allocated = [];

    function fbo(w, h, filter) {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      allocated.push({ tex, fb });
      return {
        fbo: fb, w, h, tx: 1 / w, ty: 1 / h,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; }
      };
    }

    function doubleFbo(w, h, filter) {
      let a = fbo(w, h, filter), b = fbo(w, h, filter);
      return {
        tx: a.tx, ty: a.ty,
        get read() { return a; },
        get write() { return b; },
        swap() { const t = a; a = b; b = t; }
      };
    }

    function getRes(r) {
      let a = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (a < 1) a = 1 / a;
      const mn = Math.round(r), mx = Math.round(r * a);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: mx, h: mn } : { w: mn, h: mx };
    }

    let velocity, dye, divergence, curlFbo, pressure;

    function initFbos() {
      allocated.forEach(({ tex, fb }) => { gl.deleteTexture(tex); gl.deleteFramebuffer(fb); });
      allocated = [];
      const s = getRes(CONFIG.SIM_RES), d = getRes(CONFIG.DYE_RES);
      velocity = doubleFbo(s.w, s.h, gl.LINEAR);
      dye = doubleFbo(d.w, d.h, gl.LINEAR);
      divergence = fbo(s.w, s.h, gl.NEAREST);
      curlFbo = fbo(s.w, s.h, gl.NEAREST);
      pressure = doubleFbo(s.w, s.h, gl.NEAREST);
    }

    // só recria quando o tamanho muda de verdade (evita "piscar" com a barra do navegador no celular)
    let lastW = 0, lastH = 0;
    function fit() {
      const w = window.innerWidth, h = window.innerHeight;
      if (w === lastW && h <= lastH * 1.25 && h >= lastH * 0.75) return false;
      lastW = w; lastH = h;
      canvas.width = Math.max(1, Math.round(w * CONFIG.RENDER_SCALE));
      canvas.height = Math.max(1, Math.round(h * CONFIG.RENDER_SCALE));
      initFbos();
      return true;
    }

    const aspect = () => canvas.width / canvas.height;

    // ---------- operações ----------
    function splat(x, y, dx, dy, c, radius) {
      splatP.bind();
      gl.uniform1i(splatP.u.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatP.u.aspectRatio, aspect());
      gl.uniform2f(splatP.u.point, x, y);
      gl.uniform3f(splatP.u.color, dx, dy, 0);
      let r = radius / 100;
      if (aspect() > 1) r *= aspect();
      gl.uniform1f(splatP.u.radius, r);
      blit(velocity.write); velocity.swap();
      gl.uniform1i(splatP.u.uTarget, dye.read.attach(0));
      gl.uniform3f(splatP.u.color, c[0], c[1], c[2]);
      blit(dye.write); dye.swap();
    }

    function step(dt) {
      gl.disable(gl.BLEND);

      curlP.bind();
      gl.uniform2f(curlP.u.texelSize, velocity.tx, velocity.ty);
      gl.uniform1i(curlP.u.uVelocity, velocity.read.attach(0));
      blit(curlFbo);

      vortP.bind();
      gl.uniform2f(vortP.u.texelSize, velocity.tx, velocity.ty);
      gl.uniform1i(vortP.u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vortP.u.uCurl, curlFbo.attach(1));
      gl.uniform1f(vortP.u.curl, CONFIG.CURL);
      gl.uniform1f(vortP.u.dt, dt);
      blit(velocity.write); velocity.swap();

      divP.bind();
      gl.uniform2f(divP.u.texelSize, velocity.tx, velocity.ty);
      gl.uniform1i(divP.u.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearP.bind();
      gl.uniform1i(clearP.u.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearP.u.value, CONFIG.PRESSURE_DISS);
      blit(pressure.write); pressure.swap();

      presP.bind();
      gl.uniform2f(presP.u.texelSize, velocity.tx, velocity.ty);
      gl.uniform1i(presP.u.uDivergence, divergence.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITER; i++) {
        gl.uniform1i(presP.u.uPressure, pressure.read.attach(1));
        blit(pressure.write); pressure.swap();
      }

      gradP.bind();
      gl.uniform2f(gradP.u.texelSize, velocity.tx, velocity.ty);
      gl.uniform1i(gradP.u.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradP.u.uVelocity, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      advP.bind();
      gl.uniform2f(advP.u.texelSize, velocity.tx, velocity.ty);
      const v = velocity.read.attach(0);
      gl.uniform1i(advP.u.uVelocity, v);
      gl.uniform1i(advP.u.uSource, v);
      gl.uniform1f(advP.u.dt, dt);
      gl.uniform1f(advP.u.dissipation, CONFIG.VEL_DISS);
      blit(velocity.write); velocity.swap();

      gl.uniform1i(advP.u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advP.u.uSource, dye.read.attach(1));
      gl.uniform1f(advP.u.dissipation, CONFIG.DYE_DISS);
      blit(dye.write); dye.swap();
    }

    function render() {
      dispP.bind();
      gl.uniform1i(dispP.u.uTexture, dye.read.attach(0));
      gl.uniform3f(dispP.u.bg, CONFIG.BG[0], CONFIG.BG[1], CONFIG.BG[2]);
      gl.uniform2f(dispP.u.blurStep, CONFIG.SOFTNESS / aspect(), CONFIG.SOFTNESS);
      blit(null);
    }

    // cor que passeia suavemente pela paleta ao longo do tempo
    function color(t, k) {
      const P = CONFIG.PALETTE;
      const f = (t * 0.16) % P.length;
      const i = Math.floor(f), j = (i + 1) % P.length, m = f - i;
      return [0, 1, 2].map((n) => (P[i][n] * (1 - m) + P[j][n] * m) * k);
    }

    // algumas manchas iniciais pra tela não começar vazia
    function seed() {
      for (let i = 0; i < 5; i++) {
        const x = 0.2 + Math.random() * 0.6;
        const y = 0.2 + Math.random() * 0.6;
        const ang = Math.random() * Math.PI * 2;
        splat(x, y, Math.cos(ang) * 300, Math.sin(ang) * 300, color(i * 2.5, 0.22), CONFIG.SPLAT_RADIUS * 3);
      }
    }

    // ---------- "cursor fantasma": mantém o fluido vivo sem interação ----------
    const ghost = { px: null, py: null };
    function ambient(t, frame) {
      if (frame % CONFIG.AMBIENT_EVERY) return;
      const x = 0.5 + 0.32 * Math.sin(t * 0.21) + 0.08 * Math.sin(t * 0.53);
      const y = 0.5 + 0.26 * Math.sin(t * 0.17 + 1.3) + 0.07 * Math.cos(t * 0.41);
      if (ghost.px === null) { ghost.px = x; ghost.py = y; return; }
      const dx = x - ghost.px, dy = y - ghost.py;
      ghost.px = x; ghost.py = y;
      splat(x, y, dx * CONFIG.SPLAT_FORCE * 0.6, dy * CONFIG.SPLAT_FORCE * 0.6,
        color(t + 3, CONFIG.AMBIENT_INTENSITY), CONFIG.SPLAT_RADIUS * 2.2);
    }

    // ---------- mouse / toque ----------
    const pointer = { x: 0, y: 0, px: 0, py: 0, moved: false, ready: false };
    function readPointer(e) {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      if (!pointer.ready) { pointer.px = x; pointer.py = y; pointer.ready = true; }
      pointer.x = x; pointer.y = y; pointer.moved = true;
    }

    function applyPointer(t) {
      if (!pointer.moved) return;
      pointer.moved = false;
      let dx = pointer.x - pointer.px, dy = pointer.y - pointer.py;
      pointer.px = pointer.x; pointer.py = pointer.y;
      const a = aspect();
      if (a < 1) dx *= a;
      if (a > 1) dy /= a;
      if (dx === 0 && dy === 0) return;
      splat(pointer.x, pointer.y, dx * CONFIG.SPLAT_FORCE, dy * CONFIG.SPLAT_FORCE,
        color(t, CONFIG.MOUSE_INTENSITY), CONFIG.SPLAT_RADIUS);
    }

    // ---------- início ----------
    fit();
    seed();

    if (reduceMotion) {
      // acessibilidade: desenha um quadro estático e para
      for (let i = 0; i < 40; i++) step(1 / 60);
      render();
      return;
    }

    window.addEventListener("pointermove", readPointer, { passive: true });
    window.addEventListener("pointerdown", (e) => { pointer.ready = false; readPointer(e); }, { passive: true });
    window.addEventListener("resize", () => { if (fit()) seed(); });

    let last = performance.now();
    let frame = 0;
    function loop(now) {
      // pausa enquanto outra página cobre o fundo (ex: o mapa do case NOMAD)
      if (window.__fluidPaused) { last = now; requestAnimationFrame(loop); return; }
      const dt = Math.min((now - last) / 1000, 1 / 60);
      last = now;
      const t = now / 1000;
      ambient(t, frame);
      applyPointer(t);
      step(dt);
      render();
      frame++;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
})();

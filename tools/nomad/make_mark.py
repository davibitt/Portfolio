# Gera a marca NOMAD (carimbo) em vetor puro: texto em contornos + desgaste como geometria (sem filtros)
import numpy as np, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union
from shapely import affinity
from skimage import measure
import io

ORANGE = "#FF5B1F"
rng = np.random.default_rng(7)

# ---------- fontes ----------
def load(path, axes=None):
    f = TTFont(path)
    if axes: f = instantiateVariableFont(f, axes)
    buf = io.BytesIO(); f.save(buf); data = buf.getvalue()
    return TTFont(io.BytesIO(data)), data

archivo, archivo_bytes = load("archivo.ttf", {"wdth": 125, "wght": 900})
plex, plex_bytes = load("plexmono.ttf")

def flatten(cmds, steps=10):
    """contornos do glifo -> lista de anéis (pontos), curvas quadráticas/cúbicas subdivididas"""
    rings, cur, start = [], [], None
    for op, args in cmds:
        if op == "moveTo":
            cur = [args[0]]; start = args[0]
        elif op == "lineTo":
            cur.append(args[0])
        elif op == "qCurveTo":
            pts = list(args); p0 = cur[-1]
            # pontos implícitos entre controles consecutivos (TrueType)
            ctrl = pts[:-1]; end = pts[-1]
            segs = []
            for i, c in enumerate(ctrl):
                e = end if i == len(ctrl) - 1 else ((c[0] + ctrl[i + 1][0]) / 2, (c[1] + ctrl[i + 1][1]) / 2)
                segs.append((c, e))
            for c, e in segs:
                for t in np.linspace(0, 1, steps + 1)[1:]:
                    x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * e[0]
                    y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * e[1]
                    cur.append((x, y))
                p0 = e
        elif op == "curveTo":
            c1, c2, e = args; p0 = cur[-1]
            for t in np.linspace(0, 1, steps + 1)[1:]:
                x = (1-t)**3*p0[0] + 3*(1-t)**2*t*c1[0] + 3*(1-t)*t**2*c2[0] + t**3*e[0]
                y = (1-t)**3*p0[1] + 3*(1-t)**2*t*c1[1] + 3*(1-t)*t**2*c2[1] + t**3*e[1]
                cur.append((x, y))
        elif op in ("closePath", "endPath"):
            if len(cur) > 2: rings.append(cur)
            cur = []
    return rings

def text_shape(font, data, text, size, tracking_em=0.0):
    """texto -> geometria (Shapely), em px, y para baixo, linha de base em y=0"""
    upem = font["head"].unitsPerEm; s = size / upem
    face = hb.Face(data); hfont = hb.Font(face); buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hfont, buf, {"kern": True, "liga": False})
    gs = font.getGlyphSet(); order = font.getGlyphOrder()
    x = 0.0; geoms = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        pen = DecomposingRecordingPen(gs); gs[order[info.codepoint]].draw(pen)
        g = None
        for ring in flatten(pen.value):
            poly = Polygon([((x + pos.x_offset + px) * s, -(py + pos.y_offset) * s) for px, py in ring]).buffer(0)
            g = poly if g is None else g.symmetric_difference(poly)   # regra par-ímpar (miolos das letras)
        if g is not None: geoms.append(g)
        x += pos.x_advance + tracking_em * upem
    shape = unary_union(geoms)
    width = (x - tracking_em * upem) * s
    return shape, width

# ---------- ruído (fractal, parecido com o feTurbulence do site) ----------
def value_noise(shape, freq, octaves, seed):
    h, w = shape; out = np.zeros(shape); amp, tot = 1.0, 0.0
    r = np.random.default_rng(seed)
    for o in range(octaves):
        f = freq * (2 ** o)
        gh, gw = int(h * f) + 3, int(w * f) + 3
        grid = r.random((gh, gw))
        yy, xx = np.mgrid[0:h, 0:w]
        fy, fx = yy * f, xx * f
        y0, x0 = fy.astype(int), fx.astype(int); ty, tx = fy - y0, fx - x0
        ty, tx = ty * ty * (3 - 2 * ty), tx * tx * (3 - 2 * tx)
        a = grid[y0, x0] * (1 - tx) + grid[y0, x0 + 1] * tx
        b = grid[y0 + 1, x0] * (1 - tx) + grid[y0 + 1, x0 + 1] * tx
        out += amp * (a * (1 - ty) + b * ty); tot += amp; amp *= 0.5
    return out / tot

def distress(geom, bounds, pad=6, jitter=1.6, hole_thr=0.66, hole_scale=0.4):
    """borda irregular (deslocamento por ruído) + falhas de tinta (furos) — tudo em geometria"""
    minx, miny, maxx, maxy = bounds
    W, H = int(maxx - minx + 2 * pad), int(maxy - miny + 2 * pad)
    nx, ny = value_noise((H, W), 0.35, 2, 3), value_noise((H, W), 0.35, 2, 4)
    def disp(coords):
        c = np.asarray(coords)
        # densifica a cada ~1px para a borda ficar orgânica
        out = []
        for i in range(len(c) - 1):
            a, b = c[i], c[i + 1]; n = max(1, int(np.hypot(*(b - a)) / 1.0))
            for t in np.linspace(0, 1, n, endpoint=False): out.append(a + (b - a) * t)
        out = np.array(out)
        ix = np.clip((out[:, 0] - minx + pad).astype(int), 0, W - 1)
        iy = np.clip((out[:, 1] - miny + pad).astype(int), 0, H - 1)
        out[:, 0] += (nx[iy, ix] - 0.5) * 2 * jitter
        out[:, 1] += (ny[iy, ix] - 0.5) * 2 * jitter
        return out
    polys = []
    for p in getattr(geom, "geoms", [geom]):
        ext = disp(p.exterior.coords); ints = [disp(r.coords) for r in p.interiors]
        polys.append(Polygon(ext, ints).buffer(0))
    g = unary_union(polys)
    # furos: onde o ruído passa do limiar, a tinta "falhou"
    # desgaste irregular: pontos finos modulados por manchas grandes (a tinta falha mais em algumas regiões)
    field = 0.62 * value_noise((H, W), hole_scale, 3, 8) + 0.38 * value_noise((H, W), 0.018, 2, 21)
    holes = []
    for cnt in measure.find_contours(field, hole_thr):
        if len(cnt) < 4: continue
        pts = [(x + minx - pad, y + miny - pad) for y, x in cnt]
        hp = Polygon(pts).buffer(0)
        if hp.area > 0.6: holes.append(hp)
    if holes: g = g.difference(unary_union(holes))
    return g.simplify(0.18, preserve_topology=True)

def to_path(g):
    parts = []
    for p in getattr(g, "geoms", [g]):
        if p.is_empty or p.geom_type != "Polygon": continue
        for ring in [p.exterior, *p.interiors]:
            c = list(ring.coords)[:-1]
            parts.append("M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in c) + "Z")
    return "".join(parts)

def svg(paths, w, h, title):
    body = "".join(f'<path fill="{ORANGE}" fill-rule="evenodd" d="{d}"/>' for d in paths)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}">'
            f'<title>{title}</title>{body}</svg>')

# ---------- montagem (mesmas proporções do carimbo no site, em escala desktop) ----------
WORD = 176                 # 11rem
word, ww = text_shape(archivo, archivo_bytes, "NOMAD", WORD, 0.02)
b = word.bounds            # tinta real do texto
word = affinity.translate(word, -b[0], -b[1])
wbw, wbh = b[2] - b[0], b[3] - b[1]

META = 12.8
m1, m1w = text_shape(plex, plex_bytes, "N 64°08.412' W 021°56.034'", META, 0.06)
m2, m2w = text_shape(plex, plex_bytes, "BE READY FOR THE UNKNOWN.", META, 0.06)
GAP_META = 22
meta_w = m1w + GAP_META + m2w
PAD_X, PAD_Y, GAP, BORDER = 64, 40, 18, 3.2

inner_w = max(wbw, meta_w)
W = inner_w + 2 * PAD_X; H = PAD_Y + wbh + GAP + META * 0.75 + PAD_Y
word_s = affinity.translate(word, (W - wbw) / 2, PAD_Y)
my = PAD_Y + wbh + GAP + META * 0.72                      # linha de base da meta
mx = (W - meta_w) / 2
meta = unary_union([affinity.translate(m1, mx, my), affinity.translate(m2, mx + m1w + GAP_META, my)])
frame = box(0, 0, W, H).difference(box(BORDER, BORDER, W - BORDER, H - BORDER))

M = 10
word_d = distress(word_s, (0, 0, W, H))
frame_d = distress(frame, (0, 0, W, H))
# a meta fica nítida (como no site), só com um leve tremor de borda
meta_d = distress(meta, (0, 0, W, H), jitter=0.25, hole_thr=2.0)

def shift(g, dx, dy): return affinity.translate(g, dx, dy)
stamp = [to_path(shift(frame_d, M, M)), to_path(shift(word_d, M, M)), to_path(shift(meta_d, M, M))]
open("/mnt/user-data/outputs/nomad-stamp.svg", "w").write(svg(stamp, W + 2 * M, H + 2 * M, "NOMAD — stamp"))

# só a palavra
wb = word_d.bounds
wonly = shift(word_d, -wb[0] + M, -wb[1] + M)
open("/mnt/user-data/outputs/nomad-wordmark.svg", "w").write(svg([to_path(wonly)], wb[2] - wb[0] + 2 * M, wb[3] - wb[1] + 2 * M, "NOMAD — wordmark"))
print("ok", round(W), round(H), "furos na palavra:", len(getattr(word_d, "geoms", [word_d])))

import numpy as np, json
from PIL import Image
from skimage import measure
from shapely.geometry import Polygon
S=4
im=Image.open("/home/claude/portfolio/assets/lynda/lynda-logo-tagline.jpg").convert("RGB")
W,H=im.size
big=np.asarray(im.resize((W*S,H*S),Image.LANCZOS),dtype=float)/255.0
bg=np.array([0.89,0.85,0.78]); ink=np.array([0.40,0.40,0.28])
# quanto cada pixel se parece com a tinta (projeção entre fundo e olive)
t=((big-bg)@(ink-bg))/((ink-bg)@(ink-bg)); t=np.clip(t,0,1)
def trace(mask_box):
    x0,y0,x1,y1=[v*S for v in mask_box]
    sub=np.pad(t[y0:y1,x0:x1],2)
    g=None
    for c in measure.find_contours(sub,0.5):
        if len(c)<12: continue
        p=Polygon([((x-2)/S+mask_box[0],(y-2)/S+mask_box[1]) for y,x in c]).buffer(0)
        if p.area<1: continue
        g=p if g is None else g.symmetric_difference(p)
    return g
tag=trace((440,608,785,650))
print("tagline bounds",[round(v,1) for v in tag.bounds])
logo=trace((255,405,845,605))
print("logo(sem cauda do y) bounds",[round(v,1) for v in logo.bounds])
def path(g):
    out=""
    for p in getattr(g,"geoms",[g]):
        p=p.simplify(0.1,preserve_topology=True)
        for ring in [p.exterior,*p.interiors]:
            c=list(ring.coords)[:-1]; out+="M"+" L".join(f"{x:.1f} {y:.1f}" for x,y in c)+"Z"
    return out
json.dump({"tag":path(tag)},open("tag.json","w"))
print(len(path(tag)))

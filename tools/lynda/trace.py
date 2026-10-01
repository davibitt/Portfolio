import numpy as np, json
from PIL import Image
from skimage import measure
from shapely.geometry import Polygon
from shapely.ops import unary_union
S=4
im=Image.open("/home/claude/portfolio/assets/lynda/lynda-logo-black-on-white.jpg").convert("L")
W,H=im.size
big=im.resize((W*S,H*S),Image.LANCZOS)
a=1-np.asarray(big,dtype=float)/255.0
a=np.pad(a,2)
rings=[]
for c in measure.find_contours(a,0.5):
    if len(c)<20: continue
    pts=[((x-2)/S,(y-2)/S) for y,x in c]
    p=Polygon(pts)
    if p.area<2: continue
    rings.append(p.buffer(0))
# par-ímpar: xor de todos os anéis
g=None
for r in rings: g=r if g is None else g.symmetric_difference(r)
parts=list(getattr(g,"geoms",[g]))
parts=[p.simplify(0.12,preserve_topology=True) for p in parts]
def path(p):
    out=""
    for ring in [p.exterior,*p.interiors]:
        c=list(ring.coords)[:-1]; out+="M"+" L".join(f"{x:.2f} {y:.2f}" for x,y in c)+"Z"
    return out
items=[]
for p in parts:
    b=p.bounds; items.append({"b":[round(v,1) for v in b],"area":round(p.area),"d":path(p)})
items.sort(key=lambda i:i["b"][0])
for i in items: print(i["b"],i["area"])
json.dump(items,open("parts.json","w"))

import json, re, numpy as np
from PIL import Image, ImageDraw
items=json.load(open("parts.json"))
def ring0(d):
    r=d.split("Z")[0]; n=list(map(float,re.findall(r"-?\d+\.?\d*",r))); return np.array(n).reshape(-1,2)
A=ring0(items[4]["d"]); S=ring0(items[5]["d"])
def longest_run(mask):
    n=len(mask); best=(0,0); i=0
    m2=np.concatenate([mask,mask])
    run=0; start=0
    for k in range(2*n):
        if m2[k]:
            if run==0: start=k
            run+=1
            if run>best[1] and run<=n: best=(start,run)
        else: run=0
    s,l=best; return [(s+j)%n for j in range(l)]
def resample(P,N=48):
    d=np.r_[0,np.cumsum(np.hypot(*np.diff(P,axis=0).T))]; t=np.linspace(0,d[-1],N)
    return np.c_[np.interp(t,d,P[:,0]),np.interp(t,d,P[:,1])]
top=A[:,1].min()
# ombro: borda externa do "a" acima de y=top+24, à direita do traço fino
idx=longest_run((A[:,1]<top+24)&(A[:,0]>716))
dome=A[idx]
if dome[0,0]>dome[-1,0]: dome=dome[::-1]
# curva da estrela voltada para o "a" (inferior esquerda)
cx,cy=S[:,0].mean(),S[:,1].mean()
idx2=longest_run((S[:,0]<cx-1.5)&(S[:,1]>cy+1.5))
arcS=S[idx2]
if arcS[0,0]>arcS[-1,0]: arcS=arcS[::-1]
dA,dS=resample(dome),resample(arcS)
def fit(P):
    x,y=P[:,0],P[:,1]; M=np.c_[2*x,2*y,np.ones(len(x))]; c=np.linalg.lstsq(M,x*x+y*y,rcond=None)[0]
    r=np.sqrt(c[2]+c[0]**2+c[1]**2); res=np.abs(np.hypot(x-c[0],y-c[1])-r).max(); return c[0],c[1],r,res
print("ombro: %d pts, x %.1f..%.1f, y %.1f..%.1f"%(len(dome),dome[:,0].min(),dome[:,0].max(),dome[:,1].min(),dome[:,1].max()), "circulo cx %.1f cy %.1f r %.1f erro max %.2f"%fit(dA))
print("estrela:", "circulo cx %.1f cy %.1f r %.1f erro max %.2f"%fit(dS))
im=Image.open("/home/claude/portfolio/assets/lynda/lynda-logo-black-on-white.jpg").convert("RGB"); dr=ImageDraw.Draw(im)
for P,c in ((dA,(230,178,58)),(dS,(230,60,60))): dr.line([tuple(p) for p in P],fill=c,width=2)
im.crop((660,400,860,540)).resize((800,560)).save("/home/claude/frames/lcurv.png")
json.dump({"curvaA":[round(v,2) for v in dA.flatten()],"curvaE":[round(v,2) for v in dS.flatten()],"fitA":fit(dA)[:3],"fitE":fit(dS)[:3]},open("curves.json","w"))

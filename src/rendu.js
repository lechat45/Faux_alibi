// Effets de rendu : ombres douces, reflets sur les sols cirés, rayons de lune, halos des lampes, vignettage.
// Tout se coupe avec l'option « Effets de lumière : simples ».
const REFLET={marbre:.24,parquet:.14,damier:.16,scene:.16,lino:.09,metal:.11};

// Reflets et ombres douces : cuits une fois dans la carte du sol
function effetsSol(g){
  W.furn.forEach(f=>{
    const A=W.areas[f.room],spr=G.furn[f.id],base=(f.y+f.h)*TS,H=SH[f.name]||24;
    if(!A||!spr)return;
    const a=REFLET[A.rec&&A.rec.f];
    if(a&&!/^(lift|escalier|secours|rug|mur|porte|porteL)$/.test(f.name)){
      const hr=Math.min(18,H),[rk,rg]=cv(spr.width,hr);
      rg.save();rg.translate(0,hr);rg.scale(1,-1);rg.drawImage(spr,0,H+1-hr,spr.width,hr,0,0,spr.width,hr);rg.restore();
      rg.globalCompositeOperation='destination-in';const q=rg.createLinearGradient(0,0,0,hr);q.addColorStop(0,`rgba(0,0,0,${a})`);q.addColorStop(1,'rgba(0,0,0,0)');rg.fillStyle=q;rg.fillRect(0,0,spr.width,hr);
      g.save();g.beginPath();A.rects.forEach(r=>g.rect(r.x0*TS,(r.y0)*TS,(r.x1-r.x0+1)*TS,(r.y1-r.y0+1)*TS));
      if(A.tapis){const t=A.tapis;g.rect(t.x*TS,t.y*TS,(t.x1-t.x+1)*TS,(t.y1-t.y+1)*TS)}
      g.clip('evenodd');g.drawImage(rk,f.x*TS-1,base);g.restore();
    }
    // ombre portée douce, en ellipse, au pied du meuble
    const cx=(f.x+f.w/2)*TS,rx=f.w*TS*.62+2,q=g.createRadialGradient(0,0,1,0,0,rx);
    q.addColorStop(0,'rgba(10,8,28,.42)');q.addColorStop(1,'rgba(10,8,28,0)');
    g.save();g.translate(cx,base-1);g.scale(1,5/rx);g.fillStyle=q;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore();
  });
}
// Occlusion : le sol s'assombrit doucement au pied des murs et au bord du vide
function effetsBords(g){
  const t=W.t,deg=(x0,y0,x1,y1,a)=>{const q=g.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,`rgba(8,6,22,${a})`);q.addColorStop(1,'rgba(8,6,22,0)');return q};
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
    if(t[y][x]!==1||W.gate[y][x])continue;const X=x*TS,Y=y*TS;
    if(t[y-1][x]===2){g.fillStyle=deg(0,Y,0,Y+8,.38);g.fillRect(X,Y,TS,8)}
    if(t[y][x-1]===0){g.fillStyle=deg(X,0,X+5,0,.3);g.fillRect(X,Y,5,TS)}
    if(t[y][x+1]===0){g.fillStyle=deg(X+TS,0,X+TS-5,0,.3);g.fillRect(X+TS-5,Y,5,TS)}
    if(t[y+1][x]===0){g.fillStyle=deg(0,Y+TS,0,Y+TS-5,.26);g.fillRect(X,Y+TS-5,TS,5)}
  }
}
// La lune entre par les fenêtres et dessine un rai de lumière sur le sol
function rayonsLune(g){
  W.windows.forEach(w=>{
    const a=areaIdx(w.x,w.y+2),A=W.areas[a];if(!A)return;
    const y0=(w.y+2)*8,y1=(w.y+6.5)*8,x0=(w.x+.15)*8,x1=(w.x+1.85)*8,d=-16;
    g.save();g.beginPath();A.rects.forEach(r=>g.rect(r.x0*8,r.y0*8,(r.x1-r.x0+1)*8,(r.y1-r.y0+1)*8));g.clip();
    const q=g.createLinearGradient(0,y0,0,y1);q.addColorStop(0,'rgba(90,110,190,.62)');q.addColorStop(1,'rgba(90,110,190,0)');
    g.fillStyle=q;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y0);g.lineTo(x1+d,y1);g.lineTo(x0+d,y1);g.closePath();g.fill();g.restore();
  });
}
// De la poussière qui danse dans le rai de lune
function poussiereLune(){
  if(!O.effets||!O.parts||G.noir>0||document.body.classList.contains('calme'))return;
  const ar=G.area!=null?G.area:c.rc;ctx.fillStyle='rgba(205,215,255,.55)';
  W.windows.forEach((w,i)=>{
    const x=(w.x+1)*TS,y=(w.y+2)*TS;if(Math.abs(x-S.p.x)>220||Math.abs(y-S.p.y)>170||!visible(ar,w.x,w.y+2))return;
    for(let k=0;k<6;k++){const p=((tick*.004+k*.17+i*.31)%1),fx=.15+((k*37+i*11)%17)/17*1.7;ctx.fillRect(Math.round((w.x+fx)*TS-p*32+Math.sin(tick*.02+k)*2),Math.round(y+p*72),1,1)}
  });
}
// Halo autour de l'abat-jour des lampes de la pièce
function halosLampes(cx,cy){
  if(!O.effets||G.noir>0)return;
  const ar=G.area!=null?G.area:c.rc;
  W.furn.forEach(f=>{
    if(f.name!=='lamp'||!visible(ar,f.x,f.y))return;
    const x=(f.x+.5)*TS-cx,y=(f.y+1)*TS-32-cy,r=18;if(x<-r||y<-r||x>VW+r||y>VH+r)return;
    const q=ctx.createRadialGradient(x,y,1,x,y,r);q.addColorStop(0,'rgba(255,214,150,.3)');q.addColorStop(1,'rgba(255,214,150,0)');ctx.fillStyle=q;ctx.fillRect(x-r,y-r,r*2,r*2);
  });
}
// Les bords de l'écran s'assombrissent un peu : le regard va au centre
function vignette(){
  if(!O.effets)return;
  if(!G.vign||G.vign.width!==VW||G.vign.height!==VH){const[k,g]=cv(VW,VH),r=Math.hypot(VW,VH)/2,q=g.createRadialGradient(VW/2,VH/2,r*.45,VW/2,VH/2,r);q.addColorStop(0,'rgba(4,3,14,0)');q.addColorStop(1,'rgba(4,3,14,.42)');g.fillStyle=q;g.fillRect(0,0,VW,VH);G.vign=k}
  ctx.drawImage(G.vign,0,0);
}

// ——— Les murs tout autour : on voit le dessus des murs de côté et de devant, comme une maquette vue d'en haut ———
const EP_MUR=7;
const cleRendu=()=>O.effets+'/'+O.murs;
function mursTour(g){
  const t=W.t,dedans=(x,y)=>y>=0&&y<MH&&x>=0&&x<MW&&t[y][x]!==0;
  // la pièce à qui appartient une case de sol ou de mur
  const aire=(x,y)=>{
    if(t[y][x]===2){for(let k=1;k<4&&y+k<MH;k++)if(t[y+k][x]===1)return aire(x,y+k);return -1}
    const i=areaIdx(x,y);if(i>=0)return i;
    const d=W.gate[y][x]&&W.doors[W.gate[y][x]];return d?(d.v?d.a:(y===d.y?d.haut:d.bas)):-1;
  };
  const PW=MW*TS,PH=MH*TS,own=new Int16Array(PW*PH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    if(t[y][x]!==0)continue;
    const L=dedans(x-1,y),Rr=dedans(x+1,y),U=dedans(x,y-1),D=dedans(x,y+1);
    const HG=!L&&!U&&dedans(x-1,y-1),HD=!Rr&&!U&&dedans(x+1,y-1),BG=!L&&!D&&dedans(x-1,y+1),BD=!Rr&&!D&&dedans(x+1,y+1);
    if(!(L||Rr||U||D||HG||HD||BG||BD))continue;
    const eh=L&&Rr?8:EP_MUR,ev=U&&D?8:EP_MUR,E=EP_MUR;
    const wG=autre=>Rr?16-eh:autre?8:E,wD=autre=>L?16-eh:autre?8:E,hH=autre=>D?16-ev:autre?8:E,hB=autre=>U?16-ev:autre?8:E;
    const aL=L?aire(x-1,y):0,aR=Rr?aire(x+1,y):0,aU=U?aire(x,y-1):0,aD=D?aire(x,y+1):0;
    const aHG=HG?aire(x-1,y-1):0,aHD=HD?aire(x+1,y-1):0,aBG=BG?aire(x-1,y+1):0,aBD=BD?aire(x+1,y+1):0;
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      let o=null;
      if(U&&b<ev)o=aU;else if(D&&b>=16-ev)o=aD;else if(L&&a<eh)o=aL;else if(Rr&&a>=16-eh)o=aR;
      else if(HG&&a<wG(HD)&&b<hH(BG))o=aHG;else if(HD&&a>=16-wD(HG)&&b<hH(BD))o=aHD;else if(BG&&a<wG(BD)&&b>=16-hB(HG))o=aBG;else if(BD&&a>=16-wD(BG)&&b>=16-hB(HD))o=aBD;
      if(o!==null)own[(y*TS+b)*PW+x*TS+a]=o+2; // 1 = pièce inconnue, 0 = rien
    }
  }
  const cache={},teinte=(o,k)=>{const q=o+'/'+k;if(cache[q])return cache[q];const A=W.areas[o-2],ti=hx(A?A.tint:c.set.tint),pierre=[176,168,184],base=toHex(ti.map((v,i)=>v*.5+pierre[i]*.5));return cache[q]=hx(tone(base,k))},NOIR=hx('#0b0a14');
  const[kk,gg]=cv(PW,PH),img=gg.createImageData(PW,PH),px=img.data;
  const vide=(X,Y)=>X>=0&&Y>=0&&X<PW&&Y<PH&&t[Y>>4][X>>4]===0&&!own[Y*PW+X];
  const sol=(X,Y)=>X>=0&&Y>=0&&X<PW&&Y<PH&&t[Y>>4][X>>4]!==0;
  for(let Y=0;Y<PH;Y++)for(let X=0;X<PW;X++){
    const o=own[Y*PW+X];if(!o)continue;
    let col;
    if(vide(X-1,Y)||vide(X+1,Y)||vide(X,Y-1)||vide(X,Y+1))col=NOIR;
    else if(sol(X-1,Y)||sol(X+1,Y)||sol(X,Y-1)||sol(X,Y+1))col=teinte(o,-.58);
    else{
      const n=[own[Y*PW+X-1],own[Y*PW+X+1],own[(Y-1)*PW+X],own[(Y+1)*PW+X]];
      if(n.some(v=>v&&v!==o))col=teinte(o,-.48);
      else if(vide(X-2,Y)||vide(X,Y-2))col=teinte(o,.1);
      else col=teinte(o,(((X>>1)*7+(Y>>1)*13)%5===0)?-.2:-.12);
    }
    const p=(Y*PW+X)*4;px[p]=col[0];px[p+1]=col[1];px[p+2]=col[2];px[p+3]=255;
  }
  gg.putImageData(img,0,0);g.drawImage(kk,0,0);
}

// ——— Le calepin : on tourne la page comme on corne une feuille ———
// Le coin du bas se soulève et se replie : on voit l'envers du papier, son ombre sur la page,
// puis le pli balaie toute la feuille et découvre la page suivante. En arrière, la feuille revient se poser.
const ORDRE_ONGLETS=['fin','notes','temoins','deduc','gens','objets','papiers'];
function tournePage(vieux,avance,defil){
  if(document.body.classList.contains('calme')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const neuf=$('carnet').querySelector('.feuille');if(!neuf||!vieux)return;
  const livret=neuf.parentElement,X0=neuf.offsetLeft,Y0=neuf.offsetTop,Wp=neuf.offsetWidth,Hp=neuf.offsetHeight;
  if(Wp<40||Hp<40)return;
  Object.assign(vieux.style,{left:X0+'px',top:Y0+'px',width:Wp+'px',height:Hp+'px'});
  vieux.classList.add('page-vole');vieux.setAttribute('aria-hidden','true');vieux.querySelectorAll('button,textarea,input').forEach(b=>b.tabIndex=-1);
  // la feuille qui se plie : l'ancienne quand on avance, la nouvelle quand on revient en arrière
  const pli=avance?vieux:neuf;
  if(avance){vieux.style.zIndex=1;livret.appendChild(vieux)}else{vieux.style.zIndex=0;livret.insertBefore(vieux,neuf);neuf.style.zIndex=1}
  const k0=vieux.querySelector('.corps');if(k0)k0.scrollTop=defil||0;
  // une toile au-dessus, assez grande pour le rabat qui sort de la feuille
  const mx=Wp*1.15,my=Hp*.55,CW=Wp+mx+Wp*.08,CH=Hp+my+Hp*.12,dpr=Math.min(2,window.devicePixelRatio||1),k=document.createElement('canvas');
  k.className='pli-page';Object.assign(k.style,{left:(X0-mx)+'px',top:(Y0-my)+'px',width:CW+'px',height:CH+'px'});k.width=Math.round(CW*dpr);k.height=Math.round(CH*dpr);livret.appendChild(k);
  const g=k.getContext('2d'),D=Math.hypot(Wp,Hp),C=[Wp,Hp],FIN=[-D*1.1,Hp*.15],RECT=[[0,0],[Wp,0],[Wp,Hp],[0,Hp]];
  // garde la partie d'un polygone d'un côté d'une droite (passant par M, de normale n)
  const coupe=(l,M,n,cote)=>{const s=p=>((p[0]-M[0])*n[0]+(p[1]-M[1])*n[1])*cote,o=[];
    for(let i=0;i<l.length;i++){const a=l[i],b=l[(i+1)%l.length],sa=s(a),sb=s(b);if(sa>=0)o.push(a);if((sa>=0)!==(sb>=0)){const t=sa/(sa-sb);o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}return o};
  const trace=l=>{g.beginPath();l.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath()};
  const dessine=t=>{
    const e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,k.width,k.height);g.setTransform(dpr,0,0,dpr,mx*dpr,my*dpr);
    const P=[C[0]+(FIN[0]-C[0])*e,C[1]+(FIN[1]-C[1])*e-Math.sin(Math.PI*e)*Hp*.2],dx=C[0]-P[0],dy=C[1]-P[1],L=Math.hypot(dx,dy);
    if(L<1){pli.style.clipPath='';return}
    const n=[dx/L,dy/L],M=[(C[0]+P[0])/2,(C[1]+P[1])/2];
    const reste=coupe(RECT,M,n,-1),decouvert=coupe(RECT,M,n,1),rabat=decouvert.map(([x,y])=>{const d=(x-M[0])*n[0]+(y-M[1])*n[1];return[x-2*d*n[0],y-2*d*n[1]]});
    pli.style.clipPath=reste.length>2?`polygon(${reste.map(([x,y])=>x.toFixed(1)+'px '+y.toFixed(1)+'px').join(',')})`:'polygon(0 0,0 0,0 0)';
    const deg=(a,b,stops)=>{const q=g.createLinearGradient(a[0],a[1],b[0],b[1]);stops.forEach(([o,c])=>q.addColorStop(o,c));return q};
    // la page découverte : une ombre douce sous la feuille soulevée
    if(decouvert.length>2){trace(decouvert);g.fillStyle=deg(M,[M[0]+n[0]*80,M[1]+n[1]*80],[[0,'rgba(40,25,5,.34)'],[1,'rgba(40,25,5,0)']]);g.fill()}
    // la feuille encore à plat s'assombrit un peu en approchant du pli
    if(reste.length>2){trace(reste);g.fillStyle=deg(M,[M[0]-n[0]*46,M[1]-n[1]*46],[[0,'rgba(70,48,14,.22)'],[1,'rgba(70,48,14,0)']]);g.fill()}
    // le rabat : l'envers du papier, son ombre portée, plus sombre au creux du pli
    if(rabat.length>2){
      const loin=rabat.reduce((m,p)=>Math.max(m,-((p[0]-M[0])*n[0]+(p[1]-M[1])*n[1])),1),bout=[M[0]-n[0]*loin,M[1]-n[1]*loin];
      g.save();g.shadowColor='rgba(30,20,5,.42)';g.shadowBlur=18;g.shadowOffsetX=-n[0]*7;g.shadowOffsetY=-n[1]*7+3;trace(rabat);g.fillStyle='#e4d6b0';g.fill();g.restore();
      trace(rabat);g.fillStyle=deg(M,bout,[[0,'rgba(110,85,40,.5)'],[.12,'rgba(150,120,70,.22)'],[.45,'rgba(255,250,232,.18)'],[1,'rgba(236,224,192,.4)']]);g.fill();
      // les lignes du cahier, vues par transparence à l'envers
      g.save();trace(rabat);g.clip();g.strokeStyle='rgba(70,90,150,.09)';g.lineWidth=1;
      g.beginPath();for(let y=28;y<Hp;y+=28){const a=[0,y],b=[Wp,y],r=p=>{const d=(p[0]-M[0])*n[0]+(p[1]-M[1])*n[1];return[p[0]-2*d*n[0],p[1]-2*d*n[1]]},A=r(a),B=r(b);g.moveTo(A[0],A[1]);g.lineTo(B[0],B[1])}g.stroke();g.restore();
      trace(rabat);g.strokeStyle='rgba(90,66,26,.4)';g.lineWidth=1;g.stroke();
    }
    k.style.opacity=e>.88?Math.max(0,(1-e)/.12):1;
  };
  const DUR=640,T0=performance.now();let fini=false;
  const fin=()=>{if(fini)return;fini=true;k.remove();vieux.remove();neuf.style.clipPath='';neuf.style.zIndex=''};
  const pas=now=>{if(fini)return;let t=Math.min(1,(now-T0)/DUR);dessine(avance?t:1-t);if(t<1)requestAnimationFrame(pas);else fin()};
  tournePage.essai={dessine,fin,pli,k};// pour les tests
  dessine(avance?0:1);requestAnimationFrame(pas);setTimeout(fin,DUR+500);
}

// ——— Le rouage des options : un engrenage en laiton, biseauté, à rayons ———
function rouage(Z,dents,col,rayons=5){
  const[k,g]=cv(Z,Z),c0=Z/2-.5,Rr=Z/2-1.5,plein=new Uint8Array(Z*Z),zone=new Float32Array(Z*Z);
  for(let y=0;y<Z;y++)for(let x=0;x<Z;x++){
    const dx=x-c0,dy=y-c0,d=Math.hypot(dx,dy)/Rr,a=Math.atan2(dy,dx);
    const ph=Math.abs(((a/(2*Math.PI)*dents)%1+1)%1-.5),pr=Math.abs(((a/(2*Math.PI)*rayons+.5)%1+1)%1-.5);
    let p=0;
    if(d<=1&&d>.8){if(ph<.3-(d-.8)/.2*.12)p=1}            // dents en trapèze
    else if(d<=.8&&d>.56)p=2;                                 // jante
    else if(d<=.56&&d>.3){if(pr<.15+(.56-d)*.35)p=3}          // rayons, plus larges vers le moyeu
    else if(d<=.3&&d>.11)p=4;                                // moyeu
    else if(d<=.11)p=5;                                      // axe
    plein[y*Z+x]=p;zone[y*Z+x]=d;
  }
  const vide=(x,y)=>x<0||y<0||x>=Z||y>=Z||!plein[y*Z+x];
  for(let y=0;y<Z;y++)for(let x=0;x<Z;x++){
    const p=plein[y*Z+x];if(!p)continue;const d=zone[y*Z+x],dx=x-c0,dy=y-c0;
    let t=(-dx-dy)/Rr*.22;
    if(p===5){R(g,d<.06?'#1a1208':tone('#3a2a14',(-dx-dy)/Rr*.8),x,y);continue}
    if(p===4)t+=.1-(Math.abs(d-.2)<.03?.28:0);
    if(p===2&&Math.abs(d-.68)<.025)t-=.12;
    if(p===3)t-=.04;
    // biseau : clair du côté de la lumière, sombre de l'autre
    if(vide(x-1,y-1)||vide(x-1,y)&&vide(x,y-1))t+=.3;else if(vide(x+1,y+1)||vide(x+1,y)&&vide(x,y+1))t-=.32;
    if((p===2)&&noise(x,y,11)>.93)t+=.08;
    R(g,tone(col,t),x,y);
  }
  // petits rivets sur la jante
  for(let i=0;i<rayons;i++){const a=(i+.5)/rayons*2*Math.PI,x=Math.round(c0+Math.cos(a)*Rr*.68),y=Math.round(c0+Math.sin(a)*Rr*.68);R(g,tone(col,-.45),x,y);R(g,tone(col,.45),x-1,y-1)}
  return outlineSprite(k);
}

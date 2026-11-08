// Troisième planche : portes, engrenage et marteau de juge.
const STYLE_PORTE={bois:['#4a2e1c','#8a5a34'],hotel:['#3a2418','#6a3424'],double:['#4a2e1c','#7a4c2a'],cuisine:['#6a7480','#a8b4ba'],bain:['#8a9494','#dfe4dc'],metal:['#3a424c','#5f6a78'],
  verre:['#6a747e','#8fc4d8'],train:['#2f2030','#6a2f34'],theatre:['#3a1018','#7a1f2c'],loge:['#3a1018','#7a1f2c'],clinique:['#9aa6a6','#e4ecec'],entree:['#2e1c12','#5a3a22']};
// Bois ou peinture : un léger veinage vertical, jamais de pixels isolés criards
function vantail(g,x,y,w,h,col,s){
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const v=noise(x+i,(y+j)>>3,s)-.5,b=i===0?.14:i===w-1?-.18:0;
    R(g,tone(col,v*.1+b),x+i,y+j);
  }
}
// Panneau moulé : creux ombré en haut à gauche, biseau clair en bas à droite
function moulure(g,x,y,w,h,col){
  R(g,tone(col,-.36),x,y,w,1);R(g,tone(col,-.36),x,y,1,h);
  R(g,tone(col,.2),x,y+h-1,w,1);R(g,tone(col,.2),x+w-1,y,1,h);
  R(g,tone(col,-.14),x+1,y+1,w-2,1);R(g,tone(col,-.14),x+1,y+1,1,h-2);
  R(g,tone(col,.07),x+2,y+2,w-3,h-3);
}
function poignee(g,x,y){R(g,'#7a5a20',x,y,3,4);R(g,'#e0c060',x,y,2,3);R(g,'#fff0b8',x,y,1,1)}
function chiffres(g,num,x,y,col){
  String(num).split('').forEach((n,i)=>{
    const X=x+i*4,d=+n,P=(a,b,w=1,h=1)=>R(g,col,X+a,y+b,w,h);
    if(d===1){P(1,0,1,5);return}
    P(0,0,3);P(0,4,3);if(d!==7)P(0,2,3);P(2,0,1,5);if(![1,2,3,7].includes(d))P(0,0,1,3);if([0,2,6,8].includes(d))P(0,2,1,3);
  });
}
function doorArt(style,open,col,num){
  const[k,g]=cv(32,32),[cad,bat]=STYLE_PORTE[style]||STYLE_PORTE.bois;
  // Chambranle : deux montants et un linteau, éclairés par le haut
  R(g,tone(cad,-.5),2,0,28,32);R(g,tone(cad,.05),2,0,28,3);R(g,tone(cad,.28),2,0,28,1);
  R(g,tone(cad,.05),2,0,3,32);R(g,tone(cad,.05),27,0,3,32);R(g,tone(cad,.25),2,0,1,32);R(g,tone(cad,-.3),29,0,1,32);
  if(open){
    // L'embrasure reste sombre : on ne voit jamais ce qu'il y a derrière
    for(let j=0;j<29;j++)R(g,tone('#14121f',j*.004),5,3+j,22,1);
    vantail(g,5,3,5,29,tone(bat,-.12),5);R(g,tone(bat,-.5),10,3,1,29);
    return k;
  }
  vantail(g,5,3,22,29,bat,style.length);
  const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h);
  if(style==='bois'){moulure(g,8,6,16,9,bat);moulure(g,8,18,16,11,bat);poignee(g,23,17)}
  if(style==='hotel'){moulure(g,8,6,16,23,bat);box(g,11,9,10,7,'#c8a040');chiffres(g,num||'',num&&String(num).length>1?12:14,10,'#3a2416');poignee(g,23,18);P('#2a1a14',15,19,2,2)}
  if(style==='double'){P(tone(bat,-.5),15,3,2,29);moulure(g,7,6,7,9,bat);moulure(g,18,6,7,9,bat);moulure(g,7,18,7,11,bat);moulure(g,18,18,7,11,bat);poignee(g,12,17);poignee(g,18,17)}
  if(style==='cuisine'){for(let y=-5;y<=5;y++)for(let a=-5;a<=5;a++){const d=a*a+y*y;if(d<=28)P(d>17?'#5a636e':tone('#a8d8e8',(-a-y)*.03),15+a,12+y)}P('#c8d0d8',5,24,22,8);P('#e8eef0',5,24,22,1)}
  if(style==='bain'){moulure(g,8,18,16,11,bat);box(g,8,6,16,10,'#b8d0d8');R(g,'#d8ecf0',10,8,12,1);P(tone('#b8d0d8',.2),10,10,8,1);poignee(g,23,17)}
  if(style==='metal'){moulure(g,7,5,18,25,bat);box(g,11,8,10,8,'#22304e');P('#6a8ab8',13,10,4,1);for(let i=0;i<4;i++){P('#8a939e',8+i*5,6);P('#8a939e',8+i*5,28)}P('#c8d0d8',22,18,2,6)}
  if(style==='verre'){for(let j=0;j<29;j++)R(g,tone(bat,-j*.006),5,3+j,22,1);for(let i=0;i<9;i++)P('#d8f0f8',8+i*2,22-i*2,2,1);P(tone(cad,.1),15,3,2,29);P('#d8dce0',12,15,2,8);P('#d8dce0',18,15,2,8)}
  if(style==='train'){box(g,9,6,14,10,'#22304e');P('#6a7aa8',11,8,5,1);moulure(g,8,19,16,10,bat);P('#c8c0a8',23,17,2,4)}
  if(style==='theatre'||style==='loge'){for(let y=0;y<4;y++)for(let x=0;x<4;x++){const a=7+x*6+(y&1)*2,b=6+y*6;P(tone(bat,.14),a,b,4,4);P(tone(bat,-.3),a+4,b+4,1,1);P('#d8b35c',a+1,b+1)}if(style==='loge'){box(g,11,9,10,8,'#d8b35c');P('#7a1f2c',15,10,2,6);P('#7a1f2c',13,12,6,2)}poignee(g,23,18)}
  if(style==='clinique'){box(g,10,6,12,9,'#a8d8e8');P('#ffffff',12,8,3,1);moulure(g,8,18,16,11,bat);P('#8a939e',23,17,2,5)}
  if(style==='entree'){P(tone(bat,-.5),15,3,2,29);box(g,7,5,7,7,'#22304e');box(g,18,5,7,7,'#22304e');P('#6a7aa8',8,6,3,1);P('#6a7aa8',19,6,3,1);moulure(g,7,14,7,15,bat);moulure(g,18,14,7,15,bat);P('#e0c060',12,15,2,6);P('#e0c060',18,15,2,6);P('#3a424c',4,21,24,3);P('#a8b0ba',4,21,24,1);P('#c8a040',13,20,6,6);P('#141226',15,22,2,2)}
  if(col){box(g,12,14,8,11,col);P('#141226',15,18,2,3);P(tone(col,.5),13,15,2,1)}
  return k;
}
// Porte vue de dessus, dans l'épaisseur du mur : deux montants, un seuil et son battant
function porteDessus(v,style,open,col){
  const L=32,E=16,[k,g]=v?cv(E,L):cv(L,E),[cad0,bat]=STYLE_PORTE[style]||STYLE_PORTE.bois,cad=tone(cad0,.16);
  const P=(c,a,b,l=1,e=1)=>v?R(g,c,b,a,e,l):R(g,c,a,b,l,e);
  if(v&&open){
    [0,L-4].forEach(a=>{P(cad,a,0,4,E);P(tone(cad,.34),a,0,4,1);P(tone(cad,.18),a,0,1,E);P(tone(cad,-.36),a+3,0,1,E);P(tone(cad,-.46),a,E-1,4,1)});
    P('rgba(14,10,24,.32)',4,0,L-8,2);P('rgba(14,10,24,.32)',4,E-2,L-8,2);
    P(tone('#c8a060',.05),4,7,L-8,1);P(tone('#8a6a3a',-.15),4,8,L-8,1);
    [3,L-5].forEach(a=>P('#e0c060',a,E>>1,2,1));
    return k;
  }
  // Seuil en planches, visible quand la porte est ouverte
  for(let a=0;a<L;a++)for(let b=0;b<E;b++)P(tone('#5e4630',(noise(a>>1,b>>2,3)-.5)*.18+(b%5===0?-.2:0)),a,b);
  P(tone('#c8a060',-.1),4,1,L-8,1);P(tone('#c8a060',-.3),4,E-2,L-8,1);
  // Montants et traverses du chambranle
  [0,L-4].forEach(a=>{P(cad,a,0,4,E);P(tone(cad,.34),a,0,4,1);P(tone(cad,.18),a,0,1,E);P(tone(cad,-.36),a+3,0,1,E);P(tone(cad,-.46),a,E-1,4,1)});
  if(open){
    // Battant rabattu contre son montant
    for(let a=4;a<8;a++)for(let b=1;b<E-1;b++)P(tone(bat,(noise(a,b>>2,9)-.5)*.1),a,b);
    P(tone(bat,.3),4,1,1,E-2);P(tone(bat,-.46),7,1,1,E-2);P(tone(bat,.22),4,1,4,1);P('#e0c060',6,E>>1,1,2);
    return k;
  }
  // Battant fermé, avec ses panneaux moulurés
  for(let a=4;a<L-4;a++)for(let b=1;b<E-1;b++)P(tone(bat,(noise(a>>2,b,9)-.5)*.1),a,b);
  P(tone(bat,.32),4,1,L-8,1);P(tone(bat,.16),4,2,L-8,1);P(tone(bat,-.44),4,E-2,L-8,1);P(tone(bat,-.2),4,E-3,L-8,1);
  [6,17].forEach(a=>{
    P(tone(bat,-.34),a,4,9,1);P(tone(bat,-.34),a,4,1,8);P(tone(bat,.24),a,11,9,1);P(tone(bat,.24),a+8,4,1,8);
    P(tone(bat,.08),a+2,6,5,4);P(tone(bat,.2),a+2,6,5,1);
  });
  P('#7a5a20',26,6,2,5);P('#e0c060',26,6,1,4);P('#fff0b8',26,6,1,1);
  if(col){P(tone(col,-.4),13,4,6,8);P(col,13,4,5,7);P(tone(col,.5),13,4,5,1);P('#141226',15,6,2,2);P('#141226',15.5,8,1,2)}
  return k;
}
const doorTopArt=(s,o,c)=>porteDessus(false,s,o,c),doorVArt=(s,o,c)=>porteDessus(true,s,o,c);
// Paillasson devant chaque passage
function paillasson(g,x,y,w,h){
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const e=Math.min(i,j,w-1-i,h-1-j);
    R(g,e<1?'#3a2a1a':e<2?'#94744a':tone('#6e5434',(noise(x+i,y+j,6)-.5)*.34+((i+j)%4===0?-.1:0)),x+i,y+j);
  }
}
// Une belle roue dentée, ombrée comme une pièce de laiton
function gearSprite(Z,dents,col){
  const[k,g]=cv(Z,Z),c0=Z/2-.5,Rr=Z/2-1;
  for(let y=0;y<Z;y++)for(let x=0;x<Z;x++){
    const dx=x-c0,dy=y-c0,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx),dent=Math.cos(a*dents)>.02;
    if(d>=(dent?Rr:Rr*.78)||d<=Rr*.24)continue;
    let t=(-dx-dy)/Rr*.26;
    if(d<Rr*.44)t-=.2;else if(d<Rr*.52)t+=.16;
    if(Math.abs(Math.sin(a*3))<.09&&d>Rr*.44&&d<Rr*.7)t-=.24;
    R(g,tone(col,t),x,y);
  }
  return outlineSprite(k);
}
// Marteau de juge, d'après le modèle : tête évasée, bande dorée, manche en biais, socle rond.
// Chaque angle est recalculé pixel par pixel, pour rester net et garder son éclairage en tournant.
const BOIS=['#3f1c10','#5f2c16','#80401f','#a85f30','#cf8a52'],OR_V=['#a8620e','#dc8e14','#f8b420','#ffd860'];
const teinte=(r,v)=>r[Math.max(0,Math.min(r.length-1,Math.round(v*(r.length-1))))];
function gavelFrame(deg,choc){
  const W0=80,H0=68,[k,g]=cv(W0,H0),[m,h]=cv(W0,H0),a=deg*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),px=10,py=60,L=37;
  // Socle : disque plat à bandes, légèrement écrasé au moment du choc
  const[s0,s1]=cv(W0,H0),cx=50,haut=46+(choc===1?1:0),bandes=[.9,.72,.55,.2,.62,.45,.18,.78,.6,.4,.2];
  bandes.forEach((b,j)=>{
    const hw=j<3?13+j*1.7:j<6?17:20;
    for(let x=-hw;x<=hw;x++)R(s1,teinte(BOIS,b+.22*(-x/hw)),cx+x,haut+j);
  });
  outlineSprite(s0);g.drawImage(s0,0,0);
  // Tête et manche, éclairés depuis le haut à gauche quel que soit l'angle
  const lum=(nx,ny)=>.52+.46*(nx*-.55+ny*.83);
  for(let y=0;y<H0;y++)for(let x=0;x<W0;x++){
    const dx=x-px,dy=py-y,u=dx*ca+dy*sa,v=-dx*sa+dy*ca,av=Math.abs(v),du=u-L;
    let col=null;
    const T=av>13.6?0:av<4.5?7:av<6?6.2:av<10.5?7.6:av<12?8.8:7.8;
    if(T&&Math.abs(du)<=T){
      const ns=du/T;let l=lum(ca*ns,sa*ns);
      if(av>=4.5&&av<6)l-=.34;else if(av>=10.5&&av<12)l+=.12;else if(av>=12)l-=.1;
      col=teinte(av<4.5?OR_V:BOIS,l);
    }else if(u>=L-9.5&&u<=L-7.5&&av<=3){
      col=teinte(BOIS,lum(-sa*v/3,ca*v/3)-.12);
    }else if(u>=-4&&u<0&&av<=3-(u<-3?1:0)){
      col=teinte(BOIS,lum(-sa*v/3,ca*v/3)+.04);
    }else if(u>=0&&u<L-7.5&&av<=2){
      col=teinte(BOIS,lum(-sa*v/2,ca*v/2)+.1);
    }
    if(col)R(h,col,x,y);
  }
  outlineSprite(m);g.drawImage(m,0,0);
  // Éclats au point d'impact
  if(choc===1)[[-13,-5],[-9,-9],[17,-7],[21,-3],[5,-11]].forEach(([a0,b0])=>{R(g,'#ffd860',cx-3+a0,haut+b0,2,2);R(g,'#ffffff',cx-3+a0,haut+b0,1,1)});
  return k;
}

// ——— Feu de cheminée : une grille de chaleur qui monte et se refroidit ———
const FEU={w:26,h:23};
function feuInit(){
  const{w,h}=FEU,[k,g]=cv(w,h);FEU.k=k;FEU.g=g;FEU.im=g.createImageData(w,h);FEU.t=new Float32Array(w*h);
  const st=[[0,0,0,0],[70,10,8,0],[120,20,10,200],[178,40,12,255],[222,76,18,255],[244,124,24,255],[252,176,44,255],[255,220,100,255],[255,244,184,255],[255,255,236,255]];
  FEU.pal=[];for(let i=0;i<=45;i++){const t=i/45*(st.length-1),a=Math.floor(t),b=Math.min(st.length-1,a+1),f=t-a;FEU.pal.push(st[a].map((v,j)=>Math.round(v+(st[b][j]-v)*f)))}
  // Bûches et chenets, devant les flammes
  const[b,q]=cv(26,9);[[2,5,22,'#3e2616'],[5,2,17,'#54341e']].forEach(([x,y,l,c])=>{R(q,c,x,y,l,3);R(q,tone(c,.3),x,y,l,1);R(q,'#1c0e08',x,y+2,l,1);R(q,'#e87a2a',x+3,y+2,5,1);R(q,'#ffb04a',x+l-6,y+2,3,1);R(q,'#a8804e',x+l-1,y,1,3)});
  [[1],[23]].forEach(([x])=>{R(q,'#22222a',x,1,2,8);R(q,'#5a5a68',x,1,1,8);R(q,'#22222a',x-1,8,4,1)});FEU.bu=b;
  // Lueur sur le sol, en pointillés pour rester dans le style
  const[l,m]=cv(150,84);for(let j=0;j<84;j++)for(let i=0;i<150;i++){const d=Math.hypot((i-75)/75,j/84);if(d<1&&bay(i,j)<(1-d)*.62)R(m,'#ff8a2a',i,j)}FEU.lu=l;
}
function feuPas(){
  if(!FEU.k)feuInit();
  const{w,h,t,pal,im,g}=FEU,a=im.data;
  for(let x=0;x<w;x++){const e=Math.abs(x-(w-1)/2)/(w/2);t[(h-1)*w+x]=e>.92?0:(32+Math.random()*13)*(1-e*e*.55)}
  for(let y=0;y<h-1;y++)for(let x=0;x<w;x++){
    const X=Math.max(0,Math.min(w-1,x+Math.floor(Math.random()*3)-1));
    t[y*w+X]=Math.max(0,t[(y+1)*w+x]-Math.random()*4.4);
  }
  for(let i=0;i<w*h;i++){const c=pal[Math.min(45,t[i]|0)];a[i*4]=c[0];a[i*4+1]=c[1];a[i*4+2]=c[2];a[i*4+3]=c[3]}
  g.putImageData(im,0,0);
}
function feuDessine(ctx,x,y,tk){
  if(!FEU.k)feuPas();
  ctx.drawImage(FEU.k,x+12,y+19);ctx.drawImage(FEU.bu,x+12,y+34);
  // Les bougies tremblent aussi
  [7,41].forEach((a,i)=>{const b=((tk>>3)+i)%3;ctx.fillStyle='#ffb04a';ctx.fillRect(x+a,y-1-(b>1?1:0),2,2);ctx.fillStyle='#fff4c0';ctx.fillRect(x+a+(b%2),y,1,1)});
  const f=.34+.16*Math.sin(tk*.23)*Math.sin(tk*.11)+Math.random()*.06,o=ctx.globalCompositeOperation;
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=f;ctx.drawImage(FEU.lu,x+24-75,y+44);ctx.globalAlpha=1;ctx.globalCompositeOperation=o;
}

// La silhouette à la craie, allongée sur deux carreaux
function traceCraie(){
  const[k,g]=cv(32,16),c='#f4f0e4',T=(x0,y0,x1,y1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);if(noise(x,y,8)>.1)R(g,c,x,y)}};
  ellipseP(g,10,8,5,3,'rgba(120,20,30,.55)');ellipseP(g,7,9,3,2,'rgba(120,20,30,.45)');
  for(let a=0;a<6.28;a+=.2)R(g,c,Math.round(5+Math.cos(a)*3.6),Math.round(7+Math.sin(a)*3.6));
  [[9,6],[12,5],[14,1],[18,0],[18,2],[15,5],[21,6],[26,3],[31,2],[31,4],[26,7],[22,8],[27,10],[31,13],[30,15],[25,12],[20,10],[15,10],[13,13],[9,15],[8,13],[11,10],[9,9]].reduce((p,q)=>{T(p[0],p[1],q[0],q[1]);return q});
  return outlineSprite(k,'rgba(26,20,36,.5)');
}

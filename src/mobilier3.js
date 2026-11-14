// Meubles vus sous d'autres angles (canapé de côté, lit en travers, table en long) et nouveaux meubles
// pour l'éditeur : aquarium, coffre-fort, billard, paravent, gramophone, vaisselier, buste, cage, juke-box,
// télévision, harpe. Même lumière que le reste : en haut à gauche.
const TISSUS3=['#7a2f35','#2e4a78','#3d6a4a','#6a4a7a','#8a6a3a','#5a5a62'];
const coussinV=(g,x,y,w,h,c0)=>{R(g,tone(c0,-.3),x,y+h-1,w,1);R(g,c0,x,y,w,h-1);R(g,tone(c0,.22),x+1,y+1,w-2,1);R(g,tone(c0,-.15),x+w-1,y+1,1,h-2)};
// Canapé vu de côté : le dossier d'un côté, les accoudoirs aux deux bouts, trois coussins l'un derrière l'autre
function canapeCote(g,v,dos){
  const c0=TISSUS3[v%TISSUS3.length],xd=dos==='g'?0:11,xs=dos==='g'?6:1;
  R(g,tone(c0,-.35),1,8,15,52);
  for(let i=0;i<3;i++)coussinV(g,xs,12+i*15,9,14,c0);
  R(g,tone(c0,-.1),xd,4,5,54);R(g,tone(c0,.2),xd,4,5,2);R(g,tone(c0,-.3),xd+(dos==='g'?4:0),6,1,52);
  [3,52].forEach(y=>{R(g,tone(c0,-.05),1,y,15,7);R(g,tone(c0,.25),1,y,15,2)});
  R(g,'#2a1a10',2,58,2,3);R(g,'#2a1a10',13,58,2,3);
}
// Lit en travers : la tête à gauche ou à droite, les draps vers l'autre bout
function litTravers(g,v,tete){
  const bois=BOIS_M[v%4],drap=['#f4ecd8','#e8eef4','#f0e0e0'][v%3],couv=TISSUS3[(v>>2)%TISSUS3.length],xt=tete==='g'?0:40,dir=tete==='g'?1:-1;
  caisse(g,0,8,48,34,4,bois,v);
  R(g,drap,2,12,44,22);
  for(let x=0;x<30;x++){const X=tete==='g'?16+x:2+x;R(g,tone(couv,(x%6===0?-.12:0)),X,14,1,20);if(x===0||x===29)R(g,tone(couv,.25),X,14,1,20)}
  const xo=tete==='g'?4:33;R(g,'#fffaf0',xo,14,11,8);R(g,'#fffaf0',xo,24,11,8);R(g,'#d8d0c0',xo,21,11,1);R(g,'#d8d0c0',xo,31,11,1);
  R(g,tone(bois,-.2),xt,0,8,40);R(g,tone(bois,.18),xt,0,8,2);R(g,tone(bois,-.4),xt+(dir>0?7:0),2,1,38);panneau(g,xt+1,4,6,14,bois);
}
Object.assign(SPR,{
  sofaL(g,v){canapeCote(g,v,'g')},
  sofaR(g,v){canapeCote(g,v,'d')},
  bedL(g,v){litTravers(g,v,'g')},
  bedR(g,v){litTravers(g,v,'d')},
  // Table en long : plateau vertical, pieds aux quatre coins, une nappe selon l'aspect
  tableL(g,v){
    const b=BOIS_M[v%4];
    caisse(g,2,12,28,48,40,b,v);R(g,tone(b,-.4),2,52,28,2);
    if(v%3===0){R(g,'#f4ecd8',6,14,20,34);R(g,'#e0d4bc',6,46,20,2);for(let y=16;y<46;y+=6)R(g,'#e8dcc4',6,y,20,1)}
    [[4,54],[26,54]].forEach(([x,y])=>pied(g,x,y,8,tone(b,-.2)));
    if(v%2){disque(g,16,22,3,'#f4f0e8');disque(g,16,40,3,'#f4f0e8');R(g,'#c8a040',15,29,2,5)}
  },
  aquarium(g,v){
    caisse(g,0,26,32,14,3,'#3a2a20',v);
    R(g,'#c8d0d8',1,4,30,22);R(g,'#2a6a9a',2,6,28,19);R(g,'#3a8ac0',2,6,28,3);
    for(let x=2;x<30;x++){const h=2+((x*7+v)%5);R(g,'#c8b078',x,25-h+h,1,1)}R(g,'#c8b078',2,23,28,2);
    [[6,'#3a9a4a'],[24,'#2a7a3a']].forEach(([x,c0])=>{for(let y=12;y<23;y++)R(g,c0,x+Math.round(Math.sin(y*.7)),y,2,1)});
    [[12,12,'#f08a2a'],[19,17,'#ffd23f'],[9,18,'#e84a6a']].forEach(([x,y,c0])=>{R(g,c0,x,y,4,2);R(g,c0,x+(v%2?4:-1),y,1,2);R(g,'#1a1a1a',x+(v%2?0:3),y,1,1)});
    [[15,9],[16,13],[22,10]].forEach(([x,y])=>R(g,'#c8e8ff',x,y,1,1));R(g,'rgba(255,255,255,.35)',3,7,2,16);
    R(g,'#2a2a2a',0,3,32,2);
  },
  coffrefort(g,v){
    caisse(g,1,6,14,20,3,'#3a4048',v,'#5a626a');R(g,'#2a3036',3,11,10,12);R(g,'#4a525a',3,11,10,1);
    disque(g,8,16,3,'#8a939e');disque(g,8,16,1,'#2a2a2a');R(g,'#c8d0d8',7,13,1,1);R(g,'#c8a040',11,19,2,3);R(g,'#c8a040',4,22,8,1);
  },
  billard(g,v){
    const b=BOIS_M[v%4];
    caisse(g,0,8,48,30,22,b,v);R(g,'#2e7a3e',3,10,42,18);R(g,'#3a8a4a',3,10,42,2);
    [[3,10],[23,10],[43,10],[3,26],[23,26],[43,26]].forEach(([x,y])=>R(g,'#1a1a1a',x,y,2,2));
    [[12,18,'#f4f0e8'],[30,15,'#e8c020'],[33,17,'#c83a2a'],[31,19,'#2a4a9a'],[35,15,'#1a1a1a']].forEach(([x,y,c0])=>{R(g,c0,x,y,2,2);R(g,'#ffffff',x,y,1,1)});
    for(let i=0;i<20;i++)R(g,'#d8b878',8+i,22+(i>>2),1,1);
    [[2,36],[22,36],[42,36]].forEach(([x,y])=>pied(g,x,y,4,tone(b,-.2)));
  },
  paravent(g,v){
    const c0=['#7a2f35','#2a3a5a','#2e5a4a'][v%3];
    for(let i=0;i<3;i++){const x=1+i*10;R(g,'#3a2414',x,2,10,38);R(g,tone(c0,i===1?.08:-.05),x+1,3,8,34);
      for(let k=0;k<3;k++){R(g,'#e8c060',x+3+((k*3+i)%4),8+k*9,2,2);R(g,tone('#e8c060',-.2),x+2,12+k*9,6,1)}
      R(g,'#f0d0d8',x+4,6+i*7,2,2);pied(g,x+1,40,4,'#3a2414');pied(g,x+7,40,4,'#3a2414')}
  },
  gramophone(g,v){
    caisse(g,2,18,12,10,3,BOIS_M[v%4],v);R(g,'#1a1a1a',4,16,8,2);
    R(g,'#c8a040',9,8,2,9);for(let i=0;i<9;i++){const w=2+i;R(g,i<2?'#e0b850':'#c8983a',8-i*.6|0,1+i,w,1)}
    R(g,'#f0d070',3,1,6,1);R(g,'#7a5a20',2,9,9,1);pied(g,4,28,4,'#3a2414');pied(g,11,28,4,'#3a2414');
  },
  vaisselier(g,v){
    const b=BOIS_M[v%4];
    caisse(g,0,22,32,20,3,b,v);tiroirF(g,2,26,13,4,b);tiroirF(g,17,26,13,4,b);panneau(g,2,31,13,9,b);panneau(g,17,31,13,9,b);
    R(g,tone(b,-.1),1,0,30,22);R(g,tone(b,.2),1,0,30,2);R(g,tone(b,-.4),3,3,26,18);R(g,tone(b,.1),3,11,26,1);R(g,tone(b,.1),3,20,26,1);
    for(let i=0;i<4;i++){disque(g,7+i*6,7,2,i%2?'#e8eef4':'#f4ecd8');R(g,'#3a6a9a',6+i*6,7,2,1);disque(g,7+i*6,16,2,'#f4ecd8')}
  },
  buste(g,v){
    R(g,'#d8d4cc',3,20,10,20);R(g,'#f0ece4',3,20,3,20);R(g,'#b8b4ac',12,20,1,20);R(g,'#e8e4dc',2,18,12,3);R(g,'#c8c4bc',2,38,12,2);
    const m=['#e8e4dc','#c8a878','#5a5a5a'][v%3];
    ellipseP(g,8,15,6,3,tone(m,-.1));R(g,m,2,14,12,4);R(g,tone(m,.2),3,14,4,1);R(g,m,6,10,4,4);disque(g,8,6,4,m);R(g,tone(m,.25),5,3,2,4);R(g,tone(m,-.25),11,5,1,4);R(g,tone(m,-.35),7,6,1,1);R(g,tone(m,-.35),9,6,1,1);R(g,tone(m,-.2),7,9,3,1);
  },
  cage(g,v){
    pied(g,7,22,18,'#5a4a3a');R(g,'#3a2a1a',4,38,9,2);
    R(g,'#c8a040',7,0,2,3);for(let x=2;x<15;x+=2)R(g,'#c8a040',x,4,1,17);R(g,'#c8a040',2,3,13,2);R(g,'#c8a040',2,20,13,2);
    const p=['#ffd23f','#4ac85a','#4a9aff'][v%3];R(g,p,7,11,4,4);R(g,tone(p,-.2),6,13,2,2);R(g,'#1a1a1a',10,12,1,1);R(g,'#e8a020',11,13,1,1);R(g,'#8a6a3a',4,16,9,1);
  },
  jukebox(g,v){
    R(g,'#5a2a1a',1,6,14,30);R(g,'#8a4a2a',2,7,12,28);for(let i=0;i<7;i++)R(g,['#ff6a4a','#ffd23f','#4ae0ff','#c86aff'][(i+v)%4],1+i*2,2+Math.abs(3-i)*.6|0,2,5);
    R(g,'#2a1a3a',3,10,10,8);R(g,'#ffe08a',4,11,8,1);for(let i=0;i<4;i++)R(g,'#f4ecd8',4,13+i,8,1);R(g,'#c8a040',3,20,10,1);
    for(let i=0;i<5;i++)R(g,i%2?'#ff6a4a':'#4ae0ff',3+i*2,24,1,8);R(g,'#2a1a10',1,36,14,2);
  },
  television(g,v){
    caisse(g,2,20,12,10,2,BOIS_M[v%4],v);pied(g,3,30,4,'#3a2414');pied(g,11,30,4,'#3a2414');
    R(g,'#5a3a22',0,6,16,14);R(g,'#7a5030',0,6,16,2);R(g,'#2a2a30',2,8,9,9);R(g,'#5a8a8a',3,9,7,7);R(g,'rgba(255,255,255,.4)',3,9,2,3);
    disque(g,13,10,1,'#c8a040');disque(g,13,14,1,'#c8a040');R(g,'#8a939e',5,0,1,6);R(g,'#8a939e',10,1,1,5);R(g,'#8a939e',4,0,1,1);R(g,'#8a939e',11,0,1,1);
  },
  harpe(g,v){
    R(g,'#3a2414',2,38,12,3);
    for(let y=4;y<38;y++){const x=2+Math.round((y-4)*.15);R(g,'#c8983a',x,y,2,1)}
    for(let x=4;x<14;x++){const y=4+Math.round(Math.sin((x-4)/10*Math.PI)*-3)+((x-4)>>1);R(g,'#e0b850',x,y,1,2)}
    R(g,'#c8983a',12,8,2,30);R(g,'#f0d070',12,8,1,30);
    for(let i=0;i<5;i++){const x=5+i*1.5|0;R(g,'rgba(244,236,216,.85)',x,8+i*2,1,28-i*3)}
  }
});
Object.assign(SH,{sofaL:58,sofaR:58,bedL:44,bedR:44,tableL:62,aquarium:40,coffrefort:26,billard:40,paravent:44,gramophone:32,vaisselier:42,buste:40,cage:40,jukebox:38,television:34,harpe:42});

// ——— Dix sortes de fenêtres : le paysage reste celui du lieu, seul l'encadrement change ———
const FENETRES=['Rideaux rouges','Hublot','Simple','Rideaux bleus','Volets','Vitrail','Arrondie','Store','Barreaux','Petits carreaux'];
function fenetreType(g,x,y,lv,seed,t){
  t=((t|0)%10+10)%10;
  if(t===1)return hublot(g,x,y,lv,seed);
  const cadre=(col,ep=1)=>{box(g,x+1,y+3,30,20,col);paysage(g,x+3,y+5,26,16,lv,seed)},rebord=(col='#c8a468')=>{R(g,col,x,y+22,32,2);R(g,tone(col,.3),x,y+22,32,1)};
  const rideaux=col=>{[x-2,x+27].forEach((c0,i)=>{for(let j=0;j<22;j++)R(g,tone(col,((j+i)%4===0?.14:0)),c0,y+2+j,6,1);R(g,tone(col,.3),c0+1,y+2,1,22);R(g,tone(col,.3),c0+4,y+2,1,22)});R(g,'#c8a040',x-3,y+1,38,2)};
  if(t===0){cadre('#8a6a44');R(g,'#8a6a44',x+15,y+5,2,16);R(g,'#8a6a44',x+3,y+11,26,1);rebord();rideaux('#7a2f35');return}
  if(t===2){cadre('#d8d4cc');R(g,'#d8d4cc',x+15,y+5,2,16);rebord('#e8e4dc');return}
  if(t===3){cadre('#8a6a44');R(g,'#8a6a44',x+15,y+5,2,16);R(g,'#8a6a44',x+3,y+11,26,1);rebord();rideaux('#2e4a78');return}
  if(t===4){cadre('#e8e4dc');R(g,'#e8e4dc',x+15,y+5,2,16);rebord('#d8d4cc');
    [x-6,x+30].forEach(c0=>{R(g,'#2e6a4a',c0,y+3,8,20);for(let j=0;j<20;j+=3)R(g,'#3e8a5a',c0+1,y+4+j,6,1);R(g,'#1e4a32',c0,y+3,1,20)});return}
  if(t===5){box(g,x+1,y+3,30,20,'#3a3a3a');const cols=['#c83a3a','#3a6ac8','#e8c040','#3aa85a','#8a4ac8'];
    for(let j=0;j<4;j++)for(let i=0;i<5;i++){R(g,cols[(i+j*2+seed)%5],x+3+i*5+1,y+5+j*4+1,4,3);R(g,'rgba(255,255,255,.25)',x+4+i*5,y+6+j*4,1,1)}rebord('#8a8478');return}
  if(t===6){cadre('#8a6a44');for(let i=0;i<14;i++){const h=Math.round(Math.sqrt(196-(i-13.5)**2)*.45);R(g,'#5a4a3a',x+2+i,y+3,1,6-h<0?0:6-h);R(g,'#5a4a3a',x+29-i,y+3,1,6-h<0?0:6-h)}
    R(g,'#8a6a44',x+15,y+3,2,20);R(g,'#8a6a44',x+3,y+13,26,1);rebord();return}
  if(t===7){cadre('#e8e4dc');for(let j=0;j<10;j++){R(g,'#e8dcc0',x+3,y+5+j,26,1);if(j%2)R(g,'#c8bca0',x+3,y+5+j,26,1)}R(g,'#8a8478',x+15,y+5,1,10);rebord('#d8d4cc');return}
  if(t===8){cadre('#5a5a5a');for(let i=0;i<6;i++)R(g,'#3a3a3a',x+5+i*4,y+4,2,19);R(g,'#3a3a3a',x+2,y+9,28,2);R(g,'#3a3a3a',x+2,y+17,28,2);rebord('#8a8478');return}
  if(t===9){cadre('#f0ece4');[x+11,x+20].forEach(c0=>R(g,'#f0ece4',c0,y+5,1,16));[y+10,y+15].forEach(c0=>R(g,'#f0ece4',x+3,c0,26,1));rebord('#e8e4dc');R(g,'rgba(255,255,255,.35)',x+4,y+6,2,4)}
}

// ——— Murs intérieurs et portes posés à l'éditeur ———
// Un mur se raccorde à ses voisins : vu de dessus quand le mur continue vers le bas, avec sa face (papier peint
// et plinthe) au bout de la ligne. Les portes se posent dans ces murs et laissent passer.
const MURS_INT=/^(mur|porte|porteL)$/;
function murVoisin(f,dx,dy){return!!(f&&typeof W!=='undefined'&&W&&W.furn&&W.furn.some(q=>q!==f&&MURS_INT.test(q.name)&&f.x+dx>=q.x&&f.x+dx<q.x+q.w&&f.y+dy>=q.y&&f.y+dy<q.y+q.h))}
function couleursMur(f){
  const A=f&&typeof W!=='undefined'&&W&&W.areas?W.areas[f.room]:null,ti=A?A.tint:'#8a7a68',lamb=(typeof c!=='undefined'&&c&&c.set&&c.set.lamb)||'#6a4a30';
  return{ti,lamb,cap:toHex(hx(ti).map((x,i)=>x*.5+[176,168,184][i]*.5))};
}
Object.assign(SPR,{
  mur(g,v){
    const f=G.fctx,{ti,lamb,cap}=couleursMur(f),L=murVoisin(f,-1,0),Rr=murVoisin(f,1,0),D=murVoisin(f,0,1),xa=L?-1:0,w=(Rr?17:16)-xa,H=30,hc=D?H:8;
    for(let y=0;y<hc;y++)R(g,tone(cap,(y===0&&!D?.14:0)+((y*7+(f?f.x*3:0))%9===0?-.05:0)),xa,y,w,1);
    if(!L)R(g,tone(cap,.12),0,0,1,hc);if(!Rr)R(g,tone(cap,-.28),15,0,1,hc);
    if(D)return;
    R(g,tone(ti,-.4),xa,8,w,1);
    for(let y=9;y<H;y++){const pl=y>=H-6;R(g,pl?tone(lamb,y===H-6?.3:y===H-1?-.4:-.05):tone(ti,((y-9)%6===0?.07:0)-.04),xa,y,w,1)}
    for(let x=0;x<16;x+=6)R(g,tone(ti,-.12),x,10,1,H-17);
  },
  porte(g,v){
    const ks=Object.keys(STYLE_PORTE),st=ks[v%ks.length],{cap}=couleursMur(G.fctx);
    g.drawImage(doorArt(st,true,null,null),0,0,32,29,0,1,32,29);R(g,cap,-1,0,34,3);R(g,tone(cap,.14),-1,0,34,1);
  },
  porteL(g,v){const ks=Object.keys(STYLE_PORTE),st=ks[v%ks.length];g.drawImage(doorVArt(st,true,null),0,0)}
});
Object.assign(SH,{mur:30,porte:30,porteL:32});

// ——— Six décors de plus pour l'éditeur ———
Object.assign(SPR,{
  vase(g,v){
    const c0=['#2e5a9a','#9a2e3a','#2e7a5a','#c8a040'][v%4];
    ellipseP(g,8,20,6,6,'#f0ece4');ellipseP(g,8,20,5,5,'#f8f4ec');R(g,'#f0ece4',5,9,6,4);R(g,'#d8d4cc',5,12,6,1);
    R(g,c0,3,17,10,1);R(g,c0,3,22,10,1);for(let i=0;i<3;i++){const x=5+i*3;R(g,c0,x,19,1,1);R(g,c0,x-1,20,3,1);R(g,c0,x,21,1,1)}R(g,'#ffffff',4,15,1,8);R(g,'#c8c4bc',12,16,1,8);
    [[4,3,'#e8484a'],[8,1,'#ffd23f'],[11,4,'#f08ac0'],[6,6,'#ffffff']].forEach(([x,y,f])=>{R(g,'#3d8a3e',x+1,y+2,1,6);disque(g,x+1,y+1,1,f)});
  },
  livres(g,v){
    const cols=['#a33a3a','#2e6a8c','#3d7a4c','#c29a3a','#6b3d78','#3a3a5c'];
    for(let i=0;i<5;i++){const w=12-((i*3+v)%4),x=2+((i*5+v)%3),y=14-i*3,col=cols[(i+v)%6];R(g,col,x,y,w,3);R(g,tone(col,.3),x,y,w,1);R(g,'#f4ecd8',x+w-1,y+1,1,2);R(g,'#e8c060',x+2,y+1,1,1)}
  },
  statue(g,v){
    const p=['#e8e4dc','#c8c0b0','#8a939e'][v%3];
    R(g,tone(p,-.1),2,34,12,8);R(g,tone(p,.15),2,34,12,2);R(g,tone(p,-.3),2,41,12,1);
    R(g,p,5,14,6,20);R(g,tone(p,.2),5,14,2,20);R(g,tone(p,-.25),10,16,1,18);for(let y=20;y<34;y+=3)R(g,tone(p,-.12),6,y,4,1);
    R(g,p,4,12,8,4);R(g,p,3,13,2,8);R(g,p,11,13,2,6);R(g,p,12,8,2,6);
    disque(g,8,7,3,p);R(g,tone(p,.25),6,5,2,3);R(g,tone(p,-.3),10,6,1,3);
  },
  echelle(g,v){
    const b=BOIS_M[v%4];
    for(let y=0;y<42;y++){R(g,tone(b,.1),2+Math.round(y*.06),y,2,1);R(g,tone(b,-.15),12-Math.round(y*.06),y,2,1)}
    for(let y=6;y<40;y+=8){R(g,tone(b,.2),3,y,10,2);R(g,tone(b,-.3),3,y+2,10,1)}
    R(g,'#8a939e',7,1,2,40);
  },
  poele(g,v){
    R(g,'#2a2a30',7,0,3,14);R(g,'#4a4a52',7,0,1,14);R(g,'#1a1a20',6,12,5,2);
    R(g,'#2a2a30',2,14,12,18);R(g,'#4a4a52',2,14,12,2);R(g,'#1a1a20',2,30,12,2);
    R(g,'#5a2a10',5,19,6,7);R(g,'#ff8a2a',6,21,4,4);R(g,'#ffd23f',7,22,2,2);R(g,'#8a939e',4,18,8,1);
    pied(g,3,32,4,'#1a1a20');pied(g,11,32,4,'#1a1a20');
  },
  cartons(g,v){
    const k='#b88a4a';
    caisse(g,1,12,14,12,3,k,v,'#c89a5a');R(g,'#e8d8b0',7,12,2,12);R(g,'#5a3a1a',3,17,4,2);
    caisse(g,3,2,10,10,3,tone(k,.08),v+1,'#d0a868');R(g,'#e8d8b0',7,2,2,10);
  }
});
Object.assign(SH,{vase:24,livres:18,statue:42,echelle:42,poele:36,cartons:24});

// Faux Alibi : accueil, boucle de jeu, rendu, scènes, calepin, documents, mini-jeux.
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const liste=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' et '+a[a.length-1];
const cap=s=>s[0].toUpperCase()+s.slice(1);
const STORE='fauxalibi.v5';
const R_=(g,c,x,y)=>R(g,c,x,y);
const NIVEAUX=['Bavard','Méfiant','Fermé'];
let c,S,W,G={},stats={gagnees:0,serie:0,enigmes:0,res:{},notes:{},sys:{}};
// Réglages du joueur, tous réellement appliqués
let O={texte:'normal',zoom:'auto',perso:'normal',scenario:1,bavard:1,labels:1,parts:1,pluie:1,calme:0,diff:'auto',sons:1,musique:1,vol:50,lum:50,txt:100};
let AC=null;
function son(t){
  if(!O.sons||!O.vol)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const n=AC.currentTime,v=O.vol/100*.16,[f,f2,d,ty]={clic:[520,380,.05,'square'],page:[300,520,.09,'triangle'],marteau:[150,60,.16,'square'],rouage:[240,190,.14,'sawtooth'],bon:[520,880,.2,'triangle'],porte:[180,120,.08,'triangle']}[t]||[440,440,.05,'sine'];
    const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+d);
  }catch(e){}
}
const keys={up:0,down:0,left:0,right:0};
let tick=0,cam={x:0,y:0},parts=[],toastT=0,modal=null,VW=400,VH=250,SC=3,ctx,Cut=null,enJeu=false;

// ——— État d'une partie ———
function neuf(lv,seed,intro=true){
  seed=seed??(1000+Math.floor(Math.random()*8999));
  c=generate(seed,lv);if(lv===10)preparerTest(c);
  W=buildWorld(c);prep();if(lv===10)finirTest();
  S={seed,lv,t:{},liens:[],aides:0,jeu:0,evDocs:[],asked:{},seenRooms:{},cards:[],fin:null,p:{x:W.spawn.x*TS+8,y:W.spawn.y*TS+11,dir:0},open:{},inv:[],cles:{},docs:{},papiers:[],visit:{[c.rc]:1},conf:{},rel:{},notes:{},introDone:false};
  Object.values(W.doors).forEach(d=>{if(d.lock===null)S.open[d.id]=1});
  if(Cut)endCut();
  closeAll();G.walk=null;G.area=null;G.lu=0;G.choix=[];G.sel=[];G.noir=0;G.eclair=0;G.plan=null;art();enJeu=true;$('accueil').hidden=true;$('hud').hidden=false;$('marteau').hidden=lv===10;$('but').hidden=true;$('tuto-p').hidden=true;G.planCible=null;G.tutoO=null;
  cam.x=S.p.x-VW/2;cam.y=S.p.y-VH/2;G.snap=true;
  S.papiers.push(W.iAuto);
  save();render();
  if(lv===10){S.introDone=true;dit(JOUEUR,"Six salles, six façons d'interroger. Tout se joue dans la pièce.",300)}
  else if(intro&&O.scenario)startIntro();else{S.introDone=true;if(intro)tutoLance()}
}
function prep(){
  W.obj.forEach(o=>{if(o.kind==='suspect'){W.blk[o.y][o.x]=0;o.fx=o.x*TS+8;o.fy=o.y*TS+11;o.wait=60+(o.s*97)%300;o.dir=0}});
  asseoir();
  G.body=W.obj.find(o=>o.kind==='corps');
  W.iAuto=W.docs.length;
  W.docs.push({k:'autopsie',t:DOC_TITRES.autopsie,p:{v:c.vName,cause:cap(CLASSES[c.cls]),h:c.win.length>1?`entre ${HOURS[c.win[0]]} et ${HOURS[c.win[1]]}`:`à ${HOURS[c.hc]}`,a:detailAutopsie(c)}});
  if(c.locked){W.iReg=W.docs.length;W.docs.push({k:'registre',t:DOC_TITRES.registre,p:{lignes:[[c.set.rooms[c.locked.room].n,`verrouillée à ${HOURS[c.locked.h]}`],...c.set.rooms.filter((q,i)=>i!==c.locked.room).map(q=>[q.n,'ouverte toute la soirée'])]}})}
}
function freeNear(x,y,n=12){
  const o=[],seen=new Set([y*MW+x]),q=[[x,y]];
  for(let i=0;i<q.length&&o.length<n;i++){
    const[a,b]=q[i];
    for(const[p,r]of[[1,0],[-1,0],[0,1],[0,-1]]){
      const X=a+p,Y=b+r,k=Y*MW+X;if(seen.has(k))continue;seen.add(k);
      if(solidCell(W,X,Y,{}))continue;
      q.push([X,Y]);o.push([X,Y]);
    }
  }
  return o;
}
function save(){try{localStorage.setItem(STORE,JSON.stringify({S:S&&!(c&&c.test)?S:null,stats,O}))}catch(e){}}
function chargeStats(){try{const o=JSON.parse(localStorage.getItem(STORE));if(o){stats=Object.assign(stats,o.stats);O=Object.assign(O,o.O);G.sauve=o.S&&!o.S.fin?o.S:null}}catch(e){}}
function continuer(){
  try{
    S=G.sauve;c=generate(S.seed,S.lv);W=buildWorld(c);prep();(S.evDocs||[]).forEach(d=>W.docs.push(d));G.choix=[];G.sel=[];G.noir=0;G.plan=null;$('marteau').hidden=false;art();enJeu=true;$('accueil').hidden=true;$('hud').hidden=false;G.area=null;G.snap=true;render();
    if(!S.introDone)startIntro();
  }catch(e){neuf(0)}
}
const VOIX=s=>VOICES[c.suspects[s].voice];
function compTxt(s,h){const st=c.stmts[s][h],su=c.suspects[s],a=st.with.map(t=>c.suspects[t].prenom);if(st.vic)a.push(c.vName);return a.length?'avec '+liste(a):su.g==='f'?'toute seule':'tout seul'}
function parole(s,h){const st=c.stmts[s][h];return VOIX(s).fmt(HOURS[h],c.set.rooms[st.room].d,compTxt(s,h))}
function deDans(d){return d.replace(/^à la /,'de la ').replace(/^à l'/,"de l'").replace(/^au /,'du ').replace(/^aux /,'des ').replace(/^dans les /,'des ').replace(/^sur la /,'de la ')}
function notesPiece(i){
  const rm=c.set.rooms[i],out=[];
  if(i===c.wpn||i===c.leurre)out.push(`${cap(rm.o)} a disparu ${deDans(rm.d)}.`);
  else out.push(`${cap(rm.o)} est bien à sa place.`);
  if(i===c.rc){out.push(c.trait.c);if(c.useWatch)out.push(`La montre de la victime, brisée dans sa chute, s'est arrêtée à ${HOURS[c.hc]}.`)}
  if(c.locked&&c.locked.room===i)out.push(`Un registre des clés traîne ici : cette porte était verrouillée à ${HOURS[c.locked.h]}, personne n'a pu entrer.`);
  return out;
}
function note(k,t,x,ic,doc){
  S.cards.unshift({k,t,x,ic,doc});
  const b=$('calepin');b.classList.remove('frise');void b.offsetWidth;b.classList.add('frise');
  render();save();
}
function apprendre(s,h){
  if(S.asked[s+'-'+h])return;
  S.asked[s+'-'+h]=1;
  const st=c.stmts[s][h];
  note('temoin',`${c.suspects[s].prenom}, ${HOURS[h]}`,`Dit avoir été ${c.set.rooms[st.room].d}, ${compTxt(s,h)}.`,'p'+s);
}
function inspecter(i){
  if(!S.seenRooms[i]){
    S.seenRooms[i]=1;notesPiece(i).forEach(t=>note('indice',c.set.rooms[i].n,t,'loupe'));
    if(c.locked&&c.locked.room===i&&!S.papiers.includes(W.iReg))S.papiers.push(W.iReg);
  }
  return notesPiece(i);
}
function preuve(){
  const[k1,k2]=c.tueurs.map(i=>c.suspects[i]),out=[],r=c.set.rooms,dlie=r[c.A].d,hr=HOURS[c.hc],nomK=k1.prenom,p=i=>c.suspects[i].prenom;
  if(c.k2!==null&&c.mode==='croise'){
    out.push(`${k1.prenom} et ${k2.prenom} se couvraient : chacun jurait avoir été ${dlie} avec l'autre à ${hr}.`);
    out.push(c.type==='verrou'?"Impossible : le registre des clés montre que cette porte était verrouillée.":`Mais ${p(c.X)}, ${p(c.Y)} et ${p(c.Z)} y étaient, et personne ne les a vus.`);
  }else{
    if(c.type==='salle')out.push(`${nomK} a dit être ${dlie} à ${hr}. Mais ${p(c.X)} et ${p(c.Y)} y étaient, et personne n'a croisé ${nomK}.`);
    if(c.type==='complice')out.push(`${nomK} a dit être ${dlie} avec ${p(c.X)} à ${hr}. Or ${p(c.X)} et ${p(c.Y)} étaient ensemble ailleurs.`);
    if(c.type==='verrou')out.push(`${nomK} a dit être ${dlie} à ${hr}. Impossible : le registre des clés montre que cette porte était verrouillée.`);
    if(c.k2!==null)out.push(`${k2.prenom} a dit être ${r[c.stmts[c.k2][c.hc].room].d} à ${hr}. Mais ${p(c.W)} et ${p(c.Z)} y étaient, sans jamais l'apercevoir.`);
  }
  if(c.win.length>1)out.push(c.useWatch?`La montre brisée de ${c.vName} fixe la mort à ${hr}.`:`${p(c.W)} a vu ${c.vName} vivant${c.vg==='f'?'e':''} à ${HOURS[c.hc-1]}. La mort date donc de ${hr}.`);
  out.push(`${cap(r[c.wpn].o)} manquait : c'est la seule arme disparue qui correspond à ${CLASSES[c.cls]}.`);
  if(c.crime==='vol')out.push(`Le vol de ${c.vole} a mal tourné : la victime a surpris son voleur.`);
  if(c.crime==='suicide')out.push('La mise en scène du suicide ne tenait pas face à l\'autopsie.');
  c.tueurs.forEach(i=>out.push(`Le mobile : ${p(i)} ${c.suspects[i].mobile}.`));
  return out;
}

// ——— Images ———
function art(){
  [A_REPOS,A_SURVOL,A_ELAN,A_IMPACT].forEach(a=>imageMarteau(a));
  G.sheet={me:charSheet(INSPECTEUR),ba:charSheet(ADJOINT)};
  G.look=c.suspects.map((s,i)=>lookOf(s,i,c.seed));
  G.look.forEach((L,i)=>G.sheet[i]=charSheet(L));
  G.vlook=lookOf({g:c.vg,trait:''},9,c.seed);G.sheet.v=charSheet(G.vlook);
  G.porE={};G.por=G.look.map((L,i)=>portrait(L,i+1));G.porV=portrait(G.vlook,9);G.porBa=portrait(ADJOINT,7);G.porMe=portrait(INSPECTEUR,8);
  G.furn={};W.furn.forEach(f=>G.furn[f.id]=furnitureSprite(f));
  G.vit={};['lourd','lame','lien','poison'].forEach(k=>G.vit[k]=vitrineSprite(k,true));G.vit.vide=vitrineSprite('',false);
  G.portes={};
  G.ic={};G.url={};
  G.map=buildMap();G.light=buildLight();G.masks={};
  $('calepin').style.backgroundImage=`url(${calepinSprite().toDataURL()})`;
  $('jeu').style.cursor=G.curN;
}
function icone(id,col){const k=id+(col||'');if(!G.ic[k])G.ic[k]=iconSprite(id,col);return G.ic[k]}
function imgURL(ic){
  if(G.url[ic])return G.url[ic];
  let u;
  if(/^p\d+$/.test(ic))u=G.por[+ic.slice(1)].toDataURL();
  else u=icone(ic).toDataURL();
  return G.url[ic]=u;
}
const areaIdx=(x,y)=>W.areas.findIndex(A=>A.rects.some(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1));
function buildMap(){
  const[k,g]=cv(MW*TS,MH*TS),L=c.set;
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    const v=W.t[y][x];
    if(v===0)voidTile(g,x*TS,y*TS,x,y);
    else if(v===1){
      let A=W.areas[areaIdx(x,y)];
      if(!A&&W.gate[y][x]){const d=W.doors[W.gate[y][x]];A=W.areas[d.v?d.a:d.haut]}
      floorTile(g,A?A.rec.f:L.floor,x,y,x*TS,y*TS,A?A.tint:L.tint);
    }
    else if(y===0||W.t[y-1][x]!==2){
      const A=W.areas.find(a=>a.rects.some(q=>x>=q.x0&&x<=q.x1&&y+2===q.y0))||W.areas[areaIdx(x,y+2)];
      wallColumn(g,x*TS,y*TS,A?A.tint:L.tint,L.lamb);
    }
  }
  W.areas.forEach(A=>{
    if(!A.rec.rug||!A.tapis)return;
    const q=A.tapis,x=q.x*TS,y=q.y*TS,w=(q.x1-q.x+1)*TS,h=(q.y1-q.y+1)*TS,cc=A.rec.rug;
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){
      const e=Math.min(i,j,w-1-i,h-1-j),m=Math.abs((i%20)-10)+Math.abs((j%20)-10);
      R_(g,e<2?'#d8b35c':e<4?tone(cc,-.3):e===6?'#d8b35c':m===6?tone(cc,.32):m<2?'#d8b35c':tone(cc,(noise(i,j,4)-.5)*.1),x+i,y+j);
    }
  });
  g.fillStyle='rgba(12,10,32,.32)';W.furn.forEach(f=>g.fillRect(f.x*TS,(f.y+f.h)*TS-1,f.w*TS,3));
  // Tapis de couloir
  if(L.runner)W.areas.filter(A=>!A.room).forEach(A=>A.rects.forEach(q=>{
    const hz=q.x1-q.x0>=q.y1-q.y0,e=hz?q.y1-q.y0+1:q.x1-q.x0+1;
    if(e<3)return;
    const a=(hz?q.y0*TS:q.x0*TS)+8,l=e*TS-16,n=hz?(q.x1-q.x0+1)*TS:(q.y1-q.y0+1)*TS;
    for(let i=0;i<n;i++)for(let j=0;j<l;j++){const X=hz?q.x0*TS+i:a+j,Y=hz?a+j:q.y0*TS+i,bd=j<2||j>=l-2,mo=(i%16)<2&&j>6&&j<l-6;R_(g,bd?'#d8b35c':mo?tone(L.runner,.3):tone(L.runner,(noise(i>>1,j>>1,5)-.5)*.1),X,Y)}
  }));
  Object.values(W.doors).forEach(d=>{
    if(d.v)return;
    for(let i=0;i<2;i++)wallColumn(g,(d.x+i)*TS,(d.y+1)*TS,W.areas[d.bas].tint,L.lamb);
  });
  W.entrees.forEach(e=>{g.drawImage(doorArt('entree',false,null,null),0,0,32,29,e.x*TS,e.y*TS+3,32,29);paillasson(g,e.x*TS,(e.y+2)*TS+1,32,14)});
  W.windows.forEach((w,i)=>fenetre(g,w.x*TS,w.y*TS,c.lv,i+c.seed%7));
  W.tableaux.forEach((w,i)=>tableau(g,w.x*TS+1,w.y*TS+1,w.n,c.seed+i));
  return k;
}
function buildLight(){
  const[k,g]=cv(MW*8,MH*8);
  {const v=.45+O.lum/100*.55;R(g,toHex([255*v*.86,255*v*.9,255*v]),0,0,MW*8,MH*8)}
  g.globalCompositeOperation='lighter';
  const pool=(x,y,r,col)=>{const q=g.createRadialGradient(x,y,1,x,y,r);q.addColorStop(0,col);q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)};
  W.lamps.forEach(l=>pool(l.x*8,l.y*8,l.warm?50:30,l.warm?'rgba(150,110,60,.9)':'rgba(70,130,130,.8)'));
  W.windows.forEach(w=>pool((w.x+1)*8,(w.y+2.5)*8,26,'rgba(70,90,150,.6)'));
  return k;
}
// Zones visibles : une pièce à la fois, les murs cachent tout le reste.
function maskOf(a){
  if(G.masks[a])return G.masks[a];
  const[k,g]=cv(MW*TS,MH*TS);R(g,'#04030a',0,0,MW*TS,MH*TS);
  String(a).split('|').forEach(i=>W.areas[+i].view.forEach(([x0,y0,x1,y1])=>g.clearRect(x0*TS,y0*TS,(x1-x0+1)*TS,(y1-y0+1)*TS)));
  return G.masks[a]=k;
}
const visible=(a,cx,cy)=>W.areas[a].view.some(([x0,y0,x1,y1])=>cx>=x0&&cx<=x1&&cy>=y0&&cy<=y1);

// ——— Rendu ———
function fit(){
  const k=$('jeu'),w=$('app').clientWidth||innerWidth,h=$('app').clientHeight||innerHeight;
  if(!w||!h)return;
  SC=Math.max(2,Math.min(6,Math.round(Math.min(w/400,h/250))+(O.zoom==='grand'?1:O.zoom==='petit'?-1:0)));
  VW=Math.ceil(w/SC);VH=Math.ceil(h/SC);
  k.width=VW;k.height=VH;k.style.width=VW*SC+'px';k.style.height=VH*SC+'px';
  ctx=k.getContext('2d');ctx.imageSmoothingEnabled=false;
  const e=$('ciel'),ew=Math.ceil(w/2),eh=Math.ceil(h/2);
  if(e.width!==ew||e.height!==eh){e.width=ew;e.height=eh;G.fondAcc=homeScene(ew,eh)}
}
function drawChar2(sheet,x,y,dir,fr){ctx.drawImage(sheet,fr*20,dir*30,20,30,Math.round(x-10),Math.round(y-27),20,30)}
function shadow(x,y,w){ctx.fillStyle='rgba(8,6,24,.42)';ctx.fillRect(Math.round(x-w/2),Math.round(y-1),w,3);ctx.fillRect(Math.round(x-w/2+2),Math.round(y-2),w-4,5)}
function emote(x,y,ch){ctx.fillStyle='#141226';ctx.fillRect(x-4,y-11,9,11);ctx.fillStyle='#ffd23f';if(ch==='!'){ctx.fillRect(x-1,y-9,3,5);ctx.fillRect(x-1,y-3,3,2)}else{ctx.fillRect(x-2,y-9,5,2);ctx.fillRect(x+1,y-8,2,3);ctx.fillRect(x-1,y-6,3,2);ctx.fillRect(x-1,y-3,3,2)}}
function drawAccueil(){
  const e=$('ciel'),q=e.getContext('2d'),f=G.fenAcc;
  if(!G.fondAcc)return;
  q.drawImage(G.fondAcc,0,0);
  if(O.pluie&&f){q.save();q.beginPath();q.rect(f.x,f.y,f.w,f.h);q.clip();q.fillStyle='rgba(170,190,235,.55)';for(let i=0;i<110;i++)q.fillRect(f.x+(i*37+tick)%f.w,f.y+(i*61+tick*4)%f.h,1,4);q.restore()}
  const v=G.vapeur;if(v&&!O.calme){q.fillStyle='rgba(235,235,245,.34)';for(let i=0;i<14;i++){const t=(tick*.45+i*7)%34;q.fillRect(Math.round(v.x+Math.sin(t*.22+i)*(2+t*.1)+(i%3-1)*3),Math.round(v.y-t),1,2)}}
}
function viseCam(){
  const P=S.p,A=W.areas[G.area!=null?G.area:c.rc],cx=P.x>>4,cy=(P.y-3)>>4;
  const q=A.rects.find(z=>cx>=z.x0&&cx<=z.x1&&cy>=z.y0&&cy<=z.y1)||A.rects[0];
  const x0=q.x0*TS,x1=(q.x1+1)*TS,y0=(q.y0-2)*TS,y1=(q.y1+1)*TS,mx=(x0+x1)/2,my=(y0+y1)/2;
  const axe=(p,a,b,m,V)=>b-a<=V-24?m+(p-m)*.2:Math.max(a+V/2-12,Math.min(b-V/2+12,p));
  return[axe(P.x,x0,x1,mx,VW),axe(P.y,y0,y1,my,VH)];
}
function draw(){
  if(!enJeu)return drawAccueil();
  if(!ctx||!G.map)return;
  const P=S.p,cu=Cut&&Cut.cam;
  const[tx,ty]=cu||viseCam();
  const lisse=G.snap?1:.055;
  cam.x+=(tx-VW/2-cam.x)*lisse;cam.y+=(ty-VH/2-cam.y)*lisse;G.snap=false;
  const cx=Math.round(cam.x),cy=Math.round(cam.y);
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#04030a';ctx.fillRect(0,0,VW,VH);
  ctx.setTransform(1,0,0,1,-cx,-cy);
  ctx.drawImage(G.map,0,0);
  fenetresVivantes();
  Object.values(W.doors).forEach(d=>{
    // une porte libre s'ouvre à l'approche
    const ferme=!S.open[d.id]&&!(Cut&&Cut.hideNpc),pres=Math.hypot(P.x-(d.x+d.w/2)*TS,P.y-(d.y+d.h/2)*TS)<36||(Cut&&Object.values(Cut.actors).some(a=>!a.hide&&!a.down&&Math.hypot(a.x-(d.x+d.w/2)*TS,a.y-(d.y+d.h/2)*TS)<40)),ouv=!ferme&&(pres||G.bot),col=ferme?'#c8a040':null;
    if(ouv!==!!d.ouv){d.ouv=ouv;if(!Cut)son('porte')}
    const cle=[d.v,d.style,ouv,col,d.num].join();
    if(d.v){ctx.drawImage(G.portes[cle]||(G.portes[cle]=doorVArt(d.style,ouv,col)),d.x*TS,d.y*TS);return}
    ctx.drawImage(G.portes[cle]||(G.portes[cle]=doorArt(d.style,ouv,col,d.num)),0,0,32,29,d.x*TS,(d.y+1)*TS+3,32,29);
    const c2='h'+cle;ctx.drawImage(G.portes[c2]||(G.portes[c2]=doorTopArt(d.style,ouv,col)),d.x*TS,d.y*TS);
  });
  W.obj.forEach(o=>{
    if(o.kind!=='corps')return;
    ctx.drawImage(G.trace||(G.trace=traceCraie()),o.x*TS,o.y*TS);
  });
  (G.rip||[]).forEach(r=>{const s=(30-r.t)>>2;ctx.fillStyle=r.o?'#ff9a6a':'#ffd23f';ctx.fillRect(r.x-s-2,r.y-s,4,1);ctx.fillRect(r.x+s-1,r.y-s,4,1);ctx.fillRect(r.x-s-2,r.y+s,4,1);ctx.fillRect(r.x+s-1,r.y+s,4,1);ctx.fillRect(r.x-s-2,r.y-s,1,3);ctx.fillRect(r.x+s+2,r.y-s,1,3);ctx.fillRect(r.x-s-2,r.y+s-2,1,3);ctx.fillRect(r.x+s+2,r.y+s-2,1,3)});
  if(c.test)dessinSol();
  const L=[],inView=(x,y)=>x>cx-80&&x<cx+VW+80&&y>cy-60&&y<cy+VH+90;
  W.furn.forEach(f=>{const y=(f.y+f.h)*TS;if(inView(f.x*TS,y))L.push({y,d:()=>{ctx.drawImage(G.furn[f.id],f.x*TS-1,y-SH[f.name]-1);if(f.name==='fireplace')feuDessine(ctx,f.x*TS,y-SH[f.name],tick)}})});
  W.obj.forEach(o=>{
    const x=o.x*TS,y=(o.y+1)*TS;
    if(o.kind==='vitrine'&&inView(x,y))L.push({y,d:()=>ctx.drawImage((o.room===c.wpn||o.room===c.leurre)?G.vit.vide:G.vit[c.set.rooms[o.room].c],x-1,y-37)});
    if(o.kind==='suspect'&&!(Cut&&Cut.hideNpc))L.push({y:o.assis?(o.y+1)*TS+1:o.fy,d:()=>{dessinePNJ(o);if(o.em>0)emote(Math.round(o.fx),Math.round(o.fy-29),o.emc)}});
  });
  const moving=!Cut&&(keys.up||keys.down||keys.left||keys.right||G.bot||G.walk||G.moved);
  if(!Cut||(!Cut.actors.me&&!Cut.hideNpc))L.push({y:P.y,d:()=>{shadow(P.x,P.y,12);drawChar2(G.sheet.me,P.x,P.y-(moving&&(tick>>2)&1?1:0),P.dir,moving?(tick>>(G.run?2:3))&3:0);if(G.emT>0)emote(Math.round(P.x),Math.round(P.y-29),G.emC)}});
  if(Cut)Object.values(Cut.actors).forEach(a=>{if(a.hide)return;L.push({y:a.y,d:()=>{
    if(a.down){ctx.save();ctx.translate(Math.round(a.x),Math.round(a.y-4));ctx.rotate(Math.PI/2);ctx.drawImage(G.sheet[a.sh],0,0,20,30,-15,-10,20,30);ctx.restore();return}
    shadow(a.x,a.y,12);drawChar2(G.sheet[a.sh],a.x,a.y,a.dir,a.mv?(tick>>3)&3:0)}})});
  L.sort((a,b)=>a.y-b.y).forEach(i=>i.d());
  if(c.test)dessinDessus();
  if(S.tu)tutoDessus();
  if(G.hover&&!modal){
    const[x,y,w,h]=objRect(G.hover),q=tick>>4&1;ctx.fillStyle='#ffd23f';
    [[x-2-q,y-2-q,5,1],[x-2-q,y-2-q,1,5],[x+w-3+q,y-2-q,5,1],[x+w+1+q,y-2-q,1,5],[x-2-q,y+h+1+q,5,1],[x-2-q,y+h-3+q,1,5],[x+w-3+q,y+h+1+q,5,1],[x+w+1+q,y+h-3+q,1,5]].forEach(a=>ctx.fillRect(...a));
  }
  if(O.parts)W.lamps.forEach(l=>{if(inView(l.x*TS,l.y*TS)&&Math.random()<.02)parts.push({x:l.x*TS+Math.random()*10,y:l.y*TS,vx:(Math.random()-.5)*.1,vy:-.2,l:50,c:'#ffd878'})});
  if(O.parts&&Math.random()<.2)parts.push({x:cx+Math.random()*VW,y:cy+Math.random()*VH,vx:.05,vy:-.03,l:90,c:'rgba(255,245,220,.28)'});
  parts=parts.filter(p=>p.l-->0);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;ctx.fillStyle=p.c;ctx.fillRect(p.x|0,p.y|0,1,1)});
  // Les murs cachent les autres pièces
  const ar=Cut&&Cut.area!=null?Cut.area:G.area!=null?G.area:c.rc,cg=(P.y-3)>>4,pg=!Cut&&W.gate[cg]&&W.gate[cg][P.x>>4],pd=pg&&W.doors[pg],masque=pd?`${pd.a}|${pd.b}`:String(ar);
  if(masque!==G.drawA){G.prevA=G.drawA;G.drawA=masque;G.mf=1}
  if(G.mf>0&&G.prevA!=null){G.mf=Math.max(0,G.mf-.06);const u=[...new Set((masque+'|'+G.prevA).split('|'))].sort().join('|');ctx.drawImage(maskOf(u),0,0);ctx.globalAlpha=1-G.mf;ctx.drawImage(maskOf(masque),0,0);ctx.globalAlpha=G.mf;ctx.drawImage(maskOf(G.prevA),0,0);ctx.globalAlpha=1}
  else ctx.drawImage(maskOf(masque),0,0);
  ctx.setTransform(1,0,0,1,0,0);
  ctx.globalCompositeOperation='multiply';ctx.imageSmoothingEnabled=true;
  ctx.drawImage(G.light,cx/2,cy/2,VW/2,VH/2,0,0,VW,VH);ctx.imageSmoothingEnabled=false;
  ctx.globalCompositeOperation='lighter';
  const pxx=P.x-cx,pyy=P.y-cy-8,rad=70,q=ctx.createRadialGradient(pxx,pyy,2,pxx,pyy,rad);q.addColorStop(0,'rgba(95,88,70,.45)');q.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=q;ctx.fillRect(pxx-rad,pyy-rad,rad*2,rad*2);
  ctx.globalCompositeOperation='source-over';
  if(G.eclair>10){ctx.fillStyle='rgba(200,210,255,.09)';ctx.fillRect(0,0,VW,VH)}
  if(G.noir>0)noirDessine(pxx,pyy);
  if(G.fl>0){ctx.fillStyle=`rgba(255,240,230,${G.fl/20})`;ctx.fillRect(0,0,VW,VH)}
  if(G.fade>0){ctx.fillStyle=`rgba(4,3,10,${G.fade})`;ctx.fillRect(0,0,VW,VH)}
  posBulles();
}
const toScreen=(x,y)=>[(x-Math.round(cam.x))*SC,(y-Math.round(cam.y))*SC];
function posBulles(){
  const b=$('bulle');
  if(!b.hidden&&G.bAt){
    const[x,y]=toScreen(G.bAt.x,G.bAt.y-34),W0=$('app').clientWidth,H=b.offsetHeight,w=b.offsetWidth;
    let top=y-H-14,haut=false;if(top<10){top=Math.min($('app').clientHeight-H-10,y+100);haut=true}
    const left=Math.max(12,Math.min(W0-w-12,x-50));
    b.style.left=left+'px';b.style.top=top+'px';b.classList.toggle('haut',haut);b.style.setProperty('--q',Math.max(8,Math.min(w-24,x-left))+'px');
  }else if(!b.hidden){b.style.left=Math.max(12,($('app').clientWidth-b.offsetWidth)/2)+'px';b.style.top=Math.max(10,$('app').clientHeight-b.offsetHeight-110)+'px';b.classList.add('haut')}
  const a=$('amb');
  if(!a.hidden&&G.ambO){const[x,y]=toScreen(G.ambO.fx,G.ambO.fy-32);a.style.left=Math.max(8,x-24)+'px';a.style.top=(y-a.offsetHeight-14)+'px'}
}

// ——— Bulles ———
function bulle(o){
  const b=$('bulle');b.hidden=false;b.classList.remove('haut');
  G.bAt=o.at||null;G.bTxt=o.txt;G.bI=0;
  b.innerHTML=`<div class="tete">${o.por?'<span id="bpor"></span>':''}<div style="min-width:0"><b>${esc(o.nom||'')}</b><span id="btxt"></span></div></div><div class="choix"></div>${o.clic?'<span class="suite">Clic</span>':''}`;
  if(o.por){const[k,g]=cv(o.por.width,o.por.height);g.drawImage(o.por,0,0);$('bpor').replaceWith(k)}
  const ch=b.querySelector('.choix');
  (o.btn||[]).forEach(q=>{const x=document.createElement('button');x.className='etiq '+(q.cl||'');x.innerHTML=(q.ic?`<img alt="" src="${imgURL(q.ic)}">`:'')+esc(q.t);x.onclick=e=>{e.stopPropagation();q.f()};ch.appendChild(x)});
  if(!(o.btn||[]).length)ch.remove();
  posBulles();
}
function typeBulle(){
  if(G.bTxt==null||$('bulle').hidden)return;
  if(G.bI<G.bTxt.length){G.bI=Math.min(G.bTxt.length,G.bI+{lent:1,normal:2,rapide:5,direct:9999}[O.texte]);const e=$('btxt');if(e)e.textContent=G.bTxt.slice(0,G.bI)}
}
const finBulle=()=>{if(G.bI<G.bTxt.length){G.bI=G.bTxt.length;$('btxt').textContent=G.bTxt;return false}return true};
function closeAll(){modal=null;$('bulle').hidden=true;$('pz').hidden=true;$('carnet').hidden=true;$('doc').hidden=true;$('options').hidden=true;$('tribunal').hidden=true;G.pzT=null;G.mini=null;$('jeu').focus({preventScroll:true});if(S)render()}
const at0=()=>({x:S.p.x,y:S.p.y});
function say(nom,txt,at,por){modal='dlg';bulle({at:at||at0(),nom,txt,por,btn:[{t:'Compris',f:closeAll}]})}
function talk(o,msg,refus,e){
  if(c.test)return salleParle(o.s);
  if(S.tu)S.tu.parle=1;
  const s=o.s,su=c.suspects[s],V=VOIX(s),need=su.niveau-1,pret=()=>(S.conf[s]||0)>=need;
  o.mv=false;modal='dlg';
  const btn=HOURS.map((h,i)=>({t:(S.asked[s+'-'+i]?'✓ ':'Et à ')+h+(S.asked[s+'-'+i]?'':' ?'),f:()=>{
    if(!S.asked[s+'-'+i]&&!pret())return talk(o,V.non,true);
    apprendre(s,i);talk(o,parole(s,i));
  }}));
  btn.push({t:`Et ${c.vName} ?`,cl:'alt',f:()=>{if(!S.rel[s]){S.rel[s]=1;S.conf[s]=(S.conf[s]||0)+1}talk(o,V.rel)}});
  btn.push({t:'Montrer un document',cl:'fort',f:()=>montrer(o)});
  if(refus)btn.push({t:'Insister',cl:'alt',f:()=>{S.conf[s]=(S.conf[s]||0)+1;talk(o,pret()?'Bon, très bien. Je vous écoute.':V.non,!pret())}});
  btn.push({t:'À plus tard',cl:'alt',f:closeAll});
  const accord=t=>su.g==='f'?t.replace(/\bsûr\b/g,'sûre').replace(/\bennuyé\b/g,'ennuyée').replace(/\ballé\b/g,'allée').replace(/\bfurieux\b/g,'furieuse'):t;
  bulle({at:{x:o.fx,y:o.fy},nom:`${su.prenom}, ${su.role}`,txt:accord(msg||V.hi[(tick>>6)%V.hi.length]),por:visage(s,e||(refus?(V.nom==='nerveux'?'inquiet':'colere'):null)),btn});
}

// ——— Scènes ———
function act(id,sh,cell,dir=0,extra={}){return{spawn:id,sh,x:cell[0]*TS+8,y:cell[1]*TS+11,dir,...extra}}
function play(q,onEnd){Cut={q,i:-1,actors:{},onEnd,cam:null,area:null,w:0};modal='cut';$('passer').hidden=false;G.hover=null;G.walk=null;$('prompt').hidden=true;nextCut()}
function nextCut(){
  const C=Cut;C.i++;
  const s=C.q[C.i];
  if(!s)return endCut();
  if(s.spawn){C.actors[s.spawn]={...s,mv:false};return nextCut()}
  if(s.cam){C.cam=s.cam;return nextCut()}
  if(s.area!==undefined){C.area=s.area;return nextCut()}
  if(s.hideNpc!==undefined){C.hideNpc=s.hideNpc;return nextCut()}
  if(s.hide){C.actors[s.hide].hide=true;return nextCut()}
  if(s.down){C.actors[s.down].down=true;return nextCut()}
  if(s.flash){G.fl=20;return nextCut()}
  if(s.fn){s.fn();return nextCut()}
  if(s.snap){G.snap=true;return nextCut()}
  if(s.wait){C.w=s.wait;return}
  if(s.fade!==undefined){C.fadeTo=s.fade;return}
  if(s.tourne){const a=C.actors[s.tourne],b=C.actors[s.vers],dx=b.x-a.x,dy=b.y-a.y;a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);return nextCut()}
  if(s.go){const a=C.actors[s.go];a.path=cheminCut(a,s.x,s.y,C.actors);a.pi=0;a.sp=s.sp||1.1;a.mv=true;if(s.async)return nextCut();return}
  if(s.attend)return;
  if(s.card){const e=$('carte');e.hidden=false;e.innerHTML=`<h2>${esc(s.card)}</h2>${s.sub?`<p>${esc(s.sub)}</p>`:''}<small>Clique pour continuer</small>`;C.wc=true;return}
  if(s.say){
    const a=C.actors[s.say],porMap={ba:G.porBa,me:G.porMe};
    bulle({at:a?{x:a.x,y:a.y}:null,nom:s.nom,txt:s.t,por:s.por||porMap[s.say],clic:1});C.wc=true;
  }
}
function cutClick(){
  if(!Cut||!Cut.wc)return;
  if(!$('bulle').hidden&&!finBulle())return;
  Cut.wc=false;$('carte').hidden=true;$('bulle').hidden=true;nextCut();
}
function stepCut(){
  const C=Cut;
  Object.values(C.actors).forEach(avanceActeur);
  if(C.w>0){if(--C.w===0)nextCut();return}
  if(C.fadeTo!==undefined){
    const d=C.fadeTo-(G.fade||0);
    if(Math.abs(d)<=.04){G.fade=C.fadeTo;C.fadeTo=undefined;nextCut()}
    else G.fade=(G.fade||0)+Math.sign(d)*.04;
    return;
  }
  const s=C.q[C.i];
  if(s&&s.go&&!s.async&&!C.actors[s.go].path){nextCut();return}
  if(s&&s.attend&&!C.actors[s.attend].path)nextCut();
}
function avanceActeur(a){
  if(!a.path)return;
  const[x,y]=a.path[a.pi],dx=x-a.x,dy=y-a.y,d=Math.hypot(dx,dy);
  if(d<=a.sp){a.x=x;a.y=y;if(++a.pi>=a.path.length){a.path=null;a.mv=false}return}
  a.x+=dx/d*a.sp;a.y+=dy/d*a.sp;a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);
}
// Toutes les portes sont franchissables ici, mais jamais les murs ni les meubles
const TOUT_OUVERT=new Proxy({},{get:()=>1});
function cheminCut(a,x1,y1,acteurs){
  const sx=a.x>>4,sy=(a.y-3)>>4,gx=x1>>4,gy=(y1-3)>>4,dep=sy*MW+sx,prev=new Map([[dep,-1]]),q=[dep],pris=new Set();
  Object.values(acteurs).forEach(o=>{if(o!==a&&!o.hide)pris.add(((o.y-3)>>4)*MW+(o.x>>4))});
  let best=dep,bd=1e9;
  for(let h=0;h<q.length;h++){
    const k=q[h],x=k%MW,y=(k/MW)|0,d=Math.abs(x-gx)+Math.abs(y-gy);
    if(d<bd){bd=d;best=k}
    if(d===0)break;
    for(const[p,r]of[[1,0],[-1,0],[0,1],[0,-1]]){
      const X=x+p,Y=y+r,K=Y*MW+X;
      if(X<0||Y<0||X>=MW||Y>=MH||prev.has(K)||pris.has(K)||solidCell(W,X,Y,TOUT_OUVERT))continue;
      prev.set(K,k);q.push(K);
    }
  }
  const p=[];let n=best;while(n!==-1&&n!==dep){p.unshift([(n%MW)*TS+8,((n/MW)|0)*TS+11]);n=prev.get(n)}
  if(bd===0&&p.length)p[p.length-1]=[x1,y1];
  return p.length?p:null;
}
function endCut(){
  const C=Cut;Cut=null;G.fade=0;
  $('passer').hidden=true;$('carte').hidden=true;$('bulle').hidden=true;modal=null;
  if(C&&C.onEnd)C.onEnd();
}
function skipCut(){if(Cut)endCut()}
function startIntro(){
  if(G.noCut){S.introDone=true;return}
  const b=G.body,cells=freeNear(b.x,b.y,10),V=c.vName,e=c.vg==='f'?'e':'',A=W.rooms[c.rc],ic=cells.find(q=>q[0]!==W.spawn.x||q[1]!==W.spawn.y)||[b.x+1,b.y],me=[W.spawn.x,W.spawn.y];
  const door=cells[cells.length-1]||me,win=c.win.length>1?`quelque part entre ${HOURS[c.win[0]]} et ${HOURS[c.win[1]]}`:HOURS[c.hc];
  const ba=t=>({say:'ba',nom:'Basile, votre adjoint',t});
  const q=[
    {fn:()=>{G.fade=1}},{area:c.rc},{cam:[b.x*TS+8,b.y*TS]},{snap:1},
    {card:`Affaire n° ${c.seed}`,sub:`${c.set.nom}, minuit.`},
    act('v','v',[b.x+.5,b.y],0,{down:true}),act('ba','ba',ic,0),act('me','me',door,2),
    {fade:0},{go:'me',x:me[0]*TS+8,y:me[1]*TS+11,sp:1.2},
    ba(`Ah, inspecteur ! Vous voilà enfin. Bienvenue ${c.set.lieu}.`),
    ba(`Voici ${V}, ${c.vrole}. Retrouvé${e} mort${e} ici même, à minuit pile. Le légiste parle d'${CLASSES[c.cls]}, ${win.startsWith('quelque')?win:'à '+win}.`),
    ...(c.crime==='suicide'?[ba("Tout a été arrangé pour faire croire à un suicide. Le légiste n'y croit pas une seconde.")]:c.crime==='vol'?[ba(`Et ${c.vole} a disparu. La victime a sans doute surpris son voleur.`)]:c.crime==='poison'?[ba("Aucune blessure, juste un verre renversé près du corps. Quelqu'un a versé quelque chose dedans.")]:[]),
    ba(c.liars===1?"Personne n'a pu sortir. L'assassin est encore là, et lui seul va vous mentir.":"Personne n'a pu sortir. Ils sont deux, et ils vont vous mentir."),
    ba(stats.tuto?"À vous de jouer, inspecteur.":"Commençons par le début, je vous montre.")
  ];
  play(q,()=>{S.introDone=true;save();render();tutoLance()});
}
function motDossier(){
  const f=S.fin,a=f.arme,h=f.heure;if(a==null&&h==null)return'';
  const bonneA=a===c.wpn,bonneH=h===c.hc;
  if((a==null||bonneA)&&(h==null||bonneH))return a!=null&&h!=null?"Et l'arme comme l'heure étaient justes : un dossier parfait, inspecteur.":a!=null?"Et l'arme que vous aviez notée était la bonne.":"Et l'heure que vous aviez notée était la bonne.";
  const t=[];if(a!=null&&!bonneA)t.push(`l'arme était ${c.set.rooms[c.wpn].o}`);if(h!=null&&!bonneH)t.push(`le crime a eu lieu à ${HOURS[c.hc]}`);
  return`Votre dossier avait une erreur : ${t.join(' et ')}.`;
}
function startVerite(qui){
  const K=c.tueurs.map(i=>c.suspects[i]),A=qui.map(i=>c.suspects[i]),ok=memes(qui,c.tueurs),b=G.body,cells=freeNear(b.x,b.y,16),noms=l=>liste(l.map(q=>q.prenom));
  S.fin={win:ok,qui,arme:G.armeC??null,heure:G.heureC??null};S.fin.note=noteEnquete(ok);
  if(!G.robot){if(ok){stats.gagnees++;stats.serie++;stats.res[S.lv]=1;stats.notes=stats.notes||{};const a=stats.notes[S.lv];if(!a||S.fin.note.l<a)stats.notes[S.lv]=S.fin.note.l}else stats.serie=0}
  G.sauve=null;save();
  const fin=()=>{render();ouvrir('fin')};
  if(G.noCut)return fin();
  const moi=t=>({say:'x',nom:'Vous',t,por:G.porMe}),ba=t=>({say:'x',nom:'Basile',t,por:G.porBa});
  const issues=Object.values(W.doors).filter(d=>d.a===c.rc||d.b===c.rc).sort((p,q)=>(p.lock!==null)-(q.lock!==null)),porte=issues[0];
  const dehors=porte.v?(areaIdx(porte.x-1,porte.y)===c.rc?[porte.x+1,porte.y]:[porte.x-1,porte.y]):(porte.haut===c.rc?[porte.x,porte.y+3]:[porte.x,porte.y-1]);
  const dehors2=porte.v?[dehors[0],dehors[1]+1]:[dehors[0]+1,dehors[1]];
  const autour=cells.filter(q=>q[1]!==b.y||(q[0]!==b.x&&q[0]!==b.x+1)).sort((p,q)=>(Math.abs(p[0]-b.x)+Math.abs(p[1]-b.y))-(Math.abs(q[0]-b.x)+Math.abs(q[1]-b.y))),pres=autour[0]||[b.x+1,b.y],pres2=autour[1]||pres;
  const cx=(b.x+dehors[0])/2*TS+8,cy=(b.y+dehors[1])/2*TS;
  // Les mots du tueur dépendent de son mobile, de sa façon de parler et du faux alibi qu'il va donner
  const court=c.vName.replace(/^(M\.|Mme) /,'');
  const mots=(i,n)=>{
    const d=W.docs.find(q=>q.s===i),m=d&&d.p.m?d.p.m.toLocaleString('fr-FR'):'';
    const t=c.suspects[i].dl[n].replace(/\{V\}/g,court).replace('{m}',m);
    return c.suspects[i].g==='f'?t.replace('rayé de','rayée de'):t;
  };
  const adieu=i=>{
    const a=c.set.rooms[c.stmts[i][c.hc].room].d,ens=c.k2!==null&&c.mode==='croise'&&c.stmts[i][c.hc].with.length;
    return ens?`Souviens-toi bien : nous étions ensemble ${a}. Rien d'autre.`:VOIX_PLUS[c.suspects[i].voice].mort.replace('{alibi}',a);
  };
  const parle=(id,i,t)=>({say:id,nom:c.suspects[i].prenom,t,por:G.por[i]});
  const q=[
    moi(`${noms(A)}, je vous accuse du meurtre de ${c.vName}.`),
    {say:'x',nom:A[0].prenom,t:ok?'... Comment avez-vous su ?':'Moi ?! Vous faites une terrible erreur !',por:G.por[qui[0]]},
    {fade:1},{hideNpc:true},{area:c.rc},{cam:[cx,cy]},{snap:1},
    {card:ok?'Vous aviez raison':'Vous vous êtes trompé',sub:ok?`${noms(K)} passe${K.length>1?'nt':''} aux aveux. Voici ce qui s'est passé à ${HOURS[c.hc]}.`:`Pendant qu'on emmène ${noms(A)}, ${noms(K)} s'éclipse${K.length>1?'nt':''}. Voici la vérité.`},
    act('v','v',[b.x+.5,b.y],0),act('k',c.k,dehors,2),...(c.k2!==null?[act('k2',c.k2,dehors2,2)]:[]),
    {fade:0},{wait:30},{go:'k',x:pres[0]*TS+8,y:pres[1]*TS+11,sp:1.1,async:c.k2!==null},...(c.k2!==null?[{wait:30},{go:'k2',x:pres2[0]*TS+8,y:pres2[1]*TS+11,sp:1.1},{attend:'k'}]:[]),
    {tourne:'k',vers:'v'},...(c.k2!==null?[{tourne:'k2',vers:'v'}]:[]),{tourne:'v',vers:'k'},
    {wait:30},parle('k',c.k,mots(c.k,0)),{say:'v',nom:c.vName,t:mots(c.k,1),por:G.porV},
    {flash:1},{down:'v'},{wait:50},
    parle('k',c.k,mots(c.k,2)),
    ...(c.k2!==null?[parle('k2',c.k2,mots(c.k2,2)),parle('k2',c.k2,adieu(c.k2))]:[]),
    parle('k',c.k,adieu(c.k)),
    {go:'k',x:dehors[0]*TS+8,y:dehors[1]*TS+11,sp:1.5,async:c.k2!==null},...(c.k2!==null?[{wait:26},{go:'k2',x:dehors2[0]*TS+8,y:dehors2[1]*TS+11,sp:1.5},{attend:'k'}]:[]),{hide:'k'},...(c.k2!==null?[{hide:'k2'}]:[]),{wait:20},
    ...preuve().map(t=>ba(t)),...(motDossier()?[ba(motDossier())]:[]),
    {fade:1}
  ];
  play(q,fin);
}

// ——— Marche à la souris ———
const solidPx=(x,y)=>solidCell(W,x>>4,y>>4,S.open);
const hit=(x,y)=>solidPx(x-5,y-6)||solidPx(x+5,y-6)||solidPx(x-5,y)||solidPx(x+5,y);
function move(dx,dy){const P=S.p;if(dx&&!hit(P.x+dx,P.y))P.x+=dx;if(dy&&!hit(P.x,P.y+dy))P.y+=dy}
const adjGoal=o=>(x,y)=>x>=o.x-1&&x<=o.x+o.w&&y>=o.y-1&&y<=o.y+o.h&&(x===o.x-1||x===o.x+o.w||y===o.y-1||y===o.y+o.h)&&(!(x<o.x||x>=o.x+o.w)||!(y<o.y||y>=o.y+o.h));
function bfsPath(goal){
  const sx=S.p.x>>4,sy=(S.p.y-3)>>4,start=sy*MW+sx,prev=new Map([[start,-1]]),q=[start];
  for(let h=0;h<q.length;h++){
    const k=q[h],x=k%MW,y=(k/MW)|0;
    if(goal(x,y)){const p=[];let n=k;while(n!==-1){p.unshift([n%MW,(n/MW)|0]);n=prev.get(n)}return p}
    for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){
      const X=x+a,Y=y+b,K=Y*MW+X;
      if(prev.has(K)||solidCell(W,X,Y,S.open))continue;
      prev.set(K,k);q.push(K);
    }
  }
  return null;
}
const pathTo=o=>bfsPath(adjGoal(o));
const clearLine=(x0,y0,x1,y1)=>{const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/4);for(let i=1;i<=n;i++)if(hit(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n)))return false;return true};
function goTo(goal,o,cell){
  if(G.bot||modal)return;
  const path=bfsPath(goal);
  if(!path){G.walk=null;G.emT=60;G.emC='?';toast(o?'Pas de chemin : une porte reste fermée':'Je ne peux pas aller là');return}
  G.walk={goal,o,path,i:0,life:0,cell};
}
const goObj=o=>{if(o.kind==='suspect')o.hold=120;goTo(adjGoal(o),o,[o.x,o.y])};
function walkStep(){
  const P=S.p,w=G.walk;
  G.wx=G.wy=0;
  if(++w.life>2400){G.walk=null;return}
  if(w.o&&w.o.kind==='suspect')w.o.hold=30;
  // on regarde le plus loin possible : la trajectoire devient une ligne souple
  let j=w.i;
  for(let k=w.i+1;k<w.path.length&&k<w.i+8;k++){const q=w.path[k];if(clearLine(P.x,P.y,q[0]*TS+8,q[1]*TS+11))j=k;else break}
  w.i=j;
  const n=w.path[j];
  if(!n||(j>=w.path.length-1&&Math.hypot(n[0]*TS+8-P.x,n[1]*TS+11-P.y)<3)){
    G.walk=null;G.run=false;
    if(w.o){
      const dx=w.o.x*TS+w.o.w*8-P.x,dy=w.o.y*TS+w.o.h*8-P.y+4;
      P.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);
      interact(w.o);
    }
    return;
  }
  const dx=n[0]*TS+8-P.x,dy=n[1]*TS+11-P.y,d=Math.hypot(dx,dy)||1;
  if(d<3&&j<w.path.length-1){w.i++;return}
  G.wx=dx/d;G.wy=dy/d;G.run=w.path.length-w.i>9;
}
function objRect(o){
  const x=o.x*TS,y=o.y*TS,b=(o.y+o.h)*TS;
  if(o.kind==='suspect')return[Math.round(o.fx-8),Math.round(o.fy-27),16,28];
  if(o.kind==='vitrine')return[x,b-36,TS,36];
  if(o.kind==='fouille'){const h=Math.max(SH[o.name]||TS,o.h*TS);return[x,b-h,o.w*TS,h]}
  return[x,y,o.w*TS,o.h*TS];
}
function objAt(mx,my){
  let best=null,score=-1;const ar=G.area!=null?G.area:c.rc;
  const test=o=>{
    if(!visible(ar,o.kind==='suspect'?(o.fx>>4):o.x,o.kind==='suspect'?((o.fy-3)>>4):o.y))return;
    const[x,y,w,h]=objRect(o);
    if(mx<x||my<y||mx>=x+w||my>=y+h)return;
    const v=(o.kind==='fouille'?0:10000)+(o.y+o.h);
    if(v>score){score=v;best=o}
  };
  W.obj.forEach(test);
  Object.values(W.doors).forEach(d=>{if(!S.open[d.id]&&d.lock!==null)test(d)});
  return best;
}
function mouseScreen(e){const r=$('jeu').getBoundingClientRect();return{x:(e.clientX-r.left)/SC+Math.round(cam.x),y:(e.clientY-r.top)/SC+Math.round(cam.y)}}
function onMapClick(e){
  if(modal||G.bot)return;
  const p=mouseScreen(e),o=objAt(p.x,p.y),cx=p.x>>4,cy=p.y>>4,ar=G.area!=null?G.area:c.rc;
  $('jeu').focus({preventScroll:true});
  (G.rip=G.rip||[]).push({x:p.x|0,y:p.y|0,t:30,o:!!o});
  if(o)return goObj(o);
  if(cx<0||cy<0||cx>=MW||cy>=MH||!visible(ar,cx,cy))return;
  const g=W.gate[cy]&&W.gate[cy][cx];
  if(g&&W.doors[g]&&S.open[g]){
    // une porte ouverte : on passe de l'autre côté
    const d=W.doors[g],a=d.v?[d.x-1,d.y]:[d.x,d.y-1],b=d.v?[d.x+1,d.y]:[d.x,d.y+3],dest=areaIdx(a[0],a[1])===ar?b:a;
    return goTo((x,y)=>x===dest[0]&&y===dest[1],null,dest);
  }
  if(!solidCell(W,cx,cy,S.open))goTo((x,y)=>x===cx&&y===cy,null,[cx,cy]);
}
function onMapHover(e){
  if(!enJeu)return;
  const p=mouseScreen(e);G.mx=p.x;G.my=p.y;
  if(modal||G.bot){G.hover=null;return}
  G.hover=objAt(p.x,p.y);
  $('jeu').style.cursor=G.hover?G.curH:G.curN;
}
const NOM_F={portemanteau:'le porte-manteau',parapluies:'le porte-parapluies',chaussures:'le meuble à chaussures',videpoche:'la console',banc:'le banc',shelf:'la bibliothèque',wardrobe:"l'armoire",locker:'le casier',commode:'la commode',chevet:'la table de chevet',desk:'le bureau',pcdesk:'le poste de travail',cabinet:'le buffet',counter:'le plan de travail',bar:'le comptoir',fridge:'le réfrigérateur',medic:"l'armoire à pharmacie",vanity:'la coiffeuse',sink:'le lavabo',trunk:'la malle',crate:'la caisse',barrel:'le tonneau',fireplace:'la cheminée',washer:'la machine à laver',lift:"l'ascenseur"};
function promptOf(o){
  if(o.kind==='suspect')return`Parler à ${c.suspects[o.s].prenom}`;
  if(o.kind==='vitrine')return`Examiner : ${c.set.rooms[o.room].o}`;
  if(o.kind==='door')return'Porte fermée à clé';
  if(o.kind==='entree')return"Porte d'entrée";
  if(o.kind==='corps')return'Le corps';
  if(S.open[o.id])return'Déjà fouillé';
  if(o.name==='lift')return"Appeler l'ascenseur";
  return NOM_F[o.name]?`Fouiller ${NOM_F[o.name]}`:'Regarder';
}

// ——— Vie du monde ———
const npcLine=(x0,y0,x1,y1)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/6);for(let i=1;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;if(solidCell(W,(x-5)>>4,(y-3)>>4,{})||solidCell(W,(x+5)>>4,(y-3)>>4,{}))return false}return true};
function npcLife(){
  const P=S.p,ar=G.area!=null?G.area:c.rc;
  W.obj.forEach(o=>{
    if(o.kind!=='suspect')return;
    if(o.em>0)o.em--;
    gesteMaj(o);if(o.assis||o.pilote)return;
    const R=reglage(),near=Math.hypot(P.x-o.fx,P.y-o.fy)<R.vue*.7&&visible(ar,o.fx>>4,(o.fy-3)>>4);
    if(o.hold>0)o.hold--;
    if(near||o.hold>0){
      o.mv=false;o.tx=undefined;
      if(near){const dx=P.x-o.fx,dy=P.y-o.fy;o.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);if(!o.seen){o.seen=240;o.em=45;o.emc='!'}}
    }else if(o.seen>0)o.seen--;
    if(!near&&o.hold<=0&&o.tx===undefined&&--o.wait<=0){
      const A=W.rooms[o.room],opts=[];
      for(let i=0;i<8;i++){const x=A.x0+int(Math.random,A.x1-A.x0+1),y=A.y0+1+int(Math.random,A.y1-A.y0),tx=x*TS+8,ty=y*TS+11;if(!solidCell(W,x,y,{})&&Math.hypot(tx-o.fx,ty-o.fy)<70&&npcLine(o.fx,o.fy,tx,ty))opts.push([tx,ty])}
      if(opts.length){o.tx=opts[0][0];o.ty=opts[0][1]}
      o.wait=(120+Math.random()*340)*R.att;
    }
    if(o.tx!==undefined){
      const dx=o.tx-o.fx,dy=o.ty-o.fy,d=Math.hypot(dx,dy);
      if(d<1){o.tx=undefined;o.mv=false}
      else{o.fx+=dx/d*.45*R.npc;o.fy+=dy/d*.45*R.npc;o.mv=true;o.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);o.x=o.fx>>4;o.y=(o.fy-3)>>4}
    }
  });
  if(O.bavard&&!c.test&&tick%520===260&&!G.ambO){
    const ici=W.obj.filter(o=>o.kind==='suspect'&&visible(ar,o.fx>>4,(o.fy-3)>>4));
    if(ici.length){const o=ici[tick%ici.length],a=$('amb'),l=VOIX(o.s).amb;a.textContent=l[(tick>>9)%l.length];a.hidden=false;G.ambO=o;G.ambT=170}
  }
  if(G.ambT>0&&--G.ambT===0){$('amb').hidden=true;G.ambO=null}
}
function update(){
  tick++;
  if(tick%15===0)sonMaj();
  if(!enJeu)return;
  if(G.eclair>0)G.eclair--;if(G.noir>0&&--G.noir===0)toast('La lumière revient',true);
  if(G.fl>0)G.fl--;if(G.emT>0)G.emT--;
  (G.rip||[]).forEach(r=>r.t--);if(G.rip)G.rip=G.rip.filter(r=>r.t>0);
  if(toastT>0&&--toastT===0)$('toast').hidden=true;
  typeBulle();
  if(S&&S.tu)tutoTick();
  if(tick%(O.calme?6:3)===0&&W&&W.furn.some(f=>f.name==='fireplace'))feuPas();
  if(G.pzT)G.pzT();
  if(modal==='cut'&&Cut){stepCut();return}
  if(modal)return;
  npcLife();
  evenements();if(modal)return;
  if(c.test)tickTest();
  if(!G.eclair&&W.windows.length&&!O.calme&&Math.random()<.0014)eclair();
  let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0),f=dx&&dy?.72:1;
  if(G.bot){botStep();dx=G.bvx||0;dy=G.bvy||0;f=1}
  else if(G.walk){
    if(dx||dy)G.walk=null;
    else{walkStep();dx=G.wx||0;dy=G.wy||0;f=1;if(modal)return}
  }
  const P=S.p,sp=(G.bot?2.4:G.run?2.3:1.5)*(O.perso==='rapide'?1.4:1)*f;
  G.moved=false;
  if(dx||dy){
    const a=P.x,b=P.y;
    G.ax=(G.ax||0)+dx*sp;G.ay=(G.ay||0)+dy*sp;
    const mx=Math.trunc(G.ax),my=Math.trunc(G.ay);G.ax-=mx;G.ay-=my;
    for(let i=0;i<Math.abs(mx);i++)move(Math.sign(mx),0);
    for(let i=0;i<Math.abs(my);i++)move(0,Math.sign(my));
    P.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);
    G.moved=a!==P.x||b!==P.y;
    if(O.parts&&G.moved&&tick%(G.run?5:11)===0)parts.push({x:P.x+(Math.random()*6-3),y:P.y,vx:-dx*.2,vy:-.12,l:16,c:'rgba(225,220,200,.6)'});
  }else if(G.mx!==undefined&&tick%12===0){
    const ax=G.mx-P.x,ay=G.my-P.y+10;P.dir=Math.abs(ax)>Math.abs(ay)?(ax>0?1:3):(ay>0?0:2);
  }
  const a=areaIdx(P.x>>4,(P.y-3)>>4);
  if(a>=0&&a!==G.area){
    G.area=a;G.hover=null;if(c.test)entreeTest();
    if(!S.visit[a]){S.visit[a]=1;if(a<c.set.rooms.length&&!c.test){toast(c.set.rooms[a].n,true);render()}}
    miniCarte();
  }
  const nom=G.area!=null&&W.areas[G.area]?W.areas[G.area].name:'';
  if(nom!==G.nomL){G.nomL=nom;$('lieu').textContent=nom;$('lieu').hidden=!nom}
  if(tick%240===0)save();
  if(tick%16===0)miniCarte();
}
function toast(t,bon){const e=$('toast');e.textContent=t;e.className='toast'+(bon?' bon':'');e.hidden=false;toastT=120}

// ——— Documents et objets ———
const croix='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 8c7 6 16 15 26 25M33 6C24 15 15 24 6 33" fill="none" stroke="#2a3a6a" stroke-width="3.4" stroke-linecap="round"/><path d="M9 7c8 7 15 16 25 24" fill="none" stroke="#2a3a6a" stroke-width="1.4" stroke-linecap="round"/></svg>';
function vue(html,apres){
  modal='doc';const e=$('doc');e.hidden=false;
  e.innerHTML=`<div class="vue">${html}<button class="croix" data-a="fermer" aria-label="Fermer">${croix}</button></div>`;
  if(apres)apres(e);
}
function ouvrirDoc(i){
  const d=W.docs[i];
  son('page');vue(DOC_HTML[d.k](d.p),e=>{const n=e.querySelector('.d'),[w,h]=FORMATS[d.k],u=G.url['doc'+d.k]||(G.url['doc'+d.k]=docFond(d.k));n.style.backgroundImage=`url(${u})`;n.style.width=`${w*3}px`;n.style.minHeight=`${h*3}px`;n.style.zoom=Math.min(1,(innerWidth-32)/(w*3))});
  if(S.papiers.includes(i)&&d.lu)return;
  d.lu=1;
  if(!S.papiers.includes(i))S.papiers.push(i);
  if(d.s!==undefined&&!S.docs[d.s]){S.docs[d.s]=1;note('doc',`${d.t} : ${c.suspects[d.s].prenom}`,c.suspects[d.s].doc,'lettre',i)}
  else if(d.fact){apprendre(d.fact.s,d.fact.h);note('doc',d.t,'À relire dans les documents.','lettre',i)}
  else if(d.k!=='autopsie')note('doc',d.t,'À relire dans les documents.','lettre',i);
  save();
}
const nomCle=i=>W.areas[Object.values(W.doors).find(d=>d.lock===i).ferme].name;
function vueObjet(id,titre){
  const o=OBJ[id],tg=o.tags.map(t=>TAG_NOM[t]).join(', ');
  vue(`<div class="d objet"><p class="petit">${esc(titre||'Trouvé')}</p><img alt="" src="${bigIcon(id).toDataURL()}"><h4>${esc(o.nom)}</h4><p class="main">${esc(o.desc)}</p>${tg?`<p class="petit">Utile comme : ${esc(tg)}</p>`:'<p class="petit">Un objet curieux, sans usage évident.</p>'}</div>`);
}
function ouvreBoite(o){
  S.open[o.id]=1;closeAll();G.emT=70;G.emC='!';son('bon');
  const q=o.loot;
  if(!q)return say('Fouille','Rien d\'intéressant, finalement.');
  if(q.t==='cle'){S.cles[q.i]=1;const nom=nomCle(q.i);note('objet',`Clé : ${nom}`,'Elle ouvre cette porte fermée à clé.','cle');return say('Trouvaille',`Une clé ! L'étiquette dit : ${nom}.`)}
  if(q.t==='obj'){if(!S.inv.includes(q.id))S.inv.push(q.id);note('objet',OBJ[q.id].nom,OBJ[q.id].desc,q.id);return vueObjet(q.id)}
  ouvrirDoc(q.i);
}
function enigme(o){
  const E=ENIGMES[o.lock.tag];modal='dlg';
  const btn=S.inv.map(id=>({t:OBJ[id].nom,ic:id,f:()=>{
    if(OBJ[id].tags.includes(o.lock.tag)){toast(E.ok,true);ouvreBoite(o)}
    else{bulle({at:at0(),nom:'Vous',txt:`${OBJ[id].nom} ? Non, ça ne sert à rien ici.`,btn:[{t:'Essayer autre chose',f:()=>enigme(o)},{t:'Laisser',cl:'alt',f:closeAll}]})}
  }}));
  btn.push({t:'Laisser',cl:'alt',f:closeAll});
  bulle({at:at0(),nom:cap(NOM_F[o.name]||'Le meuble'),txt:E.t+(S.inv.length?' Que puis-je utiliser ?':" Je n'ai rien sur moi pour ça."),btn});
}
const puzzleFor=o=>makePuzzle(RNG(o.id*7919+c.seed),o.ptype,{facile:0,moyen:1,difficile:2}[c.key]);
function interact(o){
  if(!o)return;
  if(c.test&&o.kind==='fouille')return fouilleTest(o);
  if(o.kind==='suspect')return talk(o);
  if(o.kind==='vitrine'){const n=inspecter(o.room);return say(cap(c.set.rooms[o.room].o),n.join(' '))}
  if(o.kind==='corps')return ouvrirDoc(W.iAuto);
  if(o.kind==='entree')return say("Porte d'entrée","Elle est condamnée, une grosse barre la bloque. Personne ne sort d'ici tant que l'enquête n'est pas finie.");
  if(o.kind==='door'){
    if(S.cles[o.lock]){S.open[o.id]=1;toast("La porte s'ouvre",true);render();save();return}
    return say('Porte fermée à clé',"Elle ne s'ouvre pas : elle est fermée à clé. Il me faut la clé de cette porte, elle doit être cachée quelque part.");
  }
  if(S.open[o.id])return say('Fouille','Déjà fouillé, il ne reste rien.');
  if(o.lock)return enigme(o);
  if(o.ptype)return openPz(puzzleFor(o),()=>ouvreBoite(o));
  if(!o.loot){S.open[o.id]=1;return say('Fouille',o.text)}
  if(o.mg==='caisse')return openCaisse(o);
  if(o.mg)return openMini(o.mg,()=>ouvreBoite(o),false,o);
  return ouvreBoite(o);
}

// ——— Calepin ———
function pion(i,cl=''){return`<span class="pion ${cl}" title="${esc(c.suspects[i].nom)}">${c.suspects[i].ini}</span>`}
function pNotes(){
  const n=S.cards.length,cases=S.cards.map(k=>`<${k.doc!==undefined?`button data-a="lire" data-v="${k.doc}"`:'div'} class="case k-${k.k}"><span class="t"><img alt="" src="${imgURL(k.ic)}"><span>${esc(k.t)}</span></span><span>${esc(k.x)}</span></${k.doc!==undefined?'button':'div'}>`).join('');
  return`<h2>Mes découvertes</h2>${S.fin?'':'<div class="ligne"><button class="etiq alt" data-a="aide">Demander un indice à Basile</button><span class="petitp">Chaque indice baisse ta note.</span></div>'}${n?`<div class="cases">${cases}</div>`:'<p class="main">Rien pour l\'instant. Parle aux suspects et fouille les pièces.</p>'}`;
}
function pTemoins(){
  const tete=HOURS.map((h,i)=>`<th class="${c.win.includes(i)?'crime':''}">${h}</th>`).join('');
  const lignes=c.suspects.map((su,s)=>`<tr><th><img alt="" src="${imgURL('p'+s)}"><span>${esc(su.prenom)}</span></th>${HOURS.map((_,h)=>{
    const cl=c.win.includes(h)?'crime':'';
    if(!S.asked[s+'-'+h])return`<td class="${cl}"><i>?</i></td>`;
    const st=c.stmts[s][h],a=st.with.map(t=>c.suspects[t].prenom);if(st.vic)a.push(c.vName);
    return`<td class="${cl}"><b>${esc(c.set.rooms[st.room].n)}</b><small>${a.length?'avec '+esc(liste(a)):(su.g==='f'?'seule':'seul')}</small></td>`;
  }).join('')}</tr>`).join('');
  return`<h2>Emploi du temps</h2><p class="main">En rouge, l'heure du meurtre d'après l'autopsie.</p><div class="edt-wrap"><table class="edt"><thead><tr><th></th>${tete}</tr></thead><tbody>${lignes}</tbody></table></div><textarea id="note-t" data-n="t" rows="2" placeholder="Mes notes..." aria-label="Mes notes">${esc(S.notes.t||'')}</textarea>`;
}
function pGens(){
  return`<h2>Les personnages</h2><div class="gens">${c.suspects.map((s,i)=>`<div class="fiche"><img alt="" src="${imgURL('p'+i)}"><span><b>${esc(s.nom)}</b>${esc(s.role)}<br><em>${NIVEAUX[s.niveau-1]}</em>${s.trait?`<br><span class="tr">${esc(s.trait)}</span>`:''}${S.docs[i]?`<br><span class="mb">${esc(cap(s.mobile))}.</span>`:''}</span></div>`).join('')}</div>
  <p class="main">Victime : ${esc(c.vName)}, ${esc(c.vrole)}.</p>`;
}
function pObjets(){
  const cl=Object.keys(S.cles).map(i=>`<div class="objet-c"><img alt="" src="${imgURL('cle')}"><span>Clé : ${esc(nomCle(+i))}</span></div>`).join('');
  const it=S.inv.map(id=>`<button class="objet-c" data-a="objet" data-v="${id}"><img alt="" src="${imgURL(id)}"><span>${esc(OBJ[id].nom)}</span></button>`).join('');
  return`<h2>Mes objets</h2><p class="main">${S.inv.length+Object.keys(S.cles).length} dans ma poche, sur ${W.collectTotal} à trouver ici.</p><div class="objets">${cl}${it}</div>`;
}
function pPapiers(){
  return`<h2>Mes documents</h2><div class="papiers">${S.papiers.map(i=>`<button class="pap" data-a="lire" data-v="${i}"><img alt="" src="${imgURL('lettre')}"><span>${esc(W.docs[i].t)}</span></button>`).join('')}</div>`;
}
function dessinePlan(a){
  const rs=W.areas.flatMap(A=>A.rects),x0=Math.min(...rs.map(q=>q.x0))-1,y0=Math.min(...rs.map(q=>q.y0))-1,x1=Math.max(...rs.map(q=>q.x1))+2,y1=Math.max(...rs.map(q=>q.y1))+2;
  const cw=540,s=cw/(x1-x0),ch=Math.ceil((y1-y0)*s),[k,g]=cv(cw,ch),X=x=>(x-x0)*s,Y=y=>(y-y0)*s,encre='#2a2438';
  G.planT={x0,y0,s};
  R(g,'#eadcb8',0,0,cw,ch);
  // Murs : on trace d'abord tout en encre, puis les sols par-dessus, ainsi les coudes restent d'un seul tenant
  W.areas.forEach(A=>A.rects.forEach(q=>{R(g,encre,X(q.x0)-3,Y(q.y0)-3,(q.x1-q.x0+1)*s+6,(q.y1-q.y0+1)*s+6)}));
  W.areas.forEach((A,i)=>{const col=i===a?'#ffd23f':S.visit[i]?'#f6ecd2':A.room?'#cdbf9f':'#ddd0b0';A.rects.forEach(q=>R(g,col,X(q.x0),Y(q.y0),(q.x1-q.x0+1)*s,(q.y1-q.y0+1)*s))});
  // Meubles des pièces déjà visitées
  W.furn.forEach(f=>{const i=areaIdx(f.x,f.y);if(i>=0&&(S.visit[i]||i===a))R(g,i===a?'#c89a2a':'#c8b48a',X(f.x)+1,Y(f.y)+1,f.w*s-2,f.h*s-2)});
  // Portes
  Object.values(W.doors).forEach(d=>{
    const f=d.lock!==null&&!S.open[d.id],col=f?'#c8483e':'#f6ecd2';
    if(d.v){R(g,encre,X(d.x)-3,Y(d.y)-3,s+6,2*s+6);R(g,col,X(d.x)-3,Y(d.y),s+6,2*s)}
    else{R(g,encre,X(d.x)-3,Y(d.y)-3,2*s+6,3*s+6);R(g,col,X(d.x),Y(d.y)-3,2*s,3*s+6)}
  });
  W.entrees.forEach(q=>R(g,'#c8483e',X(q.x),Y(q.y+2)-5,2*s,5));
  // Le nom de chaque pièce, écrit dedans
  g.textAlign='center';g.textBaseline='middle';
  W.areas.forEach((A,i)=>{
    const q=A.rects.reduce((m,z)=>(z.x1-z.x0)*(z.y1-z.y0)>(m.x1-m.x0)*(m.y1-m.y0)?z:m),l=(q.x1-q.x0+1)*s-10,h=(q.y1-q.y0+1)*s-6,mots=A.name.split(' ');
    for(let t=32;t>=16;t-=1){
      g.font=`400 ${t}px "Patrick Hand",sans-serif`;
      const ls=[];let c0='';mots.forEach(m=>{const e=c0?c0+' '+m:m;if(g.measureText(e).width<=l)c0=e;else{if(c0)ls.push(c0);c0=m}});if(c0)ls.push(c0);
      if(t===16||(ls.length*t*1.02<=h&&ls.every(z=>g.measureText(z).width<=l))){
        const my=Y(q.y0)+(q.y1-q.y0+1)*s/2,mx=X(q.x0)+(q.x1-q.x0+1)*s/2;
        ls.forEach((z,j)=>{const yy=my+(j-(ls.length-1)/2)*t*1.02;g.fillStyle=i===a?'#ffe88a':'rgba(246,236,210,.8)';g.fillText(z,mx+1,yy+1);g.fillStyle=encre;g.fillText(z,mx,yy)});
        break;
      }
    }
  });
  return k;
}
function miniCarte(){
  const k=$('mini');if(!k||!W)return;
  const a=G.area!=null?G.area:c.rc,cle=[a,Object.keys(S.visit).join(),Object.keys(S.open).length,document.fonts&&document.fonts.status].join('|');
  if(G.planK!==cle||!G.plan){G.planK=cle;G.plan=dessinePlan(a);k.width=G.plan.width;k.height=G.plan.height}
  const g=k.getContext('2d'),T=G.planT;g.drawImage(G.plan,0,0);
  const px=(S.p.x/TS-T.x0)*T.s,py=(S.p.y/TS-T.y0)*T.s;g.fillStyle='#fff';g.beginPath();g.arc(px,py,8,0,7);g.fill();g.fillStyle='#d8483e';g.beginPath();g.arc(px,py,6,0,7);g.fill();
  if(G.planCible&&(tick>>4)&1){const[a,b]=G.planCible;g.strokeStyle='#d8483e';g.lineWidth=5;g.beginPath();g.arc((a-T.x0)*T.s,(b-T.y0)*T.s,15,0,7);g.stroke()}
  const e=$('ici'),t=W.areas[a].name;if(e.textContent!==t)e.textContent=t;
}
function ouvrirTribunal(){
  G.choix=[];G.armeC=null;G.heureC=null;modal='tribunal';$('tribunal').hidden=false;tribunal();
}
function tribunal(){
  const n=c.tueurs.length,k=G.choix.length,noms=liste(G.choix.map(i=>c.suspects[i].prenom));
  $('tribunal').innerHTML=`<button class="croix claire" data-a="quittertrib" aria-label="Revenir à l'enquête">${croix}</button>
    <header><p>Parade d'identification</p><h2>${n>1?'Désignez les deux coupables':'Désignez le coupable'}</h2></header>
    <div class="alignes" style="--n:${c.n}">${c.suspects.map((s,i)=>`<button class="aligne ${G.choix.includes(i)?'choisi':''}" data-a="prevenu" data-v="${i}" aria-pressed="${G.choix.includes(i)}"><span class="no">${i+1}</span><img alt="" src="${imgURL('p'+i)}"><b>${esc(s.prenom)}</b><small>${esc(s.role)}</small><i>Accusé${s.g==='f'?'e':''}</i></button>`).join('')}</div>
    <div class="dossier-acc"><div><b>Arme du crime</b><span>${c.set.rooms.map((q,i)=>`<button class="etiq ${G.armeC===i?'actif':''}" data-a="choixarme" data-v="${i}" aria-pressed="${G.armeC===i}">${esc(cap(q.o))}</button>`).join('')}</span></div><div><b>Heure du crime</b><span>${HOURS.map((h,i)=>`<button class="etiq ${G.heureC===i?'actif':''}" data-a="choixheure" data-v="${i}" aria-pressed="${G.heureC===i}">${h}</button>`).join('')}</span></div></div>
    <footer><p>${k?esc(noms)+(k<n?`, il en manque ${n-k}`:''):"Une seule accusation possible. Prenez votre temps."}</p><button class="frapper" data-a="frapper" ${k===n?'':'disabled'}><canvas id="trib-mart" width="76" height="68"></canvas>Rendre le verdict</button></footer>`;
  poseMarteau($('trib-mart'),A_REPOS);
}
function pFin(){
  const f=S.fin;
  return`<h2>${f.win?'Affaire résolue !':(c.tueurs.length>1?"Les assassins m'ont échappé":"L'assassin m'a échappé")}</h2>${pNote()}
  <div class="gens">${c.tueurs.map(i=>`<div class="fiche"><img alt="" src="${imgURL('p'+i)}"><span><b>${esc(c.suspects[i].nom)}</b>${f.win?(c.suspects[i].g==='f'?'Démasquée.':'Démasqué.'):'Ce n\'est pas cette personne que j\'ai arrêtée.'}</span></div>`).join('')}</div>
  ${f.arme!=null||f.heure!=null?`<p class="main">${esc(motDossier())}</p>`:''}<ul class="main">${preuve().map(l=>`<li>${esc(l)}</li>`).join('')}</ul>
  <div class="ligne"><button class="etiq fort" data-a="suite">Enquête suivante</button><button class="etiq" data-a="accueil">Accueil</button></div>`;
}
const TABS={notes:['Notes','#d8483e',pNotes],temoins:['Témoins','#3a7ad8',pTemoins],deduc:['Déductions','#b0406a',pDeduc],gens:['Personnes','#58a65a',pGens],objets:['Objets','#e0a03a',pObjets],papiers:['Documents','#8a5ac8',pPapiers],fin:['Verdict','#ffd23f',pFin]};
function ouvrir(t){
  if(modal==='cut')return;
  if(c&&c.test)return ouvrirTest(t);
  if(!t||t==='calepin')t=G.tab&&['notes','temoins','deduc','gens','objets','papiers'].includes(G.tab)?G.tab:'notes';
  $('bulle').hidden=true;$('pz').hidden=true;$('doc').hidden=true;G.pzT=null;G.mini=null;
  G.tab=t;modal='carnet';son('page');
  const e=$('carnet');e.hidden=false;
  // Marteau, carte et engrenage ont leur icône : ils ne figurent plus parmi les onglets
  const tabs=[...(S.fin?['fin']:[]),'notes','temoins','deduc','gens','objets','papiers'];
  e.innerHTML=`<div class="livret"><div class="spirale" aria-hidden="true"></div><div class="feuille"><button class="croix" data-a="fermer" aria-label="Fermer le calepin">${croix}</button><div class="corps">${TABS[t][2]()}</div></div><nav class="signets" role="tablist">${tabs.map(k=>`<button role="tab" aria-selected="${k===t}" data-a="onglet" data-v="${k}" style="--c:${TABS[k][1]}">${TABS[k][0]}</button>`).join('')}</nav></div>`;
  G.lu=S.cards.length;render();
}
function render(){
  if(!S)return;
  const nv=S.cards.length-(G.lu||0),e=$('neuf');e.hidden=nv<=0||modal==='carnet';e.textContent='+'+nv;
  miniCarte();
}

// ——— Page d'accueil ———
function accueil(){
  closeAll();enJeu=false;$('but').hidden=true;$('tuto-p').hidden=true;['calepin','marteau'].forEach(n=>$(n).classList.remove('appel'));if(S&&!S.fin&&!(c&&c.test))G.sauve=S;
  $('accueil').hidden=false;$('prompt').hidden=true;$('lieu').hidden=true;$('amb').hidden=true;$('hud').hidden=true;
  const n=stats.gagnees,suite=LEVELS.findIndex((l,i)=>!stats.res[i]);
  const dos=LEVELS.map((l,i)=>`<button class="dossier ${stats.res[i]?'fait':''}" data-a="niveau" data-v="${i}"><span class="no">${i+1}</span><span class="nom">${esc(l.nom)}</span><span class="dif">${DIFF[l.diff].label}</span>${stats.res[i]?`<i>Résolu${stats.notes&&stats.notes[i]?' · '+stats.notes[i]:''}</i>`:''}</button>`).join('');
  $('acc-ui').innerHTML=`<div class="acc-g"><h1>Faux<br><span>Alibi</span></h1><p>Dix lieux, cinquante pièces, et à chaque fois quelqu'un qui ment.</p>
    <div class="ligne"><button class="etiq fort" data-a="nouvelle" data-v="${suite<0?int(Math.random,10):suite}">Nouvelle enquête</button>${G.sauve?'<button class="etiq" data-a="continuer">Continuer</button>':''}<button class="etiq" data-a="reglages">Options</button></div></div>
    <div class="acc-d"><div class="tampon"><b>${n}</b><span>enquête${n>1?'s':''} résolue${n>1?'s':''}</span></div><div class="dossiers">${dos}<button class="dossier essai" data-a="test"><span class="no">T</span><span class="nom">Niveau test : 6 interrogatoires</span><span class="dif">Essai</span></button></div></div>`;
}
// ——— Options : une fenêtre unique, depuis l'accueil comme depuis le jeu ———
const OPTS=[
  ['texte','Vitesse du texte',[['lent','Lente'],['normal','Normale'],['rapide','Rapide'],['direct','Immédiate']]],
  ['perso','Vitesse du personnage',[['normal','Normale'],['rapide','Rapide']]],
  ['zoom','Taille de la carte',[['petit','Petite'],['auto','Automatique'],['grand','Grande']]],
  ['diff','Difficulté',[['auto','Selon le niveau'],['facile','Facile'],['moyen','Moyenne'],['difficile','Difficile']]],
  ['scenario',"Scénario d'ouverture",[[1,'Oui'],[0,'Non']]],
  ['bavard','Bavardages des suspects',[[1,'Oui'],[0,'Non']]],
  ['labels','Noms au survol',[[1,'Oui'],[0,'Non']]],
  ['parts','Poussière et particules',[[1,'Oui'],[0,'Non']]],
  ['pluie',"Pluie sur l'accueil",[[1,'Oui'],[0,'Non']]],
  ['calme','Animations réduites',[[0,'Non'],[1,'Oui']]],
  ['sons','Sons',[[1,'Oui'],[0,'Non']]],
  ['musique','Musique',[[1,'Oui'],[0,'Non']]]
];
const CURSEURS=[['vol','Volume',0,100],['lum','Lumière des pièces',0,100],['txt','Taille du texte',90,130]];
function appliqueOpts(){
  document.documentElement.style.setProperty('--txt',O.txt/100);
  document.body.classList.toggle('calme',!!O.calme);
  fit();
  if(enJeu&&W){G.light=buildLight()}
  if(!O.labels)$('prompt').hidden=true;
}
function ouvrirOptions(){
  const e=$('options');e.hidden=false;
  e.innerHTML=`<div class="fiche-pz opts"><button class="croix" data-a="fermeropts" aria-label="Fermer les options">${croix}</button><h3>Options</h3>
    <div class="lignes">${OPTS.map(([k,t,l])=>`<div class="opt"><span>${t}</span><div class="ligne">${l.map(([v,n])=>`<button class="etiq ${O[k]==v?'actif':''}" data-o="${k}" data-v="${v}" aria-pressed="${O[k]==v}">${n}</button>`).join('')}</div></div>`).join('')}
    ${CURSEURS.map(([k,t,a,b])=>`<div class="opt"><label for="o-${k}">${t}</label><input id="o-${k}" type="range" min="${a}" max="${b}" value="${O[k]}" data-c="${k}"></div>`).join('')}</div>
    <div class="ligne">${enJeu?'<button class="etiq" data-a="accueil">Retour à l\'accueil</button><button class="etiq" data-a="revoir">Revoir le scénario</button>'+(c&&!c.test?'<button class="etiq" data-a="retuto">Refaire le tutoriel</button>':''):''}<button class="etiq alt" data-a="raz">Effacer ma progression</button></div>
    <h4>Atelier</h4><div class="ligne">${Object.keys(PTYPES).map(t=>`<button class="etiq" data-a="essai" data-v="${t}">${PTYPES[t]}</button>`).join('')}${Object.keys(MINIS).map(t=>`<button class="etiq" data-a="mini" data-v="${t}">${MINIS[t]}</button>`).join('')}</div></div>`;
}

// ——— Marteau : chaque position est redessinée, comme une vraie animation en pixels ———
const A_REPOS=58,A_SURVOL=63,A_ELAN=78,A_IMPACT=45,I_MARTEAU={};
function imageMarteau(a,choc){const k=a+'|'+(choc||0);return I_MARTEAU[k]||(I_MARTEAU[k]=gavelFrame(a,choc))}
function poseMarteau(k,a,choc){const g=k.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,k.width,k.height);g.drawImage(imageMarteau(a,choc),0,0)}
function frappe(k,fin){
  if(G.frappe)return;
  if(O.calme)return fin();
  G.frappe=true;
  const suite=[[62,50],[67,50],[73,50],[A_ELAN,150],[70,30],[62,30],[52,30],[A_IMPACT,80,1,1],[51,50],[48,40],[A_IMPACT,70,2],[50,60],[54,60],[A_REPOS,110]];
  let i=0;
  const pas=()=>{
    if(i>=suite.length){G.frappe=false;return fin()}
    const[a,d,ch,bruit]=suite[i++];
    poseMarteau(k,a,ch);if(bruit)son('marteau');
    setTimeout(pas,d);
  };
  pas();
}
// ——— Énigmes ———
let PZ=null;
function pzOpen(){modal='pz';$('pz').hidden=false}
function openPz(p,onWin,free){
  const z=PZ={p,onWin,free,msg:'',input:''};G.pzT=null;G.mini=null;pzOpen();pzRender();
  const i=$('pz-in');if(i)i.focus({preventScroll:true});
  if(!free)setTimeout(()=>{if(PZ===z&&modal==='pz'){z.aide=1;pzRender()}},45000);
}
function pzOK(){
  const z=PZ;stats.enigmes++;save();
  if(z.free){closeAll();if(enJeu)toast('Bravo, énigme résolue',true);return}
  $('pz').hidden=true;modal=null;z.onWin();render();
}
function pzTry(v){if(puzzleWon(PZ.p,v))pzOK();else{PZ.msg="Ce n'est pas ça.";pzRender()}}
function pzRender(){
  const z=PZ,p=z.p;let h=`<h3>${PTYPES[p.type]}</h3>`,field=false;
  if(p.type==='code'){h+=`<p>Une serrure à combinaison. Trouve le code de ${p.len} chiffres, tous différents.</p><div class="clue">${p.clues.map(q=>`<span><span class="code">${q.g}</span> : ${q.b} bien placé${q.b>1?'s':''}, ${q.m} mal placé${q.m>1?'s':''}</span>`).join('')}</div>`;field=1}
  if(p.type==='suite'){h+=`<p>Une série griffonnée sur le bois. Quel nombre vient ensuite ?</p><p class="code">${p.terms.join('  ')}  ?</p>`;field=1}
  if(p.type==='anagramme'){h+=`<p>Des lettres gravées dans le désordre. ${esc(p.def)}.</p><p class="code">${p.scrambled}</p>`;field=1}
  if(p.type==='cesar'){h+=`<p>Un billet codé, chaque lettre est décalée. Tourne le cadran, puis tape le dernier mot.</p><p class="mono">${esc(caesar(p.cipher,-p.shift))}</p><label>Décalage <input id="pz-sh" type="range" min="0" max="25" value="${p.shift}"></label>`;field=1}
  if(p.type==='ordre'){h+=`<div class="clue">${p.txt.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p>Ordre : ${p.pick.join(' → ')||'...'}</p><div class="ligne">${p.names.filter(n=>!p.pick.includes(n)).map(n=>`<button class="etiq" data-l="${n}">${n}</button>`).join('')}</div>`}
  if(p.type==='lumieres'){h+=`<p>Un boîtier à voyants. Éteins tout : chaque voyant inverse aussi ses voisins.</p><div class="pgrid" style="grid-template-columns:repeat(${p.n},46px)">${p.grid.map((v,i)=>`<button class="${v?'on':''}" data-g="${i}" aria-label="Voyant ${i+1}"></button>`).join('')}</div>`}
  if(p.type==='taquin'){h+=`<p>Un mécanisme à tuiles. Remets les nombres dans l'ordre, la case vide à la fin.</p><div class="pgrid" style="grid-template-columns:repeat(3,46px)">${p.b.map((v,i)=>`<button class="${v?'':'x'}" data-g="${i}">${v||''}</button>`).join('')}</div>`}
  if(p.type==='tuyaux'){
    const fl=pipeFlow(p).seen,seg=(m,col)=>[[1,'15,15,15,0'],[2,'15,15,30,15'],[4,'15,15,15,30'],[8,'15,15,0,15']].filter(a=>m&a[0]).map(a=>{const q=a[1].split(',');return`<line x1="${q[0]}" y1="${q[1]}" x2="${q[2]}" y2="${q[3]}" stroke="${col}" stroke-width="7"/>`}).join('');
    h+=`<p>Tourne les pièces pour relier la gauche (ligne ${p.y0+1}) à la droite (ligne ${p.y1+1}).</p><div class="pgrid" style="grid-template-columns:repeat(${p.n},46px)">${p.cells.map((m,i)=>`<button data-g="${i}" aria-label="Pièce ${i+1}"><svg viewBox="0 0 30 30">${seg(m,fl.has(i)?'#a33a3a':'#5a6a8a')}</svg></button>`).join('')}</div>`;
  }
  if(p.type==='menteur'){h+=`<p>Une seule de ces phrases est vraie. Où est la clé ?</p><div class="clue">${p.st.map((s,i)=>`<span><b>${p.who[i]} :</b> ${esc(s.txt)}</span>`).join('')}</div><div class="ligne">${['A','B','C'].map(x=>`<button class="etiq" data-m="${x}">Tiroir ${x}</button>`).join('')}</div>`}
  if(field)h+=`<form id="pz-f" class="ligne"><input id="pz-in" type="text" autocomplete="off" aria-label="Réponse" value="${esc(z.input)}"><button class="etiq">Valider</button></form>`;
  if(z.msg)h+=`<p class="err">${esc(z.msg)}</p>`;
  h+=`<div class="ligne">${z.aide?'<button class="etiq alt" data-x="force">Forcer la serrure</button>':''}<button class="etiq alt" data-x="ferme">Plus tard</button></div>`;
  $('pz').innerHTML=`<div class="fiche-pz">${h}</div>`;
}
function pzClick(ev){
  const b=ev.target.closest('button');if(!b)return;
  if(b.dataset.x==='ferme')return closeAll();
  if(G.mini&&b.dataset.k!==undefined)return G.mini(b);
  const z=PZ,p=z&&z.p;if(!p)return;
  if(b.dataset.x==='force'){$('pz').hidden=true;modal=null;z.onWin();render();save();return}
  if(b.dataset.l){p.pick.push(b.dataset.l);if(p.pick.length===p.names.length){if(puzzleWon(p))return pzOK();p.pick=[];z.msg='Mauvais ordre, les leviers se remettent à zéro.'}pzRender();return}
  if(b.dataset.m)return pzTry(b.dataset.m);
  if(b.dataset.g!==undefined){
    const i=+b.dataset.g;
    if(p.type==='lumieres')lightPress(p,i);if(p.type==='taquin')taquinMove(p,i);if(p.type==='tuyaux')p.cells[i]=rot(p.cells[i]);
    if(puzzleWon(p))return pzOK();pzRender();
  }
}

// ——— Fouille d'une caisse : rien n'est signalé, c'est à toi de repérer ce qui détonne ———
function openCaisse(o){
  const fam=o.name==='trunk'?'trunk':'crate',s=(o.id*13+c.seed)%9973,[fk,fg]=cv(SCENE_W,SCENE_H),q0=o.loot;
  const Sc=remplitCaisse(fam,s,icone(q0.t==='obj'?q0.id:q0.t==='cle'?'cle':'lettre'));
  fondCaisse(fg,fam,s);
  PZ=null;G.mini=null;pzOpen();son('page');
  $('pz').innerHTML=`<div class="fiche-pz"><h3>${esc(cap(NOM_F[o.name]||'La caisse'))}</h3><p id="sc-m">Sors ce qu'il y a là-dedans. Quelque chose n'a sûrement rien à faire ici.</p><canvas id="sc" class="scene-c" width="${SCENE_W}" height="${SCENE_H}"></canvas><div class="ligne"><button class="etiq alt" data-x="ferme">Refermer</button></div></div>`;
  const k=$('sc'),dit=t=>{$('sc-m').textContent=t};
  let prise=null,mx=0,my=0,bouge=0,attente=0;
  const pos=e=>{const q=k.getBoundingClientRect();return[(e.clientX-q.left)/q.width*SCENE_W,(e.clientY-q.top)/q.height*SCENE_H]};
  // Un clic pose l'objet à côté de la caisse
  const sort=q=>{const g0=q.x+q.w/2<SCENE_W/2,cote=g0?-q.w*.35:SCENE_W-q.w*.65;q.tx=cote+int(Math.random,18)-9;q.ty=Math.max(-6,Math.min(SCENE_H-q.h+6,q.y+int(Math.random,40)-20))};
  k.addEventListener('pointerdown',e=>{
    const[x,y]=pos(e);try{k.setPointerCapture(e.pointerId)}catch(_){}
    for(let i=Sc.o.length-1;i>=0;i--){const q=Sc.o[i];if(touche(q,x,y)){prise=q;mx=x-q.x;my=y-q.y;bouge=0;q.tx=q.ty=undefined;Sc.o.splice(i,1);Sc.o.push(q);dit(q.nom);return}}
    const t=Sc.t;if(x>=t.x+2&&x<t.x+t.w-2&&y>=t.y+2&&y<t.y+t.h-2){Sc.pris=true;G.pzT=null;ouvreBoite(o)}
  });
  k.addEventListener('pointermove',e=>{if(!prise)return;const[x,y]=pos(e);bouge+=Math.abs(x-mx-prise.x)+Math.abs(y-my-prise.y);prise.x=x-mx;prise.y=y-my});
  k.addEventListener('pointerup',()=>{if(!prise)return;if(bouge<5)sort(prise);prise=null});
  G.pzT=()=>{
    if(!$('sc'))return;
    Sc.o.forEach(q=>{if(q.tx!==undefined){q.x+=(q.tx-q.x)*.2;q.y+=(q.ty-q.y)*.2}});
    if(tick%20===0&&Sc.vus().length>=Sc.total)attente+=20;
    if(attente>360)Sc.brille=true;
    dessineScene(k,fk,Sc,tick);
  };
  Sc.total=Math.floor(Sc.t.w*Sc.t.h/16*.8);
  dessineScene(k,fk,Sc,tick);
}

// ——— Mini-jeux de fouille : courts, adaptés au meuble, sans échec définitif ———
const MINIS={ecriture:'Comparer les écritures',empreinte:'Relever une empreinte',dechiree:'Recoller une lettre',livres:'Ranger les livres',cintres:'Fouiller les poches',poussiere:'Dégager les cendres',crochet:'Crocheter le tiroir',memo:'Paires de flacons',tatons:'Chercher à tâtons'};
function livreImg(b){
  const[k,g]=cv(16,64),h=b.h;
  box(g,1,64-h,14,h,b.col);R(g,tone(b.col,.3),3,64-h+2,1,h-4);R(g,'#e0c060',2,64-h+6,12,1);R(g,'#e0c060',2,64-h+8,12,1);R(g,'#e0c060',2,62,12,1);
  R(g,'#fff4d8',5,64-h+13,6,9);R(g,'#141226',7,64-h+15,2,5);if(b.n>1)R(g,'#141226',9,64-h+15,1,5);if(b.n>3)R(g,'#141226',5,64-h+15,1,5);if(b.n>5)R(g,'#141226',6,64-h+20,4,1);
  return k.toDataURL();
}
function habitImg(i){
  // Un vrai vêtement sur son cintre
  const[k,g]=cv(66,96),q=fabrique(['veste','chemise','pull','veste','robe','chemise'][i%6],i+3,0);
  g.imageSmoothingEnabled=false;R(g,'#8a939e',32,0,2,8);R(g,'#c8ccd4',31,0,3,2);R(g,'#8a939e',18,8,30,2);g.drawImage(q.sp,(66-q.w)>>1,8);
  return k.toDataURL();
}
function openMini(type,win,free,o){
  G.ic=G.ic||{};G.url=G.url||{};
  PZ=null;G.mini=null;G.pzT=null;pzOpen();son('page');
  const fam=['ecriture','empreinte','dechiree'].includes(type)?'tiroir':(o&&FOND_MEUBLE[o.name])||FOND_DEFAUT[type],s=o?(o.id*13+c.seed)%9973:7,cle='f'+fam+s,fond=G.url[cle]||(G.url[cle]=fondMeuble(fam,s).toDataURL());
  const nom=o&&NOM_F[o.name]?cap(NOM_F[o.name]):MINIS[type],q0=o&&o.loot,spr=icone(q0?(q0.t==='obj'?q0.id:q0.t==='cle'?'cle':'lettre'):'lettre');
  const done=()=>{G.pzT=null;G.mini=null;if(free){closeAll();toast('Bien joué',true);return}win()};
  const shell=(txt,inner)=>{$('pz').innerHTML=`<div class="fiche-pz"><h3>${esc(nom)}</h3><p id="mg-t">${esc(txt)}</p><div class="meuble" style="background-image:url(${fond})">${inner}</div><div class="ligne"><button class="etiq alt" data-x="ferme">Refermer</button></div></div>`};
  if(miniPlus(type,shell,done))return;
  if(type==='livres'){
    const cols=['#a33a3a','#d8703a','#d8b83a','#3d7a4c','#2e6a8c','#6b3d78'],nb=6;
    const regles=[['Du plus petit au plus grand.',b=>b.h],["Dans l'ordre des numéros au dos.",b=>b.n],["Dans l'ordre des couleurs : rouge, orange, jaune, vert, bleu, violet.",b=>cols.indexOf(b.col)]];
    const reg=regles[int(Math.random,3)];
    const hauteurs=shuffle(Math.random,[34,38,42,46,50,56]),nums=shuffle(Math.random,range(nb).map(i=>i+1));
    let bs=shuffle(Math.random,cols.map((col,i)=>({col,h:hauteurs[i],n:nums[i]}))),sel=null;
    const ok=()=>bs.every((b,i)=>!i||reg[1](bs[i-1])<reg[1](b));
    while(ok())bs=shuffle(Math.random,bs);
    const dessin=()=>shell(`Un mot glissé entre les livres : « ${reg[0]} » Clique deux livres pour les échanger.`,`<div class="rayon">${bs.map((b,i)=>`<button data-k="${i}" class="${sel===i?'sel':''}" aria-label="Livre ${b.n}"><img alt="" src="${livreImg(b)}"></button>`).join('')}</div>`);
    dessin();
    G.mini=b=>{const i=+b.dataset.k;if(sel===null)sel=i;else{[bs[sel],bs[i]]=[bs[i],bs[sel]];sel=null;if(ok())return done()}dessin()};
  }
  if(type==='cintres'){
    const n=fam==='casier'?4:6,tg=int(Math.random,n),vu={},rien=['Rien.','Un vieux ticket sans intérêt.','Une pastille à la menthe.','Du sable.','Un bouton décousu.'],im=range(n).map(habitImg),pas=n===4?22:15.4,dep=n===4?7:3;
    const dessin=t=>shell(t,im.map((u,i)=>`<button class="cintre ${vu[i]?'vu':''}" style="left:${dep+i*pas}%" data-k="${i}" aria-label="Vêtement ${i+1}"><img alt="" src="${u}"></button>`).join(''));
    dessin('Quelque chose pèse dans une de ces poches. Clique sur un vêtement pour le fouiller.');
    G.mini=b=>{const i=+b.dataset.k;if(i===tg)return done();vu[i]=1;dessin(rien[i%rien.length])};
  }
  if(type==='poussiere'){
    shell('Écarte les cendres avec la souris : quelque chose a été glissé dessous.','<canvas id="mg-c" class="cendres" width="320" height="200"></canvas>');
    const k=$('mg-c'),g=k.getContext('2d'),[d,h]=cv(320,200),sx=70+int(Math.random,150),sy=118+int(Math.random,18);g.imageSmoothingEnabled=false;
    for(let y=104;y<198;y++)for(let x=10;x<310;x++){const b=Math.min(y-104+noise(x>>3,1,5)*12,x-10,309-x);if(b>6)R(h,tone('#8a8478',(noise(x>>1,y>>1,3)-.5)*.34),x,y)}
    if(!FEU.k)feuPas();
    const paint=()=>{if(!$('mg-c'))return;g.clearRect(0,0,320,200);g.drawImage(FEU.k,104,6,112,92);g.drawImage(spr,sx,sy,56,56);g.drawImage(d,0,0)};paint();
    G.pzT=paint;
    let on=false,pas=0;
    const rub=e=>{
      const r=k.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*320|0,y=(e.clientY-r.top)/r.height*200|0;
      h.clearRect(x-12,y-9,25,19);paint();
      if(pas++%5===0){const a=h.getImageData(sx,sy,56,56).data;let reste=0;for(let i=3;i<a.length;i+=4)if(a[i])reste++;if(reste<56*56*.28)done()}
    };
    k.addEventListener('pointerdown',e=>{on=true;rub(e)});k.addEventListener('pointermove',e=>{if(on||e.pointerType==='mouse')rub(e)});k.addEventListener('pointerup',()=>{on=false});
  }
  if(type==='crochet'){
    let pas=0,x=0,v=1.5,z=[40,20];
    const dessin=()=>{shell(`Le crochet est dans la serrure. Clique quand le curseur passe dans la zone verte. Goupille ${pas+1} sur 3.`,`<div class="serrure"><div class="gp">${[0,1,2].map(i=>`<i class="${i<pas?'ok':''}"></i>`).join('')}</div><div class="tir"><i style="left:${z[0]}%;width:${z[1]}%"></i><u id="mg-u" style="left:${x}%"></u></div><button class="etiq" data-k="1" id="mg-b">Maintenant !</button></div>`);$('mg-b').focus({preventScroll:true})};
    dessin();
    G.pzT=()=>{x+=v;if(x>=98||x<=0)v=-v;const u=$('mg-u');if(u)u.style.left=x+'%'};
    G.mini=()=>{
      if(x>=z[0]-2&&x<=z[0]+z[1]){pas++;if(pas>=3)return done();z=[10+Math.random()*65,20-pas*4];v=Math.sign(v)*(1.5+pas*.4);dessin()}
      else $('mg-t').textContent='Raté, le crochet glisse. Réessaie.';
    };
  }
  if(type==='memo'){
    const fr=fam==='frigo',ics=fr?['bocal','conserve','whisky']:['flacon','tube','pansement'],deck=shuffle(Math.random,[...ics,...ics]),srcs={},ferme=boiteImg(fam);let show=[],ok=new Set(),lock=false;
    ics.forEach(i=>{srcs[i]=(fr?fabrique(i,3,0).sp:iconSprite(i)).toDataURL()});
    const dessin=()=>shell(fr?'Retrouve les trois paires de boîtes pour vider le rayon.':"Retrouve les trois paires pour vider l'armoire à pharmacie.",deck.map((d,i)=>`<button class="boite" style="left:${14+(i%3)*26}%;bottom:${i<3?53:13}%" data-k="${i}" aria-label="Boîte ${i+1}"><img alt="" src="${show.includes(i)||ok.has(i)?srcs[d]:ferme}"></button>`).join(''));
    dessin();
    G.mini=b=>{
      if(lock)return;const i=+b.dataset.k;if(show.includes(i)||ok.has(i))return;
      show.push(i);dessin();
      if(show.length===2){
        lock=true;
        setTimeout(()=>{if(deck[show[0]]===deck[show[1]]){ok.add(show[0]);ok.add(show[1])}show=[];lock=false;if(ok.size===6)return done();if(modal==='pz')dessin()},450);
      }
    };
  }
  if(type==='tatons'){
    const W0=5,H0=4,tg=[Math.random()*W0|0,Math.random()*H0|0],vu={};
    const dessin=()=>shell("On n'y voit rien là-dedans. Tâte le fond : plus la zone est rouge, plus tu es proche.",`<div class="tatons">${range(W0*H0).map(i=>`<button data-k="${i}" class="${vu[i]||''}" aria-label="Zone ${i+1}"></button>`).join('')}</div>`);
    dessin();
    G.mini=b=>{
      const i=+b.dataset.k,x=i%W0,y=i/W0|0,d=Math.abs(x-tg[0])+Math.abs(y-tg[1]);
      if(d===0)return done();
      vu[i]=d===1?'proche':d===2?'moyen':'loin';dessin();
    };
  }
}

// ——— Robot de test : il marche vraiment et déduit l'assassin avec le solveur ———
function botGoals(){
  const o=[];
  for(const i of c.needed){
    if(i.t==='s'&&!S.asked[i.s+'-'+i.h])o.push({o:W.obj.find(q=>q.kind==='suspect'&&q.s===i.s),h:i.h});
    if(i.t==='r'&&!S.seenRooms[i.room])o.push({o:W.obj.find(q=>q.kind==='vitrine'&&q.room===i.room)});
  }
  return o;
}
function botKeys(){
  const o=[];
  Object.values(W.doors).forEach(d=>{if(d.lock!==null&&!S.open[d.id]&&S.cles[d.lock])o.push({o:d})});
  W.obj.forEach(q=>{if(q.kind==='fouille'&&!S.open[q.id]&&q.loot&&q.loot.t==='cle')o.push({o:q})});
  return o;
}
function botAct(g){
  const o=g.o;
  if(o.kind==='suspect')apprendre(o.s,g.h);
  else if(o.kind==='vitrine')inspecter(o.room);
  else if(o.kind==='door')S.open[o.id]=1;
  else{S.open[o.id]=1;if(o.loot.t==='cle')S.cles[o.loot.i]=1}
  G.bgoal=null;
}
function botAccuse(){
  const known={stm:(s,h)=>!!S.asked[s+'-'+h],room:r=>!!S.seenRooms[r]},w=solve(c,known),pistes=new Set(w.map(x=>x.L.join()));
  G.botProof={worlds:w.length,who:pistes.size};
  stopBot();
  startVerite(w[0].L);
}
function botStep(){
  const P=S.p;
  if(!G.bgoal){
    if(S.fin)return stopBot();
    const goals=botGoals();
    if(!goals.length)return botAccuse();
    let found=null;
    for(const g of goals){const p=pathTo(g.o);if(p&&(!found||p.length<found.p.length))found={g,p}}
    if(!found)for(const g of botKeys()){const p=pathTo(g.o);if(p&&(!found||p.length<found.p.length))found={g,p}}
    if(!found){G.botStuck=(G.botStuck||0)+1;if(G.botStuck>3)return stopBot();return}
    G.bgoal=found.g;G.bpath=found.p;G.bi=0;G.blife=0;if(found.g.o.kind==='suspect')found.g.o.hold=2000;
  }
  const n=G.bpath[G.bi];
  if(!n){botAct(G.bgoal);G.bvx=G.bvy=0;return}
  const dx=n[0]*TS+8-P.x,dy=n[1]*TS+11-P.y;
  if(Math.abs(dx)<3&&Math.abs(dy)<3){G.bi++;return}
  G.bvx=Math.abs(dx)>=3?Math.sign(dx):0;G.bvy=Math.abs(dy)>=3?Math.sign(dy):0;
  if(++G.blife>1200)G.bgoal=null;
}
function stopBot(){G.bot=false;G.bgoal=null;G.bvx=G.bvy=0;render()}
function startBot(){skipCut();closeAll();S.introDone=true;G.robot=true;G.bot=true;G.bgoal=null;G.botStuck=0;render()}

// ——— Entrées ———
const KEYMAP={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'up',w:'up',s:'down',q:'left',a:'left',d:'right',Z:'up',W:'up',S:'down',Q:'left',A:'left',D:'right'};
function onKey(e,v){
  const tag=e.target.tagName;
  if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA'){if(e.key==='Escape'&&v&&modal)closeAll();return}
  if(!enJeu)return;
  if(modal==='cut'){if(v&&(e.key===' '||e.key==='Enter')){e.preventDefault();cutClick()}return}
  if(e.key==='Escape'&&v){if(modal)closeAll();return}
  if(modal)return;
  const k=KEYMAP[e.key];
  if(k){keys[k]=v?1:0;e.preventDefault();if(v&&tag==='BUTTON')e.target.blur()}
}
function pret(){
  G.curN=`url(${pixelCursor(false)}) 8 8, crosshair`;G.curH=`url(${pixelCursor(true)}) 9 2, pointer`;
  document.documentElement.style.setProperty('--grain',`url(${paperTexture()})`);
  addEventListener('keydown',e=>onKey(e,1));addEventListener('keyup',e=>onKey(e,0));
  addEventListener('blur',()=>{keys.up=keys.down=keys.left=keys.right=0});
  new ResizeObserver(fit).observe($('app'));
  document.addEventListener('click',e=>{
    const oBtn=e.target.closest('[data-o]');
    if(oBtn){son('clic');const k=oBtn.dataset.o,v=oBtn.dataset.v;O[k]=isNaN(+v)?v:+v;save();appliqueOpts();return ouvrirOptions()}
    if(modal==='cut'&&!e.target.closest('#options')){if(e.target.id!=='passer'&&!e.target.closest('#engrenage'))cutClick();return}
    if(e.target.closest('button'))son('clic');
    const b=e.target.closest('[data-a]');if(!b)return;
    const a=b.dataset.a,v=b.dataset.v;
    if(a==='vote'){const[k,x]=v.split(':');stats.sys=stats.sys||{};stats.sys[k]=x;save();return ouvrirTest()}
    if(a==='tem')return choisirTem(v);
    if(a==='comparer')return comparer();
    if(a==='aide'){const t=aideTexte();closeAll();return say('Basile',t,null,G.porBa)}
    if(a==='test')return neuf(10,4321,false);
    if(a==='onglet')return ouvrir(v);
    if(a==='fermer'){if(modal==='doc'&&G.tab&&!$('carnet').hidden){$('doc').hidden=true;modal='carnet';return}return closeAll()}
    if(a==='lire')return ouvrirDoc(+v);
    if(a==='objet')return vueObjet(v,'Dans ma poche');
    if(a==='nouvelle'||a==='niveau')return neuf(+v);
    if(a==='continuer')return continuer();
    if(a==='reglages'){
      const r0=$('engrenage');son('rouage');r0.classList.remove('tourne');void r0.offsetWidth;r0.classList.add('tourne');
      if(enJeu&&modal==='cut')return;
      if(!enJeu)return ouvrirOptions();
      closeAll();return ouvrirOptions();
    }
    if(a==='fermeropts'){$('options').hidden=true;if(enJeu)modal=null;return}
    if(a==='marteau'){
      closeAll();modal='opts';
      return frappe($('mart'),()=>{modal=null;if(S.fin)ouvrir('fin');else ouvrirTribunal()});
    }
    if(a==='prevenu'){
      const i=+v,n=c.tueurs.length;
      G.choix=G.choix.includes(i)?G.choix.filter(x=>x!==i):(n===1?[i]:[...G.choix,i].slice(-n));
      return tribunal();
    }
    if(a==='choixarme'){G.armeC=G.armeC===+v?null:+v;return tribunal()}
    if(a==='choixheure'){G.heureC=G.heureC===+v?null:+v;return tribunal()}
    if(a==='quittertrib'){$('tribunal').hidden=true;modal=null;G.choix=[];return}
    if(a==='frapper'){
      const l=G.choix.slice();
      return frappe($('trib-mart'),()=>{$('tribunal').hidden=true;modal=null;startVerite(l)});
    }
    if(a==='raz'){b.dataset.a='raz2';b.textContent='Vraiment tout effacer ?';return}
    if(a==='raz2'){stats={gagnees:0,serie:0,enigmes:0,res:{}};G.sauve=null;S=null;save();return accueil()}
    if(a==='accueil'){$('options').hidden=true;return accueil()}
    if(a==='suite'){const n=LEVELS.findIndex((l,i)=>!stats.res[i]);return neuf(n<0?(S.lv+1)%10:n)}
    if(a==='revoir'){closeAll();return startIntro()}
    if(a==='retuto'){closeAll();stats.tuto=0;save();return tutoLance()}
    if(a==='passertuto')return tutoFin();
    if(a==='essai'){const j=enJeu;closeAll();if(!j)$('hud').hidden=true;return openPz(makePuzzle(RNG((Math.random()*1e9)|0),v,1),null,true)}
    if(a==='mini'){const j=enJeu;closeAll();if(!j)$('hud').hidden=true;return openMini(v,null,true)}
  });
  document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='pz-f'){PZ.input=$('pz-in').value;pzTry(PZ.input)}});
  document.addEventListener('input',e=>{const d=e.target.dataset;if(!d)return;if(d.n!==undefined){S.notes[d.n]=e.target.value;save()}if(d.c){O[d.c]=+e.target.value;save();appliqueOpts()}});
  $('passer').addEventListener('click',skipCut);
  $('jeu').addEventListener('click',onMapClick);
  $('jeu').addEventListener('mousemove',onMapHover);
  $('jeu').addEventListener('mouseleave',()=>{G.hover=null;G.mx=undefined});
  const nomCarte=e=>{const k=$('mini'),T=G.planT,n=$('plan-nom');if(!T||!W)return;const r=k.getBoundingClientRect(),f=k.width/r.width,a=areaIdx(Math.floor((e.clientX-r.left)*f/T.s+T.x0),Math.floor((e.clientY-r.top)*f/T.s+T.y0));n.hidden=a<0;if(a>=0)n.textContent=W.areas[a].name;clearTimeout(G.pnT);if(e.pointerType!=='mouse')G.pnT=setTimeout(()=>{n.hidden=true},1800)};
  $('mini').addEventListener('pointermove',nomCarte);$('mini').addEventListener('pointerdown',nomCarte);$('mini').addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')$('plan-nom').hidden=true});
  $('pz').addEventListener('click',pzClick);
  $('pz').addEventListener('input',e=>{if(e.target.id==='pz-sh'){PZ.p.shift=+e.target.value;PZ.input=($('pz-in')||{}).value||'';pzRender()}else if(e.target.id==='pz-in')PZ.input=e.target.value});
  chargeStats();appliqueOpts();
  $('eng1').style.backgroundImage=`url(${gearSprite(44,10,'#d8a840').toDataURL()})`;
  poseMarteau($('mart'),A_REPOS);
  $('marteau').addEventListener('mouseenter',()=>{if(!G.frappe)poseMarteau($('mart'),A_SURVOL)});
  $('marteau').addEventListener('mouseleave',()=>{if(!G.frappe)poseMarteau($('mart'),A_REPOS)});
  accueil();
  let last=performance.now(),acc=0;
  const loop=n=>{
    acc+=Math.min(100,n-last);last=n;
    while(acc>=16.6){update();acc-=16.6}
    draw();
    if(enJeu){const hov=modal||!O.labels?null:G.hover,e=$('prompt'),t=hov?promptOf(hov):'';if(t!==G.pt){G.pt=t;e.hidden=!hov;e.textContent=t}}
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.FA={O,memes,talk,ouvrirOptions,objAt,skipCut,startVerite,closeAll,ouvrir,interact,openCaisse,openMini,ouvrirDoc,accueil,cutClick,get cam(){return cam},get SC(){return SC},get Cut(){return Cut},get c(){return c},get S(){return S},get W(){return W},get G(){return G},get modal(){return modal},neuf,update,startBot,draw};
}
pret();

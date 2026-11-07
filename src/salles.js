// Niveau test : un couloir, six salles, six façons d'interroger. Tout se joue dans le décor,
// en marchant : pas de fenêtre devant le jeu, seulement de petites bulles au-dessus des têtes.
// Plus c'est difficile, plus la zone de vue est large et plus les personnages vont vite
const NIV_JEU={facile:{vue:62,ang:.85,vit:.85,npc:1,att:1},moyen:{vue:82,ang:1.05,vit:1.05,npc:1.35,att:.75},difficile:{vue:108,ang:1.35,vit:1.38,npc:1.8,att:.5},expert:{vue:108,ang:1.35,vit:1.38,npc:1.8,att:.5}};
const reglage=()=>NIV_JEU[O.diff&&O.diff!=='auto'?O.diff:(c&&c.test?'moyen':(c&&c.key)||'moyen')];
const dureeDos=()=>Math.round(125*reglage().vit+20),dureeEcoute=()=>Math.round(110*reglage().vit+20);
const JOUEUR={get fx(){return S.p.x},get fy(){return S.p.y}};
function dit(o,txt,d){const a=$('amb');a.textContent=txt;a.hidden=false;G.ambO=o;G.ambT=d||Math.max(170,txt.length*5)}
const dirDe=(dx,dy)=>Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);
const pnj=i=>W.obj.find(q=>q.kind==='suspect'&&q.s===i);
const T_=i=>S.t[i]||(S.t[i]=SALLES[i].init());
const appris=(T,t)=>{T.notes=T.notes||[];if(!T.notes.includes(t))T.notes.push(t)};
// Déplacements d'un personnage piloté par sa salle
function versCase(o,x,y){o.path=cheminCut({x:o.fx,y:o.fy},x*TS+8,y*TS+11,{})||null;o.pi=0}
function avance(o,sp){
  if(!o.path||o.pi>=o.path.length){o.path=null;o.mv=false;return true}
  const[x,y]=o.path[o.pi],dx=x-o.fx,dy=y-o.fy,d=Math.hypot(dx,dy);
  if(d<=sp){o.fx=x;o.fy=y;o.pi++}else{o.fx+=dx/d*sp;o.fy+=dy/d*sp;o.dir=dirDe(dx,dy)}
  o.mv=true;o.x=o.fx>>4;o.y=(o.fy-3)>>4;return false;
}
function casesDe(i){const A=W.rooms[i],l=[];for(let y=A.y0+1;y<=A.y1;y++)for(let x=A.x0;x<=A.x1;x++)if(!solidCell(W,x,y,{})&&!W.gate[y][x])l.push([x,y]);return l}
function joignables(o,l){return l.filter(([x,y])=>{const p=cheminCut({x:o.fx,y:o.fy},x*TS+8,y*TS+11,{});return p&&p[p.length-1][0]===x*TS+8&&p[p.length-1][1]===y*TS+11})}
const proche=(l,a,b)=>l.reduce((m,q)=>Math.hypot(q[0]-a,q[1]-b)<Math.hypot(m[0]-a,m[1]-b)?q:m);
const centreM=f=>[(f.x+f.w/2)*TS,(f.y+.5)*TS];
const LIBRE=(x,y)=>[[-5,-6],[5,-6],[-5,0],[5,0]].every(([a,b])=>!solidCell(W,(x+a)>>4,(y+b)>>4,{}));
const POURSUITE=["Bon, d'accord ! Je suis resté tard mardi soir.","Oui, j'avais la clé du coffre. Laissez-moi passer !"];
const DOS=["Ce soir-là, je tricotais à ma fenêtre. Je vois toute la rue d'ici.","Le voisin du dessus rentrait tard, toujours avec des sacs.","À trois heures, il est sorti par la cour avec une mallette."];
const REGARD=["Hm. Vous cherchez quelque chose ?","Ce coin-là n'a aucun intérêt, vraiment.","Ne touchez pas à ça !"];
const ECOUTE=["... le produit est prêt, c'est moi qui l'ai sorti...","... mardi soir, au laboratoire, personne n'a rien vu...","... l'acheteur paiera demain, en liquide..."];
const RECIT=[["À 22 h, j'étais juste ici, à surveiller la porte.","D'ici, on ne voit même pas la porte. Il ment."],["Ensuite, je me suis mis là pour remplir le registre.","Rien pour écrire à cet endroit. Le registre n'a pas été rempli ici."],["Et je n'ai plus bougé d'ici jusqu'à la relève. Bien réveillé !","Une couverture et un oreiller, cachés là. Il dormait."]];
const SOUVENIRS=[{n:['plant','planter'],h:"Il s'est caché derrière des plantes. Emmenez-moi là-bas, ça me reviendra.",r:"Oui, c'était ici ! Il portait une casquette."},{n:['trunk','crate'],h:"Il a posé quelque chose de lourd par terre, une grosse malle.",r:"Cette malle... Il avait des lunettes rondes, j'en suis sûre."},{n:['rtable','table','commode','cabinet'],h:"Ensuite il s'est installé près d'un meuble en bois.",r:"Là ! Une moustache, et des cheveux bouclés."}];
const SALLES=[
 {id:'poursuite',salle:"Salle d'audience",nom:'Poursuite',pnj:{nom:'Edmond Vial',g:'m',role:'comptable'},but:"Edmond refuse de parler : attrape-le, il craquera",
  init:()=>({n:0,pause:0,fuite:0}),pr:T=>`${T.n}/3`,
  clic(T,o){dit(o,T.n?'Laissez-moi tranquille !':"Je n'ai rien à vous dire !",110)},
  tick(T,o,i){
   const P=S.p,d=Math.hypot(P.x-o.fx,P.y-o.fy);
   if(G.walk&&G.walk.o===o&&tick%24===0)goObj(o);
   if(T.pause>0){T.pause--;o.mv=false;o.dir=dirDe(P.x-o.fx,P.y-o.fy);return}
   if(d<20){
    T.n++;son('page');majBut();
    if(T.n>=3)return finSalle(i,"Assez ! J'ai pris l'argent de la caisse. La banque allait tout saisir.");
    dit(o,POURSUITE[T.n-1],170);appris(T,POURSUITE[T.n-1]);T.pause=170;T.fuite=100;return;
   }
   const R=reglage(),sp=(T.fuite>0?1.7:1)*R.vit;if(T.fuite>0)T.fuite--;
   if(d>R.vue*1.2&&!T.fuite){o.mv=false;o.dir=dirDe(P.x-o.fx,P.y-o.fy);return}
   if(!T.v||tick%10===0){
    let m=-1e9;
    for(let a=0;a<8;a++){const c0=Math.cos(a*.785),s0=Math.sin(a*.785),x=o.fx+c0*22,y=o.fy+s0*22;if(!LIBRE(x,y)||!LIBRE(o.fx+c0*6,o.fy+s0*6))continue;const q=Math.hypot(P.x-x,P.y-y)+(T.v?(c0*T.v[0]+s0*T.v[1])*7:0)+Math.random()*3;if(q>m){m=q;T.v=[c0,s0]}}
   }
   if(T.v&&LIBRE(o.fx+T.v[0]*sp*2,o.fy+T.v[1]*sp*2)){o.fx+=T.v[0]*sp;o.fy+=T.v[1]*sp;o.mv=true;o.dir=dirDe(T.v[0],T.v[1]);o.x=o.fx>>4;o.y=(o.fy-3)>>4}else{T.v=null;o.mv=false}
  }},
 {id:'dos',salle:'Salon de thé',nom:'Le dos tourné',pnj:{nom:'Odette Blanc',g:'f',role:'retraitée'},but:"Odette se tait quand on la regarde : mets-toi près d'elle et tourne-lui le dos",
  init:()=>({n:0,p:0,vu:0}),pr:T=>`${T.n}/4`,
  clic(T,o){dit(o,"Ne me fixez pas comme ça, je ne peux pas parler.",130)},
  tick(T,o,i){
   const P=S.p,dx=o.fx-P.x,dy=o.fy-P.y,d=Math.hypot(dx,dy),v=[[0,1],[1,0],[0,-1],[-1,0]][P.dir],reg=(v[0]*dx+v[1]*dy)/(d||1)>.25;
   o.dir=dirDe(-dx,-dy);
   if(d>78)return;
   if(reg){if(++T.vu===110)dit(o,"Je ne parle pas quand on me fixe.",130);T.p=Math.max(0,T.p-.5);return}
   T.vu=0;if(G.moved)return;
   if(++T.p>=dureeDos()){
    T.p=0;T.n++;son('page');majBut();
    if(T.n>=4)return finSalle(i,"Ne dites pas que ça vient de moi, surtout. C'était lui, je l'ai vu comme je vous vois.");
    dit(o,DOS[T.n-1],250);appris(T,DOS[T.n-1]);
   }
  },
  dessus(T,o){if(T.p>0)barre(o.fx,o.fy-34,T.p/dureeDos(),'#e88aa0')}},
 {id:'regard',salle:'Bibliothèque',nom:'Le regard',pnj:{nom:'Bruno Lenoir',g:'m',role:'libraire'},but:"Bruno jette des coups d'œil : promène-toi, ses réactions te diront où fouiller",
  init:()=>({nv:0}),
  clic(T,o){dit(o,T.atlas?'Rendez-moi ça !':"Fouillez si ça vous chante, il n'y a rien ici.",120)},
  tick(T,o,i){
   if(!T.f){const l=W.furn.filter(f=>f.room===i&&f.name==='shelf'),m=l.length?l:W.furn.filter(f=>f.room===i);T.f=m.reduce((a,f)=>Math.hypot(centreM(f)[0]-o.fx,centreM(f)[1]-o.fy)>Math.hypot(centreM(a)[0]-o.fx,centreM(a)[1]-o.fy)?f:a)}
   const P=S.p,[fx,fy]=centreM(T.f),d=Math.hypot(P.x-fx,P.y-fy-8);
   if(T.atlas){o.dir=dirDe(P.x-o.fx,P.y-o.fy);if(Math.hypot(P.x-o.fx,P.y-o.fy)<34)finSalle(i,"Bon. L'Atlas n'a jamais été volé. Je voulais le vendre en douce et toucher l'assurance.");return}
   o.dir=tick%200<70?dirDe(fx-o.fx,fy-o.fy):dirDe(P.x-o.fx,P.y-o.fy);
   const k=1.6-reglage().vit*.6,nv=d<50*k?3:d<92*k?2:d<140*k?1:0;
   if(nv>T.nv||(nv<T.nv&&tick%60===0)){if(nv>T.nv){dit(o,REGARD[nv-1],150);o.em=nv>1?60:0;o.emc='!'}T.nv=nv}
  },
  fouille(T,f){if(T.atlas||!T.f||f.x!==T.f.x||f.y!==T.f.y)return false;T.atlas=1;son('bon');dit(JOUEUR,"L'Atlas des marées, caché derrière les livres !",190);appris(T,"L'Atlas des marées était caché dans la bibliothèque.");majBut();return true},
  dessus(T){if(T.atlas&&!T.fini){const x=Math.round(S.p.x)-6,y=Math.round(S.p.y)-44;ctx.fillStyle='#17121e';ctx.fillRect(x-1,y-1,14,12);ctx.fillStyle='#2e5a8c';ctx.fillRect(x,y,12,10);ctx.fillStyle='#d8b35c';ctx.fillRect(x+3,y+2,7,1);ctx.fillRect(x+3,y+4,5,1);ctx.fillStyle='#16304a';ctx.fillRect(x,y,2,10)}}},
 {id:'ecoute',salle:'Laboratoire',nom:'Écoute discrète',pnj:{nom:'Clara Dumont',g:'f',role:'chimiste'},but:"Clara parle toute seule : écoute-la de près sans entrer dans sa zone de vue",
  init:()=>({n:0,ec:0,att:0,wp:0,gene:0}),pr:T=>`${T.n}/3`,
  clic(T,o){dit(o,"Oui ? Je n'ai rien à vous dire, je travaille.",120)},
  vu(o){const P=S.p,dx=P.x-o.fx,dy=P.y-(o.fy-6),d=Math.hypot(dx,dy),v=[[0,1],[1,0],[0,-1],[-1,0]][o.dir];const R=reglage();return d<R.vue&&(v[0]*dx+v[1]*dy)/(d||1)>Math.cos(R.ang)},
  tick(T,o,i){
   if(!T.pts){const l=joignables(o,casesDe(i)),A=W.rooms[i];T.pts=[[A.x0,A.y0+1],[A.x1,A.y0+1],[A.x1,A.y1],[A.x0,A.y1]].map(([a,b])=>proche(l,a,b))}
   const P=S.p,d=Math.hypot(P.x-o.fx,P.y-o.fy),vu=this.vu(o);T.gene=Math.max(0,T.gene-1);
   if(vu&&!T.gene){T.gene=170;T.ec=0;dit(o,"Je vous vois ! Allez-vous-en.",120);if(T.att>0)T.att=1}
   if(o.path){if(avance(o,.8*reglage().vit)){T.att=340;T.d0=o.dir}return}
   if(T.att>0){
    T.att--;o.mv=false;o.dir=(T.d0+Math.floor((340-T.att)*reglage().vit/130))%4;
    if(!vu&&d<66){
     if(++T.ec===1)dit(o,"... ... ...",70);
     if(T.ec>=dureeEcoute()){
      T.ec=0;T.n++;son('page');majBut();
      if(T.n>=3)return finSalle(i,"Vous m'avez entendue ? Bon. J'ai vendu le produit moi-même, à l'acheteur, mardi soir.");
      dit(o,ECOUTE[T.n-1],240);appris(T,ECOUTE[T.n-1]);T.att=0;
     }
    }else T.ec=0;
    return;
   }
   T.wp=(T.wp+1)%4;const q=T.pts[T.wp];versCase(o,q[0],q[1]);
  },
  sol(T,o){const R=reglage(),a=[Math.PI/2,0,-Math.PI/2,Math.PI][o.dir];ctx.beginPath();ctx.moveTo(o.fx,o.fy-6);ctx.arc(o.fx,o.fy-6,R.vue,a-R.ang,a+R.ang);ctx.closePath();const v=this.vu(o);ctx.fillStyle=v?'rgba(216,60,50,.46)':'rgba(255,196,60,.36)';ctx.fill();ctx.strokeStyle=v?'#ff6a5e':'#ffe08a';ctx.lineWidth=1;ctx.stroke()},
  dessus(T,o){if(T.ec>0)barre(o.fx,o.fy-34,T.ec/dureeEcoute(),'#6ad0a0')}},
 {id:'recit',salle:'Salle des archives',nom:'Reconstitution',pnj:{nom:'Hector Roux',g:'m',role:'gardien de nuit'},but:"Suis Hector et mets-toi sur chaque croix pour vérifier ce qu'il raconte",
  init:()=>({e:0,etat:'va',p:0,att:0}),pr:T=>`${T.e}/3`,
  clic(T,o){dit(o,"Mettez-vous sur la croix, vous verrez bien que je dis vrai.",130)},
  tick(T,o,i){
   if(!T.cr){const l=joignables(o,casesDe(i)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);T.cr=[.14,.5,.86].map(f=>l[Math.floor(f*(l.length-1))])}
   if(T.att>0){T.att--;return}
   if(T.e>=3)return finSalle(i,"Bon, d'accord. Je dormais dans le local. Je n'ai rien vu au deuxième étage.");
   const q=T.cr[T.e];
   if(T.etat==='va'){
    if(!o.path){const v=freeNear(q[0],q[1],9).find(([x,y])=>(x!==q[0]||y!==q[1])&&!W.gate[y][x])||q;versCase(o,v[0],v[1]);if(!o.path){T.etat='dit'}}
    if(o.path&&avance(o,1.05*reglage().vit)){T.etat='dit'}
    if(T.etat==='dit'){o.mv=false;o.dir=dirDe(q[0]*TS+8-o.fx,q[1]*TS+11-o.fy);dit(o,RECIT[T.e][0],300)}
    return;
   }
   const P=S.p,on=Math.hypot(P.x-(q[0]*TS+8),P.y-(q[1]*TS+11))<14;T.p=on&&!G.moved?T.p+1:0;
   if(T.p>=36){T.p=0;dit(JOUEUR,RECIT[T.e][1],240);appris(T,RECIT[T.e][1]);T.e++;T.etat='va';T.att=210;son('page');majBut()}
  },
  sol(T){if(!T.cr)return;T.cr.forEach(([x,y],j)=>{const X=x*TS+4,Y=y*TS+5;ctx.fillStyle=j<T.e?'rgba(240,236,220,.32)':j===T.e?(tick>>4&1?'#ffd23f':'#fff0a8'):'rgba(240,236,220,.6)';for(let k=0;k<9;k++){ctx.fillRect(X+k,Y+k,2,1);ctx.fillRect(X+8-k,Y+k,2,1)}})}},
 {id:'promenade',salle:'Atelier du dessinateur',nom:'La promenade',pnj:{nom:'Lucie Faure',g:'f',role:'serveuse'},but:"Lucie te suit : emmène-la là où ses souvenirs reviennent",
  init:()=>({e:0}),pr:T=>`${T.e}/3`,
  clic(T,o){if(T.st&&T.st[T.e])dit(o,T.st[T.e].h,200)},
  tick(T,o,i){
   if(!T.st){const l=W.furn.filter(f=>f.room===i),pris=new Set();T.st=SOUVENIRS.map(q=>{const f=l.find(z=>q.n.includes(z.name)&&!pris.has(z.id))||l.find(z=>!pris.has(z.id));pris.add(f.id);return{...q,f}})}
   const P=S.p,d=Math.hypot(P.x-o.fx,P.y-o.fy);
   if(d>30){if(!o.path||tick%24===0)versCase(o,P.x>>4,(P.y-3)>>4);avance(o,1.4/reglage().vit)}else{o.path=null;o.mv=false;o.dir=dirDe(P.x-o.fx,P.y-o.fy)}
   const s=T.st[T.e];
   if(!T.ann){T.ann=1;dit(o,s.h,260)}
   const[fx,fy]=centreM(s.f);
   if(Math.hypot(o.fx-fx,o.fy-fy-8)<42){
    T.e++;T.ann=0;son('page');majBut();appris(T,s.r);
    if(T.e>=3)return finSalle(i,"C'est lui, je le revois : casquette, lunettes, moustache. Il a payé en billets neufs et il est parti vers la gare.");
    dit(o,s.r,220);T.att=1;T.ann=1;T.prochain=tick+230;
   }
   if(T.prochain&&tick>T.prochain){T.prochain=0;T.ann=0}
  }}
];
function barre(x,y,f,col){x=Math.round(x);y=Math.round(y);ctx.fillStyle='#17121e';ctx.fillRect(x-9,y-1,18,4);ctx.fillStyle=col;ctx.fillRect(x-8,y,Math.round(16*Math.min(1,f)),2)}
function preparerTest(c0){
  c0.test=true;
  SALLES.forEach((q,i)=>{const p=q.pnj,su=c0.suspects[i];Object.assign(su,{nom:p.nom,prenom:p.nom.split(' ')[0],ini:p.nom[0],g:p.g,role:p.role,trait:null,voice:i%VOICES.length,niveau:1})});
}
function finirTest(){
  const fous=W.obj.filter(o=>o.kind==='fouille');
  fous.forEach(o=>{o.loot=null;o.lock=null;o.ptype=null;o.mg=null});
  Object.values(W.doors).forEach(d=>{d.lock=null});
  W.obj=fous;
  SALLES.forEach((q,i)=>{
    const A=W.rooms[i],cx=(A.x0+A.x1)>>1,cy=(A.y0+A.y1+1)>>1,cell=freeNear(cx,cy,30).find(([x,y])=>!W.gate[y][x])||[cx,cy];
    W.obj.push({id:9000+i,kind:'suspect',s:i,x:cell[0],y:cell[1],w:1,h:1,room:i,fx:cell[0]*TS+8,fy:cell[1]*TS+11,wait:1e9,dir:0,hold:0,pilote:true});
  });
  W.byId=Object.fromEntries(W.obj.map(o=>[o.id,o]));
  W.spawn={x:19,y:14};
}
function majBut(){
  const e=$('but'),i=G.area,q=c&&c.test&&i!=null&&i<6?SALLES[i]:null;e.hidden=!q;
  if(q){const T=T_(i);e.textContent=T.fini?`${q.nom} : terminé`:q.but+(q.pr?` (${q.pr(T)})`:'')}
}
function entreeTest(){majBut()}
function tickTest(){
  const i=G.area;if(i==null||i>=6)return;
  const T=T_(i),o=pnj(i);
  if(T.fini){o.mv=false;return}
  SALLES[i].tick(T,o,i);
}
function salleParle(i){const q=SALLES[i],T=T_(i);if(T.fini)return dit(pnj(i),q.pnj.nom.split(' ')[0]==='Hector'?"Ne le répétez pas au directeur.":"J'ai tout dit.",120);q.clic(T,pnj(i))}
function fouilleTest(f){
  const i=G.area,q=i!=null&&i<6?SALLES[i]:null;
  if(q&&q.fouille&&q.fouille(T_(i),f))return;
  dit(JOUEUR,f.text||'Rien de particulier.',150);
}
function finSalle(i,txt){
  const T=T_(i),o=pnj(i);T.fini=1;o.mv=false;o.path=null;son('bon');appris(T,txt);
  dit(o,txt,420);toast(`${SALLES[i].nom} : terminé`,true);majBut();
}
function dessinSol(){const i=G.area;if(i==null||i>=6)return;const q=SALLES[i],T=T_(i);if(q.sol&&!T.fini)q.sol(T,pnj(i))}
function dessinDessus(){const i=G.area;if(i==null||i>=6)return;const q=SALLES[i],T=T_(i);if(q.dessus&&!T.fini)q.dessus(T,pnj(i))}
// Le calepin reste un simple carnet : il résume, il ne sert pas à interroger
function pSalles(){
  const faits=SALLES.filter((q,i)=>S.t[i]&&S.t[i].fini).length;
  return`<h2>Les six salles</h2><p class="main">${faits} sur 6 terminées.</p><ul class="salles">${SALLES.map((q,i)=>{const T=S.t[i],v=(stats.sys||{})[q.id];return`<li class="${T&&T.fini?'fini':''}"><b>${esc(q.salle)} : ${esc(q.nom)}</b>${(T&&T.notes||[]).map(t=>`<span>${esc(t)}</span>`).join('')}${T&&T.fini?`<span class="ligne"><button class="etiq ${v==='oui'?'actif':''}" data-a="vote" data-v="${q.id}:oui">À garder</button><button class="etiq ${v==='non'?'actif':''}" data-a="vote" data-v="${q.id}:non">Bof</button></span>`:''}</li>`}).join('')}</ul>`;
}
function ouvrirTest(){
  if(modal==='cut')return;
  const e=$('carnet'),ha=e.querySelector('.corps'),y=ha?ha.scrollTop:0;
  $('bulle').hidden=true;G.tab='couloir';modal='carnet';son('page');e.hidden=false;
  e.innerHTML=`<div class="livret"><div class="spirale" aria-hidden="true"></div><div class="feuille"><button class="croix" data-a="fermer" aria-label="Fermer le calepin">${croix}</button><div class="corps">${pSalles()}</div></div></div>`;
  const co=e.querySelector('.corps');if(co)co.scrollTop=y;
  render();
}

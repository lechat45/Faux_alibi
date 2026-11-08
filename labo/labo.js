// Page de labo (labo.html), séparée du jeu : on y regarde vivre les personnages avec la nouvelle IA.
// Le jeu ne charge rien de tout ça. Ici on met la boucle du jeu en pause et on prend tout l'écran.
ED.on=true; // la boucle du jeu ne dessine plus rien
const LB={lv:1,graine:4242,mode:null,vit:1,pause:false,noir:false,joueur:false,chemins:true,places:false,hasard:.35,z:1,cx:0,cy:0,sel:0,ia:null,sheets:[],tick:0,souris:null};
function lbMonde(){
  c=generate(LB.graine,LB.lv,LB.mode);habiller(c);W=buildWorld(c);
  W.obj.filter(o=>o.kind==='suspect').forEach(o=>{W.blk[o.y][o.x]=0});
  G.furn={};W.furn.forEach(f=>G.furn[f.id]=furnitureSprite(f));G.portes={};G.map=buildMap();
  const V=n=>({nerveux:{nerveux:.85,sociable:.4},bavard:{sociable:.9},froid:{sociable:.2,curieux:.4},timide:{sociable:.25,peureux:.9}}[n]||{});
  const persos=W.obj.filter(o=>o.kind==='suspect').map(o=>{const s=c.suspects[o.s];return{nom:s.prenom,cx:o.x,cy:o.y,coupable:c.tueurs.includes(o.s),traits:{...V(typeof VOIX==='function'?VOIX(o.s).nom:''),peureux:peureux(o.s)?.8:.15}}});
  LB.ia=creerIA(W,{rng:RNG(LB.graine),personnages:persos,hasard:LB.hasard,noir:LB.noir,froid:LB.lv===4});
  LB.sheets=W.obj.filter(o=>o.kind==='suspect').map(o=>charSheet(lookOf(c.suspects[o.s],o.s,c.seed)));
  LB.sel=0;lbCentre();lbPanneau();
}
function lbCentre(){const k=$('lb-c'),r=k.getBoundingClientRect(),f=Math.min(r.width/(MW*TS),r.height/(MH*TS));LB.z=f>=1?Math.floor(f):f*.98;LB.cx=(MW*TS-r.width/LB.z)/2;LB.cy=(MH*TS-r.height/LB.z)/2}
function lbInterface(){
  const st=document.createElement('style');st.textContent='#lb-c{width:100%;height:100%;display:block;touch-action:none;min-width:0;min-height:0;cursor:grab}#lb .ed-corps{overflow:hidden}';document.head.appendChild(st);
  const e=document.createElement('div');e.id='lb';e.className='ed';document.body.appendChild(e);
  e.innerHTML=`<header class="ed-barre">
    <b style="color:#ffd23f">Labo des personnages</b><span class="petit">— essai, pas branché au jeu</span>
    <select id="lb-lv">${LEVELS.map((l,i)=>`<option value="${i}">${i+1}. ${esc(l.nom)}</option>`).join('')}</select>
    <span class="ed-groupe"><button data-lb="nouvelle">Autre enquête</button><button data-lb="mode">Mode : normal</button></span>
    <span class="ed-groupe"><button data-lb="pause">Pause</button>${[1,2,4,8].map(v=>`<button data-lb="vit" data-v="${v}">×${v}</button>`).join('')}</span>
    <span class="ed-groupe"><button data-lb="noir">Coupure</button><button data-lb="joueur">Joueur (souris)</button><button data-lb="chemins">Chemins</button><button data-lb="places">Places</button></span>
    <label class="ed-couleur" style="gap:6px">Hasard <input type="range" id="lb-hasard" min="0" max="1" step=".05" value="${LB.hasard}" style="width:90px"></label>
  </header>
  <div class="ed-corps"><canvas id="lb-c"></canvas><aside id="lb-p" class="ed-panneau"></aside></div>
  <footer id="lb-etat" class="ed-etat"></footer>`;
  $('lb-lv').value=LB.lv;
  $('lb-lv').addEventListener('change',x=>{LB.lv=+x.target.value;lbMonde()});
  $('lb-hasard').addEventListener('input',x=>{LB.hasard=+x.target.value;if(LB.ia)LB.ia.options.hasard=LB.hasard});
  e.addEventListener('click',x=>{const b=x.target.closest('button');if(!b)return;const a=b.dataset.lb;
    if(a==='nouvelle'){LB.graine=1000+Math.floor(Math.random()*8999);lbMonde()}
    if(a==='mode'){LB.mode=LB.mode?null:'expert';b.textContent='Mode : '+(LB.mode?'expert':'normal');lbMonde()}
    if(a==='pause')LB.pause=!LB.pause;if(a==='vit')LB.vit=+b.dataset.v;
    if(a==='noir'){LB.noir=!LB.noir;LB.ia.options.noir=LB.noir}
    if(a==='joueur'){LB.joueur=!LB.joueur;if(!LB.joueur)LB.ia.options.joueur=null}
    if(a==='chemins')LB.chemins=!LB.chemins;if(a==='places')LB.places=!LB.places;
    if(a==='perso'){LB.sel=+b.dataset.v}
    lbBoutons();lbPanneau()});
  e.addEventListener('input',x=>{const t=x.target;if(t.dataset.trait&&LB.ia){LB.ia.agents[LB.sel].traits[t.dataset.trait]=+t.value}});
  const k=$('lb-c');let pan=null;
  k.addEventListener('pointerdown',x=>{const p=lbCarte(x),A=LB.ia.agents,i=A.findIndex(a=>Math.hypot(a.x-p.x,a.y-12-p.y)<12);if(i>=0){LB.sel=i;lbPanneau();return}pan={sx:x.clientX,sy:x.clientY,cx:LB.cx,cy:LB.cy};k.setPointerCapture(x.pointerId)});
  k.addEventListener('pointermove',x=>{LB.souris=lbCarte(x);if(pan){LB.cx=pan.cx-(x.clientX-pan.sx)/LB.z;LB.cy=pan.cy-(x.clientY-pan.sy)/LB.z}});
  k.addEventListener('pointerup',()=>{pan=null});
  k.addEventListener('wheel',x=>{x.preventDefault();const r=k.getBoundingClientRect(),px=x.clientX-r.left,py=x.clientY-r.top,mx=px/LB.z+LB.cx,my=py/LB.z+LB.cy;LB.z=Math.max(.3,Math.min(8,LB.z*(x.deltaY<0?1.25:.8)));LB.cx=mx-px/LB.z;LB.cy=my-py/LB.z},{passive:false});
}
const lbCarte=x=>{const r=$('lb-c').getBoundingClientRect();return{x:(x.clientX-r.left)/LB.z+LB.cx,y:(x.clientY-r.top)/LB.z+LB.cy}};
function lbBoutons(){document.querySelectorAll('#lb [data-lb]').forEach(b=>{const a=b.dataset.lb;b.setAttribute('aria-pressed',a==='pause'?LB.pause:a==='vit'?+b.dataset.v===LB.vit:a==='noir'?LB.noir:a==='joueur'?LB.joueur:a==='chemins'?LB.chemins:a==='places'?LB.places:false)})}
function lbPanneau(){
  const e=$('lb-p'),ia=LB.ia;if(!e||!ia)return;const a=ia.agents[LB.sel];
  e.innerHTML=`<div class="ed-boutons">${ia.agents.map((b,i)=>`<button data-lb="perso" data-v="${i}" class="${i===LB.sel?'pris':''}">${esc(b.nom)}${b.coupable?' ★':''}</button>`).join('')}</div>
    <h3>${esc(a.nom)}${a.coupable?' <span class="petit">(coupable)</span>':''}</h3><div id="lb-direct"></div>
    <p class="petit">Caractère (glisse pour le changer en direct)</p>
    <div class="ed-champs">${Object.keys(a.traits).map(t=>`<label>${t}<input type="range" min="0" max="1" step=".05" value="${a.traits[t]}" data-trait="${t}"></label>`).join('')}</div>`;
}
function lbDirect(){
  const e=$('lb-direct'),ia=LB.ia;if(!e||!ia)return;const a=ia.agents[LB.sel],ac=a.action;
  const barre=(n,v)=>`<div style="display:grid;grid-template-columns:70px 1fr 34px;gap:6px;align-items:center;font-size:12px"><span>${n}</span><span style="background:#2a2540;height:8px;border-radius:3px"><i style="display:block;height:8px;border-radius:3px;width:${Math.round(v*100)}%;background:${v>.7?'#e86a4a':v>.4?'#e8c040':'#58c06a'}"></i></span><span>${Math.round(v*100)}</span></div>`;
  e.innerHTML=`<p><b>${ac?ia.IA_ACTIONS[ac.type].nom:'…'}</b>${ac&&ac.phase==='aller'?' <span class="petit">(en route)</span>':''}${a.assis?' <span class="petit">(assis)</span>':''}</p>
    ${Object.entries(a.besoins).map(([k,v])=>barre(k,v)).join('')}
    <p class="petit">Ce qu'il a envisagé : ${(a.notes||[]).map(([t,n])=>`${ia.IA_ACTIONS[t].nom} ${n}`).join(' · ')}</p>`;
}
function lbDessine(){
  const k=$('lb-c'),dpr=devicePixelRatio||1,r=k.getBoundingClientRect(),cw=Math.round(r.width*dpr),ch=Math.round(r.height*dpr);if(k.width!==cw||k.height!==ch){k.width=cw;k.height=ch}
  const g=k.getContext('2d'),s=LB.z*dpr,ia=LB.ia;g.setTransform(1,0,0,1,0,0);g.fillStyle='#07060f';g.fillRect(0,0,cw,ch);
  g.setTransform(s,0,0,s,-LB.cx*s,-LB.cy*s);g.imageSmoothingEnabled=false;g.drawImage(G.map,0,0);
  Object.values(W.doors).forEach(d=>{const ouv=d.lock===null,col=ouv?null:'#c8a040',cle=[d.v,d.style,false,col,d.num].join();
    if(d.v)g.drawImage(G.portes[cle]||(G.portes[cle]=doorVArt(d.style,false,col)),d.x*TS,d.y*TS);
    else{g.drawImage(G.portes[cle]||(G.portes[cle]=doorArt(d.style,false,col,d.num)),0,0,32,29,d.x*TS,(d.y+1)*TS+3,32,29);const c2='h'+cle;g.drawImage(G.portes[c2]||(G.portes[c2]=doorTopArt(d.style,false,col)),d.x*TS,d.y*TS)}});
  if(LB.places)ia.spots.forEach(p=>{g.fillStyle=p.pris!==null?'rgba(255,210,63,.55)':p.type==='lumiere'?'rgba(255,240,150,.25)':'rgba(120,200,255,.3)';g.fillRect(p.x*TS+4,p.y*TS+4,8,8)});
  const L=[...W.furn.map(f=>({y:(f.y+f.h)*TS,d:()=>g.drawImage(G.furn[f.id],f.x*TS-1,(f.y+f.h)*TS-SH[f.name]-1)})),
    ...ia.agents.map((a,i)=>({y:a.assis?a.y+3:a.y,d:()=>{
      const bouge=a.action&&a.action.phase==='aller',fr=bouge?(LB.tick>>3)&3:0;
      g.fillStyle='rgba(8,6,24,.4)';g.fillRect(Math.round(a.x-6),Math.round(a.y-1),12,3);
      g.drawImage(LB.sheets[i],fr*20,a.dir*30,20,30,Math.round(a.x-10),Math.round(a.y-27+(a.assis?2:0)),20,30);
      if(i===LB.sel){g.strokeStyle='#ffd23f';g.lineWidth=1/LB.z;g.strokeRect(Math.round(a.x-11),Math.round(a.y-29),22,32)}
      if(a.bulle){g.fillStyle='#fff8e4';g.fillRect(Math.round(a.x-5),Math.round(a.y-38),10,7);g.fillStyle='#2a2418';g.fillRect(Math.round(a.x-3),Math.round(a.y-35),1,1);g.fillRect(Math.round(a.x),Math.round(a.y-35),1,1);g.fillRect(Math.round(a.x+3),Math.round(a.y-35),1,1)}
      if(a.coupable){g.fillStyle='#e8504a';g.fillRect(Math.round(a.x+7),Math.round(a.y-30),2,2)}
    }}))].sort((p,q)=>p.y-q.y);
  L.forEach(o=>o.d());
  if(LB.chemins)ia.agents.forEach((a,i)=>{if(!a.chemin||!a.chemin.length)return;g.strokeStyle=i===LB.sel?'rgba(255,210,63,.9)':'rgba(140,220,255,.45)';g.lineWidth=1.2/LB.z*2;g.beginPath();g.moveTo(a.x,a.y-3);a.chemin.forEach(([x,y])=>g.lineTo(x*TS+8,y*TS+8));g.stroke()});
  // noms et actions au-dessus des têtes
  g.font=`${Math.max(4,10/LB.z)}px system-ui`;g.textAlign='center';
  ia.agents.forEach(a=>{const t=a.nom+' · '+(a.action?ia.IA_ACTIONS[a.action.type].nom:'…');const w=g.measureText(t).width;g.fillStyle='rgba(0,0,0,.6)';g.fillRect(a.x-w/2-2/LB.z,a.y-46-11/LB.z,w+4/LB.z,13/LB.z);g.fillStyle='#fff3d6';g.fillText(t,a.x,a.y-46)});
  if(LB.noir){g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(4,3,14,.55)';g.fillRect(0,0,cw,ch)}
  if(LB.joueur&&LB.souris){g.setTransform(s,0,0,s,-LB.cx*s,-LB.cy*s);g.strokeStyle='#ffd23f';g.lineWidth=2/LB.z;g.beginPath();g.arc(LB.souris.x,LB.souris.y,10,0,7);g.stroke()}
}
function lbBoucle(){
  requestAnimationFrame(lbBoucle);if(!LB.ia)return;
  if(!LB.pause)for(let i=0;i<LB.vit;i++){LB.ia.options.joueur=LB.joueur&&LB.souris?{x:LB.souris.x,y:LB.souris.y}:null;LB.ia.pas();LB.tick++}
  lbDessine();if(LB.tick%15===0){lbDirect();const ia=LB.ia,T={};ia.agents.forEach(a=>{for(const[k,v]of Object.entries(a.stats))T[k]=(T[k]||0)+v});const S=Object.values(T).reduce((x,y)=>x+y,0)||1;
    $('lb-etat').innerHTML=`<span class="msg">${Math.round(LB.tick/60)} s simulées</span><span>${Object.entries(T).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k==='marche'?'Marcher':ia.IA_ACTIONS[k].nom} ${Math.round(v/S*100)} %`).join(' · ')}</span>`}
}
$('hud').hidden=true;$('accueil').hidden=true;lbInterface();lbMonde();lbBoutons();requestAnimationFrame(lbBoucle);

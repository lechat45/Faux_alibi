// Éditeur de cartes, réservé à l'auteur du jeu : on l'ouvre en ajoutant ?editeur à la fin de l'adresse.
// On part de la carte que le jeu a générée, on déplace les pièces, les portes et les meubles, on pose fenêtres,
// tableaux et tapis, on change sols et couleurs ; puis on exporte un fichier qui deviendra l'agencement par défaut.
const ED={on:false,lv:1,cartes:{},hist:[],redo:[],outil:'meubles',sel:null,z:3,cx:0,cy:0,ajout:null,tabN:0,tapisC:'#7a2f35',
  sprites:new Map(),icones:new Map(),grille:true,msg:'',pb:[],drag:null,hover:null,hors:[],base:0};
const ED_CLE='fauxalibi.editeur';
const enEditeur=()=>/[?&]editeur(?=$|&|=)/.test(location.search)||location.hash==='#editeur';
const ED_SOLS=[['parquet','Parquet'],['planche','Planches'],['scene','Scène'],['damier','Damier'],['tapis','Moquette'],['marbre','Marbre'],['pierre','Pierre'],['terre','Terre battue'],['metal','Métal'],['lino','Lino'],['sport','Sol de sport'],['beton','Béton']];
const ED_OUTILS=[['meubles','Meubles','Clique un meuble pour le choisir, glisse-le pour le déplacer.'],['ajout','Ajouter','Choisis un meuble dans la liste, puis clique sur la carte pour le poser.'],
  ['pieces','Pièces','Glisse le milieu d\'une pièce pour la déplacer avec tout ce qu\'elle contient, ses bords pour l\'agrandir.'],['portes','Portes','Glisse une porte le long de son mur.'],
  ['sol','Sols et murs','Clique une pièce pour changer son sol, la couleur de ses murs et son tapis.'],['tapis','Tapis','Trace un rectangle dans une pièce pour y poser un tapis.'],
  ['fenetres','Fenêtres','Clique sur un mur du fond pour poser ou enlever une fenêtre.'],['tableaux','Tableaux','Choisis un tableau, puis clique sur un mur du fond.']];
const ED_NOMS={chariot:'chariot',valise:'valise',bascule:'balance',banquette:'banquette',fontaine:'fontaine',radio:'radio',skis:'skis',portant:'portant',bouee:'bouée',barre:'barre de danse',
  perfusion:'perfusion',brancard:'brancard',armure:'armure',bandit:'bandit manchot',jetons:'jetons',stove:'cuisinière',rack:'baie de serveurs',console:'console',labbench:'paillasse de labo',
  planter:'jardinière',table:'table',rtable:'table ronde',chair:'chaise',mannequin:'mannequin',spot:'projecteur',ropes:'cordages',lamp:'lampe',globe:'globe',stool:'tabouret',tank:'cuve',
  tub:'baignoire',toilet:'toilettes',shower:'douche',copier:'photocopieuse',roulette:'roulette',engine:'moteur',chairB:'chaise (dos)',chairL:'chaise (gauche)',chairR:'chaise (droite)',basse:'table basse'};
const edNom=n=>ED_NOMS[n]||(typeof NOM_F!=='undefined'&&(NOM_F[n]||NOM_F[n.replace(/[BLR]$/,'')])||n).replace(/^(le |la |les |l')/,'')+(/[BLR]$/.test(n)&&!ED_NOMS[n]?({B:' (dos)',L:' (gauche)',R:' (droite)'})[n.slice(-1)]:'');
const edEtage=lv=>typeof ETAGES!=='undefined'&&!!ETAGES[lv];

// ——— Données : une carte par lieu, gardée sur cet appareil ———
function edSauve(){try{localStorage.setItem(ED_CLE,JSON.stringify({cartes:ED.cartes,lv:ED.lv}))}catch(e){}}
function edLit(){try{const o=JSON.parse(localStorage.getItem(ED_CLE));if(o&&o.cartes){ED.cartes=o.cartes;ED.lv=o.lv??ED.lv}}catch(e){}}
function edEnquete(graine){return generate(graine,ED.lv,edEtage(ED.lv)?'expert':null)}
function edBase(graine){const c0=edEnquete(graine);return extraireCarte(construireMonde(c0,null),ED.lv,edEtage(ED.lv))}
const edCarte=()=>ED.cartes[ED.lv];

// ——— Ouvrir, quitter ———
function ouvrirEditeur(){
  edLit();ED.on=true;closeAll();enJeu=false;$('hud').hidden=true;
  let e=$('ed');
  if(!e){e=document.createElement('div');e.id='ed';e.className='ed';document.body.appendChild(e);edInterface();}
  e.hidden=false;$('ed-retour').hidden=true;CARTES_PERSO=null;
  edCharge(ED.lv,true);
}
function quitterEditeur(){
  edSauve();ED.on=false;$('ed').hidden=true;$('ed-retour').hidden=true;CARTES_PERSO=null;
  if(enEditeur())history.replaceState(null,'',location.pathname);
  accueil();
}
function edCharge(lv,centre){
  ED.lv=lv;if(!ED.cartes[lv])ED.cartes[lv]=edBase(1000+lv*7);
  ED.hist=[];ED.redo=[];ED.sel=null;ED.ajout=null;ED.msg='';
  edConstruit();if(centre)edCentre();edPanneau();edBarre();
}

// ——— Construire le monde à partir de la carte, et vérifier qu'on peut y jouer ———
function edConstruit(){
  const CU=edCarte();c=edEnquete(4242+ED.lv);
  try{W=construireMonde(c,CU,true);ED.err=null}catch(x){ED.err=x.message;W=construireMonde(c,null,true)}
  G.furn={};W.furn.forEach(f=>{const A=W.areas[f.room],k=[f.name,f.v,f.room,A&&A.tint,c.lv].join('|');let s=ED.sprites.get(k);if(!s){s=furnitureSprite(f);ED.sprites.set(k,s)}G.furn[f.id]=s});
  G.portes={};G.map=buildMap();
  ED.hors=CU.furn.map((q,i)=>i).filter(i=>!W.furn.some(f=>f.ci===i));
  edVerifie();edDessine();
}
function edVerifie(){
  const pb=[],CU=edCarte();
  if(ED.err)pb.push('Plan impossible : '+edExplique(ED.err));
  if(ED.hors.length)pb.push(`${ED.hors.length} meuble${ED.hors.length>1?'s':''} en rouge : posé${ED.hors.length>1?'s':''} sur un mur, une porte ou un autre meuble, ${ED.hors.length>1?'ils seront ignorés':'il sera ignoré'}.`);
  let ok=0,n=0;
  for(const m of edEtage(ED.lv)?[null,'expert']:[null])for(const g of [11,23,37]){
    n++;try{const c2=generate(g+ED.lv,ED.lv,m),w2=construireMonde(c2,CU),e=auditWorld(w2,c2);if(e.length){if(pb.length<6)pb.push('Partie d\'essai : '+e[0])}else ok++}
    catch(x){if(!pb.some(p=>p.startsWith('Partie impossible')))pb.push('Partie impossible : '+edExplique(x.message))}
  }
  ED.pb=pb;ED.essais=[ok,n];edEtat();
}
function edExplique(m){
  const a=/plan sans porte possible (\d+)-(\d+)/.exec(m);
  if(a&&W&&W.areas[+a[1]]&&W.areas[+a[2]])return`« ${W.areas[+a[1]].name} » et « ${W.areas[+a[2]].name} » doivent se toucher par un mur assez long pour leur porte.`;
  if(/null|undefined/.test(m))return'pas assez de place libre pour les suspects, les vitrines ou le corps : une pièce est trop remplie, ou coupée en deux par les meubles.';
  return m;
}
function edEtat(){
  const e=$('ed-etat');if(!e)return;const[ok,n]=ED.essais||[0,0];
  e.innerHTML=`<span class="${ok===n?'ok':'ko'}">${ok===n?'✓':'⚠'} ${ok}/${n} parties d'essai jouables</span>${ED.msg?`<span class="msg">${esc(ED.msg)}</span>`:''}${ED.pb.map(p=>`<span class="pb">${esc(p)}</span>`).join('')}`;
}

// ——— Modifier la carte, avec annulation ———
function edModifie(fn,verifPlan){
  const avant=JSON.stringify(edCarte());fn(edCarte());
  if(verifPlan){const p=edPlanOK(edCarte());if(p){ED.cartes[ED.lv]=JSON.parse(avant);ED.msg=p;edConstruit();return false}
    try{construireMonde(edEnquete(4242+ED.lv),edCarte(),true)}catch(x){ED.cartes[ED.lv]=JSON.parse(avant);ED.msg='Impossible : '+edExplique(x.message);edConstruit();return false}}
  edCarte().modif=true;ED.hist.push(avant);if(ED.hist.length>80)ED.hist.shift();ED.redo=[];ED.msg='';edSauve();edConstruit();edPanneau();return true;
}
function edAnnule(){if(!ED.hist.length)return;ED.redo.push(JSON.stringify(edCarte()));ED.cartes[ED.lv]=JSON.parse(ED.hist.pop());ED.sel=null;edSauve();edConstruit();edPanneau()}
function edRefait(){if(!ED.redo.length)return;ED.hist.push(JSON.stringify(edCarte()));ED.cartes[ED.lv]=JSON.parse(ED.redo.pop());ED.sel=null;edSauve();edConstruit();edPanneau()}
// Deux zones différentes gardent un mur entre elles : une case sur les côtés, trois rangées entre le haut et le bas
function edPlanOK(CU){
  const zs=[...CU.plan.r.map((q,i)=>({q,a:'r'+i})),...CU.plan.c.map(q=>({q,a:'c'+q[4]}))];
  for(const{q}of zs)if(q[0]<1||q[1]<2||q[2]<2||q[3]<2)return'Une pièce sort de la carte ou devient trop petite.';
  for(let i=0;i<zs.length;i++)for(let j=i+1;j<zs.length;j++){
    if(zs[i].a===zs[j].a)continue;const[a,b]=[zs[i].q,zs[j].q];
    const ox=a[0]<b[0]+b[2]+1&&b[0]<a[0]+a[2]+1,oy=a[1]<b[1]+b[3]+3&&b[1]<a[1]+a[3]+3;
    if(ox&&oy)return'Deux pièces se chevauchent ou se collent : il faut une case de mur entre elles sur les côtés, trois rangées en haut et en bas.';
  }
  return null;
}

// ——— Vue : zoom et déplacement ———
function edCentre(){const k=$('ed-c');if(!k)return;const r=k.getBoundingClientRect();const f=Math.min(r.width/(MW*TS),r.height/(MH*TS));ED.z=f>=1?Math.min(6,Math.floor(f)):Math.max(.25,f*.98);ED.cx=(MW*TS-r.width/ED.z)/2;ED.cy=(MH*TS-r.height/ED.z)/2;edDessine()}
function edVersCarte(e){const r=$('ed-c').getBoundingClientRect();return{x:(e.clientX-r.left)/ED.z+ED.cx,y:(e.clientY-r.top)/ED.z+ED.cy}}
function edZoom(f,px,py){const k=$('ed-c'),r=k.getBoundingClientRect();px=px??r.width/2;py=py??r.height/2;const mx=px/ED.z+ED.cx,my=py/ED.z+ED.cy;ED.z=Math.max(.25,Math.min(8,ED.z*f));if(ED.z>.9)ED.z=Math.round(ED.z*4)/4;ED.cx=mx-px/ED.z;ED.cy=my-py/ED.z;edDessine()}

// ——— Dessin ———
let edAF=0;
function edDessine(){if(!edAF)edAF=requestAnimationFrame(()=>{edAF=0;edPeint()})}
function edPeint(){
  const k=$('ed-c');if(!k||!ED.on||!W)return;
  const dpr=window.devicePixelRatio||1,r=k.getBoundingClientRect(),cw=Math.round(r.width*dpr),ch=Math.round(r.height*dpr);
  if(k.width!==cw||k.height!==ch){k.width=cw;k.height=ch}
  const g=k.getContext('2d'),s=ED.z*dpr;
  g.setTransform(1,0,0,1,0,0);g.fillStyle='#07060f';g.fillRect(0,0,cw,ch);
  g.setTransform(s,0,0,s,-ED.cx*s,-ED.cy*s);g.imageSmoothingEnabled=false;
  g.drawImage(G.map,0,0);
  const D=ED.drag;
  Object.values(W.doors).forEach(d=>{
    const p=D&&D.porte===d.id?D.pos:[d.x,d.y],cle=[d.v,d.style,false,null,d.num].join();
    if(d.v)g.drawImage(G.portes[cle]||(G.portes[cle]=doorVArt(d.style,false,null)),p[0]*TS,p[1]*TS);
    else{g.drawImage(G.portes[cle]||(G.portes[cle]=doorArt(d.style,false,null,d.num)),0,0,32,29,p[0]*TS,(p[1]+1)*TS+3,32,29);const c2='h'+cle;g.drawImage(G.portes[c2]||(G.portes[c2]=doorTopArt(d.style,false,null)),p[0]*TS,p[1]*TS)}
  });
  const L=W.furn.map(f=>{const m=D&&D.meuble===f.ci?D:null,x=m?m.x:f.x,y=m?m.y:f.y;return{f,x,y,b:(y+f.h)*TS}}).sort((a,b)=>a.b-b.b);
  L.forEach(({f,x,y})=>{g.globalAlpha=D&&D.meuble===f.ci?(D.ok?.85:.45):1;g.drawImage(G.furn[f.id],x*TS-1,(y+f.h)*TS-SH[f.name]-1)});g.globalAlpha=1;
  const CU=edCarte(),lw=1/ED.z;g.lineWidth=lw*1.5;
  // meubles ignorés : en rouge
  g.font=`${Math.max(4,10/ED.z)}px sans-serif`;
  ED.hors.forEach(i=>{const[n,x,y]=CU.furn[i],[fw,fh]=FP[n]||[1,1];g.fillStyle='rgba(230,60,60,.35)';g.fillRect(x*TS,y*TS,fw*TS,fh*TS);g.strokeStyle='#ff5050';g.strokeRect(x*TS,y*TS,fw*TS,fh*TS);g.fillStyle='#ffd0d0';g.fillText(edNom(n),x*TS+1,y*TS+9/ED.z+2)});
  if(D&&D.meuble!=null&&!W.furn.some(f=>f.ci===D.meuble)||D&&D.nouveau){const n=D.nom,[fw,fh]=FP[n];g.strokeStyle=D.ok?'#ffd23f':'#ff5050';g.strokeRect(D.x*TS,D.y*TS,fw*TS,fh*TS)}
  // quadrillage
  if(ED.grille&&ED.z>=2){g.strokeStyle='rgba(255,255,255,.07)';g.lineWidth=lw;g.beginPath();for(let x=0;x<=MW;x++){g.moveTo(x*TS,0);g.lineTo(x*TS,MH*TS)}for(let y=0;y<=MH;y++){g.moveTo(0,y*TS);g.lineTo(MW*TS,y*TS)}g.stroke()}
  const O_=ED.outil,sel=ED.sel;
  // noms des pièces
  if(['pieces','sol','tapis','portes'].includes(O_)||ED.z<3){g.font=`bold ${Math.max(5,12/ED.z)}px sans-serif`;g.textAlign='center';
    W.areas.forEach((A,i)=>{const q=A.rects[0],x=(q.x0+q.x1+1)/2*TS,y=(q.y0+q.y1+1)/2*TS;g.fillStyle='rgba(0,0,0,.55)';const t=A.name,w=g.measureText(t).width;g.fillRect(x-w/2-2/ED.z,y-10/ED.z,w+4/ED.z,14/ED.z);g.fillStyle=sel&&sel.aire===i?'#ffd23f':'#fff3d6';g.fillText(t,x,y)});g.textAlign='left'}
  g.lineWidth=lw*2;
  if(O_==='pieces'){
    CU.plan.r.concat(CU.plan.c).forEach((q,i)=>{const nr=CU.plan.r.length,ch=sel&&sel.rect===i,dq=D&&D.rect===i?D.q:q;g.strokeStyle=ch?'#ffd23f':i<nr?'rgba(255,220,140,.6)':'rgba(140,200,255,.55)';g.setLineDash(ch?[]:[4/ED.z,3/ED.z]);g.strokeRect(dq[0]*TS,dq[1]*TS,dq[2]*TS,dq[3]*TS);g.setLineDash([])
      if(ch){g.fillStyle='#ffd23f';const h=5/ED.z;[[dq[0],dq[1]+dq[3]/2],[dq[0]+dq[2],dq[1]+dq[3]/2],[dq[0]+dq[2]/2,dq[1]],[dq[0]+dq[2]/2,dq[1]+dq[3]]].forEach(([x,y])=>g.fillRect(x*TS-h,y*TS-h,h*2,h*2))}});
  }
  if(O_==='portes')Object.values(W.doors).forEach(d=>{const p=D&&D.porte===d.id?D.pos:[d.x,d.y];g.strokeStyle=sel&&sel.porte===d.id?'#ffd23f':'rgba(140,220,255,.8)';g.strokeRect(p[0]*TS,p[1]*TS,d.w*TS,d.h*TS)});
  if(O_==='tapis'||O_==='sol')W.areas.forEach(A=>{if(!A.tapis)return;const t=A.tapis;g.strokeStyle='rgba(255,210,63,.7)';g.setLineDash([3/ED.z,3/ED.z]);g.strokeRect(t.x*TS,t.y*TS,(t.x1-t.x+1)*TS,(t.y1-t.y+1)*TS);g.setLineDash([])});
  if(D&&D.tapis){const[x0,y0,x1,y1]=D.tapis;g.fillStyle=ED.tapisC+'99';g.fillRect(Math.min(x0,x1)*TS,Math.min(y0,y1)*TS,(Math.abs(x1-x0)+1)*TS,(Math.abs(y1-y0)+1)*TS)}
  if(sel&&sel.aire!=null&&O_==='sol')W.areas[sel.aire].rects.forEach(q=>{g.strokeStyle='#ffd23f';g.strokeRect(q.x0*TS,q.y0*TS,(q.x1-q.x0+1)*TS,(q.y1-q.y0+1)*TS)});
  // meuble choisi
  if(sel&&sel.meuble!=null&&!D){const f=W.furn.find(f=>f.ci===sel.meuble);const q=f?[f.x,f.y,f.w,f.h,SH[f.name]]:null;
    if(q){g.strokeStyle='#ffd23f';g.strokeRect(q[0]*TS-1,(q[1]+q[3])*TS-q[4]-1,q[2]*TS+2,q[4]+2);g.fillStyle='rgba(255,210,63,.25)';g.fillRect(q[0]*TS,q[1]*TS,q[2]*TS,q[3]*TS)}
    else{const[n,x,y]=CU.furn[sel.meuble],[fw,fh]=FP[n]||[1,1];g.strokeStyle='#ffd23f';g.strokeRect(x*TS,y*TS,fw*TS,fh*TS)}}
  // survol : la case, ou le fantôme du meuble à poser
  const h=ED.hover;
  if(h&&!D){
    if(O_==='ajout'&&ED.ajout){const[fw,fh]=FP[ED.ajout],x=h.cx-((fw-1)>>1),y=h.cy-fh+1,ok=edLibre(ED.ajout,x,y,-1),ic=edIcone(ED.ajout);g.globalAlpha=ok?.8:.4;g.drawImage(ic,x*TS-1,(y+fh)*TS-SH[ED.ajout]-1);g.globalAlpha=1;g.strokeStyle=ok?'#ffd23f':'#ff5050';g.strokeRect(x*TS,y*TS,fw*TS,fh*TS)}
    else if(O_==='fenetres'||O_==='tableaux'){const y=edHautMur(h.cx,h.cy);if(y!=null){const l=O_==='fenetres'||TAB_ETROITS.includes(ED.tabN)?2:4;g.strokeStyle='#ffd23f';g.strokeRect(h.cx*TS,y*TS,l*TS,2*TS)}}
    else{g.strokeStyle='rgba(255,255,255,.35)';g.strokeRect(h.cx*TS,h.cy*TS,TS,TS)}
  }
}

// ——— Aides de placement ———
function edOccupe(sauf){const o=new Map();W.furn.forEach(f=>{if(f.ci===sauf)return;for(let a=0;a<f.h;a++)for(let b=0;b<f.w;b++)o.set((f.y+a)*MW+f.x+b,f.ci)});return o}
function edDevantPortes(){const s=new Set();Object.values(W.doors).forEach(d=>{const l=d.v?[[d.x-1,d.y],[d.x-1,d.y+1],[d.x+1,d.y],[d.x+1,d.y+1]]:[[d.x,d.y-1],[d.x+1,d.y-1],[d.x,d.y+3],[d.x+1,d.y+3]];l.forEach(([x,y])=>s.add(y*MW+x))});(W.entrees||[]).forEach(e=>{for(let k=0;k<2;k++)s.add((e.y+2)*MW+e.x+k)});return s}
function edLibre(n,x,y,sauf){
  const dp=edDevantPortes(),[fw,fh]=FP[n],o=edOccupe(sauf),ai=W.areas.findIndex(A=>A.rects.some(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1));if(ai<0)return false;const A=W.areas[ai];
  for(let a=0;a<fh;a++)for(let b=0;b<fw;b++){const X=x+b,Y=y+a;if(!W.t[Y]||W.t[Y][X]!==1||W.gate[Y][X]||o.has(Y*MW+X)||dp.has(Y*MW+X)||!A.rects.some(q=>X>=q.x0&&X<=q.x1&&Y>=q.y0&&Y<=q.y1))return false}
  return true;
}
// la rangée du haut d'un mur du fond, si la case (x,y) est sur un mur
function edHautMur(x,y){if(!W.t[y]||W.t[y][x]!==2)return null;while(y>0&&W.t[y-1][x]===2)y--;return W.t[y+1]&&W.t[y+1][x]===2?y:null}
function edMeubleEn(p){
  const L=W.furn.slice().sort((a,b)=>(b.y+b.h)-(a.y+a.h));
  const surCase=L.find(f=>p.x>=f.x*TS&&p.x<(f.x+f.w)*TS&&p.y>=f.y*TS&&p.y<(f.y+f.h)*TS);if(surCase)return surCase.ci;
  const surDessin=L.find(f=>p.x>=f.x*TS-1&&p.x<(f.x+f.w)*TS+1&&p.y>=(f.y+f.h)*TS-SH[f.name]-1&&p.y<(f.y+f.h)*TS);if(surDessin)return surDessin.ci;
  const CU=edCarte(),i=ED.hors.find(i=>{const[n,x,y]=CU.furn[i],[fw,fh]=FP[n]||[1,1];return p.x>=x*TS&&p.x<(x+fw)*TS&&p.y>=y*TS&&p.y<(y+fh)*TS});return i??null;
}
function edIcone(n){let k=ED.icones.get(n);if(!k){const[fw,fh]=FP[n];k=furnitureSprite({name:n,x:0,y:0,w:fw,h:fh,v:7,room:0});ED.icones.set(n,k)}return k}
const edVariantes=n=>{const b=n.replace(/[BLR]$/,'');return[b,b+'L',b+'R',b+'B'].filter((k,i,a)=>FP[k]&&SPR[k]&&a.indexOf(k)===i)};

// ——— Souris et doigts ———
function edPointe(e){
  if(!ED.on)return;const k=$('ed-c');k.setPointerCapture(e.pointerId);
  const p=edVersCarte(e),cx=Math.floor(p.x/TS),cy=Math.floor(p.y/TS),CU=edCarte(),O_=ED.outil;
  const pan=()=>{ED.drag={pan:true,sx:e.clientX,sy:e.clientY,cx0:ED.cx,cy0:ED.cy}};
  if(e.button===1||e.button===2||e.shiftKey)return pan();
  if(O_==='meubles'){
    const i=edMeubleEn(p);if(i==null){ED.sel=null;edPanneau();return pan()}
    ED.sel={meuble:i};const[n,x,y]=CU.furn[i];ED.drag={meuble:i,nom:n,ox:cx-x,oy:cy-y,x,y,x0:x,y0:y,ok:true};edPanneau();edDessine();return;
  }
  if(O_==='ajout'){
    if(!ED.ajout)return pan();const n=ED.ajout,[fw,fh]=FP[n],x=cx-((fw-1)>>1),y=cy-fh+1;
    if(!edLibre(n,x,y,-1)){ED.msg='Pas de place ici pour ce meuble (mur, autre meuble, ou juste devant une porte).';edEtat();return}
    edModifie(C=>{C.furn.push([n,x,y,(Math.random()*1e6)|0])});ED.sel={meuble:edCarte().furn.length-1};return;
  }
  if(O_==='pieces'){
    const R=CU.plan.r.concat(CU.plan.c),bord=6/ED.z/TS;
    let i=-1,cote=null;
    for(let j=R.length-1;j>=0;j--){const q=R[j],fx=p.x/TS,fy=p.y/TS;if(fx<q[0]-bord||fx>q[0]+q[2]+bord||fy<q[1]-bord||fy>q[1]+q[3]+bord)continue;
      i=j;cote=Math.abs(fx-q[0])<bord?'g':Math.abs(fx-q[0]-q[2])<bord?'d':Math.abs(fy-q[1])<bord?'h':Math.abs(fy-q[1]-q[3])<bord?'b':null;break}
    if(i<0){ED.sel=null;edPanneau();return pan()}
    ED.sel={rect:i};ED.drag={rect:i,cote,sx:cx,sy:cy,q0:R[i].slice(),q:R[i].slice()};edPanneau();edDessine();return;
  }
  if(O_==='portes'){
    const d=Object.values(W.doors).find(d=>cx>=d.x&&cx<d.x+d.w&&cy>=d.y&&cy<d.y+d.h);if(!d)return pan();
    ED.sel={porte:d.id};ED.drag={porte:d.id,pos:[d.x,d.y],d};edDessine();return;
  }
  if(O_==='sol'){const a=W.areas.findIndex(A=>A.rects.some(q=>cx>=q.x0&&cx<=q.x1&&cy>=q.y0&&cy<=q.y1));if(a<0)return pan();ED.sel={aire:a};edPanneau();edDessine();return}
  if(O_==='tapis'){const a=W.areas.findIndex(A=>A.rects.some(q=>cx>=q.x0&&cx<=q.x1&&cy>=q.y0&&cy<=q.y1));if(a<0)return pan();ED.sel={aire:a};ED.drag={tapis:[cx,cy,cx,cy],aire:a};edPanneau();edDessine();return}
  if(O_==='fenetres'||O_==='tableaux'){
    const y=edHautMur(cx,cy);if(y==null)return pan();
    if(O_==='fenetres'){const i=CU.fen.findIndex(([x,yy])=>yy===y&&cx>=x&&cx<=x+1);
      if(i>=0)edModifie(C=>C.fen.splice(i,1));else if(W.t[y][cx+1]===2)edModifie(C=>C.fen.push([cx,y]));else{ED.msg='Une fenêtre fait deux cases de large.';edEtat()}}
    else{const i=CU.tab.findIndex(([x,yy,n])=>yy===y&&cx>=x&&cx<x+(TAB_ETROITS.includes(n)?2:4));
      if(i>=0)edModifie(C=>C.tab.splice(i,1));else{const l=TAB_ETROITS.includes(ED.tabN)?2:4;let ok=true;for(let j=0;j<l;j++)if(!W.t[y]||W.t[y][cx+j]!==2)ok=false;if(ok)edModifie(C=>C.tab.push([cx,y,ED.tabN]));else{ED.msg='Pas assez de mur pour ce tableau.';edEtat()}}}
    return;
  }
  pan();
}
function edBouge(e){
  if(!ED.on)return;const p=edVersCarte(e),cx=Math.floor(p.x/TS),cy=Math.floor(p.y/TS),D=ED.drag;
  ED.hover={cx,cy};
  if(!D){edDessine();return}
  if(D.pan){ED.cx=D.cx0-(e.clientX-D.sx)/ED.z;ED.cy=D.cy0-(e.clientY-D.sy)/ED.z;edDessine();return}
  if(D.meuble!=null){D.x=cx-D.ox;D.y=cy-D.oy;D.ok=edLibre(D.nom,D.x,D.y,D.meuble);edDessine();return}
  if(D.rect!=null){const dx=cx-D.sx,dy=cy-D.sy,q=D.q0.slice();
    if(!D.cote){q[0]+=dx;q[1]+=dy}else if(D.cote==='g'){q[0]+=dx;q[2]-=dx}else if(D.cote==='d')q[2]+=dx;else if(D.cote==='h'){q[1]+=dy;q[3]-=dy}else q[3]+=dy;
    D.q=q;edDessine();return}
  if(D.porte!=null){const d=D.d;D.pos=d.v?[d.x,cy]:[cx,d.y];edDessine();return}
  if(D.tapis){D.tapis[2]=cx;D.tapis[3]=cy;edDessine()}
}
function edLache(e){
  const D=ED.drag;ED.drag=null;if(!D)return;
  if(D.meuble!=null){
    if(D.x===D.x0&&D.y===D.y0){edDessine();return}
    if(!D.ok){ED.msg='Pas de place ici : le meuble reprend sa place.';edEtat();edDessine();return}
    edModifie(C=>{C.furn[D.meuble][1]=D.x;C.furn[D.meuble][2]=D.y});return;
  }
  if(D.rect!=null){
    const q=D.q,q0=D.q0;if(q.every((v,i)=>v===q0[i])){edDessine();return}
    const nr=edCarte().plan.r.length,dx=q[0]-q0[0],dy=q[1]-q0[1],deplace=!D.cote;
    edModifie(C=>{
      const R=D.rect<nr?C.plan.r[D.rect]:C.plan.c[D.rect-nr];R[0]=q[0];R[1]=q[1];R[2]=q[2];R[3]=q[3];
      if(!deplace)return;
      const dedans=(x,y)=>x>=q0[0]&&x<q0[0]+q0[2]&&y>=q0[1]&&y<q0[1]+q0[3],surMur=(x,y)=>y===q0[1]-2&&x>=q0[0]-1&&x<q0[0]+q0[2];
      C.furn.forEach(f=>{if(dedans(f[1],f[2])){f[1]+=dx;f[2]+=dy}});
      [C.fen,C.tab,C.ent||[]].forEach(l=>l.forEach(o=>{if(surMur(o[0],o[1])){o[0]+=dx;o[1]+=dy}}));
      C.aires.forEach(z=>{if(z&&z.tapis&&dedans(z.tapis[0],z.tapis[1])){z.tapis[0]+=dx;z.tapis[2]+=dx;z.tapis[1]+=dy;z.tapis[3]+=dy}});
      Object.values(C.portes).forEach(p=>{if(dedans(p[0]-1,p[1])||dedans(p[0]+1,p[1])||dedans(p[0],p[1]-1)){p[0]+=dx;p[1]+=dy}});
    },true);
    return;
  }
  if(D.porte!=null){const d=D.d;if(D.pos[0]===d.x&&D.pos[1]===d.y){edDessine();return}edModifie(C=>{C.portes[d.a+'-'+d.b]=D.pos.slice()});
    const n=W.doors[D.porte];if(n&&(n.x!==D.pos[0]||n.y!==D.pos[1])){ED.msg='La porte reste là où le mur commun le permet.';edEtat()}return}
  if(D.tapis){const A=W.areas[D.aire],[a,b,c2,d]=D.tapis,x0=Math.max(A.x0,Math.min(a,c2)),x1=Math.min(A.x1,Math.max(a,c2)),y0=Math.max(A.y0,Math.min(b,d)),y1=Math.min(A.y1,Math.max(b,d));
    if(x1-x0<1||y1-y0<1){ED.msg='Un tapis fait au moins deux cases sur deux.';edEtat();edDessine();return}
    edModifie(C=>{C.aires[D.aire]=C.aires[D.aire]||{};C.aires[D.aire].tapis=[x0,y0,x1,y1,ED.tapisC]})}
}

// ——— Panneau de droite : la sélection, la palette, les réglages ———
function edPanneau(){
  const e=$('ed-panneau');if(!e||!W)return;const CU=edCarte(),s=ED.sel,O_=ED.outil,aide=ED_OUTILS.find(o=>o[0]===O_)[2];
  let h=`<p class="ed-aide">${aide}</p>`;
  if(O_==='meubles'&&s&&s.meuble!=null&&CU.furn[s.meuble]){const[n,x,y]=CU.furn[s.meuble],va=edVariantes(n);
    h+=`<h3>${esc(edNom(n))}</h3><p class="petit">Case ${x}, ${y}${ED.hors.includes(s.meuble)?' · <b class="rouge">ignoré</b>':''}</p><div class="ed-boutons">
    ${va.length>1?'<button data-ed="tourne">Tourner <kbd>R</kbd></button>':''}<button data-ed="aspect">Autre aspect <kbd>V</kbd></button><button data-ed="double">Dupliquer <kbd>D</kbd></button><button data-ed="suppr" class="danger">Supprimer <kbd>Suppr</kbd></button></div>
    <p class="petit">Flèches du clavier : déplacer d'une case.</p>`}
  if(O_==='ajout'){h+=`<input id="ed-cherche" class="ed-cherche" placeholder="Chercher un meuble…" value="${esc(ED.cherche||'')}"><div class="ed-palette">${Object.keys(FP).filter(n=>SPR[n]&&(!ED.cherche||edNom(n).toLowerCase().includes(ED.cherche.toLowerCase())||n.includes(ED.cherche))).sort((a,b)=>edNom(a).localeCompare(edNom(b))).map(n=>`<button data-ed="prends" data-v="${n}" class="${ED.ajout===n?'pris':''}" title="${esc(edNom(n))}"><img alt="" src="${edIcone(n).toDataURL()}"><span>${esc(edNom(n))}</span></button>`).join('')}</div>`}
  if(O_==='pieces'&&s&&s.rect!=null){const R=CU.plan.r.concat(CU.plan.c),q=R[s.rect],A=W.areas.find(A=>A.rects.some(r=>r.x0===q[0]&&r.y0===q[1]));
    h+=`<h3>${esc(A?A.name:'Pièce')}</h3><div class="ed-champs">${['x','y','largeur','hauteur'].map((l,i)=>`<label>${l}<input type="number" data-ed-rect="${i}" value="${q[i]}"></label>`).join('')}</div><p class="petit">Les meubles qui dépassent d'une pièce rétrécie passent en rouge.</p>`}
  if((O_==='sol'||O_==='tapis')&&s&&s.aire!=null){const A=W.areas[s.aire],z=CU.aires[s.aire]||{};
    h+=`<h3>${esc(A.name)}</h3>`;
    if(O_==='sol')h+=`<p class="petit">Sol</p><div class="ed-sols">${ED_SOLS.map(([k,l])=>`<button data-ed="sol" data-v="${k}" class="${A.rec.f===k?'pris':''}" title="${l}"><img alt="" src="${edSol(k,A.tint)}"><span>${l}</span></button>`).join('')}</div>
      <label class="ed-couleur">Couleur des murs <input type="color" data-ed-coul="mur" value="${A.tint}"></label>`;
    h+=`<label class="ed-couleur">Couleur du tapis <input type="color" data-ed-coul="tapis" value="${z.tapis?z.tapis[4]:ED.tapisC}"></label>${z.tapis?'<button data-ed="sanstapis" class="danger">Retirer le tapis</button>':''}`;
  }
  if(O_==='tapis'&&!(s&&s.aire!=null))h+=`<label class="ed-couleur">Couleur du prochain tapis <input type="color" data-ed-coul="tapis" value="${ED.tapisC}"></label>`;
  if(O_==='tableaux')h+=`<div class="ed-tableaux">${range(10).map(n=>`<button data-ed="tableau" data-v="${n}" class="${ED.tabN===n?'pris':''}"><img alt="" src="${edTableau(n)}"></button>`).join('')}</div><p class="petit">Clique un tableau déjà posé pour l'enlever.</p>`;
  if(O_==='fenetres')h+=`<p class="petit">Clique une fenêtre déjà posée pour l'enlever.</p>`;
  e.innerHTML=h;
}
function edSol(k,tint){const[q,g]=cv(32,32);for(let y=0;y<2;y++)for(let x=0;x<2;x++)floorTile(g,k,x,y,x*16,y*16,tint);return q.toDataURL()}
function edTableau(n){const l=TAB_ETROITS.includes(n)?2:4,[q,g]=cv(l*16,32);R(g,'#5a4a3a',0,0,l*16,32);tableau(g,1,1,n,7);return q.toDataURL()}
function edBarre(){
  const e=$('ed-barre');if(!e)return;
  e.querySelector('#ed-lv').value=ED.lv;
  e.querySelectorAll('[data-ed-outil]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.edOutil===ED.outil));
  const m=e.querySelector('[data-ed="essai-e"]');if(m)m.hidden=!edEtage(ED.lv);
  e.querySelector('[data-ed="annule"]').disabled=!ED.hist.length;e.querySelector('[data-ed="refait"]').disabled=!ED.redo.length;
}
function edInterface(){
  const e=$('ed');
  e.innerHTML=`<header id="ed-barre" class="ed-barre">
    <select id="ed-lv" aria-label="Lieu">${LEVELS.slice(0,10).map((l,i)=>`<option value="${i}">${i+1}. ${esc(l.nom)}</option>`).join('')}</select>
    <span class="ed-outils" role="toolbar">${ED_OUTILS.map(([k,l])=>`<button data-ed-outil="${k}">${l}</button>`).join('')}</span>
    <span class="ed-groupe"><button data-ed="annule" title="Annuler (Ctrl+Z)">↶</button><button data-ed="refait" title="Rétablir (Ctrl+Y)">↷</button><button data-ed="grille" title="Quadrillage">#</button><button data-ed="moins" title="Dézoomer">−</button><button data-ed="plus" title="Zoomer">+</button><button data-ed="centre" title="Tout voir">⤢</button></span>
    <span class="ed-groupe"><button data-ed="essai-n">Tester</button><button data-ed="essai-e">Tester en expert</button></span>
    <span class="ed-groupe"><button data-ed="exporte" class="fort">Exporter</button><button data-ed="copie">Copier</button><button data-ed="importe">Importer</button><input type="file" id="ed-fichier" accept=".json,application/json" hidden></span>
    <span class="ed-groupe"><button data-ed="base">Carte générée</button><button data-ed="quitte">Quitter</button></span>
  </header>
  <div class="ed-corps"><canvas id="ed-c"></canvas><aside id="ed-panneau" class="ed-panneau"></aside></div>
  <footer id="ed-etat" class="ed-etat" aria-live="polite"></footer>`;
  const k=$('ed-c');
  k.addEventListener('pointerdown',edPointe);k.addEventListener('pointermove',edBouge);k.addEventListener('pointerup',edLache);k.addEventListener('pointercancel',edLache);
  k.addEventListener('pointerleave',()=>{ED.hover=null;edDessine()});k.addEventListener('contextmenu',x=>x.preventDefault());
  k.addEventListener('wheel',x=>{x.preventDefault();const r=k.getBoundingClientRect();if(x.ctrlKey||Math.abs(x.deltaY)>=Math.abs(x.deltaX))edZoom(x.deltaY<0?1.25:.8,x.clientX-r.left,x.clientY-r.top);else{ED.cx+=x.deltaX/ED.z;edDessine()}},{passive:false});
  $('ed-lv').addEventListener('change',x=>{edCharge(+x.target.value,true);edSauve()});
  e.addEventListener('click',edClic);
  e.addEventListener('input',x=>{
    const t=x.target;
    if(t.id==='ed-cherche'){ED.cherche=t.value;const pos=t.selectionStart;edPanneau();const n=$('ed-cherche');n.focus();n.setSelectionRange(pos,pos)}
  });
  e.addEventListener('change',x=>{
    const t=x.target,s=ED.sel;
    if(t.dataset.edRect!=null&&s&&s.rect!=null){const i=+t.dataset.edRect,v=Math.round(+t.value),nr=edCarte().plan.r.length;edModifie(C=>{(s.rect<nr?C.plan.r[s.rect]:C.plan.c[s.rect-nr])[i]=v},true);edPanneau()}
    if(t.dataset.edCoul==='mur'&&s&&s.aire!=null)edModifie(C=>{C.aires[s.aire]=C.aires[s.aire]||{};C.aires[s.aire].t=t.value});
    if(t.dataset.edCoul==='tapis'){ED.tapisC=t.value;if(s&&s.aire!=null&&edCarte().aires[s.aire]&&edCarte().aires[s.aire].tapis)edModifie(C=>{C.aires[s.aire].tapis[4]=t.value})}
    if(t.id==='ed-fichier'&&t.files[0]){const r=new FileReader();r.onload=()=>edImporte(r.result);r.readAsText(t.files[0]);t.value=''}
  });
  addEventListener('resize',()=>{if(ED.on)edDessine()});
  document.addEventListener('keydown',edTouche,true);
  const ret=document.createElement('button');ret.id='ed-retour';ret.className='ed-retour';ret.hidden=true;ret.textContent='← Retour à l\'éditeur';ret.addEventListener('click',edRetour);document.body.appendChild(ret);
}
function edClic(x){
  const b=x.target.closest('button');if(!b||!ED.on)return;const a=b.dataset.ed,v=b.dataset.v,s=ED.sel,CU=edCarte();
  if(b.dataset.edOutil){ED.outil=b.dataset.edOutil;ED.sel=null;if(ED.outil!=='ajout')ED.ajout=null;edBarre();edPanneau();edDessine();return}
  if(a!=='base')b.closest('#ed-barre')&&$('ed-barre').querySelector('[data-ed="base"]').classList.remove('sur');
  if(a==='annule')edAnnule();
  if(a==='refait')edRefait();
  if(a==='grille'){ED.grille=!ED.grille;edDessine()}
  if(a==='plus')edZoom(1.25);if(a==='moins')edZoom(.8);if(a==='centre')edCentre();
  if(a==='essai-n')edTeste(null);if(a==='essai-e')edTeste('expert');
  if(a==='exporte')edExporte();if(a==='copie')edCopie();if(a==='importe')$('ed-fichier').click();
  if(a==='quitte')quitterEditeur();
  if(a==='base'){if(!b.classList.contains('sur')){b.classList.add('sur');b.textContent='Sûr ? Re-clique';setTimeout(()=>{b.classList.remove('sur');b.textContent='Carte générée'},3000);return}
    b.classList.remove('sur');b.textContent='Carte générée';const avant=JSON.stringify(CU);ED.hist.push(avant);ED.base=(ED.base||0)+1;ED.cartes[ED.lv]=edBase(1000+ED.lv*7+ED.base*101);ED.msg='Nouvelle carte générée (Annuler pour revenir).';edSauve();edConstruit();edPanneau();edBarre()}
  if(a==='prends'){ED.ajout=ED.ajout===v?null:v;edPanneau()}
  if(a==='tableau'){ED.tabN=+v;edPanneau()}
  if(a==='sol'&&s&&s.aire!=null)edModifie(C=>{C.aires[s.aire]=C.aires[s.aire]||{};C.aires[s.aire].f=v});
  if(a==='sanstapis'&&s&&s.aire!=null)edModifie(C=>{C.aires[s.aire].tapis=null});
  if(s&&s.meuble!=null&&CU.furn[s.meuble]){
    if(a==='suppr'){edModifie(C=>C.furn.splice(s.meuble,1));ED.sel=null;edPanneau()}
    if(a==='aspect')edModifie(C=>{C.furn[s.meuble][3]=(Math.random()*1e6)|0});
    if(a==='tourne')edTourne();
    if(a==='double')edDouble();
  }
  edBarre();
}
function edTourne(){const s=ED.sel,CU=edCarte(),[n,x,y]=CU.furn[s.meuble],va=edVariantes(n);if(va.length<2)return;
  for(let k=1;k<va.length;k++){const m=va[(va.indexOf(n)+k)%va.length];if(edLibre(m,x,y,s.meuble)){edModifie(C=>{C.furn[s.meuble][0]=m});return}}ED.msg='Pas la place de le tourner ici.';edEtat()}
function edDouble(){const s=ED.sel,CU=edCarte(),[n,x,y,v]=CU.furn[s.meuble],[fw,fh]=FP[n];
  for(const[dx,dy]of[[fw,0],[-fw,0],[0,fh],[0,-fh],[fw,fh],[-fw,fh]])if(edLibre(n,x+dx,y+dy,-1)){edModifie(C=>C.furn.push([n,x+dx,y+dy,v]));ED.sel={meuble:edCarte().furn.length-1};edPanneau();return}
  ED.msg='Pas de place libre juste à côté.';edEtat()}
function edTouche(e){
  if(!ED.on)return;const tag=e.target.tagName;if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA')return;
  const k=e.key,s=ED.sel,CU=edCarte(),ctrl=e.ctrlKey||e.metaKey;
  if(ctrl&&k.toLowerCase()==='z'){e.preventDefault();e.shiftKey?edRefait():edAnnule();edBarre();return}
  if(ctrl&&k.toLowerCase()==='y'){e.preventDefault();edRefait();edBarre();return}
  if(k==='Escape'){ED.sel=null;ED.ajout=null;edPanneau();edDessine();return}
  if(s&&s.meuble!=null&&CU.furn[s.meuble]){
    if(k==='Delete'||k==='Backspace'){e.preventDefault();edModifie(C=>C.furn.splice(s.meuble,1));ED.sel=null;edPanneau();edBarre();return}
    if(k==='r'||k==='R'){edTourne();return}if(k==='v'||k==='V'){edModifie(C=>{C.furn[s.meuble][3]=(Math.random()*1e6)|0});return}if(k==='d'||k==='D'){edDouble();return}
    const dir={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[k];
    if(dir){e.preventDefault();const[n,x,y]=CU.furn[s.meuble];if(edLibre(n,x+dir[0],y+dir[1],s.meuble))edModifie(C=>{C.furn[s.meuble][1]+=dir[0];C.furn[s.meuble][2]+=dir[1]});else{ED.msg='Bloqué de ce côté.';edEtat()}return}
  }
  const p={ArrowLeft:[-24,0],ArrowRight:[24,0],ArrowUp:[0,-24],ArrowDown:[0,24]}[k];if(p){e.preventDefault();ED.cx+=p[0]/ED.z*3;ED.cy+=p[1]/ED.z*3;edDessine()}
  if(k==='+'||k==='=')edZoom(1.25);if(k==='-')edZoom(.8);
}

// ——— Essayer la carte en vraie partie ———
function edTeste(mode){
  edSauve();CARTES_PERSO={[ED.lv]:edCarte()};ED.on=false;$('ed').hidden=true;
  neuf(ED.lv,null,false,mode);S.perso=true;save();
  if(W.carte!==edCarte()){ED.on=true;$('ed').hidden=false;CARTES_PERSO=null;ED.msg='La partie d\'essai n\'a pas pu utiliser cette carte : corrige les problèmes signalés en bas.';edEtat();accueil();return}
  $('ed-retour').hidden=false;
}
function edRetour(){closeAll();enJeu=false;CARTES_PERSO=null;$('hud').hidden=true;$('ed-retour').hidden=true;ED.on=true;$('ed').hidden=false;edConstruit();edPanneau();edBarre()}

// ——— Exporter, copier, importer ———
function edFichier(){const m={};Object.entries(ED.cartes).forEach(([k,v])=>{if(v&&v.modif)m[k]=v});return JSON.stringify({format:'faux-alibi-cartes',version:1,date:new Date().toISOString().slice(0,10),cartes:m})}
function edExporte(){
  const n=Object.values(ED.cartes).filter(v=>v&&v.modif).length;if(!n){ED.msg='Rien à exporter : aucune carte modifiée pour l\'instant.';edEtat();return}
  try{const u=URL.createObjectURL(new Blob([edFichier()],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download='faux-alibi-cartes.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);
    ED.msg=`Fichier « faux-alibi-cartes.json » exporté (${n} lieu${n>1?'x':''}). Envoie-le-moi pour qu'il devienne la carte du jeu.`}catch(x){ED.msg='Export impossible ici : utilise « Copier ».'}
  edEtat();
}
function edCopie(){const t=edFichier();try{navigator.clipboard.writeText(t).then(()=>{ED.msg='Cartes copiées : colle-les dans un fichier texte.';edEtat()},()=>edMontre(t))}catch(x){edMontre(t)}}
function edMontre(t){$('ed-panneau').innerHTML=`<p class="ed-aide">Sélectionne tout ce texte et copie-le.</p><textarea class="ed-texte" readonly>${esc(t)}</textarea>`;const a=$('ed-panneau').querySelector('textarea');a.focus();a.select()}
function edImporte(t){
  try{const o=JSON.parse(t);if(o.format!=='faux-alibi-cartes'||!o.cartes)throw 0;let n=0;Object.entries(o.cartes).forEach(([k,v])=>{if(v&&v.plan&&v.furn){ED.cartes[k]=v;v.modif=true;n++}});
    ED.msg=`${n} carte${n>1?'s':''} importée${n>1?'s':''}.`;edSauve();edCharge(ED.lv,false)}catch(x){ED.msg='Ce fichier n\'est pas un export de l\'éditeur.';edEtat()}
}

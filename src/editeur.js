// Éditeur de cartes, réservé à l'auteur du jeu : on l'ouvre en ajoutant ?editeur à la fin de l'adresse.
// On part de la carte que le jeu a générée, on déplace les pièces, les portes et les meubles, on pose fenêtres,
// tableaux et tapis, on change sols et couleurs ; puis on exporte un fichier qui deviendra l'agencement par défaut.
const ED={on:false,lv:1,cartes:{},hist:[],redo:[],outil:'meubles',sel:null,z:3,cx:0,cy:0,ajout:null,tabN:0,tapisC:'#7a2f35',
  sprites:new Map(),icones:new Map(),grille:true,msg:'',pb:[],drag:null,hover:null,hors:[],base:0};
const ED_CLE='fauxalibi.editeur';
const enEditeur=()=>/[?&]editeur(?=$|&|=)/.test(location.search)||location.hash==='#editeur';
const ED_SOLS=[['parquet','Parquet'],['planche','Planches'],['scene','Scène'],['damier','Damier'],['tapis','Moquette'],['marbre','Marbre'],['pierre','Pierre'],['terre','Terre battue'],['metal','Métal'],['lino','Lino'],['sport','Sol de sport'],['beton','Béton']];
const ED_OUTILS=[['meubles','Meubles','Clique un meuble pour le choisir, glisse-le pour le déplacer.'],['ajout','Ajouter','Choisis un meuble dans la liste, puis clique sur la carte pour le poser.'],
  ['pieces','Pièces','Glisse le milieu d\'une pièce pour la déplacer avec tout ce qu\'elle contient, ses bords pour l\'agrandir.'],['portes','Portes','Glisse une porte le long de son mur. Clique le mur entre deux pièces voisines pour y ajouter une porte.'],['murs','Murs','Trace des murs dans les pièces et perces-y des portes.'],
  ['sol','Sols et murs','Clique une pièce pour changer son sol, la couleur de ses murs et son tapis.'],['tapis','Tapis','Trace un rectangle dans une pièce pour y poser un tapis.'],
  ['fenetres','Fenêtres','Choisis une sorte de fenêtre, puis clique sur un mur du fond. Clique une fenêtre posée pour la changer ou la retirer.'],['tableaux','Tableaux','Choisis un tableau, puis clique sur un mur du fond.']];
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
  G.furn={};W.furn.forEach(f=>{const A=W.areas[f.room],k=[f.name,f.v,f.room,A&&A.tint,c.lv,f.miroir?1:0,f.mod??''].join('|');let s=ED.sprites.get(k);if(!s){s=furnitureSprite(f);ED.sprites.set(k,s)}G.furn[f.id]=s});
  G.portes={};G.map=buildMap();
  ED.hors=CU.furn.map((q,i)=>i).filter(i=>!W.furn.some(f=>f.ci===i));
  edVerifie();edDessine();
}
// Cases libres qu'on ne peut pas atteindre (enfermées par des murs ou des meubles) et meubles sans accès
function edEnfermees(){
  const out=[],sansAcces=[];
  W.areas.forEach(A=>{
    const dans=(x,y)=>A.rects.some(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1),libre=(x,y)=>dans(x,y)&&W.t[y][x]===1&&!W.blk[y][x],l=[];
    A.rects.forEach(q=>{for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++)if(libre(x,y))l.push([x,y])});
    const comp=new Map();let n=0;const tailles=[];
    l.forEach(([x,y])=>{const k=x+','+y;if(comp.has(k))return;const st=[[x,y]];comp.set(k,n);let t=1;while(st.length){const[a,b]=st.pop();for(const[p,q]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=a+p,Y=b+q,K=X+','+Y;if(!libre(X,Y)||comp.has(K))continue;comp.set(K,n);t++;st.push([X,Y])}}tailles.push(t);n++});
    if(!n)return;const grand=tailles.indexOf(Math.max(...tailles));
    l.forEach(([x,y])=>{if(comp.get(x+','+y)!==grand)out.push([x,y])});
    W.furn.filter(f=>f.room===A.i&&!/^(mur|porte|porteL)$/.test(f.name)).forEach(f=>{let ok=false;for(let y=f.y-1;y<=f.y+f.h&&!ok;y++)for(let x=f.x-1;x<=f.x+f.w&&!ok;x++){const bord=(y===f.y-1||y===f.y+f.h)!==(x===f.x-1||x===f.x+f.w);if(bord&&comp.get(x+','+y)===grand)ok=true}if(!ok)sansAcces.push(f)});
  });
  return{cases:out,meubles:sansAcces};
}
function edVerifie(){
  const pb=[],CU=edCarte();
  ED.enf=edEnfermees();
  if(ED.enf.cases.length)pb.push(`${ED.enf.cases.length} case${ED.enf.cases.length>1?'s':''} enfermée${ED.enf.cases.length>1?'s':''} (croix rouges) : on ne peut plus y aller. Ouvre un passage ou bouche-la avec un meuble ou un mur.`);
  if(ED.enf.meubles.length)pb.push(`${ED.enf.meubles.length} meuble${ED.enf.meubles.length>1?'s':''} qu'on ne peut plus approcher (cadre rouge) : il faut un côté libre pour le fouiller.`);
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
  // cases enfermées et meubles inaccessibles
  if(ED.enf){g.strokeStyle='#ff4040';g.lineWidth=2/ED.z;ED.enf.cases.forEach(([x,y])=>{g.beginPath();g.moveTo(x*TS+3,y*TS+3);g.lineTo(x*TS+13,y*TS+13);g.moveTo(x*TS+13,y*TS+3);g.lineTo(x*TS+3,y*TS+13);g.stroke()});ED.enf.meubles.forEach(f=>g.strokeRect(f.x*TS+1,f.y*TS+1,f.w*TS-2,f.h*TS-2))}
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
  if(D&&D.murs){g.fillStyle=D.efface?'rgba(230,70,60,.45)':'rgba(120,220,140,.45)';D.cells.forEach(([x,y])=>g.fillRect(x*TS+1,y*TS+1,TS-2,TS-2))}
  if(D&&D.nouvelle){const[x0,y0,x1,y1]=D.nouvelle;g.fillStyle='rgba(255,210,63,.25)';g.fillRect(Math.min(x0,x1)*TS,Math.min(y0,y1)*TS,(Math.abs(x1-x0)+1)*TS,(Math.abs(y1-y0)+1)*TS);g.strokeStyle='#ffd23f';g.setLineDash([4/ED.z,3/ED.z]);g.strokeRect(Math.min(x0,x1)*TS,Math.min(y0,y1)*TS,(Math.abs(x1-x0)+1)*TS,(Math.abs(y1-y0)+1)*TS);g.setLineDash([])}
  if(sel&&sel.fen!=null&&CU.fen[sel.fen]){const[fx,fy]=CU.fen[sel.fen];g.strokeStyle='#ffd23f';g.lineWidth=2/ED.z;g.strokeRect(fx*TS,fy*TS,2*TS,2*TS)}
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
    edModifie(C=>{C.furn.push([n,x,y,(Math.random()*1e6)|0])});ED.sel={meuble:edCarte().furn.length-1};ED.recents=[n,...(ED.recents||[]).filter(q=>q!==n)].slice(0,8);return;
  }
  if(O_==='murs'){
    if(ED.murMode==='porte'){edPercePorte(cx,cy);return}
    if(W.t[cy]&&W.t[cy][cx]!==1&&!CU.furn.some(q=>q[0]==='mur'&&q[1]===cx&&q[2]===cy))return pan();
    ED.drag={murs:true,efface:CU.furn.some(q=>q[0]==='mur'&&q[1]===cx&&q[2]===cy),x0:cx,y0:cy,cells:[[cx,cy]]};edDessine();return;
  }
  if(O_==='pieces'&&ED.creer){ED.drag={nouvelle:[cx,cy,cx,cy]};edDessine();return}
  if(O_==='pieces'){
    const R=CU.plan.r.concat(CU.plan.c),bord=6/ED.z/TS;
    let i=-1,cote=null;
    for(let j=R.length-1;j>=0;j--){const q=R[j],fx=p.x/TS,fy=p.y/TS;if(fx<q[0]-bord||fx>q[0]+q[2]+bord||fy<q[1]-bord||fy>q[1]+q[3]+bord)continue;
      i=j;cote=Math.abs(fx-q[0])<bord?'g':Math.abs(fx-q[0]-q[2])<bord?'d':Math.abs(fy-q[1])<bord?'h':Math.abs(fy-q[1]-q[3])<bord?'b':null;break}
    if(i<0){ED.sel=null;edPanneau();return pan()}
    ED.sel={rect:i};ED.drag={rect:i,cote,sx:cx,sy:cy,q0:R[i].slice(),q:R[i].slice()};edPanneau();edDessine();return;
  }
  if(O_==='portes'){
    const d=Object.values(W.doors).find(d=>cx>=d.x&&cx<d.x+d.w&&cy>=d.y&&cy<d.y+d.h);if(!d){if(edAjoutePorte(cx,cy))return;return pan()}
    ED.sel={porte:d.id};ED.drag={porte:d.id,pos:[d.x,d.y],d};edDessine();return;
  }
  if(O_==='sol'){const a=W.areas.findIndex(A=>A.rects.some(q=>cx>=q.x0&&cx<=q.x1&&cy>=q.y0&&cy<=q.y1));if(a<0)return pan();ED.sel={aire:a};edPanneau();edDessine();return}
  if(O_==='tapis'){const a=W.areas.findIndex(A=>A.rects.some(q=>cx>=q.x0&&cx<=q.x1&&cy>=q.y0&&cy<=q.y1));if(a<0)return pan();ED.sel={aire:a};ED.drag={tapis:[cx,cy,cx,cy],aire:a};edPanneau();edDessine();return}
  if(O_==='fenetres'||O_==='tableaux'){
    const y=edHautMur(cx,cy);if(y==null)return pan();
    if(O_==='fenetres'){const i=CU.fen.findIndex(([x,yy])=>yy===y&&cx>=x&&cx<=x+1);
      if(i>=0){ED.sel={fen:i};edPanneau();edDessine()}else if(W.t[y][cx+1]===2){edModifie(C=>C.fen.push([cx,y,ED.fenT]));ED.sel={fen:edCarte().fen.length-1};edPanneau()}else{ED.msg='Une fenêtre fait deux cases de large.';edEtat()}}
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
  if(D.nouvelle){D.nouvelle[2]=cx;D.nouvelle[3]=cy;edDessine()}
  if(D.murs){const dx=cx-D.x0,dy=cy-D.y0,l=[];if(Math.abs(dx)>=Math.abs(dy))for(let k=0;k<=Math.abs(dx);k++)l.push([D.x0+Math.sign(dx)*k,D.y0]);else for(let k=0;k<=Math.abs(dy);k++)l.push([D.x0,D.y0+Math.sign(dy)*k]);D.cells=l;edDessine()}
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
  if(D.murs){edPoseMurs(D);return}
  if(D.nouvelle){const[a0,b0,a1,b1]=D.nouvelle;edCreePiece(Math.min(a0,a1),Math.min(b0,b1),Math.abs(a1-a0)+1,Math.abs(b1-b0)+1);return}
  if(D.tapis){const A=W.areas[D.aire],[a,b,c2,d]=D.tapis,x0=Math.max(A.x0,Math.min(a,c2)),x1=Math.min(A.x1,Math.max(a,c2)),y0=Math.max(A.y0,Math.min(b,d)),y1=Math.min(A.y1,Math.max(b,d));
    if(x1-x0<1||y1-y0<1){ED.msg='Un tapis fait au moins deux cases sur deux.';edEtat();edDessine();return}
    edModifie(C=>{C.aires[D.aire]=C.aires[D.aire]||{};C.aires[D.aire].tapis=[x0,y0,x1,y1,ED.tapisC]})}
}

// ——— Panneau de droite : la sélection, la palette, les réglages ———
function edPanneau(){
  const e=$('ed-panneau');if(!e||!W)return;const CU=edCarte(),s=ED.sel,O_=ED.outil,aide=ED_OUTILS.find(o=>o[0]===O_)[2];
  let h=`<p class="ed-aide">${aide}</p>`;
  if(O_==='meubles'&&s&&s.meuble!=null&&CU.furn[s.meuble]){const[n,x,y]=CU.furn[s.meuble],va=edVariantes(n);
    const op=CU.furn[s.meuble][4]||{},nm=ED_MODELES[n];
    h+=`<h3>${esc(edNom(n))}</h3><p class="petit">Case ${x}, ${y}${ED.hors.includes(s.meuble)?' · <b class="rouge">ignoré</b>':''}</p><div class="ed-boutons">
    ${va.length>1?'<button data-ed="tourne">Tourner <kbd>R</kbd></button>':''}<button data-ed="miroir" class="${op.m?'pris':''}">Miroir <kbd>M</kbd></button><button data-ed="double">Dupliquer <kbd>D</kbd></button><button data-ed="suppr" class="danger">Supprimer <kbd>Suppr</kbd></button></div>
    ${va.length>1?`<p class="petit">Orientation</p><div class="ed-modeles">${va.map(m=>`<button data-ed="oriente" data-v="${m}" class="${m===n?'pris':''}" title="${esc(edNom(m))}"><img alt="" src="${edVignette(m,CU.furn[s.meuble][3],op)}"></button>`).join('')}</div>`:''}
    ${nm?`<p class="petit">Modèle</p><div class="ed-modeles">${range(nm).map(k=>`<button data-ed="modele" data-v="${k}" class="${(op.mod??(n==='bed'?-1:CU.furn[s.meuble][3]%10))===k?'pris':''}"><img alt="" src="${edVignette(n,CU.furn[s.meuble][3],{...op,mod:k})}"></button>`).join('')}</div>`
      :/^(lift|escalier|secours)$/.test(n)?'':`<p class="petit">Aspect</p><div class="ed-modeles">${edAspects(CU.furn[s.meuble][3]).map(v=>`<button data-ed="aspectv" data-v="${v}" class="${v===CU.furn[s.meuble][3]?'pris':''}"><img alt="" src="${edVignette(n,v,op)}"></button>`).join('')}</div>`}
    <p class="petit">Flèches du clavier : déplacer d'une case.</p>`}
  if(O_==='ajout')h+=edPalette();
  if(O_==='pieces'&&!(s&&s.rect!=null))h+=`<h3>Créer une pièce</h3><label class="ed-champ">Nom <input id="ed-nompiece" class="ed-cherche" maxlength="28" value="${esc(ED.nomPiece||'Nouvelle pièce')}"></label><button data-ed="creer" class="${ED.creer?'pris':''}">${ED.creer?'Trace-la sur la carte…':'Tracer la nouvelle pièce'}</button><p class="petit">Place-la contre une autre pièce : une case de mur sur le côté, ou trois rangées en haut et en bas. Une porte se pose toute seule.</p>`;
  if(O_==='pieces'&&s&&s.rect!=null){const R0=CU.plan.r.concat(CU.plan.c),q0=R0[s.rect];if(q0&&q0[4]&&(CU.crees||[]).includes(q0[4]))h+=`<button data-ed="supprpiece" class="danger">Supprimer « ${esc(q0[4])} »</button>`}
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
  if(O_==='murs')h+=`<div class="ed-boutons"><button data-ed="murmode" data-v="mur" class="${ED.murMode!=='porte'?'pris':''}">Tracer un mur</button><button data-ed="murmode" data-v="porte" class="${ED.murMode==='porte'?'pris':''}">Percer une porte</button></div><p class="petit">${ED.murMode==='porte'?'Clique un mur pour y percer une porte (il faut deux cases de mur côte à côte, ou l\'une sous l\'autre). Clique une porte pour la reboucher. Pour changer son style : outil Meubles, Autre aspect.':'Glisse sur le sol pour tracer une ligne de mur. Glisse sur un mur déjà posé pour l\'effacer. Attention : un mur qui coupe une pièce en deux la rend injouable (les essais en bas le disent).'}</p>`;
  if(O_==='portes'&&s&&s.porte!=null&&W.doors[s.porte]){const d=W.doors[s.porte],na=W.areas[d.a].name,nb=W.areas[d.b].name;h+=`<h3>Porte</h3><p class="petit">Entre « ${esc(na)} » et « ${esc(nb)} »</p>`;if((CU.liens||[]).some(l=>l.includes(na)&&l.includes(nb)))h+='<button data-ed="supprlien" class="danger">Supprimer cette porte</button>';else h+='<p class="petit">Cette porte vient du plan du lieu : on peut la déplacer, pas la supprimer.</p>'}
  if(O_==='fenetres'){const fs0=s&&s.fen!=null&&CU.fen[s.fen],tc=fs0?(fs0[2]??-1):ED.fenT;
    h+=`${fs0?'<h3>Fenêtre choisie</h3>':'<p class="petit">Sorte de la prochaine fenêtre</p>'}<div class="ed-modeles larges">${FENETRES.map((nom,t)=>`<button data-ed="fentype" data-v="${t}" class="${tc===t?'pris':''}" title="${nom}"><img alt="" src="${edFenetre(t)}"><span>${nom}</span></button>`).join('')}</div>${fs0?'<button data-ed="fenretire" class="danger">Retirer cette fenêtre</button>':''}`}
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
    <span class="ed-outils" role="toolbar">${ED_OUTILS.map(([k,l])=>`<button data-ed-outil="${k}" title="${esc(l)}"><img alt="" src="${edIconeOutil(k)}"><span>${l}</span></button>`).join('')}</span>
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
  if(a==='cat'){ED.cat=v;ED.cherche='';edPanneau()}
  if(a==='tableau'){ED.tabN=+v;edPanneau()}
  if(a==='miroir'&&s&&s.meuble!=null)edMiroir();
  if(a==='murmode'){ED.murMode=v;edPanneau()}
  if(a==='supprlien'&&s&&s.porte!=null&&W.doors[s.porte]){const d=W.doors[s.porte],na=W.areas[d.a].name,nb=W.areas[d.b].name;edModifie(C=>{const noms=edNomsAires(C);delete C.portes[noms.indexOf(na)+'-'+noms.indexOf(nb)];delete C.portes[noms.indexOf(nb)+'-'+noms.indexOf(na)];C.liens=(C.liens||[]).filter(l=>!(l.includes(na)&&l.includes(nb)))},true);ED.sel=null;edPanneau()}
  if(a==='oriente'&&s&&s.meuble!=null){const q=CU.furn[s.meuble];if(edLibre(v,q[1],q[2],s.meuble))edModifie(C=>{C.furn[s.meuble][0]=v});else{ED.msg='Pas la place de le tourner ici.';edEtat()}}
  if(a==='modele'&&s&&s.meuble!=null)edModifie(C=>{const q=C.furn[s.meuble];q[4]={...(q[4]||{}),mod:+v}});
  if(a==='aspectv'&&s&&s.meuble!=null)edModifie(C=>{C.furn[s.meuble][3]=+v});
  if(a==='fentype'){if(s&&s.fen!=null&&CU.fen[s.fen])edModifie(C=>{C.fen[s.fen][2]=+v});else{ED.fenT=+v;edPanneau()}}
  if(a==='fenretire'&&s&&s.fen!=null){edModifie(C=>C.fen.splice(s.fen,1));ED.sel=null;edPanneau()}
  if(a==='creer'){ED.creer=!ED.creer;const ch=$('ed-nompiece');if(ch)ED.nomPiece=ch.value.trim()||'Nouvelle pièce';edPanneau()}
  if(a==='supprpiece'&&s&&s.rect!=null){if(!b.classList.contains('sur')){b.classList.add('sur');b.textContent='Sûr ? Re-clique';return}edSupprimePiece(s.rect)}
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
    if(k==='m'||k==='M'){edMiroir();return}
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

// ——— Modèles, aspects, miroir ———
const ED_MODELES={lamp:10,plant:10,bed:10};
const ED_VIGN=new Map();
function edVignette(n,v,op={}){const k=[n,v,op.m?1:0,op.mod??''].join('|');if(!ED_VIGN.has(k)){const[fw,fh]=FP[n];ED_VIGN.set(k,furnitureSprite({name:n,x:0,y:0,w:fw,h:fh,v,room:0,miroir:!!op.m,mod:op.mod}).toDataURL())}return ED_VIGN.get(k)}
const edAspects=v=>{const b=v-(v%8);return range(8).map(k=>b+k)};
function edMiroir(){const s=ED.sel;if(!s||s.meuble==null)return;edModifie(C=>{const q=C.furn[s.meuble],o={...(q[4]||{})};if(o.m)delete o.m;else o.m=1;if(Object.keys(o).length)q[4]=o;else q.length=4})}
function edFenetre(t){const k='f'+t+'|'+c.lv;if(!ED_VIGN.has(k)){const[q,g]=cv(40,28);R(g,c.set.tint||'#6a5a44',0,0,40,28);fenetreType(g,4,0,c.lv,3,t);ED_VIGN.set(k,q.toDataURL())}return ED_VIGN.get(k)}
// ——— Créer une pièce : elle se colle à ses voisines par une porte ———
function edNomsAires(C){const nr=C.plan.r.length,noms=W.areas.slice(0,nr).map(A=>A.name);C.plan.c.forEach(q=>{if(!noms.includes(q[4]))noms.push(q[4])});return noms}
function edRenumerote(C,avant,apres){
  const defaut={f:'parquet',t:c.set.tint||'#6a5a44',tapis:null};
  C.aires=apres.map(n=>{const i=avant.indexOf(n);return i>=0&&C.aires[i]?C.aires[i]:{...defaut}});
  const P={};Object.entries(C.portes||{}).forEach(([k,p])=>{const[a,b]=k.split('-').map(Number),ia=apres.indexOf(avant[a]),ib=apres.indexOf(avant[b]);if(ia>=0&&ib>=0)P[ia+'-'+ib]=p});C.portes=P;
}
function edVoisines(q,C,nom){
  const R=[...C.plan.r.map((r,i)=>[...r,W.areas[i].name]),...C.plan.c].filter(r=>r[4]!==nom),out=new Set();
  const[x0,y0]=q,x1=q[0]+q[2]-1,y1=q[1]+q[3]-1;
  R.forEach(r=>{const rx1=r[0]+r[2]-1,ry1=r[1]+r[3]-1;
    if((rx1+2===x0||x1+2===r[0])&&Math.min(y1,ry1)-Math.max(y0,r[1])>=2)out.add(r[4]);
    if((ry1+4===y0||y1+4===r[1])&&Math.min(x1,rx1)-Math.max(x0,r[0])>=3)out.add(r[4])});
  return[...out];
}
function edCreePiece(x,y,w,h){
  const ch=$('ed-nompiece');let nom=(ch&&ch.value.trim())||ED.nomPiece||'Nouvelle pièce';ED.creer=false;
  if(w<3||h<3){ED.msg='Une pièce fait au moins trois cases sur trois.';edEtat();edPanneau();edDessine();return}
  const CU=edCarte(),pris=new Set(W.areas.map(A=>A.name));let k=2,base=nom;while(pris.has(nom))nom=base+' '+(k++);
  const etage=CU.etage?[...new Set(CU.plan.c.map(r=>r[4]))].slice(-3):[],q=[x,y,w,h,nom],tout=edVoisines(q,CU,nom),vois=tout.filter(n=>!etage.includes(n));
  if(!vois.length&&tout.length){ED.msg="Les nouvelles pièces se collent au rez-de-chaussée, pas à l'étage.";edEtat();edPanneau();edDessine();return}
  if(!vois.length){ED.msg='La nouvelle pièce doit toucher une autre pièce : une case de mur sur le côté, ou trois rangées en haut ou en bas.';edEtat();edPanneau();edDessine();return}
  const ok=edModifie(C=>{
    const avant=edNomsAires(C),pos=C.etage?C.plan.c.length-3:C.plan.c.length;
    C.plan.c.splice(pos,0,q);C.liens=[...(C.liens||[]),...vois.slice(0,2).map(v=>[nom,v])];C.crees=[...(C.crees||[]),nom];
    edRenumerote(C,avant,edNomsAires(C));
  },true);
  if(ok){ED.msg='« '+nom+' » créée, reliée à '+vois.slice(0,2).join(' et ')+'.';edEtat()}
  edPanneau();
}
function edSupprimePiece(i){
  const CU=edCarte(),nr=CU.plan.r.length,q=(CU.plan.r.concat(CU.plan.c))[i];if(!q||!q[4]||!(CU.crees||[]).includes(q[4]))return;const nom=q[4];
  edModifie(C=>{
    const avant=edNomsAires(C),rs=C.plan.c.filter(r=>r[4]===nom),dans=(x,y)=>rs.some(r=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]);
    C.furn=C.furn.filter(f=>!dans(f[1],f[2]));C.fen=C.fen.filter(f=>!dans(f[0],f[1]+2));C.tab=C.tab.filter(f=>!dans(f[0],f[1]+2));
    C.plan.c=C.plan.c.filter(r=>r[4]!==nom);C.liens=(C.liens||[]).filter(l=>!l.includes(nom));C.crees=C.crees.filter(n=>n!==nom);
    edRenumerote(C,avant,edNomsAires(C));
  },true);
  ED.sel=null;edPanneau();
}

// ——— Murs intérieurs et portes ———
const edMurEn=(C,x,y)=>C.furn.findIndex(q=>q[0]==='mur'&&q[1]===x&&q[2]===y);
function edPoseMurs(D){
  const CU=edCarte();
  if(D.efface){const s=new Set(D.cells.map(([x,y])=>x+','+y));if(CU.furn.some(q=>q[0]==='mur'&&s.has(q[1]+','+q[2])))edModifie(C=>{C.furn=C.furn.filter(q=>!(q[0]==='mur'&&s.has(q[1]+','+q[2])))});else edDessine();return}
  const ok=D.cells.filter(([x,y])=>edMurEn(CU,x,y)<0&&edLibre('mur',x,y,-1));
  if(!ok.length){ED.msg='Pas de place pour un mur ici : meuble, porte, ou passage devant une porte.';edEtat();edDessine();return}
  edModifie(C=>{ok.forEach(([x,y])=>C.furn.push(['mur',x,y,1]))});
  if(ok.length<D.cells.length){ED.msg=(D.cells.length-ok.length)+' case(s) laissée(s) libre(s) : un meuble ou le passage d\'une porte.';edEtat()}
}
function edPercePorte(cx,cy){
  const CU=edCarte(),i=CU.furn.findIndex(q=>(q[0]==='porte'&&cy===q[2]&&cx>=q[1]&&cx<=q[1]+1)||(q[0]==='porteL'&&cx===q[1]&&cy>=q[2]&&cy<=q[2]+1));
  if(i>=0){const[n,x,y]=CU.furn[i];edModifie(C=>{C.furn.splice(i,1);if(n==='porte')C.furn.push(['mur',x,y,1],['mur',x+1,y,1]);else C.furn.push(['mur',x,y,1],['mur',x,y+1,1])});ED.msg='Porte rebouchée.';edEtat();return}
  if(edMurEn(CU,cx,cy)<0){ED.msg='Clique sur un mur pour y percer une porte.';edEtat();return}
  const v=(Math.random()*1e6)|0,g=edMurEn(CU,cx-1,cy)>=0,d=edMurEn(CU,cx+1,cy)>=0,h=edMurEn(CU,cx,cy-1)>=0,b=edMurEn(CU,cx,cy+1)>=0;
  if(g||d){const x0=d?cx:cx-1;edModifie(C=>{C.furn=C.furn.filter(q=>!(q[0]==='mur'&&q[2]===cy&&(q[1]===x0||q[1]===x0+1)));C.furn.push(['porte',x0,cy,v])});ED.msg='Porte percée.';edEtat();return}
  if(h||b){const y0=b?cy:cy-1;edModifie(C=>{C.furn=C.furn.filter(q=>!(q[0]==='mur'&&q[1]===cx&&(q[2]===y0||q[2]===y0+1)));C.furn.push(['porteL',cx,y0,v])});ED.msg='Porte percée.';edEtat();return}
  ED.msg='Il faut deux cases de mur côte à côte (ou l\'une sous l\'autre) pour une porte.';edEtat();
}
// Une porte de plus entre deux pièces voisines : on clique le mur qui les sépare
function edAjoutePorte(cx,cy){
  const aireEn=(x,y)=>W.areas.findIndex(A=>A.rects.some(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1));
  if(aireEn(cx,cy)>=0)return false;
  let a=-1,b=-1,pos=null;const g=aireEn(cx-1,cy),d=aireEn(cx+1,cy);
  if(g>=0&&d>=0&&g!==d){a=g;b=d;pos=[cx,cy]}
  else{let h=-1,yh=0,bas=-1;for(let k=1;k<=3&&h<0;k++){const i=aireEn(cx,cy-k);if(i>=0){h=i;yh=cy-k}}for(let k=1;k<=3&&bas<0;k++){const i=aireEn(cx,cy+k);if(i>=0)bas=i}
    if(h>=0&&bas>=0&&h!==bas){a=h;b=bas;pos=[cx,yh+1]}}
  if(a<0)return false;
  if(Object.values(W.doors).some(q=>(q.a===a&&q.b===b)||(q.a===b&&q.b===a))){ED.msg='Ces deux pièces ont déjà une porte : glisse-la pour la déplacer.';edEtat();return true}
  const na=W.areas[a].name,nb=W.areas[b].name;
  const ok=edModifie(C=>{C.liens=[...(C.liens||[]),[na,nb]];const noms=edNomsAires(C);C.portes=C.portes||{};C.portes[noms.indexOf(na)+'-'+noms.indexOf(nb)]=pos},true);
  if(ok){ED.msg='Porte ajoutée entre « '+na+' » et « '+nb+' ».';edEtat()}
  return true;
}

// ——— Le menu de construction : des catégories, des récents, une icône par outil ———
const ED_CATS=[
  ['salon','Salon','armchairR',/^(sofa|armchair|basse|fireplace|piano|gramophone|harpe|jukebox|television|billard|bar$|banquette|vaisselier|paravent|aquarium|cage)/],
  ['chambre','Chambre','bed',/^(bed|chevet|wardrobe|commode|vanity|trunk|valise|portant|mannequin|paravent)/],
  ['cuisine','Cuisine','stove',/^(fridge|stove|sink|counter|table|rtable|chair|stool|poele)/],
  ['bain','Bain','tub',/^(tub|toilet|shower|sink|medic|washer|cabine|bascule)/],
  ['bureau','Bureau','desk',/^(desk|pcdesk|shelf|cabinet|copier|console|coffrefort|livres|globe|clock)/],
  ['deco','Décor','plant',/^(plant|planter|lamp|vase|statue|buste|armure|fontaine|cage|aquarium|livres|globe|clock|banc|portemanteau|parapluies|chaussures|videpoche)/],
  ['stock','Rangement','crate',/^(barre|crate|barrel|trunk|locker|cartons|echelle|chariot|valise|ropes|skis|bouee|portant)/],
  ['tech','Technique','engine',/^(engine|tank|labbench|rack|console|spot|radio|perfusion|brancard|weights|treadmill|bandit|roulette|jetons|winerack|skirack)/],
  ['struct','Structure','escalier',/^(mur|porte|escalier|secours|lift)/]
];
const edTousMeubles=()=>Object.keys(FP).filter(n=>SPR[n]);
function edPalette(){
  const tous=edTousMeubles(),q=(ED.cherche||'').toLowerCase(),cat=ED.cat||'salon';
  const classes=n=>ED_CATS.filter(([,,,re])=>re.test(n)).map(c0=>c0[0]),divers=tous.filter(n=>!classes(n).length);
  const liste=q?tous.filter(n=>edNom(n).toLowerCase().includes(q)||n.includes(q)):cat==='divers'?divers:tous.filter(n=>classes(n).includes(cat));
  const bouton=n=>`<button data-ed="prends" data-v="${n}" class="${ED.ajout===n?'pris':''}" title="${esc(edNom(n))}"><img alt="" src="${edIcone(n).toDataURL()}"><span>${esc(edNom(n))}</span></button>`;
  const rec=(ED.recents||[]).filter(n=>FP[n]);
  return `<input id="ed-cherche" class="ed-cherche" placeholder="Chercher parmi ${tous.length} meubles…" value="${esc(ED.cherche||'')}">
    ${rec.length?`<p class="ed-titre">Récents</p><div class="ed-palette recents">${rec.map(bouton).join('')}</div>`:''}
    <div class="ed-cats" role="tablist">${[...ED_CATS,['divers','Divers','valise']].map(([k,l,ic])=>`<button data-ed="cat" data-v="${k}" class="${!q&&cat===k?'pris':''}" role="tab" aria-selected="${!q&&cat===k}"><img alt="" src="${edIcone(ic).toDataURL()}"><span>${l}</span></button>`).join('')}</div>
    <p class="ed-titre">${q?'Résultats':(ED_CATS.find(c0=>c0[0]===cat)||[0,'Divers'])[1]} · ${liste.length}</p>
    <div class="ed-palette">${liste.sort((a,b)=>edNom(a).localeCompare(edNom(b))).map(bouton).join('')||'<p class="petit">Aucun meuble ne porte ce nom.</p>'}</div>`;
}
const ED_ICO=new Map();
function edIconeOutil(k){
  if(ED_ICO.has(k))return ED_ICO.get(k);
  const[q,g]=cv(28,28);g.imageSmoothingEnabled=false;
  const meuble={meubles:'armchairR',ajout:'plant',murs:'mur',portes:'porte'}[k];
  if(meuble){const s=edIcone(meuble),f=Math.min(28/s.width,28/s.height);g.drawImage(s,(28-s.width*f)/2,(28-s.height*f)/2,s.width*f,s.height*f)}
  else if(k==='pieces'){R(g,'#5a4a3a',2,2,24,24);floorTile(g,'parquet',0,0,4,4,'#8a6a44');R(g,'#efe3c4',2,2,24,2);R(g,'#efe3c4',2,2,2,24);R(g,'#efe3c4',24,2,2,24);R(g,'#efe3c4',2,24,24,2)}
  else if(k==='sol'){floorTile(g,'damier',0,0,6,6,'#8a7a68')}
  else if(k==='tapis'){R(g,'#d8b35c',3,6,22,16);R(g,'#7a2f35',5,8,18,12);R(g,'#d8b35c',13,12,2,4)}
  else if(k==='fenetres'){fenetreType(g,-2,2,typeof c!=='undefined'&&c?c.lv:0,3,0)}
  else if(k==='tableaux'){tableau(g,4,4,0,7)}
  const u=q.toDataURL();ED_ICO.set(k,u);return u;
}

// Comptes d'inspecteurs : plusieurs joueurs sur le même appareil, chacun sa partie, ses statistiques et ses réglages.
// Une fiche par inspecteur : son avatar (dessiné comme les personnages du jeu, c'est lui qu'on joue), un grade qui monte,
// des insignes à débloquer et l'historique de ses enquêtes. Un verrou à quatre chiffres (contre les frères et sœurs :
// ce n'est pas un vrai mot de passe) et un code de transfert pour continuer sur un autre téléphone ou ordinateur.
// Tout reste sur l'appareil : pas de serveur, pas d'adresse e-mail.
const CPT_CLE='fauxalibi.comptes';
let CPT=null,CPV={vue:'fiche'},O_DEFAUT=null;
const HS_DE={0:0,1:1,2:2,3:3,4:4,5:0,6:0,7:2,8:2,9:1};
const COIFFURES={f:[2,3,4,7,5,8],h:[0,1,5,6,9]};
const VESTES=['#b89a6a','#3a3a48','#6a2a2a',...TOPS];
function avatarDefaut(i=0){return{f:false,skin:INSPECTEUR.skin,hair:INSPECTEUR.hair,fhs:6,eye:INSPECTEUR.eye,age:1,top:VESTES[i%VESTES.length],bot:'#3a3a48',glasses:false,beard:false,hat:true,trench:true}}
function cptLit(){
  if(!O_DEFAUT&&typeof O!=='undefined')O_DEFAUT=JSON.parse(JSON.stringify(O));
  try{CPT=JSON.parse(localStorage.getItem(CPT_CLE))}catch(e){CPT=null}
  if(!CPT||!Array.isArray(CPT.liste)||!CPT.liste.length){CPT={actif:'p1',liste:[{id:'p1',nom:'Inspecteur',av:avatarDefaut(0),cree:Date.now(),pin:null}]};cptEcrit()}
  if(!CPT.liste.some(p=>p.id===CPT.actif))CPT.actif=CPT.liste[0].id;
}
function cptEcrit(){try{localStorage.setItem(CPT_CLE,JSON.stringify(CPT))}catch(e){}}
const profil=()=>{if(!CPT)cptLit();return CPT.liste.find(p=>p.id===CPT.actif)||CPT.liste[0]};
// le premier compte garde l'ancienne sauvegarde : rien n'est perdu en passant aux comptes
const cleProfil=id=>{id=id||(CPT?CPT.actif:'p1');return id==='p1'?STORE:STORE+'.'+id};
const lookDe=av=>({...INSPECTEUR,...av,hs:HS_DE[av.fhs]??0,trait:''});
const monLook=()=>{const p=profil();return p&&p.av?lookDe(p.av):INSPECTEUR};
const AVATARS=new Map();
function avatarURL(av,taille=96){const k=JSON.stringify(av)+taille;if(!AVATARS.has(k))AVATARS.set(k,portrait(lookDe(av),8).toDataURL());return AVATARS.get(k)}
function silhouetteURL(av){const k='s'+JSON.stringify(av);if(!AVATARS.has(k)){const sh=charSheet(lookDe(av)),[q,g]=cv(20,30);g.drawImage(sh,0,0,20,30,0,0,20,30);AVATARS.set(k,q.toDataURL())}return AVATARS.get(k)}
const statsDe=id=>{if(id===CPT.actif)return stats;try{const o=JSON.parse(localStorage.getItem(cleProfil(id)));return o&&o.stats||{}}catch(e){return{}}};

// ——— Grade : des points pour chaque enquête, chaque bonne note, chaque fin découverte ———
const PTS_NOTE={A:8,B:5,C:3,D:1};
function points(s){
  let p=10*(s.gagnees||0);
  Object.values(s.notes||{}).forEach(n=>p+=PTS_NOTE[n]||0);
  Object.values(s.exp||{}).forEach(n=>p+=15+(PTS_NOTE[n]||0));
  p+=5*Object.keys(s.fins||{}).length+2*Object.keys(s.jours||{}).length;
  return p;
}
const GRADES=[[0,'Stagiaire','Stagiaire'],[30,'Inspecteur','Inspectrice'],[80,'Inspecteur principal','Inspectrice principale'],[160,'Commissaire','Commissaire'],
  [280,'Commissaire divisionnaire','Commissaire divisionnaire'],[450,'Directeur de la PJ','Directrice de la PJ'],[700,'Légende du Quai','Légende du Quai']];
function grade(s,f){
  const p=points(s);let i=0;while(i+1<GRADES.length&&p>=GRADES[i+1][0])i++;
  const a=GRADES[i][0],b=GRADES[i+1]?GRADES[i+1][0]:a;
  return{nom:GRADES[i][f?2:1],suivant:GRADES[i+1]?GRADES[i+1][f?2:1]:null,p,part:b>a?(p-a)/(b-a):1,manque:b-p};
}
// ——— Insignes ———
const INSIGNES=[
  ['premiere','1','Première affaire','Résoudre une enquête',s=>s.gagnees>=1],
  ['dix','10','Tour des dix lieux','Résoudre les dix lieux',s=>range(10).every(i=>s.res&&s.res[i])],
  ['fins','6','Toutes les fins','Découvrir les six fins',s=>Object.keys(s.fins||{}).length>=6],
  ['noteA','A','Sans fausse note','Obtenir la note A',s=>Object.values(s.notes||{}).includes('A')],
  ['parfait','A+','Perfection','La note A dans les dix lieux',s=>range(10).every(i=>s.notes&&s.notes[i]==='A')],
  ['seul','∅','Sans aide','Gagner sans demander aucune aide',s=>(s.hist||[]).some(h=>h.win&&!h.ai)],
  ['eclair','5′','Éclair','Gagner en cinq minutes ou moins',s=>(s.hist||[]).some(h=>h.win&&h.min<=5)],
  ['fouineur','?','Fouineur','Trouver toutes les cachettes d\'une enquête',s=>(s.hist||[]).some(h=>h.tot&&h.tr>=h.tot)],
  ['expert','E','Expert','Résoudre une enquête en mode expert',s=>Object.keys(s.exp||{}).length>=1],
  ['maitre','E10','Maître expert','Les dix lieux en mode expert',s=>range(10).every(i=>s.exp&&s.exp[i])],
  ['serie','3×','Sur la lancée','Trois enquêtes résolues d\'affilée',s=>Math.max(s.serieMax||0,s.serie||0)>=3],
  ['fidele','J5','Fidèle au poste','Faire cinq enquêtes du jour',s=>Object.keys(s.jours||{}).length>=5],
  ['assidu','J3','Assidu','Trois enquêtes du jour d\'affilée',s=>(s.serieJ||0)>=3],
  ['erreur','!','Erreur judiciaire','Se tromper de coupable : ça arrive aux meilleurs',s=>(s.hist||[]).some(h=>!h.win)]
];
const insignesDe=s=>INSIGNES.filter(q=>{try{return q[4](s)}catch(e){return false}}).map(q=>q[0]);
// À la fin d'une enquête : une ligne d'historique, et les insignes gagnés sont annoncés
function cptFinEnquete(ok){
  const avant=new Set(insignesDe(stats)),n=S.fin.note||{};
  stats.hist=[{t:Date.now(),lv:S.lv,mode:S.mode||'',win:ok,n:n.l,min:n.min,ai:n.ai||0,tr:n.tr,tot:n.tot,jour:!!S.jour},...(stats.hist||[])].slice(0,40);
  stats.serieMax=Math.max(stats.serieMax||0,stats.serie||0);
  const neufs=INSIGNES.filter(q=>!avant.has(q[0])&&insignesDe(stats).includes(q[0]));
  neufs.forEach((q,i)=>setTimeout(()=>toast(`Insigne débloqué : ${q[2]}`,true),1800+i*2600));
}

// ——— Changer de compte ———
function cptChange(id){
  if(enJeu&&S)save();
  CPT.actif=id;cptEcrit();
  stats={gagnees:0,serie:0,enigmes:0,res:{},notes:{},sys:{},fins:{},jours:{},serieJ:0,exp:{}};
  if(O_DEFAUT){Object.keys(O).forEach(k=>delete O[k]);Object.assign(O,JSON.parse(JSON.stringify(O_DEFAUT)))}
  S=null;G.sauve=null;G.sauveVieille=false;
  chargeStats();appliqueOpts();fermeComptes();closeAll();accueil();
  toast(`Bonjour, ${profil().nom} !`,true);
}
const hachePin=(id,code)=>{let x=5381;for(const ch of id+':'+code)x=((x<<5)+x+ch.charCodeAt(0))>>>0;return x.toString(36)};

// ——— La fenêtre des comptes ———
function ouvrirComptes(vue='fiche',accueilPremier){
  if(!CPT)cptLit();CPV={vue,premier:!!accueilPremier};
  let e=$('comptes');if(!e){e=document.createElement('div');e.id='comptes';e.className='pop';$('options').parentElement.appendChild(e)}
  e.hidden=false;dessineComptes();
}
function fermeComptes(){const e=$('comptes');if(e)e.hidden=true}
function carteCompte(){
  const p=profil(),g=grade(stats,p.av.f);
  return`<button class="carte-cpt" data-cp="fiche" aria-label="Ma fiche d'inspecteur"><img alt="" src="${avatarURL(p.av)}"><span><b>${esc(p.nom)}</b><small>${esc(g.nom)}</small><i class="xp"><i style="width:${Math.round(g.part*100)}%"></i></i></span></button>`;
}
function dessineComptes(){
  const e=$('comptes'),p=profil(),V=CPV.vue,fermer=CPV.premier&&V==='liste'?'':`<button class="croix" data-cp="fermer" aria-label="Fermer">${croix}</button>`;
  let h='';
  if(V==='liste'){
    h=`<h3>${CPV.premier?'Qui enquête ?':'Changer de compte'}</h3><div class="cpt-liste">${CPT.liste.map(q=>{const s=statsDe(q.id),g=grade(s,q.av.f);
      return`<button class="cpt-perso ${q.id===CPT.actif?'actif':''}" data-cp="choisir" data-v="${q.id}"><img alt="" src="${avatarURL(q.av)}"><b>${esc(q.nom)}${q.pin?' <span class="cadenas" title="Protégé par un code">●</span>':''}</b><small>${esc(g.nom)}</small><small>${s.gagnees||0} enquête${(s.gagnees||0)>1?'s':''} résolue${(s.gagnees||0)>1?'s':''}</small></button>`}).join('')}
      ${CPT.liste.length<8?'<button class="cpt-perso nouveau" data-cp="nouveau"><span class="plus">+</span><b>Nouvel inspecteur</b><small>Une partie toute neuve</small></button>':''}</div>
      <div class="ligne"><button class="etiq" data-cp="importer">J'ai un code de transfert</button></div>`;
  }
  if(V==='fiche'){
    const g=grade(stats,p.av.f),gagnes=insignesDe(stats),H=stats.hist||[],nbLieux=range(10).filter(i=>stats.res[i]).length;
    const meilleures=range(10).map(i=>stats.notes&&stats.notes[i]?`<span class="note n${stats.notes[i]}" title="${esc(LEVELS[i].nom)}">${stats.notes[i]}</span>`:`<span class="note vide" title="${esc(LEVELS[i].nom)}">·</span>`).join('');
    h=`<div class="cpt-fiche"><div class="cpt-tete"><div class="cpt-photo"><img alt="Portrait" src="${avatarURL(p.av)}"><img class="corps" alt="" src="${silhouetteURL(p.av)}"></div>
      <div class="cpt-id"><small>Carte de police · Brigade criminelle</small><input class="cpt-nom" data-cp-nom maxlength="18" value="${esc(p.nom)}" aria-label="Nom de l'inspecteur">
      <b class="grade">${esc(g.nom)}</b><i class="xp grand"><i style="width:${Math.round(g.part*100)}%"></i></i><small>${g.suivant?`${g.p} points · encore ${g.manque} pour devenir ${esc(g.suivant)}`:`${g.p} points · grade le plus haut`}</small></div></div>
      <div class="cpt-chiffres"><div><b>${stats.gagnees||0}</b><span>enquêtes résolues</span></div><div><b>${nbLieux}/10</b><span>lieux résolus</span></div><div><b>${Object.keys(stats.fins||{}).length}/6</b><span>fins découvertes</span></div><div><b>${Math.max(stats.serieMax||0,stats.serie||0)}</b><span>meilleure série</span></div><div><b>${Object.keys(stats.exp||{}).length}/10</b><span>lieux en expert</span></div><div><b>${Object.keys(stats.jours||{}).length}</b><span>enquêtes du jour</span></div></div>
      <h4>Meilleures notes</h4><div class="cpt-notes">${meilleures}</div>
      <h4>Insignes · ${gagnes.length}/${INSIGNES.length}</h4><div class="cpt-insignes">${INSIGNES.map(([k,sym,nom,dit])=>`<div class="insigne ${gagnes.includes(k)?'oui':''}" title="${esc(dit)}"><i>${esc(sym)}</i><b>${esc(nom)}</b><small>${esc(dit)}</small></div>`).join('')}</div>
      <h4>Dernières enquêtes</h4>${H.length?`<ul class="cpt-hist">${H.slice(0,8).map(q=>`<li class="${q.win?'oui':'non'}"><b>${esc(LEVELS[q.lv]?LEVELS[q.lv].nom:'?')}</b><span>${q.win?'Résolue':'Ratée'}${q.n&&q.win?' · note '+q.n:''}${q.min?' · '+q.min+' min':''}${q.mode==='expert'?' · expert':''}${q.jour?' · du jour':''}</span><small>${new Date(q.t).toLocaleDateString('fr-FR')}</small></li>`).join('')}</ul>`:'<p class="petit">Aucune enquête terminée pour l\'instant.</p>'}
      <div class="ligne"><button class="etiq fort" data-cp="avatar">Changer mon apparence</button><button class="etiq" data-cp="liste">Changer de compte</button><button class="etiq" data-cp="pin">${p.pin?'Changer ou retirer le code':'Protéger par un code'}</button><button class="etiq" data-cp="exporter">Code de transfert</button></div>
      ${CPT.liste.length>1?'<div class="ligne"><button class="etiq alt" data-cp="supprimer">Supprimer ce compte</button></div>':''}</div>`;
  }
  if(V==='avatar'){
    const a=CPV.av||(CPV.av=JSON.parse(JSON.stringify(p.av)));
    const ligne=(cle,titre,vals,rendu)=>`<div class="opt"><span>${titre}</span><div class="ligne">${vals.map(v=>`<button class="etiq ${JSON.stringify(a[cle])===JSON.stringify(v)?'actif':''}" data-cp="av" data-k="${cle}" data-v='${esc(JSON.stringify(v))}'>${rendu(v)}</button>`).join('')}</div></div>`;
    const pastille=c0=>`<i class="pastille" style="background:${c0}"></i>`;
    h=`<h3>Mon apparence</h3><div class="cpt-avatar"><div class="cpt-photo grand"><img alt="Aperçu du portrait" src="${avatarURL(a)}"><img class="corps" alt="" src="${silhouetteURL(a)}"></div>
      <div class="lignes">${ligne('f','Inspecteur ou inspectrice',[false,true],v=>v?'Inspectrice':'Inspecteur')}
      ${ligne('skin','Peau',SKINS,pastille)}${ligne('hair','Cheveux',HAIRS,pastille)}
      ${ligne('fhs','Coiffure',COIFFURES[a.f?'f':'h'],v=>'Style '+(COIFFURES[a.f?'f':'h'].indexOf(v)+1))}
      ${ligne('eye','Yeux',['#3a2a1a','#2e5a7a','#3a6a4a','#5a3a22','#6a7a8a'],pastille)}
      ${ligne('top','Veste',VESTES,pastille)}${ligne('age','Âge',[0,1,2],v=>['Jeune','Confirmé','Vétéran'][v])}
      ${ligne('trench','Imperméable',[true,false],v=>v?'Oui':'Non')}${ligne('hat','Chapeau',[true,false],v=>v?'Oui':'Non')}${ligne('glasses','Lunettes',[false,true],v=>v?'Oui':'Non')}${a.f?'':ligne('beard','Barbe',[false,true],v=>v?'Oui':'Non')}</div></div>
      <div class="ligne"><button class="etiq fort" data-cp="avok">Garder ce look</button><button class="etiq" data-cp="hasard">Au hasard</button><button class="etiq alt" data-cp="fiche">Annuler</button></div>`;
  }
  if(V==='pin'||V==='entrer'){
    const titre=V==='entrer'?`Code de ${esc((CPT.liste.find(q=>q.id===CPV.cible)||{}).nom||'')}`:CPV.etape===2?'Retape le code pour confirmer':(p.pin?'Nouveau code (ou retire-le)':'Choisis un code à 4 chiffres');
    h=`<h3>${titre}</h3><p class="petit">${V==='entrer'?'Ce compte est protégé.':'Le code protège ce compte sur cet appareil. Ce n\'est pas un mot de passe : ne mets pas un code que tu utilises ailleurs.'}</p>
      <div class="cpt-code">${[0,1,2,3].map(i=>`<i class="${(CPV.saisie||'').length>i?'plein':''}"></i>`).join('')}</div>${CPV.erreur?`<p class="erreur">${esc(CPV.erreur)}</p>`:''}
      <div class="cpt-pave">${[1,2,3,4,5,6,7,8,9,'←',0,'OK'].map(k=>`<button class="etiq" data-cp="touche" data-v="${k}">${k}</button>`).join('')}</div>
      <div class="ligne">${V==='pin'&&p.pin?'<button class="etiq alt" data-cp="sanspin">Retirer le code</button>':''}<button class="etiq" data-cp="${V==='entrer'?'liste':'fiche'}">Annuler</button></div>`;
  }
  if(V==='exporter'){
    h=`<h3>Code de transfert</h3><p class="petit">Copie ce code, puis sur ton autre téléphone ou ordinateur : ouvre le jeu, « Changer de compte », « J'ai un code de transfert », et colle-le. Ta progression, ton apparence et ta partie en cours y seront copiées.</p>
      <textarea id="cpt-code" class="cpt-texte" readonly>${esc(CPV.code||'Préparation du code…')}</textarea>
      <div class="ligne"><button class="etiq fort" data-cp="copier">Copier le code</button><button class="etiq" data-cp="fiche">Retour</button></div>`;
  }
  if(V==='importer'){
    h=`<h3>J'ai un code de transfert</h3><p class="petit">Colle ici le code copié sur ton autre appareil. Un nouveau compte sera créé avec cette progression.</p>
      <textarea id="cpt-colle" class="cpt-texte" placeholder="FA2-…"></textarea>${CPV.erreur?`<p class="erreur">${esc(CPV.erreur)}</p>`:''}
      <div class="ligne"><button class="etiq fort" data-cp="importok">Importer</button><button class="etiq" data-cp="liste">Annuler</button></div>`;
  }
  if(V==='nouveau'){
    h=`<h3>Nouvel inspecteur</h3><p class="petit">Une partie toute neuve, avec ses propres enquêtes, réglages et insignes.</p>
      <input id="cpt-nouveau" class="cpt-nom" maxlength="18" placeholder="Ton nom d'inspecteur" value="">${CPV.erreur?`<p class="erreur">${esc(CPV.erreur)}</p>`:''}
      <div class="ligne"><button class="etiq fort" data-cp="creer">Créer le compte</button><button class="etiq" data-cp="liste">Annuler</button></div>`;
  }
  if(V==='supprimer'){
    h=`<h3>Supprimer « ${esc(p.nom)} » ?</h3><p>Toute sa progression, ses insignes et sa partie en cours seront effacés de cet appareil. On ne peut pas revenir en arrière.</p>
      <div class="ligne"><button class="etiq alt" data-cp="supprok">Oui, supprimer</button><button class="etiq" data-cp="fiche">Non, garder</button></div>`;
  }
  e.innerHTML=`<div class="fiche-pz comptes">${fermer}${h}</div>`;
  const champ=e.querySelector('#cpt-nouveau,#cpt-colle');if(champ)champ.focus();
}
async function codeTransfert(){
  const p=profil(),d={f:'FA',v:1,nom:p.nom,av:p.av,stats,O,S:S&&!S.fin?S:null};
  let b=new TextEncoder().encode(JSON.stringify(d)),pre='FA1-';
  if(window.CompressionStream){try{const s=new Blob([b]).stream().pipeThrough(new CompressionStream('deflate-raw'));b=new Uint8Array(await new Response(s).arrayBuffer());pre='FA2-'}catch(e){}}
  let bin='';for(let i=0;i<b.length;i+=8192)bin+=String.fromCharCode(...b.subarray(i,i+8192));
  return pre+btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function litCode(code){
  code=code.trim().replace(/\s+/g,'');const pre=code.slice(0,4),b64=code.slice(4).replace(/-/g,'+').replace(/_/g,'/');
  if(pre!=='FA1-'&&pre!=='FA2-')throw new Error('format');
  let b=Uint8Array.from(atob(b64+'==='.slice((b64.length+3)%4)),ch=>ch.charCodeAt(0));
  if(pre==='FA2-'){const s=new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'));b=new Uint8Array(await new Response(s).arrayBuffer())}
  const d=JSON.parse(new TextDecoder().decode(b));if(d.f!=='FA'||!d.stats)throw new Error('contenu');return d;
}
const nouvelId=()=>'p'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36);
async function clicComptes(ev){
  const b=ev.target.closest('[data-cp]');if(!b||b.tagName==='INPUT')return;
  const a=b.dataset.cp,v=b.dataset.v,p=profil();CPV.erreur=null;
  if(a==='fiche'){if($('comptes')&&!$('comptes').hidden){CPV={vue:'fiche'};return dessineComptes()}return ouvrirComptes('fiche')}
  if(a==='fermer')return fermeComptes();
  if(['liste','avatar','pin','importer','nouveau','supprimer'].includes(a)){CPV={vue:a,premier:CPV.premier&&a==='liste'};if(a==='avatar')CPV.av=JSON.parse(JSON.stringify(p.av));return dessineComptes()}
  if(a==='choisir'){const q=CPT.liste.find(x=>x.id===v);if(!q)return;if(q.id===CPT.actif){fermeComptes();return}
    if(q.pin){CPV={vue:'entrer',cible:q.id,saisie:''};return dessineComptes()}return cptChange(q.id)}
  if(a==='av'){CPV.av[b.dataset.k]=JSON.parse(v);if(b.dataset.k==='f'){CPV.av.fhs=COIFFURES[CPV.av.f?'f':'h'][0];if(CPV.av.f)CPV.av.beard=false}son('page');return dessineComptes()}
  if(a==='hasard'){const r=Math.random,A=CPV.av;A.f=r()<.5;A.skin=pick(r,SKINS);A.hair=pick(r,HAIRS);A.fhs=pick(r,COIFFURES[A.f?'f':'h']);A.top=pick(r,VESTES);A.age=int(r,3);A.trench=r()<.6;A.hat=r()<.5;A.glasses=r()<.3;A.beard=!A.f&&r()<.35;return dessineComptes()}
  if(a==='avok'){p.av=CPV.av;cptEcrit();if(enJeu){G.sheet.me=charSheet(monLook());G.porMe=portrait(monLook(),8)}CPV={vue:'fiche'};dessineComptes();accueilSiOuvert();return toast('Nouveau look enregistré',true)}
  if(a==='touche'){
    if(v==='←'){CPV.saisie=(CPV.saisie||'').slice(0,-1);return dessineComptes()}
    if(v!=='OK'){if((CPV.saisie||'').length<4)CPV.saisie=(CPV.saisie||'')+v;if(CPV.saisie.length<4)return dessineComptes()}
    if((CPV.saisie||'').length<4){CPV.erreur='Il faut quatre chiffres.';return dessineComptes()}
    if(CPV.vue==='entrer'){const q=CPT.liste.find(x=>x.id===CPV.cible);if(q&&hachePin(q.id,CPV.saisie)===q.pin)return cptChange(q.id);CPV.saisie='';CPV.erreur='Ce n\'est pas le bon code.';son('marteau');return dessineComptes()}
    if(CPV.etape!==2){CPV.premierCode=CPV.saisie;CPV.saisie='';CPV.etape=2;return dessineComptes()}
    if(CPV.saisie!==CPV.premierCode){CPV={vue:'pin'};CPV.erreur='Les deux codes ne sont pas pareils. On recommence.';return dessineComptes()}
    p.pin=hachePin(p.id,CPV.saisie);cptEcrit();CPV={vue:'fiche'};dessineComptes();return toast('Compte protégé par un code',true);
  }
  if(a==='sanspin'){p.pin=null;cptEcrit();CPV={vue:'fiche'};dessineComptes();return toast('Code retiré',true)}
  if(a==='exporter'){CPV={vue:'exporter'};dessineComptes();try{CPV.code=await codeTransfert()}catch(e){CPV.code='Impossible de préparer le code sur cet appareil.'}if(CPV.vue==='exporter')dessineComptes();return}
  if(a==='copier'){const t=$('cpt-code');try{await navigator.clipboard.writeText(t.value);toast('Code copié',true)}catch(e){t.focus();t.select();toast('Sélectionne le code et copie-le',true)}return}
  if(a==='importok'){
    try{const d=await litCode($('cpt-colle').value),id=nouvelId(),nom=(d.nom||'Inspecteur').slice(0,18);
      localStorage.setItem(cleProfil(id),JSON.stringify({S:d.S||null,stats:d.stats,O:d.O||{}}));
      CPT.liste.push({id,nom:CPT.liste.some(q=>q.nom===nom)?nom+' (2)':nom,av:d.av||avatarDefaut(CPT.liste.length),cree:Date.now(),pin:null});cptEcrit();return cptChange(id)}
    catch(e){CPV={vue:'importer',erreur:'Ce code ne marche pas : vérifie qu\'il est copié en entier.'};return dessineComptes()}
  }
  if(a==='creer'){const nom=($('cpt-nouveau').value||'').trim().slice(0,18);if(!nom){CPV={vue:'nouveau',erreur:'Donne un nom à ton inspecteur.'};return dessineComptes()}
    const id=nouvelId(),av=avatarDefaut(CPT.liste.length);CPT.liste.push({id,nom,av,cree:Date.now(),pin:null});cptEcrit();cptChange(id);return ouvrirComptes('avatar')}
  if(a==='supprok'){const id=p.id;try{localStorage.removeItem(cleProfil(id))}catch(e){}CPT.liste=CPT.liste.filter(q=>q.id!==id);
    // le premier compte garde la clé historique : si on le supprime, un autre la reprend
    if(id==='p1'&&CPT.liste.length){const q=CPT.liste[0];try{const o=localStorage.getItem(cleProfil(q.id));if(o!==null){localStorage.setItem(STORE,o);localStorage.removeItem(cleProfil(q.id))}else localStorage.removeItem(STORE)}catch(e){}q.id='p1'}
    CPT.actif=CPT.liste[0].id;cptEcrit();return cptChange(CPT.actif)}
}
const accueilSiOuvert=()=>{if(!enJeu&&$('accueil')&&!$('accueil').hidden)accueil()};
document.addEventListener('click',e=>{if(e.target.closest('[data-cp]'))clicComptes(e)});
document.addEventListener('change',e=>{if(e.target.matches('[data-cp-nom]')){const n=e.target.value.trim().slice(0,18);if(n){profil().nom=n;cptEcrit();accueilSiOuvert();toast('Nom enregistré',true)}}});
document.addEventListener('keydown',e=>{const c0=$('comptes');if(!c0||c0.hidden)return;if(e.target.tagName!=='INPUT'&&e.target.tagName!=='TEXTAREA')e.stopPropagation();
  if(CPV.vue==='entrer'||CPV.vue==='pin'){if(/^[0-9]$/.test(e.key)){e.preventDefault();const b=c0.querySelector(`[data-cp="touche"][data-v="${e.key}"]`);if(b)b.click()}else if(e.key==='Backspace'){e.preventDefault();c0.querySelector('[data-cp="touche"][data-v="←"]').click()}}
  if(e.key==='Enter'&&CPV.vue==='nouveau'){e.preventDefault();c0.querySelector('[data-cp="creer"]').click()}
  if(e.key==='Escape'&&!(CPV.premier&&CPV.vue==='liste'))fermeComptes()},true);

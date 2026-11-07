// Niveau test : un couloir, six salles, six façons d'interroger. Le calepin change à chaque porte.
const hE=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
// Onde du polygraphe : calme quand on dit vrai, affolée quand on ment
function ondeImg(i,ment,emue){
  const[k,g]=cv(240,34);R(g,'#f6f2e2',0,0,240,34);for(let x=0;x<240;x+=12)R(g,'#d8d0b8',x,0,1,34);R(g,'#d8d0b8',0,17,240,1);
  let y0=17;for(let x=0;x<240;x++){
    const zone=x>70&&x<150,a=ment&&zone?14:emue&&zone?7:2.4,y=17+Math.sin(x*(zone&&ment?.9:.34)+i)*a+(noise(x,i,4)-.5)*(ment&&zone?12:emue&&zone?6:2);
    const b=Math.max(1,Math.min(32,Math.round(y)));R(g,'#a33a3a',x,Math.min(y0,b),1,Math.abs(y0-b)+1);y0=b;
  }
  return k.toDataURL();
}
// Le croquis du portrait-robot, au crayon
function croquis(v){
  const[k,g]=cv(120,136),P=(x,y,w=1,h=1)=>R(g,'#3a3a44',Math.round(x),Math.round(y),w,h),L=(x,y,w=1,h=1)=>R(g,'rgba(58,58,68,.45)',Math.round(x),Math.round(y),w,h);
  const rond=(cx,cy,rx,ry,a0=0,a1=6.3)=>{for(let a=a0;a<a1;a+=.03)P(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry)};
  // Épaules, cou, tête
  rond(60,146,46,32,3.3,6.1);L(50,92,1,12);L(70,92,1,12);rond(60,62,27,35);
  for(let i=0;i<7;i++)L(82+i*.3,60+i*5,4-i*.4,1);
  // Yeux, nez, bouche
  [48,72].forEach(x=>{P(x-4,56,9,1);P(x-1,57,3,2);L(x-5,52,11,1)});P(60,58,1,12);P(57,70,6,1);P(52,80,17,1);L(55,82,11,1);
  const ch=v.cheveux;
  if(ch===0){for(let i=0;i<34;i++){const a=3.3+i*.08;P(60+Math.cos(a)*27,62+Math.sin(a)*35-1,2,4)}for(let i=0;i<46;i++)L(36+i,28+(noise(i,1,4)*12),1,6)}
  if(ch===1){for(let i=0;i<34;i++){const a=3.3+i*.08;P(60+Math.cos(a)*29,60+Math.sin(a)*37,2,5)}for(let j=0;j<46;j++){P(32-(j>>3),50+j,2,2);P(87+(j>>3),50+j,2,2);L(35-(j>>4),50+j,3,1);L(84+(j>>4),50+j,3,1)}}
  if(ch===2){L(35,46,3,12);L(83,46,3,12);rond(60,30,16,2,3.4,6.1)}
  if(ch===3){for(let a=3.1;a<6.4;a+=.34)rond(60+Math.cos(a)*27,58+Math.sin(a)*32,6,6)}
  if(v.lunettes===1)[48,72].forEach(x=>rond(x,57,10,9));
  if(v.lunettes===2)[38,62].forEach(x=>{P(x,48,21,1);P(x,65,21,1);P(x,48,1,18);P(x+20,48,1,18)});
  if(v.lunettes)P(58,54,5,1);
  if(v.poil===1){for(let i=0;i<24;i++)P(48+i,74+Math.abs(i-12)*.16,1,4)}
  if(v.poil===2){for(let a=.25;a<2.9;a+=.05)for(let r=0;r<7;r+=2)L(60+Math.cos(a)*(27-r),62+Math.sin(a)*(35-r),2,2);P(50,76,21,2)}
  if(v.chapeau===1){rond(60,30,29,18,3.14,6.3);P(31,30,58,2);for(let i=0;i<34;i++)P(86+i*.5,31+i*.06,1,3);for(let i=0;i<50;i++)L(34+i,16+(i%4)*3,1,10)}
  if(v.chapeau===2){P(22,30,76,2);L(22,32,76,2);for(let i=0;i<10;i++){P(36-i*.2,10+i*2,1,3);P(84+i*.2,10+i*2,1,3)}P(36,10,48,1);for(let i=0;i<44;i++)L(38+i,12+(i%3)*4,1,8);P(36,24,48,3)}
  return k.toDataURL();
}
const SALLES=[
 {id:'conf',salle:"Salle d'audience",nom:'Confrontation',pnj:{nom:'Edmond Vial',g:'m',role:'comptable'},but:"Contredire ses mensonges avec les pièces à conviction.",
  bonjour:"Je n'ai rien à cacher. La caisse de la société est vide, et alors ? Notez ma version, je la répéterai à qui voudra.",
  relance:"Vous avez encore des questions ? Mes déclarations sont dans votre dossier.",apres:"Vous avez ce que vous vouliez. Laissez-moi tranquille.",
  init:()=>({sel:null,ok:{},fautes:0}),
  PV:[{id:'badge',nom:'Relevé du badge',txt:"Sortie du bureau mardi à 23 h 12."},{id:'cle',nom:'Clé n° 7',txt:"Trouvée dans la veste d'Edmond."},{id:'banque',nom:'Lettre de la banque',txt:"Dernier rappel : 9 000 francs à payer."},{id:'chat',nom:'Photo de chat',txt:"Un très beau chat. Aucun rapport."}],
  DC:[{t:"Mardi soir, j'ai quitté le bureau à 18 h, comme toujours.",p:'badge',r:"Bon. J'ai pu rester un peu plus tard. Quelques dossiers à finir."},{t:"Je n'ai jamais eu la clé du coffre.",p:'cle',r:"Cette clé ? Je l'avais oubliée dans ma poche, voilà tout."},{t:"Je vis simplement, je n'ai aucune dette.",p:'banque',r:"D'accord, j'ai des dettes. Ce n'est pas un crime !"}],
  page(T){return`<h2>Confrontation</h2><p class="main">Choisis une pièce à conviction, puis la déclaration qu'elle contredit.</p><h3>Pièces à conviction</h3><div class="preuves">${this.PV.map(p=>`<button class="preuve ${T.sel===p.id?'sel':''}" data-a="t" data-v="p:${p.id}"><b>${hE(p.nom)}</b><span>${hE(p.txt)}</span></button>`).join('')}</div><h3>Ce qu'a déclaré Edmond</h3><ul class="decl">${this.DC.map((d,i)=>`<li class="${T.ok[i]?'barre':''}"><span>${hE(d.t)}</span>${T.ok[i]?'<b>Contredit</b>':`<button class="etiq" data-a="t" data-v="c:${i}" ${T.sel?'':'disabled'}>Contredire</button>`}</li>`).join('')}</ul>`},
  act(T,v,i){const[k,x]=v.split(':');
   if(k==='p'){T.sel=T.sel===x?null:x;return ouvrirTest('salle')}
   const d=this.DC[+x];
   if(T.sel!==d.p){T.fautes++;T.sel=null;return pnjDit(i,"Et alors ? Ça ne prouve rien du tout.",retour(),'colere')}
   T.ok[x]=1;T.sel=null;
   if(Object.keys(T.ok).length===this.DC.length)return finSalle(i,"Assez. Oui, j'ai pris l'argent de la caisse mardi soir. La banque allait tout saisir. Je voulais le rendre avant la fin du mois.");
   pnjDit(i,d.r,retour(),'inquiet')}},
 {id:'tact',salle:'Salon de thé',nom:'Confiance',pnj:{nom:'Odette Blanc',g:'f',role:'retraitée'},but:"Gagner sa confiance en choisissant le bon ton sur chaque sujet.",
  bonjour:"Bonjour, jeune homme. Je n'ai pas l'habitude de parler à la police, vous savez.",
  relance:"Oui ? Je vous écoute, mais doucement.",apres:"Je vous ai tout dit. Ne dites pas que ça vient de moi, surtout.",
  init:()=>({conf:30,fait:{},traits:[]}),
  SJ:[{q:'Son chat',t:{doux:[18,"Minou ? Il a quatorze ans et il dort sur mes genoux. Vous êtes bien aimable."],direct:[4,"Il va bien. Pourquoi ?"],dur:[-16,"Laissez mon chat tranquille !"]},n:"Elle adore qu'on lui parle de son chat."},
   {q:'Sa soirée',t:{doux:[8,"Je tricotais près de la fenêtre, comme chaque soir."],direct:[12,"J'étais à ma fenêtre. Je vois toute la rue d'ici."],dur:[-14,"Je n'ai pas à me justifier !"]},n:"Elle voit toute la rue depuis sa fenêtre."},
   {q:'Le voisin du dessus',t:{doux:[-4,"Oh, je ne veux pas dire de mal des gens..."],direct:[14,"Un bruyant. Il rentre tard, toujours avec des sacs."],dur:[-10,"Je ne suis pas une commère !"]},n:"Sur les voisins, elle préfère les questions franches."},
   {q:'Ce qui lui fait peur',t:{doux:[20,"Je vis seule, vous comprenez. Si je parle, il saura que c'est moi."],direct:[-6,"Peur, moi ? Allons donc."],dur:[-22,"Sortez d'ici !"]},n:"Elle a peur de représailles : il faut la rassurer."},
   {q:'La nuit du vol',t:{doux:[10,"J'ai vu quelque chose, oui. Mais je ne sais pas si je dois..."],direct:[6,"Il s'est passé quelque chose, c'est vrai."],dur:[-14,"Je n'ai rien vu ! Rien !"]},n:"Elle a vu quelque chose cette nuit-là."}],
  page(T){const c0=Math.max(0,T.conf);return`<h2>Fiche de caractère</h2><p class="main">Choisis ton ton sur chaque sujet. À 80, Odette se confie. À 0, elle se ferme.</p><div class="jauge" role="img" aria-label="Confiance : ${c0} sur 100"><i style="width:${Math.min(100,c0)}%"></i><u></u></div><p class="petitp">Confiance : ${c0} / 100</p><h3>Sujets</h3><ul class="decl">${this.SJ.map((s,i)=>`<li class="${T.fait[i]?'barre':''}"><span>${hE(s.q)}</span>${T.fait[i]?'<b>Abordé</b>':`<span class="tons"><button class="etiq" data-a="t" data-v="doux:${i}">Doux</button><button class="etiq" data-a="t" data-v="direct:${i}">Direct</button><button class="etiq" data-a="t" data-v="dur:${i}">Sévère</button></span>`}</li>`).join('')}</ul><h3>Ce que j'ai compris d'elle</h3>${T.traits.length?`<ul class="main">${T.traits.map(t=>`<li>${hE(t)}</li>`).join('')}</ul>`:`<p class="main">Rien pour l'instant.</p>`}${!T.fini&&(T.conf<=0||Object.keys(T.fait).length===this.SJ.length)?'<div class="ligne"><button class="etiq fort" data-a="t" data-v="excuse:0">Présenter mes excuses et recommencer</button></div>':''}`},
  act(T,v,i){const[k,x]=v.split(':');
   if(k==='excuse'){Object.assign(T,{conf:30,fait:{}});return pnjDit(i,"Bon. Je veux bien vous laisser une chance. Reprenons.",retour())}
   const s=this.SJ[+x],[d,r]=s.t[k];T.conf+=d;T.fait[x]=1;if(!T.traits.includes(s.n)&&d>0)T.traits.push(s.n);
   if(T.conf>=80)return finSalle(i,"Je vous fais confiance. C'était le voisin du dessus. À trois heures, il est sorti par la cour avec une mallette. Je l'ai vu comme je vous vois.");
   if(T.conf<=0)return pnjDit(i,"Je n'ai plus rien à vous dire. Bonne journée.",retour(),'colere');
   pnjDit(i,r,retour(),d<0?'colere':undefined)}},
 {id:'mots',salle:'Bibliothèque',nom:'Mots-clés',pnj:{nom:'Bruno Lenoir',g:'m',role:'libraire'},but:"Noter les mots importants et s'en servir pour le faire parler.",
  bonjour:"Je tenais la boutique, comme d'habitude. Un [client] est passé, puis je suis descendu à la [cave].",
  relance:"Vous revoilà. De quoi voulez-vous parler ?",apres:"L'Atlas est dans le coffre. Prenez-le, je ne veux plus le voir.",
  init:()=>({mots:[],dits:{}}),
  MT:{client:"Un homme avec un [parapluie] rouge. Il cherchait un [livre] rare.",cave:"Rien d'intéressant en bas. Des [cartons], et ce vieux [coffre].",parapluie:"Rouge vif. Je l'ai revu hier devant le [café].",livre:"L'Atlas des marées. Il vaut une [fortune]. On me l'a volé, je vous dis.",cartons:"De vieux invendus, rien de plus.","café":"Je n'y vais jamais, ce n'est pas mon quartier.",coffre:"Je ne l'ouvre jamais. La [clé] est perdue depuis des années.",fortune:"Assez pour rembourser toutes mes [dettes]. Enfin, je veux dire...","clé":"Perdue, je vous dis ! Pourquoi regardez-vous ma [poche] ?",dettes:"Qui vous a parlé de ça ? Ce sont mes affaires."},
  extrait:t=>[...t.matchAll(/\[([^\]]+)\]/g)].map(m=>m[1]),
  ditMots(T,i,t,e){const n=this.extrait(t).filter(m=>!T.mots.includes(m)),clair=t.replace(/[\[\]]/g,''),dit=l=>pnjDit(i,clair,[...l.map(m=>({t:`Noter « ${m} »`,cl:'fort',f:()=>{T.mots.push(m);dit(l.filter(q=>q!==m))}})),{t:'Retour au calepin',cl:'alt',f:()=>ouvrirTest('salle')}],e);dit(n)},
  page(T){const l=T.mots.filter(m=>m!=='poche');return`<h2>Mots-clés</h2><p class="main">Clique un mot noté pour le lancer à Bruno. Chaque réponse peut en contenir de nouveaux.</p><div class="mots">${l.map(m=>`<button class="mot ${T.dits[m]?'dit':''}" data-a="t" data-v="m:${m}">${hE(m)}</button>`).join('')}${T.mots.includes('poche')?'<button class="mot gros" data-a="t" data-v="m:poche">Votre poche, montrez-la</button>':''}</div><p class="petitp">${T.mots.length} mots notés, ${Object.keys(T.dits).length} utilisés.</p>`},
  act(T,v,i){const m=v.slice(2);T.dits[m]=1;
   if(m==='poche')return finSalle(i,"Bon. La voilà, la clé. L'Atlas n'a jamais été volé : il est dans le coffre. Je voulais le vendre en douce et toucher l'assurance.");
   this.ditMots(T,i,this.MT[m]||"Je ne vois pas de quoi vous parlez.",m==='fortune'||m==='clé'||m==='dettes'?'inquiet':undefined)}},
 {id:'poly',salle:'Laboratoire',nom:'Polygraphe',pnj:{nom:'Clara Dumont',g:'f',role:'chimiste'},but:"Lire les courbes du détecteur et repérer les réponses mensongères.",
  bonjour:"Branchez vos fils si ça vous amuse. Je n'ai rien à craindre de votre machine.",
  relance:"Posez vos questions, la machine tourne.",apres:"Vous avez vos courbes. J'ai dit ce que j'avais à dire.",
  init:()=>({rep:{},mq:{}}),
  QS:[{q:"Vous vous appelez bien Clara Dumont ?",r:"Oui.",m:0},{q:"Vous travaillez ici depuis cinq ans ?",r:"Oui, depuis cinq ans.",m:0},{q:"Étiez-vous au laboratoire mardi soir ?",r:"Non, j'étais chez moi.",m:1},{q:"Avez-vous vu le produit disparu ?",r:"Je l'ai vu lundi, pas depuis.",m:0,e:1},{q:"Connaissez-vous l'acheteur ?",r:"Je n'ai jamais entendu ce nom.",m:1},{q:"Aimez-vous votre métier ?",r:"Beaucoup.",m:0}],
  page(T){const n=this.QS.filter((_,i)=>T.rep[i]).length;return`<h2>Bande du polygraphe</h2><p class="main">Pose les questions, compare les courbes, puis coche Vrai ou Mensonge.</p><ol class="poly">${this.QS.map((q,i)=>`<li><span class="q">${hE(q.q)}</span>${T.rep[i]?`<em>« ${hE(q.r)} »</em><img class="onde ${T.der===i?'neuve':''}" alt="Courbe de la réponse ${i+1}" src="${G.url['on'+i]||(G.url['on'+i]=ondeImg(i,q.m,q.e))}"><span class="tons"><button class="etiq ${T.mq[i]==='v'?'actif':''}" data-a="t" data-v="m:${i}:v">Vrai</button><button class="etiq ${T.mq[i]==='f'?'actif':''}" data-a="t" data-v="m:${i}:f">Mensonge</button></span>`:`<button class="etiq" data-a="t" data-v="q:${i}">Poser la question</button>`}</li>`).join('')}</ol><div class="ligne"><button class="etiq fort" data-a="t" data-v="r:0" ${n===this.QS.length&&Object.keys(T.mq).length===n?'':'disabled'}>Rendre le rapport</button></div>`},
  act(T,v,i){const[k,x,y]=v.split(':');
   if(k==='q'){T.rep[x]=1;T.der=+x;return pnjDit(i,this.QS[+x].r,retour(),this.QS[+x].m?'inquiet':undefined)}
   if(k==='m'){T.mq[x]=y;T.der=null;return ouvrirTest('salle')}
   const e=this.QS.filter((q,j)=>(T.mq[j]==='f')!==!!q.m).length;
   if(e)return pnjDit(i,`Votre rapport ne tient pas, inspecteur. Il y a ${e} erreur${e>1?'s':''} là-dedans.`,retour());
   finSalle(i,"Vous lisez bien vos courbes. J'étais au laboratoire mardi soir, et oui, je connais l'acheteur. Je lui ai vendu le produit moi-même.")}},
 {id:'frise',salle:'Salle des archives',nom:'Frise',pnj:{nom:'Hector Roux',g:'m',role:'gardien de nuit'},but:"Remettre son récit dans l'ordre pour trouver le trou dans son emploi du temps.",
  bonjour:"Ma nuit ? Je vais vous la raconter comme ça me vient. Ne m'en veuillez pas si c'est dans le désordre.",
  relance:"Vous voulez la suite de ma nuit ?",apres:"Je dormais, je vous dis. Ne le répétez pas au directeur.",
  init:()=>({ordre:[],reste:[3,0,5,2,4,1]}),
  EV:["J'ai pris mon service à 20 h.","J'ai bu mon café au moment où l'horloge sonnait neuf coups.","Ma ronde du sous-sol commence une demi-heure après le café.","En remontant, à 22 h, j'ai vu de la lumière au deuxième.","J'ai noté l'incident au registre un quart d'heure après.","À 23 h, la relève est arrivée et je suis parti."],
  page(T){const n=T.ordre.length;return`<h2>Frise de la nuit</h2><p class="main">Écoute Hector, puis remets ses souvenirs dans le bon ordre avec les flèches.</p><ol class="recit">${T.ordre.map((e,i)=>`<li><span>${hE(this.EV[e])}</span><span class="fl"><button class="etiq" data-a="t" data-v="u:${i}" aria-label="Monter" ${i?'':'disabled'}>↑</button><button class="etiq" data-a="t" data-v="d:${i}" aria-label="Descendre" ${i<n-1?'':'disabled'}>↓</button></span></li>`).join('')}</ol><div class="ligne">${T.reste.length?'<button class="etiq" data-a="t" data-v="s:0">Écouter la suite</button>':`<button class="etiq fort" data-a="t" data-v="v:0">Vérifier l'ordre</button>`}</div>`},
  act(T,v,i){const[k,x]=v.split(':'),n=+x,o=T.ordre;
   if(k==='s'){const e=T.reste.shift();o.push(e);return pnjDit(i,this.EV[e],retour())}
   if(k==='u'||k==='d'){const j=k==='u'?n-1:n+1;[o[n],o[j]]=[o[j],o[n]];return ouvrirTest('salle')}
   if(o.every((e,j)=>e===j))return finSalle(i,"Le registre s'arrête à 22 h 15, et la relève arrive à 23 h. Bon, vous avez vu le trou. Je dormais dans le local. Je n'ai rien vu du tout au deuxième étage.");
   pnjDit(i,"Non, ce n'est pas dans cet ordre. Reprenez vos notes.",retour())}},
 {id:'robot',salle:'Atelier du dessinateur',nom:'Portrait-robot',pnj:{nom:'Lucie Faure',g:'f',role:'serveuse'},but:"Dessiner le suspect d'après ses souvenirs, trait par trait.",
  bonjour:"Je l'ai bien vu, ce type, il était assis au fond du café. Demandez-moi, je vais essayer de me souvenir.",
  relance:"Oui ? Qu'est-ce que vous voulez savoir sur lui ?",apres:"C'est lui, je le reconnaîtrais entre mille.",
  init:()=>({v:{cheveux:2,lunettes:0,poil:0,chapeau:0},dits:{}}),
  TR:[{k:'cheveux',q:'Ses cheveux',l:['Courts','Longs','Chauve','Bouclés'],bon:3,r:"Bouclés, j'en suis sûre. Ils dépassaient de tous les côtés."},{k:'lunettes',q:'Ses yeux',l:['Rien','Rondes','Carrées'],bon:1,r:"Il portait des lunettes. Petites et rondes, comme un vieux professeur."},{k:'poil',q:'Le bas du visage',l:['Rien','Moustache','Barbe'],bon:1,r:"Pas de barbe. Mais une moustache, ça oui."},{k:'chapeau',q:'Sur sa tête',l:['Rien','Casquette','Feutre'],bon:1,r:"Une casquette, il ne l'a jamais enlevée."}],
  page(T){return`<h2>Portrait-robot</h2><p class="main">Demande à Lucie, règle le dessin, puis montre-le-lui.</p><div class="robot"><img alt="Croquis du suspect" src="${croquis(T.v)}"><div class="traits">${this.TR.map((t,i)=>`<div><button class="etiq alt" data-a="t" data-v="q:${i}">${T.dits[i]?'✓ ':''}${hE(t.q)} ?</button><span class="tons">${t.l.map((n,j)=>`<button class="etiq ${T.v[t.k]===j?'actif':''}" data-a="t" data-v="s:${i}:${j}">${n}</button>`).join('')}</span></div>`).join('')}</div></div><div class="ligne"><button class="etiq fort" data-a="t" data-v="m:0">Montrer le dessin à Lucie</button></div>`},
  act(T,v,i){const[k,x,y]=v.split(':');
   if(k==='q'){T.dits[x]=1;return pnjDit(i,this.TR[+x].r,retour())}
   if(k==='s'){T.v[this.TR[+x].k]=+y;return ouvrirTest('salle')}
   const f=this.TR.find(t=>T.v[t.k]!==t.bon);
   if(f)return pnjDit(i,`Non, pas tout à fait. ${f.q} : ça ne va pas.`,retour());
   finSalle(i,"Oui ! C'est lui, c'est exactement lui ! Il a payé en billets neufs et il est parti vers la gare juste avant le vol.")}}
];
const retour=()=>[{t:'Retour au calepin',f:()=>ouvrirTest('salle')},{t:'À plus tard',cl:'alt',f:closeAll}];
const T_=i=>S.t[i]||(S.t[i]=SALLES[i].init());
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
    W.obj.push({id:9000+i,kind:'suspect',s:i,x:cell[0],y:cell[1],w:1,h:1,room:i,fx:cell[0]*TS+8,fy:cell[1]*TS+11,wait:1e9,dir:0,hold:1e12});
  });
  W.byId=Object.fromEntries(W.obj.map(o=>[o.id,o]));
  W.spawn={x:19,y:14};
}
function pnjDit(i,txt,suite,e){
  $('carnet').hidden=true;modal='dlg';
  const o=W.obj.find(q=>q.kind==='suspect'&&q.s===i),su=c.suspects[i];
  bulle({at:{x:o.fx,y:o.fy},nom:`${su.prenom}, ${su.role}`,txt,por:visage(i,e),btn:suite||[{t:'Ouvrir le calepin',f:()=>ouvrirTest('salle')},{t:'À plus tard',cl:'alt',f:closeAll}]});
}
function salleParle(i){
  const q=SALLES[i],T=T_(i);
  if(T.fini)return pnjDit(i,q.apres,[{t:'Voir le calepin',f:()=>ouvrirTest('salle')},{t:'À plus tard',cl:'alt',f:closeAll}]);
  if(!T.vu){
    T.vu=1;
    if(q.id==='mots')return q.ditMots(T,i,q.bonjour);
    return pnjDit(i,q.bonjour,[{t:'Commencer',f:()=>ouvrirTest('salle')}]);
  }
  pnjDit(i,q.relance);
}
function finSalle(i,txt){
  const T=T_(i);T.fini=1;son('bon');
  pnjDit(i,txt,[{t:'Voir le calepin',f:()=>ouvrirTest('salle')},{t:'Retour au couloir',cl:'alt',f:closeAll}],'inquiet');
}
function entreeTest(a){
  const q=SALLES[a],b=$('calepin');
  b.dataset.sys=q?q.id:'';b.classList.remove('frise');void b.offsetWidth;b.classList.add('frise');
  if(q)toast(`Calepin : ${q.nom}`,true);
}
function pSalles(){
  const faits=SALLES.filter((q,i)=>S.t[i]&&S.t[i].fini).length;
  return`<h2>Les six salles</h2><p class="main">Chaque porte cache une façon d'interroger. Entre dans une salle : ton calepin change pour s'y adapter. ${faits} sur 6 terminées.</p><ul class="salles">${SALLES.map((q,i)=>{const v=(stats.sys||{})[q.id];return`<li class="${S.t[i]&&S.t[i].fini?'fini':''}"><b>${hE(q.salle)}</b><span>${hE(q.nom)} : ${hE(q.but)}</span><em>${S.t[i]&&S.t[i].fini?'Terminée':'À faire'}${v?` · ${v==='oui'?'À garder':'Bof'}`:''}</em></li>`}).join('')}</ul>`;
}
function ouvrirTest(t){
  if(modal==='cut')return;
  const a=G.area!=null?G.area:6,i=a<6?a:null;
  if(!t||t==='calepin')t=i!==null?'salle':'couloir';
  if(t==='salle'&&i===null)t='couloir';
  const e=$('carnet'),ha=e.querySelector('.corps'),y=ha&&G.tab===t?ha.scrollTop:0;
  $('bulle').hidden=true;$('pz').hidden=true;$('doc').hidden=true;G.pzT=null;G.mini=null;
  G.tab=t;modal='carnet';son('page');e.hidden=false;
  const q=i!==null?SALLES[i]:null,T=q?T_(i):null,v=q&&(stats.sys||{})[q.id];
  const avis=T&&T.fini?`<div class="avis"><p class="main">Salle terminée. Ce système te plaît ?</p><div class="ligne"><button class="etiq ${v==='oui'?'actif':''}" data-a="vote" data-v="oui">À garder</button><button class="etiq ${v==='non'?'actif':''}" data-a="vote" data-v="non">Bof</button></div></div>`:'';
  const tabs=q?[['salle',q.nom,'#c8483e'],['couloir','Les salles','#6a6a78']]:[['couloir','Les salles','#6a6a78']];
  e.innerHTML=`<div class="livret" ${q?`data-sys="${q.id}"`:''}><div class="spirale" aria-hidden="true"></div><div class="feuille"><button class="croix" data-a="fermer" aria-label="Fermer le calepin">${croix}</button><div class="corps">${t==='salle'?q.page(T,i)+avis:pSalles()}</div></div><nav class="signets" role="tablist">${tabs.map(([k,n,col])=>`<button role="tab" aria-selected="${k===t}" data-a="onglet" data-v="${k}" style="--c:${col}">${n}</button>`).join('')}</nav></div>`;
  const co=e.querySelector('.corps');if(co)co.scrollTop=y;
  render();
}
function actionTest(v){
  const i=G.area;if(i==null||i>=6)return;
  SALLES[i].act(T_(i),v,i);
}

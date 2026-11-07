// Les 15 gabarits de documents : le papier est dessiné en pixels, le texte vient par-dessus.
// Toutes les personnes et institutions citées ici sont inventées pour le jeu.
function papierFond(g,w,h,col,s){
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const b=Math.min(x,y,w-1-x,h-1-y),n=noise(x>>1,y>>1,s),f=noise(x,y,s+1);
    R(g,tone(col,(n-.5)*.07-(b<4?(4-b)*.025:0)-(f>.985?.1:0)),x,y);
  }
}
function pli(g,w,y,col){R(g,tone(col,-.14),0,y,w,1);R(g,tone(col,.12),0,y+1,w,1)}
function tampon(g,cx,cy,r,col){for(let a=0;a<6.28;a+=.08){const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(noise(x|0,y|0,4)>.25){R(g,col,x|0,y|0);if(r>6)R(g,col,cx+Math.cos(a)*(r-2)|0,cy+Math.sin(a)*(r-2)|0)}}}
function cireR(g,cx,cy){ellipseP(g,cx,cy,9,9,'#8a1f28');ellipseP(g,cx-1,cy-1,7,7,'#b02f38');ellipseP(g,cx-2,cy-2,3,3,'#d8606a');R(g,'#8a1f28',cx-2,cy-1,5,1);R(g,'#8a1f28',cx,cy-3,1,5);R(g,'#a33a3a',cx-6,cy+8,4,10);R(g,'#a33a3a',cx+3,cy+8,4,10)}
function tacheCafe(g,cx,cy,r){for(let a=0;a<6.28;a+=.03){const q=r+Math.sin(a*5)*.8;R(g,'rgba(110,70,30,.28)',cx+Math.cos(a)*q|0,cy+Math.sin(a)*q|0);if(noise(a*9|0,1,3)>.4)R(g,'rgba(110,70,30,.16)',cx+Math.cos(a)*(q-1)|0,cy+Math.sin(a)*(q-1)|0)}}
function agrafe(g,x,y){R(g,'#8a939e',x,y,9,1);R(g,'#dfe4ea',x,y,9,0.5);R(g,'#5a636e',x,y+1,9,1);R(g,'#5a636e',x,y,1,2);R(g,'#5a636e',x+8,y,1,2)}
function trombone(g,x,y){[[0,0,1,17],[3,3,1,10],[0,0,6,1],[6,0,1,14],[3,13,3,1],[0,17,4,1]].forEach(([a,b,c,d])=>{R(g,'#a8b0ba',x+a,y+b,c,d)});R(g,'#e8ecf0',x,y,1,6)}
function cadre(g,w,h,m,col){R(g,col,m,m,w-m*2,1);R(g,col,m,h-m-1,w-m*2,1);R(g,col,m,m,1,h-m*2);R(g,col,w-m-1,m,1,h-m*2)}
const FORMATS={testament:[190,265,'#efe2bf'],dette:[190,235,'#f2e8cc'],renvoi:[190,265,'#f4eedd'],chantage:[190,200,'#b89a6c'],brevet:[205,275,'#dfe6e8'],article:[235,290,'#d8d2c0'],contrat:[195,285,'#f0e6cc'],
  agenda:[175,270,'#f8f2e0'],recu:[125,285,'#fbf8ef'],telegramme:[235,165,'#e8d8a0'],ordonnance:[175,245,'#fafaf4'],journal:[190,265,'#f4ecd8'],registre:[245,240,'#ece2c4'],autopsie:[205,305,'#e8dcb4'],carte:[235,150,'#efe4c8']};
function docFond(k){
  const[w,h,col]=FORMATS[k],[c,g]=cv(w,h),s=k.length*7;
  papierFond(g,w,h,col,s);
  if(['testament','contrat','renvoi','autopsie','brevet'].includes(k))[h/3|0,h*2/3|0].forEach(y=>pli(g,w,y,col));
  if(k==='testament'){[3,6].forEach(m=>cadre(g,w,h,m,'#8a6a2a'));[[10,10],[w-16,10],[10,h-16],[w-16,h-16]].forEach(([x,y])=>{R(g,'#8a6a2a',x,y,6,1);R(g,'#8a6a2a',x,y,1,6);R(g,'#8a6a2a',x+5,y,1,6);R(g,'#8a6a2a',x,y+5,6,1);R(g,'#8a6a2a',x+2,y+2,2,2)});cireR(g,w-32,h-40);tacheCafe(g,34,h-46,12)}
  if(k==='dette'){box(g,w-34,8,24,30,'#d84a6a');R(g,'#ffffff',w-30,12,16,22);R(g,'#d84a6a',w-27,16,10,3);R(g,'#d84a6a',w-25,22,6,6);for(let i=0;i<12;i++){R(g,col,w-35+i*2,7,1,1);R(g,col,w-35+i*2,38,1,1)}tampon(g,w-30,30,12,'#3a4a8a');pli(g,w,h>>1,col)}
  if(k==='renvoi'){R(g,'#2a3a6a',0,0,w,26);R(g,'#c8a040',0,26,w,2);ellipseP(g,18,13,8,8,'#c8a040');ellipseP(g,18,13,6,6,'#2a3a6a');R(g,'#c8a040',17,9,2,8);R(g,'#c8a040',14,12,8,2);R(g,'#2a3a6a',0,h-14,w,1);R(g,'#c8a040',0,h-12,w,1);agrafe(g,8,34)}
  if(k==='chantage'){[[8,6],[w-38,8],[10,h-16],[w-36,h-14]].forEach(([x,y])=>{R(g,'rgba(240,232,180,.55)',x,y,28,9);R(g,'rgba(255,255,255,.3)',x,y,28,1)});R(g,'#ece4d0',12,h-58,w-24,36);R(g,'#c8c0a8',12,h-22,w-24,1);R(g,'rgba(240,232,180,.6)',w/2-12,h-62,24,8)}
  if(k==='brevet'){R(g,'#2e4a78',0,0,w,6);R(g,'#2e4a78',0,h-6,w,6);cadre(g,w,h,9,'#2e4a78');for(let i=12;i<w-12;i+=4){R(g,'#7a94b8',i,11,2,1);R(g,'#7a94b8',i,h-12,2,1)}
   ellipseP(g,w-36,h-52,14,14,'#c8a040');ellipseP(g,w-36,h-52,11,11,'#e8c860');tampon(g,w-36,h-52,7,'#8a6a2a');R(g,'#2e4a78',w-44,h-41,5,16);R(g,'#2e4a78',w-32,h-41,5,16);
   const x=18,y=h-82;cadre(g,w,h,0,col);for(let j=0;j<62;j+=6)R(g,'#c8d4e0',x,y+j,104,1);for(let i=0;i<106;i+=6)R(g,'#c8d4e0',x+i,y,1,61);const ro=(a,b,r)=>{for(let t=0;t<6.28;t+=.03)R(g,'#2e4a78',a+Math.cos(t)*r|0,b+Math.sin(t)*r|0);for(let t=0;t<6.28;t+=.52){R(g,'#2e4a78',a+Math.cos(t)*(r+2)|0,b+Math.sin(t)*(r+2)|0,2,2)}R(g,'#2e4a78',a,b,2,2)};ro(x+34,y+30,17);ro(x+70,y+22,10);traitP(g,'#2e4a78',x+34,y+30,x+92,y+52);R(g,'#2e4a78',x+92,y+46,8,10)}
  if(k==='article'){[w*.68|0].forEach(x=>R(g,'#8a8478',x,70,1,h-82));for(let j=0;j<44;j++)for(let i=0;i<60;i++)if(bay(i,j)<.24+i/130+(j>30?.2:0))R(g,'#2a2a3a',(w*.68+7+i)|0,74+j);tacheCafe(g,w-30,h-30,14)}
  if(k==='contrat'){trombone(g,14,0);tampon(g,w-34,h-62,14,'#3a4a8a');tampon(g,w-34,h-62,9,'#3a4a8a');for(let x=0;x<w;x++){const d=((Math.sin(x*.4)+Math.sin(x*.13+2))*3+6)|0;g.clearRect(x,h-d,1,d)}}
  if(k==='agenda'){R(g,'#a33a3a',0,0,w,22);R(g,'#7a2228',0,22,w,2);for(let y=34;y<h-6;y+=15)R(g,'#a8b4c8',14,y,w-20,1);R(g,'#d8a0a0',46,24,1,h-30);for(let y=14;y<h;y+=30)ellipseP(g,7,y,2,2,'#2a2a3a');tacheCafe(g,w-30,h-28,10)}
  if(k==='recu'){for(let x=0;x<w;x++){const d=x%6<3?x%6:6-x%6;g.clearRect(x,0,1,d);g.clearRect(x,h-d,1,d)}for(let j=0;j<16;j++)for(let i=0;i<w-30;i++)if((i*7>>2)%3)R(g,'#2a2a3a',15+i,h-34+j);pli(g,w,h*.6|0,col)}
  if(k==='telegramme'){R(g,'#2e4a78',0,0,w,22);R(g,'#c8a040',0,22,w,2);cadre(g,w,h,3,'#2e4a78');[[12,74],[12,96],[12,118]].forEach(([x,y])=>{R(g,'#f8f0d0',x,y,w-24,17);R(g,'#d8c890',x,y+17,w-24,1)});for(let i=0;i<4;i++)R(g,'#8a7a5a',w*(i+1)/5|0,28,1,34);R(g,'#8a7a5a',8,62,w-16,1);tampon(g,w-30,h-16,13,'#a33a3a')}
  if(k==='ordonnance'){R(g,'#2e7a5a',16,12,6,20);R(g,'#2e7a5a',9,19,20,6);R(g,'#2e7a5a',8,40,w-16,1);R(g,'#2e7a5a',8,42,w-16,1);R(g,'#2e7a5a',8,h-24,w-16,1);tampon(g,w-30,h-46,12,'#2e7a5a')}
  if(k==='journal'){R(g,'#d8483e',24,0,1,h);for(let y=20;y<h;y+=12)R(g,'#a8b8d0',4,y,w-8,1);ellipseP(g,w-22,h-20,5,4,'#2a3a6a');R(g,'#2a3a6a',w-30,h-14,3,3);R(g,'#2a3a6a',w-14,h-26,2,2);R(g,'#5b3820',0,0,4,h);R(g,'#7a5230',4,0,1,h);tacheCafe(g,w-38,30,11)}
  if(k==='registre'){R(g,'#7a2230',0,0,w,22);R(g,'#c8a040',0,22,w,1);R(g,'#2e4a78',0,26,w,1);for(let y=44;y<h-6;y+=14)R(g,'#8a7a5a',8,y,w-16,1);R(g,'#a33a3a',8,40,w-16,1);[32,116,188].forEach(x=>R(g,'#a33a3a',x,26,1,h-34));cadre(g,w,h,1,'#8a7a5a')}
  if(k==='autopsie'){R(g,'#c8b888',0,0,74,10);R(g,'#2a3a6a',8,10,w-16,2);trombone(g,w-26,0);
   const x=w-34,y=h-66,o='#a8a090',p=(a,b,c,d)=>R(g,o,x+a,y+b,c,d);ellipseP(g,x+12,y+6,5,5,o);ellipseP(g,x+12,y+6,3,3,col);p(10,11,4,2);p(6,13,12,3);p(7,16,10,16);p(3,14,3,3);p(18,14,3,3);p(2,17,3,17);p(19,17,3,17);p(7,32,4,24);p(13,32,4,24);p(6,55,5,2);p(13,55,5,2)}
  if(k==='carte'){R(g,'#8a7a5a',w/2,10,1,h-20);box(g,w-36,8,26,32,'#2e6a8c');R(g,'#ffffff',w-32,12,18,24);R(g,'#d84a6a',w-27,18,8,12);tampon(g,w-50,28,12,'#3a3a4a');tampon(g,w-50,28,8,'#3a3a4a');for(let i=0;i<4;i++)traitP(g,'#3a3a4a',w-40+i*5,18,w-34+i*5,24);for(let y=66;y<h-14;y+=15)R(g,'#8a8478',w/2+10,y,w/2-22,1)}
  return c.toDataURL();
}
const m_=s=>`<mark>${esch(s)}</mark>`;
const hashS=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const alea=p=>{const r=RNG(hashS(JSON.stringify(p)));return{n:(a,b)=>a+int(r,b-a+1),c:l=>pick(r,l)}};
const LEGISTES=['Dr Élise Fontanel','Dr Armand Keller','Dr Noémie Vasseur','Dr Théodore Lacaze','Dr Agathe Rivoire','Dr Julien Desmarais'];
const ASSISTANTS=['A. Morelle','L. Tissandier','C. Bonnafous','P. Guérard'];
const MEDECINS=['Dr Marthe Aubert','Dr Louis Sorbier','Dr Claire Maurin','Dr Émile Rochat'];
const NOTAIRES=['Me Hortense Valmont','Me Gaspard Lorrain','Me Irène Castagné','Me Fabien Solignac'];
const VILLES=['Vauclair','Saint-Aubrin','Montfleurie','Rochemarne','Port-Aurélie','Clairmarais'];
const INVENTIONS=['Régulateur de pression à soupape double','Serrure à combinaison silencieuse','Moteur à rendement amélioré','Alliage léger pour pièces de précision','Procédé de conservation par le froid','Mécanisme de levage à contrepoids'];
const JOURS2=['2 janvier','18 février','9 mars','27 avril','14 mai','5 juin','21 août','30 octobre'];
function detailAutopsie(c){
  const r=RNG((c.seed*7+13)>>>0),n=(a,b)=>a+int(r,b-a+1),T={
   lourd:{les:"Plaie contuse du cuir chevelu, région pariétale gauche, avec enfoncement de la boîte crânienne sur 4 cm. Hématome sous-dural étendu.",int:"Coup unique porté de haut en bas, avec une violence certaine.",obj:"objet lourd et dur"},
   lame:{les:"Plaie thoracique unique de 3 cm sous le mamelon gauche, profonde de 9 cm. Péricarde et ventricule gauche transpercés.",int:"Coup porté de face, à courte distance, sans trace de lutte.",obj:"lame étroite à un seul tranchant"},
   lien:{les:"Sillon horizontal continu autour du cou, pétéchies conjonctivales, fracture de la corne droite de l'os hyoïde.",int:"Strangulation exercée par-derrière. Aucune défense notable.",obj:"lien souple et résistant"}}[c.cls];
  const f=c.vg==='f';
  return{dos:`IML-${n(1000,9899)}`,req:n(1000,4999),med:pick(r,LEGISTES),asst:pick(r,ASSISTANTS),jour:pick(r,JOURS),ht:`${n(7,9)} h ${n(10,55)}`,age:n(42,71),taille:`${f?1:1},${f?n(58,72):n(68,86)} m`,poids:`${f?n(54,72):n(68,94)} kg`,
   piece:c.set.rooms[c.rc].n,lieu:c.set.nom,rect:`${n(29,32)},${n(1,9)} °C`,les:T.les,int:T.int,obj:T.obj,alc:`0,${n(2,9)} g/l`,ville:pick(r,VILLES),casier:n(2,14),ongle:n(0,1)?'Aucun tissu étranger sous les ongles.':'Rien d\'exploitable sous les ongles.',f};
}
const DOC_HTML={
 testament:p=>{const a=alea(p),not=a.c(NOTAIRES),vil=a.c(VILLES);return`<div class="d" data-k="testament"><p class="ent">Déposé en l'étude de ${not}, notaire à ${vil} · Minute n° ${a.n(1200,8900)}</p><h4>Testament olographe</h4>
  <div class="ecrit"><p>Ceci est mon testament, écrit en entier, daté et signé de ma main.</p><p>Je soussigné <b>${esch(p.v)}</b>, sain de corps et d'esprit, révoque toute disposition antérieure et déclare léguer :</p>
  <ol><li>à ${m_(p.n)}, ${m_(`l'essentiel de mes biens et ma part de ${p.lieu}`)} ;</li><li>à la bibliothèque de ${vil}, mes livres et mes archives ;</li><li>à chacun de ceux qui m'ont servi, un mois de gages.</li></ol>
  <p>Je désigne ${not} comme exécuteur de mes dernières volontés et demande que ces lignes soient lues devant tous.</p><p>Fait de ma main, le ${p.date}.</p></div><p class="signe">${esch(p.v)}</p>
  <p class="pied">Enregistré à ${vil}, folio ${a.n(10,98)}, case ${a.n(1,24)}. Reçu ${a.n(40,180)} francs.</p></div>`},
 dette:p=>{const a=alea(p),t=a.n(4,9),s=p.m.toLocaleString('fr-FR');return`<div class="d" data-k="dette"><h4>Reconnaissance de dette</h4><p class="petit">Acte sous seing privé n° ${a.n(100,999)}</p>
  <div class="ligne2"><p><i>Prêteur :</i> <b>${esch(p.v)}</b></p><p><i>Emprunteur :</i> ${m_(p.n)}</p></div>
  <p>L'emprunteur reconnaît avoir reçu ce jour, à titre de prêt, la somme de :</p><p class="fort">${m_(s+' francs')}</p>
  <p>Intérêt convenu : ${t} % l'an. Remboursement en une seule fois, ${m_('avant la fin du mois')}. Passé ce délai, le prêteur pourra exiger la vente des biens de l'emprunteur.</p>
  <table class="reg"><tr><th>Échéance</th><th>Versé</th><th>Reste dû</th></tr><tr><td>${a.c(JOURS2)}</td><td>0 F</td><td>${s} F</td></tr><tr><td>${a.c(JOURS2)}</td><td>0 F</td><td>${s} F</td></tr></table>
  <p>Fait en deux exemplaires, le ${p.date}. Bon pour ${s} francs.</p><p class="signe">${esch(p.n)}</p><p class="marge">Toujours rien reçu. Dernier rappel !</p></div>`},
 renvoi:p=>{const a=alea(p);return`<div class="d" data-k="renvoi"><p class="ent cl">${esch(p.lieu)}</p><p class="ent cl2">Direction · Service du personnel</p>
  <div class="ligne2 hautr"><p>Réf. : DP/${a.n(100,999)}/${a.c(['AL','RH','MD'])}<br>Lettre recommandée</p><p>Le ${p.date}<br>À l'attention de ${m_(p.n)}</p></div>
  <h4>Objet : fin de service</h4><p>Suite à notre entretien, j'ai le regret de vous faire savoir que ${m_('vos services ne sont plus requis')}.</p>
  <p>Les faits constatés le ${a.c(JOURS2)}, déjà signalés dans deux avertissements, ne me laissent pas d'autre choix.</p>
  <p>Vous quitterez les lieux ${m_('sous huit jours, sans indemnité')}, après avoir rendu vos clés et votre carte de service.</p>
  <table class="reg"><tr><td>Solde de tout compte</td><td>0 F</td></tr><tr><td>Congés restants</td><td>${a.n(2,9)} jours, perdus</td></tr></table>
  <p>Veuillez agréer mes salutations.</p><p class="signe">${esch(p.v)}</p><p class="pied">Copie au dossier du personnel. Toute réclamation par écrit à la direction.</p></div>`},
 chantage:p=>{const a=alea(p),s=p.m.toLocaleString('fr-FR');return`<div class="d" data-k="chantage"><p class="colle">${`JE SAIS CE QUE VOUS AVEZ FAIT À LYON. ${s} FRANCS AVANT DIMANCHE. SINON TOUT LE MONDE SAURA. VOUS PAIEREZ, ${p.n.toUpperCase()}.`.split(' ').map((w,i)=>`<span class="m${i%4}">${esch(w)}</span>`).join(' ')}</p>
  <div class="fiche-c"><b>Note de Basile</b><p>Lettres découpées dans un journal. Glissé sous une porte, sans enveloppe ni timbre. Destinataire : ${m_(p.n)}. Au dos, ${m_(`l'écriture de ${p.v}`)}.</p></div></div>`},
 brevet:p=>{const a=alea(p),t=a.c(INVENTIONS);return`<div class="d" data-k="brevet"><p class="ent">Office des inventions de ${a.c(VILLES)}</p><h4>Brevet d'invention</h4><p class="petit c">N° ${p.m} · Délivré le ${p.date} · Durée : 15 ans</p>
  <p><i>Titre :</i> <b>${t}</b></p><p><i>Titulaire :</i> ${m_(p.v)}</p><p><i>Demande déposée le :</i> ${a.c(JOURS2)}, sous le n° ${a.n(10000,99999)}</p>
  <ol><li>Dispositif caractérisé par un assemblage nouveau de ses organes.</li><li>Dispositif selon 1, d'un rendement supérieur à tout procédé connu.</li></ol><p class="petit">Planche 1 : coupe de l'appareil, échelle 1/4.</p>
  <p class="marge haute">C'était MON idée !<br>${m_(p.n)}</p></div>`},
 article:p=>{const a=alea(p);return`<div class="d" data-k="article"><p class="titre-j">L'Écho du soir</p><p class="sous-j"><span>N° ${a.n(1200,9800)}</span><span>${p.date}</span><span>20 centimes</span></p>
  <h4>Une affaire qui fait du bruit</h4><div class="cols"><div><p>Selon nos informations, ${m_(p.v)} serait au cœur des malheurs de ${m_(p.n)}, qui ne s'en est jamais remis.</p><p>Plusieurs proches évoquent des promesses non tenues et une ruine annoncée. « Il a tout perdu, et il le sait très bien », confie un témoin qui tient à rester anonyme.</p><p>Interrogée le ${p.date}, aucune des deux parties n'a souhaité s'exprimer. La justice n'a pas été saisie à ce jour.</p><p class="t2">Le pont de ${a.c(VILLES)} emporté par les eaux</p><p>Les pluies de la semaine ont eu raison du vieil ouvrage. La route restera coupée plusieurs jours, a fait savoir la mairie, et les livraisons sont détournées par la vallée.</p><p class="t2">Conseil municipal</p><p>Les élus ont voté hier soir la réfection du marché couvert. Les travaux débuteront au printemps si le budget est tenu, ce dont l'opposition doute ouvertement.</p></div>
  <div class="cote"><div class="ph"></div><p class="petit">Les lieux, le mois dernier.</p><b>Météo</b><p class="petit">Orages en soirée, ${a.n(8,24)} degrés.</p><b>En bref</b><p class="petit">La foire de ${a.c(VILLES)} est reportée à la semaine prochaine.</p><b>Annonce</b><p class="petit">Vends piano droit, bon état. S'adresser au journal.</p></div></div></div>`},
 contrat:p=>{const a=alea(p),vil=a.c(VILLES);return`<div class="d" data-k="contrat"><h4>Contrat d'association</h4><p class="petit c">Passé devant ${a.c(NOTAIRES)}, notaire à ${vil}</p><p>Entre <s>${esch(p.n)}</s> et <b>${esch(p.v)}</b>, il a été convenu ce qui suit :</p>
  <ol class="art"><li><b>Objet.</b> Les soussignés exploitent en commun une affaire de négoce.</li><li><b>Parts.</b> ${a.n(40,60)} parts pour l'un, le reste pour l'autre.</li><li><b>Gérance.</b> ${m_(`${p.v}, seul gérant de l'affaire`)}, à compter du ${p.date}.</li><li><b>Bénéfices.</b> Partagés chaque année au prorata des parts.</li><li><b>Sortie.</b> Un associé rayé perd tout droit sur les bénéfices à venir.</li></ol>
  <p>Fait à ${vil} en deux originaux.</p><p class="marge">Le nom de ${m_(p.n)} a été rayé à la main.</p><p class="signe g">${esch(p.v)}</p></div>`},
 agenda:p=>{const a=alea(p),e={8:'Café, courrier',10:a.c(['Banque','Coiffeur','Téléphoner à maman']),12:'Déjeuner',15:a.c(['Rendez-vous annulé','Écrire à Paul','Payer la note'])},hh=[8,9,10,11,12,13,14,15,16,17,18,19];return`<div class="d" data-k="agenda"><p class="ent cl">${p.date}</p><p class="petit">Agenda de ${esch(p.n)}</p>
  <table class="heures">${hh.map(h=>`<tr><td>${h} h</td><td>${e[h]||''}</td></tr>`).join('')}<tr><td>${m_(p.h)}</td><td>${m_(p.room)}${p.noms.length?`, avec ${m_(p.noms.join(', '))}`:''}.</td></tr></table><p class="main bas">Ne pas oublier de tout noter.</p></div>`},
 recu:p=>{const a=alea(p),b=Math.max(2,Math.floor(p.m*.4)),c2=p.m-b;return`<div class="d" data-k="recu"><p class="ent">${esch(p.lieu)}</p><p class="petit c">Service en chambre et au salon</p><p>Note n° ${p.no}</p><p>Serveur : ${a.c(['Jules','Lucie','Marcel','Odile'])}</p><p class="tir">----------------------</p><p>Heure : ${m_(p.h)}</p><p>Lieu : ${m_(p.room)}</p><p>Client : ${m_(p.n)}</p><p class="tir">----------------------</p>
  <p class="l">${a.c(['Tisane','Café','Infusion'])}<span>${b} F</span></p><p class="l">${a.c(['Biscuits','Sandwich','Plateau'])}<span>${c2} F</span></p><p class="tir">----------------------</p><p class="l"><b>TOTAL</b><b>${p.m} F</b></p><p class="ent">Merci de votre visite</p></div>`},
 telegramme:p=>{const a=alea(p);return`<div class="d" data-k="telegramme"><p class="ent cl">Télégramme</p><div class="cases"><p><i>Origine</i>${a.c(VILLES)}</p><p><i>Numéro</i>${a.n(100,999)}</p><p><i>Mots</i>${p.txt.split(' ').length}</p><p><i>Date</i>${p.date}</p><p><i>Heure</i>${a.n(7,19)} h ${a.n(10,55)}</p></div><p>Pour : ${m_(p.v.toUpperCase())}, ${esch('remis en mains propres')}</p>
  <p class="bande">${esch(p.txt)}</p></div>`},
 ordonnance:p=>{const a=alea(p),d=a.c(MEDECINS),v=a.c(VILLES);return`<div class="d" data-k="ordonnance"><p class="ent dr">${d}<br><small>Médecine générale, ancien interne des hôpitaux</small><br><small>12, rue des Tilleuls, ${v}</small></p><div class="ligne2 ordo"><p>N° ${p.no}</p><p>Le ${p.date}</p></div><p>Pour : ${m_(p.n)}, ${a.n(29,64)} ans</p><div class="ecrit"><p>${esch(p.med)}</p><p>Pendant ${a.n(7,21)} jours.</p><p>Repos, pas d'alcool.</p></div><p class="petit">À renouveler ${a.n(1,3)} fois. Consultations de 9 h à 12 h.</p><p class="signe">${d}</p></div>`},
 journal:p=>{const a=alea(p);return`<div class="d" data-k="journal"><p class="petit">${p.date}, journal de ${esch(p.v)}</p><div class="ecrit l"><p>${a.c(['Encore une journée à supporter tout ce petit monde.','Mal dormi. Le temps tourne à l\'orage.','Les visages sont fermés ce soir, je n\'aime pas ça.'])}</p><p>${a.c(['Je note tout, depuis que l\'on me ment.','On me prend pour un sot, on verra bien.','Certains ici croient que je ne vois rien.'])} Ce carnet ne quitte jamais ma poche.</p><p>${m_(p.txt)}</p><p>${a.c(['Demain, je mettrai les choses au clair.','Il faudra que j\'en parle au notaire.','Je dois vérifier mes comptes avant la fin de la semaine.'])}</p></div></div>`},
 registre:p=>{const a=alea(p);return`<div class="d" data-k="registre"><p class="ent cl">Registre des clés · Soirée du crime</p><table class="led"><tr><th>N°</th><th>Pièce</th><th>État de la porte</th><th>Visa</th></tr>${p.lignes.map((l,i)=>`<tr><td>${a.n(10,99)}</td><td>${esch(l[0])}</td><td>${l[1].includes('verrou')?m_(l[1]):esch(l[1])}</td><td class="h">${a.c(['J.M.','L.D.','O.P.','M.R.'])}</td></tr>`).join('')}</table><p class="pied">Registre tenu par le gardien. Toute clé sortie doit être notée.</p></div>`},
 autopsie:p=>{const a=p.a;return`<div class="d" data-k="autopsie"><div class="ligne2 ent2"><p><b>Institut médico-légal de ${a.ville}</b><br>Service de thanatologie, salle ${a.casier>7?2:1}</p><p>Dossier n° <b>${a.dos}</b><br>Réquisition n° ${a.req}<br>Casier ${a.casier}</p></div><h4>Rapport d'autopsie</h4>
  <div class="ligne2"><p><i>Médecin légiste :</i> <b>${a.med}</b></p><p><i>Assisté de :</i> ${a.asst}</p><p><i>Requis par :</i> Police judiciaire</p><p><i>Examen :</i> le ${a.jour}, ${a.ht}</p></div>
  <h5>I. Identité du défunt</h5><div class="ligne2"><p><i>Nom :</i> <b>${esch(p.v)}</b></p><p><i>Âge :</i> ${a.age} ans</p><p><i>Taille :</i> ${a.taille}</p><p><i>Poids :</i> ${a.poids}</p></div><p><i>Découvert :</i> ${esch(a.piece)}, ${esch(a.lieu)}, à minuit.</p>
  <h5>II. Examen du corps</h5><p><i>Température rectale :</i> ${a.rect} à l'arrivée. <i>Rigidité :</i> installée à la nuque et aux mâchoires. <i>Lividités :</i> postérieures, encore mobiles.</p><p><i>Lésions :</i> ${a.les} ${a.ongle}</p>
  <h5>III. Analyses</h5><p><i>Alcoolémie :</i> ${a.alc}. <i>Toxiques :</i> recherche négative. <i>Estomac :</i> repas pris environ trois heures avant la mort.</p>
  <h5>IV. Conclusions</h5><p><i>Cause du décès :</i> ${m_(p.cause)}. Instrument : ${a.obj}. ${a.int}</p><p><i>Heure de la mort :</i> ${m_(p.h)}.</p><p>La mort est criminelle. Le corps est tenu à la disposition de la justice.</p>
  <p class="signe">${a.med}</p><div class="tampon-p"><b>POLICE<br>JUDICIAIRE</b><small>Reçu et enregistré</small><small>Brigade criminelle</small></div></div>`},
 carte:p=>{const a=alea(p);return`<div class="d" data-k="carte"><p class="main dem">${esch(p.txt)}<br><br>${a.c(['À bientôt.','Tu sais qui je suis.','Bien à toi.'])}</p><p class="dest">${esch(p.v)}<br>${esch(p.lieu)}<br>${a.c(VILLES)}</p><p class="obl">${a.c(VILLES)} · ${a.n(6,22)} h · ${a.c(JOURS2)}</p></div>`}
};

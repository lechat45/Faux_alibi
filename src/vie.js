// Immersion et rejouabilité : suspects plus réalistes, dialogues qui évoluent, traces à relever,
// enquête du jour et fins alternatives.
const BIOS=[["Collectionne les timbres anciens.","Je collectionne les timbres anciens. Ça calme les nerfs."],["Ne dort presque plus depuis des mois.","Je ne dors presque plus depuis des mois."],["Note tout dans un petit carnet noir.","Je note tout dans un carnet. On ne sait jamais."],["Joue aux cartes pour de l'argent.","Je joue un peu aux cartes. Parfois trop."],["A perdu beaucoup d'argent l'an dernier.","L'an dernier, j'ai perdu beaucoup d'argent. Je n'aime pas en parler."],["Rêve de tout quitter pour la mer.","Un jour je quitterai tout, pour vivre près de la mer."],["Écrit des lettres jamais envoyées.","J'écris des lettres que je n'envoie jamais."],["Cache une vieille cicatrice sous sa manche.","Cette cicatrice ? Une vieille histoire."],["Boit son café sans sucre, même la nuit.","Du café noir, jour et nuit. C'est ma seule drogue."],["A quitté sa famille à seize ans.","J'ai quitté les miens à seize ans, sans me retourner."],["Parle trois langues et se méfie de tout le monde.","Je parle trois langues, et je me méfie dans les trois."],["Ne sort jamais sans son parapluie.","Je ne sors jamais sans parapluie. Il pleut toujours, ici."],["Se ronge les ongles quand on lui parle.","Pardon, je me ronge les ongles quand je suis nerveux. Une vieille habitude."],["Porte toujours la même bague, sans jamais dire pourquoi.","Cette bague ? Elle reste à mon doigt, c'est tout ce que vous saurez."]];
function habiller(c0){
  const r=RNG((c0.seed*11+5)>>>0),b=shuffle(r,BIOS);
  c0.suspects.forEach((su,i)=>{su.age=24+int(r,46);su.bio=b[i%b.length][0];su.bioJe=b[i%b.length][1].replace('nerveux',su.g==='f'?'nerveuse':'nerveux')});
  c0.rels=range(c0.n).map(()=>Array(c0.n).fill(3));
  for(let a=0;a<c0.n;a++)for(let d=a+1;d<c0.n;d++)c0.rels[a][d]=c0.rels[d][a]=int(r,4);
}
const AVIS=[t=>`${t} ? On se connaît depuis longtemps. Je lui fais confiance.`,t=>`${t} ? Je ne lui tournerais pas le dos, si vous voulez mon avis.`,t=>`${t} ? Nous ne nous parlons plus, et ça me va très bien.`,t=>`${t} ? Je connais à peine. Bonjour, bonsoir.`];
const tendu=(s,n)=>{S.stress=S.stress||{};S.stress[s]=Math.min(100,(S.stress[s]||0)+n)};
const stressDe=s=>(S.stress&&S.stress[s])||0;
function salut(s){
  const v=(S.vues&&S.vues[s])||0,st=stressDe(s),h=VOIX(s).hi;
  if(st>=70)return['Encore vous ? Je vous ai tout dit !','Laissez-moi respirer, je vous en prie.'][v%2];
  if(v>=3)return['Vous revoilà, inspecteur.','Vous ne me lâchez pas, vous.','Toujours là ?'][v%3];
  return h[(tick>>6)%h.length];
}
// Celui qui ment se trahit parfois à l'heure du crime, et le difficile le cache mieux
function regardFuyant(s,h){
  const p=reglage().vit>1.2?.45:reglage().vit>1?.72:1;
  if(c.tueurs.includes(s)&&c.win.includes(h))return noise(s,h,c.seed&255)<p;
  return noise(s,h+9,c.seed&255)>.86;
}
function sujets(o){
  const s=o.s,su=c.suspects[s];modal='dlg';
  const l=[{t:`Et ${c.vName} ?`,f:()=>{if(!S.rel[s]){S.rel[s]=1;S.conf[s]=(S.conf[s]||0)+1;return talk(o,VOIX(s).rel)}talk(o,"Je vous l'ai déjà dit. Je n'ai rien à ajouter.")}},{t:'Parlez-moi de vous',f:()=>talk(o,su.bioJe)}];
  c.suspects.forEach((q,t)=>{if(t!==s)l.push({t:`Et ${q.prenom} ?`,cl:'alt',f:()=>avis(o,t)})});
  l.push({t:'Revenir',cl:'alt',f:()=>talk(o,'Autre chose ?')});
  bulle({at:{x:o.fx,y:o.fy},nom:`${su.prenom}, ${su.role}`,txt:'De quoi voulez-vous parler ?',por:visage(s),btn:l});
}
function avis(o,t){
  const s=o.s,k=s+'-'+t;S.sujets=S.sujets||{};const n=S.sujets[k]=(S.sujets[k]||0)+1;
  if(n===2)return talk(o,"Je vous l'ai déjà dit. Vous ne m'écoutez pas ?");
  if(n>2){tendu(s,12);return talk(o,'Vous tournez en rond, inspecteur.',false,'colere')}
  talk(o,AVIS[c.rels[s][t]](c.suspects[t].prenom));
}
const conflitsDe=s=>(S.liens||[]).filter(l=>l.c&&l.p&&l.p.includes(s));
function confronter(o){
  const s=o.s,l=conflitsDe(s)[0],t=l.p.find(q=>q!==s),V=VOIX(s),ment=c.tueurs.includes(s);
  tendu(s,ment?28:10);
  if(t===undefined||Number.isNaN(t))return talk(o,"Ce registre dit ce qu'il veut. Moi, je sais où j'étais.",false,ment?'inquiet':undefined);
  const a=c.suspects[t].prenom;
  if(ment)return talk(o,`${a} dit ça ? Je... j'ai pu me tromper d'heure. Il est tard, vous savez.`,false,'inquiet');
  talk(o,`Alors c'est ${a} qui ment. Moi, je sais où j'étais.`,false,V.nom==='nerveux'?'inquiet':'colere');
}
// Certains suspects changent de pièce au fil de la soirée
function trajet(o,R){
  if(c.test)return false;
  if(o.path){if(avance(o,.62*R.npc)){const a=areaIdx(o.x,o.y);if(a>=0&&a<W.rooms.length)o.room=a;o.prochain=null}return true}
  if(o.prochain==null)o.prochain=tick+(1100+Math.random()*1800)*(.5+R.att*.7);
  if(tick<o.prochain)return false;
  o.prochain=null;
  const i=int(Math.random,W.rooms.length),A=W.rooms[i];if(i===o.room)return false;
  const x=A.x0+int(Math.random,A.x1-A.x0+1),y=A.y0+1+int(Math.random,A.y1-A.y0);
  if(solidCell(W,x,y,S.open))return false;
  const p=cheminCut({x:o.fx,y:o.fy},x*TS+8,y*TS+11,{},S.open);
  if(!p||p[p.length-1][0]!==x*TS+8)return false;
  o.path=p;o.pi=0;o.tx=undefined;return true;
}
// ——— Fouilles : des traces au sol et des objets qui prouvent un passage ———
function couleurNom(h){
  const[r,g,b]=hex6(h),mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
  if(mx<70)return'noir';if(d<28)return mx>190?'blanc':'gris';
  let a=mx===r?((g-b)/d+6)%6:mx===g?(b-r)/d+2:(r-g)/d+4;a*=60;
  if(a<18||a>=338)return mx<130?'bordeaux':'rouge';if(a<45)return mx<140?'brun':'orange';if(a<70)return'jaune';if(a<170)return'vert';if(a<255)return'bleu';if(a<300)return'violet';return'rose';
}
function poseIndices(){
  if(c.test)return;
  const r=RNG((c.seed*5+3)>>>0),k=c.suspects[c.k],L=lookOf(k,c.k,c.seed),cases=shuffle(r,freeNear(G.body.x,G.body.y,40).slice(3)).slice(0,3);
  const par={lourd:['Un éclat brillant',"Un éclat de métal, tombé de l'arme."],lame:['Une goutte de sang','Une goutte de sang, loin du corps. Le tueur a bougé.'],lien:['Une fibre','Une fibre rêche, arrachée à un lien.'],poison:['Une odeur amère',"Une flaque séchée, à l'odeur amère."]}[c.cls];
  const tr=[['Un fil de vêtement',`Un fil ${couleurNom(L.top)} accroché ici. Il vient d'un vêtement.`],['Une empreinte',`Une empreinte ${k.g==='f'?'de petit talon':'de grosse semelle'}, encore fraîche.`],par];
  cases.forEach((q,i)=>W.obj.push({id:8000+i,kind:'trace',x:q[0],y:q[1],w:1,h:1,room:c.rc,tr:tr[i]}));
  W.obj.forEach(o=>{
    if(o.kind!=='fouille'||o.loot||o.lock||o.ptype||noise(o.id,7,c.seed&1023)>.34)return;
    const l=[];c.suspects.forEach((su,s)=>{if(c.pos[s].includes(o.room))l.push(s)});
    if(!l.length)return;
    const s=l[o.id%l.length],su=c.suspects[s],ini=su.nom.split(' ').map(m=>m[0]+'.').join(' ');
    o.passe=s;o.text=[`Un mouchoir brodé aux initiales ${ini} Quelqu'un est passé ici ce soir.`,`Un gant oublié, marqué ${ini} Il est encore tiède.`,`Un stylo gravé ${ini} traîne là.`,`Une carte de visite au nom de ${su.nom}.`][o.id%4];
  });
}
function lireTrace(o){
  S.traces=S.traces||{};
  if(!S.traces[o.id]){S.traces[o.id]=1;note('trace',o.tr[0],o.tr[1],'loupe');son('bon')}
  say('Trace',o.tr[1]);
}
function notePasse(o){const su=c.suspects[o.passe];note('trace',`Passage de ${su.prenom}`,`${su.prenom} est venu${su.g==='f'?'e':''} ${c.set.rooms[o.room]?c.set.rooms[o.room].d:'ici'} ce soir.`,'p'+o.passe)}
function dessinTraces(){
  const P=S.p;
  W.obj.forEach(o=>{
    if(o.kind!=='trace'||(S.traces&&S.traces[o.id]))return;
    const x=o.x*TS+8,y=o.y*TS+9;if(Math.hypot(P.x-x,P.y-y)>62)return;
    const f=(tick>>3)%4;ctx.fillStyle=f<2?'#fff4c0':'#ffd23f';ctx.fillRect(x-1,y-1,2,2);if(f%2===0){ctx.fillRect(x-3,y,6,1);ctx.fillRect(x,y-3,1,6)}
  });
}
// ——— Rejouabilité ———
function titreAffaire(){
  const n={poison:"L'affaire du verre empoisonné",suicide:'Le faux suicide',vol:`Le vol ${c.vole.replace(/^l[ae] /,'de ').replace(/^de la /,'de la ')}`,accident:'La chute de trop',message:'Justice est faite',chantage:"L'enveloppe de minuit",meurtre:`Une nuit à ${c.set.nom}`}[c.crime];
  return n||`Affaire n° ${c.seed}`;
}
function motsCrime(){
  return{suicide:["Tout a été arrangé pour faire croire à un suicide. Le légiste n'y croit pas une seconde."],vol:[`Et ${c.vole} a disparu. La victime a sans doute surpris son voleur.`],poison:["Aucune blessure, juste un verre renversé près du corps. Quelqu'un a versé quelque chose dedans."],accident:["Au premier regard, une mauvaise chute. Mais le légiste a vu autre chose."],message:["Quelqu'un a écrit « Justice est faite » sur le miroir. Ce n'est pas un hasard."],chantage:["Sur le corps, une enveloppe pleine de billets. Quelqu'un payait pour acheter un silence."]}[c.crime]||[];
}
const dateCle=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function jourDuJour(){const k=dateCle(new Date()),h=hashS('jour'+k);return{k,lv:h%10,seed:1000+(h>>>4)%8999}}
function lanceJour(){const j=jourDuJour();neuf(j.lv,j.seed,true,null);S.jour=j.k;save()}
function finJour(){
  if(!S.jour||G.robot)return;
  stats.jours=stats.jours||{};if(stats.jours[S.jour])return;
  stats.jours[S.jour]=S.fin.note.l;
  const hier=dateCle(new Date(Date.parse(S.jour+'T12:00:00')-864e5));stats.serieJ=stats.jours[hier]?(stats.serieJ||0)+1:1;
}
const FINS={
 parfaite:['Dossier parfait',"Le coupable, l'arme et l'heure : tout y est. Le juge vous félicite en personne."],
 juste:['Affaire résolue',"Le coupable est sous les verrous. Votre dossier ne dit pas tout, mais il suffit."],
 vice:['Vice de procédure',"Vous teniez le bon coupable, mais l'arme et l'heure de votre dossier sont fausses. Son avocat obtient sa libération."],
 complice:['Un seul derrière les barreaux',"Vous avez arrêté l'un des deux assassins. L'autre a quitté le pays avant l'aube."],
 erreur:['Erreur judiciaire',"Un innocent dort en prison ce soir. Le vrai coupable, lui, dort très bien."],
 clemence:['Les yeux fermés',"Vous avez tout compris, et vous avez laissé partir le coupable. Personne n'en saura jamais rien."]
};
function finDe(f){
  if(f.clem)return'clemence';
  if(!f.win)return f.qui.some(i=>c.tueurs.includes(i))?'complice':'erreur';
  const a=f.arme===c.wpn,h=f.heure===c.hc;
  if(f.arme!=null&&f.heure!=null&&!a&&!h)return'vice';
  return a&&h?'parfaite':'juste';
}
function marqueFin(){
  const k=S.fin.cle=finDe(S.fin);
  if(!G.robot){stats.fins=stats.fins||{};stats.fins[k]=1;finJour();if(S.fin.win&&S.mode==='expert'){stats.exp=stats.exp||{};const e=stats.exp[S.lv];if(!e||S.fin.note.l<e)stats.exp[S.lv]=S.fin.note.l}}
  save();
}
const EXCUSABLES=['chantage','brevet','contrat','article','renvoi'];
function clemence(fin){
  const k=c.suspects[c.k];
  if(!S.fin.win||c.k2!==null||!EXCUSABLES.includes(k.dk))return fin();
  modal='dlg';
  bulle({at:null,nom:'Basile',txt:`${k.prenom} ${k.mobile}. Vous êtes seul à tout savoir. On l'embarque, inspecteur ?`,por:G.porBa,btn:[{t:'Arrêter',f:()=>{closeAll();fin()}},{t:'Fermer les yeux',cl:'alt',f:()=>{S.fin.clem=1;closeAll();fin()}}]});
}
function pFinNom(){const f=S.fin,q=FINS[f.cle];return q?`<div class="fin-nom"><b>${esc(q[0])}</b><span>${esc(q[1])}</span></div>`:''}

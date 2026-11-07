
const HOURS=['20 h','21 h','22 h','23 h'];
const DIFF={
  facile:{label:'Facile',n:5,window:1,liars:1},
  moyen:{label:'Moyen',n:6,window:2,liars:1},
  difficile:{label:'Difficile',n:6,window:2,liars:2}
};
const CLASSES={
  lourd:'un coup porté avec un objet lourd',
  lame:'une blessure faite par une lame',
  lien:'une strangulation avec un lien'
};
const NAMES=[['Inès Marchand','f'],['Paul Ferrand','m'],['Awa Diallo','f'],['Hugo Lemaire','m'],['Sofia Rinaldi','f'],['Théo Nguyen','m'],
  ['Clara Besson','f'],['Malik Haddad','m'],['Jeanne Roussel','f'],['Bastien Coste','m'],['Yuna Kerval','f'],['Nour Benali','f'],
  ['Léo Dumas','m'],['Rose Tessier','f'],['Victor Aubry','m'],['Margot Lacroix','f'],['Elias Weber','m'],['Olga Petrova','f']];
const VICTIMS=[['Vauquelin','m'],['Delmas','f'],['Sauvage','f'],['Armand','m'],['Castel','m'],['Fontaine','f'],['Grimaud','m'],['Lestrange','f']];
const MOTIVES=[
  {k:'dette',dl:["Encore une lettre de rappel ce matin, {V}. {m} francs, c'est ça ?","Une dette est une dette. Tu paieras, comme tout le monde.","Voilà, {V}. Tu peux rayer mon nom de ton petit carnet. Nous sommes quittes."],m:'devait une somme énorme à {v}',doc:'Une reconnaissance de dette : {n} doit 40 000 francs à {v}, à rembourser avant la fin du mois.',a:"Bon, oui, je lui devais de l'argent. Beaucoup. Mais tuer son créancier, ça n'efface pas la dette, ça la fait passer aux héritiers."},
  {k:'renvoi',dl:["Vingt ans à te servir, {V}. Et trois lignes pour me jeter dehors.","Personne n'est irremplaçable. Fais tes valises.","Tu avais raison, {V} : personne n'est irremplaçable. Même pas toi."],m:'venait de recevoir sa lettre de renvoi de {v}',doc:"Une lettre de renvoi signée {v}, adressée à {n} : « Vos services ne sont plus requis. »",a:"Vingt ans de loyauté et trois lignes pour me jeter dehors. J'étais furieux, oui. Vous ne l'auriez pas été ?"},
  {k:'brevet',dl:["Tu as signé mon travail de ton nom, {V}. Mes nuits, mes plans, tout.","Une idée appartient à celui qui sait la vendre.","Garde-le, ton brevet, {V}. Là où tu vas, il ne te rapportera plus rien."],m:'accuse {v} de lui avoir volé une invention',doc:"Un brevet au nom de {v}. Dans la marge, griffonné par {n} : « C'était MON idée. »",a:"Cette idée était la mienne. Tout le monde le sait. Je voulais un procès, pas un cadavre."},
  {k:'chantage',dl:["Combien de temps encore, {V} ? Tu comptais me tenir longtemps avec cette histoire de Lyon ?","Aussi longtemps que tu auras peur.","Je n'ai plus peur, {V}. Et toi, tu ne diras plus rien à personne."],m:'vivait sous la menace de {v}, qui connaissait un vieux scandale',doc:"Un billet de {v} pour {n} : « Je sais ce que vous avez fait à Lyon. Vous paierez. »",a:"Ce billet... D'accord. Il me faisait chanter depuis des mois. J'ai eu peur, je n'ai pas tué."},
  {k:'testament',dl:["Alors c'est vrai, {V} ? Presque tout me revient ?","Tant que je respire, je peux encore changer d'avis.","Justement, {V}. Maintenant, tu ne changeras plus d'avis."],m:'héritait de presque tout selon un testament récent de {v}',doc:'Une copie du testament de {v} : {n} y hérite de presque tout.',a:"Je sais de quoi ça a l'air. Je ne l'ai appris que la semaine dernière, je vous le jure."},
  {k:'article',dl:["Tu te souviens de ce qui est arrivé à ma famille, {V} ? Moi, j'y pense chaque jour.","C'était un accident. C'est du passé.","Ce soir aussi, c'était un accident, {V}. Ce sera bientôt du passé."],m:"tient {v} pour responsable d'un accident passé",doc:"Une coupure de presse jaunie sur un accident qui a brisé la famille de {n}. Le nom de {v} est entouré au crayon.",a:"Vous avez fouillé jusque-là ? Oui, je n'ai jamais pardonné. Mais je pensais que le temps s'en chargerait."},
  {k:'contrat',dl:["D'un coup de stylo, tu m'as rayé de ma propre affaire, {V}.","Les affaires sont les affaires.","Les affaires sont les affaires, {V}. Celle-ci est réglée."],m:"s'est fait évincer d'une affaire par {v}",doc:"Un contrat déchiré : le nom de {n} est rayé, remplacé par celui de {v}.",a:"Il m'a pris la moitié de ma vie avec un coup de stylo. Je le détestais. C'est tout ce que vous aurez."},
  {k:'article',dl:["Dix ans que je garde ton article, {V}. Dix ans que je le relis.","Je n'ai écrit que la vérité. Tu n'avais aucun talent.","Tu aimais tant avoir le dernier mot, {V}. Cette fois, il est pour moi."],m:'a vu sa carrière ruinée par {v} il y a dix ans',doc:"Un vieil article signé {v} qui démolit {n}. Quelqu'un l'a lacéré au couteau.",a:"Je garde cet article pour ne pas oublier. Ça ne veut pas dire que je passe à l'acte."}
];
// Chaque suspect a sa manière de parler : la forme change, jamais les faits.
const VOICES=[
  {nom:'nerveux',hi:["Oh ! Vous m'avez fait peur. C'est... c'est à quel sujet ?","Pardon, je ne tiens pas en place ce soir. Vous vouliez savoir quoi ?"],
   fmt:(h,l,w)=>`Euh... ${h} ? Attendez... j'étais ${l}, ${w}. Oui. C'est ça. Je crois. Non, j'en suis sûr.`,
   rel:"Lui et moi ? Rien à dire ! Enfin, si, mais rien d'important. Pourquoi cette question ?",non:"Je... non, je ne peux pas, pas comme ça. Laissez-moi respirer.",amb:['Il fait chaud, non ?','Je peux partir bientôt ?','... ce bruit, vous avez entendu ?']},
  {nom:'hautain',hi:["Inspecteur. J'espère que ce sera bref.","Encore vous ? Faites vite, je vous prie."],
   fmt:(h,l,w)=>`À ${h}, je me trouvais ${l}, ${w}. Notez-le, et n'y revenons pas.`,
   rel:"Nos affaires ne vous regardent pas. Adressez-vous à mon avocat.",non:"Je ne réponds pas aux questions d'un inconnu. Revenez mieux préparé.",amb:['Quelle soirée lamentable.','On me fait attendre, moi ?','Ce décor est d\'un goût...']},
  {nom:'jovial',hi:["Ah, le fin limier ! Approchez, je ne mords pas.","Tiens, de la visite ! Ça change des murs."],
   fmt:(h,l,w)=>`${h} ! Facile : ${l}, ${w}. Je ne me suis pas ennuyé !`,
   rel:"Oh, vous savez, on se chamaillait comme tout le monde ! Allez, passons.",non:"Ha ! Doucement, on vient à peine de se rencontrer. Parlons d'abord un peu.",amb:['Sale histoire, hein ?','Un petit café ?','Vous trouvez quelque chose ?']},
  {nom:'sec',hi:["Oui ?","Faites vite."],
   fmt:(h,l,w)=>`${h}. ${l[0].toUpperCase()+l.slice(1)}. ${w[0].toUpperCase()+w.slice(1)}. Autre chose ?`,
   rel:"Non.",non:"Non.",amb:['...','Hm.','Toujours là ?']},
  {nom:'triste',hi:["Pardonnez-moi, je n'arrive pas à y croire...","Vous enquêtez sur... sur ça, n'est-ce pas ?"],
   fmt:(h,l,w)=>`À ${h}... j'étais ${l}, ${w}. Si j'avais su que c'était la dernière soirée...`,
   rel:"C'est compliqué... On ne parle pas de ces choses-là ce soir, s'il vous plaît.",non:"Pas maintenant, je vous en prie. Laissez-moi un moment.",amb:['Pauvre victime...','Je ne dormirai pas.','Tout a changé en une nuit.']},
  {nom:'moqueur',hi:["Tiens, Sherlock. On a perdu sa loupe ?","Monsieur l'enquêteur en personne ! Quel honneur."],
   fmt:(h,l,w)=>`${h} ? Laissez-moi consulter mon agenda de suspect... ah, voilà : ${l}, ${w}. Vous prenez des notes ?`,
   rel:"Vous voulez savoir si je l'aimais bien ? Et vous, vous aimez vos questions ?",non:"Et pourquoi je vous dirais ça, à vous ? Essayez encore.",amb:['Alors, c\'est moi ?','Vous brûlez... ou pas.','Quel suspense.']}
];
const TRAITS=[
  {t:'Fume le cigarillo',c:'Un mégot de cigarillo a été écrasé près du corps.'},
  {t:'Gaucher|Gauchère',c:'Le légiste est formel : le geste a été fait de la main gauche.'},
  {t:'Porte des gants de cuir',c:'Des traces de gants de cuir marquent le rebord.'},
  {t:'Se parfume au vétiver',c:"Une forte odeur de vétiver flotte encore dans l'air."},
  {t:'Marche avec une canne',c:'Le sol porte de petites marques rondes de canne.'}
];

function RNG(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const int=(r,n)=>Math.floor(r()*n);
const pick=(r,a)=>a[int(r,a.length)];
function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=int(r,i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const range=n=>Array.from({length:n},(_,i)=>i);
const form=(s,g)=>{const p=s.split('|');return p.length>1&&g==='f'?p[1]:p[0]};

function otherRoom(r,excl){let x;do{x=int(r,NR)}while(excl.includes(x));return x}

function attempt(r,lv){
  const set=LEVELS[lv],key=set.diff,d=DIFF[key],H=HOURS.length,n=d.n;
  const hc=1+int(r,H-1),rc=int(r,NR),k=int(r,n);
  const inn=shuffle(r,range(n).filter(i=>i!==k));
  const [X,Y,W,Z,x]=inn;
  const pos=range(n).map(()=>{
    const row=[];let cur=int(r,NR);
    for(let h=0;h<H;h++){
      if(h===0||r()>.45)cur=int(r,NR);
      if(h>=hc&&cur===rc)cur=otherRoom(r,[rc]);
      row.push(cur);
    }
    return row;
  });
  pos[k][hc]=rc;
  const clear=(room,h,keep)=>{for(let s=0;s<n;s++)if(pos[s][h]===room&&s!==k&&!keep.includes(s))pos[s][h]=otherRoom(r,[room,rc])};

  // Le mensonge de l'assassin sur l'heure du crime
  const type=pick(r,d.liars===2?['salle','verrou']:['salle','complice','verrou']);
  const A=otherRoom(r,[rc]);
  const lie={room:A,with:[],vic:false};
  const needed=[{t:'s',s:k,h:hc}];
  let locked=null;
  if(type==='salle'){
    pos[X][hc]=A;pos[Y][hc]=A;
    needed.push({t:'s',s:X,h:hc},{t:'s',s:Y,h:hc});
  }else if(type==='complice'){
    const B=otherRoom(r,[rc,A]);
    clear(A,hc,[]);
    pos[X][hc]=B;pos[Y][hc]=B;
    lie.with=[X];
    needed.push({t:'s',s:X,h:hc},{t:'s',s:Y,h:hc});
  }else{
    clear(A,hc,[]);
    locked={room:A,h:hc};
    needed.push({t:'r',room:A});
  }

  // Fenêtre de la mort, levée par un témoin ou par la montre de la victime
  const earlier=hc===H-1||r()<.6;
  const win=d.window===1?[hc]:earlier?[hc-1,hc]:[hc,hc+1];
  const useWatch=d.window>1&&(!earlier||r()<.25);
  const vpos=range(H).map(h=>h>=hc?rc:int(r,NR));
  // Deux meurtriers : soit ils se couvrent mutuellement, soit chacun invente son alibi
  let k2=null,mode=null,lie2=null;
  if(d.liars===2){
    k2=x;mode=pick(r,['croise','separe']);
    if(mode==='croise'){
      lie.with=[k2];lie2={room:A,with:[k],vic:false};
      needed.push({t:'s',s:k2,h:hc});
      if(type==='salle'){pos[Z][hc]=A;needed.push({t:'s',s:Z,h:hc})}
    }else{
      const A2=otherRoom(r,[rc,A]);
      pos[W][hc]=A2;pos[Z][hc]=A2;
      lie2={room:A2,with:[],vic:false};
      needed.push({t:'s',s:k2,h:hc},{t:'s',s:W,h:hc},{t:'s',s:Z,h:hc});
    }
    pos[k2][hc]=rc;
  }
  if(d.window>1&&!useWatch)vpos[hc-1]=pos[W][hc-1];
  const stmts=range(n).map(s=>range(H).map(h=>{
    const room=pos[s][h];
    return{room,with:range(n).filter(t=>t!==s&&pos[t][h]===room&&!(h===hc&&(t===k||t===k2))),vic:h<hc&&vpos[h]===room};
  }));
  stmts[k][hc]=lie;
  if(k2!==null)stmts[k2][hc]=lie2;
  if(d.window>1)needed.push(useWatch?{t:'r',room:rc}:{t:'s',s:W,h:hc-1});

  // Identités
  const pool=[];const seen=new Set();
  for(const nm of shuffle(r,NAMES)){if(!seen.has(nm[0][0])){seen.add(nm[0][0]);pool.push(nm)}}
  const roles=shuffle(r,set.roles),vic=pick(r,VICTIMS);
  const vName=(vic[1]==='f'?'Mme ':'M. ')+vic[0];
  const motives=shuffle(r,MOTIVES),voices=shuffle(r,range(VOICES.length)),niveaux=shuffle(r,range(n).map(q=>1+q%3));
  const trait=pick(r,TRAITS);
  const sharers=shuffle(r,inn).slice(0,1+int(r,2));
  const suspects=range(n).map(i=>({
    nom:pool[i][0],prenom:pool[i][0].split(' ')[0],ini:pool[i][0][0],g:pool[i][1],
    role:form(roles[i],pool[i][1]),
    trait:(i===k||sharers.includes(i))?form(trait.t,pool[i][1]):null,
    mobile:motives[i].m.replace('{v}',vName),
    doc:motives[i].doc.replace('{v}',vName).replace('{n}',pool[i][0]),dk:motives[i].k,aveu:motives[i].a,dl:motives[i].dl,voice:voices[i],niveau:niveaux[i]
  }));

  // L'arme : deux objets de chaque classe, un seul manque dans la classe du crime
  const cls=pick(r,Object.keys(CLASSES).filter(k=>set.rooms.filter(q=>q.c===k).length>=2));
  const wpn=pick(r,range(NR).filter(i=>set.rooms[i].c===cls));
  const leurre=pick(r,range(NR).filter(i=>set.rooms[i].c!==cls));
  needed.push({t:'r',room:wpn});

  const c={seed:0,lv,key,set,n,H,hc,rc,k,win,useWatch,locked,stmts,pos,vpos,suspects,vName,vg:vic[1],vrole:set.vr[vic[1]==='f'?1:0],
    cls,wpn,leurre,trait,liars:d.liars,k2,mode,tueurs:k2===null?[k]:[k,k2],type,A,X,Y,W,Z,needed,
    par:0};
  const uniq=new Map();needed.forEach(i=>uniq.set(i.t==='s'?`s${i.s}-${i.h}`:`r${i.room}`,i));
  c.needed=[...uniq.values()];
  c.par=c.needed.length;
  return c;
}

const ALL={stm:()=>true,room:()=>true};
function knownOf(items){
  const keys=new Set(items.map(i=>i.t==='s'?`s${i.s}-${i.h}`:`r${i.room}`));
  return{stm:(s,h)=>keys.has(`s${s}-${h}`),room:r=>keys.has(`r${r}`)};
}
// Un monde : un ensemble de menteurs, un assassin parmi eux, une heure du crime.
function consistent(c,L,h,known){
  if(c.useWatch&&known.room(c.rc)&&h!==c.hc)return false;
  if(known.room(c.rc)&&!L.some(i=>c.suspects[i].trait))return false;
  const P=c.n+1,V=c.n;
  const eq=range(P).map(()=>Array(c.H).fill(-1));
  const ne=range(P).map(()=>range(c.H).map(()=>new Set()));
  const put=(p,hi,room)=>{if(eq[p][hi]>=0&&eq[p][hi]!==room)return false;eq[p][hi]=room;return true};
  for(let s=0;s<c.n;s++){
    if(L.includes(s))continue;
    for(let hi=0;hi<c.H;hi++){
      if(!known.stm(s,hi))continue;
      const st=c.stmts[s][hi];
      if(hi>=h&&st.room===c.rc)return false;
      if(hi>=h&&st.vic)return false;
      if(!put(s,hi,st.room))return false;
      for(let t=0;t<c.n;t++){
        if(t===s)continue;
        if(st.with.includes(t)){if(!put(t,hi,st.room))return false}
        else ne[t][hi].add(st.room);
      }
      if(st.vic){if(!put(V,hi,st.room))return false}
      else if(hi<h)ne[V][hi].add(st.room);
    }
  }
  if(c.locked&&known.room(c.locked.room))for(let p=0;p<P;p++)ne[p][c.locked.h].add(c.locked.room);
  for(const t of L)if(!put(t,h,c.rc))return false;
  for(let p=0;p<P;p++)for(let hi=0;hi<c.H;hi++)if(eq[p][hi]>=0&&ne[p][hi].has(eq[p][hi]))return false;
  return true;
}
function subsets(n,k){
  if(k===1)return range(n).map(i=>[i]);
  const out=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)out.push([i,j]);return out;
}
function solve(c,known){
  const res=[];
  for(const L of subsets(c.n,c.liars))for(const h of c.win)
    if(consistent(c,L,h,known))res.push({L,h});
  return res;
}
const memes=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
const isUnique=(c,w)=>w.length>0&&w.every(x=>memes(x.L,c.tueurs)&&x.h===c.hc);
function generate(seed,lv){
  const r=RNG(seed^((lv+3)*2654435761));
  for(let i=0;i<2000;i++){
    const c=attempt(r,lv);
    c.seed=seed;
    if(isUnique(c,solve(c,ALL))&&isUnique(c,solve(c,knownOf(c.needed))))return c;
  }
  throw new Error('Aucune affaire valide : '+seed+' niveau '+lv);
}

// Banc d'essai de l'IA des personnages, hors du jeu : node labo/test-ia.js [ticks]
// Pour chaque lieu et plusieurs enquêtes : personnages bloqués, chevauchements, attente dans une porte,
// variété des actions, réaction à une coupure de courant et à l'approche du joueur, temps de calcul.
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const src=['cartes','levels','data','engine','puzzles','world','documents','papiers','tableaux'].map(f=>fs.readFileSync(path.join(root,'src',f+'.js'),'utf8')).join('\n');
const E=new Function(src+';return{generate,buildWorld,RNG,LEVELS}')();
const{creerIA,IA_ACTIONS}=require('../src/ia.js');
const TICKS=+process.argv[2]||18000;
const monde=(lv,seed,mode)=>{const c=E.generate(seed,lv,mode),W=E.buildWorld(c);W.obj.filter(o=>o.kind==='suspect').forEach(o=>{W.blk[o.y][o.x]=0});return{c,W}};
const persos=(c,W)=>W.obj.filter(o=>o.kind==='suspect').map(o=>({nom:c.suspects[o.s].prenom,cx:o.x,cy:o.y,coupable:c.tueurs.includes(o.s)}));
function simule(lv,seed,o={}){
  const{c,W}=monde(lv,seed,o.mode||null),ia=creerIA(W,{rng:E.RNG(seed*7+lv),personnages:persos(c,W),...o.opts}),A=ia.agents,MW=ia.MW;
  const m={chev:0,porte:0,bloques:0,echecs:0,temps:{},lumiere:null,ms:0};
  const dern=A.map(a=>({x:a.x,y:a.y,t:0}));
  const t0=process.hrtime.bigint();
  for(let t=0;t<(o.ticks||TICKS);t++){
    if(o.joueur)ia.options.joueur=o.joueur(t,ia);
    ia.pas();
    if(t%10)continue;
    for(let i=0;i<A.length;i++){const a=A[i];
      // immobile alors qu'il devrait marcher
      const d=dern[i];if(a.action&&a.action.phase==='aller'){if(Math.hypot(a.x-d.x,a.y-d.y)<1){if((d.t+=10)>=300){m.bloques++;d.t=-1e9}}else{d.x=a.x;d.y=a.y;d.t=0}}else{d.x=a.x;d.y=a.y;d.t=0}
      const[x,y]=ia.caseDe(a);if(a.action&&a.action.phase==='faire'&&!a.assis&&ia.devantPorte.has(y*MW+x))m.porte++;
      for(let j=i+1;j<A.length;j++)if(Math.hypot(a.x-A[j].x,a.y-A[j].y)<9)m.chev++;
    }
    if(o.noir&&t===1800){const p=A.filter(a=>a.traits.peureux>.5);m.lumiere=p.length?p.filter(a=>a.action&&a.action.type==="lumiere"&&a.action.phase==="faire").length/p.length:1}
  }
  m.ms=Number(process.hrtime.bigint()-t0)/1e6;
  A.forEach(a=>{m.echecs+=a.echecs;for(const[k,v]of Object.entries(a.stats))m.temps[k]=(m.temps[k]||0)+v});
  m.n=A.length;m.ia=ia;return m;
}
const tot={chev:0,porte:0,bloques:0,echecs:0,temps:{},ms:0,ticks:0,parties:0};
const ajoute=m=>{['chev','porte','bloques','echecs','ms'].forEach(k=>tot[k]+=m[k]);for(const[k,v]of Object.entries(m.temps))tot.temps[k]=(tot.temps[k]||0)+v;tot.parties++};
console.log('lieu'.padEnd(26),'perso','bloqués','chev.','porte','échecs','ms/1000 pas','actions principales');
for(let lv=0;lv<10;lv++){
  const L=[];for(const seed of [11,23,37])for(const mode of [null,'expert']){const m=simule(lv,seed+lv*100,{mode});ajoute(m);L.push(m)}
  const s=k=>L.reduce((n,m)=>n+m[k],0),temps={};L.forEach(m=>{for(const[k,v]of Object.entries(m.temps))temps[k]=(temps[k]||0)+v});
  const totT=Object.values(temps).reduce((a,b)=>a+b,0),top=Object.entries(temps).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k} ${Math.round(v/totT*100)}%`).join(', ');
  console.log(`${lv} ${E.LEVELS[lv].nom}`.padEnd(26),String(L[0].n).padStart(5),String(s('bloques')).padStart(7),String(s('chev')).padStart(5),String(s('porte')).padStart(5),String(s('echecs')).padStart(6),(s('ms')/L.length/(TICKS/1000)).toFixed(2).padStart(11),' ',top);
}
const totT=Object.values(tot.temps).reduce((a,b)=>a+b,0),parts=Object.entries(tot.temps).map(([k,v])=>v/totT),H=-parts.reduce((s,p)=>s+p*Math.log2(p),0);
console.log('\nToutes parties :',tot.parties,'· bloqués',tot.bloques,'· chevauchements',tot.chev,'· attente dans une porte',tot.porte,'· renoncements (passage bloqué, il change de plan)',tot.echecs);
console.log('Variété des actions (entropie) :',H.toFixed(2),'bits sur',Math.log2(Object.keys(tot.temps).length).toFixed(2),'possibles');
console.log('Répartition du temps :',Object.entries(tot.temps).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${(v/totT*100).toFixed(1)}%`).join(' · '));
// Coupure de courant : les peureux trouvent-ils une lumière ?
const parts0=[];for(let lv=0;lv<10;lv++){const m=simule(lv,500+lv,{opts:{noir:true},noir:true,ticks:2000});parts0.push(m.lumiere)}
console.log(`
Coupure : après 30 s, ${Math.round(parts0.reduce((a,b)=>a+b,0)/parts0.length*100)} % des peureux sont près d'une lumière (par lieu : ${parts0.map(p=>Math.round(p*100)+'%').join(' ')})`);
// Le joueur s'approche du coupable : s'écarte-t-il plus que les autres ?
let ecartC=0,ecartA=0,nC=0,nA=0;
for(let lv=0;lv<10;lv++){
  let cible=null;const joueur=(t,ia)=>{if(!cible)cible=ia.agents.find(a=>a.coupable)||ia.agents[0];const k=t%1200<600?cible:ia.agents.find(a=>!a.coupable)||cible;return{x:k.x+20,y:k.y}};
  const m=simule(lv,900+lv,{joueur,ticks:4000});m.ia.agents.forEach(a=>{const e=(a.stats.eviter||0);if(a.coupable){ecartC+=e;nC++}else{ecartA+=e;nA++}});
}
console.log(`Joueur tout près : le coupable passe ${(ecartC/Math.max(1,nC)/60).toFixed(1)} s à s'écarter, les autres ${(ecartA/Math.max(1,nA)/60).toFixed(1)} s`);
console.log(`Calcul : ${(tot.ms/tot.parties/(TICKS/1000)).toFixed(2)} ms pour 1000 pas de temps (≈ 17 s de jeu)`);

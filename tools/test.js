const fs=require('fs'),path=require('path');
const src=['levels','data','engine','puzzles','world','documents','papiers','tableaux'].map(f=>fs.readFileSync(path.join(__dirname,'..','src',f+'.js'),'utf8')).join('\n');
const E=new Function(src+';return{generate,solve,ALL,knownOf,DIFF,LEVELS,OBJETS,DOC_HTML,DOC_TITRES,buildWorld,auditWorld,makePuzzle,puzzleWon,puzzleSolve,PTYPES,RNG};')();
const N=+process.argv[2]||300;
const types=new Set(),noms=new Set();
E.LEVELS.forEach(l=>l.rooms.forEach(q=>{types.add(q.t);noms.add(l.nom+q.n)}));
console.log('niveaux',E.LEVELS.length,'pieces',noms.size,'types',[...types].join(','),'objets',new Set(E.OBJETS.map(o=>o[0])).size,'documents',Object.keys(E.DOC_HTML).length);
for(const type of Object.keys(E.PTYPES)){
  let bad=0;
  for(let i=0;i<N;i++)for(let l=0;l<3;l++){
    const p=E.makePuzzle(E.RNG(i*7+l+1),type,l);
    if(!p||p.cand!==1){bad++;continue}
    if(E.puzzleWon(p,''))bad++;
    const a=E.puzzleSolve(p);if(!E.puzzleWon(p,a))bad++;
  }
  if(bad)console.log('ENIGME',type,'echecs',bad);
}
const MUR=['stove','sink','counter','fridge','bed','tub','toilet','shower','wardrobe','vanity','fireplace','shelf','commode','medic','washer','clock','locker'];
const FACE={chair:[0,1],chairB:[0,-1],chairR:[1,0],chairL:[-1,0]},SUPPORT=['table','rtable','desk','pcdesk'];
const REQUIS={cuisine:['stove','sink','fridge'],salon:['sofa','sofaB','armchair','armchairL','armchairR','chairR'],bain:['toilet','sink'],chambre:['bed']};
function verifie(w,c,err){
  let n=0;const k=m=>{n++;err(m)};
  w.furn.forEach(f=>{
    const A=w.areas[f.room];
    if(MUR.includes(f.name)&&w.t[f.y-1][f.x]!==2)k(f.name+' loin du mur, '+A.name);
    if(FACE[f.name]&&!['s_attente','ch_clinique'].includes(c.set.rooms[f.room]&&c.set.rooms[f.room].k)){
      const[a,b]=FACE[f.name],o=w.furn.find(q=>SUPPORT.includes(q.name)&&f.x+a>=q.x&&f.x+a<q.x+q.w&&f.y+b>=q.y&&f.y+b<q.y+q.h);
      if(!o)k(f.name+' ne fait face a rien, '+A.name);
    }
    if(f.name==='bed'){const pied=w.furn.find(q=>q.x>=f.x-1&&q.x<=f.x+f.w&&q.y===f.y+f.h);void pied}
  });
  w.rooms.forEach(A=>{
    const R=REQUIS[c.set.rooms[A.i].t],noms=w.furn.filter(f=>f.room===A.i).map(f=>f.name);
    if(R&&!(c.set.rooms[A.i].t==='bain'?R.every(x=>noms.includes(x)):R.some(x=>noms.includes(x))))k('piece sans son meuble : '+A.name+' '+noms.join(','));
    if(c.set.rooms[A.i].t==='chambre'&&!noms.includes('bed'))k('chambre sans lit '+A.name);
  });
  return n;
}
E.LEVELS.forEach((L,lv)=>{
  let maxCh=0,minR={v:1,n:''};const compte={};let bad=0,logique=0,first=null,tot={fouille:0,boites:0,locks:0,pz:0,docs:0,objets:0,cles:0};
  for(let i=0;i<N;i++){
    const c=E.generate(1000+i,lv);
    if(c.set.rooms.length!==5)bad++;
    const w=E.buildWorld(c),e=E.auditWorld(w,c);
    if(e.length){bad++;first=first||[1000+i,e.slice(0,4)]}
    w.obj.forEach(o=>{if(o.kind==='fouille'){tot.fouille++;if(o.loot)tot.boites++;if(o.lock)tot.locks++;if(o.ptype)tot.pz++;if(o.loot&&o.loot.t==='doc')tot.docs++;if(o.loot&&o.loot.t==='obj')tot.objets++;if(o.loot&&o.loot.t==='cle')tot.cles++}});
    logique+=verifie(w,c,e2=>{first=first||[1000+i,e2];const m=e2.split(',')[0].split(' : ')[0];compte[m]=(compte[m]||0)+1});
    const mot=w.obj.filter(o=>o.loot&&o.loot.t==='doc'&&w.docs[o.loot.i].s!==undefined).length;
    if(mot!==c.n)bad++;
    w.docs.forEach(d=>{if(!E.DOC_HTML[d.k])bad++;else if(E.DOC_HTML[d.k](d.p).includes('undefined'))bad++});
    if(w.docs.some(d=>d.fact&&c.tueurs.includes(d.fact.s)))bad++;
    if(L.diff==='difficile'&&c.tueurs.length!==2)bad++;
    const par={};w.obj.forEach(o=>{if(o.kind==='fouille'&&o.loot)par[o.room]=(par[o.room]||0)+1});maxCh=Math.max(maxCh,...Object.values(par));
    w.rooms.forEach(A=>{const s=(A.x1-A.x0+1)*(A.y1-A.y0+1),b=w.furn.filter(f=>f.room===A.i).reduce((n,f)=>n+f.w*f.h,0);if(b/s<minR.v)minR={v:b/s,n:A.name}});
  }
  bad+=logique;
  for(const k in tot)tot[k]=+(tot[k]/N).toFixed(1);
  console.log(String(lv+1).padStart(2),L.nom.padEnd(22),L.diff.padEnd(10),'problemes',bad,'max/piece',maxCh,'moins rempli',minR.n,minR.v.toFixed(2),JSON.stringify(tot),first?JSON.stringify(first):'',bad?JSON.stringify(compte):'');
});

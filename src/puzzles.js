// Algorithme d'énigmes : chaque générateur construit une instance puis la vérifie.
const PTYPES={code:'Cadenas logique',suite:'Suite numérique',anagramme:'Mot brouillé',cesar:'Message chiffré',ordre:'Ordre des leviers',
  lumieres:'Tableau de voyants',taquin:'Taquin',tuyaux:'Circuit à relier',menteur:'Les trois gardiens',
  grille:'Qui avait quoi ?',horloges:'Les pendules',balance:'La balance'};
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
const WORDS=[['chandelier','Il éclaire sans électricité'],['testament','Il décide de ton héritage'],['poignard','Une petite lame'],['alibi','Ce que chaque suspect défend'],
  ['empreinte','Elle reste sur le verre'],['serrure','La clé y entre'],['horloge','Elle sonne minuit'],['mobile','La raison du crime'],['enquete','Ce que tu mènes'],
  ['victime','Elle ne parlera plus'],['poison','Il tient dans une fiole'],['coupable','Celui que tu cherches'],['temoin','Il a tout vu'],['secret','Il se garde'],['indice','Il met sur la piste'],['passage','Il peut être secret']];
const PHRASES=[['LA VERITE EST DANS LE','TIROIR'],['MINUIT A SONNE DANS LE','SILENCE'],['NE FAIS JAMAIS CONFIANCE AU','MAJORDOME'],['LA CLE DORT SOUS LE','TAPIS'],
  ['SUIS LA TRACE DE','CENDRE'],['CHERCHE DERRIERE LE','MIROIR'],['LE COUPABLE PORTE UN','MASQUE'],['ECOUTE LE TIC TAC DE','HORLOGE']];
const caesar=(s,k)=>s.replace(/[A-Z]/g,ch=>String.fromCharCode((ch.charCodeAt(0)-65+k+26)%26+65));
function perms(a){if(a.length<2)return[a];const o=[];a.forEach((x,i)=>perms(a.filter((_,j)=>j!==i)).forEach(p=>o.push([x,...p])));return o}
const feedback=(g,s)=>{let b=0,m=0;for(let i=0;i<g.length;i++){if(g[i]===s[i])b++;else if(s.includes(g[i]))m++}return[b,m]};
const rot=(m,n=1)=>{for(let i=0;i<n;i++)m=((m<<1)&15)|(m>>3);return m};

const PGEN={
  code(r,l){
    const len=l>1?4:3,all=[];
    const rec=p=>{if(p.length===len){all.push(p);return}for(let d=0;d<10;d++)if(!p.includes(d))rec([...p,d])};rec([]);
    const secret=pick(r,all);let cand=all;const clues=[];
    while(cand.length>1&&clues.length<9){
      let best=null,bc=1e9;
      for(let i=0;i<30;i++){
        const g=pick(r,all);if(g.join('')===secret.join(''))continue;
        const f=feedback(g,secret).join();
        const n=cand.filter(x=>feedback(g,x).join()===f).length;
        if(n<bc&&n<cand.length){bc=n;best=g}
      }
      if(!best)continue;
      const f=feedback(best,secret);clues.push({g:best.join(''),b:f[0],m:f[1]});
      cand=cand.filter(x=>feedback(best,x).join()===f.join());
    }
    return{type:'code',len,clues,answer:secret.join(''),cand:cand.length};
  },
  suite(r,l){
    const a=2+int(r,8),b=2+int(r,5);
    const rules=[
      ()=>range(6).map(i=>a+b*i),
      ()=>range(6).map(i=>a*Math.pow(2,i)),
      ()=>{const o=[a];for(let i=1;i<6;i++)o.push(o[i-1]+i*b);return o},
      ()=>{const o=[a,b];for(let i=2;i<6;i++)o.push(o[i-1]+o[i-2]);return o},
      ()=>range(6).map(i=>(i+a)*(i+a)),
      ()=>{const o=[a];for(let i=1;i<6;i++)o.push(i%2?o[i-1]*2:o[i-1]+b);return o},
      ()=>{const o=[a];for(let i=1;i<6;i++)o.push(i%2?o[i-1]+b:o[i-1]-1);return o}
    ];
    const t=rules[int(r,l===0?3:rules.length)]();
    return{type:'suite',terms:t.slice(0,5),answer:String(t[5]),cand:1};
  },
  anagramme(r){
    const [w,d]=pick(r,WORDS);let s=w;
    for(let i=0;i<20&&s===w;i++)s=shuffle(r,[...w]).join('');
    return{type:'anagramme',scrambled:s.toUpperCase(),def:d,answer:w,cand:s===w?0:1};
  },
  cesar(r){
    const [a,b]=pick(r,PHRASES),k=3+int(r,20);
    return{type:'cesar',cipher:caesar(a+' '+b,k),k,answer:norm(b),cand:1,shift:0};
  },
  ordre(r,l){
    const names=shuffle(r,['Rouge','Bleu','Vert','Jaune','Noir','Blanc']).slice(0,l>1?5:4),order=shuffle(r,names),n=names.length;
    const test=(c,p)=>{const i=p.indexOf(c.a),j=p.indexOf(c.b);return c.t==='avant'?i<j:c.t==='pos'?i===c.i:c.t==='pas'?i!==c.i:Math.abs(i-j)===1};
    let cand=perms(names);const cons=[];
    for(let i=0;i<200&&cand.length>1;i++){
      const a=pick(r,names),b=pick(r,names.filter(x=>x!==a)),t=pick(r,['avant','avant','pas','voisin','pos']);
      const ia=order.indexOf(a),ib=order.indexOf(b);
      if(t==='voisin'&&Math.abs(ia-ib)!==1)continue;
      const c=t==='pos'?{t,a,i:ia}:t==='pas'?{t,a,i:(ia+1+int(r,n-1))%n}:{t,a:ia<ib?a:b,b:ia<ib?b:a};
      const f=cand.filter(p=>test(c,p));
      if(f.length<cand.length&&f.length>0){cand=f;cons.push(c)}
    }
    const txt=cons.map(c=>c.t==='avant'?`${c.a} s'actionne avant ${c.b}.`:c.t==='pos'?`${c.a} est en position ${c.i+1}.`:c.t==='pas'?`${c.a} n'est pas en position ${c.i+1}.`:`${c.a} et ${c.b} se suivent directement.`);
    return{type:'ordre',names,txt,answer:order.join(','),cand:cand.length,pick:[]};
  },
  lumieres(r,l){
    const n=l>0?4:3,grid=Array(n*n).fill(false),press=shuffle(r,range(n*n)).slice(0,3+l*2+int(r,2));
    const p={type:'lumieres',n,grid,press,cand:1};
    press.forEach(i=>lightPress(p,i));
    if(p.grid.every(x=>!x)){const i=press.length?(press[0]+1)%(n*n):0,q=press.indexOf(i);q>=0?press.splice(q,1):press.push(i);lightPress(p,i)}
    return p;
  },
  taquin(r,l){
    const b=range(9).map(i=>(i+1)%9);let e=8,last=-1;const moves=[];
    for(let i=0;i<24+l*30;i++){
      const o=[e-3,e+3,e%3?e-1:-1,e%3<2?e+1:-1].filter(x=>x>=0&&x<9&&x!==last);
      const m=pick(r,o);b[e]=b[m];b[m]=0;last=e;moves.push(e);e=m;
    }
    return{type:'taquin',b,e,moves:moves.reverse(),cand:b.every((v,i)=>v===(i+1)%9)?0:1};
  },
  tuyaux(r,l){
    const n=4+l;let path=null;
    for(let tr=0;tr<200&&!path;tr++){
      const y0=int(r,n),seen=new Set([y0*n]),p=[[0,y0]];
      const walk=()=>{
        const[x,y]=p[p.length-1];
        if(x===n-1&&p.length>=n+1)return true;
        for(const[dx,dy]of shuffle(r,[[1,0],[0,1],[0,-1],[1,0],[-1,0]])){
          const X=x+dx,Y=y+dy,k=Y*n+X;
          if(X<0||Y<0||X>=n||Y>=n||seen.has(k))continue;
          seen.add(k);p.push([X,Y]);
          if(walk())return true;
          p.pop();
        }
        return false;
      };
      if(walk())path=p;
    }
    const g=Array(n*n).fill(0);
    path.forEach(([x,y],i)=>{
      let m=0;const pr=i?path[i-1]:[x-1,y],nx=i<path.length-1?path[i+1]:[x+1,y];
      for(const q of[pr,nx])m|=q[1]<y?1:q[0]>x?2:q[1]>y?4:8;
      g[y*n+x]=m;
    });
    for(let i=0;i<n*n;i++)if(!g[i])g[i]=pick(r,[5,10,3,6,12,9]);
    const sol=g.slice(),cells=g.map(m=>rot(m,1+int(r,3)));
    const p={type:'tuyaux',n,cells,sol,y0:path[0][1],y1:path[path.length-1][1],cand:1};
    if(pipeFlow(p).win)p.cells[0]=rot(p.cells[0]);
    return p;
  },
  menteur(r){
    const boxes=['A','B','C'],who=shuffle(r,['Le gardien','La cuisinière','Le chauffeur']);
    for(let tr=0;tr<500;tr++){
      const st=range(3).map(()=>{const b=pick(r,boxes),neg=r()<.6;return{b,neg,txt:neg?`La clé n'est pas dans le tiroir ${b}.`:`La clé est dans le tiroir ${b}.`}});
      const ok=boxes.filter(x=>st.filter(s=>s.neg?s.b!==x:s.b===x).length===1);
      if(ok.length===1)return{type:'menteur',who,st,answer:ok[0],cand:1};
    }
    return{type:'menteur',who,st:[],answer:'A',cand:0};
  },
  // Grille de déduction : chacun était dans une pièce et tenait un objet. Des indices, une seule réponse possible.
  grille(r,l){
    const n=l>1?4:3,cs=typeof c!=='undefined'&&c&&c.suspects?c.suspects.map(s=>s.prenom):null;
    const gens=shuffle(r,cs&&cs.length>=n?cs:['Hector','Lise','Paul','Rose','Victor']).slice(0,n);
    const lieux=shuffle(r,['le salon','la cuisine','la bibliothèque','le jardin','la cave','le grenier']).slice(0,n);
    const objets=shuffle(r,['la lampe','le livre','la tasse','la clé','le parapluie','la lettre']).slice(0,n);
    const P=perms(range(n)),tout=[];P.forEach(a=>P.forEach(b=>tout.push([a,b])));
    const vrai=[pick(r,P),pick(r,P)],cible=int(r,n),qui=s=>s[1].indexOf(cible);
    const faits=[];
    for(let i=0;i<n;i++)for(let k=0;k<n;k++){
      const ici=vrai[0][i]===k,tient=vrai[1][i]===k;
      faits.push({t:ici?`${gens[i]} était dans ${lieux[k]}.`:`${gens[i]} n'était pas dans ${lieux[k]}.`,f:s=>(s[0][i]===k)===ici,poids:ici?3:1});
      faits.push({t:tient?`${gens[i]} avait ${objets[k]}.`:`${gens[i]} n'avait pas ${objets[k]}.`,f:s=>(s[1][i]===k)===tient,poids:tient?4:1});
    }
    for(let o=0;o<n;o++)for(let k=0;k<n;k++){
      const ou=vrai[0][vrai[1].indexOf(o)]===k;
      faits.push({t:ou?`Celui qui avait ${objets[o]} était dans ${lieux[k]}.`:`Celui qui avait ${objets[o]} n'était pas dans ${lieux[k]}.`,f:s=>(s[0][s[1].indexOf(o)]===k)===ou,poids:ou?3:1});
    }
    let reste=tout;const clues=[];
    const reponses=l2=>new Set(l2.map(qui)).size;
    for(const q of shuffle(r,faits).sort((a,b)=>a.poids-b.poids)){
      if(reponses(reste)===1&&reste.length<=(l>1?6:4))break;
      const n2=reste.filter(q.f);if(n2.length<reste.length&&n2.length>0){reste=n2;clues.push(q.t)}
    }
    return{type:'grille',gens,question:`Qui avait ${objets[cible]} ?`,clues:shuffle(r,clues),answer:gens[qui(vrai)],cand:reponses(reste)};
  },
  // Trois pendules qui avancent ou retardent l'une sur l'autre : quelle heure était-il vraiment ?
  horloges(r,l){
    const noms=shuffle(r,['du salon','du hall','de la cuisine','du bureau','de la gare']),n=l>1?3:2,ecarts=range(n).map(()=>(1+int(r,4))*5*(r()<.5?-1:1));
    const vraie=20*60+int(r,24)*5,montre=[vraie+ecarts[0]];for(let i=1;i<n;i++)montre.push(montre[i-1]+ecarts[i]);
    const hm=m=>`${Math.floor(m/60)} h ${String(m%60).padStart(2,'0')}`,d=e=>e>0?`avance de ${e} minutes`:`retarde de ${-e} minutes`;
    const txt=[`La pendule ${noms[0]} ${d(ecarts[0])} sur l'heure exacte.`];
    for(let i=1;i<n;i++)txt.push(`Celle ${noms[i]} ${d(ecarts[i])} sur celle ${noms[i-1]}.`);
    txt.push(`Le rendez-vous était fixé à ${hm(montre[n-1])} à la pendule ${noms[n-1]}.`);
    return{type:'horloges',txt,answer:hm(vraie),cand:1};
  },
  // Des pesées sur une balance de cuisine : combien pèse l'objet demandé ?
  balance(r,l){
    const noms=shuffle(r,['la boîte rouge','la boîte bleue','la boîte verte','la boîte noire']).slice(0,l>1?3:3),n=noms.length;
    for(let essai=0;essai<200;essai++){
      const vrai=shuffle(r,range(9).map(i=>i+1)).slice(0,n),eqs=[];
      const toutes=[];for(let a=1;a<=9;a++)for(let b=1;b<=9;b++)for(let d=1;d<=9;d++)if(a!==b&&a!==d&&b!==d)toutes.push([a,b,d]);
      let reste=toutes;
      for(let t=0;t<12&&reste.length>1;t++){
        const co=range(n).map(()=>int(r,l>1?3:2));if(co.every(x=>!x)||co.filter(Boolean).length<2)continue;
        const tot=co.reduce((s,k,i)=>s+k*vrai[i],0),n2=reste.filter(q=>co.reduce((s,k,i)=>s+k*q[i],0)===tot);
        if(n2.length<reste.length){reste=n2;eqs.push((t0=>t0[0].toUpperCase()+t0.slice(1))(co.map((k,i)=>k?(k>1?k+' × ':'')+noms[i]:null).filter(Boolean).join(' + ')+' = '+tot+' kg'))}
      }
      const cible=int(r,n);
      if(reste.length===1)return{type:'balance',eqs,question:`Combien pèse ${noms[cible]} ?`,note:'Les trois boîtes ont des poids différents, des nombres entiers de 1 à 9 kg.',answer:String(vrai[cible]),cand:1};
    }
    return{type:'balance',eqs:[],question:'',answer:'0',cand:0};
  }
};
function lightPress(p,i){const n=p.n,x=i%n,y=(i/n)|0;[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<n&&Y<n)p.grid[Y*n+X]=!p.grid[Y*n+X]})}
function taquinMove(p,i){const e=p.e,a=Math.abs(i-e);if(!(a===3||(a===1&&((i/3)|0)===((e/3)|0))))return false;p.b[e]=p.b[i];p.b[i]=0;p.e=i;return true}
function pipeFlow(p){
  const n=p.n,seen=new Set(),todo=[p.y0*n];
  if(!(p.cells[p.y0*n]&8))return{seen,win:false};
  while(todo.length){
    const k=todo.pop();if(seen.has(k))continue;seen.add(k);
    const x=k%n,y=(k/n)|0,m=p.cells[k];
    [[1,x,y-1,4],[2,x+1,y,8],[4,x,y+1,1],[8,x-1,y,2]].forEach(([b,X,Y,o])=>{if((m&b)&&X>=0&&Y>=0&&X<n&&Y<n&&(p.cells[Y*n+X]&o))todo.push(Y*n+X)});
  }
  return{seen,win:seen.has(p.y1*n+n-1)&&!!(p.cells[p.y1*n+n-1]&2)};
}
function makePuzzle(r,type,l){return PGEN[type](r,l)}
function puzzleWon(p,input){
  if(p.type==='lumieres')return p.grid.every(x=>!x);
  if(p.type==='taquin')return p.b.every((v,i)=>v===(i+1)%9);
  if(p.type==='tuyaux')return pipeFlow(p).win;
  if(p.type==='ordre')return p.pick.join(',')===p.answer;
  if(p.type==='horloges')return String(input).replace(/\D/g,'')===p.answer.replace(/\D/g,'');
  if(p.type==='balance')return String(input).replace(/\D/g,'')===p.answer;
  return norm(input)===norm(p.answer);
}
// Solution exacte, utilisée par le robot et les tests : elle prouve que l'instance se résout.
function puzzleSolve(p){
  if(p.type==='lumieres')p.press.forEach(i=>lightPress(p,i));
  else if(p.type==='taquin')p.moves.forEach(m=>taquinMove(p,m));
  else if(p.type==='tuyaux')p.cells=p.sol.slice();
  else if(p.type==='ordre')p.pick=p.answer.split(',');
  return p.answer||'';
}

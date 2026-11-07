// Génération de la carte : architecture, mobilier, portes, cachettes, énigmes d'objets et audit.
let MW=62,MH=33;
const FP={escalier:[2,1],secours:[2,1],chariot:[2,1],valise:[1,1],bascule:[1,1],banquette:[2,1],fontaine:[1,1],radio:[2,1],skis:[1,1],portant:[2,1],bouee:[1,1],barre:[2,1],perfusion:[1,1],brancard:[2,1],armure:[1,1],bandit:[1,1],jetons:[1,1],portemanteau:[1,1],parapluies:[1,1],chaussures:[2,1],videpoche:[2,1],banc:[2,1],shelf:[2,1],cabinet:[2,1],fridge:[1,1],stove:[2,1],sink:[2,1],counter:[2,1],locker:[1,1],rack:[1,1],vanity:[2,1],wardrobe:[2,1],piano:[3,2],fireplace:[3,1],bar:[4,1],clock:[1,1],
  console:[3,1],labbench:[3,1],planter:[3,1],table:[3,2],rtable:[2,2],chair:[1,1],sofa:[3,1],armchair:[1,1],bed:[2,3],crate:[1,1],barrel:[1,1],plant:[1,1],mannequin:[1,1],spot:[1,1],ropes:[1,1],
  trunk:[2,1],lamp:[1,1],globe:[1,1],stool:[1,1],tank:[1,1],tub:[3,1],toilet:[1,1],shower:[2,1],desk:[3,1],pcdesk:[3,1],commode:[2,1],chevet:[1,1],lift:[2,1],medic:[1,1],washer:[1,1],copier:[1,1],roulette:[3,2],engine:[3,2],
  chairB:[1,1],chairL:[1,1],chairR:[1,1],armchairB:[1,1],armchairL:[1,1],armchairR:[1,1],sofaB:[3,1],basse:[3,1]};
const DECO=[['chariot','valise'],['bascule','valise'],['banquette','valise'],['fontaine','fontaine'],['radio','skis'],['portant','portant'],['bouee','barre'],['perfusion','brancard'],['armure','armure'],['bandit','jetons','bandit']];
const FLAVOR={chariot:['Des serviettes propres et de petits savons.'],valise:["Une étiquette à moitié arrachée. Elle est vide."],bascule:['Il se balance encore un peu.'],banquette:['Le velours est usé aux accoudoirs.'],fontaine:["Elle glougloute toute seule."],radio:['Rien que du grésillement.'],skis:['Les fartages sont encore frais.'],portant:['Des costumes de scène qui sentent la naphtaline.'],bouee:['Elle porte le nom du navire.'],barre:['Elle est bloquée depuis le départ.'],perfusion:["La poche est presque vide."],brancard:['Les draps sont propres.'],armure:["Il n'y a personne dedans. Enfin, j'espère."],bandit:['Trois citrons. Encore perdu.'],jetons:['Quelques jetons abandonnés en plein jeu.'],portemanteau:['Des manteaux encore humides de pluie.','Un chapeau, une écharpe, un vieux pardessus.'],parapluies:['Trois parapluies, encore mouillés.'],chaussures:["Des chaussures bien alignées. Personne n'est sorti ce soir."],videpoche:['Un vide-poches, quelques clés sans étiquette.','Une petite coupelle et le courrier du matin.'],banc:['Un banc pour se déchausser.'],shelf:['Des rangées de livres, rien de plus.','Les reliures sentent le vieux cuir.'],cabinet:['Des tiroirs bien rangés, sans surprise.'],crate:['Des clous et de la paille.'],trunk:['Des vêtements pliés et de vieux journaux.'],
 barrel:['Ça sonne plein.'],table:['Quelques papiers sans intérêt.','Des tasses encore tièdes.'],clock:['Elle tique trop fort pour être honnête.','Elle retarde de deux minutes.'],plant:['La terre est humide. Quelqu\'un en prend soin.'],
 locker:['Un casier vide, qui sent le renfermé.'],lamp:['L\'ampoule grésille.'],lift:['L\'ascenseur est à l\'arrêt, impossible de l\'appeler.','Le bouton ne répond plus. Rien à faire.'],tub:['La baignoire est sèche.'],toilet:['Rien ici. Heureusement.'],shower:['Le carrelage est encore humide.'],
 escalier:["L'escalier de service. Une corde rouge barre le passage : « Fermé pendant la tempête ».","Une fine couche de poussière couvre les marches : personne n'est monté ce soir."],
 secours:["La sortie de secours est enchaînée. Personne n'a pu sortir par là ce soir.","Une chaîne, un gros cadenas, et dehors la tempête. Le coupable est forcément encore à l'intérieur."],
 bed:['Les draps sont tirés au cordeau.','Personne n\'a dormi ici ce soir.'],sofa:['Rien entre les coussins.'],armchair:['Il garde la forme de son dernier occupant.'],chair:['Une simple chaise.'],stove:['Les plaques sont froides.'],piano:['Une touche sonne faux.'],
 globe:['Il tourne mal, comme le monde.'],washer:['Le tambour est vide.'],copier:['Elle clignote : plus de papier.'],roulette:['Le cylindre s\'est arrêté sur le 17.'],engine:['Le métal est brûlant et le bruit assourdissant.'],tank:['Le liquide ne bouge pas.'],
 console:['Des voyants clignotent sans raison.'],rack:['Des câbles partout.'],mannequin:['Son regard vide met mal à l\'aise.'],spot:['Il est encore chaud.'],ropes:['Une corde bien rangée.'],planter:['Quelques plantes fatiguées.'],labbench:['Des éprouvettes alignées.'],stool:['Un tabouret bancal.'],basse:['Quelques revues, une tasse froide.'],
 commode:['Des draps pliés, rien d\'autre.','Les tiroirs sont presque vides.','Du linge et une odeur de lavande.'],wardrobe:['Des cintres, quelques manteaux.','Vide, à part un parfum tenace.'],desk:['Des stylos secs et des factures anciennes.','Le tiroir ne contient que des trombones rouillés.'],pcdesk:['Rien d\'utile, juste des courriels ennuyeux.'],
 chevet:['Un livre corné et un verre d\'eau.','Le tiroir est vide.'],fridge:['Un reste de fromage, rien d\'intéressant.','Ça sent un peu le renfermé.'],sink:['Le siphon est propre.','Une goutte tombe du robinet.'],counter:['Des miettes et un torchon humide.','Rien dans les placards, à part de la vaisselle.'],
 medic:['Des pansements et de l\'aspirine.','Quelques flacons ordinaires.'],vanity:['Du maquillage et une brosse.','Rien derrière le miroir.'],fireplace:['Le feu crépite. Rien de caché dans les braises.','Rien dans l\'âtre, à part les bûches.'],bar:['Des verres propres et des bouteilles entamées.'],washer:['Le tambour est vide.'],sewing:['Du fil et des aiguilles.']};
const LOCKS=[['rouge','#e8504a'],['bleue','#4aa8ff'],['verte','#58d67a']];
const SH_HAUT=['escalier','secours','shelf','wardrobe','fridge','locker','clock','medic','rack','shower','lift','cabinet','vanity','lamp','plant'];
const DIFFW={facile:{lock:1,eni:2,pz:2,bonus:1},moyen:{lock:1,eni:3,pz:3,bonus:1},difficile:{lock:2,eni:4,pz:3,bonus:2}};

function buildWorld(c){
  const L=c.set,r=RNG((c.seed*2654435761+c.lv*97+11)>>>0),D=DIFFW[c.key],P=L.plan;
  const rects=[...P.r,...P.c];
  MW=Math.max(...rects.map(q=>q[0]+q[2]))+3;MH=Math.max(...rects.map(q=>q[1]+q[3]))+3;
  const grid=v=>range(MH).map(()=>Array(MW).fill(v)),t=grid(0),blk=grid(0),res=grid(0),gate=grid(0);
  const w={t,blk,gate,furn:[],obj:[],doors:{},lamps:[],windows:[],tableaux:[],entrees:[],docs:[],mw:MW,mh:MH};
  let uid=1;const nid=()=>uid++;
  const fill=(x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)t[y][x]=v};
  const rect=q=>({x0:q[0],y0:q[1],x1:q[0]+q[2]-1,y1:q[1]+q[3]-1});
  // Aires : les 5 pièces puis les circulations
  const noms=[...new Set(P.c.map(q=>q[4]))];
  w.areas=[...P.r.map((q,i)=>({room:L.rooms[i],rs:[rect(q)]})),...noms.map(n=>({nom:n,rs:P.c.filter(q=>q[4]===n).map(rect)}))].map(({room,nom,rs},i)=>{
    const rec=room?RECIPES[room.k]:{f:L.floor,cw:L.cw},A={i,rects:rs,x0:Math.min(...rs.map(q=>q.x0)),y0:Math.min(...rs.map(q=>q.y0)),x1:Math.max(...rs.map(q=>q.x1)),y1:Math.max(...rs.map(q=>q.y1)),name:room?room.n:nom,room:!!room,rec,tint:room?room.tint:L.tint};
    rs.forEach(q=>fill(q.x0,q.y0,q.x1,q.y1,1));
    A.view=rs.map(q=>[q.x0-1,q.y0-2,q.x1+1,q.y1+1]);
    return A;
  });
  // Le mur du fond suit la forme réelle du sol, même dans un coude
  for(let y=2;y<MH;y++)for(let x=0;x<MW;x++)if(t[y][x]===1&&t[y-1][x]===0){t[y-1][x]=2;if(t[y-2][x]===0)t[y-2][x]=2}
  w.rooms=w.areas.slice(0,L.rooms.length);
  // Portes : déduites de la position réelle des pièces
  const doors=P.l.map(([a,b])=>{
    const A=w.areas[a],B=w.areas[b],id=nid();let d,m=null;
    for(const ra of A.rects)for(const rb of B.rects){
      const[g0,h0]=ra.x0<rb.x0?[ra,rb]:[rb,ra],[u0,l0]=ra.y0<rb.y0?[ra,rb]:[rb,ra];
      if(g0.x1+2===h0.x0){const n=Math.min(g0.y1,h0.y1)-Math.max(g0.y0,h0.y0);if(n>=2&&(!m||n>m.n))m={v:1,G:g0,H:h0,n}}
      if(u0.y1+4===l0.y0){const n=Math.min(u0.x1,l0.x1)-Math.max(u0.x0,l0.x0);if(n>=3&&(!m||n>m.n))m={v:0,U:u0,F:l0,n}}
    }
    if(!m)throw new Error('plan sans porte possible '+a+'-'+b);
    if(m.v){
      const{G:G0,H}=m,gx=G0.x1+1,y0=Math.max(G0.y0,H.y0)+1,y1=Math.min(G0.y1,H.y1)-1,y=y0+int(r,Math.max(1,y1-y0));
      [y,y+1].forEach(q=>{t[q][gx]=1;gate[q][gx]=id;res[q][gx-1]=1;res[q][gx+1]=1;res[q][gx-2]=1;res[q][gx+2]=1});
      d={id,kind:'door',v:true,x:gx,y,w:1,h:2};
    }else{
      const{U,F}=m,x0=Math.max(U.x0,F.x0)+1,x1=Math.min(U.x1,F.x1)-2,x=x0+int(r,Math.max(1,x1-x0+1)),ry=U.y1+1;
      for(let q=0;q<3;q++){t[ry+q][x]=1;t[ry+q][x+1]=1;gate[ry+q][x]=id;gate[ry+q][x+1]=id}
      for(let k=-1;k<3;k++){res[U.y1][x+k]=1;res[U.y1-1][x+k]=1;res[F.y0][x+k]=1;res[F.y0+1][x+k]=1}
      d={id,kind:'door',v:false,x,y:ry,w:2,h:3};
    }
    d.a=a;d.b=b;d.lock=null;w.doors[id]=d;
    if(!d.v){d.haut=A.rects.includes(m.U)?a:b;d.bas=d.haut===a?b:a}
    // la porte dépend de la pièce qu'elle ferme : numéro de chambre, hublot de cuisine, verre dépoli...
    const nr=L.rooms.length,ferme=a<nr&&b<nr?([a,b].find(i=>L.rooms[i].t==='bain')??b):(a<nr?a:b),tp=L.rooms[ferme].t;
    d.style=tp==='bain'?'bain':tp==='cuisine'?'cuisine':tp==='salon'?'double':tp==='chambre'?L.portech:L.porte;
    d.num=tp==='chambre'&&(L.rooms[ferme].n.match(/\d+/)||[])[0]||null;
    d.ferme=ferme;
    if(d.v){const q=[d.x,d.y,d.x+d.w-1,d.y+d.h-1];A.view.push(q);B.view.push(q)}
    else{w.areas[d.haut].view.push([d.x,d.y,d.x+1,d.y]);w.areas[d.bas].view.push([d.x,d.y+1,d.x+1,d.y+2])}
    return d;
  });
  const solides=[];
  const dans=(A,x,y)=>A.rects.some(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1);
  const cellsOf=A=>{const o=[];A.rects.forEach(q=>{for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++)o.push([x,y])});return o};
  const flood=(A)=>{
    const s=cellsOf(A).find(([x,y])=>res[y][x]&&!blk[y][x]);
    if(!s)return null;
    const seen=new Set([s[1]*MW+s[0]]),st=[s];
    while(st.length){const[x,y]=st.pop();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b,k=Y*MW+X;
      if(!dans(A,X,Y)||seen.has(k)||blk[Y][X])continue;seen.add(k);st.push([X,Y])}}
    return seen;
  };
  const areaOK=A=>{
    const s=flood(A);if(!s)return false;
    if(cellsOf(A).some(([x,y])=>!blk[y][x]&&!s.has(y*MW+x)))return false;
    // chaque meuble et chaque objet doit garder un côté accessible
    const acces=(x0,y0,w0,h0)=>{for(let y=y0;y<y0+h0;y++)if(s.has(y*MW+x0-1)||s.has(y*MW+x0+w0))return true;for(let x=x0;x<x0+w0;x++)if(s.has((y0-1)*MW+x)||s.has((y0+h0)*MW+x))return true;return false};
    if(w.furn.some(f=>f.room===A.i&&!acces(f.x,f.y,f.w,f.h)))return false;
    if(solides.some(q=>dans(A,q[0],q[1])&&!acces(q[0],q[1],1,1)))return false;
    return true;
  };
  const place=(name,x,y,A)=>{
    const[fw,fh]=FP[name],id=nid(),f={id,name,x,y,w:fw,h:fh,room:A.i,v:int(r,1e6)};
    for(let a=0;a<fh;a++)for(let b=0;b<fw;b++)blk[y+a][x+b]=id;
    w.furn.push(f);
    if(['lamp','fireplace','stove','vanity','console','rack','spot','tank','secours'].includes(name))w.lamps.push({x:x+fw/2,y:y+.5,warm:!['console','rack','tank','secours'].includes(name)});
    return f;
  };
  const unplace=f=>{for(let a=0;a<f.h;a++)for(let b=0;b<f.w;b++)blk[f.y+a][f.x+b]=0;w.furn.splice(w.furn.indexOf(f),1);w.lamps=w.lamps.filter(l=>!(l.x===f.x+f.w/2&&l.y===f.y+.5))};
  const libreLa=(x,y,fw,fh)=>{for(let a=0;a<fh;a++)for(let b=0;b<fw;b++){if(y+a<0||y+a>=MH||blk[y+a][x+b]||res[y+a][x+b])return false}return true};
  // Rangée contre le mur du haut : les meubles se touchent, seule une porte peut les séparer
  // du plus indispensable au moins indispensable : on ne sacrifie jamais le lit d'une chambre
  const ESSENTIEL=['bed','toilet','sink','stove','fridge','sofa','tub','shower','bar','console','fireplace','vanity'];
  const rang=n=>{const i=ESSENTIEL.indexOf(n);return i<0?99:i};
  const poseRun=A=>{
    let list=(A.rec.run||[]).slice();if(A.flip)list.reverse();
    const W0=A.x1-A.x0+1;
    // Range les meubles dans l'ordre, de part et d'autre des portes
    const range_=(noms,dep)=>{
      const out=[];let x=dep;
      for(const n of noms){
        const[fw,fh]=FP[n];
        while(x+fw-1<=A.x1&&!libreLa(x,A.y0,fw,fh))x++;
        if(x+fw-1>A.x1)return null;
        out.push([n,x]);x+=fw;
      }
      return out;
    };
    let plan=null;
    while(list.length&&!plan){
      const tot=list.reduce((n,k)=>n+FP[k][0],0),marge=W0-tot;
      const deps=[...(A.rec.centre?[A.x0+(marge>>1)]:A.flip?[A.x0+marge]:[A.x0]),A.x0];
      for(const d of deps){plan=range_(list,Math.max(A.x0,d));if(plan)break}
      if(!plan){
        // la place manque : on retire d'abord ce qui n'est pas indispensable
        const pire=Math.max(...list.map(rang));
        list.splice(list.map(rang).lastIndexOf(pire),1);
      }
    }
    (plan||[]).forEach(([n,x])=>{const f=place(n,x,A.y0,A);if(!areaOK(A))unplace(f)});
  };
  // Une entrée a sa grande porte condamnée, son porte-manteau et ce qu'on y pose en arrivant
  const poseEntree=A=>{
    const q=A.rects[0],mur=(x,n=1)=>{for(let i=0;i<n;i++)if(t[q.y0-1][x+i]!==2)return false;return true},dehors=x=>{for(let j=q.y0-3;j>=0;j--)if(t[j][x]===1)return false;return true};
    const cand=[];for(let x=q.x0+1;x<q.x1-1;x++)if(mur(x,2))cand.push(x);
    const ext=cand.filter(x=>dehors(x)&&dehors(x+1)),l=ext.length?ext:cand,cx=(q.x0+q.x1-1)/2;
    if(l.length){const X=l.reduce((m,x)=>Math.abs(x-cx)<Math.abs(m-cx)?x:m);w.entrees.push({x:X,y:q.y0-2});for(let k=-1;k<3;k++){res[q.y0][X+k]=1;res[q.y0+1][X+k]=1}}
    ['portemanteau','videpoche','chaussures','parapluies','banc'].forEach(name=>{
      const fw=FP[name][0],xs=range(q.x1-q.x0-fw+2).map(i=>q.x0+i);
      for(const x of shuffle(r,xs)){
        if(!mur(x,fw)||!libreLa(x,q.y0,fw,1))continue;
        const f=place(name,x,q.y0,A);if(areaOK(A))break;unplace(f);
      }
    });
  };
  // L'ascenseur se pose au milieu d'un pan de mur entier, de préférence tout au bout du couloir
  const pansDeMur=A=>{const l=[];A.rects.forEach(q=>{let d=null;for(let x=q.x0;x<=q.x1+1;x++){const ok=x<=q.x1&&t[q.y0-1][x]===2&&t[q.y0-2][x]===2&&!gate[q.y0][x]&&!res[q.y0][x]&&!blk[q.y0][x];if(ok){if(d===null)d=x}else if(d!==null){l.push({q,x0:d,n:x-d});d=null}}});return l};
  const poseAscenseur=(A,haut)=>{
    const pans=pansDeMur(A).filter(p=>p.n>=2).sort((a,b)=>(b.q===haut)-(a.q===haut)||b.n-a.n);
    for(const p of pans){
      const impair=p.n%2===1&&p.n<=5,w0=impair?3:2,X=p.x0+((p.n-w0)>>1);
      if(!libreLa(X,p.q.y0,w0,1))continue;
      const f=place('lift',X,p.q.y0,A);if(impair){f.w=3;f.dx=8;blk[p.q.y0][X+2]=f.id}
      if(areaOK(A))return f;
      unplace(f);
    }
  };
  // Un couloir ne s'arrête pas dans le vide : au bout, un escalier de service ou une sortie de secours
  const boutsCouloir=A=>{
    let n=0;
    A.rects.forEach(q=>{
      if(Math.min(q.x1-q.x0,q.y1-q.y0)+1>4||q.x1-q.x0<q.y1-q.y0)return;
      [[q.x0,-1],[q.x1,1]].forEach(([xe,s])=>{
        if(A.rects.some(o=>o!==q&&xe>=o.x0&&xe<=o.x1&&q.y0<=o.y1&&q.y1>=o.y0))return;
        for(let y=q.y0;y<=q.y1;y++)if(gate[y][xe+s])return;
        const X=s<0?q.x0:q.x1-1;
        if(t[q.y0-1][X]!==2||t[q.y0-1][X+1]!==2||!libreLa(X,q.y0,2,1))return;
        const f=place(c.lv===8||c.lv===1?'escalier':(n+c.lv)%2?'secours':'escalier',X,q.y0,A);
        if(areaOK(A))n++;else unplace(f);
      });
    });
  };
  // Couloirs : meubles répartis régulièrement, l'ascenseur au milieu de son mur
  const poseCirc=A=>{
    if(/entrée|hall/i.test(A.name))poseEntree(A);
    const list=(A.rec.cw||[]).filter(n=>n!=='lift'),haut=A.rects.reduce((m,q)=>q.y0<m.y0?q:m),long=A.rects.reduce((m,q)=>q.x1-q.x0>m.x1-m.x0?q:m);
    if((A.rec.cw||[]).includes('lift'))poseAscenseur(A,haut);
    boutsCouloir(A);
    const W0=long.x1-long.x0+1;
    list.forEach((name,i)=>{
      const fw=FP[name][0];let X=long.x0+Math.floor((i+.5)*W0/list.length);
      for(let k=0;k<W0&&X+k+fw-1<=long.x1;k++){
        const x=X+k;let ok=libreLa(x,long.y0,fw,1);for(let q=0;q<fw;q++)if(t[long.y0-1][x+q]!==2)ok=false;
        if(!ok)continue;
        const f=place(name,x,long.y0,A);if(areaOK(A))break;unplace(f);
      }
    });
  };
  const miroir=(p,gw)=>p.map(([n,dx,dy])=>[n.replace(/[LR]$/,m=>m==='L'?'R':'L'),gw-dx-FP[n][0],dy]);
  const boite=p=>{
    const x0=Math.min(...p.map(q=>q[1])),y0=Math.min(...p.map(q=>q[2])),x1=Math.max(...p.map(q=>q[1]+FP[q[0]][0])),y1=Math.max(...p.map(q=>q[2]+FP[q[0]][1]));
    return{x0,y0,w:x1-x0,h:y1-y0};
  };
  const poseBloc=(A,p,ox,oy,serre,rug)=>{
    const b=boite(p),v=int(r,1e6);
    for(const[n,dx,dy]of p){
      const[fw,fh]=FP[n],X=ox+dx,Y=oy+dy;
      if(X<A.x0||X+fw-1>A.x1||Y<A.y0+1&&!serre||Y<A.y0||Y+fh-1>A.y1||!libreLa(X,Y,fw,fh)||!dans(A,X,Y)||!dans(A,X+fw-1,Y+fh-1))return false;
    }
    if(!serre)for(let y=oy+b.y0-1;y<=oy+b.y0+b.h;y++)for(let x=ox+b.x0-1;x<=ox+b.x0+b.w;x++)if(y>=A.y0&&y<=A.y1&&x>=A.x0&&x<=A.x1&&blk[y][x])return false;
    const faits=p.map(([n,dx,dy])=>{const f=place(n,ox+dx,oy+dy,A);f.v=v;return f});
    if(!areaOK(A)){faits.forEach(unplace);return false}
    if(rug)A.tapis={x:Math.max(A.x0,ox+b.x0-1),y:Math.max(A.y0+1,oy+b.y0),x1:Math.min(A.x1,ox+b.x0+b.w),y1:Math.min(A.y1,oy+b.y0+b.h)};
    return true;
  };
  const poseGroupe=(A,g)=>{
    const W0=A.x1-A.x0+1,H0=A.y1-A.y0;
    if(g.at==='grille'){
      const b=boite(g.p),cols=Math.max(1,Math.floor((W0-1)/(b.w+2))),rows=Math.max(1,Math.floor((H0-1)/(b.h+1))),ox=A.x0+Math.max(1,(W0-cols*(b.w+2)+2)>>1);
      let n=0;
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        if(n>=g.n)return;
        const y=A.y1-(rows-j)*(b.h+1)+2;
        if(poseBloc(A,g.p,ox+i*(b.w+2)-b.x0,y-b.y0,false))n++;
      }
      return;
    }
    if(g.at.sous){
      const cibles=w.furn.filter(f=>f.room===A.i&&f.name===g.at.sous);
      (g.tous?cibles:cibles.slice(0,1)).forEach(f=>{
        for(let k=g.p.length;k>0;k--){
          const p=g.p.slice(0,k),b=boite(p),ox=f.x+((f.w-b.w)>>1)-b.x0,oy=f.y+f.h+(g.dy||0);
          // on reste au plus près du meuble visé, mais une porte peut obliger à glisser
          const essais=g.dy?[0,1,-1,2,-2,3,-3,4,-4,5,-5,6,-6].flatMap(d=>[[d,0],[d,-1]]):[[0,0]];
          if(essais.some(([ax,ay])=>poseBloc(A,p,ox+ax,oy+ay,!g.dy,g.rug)))break;
        }
      });
      return;
    }
    let at=g.at;
    if(A.flip)at={BG:'BD',BD:'BG',G:'D',D:'G'}[at]||at;
    for(let k=g.p.length;k>0;k--){
      let p=g.p.slice(0,k);const b0=boite(p);
      if(A.flip&&at!==g.at)p=miroir(p,b0.x0*2+b0.w);
      const b=boite(p),gx=W0-b.w,gy=H0-b.h;
      const bx=A.x0+(at==='BG'||at==='G'?0:at==='BD'||at==='D'?gx:gx>>1)-b.x0;
      const by=(at==='C'||at==='G'||at==='D'?A.y0+1+((gy+1)>>1):A.y1-b.h+1)-b.y0;
      for(const[ax,ay]of[[0,0],[1,0],[-1,0],[0,-1],[0,1],[2,0],[-2,0],[1,-1],[-1,-1],[3,0],[-3,0],[0,-2]]){
        if(poseBloc(A,p,bx+ax,by+ay,false,g.rug))return;
      }
    }
  };
  w.areas.forEach(A=>{
    A.flip=r()<.5;
    if(A.room){poseRun(A);(A.rec.g||[]).forEach(g=>poseGroupe(A,g));return}
    poseCirc(A);
    (L.ci||[]).forEach(n=>{if(A.y1-A.y0>=3)poseGroupe(A,CIRC[n])});
  });
  // Des objets propres à chaque lieu, contre un mur encore libre
  (DECO[c.lv]||[]).forEach(n=>{
    for(const A of shuffle(r,w.areas)){
      const q=A.rects[0],fw=FP[n][0];let fait=false;
      for(const x of shuffle(r,range(Math.max(1,q.x1-q.x0-fw+2)).map(i=>q.x0+i))){
        let m=true;for(let k=0;k<fw;k++)if(t[q.y0-1][x+k]!==2)m=false;
        if(!m||!libreLa(x,q.y0,fw,1))continue;
        const f=place(n,x,q.y0,A);if(areaOK(A)){fait=true;break}unplace(f);
      }
      if(fait)break;
    }
  });

  const used=new Set();
  const freeIn=a=>{const o=[];for(let y=a.y0;y<=a.y1;y++)for(let x=a.x0;x<=a.x1;x++)if(t[y][x]===1&&!blk[y][x]&&!res[y][x]&&!gate[y][x]&&!used.has(y*MW+x))o.push([x,y]);return o};
  const takeCell=a=>{const o=freeIn(a);if(!o.length)return null;const q=pick(r,o);used.add(q[1]*MW+q[0]);return q};
  const allOK=()=>w.areas.every(areaOK);
  const takeSolid=a=>{
    for(let i=0;i<30;i++){const q=takeCell(a);if(!q)return null;blk[q[1]][q[0]]=-2;solides.push(q);if(allOK())return q;solides.pop();blk[q[1]][q[0]]=0}
    return null;
  };
  const zoneOf=i=>{const A=w.rooms[i];return{x0:A.x0,x1:A.x1,y0:A.y0+1,y1:A.y1}};
  w.rooms.forEach(A=>{
    const cell=takeSolid({x0:A.x0,x1:A.x1,y0:A.y0,y1:A.y0})||takeSolid({x0:A.x0,x1:A.x0,y0:A.y0+1,y1:A.y1})||takeSolid({x0:A.x1,x1:A.x1,y0:A.y0+1,y1:A.y1})||takeSolid(zoneOf(A.i));
    w.obj.push({id:nid(),kind:'vitrine',x:cell[0],y:cell[1],w:1,h:1,room:A.i});
  });
  const crime=w.rooms[c.rc];
  // La trace du corps couvre deux carreaux : il lui faut deux cases libres côte à côte
  const paire=z=>{const l0=freeIn(z),s0=new Set(l0.map(([x,y])=>y*MW+x)),l=l0.filter(([x,y])=>s0.has(y*MW+x+1));if(!l.length)return null;const q=pick(r,l);used.add(q[1]*MW+q[0]);used.add(q[1]*MW+q[0]+1);return q};
  const body=paire({x0:crime.x0+2,x1:crime.x1-2,y0:crime.y0+2,y1:crime.y1})||paire(zoneOf(c.rc))||takeCell(zoneOf(c.rc));
  w.obj.push({id:nid(),kind:'corps',x:body[0],y:body[1],w:2,h:1,room:c.rc});
  w.spawn=takeCell({x0:Math.max(crime.x0,body[0]-3),x1:Math.min(crime.x1,body[0]+3),y0:Math.max(crime.y0+1,body[1]-2),y1:Math.min(crime.y1,body[1]+2)})||takeCell(zoneOf(c.rc));
  w.spawn={x:w.spawn[0],y:w.spawn[1]};
  const homes=shuffle(r,range(NR));
  c.suspects.forEach((s,i)=>{
    const ri=homes[i%NR],cell=takeSolid(zoneOf(ri))||takeSolid(zoneOf(homes[(i+1)%NR]));
    w.obj.push({id:nid(),kind:'suspect',s:i,x:cell[0],y:cell[1],w:1,h:1,room:ri});
  });
  // Tout meuble se fouille. Les cachettes sont les meubles à tiroirs, armoires, bibliothèques...
  // Tout se fouille, mais seuls quelques meubles cachent vraiment quelque chose
  const fou=w.furn.map(f=>({id:nid(),kind:'fouille',x:f.x,y:f.y,w:f.w,h:f.h,room:f.room,name:f.name,text:pick(r,FLAVOR[f.name.replace(/[BLR]$/,'')]||['Rien de particulier.'])}));
  const boxes=shuffle(r,fou.filter(o=>MG_BY[o.name]));
  const others=shuffle(r,fou.filter(o=>!MG_BY[o.name]&&!['lift','escalier','secours'].includes(o.name)));
  // On remplit toujours la pièce la moins chargée : rien ne s'entasse au même endroit
  const charge=o=>fou.filter(b=>b.room===o.room&&(b.loot||b.lock)).length;
  const meilleur=l=>{let m,v=1e9;for(const o of l){const q=charge(o)+r()*.6;if(q<v){v=q;m=o}}return m};
  const libres=()=>boxes.filter(o=>!o.loot&&!o.lock&&!o.ptype);
  const libre=()=>meilleur(libres());
  const libreDans=z=>meilleur(libres().filter(o=>z.has(o.room)));

  // Portes verrouillées : la clé se trouve toujours du côté déjà accessible
  const zone=(ouverts)=>{const z=new Set([c.rc]);let ch=true;while(ch){ch=false;doors.forEach(d=>{if(d.lock!==null&&!ouverts.has(d.lock))return;if(z.has(d.a)!==z.has(d.b)){z.add(d.a);z.add(d.b);ch=true}})}return z};
  const cand=shuffle(r,doors);let nb=0;
  for(const d of cand){
    if(nb>=D.lock)break;
    d.lock=nb;
    const z=zone(new Set());
    if(z.size<2||boxes.filter(o=>z.has(o.room)).length<4){d.lock=null;continue}
    nb++;
  }
  const faits=new Set();
  for(let i=0;i<nb;i++){
    const z=zone(faits),d=doors.find(q=>q.lock!==null&&!faits.has(q.lock)&&(z.has(q.a)||z.has(q.b)));
    const b=libreDans(z)||others.find(o=>!o.loot&&z.has(o.room));
    b.loot={t:'cle',i:d.lock};
    faits.add(d.lock);
  }
  // Énigmes d'objets : l'outil est dans une cachette ouverte, le document dans le meuble bloqué
  w.docs=makeDocs(c,r);
  const reste=shuffle(r,OBJETS.map(o=>o[0])),prendre=id=>{reste.splice(reste.indexOf(id),1);return id};
  const tags=shuffle(r,Object.keys(ENIGMES)),blocs=[];
  for(let i=0;i<D.eni;i++){
    const tag=tags[i%tags.length],E=ENIGMES[tag];
    const b=meilleur(libres().filter(o=>E.f.includes(o.name)));
    if(!b)continue;
    const dispo=reste.filter(id=>OBJ[id].tags.includes(tag));
    if(!dispo.length)continue;
    b.lock={tag};blocs.push(b);
    const s=libre();
    if(!s){b.lock=null;blocs.pop();continue}
    s.loot={t:'obj',id:prendre(pick(r,dispo))};
  }
  // Énigmes logiques posées sur le mobilier, à la place des anciens coffres
  const ptypes=shuffle(r,Object.keys(PTYPES));let pi=0;
  const pz=[];
  for(let i=0;i<D.pz;i++){
    const b=libre()||boxes.find(o=>!o.ptype&&!o.lock&&o.loot&&o.loot.t==='cle');
    if(!b)break;
    b.ptype=ptypes[pi++%ptypes.length];pz.push(b);
  }
  // Documents : d'abord dans les cachettes les mieux gardées
  const gardes=[...blocs,...pz.filter(o=>!o.loot)];
  range(w.docs.length).forEach(i=>{const b=gardes.find(o=>!o.loot)||meilleur([...libres(),...others.filter(o=>!o.loot)]);if(b)b.loot={t:'doc',i}});
  blocs.forEach(b=>{if(!b.loot)b.loot={t:'obj',id:prendre(pick(r,reste))}});
  pz.forEach(b=>{if(!b.loot)b.loot={t:'obj',id:prendre(pick(r,reste))}});
  for(let i=0;i<D.bonus;i++){const b=libre();if(b)b.loot={t:'obj',id:prendre(pick(r,reste))}}
  boxes.forEach(o=>{if(!o.lock&&!o.ptype)o.mg=MG_BY[o.name]});
  w.obj.push(...fou);
  w.entrees.forEach(q=>w.obj.push({id:nid(),kind:'entree',x:q.x,y:q.y,w:2,h:2}));
  w.collectTotal=w.obj.filter(o=>o.loot&&o.loot.t==='obj').length;

  const dehors=(x,y)=>{for(let j=y-1;j>=0;j--)if(t[j][x]===1)return false;return true};
  w.areas.forEach(A=>{
    A.rects.forEach(q=>{
      const y=q.y0-2;let n=0;
      const libreMur=(x,l)=>{for(let i=0;i<l;i++)if(!t[y]||t[y][x+i]!==2||t[y+1][x+i]!==2)return false;
        return !w.furn.some(f=>f.y===q.y0&&x+l>=f.x&&x<=f.x+f.w&&SH_HAUT.includes(f.name))&&!doors.some(d=>!d.v&&x+l>=d.x&&x<=d.x+2&&d.y+3===q.y0)&&!w.entrees.some(e=>e.y+2===q.y0&&x+l>=e.x&&x<=e.x+2)};
      for(let x=q.x0+1;x<q.x1-1;x+=A.room?4+int(r,3):6){
        if(!libreMur(x,2))continue;
        if(dehors(x,y)&&dehors(x+1,y)){w.windows.push({x,y});continue}
        if(n++%2)continue;
        const no=(w.tableaux.length+c.lv*3)%10,l=TAB_ETROITS.includes(no)?2:4;
        if(libreMur(x,l)){w.tableaux.push({x,y,n:no});if(l>2)x+=2}
      }
      w.lamps.push({x:(q.x0+q.x1)/2,y:(q.y0+q.y1)/2,warm:true});
    });
  });
  w.byId=Object.fromEntries(w.obj.map(o=>[o.id,o]));
  return w;
}
const solidCell=(w,x,y,open)=>{
  if(x<0||y<0||x>=w.mw||y>=w.mh||w.t[y][x]!==1||w.blk[y][x])return true;
  const g=w.gate[y][x];return !!g&&!open[g];
};
// Audit : on rejoue la progression d'un joueur, de la scène de crime jusqu'à la dernière cachette.
function auditWorld(w,c){
  const open={},cles=new Set(),tags=new Set(),errs=[],doorsAll=Object.values(w.doors),faites=new Set();
  doorsAll.forEach(d=>{if(d.lock===null)open[d.id]=1});
  const flood=()=>{
    const seen=new Set([w.spawn.y*w.mw+w.spawn.x]),st=[[w.spawn.x,w.spawn.y]];
    while(st.length){const[x,y]=st.pop();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b,k=Y*w.mw+X;
      if(seen.has(k)||solidCell(w,X,Y,open))continue;seen.add(k);st.push([X,Y])}}
    return seen;
  };
  const near=(o,seen)=>{for(let y=o.y-1;y<=o.y+o.h;y++)for(let x=o.x-1;x<=o.x+o.w;x++)if(seen.has(y*w.mw+x))return true;return false};
  let seen=flood();
  for(let n=0;n<30;n++){
    seen=flood();
    w.obj.forEach(o=>{
      if(o.kind!=='fouille'||faites.has(o.id)||!near(o,seen))return;
      if(o.lock&&!tags.has(o.lock.tag))return;
      faites.add(o.id);
      if(o.loot&&o.loot.t==='cle')cles.add(o.loot.i);
      if(o.loot&&o.loot.t==='obj')OBJ[o.loot.id].tags.forEach(t=>tags.add(t));
    });
    doorsAll.forEach(d=>{if(d.lock!==null&&cles.has(d.lock))open[d.id]=1});
  }
  seen=flood();
  w.obj.forEach(o=>{if(!near(o,seen))errs.push(`${o.kind} inaccessible ${o.x},${o.y}`);if(o.kind==='fouille'&&o.loot&&!faites.has(o.id))errs.push('cachette jamais ouverte '+o.name)});
  doorsAll.forEach(d=>{if(!open[d.id])errs.push('porte jamais ouverte')});
  if(new Set(w.obj.filter(o=>o.kind==='suspect').map(o=>o.s)).size!==c.n)errs.push('suspect manquant');
  if(w.rooms.some(R=>!w.obj.some(o=>o.kind==='vitrine'&&o.room===R.i)))errs.push('vitrine manquante');
  return errs;
}

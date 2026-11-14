// Comportement des personnages (utilisé par le jeu et par la page de labo).
// Chaque personnage a un caractère et des besoins qui montent avec le temps (fatigue, ennui, envie de parler,
// stress, soif, froid). Quand il a fini ce qu'il fait, il regarde ce que les lieux lui offrent — un fauteuil,
// la cheminée, une fenêtre, une bibliothèque, le bar, quelqu'un à qui parler — et choisit ce qui lui ferait
// le plus de bien, en tenant compte de la distance, de son caractère et de ce qu'il vient déjà de faire.
// Il y va par le plus court chemin, sans marcher sur les autres ni rester planté dans une porte.
const IA_TS=16;
const IA_ACTIONS={
  asseoir:{nom:"S'asseoir",besoin:'fatigue',duree:[700,1600],calme:{fatigue:-.0011,stress:-.0003},trait:{paresseux:.7}},
  rechauffer:{nom:'Se réchauffer',besoin:'froid',duree:[400,900],calme:{froid:-.0016,stress:-.0002}},
  fenetre:{nom:'Regarder dehors',besoin:'ennui',duree:[300,700],calme:{ennui:-.0012,stress:-.0006},trait:{nerveux:.3,curieux:.2}},
  lire:{nom:'Feuilleter un livre',besoin:'ennui',duree:[500,1100],calme:{ennui:-.0014},trait:{curieux:.6}},
  boire:{nom:'Se servir à boire',besoin:'soif',duree:[200,420],calme:{soif:-.004,stress:-.0004}},
  heure:{nom:"Vérifier l'heure",besoin:'stress',duree:[90,160],calme:{stress:-.0012},trait:{nerveux:.5}},
  tableau:{nom:'Regarder un tableau',besoin:'ennui',duree:[200,420],calme:{ennui:-.0016},trait:{curieux:.4}},
  piano:{nom:'Jouer du piano',besoin:'ennui',duree:[500,900],calme:{ennui:-.0018,stress:-.0008},trait:{sociable:.2}},
  discuter:{nom:'Discuter',besoin:'social',duree:[360,800],calme:{social:-.0016,ennui:-.0006},trait:{sociable:.8}},
  centpas:{nom:'Faire les cent pas',besoin:'stress',duree:[300,600],calme:{stress:-.0012},trait:{nerveux:.7}},
  ailleurs:{nom:'Changer de pièce',besoin:'ennui',duree:[1,1],calme:{ennui:-.15},trait:{curieux:.4}},
  attendre:{nom:'Attendre',besoin:null,duree:[120,300],calme:{}},
  lumiere:{nom:'Chercher la lumière',besoin:null,duree:[600,900],calme:{stress:-.0006}},
  eviter:{nom:"S'écarter",besoin:'stress',duree:[100,200],calme:{}},
  observer:{nom:'Observer',besoin:null,duree:[80,140],calme:{}}
};
const IA_BESOINS=['fatigue','ennui','social','stress','soif','froid'];
// Ce que chaque meuble permet de faire
const IA_MEUBLES={chair:'asseoir',chairB:'asseoir',chairL:'asseoir',chairR:'asseoir',armchair:'asseoir',armchairB:'asseoir',armchairL:'asseoir',armchairR:'asseoir',
  sofa:'asseoir',sofaB:'asseoir',stool:'asseoir',banquette:'asseoir',banc:'asseoir',bed:'asseoir',fireplace:'rechauffer',stove:'rechauffer',shelf:'lire',
  bar:'boire',counter:'boire',fridge:'boire',sink:'boire',fontaine:'boire',clock:'heure',piano:'piano'};
const IA_FACE={chair:0,chairB:2,chairL:3,chairR:1,armchair:0,armchairB:2,armchairL:3,armchairR:1,stool:0,sofa:0,sofaB:2,banquette:0,banc:0,bed:0};
const IA_LUMIERE=['lamp','fireplace','console','spot','vanity'];

function creerIA(W,opts={}){
  const MW=W.t[0].length,MH=W.t.length,rng=opts.rng||Math.random,O={vitesse:1,hasard:.35,noir:false,joueur:null,...opts};
  const enfer=n=>Math.max(0,Math.min(1,n));
  const ouverte=d=>d.lock===null||d.lock===undefined||(O.ouvertes&&O.ouvertes[d.id]);
  const aire=(x,y)=>W.areas.findIndex(A=>A.rects.some(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1));
  // une case est praticable : sol, pas de meuble ni de vitrine, porte ouverte
  const libre=(x,y)=>{if(x<0||y<0||x>=MW||y>=MH||W.t[y][x]!==1)return false;const g=W.gate[y][x];if(g){const d=W.doors[g];if(d&&!ouverte(d))return false}const b=W.blk[y][x];return!b};
  // cases à ne pas encombrer : les portes et juste devant
  const devantPorte=new Set();
  Object.values(W.doors).forEach(d=>{for(let a=0;a<d.h;a++)for(let b=0;b<d.w;b++)devantPorte.add((d.y+a)*MW+d.x+b);
    (d.v?[[d.x-1,d.y],[d.x-1,d.y+1],[d.x+1,d.y],[d.x+1,d.y+1]]:[[d.x,d.y-1],[d.x+1,d.y-1],[d.x,d.y+3],[d.x+1,d.y+3]]).forEach(([x,y])=>devantPorte.add(y*MW+x))});
  const posable=(x,y)=>libre(x,y)&&!devantPorte.has(y*MW+x);
  // ——— les endroits utiles : un par place assise, devant chaque meuble, sous chaque fenêtre et chaque tableau ———
  const spots=[];
  const prises=new Set(),ajoute=(type,x,y,dir,f,assise)=>{if(!assise&&!posable(x,y))return;if(prises.has(y*MW+x)&&type!=='lumiere')return;if(type!=='lumiere')prises.add(y*MW+x);spots.push({id:spots.length,type,x,y,dir,f,assise,aire:aire(assise?assise[0]:x,assise?assise[1]:y),pris:null})};
  const voisinLibre=(x,y)=>[[0,1],[1,0],[-1,0],[0,-1]].map(([a,b])=>[x+a,y+b]).find(([a,b])=>posable(a,b));
  [...W.furn].sort((p,q)=>(IA_MEUBLES[q.name]==='asseoir')-(IA_MEUBLES[p.name]==='asseoir')).forEach(f=>{
    const t=IA_MEUBLES[f.name];if(!t)return;
    if(t==='asseoir'&&O.sieges&&!O.sieges.includes(f.name))return;
    if(t==='asseoir'){
      const places=f.name==='bed'?[[f.x,f.y+f.h-1]]:range0(f.w).map(k=>[f.x+k,f.y]);
      places.forEach(([x,y])=>{const v=voisinLibre(x,y);if(v)ajoute('asseoir',v[0],v[1],IA_FACE[f.name]??0,f,[x,y])});
    }else for(let k=0;k<f.w;k++)ajoute(t,f.x+k,f.y+f.h,2,f);
  });
  (W.windows||[]).forEach(w=>{for(let k=0;k<2;k++)ajoute('fenetre',w.x+k,w.y+2,2)});
  (W.tableaux||[]).forEach(w=>ajoute('tableau',w.x+1,w.y+2,2));
  (W.windows||[]).forEach(w=>{for(let k=0;k<2;k++)for(let r=2;r<4;r++)if(posable(w.x+k,w.y+r))spots.push({id:spots.length,type:'lumiere',x:w.x+k,y:w.y+r,dir:2,aire:aire(w.x+k,w.y+r),pris:null,lune:true})});
  W.furn.filter(f=>IA_LUMIERE.includes(f.name)).forEach(f=>{let n=0;for(let r=1;r<=2&&n<4;r++)for(let dy=-r;dy<=r&&n<4;dy++)for(let dx=-r;dx<=r&&n<4;dx++){const x=f.x+dx+(f.w>>1),y=f.y+f.h-1+dy;if(Math.max(Math.abs(dx),Math.abs(dy))===r&&posable(x,y)&&!spots.some(q=>q.x===x&&q.y===y)){ajoute('lumiere',x,y,2,f);n++}}});
  function range0(n){return Array.from({length:n},(_,i)=>i)}

  // ——— les personnages ———
  const agents=(opts.personnages||[]).map((p,i)=>{
    const tr=p.traits||{},A={id:i,nom:p.nom||('Perso '+(i+1)),x:p.cx*IA_TS+8,y:p.cy*IA_TS+11,dir:0,maison:aire(p.cx,p.cy),
      traits:{sociable:tr.sociable??rng(),nerveux:tr.nerveux??rng(),curieux:tr.curieux??rng(),paresseux:tr.paresseux??rng(),peureux:tr.peureux??(rng()<.7?.8:.1)},
      coupable:!!p.coupable,gouts:p.gouts||{},evite:p.evite??-1,gele:false,besoins:Object.fromEntries(IA_BESOINS.map(b=>[b,rng()*.6])),action:null,chemin:null,attente:0,assis:false,bulle:null,
      vit:(.5+.18*(tr.nerveux??.5)-.14*(tr.paresseux??.5))*(.9+rng()*.2)*(p.vit||1),recents:[],stats:{},bloque:0,echecs:0,cell:[p.cx,p.cy]};
    return A;
  });
  const caseDe=a=>a.cell.slice();
  // ——— chemins : parcours en largeur sur la grille, les autres personnages comptent comme obstacles si besoin ———
  function bfs(dep,eviter){
    const D=new Int32Array(MW*MH).fill(-1),P=new Int32Array(MW*MH).fill(-1),f=[dep[1]*MW+dep[0]];D[f[0]]=0;
    for(let i=0;i<f.length;i++){const k=f[i],x=k%MW,y=(k/MW)|0;
      for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b,n=Y*MW+X;if(X<0||Y<0||X>=MW||Y>=MH||D[n]>=0||!libre(X,Y)||eviter&&eviter.has(n))continue;D[n]=D[k]+1;P[n]=k;f.push(n)}}
    return{D,P};
  }
  const cheminVers=(R,x,y)=>{let k=y*MW+x;if(R.D[k]<0)return null;const l=[];while(k>=0&&R.D[k]>0){l.push([k%MW,(k/MW)|0]);k=R.P[k]}return l.reverse()};
  const occupees=sauf=>{const s=new Set();agents.forEach(b=>{if(b===sauf)return;s.add(b.cell[1]*MW+b.cell[0]);if(b.chemin&&b.chemin[0])s.add(b.chemin[0][1]*MW+b.chemin[0][0]);if(b.action&&b.action.phase==='aller'&&b.chemin&&b.chemin.length){const f=b.chemin[b.chemin.length-1];s.add(f[1]*MW+f[0])}});return s};

  // ——— choisir quoi faire : une note pour chaque possibilité, un peu de hasard parmi les meilleures ———
  function choisir(a){
    const dep=caseDe(a),R=bfs(dep),cands=[],ici=aire(dep[0],dep[1]),Bs=a.besoins,T=a.traits;
    const proximite=d=>1/(1+d/7),nouveau=t=>a.recents.includes(t)?.45:1;
    const note=(type,base,d,extra=1)=>{const A=IA_ACTIONS[type];let m=1;for(const[k,v]of Object.entries(A.trait||{}))m+=v*(T[k]-.5)*2;return Math.max(0,base*m*proximite(d)*nouveau(type)*extra*(a.gouts[type]||1))};
    if(O.noir&&T.peureux>.5){
      spots.filter(s=>s.type==='lumiere'&&!s.pris&&R.D[s.y*MW+s.x]>=0).forEach(s=>cands.push({type:'lumiere',spot:s,n:3*proximite(R.D[s.y*MW+s.x])}));
    }
    spots.forEach(s=>{
      if(s.type==='lumiere'||s.pris!==null&&s.pris!==a.id)return;const d=R.D[s.y*MW+s.x];if(d<0)return;
      const A=IA_ACTIONS[s.type],dehors=(s.aire!==ici&&s.aire!==a.maison?.55:1)*(s.aire===a.evite?.3:1);
      if(O.noir&&s.type!=='asseoir')return;
      cands.push({type:s.type,spot:s,n:note(s.type,(A.besoin?Bs[A.besoin]:.1)+.05,d,dehors)});
    });
    if(!O.noir){
      // discuter avec quelqu'un de la même pièce qui a le temps
      agents.forEach(b=>{if(b===a||b.action&&!['attendre','fenetre','heure','tableau','asseoir','centpas'].includes(b.action.type))return;
        const[bx,by]=caseDe(b);if(aire(bx,by)!==ici||(!b.assis&&devantPorte.has(by*MW+bx))||b.action&&b.action.phase==='aller')return;const d=Math.abs(bx-dep[0])+Math.abs(by-dep[1]);if(d>14)return;
        cands.push({type:'discuter',avec:b,n:note('discuter',Bs.social*(.4+b.besoins.social),d)*(.6+b.traits.sociable*.8)})});
      // faire les cent pas, ou changer de pièce
      cands.push({type:'centpas',n:note('centpas',Bs.stress,0)});
      const autres=W.areas.map((A,i)=>i).filter(i=>i!==ici&&!(W.areas[i].etage));
      if(autres.length)cands.push({type:'ailleurs',n:note('ailleurs',Bs.ennui*.55,6),aire:autres[Math.floor(rng()*autres.length)]});
    }
    cands.push({type:'attendre',n:.12+(O.noir?.4:0)});
    // le hasard choisit parmi les quatre meilleures, plus ou moins selon le réglage
    cands.sort((p,q)=>q.n-p.n);const top=cands.slice(0,4),Tp=Math.max(.02,O.hasard*.6),w=top.map(c0=>Math.exp((c0.n-top[0].n)/Tp)),S=w.reduce((s,v)=>s+v,0);
    let r=rng()*S,ch=top[0];for(let i=0;i<top.length;i++){r-=w[i];if(r<=0){ch=top[i];break}}
    a.notes=top.map(c0=>[c0.type,+c0.n.toFixed(2)]);
    return lancer(a,ch,R);
  }
  function lancer(a,ch,R){
    const A=IA_ACTIONS[ch.type],duree=A.duree[0]+rng()*(A.duree[1]-A.duree[0]);
    let cible=null;
    if(ch.spot){cible=[ch.spot.x,ch.spot.y];ch.spot.pris=a.id}
    if(ch.type==='discuter'){const[bx,by]=caseDe(ch.avec);const v=[[0,1],[1,0],[-1,0],[0,-1]].map(([p,q])=>[bx+p,by+q]).filter(([x,y])=>posable(x,y)&&R.D[y*MW+x]>=0).sort((p,q)=>R.D[p[1]*MW+p[0]]-R.D[q[1]*MW+q[0]])[0];
      if(!v&&!(ch.avec.assis&&a.assis))return lancer(a,{type:'attendre'},R);cible=v||null;
      const b=ch.avec,siege=b.assis&&b.action?b.action.spot:null;if(!siege)finir(b,true);b.action={type:'discuter',avec:a,fin:Infinity,phase:'attend',spot:siege};b.chemin=null;if(!b.assis){b.x=b.cell[0]*IA_TS+8;b.y=b.cell[1]*IA_TS+11}a.partenaire=b}
    if(ch.type==='centpas'){const[x,y]=caseDe(a),l=[];for(let d=2;d<=5;d++)for(const[p,q]of[[d,0],[-d,0],[0,d],[0,-d]])if(posable(x+p,y+q)&&R.D[(y+q)*MW+x+p]>=0)l.push([x+p,y+q]);
      if(!l.length)return lancer(a,{type:'attendre'},R);const b=l[Math.floor(rng()*l.length)];a.allers=[[x,y],b];cible=b}
    if(ch.type==='ailleurs'){const Z=W.areas[ch.aire],l=[];Z.rects.forEach(q=>{for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++)if(posable(x,y)&&R.D[y*MW+x]>=0)l.push([x,y])});
      if(!l.length)return lancer(a,{type:'attendre'},R);cible=l[Math.floor(rng()*l.length)]}
    if(ch.type==='eviter'||ch.type==='observer')cible=ch.cible||null;
    if(cible){a.chemin=cheminVers(R,cible[0],cible[1]);if(!a.chemin){a.echecs++;if(ch.spot)ch.spot.pris=null;return lancer(a,{type:'attendre'},R)}}
    else{a.chemin=null;
      // personne n'attend dans une porte : on fait d'abord un pas de côté
      const[x,y]=caseDe(a);if(!a.assis&&devantPorte.has(y*MW+x)){let m=null;for(let k=0;k<MW*MH;k++)if(R.D[k]>0&&posable(k%MW,(k/MW)|0)&&(!m||R.D[k]<R.D[m]))m=k;if(m!==null)a.chemin=cheminVers(R,m%MW,(m/MW)|0)}}
    a.action={type:ch.type,spot:ch.spot||null,fin:duree,phase:a.chemin&&a.chemin.length?'aller':'faire',debut:0,avec:ch.avec,face:ch.face};
    a.recents=[ch.type,...a.recents].slice(0,3);a.attente=0;a.bloque=0;
    return a.action;
  }
  function finir(a,interrompu){
    const ac=a.action;if(!ac)return;
    if(ac.spot&&ac.spot.pris===a.id)ac.spot.pris=null;
    if(a.assis){const occ=occupees(a),[sx,sy]=a.cell,l=[ac.spot?[ac.spot.x,ac.spot.y]:null,[sx,sy+1],[sx-1,sy],[sx+1,sy],[sx,sy-1]].filter(q=>q&&posable(q[0],q[1])&&!occ.has(q[1]*MW+q[0]));
      if(!l.length&&!interrompu){ac.fin+=60;return}const q=l[0]||(ac.spot?[ac.spot.x,ac.spot.y]:[sx,sy+1]);a.x=q[0]*IA_TS+8;a.y=q[1]*IA_TS+11;a.cell=q;a.assis=false}
    if(ac.type==='discuter'&&ac.avec&&ac.avec.action&&ac.avec.action.avec===a&&!interrompu){const b=ac.avec;b.action=null;b.bulle=null}
    a.action=null;a.chemin=null;a.bulle=null;a.partenaire=null;
  }

  // ——— un pas de temps ———
  let tick=0;
  function pas(){
    tick++;
    const J=O.joueur;
    agents.forEach(a=>{
      if(a.gele)return; // quelqu'un lui parle ou s'approche : il attend
      // les besoins montent doucement, chacun selon son caractère
      const B=a.besoins,T=a.traits,assis=a.assis;
      B.fatigue=enfer(B.fatigue+(assis?0:.00009*(.6+T.paresseux)));B.ennui=enfer(B.ennui+.00011*(.6+T.curieux));
      B.social=enfer(B.social+.0001*(.3+T.sociable));B.soif=enfer(B.soif+.00006);B.froid=enfer(B.froid+(O.froid?.00012:.00004));
      B.stress=enfer(B.stress+.00003*(.4+T.nerveux)+(O.noir?.0004*T.peureux:0));
      // le joueur s'approche : le coupable se tend et s'écarte, le curieux regarde
      if(J){const d=Math.hypot(J.x-a.x,J.y-a.y);
        if(d<56){B.stress=enfer(B.stress+(a.coupable?.003:.0004));
          if(!a.assis&&(!a.action||!['eviter','observer','discuter'].includes(a.action.type))&&tick%20===a.id%20){
            const[x,y]=caseDe(a);finir(a,true);const R=bfs([x,y]);
            if(a.coupable||T.nerveux>.7){const l=[];for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const X=x+dx,Y=y+dy;if(posable(X,Y)&&R.D[Y*MW+X]>=0&&Math.hypot(X*IA_TS+8-J.x,Y*IA_TS+11-J.y)>d+30)l.push([X,Y])}
              if(l.length)lancer(a,{type:'eviter',cible:l[Math.floor(rng()*l.length)]},R)}
            else lancer(a,{type:'observer'},R);
          }}
        if(a.action&&a.action.type==='observer')a.dir=Math.abs(J.x-a.x)>Math.abs(J.y-a.y)?(J.x>a.x?1:3):(J.y>a.y?0:2);
      }
      if(O.noir&&T.peureux>.5&&a.noirVu!==O.noir){a.noirVu=O.noir;if(!a.action||a.action.type!=='lumiere')finir(a,true)}
      if(!O.noir)a.noirVu=false;
      if(!a.action){choisir(a);return}
      const ac=a.action;
      if(ac.phase==='attend'){if(ac.avec&&ac.avec.action&&ac.avec.action.avec===a&&ac.avec.action.phase==='faire'){ac.phase='faire';ac.fin=ac.avec.action.fin;ac.debut=0}
        else if(!ac.avec||!ac.avec.action||ac.avec.action.avec!==a){a.action=null}
        if(ac.avec)a.dir=dirVers(a,ac.avec);return}
      if(ac.phase==='aller'){
        const nx=a.chemin[0];if(!nx){ac.phase='faire';return}
        const occ=occupees(a);
        if(occ.has(nx[1]*MW+nx[0])){
          // quelqu'un barre le passage : on patiente, puis on contourne, sinon on renonce
          if(++a.attente>40){a.attente=0;const R=bfs(caseDe(a),occ),fin=a.chemin[a.chemin.length-1],p=cheminVers(R,fin[0],fin[1]);
            if(p&&p.length)a.chemin=p;else{
              const g=agents.find(b=>b!==a&&b.cell[0]===nx[0]&&b.cell[1]===nx[1]),face=g&&g.chemin&&g.chemin[0]&&g.chemin[0][0]===a.cell[0]&&g.chemin[0][1]===a.cell[1];
              const recul=[[1,0],[-1,0],[0,1],[0,-1]].map(([p2,q2])=>[a.cell[0]+p2,a.cell[1]+q2]).filter(([x,y])=>libre(x,y)&&!occ.has(y*MW+x)&&!(x===nx[0]&&y===nx[1]));
              if(face&&a.id<g.id&&recul.length){a.chemin=[recul[0],a.cell.slice(),...a.chemin];a.recule=(a.recule||0)+1}else{a.bloque++;a.echecs++;finir(a,true)}}}
          return;
        }
        a.attente=0;const tx=nx[0]*IA_TS+8,ty=nx[1]*IA_TS+11,dx=tx-a.x,dy=ty-a.y,d=Math.hypot(dx,dy),v=a.vit*O.vitesse;
        if(d<=v){a.x=tx;a.y=ty;a.cell=nx.slice();a.chemin.shift();if(!a.chemin.length){ac.phase='faire';arrive(a)}}
        else{a.x+=dx/d*v;a.y+=dy/d*v;a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2)}
        a.stats.marche=(a.stats.marche||0)+1;return;
      }
      // en train de faire : les besoins se calment, l'action finit à son heure
      ac.debut++;a.stats[ac.type]=(a.stats[ac.type]||0)+1;
      for(const[k,v]of Object.entries(IA_ACTIONS[ac.type].calme))B[k]=enfer(B[k]+v);
      if(ac.type==='centpas'&&ac.debut%90===0&&a.allers){const b=a.allers[(ac.debut/90)%2|0],R=bfs(caseDe(a)),p=cheminVers(R,b[0],b[1]);if(p&&p.length){a.chemin=p;ac.phase='aller'}}
      if(ac.type==='discuter'&&ac.avec){a.dir=dirVers(a,ac.avec);a.bulle=((ac.debut/120|0)+a.id)%2?'…':null}
      if(ac.debut>=ac.fin)finir(a);
    });
  }
  function arrive(a){
    const ac=a.action;
    if(ac.spot){a.dir=ac.spot.dir;if(ac.spot.assise){const[x,y]=ac.spot.assise;a.x=x*IA_TS+8;a.y=y*IA_TS+8;a.assis=true;a.cell=[x,y]}}
    if(ac.type==='discuter'&&ac.avec){const b=ac.avec;if(b.action&&b.action.avec===a){b.action.phase='faire';b.action.fin=ac.fin;b.action.debut=0}a.dir=dirVers(a,b);b.dir=dirVers(b,a)}
  }
  const dirVers=(a,b)=>{const dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2)};
  return{agents,spots,pas,options:O,get tick(){return tick},caseDe,aire,libre,devantPorte,MW,MH,IA_ACTIONS};
}
if(typeof module!=='undefined')module.exports={creerIA,IA_ACTIONS};

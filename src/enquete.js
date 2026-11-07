// Ce qui rend l'enquête plus vivante : visages, preuves montrées, déductions, note, indices, événements.
function visage(s,e){
  if(!e)return G.por[s];
  G.porE=G.porE||{};const cle=s+e;if(G.porE[cle])return G.porE[cle];
  const[k,g]=cv(96,96),cx=48,b='#1a1218';
  g.drawImage(G.por[s],0,0);
  [-1,1].forEach(q=>{
    for(let i=0;i<10;i++){const y=e==='colere'?41-i*.5:35.5+i*.4;R(g,b,cx+q*(4+i)-(q<0?1:0),Math.round(y),2,2)}
    if(e==='colere')dith(g,'#c83a30',cx+q*16-4,48,8,5,.42);
  });
  if(e==='inquiet'){R(g,'#8ac8f0',cx+24,29,3,6);R(g,'#8ac8f0',cx+25,27,1,2);R(g,'#e0f4ff',cx+24,30,1,3);R(g,'#8ac8f0',cx-27,34,2,4)}
  return G.porE[cle]=k;
}
// Le suspect réagit à ce qu'on lui met sous le nez
function montrer(o){
  const s=o.s,su=c.suspects[s];modal='dlg';
  bulle({at:{x:o.fx,y:o.fy},nom:`${su.prenom}, ${su.role}`,txt:'Qu\'est-ce que vous voulez me montrer ?',por:visage(s),btn:[...S.papiers.map(i=>({t:W.docs[i].t,f:()=>reagit(o,i)})),{t:'Rien, laissez',cl:'alt',f:()=>talk(o)}]});
}
function reagit(o,i){
  const d=W.docs[i],s=o.s,su=c.suspects[s],V=VOIX(s),e=V.nom==='nerveux'?'inquiet':undefined;
  if(d.s===s){if(S.rel[s]!==2){S.rel[s]=2;S.conf[s]=(S.conf[s]||0)+2}return talk(o,su.aveu,false,'inquiet')}
  if(d.s!==undefined)return talk(o,`Ça ? Ça regarde ${c.suspects[d.s].prenom}, pas moi. Allez lui poser la question.`);
  if(d.k==='autopsie')return talk(o,`Rangez ça, s'il vous plaît. Pauvre ${c.vName}.`,false,e);
  if(d.k==='registre')return talk(o,"Ces clés ? Je n'ai jamais eu à m'en occuper.",false,e);
  if(d.fact){const t=d.fact.s;return talk(o,t===s?"Oui, c'est bien de moi qu'il s'agit. Et alors ?":`Si c'est écrit, c'est que ${c.suspects[t].prenom} y était.`,false,t===s?e:undefined)}
  return talk(o,"Je ne vois pas le rapport avec moi.");
}
// ——— Tableau de déduction ———
function conflit(s,t,h){
  const a=c.stmts[s][h],b=c.stmts[t][h],av=a.with.includes(t),ba=b.with.includes(s);
  if(av!==ba)return true;
  if(av&&a.room!==b.room)return true;
  return a.room===b.room&&!av;
}
function pDeduc(){
  const sel=G.sel||[],col=HOURS.map((hh,h)=>{
    const l=[];
    c.suspects.forEach((su,s)=>{
      if(!S.asked[s+'-'+h])return;
      const st=c.stmts[s][h],k=s+'-'+h,avec=st.with.map(t=>c.suspects[t].prenom);if(st.vic)avec.push(c.vName);
      l.push(`<button class="tem ${sel.includes(k)?'sel':''}" data-a="tem" data-v="${k}"><b>${esc(su.prenom)}</b><span>${esc(c.set.rooms[st.room].n)}${avec.length?`, avec ${esc(liste(avec))}`:', seul'}</span></button>`);
    });
    if(c.locked&&c.locked.h===h&&S.seenRooms[c.locked.room]){const k='r-'+h;l.push(`<button class="tem reg ${sel.includes(k)?'sel':''}" data-a="tem" data-v="${k}"><b>Registre des clés</b><span>${esc(c.set.rooms[c.locked.room].n)} verrouillée</span></button>`)}
    return l.length?`<div class="tcol"><h3>${hh}</h3>${l.join('')}</div>`:'';
  }).join('');
  const li=(S.liens||[]).map(q=>`<li class="${q.c?'rouge':''}">${esc(q.t)}</li>`).join('');
  return`<h2>Déductions</h2><p class="main">Choisis deux témoignages de la même heure, puis compare-les. Deux versions qui se contredisent : au moins une est fausse.</p>${col?`<div class="deduc">${col}</div><div class="ligne"><button class="etiq fort" data-a="comparer" ${sel.length===2?'':'disabled'}>Comparer ces deux versions</button></div>`:`<p class="main">Interroge des suspects : leurs témoignages arrivent ici.</p>`}${li?`<h3>Mes conclusions</h3><ul class="liens">${li}</ul>`:''}`;
}
function choisirTem(k){
  let l=G.sel||[];const h=k.split('-')[1];
  if(l.includes(k))l=l.filter(q=>q!==k);else{l=l.filter(q=>q.split('-')[1]===h);l.push(k);if(l.length>2)l=l.slice(-2)}
  G.sel=l;ouvrir('deduc');
}
function comparer(){
  const[a,b]=G.sel,[p,h]=a.split('-'),[q]=b.split('-'),H=+h,cle=[a,b].sort().join('+');
  S.liens=S.liens||[];
  if(!S.liens.some(z=>z.k===cle)){
    const reg=p==='r'||q==='r',s=+(p==='r'?q:p),t=+q,nom=i=>c.suspects[i].prenom,cf=reg?c.stmts[s][H].room===c.locked.room:conflit(s,t,H);
    const tx=reg?(cf?`${nom(s)} dit avoir été dans une pièce verrouillée à ${HOURS[H]}. Impossible.`:`Le registre ne contredit pas ${nom(s)} à ${HOURS[H]}.`):(cf?`${nom(s)} et ${nom(t)} ne peuvent pas dire vrai tous les deux à ${HOURS[H]}.`:`${nom(s)} et ${nom(t)} peuvent dire vrai tous les deux à ${HOURS[H]}.`);
    S.liens.unshift({k:cle,c:cf,t:tx});if(cf)son('bon');
  }
  G.sel=[];save();ouvrir('deduc');
}
// ——— Note de fin d'enquête ———
function noteEnquete(ok){
  const min=(S.jeu||0)/3600,tot=W.obj.filter(o=>o.loot).length,tr=W.obj.filter(o=>o.loot&&S.open[o.id]).length,ai=S.aides||0,f=S.fin;
  let p=ok?70:0;
  if(ok){p+=Math.round(12*tr/Math.max(1,tot));if(f.arme===c.wpn)p+=8;if(f.heure===c.hc)p+=6;p+=min<8?6:min<15?3:0;p-=ai*8}
  return{l:!ok?'E':p>=90?'A':p>=75?'B':p>=60?'C':'D',p,min:Math.max(1,Math.round(min)),tr,tot,ai};
}
function pNote(){
  const n=S.fin&&S.fin.note;if(!n)return'';
  return`<div class="note-fin"><div class="lettre l-${n.l}">${n.l}</div><ul class="main"><li>${n.min} min d'enquête</li><li>${n.tr} cachette${n.tr>1?'s':''} trouvée${n.tr>1?'s':''} sur ${n.tot}</li><li>${n.ai?`${n.ai} indice${n.ai>1?'s':''} de Basile`:'Aucun indice demandé'}</li></ul></div>`;
}
// ——— Indices de Basile ———
function aideTexte(){
  S.aides=(S.aides||0)+1;save();
  const m=c.needed.find(i=>i.t==='s'?!S.asked[i.s+'-'+i.h]:!S.seenRooms[i.room]);
  if(m)return m.t==='s'?`Moi, je demanderais à ${c.suspects[m.s].prenom} où en était sa soirée à ${HOURS[m.h]}.`:`Allez voir le présentoir ${c.set.rooms[m.room].d}, il y a sûrement quelque chose à en tirer.`;
  return`Vous avez tout ce qu'il faut. Regardez ce que chacun dit de ${HOURS[c.hc]} : plusieurs versions ne tiennent pas ensemble.`;
}
// ——— Événements pendant l'enquête ———
function factoire(){
  const l=[];c.suspects.forEach((su,s)=>{if(!c.tueurs.includes(s))range(c.H).forEach(h=>{if(!S.asked[s+'-'+h]&&!c.stmts[s][h].vic)l.push([s,h])})});
  return l.length?l[Math.floor(Math.random()*l.length)]:null;
}
function evenements(){
  if(c.test||G.bot||G.robot||S.fin||!S.introDone)return;
  S.jeu=(S.jeu||0)+1;
  if(!S.ev){const r=RNG(S.seed*3+1),l=shuffle(r,['courant','temoin','lettre']);S.ev=[{t:7200,k:l[0]},{t:16200,k:l[1]}]}
  const e=S.ev[0];if(!e||S.jeu<e.t)return;
  S.ev.shift();lancerEvent(e.k);
}
function lancerEvent(k){
  const f=k==='courant'?null:factoire();
  if(k!=='courant'&&!f)return lancerEvent('courant');
  if(k==='courant'){G.noir=840;son('marteau');return say('Basile',"Le courant vient de sauter ! Ça devrait revenir très vite. En attendant, vous ne voyez que ce qui est tout près de vous.",null,G.porBa)}
  const su=c.suspects[f[0]],st=c.stmts[f[0]][f[1]],lieu=c.set.rooms[st.room].d,h=HOURS[f[1]];
  if(k==='temoin'){apprendre(f[0],f[1]);return say('Basile',`Un livreur vient de se présenter. Il a vu ${su.prenom} ${lieu} à ${h}. Je l'ai noté dans votre calepin.`,null,G.porBa)}
  const d={k:'carte',t:'Lettre anonyme',fact:{s:f[0],h:f[1]},p:{v:'Inspecteur',lieu:c.set.nom,txt:`${su.prenom} était ${lieu} à ${h}. Je l'ai vu${su.g==='f'?'e':''} de mes yeux.`}};
  W.docs.push(d);S.evDocs=S.evDocs||[];S.evDocs.push(d);const i=W.docs.length-1;
  modal='dlg';bulle({at:at0(),nom:'Basile',txt:"Quelqu'un vient de glisser une lettre sous la porte. Personne n'a rien vu.",por:G.porBa,btn:[{t:'Lire la lettre',f:()=>{closeAll();ouvrirDoc(i)}}]});
}
function noirDessine(px,py){
  if(!G.torche){const[k,g]=cv(180,180),q=g.createRadialGradient(90,90,16,90,90,88);q.addColorStop(0,'rgba(3,3,10,0)');q.addColorStop(1,'rgba(3,3,10,.97)');g.fillStyle=q;g.fillRect(0,0,180,180);G.torche=k}
  const x=Math.round(px-90),y=Math.round(py-90);ctx.fillStyle='rgba(3,3,10,.97)';
  ctx.fillRect(0,0,VW,Math.max(0,y));ctx.fillRect(0,y+180,VW,VH);ctx.fillRect(0,y,Math.max(0,x),180);ctx.fillRect(x+180,y,VW,180);ctx.drawImage(G.torche,x,y);
}
// ——— Orage derrière les fenêtres ———
function eclair(){G.eclair=16;if(typeof tonnerre==='function')setTimeout(tonnerre,400+Math.random()*1400)}
function fenetresVivantes(){
  const neige=c.lv===0||c.lv===4;
  if(O.pluie){ctx.fillStyle=neige?'rgba(240,244,255,.8)':'rgba(170,190,235,.55)';W.windows.forEach((w,i)=>{for(let k=0;k<6;k++){const x=w.x*TS+4+((k*9+i*5+(neige?tick>>4:0))%24),y=w.y*TS+6+(((k*5+(tick>>(neige?3:0)))%14));ctx.fillRect(x,y,1,neige?1:2)}})}
  if(G.eclair>0&&!neige){ctx.fillStyle=`rgba(232,238,255,${G.eclair%5<3?.75:.25})`;W.windows.forEach(w=>ctx.fillRect(w.x*TS+(c.lv===6?9:3),w.y*TS+(c.lv===6?7:5),c.lv===6?14:26,c.lv===6?14:16))}
}
// ——— Des suspects qui vivent : assis, en train de lire ou de boire ———
const DIR_SIEGE={chair:0,chairB:2,chairR:1,chairL:3,armchair:0,armchairB:2,armchairR:1,armchairL:3,stool:0};
function asseoir(){
  const pris=new Set();
  W.obj.forEach(o=>{
    if(o.kind!=='suspect'||o.s%2)return;
    const f=W.furn.find(q=>q.room===o.room&&q.name in DIR_SIEGE&&!pris.has(q.id)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!solidCell(W,q.x+a,q.y+b,{})));
    if(!f)return;
    pris.add(f.id);Object.assign(o,{x:f.x,y:f.y,fx:f.x*TS+8,fy:f.y*TS+8,assis:1,dir:DIR_SIEGE[f.name]});
  });
}
function gesteMaj(o){
  if(o.mv){o.geste=null;return}
  if(--o.gt>0)return;
  o.gt=240+Math.random()*420;
  o.geste=['lit','boit',null,'boit','lit'][Math.floor(Math.random()*5)];
}
function dessinePNJ(o){
  if(o.assis)ctx.drawImage(G.sheet[o.s],0,o.dir*30,20,23,Math.round(o.fx-10),Math.round(o.fy-27+Math.sin(tick*.05+o.s)*.5),20,23);
  else{shadow(o.fx,o.fy,12);drawChar2(G.sheet[o.s],o.fx,o.fy+(o.mv?0:Math.sin(tick*.06+o.s)*.5),o.dir,o.mv?(tick>>4)&3:0)}
  if(!o.geste||o.dir!==0)return;
  const x=Math.round(o.fx),y=Math.round(o.fy-(o.assis?4:0));
  if(o.geste==='lit'){ctx.fillStyle='#7a2f35';ctx.fillRect(x-5,y-13,10,6);ctx.fillStyle='#ece4d0';ctx.fillRect(x-4,y-12,4,4);ctx.fillRect(x+1,y-12,3,4);ctx.fillStyle='#8a8fa8';ctx.fillRect(x-3,y-11,2,1);ctx.fillRect(x+2,y-10,1,1)}
  if(o.geste==='boit'){const l=(tick>>5)%6===0?7:0;ctx.fillStyle='#f4efe2';ctx.fillRect(x+3,y-12-l,4,4);ctx.fillRect(x+7,y-11-l,1,2);ctx.fillStyle='#3a2212';ctx.fillRect(x+3,y-12-l,4,1)}
}

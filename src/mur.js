// Le mur d'enquête : photos et papiers à épingler, fils rouges à tendre, et la chronologie de la nuit.
const ETIQ_FIL=['?','Alibi','Mobile','Complice','Ment'];
function liegeURL(){
  if(G.url.liege)return G.url.liege;
  const[k,g]=cv(96,96);
  for(let y=0;y<96;y++)for(let x=0;x<96;x++){const n=noise(x,y,6);R(g,n>.95?'#d8b888':n<.08?'#7a5430':tone('#a87e4c',(noise(x>>1,y>>1,5)-.5)*.22),x,y)}
  return G.url.liege=k.toDataURL();
}
function murIcone(){
  const[k,g]=cv(34,26);box(g,0,0,34,26,'#5b3820');
  for(let y=2;y<24;y++)for(let x=2;x<32;x++)R(g,tone('#a87e4c',(noise(x,y,6)-.5)*.3),x,y);
  [[5,5,'#ece6da'],[20,4,'#f4ecd8'],[12,14,'#ece6da']].forEach(([x,y,c0])=>{R(g,c0,x,y,9,8);R(g,'#3a4a6a',x+1,y+1,7,4)});
  [[[9,5],[24,4]],[[24,4],[16,14]]].forEach(([a,b])=>{const n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));for(let i=0;i<=n;i++)R(g,'#d8302a',Math.round(a[0]+(b[0]-a[0])*i/n),Math.round(a[1]+(b[1]-a[1])*i/n))});
  [[9,5],[24,4],[16,14]].forEach(([x,y])=>R(g,'#ff5a4a',x-1,y-1,3,3));
  return outlineSprite(k).toDataURL();
}
function cartesMur(){
  return[{id:'v',ty:'vic',t:c.vName,s:c.vrole,img:G.url.porV||(G.url.porV=G.porV.toDataURL())},
   ...c.suspects.map((su,i)=>({id:'p'+i,ty:'pho',t:su.prenom,s:su.role,img:imgURL('p'+i)})),
   ...S.papiers.map(i=>({id:'d'+i,ty:'doc',t:W.docs[i].t,lire:i})),
   ...S.cards.filter(q=>q.k==='trace').map((q,i)=>({id:'t'+i,ty:'note',t:q.t,s:q.x}))];
}
function posCarte(q){
  const m=S.mur.pos,etroit=innerWidth<640;if(m[q.id])return m[q.id];
  if(q.id==='v')return m.v={x:etroit?38:44,y:etroit?38:36};
  if(q.ty==='pho'){const i=+q.id.slice(1);return m[q.id]=etroit?{x:3+(i%3)*32,y:2+((i/3)|0)*17}:{x:2+i*(96/c.n),y:3}}
  const n=Object.keys(m).filter(k=>k[0]==='d'||k[0]==='t').length;
  return m[q.id]=etroit?{x:3+(n%4)*24,y:66+((n>>2)&1)*14}:{x:2+(n%7)*13.8,y:66+(n>>3&1)*16-(n%3)*2};
}
function ouvrirMur(t){
  if(modal==='cut')return;
  S.mur=S.mur||{pos:{},liens:[],hyp:{},tab:'mur'};if(t)S.mur.tab=t;
  $('bulle').hidden=true;$('carnet').hidden=true;modal='mur';son('page');rendMur();
}
function pChrono(){
  const hyp=S.mur.hyp,sel=G.sel||[],cf=(S.liens||[]).filter(l=>l.c&&l.p),faux=new Set(cf.flatMap(l=>[...l.p.map(p=>p+'-'+l.h),...(l.p.length===1?['r-'+l.h]:[])]));
  const reste=cf.filter(l=>!l.p.some(p=>hyp[p])).length,nh=Object.values(hyp).filter(Boolean).length;
  const msg=!cf.length?"Clique deux témoignages de la même heure pour les comparer.":!nh?`${cf.length} contradiction${cf.length>1?'s':''} trouvée${cf.length>1?'s':''}. Clique sur un nom pour supposer que cette personne ment.`:reste?`Avec ces menteurs, il reste ${reste} contradiction${reste>1?'s':''}.`:"Cette hypothèse explique toutes les contradictions trouvées.";
  const tete=HOURS.map((h,i)=>`<th class="${c.win.includes(i)?'crime':''}">${h}</th>`).join('');
  const lignes=c.suspects.map((su,s)=>`<tr class="${hyp[s]?'hyp':''}"><th><button class="nomh" data-a="hyp" data-v="${s}" aria-pressed="${!!hyp[s]}"><img alt="" src="${imgURL('p'+s)}"><span>${esc(su.prenom)}</span>${hyp[s]?'<i>Ment ?</i>':''}</button></th>${HOURS.map((_,h)=>{
    const k=s+'-'+h,cl=c.win.includes(h)?'crime':'';
    if(!S.asked[k])return`<td class="${cl}"><span class="vide">?</span></td>`;
    const st=c.stmts[s][h],a=st.with.map(t=>c.suspects[t].prenom);if(st.vic)a.push(c.vName);
    return`<td class="${cl}"><button class="jet ${sel.includes(k)?'sel':''} ${faux.has(k)?'faux':''}" data-a="tem" data-v="${k}"><b>${esc(c.set.rooms[st.room].n)}</b><small>${a.length?'avec '+esc(liste(a)):(su.g==='f'?'seule':'seul')}</small></button></td>`;
  }).join('')}</tr>`).join('');
  const L=c.locked,reg=L&&S.seenRooms[L.room]?`<tr class="reg"><th><span class="nomh"><span>Registre des clés</span></span></th>${HOURS.map((_,h)=>{
    const k='r-'+h,cl=c.win.includes(h)?'crime':'';
    return`<td class="${cl}">${h===L.h?`<button class="jet ${sel.includes(k)?'sel':''} ${faux.has(k)?'faux':''}" data-a="tem" data-v="${k}"><b>${esc(c.set.rooms[L.room].n)}</b><small>verrouillée</small></button>`:''}</td>`;
  }).join('')}</tr>`:'';
  return`<p class="m-msg ${reste===0&&nh&&cf.length?'bon':''}">${esc(msg)}</p><div class="chrono-w"><table class="chrono"><thead><tr><th></th>${tete}</tr></thead><tbody>${lignes}${reg}</tbody></table></div>`;
}
function rendMur(){
  const e=$('mur-v'),M=S.mur;e.hidden=false;
  const tete=`<div class="m-tete"><div class="m-ong" role="tablist"><button role="tab" aria-selected="${M.tab==='mur'}" data-a="murtab" data-v="mur">Le mur</button><button role="tab" aria-selected="${M.tab==='chrono'}" data-a="murtab" data-v="chrono">La chronologie</button></div><button class="croix claire" data-a="fermer" aria-label="Fermer le mur">${croix}</button></div>`;
  if(M.tab==='chrono'){e.innerHTML=tete+`<div class="m-chrono" style="background-image:url(${liegeURL()})">${pChrono()}</div>`;return}
  const cartes=cartesMur().map(q=>{const p=posCarte(q);return`<div class="carte-m c-${q.ty} ${M.sel===q.id?'sel':''}" data-id="${q.id}" style="left:${p.x}%;top:${p.y}%"><i class="epingle"></i>${q.img?`<img alt="" draggable="false" src="${q.img}">`:''}<b>${esc(q.t)}</b>${q.s?`<small>${esc(q.s)}</small>`:''}${q.lire!==undefined?`<button class="m-lire" data-a="lire" data-v="${q.lire}">Lire</button>`:''}</div>`}).join('');
  e.innerHTML=tete+`<div class="planche-m" id="pl-m" style="background-image:url(${liegeURL()})"><svg id="fils" aria-hidden="true"></svg>${cartes}${M.liens.map((l,i)=>`<button class="fil-l" data-a="fil" data-v="${i}">${esc(ETIQ_FIL[l.e])}</button>`).join('')}</div><p class="m-aide">Glisse les cartes où tu veux. Clique deux cartes pour tendre un fil rouge, clique l'étiquette du fil pour la changer.</p>`;
  branchePlanche();tracerFils();
}
function tracerFils(){
  const pl=$('pl-m'),sv=$('fils');if(!pl||!sv)return;
  const r=pl.getBoundingClientRect(),m={};
  pl.querySelectorAll('.carte-m').forEach(k=>{const q=k.getBoundingClientRect();m[k.dataset.id]=[q.left-r.left+q.width/2,q.top-r.top+6]});
  const et=[...pl.querySelectorAll('.fil-l')];let h='';
  S.mur.liens.forEach((l,i)=>{
    const a=m[l.a],b=m[l.b];if(!a||!b){if(et[i])et[i].hidden=true;return}
    const cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2+26;
    h+=`<path d="M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}" fill="none" stroke="rgba(40,20,10,.35)" stroke-width="3" transform="translate(2 3)"/><path d="M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}" fill="none" stroke="#d8302a" stroke-width="2.5"/>`;
    if(et[i]){et[i].style.left=(cx)+'px';et[i].style.top=((a[1]+b[1])/2+13)+'px'}
  });
  sv.innerHTML=h;
}
function branchePlanche(){
  const pl=$('pl-m');let g=null;
  pl.addEventListener('pointerdown',e=>{
    if(e.target.closest('button'))return;
    const k=e.target.closest('.carte-m');if(!k)return;
    const r=pl.getBoundingClientRect(),q=k.getBoundingClientRect();
    g={k,id:k.dataset.id,dx:e.clientX-q.left,dy:e.clientY-q.top,r,x0:e.clientX,y0:e.clientY,mv:0};
    try{pl.setPointerCapture(e.pointerId)}catch(_){}
    k.classList.add('prise');
  });
  pl.addEventListener('pointermove',e=>{
    if(!g)return;
    g.mv=Math.max(g.mv,Math.hypot(e.clientX-g.x0,e.clientY-g.y0));if(g.mv<5)return;
    const q=g.k.getBoundingClientRect(),x=Math.max(0,Math.min(100-q.width/g.r.width*100,(e.clientX-g.dx-g.r.left)/g.r.width*100)),y=Math.max(0,Math.min(100-q.height/g.r.height*100,(e.clientY-g.dy-g.r.top)/g.r.height*100));
    g.k.style.left=x+'%';g.k.style.top=y+'%';S.mur.pos[g.id]={x,y};tracerFils();
  });
  pl.addEventListener('pointerup',()=>{
    if(!g)return;
    const id=g.id,clic=g.mv<5;g.k.classList.remove('prise');g=null;
    if(!clic)return save();
    const M=S.mur;
    if(M.sel===id)M.sel=null;
    else if(M.sel){if(!M.liens.some(l=>(l.a===M.sel&&l.b===id)||(l.b===M.sel&&l.a===id)))M.liens.push({a:M.sel,b:id,e:0});M.sel=null;son('page')}
    else M.sel=id;
    save();rendMur();
  });
}
function filSuivant(i){const l=S.mur.liens[i];if(++l.e>=ETIQ_FIL.length)S.mur.liens.splice(i,1);save();rendMur()}
addEventListener('resize',()=>{if(modal==='mur'&&S.mur.tab==='mur')tracerFils()});

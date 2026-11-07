// Trois mini-jeux de plus : comparer des écritures, relever une empreinte, recoller une lettre déchirée.
const ECRITS=[{f:'var(--main)',k:-14,l:'.05em',w:400,c:'#2a3a6a'},{f:'var(--main)',k:9,l:'0',w:400,c:'#1a1a2a'},{f:'Georgia,serif',k:-8,l:'.1em',w:400,c:'#3a2a4a'},{f:"'Courier New',monospace",k:-2,l:'-.02em',w:700,c:'#2a2a2a'}];
const EMPREINTES=['tourbillon','boucle','arc'];
function empreinteImg(ty,s){
  const[k,g]=cv(64,84);
  for(let y=0;y<84;y++)for(let x=0;x<64;x++){
    const nx=(x-32)/28,ny=(y-42)/38;if(nx*nx+ny*ny>1)continue;
    const d=ty===0?Math.hypot(nx,ny*1.1)*9:ty===1?Math.hypot(nx*(1+ny*.5)+.25,ny+.4)*8+ny*2:(ny+.42*Math.cos(nx*2.3))*9;
    if(Math.sin((d+noise(x>>3,y>>3,s)*.8)*6.28)>.1)R(g,'#2a2a3a',x,y);
  }
  return k;
}
function miniPlus(type,shell,done){
  if(type==='ecriture'){
    const st=shuffle(Math.random,ECRITS),tg=int(Math.random,4),vu={},ph=shuffle(Math.random,['Ne parlez à personne.','Apportez le dossier.','Je sais tout.','Venez seul ce soir.']);
    const ecrit=(t,s)=>`<span class="ecrit" style="font-family:${s.f};transform:skewX(${s.k}deg);letter-spacing:${s.l};color:${s.c};font-weight:${s.w}">${t}</span>`;
    const dessin=t=>shell(t,`<div class="ecrits"><div class="modele"><b>Lettre anonyme</b>${ecrit('Vous paierez pour ce que vous avez fait.',st[tg])}</div><div class="quatre">${st.map((s,i)=>`<button data-k="${i}" class="${vu[i]?'vu':''}" aria-label="Note ${i+1}"><b>Note ${i+1}</b>${ecrit(ph[i],s)}</button>`).join('')}</div></div>`);
    dessin("Ces quatre notes traînaient dans le tiroir. Laquelle a la même écriture que la lettre anonyme ?");
    G.mini=b=>{const i=+b.dataset.k;if(i===tg)return done();vu[i]=1;dessin("Non, cette écriture ne penche pas pareil.")};
    return true;
  }
  if(type==='empreinte'){
    const tg=int(Math.random,3),s0=2+int(Math.random,80),base=empreinteImg(tg,s0);
    shell("Passe le pinceau à poudre sur le verre pour faire apparaître l'empreinte.",'<canvas id="mg-c" class="cendres" width="320" height="200"></canvas>');
    const k=$('mg-c'),g=k.getContext('2d'),vx=116,vy=26,vw=88,vh=132,[d,h]=cv(320,200),vus=new Set();
    g.imageSmoothingEnabled=false;h.imageSmoothingEnabled=false;
    R(g,'rgba(214,232,242,.5)',vx-14,vy-12,vw+28,vh+24);R(g,'#ffffff',vx-14,vy-12,vw+28,1);R(g,'rgba(255,255,255,.6)',vx-8,vy-8,3,vh+10);R(g,'#8a9aa8',vx-14,vy+vh+11,vw+28,2);
    h.drawImage(base,vx,vy,vw,vh);
    const fiches=()=>{
      const ordre=shuffle(Math.random,[0,1,2]),u=base.toDataURL(),im=ordre.map(i=>empreinteImg(i,(s0+13+i)%90).toDataURL());
      const dessin=t=>shell(t,`<div class="emp"><div><b>Relevée sur le verre</b><img alt="Empreinte relevée" src="${u}"></div><div class="fiches">${ordre.map((n,i)=>`<button data-k="${n}" aria-label="Fiche ${'ABC'[i]}"><b>Fiche ${'ABC'[i]}</b><img alt="" src="${im[i]}"></button>`).join('')}</div></div>`);
      dessin("L'empreinte est nette. Trouve la fiche qui a le même dessin de lignes.");
      G.mini=b=>{if(+b.dataset.k===tg)return done();dessin("Non, le dessin des lignes ne correspond pas.")};
    };
    let on=false;
    const rub=e=>{
      const r=k.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*320|0,y=(e.clientY-r.top)/r.height*200|0;
      g.save();g.beginPath();g.rect(x-13,y-13,26,26);g.clip();g.drawImage(d,0,0);g.restore();
      R(g,'rgba(60,60,70,.05)',x-13,y-13,26,26);
      for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const X=(x+a*6-vx)>>3,Y=(y+b*6-vy)>>3;if(X>=0&&Y>=0&&X<11&&Y<17)vus.add(Y*11+X)}
      if(vus.size>11*17*.68){on=false;fiches()}
    };
    k.addEventListener('pointerdown',e=>{on=true;rub(e)});k.addEventListener('pointermove',e=>{if(on||e.pointerType==='mouse')rub(e)});k.addEventListener('pointerup',()=>{on=false});
    return true;
  }
  if(type==='dechiree'){
    shell("Une lettre déchirée. Fais glisser les morceaux pour la reconstituer.",'<canvas id="mg-c" class="cendres" width="320" height="200"></canvas>');
    const k=$('mg-c'),g=k.getContext('2d'),LW=168,LH=112,[L,lg]=cv(LW,LH),ox=76,oy=44;
    g.imageSmoothingEnabled=false;papierFond(lg,LW,LH,'#efe2bf',3);lg.fillStyle='#2a3a6a';lg.font='17px "Patrick Hand",sans-serif';
    ['Ce soir, 22 h, derrière la serre.','Viens seul et ne dis rien.','Brûle ce papier après lecture.'].forEach((t,i)=>lg.fillText(t,10,28+i*28));
    const px=lg.getImageData(0,0,LW,LH),part=(x,y)=>[Math.min(2,Math.max(0,Math.floor((x+Math.sin(y*.4)*3)/56))),Math.min(1,Math.max(0,Math.floor((y+Math.sin(x*.5)*3)/56)))],mor=[];
    for(let cy=0;cy<2;cy++)for(let cx=0;cx<3;cx++){
      const[p,q]=cv(LW,LH),d=q.createImageData(LW,LH);
      for(let y=0;y<LH;y++)for(let x=0;x<LW;x++){const[a,b]=part(x,y);if(a===cx&&b===cy){const i=(y*LW+x)*4;for(let n=0;n<4;n++)d.data[i+n]=px.data[i+n]}}
      q.putImageData(d,0,0);outlineSprite(p,'#6a5a48');
      mor.push({sp:p,cx,cy,x:6+int(Math.random,250)-cx*56,y:6+int(Math.random,130)-cy*56,m:d.data});
    }
    const paint=()=>{if(!$('mg-c'))return;g.clearRect(0,0,320,200);R(g,'rgba(255,255,255,.1)',ox,oy,LW,LH);mor.filter(q=>q.ok).forEach(q=>g.drawImage(q.sp,q.x,q.y));mor.filter(q=>!q.ok).forEach(q=>g.drawImage(q.sp,Math.round(q.x),Math.round(q.y)))};paint();
    let prise=null,mx=0,my=0;
    const pos=e=>{const r=k.getBoundingClientRect();return[(e.clientX-r.left)/r.width*320,(e.clientY-r.top)/r.height*200]};
    k.addEventListener('pointerdown',e=>{
      const[x,y]=pos(e);try{k.setPointerCapture(e.pointerId)}catch(_){}
      for(let i=mor.length-1;i>=0;i--){const q=mor[i],X=Math.floor(x-q.x),Y=Math.floor(y-q.y);if(!q.ok&&X>=0&&Y>=0&&X<LW&&Y<LH&&q.m[(Y*LW+X)*4+3]){prise=q;mx=x-q.x;my=y-q.y;mor.splice(i,1);mor.push(q);break}}
    });
    k.addEventListener('pointermove',e=>{if(!prise)return;const[x,y]=pos(e);prise.x=x-mx;prise.y=y-my;paint()});
    k.addEventListener('pointerup',()=>{
      if(!prise)return;
      if(Math.abs(prise.x-ox)<11&&Math.abs(prise.y-oy)<11){prise.x=ox;prise.y=oy;prise.ok=1;son('page')}
      prise=null;paint();
      if(mor.every(q=>q.ok))setTimeout(done,500);
    });
    return true;
  }
  return false;
}

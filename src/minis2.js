// Cinq mini-jeux de plus : défaire un lit, soulever des coussins, remettre une horloge à l'heure,
// déplacer un pot sans le renverser, rejouer une mélodie au piano.
function toile(shell,txt){
  shell(txt,'<canvas id="mg-c" class="cendres" width="320" height="200" style="touch-action:none"></canvas>');
  const k=$('mg-c'),g=k.getContext('2d');g.imageSmoothingEnabled=false;
  const pos=e=>{const r=k.getBoundingClientRect();return[(e.clientX-r.left)/r.width*320,(e.clientY-r.top)/r.height*200]};
  return{k,g,pos};
}
const dire=t=>{const e=$('mg-t');if(e)e.textContent=t};
const parquet=g=>{for(let y=0;y<200;y++)for(let x=0;x<320;x+=4)R(g,tone('#5b3820',((x/40|0)+(y>>4))%2?.04:-.04+(noise(x>>3,y,2)-.5)*.1),x,y,4,1)};
const recouvre=(a,b)=>{const w=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),h=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);return w>0&&h>0?w*h/(a.w*a.h):0};
function miniNeuf(type,shell,done,spr,o){
  let fini=false;
  const gagne=t=>{if(fini)return;fini=true;dire(t||'Trouvé !');son('bon');setTimeout(()=>{if(G.mini||G.pzT)done()},520)};
  if(type==='couches'){
    const{k,g,pos}=toile(shell,"Quelque chose a été glissé dans ce lit. Fais glisser les oreillers et les draps pour les tirer.");
    const col=['#c43a3a','#2f4a3a','#22345a','#7a1a2a','#5a2a6a','#4a6a8a'][int(Math.random,6)];
    const L=[{n:'drap',x:70,y:60,w:180,h:124,c:'#f4ecd8'},{n:'couverture',x:64,y:84,w:192,h:104,c:col},{n:'oreiller',x:80,y:24,w:76,h:34,c:'#fffaf0'},{n:'oreiller',x:164,y:24,w:76,h:34,c:'#fffaf0'}];
    L.forEach(l=>Object.assign(l,{dx:0,dy:0,vx:0,vy:0,parti:false}));
    const ci=[0,2,3][int(Math.random,3)],ob=ci===0?{x:120+int(Math.random,60),y:110,w:44,h:44}:{x:L[ci].x+16,y:L[ci].y-4,w:44,h:44};
    const rect=l=>({x:l.x+l.dx,y:l.y+l.dy,w:l.w,h:l.h});
    const couche=l=>{const q=rect(l);
      if(l.n==='oreiller'){R(g,tone(l.c,-.3),q.x+2,q.y+3,q.w,q.h);R(g,l.c,q.x,q.y,q.w,q.h);R(g,tone(l.c,.4),q.x+4,q.y+3,q.w-14,6);R(g,tone(l.c,-.14),q.x+3,q.y+q.h-7,q.w-6,3);return}
      R(g,'rgba(20,12,8,.35)',q.x+3,q.y+4,q.w,q.h);
      for(let j=0;j<q.h;j+=2)R(g,tone(l.c,(noise(j,1,l.n.length)-.5)*.08-(j>q.h-6?.25:0)),q.x,q.y+j,q.w,2);
      if(l.n==='drap'){R(g,'#ffffff',q.x,q.y,q.w,3);R(g,'#d8d0bc',q.x,q.y+10,q.w,2)}
      else{R(g,tone(l.c,.3),q.x,q.y,q.w,3);for(let x=q.x+12;x<q.x+q.w;x+=24)R(g,tone(l.c,-.15),x,q.y+6,2,q.h-12)}
    };
    const paint=()=>{if(!$('mg-c'))return;
      L.forEach(l=>{if(l.parti){l.dx+=l.vx;l.dy+=l.vy}});
      parquet(g);R(g,'#3a2214',52,4,216,194);R(g,'#6a4428',56,6,208,16);R(g,'#e6dfcf',62,22,196,170);for(let y=40;y<190;y+=24)R(g,'#d6cfbe',62,y,196,1);
      g.drawImage(spr,ob.x,ob.y,ob.w,ob.h);L.forEach(couche)};
    paint();G.pzT=paint;
    let pris=null;
    const verifie=()=>{if(!L.some(l=>!l.parti&&recouvre(ob,rect(l))>.22))gagne("Le voilà, caché dans le lit !")};
    k.addEventListener('pointerdown',e=>{if(fini)return;const[x,y]=pos(e);for(let i=L.length-1;i>=0;i--){const l=L[i],q=rect(l);if(!l.parti&&x>=q.x&&x<q.x+q.w&&y>=q.y&&y<q.y+q.h){pris={l,x,y,dx:l.dx,dy:l.dy};try{k.setPointerCapture(e.pointerId)}catch(_){}break}}});
    k.addEventListener('pointermove',e=>{if(!pris)return;const[x,y]=pos(e);pris.l.dx=pris.dx+x-pris.x;pris.l.dy=pris.dy+y-pris.y});
    k.addEventListener('pointerup',()=>{if(!pris)return;const l=pris.l,d=Math.hypot(l.dx,l.dy);
      if(d>40){l.parti=true;l.vx=l.dx/d*14;l.vy=l.dy/d*14;son('page');verifie()}else{l.dx=pris.dx;l.dy=pris.dy;dire("Fais glisser plus loin pour le tirer hors du lit.")}
      pris=null});
    return true;
  }
  if(type==='coussins'){
    const fauteuil=o&&/armchair/.test(o.name),n=fauteuil?2:3,tg=int(Math.random,n),cols=['#7a2f35','#2e4a78','#3d6a4a','#6a4a7a','#8a6a3a'],tissu=cols[(o?o.id:0)%cols.length];
    const{k,g,pos}=toile(shell,"Les coussins ne sont pas bien remis. Clique sur un coussin pour le soulever.");
    const x0=fauteuil?100:40,cw=fauteuil?120:80,C=range(n).map(i=>({x:x0+i*cw,y:98,w:cw-4,h:54,lev:0,haut:false}));
    if(fauteuil){C[1]={x:100,y:98,w:120,h:54,lev:0,haut:false};C[0]={x:110,y:40,w:100,h:52,lev:0,haut:false,dos:true}}
    const miettes=['#c8a050','#d8d0b8','#8a6a3a'],dessous=['Des miettes de biscuit.','Une pièce de dix centimes.','Un bouton de veste.','Une épingle à cheveux.'];
    const paint=()=>{if(!$('mg-c'))return;
      R(g,'#2a2018',0,0,320,200);R(g,'#3a2a20',0,170,320,30);
      const xa=x0-26,xb=x0+n*cw-4;R(g,tone(tissu,-.25),xa+8,30,xb-xa-16,80);R(g,tissu,xa+12,34,xb-xa-24,70);
      R(g,tone(tissu,-.38),x0-4,94,n*cw+4,70);
      C.forEach((q,i)=>{const cx=q.x+q.w/2;if(i===tg)g.drawImage(spr,cx-20,q.y+10,40,40);else for(let j=0;j<6;j++)R(g,miettes[j%3],q.x+14+(j*17+i*7)%(q.w-28),q.y+20+(j*11)%24,3,2)});
      C.forEach(q=>{if(q.haut&&q.lev<46)q.lev+=4;const y=q.y-q.lev;R(g,tone(tissu,-.3),q.x+3,y+4,q.w,q.h);R(g,tissu,q.x,y,q.w,q.h);R(g,tone(tissu,.25),q.x+5,y+4,q.w-10,5);R(g,tone(tissu,-.15),q.x+q.w/2-1,y+10,2,q.h-20)});
      R(g,tone(tissu,-.1),xa,40,26,124);R(g,tone(tissu,-.1),xb,40,26,124);R(g,tone(tissu,.2),xa,40,26,5);R(g,tone(tissu,.2),xb,40,26,5);
      R(g,'#2a1a10',xa+4,164,8,10);R(g,'#2a1a10',xb+14,164,8,10)};
    paint();G.pzT=paint;
    k.addEventListener('pointerdown',e=>{if(fini)return;const[x,y]=pos(e);
      const i=C.findIndex(q=>!q.haut&&x>=q.x&&x<q.x+q.w&&y>=q.y-q.lev&&y<q.y-q.lev+q.h);if(i<0)return;
      C[i].haut=true;son('page');
      if(i===tg)gagne('Glissé sous le coussin !');else dire(C[i].dos?'Rien derrière le dossier.':dessous[(i+tg)%dessous.length])});
    return true;
  }
  if(type==='horloge'){
    const H0=1+int(Math.random,12),M0=5*int(Math.random,12);let h=(H0+3+int(Math.random,6))%12||12,m=5*int(Math.random,12);
    const{k,g,pos}=toile(shell,`Un papier coincé derrière le cadran : « ${H0} h ${String(M0).padStart(2,'0')} ». Fais tourner la grande aiguille jusqu'à cette heure.`);
    const cx=160,cy=92,rr=68;let ouvert=0;
    const paint=()=>{if(!$('mg-c'))return;
      R(g,'#2a1a10',0,0,320,200);R(g,'#5b3820',70,0,180,200);R(g,'#7a4c2a',74,0,172,200);
      for(let y=-rr-6;y<=rr+6;y++)for(let x=-rr-6;x<=rr+6;x++){const d=x*x+y*y;if(d<=(rr+6)*(rr+6))R(g,d>rr*rr?'#c8a040':tone('#f0e6cc',(noise(x>>2,y>>2,3)-.5)*.06),cx+x,cy+y)}
      for(let i=0;i<60;i++){const a=i/60*Math.PI*2,l=i%5?4:9;for(let t=0;t<l;t++)R(g,'#2a2018',Math.round(cx+Math.sin(a)*(rr-3-t)),Math.round(cy-Math.cos(a)*(rr-3-t)),i%5?1:2,i%5?1:2)}
      g.fillStyle='#2a2018';g.font='bold 15px "Pixelify Sans",monospace';g.textAlign='center';g.textBaseline='middle';
      [12,3,6,9].forEach((n,i)=>{const a=i*Math.PI/2;g.fillText(n,cx+Math.sin(a)*(rr-22),cy-Math.cos(a)*(rr-22))});
      const aig=(a,l,e,col)=>traitP(g,col,cx,cy,Math.round(cx+Math.sin(a)*l),Math.round(cy-Math.cos(a)*l),e);
      aig(((h%12)+m/60)/12*Math.PI*2,38,4,'#1a1418');aig(m/60*Math.PI*2,58,2,'#1a1418');ellipseP(g,cx,cy,4,4,'#c8a040');
      R(g,'#3a2214',130,166,60,34);if(ouvert<30&&fini)ouvert+=2;R(g,'#c8a040',130,166,60,2);
      if(fini){g.drawImage(spr,140,170,40,30);R(g,'#5b3820',130+ouvert*2,166,60-ouvert*2,34)}else{R(g,'#1a1418',158,170,4,22);ellipseP(g,160,192,6,5,'#c8a040')}};
    paint();G.pzT=paint;
    let tient=false,prec=null;
    const tourne=e=>{const[x,y]=pos(e);let a=Math.atan2(x-cx,cy-y);if(a<0)a+=Math.PI*2;const nm=Math.round(a/(Math.PI*2)*60)%60;
      if(prec!==null){if(prec>=45&&nm<15)h=h%12+1;else if(prec<15&&nm>=45)h=(h+10)%12+1}prec=nm;m=nm;
      if(h%12===H0%12&&Math.abs(m-M0)<=1&&!fini){m=M0;gagne("Clic ! La porte du balancier s'ouvre.")}};
    k.addEventListener('pointerdown',e=>{if(fini)return;tient=true;prec=m;try{k.setPointerCapture(e.pointerId)}catch(_){}tourne(e)});
    k.addEventListener('pointermove',e=>{if(tient&&!fini)tourne(e)});
    k.addEventListener('pointerup',()=>{tient=false});
    return true;
  }
  if(type==='pot'){
    const f=o&&W.furn.find(q=>q.x===o.x&&q.y===o.y&&q.name===o.name),v=f?f.v:int(Math.random,10),[pk,pg]=cv(16,34);PLANTES[v%10](pg,v);
    const{k,g,pos}=toile(shell,"Quelque chose dépasse sous le pot. Fais-le glisser sur le côté, doucement : il est lourd.");
    let dx=0,pench=0,pris=null;
    const paint=()=>{if(!$('mg-c'))return;
      R(g,'#3a2f3a',0,0,320,150);for(let x=0;x<320;x+=40)R(g,'#433645',x,0,20,150);
      for(let y=150;y<200;y++)for(let x=0;x<320;x+=8)R(g,tone('#5b3820',((x>>5)+(y>>3))%2?.05:-.05),x,y,8,1);R(g,'#2a1a10',0,148,320,3);
      g.drawImage(spr,140,158,40,34);
      if(pench>0)pench-=.6;const a=Math.sin(pench*.5)*pench*.012;
      g.save();g.translate(160+dx,196);g.rotate(a);g.drawImage(pk,-40,-170,80,170);g.restore()};
    paint();G.pzT=paint;
    k.addEventListener('pointerdown',e=>{if(fini)return;const[x,y]=pos(e);if(Math.abs(x-160-dx)<48&&y>24){pris={x,dx,t:performance.now(),lx:x};try{k.setPointerCapture(e.pointerId)}catch(_){}}});
    k.addEventListener('pointermove',e=>{if(!pris||fini)return;const[x]=pos(e),t=performance.now(),vit=Math.abs(x-pris.lx)/Math.max(8,t-pris.t);pris.lx=x;pris.t=t;
      if(vit>.55){pench=14;dx=Math.max(-110,Math.min(110,dx-Math.sign(x-pris.x)*16));pris=null;dire("Doucement ! Le pot a failli basculer.");son('marteau');return}
      dx=Math.max(-110,Math.min(110,pris.dx+x-pris.x));if(Math.abs(dx)>=88)gagne('Il y avait bien quelque chose sous le pot !')});
    k.addEventListener('pointerup',()=>{pris=null});
    return true;
  }
  if(type==='piano'){
    const N=['Do','Ré','Mi','Fa','Sol','La','Si','Do'],F=[262,294,330,349,392,440,494,523],air=range(5).map(()=>int(Math.random,8));let p=0;
    const dessin=t=>shell(t,`<div class="piano-m"><div class="partition">${air.map((n,i)=>`<span class="${i<p?'ok':''}">${N[n]}${n===7?'↑':''}</span>`).join('')}</div><div class="touches">${N.map((n,i)=>`<button data-k="${i}" class="touche" aria-label="${n}${i===7?' aigu':''}"><span>${n}</span></button>`).join('')}</div></div>`);
    dessin("Une partition est restée ouverte, avec un mot : « Joue-la et le couvercle s'ouvrira. »");
    G.mini=b=>{const i=+b.dataset.k;try{ton(F[i],.5,.16)}catch(_){}
      if(i===air[p]){p++;if(p>=air.length){dessin('Le couvercle se soulève tout seul…');return gagne("Le couvercle s'ouvre !")}dessin('Bien. Continue la mélodie.')}
      else{p=i===air[0]?1:0;dessin('Fausse note. Reprends depuis le début de la partition.')}};
    return true;
  }
  return false;
}

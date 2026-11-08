// Mini-jeux en haute définition : dessinés en vrai détail (dégradés, courbes, reflets) sur une toile quatre fois
// plus fine. On garde les coordonnées 320 × 200 des anciens mini-jeux : seule la finesse du dessin change.
const HD=4;
function toileHD(shell,txt){
  shell(txt,`<canvas id="mg-c" class="cendres hd" width="${320*HD}" height="${200*HD}" style="touch-action:none"></canvas>`);
  const k=$('mg-c'),g=k.getContext('2d');g.setTransform(HD,0,0,HD,0,0);g.imageSmoothingEnabled=true;
  const pos=e=>{const r=k.getBoundingClientRect();return[(e.clientX-r.left)/r.width*320,(e.clientY-r.top)/r.height*200]};
  return{k,g,pos};
}
// Une image de fond calculée une seule fois, à pleine finesse
function fondHD(dessin){const[k,g]=cv(320*HD,200*HD);g.setTransform(HD,0,0,HD,0,0);dessin(g);return k}
const degrade=(g,x0,y0,x1,y1,stops)=>{const q=g.createLinearGradient(x0,y0,x1,y1);stops.forEach(([o,c])=>q.addColorStop(o,c));return q};
const radial=(g,x,y,r0,r1,stops,fx=x,fy=y)=>{const q=g.createRadialGradient(fx,fy,r0,x,y,r1);stops.forEach(([o,c])=>q.addColorStop(o,c));return q};
function rivet(g,x,y,r=1.6){g.fillStyle=radial(g,x,y,0,r,[[0,'#e8eef4'],[.5,'#8a939e'],[1,'#3a4048']],x-r*.4,y-r*.4);g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+.4,y+.5,r,0,7);g.globalCompositeOperation='destination-over';g.fill();g.globalCompositeOperation='source-over'}
function plaque(g,x,y,w,h,txt,taille=6){
  g.fillStyle=degrade(g,x,y,x,y+h,[[0,'#f0d080'],[.5,'#c8983a'],[1,'#8a6420']]);g.beginPath();g.roundRect(x,y,w,h,1.5);g.fill();
  g.strokeStyle='rgba(60,40,10,.6)';g.lineWidth=.5;g.stroke();
  g.font=`700 ${taille}px Georgia,serif`;g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(255,240,200,.6)';g.fillText(txt,x+w/2+.3,y+h/2+.4);g.fillStyle='#3a2408';g.fillText(txt,x+w/2,y+h/2);
  rivet(g,x+3,y+h/2,1);rivet(g,x+w-3,y+h/2,1);
}

function miniHD(type,shell,done,spr,o){
  if(type==='horloge')return horlogeHD(shell,done,spr,o);
  if(type==='pot')return potHD(shell,done,spr,o);
  if(type==='coussins')return coussinsHD(shell,done,spr,o);
  if(type!=='moteur')return false;
  let fini=false;
  const gagne=t=>{if(fini)return;fini=true;dire(t);son('bon');setTimeout(()=>{if(G.mini||G.pzT)done()},1100)};
  const{k,g,pos}=toileHD(shell,"Le capot de visite reste verrouillé tant que la pression n'est pas stable. Ramène les trois aiguilles dans le vert : tourne une vanne par la gauche pour la fermer, par la droite pour l'ouvrir. Attention, chaque vanne pousse aussi la suivante.");
  // ——— l'état : trois cylindres, trois vannes liées ———
  const ZONE=[44,60],X=[62,160,258],cible=[52,52,52],v=cible.slice();
  const coup=(i,d,val)=>{val[i]+=12*d;val[(i+1)%3]-=6*d};
  // on mélange jusqu'à ce que la solution la plus courte demande au moins trois tours de vanne
  const dans=t=>t.every(x=>x>=ZONE[0]&&x<=ZONE[1]),distance=s0=>{const cle=t=>t.join(),vu=new Set([cle(s0)]);let f=[s0];for(let n=0;n<9;n++){if(f.some(dans))return n;const g2=[];for(const t of f)for(let i=0;i<3;i++)for(const d of[-1,1]){const u=t.slice();coup(i,d,u);if(u.some(x=>x<0||x>100)||vu.has(cle(u)))continue;vu.add(cle(u));g2.push(u)}f=g2}return 99};
  for(let essai=0;essai<60;essai++){
    const t=cible.slice();for(let n=0;n<7;n++){const i=int(Math.random,3),d=Math.random()<.5?-1:1,u=t.slice();coup(i,d,u);if(u.every(x=>x>=6&&x<=94))coup(i,d,t)}
    const dd=distance(t);if(dd>=3&&dd<=6){v.splice(0,3,...t);break}
  }
  G.mgEtat={v,coup,ZONE};
  const aff=v.slice(),ang=[0,0,0],angC=[0,0,0],vapeur=[];let t0=0;
  // ——— le décor fixe : tôle brossée, rivets, tuyaux, plaques ———
  const fond=fondHD(h=>{
    h.fillStyle=degrade(h,0,0,0,200,[[0,'#5a6670'],[1,'#2a3238']]);h.fillRect(0,0,320,200);
    for(let y=0;y<200;y+=.5){h.fillStyle=`rgba(255,255,255,${(noise(y*2|0,3,7)*.05).toFixed(3)})`;h.fillRect(0,y,320,.25)}
    h.strokeStyle='rgba(0,0,0,.45)';h.lineWidth=.8;[[4,4,312,192]].forEach(([x,y,w,hh])=>h.strokeRect(x,y,w,hh));
    for(let x=10;x<320;x+=20){rivet(h,x,9);rivet(h,x,191)}for(let y=29;y<190;y+=20){rivet(h,9,y);rivet(h,311,y)}
    // tuyaux de cuivre des manomètres aux vannes
    X.forEach(x=>{h.lineCap='round';h.strokeStyle='#5a2e14';h.lineWidth=7;h.beginPath();h.moveTo(x,112);h.lineTo(x,150);h.stroke();
      h.strokeStyle=degrade(h,x-3,0,x+3,0,[[0,'#7a3e1a'],[.4,'#e89a5a'],[1,'#8a4a22']]);h.lineWidth=5.5;h.stroke();
      h.fillStyle='#8a939e';h.fillRect(x-5,126,10,4);h.fillStyle='#c8d0d8';h.fillRect(x-5,126,10,1)});
    // conduite principale
    h.strokeStyle='#3a1e0e';h.lineWidth=9;h.beginPath();h.moveTo(20,182);h.lineTo(300,182);h.stroke();
    h.strokeStyle=degrade(h,0,177,0,187,[[0,'#7a3e1a'],[.35,'#e89a5a'],[1,'#6a3416']]);h.lineWidth=7;h.stroke();
    plaque(h,104,14,112,13,'PRESSION DES CYLINDRES',6.2);
    X.forEach((x,i)=>plaque(h,x-15,118,30,8,'CYL. '+(i+1),5));
  });
  // ——— un manomètre en laiton ———
  const A0=Math.PI*.75,AS=Math.PI*1.5,angle=p=>A0+AS*p/100;
  function manometre(x,y,val,i){
    const R=34;
    g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.arc(x+1.5,y+2.5,R+5,0,7);g.fill();
    g.fillStyle=radial(g,x,y,R,R+5,[[0,'#7a5418'],[.5,'#f8d878'],[1,'#8a6020']],x-6,y-8);g.beginPath();g.arc(x,y,R+5,0,7);g.fill();
    g.fillStyle=radial(g,x,y,2,R,[[0,'#fffaf0'],[1,'#e8dcc0']],x-8,y-10);g.beginPath();g.arc(x,y,R,0,7);g.fill();
    const arc=(a,b,c)=>{g.strokeStyle=c;g.lineWidth=4.5;g.beginPath();g.arc(x,y,R-6,angle(a),angle(b));g.stroke()};
    arc(0,ZONE[0],'rgba(120,140,160,.35)');arc(ZONE[0],ZONE[1],'#3aa84a');arc(ZONE[1],80,'#e8b020');arc(80,100,'#d8382a');
    for(let p=0;p<=100;p+=2){const a=angle(p),m=p%10===0,r0=R-(m?10:7);g.strokeStyle='#2a2418';g.lineWidth=m?.9:.4;g.beginPath();g.moveTo(x+Math.cos(a)*r0,y+Math.sin(a)*r0);g.lineTo(x+Math.cos(a)*(R-3),y+Math.sin(a)*(R-3));g.stroke()}
    g.font='600 5.2px Georgia,serif';g.fillStyle='#2a2418';g.textAlign='center';g.textBaseline='middle';
    for(let p=0;p<=100;p+=20){const a=angle(p);g.fillText(p,x+Math.cos(a)*(R-15),y+Math.sin(a)*(R-15))}
    g.font='italic 4px Georgia,serif';g.fillText('bar ×10',x,y+25);
    // aiguille
    const a=angle(val);
    g.save();g.translate(x+.8,y+1.2);g.rotate(a);g.fillStyle='rgba(40,30,10,.16)';g.beginPath();g.moveTo(-7,-1.4);g.lineTo(R-5,0);g.lineTo(-7,1.4);g.closePath();g.fill();g.restore();
    g.save();g.translate(x,y);g.rotate(a);
    g.fillStyle='#b8201a';g.beginPath();g.moveTo(-7,-1.4);g.lineTo(R-5,0);g.lineTo(-7,1.4);g.closePath();g.fill();g.restore();
    g.fillStyle=radial(g,x,y,0,4,[[0,'#8a939e'],[1,'#1a1a1a']],x-1,y-1);g.beginPath();g.arc(x,y,3.6,0,7);g.fill();
    // verre : reflet
    g.fillStyle='rgba(255,255,255,.22)';g.beginPath();g.ellipse(x-10,y-14,15,8,-.6,0,7);g.fill();
    // voyant
    const ok=val>=ZONE[0]&&val<=ZONE[1];g.fillStyle=radial(g,x+26,y-30,0,4,ok?[[0,'#d8ffd8'],[.5,'#4ad85a'],[1,'#1a5a22']]:[[0,'#ffd8c8'],[.5,'#d8382a'],[1,'#5a1a10']]);g.beginPath();g.arc(x+26,y-30,3.5,0,7);g.fill();
  }
  // ——— une vanne à volant rouge ———
  function vanne(x,y,a){
    g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+2,y+3,22,0,7);g.fill();
    g.save();g.translate(x,y);g.rotate(a);
    g.strokeStyle='#5a1008';g.lineWidth=7;g.beginPath();g.arc(0,0,18,0,7);g.stroke();
    g.strokeStyle=degrade(g,-18,-18,18,18,[[0,'#ff7a5a'],[.5,'#c8281a'],[1,'#7a140c']]);g.lineWidth=5;g.stroke();
    for(let s=0;s<5;s++){g.rotate(Math.PI*2/5);g.fillStyle='#8a1a10';g.fillRect(-1.6,2,3.2,15);g.fillStyle='#e84a32';g.fillRect(-1.6,2,1.2,15)}
    g.restore();
    g.fillStyle=radial(g,x,y,0,6,[[0,'#e8eef4'],[.6,'#8a939e'],[1,'#3a4048']],x-2,y-2);g.beginPath();g.arc(x,y,5.5,0,7);g.fill();
    g.fillStyle='rgba(255,255,255,.75)';g.font='700 9px system-ui';g.textAlign='center';g.textBaseline='middle';
    g.fillText('−',x-31,y);g.fillText('+',x+31,y);
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=.8;g.beginPath();g.arc(x,y,26,Math.PI*.8,Math.PI*1.2);g.stroke();g.beginPath();g.arc(x,y,26,-Math.PI*.2,Math.PI*.2);g.stroke();
  }
  const paint=()=>{
    if(!$('mg-c'))return;t0++;
    const fort=aff.some(p=>p>80)&&!fini,tremble=fort?Math.sin(t0*1.7)*.6:0;
    for(let i=0;i<3;i++){aff[i]+=(v[i]-aff[i])*.12;ang[i]+=(angC[i]-ang[i])*.18}
    g.setTransform(HD,0,0,HD,0,0);g.drawImage(fond,0,0,320,200);g.save();g.translate(tremble,0);
    X.forEach((x,i)=>manometre(x,70,Math.max(0,Math.min(100,aff[i]+(fini?0:Math.sin(t0*.3+i*2)*.5))),i));
    X.forEach((x,i)=>vanne(x,154,ang[i]));
    // vapeur qui fuit quand ça monte trop
    if(fort&&t0%3===0){const i=aff.findIndex(p=>p>80);vapeur.push({x:X[i]+6,y:120,vx:.4+Math.random()*.5,vy:-.6-Math.random()*.4,r:2,a:.5})}
    vapeur.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=.18;p.a*=.96;g.fillStyle=`rgba(235,240,245,${p.a.toFixed(3)})`;g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()});
    for(let i=vapeur.length-1;i>=0;i--)if(vapeur[i].a<.03)vapeur.splice(i,1);
    if(fini){g.fillStyle='rgba(30,120,50,.82)';g.beginPath();g.roundRect(110,184,100,12,3);g.fill();g.fillStyle='#e8ffe8';g.font='700 7px system-ui';g.textAlign='center';g.fillText('PRESSION STABLE',160,190.5)}
    g.restore();
  };
  paint();G.pzT=paint;
  k.addEventListener('pointerdown',e=>{
    if(fini)return;const[x,y]=pos(e);const i=X.findIndex(cx=>Math.hypot(x-cx,y-154)<34);if(i<0)return;
    const d=x<X[i]?-1:1,t=v.slice();coup(i,d,t);
    if(t.some(p=>p<0||p>100)){dire("La vanne est en butée : essaie l'autre sens, ou une autre vanne.");return}
    coup(i,d,v);angC[i]+=d*Math.PI*2/5;son('clic');
    if(v.every(p=>p>=ZONE[0]&&p<=ZONE[1]))gagne('Les trois aiguilles se calent dans le vert. Le moteur ralentit et le capot de visite se déverrouille.');
    else dire(v.map((p,j)=>p>80?`Le cylindre ${j+1} siffle, la pression est trop haute.`:'').find(Boolean)||'La pression bouge… continue.');
  });
  return true;
}

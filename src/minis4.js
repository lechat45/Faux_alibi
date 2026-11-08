// Trois anciens mini-jeux redessinés en haute définition : l'horloge, le pot de fleurs, les coussins.
// Mêmes règles qu'avant ; seul le dessin change (bois veiné, laiton, émail, tissu capitonné, feuilles une à une).
const objetNet=(g,spr,x,y,w,h)=>{g.imageSmoothingEnabled=false;g.drawImage(spr,x,y,w,h);g.imageSmoothingEnabled=true};
function boisHD(g,x,y,w,h,col,s=1,vertical=true){
  g.fillStyle=col;g.fillRect(x,y,w,h);
  for(let i=0;i<(vertical?w:h);i+=.5){const n=noise(i*2|0,s,9),a=(n-.5)*.18;g.fillStyle=a>0?`rgba(255,230,190,${a.toFixed(3)})`:`rgba(20,8,0,${(-a).toFixed(3)})`;if(vertical)g.fillRect(x+i,y,.5,h);else g.fillRect(x,y+i,w,.5)}
  for(let k=0;k<6;k++){const p=noise(k,s,4);g.strokeStyle='rgba(30,12,4,.18)';g.lineWidth=.4;g.beginPath();
    if(vertical){const xx=x+p*w;g.moveTo(xx,y);g.bezierCurveTo(xx+3,y+h*.3,xx-3,y+h*.6,xx+1,y+h)}else{const yy=y+p*h;g.moveTo(x,yy);g.bezierCurveTo(x+w*.3,yy+2,x+w*.6,yy-2,x+w,yy+1)}g.stroke()}
}
function horlogeHD(shell,done,spr,o){
  let fini=false;const gagne=t=>{if(fini)return;fini=true;dire(t);son('bon');indiceMini('horloge',o);setTimeout(()=>{if(G.mini||G.pzT)done()},900)};
  const hh=typeof c!=='undefined'&&c&&!c.test?parseInt(HOURS[c.hc]):8+int(Math.random,4),H0=hh%12||12,M0=5*int(Math.random,12);G.horloge={hh,M0};
  let h=(H0+3+int(Math.random,6))%12||12,m=5*int(Math.random,12);
  const{k,g,pos}=toileHD(shell,`Un papier coincé derrière le cadran : « ${H0} h ${String(M0).padStart(2,'0')} ». Fais tourner la grande aiguille jusqu'à cette heure.`);
  const cx=160,cy=82,rr=60,ROM=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];let ouvert=0,t0=0;
  const fond=fondHD(q=>{
    boisHD(q,0,0,320,200,'#2a160c',3);
    q.fillStyle=degrade(q,70,0,250,0,[[0,'#3a1c0c'],[.12,'#6a3a1c'],[.5,'#7a4624'],[.88,'#6a3a1c'],[1,'#3a1c0c']]);q.fillRect(70,0,180,200);boisHD(q,74,0,172,200,'rgba(0,0,0,0)',5);
    q.fillStyle=degrade(q,0,150,0,155,[[0,'#f8d878'],[1,'#8a6020']]);q.fillRect(66,150,188,5);
    q.fillStyle='#1a0e08';q.fillRect(118,158,84,42);q.strokeStyle=degrade(q,118,158,202,200,[[0,'#f8d878'],[1,'#8a6020']]);q.lineWidth=2.5;q.strokeRect(119,159,82,44);
  });
  const aiguille=(a,l,larg,pointe)=>{g.save();g.translate(cx,cy);g.rotate(a);g.fillStyle='#14100c';g.beginPath();g.moveTo(-larg,6);g.lineTo(-larg*.6,-l+pointe);g.lineTo(0,-l);g.lineTo(larg*.6,-l+pointe);g.lineTo(larg,6);g.closePath();g.fill();
    if(pointe>6){g.beginPath();g.ellipse(0,-l+pointe+2,larg*1.6,pointe*.45,0,0,7);g.fill();g.fillStyle='#f2e8d0';g.beginPath();g.ellipse(0,-l+pointe+2,larg*.7,pointe*.22,0,0,7);g.fill()}g.restore()};
  const paint=()=>{if(!$('mg-c'))return;t0++;
    g.setTransform(HD,0,0,HD,0,0);g.drawImage(fond,0,0,320,200);
    if(fini&&ouvert<1)ouvert=Math.min(1,ouvert+.04);
    const ba=Math.sin(t0*.06)*.22*(1-ouvert);
    g.save();g.beginPath();g.rect(120,160,80,40);g.clip();
    g.fillStyle=degrade(g,120,160,120,200,[[0,'#120804'],[1,'#2a160c']]);g.fillRect(120,160,80,40);
    if(fini)objetNet(g,spr,140,166,40,32);
    g.save();g.translate(160,156);g.rotate(ba);g.fillStyle='#b8902a';g.fillRect(-.8,0,1.6,32);g.fillStyle=radial(g,0,36,0,7,[[0,'#fff0b8'],[.5,'#e0b040'],[1,'#7a5410']],-2,33);g.beginPath();g.arc(0,36,7,0,7);g.fill();g.restore();
    const lw=80*(1-ouvert);g.fillStyle='rgba(180,210,230,.12)';g.fillRect(120,160,lw,40);g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.moveTo(124,162);g.lineTo(124+16*(1-ouvert),162);g.lineTo(126,196);g.lineTo(122,196);g.fill();
    g.restore();
    g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.arc(cx+2,cy+3,rr+9,0,7);g.fill();
    g.fillStyle=radial(g,cx,cy,rr,rr+9,[[0,'#6a4810'],[.35,'#f8d878'],[.7,'#c8983a'],[1,'#5a3a08']],cx-10,cy-14);g.beginPath();g.arc(cx,cy,rr+9,0,7);g.fill();
    g.fillStyle=radial(g,cx,cy,4,rr,[[0,'#fffcf2'],[.8,'#f2e8d0'],[1,'#d8c8a0']],cx-14,cy-18);g.beginPath();g.arc(cx,cy,rr,0,7);g.fill();
    g.strokeStyle='rgba(60,40,20,.5)';g.lineWidth=.5;g.beginPath();g.arc(cx,cy,rr-4,0,7);g.stroke();g.beginPath();g.arc(cx,cy,rr-9,0,7);g.stroke();
    for(let i=0;i<60;i++){const a=i/60*Math.PI*2,r0=i%5?rr-7:rr-9;g.strokeStyle='#2a1c10';g.lineWidth=i%5?.5:1.3;g.beginPath();g.moveTo(cx+Math.sin(a)*r0,cy-Math.cos(a)*r0);g.lineTo(cx+Math.sin(a)*(rr-4),cy-Math.cos(a)*(rr-4));g.stroke()}
    g.fillStyle='#2a1c10';g.font='600 9px Georgia,serif';g.textAlign='center';g.textBaseline='middle';
    ROM.forEach((n,i)=>{const a=i/12*Math.PI*2;g.save();g.translate(cx+Math.sin(a)*(rr-17),cy-Math.cos(a)*(rr-17));g.rotate(a);g.fillText(n,0,0);g.restore()});
    g.font='italic 5px Georgia,serif';g.fillText('Bréguet & Fils',cx,cy+22);
    aiguille(((h%12)+m/60)/12*Math.PI*2,34,2.2,10);aiguille(m/60*Math.PI*2,52,1.2,4);
    g.fillStyle=radial(g,cx,cy,0,4,[[0,'#fff0b8'],[1,'#8a6020']],cx-1,cy-1);g.beginPath();g.arc(cx,cy,3.5,0,7);g.fill();
    g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.ellipse(cx-18,cy-24,30,14,-.6,0,7);g.fill();
  };
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
// Une plante dessinée feuille à feuille
function planteHD(g,x,y,v){
  const verts=['#2f6a32','#3d8a3e','#4a9a48','#5aae52','#2a5a2a'];
  for(let i=0;i<18;i++){
    const a=-Math.PI/2+(noise(i,v,1)-.5)*2.4,l=26+noise(i,v,2)*30,cx=x+Math.cos(a)*l*.5,cy=y-8+Math.sin(a)*l*.6,ex=x+Math.cos(a)*l,ey=y-6+Math.sin(a)*l*.9+l*.15;
    g.fillStyle=verts[i%5];g.beginPath();g.moveTo(x,y-4);g.quadraticCurveTo(cx-4,cy,ex,ey);g.quadraticCurveTo(cx+4,cy+3,x,y-4);g.fill();
    g.strokeStyle='rgba(20,50,20,.5)';g.lineWidth=.35;g.beginPath();g.moveTo(x,y-4);g.quadraticCurveTo(cx,cy+1,ex,ey);g.stroke();
  }
}
function potHD(shell,done,spr,o){
  let fini=false;const gagne=t=>{if(fini)return;fini=true;dire(t);son('bon');setTimeout(()=>{if(G.mini||G.pzT)done()},800)};
  const f=o&&W.furn.find(q=>q.x===o.x&&q.y===o.y&&q.name===o.name),v=f?f.v:int(Math.random,1000),coulPot=['#b8603a','#d8d0c0','#3a5a7a','#8a4a2a','#2a2a2a'][v%5];
  const{k,g,pos}=toileHD(shell,"Quelque chose dépasse sous le pot. Fais-le glisser sur le côté, doucement : il est lourd.");
  let dx=0,pench=0,pris=null;
  const fond=fondHD(q=>{
    q.fillStyle=degrade(q,0,0,0,150,[[0,'#3a2f3e'],[1,'#2a2230']]);q.fillRect(0,0,320,150);
    for(let y=8;y<150;y+=22)for(let x=(y/22%2)*14;x<330;x+=28){q.fillStyle='rgba(200,170,110,.08)';q.beginPath();q.moveTo(x,y-7);q.quadraticCurveTo(x+6,y,x,y+7);q.quadraticCurveTo(x-6,y,x,y-7);q.fill();q.beginPath();q.arc(x,y,1.4,0,7);q.fill()}
    q.fillStyle=degrade(q,0,136,0,150,[[0,'#5a3a22'],[.2,'#8a5a34'],[1,'#3a2214']]);q.fillRect(0,136,320,14);
    for(let i=0;i<8;i++){const y=150+i*6.5;boisHD(q,0,y,320,6.5,'#6a4426',i+2,false);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(0,y,320,.4);for(let x=(i*53)%90;x<320;x+=90)q.fillRect(x,y,.4,6.5)}
  });
  const paint=()=>{if(!$('mg-c'))return;
    g.setTransform(HD,0,0,HD,0,0);g.drawImage(fond,0,0,320,200);
    objetNet(g,spr,140,158,40,34);
    if(pench>0)pench-=.6;const a=Math.sin(pench*.5)*pench*.012,X=160+dx;
    g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(X+3,193,40,6,0,0,7);g.fill();
    g.save();g.translate(X,194);g.rotate(a);
    g.fillStyle=degrade(g,-36,0,36,0,[[0,tone(coulPot,-.35)],[.3,tone(coulPot,.15)],[.55,coulPot],[1,tone(coulPot,-.45)]]);
    g.beginPath();g.moveTo(-34,-70);g.bezierCurveTo(-36,-40,-30,-12,-22,0);g.lineTo(22,0);g.bezierCurveTo(30,-12,36,-40,34,-70);g.closePath();g.fill();
    g.fillStyle=degrade(g,-40,0,40,0,[[0,tone(coulPot,-.3)],[.35,tone(coulPot,.3)],[1,tone(coulPot,-.4)]]);g.beginPath();g.roundRect(-40,-82,80,13,3);g.fill();
    g.fillStyle='#2a1a10';g.beginPath();g.ellipse(0,-81,36,4,0,0,7);g.fill();
    g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.6;g.beginPath();g.moveTo(-31,-46);g.quadraticCurveTo(0,-40,31,-46);g.stroke();
    g.fillStyle='rgba(255,255,255,.16)';g.beginPath();g.ellipse(-18,-46,4,18,.1,0,7);g.fill();
    planteHD(g,0,-80,v);
    g.restore();
  };
  paint();G.pzT=paint;
  k.addEventListener('pointerdown',e=>{if(fini)return;const[x,y]=pos(e);if(Math.abs(x-160-dx)<48&&y>24){pris={x,dx,t:performance.now(),lx:x};try{k.setPointerCapture(e.pointerId)}catch(_){}}});
  k.addEventListener('pointermove',e=>{if(!pris||fini)return;const[x]=pos(e),t=performance.now(),vit=Math.abs(x-pris.lx)/Math.max(8,t-pris.t);pris.lx=x;pris.t=t;
    if(vit>.55){pench=14;dx=Math.max(-110,Math.min(110,dx-Math.sign(x-pris.x)*16));pris=null;dire("Doucement ! Le pot a failli basculer.");son('marteau');return}
    dx=Math.max(-110,Math.min(110,pris.dx+x-pris.x));if(Math.abs(dx)>=88)gagne('Il y avait bien quelque chose sous le pot !')});
  k.addEventListener('pointerup',()=>{pris=null});
  return true;
}
function coussinsHD(shell,done,spr,o){
  let fini=false;const gagne=t=>{if(fini)return;fini=true;dire(t);son('bon');setTimeout(()=>{if(G.mini||G.pzT)done()},700)};
  const fauteuil=o&&/armchair/.test(o.name),n=fauteuil?2:3,tg=int(Math.random,n),cols=['#7a2f35','#2e4a78','#3d6a4a','#6a4a7a','#8a6a3a'],tissu=cols[(o?o.id:0)%cols.length];
  const{k,g,pos}=toileHD(shell,"Les coussins ne sont pas bien remis. Clique sur un coussin pour le soulever.");
  const x0=fauteuil?100:40,cw=fauteuil?120:80,C=range(n).map(i=>({x:x0+i*cw,y:98,w:cw-4,h:54,lev:0,haut:false}));
  if(fauteuil){C[1]={x:100,y:98,w:120,h:54,lev:0,haut:false};C[0]={x:110,y:40,w:100,h:52,lev:0,haut:false,dos:true}}
  const dessous=['Des miettes de biscuit.','Une pièce de dix centimes.','Un bouton de veste.','Une épingle à cheveux.'],xa=x0-26,xb=x0+n*cw-4;
  const etoffe=(x,y,w,h,col,r=6)=>{g.fillStyle=degrade(g,0,y,0,y+h,[[0,tone(col,.18)],[.55,col],[1,tone(col,-.35)]]);g.beginPath();g.roundRect(x,y,w,h,r);g.fill();
    g.strokeStyle=tone(col,-.45);g.lineWidth=.8;g.stroke();g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=.6;g.beginPath();g.roundRect(x+2,y+2,w-4,h-4,Math.max(1,r-1));g.stroke()};
  const fond=fondHD(q=>{
    q.fillStyle=degrade(q,0,0,0,170,[[0,'#2e2218'],[1,'#1e1610']]);q.fillRect(0,0,320,170);
    for(let i=0;i<5;i++)boisHD(q,0,170+i*6,320,6,'#3a2a1c',i,false);
  });
  const paint=()=>{if(!$('mg-c'))return;
    g.setTransform(HD,0,0,HD,0,0);g.drawImage(fond,0,0,320,200);
    g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(160,172,(xb-xa)/2+20,8,0,0,7);g.fill();
    etoffe(xa+8,28,xb-xa-16,84,tone(tissu,-.12),10);
    for(let y=44;y<100;y+=18)for(let x=xa+24;x<xb-16;x+=22){const xx=x+(y/18%2)*11;if(xx>xb-14)continue;g.fillStyle=tone(tissu,-.45);g.beginPath();g.arc(xx,y,1.6,0,7);g.fill();g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.arc(xx-.5,y-.6,.6,0,7);g.fill()}
    etoffe(x0-4,94,n*cw+4,72,tone(tissu,-.3),6);
    C.forEach((q,i)=>{const cx=q.x+q.w/2;if(i===tg)objetNet(g,spr,cx-20,q.y+10,40,40);else for(let j=0;j<7;j++){g.fillStyle=['#c8a050','#d8d0b8','#8a6a3a'][j%3];g.beginPath();g.ellipse(q.x+14+(j*17+i*7)%(q.w-28),q.y+20+(j*11)%26,1.4,1,j,0,7);g.fill()}});
    C.forEach(q=>{if(q.haut&&q.lev<46)q.lev+=(48-q.lev)*.18;const y=q.y-q.lev;
      g.fillStyle=`rgba(0,0,0,${(.3+q.lev*.004).toFixed(3)})`;g.beginPath();g.roundRect(q.x+3+q.lev*.08,q.y+5,q.w,q.h,9);g.fill();
      etoffe(q.x,y,q.w,q.h,tissu,10);g.strokeStyle=tone(tissu,-.25);g.lineWidth=.6;g.setLineDash([1.5,1.5]);g.beginPath();g.roundRect(q.x+5,y+5,q.w-10,q.h-10,7);g.stroke();g.setLineDash([]);
      g.fillStyle='rgba(255,255,255,.14)';g.beginPath();g.ellipse(q.x+q.w*.35,y+12,q.w*.25,5,0,0,7);g.fill()});
    [xa,xb].forEach(x=>{etoffe(x,38,26,128,tone(tissu,-.08),11);g.fillStyle=degrade(g,x+4,0,x+22,0,[[0,'#2a1a10'],[.4,'#6a4428'],[1,'#1a0e08']]);g.beginPath();g.roundRect(x+8,164,10,12,2);g.fill()});
  };
  paint();G.pzT=paint;
  k.addEventListener('pointerdown',e=>{if(fini)return;const[x,y]=pos(e);
    const i=C.findIndex(q=>!q.haut&&x>=q.x&&x<q.x+q.w&&y>=q.y-q.lev&&y<q.y-q.lev+q.h);if(i<0)return;
    C[i].haut=true;son('page');
    if(i===tg)gagne('Glissé sous le coussin !');else dire(C[i].dos?'Rien derrière le dossier.':dessous[(i+tg)%dessous.length])});
  return true;
}

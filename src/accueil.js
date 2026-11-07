// ——— Accueil : le bureau de l'inspecteur, la nuit. Chaque objet garde sa place. ———
function homeScene(W0,H0){
  // On dessine deux fois plus fin qu'à l'origine : Z garde les anciennes positions à l'écran
  const[k,g]=cv(W0,H0),u=1.5,Wo=W0/u,Ho=H0/u,Z=v=>Math.round(v*u);
  const P=(c,x,y,w=1,h=1)=>R(g,c,Math.round(x),Math.round(y),Math.round(w),Math.round(h));
  const O=(a,b,rx,ry,c)=>{for(let j=-ry;j<=ry;j++){const l=Math.round(rx*Math.sqrt(1-(j*j)/(ry*ry)));P(c,a-l,b+j,l*2+1,1)}};
  const T=(c,x0,y0,x1,y1,e=1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)P(c,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,e,e)};
  const solO=Math.floor(Ho*.72),sol=Z(solO);
  const fwO=Math.floor(Wo*.34),fhO=Math.floor(Ho*.46),fx=Z(Math.floor(Wo*.5-fwO/2)),fy=Z(Math.floor(Ho*.06)),fw=Z(fwO),fh=Z(fhO);
  const mx=Z(Math.floor(Wo*.05)),my=Z(Math.floor(Ho*.1)),mw=Z(Math.floor(Wo*.26)),mh=Z(Math.floor(Ho*.42));
  const cx=Z(Math.floor(Wo*.5)),cy=sol+Z(Math.floor((Ho-solO)*.42)),lx=Z(Math.floor(Wo*.72)),ly=sol-Z(14);

  // Mur tapissé et plateau d'acajou, éclairés par la lampe
  const im=g.createImageData(W0,H0),d=im.data;
  for(let y=0;y<H0;y++)for(let x=0;x<W0;x++){
    const i=(y*W0+x)*4,dl=Math.hypot((x-lx)/(W0*.36),(y-ly-8)/(H0*.62)),l0=Math.max(0,1-dl),lu=Math.floor(l0*l0*9+bay(x,y))/9;
    let r,v,b;
    if(y<sol){
      const m=Math.abs((x%26)-13)+Math.abs(((y+(x%52<26?0:13))%26)-13),t=(m===10?.2:m<3?.14:m===4?.07:0)+((x%13)===0?.05:0)+(noise(x>>2,y>>2,3)-.5)*.07,f=(1+t)*(.56+lu*1.1)*(y<30?.84:1);
      r=30*f;v=44*f;b=60*f;
    }else{
      const z=(y-sol)/(H0-sol),q=Math.pow(z,.75)*5,pl=Math.floor(q),b0=noise(x>>6,pl*7,2),w=Math.sin(x*.035+b0*6+y*.7+pl*3)*.5+.5,cr=noise((x>>1)+pl*97,y>>1,6),j=(q-pl)<.035?.52:1,f=(.66+b0*.16+w*.12+(cr-.5)*.06-(pl%2)*.06)*j*(.62+lu*1.25)*(1-z*.2);
      r=126*f;v=70*f;b=36*f;
    }
    d[i]=Math.min(255,r);d[i+1]=Math.min(255,v);d[i+2]=Math.min(255,b);d[i+3]=255;
  }
  g.putImageData(im,0,0);

  // Lambris et cimaise
  const wz=Z(30),haut=sol-wz;
  for(let x=0;x<W0;x++)P(tone('#2c1c14',(noise(x>>1,1,5)-.5)*.16),x,haut,1,wz);
  for(let x=Z(8);x<W0;x+=Z(46)){
    const y=sol-Z(26),w=Z(40),h=Z(22);
    P('#1a100c',x,y,w,h);P('#3a2618',x+2,y+2,w-3,h-3);P('#4a3020',x+5,y+5,w-10,h-10);P('#5e3e2a',x+5,y+5,w-10,1);P('#5e3e2a',x+5,y+5,1,h-10);P('#2a1a12',x+5,y+h-6,w-10,1);P('#2a1a12',x+w-6,y+5,1,h-10);P('#5a3c28',x+1,y+h-1,w,1);P('#5a3c28',x+w-1,y+1,1,h-1);
  }
  P('#6a4630',0,haut-4,W0,3);P('#8a6244',0,haut-4,W0,1);P('#2a1a12',0,haut-1,W0,1);P('rgba(5,4,12,.35)',0,haut,W0,3);

  // Fenêtre : ciel, lune et ville en deux plans
  for(let y=0;y<fh;y++)for(let x=0;x<fw;x++){const q=Math.floor(y/fh*7+bay(x,y))/7;P(melange('#0e1238','#3a2c5c',q),fx+x,fy+y)}
  for(let i=0;i<46;i++)P(i%5?'#8a90c0':'#ffffff',fx+noise(i,1,3)*fw,fy+noise(i,2,3)*fh*.5);
  const lux=fx+fw*.76,luy=fy+fh*.3;for(let a=-18;a<=18;a++)for(let b=-18;b<=18;b++){const r=Math.hypot(a,b);if(r<18&&r>8&&bay(a+18,b+18)<(18-r)/26)P('rgba(240,232,200,.45)',lux+a,luy+b)}
  O(lux,luy,8,8,'#f4eec8');O(lux-2,luy-2,2,2,'#d8d0a8');O(lux+3,luy+2,3,2,'#d8d0a8');O(lux+1,luy-4,1,1,'#d8d0a8');
  for(let i=0,n=0;i<fw;n++){const l=7+(noise(n,4,5)*10|0),h=(fh*.36+noise(n,5,5)*fh*.26)|0,L=Math.min(l,fw-i);P('#1c2048',fx+i,fy+fh-h,L,h);for(let j=fy+fh-h+3;j<fy+fh;j+=5)for(let a=2;a<L-1;a+=4)if(noise(fx+i+a,j,3)>.72)P('#6a6a98',fx+i+a,j);i+=l}
  for(let i=0,n=0;i<fw;n++){
    const l=11+(noise(n,1,5)*16|0),L=Math.min(l,fw-i),h=(fh*.2+noise(n,2,5)*fh*.42)|0,x=fx+i,y=fy+fh-h,q=noise(n,3,5);
    P('#0a0e24',x,y,L,h);P('#1a2040',x,y,1,h);P('#1a2040',x,y,L,1);
    if(q>.62){P('#0a0e24',x+(L>>1),y-7,1,7);P('#ff5a4a',x+(L>>1),y-8)}else if(q<.22&&L>10){P('#0a0e24',x+3,y-5,7,5);P('#141a38',x+4,y-6,5,1)}
    for(let j=y+3;j<fy+fh-2;j+=4)for(let a=2;a<L-2;a+=3)if(noise(x+a,j,7)>.56)P(noise(a,j,2)>.22?'#ffc860':'#8ad0e8',x+a,j,2,2);
    i+=l;
  }
  // Reflets et gouttes sur la vitre
  for(let i=0;i<60;i++){const a=fx+noise(i,6,4)*fw,b=fy+noise(i,7,4)*fh,l=2+(noise(i,8,4)*6|0);P('rgba(190,214,255,.32)',a,b,1,l);P('rgba(255,255,255,.7)',a,b+l,1,1)}
  for(let t=0;t<fw*.22;t++)P('rgba(210,226,255,.05)',fx+fw*.1+t,fy,1,fh);
  // Store vénitien
  const nb=8;for(let i=0;i<nb;i++){const y=fy+i*3;P('#444c64',fx,y,fw,2);P('#6a7290',fx,y,fw,1);P('#1a1e30',fx,y+2,fw,1)}P('#2a2e40',fx,fy+nb*3,fw,3);P('#8a90a8',fx+fw-14,fy+nb*3+3,1,14);O(fx+fw-14,fy+nb*3+18,1,2,'#c8a040');
  // Châssis de bois
  const e=Z(5),bd=(x,y,w,h,v)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)P(tone('#5b3820',(noise(v?(x+i)>>1:(x+i)>>3,v?(y+j)>>3:(y+j)>>1,8)-.5)*.22),x+i,y+j)};
  bd(fx-e,fy-e,fw+e*2,e,0);bd(fx-e,fy,e,fh,1);bd(fx+fw,fy,e,fh,1);bd(fx+(fw>>1)-2,fy,4,fh,1);bd(fx,fy+(fh>>1)-1,fw,3,0);
  P('#8a5a34',fx-e,fy-e,fw+e*2,1);P('#8a5a34',fx-e,fy-e,1,fh+e);P('#2a1a12',fx-1,fy,1,fh);P('#2a1a12',fx,fy-1,fw,1);P('#7a5230',fx+fw,fy,1,fh);
  P('#8a5a34',fx+(fw>>1)-2,fy,1,fh);P('#3a2416',fx+(fw>>1)+1,fy,1,fh);P('#8a5a34',fx,fy+(fh>>1)-1,fw,1);P('#3a2416',fx,fy+(fh>>1)+1,fw,1);
  bd(fx-e-3,fy+fh,fw+e*2+6,Z(6),0);P('#a87a4a',fx-e-3,fy+fh,fw+e*2+6,1);P('#2a1a12',fx-e-3,fy+fh+Z(6)-1,fw+e*2+6,1);P('rgba(5,4,12,.38)',fx-e-1,fy+fh+Z(6),fw+e*2+4,4);

  // Mur d'enquête : cadre, liège, fils et photos
  P('rgba(5,4,12,.4)',mx+4,my+5,mw,mh);
  for(let j=0;j<mh;j++)for(let i=0;i<mw;i++){const b=Math.min(i,j,mw-1-i,mh-1-j);if(b<5)P(tone('#5b3820',(noise(i>>2,j>>2,4)-.5)*.2+(b===0?.2:b===4?-.34:0)),mx+i,my+j);else{const n=noise(mx+i,my+j,6),c=n>.965?'#d8b888':n<.06?'#7a5430':tone('#a87e4c',(noise((mx+i)>>1,(my+j)>>1,5)-.5)*.2);P(c,mx+i,my+j)}}
  [[3,3],[mw-4,3],[3,mh-4],[mw-4,mh-4]].forEach(([a,b])=>{P('#c8ccd4',mx+a-1,my+b-1,2,2);P('#ffffff',mx+a-1,my+b-1)});
  const pts=[[.18,.2],[.62,.14],[.82,.46],[.3,.62],[.66,.78]].map(([a,b])=>[Math.floor(mx+a*mw),Math.floor(my+b*mh)]);
  const pinY=q=>q[1]-Z(6);
  [[0,1],[1,2],[0,3],[3,4],[2,4]].forEach(([a,b])=>{const p=pts[a],q=pts[b],n=Math.max(Math.abs(q[0]-p[0]),Math.abs(q[1]-p[1]));for(let i=0;i<=n;i++){const t=i/n,s=Math.sin(t*3.14)*4,x=p[0]+(q[0]-p[0])*t,y=pinY(p)+(pinY(q)-pinY(p))*t+s;P('rgba(40,20,10,.35)',x+1,y+2);P('#e04a3e',x,y);if(i%5===0)P('#ff7a6a',x,y)}});
  const peau=['#e8c8a8','#c89a70','#f0d0b0','#8a5a3c','#e0b890'],cheveu=['#3a2a22','#141226','#8a5a2a','#c8c0b0','#5a2a1a'],fond=['#3a4a6a','#7a5a3c','#3a6a4a','#6a3a4a','#4a4a5a'],veste=['#2a3040','#5a2a30','#2e4a3a','#3a3048','#6a5a3a'];
  pts.forEach(([x,y],i)=>{
    const w=Z(14)+2,h=Z(12)+6,a=x-(w>>1),b=y-(h>>1);
    P('rgba(30,16,8,.45)',a+2,b+3,w,h);P(i%2?'#f4ecd8':'#ece6da',a,b,w,h);P('#ffffff',a,b,w,1);P('#b8b0a0',a,b+h-1,w,1);
    const px=a+2,py=b+2,pw=w-4,ph=h-8;P(fond[i%5],px,py,pw,ph);
    for(let j=0;j<ph;j+=2)P('rgba(255,255,255,.04)',px,py+j,pw,1);
    const c0=px+(pw>>1);P(veste[i%5],px+2,py+ph-5,pw-4,5);P(veste[i%5],px+4,py+ph-7,pw-8,2);P('#ece6da',c0-1,py+ph-6,3,2);
    O(c0,py+ph-11,4,5,peau[i%5]);O(c0,py+ph-15,4,2,cheveu[i%5]);P(cheveu[i%5],c0-5,py+ph-15,2,4);P('#141226',c0-2,py+ph-11);P('#141226',c0+2,py+ph-11);P(tone(peau[i%5],-.3),c0,py+ph-9);
    P('#8a8fa8',a+3,b+h-5,w-8,1);P('#a33a3a',a+3,b+h-3,(w-8)>>1,1);
    O(x,b+1,2,2,'#c8302a');P('#ff8a7a',x-1,b);P('rgba(30,16,8,.5)',x+2,b+3,2,1);
  });

  // Bord du plateau
  P('#c89060',0,sol,W0,1);P('#9a6438',0,sol+1,W0,1);P('rgba(5,4,12,.3)',0,sol+2,W0,2);

  // Dossier ouvert
  P('rgba(10,6,4,.45)',cx-Z(46)+4,cy-Z(12)+5,Z(92),Z(40));
  P('#b08a50',cx-Z(46)+6,cy-Z(12)-4,30,5);P('#d8b878',cx-Z(46)+6,cy-Z(12)-4,30,1);
  P('#c8a468',cx-Z(46),cy-Z(12),Z(92),Z(40));P('#e0c080',cx-Z(46),cy-Z(12),Z(92),1);P('#8a6a38',cx-Z(46),cy+Z(28)-1,Z(92),1);
  const page=(x,y,w,h)=>{for(let i=3;i>0;i--)P(i%2?'#d8d0bc':'#c8c0a8',x+i,y+i,w,h);P('#f0e8d8',x,y,w,h);P('#ffffff',x,y,w,1)};
  const px1=cx-Z(42),px2=cx+Z(2),py=cy-Z(10),pw=Z(40),ph=Z(36);page(px1,py,pw,ph);page(px2,py,pw,ph);
  for(let i=0;i<10;i++){P('rgba(90,60,30,.16)',cx-5+i,cy-Z(12),1,Z(40))}P('#8a6a38',cx,cy-Z(12),1,Z(40));
  // Page de gauche : rapport tapé, tampon rouge
  P('#2a2a3a',px1+7,py+5,pw-30,3);P('#a33a3a',px1+pw-18,py+5,12,3);
  for(let i=0;i<11;i++){const y=py+12+i*4;let x=px1+6,e0=px1+pw-6-(i===10?20:0),n=i*7;while(x<e0){const l=3+(noise(n++,i,5)*11|0);P('#6a6e88',x,y,Math.min(l,e0-x),1);x+=l+2}}
  const sx=px1+10,sy=py+ph-16;P('rgba(200,50,44,.75)',sx,sy,34,1);P('rgba(200,50,44,.75)',sx,sy+9,34,1);P('rgba(200,50,44,.75)',sx,sy,1,10);P('rgba(200,50,44,.75)',sx+33,sy,1,10);for(let i=0;i<8;i++)P('rgba(200,50,44,.75)',sx+3+i*4,sy+3,3,4);
  // Page de droite : photo trombonée et notes
  const fxp=cx+Z(8),fyp=cy-Z(2);P('rgba(60,40,20,.3)',fxp+2,fyp+2,Z(14),Z(16));P('#fbf6ea',fxp,fyp,Z(14),Z(16));P('#3a4a6a',fxp+2,fyp+2,Z(14)-4,Z(16)-8);
  const pc=fxp+Z(7);P('#2a3040',fxp+3,fyp+Z(16)-11,Z(14)-6,5);O(pc,fyp+9,3,4,'#e8c8a8');O(pc,fyp+6,3,1,'#3a2a22');P('#141226',pc-1,fyp+9);P('#141226',pc+1,fyp+9);
  [[0,0,1,12],[3,3,1,7],[0,0,5,1],[5,0,1,10],[3,10,3,1],[0,12,3,1]].forEach(([a,b,c,e1])=>P('#a8b0ba',fxp+6+a,fyp-4+b,c,e1));
  for(let i=0;i<5;i++)P('#2a3a6a',px2+6,py+6+i*3,pw-12-(i*5)%14,1);for(let i=0;i<8;i++)P('#2a3a6a',fxp+Z(14)+4,fyp+1+i*3,pw-Z(20)-4-(i*3)%8,1);

  // Loupe : monture de laiton, verre et manche tourné
  const lpx=cx+Z(58),lpy=cy+Z(8),lr=Z(11);
  O(lpx+4,lpy+5,lr,lr,'rgba(10,6,4,.4)');T('rgba(10,6,4,.4)',lpx+Z(8)+4,lpy+Z(8)+5,lpx+Z(22)+4,lpy+Z(22)+5,5);
  for(let j=-lr;j<=lr;j++)for(let i=-lr;i<=lr;i++){const r=Math.hypot(i,j);if(r>lr+.4)continue;const a=(i+j)/(lr*2);P(r>lr-3?tone('#c8a040',-a*.7+(r>lr-1?.14:0)):tone('#a8d8f0',-a*.5+(r<lr*.5?.08:0)),lpx+i,lpy+j)}
  for(let a=3.5;a<4.9;a+=.04)P('#ffffff',lpx+Math.cos(a)*(lr-6),lpy+Math.sin(a)*(lr-6),2,1);for(let a=.5;a<1;a+=.05)P('#e4f4fc',lpx+Math.cos(a)*(lr-6),lpy+Math.sin(a)*(lr-6));
  const hx0=lpx+Z(7.5),hy0=lpy+Z(7.5);T('#c8a040',hx0,hy0,hx0+5,hy0+5,5);P('#fff0a8',hx0,hy0+1,2,1);
  for(let i=0;i<Z(14);i++){const x=hx0+5+i,y=hy0+5+i;P('#3a2212',x,y,6,6);P('#7a4a26',x,y,5,4);P('#a87040',x+1,y,2,2)}P('#c8a040',hx0+5+Z(14),hy0+5+Z(14),6,6);

  // Tasse sur sa soucoupe
  const tx=cx-Z(74),ty=cy+Z(6),tw=Z(9);
  O(tx+3,ty+Z(11)+3,Z(13),4,'rgba(10,6,4,.4)');O(tx,ty+Z(11),Z(12),4,'#d8d4c8');O(tx,ty+Z(11)-1,Z(11),3,'#f4f0e4');P('#2e5a8c',tx-Z(11),ty+Z(11),2,1);P('#2e5a8c',tx+Z(11)-1,ty+Z(11),2,1);
  for(let i=-tw;i<=tw;i++){const q=(i+tw)/(tw*2);for(let j=0;j<Z(10);j++){const c=j>Z(10)-4&&Math.abs(i)>tw-3?null:tone('#f4efe2',.12-q*.42);if(c)P(c,tx+i,ty+j)}}
  O(tx,ty+Z(10),tw-2,2,'#e4dcc8');P('#2e5a8c',tx-tw,ty+3,tw*2+1,2);P('#c8a040',tx-tw,ty+6,tw*2+1,1);
  O(tx,ty,tw,3,'#f8f4ea');O(tx,ty,tw-2,2,'#3a2212');O(tx-2,ty,3,1,'#6a4226');P('#b08a60',tx-4,ty-1,3,1);
  for(let a=-1.4;a<1.5;a+=.12){P('#f4efe2',tx+tw+Math.cos(a)*6,ty+7+Math.sin(a)*5,2,2);P('#b8b0a0',tx+tw+Math.cos(a)*7+1,ty+7+Math.sin(a)*6)}
  G.vapeur={x:tx,y:ty-3};

  // Téléphone à cadran
  const bx=cx-Z(132),by=cy-Z(4),bw=Z(38),bh=Z(20);
  P('rgba(10,6,4,.4)',bx+3,by+bh,bw+4,5);
  for(let j=0;j<bh;j++){const m=Math.round(10*(1-j/bh));P(tone('#22222c',.04-j*.012),bx+m-4,by+j,bw-m*2+8,1)}
  P('#4a4a5a',bx+4,by,bw-8,1);P('#3a3a48',bx+1,by+6,1,bh-8);P('#0c0c12',bx-4,by+bh-1,bw+8,2);P('#3a3a48',bx-6,by+bh,4,3);P('#3a3a48',bx+bw+2,by+bh,4,3);
  // Fourche et combiné
  P('#14141c',bx+6,by-5,4,6);P('#14141c',bx+bw-10,by-5,4,6);
  const hx=cx-Z(136),hy=cy-Z(10),hw=Z(46);
  P('#1a1a22',hx+10,hy,hw-20,7);P('#3e3e4e',hx+10,hy+1,hw-20,1);P('#0c0c14',hx+10,hy+6,hw-20,1);
  [hx+7,hx+hw-7].forEach(a=>{O(a,hy+6,8,5,'#22222c');O(a-1,hy+4,5,2,'#3e3e4e');P('#0c0c14',a-6,hy+10,12,2);for(let i=-1;i<=1;i++)P('#4a4a5a',a+i*3,hy+6)});
  // Cadran
  const dx=cx-Z(113),dy=cy+Z(6);O(dx,dy,11,10,'#0e0e16');O(dx,dy,10,9,'#c8ccd4');O(dx,dy,9,8,'#8a90a0');
  for(let i=0;i<10;i++){const a=-1+i*.55;O(dx+Math.cos(a)*6.4,dy+Math.sin(a)*5.6,1,1,'#f4f0e4');P('#141226',dx+Math.cos(a)*6.4,dy+Math.sin(a)*5.6)}
  O(dx,dy,3,3,'#f4efe2');P('#a33a3a',dx-2,dy-1,5,1);P('#2a2a3a',dx-2,dy+1,5,1);P('#ffffff',dx-9,dy-5,4,1);
  // Fil en spirale
  for(let i=0;i<34;i++){const a=hx-6+Math.sin(i*.8)*3,b=hy+10+i*.9;P('#14141c',a,b);P('#3a3a48',a,b-1)}for(let i=0;i<12;i++)P('#14141c',hx-6+i,hy+40,1,2);

  // Lampe de banquier
  const lpb=ly+Z(22);O(lx+3,lpb+3,Z(10),4,'rgba(10,6,4,.4)');O(lx,lpb,Z(9),3,'#a88432');O(lx,lpb-1,Z(9)-1,2,'#d8b050');P('#fff0a8',lx-8,lpb-2,5,1);
  P('#8a6a28',lx-1,ly,4,Z(22));P('#e0c060',lx-1,ly,1,Z(22));P('#c8a040',lx,ly,2,Z(22));[ly+8,ly+18].forEach(y=>{P('#e0c060',lx-3,y,8,2);P('#8a6a28',lx-3,y+2,8,1)});
  for(let j=0;j<15;j++){const w=13+Math.round(Math.sqrt(j+1)*3.4),y=ly-16+j;for(let i=-w;i<=w;i++){const q=(i+w)/(w*2),s=Math.abs(q-.34)<.05?.34:0;P(tone('#2e7a5a',.1-q*.5+s-j*.012),lx+i,y)}}
  P('#e0c060',lx-27,ly-1,55,2);P('#a88432',lx-27,ly+1,55,1);O(lx,ly-16,6,1,'#c8a040');
  P('#fff4c8',lx-21,ly+2,43,2);P('rgba(255,244,200,.5)',lx-25,ly+4,51,2);
  P('#c8a040',lx+18,ly+2,1,12);O(lx+18,ly+15,1,2,'#e0c060');

  G.fenAcc={x:fx,y:fy+nb*3+3,w:fw,h:fh-nb*3-3};
  return k;
}

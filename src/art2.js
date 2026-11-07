// Deuxième planche : mobilier de maison et de bureau, visages, icônes, papier, écran d'accueil.
Object.assign(SPR,{
  tub(g){box(g,0,6,48,28,'#e8e4dc');R(g,'#ffffff',2,7,44,2);R(g,'#b8c4c8',4,10,40,14);for(let j=0;j<12;j++)R(g,tone('#6ea8c8',(j%4===0?.25:-.05)),5,11+j,38,1);R(g,'#ffffff',9,13,10,1);R(g,'#ffffff',26,18,8,1);R(g,'#c8a040',22,3,4,6);R(g,'#c8a040',20,3,8,2);R(g,'#c8c0b0',2,26,44,7)},
  toilet(g){box(g,3,0,10,14,'#ecE8e0'.toLowerCase());R(g,'#c8c4bc',4,4,8,1);box(g,2,12,12,13,'#f0ece4');R(g,'#b8c4c8',4,14,8,6);R(g,'#8a9aa0',5,15,6,3);R(g,'#c8c4bc',4,21,8,3)},
  shower(g){box(g,0,0,32,44,'#7a9aa8');for(let j=0;j<7;j++)for(let i=0;i<5;i++){R(g,tone('#a8c4cc',(noise(i,j,4)-.5)*.2),2+i*6,2+j*6,5,5)}R(g,'#c8d0d8',20,4,2,10);R(g,'#c8d0d8',14,4,8,2);R(g,'#e0e4e8',12,6,6,2);for(let i=0;i<8;i++)R(g,'#d8ecf8',12+i,10+(i*5)%14,1,3);R(g,'rgba(220,240,250,.28)',1,1,14,41);R(g,'#c8d0d8',15,1,1,41)},
  desk(g,v){box(g,0,8,48,24,'#6d4628');R(g,'#a87a4a',0,6,48,5);R(g,'#c89a6a',1,6,46,1);box(g,2,13,14,16,'#7a5230');box(g,32,13,14,16,'#7a5230');R(g,'#e0c060',8,18,3,1);R(g,'#e0c060',8,24,3,1);R(g,'#e0c060',38,18,3,1);R(g,'#e0c060',38,24,3,1);R(g,'#ecdfc0',20,2,12,5);R(g,'#8a8fa8',22,3,8,1);R(g,'#2a3a6a',36,1,2,6);R(g,'#3a7a48',6,2,6,4);R(g,'#ffd878',8,0,2,2)},
  pcdesk(g,v){box(g,0,16,48,18,'#8a939e');R(g,'#c8d0d8',0,14,48,4);R(g,'#5a636e',2,32,3,4);R(g,'#5a636e',43,32,3,4);box(g,14,0,20,14,'#2d3440');for(let j=0;j<8;j++)for(let i=0;i<14;i++)if(noise(i,j,v)>.4)R(g,(j+v)%3?'#6ad0ff':'#5dffa0',17+i,3+j);R(g,'#5a636e',22,13,4,2);R(g,'#e8e8ee',14,16,18,2);R(g,'#c8d0d8',36,15,6,3);R(g,'#ecdfc0',3,15,8,3)},
  commode(g,v){const c=['#7a5230','#5f3b22','#8a6a44'][v%3];box(g,0,8,32,24,c);R(g,tone(c,.32),0,6,32,4);for(let j=0;j<3;j++){box(g,2,11+j*7,28,7,tone(c,.08));R(g,'#e0c060',9,14+j*7,2,1);R(g,'#e0c060',21,14+j*7,2,1)}R(g,'#c8c0a8',5,0,5,6);R(g,'#7ea8c0',20,2,6,4);R(g,'#ffffff',21,3,4,2)},
  chevet(g,v){box(g,1,10,14,16,'#6d4628');R(g,'#a87a4a',0,8,16,4);box(g,3,13,10,6,'#7a5230');R(g,'#e0c060',7,15,2,1);R(g,'#5b3820',3,23,2,3);R(g,'#5b3820',11,23,2,3);R(g,'#ffdc8a',4,0,8,5);R(g,'#fff4c8',5,1,6,3);R(g,'#c8a040',7,5,2,3)},
  lift(g){box(g,0,0,32,46,'#6a7482');box(g,3,8,13,36,'#b8c4d0');box(g,16,8,13,36,'#a8b4c0');R(g,'#ffffff',5,10,1,32);R(g,'#2a2d34',15,8,2,36);box(g,9,1,14,6,'#141820');R(g,'#ff6a5a',11,3,3,2);R(g,'#ff6a5a',15,3,3,2);R(g,'#ff6a5a',19,3,2,2);R(g,'#d8483e',29,24,2,4)},
  medic(g){box(g,0,2,16,40,'#e8ecec');R(g,'#b8c4c8',7,3,1,38);R(g,'#d8483e',2,10,4,2);R(g,'#d8483e',3,9,2,4);R(g,'#d8483e',10,10,4,2);R(g,'#d8483e',11,9,2,4);R(g,'#8a939e',5,22,1,4);R(g,'#8a939e',9,22,1,4)},
  washer(g){box(g,0,2,16,26,'#e0e4e8');R(g,'#5a636e',2,4,8,2);R(g,'#ffd23f',12,4,2,2);for(let y=-6;y<=6;y++)for(let x=-6;x<=6;x++){const d=x*x+y*y;if(d<=36)R(g,d>25?'#8a939e':tone('#6ea8c8',(x+y)*.03),8+x,17+y)}},
  copier(g){box(g,0,8,16,24,'#c8d0d8');box(g,1,2,14,8,'#8a939e');R(g,'#ecdfc0',3,0,10,3);R(g,'#2d3440',3,13,10,3);R(g,'#5dffa0',4,14,2,1);R(g,'#5a636e',2,22,12,2)},
  roulette(g){box(g,0,4,48,36,'#5b3820');R(g,'#1f5a3a',3,7,42,30);for(let y=-11;y<=11;y++)for(let x=-11;x<=11;x++){const d=x*x+y*y;if(d<=121){const a=Math.atan2(y,x),s=Math.floor((a+3.15)/.42)%2;R(g,d<20?'#c8a040':d>90?(s?'#a33a3a':'#141418'):'#7a4c2a',16+x,22+y)}}for(let i=0;i<6;i++){R(g,i%2?'#a33a3a':'#141418',32,10+i*4,10,3)}R(g,'#ffffff',16,12,2,2);R(g,'#3a2416',4,40,4,4);R(g,'#3a2416',40,40,4,4)},
  engine(g,v){box(g,0,6,48,42,'#4a5462');for(let i=0;i<4;i++){box(g,3+i*11,10,10,22,'#6a7482');R(g,'#d8483e',6+i*11,12,4,3)}R(g,'#c8a040',0,34,48,3);R(g,'#2d3440',4,38,40,7);for(let i=0;i<9;i++)R(g,'#8a939e',6+i*4,40,2,3);R(g,'#8a939e',20,0,8,8);R(g,'#c8d0d8',22,1,4,6)}
});
const miroirSpr=(n,w0)=>(g,v)=>{g.save();g.translate(w0,0);g.scale(-1,1);SPR[n](g,v);g.restore()};
Object.assign(SPR,{
  chairB(g,v){const c=['#8a3a3a','#3a5a8a','#4a7a4a'][v%3];R(g,tone(c,.1),3,3,10,5);box(g,2,6,12,14,'#5b3820');box(g,4,8,8,9,'#6d4628');R(g,'#3a2416',3,20,2,5);R(g,'#3a2416',11,20,2,5)},
  chairR(g,v){const c=['#8a3a3a','#3a5a8a','#4a7a4a'][v%3];box(g,2,0,4,19,'#5b3820');box(g,3,11,11,6,c);R(g,tone(c,.25),4,12,9,1);R(g,'#3a2416',3,17,2,8);R(g,'#3a2416',12,17,2,8)},
  armchairB(g,v){const c=['#7a4f2a','#5a2f4a','#2f5a5a'][v%3];R(g,tone(c,.14),3,2,10,4);box(g,0,4,16,20,c);R(g,tone(c,-.16),2,9,12,1);R(g,tone(c,-.16),2,15,12,1);R(g,'#3a2416',2,24,2,2);R(g,'#3a2416',12,24,2,2)},
  armchairR(g,v){const c=['#7a4f2a','#5a2f4a','#2f5a5a'][v%3];box(g,0,1,6,23,c);box(g,4,12,11,11,tone(c,.12));box(g,3,8,12,5,tone(c,-.1));R(g,'#3a2416',2,24,2,2);R(g,'#3a2416',12,24,2,2)},
  sofaB(g,v){const c=['#7a2f3a','#2e5a78','#5a6a3a'][v%3];for(let i=0;i<2;i++)R(g,tone(c,.16),6+i*18,2,18,5);box(g,0,5,48,23,c);R(g,tone(c,-.18),3,12,42,1);R(g,tone(c,-.18),3,20,42,1);R(g,tone(c,-.18),23,6,2,20);R(g,'#3a2416',3,28,3,2);R(g,'#3a2416',42,28,3,2)},
  basse(g,v){box(g,1,3,46,13,'#7a4c2a');R(g,'#a87a4a',2,4,44,1);R(g,'#5b3820',4,16,3,5);R(g,'#5b3820',41,16,3,5);R(g,'#ecdfc0',10,6,10,7);R(g,'#8a8fa8',12,8,6,1);R(g,'#ffffff',30,6,6,6);R(g,'#7ea8c0',31,7,4,4)}
});
SPR.chairL=miroirSpr('chairR',16);SPR.armchairL=miroirSpr('armchairR',16);
Object.assign(SH,{chairB:25,chairL:25,chairR:25,armchairB:26,armchairL:26,armchairR:26,sofaB:30,basse:21,tub:34,toilet:25,shower:44,desk:32,pcdesk:36,commode:32,chevet:26,lift:46,medic:42,washer:28,copier:32,roulette:44,engine:48});

// ——— Personnages : apparence et portraits ———
function lookOf(s,i,seed){
  const r=RNG(seed*97+i*13+7),f=s.g==='f',age=int(r,3);
  const fhs=f?pick(r,[2,3,4,7,5,8]):pick(r,[0,1,5,6,9,0,6]);
  return{skin:pick(r,SKINS),hair:age===2&&r()<.7?pick(r,['#c8c8d0','#a8a8b0','#e0e0e4']):pick(r,HAIRS.slice(0,5)),fhs,hs:{0:0,1:1,2:2,3:3,4:4,5:0,6:0,7:2,8:2,9:1}[fhs],age,eye:pick(r,['#3a2a1a','#2e5a7a','#3a6a4a','#5a3a22','#6a7a8a']),
    top:TOPS[(i*3+seed)%TOPS.length],bot:pick(r,['#26304a','#3a2d28','#2f3a3a','#4a3a5a']),f,glasses:r()<.3,beard:!f&&r()<.4,hat:false,dress:f&&r()<.5,ear:r()<.6,tie:!f&&r()<.6,
    trait:s.trait||''};
}
function portrait(L,seed=1){
  const Z=96,[bgk,bg]=cv(Z,Z),[k,g]=cv(Z,Z),cx=48,f=L.f;
  const mk=(h,a)=>a.map(v=>tone(h,v)),A7=[-.6,-.42,-.26,-.1,.06,.22,.38];
  const sk=mk(L.skin,A7),hr=mk(L.hair,[-.62,-.46,-.3,-.14,.02,.2,.36]),tp=mk(L.top,[-.56,-.4,-.24,-.08,.08,.22,.34]);
  const pickR=(r,v,x,y)=>{const n=r.length,t=Math.max(0,Math.min(1,v))*(n-1)+(bay(x,y)-.5)*.7;return r[Math.max(0,Math.min(n-1,Math.round(t)))]};
  const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h);
  // fond : mur sombre avec halo derrière la tête
  const fond=mk(tone(TOPS[(seed*5)%TOPS.length],-.5),[-.3,-.16,0,.14,.3]);
  for(let y=0;y<Z;y++)for(let x=0;x<Z;x++)R(bg,pickR(fond,.68-Math.hypot(x-36,y-34)/70,x,y),x,y);
  const top=20,chin=f?72:73,head=y=>{const t=(y-top)/(chin-top);return t<.5?18.6*Math.sqrt(Math.max(0,1-Math.pow((.5-t)/.53,2))):18.6*(1-Math.pow((t-.5)/.5,1.9)*(f?.66:.54))};
  const hs=L.fhs,longue=hs===2||hs===3||hs===8;
  // cheveux derrière
  for(let y=8;y<86;y++)for(let x=8;x<88;x++){
    const dx=x-cx;let on=false;
    if(longue)on=y>16&&y<(hs===3?80+Math.sin(x*.6)*3:78)&&Math.abs(dx)<(y<40?22:24+Math.sin(y*.4)*(hs===3?3:1))&&(Math.pow(dx/22,2)+Math.pow((y-38)/26,2)<1||y>=38);
    if(hs===7)on=y>16&&y<63&&Math.abs(dx)<23&&(Math.pow(dx/23,2)+Math.pow((y-38)/25,2)<1||y>=38);
    if(hs===5)on=Math.hypot(dx,(y-34)*1.05)<29+noise(x>>2,y>>2,seed)*3;
    if(hs===4)on=Math.hypot(dx,y-11)<10;
    if(on)P(pickR(hr,.34-dx*.008+Math.sin(x*1.1+y*.3+seed)*.1+(hs===5?noise(x>>1,y>>1,seed)*.3-.1:0),x,y),x,y);
  }
  // épaules et vêtements
  for(let y=70;y<Z;y++)for(let x=0;x<Z;x++){
    const dx=x-cx,rx=f?37:43,e=Math.pow(dx/rx,2)+Math.pow((y-108)/36,2);
    if(e<1)P(pickR(tp,.6-dx*.012-(y-78)*.008+(Math.abs(dx)>rx*.72?-.12:0),x,y),x,y);
  }
  // cou
  const nw=f?7:9;
  for(let y=62;y<84;y++)for(let x=cx-nw;x<=cx+nw;x++)P(pickR(sk,.5-(x-cx)*.03-Math.max(0,74-y)*.022,x,y),x,y);
  // col
  if(L.trench){for(let i=0;i<14;i++){P(tp[1],cx-12-i,74+i,6,2);P(tp[1],cx+7+i,74+i,6,2);P(tp[5],cx-12-i,74+i,5,1);P(tp[5],cx+7+i,74+i,5,1)}P('#ece8dc',cx-6,78,12,6);P('#7a2f3a',cx-2,80,4,16)}
  else if(f){for(let i=0;i<16;i++){P(pickR(sk,.56-(i*.012),cx,cx),cx-11+Math.floor(i*.7),78+i,22-Math.floor(i*1.4)<0?0:22-Math.floor(i*1.4),1)}if(L.ear)for(let i=-9;i<=9;i++)P('#e0c060',cx+i,86-Math.round((i*i)/10),1,1)}
  else{P('#ece8dc',cx-11,78,9,6);P('#ece8dc',cx+3,78,9,6);P('#c8c4b8',cx-11,83,9,1);P('#c8c4b8',cx+3,83,9,1);P('#ece8dc',cx-3,80,7,16);if(L.tie){P(tone(L.top,.3),cx-2,80,5,4);P(tone(L.top,.18),cx-3,84,7,12);P(tone(L.top,-.1),cx+2,84,1,12)}}
  // visage
  for(let y=top;y<=chin;y++){
    const w=head(y),t=(y-top)/(chin-top);
    for(let x=Math.ceil(cx-w);x<=Math.floor(cx+w);x++){
      const nx=(x-cx)/w,ny=t*2-1,nz=Math.sqrt(Math.max(0,1-nx*nx*.86));
      let li=.26+.52*nz-.17*nx-.1*ny;
      if(Math.pow((x-(cx-9))/9,2)+Math.pow((y-43)/4.5,2)<1||Math.pow((x-(cx+9))/9,2)+Math.pow((y-43)/4.5,2)<1)li-=.13;
      if(Math.pow((x-(cx-10))/6,2)+Math.pow((y-53)/4,2)<1)li+=.08;
      if(x>=cx-2&&x<=cx&&y>41&&y<54)li+=.09;
      if(x>=cx+2&&x<=cx+3&&y>42&&y<55)li-=.13;
      if(y>66&&Math.abs(x-cx)<6)li+=.05;
      P(pickR(sk,li,x,y),x,y);
    }
  }
  // oreilles
  if(!longue&&hs!==7&&hs!==5){[-1,1].forEach(s=>{for(let y=44;y<55;y++){const w=y<50?3:2;P(sk[s<0?4:2],s<0?cx-19-w+1:cx+18,y,w,1)}P(sk[1],s<0?cx-20:cx+19,47,1,4)})}
  if(f&&L.ear&&(hs===4||hs===7)){P('#e0c060',cx-20,55,2,3);P('#e0c060',cx+19,55,2,3)}
  // yeux
  const eyeY=43;
  [-1,1].forEach(s=>{
    const ex=cx+s*9,b=f?'#22161a':tone(L.hair,-.5);
    P('#f0ece4',ex-3,eyeY-1,7,1);P('#f0ece4',ex-4,eyeY,9,2);P('#e0dcd4',ex-2,eyeY+2,5,1);
    P(sk[1],s<0?ex-4:ex+4,eyeY+1,1,1);
    const ix=ex-1;
    P(tone(L.eye,-.2),ix,eyeY-1,4,4);P(L.eye,ix+1,eyeY+1,2,2);P(tone(L.eye,.34),ix,eyeY+2,4,1);P('#0e0e16',ix+1,eyeY,2,2);P('#ffffff',ix,eyeY-1,1,1);
    P(b,ex-4,eyeY-2,9,f?2:1);if(f){P(b,s<0?ex-6:ex+5,eyeY-3,2,1);P(b,s<0?ex-5:ex+4,eyeY-2,1,2)}
    P(sk[1],ex-3,eyeY-4,7,1);P(sk[2],ex-3,eyeY+3,7,1);
    // sourcil
    const bc=tone(L.hair,-.38);
    for(let i=-5;i<=5;i++){const o=Math.round((1-(i*s+1)*(i*s+1)/30)*2.4);P(bc,ex+i,37-o+1,1,f?1:(i*s>3?1:2))}
  });
  // nez
  P(sk[2],cx+3,48,1,6);P(sk[6],cx-1,50,2,3);P(sk[5],cx-2,54,3,1);P(sk[1],cx-4,56,2,1);P(sk[1],cx+3,56,2,1);P(sk[2],cx-2,57,5,1);P(sk[3],cx+4,54,1,2);P(sk[3],cx-5,54,1,2);
  P(sk[3],cx,59,1,2);
  // bouche
  const lip=f?'#b0384a':tone(L.skin,-.34),lipH=f?'#d8606a':tone(L.skin,-.14),mw=f?6:6;
  P(tone(lip,-.2),cx-mw,62,mw*2+1,1);P(lip,cx-mw+2,61,4,1);P(lip,cx+1,61,4,1);P(lip,cx-mw+1,63,mw*2-1,2);P(lipH,cx-3,63,5,1);P(sk[2],cx-mw-1,62,1,1);P(sk[2],cx+mw+1,62,1,1);P(sk[3],cx-3,66,7,1);
  // âge, joues
  if(f)dith(g,'#e8806a',cx-14,50,8,5,.24),dith(g,'#e8806a',cx+7,50,8,5,.24);
  if(L.age===2){P(sk[3],cx-9,31,18,1);P(sk[3],cx-7,34,14,1);P(sk[2],cx-11,55,1,6);P(sk[2],cx+10,55,1,6);P(sk[3],cx-15,44,2,1);P(sk[3],cx+14,44,2,1)}
  if(L.age===1){P(sk[3],cx-7,32,14,1);P(sk[3],cx-10,57,1,3);P(sk[3],cx+10,57,1,3)}
  // barbe
  if(L.beard){
    for(let y=52;y<=chin+3;y++){const w=head(Math.min(y,chin))+(y>chin?-6:0);for(let x=Math.ceil(cx-w);x<=Math.floor(cx+w);x++){
      if(y<58&&Math.abs(x-cx)<w-5)continue;
      if(y>=60&&y<=65&&Math.abs(x-cx)<7)continue;
      if(y>=57&&y<60&&Math.abs(x-cx)<2)continue;
      if(y>=57||Math.abs(x-cx)>=w-5)P(pickR(hr,.42+Math.sin(x*1.7+y)*.14-(x-cx)*.01,x,y),x,y);
    }}
  }
  // chevelure de devant
  for(let y=4;y<70;y++)for(let x=20;x<76;x++){
    const dx=x-cx,a=Math.abs(dx),cap=Math.pow(dx/21,2)+Math.pow((y-39)/24,2)<1;let on=false;
    if(hs===0)on=cap&&y<(a>15?47:27+a*.26+(dx<-4?2:0));
    if(hs===1)on=cap&&y<(a>15?45:26+(a<7?3:a*.05));
    if(hs===6)on=cap&&y<(a>15?44:28+a*.14+Math.abs(Math.sin(dx*.2))*2);
    if(hs===9)on=cap&&a>15&&y>33&&y<49;
    if(hs===2||hs===3)on=cap&&y<26+a*.95||(a>15&&a<24&&y<66&&y>36);
    if(hs===8)on=cap&&y<(dx<0?28+(dx+21)*.15:24+dx*.9)||(a>15&&a<24&&y<64&&y>36);
    if(hs===4)on=cap&&y<27+a*.36;
    if(hs===5)on=y<31+Math.sin(x*.9)*2&&Math.pow(dx/25,2)+Math.pow((y-34)/26,2)<1;
    if(hs===7)on=cap&&y<36+Math.sin(x*.5)||(a>15&&a<24&&y<62&&y>36);
    if(on){
      const v=.5-dx*.01-(y-14)*.006+Math.sin(x*1.15+y*.32+seed)*.13+(Math.abs(y-24)<3?.18:0)+(hs===5?noise(x>>1,y>>1,seed+2)*.3-.14:0);
      P(pickR(hr,v,x,y),x,y);
    }
  }
  if(hs===9){for(let i=0;i<9;i++)P(sk[6],cx-7+i,25+(i>>2),1,1)}
  // lunettes
  if(L.glasses){
    [-1,1].forEach(s=>{const ex=cx+s*9,c='#16141c';P(c,ex-6,39,12,1);P(c,ex-6,47,12,1);P(c,ex-7,40,1,7);P(c,ex+6,40,1,7);dith(g,'#cfe6ff',ex-5,40,11,7,.16);P('#ffffff',ex-4,41,2,1)});
    P('#16141c',cx-2,41,5,1);P('#16141c',cx-19,41,3,1);P('#16141c',cx+16,41,3,1);
  }
  if(L.hat){const h=L.trench?'#6b5a42':tone(L.top,-.3);for(let y=2;y<26;y++){const w=y>20?33:22-Math.abs(y-12)*.1;for(let x=Math.round(cx-w);x<=cx+w;x++)P(pickR(mk(h,[-.42,-.2,0,.2]),.62-(x-cx)*.012-(y>20?.2:0),x,y),x,y)}P('#2a2030',cx-22,17,44,3)}
  if(L.trait.includes('cigarillo')){P('#7a4f2a',cx+4,63,15,2);P('#a8784a',cx+4,63,15,1);P('#ff6a3a',cx+19,63,2,2);for(let i=0;i<12;i++)P('#c8d0dc',cx+21+Math.round(Math.sin(i*.9)*2),60-i*3,1,2)}
  if(L.trait.includes('vétiver')){P('#d84a6a',cx-27,82,6,6);P('#ff8aa8',cx-26,83,3,2);P('#ffd23f',cx-25,84,1,1);P('#3a7a48',cx-24,88,1,6)}
  if(L.trait.includes('gants')){for(let y=84;y<96;y++)P(pickR(mk('#4a2e1e',[-.3,-.1,.1,.3]),.5,cx+27,y),cx+24,y,14,1);P('#7a4f2a',cx+25,85,12,1)}
  if(L.trait.includes('canne')){P('#6b3f22',cx+33,60,3,36);P('#a8703a',cx+33,60,1,36);P('#d8b35c',cx+30,57,8,3);P('#ffe08a',cx+30,57,6,1)}
  outlineSprite(k,'#140f1c');
  bg.drawImage(k,0,0);
  return bgk;
}
function paperTexture(base='#eadcb8'){
  const[k,g]=cv(64,64);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){const n=noise(x,y,8),m=noise(x>>2,y>>2,9);R(g,tone(base,(n-.5)*.05+(m-.5)*.06-(n>.97?.1:0)),x,y)}
  return k.toDataURL();
}

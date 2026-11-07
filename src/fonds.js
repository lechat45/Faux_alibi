// ——— Le fond de chaque mini-jeu : l'intérieur du meuble qu'on vient d'ouvrir ———
const FOND_MEUBLE={wardrobe:'armoire',locker:'casier',shelf:'etagere',commode:'facade',chevet:'facade',desk:'facade',pcdesk:'facade',cabinet:'facade',counter:'placard',bar:'placard',sink:'evier',washer:'tambour',fridge:'frigo',medic:'pharmacie',vanity:'pharmacie',fireplace:'foyer'};
const FOND_DEFAUT={couches:'facade',coussins:'facade',horloge:'facade',pot:'facade',piano:'facade',livres:'etagere',cintres:'armoire',poussiere:'foyer',crochet:'facade',memo:'pharmacie',tatons:'placard'};
function fondMeuble(fam,s){
  const W0=SCENE_W,H0=SCENE_H,[k,g]=cv(W0,H0),c='#6d4628',ombre=(n,a)=>{for(let i=0;i<n;i++){const f=(a*(n-i)/n).toFixed(2);R(g,`rgba(6,4,10,${f})`,i,0,1,H0);R(g,`rgba(6,4,10,${f})`,W0-1-i,0,1,H0);R(g,`rgba(6,4,10,${f})`,0,i,W0,1)}};
  if(fam==='armoire'){
    bois(g,0,0,W0,H0,tone(c,-.42),s);for(let x=8;x<W0;x+=38){R(g,tone(c,-.6),x,0,1,H0);R(g,tone(c,-.3),x+1,0,1,H0)}
    R(g,tone(c,.04),0,0,W0,8);R(g,tone(c,.26),0,7,W0,1);R(g,'rgba(6,4,10,.5)',0,8,W0,3);
    ombre(30,.5);bois(g,0,0,9,H0,tone(c,.12),s+1);bois(g,W0-9,0,9,H0,tone(c,.12),s+2);
    R(g,'#5a636e',9,16,W0-18,5);R(g,'#c8ccd4',9,17,W0-18,2);R(g,'#ffffff',9,17,W0-18,1);R(g,'#3a424c',9,21,W0-18,1);[12,W0-16].forEach(x=>{R(g,'#8a939e',x,12,4,12);R(g,'#c8ccd4',x,12,1,12)});
    bois(g,9,H0-20,W0-18,20,tone(c,.08),s+3,true);R(g,tone(c,.3),9,H0-20,W0-18,1);
    [[34,H0-34],[84,H0-34],[210,H0-60],[256,H0-60]].forEach(([x,y],i)=>g.drawImage(fabrique(i<2?'chaussure':'botte',s+(i>>1),0).sp,x,y));
  }else if(fam==='casier'){
    for(let j=0;j<H0;j++)R(g,tone('#6a7684',-.12-j*.002),0,j,W0,1);ombre(26,.45);
    for(let i=0;i<6;i++)for(let j=0;j<2;j++)R(g,'#2a3038',136+i*9,150+j*7,6,3);
    R(g,'#8a96a4',0,0,W0,10);R(g,'#c8d0d8',0,9,W0,1);R(g,'rgba(6,4,10,.5)',0,10,W0,3);
    R(g,'#5a636e',8,16,W0-16,4);R(g,'#c8ccd4',8,16,W0-16,1);R(g,'#8a96a4',0,H0-16,W0,16);R(g,'#c8d0d8',0,H0-16,W0,1);R(g,'#8a96a4',0,0,8,H0);R(g,'#8a96a4',W0-8,0,8,H0);
    R(g,'#ece4cc',250,120,34,24);R(g,'#a33a3a',254,124,26,3);for(let i=0;i<3;i++)R(g,'#6a5a48',254,131+i*4,22-i*4,1);
  }else if(fam==='etagere'){
    bois(g,0,0,W0,H0,tone(c,-.5),s);ombre(24,.42);
    bois(g,0,0,W0,16,tone(c,.04),s+1,true);R(g,tone(c,.3),0,15,W0,1);R(g,'rgba(6,4,10,.55)',0,16,W0,5);
    bois(g,0,168,W0,14,tone(c,.12),s+2,true);R(g,tone(c,.36),0,168,W0,1);R(g,tone(c,-.4),0,181,W0,1);
    bois(g,0,0,10,H0,tone(c,.14),s+3);bois(g,W0-10,0,10,H0,tone(c,.14),s+4);
    const cols=TISSUS.slice(0,7),rang=(x0,x1)=>{let x=x0,i=0;while(x<x1-8){const h=92+((i*29+s)%46),l=10+((i*7+s)%8),co=cols[(i+s)%7],y=168-h;box(g,x,y,l,h,co);R(g,tone(co,.3),x+1,y+2,1,h-4);R(g,tone(co,-.3),x+l-2,y+2,1,h-4);R(g,'#d8b35c',x,y+9,l,1);R(g,'#d8b35c',x,y+h-10,l,1);R(g,'#ecdfc0',x+3,y+20,l-6,12);x+=l+1;i++}};
    rang(11,74);rang(248,308);
    for(let i=0;i<14;i++){const co=cols[(i*3+s)%7],l=14+(i*5)%8;R(g,co,18+i*21,184,l,16);R(g,tone(co,.3),19+i*21,184,1,16)}R(g,'rgba(6,4,10,.5)',0,182,W0,8);
  }else if(fam==='facade'){
    bois(g,0,0,W0,H0,c,s,true);ombre(10,.3);
    [12,188].forEach(y=>{R(g,tone(c,-.5),0,y,W0,2);R(g,tone(c,.26),0,y+2,W0,1)});
    const x=18,y=26,w=W0-36,h=148;R(g,tone(c,-.42),x,y,w,h);bois(g,x+3,y+3,w-6,h-6,tone(c,.1),s+1,true);R(g,tone(c,.34),x+3,y+3,w-6,1);R(g,tone(c,.34),x+3,y+3,1,h-6);R(g,tone(c,-.34),x+3,y+h-4,w-6,1);R(g,tone(c,-.34),x+w-4,y+3,1,h-6);
    R(g,tone(c,-.2),x+14,y+14,w-28,1);R(g,tone(c,-.2),x+14,y+14,1,h-28);R(g,tone(c,.2),x+14,y+h-15,w-28,1);R(g,tone(c,.2),x+w-15,y+14,1,h-28);
    ellipseP(g,160,74,17,26,'#8a6a28');ellipseP(g,160,74,15,24,'#d8b050');ellipseP(g,158,70,9,16,'#e8c868');ellipseP(g,160,66,6,6,'#141226');R(g,'#141226',157,66,6,22);R(g,'#000000',159,68,2,18);
    [[140,46],[180,46],[140,102],[180,102]].forEach(([a,b])=>{ellipseP(g,a,b,2,2,'#a88432');R(g,'#fff0a8',a-1,b-1,1,1)});
    for(let i=0;i<9;i++)traitP(g,tone(c,.34),150+i*3,60+((i*5)%8),144+i*5,52+((i*7)%10));
  }else if(fam==='frigo'||fam==='pharmacie'){
    const f=fam==='frigo',col=f?'#dce8ee':'#e8ecec';
    for(let j=0;j<H0;j++)R(g,tone(col,-j*.0012),0,j,W0,1);ombre(20,.22);
    if(f){R(g,'#fff4d0',120,3,80,6);R(g,'#ffffff',130,4,60,3);for(let j=0;j<70;j++)R(g,`rgba(255,244,208,${(.3-j*.004).toFixed(2)})`,60,9+j,200,1)}
    else{R(g,'#2e7a5a',148,14,24,6);R(g,'#2e7a5a',157,5,6,24)}
    [96,176].forEach(y=>{R(g,f?'#a8d0e0':'#c8d0d0',5,y,W0-10,5);R(g,'#ffffff',5,y,W0-10,1);R(g,'rgba(6,4,10,.16)',5,y+5,W0-10,5)});
    R(g,f?'#b8c4cc':'#c0c8c8',0,0,6,H0);R(g,f?'#b8c4cc':'#c0c8c8',W0-6,0,6,H0);R(g,'#ffffff',5,0,1,H0);R(g,'#ffffff',W0-6,0,1,H0);
    R(g,f?'#a8d0e0':'#dfe4e4',6,182,W0-12,18);
  }else if(fam==='placard'||fam==='evier'){
    bois(g,0,0,W0,H0,tone(c,-.6),s);ombre(46,.62);
    R(g,tone(c,-.2),0,0,W0,8);R(g,tone(c,.1),0,190,W0,10);R(g,tone(c,.3),0,190,W0,1);
    if(fam==='placard'){R(g,tone(c,-.1),0,96,W0,6);R(g,tone(c,.2),0,96,W0,1);ellipseP(g,70,172,30,15,'#2a2c34');R(g,'#3a3e48',40,150,60,22);R(g,'#141620',96,158,44,4);R(g,'#2a1a14',226,132,26,58);ellipseP(g,239,132,13,3,'#3a2a22')}
    else{R(g,'#8a939e',150,0,20,74);R(g,'#c8ccd4',153,0,3,74);for(let a=0;a<3.2;a+=.03)R(g,'#8a939e',118+Math.cos(a)*42-10,74+Math.sin(a)*38,20,4);R(g,'#8a939e',66,40,20,36);R(g,'#c8ccd4',69,40,3,36);R(g,'#5a636e',60,36,32,5);
     R(g,'#3a6a8c',222,136,50,54);R(g,'#5a8aac',224,136,8,52);ellipseP(g,247,136,25,5,'#22384a');R(g,'#8a939e',222,134,50,2)}
    for(let j=0;j<H0;j+=2)for(let i=(j%4);i<W0;i+=4)if(Math.hypot((i-160)/170,(j-100)/110)>.72)R(g,'rgba(6,4,10,.5)',i,j,2,2);
  }else if(fam==='tiroir'){
    bois(g,0,0,W0,H0,tone(c,-.34),s,true);for(let i=0;i<22;i++){const a=tone(c,.2-i/22*.5);R(g,a,i,i,W0-i*2,1);R(g,tone(a,-.1),i,H0-1-i,W0-i*2,1);R(g,tone(a,.08),i,i,1,H0-i*2);R(g,tone(a,-.14),W0-1-i,i,1,H0-i*2)}
  }else if(fam==='tambour'){
    for(let j=0;j<H0;j++)R(g,tone('#a8b0ba',-j*.002),0,j,W0,1);ellipseP(g,160,100,100,92,'#5a636e');ellipseP(g,160,100,92,84,'#c8ccd4');ellipseP(g,160,100,84,77,'#1a1c24');ellipseP(g,160,100,78,71,'#343a44');
    for(let j=-68;j<=68;j+=12)for(let i=-72+((j%24)?6:0);i<=72;i+=12)if((i*i)/(76*76)+(j*j)/(70*70)<1)R(g,'#0c0e14',159+i,99+j,3,3);
    for(let a=0;a<6.28;a+=2.09)traitP(g,'#6a7280',160+Math.cos(a)*30,100+Math.sin(a)*28,160+Math.cos(a)*76,100+Math.sin(a)*70,4);
  }else{
    // L'âtre : briques noircies, chenets et lit de cendres
    R(g,'#0e0806',0,0,W0,H0);
    for(let j=0;j<120;j+=10)for(let i=(j%20?-14:0);i<W0;i+=28)R(g,tone('#5a2c22',(noise(i,j,3)-.5)*.3-.24-(120-j)*.004),i+1,j+1,26,8);
    for(let j=0;j<60;j++)R(g,`rgba(4,2,2,${(.82-j*.012).toFixed(2)})`,0,j,W0,1);
    for(let j=0;j<H0;j++){const a=Math.max(0,1-j/90)*24;R(g,'#2a2422',0,j,a+12,1);R(g,'#2a2422',W0-a-12,j,a+12,1)}
    R(g,'#2c2624',0,112,W0,88);for(let i=0;i<500;i++){const q=n=>noise(i,n,7);R(g,['#4a4442','#6a625e','#1c1816'][i%3],q(1)*W0,112+q(2)*88,2,1)}
    [[60,104],[244,104]].forEach(([x,y])=>{R(g,'#22222a',x,y-22,8,34);R(g,'#5a5a68',x,y-22,2,34);ellipseP(g,x+4,y-24,6,6,'#2e2e38');R(g,'#6a6a78',x+1,y-27,3,2);R(g,'#22222a',x-8,y+10,24,4)});
    R(g,'#3e2616',80,94,160,12);R(g,'#5c3a22',80,94,160,3);R(g,'#1c0e08',80,104,160,2);ellipseP(g,238,100,5,6,'#a8804e');ellipseP(g,238,100,2,3,'#6a4a2a');
    for(let i=0;i<40;i++)R(g,i%2?'#ff7a2a':'#c83a1a',86+i*4,102,2,2);
  }
  return k;
}
function boiteImg(fam){
  const[k,g]=cv(50,44);
  if(fam==='frigo'){box(g,2,10,46,32,'#dce8ee');R(g,'#3a7ac8',0,5,50,8);R(g,'#7aa8e0',0,5,50,1);R(g,'#2a5a98',0,12,50,1);R(g,'#ffffff',6,16,3,22);R(g,'#2a5a98',22,3,6,3)}
  else{box(g,4,2,42,40,'#f4f4ee');R(g,'#2e7a5a',4,2,42,7);R(g,'#ffffff',4,2,42,1);R(g,'#2e7a5a',22,15,6,20);R(g,'#2e7a5a',15,22,20,6);R(g,'#c8c8c0',4,38,42,3)}
  return outlineSprite(k).toDataURL();
}

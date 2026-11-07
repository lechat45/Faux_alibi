// Pixel art entièrement généré par le code : tout est peint pixel par pixel, sans image externe.
const TS=16;
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const toHex=c=>'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
// Ombres bleutées, lumières chaudes : le décalage de teinte donne l'aspect pixel art.
const TONES=new Map();
function tone(h,f){
  f=Math.round(f*50)/50;
  const key=h+f;let v=TONES.get(key);
  if(!v){v=tone0(h,f);TONES.set(key,v)}
  return v;
}
function tone0(h,f){
  const c=hx(h);
  if(f<0){const k=1+f;return toHex([c[0]*k+14*-f,c[1]*k+10*-f,c[2]*k+42*-f])}
  return toHex([c[0]+(255-c[0])*f,c[1]+(244-c[1])*f,c[2]+(214-c[2])*f]);
}
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const bay=(x,y)=>(BAYER[(y&3)*4+(x&3)]+.5)/16;
const noise=(x,y,s=0)=>{let h=Math.imul(x*374761393+y*668265263+s*2147483647,1274126177);h=Math.imul(h^(h>>>13),1103515245);return((h^(h>>>16))>>>0)/4294967296};
function cv(w,h){const k=document.createElement('canvas');k.width=w;k.height=h;const g=k.getContext('2d');g.imageSmoothingEnabled=false;return[k,g]}
const R=(g,c,x,y,w=1,h=1)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
function dith(g,c,x,y,w,h,d){g.fillStyle=c;for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(bay(x+i,y+j)<d)g.fillRect(x+i,y+j,1,1)}
// Boîte éclairée par le haut, base de presque tous les meubles
function box(g,x,y,w,h,c){
  R(g,tone(c,-.62),x,y,w,h);R(g,c,x+1,y+1,w-2,h-2);R(g,tone(c,.28),x+1,y+1,w-2,1);R(g,tone(c,.12),x+1,y+2,1,h-4);
  R(g,tone(c,-.28),x+1,y+h-3,w-2,2);R(g,tone(c,-.16),x+w-2,y+2,1,h-4);
}
function outlineSprite(k,col='#141226'){
  const g=k.getContext('2d'),W=k.width,H=k.height,d=g.getImageData(0,0,W,H),a=d.data,o=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(a[(y*W+x)*4+3]>0)continue;
    for(const[p,q]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+p,Y=y+q;if(X>=0&&Y>=0&&X<W&&Y<H&&a[(Y*W+X)*4+3]>120){o.push([x,y]);break}}
  }
  o.forEach(([x,y])=>R(g,col,x,y));
  return k;
}

// ——— Sols ———
function floorTile(g,kind,X,Y,px,py,tint){
  const n=(a,b,s)=>noise(X*16+a,Y*16+b,s);
  const P=(c,a,b)=>R(g,c,px+a,py+b);
  if(kind==='parquet'||kind==='planche'||kind==='scene'){
    const base=kind==='parquet'?'#8a5a34':kind==='planche'?'#7a6143':'#3a2b2a';
    for(let b=0;b<16;b++){
      const row=((Y*16+b)/5)|0,off=noise(row,7,3)*48|0,pl=((X*16+off)/32)|0,v=noise(row,pl,5);
      const c=tone(base,(v-.5)*.4);
      for(let a=0;a<16;a++){
        const col=((X*16+a+off)/32)|0,cc=col===pl?c:tone(base,(noise(row,col,5)-.5)*.4);
        const gr=noise((X*16+a)>>2,Y*16+b,9);
        P(gr>.86?tone(cc,-.14):gr<.06?tone(cc,.1):cc,a,b);
        if((Y*16+b)%5===4)P(tone(base,-.5),a,b);
        else if((X*16+a+off)%32===0)P(tone(base,-.46),a,b);
      }
    }
  }else if(kind==='damier'){
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      const cell=((((X*16+a)>>3)+((Y*16+b)>>3))&1),base=cell?'#d8d3c2':'#3e4a5a';
      let c=tone(base,(n(a,b,1)-.5)*.08);
      if((X*16+a)%8===0||(Y*16+b)%8===0)c='#6e6c66';
      else if((a+b)%8===1&&(a%8)<3)c=tone(c,.22);
      P(c,a,b);
    }
  }else if(kind==='tapis'){
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      const x=X*16+a,y=Y*16+b,mo=(Math.abs((x%24)-12)+Math.abs((y%24)-12));
      let c=tone(tint,-.25);
      if(mo===11||mo===5)c=tone(tint,.18);else if(mo===8)c=tone(tint,.42);else if(mo<2)c='#d8b35c';
      P(bay(x,y)<.2?tone(c,-.12):c,a,b);
    }
  }else if(kind==='marbre'){
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      const x=X*16+a,y=Y*16+b,v=Math.sin(x*.21+y*.13+6*noise(x>>3,y>>3,4));
      let c=tone('#c9c2b8',(n(a,b,2)-.5)*.05);
      if(Math.abs(v)<.09)c='#8f8a92';else if(Math.abs(v)<.2)c='#afa9ac';
      if(x%32===0||y%32===0)c='#7a7682';
      P(c,a,b);
    }
  }else if(kind==='pierre'||kind==='terre'){
    const base=kind==='pierre'?'#6a625a':'#5a4634';
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      const x=X*16+a,y=Y*16+b,cx=(x/10|0),cy=(y/10|0),jx=(x+(cy&1)*5)%10,jy=y%10;
      const edge=jx===0||jy===0,v=noise(cx+(cy&1)*3,cy,6);
      let c=tone(base,(v-.5)*.36+(n(a,b,8)-.5)*.1);
      if(edge)c=tone(base,-.55);else if(jx===1||jy===1)c=tone(c,.13);
      if(kind==='terre'&&!edge&&n(a,b,3)>.96)c='#5e8c4a';
      P(c,a,b);
    }
  }else if(kind==='metal'){
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      const x=X*16+a,y=Y*16+b;let c=tone('#5a636e',(n(a,b,2)-.5)*.06);
      if(((x+y)%6===0)&&((x-y+60)%6===0))c='#7d8794';else if(((x+y)%6===0)&&((x-y+60)%6===3))c='#454d58';
      if(a===0||b===0)c='#2f353e';if(a===1||b===1)c='#717b88';
      if((a===3||a===12)&&(b===3||b===12))c='#a6b0bd';
      P(c,a,b);
    }
  }else if(kind==='lino'){
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      let c=tone('#a9b8b4',(n(a,b,2)-.5)*.1);if(n(a>>1,b>>1,7)>.92)c='#8d9c9c';
      if(a===15||b===15)c='#7d8b8b';P(c,a,b);
    }
  }else if(kind==='sport'){
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      const x=X*16+a,y=Y*16+b;let c=tone('#27507e',(n(a,b,2)-.5)*.14);
      if((x%64)<2||(y%48)<2)c='#e8d36a';P(c,a,b);
    }
  }else{ // beton
    for(let b=0;b<16;b++)for(let a=0;a<16;a++){
      const v=n(a,b,2),s=noise((X*16+a)>>3,(Y*16+b)>>3,3);
      let c=tone('#74787c',(v-.5)*.12+(s-.5)*.14);
      if((X*16+a)%48===0||(Y*16+b)%48===0)c='#54585c';
      P(c,a,b);
    }
  }
}
// ——— Murs : tapisserie, lambris, plinthe ———
function wallColumn(g,x,y,tint,lamb){
  for(let b=0;b<32;b++)for(let a=0;a<16;a++){
    const X=x+a,Y=y+b;let c;
    if(b<3)c=tone(tint,-.55+.12*b);
    else if(b<19){
      const m=(Math.abs((X%12)-6)+Math.abs(((Y+(X%24<12?0:6))%12)-6));
      c=tone(tint,m===4?.13:m<2?.2:(noise(X,Y,2)-.5)*.05);
      if(X%24===0)c=tone(tint,-.14);
    }else if(b<21)c=tone(lamb,.34-.2*(b-19));
    else if(b<29){
      const p=X%24;c=tone(lamb,(noise(X>>2,Y,4)-.5)*.12);
      if(p===0||p===23||b===21||b===28)c=tone(lamb,-.34);else if(p===1||b===22)c=tone(lamb,.2);
    }else c=b===29?tone(lamb,.2):tone(lamb,-.5);
    R(g,c,X,Y);
  }
}
function voidTile(g,x,y,X,Y){
  for(let b=0;b<16;b++)for(let a=0;a<16;a++)R(g,((X*16+a)+(Y*16+b)*3)%13===0?'#1b1a30':noise(X*16+a,Y*16+b,1)>.94?'#23223c':'#161528',x+a,y+b);
}
function books(g,x,y,w,h,v){
  const cols=['#a33a3a','#2e6a8c','#3d7a4c','#c29a3a','#6b3d78','#b06a34','#3a3a5c','#ddd0b0'];
  let i=x,s=v;
  while(i<x+w){
    const bw=2+(noise(s,1,1)*2|0),bh=h-(noise(s,2,1)*3|0),c=cols[noise(s,3,1)*8|0];
    if(i+bw>x+w)break;
    if(noise(s,4,1)<.12){i+=bw;s++;continue}
    R(g,c,i,y+h-bh,bw,bh);R(g,tone(c,.3),i,y+h-bh,1,bh);R(g,tone(c,-.4),i+bw-1,y+h-bh,1,bh);R(g,'#ecd78f',i,y+h-bh+2,bw,1);
    i+=bw;s++;
  }
}
const SPR={
  shelf(g,v){box(g,0,0,32,46,'#5b3820');for(let s=0;s<3;s++){R(g,'#2c1a14',3,3+s*14,26,12);books(g,3,3+s*14,26,12,v+s*9);R(g,'#8a5a34',2,15+s*14,28,2)}},
  cabinet(g,v){box(g,0,10,32,32,'#7a5230');R(g,'#b98a54',1,10,30,3);for(let i=0;i<2;i++){box(g,2+i*14,15,14,24,'#8e6238');R(g,'#e0c060',i?17:13,26,2,3)}R(g,'#c8c0a8',4,5,6,5);R(g,'#7ea8c0',13,3,4,7);R(g,'#b06a34',21,6,7,4)},
  fridge(g){box(g,0,4,16,38,'#cfd8dc');R(g,'#8a969c',1,18,14,1);R(g,'#607078',12,8,2,8);R(g,'#607078',12,21,2,10);R(g,'#ffffff',2,6,3,1)},
  stove(g){box(g,0,16,32,26,'#4a4f58');R(g,'#2a2d34',2,17,28,6);[6,18].forEach(x=>{R(g,'#141418',x,18,8,4);R(g,'#ff8a3a',x+2,19,4,2)});box(g,5,27,22,12,'#6a7078');R(g,'#ffc86a',8,30,16,5);R(g,'#2a2d34',8,28,16,1);box(g,3,6,11,10,'#9aa2aa');R(g,'#e8e8ee',5,4,7,2);R(g,'#7ea8c0',19,10,9,6)},
  sink(g){box(g,0,16,32,26,'#b8a888');R(g,'#ece4cf',1,16,30,4);box(g,5,18,22,5,'#aab6bc');R(g,'#5c7a90',7,19,18,2);R(g,'#c8d0d4',15,13,2,6);R(g,'#c8d0d4',15,13,6,1);for(let i=0;i<2;i++)box(g,2+i*14,25,14,15,'#a89878')},
  counter(g,v){box(g,0,16,32,26,'#8c6a44');R(g,'#d8cfbb',0,14,32,4);R(g,'#a89c84',0,18,32,1);for(let i=0;i<2;i++){box(g,2+i*14,21,14,19,'#9a7650');R(g,'#e0c060',8+i*14,24,3,1)}R(g,'#a33a3a',4,9,6,5);R(g,'#c8c0a8',21,8,4,6);R(g,'#7a9a5a',13,11,5,3)},
  locker(g,v){const c=['#4f7088','#6a7d5a','#8a5a4a'][v%3];box(g,0,2,16,40,c);R(g,tone(c,-.4),7,3,2,37);R(g,'#232a33',3,7,3,1);R(g,'#232a33',3,9,3,1);R(g,'#232a33',11,7,3,1);R(g,'#232a33',11,9,3,1);R(g,'#e0d8b0',4,22,1,4);R(g,'#e0d8b0',11,22,1,4)},
  winerack(g,v){box(g,0,0,32,44,'#54331f');for(let j=0;j<5;j++)for(let i=0;i<5;i++){R(g,'#1d1412',2+i*6,3+j*8,6,7);const c=['#3a5a34','#6b2030','#2a3a4a'][noise(i,j,v)*3|0];if(noise(i+3,j,v)>.2){R(g,c,3+i*6,5+j*8,4,3);R(g,tone(c,.4),3+i*6,5+j*8,4,1);R(g,'#d8c080',5+i*6,5+j*8,1,3)}}},
  skirack(g,v){box(g,0,28,32,14,'#7a5a3c');for(let i=0;i<7;i++){const c=['#d84a4a','#3a7ad8','#e8d04a','#3ab07a'][(i+v)%4];R(g,c,2+i*4,2,3,32);R(g,tone(c,.4),2+i*4,2,1,32);R(g,tone(c,-.4),2+i*4,0,3,3);R(g,'#222',2+i*4,18,3,2)}R(g,'#4a2f1c',0,14,32,2)},
  rack(g,v){box(g,0,0,16,42,'#333b48');for(let j=0;j<6;j++){R(g,'#1b202a',2,3+j*6,12,5);for(let i=0;i<5;i++)R(g,['#5dffa0','#ffd23f','#ff6a5a','#6ad0ff'][(noise(i,j,v)*4)|0],3+i*2,4+j*6);R(g,'#55607a',3,6+j*6,10,1)}},
  vanity(g,v){box(g,0,20,32,22,'#8a5a4a');R(g,'#c8a58a',0,18,32,3);box(g,6,0,20,18,'#d8b35c');for(let j=0;j<14;j++)for(let i=0;i<16;i++)R(g,tone('#9cc4d8',(i+j)%11<2?.4:(j*.012-.12)),8+i,2+j);for(let i=0;i<4;i++){R(g,'#fff0a8',3+(i%2?24:0),3+((i/2)|0)*7,2,2)}R(g,'#c04a6a',9,16,3,2);R(g,'#d8d0ff',17,15,4,3);R(g,'#e0c060',14,30,4,1)},
  wardrobe(g,v){box(g,0,0,32,44,'#5f3b22');for(let i=0;i<2;i++){box(g,2+i*14,4,14,37,'#74492a');box(g,5+i*14,8,8,12,'#845634');box(g,5+i*14,23,8,14,'#845634')}R(g,'#e0c060',14,22,1,3);R(g,'#e0c060',17,22,1,3);R(g,'#8a5a34',0,0,32,2)},
  piano(g){box(g,0,0,48,48,'#1f1a24');for(let j=0;j<30;j++)R(g,'#35304a',4,6+j,40-j*.8,1);R(g,'#5f5a7a',6,7,30,1);box(g,0,30,48,14,'#2a2432');for(let i=0;i<22;i++){R(g,'#f0ece0',3+i*2,36,1,6);if(i%7!==2&&i%7!==6)R(g,'#111',4+i*2,36,1,3)}R(g,'#e0c060',20,31,8,2);R(g,'#3a2f44',8,44,4,4);R(g,'#3a2f44',36,44,4,4)},
  fireplace(g){box(g,0,0,48,44,'#8c8078');for(let j=0;j<6;j++)for(let i=0;i<6;i++)R(g,tone('#8c8078',(noise(i,j,3)-.5)*.3),1+i*8+(j&1)*4,1+j*7,7,6);box(g,8,16,32,26,'#2a1a18');R(g,'#1a0e0e',11,20,26,22);R(g,'#5b3820',13,37,22,3);R(g,'#c8a58a',0,10,48,4);R(g,'#ecd0b8',0,10,48,1);R(g,'#a33a3a',6,6,4,4);R(g,'#d8b35c',38,4,3,6)},
  bar(g,v){box(g,0,16,64,26,'#5b3820');R(g,'#a87a4a',0,14,64,4);R(g,'#e0c060',0,18,64,1);for(let i=0;i<4;i++)box(g,3+i*15,22,13,18,'#6d4628');for(let i=0;i<7;i++){const c=['#3a5a34','#6b2030','#c29a3a','#7ea8c0'][(noise(i,1,v)*4)|0];R(g,c,5+i*8,5,4,9);R(g,tone(c,.4),5+i*8,5,1,9);R(g,c,6+i*8,2,2,3)}},
  clock(g){box(g,2,0,12,42,'#5b3820');R(g,'#ecdfc0',4,3,8,8);R(g,'#222',8,5,1,3);R(g,'#222',8,7,3,1);R(g,'#2a1a14',5,14,6,22);R(g,'#d8b35c',7,14,2,14);R(g,'#ffd878',6,27,4,4)},
  console(g,v){box(g,0,18,48,24,'#4a5462');R(g,'#6a7482',0,16,48,4);for(let i=0;i<3;i++){box(g,2+i*15,0,14,15,'#2d3440');for(let j=0;j<9;j++)for(let a=0;a<10;a++)if(noise(a,j,v+i)>.45)R(g,(j+i)%3?'#5dffa0':'#6ad0ff',4+i*15+a,3+j)}for(let i=0;i<14;i++)R(g,['#ff6a5a','#ffd23f','#5dffa0'][i%3],3+i*3,23);for(let i=0;i<5;i++)R(g,'#b8c4d0',4+i*9,29,5,6)},
  labbench(g,v){box(g,0,18,48,24,'#c8d4d4');R(g,'#3f4a4e',0,14,48,5);[5,14,24,36].forEach((x,i)=>{const c=['#5dffa0','#ff8ac0','#6ad0ff','#ffd23f'][i];R(g,'#e0f0f4',x,4,4,8);R(g,c,x,8,4,6);R(g,tone(c,.5),x+1,9,1,4);R(g,'#e0f0f4',x+1,1,2,3)});for(let i=0;i<3;i++)box(g,2+i*15,23,14,17,'#b0bcbc')},
  planter(g,v){box(g,0,20,48,22,'#7a4f30');R(g,'#3f2c1f',2,20,44,7);for(let i=0;i<12;i++){const x=2+i*4,h=7+noise(i,2,v)*11|0,c=['#4d9a50','#6ab85a','#3a7a48'][i%3];R(g,c,x+1,24-h,1,h);R(g,tone(c,.3),x,22-h,3,2);R(g,tone(c,-.2),x+2,26-h,2,2);if(noise(i,4,v)>.7)R(g,'#ff7a6a',x+1,20-h,2,2)}},
  table(g,v){box(g,0,6,48,28,'#7a4c2a');for(let i=0;i<6;i++)R(g,'#9a6a3e',2,10+i*4,44,1);R(g,'#ecdfc0',12,9,24,20);R(g,'#c8b890',12,28,24,1);R(g,'#5b3820',3,34,4,12);R(g,'#5b3820',41,34,4,12);R(g,'#ffffff',16,12,8,6);R(g,'#8a8fa8',17,14,6,1);R(g,'#8a8fa8',17,16,4,1);R(g,'#a33a3a',29,13,4,5);R(g,'#ffd878',30,10,2,3)},
  rtable(g,v){for(let j=0;j<26;j++){const w=Math.round(Math.sqrt(1-((j-13)/13.5)**2)*16);R(g,j<3?'#ecdfc0':'#d8c8a4',16-w,4+j,w*2,1);if(j>20)R(g,'#b8a884',16-w,4+j,w*2,1)}R(g,'#8a6a44',14,28,4,14);R(g,'#5b3820',9,41,14,3);R(g,'#7ea8c0',12,10,4,6);R(g,'#ffffff',12,10,1,6);R(g,'#c29a3a',19,14,6,3)},
  chair(g,v){const c=['#8a3a3a','#3a5a8a','#4a7a4a'][v%3];box(g,2,0,12,14,'#5b3820');box(g,3,1,10,8,c);box(g,2,12,12,6,c);R(g,'#3a2416',3,18,2,7);R(g,'#3a2416',11,18,2,7)},
  sofa(g,v){const c=['#7a2f3a','#2e5a78','#5a6a3a'][v%3];box(g,0,0,48,18,c);box(g,0,10,6,20,tone(c,-.1));box(g,42,10,6,20,tone(c,-.1));for(let i=0;i<2;i++)box(g,6+i*18,14,18,14,tone(c,.1));R(g,'#e0c060',8,4,1,1);R(g,'#e0c060',24,4,1,1);R(g,'#e0c060',39,4,1,1)},
  armchair(g,v){const c=['#7a4f2a','#5a2f4a','#2f5a5a'][v%3];box(g,1,0,14,17,c);box(g,0,10,4,14,tone(c,-.1));box(g,12,10,4,14,tone(c,-.1));box(g,3,13,10,9,tone(c,.12));R(g,'#3a2416',2,24,2,2);R(g,'#3a2416',12,24,2,2)},
  bed(g,v){const c=['#3a5a8a','#8a3a4a','#4a7a5a'][v%3];box(g,0,0,32,10,'#5b3820');box(g,0,8,32,40,'#6a4a2a');box(g,2,8,28,34,'#ece4d0');box(g,2,22,28,22,c);for(let i=0;i<3;i++)R(g,tone(c,.18),2,25+i*6,28,1);box(g,5,10,10,8,'#ffffff');box(g,17,10,10,8,'#ffffff')},
  crate(g,v){box(g,0,3,16,21,'#a07a48');R(g,'#7a5a34',1,10,14,1);R(g,'#7a5a34',1,17,14,1);for(let i=0;i<13;i++){R(g,'#8a6a3e',2+i,10+(i>>1),1,1)}R(g,'#c8a468',1,3,14,2);R(g,'#3a2a1a',2,6,1,1);R(g,'#3a2a1a',13,6,1,1)},
  barrel(g,v){for(let j=0;j<22;j++){const w=6+Math.round(Math.sin(j/21*Math.PI)*2);for(let i=-w;i<w;i++){const f=-i/w*.3,st=((i+20)%4===0)?-.2:0;R(g,tone('#7a4f2a',f+st),8+i,2+j)}}R(g,'#7a7a82',0,7,16,1);R(g,'#7a7a82',0,17,16,1);R(g,'#b0b0b8',3,7,3,1);R(g,'#b0b0b8',3,17,3,1);R(g,'#5b3820',3,0,10,3);R(g,'#8a5a34',4,0,8,2)},
  plant(g,v){box(g,3,16,10,9,'#a85a34');R(g,'#3f2c1f',4,16,8,2);for(let i=0;i<34;i++){const a=noise(i,1,v)*6.28,d=noise(i,2,v)*7,x=8+Math.cos(a)*d|0,y=10+Math.sin(a)*d*.9|0,c=['#3a7a48','#4d9a50','#6ab85a','#2f6340'][i%4];R(g,c,x-1,y,3,2);R(g,tone(c,.3),x,y,1,1)}R(g,'#3a5a34',7,12,2,5)},
  weights(g){R(g,'#3f4650',0,10,32,4);box(g,4,18,24,6,'#8a3a3a');R(g,'#333',6,23,2,5);R(g,'#333',24,23,2,5);R(g,'#c8d0d8',0,7,32,2);[1,5,25,28].forEach((x,i)=>box(g,x,i%3?3:1,3,i%3?11:14,'#2a2d34'))},
  treadmill(g){box(g,0,16,32,28,'#3a3f48');R(g,'#1f2228',4,22,24,20);for(let i=0;i<5;i++)R(g,'#2f343c',4,24+i*4,24,1);R(g,'#8a939e',3,2,2,18);R(g,'#8a939e',27,2,2,18);box(g,3,0,26,9,'#2d3440');R(g,'#5dffa0',7,3,10,3);R(g,'#ffd23f',20,3,4,3)},
  mannequin(g,v){const c=['#a33a5a','#3a6a9a','#c29a3a'][v%3];R(g,'#5b3820',7,28,2,12);R(g,'#3a2416',3,38,10,3);for(let j=0;j<20;j++){const w=j<7?5-(j>>2):3+(j>>2);R(g,tone(c,-j*.012),8-w,8+j,w*2,1);R(g,tone(c,.25),8-w+1,8+j,1,1)}R(g,'#d8c8a8',6,2,4,6);R(g,'#ecdcc0',7,0,2,3)},
  sewing(g,v){box(g,0,10,32,14,'#8a6a44');R(g,'#3a3f48',7,2,16,5);R(g,'#3a3f48',7,2,4,12);R(g,'#c8a040',9,4,10,1);R(g,'#f0f0f0',20,7,1,5);R(g,'#c04a6a',0,12,14,6);R(g,'#5b3820',2,24,3,6);R(g,'#5b3820',27,24,3,6)},
  spot(g){R(g,'#3a3f48',7,14,2,22);R(g,'#2a2d34',3,34,10,3);box(g,2,2,12,12,'#2d3440');R(g,'#fff0a8',4,8,8,5);R(g,'#ffffff',6,9,4,2)},
  ropes(g){for(let j=0;j<4;j++)for(let i=0;i<14;i++)R(g,(i+j*3)%4===0?'#7a5a34':'#b89464',1+i,12+j*3,1,2);for(let j=0;j<3;j++)R(g,'#d8b884',2,11+j*3,12,1)},
  trunk(g,v){const c=['#6a4a2a','#3a5a5a','#7a3a2a'][v%3];box(g,0,4,32,20,c);R(g,tone(c,.25),1,5,30,3);R(g,'#c8a040',5,4,3,20);R(g,'#c8a040',24,4,3,20);R(g,'#2a1a14',1,11,30,1);box(g,13,10,6,6,'#e0c060')},
  lamp(g){R(g,'#5b3820',7,14,2,24);R(g,'#2a1a14',4,37,8,3);for(let j=0;j<11;j++){const w=3+(j>>1);R(g,tone('#ffdc8a',-j*.015),8-w,3+j,w*2,1)}R(g,'#fff4c8',6,6,4,5)},
  globe(g){for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++)if(x*x+y*y<=52){const land=noise((x+y*2+40)>>1,y>>1,7)>.55;R(g,tone(land?'#5a9a5a':'#3a7aaa',(-x-y)*.04),8+x,9+y)}R(g,'#c8a040',14,8,2,2);R(g,'#5b3820',7,17,2,5);R(g,'#3a2416',3,21,10,3)},
  stool(g,v){box(g,3,8,10,5,'#b0603a');R(g,'#5b3820',4,13,2,10);R(g,'#5b3820',10,13,2,10)},
  tank(g,v){const c=['#6ad0ff','#5dffa0','#ffb86b'][v%3];box(g,1,0,14,28,'#8a96a4');R(g,'#1a2a3a',3,3,10,22);for(let j=0;j<20;j++)R(g,tone(c,(j%5===0?.3:-.2)-j*.012),4,4+j,8,1);R(g,'#ffffff',5,5,1,14);R(g,'#ffffff',8,16,1,1);R(g,'#ffffff',10,10,1,1)}
};
function furnitureSprite(f){
  const[k,g]=cv(f.w*TS+2,f.h*TS+36);
  g.translate(1,1);
  const H=SH[f.name]||24;
  SPR[f.name](g,f.v);
  return outlineSprite(k);
}
// Hauteur totale (pixels) de chaque dessin, pour l'ancrer sur sa case
const SH={shelf:46,cabinet:42,fridge:42,stove:42,sink:42,counter:42,locker:42,winerack:44,skirack:42,rack:42,vanity:42,wardrobe:44,piano:48,fireplace:44,bar:42,clock:42,console:42,labbench:42,planter:42,table:46,rtable:44,chair:25,sofa:30,armchair:26,bed:48,crate:24,barrel:24,plant:25,weights:28,treadmill:44,mannequin:41,sewing:30,spot:37,ropes:24,trunk:24,lamp:40,globe:24,stool:23,tank:28};

// ——— Personnages ———
const SKINS=['#f6d2b4','#e8b48c','#c68a5e','#8e5a3a','#5e3a28'];
const HAIRS=['#2a1d18','#5a3a22','#a8682e','#d8b45c','#8a2f25','#c8c8d0','#3a2a4a'];
const TOPS=['#7a2f3a','#2e5a8a','#3d7a4c','#8a6a2a','#5a3a7a','#2a5a5a','#a34a2a','#3a4a6a'];
const INSPECTEUR={skin:'#e8b48c',hair:'#3a2a22',hs:0,fhs:6,eye:'#4a6a3a',age:1,top:'#b89a6a',bot:'#3a3a48',f:false,glasses:false,beard:false,hat:true,trench:true,trait:''};
function drawChar(g,L,dir,fr){
  // 18x28 : dir 0 bas, 1 droite, 2 haut, 3 gauche (miroir de droite)
  const skin=L.skin,top=L.top,bot=L.bot,hair=L.hair,ox=1,oy=2;
  const P=(c,x,y,w=1,h=1)=>R(g,c,ox+x,oy+y,w,h);
  const step=fr===1?1:fr===3?-1:0,bob=fr%2?0:0;
  const shoe='#1e1a24';
  if(dir===0||dir===2){
    const lL=step>0?1:0,lR=step<0?1:0;
    if(!L.dress||L.trench){P(tone(bot,0),4,16,3,6-lL);P(tone(bot,0),9,16,3,6-lR);P(tone(bot,.15),4,16,1,5);P(tone(bot,-.3),11,16,1,5);P(shoe,4,22-lL,3,2);P(shoe,9,22-lR,3,2)}
    else{P(tone(skin,-.1),5,19,2,3-lL);P(tone(skin,-.1),9,19,2,3-lR);P(shoe,5,22-lL,2,2);P(shoe,9,22-lR,2,2)}
  }else{
    const a=fr===1?2:fr===3?-2:0;
    if(!L.dress||L.trench){P(bot,6+a,16,4,6);P(tone(bot,-.3),6-a,16,4,6);P(shoe,6+a,22,5,2);P(tone(shoe,.1),6-a,22,5,2)}
    else{P(tone(skin,-.1),7+a,19,2,3);P(tone(skin,-.2),7-a,19,2,3);P(shoe,7+a,22,3,2);P(shoe,7-a,22,3,2)}
  }
  // buste
  const tw=dir%2?8:10,tx=dir%2?4:3;
  P(top,tx,9,tw,8);P(tone(top,.2),tx,9,1,8);P(tone(top,-.3),tx+tw-1,9,1,8);P(tone(top,-.2),tx,15,tw,2);
  if(L.dress||L.trench){for(let j=0;j<6;j++){const w=tw+(j>>1)*2;P(j%2?top:tone(top,-.06),tx-(j>>1),15+j-(L.trench?1:0),w,1)}P(tone(top,-.3),tx+tw-1+2,18,1,3)}
  if(L.trench){P(tone(top,-.35),7,13,3,1);if(dir===0){P(tone(top,-.3),8,9,1,6);P('#e8e2d4',7,9,3,2);P('#7a2f3a',8,10,1,3)}}
  else if(dir===0){P('#f0ece0',7,9,3,2);if(!L.f)P(tone(top,.42),8,11,1,3);else P('#e0c060',8,11,1,1);P(tone(top,.3),6,13,1,1);P(tone(top,.3),10,13,1,1)}
  // bras
  const sw=step;
  if(dir===0||dir===2){P(tone(top,-.08),1,10,2,6+sw);P(tone(top,.15),1,10,1,5);P(tone(top,-.08),13,10,2,6-sw);P(tone(top,-.35),14,10,1,5);P(L.trait.includes('gants')?'#3a2418':skin,1,16+sw,2,2);P(L.trait.includes('gants')?'#3a2418':skin,13,16-sw,2,2)}
  else{const a=fr===1?2:fr===3?-2:0;P(tone(top,-.14),7+a,10,3,6);P(tone(top,.1),7+a,10,1,6);P(L.trait.includes('gants')?'#3a2418':skin,7+a,16,3,2)}
  // tête
  P(tone(skin,-.2),6,8,4,2);
  P(skin,3,1,10,8);P(skin,4,0,8,10);P(tone(skin,.18),4,1,3,2);P(tone(skin,-.15),12,2,1,6);P(tone(skin,-.15),5,9,6,1);
  const hc=hair,hl=tone(hair,.25),hd=tone(hair,-.3);
  if(dir===2){P(hc,3,0,10,9);P(hc,4,9,8,1);P(hl,5,1,4,1);P(hd,3,6,10,1);P(hl,6,3,2,3);if(L.hs===2||L.hs===4||(L.f&&L.hs!==1))P(hc,3,9,10,4)}
  else{
    P(hc,3,0,10,3);P(hc,4,-1,8,1);P(hl,5,-1,4,1);P(hl,5,1,3,1);P(hd,3,2,10,1);
    if(dir===0){
      P('#ffffff',5,5,2,2);P('#ffffff',9,5,2,2);P('#1c2333',6,5,1,2);P('#1c2333',10,5,1,2);P(hd,5,4,2,1);P(hd,9,4,2,1);P(tone(skin,-.3),8,7,1,1);P(tone('#b04a4a',-.1),7,8,2,1);P('#e8907a',4,7,1,1);P('#e8907a',11,7,1,1);
      if(L.hs===1){P(hc,3,3,1,5);P(hc,12,3,1,5)}
      if(L.hs===2||(L.f&&L.hs===3)){P(hc,2,2,2,10);P(hc,12,2,2,10);P(hl,2,3,1,7)}
      if(L.hs===4){P(hc,2,1,12,2);P(hc,7,-3,3,3);P(hl,8,-3,1,2)}
      if(L.glasses){P('#111',4,5,4,1);P('#111',9,5,4,1);P('#111',8,5,1,1);P('#a8d8f0',5,6,1,1);P('#a8d8f0',10,6,1,1)}
      if(L.beard){P(hc,4,7,8,3);P(skin,7,8,2,1);P(hd,4,9,8,1)}
    }else{
      P('#ffffff',9,5,3,2);P('#1c2333',11,5,1,2);P(hd,9,4,3,1);P(tone(skin,-.3),13,6,1,2);P(skin,13,5,1,1);P(tone('#b04a4a',-.1),11,8,2,1);P(tone(skin,-.2),6,5,2,3);P(hc,3,2,3,5);
      if(L.hs===2||(L.f&&L.hs===3))P(hc,2,3,3,9);
      if(L.beard){P(hc,8,7,5,3);P(hd,8,9,5,1)}
      if(L.glasses){P('#111',8,5,5,1)}
    }
  }
  if(L.hat){const hb=L.trench?'#6b5a42':tone(top,-.2);P(hb,2,0,12,2);P(hb,4,-3,8,3);P(tone(hb,.25),4,-3,8,1);P('#2a2030',4,-1,8,1)}
  if(L.trait.includes('canne')&&dir!==2){P('#6b3f22',dir===0?0:13,14,1,10);P('#d8b35c',dir===0?0:12,13,2,1)}
  if(L.trait.includes('cigarillo')&&dir===0){P('#8a5a34',9,8,3,1);P('#ff6a3a',12,8,1,1)}
}
function charSheet(L){
  // 4 directions x 4 images
  const[k,g]=cv(20*4,30*4);
  for(let d=0;d<4;d++)for(let f=0;f<4;f++){
    const[s,h]=cv(20,30);
    if(d===3){h.translate(20,0);h.scale(-1,1)}
    drawChar(h,L,d===3?1:d,f);
    outlineSprite(s);
    g.drawImage(s,f*20,d*30);
  }
  return k;
}
// Portrait 72x72 : ombrage calculé pixel par pixel puis tramé sur une rampe de teintes.
// ——— Objets ———
function vitrineSprite(o,present){
  const[k,g]=cv(18,38);g.translate(1,1);
  box(g,1,18,14,17,'#5b3820');R(g,'#8a5a34',0,16,16,3);R(g,'#e0c060',6,24,4,3);
  for(let j=0;j<15;j++)R(g,tone('#2a3a55',j*.01),2,1+j,12,1);
  R(g,'#d8e8f4',1,0,14,1);R(g,'#d8e8f4',1,0,1,16);R(g,'#d8e8f4',14,0,1,16);R(g,'#ffffff',4,2,1,8);R(g,'#ffffff',5,2,1,3);
  R(g,'#a33a3a',3,13,10,3);
  if(present&&o==='poison'){R(g,'#d8e8f4',6,5,4,3);R(g,'#8a5a34',6,3,4,2);box(g,4,8,8,6,'#7ac05a');R(g,'#ffffff',5,9,1,4)}
  else if(present){const c=o==='lame'?'#d8e0e8':o==='lien'?'#c8a468':'#b08a3a';if(o==='lame'){for(let i=0;i<8;i++)R(g,c,5+i>>0,12-i>>0,1,1);R(g,'#5b3820',4,12,3,2)}else if(o==='lien'){for(let i=0;i<9;i++)R(g,c,4+i,8+Math.round(Math.sin(i)*3),1,2)}else{box(g,4,6,8,7,c)}}
  else{R(g,'#7a6a6a',7,14,3,1);R(g,'#ff8a7a',6,4,4,1);R(g,'#ff8a7a',9,5,1,2);R(g,'#ff8a7a',7,7,2,1);R(g,'#ff8a7a',7,8,1,2);R(g,'#ff8a7a',7,11,1,1)}
  return outlineSprite(k);
}
function doorSprite(lockCol,open){
  const[k,g]=cv(32,32);
  box(g,0,0,32,32,'#5b3820');
  if(open){R(g,'#14121f',3,3,26,29);R(g,'#2a2438',3,28,26,4);return k}
  for(let i=0;i<2;i++){box(g,3+i*13,3,13,28,'#7a4c2a');box(g,5+i*13,6,9,9,'#8e6238');box(g,5+i*13,18,9,10,'#8e6238')}
  R(g,'#e0c060',14,17,1,3);R(g,'#e0c060',17,17,1,3);
  if(lockCol){box(g,11,13,10,12,lockCol);R(g,'#141226',15,17,2,4);R(g,'#ffffff',12,14,3,1)}
  return k;
}
const ADJOINT={skin:'#c68a5e',hair:'#2a1d18',hs:0,fhs:0,eye:'#3a2a1a',age:0,top:'#2e4a78',bot:'#26304a',f:false,glasses:true,beard:false,hat:false,trait:''};
function calepinSprite(){
  const[k,g]=cv(58,44);
  // pages, couverture, spirale, crayon
  R(g,'#2a1826',3,6,50,36);box(g,5,3,48,37,'#a33a3a');
  R(g,'#c8554e',7,5,44,2);R(g,'#7a2830',7,34,44,3);
  box(g,15,13,28,14,'#ecdfc0');R(g,'#8a8fa8',18,17,22,1);R(g,'#8a8fa8',18,20,16,1);R(g,'#a33a3a',18,23,10,1);
  for(let i=0;i<6;i++){R(g,'#d8dce4',1,6+i*6,7,2);R(g,'#ffffff',2,6+i*6,3,1);R(g,'#6a7080',1,8+i*6,7,1)}
  for(let i=0;i<20;i++){R(g,'#e0b04a',38+i,38-(i>>1)*2,3,2);R(g,'#fff0a8',38+i,38-(i>>1)*2,3,1)}
  R(g,'#3a2a22',36,38,3,2);R(g,'#e88aa0',56,18,2,3);
  return outlineSprite(k);
}
function pixelCursor(hand){
  const[k,g]=cv(24,24);
  if(hand){
    [[8,2,3,12],[11,6,3,8],[14,7,3,7],[17,8,3,7],[5,11,3,5],[6,14,14,6],[8,20,10,2]].forEach(q=>R(g,'#f6d2b4',...q));
    R(g,'#ffffff',8,2,1,10);R(g,'#c68a5e',11,12,1,3);R(g,'#c68a5e',14,12,1,3);R(g,'#c68a5e',17,12,1,3);
  }else{
    for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++){const d=x*x+y*y;if(d<=50&&d>=26)R(g,'#ffd23f',8+x,8+y);else if(d<26)R(g,'rgba(160,220,255,.45)',8+x,8+y)}
    R(g,'#ffffff',5,5,3,1);
    for(let i=0;i<8;i++)R(g,'#8a5a34',13+i,13+i,3,3);
  }
  outlineSprite(k);
  return k.toDataURL();
}


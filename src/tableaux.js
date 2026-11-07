// Dix tableaux de maître, dans leur cadre doré. Deux sont en format étroit.
const TAB_ETROITS=[1,5];
const hex6=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const melange=(a,b,t)=>{const A=hex6(a),B=hex6(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
function tableau(g,x,y,n,seed){
  n=((n%10)+10)%10;
  const et=TAB_ETROITS.includes(n),W0=et?22:46,H0=18,fw=W0+6,fh=H0+6;
  // Ombre sur le mur, puis cadre mouluré
  R(g,'rgba(8,6,18,.42)',x+2,y+fh,fw-1,2);R(g,'rgba(8,6,18,.42)',x+fw,y+2,2,fh);
  R(g,'#5a3e14',x,y,fw,fh);R(g,'#c8a040',x+1,y+1,fw-2,fh-2);R(g,'#ffe08a',x+1,y+1,fw-2,1);R(g,'#ffe08a',x+1,y+1,1,fh-2);R(g,'#8a6a20',x+1,y+fh-2,fw-2,1);R(g,'#8a6a20',x+fw-2,y+1,1,fh-2);
  for(let i=4;i<fw-4;i+=4){R(g,'#8a6a20',x+i,y+1,1,1);R(g,'#fff0b0',x+i,y+fh-2,1,1)}
  R(g,'#3a2610',x+2,y+2,fw-4,fh-4);[[1,1],[fw-3,1],[1,fh-3],[fw-3,fh-3]].forEach(([a,b])=>R(g,'#fff0b0',x+a,y+b,2,2));
  const p=(c,a,b,w=1,h=1)=>{a=Math.round(a);b=Math.round(b);for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(a+i>=0&&b+j>=0&&a+i<W0&&b+j<H0)R(g,c,x+3+a+i,y+3+b+j)};
  const ton=(st,t)=>{const s=Math.min(st.length-1.001,Math.max(0,t)*(st.length-1)),a=Math.floor(s);return melange(st[a],st[a+1],s-a)};
  const deg=(y0,h,st)=>{for(let j=0;j<h;j++)for(let i=0;i<W0;i++){const q=Math.floor((j/h)*10+bay(i,j)*.95)/10;p(ton(st,q),i,y0+j)}};
  const rond=(a,b,r,c)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r+.5)p(c,a+i,b+j)};
  const ov=(a,b,ra,rb,c)=>{for(let j=-rb;j<=rb;j++)for(let i=-ra;i<=ra;i++)if((i*i)/(ra*ra)+(j*j)/(rb*rb)<=1)p(c,a+i,b+j)};
  const sapin=(a,b,h,c)=>{for(let j=0;j<h;j++){const w=Math.round((h-j)*.42);p(c,a-w,b-j,w*2+1,1)}};
  const nu=(a,b,w)=>{ov(a,b,w,2,'#fdf8f0');ov(a+w*.6,b-1,w*.5,2,'#ffffff');ov(a-w*.6,b+.4,w*.5,1,'#d8d4e4')};
  ({
   0(){ // Lever de soleil sur le lac
    deg(0,12,['#2e4a9a','#6a7ac8','#e89a78','#fbd98e']);rond(32,9,2,'#fff6d0');nu(10,3,4);nu(38,2,3);
    for(let i=0;i<W0;i++){const h=5+Math.abs(((i+seed*3)%20)-10)*.62+noise(i,1,7);for(let j=0;j<h;j++)p(j>h-1.6?'#fbf6ff':j>h-3?'#c8bce4':((i+j)%6<3?'#6a5a9a':'#54487e'),i,12-j)}
    for(let i=0;i<W0;i++){const h=2+Math.sin(i*.28+seed)*1.5+noise(i,2,3);for(let j=0;j<h;j++)p(j>h-1.5?'#4a8a58':'#2e6a4c',i,12-j)}
    deg(12,6,['#8aa4dc','#2e4a88']);for(let k=0;k<6;k++)p('#fff0b8',31+noise(k,3,4)*2,12+k,2+(k>>1),1);
    [2,6,10,41,44].forEach((a,i)=>sapin(a,15+(i%2),8+(i%3),'#14302a'))},
   1(){ // Portrait d'une dame ou d'un notable, sur fond sombre
    deg(0,18,['#2a2a20','#4a4230','#1e1c18']);const fem=seed%2;
    if(fem)ov(11,7,6,7,'#3a2214');p('#1c2a44',2,14,18,4);p('#1c2a44',4,12,14,3);
    ov(11,6,4,5,'#e8c4a0');p('#f8dcc0',8,4,2,3);p('#c89a7a',14,4,1,6);p('#2a1a14',8,6,2,1);p('#2a1a14',12,6,2,1);p('#c89a7a',10,8,1,1);p(fem?'#a83a3a':'#8a5a4a',10,9,2,1);
    ov(11,2,fem?5:4,fem?2:1,fem?'#4a2c18':'#5a4a3a');if(!fem){p('#4a3a2c',8,8,6,2);p('#f4f0e4',9,12,4,2)}else{for(let i=0;i<7;i++)p('#f4f0e4',8+i,12+(i%2));p('#c8a040',10,13,2,2)}},
   2(){ // Nature morte : coupe de fruits et draperie
    deg(0,13,['#1e1612','#3a281e','#54382a']);p('#8a2f38',0,0,7,13);for(let i=0;i<7;i+=2)p('#a83a44',i,0,1,13);p('#5e1e28',6,0,1,13);
    deg(13,5,['#7a4a24','#4a2c16']);p('#a87a40',0,13,W0,1);
    ov(25,13,11,3,'#d8d0c4');ov(25,12,10,2,'#8a7a6a');
    [[17,9,'#b02a2a',3],[23,8,'#d89a2a',3],[29,9,'#7a9a30',3],[33,10,'#c04a2a',2]].forEach(([a,b,c,r])=>{rond(a,b,r,c);p(tone(c,.5),a-1,b-1,1,1);p('#3a2a14',a,b-r,1,1)});
    for(let i=0;i<9;i++)rond(21+(i%3)*2+(i>>2),11+(i%2),1,i%2?'#5a2a78':'#7a3a98');
    ov(40,9,2,4,'#3a6a4a');p('#8ac0a0',39,6,1,4);p('#c8a040',39,4,3,1);rond(8,15,1,'#d8b040')},
   3(){ // Trois-mâts au couchant
    deg(0,10,['#5a3a78','#d8604a','#f8a848','#fce08a']);rond(14,10,3,'#fff4c0');nu(36,3,4);
    deg(10,8,['#c86a3a','#3a4a78','#1a2a54']);for(let k=0;k<8;k++)p('#fff0a0',12+noise(k,5,3)*3,10+k,4-(k>>2),1);
    for(let j=0;j<7;j++){p('#ece0c8',29,3+j,1+j,1);p('#ece0c8',34,2+j,1+j,1);p('#d8c8a8',38,4+j*.8,1+(j>>1),1)}p('#2a1a14',31,1,1,10);p('#2a1a14',35,1,1,10);p('#2a1a14',39,3,1,8);
    p('#2a1a14',26,11,18,2);p('#2a1a14',28,13,14,1);p('#d8483e',35,0,2,1);[[8,4],[11,3],[20,6]].forEach(([a,b])=>{p('#1a1626',a,b);p('#1a1626',a+1,b-1);p('#1a1626',a+2,b)})},
   4(){ // Nuit tourmentée sur la ville
    for(let j=0;j<18;j++)for(let i=0;i<W0;i++){const v=Math.sin(i*.34+j*.5+Math.sin(j*.4+i*.1)*2);p(v>.62?'#7a9ad8':v>.1?'#2e4a98':v>-.5?'#1e3478':'#142258',i,j)}
    rond(37,5,3,'#ffe08a');rond(36,5,2,'#fff4c8');[[9,4],[18,2],[25,6],[5,9],[30,10]].forEach(([a,b])=>{rond(a,b,1,'#f8e8a0');p('#ffffff',a,b)});
    for(let i=0;i<W0;i+=3){const h=4+Math.floor(noise(i,1,5)*5);p('#0c1024',i,18-h,3,h);if(i%6===0)p('#ffc860',i+1,16-(i%2),1,1);p('#ffc860',i+((i>>1)&1),17-h+2,1,1)}
    p('#0c1024',22,6,1,6);p('#0c1024',21,10,3,8);sapin(6,17,12,'#0a1a14')},
   5(){ // Bouquet dans son vase
    deg(0,18,['#143a3e','#1e4e50','#102a2e']);p('#6a4424',0,15,22,3);p('#a87a40',0,15,22,1);
    p('#3a6a4a',9,8,1,7);p('#3a6a4a',12,8,1,7);p('#3a6a4a',11,6,1,8);
    [[11,4,'#f8c8d8'],[7,6,'#e84a5a'],[15,6,'#ffd23f'],[5,3,'#ffffff'],[17,3,'#e88a3a'],[11,1,'#d84a8a'],[8,1,'#ffd23f'],[14,2,'#ffffff'],[3,7,'#8a5ac8'],[19,7,'#e84a5a']].forEach(([a,b,c])=>{rond(a,b,1,c);p(tone(c,-.3),a+1,b+1,1,1);p('#ffe08a',a,b,1,1)});
    [[4,9],[18,10],[6,11],[16,12]].forEach(([a,b])=>p('#3a7a4a',a,b,3,1));
    ov(11,13,3,3,'#d8e4ec');p('#2e6a8c',8,13,7,1);p('#ffffff',9,11,1,3)},
   6(){ // Sous-bois d'automne
    deg(0,18,['#f8d898','#e8a050','#a85a2a']);
    for(let i=0;i<70;i++){const a=noise(i,1,9)*W0,b=noise(i,2,9)*11,c=['#c83a1a','#e87a1a','#f8b02a','#a82a14'][i%4];rond(a,b,1+(i%2),c)}
    [[6,1],[15,2],[28,2],[38,1],[43,2]].forEach(([a,w])=>{p('#2a1a12',a,0,w,18);p('#5a3a24',a,3,1,13)});
    p('#7a4a20',0,14,W0,4);polyP(g,[[x+3+18,y+3+17],[x+3+29,y+3+17],[x+3+24,y+3+8],[x+3+22,y+3+8]],'#e8c88a');for(let i=0;i<28;i++)p(['#e87a1a','#c83a1a','#f8b02a'][i%3],noise(i,3,5)*W0,14+noise(i,4,5)*4)},
   7(){ // Campagne en été
    deg(0,9,['#3a7ac8','#8ac0e8','#e8f0e8']);nu(11,3,5);nu(32,2,4);nu(42,5,2);
    for(let i=0;i<W0;i++){const h=9+Math.sin(i*.16+seed)*1.6;for(let j=Math.floor(h);j<18;j++)p(j<11?'#6a9a4a':((j+(i>>2))%3?'#e0c040':'#c8a030'),i,j)}
    p('#ece0c8',28,6,8,5);polyP(g,[[x+3+26,y+3+7],[x+3+32,y+3+2],[x+3+38,y+3+7]],'#b03a2a');p('#3a2a22',31,8,2,3);p('#3a6a8a',34,7,1,2);p('#3a6a8a',29,7,1,2);
    [6,10,14].forEach(a=>{ov(a,6,1,5,'#2e5a32');p('#4a2c18',a,10,1,2)});ov(41,8,3,3,'#3a7a3a');p('#4a2c18',41,10,1,3);for(let i=0;i<9;i++)p('#a88a4a',22+i*.5,11+i*.8,3,1)},
   8(){ // Phare dans la tempête
    deg(0,12,['#2a3048','#4a5470','#8a8aa0']);for(let i=0;i<6;i++)ov(6+i*8,2+(i%2),5,2,i%2?'#3a4058':'#585e78');
    for(let k=0;k<6;k++){p('#fff4c0',24-k*4,3+(k>>1),4,1);p('#ffe890',24+2,3,16-(k*2),1)}
    for(let i=0;i<W0;i++){const h=i<16?3:i<30?9-(i-16)*.2+noise(i,1,4):0;p('#3a3028',i>=16?i:i,18-Math.max(h,0),1,Math.max(h,0))}
    p('#f0ece0',21,5,4,7);p('#c83a2a',21,7,4,2);p('#c83a2a',21,10,4,1);p('#d8d4c8',24,5,1,7);p('#1a1626',20,4,6,1);p('#fff4a0',22,2,2,2);p('#1a1626',21,1,4,1);
    deg(13,5,['#3a5a78','#1e3a58']);for(let i=0;i<W0;i+=3){const a=(i*7+seed)%18;p('#e8f0f8',i,13+((i>>1)%4),2,1);p('#c8dcec',a,16,2,1)}p('#3a3028',16,12,16,4);p('#58483a',18,11,9,1);for(let i=0;i<8;i++)p('#f4f8fc',12+i*.5,12+(i%3),2,1)},
   9(){ // Village sous la neige, un soir d'hiver
    deg(0,10,['#141c4a','#2e3a78','#6a6aa0']);rond(36,3,2,'#f4eec0');rond(37,3,2,'#141c4a');for(let i=0;i<16;i++)p('#ffffff',noise(i,1,8)*W0,noise(i,2,8)*8);
    for(let i=0;i<W0;i++){const h=10+Math.sin(i*.2+seed)*1.4;for(let j=Math.floor(h);j<18;j++)p(j%3?'#dfe6f4':'#c0cce4',i,j)}
    [[9,7,6],[19,8,7],[30,7,5]].forEach(([a,b,w])=>{p('#5a3a28',a,b+2,w,6);polyP(g,[[x+3+a-1,y+3+b+2],[x+3+a+w/2,y+3+b-2],[x+3+a+w,y+3+b+2]],'#f4f8ff');p('#ffc860',a+1,b+4,2,2);p('#ffc860',a+w-2,b+4,1,2);p('#3a2a22',a+w-1,b-1,1,3);p('#b8bcd4',a+w-1,b-3,1,1);p('#b8bcd4',a+w,b-5,1,1)});
    [4,15,27,41,44].forEach((a,i)=>{sapin(a,15+(i%2),7,'#163028');p('#f4f8ff',a-1,10+(i%2),3,1);p('#f4f8ff',a-2,12+(i%2),2,1)})}
  })[n]();
}

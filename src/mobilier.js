// Mobilier varié : un lit propre à chaque lieu, dix plantes en pot, dix lampadaires,
// et de quoi finir un couloir : escalier de service ou sortie de secours.
const PX=g=>(c0,x,y,w=1,h=1)=>R(g,c0,x,y,w,h);
function oreiller(g,x,y,w,col){const P=PX(g);P(tone(col,-.28),x,y+1,w,7);P(col,x,y,w,7);P(tone(col,.35),x+1,y+1,w-3,2);P(tone(col,-.16),x+1,y+5,w-2,1);P(tone(col,-.3),x+w-1,y+1,1,6)}
function couverture(g,y0,y1,col,motif,x0=1,x1=31){
  const P=PX(g);
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const m=motif?motif(x-x0,y-y0):null;P(m||tone(col,(noise(x>>1,y>>1,9)-.5)*.08),x,y)}
  P(tone(col,.25),x0,y0,x1-x0,1);P(tone(col,-.3),x1-2,y0,2,y1-y0);P(tone(col,-.38),x0,y1-1,x1-x0,1);
}
function drapRabattu(g,y,x0=2,x1=30){const P=PX(g);P('#f4ecd8',x0,y,x1-x0,4);P('#d8d0bc',x0,y+3,x1-x0,1);P('#ffffff',x0+1,y,x1-x0-2,1)}
const LITS=[
 // 0. Hôtel des Cimes : lit de chalet en pin, cœur découpé, couverture à carreaux
 (g,v)=>{const P=PX(g),pin='#b07a40';
  for(let x=0;x<32;x+=4)bois(g,x,0,4,13,tone(pin,x%8?0:.06),v+x);
  for(let x=4;x<32;x+=4)P(tone(pin,-.3),x,1,1,12);
  [[14,4,2,1],[17,4,2,1],[13,5,7,2],[14,7,5,1],[15,8,3,1],[16,9,1,1]].forEach(([x,y,w,h])=>P('#3a2414',x,y,w,h));
  P(tone(pin,-.35),0,12,32,1);P(tone(pin,-.2),0,0,2,48);P(tone(pin,-.2),30,0,2,48);P(tone(pin,.25),0,0,1,48);g.clearRect(0,0,1,1);g.clearRect(31,0,1,1);
  P('#ece4d0',2,13,28,31);oreiller(g,3,14,12,'#fbf6ea');oreiller(g,17,14,12,'#fbf6ea');drapRabattu(g,22);
  couverture(g,26,43,'#c43a3a',(i,j)=>((i>>2)+(j>>2))%2?null:'#efe4d8',2,30);
  P('#d8c8a0',2,37,28,4);P('#8a2a2a',2,38,28,1);P('#5a7a4a',2,40,28,1);
  bois(g,0,43,32,5,pin,v+3,true);P(tone(pin,.25),0,43,32,1);P(tone(pin,-.35),0,47,32,1)},
 // 1. Villa Mirabel : lit en fer forgé, édredon fleuri bordé de dentelle
 (g,v)=>{const P=PX(g),fer='#2a2830',fe2='#555060';
  P(fer,0,1,2,47);P(fer,30,1,2,47);ellipseP(g,1,1,2,1,fe2);ellipseP(g,30,1,2,1,fe2);
  const arc=x=>4-Math.round(Math.sin((x-2)/27*Math.PI)*3);for(let x=2;x<30;x++){P(fer,x,arc(x),1,2);P(fe2,x,arc(x),1,1)}P(fer,2,12,28,1);
  [5,9,13,19,23,27].forEach(x=>P(fer,x,arc(x)+2,1,10-arc(x)));ellipseP(g,16,7,3,3,fer);ellipseP(g,16,7,1,1,'#c8a040');P(fer,16,10,1,2);
  [[9,9],[22,9]].forEach(([x,y])=>{P(fer,x-1,y,3,1);P(fer,x,y-1,1,3)});
  P('#f4f0e8',2,13,28,31);oreiller(g,3,14,12,'#ffffff');oreiller(g,17,14,12,'#ffffff');
  couverture(g,21,43,'#f2ece4',(i,j)=>{const k=(i*7+j*13)%23;return k===0?'#e07a9a':k===5?'#7ab07a':k===11?'#f0b0c0':null},2,30);
  for(let x=2;x<30;x+=2)P(x%4?'#ffffff':'#e8e0d8',x,42,2,x%4?2:1);
  P(fer,0,44,32,2);P(fe2,0,44,32,1);for(let x=4;x<30;x+=4)P(fer,x,46,1,2)},
 // 2. Nocturne 704 : couchette de train de nuit, rideau et écusson de la compagnie
 (g,v)=>{const P=PX(g),aca='#6a2a1a';
  bois(g,0,0,32,13,aca,v);P(tone(aca,.3),0,0,32,1);P(tone(aca,-.4),0,12,32,1);panneau(g,3,2,26,8,tone(aca,.08));
  P('#c8a040',5,4,3,4);P('#fff0b0',5,5,3,2);P('#c8a040',21,4,5,5);P('#8a2a2a',22,5,3,3);
  P(tone(aca,-.2),0,13,32,35);P('#f0ece0',2,13,26,31);oreiller(g,3,14,23,'#ffffff');drapRabattu(g,22,2,28);
  couverture(g,26,43,'#2f4a3a',(i,j)=>j===3||j===4?'#c8a040':null,2,28);P('#c8a040',12,33,5,4);P('#2f4a3a',13,34,3,2);
  for(let y=13;y<44;y++)P(y%4<2?'#2a3a6a':'#34487a',28,y,3,1);P('#c8a040',27,13,1,31);
  bois(g,0,43,32,5,aca,v+2,true);P('#c8a040',0,43,32,1)},
 // 3. Tour Horizon : lit bas moderne, tête capitonnée grise, plaid foncé
 (g,v)=>{const P=PX(g),gr='#6a6e78';
  P(tone(gr,-.4),1,0,30,13);P(gr,2,1,28,11);
  for(let x=2;x<30;x+=7)for(let y=1;y<12;y+=5){P(tone(gr,.12),x,y,6,4);P(tone(gr,-.25),x+3,y+2,1,1)}
  P('#3a3430',0,13,32,35);P('#e8e6e0',1,13,30,30);
  oreiller(g,3,14,12,'#f4f2ee');oreiller(g,17,14,12,'#f4f2ee');oreiller(g,11,17,10,'#d8a83a');
  couverture(g,22,42,'#c8ccd2',(i,j)=>j===0?'#e8eaee':null,1,31);
  P('#4a4e58',1,34,30,6);P(tone('#4a4e58',.2),1,34,30,1);for(let x=1;x<31;x+=3)P('#3a3e48',x,39,1,2);
  P('#2a2420',0,42,32,4);P('#4a3a30',0,42,32,1);P('#141010',2,46,28,2)},
 // 4. Station Borée : lit de camp en tubes, sac de couchage orange
 (g,v)=>{const P=PX(g),tu='#8a9aaa';
  P(tone(tu,-.3),0,1,2,47);P(tone(tu,-.3),30,1,2,47);P(tu,0,1,1,47);P(tu,30,1,1,47);
  P(tu,0,1,32,2);P(tu,0,7,32,2);P(tone(tu,-.3),0,3,32,1);P(tone(tu,-.3),0,9,32,1);
  P('#5a6068',2,11,28,33);oreiller(g,4,12,24,'#d8dce0');
  couverture(g,19,42,'#d8641e',(i,j)=>i===(j>>1)+2?'#3a3a3a':(i+j)%9===0?'#e8843e':null,2,30);
  P('#5a6a4a',3,36,26,5);P(tone('#5a6a4a',.2),3,36,26,1);P('#3a4a2a',3,38,26,1);
  P(tu,0,42,32,2);P(tone(tu,-.3),0,44,32,1);P(tone(tu,-.4),1,45,2,3);P(tone(tu,-.4),29,45,2,3)},
 // 5. Théâtre des Lilas : méridienne de loge en velours, traversin doré
 (g,v)=>{const P=PX(g),ve='#5a2a6a';
  for(let y=0;y<14;y++){const w=32-Math.round(Math.abs(y-6)*.6);P(tone(ve,y<3?-.03:-.15),(32-w)>>1,y,w,1)}
  ellipseP(g,3,7,3,5,tone(ve,-.05));ellipseP(g,28,7,3,5,tone(ve,-.05));ellipseP(g,3,7,1,2,'#d8b35c');ellipseP(g,28,7,1,2,'#d8b35c');
  for(let x=7;x<27;x+=5)P(tone(ve,-.35),x,5,1,1);
  P(tone(ve,-.3),0,14,32,32);couverture(g,14,44,ve,(i,j)=>(i%6===0&&j%6===3)?tone(ve,-.35):null,1,31);
  P('#d8b35c',3,15,26,6);P('#f0d888',3,15,26,2);P('#a8842c',3,20,26,1);P('#7a1a3a',2,16,1,4);P('#7a1a3a',29,16,1,4);
  for(let y=28;y<38;y++)P(tone('#efe4cc',(noise(1,y,3)-.5)*.2),4+(y%3),y,24-(y%4),1);
  [[1,44],[29,44]].forEach(([x,y])=>{P('#d8b35c',x,y,2,2);P('#a8842c',x,y+2,2,2)});P('#3a1a28',3,44,26,2);P('#d8b35c',3,44,26,1)},
 // 6. Paquebot Aurélia : couchette de cabine, hublot, ancre brodée, rambarde en laiton
 (g,v)=>{const P=PX(g),aca='#5a2e1a';
  bois(g,0,0,32,13,aca,v);P(tone(aca,.3),0,0,32,1);ellipseP(g,16,6,5,5,'#c8a040');ellipseP(g,16,6,4,4,'#1e3a5a');P('#6a9ac8',14,4,2,2);P('#3a5a7a',17,7,2,2);
  P(tone(aca,-.2),0,13,32,35);P('#f0ece4',2,13,28,31);oreiller(g,3,14,12,'#ffffff');oreiller(g,17,14,12,'#ffffff');drapRabattu(g,22);
  couverture(g,26,43,'#22345a',null,2,30);
  [[16,29],[16,30],[16,31],[16,32],[16,33],[16,34],[16,35],[14,30],[15,30],[17,30],[18,30],[13,35],[14,36],[15,37],[16,37],[17,37],[18,36],[19,35]].forEach(([x,y])=>P('#e8e4d8',x,y));
  P('#c8a040',29,13,2,31);P('#fff0a0',29,13,1,31);bois(g,0,43,32,5,aca,v+1,true);P('#c8a040',0,43,32,1)},
 // 7. Clinique des Tilleuls : lit médicalisé, barrières, feuille de soins, roulettes
 (g,v)=>{const P=PX(g),bl='#e8ecef',mt='#9aa4ac';
  P(mt,0,0,2,46);P(mt,30,0,2,46);P('#c8d0d6',0,0,1,46);
  P(bl,2,1,28,11);P('#ffffff',2,1,28,1);P(tone(bl,-.15),2,11,28,1);P('#7ab0c8',4,4,24,2);
  P('#d8dee2',2,12,28,32);oreiller(g,4,13,24,'#ffffff');P('#cfd6da',2,21,28,2);
  couverture(g,23,42,'#bcd8c4',(i,j)=>j===0?'#e4f0e8':null,3,29);
  P(mt,2,16,1,20);P(mt,29,16,1,20);for(let y=16;y<36;y+=5){P(mt,1,y,2,1);P(mt,29,y,2,1)}
  P(bl,0,42,32,4);P(tone(bl,-.2),0,45,32,1);P('#ffffff',12,37,8,7);P('#8a8a8a',13,39,6,1);P('#8a8a8a',13,41,5,1);P('#5a5a5a',15,36,2,1);
  P('#2a2a30',1,46,3,2);P('#2a2a30',28,46,3,2)},
 // 8. Château de Vauclair : lit à baldaquin, tentures nouées, couvre-lit à losanges
 (g,v)=>{const P=PX(g),bo='#3a2214',bx='#7a1a2a',or='#d8b35c';
  P(bx,0,0,32,4);P(tone(bx,.2),0,0,32,1);for(let x=0;x<32;x+=2)P(or,x,4,1,2);
  P(tone(bx,-.25),6,4,20,9);for(let x=8;x<25;x+=4)P(or,x,7,1,1);
  for(let y=4;y<22;y++){const w=4-Math.round(Math.abs(y-12)/4);P(y%3?bx:tone(bx,-.2),2,y,w,1);P(y%3?bx:tone(bx,-.2),30-w,y,w,1)}
  P(or,2,13,4,1);P(or,26,13,4,1);P(bo,0,0,2,48);P(bo,30,0,2,48);P(tone(bo,.3),0,0,1,48);
  P('#f4ecd8',6,13,20,9);oreiller(g,6,14,10,'#fffaf0');oreiller(g,16,14,10,'#fffaf0');P('#f4ecd8',2,22,28,4);drapRabattu(g,22);
  couverture(g,26,43,bx,(i,j)=>((i+j)%6===0||(i-j+60)%6===0)?tone(bx,.18):null,2,30);P(or,2,26,28,1);
  bois(g,0,43,32,5,bo,v,true);P(or,0,43,32,1)},
 // 9. Casino des Sables : lit Art déco, tête en éventail laqué noir et or, satin rouge
 (g,v)=>{const P=PX(g),noir='#1a1418',or='#d8b35c',rouge='#9a1a2a';
  for(let y=0;y<14;y++)for(let x=0;x<32;x++){const dx=x-15.5,dy=14-y;if(dx*dx/256+dy*dy/196>1)continue;P(Math.round(Math.atan2(dy,dx)*10)%2?noir:tone(noir,.14),x,y)}
  for(let k=1;k<8;k++){const a=Math.PI*k/8;traitP(g,or,16,13,Math.round(16+Math.cos(a)*14),Math.round(13-Math.sin(a)*12))}
  P(or,0,13,32,1);P(noir,0,14,32,34);P('#f0e8e0',2,14,28,30);
  oreiller(g,3,15,12,rouge);oreiller(g,17,15,12,rouge);P(or,3,22,12,1);P(or,17,22,12,1);
  couverture(g,24,43,'#24181e',(i,j)=>((i+j)%5===0)?rouge:null,2,30);P(or,2,24,28,1);
  P(noir,0,43,32,5);P(or,0,43,32,1);P(or,0,47,32,1)}
];
// ——— Dix plantes en pot, toutes posées sur le sol (bas du pot à y=33) ———
function potT(g,y,h,wt,wb,col,rebord){
  for(let j=0;j<h;j++){const w=Math.round(wt+(wb-wt)*j/Math.max(1,h-1)),x=8-(w>>1);R(g,tone(col,(j<2?.18:0)-j*.025),x,y+j,w,1);R(g,tone(col,.28),x+1,y+j,1,1);R(g,tone(col,-.32),x+w-1,y+j,1,1)}
  if(rebord){const x=8-(wt>>1)-1;R(g,tone(col,.12),x,y,wt+2,2);R(g,tone(col,.35),x,y,wt+2,1)}
  R(g,'#3a2a1c',8-(wt>>1)+1,y,wt-2,1);
}
function feuille(g,x,y,a,l,c1,c2,cour=.02){for(let t=0;t<l;t++){const X=x+Math.cos(a)*t,Y=y+Math.sin(a)*t+t*t*cour;R(g,t%3?c1:c2,Math.round(X),Math.round(Y),t<l-2?2:1,1)}}
const PLANTES=[
 // fougère, pot en terre cuite
 g=>{for(let i=0;i<11;i++){const a=-Math.PI*(.05+.9*i/10);feuille(g,8,24,a,9+(i*7%5),['#3a7a48','#4d9a50','#6ab85a','#2f6340'][i%4],'#2a5a34',.035)}potT(g,24,10,11,8,'#c06a3a',true)},
 // buis taillé en boule, cache-pot bleu et blanc
 g=>{const P=PX(g);P('#5b3820',7,15,2,10);for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++)if(x*x+y*y<=46)P(tone('#3f7a3a',(-x-y)*.035+(noise(x+9,y+9,4)-.5)*.3),8+x,9+y);potT(g,24,10,12,10,'#e8ecf0',true);for(let x=3;x<14;x+=3)P('#3a5aa8',x,27,2,2);P('#3a5aa8',3,30,11,1)},
 // langue-de-belle-mère, cylindre de béton
 g=>{const P=PX(g);[[4,13,'#2e6a3a'],[6,6,'#3a7a44'],[8,2,'#2e6a3a'],[10,8,'#3a7a44'],[12,12,'#2e6a3a']].forEach(([x,t,c0])=>{for(let y=t;y<24;y++){const w=y<t+3?1:2;P(c0,x,y,w,1);if(y%4===0)P(tone(c0,.3),x,y,w,1)}P('#c8c050',x+1,t+4,1,20-t)});potT(g,23,11,11,11,'#8a8a86',false);P('#6a6a66',3,23,11,1)},
 // cactus fleuri, petit pot en terre
 g=>{const P=PX(g),cv0='#4a8a4a';P(cv0,6,10,5,17);P(tone(cv0,.2),7,10,1,17);P(cv0,2,15,2,6);P(cv0,2,19,4,2);P(cv0,12,13,2,7);P(cv0,10,18,4,2);for(let y=11;y<26;y+=3)P('#e8f0d8',9,y);P('#e85a8a',7,7,3,3);P('#ffb0c8',8,7,1,1);potT(g,26,8,9,7,'#b8603a',true)},
 // monstera, panier tressé
 g=>{const P=PX(g);[[4,10,-1],[11,8,1],[8,4,0],[3,17,-1],[13,16,1]].forEach(([x,y,s])=>{ellipseP(g,x,y,4,3,'#2f7a40');P('#5aa860',x-2,y-1,3,1);P('#0e0c16',x+s*2,y,1,2);P('#0e0c16',x-s,y+1,1,2)});for(let y=12;y<24;y++)P('#3a6a34',8,y);
  for(let j=0;j<10;j++){const w=12-(j>>2);for(let i=0;i<w;i++)P(((i+j)%3)?'#b8945a':'#8a6a3a',8-(w>>1)+i,24+j)}P('#6a4a2a',2,24,12,1)},
 // palmier, urne en laiton
 g=>{for(let i=0;i<6;i++){const a=-Math.PI*(.12+.76*i/5);feuille(g,8,22,a,15,'#3a7a3a','#5a9a4a',.05)}const P=PX(g);for(let i=0;i<6;i++){const a=-Math.PI*(.12+.76*i/5);for(let t=4;t<14;t+=2){const X=8+Math.cos(a)*t,Y=22+Math.sin(a)*t+t*t*.05;P('#4a8a3a',Math.round(X)-1,Math.round(Y)+1,1,2);P('#4a8a3a',Math.round(X)+1,Math.round(Y)+1,1,2)}}
  potT(g,23,4,10,12,'#c8a040',true);potT(g,27,7,12,8,'#b08a30',false)},
 // géraniums rouges, pot vernissé vert
 g=>{const P=PX(g);for(let k=0;k<9;k++){const x=2+(k*5)%12,y=14+(k*3)%9;ellipseP(g,x+1,y+1,2,2,'#3a7a3a')}[[3,13],[8,10],[12,14],[6,17],[11,19]].forEach(([x,y])=>{P('#d8283a',x,y,3,3);P('#ff6a6a',x,y,1,1);P('#a01828',x+2,y+2,1,1)});potT(g,25,9,12,9,'#3a7a5a',true)},
 // bonsaï, coupe plate
 g=>{const P=PX(g);traitP(g,'#5b3820',8,29,6,24,2);traitP(g,'#5b3820',6,24,10,18,2);traitP(g,'#5b3820',10,18,7,13,1);[[4,20,4,2],[12,17,3,2],[7,12,4,2]].forEach(([x,y,a,b])=>{ellipseP(g,x,y,a,b,'#3a6a34');P('#5a9a4a',x-a+1,y-b+1,a,1)});P('#3a5aa8',1,29,14,3);P('#5a7ac8',1,29,14,1);P('#2a3a6a',3,32,2,2);P('#2a3a6a',11,32,2,2)},
 // lilas, urne de pierre
 g=>{const P=PX(g);for(let k=0;k<7;k++)ellipseP(g,2+(k*4)%13,15+(k*5)%7,2,1,'#3a7a3a');[[4,6],[9,3],[13,8]].forEach(([x,y])=>{for(let j=0;j<10;j++){const w=Math.max(1,4-(j>>2));for(let i=0;i<w;i++)P((i+j)%2?'#a87ac8':'#c8a0e0',x-(w>>1)+i,y+j)}});
  potT(g,21,6,13,9,'#9a9a94',true);P('#8a8a84',6,27,4,4);potT(g,31,3,9,10,'#9a9a94',false)},
 // orchidée blanche, tuteur, pot blanc
 g=>{const P=PX(g);ellipseP(g,5,25,4,1,'#2f6a3a');ellipseP(g,11,24,4,1,'#3a7a44');P('#7a6a4a',9,4,1,22);traitP(g,'#4a6a3a',9,6,13,9,1);[[12,9],[14,13],[10,7],[13,16]].forEach(([x,y])=>{P('#ffffff',x-1,y,3,2);P('#ffffff',x,y-1,1,4);P('#d8508a',x,y,1,1)});potT(g,26,8,9,8,'#f0f0ec',true)}
];
// ——— Dix lampadaires (pied à y=39) ———
function abatJour(g,y,h,wt,wb,col){for(let j=0;j<h;j++){const w=Math.round(wt+(wb-wt)*j/(h-1));R(g,tone(col,-j*.015+(j%3===1?-.06:0)),8-(w>>1),y+j,w,1)}}
const LAMPES=[
 g=>{const P=PX(g);abatJour(g,2,12,6,14,'#f4dca0');for(let x=1;x<15;x+=2)P('#c8a040',x,14,1,2);P('#fff4c8',6,6,4,6);P('#c8a040',7,16,2,22);P('#ffe08a',7,16,1,22);ellipseP(g,8,38,4,1,'#8a6a2a')},
 g=>{const P=PX(g);for(let j=0;j<10;j++){const w=Math.round(6+j*.9);for(let i=0;i<w;i++){const x=8-(w>>1)+i;P((i%3===0||j%4===0)?'#2a2418':['#c83a2a','#3a8a4a','#e8a030','#3a6aa8'][((i/3|0)+(j>>2))%4],x,3+j)}}P('#5a4a30',7,13,2,24);P('#8a7040',7,13,1,24);ellipseP(g,8,38,4,1,'#3a2a1a')},
 g=>{const P=PX(g);P('#e8e8ec',12,8,1,30);traitP(g,'#e8e8ec',12,8,8,3,1);traitP(g,'#e8e8ec',8,3,5,5,1);ellipseP(g,4,9,4,3,'#c8ccd4');P('#2a2a30',0,9,9,1);P('#fff4c8',2,10,5,2);P('#8a8a90',9,36,7,4);P('#b8b8c0',9,36,7,1)},
 g=>{const P=PX(g);abatJour(g,3,12,13,13,'#f4f0e4');P('#e4e0d4',2,8,13,1);traitP(g,'#7a5a34',8,15,2,39,1);traitP(g,'#7a5a34',8,15,14,39,1);P('#7a5a34',8,15,1,24);P('#5b3820',7,15,3,2)},
 g=>{const P=PX(g);P('#2a2a30',4,10,1,28);traitP(g,'#2a2a30',4,10,11,5,1);ellipseP(g,12,8,3,3,'#2a2a30');ellipseP(g,12,8,2,2,'#fff0b0');P('#2a2a30',10,8,5,1);P('#2a2a30',12,6,1,5);ellipseP(g,5,38,4,1,'#1a1a20')},
 g=>{const P=PX(g);for(let j=0;j<4;j++)for(let i=0;i<14;i++)if(bay(i,j)<.6-j*.12)P('#fff4c8',1+i,j);abatJour(g,4,5,14,8,'#d8b35c');P('#f0d888',1,4,14,1);P('#c8a040',7,9,2,29);P('#f0d888',7,9,1,29);ellipseP(g,8,38,4,1,'#a8842c')},
 g=>{const P=PX(g);P('#2a2830',7,12,2,26);P('#2a2830',2,12,12,1);[[2,6],[7,4],[13,6]].forEach(([x,y])=>{P('#2a2830',x-1,y+5,3,2);P('#f4ecd8',x,y,1,5);P('#ffd25a',x,y-3,1,2);P('#fff4c8',x,y-2,1,1)});traitP(g,'#2a2830',8,37,3,39,1);traitP(g,'#2a2830',8,37,13,39,1)},
 g=>{const P=PX(g);P('#fff0c8',3,4,10,32);for(let y=4;y<36;y+=5)P('#e8d8a8',3,y,10,1);P('#7a5a34',3,3,10,1);P('#7a5a34',3,36,10,1);P('#7a5a34',3,37,2,3);P('#7a5a34',11,37,2,3);for(let y=6;y<34;y++)if(y%5)P('#fff8e0',7,y,2,1)},
 g=>{const P=PX(g);P('#6a4a2a',7,18,2,20);P('#4a2e1c',4,37,8,3);P('#c8a040',5,5,6,2);P('#c8a040',7,2,2,3);P('#a8842c',4,7,8,1);P('#d8e4e8',5,8,6,8);P('#ffcc4a',7,11,2,3);P('#fff4c8',7,12,1,1);P('#c8a040',4,8,1,8);P('#c8a040',11,8,1,8);P('#c8a040',4,16,8,2)},
 g=>{const P=PX(g);abatJour(g,2,11,7,14,'#a3262a');for(let x=2;x<14;x+=2)P('#7a1a20',x,4,1,9);P('#d8b35c',1,13,14,1);P('#d8b35c',2,14,1,3);P('#d8b35c',13,14,1,3);P('#1a1418',7,14,2,24);[18,26,33].forEach(y=>P('#d8b35c',6,y,4,1));ellipseP(g,8,38,4,1,'#1a1418')}
];
const lieuDe=v=>(typeof c!=='undefined'&&c&&c.lv>=0&&c.lv<10)?c.lv:v%10;
Object.assign(SPR,{
  bed(g,v){LITS[lieuDe(v)](g,v)},
  plant(g,v){g.save();g.translate(0,0);PLANTES[v%10](g,v);g.restore()},
  lamp(g,v){LAMPES[v%10](g,v)},
  // Bout de couloir : l'escalier de service, fermé par une corde rouge
  escalier(g,v){const P=PX(g),bo='#5b3820';
    P(tone(bo,-.2),0,0,32,46);P('#0e0c16',2,2,28,42);
    for(let k=0;k<8;k++){const y=41-k*5,t=-.06-k*.1;P(tone('#8a6a4a',t),2+k,y-1,28-k*2,2);P(tone('#5a3a24',t),2+k,y+1,28-k*2,3)}
    traitP(g,'#c8a040',28,40,21,5);traitP(g,tone('#c8a040',-.3),28,41,21,6);for(let k=0;k<7;k++)P(tone(bo,-.05),28-k,40-k*5,1,4);
    P('#c8a040',3,30,2,14);P('#c8a040',27,30,2,14);P('#fff0a0',3,30,1,1);P('#fff0a0',27,30,1,1);
    for(let x=5;x<27;x++)P('#a3262a',x,32+Math.round(Math.sin((x-5)/22*Math.PI)*3),1,2);
    P('#f4ecd8',12,37,8,5);P('#a3262a',13,39,6,1);P(tone(bo,.25),0,0,32,1);P(tone(bo,-.4),0,45,32,1)},
  // Bout de couloir : la sortie de secours, enchaînée pendant la tempête
  secours(g,v){const P=PX(g),cad='#6a7078',po='#4a6a5a';
    P('#0e3a1e',8,0,16,6);P('#2ad86a',9,1,14,4);P('#e8fff0',12,1,1,1);P('#e8fff0',11,2,3,1);P('#e8fff0',10,3,1,1);P('#e8fff0',13,3,1,1);P('#e8fff0',16,2,5,1);P('#e8fff0',19,1,1,3);
    P(cad,1,7,30,39);P(tone(cad,.25),1,7,30,1);P(po,3,9,13,36);P(tone(po,-.08),16,9,13,36);P(tone(po,.2),3,9,13,1);P(tone(po,-.35),15,9,2,36);
    P('#c8ccd0',4,26,10,2);P('#c8ccd0',18,26,10,2);P('#8a8e94',4,28,10,1);P('#8a8e94',18,28,10,1);
    for(let x=4;x<28;x+=2)P(x%4?'#9aa0a8':'#6a7078',x,27+((x>>1)%2),2,1);P('#c8a040',14,29,4,4);P('#7a5a20',15,30,2,2);P('#c8a040',15,27,2,2);
    P('#f4ecd8',20,13,7,6);P('#a3262a',21,15,5,1);P('#5a5a5a',21,17,4,1);P(tone(cad,-.4),1,45,30,1)}
});
Object.assign(SH,{plant:34,lamp:40,escalier:46,secours:46});

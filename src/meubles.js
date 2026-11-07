// Mobilier redessiné : chaque meuble a un dessus visible et une face, éclairés du même côté.
function bois(g,x,y,w,h,col,s,horiz){
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const v=horiz?noise((x+i)>>3,y+j,s):noise(x+i,(y+j)>>3,s);
    R(g,tone(col,(v-.5)*.13),x+i,y+j);
  }
}
// Un volume : d lignes de dessus, puis la face. Lumière en haut à gauche.
function caisse(g,x,y,w,h,d,col,s=1,dessus){
  bois(g,x,y,w,d,dessus||tone(col,.2),s,true);
  R(g,tone(dessus||col,.38),x,y+d-1,w,1);
  bois(g,x,y+d,w,h-d,col,s+1);
  R(g,tone(col,.18),x,y+d,1,h-d);R(g,tone(col,-.3),x+w-1,y+d,1,h-d);
  R(g,tone(col,-.34),x,y+h-2,w,2);
}
function panneau(g,x,y,w,h,col){
  R(g,tone(col,-.34),x,y,w,1);R(g,tone(col,-.34),x,y,1,h);R(g,tone(col,.22),x,y+h-1,w,1);R(g,tone(col,.22),x+w-1,y,1,h);
  R(g,tone(col,.06),x+1,y+1,w-2,h-2);
}
function bouton(g,x,y){R(g,'#7a5a20',x,y,2,2);R(g,'#ffe08a',x,y,1,1)}
function tiroirF(g,x,y,w,h,col){panneau(g,x,y,w,h,col);bouton(g,x+(w>>1)-1,y+(h>>1))}
function pied(g,x,y,h,col){R(g,col,x,y,2,h);R(g,tone(col,.25),x,y,1,h)}
function ellipseP(g,cx,cy,rx,ry,col){for(let j=-ry;j<=ry;j++){const w=Math.round(rx*Math.sqrt(1-(j*j)/(ry*ry)));R(g,col,cx-w,cy+j,w*2,1)}}
const BOIS_M=['#6d4628','#5b3820','#8a5a34','#4a2e1c'];
Object.assign(SPR,{
  shelf(g,v){const c=BOIS_M[v%4];caisse(g,0,0,32,46,4,c,v);R(g,'#2a1a14',3,6,26,37);for(let s=0;s<3;s++){books(g,3,6+s*12,26,10,v+s*7);R(g,tone(c,.24),2,16+s*12,28,2)}R(g,tone(c,.3),0,0,32,1)},
  cabinet(g,v){const c=BOIS_M[v%4];R(g,'#ecdfc0',6,8,20,2);R(g,'#7ea8c0',8,1,5,8);R(g,'#ffffff',9,2,1,5);ellipseP(g,22,6,4,2,'#d8d0b8');caisse(g,0,8,32,30,5,c,v);tiroirF(g,3,14,12,5,c);tiroirF(g,17,14,12,5,c);panneau(g,3,20,12,15,c);panneau(g,17,20,12,15,c);bouton(g,13,27);bouton(g,18,27)},
  wardrobe(g,v){const c=BOIS_M[v%4];caisse(g,1,3,30,43,3,c,v);R(g,tone(c,.3),0,1,32,3);R(g,tone(c,-.2),0,4,32,1);panneau(g,3,7,12,36,c);panneau(g,17,7,12,36,c);panneau(g,5,9,8,14,c);panneau(g,19,9,8,14,c);panneau(g,5,25,8,16,c);panneau(g,19,25,8,16,c);bouton(g,13,24);bouton(g,17,24)},
  commode(g,v){const c=BOIS_M[v%4];R(g,'#ece4d0',4,4,24,3);R(g,'#c8a040',22,0,1,5);ellipseP(g,22,0,2,1,'#fff0b8');R(g,'#a33a3a',8,0,4,5);R(g,'#ff8a7a',9,1,1,3);caisse(g,0,6,32,24,5,c,v);for(let i=0;i<3;i++)tiroirF(g,2,12+i*5,28,5,c);R(g,'#3a2416',2,30,3,2);R(g,'#3a2416',27,30,3,2)},
  chevet(g,v){const c=BOIS_M[v%4];R(g,'#c8a040',7,4,2,5);for(let j=0;j<5;j++)R(g,tone('#ffdc8a',-j*.03),5-(j>>1),j,6+j,1);caisse(g,1,8,14,14,4,c,v);tiroirF(g,3,13,10,6,c);R(g,'#3a2416',2,22,2,3);R(g,'#3a2416',12,22,2,3)},
  desk(g,v){const c=BOIS_M[v%4];R(g,'#3a6a48',12,4,20,7);R(g,'#ecdfc0',16,5,9,5);R(g,'#8a8fa8',18,6,5,1);R(g,'#8a8fa8',18,8,4,1);R(g,'#141226',35,5,4,3);R(g,'#ffffff',38,1,1,5);caisse(g,0,2,48,28,10,c,v);R(g,'#1a1210',16,12,16,16);for(let i=0;i<3;i++){tiroirF(g,2,13+i*5,13,5,c);tiroirF(g,33,13+i*5,13,5,c)}},
  pcdesk(g,v){R(g,'#2d3440',14,0,20,13);R(g,'#1a2233',15,1,18,11);for(let j=0;j<8;j++)for(let i=0;i<15;i++)if(noise(i,j,v)>.5)R(g,j%3?'#6ad0ff':'#5dffa0',16+i,2+j);R(g,'#5a636e',22,13,4,3);caisse(g,0,14,48,14,8,'#8a939e',v,'#c8d0d8');R(g,'#e8e8ee',16,16,18,4);for(let i=0;i<8;i++)R(g,'#a8b0ba',17+i*2,17,1,2);R(g,'#ecdfc0',3,16,9,4);R(g,'#5a636e',2,28,3,8);R(g,'#5a636e',43,28,3,8)},
  fridge(g){caisse(g,0,2,16,40,3,'#d8dee2',1,'#ecf0f2');R(g,'#9aa6ac',1,16,14,1);R(g,'#7a868c',2,8,1,6);R(g,'#7a868c',2,19,1,10);R(g,'#d8483e',9,8,3,3);R(g,'#ffd23f',8,22,4,3);R(g,'#ffffff',9,23,2,1)},
  stove(g,v){caisse(g,0,0,32,34,11,'#4a4f58',v,'#2f333a');[[7,4],[24,4],[7,8],[24,8]].forEach(([x,y])=>{ellipseP(g,x,y,4,1,'#141418');ellipseP(g,x,y,2,1,'#5a2a1a')});R(g,'#a8b0ba',18,0,12,6);R(g,'#d8dce4',18,0,12,1);R(g,'#5a3a22',29,2,3,1);panneau(g,3,17,26,14,'#5a606a');R(g,'#ffc86a',6,20,20,7);R(g,'#2a2d34',6,19,20,1);for(let i=0;i<5;i++)R(g,'#c8d0d8',5+i*5,13,2,2)},
  sink(g,v){const c=BOIS_M[v%4];R(g,'#c8d0d4',14,0,2,8);R(g,'#c8d0d4',14,0,7,2);R(g,'#ffffff',14,0,1,6);caisse(g,0,6,32,28,9,c,v,'#d8d4c8');ellipseP(g,16,10,11,3,'#9aa6ac');ellipseP(g,16,11,9,2,'#6e8a9a');panneau(g,3,16,12,15,c);panneau(g,17,16,12,15,c);bouton(g,13,23);bouton(g,18,23)},
  counter(g,v){const c=BOIS_M[v%4];R(g,'#8a5a34',4,1,6,9);R(g,'#2a2a2a',5,0,1,2);R(g,'#2a2a2a',8,0,1,2);R(g,'#c8a468',14,4,12,5);R(g,'#d8483e',19,3,5,3);caisse(g,0,6,32,28,6,c,v,'#d8d4c8');tiroirF(g,3,13,12,4,c);tiroirF(g,17,13,12,4,c);panneau(g,3,18,12,13,c);panneau(g,17,18,12,13,c)},
  table(g,v){const c=BOIS_M[v%4];bois(g,0,6,48,26,tone(c,.18),v,true);R(g,tone(c,.4),0,6,48,1);bois(g,0,32,48,4,c,v);R(g,tone(c,-.34),0,35,48,1);pied(g,2,36,10,tone(c,-.2));pied(g,44,36,10,tone(c,-.2));R(g,'#ecdfc0',16,6,16,26);R(g,'#d8c8a4',16,6,1,26);R(g,'#d8c8a4',31,6,1,26);ellipseP(g,10,18,5,3,'#ece8dc');ellipseP(g,38,18,5,3,'#ece8dc');ellipseP(g,10,18,3,2,'#d8d0b8');ellipseP(g,38,18,3,2,'#d8d0b8');R(g,'#c8a040',23,11,2,8);R(g,'#ffd878',23,8,2,3);ellipseP(g,24,20,4,1,'#c8a040')},
  rtable(g,v){const c=BOIS_M[v%4];R(g,tone(c,-.3),14,28,4,12);ellipseP(g,16,41,8,2,tone(c,-.2));ellipseP(g,16,15,16,11,tone(c,-.3));ellipseP(g,16,13,16,11,tone(c,.2));ellipseP(g,14,11,11,6,tone(c,.3));R(g,'#7ea8c0',13,7,5,7);R(g,'#ffffff',14,8,1,5);R(g,'#d84a6a',12,4,3,3);R(g,'#ffd23f',16,3,3,3);R(g,'#3a7a48',15,6,1,2)},
  basse(g,v){const c=BOIS_M[v%4];caisse(g,1,3,46,13,9,c,v);R(g,'#5b3820',4,16,3,5);R(g,'#5b3820',41,16,3,5);R(g,'#ecdfc0',10,5,10,5);R(g,'#8a8fa8',12,6,6,1);R(g,'#a33a3a',28,5,8,5);R(g,'#ffffff',30,6,4,1)},
  chair(g,v){const c=['#8a3a3a','#3a5a8a','#4a7a4a'][v%3],b='#5b3820';R(g,b,2,0,12,14);R(g,tone(b,.2),2,0,12,1);R(g,c,4,2,8,9);R(g,tone(c,.2),4,2,8,1);R(g,tone(c,.12),2,13,12,5);R(g,tone(c,.32),2,13,12,1);R(g,tone(b,-.3),2,18,12,1);pied(g,2,19,6,'#3a2416');pied(g,12,19,6,'#3a2416')},
  sofa(g,v){const c=['#7a2f3a','#2e5a78','#5a6a3a'][v%3];bois(g,3,0,42,17,c,v,true);R(g,tone(c,.2),3,0,42,1);[14,24,34].forEach(x=>R(g,tone(c,-.2),x,3,1,12));for(let i=0;i<3;i++){R(g,tone(c,-.22),5+i*13,5,2,2)}[0,16].forEach((o,i)=>{bois(g,6+o+(i?8:0),15,i?18:22,10,tone(c,.12),v+i,true)});R(g,tone(c,.32),6,15,36,1);R(g,tone(c,-.3),23,15,1,10);R(g,tone(c,-.3),6,24,36,2);[0,41].forEach(x=>{bois(g,x,9,7,18,tone(c,-.06),v);R(g,tone(c,.26),x,9,7,1);R(g,tone(c,-.3),x,26,7,1)});R(g,'#3a2416',2,27,3,3);R(g,'#3a2416',43,27,3,3)},
  armchair(g,v){const c=['#7a4f2a','#5a2f4a','#2f5a5a'][v%3];bois(g,2,0,12,15,c,v,true);R(g,tone(c,.22),2,0,12,1);bois(g,3,13,10,8,tone(c,.14),v,true);R(g,tone(c,.32),3,13,10,1);[0,12].forEach(x=>{bois(g,x,8,4,14,tone(c,-.06),v);R(g,tone(c,.26),x,8,4,1)});R(g,tone(c,-.3),0,21,16,2);R(g,'#3a2416',1,23,2,3);R(g,'#3a2416',13,23,2,3)},
  bed(g,v){const c=['#3a5a8a','#8a3a4a','#4a7a5a','#6a5a2a'][v%4],b=BOIS_M[v%4];caisse(g,0,0,32,10,3,b,v);R(g,tone(b,.3),0,0,32,1);bois(g,1,9,30,36,'#ece4d0',v,true);[[3],[17]].forEach(([x])=>{R(g,'#ffffff',x,10,12,9);R(g,'#d8d4c8',x,17,12,2);R(g,'#c8c4b8',x+11,11,1,7)});bois(g,1,22,30,23,c,v,true);R(g,'#f4ecd8',1,20,30,4);R(g,'#c8c0a8',1,23,30,1);for(let i=0;i<4;i++)R(g,tone(c,.12),1,27+i*5,30,1);R(g,tone(c,-.3),29,24,2,21);caisse(g,0,44,32,4,1,b,v+1)},
  plant(g,v){for(let i=0;i<9;i++){const a=-Math.PI*(.12+.76*(i/8)),l=8+((i*5+v)%4),c=['#3a7a48','#4d9a50','#6ab85a','#2f6340'][i%4];for(let t=0;t<l;t++){const x=8+Math.cos(a)*t,y=15+Math.sin(a)*t+t*t*.022;R(g,c,Math.round(x),Math.round(y),t<l-2?2:1,1)}}R(g,'#3f2c1f',4,15,8,2);R(g,'#c86a3a',3,16,10,2);R(g,'#e08a54',3,16,10,1);for(let j=0;j<7;j++){const w=8-(j>>1);R(g,tone('#a85a34',-j*.03),8-(w>>1)-1,18+j,w+2,1)}},
  lamp(g){for(let j=0;j<13;j++){const w=3+(j>>1);R(g,tone('#ffdc8a',-j*.012),8-w,2+j,w*2,1);if(j%3===1)R(g,'#e8b860',8-w,2+j,w*2,1)}R(g,'#fff4c8',6,5,4,8);R(g,'#c8a040',7,15,2,23);R(g,'#ffe08a',7,15,1,23);ellipseP(g,8,38,4,1,'#8a6a2a')},
  clock(g){caisse(g,1,0,14,42,2,'#5b3820',3);R(g,'#7a4c2a',0,0,16,2);ellipseP(g,8,9,5,5,'#c8a040');ellipseP(g,8,9,4,4,'#ecdfc0');R(g,'#222',8,6,1,4);R(g,'#222',8,9,3,1);R(g,'#1a1210',4,17,8,20);R(g,'#c8a040',7,17,1,12);ellipseP(g,8,30,2,2,'#ffd878')},
  fireplace(g,v){
    const pierre='#a89c8e',P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h);
    // Piédroits en pierre de taille
    [[0,10],[38,10]].forEach(([x,w])=>{for(let j=0;j<5;j++){const y=13+j*6,c=tone(pierre,(noise(x,j,3)-.5)*.2);P(c,x,y,w,6);P(tone(c,.26),x,y,w,1);P(tone(c,.14),x,y,1,6);P(tone(c,-.34),x,y+5,w,1);P(tone(c,-.2),x+w-1,y,1,6)}});
    // Linteau et clé de voûte
    P(pierre,10,13,28,5);P(tone(pierre,.26),10,13,28,1);P(tone(pierre,-.36),10,17,28,1);P(tone(pierre,.1),19,12,10,7);P(tone(pierre,.34),19,12,10,1);P(tone(pierre,-.3),19,18,10,1);P(tone(pierre,-.3),28,12,1,7);
    // Âtre : briques noircies par la suie
    for(let j=0;j<24;j++)for(let i=0;i<28;i++){const b=(j%5===0)||((i+(j%10<5?0:6))%12===0);P(tone(b?'#1c0e0a':'#4a2418',-.3+j*.012),10+i,18+j)}
    for(let j=0;j<24;j++){P('#0c0606',10,18+j,2,1);P('#0c0606',36,18+j,2,1)}P('#0c0606',10,18,28,3);
    // Sole de pierre et manteau de bois
    P('#c0b4a4',0,42,48,2);P('#e0d4c4',0,42,48,1);caisse(g,0,6,48,7,3,'#7a4c2a',v);R(g,tone('#7a4c2a',.34),0,6,48,1);
    // Pendule et bougeoirs
    P('#c8a040',20,0,8,6);P('#ece4cc',21,1,6,4);P('#141226',23,2,1,2);P('#141226',24,3,2,1);[6,40].forEach(x=>{P('#c8a040',x-1,5,4,1);P('#c8a040',x,3,2,2);P('#ece4d0',x,0,2,3)});
  },
  bar(g,v){const c='#5b3820';for(let i=0;i<8;i++){const k=['#3a5a34','#6b2030','#c29a3a','#7ea8c0'][(i+v)%4];R(g,k,5+i*7,4,4,9);R(g,tone(k,.4),5+i*7,4,1,9);R(g,k,6+i*7,1,2,3)}caisse(g,0,14,64,28,5,c,v,'#a87a4a');R(g,'#e0c060',0,19,64,1);for(let i=0;i<5;i++)panneau(g,3+i*12,22,10,17,c)},
  tub(g){bois(g,0,8,48,24,'#e8e4dc',4);R(g,'#ffffff',1,4,46,6);ellipseP(g,24,10,22,5,'#b8c4c8');ellipseP(g,24,11,20,4,'#6ea8c8');R(g,'#a8d4e8',12,10,10,1);R(g,'#a8d4e8',30,12,7,1);R(g,'#c8a040',22,0,4,6);R(g,'#ffe08a',20,0,8,2);R(g,tone('#e8e4dc',-.2),0,28,48,4);R(g,'#c8a040',3,32,3,2);R(g,'#c8a040',42,32,3,2)},
  toilet(g){caisse(g,3,0,10,12,2,'#ece8e0');R(g,'#c8c0a8',10,5,2,1);ellipseP(g,8,16,6,4,'#f4f0e8');ellipseP(g,8,16,4,2,'#a8c4cc');bois(g,4,18,8,6,'#e0dcd4',2);R(g,'#b8b4ac',4,23,8,1)},
  shower(g,v){caisse(g,0,0,32,44,1,'#7a9aa8',v);for(let j=0;j<7;j++)for(let i=0;i<5;i++)R(g,tone('#a8c4cc',(noise(i,j,4)-.5)*.2),2+i*6,2+j*6,5,5);R(g,'#c8d0d8',19,4,2,10);R(g,'#c8d0d8',13,4,8,2);ellipseP(g,14,7,3,1,'#e8ecf0');for(let i=0;i<8;i++)R(g,'#d8ecf8',11+i,10+(i*5)%14,1,3);R(g,'rgba(220,240,250,.28)',16,1,15,41);R(g,'#c8d0d8',16,1,1,41);R(g,'#5a6a74',1,42,30,2)},
  medic(g){caisse(g,0,2,16,40,2,'#e4e8e8',3,'#f4f6f6');R(g,'#a8b0b4',7,4,1,36);panneau(g,1,5,6,34,'#e4e8e8');panneau(g,8,5,7,34,'#e4e8e8');R(g,'#d8483e',3,14,3,1);R(g,'#d8483e',4,13,1,3);R(g,'#d8483e',10,14,3,1);R(g,'#d8483e',11,13,1,3);bouton(g,5,24);bouton(g,9,24)},
  vanity(g,v){const c=BOIS_M[v%4];R(g,'#d8b35c',6,0,20,16);for(let j=0;j<12;j++)for(let i=0;i<16;i++)R(g,tone('#9cc4d8',(i+j)%11<2?.4:j*.012-.12),8+i,2+j);for(let i=0;i<3;i++){R(g,'#fff0a8',3,2+i*6,2,2);R(g,'#fff0a8',27,2+i*6,2,2)}caisse(g,0,16,32,26,6,c,v);R(g,'#c04a6a',8,17,3,3);R(g,'#d8d0ff',20,16,5,3);tiroirF(g,2,24,13,6,c);tiroirF(g,17,24,13,6,c);R(g,'#1a1210',4,31,24,9)},
  washer(g){caisse(g,0,2,16,26,4,'#e0e4e8',2,'#f0f2f4');R(g,'#5a636e',2,7,8,2);R(g,'#ffd23f',12,7,2,2);ellipseP(g,8,18,6,6,'#8a939e');ellipseP(g,8,18,4,4,'#6ea8c8');R(g,'#ffffff',6,15,2,1)},
  locker(g,v){const c=['#4f7088','#6a7d5a','#8a5a4a'][v%3];caisse(g,0,2,16,40,2,c,v);panneau(g,1,5,14,35,c);for(let i=0;i<4;i++)R(g,tone(c,-.4),4,8+i*2,8,1);R(g,'#ecdfc0',5,18,6,3);R(g,'#c8d0d8',12,23,2,4)},
  trunk(g,v){const c=['#6a4a2a','#3a5a5a','#7a3a2a'][v%3];bois(g,0,2,32,10,tone(c,.14),v,true);R(g,tone(c,.32),2,0,28,3);R(g,tone(c,-.4),0,12,32,1);bois(g,0,13,32,11,c,v,true);R(g,tone(c,-.34),0,22,32,2);[5,24].forEach(x=>{R(g,'#c8a040',x,0,3,24);R(g,'#ffe08a',x,0,1,24)});R(g,'#c8a040',13,9,6,7);R(g,'#141226',15,12,2,2)},
  crate(g,v){bois(g,0,2,16,5,'#c8a468',v,true);bois(g,0,7,16,17,'#a07a48',v,true);R(g,'#7a5a34',1,7,14,1);for(let i=0;i<4;i++)R(g,'#7a5a34',1,11+i*4,14,1);R(g,'#c8a468',0,7,2,17);R(g,'#c8a468',14,7,2,17);R(g,'#3a2a1a',1,8,1,1);R(g,'#3a2a1a',14,22,1,1)}
});
Object.assign(SPR,{
  portemanteau(g){
    const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h),b='#6a4424';
    ellipseP(g,8,38,6,2,tone(b,-.2));P(b,7,4,3,34);P(tone(b,.3),7,4,1,34);P(tone(b,-.3),9,4,1,34);P(b,3,6,11,2);P(tone(b,.3),3,6,11,1);
    // Pardessus, écharpe et chapeau suspendus
    for(let j=0;j<24;j++){const w=5+(j>>3);P(tone('#3a4a3a',-j*.006),2,8+j,w,1);P('#2a3a2a',2+w-1,8+j,1,1)}P('#526652',3,9,1,20);P('#c8a040',5,14,1,1);P('#c8a040',5,20,1,1);
    for(let j=0;j<20;j++){P('#a8906a',10,8+j,5,1);P('#8a7450',14,8+j,1,1)}P('#c8b48a',11,9,1,16);
    for(let j=0;j<12;j++)P(j%3?'#a33a3a':'#ecdfc0',8,8+j,2,1);
    ellipseP(g,8,3,6,1,'#2a2a34');P('#2a2a34',5,0,7,3);P('#7a2030',5,2,7,1)},
  parapluies(g){
    const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h);
    [[4,'#22222c'],[8,'#8a2f38'],[11,'#2e5a8c']].forEach(([x,c],i)=>{P(c,x,2+i,2,12);P(tone(c,.3),x,2+i,1,12);P('#8a5a34',x,0+i,2,2);P('#8a5a34',x-1,0+i,1,1)});
    for(let j=0;j<13;j++)P(tone('#6a7078',-j*.01),2,11+j,12,1);for(let i=0;i<12;i++)P(tone('#6a7078',.3-i*.05),2+i,11,1,13);ellipseP(g,8,11,6,1,'#141226');P('#a8b0ba',2,14,12,1);P('#a8b0ba',2,21,12,1)},
  chaussures(g,v){
    const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h);
    caisse(g,0,6,32,20,3,'#7a5230',v);P('#3a2416',2,9,28,6);P('#3a2416',2,17,28,6);
    [[3,14,'#5a3420'],[9,14,'#5a3420'],[17,14,'#1c1c24'],[23,14,'#1c1c24'],[3,22,'#7a2a2a'],[9,22,'#7a2a2a'],[17,22,'#a8906a'],[23,22,'#a8906a']].forEach(([x,y,c])=>{P(c,x,y-2,5,3);P(c,x+3,y-1,3,2);P(tone(c,.4),x+1,y-2,2,1);P('#0e0a08',x,y,6,1)});
    P('#c8a040',13,3,6,2)},
  videpoche(g,v){
    const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h);
    // Miroir accroché au mur, au-dessus de la console
    ellipseP(g,16,10,9,10,'#c8a040');ellipseP(g,16,10,7,8,'#a8c8d8');P('#dcecf4',11,5,2,8);P('#dcecf4',14,4,1,4);
    caisse(g,1,20,30,6,2,'#6a4424',v);P('#4a2e1c',4,26,2,12);P('#4a2e1c',26,26,2,12);P(tone('#6a4424',.2),4,26,1,12);P(tone('#6a4424',.2),26,26,1,12);
    ellipseP(g,9,19,4,1,'#2e6a7c');P('#c8ccd4',8,17,3,1);P('#c8a040',10,16,2,2);P('#ece4cc',19,17,7,2);P('#a33a3a',19,18,7,1)},
  banc(g,v){
    const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h);
    P('#4a2e1c',2,9,3,9);P('#4a2e1c',27,9,3,9);bois(g,0,6,32,4,'#7a5230',v,true);P('#8a2f38',1,2,30,5);P('#b04a50',1,2,30,1);P('#5e1e28',1,6,30,1);for(let i=4;i<30;i+=6)P('#5e1e28',i,3,1,3)}
});
Object.assign(SH,{portemanteau:40,parapluies:25,chaussures:27,videpoche:39,banc:18});
Object.assign(SH,{shelf:46,cabinet:38,wardrobe:46,commode:32,chevet:25,desk:30,pcdesk:36,fridge:42,stove:34,sink:34,counter:34,table:46,rtable:44,basse:21,chair:25,sofa:30,armchair:26,bed:48,plant:25,lamp:40,clock:42,fireplace:44,bar:42,tub:34,toilet:24,shower:44,medic:42,vanity:42,washer:28,locker:42,trunk:24,crate:24});

// ——— 10 tableaux différents ———
// ——— Fenêtres : un paysage propre à chaque lieu, de nuit puisque tout se passe à minuit ———
function paysage(g,x,y,w,h,lv,s){
  const P=(c,a,b,W=1,H=1)=>R(g,c,x+a,y+b,W,H);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++)P(tone('#141c44',j*.012+(bay(i,j)<j/h*.5?.04:0)),i,j);
  for(let i=0;i<8;i++)P('#e8ecff',(i*7+s*3)%w,(i*5+s)%(h>>1));
  if(s%3===0){ellipseP(g,x+6+(s%5)*2,y+4,3,3,'#f0e8c8');ellipseP(g,x+8+(s%5)*2,y+3,2,2,'#141c44')}
  const bas=(f,c)=>{for(let i=0;i<w;i++){const t=f(i);P(c,i,t,1,h-t)}};
  [()=>{bas(i=>h-4-Math.abs(((i+s*3)%12)-6),'#c8d6ee');bas(i=>h-2,'#e8f0fa');for(let i=0;i<9;i++)P('#ffffff',(i*5+s)%w,(i*3)%h)},
   ()=>{bas(i=>h-3-(i%7===0?3:0),'#16304a');for(let i=0;i<w;i+=7)P('#1f4a3a',i,h-7,4,5);for(let i=0;i<14;i++)P('#8ab0d8',(i*5+s)%w,(i*3)%h,1,2)},
   ()=>{bas(i=>h-3-(Math.sin((i+s)*.5)+1)*2,'#0c1428');P('#3a4a68',(s*5)%w,h-8,1,8);P('#3a4a68',0,h-7,w,1)},
   ()=>{for(let i=0;i<w;i+=4){const t=h-4-(i*7+s)%(h-5);P('#0a0e22',i,t,4,h-t);for(let j=t+1;j<h;j+=2)if(noise(i,j,s)>.4)P('#ffc860',i+1,j,1,1)}},
   ()=>{for(let i=0;i<w;i++)P(i%3?'#3ad8a0':'#8a5ad8',i,3+Math.round(Math.sin(i*.5+s)*2),1,3);bas(i=>h-3,'#d8e4f4')},
   ()=>{bas(i=>h-5,'#1a1a2a');for(let i=2;i<w;i+=8){P('#3a3a4a',i,h-11,1,8);P('#ffd878',i-1,h-12,3,2)}for(let i=0;i<w;i+=5)P('#ffc860',i,h-3,2,1)},
   ()=>{P('#0c2448',0,h-6,w,6);for(let i=0;i<7;i++)P('#6a8ab8',(i*7+s)%w,h-5+(i%3),3,1);P('#f0e8c8',(s%9)+6,h-5,3,5)},
   ()=>{bas(i=>h-3,'#1a2a22');for(let i=0;i<w;i+=6){P('#16362a',i,h-9,5,6);P('#2a1a12',i+2,h-4,1,2)}},
   ()=>{bas(i=>h-5-(Math.sin(i*.3+s)+1)*1.5,'#101c2a');P('#1a3050',0,h-3,w,3);for(let i=0;i<5;i++)P('#8ab0d8',(i*6+s)%w,h-2,3,1)},
   ()=>{P('#0c2448',0,h-7,w,3);P('#c8b488',0,h-4,w,4);for(let i=1;i<w;i+=6)P('#ffd878',i,h-5,2,1)}
  ][lv%10]();
}
function fenetre(g,x,y,lv,seed){
  box(g,x+1,y+3,30,20,'#8a6a44');paysage(g,x+3,y+5,26,16,lv,seed);
  R(g,'#8a6a44',x+15,y+5,2,16);R(g,'#8a6a44',x+3,y+11,26,1);R(g,'#c8a468',x,y+22,32,2);R(g,'#e8c888',x,y+22,32,1);
  [x-2,x+27].forEach((c,i)=>{for(let j=0;j<22;j++){R(g,tone('#7a2f35',((j+i)%4===0?.14:0)),c,y+2+j,6,1)}R(g,'#b34a50',c+1,y+2,1,22);R(g,'#b34a50',c+4,y+2,1,22)});
  R(g,'#c8a040',x-3,y+1,38,2);
}

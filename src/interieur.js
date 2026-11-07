// Fouille des caisses : on sort ce qu'elles contiennent, jusqu'à tomber sur ce qui n'a rien à faire là.
const SCENE_W=320,SCENE_H=200,CAISSE={x:58,y:14,w:204,h:172};
// Remplissage net, sans anticrénelage
function polyP(g,pts,col){
  let y0=1e9,y1=-1e9;pts.forEach(p=>{y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])});
  for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){
    const xs=[];
    for(let i=0;i<pts.length;i++){const[a,b]=pts[i],[c,d]=pts[(i+1)%pts.length];if((b<=y&&d>y)||(d<=y&&b>y))xs.push(a+(y-b)/(d-b)*(c-a))}
    xs.sort((p,q)=>p-q);
    for(let i=0;i+1<xs.length;i+=2){const a=Math.round(xs[i]),c=Math.round(xs[i+1]);if(c>=a)R(g,col,a,y,c-a+1,1)}
  }
}
function traitP(g,col,x0,y0,x1,y1,e=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)R(g,col,Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),e,e)}
// Motif posé uniquement sur ce qui est déjà dessiné
function surTissu(g,fn){g.globalCompositeOperation='source-atop';fn();g.globalCompositeOperation='source-over'}
// Volume : bord éclairé en haut à gauche, ombre en bas à droite
function modele(k){
  const g=k.getContext('2d'),w=k.width,h=k.height,d=g.getImageData(0,0,w,h),a=d.data,pl=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&a[(y*w+x)*4+3]>40,o=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(!pl(x,y))continue;
    const f=(!pl(x-1,y)||!pl(x,y-1))?1.2:(!pl(x+1,y)||!pl(x,y+1))?.72:(!pl(x+2,y)||!pl(x,y+2))?.87:1;
    if(f!==1)o.push([(y*w+x)*4,f]);
  }
  o.forEach(([i,f])=>{for(let c=0;c<3;c++)a[i+c]=Math.min(255,a[i+c]*f)});
  g.putImageData(d,0,0);return k;
}
const TISSUS=['#8a2f38','#2e5a8c','#3d6a4c','#b8863a','#5a3a78','#34486e','#a85a34','#62626c','#d4ccb8','#7a2a52'];
const BROL={
 chemise:{nom:'Une chemise froissée.',w:64,h:56,f(g,c,s){
  polyP(g,[[23,4],[41,4],[52,8],[63,31],[54,36],[47,23],[47,54],[17,54],[17,23],[10,36],[1,31],[12,8]],c);
  if(s%2)surTissu(g,()=>{for(let x=0;x<64;x+=5)R(g,tone(c,.22),x,0,1,56)});
  polyP(g,[[63,31],[54,36],[52,32],[61,27]],tone(c,.2));polyP(g,[[1,31],[10,36],[12,32],[3,27]],tone(c,.2));
  polyP(g,[[25,3],[39,3],[32,11]],tone(c,-.48));polyP(g,[[23,3],[32,12],[27,17],[19,7]],'#efe9dc');polyP(g,[[41,3],[32,12],[37,17],[45,7]],'#efe9dc');
  R(g,tone(c,.12),30,13,5,41);R(g,tone(c,-.25),30,13,1,41);for(let y=17;y<52;y+=8)R(g,'#f4efe2',32,y,2,2);
  R(g,tone(c,-.25),38,23,8,1);R(g,tone(c,-.25),38,23,1,9);R(g,tone(c,-.25),45,23,1,9);R(g,tone(c,-.25),38,31,8,1);
  traitP(g,tone(c,-.2),20,26,25,50);traitP(g,tone(c,-.16),44,36,40,52);traitP(g,tone(c,-.2),13,14,18,24);traitP(g,tone(c,-.2),51,14,46,24)}},
 pull:{nom:'Un gros pull en laine.',w:66,h:54,f(g,c,s){
  polyP(g,[[22,5],[44,5],[54,9],[65,36],[56,40],[49,26],[49,52],[17,52],[17,26],[10,40],[1,36],[12,9]],c);
  surTissu(g,()=>{for(let y=0;y<54;y++)for(let x=0;x<66;x++)if((x+y*2)%4===0)R(g,tone(c,.08),x,y);
   const d=TISSUS[(s+3)%TISSUS.length];for(let x=0;x<66;x++){const b=Math.abs((x%10)-5);R(g,'#ece4d0',x,17,1,1);R(g,d,x,19+(b>>1),1,3);R(g,'#ece4d0',x,26,1,1)}
   for(let x=16;x<50;x+=2)R(g,tone(c,-.3),x,46,1,7)});
  ellipseP(g,33,7,8,4,tone(c,-.5));for(let i=-9;i<=9;i+=2){R(g,tone(c,.2),33+i,7+Math.round(Math.sqrt(Math.max(0,81-i*i))*.5),1,3)}
  polyP(g,[[65,36],[56,40],[54,36],[63,32]],tone(c,-.2));polyP(g,[[1,36],[10,40],[12,36],[3,32]],tone(c,-.2))}},
 pantalon:{nom:'Un pantalon de costume.',w:42,h:66,f(g,c){
  polyP(g,[[7,2],[35,2],[40,64],[24,64],[21,26],[18,64],[2,64]],c);
  R(g,tone(c,-.24),7,2,29,5);R(g,tone(c,.2),7,2,29,1);[11,20,30].forEach(x=>R(g,tone(c,-.42),x,2,2,6));R(g,'#c8a040',20,3,3,3);
  traitP(g,tone(c,-.32),21,7,21,26);traitP(g,tone(c,-.25),9,8,14,14);traitP(g,tone(c,-.25),33,8,28,14);
  traitP(g,tone(c,.14),11,16,9,62);traitP(g,tone(c,.14),31,16,33,62);R(g,tone(c,-.26),2,60,16,1);R(g,tone(c,-.26),24,60,16,1)}},
 veste:{nom:'Une veste bien coupée.',w:60,h:68,f(g,c,s){
  polyP(g,[[21,3],[39,3],[51,8],[59,52],[50,54],[45,28],[45,64],[15,64],[15,28],[10,54],[1,52],[9,8]],c);
  polyP(g,[[24,3],[36,3],[30,27]],'#ece8dc');polyP(g,[[29,7],[31,7],[33,23],[30,27],[27,23]],TISSUS[(s+5)%TISSUS.length]);R(g,'#141226',28,6,4,2);
  polyP(g,[[22,3],[30,28],[23,33],[16,14]],tone(c,.18));polyP(g,[[38,3],[30,28],[37,33],[44,14]],tone(c,.18));
  traitP(g,tone(c,-.4),30,28,30,64);R(g,'#141226',31,36,2,2);R(g,'#141226',31,45,2,2);
  R(g,tone(c,-.32),18,50,10,2);R(g,tone(c,-.32),33,50,10,2);R(g,tone(c,-.32),36,22,8,1);R(g,'#ece8dc',38,20,5,2);
  traitP(g,tone(c,-.25),13,14,14,48);traitP(g,tone(c,-.25),47,14,46,48)}},
 robe:{nom:'Une robe de soirée.',w:52,h:70,f(g,c,s){
  polyP(g,[[18,2],[21,2],[22,10],[30,10],[31,2],[34,2],[35,14],[33,26],[50,68],[2,68],[19,26],[17,14]],c);
  if(s%2)surTissu(g,()=>{for(let y=30;y<68;y+=7)for(let x=(y%2)*3;x<52;x+=7)R(g,'#f4e8d8',x,y,2,2)});
  R(g,tone(c,-.34),19,25,14,3);R(g,'#d8b35c',24,25,4,3);
  [[22,28,12,67],[26,28,25,67],[30,28,40,67]].forEach(q=>traitP(g,tone(c,-.2),...q));traitP(g,tone(c,.24),20,29,6,66)}},
 echarpe:{nom:'Une longue écharpe.',w:74,h:22,f(g,c,s){
  const d=TISSUS[(s+2)%TISSUS.length];
  for(let x=5;x<69;x++){const y=5+Math.round(Math.sin(x/9)*2);R(g,((x-5)>>3)%2?c:d,x,y,1,12);R(g,'#ece4d0',x,y+5,1,1)}
  for(let j=0;j<6;j++){R(g,c,1,8+j*2,4,1);R(g,d,69,5+j*2,4,1)}}},
 chaussure:{nom:'Une chaussure de ville, seule.',w:56,h:28,f(g){
  const c='#5a3420';polyP(g,[[3,5],[15,3],[22,9],[38,15],[50,17],[54,22],[54,24],[3,24]],c);
  R(g,'#1c120e',3,24,52,3);R(g,'#2c1c14',3,20,13,7);traitP(g,tone(c,.46),40,17,50,20);traitP(g,tone(c,.3),5,8,14,6);
  traitP(g,tone(c,-.36),24,11,17,23);for(let i=0;i<4;i++){traitP(g,'#e4dcc8',21+i*4,10+i*2,25+i*4,13+i*2)}traitP(g,tone(c,-.3),38,15,36,23);R(g,tone(c,.3),15,4,1,1)}},
 botte:{nom:'Une vieille botte.',w:38,h:54,f(g){
  const c='#3e2c1e';polyP(g,[[6,2],[23,2],[24,32],[36,40],[37,48],[6,48]],c);R(g,'#141010',5,48,33,4);R(g,'#241a14',5,42,12,10);
  R(g,tone(c,-.3),6,2,18,5);R(g,tone(c,.3),6,2,18,1);traitP(g,tone(c,.26),9,8,9,44);traitP(g,tone(c,-.3),24,33,24,47);R(g,'#c8a040',14,4,3,2)}},
 chapeau:{nom:'Un chapeau de feutre.',w:58,h:32,f(g,c){
  ellipseP(g,29,25,28,6,tone(c,-.1));polyP(g,[[13,26],[15,8],[22,3],[29,7],[35,3],[43,8],[45,26]],c);
  surTissu(g,()=>R(g,'#1a1626',13,19,32,5));traitP(g,tone(c,.3),17,9,16,18);traitP(g,tone(c,-.26),29,7,29,12);R(g,'#d8b35c',19,20,3,3)}},
 bouteille:{nom:'Une bouteille de vin, à peine entamée.',w:20,h:64,f(g,c,s){
  const v=['#1f4a30','#3a1c22','#22303e'][s%3];polyP(g,[[7,0],[12,0],[12,16],[18,25],[18,63],[1,63],[1,25],[7,16]],v);
  R(g,'#8a1f28',7,0,6,12);R(g,'#c04a50',8,1,1,10);R(g,'#ece4cc',2,36,16,18);R(g,'#8a1f28',2,38,16,2);R(g,'#c8a040',6,43,8,4);for(let i=0;i<2;i++)R(g,'#6a5a48',5,49+i*2,10,1);
  traitP(g,'#9ac8b0',4,26,4,34);R(g,'#9ac8b0',4,55,1,6);R(g,'#0c1410',1,61,17,2)}},
 whisky:{nom:'Une flasque de whisky.',w:28,h:56,f(g){
  polyP(g,[[10,0],[17,0],[17,10],[25,16],[25,55],[2,55],[2,16],[10,10]],'#d8e4e8');R(g,'#2a1c14',10,0,8,6);
  for(let y=20;y<53;y++)R(g,tone('#c0701c',-y*.004),4,y,20,1);R(g,'#ece4cc',5,28,18,15);R(g,'#141226',8,31,12,2);R(g,'#7a2030',8,35,12,1);R(g,'#7a2030',8,38,8,1);R(g,'#ffffff',5,18,2,32)}},
 bocal:{nom:'Un bocal de cornichons.',w:34,h:44,f(g,c,s){
  box(g,2,8,30,35,'#cfe0e0');for(let i=0;i<16;i++){const x=6+(i*7+s)%21,y=14+(i*5)%25;ellipseP(g,x,y,3,5,tone('#5a7a30',(i%3-1)*.14))}
  R(g,'#e4f0f0',5,10,2,30);R(g,'#ece4cc',9,24,16,11);R(g,'#a33a3a',11,27,12,1);R(g,'#6a5a48',11,30,9,1);
  polyP(g,[[1,8],[4,1],[30,1],[33,8]],'#a33a3a');surTissu(g,()=>{for(let y=0;y<9;y+=3)for(let x=(y%2)*3;x<34;x+=6)R(g,'#f0e8dc',x,y,3,3)});R(g,'#d8c8a8',2,8,30,2)}},
 conserve:{nom:'Une boîte de conserve sans date.',w:32,h:38,f(g,c){
  for(let i=0;i<30;i++)R(g,tone('#c8ccd4',.26-i/30*.55),1+i,4,1,31);ellipseP(g,16,4,15,3,'#e4e8ec');ellipseP(g,16,4,12,2,'#a8b0ba');
  for(let i=0;i<30;i++)R(g,tone(c,.24-i/30*.46),1+i,9,1,21);R(g,'#ece4cc',6,13,20,13);ellipseP(g,16,20,6,4,'#c04a30');R(g,'#3d7a4c',15,14,3,3);R(g,'#141226',8,27,16,1);ellipseP(g,16,35,15,2,'#8a939e')}},
 livre:{nom:'Un livre aux pages jaunies.',w:46,h:58,f(g,c){
  R(g,'#e8dcc0',6,54,38,3);for(let x=8;x<44;x+=2)R(g,'#c8b890',x,54,1,3);R(g,'#e8dcc0',43,3,3,52);box(g,1,1,42,54,c);R(g,tone(c,-.34),1,1,7,54);R(g,tone(c,.2),8,1,1,54);
  R(g,'#d8b35c',12,6,27,1);R(g,'#d8b35c',12,48,27,1);R(g,'#d8b35c',12,6,1,43);R(g,'#d8b35c',38,6,1,43);R(g,'#ecd890',16,14,19,3);R(g,'#ecd890',19,20,13,2);ellipseP(g,25,35,6,6,'#d8b35c');ellipseP(g,25,35,4,4,c)}},
 journaux:{nom:'Une liasse de vieux journaux.',w:66,h:46,f(g){
  polyP(g,[[3,4],[62,1],[64,41],[5,44]],'#d8d2c0');polyP(g,[[5,1],[60,4],[62,3],[3,0]],'#b8b2a0');
  R(g,'#141226',8,7,50,5);for(let x=10;x<54;x+=4)R(g,'#d8d2c0',x,8,2,3);R(g,'#141226',8,13,50,1);
  for(let i=0;i<10;i++)R(g,'#6a6a72',8,16+i*3,20,1);for(let j=0;j<14;j++)for(let i=0;i<24;i++)if(bay(i,j)<.5)R(g,'#3a3a44',33+i,16+j);for(let i=0;i<3;i++)R(g,'#6a6a72',33,32+i*3,25,1);
  traitP(g,'#b89868',34,1,36,43,2);traitP(g,'#b89868',3,22,63,20,2)}},
 boite:{nom:"Une boîte en carton pleine de ficelle.",w:56,h:46,f(g){
  const c='#b88a54';box(g,1,4,54,41,c);polyP(g,[[1,4],[27,1],[29,22],[1,22]],tone(c,.1));polyP(g,[[55,4],[29,1],[29,22],[55,22]],tone(c,.04));traitP(g,tone(c,-.34),28,2,28,44);R(g,'#d8c8a0',24,14,9,31);R(g,'#ece4cc',8,28,13,10);R(g,'#6a5a48',10,31,9,1);R(g,'#6a5a48',10,34,6,1)}},
 tasse:{nom:'Une tasse ébréchée.',w:42,h:30,f(g){
  ellipseP(g,20,26,19,3,'#dfe4e8');R(g,'#ffffff',8,4,24,20);for(let y=0;y<20;y++)R(g,tone('#f0f0ec',y*.006),8+(y>>3),4+y,24-(y>>2),1);ellipseP(g,20,4,12,3,'#ffffff');ellipseP(g,20,4,10,2,'#5a3820');
  R(g,'#2e5a8c',8,9,24,2);R(g,'#2e5a8c',9,16,23,1);R(g,'#f0f0ec',32,8,6,2);R(g,'#f0f0ec',32,18,6,2);R(g,'#f0f0ec',37,9,2,10)}},
 assiette:{nom:'Une assiette de porcelaine.',w:46,h:46,f(g){
  ellipseP(g,23,23,22,22,'#f4f4ee');ellipseP(g,23,23,19,19,'#2e5a8c');ellipseP(g,23,23,17,17,'#f4f4ee');ellipseP(g,23,23,13,13,'#e8e8e0');
  for(let a=0;a<6.28;a+=.52){R(g,'#2e5a8c',(23+Math.cos(a)*15)|0,(23+Math.sin(a)*15)|0,2,2)}ellipseP(g,23,23,3,3,'#c8a040')}},
 peluche:{nom:'Un vieil ours en peluche.',w:44,h:52,f(g){
  const c='#a8784a';ellipseP(g,9,6,5,5,c);ellipseP(g,35,6,5,5,c);ellipseP(g,9,6,3,3,'#d8b890');ellipseP(g,35,6,3,3,'#d8b890');
  ellipseP(g,22,34,14,14,c);ellipseP(g,22,36,8,9,'#d8b890');ellipseP(g,6,30,5,8,tone(c,-.1));ellipseP(g,38,30,5,8,tone(c,-.1));ellipseP(g,10,46,8,5,tone(c,-.08));ellipseP(g,34,46,8,5,tone(c,-.08));ellipseP(g,10,46,4,3,'#d8b890');ellipseP(g,34,46,4,3,'#d8b890');
  ellipseP(g,22,15,13,12,c);ellipseP(g,22,20,6,5,'#d8b890');R(g,'#141226',20,17,5,3);R(g,'#141226',22,20,1,3);R(g,'#141226',20,23,5,1);R(g,'#141226',15,12,3,3);R(g,'#141226',26,12,3,3);R(g,'#ffffff',15,12,1,1);R(g,'#ffffff',26,12,1,1);R(g,'#a33a3a',14,27,16,3);R(g,'#c04a50',20,26,5,5)}},
 parapluie:{nom:'Un parapluie noir.',w:18,h:74,f(g){
  polyP(g,[[9,0],[15,48],[3,48]],'#22222c');traitP(g,'#3e3e4c',7,10,6,47);traitP(g,'#3e3e4c',11,10,12,47);traitP(g,'#0e0e14',9,4,9,47);R(g,'#8a1f28',4,30,11,3);R(g,'#c8ccd4',8,0,2,3);
  R(g,'#8a5a34',8,48,3,16);for(let i=0;i<6;i++)R(g,'#8a5a34',8-i,64+Math.round(Math.sin(i/2)*4),3,3)}},
 corde:{nom:'Une corde de chanvre.',w:50,h:44,f(g){
  const c='#b89868';[[25,26,23,16],[25,22,20,14],[25,18,17,11]].forEach(([x,y,a,b])=>{ellipseP(g,x,y,a,b,c);ellipseP(g,x,y,a-4,b-3,tone(c,-.32))});
  ellipseP(g,25,18,12,7,'#3a2a1c');for(let i=0;i<6.28;i+=.18){R(g,tone(c,-.26),(25+Math.cos(i)*19)|0,(24+Math.sin(i)*13)|0,1,2);R(g,tone(c,.26),(25+Math.cos(i+.09)*15)|0,(19+Math.sin(i+.09)*9)|0,1,1)}traitP(g,c,42,32,48,41,3)}},
 marteau:{nom:'Un marteau rouillé.',w:64,h:26,f(g){
  polyP(g,[[2,14],[44,10],[45,16],[3,20]],'#8a5a34');traitP(g,'#b88a54',4,15,44,11);polyP(g,[[42,3],[58,3],[62,0],[63,8],[58,7],[58,21],[42,21]],'#6a7078');R(g,'#a8b0ba',44,4,12,2);R(g,'#8a5a30',48,12,7,6);R(g,'#343a42',42,19,16,2)}},
 gants:{nom:'Une paire de gants de cuir.',w:48,h:40,f(g){
  const c='#5a2f22',p=(ox,fl)=>{const X=x=>fl?ox+22-x:ox+x;polyP(g,[[X(2),38],[X(4),18],[X(1),6],[X(4),5],[X(7),15],[X(8),2],[X(11),2],[X(12),14],[X(14),2],[X(17),3],[X(16),16],[X(20),8],[X(22),10],[X(18),24],[X(18),38]],c);R(g,tone(c,-.3),Math.min(X(3),X(17)),32,14,2);traitP(g,tone(c,.3),X(6),20,X(14),20)};p(1,false);p(25,true)}},
 serviettes:{nom:'Des serviettes bien pliées.',w:60,h:38,f(g,c){
  [[2,24,'#ece4d0'],[4,13,c],[2,2,'#c8d8d8']].forEach(([x,y,d])=>{box(g,x,y,54,12,d);R(g,tone(d,.18),x+1,y+1,52,2);R(g,tone(d,-.22),x+1,y+9,52,2);R(g,tone(d,-.4),x+50,y+1,3,10)})}},
 chandelier:{nom:'Un bougeoir en laiton terni.',w:28,h:58,f(g){
  const o='#c8a040';ellipseP(g,14,53,12,4,o);R(g,tone(o,.3),6,51,16,1);R(g,o,12,30,5,22);ellipseP(g,14,38,5,3,o);ellipseP(g,14,28,8,3,o);R(g,'#ece4d0',10,8,9,20);R(g,'#ffffff',11,9,2,18);R(g,'#ece4d0',18,22,2,6);R(g,'#2a1a14',14,4,1,4)}},
 vase:{nom:'Un vase sans fleurs.',w:34,h:50,f(g){
  const c='#2e6a7c';polyP(g,[[12,0],[22,0],[21,8],[32,22],[30,38],[23,48],[11,48],[4,38],[2,22],[13,8]],c);surTissu(g,()=>{R(g,'#ece4cc',0,20,34,3);R(g,'#ece4cc',0,33,34,2);for(let x=2;x<34;x+=6)R(g,'#d8b35c',x,25,3,6)});R(g,tone(c,.4),8,14,2,20);ellipseP(g,17,1,5,1,'#141226')}},
 sac:{nom:'Un sac à main en cuir.',w:50,h:46,f(g){
  const c='#7a2a2a';for(let i=0;i<30;i++){const a=Math.PI*i/29;R(g,tone(c,-.2),(25+Math.cos(a)*15)|0,(18-Math.sin(a)*15)|0,3,2)}polyP(g,[[6,18],[44,18],[48,44],[2,44]],c);polyP(g,[[6,18],[44,18],[42,30],[8,30]],tone(c,.16));R(g,'#d8b35c',22,27,6,6);R(g,'#8a6a2a',24,29,2,2);traitP(g,tone(c,-.3),8,30,42,30)}}
};
function fabrique(type,s,ang){
  const b=BROL[type],c=TISSUS[(s*7+3)%TISSUS.length],[k0,g0]=cv(b.w+2,b.h+2);
  g0.translate(1,1);b.f(g0,c,s);g0.setTransform(1,0,0,1,0,0);modele(k0);
  const r=ang*Math.PI/180,W0=Math.ceil(Math.abs(b.w*Math.cos(r))+Math.abs(b.h*Math.sin(r)))+6,H0=Math.ceil(Math.abs(b.w*Math.sin(r))+Math.abs(b.h*Math.cos(r)))+6,[k,g]=cv(W0,H0);
  g.imageSmoothingEnabled=false;g.translate(W0/2,H0/2);g.rotate(r);g.drawImage(k0,-k0.width/2|0,-k0.height/2|0);g.setTransform(1,0,0,1,0,0);
  // Le pivot laisse des pixels à moitié opaques : on les tranche pour garder un contour net
  const d=g.getImageData(0,0,W0,H0);for(let i=3;i<d.data.length;i+=4)d.data[i]=d.data[i]>110?255:0;g.putImageData(d,0,0);
  outlineSprite(k,'#17121e');
  const a=g.getImageData(0,0,W0,H0).data,m=new Uint8Array(W0*H0);for(let i=0;i<m.length;i++)m[i]=a[i*4+3]>40?1:0;
  return{sp:k,w:W0,h:H0,m,nom:b.nom};
}
const touche=(q,x,y)=>{const X=Math.floor(x-q.x),Y=Math.floor(y-q.y);return X>=0&&Y>=0&&X<q.w&&Y<q.h&&!!q.m[Y*q.w+X]};
const CONTENUS={trunk:['veste','robe','pantalon','chemise','pull','echarpe','chaussure','chaussure','chapeau','gants','livre','journaux','sac','peluche','parapluie','serviettes','botte','livre'],
 crate:['bouteille','bouteille','whisky','bocal','conserve','conserve','pull','chemise','pantalon','journaux','corde','marteau','boite','tasse','assiette','chaussure','chapeau','vase','chandelier','botte']};
// Remplit la caisse et cache l'objet sous le tas, entièrement recouvert
function remplitCaisse(fam,s,spr){
  const r=RNG(s*31+7),o=[],types=shuffle(r,CONTENUS[fam]),{x:cx,y:cy,w:cw,h:ch}=CAISSE;
  types.forEach((t,i)=>{
    const debout=['bouteille','whisky','parapluie'].includes(t),a=debout?pick(r,[62,78,96,112,-70]):pick(r,[-28,-16,-8,0,0,8,16,28]),q=fabrique(t,s+i,a);
    q.x=cx+6+int(r,Math.max(1,cw-q.w-12));q.y=cy+6+int(r,Math.max(1,ch-q.h-12));o.push(q);
  });
  const t={sp:spr,w:56,h:56,x:cx+34+int(r,cw-124),y:cy+26+int(r,ch-108)};
  const vus=()=>{const l=[];for(let j=2;j<t.h;j+=4)for(let i=2;i<t.w;i+=4){const x=t.x+i,y=t.y+j;if(!o.some(q=>touche(q,x,y)))l.push([x,y])}return l};
  for(let e=0;e<30;e++){const l=vus();if(!l.length)break;const[x,y]=l[int(r,l.length)],q=o[e%7];q.x=Math.round(x-q.w/2);q.y=Math.round(y-q.h/2)}
  return{o,t,pris:false,vus};
}
function fondCaisse(g,fam,s){
  const W0=SCENE_W,H0=SCENE_H,{x,y,w,h}=CAISSE;
  // Le plancher autour
  for(let j=0;j<H0;j++)for(let i=0;i<W0;i++){const pl=j>>4,sep=j%16===0;R(g,sep?'#20140e':tone('#54392a',(noise(i>>3,pl,4)-.5)*.2+(pl%3-1)*.04),i,j)}
  const bo=fam==='trunk'?'#5a3a22':'#a07a4a';
  R(g,'rgba(0,0,0,.45)',x-5,y-3,w+18,h+15);
  // Les bords de la caisse
  bois(g,x-8,y-8,w+16,h+16,bo,s);R(g,tone(bo,.3),x-8,y-8,w+16,1);R(g,tone(bo,.3),x-8,y-8,1,h+16);
  if(fam==='trunk')[[x-8,y-8],[x+w,y-8],[x-8,y+h],[x+w,y+h]].forEach(([a,b])=>{box(g,a,b,8,8,'#c8a040');R(g,'#fff0a8',a+2,b+2,2,2)});
  else for(let i=0;i<3;i++){const a=(x+i*w/3)|0;R(g,tone(bo,-.4),a,y-8,1,8);R(g,tone(bo,-.4),a,y+h,1,8);R(g,'#5a636e',a+6,y-5,2,2);R(g,'#5a636e',a+6,y+h+3,2,2)}
  // L'intérieur, plus sombre vers le fond
  const f=fam==='trunk'?'#6a2430':'#7a5a38';
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const e=Math.min(i,j,w-1-i,h-1-j),v=(noise(i>>4,j>>1,5)-.5)*.14;
   if(fam==='trunk'){const q=(i%18===0||j%18===0)?-.14:(i%18===9&&j%18===9)?.2:0;R(g,tone(f,v*.4+q-Math.max(0,14-e)*.03),x+i,y+j)}
   else R(g,tone(f,v-Math.max(0,14-e)*.035-(i%34===0?.2:0)),x+i,y+j)}
  // Un peu de paille au fond
  if(fam==='crate'){const r=RNG(s);for(let i=0;i<190;i++){const a=x+12+int(r,w-26),b=y+12+int(r,h-24),d=int(r,8),l=4+int(r,9);traitP(g,['#d8b870','#c8a050','#e8cc88'][i%3],a,b,a+(d-4),b+(i%2?l:-l))}}
}
function dessineScene(k,fond,Sc,tk){
  const g=k.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(fond,0,0);
  const t=Sc.t;if(!Sc.pris)g.drawImage(t.sp,t.x,t.y,t.w,t.h);
  Sc.o.forEach(q=>g.drawImage(q.sp,Math.round(q.x),Math.round(q.y)));
  if(Sc.brille&&!Sc.pris&&(tk>>4)%2){const a=t.x+t.w-6,b=t.y+6;R(g,'#fff4c8',a-1,b-5,2,12);R(g,'#fff4c8',a-5,b-1,12,2);R(g,'#ffffff',a-1,b-1,2,2)}
}

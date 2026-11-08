// Mobilier redessiné en détail : comptoir de cuisine, paillasse de laboratoire, moteur de navire,
// et un prototype de cabine de toilettes. Même lumière que le reste : en haut à gauche.
const disque=(g,cx,cy,r,col)=>{for(let j=-r;j<=r;j++){const w=Math.round(Math.sqrt(r*r-j*j));R(g,col,cx-w,cy+j,w*2+1,1)}};
const cercle=(g,cx,cy,r,col)=>{for(let a=0;a<64;a++){const t=a/64*Math.PI*2;R(g,col,Math.round(cx+Math.cos(t)*r),Math.round(cy+Math.sin(t)*r),1,1)}};
const vis=(g,x,y)=>{R(g,'#5a6068',x,y,2,2);R(g,'#c8d0d8',x,y,1,1)};
const chromeV=(g,x,y,h)=>{R(g,'#8a939e',x,y,2,h);R(g,'#e8eef4',x,y,1,h-1)};
const chromeH=(g,x,y,w)=>{R(g,'#8a939e',x,y,w,2);R(g,'#e8eef4',x,y,w-1,1)};
// Plans de travail : stratifié, bois massif, marbre, granit
const PLANS=['#d8d4c8','#b8875a','#e8e4dc','#55585e'];
function planTravail(g,x,y,w,d,k,s){
  const col=PLANS[k];
  for(let j=0;j<d;j++)for(let i=0;i<w;i++){
    let t=(noise(x+i,y+j,s)-.5)*.06;
    if(k===1)t+=((x+i)%6===0?-.12:0)+(noise((x+i)>>1,(y+j)>>2,s+2)-.5)*.1;
    if(k===2&&Math.abs(Math.sin((i+j*2.3+s)*.45))<.08)t-=.18;
    if(k===3&&noise(x+i,y+j,s+5)>.86)t+=.32;
    R(g,tone(col,t),x+i,y+j);
  }
  R(g,tone(col,.4),x,y+d-1,w,1);R(g,tone(col,-.3),x,y+d,w,1);
}
// Ce qu'on pose sur un comptoir
function posesCuisine(g,x,y,v){
  const k=v%6;
  if(k===0){R(g,'#a87a48',x+2,y+3,14,6);R(g,'#c89a68',x+2,y+3,14,1);R(g,'#7a5030',x+2,y+8,14,1);ellipseP(g,x+8,y+4,4,2,'#d8a050');R(g,'#f0c880',x+6,y+3,3,1);R(g,'#c8ccd4',x+12,y+1,1,6);R(g,'#2a2a2a',x+12,y+6,1,2)}
  if(k===1){R(g,'#6a4428',x+1,y-1,6,10);R(g,'#8a5a34',x+1,y-1,6,1);[1,3,5].forEach(i=>R(g,'#2a2a2a',x+1+i,y-3,1,3));R(g,'#c8c0b0',x+9,y+1,5,8);R(g,'#e0d8c8',x+9,y+1,5,1);R(g,'#8a6a40',x+10,y-3,1,4);R(g,'#c8ccd4',x+12,y-4,1,5)}
  if(k===2){ellipseP(g,x+8,y+6,7,3,'#c8a060');ellipseP(g,x+8,y+5,6,2,'#a87a40');disque(g,x+5,y+3,2,'#d83a2a');disque(g,x+9,y+2,2,'#f0c020');disque(g,x+12,y+4,2,'#6ab040');R(g,'#ffffff',x+4,y+2,1,1)}
  if(k===3){disque(g,x+5,y+4,4,'#c8ccd4');R(g,'#e8eef4',x+3,y+2,2,2);R(g,'#2a2a2a',x+4,y-1,3,1);R(g,'#8a939e',x+9,y+2,2,2);R(g,'#f4f0e8',x+12,y+3,4,5);R(g,'#c83a3a',x+12,y+5,4,1);R(g,'#f4f0e8',x+16,y+4,1,2)}
  if(k===4){[[0,'#e8c070'],[5,'#5a3820'],[10,'#f4f0e8']].forEach(([d,c])=>{R(g,'#d8e8ec',x+1+d,y,4,9);R(g,c,x+1+d,y+3,4,6);R(g,'#ffffff',x+1+d,y+1,1,7);R(g,'#8a6a40',x+1+d,y-1,4,1);R(g,'#f4ecd8',x+1+d,y+5,4,2)})}
  if(k===5){R(g,'#2a4a6a',x+2,y+2,12,7);R(g,'#f4ecd8',x+3,y+2,5,6);R(g,'#f4ecd8',x+8,y+2,5,6);R(g,'#8a8478',x+4,y+4,3,1);R(g,'#8a8478',x+9,y+4,3,1);R(g,'#8a8478',x+4,y+6,2,1);R(g,'#c83a3a',x+8,y+2,1,7)}
}
Object.assign(SPR,{
  counter(g,v){
    const c=BOIS_M[v%4],k=(v>>2)%4;
    caisse(g,0,15,32,19,1,c,v);planTravail(g,0,8,32,7,k,v);
    tiroirF(g,2,17,13,4,c);tiroirF(g,17,17,13,4,c);
    panneau(g,2,22,13,9,c);panneau(g,17,22,13,9,c);chromeV(g,12,24,4);chromeV(g,19,24,4);
    R(g,'#1a120c',1,32,30,2);
    posesCuisine(g,v%2?2:14,1,v>>3);
  },
  labbench(g,v){
    // étagère à réactifs contre le mur
    chromeV(g,1,0,17);chromeV(g,45,0,17);R(g,'#d8ecf0',1,7,46,1);R(g,'#7a8a90',1,8,46,1);
    const fl=['#7a3a14','#8ab8d8','#f4f0e8','#3a6a3a','#7a3a14','#c8c0e8','#f4f0e8','#7a3a14'];
    for(let i=0;i<8;i++){const x=4+i*5,h=4+(noise(i,v,3)*3|0),c=fl[(i+v)%8];R(g,c,x,7-h,4,h);R(g,tone(c,.4),x,8-h,1,h-2);R(g,'#2a2a2a',x+1,6-h,2,1);if(c==='#f4f0e8'||i%3==0)R(g,'#e8d890',x,5-((h)>>1),4,2)}
    // plan noir et ce qu'on y pose
    caisse(g,0,22,48,20,1,'#d4dade',v);planTravail(g,0,15,48,7,3,v+1);
    const liq=['#5dffa0','#ff8ac0','#6ad0ff','#ffd23f','#c08aff'];
    // microscope
    R(g,'#2a2e34',4,19,7,2);R(g,'#e8ecf0',6,11,2,8);R(g,'#2a2e34',5,9,4,3);R(g,'#c8ccd4',8,12,3,1);R(g,'#2a2e34',7,14,4,1);R(g,'#8a939e',5,10,1,1);
    // erlenmeyer
    const lq=liq[v%5];for(let j=0;j<7;j++){const w=1+(j>>1);R(g,'#d8ecf0',16-w,12+j,w*2+1,1);if(j>2)R(g,lq,17-w,12+j,w*2-1,1)}R(g,'#d8ecf0',15,10,3,2);R(g,'#ffffff',15,15,1,2);
    // portoir à tubes
    R(g,'#c8a468',22,16,12,2);R(g,'#8a6a40',22,18,12,2);for(let i=0;i<4;i++){R(g,'#e8f4f8',23+i*3,10,2,7);R(g,liq[(v+i+1)%5],23+i*3,13,2,4)}
    // bec bunsen
    R(g,'#5a6068',36,18,4,2);R(g,'#8a939e',37,13,2,5);R(g,'#4a8aff',37,10,2,3);R(g,'#c8e0ff',37,11,1,1);
    // petit évier et col de cygne
    R(g,'#8a939e',41,17,6,4);R(g,'#5a6068',42,18,4,2);R(g,'#c8d0d8',43,9,1,8);R(g,'#c8d0d8',43,9,3,1);R(g,'#c8d0d8',45,9,1,3);
    // façade : tiroirs, portes, poignées chromées
    for(let i=0;i<3;i++){const x=2+i*15;panneau(g,x,24,14,4,'#c8ced2');chromeH(g,x+5,25,4);panneau(g,x,29,14,10,'#c8ced2');chromeV(g,x+(i===1?2:11),31,5)}
    R(g,'#ffd23f',19,31,4,4);R(g,'#2a2a2a',20,32,2,1);R(g,'#2a2a2a',21,33,1,1);
    R(g,'#2a2e34',1,40,46,2);
  },
  engine(g,v){
    const coque='#3e5a52',W0=48;
    // socle : chant à rayures de danger et boulons
    R(g,'#2a3036',0,51,W0,9);for(let x=0;x<W0;x+=6){R(g,'#e8c020',x,53,3,3);R(g,'#1a1a1a',x+3,53,3,3)}for(let x=2;x<W0;x+=8)vis(g,x,57);
    R(g,'#4a5258',0,48,W0,3);R(g,'#6a747c',0,48,W0,1);
    // bloc moteur : face avant, portes de carter boulonnées
    for(let y=36;y<48;y++)for(let x=1;x<W0-1;x++)R(g,tone(coque,(x%4===0?-.08:0)+(noise(x,y,v)-.5)*.06-(y>45?.12:0)),x,y);
    R(g,tone(coque,.25),1,36,W0-2,1);
    for(let i=0;i<4;i++){const x=3+i*11;R(g,tone(coque,-.3),x,39,9,7);R(g,tone(coque,.12),x+1,40,7,5);vis(g,x+1,40);vis(g,x+6,40);vis(g,x+1,44);vis(g,x+6,44)}
    // dessus : culasses, cache-culbuteurs rouges, tubulures
    for(let y=8;y<36;y++)for(let x=1;x<W0-1;x++)R(g,tone(coque,.08+(noise(x>>1,y>>1,v+1)-.5)*.08),x,y);
    for(let i=0;i<4;i++){const x=3+i*11;
      R(g,'#2a3036',x,13,9,18);R(g,'#b83a2a',x+1,12,7,16);R(g,'#e85a3a',x+1,12,7,2);R(g,'#7a2418',x+1,27,7,1);
      for(let j=0;j<3;j++)vis(g,x+3,15+j*4);
      R(g,'#c8ccd4',x+4,29,1,6);R(g,'#e8eef4',x+4,29,1,1);
    }
    R(g,'#8a939e',1,32,W0-2,3);R(g,'#c8d0d8',1,32,W0-2,1);
    // collecteur d'échappement brûlant, le long du fond
    for(let x=1;x<W0-6;x++){const hot=noise(x>>2,1,v)>.5;R(g,hot?'#a8582a':'#7a4a2a',x,7,1,5);R(g,'#c8783a',x,7,1,1)}
    // turbo en colimaçon et cheminée
    disque(g,42,9,5,'#8a939e');disque(g,42,9,3,'#5a6068');R(g,'#c8d0d8',39,6,3,1);R(g,'#2a3036',43,0,4,6);R(g,'#4a5258',43,0,1,6);
    // volant d'inertie à gauche
    disque(g,4,30,6,'#2a3036');cercle(g,4,30,6,'#6a747c');R(g,'#8a939e',3,25,2,11);R(g,'#8a939e',-1,29,11,2);disque(g,4,30,1,'#c8d0d8');
    // manomètres et vanne rouge en façade
    disque(g,40,42,3,'#e8e4d8');cercle(g,40,42,3,'#2a2a2a');R(g,'#c83a2a',40,40,1,3);
    disque(g,34,42,2,'#e8e4d8');cercle(g,34,42,2,'#2a2a2a');R(g,'#c83a2a',34,41,2,1);
    cercle(g,45,30,3,'#d83a2a');R(g,'#d83a2a',43,30,5,1);R(g,'#d83a2a',45,28,1,5);
    // conduite de carburant jaune
    R(g,'#d8a020',W0-4,12,2,24);R(g,'#f0c840',W0-4,12,1,24);
    // traces d'huile
    if(v%3)R(g,'#1a1a14',10+(v%20),56,5,2);
  },
  // Prototype : une cabine de toilettes, porte fermée (libre ou occupée) ou entrouverte
  cabine(g,v){
    const lam=['#9fd0c4','#e8dcc0','#a8c4e0','#c89a6a'][(v>>2)%4],ouvert=v%3===0,libre=v%3===2;
    // l'ombre du dedans de la cabine
    g.fillStyle='rgba(20,16,30,.18)';g.fillRect(3,6,26,46);
    // la cuvette et le réservoir, contre le mur du fond
    R(g,'#d8d4cc',10,9,12,13);R(g,'#f4f0e8',10,9,12,2);R(g,'#c8c4bc',11,12,10,1);R(g,'#b8c4c8',15,10,3,1);
    ellipseP(g,16,28,6,5,'#f4f0e8');ellipseP(g,16,28,4,3,'#a8c4cc');R(g,'#e0dcd4',12,32,8,4);R(g,'#ffffff',12,26,2,1);
    // dérouleur de papier contre la cloison droite
    R(g,'#8a939e',25,22,3,2);R(g,'#ffffff',25,24,3,3);
    // cloisons : dessus (bande) puis chant avant
    const cloison=x=>{for(let y=0;y<31;y++)R(g,tone(lam,.25),x,y,3,1);R(g,tone(lam,.5),x,0,3,1);for(let y=31;y<52;y++)R(g,tone(lam,y===31?.15:-.05),x,y,3,1);R(g,tone(lam,-.3),x+2,31,1,21);chromeV(g,x,52,3)};
    cloison(0);cloison(29);
    // barre de tête chromée qui relie les cloisons
    R(g,'#5a6068',0,30,32,3);R(g,'#c8d0d8',0,30,32,1);R(g,'#8a939e',0,31,32,1);
    if(ouvert){
      // porte rabattue contre la cloison de gauche : on voit son chant
      for(let y=4;y<34;y++)R(g,tone(lam,.1),3,y,2,1);for(let y=34;y<51;y++)R(g,tone(lam,-.12),3,y,2,1);R(g,'#c8ccd4',4,40,1,2);
    }else{
      // porte fermée : elle ne touche ni le sol ni le haut
      for(let y=33;y<51;y++)for(let x=3;x<29;x++)R(g,tone(lam,(noise(x,y>>2,v)-.5)*.05+(x<5?.12:x>26?-.15:0)),x,y);
      R(g,tone(lam,.35),3,33,26,1);R(g,tone(lam,-.35),3,50,26,1);
      // pictogramme et verrou libre / occupé
      R(g,'#f4f0e8',13,35,6,6);R(g,'#2a3a5a',15,36,2,2);R(g,'#2a3a5a',14,38,4,2);
      disque(g,24,42,2,libre?'#4ac85a':'#d83a2a');R(g,'#ffffff',23,41,1,1);chromeH(g,22,45,4);
    }
  }
});
Object.assign(SH,{counter:34,labbench:42,engine:60,cabine:56});

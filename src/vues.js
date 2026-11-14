// Niveau test : trois points de vue de caméra sur la même enquête.
// 1. Classique : la vue habituelle, de trois quarts.
// 2. Inclinée : la caméra se penche, le fond s'éloigne et rétrécit, le premier plan grossit (perspective).
// 3. Plan : vue de dessus, façon dossier d'enquête : pièces nommées, meubles en silhouette, suspects en pions.
const VUES=['Classique','Inclinée','Plan'];
function lanceVues(){
  neuf(1,4242,false,null);S.vuesTest=true;G.vue=0;S.introDone=true;
  $('vues').hidden=false;majVues();
  dit(JOUEUR_V,"Niveau test : touche 1, 2 ou 3 (ou les boutons en haut) pour changer de point de vue.",360);
}
const JOUEUR_V={get fx(){return S.p.x},get fy(){return S.p.y}};
function majVues(){const e=$('vues');if(!e)return;e.innerHTML=`<span>Point de vue</span>${VUES.map((n,i)=>`<button class="etiq ${G.vue===i?'actif':''}" data-a="vue" data-v="${i}" aria-pressed="${G.vue===i}">${i+1}. ${n}</button>`).join('')}`}
function choisitVue(i){G.vue=i;G.vueK=null;majVues();toast('Vue '+VUES[i].toLowerCase(),true)}
// ——— 2. Vue inclinée : chaque rangée de l'image est redessinée plus ou moins large selon sa profondeur ———
function vueInclinee(){
  const k=$('jeu');if(!G.vueK||G.vueK.width!==VW||G.vueK.height!==VH){const[q]=cv(VW,VH);G.vueK=q}
  if(!G.vueMap||G.vueMap.length!==VH){
    // largeur relative de chaque rangée : serrée en haut (loin), élargie en bas (près)
    const s0=y=>.6+.6*(y/VH),cum=[0];for(let y=1;y<VH;y++)cum.push(cum[y-1]+1/s0(y));
    const mil=Math.round(VH*.6),dec=cum[mil]-VH/2;G.vueMap=cum.map(v=>v-dec);G.vueS=cum.map((_,y)=>s0(y));
  }
  const g=G.vueK.getContext('2d');g.clearRect(0,0,VW,VH);g.drawImage(k,0,0);
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#04030a';ctx.fillRect(0,0,VW,VH);ctx.imageSmoothingEnabled=false;
  for(let y=0;y<VH;y++){const sy=Math.round(G.vueMap[y]);if(sy<0||sy>=VH)continue;const w=VW*G.vueS[y];ctx.drawImage(G.vueK,0,sy,VW,1,Math.round((VW-w)/2),y,Math.round(w),1)}
  const q=ctx.createLinearGradient(0,0,0,VH*.4);q.addColorStop(0,'rgba(8,8,24,.6)');q.addColorStop(1,'rgba(8,8,24,0)');ctx.fillStyle=q;ctx.fillRect(0,0,VW,VH*.4);
}
// Un clic sur l'écran retrouve la case visée, quelle que soit la vue
function sourisVue(sx,sy){
  if(G.vue===2&&G.vuePlanT){const{ox,oy,z}=G.vuePlanT;return{x:(sx-ox)/z*16,y:(sy-oy)/z*16+4,plan:true}}
  if(G.vue===1&&G.vueMap){const y=Math.max(0,Math.min(VH-1,Math.round(sy)));return{x:VW/2+(sx-VW/2)/G.vueS[y]+Math.round(cam.x),y:G.vueMap[y]+Math.round(cam.y)}}
  return null;
}
// ——— 3. Vue en plan : un schéma clair de tout l'étage ———
function vuePlan(){
  const P=S.p,z=Math.max(4,Math.min(10,Math.floor(Math.min(VW/(MW+2),VH/(MH+2))))),ox=Math.round((VW-MW*z)/2),oy=Math.round((VH-MH*z)/2);G.vuePlanT={ox,oy,z};
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#e8dcc0';ctx.fillRect(0,0,VW,VH);
  ctx.strokeStyle='rgba(60,80,140,.12)';ctx.lineWidth=1;for(let x=ox%z;x<VW;x+=z){ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,VH);ctx.stroke()}for(let y=oy%z;y<VH;y+=z){ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(VW,y+.5);ctx.stroke()}
  const X=x=>ox+x*z,Y=y=>oy+y*z,ici=areaIdx(P.x>>4,(P.y-3)>>4);
  // pièces : couleur douce par pièce, celle où je suis en jaune, murs épais
  W.areas.forEach((A,i)=>{if(A.etage&&!W.etage)return;const col=i===ici?'#f6e08a':A.room?'#f4ecd4':'#ece2c8';
    A.rects.forEach(q=>{ctx.fillStyle=col;ctx.fillRect(X(q.x0),Y(q.y0),(q.x1-q.x0+1)*z,(q.y1-q.y0+1)*z)});
    A.rects.forEach(q=>{ctx.strokeStyle='#2a2418';ctx.lineWidth=2;ctx.strokeRect(X(q.x0)-1,Y(q.y0)-1,(q.x1-q.x0+1)*z+2,(q.y1-q.y0+1)*z+2)})});
  // meubles : silhouettes, les cachettes encore fermées marquées d'un point
  W.furn.forEach(f=>{const mur=/^(mur|porte|porteL)$/.test(f.name);ctx.fillStyle=mur?'#2a2418':'rgba(110,88,60,.55)';ctx.fillRect(X(f.x)+1,Y(f.y)+1,f.w*z-2,f.h*z-2)});
  W.obj.forEach(o=>{if(o.kind==='fouille'&&(o.loot||o.lock||o.ptype)&&!S.open[o.id]){ctx.fillStyle='#c8382a';ctx.fillRect(X(o.x+o.w/2)-2,Y(o.y+o.h/2)-2,4,4)}});
  // portes : un trait clair, rouge si elle est fermée à clé
  Object.values(W.doors).forEach(d=>{ctx.fillStyle=d.lock!==null&&!S.open[d.id]?'#c8382a':'#e8dcc0';ctx.fillRect(X(d.x),Y(d.y)+(d.v?0:z),d.w*z,d.v?d.h*z:2*z)});
  // noms des pièces
  ctx.font=`bold ${Math.max(7,z)}px "Pixelify Sans",monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
  const ecrit=(t,x,y,col)=>{ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle='#f4ecd4';ctx.strokeText(t,x,y);ctx.fillStyle=col;ctx.fillText(t,x,y)};
  ctx.textAlign='left';W.areas.forEach(A=>{const q=A.rects[0];ecrit(A.name,X(q.x0)+3,Y(q.y1+1)-z*.6,'rgba(42,36,24,.8)')});ctx.textAlign='center';
  // la victime, les suspects (pions avec leur prénom) et moi
  if(G.body){ctx.strokeStyle='#c8382a';ctx.lineWidth=2;ctx.strokeRect(X(G.body.x),Y(G.body.y),2*z,z)}
  ctx.font=`${Math.max(7,z-1)}px "Pixelify Sans",monospace`;
  W.obj.forEach(o=>{if(o.kind!=='suspect')return;const x=ox+o.fx/16*z,y=oy+(o.fy-4)/16*z,L=G.look[o.s];
    ctx.fillStyle=L?L.top:'#3a6ac8';ctx.beginPath();ctx.arc(x,y,z*.45,0,7);ctx.fill();ctx.strokeStyle='#141226';ctx.lineWidth=1.5;ctx.stroke();
    ecrit(c.suspects[o.s].prenom,x,y-z*.9,'#141226')});
  const px=ox+P.x/16*z,py=oy+(P.y-4)/16*z;ctx.fillStyle='#2a3a8a';ctx.beginPath();ctx.moveTo(px,py-z*.6);ctx.lineTo(px+z*.5,py+z*.4);ctx.lineTo(px-z*.5,py+z*.4);ctx.closePath();ctx.fill();
  ecrit('Moi',px,py+z*1.1,'#2a3a8a');
  // légende
  ctx.textAlign='left';ctx.font='9px "Pixelify Sans",monospace';const lg=[['#c8382a','cachette fermée'],['#c8382a','porte à clé (trait rouge)'],['#2a3a8a','moi']];
  lg.forEach(([c0,t],i)=>{ctx.fillStyle=c0;ctx.fillRect(8,VH-14-i*12,6,6);ctx.fillStyle='#2a2418';ctx.fillText(t,18,VH-11-i*12)});
}

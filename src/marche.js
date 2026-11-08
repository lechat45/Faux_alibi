// Réglages de vitesse selon la difficulté, petites bulles d'ambiance, et marche d'un personnage le long d'un chemin.
const NIV_JEU={facile:{vue:62,ang:.85,vit:.85,npc:1,att:1},moyen:{vue:82,ang:1.05,vit:1.05,npc:1.35,att:.75},difficile:{vue:108,ang:1.35,vit:1.38,npc:1.8,att:.5},expert:{vue:108,ang:1.35,vit:1.38,npc:1.8,att:.5}};
const reglage=()=>NIV_JEU[O.diff&&O.diff!=='auto'?O.diff:((c&&c.key)||'moyen')];
function dit(o,txt,d){const a=$('amb');a.textContent=txt;a.hidden=false;G.ambO=o;G.ambT=d||Math.max(170,txt.length*5)}
const dirDe=(dx,dy)=>Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);
function avance(o,sp){
  if(!o.path||o.pi>=o.path.length){o.path=null;o.mv=false;return true}
  const[x,y]=o.path[o.pi],dx=x-o.fx,dy=y-o.fy,d=Math.hypot(dx,dy);
  if(d<=sp){o.fx=x;o.fy=y;o.pi++}else{o.fx+=dx/d*sp;o.fy+=dy/d*sp;o.dir=dirDe(dx,dy)}
  o.mv=true;o.x=o.fx>>4;o.y=(o.fy-3)>>4;return false;
}

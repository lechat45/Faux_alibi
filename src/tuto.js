// Tutoriel en jouant : la première enquête s'apprend en faisant, une action à la fois.
const heureTuto=()=>c.win[0];
const temoinsTuto=()=>c.suspects.filter((su,s)=>S.asked[s+'-'+heureTuto()]).length;
// Le suspect le plus simple à aborder : bavard d'abord, puis le plus proche
function suspectTuto(sauf){
  const P=S.p,l=W.obj.filter(o=>o.kind==='suspect'&&!S.asked[o.s+'-'+heureTuto()]&&o.s!==sauf);
  if(!l.length)return null;
  return l.reduce((a,b)=>{const q=o=>c.suspects[o.s].niveau*400+Math.hypot(o.fx-P.x,o.fy-P.y);return q(b)<q(a)?b:a});
}
function procheTuto(l){const P=S.p,d=o=>Math.hypot((o.x+.5)*TS-P.x,(o.y+.5)*TS-P.y);return l.length?l.reduce((a,b)=>d(b)<d(a)?b:a):null}
const meubleTuto=()=>{const f=W.obj.filter(o=>o.kind==='fouille'&&!S.open[o.id]);return procheTuto(f.filter(o=>o.loot&&!o.lock&&!o.ptype))||procheTuto(f)};
const vitrineTuto=()=>procheTuto(W.obj.filter(o=>o.kind==='vitrine'));
const lieuTuto=o=>{const a=areaIdx(o.kind==='suspect'?o.fx>>4:o.x,o.kind==='suspect'?(o.fy-3)>>4:o.y);return a>=0&&a!==G.area&&W.areas[a].room?` (${c.set.rooms[a].d})`:''};
const TUTO=[
 {t:()=>"Clique sur le sol pour marcher",ok:()=>Math.hypot(S.p.x-S.tu.x0,S.p.y-S.tu.y0)>44},
 {t:()=>"Clique sur la trace à la craie pour lire l'autopsie",cible:()=>G.body,ok:()=>W.docs[W.iAuto].lu},
 {t:o=>o?`Va parler à ${c.suspects[o.s].prenom}${lieuTuto(o)} : clique sur ${c.suspects[o.s].g==='f'?'elle':'lui'}`:'Clique sur un suspect pour lui parler',cible:()=>suspectTuto(),ok:()=>S.tu.parle},
 {t:()=>`Choisis « Et à ${HOURS[heureTuto()]} ? » pour connaître son alibi`,ok:()=>temoinsTuto()>=1},
 {t:()=>"Ouvre ton calepin, en bas à droite : tout s'y note",ui:'calepin',ok:()=>modal==='carnet'},
 {t:o=>`Fouille ce meuble${o?lieuTuto(o):''} : clique dessus`,cible:meubleTuto,ok:()=>W.obj.some(o=>o.kind==='fouille'&&S.open[o.id])},
 {t:o=>`Examine le présentoir${o?lieuTuto(o):''} : ce qui manque est peut-être l'arme`,cible:vitrineTuto,ok:()=>Object.keys(S.seenRooms).length>0},
 {t:o=>`Interroge aussi ${o?c.suspects[o.s].prenom:'quelqu\'un d\'autre'}${o?lieuTuto(o):''} sur ${HOURS[heureTuto()]}`,cible:()=>suspectTuto(),ok:()=>temoinsTuto()>=2},
 {t:()=>"Calepin, page Déductions : compare ces deux versions",ui:'calepin',ok:()=>(S.liens||[]).length>0},
 {t:()=>"Quand tu sais qui ment, frappe avec le marteau. Une seule accusation !",ui:'marteau',duree:480}
];
function tutoLance(){
  if(stats.tuto||c.test||G.robot||G.noCut||S.fin)return;
  S.tu={i:0,x0:S.p.x,y0:S.p.y,t:0};$('tuto-p').hidden=false;tutoMaj();
}
function tutoMaj(){
  const u=S&&S.tu;$('tuto-p').hidden=!u;
  ['calepin','marteau'].forEach(n=>$(n).classList.toggle('appel',!!u&&TUTO[u.i].ui===n));
  if(!u){$('but').hidden=true;G.planCible=null;return}
  const q=TUTO[u.i],o=q.cible?q.cible():null,e=$('but');
  G.tutoO=o;
  G.planCible=o?(o.kind==='suspect'?[o.fx/TS,o.fy/TS]:[o.x+.5,o.y+.5]):null;
  e.hidden=false;e.textContent=`${u.i+1}/${TUTO.length} : ${q.t(o)}`;
}
function tutoTick(){
  const u=S.tu;
  if(S.fin)return tutoFin();
  if(modal==='cut')return;
  const q=TUTO[u.i];
  if(tick%20===0)tutoMaj();
  if(q.duree){if(++u.t>=q.duree)tutoFin(true);return}
  if(q.ok()){u.i++;u.t=0;son('bon');tutoMaj()}
}
function tutoFin(muet){
  if(!S)return;
  S.tu=null;stats.tuto=1;tutoMaj();save();
  if(!muet&&enJeu&&!S.fin)toast('Tutoriel terminé',true);
}
function tutoDessus(){
  const o=G.tutoO;if(!o)return;
  const x=Math.round(o.kind==='suspect'?o.fx:o===G.body?(o.x+1)*TS:(o.x+o.w/2)*TS),y=Math.round((o.kind==='suspect'?o.fy-36:o===G.body?o.y*TS-6:objRect(o)[1]-5)+Math.sin(tick*.12)*2);
  ctx.fillStyle='#17121e';ctx.fillRect(x-5,y-9,10,5);ctx.fillRect(x-7,y-5,14,2);ctx.fillRect(x-5,y-3,10,2);ctx.fillRect(x-3,y-1,6,2);ctx.fillRect(x-1,y+1,2,2);
  ctx.fillStyle='#ffd23f';ctx.fillRect(x-3,y-8,6,4);ctx.fillRect(x-5,y-4,10,1);ctx.fillRect(x-4,y-3,8,1);ctx.fillRect(x-3,y-2,6,1);ctx.fillRect(x-2,y-1,4,1);ctx.fillRect(x-1,y,2,1);
}

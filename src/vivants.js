// La vie des personnages dans le jeu. Chacun a son caractère (tiré de sa voix, de son métier, de son âge,
// de sa démarche), ses goûts et son allure : le nerveux fait les cent pas et regarde l'heure, le triste reste
// à la fenêtre, le jovial va parler aux autres, le cuisinier tourne autour de la cuisine, le pianiste joue.
// Le moteur (ia.js) choisit ensuite, pour chacun, ce qui lui ferait le plus de bien.
const CARACTERES={nerveux:{sociable:.45,nerveux:.9,curieux:.5,paresseux:.25},hautain:{sociable:.25,nerveux:.3,curieux:.35,paresseux:.6},
  jovial:{sociable:.95,nerveux:.2,curieux:.6,paresseux:.4},sec:{sociable:.2,nerveux:.45,curieux:.3,paresseux:.35},
  triste:{sociable:.3,nerveux:.5,curieux:.2,paresseux:.7},moqueur:{sociable:.7,nerveux:.3,curieux:.85,paresseux:.35}};
const GOUTS_VOIX={nerveux:{centpas:1.8,heure:2.2},hautain:{tableau:2.2,asseoir:1.3},jovial:{discuter:1.6,boire:1.4},sec:{lire:1.5,attendre:1.3},triste:{fenetre:2.4,asseoir:1.2},moqueur:{discuter:1.3,ailleurs:1.9}};
const GOUTS_ROLE=[[/cuisin|serveu|barman|sommel|majordome|gouvernant|femme de chambre|steward/i,{boire:1.8},'tourne autour de la cuisine'],
  [/biblioth|écriv|professeu|journal|notaire|libraire|secrétaire|comptable|avocat|archiv/i,{lire:2},'a toujours un livre en main'],
  [/pian|music|chant|artiste|comédien|acteur|actrice|danseu|peintre/i,{piano:3,tableau:1.5},'aime la musique et les tableaux'],
  [/médecin|infirm|docteur|chirurg|pharmac/i,{heure:1.6},'surveille l\'heure'],
  [/jardin|capitaine|marin|pilote|guide|alpin|météo/i,{fenetre:1.8},'regarde souvent dehors'],
  [/gardien|veilleur|contrôleur|détective|vigile|concierge|chef de|directeu|directrice/i,{ailleurs:2.2,attendre:.6},'fait sa ronde de pièce en pièce']];
function caractereDe(i){
  const s=c.suspects[i],v=VOICES[s.voice].nom,b=CARACTERES[v]||{},n=k=>(noise(c.seed%997+i*13,k,5)-.5)*.3,cl=x=>Math.max(.05,Math.min(.98,x)),canne=/canne|boite/i.test(s.trait||'');
  const traits={sociable:cl((b.sociable??.5)+n(1)),nerveux:cl((b.nerveux??.5)+n(2)+(c.tueurs.includes(i)?.12:0)),curieux:cl((b.curieux??.5)+n(3)),
    paresseux:cl((b.paresseux??.5)+n(4)+(canne?.25:0)+((s.age||40)>62?.15:0)),peureux:peureux(i)?.8:.15};
  const gouts={...(GOUTS_VOIX[v]||{})},habitudes=[];
  GOUTS_ROLE.forEach(([re,g,mot])=>{if(re.test(s.role)){Object.entries(g).forEach(([k,x])=>gouts[k]=(gouts[k]||1)*x);habitudes.push(mot)}});
  return{traits,gouts,habitudes,vit:canne?.7:1};
}
// Le caractère en quelques mots, pour la fiche du suspect
function caractereMots(i){
  const{traits:t,habitudes}=caractereDe(i),m=[];
  if(t.nerveux>.7)m.push('nerveux');else if(t.nerveux<.3)m.push('calme');
  if(t.sociable>.7)m.push('bavard');else if(t.sociable<.3)m.push('solitaire');
  if(t.curieux>.7)m.push('curieux');
  if(t.paresseux>.65)m.push('casanier');else if(t.paresseux<.3)m.push('toujours en mouvement');
  if(t.peureux>.5)m.push('a peur du noir');
  return{mots:m.length?m:['discret'],habitudes};
}
const ACTION_MOTS={asseoir:'est assis',rechauffer:'se réchauffe',fenetre:'regarde dehors',lire:'feuillette un livre',boire:'se sert à boire',heure:"regarde l'heure",tableau:'contemple un tableau',
  piano:'joue du piano',discuter:'discute',centpas:'fait les cent pas',ailleurs:'change de pièce',attendre:'attend',lumiere:'cherche la lumière',eviter:"s'écarte",observer:'observe'};
function vieInit(){
  const sus=W.obj.filter(o=>o.kind==='suspect');
  G.ia=creerIA(W,{rng:RNG((c.seed*31+7)>>>0),ouvertes:S.open,sieges:Object.keys(SIEGE_H),hasard:.35,froid:c.lv===4,
    personnages:sus.map(o=>{const k=caractereDe(o.s);return{nom:c.suspects[o.s].prenom,cx:o.x,cy:o.y,coupable:c.tueurs.includes(o.s),traits:k.traits,gouts:k.gouts,vit:k.vit,evite:c.tueurs.includes(o.s)?c.rc:-1}})});
  G.iaObj=sus;G.iaW=W;
  // la soirée a commencé avant l'arrivée de l'inspecteur : chacun est déjà à son occupation
  for(let i=0;i<900;i++)G.ia.pas();
  vieCopie();
}
function vieCopie(){
  const ia=G.ia;
  G.iaObj.forEach((o,i)=>{
    const a=ia.agents[i],ac=a.action,bouge=!a.gele&&ac&&ac.phase==='aller'&&a.chemin&&a.chemin.length>0;
    o.fx=a.x;o.fy=a.y;o.dir=a.dir;o.mv=!!bouge&&a.attente===0;o.x=a.cell[0];o.y=a.cell[1];o.path=bouge?a.chemin:null;
    o.assis=a.assis?1:0;o.siege=a.assis&&ac&&ac.spot?ac.spot.f:null;if(o.assis&&o.siege)o.dir=DIR_SIEGE[o.siege.name]??o.dir;
    o.bulle=a.gele?null:a.bulle;o.fait=ac&&ac.phase==='faire'?ac.type:bouge?'marche':null;
    if(!o.assis)o.geste=o.fait==='lire'?'lit':o.fait==='boire'?'boit':null;
    const ai=ia.aire(a.cell[0],a.cell[1]);if(ai>=0&&ai<W.rooms.length)o.room=ai;
  });
}
function vieTick(ar){
  if(!G.ia||G.iaW!==W)vieInit();
  const ia=G.ia,P=S.p,R=reglage();
  ia.options.noir=G.noir>0;ia.options.ouvertes=S.open;ia.options.vitesse=.9*R.npc;
  G.iaObj.forEach((o,i)=>{
    const a=ia.agents[i];if(o.hold>0)o.hold--;
    const pres=Math.hypot(P.x-o.fx,P.y-o.fy)<R.vue*.7&&visible(ar,o.fx>>4,(o.fy-3)>>4);
    a.gele=pres||o.hold>0;
    if(pres){if(!a.assis){const dx=P.x-a.x,dy=P.y-a.y;a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2)}if(!o.seen){o.seen=240;o.em=45;o.emc='!'}}
    else if(o.seen>0)o.seen--;
  });
  ia.pas();vieCopie();
}
function bulleParle(x,y){
  ctx.fillStyle='#141226';ctx.fillRect(x-7,y-9,14,9);ctx.fillRect(x-2,y,3,2);
  ctx.fillStyle='#fff8e4';ctx.fillRect(x-6,y-8,12,7);ctx.fillRect(x-1,y-1,1,2);
  ctx.fillStyle='#2a2418';const k=(tick>>4)%4;for(let i=0;i<3;i++)if(i<=k)ctx.fillRect(x-4+i*3,y-5,2,2);
}

// Les fiches des suspects, façon dossier de police : une rangée de portraits, et pour la personne choisie
// son signalement, son caractère, ce qu'elle fait en ce moment, sa tension, son emploi du temps déclaré
// heure par heure, ce qui cloche dans ses déclarations, son mobile s'il est connu, et mes notes.
function fichesSuspects(){
  const n=c.suspects.length,i=Math.max(0,Math.min(n-1,G.fiche|0)),su=c.suspects[i],o=W.obj.find(q=>q.kind==='suspect'&&q.s===i);
  const demandes=s=>HOURS.filter((_,h)=>S.asked[s+'-'+h]).length;
  const tetes=c.suspects.map((s,k)=>{const d=demandes(k),cf=conflitsDe(k).length;
    return`<button class="tete ${k===i?'choisi':''}" data-a="fiche" data-v="${k}" aria-pressed="${k===i}"><img alt="" src="${imgURL('p'+k)}"><b>${esc(s.prenom)}</b><small>${d}/${HOURS.length} heures${cf?` · <i class="alerte">${cf} ✗</i>`:''}</small></button>`}).join('');
  // signalement et caractère
  const car=caractereMots(i),aire=o?W.areas[G.ia?G.ia.aire(o.x,o.y):-1]:null,lieu=aire?aire.name:(o&&W.rooms[o.room]?W.rooms[o.room].name:'?');
  const fait=o&&o.fait?(o.fait==='marche'?'se déplace':ACTION_MOTS[o.fait]||''):'';
  const tension=stressDe(i),motT=tension>=70?'à bout de nerfs':tension>=40?'tendu':tension>=15?'sur ses gardes':'calme',e=su.g==='f'?'e':'';
  // emploi du temps déclaré
  const heures=HOURS.map((h,k)=>{
    const crime=c.win.includes(k)?' crime':'';
    if(!S.asked[i+'-'+k])return`<li class="vide${crime}"><b>${h}</b><span>Pas encore demandé</span></li>`;
    const st=c.stmts[i][k],avec=st.with.map(t=>c.suspects[t].prenom);if(st.vic)avec.push(c.vName);
    return`<li class="${crime.trim()}"><b>${h}</b><span>${esc(cap(c.set.rooms[st.room].n))}<small>${avec.length?'avec '+esc(liste(avec)):(su.g==='f'?'seule':'seul')}</small></span></li>`}).join('');
  // ce qui cloche
  const cf=conflitsDe(i),cloche=cf.length?`<ul class="ds-cloche">${cf.map(l=>`<li>${esc(l.t)}</li>`).join('')}</ul>`:`<p class="ds-rien">Rien de relevé pour l'instant. Compare ses heures avec celles des autres dans « Déductions ».</p>`;
  const parle=S.rel[i]===2?`A avoué quelque chose.`:S.rel[i]?`M'a parlé de ${esc(c.vName)}.`:`Ne m'a pas encore parlé de ${esc(c.vName)}.`;
  return`<h2>Les personnages</h2><div class="tetes" role="tablist">${tetes}</div>
  <article class="dossier-s">
    <header><img alt="Portrait de ${esc(su.nom)}" src="${imgURL('p'+i)}"><div class="ds-id"><small>Fiche n° ${i+1} · ${esc(c.set.nom)}</small><b>${esc(su.nom)}</b><span>${esc(cap(su.role))}${su.age?`, ${su.age} ans`:''}</span><em>${NIVEAUX[su.niveau-1]}</em></div><i class="ds-tampon ${cf.length?'rouge':''}">${cf.length?'À revoir':demandes(i)===HOURS.length?'Entendu'+e:'À entendre'}</i></header>
    <div class="ds-grille">
      <section><h4>Signalement</h4><p>${esc(su.bio||'')}</p>${su.trait?`<p><b>Signe particulier :</b> ${esc(su.trait)}.</p>`:''}</section>
      <section><h4>Caractère</h4><p>${esc(cap(liste(car.mots)))}.</p>${car.habitudes.length?`<p>${esc(cap(car.habitudes.join(', ')))}.</p>`:''}</section>
      <section><h4>En ce moment</h4><p>${esc(cap(lieu))}${fait?` : ${esc(fait)}`:''}.</p><p>${parle}</p></section>
      <section><h4>Tension</h4><div class="ds-jauge"><i style="width:${Math.max(4,tension)}%"></i></div><p>${cap(motT)}${e&&/tendu|calme/.test(motT)?'':''}.</p></section>
    </div>
    <h4>Emploi du temps déclaré <small>(en rouge : l'heure du meurtre)</small></h4><ol class="ds-heures">${heures}</ol>
    <h4>Ce qui cloche</h4>${cloche}
    <h4>Mobile</h4><p class="${S.docs[i]?'ds-mobile':'ds-rien'}">${S.docs[i]?esc(cap(su.mobile))+'.':'Inconnu pour l\'instant : un document caché quelque part en parle.'}</p>
    <textarea data-n="g${i}" rows="2" placeholder="Mes notes sur ${esc(su.prenom)}…" aria-label="Mes notes sur ${esc(su.prenom)}">${esc(S.notes['g'+i]||'')}</textarea>
  </article>
  <p class="main">Victime : ${esc(c.vName)}, ${esc(c.vrole)}.</p>`;
}

// Chaque lieu a son étage, son ambiance et sa petite musique. Et on peut partager son résultat.

// ——— Monter à l'étage, redescendre ———
function voyage(o){
  const[x,y]=o.acces==='monte'?W.etage.haut:W.etage.bas;
  closeAll();son('porte');
  S.p.x=x*TS+8;S.p.y=y*TS+11;G.walk=null;G.moved=false;
  cam.x=S.p.x-VW/2;cam.y=S.p.y-VH/2;G.snap=true;G.area=areaIdx(x,y);G.fade=.95;
  toast(o.acces==='monte'?W.etage.nom:'Rez-de-chaussée',true);
  render();save();
}

// ——— Ambiance : ce qui bouge derrière les fenêtres et dans la lumière ———
const calmeAmb=()=>!c||c.test||document.body.classList.contains('calme');
const roulis=()=>c&&c.lv===6&&!calmeAmb()?Math.round(Math.sin(tick*.02)*2.4):0;
function ambianceFenetres(){
  if(calmeAmb())return;
  const lv=c.lv;
  W.windows.forEach((w,i)=>{
    const x=w.x*TS,y=w.y*TS;
    if(lv===6){for(let k=0;k<5;k++){ctx.fillStyle='rgba(220,235,255,.75)';ctx.fillRect(x+9+((k*5+(tick>>3)+i*3)%13),y+16+Math.round(Math.sin(tick*.05+k)*1.6),2,1)}return}
    const gx=x+3,gy=y+5,gw=26;
    if(lv===4)for(let j=0;j<gw;j++){
      const h=Math.sin(j*.35+tick*.03)*2+Math.sin(j*.11-tick*.017)*2,yy=gy+4+Math.round(h);
      ctx.fillStyle=`rgba(90,255,170,${(.32+.2*Math.sin(tick*.04+j*.2)).toFixed(2)})`;ctx.fillRect(gx+j,yy,1,3);ctx.fillStyle='rgba(130,190,255,.25)';ctx.fillRect(gx+j,yy-2,1,2);
    }
    if(lv===2)for(let k=0;k<3;k++){const xx=gx+gw-1-((tick*2+k*37+i*11)%(gw+40));if(xx>=gx&&xx<gx+gw-1){ctx.fillStyle='rgba(255,226,150,.9)';ctx.fillRect(xx,gy+9+(k%2)*3,2,1)}}
    if(lv===3)for(let k=0;k<7;k++)if(noise(k+i*7,tick>>5,3)>.5){ctx.fillStyle='rgba(255,225,140,.85)';ctx.fillRect(gx+(k*9+i*5)%gw,gy+7+(k*5)%8,1,1)}
  });
  // Poussière qui danse dans la lumière des lampes : théâtre et château
  if(lv===5||lv===8){ctx.fillStyle='rgba(255,240,200,.55)';W.lamps.forEach((l,i)=>{const lx=l.x*TS,ly=l.y*TS;if(Math.abs(lx-S.p.x)>260||Math.abs(ly-S.p.y)>200)return;for(let k=0;k<4;k++){const t=tick*.012+k*1.7+i;ctx.fillRect(Math.round(lx+Math.sin(t*1.3)*11),Math.round(ly-6-((tick*.12+k*9)%20)+Math.sin(t)*3),1,1)}})}
}
function ambianceLumiere(){
  if(calmeAmb())return;
  const lv=c.lv;
  if(lv===9){
    ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(90,10,60,${(.05+.03*Math.sin(tick*.05)).toFixed(3)})`;ctx.fillRect(0,0,VW,VH);ctx.globalCompositeOperation='source-over';
    if(noise(tick>>2,9,4)>.94){ctx.fillStyle='rgba(8,4,16,.18)';ctx.fillRect(0,0,VW,VH)}
  }
  if(lv===7&&noise(tick>>1,7,5)>.975){ctx.fillStyle='rgba(225,240,255,.08)';ctx.fillRect(0,0,VW,VH)}
  if(lv===8||lv===5){ctx.fillStyle=`rgba(8,4,16,${(noise(tick>>2,8,6)*.05).toFixed(3)})`;ctx.fillRect(0,0,VW,VH)}
}

// ——— Une petite musique différente dans chaque lieu ———
const GAMMES={penta:[0,2,4,7,9],maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],blues:[0,3,5,6,7,10],tons:[0,2,4,6,8,10],harm:[0,2,3,5,7,8,11]};
const MUSIQUES=[
 {g:'penta',bpm:100,ty:'triangle',m:[0,2,4,-1,3,2,1,-1,2,4,5,-1,4,2,0,-1],b:[0,-1,-1,-1,3,-1,-1,-1,4,-1,-1,-1,0,-1,-1,-1]},      // Hôtel : air de montagne
 {g:'min',bpm:70,ty:'triangle',m:[4,-1,3,2,3,-1,-1,-1,2,-1,1,0,1,-1,-1,-1],b:[0,-1,-1,-1,5,-1,-1,-1,3,-1,-1,-1,4,-1,-1,-1]},       // Villa : piano mélancolique
 {g:'dor',bpm:132,ty:'square',m:[0,-1,2,-1,4,-1,2,-1,3,-1,1,-1,2,-1,-1,-1],b:[0,-1,0,-1,4,-1,0,-1,0,-1,0,-1,4,-1,0,-1]},          // Train : au rythme des rails
 {g:'blues',bpm:96,ty:'triangle',m:[0,1,2,-1,4,-1,2,1,0,-1,-1,5,4,-1,2,-1],b:[0,-1,2,-1,4,-1,5,-1,0,-1,2,-1,4,-1,2,-1]},          // Tour : jazz de bureau
 {g:'tons',bpm:60,ty:'sine',m:[0,-1,-1,4,-1,-1,5,-1,-1,-1,3,-1,-1,2,-1,-1],b:[0,-1,-1,-1,-1,-1,-1,-1,3,-1,-1,-1,-1,-1,-1,-1]},    // Station : la nuit polaire
 {g:'maj',bpm:126,ty:'triangle',m:[4,-1,-1,5,4,3,2,-1,-1,4,3,2,1,-1,-1,-1],b:[0,-1,-1,4,-1,-1,0,-1,-1,4,-1,-1,0,-1,-1,4]},         // Théâtre : une valse
 {g:'dor',bpm:92,ty:'triangle',m:[0,0,2,3,4,-1,4,3,2,-1,0,-1,1,2,0,-1],b:[0,-1,-1,-1,3,-1,-1,-1,4,-1,-1,-1,0,-1,-1,-1]},           // Paquebot : chant de marins
 {g:'maj',bpm:64,ty:'sine',o:2,m:[6,-1,-1,-1,4,-1,-1,-1,3,-1,-1,-1,1,-1,-1,-1],b:[0,-1,-1,-1,-1,-1,-1,-1,5,-1,-1,-1,-1,-1,-1,-1]},// Clinique : notes froides
 {g:'harm',bpm:88,ty:'square',m:[0,2,4,7,4,2,0,2,5,7,5,2,6,4,3,-1],b:[0,-1,-1,-1,5,-1,-1,-1,3,-1,-1,-1,4,-1,-1,-1]},                // Château : clavecin
 {g:'blues',bpm:112,ty:'triangle',m:[0,-1,1,2,3,-1,2,-1,4,3,2,-1,0,-1,-1,-1],b:[0,1,2,4,0,1,2,4,3,4,5,4,0,1,2,4]}                   // Casino : swing
];
function noteA(fq,t0,d,v,ty){
  if(!SND.m)return;
  const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=fq;
  g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(v,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d);
  o.connect(g);g.connect(SND.m);o.start(t0);o.stop(t0+d+.05);
}
function musiqueLieu(base){
  const M=MUSIQUES[(c.lv||0)%10],gam=GAMMES[M.g],pas=60/M.bpm/2,t=AC.currentTime;
  const fq=i=>base*Math.pow(2,gam[i%gam.length]/12+Math.floor(i/gam.length)+((M.o||1)-1));
  if(!SND.mt||SND.mt<t-.4||SND.mlv!==c.lv){SND.mt=t+.15;SND.mi=0;SND.mlv=c.lv}
  while(SND.mt<t+.7){
    const i=SND.mi++%M.m.length,a=M.m[i],b=M.b[i];
    if(a>=0)noteA(fq(a),SND.mt,pas*1.8,M.ty==='square'?.012:.03,M.ty);
    if(b>=0)noteA(fq(b)/2,SND.mt,pas*3,.026,'sine');
    SND.mt+=pas;
  }
}

// ——— Partager son résultat ———
function texteResultat(){
  const f=S.fin,n=f.note||{l:'?',min:0},q=FINS[f.cle],quand=S.jour?'Enquête du jour '+S.jour.split('-').reverse().join('/'):'Affaire n° '+c.seed;
  return`Faux Alibi · ${quand} · ${c.set.nom}${c.key==='expert'?' · Expert':''}\n${q?q[0]:(f.win?'Affaire résolue':'Affaire ratée')} · Note ${n.l} · ${n.min} min\nhttps://lechat45.github.io/Faux_alibi/`;
}
function partager(){
  const t=texteResultat();
  const montre=()=>{vue(`<div class="d objet"><p class="petit">Mon résultat</p><textarea id="res-t" readonly rows="4" class="res-t">${esc(t)}</textarea><p class="petit">Sélectionne ce texte et copie-le pour le partager.</p></div>`);const e=$('res-t');if(e){e.focus();e.select()}};
  if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share({text:t}).catch(()=>{});return}
  try{const p=navigator.clipboard&&navigator.clipboard.writeText(t);if(!p)return montre();p.then(()=>toast('Résultat copié : colle-le où tu veux',true),montre)}catch(e){montre()}
}

// ——— Installer le jeu comme une application ———
let invite=null;
const enApp=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
const surIPhone=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const installable=()=>!!document.querySelector('link[rel="manifest"]')&&!enApp();
addEventListener('beforeinstallprompt',e=>{e.preventDefault();invite=e;if(!enJeu&&typeof accueil==='function')accueil()});
addEventListener('appinstalled',()=>{invite=null;toast('Faux Alibi est installé',true)});
if('serviceWorker' in navigator&&document.querySelector('link[rel="manifest"]')&&(location.protocol==='https:'||location.hostname==='localhost'))
  addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
function boutonInstaller(){return installable()&&(invite||surIPhone())?'<button class="etiq" data-a="installer">Installer le jeu</button>':''}
function aideInstaller(){return installable()&&surIPhone()?'<p id="aide-inst" class="aide-inst" hidden>Sur iPhone : touche <b>Partager</b> (le carré avec une flèche vers le haut), puis <b>« Sur l\'écran d\'accueil »</b>. Le jeu s\'ouvrira alors en plein écran, comme une application.</p>':''}
function installer(){
  if(invite){const e=invite;invite=null;e.prompt();(e.userChoice||Promise.resolve()).finally(()=>accueil());return}
  const a=$('aide-inst');if(a)a.hidden=!a.hidden;
}

// ——— Peur du noir : la plupart des suspects ———
const peureux=s=>noise(s+3,7,((c&&c.seed)||1)&255)<.72;
const PEUR=['Qui est là ?',"J'ai horreur du noir…","Ne partez pas, s'il vous plaît.",'Vous avez entendu ?',"Quelqu'un a une bougie ?"];

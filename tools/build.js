const fs=require('fs'),path=require('path'),d=path.join(__dirname,'..');
const js=['levels','data','engine','puzzles','world','art','art2','meubles','tableaux','decor','art3','interieur','fonds','minis','documents','papiers','accueil','enquete','salles','vie','tuto','sons','mobilier','minis2','lieux','game'].map(f=>fs.readFileSync(path.join(d,'src',f+'.js'),'utf8')).join('\n');
const css=fs.readFileSync(path.join(d,'src/style.css'),'utf8');
const out=`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Faux Alibi</title>
<!--APP-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Pixelify+Sans:wght@400;600;700&family=VT323&display=swap">
<style>${css}</style>
</head>
<body>
<main id="app">
  <canvas id="jeu" tabindex="0" aria-label="Carte du jeu. Clique pour te déplacer et agir."></canvas>
  <div id="lieu" class="lieu" hidden></div>
  <div id="hud" class="hud" hidden>
    <button id="engrenage" class="engrenage" data-a="reglages" aria-label="Options"><i id="eng1"></i></button>
    <button id="marteau" class="marteau" data-a="marteau" aria-label="Accuser"><canvas id="mart" width="80" height="68"></canvas></button>
    <button id="calepin" class="calepin" data-a="onglet" data-v="calepin" aria-label="Ouvrir le calepin"><span id="neuf" class="neuf" hidden></span></button>
    <div class="plan-mini"><canvas id="mini" aria-hidden="true"></canvas><span id="ici"></span><span id="plan-nom" class="plan-nom" hidden></span></div>
  </div>
  <div id="amb" class="amb" hidden></div>
  <div id="but" class="but" hidden></div>
  <button id="tuto-p" class="tuto-p" data-a="passertuto" hidden>Passer le tutoriel</button>
  <div id="toast" class="toast" hidden></div>
  <div id="prompt" class="prompt" hidden></div>
  <div id="bulle" class="bulle" hidden></div>
  <div id="carte" class="carte" hidden></div>
  <div id="carnet" class="carnet" hidden></div>
  <div id="pz" class="pz" hidden></div>
  <div id="doc" class="doc" hidden></div>
  <button id="passer" class="passer" hidden>Passer la scène</button>
  <div id="tribunal" class="tribunal" hidden></div>
  <div id="options" class="pop" hidden></div>
  <section id="accueil" class="accueil"><canvas id="ciel"></canvas><div id="acc-ui" class="acc-ui"></div></section>
</main>
<script>
${js}
</script>
</body>
</html>
`;
if(/gsk_[A-Za-z0-9]/.test(out))throw new Error('Une clé est présente dans la page : publication interdite.');
// La version privée (claude.ai) ne peut pas s'installer : elle ne reçoit pas les balises d'application
fs.writeFileSync(path.join(d,'faux-alibi.html'),out.replace('<!--APP-->\n',''));
// Application installable (Chrome sur Android, Safari et Chrome sur iPhone) : manifeste, icônes, service worker
const desc="Jeu d'enquête en pixel art : interroge les suspects, fouille les lieux et démasque le menteur.";
const APP=`<meta name="description" content="${desc}">
<meta name="theme-color" content="#0c0a1c">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Faux Alibi">
`;
const page=out.replace('<!--APP-->\n',APP);
fs.writeFileSync(path.join(d,'index.html'),page); // page servie par GitHub Pages
fs.writeFileSync(path.join(d,'manifest.webmanifest'),JSON.stringify({id:'./',name:'Faux Alibi',short_name:'Faux Alibi',description:desc,lang:'fr',start_url:'./',scope:'./',display:'fullscreen',display_override:['fullscreen','standalone'],orientation:'any',background_color:'#05040c',theme_color:'#0c0a1c',categories:['games'],
  icons:[{src:'icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'icons/icon-512.png',sizes:'512x512',type:'image/png'},{src:'icons/icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,1));
const version=require('crypto').createHash('sha1').update(page).digest('hex').slice(0,10);
fs.writeFileSync(path.join(d,'sw.js'),`// Service worker généré par tools/build.js : le jeu se lance même sans réseau
const V='faux-alibi-${version}',BASE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(l=>Promise.all(l.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  // la page : le réseau d'abord pour avoir la dernière version, la copie si on est hors ligne
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put('./index.html',y));return x}).catch(()=>caches.match('./index.html')));return}
  // icônes et polices : la copie d'abord
  if(u.origin===location.origin||/^fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname))
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x})));
});
`);
console.log('ok',(out.length/1024|0)+' Ko');

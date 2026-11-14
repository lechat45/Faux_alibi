// Service worker généré par tools/build.js : le jeu se lance même sans réseau
const V='faux-alibi-1206d41841',BASE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(l=>Promise.all(l.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  // la page : le réseau d'abord pour avoir la dernière version, la copie si on est hors ligne
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put('./index.html',y));return x}).catch(()=>caches.match('./index.html')));return}
  // icônes et polices : la copie d'abord
  if(u.origin===location.origin||/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x})));
});

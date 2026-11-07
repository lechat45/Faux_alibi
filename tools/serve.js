// Serveur de dev : sert la page construite par tools/build.js, relue à chaque requête.
const http=require('http'),fs=require('fs'),path=require('path');
const page=path.join(__dirname,'..','faux-alibi.html'),port=+process.env.PORT||4173;
http.createServer((q,s)=>{
  if(q.url.split('?')[0]!=='/'){s.statusCode=404;return s.end('404')}
  s.setHeader('content-type','text/html; charset=utf-8');
  s.setHeader('cache-control','no-store');
  s.end(fs.readFileSync(page));
}).listen(port,'127.0.0.1',()=>console.log(`Faux Alibi : http://localhost:${port}`));

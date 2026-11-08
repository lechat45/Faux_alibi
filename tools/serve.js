// Serveur de dev : sert la page construite par tools/build.js et les fichiers de l'application installable,
// relus à chaque requête. Seuls ces fichiers-là sont servis.
const http=require('http'),fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),port=+process.env.PORT||4173;
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png'};
const PERMIS=/^\/(index\.html|sw\.js|manifest\.webmanifest|icons\/[a-z0-9-]+\.png)$/;
// Captures d'écran de dev : la page envoie l'image d'un canvas, elle est rangée dans le dossier temporaire
const CAPT=path.join(require('os').tmpdir(),'fa-captures');
http.createServer((q,s)=>{
  let u=q.url.split('?')[0];if(u==='/')u='/index.html';
  if(q.method==='POST'&&u==='/capture'){
    const n=(new URL(q.url,'http://x').searchParams.get('n')||'capture').replace(/[^a-z0-9-]/gi,'').slice(0,40)||'capture';let b='';
    q.on('data',d=>{b+=d;if(b.length>2e7)q.destroy()});
    q.on('end',()=>{try{fs.mkdirSync(CAPT,{recursive:true});fs.writeFileSync(path.join(CAPT,n+'.png'),Buffer.from(b.slice(b.indexOf(',')+1),'base64'));s.end('ok')}catch(e){s.statusCode=500;s.end('erreur')}});
    return;
  }
  if(!PERMIS.test(u)){s.statusCode=404;return s.end('404')}
  fs.readFile(path.join(root,u),(e,b)=>{
    if(e){s.statusCode=404;return s.end('404')}
    s.setHeader('content-type',TYPES[path.extname(u)]);s.setHeader('cache-control','no-store');s.end(b);
  });
}).listen(port,'127.0.0.1',()=>console.log(`Faux Alibi : http://localhost:${port}`));

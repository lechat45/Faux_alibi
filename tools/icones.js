// Icônes de l'application (écran d'accueil Android et iPhone) : une loupe en pixel art sur la nuit.
// node tools/icones.js  → écrit icons/*.png
const fs=require('fs'),path=require('path'),zlib=require('zlib');
const T=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;T[n]=c>>>0}
const crc=b=>{let c=0xffffffff;for(const x of b)c=T[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0};
const bloc=(t,d)=>{const l=Buffer.alloc(4),k=Buffer.alloc(4),td=Buffer.concat([Buffer.from(t),d]);l.writeUInt32BE(d.length);k.writeUInt32BE(crc(td));return Buffer.concat([l,td,k])};
function png(w,h,px){
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;
  const raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++)px.copy(raw,y*(w*4+1)+1,y*w*4,(y+1)*w*4);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),bloc('IHDR',ih),bloc('IDAT',zlib.deflateSync(raw,{level:9})),bloc('IEND',Buffer.alloc(0))]);
}
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
// Dessin sur une grille de 32 x 32
const N=32,G=Array.from({length:N},()=>Array(N).fill(null));
const P=(c,x,y,w=1,h=1)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&j>=0&&i<N&&j<N)G[j][i]=c};
for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=y/N;G[y][x]=t<.5?'#1a1630':'#120f24';if((x*7+y*13)%29===0&&y<20)G[y][x]='#3a3460'}
[[4,5],[26,4],[23,9],[6,24],[29,18]].forEach(([x,y])=>P('#e8ecff',x,y));
// manche en bois et virole dorée
for(let k=0;k<9;k++){P('#3a2214',19+k,20+k,3,3);P('#7a4a28',19+k,19+k,3,2);P('#9a6438',19+k,19+k,1,1)}
P('#d8b35c',18,18,3,3);P('#fff0a0',18,18,1,1);P('#a8842c',20,20,1,1);
// la loupe : cercle doré, verre bleuté, reflet
const cx=13,cy=13;
for(let y=0;y<N;y++)for(let x=0;x<N;x++){const d=Math.hypot(x+.5-cx,y+.5-cy);
  if(d<=9.6&&d>7.6)P(d>8.8?'#a8842c':'#d8b35c',x,y);
  else if(d<=7.6)P((x+y)<cx+cy-4?'#9ac8e0':'#6aa0c4',x,y)}
P('#e8f6ff',9,8,3,1);P('#e8f6ff',8,9,1,3);P('#fff0a0',10,5,3,1);
// un point d'interrogation rouge dans le verre
[[11,9,4,1],[15,10,1,2],[14,12,1,1],[13,13,1,2],[13,16,1,1],[10,10,1,1]].forEach(([x,y,w,h])=>P('#a3262a',x,y,w,h));
[[12,8,3,1],[16,10,1,1]].forEach(([x,y,w,h])=>P('#c8484a',x,y,w,h));
// rendu à la taille voulue, avec une marge pour les icônes « maskable »
function rendu(taille,cote,fond='#120f24'){
  const px=Buffer.alloc(taille*taille*4),m=(taille-cote)>>1,f=hex(fond);
  for(let y=0;y<taille;y++)for(let x=0;x<taille;x++){
    const gx=Math.floor((x-m)*N/cote),gy=Math.floor((y-m)*N/cote),dedans=gx>=0&&gy>=0&&gx<N&&gy<N;
    const c=dedans?hex(G[gy][gx]):f,o=(y*taille+x)*4;px[o]=c[0];px[o+1]=c[1];px[o+2]=c[2];px[o+3]=255;
  }
  return png(taille,taille,px);
}
const dir=path.join(__dirname,'..','icons');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'icon-192.png'),rendu(192,192));
fs.writeFileSync(path.join(dir,'icon-512.png'),rendu(512,512));
fs.writeFileSync(path.join(dir,'icon-maskable-512.png'),rendu(512,384));
fs.writeFileSync(path.join(dir,'apple-touch-icon.png'),rendu(180,160));
fs.writeFileSync(path.join(dir,'favicon-32.png'),rendu(32,32));
console.log('icônes écrites');

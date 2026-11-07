// Des objets propres à chaque lieu : chariot d'hôtel, bouée du paquebot, machine à sous du casino...
Object.assign(SPR,{
  chariot(g,v){const P=(c,x,y,w=1,h=1)=>R(g,c,x,y,w,h),m='#a8b0ba';
    [2,28].forEach(x=>{P(m,x,6,2,18);P('#ffffff',x,6,1,18)});box(g,1,4,30,4,'#d8dce4');box(g,1,16,30,3,'#c8ccd4');
    [[4,0,'#f4f0e4'],[11,1,'#c8d8e8'],[18,0,'#f4f0e4']].forEach(([x,y,c])=>{box(g,x,y,6,4,c);P(tone(c,-.2),x,y+2,6,1)});
    [[4,10,'#3a6a4a'],[10,9,'#8a2f38'],[16,11,'#c8a040']].forEach(([x,y,c])=>{P(c,x,y,4,6);P(tone(c,.3),x+1,y,1,6)});
    box(g,21,9,8,7,'#ece4d0');[4,26].forEach(x=>ellipseP(g,x,25,2,2,'#2a2a34'))},
  valise(g){const c='#7a4c2a',P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);P('#3a2416',5,0,6,2);P('#3a2416',5,0,1,4);P('#3a2416',10,0,1,4);box(g,1,3,14,15,c);P(tone(c,.3),2,4,12,1);P('#3a2416',1,8,14,2);P('#c8a040',7,8,2,2);P('#3a2416',4,3,2,15);P('#3a2416',10,3,2,15);P('#ece4cc',12,11,3,5);P('#a33a3a',12,12,3,1);P('#141226',1,18,14,1)},
  bascule(g,v){const b='#7a5230',P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);bois(g,3,0,10,14,b,v);P(tone(b,.3),3,0,10,1);for(let i=5;i<12;i+=3)P('#2a1a12',i,2,1,10);box(g,2,14,12,4,'#8a2f38');P('#4a2e1c',3,18,2,6);P('#4a2e1c',11,18,2,6);for(let i=0;i<16;i++)P('#4a2e1c',i,24+Math.round(Math.abs(i-8)*-.18+1),1,2)},
  banquette(g,v){const c='#7a2230',P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);bois(g,0,2,32,10,c,v);P(tone(c,.3),0,2,32,1);for(let i=8;i<32;i+=8){P(tone(c,-.34),i,3,1,9);ellipseP(g,i-4,7,1,1,'#c8a040')}box(g,0,12,32,6,tone(c,.1));P('#3a2416',2,18,3,4);P('#3a2416',27,18,3,4);P('#c8a040',0,0,32,2)},
  fontaine(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);ellipseP(g,8,5,6,5,'#8ac8f0');P('#8ac8f0',2,4,12,9);P('#c8ecff',4,3,2,9);P('#5a9ac8',2,10,12,3);box(g,2,13,12,21,'#e4e8ec');P('#3a7ad8',4,16,3,3);P('#d8483e',9,16,3,3);P('#2a2a34',4,22,8,5);P('#c8ccd4',6,24,4,2);P('#a8b0ba',2,32,12,2)},
  radio(g,v){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);caisse(g,0,8,32,22,3,'#4a5a4a',v);P('#22302a',3,11,14,9);for(let i=0;i<4;i++)P('#3ad8a0',5+i*3,17-(i*5+v)%6,2,1+(i*5+v)%6);[21,27].forEach(x=>{ellipseP(g,x,14,2,2,'#d8dce4');P('#141226',x,12,1,2)});for(let i=0;i<8;i++)P('#22302a',4+i*3,23,2,3);P('#d8483e',25,23,3,3);P('#a8b0ba',27,0,1,8);P('#d8483e',27,0,1,1)},
  skis(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);[3,7].forEach((x,i)=>{P(i?'#d8483e':'#3a7ad8',x,1,3,38);P('#ffffff',x+1,1,1,38);P('#141226',x,20,3,4)});[11,13].forEach(x=>{P('#a8b0ba',x,3,1,36);P('#2a2a34',x-1,3,3,4);ellipseP(g,x,34,2,1,'#2a2a34')})},
  portant(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);P('#8a939e',1,2,30,2);P('#c8ccd4',1,2,30,1);[1,29].forEach(x=>{P('#8a939e',x,2,2,36);P('#5a636e',x-1,37,4,2)});[[4,'#8a2f38',28],[10,'#2e5a8c',24],[16,'#c8a040',30],[22,'#5a3a78',26]].forEach(([x,c,h])=>{P('#a8b0ba',x+2,4,1,3);for(let j=0;j<h;j++)P(tone(c,(j%7===0?-.14:0)),x,7+j,6,1);P(tone(c,.3),x+1,8,1,h-2)})},
  bouee(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);P('#5a3a22',7,12,3,18);for(let a=0;a<6.3;a+=.05){const q=Math.floor(a/1.57)%2?'#ece4d8':'#d8483e';for(let r=4;r<8;r++)P(q,8+Math.cos(a)*r,9+Math.sin(a)*r)}P('#c8b888',0,8,1,3);P('#c8b888',15,8,1,3);P('#4a3424',4,29,9,1)},
  barre(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h),b='#8a5a34',cx=16,cy=15;P('#5a3a22',12,20,8,17);P('#7a4c2a',13,20,2,17);box(g,8,34,16,4,'#5a3a22');for(let a=0;a<6.3;a+=.03)for(let r=11;r<14;r++)P(b,cx+Math.cos(a)*r,cy+Math.sin(a)*r);for(let a=0;a<6.28;a+=1.05){for(let r=0;r<11;r++)P('#5a3a22',cx+Math.cos(a)*r,cy+Math.sin(a)*r,2,2);P('#c8a040',cx+Math.cos(a)*15-1,cy+Math.sin(a)*15-1,3,3)}ellipseP(g,cx,cy,3,3,'#c8a040')},
  perfusion(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);P('#a8b0ba',7,3,2,34);P('#e4e8ec',7,3,1,34);P('#a8b0ba',3,3,10,1);box(g,10,5,5,11,'#d8ecf4');P('#8ac8f0',11,9,3,6);P('#c8dce8',12,16,1,12);for(let i=0;i<3;i++){const a=i*2.1;P('#5a636e',8+Math.cos(a)*5,37+Math.sin(a)*1.5,2,2)}},
  brancard(g,v){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);box(g,0,5,32,8,'#e4e8ec');P('#c8d8d8',1,6,30,4);P('#ffffff',1,5,8,4);P('#8a939e',0,13,32,2);[4,26].forEach(x=>{P('#5a636e',x,15,2,5);ellipseP(g,x+1,20,2,2,'#2a2a34')});P('#a8b0ba',29,1,2,5)},
  armure(g){const a='#a8b0ba',s='#5a636e',P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);box(g,1,37,14,4,'#4a3424');P(s,5,28,2,9);P(s,9,28,2,9);P(a,5,28,1,9);P(a,9,28,1,9);box(g,4,14,8,14,a);P('#e4e8ec',5,15,2,11);P(s,4,20,8,1);P(s,8,14,1,14);box(g,1,14,3,12,a);box(g,12,14,3,12,a);ellipseP(g,8,8,4,5,a);P(s,5,7,6,2);P('#141226',6,8,1,1);P('#141226',9,8,1,1);P('#e4e8ec',6,4,2,2);P('#a33a3a',7,0,2,4);P(s,14,2,1,34);for(let i=0;i<4;i++)P('#e4e8ec',14-i*.4,2-i*.3,1+i*.8,1)},
  bandit(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h),r='#a32a3a';box(g,1,3,14,34,r);P('#ffd23f',1,3,14,3);P('#141226',3,10,10,8);[3,6,9].forEach((x,i)=>{P('#ece4d0',x+1,11,3,6);P(['#d8483e','#3a7ad8','#ffd23f'][i],x+2,13,1,2)});P('#141226',4,23,8,2);P('#c8a040',4,29,8,4);P('#ffd23f',5,30,6,1);P('#a8b0ba',15,8,1,12);ellipseP(g,15,7,1,1,'#d8483e');for(let i=0;i<5;i++)P(i%2?'#ffd23f':'#fff0a8',2+i*3,2,2,1)},
  jetons(g){const P=(k,x,y,w=1,h=1)=>R(g,k,x,y,w,h);P('#4a2e1c',7,12,2,10);ellipseP(g,8,22,5,2,'#3a2416');ellipseP(g,8,9,7,3,'#2e6a4c');ellipseP(g,8,8,6,2,'#3d8a60');[[3,'#d8483e',4],[7,'#3a7ad8',6],[11,'#ffd23f',3]].forEach(([x,c,h])=>{for(let j=0;j<h;j++){P(j%2?c:tone(c,.3),x-1,8-j,4,1)}})}
});
Object.assign(SH,{chariot:27,valise:19,bascule:27,banquette:22,fontaine:34,radio:30,skis:40,portant:39,bouee:30,barre:38,perfusion:39,brancard:22,armure:41,bandit:38,jetons:24});
// Sur le paquebot, les fenêtres sont des hublots
function hublot(g,x,y,lv,seed){
  const[k,q]=cv(32,28);paysage(q,3,1,26,26,lv,seed);
  const d=q.getImageData(0,0,32,28);
  for(let j=0;j<28;j++)for(let i=0;i<32;i++)if(Math.hypot(i-16,j-14)>10.5)d.data[(j*32+i)*4+3]=0;
  q.putImageData(d,0,0);
  for(let j=0;j<28;j++)for(let i=0;i<32;i++){const r=Math.hypot(i-16,j-14);if(r>=10.5&&r<13.5)R(q,tone('#c8a040',(29-i-j)/70+(r<11.2?-.3:0)),i,j)}
  [[6,6],[25,6],[6,21],[25,21]].forEach(([a,b])=>R(q,'#fff0a8',a,b,1,1));
  R(q,'rgba(255,255,255,.35)',11,7,2,5);R(q,'rgba(255,255,255,.25)',14,6,1,2);
  g.drawImage(k,x,y);
}

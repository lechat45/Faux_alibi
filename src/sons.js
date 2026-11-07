// Ambiances sonores : un fond propre à chaque lieu, le feu, l'horloge, l'orage et une musique discrète.
const AMBI=[
 {f:900,v:.55,hum:0,ev:null,base:196},   // Hôtel : vent de neige
 {f:1500,v:.7,hum:0,ev:null,base:174.6}, // Villa : pluie battante
 {f:240,v:.8,hum:55,ev:'rails',base:164.8},
 {f:500,v:.14,hum:110,ev:null,base:220},
 {f:420,v:.85,hum:70,ev:'bip',base:146.8},
 {f:700,v:.12,hum:0,ev:null,base:185},
 {f:320,v:.55,hum:48,ev:'vague',base:155.6},
 {f:600,v:.1,hum:120,ev:'bip',base:207.7},
 {f:800,v:.4,hum:0,ev:null,base:138.6},
 {f:1200,v:.26,hum:0,ev:'jetons',base:233.1}
];
const SND={};
function sonGraphe(){
  if(SND.m||!AC)return;
  const m=AC.createGain();m.gain.value=0;m.connect(AC.destination);SND.m=m;
  const n=Math.floor(AC.sampleRate*2),b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;SND.b=b;
  const s=AC.createBufferSource();s.buffer=b;s.loop=true;
  const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=800;
  const g=AC.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(m);s.start();SND.f=f;SND.fond=g;
  const h=AC.createOscillator();h.type='sine';h.frequency.value=60;const hg=AC.createGain();hg.gain.value=0;h.connect(hg);hg.connect(m);h.start();SND.h=h;SND.hg=hg;
}
function bruit(d,fq,v,ty='bandpass'){
  if(!SND.b)return;
  const t=AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();
  s.buffer=SND.b;s.loop=true;f.type=ty;f.frequency.value=fq;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f);f.connect(g);g.connect(SND.m);s.start(t,Math.random());s.stop(t+d+.05);
}
function ton(fq,d,v,ty='triangle'){
  if(!SND.m)return;
  const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();
  o.type=ty;o.frequency.value=fq;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(SND.m);o.start(t);o.stop(t+d+.05);
}
function tonnerre(){if(!SND.m||!enJeu)return;bruit(2.2,120,.6,'lowpass');bruit(.5,380,.3,'lowpass')}
function sonMaj(){
  if(!AC)return;
  sonGraphe();
  if(AC.state==='suspended'){const p=AC.resume();if(p&&p.catch)p.catch(()=>{})}
  const t=AC.currentTime;
  SND.m.gain.setTargetAtTime(enJeu&&O.sons?O.vol/100:0,t,.4);
  if(!enJeu||!W||!S)return;
  const a=AMBI[(c.lv||0)%10],P=S.p;
  SND.f.frequency.setTargetAtTime(a.f,t,.6);SND.fond.gain.setTargetAtTime(a.v*.13,t,.6);
  SND.h.frequency.setTargetAtTime(a.hum||60,t,.3);SND.hg.gain.setTargetAtTime(a.hum?.03:0,t,.5);
  const pres=n=>W.furn.filter(f=>f.name===n).reduce((m,f)=>Math.min(m,Math.hypot(P.x-(f.x+f.w/2)*TS,P.y-(f.y+.5)*TS)),1e9),fe=pres('fireplace'),ho=pres('clock');
  if(fe<150&&Math.random()<.55)bruit(.03+Math.random()*.05,1700+Math.random()*2200,.1*(1-fe/150));
  if(ho<130&&tick%60<15)bruit(.014,3200,.13*(1-ho/130));
  if(a.ev==='rails'&&tick%75<15)bruit(.05,240,.09,'lowpass');
  if(a.ev==='bip'&&tick%360<15)ton(980,.16,.02,'sine');
  if(a.ev==='vague'&&tick%420<15)bruit(2.4,300,.12,'lowpass');
  if(a.ev==='jetons'&&Math.random()<.1)bruit(.02,4200,.05);
  if(O.musique){
    if(tick%480<15)ton(a.base/2,3.6,.05,'sine');
    if(tick%150<15&&noise(tick>>7,(c.lv||0)+1,3)>.34){const g=[1,1.2,1.335,1.5,1.8,2];ton(a.base*g[Math.floor(noise(tick>>6,5,2)*g.length)],2.4,.032)}
  }
}

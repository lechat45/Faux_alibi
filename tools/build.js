const fs=require('fs'),path=require('path'),d=path.join(__dirname,'..');
const js=['levels','data','engine','puzzles','world','art','art2','meubles','tableaux','decor','art3','interieur','fonds','minis','documents','papiers','accueil','enquete','salles','sons','game'].map(f=>fs.readFileSync(path.join(d,'src',f+'.js'),'utf8')).join('\n');
const css=fs.readFileSync(path.join(d,'src/style.css'),'utf8');
const out=`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Faux Alibi</title>
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
fs.writeFileSync(path.join(d,'faux-alibi.html'),out);
fs.writeFileSync(path.join(d,'index.html'),out); // page servie par GitHub Pages
console.log('ok',(out.length/1024|0)+' Ko');

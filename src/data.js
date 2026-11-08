// 50 objets, 10 familles d'énigmes d'objets et 15 modèles de documents réutilisables.
// Un objet porte des propriétés (tags) : le même objet sert donc à plusieurs énigmes.
const OBJETS=[
 ['torche','Lampe tempête',[],"Une lampe à pétrole, mèche neuve. Si le courant saute, elle éclairera autour de vous."],
 ['pied','Pied-de-biche',['levier'],'Lourd et froid. De quoi ouvrir ce qui résiste.'],['tournevis','Tournevis',['levier'],'Sa pointe plate se glisse partout.'],
 ['cuillere','Grande cuillère',['levier'],'Solide, et son manche fait un bon levier.'],['spatule','Spatule en acier',['levier','coupe'],'Fine et rigide, tachée de peinture.'],
 ['epingle','Épingle à cheveux',['fil'],'Parfaite pour une petite serrure.'],['trombone','Trombone',['fil'],'Déplié, il crochète bien des choses.'],
 ['ferfil','Fil de fer',['fil','electrique'],'Il se tord sans casser et conduit le courant.'],['aiguille','Aiguille à tricoter',['fil'],'Longue, fine et pointue.'],
 ['loupe','Loupe',['optique'],'Le plus vieil ami des enquêteurs.'],['lunettes','Lunettes de lecture',['optique'],'Quelqu\'un les a oubliées. Elles grossissent fort.'],
 ['monocle','Monocle',['optique'],'Un verre épais cerclé d\'or.'],['jumelles','Jumelles de théâtre',['optique'],'Petites, nacrées, très précises.'],
 ['briquet','Briquet',['chaleur','lumiere'],'Une flamme courte mais vive.'],['bougie','Bougie',['chaleur','lumiere'],'Elle éclaire et elle chauffe.'],
 ['allumettes','Boîte d\'allumettes',['chaleur','lumiere'],'Il en reste une poignée.'],['fer','Petit fer à repasser',['chaleur'],'Un modèle de voyage, encore tiède.'],
 ['seche','Sèche-cheveux',['chaleur'],'Bruyant, mais il souffle très chaud.'],['torche','Lampe de poche',['lumiere'],'Le faisceau est encore puissant.'],
 ['lanterne','Lanterne',['lumiere'],'Elle donne une lumière douce et jaune.'],['frontale','Lampe frontale',['lumiere'],'Les mains restent libres.'],
 ['pile','Pile',['electrique'],'Encore chargée, d\'après la languette.'],['fusible','Fusible',['electrique'],'Il suffit de le mettre en place.'],
 ['ampoule','Ampoule',['electrique','lumiere'],'Intacte, avec sa petite douille.'],['rallonge','Rallonge',['electrique'],'Assez longue pour bien des usages.'],
 ['aimant','Aimant en fer à cheval',['aimant'],'Il attire tout ce qui est en métal.'],['boussole','Boussole cassée',['aimant'],'Son aiguille aimantée tient encore.'],
 ['aimantfrigo','Aimant de frigo',['aimant'],'Petit, mais plus fort qu\'il n\'y paraît.'],['ciseaux','Ciseaux',['coupe','levier'],'Bien aiguisés.'],
 ['rasoir','Rasoir de sûreté',['coupe'],'À manier avec prudence.'],['canif','Canif',['coupe','levier'],'Une lame courte et un manche d\'os.'],
 ['ruban','Ruban adhésif',['colle'],'Il colle encore très bien.'],['tube','Tube de colle',['colle'],'Presque plein.'],
 ['pansement','Pansements',['colle'],'Faute de mieux, ça répare du papier.'],['timbres','Carnet de timbres',['colle'],'On peut recoller un papier avec.'],
 ['crayon','Crayon à papier',['mine'],'Sa mine tendre noircit vite.'],['fusain','Bâton de fusain',['mine'],'Il laisse une trace noire et poudreuse.'],
 ['rouge','Tube de rouge',['mine'],'Une teinte vive, très grasse.'],['poudre','Boîte de poudre',['mine'],'Elle révèle les creux et les empreintes.'],
 ['montre','Montre à gousset',[],'Arrêtée. Un nom est gravé, effacé par le temps.'],['piece','Pièce ancienne',[],'Une effigie usée, sans valeur connue.'],
 ['de','Dé truqué',[],'Il tombe toujours sur le six.'],['bague','Bague fendue',[],'Une initiale à l\'intérieur, presque illisible.'],
 ['carte','Carte à jouer',[],'Un as de pique, annoté au dos.'],['ticket','Ticket de vestiaire',[],'Numéro 37. Personne n\'est venu le réclamer.'],
 ['medaille','Médaille',[],'Remise pour un acte de bravoure oublié.'],['plume','Plume d\'oie',[],'Elle a beaucoup écrit.'],
 ['bouton','Bouton de manchette',[],'Doré, et il a perdu son jumeau.'],['mouchoir','Mouchoir brodé',[],'Deux initiales et une trace de rouge.'],
 ['flacon','Flacon vide',[],'L\'étiquette a été arrachée.'],['musique','Boîte à musique',[],'Trois notes, puis elle se tait.']
];
const OBJ=Object.fromEntries(OBJETS.map(o=>[o[0],{id:o[0],nom:o[1],tags:o[2],desc:o[3]}]));
const ENIGMES={
 levier:{f:['commode','desk','trunk','cabinet','crate'],t:"C'est coincé, le bois a gonflé. Il faudrait faire levier.",ok:"Crac ! Ça cède."},
 fil:{f:['commode','chevet','desk','locker','trunk'],t:'Une toute petite serrure. Avec quelque chose de fin, je pourrais la crocheter.',ok:'Clic. La serrure lâche.'},
 optique:{f:['shelf','desk','cabinet','commode'],t:'Une inscription minuscule, illisible à l\'œil nu. Il me faudrait de quoi grossir.',ok:'Ah, je peux lire maintenant.'},
 chaleur:{f:['desk','shelf','commode','chevet'],t:'Une feuille blanche qui sent le citron. De l\'encre sympathique ? Il faudrait la chauffer.',ok:'Des lettres brunes apparaissent.'},
 lumiere:{f:['wardrobe','locker','cabinet','fireplace','shelf'],t:'Il fait trop noir là-dedans. Il me faut de la lumière.',ok:'Voilà, je vois le fond.'},
 electrique:{f:['pcdesk','desk','cabinet','commode'],t:'Un vieil appareil complètement mort. Il lui manque du courant.',ok:'Il se rallume en grésillant.'},
 aimant:{f:['sink','fireplace','cabinet','counter'],t:'Une pièce de métal est tombée tout au fond, hors de portée. Si je pouvais l\'attirer...',ok:'Elle remonte toute seule.'},
 coupe:{f:['trunk','crate','commode','desk'],t:'Un paquet ficelé très serré. Il faut couper ça.',ok:'La ficelle saute.'},
 colle:{f:['desk','chevet','shelf','commode'],t:'Un papier déchiré en morceaux. Il faudrait le recoller.',ok:'Les morceaux tiennent ensemble.'},
 mine:{f:['desk','commode','chevet'],t:'Un bloc-notes vierge, mais la feuille garde le creux d\'un texte. Il faudrait la noircir.',ok:'Le texte ressort en blanc.'}
};
const TAG_NOM={levier:'levier',fil:'crochet',optique:'loupe',chaleur:'chaleur',lumiere:'lumière',electrique:'courant',aimant:'aimant',coupe:'lame',colle:'colle',mine:'mine'};
// Chaque meuble à cachette se fouille de l'intérieur, selon sa nature
const MG_BY={engine:'moteur',shelf:'livres',wardrobe:'cintres',locker:'cintres',cabinet:'ecriture',commode:'crochet',chevet:'crochet',desk:'dechiree',pcdesk:'crochet',counter:'tatons',bar:'tatons',washer:'tatons',
  fridge:'memo',medic:'memo',vanity:'empreinte',sink:'tatons',trunk:'caisse',crate:'caisse',barrel:'caisse',fireplace:'poussiere',
  bed:'couches',sofa:'coussins',sofaB:'coussins',armchair:'coussins',armchairL:'coussins',armchairR:'coussins',armchairB:'coussins',clock:'horloge',plant:'pot',piano:'piano'};

// ——— Documents : modèles réutilisables, remplis selon l'enquête ———
const JOURS=['12 mars','3 avril','19 mai','7 juin','24 juillet','2 septembre','15 octobre','28 novembre'];
function makeDocs(c,r){
  const V=c.vName,set=c.set,date=()=>pick(r,JOURS),nomOf=i=>c.suspects[i].nom,out=[];
  c.suspects.forEach((su,i)=>out.push({k:su.dk,t:DOC_TITRES[su.dk],s:i,p:{v:V,n:su.nom,date:date(),m:(12+int(r,60))*1000,lieu:set.nom,mob:su.mobile||''}}));
  // Faits vrais : uniquement des déclarations de personnes qui disent la vérité
  const menteurs=c.tueurs;
  const sures=c.needed.filter(i=>i.t==='s'&&!menteurs.includes(i.s));
  range(c.n).forEach(s=>{if(!menteurs.includes(s))range(c.H).forEach(h=>sures.push({t:'s',s,h}))});
  const vus=new Set(),faits=[];
  sures.forEach(i=>{const k=i.s+'-'+i.h;if(!vus.has(k)&&!c.stmts[i.s][i.h].vic){vus.add(k);faits.push(i)}});
  const room=i=>set.rooms[c.stmts[i.s][i.h].room],avec=i=>c.stmts[i.s][i.h].with;
  const f1=faits[0],f2=faits[1],f3=faits[2];
  if(f1)out.push({k:'agenda',t:'Page d\'agenda',fact:f1,p:{n:c.suspects[f1.s].prenom,date:date(),h:HOURS[f1.h],room:room(f1).n,noms:avec(f1).map(i=>c.suspects[i].prenom)}});
  if(f2)out.push({k:'recu',t:'Note de service',fact:f2,p:{n:nomOf(f2.s),h:HOURS[f2.h],room:room(f2).n,lieu:set.nom,no:100+int(r,800),m:6+int(r,40)}});
  if(f3&&c.key!=='facile')out.push({k:'journal',t:'Page de journal',fact:f3,p:{v:V,date:date(),txt:`Ce soir, ${c.suspects[f3.s].prenom} était ${room(f3).d} à ${HOURS[f3.h]}, je l'ai noté comme tout le reste.`}});
  // Un seul papier d'ambiance par affaire, pour ne pas noyer les vrais indices
  const ambiance=pick(r,['telegramme','ordonnance','carte']);
  if(ambiance==='telegramme')  out.push({k:'telegramme',t:'Télégramme',p:{v:V,date:date(),txt:pick(r,['MEFIEZ VOUS STOP QUELQU UN ICI VOUS EN VEUT STOP DETRUISEZ CE MESSAGE STOP','AFFAIRE NON REGLEE STOP ARRIVE CE SOIR STOP NE PARLEZ A PERSONNE STOP'])}});
  if(ambiance==='ordonnance')out.push({k:'ordonnance',t:'Ordonnance',p:{n:nomOf(int(r,c.n)),date:date(),no:1000+int(r,8000),med:pick(r,['Somnifère léger, un comprimé au coucher.','Calmant, deux gouttes le soir.','Sirop pour la toux, trois fois par jour.'])}});
  if(ambiance==='carte')out.push({k:'carte',t:'Carte postale',p:{v:V,lieu:set.nom,txt:pick(r,["Tout va bien ici. N'oublie pas ce que tu m'as promis. Je reviendrai réclamer mon dû.","Il fait beau, mais je pense à notre dispute. Il faudra bien en reparler."])}});
  return out;
}
const DOC_TITRES={testament:'Testament',dette:'Reconnaissance de dette',renvoi:'Lettre de renvoi',chantage:'Lettre anonyme',brevet:'Brevet annoté',article:'Coupure de presse',contrat:'Contrat déchiré',
  agenda:'Page d\'agenda',recu:'Note de service',telegramme:'Télégramme',ordonnance:'Ordonnance',journal:'Page de journal',registre:'Registre des clés',autopsie:'Rapport d\'autopsie',carte:'Carte postale'};
const esch=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
// Ce que chaque voix ajoute dans les deux systèmes d'interrogatoire
const VOIX_PLUS=[
 {mort:"Personne... personne ne doit savoir. Je dirai que j'étais {alibi}.",rec:'Bon... je récapitule, attendez.',fin:'Voilà. Je crois. Je peux y aller ?',oui:'Euh, oui...',nul:"Non ! Enfin... non, je n'y étais pas.",per:"Non, non, je ne l'ai pas croisé."},
 {mort:"Je retourne à ma soirée. Si l'on me demande, j'étais {alibi}.",rec:'Soit. Écoutez bien, je ne le répéterai pas.',fin:'Satisfait ?',oui:'Effectivement.',nul:"Certainement pas. Je n'y ai pas mis les pieds.",per:"Je n'ai pas eu ce déplaisir ce soir-là."},
 {mort:"Allez, sans rancune ! Et si on me pose la question, j'étais {alibi}.",rec:'Ma soirée ? Facile, installez-vous !',fin:'Et voilà, une soirée bien remplie !',oui:'Ah oui, tout à fait !',nul:"Ah non, pas moi, je n'y suis pas allé !",per:'Non, pas vu, pas croisé !'},
 {mort:"C'est fait. J'étais {alibi}.",rec:'Résumé.',fin:"C'est tout.",oui:'Oui.',nul:'Non. Jamais.',per:'Non.'},
 {mort:"Pardonne-moi... Je dirai que j'étais {alibi}. Il le faut.",rec:'Je vais essayer... tout me paraît si loin déjà.',fin:'Je ne sais pas quoi vous dire de plus.',oui:"Oui... je m'en souviens.",nul:"Non, je n'y suis pas allé de la soirée.",per:"Non... je ne l'ai pas vu."},
 {mort:"Pas d'applaudissements ? Tant pis. Officiellement, j'étais {alibi}.",rec:"Vous tenez à l'histoire complète ? Quel privilège.",fin:'Fin du spectacle. Applaudissez.',oui:'Bravo, vous avez deviné.',nul:"Raté. Je n'y ai jamais mis les pieds.",per:'Raté, jamais croisé de la soirée.'}
];

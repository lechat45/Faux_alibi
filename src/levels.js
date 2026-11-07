// Les 10 lieux : 5 pièces chacun (cuisine, salon, salle de bain, chambre, pièce libre), soit 50 pièces.
// Chaque plan décrit l'architecture réelle : circulations, pièces et portes.
const NR=5;
// Aménagement : run = meubles collés le long du mur du haut, g = ensembles qui vont ensemble.
// Un ensemble est posé d'un bloc : si la place manque, il perd d'abord ses pièces de fin de liste.
const REPAS=[['table',1,1],['chair',1,0],['chair',3,0],['chairB',1,3],['chairB',3,3],['chairR',0,1],['chairL',4,1]];
const RONDE=[['rtable',1,1],['chairR',0,1],['chairL',3,1],['chair',1,0],['chairB',2,3]];
const FOYER=[['sofaB',2,3],['basse',2,1],['armchairR',0,1],['armchairL',6,1]];
const CANAPE=[['basse',0,0],['armchairR',-2,0],['armchairL',4,0]];
const LECTURE=[['lamp',1,0],['armchairL',0,0]];
const CAISSES=[['crate',0,0],['crate',1,0],['barrel',2,0],['crate',0,-1]];
const sous=(name,p,o={})=>({at:{sous:name},p,...o});
const coin=(at,p,o={})=>({at,p,...o});
const RECIPES={
  c_maison:{f:'damier',run:['fridge','counter','stove','sink','counter','cabinet'],g:[coin('C',REPAS),coin('BD',[['plant',0,0]])]},
  c_pro:{f:'lino',run:['fridge','stove','stove','sink','counter','cabinet'],g:[coin('C',[['labbench',0,0],['stool',1,1]]),coin('BD',CAISSES)]},
  c_office:{f:'lino',run:['fridge','counter','stove','sink','counter','cabinet'],g:[coin('C',RONDE),coin('BD',[['plant',0,0]])]},
  c_bord:{f:'metal',run:['fridge','stove','sink','cabinet'],g:[coin('C',REPAS),coin('BD',[['crate',0,0],['crate',1,0]])]},
  s_class:{f:'parquet',rug:'#7a2f35',centre:true,run:['shelf','fireplace','cabinet','clock'],g:[sous('fireplace',FOYER,{dy:1,rug:true}),coin('BG',[['plant',0,0]]),coin('BD',[['lamp',0,0]])]},
  s_moderne:{f:'tapis',centre:true,run:['cabinet','plant','sofa','clock','commode'],g:[sous('sofa',CANAPE,{dy:1,rug:true}),coin('BG',[['plant',0,0]]),coin('BD',[['lamp',0,0]])]},
  s_attente:{f:'lino',centre:true,run:['cabinet','clock','commode','plant'],g:[coin('G',[['chairR',0,0],['chairR',0,1],['chairR',0,2],['chairR',0,3]]),coin('D',[['chairL',0,0],['chairL',0,1],['chairL',0,2],['chairL',0,3]]),coin('C',[['rtable',0,0]]),coin('BD',[['plant',0,0]])]},
  s_artistes:{f:'scene',rug:'#3f2a5c',run:['cabinet','commode','bar'],g:[sous('bar',[['stool',0,0],['stool',2,0]]),coin('B',[['basse',0,0],['sofaB',0,2]],{rug:true}),coin('BG',[['lamp',0,0]]),coin('BD',[['mannequin',0,0]])]},
  s_grand:{f:'marbre',rug:'#8d6a23',centre:true,run:['shelf','fireplace','cabinet','clock'],g:[sous('fireplace',FOYER,{dy:1,rug:true}),coin('BG',[['piano',0,0],['stool',1,2]]),coin('BD',[['lamp',1,0],['globe',0,0]])]},
  b_marbre:{f:'marbre',run:['tub','sink','medic','toilet'],g:[coin('BG',[['stool',0,0]]),coin('BD',[['plant',0,0]])]},
  b_simple:{f:'lino',run:['shower','sink','medic','toilet','cabinet'],g:[coin('BG',[['stool',0,0]])]},
  b_collectif:{f:'lino',run:['sink','sink','medic','toilet','toilet','shower','locker'],g:[coin('B',[['stool',0,0],['stool',2,0]]),coin('BD',[['crate',0,0]])]},
  ch_hotel:{f:'tapis',centre:true,run:['wardrobe','chevet','bed','chevet','commode','vanity'],g:[sous('bed',[['trunk',0,0]]),sous('vanity',[['stool',0,0]]),coin('BD',LECTURE)]},
  ch_luxe:{f:'parquet',rug:'#3f2a5c',centre:true,run:['wardrobe','chevet','bed','chevet','fireplace','commode','vanity'],g:[sous('bed',[['trunk',0,0]],{rug:true}),sous('vanity',[['stool',0,0]]),coin('BG',LECTURE)]},
  ch_dortoir:{f:'metal',run:['bed','chevet','bed','chevet','bed','locker','locker','commode','wardrobe'],g:[sous('bed',[['trunk',0,0]],{tous:true})]},
  ch_clinique:{f:'lino',centre:true,run:['wardrobe','chevet','bed','chevet','medic','commode'],g:[sous('bed',[['chairL',2,-1]]),coin('BD',[['lamp',0,0]])]},
  ch_loge:{f:'parquet',rug:'#3f2a5c',run:['bed','chevet','vanity','vanity','wardrobe','commode'],g:[sous('vanity',[['stool',0,0]],{tous:true}),coin('BG',[['mannequin',0,0]]),coin('BD',[['trunk',0,0]])]},
  l_lingerie:{f:'lino',run:['washer','washer','sink','cabinet','wardrobe','locker'],g:[coin('C',[['table',0,0],['stool',1,2]]),coin('BD',[['trunk',0,0]]),coin('BG',[['mannequin',0,0],['crate',1,0],['crate',2,0]])]},
  l_biblio:{f:'parquet',rug:'#2e4a78',centre:true,run:['shelf','shelf','shelf','clock','shelf','shelf'],g:[coin('C',[['desk',0,1],['chair',1,0]],{rug:true}),coin('BG',[['lamp',0,0],['armchairR',1,0]]),coin('BD',[['globe',0,0]])]},
  l_veranda:{f:'terre',run:['planter','commode','planter','cabinet'],g:[coin('C',RONDE),coin('BG',[['plant',0,0]]),coin('BD',[['plant',0,0]]),coin('G',[['trunk',0,0]])]},
  l_fourgon:{f:'planche',run:['crate','crate','locker','cabinet','crate'],g:[coin('BG',[['trunk',0,0],['crate',2,0]]),coin('BD',CAISSES),coin('D',[['ropes',0,0]])]},
  l_openspace:{f:'tapis',run:['copier','cabinet','cabinet','commode'],g:[{at:'grille',n:6,p:[['pcdesk',0,0],['chairB',1,1]]},coin('BD',[['plant',0,0]])]},
  l_labo:{f:'lino',run:['labbench','cabinet','fridge','commode','rack'],g:[{at:'grille',n:2,p:[['labbench',0,0],['stool',1,1]]},coin('BD',[['tank',0,0]])]},
  l_scene:{f:'scene',run:['ropes','crate','locker','cabinet','ropes'],g:[coin('C',[['sofa',0,0],['basse',0,1]]),coin('B',[['spot',0,0],['spot',5,0],['spot',10,0]]),coin('G',[['mannequin',0,0]]),coin('D',[['trunk',0,0]])]},
  l_machines:{f:'metal',run:['rack','locker','cabinet','console'],g:[{at:'grille',n:2,p:[['engine',0,0]]},coin('BD',[['barrel',0,0],['crate',1,0]]),coin('BG',[['tank',0,0]])]},
  l_pharmacie:{f:'lino',run:['medic','medic','cabinet','cabinet','commode'],g:[coin('C',[['table',0,0],['stool',1,2]]),coin('BD',[['tank',0,0]])]},
  l_jeu:{f:'tapis',run:['cabinet','bar','clock'],g:[sous('bar',[['stool',0,0],['stool',2,0]]),{at:'grille',n:2,p:[['roulette',1,1],['stool',0,1],['stool',4,1],['stool',1,0],['stool',3,0],['stool',2,3]]},coin('BD',[['plant',0,0]])]}
};
// Ensembles des circulations
const CIRC={
  accueil:coin('C',[['bar',0,0],['stool',0,1],['stool',3,1]]),
  attente:coin('BG',[['sofaB',0,0],['plant',3,0]]),
  galerie:coin('B',[['plant',0,0],['armchairB',2,0],['armchairB',3,0],['plant',5,0]])
};
const lvl=(diff,nom,lieu,vr,roles,tint,floor,lamb,cw,ci,plan,rooms)=>({diff,nom,lieu,vr,roles,tint,floor,lamb,cw,ci,plan,
  rooms:rooms.map(([n,d,o,c,t,k,col],i)=>({n,d,o,c,t,k,tint:col,rect:plan.r[i]}))});
const LEVELS=[
 lvl('facile',"Hôtel des Cimes","à l'hôtel des Cimes, coupé du monde par une tempête de neige",['propriétaire des lieux','propriétaire des lieux'],
  ['guide de haute montagne','sommelier|sommelière','pianiste','notaire','réceptionniste','client fidèle|cliente fidèle','concierge'],'#3f5560','tapis','#6d4628',['lift','plant','commode','clock','plant','lamp'],[],
  {r:[[2,19,15,6],[22,3,12,7],[14,3,7,7],[2,3,11,7],[18,19,16,6]],c:[[2,13,37,3,'Couloir'],[35,5,4,11,'Couloir']],l:[[3,5],[3,2],[1,5],[0,5],[4,5]]},[
  ["Office d'étage","à l'office d'étage",'le couteau à pain','lame','cuisine','c_office','#a8a488'],
  ["Salon de l'étage","au salon de l'étage",'le presse-papiers en bronze','lourd','salon','s_class','#35543f'],
  ['Salle de bains 12','à la salle de bains de la 12','le rasoir coupe-chou','lame','bain','b_marbre','#5d8f92'],
  ['Chambre 12','à la chambre 12','le bougeoir en fer','lourd','chambre','ch_hotel','#6b3f58'],
  ['Lingerie','à la lingerie','la corde à linge','lien','libre','l_lingerie','#7a5a3c']]),
 lvl('facile',"Villa Mirabel","à la villa Mirabel, isolée par un orage",['maître de maison','maîtresse de maison'],
  ['jardinier|jardinière','cousin éloigné|cousine éloignée','médecin de famille','cuisinier|cuisinière','voisin|voisine','peintre','secrétaire'],'#5a4a3a','parquet','#6d4628',['plant','commode'],[],
  {r:[[26,12,10,8],[11,12,14,8],[24,3,7,6],[11,3,12,6],[11,23,14,5]],c:[[3,13,7,6,'Entrée']],l:[[5,1],[1,0],[1,3],[3,2],[1,4]]},[
  ['Cuisine','à la cuisine','le rouleau à pâtisserie','lourd','cuisine','c_maison','#a89878'],
  ['Salon','au salon','le tisonnier','lourd','salon','s_class','#6b3f58'],
  ['Salle de bains','à la salle de bains','la ceinture de peignoir','lien','bain','b_simple','#6e9a9a'],
  ['Chambre','à la chambre','le coupe-papier','lame','chambre','ch_luxe','#4a5a7a'],
  ['Véranda','à la véranda','le sécateur','lame','libre','l_veranda','#3f6b4a']]),
 lvl('facile',"Nocturne 704","à bord du Nocturne 704, train de nuit bloqué par un éboulement",['directeur de la compagnie','directrice de la compagnie'],
  ['chef de train|cheffe de train','barman|barmaid','journaliste','diplomate','médecin','antiquaire','ingénieur des voies|ingénieure des voies'],'#5a2a35','tapis','#54331f',[],[],
  {r:[[2,4,11,6],[14,4,13,6],[41,4,6,6],[28,4,12,6],[48,4,10,6]],c:[],l:[[0,1],[1,3],[3,2],[2,4]]},[
  ['Cuisine de bord','à la cuisine de bord','le couteau à découper','lame','cuisine','c_bord','#8a7a68'],
  ['Wagon-salon','au wagon-salon','le shaker en acier','lourd','salon','s_moderne','#6b2632'],
  ['Cabinet de toilette','au cabinet de toilette','le cordon de store','lien','bain','b_simple','#6a7d82'],
  ['Voiture-lits','à la voiture-lits','la canne à pommeau','lourd','chambre','ch_hotel','#4a3457'],
  ['Fourgon','au fourgon à bagages','le cutter','lame','libre','l_fourgon','#5a4632']]),
 lvl('moyen',"Tour Horizon","à la tour Horizon, verrouillée par l'alarme de nuit",['directeur général','directrice générale'],
  ['comptable','avocat|avocate','responsable du personnel','stagiaire','gardien|gardienne','informaticien|informaticienne','assistant|assistante'],'#4a5a6a','marbre','#4a4f58',['lift','plant','plant'],['accueil','attente'],
  {r:[[15,3,9,7],[25,3,10,7],[5,13,9,6],[36,13,11,6],[15,22,20,7]],c:[[15,13,20,6,"Hall d'accueil"]],l:[[5,0],[5,1],[5,2],[5,3],[5,4]]},[
  ['Cafétéria','à la cafétéria','le couteau à fromage','lame','cuisine','c_office','#b5b09a'],
  ['Espace détente',"à l'espace détente",'le trophée en verre','lourd','salon','s_moderne','#254a6b'],
  ['Sanitaires','aux sanitaires','le câble de sèche-mains','lien','bain','b_collectif','#7a8d92'],
  ['Suite de direction','à la suite de direction','le coupe-papier en argent','lame','chambre','ch_luxe','#2f3f56'],
  ['Open space',"à l'open space",'le gros dévidoir en fonte','lourd','libre','l_openspace','#5f6a78']]),
 lvl('moyen',"Station Borée","à la station Borée, isolée par la nuit polaire",['chef de mission','cheffe de mission'],
  ['glaciologue','mécanicien|mécanicienne','médecin de bord','biologiste','opérateur radio|opératrice radio','cuisinier|cuisinière','météorologue'],'#4a5a6a','metal','#5f6a78',['lift','locker','rack','locker'],[],
  {r:[[2,3,11,6],[14,3,13,6],[28,3,10,6],[2,18,16,6],[19,18,19,6]],c:[[2,12,40,3,'Coursive'],[39,5,3,10,'Coursive']],l:[[0,5],[1,5],[2,5],[3,5],[4,5]]},[
  ['Cuisine','à la cuisine','le hachoir','lame','cuisine','c_bord','#8ea3a8'],
  ['Salon commun','au salon commun',"l'haltère",'lourd','salon','s_moderne','#3b5f86'],
  ['Sanitaires','aux sanitaires','le câble de chauffage','lien','bain','b_collectif','#6a8a92'],
  ['Dortoir','au dortoir','la clé à molette','lourd','chambre','ch_dortoir','#3f4a55'],
  ['Laboratoire','au laboratoire','le scalpel','lame','libre','l_labo','#b5c6c6']]),
 lvl('moyen',"Théâtre des Lilas","au théâtre des Lilas, fermé pour la dernière répétition",['metteur en scène','metteuse en scène'],
  ['comédien vedette|comédienne vedette','souffleur|souffleuse','costumier|costumière','régisseur|régisseuse','producteur|productrice','critique','machiniste'],'#33292e','scene','#54331f',['ropes','locker','crate','ropes'],[],
  {r:[[3,14,14,6],[18,20,12,6],[42,20,6,6],[31,20,10,6],[18,3,22,8]],c:[[18,14,23,3,'Coulisses']],l:[[4,5],[0,5],[1,5],[3,5],[3,2]]},[
  ['Buvette','à la buvette','le couteau à citron','lame','cuisine','c_office','#7a2230'],
  ['Foyer des artistes','au foyer des artistes','le chandelier','lourd','salon','s_artistes','#6d5a7a'],
  ["Salle d'eau","à la salle d'eau",'le câble de sèche-cheveux','lien','bain','b_simple','#6a7d82'],
  ['Loge de la vedette','à la loge de la vedette','les grands ciseaux','lame','chambre','ch_loge','#7d3347'],
  ['Scène','sur la scène','le marteau du décorateur','lourd','libre','l_scene','#262f3f']]),
 lvl('moyen',"Paquebot Aurélia","à bord de l'Aurélia, paquebot immobilisé en pleine mer",['capitaine','capitaine'],
  ['second du navire','steward|hôtesse','médecin de bord','passager fortuné|passagère fortunée','chef mécanicien|cheffe mécanicienne','pianiste de bord','commissaire de bord'],'#2f4656','planche','#5b3820',['lift','plant','clock','plant'],[],
  {r:[[3,18,19,6],[24,3,14,6],[16,3,7,6],[3,3,12,6],[23,18,19,6]],c:[[3,12,39,3,'Coursive'],[39,5,3,10,'Coursive']],l:[[3,5],[3,2],[1,5],[0,5],[4,5]]},[
  ['Cuisine de bord','à la cuisine de bord','le hachoir de chef','lame','cuisine','c_pro','#8a8a7a'],
  ['Grand salon','au grand salon','la bouteille de champagne','lourd','salon','s_grand','#254a6b'],
  ['Salle de bains','à la salle de bains','le cordon de peignoir','lien','bain','b_marbre','#5d8f92'],
  ['Cabine 14','à la cabine 14','le sextant de laiton','lourd','chambre','ch_hotel','#5a4632'],
  ['Salle des machines','à la salle des machines','le couteau de mécanicien','lame','libre','l_machines','#3f4a55']]),
 lvl('difficile',"Clinique des Tilleuls","à la clinique des Tilleuls, placée en quarantaine",['médecin-chef','médecin-chef'],
  ['infirmier|infirmière','patient|patiente','pharmacien|pharmacienne','chirurgien|chirurgienne','aide-soignant|aide-soignante','visiteur|visiteuse','anesthésiste'],'#9aa8a8','lino','#7a8a8a',['lift','plant'],[],
  {r:[[5,27,12,5],[22,3,13,9],[5,13,12,5],[5,3,12,7],[22,15,13,9]],c:[[18,3,3,21,'Couloir'],[5,21,16,3,'Couloir']],l:[[3,5],[3,2],[0,5],[1,5],[4,5]]},[
  ['Tisanerie','à la tisanerie',"le couteau d'office",'lame','cuisine','c_office','#b5c0a8'],
  ["Salle d'attente","à la salle d'attente",'le pied de perfusion','lourd','salon','s_attente','#7a9aa8'],
  ["Salle d'eau","à la salle d'eau",'le cordon d\'appel','lien','bain','b_simple','#8ea8a8'],
  ['Chambre 8','à la chambre 8','le scalpel oublié','lame','chambre','ch_clinique','#a8b5b5'],
  ['Pharmacie','à la pharmacie','le mortier en marbre','lourd','libre','l_pharmacie','#c0c8c0']]),
 lvl('difficile',"Château de Vauclair","au château de Vauclair, pont-levis bloqué par la crue",['comte','comtesse'],
  ['intendant|intendante','héritier|héritière','abbé|abbesse','généalogiste','garde-chasse','majordome','précepteur|préceptrice'],'#5a2a2a','tapis','#54331f',['clock','commode','plant','clock'],['galerie'],
  {r:[[3,3,14,8],[18,3,22,8],[17,21,8,7],[3,21,13,7],[26,21,14,7]],c:[[3,14,37,4,'Grande galerie']],l:[[0,5],[1,5],[3,5],[3,2],[4,5]]},[
  ['Cuisines','aux cuisines','le couperet','lame','cuisine','c_pro','#7a6a5a'],
  ['Grand salon','au grand salon',"le chandelier d'argent",'lourd','salon','s_grand','#7a2230'],
  ['Cabinet de toilette','au cabinet de toilette','le cordon de soie','lien','bain','b_marbre','#6a7d72'],
  ['Chambre du comte','à la chambre du comte','la dague de chasse','lame','chambre','ch_luxe','#3f2a5c'],
  ['Bibliothèque','à la bibliothèque','le buste de bronze','lourd','libre','l_biblio','#35543f']]),
 lvl('difficile',"Casino des Sables","au casino des Sables, fermé après une panne générale",['propriétaire du casino','propriétaire du casino'],
  ['croupier|croupière','joueur ruiné|joueuse ruinée','chanteur|chanteuse','physionomiste','chef de salle','banquier|banquière','chauffeur|chauffeuse'],'#6a2535','marbre','#54331f',['plant','lift','clock','plant'],['accueil','attente'],
  {r:[[5,13,12,8],[18,3,14,7],[31,24,7,6],[18,24,12,6],[33,13,16,8]],c:[[18,13,14,8,'Grand hall']],l:[[5,0],[5,1],[5,4],[5,3],[3,2]]},[
  ['Cuisine du restaurant','à la cuisine du restaurant','le couteau de chef','lame','cuisine','c_pro','#8a8a7a'],
  ['Salon privé','au salon privé','la statuette dorée','lourd','salon','s_class','#7a2230'],
  ['Salle de bains','à la salle de bains','le cordon de rideau','lien','bain','b_marbre','#5d8f92'],
  ['Suite','à la suite','le coupe-cigare','lame','chambre','ch_luxe','#4a3457'],
  ['Salle de jeu','à la salle de jeu','le râteau de croupier','lourd','libre','l_jeu','#2d5a3f']])
];
// Style de porte par lieu (par défaut, puis pour les chambres) 
const TAPIS_C=['#7a2f35',null,null,null,'#c8a040',null,'#2e4a78','#5a9a7a','#7a2230',null];
const SOLS_C=['parquet','parquet','tapis','marbre','metal','scene','planche','lino','marbre','marbre'];
const PORTES=[['bois','hotel'],['bois','bois'],['train','train'],['verre','verre'],['metal','metal'],['theatre','loge'],['metal','hotel'],['clinique','hotel'],['double','double'],['double','hotel']];
LEVELS.forEach((l,i)=>{l.porte=PORTES[i][0];l.portech=PORTES[i][1];l.runner=TAPIS_C[i];l.floor=SOLS_C[i]});

// Le niveau test : un couloir et six salles, hors de la liste des dix enquêtes
const NIVEAU_TEST=Object.assign(lvl('difficile','Couloir des interrogatoires','au couloir des interrogatoires',['directeur','directrice'],
  ['comptable','retraitée','libraire','chimiste','gardien de nuit','serveuse','notaire'],'#4a5a6a','tapis','#6d4628',['plant','clock','plant','commode','plant'],[],
  {r:[[2,3,11,7],[14,3,11,7],[26,3,11,7],[2,19,11,7],[14,19,11,7],[26,19,11,7]],c:[[2,13,35,3,'Couloir']],l:[[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]]},[
  ["Salle d'audience","à la salle d'audience",'le marteau de bois','lourd','salon','s_grand','#3a4a6a'],
  ['Salon de thé','au salon de thé','le couteau à gâteau','lame','salon','s_class','#6b3f58'],
  ['Bibliothèque','à la bibliothèque','le coupe-papier','lame','libre','l_biblio','#35543f'],
  ['Laboratoire','au laboratoire','le cordon électrique','lien','libre','l_labo','#5d8f92'],
  ['Salle des archives','à la salle des archives',"l'agrafeuse de fonte",'lourd','libre','l_openspace','#7a5a3c'],
  ['Atelier du dessinateur',"à l'atelier du dessinateur",'la cordelette','lien','libre','l_veranda','#8a6a3a']]),{porte:'bois',portech:'bois',runner:'#7a2f35',floor:'parquet'});
const LV=i=>i===10?NIVEAU_TEST:LEVELS[i];

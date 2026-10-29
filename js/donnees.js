const D=GAME_DATA.filter(l=>l.steps.length),$=s=>document.querySelector(s),KEY='conjuguonseco.v1';
const SITE='https://monsieurbeline.github.io/ConjuguonsEco-AFJ/';
const UNLOCK_ALL=false,RULE_AFTER_3=true,MAX=3,HINT_COST=3,QTIME=15,FREEZE_COST=20,FREEZE_MAX=2;
const COL={A1:['#3a9d1f','#a6e05a','castle'],A2:['#0e9f8e','#7ee3d3','leaf'],B1:['#2b8fd6','#8fd3f7','wave'],B2:['#8a5a2b','#e0b878','tree']};
D.forEach(l=>{[l.c1,l.c2,l.icon]=COL[l.id]});
const CATI=['info','leaf','paw','earth'],CAT=['Informations générales','Flore','Faune','Éco-citoyenneté'];
const RANKS=['Graine','Pousse','Têtard','Rainette','Gardien·ne de la forêt','Sentinelle','Maître·sse des verbes'];
const BADGES={first:['paw','Premier pas'],perfect:['star','Sans faute'],combo5:['flame','Combo x5'],streak3:['cal','3 jours de suite'],daily:['cal','Défi du jour'],quiz:['bolt','Verbes éclair'],lettres:['leaf','Chasseur de mots'],review:['book','Réviseur'],A1:['castle','Parcours A1'],A2:['leaf','Parcours A2'],B1:['wave','Parcours B1'],B2:['tree','Parcours B2'],share:['share','Ambassadeur'],album:['book','Album complet']};
const ROLES={tinet:{n:'Ti-Nèt',side:'l',col:'#43a51c',ic:'paw',img:'img/tinet-tete.webp'},sole:{n:'Grand-père Solé',side:'r',col:'#8a5a2b',ic:'paw',img:'img/char-sole.png'},explorateur:{n:'L’explorateur',side:'l',col:'#0e9f8e',ic:'user',img:'img/char-explorateur.png'},sargasse:{n:'Sargassum Fluitan',side:'r',col:'#b8860b',ic:'leaf',img:'img/char-sargasse.png'}};
const FX={'A1-1':{0:'tinet'},
'A2-2':{0:'explorateur',1:'explorateur',2:'explorateur',4:'explorateur',5:'explorateur',6:'explorateur',7:'explorateur',8:'explorateur',9:'explorateur',10:'explorateur',12:'info'},
'A2-3':{0:'info',1:'tinet',2:'sole',3:'tinet',4:'sole',5:'sole',6:'sole',7:'sole',8:'sole',9:'tinet',10:'tinet',11:'sole',12:'sole',13:'sole',14:'sole',15:'sole',16:'info'},
'B1-2':{0:'sargasse',1:'sargasse',2:'sargasse',3:'sargasse',4:'info',5:'info',6:'info'},
'B1-4':{1:'info',2:'info',4:'info'},
'B2-3':{0:'fiche',1:'narr',2:'cri',3:'tinet',4:'cri',5:'tinet',6:'info',7:'info'}};
const TIPS=['Haïti compte plus de 256 espèces d’oiseaux, dont 31 qu’on ne trouve qu’en Haïti et à Saint-Domingue.','Plus de 201 arbres sont endémiques d’Haïti : ils ne poussent nulle part ailleurs !','Le Parc National Historique – Citadelle, Sans Souci, Ramiers est au patrimoine mondial de l’UNESCO depuis 1982.','Le zagouti et le solénodon sont les deux mammifères terrestres endémiques d’Haïti.','La Forêt des Pins, au parc La Visite, couvre environ 14 000 ha : c’est la plus grande réserve de pins d’Haïti.','Konbit Plastik Haïti a collecté plus de 105 millions de bouteilles plastique en 5 ans.','Une plante endémique pousse seulement sur un territoire bien délimité.','Le pétrel diablotin est en danger d’extinction : il resterait moins de 2 000 individus dans le monde.'];
/* dictionnaire : [formes (regex), mot, définition] */
const GL=[
['endémiques?','Endémique','Une espèce endémique vit seulement dans une région précise, et nulle part ailleurs. Exemple : le solénodon est endémique de l’île d’Hispaniola.'],
['endémisme','Endémisme','Le fait d’avoir beaucoup d’espèces endémiques dans un même endroit.'],
['biodiversité|diversité biologique','Biodiversité','La variété de tous les êtres vivants (plantes, animaux…) dans un endroit.'],
['sous-espèces?','Sous-espèce','Un groupe à l’intérieur d’une espèce, avec quelques petites différences.'],
['espèces?','Espèce','Un groupe d’êtres vivants qui se ressemblent et qui peuvent avoir des petits ensemble.'],
['patrimoines?','Patrimoine','Ce qu’un pays reçoit de ses ancêtres et doit transmettre : monuments, nature, traditions.'],
['patrimoine mondial','Patrimoine mondial','Un site reconnu par l’UNESCO comme important pour toute l’humanité.'],
['UNESCO','UNESCO','L’organisation des Nations unies pour l’éducation, la science et la culture.'],
['citadelle','Citadelle','Une forteresse construite pour défendre une ville ou un pays.'],
['réserves?','Réserve','Un espace naturel où la nature est protégée et surveillée.'],
['bio?sph[eè]re','Biosphère','La partie de la Terre où la vie existe : la terre, les mers et l’air.'],
['écosystèmes?','Écosystème','Un milieu (forêt, mer…) avec tous les êtres vivants qui y vivent ensemble.'],
['aires? (?:marines? )?protégées?','Aire protégée','Un espace où la nature est protégée par des règles.'],
['flore','Flore','L’ensemble des plantes d’une région.'],['faune','Faune','L’ensemble des animaux d’une région.'],
['mangroves?','Mangrove','Une forêt d’arbres qui poussent dans l’eau salée, au bord de la mer. Elle protège la côte et abrite beaucoup d’animaux.'],
['coralliens?|coraux|corail','Corail','Un petit animal marin. Beaucoup de coraux ensemble forment un récif où vivent de nombreux poissons.'],
['récifs?','Récif','Une barrière de roches ou de coraux, sous la surface de la mer.'],
['sargasses?','Sargasse','Une algue brune qui flotte à la surface de la mer.'],
['algues?','Algue','Une plante sans racines qui vit dans l’eau.'],
['zooplanctons?','Zooplancton','De minuscules animaux qui flottent dans l’eau et servent de nourriture à d’autres animaux.'],
['extinction','Extinction','La disparition totale d’une espèce : il n’en reste plus aucun individu.'],
['menacée?s?|menaces?','Menacé / menace','Menacé : en danger de disparaître. Une menace : un danger.'],
['liste rouge','Liste rouge','La liste de l’UICN qui dit quelles espèces sont en danger.'],
['UICN','UICN','L’Union internationale pour la conservation de la nature.'],
['déforestation','Déforestation','La destruction des forêts, quand on coupe trop d’arbres.'],
['reboisement','Reboisement','Replanter des arbres là où la forêt a disparu.'],
['conservation|conserver','Conservation','Les actions pour garder la nature en bon état.'],
['préserver','Préserver','Protéger quelque chose pour qu’il ne soit pas abîmé ni détruit.'],
['conservatoire','Conservatoire','Un lieu qui protège et garde des plantes ou des animaux rares.'],
['durable','Durable','Qui dure longtemps. Le développement durable respecte la nature pour les générations futures.'],
['générations futures','Générations futures','Les personnes qui vivront après nous : nos enfants et petits-enfants.'],
['ressources?','Ressource','Ce que la nature nous donne et dont on a besoin : l’eau, le bois, le sol…'],
['hectares?','Hectare','Une unité pour mesurer un terrain : 1 hectare = 10 000 mètres carrés.'],
['superficie','Superficie','La taille d’une surface, d’un terrain.'],
['mammifères?','Mammifère','Un animal dont la femelle donne du lait à ses petits.'],
['arthropodes?','Arthropode','Un petit animal à pattes articulées et au corps couvert d’une carapace : insecte, araignée, crabe…'],
['insectes?','Insecte','Un petit animal à six pattes, comme la fourmi ou le papillon.'],
['habitats?','Habitat','Le lieu où un animal ou une plante vit naturellement.'],
['spécimens?','Spécimen','Un exemplaire d’une espèce.'],
['genévriers?','Genévrier','Un arbre de montagne dont les feuilles sont de petites aiguilles.'],
['pétrels?','Pétrel','Un oiseau de mer qui passe presque toute sa vie au large.'],
['diablotins?','Diablotin','Le nom d’un pétrel en danger. Le mot veut aussi dire « petit diable ».'],
['zagouti','Zagouti','Un gros rongeur (comme un grand rat) qui vit seulement sur l’île d’Hispaniola.'],
['sol[eé]nodon','Solénodon','Un petit mammifère de nuit, au long museau, qui mange surtout des insectes.'],
['Hispaniola','Hispaniola','L’île des Caraïbes partagée entre Haïti et la République dominicaine.'],
['orchidées?','Orchidée','Une plante à fleurs très belles et souvent rares.'],
['fougères?','Fougère','Une plante sans fleurs, aux grandes feuilles découpées.'],
['botanique','Botanique','La science qui étudie les plantes.'],
['sauvages?','Sauvage','Qui vit librement dans la nature.'],
['pollution','Pollution','Salir la nature avec des déchets ou des produits dangereux.'],
['déchets?','Déchet','Ce qu’on jette parce qu’on ne s’en sert plus.'],
['recyclage|recyclables?','Recyclage','Transformer de vieux objets pour en fabriquer de nouveaux.'],
['plastiques?','Plastique','Une matière fabriquée par l’homme, qui met très longtemps à disparaître dans la nature.'],
['gaspiller','Gaspiller','Utiliser trop, ou jeter ce qui pourrait encore servir.'],
['empreinte écologique|empreinte','Empreinte écologique','La trace de nos activités sur la nature : plus elle est grande, plus on abîme la planète.'],
['écocitoyens?','Écocitoyen','Une personne qui protège l’environnement par ses gestes de tous les jours.'],
['environnement','Environnement','Tout ce qui nous entoure : la nature, l’air, l’eau, les villes.'],
['réchauffement|climatiques?|climat','Climat','Le temps qu’il fait dans une région pendant de longues années. Le réchauffement climatique : la Terre devient plus chaude.'],
['climatisation','Climatisation','Une machine qui refroidit l’air d’une pièce.'],
['territoires?','Territoire','Un espace de terre qui appartient à un pays ou à une région.'],
['pêcheries?|pêcheurs?','Pêche','Pêcheur : personne qui attrape des poissons. Pêcherie : lieu ou activité de pêche.'],
['stagiaire','Stagiaire','Une personne qui fait un stage pour apprendre un métier.'],
['écologique','Écologique','Qui respecte la nature.']];
const GLRE=GL.map(e=>new RegExp('(^|[^A-Za-zÀ-ÿ])('+e[0]+')(?![A-Za-zÀ-ÿ])','gi'));
function dict(h){const m=[];GLRE.forEach((re,k)=>{re.lastIndex=0;let x;while(x=re.exec(h)){const a=x.index+x[1].length;m.push([a,a+x[2].length,k])}});
 m.sort((a,b)=>a[0]-b[0]||(b[1]-b[0])-(a[1]-a[0]));let o='',p=0;
 for(const[a,b,k]of m){if(a<p)continue;o+=h.slice(p,a)+`<span class="dw" role="button" tabindex="0" data-g="${k}" aria-label="Définition : ${GL[k][1]}" title="${GL[k][2].replace(/"/g,'&quot;')}">`+h.slice(a,b)+'</span>';p=b}
 return o+h.slice(p)}
/* rappels de conjugaison */
const LS={pres:['Le présent','On l’utilise pour ce qui est vrai maintenant ou toujours.','Verbes en -er : -e, -es, -e, -ons, -ez, -ent. Autres verbes : terminaisons variables (finir : je finis ; prendre : je prends).','Le zagouti vit dans la forêt. Nous protégeons les arbres.'],
imp:['L’imparfait','Pour décrire le passé : le décor, une habitude, une action qui dure.','Radical du « nous » au présent + -ais, -ais, -ait, -ions, -iez, -aient.','Autrefois, les forêts couvraient tout le pays.'],
pc:['Le passé composé','Une action terminée dans le passé.','Auxiliaire avoir ou être au présent + participe passé. Avec être, le participe s’accorde avec le sujet.','Les chercheurs ont découvert une plante. Elle est partie tôt.'],
pqp:['Le plus-que-parfait','Une action passée, avant une autre action passée.','Auxiliaire à l’imparfait + participe passé.','Quand je suis arrivé, l’oiseau avait disparu.'],
fut:['Le futur simple','Ce qui arrivera plus tard.','Infinitif + -ai, -as, -a, -ons, -ez, -ont. Irréguliers : être → je serai, avoir → j’aurai, aller → j’irai, faire → je ferai.','Demain, nous planterons des arbres.'],
fp:['Le futur proche','Ce qui va arriver bientôt.','Aller au présent + infinitif.','Je vais planter un arbre.'],
fa:['Le futur antérieur','Une action future, terminée avant une autre action future.','Auxiliaire au futur simple + participe passé.','Quand nous aurons planté mille arbres, la forêt repoussera.'],
cond:['Le conditionnel','Un souhait, une possibilité, un conseil. Souvent après « si + imparfait ».','Radical du futur + -ais, -ais, -ait, -ions, -iez, -aient. Passé : auxiliaire au conditionnel + participe passé.','Si on protégeait la mer, les coraux survivraient.'],
subj:['Le subjonctif','Après « il faut que », « pour que », « bien que », « avant que »…','Radical de « ils » au présent + -e, -es, -e, -ions, -iez, -ent.','Il faut que nous protégions la nature.'],
pass:['Le passif','Le sujet subit l’action.','Être (au temps voulu) + participe passé accordé avec le sujet.','Cette espèce est menacée. La forêt a été protégée.'],
imper:['L’impératif','Pour donner un ordre ou un conseil. On n’écrit pas le sujet.','Protège ! Protégeons ! Protégez ! Verbes en -er : pas de -s à « tu ».','Plante un arbre !'],
ps:['Le passé simple','Le temps des récits écrits.','« Il/elle » : -a, -it, -ut. « Ils/elles » : -èrent, -irent, -urent.','Le naturaliste découvrit une nouvelle plante.'],
part:['Le participe passé','On l’écrit après un auxiliaire (avoir ou être) ou dans une phrase au passif.','Verbes en -er : -é, -ée, -és, -ées. Autres verbes : -i, -u, -is, -it, -ert, -int… Avec être, il s’accorde avec le sujet.','Les chercheurs ont découvert une plante. Les espèces sont protégées.']};
function lessonKeys(t){t=t.toLowerCase().replace(/-/g,' ');const k=[];if(/présent/.test(t))k.push('pres');if(/imparfait/.test(t))k.push('imp');if(/passé composé/.test(t))k.push('pc');if(/plus que parfait/.test(t))k.push('pqp');if(/futur(?! antérieur)/.test(t))k.push('fut');if(/proche/.test(t))k.push('fp');if(/antérieur/.test(t))k.push('fa');if(/conditionnel/.test(t))k.push('cond');if(/subjonctif/.test(t))k.push('subj');if(/passi/.test(t))k.push('pass');if(/impératif/.test(t))k.push('imper');if(/passé simple/.test(t))k.push('ps');return k}
const lessonHtml=t=>lessonKeys(t).map(k=>{const[n,u,f,e]=LS[k];return `<details class="ls"><summary>${n}</summary><p><b>Quand ?</b> ${u}</p><p><b>Comment ?</b> ${f}</p><p><b>Exemple :</b> <i>${e}</i></p></details>`}).join('')||'<p>Aucun rappel pour cette étape.</p>';

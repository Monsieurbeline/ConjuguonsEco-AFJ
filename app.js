const D=GAME_DATA.filter(l=>l.steps.length),$=s=>document.querySelector(s),KEY='conjuguonseco.v1';
const UNLOCK_ALL=false,REVEAL_AFTER_3=true,MAX=3,HINT_COST=3,QTIME=15;
const COL={A1:['#3a9d1f','#a6e05a','castle'],A2:['#0e9f8e','#7ee3d3','leaf'],B1:['#2b8fd6','#8fd3f7','wave'],B2:['#8a5a2b','#e0b878','tree']};
D.forEach(l=>{[l.c1,l.c2,l.icon]=COL[l.id]});
const CATI=['info','leaf','paw','earth'],CAT=['Informations générales','Flore','Faune','Éco-citoyenneté'];
const RANKS=['Graine','Pousse','Têtard','Rainette','Gardien·ne de la forêt','Sentinelle','Maître·sse des verbes'];
const BADGES={first:['paw','Premier pas'],perfect:['star','Sans faute'],combo5:['flame','Combo x5'],streak3:['cal','3 jours de suite'],daily:['cal','Défi du jour'],quiz:['bolt','Verbes éclair'],lettres:['leaf','Chasseur de mots'],review:['book','Réviseur'],A1:['castle','Parcours A1'],A2:['leaf','Parcours A2'],B1:['wave','Parcours B1'],B2:['tree','Parcours B2']};
const ROLES={tinet:{n:'Ti-Nèt',side:'l',col:'#43a51c',ic:'paw',img:'img/tinet.png'},sole:{n:'Grand-père Solé',side:'r',col:'#8a5a2b',ic:'paw',img:'img/char-sole.png'},explorateur:{n:'L’explorateur',side:'l',col:'#0e9f8e',ic:'user',img:'img/char-explorateur.png'},sargasse:{n:'Sargassum Fluitan',side:'r',col:'#b8860b',ic:'leaf',img:'img/char-sargasse.png'}};
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
ps:['Le passé simple','Le temps des récits écrits.','« Il/elle » : -a, -it, -ut. « Ils/elles » : -èrent, -irent, -urent.','Le naturaliste découvrit une nouvelle plante.']};
function lessonKeys(t){t=t.toLowerCase().replace(/-/g,' ');const k=[];if(/présent/.test(t))k.push('pres');if(/imparfait/.test(t))k.push('imp');if(/passé composé/.test(t))k.push('pc');if(/plus que parfait/.test(t))k.push('pqp');if(/futur(?! antérieur)/.test(t))k.push('fut');if(/proche/.test(t))k.push('fp');if(/antérieur/.test(t))k.push('fa');if(/conditionnel/.test(t))k.push('cond');if(/subjonctif/.test(t))k.push('subj');if(/passi/.test(t))k.push('pass');if(/impératif/.test(t))k.push('imper');if(/passé simple/.test(t))k.push('ps');return k}
const lessonHtml=t=>lessonKeys(t).map(k=>{const[n,u,f,e]=LS[k];return `<details class="ls"><summary>${n}</summary><p><b>Quand ?</b> ${u}</p><p><b>Comment ?</b> ${f}</p><p><b>Exemple :</b> <i>${e}</i></p></details>`}).join('')||'<p>Aucun rappel pour cette étape.</p>';
/* état et réglages */
const DEF={music:true,sfx:true,fs:1,dys:false,hc:false,rm:false,nt:false};
let S={done:{},photo:null,xp:0,coins:0,streak:0,last:'',badges:[],daily:{},days:{},td:null,verbs:0,err:{},qbest:0,set:{}};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
S.set=Object.assign({},DEF,S.set);if(S.mute){S.set.sfx=S.set.music=false;delete S.mute}S.err=S.err||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
function applySet(){const r=document.documentElement,t=S.set;r.style.setProperty('--fs',[.92,1,1.22][t.fs]);r.classList.toggle('dys',t.dys);r.classList.toggle('hc',t.hc);r.classList.toggle('rm',t.rm)}
const ic=(n,c='')=>`<svg class="ic ${c}" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const norm=t=>t.toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ').replace(/[.!,;:]+$/,'').trim();
const strip=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const lvlOf=x=>1+Math.floor(Math.sqrt(x/40)),today=(d=new Date())=>d.toLocaleDateString('sv');
const rich=t=>esc(t).replace(/⟦(.*?)⟧/g,'<b>$1</b>');
const star=k=>S.done[k]?S.done[k].st||0:0;
const stars=n=>`<div class="stars" role="img" aria-label="${n} étoile${n>1?'s':''} sur 3">${[0,1,2].map(i=>`<svg class="ic ${i<n?'on':''}" aria-hidden="true" style="animation-delay:${i*.2}s"><use href="#i-star"/></svg>`).join('')}</div>`;
/* audio : effets, ambiance, voix */
let AC;const ac=()=>{try{AC=AC||new(window.AudioContext||webkitAudioContext)();if(AC.state=='suspended')AC.resume()}catch(e){}return AC};
function tone(f,d=.12,t=0,ty='sine'){if(!S.set.sfx)return;try{const c=ac(),o=c.createOscillator(),g=c.createGain(),n=c.currentTime+t;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.14,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+d)}catch(e){}}
const sfx={ok:()=>{tone(660);tone(880,.15,.09)},ko:()=>tone(190,.28,0,'sawtooth'),rv:()=>tone(330,.22),win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.2,i*.12))};
const AU=new Audio('audio/ambiance.mp3');AU.loop=true;AU.volume=.45;AU.preload='auto';AU.addEventListener('canplaythrough',()=>{AU.ok=true},{once:true});
const Amb={on:false,T:[],start(){if(!S.set.music||this.on)return;if(AU.ok){this.on=true;this.file=true;AU.play().catch(()=>{});return}const c=ac();if(!c)return;this.on=true;
  const m=this.m=c.createGain();m.gain.setValueAtTime(0,c.currentTime);m.gain.linearRampToValueAtTime(.55,c.currentTime+2.5);m.connect(c.destination);
  const b=c.createBuffer(1,c.sampleRate*3,c.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.2}
  const n=this.n=c.createBufferSource();n.buffer=b;n.loop=true;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=520;const g=c.createGain();g.gain.value=.5;n.connect(f);f.connect(g);g.connect(m);n.start();
  this.pad=[130.8,196].map(fr=>{const o=c.createOscillator(),pg=c.createGain();o.frequency.value=fr;pg.gain.value=.035;o.connect(pg);pg.connect(m);o.start();return o});
  const sc=[523,587,659,784,880,784,659,587];let i=0;
  this.T.push(setInterval(()=>{if(Math.random()<.5){const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type='triangle';o.frequency.value=sc[i%8]*(Math.random()<.2?.5:1);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.001,t+1);o.connect(g);g.connect(m);o.start(t);o.stop(t+1)}i+=Math.random()<.6?1:2},520));
  const chirp=()=>{if(!this.on)return;const t0=c.currentTime,k=1+Math.floor(Math.random()*3),base=2000+Math.random()*1500;for(let j=0;j<k;j++){const o=c.createOscillator(),g=c.createGain(),t=t0+j*.16;o.frequency.setValueAtTime(base,t);o.frequency.exponentialRampToValueAtTime(base*1.35,t+.09);o.frequency.exponentialRampToValueAtTime(base*1.1,t+.14);g.gain.setValueAtTime(.025,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g);g.connect(m);o.start(t);o.stop(t+.16)}this.T.push(setTimeout(chirp,2500+Math.random()*5000))};this.T.push(setTimeout(chirp,1500))},
 stop(){if(!this.on)return;this.on=false;if(this.file){this.file=false;AU.pause();return}this.T.forEach(t=>{clearInterval(t);clearTimeout(t)});this.T=[];const c=AC,m=this.m,n=this.n,p=this.pad;try{m.gain.cancelScheduledValues(c.currentTime);m.gain.linearRampToValueAtTime(0,c.currentTime+.4);setTimeout(()=>{try{n.stop();p.forEach(o=>o.stop());m.disconnect()}catch(e){}},500)}catch(e){}}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)Amb.stop();else if(S.set.music&&started)Amb.start()});
let started=false;const unlockAudio=()=>{if(started)return;started=true;ac();Amb.start()};['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,unlockAudio));
function speak(t){if(!('speechSynthesis' in window)){toast('La lecture audio n’est pas disponible sur cet appareil.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.rate=.9;speechSynthesis.speak(u)}
function burst(n=26){if(S.set.rm)return;const C=['#43a51c','#a6e05a','#f47b20','#ffc928','#5bb8e6'];for(let i=0;i<n;i++){const e=document.createElement('i');e.className='cf';e.setAttribute('aria-hidden','true');e.innerHTML=ic(i%3?'leaf':'star');e.style.cssText=`left:${innerWidth/2}px;top:${innerHeight*.55}px;color:${C[i%5]};--dx:${(Math.random()-.5)*340}px;--dy:${-90-Math.random()*240}px`;document.body.appendChild(e);setTimeout(()=>e.remove(),1200)}}
let tt;function toast(m){const t=$('#toast');t.innerHTML=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2800)}
function award(id){if(S.badges.includes(id))return;S.badges.push(id);save();setTimeout(()=>{toast(ic(BADGES[id][0])+' Badge : '+BADGES[id][1]);sfx.win()},600)}
function touchStreak(){const t=today();S.days=S.days||{};S.days[t]=1;if(S.last===t)return;const y=new Date();y.setDate(y.getDate()-1);S.streak=S.last===today(y)?S.streak+1:1;S.last=t;if(S.streak>=3)award('streak3')}
/* mascotte */
const MIMG={idle:'img/tinet.png',ok:'img/tinet-ok.png',win:'img/tinet-ok.png',cheer:'img/tinet-cheer.png',ko:'img/tinet.png',sad:'img/tinet.png',think:'img/tinet.png'};
const MLAB={idle:'Ti-Nèt sourit',ok:'Ti-Nèt lève le pouce',win:'Ti-Nèt lève le pouce, ravi',cheer:'Ti-Nèt applaudit',ko:'Ti-Nèt est gêné',sad:'Ti-Nèt est triste',think:'Ti-Nèt réfléchit'};
const spk=st=>`<svg class="ov tw" aria-hidden="true" viewBox="0 0 24 24" style="${st};color:#ffc928"><use href="#i-star"/></svg>`;
const DROP='<path d="M12 2s-7 8-7 13a7 7 0 0014 0c0-5-7-13-7-13z" fill="#6ccdf2" stroke="#2b8fd6" stroke-width="1.5"/>';
function ovl(m){
 if(m=='ko')return `<svg class="ov dr" aria-hidden="true" viewBox="0 0 24 24" style="right:4%;top:12%;width:24%">${DROP}</svg>`;
 if(m=='sad')return `<svg class="ov" aria-hidden="true" viewBox="0 0 48 28" style="left:-4%;top:-18%;width:62%"><path d="M12 22a8 8 0 010-16 10 10 0 0119-2 8 8 0 011 18z" fill="#9fb3c4" stroke="#5f7386" stroke-width="1.5"/></svg><svg class="ov dr" aria-hidden="true" viewBox="0 0 24 24" style="left:8%;top:22%;width:14%">${DROP}</svg><svg class="ov dr" aria-hidden="true" style="animation-delay:.4s;left:24%;top:24%;width:12%" viewBox="0 0 24 24">${DROP}</svg>`;
 if(m=='think')return '<span class="ov qm" aria-hidden="true">?</span>';
 if(m=='ok'||m=='cheer'||m=='win')return spk('left:0;top:8%;width:20%')+spk('right:2%;top:2%;width:26%;animation-delay:.3s')+spk('right:-2%;top:46%;width:16%;animation-delay:.6s');return''}
const mascot=(m='idle',px=100)=>`<div class="mas ${m}" role="img" aria-label="${MLAB[m]}" style="--s:${px}px"><img src="${MIMG[m]}" alt="">${ovl(m)}</div>`;
let mt;function setMas(m,ms=1800){const t=$('#tn');if(!t)return;t.className='mas '+m;t.setAttribute('aria-label',MLAB[m]);t.innerHTML=`<img src="${MIMG[m]}" alt="">`+ovl(m);clearTimeout(mt);if(m!='idle')mt=setTimeout(()=>setMas('idle',0),ms)}
/* objectifs */
function td(){const t=today();if(!S.td||S.td.d!==t)S.td={d:t,v:0,c:0,cl:{}};return S.td}
const quests=()=>{const t=td();return[{id:'v',t:'Réussis 10 verbes',v:Math.min(t.v,10),max:10,r:5},{id:'c',t:'Fais un combo de 3',v:t.c?1:0,max:1,r:5},{id:'d',t:'Relève le défi du jour',v:S.daily[today()]?1:0,max:1,r:10}]};
function claimQuests(){const t=td();quests().forEach(q=>{if(q.v>=q.max&&!t.cl[q.id]){t.cl[q.id]=1;S.coins+=q.r;setTimeout(()=>toast(ic('coin')+' Objectif atteint : +'+q.r),1400)}})}
function nextStep(){for(let i=S.start||0;i<D.length;i++){if(!lvlOpen(i))continue;for(let k=0;k<D[i].steps.length;k++)if(!S.done[D[i].id+'-'+k]&&(k==0||S.done[D[i].id+'-'+(k-1)]))return[i,k]}return null}
function preload(on){const A=['img/logo.png','img/tinet.png','img/tinet-ok.png','img/tinet-cheer.png','img/logo-afj.jpg','img/logo-oif.jpg','img/banniere.jpg',...D.map(l=>`img/bg-${l.id}.jpg`)];let n=0;A.forEach(u=>{const i=new Image();i.onload=i.onerror=()=>on(++n/A.length);i.src=u})}
/* feuille (dictionnaire, rappels) */
let lastF;function sheet(title,html,cls=''){const s=$('#sheet');lastF=document.activeElement;s.innerHTML=`<div class="sh ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><button class="rb x" id="sx" aria-label="Fermer">${ic('x')}</button>${html}</div>`;s.hidden=false;$('#sx').focus();$('#sx').onclick=closeSheet}
function closeSheet(){$('#sheet').hidden=true;$('#sheet').innerHTML='';if('speechSynthesis' in window)speechSynthesis.cancel();if(lastF&&lastF.focus&&document.contains(lastF)&&lastF.id!=='ans')lastF.focus({preventScroll:true})}
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#sheet').hidden)closeSheet();
 if(e.key==='Tab'&&!$('#sheet').hidden){const f=[...$('#sheet').querySelectorAll('button,summary,[tabindex="0"]')];if(!f.length)return;const i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}
 if((e.key==='Enter'||e.key===' ')&&e.target.classList&&(e.target.classList.contains('dw')||e.target.id==='hav')){e.preventDefault();e.target.click()}});
document.addEventListener('click',e=>{const w=e.target.closest&&e.target.closest('.dw');if(w){const k=+w.dataset.g;sheet(GL[k][1],`<h2 class="dh">${ic('book')} ${GL[k][1]}</h2><p>${GL[k][2]}</p><button class="btn w" id="sp">${ic('snd')}Écouter</button>`);$('#sp').onclick=()=>speak(GL[k][1]+'. '+GL[k][2])}});
function openLessons(t){sheet('Rappel de conjugaison',`<h2 class="dh">${ic('book')} Rappel de conjugaison</h2>${lessonHtml(t)}`)}
/* à propos */
function aboutModal(){sheet('À propos de ConjuguonsEco',`<img class="ab-img" src="img/banniere.jpg" alt="Illustration de Conjuguons Eco : Ti-Nèt, un mammifère à long museau, un oiseau, un escargot et la Citadelle en arrière-plan">
<h2 class="dh">À propos</h2>
<p>Ce jeu de conjugaison des verbes français a été réalisé dans le cadre du projet <b>Sentinelles Alerte Sargasses</b>, porté par l’Alliance Française de Jacmel entre 2021 et 2023.</p>
<p>Le projet s’inscrit au 3ème appel à initiatives de l’OIF (Organisation Internationale de la Francophonie) pour la société civile francophone engagée pour les ODD et vise à développer des attitudes responsables vis-à-vis de l’environnement en général, et face aux échouages des algues sargasses en particulier.</p>
<div class="partners lg"><figure><img src="img/logo-afj.jpg" alt="Alliance Française de Jacmel"><figcaption>Projet porté par l’Alliance Française de Jacmel</figcaption></figure><figure><img src="img/logo-oif.jpg" alt="Organisation Internationale de la Francophonie"><figcaption>3ème appel à initiatives de l’OIF</figcaption></figure></div>
<p>L’association Action pour un Développement Durable, les étudiants finissants de l’Université Publique du Sud’Est à Jacmel et quatre communautés scolaires du Sud’Est ont pris part à la mise en œuvre du projet.</p>
<p class="ab-q">« Conjuguons Eco » vous invite à réviser vos conjugaisons en français tout en vous faisant découvrir l’écocitoyenneté, le patrimoine et la biodiversité haïtiens.</p>
<h3 class="h3">L’équipe</h3>
<dl class="team"><dt>Conception et développement</dt><dd>Tégaud BELINE</dd><dt>Illustration</dt><dd>Chevelin PIERRE</dd><dt>Conseil scientifique</dt><dd>Lens Jerry SAINT-LOUIS</dd><dt>Textes</dt><dd>Alliance Française de Jacmel (AFJ)</dd><dt>Musique</dt><dd>Anthenor P. Normal BELLEVUE</dd></dl>
<p><b>Remerciements spéciaux</b> au Conseil d’Administration de l’Alliance Française de Jacmel, à l’Ecole Episcopale St Dominique de Marigot, l’école ICOSA de Cyvadier, La Dignité de Pétavy Cayes-Jacmel et le Lycée National Jacques Thélismond de Raymond Cayes-Jacmel.</p>
<p class="small">Le jeu suit la progression de la méthode <i>Édito</i> (niveaux A1 à B2).</p>`,'wide')}
/* en-tête, navigation */
function chips(){const l=lvlOf(S.xp);$('#chips').innerHTML=`<span class="chip" aria-label="Série : ${S.streak} jours">${ic('flame','fl')}${S.streak}</span><span class="chip" aria-label="${S.coins} pièces">${ic('coin','cn')}${S.coins}</span><span class="chip" aria-label="Niveau ${l}">${ic('star','st')}Niv. ${l}</span>`;$('#hav').classList.toggle('dot',!S.daily[today()]);$('#hav').innerHTML=S.photo?`<img src="${S.photo}" alt="">`:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="13" r="6" fill="#92400e" opacity=".55"/><path d="M4 32c0-8 6-11 12-11s12 3 12 11z" fill="#92400e" opacity=".55"/></svg>';$('#snd').innerHTML=ic(S.set.music?'snd':'mute');$('#snd').setAttribute('aria-label',S.set.music?'Couper la musique d’ambiance':'Activer la musique d’ambiance');$('#snd').setAttribute('aria-pressed',S.set.music)}
function theme(l){const r=document.documentElement.style;r.setProperty('--c1',l?l.c1:'#43a51c');r.setProperty('--c2',l?l.c2:'#a6e05a')}
let nav=[],Q=null;
const BGM={level:'map',intro:'map',home:'map',welcome:'map',dailyScreen:'dawn',train:'forest',quizRun:'forest',quizEnd:'forest',carnet:'forest',reader:'forest',prof:'camp',play:'calm',splash:'map'};
function setBg(n,a){let lv=D[S.start||0].id;if(n=='level'||n=='intro')lv=D[a[0]].id;else if(n=='home'){const nx=nextStep();lv=D[nx?nx[0]:0].id}else if(n=='play'&&a[0]&&a[0].mode=='step')lv=D[a[0].i].id;$('#bgl').className='bgl '+(BGM[n]||'map')+' '+lv}
const TOP=['home','dailyScreen','train','prof'],NOTABS=['play','splash','quizRun','lettresRun','welcome'];
const jouer=()=>{const nx=nextStep();show(level,nx?nx[0]:D.length-1)};
function show(fn,...a){nav.push([fn,a]);run()}
function run(){const[fn,a]=nav[nav.length-1];if(Q)clearTimeout(Q.t);if(LW){clearTimeout(LW.t);LW.on=false}if('speechSynthesis' in window)speechSynthesis.cancel();$('#bar').hidden=true;$('#hd').hidden=false;chips();window.scrollTo(0,0);document.body.dataset.bg={level:'map',intro:'map',dailyScreen:'daily',train:'train',carnet:'train',lettresRun:'train',lettresEnd:'train',prof:'prof'}[fn.name]||'none';const wd=['home','level','train'].includes(fn.name);$('#main').className=wd?'wide':'';$('#app').className=wd?'w':'';fn(...a);
 const t={home:'menu',level:'home',intro:'home',dailyScreen:'daily',train:'train',quizRun:'train',quizEnd:'train',lettresRun:'train',lettresEnd:'train',carnet:'train',reader:'train',prof:'prof'}[fn.name];const big=matchMedia('(min-width:900px)').matches;$('#tabs').hidden=['splash','welcome'].includes(fn.name)||(!big&&NOTABS.includes(fn.name));document.body.classList.toggle('side',!$('#tabs').hidden);
 setBg(fn.name,a);document.querySelectorAll('#tabs button').forEach(b=>{const on=b.dataset.t===t;b.classList.toggle('on',on);on?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});
 $('#back').hidden=nav.length<2||TOP.includes(fn.name);if(!NOTABS.includes(fn.name))$('#main').focus({preventScroll:true})}
$('#back').onclick=()=>{nav.pop();run()};
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{nav=[];const k=b.dataset.t;k=='home'?jouer():show({daily:dailyScreen,train,prof}[k])});
$('#snd').onclick=()=>{S.set.music=!S.set.music;save();S.set.music?Amb.start():Amb.stop();chips()};$('#hav').onclick=()=>{nav=[];show(home)};
$('#file').onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=160;const s=Math.min(im.width,im.height);c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,160,160);S.photo=c.toDataURL('image/jpeg',.8);save();chips()};im.src=URL.createObjectURL(f)};
/* mise en forme des textes */
function face(k){const R=ROLES[k];return `<span class="face ${k}" aria-hidden="true" style="--fc:${R.col}">${ic(R.ic)}<img src="${R.img}" alt="" onerror="this.remove()"></span>`}
function roleOf(key,pi,t){const f=(FX[key]||{})[pi];if(f)return f;const p=t.replace(/[⟦⟧]/g,'').replace(/\u00a0/g,' ').trim(),nb=!/\{\{/.test(t);
 if(nb&&/indicatif|subjonctif|conditionnel/.test(p)&&p.length<120)return'tag';
 if(nb&&p.length<90&&/[:?]$/.test(p)&&!/\. /.test(p))return'q';
 if(/^⟦[^⟧]{2,45}⟧[\s\u00a0]*:/.test(t))return'def';
 if(/^\d{4}(\s*[–-]\s*\d{4})?[\s\u00a0]*:/.test(t))return'hist';return''}
function wrap(role,h,old){const R=ROLES[role],c=old?' old':'';
 if(R)return `<div class="say ${R.side}${c}" style="--fc:${R.col}">${face(role)}<div class="bb"><div class="who">${R.n}</div><p>${h}</p></div></div>`;
 switch(role){
  case'info':return `<div class="info${c}"><div class="lab">${ic('bulb')}À savoir</div><p>${h}</p></div>`;
  case'fiche':return `<div class="fiche${c}"><div class="lab">${ic('paw')}Fiche d’identité</div><p>${h}</p></div>`;
  case'def':return `<div class="def${c}"><p>${h}</p></div>`;
  case'cry':return `<div class="cry${c}">${ic('snd')}${h}</div>`;
  case'narr':return `<div class="narr${c}">${h}</div>`;
  case'tag':return `<div class="tag${c}">${ic('info')}${h.replace(/<\/?b>/g,'')}</div>`;
  case'q':return `<h3 class="qh${c}">${ic('leaf')}<span>${h.replace(/<\/?b>/g,'')}</span></h3>`;
  case'hist':{const m=h.match(/^(\d{4}(?:\s*[–-]\s*\d{4})?)[\s\u00a0]*:[\s\u00a0]*([\s\S]*)$/);return m?`<div class="hist${c}"><span class="yr">${m[1]}</span><p style="margin:0">${m[2]}</p></div>`:`<p class="${c}">${h}</p>`}}
 return `<p class="${old?'old':''}">${h}</p>`}
/* écrans */
function splash(){theme();$('#hd').hidden=true;const fast=!!S.seen;
 $('#main').innerHTML=`<div class="title"><h1 class="sr">ConjuguonsEco</h1><div class="t-top"><img src="img/banniere.jpg" alt="Conjuguons Eco : Ti-Nèt et les animaux d’Haïti devant la Citadelle"><button class="rb ib" id="ab" aria-label="À propos du projet">${ic('info')}</button></div>
 <div class="t-low"><svg class="ic fo f1" aria-hidden="true"><use href="#i-leaf"/></svg><svg class="ic fo f2" aria-hidden="true"><use href="#i-leaf"/></svg><svg class="ic fo f3" aria-hidden="true"><use href="#i-leaf"/></svg>
 <div id="sm" class="sm">${mascot('idle',160)}</div>
 <div class="lbar"><div class="prog bigp" role="progressbar" aria-label="Chargement" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="pb"><i id="lb" style="width:0"></i></div><div class="lp" id="lp" role="status">Chargement… 0 %</div></div>
 <div class="tipx" id="tp" aria-hidden="true"></div>
 <div class="partners mini" role="group" aria-label="Partenaires du projet"><img src="img/logo-afj.jpg" alt="Alliance Française de Jacmel"><img src="img/logo-oif.jpg" alt="Organisation Internationale de la Francophonie"></div></div></div>`;
 $('#ab').onclick=aboutModal;
 let real=0,shown=0,gone=false;const tip=()=>{$('#tp').textContent=pick(TIPS)};tip();const ti=setInterval(tip,3200);preload(r=>real=r*100);
 const go=()=>{if(gone)return;gone=true;clearInterval(iv);clearInterval(ti);nav=[];S.seen?jouer():show(welcome)};
 const iv=setInterval(()=>{shown=Math.min(real,shown+(fast?9:2.2));$('#lb').style.width=shown+'%';$('#pb').setAttribute('aria-valuenow',Math.round(shown));
  if(shown<100){$('#lp').textContent='Chargement… '+Math.round(shown)+' %';return}
  clearInterval(iv);$('#lp').textContent='Prêt !';$('#sm').innerHTML=mascot('cheer',160);const w=setInterval(()=>{if($('#sheet').hidden){clearInterval(w);setTimeout(go,fast?250:650)}},150)},40);
 $('.title').addEventListener('click',e=>{if(!e.target.closest('#ab'))go()})}
const WELCOME=[['A1','Je débute','Je comprends quelques mots et phrases simples.'],['A2','Je me débrouille','Je peux parler de sujets du quotidien.'],['B1','Je suis à l’aise','Je comprends l’essentiel et je m’exprime assez bien.'],['B2','Je suis avancé(e)','Je lis des textes complexes et je m’exprime avec aisance.']];
function welcome(){theme();$('#hd').hidden=true;
 $('#main').innerHTML=`<div class="hero">${mascot('ok',110)}<div class="bub"><b>Bienvenue !</b> Je suis Ti-Nèt. Quel est ton niveau de français ?</div></div><div class="wgrid" role="group" aria-label="Choisis ton niveau">`+
 WELCOME.map(([id,t,d],i)=>{const l=D[i];return `<button class="lvl wl" data-i="${i}" style="${bgStyle(l)}"><span class="bdg">${ic(l.icon)}</span><span style="flex:1"><b class="ttl">${id} · ${t}</b><small>${d}</small></span></button>`}).join('')+`</div><p class="small" style="text-align:center">Tu pourras changer de niveau à tout moment.</p>`;
 document.querySelectorAll('.wl').forEach(b=>b.onclick=()=>{S.start=+b.dataset.i;S.seen=true;save();tone(523);nav=[];show(level,S.start)})}
function bgStyle(l){return `background:linear-gradient(rgba(0,0,0,.04),rgba(0,0,0,.38)),url(img/bg-${l.id}.jpg) center/cover,linear-gradient(135deg,${l.c1},${l.c2})`}
function lvlDone(i){return D[i].steps.every((_,k)=>S.done[D[i].id+'-'+k])}
function lvlOpen(i){return UNLOCK_ALL||i<=(S.start||0)||lvlDone(i-1)}
function home(){theme();const l=lvlOf(S.xp),a=40*(l-1)**2,b=40*l*l,dd=S.daily[today()],nx=nextStep(),done=Object.keys(S.done).length;
 const msg=!done?'Bienvenue ! Je suis Ti-Nèt, ton guide. On commence l’aventure ?':S.streak>=2?`Déjà ${S.streak} jours de suite : bravo !`:!dd?'Le défi du jour t’attend !':pick(['Kenbe la ! Un verbe après l’autre.','La forêt a besoin de toi !','Prêt(e) à conjuguer avec moi ?']);
 const wk=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return[d,today(d)]});
 $('#main').innerHTML=`<h1 class="sr">ConjuguonsEco : accueil</h1><div class="hgrid"><div class="hc"><div class="scene"><div class="sun"></div><svg class="ic lf" aria-hidden="true" style="left:-12px;bottom:20px"><use href="#i-leaf"/></svg><svg class="hills" aria-hidden="true" viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 60C60 20 120 35 200 62s150 25 200-15v73H0z" fill="#8fd94a"/><path d="M0 92C80 55 160 85 240 78s110-15 160 8v34H0z" fill="#43a51c"/></svg><div class="bub2">${msg}</div>${mascot(!done?'ok':dd?'ok':'idle',150)}</div>
 <div class="card pl"><div class="av2">${S.photo?`<img src="${S.photo}" alt="">`:ic('user')}</div><div style="flex:1"><b>${RANKS[Math.min(l-1,RANKS.length-1)]}</b> · Niv. ${l}<div class="xpb" role="progressbar" aria-label="Expérience" aria-valuemin="0" aria-valuemax="${b}" aria-valuenow="${S.xp}"><i style="width:${100*(S.xp-a)/(b-a)}%"></i></div><div class="small">${S.xp} / ${b} XP</div></div></div>`+
 (nx?`<button class="btn cont" id="ct"><span class="bdg">${ic('play')}</span><span style="flex:1;text-align:left"><small>${done?'Continuer':'Commencer'}</small><br>${D[nx[0]].id} · ${CAT[nx[1]]}</span></button>`:'')+
 `</div><div class="hc"><div class="card"><h2 class="h2">Objectifs du jour</h2>${quests().map(q=>`<div class="q"><span class="qi ${q.v>=q.max?'ok':''}">${ic(q.v>=q.max?'check':'star')}</span><span class="qt">${q.t}${q.v>=q.max?' (terminé)':''}<div class="mini" aria-hidden="true"><i style="width:${100*q.v/q.max}%"></i></div></span><span class="qr">${ic('coin')}+${q.r}</span></div>`).join('')}</div>
 <button class="daily" id="dl"><span class="bdg">${ic(dd?'check':'cal')}</span><span style="flex:1"><span style="font-size:20px">Défi du jour</span><br><small>${dd?`Terminé : ${dd.score}/10 · reviens demain !`:'10 verbes · bonus XP et pièces'}</small><div class="week" aria-label="Tes 7 derniers jours">${wk.map(([d,k])=>`<span class="wd ${S.days&&S.days[k]?'on':''} ${k==today()?'now':''}" aria-label="${d.toLocaleDateString('fr',{weekday:'long'})} : ${S.days&&S.days[k]?'joué':'pas joué'}">${'DLMMJVS'[d.getDay()]}</span>`).join('')}</div></span></button>
 <div class="info"><div class="lab">${ic('bulb')}Le savais-tu ?</div>${dict(TIPS[Math.floor(Date.now()/864e5)%TIPS.length])}</div>
 </div></div><h2 class="sec">Tes parcours</h2><div class="lgrid">`+
 D.map((l,i)=>{const op=lvlOpen(i),st=l.steps.reduce((n,_,k)=>n+star(l.id+'-'+k),0),dn=l.steps.filter((_,k)=>S.done[l.id+'-'+k]).length;return `<button class="lvl" data-i="${i}" aria-label="Niveau ${l.id}, ${l.name}, ${dn} étapes sur ${l.steps.length} terminées${op?'':', verrouillé'}" style="${bgStyle(l)}" ${op?'':'disabled'}><span class="bdg">${ic(op?l.icon:'lock')}</span><span style="flex:1"><b class="ttl">Niveau ${l.id}</b><small>${l.name}</small><div class="seg" aria-hidden="true">${l.steps.map((_,k)=>`<i class="${S.done[l.id+'-'+k]?'on':''}"></i>`).join('')}</div><small>${op?dn+' / '+l.steps.length+' étapes · '+st+' / '+l.steps.length*3+' étoiles':'Termine le niveau '+D[i-1].id}</small></span></button>`}).join('')+`<button class="card abh" id="abh"><img src="img/banniere.jpg" alt=""><span><b>Découvre le projet</b><br><small>Sentinelles Alerte Sargasses · Alliance Française de Jacmel</small></span></button></div>`;
 $('#dl').onclick=()=>show(dailyScreen);$('#abh').onclick=aboutModal;if(nx)$('#ct').onclick=()=>show(intro,nx[0],nx[1]);document.querySelectorAll('.lvl').forEach(b=>b.onclick=()=>show(level,+b.dataset.i))}
function level(i){const l=D[i];theme(l);const nx=nextStep(),cur=nx&&nx[0]==i?nx[1]:-1,dd=S.daily[today()];
 $('#main').innerHTML=`<div class="lv2"><aside class="lside"><div class="lvtabs" role="group" aria-label="Changer de niveau">${D.map((x,j)=>{const o=lvlOpen(j);return `<button class="lt ${j==i?'on':''}" data-j="${j}" ${o?'':'disabled'} aria-pressed="${j==i}" aria-label="Niveau ${x.id}${o?'':', verrouillé'}" style="--lc:${x.c1}">${o?x.id:ic('lock')}</button>`}).join('')}</div>
 <div class="lhead" style="${bgStyle(l)}"><h1 class="ttl" style="margin:0;font-size:26px">Niveau ${l.id}</h1>${l.name}<br><small>Repère professeurs : ${l.edito}</small></div>${dd?'':`<button class="dm" id="dm">${ic('cal')}<span style="flex:1;text-align:left">Défi du jour disponible</span>${ic('play')}</button>`}</aside><div class="map">`+l.steps.map((s,k)=>{const key=l.id+'-'+k,dn=S.done[key],lock=k>0&&!S.done[l.id+'-'+(k-1)];return `<button class="node ${dn?'dn':''} ${k==cur?'cur':''}" data-k="${k}" aria-label="Étape ${k+1} : ${CAT[k]}, ${esc(s.title)}, ${lock?'verrouillée':dn?'terminée, '+star(key)+' étoiles sur 3':k==cur?'à faire maintenant':'disponible'}" ${lock?'disabled':''}><span class="c">${ic(lock?'lock':dn?'check':CATI[k])}</span><span class="t"><b>${CAT[k]}</b><small>${esc(s.title)}</small>${dn?`<span class="ss" aria-hidden="true">${'★'.repeat(star(key))}${'☆'.repeat(3-star(key))}</span>`:''}${k==cur?`<span class="here">${ic('play')}Continuer</span>`:''}</span></button>`}).join('')+'</div></div>';
 document.querySelectorAll('.lt').forEach(b=>b.onclick=()=>{nav[nav.length-1]=[level,[+b.dataset.j]];run()});if(!dd)$('#dm').onclick=()=>show(dailyScreen);
 document.querySelectorAll('.node').forEach(b=>b.onclick=()=>show(intro,i,+b.dataset.k))}
function intro(i,k){const l=D[i],s=l.steps[k];theme(l);
 $('#main').innerHTML=`<div class="card"><img class="stimg" src="img/${l.id}-${k+1}.jpg" alt="" onerror="this.remove()"><h1 class="h2" style="margin:0">${ic(CATI[k])} ${CAT[k]}</h1>${esc(s.title)}<div class="tense"><b>À réviser dans cette étape</b><br>${esc(s.tense)}</div><h2 class="h3">Rappel de conjugaison</h2>${lessonHtml(s.tense)}<div class="small" style="margin-top:8px">${s.blanks.length} verbes · ${MAX} essais par verbe · touche un mot souligné pour voir sa définition.</div></div><button class="btn" id="go">${ic('play')}C’est parti !</button>`;
 $('#go').onclick=()=>{tone(523);show(play,{mode:'step',i,k})}}
/* questions (défi, révision, quiz) */
function qOf(l,k,s,j){const pi=s.paras.findIndex(t=>t.includes('{{'+j+'}}')),p=s.paras[pi],role=roleOf(l.id+'-'+(k+1),pi,p);return{ek:`${l.id}-${k}-${j}`,a:s.blanks[j][0],inf:s.blanks[j][1],tense:s.tense,step:s,role:ROLES[role]?role:'',html:rich(p).replace(/\{\{(\d+)\}\}/g,(_,x)=>+x==j?'{{T}}':esc(s.blanks[+x][0]))}}
function poolOf(){const hi=Math.max(S.start||0,...D.map((l,i)=>l.steps.some((_,k)=>S.done[l.id+'-'+k])?i:0)),p=[];D.slice(0,hi+1).forEach(l=>l.steps.forEach((s,k)=>s.blanks.forEach((b,j)=>p.push([l,k,s,j]))));return p}
function dailyQs(){const t=today();let h=0;for(const c of t)h=(h*31+c.charCodeAt(0))>>>0;const r=()=>{h=h+0x6D2B79F5|0;let x=Math.imul(h^h>>>15,1|h);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296};
 const pool=poolOf();for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}return pool.slice(0,10).map(x=>qOf(...x))}
function reviewQs(){return Object.keys(S.err).sort((a,b)=>S.err[b]-S.err[a]).slice(0,10).map(k=>{const[id,ki,j]=k.split('-'),l=D.find(x=>x.id==id);return l&&l.steps[+ki]&&l.steps[+ki].blanks[+j]?qOf(l,+ki,l.steps[+ki],+j):null}).filter(Boolean)}
function dailyScreen(){theme();const dd=S.daily[today()];
 $('#main').innerHTML=`<div class="hero">${mascot(dd?'ok':'idle',110)}<div class="bub">${dd?'Beau travail aujourd’hui ! Reviens demain pour un nouveau défi.':'Le défi du jour : 10 verbes tirés des parcours que tu as déjà commencés.'}</div></div><div class="card"><h1 class="big">${ic('cal')} ${new Date().toLocaleDateString('fr',{weekday:'long',day:'numeric',month:'long'})}</h1>${dd?stars(dd.score>=9?3:dd.score>=6?2:1)+`<p class="big">${dd.score} / 10</p>`:`<div class="rw"><span>${ic('star','st')}XP</span><span>${ic('coin')}Pièces</span><span>${ic('flame')}Série</span></div><button class="btn" id="go">${ic('play')}Relever le défi</button>`}<p class="small" style="text-align:center">Série actuelle : ${S.streak} jour${S.streak>1?'s':''}</p></div>`;
 if(!dd)$('#go').onclick=()=>show(play,{mode:'daily'})}
/* entraînement */
function train(){theme();const ne=Object.keys(S.err).length,unlocked=Object.keys(S.done).length,tot=D.reduce((n,x)=>n+x.steps.length,0);
 $('#main').innerHTML=`<div class="hero">${mascot(ne?'think':'ok',110)}<div class="bub">${ne?`Tu as ${ne} verbe${ne>1?'s':''} à revoir. Allons-y !`:'Aucune erreur à réviser. Essaie un mini-jeu !'}</div></div>
 <div class="cards3"><div class="card"><h2 class="h2">${ic('book')} Réviser mes erreurs</h2><p>Les verbes que tu as ratés reviennent ici, avec leur phrase. Réussis-les du premier coup pour les effacer.</p><button class="btn g" id="rv" ${ne?'':'disabled'}>${ne?`Réviser (${Math.min(ne,10)} verbes)`:'Rien à réviser'}</button></div>
 <div class="card"><h2 class="h2">${ic('bolt')} Verbes éclair</h2><p>10 questions à choix multiple, ${S.set.nt?'sans chrono':QTIME+' secondes par question'}. Meilleur score : ${S.qbest}.</p><button class="btn" id="qz">${ic('play')}Jouer</button></div>
 <div class="card"><h2 class="h2">${ic('leaf')} Lettres de la forêt</h2><p>Glisse ton doigt sur les lettres pour former les mots de la nature, à partir de leur définition. ${Object.keys(S.words||{}).length} mot${Object.keys(S.words||{}).length>1?'s':''} découvert${Object.keys(S.words||{}).length>1?'s':''}.</p><button class="btn" id="lw">${ic('play')}Jouer</button></div><div class="card"><h2 class="h2">${ic('leaf')} Carnet de nature</h2><p>Relis les textes déjà terminés, écoute-les et retrouve les mots du dictionnaire. ${unlocked} fiche${unlocked>1?'s':''} sur ${tot}.</p><button class="btn w" id="cn">Ouvrir le carnet</button></div></div>`;
 if(ne)$('#rv').onclick=()=>show(play,{mode:'review'});$('#qz').onclick=()=>show(quizRun,true);$('#lw').onclick=()=>show(lettresRun,true);$('#cn').onclick=()=>show(carnet)}
function carnet(){theme();
 $('#main').innerHTML=`<h1 class="h2">Carnet de nature</h1>`+D.map(l=>`<h2 class="sec">${ic(l.icon)} Niveau ${l.id}</h2><div class="cgrid">`+l.steps.map((s,k)=>{const dn=S.done[l.id+'-'+k];return `<button class="card cn" data-i="${D.indexOf(l)}" data-k="${k}" ${dn?'':'disabled'} aria-label="${CAT[k]} : ${esc(s.title)}${dn?'':', verrouillé'}"><span class="bdg" style="background:${l.c1};color:#fff">${ic(dn?CATI[k]:'lock')}</span><span style="flex:1;text-align:left"><b>${CAT[k]}</b><br><small>${esc(s.title)}</small></span></button>`}).join('')+'</div>').join('');
 document.querySelectorAll('.cn').forEach(b=>b.onclick=()=>show(reader,+b.dataset.i,+b.dataset.k))}
function plain(s){return s.paras.map(p=>p.replace(/\{\{(\d+)\}\}/g,(_,x)=>s.blanks[+x][0]).replace(/[⟦⟧]/g,'')).join('\n')}
function reader(i,k){const l=D[i],s=l.steps[k];theme(l);
 $('#main').innerHTML=`<div class="card"><h1 class="h2">${ic(CATI[k])} ${esc(s.title)}</h1><button class="btn g" id="ls">${ic('snd')}Écouter le texte</button><button class="btn w" id="st" style="margin-top:8px">Arrêter</button></div><div class="txt">`+s.paras.map((t,pi)=>wrap(roleOf(l.id+'-'+(k+1),pi,t),dict(rich(t)).replace(/\{\{(\d+)\}\}/g,(_,x)=>`<span class="b ok">${esc(s.blanks[+x][0])}</span>`),false)).join('')+'</div>';
 $('#ls').onclick=()=>speak(plain(s));$('#st').onclick=()=>{if('speechSynthesis' in window)speechSynthesis.cancel()}}
/* moteur de jeu */
let G;
function play(o){const l=o.mode=='step'?D[o.i]:null;theme(l);let bl,qs;
 if(l){const s=l.steps[o.k];bl=s.blanks;G={...o,l,s,key:l.id+'-'+(o.k+1)}}else{qs=o.mode=='daily'?dailyQs():reviewQs();bl=qs.map(q=>[q.a,q.inf]);G={...o,qs}}
 Object.assign(G,{bl,n:0,tries:0,pts:0,st:bl.map(()=>0),combo:0,maxc:0,xp:0,coins:0,hinted:false,rev:0,ok1:0,fixed:0});
 $('#hd').hidden=false;$('#bar').hidden=false;$('#back').hidden=false;$('#ans').value='';setMas('idle',0);setMsg('Allez, je suis avec toi !');draw();setTimeout(()=>$('#ans').focus(),60)}
function setMsg(t,c){$('#msg').innerHTML=c?`<span style="color:var(--${c})">${t}</span>`:t;$('#hint').innerHTML=`${ic('bulb')}<span>Indice</span><span class="bd3">${HINT_COST}${ic('coin','cn')}</span>`;$('#hint').setAttribute('aria-label',`Indice : coûte ${HINT_COST} pièces`)}
const curTense=()=>G.mode=='step'?G.s.tense:G.qs[G.n]?G.qs[G.n].tense:'';
const curEk=()=>G.mode=='step'?`${G.l.id}-${G.k}-${G.n}`:G.qs[G.n].ek;
function draw(){const{bl,n}=G,done=n>=bl.length;let h;
 const hud=`<div class="hud"><div class="prog" role="progressbar" aria-label="Progression" aria-valuemin="0" aria-valuemax="${bl.length}" aria-valuenow="${n}"><i style="width:${100*n/bl.length}%"></i></div><span class="combo" id="cb">${G.combo>1?ic('flame')+'x'+G.combo:''}</span></div>`;
 const cur=inf=>`<span class="b cur" id="cur" role="mark" aria-label="Mot à conjuguer : ${esc(inf)}">(${esc(inf)})</span>`;
 if(G.mode!='step'){h=done?'':'<div class="card txt">'+wrap(G.qs[n].role,dict(G.qs[n].html).replace('{{T}}',cur(G.qs[n].inf)),false)+'</div>'}
 else{const s=G.s,bp=s.paras.map(t=>[...t.matchAll(/\{\{(\d+)\}\}/g)].map(x=>+x[1]));let last=bp.findIndex(m=>m.includes(n));if(done||last<0)last=s.paras.length-1;
  h='<div class="txt">'+s.paras.slice(0,last+1).map((t,pi)=>wrap(roleOf(G.key,pi,t),dict(rich(t)).replace(/\{\{(\d+)\}\}/g,(_,x)=>{x=+x;const[a,inf]=bl[x];return G.st[x]==1?`<span class="b ok">${esc(a)}</span>`:G.st[x]==2?`<span class="b rv">${esc(a)}</span>`:x==n?cur(inf):`<span class="b">(${esc(inf)})</span>`}),pi<last)).join('')+'</div>'}
 $('#main').innerHTML=hud+h;if(done){$('#recap').innerHTML='';return finish()}$('#recap').innerHTML=recapHtml();const c=$('#cur');if(c)c.scrollIntoView({block:'nearest',behavior:S.set.rm?'auto':'smooth'})}
function explain(v,a,inf){const nv=norm(v),na=norm(a),wa=na.split(' ').length,wv=nv.split(' ').length;
 if(nv===norm(inf))return'Tu as écrit l’infinitif : il faut conjuguer le verbe.';
 if(strip(nv)===strip(na))return'Presque ! Vérifie les accents.';
 if(wv<wa&&na.endsWith(nv))return'Il manque un mot avant (un auxiliaire ?).';
 if(wv!==wa)return`La bonne réponse a ${wa} mot${wa>1?'s':''}.`;return''}
function check(){if(!G||G.n>=G.bl.length)return;const inp=$('#ans'),v=inp.value;if(!norm(v))return;const a=G.bl[G.n][0],ek=curEk();
 if(norm(v)===norm(a)){const first=G.tries==0&&!G.hinted;G.pts+=Math.max(MAX-G.tries-(G.hinted?1:0),1);if(first){G.combo++;G.ok1++;G.maxc=Math.max(G.maxc,G.combo);G.coins+=1;if(S.err[ek]){delete S.err[ek];G.fixed++}}else G.combo=0;
  G.xp+=5+(first?Math.min(G.combo,5):0);G.st[G.n]=1;G.n++;G.tries=0;G.hinted=false;inp.value='';sfx.ok();setMas(G.combo>=3?'cheer':'ok');td().v++;if(G.combo>=3)td().c=1;save();
  if(G.combo>=3)burst(10);if(G.combo>=5)award('combo5');draw();setMsg(G.combo>1?`Combo x${G.combo} !`:pick(['Bravo !','Excellent !','Kenbe la !','Bon travay !','Tu gères !']));const c=$('#cb');if(c)c.classList.add('pop');return}
 G.tries++;G.combo=0;if(G.tries==1){S.err[ek]=(S.err[ek]||0)+1;save()}
 inp.classList.remove('shake');void inp.offsetWidth;inp.classList.add('shake');$('#main').classList.remove('flash');void $('#main').offsetWidth;$('#main').classList.add('flash');navigator.vibrate&&navigator.vibrate(120);setMas('ko');
 if(G.tries>=MAX&&REVEAL_AFTER_3){G.st[G.n]=2;G.rev++;G.n++;G.tries=0;G.hinted=false;inp.value='';sfx.rv();draw();setMas('sad',2600);setMsg('La bonne réponse est affichée en rouge. Elle reviendra dans « Entraînement ».','warn');return}
 sfx.ko();setMsg(`${explain(v,a,G.bl[G.n][1])||pick(['Pas tout à fait…','Essaie encore !','Courage !'])} Il te reste ${MAX-G.tries} essai${MAX-G.tries>1?'s':''}. Touche Aide pour le rappel.`,'ko');inp.select()}
function hint(){if(!G||G.n>=G.bl.length||G.hinted)return;if(S.coins<HINT_COST){toast('Pas assez de pièces !');return}S.coins-=HINT_COST;G.hinted=true;save();chips();setMas('think',3000);const a=G.bl[G.n][0];setMsg(`Ça commence par « ${esc(a.slice(0,Math.max(2,Math.ceil(a.length/3))))}… »`);$('#ans').focus()}
/* rappel de la phrase, accents, clavier */
function recapHtml(){const n=G.n;let t;
 if(G.mode=='step'){const s=G.s,pi=s.paras.findIndex(x=>x.includes('{{'+n+'}}'));if(pi<0)return'';t=esc(s.paras[pi].replace(/[⟦⟧]/g,'')).replace(/\{\{(\d+)\}\}/g,(_,x)=>{x=+x;return x==n?'\u0001':G.st[x]?esc(G.bl[x][0]):'…'})}
 else{if(!G.qs[n])return'';t=G.qs[n].html.replace(/<[^>]+>/g,'').replace('{{T}}','\u0001')}
 t=t.replace(/\s+/g,' ').trim();const ss=t.split(/(?<=[.!?:])\s+/);let i=ss.findIndex(x=>x.includes('\u0001'));if(i<0)return'';let x=ss[i];if(i>0&&x.length<50)x=ss[i-1]+' '+x;
 if(x.length>150){const p=x.indexOf('\u0001'),a=Math.max(0,p-80),b=Math.min(x.length,p+70);x=(a>0?'… ':'')+x.slice(a,b).replace(/^\S*\s/,a>0?'':'$&').replace(/\s\S*$/,b<x.length?'':'$&')+(b<x.length?' …':'')}
 return x.replace('\u0001',`<mark>(${esc(G.bl[n][1])})</mark>`)}
function ins(ch){const i=$('#ans'),a=i.selectionStart==null?i.value.length:i.selectionStart,b=i.selectionEnd==null?a:i.selectionEnd;i.value=i.value.slice(0,a)+ch+i.value.slice(b);i.setSelectionRange(a+1,a+1);i.focus()}
document.querySelectorAll('.acc button').forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=()=>ins(b.textContent)});
const vv=window.visualViewport;let baseH=0,baseW=0;
function kbCheck(){const bar=$('#bar'),r=document.documentElement.style;if(bar.hidden){document.body.classList.remove('kb','barOn');return}
 const h=vv?vv.height:innerHeight,kb=vv?Math.max(0,innerHeight-vv.height-vv.offsetTop):0;if(innerWidth!==baseW){baseW=innerWidth;baseH=0}if(h>baseH)baseH=h;const open=document.activeElement===$('#ans')&&h<Math.max(baseH,screen.height*.8)*.75;
 r.setProperty('--kb',kb+'px');r.setProperty('--barh',bar.offsetHeight+'px');document.body.classList.add('barOn');document.body.classList.toggle('kb',open);
 if(open){const c=$('#cur');if(c)c.scrollIntoView({block:'nearest'})}}
if(vv){vv.addEventListener('resize',kbCheck);vv.addEventListener('scroll',kbCheck)}
$('#ans').addEventListener('focus',()=>setTimeout(kbCheck,300));$('#ans').addEventListener('blur',()=>setTimeout(kbCheck,150));
if('ResizeObserver' in window)new ResizeObserver(kbCheck).observe($('#bar'));
$('#ok').onclick=check;$('#hint').onclick=hint;$('#help').onclick=()=>G&&openLessons(curTense());$('#ans').addEventListener('keydown',e=>{if(e.key==='Enter')check()});
function finish(){$('#bar').hidden=true;const max=G.bl.length*MAX,r=max?G.pts/max:0,st=r>=.85?3:r>=.6?2:1,mode=G.mode;
 let xp=G.xp+st*20,coins=G.coins+st*3,title,sub;touchStreak();
 if(mode=='daily'){xp+=30;coins+=5;S.daily[today()]={score:G.ok1+(G.bl.length-G.ok1-G.rev)};award('daily');title='Défi terminé !';sub=`${S.daily[today()].score} / 10 réussis`}
 else if(mode=='review'){xp+=10;coins+=2;award('review');title='Révision terminée !';sub=`${G.fixed} verbe${G.fixed>1?'s':''} maîtrisé${G.fixed>1?'s':''} · ${Object.keys(S.err).length} restant${Object.keys(S.err).length>1?'s':''}`}
 else{const key=G.l.id+'-'+G.k,o=S.done[key];if(!o||G.pts>o.pts)S.done[key]={pts:G.pts,max,st};award('first');if(G.rev==0&&st==3)award('perfect');if(G.l.steps.every((_,k)=>S.done[G.l.id+'-'+k]))award(G.l.id);title='Étape terminée !';sub=`${G.bl.length-G.rev} / ${G.bl.length} verbes trouvés · ${G.pts} / ${max} pts`}
 S.verbs=(S.verbs||0)+G.ok1;const before=lvlOf(S.xp);S.xp+=xp;S.coins+=coins;claimQuests();save();chips();sfx.win();if(st>=2)burst(40);
 const up=lvlOf(S.xp)>before,last=mode=='step'&&G.k==G.l.steps.length-1,g=G,top=mode!='step';
 $('#main').insertAdjacentHTML('beforeend',`<div class="card" role="status"><div style="text-align:center">${mascot(st==3?'win':st==2?'ok':'cheer',150)}</div>${stars(st)}<h1 class="big">${title}</h1><p style="text-align:center">${sub}</p><div class="rw"><span>${ic('star','st')}+${xp} XP</span><span>${ic('coin')}+${coins}</span>${g.maxc>1?`<span>${ic('flame')}x${g.maxc}</span>`:''}</div>${up?`<p class="big">${ic('trophy')} Niveau ${lvlOf(S.xp)} !</p>`:''}${last?`<p class="small" style="text-align:center">Parcours ${g.l.id} terminé. Projet Sentinelles Alerte Sargasses · Alliance Française de Jacmel.</p>`:''}<button class="btn" id="nx">${top?'Retour':last?'Retour aux parcours':'Étape suivante'}</button>${top?'':'<button class="btn w" id="rp">Rejouer</button>'}</div>`);
 $('#nx').onclick=()=>{nav=[];if(top||last)show(home);else{const i=g.i;nav=[[home,[]],[level,[i]]];show(intro,i,g.k+1)}};if(!top)$('#rp').onclick=()=>{nav.pop();show(play,{mode:'step',i:g.i,k:g.k})};window.scrollTo({top:document.body.scrollHeight,behavior:S.set.rm?'auto':'smooth'});$('#nx').focus({preventScroll:true})}
/* mini-jeu : verbes éclair */
function quizQs(){const pool=shuf(poolOf()).slice(0,10),all=poolOf();return pool.map(x=>{const q=qOf(...x),wc=q.a.split(' ').length,same=[...new Set(x[2].blanks.map(b=>b[0]))].filter(a=>a!==q.a&&a.split(' ').length==wc),more=[...new Set(all.map(t=>t[2].blanks[t[3]][0]))].filter(a=>a!==q.a&&a.split(' ').length==wc&&!same.includes(a));
  const d=shuf(same).slice(0,3);while(d.length<3&&more.length)d.push(more.splice(Math.floor(Math.random()*more.length),1)[0]);q.opts=shuf([q.a,...d]);return q})}
function quizRun(fresh){theme();if(fresh)Q={qs:quizQs(),n:0,sc:0,ok:0,t:null,lock:false};$('#hd').hidden=false;$('#back').hidden=false;quizDraw()}
function quizDraw(){const q=Q.qs[Q.n];if(!q)return show(quizEnd);Q.lock=false;Q.t0=Date.now();
 $('#main').innerHTML=`<div class="hud"><div class="prog" role="progressbar" aria-label="Question" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${Q.n}"><i style="width:${10*Q.n}%"></i></div><span class="combo">${Q.sc} pts</span></div>${S.set.nt?'':`<div class="tmr" aria-hidden="true"><i style="animation:tm ${QTIME}s linear forwards"></i></div>`}<div class="card txt">${wrap(q.role,dict(q.html).replace('{{T}}',`<span class="b cur" role="mark" aria-label="Mot à conjuguer : ${esc(q.inf)}">(${esc(q.inf)})</span>`),false)}</div><div class="opts" role="group" aria-label="Choisis la bonne forme">${q.opts.map((o,i)=>`<button class="btn w opt" data-i="${i}">${esc(o)}</button>`).join('')}</div><div id="qf" class="small" role="status" style="text-align:center;margin-top:10px">Question ${Q.n+1} sur 10</div>`;
 document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>quizPick(+b.dataset.i));if(!S.set.nt)Q.t=setTimeout(()=>quizPick(-1),QTIME*1000)}
function quizPick(i){if(Q.lock)return;Q.lock=true;clearTimeout(Q.t);const q=Q.qs[Q.n],ok=i>=0&&q.opts[i]===q.a,left=Math.max(0,QTIME*1000-(Date.now()-Q.t0));
 document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(q.opts[j]===q.a)b.classList.add('good');else if(j===i)b.classList.add('bad')});
 if(ok){Q.ok++;Q.sc+=10+(S.set.nt?0:Math.round(left/1000));sfx.ok();$('#qf').textContent='Bravo !';if(S.err[q.ek]){delete S.err[q.ek]}}else{sfx.ko();$('#qf').textContent=(i<0?'Temps écoulé. ':'Raté. ')+'La bonne réponse : '+q.a;S.err[q.ek]=(S.err[q.ek]||0)+1}
 save();Q.n++;Q.t=setTimeout(quizDraw,ok?900:1800)}
function quizEnd(){theme();$('#hd').hidden=false;const xp=Q.ok*6+Math.floor(Q.sc/10),coins=Math.floor(Q.ok/2),best=Q.sc>S.qbest;if(best)S.qbest=Q.sc;touchStreak();S.xp+=xp;S.coins+=coins;if(Q.ok>=8)award('quiz');save();chips();sfx.win();if(Q.ok>=6)burst(30);
 $('#main').innerHTML=`<div class="card" role="status"><div style="text-align:center">${mascot(Q.ok>=8?'win':Q.ok>=5?'ok':'cheer',150)}</div>${stars(Q.ok>=8?3:Q.ok>=5?2:1)}<h1 class="big">${Q.ok} / 10</h1><p style="text-align:center">${Q.sc} points${best?' · nouveau record !':''}</p><div class="rw"><span>${ic('star','st')}+${xp} XP</span><span>${ic('coin')}+${coins}</span></div><button class="btn" id="again">${ic('bolt')}Rejouer</button><button class="btn w" id="bk">Retour</button></div>`;
 $('#again').onclick=()=>{nav.pop();show(quizRun,true)};$('#bk').onclick=()=>{nav=[];show(train)}}
/* mini-jeu : lettres de la forêt */
let LW=null;
const ACCV={'é':'è','è':'é','ê':'é','à':'â','â':'à','î':'i','ô':'o','û':'u','ù':'û','ç':'c'};
function lwWords(){const c=GL.map((e,k)=>({w:e[1],d:e[2],k})).filter(x=>/^[A-Za-zÀ-ÿœŒ]{4,13}$/.test(x.w)&&x.w!==x.w.toUpperCase()&&!/stagiaire|pêche/i.test(x.w));
 const mask=(d,k)=>d.replace(new RegExp('(^|[^A-Za-zÀ-ÿ])('+GL[k][0]+')(?![A-Za-zÀ-ÿ])','gi'),(m,p)=>p+'_____'),by=f=>shuf(c.filter(x=>f(x.w.length)));
 let w=[...by(l=>l<=6).slice(0,3),...by(l=>l>=7&&l<=9).slice(0,3),...by(l=>l>=10).slice(0,2)];const have=new Set(w.map(x=>x.w));shuf(c).forEach(x=>{if(w.length<8&&!have.has(x.w)){w.push(x);have.add(x.w)}});
 return w.map(x=>({word:x.w.toLowerCase(),label:x.w,def:mask(x.d,x.k),full:x.d}))}
function lwTiles(word){const L=[...word],d=[];for(const ch of L)if(ACCV[ch]){d.push(ACCV[ch]);break}return shuf(L.concat(d)).map(ch=>({ch}))}
function lettresRun(fresh){theme();if(fresh){const ws=lwWords();LW={words:ws,i:0,pts:0,found:0,misses:0,hint:false,state:'play',sel:[],t:null,drag:false,ptr:null};LW.tiles=lwTiles(ws[0].word)}LW.on=true;$('#hd').hidden=false;$('#back').hidden=false;lwDraw()}
function lwDraw(){const w=LW.words[LW.i],n=w.word.length,done=LW.state=='done',sw=n>10?28:n>8?32:38,last=LW.i==LW.words.length-1;
 const slots=[...w.word].map((ch,i)=>`<span class="slot ${done?'ok':''}">${done?ch.toUpperCase():''}</span>`).join('');
 let body;
 if(done)body=`<div class="card" role="status"><h2 class="big">${esc(w.label)}</h2><p>${esc(w.full)}</p><button class="btn g" id="lsp">${ic('snd')}Écouter</button><button class="btn" id="lnx">${last?'Terminer':'Mot suivant'}</button></div>`;
 else{const N=LW.tiles.length,ts=N<=7?58:N<=10?52:46;LW.ts=ts;
  body=`<div class="lw-wheel" id="lww" role="group" aria-label="Lettres disponibles">${LW.tiles.map((t,i)=>{const a=-Math.PI/2+2*Math.PI*i/N;return `<button type="button" class="lt2" data-i="${i}" aria-label="Lettre ${t.ch}" style="left:${50+37*Math.cos(a)}%;top:${50+37*Math.sin(a)}%;width:${ts}px;height:${ts}px">${t.ch.toUpperCase()}</button>`}).join('')}<svg class="lw-svg" id="lws" aria-hidden="true"><polyline id="lwl" points="" fill="none" stroke="rgba(244,123,32,.85)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  <div class="lw-ctl"><button class="btn w" id="lcl">${ic('x')}Effacer</button><button class="btn w" id="lsh">${ic('shuf')}Mélanger</button><button class="btn" id="lhi" aria-label="Indice : coûte ${HINT_COST} pièces" style="white-space:nowrap">${ic('bulb')}Indice ${HINT_COST}${ic('coin','cn')}</button></div>`}
 $('#main').innerHTML=`<div class="hud"><div class="prog" role="progressbar" aria-label="Mots" aria-valuemin="0" aria-valuemax="${LW.words.length}" aria-valuenow="${LW.i}"><i style="width:${100*LW.i/LW.words.length}%"></i></div><span class="combo">${LW.pts} pts</span></div>
 <div class="card lw-clue"><div id="lm">${mascot(done?'ok':'idle',64)}</div><div><div class="lab">${ic('bulb')}Trouve le mot · ${n} lettres</div><p>${esc(w.def)}</p></div></div>
 <div class="slots" id="slots" style="--sw:${sw}px" aria-hidden="true">${slots}</div><div class="sr" id="lwst" role="status"></div>`+body;
 if(done){$('#lsp').onclick=()=>speak(w.label+'. '+w.full);$('#lnx').onclick=lwNext;$('#lnx').focus();return}
 lwGeo();lwBind()}
function lwGeo(){const wh=$('#lww');if(!wh)return;const s=wh.clientWidth,N=LW.tiles.length,R=s*.37;LW.s=s;LW.c=LW.tiles.map((_,i)=>{const a=-Math.PI/2+2*Math.PI*i/N;return[s/2+R*Math.cos(a),s/2+R*Math.sin(a)]});const sv=$('#lws');if(sv){sv.setAttribute('viewBox',`0 0 ${s} ${s}`)}}
function lwHit(x,y){for(let i=0;i<LW.tiles.length;i++){if(Math.hypot(x-LW.c[i][0],y-LW.c[i][1])<LW.ts*.6){const p=LW.sel.indexOf(i);if(p<0){LW.sel.push(i);lwTick(true)}else if(p===LW.sel.length-2){LW.sel.pop();lwTick()}return}}}
function lwTick(add){const g=LW.sel.map(i=>LW.tiles[i].ch);document.querySelectorAll('.lt2').forEach((b,i)=>b.classList.toggle('on',LW.sel.includes(i)));document.querySelectorAll('#slots .slot').forEach((el,i)=>{el.textContent=g[i]?g[i].toUpperCase():''});const st=$('#lwst');if(st)st.textContent=g.length?'Mot en cours : '+g.join(', '):'';lwLine();if(add)tone(420+g.length*55,.07)}
function lwLine(){const l=$('#lwl');if(!l)return;const pts=LW.sel.map(i=>LW.c[i].join(','));if(LW.drag&&LW.ptr&&LW.sel.length)pts.push(LW.ptr.join(','));l.setAttribute('points',pts.join(' '))}
function lwBind(){const wh=$('#lww');let moved=false;const pt=e=>{const r=wh.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 wh.addEventListener('pointerdown',e=>{if(LW.state!='play')return;e.preventDefault();wh.setPointerCapture(e.pointerId);LW.drag=true;moved=false;LW.ptr=pt(e);const before=LW.sel.length;lwHit(...LW.ptr);
  if(before&&LW.sel.length===before){const[x,y]=LW.ptr,i=LW.sel[LW.sel.length-1];if(Math.hypot(x-LW.c[i][0],y-LW.c[i][1])<LW.ts*.6){LW.sel.pop();lwTick()}}});
 wh.addEventListener('pointermove',e=>{if(!LW.drag)return;LW.ptr=pt(e);const n=LW.sel.length;lwHit(...LW.ptr);if(LW.sel.length!==n)moved=true;lwLine()});
 const up=()=>{if(!LW.drag)return;LW.drag=false;LW.ptr=null;lwLine();const n=LW.words[LW.i].word.length;if(LW.sel.length>=2&&(moved||LW.sel.length>=n))lwSubmit()};
 wh.addEventListener('pointerup',up);wh.addEventListener('pointercancel',()=>{LW.drag=false;LW.ptr=null;lwLine()});
 document.querySelectorAll('.lt2').forEach(b=>b.addEventListener('click',e=>{if(e.detail!==0)return;const i=+b.dataset.i,p=LW.sel.indexOf(i);if(p<0){LW.sel.push(i);lwTick(true);if(LW.sel.length>=LW.words[LW.i].word.length)lwSubmit()}else if(p===LW.sel.length-1){LW.sel.pop();lwTick()}}));
 $('#lcl').onclick=()=>{LW.sel=[];lwTick()};$('#lsh').onclick=()=>{const keep=LW.sel.map(i=>LW.tiles[i]);LW.tiles=shuf(LW.tiles.slice());LW.sel=keep.map(t=>LW.tiles.indexOf(t));lwDraw();lwTick()};$('#lhi').onclick=lwHint}
function lmas(m){const el=$('#lm');if(!el)return;el.innerHTML=mascot(m,64);clearTimeout(LW.t);LW.t=setTimeout(()=>{const e=$('#lm');if(e)e.innerHTML=mascot('idle',64)},1700)}
function lwSubmit(){if(LW.state!='play')return;const w=LW.words[LW.i],g=LW.sel.map(i=>LW.tiles[i].ch).join('');if(!g)return;
 if(g===w.word){LW.pts+=Math.max(2,10-2*LW.misses-(LW.hint?3:0));LW.found++;(S.words=S.words||{})[w.word]=1;save();LW.state='done';sfx.ok();burst(14);LW.sel=[];lwDraw();lmas('win');return}
 LW.misses++;const acc=strip(g)===strip(w.word);LW.sel=[];lwTick();const wh=$('#lww');wh.classList.remove('shake');void wh.offsetWidth;wh.classList.add('shake');navigator.vibrate&&navigator.vibrate(100);sfx.ko();lmas('ko');toast(acc?'Presque ! Vérifie les accents.':pick(['Pas tout à fait…','Essaie encore !','Courage !']))}
function lwHint(){if(LW.state!='play')return;if(S.coins<HINT_COST){toast('Pas assez de pièces !');return}S.coins-=HINT_COST;LW.hint=true;save();chips();const w=LW.words[LW.i].word;let g=LW.sel.map(i=>LW.tiles[i].ch).join('');if(!w.startsWith(g)){LW.sel=[];g=''}lwTick();const need=w[g.length],ti=LW.tiles.findIndex((t,i)=>t.ch===need&&!LW.sel.includes(i)),el=document.querySelector(`.lt2[data-i="${ti}"]`);if(el){el.classList.add('glow');setTimeout(()=>el.classList.remove('glow'),2000)}lmas('think')}
function lwNext(){LW.i++;if(LW.i>=LW.words.length){LW.on=false;return show(lettresEnd)}LW.state='play';LW.sel=[];LW.misses=0;LW.hint=false;LW.tiles=lwTiles(LW.words[LW.i].word);lwDraw();const t=$('.lt2');t&&t.focus&&0}
function lettresEnd(){theme();$('#hd').hidden=false;const mx=LW.words.length*10,r=LW.pts/mx,st=r>=.85?3:r>=.6?2:1,xp=LW.pts+10+st*10,coins=LW.found+st;touchStreak();S.xp+=xp;S.coins+=coins;if(st==3)award('lettres');save();chips();sfx.win();if(st>=2)burst(40);
 $('#main').innerHTML=`<div class="card" role="status"><div style="text-align:center">${mascot(st==3?'win':st==2?'ok':'cheer',150)}</div>${stars(st)}<h1 class="big">${LW.found} / ${LW.words.length} mots</h1><p style="text-align:center">${LW.pts} points</p><div class="rw"><span>${ic('star','st')}+${xp} XP</span><span>${ic('coin')}+${coins}</span></div><button class="btn" id="again">${ic('play')}Rejouer</button><button class="btn w" id="bk">Retour</button></div>`;
 $('#again').onclick=()=>{nav.pop();show(lettresRun,true)};$('#bk').onclick=()=>{nav=[];show(train)}}
document.addEventListener('keydown',e=>{if(!LW||!LW.on||!$('#lww')&&LW.state!='done'||e.ctrlKey||e.metaKey||e.altKey)return;const tg=document.activeElement&&document.activeElement.tagName;
 if(LW.state=='done'){if(e.key==='Enter'&&tg!=='BUTTON'){e.preventDefault();lwNext()}return}
 if(e.key==='Backspace'){e.preventDefault();LW.sel.pop();lwTick()}else if(e.key==='Enter'&&tg!=='BUTTON'){e.preventDefault();lwSubmit()}
 else if(e.key.length===1&&/\S/.test(e.key)){const ch=e.key.toLowerCase();let i=LW.tiles.findIndex((t,j)=>t.ch===ch&&!LW.sel.includes(j));if(i<0)i=LW.tiles.findIndex((t,j)=>strip(t.ch)===strip(ch)&&!LW.sel.includes(j));if(i>=0){e.preventDefault();LW.sel.push(i);lwTick(true);if(LW.sel.length>=LW.words[LW.i].word.length)lwSubmit()}}});
addEventListener('resize',()=>{if(LW&&LW.on&&$('#lww'))lwGeo()});
/* profil et réglages */
function sw(k,label){const on=S.set[k];return `<div class="swr"><span id="l-${k}">${label}</span><button class="tg ${on?'on':''}" role="switch" aria-checked="${on}" aria-labelledby="l-${k}" data-k="${k}"><i></i></button></div>`}
function prof(){theme();const l=lvlOf(S.xp),tot=D.reduce((n,x)=>n+x.steps.length,0),dn=Object.keys(S.done).length;
 $('#main').innerHTML=`<div class="card" style="text-align:center"><button id="pa" aria-label="Changer ma photo" style="border:5px solid var(--o);padding:0;width:104px;height:104px;border-radius:50%;overflow:hidden;background:#fde68a;box-shadow:0 5px 0 var(--od)">${S.photo?`<img src="${S.photo}" alt="" style="width:100%;height:100%;object-fit:cover">`:ic('user')}</button><h1 class="h2" style="margin:8px 0 0">${RANKS[Math.min(l-1,RANKS.length-1)]} · Niv. ${l}</h1><span class="small">Touche la photo pour la changer</span><div class="rw"><span>${ic('star','st')}${S.xp} XP</span><span>${ic('coin')}${S.coins}</span><span>${ic('flame')}${S.streak} j</span><span>${dn}/${tot} étapes</span><span>${S.verbs||0} verbes réussis</span></div></div>
 <div class="card"><h2 class="h2">Badges</h2><div class="badges">${Object.entries(BADGES).map(([k,[i,t]])=>`<div class="bd ${S.badges.includes(k)?'':'off'}" aria-label="${t} : ${S.badges.includes(k)?'obtenu':'à débloquer'}"><div class="bdg">${ic(i)}</div>${t}</div>`).join('')}</div></div>
 <div class="card"><h2 class="h2">Réglages</h2>${sw('music','Musique d’ambiance')}${sw('sfx','Effets sonores')}<div class="swr"><span id="l-fs">Taille du texte</span><div role="group" aria-labelledby="l-fs" class="fsg">${['A−','A','A+'].map((t,i)=>`<button class="fsb ${S.set.fs==i?'on':''}" data-f="${i}" aria-pressed="${S.set.fs==i}" aria-label="${['Texte petit','Texte normal','Texte grand'][i]}">${t}</button>`).join('')}</div></div>${sw('dys','Police et espacement plus lisibles')}${sw('hc','Contraste élevé')}${sw('rm','Réduire les animations')}${sw('nt','Mini-jeu sans chronomètre')}<button class="btn w" id="rs">Effacer ma progression</button></div>
 <div class="card"><h2 class="h2">À propos</h2><div class="partners"><img src="img/logo-afj.jpg" alt="Alliance Française de Jacmel"><img src="img/logo-oif.jpg" alt="Organisation Internationale de la Francophonie"></div><p class="small" style="text-align:center">Projet Sentinelles Alerte Sargasses · 2021-2023</p><button class="btn w" id="ab2">Lire l’à-propos</button></div></div>`;
 $('#pa').onclick=()=>$('#file').click();$('#ab2').onclick=aboutModal;
 document.querySelectorAll('.tg').forEach(b=>b.onclick=()=>{const k=b.dataset.k;S.set[k]=!S.set[k];save();applySet();if(k=='music')S.set.music?Amb.start():Amb.stop();chips();prof();$(`.tg[data-k="${k}"]`).focus()});
 document.querySelectorAll('.fsb').forEach(b=>b.onclick=()=>{S.set.fs=+b.dataset.f;save();applySet();prof();$(`.fsb[data-f="${S.set.fs}"]`).focus()});
 $('#rs').onclick=()=>{if(confirm('Tout effacer ?')){S={done:{},photo:null,xp:0,coins:0,streak:0,last:'',badges:[],daily:{},days:{},td:null,verbs:0,err:{},qbest:0,set:Object.assign({},DEF)};save();applySet();nav=[];show(home)}}}
applySet();show(splash);
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

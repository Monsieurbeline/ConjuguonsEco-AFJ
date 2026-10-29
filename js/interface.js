/* feuille (dictionnaire, rappels) */
let lastF,SHC=null;function sheet(title,html,cls=''){const s=$('#sheet');lastF=document.activeElement;s.innerHTML=`<div class="sh ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><button class="rb x" id="sx" aria-label="Fermer">${ic('x')}</button>${html}</div>`;s.hidden=false;$('#sx').focus();$('#sx').onclick=closeSheet}
function closeSheet(){if(SHU){URL.revokeObjectURL(SHU);SHU=null}$('#sheet').hidden=true;$('#sheet').innerHTML='';if('speechSynthesis' in window)speechSynthesis.cancel();if(lastF&&lastF.focus&&document.contains(lastF)&&lastF.id!=='ans')lastF.focus({preventScroll:true})
 const f=SHC;SHC=null;if(f)f()}
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#sheet').hidden)closeSheet();
 if(e.key==='Tab'&&!$('#sheet').hidden){const f=[...$('#sheet').querySelectorAll('button,summary,textarea,a[href],[tabindex="0"]')];if(!f.length)return;const i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}
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

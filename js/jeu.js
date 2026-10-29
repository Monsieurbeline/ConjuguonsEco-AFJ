/* moteur de jeu */
let G;
function play(o){const l=o.mode=='step'?D[o.i]:null;theme(l);let bl,qs;
 if(l){const s=l.steps[o.k];bl=s.blanks;G={...o,l,s,key:l.id+'-'+(o.k+1)}}else{qs=o.mode=='daily'?dailyQs():reviewQs(o.all);bl=qs.map(q=>[q.a,q.inf]);G={...o,qs}}
 Object.assign(G,{bl,n:0,tries:0,pts:0,st:bl.map(()=>0),combo:0,maxc:0,xp:0,coins:0,hinted:false,rev:0,ok1:0,fixed:0,retry:false,pend:false});
 $('#hd').hidden=false;$('#bar').hidden=false;$('#back').hidden=false;$('#ans').value='';setMas('idle',0);setMsg('Allez, je suis avec toi !');draw();setTimeout(()=>$('#ans').focus(),60)}
function setMsg(t,c){$('#msg').innerHTML=c?`<span style="color:var(--${c})">${t}</span>`:t;$('#hint').innerHTML=`${ic('bulb')}<span>Indice</span><span class="bd3">${HINT_COST}${ic('coin','cn')}</span>`;$('#hint').setAttribute('aria-label',`Indice : coûte ${HINT_COST} pièces`)}
const curTense=()=>G.mode=='step'?G.s.tense:G.qs[G.n]?G.qs[G.n].tense:'';
const curEk=()=>G.mode=='step'?`${G.l.id}-${G.k}-${G.n}`:G.qs[G.n].ek;
function draw(){const{bl,n}=G,done=n>=bl.length;let h;
 const hud=`<div class="hud"><div class="prog" role="progressbar" aria-label="Progression" aria-valuemin="0" aria-valuemax="${bl.length}" aria-valuenow="${n}"><i style="width:${100*n/bl.length}%"></i></div><span class="combo" id="cb">${G.combo>1?ic('flame')+'x'+G.combo:''}</span></div>`;
 const cur=inf=>`<span class="b cur" id="cur" role="mark" aria-label="Mot à conjuguer : ${esc(inf)}">(${esc(inf)})</span>`;
 if(G.mode!='step'){h=done?'':'<div class="card txt">'+wrap(G.qs[n].role,dict(G.qs[n].html).replace('{{T}}',cur(G.qs[n].inf)),false)+'</div>'}
 else{const s=G.s,bp=s.paras.map(t=>[...t.matchAll(/\{\{(\d+)\}\}/g)].map(x=>+x[1]));let last=bp.findIndex(m=>m.includes(n));if(done||last<0)last=s.paras.length-1;
  h='<div class="txt">'+s.paras.slice(0,last+1).map((t,pi)=>wrap(roleOf(G.key,pi,t),dict(rich(t)).replace(/\{\{(\d+)\}\}/g,(_,x)=>{x=+x;const[a,inf]=bl[x];return G.st[x]==1?`<span class="b ok">${esc(a)}</span>`:G.st[x]==2?`<span class="b rv" title="Verbe à revoir">(${esc(inf)})</span>`:x==n?cur(inf):`<span class="b">(${esc(inf)})</span>`}),pi<last)).join('')+'</div>'}
 $('#main').innerHTML=hud+h;if(done){$('#recap').innerHTML='';return finish()}$('#recap').innerHTML=recapHtml();const c=$('#cur');if(c)c.scrollIntoView({block:'nearest',behavior:S.set.rm?'auto':'smooth'})}
function explain(v,a,inf){const nv=norm(v),na=norm(a),wa=na.split(' ').length,wv=nv.split(' ').length;
 if(nv===norm(inf))return'Tu as écrit l’infinitif : il faut conjuguer le verbe.';
 if(strip(nv)===strip(na))return'Presque ! Vérifie les accents.';
 if(wv<wa&&na.endsWith(nv))return'Il manque un mot avant (un auxiliaire ?).';
 if(wv!==wa)return`La bonne réponse a ${wa} mot${wa>1?'s':''}.`;return''}
/* règle affichée après 3 essais ratés : on explique la règle, on ne donne pas la réponse */
const AUXV={av:{pres:['ai','as','a','avons','avez','ont'],imp:['avais','avait','avions','aviez','avaient'],fut:['aurai','auras','aura','aurons','aurez','auront'],cond:['aurais','aurait','aurions','auriez','auraient'],subj:['aie','aies','ait','ayons','ayez','aient']},
 et:{pres:['suis','es','est','sommes','etes','sont'],imp:['etais','etait','etions','etiez','etaient'],fut:['serai','seras','sera','serons','serez','seront'],cond:['serais','serait','serions','seriez','seraient'],subj:['sois','soit','soyons','soyez','soient']}};
const ETRE_V=/^(aller|venir|devenir|revenir|parvenir|arriver|partir|sortir|entrer|rentrer|rester|tomber|naitre|mourir|descendre|monter|retourner)$/;
const FUTIRR={etre:'ser',avoir:'aur',aller:'ir',faire:'fer',voir:'verr',savoir:'saur',pouvoir:'pourr',vouloir:'voudr',devoir:'devr',venir:'viendr',devenir:'deviendr',tenir:'tiendr',courir:'courr',mourir:'mourr',falloir:'faudr',valoir:'vaudr',envoyer:'enverr'};
const PRES_AIT=/^(fais|fait|sais|sait|vais|hais|hait|plais|plait|nais|nait|satisfais|satisfait|apparais|apparait|parais|parait|disparais|disparait|connais|connait|brait|trait)$/;
const SUBJ_IRR=/^(soit|soient|soyons|soyez|sois|ait|aient|aie|aies|ayons|ayez|fasse|fassent|fassions|puisse|puissent|puissions|sache|saches|sachions|sachiez|veuille|veuillent|aille|aillent)$/;
const TG='(?:faut|faudrait|fallu|pour|afin|avant|bien|sans|jusqu\'a ce|a ce|veux|veut|voulons|voulez|souhaite|souhaitons|important|possible|necessaire|essentiel|utile|semble|fait|but|condition|permet\\w*|notamment|exig\\w+|il se peut|il vaut mieux)\\s+(?:donc\\s+|aussi\\s+)?(?:que|qu\')\\s*',NOQ='(?:(?!que\\s|qu\')\\S+\\s+){0,16}\\S*$';
const SUBJ_TRIG=new RegExp(TG+NOQ),SUBJ_TRIG2=new RegExp(TG+'[^]*?\\bet que\\s+'+NOQ);
const RULE_OV={'B1-3-12':'part'};
const baseInf=inf=>strip(norm(inf)).replace(/^(ne (pas |plus |jamais )?|se |s'(en )?|lui |en |y )+/,'').split(' ')[0];
const isPas=inf=>/^(ne (pas |plus |jamais )?)?etre \S/.test(strip(norm(inf)));
const isPron=inf=>/^(ne (pas |plus |jamais )?)?(se |s')/.test(norm(inf));
const futStem=b=>FUTIRR[b]||(/oir$/.test(b)?b.slice(0,-3)+'r':/re$/.test(b)?b.slice(0,-1):b);
const PT={pres:'passé composé',imp:'plus-que-parfait',fut:'futur antérieur',cond:'conditionnel passé',subj:'subjonctif passé'},PK={pres:'pc',imp:'pqp',fut:'fa',cond:'cond',subj:'subj'};
/* devine le temps du verbe à partir de la réponse attendue (jamais montrée au joueur) */
function tenseOf(a,inf,tense,before,j,ek){
 const T=strip(norm(tense)),has=x=>T.includes(x),ks=lessonKeys(tense),cap=/^[A-ZÀ-Ý]/.test(String(a).trim()),base=baseInf(inf),pron=isPron(inf),pas=isPas(inf);
 const raw=norm(a).replace(/\b(n'|m'|t'|s'|l')/g,'').replace(/\b(ne|me|te|se|nous|vous|lui|pas|plus|jamais|en|y)(?=\s|$)\s*/g,'').trim().split(' ').filter(Boolean),toks=raw.map(strip);
 let r=null;
 if(toks.length>=2){const f0=toks[0],f1=toks[1];let kind=null,tn=null;
  for(const kd of['av','et'])for(const t in AUXV[kd])if(AUXV[kd][t].includes(f0)){kind=kd;tn=t}
  if(/^(vais|vas|va|allons|allez|vont)$/.test(f0)&&base!='aller')r={k:'fp'};
  else if(f0=='etre'&&base!='etre')r={k:'pass',t:'infinitif'};
  else if(f0=='ete')r={k:'pass',t:'passé composé'};
  else if(kind){
   if(f1=='ete'&&(base!='etre'||pas))r={k:'pass',t:PT[tn]};
   else if(kind=='av')r={k:PK[tn],aux:'avoir'};
   else if(pron||ETRE_V.test(base))r={k:PK[tn],aux:'être',pron};
   else r={k:'pass',t:{pres:'présent',imp:'imparfait',fut:'futur simple',cond:'conditionnel présent',subj:'subjonctif présent'}[tn]}}
  else if(toks.length==2&&ks.includes('pass'))r={k:'part'};
 }else if(toks.length==1){const f=toks[0],ok=k=>!ks.length||ks.includes(k),sent=String(before||'').split(/[.!?:]/).pop();
  const fs=strip(futStem(base)),rest=f.startsWith(fs)?f.slice(fs.length):null;
  if(has('imperatif')&&(cap||j<4))r={k:'imper'};
  else if(has('passe simple')&&(/(erent|irent|urent)$/.test(f)||/^(fut|crut|eut)$/.test(f)||(/er$/.test(base)&&/[^r]a$/.test(f))))r={k:'ps'};
  else if((ks.includes('pass')||ks.includes('pc'))&&!/eer$/.test(base)&&(/er$/.test(base)?/é(e)?s?$/.test(raw[0]):/(u|ue|us|ues|i|ie|ies)$/.test(f)))r={k:'part'};
  else if(has('subjonctif')&&(SUBJ_IRR.test(f)&&!cap||SUBJ_TRIG.test(sent)||SUBJ_TRIG2.test(sent)))r={k:'subj'};
  else if(rest!==null&&/^(ai|as|a|ons|ez|ont)$/.test(rest))r={k:'fut'};
  else if(rest!==null&&/^(ais|ait|ions|iez|aient)$/.test(rest))r={k:'cond'};
  else if(/(ais|ait|ions|iez|aient)$/.test(f)&&!PRES_AIT.test(f)&&f.length>4)r={k:ok('imp')?'imp':ok('subj')?'subj':'imp'};
  else r={k:'pres'}}
 if(RULE_OV[ek])r={k:RULE_OV[ek]};
 if(ks.length==1&&(!r||r.k!=ks[0]))r={k:ks[0]};
 if(r&&ks.length&&!['pass','part'].includes(r.k)&&!ks.includes(r.k))r=null;
 return r}
function ruleHtml(r,inf,tense){
 if(!r)return`<div class="tense"><b>À réviser dans cette étape</b><br>${esc(tense)}</div>${lessonHtml(tense)}`;
 const[n,u,f,e]=LS[r.k];let x='';
 const acc=' Le participe passé s’accorde avec le sujet (genre et nombre).';
 if(r.k=='pass'){const t=r.t;x=t=='infinitif'?'on utilise <b>être</b> à l’infinitif + le participe passé.':t=='passé composé'?'passif au passé composé : <b>avoir</b> au présent + <b>été</b> + le participe passé.':t=='plus-que-parfait'?'passif au plus-que-parfait : <b>avoir</b> à l’imparfait + <b>été</b> + le participe passé.':t=='futur antérieur'?'passif au futur antérieur : <b>avoir</b> au futur + <b>été</b> + le participe passé.':t=='conditionnel passé'?'passif au conditionnel passé : <b>avoir</b> au conditionnel + <b>été</b> + le participe passé.':t=='subjonctif passé'?'passif au subjonctif passé : <b>avoir</b> au subjonctif + <b>été</b> + le participe passé.':`<b>être</b> est au <b>${t}</b>, puis on ajoute le participe passé.`;x+=acc}
 else if(r.k=='part')x='l’auxiliaire (ou le verbe être) est déjà dans la phrase : il reste à écrire le participe passé.'+acc;
 else if(r.aux=='avoir')x='ce verbe se conjugue avec <b>avoir</b>. Le participe passé ne s’accorde pas avec le sujet.';
 else if(r.aux=='être')x=(r.pron?'verbe pronominal : il se conjugue avec':'« '+esc(inf)+' » se conjugue avec')+' <b>être</b>.'+acc;
 else if(r.k=='pres'&&/(er)$/.test(baseInf(inf)))x='verbe en -er : pense aux terminaisons -e, -es, -e, -ons, -ez, -ent.';
 return`<div class="tense rule"><b>${n}</b><p><b>Quand ?</b> ${u}</p><p><b>Comment ?</b> ${f}</p>${x?`<p><b>Ici :</b> ${x}</p>`:''}<p><b>Exemple :</b> <i>${e}</i></p></div>`}
const curIdx=()=>G.mode=='step'?G.n:+G.qs[G.n].ek.split('-')[2];
function beforeTxt(){let t;
 if(G.mode=='step'){const s=G.s,p=s.paras.find(x=>x.includes('{{'+G.n+'}}'))||'';t=p.slice(0,p.indexOf('{{'+G.n+'}}')).replace(/\{\{(\d+)\}\}/g,(_,x)=>G.bl[+x][0])}
 else{const h=G.qs[G.n].html;t=h.slice(0,h.indexOf('{{T}}')).replace(/<[^>]+>/g,'')}
 return strip(norm(t.replace(/[⟦⟧]/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')))}
function giveUp(){G.st[G.n]=2;G.rev++;G.n++;G.tries=0;G.hinted=false;G.retry=false;$('#ans').value='';draw();setMsg('Tu retrouveras ce verbe dans « Entraînement ».','warn');setTimeout(()=>{const i=$('#ans');if(i&&!$('#bar').hidden)i.focus()},80)}
function ruleSheet(){const a=G.bl[G.n][0],inf=G.bl[G.n][1],tn=curTense();let r=null;try{r=tenseOf(a,inf,tn,beforeTxt(),curIdx(),curEk())}catch(e){r=null}
 const rc=recapHtml();G.pend=true;
 sheet('La règle à retenir',`<h2 class="dh">${ic('book')} La règle à retenir</h2><p>Ce verbe est difficile, ce n’est pas grave ! Voici la règle pour <b>(${esc(inf)})</b> :</p>${ruleHtml(r,inf,tn)}${rc?`<p class="small">${rc}</p>`:''}<p class="small">Tu le reverras dans « Entraînement » pour t’exercer.</p>${G.retry?'':`<button class="btn g" id="rtry">${ic('play')}Réessayer ce verbe</button>`}<button class="btn" id="rnx">Verbe suivant</button>`);
 SHC=()=>{if(G&&G.pend){G.pend=false;giveUp()}};
 $('#rnx').onclick=closeSheet;
 const b=$('#rtry');if(b)b.onclick=()=>{G.pend=false;G.retry=true;G.tries=0;$('#ans').value='';closeSheet();setMsg('On réessaie, avec la règle en tête !');setTimeout(()=>$('#ans').focus(),80)}}
function check(){if(!G||G.n>=G.bl.length||G.pend)return;const inp=$('#ans'),v=inp.value;if(!norm(v))return;const a=G.bl[G.n][0],ek=curEk();
 if(same(v,a)){const first=G.tries==0&&!G.hinted&&!G.retry;const say=S.set.vox?recapRaw(G.n,true):'';G.pts+=G.retry?1:Math.max(MAX-G.tries-(G.hinted?1:0),1);if(first){G.combo++;G.ok1++;G.maxc=Math.max(G.maxc,G.combo);G.coins+=1;if(srOk(ek))G.fixed++}else G.combo=0;
  G.xp+=5+(first?Math.min(G.combo,5):0);G.st[G.n]=1;G.n++;G.tries=0;G.hinted=false;G.retry=false;inp.value='';sfx.ok();setMas(G.combo>=3?'cheer':'ok');td().v++;if(G.combo>=3)td().c=1;save();
  if(G.combo>=3)burst(10);if(G.combo>=5)award('combo5');if(say&&'speechSynthesis' in window)speak(say.replace('\u0001',a));draw();setMsg(G.combo>1?`Combo x${G.combo} !`:pick(['Bravo !','Excellent !','Kenbe la !','Bon travay !','Tu gères !']));const c=$('#cb');if(c)c.classList.add('pop');return}
 G.tries++;G.combo=0;if(G.tries==1&&!G.retry){S.err[ek]=(S.err[ek]||0)+1;srKo(ek);save()}
 inp.classList.remove('shake');void inp.offsetWidth;inp.classList.add('shake');$('#main').classList.remove('flash');void $('#main').offsetWidth;$('#main').classList.add('flash');navigator.vibrate&&navigator.vibrate(120);setMas('ko');
 if(G.tries>=MAX&&RULE_AFTER_3){sfx.rv();setMas('sad',2600);ruleSheet();return}
 sfx.ko();setMsg(`${explain(v,a,G.bl[G.n][1])||pick(['Pas tout à fait…','Essaie encore !','Courage !'])} Il te reste ${MAX-G.tries} essai${MAX-G.tries>1?'s':''}. Touche Aide pour le rappel.`,'ko');inp.select()}
function hint(){if(!G||G.n>=G.bl.length||G.hinted)return;if(S.coins<HINT_COST){toast('Pas assez de pièces !');return}S.coins-=HINT_COST;G.hinted=true;save();chips();setMas('think',3000);const a=G.bl[G.n][0];setMsg(`Ça commence par « ${esc(a.slice(0,Math.max(2,Math.ceil(a.length/3))))}… »`);$('#ans').focus()}
/* rappel de la phrase, accents, clavier */
function recapRaw(n,full){let t;
 if(G.mode=='step'){const s=G.s,pi=s.paras.findIndex(x=>x.includes('{{'+n+'}}'));if(pi<0)return'';t=esc(s.paras[pi].replace(/[⟦⟧]/g,'')).replace(/\{\{(\d+)\}\}/g,(_,x)=>{x=+x;return x==n?'\u0001':G.st[x]==2?'('+esc(G.bl[x][1])+')':G.st[x]||full?esc(G.bl[x][0]):'…'})}
 else{if(!G.qs[n])return'';t=G.qs[n].html.replace(/<[^>]+>/g,'').replace('{{T}}','\u0001')}
 t=t.replace(/\s+/g,' ').trim();const ss=t.split(/(?<=[.!?:])\s+/);let i=ss.findIndex(x=>x.includes('\u0001'));if(i<0)return'';let x=ss[i];if(i>0&&x.length<50)x=ss[i-1]+' '+x;
 if(!full&&x.length>150){const p=x.indexOf('\u0001'),a=Math.max(0,p-80),b=Math.min(x.length,p+70);x=(a>0?'… ':'')+x.slice(a,b).replace(/^\S*\s/,a>0?'':'$&').replace(/\s\S*$/,b<x.length?'':'$&')+(b<x.length?' …':'')}
 return full?x.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'):x}
function recapHtml(){const x=recapRaw(G.n);return x?x.replace('\u0001',`<mark>(${esc(G.bl[G.n][1])})</mark>`):''}
function ins(ch){const i=$('#ans'),a=i.selectionStart==null?i.value.length:i.selectionStart,b=i.selectionEnd==null?a:i.selectionEnd;i.value=i.value.slice(0,a)+ch+i.value.slice(b);i.setSelectionRange(a+1,a+1);i.focus()}
document.querySelectorAll('.acc button').forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=()=>ins(b.textContent)});
/* clavier du jeu (écrans tactiles) : remplace le clavier du système */
let CK=matchMedia('(pointer:coarse)').matches;
function ckApply(){const i=$('#ans');document.body.classList.toggle('ck',CK);i.readOnly=CK;i.setAttribute('inputmode',CK?'none':'text');const b=$('#ksys');if(b)b.setAttribute('aria-pressed',String(!CK));setTimeout(kbCheck,50)}
function ev(){$('#ans').dispatchEvent(new Event('input',{bubbles:true}))}
function del(){const i=$('#ans');let a=i.selectionStart,b=i.selectionEnd;if(a==null){a=b=i.value.length}if(a==b&&a>0)a--;i.value=i.value.slice(0,a)+i.value.slice(b);i.setSelectionRange(a,a);ev()}
document.querySelectorAll('#kbd button').forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=()=>{if(b.id=='ksys'){CK=!CK;ckApply();if(!CK)$('#ans').focus();return}const k=b.dataset.k;if(k=='del')del();else{ins(k);ev()}}});
const vv=window.visualViewport;let baseH=0,baseW=0;
function kbCheck(){const bar=$('#bar'),r=document.documentElement.style;if(bar.hidden){document.body.classList.remove('kb','barOn');return}
 const h=vv?vv.height:innerHeight,kb=vv?Math.max(0,innerHeight-vv.height-vv.offsetTop):0;if(innerWidth!==baseW){baseW=innerWidth;baseH=0}if(h>baseH)baseH=h;const open=CK||(document.activeElement===$('#ans')&&h<Math.max(baseH,screen.height*.8)*.75);
 r.setProperty('--kb',kb+'px');r.setProperty('--barh',bar.offsetHeight+'px');document.body.classList.add('barOn');document.body.classList.toggle('kb',open);
 if(open){const c=$('#cur');if(c)c.scrollIntoView({block:'nearest'})}}
if(vv){vv.addEventListener('resize',kbCheck);vv.addEventListener('scroll',kbCheck)}
ckApply();
$('#ans').addEventListener('focus',()=>setTimeout(kbCheck,300));$('#ans').addEventListener('blur',()=>setTimeout(kbCheck,150));
if('ResizeObserver' in window)new ResizeObserver(kbCheck).observe($('#bar'));
$('#ok').onclick=check;$('#hint').onclick=hint;$('#help').onclick=()=>G&&openLessons(curTense());$('#ans').addEventListener('keydown',e=>{if(e.key==='Enter')check()});
function finish(){$('#bar').hidden=true;const max=G.bl.length*MAX,r=max?G.pts/max:0,st=r>=.85?3:r>=.6?2:1,mode=G.mode;
 let xp=G.xp+st*20,coins=G.coins+st*3,title,sub,newCard=false;touchStreak();
 if(mode=='daily'){xp+=30;coins+=5;S.daily[today()]={score:G.ok1+(G.bl.length-G.ok1-G.rev)};award('daily');title='Défi terminé !';sub=`${S.daily[today()].score} / 10 réussis`}
 else if(mode=='review'){xp+=10;coins+=2;award('review');title='Révision terminée !';sub=`${G.fixed} verbe${G.fixed>1?'s':''} maîtrisé${G.fixed>1?'s':''} · ${Object.keys(S.err).length} restant${Object.keys(S.err).length>1?'s':''}`}
 else{const key=G.l.id+'-'+G.k,o=S.done[key];newCard=!o;if(!o||G.pts>o.pts)S.done[key]={pts:G.pts,max,st};award('first');if(Object.keys(S.done).length>=D.reduce((n,x)=>n+x.steps.length,0))award('album');if(G.rev==0&&st==3)award('perfect');if(G.l.steps.every((_,k)=>S.done[G.l.id+'-'+k]))award(G.l.id);title='Étape terminée !';sub=`${G.bl.length-G.rev} / ${G.bl.length} verbes trouvés · ${G.pts} / ${max} pts`}
 S.verbs=(S.verbs||0)+G.ok1;const before=lvlOf(S.xp);S.xp+=xp;S.coins+=coins;claimQuests();save();chips();sfx.win();if(st>=2)burst(40);
 const corr=mode=='review'&&G.rev?`<div class="tense"><b>Les réponses à retenir</b>${G.qs.map((q,i)=>G.st[i]==2?`<p>${q.html.replace('{{T}}',`<span class="b ok">${esc(q.a)}</span>`)} <small>(${esc(q.inf)})</small></p>`:'').join('')}</div>`:'',up=lvlOf(S.xp)>before,last=mode=='step'&&G.k==G.l.steps.length-1,g=G,top=mode!='step';
 let shr=null;if(mode=='step'){const L=g.l,nm=CAT[g.k];shr=last?{title:`Parcours ${L.id} terminé !`,sub:L.name,text:`J’ai terminé le parcours ${L.id} (${L.name}) sur ConjuguonsEco !`}:{title:'Étape terminée !',sub:`${nm} · Niveau ${L.id}`,text:`J’ai terminé l’étape « ${nm} » du niveau ${L.id} sur ConjuguonsEco, avec ${st} étoile${st>1?'s':''} sur 3 !`};Object.assign(shr,{stars:st,c1:L.c1,c2:L.c2,bg:SBG.cache[g.key]||null,stats:[['+'+xp,'XP'],[(g.bl.length-g.rev)+'/'+g.bl.length,'verbes'],[S.streak+' j','de suite']]})}
 else if(mode=='daily'){const sc=S.daily[today()].score;shr={title:'Défi du jour !',sub:`${sc} verbes sur 10 réussis`,text:`J’ai réussi ${sc} verbes sur 10 au défi du jour de ConjuguonsEco !`,stars:st,stats:[['+'+xp,'XP'],[sc+'/10','verbes'],[S.streak+' j','de suite']]}}
 if(shr)shr.mas=st==1?'tinet-cheer':'tinet-ok';
 $('#main').insertAdjacentHTML('beforeend',`<div class="card" role="status"><div style="text-align:center">${mascot(st==3?'win':st==2?'ok':'cheer',150)}</div>${stars(st)}<h1 class="big">${title}</h1><p style="text-align:center">${sub}</p><div class="rw"><span>${ic('star','st')}+${xp} XP</span><span>${ic('coin')}+${coins}</span>${g.maxc>1?`<span>${ic('flame')}x${g.maxc}</span>`:''}</div>${corr}${up?`<p class="big">${ic('trophy')} Niveau ${lvlOf(S.xp)} !</p>`:''}${newCard?`<button class="btn g" id="vf">${ic('book')}Nouvelle fiche dans ton carnet</button>`:''}${last?`<p class="small" style="text-align:center">Parcours ${g.l.id} terminé. Projet Sentinelles Alerte Sargasses · Alliance Française de Jacmel.</p>`:''}<button class="btn" id="nx">${top?'Retour':last?'Retour aux parcours':'Étape suivante'}</button>${shr?`<button class="btn w" id="shr">${ic('share')}Partager</button>`:''}${top?'':'<button class="btn w" id="rp">Rejouer</button>'}</div>`);
 if(shr)$('#shr').onclick=()=>shareSheet(shr);if(newCard)$('#vf').onclick=()=>{nav=[[home,[]],[level,[g.i]]];show(reader,g.i,g.k)};
 $('#nx').onclick=()=>{nav=[];if(top||last)show(home);else{const i=g.i;nav=[[home,[]],[level,[i]]];show(intro,i,g.k+1)}};if(!top)$('#rp').onclick=()=>{nav.pop();show(play,{mode:'step',i:g.i,k:g.k})};window.scrollTo({top:document.body.scrollHeight,behavior:S.set.rm?'auto':'smooth'});$('#nx').focus({preventScroll:true})}

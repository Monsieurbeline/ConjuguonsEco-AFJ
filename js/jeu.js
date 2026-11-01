/* moteur de jeu */
let G;
function play(o){hideBub();const l=o.mode=='step'?D[o.i]:null;theme(l);let bl,qs;
 if(l){const s=l.steps[o.k];bl=s.blanks;G={...o,l,s,key:l.id+'-'+(o.k+1)}}else{qs=o.mode=='daily'?dailyQs():o.mode=='comp'?compQs():reviewQs(o.all);bl=qs.map(q=>[q.a,q.inf]);G={...o,qs}}
 Object.assign(G,{bl,n:0,tries:0,pts:0,st:bl.map(()=>0),combo:0,maxc:0,xp:0,coins:0,hinted:false,rev:0,ok1:0,fixed:0,retry:false,pend:false,fm:{},op:{},size:roundSize(bl.length),mid:bl.length>25?Math.round(bl.length/2/roundSize(bl.length))*roundSize(bl.length):0,half:false,hist:[],boost:0,note:null,pw:0,hr:false,brk:false,cp:0,fi:-1,lock:false,kinds:{},rc:{ok:0,tot:0,miss:[]},assocDone:false,pool:bl.map(b=>b[0])});if(o.resume){const c=ckOf(o.i,o.k);if(c)ckRestore(c)}
 $('#hd').hidden=false;$('#bar').hidden=false;$('#back').hidden=false;$('#ans').value='';setMas('idle',0);setMsg('Allez, je suis avec toi !');draw();setTimeout(()=>$('#ans').focus(),60)}
function setMsg(t,c){$('#msg').innerHTML=c?`<span style="color:var(--${c})">${t}</span>`:t;const fr=!!G&&!G.pend&&hintFree();{const h=$('#hint');if(G&&G._hf!==undefined&&G._hf!==fr){h.classList.remove('chg');void h.offsetWidth;h.classList.add('chg');if(fr)sfx.pop()}if(G)G._hf=fr}$('#hint').innerHTML=`${ic('bulb')}<span>Indice</span>${fr?'<span class="bd3 fr">Gratuit</span>':`<span class="bd3">${HINT_COST}${ic('coin','cn')}</span>`}`;$('#hint').setAttribute('aria-label',fr?'Indice gratuit':`Indice : coûte ${HINT_COST} pièces`)}
const curTense=()=>G.mode=='step'?G.s.tense:G.qs[G.n]?G.qs[G.n].tense:'';
const curEk=()=>G.mode=='step'?`${G.l.id}-${G.k}-${G.n}`:G.qs[G.n].ek;
function draw(){const{bl,n}=G,done=n>=bl.length;if(!done&&G.brk)return roundCard();let h;
 const hud=`<div class="hud"><div class="prog" role="progressbar" aria-label="Progression" aria-valuemin="0" aria-valuemax="${bl.length}" aria-valuenow="${n}"><i style="width:${100*n/bl.length}%"></i></div><span class="rnd">${G.mid?`Partie ${n<G.mid?1:2}/2 · `:''}Manche ${Math.floor(Math.min(n,bl.length-1)/G.size)+1}/${Math.ceil(bl.length/G.size)}</span><span class="combo ${G.combo>=3?'hot':''}" id="cb">${G.combo>1?ic('flame')+'x'+G.combo:''}</span></div>`;
 const cur=inf=>`<span class="b cur" id="cur" role="mark" aria-label="Mot à conjuguer : ${esc(inf)}">(${esc(inf)})</span>`;
 if(G.mode!='step'){h=done?'':'<div class="card txt">'+wrap(G.qs[n].role,dict(G.qs[n].html).replace('{{T}}',cur(G.qs[n].inf)),false)+'</div>'}
 else{const s=G.s,bp=s.paras.map(t=>[...t.matchAll(/\{\{(\d+)\}\}/g)].map(x=>+x[1]));let last=bp.findIndex(m=>m.includes(n));if(done||last<0)last=s.paras.length-1;
  h='<div class="txt">'+s.paras.slice(0,last+1).map((t,pi)=>wrap(roleOf(G.key,pi,t),dict(rich(t)).replace(/\{\{(\d+)\}\}/g,(_,x)=>{x=+x;const[a,inf]=bl[x];return G.st[x]==1?`<span class="b ok">${esc(a)}</span>`:G.st[x]==2?`<span class="b rv" title="Verbe à revoir">(${esc(inf)})</span>`:x==n?cur(inf):`<span class="b">(${esc(inf)})</span>`}),pi<last)).join('')+'</div>'}
 $('#main').innerHTML=hud+h;{const pi=$('.prog i');if(pi&&!S.set.rm){const to=pi.style.width;pi.style.width=G.pw+'%';requestAnimationFrame(()=>requestAnimationFrame(()=>{pi.style.width=to}))}G.pw=100*n/bl.length}if(done){$('#recap').innerHTML='';return finish()}$('#recap').innerHTML=recapHtml();fmtUI();const c=$('#cur');if(c)c.scrollIntoView({block:'nearest',behavior:S.set.rm?'auto':'smooth'})}
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
function giveUp(){G.st[G.n]=2;G.rev++;rcNote(false,G.bl[G.n][1]);G.hist.push(0);advance();G.tries=0;G.hinted=false;G.retry=false;$('#ans').value='';draw();setMsg('Tu retrouveras ce verbe dans « Entraînement ».','warn');setTimeout(()=>{const i=$('#ans');if(i&&!$('#bar').hidden)i.focus()},80)}
function ruleSheet(){const a=G.bl[G.n][0],inf=G.bl[G.n][1],tn=curTense();let r=null;try{r=tenseOf(a,inf,tn,beforeTxt(),curIdx(),curEk())}catch(e){r=null}
 const rc=recapHtml();G.pend=true;
 sheet('La règle à retenir',`<h2 class="dh">${ic('book')} La règle à retenir</h2><p>Ce verbe est difficile, ce n’est pas grave ! Voici la règle pour <b>(${esc(inf)})</b> :</p>${ruleHtml(r,inf,tn)}${rc?`<p class="small">${rc}</p>`:''}<p class="small">Tu le reverras dans « Entraînement » pour t’exercer.</p>${G.retry?'':`<button class="btn g" id="rtry">${ic('play')}Réessayer ce verbe</button>`}<button class="btn w" id="rsay">${ic('snd')}<i class="eq" aria-hidden="true"><b></b><b></b><b></b></i>Écouter la phrase</button><button class="btn" id="rnx">Verbe suivant</button>`);
 SHC=()=>{if(G&&G.pend){G.pend=false;giveUp()}};
 $('#rnx').onclick=closeSheet;$('#rsay').onclick=()=>speak(sentFull(G.n));
 const b=$('#rtry');if(b)b.onclick=()=>{G.pend=false;G.retry=true;G.tries=0;$('#ans').value='';closeSheet();G.dis=null;fmtUI();setMsg('On réessaie, avec la règle en tête !');setTimeout(()=>$('#ans').focus(),80)}}
/* ---------- v22 : manches, formats d'exercices, indices, diagnostic ---------- */
const TTS='speechSynthesis' in window,qa=t=>esc(String(t)).replace(/"/g,'&quot;');
function rcNote(ok,inf){const r=G.rc;r.tot++;if(ok)r.ok++;else r.miss.push(inf)}
function advance(k=1){const p=G.n;G.n+=k;G.cp=0;G.dis=null;if(G.n<G.bl.length&&Math.floor(G.n/G.size)>Math.floor(p/G.size)){G.brk=true;if(G.mid&&p<G.mid&&G.n>=G.mid){G.half=true;G.xp+=10;G.coins+=2}ckSave()}}
function roundCard(){const r=G.rc,ri=Math.floor((G.n-1)/G.size)+1,R=Math.ceil(G.bl.length/G.size),left=G.bl.length-G.n,half=G.half;if(!S.set.rm)burst(half?34:18);sfx.ok();
 $('#bar').hidden=true;document.body.classList.remove('barOn','kb','tap');
 const ns=r.tot?(r.ok>=r.tot?3:r.ok/r.tot>=.6?2:1):1,miss=r.miss.length?`<div class="tense"><b>À revoir</b><br>${r.miss.map(esc).join(', ')}<br><small>Ils t’attendent dans « Entraînement ».</small></div>`:'';
 $('#main').innerHTML=`<div class="card" role="status"><div style="text-align:center">${mascot(r.ok>=r.tot-1?'ok':'cheer',110)}</div><h1 class="big">${half?'Mi-temps ! Partie 1 sur 2 terminée':`Manche ${ri} sur ${R} terminée !`}</h1><div class="rcs">${stars(ns)}</div><p style="text-align:center">${r.ok} verbe${r.ok>1?'s':''} sur ${r.tot} du premier coup · encore ${left} à jouer</p>${half?'<div class="rw"><span>'+ic('star','st')+'+10 XP</span><span>'+ic('coin')+'+2</span></div>':''}${miss}<button class="btn" id="nxr">${ic('play')}${half?'Partie 2':'Manche suivante'}</button>${G.mode=='step'?`<button class="btn w" id="rpz">${ic('home')}Pause : je reprendrai plus tard</button><p class="small" style="text-align:center;margin:4px 0 0">Ta progression est enregistrée.</p>`:''}</div>`;if(G.mode=='step')$('#rpz').onclick=()=>{const i=G.i;nav=[[home,[]]];show(level,i)};G.half=false;
 $('#nxr').onclick=()=>{G.brk=false;G.hr=false;G.rc={ok:0,tot:0,miss:[]};$('#bar').hidden=false;draw();setMsg(pick(['On continue !','Allez, la suite !','Prêt pour la manche suivante ?']));window.scrollTo(0,0)};
 $('#nxr').focus({preventScroll:true});window.scrollTo(0,0);[...Array(ns)].forEach((_,i)=>setTimeout(()=>sfx.star(i),350+i*200));vib([30,40,30])}
function beforeRaw(j){let t;
 if(G.mode=='step'){const p=G.s.paras.find(x=>x.includes('{{'+j+'}}'))||'';t=p.slice(0,p.indexOf('{{'+j+'}}')).replace(/\{\{(\d+)\}\}/g,(_,x)=>G.bl[+x][0])}
 else{const h=G.qs[j].html;t=h.slice(0,h.indexOf('{{T}}')).replace(/<[^>]+>/g,'')}
 return t.replace(/[⟦⟧]/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
const beforeTxt=(j=G.n)=>strip(norm(beforeRaw(j)));
function sentFull(n){const t=recapRaw(n,true);return t?t.replace('\u0001',G.bl[n][0]):''}
function clauseOf(n){const t=sentFull(n),a=G.bl[n][0],parts=t.split(/(?<=[,;:.!?])\s+/),i=parts.findIndex(x=>x.includes(a));if(i<0)return'';let c=parts[i];if(c.split(' ').length<4&&parts[i+1])c+=' '+parts[i+1];else if(c.split(' ').length<4&&parts[i-1])c=parts[i-1]+' '+c;return c.replace(/[,;:]$/,'')}
function orderOk(n){const c=clauseOf(n),w=c.split(' ').filter(Boolean);return w.length>=4&&w.length<=10&&!/…|\u0001/.test(c)}
function assocLabel(j){const w=beforeRaw(j).replace(/^.*[.!?:;]\s*/,'').trim().split(/\s+/).filter(Boolean).slice(-2).map(x=>x.length>14?x.slice(0,13)+'…':x);return w.length?`${w.join(' ')} (${G.bl[j][1]})`:null}
function assocOk(n){const f=[0,1,2,3].map(i=>nz(G.bl[n+i][0])),l=[0,1,2,3].map(i=>assocLabel(n+i));return new Set(f).size==4&&l.every(Boolean)&&new Set(l).size==4}
function adaptStage(n,N){let st=stageOf(n,N,G.mode);if(G.mode=='review'||G.hist.length<3)return st;const h=G.hist.slice(-4),acc=h.reduce((x,y)=>x+y,0)/h.length,b=acc>=1?1:acc<=.25?-2:acc<=.5?-1:0;if(b!==G.boost){G.note=b>0?'up':b<0?'down':null;G.boost=b}return Math.max(0,Math.min(4,st+b))}
function fmtFor(n){if(G.fm[n])return G.fm[n];const N=G.bl.length,st=adaptStage(n,N),a=G.bl[n][0];let r;
 if(G.mode=='review')r='type';
 else if(isComp(a))r=st==0?'comp-tap':st<=3?'comp-t':'type';
 else if(st==0)r='qcm';
 else if(st==1)r=orderOk(n)&&G.lastOrd!==n-1?(G.lastOrd=n,'order'):'qcm';
 else if(st==2)r=!G.assocDone&&n+3<N&&assocOk(n)?'assoc':(orderOk(n)&&G.lastOrd!==n-1?(G.lastOrd=n,'order'):'qcm');
 else if(st==3)r=TTS?'dictee':'type';
 else r='type';
 if(r=='assoc')G.assocDone=true;return G.fm[n]=r}
function optList(n){const a=G.bl[n][0],f=G.cf;
 if(f=='qcm')return G.op[n+'q']||(G.op[n+'q']=optionsFor(a,G.bl[n][1],G.pool));
 const p=a.split(' ');
 if(G.cp==0)return G.op[n+'a']||(G.op[n+'a']=shuf([p[0],...auxOptions(a).slice(0,3)]));
 return G.op[n+'p']||(G.op[n+'p']=shuf([p[1],...shuf(uniqOpts(p[1],ppVars(p[1]))).slice(0,3)]))}
function fmtUI(){if(!G||G.n>=G.bl.length)return;const n=G.n,f=G.cf=fmtFor(n),b=document.body,box=$('#fopts'),a=G.bl[n][0];
 if(G.note){tsay(G.note=='up'?'Tu es en forme ! Je te donne des exercices plus costauds. 💪':'On y va doucement : encore quelques choix pour bien comprendre. 🌱','tip',{ms:4500,keep:true});G.note=null}
 if(G.fi!==n){G.fi=n;G.cp=0;G.dis=null;G.ord=null;G.asc=null}
 const tap=f=='qcm'||f=='order'||f=='assoc'||f=='comp-tap'||(f=='comp-t'&&G.cp==0),inp=$('#ans');
 G.tapWant=tap;if(tap&&G.kbShown&&!b.classList.contains('tap')&&b.classList.contains('ck')&&!b.classList.contains('kbf')&&!b.classList.contains('bbl'))kbOut(()=>b.classList.toggle('tap',G.tapWant));else{const was=b.classList.contains('tap');b.classList.toggle('tap',tap);if(was&&!tap&&b.classList.contains('ck'))sfx.open()}G.kbShown=!tap;$('#say').hidden=f!='dictee';inp.placeholder=f=='comp-t'&&G.cp==1?'Écris le participe passé…':'Écris le verbe conjugué…';
 if(!tap){box.innerHTML='';if(f=='dictee'&&G.sp!==n){G.sp=n;setMsg('Écoute la phrase, puis écris le verbe.');setTimeout(sayItem,400)}setTimeout(()=>{try{inp.focus()}catch(e){}},60);return}
 if(f=='order')return renderOrder();if(f=='assoc')return renderAssoc();
 const o=optList(n),lab=f=='qcm'?'Touche la bonne forme':G.cp==0?'1. Choisis l’auxiliaire':'2. Choisis le participe passé';
 box.innerHTML=`<div class="fl">${lab}</div><div class="fo2" role="group" aria-label="${lab}">`+o.map(x=>`<button type="button" class="btn w opt" data-v="${qa(x)}">${esc(x)}</button>`).join('')+'</div>';
 box.querySelectorAll('.opt').forEach(btn=>{btn.onclick=()=>tapOpt(btn.dataset.v,btn);if(G.dis&&G.dis.includes(btn.dataset.v)){btn.disabled=true;btn.classList.add('bad')}})}
function optTarget(){const a=G.bl[G.n][0];if(G.cf=='qcm')return a;const p=a.split(' ');return G.cp==0?p[0]:p[1]}
function tapOpt(val,btn){if(G.lock||G.pend||btn.disabled)return;sfx.tick();vib(8);const f=G.cf,a=G.bl[G.n][0];
 if((f=='comp-tap'||f=='comp-t')&&G.cp==0){const p=a.split(' ');
  if(same(val,p[0])){btn.classList.add('good');G.caux=p[0];G.lock=true;sfx.ok();setTimeout(()=>{G.lock=false;G.cp=1;G.dis=null;fmtUI();liveRecap();if(f=='comp-t')setMsg('Bien ! Maintenant, écris le participe passé.')},380)}
  else{(G.dis||(G.dis=[])).push(val);check(val+' '+p[1],btn)}return}
 if(f=='comp-tap'){if(!same(val,a.split(' ')[1]))(G.dis||(G.dis=[])).push(val);return check(G.caux+' '+val,btn)}
 if(!same(val,a))(G.dis||(G.dis=[])).push(val);check(val,btn)}
/* remise en ordre */
function orderToks(n){return clauseOf(n).split(' ').filter(Boolean)}
function renderOrder(){const n=G.n,box=$('#fopts');
 if(!G.ord||G.ord.n!=n){const toks=orderToks(n);let pool=toks.map((t,i)=>({t,i}));for(let k=0;k<6;k++){shuf(pool);if(pool.some((x,i)=>x.i!==i))break}G.ord={n,toks,pool,put:[]}}
 const O=G.ord,old={};if(FXOK())box.querySelectorAll('.chip').forEach(c=>old[c.dataset.id]=c.getBoundingClientRect());
 box.innerHTML=`<div class="fl">Remets la phrase dans l’ordre</div><div class="chips ordl" id="ordl" aria-label="Ta phrase">${O.put.map((x,k)=>`<button type="button" class="chip" data-p="${k}" data-id="${x.i}">${esc(x.t)}</button>`).join('')||'<span class="small">Touche les mots dans l’ordre…</span>'}</div><div class="chips">${O.pool.map((x,k)=>`<button type="button" class="chip" data-q="${k}" data-id="${x.i}">${esc(x.t)}</button>`).join('')}</div>`;
 box.querySelectorAll('[data-q]').forEach(c=>c.onclick=()=>{if(G.lock||G.pend)return;sfx.tick();O.put.push(O.pool.splice(+c.dataset.q,1)[0]);renderOrder();if(!O.pool.length)ordCheck()});
 box.querySelectorAll('[data-p]').forEach(c=>c.onclick=()=>{if(G.lock||G.pend)return;O.pool.push(O.put.splice(+c.dataset.p,1)[0]);renderOrder()});
 if(FXOK())box.querySelectorAll('.chip').forEach(c=>{const o=old[c.dataset.id];if(!o)return;const n=c.getBoundingClientRect(),dx=o.left-n.left,dy=o.top-n.top;if(dx||dy)c.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:280,easing:'cubic-bezier(.2,.9,.3,1.15)'})})}
function ordCheck(){const O=G.ord,ok=O.put.every((x,i)=>nz(x.t)===nz(O.toks[i]));
 if(ok)return check(G.bl[G.n][0],null);
const ol=$('#ordl');if(ol){ol.classList.add('shk');setTimeout(()=>ol.classList.remove('shk'),400)}
 const ek=curEk();lose(O.put.map(x=>x.t).join(' '),G.bl[G.n][0],ek,null,{k:'ordre',m:'Ce n’est pas encore l’ordre de la phrase. Où se place le verbe ? Relis-la à voix basse.'});
 if(G.tries<MAX&&!G.pend){G.lock=true;setTimeout(()=>{G.lock=false;O.pool=O.put.splice(0).concat(O.pool);renderOrder()},700)}}
function orderHint(){const O=G.ord;if(!O)return;const k=O.put.length,nx=O.pool.findIndex(x=>nz(x.t)===nz(O.toks[k]));if(nx>=0){O.put.push(O.pool.splice(nx,1)[0]);renderOrder();setMsg('Je t’ai placé le mot suivant.');if(!O.pool.length)ordCheck()}}
/* association */
function renderAssoc(){const n=G.n,box=$('#fopts');
 if(!G.asc||G.asc.n!=n)G.asc={n,L:[0,1,2,3].map(i=>({j:n+i,lab:assocLabel(n+i),form:G.bl[n+i][0],done:false})),R:shuf([0,1,2,3]),sel:null,mist:0,ret:{}};
 const A=G.asc;
 box.innerHTML=`<div class="fl">Associe chaque début de phrase à la bonne forme</div><div class="as2"><div>${A.L.map((x,i)=>`<button type="button" class="btn w as ${x.done?'done':''} ${A.sel===i?'on':''}" data-l="${i}" ${x.done?'disabled':''}>${esc(x.lab)}</button>`).join('')}</div><div>${A.R.map(i=>`<button type="button" class="btn w as ${A.L[i].done?'done':''}" data-r="${i}" ${A.L[i].done?'disabled':''}>${esc(A.L[i].form)}</button>`).join('')}</div></div>`;
 box.querySelectorAll('[data-l]').forEach(c=>c.onclick=()=>{if(G.lock||G.pend)return;A.sel=+c.dataset.l;renderAssoc()});
 box.querySelectorAll('[data-r]').forEach(c=>c.onclick=()=>{if(G.lock||G.pend||A.sel==null)return;assocTry(A.sel,+c.dataset.r)})}
function assocTry(l,r){const A=G.asc;
 if(l==r){A.L[l].done=true;A.sel=null;sfx.ok();vib(15);renderAssoc();sparks(document.querySelector('[data-l="'+l+'"]'),6);sparks(document.querySelector('[data-r="'+r+'"]'),6);if(A.L.every(x=>x.done))assocWin();return}
 A.mist++;A.sel=null;sfx.ko();const ek=`${G.l?G.l.id+'-'+G.k:''}`,j=A.L[l].j,k=G.mode=='step'?`${G.l.id}-${G.k}-${j}`:G.qs[j].ek;
 if(!A.ret[l]){A.ret[l]=1;S.err[k]=(S.err[k]||0)+1;srKo(k);vsNote(k,false);save()}
 const dg=diagnose(A.L[r].form,A.L[l].form,G.bl[A.L[l].j][1],subjOf(beforeRaw(A.L[l].j)),curTense());G.kinds[dg.k]=(G.kinds[dg.k]||0)+1;
 setMas('ko');navigator.vibrate&&navigator.vibrate(80);setMsg('Pas ce couple !','ko');tsay(dg.m&&dg.k!='other'?((G.l&&G.l.id=='A1')?easyMsg(dg,subjOf(beforeRaw(A.L[l].j))):dg.m):'Regarde le sujet et le sens de la phrase.','ko');renderAssoc();const rb=document.querySelector('[data-r="'+r+'"]');if(rb){rb.classList.add('bad');setTimeout(()=>rb.classList.remove('bad'),420)}}
function assocWin(){const A=G.asc,first=A.mist==0,n=G.n;
 for(let i=0;i<4;i++){G.st[n+i]=1;G.pts+=first?MAX:Math.max(MAX-1,1);rcNote(first,G.bl[n+i][1]);G.hist.push(first?1:0);if(first)vsNote(G.mode=='step'?`${G.l.id}-${G.k}-${n+i}`:G.qs[n+i].ek,true)}
 if(first){for(let i=0;i<4;i++){G.combo++;G.ok1++;G.coins++;G.xp+=5+Math.min(G.combo,5)}G.maxc=Math.max(G.maxc,G.combo);if(G.combo>=3)td().c=1;if(G.combo>=5)award('combo5')}else{G.combo=0;G.xp+=20}
 td().v+=4;save();sfx.ok();setMas(first?'cheer':'ok');if(first)burst(10);G.lock=true;
 advance(4);setTimeout(()=>{G.lock=false;draw();setMsg(first?'Quatre sur quatre, sans faute !':'Bien joué, les quatre couples sont trouvés !')},600)}
function assocHint(){const A=G.asc;if(!A)return;const i=A.sel!=null&&!A.L[A.sel].done?A.sel:A.L.findIndex(x=>!x.done);if(i>=0){setMsg('Je t’ai trouvé un couple.');assocTry(i,i)}}
/* audio */
function sayItem(){if(!G||G.n>=G.bl.length||!TTS)return;const t=sentFull(G.n);if(t)speak(t)}
/* indices : le premier de chaque manche est gratuit, et toujours gratuit après une erreur */
const hintFree=()=>!G.hr||G.tries>=1;
function hint(){if(!G||G.n>=G.bl.length||G.hinted||G.pend||G.lock)return;const free=hintFree();if(!free&&S.coins<HINT_COST){toast('Pas assez de pièces !');return}
 if(!free)S.coins-=HINT_COST;G.hr=true;G.hinted=true;save();chips();setMas('think',3000);const f=G.cf,a=G.bl[G.n][0];
 if(f=='qcm'||f=='comp-tap'||(f=='comp-t'&&G.cp==0)){const t=optTarget(),ws=[...document.querySelectorAll('#fopts .opt')].filter(x=>!same(x.dataset.v,t)&&!x.disabled);shuf(ws).slice(0,ws.length>2?2:1).forEach(x=>{x.disabled=true;x.classList.add('dim')});setMsg('Voilà un indice !');tsay('J’ai écarté des mauvaises réponses. Choisis parmi celles qui restent !','tip',4000)}
 else if(f=='order')orderHint();else if(f=='assoc')assocHint();
 else{const t=f=='comp-t'?a.split(' ')[1]:a;setMsg('Voilà un indice !');tsay(`Ça commence par <b>« ${esc(t.slice(0,Math.max(2,Math.ceil(t.length/3))))}… »</b>`,'tip',{ms:5000,keep:true});$('#ans').focus()}}
/* vérification d'une réponse (saisie ou touche) */
function check(tv,btn){if(!G||G.n>=G.bl.length||G.pend||G.lock)return;hideBub();const tap=typeof tv=='string',inp=$('#ans');let v=tap?tv:inp.value;if(!norm(v))return;
 if(!tap&&G.cf=='comp-t'){if(G.cp==0)return;v=G.caux+' '+v}
 const a=G.bl[G.n][0],ek=curEk();
 if(same(v,a))return win(a,ek,btn,tap||!!btn);
 lose(v,a,ek,btn)}
function win(a,ek,btn,tap){const first=G.tries==0&&!G.hinted&&!G.retry,say=S.set.vox?recapRaw(G.n,true):'';
 G.pts+=G.retry?1:Math.max(MAX-G.tries-(G.hinted?1:0),1);
 if(first){G.combo++;G.ok1++;G.maxc=Math.max(G.maxc,G.combo);G.coins+=1;if(srOk(ek)){G.fixed++;vsMaster(ek)}}else G.combo=0;
 vsNote(ek,first);rcNote(first,G.bl[G.n][1]);G.hist.push(first?1:0);const gain=5+(first?Math.min(G.combo,5):0);fly('+'+gain+' XP'+(G.combo>=3?' 🔥':''));const fo=document.querySelector('#fopts .fo2');if(fo)fo.classList.add('done');
 G.xp+=5+(first?Math.min(G.combo,5):0);G.st[G.n]=1;advance();G.tries=0;G.hinted=false;G.retry=false;$('#ans').value='';sfx.ok();setMas(G.combo>=3?'cheer':'ok');td().v++;if(G.combo>=3)td().c=1;save();
 if([3,5,8,10,15,20].includes(G.combo))comboFx(G.combo);else if(G.combo>=3)burst(8);if(G.combo>=5)award('combo5');if(btn){btn.classList.add('good');sparks(btn,9)}else if(G.cf=='order')sparks($('#ordl'),12);else if(!tap)kbWave();vib([20,30,20]);
 const go=()=>{G.lock=false;if(say&&TTS)speak(say.replace('\u0001',a));draw();setMsg(G.combo>1?`Combo x${G.combo} !`:pick(['Bravo !','Excellent !','Kenbe la !','Bon travay !','Tu gères !']));const c=$('#cb');if(c)c.classList.add('pop')};
 if(tap){G.lock=true;setTimeout(go,520)}else go()}
function lose(v,a,ek,btn,custom){const inp=$('#ans');G.tries++;G.combo=0;
 const dg=custom||diagnose(v,a,G.bl[G.n][1],subjOf(beforeRaw(G.n)),curTense());
 if(G.tries==1&&!G.retry){S.err[ek]=(S.err[ek]||0)+1;srKo(ek);vsNote(ek,false);G.kinds[dg.k]=(G.kinds[dg.k]||0)+1;const K=S.kinds||(S.kinds={});K[dg.k]=(K[dg.k]||0)+1;save()}
 if(btn){btn.disabled=true;btn.classList.add('bad')}else{inp.classList.remove('shake');void inp.offsetWidth;inp.classList.add('shake');kbShake()}
 $('#main').classList.remove('flash');void $('#main').offsetWidth;$('#main').classList.add('flash');navigator.vibrate&&navigator.vibrate(120);setMas('ko');
 if(G.tries>=MAX&&RULE_AFTER_3){sfx.rv();setMas('sad',2600);
  if(G.cf=='order'){G.pend=true;const O=G.ord;O.pool=[];O.put=O.toks.map((t,i)=>({t,i}));renderOrder();setMsg('Voici la bonne phrase. On la reverra en entraînement.','warn');setTimeout(()=>{G.pend=false;giveUp()},1700);return}
  ruleSheet();return}
 sfx.ko();const left=MAX-G.tries,sj=subjOf(beforeRaw(G.n)),why=(G.l&&G.l.id=='A1')?easyMsg(dg,sj):dg.m,more=G.tries>=2&&dg.t2?' '+dg.t2:'';
 setMsg(`${pick(['Pas tout à fait…','Essaie encore !','Courage !'])} (${left} essai${left>1?'s':''})`,'ko');if(why||more)tsay((why||'')+more,'ko');if(!btn)inp.select()}
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
function ckApply(){const i=$('#ans');document.body.classList.toggle('ck',CK);document.body.classList.toggle('tch',matchMedia('(pointer:coarse)').matches);i.readOnly=CK;i.setAttribute('inputmode',CK?'none':'text');const b=$('#ksys');if(b)b.setAttribute('aria-pressed',String(!CK));setTimeout(kbCheck,50)}
function ev(){$('#ans').dispatchEvent(new Event('input',{bubbles:true}))}
function del(){const i=$('#ans');let a=i.selectionStart,b=i.selectionEnd;if(a==null){a=b=i.value.length}if(a==b&&a>0)a--;i.value=i.value.slice(0,a)+i.value.slice(b);i.setSelectionRange(a,a);ev()}
let KT,KI;function kstop(){clearTimeout(KT);clearInterval(KI);const p=$('#kpv');if(p)p.hidden=true}
function kpress(b){vib(8);sfx.tick();const k=b.dataset.k;if(k=='del')del();else{ins(k);ev();flyLetter(b)}b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit')}
function kshow(b){const k=b.dataset.k;if(!k||k=='del'||k==' ')return;const p=$('#kpv'),r=b.getBoundingClientRect(),q=$('#kbd').getBoundingClientRect();p.textContent=k;p.style.left=(r.left-q.left+r.width/2)+'px';p.style.top=(r.top-q.top)+'px';p.hidden=false}
document.querySelectorAll('#kbd .keys button').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();if(b.id=='ksys'){CK=false;ckApply();$('#ans').focus();return}kpress(b);kshow(b);if(b.dataset.k=='del')KT=setTimeout(()=>{KI=setInterval(()=>kpress(b),70)},380)});['pointerup','pointercancel','pointerleave'].forEach(t=>b.addEventListener(t,kstop));b.onclick=e=>e.preventDefault()});
function setFold(f){const b=$('#kfold'),apply=()=>{document.body.classList.toggle('kbf',f);b.textContent=f?'⌃':'⌄';b.setAttribute('aria-label',f?'Afficher le clavier':'Masquer le clavier');b.setAttribute('aria-expanded',String(!f));setTimeout(kbCheck,30)};if(f)kbOut(apply);else{apply();sfx.open()}}
$('#kfold').onclick=()=>setFold(!document.body.classList.contains('kbf'));
$('#kback').onclick=()=>{CK=true;ckApply()};
$('#ans').addEventListener('pointerdown',()=>{if(CK&&document.body.classList.contains('kbf'))setFold(false)});
function liveRecap(){if(!G||G.pend||G.n>=G.bl.length)return;const x=recapRaw(G.n);if(!x)return;const inf=esc(G.bl[G.n][1]),t=$('#ans').value;let v=t;if(G.cp==1&&G.caux)v=t?G.caux+' '+t:G.caux+' …';$('#recap').innerHTML=x.replace('\u0001',v?`<mark class="lv">${esc(v)}</mark><span class="inf">(${inf})</span>`:`<mark>(${inf})</mark>`)}
$('#ans').addEventListener('input',liveRecap);
const vv=window.visualViewport;let baseH=0,baseW=0;
function kbCheck(){const bar=$('#bar'),r=document.documentElement.style;if(bar.hidden){document.body.classList.remove('kb','barOn');return}
 const h=vv?vv.height:innerHeight,kb=vv?Math.max(0,innerHeight-vv.height-vv.offsetTop):0;if(innerWidth!==baseW){baseW=innerWidth;baseH=0}if(h>baseH)baseH=h;const open=CK||(document.activeElement===$('#ans')&&h<Math.max(baseH,screen.height*.8)*.75);
 r.setProperty('--kb',kb+'px');r.setProperty('--barh',bar.offsetHeight+'px');document.body.classList.add('barOn');document.body.classList.toggle('kb',open);
 if(open){const c=$('#cur');if(c)c.scrollIntoView({block:'nearest'})}}
if(vv){vv.addEventListener('resize',kbCheck);vv.addEventListener('scroll',kbCheck)}
ckApply();
$('#ans').addEventListener('focus',()=>setTimeout(kbCheck,300));$('#ans').addEventListener('blur',()=>setTimeout(kbCheck,150));
if('ResizeObserver' in window)new ResizeObserver(kbCheck).observe($('#bar'));
$('#ok').onclick=()=>check();$('#hint').onclick=hint;$('#say').onclick=sayItem;$('#help').onclick=()=>G&&openLessons(curTense());$('#ans').addEventListener('keydown',e=>{if(e.key==='Enter')check()});
function finish(){hideBub();if(G.mode=='step')LD={id:G.l.id,k:G.k};$('#bar').hidden=true;document.body.classList.remove('tap');if(G.mode=='step'&&S.ck&&S.ck.key==G.key)S.ck=null;const max=G.bl.length*MAX,r=max?G.pts/max:0,st=r>=.85?3:r>=.6?2:1,mode=G.mode;
 let xp=G.xp+st*20,coins=G.coins+st*3,title,sub,newCard=false;touchStreak();
 if(mode=='daily'){xp+=30;coins+=5;S.daily[today()]={score:G.ok1+(G.bl.length-G.ok1-G.rev)};award('daily');title='Défi terminé !';sub=`${S.daily[today()].score} / 10 réussis`}
 else if(mode=='review'){xp+=10;coins+=2;award('review');title='Révision terminée !';sub=`${G.fixed} verbe${G.fixed>1?'s':''} maîtrisé${G.fixed>1?'s':''} · ${Object.keys(S.err).length} restant${Object.keys(S.err).length>1?'s':''}`}
 else if(mode=='comp'){xp+=10;coins+=2;award('compose');title='Atelier terminé !';sub=`${G.ok1} / ${G.bl.length} réussis du premier coup`}
 else{const key=G.l.id+'-'+G.k,o=S.done[key];newCard=!o;if(newCard)(S.newf||(S.newf=[])).push(key);if(!o||G.pts>o.pts)S.done[key]={pts:G.pts,max,st};award('first');if(Object.keys(S.done).length>=D.reduce((n,x)=>n+x.steps.length,0))award('album');if(G.rev==0&&st==3)award('perfect');if(G.l.steps.every((_,k)=>S.done[G.l.id+'-'+k]))award(G.l.id);title='Étape terminée !';sub=`${G.bl.length-G.rev} / ${G.bl.length} verbes trouvés · ${G.pts} / ${max} pts`}
 S.verbs=(S.verbs||0)+G.ok1;if(masteredTotal()>=10)award('maitre');const before=lvlOf(S.xp);S.xp+=xp;S.coins+=coins;claimQuests();save();chips();sfx.win();if(st>=2)burst(40);
 const corr=(mode=='review'||mode=='comp')&&G.rev?`<div class="tense"><b>Les réponses à retenir</b>${G.qs.map((q,i)=>G.st[i]==2?`<p>${q.html.replace('{{T}}',`<span class="b ok">${esc(q.a)}</span>`)} <small>(${esc(q.inf)})</small></p>`:'').join('')}</div>`:'',up=lvlOf(S.xp)>before,last=mode=='step'&&G.k==G.l.steps.length-1,g=G,top=mode!='step';
 let shr=null;if(mode=='step'){const L=g.l,nm=CAT[g.k];shr=last?{title:`Parcours ${L.id} terminé !`,sub:L.name,text:`J’ai terminé le parcours ${L.id} (${L.name}) sur ConjuguonsEco !`}:{title:'Étape terminée !',sub:`${nm} · Niveau ${L.id}`,text:`J’ai terminé l’étape « ${nm} » du niveau ${L.id} sur ConjuguonsEco, avec ${st} étoile${st>1?'s':''} sur 3 !`};Object.assign(shr,{stars:st,c1:L.c1,c2:L.c2,bg:SBG.cache[g.key]||null,stats:[['+'+xp,'XP'],[(g.bl.length-g.rev)+'/'+g.bl.length,'verbes'],[S.streak+' j','de suite']]})}
 else if(mode=='daily'){const sc=S.daily[today()].score;shr={title:'Défi du jour !',sub:`${sc} verbes sur 10 réussis`,text:`J’ai réussi ${sc} verbes sur 10 au défi du jour de ConjuguonsEco !`,stars:st,stats:[['+'+xp,'XP'],[sc+'/10','verbes'],[S.streak+' j','de suite']]}}
 if(shr)shr.mas=st==1?'tinet-cheer':'tinet-ok';
 $('#main').insertAdjacentHTML('beforeend',`<div class="card" role="status"><div style="text-align:center">${mascot(st==3?'win':st==2?'ok':'cheer',150)}</div>${stars(st)}<h1 class="big">${title}</h1><p style="text-align:center">${sub}</p><div class="rw"><span>${ic('star','st')}<b class="cu" data-v="${xp}" data-pre="+" data-suf=" XP">+${xp} XP</b></span><span>${ic('coin')}<b class="cu" data-v="${coins}" data-pre="+">+${coins}</b></span>${g.maxc>1?`<span>${ic('flame')}x${g.maxc}</span>`:''}</div>${corr}${extraHtml(g)}${up?`<p class="big">${ic('trophy')} Niveau ${lvlOf(S.xp)} !</p>`:''}${newCard?`<button class="btn g" id="vf">${ic('book')}Nouvelle fiche dans ton carnet</button>`:''}${last?`<p class="small" style="text-align:center">Parcours ${g.l.id} terminé. Projet Sentinelles Alerte Sargasses · Alliance Française de Jacmel.</p>`:''}<button class="btn" id="nx">${top?'Retour':last?'Retour aux parcours':'Étape suivante'}</button>${shr?`<button class="btn w" id="shr">${ic('share')}Partager</button>`:''}${top?'':'<button class="btn w" id="rp">Rejouer</button>'}</div>`);
 document.querySelectorAll('.cu').forEach(countUp);setTimeout(()=>{if(up)celebrate({kind:'lvl',icon:ic('trophy'),title:'Niveau '+lvlOf(S.xp)+' !',sub:'Bravo, tu progresses !',sfx:sfx.lvl});flushBadges()},900);if(shr)$('#shr').onclick=()=>shareSheet(shr);if(newCard)$('#vf').onclick=()=>{nav=[[home,[]],[level,[g.i]]];show(reader,g.i,g.k)};
 $('#nx').onclick=()=>{nav=[];if(top||last)show(home);else{const i=g.i;nav=[[home,[]],[level,[i]]];show(intro,i,g.k+1)}};if(!top)$('#rp').onclick=()=>{nav.pop();show(play,{mode:'step',i:g.i,k:g.k})};window.scrollTo({top:document.body.scrollHeight,behavior:S.set.rm?'auto':'smooth'});$('#nx').focus({preventScroll:true})}

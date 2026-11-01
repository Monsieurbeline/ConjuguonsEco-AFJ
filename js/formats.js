/* v22 : formats d'exercices, diagnostic d'erreurs, progression par verbe */
const SUBJ=new Set(['je','tu','il','elle','on','nous','vous','ils','elles']);
const CLIT=/^(ne|n'|me|m'|te|t'|se|s'|le|l'|la|les|lui|leur|y|en|pas|plus|jamais|rien)$/;
/* sujet (pronom) juste avant le trou, sinon null */
function subjOf(before){
 const w=strip(norm(String(before))).replace(/([a-z])'/g,"$1' ").split(/\s+/).filter(Boolean);
 if(!w.length)return null;if(w[w.length-1]=="j'")return'je';
 let i=w.length-1;const sk=[];
 while(i>=0&&(CLIT.test(w[i])||w[i]=='nous'||w[i]=='vous')){sk.unshift(w[i]);i--}
 if(i>=0&&SUBJ.has(w[i]))return w[i];
 if(sk.length&&(sk[0]=='nous'||sk[0]=='vous'))return sk[0];
 return null}
const SUBJ_LBL={je:'Je / j’',tu:'Tu',il:'Il',elle:'Elle',on:'On',nous:'Nous',vous:'Vous',ils:'Ils',elles:'Elles'};
/* auxiliaires */
const auxDisp=w=>w==='etes'?'êtes':w.replace(/^et/,'ét');
function auxKind(w){const x=strip(norm(w));for(const k of['av','et'])for(const t in AUXV[k])if(AUXV[k][t].includes(x))return{k,t};return null}
const isComp=a=>{const p=String(a).trim().split(/\s+/);if(p.length!=2||/^(ete|été)$/.test(strip(norm(p[1]))))return false;return!!auxKind(p[0])};
function auxOptions(a){const[x,pp]=a.split(' '),ai=auxKind(x),o=ai.k=='av'?'et':'av',L=AUXV[ai.k][ai.t],i=L.indexOf(strip(norm(x))),
 other=AUXV[o][ai.t][Math.min(Math.max(i,0),AUXV[o][ai.t].length-1)],ts=Object.keys(AUXV[ai.k]).filter(t=>t!=ai.t),
 oth2=AUXV[ai.k][ts[Math.floor(Math.random()*ts.length)]],oth3=L.filter(y=>y!==strip(norm(x)));
 const c=[auxDisp(other),auxDisp(oth2[Math.min(Math.max(i,0),oth2.length-1)]),auxDisp(oth3[Math.floor(Math.random()*oth3.length)]),auxDisp(AUXV[o][ts[0]][0])];
 return uniqOpts(x,c)}
function ppVars(p){const v=[];let m;
 if(m=p.match(/^(.*)é(e)?(s)?$/)){const r=m[1];v.push(r+'er',r+'é',r+'ée',r+'és',r+'ez')}
 else if(m=p.match(/^(.*?)(u|i)(e)?(s)?$/)){const r=m[1]+m[2];v.push(r,r+'e',r+'s',r+'es');if(m[2]=='i')v.push(m[1]+'ir')}
 else v.push(p+'e',p+'s',p+'es');
 return v}
function uniqOpts(a,c){const seen=new Set([nz(a)]),o=[];for(const x of c){const k=nz(x);if(x&&!seen.has(k)){seen.add(k);o.push(x)}}return o}
/* distracteurs plausibles pour un QCM : erreurs de terminaison, de personne, de temps, infinitif */
const FAMS=[['e','es','ent','ons','ez'],['s','t','ent','ons','ez'],['ais','ait','aient','ions','iez'],['rai','ras','ra','rons','rez','ront'],['rais','rait','raient','rions','riez'],['é','ée','és','ées','er','ez'],['u','ue','us','ues'],['i','ie','is','ies','ir'],['a','èrent','ai','as','ons']];
const IRRG=['suis es est sommes êtes sont','ai as a avons avez ont','vais vas va allons allez vont','fais fait faisons faites font','peux peut pouvons pouvez peuvent','veux veut voulons voulez veulent','sais sait savons savez savent','dois doit devons devez doivent','viens vient venons venez viennent','vois voit voyons voyez voient','dis dit disons dites disent','prends prend prenons prenez prennent','était étais étaient étions','avait avais avaient avions','sera seras seront serons serez','aura auras auront aurons aurez','irai iras ira irons irez iront','fera feras feront ferons ferez'].map(x=>x.split(' '));
let FIDX=null;function FORMIDX(){if(FIDX)return FIDX;FIDX={};D.forEach(l=>l.steps.forEach(s=>s.blanks.forEach(b=>{const k=strip(norm(b[1]));(FIDX[k]||(FIDX[k]=new Set())).add(b[0])})));return FIDX}
function distract(a,inf,pool,n=3){
 const parts=a.split(' ');
 if(isComp(a)){const pp=parts[1],ai=auxKind(parts[0]),o=ai.k=='av'?'et':'av',L=AUXV[ai.k][ai.t],i=Math.max(0,L.indexOf(strip(norm(parts[0])))),
  ts=Object.keys(AUXV[ai.k]).filter(t=>t!=ai.t);
  const c=[auxDisp(AUXV[o][ai.t][Math.min(i,AUXV[o][ai.t].length-1)])+' '+pp,auxDisp(AUXV[ai.k][ts[0]][Math.min(i,AUXV[ai.k][ts[0]].length-1)])+' '+pp,...shuf(ppVars(pp)).slice(0,2).map(x=>parts[0]+' '+x)];
  return uniqOpts(a,c).slice(0,n)}
 const wc=parts.length,key=strip(norm(String(inf)));
 const real=[...((FORMIDX()[key])||[])].filter(x=>nz(x)!==nz(a)&&x.split(' ').length==wc);
 const irr=IRRG.find(g=>g.includes(a));
 if(irr){let o=uniqOpts(a,shuf(irr.filter(x=>x!==a)).slice(0,n));if(o.length<n&&pool)o=uniqOpts(a,o.concat(shuf(pool.filter(x=>x!==a&&x.split(' ').length==wc))));return o.slice(0,n)}
 const c=[];
 for(const F of FAMS)for(const e of F)if(a.length>=e.length+2&&a.endsWith(e)){const stem=a.slice(0,-e.length);F.forEach(x=>{if(x!==e)c.push({w:stem+x,s:e.length})})}
 const bad=x=>/[êâîôû](ent|ons|ez)$/.test(x)||(/(er|ir|re)$/.test(x)&&nz(x)!==nz(inf));
 for(let i=c.length-1;i>=0;i--)if(bad(c[i].w))c.splice(i,1);
 const L=c.length?Math.max(...c.map(x=>x.s)):0;
 let cand=shuf(real).slice(0,2).concat(shuf(c.filter(x=>x.s==L).map(x=>x.w)),shuf(c.filter(x=>x.s<L).map(x=>x.w)));
 if(parts.length==1&&/^\S+$/.test(String(inf))&&nz(inf)!==nz(a))cand.splice(1,0,inf);
 let out=uniqOpts(a,cand).slice(0,n);
 if(out.length<n&&pool){const more=shuf(pool.filter(x=>x!==a&&x.split(' ').length==wc));out=uniqOpts(a,out.concat(more)).slice(0,n)}
 return out}
function optionsFor(a,inf,pool){const d=distract(a,inf,pool,3);return shuf([a,...d])}
/* diagnostic d'une erreur : renvoie {k,m,t2} (k = type d'erreur) */
const SILENT=w=>strip(w).replace(/(ent|es|e|s|t|x)$/,'');
const famOf=w=>{w=strip(w);if(PRES_AIT.test(w))return'';return/(raient|rions|riez|rais|rait)$/.test(w)?'cond':/(rai|ras|ra|rons|rez|ront)$/.test(w)&&w.length>4?'fut':/(ais|ait|aient|ions|iez)$/.test(w)&&w.length>4?'imp':''};
function lev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function diagnose(v,a,inf,subj,tense){
 const nv=norm(v),na=norm(a),sv=strip(nv),sa=strip(na),wv=sv.split(' '),wa=sa.split(' '),sj=subj?`« ${subj==='je'?'je':subj} »`:'';
 if(nv===norm(inf))return{k:'inf',m:'Tu as écrit l’infinitif : il faut conjuguer le verbe.'};
 if(sv===sa)return{k:'orth',m:'Presque ! L’orthographe y est presque : vérifie les accents.'};
 if(wa.length>=2){
  if(wv.length==1)return{k:'aux',m:'Il manque l’auxiliaire : ce temps composé s’écrit en deux mots.'};
  if(wv.length>wa.length)return{k:'other',m:'Il y a un mot en trop : relis la phrase.'};
  if(wv.length==wa.length){
   if(wv[0]!==wa[0]){const kv=auxKind(wv[0]),ka=auxKind(wa[0]);
    if(kv&&ka&&kv.k!==ka.k)return{k:'aux',m:'Ce verbe ne se conjugue pas avec cet auxiliaire : avoir ou être ?'};
    return{k:'aux',m:`L’auxiliaire n’a pas la bonne forme : regarde le sujet${sj?' '+sj:''} et le temps.`}}
   const lv=wv[wv.length-1],la=wa[wa.length-1];
   if(/er$/.test(lv)&&/e$/.test(la))return{k:'part',m:'Après l’auxiliaire, on écrit le participe passé, pas l’infinitif. Astuce : remplace par « vendre / vendu » pour choisir entre -é et -er.'};
   if(strip(lv.replace(/(e?s|e)$/,''))===strip(la.replace(/(e?s|e)$/,'')))return{k:'part',m:'Vérifie l’accord du participe passé (genre et nombre).'};
   return{k:'part',m:'Le participe passé n’est pas le bon : pense à l’infinitif du verbe.'}}
  return{k:'other',m:`La bonne réponse a ${wa.length} mots.`}}
 if(wv.length!=wa.length)return{k:'other',m:`La bonne réponse a ${wa.length} mot${wa.length>1?'s':''}.`};
 const fv=famOf(sv),fa=famOf(sa);
 if(fv!==fa&&(fv||fa)&&lev(sv,sa)>1)return{k:'temps',m:`Ce n’est pas le bon temps : ici, c’est ${tense?'« '+tense.replace(/^L[ae]s? /,'').toLowerCase()+' »':'un autre temps'}.`};
 let cp=0;while(cp<sv.length&&cp<sa.length&&sv[cp]===sa[cp])cp++;
 const tv=sv.slice(cp),ta=sa.slice(cp);
 if(SILENT(sv)===SILENT(sa)&&sv!==sa)return{k:'homo',m:`À l’oral, tu entends la même chose : c’est le sujet${sj?' '+sj:''} qui décide de la terminaison.`,t2:`La terminaison attendue finit par « -${a.slice(-2)} ».`};
 if(tv.length<=3&&ta.length<=3&&cp>=2)return{k:'pers',m:subj?`Bon radical, mais la terminaison ne va pas avec ${sj}.`:'Bon radical, mais la terminaison ne convient pas au sujet ou au temps.',t2:`La bonne forme finit par « -${a.slice(-Math.max(2,ta.length))} ».`};
 if(lev(sv,sa)<=2&&sa.length>=4)return{k:'orth',m:'Presque ! Il y a une lettre à corriger : relis ta réponse lettre par lettre.'};
 return{k:'other',m:'',t2:`Ça commence par « ${a.slice(0,2)}… ».`}}
const KIND_LBL={inf:'infinitif écrit au lieu du verbe conjugué',orth:'orthographe',aux:'auxiliaire',part:'participe passé',temps:'choix du temps',pers:'terminaison (personne)',homo:'terminaison muette',other:'autre'};
/* manches et formats */
const roundSize=N=>Math.ceil(N/Math.ceil(N/6));
/* 5 paliers : toucher (QCM) → remettre en ordre → associer → écouter et écrire → écrire */
const stageOf=(i,N,mode)=>mode=='review'?4:(f=>f<.25?0:f<.45?1:f<.6?2:f<.8?3:4)(i/N);
/* progression par verbe */
function vstate(ek,stepKey){const s=(S.vs||{})[ek];if(s&&s.c>=2&&!S.err[ek])return'm';if(s||S.err[ek]||(stepKey&&S.done[stepKey]))return'l';return'n'}
function vsCount(l,k){const s=l.steps[k],key=l.id+'-'+k,c={m:0,l:0,n:0};s.blanks.forEach((_,j)=>c[vstate(`${l.id}-${k}-${j}`,key)]++);return c}
function vsDots(l,k){const s=l.steps[k],key=l.id+'-'+k;return s.blanks.map((b,j)=>{const st=vstate(`${l.id}-${k}-${j}`,key);return`<i class="vd ${st}" title="${esc(b[1])} : ${st=='m'?'maîtrisé':st=='l'?'en cours':'nouveau'}"></i>`}).join('')}
function vsNote(ek,first){const s=S.vs||(S.vs={});const o=s[ek]||(s[ek]={c:0,w:0});if(first)o.c++;else o.w++}
function masteredTotal(){let m=0,l=0;D.forEach(L=>L.steps.forEach((_,k)=>{const c=vsCount(L,k);m+=c.m;l+=c.l}));return m}
function learningTotal(){let l=0;D.forEach(L=>L.steps.forEach((_,k)=>{l+=vsCount(L,k).l}));return l}
function vsMaster(ek){const s=S.vs||(S.vs={});const o=s[ek]||(s[ek]={c:0,w:0});o.c=Math.max(o.c,2)}
const compPool=()=>poolOf().filter(x=>isComp(x[2].blanks[x[3]][0]));
function compQs(){return shuf(compPool()).slice(0,10).map(x=>qOf(...x))}
const ADV={inf:'Avant d’écrire, demande-toi qui fait l’action : il faut toujours conjuguer.',orth:'Relis ta réponse lettre par lettre et vérifie les accents.',aux:'Temps composé : d’abord l’auxiliaire (avoir ou être), puis le participe passé. L’atelier « temps composés » t’aide à t’entraîner.',part:'Astuce : remplace le verbe par « vendre / vendu » pour choisir entre -é et -er.',temps:'Regarde le temps annoncé au début de l’étape, puis ouvre « Aide ».',pers:'Repère le sujet avant le trou : c’est lui qui décide de la terminaison.',homo:'À l’oral on entend la même chose : cherche toujours le sujet dans la phrase.',ordre:'Le verbe se place près de son sujet : repère-les d’abord.'};
Object.assign(KIND_LBL,{ordre:'ordre des mots'});
function extraHtml(g){let h='';
 if(g.mode=='step'){const c=vsCount(g.l,g.k);
  h+=`<div class="tense"><b>Tes verbes dans cette étape</b><div class="vds" aria-hidden="true">${vsDots(g.l,g.k)}</div><small>${c.m} maîtrisé${c.m>1?'s':''} · ${c.l} en cours · ${c.n} nouveau${c.n>1?'x':''}. Un verbe est maîtrisé quand tu le réussis du premier coup deux fois.</small></div>`}
 const ks=Object.entries(g.kinds||{}).filter(([k])=>k!='other').sort((a,b)=>b[1]-a[1]);
 if(ks.length)h+=`<div class="tense"><b>Ce que Ti-Nèt a remarqué</b><p>Tes erreurs viennent surtout de : ${ks.slice(0,2).map(([k,v])=>`${KIND_LBL[k]} (${v})`).join(' et ')}.</p><p class="small">${ADV[ks[0][0]]||''}</p></div>`;
 if(g.mode=='step'&&g.k==g.l.steps.length-1){const t={m:0,l:0,n:0};g.l.steps.forEach((_,k)=>{const c=vsCount(g.l,k);t.m+=c.m;t.l+=c.l;t.n+=c.n});
  const worst=Object.keys(S.err).filter(k=>k.startsWith(g.l.id+'-')).sort((a,b)=>S.err[b]-S.err[a]).slice(0,5).map(k=>{const[id,ki,j]=k.split('-');const b=g.l.steps[+ki]&&g.l.steps[+ki].blanks[+j];return b?esc(b[1]):''}).filter(Boolean);
  h+=`<div class="tense"><b>Bilan du parcours ${g.l.id}</b><p>${t.m} verbe${t.m>1?'s':''} maîtrisé${t.m>1?'s':''} · ${t.l} en cours · ${t.n} à découvrir.</p>${worst.length?`<p class="small">À retravailler en priorité : ${worst.join(', ')}.</p>`:''}</div>`}
 return h}
/* ---------- v24 : reprise, bulle de Ti-Nèt, animations ---------- */
const ckKey=(i,k)=>D[i].id+'-'+(k+1),ckOf=(i,k)=>S.ck&&S.ck.key==ckKey(i,k)?S.ck:null;
function ckSave(){if(!G||G.mode!='step')return;S.ck={key:G.key,i:G.i,k:G.k,n:G.n,st:G.st,pts:G.pts,xp:G.xp,coins:G.coins,ok1:G.ok1,rev:G.rev,fixed:G.fixed,maxc:G.maxc,kinds:G.kinds,assocDone:G.assocDone,lastOrd:G.lastOrd,hist:G.hist};save()}
function ckRestore(c){Object.assign(G,{n:c.n,st:c.st,pts:c.pts,xp:c.xp,coins:c.coins,ok1:c.ok1,rev:c.rev,fixed:c.fixed,maxc:c.maxc,kinds:c.kinds||{},assocDone:c.assocDone,lastOrd:c.lastOrd,hist:c.hist||[],combo:0})}
const easyMsg=(dg,sj)=>({inf:'Il faut conjuguer le verbe : change sa fin pour qu’elle aille avec la personne.',orth:'Presque ! Regarde bien les lettres et les accents.',aux:'Il y a deux mots : d’abord « avoir » ou « être », puis le verbe (comme « mangé »).',part:'Après « avoir » ou « être », on écrit le verbe comme « mangé » ou « fini », pas comme « manger ».',temps:'Ce n’est pas le bon temps. Regarde le titre de l’étape.',pers:sj?`Regarde qui fait l’action : « ${sj} ». La fin du verbe doit aller avec lui.`:'Regarde qui fait l’action : la fin du verbe change.',homo:'Ça se dit pareil, mais ça s’écrit autrement ! Regarde qui fait l’action.',ordre:'Pas encore ! Qui fait l’action ? Mets-le d’abord, puis le verbe.'}[dg.k]||dg.m);
function fly(t){if(S.set.rm)return;const e=document.createElement('div');e.className='fly';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1000)}
function countUp(e){const v=+e.dataset.v,pre=e.dataset.pre||'',suf=e.dataset.suf||'';if(S.set.rm||!v)return;const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/800);e.textContent=pre+Math.round(v*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)})(t0)}

/* v26 : charte de mouvement — rapide .18 s · normal .34 s · fête .8 s ; sons, vibrations, célébrations, transitions */
const FXOK=()=>!S.set.rm&&!S.set.lite;
const vib=p=>{try{if(!S.set.rm&&navigator.vibrate)navigator.vibrate(p)}catch(e){}};
/* ----- sons ----- */
function whoosh(up){if(!S.set.sfx)return;try{const c=ac(),n=c.currentTime,b=c.createBuffer(1,Math.floor(c.sampleRate*.25),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
 const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=.9;f.frequency.setValueAtTime(up?500:2200,n);f.frequency.exponentialRampToValueAtTime(up?2200:400,n+.2);
 const g=c.createGain();g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.22);s.connect(f);f.connect(g);g.connect(c.destination);s.start(n)}catch(e){}}
Object.assign(sfx,{tick:()=>tone(1250,.03,0,'triangle'),pop:()=>tone(520,.07),open:()=>whoosh(true),close:()=>whoosh(false),
 combo:n=>[523,659,784,1047,1319].slice(0,n>=5?5:4).forEach((f,i)=>tone(f,.14,i*.07,'triangle')),
 star:i=>tone(784+i*190,.2,0,'triangle'),
 badge:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.22,i*.1,'triangle'));tone(1319,.5,.45)},
 lvl:()=>{[392,523,659,784,1047,1319].forEach((f,i)=>tone(f,.24,i*.1,'triangle'));[523,659,784].forEach(f=>tone(f,.6,.7))}});
/* ----- étincelles ----- */
const SPC=['#ffc928','#43a51c','#f47b20','#5bb8e6'];
function sparks(el,n=8){if(!FXOK()||!el)return;const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
 for(let i=0;i<n;i++){const s=document.createElement('i');s.className='spk';s.setAttribute('aria-hidden','true');s.textContent=i%2?'✦':'✧';s.style.cssText=`left:${cx}px;top:${cy}px;color:${SPC[i%4]}`;document.body.appendChild(s);
  const a=Math.PI*2*i/n+Math.random()*.5,d=30+Math.random()*36;
  s.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(1.1) rotate(90deg)`,opacity:0}],{duration:560,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>s.remove()}}
/* ----- clavier : sortie en cascade, secousse, vague, lettre qui glisse ----- */
function kbOut(cb){const k=$('#kbd');if(!FXOK()||!k||getComputedStyle(k).display=='none'){cb();return}k.classList.add('closing');sfx.close();setTimeout(()=>{k.classList.remove('closing');cb()},210)}
function kbShake(){const k=$('#kbd');if(!FXOK()||!k)return;k.classList.remove('shk');void k.offsetWidth;k.classList.add('shk');setTimeout(()=>k.classList.remove('shk'),400)}
function kbWave(){const k=$('#kbd');if(!FXOK()||!k||getComputedStyle(k).display=='none')return;k.querySelectorAll('.kr').forEach(r=>[...r.children].forEach((b,i)=>b.style.setProperty('--c',i)));k.classList.add('wave');setTimeout(()=>k.classList.remove('wave'),650)}
function flyLetter(btn){if(!FXOK())return;const k=btn.dataset.k,m=document.querySelector('#recap mark.lv');if(!k||k==' '||k=='del'||!m)return;
 const a=btn.getBoundingClientRect(),z=m.getBoundingClientRect(),sx=a.left+a.width/2,sy=a.top+a.height/2,e=document.createElement('span');
 e.className='flyl';e.setAttribute('aria-hidden','true');e.textContent=k;e.style.cssText=`left:${sx}px;top:${sy}px`;document.body.appendChild(e);
 e.animate([{transform:'translate(-50%,-50%) scale(1.25)',opacity:1},{transform:`translate(calc(-50% + ${z.right-8-sx}px),calc(-50% + ${z.top+z.height/2-sy}px)) scale(.7)`,opacity:.25}],{duration:240,easing:'cubic-bezier(.3,.7,.3,1)'}).onfinish=()=>{e.remove();m.classList.remove('lvp');void m.offsetWidth;m.classList.add('lvp')}}
/* ----- bulle de Ti-Nèt : d'abord elle parle, puis le clavier revient ----- */
let tbt,bbl=false;
function tsay(t,kind='tip',opt){if(typeof opt=='number')opt={ms:opt};opt=opt||{};const b=$('#tbub');if(!b||!t)return;clearTimeout(tbt);
 const len=t.replace(/<[^>]+>/g,'').length,fast=!!S.set.qb,ms=opt.ms?Math.max(opt.ms,1500+len*40):Math.min(6500,Math.max(fast?1800:2600,1500+len*45));
 b.hidden=false;b.className='tbub in '+kind;b.querySelector('p').innerHTML=t;sfx.pop();const tn=$('#tn');if(tn)tn.classList.add('talk');
 const B=document.body,seq=!opt.keep&&!fast&&FXOK()&&B.classList.contains('ck')&&!B.classList.contains('tap')&&!B.classList.contains('kbf');
 if(seq&&!bbl){bbl=true;kbOut(()=>{if(bbl)B.classList.add('bbl')})}
 tbt=setTimeout(hideBub,ms)}
function hideBub(){const b=$('#tbub'),tn=$('#tn');clearTimeout(tbt);if(tn)tn.classList.remove('talk');
 if(bbl){bbl=false;const B=document.body;if(B.classList.contains('bbl')){B.classList.remove('bbl');sfx.open();const i=$('#ans');if(i&&!$('#bar').hidden&&!B.classList.contains('tap')){try{i.focus({preventScroll:true})}catch(e){}}}}
 if(!b||b.hidden)return;b.classList.remove('in');b.classList.add('out');tbt=setTimeout(()=>{b.hidden=true;b.className='tbub'},FXOK()?260:0)}
$('#tbub').addEventListener('click',()=>hideBub());
/* ----- combo ----- */
function comboFx(n){const big=n>=5;sfx.combo(n);vib(big?[40,50,90]:[30,40,40]);const e=document.createElement('div');e.className='cbx'+(big?' big':'');e.setAttribute('role','status');e.innerHTML=ic('flame')+' COMBO x'+n+' !';document.body.appendChild(e);setTimeout(()=>e.remove(),1400);
 if(FXOK()){const m=$('#main');m.classList.remove('shk');void m.offsetWidth;m.classList.add('shk');setTimeout(()=>m.classList.remove('shk'),430);if(big)burst(24)}}
/* ----- célébrations (badge, changement de niveau) : file d'attente ----- */
const CQ=[],BQ=[];let CB=false;
const badgeCel=id=>({kind:'badge',icon:ic(BADGES[id][0]),title:'Nouveau badge !',sub:BADGES[id][1],sfx:sfx.badge});
function celebrate(o){CQ.push(o);if(!CB)nextCel()}
function nextCel(){const o=CQ.shift();if(!o){CB=false;return}CB=true;
 const e=document.createElement('div');e.className='cel '+(o.kind||'');e.setAttribute('role','dialog');e.setAttribute('aria-modal','true');e.setAttribute('aria-label',o.title+' '+(o.sub||''));
 e.innerHTML=`<div class="rays" aria-hidden="true"></div><div class="cin"><div class="cic" aria-hidden="true">${o.icon}</div><h2>${o.title}</h2><p>${o.sub||''}</p><button class="btn" id="celok">Super !</button></div>`;
 document.body.appendChild(e);if(o.sfx)o.sfx();vib([40,50,40,50,120]);if(FXOK())burst(o.kind=='lvl'?60:34);
 let off=false;const done=()=>{if(off)return;off=true;document.removeEventListener('keydown',esc);e.classList.add('out');setTimeout(()=>{e.remove();nextCel()},FXOK()?240:0)};
 const esc=ev=>{if(ev.key==='Escape'||ev.key==='Enter')done()};document.addEventListener('keydown',esc);$('#celok').onclick=done;$('#celok').focus({preventScroll:true})}
const flushBadges=()=>{const l=[...new Set(BQ.splice(0))];if(!l.length)return;if(l.length==1)celebrate(badgeCel(l[0]));else celebrate({kind:'badge',icon:ic('star'),title:l.length+' nouveaux badges !',sub:l.map(id=>BADGES[id][1]).join(' · '),sfx:sfx.badge})};
/* ----- transitions entre écrans : l'ancien décor s'efface en glissant ----- */
let LD=null;
function ghostOut(){if(!FXOK()||$('#hd').hidden||scrollY>20)return;const m=$('#main');if(!m||!m.firstElementChild||m.querySelectorAll('*').length>700)return;
 const r=m.getBoundingClientRect(),g=m.cloneNode(true);g.setAttribute('aria-hidden','true');g.inert=true;g.classList.remove('pgin');g.classList.add('ghost');
 g.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;overflow:hidden;pointer-events:none;z-index:9`;
 document.body.appendChild(g);g.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-14px) scale(.985)'}],{duration:180,easing:'ease-in'}).onfinish=()=>g.remove()}
function sheetGhost(){const s=$('#sheet');if(s.hidden||!s.firstElementChild)return;sfx.close();if(!FXOK())return;const g=s.cloneNode(true);g.setAttribute('aria-hidden','true');g.inert=true;g.style.pointerEvents='none';document.body.appendChild(g);
 g.animate([{opacity:1},{opacity:0}],{duration:200,easing:'ease-in'});const sh=g.querySelector('.sh');if(sh)sh.animate([{transform:'none'},{transform:'translateY(46px)'}],{duration:200,easing:'ease-in'});setTimeout(()=>g.remove(),210)}
/* ----- carte des étapes : l'étape finie éclate, la suivante s'allume ----- */
function fxLevel(i){if(!LD||!D[i]||D[i].id!==LD.id)return;const ns=[...document.querySelectorAll('#main .node')],d=ns[LD.k],u=ns[LD.k+1];LD=null;if(!FXOK())return;
 if(d)d.classList.add('just');if(u){u.classList.add('unl');setTimeout(()=>{sfx.star(1);sparks(u.querySelector('.c')||u,10);try{u.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}},750)}
 setTimeout(()=>{if(d)d.classList.remove('just');if(u)u.classList.remove('unl')},2000)}
/* ----- carnet : la nouvelle fiche se retourne ----- */
function fxCarnet(){const L=S.newf||[];if(!L.length)return;S.newf=[];save();if(!FXOK())return;
 document.querySelectorAll('.cn').forEach(b=>{if(L.includes(D[+b.dataset.i].id+'-'+b.dataset.k)){b.classList.add('flipin');setTimeout(()=>{sfx.star(2);sparks(b,12)},550);try{b.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}})}
/* ----- voix : ondes sonores sur le bouton Écouter ----- */
const setSpeaking=on=>document.body.classList.toggle('speaking',on);
/* ----- défilement : apparition, focus, parallaxe, chemin qui se dessine, compteurs ----- */
let SCR=null;
function scrOff(){if(!SCR)return;removeEventListener('scroll',SCR.on);removeEventListener('resize',SCR.on);cancelAnimationFrame(SCR.raf);SCR.io.forEach(i=>i&&i.disconnect());SCR.fx.forEach(e=>e.remove());document.body.classList.remove('fxs');SCR=null}
function revealInit(sel,all,stag){const els=[...document.querySelectorAll(sel)];if(!els.length)return null;const vh=innerHeight,
 io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
 els.forEach((el,i)=>{if(!all&&el.getBoundingClientRect().top<vh*.9)return;el.classList.add('rv');el.style.setProperty('--d',(stag?i*stag:(i%3)*70)+'ms');io.observe(el)});return io}
function countInit(sel){const els=[...document.querySelectorAll(sel)];if(!els.length)return null;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){countUp(e.target);io.unobserve(e.target)}}),{threshold:.6});els.forEach(e=>io.observe(e));return io}
function focusInit(sel,inner){const els=[...document.querySelectorAll(sel)];return()=>{const c=innerHeight*.5;els.forEach(el=>{const t=inner?el.querySelector(inner):el;if(!t)return;const r=el.getBoundingClientRect(),d=Math.min(Math.abs(r.top+r.height/2-c)/innerHeight,.6);t.style.setProperty('--sc',(1.07-d*.2).toFixed(3))})}}
function leavesInit(){return[['banane','left',.16],['coco','right',.3]].map(([n,side,k])=>{const e=document.createElement('img');e.src='img/deco/'+n+'.webp';e.alt='';e.setAttribute('aria-hidden','true');e.className='plx';e.style.cssText=`width:104px;${side}:-30px;top:58px`;e.dataset.k=k;document.body.appendChild(e);return e})}
function pathInit(){const map=document.querySelector('#main .map');if(!map)return null;const ns=[...map.querySelectorAll('.node')];if(ns.length<2)return null;
 if(getComputedStyle(map).position=='static')map.style.position='relative';const R=map.getBoundingClientRect(),
 pts=ns.map(n=>{const c=n.querySelector('.c')||n,r=c.getBoundingClientRect();return[r.left+r.width/2-R.left,r.top+r.height/2-R.top]}),
 hasCur=ns.some(n=>n.classList.contains('cur')),di=hasCur?Math.max(0,ns.findIndex(n=>n.classList.contains('cur'))):ns.length-1;
 let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dy=(b[1]-a[1])/2,sw=(i%2?1:-1)*24;d+=` C${a[0]+sw},${a[1]+dy} ${b[0]+sw},${b[1]-dy} ${b[0]},${b[1]}`}
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','trail');svg.setAttribute('aria-hidden','true');svg.setAttribute('width',R.width);svg.setAttribute('height',R.height);
 svg.innerHTML=`<defs><clipPath id="trc"><rect id="trr" x="-40" y="0" width="${R.width+80}" height="0"/></clipPath></defs><path d="${d}" class="tr0"/><path d="${d}" class="tr1" clip-path="url(#trc)"/>`;map.prepend(svg);
 return{map,rect:svg.querySelector('#trr'),target:pts[di][1],y:0,svg}}
function fxScroll(fn){scrOff();if(!FXOK())return;const nm=fn.name,io=[],fx=[],ticks=[],me={io,fx,raf:0};SCR=me;
 requestAnimationFrame(()=>{if(SCR!==me)return;
  if(nm=='level'){io.push(revealInit('.map .node'));ticks.push(focusInit('.map .node','.c'));fx.push(...leavesInit());const P=pathInit();if(P){fx.push(P.svg);ticks.push(()=>{const top=P.map.getBoundingClientRect().top,want=Math.max(0,Math.min(P.target+8,innerHeight*.78-top));P.y+=(want-P.y)*.14;if(Math.abs(want-P.y)<1)P.y=want;P.rect.setAttribute('height',P.y);return Math.abs(want-P.y)>=1})}
   const cur=document.querySelector('.map .node.cur');if(cur){const r=cur.getBoundingClientRect();if(Math.abs(r.top+r.height/2-innerHeight/2)>innerHeight*.28)setTimeout(()=>{if(SCR===me)cur.scrollIntoView({block:'center',behavior:'smooth'})},500)}}
  else if(nm=='home'){io.push(revealInit('.lvl,#abh'));fx.push(...leavesInit())}
  else if(nm=='carnet'){io.push(revealInit('.cn'));ticks.push(focusInit('.cn','.cim'))}
  else if(nm=='prof'){io.push(revealInit('.bd',true,70),revealInit('#main>.card'),countInit('.rw .cu'))}
  else if(nm=='reader'){io.push(revealInit('.txt p'));const b=document.createElement('i');b.className='rdp';b.setAttribute('aria-hidden','true');document.body.appendChild(b);fx.push(b);ticks.push(()=>{const h=document.documentElement.scrollHeight-innerHeight;b.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%'})}
  else if(nm=='train'||nm=='dailyScreen')io.push(revealInit('#main>.card'));
  document.body.classList.add('fxs');
  me.on=()=>{if(me.raf)return;me.raf=requestAnimationFrame(function f(){me.raf=0;let more=false;for(const t of ticks)if(t()===true)more=true;fx.forEach(e=>{if(e.classList&&e.classList.contains('plx'))e.style.transform=`translateY(${-Math.min(scrollY*e.dataset.k,170)}px)`});if(more)me.raf=requestAnimationFrame(f)})};
  addEventListener('scroll',me.on,{passive:true});addEventListener('resize',me.on);me.on()})}

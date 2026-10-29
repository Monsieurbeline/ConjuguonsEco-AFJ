/* état et réglages */
const DEF={music:true,sfx:true,fsc:true,fs:1,dys:false,hc:false,rm:false,nt:false,vox:false};
let S={done:{},photo:null,name:'',xp:0,coins:0,streak:0,last:'',badges:[],daily:{},days:{},td:null,verbs:0,err:{},qbest:0,sr:{},freeze:0,set:{}};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
S.set=Object.assign({},DEF,S.set);if(S.mute){S.set.sfx=S.set.music=false;delete S.mute}S.err=S.err||{};S.sr=S.sr||{};S.freeze=S.freeze||0;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
function applySet(){const r=document.documentElement,t=S.set;r.style.setProperty('--fs',[.92,1,1.22][t.fs]);r.classList.toggle('dys',t.dys);r.classList.toggle('hc',t.hc);r.classList.toggle('rm',t.rm)}
const ic=(n,c='')=>`<svg class="ic ${c}" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const norm=t=>t.toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ').replace(/[.!,;:]+$/,'').trim();
const strip=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const lvlOf=x=>1+Math.floor(Math.sqrt(x/40)),today=(d=new Date())=>d.toLocaleDateString('sv');
const dayDiff=(a,b)=>Math.round((new Date(b+'T12:00')-new Date(a+'T12:00'))/864e5),addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return today(d)};
if(S.last){const d=dayDiff(S.last,today());if(d>2||(d==2&&!S.freeze))S.streak=0}
/* répétition espacée : un verbe raté revient après 1, 3 puis 7 jours */
const SR=[1,3,7],dueErr=()=>Object.keys(S.err).filter(k=>!S.sr[k]||S.sr[k].d<=today());
function srKo(ek){S.sr[ek]={b:0,d:addDays(SR[0])}}
function srOk(ek){if(!S.err[ek])return false;const r=S.sr[ek];if(r&&r.d>today())return false;const b=(r?r.b:0)+1;if(b>=SR.length){delete S.err[ek];delete S.sr[ek];return true}S.sr[ek]={b,d:addDays(SR[b])};return false}
const nz=t=>norm(t).replace(/[‐‑–-]/g,' ').replace(/œ/g,'oe').replace(/\s+/g,' ').trim(),same=(v,a)=>nz(v)===nz(a);
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
function touchStreak(){const t=today();S.days=S.days||{};S.days[t]=1;if(S.last===t)return;const d=S.last?dayDiff(S.last,t):9;
 if(d==1)S.streak++;else if(d==2&&S.freeze>0){S.freeze--;S.streak++;setTimeout(()=>toast(ic('flame')+' Ton gel de série a sauvé ta série !'),900)}else S.streak=1;
 S.last=t;if(S.streak>=3)award('streak3')}
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
function preload(on){const A=['img/titre-fond.webp','img/enseigne.webp','img/tinet-tete.webp','img/deco/banane.webp','img/deco/coco.webp','img/deco/herbe.webp','img/qr.png','img/logo.png','img/tinet.png','img/tinet-ok.png','img/tinet-cheer.png','img/logo-afj.jpg','img/logo-oif.jpg','img/banniere.jpg',...D.map(l=>`img/bg-${l.id}.jpg`)];let n=0;A.forEach(u=>{const i=new Image();i.onload=i.onerror=()=>on(++n/A.length);i.src=u})}
/* plein écran : demandé au premier toucher (le navigateur l’exige), réglable dans le profil.
   Dans l’application installée lancée en plein écran par le manifest, il n’y a rien à demander. */
const fsInstalled=()=>matchMedia('(display-mode: fullscreen)').matches;
const fsCan=()=>!!(document.fullscreenEnabled&&document.documentElement.requestFullscreen);
function fsApply(){try{
 if(S.set.fsc){if(fsCan()&&!document.fullscreenElement&&!fsInstalled())return document.documentElement.requestFullscreen({navigationUI:'hide'}).then(()=>true,()=>false)}
 else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
}catch(e){}return Promise.resolve(false)}
let fsArm=true;
function fsTap(){if(!fsArm||!S.set.fsc)return;fsApply().then(ok=>{if(ok)fsArm=false})}
['pointerup','touchend','keydown'].forEach(t=>document.addEventListener(t,fsTap,{passive:true}));
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&!document.hidden)fsArm=false});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)fsArm=true});

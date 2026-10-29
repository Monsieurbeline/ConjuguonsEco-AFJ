/* en-tête, navigation */
function chips(){const l=lvlOf(S.xp);$('#chips').innerHTML=`<span class="chip" aria-label="Série : ${S.streak} jours">${ic('flame','fl')}${S.streak}</span><span class="chip" aria-label="${S.coins} pièces">${ic('coin','cn')}${S.coins}</span><span class="chip" aria-label="Niveau ${l}">${ic('star','st')}Niv. ${l}</span>`;$('#hav').classList.toggle('dot',!S.daily[today()]);$('#hav').innerHTML=S.photo?`<img src="${S.photo}" alt="">`:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="13" r="6" fill="#92400e" opacity=".55"/><path d="M4 32c0-8 6-11 12-11s12 3 12 11z" fill="#92400e" opacity=".55"/></svg>';$('#snd').innerHTML=ic(S.set.music?'snd':'mute');$('#snd').setAttribute('aria-label',S.set.music?'Couper la musique d’ambiance':'Activer la musique d’ambiance');$('#snd').setAttribute('aria-pressed',S.set.music)}
function theme(l){const r=document.documentElement.style;r.setProperty('--c1',l?l.c1:'#43a51c');r.setProperty('--c2',l?l.c2:'#a6e05a')}
let nav=[],Q=null;
const BGM={level:'map',intro:'map',home:'map',welcome:'map',dailyScreen:'dawn',train:'forest',quizRun:'forest',quizEnd:'forest',carnet:'forest',reader:'forest',prof:'camp',play:'calm',splash:'map'};
function setBg(n,a){let lv=D[S.start||0].id;if(n=='level'||n=='intro'||n=='reader')lv=D[a[0]].id;else if(n=='home'){const nx=nextStep();lv=D[nx?nx[0]:0].id}else if(n=='play'&&a[0]&&a[0].mode=='step')lv=D[a[0].i].id;
 const st=n=='intro'||n=='reader'?[a[0],a[1]]:n=='play'&&a[0]&&a[0].mode=='step'?[a[0].i,a[0].k]:null;
 $('#bgl').className='bgl '+(st?'step s'+st[1]:BGM[n]||'map')+' '+lv;stepBg(st)}
/* fond d'écran propre à chaque étape : img/A1-1.jpg … B2-4.jpg (ou .webp). Sans image : décor provisoire (classes .step.s0 à .s3) */
const SBG={tok:0,cache:{},cur:null},stepKey=(i,k)=>D[i].id+'-'+(k+1);
function findImg(key){if(SBG.cache[key]!==undefined)return Promise.resolve(SBG.cache[key]);
 return new Promise(res=>{const t=[`img/${key}.jpg`,`img/${key}.webp`],next=()=>{const u=t.shift();if(!u){SBG.cache[key]=null;return res(null)}const im=new Image();im.onload=()=>{SBG.cache[key]=u;res(u)};im.onerror=next;im.src=u};next()})}
function stepBg(st){const t=++SBG.tok,box=$('#sbg'),b=document.body;
 if(!st){SBG.cur=null;box.classList.remove('on');b.classList.remove('sbon');setTimeout(()=>{if(!box.classList.contains('on'))box.innerHTML=''},900);return}
 const key=stepKey(...st);if(SBG.cur===key&&box.classList.contains('on'))return;
 findImg(key).then(u=>{if(t!==SBG.tok)return;
  if(!u){SBG.cur=null;box.classList.remove('on');b.classList.remove('sbon');return}
  SBG.cur=key;const L=document.createElement('div');L.className='sl';L.innerHTML=`<i class="bl" style="background-image:url(${u})"></i><i class="im" style="background-image:url(${u})"></i>`;box.appendChild(L);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{[...box.children].forEach(c=>{if(c!==L)c.classList.remove('on')});L.classList.add('on')}));
  setTimeout(()=>[...box.children].forEach(c=>{if(c!==L&&!c.classList.contains('on'))c.remove()}),1000);
  box.classList.add('on');b.classList.add('sbon');
  if(st[1]+1<D[st[0]].steps.length)findImg(stepKey(st[0],st[1]+1))})}
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

/* partage de la progression : carte image générée sur place. Le prénom et la photo n’y figurent que si le joueur les a renseignés et laisse l’option activée */
const FONT='ui-rounded,"Arial Rounded MT Bold","Trebuchet MS",system-ui,sans-serif',CD={c1:'#43a51c',c2:'#a6e05a'};
const loadImg=u=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u});
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function wrapTxt(x,t,w){const o=[];let l='';String(t).split(' ').forEach(m=>{const n=l?l+' '+m:m;if(x.measureText(n).width>w&&l){o.push(l);l=m}else l=n});if(l)o.push(l);return o}
function starP(x,cx,cy,R){x.beginPath();for(let i=0;i<10;i++){const r=i%2?R*.45:R,a=-Math.PI/2+i*Math.PI/5;x[i?'lineTo':'moveTo'](cx+r*Math.cos(a),cy+r*Math.sin(a))}x.closePath()}
async function cardBlob(o){
 const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
 const[sign,ban,coc,her,qr,afj,oif,bg,pic]=await Promise.all([loadImg('img/enseigne.webp'),loadImg('img/deco/banane.webp'),loadImg('img/deco/coco.webp'),loadImg('img/deco/herbe.webp'),loadImg('img/qr.png'),loadImg('img/logo-afj.jpg'),loadImg('img/logo-oif.jpg'),o.bg?loadImg(o.bg):null,o.me&&o.me.photo?loadImg(o.me.photo):null]);
 const g=x.createLinearGradient(0,0,W*.6,H);g.addColorStop(0,o.c2);g.addColorStop(1,o.c1);x.fillStyle=g;x.fillRect(0,0,W,H);
 if(bg){const s=Math.max(W/bg.width,H/bg.height),w=bg.width*s,h=bg.height*s;x.drawImage(bg,(W-w)/2,(H-h)/2,w,h);const v=x.createLinearGradient(0,0,0,H);v.addColorStop(0,'rgba(0,0,0,.05)');v.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=v;x.fillRect(0,0,W,H)}
 else{x.fillStyle='rgba(255,255,255,.14)';[[120,260,190],[960,180,130],[1000,980,240],[60,1100,150]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()})}
 if(ban){const w=270;x.drawImage(ban,-30,-10,w,ban.height*w/ban.width)}
 if(coc){const w=270;x.drawImage(coc,W-w+30,-10,w,coc.height*w/coc.width)}
 if(sign){const w=370,h=sign.height*w/sign.width;x.save();x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=18;x.shadowOffsetY=8;x.drawImage(sign,(W-w)/2,10,w,h);x.restore()}
 const py=450,ph=570;
 x.save();x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=40;x.shadowOffsetY=14;rr(x,60,py,960,ph,56);x.fillStyle='rgba(255,255,255,.96)';x.fill();x.restore();
 x.textAlign='center';x.textBaseline='alphabetic';
 x.fillStyle='#25401a';x.font='900 78px '+FONT;const tl=wrapTxt(x,o.title,860).slice(0,2);tl.forEach((t,i)=>x.fillText(t,W/2,py+120+i*88));
 let y=py+120+(tl.length-1)*88+66;x.fillStyle='#5f7a52';x.font='700 40px '+FONT;wrapTxt(x,o.sub||'',860).slice(0,2).forEach((t,i)=>x.fillText(t,W/2,y+i*50));
 if(o.stars!=null)for(let i=0;i<3;i++){const cx=W/2+(i-1)*140,cy=py+ph-225;starP(x,cx,cy,58);x.fillStyle=i<o.stars?'#ffc928':'#dfe7d6';x.fill();x.lineWidth=6;x.lineJoin='round';x.strokeStyle=i<o.stars?'#b07f00':'#b9c6ad';x.stroke()}
 const n=(o.stats||[]).length;(o.stats||[]).forEach(([v,l],i)=>{const cx=60+960*(i+.5)/n;x.fillStyle=o.c1;x.font='900 56px '+FONT;x.fillText(String(v),cx,py+ph-92);x.fillStyle='#5f7a52';x.font='700 28px '+FONT;x.fillText(l,cx,py+ph-48)});
 if(her){const w=W+40,h=her.height*w/her.width;x.drawImage(her,-20,H-h+14,w,h)}
 if(qr){const s=205,a=W-60-s,b=1022;x.save();x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=14;x.shadowOffsetY=6;rr(x,a,b,s,s,24);x.fillStyle='#fff';x.fill();x.restore();x.imageSmoothingEnabled=false;x.drawImage(qr,a+10,b+10,185,185);x.imageSmoothingEnabled=true}
 if(o.me){const cx=200,cy=1066,R=72,nm=(o.me.name||'').trim();
  x.save();x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=14;x.shadowOffsetY=8;x.beginPath();x.arc(cx,cy,R+8,0,7);x.fillStyle='#f47b20';x.fill();x.restore();
  x.save();x.beginPath();x.arc(cx,cy,R,0,7);x.clip();
  if(pic){const q=Math.min(pic.width,pic.height);x.drawImage(pic,(pic.width-q)/2,(pic.height-q)/2,q,q,cx-R,cy-R,2*R,2*R)}
  else{x.fillStyle='#fde68a';x.fillRect(cx-R,cy-R,2*R,2*R);x.fillStyle='#92400e';x.font='900 100px '+FONT;x.textBaseline='middle';x.fillText((nm||'?')[0].toUpperCase(),cx,cy+6)}
  x.restore();x.textBaseline='alphabetic';
  if(nm){let fs=44;x.font='900 '+fs+'px '+FONT;while(x.measureText(nm).width>250&&fs>24){fs-=2;x.font='900 '+fs+'px '+FONT}
   const pw=x.measureText(nm).width+44,ph2=fs+26,py2=cy+R+22;x.save();x.shadowColor='rgba(0,0,0,.25)';x.shadowBlur=10;x.shadowOffsetY=5;rr(x,cx-pw/2,py2,pw,ph2,ph2/2);x.fillStyle='rgba(255,255,255,.97)';x.fill();x.restore();
   x.fillStyle='#25401a';x.fillText(nm,cx,py2+ph2/2+fs*.35)}}
 x.save();rr(x,60,1236,960,86,28);x.fillStyle='rgba(255,255,255,.95)';x.fill();x.restore();
 const lh=48;[[afj,'l'],[oif,'r']].forEach(([im,sd])=>{if(!im)return;const w=im.width*lh/im.height;x.drawImage(im,sd=='l'?84:W-84-w,1255,w,lh)});
 x.fillStyle='#25401a';x.font='900 22px '+FONT;x.fillText(SITE.replace(/^https?:\/\//,'').replace(/\/$/,''),W/2,1288);
 return new Promise(r=>c.toBlob(r,'image/png'))}
let SHU=null;
function shared(){S.shares=(S.shares||0)+1;save();award('share')}
async function shareSheet(o){
 const o0=o;o={...CD,...o};const hasMe=!!(S.name||S.photo);o.me=hasMe&&S.shareMe!==false?{name:S.name||'',photo:S.photo||null}:null;toast('Je prépare ta carte…');
 let blob;try{blob=await cardBlob(o)}catch(e){blob=null}
 const msg=o.text+'\n'+SITE;
 if(!blob){if(navigator.share)navigator.share({text:o.text,url:SITE,title:'ConjuguonsEco'}).then(shared).catch(()=>{});else toast('Le partage n’est pas disponible ici.');return}
 const url=SHU=URL.createObjectURL(blob),file=new File([blob],'conjuguonseco.png',{type:'image/png'}),canF=!!(navigator.canShare&&navigator.canShare({files:[file]}));
 sheet('Partager ma progression',`<h2 class="dh">${ic('share')} Partager</h2><img class="shimg" src="${url}" alt="Carte de partage : ${esc(o.title)}">${hasMe?`<div class="swr"><span id="l-me">Mon prénom et ma photo sur la carte</span><button class="tg ${o.me?'on':''}" role="switch" aria-checked="${!!o.me}" aria-labelledby="l-me" id="shme"><i></i></button></div>`:`<p class="small" style="text-align:center">Ajoute ton prénom et ta photo dans ton profil pour les voir sur la carte.</p>`}`+
  (navigator.share?`<button class="btn g" id="sh1">${ic('share')}Partager…</button>`:'')+
  `<a class="btn w" id="sh2" href="${url}" download="conjuguonseco.png">Enregistrer l’image</a><button class="btn w" id="sh3">Copier le message</button><a class="btn w" id="sh4" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg)}">WhatsApp</a>`);
 const tm=$('#shme');if(tm)tm.onclick=()=>{S.shareMe=!(S.shareMe!==false);save();closeSheet();shareSheet(o0)};
 const b1=$('#sh1');if(b1)b1.onclick=async()=>{try{await navigator.share(canF?{files:[file],text:msg,title:'ConjuguonsEco'}:{text:o.text,url:SITE,title:'ConjuguonsEco'});shared()}catch(e){}};
 $('#sh2').onclick=()=>shared();$('#sh4').onclick=()=>shared();
 $('#sh3').onclick=()=>{const ok=()=>{toast('Message copié !');shared()};try{navigator.clipboard.writeText(msg).then(ok,()=>toast('Copie impossible : sélectionne le texte à la main.'))}catch(e){toast('Copie impossible sur cet appareil.')}}}
/* sauvegarde de la progression : fichier ou code à copier */
const b64=t=>btoa(unescape(encodeURIComponent(t))),unb64=t=>decodeURIComponent(escape(atob(t)));
const exportCode=()=>'CE1:'+b64(JSON.stringify(S));
function parseSave(txt){try{txt=String(txt).trim();const j=JSON.parse(txt.startsWith('CE1:')?unb64(txt.slice(4).replace(/\s+/g,'')):txt);if(!j||typeof j!='object'||typeof j.done!='object'||typeof j.xp!='number')return null;return j}catch(e){return null}}
function restore(j){S=Object.assign({done:{},photo:null,name:'',xp:0,coins:0,streak:0,last:'',badges:[],daily:{},days:{},td:null,verbs:0,err:{},qbest:0,sr:{},freeze:0,set:{}},j);S.set=Object.assign({},DEF,S.set);S.err=S.err||{};S.sr=S.sr||{};S.freeze=S.freeze||0;S.seen=true;save();applySet();nav=[];closeSheet();show(home)}
function exportSheet(){const code=exportCode(),name='conjuguonseco-sauvegarde-'+today()+'.json';
 sheet('Exporter ma progression',`<h2 class="dh">${ic('book')} Exporter</h2><p>Garde ce fichier ou ce code. Pour les remettre : Profil, puis « Importer une sauvegarde ».</p><textarea class="sv" id="svt" readonly rows="4" aria-label="Code de sauvegarde">${code}</textarea><button class="btn g" id="svf">Enregistrer le fichier</button><button class="btn w" id="svc">Copier le code</button>`);
 $('#svf').onclick=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Fichier enregistré.')};
 $('#svc').onclick=()=>{$('#svt').select();try{navigator.clipboard.writeText(code).then(()=>toast('Code copié !'),()=>toast('Sélectionne le code et copie-le.'))}catch(e){toast('Sélectionne le code et copie-le.')}}}
function importSheet(){
 sheet('Importer une sauvegarde',`<h2 class="dh">${ic('book')} Importer</h2><p>Colle le code, ou choisis le fichier de sauvegarde. <b>Cela remplace la progression de ce téléphone.</b></p><textarea class="sv" id="svt" rows="4" placeholder="CE1:…" aria-label="Code de sauvegarde"></textarea><input type="file" id="svi" accept=".json,.txt,application/json,text/plain" hidden><button class="btn w" id="svp">Choisir un fichier</button><button class="btn g" id="svr">Restaurer</button>`);
 $('#svp').onclick=()=>$('#svi').click();
 $('#svi').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#svt').value=String(r.result).slice(0,3e6)};r.readAsText(f)};
 $('#svr').onclick=()=>{const j=parseSave($('#svt').value);if(!j){toast('Sauvegarde non reconnue.');return}if(confirm('Remplacer ta progression actuelle par cette sauvegarde ?')){restore(j);toast('Progression restaurée !')}}}
/* installation sur l'écran d'accueil (Android / Chrome) */
let DIP=null;const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();DIP=e});
addEventListener('appinstalled',()=>{DIP=null;S.noinst=today();save()});
const installCard=()=>DIP&&!standalone()&&Object.keys(S.done).length&&(!S.noinst||dayDiff(S.noinst,today())>=7)?`<div class="card inst"><b>${ic('play')} Installe le jeu</b><p class="small" style="margin:4px 0 0">Joue depuis l’écran d’accueil, même sans connexion.</p><button class="btn g" id="ins">Installer</button><button class="btn w" id="ino">Plus tard</button></div>`:'';
/* nouvelle version prête */
function updBanner(){if($('#upd'))return;const d=document.createElement('div');d.id='upd';d.setAttribute('role','status');d.innerHTML=`<span>Nouvelle version prête.</span><button type="button" id="updgo">Actualiser</button><button type="button" id="updx" aria-label="Plus tard">${ic('x')}</button>`;document.body.appendChild(d);$('#updgo').onclick=()=>location.reload();$('#updx').onclick=()=>d.remove()}
/* images et son pour jouer hors-ligne : une fois par jour, sauf connexion lente, mobile ou économiseur de données */
function prefetchAll(){const c=navigator.connection||{};if(!navigator.onLine||c.saveData||c.type=='cellular'||/^(slow-2g|2g|3g)$/.test(c.effectiveType||''))return;const t=Date.now();if(S.pre&&t-S.pre<864e5)return;S.pre=t;save();
 const L=[];D.forEach(l=>{L.push([`img/bg-${l.id}.jpg`]);l.steps.forEach((_,k)=>L.push([`img/${l.id}-${k+1}.jpg`,`img/${l.id}-${k+1}.webp`],[`img/fiche-${l.id}-${k+1}.jpg`]))});L.push(['audio/ambiance.mp3']);
 let i=0;const next=()=>{if(i>=L.length)return;const[a,b]=L[i++];fetch(a).then(r=>{if(!r.ok&&b)return fetch(b)}).catch(()=>{}).then(()=>setTimeout(next,300))};setTimeout(next,5000)}

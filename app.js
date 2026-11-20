/* --- crash safety net: never leave a blank/white page, offer a real fix --- */
let _crashed=0;
function _showCrash(ev){if(_crashed)return;if(ev&&ev.target&&ev.target!==window)return;
if(window.__booted){try{console.warn('RoastED recovered from an error:',ev&&(ev.reason||ev.error||ev.message))}catch(_){}return}
_crashed=1;
try{document.body.innerHTML='<div style="padding:60px 24px;text-align:center;font-family:system-ui,sans-serif;max-width:420px;margin:0 auto">'
+'<div style="font-size:40px;margin-bottom:10px">🫠</div>'
+'<h2 style="margin:0 0 8px">Something glitched</h2>'
+'<p style="color:#666;margin:0 0 20px">This usually means an old cached copy got stuck. Tap below to force a clean reload.</p>'
+'<button id="_hardReload" style="padding:14px 28px;border-radius:30px;background:#D93025;color:#fff;border:0;font-size:16px;cursor:pointer">🔄 Force fresh reload</button>'
+'</div>';
const b=document.getElementById('_hardReload');
if(b)b.onclick=()=>{b.disabled=true;let done=0;const go=()=>{if(!done){done=1;location.reload()}};const jobs=[];try{
if('serviceWorker' in navigator)jobs.push(navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))));
if(window.caches)jobs.push(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))));
}catch(e){}
Promise.all(jobs.map(j=>j.catch(()=>{}))).then(go);setTimeout(go,5000)}
}catch(e){}}
window.addEventListener('error',_showCrash);
window.addEventListener('unhandledrejection',_showCrash);
const $=id=>document.getElementById(id),pick=a=>a[Math.floor(Math.random()*a.length)];
const TOP=['food','travel','sports','culture','dailylife','greet','adj','basic','num','col','time','thalpha','pres','past','fut','neg','ques','pron','verbs','months','dir'],SENT=TOP.slice(0,5),VOC=TOP.slice(5),FLAG={it:'Italiano',en:'English',fr:'Français',de:'Deutsch',th:'ไทย',af:'Afrikaans'};
const GRAMMAR=['pres','past','fut','neg','ques'],TENSE=['pres','past','fut','neg','ques'];
function topicItems(tp,lv){const a=RE[S.n][tp]||[];return TENSE.includes(tp)?a.filter(e=>(e.lv||1)===lv):a}
function studyItems(tp,lv){const a=topicItems(tp,lv);if(BEGIN_ONLY.includes(tp)&&S.qs){const q=new Set(S.qs.map(x=>x.s));return a.filter(e=>q.has(e.s))}return !TENSE.includes(tp)&&a.length>=30?a.slice((lv-1)*10,lv*10):a}
const DISPLAY_ORDER=['num','col','greet','pron','basic','verbs','time','months','adj','dir','pres','past','fut','neg','ques','food','travel','sports','culture','dailylife'];
const DISPLAY_ORDER_TH=['thalpha','greet','pron','basic','verbs','adj','num','col','time','months','dir','food','travel','sports','culture','dailylife'];
function curOrder(){const o=S.t==='th'?DISPLAY_ORDER_TH:DISPLAY_ORDER;return S.lvl>1?o.filter(k=>!BEGIN_ONLY.includes(k)):o}
const BEGIN_ONLY=['col'];
const FL={"it": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 3 2\"><rect width=\"1\" height=\"2\" fill=\"#009246\"/><rect x=\"1\" width=\"1\" height=\"2\" fill=\"#fff\"/><rect x=\"2\" width=\"1\" height=\"2\" fill=\"#ce2b37\"/></svg>", "fr": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 3 2\"><rect width=\"1\" height=\"2\" fill=\"#0055a4\"/><rect x=\"1\" width=\"1\" height=\"2\" fill=\"#fff\"/><rect x=\"2\" width=\"1\" height=\"2\" fill=\"#ef4135\"/></svg>", "de": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 5 3\"><rect width=\"5\" height=\"1\" fill=\"#000\"/><rect y=\"1\" width=\"5\" height=\"1\" fill=\"#dd0000\"/><rect y=\"2\" width=\"5\" height=\"1\" fill=\"#ffce00\"/></svg>", "th": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 6 4\"><rect width=\"6\" height=\"4\" fill=\"#a51931\"/><rect y=\"1\" width=\"6\" height=\"2\" fill=\"#fff\"/><rect y=\"1.5\" width=\"6\" height=\"1\" fill=\"#2d2a4a\"/><rect y=\"1\" width=\"6\" height=\".5\" fill=\"#fff\"/><rect y=\"2.5\" width=\"6\" height=\".5\" fill=\"#fff\"/></svg>", "en": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 60 30\"><rect width=\"60\" height=\"30\" fill=\"#012169\"/><path d=\"M0 0L60 30M60 0L0 30\" stroke=\"#fff\" stroke-width=\"6\"/><path d=\"M0 0L60 30M60 0L0 30\" stroke=\"#c8102e\" stroke-width=\"2\"/><path d=\"M30 0V30M0 15H60\" stroke=\"#fff\" stroke-width=\"10\"/><path d=\"M30 0V30M0 15H60\" stroke=\"#c8102e\" stroke-width=\"6\"/></svg>", "af": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 9 6\"><rect width=\"9\" height=\"3\" fill=\"#de3831\"/><rect y=\"3\" width=\"9\" height=\"3\" fill=\"#002395\"/><path d=\"M0 0L3.6 3 0 6M3.6 3H9\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.2\"/><path d=\"M0 0L3.6 3 0 6M3.6 3H9\" fill=\"none\" stroke=\"#007a4d\" stroke-width=\"1.2\"/><path d=\"M0 .7L2.3 3 0 5.3z\" fill=\"#000\" stroke=\"#ffb612\" stroke-width=\".5\"/></svg>"};
const S={n:'it',t:'en',topic:'food',i:0,sc:0,qs:[],bq:null,mute:0,wrong:[],say:'',retry:0,res:'',lvl:1,boss:0,pool:[]};
const T={},OPEN={};
const u=()=>T[S.n];
let AC;function beep(f){if(S.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+.15)}catch(e){}}
function mood(){}
function cap(x){return x?x.charAt(0).toUpperCase()+x.slice(1):x}
function btns(id,codes,cur,fn){const box=$(id),nat=id==='natOpts';box.innerHTML='';codes.forEach(c=>{const b=document.createElement('button');b.className='lang-choice-btn'+(c===cur?' active':'');b.setAttribute('aria-pressed',c===cur);const im=document.createElement('img');im.className='flag';im.alt='';im.src='data:image/svg+xml,'+encodeURIComponent(FL[c]);const sp=document.createElement('span');sp.textContent=nat?FLAG[c]:cap((T[S.n]&&T[S.n].langs&&T[S.n].langs[c])||FLAG[c]);b.appendChild(im);b.appendChild(sp);b.onclick=()=>fn(c);box.appendChild(b)})}
function menus(){btns('natOpts',['it','en','fr','de','th','af'],S.n,c=>{S.n=c;if(S.t===c)S.t=Object.keys(FLAG).find(x=>x!==c);S.lvl=1;S.boss=0;stopTalk();let hadTgt=null;try{hadTgt=localStorage.getItem('roasted_target')}catch(e){}loadData(c).then(()=>{try{localStorage.setItem('roasted_native',c)}catch(e){}
if(hadTgt&&FLAG[hadTgt]&&hadTgt!==c){S.t=hadTgt;texts();start();nav('Home')}else{S.t=null;texts();nav('Home')}
}).catch(()=>{})});btns('tgtOpts',Object.keys(FLAG).filter(c=>c!==S.n),S.t,c=>{stopTalk();S.t=c;S.lvl=1;S.boss=0;try{localStorage.setItem('roasted_target',c)}catch(e){}menus();start();nav('Menu')})}
function texts(){const t=u();document.documentElement.lang=S.n;document.title='RoastED · '+t.h;menus();$('natLbl').textContent=t.nat;$('tgtLbl').textContent=t.tgt;$('headline').textContent=t.h;$('sub').textContent=t.sub;$('charImg').src='images/'+t.img+'.webp';$('caption').textContent=t.cap;$('fixT').textContent=t.fixT;$('fixD').textContent=t.fixD;$('fixIn').placeholder=t.fixPh;$('fixBtn').textContent=t.fixBtn;$('newBtn').textContent=t.newS;
const box=$('topics');box.innerHTML='';curOrder().forEach(k=>{const i=TOP.indexOf(k);const d=document.createElement('button');d.type='button';d.setAttribute('aria-pressed',k===S.topic);d.className='topic-pill'+(k===S.topic?' active':'');d.textContent=t.topics[i];d.onclick=()=>{stopTalk();S.topic=k;S.lvl=1;S.boss=0;texts();start()};box.appendChild(d)})}
function mapq(e){return Object.assign({s:e.s},e.t[S.t])}
function pool(){if(S.boss){let a=[];for(const tp of SENT)a=a.concat(RE[S.n][tp].filter(e=>e.t[S.t]).map(mapq));shuf(a);const ms=new Set(load().mis[S.n+S.t]||[]),m=a.filter(x=>ms.has(x.s)).slice(0,10);return m.concat(a.filter(x=>!m.includes(x)))}
const src=topicItems(S.topic,S.lvl).filter(e=>e.t[S.t]);if(VOC.includes(S.topic))return src.map(mapq);return src.filter(e=>!e.lv).map(mapq).sort((x,y)=>x.f.length-y.f.length).concat(src.filter(e=>e.lv).map(mapq))}
function start(){S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.wr=0;S.review=0;S.undoUsed=0;S.story=0;S.numset=0;S.pool=pool();const x=X[S.n];S.qs=S.boss?S.pool.slice(0,20):TENSE.includes(S.topic)||BEGIN_ONLY.includes(S.topic)?shuf(S.pool.slice()).slice(0,10):S.lvl===3&&S.pool.length<30?shuf(S.pool.slice()).slice(0,10):S.pool.slice((S.lvl-1)*10,S.lvl*10);
$('drillT').textContent=S.boss?x.boss:u().topics[TOP.indexOf(S.topic)].replace(/^\S+\s/,'')+' · '+x.lvl+' '+S.lvl;renderLevels();showStreak();
if(!S.qs.length){mood();$('prog').textContent='';$('qbox').textContent=u().soon;$('opts').innerHTML='';$('fb').style.display='none';$('nextBtn').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('shareBtn').style.display=$('retryBtn').style.display='none';$('bq').textContent='';return}
$('benchSec').style.display='none';renderWords();mood();show()}
function show(){stopTalk();closeSheet();$('endNav').style.display='none';$('lessonsLink').style.display='none';const t=u(),q=S.qs[S.i];$('prog').textContent=t.qn+' '+(S.i+1)+' / '+S.qs.length;if($('progFill'))$('progFill').style.width=Math.round((S.i)/Math.max(1,S.qs.length)*100)+'%';$('qbox').textContent=t.q.replace('{s}',q.s).replace('{L}',t.langs[S.t]);$('fb').style.display='none';$('nextBtn').style.display='none';$('undoBtn').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('shareBtn').style.display=$('retryBtn').style.display='none';if($('readSec'))$('readSec').style.display='none';
let ord=[0,1,2,3];if(!q.ns)for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
const g=$('opts');g.innerHTML='';ord.forEach((oi,k)=>{const b=document.createElement('button');b.className='option-btn';const rom=q.ph&&q.ph.o&&q.ph.o[oi];b.innerHTML=String.fromCharCode(65+k)+'. '+q.o[oi]+(rom?'<br><small class="rom">'+rom+'</small>':'');b.onclick=()=>answer(oi,g,ord);g.appendChild(b)});snapQuiz()}
function answer(oi,g,ord){const t=u(),q=S.qs[S.i],ok=oi===q.c,fb=$('fb');(ok?beep(660):sfxWrong());vibrate(ok?30:[20,40,20]);mood(ok?'happy':'angry');if(ok)S.sc++;else S.wrong.push(q);const again=!ok&&((load().mis||{})[S.n+S.t]||[]).includes(q.s);trackMis(q,ok);
[...g.children].forEach((b,k)=>{b.disabled=true;if(ord[k]===q.c)b.classList.add('correct');else if(ord[k]===oi)b.classList.add('incorrect')});
fb.style.display='block';fb.style.cssText+=ok?';background:#ECFDF3;border-color:#12B76A;color:#027A48':';background:#FDF3F2;border-color:#FECDCA;color:#B42318';
const trap=!ok&&q.literal_trap&&q.o[oi]===q.literal_trap&&q.roast_if_wrong;S.wr=ok?0:(S.wr||0)+1;const pity=!ok&&S.wr>=3;if(pity)S.wr=0;const PRn=PR[S.n];const msg=ok?pick(t.right):pity?(PRn&&Math.random()<.67?pick(PRn.row):X[S.n].pity):(trap?q.roast_if_wrong:(q.r?(Math.random()<.7?pick(OPEN[S.n]):'')+q.r:(personalRoast(q,oi,again)||pick(t.wrong))));const av='<img src="images/'+t.img+'.webp" class="fb-avatar" alt="">',romF=q.ph&&q.ph.f?' <small class="rom rom-in">('+q.ph.f+')</small>':'';fb.innerHTML=av+(ok?'<strong>🎉 '+t.ok+'</strong> '+msg:'<strong>'+(trap?'🪤 ':'🎩 ')+t.wh+'</strong> '+msg+'<br><em>'+t.cor+' '+(q.natural_version||q.f)+'</em>'+romF+(q.native_context&&!ok?'<br><small>'+q.native_context+'</small>':''));
S.say=q.f;$('sayBtn').style.display=$('repBtn').style.display='flex';$('nextBtn').textContent=t.next;$('nextBtn').style.display='block';$('nextBtn').onclick=()=>{stopTalk();S.i++;S.i>=S.qs.length?finish():show()};
if(!ok&&!S.undoUsed&&!S.boss){$('undoBtn').style.display='block';$('undoBtn').onclick=()=>{S.undoUsed=1;show()}}
showReadPractice(q);openSheet()}
function finish(){stopTalk();closeSheet();if(S.story)return finishStory();if(S.numset)return finishNumSet();const t=u(),x=X[S.n],n=S.qs.length,p=Math.round(S.sc/n*100),ti=t.tiers[p<40?0:p<70?1:p<90?2:3],st=p>=100?3:p>=80?2:p>=60?1:0,k=S.boss?S.n+S.t+'boss':S.n+S.t+S.topic+S.lvl,d=load(),td=day(0),yd=day(1);
if(!S.retry&&!S.review){if(d.st.last!==td)d.st={last:td,n:d.st.last===yd?(d.st.n||0)+1:1};if(st>(d.lv[k]||0))d.lv[k]=st;d.totalRuns=(d.totalRuns||0)+1;d.log=(d.log||[]).filter(x=>x!==td);d.log.push(td);d.log=d.log.slice(-90);save(d)}
if(!S.retry&&p>=100){earnBadge('perfect');confetti()}
if(!S.retry&&!S.review){const hn=!S.boss&&st>0&&S.lvl<3;if(hn)confetti()}
if($('progFill'))$('progFill').style.width='100%';
$('opts').innerHTML='';$('fb').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('undoBtn').style.display='none';if($('readSec'))$('readSec').style.display='none';
const hasNext=!S.boss&&!S.retry&&!S.review&&st>0&&S.lvl<3;
$('qbox').innerHTML=S.retry?'<strong>🔁 '+x.retryL+': '+S.sc+' / '+n+'</strong><span class="tier">'+ti+'</span>':'<strong>📊 '+t.sc+': '+S.sc+' / '+n+' ('+p+'%) '+'⭐'.repeat(st)+'☆'.repeat(3-st)+'</strong><span class="tier">'+ti+'</span><span class="tier">'+(st>0?(hasNext?'🔓 '+x.unlocked:'🎉'):(LOCK_LEVELS&&!S.boss&&S.lvl<3?'🔒 '+x.lvlHint:''))+'</span>';
mood(p>=60?'happy':'angry');S.res=x.shareT.replace('{p}',p).replace('{r}',ti)+' '+location.href.split('#')[0];
$('shareBtn').style.display=S.retry?'none':'block';$('retryBtn').style.display=S.wrong.length?'block':'none';
const nb=$('nextBtn');nb.style.display='block';if(hasNext){nb.textContent=x.nextlvl;nb.onclick=()=>{S.lvl++;start()}}else{nb.textContent=t.again;nb.onclick=start}if(!S.review)renderLevels();showStreak();checkBadges();endNav()}
const norm=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:«»"“”„¿¡]/g,'').replace(/-/g,' ').replace(/\s+/g,' ').trim().replace(S.t==='th'?/\s+/g:/(?!)/g,'');
function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function benchPool(){if(S.benchAll){let a=[];for(const tp of SENT)a=a.concat(RE[S.n][tp].filter(e=>e.t[S.t]).map(mapq));return a}return S.pool}
function bench(){const bp=benchPool();if(!bp||!bp.length){S.bi=null;$('bq').textContent=(u().soon)||'Nothing here yet.';$('fixD').textContent='';$('fixIn').value='';$('fixOut').style.display='none';return}
const pl=bp.filter(x=>!x.ns),q=pick(pl.length?pl:bp),v=VOC.includes(S.topic)&&!S.benchAll;S.bi=v?{p:'“'+q.s+'” → ?',a:q.f,v:1}:{p:pick(q.o.filter((_,i)=>i!==q.c)),a:q.f,m:q.s};
$('bq').textContent=S.bi.p;$('fixD').textContent=v?X[S.n].benchW:u().fixD;$('fixIn').value='';$('fixOut').style.display='none';$('fixOut').classList.remove('ok');benchExtras()}
/* --- spoken/typed digits -> number words, so "21" matches "ventuno" etc --- */
function numWord(lang,n){
if(lang==='en'){const ones=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];if(n===100)return'one hundred';if(n<20)return ones[n];const t=Math.floor(n/10),u=n%10;return u===0?tens[t]:tens[t]+'-'+ones[u]}
if(lang==='it'){const ones=['zero','uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci','undici','dodici','tredici','quattordici','quindici','sedici','diciassette','diciotto','diciannove'],tens={2:'venti',3:'trenta',4:'quaranta',5:'cinquanta',6:'sessanta',7:'settanta',8:'ottanta',9:'novanta'};if(n===100)return'cento';if(n<20)return ones[n];const t=Math.floor(n/10),u=n%10,tw=tens[t];if(u===0)return tw;if(u===1||u===8)return tw.slice(0,-1)+ones[u];if(u===3)return tw+'tré';return tw+ones[u]}
if(lang==='fr'){const ones=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];if(n===100)return'cent';if(n<20)return ones[n];if(n<70){const t=Math.floor(n/10),u=n%10,tens={2:'vingt',3:'trente',4:'quarante',5:'cinquante',6:'soixante'}[t];if(u===0)return tens;if(u===1)return tens+' et un';return tens+'-'+ones[u]}
if(n<80){const rem=n-60;if(rem===11)return'soixante et onze';return'soixante-'+ones[rem]}
if(n<90){const rem=n-80;if(rem===0)return'quatre-vingts';return'quatre-vingt-'+ones[rem]}
const rem=n-80;if(rem===11)return'quatre-vingt-onze';return'quatre-vingt-'+ones[rem]}
if(lang==='de'){const ones=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'],onesC=['','ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun'],tens={2:'zwanzig',3:'dreißig',4:'vierzig',5:'fünfzig',6:'sechzig',7:'siebzig',8:'achtzig',9:'neunzig'};if(n===100)return'hundert';if(n<20)return ones[n];const t=Math.floor(n/10),u=n%10;return u===0?tens[t]:onesC[u]+'und'+tens[t]}
if(lang==='af'){const ones=['nul','een','twee','drie','vier','vyf','ses','sewe','agt','nege','tien','elf','twaalf','dertien','veertien','vyftien','sestien','sewentien','agtien','negentien'],tens={2:'twintig',3:'dertig',4:'veertig',5:'vyftig',6:'sestig',7:'sewentig',8:'tagtig',9:'negentig'};if(n===100)return'honderd';if(n<20)return ones[n];const t=Math.floor(n/10),u=n%10;return u===0?tens[t]:ones[u]+'-en-'+tens[t]}
if(lang==='th'){const d=['ศูนย์','หนึ่ง','สอง','สาม','สี่','ห้า','หก','เจ็ด','แปด','เก้า'];if(n===0)return'ศูนย์';if(n===100)return'หนึ่งร้อย';if(n<10)return d[n];if(n<20){const u=n-10;return u===0?'สิบ':(u===1?'สิบเอ็ด':'สิบ'+d[u])}const t=Math.floor(n/10),u=n%10,tw=t===2?'ยี่สิบ':d[t]+'สิบ';if(u===0)return tw;if(u===1)return tw+'เอ็ด';return tw+d[u]}
return null}
function numify(text,lang){return String(text).replace(/\d+/g,d=>{const n=parseInt(d,10);if(n<0||n>100)return d;return numWord(lang,n)||d})}

const lev=(a,b)=>{const m=[...Array(a.length+1)].map((_,i)=>[i]);for(let j=1;j<=b.length;j++)m[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]};
$('fixBtn').onclick=()=>{const t=u(),x=X[S.n],raw=$('fixIn').value.trim(),v=numify(raw,S.t),o=$('fixOut');if(!raw||!S.bi)return;const a=norm(v),c=norm(S.bi.a),ok=a===c,typo=!ok&&c.length>5&&lev(a,c)<=Math.max(2,Math.floor(c.length*.1)),same=!ok&&a===norm(S.bi.p);
(ok?beep(660):sfxWrong());vibrate(ok?30:[20,40,20]);mood(ok?'happy':'angry');o.style.display='block';o.classList.toggle('ok',ok);const msg=ok?pick(t.right):typo?x.typo:same?x.same:pick(t.wrong);
const av2='<img src="images/'+t.img+'.webp" class="fb-avatar" alt="">';o.innerHTML=av2+(ok?'<strong>🎉 '+t.ok+'</strong> '+msg:'<strong>'+(typo?'🔤 ':same?'🪞 ':'🔥 ')+t.wh+'</strong> '+msg+'<div class="custom-correction">✨ '+t.cor+' '+S.bi.a+'</div>')};
$('newBtn').onclick=bench;
const load=()=>{try{const d=JSON.parse(localStorage.getItem('roasted')||'{}');const o=(d&&typeof d==='object'&&!Array.isArray(d))?d:{};return Object.assign({},o,{best:o.best||{},st:o.st||{},lv:o.lv||{},mis:o.mis||{}})}catch(e){return{best:{},st:{},lv:{},mis:{}}}};
const save=d=>{try{localStorage.setItem('roasted',JSON.stringify(d));return true}catch(e){if(!S.saveWarned){S.saveWarned=1;try{toast('⚠️ Could not save your progress (storage may be full or blocked)',6000)}catch(_){}}return false}};
const X={};
const VOICE={af:'af-ZA',th:'th-TH',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT'};
$('sayBtn').onclick=()=>{if(!S.say)return;if(!window.speechSynthesis){note('novoice');return}speakLine(S.say,VOICE[S.t],[1,.88],'f')};
$('repBtn').onclick=()=>{const q=S.qs[S.i];window.open('https://github.com/AdeRoastED/roasted-app/issues/new?title='+encodeURIComponent('Wrong answer? '+S.n+'>'+S.t+' '+S.topic)+'&body='+encodeURIComponent('Question: '+q.s+'\nMarked correct: '+q.f+'\nWhat is wrong:'),'_blank')};
$('shareBtn').onclick=()=>{if(navigator.share)navigator.share({text:S.res}).then(markShared).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(S.res).then(()=>{alert('✔ Copied');markShared()})};
$('retryBtn').onclick=()=>{S.qs=S.wrong.slice();S.wrong=[];S.i=0;S.sc=0;S.retry=1;mood();show()};
$('muteBtn').onclick=()=>{S.mute=S.mute?0:1;$('muteBtn').innerHTML=S.mute?'🔇':'<img src="images/icons/sound.png" class="btn-icon" alt="">'};
const L2={en:{review:'🎯 Review my mistakes',duel:'⚔️ Challenge a friend'},it:{review:'🎯 Rivedi i miei errori',duel:'⚔️ Sfida un amico'},fr:{review:'🎯 Revoir mes erreurs',duel:'⚔️ Défier un ami'},de:{review:'🎯 Meine Fehler wiederholen',duel:'⚔️ Freund herausfordern'},th:{review:'🎯 ทบทวนที่ผิด',duel:'⚔️ ท้าเพื่อน'},af:{review:'🎯 Gaan my foute weer deur',duel:"⚔️ Daag 'n vriend uit"}};
function labels(){const x=X[S.n];const l2=L2[S.n]||L2.en;if($('goReview'))$('goReview').textContent=l2.review;if($('goDuel'))$('goDuel').textContent=l2.duel;$('offTag').textContent=x.offline;$('goInstall').textContent='📲 '+x.install;$('iosHint').textContent=x.ios;$('goLearn').textContent='▶ '+x.learn;$('goBench').textContent='💀 '+u().fixT.replace(/^\S+\s/,'');$('goSet').textContent='⚙️ '+x.set;$('backBtn').setAttribute('aria-label',x.back);$('resetBtn').innerHTML='<img src="images/icons/reset.png" class="btn-icon" alt="">';$('sayBtn').innerHTML='<img src="images/icons/listen.png" class="btn-icon" alt="">';$('sayBtn').setAttribute('aria-label',x.listen);$('repBtn').innerHTML='<img src="images/icons/report.png" class="btn-icon" alt="">';$('repBtn').setAttribute('aria-label',x.report);$('shareBtn').textContent=x.share;$('retryBtn').textContent=x.retry;$('readTitle').textContent='📖 '+(x.readT||'Reading practice')}
const _t=texts;texts=function(){_t();labels()};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
S.voice=1;const TUNE={};
const VP={};let VOICES=[];
if(window.speechSynthesis){const lv=()=>{VOICES=speechSynthesis.getVoices()};lv();speechSynthesis.onvoiceschanged=lv}
const NAT=/natural|neural|online|premium|enhanced|wavenet|google/i;
function pickVoice(lang,g){const b=lang.slice(0,2).toLowerCase();let best=null,bs=-1;for(const v of VOICES){if(!v.lang||v.lang.slice(0,2).toLowerCase()!==b)continue;const n=v.name.toLowerCase();let sc=0;if(v.lang.replace('_','-').toLowerCase()===lang.toLowerCase())sc+=3;if(NAT.test(n))sc+=6;if(/google|microsoft|apple/.test(n))sc+=2;if(v.localService===false)sc+=1;
const fem=/\bfemale\b|woman|elsa|alice|amelie|amélie|marie|paola|federica|anna|petra|katja|hedda|susan|hazel|libby|sonia|jenny|aria|zira|samantha|karen|moira|tessa|emma|brigitte|denise|eloise|vivian|premwadee|kanya/.test(n),mal=/\bmale\b|\bman\b|diego|luca|cosimo|daniel|arthur|george|ryan|james|thomas|henri|claude|antoine|paul|guy|conrad|stefan|markus|hans|jonas|ralf|alex|fred|oliver|niwat/.test(n);
if(g==='f'&&fem)sc+=4;if(g==='m'&&mal&&!fem)sc+=4;if(sc>bs){bs=sc;best=v}}return best}
function speakLine(x,lang,tune,g){if(VFALL[lang]&&!pickVoice(lang,g)&&pickVoice(VFALL[lang],g))lang=VFALL[lang];const parts=x.replace(/[«»“”„]/g,'').replace(/[,，]/g,' ').match(/[^.!?…]+[.!?…]*/g)||[x],v=pickVoice(lang,g),nat=v&&NAT.test(v.name);if(!v&&VOICES.length&&!VOICES.some(z=>z.lang&&z.lang.slice(0,2).toLowerCase()===lang.slice(0,2).toLowerCase())){note('novoice');return}speechSynthesis.cancel();
parts.forEach((p,i)=>{const m=new SpeechSynthesisUtterance(p.trim());m.lang=lang;if(v)m.voice=v;m.pitch=nat?1:tune[0]*(i%2?1.05:.97);m.rate=nat?1:Math.min(tune[1],.95);speechSynthesis.speak(m)})}
function talk(x){if(!S.voice||!window.speechSynthesis)return;try{speakLine(x,VOICE[S.n],TUNE[S.n],VP[S.n])}catch(e){}}
$('voiceBtn').onclick=()=>{S.voice=S.voice?0:1;$('voiceBtn').innerHTML=S.voice?'<img src="images/icons/voice.png" class="btn-icon" alt="">':'🤐';if(!S.voice&&window.speechSynthesis)speechSynthesis.cancel()};
const day=o=>new Date(Date.now()-o*864e5).toISOString().slice(0,10);
function stopTalk(){try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}}
function toast(m,ms){const n=$('voiceNote');n.textContent=m;n.style.display='block';clearTimeout(S.tt);S.tt=setTimeout(()=>{n.style.display='none'},ms||5000)}
function showStreak(){const s=load().st||{},n=(s.last===day(0)||s.last===day(1))?(s.n||0):0,b=$('streakBadge');b.textContent='🔥 '+n;b.style.display=n?'block':'none';b.className=(n>0&&n%5===0)?'pulse':'';renderBadges();updateAppBadge(n)}
const BADGE_ICON={streak3:'🔥3',streak7:'🔥7',streak30:'🔥30',boss:'👑',alltopics:'🏆',perfect:'💯'};
function earnBadge(id){try{const d=load();d.badges=d.badges||[];if(!d.badges.includes(id)){d.badges.push(id);save(d)}}catch(e){}}
function checkBadges(){try{const s=load().st||{},n=(s.last===day(0)||s.last===day(1))?(s.n||0):0;if(n>=3)earnBadge('streak3');if(n>=7)earnBadge('streak7');if(n>=30)earnBadge('streak30');if(stars(S.n+S.t+'boss')>=1)earnBadge('boss');if(cleared()>=TOP.length)earnBadge('alltopics');renderBadges()}catch(e){}}
function renderBadges(){const box=$('badgeRow');if(!box)return;const d=load();box.innerHTML=(d.badges||[]).map(b=>'<span class="badge" title="'+b+'">'+(BADGE_ICON[b]||'🏅')+'</span>').join('')}
const stars=k=>load().lv[k]||0,lk=l=>S.n+S.t+S.topic+l;
function cleared(){const d=load().lv;return Object.keys(d).filter(k=>k.indexOf(S.n+S.t)===0&&k.indexOf('boss')<0&&d[k]>0).length}
function renderLevels(){const x=X[S.n],box=$('levels');box.innerHTML='';const n=BEGIN_ONLY.includes(S.topic)?1:TENSE.includes(S.topic)?Math.max(1,...RE[S.n][S.topic].filter(e=>e.t[S.t]).map(e=>e.lv||1)):Math.max(1,Math.ceil(RE[S.n][S.topic].filter(e=>e.t[S.t]).length/10));
for(let l=1;l<=n;l++){const open=!LOCK_LEVELS||l===1||stars(lk(l-1))>0,b=document.createElement('button');b.type='button';b.className='lvl'+(!S.boss&&S.lvl===l?' active':'');b.disabled=!open;b.textContent=(open?'':'🔒 ')+x.lvl+' '+l+' '+'⭐'.repeat(stars(lk(l)));b.onclick=()=>{stopTalk();S.boss=0;S.lvl=l;start()};box.appendChild(b)}
const bo=!LOCK_LEVELS||cleared()>=4,bb=document.createElement('button');bb.type='button';bb.className='lvl'+(S.boss?' active':'');bb.disabled=!bo;bb.textContent=(bo?'👑 ':'🔒 ')+x.boss+' '+'⭐'.repeat(stars(S.n+S.t+'boss'));bb.onclick=()=>{stopTalk();S.boss=1;start()};box.appendChild(bb);$('lvlHint').textContent=LOCK_LEVELS?x.lvlHint:''}


function sentWords(box){const items=RE[S.n][S.topic]||[],en=S.qs.map(q=>S.n==='en'?q.s:(((items.find(e=>e.s===q.s)||{t:{}}).t.en)||{}).f||''),ws=WORDS[S.topic].filter(w=>{const re=new RegExp(w.m,'i');return en.some(s=>re.test(s))});if(!ws.length){box.style.display='none';return}box.style.display='grid';const h=document.createElement('h4');h.textContent='📖 '+X[S.n].studyW;box.appendChild(h);
ws.forEach(w=>{const r=document.createElement('div');r.className='wrow';const a=document.createElement('span');a.textContent=w[S.n];const b=document.createElement('b');b.innerHTML=esc(w[S.t])+(S.t==='th'&&w.thr?'<br><small class="rom">('+esc(w.thr)+')</small>':'');const k=document.createElement('button');k.type='button';k.textContent='🔊';k.setAttribute('aria-label',X[S.n].listen);k.onclick=()=>{if(window.speechSynthesis)speakLine(w[S.t],VOICE[S.t],[1,.85],'f');else note('novoice')};r.appendChild(a);r.appendChild(b);r.appendChild(k);box.appendChild(r)})}
function renderWords(){const box=$('wordList');box.innerHTML='';if(SENT.includes(S.topic)&&!S.boss&&window.WORDS&&WORDS[S.topic]&&S.qs){sentWords(box);return}if(!VOC.includes(S.topic)||S.boss){box.style.display='none';return}box.style.display='grid';const h=document.createElement('h4');h.textContent='📖 '+X[S.n].studyW;box.appendChild(h);
(S.numset?RE[S.n].num.slice(NUM_DECADES[S.nsIdx][0],NUM_DECADES[S.nsIdx][1]):studyItems(S.topic,S.lvl)).forEach(e=>{const w=e.t[S.t];if(!w)return;const r=document.createElement('div');r.className='wrow';const a=document.createElement('span');a.textContent=e.s;const b=document.createElement('b');b.innerHTML=w.f+(w.ph&&w.ph.f?'<br><small class="rom">('+w.ph.f+')</small>':'');const k=document.createElement('button');k.type='button';k.textContent='🔊';k.setAttribute('aria-label',X[S.n].listen);k.onclick=()=>{if(window.speechSynthesis)speakLine(w.f,VOICE[S.t],[1,.85],'f');else note('novoice')};r.appendChild(a);r.appendChild(b);r.appendChild(k);box.appendChild(r)})}
const ICON={food:'🍕'};
const SCRS=['Welcome','Home','Menu','Levels','Topics','Quiz','Trophies','Story','NumSets','Settings'];
const NUM_DECADES=[[0,20,'0–20'],[20,40,'20–40'],[40,60,'40–60'],[60,80,'60–80'],[80,101,'80–100']];
const lstars=(tp,l)=>load().lv[S.n+S.t+tp+l]||0,tOpen=(tp,l)=>l===1||lstars(tp,l-1)>0;
function card(box,txt,sub,dis,fn,extraClass){const b=document.createElement('button');b.type='button';b.className='card'+(extraClass?' '+extraClass:'');b.disabled=!!dis;const a=document.createElement('span');a.textContent=txt;const c=document.createElement('small');c.textContent=sub;b.appendChild(a);b.appendChild(c);b.onclick=fn;box.appendChild(b)}
function renderLevelsMenu(){const x=X[S.n],box=$('lvCards'),nm=[x.ln1,x.ln2,x.ln3];box.innerHTML='';
for(let l=1;l<=3;l++){let st=0,op=l===1;TOP.forEach(tp=>{st+=lstars(tp,l);if(tOpen(tp,l))op=true});card(box,x.lvl+' '+l+' · '+nm[l-1],'⭐ '+st+'/'+TOP.length*3,false,()=>{S.lvl=l;nav('Topics')},'tier-'+l)}
const bo=!LOCK_LEVELS||cleared()>=4;card(box,(bo?'👑 ':'🔒 ')+x.boss,'⭐ '+stars(S.n+S.t+'boss')+'/3',!bo,()=>{S.boss=1;S.benchAll=0;start();nav('Quiz')})}
function renderTopicsMenu(){const x=X[S.n],t=u(),box=$('tpCards');box.innerHTML='';$('crumbT').textContent=x.lvl+' '+S.lvl+' · '+[x.ln1,x.ln2,x.ln3][S.lvl-1];
curOrder().forEach(tp=>{const i=TOP.indexOf(tp),n=lstars(tp,S.lvl),fu=firstUndone(tp);card(box,t.topics[i],'⭐'.repeat(n)+'☆'.repeat(3-n)+(LOCK_LEVELS&&tp!=='num'&&fu<S.lvl?' · ▶ '+x.lvl+' '+fu:''),false,()=>openTopic(tp))})}
function nav(n){stopTalk();closeSheet();S.screen=n;const sc=n==='Bench'?'Quiz':n;SCRS.forEach(k=>{$('scr'+k).style.display=k===sc?'flex':'none'});
$('drillSec').style.display=n==='Bench'?'none':'flex';$('benchSec').style.display=n==='Bench'?'flex':'none';if(n==='Bench')$('wordList').style.display='none';
if(n==='Levels')renderLevelsMenu();if(n==='Topics')renderTopicsMenu();if(n==='Trophies')renderTrophies();if(n==='Story')renderStoryMenu();if(n==='NumSets')renderNumSets();if(n==='Settings')labels2();
if(n==='Quiz')acquireWake();else releaseWake();
if(n==='Quiz'||n==='Bench'){const x=X[S.n];$('crumbQ').textContent=n==='Bench'?'💀':(S.story?'📖':(S.numset?'🔢 '+S.nsLabel:(S.boss?x.boss:x.lvl+' '+S.lvl+' · '+u().topics[TOP.indexOf(S.topic)])))}
$('scrQuiz').classList.toggle('story-mode',!!S.story);
if(n==='Home')S.home=1;
$('backBtn').style.display=atRoot(n)?'none':'';$('homeBtn').style.display=(n==='Home'||atRoot(n))?'none':'';
if(typeof scrollTo==='function')scrollTo(0,0)}
function atRoot(n){return n==='Welcome'}
function backTarget(){const n=S.screen;
if(n==='Bench'){S.benchAll=0;return'Menu'}
if(n==='Quiz')return S.story?'Story':(S.numset?'NumSets':(S.boss?'Levels':'Topics'));
if(n==='Topics')return'Levels';if(n==='Levels')return'Menu';if(n==='Menu')return'Home';if(n==='Welcome')return'Home';
if(n==='Trophies'||n==='Story'||n==='Settings')return'Menu';
if(n==='NumSets')return'Topics';
if(n==='Home')return'Welcome';
return'Home'}
function goBack(){if(atRoot(S.screen))return;nav(backTarget())}
$('backBtn').onclick=goBack;
$('homeBtn').onclick=()=>{S.benchAll=0;nav('Home')};
$('goLearn').onclick=()=>nav('Levels');
$('goTrophies').onclick=()=>nav('Trophies');
$('badgeRow').onclick=()=>nav('Trophies');
$('goBench').onclick=()=>{S.benchAll=1;S.boss=0;bench();nav('Bench')};
$('goSet').onclick=()=>nav('Settings');
$('resetBtn').onclick=()=>{if(confirm('Reset progress? · Réinitialiser ? · Zurücksetzen?')){try{localStorage.removeItem('roasted')}catch(e){}showStreak();nav('Home')}};
$('exportBtn').onclick=()=>{let raw=null;try{raw=localStorage.getItem('roasted')}catch(e){}
if(!raw){toast('Nothing to export yet — play a bit first.');return}
try{const blob=new Blob([raw],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
a.href=url;a.download='roasted-progress-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();
setTimeout(()=>URL.revokeObjectURL(url),1000);toast('✅ Progress exported')}catch(e){toast('⚠️ Could not export progress')}};
function validateBackupShape(parsed){
if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return'root';
for(const k of['best','st','lv']){if(k in parsed){const v=parsed[k];if(!v||typeof v!=='object'||Array.isArray(v))return k;
for(const kk in v){if(k==='st'&&kk==='last'){if(typeof v[kk]!=='string')return k;continue}if(typeof v[kk]!=='number')return k}}}
if('badges' in parsed&&!(Array.isArray(parsed.badges)&&parsed.badges.every(x=>typeof x==='string')))return'badges';
if('log' in parsed&&!(Array.isArray(parsed.log)&&parsed.log.every(x=>typeof x==='string')))return'log';
if('totalRuns' in parsed&&typeof parsed.totalRuns!=='number')return'totalRuns';
if('mis' in parsed){const v=parsed.mis;if(!v||typeof v!=='object'||Array.isArray(v))return'mis';
for(const kk in v){if(!Array.isArray(v[kk])||!v[kk].every(x=>typeof x==='string'))return'mis'}}
if(!['best','st','lv','mis'].some(k=>k in parsed))return'empty';
return null}
$('importBtn').onclick=()=>$('importFile').click();
$('importFile').onchange=e=>{const file=e.target.files&&e.target.files[0];$('importFile').value='';if(!file)return;
const reader=new FileReader();
reader.onload=()=>{let parsed;
try{parsed=JSON.parse(reader.result)}catch(err){toast('⚠️ That file is not valid — could not read it');return}
const badField=validateBackupShape(parsed);
if(badField){toast(badField==='empty'?"⚠️ That doesn't look like a RoastED backup file":'⚠️ Backup file has an invalid "'+badField+'" section — not imported');return}
if(!confirm('This will replace your current progress with this backup. This cannot be undone. Continue?'))return;
let priorRaw=null;try{priorRaw=localStorage.getItem('roasted')}catch(err){}
if(priorRaw!==null){try{localStorage.setItem('roasted_backup_before_import',priorRaw)}catch(err){
if(!confirm('Could not back up your current progress before importing (storage may be full). Import anyway?'))return}}
const serialized=JSON.stringify(parsed);
try{localStorage.setItem('roasted',serialized)}catch(err){toast('⚠️ Could not write the backup (storage may be full or blocked) — your old progress was not touched');return}
let check=null;try{check=localStorage.getItem('roasted')}catch(err){}
if(check!==serialized){if(priorRaw!==null){try{localStorage.setItem('roasted',priorRaw)}catch(err){}}
toast('⚠️ Import did not verify — restored your previous progress');return}
toast('✅ Progress restored — reloading');setTimeout(()=>location.reload(),900)};
reader.onerror=()=>toast('⚠️ Could not read that file');
reader.readAsText(file)};
function trackMis(q,ok){try{const d=load(),k=S.n+S.t,l=d.mis[k]||[];if(ok){if(l.includes(q.s)){d.mis[k]=l.filter(x=>x!==q.s);save(d)}}else{d.mis[k]=l.filter(x=>x!==q.s).concat(q.s).slice(-60);save(d)}}catch(e){}}
function note(k){if(S.noted)return;S.noted=1;const n=$('voiceNote');n.textContent=X[S.n][k];n.style.display='block';setTimeout(()=>{n.style.display='none'},5000)}
function loadScript(src){return new Promise((ok,no)=>{const e=document.createElement('script');e.src=src;e.onload=ok;e.onerror=()=>{toast(((X[S.n]||X[Object.keys(X)[0]]||{}).loaderr)||'⚠️ Connection error');no()};document.head.appendChild(e)})}
function loadData(n){const a=(window.RE&&RE[n])?Promise.resolve():loadScript('data/'+n+'.js'),w=window.WORDS?Promise.resolve():loadScript('data/words.js').catch(()=>{}),b=T[n]?Promise.resolve():loadScript('data/ui-'+n+'.js').then(()=>{const o=UI[n];T[n]=o.T;X[n]=o.X;OPEN[n]=o.OPEN;TUNE[n]=o.TUNE;VP[n]=o.VP});return Promise.all([a,b,w])}
if(window.addEventListener){window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.ip=e;$('goInstall').style.display=''});window.addEventListener('appinstalled',()=>{$('goInstall').style.display='none'})}
$('goInstall').onclick=()=>{if(S.ip){S.ip.prompt();S.ip=null;$('goInstall').style.display='none'}};
if(/iphone|ipad|ipod/i.test(navigator.userAgent||'')&&!navigator.standalone)$('iosHint').style.display='block';
$('charImg').onerror=function(){this.onerror=null;this.src='images/banner.webp'};
if($('fixIn').addEventListener)$('fixIn').addEventListener('focus',()=>setTimeout(()=>{try{$('fixIn').scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}},300));
/* --- voice input (speech-to-text) for the Torture Bench --- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let recog=null;
if($('micBtn'))$('micBtn').onclick=()=>{
stopTalk();
if(!SR){toast('🎤 Voice input not supported in this browser');return}
if(recog){try{recog.stop()}catch(e){}return}
try{recog=new SR();recog.lang=VOICE[S.t]||'en-US';recog.interimResults=false;recog.maxAlternatives=5;
$('micBtn').classList.add('listening');$('micBtn').textContent='🔴';
recog.onresult=e=>{$('fixIn').value=bestAlt(e.results[0],S.bi&&S.bi.a)};
recog.onerror=ev=>{micErr(ev)};
recog.onend=()=>{recog=null;$('micBtn').classList.remove('listening');$('micBtn').innerHTML='<img src="images/icons/mic.png" class="btn-icon" alt="">'};
recog.start()}catch(e){recog=null;$('micBtn').classList.remove('listening');$('micBtn').innerHTML='<img src="images/icons/mic.png" class="btn-icon" alt="">'}};

/* --- review my mistakes --- */
if($('goReview'))$('goReview').onclick=()=>{
const d=load(),ms=new Set(d.mis[S.n+S.t]||[]);let a=[];
for(const tp of SENT)a=a.concat((RE[S.n][tp]||[]).filter(e=>e.t[S.t]&&ms.has(e.s)).map(mapq));
S.boss=0;S.review=1;S.benchAll=0;S.story=0;S.numset=0;S.pool=a;S.qs=shuf(a.slice()).slice(0,20);S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.wr=0;
nav('Quiz');$('drillT').textContent='🎯 Review My Mistakes';$('prog').textContent='';$('benchSec').style.display='none';$('wordList').style.display='none';
if(S.qs.length)show();else{$('qbox').textContent="No mistakes saved yet — that's good! Keep playing and I'll track what trips you up.";$('opts').innerHTML='';$('fb').style.display='none';$('nextBtn').style.display='none';if($('readSec'))$('readSec').style.display='none'}};

/* --- challenge a friend (duel) --- */
function duelPayload(){const d=load(),ms=d.mis[S.n+S.t]||[];if(!ms.length)return null;const items=[];
for(const tp of SENT){(RE[S.n][tp]||[]).forEach((e,i)=>{if(ms.includes(e.s)&&e.t[S.t])items.push([tp,i])})}
return items.length?{n:S.n,t:S.t,items:items.slice(0,15)}:null}
if($('goDuel'))$('goDuel').onclick=()=>{const p=duelPayload();
if(!p){alert('No mistakes saved yet to challenge with — get a few wrong first!');return}
const enc=btoa(encodeURIComponent(JSON.stringify(p))),url=location.href.split('#')[0]+'#duel='+enc,text='⚔️ Think you can survive my worst mistakes? '+url;
if(navigator.share)navigator.share({text}).then(markShared).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(text).then(()=>{alert('✔ Copied — send it to a friend!');markShared()});else alert(text)};
function parseDuel(){try{if(!location.hash.indexOf)return null;if(location.hash.slice(0,6)!=='#duel=')return null;return JSON.parse(decodeURIComponent(atob(location.hash.slice(6))))}catch(e){return null}}
function startDuel(p){S.n=p.n;S.t=p.t;loadData(S.n).then(()=>{texts();S.boss=0;S.review=1;S.benchAll=0;S.story=0;S.numset=0;S.topic=(p.items&&p.items[0]?p.items[0][0]:'food');
S.qs=(p.items||[]).map(it=>{const e=RE[S.n]&&RE[S.n][it[0]]&&RE[S.n][it[0]][it[1]];return e?mapq(e):null}).filter(Boolean);
S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.wr=0;
nav('Home');$('drillT').textContent="⚔️ Friend's Challenge";$('benchSec').style.display='none';$('wordList').style.display='none';
if(S.qs.length)show();else{$('qbox').textContent='This challenge link looks empty.';$('opts').innerHTML='';if($('readSec'))$('readSec').style.display='none'}
nav('Quiz')}).catch(()=>{})}

/* --- haptics --- */
function vibrate(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}

/* --- wake lock (keep screen on during a quiz) --- */
let WL=null;
async function acquireWake(){try{if('wakeLock' in navigator){WL=await navigator.wakeLock.request('screen')}}catch(e){WL=null}}
function releaseWake(){try{WL&&WL.release();WL=null}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&S.screen==='Quiz')acquireWake()});

/* --- confetti burst (level up / perfect score) --- */
function confetti(){try{const box=$('confettiBox');if(!box)return;const colors=['#D93025','#12B76A','#F59E0B','#2563EB','#9333EA'];
for(let i=0;i<28;i++){const p=document.createElement('div');p.className='confetti-piece';p.style.left=Math.random()*100+'vw';p.style.background=colors[i%colors.length];p.style.animationDelay=(Math.random()*.3)+'s';p.style.animationDuration=(1.1+Math.random()*.8)+'s';box.appendChild(p);setTimeout(()=>p.remove(),2200)}
vibrate([30,40,30,40,60])}catch(e){}}

/* --- trophy room: badges + loyalty tier + practice calendar --- */
const BADGE_META={streak3:['🔥3','3-day streak'],streak7:['🔥7','7-day streak'],streak30:['🔥30','30-day streak'],boss:['👑','Final test passed'],alltopics:['🏆','All topics cleared'],perfect:['💯','Perfect score'],sharer:['📣','Shared the app']};
function tierOf(n){return n>=150?['🥇','Gold learner']:n>=50?['🥈','Silver learner']:n>=10?['🥉','Bronze learner']:['🌱','Just starting']}
function renderTrophies(){const d=load(),have=new Set(d.badges||[]);const box=$('trophyGrid');box.innerHTML='';
Object.keys(BADGE_META).forEach(id=>{const[icon,name]=BADGE_META[id],got=have.has(id),el=document.createElement('div');el.className='trophy'+(got?'':' locked');el.innerHTML='<span class="t-icon">'+icon+'</span><span class="t-name">'+name+'</span>';box.appendChild(el)});
const tr=tierOf(d.totalRuns||0);$('tierLabel').textContent=tr[0]+' '+tr[1]+' · '+(d.totalRuns||0)+' quizzes completed';
renderHeatmap(d.log||[])}
function renderHeatmap(log){const box=$('heatmap');if(!box)return;box.innerHTML='';const set=new Set(log);
for(let i=34;i>=0;i--){const dte=day(i),cell=document.createElement('div');cell.className='hcell'+(set.has(dte)?' active':'')+(i===0?' today':'');cell.title=dte;box.appendChild(cell)}}

/* --- reading practice: read the correct sentence aloud, get word-by-word feedback --- */
function showReadPractice(q){const sec=$('readSec');if(!sec)return;
if(S.review||S.benchAll||!q||!q.f){sec.style.display='none';return}
S.readTarget=q.f;$('readTarget').innerHTML=q.f+(q.ph&&q.ph.f?'<br><small class="rom">('+q.ph.f+')</small>':'');$('readOut').innerHTML='';$('readOut').className='read-result';sec.style.display='flex'}
function scoreReading(heard){const c=norm(S.readTarget).split(' ').filter(Boolean),hSet=new Set(norm(numify(heard,S.t)).split(' ').filter(Boolean));
let hits=c.filter(w=>hSet.has(w)).length;const hc=norm(numify(heard,S.t)).replace(/\s+/g,''),cc=c.join('');if(hits<c.length&&(hc===cc||(cc.length<=12&&lev(hc,cc)<=(cc.length<=4?1:2)))){hits=c.length;c.forEach(w=>hSet.add(w))}const pct=Math.round(100*hits/Math.max(c.length,1));
const html=c.map(w=>'<span class="'+(hSet.has(w)?'w-ok':'w-bad')+'">'+w+'</span>').join(' ');
return{pct,html}}
if($('readMicBtn'))$('readMicBtn').onclick=()=>{
stopTalk();
if(!SR){toast('🎤 Voice input not supported in this browser');return}
if(!S.readTarget)return;
$('readMicBtn').classList.add('listening');$('readMicBtn').textContent='🔴';
try{const r=new SR();r.lang=VOICE[S.t]||'en-US';r.interimResults=false;r.maxAlternatives=5;
r.onresult=e=>{const heard=bestAlt(e.results[0],S.readTarget),{pct,html}=scoreReading(heard),out=$('readOut');
out.innerHTML=html;const heardLine=document.createElement('div');heardLine.textContent='🎙️ "'+heard+'" — '+pct+'%';out.appendChild(heardLine);
out.className='read-result '+(pct>=85?'ok':pct>=50?'':'bad');
vibrate(pct>=85?30:[20,40,20])};
r.onerror=ev=>{$('readOut').textContent=micMsg(ev);$('readOut').className='read-result bad'};
r.onend=()=>{$('readMicBtn').classList.remove('listening');$('readMicBtn').innerHTML='<img src="images/icons/mic.png" class="btn-icon" alt="">'};
r.start()}catch(e){$('readMicBtn').classList.remove('listening');$('readMicBtn').innerHTML='<img src="images/icons/mic.png" class="btn-icon" alt="">'}};

/* --- what's new (shown once per version, returning users only) --- */
const APP_VERSION='1.7';
const WHATS_NEW=['🏠 New Home button, next to Back, from anywhere in the app','💀 Fixed: Torture Bench showing up empty','📐 5 new grammar topics (present/past/future tense, negation, questions) before full sentences','🔤 Phonetic reading help under every Thai word and phrase (not long sentences)','🧑 A small avatar now shows on every roast popup','🎨 New icon set for the small buttons','🔢 Numbers moved into Topics, split into 5 groups of ~20','🔇 No more auto-read roasts — tap Listen if you want to hear it','🌐 Pick your native language fresh each time you set up a new target language'];
function showWhatsNew(){let sv=null;try{sv=localStorage.getItem('roasted_native')}catch(e){}
let seenver=null;try{seenver=localStorage.getItem('roasted_ver')}catch(e){}
if(!sv||seenver===APP_VERSION||!$('whatsNewOverlay')){try{localStorage.setItem('roasted_ver',APP_VERSION)}catch(e){}return}
$('whatsNewBody').innerHTML=WHATS_NEW.map(x=>'<div style="margin-bottom:6px">• '+x+'</div>').join('');
$('whatsNewOverlay').style.display='block';
const closeWN=()=>{try{localStorage.setItem('roasted_ver',APP_VERSION)}catch(e){}$('whatsNewOverlay').style.display='none'};
$('whatsNewOk').onclick=closeWN;
setTimeout(closeWN,9000)}

/* --- app icon badge (where supported) --- */
function updateAppBadge(n){try{if(navigator.setAppBadge)n?navigator.setAppBadge(n).catch(()=>{}):navigator.clearAppBadge&&navigator.clearAppBadge().catch(()=>{})}catch(e){}}

/* --- share-to-unlock cosmetic badge --- */
function markShared(){earnBadge('sharer')}

/* --- story mode: walk a topic's sentences in order as one little scene --- */
const STORY_INTRO={
en:{food:"You've just sat down at a busy local restaurant — let's order, chat with the waiter, and find out what's actually on the menu.",travel:"You've just landed in a new city with nothing but a suitcase and a map — let's get you from the airport to your hotel.",sports:"Game day! You're heading to the stadium with friends — let's talk tickets, teams, and the big match.",culture:"A festival is about to start in the main square — let's explore the traditions, the music, and the food everyone's talking about.",dailylife:"An ordinary morning: the alarm rings, coffee's brewing, and the day is just getting started — let's get through it."},
it:{food:"Ti sei appena seduto in un ristorante affollato — ordiniamo, parliamo con il cameriere e scopriamo cosa c'è davvero nel menu.",travel:"Sei appena atterrato in una nuova città con solo una valigia e una mappa — portiamoci dall'aeroporto all'hotel.",sports:"Giorno di partita! Stai andando allo stadio con gli amici — parliamo di biglietti, squadre e della grande sfida.",culture:"Sta per iniziare una festa in piazza — scopriamo le tradizioni, la musica e il cibo di cui parlano tutti.",dailylife:"Una mattina qualunque: suona la sveglia, il caffè è pronto, e la giornata sta per iniziare — affrontiamola insieme."},
fr:{food:"Vous venez de vous asseoir dans un restaurant animé — commandons, parlons au serveur et découvrons ce qu'il y a vraiment au menu.",travel:"Vous venez d'atterrir dans une nouvelle ville avec juste une valise et un plan — direction l'hôtel depuis l'aéroport.",sports:"Jour de match ! Vous allez au stade avec des amis — parlons billets, équipes et du grand match.",culture:"Une fête est sur le point de commencer sur la place principale — découvrons les traditions, la musique et la nourriture dont tout le monde parle.",dailylife:"Un matin ordinaire : le réveil sonne, le café infuse, et la journée commence — traversons-la ensemble."},
de:{food:"Du hast gerade in einem belebten Restaurant Platz genommen — bestellen wir, sprechen wir mit dem Kellner und finden heraus, was wirklich auf der Speisekarte steht.",travel:"Du bist gerade in einer neuen Stadt gelandet, nur mit einem Koffer und einer Karte — auf geht's vom Flughafen zum Hotel.",sports:"Spieltag! Du gehst mit Freunden ins Stadion — reden wir über Tickets, Teams und das große Spiel.",culture:"Auf dem Hauptplatz beginnt gleich ein Fest — entdecken wir die Traditionen, die Musik und das Essen, über das alle reden.",dailylife:"Ein ganz normaler Morgen: der Wecker klingelt, der Kaffee kocht, und der Tag beginnt — gehen wir ihn gemeinsam an."},
af:{food:"Jy het pas by 'n besige restaurant gaan sit — kom ons bestel, gesels met die kelner en kyk wat eintlik op die spyskaart is.",travel:"Jy het pas in 'n nuwe stad geland met net 'n tas en 'n kaart — kom ons kom by die hotel vanaf die lughawe.",sports:"Wedstryddag! Jy is op pad stadion toe saam met vriende — kom ons gesels oor kaartjies, spanne en die groot wedstryd.",culture:"'n Fees gaan nou-nou op die hoofplein begin — kom ons verken die tradisies, die musiek en die kos waaroor almal praat.",dailylife:"'n Doodgewone oggend: die wekker lui, die koffie trek, en die dag begin — kom ons werk daardeur."},
th:{food:"คุณเพิ่งนั่งลงที่ร้านอาหารที่คึกคัก — มาสั่งอาหาร คุยกับพนักงานเสิร์ฟ แล้วดูกันว่าในเมนูมีอะไรบ้าง",travel:"คุณเพิ่งลงเครื่องที่เมืองใหม่ มีแค่กระเป๋าเดินทางกับแผนที่ — มาเดินทางจากสนามบินไปโรงแรมกัน",sports:"วันแข่งขัน! คุณกำลังไปสนามกีฬากับเพื่อน ๆ — มาคุยเรื่องตั๋ว ทีม และเกมใหญ่กัน",culture:"งานเทศกาลกำลังจะเริ่มที่จัตุรัสกลางเมือง — มาสำรวจประเพณี ดนตรี และอาหารที่ทุกคนกำลังพูดถึงกัน",dailylife:"เช้าวันธรรมดา ๆ นาฬิกาปลุกดัง กาแฟกำลังชง และวันใหม่กำลังเริ่มต้น — มาผ่านมันไปด้วยกัน"}
};
const STORY_OUTRO={en:'🏁 Story complete! You made it through the whole scene.',it:'🏁 Storia completata! Hai vissuto tutta la scena.',fr:'🏁 Histoire terminée ! Vous avez vécu toute la scène.',de:'🏁 Geschichte abgeschlossen! Du hast die ganze Szene gemeistert.',af:'🏁 Storie voltooi! Jy het die hele toneel deurgemaak.',th:'🏁 เรื่องราวจบแล้ว! คุณผ่านฉากทั้งหมดมาได้'};
function renderStoryMenu(){const t=u(),box=$('storyCards');box.innerHTML='';
SENT.forEach((tp,i)=>{card(box,t.topics[i],'📖',false,()=>startStory(tp))})}
function startStory(tp){stopTalk();S.boss=0;S.review=0;S.retry=0;S.benchAll=0;S.story=1;S.numset=0;S.topic=tp;S.undoUsed=0;
const a=(RE[S.n][tp]||[]).filter(e=>e.t[S.t]).map(mapq);
S.pool=a;S.qs=a.slice();S.i=0;S.sc=0;S.wrong=[];S.wr=0;
nav('Quiz');
$('drillT').textContent='📖 '+(u().topics[TOP.indexOf(tp)]||tp).replace(/^\S+\s/,'');
$('benchSec').style.display='none';$('wordList').style.display='none';
if($('progFill'))$('progFill').style.width='0%';
toast((STORY_INTRO[S.n]&&STORY_INTRO[S.n][tp])||STORY_INTRO.en[tp],8000);
if(S.qs.length)show();else{$('qbox').textContent='Nothing here yet.';$('opts').innerHTML='';if($('readSec'))$('readSec').style.display='none'}}
function finishStory(){stopTalk();const t=u(),n=S.qs.length,p=Math.round(S.sc/Math.max(1,n)*100);
$('opts').innerHTML='';$('fb').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('undoBtn').style.display='none';if($('readSec'))$('readSec').style.display='none';
$('qbox').innerHTML='<strong>'+(STORY_OUTRO[S.n]||STORY_OUTRO.en)+'</strong><br>📊 '+S.sc+' / '+n+' ('+p+'%)';
if(p>=100)confetti();
S.res=((X[S.n]&&X[S.n].shareT)||'').replace('{p}',p).replace('{r}','Story mode')+' '+location.href.split('#')[0];
$('shareBtn').style.display='block';$('retryBtn').style.display=S.wrong.length?'block':'none';
const nb=$('nextBtn');nb.style.display='block';nb.textContent=t.again;nb.onclick=()=>nav('Menu');endNav();
if($('progFill'))$('progFill').style.width='100%'}
$('goStory').onclick=()=>nav('Story');

/* --- numbers, split into decade sets (0-10, 10-20, ... 90-100) --- */
function renderNumSets(){const box=$('numSetCards');box.innerHTML='';const d=load();
NUM_DECADES.forEach((dec,i)=>{const k=S.n+S.t+'num'+(100+i),n=d.lv[k]||0,op=i===0||(d.lv[S.n+S.t+'num'+(100+i-1)]||0)>0;
card(box,(op?'':'🔒 ')+dec[2],'⭐'.repeat(n)+'☆'.repeat(3-n),!op,()=>startNumSet(i))})}
function startNumSet(i){const dec=NUM_DECADES[i];stopTalk();S.boss=0;S.review=0;S.retry=0;S.benchAll=0;S.story=0;S.numset=1;S.nsIdx=i;S.nsLabel=dec[2];S.topic='num';S.lvl=100+i;S.undoUsed=0;
const a=(RE[S.n]['num']||[]).slice(dec[0],dec[1]).filter(e=>e.t[S.t]).map(mapq);
S.pool=a;S.qs=a.slice();S.i=0;S.sc=0;S.wrong=[];S.wr=0;
nav('Quiz');
$('drillT').textContent='🔢 '+dec[2];
$('benchSec').style.display='none';renderWords();
if($('progFill'))$('progFill').style.width='0%';
if(S.qs.length)show();else{$('qbox').textContent='Nothing here yet.';$('opts').innerHTML='';if($('readSec'))$('readSec').style.display='none'}}
function finishNumSet(){stopTalk();const t=u(),n=S.qs.length,p=Math.round(S.sc/Math.max(1,n)*100),st=p>=100?3:p>=80?2:p>=60?1:0,k=S.n+S.t+'num'+S.lvl,d=load(),td=day(0),yd=day(1);
if(!S.retry){if(d.st.last!==td)d.st={last:td,n:d.st.last===yd?(d.st.n||0)+1:1};if(st>(d.lv[k]||0))d.lv[k]=st;d.totalRuns=(d.totalRuns||0)+1;d.log=(d.log||[]).filter(x=>x!==td);d.log.push(td);d.log=d.log.slice(-90);save(d)}
$('opts').innerHTML='';$('fb').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('undoBtn').style.display='none';if($('readSec'))$('readSec').style.display='none';
$('qbox').innerHTML='<strong>🔢 '+S.nsLabel+'</strong><br>📊 '+S.sc+' / '+n+' ('+p+'%) '+'⭐'.repeat(st)+'☆'.repeat(3-st);
if(p>=100)confetti();
S.res=((X[S.n]&&X[S.n].shareT)||'').replace('{p}',p).replace('{r}','Numbers '+S.nsLabel)+' '+location.href.split('#')[0];
$('shareBtn').style.display='block';$('retryBtn').style.display=S.wrong.length?'block':'none';
const nb=$('nextBtn');nb.style.display='block';nb.textContent=t.again;nb.onclick=()=>startNumSet(S.nsIdx);endNav();
if($('progFill'))$('progFill').style.width='100%';showStreak();checkBadges()}

/* --- back handling: see backGuard() below --- */
/* --- one-time onboarding --- */
function showOnboarding(cb){cb();return;
let seen=null;try{seen=localStorage.getItem('roasted_onb')}catch(e){}
if(seen||!$('onbOverlay')){cb();return}
const ov=$('onbOverlay');ov.style.display='flex';let step=1;
function render(){[1,2,3].forEach(i=>{$('onbStep'+i).style.display=i===step?'':'none'});
document.querySelectorAll('.onb-dot').forEach(dd=>dd.classList.toggle('active',+dd.dataset.s===step));
$('onbNext').textContent=step===3?"Let's go":'Next'}
render();
$('onbNext').onclick=()=>{if(step<3){step++;render()}else cls()};
$('onbSkip').onclick=cls;
function cls(){try{localStorage.setItem('roasted_onb','1')}catch(e){}ov.style.display='none';cb()}}

/* --- boot: duel link takes priority, then normal returning-user / first-run flow --- */
const DUEL=parseDuel();
if(DUEL){startDuel(DUEL)}else{
let sv=null;try{sv=localStorage.getItem('roasted_native')}catch(e){}
let svt=null;try{svt=localStorage.getItem('roasted_target')}catch(e){}
showOnboarding(()=>{
if(sv&&FLAG[sv]){S.n=sv;
if(svt&&FLAG[svt]&&svt!==sv){S.t=svt;loadData(S.n).then(()=>{texts();start();nav('Welcome');showWhatsNew()}).catch(()=>{})}
else{S.t=null;loadData(S.n).then(()=>{texts();nav('Welcome');showWhatsNew()}).catch(()=>{})}
}else{menus();nav('Welcome');showWhatsNew()}
})}

/* ================= v1.7 additions ================= */
const LESSONS_URL='https://teacherandrea.netlify.app/';
const VFALL={'af-ZA':'nl-NL'};
const NT={
en:{nextTopic:'▶ Next topic',toTopics:'📚 Back to topics',startLvl:'Start with level {n} of this topic first 😉',closeQ:'Close RoastED?',closeHint:'Press back once more to close.',yes:'Yes',no:'No',cont:'Continue',cancel:'Cancel',
save:'Save',imp:'Import',inst:'Install',del:'🗑️ Delete progress',lang:'🌍 Change language',lesBtn:'🎓 Private lessons',lesT:'Want private lessons?',lesD:'Take personalised online English or Italian lessons with Andrea.',lesLink:'🎓 Explore Private Lessons',
instHow:'To install: open your browser menu (⋮) and tap “Install app” or “Add to Home screen”.',
mean:'💬 Meaning:',hint:'💡 Hint ({n} left)',noHint:'No hints left today. Come back tomorrow!',hintDone:'The underlined part is wrong. Now fix it!',bhSum:'❓ How it works',
bh:['Read the sentence: it contains a mistake.','Rewrite the WHOLE sentence correctly (type it or say it 🎤), not just the wrong word.','Press Check. Stuck? Use a 💡 hint: it underlines the wrong part, without giving the answer.'],
bhV:['Read the word in your language.','Type (or say 🎤) the translation.','Press Check and see what your tutor thinks.'],
micNo:"Didn't catch that. Tap 🎤 and speak a bit louder and slower.",micBlock:'Microphone blocked. Allow the microphone in your browser settings.',
tips:{save:'💾 Save: downloads a backup file of your progress. Keep it to restore your progress on a new phone.',install:'📲 Install: adds RoastED to your home screen like a normal app. It works offline too.',import:'📂 Import: loads a backup file you saved before. It replaces your current progress.',learn:'▶ Learn: pick a level and a topic, study the words, then answer the questions.',story:'📖 Story mode: go through a topic’s sentences in order, like a little story.',bench:'💀 Torture Bench: fix wrong sentences by typing (or saying) the correct version. Hints underline the mistake.',review:'🎯 Review: practise again only the sentences you got wrong.',duel:'⚔️ Challenge: send a friend a link with your worst mistakes and see if they do better.',trophies:'🏆 Trophy room: your badges, level and practice calendar.',settings:'⚙️ Settings: change language, save or load progress, install the app, delete progress.',lessons:'🎓 Private lessons: opens Andrea’s website for real online English or Italian lessons.'}},
it:{nextTopic:'▶ Prossimo argomento',toTopics:'📚 Torna agli argomenti',startLvl:'Prima fai il livello {n} di questo argomento 😉',closeQ:'Chiudere RoastED?',closeHint:'Premi indietro ancora una volta per chiudere.',yes:'Sì',no:'No',cont:'Continua',cancel:'Annulla',
save:'Salva',imp:'Importa',inst:'Installa',del:'🗑️ Cancella progressi',lang:'🌍 Cambia lingua',lesBtn:'🎓 Lezioni private',lesT:'Vuoi lezioni private?',lesD:'Lezioni online personalizzate di inglese o italiano con Andrea.',lesLink:'🎓 Scopri le lezioni private',
instHow:'Per installare: apri il menu del browser (⋮) e tocca “Installa app” o “Aggiungi a schermata Home”.',
mean:'💬 Significato:',hint:'💡 Aiuto ({n} rimasti)',noHint:'Aiuti finiti per oggi. Torna domani!',hintDone:'La parte sottolineata è sbagliata. Ora correggila!',bhSum:'❓ Come funziona',
bh:['Leggi la frase: contiene un errore.','Riscrivi TUTTA la frase corretta (scrivila o dilla 🎤), non solo la parola sbagliata.','Premi Verifica. Bloccato? Usa un 💡 aiuto: sottolinea la parte sbagliata, senza darti la risposta.'],
bhV:['Leggi la parola nella tua lingua.','Scrivi (o di’ 🎤) la traduzione.','Premi Verifica e senti cosa ne pensa il tuo tutor.'],
micNo:'Non ho sentito bene. Tocca 🎤 e parla un po’ più forte e lentamente.',micBlock:'Microfono bloccato. Consenti il microfono nelle impostazioni del browser.',
tips:{save:'💾 Salva: scarica un file di backup dei tuoi progressi. Tienilo per recuperarli su un nuovo telefono.',install:'📲 Installa: aggiunge RoastED alla schermata Home come una normale app. Funziona anche offline.',import:'📂 Importa: carica un file di backup salvato prima. Sostituisce i progressi attuali.',learn:'▶ Impara: scegli un livello e un argomento, studia le parole, poi rispondi alle domande.',story:'📖 Modalità storia: le frasi di un argomento in ordine, come una piccola storia.',bench:'💀 Banco della tortura: correggi frasi sbagliate scrivendo (o dicendo) la versione giusta. Gli aiuti sottolineano l’errore.',review:'🎯 Ripasso: rifai solo le frasi che hai sbagliato.',duel:'⚔️ Sfida: manda a un amico un link con i tuoi errori peggiori e vedi se fa meglio.',trophies:'🏆 Sala trofei: i tuoi badge, il livello e il calendario.',settings:'⚙️ Impostazioni: cambia lingua, salva o carica i progressi, installa l’app, cancella i progressi.',lessons:'🎓 Lezioni private: apre il sito di Andrea per lezioni online di inglese o italiano.'}},
fr:{nextTopic:'▶ Sujet suivant',toTopics:'📚 Retour aux sujets',startLvl:'Commence d’abord par le niveau {n} de ce sujet 😉',closeQ:'Fermer RoastED ?',closeHint:'Appuie encore une fois sur retour pour fermer.',yes:'Oui',no:'Non',cont:'Continuer',cancel:'Annuler',
save:'Sauvegarder',imp:'Importer',inst:'Installer',del:'🗑️ Effacer la progression',lang:'🌍 Changer de langue',lesBtn:'🎓 Cours particuliers',lesT:'Envie de cours particuliers ?',lesD:'Cours en ligne personnalisés d’anglais ou d’italien avec Andrea.',lesLink:'🎓 Découvrir les cours particuliers',
instHow:'Pour installer : ouvre le menu du navigateur (⋮) et touche « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
mean:'💬 Sens :',hint:'💡 Indice ({n} restants)',noHint:'Plus d’indices aujourd’hui. Reviens demain !',hintDone:'La partie soulignée est fausse. À toi de la corriger !',bhSum:'❓ Comment ça marche',
bh:['Lis la phrase : elle contient une erreur.','Réécris TOUTE la phrase correcte (écris-la ou dis-la 🎤), pas seulement le mot faux.','Appuie sur Vérifier. Bloqué ? Utilise un 💡 indice : il souligne la partie fausse, sans donner la réponse.'],
bhV:['Lis le mot dans ta langue.','Écris (ou dis 🎤) la traduction.','Appuie sur Vérifier et découvre ce qu’en pense ton tuteur.'],
micNo:'Je n’ai pas bien entendu. Touche 🎤 et parle un peu plus fort et plus lentement.',micBlock:'Micro bloqué. Autorise le micro dans les réglages du navigateur.',
tips:{save:'💾 Sauvegarder : télécharge un fichier de sauvegarde de ta progression, pour la retrouver sur un nouveau téléphone.',install:'📲 Installer : ajoute RoastED à l’écran d’accueil comme une vraie appli. Fonctionne aussi hors ligne.',import:'📂 Importer : charge une sauvegarde faite avant. Elle remplace ta progression actuelle.',learn:'▶ Apprendre : choisis un niveau et un sujet, étudie les mots, puis réponds aux questions.',story:'📖 Mode histoire : les phrases d’un sujet dans l’ordre, comme une petite histoire.',bench:'💀 Banc de torture : corrige des phrases fausses en écrivant (ou en disant) la bonne version. Les indices soulignent l’erreur.',review:'🎯 Révision : refais seulement les phrases ratées.',duel:'⚔️ Défi : envoie à un ami un lien avec tes pires erreurs.',trophies:'🏆 Salle des trophées : tes badges, ton niveau et ton calendrier.',settings:'⚙️ Réglages : changer de langue, sauvegarder ou charger, installer l’appli, effacer la progression.',lessons:'🎓 Cours particuliers : ouvre le site d’Andrea pour de vrais cours en ligne d’anglais ou d’italien.'}},
de:{nextTopic:'▶ Nächstes Thema',toTopics:'📚 Zurück zu den Themen',startLvl:'Fang zuerst mit Level {n} dieses Themas an 😉',closeQ:'RoastED schließen?',closeHint:'Drück noch einmal auf Zurück, um zu schließen.',yes:'Ja',no:'Nein',cont:'Weiter',cancel:'Abbrechen',
save:'Speichern',imp:'Importieren',inst:'Installieren',del:'🗑️ Fortschritt löschen',lang:'🌍 Sprache ändern',lesBtn:'🎓 Privatunterricht',lesT:'Lust auf Privatunterricht?',lesD:'Persönlicher Online-Unterricht in Englisch oder Italienisch mit Andrea.',lesLink:'🎓 Privatunterricht ansehen',
instHow:'Zum Installieren: Browsermenü (⋮) öffnen und „App installieren“ oder „Zum Startbildschirm hinzufügen“ tippen.',
mean:'💬 Bedeutung:',hint:'💡 Tipp ({n} übrig)',noHint:'Keine Tipps mehr für heute. Komm morgen wieder!',hintDone:'Der unterstrichene Teil ist falsch. Jetzt korrigieren!',bhSum:'❓ So funktioniert’s',
bh:['Lies den Satz: Er enthält einen Fehler.','Schreib den GANZEN Satz richtig neu (tippen oder sagen 🎤), nicht nur das falsche Wort.','Tippe auf Prüfen. Festgefahren? Ein 💡 Tipp unterstreicht den falschen Teil, ohne die Lösung zu verraten.'],
bhV:['Lies das Wort in deiner Sprache.','Schreib (oder sag 🎤) die Übersetzung.','Tippe auf Prüfen und hör, was dein Tutor dazu sagt.'],
micNo:'Nicht verstanden. Tippe auf 🎤 und sprich etwas lauter und langsamer.',micBlock:'Mikrofon blockiert. Erlaube das Mikrofon in den Browser-Einstellungen.',
tips:{save:'💾 Speichern: lädt eine Sicherungsdatei deines Fortschritts herunter, um ihn auf einem neuen Handy wiederherzustellen.',install:'📲 Installieren: legt RoastED wie eine normale App auf den Startbildschirm. Funktioniert auch offline.',import:'📂 Importieren: lädt eine frühere Sicherung. Sie ersetzt deinen aktuellen Fortschritt.',learn:'▶ Lernen: Level und Thema wählen, Wörter lernen, dann die Fragen beantworten.',story:'📖 Geschichtenmodus: die Sätze eines Themas der Reihe nach, wie eine kleine Geschichte.',bench:'💀 Folterbank: Korrigiere falsche Sätze, indem du die richtige Version schreibst (oder sagst). Tipps unterstreichen den Fehler.',review:'🎯 Wiederholen: übe nur die Sätze, die falsch waren.',duel:'⚔️ Herausforderung: Schick einem Freund einen Link mit deinen schlimmsten Fehlern.',trophies:'🏆 Trophäenraum: deine Abzeichen, dein Level und dein Kalender.',settings:'⚙️ Einstellungen: Sprache ändern, Fortschritt speichern oder laden, App installieren, Fortschritt löschen.',lessons:'🎓 Privatunterricht: öffnet Andreas Website für echten Online-Unterricht in Englisch oder Italienisch.'}},
th:{nextTopic:'▶ หัวข้อถัดไป',toTopics:'📚 กลับไปที่หัวข้อ',startLvl:'เริ่มที่ระดับ {n} ของหัวข้อนี้ก่อนนะ 😉',closeQ:'ปิด RoastED ไหม?',closeHint:'กดย้อนกลับอีกครั้งเพื่อปิด',yes:'ใช่',no:'ไม่',cont:'ทำต่อ',cancel:'ยกเลิก',
save:'บันทึก',imp:'นำเข้า',inst:'ติดตั้ง',del:'🗑️ ลบความคืบหน้า',lang:'🌍 เปลี่ยนภาษา',lesBtn:'🎓 เรียนส่วนตัว',lesT:'อยากเรียนส่วนตัวไหม?',lesD:'เรียนภาษาอังกฤษหรือภาษาอิตาเลียนออนไลน์แบบตัวต่อตัวกับ Andrea',lesLink:'🎓 ดูคลาสเรียนส่วนตัว',
instHow:'วิธีติดตั้ง: เปิดเมนูเบราว์เซอร์ (⋮) แล้วแตะ “ติดตั้งแอป” หรือ “เพิ่มไปยังหน้าจอหลัก”',
mean:'💬 ความหมาย:',hint:'💡 คำใบ้ (เหลือ {n})',noHint:'วันนี้คำใบ้หมดแล้ว พรุ่งนี้มาใหม่นะ!',hintDone:'ส่วนที่ขีดเส้นใต้ผิด ลองแก้ดูสิ!',bhSum:'❓ วิธีเล่น',
bh:['อ่านประโยค: มีจุดผิดอยู่หนึ่งจุด','พิมพ์ประโยคที่ถูกต้องใหม่ทั้งประโยค (หรือพูด 🎤) ไม่ใช่แค่คำที่ผิด','กดตรวจ ติดอยู่ใช่ไหม? ใช้ 💡 คำใบ้: จะขีดเส้นใต้ส่วนที่ผิด โดยไม่บอกคำตอบ'],
bhV:['อ่านคำในภาษาของคุณ','พิมพ์ (หรือพูด 🎤) คำแปล','กดตรวจ แล้วดูว่าติวเตอร์ว่าอย่างไร'],
micNo:'ไม่ได้ยินชัด แตะ 🎤 แล้วพูดดังและช้าลงอีกนิด',micBlock:'ไมโครโฟนถูกบล็อก กรุณาอนุญาตไมโครโฟนในการตั้งค่าเบราว์เซอร์',
tips:{save:'💾 บันทึก: ดาวน์โหลดไฟล์สำรองความคืบหน้า เก็บไว้ใช้กู้คืนบนโทรศัพท์เครื่องใหม่',install:'📲 ติดตั้ง: เพิ่ม RoastED ไว้ที่หน้าจอหลักเหมือนแอปทั่วไป ใช้แบบออฟไลน์ได้ด้วย',import:'📂 นำเข้า: โหลดไฟล์สำรองที่บันทึกไว้ จะแทนที่ความคืบหน้าปัจจุบัน',learn:'▶ เรียน: เลือกระดับและหัวข้อ ทบทวนคำศัพท์ แล้วตอบคำถาม',story:'📖 โหมดเรื่องราว: ประโยคของหัวข้อเรียงตามลำดับ เหมือนเรื่องสั้น',bench:'💀 ม้านั่งทรมาน: แก้ประโยคที่ผิดโดยพิมพ์ (หรือพูด) ประโยคที่ถูก คำใบ้จะขีดเส้นใต้จุดผิด',review:'🎯 ทบทวน: ฝึกเฉพาะประโยคที่เคยตอบผิด',duel:'⚔️ ท้าเพื่อน: ส่งลิงก์ที่มีข้อผิดพลาดของคุณให้เพื่อนลองทำ',trophies:'🏆 ห้องถ้วยรางวัล: เหรียญ ระดับ และปฏิทินการฝึก',settings:'⚙️ ตั้งค่า: เปลี่ยนภาษา บันทึกหรือโหลดความคืบหน้า ติดตั้งแอป ลบความคืบหน้า',lessons:'🎓 เรียนส่วนตัว: เปิดเว็บไซต์ของ Andrea สำหรับเรียนภาษาอังกฤษหรืออิตาเลียนออนไลน์'}},
af:{nextTopic:'▶ Volgende onderwerp',toTopics:'📚 Terug na onderwerpe',startLvl:'Begin eers met vlak {n} van hierdie onderwerp 😉',closeQ:'Maak RoastED toe?',closeHint:'Druk weer terug om toe te maak.',yes:'Ja',no:'Nee',cont:'Gaan voort',cancel:'Kanselleer',
save:'Stoor',imp:'Laai in',inst:'Installeer',del:'🗑️ Vee vordering uit',lang:'🌍 Verander taal',lesBtn:'🎓 Privaat lesse',lesT:"Wil jy privaat lesse hê?",lesD:'Persoonlike aanlyn Engelse of Italiaanse lesse met Andrea.',lesLink:'🎓 Verken privaat lesse',
instHow:'Om te installeer: maak die blaaierkieslys (⋮) oop en tik “Installeer app” of “Voeg by tuisskerm”.',
mean:'💬 Betekenis:',hint:'💡 Wenk ({n} oor)',noHint:'Geen wenke meer vandag nie. Kom môre terug!',hintDone:'Die onderstreepte deel is verkeerd. Maak dit nou reg!',bhSum:'❓ Hoe dit werk',
bh:["Lees die sin: dit bevat 'n fout.",'Skryf die HELE sin reg oor (tik of sê 🎤), nie net die verkeerde woord nie.',"Druk Kontroleer. Vas? Gebruik 'n 💡 wenk: dit onderstreep die verkeerde deel, sonder om die antwoord te gee."],
bhV:['Lees die woord in jou taal.','Tik (of sê 🎤) die vertaling.','Druk Kontroleer en kyk wat jou tutor dink.'],
micNo:'Ek het dit nie gehoor nie. Tik 🎤 en praat bietjie harder en stadiger.',micBlock:'Mikrofoon geblokkeer. Laat die mikrofoon toe in jou blaaierinstellings.',
tips:{save:"💾 Stoor: laai 'n rugsteunlêer van jou vordering af, om dit op 'n nuwe foon terug te kry.",install:"📲 Installeer: sit RoastED op jou tuisskerm soos 'n gewone app. Werk ook vanlyn.",import:"📂 Laai in: laai 'n rugsteun wat jy vroeër gestoor het. Dit vervang jou huidige vordering.",learn:"▶ Leer: kies 'n vlak en 'n onderwerp, bestudeer die woorde, beantwoord dan die vrae.",story:"📖 Storiemodus: die sinne van 'n onderwerp in volgorde, soos 'n klein storie.",bench:'💀 Martelbank: maak verkeerde sinne reg deur die korrekte weergawe te tik (of te sê). Wenke onderstreep die fout.',review:'🎯 Hersien: oefen net die sinne wat jy verkeerd gehad het.',duel:"⚔️ Uitdaging: stuur 'n vriend 'n skakel met jou ergste foute.",trophies:'🏆 Trofeekamer: jou kentekens, vlak en oefenkalender.',settings:'⚙️ Instellings: verander taal, stoor of laai vordering, installeer die app, vee vordering uit.',lessons:'🎓 Privaat lesse: maak Andrea se webwerf oop vir regte aanlyn Engelse of Italiaanse lesse.'}}
};
const nt=()=>(T[S.n]&&NT[S.n])||NT.en;

/* --- sounds: friendlier "wrong" sound (two falling tones) --- */
function sfxWrong(){if(S.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const t0=AC.currentTime;
[[392,0],[311,.16]].forEach(([f,d])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(f,t0+d);o.frequency.exponentialRampToValueAtTime(f*.82,t0+d+.22);g.gain.setValueAtTime(.0001,t0+d);g.gain.exponentialRampToValueAtTime(.09,t0+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d+.26);o.connect(g);g.connect(AC.destination);o.start(t0+d);o.stop(t0+d+.28)})}catch(e){}}

/* --- answer popup (bottom sheet) --- */
function sheetEls(){return[$('fb').parentNode,$('readSec'),$('undoBtn'),$('nextBtn')]}
function openSheet(){const b=$('sheetBody');sheetEls().forEach(e=>e&&b.appendChild(e));$('fbSheet').classList.add('open');$('fbSheet').classList.remove('min');document.body.classList.add('sheet-open')}
function closeSheet(){const sh=$('fbSheet');if(!sh||!sh.classList.contains('open'))return;const ref=$('retryBtn');sheetEls().forEach(e=>e&&ref.parentNode.insertBefore(e,ref));sh.classList.remove('open','min');document.body.classList.remove('sheet-open')}
$('sheetHandle').onclick=()=>{const sh=$('fbSheet');sh.classList.toggle('min');$('sheetHandle').textContent=sh.classList.contains('min')?'▴':'▾'};
/* lock the screen on the question once the study list has been passed */
function snapQuiz(){if(S.screen!=='Quiz')return;const wl=$('wordList');if(!wl||wl.style.display==='none'||S.i===0)return;try{$('drillSec').scrollIntoView({block:'start',behavior:'smooth'})}catch(e){}}

/* --- topics: always open; a topic whose earlier level isn't done starts there --- */
/* LOCK_LEVELS: false = every level of every topic opens freely (testing); true = finish a level (60%) to open the next */
const LOCK_LEVELS=false;
function firstUndone(tp){for(let l=1;l<=3;l++){if(!(lstars(tp,l)>0))return l}return 3}
function openTopic(tp){stopTalk();S.topic=tp;S.boss=0;S.benchAll=0;if(tp==='num'){nav('NumSets');return}
const fu=firstUndone(tp);if(LOCK_LEVELS&&fu<S.lvl){S.lvl=fu;toast(nt().startLvl.replace('{n}',fu),3500)}start();nav('Quiz')}

/* --- end of a round: next topic / back to topics --- */
function endNav(){const box=$('endNav'),a=$('nextTopicBtn'),b=$('toTopicsBtn'),N=nt();if(S.boss||S.review){box.style.display='none'}else{
if(S.story){const i=SENT.indexOf(S.topic),nx=SENT[i+1];a.style.display=nx?'block':'none';a.textContent=N.nextTopic;a.onclick=()=>startStory(nx);b.style.display='block';b.textContent=N.toTopics;b.onclick=()=>nav('Story')}
else if(S.numset){const nx=S.nsIdx+1<NUM_DECADES.length?S.nsIdx+1:null;a.style.display=nx!==null?'block':'none';a.textContent='▶ 🔢 '+(nx!==null?NUM_DECADES[nx][2]:'');a.onclick=()=>startNumSet(nx);b.style.display='block';b.textContent=N.toTopics;b.onclick=()=>nav('NumSets')}
else{const o=curOrder(),nx=o[o.indexOf(S.topic)+1];a.style.display=nx?'block':'none';a.textContent=N.nextTopic+(nx?' · '+u().topics[TOP.indexOf(nx)]:'');a.onclick=()=>openTopic(nx);b.style.display='block';b.textContent=N.toTopics;b.onclick=()=>nav('Topics')}
box.style.display='flex'}
const ll=$('lessonsLink');ll.textContent=N.lesLink;ll.style.display='block'}
function openLessons(){try{window.open(LESSONS_URL,'_blank','noopener')}catch(e){location.href=LESSONS_URL}}
$('lessonsLink').onclick=openLessons;

/* --- install (first page + settings) --- */
function installApp(){if(S.ip){S.ip.prompt();S.ip=null;$('goInstall').style.display='none';return}
if(window.matchMedia&&matchMedia('(display-mode: standalone)').matches){toast('✅ RoastED');return}
toast(/iphone|ipad|ipod/i.test(navigator.userAgent||'')?((X[S.n]&&X[S.n].ios)||nt().instHow):nt().instHow,7000)}
$('wInstallBtn').onclick=installApp;$('sInstall').onclick=installApp;
$('sSave').onclick=()=>$('exportBtn').onclick();$('sImport').onclick=()=>$('importFile').click();
$('sLang').onclick=()=>nav('Welcome');$('sLessons').onclick=openLessons;$('goLessons').onclick=openLessons;

/* --- labels for everything new, in the student's language --- */
function labels2(){const N=nt(),x=X[S.n]||{};
$('wSaveL').textContent=N.save;$('wImpL').textContent=N.imp;$('wInstL').textContent=N.inst;
$('setTitle').textContent='⚙️ '+(x.set||'Settings');$('sLang').textContent=N.lang;$('sSave').textContent='💾 '+N.save;$('sImport').textContent='📂 '+N.imp;$('sInstall').textContent='📲 '+N.inst;$('sLessons').textContent=N.lesBtn;$('resetBtn').textContent=N.del;
$('lesT').textContent=N.lesT;$('lesD').textContent=N.lesD;
$('tipYes').textContent=N.cont;$('tipNo').textContent=N.cancel;$('closeYes').textContent=N.yes;$('closeNo').textContent=N.no;$('closeText').textContent=N.closeQ;
$('bhSum').textContent=N.bhSum}
const _lab=labels;labels=function(){_lab();labels2()};

/* --- first-tap explanation bubbles --- */
function seenTips(){try{return JSON.parse(localStorage.getItem('roasted_tips')||'{}')}catch(e){return{}}}
function tip(key,btn,go){const s=seenTips();if(s[key]){go();return}
const pop=$('tipPop');$('tipText').textContent=nt().tips[key]||'';pop.style.display='block';
try{const r=btn.getBoundingClientRect(),w=Math.min(320,innerWidth-24);pop.style.width=w+'px';pop.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';const below=r.bottom+10,h=pop.offsetHeight||140;pop.style.top=(below+h<innerHeight?below:Math.max(12,r.top-h-10))+'px'}catch(e){}
$('tipYes').onclick=()=>{pop.style.display='none';const t=seenTips();t[key]=1;try{localStorage.setItem('roasted_tips',JSON.stringify(t))}catch(e){}go()};
$('tipNo').onclick=()=>{pop.style.display='none'}}
[['exportBtn','save'],['wInstallBtn','install'],['importBtn','import'],['sSave','save'],['sInstall','install'],['sImport','import'],['goLearn','learn'],['goStory','story'],['goBench','bench'],['goReview','review'],['goDuel','duel'],['goTrophies','trophies'],['goSet','settings'],['goLessons','lessons'],['sLessons','lessons']].forEach(([id,key])=>{const b=$(id);if(!b)return;const f=b.onclick;if(!f)return;b.onclick=e=>tip(key,b,()=>f.call(b,e))});

/* --- Torture Bench: how it works, meaning, hints (5 a day) --- */
const HINTS_PER_DAY=5;
function hintState(){let h=null;try{h=JSON.parse(localStorage.getItem('roasted_hints')||'null')}catch(e){}if(!h||h.d!==day(0))h={d:day(0),n:HINTS_PER_DAY};return h}
function hintSave(h){try{localStorage.setItem('roasted_hints',JSON.stringify(h))}catch(e){}}
function benchExtras(){const N=nt(),bi=S.bi;$('bhList').innerHTML='';(bi&&bi.v?N.bhV:N.bh).forEach(t=>{const li=document.createElement('li');li.textContent=t;$('bhList').appendChild(li)});
let seen=null;try{seen=localStorage.getItem('roasted_benchhelp')}catch(e){}if(!seen){$('benchHelp').open=true;try{localStorage.setItem('roasted_benchhelp','1')}catch(e){}}
const m=$('bqMean');if(bi&&bi.m){m.textContent=N.mean+' '+bi.m;m.style.display='block'}else m.style.display='none';
const hb=$('hintBtn');if(bi&&!bi.v){hb.style.display='';hb.disabled=false;hb.textContent=N.hint.replace('{n}',hintState().n)}else hb.style.display='none'}
function esc(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function lcsMark(a,b,eq){const n=a.length,m=b.length,d=[...Array(n+1)].map(()=>new Array(m+1).fill(0));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)d[i][j]=eq(a[i],b[j])?d[i+1][j+1]+1:Math.max(d[i+1][j],d[i][j+1]);
const bad=new Array(n).fill(false);let i=0,j=0;const gap=[];while(i<n&&j<m){if(eq(a[i],b[j])){i++;j++}else if(d[i+1][j]>=d[i][j+1]){bad[i]=true;i++}else{gap.push(i);j++}}while(i<n){bad[i]=true;i++}if(j<m)gap.push(n);
if(!bad.some(Boolean))gap.forEach(g=>{bad[Math.max(0,Math.min(n-1,g-1))]=true;if(g<n)bad[g]=true});return bad}
function hintHTML(p,a){const th=S.t==='th',nw=w=>norm(w);
if(th){const A=[...p],B=[...a],bad=lcsMark(A,B,(x,y)=>x===y);return A.map((c,i)=>bad[i]?'<u class="hint-u">'+esc(c)+'</u>':esc(c)).join('')}
const A=p.split(/(\s+)/),words=A.filter((_,i)=>i%2===0),B=a.split(/\s+/),bad=lcsMark(words,B,(x,y)=>nw(x)===nw(y));let k=0;
return A.map((t,i)=>{if(i%2)return esc(t);const h=bad[k++];return h?'<u class="hint-u">'+esc(t)+'</u>':esc(t)}).join('')}
$('hintBtn').onclick=()=>{const bi=S.bi;if(!bi||bi.v)return;const h=hintState(),N=nt();if(h.n<=0){toast(N.noHint,4000);return}
h.n--;hintSave(h);$('bq').innerHTML=hintHTML(bi.p,bi.a);$('hintBtn').textContent=N.hint.replace('{n}',h.n);$('hintBtn').disabled=true;toast(N.hintDone,3000)};

/* --- microphone helpers --- */
function bestAlt(res,target){let best=res[0]&&res[0].transcript||'';if(!target)return best;const c=norm(numify(target,S.t));let bd=1e9;for(let i=0;i<res.length;i++){const t=res[i].transcript,dd=lev(norm(numify(t,S.t)),c);if(dd<bd){bd=dd;best=t}}return best}
function micMsg(ev){const N=nt();return ev&&(ev.error==='not-allowed'||ev.error==='service-not-allowed')?N.micBlock:N.micNo}
function micErr(ev){toast(micMsg(ev),4500)}

/* --- back button: first back on the first page asks; a second back closes --- */
let GUARD=0;function arm(e){if(e&&e.target&&e.target.id==='closeYes')return;if(GUARD)return;try{history.pushState({app:1},'');GUARD=1}catch(_){}}
document.addEventListener('pointerdown',arm,true);document.addEventListener('keydown',arm,true);
window.addEventListener('popstate',()=>{GUARD=0;
if($('closeDlg').style.display==='block'){try{history.back()}catch(e){}return}
if($('tipPop').style.display==='block'){$('tipPop').style.display='none';arm();return}
if($('fbSheet').classList.contains('open')&&S.screen==='Quiz'){$('fbSheet').classList.add('min');$('sheetHandle').textContent='▴';arm();return}
if(atRoot(S.screen)){$('closeDlg').style.display='block';return}
goBack();arm()});
$('closeNo').onclick=()=>{$('closeDlg').style.display='none'};
$('closeYes').onclick=()=>{$('closeText').textContent=nt().closeHint;try{window.close()}catch(e){}setTimeout(()=>{$('closeDlg').style.display='none';$('closeText').textContent=nt().closeQ},4000)};

/* --- preload all tutor avatars so switching language is instant --- */
['it','en','fr','de','th','af'].forEach(c=>{const im=new Image();im.src='images/'+c+'.webp'});

WHATS_NEW.length=0;WHATS_NEW.push('▶ End of a level: go to the next topic or back to the topics','📚 All topics always open; a new topic starts from the level you still need','💬 Your answer opens a popup with the roast, the listen button and the mic','💀 Torture Bench: “how it works”, the meaning of the sentence, and 5 daily 💡 hints','⚙️ New Settings page; 💾 📲 📂 on the first page with a short explanation','🎓 Private lessons with Andrea','🔢 Study list is back in the number groups','🎤 Better mic matching for numbers and short words','🗣️ Afrikaans can now be listened to (Dutch voice if no Afrikaans voice)');
labels2();
/* v1.8 personal roasts: used only where an item has no roast of its own. {wrong}=picked answer, {means}=its real meaning, {right}=correct answer */
const PR={
en:{pick:['“{wrong}” means “{means}”, old chap. Close, if one squints from across the Channel.','Ah, “{wrong}”. That’s “{means}”. Entirely different thing, rather like tea and coffee.','You chose “{wrong}”, which means “{means}”. Bold. Wrong, but bold.','“{wrong}”? That’s “{means}”, my dear fellow. Do keep up.'],
 again:['“{right}” again, old chap. We’ve met before, you and this word. It remembers you.','Once is an accident. Twice with “{right}” is a habit, and not a good one.','I shall say it slowly, one more time: “{right}”. Do write it down.'],
 row:['Three in a row. Shall I ring for tea while you regroup?','A streak, my dear fellow, just not the kind one frames.','Steady on. Breathe. Even Wellington lost a skirmish or two.']},
it:{pick:['«{wrong}» vuol dire «{means}», tesoro. Non è la stessa cosa, eh!','Hai scelto «{wrong}», cioè «{means}». La nonna si sta già alzando dalla sedia.','«{wrong}»? Ma quello è «{means}», caro mio! Occhi aperti.','«{wrong}» significa «{means}». Vicino, ma come il sale e lo zucchero: guai a confonderli.'],
 again:['Ancora «{right}», tesoro? Questa parola ti vuole bene, ma tu no.','Due volte la stessa! La cucchiarola è già in mano.','Ripeti con la nonna: «{right}». Bravo, adesso non scordartela più.'],
 row:['Tre di fila! Siediti, ti preparo un caffè e ricominciamo.','Madonna santa… respira, tesoro, e riprova.','Una serie così non la vedevo dalla finale del ’94.']}};
function personalRoast(q,oi,again){const p=PR[S.n];if(!p)return '';if(again)return pick(p.again).replace('{right}',q.f);
const w=q.o[oi],m=((RE[S.n]||{})[S.topic]||[]).find(e=>e.t[S.t]&&e.t[S.t].f===w&&e.s!==q.s);return m?pick(p.pick).replace('{wrong}',w).replace('{means}',m.s):''}
/* build number shown at the bottom of Settings — bump together with the sw.js cache name */
const BUILD='v26';try{$('buildV').textContent='RoastED · build '+BUILD}catch(e){}
window.__booted=1;

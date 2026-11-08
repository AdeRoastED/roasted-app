const $=id=>document.getElementById(id),pick=a=>a[Math.floor(Math.random()*a.length)];
const TOP=['food','travel','sports','culture','dailylife','greet','adj','basic','num','col','time'],SENT=TOP.slice(0,5),VOC=TOP.slice(5),FLAG={it:'Italiano',en:'English',fr:'Français',de:'Deutsch',th:'ไทย',af:'Afrikaans'};
const FL={"it": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 3 2\"><rect width=\"1\" height=\"2\" fill=\"#009246\"/><rect x=\"1\" width=\"1\" height=\"2\" fill=\"#fff\"/><rect x=\"2\" width=\"1\" height=\"2\" fill=\"#ce2b37\"/></svg>", "fr": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 3 2\"><rect width=\"1\" height=\"2\" fill=\"#0055a4\"/><rect x=\"1\" width=\"1\" height=\"2\" fill=\"#fff\"/><rect x=\"2\" width=\"1\" height=\"2\" fill=\"#ef4135\"/></svg>", "de": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 5 3\"><rect width=\"5\" height=\"1\" fill=\"#000\"/><rect y=\"1\" width=\"5\" height=\"1\" fill=\"#dd0000\"/><rect y=\"2\" width=\"5\" height=\"1\" fill=\"#ffce00\"/></svg>", "th": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 6 4\"><rect width=\"6\" height=\"4\" fill=\"#a51931\"/><rect y=\"1\" width=\"6\" height=\"2\" fill=\"#fff\"/><rect y=\"1.5\" width=\"6\" height=\"1\" fill=\"#2d2a4a\"/><rect y=\"1\" width=\"6\" height=\".5\" fill=\"#fff\"/><rect y=\"2.5\" width=\"6\" height=\".5\" fill=\"#fff\"/></svg>", "en": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 60 30\"><rect width=\"60\" height=\"30\" fill=\"#012169\"/><path d=\"M0 0L60 30M60 0L0 30\" stroke=\"#fff\" stroke-width=\"6\"/><path d=\"M0 0L60 30M60 0L0 30\" stroke=\"#c8102e\" stroke-width=\"2\"/><path d=\"M30 0V30M0 15H60\" stroke=\"#fff\" stroke-width=\"10\"/><path d=\"M30 0V30M0 15H60\" stroke=\"#c8102e\" stroke-width=\"6\"/></svg>", "af": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 9 6\"><rect width=\"9\" height=\"3\" fill=\"#de3831\"/><rect y=\"3\" width=\"9\" height=\"3\" fill=\"#002395\"/><path d=\"M0 0L3.6 3 0 6M3.6 3H9\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.2\"/><path d=\"M0 0L3.6 3 0 6M3.6 3H9\" fill=\"none\" stroke=\"#007a4d\" stroke-width=\"1.2\"/><path d=\"M0 .7L2.3 3 0 5.3z\" fill=\"#000\" stroke=\"#ffb612\" stroke-width=\".5\"/></svg>"};
const S={n:'it',t:'en',topic:'food',i:0,sc:0,qs:[],bq:null,mute:0,wrong:[],say:'',retry:0,res:'',lvl:1,boss:0,pool:[]};
const T={},OPEN={};
const u=()=>T[S.n];
let AC;function beep(f){if(S.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+.15)}catch(e){}}
function mood(){}
function cap(x){return x?x.charAt(0).toUpperCase()+x.slice(1):x}
function btns(id,codes,cur,fn){const box=$(id),nat=id==='natOpts';box.innerHTML='';codes.forEach(c=>{const b=document.createElement('button');b.className='lang-choice-btn'+(c===cur?' active':'');b.setAttribute('aria-pressed',c===cur);const im=document.createElement('img');im.className='flag';im.alt='';im.src='data:image/svg+xml,'+encodeURIComponent(FL[c]);const sp=document.createElement('span');sp.textContent=nat?FLAG[c]:cap((T[S.n]&&T[S.n].langs&&T[S.n].langs[c])||FLAG[c]);b.appendChild(im);b.appendChild(sp);b.onclick=()=>fn(c);box.appendChild(b)})}
function menus(){btns('natOpts',['it','en','fr','de','th','af'],S.n,c=>{S.n=c;if(S.t===c)S.t=Object.keys(FLAG).find(x=>x!==c);S.lvl=1;S.boss=0;stopTalk();loadData(c).then(()=>{try{localStorage.setItem('roasted_native',c)}catch(e){}texts();start();nav('Home')}).catch(()=>{})});btns('tgtOpts',Object.keys(FLAG).filter(c=>c!==S.n),S.t,c=>{stopTalk();S.t=c;S.lvl=1;S.boss=0;menus();start()})}
function texts(){const t=u();document.documentElement.lang=S.n;document.title='RoastED · '+t.h;menus();$('natLbl').textContent=t.nat;$('tgtLbl').textContent=t.tgt;$('headline').textContent=t.h;$('sub').textContent=t.sub;$('charImg').src='images/'+t.img+'.webp';$('caption').textContent=t.cap;$('fixT').textContent=t.fixT;$('fixD').textContent=t.fixD;$('fixIn').placeholder=t.fixPh;$('fixBtn').textContent=t.fixBtn;$('newBtn').textContent=t.newS;
const box=$('topics');box.innerHTML='';TOP.forEach((k,i)=>{const d=document.createElement('button');d.type='button';d.setAttribute('aria-pressed',k===S.topic);d.className='topic-pill'+(k===S.topic?' active':'');d.textContent=t.topics[i];d.onclick=()=>{stopTalk();S.topic=k;S.lvl=1;S.boss=0;texts();start()};box.appendChild(d)})}
function mapq(e){return Object.assign({s:e.s},e.t[S.t])}
function pool(){if(S.boss){let a=[];for(const tp of SENT)a=a.concat(RE[S.n][tp].filter(e=>e.t[S.t]).map(mapq));shuf(a);const ms=new Set(load().mis[S.n+S.t]||[]),m=a.filter(x=>ms.has(x.s)).slice(0,10);return m.concat(a.filter(x=>!m.includes(x)))}
const a=RE[S.n][S.topic].filter(e=>e.t[S.t]).map(mapq);return VOC.includes(S.topic)?a:a.sort((x,y)=>x.f.length-y.f.length)}
function start(){S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.wr=0;S.pool=pool();const x=X[S.n];S.qs=S.boss?S.pool.slice(0,20):S.lvl===3?shuf(S.pool.slice()).slice(0,10):S.pool.slice((S.lvl-1)*10,S.lvl*10);
$('drillT').textContent=S.boss?x.boss:u().topics[TOP.indexOf(S.topic)].replace(/^\S+\s/,'')+' · '+x.lvl+' '+S.lvl;renderLevels();showStreak();
if(!S.qs.length){mood();$('prog').textContent='';$('qbox').textContent=u().soon;$('opts').innerHTML='';$('fb').style.display='none';$('nextBtn').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('shareBtn').style.display=$('retryBtn').style.display='none';$('bq').textContent='';return}
$('benchSec').style.display='';renderWords();mood();show();bench()}
function show(){const t=u(),q=S.qs[S.i];$('prog').textContent=t.qn+' '+(S.i+1)+' / '+S.qs.length;$('qbox').textContent=t.q.replace('{s}',q.s).replace('{L}',t.langs[S.t]);$('fb').style.display='none';$('nextBtn').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('shareBtn').style.display=$('retryBtn').style.display='none';
let ord=[0,1,2,3];if(!q.ns)for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
const g=$('opts');g.innerHTML='';ord.forEach((oi,k)=>{const b=document.createElement('button');b.className='option-btn';b.textContent=String.fromCharCode(65+k)+'. '+q.o[oi];b.onclick=()=>answer(oi,g,ord);g.appendChild(b)})}
function answer(oi,g,ord){const t=u(),q=S.qs[S.i],ok=oi===q.c,fb=$('fb');beep(ok?660:200);mood(ok?'happy':'angry');if(ok)S.sc++;else S.wrong.push(q);trackMis(q,ok);
[...g.children].forEach((b,k)=>{b.disabled=true;if(ord[k]===q.c)b.classList.add('correct');else if(ord[k]===oi)b.classList.add('incorrect')});
fb.style.display='block';fb.style.cssText+=ok?';background:#ECFDF3;border-color:#12B76A;color:#027A48':';background:#FDF3F2;border-color:#FECDCA;color:#B42318';
const trap=!ok&&q.literal_trap&&q.o[oi]===q.literal_trap&&q.roast_if_wrong;S.wr=ok?0:(S.wr||0)+1;const pity=!ok&&S.wr>=3;if(pity)S.wr=0;const msg=ok?pick(t.right):pity?X[S.n].pity:(trap?q.roast_if_wrong:(q.r?(Math.random()<.7?pick(OPEN[S.n]):'')+q.r:pick(t.wrong)));fb.innerHTML=ok?'<strong>🎉 '+t.ok+'</strong> '+msg:'<strong>'+(trap?'🪤 ':'🎩 ')+t.wh+'</strong> '+msg+'<br><em>'+t.cor+' '+(q.natural_version||q.f)+'</em>'+(q.native_context&&!ok?'<br><small>'+q.native_context+'</small>':'');talk(msg);
S.say=q.f;$('sayBtn').style.display=$('repBtn').style.display='inline-block';$('nextBtn').textContent=t.next;$('nextBtn').style.display='block';$('nextBtn').onclick=()=>{S.i++;S.i>=S.qs.length?finish():show()}}
function finish(){const t=u(),x=X[S.n],n=S.qs.length,p=Math.round(S.sc/n*100),ti=t.tiers[p<40?0:p<70?1:p<90?2:3],st=p>=100?3:p>=80?2:p>=60?1:0,k=S.boss?S.n+S.t+'boss':S.n+S.t+S.topic+S.lvl,d=load(),td=day(0),yd=day(1);
if(!S.retry){if(d.st.last!==td)d.st={last:td,n:d.st.last===yd?(d.st.n||0)+1:1};if(st>(d.lv[k]||0))d.lv[k]=st;save(d)}
$('opts').innerHTML='';$('fb').style.display='none';$('sayBtn').style.display=$('repBtn').style.display='none';
const hasNext=!S.boss&&!S.retry&&st>0&&S.lvl<3;
$('qbox').innerHTML=S.retry?'<strong>🔁 '+x.retryL+': '+S.sc+' / '+n+'</strong><span class="tier">'+ti+'</span>':'<strong>📊 '+t.sc+': '+S.sc+' / '+n+' ('+p+'%) '+'⭐'.repeat(st)+'☆'.repeat(3-st)+'</strong><span class="tier">'+ti+'</span><span class="tier">'+(st>0?(hasNext?'🔓 '+x.unlocked:'🎉'):(!S.boss&&S.lvl<3?'🔒 '+x.lvlHint:''))+'</span>';
mood(p>=60?'happy':'angry');talk(ti);S.res=x.shareT.replace('{p}',p).replace('{r}',ti)+' '+location.href.split('#')[0];
$('shareBtn').style.display=S.retry?'none':'block';$('retryBtn').style.display=S.wrong.length?'block':'none';
const nb=$('nextBtn');nb.style.display='block';if(hasNext){nb.textContent=x.nextlvl;nb.onclick=()=>{S.lvl++;start()}}else{nb.textContent=t.again;nb.onclick=start}renderLevels();showStreak()}
const norm=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:«»"“”„]/g,'').replace(/\s+/g,' ').trim().replace(S.t==='th'?/\s+/g:/(?!)/g,'');
function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function benchPool(){if(S.benchAll){let a=[];for(const tp of SENT)a=a.concat(RE[S.n][tp].filter(e=>e.t[S.t]).map(mapq));return a}return S.pool}
function bench(){const bp=benchPool(),pl=bp.filter(x=>!x.ns),q=pick(pl.length?pl:bp),v=VOC.includes(S.topic)&&!S.benchAll;S.bi=v?{p:'“'+q.s+'” → ?',a:q.f}:{p:pick(q.o.filter((_,i)=>i!==q.c)),a:q.f};
$('bq').textContent=S.bi.p;$('fixD').textContent=v?X[S.n].benchW:u().fixD;$('fixIn').value='';$('fixOut').style.display='none'}
const lev=(a,b)=>{const m=[...Array(a.length+1)].map((_,i)=>[i]);for(let j=1;j<=b.length;j++)m[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]};
$('fixBtn').onclick=()=>{const t=u(),x=X[S.n],v=$('fixIn').value.trim(),o=$('fixOut');if(!v||!S.bi)return;const a=norm(v),c=norm(S.bi.a),ok=a===c,typo=!ok&&c.length>5&&lev(a,c)<=Math.max(2,Math.floor(c.length*.1)),same=!ok&&a===norm(S.bi.p);
beep(ok?660:200);mood(ok?'happy':'angry');o.style.display='block';const msg=ok?pick(t.right):typo?x.typo:same?x.same:pick(t.wrong);talk(msg);
o.innerHTML=ok?'<strong>🎉 '+t.ok+'</strong> '+msg:'<strong>'+(typo?'🔤 ':same?'🪞 ':'🔥 ')+t.wh+'</strong> '+msg+'<div class="custom-correction">✨ '+t.cor+' '+S.bi.a+'</div>'};
$('newBtn').onclick=bench;
const load=()=>{try{const d=JSON.parse(localStorage.getItem('roasted')||'{}');return{best:d.best||{},st:d.st||{},lv:d.lv||{},mis:d.mis||{}}}catch(e){return{best:{},st:{},lv:{},mis:{}}}};
const save=d=>{try{localStorage.setItem('roasted',JSON.stringify(d))}catch(e){}};
const X={};
const VOICE={af:'af-ZA',th:'th-TH',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT'};
$('sayBtn').onclick=()=>{if(!S.say)return;if(!window.speechSynthesis){note('novoice');return}speakLine(S.say,VOICE[S.t],[1,.88],'f')};
$('repBtn').onclick=()=>{const q=S.qs[S.i];window.open('https://github.com/AdeRoastED/roasted-app/issues/new?title='+encodeURIComponent('Wrong answer? '+S.n+'>'+S.t+' '+S.topic)+'&body='+encodeURIComponent('Question: '+q.s+'\nMarked correct: '+q.f+'\nWhat is wrong:'),'_blank')};
$('shareBtn').onclick=()=>{if(navigator.share)navigator.share({text:S.res}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(S.res).then(()=>alert('✔ Copied'))};
$('retryBtn').onclick=()=>{S.qs=S.wrong.slice();S.wrong=[];S.i=0;S.sc=0;S.retry=1;mood();show()};
$('muteBtn').onclick=()=>{S.mute=S.mute?0:1;$('muteBtn').textContent=S.mute?'🔇':'🎵'};
function labels(){const x=X[S.n];$('offTag').textContent=x.offline;$('goInstall').textContent='📲 '+x.install;$('iosHint').textContent=x.ios;$('goLearn').textContent='▶ '+x.learn;$('goBench').textContent='💀 '+u().fixT.replace(/^\S+\s/,'');$('goSet').textContent='⚙️ '+x.set;['backL','backT','backQ','backW'].forEach(i=>{$(i).textContent='← '+x.back});$('resetBtn').textContent='🗑️';$('sayBtn').textContent=x.listen;$('repBtn').textContent=x.report;$('shareBtn').textContent=x.share;$('retryBtn').textContent=x.retry}
const _t=texts;texts=function(){_t();labels()};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
S.voice=1;const TUNE={};
const VP={};let VOICES=[];
if(window.speechSynthesis){const lv=()=>{VOICES=speechSynthesis.getVoices()};lv();speechSynthesis.onvoiceschanged=lv}
const NAT=/natural|neural|online|premium|enhanced|wavenet|google/i;
function pickVoice(lang,g){const b=lang.slice(0,2).toLowerCase();let best=null,bs=-1;for(const v of VOICES){if(!v.lang||v.lang.slice(0,2).toLowerCase()!==b)continue;const n=v.name.toLowerCase();let sc=0;if(v.lang.replace('_','-').toLowerCase()===lang.toLowerCase())sc+=3;if(NAT.test(n))sc+=6;if(/google|microsoft|apple/.test(n))sc+=2;if(v.localService===false)sc+=1;
const fem=/\bfemale\b|woman|elsa|alice|amelie|amélie|marie|paola|federica|anna|petra|katja|hedda|susan|hazel|libby|sonia|jenny|aria|zira|samantha|karen|moira|tessa|emma|brigitte|denise|eloise|vivian|premwadee|kanya/.test(n),mal=/\bmale\b|\bman\b|diego|luca|cosimo|daniel|arthur|george|ryan|james|thomas|henri|claude|antoine|paul|guy|conrad|stefan|markus|hans|jonas|ralf|alex|fred|oliver|niwat/.test(n);
if(g==='f'&&fem)sc+=4;if(g==='m'&&mal&&!fem)sc+=4;if(sc>bs){bs=sc;best=v}}return best}
function speakLine(x,lang,tune,g){const parts=x.replace(/[«»“”„]/g,'').match(/[^.!?…]+[.!?…]*/g)||[x],v=pickVoice(lang,g),nat=v&&NAT.test(v.name);if(!v&&VOICES.length&&!VOICES.some(z=>z.lang&&z.lang.slice(0,2).toLowerCase()===lang.slice(0,2).toLowerCase())){note('novoice');return}speechSynthesis.cancel();
parts.forEach((p,i)=>{const m=new SpeechSynthesisUtterance(p.trim());m.lang=lang;if(v)m.voice=v;m.pitch=nat?1:tune[0]*(i%2?1.05:.97);m.rate=(nat?1:Math.min(tune[1],.95))*(i===parts.length-1?.95:1);speechSynthesis.speak(m)})}
function talk(x){if(!S.voice||!window.speechSynthesis)return;try{speakLine(x,VOICE[S.n],TUNE[S.n],VP[S.n])}catch(e){}}
$('voiceBtn').onclick=()=>{S.voice=S.voice?0:1;$('voiceBtn').textContent=S.voice?'🗣️':'🤐';if(!S.voice&&window.speechSynthesis)speechSynthesis.cancel()};
const day=o=>new Date(Date.now()-o*864e5).toISOString().slice(0,10);
function stopTalk(){try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}}
function toast(m){const n=$('voiceNote');n.textContent=m;n.style.display='block';clearTimeout(S.tt);S.tt=setTimeout(()=>{n.style.display='none'},5000)}
function showStreak(){const s=load().st||{},n=(s.last===day(0)||s.last===day(1))?(s.n||0):0,b=$('streakBadge');b.textContent='🔥 '+n;b.style.display=n?'block':'none';b.className=(n>0&&n%5===0)?'pulse':''}
const stars=k=>load().lv[k]||0,lk=l=>S.n+S.t+S.topic+l;
function cleared(){const d=load().lv;return Object.keys(d).filter(k=>k.indexOf(S.n+S.t)===0&&k.indexOf('boss')<0&&d[k]>0).length}
function renderLevels(){const x=X[S.n],box=$('levels');box.innerHTML='';const n=Math.max(1,Math.ceil(RE[S.n][S.topic].filter(e=>e.t[S.t]).length/10));
for(let l=1;l<=n;l++){const open=l===1||stars(lk(l-1))>0,b=document.createElement('button');b.type='button';b.className='lvl'+(!S.boss&&S.lvl===l?' active':'');b.disabled=!open;b.textContent=(open?'':'🔒 ')+x.lvl+' '+l+' '+'⭐'.repeat(stars(lk(l)));b.onclick=()=>{stopTalk();S.boss=0;S.lvl=l;start()};box.appendChild(b)}
const bo=cleared()>=4,bb=document.createElement('button');bb.type='button';bb.className='lvl'+(S.boss?' active':'');bb.disabled=!bo;bb.textContent=(bo?'👑 ':'🔒 ')+x.boss+' '+'⭐'.repeat(stars(S.n+S.t+'boss'));bb.onclick=()=>{stopTalk();S.boss=1;start()};box.appendChild(bb);$('lvlHint').textContent=x.lvlHint}


function renderWords(){const box=$('wordList');box.innerHTML='';if(!VOC.includes(S.topic)||S.boss){box.style.display='none';return}box.style.display='grid';const h=document.createElement('h4');h.textContent='📖 '+X[S.n].studyW;box.appendChild(h);
RE[S.n][S.topic].forEach(e=>{const w=e.t[S.t];if(!w)return;const r=document.createElement('div');r.className='wrow';const a=document.createElement('span');a.textContent=e.s;const b=document.createElement('b');b.textContent=w.f;const k=document.createElement('button');k.type='button';k.textContent='🔊';k.setAttribute('aria-label',X[S.n].listen);k.onclick=()=>{if(window.speechSynthesis)speakLine(w.f,VOICE[S.t],[1,.85],'f');else note('novoice')};r.appendChild(a);r.appendChild(b);r.appendChild(k);box.appendChild(r)})}
const ICON={food:'🍕'};
const SCRS=['Welcome','Home','Levels','Topics','Quiz'];
const lstars=(tp,l)=>load().lv[S.n+S.t+tp+l]||0,tOpen=(tp,l)=>l===1||lstars(tp,l-1)>0;
function card(box,txt,sub,dis,fn){const b=document.createElement('button');b.type='button';b.className='card';b.disabled=!!dis;const a=document.createElement('span');a.textContent=txt;const c=document.createElement('small');c.textContent=sub;b.appendChild(a);b.appendChild(c);b.onclick=fn;box.appendChild(b)}
function renderLevelsMenu(){const x=X[S.n],box=$('lvCards'),nm=[x.ln1,x.ln2,x.ln3];box.innerHTML='';
for(let l=1;l<=3;l++){let st=0,op=l===1;TOP.forEach(tp=>{st+=lstars(tp,l);if(tOpen(tp,l))op=true});card(box,(op?'':'🔒 ')+x.lvl+' '+l+' · '+nm[l-1],'⭐ '+st+'/'+TOP.length*3,!op,()=>{S.lvl=l;nav('Topics')})}
const bo=cleared()>=4;card(box,(bo?'👑 ':'🔒 ')+x.boss,'⭐ '+stars(S.n+S.t+'boss')+'/3',!bo,()=>{S.boss=1;S.benchAll=0;start();nav('Quiz')})}
function renderTopicsMenu(){const x=X[S.n],t=u(),box=$('tpCards');box.innerHTML='';$('crumbT').textContent=x.lvl+' '+S.lvl+' · '+[x.ln1,x.ln2,x.ln3][S.lvl-1];
TOP.forEach((tp,i)=>{const op=tOpen(tp,S.lvl),n=lstars(tp,S.lvl);card(box,(op?'':'🔒 ')+t.topics[i],'⭐'.repeat(n)+'☆'.repeat(3-n),!op,()=>{S.topic=tp;S.boss=0;S.benchAll=0;start();nav('Quiz')})})}
function nav(n){stopTalk();S.screen=n;const sc=n==='Bench'?'Quiz':n;SCRS.forEach(k=>{$('scr'+k).style.display=k===sc?'':'none'});
$('drillSec').style.display=n==='Bench'?'none':'';if(n==='Bench')$('wordList').style.display='none';
if(n==='Levels')renderLevelsMenu();if(n==='Topics')renderTopicsMenu();
if(n==='Quiz'||n==='Bench'){const x=X[S.n];$('crumbQ').textContent=n==='Bench'?'💀':(S.boss?x.boss:x.lvl+' '+S.lvl+' · '+u().topics[TOP.indexOf(S.topic)])}
if(n==='Welcome')$('backW').style.display=S.home?'':'none';if(n==='Home')S.home=1;
if(typeof scrollTo==='function')scrollTo(0,0)}
$('goLearn').onclick=()=>nav('Levels');
$('goBench').onclick=()=>{S.benchAll=1;S.boss=0;bench();nav('Bench')};
$('goSet').onclick=()=>nav('Welcome');
$('backL').onclick=()=>nav('Home');$('backT').onclick=()=>nav('Levels');$('backW').onclick=()=>nav('Home');
$('backQ').onclick=()=>{const w=S.screen==='Bench';S.benchAll=0;nav(w?'Home':(S.boss?'Levels':'Topics'))};
$('resetBtn').onclick=()=>{if(confirm('Reset progress? · Réinitialiser ? · Zurücksetzen?')){try{localStorage.removeItem('roasted')}catch(e){}showStreak();nav('Home')}};
function trackMis(q,ok){try{const d=load(),k=S.n+S.t,l=d.mis[k]||[];if(ok){if(l.includes(q.s)){d.mis[k]=l.filter(x=>x!==q.s);save(d)}}else{d.mis[k]=l.filter(x=>x!==q.s).concat(q.s).slice(-60);save(d)}}catch(e){}}
function note(k){if(S.noted)return;S.noted=1;const n=$('voiceNote');n.textContent=X[S.n][k];n.style.display='block';setTimeout(()=>{n.style.display='none'},5000)}
function loadScript(src){return new Promise((ok,no)=>{const e=document.createElement('script');e.src=src;e.onload=ok;e.onerror=()=>{toast(((X[S.n]||X[Object.keys(X)[0]]||{}).loaderr)||'⚠️ Connection error');no()};document.head.appendChild(e)})}
function loadData(n){const a=(window.RE&&RE[n])?Promise.resolve():loadScript('data/'+n+'.js'),b=T[n]?Promise.resolve():loadScript('data/ui-'+n+'.js').then(()=>{const o=UI[n];T[n]=o.T;X[n]=o.X;OPEN[n]=o.OPEN;TUNE[n]=o.TUNE;VP[n]=o.VP});return Promise.all([a,b])}
if(window.addEventListener){window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.ip=e;$('goInstall').style.display=''});window.addEventListener('appinstalled',()=>{$('goInstall').style.display='none'})}
$('goInstall').onclick=()=>{if(S.ip){S.ip.prompt();S.ip=null;$('goInstall').style.display='none'}};
if(/iphone|ipad|ipod/i.test(navigator.userAgent||'')&&!navigator.standalone)$('iosHint').style.display='block';
$('charImg').onerror=function(){this.onerror=null;this.src='images/banner.webp'};
if($('fixIn').addEventListener)$('fixIn').addEventListener('focus',()=>setTimeout(()=>{try{$('fixIn').scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}},300));
let sv=null;try{sv=localStorage.getItem('roasted_native')}catch(e){}
if(sv&&FLAG[sv]){S.n=sv;if(S.t===sv)S.t=Object.keys(FLAG).find(x=>x!==sv);loadData(S.n).then(()=>{texts();start();nav('Home')}).catch(()=>{})}else{menus();nav('Welcome')}

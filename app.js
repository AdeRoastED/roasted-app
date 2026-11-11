const $=id=>document.getElementById(id),pick=a=>a[Math.floor(Math.random()*a.length)];
const TOP=['food','travel','sports','culture','dailylife','greet','adj','basic','num','col','time'],SENT=TOP.slice(0,5),VOC=TOP.slice(5),FLAG={it:'Italiano',en:'English',fr:'Français',de:'Deutsch',th:'ไทย',af:'Afrikaans'};
const DISPLAY_ORDER=['num','col','greet','basic','time','adj','food','travel','sports','culture','dailylife'];
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
const box=$('topics');box.innerHTML='';DISPLAY_ORDER.forEach(k=>{const i=TOP.indexOf(k);const d=document.createElement('button');d.type='button';d.setAttribute('aria-pressed',k===S.topic);d.className='topic-pill'+(k===S.topic?' active':'');d.textContent=t.topics[i];d.onclick=()=>{stopTalk();S.topic=k;S.lvl=1;S.boss=0;texts();start()};box.appendChild(d)})}
function mapq(e){return Object.assign({s:e.s},e.t[S.t])}
function pool(){if(S.boss){let a=[];for(const tp of SENT)a=a.concat(RE[S.n][tp].filter(e=>e.t[S.t]).map(mapq));shuf(a);const ms=new Set(load().mis[S.n+S.t]||[]),m=a.filter(x=>ms.has(x.s)).slice(0,10);return m.concat(a.filter(x=>!m.includes(x)))}
const a=RE[S.n][S.topic].filter(e=>e.t[S.t]).map(mapq);return VOC.includes(S.topic)?a:a.sort((x,y)=>x.f.length-y.f.length)}
function start(){S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.wr=0;S.review=0;S.undoUsed=0;S.story=0;S.pool=pool();const x=X[S.n];S.qs=S.boss?S.pool.slice(0,20):S.lvl===3?shuf(S.pool.slice()).slice(0,10):S.pool.slice((S.lvl-1)*10,S.lvl*10);
$('drillT').textContent=S.boss?x.boss:u().topics[TOP.indexOf(S.topic)].replace(/^\S+\s/,'')+' · '+x.lvl+' '+S.lvl;renderLevels();showStreak();
if(!S.qs.length){mood();$('prog').textContent='';$('qbox').textContent=u().soon;$('opts').innerHTML='';$('fb').style.display='none';$('nextBtn').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('shareBtn').style.display=$('retryBtn').style.display='none';$('bq').textContent='';return}
$('benchSec').style.display='';renderWords();mood();show();bench()}
function show(){const t=u(),q=S.qs[S.i];$('prog').textContent=t.qn+' '+(S.i+1)+' / '+S.qs.length;if($('progFill'))$('progFill').style.width=Math.round((S.i)/Math.max(1,S.qs.length)*100)+'%';$('qbox').textContent=t.q.replace('{s}',q.s).replace('{L}',t.langs[S.t]);$('fb').style.display='none';$('nextBtn').style.display='none';$('undoBtn').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('shareBtn').style.display=$('retryBtn').style.display='none';
let ord=[0,1,2,3];if(!q.ns)for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
const g=$('opts');g.innerHTML='';ord.forEach((oi,k)=>{const b=document.createElement('button');b.className='option-btn';b.textContent=String.fromCharCode(65+k)+'. '+q.o[oi];b.onclick=()=>answer(oi,g,ord);g.appendChild(b)})}
function answer(oi,g,ord){const t=u(),q=S.qs[S.i],ok=oi===q.c,fb=$('fb');beep(ok?660:200);vibrate(ok?30:[20,40,20]);mood(ok?'happy':'angry');if(ok)S.sc++;else S.wrong.push(q);trackMis(q,ok);
[...g.children].forEach((b,k)=>{b.disabled=true;if(ord[k]===q.c)b.classList.add('correct');else if(ord[k]===oi)b.classList.add('incorrect')});
fb.style.display='block';fb.style.cssText+=ok?';background:#ECFDF3;border-color:#12B76A;color:#027A48':';background:#FDF3F2;border-color:#FECDCA;color:#B42318';
const trap=!ok&&q.literal_trap&&q.o[oi]===q.literal_trap&&q.roast_if_wrong;S.wr=ok?0:(S.wr||0)+1;const pity=!ok&&S.wr>=3;if(pity)S.wr=0;const msg=ok?pick(t.right):pity?X[S.n].pity:(trap?q.roast_if_wrong:(q.r?(Math.random()<.7?pick(OPEN[S.n]):'')+q.r:pick(t.wrong)));fb.innerHTML=ok?'<strong>🎉 '+t.ok+'</strong> '+msg:'<strong>'+(trap?'🪤 ':'🎩 ')+t.wh+'</strong> '+msg+'<br><em>'+t.cor+' '+(q.natural_version||q.f)+'</em>'+(q.native_context&&!ok?'<br><small>'+q.native_context+'</small>':'');talk(msg);
S.say=q.f;$('sayBtn').style.display=$('repBtn').style.display=$('scoreBtn').style.display='inline-block';$('nextBtn').textContent=t.next;$('nextBtn').style.display='block';$('nextBtn').onclick=()=>{S.i++;S.i>=S.qs.length?finish():show()};
if(!ok&&!S.undoUsed&&!S.boss){$('undoBtn').style.display='block';$('undoBtn').onclick=()=>{S.undoUsed=1;show()}}}
function finish(){if(S.story)return finishStory();const t=u(),x=X[S.n],n=S.qs.length,p=Math.round(S.sc/n*100),ti=t.tiers[p<40?0:p<70?1:p<90?2:3],st=p>=100?3:p>=80?2:p>=60?1:0,k=S.boss?S.n+S.t+'boss':S.n+S.t+S.topic+S.lvl,d=load(),td=day(0),yd=day(1);
if(!S.retry&&!S.review){if(d.st.last!==td)d.st={last:td,n:d.st.last===yd?(d.st.n||0)+1:1};if(st>(d.lv[k]||0))d.lv[k]=st;d.totalRuns=(d.totalRuns||0)+1;d.log=(d.log||[]).filter(x=>x!==td);d.log.push(td);d.log=d.log.slice(-90);save(d)}
if(!S.retry&&p>=100){earnBadge('perfect');confetti()}
if(!S.retry&&!S.review){const hn=!S.boss&&st>0&&S.lvl<3;if(hn)confetti()}
if($('progFill'))$('progFill').style.width='100%';
$('opts').innerHTML='';$('fb').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('scoreBtn').style.display=$('undoBtn').style.display='none';
const hasNext=!S.boss&&!S.retry&&!S.review&&st>0&&S.lvl<3;
$('qbox').innerHTML=S.retry?'<strong>🔁 '+x.retryL+': '+S.sc+' / '+n+'</strong><span class="tier">'+ti+'</span>':'<strong>📊 '+t.sc+': '+S.sc+' / '+n+' ('+p+'%) '+'⭐'.repeat(st)+'☆'.repeat(3-st)+'</strong><span class="tier">'+ti+'</span><span class="tier">'+(st>0?(hasNext?'🔓 '+x.unlocked:'🎉'):(!S.boss&&S.lvl<3?'🔒 '+x.lvlHint:''))+'</span>';
mood(p>=60?'happy':'angry');talk(ti);S.res=x.shareT.replace('{p}',p).replace('{r}',ti)+' '+location.href.split('#')[0];
$('shareBtn').style.display=S.retry?'none':'block';$('retryBtn').style.display=S.wrong.length?'block':'none';
const nb=$('nextBtn');nb.style.display='block';if(hasNext){nb.textContent=x.nextlvl;nb.onclick=()=>{S.lvl++;start()}}else{nb.textContent=t.again;nb.onclick=start}if(!S.review)renderLevels();showStreak();checkBadges()}
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
$('shareBtn').onclick=()=>{if(navigator.share)navigator.share({text:S.res}).then(markShared).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(S.res).then(()=>{alert('✔ Copied');markShared()})};
$('retryBtn').onclick=()=>{S.qs=S.wrong.slice();S.wrong=[];S.i=0;S.sc=0;S.retry=1;mood();show()};
$('muteBtn').onclick=()=>{S.mute=S.mute?0:1;$('muteBtn').textContent=S.mute?'🔇':'🎵'};
const L2={en:{review:'🎯 Review my mistakes',duel:'⚔️ Challenge a friend'},it:{review:'🎯 Rivedi i miei errori',duel:'⚔️ Sfida un amico'},fr:{review:'🎯 Revoir mes erreurs',duel:'⚔️ Défier un ami'},de:{review:'🎯 Meine Fehler wiederholen',duel:'⚔️ Freund herausfordern'},th:{review:'🎯 ทบทวนที่ผิด',duel:'⚔️ ท้าเพื่อน'},af:{review:'🎯 Gaan my foute weer deur',duel:"⚔️ Daag 'n vriend uit"}};
function labels(){const x=X[S.n];const l2=L2[S.n]||L2.en;if($('goReview'))$('goReview').textContent=l2.review;if($('goDuel'))$('goDuel').textContent=l2.duel;$('offTag').textContent=x.offline;$('goInstall').textContent='📲 '+x.install;$('iosHint').textContent=x.ios;$('goLearn').textContent='▶ '+x.learn;$('goBench').textContent='💀 '+u().fixT.replace(/^\S+\s/,'');$('goSet').textContent='⚙️ '+x.set;['backL','backT','backQ','backW','backSt','backTr'].forEach(i=>{$(i).textContent='← '+x.back});$('resetBtn').textContent='🗑️';$('sayBtn').textContent=x.listen;$('repBtn').textContent=x.report;$('shareBtn').textContent=x.share;$('retryBtn').textContent=x.retry}
const _t=texts;texts=function(){_t();labels()};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
S.voice=1;const TUNE={};
const VP={};let VOICES=[];
if(window.speechSynthesis){const lv=()=>{VOICES=speechSynthesis.getVoices()};lv();speechSynthesis.onvoiceschanged=lv}
const NAT=/natural|neural|online|premium|enhanced|wavenet|google/i;
function pickVoice(lang,g){const b=lang.slice(0,2).toLowerCase();let best=null,bs=-1;for(const v of VOICES){if(!v.lang||v.lang.slice(0,2).toLowerCase()!==b)continue;const n=v.name.toLowerCase();let sc=0;if(v.lang.replace('_','-').toLowerCase()===lang.toLowerCase())sc+=3;if(NAT.test(n))sc+=6;if(/google|microsoft|apple/.test(n))sc+=2;if(v.localService===false)sc+=1;
const fem=/\bfemale\b|woman|elsa|alice|amelie|amélie|marie|paola|federica|anna|petra|katja|hedda|susan|hazel|libby|sonia|jenny|aria|zira|samantha|karen|moira|tessa|emma|brigitte|denise|eloise|vivian|premwadee|kanya/.test(n),mal=/\bmale\b|\bman\b|diego|luca|cosimo|daniel|arthur|george|ryan|james|thomas|henri|claude|antoine|paul|guy|conrad|stefan|markus|hans|jonas|ralf|alex|fred|oliver|niwat/.test(n);
if(g==='f'&&fem)sc+=4;if(g==='m'&&mal&&!fem)sc+=4;if(sc>bs){bs=sc;best=v}}return best}
function speakLine(x,lang,tune,g){const parts=x.replace(/[«»“”„]/g,'').replace(/[,，]/g,' ').match(/[^.!?…]+[.!?…]*/g)||[x],v=pickVoice(lang,g),nat=v&&NAT.test(v.name);if(!v&&VOICES.length&&!VOICES.some(z=>z.lang&&z.lang.slice(0,2).toLowerCase()===lang.slice(0,2).toLowerCase())){note('novoice');return}speechSynthesis.cancel();
parts.forEach((p,i)=>{const m=new SpeechSynthesisUtterance(p.trim());m.lang=lang;if(v)m.voice=v;m.pitch=nat?1:tune[0]*(i%2?1.05:.97);m.rate=nat?1:Math.min(tune[1],.95);speechSynthesis.speak(m)})}
function talk(x){if(!S.voice||!window.speechSynthesis)return;try{speakLine(x,VOICE[S.n],TUNE[S.n],VP[S.n])}catch(e){}}
$('voiceBtn').onclick=()=>{S.voice=S.voice?0:1;$('voiceBtn').textContent=S.voice?'🗣️':'🤐';if(!S.voice&&window.speechSynthesis)speechSynthesis.cancel()};
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
function renderLevels(){const x=X[S.n],box=$('levels');box.innerHTML='';const n=Math.max(1,Math.ceil(RE[S.n][S.topic].filter(e=>e.t[S.t]).length/10));
for(let l=1;l<=n;l++){const open=l===1||stars(lk(l-1))>0,b=document.createElement('button');b.type='button';b.className='lvl'+(!S.boss&&S.lvl===l?' active':'');b.disabled=!open;b.textContent=(open?'':'🔒 ')+x.lvl+' '+l+' '+'⭐'.repeat(stars(lk(l)));b.onclick=()=>{stopTalk();S.boss=0;S.lvl=l;start()};box.appendChild(b)}
const bo=cleared()>=4,bb=document.createElement('button');bb.type='button';bb.className='lvl'+(S.boss?' active':'');bb.disabled=!bo;bb.textContent=(bo?'👑 ':'🔒 ')+x.boss+' '+'⭐'.repeat(stars(S.n+S.t+'boss'));bb.onclick=()=>{stopTalk();S.boss=1;start()};box.appendChild(bb);$('lvlHint').textContent=x.lvlHint}


function renderWords(){const box=$('wordList');box.innerHTML='';if(!VOC.includes(S.topic)||S.boss){box.style.display='none';return}box.style.display='grid';const h=document.createElement('h4');h.textContent='📖 '+X[S.n].studyW;box.appendChild(h);
RE[S.n][S.topic].forEach(e=>{const w=e.t[S.t];if(!w)return;const r=document.createElement('div');r.className='wrow';const a=document.createElement('span');a.textContent=e.s;const b=document.createElement('b');b.textContent=w.f;const k=document.createElement('button');k.type='button';k.textContent='🔊';k.setAttribute('aria-label',X[S.n].listen);k.onclick=()=>{if(window.speechSynthesis)speakLine(w.f,VOICE[S.t],[1,.85],'f');else note('novoice')};r.appendChild(a);r.appendChild(b);r.appendChild(k);box.appendChild(r)})}
const ICON={food:'🍕'};
const SCRS=['Welcome','Home','Levels','Topics','Quiz','Trophies','Story'];
const lstars=(tp,l)=>load().lv[S.n+S.t+tp+l]||0,tOpen=(tp,l)=>l===1||lstars(tp,l-1)>0;
function card(box,txt,sub,dis,fn){const b=document.createElement('button');b.type='button';b.className='card';b.disabled=!!dis;const a=document.createElement('span');a.textContent=txt;const c=document.createElement('small');c.textContent=sub;b.appendChild(a);b.appendChild(c);b.onclick=fn;box.appendChild(b)}
function renderLevelsMenu(){const x=X[S.n],box=$('lvCards'),nm=[x.ln1,x.ln2,x.ln3];box.innerHTML='';
for(let l=1;l<=3;l++){let st=0,op=l===1;TOP.forEach(tp=>{st+=lstars(tp,l);if(tOpen(tp,l))op=true});card(box,(op?'':'🔒 ')+x.lvl+' '+l+' · '+nm[l-1],'⭐ '+st+'/'+TOP.length*3,!op,()=>{S.lvl=l;nav('Topics')})}
const bo=cleared()>=4;card(box,(bo?'👑 ':'🔒 ')+x.boss,'⭐ '+stars(S.n+S.t+'boss')+'/3',!bo,()=>{S.boss=1;S.benchAll=0;start();nav('Quiz')})}
function renderTopicsMenu(){const x=X[S.n],t=u(),box=$('tpCards');box.innerHTML='';$('crumbT').textContent=x.lvl+' '+S.lvl+' · '+[x.ln1,x.ln2,x.ln3][S.lvl-1];
DISPLAY_ORDER.forEach(tp=>{const i=TOP.indexOf(tp),op=tOpen(tp,S.lvl),n=lstars(tp,S.lvl);card(box,(op?'':'🔒 ')+t.topics[i],'⭐'.repeat(n)+'☆'.repeat(3-n),!op,()=>{S.topic=tp;S.boss=0;S.benchAll=0;start();nav('Quiz')})})}
function nav(n){stopTalk();S.screen=n;const sc=n==='Bench'?'Quiz':n;SCRS.forEach(k=>{$('scr'+k).style.display=k===sc?'':'none'});
$('drillSec').style.display=n==='Bench'?'none':'';if(n==='Bench')$('wordList').style.display='none';
if(n==='Levels')renderLevelsMenu();if(n==='Topics')renderTopicsMenu();if(n==='Trophies')renderTrophies();if(n==='Story')renderStoryMenu();
if(n==='Quiz')acquireWake();else releaseWake();
if(n==='Quiz'||n==='Bench'){const x=X[S.n];$('crumbQ').textContent=n==='Bench'?'💀':(S.story?'📖':(S.boss?x.boss:x.lvl+' '+S.lvl+' · '+u().topics[TOP.indexOf(S.topic)]))}
if(n==='Welcome')$('backW').style.display=S.home?'':'none';if(n==='Home')S.home=1;
if(typeof scrollTo==='function')scrollTo(0,0)}
$('goLearn').onclick=()=>nav('Levels');
$('goTrophies').onclick=()=>nav('Trophies');
$('backTr').onclick=()=>nav('Home');
$('badgeRow').onclick=()=>nav('Trophies');
$('goBench').onclick=()=>{S.benchAll=1;S.boss=0;bench();nav('Bench')};
$('goSet').onclick=()=>nav('Welcome');
$('backL').onclick=()=>nav('Home');$('backT').onclick=()=>nav('Levels');$('backW').onclick=()=>nav('Home');
$('backQ').onclick=()=>{const w=S.screen==='Bench';S.benchAll=0;nav(w?'Home':(S.story?'Story':(S.boss?'Levels':'Topics')))};
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
/* --- voice input (speech-to-text) for the Torture Bench --- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let recog=null;
if($('micBtn'))$('micBtn').onclick=()=>{
if(!SR){toast('🎤 Voice input not supported in this browser');return}
if(recog){try{recog.stop()}catch(e){}return}
try{recog=new SR();recog.lang=VOICE[S.t]||'en-US';recog.interimResults=false;recog.maxAlternatives=1;
$('micBtn').classList.add('listening');$('micBtn').textContent='🔴';
recog.onresult=e=>{$('fixIn').value=e.results[0][0].transcript};
recog.onerror=()=>{};
recog.onend=()=>{recog=null;$('micBtn').classList.remove('listening');$('micBtn').textContent='🎤'};
recog.start()}catch(e){recog=null;$('micBtn').classList.remove('listening');$('micBtn').textContent='🎤'}};

/* --- review my mistakes --- */
if($('goReview'))$('goReview').onclick=()=>{
const d=load(),ms=new Set(d.mis[S.n+S.t]||[]);let a=[];
for(const tp of SENT)a=a.concat((RE[S.n][tp]||[]).filter(e=>e.t[S.t]&&ms.has(e.s)).map(mapq));
S.boss=0;S.review=1;S.benchAll=0;S.pool=a;S.qs=shuf(a.slice()).slice(0,20);S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.wr=0;
nav('Quiz');$('drillT').textContent='🎯 Review My Mistakes';$('prog').textContent='';$('benchSec').style.display='none';$('wordList').style.display='none';
if(S.qs.length)show();else{$('qbox').textContent="No mistakes saved yet — that's good! Keep playing and I'll track what trips you up.";$('opts').innerHTML='';$('fb').style.display='none';$('nextBtn').style.display='none'}};

/* --- challenge a friend (duel) --- */
function duelPayload(){const d=load(),ms=d.mis[S.n+S.t]||[];if(!ms.length)return null;const items=[];
for(const tp of SENT){(RE[S.n][tp]||[]).forEach((e,i)=>{if(ms.includes(e.s)&&e.t[S.t])items.push([tp,i])})}
return items.length?{n:S.n,t:S.t,items:items.slice(0,15)}:null}
if($('goDuel'))$('goDuel').onclick=()=>{const p=duelPayload();
if(!p){alert('No mistakes saved yet to challenge with — get a few wrong first!');return}
const enc=btoa(encodeURIComponent(JSON.stringify(p))),url=location.href.split('#')[0]+'#duel='+enc,text='⚔️ Think you can survive my worst mistakes? '+url;
if(navigator.share)navigator.share({text}).then(markShared).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(text).then(()=>{alert('✔ Copied — send it to a friend!');markShared()});else alert(text)};
function parseDuel(){try{if(!location.hash.indexOf)return null;if(location.hash.slice(0,6)!=='#duel=')return null;return JSON.parse(decodeURIComponent(atob(location.hash.slice(6))))}catch(e){return null}}
function startDuel(p){S.n=p.n;S.t=p.t;loadData(S.n).then(()=>{texts();S.boss=0;S.review=1;S.benchAll=0;S.topic=(p.items&&p.items[0]?p.items[0][0]:'food');
S.qs=(p.items||[]).map(it=>{const e=RE[S.n]&&RE[S.n][it[0]]&&RE[S.n][it[0]][it[1]];return e?mapq(e):null}).filter(Boolean);
S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.wr=0;
nav('Home');$('drillT').textContent="⚔️ Friend's Challenge";$('benchSec').style.display='none';$('wordList').style.display='none';
if(S.qs.length)show();else{$('qbox').textContent='This challenge link looks empty.';$('opts').innerHTML=''}
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
const BADGE_META={streak3:['🔥3','3-day streak'],streak7:['🔥7','7-day streak'],streak30:['🔥30','30-day streak'],boss:['👑','Boss cleared'],alltopics:['🏆','All topics cleared'],perfect:['💯','Perfect score'],sharer:['📣','Shared the app']};
function tierOf(n){return n>=150?['🥇','Gold learner']:n>=50?['🥈','Silver learner']:n>=10?['🥉','Bronze learner']:['🌱','Just starting']}
function renderTrophies(){const d=load(),have=new Set(d.badges||[]);const box=$('trophyGrid');box.innerHTML='';
Object.keys(BADGE_META).forEach(id=>{const[icon,name]=BADGE_META[id],got=have.has(id),el=document.createElement('div');el.className='trophy'+(got?'':' locked');el.innerHTML='<span class="t-icon">'+icon+'</span><span class="t-name">'+name+'</span>';box.appendChild(el)});
const tr=tierOf(d.totalRuns||0);$('tierLabel').textContent=tr[0]+' '+tr[1]+' · '+(d.totalRuns||0)+' quizzes completed';
renderHeatmap(d.log||[])}
function renderHeatmap(log){const box=$('heatmap');if(!box)return;box.innerHTML='';const set=new Set(log);
for(let i=34;i>=0;i--){const dte=day(i),cell=document.createElement('div');cell.className='hcell'+(set.has(dte)?' active':'')+(i===0?' today':'');cell.title=dte;box.appendChild(cell)}}

/* --- pronunciation score (reuses speech recognition) --- */
if($('scoreBtn'))$('scoreBtn').onclick=()=>{if(!SR){toast('🎙️ Voice scoring not supported in this browser');return}
if(!S.say)return;$('scoreBtn').classList.add('listening');$('scoreBtn').textContent='🔴 listening…';
try{const r=new SR();r.lang=VOICE[S.t]||'en-US';r.interimResults=false;r.maxAlternatives=1;
r.onresult=e=>{const heard=e.results[0][0].transcript,a=norm(heard),c=norm(S.say),dist=lev(a,c),pct=Math.max(0,Math.round(100*(1-dist/Math.max(c.length,1))));toast('🎙️ '+pct+'% match: “'+heard+'”')};
r.onerror=()=>{toast('🎙️ Could not hear that, try again')};
r.onend=()=>{$('scoreBtn').classList.remove('listening');$('scoreBtn').textContent='🎙️ Score my pronunciation'};
r.start()}catch(e){$('scoreBtn').classList.remove('listening');$('scoreBtn').textContent='🎙️ Score my pronunciation'}};

/* --- what's new (shown once per version, returning users only) --- */
const APP_VERSION='1.2';
const WHATS_NEW=['🇿🇦 New Afrikaans tutor avatar','🔢 Full 0–100 numbers added to the vocabulary set','📖 New Story mode — walk through a little scene topic by topic','🎙️ Score your pronunciation with your voice','🏆 New trophy room with a practice calendar','↩️ One free "undo" per quiz','📳 Haptic feedback + screen stays awake during quizzes'];
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
function startStory(tp){stopTalk();S.boss=0;S.review=0;S.retry=0;S.benchAll=0;S.story=1;S.topic=tp;S.undoUsed=0;
const a=(RE[S.n][tp]||[]).filter(e=>e.t[S.t]).map(mapq);
S.pool=a;S.qs=a.slice();S.i=0;S.sc=0;S.wrong=[];S.wr=0;
nav('Quiz');
$('drillT').textContent='📖 '+(u().topics[TOP.indexOf(tp)]||tp).replace(/^\S+\s/,'');
$('benchSec').style.display='none';$('wordList').style.display='none';
if($('progFill'))$('progFill').style.width='0%';
toast((STORY_INTRO[S.n]&&STORY_INTRO[S.n][tp])||STORY_INTRO.en[tp],8000);
if(S.qs.length)show();else{$('qbox').textContent='Nothing here yet.';$('opts').innerHTML=''}}
function finishStory(){const t=u(),n=S.qs.length,p=Math.round(S.sc/Math.max(1,n)*100);
$('opts').innerHTML='';$('fb').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('scoreBtn').style.display=$('undoBtn').style.display='none';
$('qbox').innerHTML='<strong>'+(STORY_OUTRO[S.n]||STORY_OUTRO.en)+'</strong><br>📊 '+S.sc+' / '+n+' ('+p+'%)';
if(p>=100)confetti();
S.res=((X[S.n]&&X[S.n].shareT)||'').replace('{p}',p).replace('{r}','Story mode')+' '+location.href.split('#')[0];
$('shareBtn').style.display='block';$('retryBtn').style.display=S.wrong.length?'block':'none';
const nb=$('nextBtn');nb.style.display='block';nb.textContent=t.again;nb.onclick=()=>nav('Home');
if($('progFill'))$('progFill').style.width='100%'}
$('goStory').onclick=()=>nav('Story');
$('backSt').onclick=()=>nav('Home');

/* --- one-time onboarding --- */
function showOnboarding(cb){let seen=null;try{seen=localStorage.getItem('roasted_onb')}catch(e){}
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
showOnboarding(()=>{
if(sv&&FLAG[sv]){S.n=sv;if(S.t===sv)S.t=Object.keys(FLAG).find(x=>x!==sv);loadData(S.n).then(()=>{texts();start();nav('Home');showWhatsNew()}).catch(()=>{})}else{menus();nav('Welcome');showWhatsNew()}
})}

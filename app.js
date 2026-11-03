const $=id=>document.getElementById(id),pick=a=>a[Math.floor(Math.random()*a.length)];
const TOP=['food','travel','sports','culture','dailylife'],FLAG={it:'🇮🇹 Italiano',en:'🇬🇧 English',fr:'🇫🇷 Français',de:'🇩🇪 Deutsch'};
const S={n:'it',t:'en',topic:'food',i:0,sc:0,qs:[],bq:null,mute:0,wrong:[],say:'',retry:0,res:''};
const T={
it:{img:'it',cap:'Nonna Rosa: «Se sbagli, la cucchiarola è pronta, tesoro!»',h:'Grammatica che resta, perché pizzica.',nat:'La tua lingua madre:',tgt:'Lingua che vuoi imparare:',sub:'Ogni errore farà infuriare il tutor!',topics:['🍕 Cibo','✈️ Viaggi','⚽ Sport','🎭 Cultura','🏠 Vita quotidiana'],q:'Come si dice «{s}» in {L}?',langs:{en:'inglese',fr:'francese',de:'tedesco',it:'italiano'},qn:'Domanda',next:'Prossima ➔',ok:'Corretto!',wh:'Correzione gentile:',cor:'Corretta:',fixT:'💀 Il Banco di Tortura',fixD:'Correggi la frase sbagliata. Il tutor giudicherà con eleganza.',fixPh:'Scrivi qui la frase corretta...',fixBtn:'Verifica',newS:'Un\'altra frase',sc:'Punteggio',again:'Rigioca',
right:['Bravo! Non montarti la testa, però.','Esatto. Ti do un cucchiaio di pasta in più.'],
wrong:['Tesoro mio, un tentativo adorabile… e sbagliatissimo. Rivediamolo insieme, con la cucchiarola in mano.','Eh no, caro. Anche mia nipote di tre anni lo sapeva. Con affetto, eh.','Sbagliato, ma ti voglio bene. Prendi appunti, la lezione è gratis.'],
tiers:['Sotto il 40%… vieni in cucina a ripassare, ti preparo un brodo e una ramanzina.','Mediocre, tesoro. La pasta è scotta, ma c\'è speranza.','Niente male! Quasi quasi ti do un altro piatto di lasagne.','Perfetto! Mi commuovo… ma non dirlo in giro.']},
en:{img:'en',cap:'Lord Sterling: “Dreadful grammar, absolutely dreadful.”',h:'Grammar that sticks because it stings.',nat:'Your native language:',tgt:'Language you want to learn:',sub:'Every mistake will make the tutor furious!',topics:['🍕 Food','✈️ Travel','⚽ Sports','🎭 Culture','🏠 Daily Life'],q:'How do you say “{s}” in {L}?',langs:{en:'English',fr:'French',de:'German',it:'Italian'},qn:'Question',next:'Next ➔',ok:'Correct!',wh:'Polite correction:',cor:'Correct:',fixT:'💀 The Torture Bench',fixD:'Fix the faulty sentence. The tutor will judge, politely.',fixPh:'Type the corrected sentence...',fixBtn:'Check',newS:'Another sentence',sc:'Score',again:'Play again',
right:['Splendid. Do try not to let it go to your head.','Quite correct. I shall pretend I am not impressed.'],
wrong:['Oh dear. A noble attempt, and a spectacular miss. Do allow me to guide you.','I say, my dear fellow, even my butler would blush at that one.','Incorrect, I am afraid. Do take notes; the tuition is complimentary.'],
tiers:['Under 40%. Dear me. Might I suggest a lie-down and a grammar book?','A respectable disaster. There is hope, but only just.','Rather good! I may even permit a biscuit.','Magnificent. Smashing. I shall tell the club about you.']},
fr:{img:'fr',cap:'Jean-Luc : « Votre grammaire manque de raffinement. »',h:'Une grammaire qui reste, parce qu\'elle pique.',nat:'Votre langue maternelle :',tgt:'Langue que vous voulez apprendre :',sub:'Chaque erreur mettra le tuteur en colère !',topics:['🍕 Nourriture','✈️ Voyage','⚽ Sports','🎭 Culture','🏠 Vie quotidienne'],q:'Comment dit-on « {s} » en {L} ?',langs:{en:'anglais',fr:'français',de:'allemand',it:'italien'},qn:'Question',next:'Suivante ➔',ok:'Correct !',wh:'Correction polie :',cor:'Correct :',fixT:'💀 Le Banc de Torture',fixD:'Corrigez la phrase fautive. Le tuteur jugera, avec panache.',fixPh:'Écrivez la phrase corrigée...',fixBtn:'Vérifier',newS:'Une autre phrase',sc:'Score',again:'Rejouer',
right:['Correct. Ne vous croyez pas pour autant à Paris.','Bien. Je ne dirai pas que je suis impressionné.'],
wrong:['Mon cher, quelle audace… et quelle erreur. Laissez-moi vous guider.','Non, non, non. Même ma baguette connaît cette règle.','Faux, hélas. Prenez des notes, la leçon est offerte.'],
tiers:['Moins de 40 %. Un désastre. Allez relire quelques pages, avec un café.','Passable, comme un croissant d\'hier. Il y a de l\'espoir.','Pas mal du tout ! Je vous offrirais presque une baguette.','Magnifique ! C\'est presque… du français.']},
de:{img:'de',cap:'Hans: „Präzision, bitte! Keine Fehler erlaubt.“',h:'Grammatik, die bleibt, weil sie wehtut.',nat:'Deine Muttersprache:',tgt:'Sprache, die du lernen willst:',sub:'Jeder Fehler macht den Tutor wütend!',topics:['🍕 Essen','✈️ Reisen','⚽ Sport','🎭 Kultur','🏠 Alltag'],q:'Wie sagt man „{s}“ auf {L}?',langs:{en:'Englisch',fr:'Französisch',de:'Deutsch',it:'Italienisch'},qn:'Frage',next:'Weiter ➔',ok:'Richtig!',wh:'Höfliche Korrektur:',cor:'Richtig:',fixT:'💀 Die Folterbank',fixD:'Korrigiere den fehlerhaften Satz. Der Tutor urteilt höflich.',fixPh:'Schreibe den korrigierten Satz...',fixBtn:'Prüfen',newS:'Noch ein Satz',sc:'Punkte',again:'Nochmal',
right:['Richtig. Werden Sie bloß nicht überheblich.','Korrekt. Ich bin nicht beeindruckt. Fast nicht.'],
wrong:['Mein Lieber, ein mutiger Versuch, aber leider falsch. Ich zeige es Ihnen gern.','Falsch. Selbst mein Bierkrug kennt diese Regel.','Leider nein. Notieren Sie es sich, die Lektion ist kostenlos.'],
tiers:['Unter 40 %. Ungenügend. Setzen Sie sich und wiederholen Sie alles.','Mittelmäßig. Mit Disziplin wird das noch.','Gar nicht schlecht! Dafür gibt es eine Brezel.','Hervorragend! Ich bin… fast gerührt.']}};
const u=()=>T[S.n];
function beep(f){if(S.mute)return;try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.15)}catch(e){}}
function mood(m){const c=$('imageCard');c.classList.remove('angry','happy');if(m){void c.offsetWidth;c.classList.add(m)}}
function btns(id,codes,cur,fn){const box=$(id);box.innerHTML='';codes.forEach(c=>{const b=document.createElement('button');b.className='lang-choice-btn'+(c===cur?' active':'');b.textContent=FLAG[c];b.onclick=()=>fn(c);box.appendChild(b)})}
function menus(){btns('natOpts',Object.keys(FLAG),S.n,c=>{S.n=c;if(S.t===c)S.t=Object.keys(FLAG).find(x=>x!==c);texts();start()});btns('tgtOpts',Object.keys(FLAG).filter(c=>c!==S.n),S.t,c=>{S.t=c;menus();start()})}
function texts(){const t=u();menus();$('natLbl').textContent=t.nat;$('tgtLbl').textContent=t.tgt;$('headline').textContent=t.h;$('sub').textContent=t.sub;$('charImg').src='images/'+t.img+'.webp';$('caption').textContent=t.cap;$('fixT').textContent=t.fixT;$('fixD').textContent=t.fixD;$('fixIn').placeholder=t.fixPh;$('fixBtn').textContent=t.fixBtn;$('newBtn').textContent=t.newS;
const box=$('topics');box.innerHTML='';TOP.forEach((k,i)=>{const d=document.createElement('div');d.className='topic-pill'+(k===S.topic?' active':'');d.textContent=t.topics[i];d.onclick=()=>{S.topic=k;texts();start()};box.appendChild(d)})}
function start(){S.i=0;S.sc=0;S.wrong=[];S.retry=0;S.qs=RE[S.n][S.topic].map(e=>Object.assign({s:e.s},e.t[S.t]));$('drillT').textContent=u().topics[TOP.indexOf(S.topic)].replace(/^\S+\s/,'');mood();show();bench()}
function show(){const t=u(),q=S.qs[S.i];$('prog').textContent=t.qn+' '+(S.i+1)+' / '+S.qs.length;$('qbox').textContent=t.q.replace('{s}',q.s).replace('{L}',t.langs[S.t]);$('fb').style.display='none';$('nextBtn').style.display='none';$('sayBtn').style.display=$('repBtn').style.display=$('shareBtn').style.display=$('retryBtn').style.display='none';
let ord=[0,1,2,3];if(!q.ns)for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
const g=$('opts');g.innerHTML='';ord.forEach((oi,k)=>{const b=document.createElement('button');b.className='option-btn';b.textContent=String.fromCharCode(65+k)+'. '+q.o[oi];b.onclick=()=>answer(oi,g,ord);g.appendChild(b)})}
function answer(oi,g,ord){const t=u(),q=S.qs[S.i],ok=oi===q.c,fb=$('fb');beep(ok?660:200);mood(ok?'happy':'angry');if(ok)S.sc++;else S.wrong.push(q);
[...g.children].forEach((b,k)=>{b.disabled=true;if(ord[k]===q.c)b.classList.add('correct');else if(ord[k]===oi)b.classList.add('incorrect')});
fb.style.display='block';fb.style.cssText+=ok?';background:#ECFDF3;border-color:#12B76A;color:#027A48':';background:#FDF3F2;border-color:#FECDCA;color:#B42318';
fb.innerHTML=ok?'<strong>🎉 '+t.ok+'</strong> '+pick(t.right):'<strong>🎩 '+t.wh+'</strong> '+(q.r||pick(t.wrong))+'<br><em>'+t.cor+' '+q.f+'</em>';
S.say=q.f;$('sayBtn').style.display=$('repBtn').style.display='inline-block';$('nextBtn').textContent=t.next;$('nextBtn').style.display='block';$('nextBtn').onclick=()=>{S.i++;S.i>=S.qs.length?finish():show()}}
function finish(){const t=u(),x=X[S.n],p=Math.round(S.sc/S.qs.length*100),ti=t.tiers[p<40?0:p<70?1:p<90?2:3],k=S.n+S.t+S.topic,d=load(),td=new Date().toISOString().slice(0,10),yd=new Date(Date.now()-864e5).toISOString().slice(0,10);let b=Math.max(d.best[k]||0,p);
if(!S.retry){if(d.st.last!==td)d.st={last:td,n:d.st.last===yd?(d.st.n||0)+1:1};d.best[k]=b;save(d)}else b=d.best[k]||p;
$('opts').innerHTML='';$('fb').style.display='none';$('sayBtn').style.display=$('repBtn').style.display='none';
$('qbox').innerHTML='<strong>📊 '+t.sc+': '+S.sc+' / '+S.qs.length+' ('+p+'%)</strong><span class="tier">'+ti+'</span><span class="tier">🏆 '+x.best+': '+b+'% · 🔥 '+x.streak+': '+(d.st.n||1)+'</span>';
mood(p>=60?'happy':'angry');S.res=x.shareT.replace('{p}',p).replace('{r}',ti)+' '+location.href.split('#')[0];
$('shareBtn').style.display='block';$('retryBtn').style.display=S.wrong.length?'block':'none';
$('nextBtn').textContent=t.again;$('nextBtn').style.display='block';$('nextBtn').onclick=start}
const norm=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:«»"“”„]/g,'').replace(/\s+/g,' ').trim();
function bench(){const pl=S.qs.filter(x=>!x.ns),q=pick(pl.length?pl:S.qs),w=q.o.filter((_,i)=>i!==q.c);S.bq={bad:pick(w),f:q.f};$('bq').textContent=S.bq.bad;$('fixIn').value='';$('fixOut').style.display='none'}
$('fixBtn').onclick=()=>{const t=u(),v=$('fixIn').value.trim(),o=$('fixOut');if(!v)return;const ok=norm(v)===norm(S.bq.f);beep(ok?660:200);mood(ok?'happy':'angry');o.style.display='block';o.innerHTML=ok?'<strong>🎉 '+t.ok+'</strong> '+pick(t.right):'<strong>🔥 '+t.wh+'</strong> '+pick(t.wrong)+'<div class="custom-correction">✨ '+t.cor+' '+S.bq.f+'</div>'};
$('newBtn').onclick=bench;
const load=()=>{try{const d=JSON.parse(localStorage.getItem('roasted')||'{}');return{best:d.best||{},st:d.st||{}}}catch(e){return{best:{},st:{}}}};
const save=d=>{try{localStorage.setItem('roasted',JSON.stringify(d))}catch(e){}};
const X={it:{best:'Record',streak:'Serie',shareT:'🎩 RoastED mi ha stroncato: {p}%! «{r}»',share:'📤 Condividi',retry:'🔁 Riprova gli errori',listen:'🔊 Ascolta',report:'⚠️ Segnala'},
en:{best:'Best',streak:'Streak',shareT:'🎩 RoastED roasted me: {p}%! “{r}”',share:'📤 Share',retry:'🔁 Retry my mistakes',listen:'🔊 Listen',report:'⚠️ Report'},
fr:{best:'Record',streak:'Série',shareT:'🎩 RoastED m’a rôti : {p} % ! « {r} »',share:'📤 Partager',retry:'🔁 Réessayer mes erreurs',listen:'🔊 Écouter',report:'⚠️ Signaler'},
de:{best:'Rekord',streak:'Serie',shareT:'🎩 RoastED hat mich gegrillt: {p} %! „{r}“',share:'📤 Teilen',retry:'🔁 Fehler wiederholen',listen:'🔊 Anhören',report:'⚠️ Melden'}};
const VOICE={en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT'};
$('sayBtn').onclick=()=>{if(!S.say||!window.speechSynthesis)return;speechSynthesis.cancel();const m=new SpeechSynthesisUtterance(S.say);m.lang=VOICE[S.t];speechSynthesis.speak(m)};
$('repBtn').onclick=()=>{const q=S.qs[S.i];window.open('https://github.com/AdeRoastED/roasted-app/issues/new?title='+encodeURIComponent('Wrong answer? '+S.n+'>'+S.t+' '+S.topic)+'&body='+encodeURIComponent('Question: '+q.s+'\nMarked correct: '+q.f+'\nWhat is wrong:'),'_blank')};
$('shareBtn').onclick=()=>{if(navigator.share)navigator.share({text:S.res}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(S.res).then(()=>alert('✔ Copied'))};
$('retryBtn').onclick=()=>{S.qs=S.wrong.slice();S.wrong=[];S.i=0;S.sc=0;S.retry=1;mood();show()};
$('muteBtn').onclick=()=>{S.mute=S.mute?0:1;$('muteBtn').textContent=S.mute?'🔇':'🔊'};
function labels(){const x=X[S.n];$('sayBtn').textContent=x.listen;$('repBtn').textContent=x.report;$('shareBtn').textContent=x.share;$('retryBtn').textContent=x.retry}
const _t=texts;texts=function(){_t();labels()};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
texts();start();

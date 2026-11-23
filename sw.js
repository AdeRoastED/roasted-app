const C='roasted-v33',FONTS="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap",PRE=["./", "index.html", "style.css", "app.js", "manifest.json", "images/banner.webp", "images/it.webp", "images/en.webp", "images/fr.webp", "images/de.webp", "images/th.webp", "images/af.webp", "images/icon-192.png", "images/icons/back.png", "images/icons/mic.png", "images/icons/sound.png", "images/icons/listen.png", "images/icons/report.png", "images/icons/reset.png", "images/icons/retry.png", "images/icons/share.png", "images/icons/voice.png", "images/icons/next.png", "data/it.js", "data/en.js", "data/fr.js", "data/de.js", "data/th.js", "data/af.js", "data/ui-it.js", "data/ui-en.js", "data/ui-fr.js", "data/ui-de.js", "data/ui-th.js", "data/ui-af.js", "data/words.js", "data/scenes.js"];
const FONT_HOSTS=['fonts.googleapis.com','fonts.gstatic.com'];
/* install: every app file must be cached, or this version doesn't install (the old one keeps working and the browser retries later). The font is optional. */
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(PRE).then(()=>fetch(FONTS,{mode:'no-cors'}).then(r=>c.put(FONTS,r)).catch(()=>0))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
function offlineReply(req){return caches.match(req,{ignoreSearch:true}).then(m=>m||(req.mode==='navigate'?caches.match('index.html').then(h=>h||new Response('<h1>Offline</h1>',{status:503,headers:{'Content-Type':'text/html'}})):new Response('',{status:503,statusText:'Offline'})))}
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;let url;try{url=new URL(req.url)}catch(_){return}
const same=url.origin===self.location.origin,font=FONT_HOSTS.includes(url.hostname);if(!same&&!font)return;
e.respondWith(fetch(req).then(r=>{
 if(same?r.ok:(r.ok||r.type==='opaque')){const c=r.clone();caches.open(C).then(k=>k.put(req,c)).catch(()=>0);return r}
 /* error from the server: never cache it; if we have a good copy, use that */
 return caches.match(req,{ignoreSearch:true}).then(m=>m||r)
}).catch(()=>offlineReply(req)))});

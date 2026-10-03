/* Fênix | Personal — service worker v1.3
   A cada nova versão do app, mude o número em CACHE (ex.: v1.3) para o aparelho baixar os arquivos novos. */
const CACHE='fenix-personal-v1.3';
const ARQUIVOS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('fenix-personal-')&&k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith(
    caches.match(req,{ignoreSearch:true}).then(c=>c||fetch(req).then(r=>{
      if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(x=>x.put(req,cp))}
      return r;
    }).catch(()=>req.mode==='navigate'?caches.match('./index.html'):Response.error()))
  );
});

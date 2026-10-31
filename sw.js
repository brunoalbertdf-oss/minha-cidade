// Guarda os arquivos do jogo no aparelho para ele abrir mesmo sem internet.
// Abre do que está guardado e, em segundo plano, busca a versão nova para a próxima vez.
const CACHE = 'minha-cidade-v2';
const ARQUIVOS = [
  './', 'index.html', 'style.css', 'novidades.css', 'familias.css', 'manifest.webmanifest',
  'js/dados.js', 'js/arte.js', 'js/pessoas.js', 'js/perfil.js', 'js/jogo.js',
  'icones/icone-192.png', 'icones/icone-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(nomes => Promise.all(nomes.filter(n => n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const guardado = await cache.match(e.request, { ignoreSearch: true });
    const daRede = fetch(e.request).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => guardado);
    return guardado || daRede;
  }));
});

/* ConjuguonsEco : service worker.
   Changer V à chaque mise en ligne pour que les appareils se mettent à jour. */
const V = 'conjuguonseco-v20';

/* Indispensable : si l'un de ces fichiers manque,
   l'installation échoue et l'ancienne version reste active. */
const CORE = [
  './',
  'index.html',
  'data.js',
  'js/donnees.js',
  'js/base.js',
  'js/interface.js',
  'js/services.js',
  'js/navigation.js',
  'js/ecrans.js',
  'js/jeu.js',
  'js/minijeux.js',
  'js/profil.js',
  'manifest.webmanifest'
];

/* Utile mais non bloquant : un fichier absent est simplement ignoré. */
const MORE = [
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-192.png',
  'icon-maskable-512.png',
  'apropos.html',
  'politique-confidentialite.html',
  'img/logo.png',
  'img/tinet.png',
  'img/tinet-ok.png',
  'img/tinet-cheer.png',
  'img/banniere.jpg',
  'img/titre-fond.webp',
  'img/enseigne.webp',
  'img/tinet-tete.webp',
  'img/qr.png',
  'img/deco/banane.webp',
  'img/deco/coco.webp',
  'img/deco/herbe.webp',
  'apple-touch-icon.png',
  'img/logo-afj.jpg',
  'img/logo-oif.jpg',
  'img/deco/hills.webp',
  'img/deco/ground.webp',
  'img/deco/cloud1.webp',
  'img/deco/cloud2.webp',
  'img/deco/cloud3.webp',
  'img/deco/palm.webp',
  'img/deco/foliage.webp',
  'img/deco/bush1.webp',
  'img/deco/bush2.webp'
];

/* INSTALLATION */
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(V);
    // Les fichiers critiques doivent réussir, sinon l'installation échoue.
    await cache.addAll(CORE);
    // Les fichiers secondaires sont tentés, mais un échec n'est pas bloquant.
    await Promise.allSettled(MORE.map(url => cache.add(url)));
    await self.skipWaiting();
  })());
});

/* ACTIVATION */
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // Supprime tous les anciens caches (versions précédentes).
    for (const key of await caches.keys()) {
      if (key !== V) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

/* Réponse partielle (HTTP 206) pour les requêtes Range.
   Nécessaire pour que l'audio et la vidéo se lisent depuis le cache. */
async function slice(req, res) {
  const blob = await res.blob();
  const size = blob.size;
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range'));
  if (!m) return res;

  let start, end;
  if (m[1] === '') {
    // Suffixe : "bytes=-500" = les 500 derniers octets.
    start = Math.max(0, size - Number(m[2]));
    end = size;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size : Math.min(size, Number(m[2]) + 1);
  }

  if (start >= size || start >= end) {
    return new Response('', {
      status: 416,
      headers: { 'Content-Range': 'bytes */' + size }
    });
  }

  return new Response(blob.slice(start, end), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end - 1}/${size}`,
      'Content-Length': String(end - start)
    }
  });
}

/* Gestion d'une requête : cache d'abord, réseau ensuite, fallback hors-ligne. */
async function handle(req) {
  const cache = await caches.open(V);
  const ranged = req.headers.has('range');

  // 1) Cherche dans le cache.
  const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
  if (hit) {
    return ranged ? slice(req, hit) : hit;
  }

  // 2) Sinon, va sur le réseau et met en cache si possible.
  try {
    const net = await fetch(req);
    if (net.status === 200 && net.type === 'basic' && !ranged) {
      cache.put(req, net.clone());
    }
    return net;
  } catch (_) {
    // 3) Hors-ligne : fallback pour la navigation.
    if (req.mode === 'navigate') {
      const index = await cache.match('index.html', { ignoreSearch: true });
      if (index) return index;
    }
    return new Response('', { status: 504, statusText: 'Hors-ligne' });
  }
}

/* Point d'entrée : intercepte les GET de même origine uniquement. */
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // Ignore : méthodes non-GET et requêtes cross-origin.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  e.respondWith(handle(req));
});

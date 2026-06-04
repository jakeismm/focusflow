/* ───────────────────────────────────────────────────────────────────────
   FocusFlow service worker
   Strategy:
     • HTML / navigations → NETWORK-FIRST (so a fresh deploy is always picked
       up immediately when you're online; falls back to last-cached HTML when
       offline so the PWA still launches without a connection).
     • All other GETs (CDN scripts, images, audio, etc.) → CACHE-FIRST.
   On activate the SW skips waiting and claims clients, so a new version is
   applied to open tabs without manual refresh. Browsers will fetch this file
   fresh on every load because the HTML registers with updateViaCache:'none'.
   Bump VERSION whenever you want to discard the old caches.
   ─────────────────────────────────────────────────────────────────────── */
const VERSION = 'ff-2026-06-04-01';
const HTML_CACHE  = 'ff-html-'  + VERSION;
const ASSET_CACHE = 'ff-assets-' + VERSION;

self.addEventListener('install', () => {
  // Don't wait for the old SW — install the new one immediately.
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // Drop any caches from previous VERSION values.
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== HTML_CACHE && k !== ASSET_CACHE)
          .map(k => caches.delete(k))
    );
    // Take control of any already-open clients.
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isHTML =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    url.pathname.endsWith('/');

  if (isHTML) {
    // NETWORK-FIRST for the app shell.
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(HTML_CACHE);
        cache.put(req, fresh.clone()).catch(() => {});
        return fresh;
      } catch (err) {
        const cached = await caches.match(req);
        if (cached) return cached;
        // Last resort: any cached document, so the PWA still opens offline.
        const anyHTML = await caches.match('/') ||
                        await caches.match('/index.html');
        return anyHTML || new Response(
          'Offline — and no cached page available yet.',
          { status: 503, headers: { 'Content-Type': 'text/plain' } }
        );
      }
    })());
    return;
  }

  // CACHE-FIRST for static-ish assets.
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.status === 200 && fresh.type !== 'opaqueredirect') {
        const cache = await caches.open(ASSET_CACHE);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});

/* Allow the page (or you, from devtools) to force an immediate update:
   navigator.serviceWorker.controller?.postMessage('skip-waiting'); */
self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

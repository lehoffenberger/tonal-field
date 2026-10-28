// Tonal Field service worker: offline app shell + cached Google Fonts.
// Bump VERSION whenever index.html or the icons change so phones pick up the update.
const VERSION = 'v5';
const SHELL = `tf-shell-${VERSION}`;
const FONTS = 'tf-fonts';
// voice clips and piano samples: kept across versions (they rarely change)
const MEDIA = 'tf-media-1';
const VOICE_FILES = ["voice/augmented.mp3", "voice/diminished-seven.mp3", "voice/diminished.mp3", "voice/dominant-seven.mp3", "voice/down.mp3", "voice/five-of-five.mp3", "voice/five-of-six.mp3", "voice/five-of-two.mp3", "voice/five-seven-of-four.mp3", "voice/five-seven.mp3", "voice/five.mp3", "voice/flat-seven.mp3", "voice/flat-six.mp3", "voice/flat-three.mp3", "voice/flat-two.mp3", "voice/four-major-seven.mp3", "voice/four-minor-seven.mp3", "voice/four.mp3", "voice/half-diminished.mp3", "voice/hands-free-on.mp3", "voice/major-five.mp3", "voice/major-four.mp3", "voice/major-one.mp3", "voice/major-second.mp3", "voice/major-seven.mp3", "voice/major-seventh.mp3", "voice/major-sixth.mp3", "voice/major-third.mp3", "voice/major.mp3", "voice/minor-five.mp3", "voice/minor-four.mp3", "voice/minor-second.mp3", "voice/minor-seven.mp3", "voice/minor-seventh.mp3", "voice/minor-sixth.mp3", "voice/minor-third.mp3", "voice/minor.mp3", "voice/octave.mp3", "voice/one-major-seven.mp3", "voice/one-minor-seven.mp3", "voice/one.mp3", "voice/perfect-fifth.mp3", "voice/perfect-fourth.mp3", "voice/seven-diminished-seven.mp3", "voice/seven-diminished.mp3", "voice/seven-dominant-seven.mp3", "voice/seven-half-diminished.mp3", "voice/seven.mp3", "voice/sharp-four.mp3", "voice/six-major-seven.mp3", "voice/six-minor-seven.mp3", "voice/six.mp3", "voice/three-major-seven.mp3", "voice/three-minor-seven.mp3", "voice/three.mp3", "voice/tritone.mp3", "voice/two-diminished.mp3", "voice/two-half-diminished.mp3", "voice/two-minor-seven.mp3", "voice/two.mp3"];
const SHELL_FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];
// Same URL as the stylesheet link in index.html.
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700&family=Sora:wght@300;400;500;600&family=VT323&family=Space+Mono:wght@400;700&display=swap';

// Cache the font stylesheet and every font file it points to, so both themes
// have their fonts offline even if one was never opened online.
async function precacheFonts() {
  const cache = await caches.open(FONTS);
  const res = await fetch(FONT_CSS);
  if (!res.ok) return;
  await cache.put(FONT_CSS, res.clone());
  const urls = [...(await res.text()).matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]);
  await Promise.all(urls.map(u => fetch(u).then(r => r.ok && cache.put(u, r)).catch(() => {})));
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL).then(c => c.addAll(SHELL_FILES))
      .then(() => caches.open(MEDIA).then(c => c.addAll(VOICE_FILES)).catch(() => {}))
      .then(() => precacheFonts().catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('tf-shell-') && k !== SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: CSS from fonts.googleapis.com, font files from fonts.gstatic.com.
  // Serve from cache, refresh in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async cache => {
      const hit = await cache.match(req);
      const net = fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Pages: network first so updates show up when online, cache when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(SHELL).then(c => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Voice clips and piano samples: cache first, saved on first use (so the grand piano works offline once heard).
  if (url.pathname.includes('/voice/') || url.pathname.includes('/piano/')) {
    e.respondWith(caches.open(MEDIA).then(async cache => {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    }));
    return;
  }

  // Everything else on this origin: cache first.
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});

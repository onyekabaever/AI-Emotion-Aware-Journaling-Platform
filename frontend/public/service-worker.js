
const CACHE_NAME = 'ejournal-cache-v1'
const URLS = ['/', '/index.html']
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS)))
})
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).then(r => {
      const copy = r.clone()
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy))
      return r
    }))
  )
})

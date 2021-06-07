// give your cache a name
const cacheName = 'temp-mail-cache';

// put the static assets and routes you want to cache here
const filesToCache = [
  {
    method: 'GET',
    url: '/manifest.json'
  },
  {
    method: 'GET',
    url: '/service-worker.js'
  },
  {
    method: 'GET',
    url: '/favicon.ico'
  },
  {
    method: 'GET',
    url: '/'
  },
  {
    method: 'GET',
    url: '/index.html'
  },
  {
    method: 'GET',
    url: '/assets/css/style.css'
  },
  {
    method: 'GET',
    url: '/assets/css/bootstrap.min.css'
  },
  {
    method: 'GET',
    url: '/assets/css/bootstrap.min.css.map'
  },
  {
    method: 'GET',
    url: '/assets/css/notyf.min.css'
  },
  {
    method: 'GET',
    url: '/assets/js/script.js'
  },
  {
    method: 'GET',
    url: '/assets/js/app.js'
  },
  {
    method: 'GET',
    url: '/assets/js/1secmail-api.js'
  },
  {
    method: 'GET',
    url: '/assets/js/notyf.min.js'
  },
  {
    method: 'GET',
    url: '/assets/js/vue.global.prod.min.js'
  },
  {
    method: 'GET',
    url: '/appicons/apple-touch-icon-144x144.png'
  },
  
];

// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event 
// typically used to cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll( filesToCache.map((e) => e.url) ))
  );
});

// the fetch event handler, to intercept requests and serve all 
// static assets from the cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(resp => {
        if( filesToCache.find(el => (e.request.url===self.origin+el.url) && (e.request.method===el.method)) ) //we need to cache this respose
        {
          return caches.open(cacheName).then((cache) => { 
            cache.put(e.request, resp.clone())        //caching the new version
            return resp
          })
        }
        else{
          return resp
        }
    })
    .catch(err => {
      return caches.match(e.request).then((cache_resp) => {
        return cache_resp ? cache_resp : new Error('you are offline & cache is unavailble.')
      })
    })
  )
});
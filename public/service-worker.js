const FILES_TO_CACHE = [
    "./index.html",
    '/js/index.js',
    '/js/idb.js',
    '/manifest.json',
    "./public/css/styles.css",
    "./public/icons/icon-72x72.png",
    "./public/icons/icon-96x96.png",
    "./public/icons/icon-128x128.png",
    "./public/icons/icon-144x144.png",
    "./public/icons/icon-152x152.png",
    "./public/icons/icon-192x192.png",
    "./public/icons/icon-384x384.png",
    "./public/icons/icon-512x512.png"
];

const APP_PREFIX = 'BudgetTracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// installation

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// activation
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keylist) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            // push current cache to 'cachekeeplist'
            cacheKeepList.push(CACHE_NAME);
            // promise resolves when old versions of cache have been deleted
            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        return caches.delete(keyList[i])
                    }
                })
            )
        })
    );
});

// waiting/idle  retrieve info from cache 'fetch'
self.addEventListener('fetch', function (e) {
    e.respondWith(
        // if request is stored in cache, trigger
        caches.match(e.request).then(function (request) {
            return request || fetch(e.request)
        })
    );
})
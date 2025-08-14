const CACHE_NAME = 'smartbiz-ai-v1.2.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// AI performance monitoring
const AI_METRICS = {
  responseTime: [],
  errorRate: 0,
  cacheHitRate: 0
};

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SmartBiz AI: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('SmartBiz AI: All resources cached');
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SmartBiz AI: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SmartBiz AI: Service worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Handle API requests differently
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Track AI API performance
          if (event.request.url.includes('ai') || event.request.url.includes('chat')) {
            trackAIPerformance(response);
          }
          return response;
        })
        .catch((error) => {
          console.error('SmartBiz AI: API request failed:', error);
          // Return offline response for AI requests
          return new Response(
            JSON.stringify({
              error: 'Offline mode active. AI responses will be available when connection is restored.',
              offline: true
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response and update cache in background
        if (response) {
          AI_METRICS.cacheHitRate++;
          
          // Update cache in background for HTML files
          if (event.request.destination === 'document') {
            fetch(event.request).then((fetchResponse) => {
              if (fetchResponse && fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
            }).catch(() => {
              // Silently fail background update
            });
          }
          
          return response;
        }

        // No cache hit - fetch from network
        return fetch(event.request)
          .then((fetchResponse) => {
            // Check if valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone response for caching
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/') || new Response(
                '<html><body><h1>SmartBiz AI - Offline</h1><p>You are currently offline. The app will work when connection is restored.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            
            // Return empty response for other requests
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Background sync for offline AI interactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'ai-interaction-sync') {
    event.waitUntil(syncAIInteractions());
  }
});

// Push notifications for AI updates
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'SmartBiz AI has new updates!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open SmartBiz AI',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SmartBiz AI', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// AI Performance tracking
function trackAIPerformance(response) {
  const responseTime = performance.now();
  AI_METRICS.responseTime.push(responseTime);
  
  if (response.status >= 400) {
    AI_METRICS.errorRate++;
  }
  
  // Keep only last 100 measurements
  if (AI_METRICS.responseTime.length > 100) {
    AI_METRICS.responseTime.shift();
  }
}

// Sync offline AI interactions
async function syncAIInteractions() {
  try {
    const cache = await caches.open('ai-interactions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log('SmartBiz AI: Failed to sync interaction:', error);
      }
    }
  } catch (error) {
    console.error('SmartBiz AI: Sync failed:', error);
  }
}

// Periodic cleanup and optimization
setInterval(() => {
  // Clean up old performance metrics
  if (AI_METRICS.responseTime.length > 1000) {
    AI_METRICS.responseTime = AI_METRICS.responseTime.slice(-100);
  }
  
  // Log performance summary
  console.log('SmartBiz AI Performance:', {
    avgResponseTime: AI_METRICS.responseTime.reduce((a, b) => a + b, 0) / AI_METRICS.responseTime.length || 0,
    errorRate: AI_METRICS.errorRate,
    cacheHitRate: AI_METRICS.cacheHitRate
  });
}, 300000); // Every 5 minutes

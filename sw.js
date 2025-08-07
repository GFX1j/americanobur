// ===== SERVICE WORKER =====
// American Burguer - Service Worker for PWA

const CACHE_NAME = 'american-burguer-v1.0.0';
const STATIC_CACHE = 'american-burguer-static-v1.0.0';
const DYNAMIC_CACHE = 'american-burguer-dynamic-v1.0.0';
const IMAGE_CACHE = 'american-burguer-images-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/responsive.css',
    '/js/main.js',
    '/js/cart.js',
    '/js/pwa.js',
    '/manifest.json',
    '/images/logo.png',
    '/images/hero-bg.jpg',
    '/images/placeholder-product.svg',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Files that should be cached on demand
const DYNAMIC_FILES = [
    '/images/products/',
    '/images/testimonials/',
    '/api/'
];

// Maximum cache sizes
const MAX_STATIC_CACHE_SIZE = 50;
const MAX_DYNAMIC_CACHE_SIZE = 30;
const MAX_IMAGE_CACHE_SIZE = 100;

// ===== UTILITY FUNCTIONS =====

// Limit cache size
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(() => {
                    limitCacheSize(name, size);
                });
            }
        });
    });
};

// Check if request is for an image
const isImageRequest = (request) => {
    return request.destination === 'image' || 
           request.url.includes('/images/') ||
           /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
};

// Check if request is for static assets
const isStaticAsset = (request) => {
    return request.url.includes('/css/') ||
           request.url.includes('/js/') ||
           request.url.includes('/fonts/') ||
           request.url.includes('googleapis.com') ||
           request.url.includes('cdnjs.cloudflare.com');
};

// Check if request is for API
const isAPIRequest = (request) => {
    return request.url.includes('/api/');
};

// Create offline fallback response
const createOfflineFallback = () => {
    return new Response(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - American Burguer</title>
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                }
                .offline-container {
                    max-width: 400px;
                    padding: 2rem;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                .offline-title {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }
                .offline-message {
                    font-size: 1rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                .offline-button {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                }
                .offline-button:hover {
                    background: white;
                    color: #ff6b35;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📱</div>
                <h1 class="offline-title">Você está offline</h1>
                <p class="offline-message">
                    Não foi possível conectar à internet. Verifique sua conexão e tente novamente.
                </p>
                <button class="offline-button" onclick="window.location.reload()">
                    Tentar Novamente
                </button>
            </div>
        </body>
        </html>
    `, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        }
    });
};

// ===== SERVICE WORKER EVENTS =====

// Install event
self.addEventListener('install', event => {
    console.log('SW: Installing service worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('SW: Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('SW: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('SW: Error caching static files:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('SW: Activating service worker...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete old caches
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== IMAGE_CACHE) {
                            console.log('SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('SW: Service worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    const request = event.request;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticAsset(request)) {
        event.respondWith(handleStaticRequest(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handlePageRequest(request));
    }
});

// ===== REQUEST HANDLERS =====

// Handle image requests
const handleImageRequest = async (request) => {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, networkResponse.clone());
            limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('SW: Image request failed:', request.url);
        
        // Return placeholder image for failed image requests
        const cache = await caches.open(STATIC_CACHE);
        const fallback = await cache.match('/images/placeholder-product.svg');
        return fallback || new Response('', { status: 404 });
    }
};

// Handle static asset requests
const handleStaticRequest = async (request) => {
    try {
        // Cache first strategy for static assets
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            limitCacheSize(STATIC_CACHE, MAX_STATIC_CACHE_SIZE);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('SW: Static asset request failed:', request.url);
        
        // Try to return cached version
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('', { status: 404 });
    }
};

// Handle API requests
const handleAPIRequest = async (request) => {
    try {
        // Network first strategy for API requests
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('SW: API request failed:', request.url);
        
        // Try to return cached version
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline API response
        return new Response(JSON.stringify({
            error: 'Offline',
            message: 'Esta funcionalidade não está disponível offline.'
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            status: 503
        });
    }
};

// Handle page requests
const handlePageRequest = async (request) => {
    try {
        // Network first strategy for pages
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('SW: Page request failed:', request.url);
        
        // Try to return cached version
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try to return cached index.html for SPA routing
        const indexResponse = await caches.match('/index.html');
        if (indexResponse) {
            return indexResponse;
        }
        
        // Return offline fallback
        return createOfflineFallback();
    }
};

// ===== MESSAGE HANDLING =====

// Listen for messages from the main thread
self.addEventListener('message', event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ type: 'CACHE_SIZE', payload: size });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
            });
            break;
            
        case 'CACHE_URLS':
            if (payload && payload.urls) {
                cacheUrls(payload.urls).then(() => {
                    event.ports[0].postMessage({ type: 'URLS_CACHED' });
                });
            }
            break;
    }
});

// ===== CACHE MANAGEMENT FUNCTIONS =====

// Get total cache size
const getCacheSize = async () => {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
};

// Clear all caches
const clearAllCaches = async () => {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
};

// Cache specific URLs
const cacheUrls = async (urls) => {
    const cache = await caches.open(DYNAMIC_CACHE);
    return cache.addAll(urls);
};

// ===== BACKGROUND SYNC =====

// Handle background sync
self.addEventListener('sync', event => {
    console.log('SW: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync-orders') {
        event.waitUntil(syncOrders());
    }
});

// Sync pending orders
const syncOrders = async () => {
    try {
        // Get pending orders from IndexedDB or localStorage
        const pendingOrders = await getPendingOrders();
        
        for (const order of pendingOrders) {
            try {
                // Try to send order to server
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });
                
                if (response.ok) {
                    // Remove from pending orders
                    await removePendingOrder(order.id);
                    console.log('SW: Order synced successfully:', order.id);
                }
            } catch (error) {
                console.log('SW: Failed to sync order:', order.id, error);
            }
        }
    } catch (error) {
        console.error('SW: Background sync failed:', error);
    }
};

// Get pending orders (placeholder - implement with IndexedDB)
const getPendingOrders = async () => {
    // This would typically use IndexedDB
    return [];
};

// Remove pending order (placeholder - implement with IndexedDB)
const removePendingOrder = async (orderId) => {
    // This would typically use IndexedDB
    console.log('SW: Removing pending order:', orderId);
};

// ===== PUSH NOTIFICATIONS =====

// Handle push notifications
self.addEventListener('push', event => {
    console.log('SW: Push notification received');
    
    let notificationData = {
        title: 'American Burguer',
        body: 'Você tem uma nova notificação!',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-192x192.png',
        tag: 'american-burguer-notification',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Abrir App',
                icon: '/images/icons/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };
    
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (error) {
            console.error('SW: Error parsing push data:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('SW: Notification clicked:', event.notification.tag);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ===== PERIODIC BACKGROUND SYNC =====

// Handle periodic background sync
self.addEventListener('periodicsync', event => {
    console.log('SW: Periodic background sync triggered:', event.tag);
    
    if (event.tag === 'update-menu') {
        event.waitUntil(updateMenuCache());
    }
});

// Update menu cache
const updateMenuCache = async () => {
    try {
        console.log('SW: Updating menu cache...');
        
        // Fetch latest menu data
        const response = await fetch('/api/menu');
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put('/api/menu', response.clone());
            
            // Notify clients about update
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'MENU_UPDATED',
                    payload: 'Menu atualizado com sucesso!'
                });
            });
        }
    } catch (error) {
        console.error('SW: Failed to update menu cache:', error);
    }
};

// ===== ERROR HANDLING =====

// Handle unhandled errors
self.addEventListener('error', event => {
    console.error('SW: Unhandled error:', event.error);
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', event => {
    console.error('SW: Unhandled promise rejection:', event.reason);
});

// ===== SERVICE WORKER LIFECYCLE =====

console.log('SW: Service Worker script loaded');

// Update check
self.addEventListener('updatefound', () => {
    console.log('SW: Update found, new service worker installing...');
});

// Controlled clients change
self.addEventListener('controllerchange', () => {
    console.log('SW: Controller changed, reloading page...');
    window.location.reload();
});

// ===== CACHE VERSIONING =====

// Check if cache needs update
const checkCacheVersion = async () => {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/cache-version.json');
    
    if (cachedResponse) {
        const cachedVersion = await cachedResponse.json();
        const currentVersion = { version: CACHE_NAME };
        
        if (cachedVersion.version !== currentVersion.version) {
            console.log('SW: Cache version mismatch, updating...');
            await clearAllCaches();
            return true;
        }
    }
    
    return false;
};

// ===== PERFORMANCE MONITORING =====

// Monitor cache performance
const monitorCachePerformance = () => {
    let cacheHits = 0;
    let cacheMisses = 0;
    
    const originalMatch = caches.match;
    caches.match = function(...args) {
        return originalMatch.apply(this, args).then(response => {
            if (response) {
                cacheHits++;
            } else {
                cacheMisses++;
            }
            
            // Log performance stats every 100 requests
            if ((cacheHits + cacheMisses) % 100 === 0) {
                const hitRate = (cacheHits / (cacheHits + cacheMisses) * 100).toFixed(2);
                console.log(`SW: Cache hit rate: ${hitRate}% (${cacheHits}/${cacheHits + cacheMisses})`);
            }
            
            return response;
        });
    };
};

// Initialize performance monitoring
monitorCachePerformance();

console.log('SW: Service Worker initialized successfully');
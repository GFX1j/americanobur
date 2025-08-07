// ===== PWA JAVASCRIPT FILE =====
// American Burguer - Progressive Web App Functions

// ===== PWA INSTALLATION =====
let deferredPrompt;
let isInstalled = false;

// Check if app is already installed
function checkIfInstalled() {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        isInstalled = true;
        hideInstallPrompt();
        return true;
    }
    
    // Check if running as PWA on mobile
    if (window.navigator.standalone === true) {
        isInstalled = true;
        hideInstallPrompt();
        return true;
    }
    
    return false;
}

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA: beforeinstallprompt event fired');
    
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button if not already installed
    if (!isInstalled) {
        showInstallPrompt();
    }
});

// Listen for appinstalled event
window.addEventListener('appinstalled', (e) => {
    console.log('PWA: App was installed');
    isInstalled = true;
    hideInstallPrompt();
    showToast('App instalado com sucesso!', 'success');
});

// Show install prompt
function showInstallPrompt() {
    const installPrompt = createInstallPrompt();
    document.body.appendChild(installPrompt);
    
    // Show with animation
    setTimeout(() => {
        installPrompt.classList.add('show');
    }, 100);
}

// Hide install prompt
function hideInstallPrompt() {
    const existingPrompt = document.getElementById('pwa-install-prompt');
    if (existingPrompt) {
        existingPrompt.classList.remove('show');
        setTimeout(() => {
            if (existingPrompt.parentNode) {
                existingPrompt.parentNode.removeChild(existingPrompt);
            }
        }, 300);
    }
}

// Create install prompt element
function createInstallPrompt() {
    const prompt = document.createElement('div');
    prompt.id = 'pwa-install-prompt';
    prompt.className = 'pwa-install-prompt';
    
    prompt.innerHTML = `
        <div class="pwa-prompt-content">
            <div class="pwa-prompt-icon">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="pwa-prompt-text">
                <h4>Instalar American Burguer</h4>
                <p>Instale nosso app para uma experiência melhor e acesso offline!</p>
            </div>
            <div class="pwa-prompt-actions">
                <button class="pwa-btn-dismiss" onclick="dismissInstallPrompt()">
                    <i class="fas fa-times"></i>
                </button>
                <button class="pwa-btn-install" onclick="installPWA()">
                    <i class="fas fa-download"></i>
                    Instalar
                </button>
            </div>
        </div>
    `;
    
    return prompt;
}

// Install PWA
function installPWA() {
    if (!deferredPrompt) {
        showToast('Instalação não disponível neste momento.', 'warning');
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA: User accepted the install prompt');
            showToast('Instalando app...', 'info');
        } else {
            console.log('PWA: User dismissed the install prompt');
        }
        
        // Clear the deferredPrompt
        deferredPrompt = null;
        hideInstallPrompt();
    });
}

// Dismiss install prompt
function dismissInstallPrompt() {
    hideInstallPrompt();
    
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
}

// ===== SERVICE WORKER REGISTRATION =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW: Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available
                                showUpdatePrompt();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('SW: Service Worker registration failed:', error);
                });
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
                showToast('Conteúdo atualizado disponível!', 'info');
            }
        });
    }
}

// Show update prompt
function showUpdatePrompt() {
    const updatePrompt = createUpdatePrompt();
    document.body.appendChild(updatePrompt);
    
    setTimeout(() => {
        updatePrompt.classList.add('show');
    }, 100);
}

// Create update prompt
function createUpdatePrompt() {
    const prompt = document.createElement('div');
    prompt.id = 'pwa-update-prompt';
    prompt.className = 'pwa-update-prompt';
    
    prompt.innerHTML = `
        <div class="pwa-prompt-content">
            <div class="pwa-prompt-icon">
                <i class="fas fa-sync-alt"></i>
            </div>
            <div class="pwa-prompt-text">
                <h4>Atualização Disponível</h4>
                <p>Uma nova versão do app está disponível. Recarregar para atualizar?</p>
            </div>
            <div class="pwa-prompt-actions">
                <button class="pwa-btn-dismiss" onclick="dismissUpdatePrompt()">
                    Depois
                </button>
                <button class="pwa-btn-update" onclick="updatePWA()">
                    <i class="fas fa-sync-alt"></i>
                    Atualizar
                </button>
            </div>
        </div>
    `;
    
    return prompt;
}

// Update PWA
function updatePWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                // Tell the waiting service worker to skip waiting
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                
                // Reload the page to use the new service worker
                window.location.reload();
            }
        });
    }
}

// Dismiss update prompt
function dismissUpdatePrompt() {
    const existingPrompt = document.getElementById('pwa-update-prompt');
    if (existingPrompt) {
        existingPrompt.classList.remove('show');
        setTimeout(() => {
            if (existingPrompt.parentNode) {
                existingPrompt.parentNode.removeChild(existingPrompt);
            }
        }, 300);
    }
}

// ===== OFFLINE DETECTION =====
function setupOfflineDetection() {
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        const offlineIndicator = document.getElementById('offline-indicator');
        
        if (!isOnline) {
            if (!offlineIndicator) {
                createOfflineIndicator();
            }
            showToast('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning');
        } else {
            if (offlineIndicator) {
                offlineIndicator.remove();
            }
        }
    }
    
    // Initial check
    updateOnlineStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
        updateOnlineStatus();
        showToast('Conexão restaurada!', 'success');
    });
    
    window.addEventListener('offline', updateOnlineStatus);
}

// Create offline indicator
function createOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'offline-indicator';
    indicator.innerHTML = `
        <i class="fas fa-wifi"></i>
        <span>Offline</span>
    `;
    
    document.body.appendChild(indicator);
}

// ===== CACHE MANAGEMENT =====
function clearAppCache() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
                registration.unregister().then(() => {
                    // Clear all caches
                    if ('caches' in window) {
                        caches.keys().then((cacheNames) => {
                            return Promise.all(
                                cacheNames.map((cacheName) => {
                                    return caches.delete(cacheName);
                                })
                            );
                        }).then(() => {
                            showToast('Cache limpo com sucesso!', 'success');
                            // Reload the page
                            window.location.reload();
                        });
                    }
                });
            }
        });
    }
}

// Get cache size
function getCacheSize() {
    if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
        return navigator.storage.estimate().then((estimate) => {
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 0;
            
            return {
                used: formatBytes(usage),
                total: formatBytes(quota),
                percentage: quota > 0 ? Math.round((usage / quota) * 100) : 0
            };
        });
    }
    
    return Promise.resolve({ used: 'N/A', total: 'N/A', percentage: 0 });
}

// Format bytes to human readable
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ===== PWA ANALYTICS =====
function trackPWAUsage() {
    // Track installation
    if (isInstalled) {
        console.log('PWA: App is running in installed mode');
    }
    
    // Track display mode
    const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' :
                       window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' :
                       window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' :
                       'browser';
    
    console.log('PWA: Display mode:', displayMode);
    
    // Track orientation
    const orientation = screen.orientation ? screen.orientation.type : 'unknown';
    console.log('PWA: Orientation:', orientation);
    
    // Track viewport size
    console.log('PWA: Viewport:', window.innerWidth + 'x' + window.innerHeight);
}

// ===== PWA FEATURES =====
function setupPWAFeatures() {
    // Add to home screen prompt
    if (!checkIfInstalled() && !sessionStorage.getItem('pwa-install-dismissed')) {
        // Show install prompt after 30 seconds
        setTimeout(() => {
            if (deferredPrompt && !isInstalled) {
                showInstallPrompt();
            }
        }, 30000);
    }
    
    // Setup offline detection
    setupOfflineDetection();
    
    // Track PWA usage
    trackPWAUsage();
    
    // Setup orientation change handler
    if (screen.orientation) {
        screen.orientation.addEventListener('change', () => {
            console.log('PWA: Orientation changed to:', screen.orientation.type);
            
            // Trigger resize event for responsive adjustments
            window.dispatchEvent(new Event('resize'));
        });
    }
    
    // Setup visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('PWA: App hidden');
        } else {
            console.log('PWA: App visible');
        }
    });
}

// ===== PWA MANIFEST UTILITIES =====
function getManifestData() {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
        return fetch(manifestLink.href)
            .then(response => response.json())
            .catch(error => {
                console.error('PWA: Error loading manifest:', error);
                return null;
            });
    }
    return Promise.resolve(null);
}

// ===== PWA SHARE API =====
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            console.log('PWA: Content shared successfully');
        }).catch((error) => {
            console.log('PWA: Error sharing content:', error);
            fallbackShare(title, text, url);
        });
    } else {
        fallbackShare(title, text, url);
    }
}

// Fallback share function
function fallbackShare(title, text, url) {
    const shareText = `${title}\n${text}\n${url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Link copiado para a área de transferência!', 'success');
        });
    } else {
        // Create temporary textarea for copying
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Link copiado para a área de transferência!', 'success');
    }
}

// ===== PWA INITIALIZATION =====
function initializePWA() {
    console.log('PWA: Initializing Progressive Web App features');
    
    // Register service worker
    registerServiceWorker();
    
    // Setup PWA features
    setupPWAFeatures();
    
    // Check if already installed
    checkIfInstalled();
    
    console.log('PWA: Initialization complete');
}

// ===== GLOBAL PWA FUNCTIONS =====
window.installPWA = installPWA;
window.dismissInstallPrompt = dismissInstallPrompt;
window.updatePWA = updatePWA;
window.dismissUpdatePrompt = dismissUpdatePrompt;
window.clearAppCache = clearAppCache;
window.getCacheSize = getCacheSize;
window.shareContent = shareContent;

// ===== PWA STYLES =====
function addPWAStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pwa-install-prompt,
        .pwa-update-prompt {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: var(--white);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .pwa-install-prompt.show,
        .pwa-update-prompt.show {
            transform: translateY(0);
        }
        
        .pwa-prompt-content {
            display: flex;
            align-items: center;
            padding: 1rem;
            gap: 1rem;
        }
        
        .pwa-prompt-icon {
            color: var(--primary-color);
            font-size: 1.5rem;
        }
        
        .pwa-prompt-text {
            flex: 1;
        }
        
        .pwa-prompt-text h4 {
            margin: 0 0 0.25rem 0;
            font-size: 1rem;
            color: var(--text-dark);
        }
        
        .pwa-prompt-text p {
            margin: 0;
            font-size: 0.875rem;
            color: var(--text-muted);
        }
        
        .pwa-prompt-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .pwa-btn-dismiss,
        .pwa-btn-install,
        .pwa-btn-update {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: var(--border-radius);
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .pwa-btn-dismiss {
            background: var(--gray-100);
            color: var(--text-muted);
        }
        
        .pwa-btn-dismiss:hover {
            background: var(--gray-200);
        }
        
        .pwa-btn-install,
        .pwa-btn-update {
            background: var(--primary-color);
            color: white;
        }
        
        .pwa-btn-install:hover,
        .pwa-btn-update:hover {
            background: var(--primary-dark);
        }
        
        .offline-indicator {
            position: fixed;
            top: 70px;
            right: 20px;
            background: var(--warning-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            font-size: 0.875rem;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .pwa-install-prompt,
            .pwa-update-prompt {
                left: 10px;
                right: 10px;
                bottom: 10px;
            }
            
            .offline-indicator {
                top: 60px;
                right: 10px;
                left: 10px;
                text-align: center;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== AUTO INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Add PWA styles
    addPWAStyles();
    
    // Initialize PWA
    initializePWA();
});

// ===== PWA DEBUG =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugPWA = {
        isInstalled: () => isInstalled,
        deferredPrompt: () => deferredPrompt,
        installPWA: installPWA,
        clearAppCache: clearAppCache,
        getCacheSize: getCacheSize,
        getManifestData: getManifestData,
        shareContent: shareContent
    };
    
    console.log('PWA debug functions available in window.debugPWA');
}
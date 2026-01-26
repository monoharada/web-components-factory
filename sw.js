// Service Worker for Web Components Factory
// キャッシュ戦略: Core → Cache-First, Components → Stale-While-Revalidate

const CACHE_VERSION = 'v12';
const CORE_CACHE = `core-${CACHE_VERSION}`;
const COMPONENT_CACHE = `components-${CACHE_VERSION}`;

// コア依存（変更頻度低い）- Cache-First
const CORE_ASSETS = [
  '/core/web-components.js',
  '/config.js',
  '/utils/aria.js',
  '/utils/behaviors.js',
  '/utils/dom.js',
  '/styles/tokens.js'
];

// インストール時にコア依存をプリキャッシュ
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => {
      console.log('[SW] Pre-caching core assets');
      return cache.addAll(CORE_ASSETS).catch((error) => {
        console.error('[SW] Pre-caching failed:', error);
        // プリキャッシュ失敗でもインストールは継続（オフライン時は個別フェッチで対応）
      });
    }).then(() => {
      console.log('[SW] Install complete');
      return self.skipWaiting(); // 即座にアクティブ化
    })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // 現在のバージョン以外のキャッシュを削除
            return (name.startsWith('core-') && name !== CORE_CACHE) ||
                   (name.startsWith('components-') && name !== COMPONENT_CACHE);
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activate complete');
      return self.clients.claim(); // 既存のクライアントを制御
    })
  );
});

// フェッチ戦略
self.addEventListener('fetch', (event) => {
  // 非GETリクエストはキャッシュをスキップ
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const path = url.pathname;

  // HTML は常にネットワークから取得
  if (path.endsWith('.html') || path === '/') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // コア依存 → Cache-First（高速）
  if (isCoreAsset(path)) {
    event.respondWith(cacheFirst(event.request, CORE_CACHE));
    return;
  }

  // コンポーネント → Stale-While-Revalidate（バランス）
  if (path.startsWith('/@components/') || path.startsWith('/components/')) {
    event.respondWith(staleWhileRevalidate(event.request, COMPONENT_CACHE));
    return;
  }

  // viewer / demos（頻繁に変わる） → Network-First（即時反映 + フォールバック）
  if (path.includes('/src/') && (path.endsWith('.js') || path.endsWith('.css'))) {
    event.respondWith(networkFirstWithCache(event.request, COMPONENT_CACHE));
    return;
  }

  // その他のJS/CSS → Stale-While-Revalidate
  if (path.endsWith('.js') || path.endsWith('.css')) {
    event.respondWith(staleWhileRevalidate(event.request, COMPONENT_CACHE));
    return;
  }

  // デフォルト: ネットワークのみ
  event.respondWith(fetch(event.request));
});

// コア依存かどうかを判定
function isCoreAsset(path) {
  return CORE_ASSETS.some((asset) => path === asset || path.endsWith(asset));
}

// Cache-First戦略（キャッシュ優先、なければネットワーク）
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[SW] Cache-First HIT:', request.url);
    return cached;
  }

  console.log('[SW] Cache-First MISS:', request.url);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache-First error:', error);
    return new Response('Network error', { status: 503 });
  }
}

// Stale-While-Revalidate戦略（キャッシュを即返し、バックグラウンドで更新）
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // バックグラウンドでネットワークから取得
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
      console.log('[SW] SWR Updated:', request.url);
    }
    return response;
  }).catch((error) => {
    console.error('[SW] SWR fetch error:', error);
    return null;
  });

  if (cached) {
    console.log('[SW] SWR Cache HIT:', request.url);
    return cached;
  }

  // キャッシュがない場合はネットワークを待つ
  console.log('[SW] SWR Cache MISS:', request.url);
  const response = await fetchPromise;
  return response || new Response('Network error', { status: 503 });
}

// Network-First戦略（ネットワーク優先、失敗時はキャッシュ）
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('[SW] Network-First fallback to cache:', request.url);
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

// Network-First + Cache fallback（ネットワーク成功時は更新）
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network-First (cache) fallback:', request.url);
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

/**
 * Web Components Preloader
 *
 * ライブラリのコア依存をプリロードするヘルパー。
 * HTTP/2 Server Pushが使えない環境でも、クライアント側で
 * modulepreloadを動的に追加してパフォーマンスを最適化。
 *
 * @example HTML直書き（推奨）
 * ```html
 * <link rel="modulepreload" href="/core/web-components.js">
 * <link rel="modulepreload" href="/config.js">
 * <!-- ... -->
 * ```
 *
 * @example JavaScript動的プリロード
 * ```js
 * import { preloadCoreDependencies } from '@luxembourg/core/preloader';
 * preloadCoreDependencies('/path/to/lib');
 * ```
 */

/** コア依存のリスト（相対パス） */
export const CORE_DEPENDENCIES = [
  '/core/web-components.js',
  '/config.js',
  '/utils/aria.js',
  '/utils/behaviors.js',
  '/utils/dom.js',
  '/styles/tokens.js'
] as const;

/** プリロードオプション */
export interface PreloadOptions {
  /** ベースURL（デフォルト: ''） */
  baseUrl?: string;
  /** クロスオリジン設定 */
  crossorigin?: 'anonymous' | 'use-credentials';
  /** プリロード完了時コールバック */
  onComplete?: () => void;
  /** エラー時コールバック */
  onError?: (error: Error) => void;
}

/**
 * modulepreloadリンクを追加
 */
function addModulePreloadLink(href: string, crossorigin?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 既に存在するかチェック
    const existing = document.querySelector(`link[rel="modulepreload"][href="${href}"]`);
    if (existing) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = href;
    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload: ${href}`));

    document.head.appendChild(link);
  });
}

/**
 * コア依存をプリロード
 *
 * @param options プリロードオプション
 * @returns プリロード完了時に解決するPromise
 *
 * @example
 * ```js
 * // デフォルト（ルートパス）
 * await preloadCoreDependencies();
 *
 * // カスタムベースURL
 * await preloadCoreDependencies({ baseUrl: '/libs/luxembourg' });
 *
 * // CDN経由
 * await preloadCoreDependencies({
 *   baseUrl: 'https://cdn.example.com/luxembourg',
 *   crossorigin: 'anonymous'
 * });
 * ```
 */
export async function preloadCoreDependencies(options: PreloadOptions = {}): Promise<void> {
  const { baseUrl = '', crossorigin, onComplete, onError } = options;

  try {
    const promises = CORE_DEPENDENCIES.map(dep => {
      const href = `${baseUrl}${dep}`;
      return addModulePreloadLink(href, crossorigin);
    });

    await Promise.all(promises);
    onComplete?.();
  } catch (error) {
    onError?.(error as Error);
    throw error;
  }
}

/**
 * requestIdleCallbackでプリロード（低優先度）
 *
 * ページのメイン処理を妨げずにバックグラウンドでプリロード。
 *
 * @param options プリロードオプション
 * @param timeout アイドルタイムアウト（デフォルト: 2000ms）
 */
export function preloadCoreDependenciesWhenIdle(
  options: PreloadOptions = {},
  timeout = 2000
): void {
  const doPreload = () => preloadCoreDependencies(options);

  if (window.requestIdleCallback) {
    window.requestIdleCallback(doPreload, { timeout });
  } else {
    // フォールバック: setTimeout
    setTimeout(doPreload, 100);
  }
}

/**
 * HTML直書き用のpreloadリンクを生成
 *
 * SSR/SSGで使用する場合に便利。
 *
 * @param baseUrl ベースURL
 * @returns HTML文字列
 *
 * @example
 * ```js
 * const html = generatePreloadHTML('/libs/luxembourg');
 * // <link rel="modulepreload" href="/libs/luxembourg/core/web-components.js">
 * // <link rel="modulepreload" href="/libs/luxembourg/config.js">
 * // ...
 * ```
 */
export function generatePreloadHTML(baseUrl = ''): string {
  return CORE_DEPENDENCIES
    .map(dep => `<link rel="modulepreload" href="${baseUrl}${dep}">`)
    .join('\n');
}

/**
 * Linkヘッダー用の文字列を生成（サーバーサイド用）
 *
 * @param baseUrl ベースURL
 * @returns Link ヘッダー値
 *
 * @example
 * ```js
 * const linkHeader = generateLinkHeader('/libs/luxembourg');
 * res.setHeader('Link', linkHeader);
 * ```
 */
export function generateLinkHeader(baseUrl = ''): string {
  return CORE_DEPENDENCIES
    .map(dep => `<${baseUrl}${dep}>; rel=preload; as=script; crossorigin`)
    .join(', ');
}

/**
 * @module font-loading-helper
 * フォント読み込み状態監視のヘルパー
 *
 * TypographyWebComponent / TypographyFormComponent の共通ロジック
 */

/**
 * フォント状態オブザーバーの管理
 */
export interface FontObserverState {
  observer: MutationObserver | null;
}

/**
 * 現在のフォント読み込み状態をコンポーネントに同期
 */
export function syncFontState(element: HTMLElement): void {
  const body = document.body;
  if (body.classList.contains('fonts-loaded')) {
    element.classList.add('fonts-loaded');
  } else if (body.classList.contains('fonts-loading')) {
    element.classList.add('fonts-loading');
  } else if (body.classList.contains('fonts-error')) {
    element.classList.add('fonts-error');
  }
}

/**
 * bodyのclass変更を監視し、フォント状態を同期
 */
export function observeFontLoadingState(
  element: HTMLElement,
  state: FontObserverState
): void {
  if (state.observer) return;

  state.observer = new MutationObserver(() => {
    const body = document.body;
    if (body.classList.contains('fonts-loaded')) {
      element.classList.remove('fonts-loading', 'fonts-error');
      element.classList.add('fonts-loaded');
    } else if (body.classList.contains('fonts-error')) {
      element.classList.remove('fonts-loading', 'fonts-loaded');
      element.classList.add('fonts-error');
    }
  });

  state.observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

/**
 * オブザーバーをクリーンアップ
 */
export function cleanupFontObserver(state: FontObserverState): void {
  if (state.observer) {
    state.observer.disconnect();
    state.observer = null;
  }
}

/**
 * テストヘルパー関数
 * Web Components テスト用のユーティリティ
 */

/**
 * HTMLをレンダリングしてルート要素を返す
 */
export function renderWebComponent(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const element = template.content.firstElementChild as HTMLElement;
  document.body.appendChild(element);
  return element;
}

/**
 * Shadow DOM内の要素を取得
 */
export function getShadowElement(component: HTMLElement, selector: string): Element | null {
  return component.shadowRoot?.querySelector(selector) || null;
}

/**
 * テスト後のクリーンアップ
 */
export function cleanup(): void {
  document.body.innerHTML = '';
}

/**
 * カスタム要素の定義完了を待機
 */
export async function waitForComponent(tagName: string, timeout = 1000): Promise<void> {
  await customElements.whenDefined(tagName);
  // requestAnimationFrameで2フレーム待機して初期化を確実に完了させる
  await new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

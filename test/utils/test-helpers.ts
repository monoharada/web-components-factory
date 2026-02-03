/**
 * テストヘルパー関数
 * Web Components テスト用のユーティリティ
 *
 * このファイルはすべてのテストヘルパー関数を一元管理します。
 * 新しいテストはこのファイルからインポートしてください。
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
 * タグ名から要素を作成してDOMに追加
 */
export function createTestElement<T extends HTMLElement>(tagName: string): T {
  const element = document.createElement(tagName) as T;
  document.body.appendChild(element);
  return element;
}

/**
 * Shadow DOM内の要素を取得
 */
export function getShadowElement<T extends Element = Element>(
  component: HTMLElement,
  selector: string
): T | null {
  return (component.shadowRoot?.querySelector(selector) as T) || null;
}

/**
 * Shadow DOM内の要素を取得（getShadowElementのエイリアス）
 * @deprecated getShadowElement を使用してください
 */
export const getShadowContent = getShadowElement;

/**
 * Shadow DOM内のテキストコンテンツを取得
 */
export function getShadowText(component: HTMLElement, selector: string): string {
  const element = component.shadowRoot?.querySelector(selector);
  return element?.textContent?.trim() || '';
}

/**
 * テスト後のクリーンアップ（document.body全体をクリア）
 */
export function cleanup(): void {
  document.body.innerHTML = '';
}

/**
 * 特定の要素をDOMから削除
 */
export function cleanupTestElement(element: HTMLElement): void {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * カスタム要素の定義完了を待機（タグ名で指定）
 */
export async function waitForComponent(tagName: string): Promise<void> {
  await customElements.whenDefined(tagName);
  // requestAnimationFrameで2フレーム待機して初期化を確実に完了させる
  await new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

/**
 * カスタム要素の初期化完了を待機（要素で指定）
 */
export async function waitForCustomElement(element: HTMLElement): Promise<void> {
  if ('connectedCallback' in element && typeof element.connectedCallback === 'function') {
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }
}

/**
 * WebComponent definitionのstylesを配列で取得
 */
export function getDefinitionStyles(definition: {
  styles?: string | CSSStyleSheet | (string | CSSStyleSheet)[];
}): Array<string | CSSStyleSheet> {
  if (!definition.styles) return [];
  return Array.isArray(definition.styles) ? definition.styles : [definition.styles];
}

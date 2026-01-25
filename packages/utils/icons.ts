/**
 * 共通SVGアイコン定数モジュール
 *
 * DADS準拠のアイコンパスを一元管理し、DRY原則に従う。
 * 各コンポーネントやストーリーで繰り返し定義されていたSVGを共通化。
 */

/**
 * アイコンのSVGパス定義
 */
export const iconPaths = {
  /**
   * DADSダミーアイコン（斜線パターン）
   * 作例やプレースホルダーに使用
   */
  dummy:
    'M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z',

  /**
   * チェックマーク
   * 選択状態、完了状態の表示に使用
   */
  checkmark: 'M9 16.2 4.8 12l1.4-1.4L9 13.4 17.8 4.6 19.2 6 9 16.2Z',

  /**
   * 編集（鉛筆）アイコン
   */
  edit: 'M3 17.3V21h3.7l10.9-10.9-3.7-3.7L3 17.3Zm18.7-11.6c.4-.4.4-1 0-1.4L19.7 2.3c-.4-.4-1-.4-1.4 0l-1.8 1.8 3.7 3.7 1.5-1.1Z',

  /**
   * ダウンロードアイコン
   */
  download: 'M5 20h14v-2H5v2Zm7-18v10.2l3.6-3.6L17 10l-5 5-5-5 1.4-1.4L11 12.2V2h1Z',

  /**
   * 複製（コピー）アイコン
   */
  duplicate:
    'M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1Zm4 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H8V7h12v14Z',

  /**
   * 削除（ゴミ箱）アイコン
   */
  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z',

  /**
   * 開閉矢印（キャレット）アイコン
   * ドロップダウン、アコーディオンに使用
   */
  caret: 'M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z',

  /**
   * 新規タブで開くアイコン
   * 外部リンクの表示に使用
   * Note: 24x24 viewBox用パス
   */
  externalLink:
    'M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm5 16H5V5h6V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6h-2v6z',

  /**
   * 検索（虫眼鏡）アイコン
   */
  search:
    'm21 20.5-6-6a7.4 7.4 0 0 0 1.9-5A7.4 7.4 0 0 0 9.5 2 7.5 7.5 0 1 0 14 15.5l6 6 1-1ZM3.5 9.5a6 6 0 0 1 6-6 6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6Z',
} as const;

export type IconName = keyof typeof iconPaths;

/**
 * SVGアイコンを生成する
 *
 * @param name アイコン名
 * @param size アイコンサイズ（デフォルト: 20）
 * @returns SVG文字列
 *
 * @example
 * ```typescript
 * const svg = createIcon('checkmark', 24);
 * // <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="..."/></svg>
 * ```
 */
export function createIcon(name: IconName, size = 20): string {
  const path = iconPaths[name];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="${path}"/></svg>`;
}

/**
 * slot属性付きSVGアイコンを生成する
 *
 * @param name アイコン名
 * @param slot スロット名（例: "icon", "start-icon", "end-icon"）
 * @param size アイコンサイズ（デフォルト: 20）
 * @returns SVG文字列
 *
 * @example
 * ```typescript
 * const svg = createIconWithSlot('dummy', 'icon', 24);
 * // <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="..."/></svg>
 * ```
 */
export function createIconWithSlot(name: IconName, slot: string, size = 20): string {
  const path = iconPaths[name];
  return `<svg slot="${slot}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true"><path d="${path}"/></svg>`;
}

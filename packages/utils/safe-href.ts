/**
 * href の安全性チェック
 *
 * 許可:
 * - #
 * - / で始まる絶対パス
 * - # で始まるフラグメント
 * - ./ または ../ で始まる相対パス
 * - http/https
 * - mailto
 * - tel
 */
export function isSafeHref(href: string): boolean {
  return (
    href === '#' ||
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('./') ||
    href.startsWith('../') ||
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href) ||
    /^tel:/i.test(href)
  );
}

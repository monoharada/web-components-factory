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
export function isSafeHref(href) {
    const value = href.trim();
    if (value === '')
        return false;
    return (value === '#' ||
        value.startsWith('/') ||
        value.startsWith('#') ||
        value.startsWith('./') ||
        value.startsWith('../') ||
        /^https?:\/\//i.test(value) ||
        /^mailto:/i.test(value) ||
        /^tel:/i.test(value));
}

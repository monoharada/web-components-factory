// dom.ts
// TypeScript port of dom.js
export const isNotWhitespace = (value) => value.nodeType !== Node.TEXT_NODE || !!value.nodeValue?.trim().length;
/**
 * スロットにコンテンツが割り当てられているかを判定
 * 空白のみのテキストノードは除外される
 *
 * @param slot - 判定対象のスロット要素
 * @returns コンテンツがある場合はtrue
 */
export function hasSlotContent(slot) {
    if (!slot)
        return false;
    return slot.assignedNodes().filter(isNotWhitespace).length > 0;
}

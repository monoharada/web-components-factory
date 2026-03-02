/**
 * @module figma-export/figma-post-process
 * Figma HTML-to-Design 変換器で正しく変換されない CSS プロパティを
 * 変換可能な形式に書き換える後処理ユーティリティ。
 *
 * 戦略: 計算済みスタイルが大量にある既存要素のスタイル修正は避ける。
 * Figma パーサーは競合するプロパティを正しく解決できないため、
 * 最小限のスタイルだけを持つ新規 DOM 要素を挿入して視覚表現を再現する。
 *
 * 対象:
 * - text-decoration: underline → 新規 div (background-color) で下線を再現
 * - outline + box-shadow → 新規 div (background-color) でフォーカスリングを再現
 */
/**
 * フラット化済み HTML 要素に Figma 変換向けの後処理を適用する。
 *
 * @param el - flattenElementToLightDom() の出力
 * @param state - 状態ラベル
 * @returns 後処理済みの HTML 要素（元の要素が変更される場合あり）
 */
export function postProcessForFigma(el, state) {
    // height 関連プロパティを除去（テキスト折り返しによるオーバーフロー防止）
    relaxFixedHeights(el);
    // text-decoration: underline → 下線用 div を挿入
    insertUnderlineElements(el);
    // focus-visible 状態: outline + box-shadow → フォーカスリング用 div を挿入
    if (state === 'focus-visible') {
        return insertFocusRingElements(el);
    }
    return el;
}
// ─── 画像の data URI 変換 ───
/**
 * 対象要素内の全 <img> を canvas 経由で data URI に変換する。
 * flattenElementToLightDom() の前に呼び出す（ブラウザコンテキスト必須）。
 */
export function convertImagesToDataUri(root) {
    const images = root.querySelectorAll('img');
    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.complete || img.naturalWidth === 0)
            continue;
        // 既に data URI の場合はスキップ
        if (img.src.startsWith('data:'))
            continue;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                continue;
            ctx.drawImage(img, 0, 0);
            const dataUri = canvas.toDataURL('image/png');
            img.src = dataUri;
        }
        catch {
            // CORS エラー等は無視（画像が取れないだけ）
        }
    }
}
// ─── height → min-height 変換 ───
/** replaced 要素: height を維持する必要がある */
const REPLACED_TAGS = new Set(['img', 'svg', 'video', 'canvas', 'input', 'textarea', 'select', 'iframe']);
/**
 * 非 replaced 要素から height / block-size を完全除去する。
 *
 * Figma HTML-to-Design は内部でHTMLを再レンダリングするため、
 * 固定 height があるとテキスト折り返し時にコンテナが拡張されない。
 * height を除去すれば、Figmaの内部レンダラーがコンテンツベースで
 * 高さを計算し、テキスト重なりが解消される。
 *
 * max-height / min-height も除去して、レンダラーに自由な計算を委ねる。
 */
function relaxFixedHeights(el) {
    const tag = el.tagName.toLowerCase();
    // replaced 要素、Figma 後処理要素はスキップ
    if (REPLACED_TAGS.has(tag) || el.hasAttribute('data-figma-ring') || el.hasAttribute('data-figma-underline')) {
        return;
    }
    // height 関連プロパティを全て除去
    for (const prop of ['height', 'block-size', 'min-height', 'min-block-size', 'max-height', 'max-block-size']) {
        el.style.removeProperty(prop);
    }
    // 子要素を再帰処理
    for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if (child instanceof HTMLElement) {
            relaxFixedHeights(child);
        }
    }
}
// ─── text-decoration: underline → background-color div ───
/**
 * ツリー内で text-decoration: underline を持つ要素を探し、
 * テキスト直下に下線用の div を挿入する。
 *
 * 既存要素のスタイルは変更しない。Figma が確実に変換できる
 * background-color + height の新規要素で下線を再現する。
 */
function insertUnderlineElements(el) {
    processUnderlineRecursive(el);
}
function processUnderlineRecursive(el) {
    const td = el.style.getPropertyValue('text-decoration');
    if (td.includes('underline')) {
        // 下線色を抽出
        const colorMatch = td.match(/rgba?\([^)]+\)/);
        const color = colorMatch ? colorMatch[0] : 'rgb(255, 255, 255)';
        // text-decoration を none に
        el.style.setProperty('text-decoration', 'none');
        // テキストを含む最も内側の要素を探す
        const textContainer = findTextContainer(el);
        if (textContainer) {
            const doc = el.ownerDocument;
            // 下線用 div: background-color + height のみ（Figma 確実対応）
            const underlineDiv = doc.createElement('div');
            underlineDiv.setAttribute('data-figma-underline', 'true');
            underlineDiv.style.cssText = [
                `background-color: ${color}`,
                'height: 1px',
                'width: 100%',
                'margin-top: 2px',
            ].join('; ');
            // テキスト要素の直後に挿入
            const parent = textContainer.parentElement;
            if (parent && parent !== el) {
                // テキスト要素が子要素の場合、その後に挿入
                parent.insertBefore(underlineDiv, textContainer.nextSibling);
            }
            else {
                // テキスト要素がルートの場合、末尾に追加
                textContainer.appendChild(underlineDiv);
            }
        }
    }
    // 子要素を再帰処理
    for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if (child instanceof HTMLElement && !child.hasAttribute('data-figma-underline')) {
            processUnderlineRecursive(child);
        }
    }
}
/**
 * テキストコンテンツを含む最も内側の要素を返す。
 */
function findTextContainer(el) {
    for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
            return el;
        }
    }
    for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if (child instanceof HTMLElement) {
            const found = findTextContainer(child);
            if (found)
                return found;
        }
    }
    return null;
}
// ─── outline + box-shadow → background-color div でフォーカスリング再現 ───
/**
 * focus-visible 状態のフォーカスリングを Figma 対応形式に変換する。
 *
 * outline と box-shadow (spread-only) を検出し、
 * background-color を持つラッパー div で視覚的にリングを再現する。
 *
 * 構造:
 *   <div data-figma-ring="outer" style="background-color: black; padding: 4px; ...">
 *     <div data-figma-ring="inner" style="background-color: yellow; padding: 2px; ...">
 *       <button style="...（outline/box-shadow除去）...">
 *     </div>
 *   </div>
 */
function insertFocusRingElements(el) {
    // outline を持つ要素を探す
    const target = findOutlineElement(el);
    if (!target)
        return el;
    const outlineWidth = target.style.getPropertyValue('outline-width');
    const outlineColor = target.style.getPropertyValue('outline-color');
    const outlineOffset = target.style.getPropertyValue('outline-offset');
    const borderRadius = target.style.getPropertyValue('border-radius');
    if (!outlineWidth || outlineWidth === '0px')
        return el;
    // box-shadow から spread-only shadow を検出
    const boxShadow = target.style.getPropertyValue('box-shadow');
    const spreadShadow = parseSpreadOnlyShadow(boxShadow);
    const doc = target.ownerDocument;
    // 元要素から outline と box-shadow を除去
    target.style.setProperty('outline', 'none');
    if (spreadShadow) {
        target.style.setProperty('box-shadow', 'none');
    }
    // 外側リング: outline を background-color + padding で再現
    const outerRing = doc.createElement('div');
    outerRing.setAttribute('data-figma-ring', 'outer');
    outerRing.style.cssText = [
        `background-color: ${outlineColor}`,
        `padding: ${outlineWidth}`,
        'display: inline-block',
        borderRadius ? `border-radius: ${addPx(borderRadius, parsePx(outlineWidth) + parsePx(outlineOffset))}` : '',
    ].filter(Boolean).join('; ');
    if (spreadShadow) {
        // 中間リング: box-shadow spread を background-color + padding で再現
        const innerRing = doc.createElement('div');
        innerRing.setAttribute('data-figma-ring', 'inner');
        innerRing.style.cssText = [
            `background-color: ${spreadShadow.color}`,
            `padding: ${spreadShadow.spread}`,
            'display: inline-block',
            borderRadius ? `border-radius: ${addPx(borderRadius, parsePx(spreadShadow.spread))}` : '',
        ].filter(Boolean).join('; ');
        // outline-offset を gap として再現
        if (outlineOffset && outlineOffset !== '0px') {
            const gapDiv = doc.createElement('div');
            gapDiv.setAttribute('data-figma-ring', 'gap');
            gapDiv.style.cssText = [
                'background-color: transparent',
                `padding: ${outlineOffset}`,
                'display: inline-block',
                borderRadius ? `border-radius: ${addPx(borderRadius, parsePx(outlineOffset))}` : '',
            ].filter(Boolean).join('; ');
            // target を DOM ツリーから差し替え
            const placeholder = doc.createComment('figma-ring');
            target.parentElement?.insertBefore(placeholder, target);
            gapDiv.appendChild(target);
            innerRing.appendChild(gapDiv);
            outerRing.appendChild(innerRing);
            placeholder.parentNode?.replaceChild(outerRing, placeholder);
        }
        else {
            const placeholder = doc.createComment('figma-ring');
            target.parentElement?.insertBefore(placeholder, target);
            innerRing.appendChild(target);
            outerRing.appendChild(innerRing);
            placeholder.parentNode?.replaceChild(outerRing, placeholder);
        }
    }
    else {
        const placeholder = doc.createComment('figma-ring');
        target.parentElement?.insertBefore(placeholder, target);
        outerRing.appendChild(target);
        placeholder.parentNode?.replaceChild(outerRing, placeholder);
    }
    return el;
}
/**
 * ツリー内で outline-style が none 以外の要素を探す
 */
function findOutlineElement(el) {
    const style = el.style.getPropertyValue('outline-style');
    if (style && style !== 'none')
        return el;
    for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if (child instanceof HTMLElement) {
            const found = findOutlineElement(child);
            if (found)
                return found;
        }
    }
    return null;
}
/**
 * box-shadow 値から spread-only shadow（x=0, y=0, blur=0）を検出
 * 例: "rgb(255, 212, 61) 0px 0px 0px 2px" → { color, spread }
 */
function parseSpreadOnlyShadow(value) {
    if (!value || value === 'none')
        return null;
    const colorMatch = value.match(/^(rgba?\([^)]+\))\s+/);
    if (!colorMatch)
        return null;
    const color = colorMatch[1];
    const rest = value.slice(colorMatch[0].length).trim();
    const parts = rest.split(/\s+/);
    if (parts.length < 4)
        return null;
    const [offsetX, offsetY, blur, spread] = parts;
    if (offsetX === '0px' && offsetY === '0px' && blur === '0px' && spread !== '0px') {
        return { color, spread };
    }
    return null;
}
/**
 * "8px" のような CSS px 値をパースして数値を返す
 */
function parsePx(value) {
    const match = value.match(/^(-?\d+(?:\.\d+)?)px$/);
    return match ? Number(match[1]) : 0;
}
/**
 * border-radius の px 値に加算する
 */
function addPx(radius, add) {
    const base = parsePx(radius);
    return `${base + add}px`;
}

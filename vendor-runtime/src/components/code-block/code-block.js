/**
 * @module code-block
 * HTMLコード表示（コピー機能つき）コンポーネント
 * @version 0.1.0
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsCodeBlock_instances, _DadsCodeBlock_copyResult, _DadsCodeBlock_clearTimer, _DadsCodeBlock_codeOverride, _DadsCodeBlock_readTemplateHtml, _DadsCodeBlock_syncCode, _DadsCodeBlock_setCopyResult, _DadsCodeBlock_syncStatus, _DadsCodeBlock_onCopy;
import { css, html, WebComponent } from '../../core/web-components.js';
function isElement(v) {
    return v instanceof Element;
}
function dedent(raw) {
    const lines = raw.replace(/\r\n?/g, '\n').split('\n');
    // Trim leading / trailing empty lines.
    while (lines.length > 0 && lines[0].trim() === '')
        lines.shift();
    while (lines.length > 0 && lines[lines.length - 1].trim() === '')
        lines.pop();
    // Find minimum indentation.
    let minIndent = null;
    for (const line of lines) {
        if (line.trim() === '')
            continue;
        const m = line.match(/^[ \t]+/);
        const indent = m ? m[0].length : 0;
        minIndent = minIndent === null ? indent : Math.min(minIndent, indent);
    }
    if (!minIndent)
        return lines.join('\n');
    return lines.map((line) => (line.trim() === '' ? '' : line.slice(minIndent))).join('\n');
}
function normalizeCopyResult(v) {
    if (v === 'success' || v === 'error')
        return v;
    return 'idle';
}
async function copyToClipboard(text) {
    const nav = navigator;
    const writeText = nav.clipboard?.writeText;
    if (typeof writeText === 'function') {
        try {
            await writeText.call(nav.clipboard, text);
            return true;
        }
        catch {
            // continue to fallback
        }
    }
    // Fallback: execCommand('copy')
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    let ok = false;
    try {
        ok = document.execCommand('copy');
    }
    catch {
        ok = false;
    }
    finally {
        document.body.removeChild(ta);
    }
    return ok;
}
/**
 * HTMLコード表示（コピー機能つき）コンポーネント
 *
 * @customElement
 * @tagname dads-code-block
 *
 * @slot label - 左上ラベル（例: HTML）
 *
 * @csspart layout - 全体ラッパー
 * @csspart header - ヘッダー（ラベル + Copyボタン）
 * @csspart copy-button - Copyボタン
 * @csspart pre - コード領域（pre）
 * @csspart code - コード要素（code）
 * @csspart status - Copy結果の通知領域（aria-live）
 */
export class DadsCodeBlock extends WebComponent {
    constructor() {
        super(...arguments);
        _DadsCodeBlock_instances.add(this);
        _DadsCodeBlock_copyResult.set(this, 'idle');
        _DadsCodeBlock_clearTimer.set(this, null);
        _DadsCodeBlock_codeOverride.set(this, null);
        _DadsCodeBlock_onCopy.set(this, async () => {
            const codeEl = this.refs?.code;
            if (!isElement(codeEl))
                return;
            const text = codeEl.textContent ?? '';
            if (text.trim() === '')
                return;
            if (__classPrivateFieldGet(this, _DadsCodeBlock_clearTimer, "f") !== null) {
                window.clearTimeout(__classPrivateFieldGet(this, _DadsCodeBlock_clearTimer, "f"));
                __classPrivateFieldSet(this, _DadsCodeBlock_clearTimer, null, "f");
            }
            const ok = await copyToClipboard(text);
            __classPrivateFieldGet(this, _DadsCodeBlock_instances, "m", _DadsCodeBlock_setCopyResult).call(this, ok ? 'success' : 'error');
            __classPrivateFieldSet(this, _DadsCodeBlock_clearTimer, window.setTimeout(() => {
                __classPrivateFieldSet(this, _DadsCodeBlock_clearTimer, null, "f");
                __classPrivateFieldGet(this, _DadsCodeBlock_instances, "m", _DadsCodeBlock_setCopyResult).call(this, 'idle');
            }, 1500), "f");
        });
    }
    setCode(code) {
        __classPrivateFieldSet(this, _DadsCodeBlock_codeOverride, code, "f");
        __classPrivateFieldGet(this, _DadsCodeBlock_instances, "m", _DadsCodeBlock_syncCode).call(this);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _DadsCodeBlock_instances, "m", _DadsCodeBlock_syncCode).call(this);
        __classPrivateFieldGet(this, _DadsCodeBlock_instances, "m", _DadsCodeBlock_setCopyResult).call(this, 'idle');
        const copyBtn = this.refs?.copy;
        if (isElement(copyBtn)) {
            copyBtn.addEventListener('click', __classPrivateFieldGet(this, _DadsCodeBlock_onCopy, "f"));
        }
    }
    disconnectedCallback() {
        const copyBtn = this.refs?.copy;
        if (isElement(copyBtn)) {
            copyBtn.removeEventListener('click', __classPrivateFieldGet(this, _DadsCodeBlock_onCopy, "f"));
        }
        if (__classPrivateFieldGet(this, _DadsCodeBlock_clearTimer, "f") !== null) {
            window.clearTimeout(__classPrivateFieldGet(this, _DadsCodeBlock_clearTimer, "f"));
            __classPrivateFieldSet(this, _DadsCodeBlock_clearTimer, null, "f");
        }
    }
}
_DadsCodeBlock_copyResult = new WeakMap(), _DadsCodeBlock_clearTimer = new WeakMap(), _DadsCodeBlock_codeOverride = new WeakMap(), _DadsCodeBlock_onCopy = new WeakMap(), _DadsCodeBlock_instances = new WeakSet(), _DadsCodeBlock_readTemplateHtml = function _DadsCodeBlock_readTemplateHtml() {
    const template = this.querySelector('template');
    if (template instanceof HTMLTemplateElement)
        return template.innerHTML;
    return this.textContent ?? '';
}, _DadsCodeBlock_syncCode = function _DadsCodeBlock_syncCode() {
    const codeEl = this.refs?.code;
    if (!isElement(codeEl))
        return;
    const raw = __classPrivateFieldGet(this, _DadsCodeBlock_codeOverride, "f") ?? __classPrivateFieldGet(this, _DadsCodeBlock_instances, "m", _DadsCodeBlock_readTemplateHtml).call(this);
    codeEl.textContent = dedent(raw);
}, _DadsCodeBlock_setCopyResult = function _DadsCodeBlock_setCopyResult(next) {
    __classPrivateFieldSet(this, _DadsCodeBlock_copyResult, normalizeCopyResult(next), "f");
    this.setAttribute('data-copy-result', __classPrivateFieldGet(this, _DadsCodeBlock_copyResult, "f"));
    __classPrivateFieldGet(this, _DadsCodeBlock_instances, "m", _DadsCodeBlock_syncStatus).call(this);
}, _DadsCodeBlock_syncStatus = function _DadsCodeBlock_syncStatus() {
    const statusEl = this.refs?.status;
    if (!isElement(statusEl))
        return;
    switch (__classPrivateFieldGet(this, _DadsCodeBlock_copyResult, "f")) {
        case 'success':
            statusEl.textContent = 'Copied';
            break;
        case 'error':
            statusEl.textContent = 'Copy failed';
            break;
        default:
            statusEl.textContent = '';
    }
};
DadsCodeBlock.version = '0.1.0';
DadsCodeBlock.definition = {
    name: 'dads-code-block',
    template: html `
      <div part="layout">
        <div part="header">
          <div part="label">
            <slot name="label">HTML</slot>
          </div>
          <button id="copy" part="copy-button" type="button">Copy</button>
        </div>
        <pre part="pre"><code id="code" part="code"></code></pre>
        <div id="status" part="status" aria-live="polite"></div>
      </div>
    `,
    styles: css `
      :host {
        display: block;
        min-width: 0;
      }

      :host {
        --wc-code-block-border-color: var(--color-border-light, #e5e7eb);
        --wc-code-block-border-radius: 12px;
        --wc-code-block-background: var(--color-background-hover, #f8fafc);
        --wc-code-block-header-background: var(--color-background-secondary, #ffffff);
        --wc-code-block-text-color: var(--color-text-primary, #0f172a);
        --wc-code-block-muted-color: var(--color-text-secondary, #475569);
        --wc-code-block-font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
        --wc-code-block-font-size: 12px;
        --wc-code-block-line-height: 1.6;
        --wc-code-block-padding-x: 12px;
        --wc-code-block-padding-y: 10px;
      }

      [part="layout"] {
        border: 1px solid var(--wc-code-block-border-color);
        border-radius: var(--wc-code-block-border-radius);
        background: var(--wc-code-block-background);
        overflow: hidden;
        min-width: 0;
      }

      [part="header"] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px var(--wc-code-block-padding-x);
        background: var(--wc-code-block-header-background);
        border-bottom: 1px solid var(--wc-code-block-border-color);
      }

      [part="label"] {
        font-size: 12px;
        font-weight: 600;
        color: var(--wc-code-block-muted-color);
      }

      [part="copy-button"] {
        font: inherit;
        font-size: 12px;
        line-height: 1;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid var(--wc-code-block-border-color);
        background: #fff;
        color: var(--wc-code-block-text-color);
        cursor: pointer;
      }

      [part="copy-button"]:focus-visible {
        outline: 0.25rem solid var(--dads-focus-outline-color, #0f172a);
        outline-offset: 0.125rem;
        box-shadow: 0 0 0 0.125rem var(--dads-focus-ring-color, #ffd43d);
      }

      [part="pre"] {
        margin: 0;
        padding: var(--wc-code-block-padding-y) var(--wc-code-block-padding-x);
        overflow-x: auto;
        overflow-y: auto;
        min-width: 0;
      }

      [part="code"] {
        display: block;
        white-space: pre;
        font-family: var(--wc-code-block-font-family);
        font-size: var(--wc-code-block-font-size);
        line-height: var(--wc-code-block-line-height);
        color: var(--wc-code-block-text-color);
      }

      [part="status"] {
        padding: 6px var(--wc-code-block-padding-x);
        font-size: 12px;
        color: var(--wc-code-block-muted-color);
      }

      :host([data-copy-result="idle"]) [part="status"] {
        display: none;
      }
    `,
};

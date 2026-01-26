/**
 * @module code-block
 * HTMLコード表示（コピー機能つき）コンポーネント
 * @version 0.1.0
 */

import { css, html, WebComponent } from '../../core/web-components.js';

function isElement(v: unknown): v is Element {
  return v instanceof Element;
}

function dedent(raw: string): string {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');

  // Trim leading / trailing empty lines.
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

  // Find minimum indentation.
  let minIndent: number | null = null;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const m = line.match(/^[ \t]+/);
    const indent = m ? m[0].length : 0;
    minIndent = minIndent === null ? indent : Math.min(minIndent, indent);
  }

  if (!minIndent) return lines.join('\n');

  return lines.map((line) => (line.trim() === '' ? '' : line.slice(minIndent))).join('\n');
}

type CopyResult = 'idle' | 'success' | 'error';

function normalizeCopyResult(v: unknown): CopyResult {
  if (v === 'success' || v === 'error') return v;
  return 'idle';
}

async function copyToClipboard(text: string): Promise<boolean> {
  const nav = navigator as Navigator & { clipboard?: { writeText?: (value: string) => Promise<void> } };
  const writeText = nav.clipboard?.writeText;
  if (typeof writeText === 'function') {
    try {
      await writeText.call(nav.clipboard, text);
      return true;
    } catch {
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
  } catch {
    ok = false;
  } finally {
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
  static readonly version = '0.1.0';

  static definition = {
    name: 'dads-code-block',
    template: html`
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
    styles: css`
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

  #copyResult: CopyResult = 'idle';
  #clearTimer: number | null = null;
  #codeOverride: string | null = null;

  setCode(code: string): void {
    this.#codeOverride = code;
    this.#syncCode();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#syncCode();
    this.#setCopyResult('idle');

    const copyBtn = this.refs?.copy;
    if (isElement(copyBtn)) {
      copyBtn.addEventListener('click', this.#onCopy);
    }
  }

  disconnectedCallback(): void {
    const copyBtn = this.refs?.copy;
    if (isElement(copyBtn)) {
      copyBtn.removeEventListener('click', this.#onCopy);
    }
    if (this.#clearTimer !== null) {
      window.clearTimeout(this.#clearTimer);
      this.#clearTimer = null;
    }
  }

  #readTemplateHtml(): string {
    const template = this.querySelector('template');
    if (template instanceof HTMLTemplateElement) return template.innerHTML;
    return this.textContent ?? '';
  }

  #syncCode(): void {
    const codeEl = this.refs?.code;
    if (!isElement(codeEl)) return;

    const raw = this.#codeOverride ?? this.#readTemplateHtml();
    codeEl.textContent = dedent(raw);
  }

  #setCopyResult(next: CopyResult): void {
    this.#copyResult = normalizeCopyResult(next);
    this.setAttribute('data-copy-result', this.#copyResult);
    this.#syncStatus();
  }

  #syncStatus(): void {
    const statusEl = this.refs?.status;
    if (!isElement(statusEl)) return;

    switch (this.#copyResult) {
      case 'success':
        statusEl.textContent = 'Copied';
        break;
      case 'error':
        statusEl.textContent = 'Copy failed';
        break;
      default:
        statusEl.textContent = '';
    }
  }

  #onCopy = async (): Promise<void> => {
    const codeEl = this.refs?.code;
    if (!isElement(codeEl)) return;

    const text = codeEl.textContent ?? '';
    if (text.trim() === '') return;

    if (this.#clearTimer !== null) {
      window.clearTimeout(this.#clearTimer);
      this.#clearTimer = null;
    }

    const ok = await copyToClipboard(text);
    this.#setCopyResult(ok ? 'success' : 'error');

    this.#clearTimer = window.setTimeout(() => {
      this.#clearTimer = null;
      this.#setCopyResult('idle');
    }, 1500);
  };
}

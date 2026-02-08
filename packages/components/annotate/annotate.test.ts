import { describe, it, expect, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  cleanup,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';

function domRect(left: number, top: number, width: number, height: number): DOMRect {
  return ({ left, top, width, height, right: left + width, bottom: top + height } as DOMRect);
}

function stubBcr(el: Element, rect: DOMRect) {
  (el as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = () => rect;
}

function stubClientRects(el: HTMLElement) {
  (el as unknown as { getClientRects: () => DOMRect[] }).getClientRects = () => [el.getBoundingClientRect()];
}

function stubTagBcr(tagEl: HTMLElement, width = 80, height = 40) {
  tagEl.getBoundingClientRect = () => {
    const leftRaw = Number.parseFloat(tagEl.style.left || '0') || 0;
    const topRaw = Number.parseFloat(tagEl.style.top || '0') || 0;
    const transform = tagEl.style.transform || '';
    const translate = transform.match(/translate\(\s*([-\d.]+)%\s*,\s*([-\d.]+)%\s*\)/);
    const translateX = translate ? Number.parseFloat(translate[1] ?? '0') : 0;
    const translateY = translate ? Number.parseFloat(translate[2] ?? '0') : 0;

    const dx = Number.isFinite(translateX) ? (translateX / 100) * width : 0;
    const dy = Number.isFinite(translateY) ? (translateY / 100) * height : 0;
    const left = leftRaw + dx;
    const top = topRaw + dy;
    return domRect(left, top, width, height);
  };
}

function waitForDoubleRaf(): Promise<void> {
  return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

describe('DadsAnnotate', () => {
  afterEach(() => {
    cleanup();
    try {
      window.localStorage.removeItem('dads:a11y');
    } catch {
      // ignore
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('CEMロード失敗時でも無限refreshしない', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    window.localStorage.setItem('dads:a11y', '1');

    let microtaskCalls = 0;
    const origQueueMicrotask = globalThis.queueMicrotask;
    vi.stubGlobal('queueMicrotask', (cb: VoidFunction) => {
      microtaskCalls += 1;
      return origQueueMicrotask(cb);
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) }) as unknown as Response),
    );

    const el = renderWebComponent(`
      <a11y-annotate>
        <div id="target">Target</div>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');
    expect(el).toBeInTheDocument();

    // microtaskが連鎖している場合、短時間で呼び出し回数が増え続ける
    await new Promise((r) => setTimeout(r, 50));
    expect(microtaskCalls).toBeLessThan(20);

    // CEM取得は1回に抑えられる（失敗しても再試行ループしない）
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('ラップした要素を表示し、6カテゴリの枠を出す', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    const el = renderWebComponent(`
      <a11y-annotate>
        <div id="target">Target</div>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');
    expect(el).toBeInTheDocument();

    const title = el.querySelector('[part="panel-title"]');
    expect(title?.textContent).toContain('アクセシビリティ注釈');

    const headings = el.querySelectorAll('section > h3');
    expect(headings.length).toBe(6);
  });

  it('メタデータ（a11yAnnotations）を読み、コールアウトとスナップショットを表示する', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTarget extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'テスト用',
        categories: {},
        callouts: [
          {
            id: 'callout-1',
            title: 'ラベル',
            target: { selector: '#anchor', scope: 'light' },
          },
        ],
      } as const;
    }
    const tagName = 'test-a11y-target';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTarget);
    }

    const el = renderWebComponent(`
      <a11y-annotate>
        <${tagName}>
          <div id="anchor" aria-label="Before"></div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const subtitle = el.querySelector('[part="panel-subtitle"]');
    expect(subtitle?.textContent).toContain('test-a11y-target');
    expect(subtitle?.textContent).toContain('テスト用');

    const marker = el.querySelector('.callout-tag-number');
    expect(marker).toBeTruthy();
    expect(marker?.textContent).toBe('1');

    await waitFor(() => {
      expect(el.textContent).toContain('aria-label: Before');
    });

    const anchor = el.querySelector('#anchor');
    anchor?.setAttribute('aria-label', 'After');

    await waitFor(() => {
      expect(el.textContent).toContain('aria-label: After');
    });
  });

  it('10件以上のコールアウトでも2桁番号が表示される', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    const manyCallouts = Array.from({ length: 10 }, (_, i) => ({
      id: `callout-${i + 1}`,
      title: `Anchor ${i + 1}`,
      target: { selector: `#anchor-${i + 1}`, scope: 'light' },
    })) as const;

    class TestTargetManyCallouts extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: '大量コールアウト',
        categories: {},
        callouts: manyCallouts,
      } as const;
    }
    const tagName = 'test-a11y-target-many-callouts';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetManyCallouts);
    }

    const anchors = Array.from(
      { length: 10 },
      (_, i) => `<div id="anchor-${i + 1}" aria-label="Anchor ${i + 1}">x</div>`,
    ).join('');

    const el = renderWebComponent(`
      <a11y-annotate>
        <${tagName}>
          ${anchors}
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const panelNumbers = Array.from(el.querySelectorAll('.callout-number')).map((node) =>
      node.textContent?.trim(),
    );
    expect(panelNumbers).toContain('10');

    const overlayNumbers = Array.from(el.querySelectorAll('.callout-tag-number')).map((node) =>
      node.textContent?.trim(),
    );
    expect(overlayNumbers).toContain('10');
  });

  it('SVG要素をコールアウト対象にできる', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetSvg extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'SVGテスト',
        categories: {},
        callouts: [
          {
            id: 'svg-callout',
            title: 'アイコン',
            label: 'アイコン',
            target: { selector: '#icon', scope: 'light' },
          },
        ],
      } as const;
    }

    const tagName = 'test-a11y-target-svg';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetSvg);
    }

    const el = renderWebComponent(`
      <a11y-annotate>
        <test-a11y-target-svg>
          <svg id="icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z"></path>
          </svg>
        </test-a11y-target-svg>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const marker = el.querySelector('.callout-tag-number');
    expect(marker?.textContent).toBe('1');

    const tag = el.querySelector('.callout-tag code');
    expect(tag?.textContent).toBe('アイコン');
  });

  it('ラベルが左右レーンに整列し、線が要素の中心寄りまで伸びる', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetLineEndpoint extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Line endpoint',
        categories: {},
        callouts: [
          {
            id: 'anchor',
            title: 'Anchor',
            placement: 'top-left',
            target: { selector: '#anchor', scope: 'light' },
          },
        ],
      } as const;
    }
    const tagName = 'test-a11y-target-line-endpoint';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetLineEndpoint);
    }

    const el = renderWebComponent(`
      <a11y-annotate
        style="
          --a11y-annotate-callout-line-inset: 2px;
          --a11y-annotate-callout-line-inset-ratio: 0.35;
          --a11y-annotate-callout-anchor-corner-margin: 10px;
          --a11y-annotate-callout-lane-offset: 24px;
        "
      >
        <${tagName}>
          <div id="anchor">x</div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const layer = el.querySelector('[part="callout-layer"]') as HTMLElement | null;
    const tagEl = el.querySelector('.callout-tag') as HTMLElement | null;
    const line = el.querySelector('.callout-line') as SVGPathElement | null;
    const anchor = el.querySelector('#anchor') as HTMLElement | null;

    expect(layer).toBeTruthy();
    expect(tagEl).toBeTruthy();
    expect(line).toBeTruthy();
    expect(anchor).toBeTruthy();

    // Happy DOM ではレイアウトが 0 になりがちなので、geometry を固定する。
    // tagRect は style/transform を考慮したスタブにする（レーン整列の検証用）。
    stubBcr(layer!, domRect(0, 0, 400, 400));
    stubTagBcr(tagEl!);
    stubBcr(anchor!, domRect(200, 200, 100, 40));
    stubClientRects(anchor!);

    // layout を再計算させる
    window.dispatchEvent(new Event('resize'));
    await waitForDoubleRaf();

    await waitFor(() => {
      expect(line!.getAttribute('d')).toBeTruthy();
    });
    const d = line!.getAttribute('d') ?? '';

    // placement: top-left なので left lane へドックする（transform でY中心揃え）。
    expect(tagEl!.style.left).toBe('176px');
    expect(tagEl!.style.transform).toBe('translate(-100%, -50%)');

    // 境界交点(x=200)から、minDim(40)*ratio(0.35)=14px 内側へ入る (x=214) ことを期待する。
    expect(d).toContain('L 214 220');
  });

  it('callout-lane="top" ではラベルを上側レーンに配置する', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetTopLane extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Top lane',
        categories: {},
        callouts: [
          {
            id: 'anchor',
            title: 'Anchor',
            placement: 'top-left',
            target: { selector: '#anchor', scope: 'light' },
          },
        ],
      } as const;
    }

    const tagName = 'test-a11y-target-top-lane';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetTopLane);
    }

    const el = renderWebComponent(`
      <a11y-annotate callout-lane="top" style="--a11y-annotate-callout-lane-offset: 24px;">
        <${tagName}>
          <div id="anchor">x</div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const layer = el.querySelector('[part="callout-layer"]') as HTMLElement | null;
    const tagEl = el.querySelector('.callout-tag') as HTMLElement | null;
    const line = el.querySelector('.callout-line') as SVGPathElement | null;
    const anchor = el.querySelector('#anchor') as HTMLElement | null;

    expect(layer).toBeTruthy();
    expect(tagEl).toBeTruthy();
    expect(line).toBeTruthy();
    expect(anchor).toBeTruthy();

    stubBcr(layer!, domRect(0, 0, 400, 400));
    stubTagBcr(tagEl!);
    stubBcr(anchor!, domRect(200, 200, 100, 40));
    stubClientRects(anchor!);

    window.dispatchEvent(new Event('resize'));
    await waitForDoubleRaf();

    expect(tagEl!.style.transform).toBe('translate(-50%, -100%)');
    expect(tagEl!.style.left).toBe('250px');
    expect(tagEl!.style.top).toBe('176px');
    expect(Number.parseFloat(tagEl!.style.top)).toBeLessThan(200);
    expect(line!.getAttribute('d')).toBeTruthy();
  });

  it('右寄せコンポーネントではラベルが左レーンに固定される', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetRightAligned extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Right aligned',
        categories: {},
        callouts: [
          {
            id: 'a',
            title: 'A',
            placement: 'top-right',
            target: { selector: '#a', scope: 'light' },
          },
          {
            id: 'b',
            title: 'B',
            placement: 'bottom-right',
            target: { selector: '#b', scope: 'light' },
          },
        ],
      } as const;
    }
    const tagName = 'test-a11y-target-right-aligned';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetRightAligned);
    }

    const el = renderWebComponent(`
      <a11y-annotate style="--a11y-annotate-callout-lane-offset: 24px;">
        <${tagName}>
          <div id="a">x</div>
          <div id="b">y</div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const layer = el.querySelector('[part="callout-layer"]') as HTMLElement | null;
    const previewInner = el.querySelector('[part="preview-inner"]') as HTMLElement | null;
    const target = el.querySelector(tagName) as HTMLElement | null;

    const tagA = el.querySelector('[data-callout-id="a"] .callout-tag') as HTMLElement | null;
    const tagB = el.querySelector('[data-callout-id="b"] .callout-tag') as HTMLElement | null;
    const anchorA = el.querySelector('#a') as HTMLElement | null;
    const anchorB = el.querySelector('#b') as HTMLElement | null;

    expect(layer).toBeTruthy();
    expect(previewInner).toBeTruthy();
    expect(target).toBeTruthy();
    expect(tagA).toBeTruthy();
    expect(tagB).toBeTruthy();
    expect(anchorA).toBeTruthy();
    expect(anchorB).toBeTruthy();

    stubBcr(layer!, domRect(0, 0, 400, 400));
    stubBcr(previewInner!, domRect(0, 0, 300, 300));

    // 右寄せに見えるように、preview-inner 右端に寄った targetRect を返す。
    stubBcr(target!, domRect(220, 20, 80, 40));

    stubTagBcr(tagA!);
    stubTagBcr(tagB!);

    stubBcr(anchorA!, domRect(240, 120, 20, 20));
    stubClientRects(anchorA!);

    stubBcr(anchorB!, domRect(250, 220, 20, 20));
    stubClientRects(anchorB!);

    window.dispatchEvent(new Event('resize'));
    await waitForDoubleRaf();

    // placement が right 指定でも、右寄せコンポーネントでは left lane に固定する。
    expect(tagA!.style.transform).toBe('translate(-100%, -50%)');
    expect(tagB!.style.transform).toBe('translate(-100%, -50%)');
  });

  it('左寄せコンポーネントではラベルが右レーンに固定される', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetLeftAligned extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Left aligned',
        categories: {},
        callouts: [
          {
            id: 'a',
            title: 'A',
            placement: 'top-left',
            target: { selector: '#a', scope: 'light' },
          },
          {
            id: 'b',
            title: 'B',
            placement: 'bottom-left',
            target: { selector: '#b', scope: 'light' },
          },
        ],
      } as const;
    }
    const tagName = 'test-a11y-target-left-aligned';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetLeftAligned);
    }

    const el = renderWebComponent(`
      <a11y-annotate style="--a11y-annotate-callout-lane-offset: 24px;">
        <${tagName}>
          <div id="a">x</div>
          <div id="b">y</div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const layer = el.querySelector('[part="callout-layer"]') as HTMLElement | null;
    const previewInner = el.querySelector('[part="preview-inner"]') as HTMLElement | null;
    const target = el.querySelector(tagName) as HTMLElement | null;

    const tagA = el.querySelector('[data-callout-id="a"] .callout-tag') as HTMLElement | null;
    const tagB = el.querySelector('[data-callout-id="b"] .callout-tag') as HTMLElement | null;
    const anchorA = el.querySelector('#a') as HTMLElement | null;
    const anchorB = el.querySelector('#b') as HTMLElement | null;

    expect(layer).toBeTruthy();
    expect(previewInner).toBeTruthy();
    expect(target).toBeTruthy();
    expect(tagA).toBeTruthy();
    expect(tagB).toBeTruthy();
    expect(anchorA).toBeTruthy();
    expect(anchorB).toBeTruthy();

    stubBcr(layer!, domRect(0, 0, 400, 400));
    stubBcr(previewInner!, domRect(0, 0, 300, 300));

    // 左寄せに見えるように、preview-inner 左端に寄った targetRect を返す。
    stubBcr(target!, domRect(0, 20, 80, 40));

    stubTagBcr(tagA!);
    stubTagBcr(tagB!);

    stubBcr(anchorA!, domRect(40, 120, 20, 20));
    stubClientRects(anchorA!);

    stubBcr(anchorB!, domRect(50, 220, 20, 20));
    stubClientRects(anchorB!);

    window.dispatchEvent(new Event('resize'));
    await waitForDoubleRaf();

    // placement が left 指定でも、左寄せコンポーネントでは right lane に固定する。
    expect(tagA!.style.transform).toBe('translate(0, -50%)');
    expect(tagB!.style.transform).toBe('translate(0, -50%)');
  });

  it('コンポーネントの寄せ判定はコールアウト対象の散らばりに引きずられない', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetLaneAlignUsesTargetRect extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Lane align uses target rect',
        categories: {},
        callouts: [
          {
            id: 'left',
            title: 'Left',
            placement: 'top-left',
            target: { selector: '#left', scope: 'light' },
          },
          {
            id: 'right',
            title: 'Right',
            placement: 'top-right',
            target: { selector: '#right', scope: 'light' },
          },
        ],
      } as const;
    }
    const tagName = 'test-a11y-target-lane-align-uses-target-rect';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetLaneAlignUsesTargetRect);
    }

    const el = renderWebComponent(`
      <a11y-annotate style="--a11y-annotate-callout-lane-offset: 24px;">
        <${tagName}>
          <div id="left">x</div>
          <div id="right">y</div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const layer = el.querySelector('[part="callout-layer"]') as HTMLElement | null;
    const previewInner = el.querySelector('[part="preview-inner"]') as HTMLElement | null;
    const target = el.querySelector(tagName) as HTMLElement | null;

    const tagLeft = el.querySelector('[data-callout-id="left"] .callout-tag') as HTMLElement | null;
    const tagRight = el.querySelector('[data-callout-id="right"] .callout-tag') as HTMLElement | null;
    const anchorLeft = el.querySelector('#left') as HTMLElement | null;
    const anchorRight = el.querySelector('#right') as HTMLElement | null;

    expect(layer).toBeTruthy();
    expect(previewInner).toBeTruthy();
    expect(target).toBeTruthy();
    expect(tagLeft).toBeTruthy();
    expect(tagRight).toBeTruthy();
    expect(anchorLeft).toBeTruthy();
    expect(anchorRight).toBeTruthy();

    stubBcr(layer!, domRect(0, 0, 400, 400));
    stubBcr(previewInner!, domRect(0, 0, 300, 300));

    // コンポーネント自体は左寄せ（右側に大きく余白がある）だが、
    // callout 対象は左右に散らばっているケース。
    stubBcr(target!, domRect(0, 20, 80, 40));

    stubTagBcr(tagLeft!);
    stubTagBcr(tagRight!);

    stubBcr(anchorLeft!, domRect(10, 120, 20, 20));
    stubClientRects(anchorLeft!);

    // 右端付近に callout 対象があっても、レーン固定はコンポーネント寄せを優先する。
    stubBcr(anchorRight!, domRect(260, 120, 20, 20));
    stubClientRects(anchorRight!);

    window.dispatchEvent(new Event('resize'));
    await waitForDoubleRaf();

    // 左寄せなので right lane 固定（両方right）になる
    expect(tagLeft!.style.transform).toBe('translate(0, -50%)');
    expect(tagRight!.style.transform).toBe('translate(0, -50%)');
  });

  it('callout-boxはデフォルト非表示で、包含関係がある場合のみ表示される（auto）', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetAutoBox extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Box auto',
        categories: {},
        callouts: [
          {
            id: 'container',
            title: 'コンテナ',
            target: { selector: '#container', scope: 'light' },
          },
          {
            id: 'child',
            title: '子要素',
            target: { selector: '#child', scope: 'light' },
          },
        ],
      } as const;
    }
    const tagName = 'test-a11y-target-auto-box';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetAutoBox);
    }

    const el = renderWebComponent(`
      <a11y-annotate>
        <${tagName}>
          <div id="container">
            <div id="child" aria-label="Child">x</div>
          </div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const containerBox = el.querySelector(
      '[data-callout-id="container"] .callout-box',
    ) as HTMLElement | null;
    const childBox = el.querySelector(
      '[data-callout-id="child"] .callout-box',
    ) as HTMLElement | null;

    expect(containerBox).toBeTruthy();
    expect(childBox).toBeTruthy();

    expect(containerBox?.hasAttribute('hidden')).toBe(false);
    expect(childBox?.hasAttribute('hidden')).toBe(true);
  });

  it('targetHintでcallout-boxの表示を上書きできる', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetBoxHint extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Box hint',
        categories: {},
        callouts: [
          {
            id: 'container',
            title: 'コンテナ',
            targetHint: 'none',
            target: { selector: '#container', scope: 'light' },
          },
          {
            id: 'child',
            title: '子要素',
            targetHint: 'box',
            target: { selector: '#child', scope: 'light' },
          },
        ],
      } as const;
    }
    const tagName = 'test-a11y-target-box-hint';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestTargetBoxHint);
    }

    const el = renderWebComponent(`
      <a11y-annotate>
        <${tagName}>
          <div id="container">
            <div id="child" aria-label="Child">x</div>
          </div>
        </${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const containerBox = el.querySelector(
      '[data-callout-id="container"] .callout-box',
    ) as HTMLElement | null;
    const childBox = el.querySelector(
      '[data-callout-id="child"] .callout-box',
    ) as HTMLElement | null;

    expect(containerBox).toBeTruthy();
    expect(childBox).toBeTruthy();

    expect(containerBox?.hasAttribute('hidden')).toBe(true);
    expect(childBox?.hasAttribute('hidden')).toBe(false);
  });

  it('callout-box(auto) は shadow 内要素を含むホストを container として判定できる', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestShadowHost extends HTMLElement {
      static a11yAnnotations = {
        version: 1,
        summary: 'Shadow container',
        categories: {},
        callouts: [
          {
            id: 'container',
            title: 'Host',
            target: { host: 'annotate', selector: 'test-shadow-host' },
          },
          {
            id: 'child',
            title: 'Inside',
            target: { scope: 'shadow', selector: '#inside' },
          },
        ],
      } as const;

      constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        const btn = document.createElement('button');
        btn.id = 'inside';
        btn.setAttribute('aria-label', 'Inside');
        btn.textContent = 'x';
        root.appendChild(btn);
      }
    }

    const tagName = 'test-shadow-host';
    if (!customElements.get(tagName)) {
      customElements.define(tagName, TestShadowHost);
    }

    const el = renderWebComponent(`
      <a11y-annotate>
        <${tagName} aria-label="Host"></${tagName}>
      </a11y-annotate>
    `);

    await waitForComponent('a11y-annotate');

    const containerBox = el.querySelector(
      '[data-callout-id="container"] .callout-box',
    ) as HTMLElement | null;
    const childBox = el.querySelector('[data-callout-id="child"] .callout-box') as HTMLElement | null;

    expect(containerBox).toBeTruthy();
    expect(childBox).toBeTruthy();

    // host（container）は shadow 内要素を包含していると判定され、auto で枠が出る
    expect(containerBox?.hasAttribute('hidden')).toBe(false);
    // child は container ではないので auto のまま枠は出ない
    expect(childBox?.hasAttribute('hidden')).toBe(true);
  });
});

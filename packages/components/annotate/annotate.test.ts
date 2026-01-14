import { describe, it, expect, afterEach } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  cleanup,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';

import type { A11yAnnotations } from '../../utils/a11y-annotations';

describe('DadsAnnotate', () => {
  afterEach(() => {
    cleanup();
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
      static a11yAnnotations: A11yAnnotations = {
        version: 1,
        summary: 'テスト用',
        categories: {
          semantics: ['semantics'],
          keyboard: ['keyboard'],
          zoom: ['zoom'],
          states: ['states'],
          labels: ['labels'],
          motion: ['motion'],
        },
        callouts: [
          {
            id: 'anchor',
            title: 'アンカー',
            description: 'aria-label を観測',
            category: 'labels',
            target: { selector: '#anchor' },
            placement: 'top-right',
          },
        ],
      };
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

  it('SVG要素をコールアウト対象にできる', async () => {
    const { defineDefaultAnnotate } = await import('./annotate-define');
    defineDefaultAnnotate();

    class TestTargetSvg extends HTMLElement {
      static a11yAnnotations: A11yAnnotations = {
        version: 1,
        summary: 'SVGターゲット',
        categories: { labels: ['labels'] },
        callouts: [
          {
            id: 'icon',
            title: 'アイコン',
            label: 'アイコン',
            category: 'labels',
            target: { selector: '#icon' },
            placement: 'top-right',
          },
        ],
      };
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
});

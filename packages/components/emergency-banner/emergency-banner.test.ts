/**
 * DadsEmergencyBanner コンポーネント テスト
 */

import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  getShadowElement,
  renderWebComponent,
  waitForComponent,
} from '../../../test/utils/test-helpers';

function waitTick(): Promise<void> {
  return Promise.resolve().then(() => Promise.resolve());
}

describe('DadsEmergencyBanner - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner>
        <span slot="heading">避難準備情報が発令されました</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');
    expect(component).toBeInTheDocument();
  });

  it('デフォルト属性が補完される', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`<dads-emergency-banner></dads-emergency-banner>`);
    await waitForComponent('dads-emergency-banner');

    expect(component.getAttribute('heading-level')).toBe('2');
    expect(component.getAttribute('prefix-mode')).toBe('auto');
    expect(component.getAttribute('prefix-label')).toBe('【緊急】');
    expect(component.getAttribute('target')).toBe('_self');
  });

  it('heading slot 未指定時はフォールバック見出しを表示する', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`<dads-emergency-banner></dads-emergency-banner>`);
    await waitForComponent('dads-emergency-banner');

    const heading = getShadowElement<HTMLElement>(component, '#heading');
    expect(heading?.textContent).toContain('緊急情報');
  });

  it('base は region として扱われ、見出しをラベル参照する', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner>
        <span slot="heading">見出し</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const base = getShadowElement<HTMLElement>(component, '#base');
    expect(base?.getAttribute('role')).toBe('region');
    expect(base?.getAttribute('aria-labelledby')).toBe('heading');
  });
});

describe('DadsEmergencyBanner - 属性正規化', () => {
  afterEach(() => {
    cleanup();
  });

  it('無効な属性値は規定値に正規化される', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner
        heading-level="10"
        prefix-mode="always"
        target="_parent"
      ></dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    expect(component.getAttribute('heading-level')).toBe('2');
    expect(component.getAttribute('prefix-mode')).toBe('auto');
    expect(component.getAttribute('target')).toBe('_self');
  });

  it('prefix-mode="manual" では接頭辞を非表示にする', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner prefix-mode="manual" prefix-label="【緊急】">
        <span slot="heading">避難準備情報が発令されました</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const prefix = getShadowElement<HTMLElement>(component, '#prefix');
    expect(prefix?.hidden).toBe(true);
  });

  it('prefix-mode="auto" では prefix-label を表示する', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner prefix-mode="auto" prefix-label="【至急】">
        <span slot="heading">避難準備情報が発令されました</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const prefix = getShadowElement<HTMLElement>(component, '#prefix');
    expect(prefix?.hidden).toBe(false);
    expect(prefix?.textContent).toBe('【至急】');
  });

  it('heading-level を変更すると aria-level へ反映される', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner heading-level="3">
        <span slot="heading">避難準備情報が発令されました</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const heading = getShadowElement<HTMLElement>(component, '#heading');
    expect(heading?.getAttribute('aria-level')).toBe('3');

    component.setAttribute('heading-level', '6');
    await waitTick();
    expect(heading?.getAttribute('aria-level')).toBe('6');
  });
});

describe('DadsEmergencyBanner - CTA', () => {
  afterEach(() => {
    cleanup();
  });

  it('href 未指定時は action が非表示', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner>
        <span slot="heading">見出し</span>
        <span slot="action">指定避難所を確認する</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    expect(action?.hidden).toBe(true);
  });

  it('href 指定時でも action slot が空なら CTA を非表示にする', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com">
        <span slot="heading">見出し</span>
        <span slot="action"> </span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    expect(action?.hidden).toBe(true);
  });

  it('href と action 指定で CTA を表示し target="_blank" 時に新規タブアイコンを表示', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank">
        <span slot="heading">見出し</span>
        <span slot="action">指定避難所を確認する</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');
    const actionIcon = getShadowElement<HTMLElement>(component, '#action-icon');

    expect(action?.hidden).toBe(false);
    expect(actionLink?.getAttribute('href')).toBe('https://example.com');
    expect(actionLink?.getAttribute('target')).toBe('_blank');
    expect(actionLink?.getAttribute('aria-label')).toContain('新規タブで開きます');
    expect(actionIcon?.hidden).toBe(false);
  });

  it('target="_self" のとき新規タブ補助ラベルとアイコンを表示しない', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_self">
        <span slot="heading">見出し</span>
        <span slot="action">指定避難所を確認する</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');
    const actionIcon = getShadowElement<HTMLElement>(component, '#action-icon');
    expect(actionLink?.hasAttribute('aria-label')).toBe(false);
    expect(actionIcon?.hidden).toBe(true);
  });

  it('target="_blank" かつ rel 未指定時は rel を自動補完する', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank">
        <span slot="heading">見出し</span>
        <span slot="action">指定避難所を確認する</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');
    expect(actionLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('rel 指定時は自動補完より優先する', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank" rel="nofollow noopener">
        <span slot="heading">見出し</span>
        <span slot="action">指定避難所を確認する</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');
    expect(actionLink?.getAttribute('rel')).toBe('nofollow noopener');
  });

  it('危険な href は # へフォールバックする', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="javascript:alert('x')" target="_self">
        <span slot="heading">見出し</span>
        <span slot="action">指定避難所を確認する</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');
    expect(actionLink?.getAttribute('href')).toBe('#');
  });

  it('action slot が aria-label のみでも CTA を表示できる', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank">
        <span slot="heading">見出し</span>
        <span slot="action" aria-label="指定避難所を確認する"></span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');
    expect(action?.hidden).toBe(false);
    expect(actionLink?.getAttribute('aria-label')).toContain('新規タブで開きます');
  });

  it('action slot が aria-labelledby のみでも CTA を表示し新規タブ補助ラベルを付与する', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank">
        <span slot="heading" id="action-label-source">指定避難所を確認する</span>
        <span slot="action" aria-labelledby="action-label-source"></span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');

    expect(action?.hidden).toBe(false);
    expect(actionLink?.getAttribute('aria-label')).toBe('指定避難所を確認する（新規タブで開きます）');
  });

  it('action slot が aria-labelledby の複数IDを参照している場合も補助ラベルを構成できる', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank">
        <span slot="heading">見出し</span>
        <span id="action-label-main">指定避難所を確認する</span>
        <span id="action-label-extra">（重要）</span>
        <span slot="action" aria-labelledby="action-label-main action-label-extra"></span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');

    expect(action?.hidden).toBe(false);
    expect(actionLink?.getAttribute('aria-label')).toBe('指定避難所を確認する （重要）（新規タブで開きます）');
  });

  it('action slot が循環参照する aria-labelledby でも無限ループせず補助ラベルを構成できる', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank">
        <span slot="heading">見出し</span>
        <span slot="action" id="action-label-self" aria-labelledby="action-label-helper"></span>
        <span id="action-label-helper" aria-labelledby="action-label-self">循環ラベル</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');

    expect(action?.hidden).toBe(false);
    expect(actionLink?.getAttribute('aria-label')).toBe('循環ラベル（新規タブで開きます）');
  });

  it('aria-labelledby の参照先要素が削除されたら CTA 表示を再同期して非表示にする', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com" target="_blank">
        <span slot="heading">見出し</span>
        <span id="action-label-source">指定避難所を確認する</span>
        <span slot="action" aria-labelledby="action-label-source"></span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const action = getShadowElement<HTMLElement>(component, '#action');
    const actionLink = getShadowElement<HTMLAnchorElement>(component, '#action-link');
    expect(action?.hidden).toBe(false);
    expect(actionLink?.getAttribute('aria-label')).toBe('指定避難所を確認する（新規タブで開きます）');

    const source = component.querySelector('#action-label-source');
    source?.remove();
    await waitTick();

    expect(action?.hidden).toBe(true);
    expect(actionLink?.hasAttribute('aria-label')).toBe(false);
  });
});

describe('DadsEmergencyBanner - スロット同期', () => {
  afterEach(() => {
    cleanup();
  });

  it('スロット内容の追加で timestamp/body/action が同期表示される', async () => {
    const { defineDefaultEmergencyBanner } = await import('./emergency-banner-define');
    defineDefaultEmergencyBanner();

    const component = renderWebComponent(`
      <dads-emergency-banner href="https://example.com">
        <span slot="heading">見出し</span>
      </dads-emergency-banner>
    `);

    await waitForComponent('dads-emergency-banner');

    const timestamp = getShadowElement<HTMLElement>(component, '#timestamp');
    const body = getShadowElement<HTMLElement>(component, '#body');
    const action = getShadowElement<HTMLElement>(component, '#action');

    expect(timestamp?.hidden).toBe(true);
    expect(body?.hidden).toBe(true);
    expect(action?.hidden).toBe(true);

    const time = document.createElement('time');
    time.setAttribute('slot', 'timestamp');
    time.setAttribute('datetime', '2024-01-01T06:00:00+09:00');
    time.textContent = '2024年1月1日 06:00更新';
    component.appendChild(time);

    const bodyText = document.createElement('p');
    bodyText.textContent = '本文';
    component.appendChild(bodyText);

    const actionText = document.createElement('span');
    actionText.setAttribute('slot', 'action');
    actionText.textContent = '指定避難所を確認する';
    component.appendChild(actionText);

    await waitTick();

    expect(timestamp?.hidden).toBe(false);
    expect(body?.hidden).toBe(false);
    expect(action?.hidden).toBe(false);
  });
});

describe('DadsEmergencyBanner - a11yAnnotations', () => {
  it('callouts が主要要素を含む', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-emergency-banner');
    const ids = annotations?.callouts?.map((c) => c.id) ?? [];

    expect(ids).toEqual(
      expect.arrayContaining([
        'emergency-region',
        'emergency-heading',
        'emergency-prefix',
        'emergency-timestamp',
        'emergency-body',
        'emergency-action',
      ]),
    );
  });

  it('本文 callout は body part を参照する', async () => {
    const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
    const annotations = getCemA11yAnnotations('dads-emergency-banner');
    const bodyCallout = annotations?.callouts?.find((callout) => callout.id === 'emergency-body');

    expect(bodyCallout?.target?.scope).toBe('shadow');
    expect(bodyCallout?.target?.selector).toBe('[part="body"]');
  });
});

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { demos } from './mobile-menu.js';

function extractSampleMenu(html: string, sampleName: string): string {
  const pattern = new RegExp(
    `<dads-mobile-menu[^>]*data-mobile-menu-sample="${sampleName}"[\\s\\S]*?<\\/dads-mobile-menu>`,
  );
  return html.match(pattern)?.[0] ?? '';
}

function countCurrentAttributes(markup: string): number {
  return (markup.match(/\scurrent(?=[\s>])/g) ?? []).length;
}

function countAttribute(markup: string, attributeText: string): number {
  return (markup.match(new RegExp(attributeText, 'g')) ?? []).length;
}

function getInteractiveScriptContent(html: string): string {
  const scripts = [...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)];
  const interactive = scripts
    .map((match) => match[1] ?? '')
    .find((content) => content.includes('data-mobile-menu-live-events-bound'));
  return interactive ?? '';
}

function patchScriptImportForTest(scriptContent: string): string {
  return scriptContent.replace(
    "import('./packages/utils/command-store.js')",
    'Promise.resolve({ defaultCommandStore: { bind: function() {} } })',
  );
}

async function flushTasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function executeMobileMenuScript(host: HTMLElement): void {
  const scriptEl = host.querySelectorAll('script');
  const targetScript = [...scriptEl].find((node) =>
    (node.textContent ?? '').includes('data-mobile-menu-live-events-bound'),
  );
  if (!(targetScript instanceof HTMLScriptElement)) return;

  const content = patchScriptImportForTest(targetScript.textContent ?? '');
  if (!content) return;

  const original = Object.getOwnPropertyDescriptor(document, 'currentScript');
  Object.defineProperty(document, 'currentScript', {
    configurable: true,
    get: () => targetScript,
  });

  try {
    // eslint-disable-next-line no-new-func
    new Function(content)();
  } finally {
    if (original) Object.defineProperty(document, 'currentScript', original);
    else delete (document as Document & { currentScript?: unknown }).currentScript;
  }
}

beforeAll(() => {
  if (!customElements.get('dads-drawer')) {
    customElements.define('dads-drawer', class extends HTMLElement {});
  }
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('mobile-menu demo', () => {
  it('アクセシビリティ注釈は dads-mobile-menu 本体をターゲットにする', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-mobile-menu"');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / Controls（Storybook風）'),
    );
  });

  it('API / Controls の Preview も dads-mobile-menu 本体を表示する', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('id="mobile-menu-api-target" data-api-target');
    expect(html).toContain('<code>aria-label</code>');
    expect(html).toContain('<code>--dads-mobile-menu-width</code>');
  });

  it('ドリルダウン（2階層）プレビューを表示する', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('ドリルダウン（2階層）プレビュー');
    expect(html).toContain('data-mobile-menu-sample="drilldown-preview"');
  });

  it('ドリルダウンは主要4項目（白書・申請・お問い合わせ・Language）から2階層へ遷移できる', () => {
    const html = demos.mobileMenu();
    const drilldownSample = extractSampleMenu(html, 'drilldown-preview');
    expect(drilldownSample).toContain('data-mobile-menu-drilldown-root');
    expect(drilldownSample).toContain('data-drill-target="drill-reports"');
    expect(drilldownSample).toContain('data-drill-target="drill-application"');
    expect(drilldownSample).toContain('data-drill-target="drill-contact"');
    expect(drilldownSample).toContain('data-drill-target="drill-language"');
    expect(drilldownSample).toContain('data-mobile-menu-drilldown-panel="drill-reports"');
    expect(drilldownSample).toContain('data-mobile-menu-drilldown-panel="drill-application"');
    expect(drilldownSample).toContain('data-mobile-menu-drilldown-panel="drill-contact"');
    expect(drilldownSample).toContain('data-mobile-menu-drilldown-panel="drill-language"');
    expect(countAttribute(drilldownSample, 'data-drill-target=')).toBe(4);
    expect(countAttribute(drilldownSample, 'data-mobile-menu-drilldown-panel=')).toBe(5);
    expect(countAttribute(drilldownSample, 'end-icon="arrow-right"')).toBe(4);
    expect(countAttribute(drilldownSample, 'data-mobile-menu-drill-end-icon')).toBe(4);
  });

  it('chip（縦ライン）は項目ではなく見出しに付与される', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('mobile-menu-demo__section-chip');
    expect(html).toContain('mobile-menu-demo__drilldown-section-title--with-chip');
  });

  it('右タイプ/左タイプは同一ストーリーで遷移し、divider幅バリエーションを持つ', () => {
    const html = demos.mobileMenu();
    const rightSample = extractSampleMenu(html, 'live-drilldown-right');
    const leftSample = extractSampleMenu(html, 'live-drilldown-left');

    expect(rightSample).not.toBe('');
    expect(leftSample).not.toBe('');
    expect(rightSample).toContain('data-mobile-menu-story="public-services"');
    expect(leftSample).toContain('data-mobile-menu-story="public-services"');

    expect(rightSample).toContain('data-drill-target="drill-reports"');
    expect(rightSample).toContain('data-drill-target="drill-application"');
    expect(rightSample).toContain('data-drill-target="drill-contact"');
    expect(rightSample).toContain('data-drill-target="drill-language"');
    expect(leftSample).toContain('data-drill-target="drill-reports"');
    expect(leftSample).toContain('data-drill-target="drill-application"');
    expect(leftSample).toContain('data-drill-target="drill-contact"');
    expect(leftSample).toContain('data-drill-target="drill-language"');

    expect(rightSample).toContain('<dads-divider>');
    expect(rightSample).not.toContain('--dads-mobile-menu-divider-margin-inline-wide');
    expect(leftSample).toContain(
      'style="--dads-mobile-menu-divider-margin-inline: var(--dads-mobile-menu-divider-margin-inline-wide);"',
    );
    expect(leftSample).toContain('<dads-divider>');
  });

  it('各サンプルの current は1件のみ', () => {
    const html = demos.mobileMenu();
    const a11ySample = extractSampleMenu(html, 'a11y-accordion');
    const apiSample = extractSampleMenu(html, 'api-preview');
    const drilldownSample = extractSampleMenu(html, 'drilldown-preview');

    expect(a11ySample).not.toBe('');
    expect(apiSample).not.toBe('');
    expect(drilldownSample).not.toBe('');

    expect(countCurrentAttributes(a11ySample)).toBe(1);
    expect(countCurrentAttributes(apiSample)).toBe(1);
    expect(countCurrentAttributes(drilldownSample)).toBe(1);
  });

  it('アコーディオン作例は白書配下を current にし、他アコーディオンを閉じた構成を持つ', () => {
    const html = demos.mobileMenu();
    const liveAccordionSample = extractSampleMenu(html, 'live-accordion');

    expect(liveAccordionSample).toContain('id="mobile-menu-live-accordion-section-open-trigger"');
    expect(liveAccordionSample).toContain('id="mobile-menu-live-accordion-section-open"');
    expect(liveAccordionSample).toContain('id="mobile-menu-live-accordion-section-open" indentation="1"');
    expect(liveAccordionSample).toContain('id="mobile-menu-live-accordion-section-closed-trigger"');
    expect(liveAccordionSample).toContain('id="mobile-menu-live-accordion-section-closed"');
    expect(liveAccordionSample).toContain('aria-expanded="false"');
    expect(liveAccordionSample).toContain('id="mobile-menu-live-accordion-section-language-trigger"');
    expect(liveAccordionSample).toContain(
      'id="mobile-menu-live-accordion-section-language" indentation="1" hidden',
    );
    expect(liveAccordionSample).toMatch(
      /<dads-menu-list-item[^>]*current[^>]*>\s*パンフレット・リーフレット・ポスター/,
    );
    expect(liveAccordionSample).toContain('Language');
    expect(liveAccordionSample).toContain('日本語');
    expect(liveAccordionSample).toContain('English');
    expect(liveAccordionSample).toContain('<dads-divider>');
  });

  it('作例は mobile-mock + hamburger + drawer 連携を4種類含む', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('id="mobile-menu-live-accordion-root"');
    expect(html).toContain('id="mobile-menu-live-drilldown-root"');
    expect(html).toContain('id="mobile-menu-live-right-root"');
    expect(html).toContain('id="mobile-menu-live-left-root"');
    expect(html).toContain('data-mobile-menu-single-toggle-button');
    expect(html).toContain('<dads-mobile-mock class="mobile-menu-demo__mock">');
    expect(html).toContain('id="mobile-menu-live-accordion-trigger"');
    expect(html).toContain('commandfor="#mobile-menu-live-accordion-drawer"');
    expect(html).toContain('id="mobile-menu-live-accordion-drawer"');
    expect(html).toContain('id="mobile-menu-live-drilldown-trigger"');
    expect(html).toContain('commandfor="#mobile-menu-live-drilldown-drawer"');
    expect(html).toContain('id="mobile-menu-live-drilldown-drawer"');
    expect(html).toContain('id="mobile-menu-live-right-trigger"');
    expect(html).toContain('commandfor="#mobile-menu-live-right-drawer"');
    expect(html).toContain('id="mobile-menu-live-right-drawer"');
    expect(html).toContain('id="mobile-menu-live-right-close-trigger"');
    expect(html).toContain('id="mobile-menu-live-left-trigger"');
    expect(html).toContain('commandfor="#mobile-menu-live-left-drawer"');
    expect(html).toContain('id="mobile-menu-live-left-drawer"');
    expect(html).toContain('id="mobile-menu-live-left-close-trigger"');
    expect(html).toContain('data-preview-contained');
  });

  it('右タイプは右配置、左タイプは左配置で表示される', () => {
    const html = demos.mobileMenu();
    expect(html).toMatch(/id="mobile-menu-live-right-drawer"[\s\S]*?placement="right"/);
    expect(html).toMatch(/id="mobile-menu-live-left-drawer"[\s\S]*?placement="left"/);
    expect(html).toMatch(/id="mobile-menu-live-right-trigger"[\s\S]*?variant="icon"/);
    expect(html).toMatch(/id="mobile-menu-live-left-trigger"[\s\S]*?variant="icon"/);
    expect(countAttribute(html, 'mobile-menu-demo__drawer--partial')).toBeGreaterThanOrEqual(2);
    expect(countAttribute(html, 'mobile-menu-demo__drawer--no-header')).toBeGreaterThanOrEqual(2);
    expect(countAttribute(html, 'mobile-menu-demo__floating-toggle')).toBeGreaterThanOrEqual(2);
    expect(html).toContain('mobile-menu-demo__floating-toggle--right');
    expect(html).toContain('mobile-menu-demo__floating-toggle--left');
    expect(html).toContain('mobile-menu-demo__drawer-close-row--right');
    expect(html).toContain('mobile-menu-demo__drawer-close-row--left');
    expect(html).toContain('.mobile-menu-demo__mock-safe--floating-toggle:has(.mobile-menu-demo__drawer[open]) .mobile-menu-demo__floating-toggle');
  });

  it('command-store バインドとトリガー同期スクリプトを含む', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('var liveRootIds = [');
    expect(html).toContain("'mobile-menu-live-accordion-root'");
    expect(html).toContain("'mobile-menu-live-drilldown-root'");
    expect(html).toContain("'mobile-menu-live-right-root'");
    expect(html).toContain("'mobile-menu-live-left-root'");
    expect(html).toContain("liveRoot.setAttribute('data-mobile-menu-command-store-bound', 'true');");
    expect(html).toContain('mod.defaultCommandStore.bind(liveRoot);');
    expect(html).toContain("liveRoot.setAttribute('data-mobile-menu-live-events-bound', 'true');");
    expect(html).toContain("var usesToggleButton = liveRoot.hasAttribute('data-mobile-menu-single-toggle-button');");
    expect(html).toContain("var closeTrigger = liveRoot.querySelector('[data-mobile-menu-live-close-trigger]');");
    expect(html).toContain("closeTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');");
    expect(html).toContain("trigger.toggleAttribute('hidden', isOpen);");
    expect(html).toMatch(
      /if \(usesToggleButton\) \{[\s\S]*?trigger\.toggleAttribute\('hidden', isOpen\);[\s\S]*?closeTrigger\.setAttribute/,
    );
  });

  it('ドリルダウンのイベントバインドと戻る制御スクリプトを含む', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('var bindDrilldownMenu = function(menuRoot)');
    expect(html).toContain("menuRoot.__resetMobileMenuDrilldown = resetDrilldown;");
    expect(html).toContain("data-mobile-menu-drilldown-back");
    expect(html).toContain("backLabel.textContent = title || '戻る';");
    expect(html).toContain("targetPanelId = trigger.getAttribute('data-drill-target');");
  });

  it('single-toggle は drawer open/close で外側トリガーを実際に hidden 切替する', async () => {
    const host = document.createElement('div');
    host.innerHTML = demos.mobileMenu();
    document.body.appendChild(host);

    executeMobileMenuScript(host);
    await flushTasks();

    const liveRoot = host.querySelector('#mobile-menu-live-right-root');
    const drawer = liveRoot?.querySelector('[data-mobile-menu-live-drawer]');
    const trigger = liveRoot?.querySelector<HTMLElement>('[data-mobile-menu-live-trigger]');
    const closeTrigger = liveRoot?.querySelector<HTMLElement>('[data-mobile-menu-live-close-trigger]');

    expect(drawer).toBeTruthy();
    expect(trigger).toBeTruthy();
    expect(closeTrigger).toBeTruthy();
    expect(trigger?.hasAttribute('hidden')).toBe(false);

    drawer?.dispatchEvent(new CustomEvent('dads-drawer-open', { bubbles: true, composed: true }));
    await flushTasks();
    expect(trigger?.hasAttribute('hidden')).toBe(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(closeTrigger?.getAttribute('aria-expanded')).toBe('true');

    drawer?.dispatchEvent(new CustomEvent('dads-drawer-close', { bubbles: true, composed: true }));
    await flushTasks();
    expect(trigger?.hasAttribute('hidden')).toBe(false);
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(closeTrigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('ドリルダウンはクリックで panel 切替し、back ラベルと戻り導線を更新する', async () => {
    const host = document.createElement('div');
    host.innerHTML = demos.mobileMenu();
    document.body.appendChild(host);

    executeMobileMenuScript(host);
    await flushTasks();

    const menuRoot = host.querySelector<HTMLElement>('[data-mobile-menu-sample="drilldown-preview"]');
    const rootPanel = menuRoot?.querySelector<HTMLElement>('[data-mobile-menu-drilldown-panel="root"]');
    const reportsPanel = menuRoot?.querySelector<HTMLElement>('[data-mobile-menu-drilldown-panel="drill-reports"]');
    const reportsTrigger = menuRoot?.querySelector<HTMLElement>('[data-drill-target="drill-reports"]');
    const backLink = menuRoot?.querySelector<HTMLElement>('[data-mobile-menu-drilldown-back]');
    const backLabel = menuRoot?.querySelector<HTMLElement>('[data-mobile-menu-drilldown-back-label]');

    expect(menuRoot).toBeTruthy();
    expect(rootPanel?.hasAttribute('hidden')).toBe(false);
    expect(reportsPanel?.hasAttribute('hidden')).toBe(true);
    expect(backLink?.hasAttribute('hidden')).toBe(true);

    reportsTrigger?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await flushTasks();

    expect(rootPanel?.hasAttribute('hidden')).toBe(true);
    expect(reportsPanel?.hasAttribute('hidden')).toBe(false);
    expect(backLink?.hasAttribute('hidden')).toBe(false);
    expect(backLabel?.textContent).toBe('白書・統計・資料');
    expect(menuRoot?.getAttribute('data-mobile-menu-drilldown-active')).toBe('drill-reports');

    backLink?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await flushTasks();

    expect(rootPanel?.hasAttribute('hidden')).toBe(false);
    expect(reportsPanel?.hasAttribute('hidden')).toBe(true);
    expect(backLink?.hasAttribute('hidden')).toBe(true);
    expect(menuRoot?.getAttribute('data-mobile-menu-drilldown-active')).toBe('root');
  });

  it('Figma要件の主要状態（戻る・現在地・外部リンク・区切り線・開閉）を含む', () => {
    const html = demos.mobileMenu();
    expect(html).toContain('slot="back"');
    expect(html).toContain('tail-icon="new-window"');
    expect(html).toContain('current');
    expect(html).toContain('<dads-divider>');
    expect(html).toContain('aria-controls=');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-expanded="false"');
  });
});

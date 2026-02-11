import { describe, expect, it } from 'vitest';
import { demos } from './header-container.js';
import { demos as allDemos } from '../demos.js';

describe('header-container demo', () => {
  it('日本語見出し（ヘッダーコンテナ）を含む', () => {
    const html = demos.headerContainer();
    expect(html).toContain('ヘッダーコンテナ');
    expect(html).toContain('.header-container-demo__surface {');
    expect(html).toContain('.header-container-demo__logo-link:focus-visible {');
    expect(html).toContain('var(--dads-focus-outline-width, 0.25rem)');
    expect(html).toContain('var(--dads-focus-ring-width, 0.125rem)');
    expect(html).toContain('overflow: visible;');
    expect(html).toContain('target-selector="#header-container-annotate-target"');
    expect(html).toContain('callout-lane="side"');
    expect(html).toContain('--a11y-annotate-callout-lane-gap: 16px;');
    expect(html).toContain('.header-container-demo__language-selector::part(popup) {');
    expect(html).toContain('right: 0;');
    expect(html).toContain('.header-container-demo__utility-links dads-utility-link {');
    expect(html).not.toContain('.header-container-demo__utility-links a {');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / 操作'),
    );
  });

  it('3テーマ作例（自治体業務 / 行政手続き / 省庁横断）を含む', () => {
    const html = demos.headerContainer();
    expect(html).toContain('自治体業務システム');
    expect(html).toContain('行政手続きポータル');
    expect(html).toContain('省庁横断ダッシュボード');
  });

  it('デバイスモック再利用（desktop/tablet/mobile + dads-drawer + command-store bind）を含む', () => {
    const html = demos.headerContainer();
    expect(html).toContain('class="header-container-demo__layout-device" device="desktop" visible-height="420px"');
    expect(html).toContain('class="header-container-demo__layout-device" device="desktop" visible-height="320px"');
    expect(html).toContain('class="header-container-demo__layout-device" device="tablet" visible-height="520px"');
    expect(html).toContain('class="header-container-demo__mobile-mock" device="mobile" visible-height="560px"');
    expect(html).toContain('class="header-container-demo__theme-mock" device="desktop"');
    expect(html.match(/class="header-container-demo__theme-mock" device="desktop"/g)).toHaveLength(3);
    expect(html.match(/class="header-container-demo__theme-mock" device="desktop" visible-height="420px"/g)).toHaveLength(2);
    expect(html.match(/class="header-container-demo__theme-mock" device="desktop" visible-height="220px"/g)).toHaveLength(1);
    expect(html).not.toContain('class="header-container-demo__theme-mock" device="desktop" visible-height="240px"');
    expect(html).not.toContain('header-container-demo__theme-body');
    expect(html).toContain('--dads-device-mock-visible-height');
    expect(html).toContain('header-container-demo__mobile-trigger-layer');
    expect(html).toContain('id="header-container-mobile-trigger-layer"');
    expect(html).toContain('id="header-container-tablet-root"');
    expect(html).toContain('class="header-container-demo__surface header-container-demo__tablet-root"');
    expect(html).toContain('id="header-container-tablet-header-layer"');
    expect(html).toContain('class="header-container-demo__tablet-header-layer"');
    expect(html).toContain('id="header-container-tablet-trigger"');
    expect(html).toContain('id="header-container-tablet-drawer"');
    expect(html).toContain('id="header-container-mobile-trigger"');
    expect(html).toContain('id="header-container-mobile-drawer"');
    expect(html).toContain(
      'class="header-container-demo__mobile-drawer header-container-demo__mobile-drawer--fullscreen"',
    );
    expect(html).toContain('class="header-container-demo__tablet-drawer"');
    expect(html).toContain('.header-container-demo__tablet-drawer {');
    expect(html).toContain('position: absolute;');
    expect(html).toContain('inset: 0;');
    expect(html).toContain('pointer-events: none;');
    expect(html).toContain('.header-container-demo__tablet-drawer[open] {');
    expect(html).toContain('pointer-events: auto;');
    expect(html).toContain('.header-container-demo__tablet-root {');
    expect(html).toContain('block-size: 100%;');
    expect(html).toContain('.header-container-demo__tablet-header-layer {');
    expect(html).toContain('z-index: 1;');
    expect(html).toContain('タブレットメニュー');
    expect(html).toContain('未対応一覧');
    expect(html).toContain('class="header-container-demo__mobile-drawer-submenu"');
    expect(html).toContain('commandfor="#header-container-tablet-drawer"');
    expect(html).toContain('commandfor="#header-container-mobile-drawer"');
    expect(html).toContain("var tabletRoot = hostRoot.querySelector('#header-container-tablet-root');");
    expect(html).toContain("tabletRoot.setAttribute('data-header-container-tablet-command-store-bound', 'true');");
    expect(html).toContain('mod.defaultCommandStore.bind(tabletRoot);');
    expect(html).toContain("var mobileRoot = hostRoot.querySelector('#header-container-mobile-root');");
    expect(html).toContain("mobileRoot.setAttribute('data-header-container-mobile-command-store-bound', 'true');");
    expect(html).toContain('mod.defaultCommandStore.bind(mobileRoot);');
    expect(html).toContain('var bindDrawerPair = function(root, drawerId, triggerId, triggerLayerId) {');
    expect(html).toContain("'header-container-tablet-drawer'");
    expect(html).toContain("'header-container-tablet-trigger'");
    expect(html).toContain("'header-container-tablet-header-layer'");
    expect(html).toContain('triggerLayer.hidden = isOpen;');
    expect(html).toContain("if (drawer.hasAttribute('data-header-container-drawer-bound')) return;");
    expect(html).toContain("drawer.setAttribute('data-header-container-drawer-bound', 'true');");
    expect(html).toContain('var observer = new MutationObserver(function() {');
    expect(html).toContain("attributeFilter: ['open']");
    expect(html).not.toContain("drawer.addEventListener('dads-drawer-before-close', function() {");
    expect(html).not.toContain("drawer.addEventListener('dads-drawer-before-open', function() {");
    expect(html).toContain("'header-container-mobile-drawer'");
    expect(html).toContain("'header-container-mobile-trigger'");
    expect(html).toContain("'header-container-mobile-trigger-layer'");
    expect(html.match(/<dads-language-selector class="header-container-demo__language-selector" size="sm" opener="text">/g)).toHaveLength(2);
    expect(html.match(/<dads-language-selector class="header-container-demo__language-selector" size="sm" opener="icon">/g)).toHaveLength(1);
    expect(html).not.toContain('<a href="#">文字サイズ</a>');
    expect(html).toContain('<dads-menu-list-item data-value="ja" current>日本語</dads-menu-list-item>');
    expect(html).toContain('<dads-menu-list-item data-value="en">English</dads-menu-list-item>');
    expect(html).not.toContain('<a href="#">EN</a>');
    expect(html).toContain('<dads-utility-link href="#">ヘルプ</dads-utility-link>');
    expect(html).toContain('ログアウト</dads-utility-link>');
    expect(html).toContain('サインアウト</dads-utility-link>');
    expect(html).toContain('ログイン</dads-utility-link>');
    expect(html.match(/<dads-utility-link href="#">/g)).toHaveLength(18);
    expect(html.match(/slot="lead-icon"/g)).toHaveLength(7);
    expect(html).toContain('slot="lead-icon" width="16" height="16"');
    expect(html).not.toContain('<dads-utility-link href="#">ログアウト</dads-utility-link>');
    expect(html).not.toContain('<dads-utility-link href="#">ログイン</dads-utility-link>');
    expect(html).not.toContain('<a href="#">ヘルプ</a>');
    expect(html).not.toContain('<a href="#">ログアウト</a>');
    expect(html).not.toContain('<a href="#">サインアウト</a>');
    expect(html).toContain('<dads-global-menu slot="global-menu" class="header-container-demo__global-menu"');
    expect(html).toContain('<dads-global-menu-item href="#">');
    expect(html).toContain('<dads-global-menu-item href="#" current>');
    expect(html.match(/<dads-global-menu slot="global-menu" class="header-container-demo__global-menu"/g)).toHaveLength(8);
    expect(html).not.toContain('<nav slot="global-menu"');
    expect(html).toContain('<dads-menu-list-box label="共通申請">');
    expect(html).toContain('<dads-menu-list-box label="住民票">');
    expect(html).toContain('<dads-menu-list-box label="サービス稼働">');
    expect(html.match(/<dads-menu-list-box label="/g)?.length).toBeGreaterThanOrEqual(3);
    expect(html).toContain('slot="start-icon" width="20" height="20"');
    expect(html).not.toContain('class="header-container-demo__menu-start-icon"');
    expect(html).toContain("import('dads-device-mock')");
    expect(html).toContain("import('dads-language-selector')");
    expect(html).toContain("import('dads-global-menu')");
    expect(html).toContain("import('dads-global-menu-item')");
    expect(html).toContain("import('dads-utility-link')");
  });

  it('Viewer登録キー（headerContainer）と整合する', () => {
    expect(typeof allDemos.headerContainer).toBe('function');
    const html = allDemos.headerContainer();
    expect(html).toContain('ヘッダーコンテナ');
  });
});

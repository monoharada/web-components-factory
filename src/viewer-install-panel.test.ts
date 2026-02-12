import {
  LOCALHOST_HOSTS,
  buildInstallCommands,
  createInstallPanelElement,
  extractInstallComponentIdsFromManifest,
  findInstallAnchor,
  isLocalhostHost,
  resolveComponentId,
  toKebabFromDemoName,
} from './viewer-install-panel';

describe('viewer-install-panel', () => {
  it('localhost判定が正しい', () => {
    expect(isLocalhostHost('localhost')).toBe(true);
    expect(isLocalhostHost('127.0.0.1')).toBe(true);
    expect(isLocalhostHost('0.0.0.0')).toBe(true);
    expect(isLocalhostHost('[::1]')).toBe(true);
    expect(isLocalhostHost('foo.local')).toBe(true);
    expect(isLocalhostHost('example.com')).toBe(false);
  });

  it('LOCALHOST_HOSTS に主要ホストが含まれる', () => {
    expect(LOCALHOST_HOSTS.has('localhost')).toBe(true);
    expect(LOCALHOST_HOSTS.has('127.0.0.1')).toBe(true);
  });

  it('demo名をkebab-caseに変換できる', () => {
    expect(toKebabFromDemoName('descriptionList')).toBe('description-list');
    expect(toKebabFromDemoName('inputTextValidation')).toBe('input-text-validation');
  });

  it('componentIdを解決できる', () => {
    const installIds = new Set(['button', 'description-list', 'input-text']);
    expect(resolveComponentId('button', installIds)).toBe('button');
    expect(resolveComponentId('descriptionList', installIds)).toBe('description-list');
    expect(resolveComponentId('inputTextValidation', installIds)).toBe('input-text');
    expect(resolveComponentId('resetCss', installIds)).toBeNull();
  });

  it('-validation/-fidelity の接尾辞を除去してcomponentIdを解決できる', () => {
    const installIds = new Set(['email', 'menu-list-box']);
    expect(resolveComponentId('emailValidation', installIds)).toBe('email');
    expect(resolveComponentId('menuListBoxFidelity', installIds)).toBe('menu-list-box');
  });

  it('明示マップ項目が未登録ならnullを返す', () => {
    const installIds = new Set(['input-text-validation']);
    expect(resolveComponentId('inputTextValidation', installIds)).toBeNull();
  });

  it('installコマンドはnpmのみを返す', () => {
    const commands = buildInstallCommands('button');
    expect(commands).toHaveLength(1);
    expect(commands[0]).toContain('npm exec --yes');
    expect(commands[0]).toContain('--component button');
    expect(commands[0]).toContain('--channel stable');
    expect(commands[0]).not.toContain('bunx');
  });

  it('installパネルのメタ情報をdads-description-listで表示する', () => {
    const commands = buildInstallCommands('list');
    const panel = createInstallPanelElement('list', commands);
    const lists = panel.querySelectorAll('dads-description-list');
    const terms = Array.from(panel.querySelectorAll('.wc-install-panel__meta-list .wc-install-panel__meta-term')).map((node) =>
      node.textContent?.trim(),
    );
    const values = Array.from(panel.querySelectorAll('.wc-install-panel__meta-list .wc-install-panel__meta-value')).map((node) =>
      node.textContent?.trim(),
    );

    expect(lists).toHaveLength(1);
    expect(terms).toEqual(['ダウンロード先 (--dir)', 'プレフィックス (--prefix)']);
    expect(values).toEqual(['vendor/components/myui', 'myui']);
    expect(panel.textContent).not.toContain('コンポーネント');
  });

  it('h2 + p では p をアンカーにする', () => {
    const root = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    root.appendChild(h2);
    root.appendChild(p);

    const anchor = findInstallAnchor(root);
    expect(anchor).toBe(p);
  });

  it('h2 のみなら h2 をアンカーにする', () => {
    const root = document.createElement('div');
    const h2 = document.createElement('h2');
    root.appendChild(h2);

    const anchor = findInstallAnchor(root);
    expect(anchor).toBe(h2);
  });

  it('h2 が無ければ null を返す', () => {
    const root = document.createElement('div');
    const p = document.createElement('p');
    root.appendChild(p);

    const anchor = findInstallAnchor(root);
    expect(anchor).toBeNull();
  });

  it('manifest から install id を抽出できる', () => {
    const ids = extractInstallComponentIdsFromManifest({
      modules: [
        {
          declarations: [
            { custom: { install: { id: ' button ' } } },
            { custom: { install: { id: 'list' } } },
          ],
        },
      ],
    });
    expect(Array.from(ids)).toEqual(['button', 'list']);
  });

  it('manifest が不正なら空Setを返す', () => {
    expect(extractInstallComponentIdsFromManifest(null).size).toBe(0);
    expect(extractInstallComponentIdsFromManifest({ modules: {} }).size).toBe(0);
    expect(
      extractInstallComponentIdsFromManifest({
        modules: [{ declarations: [{ custom: { install: { id: '' } } }] }],
      }).size,
    ).toBe(0);
  });
});

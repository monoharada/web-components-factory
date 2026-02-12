const LOCALHOST_HOSTS = new Set(['', 'localhost', '127.0.0.1', '0.0.0.0', '[::1]']);

const NON_INSTALLABLE_DEMOS = new Set(['resetCss']);

const EXPLICIT_DEMO_COMPONENT_ID_MAP: Record<string, string> = {
  inputTextValidation: 'input-text',
  selectValidation: 'select',
  textareaValidation: 'textarea',
};

const DEFAULT_INSTALL_PREFIX = 'myui';
const DEFAULT_INSTALL_DIR = 'vendor/components/myui';

function isLocalhostHost(hostname: string | null | undefined): boolean {
  const normalized = String(hostname ?? '').trim().toLowerCase();
  if (LOCALHOST_HOSTS.has(normalized)) return true;
  return normalized.endsWith('.local');
}

function toKebabFromDemoName(name: string): string {
  return String(name)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function resolveComponentId(demoName: string, installIdSet: Set<string>): string | null {
  if (NON_INSTALLABLE_DEMOS.has(demoName)) return null;

  const explicit = EXPLICIT_DEMO_COMPONENT_ID_MAP[demoName];
  if (explicit) {
    return installIdSet.has(explicit) ? explicit : null;
  }

  const kebab = toKebabFromDemoName(demoName);
  if (installIdSet.has(kebab)) return kebab;

  if (kebab.endsWith('-validation')) {
    const base = kebab.slice(0, -'-validation'.length);
    if (installIdSet.has(base)) return base;
  }

  if (kebab.endsWith('-fidelity')) {
    const base = kebab.slice(0, -'-fidelity'.length);
    if (installIdSet.has(base)) return base;
  }

  return null;
}

function buildInstallCommands(componentId: string): readonly [string] {
  const npmExec =
    'npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- ' +
    `wcf vendor install --prefix ${DEFAULT_INSTALL_PREFIX} --dir ${DEFAULT_INSTALL_DIR} --component ${componentId} --channel stable`;

  return [npmExec] as const;
}

function findInstallAnchor(root: ParentNode): Element | null {
  const heading = root.querySelector('h2');
  if (!(heading instanceof Element)) return null;

  const next = heading.nextElementSibling;
  if (next && next.tagName === 'P') return next;

  return heading;
}

function createInstallPanelElement(componentId: string, commands: readonly string[]): HTMLElement {
  const panel = document.createElement('section');
  panel.className = 'wc-install-panel';
  panel.dataset.componentId = componentId;

  const title = document.createElement('h3');
  title.className = 'wc-install-panel__title';
  title.textContent = 'インストール';

  const metaList = document.createElement('dads-description-list');
  metaList.className = 'wc-install-panel__meta-list';
  metaList.setAttribute('marker', 'none');

  const appendMetaRow = (target: HTMLElement, label: string, value: string): void => {
    const row = document.createElement('div');
    row.className = 'wc-install-panel__meta-row';

    const term = document.createElement('dt');
    term.className = 'wc-install-panel__meta-term';
    term.textContent = label;

    const desc = document.createElement('dd');
    desc.className = 'wc-install-panel__meta-desc';

    const valueCode = document.createElement('code');
    valueCode.className = 'wc-install-panel__meta-value';
    valueCode.textContent = value;

    desc.appendChild(valueCode);
    row.appendChild(term);
    row.appendChild(desc);
    target.appendChild(row);
  };

  appendMetaRow(metaList, 'ダウンロード先 (--dir)', DEFAULT_INSTALL_DIR);
  appendMetaRow(metaList, 'プレフィックス (--prefix)', DEFAULT_INSTALL_PREFIX);

  const pre = document.createElement('pre');
  pre.className = 'wc-install-panel__code';

  const code = document.createElement('code');
  code.textContent = commands.join('\n\n');

  pre.appendChild(code);
  panel.appendChild(title);
  panel.appendChild(metaList);
  panel.appendChild(pre);

  return panel;
}

function extractInstallComponentIdsFromManifest(manifest: unknown): Set<string> {
  const ids = new Set<string>();
  if (!manifest || typeof manifest !== 'object') return ids;

  const modules = (manifest as { modules?: unknown }).modules;
  if (!Array.isArray(modules)) return ids;

  for (const mod of modules) {
    if (!mod || typeof mod !== 'object') continue;
    const declarations = (mod as { declarations?: unknown }).declarations;
    if (!Array.isArray(declarations)) continue;

    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;
      const custom = (decl as { custom?: unknown }).custom;
      if (!custom || typeof custom !== 'object') continue;
      const install = (custom as { install?: unknown }).install;
      if (!install || typeof install !== 'object') continue;
      const id = (install as { id?: unknown }).id;
      if (typeof id === 'string' && id.trim() !== '') {
        ids.add(id.trim());
      }
    }
  }

  return ids;
}

export {
  LOCALHOST_HOSTS,
  NON_INSTALLABLE_DEMOS,
  EXPLICIT_DEMO_COMPONENT_ID_MAP,
  isLocalhostHost,
  toKebabFromDemoName,
  resolveComponentId,
  buildInstallCommands,
  findInstallAnchor,
  createInstallPanelElement,
  extractInstallComponentIdsFromManifest,
};

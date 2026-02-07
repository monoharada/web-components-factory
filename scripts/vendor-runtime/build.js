import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const COMPONENTS = {
  button: {
    tagBase: 'button',
    defineModule: 'src/components/button/button-define.js',
    defineFn: 'defineButton',
  },
  card: {
    tagBase: 'card',
    defineModule: 'src/components/card/card-define.js',
    defineFn: 'defineCard',
  },
  fieldset: {
    tagBase: 'fieldset',
    defineModule: 'src/components/fieldset/fieldset-define.js',
    defineFn: 'defineFieldset',
  },
  heading: {
    tagBase: 'heading',
    defineModule: 'src/components/heading/heading-define.js',
    defineFn: 'defineHeading',
  },
  'input-text': {
    tagBase: 'input-text',
    defineModule: 'src/components/input-text/input-text-define.js',
    defineFn: 'defineInputText',
  },
  'page-navigation': {
    tagBase: 'page-navigation',
    defineModule: 'src/components/page-navigation/page-navigation-define.js',
    defineFn: 'definePageNavigation',
  },
  'step-navigation': {
    tagBase: 'step-navigation',
    defineModule: 'src/components/step-navigation/step-navigation-define.js',
    defineFn: 'defineStepNavigation',
  },
  table: {
    tagBase: 'table',
    defineModule: 'src/components/table/table-define.js',
    defineFn: 'defineTable',
  },
  'search-box': {
    tagBase: 'search-box',
    defineModule: 'src/components/search-box/search-box-define.js',
    defineFn: 'defineSearchBox',
  },
  select: {
    tagBase: 'select',
    defineModule: 'src/components/select/select-define.js',
    defineFn: 'defineSelect',
  },
  textarea: {
    tagBase: 'textarea',
    defineModule: 'src/components/textarea/textarea-define.js',
    defineFn: 'defineTextarea',
  },
};

const PATTERNS = {
  'search-form': {
    title: '検索フォーム（最小）',
    description: '見出し + 検索フォーム（検索語 + ボタン）',
    components: ['heading', 'search-box', 'button'],
    requiredComponents: ['heading', 'search-box'],
    stability: 'stable',
    contractVersion: '1.0',
    entryHints: ['boot', '@wcf', 'index'],
    sampleHtml: `<main data-dads-typeset>
  <dads-heading level="1">検索</dads-heading>
  <form id="search-form">
    <dads-search-box aria-label="検索"></dads-search-box>
  </form>
</main>`,
  },
  'search-results': {
    title: '検索結果一覧',
    description: '見出し + 検索フォーム + 結果カード + ページネーション',
    components: ['heading', 'search-box', 'card', 'page-navigation'],
    requiredComponents: ['heading', 'search-box', 'card', 'page-navigation'],
    stability: 'stable',
    contractVersion: '1.0',
    entryHints: ['boot', '@wcf', 'index'],
    sampleHtml: `<main data-dads-typeset>
  <dads-heading level="1">検索</dads-heading>
  <form id="search-form">
    <dads-search-box aria-label="検索"></dads-search-box>
  </form>
  <h2>結果</h2>
  <ul>
    <li><dads-card>ダミー結果 1</dads-card></li>
    <li><dads-card>ダミー結果 2</dads-card></li>
    <li><dads-card>ダミー結果 3</dads-card></li>
  </ul>
  <dads-page-navigation current="1" total="1"></dads-page-navigation>
</main>`,
  },
  'table-with-pagination': {
    title: 'テーブル + ページネーション',
    description: 'テーブル一覧とページネーションの基本構成',
    components: ['heading', 'table', 'page-navigation'],
    requiredComponents: ['table', 'page-navigation'],
    stability: 'stable',
    contractVersion: '1.0',
    entryHints: ['boot', '@wcf', 'index'],
    sampleHtml: `<main data-dads-typeset>
  <dads-heading level="1">一覧</dads-heading>
  <dads-table>
    <table>
      <thead>
        <tr><th>項目</th><th>値</th></tr>
      </thead>
      <tbody>
        <tr><td>サンプル</td><td>1</td></tr>
      </tbody>
    </table>
  </dads-table>
  <dads-page-navigation current="1" total="3"></dads-page-navigation>
</main>`,
  },
  'card-grid': {
    title: 'カードグリッド',
    description: 'カードで一覧表示する基本レイアウト',
    components: ['heading', 'card', 'button'],
    requiredComponents: ['heading', 'card'],
    stability: 'stable',
    contractVersion: '1.0',
    entryHints: ['boot', '@wcf', 'index'],
    sampleHtml: `<main data-dads-typeset>
  <dads-heading level="1">お知らせ</dads-heading>
  <section>
    <dads-card>
      <h2>カード1</h2>
      <dads-button variant="outlined">詳細</dads-button>
    </dads-card>
    <dads-card>
      <h2>カード2</h2>
      <dads-button variant="outlined">詳細</dads-button>
    </dads-card>
  </section>
</main>`,
  },
  'application-form-single-validation': {
    title: '申請フォーム（1ページ・検証エラー）',
    description: '必須項目を含む1ページ申請フォームとバリデーションエラー表示',
    components: ['heading', 'fieldset', 'input-text', 'select', 'textarea', 'button'],
    requiredComponents: ['fieldset', 'input-text', 'button'],
    stability: 'experimental',
    contractVersion: '1.0',
    entryHints: ['boot', '@wcf', 'index'],
    sampleHtml: `<main data-dads-typeset>
  <dads-heading level="1">申請フォーム</dads-heading>
  <form id="application-form-single">
    <dads-fieldset>
      <legend>申請情報</legend>
      <dads-input-text name="name" required error error-text="氏名は必須です"></dads-input-text>
      <dads-select name="type" required></dads-select>
      <dads-textarea name="reason" required></dads-textarea>
    </dads-fieldset>
    <dads-button type="submit">送信</dads-button>
  </form>
</main>`,
  },
  'application-form-step-validation': {
    title: '申請フォーム（ステップ・検証エラー）',
    description: 'ステップナビゲーション付き申請フォームと検証エラー表示',
    components: ['heading', 'step-navigation', 'fieldset', 'input-text', 'button'],
    requiredComponents: ['step-navigation', 'fieldset', 'input-text', 'button'],
    stability: 'experimental',
    contractVersion: '1.0',
    entryHints: ['boot', '@wcf', 'index'],
    sampleHtml: `<main data-dads-typeset>
  <dads-heading level="1">申請フォーム（ステップ）</dads-heading>
  <dads-step-navigation current="1" total="3"></dads-step-navigation>
  <form id="application-form-step">
    <dads-fieldset>
      <legend>ステップ1: 申請者情報</legend>
      <dads-input-text name="name" required error error-text="氏名は必須です"></dads-input-text>
    </dads-fieldset>
    <dads-button type="submit">次へ</dads-button>
  </form>
</main>`,
  },
};

const WC_AUTOLOADER_TEXT = `/**
 * wcf vendor runtime autoloader.
 *
 * importmap should map tagName (e.g. "myui-search-box")
 * to stable files under ./components/*.js.
 */

function collectCustomElementTagNames(root) {
  const out = new Set();
  const all = root.querySelectorAll('*');
  for (const el of all) {
    const name = String(el.localName || '').toLowerCase();
    if (!name.includes('-')) continue;
    out.add(name);
  }
  return [...out];
}

async function importTagNames(tagNames) {
  for (const tagName of tagNames) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await import(tagName);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[wcf-autoloader] Failed to import:', tagName, e);
    }
  }
}

async function runOnce() {
  const tagNames = collectCustomElementTagNames(document);
  await importTagNames(tagNames);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    runOnce();
  });
} else {
  runOnce();
}
`;

const BOOT_TEMPLATE_TEXT = `import { setConfig } from './components/config.js';
setConfig({ prefix: '__WCF_PREFIX__' });
await import('./wc-autoloader.js');
`;

const README_TEXT = `# vendor-runtime

This directory is generated by \`npm run vendor:build\`.

- \`src/**\`: transpiled ESM source from \`packages/**\` (non-bundle)
- \`elements/*.js\`: per-component define entrypoints
- \`registry.json\`: lightweight component/pattern registry for \`wcf\`
- \`boot.js\`: template used by \`wcf vendor install\` (prefix placeholder)
- \`wc-autoloader.js\`: importmap-based autoloader
`;

function findPackageRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..', '..');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeText(filePath, text) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, text, 'utf8');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

async function generateElements(runtimeRoot) {
  const elementsDir = path.join(runtimeRoot, 'elements');
  await fs.rm(elementsDir, { recursive: true, force: true });
  await ensureDir(elementsDir);

  for (const suffix of Object.keys(COMPONENTS).sort((a, b) => a.localeCompare(b))) {
    const c = COMPONENTS[suffix];
    const code = `import { ${c.defineFn} } from '../${c.defineModule}';\n${c.defineFn}();\n`;
    // eslint-disable-next-line no-await-in-loop
    await writeText(path.join(elementsDir, `${suffix}.js`), code);
  }
}

async function generateRegistry(runtimeRoot) {
  const components = {};
  for (const suffix of Object.keys(COMPONENTS).sort((a, b) => a.localeCompare(b))) {
    const c = COMPONENTS[suffix];
    components[suffix] = {
      tagBase: c.tagBase,
      elementEntry: `components/${suffix}.js`,
      defineModule: c.defineModule,
      defineFn: c.defineFn,
    };
  }

  const patterns = {};
  for (const name of Object.keys(PATTERNS).sort((a, b) => a.localeCompare(b))) {
    const p = PATTERNS[name];
    patterns[name] = {
      id: name,
      title: p.title,
      description: p.description,
      components: [...p.components],
      requiredComponents: [...(p.requiredComponents ?? p.components)],
      stability: p.stability ?? 'stable',
      contractVersion: p.contractVersion ?? '1.0',
      entryHints: [...(p.entryHints ?? ['boot'])],
      sampleHtml: p.sampleHtml ?? '',
    };
  }

  const registry = {
    schemaVersion: 1,
    contractVersion: '1.0',
    deprecationPolicy: {
      graceCliMajorReleases: 1,
    },
    components,
    patterns,
  };

  await writeText(path.join(runtimeRoot, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`);
}

async function generateStaticFiles(runtimeRoot) {
  await writeText(path.join(runtimeRoot, 'wc-autoloader.js'), WC_AUTOLOADER_TEXT);
  await writeText(path.join(runtimeRoot, 'boot.js'), BOOT_TEMPLATE_TEXT);
  await writeText(path.join(runtimeRoot, 'README.md'), README_TEXT);
}

async function buildVendorRuntime({ check = false } = {}) {
  const pkgRoot = findPackageRoot();
  const runtimeRoot = path.join(pkgRoot, 'vendor-runtime');
  const runtimeSrc = path.join(runtimeRoot, 'src');

  await ensureDir(runtimeRoot);
  await fs.rm(runtimeSrc, { recursive: true, force: true });

  const tscPath = path.join(pkgRoot, 'node_modules', 'typescript', 'bin', 'tsc');
  const tsconfigPath = path.join(pkgRoot, 'tsconfig.vendor-runtime.json');
  run(process.execPath, [tscPath, '-p', tsconfigPath], { cwd: pkgRoot });

  await generateElements(runtimeRoot);
  await generateRegistry(runtimeRoot);
  await generateStaticFiles(runtimeRoot);

  if (check) {
    const diff = spawnSync('git', ['diff', '--quiet', '--', 'vendor-runtime'], {
      cwd: pkgRoot,
      stdio: 'ignore',
    });
    if (diff.status !== 0) {
      throw new Error('vendor-runtime is out of date. Run `npm run vendor:build` and commit changes.');
    }
  }
}

async function main() {
  const check = process.argv.includes('--check');
  await buildVendorRuntime({ check });
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(String(error?.stack ?? error));
  process.exit(1);
});

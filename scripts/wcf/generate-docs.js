import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const BLOCK_MARKER = '<!-- GENERATED:WCF_BLOCK_DOC -->';
const COMPONENT_MARKER = '<!-- GENERATED:WCF_COMPONENT_DOC -->';

function findPackageRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..', '..');
}

function toPosixPath(value) {
  return String(value).replace(/\\/g, '/');
}

async function readJson(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readTextIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

function renderEntryCommandDocs(patternId) {
  return [
    '### npm (`npx`互換)',
    '```bash',
    'npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \\',
    `  wcf vendor install --prefix myui --dir vendor/components/myui --pattern ${patternId}`,
    '```',
    '',
    '### Bun (`bunx`)',
    '```bash',
    'bunx --package git+https://github.com/monoharada/web-components-factory.git \\',
    `  wcf vendor install --prefix myui --dir vendor/components/myui --pattern ${patternId}`,
    '```',
    '',
    '### Bun (`bun create`経由)',
    '```bash',
    'bun create github.com/monoharada/web-components-factory my-app',
    'cd my-app',
    `node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern ${patternId}`,
    '```',
    '',
  ].join('\n');
}

function renderBlocksIndex({ patterns }) {
  const rows = Object.keys(patterns)
    .sort((a, b) => a.localeCompare(b))
    .map((patternId) => {
      const pattern = patterns[patternId];
      return `- [\`${patternId}\`](./${patternId}.md): ${pattern.title ?? patternId} (${pattern.stability ?? 'stable'})`;
    });

  return [
    BLOCK_MARKER,
    '',
    '# Blocks',
    '',
    'shadcn風の「発見 → 1コマンド導入 → ページ生成」を行うためのパターン一覧です。',
    '',
    '## 使い方',
    '',
    '```bash',
    'node scripts/wcf/cli.js blocks list',
    'node scripts/wcf/cli.js page create --pattern <patternId> --prefix myui --dir . --entry boot',
    '```',
    '',
    '## Pattern List',
    '',
    ...rows,
    '',
  ].join('\n');
}

function renderBlockDoc({ patternId, pattern }) {
  return [
    BLOCK_MARKER,
    '',
    `# ${pattern.title ?? patternId}`,
    '',
    `- ID: \`${patternId}\``,
    `- Stability: \`${pattern.stability ?? 'stable'}\``,
    `- Contract: \`${pattern.contractVersion ?? '1.0'}\``,
    `- Entry hints: ${(pattern.entryHints ?? ['boot']).map((x) => `\`${x}\``).join(', ')}`,
    '- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）',
    '',
    '## 概要',
    '',
    pattern.description ?? '',
    '',
    '## 必須コンポーネント',
    '',
    ...(pattern.requiredComponents ?? pattern.components ?? []).map((component) => `- \`${component}\``),
    '',
    '## コマンド例',
    '',
    renderEntryCommandDocs(patternId),
    '## サンプルHTML（canonical `dads-*`）',
    '',
    '```html',
    String(pattern.sampleHtml ?? '').trim(),
    '```',
    '',
  ].join('\n');
}

function renderComponentDoc({ componentId, componentDef, usedBy }) {
  return [
    COMPONENT_MARKER,
    '',
    `# ${componentId}`,
    '',
    `- tag base: \`${componentDef.tagBase}\``,
    `- define module: \`${componentDef.defineModule}\``,
    `- define function: \`${componentDef.defineFn}\``,
    `- vendor entry: \`${componentDef.elementEntry}\``,
    '',
    '## 使われるBlocks',
    '',
    ...(usedBy.length > 0 ? usedBy.map((patternId) => `- [\`${patternId}\`](../blocks/${patternId}.md)`) : ['- (none)']),
    '',
    '## 導入コマンド',
    '',
    '```bash',
    `node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --component ${componentId}`,
    '```',
    '',
  ].join('\n');
}

async function selectComponentDocPath(componentsDir, componentId) {
  const preferred = path.join(componentsDir, `${componentId}.md`);
  if (!(await pathExists(preferred))) return preferred;
  const text = await readTextIfExists(preferred);
  if (text && text.includes(COMPONENT_MARKER)) return preferred;
  return path.join(componentsDir, `wcf-${componentId}.md`);
}

async function writeOrCheck(filePath, content, checkMode, dirtyFiles) {
  const normalized = `${content.trimEnd()}\n`;
  const current = await readTextIfExists(filePath);
  const changed = current !== normalized;
  if (!changed) return;

  if (checkMode) {
    dirtyFiles.push(filePath);
    return;
  }

  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, normalized, 'utf8');
}

async function main() {
  const checkMode = process.argv.includes('--check');
  const pkgRoot = findPackageRoot();
  const registryPath = path.join(pkgRoot, 'vendor-runtime', 'registry.json');
  const registry = await readJson(registryPath);
  const blocksDir = path.join(pkgRoot, 'docs', 'blocks');
  const componentsDir = path.join(pkgRoot, 'docs', 'components');

  await ensureDir(blocksDir);
  await ensureDir(componentsDir);

  const dirtyFiles = [];

  const blocksIndexPath = path.join(blocksDir, 'index.md');
  await writeOrCheck(blocksIndexPath, renderBlocksIndex({ patterns: registry.patterns ?? {} }), checkMode, dirtyFiles);

  const patterns = registry.patterns ?? {};
  for (const patternId of Object.keys(patterns).sort((a, b) => a.localeCompare(b))) {
    const blockFile = path.join(blocksDir, `${patternId}.md`);
    // eslint-disable-next-line no-await-in-loop
    await writeOrCheck(
      blockFile,
      renderBlockDoc({ patternId, pattern: patterns[patternId] }),
      checkMode,
      dirtyFiles,
    );
  }

  const componentUsage = {};
  for (const [patternId, pattern] of Object.entries(patterns)) {
    for (const componentId of pattern.components ?? []) {
      if (!componentUsage[componentId]) componentUsage[componentId] = [];
      componentUsage[componentId].push(patternId);
    }
  }

  const components = registry.components ?? {};
  for (const componentId of Object.keys(components).sort((a, b) => a.localeCompare(b))) {
    // eslint-disable-next-line no-await-in-loop
    const componentDocPath = await selectComponentDocPath(componentsDir, componentId);
    // eslint-disable-next-line no-await-in-loop
    await writeOrCheck(
      componentDocPath,
      renderComponentDoc({
        componentId,
        componentDef: components[componentId],
        usedBy: [...(componentUsage[componentId] ?? [])].sort((a, b) => a.localeCompare(b)),
      }),
      checkMode,
      dirtyFiles,
    );
  }

  if (checkMode && dirtyFiles.length > 0) {
    // eslint-disable-next-line no-console
    console.error('WCF docs are out of date:');
    for (const filePath of dirtyFiles) {
      // eslint-disable-next-line no-console
      console.error(`- ${toPosixPath(path.relative(pkgRoot, filePath))}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(String(error?.stack ?? error));
  process.exit(1);
});

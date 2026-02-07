import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const CLI_PATTERN_CONTRACT_MAJOR = 1;

function findPackageRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..', '..');
}

function toPosixPath(p) {
  return String(p).replace(/\\/g, '/');
}

function normalizePrefix(prefix) {
  const value = String(prefix ?? '').trim().toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    throw new Error(`Invalid --prefix: ${prefix}`);
  }
  return value;
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readJson(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

function parseImportSpecifiers(sourceText) {
  const withoutBlockComments = sourceText.replace(/\/\*[\s\S]*?\*\//g, '');
  const specs = [];
  const patterns = [
    /^\s*import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]\s*;?/gm,
    /^\s*export\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]\s*;?/gm,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const re of patterns) {
    let m;
    while ((m = re.exec(withoutBlockComments))) {
      specs.push(m[1]);
    }
  }

  return specs;
}

async function resolveRelativeSpecifier(fromFile, specifier) {
  const fromDir = path.dirname(fromFile);
  const raw = path.resolve(fromDir, specifier);
  const candidates = [];

  const ext = path.extname(raw);
  if (ext) {
    candidates.push(raw);
  } else {
    candidates.push(`${raw}.js`);
    candidates.push(path.join(raw, 'index.js'));
  }

  for (const candidate of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await pathExists(candidate)) return candidate;
  }

  throw new Error(`Cannot resolve import: ${specifier} (from ${fromFile})`);
}

function assertInsideRoot(targetPath, rootPath) {
  const rel = path.relative(rootPath, targetPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Resolved path escapes runtime root: ${targetPath}`);
  }
}

async function collectReachableRuntimeFiles({ runtimeRoot, entryFiles }) {
  const queue = [...entryFiles];
  const visited = new Set();

  while (queue.length > 0) {
    const next = queue.shift();
    if (!next) continue;
    const abs = path.resolve(next);
    if (visited.has(abs)) continue;
    assertInsideRoot(abs, runtimeRoot);
    visited.add(abs);

    const source = await fs.readFile(abs, 'utf8');
    const specs = parseImportSpecifiers(source);

    for (const spec of specs) {
      if (spec.startsWith('node:')) {
        throw new Error(`node: specifier is not allowed in browser runtime: ${spec} (from ${abs})`);
      }
      if (!spec.startsWith('.')) {
        throw new Error(`Bare specifier is not allowed in vendor runtime: ${spec} (from ${abs})`);
      }

      // eslint-disable-next-line no-await-in-loop
      const resolved = await resolveRelativeSpecifier(abs, spec);
      assertInsideRoot(resolved, runtimeRoot);
      if (!visited.has(resolved)) queue.push(resolved);
    }
  }

  return [...visited].sort((a, b) => a.localeCompare(b));
}

function createReadme({ prefix, selectedSuffixes }) {
  const tags = selectedSuffixes.map((s) => `<${prefix}-${s}>`).join(', ');
  return [
    '# wcf vendor install output',
    '',
    `- prefix: \`${prefix}\``,
    `- components: ${selectedSuffixes.join(', ')}`,
    '- file:// 直開きではなく HTTP(S) 配信で利用してください',
    '',
    '## Structure',
    '',
    '- `boot.js`: prefix設定 + autoloader起動',
    '- `wc-autoloader.js`: importmapに従って custom elements を自動import',
    '- `components/*.js`: componentごとの define エントリ（直接編集可）',
    '- `components/**`: 実体ソース（非bundle、依存含む）',
    '- `index.js`: 互換エントリ（deprecated, bootへ移行予定）',
    '- `autoload/*.js`: 互換エントリ（deprecated, bootへ移行予定）',
    '',
    '## Usage (example)',
    '',
    '```html',
    '<script type="module">',
    "  import './vendor/components/" + prefix + "/boot.js';",
    '</script>',
    `<!-- then use: ${tags} -->`,
    '```',
    '',
  ].join('\n');
}

function normalizeRelDirForImportMap(dir) {
  const normalized = toPosixPath(String(dir ?? '').trim());
  if (!normalized) throw new Error('Missing --dir');
  if (normalized.startsWith('/')) return normalized;
  if (normalized.startsWith('./') || normalized.startsWith('../')) return normalized;
  return `./${normalized}`;
}

function createCliError(code, message) {
  const err = new Error(`${code}: ${message}`);
  err.code = code;
  return err;
}

function parseContractMajor(value, defaultMajor = CLI_PATTERN_CONTRACT_MAJOR) {
  const raw = String(value ?? '').trim();
  if (!raw) return defaultMajor;
  const [major] = raw.split('.');
  const parsed = Number(major);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultMajor;
  return parsed;
}

function validatePatternContract({ registry, patternName, pattern }) {
  const warnings = [];
  const patternMajor = parseContractMajor(pattern?.contractVersion);
  const graceReleases = Number(registry?.deprecationPolicy?.graceCliMajorReleases ?? 1);

  if (patternMajor > CLI_PATTERN_CONTRACT_MAJOR) {
    throw createCliError(
      'E_CONTRACT_NEWER',
      `Pattern "${patternName}" requires contract major ${patternMajor}, but CLI supports ${CLI_PATTERN_CONTRACT_MAJOR}.`,
    );
  }

  if (patternMajor < CLI_PATTERN_CONTRACT_MAJOR) {
    const delta = CLI_PATTERN_CONTRACT_MAJOR - patternMajor;
    if (delta > graceReleases) {
      throw createCliError(
        'E_CONTRACT_EXPIRED',
        `Pattern "${patternName}" contract ${patternMajor} is out of support (grace=${graceReleases}).`,
      );
    }
    warnings.push(
      `W_CONTRACT_DEPRECATED: Pattern "${patternName}" uses contract ${patternMajor}. It will be unsupported in a future major CLI release.`,
    );
  }

  return warnings;
}

function ensurePatternExists(registry, patternName) {
  const pattern = registry?.patterns?.[patternName];
  if (!pattern) {
    throw createCliError('E_PATTERN_UNKNOWN', `Unknown pattern: ${patternName}`);
  }
  return pattern;
}

function resolveSelectedSuffixes({ registry, pattern, components = [] }) {
  const selected = new Set();
  const warnings = [];
  let selectedPattern = null;

  if (pattern) {
    const p = ensurePatternExists(registry, pattern);
    selectedPattern = p;
    warnings.push(...validatePatternContract({ registry, patternName: pattern, pattern: p }));
    for (const suffix of p.components ?? []) selected.add(String(suffix));
  }

  for (const raw of components) {
    const value = String(raw ?? '').trim().toLowerCase();
    if (!value) continue;
    selected.add(value);
  }

  if (selected.size === 0) {
    throw createCliError('E_COMPONENT_EMPTY', 'No component selected. Pass --pattern or --component.');
  }

  const knownComponents = registry?.components ?? {};
  for (const suffix of selected) {
    if (!knownComponents[suffix]) {
      throw createCliError('E_COMPONENT_UNKNOWN', `Unknown component: ${suffix}`);
    }
  }

  return {
    selected: [...selected].sort((a, b) => a.localeCompare(b)),
    warnings,
    selectedPattern,
  };
}

async function loadRegistry(pkgRoot) {
  const registryPath = path.join(pkgRoot, 'vendor-runtime', 'registry.json');
  if (!(await pathExists(registryPath))) {
    throw new Error(
      `Missing vendor runtime registry: ${registryPath}. Run \`npm run vendor:build\` in upstream first.`,
    );
  }
  const registry = await readJson(registryPath);
  if (!registry?.patterns || !registry?.components) {
    throw createCliError('E_REGISTRY_INVALID', `Invalid registry format: ${registryPath}`);
  }
  return { registry, registryPath };
}

async function copyFileEnsured(from, to) {
  await ensureDir(path.dirname(to));
  await fs.copyFile(from, to);
}

export async function listPatterns() {
  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const patterns = registry?.patterns ?? {};
  return Object.keys(patterns)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      name,
      title: patterns[name]?.title ?? name,
      description: patterns[name]?.description ?? '',
      contractVersion: patterns[name]?.contractVersion ?? registry?.contractVersion ?? '1.0',
      stability: patterns[name]?.stability ?? 'stable',
      components: patterns[name]?.components ?? [],
      requiredComponents: patterns[name]?.requiredComponents ?? patterns[name]?.components ?? [],
      entryHints: patterns[name]?.entryHints ?? ['boot'],
    }));
}

export async function getPattern(name) {
  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const pattern = ensurePatternExists(registry, name);
  const warnings = validatePatternContract({ registry, patternName: name, pattern });
  return {
    name,
    title: pattern.title ?? name,
    description: pattern.description ?? '',
    contractVersion: pattern.contractVersion ?? registry?.contractVersion ?? '1.0',
    stability: pattern.stability ?? 'stable',
    components: [...(pattern.components ?? [])],
    requiredComponents: [...(pattern.requiredComponents ?? pattern.components ?? [])],
    entryHints: [...(pattern.entryHints ?? ['boot'])],
    sampleHtml: pattern.sampleHtml ?? '',
    warnings,
  };
}

export async function buildImportMap({ prefix, dir, pattern = null, components = [] }) {
  const p = normalizePrefix(prefix);
  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const { selected, warnings } = resolveSelectedSuffixes({ registry, pattern, components });
  const base = normalizeRelDirForImportMap(dir).replace(/\/$/, '');

  const imports = {};
  for (const suffix of selected) {
    imports[`${p}-${suffix}`] = `${base}/components/${suffix}.js`;
  }

  return {
    imports,
    selectedComponents: selected,
    warnings,
  };
}

export async function printImportMap({ prefix, dir, pattern = null, components = [], format = 'json' }) {
  const map = await buildImportMap({ prefix, dir, pattern, components });
  if (format === 'json') {
    return `${JSON.stringify({ imports: map.imports }, null, 2)}\n`;
  }
  if (format === 'html') {
    return ['<script type="importmap">', JSON.stringify({ imports: map.imports }, null, 2), '</script>', ''].join(
      '\n',
    );
  }
  throw new Error(`Invalid --format: ${format}`);
}

export async function vendorInstall({ prefix, outDir, pattern = null, components = [] }) {
  const p = normalizePrefix(prefix);
  const pkgRoot = findPackageRoot();
  const runtimeRoot = path.join(pkgRoot, 'vendor-runtime');
  const runtimeSrcRoot = path.join(runtimeRoot, 'src');

  if (!(await pathExists(runtimeSrcRoot))) {
    throw new Error(`Missing vendor runtime source: ${runtimeSrcRoot}. Run \`npm run vendor:build\` first.`);
  }

  const { registry } = await loadRegistry(pkgRoot);
  const { selected, warnings } = resolveSelectedSuffixes({ registry, pattern, components });

  const outAbs = path.resolve(process.cwd(), outDir);
  await ensureDir(outAbs);

  const existing = await fs.readdir(outAbs);
  if (existing.length > 0) {
    throw new Error(`Output directory is not empty: ${outAbs}`);
  }

  const outComponents = path.join(outAbs, 'components');
  const outAutoload = path.join(outAbs, 'autoload');
  await ensureDir(outComponents);
  await ensureDir(outAutoload);

  const copiedComponentEntries = [];
  const reachableEntries = [];

  for (const suffix of selected) {
    const elementMeta = registry.components[suffix];
    const defineModule = String(elementMeta?.defineModule ?? '');
    const defineFn = String(elementMeta?.defineFn ?? '');
    if (!defineModule || !defineFn) {
      throw new Error(`Missing define metadata for component: ${suffix}`);
    }
    if (!defineModule.startsWith('src/')) {
      throw new Error(`Invalid defineModule for component "${suffix}": ${defineModule}`);
    }

    const defineModuleFromComponents = defineModule.slice('src/'.length);
    const entryText = `import { ${defineFn} } from './${toPosixPath(defineModuleFromComponents)}';\n${defineFn}();\n`;
    const toComponentEntry = path.join(outComponents, `${suffix}.js`);
    // eslint-disable-next-line no-await-in-loop
    await fs.writeFile(toComponentEntry, entryText, 'utf8');
    copiedComponentEntries.push(toComponentEntry);
    reachableEntries.push(path.join(runtimeRoot, defineModule));
  }

  const bootTemplatePath = path.join(runtimeRoot, 'boot.js');
  const bootTemplate = await fs.readFile(bootTemplatePath, 'utf8');
  const bootText = bootTemplate.replaceAll('__WCF_PREFIX__', p);
  await fs.writeFile(path.join(outAbs, 'boot.js'), bootText);

  // Compatibility shim (N): keep index/autoload for legacy entry modes.
  // Planned removal timing is documented as N+1.
  const indexShimLines = [
    "import { setConfig } from './components/config.js';",
    `setConfig({ prefix: '${p}' });`,
  ];
  for (const suffix of selected) {
    indexShimLines.push(`await import('./components/${suffix}.js');`);
  }
  indexShimLines.push('');
  await fs.writeFile(path.join(outAbs, 'index.js'), `${indexShimLines.join('\n')}\n`, 'utf8');

  for (const suffix of selected) {
    const shim = [
      "import { setConfig } from '../components/config.js';",
      `setConfig({ prefix: '${p}' });`,
      `await import('../components/${suffix}.js');`,
      '',
    ].join('\n');
    // eslint-disable-next-line no-await-in-loop
    await fs.writeFile(path.join(outAutoload, `${suffix}.js`), `${shim}\n`, 'utf8');
  }

  await copyFileEnsured(path.join(runtimeRoot, 'wc-autoloader.js'), path.join(outAbs, 'wc-autoloader.js'));

  const graphRoots = [...reachableEntries, path.join(runtimeSrcRoot, 'config.js')];
  const reachableFiles = await collectReachableRuntimeFiles({ runtimeRoot, entryFiles: graphRoots });

  for (const from of reachableFiles) {
    if (!from.startsWith(`${runtimeSrcRoot}${path.sep}`) && from !== runtimeSrcRoot) {
      continue;
    }
    const relFromSrcRoot = path.relative(runtimeSrcRoot, from);
    const to = path.join(outComponents, relFromSrcRoot);
    // eslint-disable-next-line no-await-in-loop
    await copyFileEnsured(from, to);
  }

  const readme = createReadme({ prefix: p, selectedSuffixes: selected });
  await fs.writeFile(path.join(outAbs, 'README.md'), readme);

  return {
    outDir: outAbs,
    prefix: p,
    components: selected,
    warnings,
    copiedElements: copiedComponentEntries.map((x) => toPosixPath(path.relative(outAbs, x))),
  };
}

function normalizePageEntry(entry) {
  const value = String(entry ?? 'boot').trim();
  if (value === '@wcf' || value === 'index' || value === 'boot') return value;
  throw createCliError('E_ENTRY_INVALID', `Invalid --entry: ${entry} (use @wcf | index | boot)`);
}

function getDeprecatedEntryWarning(entry) {
  if (entry === 'boot') return null;
  return `W_ENTRY_DEPRECATED: --entry ${entry} is deprecated in release N and will be removed in N+1. Use --entry boot.`;
}

function toImportPath(relPath) {
  const normalized = toPosixPath(relPath);
  if (normalized.startsWith('/') || normalized.startsWith('./') || normalized.startsWith('../')) {
    return normalized;
  }
  return `./${normalized}`;
}

function replaceCanonicalPrefixInHtml(html, prefix) {
  return String(html ?? '').replace(/\bdads-/g, `${prefix}-`);
}

function createFallbackSampleHtml(prefix, selectedComponents) {
  const tags = selectedComponents.map((suffix) => `<${prefix}-${suffix}></${prefix}-${suffix}>`).join('\n    ');
  return `<main>
  <h1>${prefix} page</h1>
  <section>
    ${tags}
  </section>
</main>`;
}

function createEntryImportLine({ entry, vendorDirImportPath }) {
  if (entry === '@wcf') return "import '@wcf';";
  if (entry === 'index') return `import '${vendorDirImportPath}/index.js';`;
  return `import '${vendorDirImportPath}/boot.js';`;
}

function createImportMapForPage({ entry, prefix, vendorDirImportPath, selectedComponents }) {
  if (entry === '@wcf') {
    const imports = {
      '@wcf': `${vendorDirImportPath}/index.js`,
    };
    for (const suffix of selectedComponents) {
      imports[`@wcf/${suffix}`] = `${vendorDirImportPath}/autoload/${suffix}.js`;
    }
    return imports;
  }

  if (entry === 'boot') {
    const imports = {};
    for (const suffix of selectedComponents) {
      imports[`${prefix}-${suffix}`] = `${vendorDirImportPath}/components/${suffix}.js`;
    }
    return imports;
  }

  if (entry === 'index') {
    return {
      '@wcf': `${vendorDirImportPath}/index.js`,
    };
  }

  return {};
}

function createPageHtml({
  title,
  importMap,
  entryImportLine,
  bodyHtml,
  includeSubmitHandler = true,
}) {
  const importMapScript =
    Object.keys(importMap).length > 0
      ? [
          '<script type="importmap">',
          JSON.stringify({ imports: importMap }, null, 2),
          '</script>',
          '',
        ].join('\n')
      : '';

  const submitHandlerScript = includeSubmitHandler
    ? [
        '<script type="module">',
        "  const form = document.querySelector('form');",
        "  form?.addEventListener('submit', (event) => {",
        '    event.preventDefault();',
        "    console.log('submit');",
        '  });',
        '</script>',
      ].join('\n')
    : '';

  return [
    '<!doctype html>',
    '<html lang="ja">',
    '  <head>',
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${title}</title>`,
    '',
    importMapScript
      .split('\n')
      .filter(Boolean)
      .map((line) => `    ${line}`)
      .join('\n'),
    '    <script type="module">',
    `      ${entryImportLine}`,
    '    </script>',
    '  </head>',
    '  <body>',
    bodyHtml
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n'),
    '',
    submitHandlerScript
      .split('\n')
      .filter(Boolean)
      .map((line) => `    ${line}`)
      .join('\n'),
    '  </body>',
    '</html>',
    '',
  ].join('\n');
}

export async function createPage({
  prefix,
  pattern,
  dir = '.',
  entry = 'boot',
  vendorDir = null,
  file = 'index.html',
  force = false,
}) {
  const p = normalizePrefix(prefix);
  const selectedEntry = normalizePageEntry(entry);
  const deprecatedEntryWarning = getDeprecatedEntryWarning(selectedEntry);
  const outputDir = path.resolve(process.cwd(), dir);
  const vendorDirInput = vendorDir ?? path.join('vendor', 'components', p);
  const vendorAbs = path.isAbsolute(vendorDirInput) ? vendorDirInput : path.resolve(outputDir, vendorDirInput);
  const vendorRel = path.relative(outputDir, vendorAbs);
  const vendorDirImportPath = toImportPath(toPosixPath(vendorRel || '.'));

  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const patternDef = ensurePatternExists(registry, pattern);
  const { selected, warnings } = resolveSelectedSuffixes({ registry, pattern, components: [] });

  await ensureDir(outputDir);
  const outFile = path.join(outputDir, file);
  if (!force && (await pathExists(outFile))) {
    throw createCliError('E_PAGE_EXISTS', `File already exists: ${outFile}. Pass --force to overwrite.`);
  }

  const importMap = createImportMapForPage({
    entry: selectedEntry,
    prefix: p,
    vendorDirImportPath,
    selectedComponents: selected,
  });
  const bodyHtml = replaceCanonicalPrefixInHtml(
    patternDef.sampleHtml || createFallbackSampleHtml(p, selected),
    p,
  );
  const entryImportLine = createEntryImportLine({
    entry: selectedEntry,
    vendorDirImportPath,
  });
  const title = patternDef.title ?? pattern;
  const pageHtml = createPageHtml({
    title,
    importMap,
    entryImportLine,
    bodyHtml,
    includeSubmitHandler: /<form[\s>]/i.test(bodyHtml),
  });
  await fs.writeFile(outFile, pageHtml, 'utf8');

  return {
    file: outFile,
    pattern,
    title,
    entry: selectedEntry,
    prefix: p,
    vendorDir: vendorDirImportPath,
    warnings: [...warnings, ...(deprecatedEntryWarning ? [deprecatedEntryWarning] : [])],
  };
}

function buildAgentReadme({ prefix, pattern }) {
  return [
    '# WCF Agent Kit',
    '',
    'This directory contains only agent-facing instructions and helper scripts.',
    '',
    '## Files',
    '',
    '- `.wcf/AGENT_GUIDE.md`: short runbook for coding agents',
    '- `skills/wcf-vendor-install/SKILL.md`: detailed operating steps',
    '- `prompts/create-page.md`: prompt template to generate `index.html`',
    '- `scripts/wcf-install.sh`: installs editable vendor components (CLI compatibility mode)',
    '- `scripts/wcf-print-importmap.sh`: prints an HTML importmap block (CLI compatibility mode)',
    '- `scripts/wcf-create-page.sh`: creates `index.html` from a pattern',
    '',
    '## Default values',
    '',
    `- prefix: \`${prefix}\``,
    `- pattern: \`${pattern}\``,
    '',
    '## Usage',
    '',
    '### Runners (equal priority)',
    '',
    '- npm: `npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- wcf ...`',
    '- bunx: `bunx --package git+https://github.com/monoharada/web-components-factory.git wcf ...`',
    '- bun create: `bun create github.com/monoharada/web-components-factory my-app` then local `node scripts/wcf/cli.js ...`',
    '',
    '```bash',
    './scripts/wcf-install.sh',
    './scripts/wcf-create-page.sh',
    'python3 -m http.server 4173',
    '# open http://localhost:4173/index.html',
    '```',
    '',
    'No bundling/minification is used.',
    'Installed files remain editable under `vendor/components/<prefix>/components/**` (or legacy `wcf/packages/**`).',
    '',
  ].join('\n');
}

function buildAgentInstructions() {
  return [
    '# Agent Guide',
    '',
    '1. Read `skills/wcf-vendor-install/SKILL.md` first.',
    '2. Execute `scripts/wcf-install.sh` to install editable web components.',
    '3. Execute `scripts/wcf-create-page.sh` to scaffold `index.html`.',
    '',
    'Constraints:',
    '- Keep no-build workflow (no bundler/minifier).',
    '- Do not copy `custom-elements.json` into vendor output.',
    '- Keep generated JS editable for the local user.',
    '',
  ].join('\n');
}

function buildAgentSkill({ pattern, selectedComponents }) {
  return [
    '# wcf-vendor-install',
    '',
    '## Goal',
    '',
    'Install editable Web Components into `vendor/components/<prefix>/` and generate an importmap for HTML-only usage.',
    '',
    '## Pattern',
    '',
    `- name: \`${pattern}\``,
    `- components: ${selectedComponents.map((c) => `\`${c}\``).join(', ')}`,
    '',
    '## Steps',
    '',
    '1. Run:',
    '```bash',
    './scripts/wcf-install.sh',
    '```',
    '2. Scaffold page from pattern:',
    '```bash',
    './scripts/wcf-create-page.sh',
    '```',
    '3. If you need manual importmap, run:',
    '```bash',
    './scripts/wcf-print-importmap.sh',
    '```',
    '4. Preferred entry (`boot`):',
    '```html',
    '<script type="module">',
    "  import './vendor/components/<prefix>/boot.js';",
    '</script>',
    '```',
    '5. Compatibility entries (`@wcf` / `index`) are deprecated in release N and removed in N+1:',
    '```html',
    '<script type="module">',
    "  import '@wcf';",
    '</script>',
    '```',
    '```html',
    '<script type="module">',
    "  import './vendor/components/<prefix>/index.js';",
    '</script>',
    '```',
    '6. Serve over HTTP (not `file://`):',
    '```bash',
    'python3 -m http.server 4173',
    '```',
    '',
    '## Validation checklist',
    '',
    '- `vendor/components/<prefix>/importmap.snippet.json` or helper-generated importmap exists',
    '- `vendor/components/<prefix>/components/*.js` または `vendor/components/<prefix>/autoload/*.js` が存在',
    '- `vendor/components/<prefix>/components/**` または `vendor/components/<prefix>/wcf/packages/**` が編集可能',
    '- no hashed filenames (for example `*-abcd1234.js`)',
    '',
  ].join('\n');
}

function buildAgentPrompt({ prefix, pattern, selectedComponents }) {
  return [
    '# Prompt: Build no-build page with vendor Web Components',
    '',
    'Use this prompt with any coding agent.',
    '',
    '```text',
    'You are a coding agent. Build a single `index.html` page with no bundler.',
    '',
    'Requirements:',
    '- Use vendor-installed web components only.',
    '- Keep JS minimal.',
    '- Keep all files editable by local users.',
    '',
    `Defaults: prefix=${prefix}, pattern=${pattern}`,
    `Expected components: ${selectedComponents.join(', ')}`,
    '',
    'Commands to execute:',
    '1) ./scripts/wcf-install.sh',
    '2) ./scripts/wcf-create-page.sh',
    '3) (optional) ./scripts/wcf-print-importmap.sh',
    '',
    'Then create/update index.html to include:',
    '- printed importmap in <head>',
    '- <script type="module">import "./vendor/components/<prefix>/boot.js"</script> を推奨',
    '- `@wcf` / `index.js` は互換モード（deprecated, N+1で廃止予定）',
    '- a page body using the expected components',
    '',
    'Finally report:',
    '- executed commands',
    '- changed files',
    '- full index.html content',
    '```',
    '',
  ].join('\n');
}

function buildInstallScript({ prefix, pattern, selectedComponents }) {
  const componentList = selectedComponents.map((c) => `"${c}"`).join(' ');
  return [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    '',
    `PREFIX="\${1:-${prefix}}"`,
    'VENDOR_DIR="\${2:-vendor/components/\${PREFIX}}"',
    `PATTERN="\${3:-${pattern}}"`,
    '',
    'run_wcf() {',
    '  if [[ -n "${WCF_BIN:-}" ]]; then',
    '    ${WCF_BIN} "$@"',
    '    return',
    '  fi',
    '  if [[ -f "./scripts/wcf/cli.js" ]]; then',
    '    node ./scripts/wcf/cli.js "$@"',
    '    return',
    '  fi',
    '  npm exec --yes --package="${WCF_PACKAGE:-git+https://github.com/monoharada/web-components-factory.git}" -- wcf "$@"',
    '}',
    '',
    'if run_wcf vendor install --prefix "${PREFIX}" --dir "${VENDOR_DIR}" --pattern "${PATTERN}" >/dev/null 2>&1; then',
    '  run_wcf vendor install --prefix "${PREFIX}" --dir "${VENDOR_DIR}" --pattern "${PATTERN}"',
    '  exit 0',
    'fi',
    '',
    'run_wcf init --prefix "${PREFIX}" --out "${VENDOR_DIR}"',
    'if run_wcf add --pattern "${PATTERN}" --prefix "${PREFIX}" --out "${VENDOR_DIR}" >/dev/null 2>&1; then',
    '  run_wcf add --pattern "${PATTERN}" --prefix "${PREFIX}" --out "${VENDOR_DIR}"',
    '  exit 0',
    'fi',
    '',
    `COMPONENTS=(${componentList})`,
    'run_wcf add "${COMPONENTS[@]}" --prefix "${PREFIX}" --out "${VENDOR_DIR}"',
    '',
  ].join('\n');
}

function buildImportMapScript({ prefix, pattern }) {
  return [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    '',
    `PREFIX="\${1:-${prefix}}"`,
    'VENDOR_DIR="\${2:-vendor/components/\${PREFIX}}"',
    `PATTERN="\${3:-${pattern}}"`,
    '',
    'run_wcf() {',
    '  if [[ -n "${WCF_BIN:-}" ]]; then',
    '    ${WCF_BIN} "$@"',
    '    return',
    '  fi',
    '  if [[ -f "./scripts/wcf/cli.js" ]]; then',
    '    node ./scripts/wcf/cli.js "$@"',
    '    return',
    '  fi',
    '  npm exec --yes --package="${WCF_PACKAGE:-git+https://github.com/monoharada/web-components-factory.git}" -- wcf "$@"',
    '}',
    '',
    'if run_wcf vendor print-importmap --prefix "${PREFIX}" --dir "${VENDOR_DIR}" --pattern "${PATTERN}" --format html >/dev/null 2>&1; then',
    '  run_wcf vendor print-importmap --prefix "${PREFIX}" --dir "${VENDOR_DIR}" --pattern "${PATTERN}" --format html',
    '  exit 0',
    'fi',
    '',
    'SNIPPET="${VENDOR_DIR}/importmap.snippet.json"',
    'if [[ ! -f "${SNIPPET}" ]]; then',
    '  echo "Missing importmap snippet: ${SNIPPET}" >&2',
    '  exit 1',
    'fi',
    '',
    'echo \'<script type="importmap">\'',
    'cat "${SNIPPET}"',
    'echo \'</script>\'',
    '',
  ].join('\n');
}

function buildCreatePageScript({ prefix, pattern }) {
  return [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    '',
    `PREFIX="\${1:-${prefix}}"`,
    `PATTERN="\${2:-${pattern}}"`,
    'PAGE_DIR="${3:-.}"',
    'ENTRY="${4:-boot}"',
    'VENDOR_DIR="${5:-vendor/components/${PREFIX}}"',
    '',
    'run_wcf() {',
    '  if [[ -n "${WCF_BIN:-}" ]]; then',
    '    ${WCF_BIN} "$@"',
    '    return',
    '  fi',
    '  if [[ -f "./scripts/wcf/cli.js" ]]; then',
    '    node ./scripts/wcf/cli.js "$@"',
    '    return',
    '  fi',
    '  npm exec --yes --package="${WCF_PACKAGE:-git+https://github.com/monoharada/web-components-factory.git}" -- wcf "$@"',
    '}',
    '',
    'run_wcf page create --pattern "${PATTERN}" --prefix "${PREFIX}" --dir "${PAGE_DIR}" --entry "${ENTRY}" --vendor-dir "${VENDOR_DIR}"',
    '',
  ].join('\n');
}

export async function initAgentKit({ prefix, outDir, pattern = 'search-results' }) {
  const p = normalizePrefix(prefix);
  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const { selected, warnings } = resolveSelectedSuffixes({ registry, pattern, components: [] });
  const outAbs = path.resolve(process.cwd(), outDir);
  await ensureDir(outAbs);

  const files = [
    {
      rel: path.join('.wcf', 'AGENT_GUIDE.md'),
      text: buildAgentInstructions(),
      executable: false,
    },
    {
      rel: path.join('README.wcf.md'),
      text: buildAgentReadme({ prefix: p, pattern }),
      executable: false,
    },
    {
      rel: path.join('skills', 'wcf-vendor-install', 'SKILL.md'),
      text: buildAgentSkill({ pattern, selectedComponents: selected }),
      executable: false,
    },
    {
      rel: path.join('prompts', 'create-page.md'),
      text: buildAgentPrompt({ prefix: p, pattern, selectedComponents: selected }),
      executable: false,
    },
    {
      rel: path.join('scripts', 'wcf-install.sh'),
      text: buildInstallScript({ prefix: p, pattern, selectedComponents: selected }),
      executable: true,
    },
    {
      rel: path.join('scripts', 'wcf-print-importmap.sh'),
      text: buildImportMapScript({ prefix: p, pattern }),
      executable: true,
    },
    {
      rel: path.join('scripts', 'wcf-create-page.sh'),
      text: buildCreatePageScript({ prefix: p, pattern }),
      executable: true,
    },
  ];

  for (const file of files) {
    const abs = path.join(outAbs, file.rel);
    // eslint-disable-next-line no-await-in-loop
    if (await pathExists(abs)) {
      throw new Error(`Refusing to overwrite existing file: ${abs}`);
    }
  }

  for (const file of files) {
    const abs = path.join(outAbs, file.rel);
    // eslint-disable-next-line no-await-in-loop
    await ensureDir(path.dirname(abs));
    // eslint-disable-next-line no-await-in-loop
    await fs.writeFile(abs, file.text, 'utf8');
    if (file.executable) {
      // eslint-disable-next-line no-await-in-loop
      await fs.chmod(abs, 0o755);
    }
  }

  return {
    outDir: outAbs,
    prefix: p,
    pattern,
    warnings,
    files: files.map((f) => toPosixPath(f.rel)),
  };
}

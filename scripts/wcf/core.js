import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { contentTypesetStylesText } from '../../vendor-runtime/src/styles/content-typeset.js';
import {
  loadExtensionConfig,
  loadExternalRegistry,
  mergeRegistries,
  detectSuffixConflicts,
  validateDeps,
  loadAllExtensions,
} from './extension.js';

const CLI_PATTERN_CONTRACT_MAJOR = 1;

function findPackageRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..', '..');
}

function toPosixPath(p) {
  return String(p).replace(/\\/g, '/');
}

function sortStrings(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function normalizePrefix(prefix) {
  const value = String(prefix ?? '').trim().toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    throw new Error(`Invalid --prefix: ${prefix}`);
  }
  return value;
}

function isSubPath(childAbs, parentAbs) {
  const rel = path.relative(parentAbs, childAbs);
  if (rel === '' || rel === '.') return false;
  if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
  return true;
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

function resolveVendorOutDir(outDir) {
  const raw = String(outDir ?? '').trim();
  if (!raw) {
    throw new Error('Invalid --dir (empty)');
  }

  const cwdAbs = path.resolve(process.cwd());
  const outAbs = path.resolve(cwdAbs, raw);
  if (outAbs === cwdAbs) {
    throw new Error(`Refusing --dir pointing to project root: ${raw}`);
  }
  if (!isSubPath(outAbs, cwdAbs)) {
    throw new Error(`Refusing --dir outside the project: ${raw}`);
  }
  return outAbs;
}

async function prepareVendorOutDir(outAbs, { force = false } = {}) {
  if (!(await pathExists(outAbs))) {
    await ensureDir(outAbs);
    return;
  }

  const entries = await fs.readdir(outAbs);
  if (entries.length === 0) return;

  if (!force) {
    throw new Error(`Output directory is not empty: ${outAbs}. Pass --force to overwrite.`);
  }

  if (!(await isManagedVendorInstallDir(outAbs))) {
    throw new Error(`Refusing --force on unmanaged output directory: ${outAbs}`);
  }

  await resetManagedVendorInstallDir(outAbs);
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

  return sortStrings(visited);
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

async function isManagedVendorInstallDir(outAbs) {
  const readmePath = path.join(outAbs, 'README.md');
  try {
    const text = await fs.readFile(readmePath, 'utf8');
    return text.includes('# wcf vendor install output');
  } catch {
    return false;
  }
}

async function resetManagedVendorInstallDir(outAbs) {
  const generatedTargets = ['components', 'autoload', 'boot.js', 'index.js', 'wc-autoloader.js', 'README.md'];
  for (const target of generatedTargets) {
    // eslint-disable-next-line no-await-in-loop
    await fs.rm(path.join(outAbs, target), { recursive: true, force: true });
  }
}

function normalizeRelDirForImportMap(dir) {
  const normalized = toPosixPath(String(dir ?? '').trim());
  if (!normalized) throw new Error('Missing --dir');
  if (normalized.startsWith('/')) return normalized;
  if (normalized.startsWith('./') || normalized.startsWith('../')) return normalized;
  return `./${normalized}`;
}

import { createCliError } from './errors.js';
export { createCliError };

function normalizeSuffix(value, prefix = 'dads') {
  const normalized = String(value ?? '').trim().toLowerCase();
  const normalizedPrefix = String(prefix ?? '').trim().toLowerCase();
  const canonicalPrefix = normalizedPrefix ? `${normalizedPrefix}-` : '';
  if (canonicalPrefix && normalized.startsWith(canonicalPrefix)) {
    return normalized.slice(canonicalPrefix.length);
  }
  return normalized;
}

function resolveComponentClosureFromInstallRegistry({ installRegistry, requiredIds }) {
  const installComponents = installRegistry?.components ?? {};
  const visited = new Set();
  const queue = [...requiredIds];

  while (queue.length > 0) {
    const nextId = String(queue.shift() ?? '').trim();
    if (!nextId || visited.has(nextId)) continue;
    const meta = installComponents[nextId];
    if (!meta || typeof meta !== 'object') {
      throw createCliError('E_COMPONENT_UNKNOWN', `Unknown component dependency: ${nextId}`);
    }

    visited.add(nextId);
    const deps = Array.isArray(meta.deps) ? meta.deps : [];
    for (const dep of deps) {
      const normalized = String(dep ?? '').trim();
      if (normalized) queue.push(normalized);
    }
  }

  return sortStrings(visited);
}

function componentIdToSuffixes({ componentId, installRegistry }) {
  const canonicalPrefix = String(installRegistry?.canonicalPrefix ?? 'dads').trim();
  const installComponents = installRegistry?.components ?? {};
  const meta = installComponents?.[componentId];
  if (!meta || typeof meta !== 'object') {
    throw createCliError('E_COMPONENT_UNKNOWN', `Unknown componentId "${componentId}" in install-registry`);
  }

  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  if (tags.length === 0) {
    throw createCliError('E_COMPONENT_UNKNOWN', `Component "${componentId}" has no tags in install-registry`);
  }

  const prefix = canonicalPrefix ? `${canonicalPrefix}-` : '';
  const suffixes = new Set();
  for (const rawTag of tags) {
    const tag = String(rawTag ?? '').trim().toLowerCase();
    if (!tag) continue;
    const suffix = tag.startsWith(prefix) ? tag.slice(prefix.length) : tag;
    if (!suffix) continue;
    suffixes.add(suffix);
  }

  if (suffixes.size === 0) {
    throw createCliError('E_COMPONENT_UNKNOWN', `Component "${componentId}" has no valid tags in install-registry`);
  }

  return [...suffixes].sort((a, b) => a.localeCompare(b));
}

function buildSuffixToComponentIdMap(installRegistry) {
  const canonicalPrefix = String(installRegistry?.canonicalPrefix ?? 'dads').trim();
  const byTag = installRegistry?.tags ?? {};
  const map = {};

  if (byTag && typeof byTag === 'object') {
    for (const [rawTag, componentId] of Object.entries(byTag)) {
      const tag = String(rawTag ?? '').trim().toLowerCase();
      const normalizedComponentId = String(componentId ?? '').trim();
      if (!tag || !normalizedComponentId) continue;
      map[normalizeSuffix(tag, canonicalPrefix)] = normalizedComponentId;
    }
    return map;
  }

  const installComponents = installRegistry?.components ?? {};
  for (const [componentId, meta] of Object.entries(installComponents)) {
    const tags = Array.isArray(meta?.tags) ? meta.tags : [];
    for (const rawTag of tags) {
      const tag = String(rawTag ?? '').trim().toLowerCase();
      if (!tag) continue;
      map[normalizeSuffix(tag, canonicalPrefix)] = componentId;
    }
  }

  return map;
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

async function resolveSelectedSuffixes({
  registry,
  pattern,
  components = [],
  includeDeps = true,
  includeInstallRegistry = null,
}) {
  const selected = new Set();
  const warnings = [];
  let selectedPattern = null;
  if (pattern) {
    const p = ensurePatternExists(registry, pattern);
    selectedPattern = p;
    warnings.push(...validatePatternContract({ registry, patternName: pattern, pattern: p }));
    for (const suffix of p.components ?? []) selected.add(String(suffix));
  }

  if (components.length > 0) {
    if (includeDeps) {
      const installRegistry = includeInstallRegistry ?? (await loadInstallRegistry(findPackageRoot()));
      const canonicalPrefix = String(installRegistry?.canonicalPrefix ?? 'dads').trim();
      const suffixToComponentId = buildSuffixToComponentIdMap(installRegistry);
      const componentIds = [];

      for (const raw of components) {
        const suffix = normalizeSuffix(raw, canonicalPrefix);
        if (!suffix) continue;
        const componentId = suffixToComponentId[suffix];
        if (!componentId) {
          throw createCliError('E_COMPONENT_UNKNOWN', `Unknown component: ${String(raw ?? '').trim()}`);
        }
        componentIds.push(componentId);
      }

      const closureIds = resolveComponentClosureFromInstallRegistry({
        installRegistry,
        requiredIds: componentIds,
      });

      for (const componentId of closureIds) {
        for (const suffix of componentIdToSuffixes({ componentId, installRegistry })) {
          selected.add(suffix);
        }
      }
    } else {
      const canonicalPrefix = 'dads';
      for (const raw of components) {
        const value = normalizeSuffix(raw, canonicalPrefix);
        if (!value) continue;
        selected.add(value);
      }
    }
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
    selected: sortStrings(selected),
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

async function loadInstallRegistry(pkgRoot) {
  const installRegistryPath = path.join(pkgRoot, 'registry', 'install-registry.json');
  if (!(await pathExists(installRegistryPath))) {
    throw new Error(`Missing install registry: ${installRegistryPath}`);
  }
  return readJson(installRegistryPath);
}

/**
 * Load merged registry combining core install-registry with extensions.
 * Returns { registry, installRegistry, merged } where merged is null if no extensions.
 */
export async function loadMergedRegistry(pkgRoot, { projectRoot = null, cliRegistries = [] } = {}) {
  const { registry } = await loadRegistry(pkgRoot);
  const installRegistry = await loadInstallRegistry(pkgRoot);

  const resolvedProjectRoot = projectRoot || process.cwd();
  let extensions = [];
  const loadWarnings = [];

  // Load extensions from .wcf/extensions.json
  try {
    extensions = await loadAllExtensions(resolvedProjectRoot);
  } catch (extError) {
    loadWarnings.push(
      `W_EXTENSION_LOAD_FAILED: ローカル拡張設定の読み込みに失敗しました: ${extError?.message ?? extError}`,
    );
    extensions = [];
  }

  // Load CLI-specified registries
  for (const source of cliRegistries) {
    // eslint-disable-next-line no-await-in-loop
    const { registry: extReg } = await loadExternalRegistry(source, resolvedProjectRoot);
    const name = path.basename(source, path.extname(source)).replace(/[-_]?registry$/i, '') || source;
    extensions.push({ name, registry: extReg });
  }

  // Fast path: no extensions → preserve existing behavior exactly
  if (extensions.length === 0) {
    return { registry, installRegistry, merged: null, warnings: loadWarnings.length > 0 ? loadWarnings : undefined };
  }

  const { merged, warnings } = mergeRegistries({ core: installRegistry, extensions });
  warnings.push(...loadWarnings);
  validateDeps(merged);

  // Build a runtime-compatible registry from merged data
  const mergedRuntime = buildMergedRuntime(merged, registry);

  return { registry: mergedRuntime, installRegistry: merged, merged, warnings };
}

function buildMergedRuntime(merged, coreRegistry) {
  const runtime = {
    ...coreRegistry,
    components: { ...coreRegistry.components },
    patterns: { ...coreRegistry.patterns },
  };

  // MVP: Extension components are NOT added to runtime.
  // Extension file copy/vendor install is planned for Phase 2.
  // Extensions currently support merge, conflict detection, and CRUD management only.

  return runtime;
}

async function copyFileEnsured(from, to) {
  await ensureDir(path.dirname(to));
  await fs.copyFile(from, to);
}

async function listFilesRecursive(root) {
  if (!(await pathExists(root))) return [];
  const out = [];
  const stack = [root];

  while (stack.length > 0) {
    const dir = stack.pop();
    if (!dir) continue;
    // eslint-disable-next-line no-await-in-loop
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(abs);
        continue;
      }
      if (entry.isFile()) out.push(abs);
    }
  }

  return sortStrings(out);
}

async function readFileIfExists(filePath) {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function collectExistingManagedComponents({ outAbs, registry }) {
  const known = registry?.components ?? {};
  const componentsDir = path.join(outAbs, 'components');
  if (!(await pathExists(componentsDir))) return [];

  const entries = await fs.readdir(componentsDir, { withFileTypes: true });
  const selected = new Set();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    const suffix = path.basename(entry.name, '.js');
    if (known[suffix]) selected.add(suffix);
  }

  return sortStrings(selected);
}

async function detectVendorDrift({ stageDir, targetDir }) {
  const stageFiles = await listFilesRecursive(stageDir);
  const drift = [];

  for (const stageFile of stageFiles) {
    const rel = toPosixPath(path.relative(stageDir, stageFile));
    const targetFile = path.join(targetDir, rel);
    // eslint-disable-next-line no-await-in-loop
    const targetBuf = await readFileIfExists(targetFile);
    if (!targetBuf) continue;
    // eslint-disable-next-line no-await-in-loop
    const stageBuf = await fs.readFile(stageFile);
    if (!stageBuf.equals(targetBuf)) drift.push(rel);
  }

  return sortStrings(drift);
}

async function copyTree({ fromDir, toDir }) {
  const files = await listFilesRecursive(fromDir);
  for (const filePath of files) {
    const rel = path.relative(fromDir, filePath);
    const to = path.join(toDir, rel);
    // eslint-disable-next-line no-await-in-loop
    await copyFileEnsured(filePath, to);
  }
}

export async function listPatterns() {
  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const patterns = registry?.patterns ?? {};
  return sortStrings(Object.keys(patterns))
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

export async function buildImportMap({
  prefix,
  dir,
  pattern = null,
  components = [],
  includeDeps = true,
}) {
  const p = normalizePrefix(prefix);
  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const { selected, warnings } = await resolveSelectedSuffixes({
    registry,
    pattern,
    components,
    includeDeps,
  });
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

export async function printImportMap({
  prefix,
  dir,
  pattern = null,
  components = [],
  includeDeps = true,
  format = 'json',
}) {
  const map = await buildImportMap({ prefix, dir, pattern, components, includeDeps });
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

export async function vendorInstall({
  prefix,
  outDir,
  pattern = null,
  components = [],
  includeDeps = true,
  force = false,
  registries = [],
}) {
  const p = normalizePrefix(prefix);
  const pkgRoot = findPackageRoot();
  const runtimeRoot = path.join(pkgRoot, 'vendor-runtime');
  const runtimeSrcRoot = path.join(runtimeRoot, 'src');

  if (!(await pathExists(runtimeSrcRoot))) {
    throw new Error(`Missing vendor runtime source: ${runtimeSrcRoot}. Run \`npm run vendor:build\` first.`);
  }

  let registry;
  let installRegistry;
  let mergedData = null;
  const mergeWarnings = [];

  if (registries.length > 0) {
    const result = await loadMergedRegistry(pkgRoot, { cliRegistries: registries });
    registry = result.registry;
    installRegistry = result.installRegistry;
    mergedData = result.merged;
    if (result.warnings) mergeWarnings.push(...result.warnings);
  } else {
    // Try loading with project extensions
    try {
      const result = await loadMergedRegistry(pkgRoot);
      registry = result.registry;
      installRegistry = result.installRegistry;
      mergedData = result.merged;
      if (result.warnings) mergeWarnings.push(...result.warnings);
    } catch (extError) {
      mergeWarnings.push(
        `W_EXTENSION_LOAD_FAILED: 拡張レジストリの読み込みに失敗しました: ${extError?.message ?? extError}`,
      );
      const coreResult = await loadRegistry(pkgRoot);
      registry = coreResult.registry;
      installRegistry = null;
      mergedData = null;
    }
  }

  // Phase 2 suffix conflict detection when extensions are present
  if (mergedData) {
    detectSuffixConflicts(mergedData, p);
  }

  const { selected, warnings } = await resolveSelectedSuffixes({
    registry,
    pattern,
    components,
    includeDeps,
    includeInstallRegistry: installRegistry,
  });
  warnings.push(...mergeWarnings);

  const outAbs = resolveVendorOutDir(outDir);
  await prepareVendorOutDir(outAbs, { force });

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
  const indexShimLines = createShimHeaderLines({
    prefix: p,
    configImportPath: './components/config.js',
  });
  for (const suffix of selected) {
    indexShimLines.push(`await import('./components/${suffix}.js');`);
  }
  indexShimLines.push('');
  await fs.writeFile(path.join(outAbs, 'index.js'), `${indexShimLines.join('\n')}\n`, 'utf8');

  for (const suffix of selected) {
    const shim = [
      ...createShimHeaderLines({
        prefix: p,
        configImportPath: '../components/config.js',
      }),
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

export async function vendorAdd({
  prefix,
  outDir,
  pattern = null,
  components = [],
  includeDeps = true,
  force = false,
  registries = [],
}) {
  const p = normalizePrefix(prefix);
  const pkgRoot = findPackageRoot();
  const { registry } = await loadRegistry(pkgRoot);
  const outAbs = resolveVendorOutDir(outDir);
  const existing = await collectExistingManagedComponents({ outAbs, registry });
  const { selected: requested, warnings } = await resolveSelectedSuffixes({
    registry,
    pattern,
    components,
    includeDeps,
  });

  const merged = sortStrings(new Set([...existing, ...requested]));
  const existingSet = new Set(existing);
  const addedComponents = sortStrings(requested.filter((name) => !existingSet.has(name)));
  const stageRoot = await fs.mkdtemp(path.join(process.cwd(), '.wcf-vendor-stage-'));
  const stageCurrent = path.join(stageRoot, 'current');
  const stageMerged = path.join(stageRoot, 'merged');

  try {
    if (existing.length > 0) {
      await vendorInstall({
        prefix: p,
        outDir: stageCurrent,
        components: existing,
        includeDeps,
        force: true,
        registries,
      });

      const driftFiles = await detectVendorDrift({
        stageDir: stageCurrent,
        targetDir: outAbs,
      });
      if (driftFiles.length > 0 && !force) {
        throw createCliError(
          'E_VENDOR_DRIFT',
          `Detected locally modified vendor files. Pass --force to overwrite.\n- ${driftFiles.join('\n- ')}`,
        );
      }
    }

    await vendorInstall({
      prefix: p,
      outDir: stageMerged,
      components: merged,
      includeDeps,
      force: true,
      registries,
    });

    if (existing.length === 0) {
      const driftFiles = await detectVendorDrift({
        stageDir: stageMerged,
        targetDir: outAbs,
      });
      if (driftFiles.length > 0 && !force) {
        throw createCliError(
          'E_VENDOR_DRIFT',
          `Detected locally modified vendor files. Pass --force to overwrite.\n- ${driftFiles.join('\n- ')}`,
        );
      }
    }

    await ensureDir(outAbs);
    await copyTree({ fromDir: stageMerged, toDir: outAbs });
  } finally {
    await fs.rm(stageRoot, { recursive: true, force: true });
  }

  return {
    outDir: outAbs,
    prefix: p,
    components: merged,
    addedComponents,
    totalComponents: merged.length,
    warnings,
  };
}

export async function initProject({
  prefix,
  dir = '.',
  pattern,
  entry = 'boot',
  vendorDir = null,
  file = 'index.html',
  force = false,
}) {
  const p = normalizePrefix(prefix);
  const patternName = String(pattern ?? '').trim();
  if (!patternName) {
    throw new Error('Missing required option: --pattern');
  }

  const outputDir = path.resolve(process.cwd(), dir);
  const pageFile = path.join(outputDir, file);
  if (!force && (await pathExists(pageFile))) {
    throw createCliError('E_PAGE_EXISTS', `File already exists: ${pageFile}. Pass --force to overwrite.`);
  }

  const vendorDirInput = vendorDir ?? path.join('vendor', 'components', p);
  const vendorOutAbs = path.isAbsolute(vendorDirInput)
    ? vendorDirInput
    : path.resolve(outputDir, vendorDirInput);

  const vendorResult = await vendorInstall({
    prefix: p,
    outDir: vendorOutAbs,
    pattern: patternName,
    force,
  });
  const pageResult = await createPage({
    prefix: p,
    pattern: patternName,
    dir: outputDir,
    entry,
    vendorDir: vendorOutAbs,
    file,
    force,
  });

  return {
    dir: outputDir,
    file: pageResult.file,
    pattern: pageResult.pattern,
    entry: pageResult.entry,
    prefix: p,
    vendorDir: vendorResult.outDir,
    components: vendorResult.components,
    warnings: [...vendorResult.warnings, ...pageResult.warnings],
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

function createShimHeaderLines({ prefix, configImportPath }) {
  return [
    `import { setConfig } from '${configImportPath}';`,
    `setConfig({ prefix: '${prefix}' });`,
  ];
}

function indentMultiline(text, { dropEmpty = false } = {}) {
  return String(text ?? '')
    .split('\n')
    .filter((line) => (dropEmpty ? line.length > 0 : true))
    .map((line) => `    ${line}`)
    .join('\n');
}

function replaceCanonicalPrefixInHtml(html, prefix) {
  return String(html ?? '').replace(/(<\/?\s*)dads-/g, `$1${prefix}-`);
}

function createFallbackSampleHtml(prefix, selectedComponents) {
  const tags = selectedComponents.map((suffix) => `<${prefix}-${suffix}></${prefix}-${suffix}>`).join('\n    ');
  return `<main data-dads-typeset>
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

  const typesetStyleTag = [
    '<style data-wcf-typeset>',
    contentTypesetStylesText,
    '</style>',
  ].join('\n');

  return [
    '<!doctype html>',
    '<html lang="ja">',
    '  <head>',
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${title}</title>`,
    '',
    indentMultiline(typesetStyleTag, { dropEmpty: true }),
    indentMultiline(importMapScript, { dropEmpty: true }),
    '    <script type="module">',
    `      ${entryImportLine}`,
    '    </script>',
    '  </head>',
    '  <body>',
    indentMultiline(bodyHtml),
    '',
    indentMultiline(submitHandlerScript, { dropEmpty: true }),
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
  const { selected, warnings } = await resolveSelectedSuffixes({
    registry,
    pattern,
    components: [],
  });

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
    '3. Generated page includes built-in typeset CSS (`@layer contents`) and expects `[data-dads-typeset]` on content container.',
    '4. If you need manual importmap, run:',
    '```bash',
    './scripts/wcf-print-importmap.sh',
    '```',
    '5. Preferred entry (`boot`):',
    '```html',
    '<script type="module">',
    "  import './vendor/components/<prefix>/boot.js';",
    '</script>',
    '```',
    '6. Compatibility entries (`@wcf` / `index`) are deprecated in release N and removed in N+1:',
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
    '7. Serve over HTTP (not `file://`):',
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
    '- built-in typeset CSS with `@layer ... contents` (or keep the generated `<style data-wcf-typeset>`)',
    '- apply `[data-dads-typeset]` to the content container (for example `<main data-dads-typeset>...</main>`)',
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
  const { selected, warnings } = await resolveSelectedSuffixes({ registry, pattern, components: [] });
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

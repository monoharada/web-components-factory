import fs from 'node:fs/promises';
import path from 'node:path';
import { createCliError } from './errors.js';

const EXTENSION_SCHEMA_VERSION = 1;
const EXTENSION_CONFIG_FILE = '.wcf/extensions.json';
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const COMPONENT_ID_RE = /^[a-z][a-z0-9-]*$/;
const JS_IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Validate that a componentDir path is safe (no traversal, no absolute paths).
 */
function assertSafeComponentDir(dir, componentId, source) {
  if (!dir || typeof dir !== 'string') return;
  if (dir.includes('..') || path.isAbsolute(dir)) {
    throw createCliError(
      'E_EXTENSION_INVALID',
      `不正なパスです: ${dir} (相対パスのみ許可、".." 禁止) [component: ${componentId}, source: ${source}]`,
    );
  }
}

/**
 * Validate external registry schema and security constraints.
 */
export function validateExternalRegistry(registry, source) {
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    throw createCliError('E_EXTENSION_INVALID', `拡張レジストリの形式が不正です: ${source} (オブジェクトが必要)`);
  }

  if (registry.schemaVersion !== EXTENSION_SCHEMA_VERSION) {
    throw createCliError(
      'E_EXTENSION_INVALID',
      `拡張レジストリの形式が不正です: ${source} (schemaVersion must be ${EXTENSION_SCHEMA_VERSION}, got ${registry.schemaVersion})`,
    );
  }

  if (!registry.components || typeof registry.components !== 'object' || Array.isArray(registry.components)) {
    throw createCliError(
      'E_EXTENSION_INVALID',
      `拡張レジストリの形式が不正です: ${source} (components オブジェクトが必要)`,
    );
  }

  // Validate component IDs and define names, plus path traversal defense
  for (const [id, comp] of Object.entries(registry.components)) {
    if (FORBIDDEN_KEYS.has(id)) {
      throw createCliError('E_EXTENSION_INVALID', `不正なコンポーネントIDです: ${id} (禁止キー) [source: ${source}]`);
    }
    if (!COMPONENT_ID_RE.test(id)) {
      throw createCliError(
        'E_EXTENSION_INVALID',
        `不正なコンポーネントIDです: ${id} (小文字英数字とハイフンのみ許可、先頭は小文字) [source: ${source}]`,
      );
    }
    if (comp && typeof comp === 'object') {
      if (comp.define && !JS_IDENTIFIER_RE.test(comp.define)) {
        throw createCliError(
          'E_EXTENSION_INVALID',
          `不正な define 名です: ${comp.define} (JS識別子のみ許可) [component: ${id}, source: ${source}]`,
        );
      }
      if (comp.source && typeof comp.source === 'object') {
        assertSafeComponentDir(comp.source.componentDir, id, source);
      }
    }
  }
}

/**
 * Load .wcf/extensions.json config from project root.
 * Returns a default empty config if the file does not exist.
 */
export async function loadExtensionConfig(projectRoot) {
  const configPath = path.join(projectRoot, EXTENSION_CONFIG_FILE);
  try {
    const text = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(text);
    if (!config || typeof config !== 'object') {
      return { schemaVersion: EXTENSION_SCHEMA_VERSION, extensions: [] };
    }
    if (!Array.isArray(config.extensions)) {
      config.extensions = [];
    }
    return config;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return { schemaVersion: EXTENSION_SCHEMA_VERSION, extensions: [] };
    }
    throw error;
  }
}

/**
 * Save .wcf/extensions.json config to project root.
 */
export async function saveExtensionConfig(projectRoot, config) {
  const configPath = path.join(projectRoot, EXTENSION_CONFIG_FILE);
  const dir = path.dirname(configPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

/**
 * Load an external registry from a local path.
 * The source is resolved relative to the projectRoot.
 */
export async function loadExternalRegistry(source, projectRoot) {
  const resolved = path.isAbsolute(source) ? source : path.resolve(projectRoot, source);

  try {
    const text = await fs.readFile(resolved, 'utf8');
    const registry = JSON.parse(text);
    validateExternalRegistry(registry, source);
    return { registry, resolvedPath: resolved };
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw createCliError('E_EXTENSION_NOT_FOUND', `拡張レジストリが見つかりません: ${source}`);
    }
    if (error?.code?.startsWith('E_EXTENSION_')) {
      throw error;
    }
    throw createCliError('E_EXTENSION_INVALID', `拡張レジストリの形式が不正です: ${source} (${error.message})`);
  }
}

/**
 * Resolve extension name from source path (auto-detect from meta.name or filename).
 */
export function resolveExtensionName(source, registry) {
  if (registry?.meta?.name && typeof registry.meta.name === 'string') {
    return registry.meta.name.trim();
  }
  const base = path.basename(source, path.extname(source));
  return base.replace(/[-_]?registry$/i, '') || base;
}

/**
 * Merge core install-registry with extension registries.
 * Phase 1 conflict detection: raw tag name collisions.
 */
export function mergeRegistries({ core, extensions = [] }) {
  const merged = {
    schemaVersion: core?.schemaVersion ?? EXTENSION_SCHEMA_VERSION,
    canonicalPrefix: core?.canonicalPrefix ?? 'dads',
    components: Object.create(null),
    tags: Object.create(null),
    patterns: Object.create(null),
    _sourceMap: Object.create(null),
    _meta: new Map(),
  };

  const conflicts = [];
  const warnings = [];

  // 1. Add core components
  addRegistryToMerged(merged, core, 'core', conflicts, warnings);

  // 2. Add extensions in order
  for (const ext of extensions) {
    if (!ext.registry) continue;
    const ns = ext.namespace ?? ext.name ?? 'unknown';
    addRegistryToMerged(merged, ext.registry, ns, conflicts, warnings);
  }

  // 3. Phase 1 conflict detection: tag name collisions are hard errors
  if (conflicts.length > 0) {
    const first = conflicts[0];
    throw createCliError(
      'E_EXTENSION_TAG_CONFLICT',
      `タグ名が競合しています: ${first.tag} (${first.sourceA} vs ${first.sourceB})`,
    );
  }

  // 4. Cyclic dependency detection
  const cycle = detectCyclicDeps(merged);
  if (cycle) {
    throw createCliError('E_EXTENSION_CIRCULAR_DEP', `循環依存が検出されました: ${cycle.join(' -> ')}`);
  }

  return { merged, warnings };
}

function addRegistryToMerged(merged, registry, namespace, conflicts, warnings) {
  if (!registry) return;

  const components = registry.components ?? {};
  for (const [id, comp] of Object.entries(components)) {
    if (FORBIDDEN_KEYS.has(id)) continue;
    const qualifiedId = namespace === 'core' ? id : `${namespace}:${id}`;

    // Check for component ID collision (warning, not error)
    if (merged.components[id] && namespace !== 'core') {
      const existingSource = merged._sourceMap[id] ?? 'core';
      warnings.push(
        `W_EXTENSION_ID_CONFLICT: コンポーネントID "${id}" が競合しています (${existingSource} vs ${namespace})。名前空間修飾 "${qualifiedId}" で共存します。`,
      );
      // Store with namespace-qualified key
      merged.components[qualifiedId] = { ...comp };
      merged._meta.set(qualifiedId, { namespace, qualifiedId });
      merged._sourceMap[qualifiedId] = namespace;
    } else if (!merged.components[id]) {
      merged.components[id] = { ...comp };
      merged._meta.set(id, { namespace, qualifiedId });
      merged._sourceMap[id] = namespace;
    }

    // Check for tag name collisions (hard error)
    const tags = Array.isArray(comp.tags) ? comp.tags : [];
    for (const tag of tags) {
      const normalizedTag = String(tag ?? '').trim().toLowerCase();
      if (!normalizedTag || FORBIDDEN_KEYS.has(normalizedTag)) continue;

      if (merged.tags[normalizedTag] && merged.tags[normalizedTag] !== id &&
          merged.tags[normalizedTag] !== qualifiedId) {
        const existingTagSource = merged._sourceMap[`tag:${normalizedTag}`] ?? 'core';
        conflicts.push({
          tag: normalizedTag,
          sourceA: existingTagSource,
          sourceB: namespace,
        });
      }

      if (!merged.tags[normalizedTag]) {
        merged.tags[normalizedTag] = namespace === 'core' ? id : qualifiedId;
        merged._sourceMap[`tag:${normalizedTag}`] = namespace;
      }
    }
  }

  // Merge patterns
  const patterns = registry.patterns ?? {};
  for (const [patternId, pattern] of Object.entries(patterns)) {
    if (FORBIDDEN_KEYS.has(patternId)) continue;
    if (merged.patterns[patternId]) {
      const existingPatternSource = merged._sourceMap[`pattern:${patternId}`] ?? 'core';
      if (existingPatternSource !== namespace) {
        warnings.push(
          `W_EXTENSION_PATTERN_CONFLICT: パターンID "${patternId}" が競合しています (${existingPatternSource} vs ${namespace})。名前空間修飾で共存します。`,
        );
        merged.patterns[`${namespace}:${patternId}`] = pattern;
        merged._sourceMap[`pattern:${namespace}:${patternId}`] = namespace;
      }
    } else {
      merged.patterns[patternId] = pattern;
      merged._sourceMap[`pattern:${patternId}`] = namespace;
    }
  }
}

/**
 * Phase 2 conflict detection: suffix-based collisions after prefix normalization.
 * Called during vendor install when the user prefix is known.
 */
export function detectSuffixConflicts(merged, prefix) {
  const suffixMap = {};
  const components = merged.components ?? {};
  const normalizedPrefix = String(prefix ?? '').trim().toLowerCase();
  const canonicalPrefixStr = normalizedPrefix ? `${normalizedPrefix}-` : '';

  for (const [compId, comp] of Object.entries(components)) {
    const tags = Array.isArray(comp?.tags) ? comp.tags : [];
    for (const rawTag of tags) {
      const tag = String(rawTag ?? '').trim().toLowerCase();
      if (!tag) continue;
      const suffix = tag.startsWith(canonicalPrefixStr) ? tag.slice(canonicalPrefixStr.length) : tag;
      if (!suffix) continue;

      if (suffixMap[suffix] && suffixMap[suffix].compId !== compId) {
        throw createCliError(
          'E_EXTENSION_SUFFIX_CONFLICT',
          `プレフィックス適用後のタグ名が競合しています: ${normalizedPrefix}-${suffix} (${suffixMap[suffix].compId} vs ${compId})`,
        );
      }
      if (!suffixMap[suffix]) {
        suffixMap[suffix] = { compId, tag };
      }
    }
  }
}

const DFS_WHITE = 0;
const DFS_GRAY = 1;
const DFS_BLACK = 2;

/**
 * DFS-based cyclic dependency detection.
 * Returns the cycle path array if found, null otherwise.
 */
export function detectCyclicDeps(merged) {
  const components = merged.components ?? {};
  const color = {};
  const parent = {};

  for (const id of Object.keys(components)) {
    color[id] = DFS_WHITE;
  }

  for (const id of Object.keys(components)) {
    if (color[id] === DFS_WHITE) {
      const cycle = dfsVisit(id, components, color, parent);
      if (cycle) return cycle;
    }
  }

  return null;
}

function resolveDep(dep, comp, components) {
  // Support namespace:id format in depsNamespace
  const depsNamespace = comp?.depsNamespace ?? {};
  const ns = depsNamespace[dep];
  if (ns) {
    const qualifiedId = `${ns}:${dep}`;
    if (components[qualifiedId]) return qualifiedId;
  }
  // Try plain dep id
  if (components[dep]) return dep;
  return null;
}

function dfsVisit(nodeId, components, color, parent) {
  color[nodeId] = DFS_GRAY;
  const comp = components[nodeId];
  const deps = Array.isArray(comp?.deps) ? comp.deps : [];

  for (const rawDep of deps) {
    const dep = String(rawDep ?? '').trim();
    if (!dep) continue;

    const resolvedDep = resolveDep(dep, comp, components);
    if (!resolvedDep) continue; // Missing dep is checked separately

    if (color[resolvedDep] === DFS_GRAY) {
      // Found a cycle: reconstruct path
      const cycle = [resolvedDep, nodeId];
      let curr = nodeId;
      while (parent[curr] && parent[curr] !== resolvedDep) {
        cycle.push(parent[curr]);
        curr = parent[curr];
      }
      cycle.push(resolvedDep);
      return cycle.reverse();
    }

    if (color[resolvedDep] === DFS_WHITE) {
      parent[resolvedDep] = nodeId;
      const result = dfsVisit(resolvedDep, components, color, parent);
      if (result) return result;
    }
  }

  color[nodeId] = DFS_BLACK;
  return null;
}

/**
 * Validate that all dependencies in the merged registry can be resolved.
 */
export function validateDeps(merged) {
  const components = merged.components ?? {};

  for (const [compId, comp] of Object.entries(components)) {
    const deps = Array.isArray(comp?.deps) ? comp.deps : [];
    for (const rawDep of deps) {
      const dep = String(rawDep ?? '').trim();
      if (!dep) continue;

      const resolved = resolveDep(dep, comp, components);
      if (!resolved) {
        throw createCliError(
          'E_EXTENSION_DEP_MISSING',
          `依存先が見つかりません: ${dep} (required by ${compId})`,
        );
      }
    }
  }
}

/**
 * Add an extension to the config. Throws on duplicate unless force=true.
 */
export async function addExtension(projectRoot, { source, name, namespace = null, force = false }) {
  const config = await loadExtensionConfig(projectRoot);
  const { registry } = await loadExternalRegistry(source, projectRoot);
  const resolvedName = name || resolveExtensionName(source, registry);

  if (!resolvedName) {
    throw createCliError('E_EXTENSION_INVALID', '拡張レジストリの名前を特定できません。--name を指定してください。');
  }

  const existing = config.extensions.findIndex((ext) => ext.name === resolvedName);
  if (existing >= 0) {
    if (!force) {
      throw createCliError('E_EXTENSION_DUPLICATE', `同名の拡張レジストリが既に登録されています: ${resolvedName}`);
    }
    config.extensions.splice(existing, 1);
  }

  config.extensions.push({
    name: resolvedName,
    source,
    namespace: namespace || null,
    addedAt: new Date().toISOString(),
  });

  await saveExtensionConfig(projectRoot, config);

  const componentCount = Object.keys(registry.components ?? {}).length;
  const patternCount = Object.keys(registry.patterns ?? {}).length;

  return {
    name: resolvedName,
    source,
    componentCount,
    patternCount,
    registry,
  };
}

/**
 * Remove an extension from the config.
 */
export async function removeExtension(projectRoot, name) {
  const config = await loadExtensionConfig(projectRoot);
  const idx = config.extensions.findIndex((ext) => ext.name === name);
  if (idx < 0) {
    throw createCliError('E_EXTENSION_UNKNOWN', `登録されていない拡張レジストリです: ${name}`);
  }

  const removed = config.extensions.splice(idx, 1)[0];
  await saveExtensionConfig(projectRoot, config);
  return removed;
}

/**
 * List all registered extensions.
 */
export async function listExtensions(projectRoot) {
  const config = await loadExtensionConfig(projectRoot);
  return config.extensions;
}

/**
 * Show details of a specific extension.
 */
export async function showExtension(projectRoot, name) {
  const config = await loadExtensionConfig(projectRoot);
  const entry = config.extensions.find((ext) => ext.name === name);
  if (!entry) {
    throw createCliError('E_EXTENSION_UNKNOWN', `登録されていない拡張レジストリです: ${name}`);
  }

  try {
    const { registry } = await loadExternalRegistry(entry.source, projectRoot);
    return {
      ...entry,
      componentCount: Object.keys(registry.components ?? {}).length,
      patternCount: Object.keys(registry.patterns ?? {}).length,
      components: Object.keys(registry.components ?? {}),
      patterns: Object.keys(registry.patterns ?? {}),
    };
  } catch {
    return {
      ...entry,
      componentCount: 0,
      patternCount: 0,
      components: [],
      patterns: [],
      loadError: true,
    };
  }
}

/**
 * Load all extension registries referenced in .wcf/extensions.json.
 * Returns array of { name, registry } objects.
 */
export async function loadAllExtensions(projectRoot) {
  const config = await loadExtensionConfig(projectRoot);

  const results = await Promise.all(
    config.extensions.map(async (ext) => {
      const { registry } = await loadExternalRegistry(ext.source, projectRoot);
      return { name: ext.name, namespace: ext.namespace, registry };
    }),
  );

  return results;
}

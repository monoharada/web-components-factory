import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  validateExternalRegistry,
  loadExtensionConfig,
  saveExtensionConfig,
  loadExternalRegistry,
  resolveExtensionName,
  mergeRegistries,
  detectSuffixConflicts,
  detectCyclicDeps,
  validateDeps,
  addExtension,
  removeExtension,
  listExtensions,
  showExtension,
} from '../scripts/wcf/extension.js';
import { withCwd } from './utils/with-cwd';

const FIXTURES_DIR = path.resolve(__dirname, 'fixtures', 'extension-registries');
const REPO_ROOT = path.resolve(__dirname, '..');
const WCF_CLI = path.join(REPO_ROOT, 'scripts', 'wcf', 'cli.js');

async function mkdtemp() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-ext-'));
}

function loadFixture(name: string) {
  return JSON.parse(
    // eslint-disable-next-line no-restricted-syntax
    require('node:fs').readFileSync(path.join(FIXTURES_DIR, name), 'utf8'),
  );
}

// ──────────────────────────────────────────
// 1. Schema Validation
// ──────────────────────────────────────────
describe('validateExternalRegistry', () => {
  it('accepts a valid extension registry', () => {
    const registry = loadFixture('valid-extension.json');
    expect(() => validateExternalRegistry(registry, 'test')).not.toThrow();
  });

  it('rejects null input', () => {
    expect(() => validateExternalRegistry(null, 'test')).toThrow('E_EXTENSION_INVALID');
  });

  it('rejects invalid schemaVersion', () => {
    const registry = loadFixture('invalid-schema.json');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('E_EXTENSION_INVALID');
  });

  it('rejects non-object components', () => {
    expect(() =>
      validateExternalRegistry({ schemaVersion: 1, components: 'not-an-object' }, 'test'),
    ).toThrow('E_EXTENSION_INVALID');
  });

  it('rejects path traversal in componentDir', () => {
    const registry = loadFixture('path-traversal.json');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('E_EXTENSION_INVALID');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('".." 禁止');
  });

  it('rejects absolute path in componentDir', () => {
    const registry = {
      schemaVersion: 1,
      components: {
        bad: {
          id: 'bad',
          tags: ['bad-comp'],
          source: { componentDir: '/etc/passwd' },
        },
      },
    };
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('E_EXTENSION_INVALID');
  });
});

// ──────────────────────────────────────────
// 1b. Security: Prototype Pollution & Input Validation
// ──────────────────────────────────────────
describe('security: prototype pollution & input validation', () => {
  it('rejects __proto__ as component ID in validation', () => {
    const registry = loadFixture('proto-pollution.json');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('E_EXTENSION_INVALID');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('禁止キー');
  });

  it('rejects invalid define name (JS injection)', () => {
    const registry = loadFixture('invalid-define.json');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('E_EXTENSION_INVALID');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('不正な define 名');
  });

  it('rejects invalid component ID format', () => {
    const registry = loadFixture('invalid-id.json');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('E_EXTENSION_INVALID');
    expect(() => validateExternalRegistry(registry, 'test')).toThrow('不正なコンポーネントID');
  });

  it('skips __proto__ keys silently during merge', () => {
    const core = {
      schemaVersion: 1,
      canonicalPrefix: 'dads',
      components: { button: { id: 'button', tags: ['dads-button'], deps: [] } },
      tags: { 'dads-button': 'button' },
      patterns: {},
    };
    // Manually construct a registry that bypasses validation (simulating a direct merge call)
    const extRegistry = {
      schemaVersion: 1,
      canonicalPrefix: 'ext',
      components: {
        __proto__: { id: '__proto__', tags: ['ext-proto'], deps: [] },
        widget: { id: 'widget', tags: ['ext-widget'], deps: [] },
      },
      tags: {},
      patterns: {},
    };
    // __proto__ should be silently skipped in mergeRegistries
    const { merged } = mergeRegistries({
      core,
      extensions: [{ name: 'ext', registry: extRegistry }],
    });
    expect(merged.components.widget).toBeDefined();
    // The __proto__ component should not appear as a normal property
    expect(Object.keys(merged.components)).not.toContain('__proto__');
  });
});

// ──────────────────────────────────────────
// 2. Registry Merge
// ──────────────────────────────────────────
describe('mergeRegistries', () => {
  const coreRegistry = {
    schemaVersion: 1,
    canonicalPrefix: 'dads',
    components: {
      button: {
        id: 'button',
        tags: ['dads-button'],
        define: 'defineButton',
        deps: [],
      },
      heading: {
        id: 'heading',
        tags: ['dads-heading'],
        define: 'defineHeading',
        deps: [],
      },
    },
    tags: {
      'dads-button': 'button',
      'dads-heading': 'heading',
    },
    patterns: {
      basic: { title: 'Basic', components: ['button', 'heading'] },
    },
  };

  it('merges core-only without extensions', () => {
    const { merged, warnings } = mergeRegistries({ core: coreRegistry, extensions: [] });
    expect(Object.keys(merged.components)).toContain('button');
    expect(Object.keys(merged.components)).toContain('heading');
    expect(warnings).toHaveLength(0);
  });

  it('merges core with a valid extension', () => {
    const extRegistry = loadFixture('valid-extension.json');
    const { merged, warnings } = mergeRegistries({
      core: coreRegistry,
      extensions: [{ name: 'test-ext', registry: extRegistry }],
    });
    expect(Object.keys(merged.components)).toContain('button');
    expect(Object.keys(merged.components)).toContain('widget');
    expect(Object.keys(merged.components)).toContain('panel');
    expect(merged.tags['ext-widget']).toBeDefined();
  });

  it('merges multiple extensions', () => {
    const ext1 = loadFixture('valid-extension.json');
    const ext2 = loadFixture('valid-extension-alt.json');
    const { merged } = mergeRegistries({
      core: coreRegistry,
      extensions: [
        { name: 'ext1', registry: ext1 },
        { name: 'ext2', registry: ext2 },
      ],
    });
    expect(Object.keys(merged.components)).toContain('widget');
    expect(Object.keys(merged.components)).toContain('sidebar');
  });

  it('throws on tag name collision between core and extension', () => {
    const conflicting = loadFixture('conflicting-tag.json');
    expect(() =>
      mergeRegistries({
        core: coreRegistry,
        extensions: [{ name: 'conflict', registry: conflicting }],
      }),
    ).toThrow('E_EXTENSION_TAG_CONFLICT');
  });

  it('warns on component ID collision (namespace-qualified coexistence)', () => {
    const extWithSameId = {
      schemaVersion: 1,
      canonicalPrefix: 'ext',
      components: {
        button: {
          id: 'button',
          tags: ['ext-button'],
          define: 'defineExtButton',
          deps: [],
        },
      },
      tags: { 'ext-button': 'button' },
      patterns: {},
    };
    const { warnings } = mergeRegistries({
      core: coreRegistry,
      extensions: [{ name: 'ext', registry: extWithSameId }],
    });
    expect(warnings.some((w: string) => w.includes('W_EXTENSION_ID_CONFLICT'))).toBe(true);
  });

  it('merges patterns from extensions', () => {
    const ext = loadFixture('valid-extension.json');
    const { merged } = mergeRegistries({
      core: coreRegistry,
      extensions: [{ name: 'ext', registry: ext }],
    });
    expect(merged.patterns['ext-dashboard']).toBeDefined();
  });

  it('handles empty extension gracefully', () => {
    const empty = loadFixture('empty-extension.json');
    const { merged } = mergeRegistries({
      core: coreRegistry,
      extensions: [{ name: 'empty', registry: empty }],
    });
    expect(Object.keys(merged.components)).toContain('button');
  });

  it('detects same-namespace tag duplication', () => {
    const core = {
      schemaVersion: 1,
      canonicalPrefix: 'dads',
      components: {},
      tags: {},
      patterns: {},
    };
    const extRegistry = loadFixture('same-ns-tag-dup.json');
    expect(() =>
      mergeRegistries({
        core,
        extensions: [{ name: 'ext', registry: extRegistry }],
      }),
    ).toThrow('E_EXTENSION_TAG_CONFLICT');
  });

  it('uses namespace parameter over name when provided', () => {
    const core = {
      schemaVersion: 1,
      canonicalPrefix: 'dads',
      components: {},
      tags: {},
      patterns: {},
    };
    const ext = loadFixture('valid-extension.json');
    const { merged } = mergeRegistries({
      core,
      extensions: [{ name: 'ext-name', namespace: 'custom-ns', registry: ext }],
    });
    // The _meta should use namespace, and _sourceMap should reflect custom-ns
    expect(merged._meta.get('widget')?.namespace).toBe('custom-ns');
    expect(merged._sourceMap['widget']).toBe('custom-ns');
  });

  it('detects circular dependencies and throws', () => {
    const circular = loadFixture('circular-deps.json');
    expect(() =>
      mergeRegistries({
        core: { schemaVersion: 1, canonicalPrefix: 'dads', components: {}, tags: {}, patterns: {} },
        extensions: [{ name: 'circ', registry: circular }],
      }),
    ).toThrow('E_EXTENSION_CIRCULAR_DEP');
  });
});

// ──────────────────────────────────────────
// 3. Suffix Conflict Detection
// ──────────────────────────────────────────
describe('detectSuffixConflicts', () => {
  it('does not throw when no suffix conflicts exist', () => {
    const merged = {
      components: {
        button: { tags: ['dads-button'] },
        widget: { tags: ['ext-widget'] },
      },
    };
    expect(() => detectSuffixConflicts(merged, 'myui')).not.toThrow();
  });

  it('throws when suffix conflicts exist after prefix normalization', () => {
    const merged = {
      components: {
        button: { tags: ['myui-button'] },
        'ext:button-alt': { tags: ['myui-button'] },
      },
    };
    expect(() => detectSuffixConflicts(merged, 'myui')).toThrow('E_EXTENSION_SUFFIX_CONFLICT');
  });
});

// ──────────────────────────────────────────
// 4. Dependency Resolution
// ──────────────────────────────────────────
describe('dependency resolution', () => {
  it('resolves core dependencies from extension', () => {
    const coreRegistry = {
      schemaVersion: 1,
      canonicalPrefix: 'dads',
      components: {
        button: { id: 'button', tags: ['dads-button'], deps: [] },
      },
      tags: { 'dads-button': 'button' },
      patterns: {},
    };
    const ext = loadFixture('extension-with-core-deps.json');
    const { merged } = mergeRegistries({
      core: coreRegistry,
      extensions: [{ name: 'ext', registry: ext }],
    });
    expect(() => validateDeps(merged)).not.toThrow();
  });

  it('throws on missing dependency', () => {
    const merged = {
      components: {
        widget: { id: 'widget', deps: ['nonexistent'] },
      },
    };
    expect(() => validateDeps(merged)).toThrow('E_EXTENSION_DEP_MISSING');
  });

  it('detects cyclic dependencies', () => {
    const merged = {
      components: {
        alpha: { id: 'alpha', deps: ['beta'] },
        beta: { id: 'beta', deps: ['alpha'] },
      },
    };
    const cycle = detectCyclicDeps(merged);
    expect(cycle).not.toBeNull();
  });

  it('returns null when no cycles exist', () => {
    const merged = {
      components: {
        alpha: { id: 'alpha', deps: ['beta'] },
        beta: { id: 'beta', deps: [] },
      },
    };
    const cycle = detectCyclicDeps(merged);
    expect(cycle).toBeNull();
  });

  it('resolves namespace:id dependencies via depsNamespace', () => {
    const merged = {
      components: {
        'core-button': { id: 'core-button', deps: [] },
        'ext:fancy': {
          id: 'fancy',
          deps: ['core-button'],
          depsNamespace: { 'core-button': 'core' },
        },
      },
    };
    // core-button exists directly, so no error
    expect(() => validateDeps(merged)).not.toThrow();
  });
});

// ──────────────────────────────────────────
// 5. Extension Config Management
// ──────────────────────────────────────────
describe('extension config CRUD', () => {
  it('loads empty config when no file exists', async () => {
    const tmp = await mkdtemp();
    const config = await loadExtensionConfig(tmp);
    expect(config.extensions).toEqual([]);
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('saves and loads config', async () => {
    const tmp = await mkdtemp();
    const config = { schemaVersion: 1, extensions: [{ name: 'test', source: './test.json', addedAt: '2026-01-01' }] };
    await saveExtensionConfig(tmp, config);
    const loaded = await loadExtensionConfig(tmp);
    expect(loaded.extensions).toHaveLength(1);
    expect(loaded.extensions[0].name).toBe('test');
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('adds an extension', async () => {
    const tmp = await mkdtemp();
    // Copy fixture to tmp so relative path works
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    const result = await addExtension(tmp, { source: './valid-extension.json', name: 'my-ext' });
    expect(result.name).toBe('my-ext');
    expect(result.componentCount).toBe(2);

    const config = await loadExtensionConfig(tmp);
    expect(config.extensions).toHaveLength(1);
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('rejects duplicate extension name without --force', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    await addExtension(tmp, { source: './valid-extension.json', name: 'my-ext' });
    await expect(
      addExtension(tmp, { source: './valid-extension.json', name: 'my-ext' }),
    ).rejects.toThrow('E_EXTENSION_DUPLICATE');
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('allows duplicate with --force', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    await addExtension(tmp, { source: './valid-extension.json', name: 'my-ext' });
    const result = await addExtension(tmp, { source: './valid-extension.json', name: 'my-ext', force: true });
    expect(result.name).toBe('my-ext');

    const config = await loadExtensionConfig(tmp);
    expect(config.extensions).toHaveLength(1);
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('removes an extension', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    await addExtension(tmp, { source: './valid-extension.json', name: 'my-ext' });
    const removed = await removeExtension(tmp, 'my-ext');
    expect(removed.name).toBe('my-ext');

    const config = await loadExtensionConfig(tmp);
    expect(config.extensions).toHaveLength(0);
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('throws when removing non-existent extension', async () => {
    const tmp = await mkdtemp();
    await expect(removeExtension(tmp, 'nonexistent')).rejects.toThrow('E_EXTENSION_UNKNOWN');
    await fs.rm(tmp, { recursive: true, force: true });
  });
});

// ──────────────────────────────────────────
// 6. Extension Name Resolution
// ──────────────────────────────────────────
describe('resolveExtensionName', () => {
  it('uses meta.name when available', () => {
    const registry = { meta: { name: 'my-ext' } };
    expect(resolveExtensionName('some-file.json', registry)).toBe('my-ext');
  });

  it('falls back to filename without registry suffix', () => {
    expect(resolveExtensionName('my-extension-registry.json', null)).toBe('my-extension');
  });

  it('uses full basename when no registry suffix', () => {
    expect(resolveExtensionName('custom-pack.json', null)).toBe('custom-pack');
  });
});

// ──────────────────────────────────────────
// 7. CLI Commands (via spawnSync)
// ──────────────────────────────────────────
describe('CLI extension commands', () => {
  const LONG_IO_TIMEOUT_MS = 20_000;

  it('extension add registers and shows rebuild notice', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    const result = spawnSync(
      'node',
      [WCF_CLI, 'extension', 'add', './valid-extension.json', '--name', 'test-ext'],
      { cwd: tmp, timeout: LONG_IO_TIMEOUT_MS, encoding: 'utf8' },
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('拡張レジストリを追加しました');
    expect(result.stdout).toContain('vendor');
    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);

  it('extension list shows registered extensions', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    spawnSync(
      'node',
      [WCF_CLI, 'extension', 'add', './valid-extension.json', '--name', 'test-ext'],
      { cwd: tmp, timeout: LONG_IO_TIMEOUT_MS, encoding: 'utf8' },
    );

    const result = spawnSync('node', [WCF_CLI, 'extension', 'list'], {
      cwd: tmp,
      timeout: LONG_IO_TIMEOUT_MS,
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('test-ext');
    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);

  it('extension remove removes an extension', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    spawnSync(
      'node',
      [WCF_CLI, 'extension', 'add', './valid-extension.json', '--name', 'test-ext'],
      { cwd: tmp, timeout: LONG_IO_TIMEOUT_MS, encoding: 'utf8' },
    );

    const result = spawnSync('node', [WCF_CLI, 'extension', 'remove', 'test-ext'], {
      cwd: tmp,
      timeout: LONG_IO_TIMEOUT_MS,
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('削除しました');
    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);

  it('extension show displays extension details', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    spawnSync(
      'node',
      [WCF_CLI, 'extension', 'add', './valid-extension.json', '--name', 'test-ext'],
      { cwd: tmp, timeout: LONG_IO_TIMEOUT_MS, encoding: 'utf8' },
    );

    const result = spawnSync('node', [WCF_CLI, 'extension', 'show', 'test-ext'], {
      cwd: tmp,
      timeout: LONG_IO_TIMEOUT_MS,
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('widget');
    expect(result.stdout).toContain('panel');
    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);

  it('extension list shows empty message when none registered', async () => {
    const tmp = await mkdtemp();
    const result = spawnSync('node', [WCF_CLI, 'extension', 'list'], {
      cwd: tmp,
      timeout: LONG_IO_TIMEOUT_MS,
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('登録されている拡張レジストリはありません');
    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);
});

// ──────────────────────────────────────────
// 8. Backward Compatibility
// ──────────────────────────────────────────
describe('backward compatibility', () => {
  it('loadExtensionConfig returns empty when .wcf/extensions.json does not exist', async () => {
    const tmp = await mkdtemp();
    const config = await loadExtensionConfig(tmp);
    expect(config.extensions).toEqual([]);
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('mergeRegistries with no extensions returns core data unchanged', () => {
    const core = {
      schemaVersion: 1,
      canonicalPrefix: 'dads',
      components: { button: { id: 'button', tags: ['dads-button'], deps: [] } },
      tags: { 'dads-button': 'button' },
      patterns: {},
    };
    const { merged } = mergeRegistries({ core, extensions: [] });
    expect(merged.components.button).toBeDefined();
    expect(merged.canonicalPrefix).toBe('dads');
  });

  it('loadExternalRegistry throws on non-existent file', async () => {
    await expect(loadExternalRegistry('./nonexistent.json', '/tmp')).rejects.toThrow(
      'E_EXTENSION_NOT_FOUND',
    );
  });
});

// ──────────────────────────────────────────
// 9. Meta Separation (Fix-8)
// ──────────────────────────────────────────
describe('meta separation', () => {
  it('does not pollute component objects with internal meta properties', () => {
    const core = {
      schemaVersion: 1,
      canonicalPrefix: 'dads',
      components: { button: { id: 'button', tags: ['dads-button'], deps: [] } },
      tags: { 'dads-button': 'button' },
      patterns: {},
    };
    const ext = loadFixture('valid-extension.json');
    const { merged } = mergeRegistries({
      core,
      extensions: [{ name: 'ext', registry: ext }],
    });

    // Component objects should NOT have _namespace or _qualifiedId
    for (const [, comp] of Object.entries(merged.components)) {
      expect(comp).not.toHaveProperty('_namespace');
      expect(comp).not.toHaveProperty('_qualifiedId');
    }

    // _meta Map should contain the metadata instead
    expect(merged._meta.get('button')).toEqual({ namespace: 'core', qualifiedId: 'button' });
    expect(merged._meta.get('widget')).toEqual({ namespace: 'ext', qualifiedId: 'ext:widget' });
  });
});

// ──────────────────────────────────────────
// 10. Namespace Validation
// ──────────────────────────────────────────
describe('namespace validation', () => {
  it('rejects reserved namespace "core" in addExtension', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    await expect(
      addExtension(tmp, { source: './valid-extension.json', name: 'my-ext', namespace: 'core' }),
    ).rejects.toThrow('E_EXTENSION_INVALID');
    await expect(
      addExtension(tmp, { source: './valid-extension.json', name: 'my-ext', namespace: 'core' }),
    ).rejects.toThrow('予約済みの namespace');
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('rejects invalid namespace characters in addExtension', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    await expect(
      addExtension(tmp, { source: './valid-extension.json', name: 'my-ext', namespace: 'Bad_NS' }),
    ).rejects.toThrow('E_EXTENSION_INVALID');
    await expect(
      addExtension(tmp, { source: './valid-extension.json', name: 'my-ext', namespace: '' }),
    ).rejects.toThrow('E_EXTENSION_INVALID');
    await fs.rm(tmp, { recursive: true, force: true });
  });

  it('rejects reserved namespace "core" in mergeRegistries', () => {
    const core = {
      schemaVersion: 1,
      canonicalPrefix: 'dads',
      components: {},
      tags: {},
      patterns: {},
    };
    const ext = loadFixture('valid-extension.json');
    expect(() =>
      mergeRegistries({
        core,
        extensions: [{ name: 'core', registry: ext }],
      }),
    ).toThrow('E_EXTENSION_INVALID');
  });

  it('allows valid custom namespaces', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    const result = await addExtension(tmp, {
      source: './valid-extension.json',
      name: 'my-ext',
      namespace: 'my-team',
    });
    expect(result.name).toBe('my-ext');

    const config = await loadExtensionConfig(tmp);
    expect(config.extensions[0].namespace).toBe('my-team');
    await fs.rm(tmp, { recursive: true, force: true });
  });
});

// ──────────────────────────────────────────
// 11. CLI format defaults & warning propagation
// ──────────────────────────────────────────
describe('CLI format defaults and warning propagation', () => {
  const LONG_IO_TIMEOUT_MS = 20_000;

  it('extension list defaults to TSV when --format is not specified', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    spawnSync(
      'node',
      [WCF_CLI, 'extension', 'add', './valid-extension.json', '--name', 'test-ext'],
      { cwd: tmp, timeout: LONG_IO_TIMEOUT_MS, encoding: 'utf8' },
    );

    const tsvResult = spawnSync('node', [WCF_CLI, 'extension', 'list'], {
      cwd: tmp,
      timeout: LONG_IO_TIMEOUT_MS,
      encoding: 'utf8',
    });
    expect(tsvResult.status).toBe(0);
    // TSV output: name\tsource\taddedAt
    expect(tsvResult.stdout).toContain('test-ext\t');
    // Should NOT be JSON
    expect(tsvResult.stdout.trim()).not.toMatch(/^\[/);

    const jsonResult = spawnSync('node', [WCF_CLI, 'extension', 'list', '--format', 'json'], {
      cwd: tmp,
      timeout: LONG_IO_TIMEOUT_MS,
      encoding: 'utf8',
    });
    expect(jsonResult.status).toBe(0);
    const parsed = JSON.parse(jsonResult.stdout);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].name).toBe('test-ext');

    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);

  it('emits warning when .wcf/extensions.json is corrupted and --registry is specified', async () => {
    const tmp = await mkdtemp();
    // Write corrupted extensions.json
    const wcfDir = path.join(tmp, '.wcf');
    await fs.mkdir(wcfDir, { recursive: true });
    await fs.writeFile(path.join(wcfDir, 'extensions.json'), '{invalid json!!!', 'utf8');

    // Create a valid extension registry to use with --registry
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    const result = spawnSync(
      'node',
      [WCF_CLI, 'vendor', 'install', '--prefix', 'myui', '--dir', 'vendor/myui',
       '--pattern', 'search-results', '--registry', './valid-extension.json', '--force'],
      { cwd: tmp, timeout: LONG_IO_TIMEOUT_MS, encoding: 'utf8' },
    );
    // stderr should contain the load-failed warning
    expect(result.stderr).toContain('W_EXTENSION_LOAD_FAILED');

    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);

  it('extension add rejects reserved namespace via CLI', async () => {
    const tmp = await mkdtemp();
    const fixtureSrc = path.join(FIXTURES_DIR, 'valid-extension.json');
    const fixtureDst = path.join(tmp, 'valid-extension.json');
    await fs.copyFile(fixtureSrc, fixtureDst);

    const result = spawnSync(
      'node',
      [WCF_CLI, 'extension', 'add', './valid-extension.json', '--name', 'test-ext', '--namespace', 'core'],
      { cwd: tmp, timeout: LONG_IO_TIMEOUT_MS, encoding: 'utf8' },
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('予約済みの namespace');

    await fs.rm(tmp, { recursive: true, force: true });
  }, LONG_IO_TIMEOUT_MS);
});

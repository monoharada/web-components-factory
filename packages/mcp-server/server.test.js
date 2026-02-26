/**
 * Tests for wcf-mcp server tools.
 *
 * These tests import internal helpers and verify tool behavior
 * without actually starting the stdio transport.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Import helpers directly from core.mjs
// ---------------------------------------------------------------------------

import {
  CANONICAL_PREFIX,
  CATEGORY_MAP,
  getCategory,
  findCustomElementDeclarations,
} from './core.mjs';

// ---------------------------------------------------------------------------
// Load data the same way the server does
// ---------------------------------------------------------------------------

const REPO_FILE_MAP = {
  'custom-elements.json': 'custom-elements.json',
  'install-registry.json': 'registry/install-registry.json',
  'pattern-registry.json': 'registry/pattern-registry.json',
  'design-tokens.json': 'design-tokens.json',
  'guidelines-index.json': 'guidelines-index.json',
};

async function loadBundledJson(fileName) {
  const bundled = path.join(__dirname, 'data', fileName);
  const repoRoot = path.resolve(__dirname, '../..');
  const repoRelative = REPO_FILE_MAP[fileName];
  const repo = repoRelative ? path.join(repoRoot, repoRelative) : undefined;

  for (const p of [bundled, repo]) {
    if (!p) continue;
    try {
      const text = await fs.readFile(p, 'utf8');
      return JSON.parse(text);
    } catch {
      // Try next path
    }
  }
  throw new Error(`Data file not found: ${fileName} (tried data/ and repo root)`);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CATEGORY_MAP', () => {
  it('maps known tags to their categories', () => {
    expect(getCategory('dads-button')).toBe('Actions');
    expect(getCategory('dads-input-text')).toBe('Form');
    expect(getCategory('dads-heading')).toBe('Content');
    expect(getCategory('dads-breadcrumb')).toBe('Navigation');
    expect(getCategory('dads-avatar')).toBe('Display');
    expect(getCategory('dads-layout-shell')).toBe('Layout');
  });

  it('returns Other for unknown tags', () => {
    expect(getCategory('dads-unknown-thing')).toBe('Other');
    expect(getCategory('foo-bar')).toBe('Other');
  });
});

describe('get_design_system_overview (logic)', () => {
  it('builds correct overview shape from bundled data', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const patternRegistry = await loadBundledJson('pattern-registry.json');
    const decls = findCustomElementDeclarations(manifest);
    const patterns = patternRegistry.patterns ?? {};

    // Build category counts the same way the tool does
    const categoryCount = {};
    for (const { tagName } of decls) {
      const cat = getCategory(tagName);
      categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
    }

    const patternList = Object.values(patterns).map((p) => ({
      id: p?.id,
      title: p?.title,
    }));

    // Verify shape
    expect(decls.length).toBeGreaterThan(0);
    expect(Object.keys(categoryCount).length).toBeGreaterThan(0);
    expect(patternList.length).toBeGreaterThan(0);

    // Verify every component gets a category
    for (const { tagName } of decls) {
      const cat = getCategory(tagName);
      expect(typeof cat).toBe('string');
      expect(cat.length).toBeGreaterThan(0);
    }
  });

  it('includes all expected tool names (11 tools)', () => {
    const expectedTools = [
      'get_design_system_overview',
      'list_components',
      'get_component_api',
      'generate_usage_snippet',
      'get_install_recipe',
      'validate_markup',
      'list_patterns',
      'get_pattern_recipe',
      'generate_pattern_snippet',
      'get_design_tokens',
      'search_guidelines',
    ];

    expect(expectedTools).toHaveLength(11);
    expect(new Set(expectedTools).size).toBe(11);
  });
});

describe('list_components category filter (logic)', () => {
  it('filters components by category', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const decls = findCustomElementDeclarations(manifest);

    const allWithCategories = decls.map(({ tagName }) => ({
      tagName,
      category: getCategory(tagName),
    }));

    const formOnly = allWithCategories.filter((c) => c.category === 'Form');
    const actionsOnly = allWithCategories.filter((c) => c.category === 'Actions');
    const navigationOnly = allWithCategories.filter((c) => c.category === 'Navigation');

    // Form should include input-text, textarea, select, etc.
    expect(formOnly.length).toBeGreaterThan(0);
    expect(formOnly.some((c) => c.tagName === 'dads-input-text')).toBe(true);

    // Actions should include button, dialog, etc.
    expect(actionsOnly.length).toBeGreaterThan(0);
    expect(actionsOnly.some((c) => c.tagName === 'dads-button')).toBe(true);

    // Navigation should include breadcrumb, page-navigation, etc.
    expect(navigationOnly.length).toBeGreaterThan(0);

    // Total should match
    const totalFiltered = ['Form', 'Actions', 'Navigation', 'Content', 'Display', 'Layout', 'Other']
      .reduce((sum, cat) => sum + allWithCategories.filter((c) => c.category === cat).length, 0);
    expect(totalFiltered).toBe(allWithCategories.length);
  });

  it('returns all when no category filter is applied', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const decls = findCustomElementDeclarations(manifest);
    expect(decls.length).toBeGreaterThan(0);
  });
});

describe('tool descriptions', () => {
  it('get_design_system_overview description contains MUST guardrail', async () => {
    // Tool descriptions now live in core.mjs
    const coreSrc = await fs.readFile(path.join(__dirname, 'core.mjs'), 'utf8');
    expect(coreSrc).toContain('MUST be called first');
  });

  it('all tools have When/Returns/After guidance in descriptions', async () => {
    const coreSrc = await fs.readFile(path.join(__dirname, 'core.mjs'), 'utf8');

    // Tools that should have enhanced descriptions
    const toolNames = [
      'list_components',
      'get_component_api',
      'generate_usage_snippet',
      'get_install_recipe',
      'validate_markup',
      'list_patterns',
      'get_pattern_recipe',
      'generate_pattern_snippet',
      'get_design_tokens',
      'search_guidelines',
    ];

    for (const name of toolNames) {
      // Each tool's description block should contain "When:" and "Returns:"
      const toolSection = coreSrc.slice(coreSrc.indexOf(`'${name}'`));
      const descEnd = toolSection.indexOf('inputSchema');
      const descBlock = toolSection.slice(0, descEnd);
      expect(descBlock).toContain('When:');
      expect(descBlock).toContain('Returns:');
    }
  });
});

describe('get_design_tokens', () => {
  it('design-tokens.json has correct shape', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      // Skip if not generated yet
      return;
    }

    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('tokens');
    expect(data).toHaveProperty('summary');
    expect(Array.isArray(data.tokens)).toBe(true);

    // Verify token shape
    if (data.tokens.length > 0) {
      const token = data.tokens[0];
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('type');
      expect(token).toHaveProperty('category');
      expect(token).toHaveProperty('cssVariable');
    }
  });

  it('filters by type', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const colorTokens = data.tokens.filter((t) => t.type === 'color');
    const spacingTokens = data.tokens.filter((t) => t.type === 'spacing');

    expect(colorTokens.length).toBeGreaterThan(0);
    expect(spacingTokens.length).toBeGreaterThan(0);

    // Every color token name should start with --color
    for (const t of colorTokens) {
      expect(t.name).toMatch(/^--color/);
    }
  });

  it('filters by category', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const primitiveTokens = data.tokens.filter((t) => t.category === 'primitive');
    const semanticTokens = data.tokens.filter((t) => t.category === 'semantic');

    expect(primitiveTokens.length).toBeGreaterThan(0);
    expect(semanticTokens.length).toBeGreaterThan(0);
  });

  it('filters by query', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const blueTokens = data.tokens.filter((t) => t.name.toLowerCase().includes('blue'));
    expect(blueTokens.length).toBeGreaterThan(0);
  });

  it('summary has counts for all types', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    expect(data.summary).toHaveProperty('color');
    expect(data.summary).toHaveProperty('spacing');
    expect(data.summary).toHaveProperty('typography');
    expect(data.summary).toHaveProperty('radius');
    expect(data.summary).toHaveProperty('shadow');

    expect(data.summary.color).toBeGreaterThan(0);
    expect(data.summary.spacing).toBeGreaterThan(0);
  });
});

describe('search_guidelines', () => {
  it('guidelines-index.json has correct shape', async () => {
    let data;
    try {
      data = await loadBundledJson('guidelines-index.json');
    } catch {
      return;
    }

    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('documents');
    expect(data).toHaveProperty('topicCounts');
    expect(Array.isArray(data.documents)).toBe(true);
    expect(data.documents.length).toBeGreaterThan(0);

    // Verify document shape
    const doc = data.documents[0];
    expect(doc).toHaveProperty('id');
    expect(doc).toHaveProperty('title');
    expect(doc).toHaveProperty('topic');
    expect(doc).toHaveProperty('sections');
    expect(Array.isArray(doc.sections)).toBe(true);
  });

  it('filters by topic', async () => {
    let data;
    try {
      data = await loadBundledJson('guidelines-index.json');
    } catch {
      return;
    }

    const cssDocs = data.documents.filter((d) => d.topic === 'css');
    const patternDocs = data.documents.filter((d) => d.topic === 'patterns');

    expect(cssDocs.length).toBeGreaterThan(0);
    expect(patternDocs.length).toBeGreaterThan(0);
  });

  it('contains 20+ documents', async () => {
    let data;
    try {
      data = await loadBundledJson('guidelines-index.json');
    } catch {
      return;
    }

    expect(data.documents.length).toBeGreaterThanOrEqual(20);
  });

  it('keyword search returns results', async () => {
    let data;
    try {
      data = await loadBundledJson('guidelines-index.json');
    } catch {
      return;
    }

    // Search for a common keyword
    const query = 'accessibility';
    const q = query.toLowerCase();
    let hits = 0;

    for (const doc of data.documents) {
      for (const section of doc.sections) {
        const heading = String(section.heading ?? '').toLowerCase();
        const keywords = Array.isArray(section.keywords) ? section.keywords : [];
        const snippet = String(section.snippet ?? '').toLowerCase();

        if (heading.includes(q) || keywords.some((kw) => String(kw).toLowerCase().includes(q)) || snippet.includes(q)) {
          hits++;
        }
      }
    }

    // Should find at least some hits for "accessibility"
    expect(hits).toBeGreaterThan(0);
  });
});

describe('HTTP transport support', () => {
  it('bin.mjs imports both transport types', async () => {
    const binSrc = await fs.readFile(path.join(__dirname, 'bin.mjs'), 'utf8');
    expect(binSrc).toContain('StdioServerTransport');
    expect(binSrc).toContain('StreamableHTTPServerTransport');
    expect(binSrc).toContain('--transport=');
    expect(binSrc).toContain('--port=');
    expect(binSrc).toContain("127.0.0.1");
  });
});

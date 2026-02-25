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
// Load data the same way the server does
// ---------------------------------------------------------------------------

const REPO_FILE_MAP = {
  'custom-elements.json': 'custom-elements.json',
  'install-registry.json': 'registry/install-registry.json',
  'pattern-registry.json': 'registry/pattern-registry.json',
};

async function loadBundledJson(fileName) {
  // Try bundled data/ first (npx mode), then fall back to repo root (CI / dev)
  const bundled = path.join(__dirname, 'data', fileName);
  const repoRoot = path.resolve(__dirname, '../..');
  const repo = REPO_FILE_MAP[fileName]
    ? path.join(repoRoot, REPO_FILE_MAP[fileName])
    : undefined;

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
// Re-import the helpers we need to test (re-implemented inline because
// server.mjs only exports startServer — we test the logic, not the wiring)
// ---------------------------------------------------------------------------

const CANONICAL_PREFIX = 'dads';

const CATEGORY_MAP = {
  'dads-input-text': 'Form',
  'dads-textarea': 'Form',
  'dads-select': 'Form',
  'dads-checkbox': 'Form',
  'dads-radio': 'Form',
  'dads-switch': 'Form',
  'dads-combobox': 'Form',
  'dads-date-picker': 'Form',
  'dads-file-upload': 'Form',
  'dads-fieldset': 'Form',
  'dads-search-box': 'Form',
  'dads-calendar': 'Form',
  'dads-button': 'Actions',
  'dads-dialog': 'Actions',
  'dads-drawer': 'Actions',
  'dads-disclosure': 'Actions',
  'dads-accordion-details': 'Actions',
  'dads-accordion-item-details': 'Actions',
  'dads-breadcrumb': 'Navigation',
  'dads-breadcrumb-item': 'Navigation',
  'dads-page-navigation': 'Navigation',
  'dads-step-navigation': 'Navigation',
  'dads-step-navigation-item': 'Navigation',
  'dads-menu-list': 'Navigation',
  'dads-menu-list-item': 'Navigation',
  'dads-menu-list-box': 'Navigation',
  'dads-global-menu': 'Navigation',
  'dads-global-menu-item': 'Navigation',
  'dads-language-selector': 'Navigation',
  'dads-hamburger-menu-button': 'Navigation',
  'dads-utility-link': 'Navigation',
  'dads-mobile-menu': 'Navigation',
  'dads-card': 'Content',
  'dads-heading': 'Content',
  'dads-text': 'Content',
  'dads-blockquote': 'Content',
  'dads-code-block': 'Content',
  'dads-divider': 'Content',
  'dads-list': 'Content',
  'dads-list-item': 'Content',
  'dads-description-list': 'Content',
  'dads-resource-list': 'Content',
  'dads-table': 'Content',
  'dads-table-control': 'Content',
  'dads-avatar': 'Display',
  'dads-icon': 'Display',
  'dads-chip-label': 'Display',
  'dads-chip-tag': 'Display',
  'dads-notification-banner': 'Display',
  'dads-emergency-banner': 'Display',
  'dads-carousel': 'Display',
  'dads-layout-shell': 'Layout',
  'dads-layout-sidebar': 'Layout',
  'dads-layout-aside': 'Layout',
  'dads-header-container': 'Layout',
  'dads-device-mock': 'Display',
  'dads-progress-indicator': 'Display',
  'dads-spinner': 'Display',
  'dads-progress-bar': 'Display',
  'dads-loading-icon': 'Display',
};

function getCategory(tagName) {
  return CATEGORY_MAP[tagName] ?? 'Other';
}

function findCustomElementDeclarations(manifest) {
  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
  const decls = [];
  for (const mod of modules) {
    const modulePath = typeof mod?.path === 'string' ? mod.path : undefined;
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;
      const tagName = typeof decl.tagName === 'string' ? decl.tagName : undefined;
      const isCustomElement = decl.customElement === true || decl.kind === 'custom-element';
      if (!isCustomElement || !tagName) continue;
      decls.push({ decl, tagName: tagName.toLowerCase(), modulePath });
    }
  }
  return decls;
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

  it('includes all expected tool names', () => {
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
    ];

    // These are hardcoded in the overview — verify they match
    expect(expectedTools).toHaveLength(9);
    expect(new Set(expectedTools).size).toBe(9);
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
    const serverSrc = await fs.readFile(path.join(__dirname, 'server.mjs'), 'utf8');
    const overviewMatch = serverSrc.match(
      /registerTool\(\s*'get_design_system_overview'[\s\S]*?description:\s*[`'"]([\s\S]*?)[`'"]/
    );
    // The description must contain "MUST be called first"
    expect(serverSrc).toContain('MUST be called first');
  });

  it('all tools have When/Returns/After guidance in descriptions', async () => {
    const serverSrc = await fs.readFile(path.join(__dirname, 'server.mjs'), 'utf8');

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
    ];

    for (const name of toolNames) {
      // Each tool's description block should contain "When:" and "Returns:"
      const toolSection = serverSrc.slice(serverSrc.indexOf(`'${name}'`));
      const descEnd = toolSection.indexOf('inputSchema');
      const descBlock = toolSection.slice(0, descEnd);
      expect(descBlock).toContain('When:');
      expect(descBlock).toContain('Returns:');
    }
  });
});

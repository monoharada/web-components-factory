/**
 * Tests for wcf-mcp server tools.
 *
 * These tests import internal helpers and verify tool behavior
 * without actually starting the stdio transport.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { loadJsonDataWithFallback, loadTextDataWithFallback } from './runtime-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Import helpers directly from core.mjs
// ---------------------------------------------------------------------------

import {
  CANONICAL_PREFIX,
  CATEGORY_MAP,
  FIGMA_TO_WCF_PROMPT,
  IDE_SETUP_TEMPLATES,
  MAX_TOOL_RESULT_BYTES,
  MAX_PREFIX_LENGTH,
  STRUCTURED_CONTENT_DISABLE_FLAG,
  buildAccessibilityIndex,
  buildComponentSummaries,
  buildPatternFrequencyMap,
  buildDesignTokenDetailPayload,
  buildDesignTokensPayload,
  buildDiagnosticSuggestion,
  buildFullPageHtml,
  buildIndexes,
  buildJsonToolErrorResponse,
  buildJsonToolResponse,
  buildRelatedComponentMap,
  buildTokenRelationshipIndex,
  buildTokenSuggestionMap,
  expandQueryWithSynonyms,
  extractAccessibilityChecklist,
  extractIconNames,
  extractReferencedTokenNames,
  getCategory,
  getRelatedComponentsForTag,
  isStructuredContentDisabled,
  measureToolResultBytes,
  findCustomElementDeclarations,
  normalizeTokenIdentifier,
  pickDecl,
  resolveTokenTheme,
  suggestUnknownElementTagName,
  suggestTokenNames,
  parseIconNamesFromDescription,
  parseIconNamesFromType,
  normalizePlugins,
  PLUGIN_CONTRACT_VERSION,
  buildPluginDataSourceMap,
  createMcpServer,
  queryAccessibilityIndex,
  resolveComponentClosure,
  searchIconCatalog,
  toCanonicalTagName,
  generateSnippet,
  buildComponentTokenReferencedBy,
  WCF_RESOURCE_URIS,
} from './core.mjs';
import { PACKAGE_VERSION } from './core/constants.mjs';
import { buildEnumAttributeMap, buildSlotNameMap, collectCemCustomElements, detectAccessibilityMisuseInMarkup, detectEmptyInteractiveElement, detectEnumValueMisuse, detectInvalidSlotName, detectMissingRequiredAttributes, detectNonLowercaseAttributes, detectOrphanedChildComponents, detectTokenMisuseInInlineStyles } from './validator.mjs';
import { loadWcfMcpRuntimeConfig } from './server.mjs';

// ---------------------------------------------------------------------------
// Load data the same way the server does
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, '../..');

async function loadBundledJson(fileName) {
  return loadJsonDataWithFallback(fileName, {
    bundledDir: __dirname,
    repoRoot: REPO_ROOT,
  });
}

async function loadBundledJsonOrNull(fileName) {
  try {
    return await loadBundledJson(fileName);
  } catch {
    return null;
  }
}

async function loadBundledText(fileName) {
  return loadTextDataWithFallback(fileName, {
    bundledDir: __dirname,
    repoRoot: REPO_ROOT,
  });
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

  it('includes all expected tool names (16 tools)', () => {
    const expectedTools = [
      'get_design_system_overview',
      'list_components',
      'search_icons',
      'get_component_api',
      'generate_usage_snippet',
      'get_install_recipe',
      'validate_markup',
      'generate_full_page_html',
      'list_patterns',
      'get_pattern_recipe',
      'generate_pattern_snippet',
      'get_design_tokens',
      'get_design_token_detail',
      'get_accessibility_docs',
      'search_guidelines',
      'get_component_selector_guide',
    ];

    expect(expectedTools).toHaveLength(16);
    expect(new Set(expectedTools).size).toBe(16);
  });

  it('provides at least three IDE setup templates', () => {
    expect(IDE_SETUP_TEMPLATES.length).toBeGreaterThanOrEqual(3);
    expect(IDE_SETUP_TEMPLATES.some((item) => item.ide === 'Claude Desktop')).toBe(true);
    expect(IDE_SETUP_TEMPLATES.some((item) => item.ide === 'Claude Code')).toBe(true);
    expect(IDE_SETUP_TEMPLATES.some((item) => item.ide === 'Cursor')).toBe(true);
    expect(IDE_SETUP_TEMPLATES.every((item) => typeof item.configPath === 'string')).toBe(true);
    expect(IDE_SETUP_TEMPLATES.every((item) => typeof item.snippet === 'object')).toBe(true);
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

  it('defaults to 20 items when limit is not specified', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const decls = findCustomElementDeclarations(manifest);
    const indexes = buildIndexes(manifest);
    const page = buildComponentSummaries(indexes, {});

    expect(page.offset).toBe(0);
    expect(page.total).toBe(decls.length);
    expect(page.limit).toBe(20);
    expect(page.items.length).toBe(20);
    expect(page.hasMore).toBe(true);
    expect(page._notice).toContain('Default pagination changed');
  });

  it('returns all items when limit=200 is set', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const decls = findCustomElementDeclarations(manifest);
    const indexes = buildIndexes(manifest);
    const page = buildComponentSummaries(indexes, { limit: 200 });

    expect(page.total).toBe(decls.length);
    expect(page.items.length).toBe(decls.length);
    expect(page.hasMore).toBe(false);
    expect(page._notice).toBeUndefined();
  });

  it('supports query filter and offset pagination', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);

    const queryPage = buildComponentSummaries(indexes, { query: 'button', limit: 50 });
    expect(queryPage.items.length).toBeGreaterThan(0);
    expect(queryPage.items.some((item) => item.tagName === 'dads-button')).toBe(true);

    const first = buildComponentSummaries(indexes, { limit: 5, offset: 0 });
    const second = buildComponentSummaries(indexes, { limit: 5, offset: 5 });
    expect(first.items).toHaveLength(5);
    expect(second.items).toHaveLength(5);
    expect(first.items[0].tagName).not.toBe(second.items[0].tagName);
  });
});

describe('buildPatternFrequencyMap', () => {
  it('counts component usage across patterns', () => {
    const patterns = {
      'form-a': { requires: ['button', 'input-text', 'heading'] },
      'form-b': { requires: ['button', 'select', 'heading'] },
      'search': { requires: ['button', 'search-box'] },
    };
    const freq = buildPatternFrequencyMap(patterns);
    expect(freq.get('button')).toBe(3);
    expect(freq.get('heading')).toBe(2);
    expect(freq.get('input-text')).toBe(1);
    expect(freq.get('select')).toBe(1);
    expect(freq.get('search-box')).toBe(1);
  });

  it('returns empty map for empty patterns', () => {
    const freq = buildPatternFrequencyMap({});
    expect(freq.size).toBe(0);
  });
});

describe('buildComponentSummaries patternId filter and frequency sort', () => {
  it('filters by patternId using real registries', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const installRegistry = await loadBundledJson('install-registry.json');
    const patternRegistryRaw = await loadBundledJson('pattern-registry.json');
    const patterns = patternRegistryRaw?.patterns ?? {};

    // Use a real pattern that exists
    const patternIds = Object.keys(patterns);
    expect(patternIds.length).toBeGreaterThan(0);
    const testPatternId = patternIds[0];
    const expectedRequires = patterns[testPatternId]?.requires ?? [];

    const page = buildComponentSummaries(indexes, {
      patternId: testPatternId,
      limit: 200,
      patterns,
      installRegistry,
    });

    expect(page.total).toBeGreaterThan(0);
    expect(page.total).toBeLessThanOrEqual(expectedRequires.length * 3); // some components have multiple tags
    // All returned items should map to required component IDs
    const tags = installRegistry?.tags ?? {};
    for (const item of page.items) {
      const componentId = tags[item.tagName];
      expect(expectedRequires).toContain(componentId);
    }
  });

  it('returns empty for unknown patternId', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const page = buildComponentSummaries(indexes, {
      patternId: 'nonexistent-pattern-xyz',
      limit: 200,
      patterns: {},
      installRegistry: {},
    });
    expect(page.total).toBe(0);
    expect(page.items).toHaveLength(0);
  });

  it('sorts by frequency descending', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const installRegistry = await loadBundledJson('install-registry.json');
    const patternRegistryRaw = await loadBundledJson('pattern-registry.json');
    const patterns = patternRegistryRaw?.patterns ?? {};
    const patternFrequency = buildPatternFrequencyMap(patterns);

    const page = buildComponentSummaries(indexes, {
      sort: 'frequency',
      limit: 200,
      patterns,
      installRegistry,
      patternFrequency,
    });

    expect(page.total).toBeGreaterThan(0);
    // Items should have frequency field and be sorted descending
    for (let i = 0; i < page.items.length - 1; i++) {
      expect(page.items[i].frequency).toBeGreaterThanOrEqual(page.items[i + 1].frequency);
    }
    // First item should have the highest frequency
    expect(page.items[0].frequency).toBeGreaterThan(0);
  });

  it('combines patternId filter with frequency sort', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const installRegistry = await loadBundledJson('install-registry.json');
    const patternRegistryRaw = await loadBundledJson('pattern-registry.json');
    const patterns = patternRegistryRaw?.patterns ?? {};
    const patternFrequency = buildPatternFrequencyMap(patterns);

    const patternIds = Object.keys(patterns);
    const testPatternId = patternIds[0];

    const page = buildComponentSummaries(indexes, {
      patternId: testPatternId,
      sort: 'frequency',
      limit: 200,
      patterns,
      installRegistry,
      patternFrequency,
    });

    expect(page.total).toBeGreaterThan(0);
    for (let i = 0; i < page.items.length - 1; i++) {
      expect(page.items[i].frequency).toBeGreaterThanOrEqual(page.items[i + 1].frequency);
    }
  });

  it('does not throw with regex-special prefix characters', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    // prefix "[" would cause "Invalid regular expression" if passed to new RegExp
    // With string-based toCanonicalTag, this should not throw
    expect(() => {
      buildComponentSummaries(indexes, {
        prefix: '[',
        sort: 'frequency',
        limit: 10,
        patternFrequency: new Map(),
        installRegistry: {},
      });
    }).not.toThrow();
  });
});

describe('search_icons (logic)', () => {
  it('parses icon names from full-width comma description and quoted types', () => {
    expect(parseIconNamesFromDescription('iconPathsのキー: search、document、close）')).toEqual([
      'search',
      'document',
      'close',
    ]);
    expect(parseIconNamesFromType('"search" | "document" | `close`')).toEqual([
      'search',
      'document',
      'close',
    ]);
  });

  it('extracts icon names from dads-icon metadata', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const iconNames = extractIconNames(indexes);

    expect(iconNames.length).toBeGreaterThan(10);
    expect(iconNames).toContain('search');
    expect(iconNames).toContain('document');
  });

  it('supports query + pagination and respects prefix in usage examples', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const result = searchIconCatalog(indexes, {
      query: 'arrow',
      limit: 5,
      offset: 0,
      prefix: 'myui',
    });

    expect(result.limit).toBe(5);
    expect(result.icons.length).toBeLessThanOrEqual(5);
    expect(result.total).toBeGreaterThan(0);
    expect(result.icons[0].usageExample).toContain('<myui-icon');
  });

  // P-11: icon alias expansion (DD-18)
  it('search_icons resolves "x" alias to include "close" and "cancel" icons', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const result = searchIconCatalog(indexes, { query: 'x' });
    const names = result.icons.map((i) => i.name);
    expect(names).toContain('close');
    expect(names).toContain('cancel');
  });

  it('search_icons resolves "bell" alias to "notification" icon', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const result = searchIconCatalog(indexes, { query: 'bell' });
    const names = result.icons.map((i) => i.name);
    expect(names).toContain('notification');
  });

  it('clamps very long prefix to keep output bounded', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const hugePrefix = 'x'.repeat(2000);
    const result = searchIconCatalog(indexes, { limit: 100, prefix: hugePrefix });

    expect(result.icons.length).toBeGreaterThan(0);
    expect(result.icons[0].usageExample).toContain(`<${'x'.repeat(MAX_PREFIX_LENGTH)}-icon`);
    expect(result.icons[0].usageExample.length).toBeLessThan(200);

    const listResult = buildComponentSummaries(indexes, { prefix: hugePrefix });
    expect(listResult.items[0].tagName.startsWith(`${'x'.repeat(MAX_PREFIX_LENGTH)}-`)).toBe(true);
  });
});

// P-08: buildComponentTokenReferencedBy — maps CSS properties to component tagNames
describe('buildComponentTokenReferencedBy', () => {
  it('maps cssProperty name to declaring component', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const refMap = buildComponentTokenReferencedBy(manifest);
    // dads-button declares --dads-button-background
    const comps = refMap.get('--dads-button-background');
    expect(comps).toBeDefined();
    expect(comps.has('dads-button')).toBe(true);
  });

  it('get_design_token_detail includes componentReferencedBy for a component CSS property', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_design_token_detail',
        arguments: { name: '--dads-button-background' },
      });
      if (result.isError) return; // design-tokens.json may not have this entry
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      // componentReferencedBy should include dads-button
      expect(Array.isArray(payload.componentReferencedBy)).toBe(true);
      expect(payload.componentReferencedBy).toContain('dads-button');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

describe('prefix normalization compatibility (logic)', () => {
  it('resolves tagName using both raw and clamped prefix forms', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const hugePrefix = 'x'.repeat(2000);
    const clampedPrefix = 'x'.repeat(MAX_PREFIX_LENGTH);

    expect(toCanonicalTagName(`${hugePrefix}-button`, hugePrefix)).toBe('dads-button');
    expect(toCanonicalTagName(`${clampedPrefix}-button`, hugePrefix)).toBe('dads-button');

    const byHugeTag = pickDecl(indexes, { tagName: `${hugePrefix}-button`, prefix: hugePrefix });
    const byClampedTag = pickDecl(indexes, { tagName: `${clampedPrefix}-button`, prefix: hugePrefix });

    expect(byHugeTag?.tagName).toBe('dads-button');
    expect(byClampedTag?.tagName).toBe('dads-button');
  });
});

describe('get_component_api relatedComponents (logic)', () => {
  it('builds related component graph from patterns/deps', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const installRegistry = await loadBundledJson('install-registry.json');
    const patternRegistry = await loadBundledJson('pattern-registry.json');
    const indexes = buildIndexes(manifest);
    const relatedMap = buildRelatedComponentMap(installRegistry, patternRegistry.patterns ?? {});

    const related = getRelatedComponentsForTag({
      canonicalTagName: 'dads-button',
      installRegistry,
      relatedMap,
      prefix: CANONICAL_PREFIX,
    });

    expect(related.length).toBeGreaterThan(0);
    expect(related.every((item) => item.componentId !== 'button')).toBe(true);
    expect(related.every((item) => Array.isArray(item.tagNames))).toBe(true);
    expect(related.every((item) => Array.isArray(item.via))).toBe(true);
    expect(related.some((item) => item.tagNames.some((tag) => tag.startsWith('dads-')))).toBe(true);

    const prefixed = getRelatedComponentsForTag({
      canonicalTagName: 'dads-button',
      installRegistry,
      relatedMap,
      prefix: 'myui',
    });
    expect(prefixed.some((item) => item.tagNames.some((tag) => tag.startsWith('myui-')))).toBe(true);

    // sanity: helpers still expose declarations for downstream code paths
    expect(indexes.byTag.has('dads-button')).toBe(true);
  });
});

describe('tool descriptions', () => {
  it('get_design_system_overview description contains MUST guardrail', async () => {
    // Tool descriptions now live in core/register.mjs (DD-08)
    const coreSrc = await fs.readFile(path.join(__dirname, 'core/register.mjs'), 'utf8');
    expect(coreSrc).toContain('MUST be called first');
  });

  it('all tools have When/Returns/After guidance in descriptions', async () => {
    const coreSrc = await fs.readFile(path.join(__dirname, 'core/register.mjs'), 'utf8');

    // Tools that should have enhanced descriptions
    const toolNames = [
      'list_components',
      'search_icons',
      'get_component_api',
      'generate_usage_snippet',
      'get_install_recipe',
      'validate_markup',
      'list_patterns',
      'get_pattern_recipe',
      'generate_pattern_snippet',
      'get_design_tokens',
      'get_design_token_detail',
      'get_accessibility_docs',
      'search_guidelines',
    ];

    for (const name of toolNames) {
      // Each tool's description block should contain "When:" and "Returns:"
      const marker = `server.registerTool(\n    '${name}'`;
      const markerIndex = coreSrc.indexOf(marker);
      expect(markerIndex).toBeGreaterThanOrEqual(0);
      const toolSection = coreSrc.slice(markerIndex);
      const descEnd = toolSection.indexOf('inputSchema');
      const descBlock = toolSection.slice(0, descEnd);
      expect(descBlock).toContain('When:');
      expect(descBlock).toContain('Returns:');
    }
  });
});

describe('core.mjs facade export surface', () => {
  it('exports exactly the expected public symbols (no leak, no drop)', async () => {
    const core = await import('./core.mjs');
    const actual = Object.keys(core).sort();
    const expected = [
      'CANONICAL_PREFIX',
      'CATEGORY_MAP',
      'FIGMA_TO_WCF_PROMPT',
      'IDE_SETUP_TEMPLATES',
      'MAX_PREFIX_LENGTH',
      'MAX_TOOL_RESULT_BYTES',
      'PLUGIN_CONTRACT_VERSION',
      'PLUGIN_TOOL_NOTICE',
      'STRUCTURED_CONTENT_DISABLE_FLAG',
      'WCF_RESOURCE_URIS',
      'applyPrefixToHtml',
      'applyPrefixToTagMap',
      'buildAccessibilityIndex',
      'buildComponentSummaries',
      'buildComponentTokenReferencedBy',
      'buildDesignTokenDetailPayload',
      'buildDesignTokensPayload',
      'buildDiagnosticSuggestion',
      'buildFullPageHtml',
      'buildIconCatalog',
      'buildIndexes',
      'buildJsonToolErrorResponse',
      'buildJsonToolResponse',
      'buildPatternFrequencyMap',
      'buildPluginDataSourceMap',
      'buildRelatedComponentMap',
      'buildTokenRelationshipIndex',
      'buildTokenSuggestionMap',
      'createMcpServer',
      'expandQueryWithSynonyms',
      'extractAccessibilityChecklist',
      'extractIconNames',
      'extractPrefixFromIndexes',
      'extractReferencedTokenNames',
      'findCustomElementDeclarations',
      'findDeclByComponentId',
      'generateSnippet',
      'getCategory',
      'getRelatedComponentsForTag',
      'isStructuredContentDisabled',
      'levenshteinDistance',
      'loadPatternRegistryShape',
      'measureToolResultBytes',
      'normalizeCssVariable',
      'normalizePlugins',
      'normalizePrefix',
      'normalizeTokenIdentifier',
      'normalizeTokenValue',
      'normalizeWcagLevel',
      'parseIconNamesFromDescription',
      'parseIconNamesFromType',
      'pickDecl',
      'queryAccessibilityIndex',
      'resolveComponentClosure',
      'resolveTokenTheme',
      'searchIconCatalog',
      'serializeApi',
      'suggestTokenNames',
      'suggestUnknownElementTagName',
      'toCanonicalTagName',
      'toStructuredContent',
      'withPrefix',
    ];
    expect(actual).toEqual(expected);
  });
});

describe('MCP prompts/resources contract', () => {
  let client;
  let server;

  beforeAll(async () => {
    const created = await createMcpServer(
      loadBundledJson,
      async () => import('./validator.mjs'),
      { loadTextData: loadBundledText },
    );
    server = created.server;
    client = new Client(
      { name: 'wcf-mcp-test-client', version: '0.0.0' },
      { capabilities: {} },
    );
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
  });

  afterAll(async () => {
    await Promise.allSettled([
      client?.close?.(),
      server?.close?.(),
    ]);
  });

  it('registers figma_to_wcf prompt and returns ordered workflow', async () => {
    const promptList = await client.listPrompts();
    const figmaPrompt = promptList.prompts.find((item) => item.name === FIGMA_TO_WCF_PROMPT);
    expect(figmaPrompt).toBeDefined();
    expect(figmaPrompt?.arguments?.some((arg) => arg.name === 'figmaUrl' && arg.required === true)).toBe(true);

    const result = await client.getPrompt({
      name: FIGMA_TO_WCF_PROMPT,
      arguments: {
        figmaUrl: 'https://figma.com/design/abcd1234/MyFile?node-id=1-2',
        userIntent: 'Build account settings screen',
      },
    });
    const text = result.messages
      .map((message) => (message.content.type === 'text' ? message.content.text : ''))
      .join('\n');

    const expectedSequence = [
      'get_design_system_overview',
      'get_design_tokens',
      'get_component_api',
      'generate_usage_snippet',
      'validate_markup',
    ];

    let previousIndex = -1;
    for (const step of expectedSequence) {
      const index = text.indexOf(step);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('rejects figma_to_wcf prompt calls when figmaUrl is not a valid URL', async () => {
    await expect(
      client.getPrompt({
        name: FIGMA_TO_WCF_PROMPT,
        arguments: { figmaUrl: 'not-a-url' },
      }),
    ).rejects.toThrow(/Invalid arguments|validation|url/i);

    await expect(
      client.getPrompt({
        name: FIGMA_TO_WCF_PROMPT,
        arguments: { figmaUrl: '   ' },
      }),
    ).rejects.toThrow(/Invalid arguments|validation|url/i);
  });

  it('returns overview with prompt/resource discovery and 5 IDE templates', async () => {
    const result = await client.callTool({
      name: 'get_design_system_overview',
      arguments: {},
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));

    expect(client.getServerVersion()?.version).toBe(PACKAGE_VERSION);
    expect(payload.version).toBe(PACKAGE_VERSION);
    expect(Array.isArray(payload.ideSetupTemplates)).toBe(true);
    expect(payload.ideSetupTemplates.length).toBeGreaterThanOrEqual(5);
    expect(payload.ideSetupTemplates.some((item) => item.ide === 'VS Code (GitHub Copilot)')).toBe(true);
    expect(payload.ideSetupTemplates.some((item) => item.ide === 'Windsurf')).toBe(true);

    expect(payload.setupInfo).toBeDefined();
    expect(payload.setupInfo.npmPackage).toBe('web-components-factory');
    expect(typeof payload.setupInfo.installCommand).toBe('string');
    // v0.4.0: vendorRuntimePath uses <dir> placeholder (dynamic, not hardcoded)
    expect(payload.setupInfo.vendorRuntimePath).toBe('<dir>/');
    expect(typeof payload.setupInfo.htmlBoilerplate).toBe('string');
    expect(payload.setupInfo.htmlBoilerplate).toContain('<script');
    expect(payload.setupInfo.htmlBoilerplate).toContain('importmap');
    expect(payload.setupInfo.htmlBoilerplate).toContain('<dir>/boot.js');
    expect(typeof payload.setupInfo.noscriptGuidance).toBe('string');
    expect(payload.setupInfo.noscriptGuidance).toContain('noscript');

    // Tier 1: runtime setup info fields (v0.3.0)
    expect(payload.setupInfo.noCDN).toBe(true);
    expect(payload.setupInfo.deliveryModel).toBe('vendor-local');
    expect(typeof payload.setupInfo.importMapHint).toBe('string');
    expect(payload.setupInfo.importMapHint).toContain('importmap');
    expect(typeof payload.setupInfo.bootScript).toBe('string');
    expect(payload.setupInfo.bootScript).toContain('boot.js');
    // v0.4.0: detectedPrefix derived from CEM tagNames
    expect(payload.setupInfo.detectedPrefix).toBe(CANONICAL_PREFIX);
    expect(payload.setupInfo.vendorSetup).toBeDefined();
    expect(payload.setupInfo.vendorSetup.init).toContain('wcf init');
    expect(payload.setupInfo.vendorSetup.init).toContain(CANONICAL_PREFIX);
    expect(payload.setupInfo.vendorSetup.add).toContain('wcf add');
    expect(payload.setupInfo.vendorSetup.add).toContain(CANONICAL_PREFIX);
    expect(typeof payload.setupInfo.vendorSetup.workflow).toBe('string');
    expect(payload.setupInfo.htmlSetup).toContain('importmap');
    expect(payload.setupInfo.htmlSetup).toContain('boot.js');
    expect(payload.setupInfo.htmlSetup).toContain(`${CANONICAL_PREFIX}-button`);

    // Tier 2: distribution field (v0.5.0)
    expect(payload.setupInfo.distribution).toBeDefined();
    expect(payload.setupInfo.distribution.selfHosted).toBe(true);
    expect(payload.setupInfo.distribution.cdn).toBe(false);
    expect(payload.setupInfo.distribution.strategy).toBe('vendor-importmap');
    expect(payload.setupInfo.distribution.quickStart).toContain('web-components-factory init');
    expect(typeof payload.setupInfo.distribution.description).toBe('string');

    expect(Array.isArray(payload.availablePrompts)).toBe(true);
    expect(payload.availablePrompts.some((item) => item.name === FIGMA_TO_WCF_PROMPT)).toBe(true);

    expect(Array.isArray(payload.availableResources)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.components)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.tokens)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.guidelinesTemplate)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.llmsFull)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.skills)).toBe(true);
  });

  it('exposes static resources and guidelines template resources', async () => {
    const resourcesResult = await client.listResources();
    const uris = resourcesResult.resources.map((resource) => resource.uri);
    expect(uris).toContain(WCF_RESOURCE_URIS.components);
    expect(uris).toContain(WCF_RESOURCE_URIS.tokens);
    expect(uris).toContain(WCF_RESOURCE_URIS.llmsFull);
    expect(uris).toContain('wcf://guidelines/accessibility');
    expect(uris).toContain('wcf://guidelines/css');
    expect(uris).toContain('wcf://guidelines/patterns');
    expect(uris).toContain('wcf://guidelines/all');

    const templatesResult = await client.listResourceTemplates();
    expect(
      templatesResult.resourceTemplates.some((template) => template.uriTemplate === WCF_RESOURCE_URIS.guidelinesTemplate),
    ).toBe(true);
  });

  it('reads components/tokens/guidelines resources', async () => {
    const componentsResult = await client.readResource({ uri: WCF_RESOURCE_URIS.components });
    const componentsPayload = JSON.parse(String(componentsResult.contents?.[0]?.text ?? '{}'));
    expect(componentsPayload.total).toBeGreaterThan(0);
    expect(Array.isArray(componentsPayload.components)).toBe(true);

    const tokensResult = await client.readResource({ uri: WCF_RESOURCE_URIS.tokens });
    const tokensPayload = JSON.parse(String(tokensResult.contents?.[0]?.text ?? '{}'));
    if (tokensPayload.error) {
      expect(tokensPayload.error.code).toBe('DESIGN_TOKENS_DATA_UNAVAILABLE');
    } else {
      expect(tokensPayload.total).toBeGreaterThan(0);
      expect(tokensPayload).toHaveProperty('summary');
      expect(Array.isArray(tokensPayload.sample)).toBe(true);
    }

    const guidelines = await loadBundledJsonOrNull('guidelines-index.json');
    if (!guidelines) {
      await expect(
        client.readResource({ uri: 'wcf://guidelines/css' }),
      ).rejects.toThrow(/GUIDELINES_INDEX_UNAVAILABLE/);
      return;
    }

    const guidelinesResult = await client.readResource({ uri: 'wcf://guidelines/css' });
    const guidelinesPayload = JSON.parse(String(guidelinesResult.contents?.[0]?.text ?? '{}'));
    expect(guidelinesPayload.topic).toBe('css');
    expect(guidelinesPayload.totalDocuments).toBeGreaterThan(0);
  });

  it('returns INVALID_GUIDELINE_TOPIC for unsupported guideline topic', async () => {
    await expect(
      client.readResource({ uri: 'wcf://guidelines/unsupported' }),
    ).rejects.toThrow(/INVALID_GUIDELINE_TOPIC/);
  });

  it('reads llms-full resource with source parity', async () => {
    const result = await client.readResource({ uri: WCF_RESOURCE_URIS.llmsFull });
    const actual = String(result.contents?.[0]?.text ?? '');
    const expected = await loadBundledText('llms-full.txt');
    expect(actual).toBe(expected);
  });

  // P-09: verify all guideline topic URIs read successfully
  it('reads accessibility and patterns guideline resources', async () => {
    const guidelines = await loadBundledJsonOrNull('guidelines-index.json');
    if (!guidelines) return; // skip when index not built

    for (const topic of ['accessibility', 'patterns']) {
      const result = await client.readResource({ uri: `wcf://guidelines/${topic}` });
      const payload = JSON.parse(String(result.contents?.[0]?.text ?? '{}'));
      expect(payload.topic).toBe(topic);
      expect(payload.totalDocuments).toBeGreaterThanOrEqual(0);
    }
  });

  it('returns LLMS_FULL_UNAVAILABLE when loadTextData is not configured', async () => {
    const created = await createMcpServer(
      loadBundledJson,
      async () => import('./validator.mjs'),
    );
    const noTextServer = created.server;
    const noTextClient = new Client(
      { name: 'wcf-mcp-test-client-no-text', version: '0.0.0' },
      { capabilities: {} },
    );
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([
      noTextServer.connect(serverTransport),
      noTextClient.connect(clientTransport),
    ]);

    try {
      await expect(
        noTextClient.readResource({ uri: WCF_RESOURCE_URIS.llmsFull }),
      ).rejects.toThrow(/LLMS_FULL_UNAVAILABLE/);
    } finally {
      await Promise.allSettled([
        noTextClient.close(),
        noTextServer.close(),
      ]);
    }
  });

  it('get_component_api resolves by tagName', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { tagName: 'dads-button' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.tagName).toBe('dads-button');
  });

  it('get_component_api resolves by className', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { className: 'DadsButton' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.tagName).toBe('dads-button');
  });

  it('get_component_api resolves by bare name via auto-prefix (component param)', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'button' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.tagName).toBe('dads-button');
  });

  it('get_component_api returns suggestions for unknown component', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'nonexistent-xyz' },
    });
    expect(result.isError).toBe(true);
    expect(String(result.content?.[0]?.text)).toContain('not found');
  });

  it('get_component_api suggests correct tag for unprefixed typo (Levenshtein)', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'buton' },
    });
    expect(result.isError).toBe(true);
    const text = String(result.content?.[0]?.text);
    expect(text).toContain('Did you mean');
    expect(text).toContain('dads-button');
  });

  it('get_component_api returns interactionExamples for form components', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'input-text' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(Array.isArray(payload.interactionExamples)).toBe(true);
    expect(payload.interactionExamples.length).toBeGreaterThan(0);
    for (const ex of payload.interactionExamples) {
      expect(ex).toHaveProperty('scenario');
      expect(ex).toHaveProperty('code');
      expect(ex).toHaveProperty('trigger');
    }
  });

  it('get_component_api does NOT return interactionExamples for non-form components', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'button' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.interactionExamples).toBeUndefined();
  });

  it('get_component_api returns layoutBehavior for layout-shell', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'layout-shell' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.layoutBehavior).toBeDefined();
    expect(payload.layoutBehavior.responsive).toBeDefined();
    expect(payload.layoutBehavior.responsive.breakpoints).toBeDefined();
    expect(payload.layoutBehavior.constraints).toBeDefined();
    expect(payload.layoutBehavior.constraints.patterns).toContain('app-shell');
  });

  it('get_component_api returns layoutBehavior for device-mock', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'device-mock' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.layoutBehavior).toBeDefined();
    expect(payload.layoutBehavior.responsive.devices).toContain('mobile');
  });

  it('get_component_api returns layoutBehavior for layout-sidebar', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'layout-sidebar' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.layoutBehavior).toBeDefined();
    expect(payload.layoutBehavior.responsive).toBeDefined();
  });

  it('get_component_api does NOT return layoutBehavior for non-layout components', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'button' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.layoutBehavior).toBeUndefined();
  });

  it('generate_usage_snippet resolves by bare name via auto-prefix', async () => {
    const result = await client.callTool({
      name: 'generate_usage_snippet',
      arguments: { component: 'button' },
    });
    expect(result.isError).toBeFalsy();
    expect(String(result.content?.[0]?.text)).toContain('dads-button');
  });

  // P-10: attribute prefill with default values (unit test for generateSnippet)
  it('generate_usage_snippet prefills attribute default values', () => {
    const mockApi = {
      tagName: 'dads-mock',
      attributes: [
        { name: 'label', type: 'string', default: "'hello'" },
        { name: 'variant', type: 'string', default: "'outlined'" },
        { name: 'disabled', type: 'boolean', default: null },
      ],
      slots: [],
    };
    const snippet = generateSnippet(mockApi, 'dads');
    expect(snippet).toContain('dads-mock');
    expect(snippet).toContain('label="hello"');
    expect(snippet).toContain('variant="outlined"');
    // Boolean attrs should not have a value
    expect(snippet).toContain('  disabled');
    expect(snippet).not.toContain('disabled=');
  });

  // P-04: fallback values when CEM default is missing (#229)
  it('generate_usage_snippet uses fallback values when CEM default is missing', () => {
    const mockApi = {
      tagName: 'dads-input-text',
      attributes: [
        { name: 'label', type: 'string', default: null },
        { name: 'name', type: 'string', default: null },
        { name: 'variant', type: "'outlined' | 'solid'", default: "'outlined'" },
      ],
      slots: [],
    };
    const snippet = generateSnippet(mockApi, 'dads');
    expect(snippet).toContain('label="ラベル"');
    expect(snippet).toContain('name="field1"');
    // CEM default takes priority over fallback
    expect(snippet).toContain('variant="outlined"');
  });

  it('generate_usage_snippet uses first enum value for variant without CEM default', () => {
    // variant with no default should use the first enum value, not a hardcoded "solid"
    const mockApi = {
      tagName: 'dads-notification-banner',
      attributes: [
        { name: 'label', type: 'string', default: null },
        { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: null },
      ],
      slots: [],
    };
    const snippet = generateSnippet(mockApi, 'dads');
    expect(snippet).toContain('variant="info"');
    expect(snippet).not.toContain('variant="solid"');
  });

  it('generate_usage_snippet extracts enum from description when type is plain string', () => {
    // dads-button has type="string" but description="バリアント (solid | outlined | text)"
    const mockApi = {
      tagName: 'dads-button',
      attributes: [
        { name: 'label', type: 'string', description: 'ボタンラベル', default: null },
        { name: 'type', type: 'string', description: 'ボタンタイプ (button | submit | reset)', default: null },
        { name: 'variant', type: 'string', description: 'バリアント (solid | outlined | text)', default: null },
      ],
      slots: [],
    };
    const snippet = generateSnippet(mockApi, 'dads');
    expect(snippet).toContain('variant="solid"');
    expect(snippet).toContain('type="button"');
  });

  it('generate_usage_snippet uses empty string for unmapped non-enum attributes', () => {
    // 'size' is in attrPriority but NOT in SNIPPET_FALLBACK_VALUES and not an enum
    const mockApi = {
      tagName: 'dads-custom',
      attributes: [
        { name: 'label', type: 'string', default: null },
        { name: 'size', type: 'string', default: null },
      ],
      slots: [],
    };
    const snippet = generateSnippet(mockApi, 'dads');
    expect(snippet).toContain('label="ラベル"');
    expect(snippet).toContain('size=""');
  });

  it('generate_usage_snippet does not affect boolean attributes with fallback', () => {
    const mockApi = {
      tagName: 'dads-checkbox',
      attributes: [
        { name: 'label', type: 'string', default: null },
        { name: 'required', type: 'boolean', default: null },
        { name: 'disabled', type: 'boolean', default: null },
      ],
      slots: [],
    };
    const snippet = generateSnippet(mockApi, 'dads');
    expect(snippet).toContain('label="ラベル"');
    expect(snippet).toContain('  required');
    expect(snippet).not.toContain('required=');
  });

  it('get_component_api includes default field in attributes', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { tagName: 'dads-tab' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const activationAttr = payload.attributes?.find((a) => a.name === 'activation-mode');
    expect(activationAttr).toBeDefined();
    expect(activationAttr).toHaveProperty('default', "'auto'");
    // Attributes without defaults should have null
    const otherAttr = payload.attributes?.find((a) => a.default === null);
    if (otherAttr) {
      expect(otherAttr).toHaveProperty('default', null);
    }
  });

  // P-12: batch mode for get_component_api
  it('get_component_api batch returns array of 2 results', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { components: ['button', 'card'] },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '[]'));
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBe(2);
    expect(payload[0].tagName).toContain('button');
    expect(payload[1].tagName).toContain('card');
  });

  it('get_component_api single mode still works (backward compat)', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { component: 'button' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    // Single mode returns object, not array
    expect(payload.tagName).toContain('button');
    expect(Array.isArray(payload)).toBe(false);
  });

  it('get_component_api batch with unknown component includes error entry', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: { components: ['button', 'nonexistent-xyz'] },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '[]'));
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBe(2);
    expect(payload[0].tagName).toContain('button');
    expect(payload[1].error).toContain('not found');
  });

  it('get_component_api batch returns a bounded overflow payload for representative 10-component responses', async () => {
    const result = await client.callTool({
      name: 'get_component_api',
      arguments: {
        components: [
          'button',
          'checkbox',
          'input-text',
          'radio',
          'select',
          'textarea',
          'combobox',
          'date-picker',
          'file-upload',
          'dialog',
        ],
      },
    });
    expect(result.isError).toBeFalsy();
    expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
    const responseText = String(result.content?.[0]?.text ?? '{}');
    expect(responseText).not.toContain('\n  ');
    const payload = JSON.parse(responseText);
    expect(payload).toEqual({
      warning: {
        code: 'TOOL_RESULT_TOO_LARGE',
        message: 'Tool result exceeded the response size limit; returning metadata only.',
        actualBytes: expect.any(Number),
        limitBytes: MAX_TOOL_RESULT_BYTES,
      },
    });
    expect(result.structuredContent).toEqual(payload);
  });

  it('search_guidelines zero-result query returns suggestions with alternativeTools', async () => {
    const result = await client.callTool({
      name: 'search_guidelines',
      arguments: { query: 'xyznonexistentquery123' },
    });
    if (result.isError) {
      // guidelines-index.json not built — verify graceful error
      expect(String(result.content?.[0]?.text)).toContain('Guidelines index not available');
      return;
    }
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.totalHits).toBe(0);
    expect(payload.suggestions).toBeDefined();
    expect(Array.isArray(payload.suggestions.alternativeTools)).toBe(true);
    expect(payload.suggestions.alternativeTools.some((t) => t.tool === 'get_accessibility_docs')).toBe(true);
    expect(payload.suggestions.alternativeTools.some((t) => t.tool === 'get_component_api')).toBe(true);
  });

  it('search_guidelines benchmark: all 6 builder queries return >0 results', async () => {
    const BENCHMARK_QUERIES = [
      'keyboard navigation',
      'focus management',
      'color contrast',
      'form validation error',
      'heading hierarchy',
      'skip navigation',
    ];

    // Skip benchmark when guidelines-index.json is not built
    const probe = await client.callTool({
      name: 'search_guidelines',
      arguments: { query: BENCHMARK_QUERIES[0] },
    });
    if (probe.isError) {
      expect(String(probe.content?.[0]?.text)).toContain('Guidelines index not available');
      return;
    }
    const probePayload = JSON.parse(String(probe.content?.[0]?.text ?? '{}'));
    expect(probePayload.totalHits, `"${BENCHMARK_QUERIES[0]}" should return >0 results`).toBeGreaterThan(0);

    for (const query of BENCHMARK_QUERIES.slice(1)) {
      const result = await client.callTool({
        name: 'search_guidelines',
        arguments: { query },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.totalHits, `"${query}" should return >0 results`).toBeGreaterThan(0);
    }
  });

  // P-06: guidelines index expansion — new synonym and entry search hits
  it('search_guidelines returns results for "spacing token"', async () => {
    const result = await client.callTool({
      name: 'search_guidelines',
      arguments: { query: 'spacing token' },
    });
    if (result.isError) return; // skip if index not available
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.totalHits, '"spacing token" should hit >=1 guideline').toBeGreaterThanOrEqual(1);
  });

  it('search_guidelines returns results for "::part"', async () => {
    const result = await client.callTool({
      name: 'search_guidelines',
      arguments: { query: '::part' },
    });
    if (result.isError) return;
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.totalHits, '"::part" should hit >=1 guideline').toBeGreaterThanOrEqual(1);
  });

  it('search_guidelines returns results for "div soup"', async () => {
    const result = await client.callTool({
      name: 'search_guidelines',
      arguments: { query: 'div soup' },
    });
    if (result.isError) return;
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.totalHits, '"div soup" should hit >=1 guideline').toBeGreaterThanOrEqual(1);
  });

  // P-07: Enum attribute validation via validate_markup
  it('validate_markup detects invalid enum value with error severity', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-breadcrumb separator="invalid-val"></dads-breadcrumb>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const enumDiag = payload.diagnostics.find((d) => d.code === 'invalidEnumValue');
    expect(enumDiag).toBeDefined();
    expect(enumDiag.severity).toBe('error');
    expect(enumDiag.message).toContain('invalid-val');
    expect(enumDiag.message).toContain('separator');
    expect(enumDiag.hint).toBeTruthy();
  });

  it('validate_markup accepts valid enum values without error', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-breadcrumb separator="chevron"></dads-breadcrumb>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const enumDiag = payload.diagnostics.find((d) => d.code === 'invalidEnumValue');
    expect(enumDiag).toBeUndefined();
  });

  // P-08: Slot name and required attribute validation
  it('validate_markup detects invalid slot name', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<div slot="nonexistent-slot-xyz">content</div>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const slotDiag = payload.diagnostics.find((d) => d.code === 'invalidSlotName');
    expect(slotDiag).toBeDefined();
    expect(slotDiag.severity).toBe('error');
    expect(slotDiag.message).toContain('nonexistent-slot-xyz');
  });

  it('validate_markup accepts known slot names', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<div slot="header">content</div>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const slotDiag = payload.diagnostics.find((d) => d.code === 'invalidSlotName');
    expect(slotDiag).toBeUndefined();
  });

  it('validate_markup detects missing label on form input', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-input-text></dads-input-text>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const reqDiag = payload.diagnostics.find((d) => d.code === 'missingRequiredAttribute');
    expect(reqDiag).toBeDefined();
    expect(reqDiag.severity).toBe('error');
    expect(reqDiag.attrName).toBe('label');
  });

  it('validate_markup passes when label and name are present on form input', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-input-text label="Name" name="username"></dads-input-text>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const reqDiag = payload.diagnostics.find((d) => d.code === 'missingRequiredAttribute');
    expect(reqDiag).toBeUndefined();
  });

  // P-09: Parent-child + empty interactive element validation
  it('validate_markup warns on orphaned child component', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-breadcrumb-item>Home</dads-breadcrumb-item>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const orphanDiag = payload.diagnostics.find((d) => d.code === 'orphanedChildComponent');
    expect(orphanDiag).toBeDefined();
    expect(orphanDiag.severity).toBe('warning');
    expect(orphanDiag.message).toContain('dads-breadcrumb');
  });

  it('validate_markup does not warn on properly nested child', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-breadcrumb><dads-breadcrumb-item>Home</dads-breadcrumb-item></dads-breadcrumb>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const orphanDiag = payload.diagnostics.find((d) => d.code === 'orphanedChildComponent');
    expect(orphanDiag).toBeUndefined();
  });

  it('validate_markup warns on empty interactive button', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-button></dads-button>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const emptyDiag = payload.diagnostics.find((d) => d.code === 'emptyInteractiveElement');
    expect(emptyDiag).toBeDefined();
    expect(emptyDiag.severity).toBe('warning');
  });

  it('validate_markup does not warn on button with content', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-button>Click me</dads-button>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const emptyDiag = payload.diagnostics.find((d) => d.code === 'emptyInteractiveElement');
    expect(emptyDiag).toBeUndefined();
  });

  // P-03: E2E — canonical lowercase detection via validate_markup
  it('validate_markup detects non-lowercase attribute name', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-button Variant="solid">Click</dads-button>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const lowercaseDiag = payload.diagnostics.find((d) => d.code === 'canonicalLowercaseRecommendation');
    expect(lowercaseDiag).toBeDefined();
    expect(lowercaseDiag.severity).toBe('warning');
    expect(lowercaseDiag.suggestion).toContain('variant');
  });

  it('validate_markup does not flag lowercase attributes', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-button variant="solid">Click</dads-button>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const lowercaseDiag = payload.diagnostics.find((d) => d.code === 'canonicalLowercaseRecommendation');
    expect(lowercaseDiag).toBeUndefined();
  });

  // P-03: E2E — prefix suggestion via validate_markup
  it('validate_markup suggests prefixed tag for unprefixed custom element', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<input-text label="Name"></input-text>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const unknownDiag = payload.diagnostics.find((d) => d.code === 'unknownElement');
    expect(unknownDiag).toBeDefined();
    expect(unknownDiag.suggestion).toContain('dads-input-text');
  });

  // P-03: E2E — empty label / aria-label detection (DD-26)
  it('validate_markup detects empty label on custom element', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-input-text label=""></dads-input-text>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const emptyLabelDiag = payload.diagnostics.find((d) => d.code === 'emptyLabel');
    expect(emptyLabelDiag).toBeDefined();
    expect(emptyLabelDiag.severity).toBe('error');
    expect(emptyLabelDiag.suggestion).toBeDefined();
  });

  it('validate_markup detects empty aria-label on custom element', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-button aria-label="">Click</dads-button>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const emptyAriaLabelDiag = payload.diagnostics.find((d) => d.code === 'emptyAriaLabel');
    expect(emptyAriaLabelDiag).toBeDefined();
    expect(emptyAriaLabelDiag.severity).toBe('error');
    expect(emptyAriaLabelDiag.suggestion).toBeDefined();
  });

  it('validate_markup reports aria-live and role=alert as warnings', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<div aria-live="polite" role="alert">status</div>' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const ariaLive = payload.diagnostics.find((diag) => diag.code === 'ariaLiveNotRecommended');
    const roleAlert = payload.diagnostics.find((diag) => diag.code === 'roleAlertNotRecommended');
    expect(ariaLive?.severity).toBe('warning');
    expect(roleAlert?.severity).toBe('warning');
  });

  it('validate_markup does not flag non-empty label', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-input-text label="氏名"></dads-input-text>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const emptyLabelDiag = payload.diagnostics.find((d) => d.code === 'emptyLabel');
    expect(emptyLabelDiag).toBeUndefined();
  });

  // P-03 v0.5.0: name attribute required on form elements
  it('validate_markup detects missing name on form input', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-input-text label="Name"></dads-input-text>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const nameDiag = payload.diagnostics.find((d) => d.code === 'missingRequiredAttribute' && d.attrName === 'name');
    expect(nameDiag).toBeDefined();
    expect(nameDiag.tagName).toBe('dads-input-text');
  });

  it('validate_markup passes when both label and name are present', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-input-text label="Name" name="username"></dads-input-text>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const nameDiag = payload.diagnostics.find((d) => d.code === 'missingRequiredAttribute' && d.attrName === 'name');
    expect(nameDiag).toBeUndefined();
  });

  // P-03 v0.5.0: CDN reference detection
  it('validate_markup warns on CDN URL in markup', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<script src="https://cdn.jsdelivr.net/npm/some-package"></script>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const cdnDiag = payload.diagnostics.find((d) => d.code === 'cdnReference');
    expect(cdnDiag).toBeDefined();
  });

  // P-03 v0.5.0: missing importmap detection on full pages
  it('validate_markup warns on full page without importmap', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<!DOCTYPE html><html><head></head><body><dads-button>OK</dads-button></body></html>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const importmapDiag = payload.diagnostics.find((d) => d.code === 'missingImportmap');
    expect(importmapDiag).toBeDefined();
    const bootDiag = payload.diagnostics.find((d) => d.code === 'missingBootScript');
    expect(bootDiag).toBeDefined();
  });

  it('validate_markup does not warn on snippet without DOCTYPE', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-button>OK</dads-button>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const importmapDiag = payload.diagnostics.find((d) => d.code === 'missingImportmap');
    expect(importmapDiag).toBeUndefined();
  });

  it('validate_markup accepts single-quoted importmap type attribute', async () => {
    const html = "<!DOCTYPE html><html><head><script type='importmap'>{\"imports\":{}}</script><script type=\"module\" src=\"./vendor-runtime/boot.js\"></script></head><body><dads-button>OK</dads-button></body></html>";
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const importmapDiag = payload.diagnostics.find((d) => d.code === 'missingImportmap');
    expect(importmapDiag).toBeUndefined();
  });

  it('validate_markup does NOT flag date-picker missing label/name (not in CEM)', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-date-picker></dads-date-picker>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const requiredDiag = payload.diagnostics.find((d) => d.code === 'missingRequiredAttribute');
    expect(requiredDiag).toBeUndefined();
  });

  it('validate_markup does NOT flag file-upload missing label/name (not in CEM)', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-file-upload></dads-file-upload>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const requiredDiag = payload.diagnostics.find((d) => d.code === 'missingRequiredAttribute');
    expect(requiredDiag).toBeUndefined();
  });

  // P-03 v0.5.0: extended required tags (combobox)
  it('validate_markup detects missing name on combobox', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-combobox label="Search"></dads-combobox>' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const nameDiag = payload.diagnostics.find((d) => d.code === 'missingRequiredAttribute' && d.attrName === 'name');
    expect(nameDiag).toBeDefined();
  });

  // P-07 v0.7.0: list_components patternId & sort=frequency via MCP
  it('list_components accepts patternId parameter via MCP', async () => {
    const patternRegistryRaw = await loadBundledJson('pattern-registry.json');
    const patternIds = Object.keys(patternRegistryRaw?.patterns ?? {});
    expect(patternIds.length).toBeGreaterThan(0);
    const result = await client.callTool({
      name: 'list_components',
      arguments: { patternId: patternIds[0], limit: 200 },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.total).toBeGreaterThan(0);
  });

  it('list_components accepts sort=frequency parameter via MCP', async () => {
    const result = await client.callTool({
      name: 'list_components',
      arguments: { sort: 'frequency', limit: 50 },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.total).toBeGreaterThan(0);
    expect(payload.items[0]).toHaveProperty('frequency');
  });
});

// ---------------------------------------------------------------------------
// P-05: generate_full_page_html
// ---------------------------------------------------------------------------
describe('generate_full_page_html', () => {
  it('returns a complete HTML page with DOCTYPE and importmap', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'generate_full_page_html',
        arguments: { html: '<dads-button variant="solid">Click</dads-button>' },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.fullHtml).toContain('<!DOCTYPE html>');
      expect(payload.fullHtml).toContain('importmap');
      expect(payload.fullHtml).toContain('<dir>/boot.js');
      expect(payload.fullHtml).toContain('dads-button');
      expect(payload.componentCount).toBe(1);
      expect(payload.importMapEntries).toHaveProperty('dads-button');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('includes multiple components in importmap', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'generate_full_page_html',
        arguments: { html: '<dads-button>OK</dads-button><dads-card>Content</dads-card>' },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.componentCount).toBe(2);
      expect(payload.importMapEntries).toHaveProperty('dads-button');
      expect(payload.importMapEntries).toHaveProperty('dads-card');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('includes tokens CSS link and response under 100KB', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'generate_full_page_html',
        arguments: { html: '<dads-button>OK</dads-button>' },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.fullHtml).toContain('tokens.css');
      const text = String(result.content?.[0]?.text ?? '');
      expect(text.length).toBeLessThan(100 * 1024);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('buildFullPageHtml unit test produces valid structure', () => {
    const cemIndex = new Map([
      ['dads-button', { attributes: new Set(['variant']) }],
      ['dads-heading', { attributes: new Set(['level']) }],
    ]);
    const html = '<dads-button variant="solid">OK</dads-button>';
    const { fullHtml, importEntries } = buildFullPageHtml({ html, prefix: 'dads', cemIndex });
    expect(fullHtml).toContain('<!DOCTYPE html>');
    expect(fullHtml).toContain('<html lang="ja">');
    expect(fullHtml).toContain('importmap');
    expect(fullHtml).toContain('button.js');
    expect(fullHtml).not.toContain('heading.js'); // not used in fragment
    expect(importEntries).toHaveProperty('dads-button');
    expect(importEntries).not.toHaveProperty('dads-heading');
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

  it('has themes metadata and relationship graph', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    expect(data).toHaveProperty('themes');
    expect(data.themes).toHaveProperty('default', 'light');
    expect(Array.isArray(data.themes.available)).toBe(true);
    expect(data.themes.available).toContain('light');
    expect(data).toHaveProperty('relationships');
    expect(data.relationships).toHaveProperty('byToken');
    expect(typeof data.relationships.byToken).toBe('object');
  });

  it('returns INVALID_THEME error payload for dark/all at tool-contract helper level', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const darkResult = buildDesignTokensPayload(data, { theme: 'dark' });
    expect(darkResult.isError).toBe(true);
    expect(darkResult.payload.error.code).toBe('INVALID_THEME');

    const allResult = buildDesignTokensPayload(data, { theme: 'all' });
    expect(allResult.isError).toBe(true);
    expect(allResult.payload.error.code).toBe('INVALID_THEME');
  });
});

describe('token detail helpers', () => {
  it('normalizes token identifiers from var()/bare names', () => {
    expect(normalizeTokenIdentifier('var(--color-primary)')).toBe('--color-primary');
    expect(normalizeTokenIdentifier('--color-primary')).toBe('--color-primary');
    expect(normalizeTokenIdentifier('color-primary')).toBe('--color-primary');
  });

  it('extracts referenced token names from CSS values', () => {
    const refs = extractReferencedTokenNames('var(--color-a) solid var(--color-b, #fff)');
    expect(refs).toEqual(['--color-a', '--color-b']);
  });

  it('resolves supported and unsupported token themes', () => {
    expect(resolveTokenTheme('light')).toMatchObject({ ok: true, resolved: 'light' });
    expect(resolveTokenTheme(undefined)).toMatchObject({ ok: true, requested: 'light' });
    expect(resolveTokenTheme('dark')).toMatchObject({ ok: false, errorCode: 'INVALID_THEME' });
    expect(resolveTokenTheme('all')).toMatchObject({ ok: false, errorCode: 'INVALID_THEME' });
  });

  it('builds relationships and provides token suggestions', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const rel = buildTokenRelationshipIndex(data);
    expect(rel).toHaveProperty('byToken');
    const suggested = suggestTokenNames('--color-primar', data.tokens);
    expect(Array.isArray(suggested)).toBe(true);
    expect(suggested.length).toBeGreaterThan(0);
  });

  it('builds token detail payload for known and unknown tokens', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const knownName = data.tokens.find((token) => String(token?.name).startsWith('--color-'))?.name;
    expect(typeof knownName).toBe('string');
    const known = buildDesignTokenDetailPayload(data, knownName, 'light');
    expect(known.isError).toBe(false);
    expect(known.payload).toHaveProperty('token');
    expect(known.payload).toHaveProperty('references');
    expect(known.payload).toHaveProperty('referencedBy');
    expect(known.payload).toHaveProperty('usageExamples');

    const unknown = buildDesignTokenDetailPayload(data, '--unknown-token-for-test', 'light');
    expect(unknown.isError).toBe(true);
    expect(unknown.payload.error.code).toBe('TOKEN_NOT_FOUND');
    expect(Array.isArray(unknown.payload.suggestions)).toBe(true);
  });

  it('returns invalid theme error in token detail payload', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const result = buildDesignTokenDetailPayload(data, '--color-primary', 'dark');
    expect(result.isError).toBe(true);
    expect(result.payload.error.code).toBe('INVALID_THEME');
  });

  it('returns non-empty usageExamples for color and spacing tokens', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const colorToken = data.tokens.find((t) => String(t?.type).toLowerCase() === 'color' && t?.name);
    if (colorToken) {
      const result = buildDesignTokenDetailPayload(data, colorToken.name, 'light');
      expect(result.isError).toBe(false);
      expect(result.payload.usageExamples.length).toBeGreaterThan(0);
      expect(result.payload.usageExamples[0]).toContain('color');
    }

    const spacingToken = data.tokens.find((t) => String(t?.type).toLowerCase() === 'spacing' && t?.name);
    if (spacingToken) {
      const result = buildDesignTokenDetailPayload(data, spacingToken.name, 'light');
      expect(result.isError).toBe(false);
      expect(result.payload.usageExamples.length).toBeGreaterThan(0);
      expect(result.payload.usageExamples[0]).toContain(spacingToken.cssVariable || spacingToken.name);
    }
  });

  it('extracts relatedTokens from semantic referencedBy entries', async () => {
    let data;
    try {
      data = await loadBundledJson('design-tokens.json');
    } catch {
      return;
    }

    const primitiveColor = data.tokens.find(
      (t) => String(t?.category).toLowerCase() === 'primitive' && String(t?.type).toLowerCase() === 'color' && t?.name,
    );
    if (primitiveColor) {
      const result = buildDesignTokenDetailPayload(data, primitiveColor.name, 'light');
      expect(result.isError).toBe(false);
      expect(Array.isArray(result.payload.relatedTokens)).toBe(true);
    }
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

  it('synonym expansion returns expanded terms for "keyboard"', () => {
    const expanded = expandQueryWithSynonyms('keyboard');
    expect(expanded).toContain('keyboard');
    expect(expanded).toContain('focus');
    expect(expanded).toContain('tab');
    expect(expanded.length).toBeGreaterThan(1);
  });

  it('synonym expansion does not expand unrelated terms', () => {
    const expanded = expandQueryWithSynonyms('button');
    expect(expanded).toEqual(['button']);
  });

  it('synonym expansion: "layout" → includes grid, flexbox, responsive', () => {
    const expanded = expandQueryWithSynonyms('layout');
    expect(expanded).toContain('layout');
    expect(expanded).toContain('grid');
    expect(expanded).toContain('flexbox');
    expect(expanded).toContain('responsive');
  });

  it('synonym expansion: "responsive" → includes media query, breakpoint', () => {
    const expanded = expandQueryWithSynonyms('responsive');
    expect(expanded).toContain('media query');
    expect(expanded).toContain('breakpoint');
  });

  it('synonym expansion: "error" → includes validation, aria-invalid', () => {
    const expanded = expandQueryWithSynonyms('error');
    expect(expanded).toContain('validation');
    expect(expanded).toContain('aria-invalid');
    expect(expanded).toContain('aria-describedby');
  });

  it('SYNONYM_TABLE has 10+ entries', () => {
    // expandQueryWithSynonyms uses SYNONYM_TABLE internally;
    // verify by checking that 12 distinct keys produce expansions
    const keys = ['aria-live', 'keyboard', 'contrast', 'spacing', 'skip-navigation',
      'heading', 'form', 'layout', 'responsive', 'error', 'focus', 'token'];
    let expandedCount = 0;
    for (const key of keys) {
      if (expandQueryWithSynonyms(key).length > 1) expandedCount++;
    }
    expect(expandedCount).toBeGreaterThanOrEqual(10);
  });

  it('body field is present in guidelines-index sections', async () => {
    let data;
    try {
      data = await loadBundledJson('guidelines-index.json');
    } catch {
      return;
    }

    const docWithBody = data.documents.find(
      (d) => d.sections.some((s) => typeof s.body === 'string' && s.body.length > 0),
    );
    expect(docWithBody).toBeDefined();
  });

  it('contains DADS topic entries (keyboard, focus, contrast, form, heading, skip)', async () => {
    let data;
    try {
      data = await loadBundledJson('guidelines-index.json');
    } catch {
      return;
    }

    const ids = data.documents.map((d) => d.id);
    expect(ids).toContain('dads:keyboard-navigation');
    expect(ids).toContain('dads:focus-management');
    expect(ids).toContain('dads:contrast-color');
    expect(ids).toContain('dads:form-validation');
    expect(ids).toContain('dads:heading-hierarchy');
    expect(ids).toContain('dads:skip-navigation');
  });
});

describe('get_accessibility_docs (logic)', () => {
  it('builds accessibility index with component and guideline sources', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const guidelines = await loadBundledJsonOrNull('guidelines-index.json');
    if (!guidelines) return;
    const indexes = buildIndexes(manifest);

    const entries = buildAccessibilityIndex(indexes, guidelines, { prefix: 'dads' });
    expect(entries.length).toBeGreaterThanOrEqual(10);
    expect(entries.some((entry) => entry.source === 'component')).toBe(true);
    expect(entries.some((entry) => entry.source === 'guideline')).toBe(true);
  });

  it('supports component/topic/wcagLevel filtering', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const guidelines = await loadBundledJsonOrNull('guidelines-index.json');
    if (!guidelines) return;
    const indexes = buildIndexes(manifest);
    const entries = buildAccessibilityIndex(indexes, guidelines, { prefix: 'myui' });

    const filtered = queryAccessibilityIndex(entries, {
      componentTagName: 'myui-button',
      topic: 'labels',
      wcagLevel: 'A',
      maxResults: 100,
    });
    expect(filtered.totalHits).toBeGreaterThan(0);
    expect(filtered.results.every((entry) => entry.componentTagName === 'myui-button')).toBe(true);
    expect(filtered.results.every((entry) => entry.topic === 'labels')).toBe(true);
    expect(filtered.results.every((entry) => entry.wcagLevel === 'A')).toBe(true);
  });

  it('includes guideline entries in default results when available', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const guidelines = await loadBundledJsonOrNull('guidelines-index.json');
    if (!guidelines) return;
    const indexes = buildIndexes(manifest);
    const entries = buildAccessibilityIndex(indexes, guidelines, { prefix: 'dads' });

    const filtered = queryAccessibilityIndex(entries, {});
    expect(filtered.totalHits).toBeGreaterThan(filtered.results.length);
    expect(filtered.results.some((entry) => entry.source === 'guideline')).toBe(true);
    expect(filtered.results.some((entry) => entry.source === 'component')).toBe(true);
  });

  it('extracts component-level accessibility checklist from CEM custom data', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const indexes = buildIndexes(manifest);
    const decl = pickDecl(indexes, { tagName: 'dads-button', prefix: 'dads' });

    expect(decl).toBeDefined();
    const checklist = extractAccessibilityChecklist(decl, { prefix: 'myui' });
    expect(checklist).toBeDefined();
    expect(checklist.totalChecks).toBeGreaterThan(0);
    expect(checklist.componentTagName).toBe('myui-button');
    expect(checklist.items.some((item) => item.topic === 'labels')).toBe(true);
  });
});

describe('structuredContent helpers', () => {
  it('returns structuredContent by default', () => {
    const payload = {
      query: 'button',
      topic: 'all',
      totalHits: 1,
      results: [{ id: 'x' }],
    };
    const result = buildJsonToolResponse(payload, { env: {} });

    expect(result).toHaveProperty('content');
    expect(result.structuredContent).toEqual(payload);
    expect(JSON.parse(result.content[0].text)).toEqual(payload);
  });

  it('disables structuredContent when rollback flag is enabled', () => {
    const payload = { total: 1, tokens: [], summary: {} };
    const result = buildJsonToolResponse(payload, { env: { [STRUCTURED_CONTENT_DISABLE_FLAG]: '1' } });

    expect(isStructuredContentDisabled({ [STRUCTURED_CONTENT_DISABLE_FLAG]: '1' })).toBe(true);
    expect(result.structuredContent).toBeUndefined();
    expect(JSON.parse(result.content[0].text)).toEqual(payload);
  });

  it('marks JSON error responses without dropping structuredContent', () => {
    const payload = {
      error: {
        code: 'TOKEN_NOT_FOUND',
        message: 'Token not found: --missing-token',
      },
    };
    const result = buildJsonToolErrorResponse(payload, { env: {} });

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual(payload);
    expect(JSON.parse(result.content[0].text)).toEqual(payload);
  });

  it('keeps JSON error responses bounded when isError would otherwise exceed the response size limit', () => {
    const payload = { blob: 'x'.repeat(102325) };

    const result = buildJsonToolErrorResponse(payload, { env: {} });

    expect(result.isError).toBe(true);
    expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
    expect(result.structuredContent).toEqual({
      warning: {
        code: 'TOOL_RESULT_TOO_LARGE',
        message: 'Tool result exceeded the response size limit; returning metadata only.',
        actualBytes: expect.any(Number),
        limitBytes: MAX_TOOL_RESULT_BYTES,
      },
    });
    expect(JSON.parse(result.content[0].text)).toEqual(result.structuredContent);
  });

  it('builds token suggestion map from color/spacing tokens only', () => {
    const map = buildTokenSuggestionMap({
      tokens: [
        { type: 'color', value: '#333', cssVariable: 'var(--color-text-body)' },
        { type: 'spacing', value: '16px', cssVariable: '--spacing-4' },
        { type: 'spacing', value: '8px', cssVariable: 'var(--spacing-2, 8px)' },
        { type: 'typography', value: '14px', cssVariable: '--font-size-sm' },
        { type: 'color', value: '#fff', cssVariable: 'color-token' },
      ],
    });

    expect(map.get('#333')).toBe('--color-text-body');
    expect(map.get('16px')).toBe('--spacing-4');
    expect(map.get('8px')).toBe('--spacing-2');
    expect(map.has('14px')).toBe(false);
    expect(map.has('#fff')).toBe(false);
  });

  it('omits structuredContent when adding it would exceed the response size limit', () => {
    const payload = { blob: 'x'.repeat(70 * 1024) };
    const textOnlyResponse = buildJsonToolResponse(payload, {
      env: { [STRUCTURED_CONTENT_DISABLE_FLAG]: '1' },
    });
    const structuredCandidate = {
      ...textOnlyResponse,
      structuredContent: payload,
    };

    expect(measureToolResultBytes(structuredCandidate)).toBeGreaterThan(MAX_TOOL_RESULT_BYTES);

    const result = buildJsonToolResponse(payload, { env: {} });
    expect(result.structuredContent).toBeUndefined();
    expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
  });

  it('returns an overflow warning payload when compact text-only would still exceed the response size limit', () => {
    const payload = { blob: 'x'.repeat(120 * 1024) };

    const result = buildJsonToolResponse(payload, { env: {} });

    expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
    expect(result.structuredContent).toEqual({
      warning: {
        code: 'TOOL_RESULT_TOO_LARGE',
        message: 'Tool result exceeded the response size limit; returning metadata only.',
        actualBytes: expect.any(Number),
        limitBytes: MAX_TOOL_RESULT_BYTES,
      },
    });
    expect(JSON.parse(result.content[0].text)).toEqual(result.structuredContent);
  });

  it('keeps overflow fallback bounded when structuredContent is disabled', () => {
    const payload = { blob: 'x'.repeat(120 * 1024) };

    const result = buildJsonToolResponse(payload, {
      env: { [STRUCTURED_CONTENT_DISABLE_FLAG]: '1' },
    });

    expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
    expect(result.structuredContent).toBeUndefined();
    expect(JSON.parse(result.content[0].text)).toEqual({
      warning: {
        code: 'TOOL_RESULT_TOO_LARGE',
        message: 'Tool result exceeded the response size limit; returning metadata only.',
        actualBytes: expect.any(Number),
        limitBytes: MAX_TOOL_RESULT_BYTES,
      },
    });
  });
});

describe('token misuse detection', () => {
  const valueToToken = new Map([
    ['#333', '--color-text-body'],
    ['#ffffff', '--color-background-default'],
    ['16px', '--spacing-4'],
  ]);

  it('detects hard-coded color and suggests token', () => {
    const html = '<dads-text style="color: #333">Hello</dads-text>';
    const diagnostics = detectTokenMisuseInInlineStyles({ text: html, valueToToken });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('tokenMisuse');
    expect(diagnostics[0].message).toContain('var(--color-text-body)');
  });

  it('detects hard-coded background-color and suggests token', () => {
    const html = '<dads-card style="background-color: #ffffff">Card</dads-card>';
    const diagnostics = detectTokenMisuseInInlineStyles({ text: html, valueToToken });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toContain('var(--color-background-default)');
  });

  it('detects hard-coded padding and suggests spacing token', () => {
    const html = '<dads-button style="padding: 16px">Button</dads-button>';
    const diagnostics = detectTokenMisuseInInlineStyles({ text: html, valueToToken });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toContain('var(--spacing-4)');
  });

  it('does not report var() usage or unsupported properties', () => {
    const html = '<dads-text style="color: var(--color-text-body); margin: 16px">OK</dads-text>';
    const diagnostics = detectTokenMisuseInInlineStyles({ text: html, valueToToken });
    expect(diagnostics).toHaveLength(0);
  });
});

describe('accessibility misuse detection', () => {
  it('detects aria-live and role=alert usage', () => {
    const html = '<dads-input-text aria-live="polite" role="alert"></dads-input-text>';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });

    expect(diagnostics).toHaveLength(2);
    expect(diagnostics.some((d) => d.code === 'ariaLiveNotRecommended')).toBe(true);
    expect(diagnostics.some((d) => d.code === 'roleAlertNotRecommended')).toBe(true);
  });

  it('does not report diagnostics for markup without blocked patterns', () => {
    const html = '<dads-input-text aria-describedby="support-text" aria-invalid="true"></dads-input-text>';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });
    expect(diagnostics).toHaveLength(0);
  });

  it('does not mis-detect data-role as role attribute', () => {
    const html = '<dads-input-text data-role="alert" aria-role="alert"></dads-input-text>';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });
    expect(diagnostics).toHaveLength(0);
  });

  it('does not mis-detect role=alert text inside another attribute value', () => {
    const html = '<dads-input-text data-note="abc role=alert def"></dads-input-text>';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });
    expect(diagnostics).toHaveLength(0);
  });

  it('detects empty label attribute on custom element', () => {
    const html = '<dads-input-text label=""></dads-input-text>';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });
    const emptyLabel = diagnostics.find((d) => d.code === 'emptyLabel');
    expect(emptyLabel).toBeDefined();
    expect(emptyLabel.tagName).toBe('dads-input-text');
    expect(emptyLabel.attrName).toBe('label');
  });

  it('detects empty aria-label attribute on custom element', () => {
    const html = '<dads-button aria-label=""></dads-button>';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });
    const emptyAriaLabel = diagnostics.find((d) => d.code === 'emptyAriaLabel');
    expect(emptyAriaLabel).toBeDefined();
    expect(emptyAriaLabel.tagName).toBe('dads-button');
    expect(emptyAriaLabel.attrName).toBe('aria-label');
  });

  it('does not flag non-empty label on custom element', () => {
    const html = '<dads-input-text label="氏名"></dads-input-text>';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });
    const emptyLabel = diagnostics.find((d) => d.code === 'emptyLabel');
    expect(emptyLabel).toBeUndefined();
  });

  it('does not flag empty label on native HTML elements', () => {
    const html = '<input label="">';
    const diagnostics = detectAccessibilityMisuseInMarkup({ text: html });
    const emptyLabel = diagnostics.find((d) => d.code === 'emptyLabel');
    expect(emptyLabel).toBeUndefined();
  });
});

describe('diagnostic suggestion helpers', () => {
  it('suggests closest tag name for unknown custom element', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const decls = findCustomElementDeclarations(manifest);
    const cemIndex = new Map(decls.map((decl) => [decl.tagName.toLowerCase(), { attributes: new Set() }]));

    const suggestion = suggestUnknownElementTagName('dads-buton', cemIndex);
    expect(suggestion).toBe('dads-button');

    const diagnosticSuggestion = buildDiagnosticSuggestion({
      diagnostic: { code: 'unknownElement', tagName: 'dads-buton' },
      cemIndex,
    });
    expect(diagnosticSuggestion).toContain('"dads-button"');
  });

  it('returns fixed suggestions for forbidden and accessibility misuse diagnostics', () => {
    expect(buildDiagnosticSuggestion({
      diagnostic: { code: 'forbiddenAttribute', attrName: 'placeholder' },
      cemIndex: new Map(),
    })).toContain('aria-label');

    expect(buildDiagnosticSuggestion({
      diagnostic: { code: 'ariaLiveNotRecommended' },
      cemIndex: new Map(),
    })).toContain('aria-describedby');

    expect(buildDiagnosticSuggestion({
      diagnostic: { code: 'roleAlertNotRecommended' },
      cemIndex: new Map(),
    })).toContain('role="alert"');

    expect(buildDiagnosticSuggestion({
      diagnostic: { code: 'emptyLabel', hint: 'Set label to a descriptive text, e.g. label="氏名".' },
      cemIndex: new Map(),
    })).toContain('label=');

    expect(buildDiagnosticSuggestion({
      diagnostic: { code: 'emptyAriaLabel', hint: 'Set aria-label to descriptive text or use a visible <label> element instead.' },
      cemIndex: new Map(),
    })).toContain('aria-label');
  });

  it('does not force suggestion for unknownAttribute and keeps hint-compatible path', () => {
    const suggestion = buildDiagnosticSuggestion({
      diagnostic: { code: 'unknownAttribute', attrName: 'foo', hint: 'legacy-hint' },
      cemIndex: new Map(),
    });
    expect(suggestion).toBeUndefined();
  });
});

describe('repo-local validator wiring', () => {
  it('loadValidator from design-system-mcp provides all validators', async () => {
    const { loadValidator } = await import('../../scripts/mcp/design-system-mcp.mjs');
    const validator = await loadValidator();

    expect(typeof validator.collectCemCustomElements).toBe('function');
    expect(typeof validator.validateTextAgainstCem).toBe('function');
    expect(typeof validator.detectTokenMisuseInInlineStyles).toBe('function');
    expect(typeof validator.detectAccessibilityMisuseInMarkup).toBe('function');
    expect(typeof validator.detectNonLowercaseAttributes).toBe('function');
    expect(typeof validator.detectEnumValueMisuse).toBe('function');
    expect(typeof validator.detectInvalidSlotName).toBe('function');
    expect(typeof validator.detectMissingRequiredAttributes).toBe('function');
    expect(typeof validator.detectOrphanedChildComponents).toBe('function');
    expect(typeof validator.detectEmptyInteractiveElement).toBe('function');
  });
});

describe('enum attribute validation', () => {
  it('buildEnumAttributeMap extracts enum types from CEM', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const enumMap = buildEnumAttributeMap(manifest);
    expect(enumMap.size).toBeGreaterThan(0);
    // dads-breadcrumb has separator enum: 'chevron' | 'slash' | 'pipe'
    const breadcrumbEnums = enumMap.get('dads-breadcrumb');
    expect(breadcrumbEnums).toBeDefined();
    expect(breadcrumbEnums.has('separator')).toBe(true);
    const validSeparators = breadcrumbEnums.get('separator');
    expect(validSeparators.has('chevron')).toBe(true);
    expect(validSeparators.has('slash')).toBe(true);
    expect(validSeparators.has('pipe')).toBe(true);
  });

  it('detectEnumValueMisuse returns error for invalid values', () => {
    const enumMap = new Map([
      ['dads-button', new Map([['variant', new Set(['solid', 'outlined', 'text'])]])],
    ]);
    const diagnostics = detectEnumValueMisuse({
      text: '<dads-button variant="bogus">Click</dads-button>',
      enumMap,
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('invalidEnumValue');
    expect(diagnostics[0].severity).toBe('error');
    expect(diagnostics[0].message).toContain('bogus');
    expect(diagnostics[0].message).toContain('variant');
    expect(diagnostics[0].hint).toContain("'solid'");
  });

  it('detectEnumValueMisuse accepts valid values silently', () => {
    const enumMap = new Map([
      ['dads-button', new Map([['variant', new Set(['solid', 'outlined', 'text'])]])],
    ]);
    const diagnostics = detectEnumValueMisuse({
      text: '<dads-button variant="solid">Click</dads-button>',
      enumMap,
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectEnumValueMisuse skips empty attribute values', () => {
    const enumMap = new Map([
      ['dads-button', new Map([['variant', new Set(['solid', 'outlined'])]])],
    ]);
    const diagnostics = detectEnumValueMisuse({
      text: '<dads-button variant>Click</dads-button>',
      enumMap,
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('buildEnumAttributeMap covers multiple components with enum types', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const enumMap = buildEnumAttributeMap(manifest);
    // v0.4.0 spike: 23+ components should have enum data in CEM
    expect(enumMap.size).toBeGreaterThanOrEqual(20);
    // notification-banner has rich enum types
    const nbEnums = enumMap.get('dads-notification-banner');
    expect(nbEnums).toBeDefined();
    expect(nbEnums.get('type')).toContain('success');
    expect(nbEnums.get('type')).toContain('error');
    // divider has orientation enum
    const dividerEnums = enumMap.get('dads-divider');
    expect(dividerEnums).toBeDefined();
    expect(dividerEnums.get('orientation')).toContain('horizontal');
    expect(dividerEnums.get('orientation')).toContain('vertical');
  });
});

describe('slot and required attribute validation', () => {
  it('buildSlotNameMap extracts slot names from CEM', async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const slotMap = buildSlotNameMap(manifest);
    expect(slotMap.size).toBeGreaterThan(0);
    // dads-accordion-item-details has slots: content, header
    const accordionSlots = slotMap.get('dads-accordion-item-details');
    expect(accordionSlots).toBeDefined();
    expect(accordionSlots.has('content')).toBe(true);
    expect(accordionSlots.has('header')).toBe(true);
  });

  it('detectInvalidSlotName flags unknown slot names', () => {
    const slotMap = new Map([
      ['dads-accordion-item-details', new Set(['content', 'header'])],
    ]);
    const diagnostics = detectInvalidSlotName({
      text: '<div slot="bogus-slot">content</div>',
      slotMap,
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('invalidSlotName');
    expect(diagnostics[0].severity).toBe('error');
    expect(diagnostics[0].message).toContain('bogus-slot');
  });

  it('detectInvalidSlotName accepts known slot names', () => {
    const slotMap = new Map([
      ['dads-accordion-item-details', new Set(['content', 'header'])],
    ]);
    const diagnostics = detectInvalidSlotName({
      text: '<div slot="content">content</div>',
      slotMap,
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectMissingRequiredAttributes flags missing label and name on form input', () => {
    const diagnostics = detectMissingRequiredAttributes({
      text: '<dads-input-text></dads-input-text>',
    });
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics.some((d) => d.attrName === 'label')).toBe(true);
    expect(diagnostics.some((d) => d.attrName === 'name')).toBe(true);
    expect(diagnostics[0].code).toBe('missingRequiredAttribute');
    expect(diagnostics[0].tagName).toBe('dads-input-text');
  });

  it('detectMissingRequiredAttributes passes when label and name are present', () => {
    const diagnostics = detectMissingRequiredAttributes({
      text: '<dads-input-text label="Name" name="username"></dads-input-text>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectMissingRequiredAttributes respects custom prefix', () => {
    const diagnostics = detectMissingRequiredAttributes({
      text: '<myui-input-text></myui-input-text>',
      prefix: 'myui',
    });
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].tagName).toBe('myui-input-text');
  });
});

describe('parent-child and empty interactive validation', () => {
  it('detectOrphanedChildComponents warns on orphaned child', () => {
    const diagnostics = detectOrphanedChildComponents({
      text: '<dads-breadcrumb-item>Home</dads-breadcrumb-item>',
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('orphanedChildComponent');
    expect(diagnostics[0].severity).toBe('warning');
    expect(diagnostics[0].message).toContain('dads-breadcrumb');
  });

  it('detectOrphanedChildComponents passes when parent wraps child', () => {
    const diagnostics = detectOrphanedChildComponents({
      text: '<dads-breadcrumb><dads-breadcrumb-item>Home</dads-breadcrumb-item></dads-breadcrumb>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectOrphanedChildComponents passes with intermediate HTML elements', () => {
    const diagnostics = detectOrphanedChildComponents({
      text: '<dads-breadcrumb><nav aria-label="パンくず"><dads-breadcrumb-item>Home</dads-breadcrumb-item></nav></dads-breadcrumb>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectOrphanedChildComponents passes with multiple levels of intermediate elements', () => {
    const diagnostics = detectOrphanedChildComponents({
      text: '<dads-list><ul><li><dads-list-item>A</dads-list-item></li><li><dads-list-item>B</dads-list-item></li></ul></dads-list>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectOrphanedChildComponents passes with multiple sibling children (prefix substring fix)', () => {
    // This was the primary false positive: lastIndexOf('</dads-list') matched '</dads-list-item>'
    const diagnostics = detectOrphanedChildComponents({
      text: '<dads-list><dads-list-item>A</dads-list-item><dads-list-item>B</dads-list-item></dads-list>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectOrphanedChildComponents detects orphan after parent is closed', () => {
    const diagnostics = detectOrphanedChildComponents({
      text: '<dads-breadcrumb></dads-breadcrumb><dads-breadcrumb-item>Orphan</dads-breadcrumb-item>',
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('orphanedChildComponent');
  });

  it('detectOrphanedChildComponents handles self-closing tags between parent and child', () => {
    const diagnostics = detectOrphanedChildComponents({
      text: '<dads-breadcrumb><br/><hr><dads-breadcrumb-item>A</dads-breadcrumb-item></dads-breadcrumb>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectOrphanedChildComponents validates all 6 PARENT_CHILD_CONSTRAINTS with intermediaries', () => {
    const pairs = [
      ['dads-accordion-details', 'dads-accordion-item-details'],
      ['dads-breadcrumb', 'dads-breadcrumb-item'],
      ['dads-list', 'dads-list-item'],
      ['dads-step-navigation', 'dads-step-navigation-item'],
      ['dads-global-menu', 'dads-global-menu-item'],
      ['dads-menu-list', 'dads-menu-list-item'],
    ];
    for (const [parent, child] of pairs) {
      const diagnostics = detectOrphanedChildComponents({
        text: `<${parent}><div><${child}>X</${child}></div></${parent}>`,
      });
      expect(diagnostics).toHaveLength(0);
    }
  });

  it('detectOrphanedChildComponents supports custom prefix', () => {
    const diagnostics = detectOrphanedChildComponents({
      text: '<x-breadcrumb-item>A</x-breadcrumb-item>',
      prefix: 'x',
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toContain('x-breadcrumb');
  });

  it('detectEmptyInteractiveElement warns on empty button', () => {
    const diagnostics = detectEmptyInteractiveElement({
      text: '<dads-button></dads-button>',
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('emptyInteractiveElement');
    expect(diagnostics[0].severity).toBe('warning');
  });

  it('detectEmptyInteractiveElement passes with text content', () => {
    const diagnostics = detectEmptyInteractiveElement({
      text: '<dads-button>Click me</dads-button>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectEmptyInteractiveElement passes with aria-label', () => {
    const diagnostics = detectEmptyInteractiveElement({
      text: '<dads-button aria-label="Close"></dads-button>',
    });
    expect(diagnostics).toHaveLength(0);
  });
});

describe('resolveComponentClosure and transitive deps', () => {
  let installRegistry;
  beforeAll(async () => {
    installRegistry = await loadBundledJson('install-registry.json');
  });

  it('resolves transitive deps for component with direct deps', () => {
    // combobox depends on avatar, chip-tag, icon
    const closure = resolveComponentClosure({ installRegistry }, ['combobox']);
    expect(closure).toContain('combobox');
    expect(closure).toContain('avatar');
    expect(closure).toContain('chip-tag');
    expect(closure).toContain('icon');
  });

  it('returns only the component itself when no deps', () => {
    const closure = resolveComponentClosure({ installRegistry }, ['button']);
    expect(closure).toEqual(['button']);
  });

  it('deduplicates shared transitive deps', () => {
    const closure = resolveComponentClosure({ installRegistry }, ['combobox', 'avatar']);
    // avatar should appear only once despite being both a root and a dep of combobox
    const avatarCount = closure.filter((id) => id === 'avatar').length;
    expect(avatarCount).toBe(1);
  });

  it('get_install_recipe returns transitiveDeps field via MCP', async () => {
    const { server } = await createMcpServer(
      loadBundledJson,
      async () => import('./validator.mjs'),
      { loadTextData: loadBundledText },
    );
    const client = new Client(
      { name: 'wcf-mcp-test-client', version: '0.0.0' },
      { capabilities: {} },
    );
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
    try {
      const result = await client.callTool({ name: 'get_install_recipe', arguments: { component: 'dads-combobox' } });
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(payload.deps).toBeDefined();
      expect(payload.transitiveDeps).toBeDefined();
      expect(Array.isArray(payload.transitiveDeps)).toBe(true);
      // combobox has deps: avatar, chip-tag, icon — all are leaf so transitiveDeps = same as deps
      expect(payload.transitiveDeps).toContain('avatar');
      expect(payload.transitiveDeps).toContain('chip-tag');
      expect(payload.transitiveDeps).toContain('icon');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('get_install_recipe returns vendorHint and usageContext fields', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_install_recipe', arguments: { component: 'dads-button' } });
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      // usageContext
      expect(payload.usageContext).toBe('body-only');
      // vendorHint
      expect(payload.vendorHint).toBeDefined();
      expect(typeof payload.vendorHint.install).toBe('string');
      expect(payload.vendorHint.install).toContain('wcf add');
      expect(typeof payload.vendorHint.importMap).toBe('string');
      expect(payload.vendorHint.importMap).toContain('imports');
      // importmap (deprecated) is kept as alias for backward compat
      expect(payload.vendorHint.importmap).toBe(payload.vendorHint.importMap);
      expect(typeof payload.vendorHint.boot).toBe('string');
      expect(payload.vendorHint.boot).toContain('boot.js');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('get_install_recipe returns empty transitiveDeps for leaf component', async () => {
    const { server } = await createMcpServer(
      loadBundledJson,
      async () => import('./validator.mjs'),
      { loadTextData: loadBundledText },
    );
    const client = new Client(
      { name: 'wcf-mcp-test-client', version: '0.0.0' },
      { capabilities: {} },
    );
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
    try {
      const result = await client.callTool({ name: 'get_install_recipe', arguments: { component: 'dads-button' } });
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(payload.transitiveDeps).toEqual([]);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

// ---------------------------------------------------------------------------
// Shared helper — creates an MCP client/server pair for tool-level tests
// ---------------------------------------------------------------------------
async function createTestPair() {
  const { server } = await createMcpServer(
    loadBundledJson,
    async () => import('./validator.mjs'),
    { loadTextData: loadBundledText },
  );
  const client = new Client(
    { name: 'wcf-mcp-test-client', version: '0.0.0' },
    { capabilities: {} },
  );
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);
  return { client, server };
}

// ---------------------------------------------------------------------------
// get_pattern_recipe contract and new fields
// ---------------------------------------------------------------------------
describe('get_pattern_recipe contract', () => {
  it('returns all base contract fields for a valid pattern', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'search-form' } });
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(payload.pattern).toBeDefined();
      expect(payload.pattern.id).toBe('search-form');
      expect(typeof payload.pattern.title).toBe('string');
      expect(payload.prefix).toBeDefined();
      expect(Array.isArray(payload.requires)).toBe(true);
      expect(Array.isArray(payload.components)).toBe(true);
      expect(payload.install).toBeDefined();
      expect(typeof payload.html).toBe('string');
      expect(payload.installHint).toBeDefined();
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('applies prefix to tag names when prefix is specified', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'search-form', prefix: 'myui' } });
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(payload.prefix).toBe('myui');
      expect(payload.html).toContain('myui-');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('returns isError for invalid pattern ID', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'nonexistent-pattern-xyz' } });
      expect(result.isError).toBe(true);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('returns entryHints array containing "boot"', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'search-form' } });
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(Array.isArray(payload.entryHints)).toBe(true);
      expect(payload.entryHints).toContain('boot');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('returns scaffoldHint with all 5 keys', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'search-form' } });
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(payload.scaffoldHint).toBeDefined();
      expect(payload.scaffoldHint.doctype).toBe('<!DOCTYPE html>');
      expect(payload.scaffoldHint.importMap).toContain('importmap');
      // importMap paths must use prefix-stripped suffix (e.g. button.js, not dads-button.js)
      expect(payload.scaffoldHint.importMap).toContain('/button.js');
      expect(payload.scaffoldHint.importMap).not.toMatch(/\/dads-button\.js/);
      expect(payload.scaffoldHint.bootScript).toContain('boot.js');
      expect(payload.scaffoldHint.noscript).toContain('noscript');
      expect(payload.scaffoldHint.serveOverHttp).toContain('HTTP');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  // P-07: behavior field
  it('returns behavior field as non-empty string for search-form', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'search-form' } });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');
      expect(typeof payload.behavior).toBe('string');
      expect(payload.behavior.length).toBeGreaterThan(0);
      expect(payload.behavior).toContain('submit');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('returns behavior field for mockup patterns (visual-only note)', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'mockup-website' } });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');
      expect(typeof payload.behavior).toBe('string');
      expect(payload.behavior).toContain('visual-only');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('returns no fullPageHtml when include is not specified (backward compat)', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'search-form' } });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');
      expect(payload.fullPageHtml).toBeUndefined();
      expect(payload.vendorSetup).toBeUndefined();
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('returns fullPageHtml with valid HTML5 structure when include: ["fullPage"]', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_pattern_recipe',
        arguments: { patternId: 'search-form', include: ['fullPage'] },
      });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');

      expect(payload.fullPageHtml).toBeDefined();
      expect(typeof payload.fullPageHtml).toBe('string');
      expect(payload.fullPageHtml).toContain('<!DOCTYPE html>');
      expect(payload.fullPageHtml).toContain('<html lang="ja">');
      expect(payload.fullPageHtml).toContain('<meta charset="UTF-8">');
      expect(payload.fullPageHtml).toContain('<script type="importmap">');
      expect(payload.fullPageHtml).toContain('boot.js');
      expect(payload.fullPageHtml).toContain('<body>');
      expect(payload.fullPageHtml).toContain('</html>');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('fullPageHtml import map entries match pattern dependencies (no placeholders)', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_pattern_recipe',
        arguments: { patternId: 'search-form', include: ['fullPage'] },
      });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');

      // No placeholder <dir> in fullPageHtml
      expect(payload.fullPageHtml).not.toContain('./<dir>/');
      expect(payload.fullPageHtml).not.toContain('<dir>');

      // Import map uses vendor-runtime directory
      expect(payload.fullPageHtml).toContain('./vendor-runtime/');
      expect(payload.fullPageHtml).toContain('./vendor-runtime/boot.js');

      // The import map should contain entries for pattern components
      // Parse the import map from the fullPageHtml
      const importMapMatch = payload.fullPageHtml.match(/<script type="importmap">\s*([\s\S]*?)\s*<\/script>/);
      expect(importMapMatch).toBeTruthy();
      const importMap = JSON.parse(importMapMatch[1]);
      expect(Object.keys(importMap.imports).length).toBeGreaterThan(0);
      // All import map paths should use vendor-runtime directory
      for (const importPath of Object.values(importMap.imports)) {
        expect(importPath).toContain('./vendor-runtime/');
      }
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('fullPageHtml includes distribution info (self-contained)', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_pattern_recipe',
        arguments: { patternId: 'search-form', include: ['fullPage'] },
      });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');

      expect(payload.fullPageHtml).toContain('selfHosted');
      expect(payload.fullPageHtml).toContain('vendor-importmap');
      expect(payload.fullPageHtml).toContain('Do NOT replace these local paths with CDN URLs');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('fullPageHtml includes vendorSetup command', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_pattern_recipe',
        arguments: { patternId: 'search-form', include: ['fullPage'] },
      });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');

      expect(payload.vendorSetup).toBeDefined();
      expect(payload.vendorSetup.command).toContain('web-components-factory');
      expect(payload.vendorSetup.command).toContain('init');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('fullPageHtml response size is under 100KB for all patterns', async () => {
    const { client, server } = await createTestPair();
    try {
      // Get all patterns
      const listResult = await client.callTool({ name: 'list_patterns', arguments: {} });
      const listPayload = JSON.parse(listResult.content?.[0]?.text ?? '[]');
      const patternIds = listPayload.map((item) => item.id);

      expect(patternIds.length).toBeGreaterThan(0);

      for (const pid of patternIds) {
        const result = await client.callTool({
          name: 'get_pattern_recipe',
          arguments: { patternId: pid, include: ['fullPage'] },
        });
        const text = result.content?.[0]?.text ?? '';
        expect(text.length).toBeLessThan(MAX_TOOL_RESULT_BYTES);
      }
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

// ---------------------------------------------------------------------------
// P-04: pattern-registry.json self-consistency (DD-10)
// ---------------------------------------------------------------------------
describe('pattern-registry self-consistency', () => {
  it('every pattern HTML passes validate_markup with 0 errors', async () => {
    const patternRegistry = await loadBundledJson('pattern-registry.json');
    const patterns = patternRegistry.patterns;
    expect(Object.keys(patterns).length).toBeGreaterThanOrEqual(10);

    const { client, server } = await createTestPair();
    try {
      for (const [id, pattern] of Object.entries(patterns)) {
        const result = await client.callTool({
          name: 'validate_markup',
          arguments: { html: pattern.html },
        });
        const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
        const errors = (payload.diagnostics ?? []).filter((d) => d.severity === 'error');
        expect(errors, `Pattern "${id}" has ${errors.length} error(s): ${JSON.stringify(errors)}`).toHaveLength(0);
      }
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

// ---------------------------------------------------------------------------
// P-07: Backward compatibility integration tests
// ---------------------------------------------------------------------------
describe('v0.5.0 backward compatibility', () => {
  it('get_pattern_recipe without include returns no fullPageHtml (old-call compat)', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_pattern_recipe', arguments: { patternId: 'search-form' } });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');
      expect(payload.fullPageHtml).toBeUndefined();
      expect(payload.html).toBeDefined();
      expect(payload.install).toBeDefined();
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('get_component_api returns stable base fields without new optional fields for non-form/non-layout', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_component_api', arguments: { component: 'button' } });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');
      // Base fields present
      expect(payload.tagName).toBeDefined();
      expect(payload.className).toBeDefined();
      expect(Array.isArray(payload.attributes)).toBe(true);
      // New optional fields absent for non-form/non-layout
      expect(payload.interactionExamples).toBeUndefined();
      expect(payload.layoutBehavior).toBeUndefined();
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('get_design_system_overview returns distribution alongside existing setupInfo', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({ name: 'get_design_system_overview', arguments: {} });
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');
      // Existing fields
      expect(payload.setupInfo).toBeDefined();
      expect(Array.isArray(payload.ideSetupTemplates)).toBe(true);
      // New field
      expect(payload.setupInfo.distribution).toBeDefined();
      expect(payload.setupInfo.distribution.selfHosted).toBe(true);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('validate_markup old-style call (snippet without DOCTYPE) works unchanged', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'validate_markup',
        arguments: { html: '<dads-button>Click</dads-button>' },
      });
      expect(result.isError).toBeFalsy();
      const payload = JSON.parse(result.content?.[0]?.text ?? '{}');
      expect(Array.isArray(payload.diagnostics)).toBe(true);
      // Snippet without DOCTYPE should NOT trigger missingImportmap/missingBootScript
      const codes = payload.diagnostics.map((d) => d.code);
      expect(codes).not.toContain('missingImportmap');
      expect(codes).not.toContain('missingBootScript');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

// ---------------------------------------------------------------------------
// P-01: canonical lowercase attribute detection (unit tests)
// ---------------------------------------------------------------------------
describe('canonical lowercase attribute detection', () => {
  let cemIndex;

  beforeAll(async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    cemIndex = collectCemCustomElements(manifest);
  });

  it('flags non-lowercase known CEM attribute', () => {
    const diagnostics = detectNonLowercaseAttributes({
      text: '<dads-button Variant="solid">Click</dads-button>',
      cem: cemIndex,
    });
    expect(diagnostics.length).toBeGreaterThanOrEqual(1);
    const d = diagnostics.find((d) => d.code === 'canonicalLowercaseRecommendation');
    expect(d).toBeDefined();
    expect(d.severity).toBe('warning');
    expect(d.attrName).toBe('Variant');
  });

  it('flags fully uppercase known CEM attribute', () => {
    const diagnostics = detectNonLowercaseAttributes({
      text: '<dads-input-text LABEL="Name"></dads-input-text>',
      cem: cemIndex,
    });
    expect(diagnostics.length).toBeGreaterThanOrEqual(1);
    const d = diagnostics.find((d) => d.code === 'canonicalLowercaseRecommendation');
    expect(d).toBeDefined();
    expect(d.attrName).toBe('LABEL');
  });

  it('does not flag already-lowercase attribute', () => {
    const diagnostics = detectNonLowercaseAttributes({
      text: '<dads-button variant="solid">Click</dads-button>',
      cem: cemIndex,
    });
    const lowercaseDiags = diagnostics.filter((d) => d.code === 'canonicalLowercaseRecommendation');
    expect(lowercaseDiags).toHaveLength(0);
  });

  it('does not flag global/unknown attributes', () => {
    const diagnostics = detectNonLowercaseAttributes({
      text: '<dads-button Class="foo" UnknownAttr="x">Click</dads-button>',
      cem: cemIndex,
    });
    const lowercaseDiags = diagnostics.filter((d) => d.code === 'canonicalLowercaseRecommendation');
    expect(lowercaseDiags).toHaveLength(0);
  });

  it('does not flag attributes on non-CEM elements', () => {
    const diagnostics = detectNonLowercaseAttributes({
      text: '<some-unknown-element Foo="bar"></some-unknown-element>',
      cem: cemIndex,
    });
    const lowercaseDiags = diagnostics.filter((d) => d.code === 'canonicalLowercaseRecommendation');
    expect(lowercaseDiags).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// P-02: prefix-aware unknown element suggestion (unit tests)
// ---------------------------------------------------------------------------
describe('prefix-aware unknown element suggestion', () => {
  let cemIndex;

  beforeAll(async () => {
    const manifest = await loadBundledJson('custom-elements.json');
    const decls = findCustomElementDeclarations(manifest);
    cemIndex = new Map(decls.map((decl) => [decl.tagName.toLowerCase(), { attributes: new Set() }]));
  });

  it('suggests prefixed tag when unprefixed form exists in CEM', () => {
    const suggestion = suggestUnknownElementTagName('input-text', cemIndex, 'dads');
    expect(suggestion).toBe('dads-input-text');
  });

  it('returns undefined for single-segment tag without hyphen', () => {
    const suggestion = suggestUnknownElementTagName('button', cemIndex, 'dads');
    expect(suggestion).toBeUndefined();
  });

  it('still suggests via Levenshtein for typos (existing behavior)', () => {
    const suggestion = suggestUnknownElementTagName('dads-buton', cemIndex);
    expect(suggestion).toBe('dads-button');
  });

  it('buildDiagnosticSuggestion passes prefix to get prefixed suggestion', () => {
    const suggestion = buildDiagnosticSuggestion({
      diagnostic: { code: 'unknownElement', tagName: 'input-text' },
      cemIndex,
      prefix: 'dads',
    });
    expect(suggestion).toContain('dads-input-text');
  });
});

// ---------------------------------------------------------------------------
// P-13: get_component_selector_guide
// ---------------------------------------------------------------------------
describe('get_component_selector_guide', () => {
  it('returns all categories when no filter', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_component_selector_guide',
        arguments: {},
      });
      expect(result.isError).toBeFalsy();
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.totalCategories).toBeGreaterThanOrEqual(5);
      expect(payload.categories.some((c) => c.key === 'Form')).toBe(true);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('filters by category key', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_component_selector_guide',
        arguments: { category: 'Form' },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.totalCategories).toBe(1);
      expect(payload.categories[0].key).toBe('Form');
      expect(payload.categories[0].components.length).toBeGreaterThan(0);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('filters by useCase keyword', async () => {
    const { client, server } = await createTestPair();
    try {
      const result = await client.callTool({
        name: 'get_component_selector_guide',
        arguments: { useCase: 'date' },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.totalCategories).toBeGreaterThanOrEqual(1);
      const allComponents = payload.categories.flatMap((c) => c.components);
      expect(allComponents.some((comp) => comp.id.includes('date') || comp.useCase.toLowerCase().includes('date'))).toBe(true);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

// ---------------------------------------------------------------------------
// Design System Skills plugin tests
// ---------------------------------------------------------------------------

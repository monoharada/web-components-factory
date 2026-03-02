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
  buildDesignTokenDetailPayload,
  buildDesignTokensPayload,
  buildDiagnosticSuggestion,
  buildIndexes,
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
  WCF_RESOURCE_URIS,
} from './core.mjs';
import { buildEnumAttributeMap, buildSlotNameMap, detectAccessibilityMisuseInMarkup, detectEmptyInteractiveElement, detectEnumValueMisuse, detectInvalidSlotName, detectMissingRequiredAttributes, detectOrphanedChildComponents, detectTokenMisuseInInlineStyles } from './validator.mjs';
import { loadWcfMcpRuntimeConfig } from './server.mjs';

// ---------------------------------------------------------------------------
// Load data the same way the server does
// ---------------------------------------------------------------------------

const REPO_FILE_MAP = {
  'custom-elements.json': 'custom-elements.json',
  'install-registry.json': 'registry/install-registry.json',
  'pattern-registry.json': 'registry/pattern-registry.json',
  'design-tokens.json': 'design-tokens.json',
  'guidelines-index.json': 'guidelines-index.json',
  'llms-full.txt': 'llms-full.txt',
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

async function loadBundledJsonOrNull(fileName) {
  try {
    return await loadBundledJson(fileName);
  } catch {
    return null;
  }
}

async function loadBundledText(fileName) {
  const bundled = path.join(__dirname, 'data', fileName);
  const repoRoot = path.resolve(__dirname, '../..');
  const repoRelative = REPO_FILE_MAP[fileName];
  const repo = repoRelative ? path.join(repoRoot, repoRelative) : undefined;

  for (const p of [bundled, repo]) {
    if (!p) continue;
    try {
      return await fs.readFile(p, 'utf8');
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

  it('includes all expected tool names (14 tools)', () => {
    const expectedTools = [
      'get_design_system_overview',
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

    expect(expectedTools).toHaveLength(14);
    expect(new Set(expectedTools).size).toBe(14);
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
    // Tool descriptions now live in core.mjs
    const coreSrc = await fs.readFile(path.join(__dirname, 'core.mjs'), 'utf8');
    expect(coreSrc).toContain('MUST be called first');
  });

  it('all tools have When/Returns/After guidance in descriptions', async () => {
    const coreSrc = await fs.readFile(path.join(__dirname, 'core.mjs'), 'utf8');

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

    expect(Array.isArray(payload.ideSetupTemplates)).toBe(true);
    expect(payload.ideSetupTemplates.length).toBeGreaterThanOrEqual(5);
    expect(payload.ideSetupTemplates.some((item) => item.ide === 'VS Code (GitHub Copilot)')).toBe(true);
    expect(payload.ideSetupTemplates.some((item) => item.ide === 'Windsurf')).toBe(true);

    expect(payload.setupInfo).toBeDefined();
    expect(payload.setupInfo.npmPackage).toBe('web-components-factory');
    expect(typeof payload.setupInfo.installCommand).toBe('string');
    expect(typeof payload.setupInfo.vendorRuntimePath).toBe('string');
    expect(typeof payload.setupInfo.htmlBoilerplate).toBe('string');
    expect(payload.setupInfo.htmlBoilerplate).toContain('<script');
    expect(typeof payload.setupInfo.noscriptGuidance).toBe('string');
    expect(payload.setupInfo.noscriptGuidance).toContain('noscript');

    // Tier 1: runtime setup info fields (v0.3.0)
    expect(payload.setupInfo.noCDN).toBe(true);
    expect(payload.setupInfo.deliveryModel).toBe('vendor-local');
    expect(typeof payload.setupInfo.importMapHint).toBe('string');
    expect(payload.setupInfo.importMapHint).toContain('importmap');
    expect(typeof payload.setupInfo.bootScript).toBe('string');
    expect(payload.setupInfo.bootScript).toContain('boot.js');
    expect(payload.setupInfo.vendorSetup).toBeDefined();
    expect(payload.setupInfo.vendorSetup.init).toContain('wcf init');
    expect(payload.setupInfo.vendorSetup.add).toContain('wcf add');
    expect(typeof payload.setupInfo.vendorSetup.workflow).toBe('string');
    expect(payload.setupInfo.htmlSetup).toContain('importmap');
    expect(payload.setupInfo.htmlSetup).toContain('boot.js');
    // Backward compatibility: htmlBoilerplate must remain unchanged
    expect(payload.setupInfo.htmlBoilerplate).toContain('vendor-runtime/src/autoload.js');

    expect(Array.isArray(payload.availablePrompts)).toBe(true);
    expect(payload.availablePrompts.some((item) => item.name === FIGMA_TO_WCF_PROMPT)).toBe(true);

    expect(Array.isArray(payload.availableResources)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.components)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.tokens)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.guidelinesTemplate)).toBe(true);
    expect(payload.availableResources.some((item) => item.uri === WCF_RESOURCE_URIS.llmsFull)).toBe(true);
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

  it('generate_usage_snippet resolves by bare name via auto-prefix', async () => {
    const result = await client.callTool({
      name: 'generate_usage_snippet',
      arguments: { component: 'button' },
    });
    expect(result.isError).toBeFalsy();
    expect(String(result.content?.[0]?.text)).toContain('dads-button');
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

  it('validate_markup passes when label is present on form input', async () => {
    const result = await client.callTool({
      name: 'validate_markup',
      arguments: { html: '<dads-input-text label="Name"></dads-input-text>' },
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
    expect(result.structuredContent).toEqual({
      type: 'application/json',
      data: payload,
    });
    expect(JSON.parse(result.content[0].text)).toEqual(payload);
  });

  it('disables structuredContent when rollback flag is enabled', () => {
    const payload = { total: 1, tokens: [], summary: {} };
    const result = buildJsonToolResponse(payload, { env: { [STRUCTURED_CONTENT_DISABLE_FLAG]: '1' } });

    expect(isStructuredContentDisabled({ [STRUCTURED_CONTENT_DISABLE_FLAG]: '1' })).toBe(true);
    expect(result.structuredContent).toBeUndefined();
    expect(JSON.parse(result.content[0].text)).toEqual(payload);
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
      structuredContent: {
        type: 'application/json',
        data: payload,
      },
    };

    expect(measureToolResultBytes(structuredCandidate)).toBeGreaterThan(MAX_TOOL_RESULT_BYTES);

    const result = buildJsonToolResponse(payload, { env: {} });
    expect(result.structuredContent).toBeUndefined();
    expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
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
  it('loadValidator from design-system-mcp provides token misuse detector', async () => {
    const { loadValidator } = await import('../../scripts/mcp/design-system-mcp.mjs');
    const validator = await loadValidator();

    expect(typeof validator.collectCemCustomElements).toBe('function');
    expect(typeof validator.validateTextAgainstCem).toBe('function');
    expect(typeof validator.detectTokenMisuseInInlineStyles).toBe('function');
    expect(typeof validator.detectAccessibilityMisuseInMarkup).toBe('function');
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

  it('detectMissingRequiredAttributes flags missing label on form input', () => {
    const diagnostics = detectMissingRequiredAttributes({
      text: '<dads-input-text></dads-input-text>',
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('missingRequiredAttribute');
    expect(diagnostics[0].attrName).toBe('label');
    expect(diagnostics[0].tagName).toBe('dads-input-text');
  });

  it('detectMissingRequiredAttributes passes when label is present', () => {
    const diagnostics = detectMissingRequiredAttributes({
      text: '<dads-input-text label="Name"></dads-input-text>',
    });
    expect(diagnostics).toHaveLength(0);
  });

  it('detectMissingRequiredAttributes respects custom prefix', () => {
    const diagnostics = detectMissingRequiredAttributes({
      text: '<myui-input-text></myui-input-text>',
      prefix: 'myui',
    });
    expect(diagnostics).toHaveLength(1);
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

describe('plugin extensibility', () => {
  it('exports PLUGIN_CONTRACT_VERSION as semver string', () => {
    expect(PLUGIN_CONTRACT_VERSION).toBe('1.0.0');
    expect(typeof PLUGIN_CONTRACT_VERSION).toBe('string');
  });

  it('normalizes plugin tools and blocks builtin tool name collisions', () => {
    const normalized = normalizePlugins([
      {
        name: 'sample-plugin',
        version: '0.1.0',
        tools: [
          {
            name: 'sample_tool',
            staticPayload: { ok: true },
          },
        ],
      },
    ]);
    expect(normalized).toHaveLength(1);
    expect(normalized[0].tools[0].name).toBe('sample_tool');
    expect(normalized[0].tools[0].description).toContain('contract v1');

    expect(() => normalizePlugins([
      {
        name: 'bad-plugin',
        version: '0.1.0',
        tools: [{ name: 'list_components', staticPayload: {} }],
      },
    ])).toThrow(/tool name collision/);
  });

  it('handler wins when both handler and staticPayload are specified', () => {
    const normalized = normalizePlugins([
      {
        name: 'both-plugin',
        version: '1.0.0',
        tools: [
          {
            name: 'both_tool',
            handler: () => ({ fromHandler: true }),
            staticPayload: { fromStatic: true },
          },
        ],
      },
    ]);
    expect(normalized).toHaveLength(1);
    const tool = normalized[0].tools[0];
    expect(typeof tool.handler).toBe('function');
    // handler is preserved, staticPayload is still stored but ignored at runtime
    expect(tool.name).toBe('both_tool');
  });

  it('builds plugin data source map and rejects duplicate file overrides', () => {
    const map = buildPluginDataSourceMap([
      {
        name: 'plugin-a',
        dataSources: [{ fileName: 'guidelines-index.json', path: '/tmp/guidelines-a.json' }],
      },
    ]);

    expect(map.get('guidelines-index.json')).toMatchObject({
      path: '/tmp/guidelines-a.json',
      pluginName: 'plugin-a',
    });

    expect(() => buildPluginDataSourceMap([
      {
        name: 'plugin-a',
        dataSources: [{ fileName: 'guidelines-index.json', path: '/tmp/guidelines-a.json' }],
      },
      {
        name: 'plugin-b',
        dataSources: [{ fileName: 'guidelines-index.json', path: '/tmp/guidelines-b.json' }],
      },
    ])).toThrow(/Duplicate data source override/);
  });

  it('uses loadJsonDataFromPath when plugin data source override is configured', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-mcp-plugin-'));
    const customGuidelinesPath = path.join(tmpDir, 'guidelines-index.override.json');
    await fs.writeFile(customGuidelinesPath, JSON.stringify({
      version: 1,
      documents: [],
      topicCounts: {},
    }), 'utf8');

    const fileLoadCalls = [];
    const pathLoadCalls = [];
    const loadJsonData = async (fileName) => {
      fileLoadCalls.push(fileName);
      return loadBundledJson(fileName);
    };
    const loadJsonDataFromPath = async (sourcePath, fileName, pluginName) => {
      pathLoadCalls.push({ sourcePath, fileName, pluginName });
      const text = await fs.readFile(sourcePath, 'utf8');
      return JSON.parse(text);
    };
    const loadValidator = async () => ({
      collectCemCustomElements: () => new Map(),
      validateTextAgainstCem: () => [],
      detectTokenMisuseInInlineStyles: () => [],
      detectAccessibilityMisuseInMarkup: () => [],
    });

    try {
      const result = await createMcpServer(loadJsonData, loadValidator, {
        plugins: [{
          name: 'override-plugin',
          version: '0.1.0',
          dataSources: [{ fileName: 'guidelines-index.json', path: customGuidelinesPath }],
          tools: [],
        }],
        loadJsonDataFromPath,
      });

      expect(result.pluginRuntime).toMatchObject({
        pluginCount: 1,
        pluginToolCount: 0,
      });
      expect(pathLoadCalls.some((call) => (
        call.fileName === 'guidelines-index.json'
        && call.sourcePath === customGuidelinesPath
        && call.pluginName === 'override-plugin'
      ))).toBe(true);
      expect(fileLoadCalls).toContain('custom-elements.json');
      expect(fileLoadCalls).toContain('install-registry.json');
      expect(fileLoadCalls).toContain('pattern-registry.json');
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('rejects plugin without name', () => {
    expect(() => normalizePlugins([{ version: '1.0.0' }])).toThrow();
  });

  it('rejects plugin without version', () => {
    expect(() => normalizePlugins([{ name: 'no-version' }])).toThrow();
  });

  it('rejects duplicate plugin names', () => {
    expect(() => normalizePlugins([
      { name: 'dup', version: '1.0.0' },
      { name: 'dup', version: '2.0.0' },
    ])).toThrow(/duplicate/i);
  });

  it('registers plugin tool with handler via MCP', async () => {
    let handlerCalled = false;
    const { server } = await createMcpServer(
      loadBundledJson,
      async () => import('./validator.mjs'),
      {
        loadTextData: loadBundledText,
        plugins: [{
          name: 'handler-test-plugin',
          version: '1.0.0',
          tools: [{
            name: 'handler_test_tool',
            description: 'Test tool with handler',
            async handler(args, ctx) {
              handlerCalled = true;
              return { received: args, pluginName: ctx.plugin.name };
            },
          }],
        }],
      },
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
      const result = await client.callTool({ name: 'handler_test_tool', arguments: { foo: 'bar' } });
      expect(handlerCalled).toBe(true);
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(payload.pluginName).toBe('handler-test-plugin');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('provides helpers.loadJsonData in handler context (contract v1)', async () => {
    let receivedHelpers = null;
    const { server } = await createMcpServer(
      loadBundledJson,
      async () => import('./validator.mjs'),
      {
        loadTextData: loadBundledText,
        plugins: [{
          name: 'helpers-test-plugin',
          version: '1.0.0',
          tools: [{
            name: 'helpers_context_test',
            description: 'Verify helpers shape',
            async handler(_args, ctx) {
              receivedHelpers = ctx.helpers;
              return { ok: true };
            },
          }],
        }],
      },
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
      await client.callTool({ name: 'helpers_context_test', arguments: {} });
      expect(receivedHelpers).toBeTruthy();
      expect(typeof receivedHelpers.loadJsonData).toBe('function');
      expect(typeof receivedHelpers.buildJsonToolResponse).toBe('function');
      expect(typeof receivedHelpers.normalizePrefix).toBe('function');
      expect(typeof receivedHelpers.withPrefix).toBe('function');
      expect(typeof receivedHelpers.toCanonicalTagName).toBe('function');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

describe('runtime config loader', () => {
  it('returns empty plugins when default config is absent', async () => {
    const tmpDir = await fs.mkdtemp(path.join(__dirname, '.tmp-wcf-mcp-config-'));
    try {
      const result = await loadWcfMcpRuntimeConfig({ cwd: tmpDir });
      expect(Array.isArray(result.plugins)).toBe(true);
      expect(result.plugins).toHaveLength(0);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('throws when explicit config path does not exist', async () => {
    const tmpDir = await fs.mkdtemp(path.join(__dirname, '.tmp-wcf-mcp-config-'));
    try {
      await expect(loadWcfMcpRuntimeConfig({
        cwd: tmpDir,
        configPath: path.join(tmpDir, 'missing-config.json'),
      })).rejects.toThrow(/Config file not found/);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('loads module plugin and static plugin from config file', async () => {
    const tmpDir = await fs.mkdtemp(path.join(__dirname, '.tmp-wcf-mcp-config-'));
    const pluginDir = path.join(tmpDir, 'plugins');
    await fs.mkdir(pluginDir, { recursive: true });
    const pluginFile = path.join(pluginDir, 'module-plugin.mjs');
    const pluginGuidelinesPath = path.join(pluginDir, 'guidelines.plugin.json');
    const configFile = path.join(tmpDir, 'wcf-mcp.config.json');
    const rootDesignTokensPath = path.join(tmpDir, 'design-tokens.local.json');

    await fs.writeFile(pluginGuidelinesPath, JSON.stringify({}), 'utf8');
    await fs.writeFile(rootDesignTokensPath, JSON.stringify({}), 'utf8');

    await fs.writeFile(pluginFile, `
export default {
  name: 'module-plugin',
  version: '0.2.0',
  dataSources: [
    {
      fileName: 'guidelines-index.json',
      path: './guidelines.plugin.json'
    }
  ],
  tools: [
    {
      name: 'module_tool',
      description: 'module plugin tool',
      staticPayload: { ok: true }
    }
  ]
};
`, 'utf8');

    await fs.writeFile(configFile, JSON.stringify({
      dataSources: {
        'design-tokens.json': './design-tokens.local.json',
      },
      plugins: [
        { module: './plugins/module-plugin.mjs' },
        {
          name: 'static-plugin',
          version: '0.3.0',
          staticTools: [{ name: 'static_healthcheck', payload: { ok: true } }],
        },
      ],
    }), 'utf8');

    try {
      const result = await loadWcfMcpRuntimeConfig({
        cwd: tmpDir,
        configPath: configFile,
      });
      expect(result.plugins.length).toBe(3);
      expect(result.plugins.some((plugin) => plugin.name === 'config-data-sources')).toBe(true);
      expect(result.plugins.some((plugin) => plugin.name === 'module-plugin')).toBe(true);
      expect(result.plugins.some((plugin) => plugin.name === 'static-plugin')).toBe(true);

      const rootPlugin = result.plugins.find((plugin) => plugin.name === 'config-data-sources');
      expect(rootPlugin?.dataSources?.[0]).toMatchObject({
        fileName: 'design-tokens.json',
        path: rootDesignTokensPath,
      });

      const modulePlugin = result.plugins.find((plugin) => plugin.name === 'module-plugin');
      expect(modulePlugin?.dataSources?.[0]).toMatchObject({
        fileName: 'guidelines-index.json',
        path: pluginGuidelinesPath,
      });
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
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
      expect(typeof payload.vendorHint.importmap).toBe('string');
      expect(payload.vendorHint.importmap).toContain('imports');
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
      expect(payload.scaffoldHint.bootScript).toContain('boot.js');
      expect(payload.scaffoldHint.noscript).toContain('noscript');
      expect(payload.scaffoldHint.serveOverHttp).toContain('HTTP');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

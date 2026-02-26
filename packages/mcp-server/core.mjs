/**
 * core.mjs — Shared MCP server logic.
 *
 * Both `server.mjs` (standalone / npx) and `scripts/mcp/design-system-mcp.mjs`
 * (repo-local) import `createMcpServer()` from here so that tool definitions
 * and helper functions live in exactly one place.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CANONICAL_PREFIX = 'dads';
export const MAX_PREFIX_LENGTH = 64;
export const STRUCTURED_CONTENT_DISABLE_FLAG = 'WCF_MCP_DISABLE_STRUCTURED_CONTENT';

export const CATEGORY_MAP = {
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
  'dads-tab': 'Navigation',
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

const TOKEN_MISUSE_ALLOWED_TYPES = Object.freeze(new Set(['color', 'spacing']));
const STRUCTURED_CONTENT_DISABLE_TRUE_VALUES = Object.freeze(new Set(['1', 'true', 'yes', 'on']));

export function isStructuredContentDisabled(env = process.env) {
  const raw = String(env?.[STRUCTURED_CONTENT_DISABLE_FLAG] ?? '').trim().toLowerCase();
  return STRUCTURED_CONTENT_DISABLE_TRUE_VALUES.has(raw);
}

export function toStructuredContent(data) {
  return {
    type: 'application/json',
    data,
  };
}

export function buildJsonToolResponse(payload, { env = process.env } = {}) {
  const content = [{
    type: 'text',
    text: JSON.stringify(payload, null, 2),
  }];

  if (isStructuredContentDisabled(env)) {
    return { content };
  }

  return {
    content,
    structuredContent: toStructuredContent(payload),
  };
}

export function normalizeTokenValue(value) {
  if (typeof value === 'string') return value.trim().toLowerCase().replace(/\s+/g, ' ');
  if (typeof value === 'number') return String(value);
  return '';
}

export function buildTokenSuggestionMap(designTokensData) {
  if (!Array.isArray(designTokensData?.tokens)) return new Map();

  const out = new Map();
  for (const token of designTokensData.tokens) {
    const type = String(token?.type ?? '').toLowerCase();
    if (!TOKEN_MISUSE_ALLOWED_TYPES.has(type)) continue;

    const cssVariable = typeof token?.cssVariable === 'string' ? token.cssVariable.trim() : '';
    if (!cssVariable.startsWith('--')) continue;

    const normalized = normalizeTokenValue(token?.value);
    if (normalized && !out.has(normalized)) out.set(normalized, cssVariable);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Helpers (exported for testing)
// ---------------------------------------------------------------------------

export function getCategory(tagName) {
  return CATEGORY_MAP[tagName] ?? 'Other';
}

function normalizePrefixRaw(prefix) {
  if (typeof prefix !== 'string' || prefix.trim() === '') return CANONICAL_PREFIX;
  return prefix.trim().toLowerCase();
}

export function normalizePrefix(prefix) {
  return normalizePrefixRaw(prefix).slice(0, MAX_PREFIX_LENGTH);
}

export function withPrefix(tagName, prefix) {
  if (typeof tagName !== 'string') return tagName;
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return tagName;
  const from = `${CANONICAL_PREFIX}-`;
  if (!tagName.startsWith(from)) return tagName;
  return `${p}-${tagName.slice(from.length)}`;
}

export function toCanonicalTagName(tagName, prefix) {
  if (typeof tagName !== 'string') return undefined;
  const raw = tagName.trim().toLowerCase();
  if (!raw) return undefined;
  if (raw.startsWith(`${CANONICAL_PREFIX}-`)) return raw;

  const candidates = [...new Set([normalizePrefix(prefix), normalizePrefixRaw(prefix)])];
  for (const p of candidates) {
    if (p !== CANONICAL_PREFIX && raw.startsWith(`${p}-`)) {
      return `${CANONICAL_PREFIX}-${raw.slice(p.length + 1)}`;
    }
  }

  return raw;
}

export function findCustomElementDeclarations(manifest) {
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

export function buildIndexes(manifest) {
  const decls = findCustomElementDeclarations(manifest);

  const byTag = new Map();
  const byClass = new Map();
  const modulePathByTag = new Map();

  for (const { decl, tagName, modulePath } of decls) {
    if (!byTag.has(tagName)) byTag.set(tagName, decl);
    if (typeof decl?.name === 'string' && !byClass.has(decl.name)) byClass.set(decl.name, decl);
    if (!modulePathByTag.has(tagName)) modulePathByTag.set(tagName, modulePath);
  }

  return { byTag, byClass, modulePathByTag, decls };
}

export function pickDecl({ byTag, byClass }, { tagName, className, prefix }) {
  if (typeof tagName === 'string' && tagName.trim() !== '') {
    const canonical = toCanonicalTagName(tagName, prefix);
    if (canonical && byTag.has(canonical)) return byTag.get(canonical);
  }

  if (typeof className === 'string' && className.trim() !== '' && byClass.has(className.trim())) {
    return byClass.get(className.trim());
  }

  return undefined;
}

export function serializeApi(decl, modulePath, prefix) {
  const tagName = typeof decl?.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
  const outTag = tagName ? withPrefix(tagName, prefix) : undefined;

  const attributes = Array.isArray(decl?.attributes) ? decl.attributes : [];
  const slots = Array.isArray(decl?.slots) ? decl.slots : [];
  const events = Array.isArray(decl?.events) ? decl.events : [];
  const cssParts = Array.isArray(decl?.cssParts) ? decl.cssParts : [];
  const cssProperties = Array.isArray(decl?.cssProperties) ? decl.cssProperties : [];

  return {
    tagName: outTag,
    className: typeof decl?.name === 'string' ? decl.name : undefined,
    description: typeof decl?.description === 'string' ? decl.description : undefined,
    modulePath,
    custom: decl?.custom,
    attributes: attributes.map((a) => ({
      name: a?.name,
      type: a?.type?.text,
      description: a?.description,
      inheritedFrom: a?.inheritedFrom,
      deprecated: a?.deprecated,
    })),
    slots: slots.map((s) => ({
      name: s?.name,
      description: s?.description,
    })),
    events: events.map((e) => ({
      name: e?.name,
      type: e?.type?.text,
      description: e?.description,
      inheritedFrom: e?.inheritedFrom,
      deprecated: e?.deprecated,
    })),
    cssParts: cssParts.map((p) => ({
      name: p?.name,
      description: p?.description,
    })),
    cssProperties: cssProperties.map((p) => ({
      name: p?.name,
      default: p?.default,
      description: p?.description,
    })),
  };
}

export function generateSnippet(api, prefix) {
  // Use custom snippet if injected by CEM plugin (e.g. data-* driven components)
  const customSnippet = api.custom?.usageSnippet;
  if (typeof customSnippet === 'string' && customSnippet.trim()) {
    const p = normalizePrefix(prefix);
    if (p !== CANONICAL_PREFIX) {
      return customSnippet.replace(
        new RegExp(`<\\s*(\\/?)\\s*${CANONICAL_PREFIX}-([a-z0-9-]+)(?=[\\s/>])`, 'gi'),
        (_m, slash, rest) => `<${slash ?? ''}${p}-${String(rest).toLowerCase()}`,
      );
    }
    return customSnippet;
  }

  const tag = api.tagName ?? withPrefix(String(api.className ?? 'dads-component'), prefix);
  const attrs = Array.isArray(api.attributes) ? api.attributes : [];
  const slots = Array.isArray(api.slots) ? api.slots : [];

  const attrPriority = [
    'label',
    'support-text',
    'value',
    'name',
    'type',
    'variant',
    'size',
    'required',
    'disabled',
    'readonly',
  ];

  const attrByName = new Map(attrs.map((a) => [String(a?.name ?? ''), a]));
  const lines = [];

  for (const name of attrPriority) {
    const a = attrByName.get(name);
    if (!a) continue;
    const t = String(a.type ?? '').toLowerCase();
    const isBoolean = t.includes('boolean');
    if (isBoolean) lines.push(`  ${name}`);
    else lines.push(`  ${name}=""`);
    if (lines.length >= 4) break;
  }

  const open = lines.length > 0 ? `<${tag}\n${lines.join('\n')}\n>` : `<${tag}>`;
  const slotNames = slots
    .map((s) => String(s?.name ?? '').trim())
    .filter((s) => s !== '');
  const slotComment =
    slotNames.length > 0 ? `\n  <!-- slots: ${slotNames.join(', ')} -->\n` : '\n';

  return `${open}${slotComment}</${tag}>`;
}

export function findDeclByComponentId(indexes, componentIdRaw) {
  const componentId = typeof componentIdRaw === 'string' ? componentIdRaw.trim() : '';
  if (!componentId) return undefined;
  for (const { decl, modulePath } of indexes.decls) {
    const installId = decl?.custom?.install?.id;
    const inferredId = decl?.custom?.componentId;
    const id = typeof installId === 'string' ? installId : typeof inferredId === 'string' ? inferredId : undefined;
    if (id === componentId) return { decl, modulePath };
  }
  return undefined;
}

export function applyPrefixToCemIndex(cemIndex, prefix) {
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return cemIndex;

  const out = new Map();
  for (const [tag, meta] of cemIndex.entries()) {
    const nextTag = withPrefix(tag, p);
    out.set(nextTag, meta);
  }
  return out;
}

export function applyPrefixToHtml(html, prefix) {
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return String(html ?? '');
  const from = `${CANONICAL_PREFIX}-`;
  const to = `${p}-`;

  return String(html ?? '').replace(
    new RegExp(`<\\s*(\\/?)\\s*${from}([a-z0-9-]+)(?=[\\s/>])`, 'gi'),
    (_m, slash, rest) => `<${slash ?? ''}${to}${String(rest).toLowerCase()}`,
  );
}

export function loadPatternRegistryShape(raw) {
  if (!raw || typeof raw !== 'object') return { patterns: {} };
  const patterns = raw.patterns && typeof raw.patterns === 'object' ? raw.patterns : {};
  return { patterns };
}

export function resolveComponentClosure({ installRegistry }, componentIds) {
  const components = installRegistry?.components && typeof installRegistry.components === 'object' ? installRegistry.components : {};
  const queue = [...new Set(componentIds.map((c) => String(c ?? '').trim()).filter(Boolean))];
  const out = new Set();

  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || out.has(id)) continue;
    out.add(id);

    const meta = components[id];
    const deps = Array.isArray(meta?.deps) ? meta.deps : [];
    for (const d of deps) {
      const dep = String(d ?? '').trim();
      if (dep && !out.has(dep)) queue.push(dep);
    }
  }

  return [...out];
}

export function buildComponentSummaries(indexes, { category, query, limit, offset, prefix } = {}) {
  const p = normalizePrefix(prefix);
  const q = typeof query === 'string' ? query.trim().toLowerCase() : '';
  const pageSize = Number.isInteger(limit) ? Math.max(1, Math.min(limit, 200)) : Number.MAX_SAFE_INTEGER;
  const pageOffset = Number.isInteger(offset) ? Math.max(0, offset) : 0;

  let items = indexes.decls.map(({ decl, tagName, modulePath }) => ({
    tagName: withPrefix(tagName, p),
    className: typeof decl?.name === 'string' ? decl.name : undefined,
    description: typeof decl?.description === 'string' ? decl.description : undefined,
    category: getCategory(tagName),
    modulePath,
  }));

  if (category) {
    items = items.filter((item) => item.category === category);
  }

  if (q) {
    items = items.filter((item) => {
      const haystacks = [
        item.tagName,
        item.className,
        item.description,
        item.category,
        item.modulePath,
      ];
      return haystacks.some((value) => String(value ?? '').toLowerCase().includes(q));
    });
  }

  const total = items.length;
  const paged = items.slice(pageOffset, pageOffset + pageSize);

  return {
    total,
    limit: pageSize,
    offset: pageOffset,
    hasMore: pageOffset + paged.length < total,
    items: paged,
  };
}

export function parseIconNamesFromDescription(description) {
  if (typeof description !== 'string' || description.trim() === '') return [];

  const markerMatch = description.match(/iconPathsのキー[:：]\s*([^)）\n]+)/u);
  if (!markerMatch) return [];

  return [...new Set(
    markerMatch[1]
      .split(/[,、]/)
      .map((name) => name.trim())
      .map((name) => name.replace(/[`'"]/g, ''))
      .filter(Boolean),
  )];
}

export function parseIconNamesFromType(typeText) {
  if (typeof typeText !== 'string' || typeText.trim() === '') return [];
  const out = [];
  const regex = /'([^']+)'|"([^"]+)"|`([^`]+)`/g;
  let match;
  while ((match = regex.exec(typeText)) !== null) {
    const value = match[1] ?? match[2] ?? match[3];
    if (typeof value === 'string' && value.trim() !== '') out.push(value.trim());
  }
  return [...new Set(out)];
}

export function extractIconNames(indexes) {
  const decl = indexes.byTag.get('dads-icon');
  if (!decl) return [];

  const attributes = Array.isArray(decl?.attributes) ? decl.attributes : [];
  const nameAttr = attributes.find((attr) => String(attr?.name ?? '') === 'name');
  if (!nameAttr) return [];

  const fromDescription = parseIconNamesFromDescription(nameAttr?.description);
  const fromType = parseIconNamesFromType(nameAttr?.type?.text);

  return [...new Set([...fromDescription, ...fromType])];
}

export function buildIconCatalog(indexes, prefix) {
  const p = normalizePrefix(prefix);
  const tag = withPrefix('dads-icon', p);
  const names = extractIconNames(indexes).sort((left, right) => left.localeCompare(right));

  return names.map((name) => ({
    name,
    variants: ['default'],
    usageExample: `<${tag} name="${name}" size="20"></${tag}>`,
  }));
}

export function searchIconCatalog(indexes, { query, limit, offset, prefix } = {}) {
  const q = typeof query === 'string' ? query.trim().toLowerCase() : '';
  const pageSize = Number.isInteger(limit) ? Math.max(1, Math.min(limit, 100)) : 20;
  const pageOffset = Number.isInteger(offset) ? Math.max(0, offset) : 0;

  let icons = buildIconCatalog(indexes, prefix);
  if (q) {
    icons = icons.filter((icon) => icon.name.toLowerCase().includes(q));
  }

  const total = icons.length;
  const paged = icons.slice(pageOffset, pageOffset + pageSize);

  return {
    total,
    limit: pageSize,
    offset: pageOffset,
    hasMore: pageOffset + paged.length < total,
    icons: paged,
  };
}

export function buildRelatedComponentMap(installRegistry, patterns) {
  const components = installRegistry?.components && typeof installRegistry.components === 'object' ? installRegistry.components : {};
  const patternList = Object.values(patterns ?? {});
  const related = new Map();

  const addRelation = (fromId, toId, via) => {
    const from = String(fromId ?? '').trim();
    const to = String(toId ?? '').trim();
    if (!from || !to || from === to) return;

    if (!related.has(from)) related.set(from, new Map());
    const relMap = related.get(from);
    if (!relMap.has(to)) relMap.set(to, new Set());
    relMap.get(to).add(via);
  };

  for (const pattern of patternList) {
    const patternId = String(pattern?.id ?? '').trim() || 'pattern';
    const requires = [...new Set((Array.isArray(pattern?.requires) ? pattern.requires : []).map((id) => String(id ?? '').trim()).filter(Boolean))];

    for (const fromId of requires) {
      for (const toId of requires) {
        addRelation(fromId, toId, patternId);
      }
    }
  }

  for (const [componentId, meta] of Object.entries(components)) {
    const deps = Array.isArray(meta?.deps) ? meta.deps : [];
    for (const dep of deps) {
      const depId = String(dep ?? '').trim();
      addRelation(componentId, depId, 'dependency');
      addRelation(depId, componentId, 'dependencyOf');
    }
  }

  return related;
}

export function getRelatedComponentsForTag({ canonicalTagName, installRegistry, relatedMap, prefix, maxResults = 12 }) {
  const tags = installRegistry?.tags && typeof installRegistry.tags === 'object' ? installRegistry.tags : {};
  const components = installRegistry?.components && typeof installRegistry.components === 'object' ? installRegistry.components : {};
  const componentId = typeof canonicalTagName === 'string' ? tags[canonicalTagName] : undefined;
  if (typeof componentId !== 'string' || componentId === '') return [];

  const relMap = relatedMap?.get(componentId);
  if (!relMap) return [];

  const out = [];
  for (const [relatedId, via] of relMap.entries()) {
    const relatedMeta = components[relatedId];
    if (!relatedMeta || typeof relatedMeta !== 'object') continue;

    const canonicalTags = Array.isArray(relatedMeta.tags)
      ? relatedMeta.tags.map((tag) => String(tag ?? '').toLowerCase()).filter(Boolean)
      : [];

    out.push({
      componentId: relatedId,
      tagNames: canonicalTags.map((tag) => withPrefix(tag, prefix)),
      via: [...via],
    });
  }

  out.sort((left, right) => String(left.componentId).localeCompare(String(right.componentId)));
  return out.slice(0, Math.max(1, maxResults));
}

// ---------------------------------------------------------------------------
// createMcpServer — builds the McpServer with all tools registered, but does
// NOT connect a transport.  Callers choose their own transport.
//
//   loadJsonData(fileName: string) → Promise<object>
//   loadValidator() → Promise<{ collectCemCustomElements, validateTextAgainstCem }>
// ---------------------------------------------------------------------------

export async function createMcpServer(loadJsonData, loadValidator) {
  const manifest = await loadJsonData('custom-elements.json');
  const indexes = buildIndexes(manifest);
  const {
    collectCemCustomElements,
    validateTextAgainstCem,
    detectTokenMisuseInInlineStyles = () => [],
  } = await loadValidator();
  const canonicalCemIndex = collectCemCustomElements(manifest);
  const installRegistry = await loadJsonData('install-registry.json');
  const patternRegistry = await loadJsonData('pattern-registry.json');
  const { patterns } = loadPatternRegistryShape(patternRegistry);
  const relatedComponentMap = buildRelatedComponentMap(installRegistry, patterns);

  // Load optional data files (design tokens, guidelines index)
  let designTokensData = null;
  try {
    designTokensData = await loadJsonData('design-tokens.json');
  } catch {
    // design-tokens.json may not exist yet
  }

  let guidelinesIndexData = null;
  try {
    guidelinesIndexData = await loadJsonData('guidelines-index.json');
  } catch {
    // guidelines-index.json may not exist yet
  }

  const tokenSuggestionMap = buildTokenSuggestionMap(designTokensData);

  const server = new McpServer({
    name: 'web-components-factory-design-system',
    version: '0.1.1',
  });

  // -----------------------------------------------------------------------
  // Tool: get_design_system_overview
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_design_system_overview',
    {
      description:
        '**MUST be called first before using any other tool.** Returns a high-level overview of the design system: name, version, component count by category, available patterns, and recommended tool workflow. Use this to understand what is available before diving into specifics.',
      inputSchema: {},
    },
    async () => {
      const categoryCount = {};
      for (const { tagName } of indexes.decls) {
        const cat = getCategory(tagName);
        categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
      }

      const patternList = Object.values(patterns).map((p) => ({
        id: p?.id,
        title: p?.title,
      }));

      const overview = {
        name: 'DADS Web Components (wcf)',
        version: '0.1.1',
        prefix: CANONICAL_PREFIX,
        totalComponents: indexes.decls.length,
        componentsByCategory: categoryCount,
        totalPatterns: patternList.length,
        patterns: patternList,
        availableTools: [
          { name: 'get_design_system_overview', purpose: 'This overview (start here)' },
          { name: 'list_components', purpose: 'Browse components with progressive disclosure and filters' },
          { name: 'search_icons', purpose: 'Search icon names and usage examples' },
          { name: 'get_component_api', purpose: 'Full API surface for a single component' },
          { name: 'generate_usage_snippet', purpose: 'Minimal HTML usage example' },
          { name: 'get_install_recipe', purpose: 'Installation instructions and dependency tree' },
          { name: 'validate_markup', purpose: 'Validate HTML against CEM schema' },
          { name: 'list_patterns', purpose: 'Browse page-level UI composition patterns' },
          { name: 'get_pattern_recipe', purpose: 'Full pattern recipe with dependencies and HTML' },
          { name: 'generate_pattern_snippet', purpose: 'Pattern HTML snippet only' },
          { name: 'get_design_tokens', purpose: 'Query design tokens (colors, spacing, typography, radius, shadows)' },
          { name: 'search_guidelines', purpose: 'Search design system guidelines and best practices' },
        ],
        recommendedWorkflow: [
          '1. get_design_system_overview → understand components, patterns & tokens',
          '2. search_guidelines → find relevant guidelines',
          '3. get_design_tokens → get correct token values',
          '4. list_components (category/query + pagination) → shortlist components',
          '5. search_icons (optional) → find icon names quickly',
          '6. get_component_api → check attributes, slots, events, CSS parts',
          '7. generate_usage_snippet or get_pattern_recipe → get code',
          '8. validate_markup → verify your HTML is correct',
          '9. get_install_recipe → get import/install instructions',
        ],
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(overview, null, 2) }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: list_components
  // -----------------------------------------------------------------------
  server.registerTool(
    'list_components',
    {
      description:
        'List custom elements in the design system. When: exploring available components, searching by keyword, or paging through results. Returns: array of {tagName, className, description, category}. After: use get_component_api for details on a specific component.',
      inputSchema: {
        category: z
          .enum(['Form', 'Actions', 'Navigation', 'Content', 'Display', 'Layout', 'Other'])
          .optional()
          .describe('Filter by component category'),
        query: z.string().optional().describe('Search by tagName/className/description/category/modulePath'),
        limit: z.number().int().min(1).max(200).optional().describe('Maximum items to return (optional; omit for all results)'),
        offset: z.number().int().min(0).optional().describe('Pagination offset (default: 0)'),
        prefix: z.string().optional(),
      },
    },
    async ({ category, query, limit, offset, prefix }) => {
      const { items } = buildComponentSummaries(indexes, { category, query, limit, offset, prefix });
      return {
        content: [{ type: 'text', text: JSON.stringify(items, null, 2) }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: search_icons
  // -----------------------------------------------------------------------
  server.registerTool(
    'search_icons',
    {
      description:
        'Search icon catalog by keyword. When: you need a valid icon name for dads-icon or icon-capable components. Returns: { total, limit, offset, hasMore, icons[] } with name, variants, and usageExample. After: use the icon name in generate_usage_snippet or your markup.',
      inputSchema: {
        query: z.string().optional().describe('Search icon names (partial match)'),
        limit: z.number().int().min(1).max(100).optional().describe('Maximum items to return (default: 20)'),
        offset: z.number().int().min(0).optional().describe('Pagination offset (default: 0)'),
        prefix: z.string().optional(),
      },
    },
    async ({ query, limit, offset, prefix }) => {
      const payload = searchIconCatalog(indexes, { query, limit, offset, prefix });
      return {
        content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_component_api
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_component_api',
    {
      description:
        'Get the full API surface of a single component (attributes, slots, events, CSS parts, CSS custom properties). When: you need detailed specs for a component. Returns: complete component specification. After: use generate_usage_snippet for a code example.',
      inputSchema: {
        tagName: z.string().optional(),
        className: z.string().optional(),
        prefix: z.string().optional(),
      },
    },
    async ({ tagName, className, prefix }) => {
      const decl = pickDecl(indexes, { tagName, className, prefix });
      if (!decl) {
        return {
          content: [
            {
              type: 'text',
              text: `Component not found (tagName=${String(tagName ?? '')}, className=${String(className ?? '')})`,
            },
          ],
          isError: true,
        };
      }

      const canonicalTag = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
      const modulePath = canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : undefined;
      const api = serializeApi(decl, modulePath, prefix);
      const relatedComponents = getRelatedComponentsForTag({
        canonicalTagName: canonicalTag,
        installRegistry,
        relatedMap: relatedComponentMap,
        prefix,
      });
      if (relatedComponents.length > 0) {
        api.relatedComponents = relatedComponents;
      }

      return buildJsonToolResponse(api);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: generate_usage_snippet
  // -----------------------------------------------------------------------
  server.registerTool(
    'generate_usage_snippet',
    {
      description:
        'Generate a minimal HTML usage example for a component. When: you need a quick code snippet to start with. Returns: ready-to-use HTML string with key attributes pre-filled.',
      inputSchema: {
        component: z.string(),
        prefix: z.string().optional(),
      },
    },
    async ({ component, prefix }) => {
      const decl =
        pickDecl(indexes, { tagName: component, prefix }) ??
        pickDecl(indexes, { className: component, prefix });

      if (!decl) {
        return {
          content: [{ type: 'text', text: `Component not found: ${component}` }],
          isError: true,
        };
      }

      const canonicalTag = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
      const modulePath = canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : undefined;
      const api = serializeApi(decl, modulePath, prefix);
      const snippet = generateSnippet(api, prefix);

      return {
        content: [{ type: 'text', text: snippet }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_install_recipe
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_install_recipe',
    {
      description:
        'Get installation instructions and dependency tree for a component. When: setting up a component in a project. Returns: componentId, dependencies, import statements, and CLI command (wcf add).',
      inputSchema: {
        component: z.string(),
        prefix: z.string().optional(),
      },
    },
    async ({ component, prefix }) => {
      const p = normalizePrefix(prefix);

      const byTagOrClass =
        pickDecl(indexes, { tagName: component, prefix: p }) ??
        pickDecl(indexes, { className: component, prefix: p });

      const byComponentId = byTagOrClass ? undefined : findDeclByComponentId(indexes, component);
      const decl = byTagOrClass ?? byComponentId?.decl;

      if (!decl) {
        return {
          content: [{ type: 'text', text: `Component not found: ${component}` }],
          isError: true,
        };
      }

      const canonicalTag = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
      const modulePath =
        canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : byComponentId?.modulePath;
      const api = serializeApi(decl, modulePath, p);
      const usageSnippet = generateSnippet(api, p);

      const install = decl?.custom?.install;
      if (!install || typeof install !== 'object') {
        return {
          content: [
            {
              type: 'text',
              text: 'Install metadata not found in CEM.',
            },
          ],
          isError: true,
        };
      }

      const componentId = String(install.id ?? '').trim() || api?.custom?.componentId;
      const define = String(install.define ?? '').trim();
      const deps = Array.isArray(install.deps) ? install.deps : [];
      const tags = Array.isArray(install.tags) ? install.tags : [];

      const tagNames =
        tags.length > 0 ? tags.map((t) => withPrefix(String(t).toLowerCase(), p)) : [api.tagName];

      const defineHint = define
        ? [
            modulePath ? `import { ${define} } from "${modulePath}";` : `import { ${define} } from "<modulePath>";`,
            `${define}();`,
            p !== CANONICAL_PREFIX ? `// If supported: ${define}("${p}");` : undefined,
          ]
            .filter(Boolean)
            .join('\n')
        : undefined;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                componentId,
                tagNames,
                deps,
                define,
                defineHint,
                source: install.source,
                usageSnippet,
                installHint: componentId ? `wcf add ${componentId}` : undefined,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: validate_markup
  // -----------------------------------------------------------------------
  server.registerTool(
    'validate_markup',
    {
      description:
        'Validate HTML against the design system Custom Elements Manifest. When: checking generated or written HTML for correctness. Returns: diagnostics array with errors (unknown elements) and warnings (unknown attributes). Use after generating HTML to catch mistakes.',
      inputSchema: {
        html: z.string(),
        prefix: z.string().optional(),
      },
    },
    async ({ html, prefix }) => {
      const p = normalizePrefix(prefix);
      let cemIndex = canonicalCemIndex;
      if (p !== CANONICAL_PREFIX) {
        const combined = new Map(canonicalCemIndex);
        const prefixed = applyPrefixToCemIndex(canonicalCemIndex, p);
        for (const [tag, meta] of prefixed.entries()) combined.set(tag, meta);
        cemIndex = combined;
      }

      const cemDiagnostics = validateTextAgainstCem({
        filePath: '<markup>',
        text: html,
        cem: cemIndex,
        severity: {
          unknownElement: 'error',
          unknownAttribute: 'warning',
        },
      });

      const tokenMisuseDiagnostics = detectTokenMisuseInInlineStyles({
        filePath: '<markup>',
        text: html,
        valueToToken: tokenSuggestionMap,
        severity: 'warning',
      });

      const diagnostics = [...cemDiagnostics, ...tokenMisuseDiagnostics].map((d) => ({
        file: d.file,
        range: d.range,
        severity: d.severity,
        code: d.code,
        message: d.message,
        tagName: d.tagName,
        attrName: d.attrName,
        hint: d.hint,
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify({ diagnostics }, null, 2) }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: list_patterns
  // -----------------------------------------------------------------------
  server.registerTool(
    'list_patterns',
    {
      description:
        'List available UI composition patterns (page recipes). When: looking for pre-built page layouts or UI compositions. Returns: array of {id, title, description, requires}. After: use get_pattern_recipe for full details including dependency resolution.',
      inputSchema: {},
    },
    async () => {
      const list = Object.values(patterns).map((p) => ({
        id: p?.id,
        title: p?.title,
        description: p?.description,
        requires: p?.requires,
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(list, null, 2) }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_pattern_recipe
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_pattern_recipe',
    {
      description:
        'Get a complete pattern recipe with component dependencies and HTML. When: building a page layout from a pattern. Returns: dependency tree, install commands, and resolved HTML. After: use validate_markup to verify the generated HTML.',
      inputSchema: {
        patternId: z.string(),
        prefix: z.string().optional(),
      },
    },
    async ({ patternId, prefix }) => {
      const id = String(patternId ?? '').trim();
      const p = normalizePrefix(prefix);
      const pat = patterns[id];
      if (!pat) {
        return {
          content: [{ type: 'text', text: `Pattern not found: ${id}` }],
          isError: true,
        };
      }

      const requires = Array.isArray(pat.requires) ? pat.requires : [];
      const closure = resolveComponentClosure({ installRegistry }, requires);

      const components = installRegistry?.components && typeof installRegistry.components === 'object' ? installRegistry.components : {};
      const install = Object.fromEntries(
        closure
          .map((cid) => [cid, components[cid]])
          .filter(([, meta]) => meta && typeof meta === 'object')
          .map(([cid, meta]) => [
            cid,
            {
              ...meta,
              tags: Array.isArray(meta.tags) ? meta.tags.map((t) => withPrefix(String(t).toLowerCase(), p)) : meta.tags,
            },
          ]),
      );

      const canonicalHtml = String(pat.html ?? '');
      const html = applyPrefixToHtml(canonicalHtml, p);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                pattern: {
                  id: pat.id,
                  title: pat.title,
                  description: pat.description,
                },
                prefix: p,
                requires,
                components: closure,
                install,
                html,
                canonicalHtml,
                installHint: closure.length > 0 ? `wcf add ${closure.join(' ')}` : undefined,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: generate_pattern_snippet
  // -----------------------------------------------------------------------
  server.registerTool(
    'generate_pattern_snippet',
    {
      description:
        'Generate just the HTML snippet for a pattern without dependency info. When: you only need the markup. Returns: HTML string with prefix applied. For full dependency resolution, use get_pattern_recipe instead.',
      inputSchema: {
        patternId: z.string(),
        prefix: z.string().optional(),
      },
    },
    async ({ patternId, prefix }) => {
      const id = String(patternId ?? '').trim();
      const p = normalizePrefix(prefix);
      const pat = patterns[id];
      if (!pat) {
        return {
          content: [{ type: 'text', text: `Pattern not found: ${id}` }],
          isError: true,
        };
      }

      return {
        content: [{ type: 'text', text: applyPrefixToHtml(String(pat.html ?? ''), p) }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_design_tokens
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_design_tokens',
    {
      description:
        'Get design tokens (colors, spacing, typography, etc.). ' +
        'When: building UI and need correct token values instead of hard-coded values. ' +
        'Returns: filtered list of tokens with CSS variable names and values. ' +
        'After: use token cssVariable values in your CSS.',
      inputSchema: {
        type: z.enum(['color', 'spacing', 'typography', 'radius', 'shadow']).optional()
          .describe('Filter by token type'),
        category: z.enum(['primitive', 'semantic', 'derived']).optional()
          .describe('Filter by token category'),
        query: z.string().optional()
          .describe('Search token names (partial match)'),
      },
    },
    async ({ type, category, query }) => {
      if (!designTokensData) {
        return {
          content: [{ type: 'text', text: 'Design tokens data not available. Run: npm run mcp:extract-tokens' }],
          isError: true,
        };
      }

      let tokens = Array.isArray(designTokensData.tokens) ? designTokensData.tokens : [];

      if (type) {
        tokens = tokens.filter((t) => t.type === type);
      }
      if (category) {
        tokens = tokens.filter((t) => t.category === category);
      }
      if (query) {
        const q = query.toLowerCase();
        tokens = tokens.filter((t) => t.name.toLowerCase().includes(q));
      }

      const payload = {
        total: tokens.length,
        tokens,
        summary: designTokensData.summary,
      };

      return buildJsonToolResponse(payload);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: search_guidelines
  // -----------------------------------------------------------------------
  server.registerTool(
    'search_guidelines',
    {
      description:
        'Search design system guidelines including accessibility, CSS patterns, and best practices. ' +
        'When: need to understand design system rules before implementing UI. ' +
        'Returns: relevant guideline sections with file paths and snippets. ' +
        'After: follow the guidelines in your implementation.',
      inputSchema: {
        query: z.string().describe('Search keywords'),
        topic: z.enum(['accessibility', 'css', 'patterns', 'all']).optional()
          .describe('Filter by topic area'),
        maxResults: z.number().int().min(1).max(20).optional()
          .describe('Maximum results to return (1-20, default: 5)'),
      },
    },
    async ({ query, topic, maxResults }) => {
      if (!guidelinesIndexData) {
        return {
          content: [{ type: 'text', text: 'Guidelines index not available. Run: npm run mcp:index-guidelines' }],
          isError: true,
        };
      }

      const max = maxResults ?? 5;
      const documents = Array.isArray(guidelinesIndexData.documents) ? guidelinesIndexData.documents : [];
      const q = query.toLowerCase();

      // Score and rank sections
      const results = [];

      for (const doc of documents) {
        if (topic && topic !== 'all' && doc.topic !== topic) continue;

        const sections = Array.isArray(doc.sections) ? doc.sections : [];
        for (const section of sections) {
          let score = 0;
          const heading = String(section.heading ?? '').toLowerCase();
          const keywords = Array.isArray(section.keywords) ? section.keywords : [];
          const snippet = String(section.snippet ?? '').toLowerCase();

          // Heading match: weight 3
          if (heading.includes(q)) score += 3;

          // Keyword match: weight 2
          for (const kw of keywords) {
            if (String(kw).toLowerCase().includes(q)) {
              score += 2;
              break;
            }
          }

          // Snippet match: weight 1
          if (snippet.includes(q)) score += 1;

          if (score > 0) {
            results.push({
              score,
              documentId: doc.id,
              title: doc.title,
              topic: doc.topic,
              heading: section.heading,
              snippet: section.snippet,
              startLine: section.startLine,
            });
          }
        }
      }

      // Sort by score descending, take top N
      results.sort((a, b) => b.score - a.score);
      const topResults = results.slice(0, max);

      const payload = {
        query,
        topic: topic ?? 'all',
        totalHits: results.length,
        results: topResults,
      };

      return buildJsonToolResponse(payload);
    },
  );

  return { server };
}

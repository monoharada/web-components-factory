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
export const MAX_TOOL_RESULT_BYTES = 100 * 1024;
export const EXPERIMENTAL_PLUGIN_NOTICE = '@experimental — API may change without notice.';

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
const WCAG_LEVELS = Object.freeze(new Set(['A', 'AA', 'AAA', 'all']));
const TOKEN_THEMES = Object.freeze(new Set(['light', 'dark', 'all']));
const PLUGIN_DATA_SOURCE_KEYS = Object.freeze(new Set([
  'custom-elements.json',
  'install-registry.json',
  'pattern-registry.json',
  'design-tokens.json',
  'guidelines-index.json',
]));
const BUILTIN_TOOL_NAMES = Object.freeze(new Set([
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
]));
const A11Y_CATEGORY_LEVEL_MAP = Object.freeze({
  semantics: 'A',
  keyboard: 'A',
  labels: 'A',
  states: 'AA',
  zoom: 'AA',
  motion: 'AA',
  callouts: 'AA',
  guideline: 'A',
});
const NPX_TEMPLATE = Object.freeze({
  command: 'npx',
  args: ['@monoharada/wcf-mcp'],
});
export const IDE_SETUP_TEMPLATES = Object.freeze([
  {
    ide: 'Claude Desktop',
    configPath: 'claude_desktop_config.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
  {
    ide: 'Claude Code',
    configPath: '.mcp.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
  {
    ide: 'Cursor',
    configPath: '.cursor/mcp.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
]);

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

export function measureToolResultBytes(result) {
  return Buffer.byteLength(JSON.stringify(result), 'utf8');
}

export function buildJsonToolResponse(payload, { env = process.env } = {}) {
  const content = [{
    type: 'text',
    text: JSON.stringify(payload, null, 2),
  }];

  if (isStructuredContentDisabled(env)) {
    return { content };
  }

  const withStructuredContent = {
    content,
    structuredContent: toStructuredContent(payload),
  };

  // Keep response size under the 100KB guardrail even when structuredContent is enabled.
  if (measureToolResultBytes(withStructuredContent) > MAX_TOOL_RESULT_BYTES) {
    return { content };
  }

  return withStructuredContent;
}

export function normalizeTokenValue(value) {
  if (typeof value === 'string') return value.trim().toLowerCase().replace(/\s+/g, ' ');
  if (typeof value === 'number') return String(value);
  return '';
}

export function normalizeCssVariable(value) {
  if (typeof value !== 'string') return '';

  const raw = value.trim();
  if (!raw) return '';
  if (raw.startsWith('--')) return raw;

  const varMatch = /^var\(\s*(--[^,\s)]+)\s*(?:,\s*[^)]+)?\)$/.exec(raw);
  if (varMatch) return varMatch[1];

  return '';
}

export function buildTokenSuggestionMap(designTokensData) {
  if (!Array.isArray(designTokensData?.tokens)) return new Map();

  const out = new Map();
  for (const token of designTokensData.tokens) {
    const type = String(token?.type ?? '').toLowerCase();
    if (!TOKEN_MISUSE_ALLOWED_TYPES.has(type)) continue;

    const cssVariable = normalizeCssVariable(token?.cssVariable);
    if (!cssVariable) continue;

    const normalized = normalizeTokenValue(token?.value);
    if (normalized && !out.has(normalized)) out.set(normalized, cssVariable);
  }
  return out;
}

export function normalizeTokenIdentifier(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return '';
  const cssVariable = normalizeCssVariable(raw);
  if (cssVariable) return cssVariable;
  if (raw.startsWith('--')) return raw;
  return `--${raw.replace(/^[-]+/, '')}`;
}

export function resolveTokenTheme(theme) {
  const requested = String(theme ?? 'light').trim().toLowerCase() || 'light';
  if (!TOKEN_THEMES.has(requested)) {
    return {
      ok: false,
      errorCode: 'INVALID_THEME',
      message: `Unsupported theme: ${requested}. Allowed values are light, dark, all.`,
    };
  }
  if (requested !== 'light') {
    return {
      ok: false,
      errorCode: 'INVALID_THEME',
      message: `Theme "${requested}" is not available yet. Use theme="light" (NG-06).`,
    };
  }
  return {
    ok: true,
    requested,
    resolved: 'light',
    available: ['light'],
  };
}

export function extractReferencedTokenNames(value) {
  if (typeof value !== 'string') return [];
  const refs = [];
  const re = /var\(\s*(--[^,\s)]+)\s*(?:,\s*[^)]+)?\)/g;
  let match;
  while ((match = re.exec(value))) {
    const tokenName = normalizeTokenIdentifier(match[1]);
    if (tokenName) refs.push(tokenName);
  }
  return [...new Set(refs)];
}

export function buildTokenRelationshipIndex(designTokensData) {
  const byToken = {};
  const tokens = Array.isArray(designTokensData?.tokens) ? designTokensData.tokens : [];
  const fromData = designTokensData?.relationships?.byToken;
  if (fromData && typeof fromData === 'object') {
    for (const [rawName, rawRel] of Object.entries(fromData)) {
      const name = normalizeTokenIdentifier(rawName);
      if (!name) continue;
      const refs = Array.isArray(rawRel?.references)
        ? rawRel.references.map((r) => normalizeTokenIdentifier(r)).filter(Boolean)
        : [];
      const referencedBy = Array.isArray(rawRel?.referencedBy)
        ? rawRel.referencedBy.map((r) => normalizeTokenIdentifier(r)).filter(Boolean)
        : [];
      byToken[name] = {
        references: [...new Set(refs)].sort(),
        referencedBy: [...new Set(referencedBy)].sort(),
      };
    }
  }

  if (Object.keys(byToken).length > 0) {
    return { byToken };
  }

  for (const token of tokens) {
    const name = normalizeTokenIdentifier(token?.name);
    if (!name) continue;
    if (!byToken[name]) byToken[name] = { references: [], referencedBy: [] };
    const refs = extractReferencedTokenNames(token?.value);
    byToken[name].references = refs;
  }

  for (const [sourceName, relation] of Object.entries(byToken)) {
    for (const refName of relation.references) {
      if (!byToken[refName]) byToken[refName] = { references: [], referencedBy: [] };
      byToken[refName].referencedBy.push(sourceName);
    }
  }

  for (const relation of Object.values(byToken)) {
    relation.references = [...new Set(relation.references)].sort();
    relation.referencedBy = [...new Set(relation.referencedBy)].sort();
  }

  return { byToken };
}

function toTokenSummary(token) {
  return {
    name: String(token?.name ?? ''),
    value: String(token?.value ?? ''),
    type: String(token?.type ?? ''),
    category: String(token?.category ?? ''),
    cssVariable: String(token?.cssVariable ?? ''),
  };
}

export function suggestTokenNames(targetName, tokens, maxSuggestions = 5) {
  const target = normalizeTokenIdentifier(targetName);
  if (!target) return [];
  const allNames = [...new Set(tokens
    .map((token) => normalizeTokenIdentifier(token?.name))
    .filter(Boolean))];

  const startsWith = allNames.filter((name) => name.startsWith(target));
  if (startsWith.length >= maxSuggestions) return startsWith.slice(0, maxSuggestions);

  const includes = allNames.filter((name) => name.includes(target) && !startsWith.includes(name));
  const ranked = allNames
    .filter((name) => !startsWith.includes(name) && !includes.includes(name))
    .map((name) => ({ name, distance: levenshteinDistance(target, name) }))
    .sort((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))
    .map((entry) => entry.name);

  return [...startsWith, ...includes, ...ranked].slice(0, maxSuggestions);
}

function buildUsageExamples(token) {
  const cssVar = String(token?.cssVariable ?? '');
  const type = String(token?.type ?? '').toLowerCase();
  if (!cssVar) return [];
  if (type === 'color') {
    return [
      `.example { color: ${cssVar}; }`,
      `.example { background-color: ${cssVar}; }`,
    ];
  }
  if (type === 'spacing') {
    return [
      `.example { padding: ${cssVar}; }`,
      `.example { gap: ${cssVar}; }`,
    ];
  }
  if (type === 'typography') {
    return [
      `.example { font-size: ${cssVar}; }`,
      `.example { line-height: ${cssVar}; }`,
    ];
  }
  if (type === 'radius') {
    return [`.example { border-radius: ${cssVar}; }`];
  }
  if (type === 'shadow') {
    return [`.example { box-shadow: ${cssVar}; }`];
  }
  return [`.example { --token-value: ${cssVar}; }`];
}

function buildTokenErrorPayload(code, message, extra = {}) {
  return {
    isError: true,
    payload: {
      error: { code, message },
      ...extra,
    },
  };
}

export function buildDesignTokenDetailPayload(designTokensData, name, theme) {
  if (!Array.isArray(designTokensData?.tokens)) {
    return buildTokenErrorPayload(
      'DESIGN_TOKENS_DATA_UNAVAILABLE',
      'Design tokens data not available. Run: npm run mcp:extract-tokens',
    );
  }

  const themeInfo = resolveTokenTheme(theme);
  if (!themeInfo.ok) {
    return buildTokenErrorPayload(themeInfo.errorCode, themeInfo.message);
  }

  const normalizedName = normalizeTokenIdentifier(name);
  if (!normalizedName) {
    return buildTokenErrorPayload('INVALID_TOKEN_INPUT', 'Token name is required.');
  }

  const tokens = designTokensData.tokens;
  const token = tokens.find((item) => normalizeTokenIdentifier(item?.name) === normalizedName);
  if (!token) {
    return buildTokenErrorPayload(
      'TOKEN_NOT_FOUND',
      `Token not found: ${normalizedName}`,
      { suggestions: suggestTokenNames(normalizedName, tokens) },
    );
  }

  const relationshipIndex = buildTokenRelationshipIndex(designTokensData);
  const relation = relationshipIndex.byToken[normalizedName] ?? { references: [], referencedBy: [] };
  const tokenByName = new Map(tokens
    .map((item) => [normalizeTokenIdentifier(item?.name), item])
    .filter(([tokenName]) => tokenName));
  const references = relation.references
    .map((tokenName) => tokenByName.get(tokenName))
    .filter(Boolean)
    .map(toTokenSummary);
  const referencedBy = relation.referencedBy
    .map((tokenName) => tokenByName.get(tokenName))
    .filter(Boolean)
    .map(toTokenSummary);
  const relatedTokens = referencedBy
    .filter((item) => String(item.category).toLowerCase() === 'semantic')
    .map((item) => item.name);

  return {
    isError: false,
    payload: {
      token: {
        ...toTokenSummary(token),
        group: token?.group ?? null,
      },
      references,
      referencedBy,
      relatedTokens,
      usageExamples: buildUsageExamples(token),
      theme: {
        requested: themeInfo.requested,
        resolved: themeInfo.resolved,
        available: themeInfo.available,
      },
    },
  };
}

export function buildDesignTokensPayload(designTokensData, { type, category, query, theme } = {}) {
  if (!designTokensData) {
    return buildTokenErrorPayload(
      'DESIGN_TOKENS_DATA_UNAVAILABLE',
      'Design tokens data not available. Run: npm run mcp:extract-tokens',
    );
  }

  const themeInfo = resolveTokenTheme(theme);
  if (!themeInfo.ok) {
    return buildTokenErrorPayload(themeInfo.errorCode, themeInfo.message);
  }

  let tokens = Array.isArray(designTokensData.tokens) ? designTokensData.tokens : [];
  if (type) tokens = tokens.filter((t) => t.type === type);
  if (category) tokens = tokens.filter((t) => t.category === category);
  if (query) {
    const q = String(query).toLowerCase();
    tokens = tokens.filter((t) => String(t.name ?? '').toLowerCase().includes(q));
  }

  return {
    isError: false,
    payload: {
      total: tokens.length,
      tokens,
      summary: designTokensData.summary,
      theme: {
        requested: themeInfo.requested,
        resolved: themeInfo.resolved,
        available: themeInfo.available,
      },
    },
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toPluginErrorMessage(name, reason) {
  return `Invalid plugin (${name}): ${reason}`;
}

/**
 * @experimental — API may change without notice.
 * @typedef {{
 *   fileName: string,
 *   path: string,
 * }} WcfMcpDataSourceConfig
 */

/**
 * @experimental — API may change without notice.
 * @typedef {{
 *   name: string,
 *   description?: string,
 *   inputSchema?: Record<string, unknown>,
 *   handler?: Function,
 *   staticPayload?: unknown,
 * }} WcfMcpPluginTool
 */

/**
 * @experimental — API may change without notice.
 * @typedef {{
 *   name: string,
 *   version: string,
 *   tools?: WcfMcpPluginTool[],
 *   dataSources?: WcfMcpDataSourceConfig[],
 * }} WcfMcpPlugin
 */

function normalizePluginDataSources(pluginName, dataSources) {
  if (!Array.isArray(dataSources)) return [];
  const out = [];
  for (const entry of dataSources) {
    if (!isPlainObject(entry)) {
      throw new Error(toPluginErrorMessage(pluginName, 'dataSources entries must be objects'));
    }
    const fileName = String(entry.fileName ?? '').trim();
    const sourcePath = String(entry.path ?? '').trim();
    if (!fileName || !sourcePath) {
      throw new Error(toPluginErrorMessage(pluginName, 'dataSources entries require fileName and path'));
    }
    if (!PLUGIN_DATA_SOURCE_KEYS.has(fileName)) {
      throw new Error(toPluginErrorMessage(pluginName, `unsupported data source key: ${fileName}`));
    }
    out.push({ fileName, path: sourcePath });
  }
  return out;
}

function normalizePluginTools(pluginName, tools) {
  if (!Array.isArray(tools)) return [];
  const out = [];
  for (const rawTool of tools) {
    if (!isPlainObject(rawTool)) {
      throw new Error(toPluginErrorMessage(pluginName, 'tools entries must be objects'));
    }
    const name = String(rawTool.name ?? '').trim();
    if (!name) throw new Error(toPluginErrorMessage(pluginName, 'tool.name is required'));
    const hasHandler = typeof rawTool.handler === 'function';
    const hasStaticPayload = Object.prototype.hasOwnProperty.call(rawTool, 'staticPayload');
    if (!hasHandler && !hasStaticPayload) {
      throw new Error(toPluginErrorMessage(pluginName, `tool "${name}" needs handler or staticPayload`));
    }
    if (hasHandler && hasStaticPayload) {
      throw new Error(toPluginErrorMessage(pluginName, `tool "${name}" cannot define both handler and staticPayload`));
    }
    const description = String(rawTool.description ?? '').trim() ||
      `Plugin tool provided by ${pluginName}. ${EXPERIMENTAL_PLUGIN_NOTICE}`;
    const inputSchema = isPlainObject(rawTool.inputSchema) ? rawTool.inputSchema : {};
    out.push({
      name,
      description,
      inputSchema,
      handler: hasHandler ? rawTool.handler : undefined,
      staticPayload: hasStaticPayload ? rawTool.staticPayload : undefined,
    });
  }
  return out;
}

export function normalizePlugins(plugins = []) {
  if (!Array.isArray(plugins)) throw new Error('Invalid plugin configuration: plugins must be an array');
  const normalized = [];
  const seenPluginNames = new Set();
  const seenToolNames = new Set(BUILTIN_TOOL_NAMES);

  for (const rawPlugin of plugins) {
    if (!isPlainObject(rawPlugin)) throw new Error('Invalid plugin configuration: each plugin must be an object');
    const name = String(rawPlugin.name ?? '').trim();
    const version = String(rawPlugin.version ?? '').trim();
    if (!name || !version) throw new Error('Invalid plugin configuration: plugin.name and plugin.version are required');
    if (seenPluginNames.has(name)) throw new Error(`Duplicate plugin name: ${name}`);
    seenPluginNames.add(name);

    const tools = normalizePluginTools(name, rawPlugin.tools);
    for (const tool of tools) {
      if (seenToolNames.has(tool.name)) {
        throw new Error(toPluginErrorMessage(name, `tool name collision: ${tool.name}`));
      }
      seenToolNames.add(tool.name);
    }

    const dataSources = normalizePluginDataSources(name, rawPlugin.dataSources);
    normalized.push({ name, version, tools, dataSources });
  }

  return normalized;
}

export function buildPluginDataSourceMap(plugins = []) {
  const out = new Map();
  for (const plugin of plugins) {
    const pluginName = String(plugin?.name ?? 'unknown-plugin');
    const dataSources = Array.isArray(plugin?.dataSources) ? plugin.dataSources : [];
    for (const source of dataSources) {
      const fileName = String(source?.fileName ?? '').trim();
      const sourcePath = String(source?.path ?? '').trim();
      if (!fileName || !sourcePath) continue;
      if (out.has(fileName)) {
        const prev = out.get(fileName);
        throw new Error(`Duplicate data source override for ${fileName} (${prev.pluginName}, ${pluginName})`);
      }
      out.set(fileName, { path: sourcePath, pluginName });
    }
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

export function levenshteinDistance(left, right) {
  const a = String(left ?? '');
  const b = String(right ?? '');
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = curr[j];
  }

  return prev[b.length];
}

export function suggestUnknownElementTagName(tagName, cemIndex) {
  const target = String(tagName ?? '').trim().toLowerCase();
  if (!target || !target.includes('-')) return undefined;

  let bestTag;
  let bestDistance = Number.POSITIVE_INFINITY;
  const candidateSource = cemIndex instanceof Map ? cemIndex.keys() : [];
  for (const rawCandidate of candidateSource) {
    const candidate = String(rawCandidate ?? '').toLowerCase();
    if (!candidate || !candidate.includes('-') || candidate === target) continue;
    const distance = levenshteinDistance(target, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestTag = candidate;
    }
  }

  if (!bestTag) return undefined;
  const maxDistance = Math.max(1, Math.ceil(target.length * 0.3));
  if (bestDistance > maxDistance) return undefined;
  return bestTag;
}

export function buildDiagnosticSuggestion({ diagnostic, cemIndex }) {
  const code = String(diagnostic?.code ?? '');
  if (!code) return undefined;

  if (code === 'unknownElement') {
    const tagName = suggestUnknownElementTagName(diagnostic?.tagName, cemIndex);
    return tagName ? `Did you mean "${tagName}"?` : undefined;
  }

  if (code === 'forbiddenAttribute' && String(diagnostic?.attrName ?? '').toLowerCase() === 'placeholder') {
    return 'Use aria-label or aria-describedby support text instead of placeholder.';
  }

  if (code === 'ariaLiveNotRecommended') {
    return 'Remove aria-live and connect support or error text via aria-describedby.';
  }

  if (code === 'roleAlertNotRecommended') {
    return 'Use role="alert" only for urgent live updates; otherwise use static text associated via aria-describedby.';
  }

  return undefined;
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

export function normalizeWcagLevel(level) {
  const raw = typeof level === 'string' ? level.trim().toUpperCase() : '';
  if (!raw || raw === 'ALL') return 'all';
  return WCAG_LEVELS.has(raw) ? raw : 'all';
}

function getWcagLevelForA11yTopic(topic) {
  const key = String(topic ?? '').trim().toLowerCase();
  return A11Y_CATEGORY_LEVEL_MAP[key] ?? 'A';
}

function toChecklistItemsFromCategories(categories) {
  if (!categories || typeof categories !== 'object') return [];

  const out = [];
  for (const [topic, checks] of Object.entries(categories)) {
    if (!Array.isArray(checks)) continue;
    const wcagLevel = getWcagLevelForA11yTopic(topic);
    for (const check of checks) {
      const text = String(check ?? '').trim();
      if (!text) continue;
      out.push({
        topic: String(topic),
        wcagLevel,
        check: text,
      });
    }
  }
  return out;
}

function toChecklistItemsFromCallouts(callouts) {
  if (!Array.isArray(callouts)) return [];

  const out = [];
  for (const callout of callouts) {
    const parts = [
      callout?.title,
      callout?.label,
      callout?.description,
      ...(Array.isArray(callout?.highlights) ? callout.highlights : []),
    ]
      .map((value) => String(value ?? '').trim())
      .filter(Boolean);

    if (parts.length === 0) continue;
    out.push({
      topic: 'callouts',
      wcagLevel: getWcagLevelForA11yTopic('callouts'),
      check: parts.join(' — '),
    });
  }
  return out;
}

export function extractAccessibilityChecklist(decl, { prefix } = {}) {
  const annotations = decl?.custom?.a11yAnnotations;
  if (!annotations || typeof annotations !== 'object') return undefined;

  const items = [
    ...toChecklistItemsFromCategories(annotations.categories),
    ...toChecklistItemsFromCallouts(annotations.callouts),
  ];
  if (items.length === 0) return undefined;

  const unique = new Map();
  for (const item of items) {
    const key = `${item.topic}|${item.wcagLevel}|${item.check}`;
    if (!unique.has(key)) unique.set(key, item);
  }

  return {
    summary: String(annotations.summary ?? '').trim() || 'Component accessibility checklist',
    version: Number.isInteger(annotations.version) ? annotations.version : 1,
    totalChecks: unique.size,
    items: [...unique.values()],
    componentTagName:
      typeof decl?.tagName === 'string' ? withPrefix(decl.tagName.toLowerCase(), prefix) : undefined,
  };
}

export function buildAccessibilityIndex(indexes, guidelinesIndexData, { prefix } = {}) {
  const out = [];

  for (const { decl, tagName } of indexes.decls) {
    const checklist = extractAccessibilityChecklist(decl, { prefix });
    if (!checklist) continue;
    const className = typeof decl?.name === 'string' ? decl.name : undefined;

    for (const item of checklist.items) {
      out.push({
        source: 'component',
        componentTagName: withPrefix(tagName, prefix),
        componentClassName: className,
        topic: item.topic,
        wcagLevel: item.wcagLevel,
        check: item.check,
      });
    }
  }

  const docs = Array.isArray(guidelinesIndexData?.documents)
    ? guidelinesIndexData.documents.filter((doc) => doc?.topic === 'accessibility')
    : [];

  for (const doc of docs) {
    const sections = Array.isArray(doc?.sections) ? doc.sections : [];
    for (const section of sections) {
      const heading = String(section?.heading ?? '').trim();
      const snippet = String(section?.snippet ?? '').trim();
      if (!heading && !snippet) continue;

      out.push({
        source: 'guideline',
        documentId: String(doc?.id ?? ''),
        title: String(doc?.title ?? ''),
        heading,
        topic: 'guideline',
        wcagLevel: getWcagLevelForA11yTopic('guideline'),
        check: snippet || heading,
      });
    }
  }

  return out;
}

export function queryAccessibilityIndex(
  entries,
  { componentTagName, topic, wcagLevel, maxResults = 20 } = {},
) {
  const normalizedTopic = String(topic ?? '').trim().toLowerCase() || 'all';
  const normalizedWcagLevel = normalizeWcagLevel(wcagLevel);
  const pageSize = Number.isInteger(maxResults) ? Math.max(1, Math.min(maxResults, 100)) : 20;
  const source = Array.isArray(entries) ? entries : [];
  const results = [];
  const shouldBalanceSources = !componentTagName && normalizedTopic === 'all';
  const guidelineCandidates = [];
  const componentCandidates = [];
  const otherCandidates = [];
  let totalHits = 0;

  for (const entry of source) {
    if (componentTagName && entry.componentTagName !== componentTagName) continue;
    if (normalizedTopic !== 'all' && String(entry.topic ?? '').toLowerCase() !== normalizedTopic) continue;
    if (normalizedWcagLevel !== 'all' && String(entry.wcagLevel ?? '').toUpperCase() !== normalizedWcagLevel) continue;

    totalHits += 1;
    if (!shouldBalanceSources) {
      if (results.length < pageSize) results.push(entry);
      continue;
    }

    if (String(entry.source ?? '') === 'guideline') {
      if (guidelineCandidates.length < pageSize) guidelineCandidates.push(entry);
    } else if (String(entry.source ?? '') === 'component') {
      if (componentCandidates.length < pageSize) componentCandidates.push(entry);
    } else if (otherCandidates.length < pageSize) {
      otherCandidates.push(entry);
    }
  }

  if (shouldBalanceSources) {
    while (results.length < pageSize) {
      const beforeLength = results.length;
      if (guidelineCandidates.length > 0) results.push(guidelineCandidates.shift());
      if (results.length < pageSize && componentCandidates.length > 0) results.push(componentCandidates.shift());
      if (results.length < pageSize && otherCandidates.length > 0) results.push(otherCandidates.shift());
      if (results.length === beforeLength) break;
    }
  }

  return {
    topic: normalizedTopic,
    wcagLevel: normalizedWcagLevel,
    totalHits,
    results,
  };
}

function resolveDeclByComponent(indexes, component, prefix) {
  const byTagOrClass =
    pickDecl(indexes, { tagName: component, prefix }) ??
    pickDecl(indexes, { className: component, prefix });
  if (byTagOrClass) {
    const canonicalTag = typeof byTagOrClass.tagName === 'string' ? byTagOrClass.tagName.toLowerCase() : undefined;
    return {
      decl: byTagOrClass,
      modulePath: canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : undefined,
    };
  }

  return findDeclByComponentId(indexes, component);
}

// ---------------------------------------------------------------------------
// createMcpServer — builds the McpServer with all tools registered, but does
// NOT connect a transport.  Callers choose their own transport.
//
//   loadJsonData(fileName: string) → Promise<object>
//   loadValidator() → Promise<{ collectCemCustomElements, validateTextAgainstCem }>
//   options?: {
//     plugins?: WcfMcpPlugin[],
//     loadJsonDataFromPath?: (path: string, fileName: string, pluginName?: string) => Promise<object>
//   }
// ---------------------------------------------------------------------------

export async function createMcpServer(loadJsonData, loadValidator, options = {}) {
  const plugins = normalizePlugins(options?.plugins ?? []);
  const pluginDataSourceMap = buildPluginDataSourceMap(plugins);
  const loadJsonDataFromPath = typeof options?.loadJsonDataFromPath === 'function'
    ? options.loadJsonDataFromPath
    : null;

  const loadJson = async (fileName) => {
    const override = pluginDataSourceMap.get(fileName);
    if (!override) return loadJsonData(fileName);
    if (!loadJsonDataFromPath) {
      throw new Error(`Plugin data source override for ${fileName} requires loadJsonDataFromPath`);
    }
    return loadJsonDataFromPath(override.path, fileName, override.pluginName);
  };

  const manifest = await loadJson('custom-elements.json');
  const indexes = buildIndexes(manifest);
  const {
    collectCemCustomElements,
    validateTextAgainstCem,
    detectTokenMisuseInInlineStyles = () => [],
    detectAccessibilityMisuseInMarkup = () => [],
  } = await loadValidator();
  const canonicalCemIndex = collectCemCustomElements(manifest);
  const installRegistry = await loadJson('install-registry.json');
  const patternRegistry = await loadJson('pattern-registry.json');
  const { patterns } = loadPatternRegistryShape(patternRegistry);
  const relatedComponentMap = buildRelatedComponentMap(installRegistry, patterns);

  // Load optional data files (design tokens, guidelines index)
  let designTokensData = null;
  try {
    designTokensData = await loadJson('design-tokens.json');
  } catch {
    // design-tokens.json may not exist yet
  }

  let guidelinesIndexData = null;
  try {
    guidelinesIndexData = await loadJson('guidelines-index.json');
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
        ideSetupTemplates: IDE_SETUP_TEMPLATES,
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
          { name: 'get_design_token_detail', purpose: 'Get details, relationships, and usage examples for one token' },
          { name: 'get_accessibility_docs', purpose: 'Search component-level accessibility checklist and WCAG-filtered guidance' },
          { name: 'search_guidelines', purpose: 'Search design system guidelines and best practices' },
        ],
        recommendedWorkflow: [
          '1. get_design_system_overview → understand components, patterns, tokens, and IDE setup templates',
          '2. search_guidelines → find relevant guidelines',
          '3. get_design_tokens → get correct token values',
          '4. get_design_token_detail → inspect one token with references/referencedBy and usage examples',
          '5. get_accessibility_docs → fetch component-level accessibility checklist',
          '6. list_components (category/query + pagination) → shortlist components',
          '7. search_icons (optional) → find icon names quickly',
          '8. get_component_api → check attributes, slots, events, CSS parts',
          '9. generate_usage_snippet or get_pattern_recipe → get code',
          '10. validate_markup → verify your HTML and use suggestions to self-correct',
          '11. get_install_recipe → get import/install instructions',
        ],
        experimental: {
          plugins: {
            enabled: plugins.length > 0,
            note: EXPERIMENTAL_PLUGIN_NOTICE,
            pluginCount: plugins.length,
            pluginToolCount: plugins.reduce((sum, plugin) => sum + (plugin.tools?.length ?? 0), 0),
            plugins: plugins.map((plugin) => ({
              name: plugin.name,
              version: plugin.version,
              toolCount: plugin.tools?.length ?? 0,
              dataSourceOverrides: plugin.dataSources?.map((source) => source.fileName) ?? [],
            })),
          },
        },
      };

      for (const plugin of plugins) {
        const tools = Array.isArray(plugin.tools) ? plugin.tools : [];
        for (const tool of tools) {
          overview.availableTools.push({
            name: tool.name,
            purpose: `${tool.description} (plugin: ${plugin.name})`,
          });
        }
      }

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
      const accessibilityChecklist = extractAccessibilityChecklist(decl, { prefix });
      if (accessibilityChecklist) {
        api.accessibilityChecklist = accessibilityChecklist;
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
      const resolved = resolveDeclByComponent(indexes, component, p);
      const decl = resolved?.decl;

      if (!decl) {
        return {
          content: [{ type: 'text', text: `Component not found: ${component}` }],
          isError: true,
        };
      }

      const canonicalTag = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
      const modulePath = canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : resolved?.modulePath;
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
        'Validate HTML against the design system Custom Elements Manifest. When: checking generated or written HTML for correctness. Returns: diagnostics array with errors (unknown elements), warnings (unknown attributes/token misuse/accessibility misuse), and optional suggestion text for quick recovery. Use after generating HTML to catch mistakes.',
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

      const accessibilityDiagnostics = detectAccessibilityMisuseInMarkup({
        filePath: '<markup>',
        text: html,
        severity: 'warning',
      });

      const diagnostics = [...cemDiagnostics, ...tokenMisuseDiagnostics, ...accessibilityDiagnostics].map((d) => {
        const suggestion = buildDiagnosticSuggestion({ diagnostic: d, cemIndex });
        return {
          file: d.file,
          range: d.range,
          severity: d.severity,
          code: d.code,
          message: d.message,
          tagName: d.tagName,
          attrName: d.attrName,
          hint: d.hint,
          suggestion,
        };
      });

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
        theme: z.enum(['light', 'dark', 'all']).optional()
          .describe('Theme filter (currently light only; dark/all return an error due to NG-06)'),
      },
    },
    async ({ type, category, query, theme }) => {
      const { isError, payload } = buildDesignTokensPayload(designTokensData, { type, category, query, theme });
      if (isError) {
        return {
          content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
          isError: true,
        };
      }
      return buildJsonToolResponse(payload);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_design_token_detail
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_design_token_detail',
    {
      description:
        'Get details for one design token. ' +
        'When: you already found a token and need its references, referencedBy, and usage examples. ' +
        'Returns: token detail object with relationships and example CSS snippets. ' +
        'After: apply the cssVariable in your implementation or validate related semantic aliases.',
      inputSchema: {
        name: z.string()
          .describe('Token name or css variable (e.g. --color-primary or var(--color-primary))'),
        theme: z.enum(['light', 'dark', 'all']).optional()
          .describe('Theme selector (currently only light is supported due to NG-06)'),
      },
    },
    async ({ name, theme }) => {
      const { isError, payload } = buildDesignTokenDetailPayload(designTokensData, name, theme);
      if (isError) {
        return {
          content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
          isError: true,
        };
      }
      return buildJsonToolResponse(payload);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_accessibility_docs
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_accessibility_docs',
    {
      description:
        'Get accessibility guidance and component checklist entries. ' +
        'When: validating accessibility decisions, reviewing ARIA usage, or checking WCAG-focused implementation notes. ' +
        'Returns: filtered checklist entries from component a11y annotations and accessibility guidelines. ' +
        'After: apply the checks in your markup and run validate_markup.',
      inputSchema: {
        component: z.string().optional()
          .describe('Filter by component tagName/className/componentId'),
        topic: z.string().optional()
          .describe('Filter by topic (e.g. semantics, keyboard, labels, states, zoom, motion, callouts, guideline)'),
        wcagLevel: z.enum(['A', 'AA', 'AAA', 'all']).optional()
          .describe('Filter by WCAG level (default: all)'),
        maxResults: z.number().int().min(1).max(100).optional()
          .describe('Maximum results to return (default: 20)'),
        prefix: z.string().optional(),
      },
    },
    async ({ component, topic, wcagLevel, maxResults, prefix }) => {
      const p = normalizePrefix(prefix);
      let componentTagName;

      if (typeof component === 'string' && component.trim() !== '') {
        const decl = resolveDeclByComponent(indexes, component, p)?.decl;

        if (!decl || typeof decl?.tagName !== 'string') {
          return {
            content: [{
              type: 'text',
              text: `Component not found (component=${component})`,
            }],
            isError: true,
          };
        }

        componentTagName = withPrefix(decl.tagName.toLowerCase(), p);
      }

      const entries = buildAccessibilityIndex(indexes, guidelinesIndexData, { prefix: p });
      const result = queryAccessibilityIndex(entries, {
        componentTagName,
        topic,
        wcagLevel,
        maxResults,
      });

      const payload = {
        query: {
          component: componentTagName ?? null,
          topic: result.topic,
          wcagLevel: result.wcagLevel,
        },
        totalHits: result.totalHits,
        results: result.results,
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

  for (const plugin of plugins) {
    const pluginTools = Array.isArray(plugin.tools) ? plugin.tools : [];
    for (const tool of pluginTools) {
      server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: tool.inputSchema ?? {},
        },
        async (args) => {
          try {
            if (typeof tool.handler === 'function') {
              const result = await tool.handler(args, {
                plugin: { name: plugin.name, version: plugin.version },
                helpers: {
                  buildJsonToolResponse,
                  normalizePrefix,
                  withPrefix,
                  toCanonicalTagName,
                },
                loadJsonData: loadJson,
              });
              if (isPlainObject(result) && Array.isArray(result.content)) {
                return result;
              }
              return buildJsonToolResponse(result ?? {});
            }
            return buildJsonToolResponse(tool.staticPayload ?? {});
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  error: {
                    code: 'PLUGIN_TOOL_RUNTIME_ERROR',
                    message: `Plugin tool failed (${tool.name}): ${message}`,
                    plugin: plugin.name,
                  },
                }, null, 2),
              }],
              isError: true,
            };
          }
        },
      );
    }
  }

  return {
    server,
    pluginRuntime: {
      pluginCount: plugins.length,
      pluginToolCount: plugins.reduce((sum, plugin) => sum + (plugin.tools?.length ?? 0), 0),
      dataSourceOverrides: [...pluginDataSourceMap.entries()].map(([fileName, item]) => ({
        fileName,
        path: item.path,
        pluginName: item.pluginName,
      })),
    },
  };
}

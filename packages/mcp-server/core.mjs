/**
 * core.mjs — Facade re-exporting all public and internal symbols.
 *
 * Both `server.mjs` (standalone / npx) and `scripts/mcp/design-system-mcp.mjs`
 * (repo-local) import `createMcpServer()` from here so that tool definitions
 * and helper functions live in exactly one place.
 *
 * Actual logic lives in core/ sub-modules (DD-02, DD-09).
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAll } from './core/register.mjs';

// --- core/constants.mjs ---
export {
  CANONICAL_PREFIX,
  MAX_PREFIX_LENGTH,
  STRUCTURED_CONTENT_DISABLE_FLAG,
  MAX_TOOL_RESULT_BYTES,
  PLUGIN_TOOL_NOTICE,
  CATEGORY_MAP,
  FIGMA_TO_WCF_PROMPT,
  WCF_RESOURCE_URIS,
  IDE_SETUP_TEMPLATES,
} from './core/constants.mjs';

// --- core/response.mjs ---
export {
  expandQueryWithSynonyms,
  isStructuredContentDisabled,
  toStructuredContent,
  measureToolResultBytes,
  buildJsonToolResponse,
  buildJsonToolErrorResponse,
} from './core/response.mjs';

// --- core/prefix.mjs ---
export {
  getCategory,
  normalizePrefix,
  withPrefix,
  toCanonicalTagName,
  levenshteinDistance,
  suggestUnknownElementTagName,
  buildDiagnosticSuggestion,
  applyPrefixToTagMap,
  mergeWithPrefixed,
  applyPrefixToHtml,
} from './core/prefix.mjs';

// --- core/plugins.mjs ---
export {
  PLUGIN_CONTRACT_VERSION,
  toPassthroughSchema,
  normalizePlugins,
  buildPluginDataSourceMap,
} from './core/plugins.mjs';

// --- core/tokens.mjs ---
export {
  normalizeTokenValue,
  normalizeCssVariable,
  buildTokenSuggestionMap,
  normalizeTokenIdentifier,
  resolveTokenTheme,
  extractReferencedTokenNames,
  buildTokenRelationshipIndex,
  buildComponentTokenReferencedBy,
  suggestTokenNames,
  buildDesignTokenDetailPayload,
  buildDesignTokensPayload,
} from './core/tokens.mjs';

// --- core/cem.mjs ---
export {
  findCustomElementDeclarations,
  buildIndexes,
  extractPrefixFromIndexes,
  buildFullPageHtml,
  pickDecl,
  serializeApi,
  generateSnippet,
  findDeclByComponentId,
  loadPatternRegistryShape,
  resolveComponentClosure,
  buildPatternFrequencyMap,
  buildComponentSummaries,
  parseIconNamesFromDescription,
  parseIconNamesFromType,
  extractIconNames,
  buildIconCatalog,
  searchIconCatalog,
  buildRelatedComponentMap,
  getRelatedComponentsForTag,
  normalizeWcagLevel,
  extractAccessibilityChecklist,
  buildAccessibilityIndex,
  queryAccessibilityIndex,
} from './core/cem.mjs';

// ---------------------------------------------------------------------------
// Imports needed within createMcpServer orchestration
// ---------------------------------------------------------------------------
import { normalizePlugins, buildPluginDataSourceMap } from './core/plugins.mjs';
import { buildIndexes, extractPrefixFromIndexes, loadPatternRegistryShape, buildRelatedComponentMap, buildPatternFrequencyMap } from './core/cem.mjs';
import { buildTokenSuggestionMap, buildComponentTokenReferencedBy } from './core/tokens.mjs';
import { MAX_TOOL_RESULT_BYTES } from './core/constants.mjs';

// ---------------------------------------------------------------------------
// createMcpServer — builds the McpServer with all tools registered, but does
// NOT connect a transport.  Callers choose their own transport.
// ---------------------------------------------------------------------------

export async function createMcpServer(loadJsonData, loadValidator, options = {}) {
  const plugins = normalizePlugins(options?.plugins ?? []);
  const pluginDataSourceMap = buildPluginDataSourceMap(plugins);
  const loadJsonDataFromPath = typeof options?.loadJsonDataFromPath === 'function'
    ? options.loadJsonDataFromPath
    : null;
  const loadTextData = typeof options?.loadTextData === 'function'
    ? options.loadTextData
    : null;

  const loadJson = async (fileName) => {
    const override = pluginDataSourceMap.get(fileName);
    if (!override) return loadJsonData(fileName);
    if (!loadJsonDataFromPath) {
      throw new Error(`Plugin data source override for ${fileName} requires loadJsonDataFromPath`);
    }
    return loadJsonDataFromPath(override.path, fileName, override.pluginName);
  };
  const loadText = async (fileName) => {
    if (!loadTextData) throw new Error(`Text data loader not configured for ${fileName}`);
    return loadTextData(fileName);
  };

  const manifest = await loadJson('custom-elements.json');
  const indexes = buildIndexes(manifest);
  const detectedPrefix = extractPrefixFromIndexes(indexes);
  const {
    collectCemCustomElements,
    validateTextAgainstCem,
    detectTokenMisuseInInlineStyles = () => [],
    detectAccessibilityMisuseInMarkup = () => [],
    buildEnumAttributeMap = () => new Map(),
    detectEnumValueMisuse = () => [],
    buildSlotNameMap = () => new Map(),
    detectInvalidSlotName = () => [],
    detectMissingRequiredAttributes = () => [],
    detectOrphanedChildComponents = () => [],
    detectEmptyInteractiveElement = () => [],
    detectNonLowercaseAttributes = () => [],
    detectCdnReferences = () => [],
    detectMissingRuntimeScaffold = () => [],
  } = await loadValidator();
  const canonicalCemIndex = collectCemCustomElements(manifest);
  const canonicalEnumMap = buildEnumAttributeMap(manifest);
  const canonicalSlotMap = buildSlotNameMap(manifest);
  const installRegistry = await loadJson('install-registry.json');
  const patternRegistry = await loadJson('pattern-registry.json');
  const { patterns } = loadPatternRegistryShape(patternRegistry);
  const relatedComponentMap = buildRelatedComponentMap(installRegistry, patterns);
  const patternFrequency = buildPatternFrequencyMap(patterns);

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
  let llmsFullText = null;
  try {
    llmsFullText = await loadText('llms-full.txt');
  } catch {
    // llms-full.txt may not exist in local setup
  }

  const tokenSuggestionMap = buildTokenSuggestionMap(designTokensData);
  const componentTokenRefMap = buildComponentTokenReferencedBy(manifest);

  let selectorGuideData = null;
  try {
    selectorGuideData = await loadJson('component-selector-guide.json');
  } catch {
    // component-selector-guide.json may not exist yet
  }

  const server = new McpServer({
    name: 'web-components-factory-design-system',
    version: '0.7.0',
  });

  // Delegate all tool / resource / prompt registration to register.mjs (DD-08)
  registerAll({
    server,
    indexes,
    detectedPrefix,
    canonicalCemIndex,
    canonicalEnumMap,
    canonicalSlotMap,
    installRegistry,
    patterns,
    relatedComponentMap,
    patternFrequency,
    designTokensData,
    guidelinesIndexData,
    llmsFullText,
    tokenSuggestionMap,
    componentTokenRefMap,
    plugins,
    loadJsonData,
    loadJson,
    loadText,
    loadValidator: async () => ({
      collectCemCustomElements,
      validateTextAgainstCem,
      detectTokenMisuseInInlineStyles,
      detectAccessibilityMisuseInMarkup,
      buildEnumAttributeMap,
      detectEnumValueMisuse,
      buildSlotNameMap,
      detectInvalidSlotName,
      detectMissingRequiredAttributes,
      detectOrphanedChildComponents,
      detectEmptyInteractiveElement,
      detectNonLowercaseAttributes,
      detectCdnReferences,
      detectMissingRuntimeScaffold,
    }),
    selectorGuideData,
    maxToolResultBytes: MAX_TOOL_RESULT_BYTES,
  });

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

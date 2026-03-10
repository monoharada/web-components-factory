/**
 * core/register.mjs — Tool / Resource / Prompt registration logic for the MCP server.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CANONICAL_PREFIX, PACKAGE_VERSION, PLUGIN_TOOL_NOTICE, FIGMA_TO_WCF_PROMPT, WCF_RESOURCE_URIS, IDE_SETUP_TEMPLATES } from './constants.mjs';
import { normalizePrefix, withPrefix, toCanonicalTagName, getCategory, buildDiagnosticSuggestion, applyPrefixToHtml, applyPrefixToTagMap, mergeWithPrefixed } from './prefix.mjs';
import { buildJsonToolResponse, buildJsonToolErrorResponse, expandQueryWithSynonyms, finalizeToolResult } from './response.mjs';
import { normalizePlugins, buildPluginDataSourceMap, toPassthroughSchema } from './plugins.mjs';
import { normalizeTokenIdentifier, buildTokenSuggestionMap, buildDesignTokensPayload, buildDesignTokenDetailPayload, buildComponentTokenReferencedBy, buildTokensResourcePayload } from './tokens.mjs';
import {
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
  searchIconCatalog,
  buildRelatedComponentMap,
  getRelatedComponentsForTag,
  extractAccessibilityChecklist,
  buildAccessibilityIndex,
  queryAccessibilityIndex,
  INTERACTION_EXAMPLES_MAP,
  LAYOUT_BEHAVIOR_MAP,
  buildComponentsResourcePayload,
  resolveDeclByComponent,
  buildComponentNotFoundError,
} from './cem.mjs';

// Single-module constants (DD-14)
const GUIDELINE_TOPICS = Object.freeze(['accessibility', 'css', 'patterns', 'all']);
const GUIDELINE_TOPIC_SET = Object.freeze(new Set(GUIDELINE_TOPICS));
const ACCESSIBILITY_WARNING_CODES = Object.freeze(new Set([
  'ariaLiveNotRecommended',
  'roleAlertNotRecommended',
]));

/** Normalize a skill entry to summary fields (omit compat/manifest for wcf://skills). */
function normalizeSkillSummary(s) {
  return {
    name: s.name,
    description: s.description ?? '',
    status: s.status ?? 'active',
    path: s.path ?? '',
    entry: s.entry ?? 'SKILL.md',
    clients: Array.isArray(s.clients) ? s.clients : [],
    tags: Array.isArray(s.tags) ? s.tags : [],
    version: typeof s.version === 'string' ? s.version : '0.0.0',
    dependencies: Array.isArray(s.dependencies) ? s.dependencies : [],
  };
}

function buildGuidelinesResourcePayload(guidelinesIndexData, rawTopic) {
  const topic = String(rawTopic ?? '').trim().toLowerCase();
  if (!GUIDELINE_TOPIC_SET.has(topic)) {
    return {
      isError: true,
      error: {
        code: 'INVALID_GUIDELINE_TOPIC',
        message: `Unsupported topic: ${topic}. Allowed values are ${GUIDELINE_TOPICS.join(', ')}.`,
      },
    };
  }

  if (!Array.isArray(guidelinesIndexData?.documents)) {
    return {
      isError: true,
      error: {
        code: 'GUIDELINES_INDEX_UNAVAILABLE',
        message: 'Guidelines index not available. Run: npm run mcp:index-guidelines',
      },
    };
  }

  const documents = guidelinesIndexData.documents
    .filter((doc) => topic === 'all' || String(doc?.topic ?? '').toLowerCase() === topic)
    .map((doc) => {
      const sections = Array.isArray(doc?.sections) ? doc.sections : [];
      return {
        id: String(doc?.id ?? ''),
        title: String(doc?.title ?? ''),
        topic: String(doc?.topic ?? ''),
        sectionCount: sections.length,
        sections: sections.map((section) => ({
          heading: String(section?.heading ?? ''),
          startLine: Number.isInteger(section?.startLine) ? section.startLine : undefined,
        })),
      };
    });

  return {
    isError: false,
    payload: {
      topic,
      totalDocuments: documents.length,
      topicCounts: guidelinesIndexData.topicCounts ?? {},
      documents,
    },
  };
}

function buildFigmaToWcfPromptText({ figmaUrl, userIntent }) {
  const url = String(figmaUrl ?? '').trim();
  const intent = String(userIntent ?? '').trim();

  return [
    `Figma URL: ${url}`,
    intent ? `Implementation goal: ${intent}` : 'Implementation goal: (not specified)',
    '',
    'Use the workflow below in this exact order:',
    '1. get_design_system_overview',
    '2. get_design_tokens',
    '3. get_component_api',
    '4. generate_usage_snippet (or get_pattern_recipe)',
    '5. validate_markup',
    '',
    'Output requirements:',
    '- Split the UI into sections before writing code.',
    '- For each section, name concrete components and token variables.',
    '- Provide final validation notes and required fixes.',
  ].join('\n');
}

function escapeHtmlTitle(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildImportMapEntries(closure, components, prefix, dir, prefixStripRe) {
  return Object.fromEntries(
    closure.flatMap((cid) => {
      const meta = components[cid];
      const tags = Array.isArray(meta?.tags) ? meta.tags : [cid];
      return tags.map((t) => {
        const lower = String(t).toLowerCase();
        const suffix = lower.replace(prefixStripRe, '');
        return [withPrefix(lower, prefix), `./${dir}/components/${suffix}.js`];
      });
    }),
  );
}

function scoreSearchFields(query, terms, fields) {
  let score = 0;
  const matchedTerms = new Set();
  for (const { text, weight } of fields) {
    const normalized = String(text ?? '').toLowerCase();
    if (!normalized) continue;
    if (query && normalized === query) {
      score += weight * 6;
      matchedTerms.add(query);
      continue;
    }
    if (query && normalized.startsWith(query)) {
      score += weight * 3;
      matchedTerms.add(query);
    } else if (query && normalized.includes(query)) {
      score += weight * 2;
      matchedTerms.add(query);
    }
    for (const term of terms) {
      if (!term) continue;
      if (normalized.includes(term)) {
        score += weight;
        matchedTerms.add(term);
      }
    }
  }
  score += matchedTerms.size * 2;
  return score;
}

function detectKnowledgeIntentSources(query, terms) {
  const raw = `${query} ${terms.join(' ')}`.toLowerCase();
  const intents = new Set();

  if (
    raw.includes('guideline') ||
    raw.includes('rule') ||
    raw.includes('a11y') ||
    raw.includes('accessibility') ||
    raw.includes('wcag') ||
    raw.includes('aria') ||
    raw.includes('keyboard') ||
    raw.includes('focus') ||
    raw.includes('contrast') ||
    raw.includes('::part')
  ) intents.add('guidelines');

  if (
    raw.includes('token') ||
    raw.includes('css variable') ||
    raw.includes('spacing') ||
    raw.includes('color') ||
    raw.includes('typography') ||
    raw.includes('radius') ||
    raw.includes('shadow') ||
    query.startsWith('--') ||
    query.includes('var(')
  ) intents.add('tokens');

  if (
    raw.includes('pattern') ||
    raw.includes('layout') ||
    raw.includes('page') ||
    raw.includes('screen') ||
    raw.includes('shell') ||
    raw.includes('dashboard') ||
    raw.includes('template')
  ) intents.add('patterns');

  if (
    raw.includes('skill') ||
    raw.includes('workflow') ||
    raw.includes('codex') ||
    raw.includes('claude') ||
    raw.includes('cursor') ||
    raw.includes('prompt')
  ) intents.add('skills');

  if (
    query.startsWith('dads-') ||
    /^[a-z0-9-]+$/.test(query) ||
    /^[A-Z][A-Za-z0-9]+$/.test(query)
  ) intents.add('components');

  return intents;
}

function getKnowledgeSourceBoost(source, query, terms) {
  const intents = detectKnowledgeIntentSources(query, terms);
  return intents.has(source) ? 6 : 0;
}

function selectKnowledgeResults(results, limit, requestedSources) {
  if (requestedSources.size <= 1) {
    return results.slice(0, limit);
  }

  const selected = [];
  const deferred = [];
  const sourceCounts = new Map();
  const softCap = Math.max(1, Math.ceil(limit / requestedSources.size));

  for (const result of results) {
    const sourceCount = sourceCounts.get(result.source) ?? 0;
    if (sourceCount < softCap) {
      selected.push(result);
      sourceCounts.set(result.source, sourceCount + 1);
      if (selected.length >= limit) return selected;
      continue;
    }
    deferred.push(result);
  }

  for (const result of deferred) {
    selected.push(result);
    if (selected.length >= limit) break;
  }

  return selected;
}

function buildKnowledgeFollowUp(result) {
  switch (result.source) {
    case 'components':
      return {
        tool: 'get_component_api',
        arguments: { component: result.id },
      };
    case 'patterns':
      return {
        tool: 'get_pattern_recipe',
        arguments: { patternId: result.id },
      };
    case 'guidelines':
      return {
        tool: 'search_guidelines',
        arguments: {
          query: result.title,
          topic: result.metadata?.topic ?? 'all',
        },
      };
    case 'tokens':
      return {
        tool: 'get_design_token_detail',
        arguments: { name: result.id },
      };
    case 'skills':
      return {
        resource: 'wcf://skills',
        hint: `Filter skill "${result.id}" from the skills catalog, or use get_skill_manifest when the design-system-skills plugin is enabled.`,
      };
    default:
      return undefined;
  }
}

function escapeRegex(value) {
  return String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

function isGlobLike(pattern) {
  return /[*?[\]{}()]/.test(pattern);
}

function matchesGlobPattern(filePath, pattern) {
  const file = filePath.split(path.sep).join('/');
  const pat = pattern.split(path.sep).join('/');
  if (!isGlobLike(pat)) return file === pat;
  if (pat.endsWith('/**')) {
    const prefix = pat.slice(0, -3);
    return file === prefix || file.startsWith(`${prefix}/`);
  }

  const normalizedPattern = pat
    .replaceAll('**/', '§§DOUBLE_STAR_DIR§§')
    .replaceAll('/**', '§§DIR_DOUBLE_STAR§§')
    .replaceAll('**', '§§DOUBLE_STAR§§');

  const reSrc =
    '^' +
    escapeRegex(normalizedPattern)
      .replaceAll('\\*', '[^/]*')
      .replaceAll('\\?', '.')
      .replaceAll('§§DOUBLE_STAR_DIR§§', '(?:.*/)?')
      .replaceAll('§§DIR_DOUBLE_STAR§§', '(?:/.*)?')
      .replaceAll('§§DOUBLE_STAR§§', '.*') +
    '$';
  return new RegExp(reSrc).test(file);
}

async function walkProjectFiles(rootDir) {
  const out = [];
  const queue = [rootDir];

  while (queue.length > 0) {
    const current = queue.shift();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolutePath);
        continue;
      }
      if (entry.isFile()) out.push(absolutePath);
    }
  }

  return out;
}

function summarizeDiagnostics(diagnostics) {
  const errorCount = diagnostics.filter((diagnostic) => diagnostic.severity === 'error').length;
  const warningCount = diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length;
  return {
    total: diagnostics.length,
    errorCount,
    warningCount,
  };
}

function normalizePluginValidatorDiagnostics(result, { pluginName, validatorName, filePath }) {
  const diagnostics = Array.isArray(result)
    ? result
    : Array.isArray(result?.diagnostics)
      ? result.diagnostics
      : [];

  return diagnostics
    .filter((diagnostic) => diagnostic && typeof diagnostic === 'object')
    .map((diagnostic) => ({
      file: diagnostic.file ?? filePath,
      range: diagnostic.range,
      severity: diagnostic.severity ?? 'warning',
      code: String(diagnostic.code ?? 'pluginValidationIssue'),
      message: String(diagnostic.message ?? `Plugin validator reported an issue (${pluginName}/${validatorName}).`),
      tagName: diagnostic.tagName,
      attrName: diagnostic.attrName,
      hint: diagnostic.hint,
      plugin: pluginName,
      validator: validatorName,
    }));
}

function buildPluginPromptMessages(result, fallbackText) {
  if (result && typeof result === 'object' && Array.isArray(result.messages)) {
    return result;
  }
  return {
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: typeof result === 'string' ? result : fallbackText,
      },
    }],
  };
}

function buildPluginHandlerContext(plugin, loadJson, loadText) {
  return {
    plugin: { name: plugin.name, version: plugin.version },
    helpers: {
      loadJsonData: loadJson,
      loadTextData: loadText,
      buildJsonToolResponse,
      normalizePrefix,
      withPrefix,
      toCanonicalTagName,
    },
  };
}

function buildPluginResourceContents(resource, result) {
  if (result && typeof result === 'object' && Array.isArray(result.contents)) {
    return {
      ...result,
      contents: result.contents.map((item) => ({
        ...item,
        uri: String(item.uri),
      })),
    };
  }

  const mimeType = resource.mimeType ?? (typeof result === 'string' || typeof resource.text === 'string'
    ? 'text/plain'
    : 'application/json');
  const text = typeof result === 'string'
    ? result
    : typeof resource.text === 'string'
      ? resource.text
      : JSON.stringify(
          Object.prototype.hasOwnProperty.call(resource, 'payload') ? resource.payload : (result ?? {}),
          null,
          2,
        );

  return {
    contents: [{
      uri: String(resource.uri),
      mimeType,
      text,
    }],
  };
}

function buildPluginResourceErrorContents(resource, plugin, error) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    contents: [{
      uri: String(resource.uri),
      mimeType: 'text/plain',
      text: `Plugin resource failed (${plugin.name}/${resource.name}): ${message}`,
    }],
  };
}

function normalizePromptArgsSchema(schema) {
  if (!schema) return undefined;
  if (typeof schema === 'object' && !Array.isArray(schema)) {
    if (schema.shape && typeof schema.shape === 'object') return schema.shape;
    if (schema._def?.shape) {
      const shape = typeof schema._def.shape === 'function' ? schema._def.shape() : schema._def.shape;
      if (shape && typeof shape === 'object') return shape;
    }
    return schema;
  }
  return undefined;
}

function buildPluginResourceTemplateConfig(resourceTemplate) {
  const config = {};
  if (Array.isArray(resourceTemplate.list)) {
    config.list = async () => ({
      resources: resourceTemplate.list.map((uri) => ({
        uri,
        name: resourceTemplate.name,
        description: resourceTemplate.description,
      })),
    });
  }
  if (resourceTemplate.complete && typeof resourceTemplate.complete === 'object') {
    config.complete = Object.fromEntries(
      Object.entries(resourceTemplate.complete).map(([key, values]) => [
        key,
        async (input) => {
          const query = String(input ?? '').trim().toLowerCase();
          return (Array.isArray(values) ? values : [])
            .map((value) => String(value))
            .filter((value) => value.toLowerCase().startsWith(query));
        },
      ]),
    );
  }
  return config;
}

function buildFullPageHtmlFromImportMap({ html, title, importMapEntries, dir = 'vendor-runtime', lang = 'ja' }) {
  const importMapJson = JSON.stringify({ imports: importMapEntries }, null, 2);
  return [
    '<!DOCTYPE html>',
    `<html lang="${lang}">`,
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `  <title>${escapeHtmlTitle(title)}</title>`,
    `  <!-- distribution: selfHosted=true, strategy=vendor-importmap -->`,
    `  <!-- Do NOT replace these local paths with CDN URLs. This design system is self-hosted. -->`,
    `  <script type="importmap">`,
    `${importMapJson}`,
    `  </script>`,
    `  <script type="module" src="./${dir}/boot.js"></script>`,
    '</head>',
    '<body>',
    `  <noscript>このページの機能にはJavaScriptが必要です。</noscript>`,
    `  ${html}`,
    '</body>',
    '</html>',
  ].join('\n');
}

/**
 * Register all built-in tools, resources, and prompts on the MCP server.
 * @param {Object} context — shared data from createMcpServer
 */
export function registerAll(context) {
  const {
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
    loadValidator,
  } = context;

  const VENDOR_DIR = 'vendor-runtime';
  const PREFIX_STRIP_RE = /^[^-]+-/;
  let cachedSkillsRegistry = null;

  async function loadSkillsRegistrySafe() {
    if (cachedSkillsRegistry !== null) return cachedSkillsRegistry;
    try {
      const registry = await loadJsonData('skills-registry.json');
      cachedSkillsRegistry = registry;
      return registry;
    } catch {
      cachedSkillsRegistry = undefined;
      return undefined;
    }
  }

  async function collectMarkupDiagnostics({ filePath, text, prefix }) {
    const {
      validateTextAgainstCem,
      detectTokenMisuseInInlineStyles,
      detectAccessibilityMisuseInMarkup,
      detectEnumValueMisuse,
      detectInvalidSlotName,
      detectMissingRequiredAttributes,
      detectDuplicateIdsInMarkup,
      detectOrphanedChildComponents,
      detectEmptyInteractiveElement,
      detectNonLowercaseAttributes,
      detectCdnReferences,
      detectMissingRuntimeScaffold,
    } = await loadValidator();

    const p = normalizePrefix(prefix);
    let cemIndex = canonicalCemIndex;
    let enumMap = canonicalEnumMap;
    let slotMap = canonicalSlotMap;
    if (p !== CANONICAL_PREFIX) {
      cemIndex = mergeWithPrefixed(canonicalCemIndex, p);
      enumMap = mergeWithPrefixed(canonicalEnumMap, p);
      slotMap = mergeWithPrefixed(canonicalSlotMap, p);
    }

    const cemDiagnostics = validateTextAgainstCem({
      filePath,
      text,
      cem: cemIndex,
      severity: {
        unknownElement: 'error',
        unknownAttribute: 'warning',
      },
    });

    const enumDiagnostics = detectEnumValueMisuse({
      filePath,
      text,
      enumMap,
      severity: 'error',
    });

    const tokenMisuseDiagnostics = detectTokenMisuseInInlineStyles({
      filePath,
      text,
      valueToToken: tokenSuggestionMap,
      severity: 'warning',
    });

    const cemTagNames = new Set(cemIndex.keys());
    const accessibilityDiagnostics = detectAccessibilityMisuseInMarkup({
      filePath,
      text,
      severity: 'error',
      cemTagNames,
    }).map((diagnostic) => ({
      ...diagnostic,
      severity: ACCESSIBILITY_WARNING_CODES.has(diagnostic.code) ? 'warning' : diagnostic.severity,
    }));

    const slotDiagnostics = detectInvalidSlotName({
      filePath,
      text,
      slotMap,
      severity: 'error',
    });

    const requiredAttrDiagnostics = detectMissingRequiredAttributes({
      filePath,
      text,
      prefix: p,
      severity: 'error',
    });

    const duplicateIdDiagnostics = detectDuplicateIdsInMarkup({
      filePath,
      text,
      severity: 'error',
    });

    const orphanDiagnostics = detectOrphanedChildComponents({
      filePath,
      text,
      prefix: p,
      severity: 'warning',
    });

    const emptyInteractiveDiagnostics = detectEmptyInteractiveElement({
      filePath,
      text,
      prefix: p,
      severity: 'warning',
    });

    const lowercaseDiagnostics = detectNonLowercaseAttributes({
      filePath,
      text,
      cem: cemIndex,
      severity: 'warning',
    });

    const cdnDiagnostics = detectCdnReferences({
      filePath,
      text,
      severity: 'warning',
    });

    const scaffoldDiagnostics = detectMissingRuntimeScaffold({
      filePath,
      text,
      severity: 'warning',
    });

    const allRawDiagnostics = [
      ...cemDiagnostics,
      ...enumDiagnostics,
      ...slotDiagnostics,
      ...requiredAttrDiagnostics,
      ...duplicateIdDiagnostics,
      ...orphanDiagnostics,
      ...emptyInteractiveDiagnostics,
      ...lowercaseDiagnostics,
      ...tokenMisuseDiagnostics,
      ...accessibilityDiagnostics,
      ...cdnDiagnostics,
      ...scaffoldDiagnostics,
    ];

    for (const plugin of plugins) {
      const validators = Array.isArray(plugin.validators) ? plugin.validators : [];
      for (const validator of validators) {
        try {
          const pluginResult = await validator.handler(
            { filePath, text, prefix: p },
            buildPluginHandlerContext(plugin, loadJson, loadText),
          );
          allRawDiagnostics.push(
            ...normalizePluginValidatorDiagnostics(pluginResult, {
              pluginName: plugin.name,
              validatorName: validator.name,
              filePath,
            }),
          );
        } catch (error) {
          allRawDiagnostics.push({
            file: filePath,
            severity: 'warning',
            code: 'pluginValidatorRuntimeError',
            message: `Plugin validator failed (${plugin.name}/${validator.name}): ${error instanceof Error ? error.message : String(error)}`,
            hint: 'Check the plugin validator implementation.',
            plugin: plugin.name,
            validator: validator.name,
          });
        }
      }
    }

    return allRawDiagnostics.map((diagnostic) => ({
      file: diagnostic.file,
      range: diagnostic.range,
      severity: diagnostic.severity,
      code: diagnostic.code,
      message: diagnostic.message,
      tagName: diagnostic.tagName,
      attrName: diagnostic.attrName,
      hint: diagnostic.hint,
      suggestion: buildDiagnosticSuggestion({ diagnostic, cemIndex, prefix: p }),
      plugin: diagnostic.plugin,
      validator: diagnostic.validator,
    }));
  }

  // -----------------------------------------------------------------------
  // Prompt: figma_to_wcf
  // -----------------------------------------------------------------------
  server.registerPrompt(
    FIGMA_TO_WCF_PROMPT,
    {
      title: 'Figma To WCF',
      description:
        'Guided prompt for converting a Figma URL into WCF implementation steps with a strict tool order.',
      argsSchema: {
        figmaUrl: z.string().trim().url().describe('Figma URL (design or board link)'),
        userIntent: z.string().optional().describe('Optional implementation intent / screen purpose'),
      },
    },
    async ({ figmaUrl, userIntent }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: buildFigmaToWcfPromptText({ figmaUrl, userIntent }),
        },
      }],
    }),
  );

  // -----------------------------------------------------------------------
  // Resource: wcf://components
  // -----------------------------------------------------------------------
  server.registerResource(
    'wcf_components',
    WCF_RESOURCE_URIS.components,
    {
      title: 'WCF Component Catalog',
      description: 'Component catalog snapshot with categories and API entry points.',
      mimeType: 'application/json',
    },
    async () => {
      const payload = buildComponentsResourcePayload(indexes);
      return {
        contents: [{
          uri: WCF_RESOURCE_URIS.components,
          mimeType: 'application/json',
          text: JSON.stringify(payload, null, 2),
        }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Resource: wcf://tokens
  // -----------------------------------------------------------------------
  server.registerResource(
    'wcf_tokens',
    WCF_RESOURCE_URIS.tokens,
    {
      title: 'WCF Design Tokens',
      description: 'Token summary resource for colors, spacing, typography, radius, and shadows.',
      mimeType: 'application/json',
    },
    async () => {
      const result = buildTokensResourcePayload(designTokensData);
      const payload = result.isError ? { error: result.error } : result.payload;
      return {
        contents: [{
          uri: WCF_RESOURCE_URIS.tokens,
          mimeType: 'application/json',
          text: JSON.stringify(payload, null, 2),
        }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Resource: wcf://guidelines/{topic}
  // -----------------------------------------------------------------------
  server.registerResource(
    'wcf_guidelines',
    new ResourceTemplate(WCF_RESOURCE_URIS.guidelinesTemplate, {
      list: async () => ({
        resources: GUIDELINE_TOPICS.map((topic) => ({
          uri: `wcf://guidelines/${topic}`,
          name: `wcf guidelines (${topic})`,
          description: `Guideline summary for topic=${topic}`,
        })),
      }),
      complete: {
        topic: async (value) => {
          const query = String(value ?? '').trim().toLowerCase();
          return GUIDELINE_TOPICS.filter((topic) => topic.startsWith(query));
        },
      },
    }),
    {
      title: 'WCF Guidelines',
      description: 'Topic-scoped guideline resource (accessibility|css|patterns|all).',
      mimeType: 'application/json',
    },
    async (_uri, variables) => {
      const topic = String(variables?.topic ?? '').trim().toLowerCase();
      const result = buildGuidelinesResourcePayload(guidelinesIndexData, topic);
      if (result.isError) {
        throw new Error(`${result.error.code}: ${result.error.message}`);
      }
      return {
        contents: [{
          uri: `wcf://guidelines/${topic}`,
          mimeType: 'application/json',
          text: JSON.stringify(result.payload, null, 2),
        }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Resource: wcf://llms-full
  // -----------------------------------------------------------------------
  server.registerResource(
    'wcf_llms_full',
    WCF_RESOURCE_URIS.llmsFull,
    {
      title: 'WCF llms-full',
      description: 'LLM reference corpus for WCF usage, generated from repository docs.',
      mimeType: 'text/plain',
    },
    async () => {
      if (typeof llmsFullText !== 'string' || llmsFullText.length === 0) {
        throw new Error('LLMS_FULL_UNAVAILABLE: llms-full.txt is not available.');
      }
      return {
        contents: [{
          uri: WCF_RESOURCE_URIS.llmsFull,
          mimeType: 'text/plain',
          text: llmsFullText,
        }],
      };
    },
  );

  // -----------------------------------------------------------------------
  // Resource: wcf://skills
  // -----------------------------------------------------------------------
  server.registerResource(
    'wcf_skills',
    WCF_RESOURCE_URIS.skills,
    {
      title: 'WCF Skills Catalog',
      description: 'Registered Claude Code / Cursor / Codex skills from skills-registry.json.',
      mimeType: 'application/json',
    },
    async () => {
      const registry = await loadJsonData('skills-registry.json');
      if (!registry || !Array.isArray(registry.skills)) {
        throw new Error('SKILLS_REGISTRY_UNAVAILABLE: skills-registry.json is not available.');
      }
      const skills = registry.skills.map(normalizeSkillSummary);
      return {
        contents: [{
          uri: WCF_RESOURCE_URIS.skills,
          mimeType: 'application/json',
          text: JSON.stringify({ schemaVersion: registry.schemaVersion ?? 2, total: skills.length, skills }, null, 2),
        }],
      };
    },
  );

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
          version: PACKAGE_VERSION,
          prefix: detectedPrefix,
        totalComponents: indexes.decls.length,
        componentsByCategory: categoryCount,
        totalPatterns: patternList.length,
        patterns: patternList,
        setupInfo: {
          npmPackage: 'web-components-factory',
          installCommand: 'npm install web-components-factory',
          vendorRuntimePath: '<dir>/',
          htmlBoilerplate: [
            '<script type="importmap">',
            `{ "imports": { "${detectedPrefix}-button": "./<dir>/components/button.js" } }`,
            '</script>',
            '<script type="module" src="./<dir>/boot.js"></script>',
          ].join('\n'),
          noscriptGuidance: 'WCF components require JavaScript. Provide <noscript> fallback with static HTML equivalents for critical content.',
          noCDN: true,
          deliveryModel: 'vendor-local',
          distribution: {
            selfHosted: true,
            cdn: false,
            strategy: 'vendor-importmap',
            quickStart: 'npx web-components-factory init --prefix <prefix> --dir <dir>',
            description:
              'Components are installed locally via the wcf CLI. No CDN is available. All assets are served from the project directory using import maps and a boot script.',
          },
          importMapHint: `WCF uses <script type="importmap"> for module resolution. Each component tag name maps to a local JS file: { "${detectedPrefix}-<component>": "./<dir>/components/<component>.js" }. The wcf CLI generates importmap.snippet.json automatically via \`wcf init\`.`,
          bootScript: '<dir>/boot.js — sets the component prefix via setConfig(), then loads wc-autoloader.js which scans the DOM for custom element tags and dynamically imports them via the import map.',
          detectedPrefix,
          vendorSetup: {
            init: `wcf init --prefix ${detectedPrefix} --dir <dir>`,
            add: `wcf add <componentId> --prefix ${detectedPrefix} --out <dir>`,
            workflow: '1. wcf init で初期化（boot.js, importmap.snippet.json, autoloader を生成） → 2. wcf add で各コンポーネントを追加 → import map と boot.js が自動生成される',
          },
          htmlSetup: [
            '<script type="importmap">',
            '{',
            '  "imports": {',
            `    "${detectedPrefix}-button": "./<dir>/components/button.js",`,
            `    "${detectedPrefix}-card": "./<dir>/components/card.js"`,
            '  }',
            '}',
            '</script>',
            '<script type="module" src="./<dir>/boot.js"></script>',
          ].join('\n'),
        },
        ideSetupTemplates: IDE_SETUP_TEMPLATES,
        availablePrompts: [
          {
            name: FIGMA_TO_WCF_PROMPT,
            purpose: 'Figma-to-WCF conversion workflow prompt',
          },
        ],
        availableResources: [
          { uri: WCF_RESOURCE_URIS.components, purpose: 'Component catalog snapshot' },
          { uri: WCF_RESOURCE_URIS.tokens, purpose: 'Token summary snapshot' },
          { uri: WCF_RESOURCE_URIS.guidelinesTemplate, purpose: 'Topic-based guideline summaries' },
          { uri: WCF_RESOURCE_URIS.llmsFull, purpose: 'Full LLM reference text for WCF' },
          { uri: WCF_RESOURCE_URIS.skills, purpose: 'Skills catalog snapshot' },
        ],
        availableTools: [
          { name: 'get_design_system_overview', purpose: 'This overview (start here)' },
          { name: 'list_components', purpose: 'Browse components with progressive disclosure and filters' },
          { name: 'search_icons', purpose: 'Search icon names and usage examples' },
          { name: 'get_component_api', purpose: 'Full API surface for a single component' },
          { name: 'generate_usage_snippet', purpose: 'Minimal HTML usage example' },
          { name: 'get_install_recipe', purpose: 'Installation instructions and dependency tree' },
          { name: 'validate_markup', purpose: 'Validate HTML against CEM schema' },
          { name: 'validate_files', purpose: 'Validate multiple markup files and aggregate diagnostics' },
          { name: 'validate_project', purpose: 'Validate a project directory using include/exclude globs' },
          { name: 'generate_full_page_html', purpose: 'Wrap HTML fragment into a complete page with importmap and boot script' },
          { name: 'list_patterns', purpose: 'Browse page-level UI composition patterns' },
          { name: 'get_pattern_recipe', purpose: 'Full pattern recipe with dependencies and HTML' },
          { name: 'generate_pattern_snippet', purpose: 'Pattern HTML snippet only' },
          { name: 'get_design_tokens', purpose: 'Query design tokens (colors, spacing, typography, radius, shadows)' },
          { name: 'get_design_token_detail', purpose: 'Get details, relationships, and usage examples for one token' },
          { name: 'get_accessibility_docs', purpose: 'Search component-level accessibility checklist and WCAG-filtered guidance' },
          { name: 'search_guidelines', purpose: 'Search design system guidelines and best practices' },
          { name: 'search_design_system_knowledge', purpose: 'Search across components, patterns, guidelines, tokens, and skills' },
          { name: 'get_component_selector_guide', purpose: 'Component selection guide by category and use case' },
        ],
        recommendedWorkflow: [
          '1. get_design_system_overview → understand components, patterns, tokens, and IDE setup templates',
          '2. figma_to_wcf (optional) → bootstrap the Figma-to-WCF tool sequence',
          '3. search_design_system_knowledge → do a broad first-pass search across components, patterns, tokens, guidelines, and skills',
          '4. wcf://components and wcf://tokens resources → preload catalog/token context',
          '5. search_guidelines → find relevant guidelines',
          '6. get_design_tokens → get correct token values',
          '7. get_design_token_detail → inspect one token with references/referencedBy and usage examples',
          '8. get_accessibility_docs → fetch component-level accessibility checklist',
          '9. list_components (category/query + pagination) → shortlist components',
          '10. search_icons (optional) → find icon names quickly',
          '11. get_component_api → check attributes, slots, events, CSS parts',
          '12. generate_usage_snippet or get_pattern_recipe → get code',
          '13. validate_markup / validate_files / validate_project → verify your HTML and use suggestions to self-correct',
          '14. generate_full_page_html → wrap fragment into a complete preview-ready page',
          '15. get_install_recipe → get import/install instructions',
        ],
        experimental: {
          plugins: {
            enabled: plugins.length > 0,
            note: PLUGIN_TOOL_NOTICE,
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

      return buildJsonToolResponse(overview);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: list_components
  // -----------------------------------------------------------------------
  server.registerTool(
    'list_components',
    {
      description:
        'List custom elements in the design system. When: exploring available components, searching by keyword, or paging through results. Returns: {items, total, limit, offset, hasMore} where items is array of {tagName, className, description, category}. After: use get_component_api for details on a specific component.',
      inputSchema: {
        category: z
          .enum(['Form', 'Actions', 'Navigation', 'Content', 'Display', 'Layout', 'Other'])
          .optional()
          .describe('Filter by component category'),
        query: z.string().optional().describe('Search by tagName/className/description/category/modulePath'),
        limit: z.number().int().min(1).max(200).optional().describe('Maximum items to return (default: 20; set 200 for all results)'),
        offset: z.number().int().min(0).optional().describe('Pagination offset (default: 0)'),
        prefix: z.string().optional(),
        patternId: z.string().optional().describe('Filter to components required by this pattern'),
        sort: z.enum(['default', 'frequency']).optional().describe('Sort order: "default" (CEM declaration order) or "frequency" (pattern usage count, descending)'),
      },
    },
    async ({ category, query, limit, offset, prefix, patternId, sort }) => {
      const page = buildComponentSummaries(indexes, { category, query, limit, offset, prefix, patternId, sort, patterns, installRegistry, patternFrequency });
      const payload = {
        items: page.items,
        total: page.total,
        limit: page.limit,
        offset: page.offset,
        hasMore: page.hasMore,
      };
      if (page._notice) payload._notice = page._notice;
      return buildJsonToolResponse(payload);
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
      return buildJsonToolResponse(payload);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_component_api
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_component_api',
    {
      description:
        'Get the full API surface of one or more components (attributes, slots, events, CSS parts, CSS custom properties). When: you need detailed specs for components. Returns: complete component specification (single object or array for batch). After: use generate_usage_snippet for a code example.',
      inputSchema: {
        tagName: z.string().optional().describe('Tag name (e.g., "dads-button")'),
        className: z.string().optional().describe('Class name (e.g., "DadsButton")'),
        component: z.string().optional().describe('Any identifier: tagName, className, or bare name (e.g., "button")'),
        components: z.array(z.string()).max(10).optional().describe('Batch: array of component identifiers (max 10). When provided, component/tagName/className are ignored.'),
        prefix: z.string().optional(),
      },
    },
    async ({ tagName, className, component, components, prefix }) => {
      const p = normalizePrefix(prefix);

      // Batch mode: components array takes priority (DD-23)
      if (Array.isArray(components) && components.length > 0) {
        const results = [];
        for (const comp of components) {
          const resolved = resolveDeclByComponent(indexes, comp, p);
          if (!resolved?.decl) {
            results.push({ component: comp, error: `Component not found: ${comp}` });
            continue;
          }
          const { decl: d, modulePath: mp } = resolved;
          const cTag = typeof d.tagName === 'string' ? d.tagName.toLowerCase() : undefined;
          const mPath = mp ?? (cTag ? indexes.modulePathByTag.get(cTag) : undefined);
          const api = serializeApi(d, mPath, prefix);
          const related = getRelatedComponentsForTag({
            canonicalTagName: cTag,
            installRegistry,
            relatedMap: relatedComponentMap,
            prefix,
          });
          if (related.length > 0) api.relatedComponents = related;
          const a11y = extractAccessibilityChecklist(d, { prefix });
          if (a11y) api.accessibilityChecklist = a11y;
          results.push(api);
        }
        return buildJsonToolResponse(results);
      }

      // Single mode (existing behavior)
      let decl;
      let modulePath;

      if (component) {
        const resolved = resolveDeclByComponent(indexes, component, p);
        decl = resolved?.decl;
        modulePath = resolved?.modulePath;
      } else {
        decl = pickDecl(indexes, { tagName, className, prefix: p });
      }

      if (!decl) {
        const identifier = component || tagName || className || '';
        return buildComponentNotFoundError(identifier, indexes, p);
      }

      const canonicalTag = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
      if (!modulePath) {
        modulePath = canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : undefined;
      }
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
      const interactionExamples = canonicalTag ? INTERACTION_EXAMPLES_MAP[canonicalTag] : undefined;
      if (interactionExamples) {
        api.interactionExamples = interactionExamples;
      }
      const layoutBehavior = canonicalTag ? LAYOUT_BEHAVIOR_MAP[canonicalTag] : undefined;
      if (layoutBehavior) {
        api.layoutBehavior = layoutBehavior;
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
      const p = normalizePrefix(prefix);
      const resolved = resolveDeclByComponent(indexes, component, p);
      const decl = resolved?.decl;

      if (!decl) {
        return buildComponentNotFoundError(component, indexes, p);
      }

      const canonicalTag = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
      const modulePath = resolved?.modulePath ?? (canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : undefined);
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
          content: [{ type: 'text', text: 'Install metadata not found in CEM.' }],
          isError: true,
        };
      }

      const componentId = String(install.id ?? '').trim() || api?.custom?.componentId;
      const define = String(install.define ?? '').trim();
      const deps = Array.isArray(install.deps) ? install.deps : [];
      const tags = Array.isArray(install.tags) ? install.tags : [];

      const transitiveDeps = componentId
        ? resolveComponentClosure({ installRegistry }, [componentId]).filter((id) => id !== componentId)
        : [];

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

      return buildJsonToolResponse({
        componentId,
        tagNames,
        deps,
        transitiveDeps,
        define,
        defineHint,
        source: install.source,
        usageSnippet,
        usageContext: 'body-only',
        installHint: componentId ? `wcf add ${componentId}` : undefined,
        vendorHint: (() => {
          const im = tagNames.length > 0
            ? JSON.stringify({ imports: Object.fromEntries(tagNames.map((t) => [t, `./<dir>/components/${t.replace(PREFIX_STRIP_RE, '')}.js`])) })
            : undefined;
          return {
            install: componentId ? `wcf add ${componentId} --prefix <prefix> --out <dir>` : undefined,
            importMap: im,
            importmap: im,
            boot: '<dir>/boot.js -- loads autoloader that registers components via import map',
          };
        })(),
      });
    },
  );

  // -----------------------------------------------------------------------
  // Tool: validate_markup
  // -----------------------------------------------------------------------
  server.registerTool(
    'validate_markup',
    {
      description:
        'Validate HTML against the design system Custom Elements Manifest. When: checking generated or written HTML for correctness. Returns: diagnostics array with errors (unknown elements/invalid enum values/invalid slot names/missing required attributes), warnings (unknown attributes/token misuse/accessibility misuse/orphaned children/empty interactive elements), and optional suggestion text for quick recovery. Use after generating HTML to catch mistakes.',
      inputSchema: {
        html: z.string(),
        prefix: z.string().optional(),
      },
    },
    async ({ html, prefix }) => {
      const diagnostics = await collectMarkupDiagnostics({
        filePath: '<markup>',
        text: html,
        prefix,
      });
      return buildJsonToolResponse({ diagnostics });
    },
  );

  // -----------------------------------------------------------------------
  // Tool: validate_files
  // -----------------------------------------------------------------------
  server.registerTool(
    'validate_files',
    {
      description:
        'Validate multiple markup files in one call. When: checking a page, template set, or small project for design-system issues. Returns: per-file diagnostics plus aggregate counts. After: fix the reported files or re-run validate_markup on a specific snippet.',
      inputSchema: {
        files: z.array(z.object({
          path: z.string().min(1).describe('File path label. If content is omitted, this path is read from disk.'),
          content: z.string().optional().describe('Optional markup content. When present, skips disk read.'),
        })).min(1).max(50),
        prefix: z.string().optional(),
      },
    },
    async ({ files, prefix }) => {
      const perFile = [];
      const fileErrors = [];

      for (const entry of files) {
        const filePath = String(entry?.path ?? '').trim();
        if (!filePath) continue;

        let text;
        if (typeof entry?.content === 'string') {
          text = entry.content;
        } else {
          try {
            text = await fs.readFile(filePath, 'utf8');
          } catch (error) {
            fileErrors.push({
              path: filePath,
              message: error instanceof Error ? error.message : String(error),
            });
            continue;
          }
        }

        const diagnostics = await collectMarkupDiagnostics({
          filePath,
          text,
          prefix,
        });
        perFile.push({
          path: filePath,
          counts: summarizeDiagnostics(diagnostics),
          diagnostics,
        });
      }

      if (perFile.length === 0 && fileErrors.length > 0) {
        return buildJsonToolErrorResponse({
          error: {
            code: 'FILE_READ_ERROR',
            message: 'No files could be validated.',
          },
          fileErrors,
        });
      }

      const allDiagnostics = perFile.flatMap((file) => file.diagnostics);
      const counts = summarizeDiagnostics(allDiagnostics);

      return buildJsonToolResponse({
        summary: {
          filesRequested: files.length,
          filesValidated: perFile.length,
          fileErrorCount: fileErrors.length,
          filesWithErrors: perFile.filter((file) => file.counts.errorCount > 0).length,
          filesWithWarnings: perFile.filter((file) => file.counts.warningCount > 0).length,
          ...counts,
        },
        fileErrors,
        files: perFile,
      });
    },
  );

  // -----------------------------------------------------------------------
  // Tool: validate_project
  // -----------------------------------------------------------------------
  server.registerTool(
    'validate_project',
    {
      description:
        'Validate a project directory with include/exclude globs. When: checking a template folder, static site, or small app slice for design-system issues. Returns: matched files, file-level diagnostics, and aggregate counts. After: narrow down with validate_files or validate_markup for targeted fixes.',
      inputSchema: {
        root: z.string().min(1).describe('Project or template root directory to scan'),
        include: z.array(z.string()).optional().describe('Glob patterns to include (default: **/*.html, **/*.htm, **/*.njk, **/*.liquid, **/*.astro, **/*.twig, **/*.hbs)'),
        exclude: z.array(z.string()).optional().describe('Glob patterns to exclude'),
        maxFiles: z.number().int().min(1).max(500).optional().describe('Maximum files to validate (default: 200)'),
        prefix: z.string().optional(),
      },
    },
    async ({ root, include, exclude, maxFiles, prefix }) => {
      const rootDir = path.resolve(String(root ?? '').trim());
      const includePatterns = Array.isArray(include) && include.length > 0
        ? include
        : ['**/*.html', '**/*.htm', '**/*.njk', '**/*.liquid', '**/*.astro', '**/*.twig', '**/*.hbs'];
      const excludePatterns = Array.isArray(exclude) && exclude.length > 0
        ? exclude
        : ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/coverage/**'];
      const limit = Number.isInteger(maxFiles) ? maxFiles : 200;

      let allFiles;
      try {
        allFiles = await walkProjectFiles(rootDir);
      } catch (error) {
        return buildJsonToolErrorResponse({
          error: {
            code: 'PROJECT_READ_ERROR',
            message: error instanceof Error ? error.message : String(error),
          },
          root: rootDir,
        });
      }

      const matched = [];
      for (const absolutePath of allFiles) {
        const relativePath = path.relative(rootDir, absolutePath).split(path.sep).join('/');
        const included = includePatterns.some((pattern) => matchesGlobPattern(relativePath, pattern));
        const excluded = excludePatterns.some((pattern) => matchesGlobPattern(relativePath, pattern));
        if (!included || excluded) continue;
        matched.push({ absolutePath, relativePath });
        if (matched.length >= limit) break;
      }

      const files = matched.map((entry) => ({ path: entry.absolutePath }));
      const result = await (async () => {
        const perFile = [];
        const fileErrors = [];

        for (const entry of matched) {
          let text;
          try {
            text = await fs.readFile(entry.absolutePath, 'utf8');
          } catch (error) {
            fileErrors.push({
              path: entry.absolutePath,
              message: error instanceof Error ? error.message : String(error),
            });
            continue;
          }

          const diagnostics = await collectMarkupDiagnostics({
            filePath: entry.absolutePath,
            text,
            prefix,
          });
          perFile.push({
            path: entry.absolutePath,
            relativePath: entry.relativePath,
            counts: summarizeDiagnostics(diagnostics),
            diagnostics,
          });
        }

        const allDiagnostics = perFile.flatMap((file) => file.diagnostics);
        return {
          summary: {
            root: rootDir,
            filesScanned: allFiles.length,
            filesMatched: matched.length,
            filesValidated: perFile.length,
            fileErrorCount: fileErrors.length,
            truncated: matched.length >= limit && allFiles.length > matched.length,
            ...summarizeDiagnostics(allDiagnostics),
          },
          fileErrors,
          files: perFile,
        };
      })();

      if (result.files.length === 0 && result.fileErrors.length > 0) {
        return buildJsonToolErrorResponse({
          error: {
            code: 'PROJECT_VALIDATION_EMPTY',
            message: 'No project files could be validated.',
          },
          root: rootDir,
          fileErrors: result.fileErrors,
        });
      }

      return buildJsonToolResponse(result);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: generate_full_page_html
  // -----------------------------------------------------------------------
  server.registerTool(
    'generate_full_page_html',
    {
      description:
        'Generate a complete, self-contained HTML page from a component HTML fragment. When: you need a preview-ready full page with <!DOCTYPE html>, importmap, and boot script. Returns: { fullHtml, componentCount, importMapEntries }. After: save to a .html file and open via a local HTTP server.',
      inputSchema: {
        html: z.string().describe('HTML fragment containing WCF custom elements'),
        prefix: z.string().optional().describe('Component prefix (default: auto-detected)'),
      },
    },
    async ({ html, prefix }) => {
      const p = normalizePrefix(prefix);
      let ci = canonicalCemIndex;
      if (p !== CANONICAL_PREFIX) {
        ci = mergeWithPrefixed(canonicalCemIndex, p);
      }

      const { fullHtml, importEntries } = buildFullPageHtml({ html, prefix: p, cemIndex: ci });

      return buildJsonToolResponse({
        fullHtml,
        componentCount: Object.keys(importEntries).length,
        importMapEntries: importEntries,
      });
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_component_selector_guide
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_component_selector_guide',
    {
      description:
        'Get a component selection guide organized by UI category and use case. When: deciding which component to use for a UI requirement. Returns: categories with recommended components and use cases. After: use get_component_api for the selected component details.',
      inputSchema: {
        category: z.string().optional().describe('Filter by category key (e.g., "Form", "Navigation", "Layout")'),
        useCase: z.string().optional().describe('Search by use-case keyword (e.g., "date", "login", "upload")'),
      },
    },
    async ({ category, useCase }) => {
      if (!context.selectorGuideData || !Array.isArray(context.selectorGuideData.categories)) {
        return buildJsonToolErrorResponse({
          error: 'Component selector guide not available.',
        });
      }

      let categories = context.selectorGuideData.categories;

      if (typeof category === 'string' && category.trim()) {
        const cat = category.trim().toLowerCase();
        categories = categories.filter((c) => c.key.toLowerCase() === cat);
      }

      if (typeof useCase === 'string' && useCase.trim()) {
        const kw = useCase.trim().toLowerCase();
        categories = categories.map((c) => ({
          ...c,
          components: c.components.filter((comp) =>
            comp.useCase.toLowerCase().includes(kw) ||
            comp.id.toLowerCase().includes(kw) ||
            comp.tagName.toLowerCase().includes(kw)
          ),
        })).filter((c) => c.components.length > 0);
      }

      return buildJsonToolResponse({
        totalCategories: categories.length,
        categories: categories.map((c) => ({
          key: c.key,
          label: c.label,
          description: c.description,
          components: c.components,
        })),
      });
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

      return buildJsonToolResponse(list);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: get_pattern_recipe
  // -----------------------------------------------------------------------
  server.registerTool(
    'get_pattern_recipe',
    {
      description:
        'Get a complete pattern recipe with component dependencies and HTML. When: building a page layout from a pattern. Returns: dependency tree, install commands, and resolved HTML. After: use validate_markup to verify the generated HTML. Use include: ["fullPage"] to get a complete HTML5 page ready for browser rendering.',
      inputSchema: {
        patternId: z.string(),
        prefix: z.string().optional(),
        include: z.array(z.enum(['fullPage'])).optional(),
      },
    },
    async ({ patternId, prefix, include }) => {
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

      const entryHints = Array.isArray(pat.entryHints) ? [...pat.entryHints] : ['boot'];

      const importMapEntries = buildImportMapEntries(closure, components, p, '<dir>', PREFIX_STRIP_RE);

      const scaffoldHint = {
        doctype: '<!DOCTYPE html>',
        importMap: `<script type="importmap">\n${JSON.stringify({ imports: importMapEntries }, null, 2)}\n</script>`,
        bootScript: '<script type="module" src="./<dir>/boot.js"></script>',
        noscript: '<noscript>このページの機能にはJavaScriptが必要です。</noscript>',
        serveOverHttp: 'Import maps require HTTP/HTTPS. Use a local dev server (e.g. npx serve .) instead of opening the HTML file directly via file:// protocol.',
      };

      const includeArr = Array.isArray(include) ? include : [];
      let fullPageHtml;
      if (includeArr.includes('fullPage')) {
        const resolvedImportMap = buildImportMapEntries(closure, components, p, VENDOR_DIR, PREFIX_STRIP_RE);
        fullPageHtml = buildFullPageHtmlFromImportMap({
          html,
          title: pat.title ?? pat.id,
          importMapEntries: resolvedImportMap,
        });
      }

      const result = {
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
        entryHints,
        scaffoldHint,
        behavior: typeof pat.behavior === 'string' ? pat.behavior : undefined,
      };

      if (fullPageHtml !== undefined) {
        result.fullPageHtml = fullPageHtml;
        result.vendorSetup = {
          command: `npx web-components-factory init --prefix ${p} --dir ${VENDOR_DIR} && npx web-components-factory add ${closure.join(' ')} --prefix ${p} --out ${VENDOR_DIR}`,
        };
      }

      return buildJsonToolResponse(result);
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
          .describe('Theme filter (currently light only; dark is unsupported and all returns available themes)'),
      },
    },
    async ({ type, category, query, theme }) => {
      const { isError, payload } = buildDesignTokensPayload(designTokensData, { type, category, query, theme });
      if (isError) {
        return buildJsonToolErrorResponse(payload);
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
          .describe('Theme filter (currently light only; dark is unsupported and all returns available themes)'),
      },
    },
    async ({ name, theme }) => {
      const { isError, payload } = buildDesignTokenDetailPayload(designTokensData, name, theme);
      if (isError) {
        return buildJsonToolErrorResponse(payload);
      }
      const normalizedName = normalizeTokenIdentifier(name);
      const componentRefs = componentTokenRefMap.get(normalizedName);
      if (componentRefs && componentRefs.size > 0) {
        payload.componentReferencedBy = [...componentRefs].sort();
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
      const expandedTerms = expandQueryWithSynonyms(q);

      const results = [];

      for (const doc of documents) {
        if (topic && topic !== 'all' && doc.topic !== topic) continue;

        const sections = Array.isArray(doc.sections) ? doc.sections : [];
        for (const section of sections) {
          let score = 0;
          const heading = String(section.heading ?? '').toLowerCase();
          const keywords = Array.isArray(section.keywords) ? section.keywords : [];
          const snippet = String(section.snippet ?? '').toLowerCase();
          const body = String(section.body ?? '').toLowerCase();

          if (heading.includes(q)) score += 3;

          for (const kw of keywords) {
            if (String(kw).toLowerCase().includes(q)) {
              score += 2;
              break;
            }
          }

          if (snippet.includes(q)) score += 1;

          if (body && body.includes(q)) {
            score += 1;
            let idx = body.indexOf(q);
            let occurrences = 0;
            while (idx !== -1 && occurrences < 3) {
              occurrences++;
              idx = body.indexOf(q, idx + q.length);
            }
            if (occurrences > 1) score += Math.min(occurrences - 1, 2);
          }

          if (expandedTerms.length > 1) {
            let synScore = 0;
            const lowerKeywords = keywords.map((kw) => String(kw).toLowerCase());
            for (let i = 1; i < expandedTerms.length && synScore < 2; i++) {
              const syn = expandedTerms[i];
              if (heading.includes(syn)) { synScore += 1; continue; }
              if (snippet.includes(syn) || body.includes(syn)) { synScore += 1; continue; }
              for (const kw of lowerKeywords) {
                if (kw.includes(syn)) {
                  synScore += 1;
                  break;
                }
              }
            }
            score += synScore;
          }

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

      results.sort((a, b) => b.score - a.score);
      const topResults = results.slice(0, max);

      const payload = {
        query,
        topic: topic ?? 'all',
        totalHits: results.length,
        results: topResults,
      };

      if (results.length === 0) {
        const synonymExpansions = expandedTerms.filter((t) => t !== q);
        payload.suggestions = {
          alternativeQueries: synonymExpansions.length > 0 ? synonymExpansions : [],
          alternativeTools: [
            { tool: 'get_accessibility_docs', hint: 'For component-specific a11y checks' },
            { tool: 'get_component_api', hint: 'For component API details' },
          ],
        };
      }

      return buildJsonToolResponse(payload);
    },
  );

  // -----------------------------------------------------------------------
  // Tool: search_design_system_knowledge
  // -----------------------------------------------------------------------
  server.registerTool(
    'search_design_system_knowledge',
    {
      description:
        'Search across components, patterns, guidelines, tokens, and skills in one call. When: you want a broad first-pass query before choosing a more specific tool. Returns: ranked source-qualified results with source, id, title, description/snippet, and score. After: follow up with the source-specific tool such as get_component_api, get_pattern_recipe, get_design_token_detail, search_guidelines, or the wcf://skills resource.',
      inputSchema: {
        query: z.string().describe('Search text for broad design-system discovery'),
        sources: z.array(z.enum(['components', 'patterns', 'guidelines', 'tokens', 'skills'])).optional()
          .describe('Optional source filters'),
        maxResults: z.number().int().min(1).max(50).optional()
          .describe('Maximum results to return (default: 10)'),
        prefix: z.string().optional(),
      },
    },
    async ({ query, sources, maxResults, prefix }) => {
      const requestedSources = Array.isArray(sources) && sources.length > 0
        ? new Set(sources)
        : new Set(['components', 'patterns', 'guidelines', 'tokens', 'skills']);
      const p = normalizePrefix(prefix);
      const q = String(query ?? '').trim().toLowerCase();
      const terms = expandQueryWithSynonyms(q).filter(Boolean);
      const limit = Number.isInteger(maxResults) ? maxResults : 10;
      const results = [];

      if (requestedSources.has('components')) {
        const page = buildComponentSummaries(indexes, {
          query: q,
          limit: 200,
          prefix: p,
        });
        for (const item of page.items) {
          const score = scoreSearchFields(q, terms, [
            { text: item.tagName, weight: 5 },
            { text: item.className, weight: 4 },
            { text: item.description, weight: 2 },
            { text: item.category, weight: 1 },
          ]);
          if (score <= 0) continue;
          results.push({
            source: 'components',
            id: item.tagName,
            title: item.tagName,
            description: item.description ?? '',
            metadata: {
              className: item.className,
              category: item.category,
            },
            score: score + getKnowledgeSourceBoost('components', q, terms),
          });
        }
      }

      if (requestedSources.has('patterns')) {
        for (const pattern of Object.values(patterns)) {
          const score = scoreSearchFields(q, terms, [
            { text: pattern?.id, weight: 5 },
            { text: pattern?.title, weight: 4 },
            { text: pattern?.description, weight: 3 },
            { text: Array.isArray(pattern?.requires) ? pattern.requires.join(' ') : '', weight: 1 },
            { text: pattern?.behavior, weight: 1 },
          ]);
          if (score <= 0) continue;
          results.push({
            source: 'patterns',
            id: String(pattern?.id ?? ''),
            title: String(pattern?.title ?? pattern?.id ?? ''),
            description: String(pattern?.description ?? ''),
            metadata: {
              requires: Array.isArray(pattern?.requires) ? pattern.requires : [],
            },
            score: score + getKnowledgeSourceBoost('patterns', q, terms),
          });
        }
      }

      if (requestedSources.has('guidelines') && Array.isArray(guidelinesIndexData?.documents)) {
        for (const doc of guidelinesIndexData.documents) {
          const sections = Array.isArray(doc?.sections) ? doc.sections : [];
          for (const section of sections) {
            const score = scoreSearchFields(q, terms, [
              { text: doc?.title, weight: 3 },
              { text: doc?.topic, weight: 1 },
              { text: section?.heading, weight: 4 },
              { text: Array.isArray(section?.keywords) ? section.keywords.join(' ') : '', weight: 2 },
              { text: section?.snippet, weight: 2 },
              { text: section?.body, weight: 1 },
            ]);
            if (score <= 0) continue;
            results.push({
              source: 'guidelines',
              id: `${String(doc?.id ?? '')}:${String(section?.heading ?? '')}`,
              title: String(section?.heading ?? doc?.title ?? ''),
              description: String(section?.snippet ?? ''),
              metadata: {
                documentId: String(doc?.id ?? ''),
                topic: String(doc?.topic ?? ''),
                startLine: section?.startLine,
              },
              score: score + getKnowledgeSourceBoost('guidelines', q, terms),
            });
          }
        }
      }

      if (requestedSources.has('tokens') && Array.isArray(designTokensData?.tokens)) {
        for (const token of designTokensData.tokens) {
          const score = scoreSearchFields(q, terms, [
            { text: token?.name, weight: 5 },
            { text: token?.cssVariable, weight: 4 },
            { text: token?.type, weight: 2 },
            { text: token?.category, weight: 2 },
            { text: token?.value, weight: 1 },
          ]);
          if (score <= 0) continue;
          results.push({
            source: 'tokens',
            id: String(token?.name ?? ''),
            title: String(token?.name ?? ''),
            description: `${String(token?.type ?? '')}/${String(token?.category ?? '')}: ${String(token?.value ?? '')}`,
            metadata: {
              cssVariable: String(token?.cssVariable ?? ''),
              group: token?.group ?? null,
            },
            score: score + getKnowledgeSourceBoost('tokens', q, terms),
          });
        }
      }

      if (requestedSources.has('skills')) {
        const skillsRegistry = await loadSkillsRegistrySafe();
        const skills = Array.isArray(skillsRegistry?.skills) ? skillsRegistry.skills : [];
        for (const skill of skills) {
          const score = scoreSearchFields(q, terms, [
            { text: skill?.name, weight: 5 },
            { text: skill?.description, weight: 3 },
            { text: Array.isArray(skill?.tags) ? skill.tags.join(' ') : '', weight: 2 },
            { text: Array.isArray(skill?.clients) ? skill.clients.join(' ') : '', weight: 1 },
          ]);
          if (score <= 0) continue;
          results.push({
            source: 'skills',
            id: String(skill?.name ?? ''),
            title: String(skill?.name ?? ''),
            description: String(skill?.description ?? ''),
            metadata: {
              status: String(skill?.status ?? 'active'),
              tags: Array.isArray(skill?.tags) ? skill.tags : [],
            },
            score: score + getKnowledgeSourceBoost('skills', q, terms),
          });
        }
      }

      results.sort((left, right) =>
        right.score - left.score ||
        left.source.localeCompare(right.source) ||
        left.title.localeCompare(right.title)
      );

      const topResults = selectKnowledgeResults(results, limit, requestedSources).map((result) => ({
        ...result,
        followUp: buildKnowledgeFollowUp(result),
      }));
      return buildJsonToolResponse({
        query,
        sources: [...requestedSources],
        totalHits: results.length,
        results: topResults,
        suggestions: results.length === 0 ? {
          alternativeTools: [
            { tool: 'list_components', hint: 'Browse component inventory directly' },
            { tool: 'search_guidelines', hint: 'Search guidelines with a narrower query' },
            { tool: 'get_design_tokens', hint: 'Inspect tokens by type/category instead of free text' },
          ],
        } : undefined,
      });
    },
  );

  // -----------------------------------------------------------------------
  // Plugin tools registration
  // -----------------------------------------------------------------------
  for (const plugin of plugins) {
    const pluginPrompts = Array.isArray(plugin.prompts) ? plugin.prompts : [];
    for (const prompt of pluginPrompts) {
      server.registerPrompt(
        prompt.name,
        {
          title: prompt.title,
          description: prompt.description,
          argsSchema: normalizePromptArgsSchema(prompt.argsSchema),
        },
        async (args) => {
          try {
            if (typeof prompt.handler === 'function') {
              const result = await prompt.handler(args, buildPluginHandlerContext(plugin, loadJson, loadText));
              return buildPluginPromptMessages(result, prompt.text ?? `Prompt from ${plugin.name}`);
            }
            return buildPluginPromptMessages(prompt.text ?? `Prompt from ${plugin.name}`, prompt.text ?? '');
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return buildPluginPromptMessages(`Plugin prompt failed (${prompt.name}): ${message}`, '');
          }
        },
      );
    }

    const pluginResources = Array.isArray(plugin.resources) ? plugin.resources : [];
    for (const resource of pluginResources) {
      server.registerResource(
        resource.name,
        resource.uri,
        {
          title: resource.title,
          description: resource.description,
          mimeType: resource.mimeType ?? undefined,
        },
        async () => {
          try {
            if (typeof resource.handler === 'function') {
              const result = await resource.handler(buildPluginHandlerContext(plugin, loadJson, loadText));
              return buildPluginResourceContents(resource, result);
            }
            return buildPluginResourceContents(resource, undefined);
          } catch (error) {
            return buildPluginResourceErrorContents(resource, plugin, error);
          }
        },
      );
    }

    const pluginResourceTemplates = Array.isArray(plugin.resourceTemplates) ? plugin.resourceTemplates : [];
    for (const resourceTemplate of pluginResourceTemplates) {
      server.registerResource(
        resourceTemplate.name,
        new ResourceTemplate(resourceTemplate.uriTemplate, buildPluginResourceTemplateConfig(resourceTemplate)),
        {
          title: resourceTemplate.title,
          description: resourceTemplate.description,
          mimeType: resourceTemplate.mimeType ?? undefined,
        },
        async (_uri, variables) => {
          try {
            if (typeof resourceTemplate.handler === 'function') {
              const result = await resourceTemplate.handler(
                { uri: _uri, variables },
                buildPluginHandlerContext(plugin, loadJson, loadText),
              );
              return buildPluginResourceContents(
                { ...resourceTemplate, uri: _uri },
                result,
              );
            }
            return buildPluginResourceContents(
              { ...resourceTemplate, uri: _uri },
              undefined,
            );
          } catch (error) {
            return buildPluginResourceErrorContents(
              { ...resourceTemplate, uri: _uri },
              plugin,
              error,
            );
          }
        },
      );
    }

    const pluginTools = Array.isArray(plugin.tools) ? plugin.tools : [];
    for (const tool of pluginTools) {
      server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: toPassthroughSchema(tool.inputSchema),
        },
        async (args) => {
          try {
            if (typeof tool.handler === 'function') {
              const result = await tool.handler(args, buildPluginHandlerContext(plugin, loadJson, loadText));
              if (result !== null && typeof result === 'object' && !Array.isArray(result) && Array.isArray(result.content)) {
                return finalizeToolResult(result);
              }
              return buildJsonToolResponse(result ?? {});
            }
            return buildJsonToolResponse(tool.staticPayload ?? {});
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return buildJsonToolErrorResponse({
              error: {
                code: 'PLUGIN_TOOL_RUNTIME_ERROR',
                message: `Plugin tool failed (${tool.name}): ${message}`,
                plugin: plugin.name,
              },
            });
          }
        },
      );
    }
  }
}

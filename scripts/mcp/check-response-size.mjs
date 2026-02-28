#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LIST_COMPONENTS_PAGED_DEFAULT_LIMIT,
  MAX_TOOL_RESULT_BYTES,
  buildDesignTokenDetailPayload,
  buildAccessibilityIndex,
  buildComponentSummaries,
  buildSummaryToolResponse,
  buildRelatedComponentMap,
  buildIndexes,
  buildJsonToolResponse,
  extractAccessibilityChecklist,
  getRelatedComponentsForTag,
  measureToolResultBytes,
  queryAccessibilityIndex,
  serializeApi,
  searchIconCatalog,
} from '../../packages/mcp-server/core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'packages/mcp-server/data');
const MAX_RESPONSE_BYTES = MAX_TOOL_RESULT_BYTES;
const MAX_GUIDELINE_RESULTS = 20;

async function loadJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function toTextToolResponse(payload) {
  return {
    content: [{
      type: 'text',
      text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
    }],
  };
}

function toolResponseBytes(toolResponse) {
  return measureToolResultBytes(toolResponse);
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function searchGuidelinesPayload(guidelinesIndex, query, topic, maxResults) {
  const documents = Array.isArray(guidelinesIndex?.documents) ? guidelinesIndex.documents : [];
  const q = String(query ?? '').toLowerCase();
  const results = [];

  for (const doc of documents) {
    if (topic && topic !== 'all' && doc.topic !== topic) continue;

    const sections = Array.isArray(doc.sections) ? doc.sections : [];
    for (const section of sections) {
      let score = 0;
      const heading = String(section.heading ?? '').toLowerCase();
      const keywords = Array.isArray(section.keywords) ? section.keywords : [];
      const snippet = String(section.snippet ?? '').toLowerCase();

      if (heading.includes(q)) score += 3;
      for (const keyword of keywords) {
        if (String(keyword).toLowerCase().includes(q)) {
          score += 2;
          break;
        }
      }
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

  results.sort((left, right) => right.score - left.score);
  return {
    query,
    topic: topic ?? 'all',
    totalHits: results.length,
    results: results.slice(0, maxResults),
  };
}

function pickLargestListComponentsResponse(manifest) {
  const indexes = buildIndexes(manifest);
  const hugePrefix = 'x'.repeat(2000);
  const scenarios = [
    { label: 'list_components(default)', args: {} },
    { label: 'list_components(mode=paged)', args: { mode: 'paged' } },
    { label: 'list_components(mode=paged, limit=200)', args: { mode: 'paged', limit: 200 } },
    { label: 'list_components(all, prefix=huge)', args: { prefix: hugePrefix } },
    { label: 'list_components(limit=200)', args: { limit: 200 } },
    { label: 'list_components(query="a", limit=200)', args: { query: 'a', limit: 200 } },
    { label: 'list_components(category="Form", limit=200)', args: { category: 'Form', limit: 200 } },
    { label: 'list_components(limit=200, prefix=huge)', args: { limit: 200, prefix: hugePrefix } },
  ];

  let largest = { label: 'list_components', bytes: 0 };

  for (const scenario of scenarios) {
    const responseMode = scenario.args.mode === 'paged' ? 'paged' : 'compat';
    const effectiveLimit = Number.isInteger(scenario.args.limit)
      ? scenario.args.limit
      : (responseMode === 'paged' ? LIST_COMPONENTS_PAGED_DEFAULT_LIMIT : undefined);
    const page = buildComponentSummaries(indexes, {
      category: scenario.args.category,
      query: scenario.args.query,
      limit: effectiveLimit,
      offset: scenario.args.offset,
      prefix: scenario.args.prefix,
    });
    const payload = responseMode === 'paged' ? page : page.items;
    const response = responseMode === 'paged'
      ? buildJsonToolResponse(payload, { env: {} })
      : toTextToolResponse(payload);
    const bytes = toolResponseBytes(response);
    if (bytes > largest.bytes) {
      largest = { label: scenario.label, bytes };
    }
  }

  return largest;
}

function getDesignTokensPayload(designTokens) {
  const tokens = Array.isArray(designTokens?.tokens) ? designTokens.tokens : [];
  const total = tokens.length;
  return {
    total,
    limit: total,
    offset: 0,
    hasMore: false,
    tokens,
    summary: designTokens?.summary,
    theme: {
      requested: 'light',
      resolved: 'light',
      available: ['light'],
    },
  };
}

function pickLargestGetDesignTokenDetailResponse(designTokens) {
  const tokens = Array.isArray(designTokens?.tokens) ? designTokens.tokens : [];
  let largest = { label: 'get_design_token_detail', bytes: 0 };
  for (const token of tokens) {
    const name = String(token?.name ?? '').trim();
    if (!name) continue;
    const result = buildDesignTokenDetailPayload(designTokens, name, 'light');
    const response = result.isError
      ? toTextToolResponse(result.payload)
      : buildJsonToolResponse(result.payload, { env: {} });
    const bytes = toolResponseBytes(response);
    if (bytes > largest.bytes) {
      largest = {
        label: `get_design_token_detail(name="${name}", theme="light")`,
        bytes,
      };
    }
  }
  return largest;
}

function pickLargestSearchIconsResponse(manifest) {
  const indexes = buildIndexes(manifest);
  const hugePrefix = 'x'.repeat(2000);
  const scenarios = [
    { label: 'search_icons(default)', args: {} },
    { label: 'search_icons(limit=100)', args: { limit: 100 } },
    { label: 'search_icons(query="a", limit=100)', args: { query: 'a', limit: 100 } },
    { label: 'search_icons(query="arrow", limit=100)', args: { query: 'arrow', limit: 100 } },
    { label: 'search_icons(limit=100, prefix=huge)', args: { limit: 100, prefix: hugePrefix } },
  ];

  let largest = { label: 'search_icons', bytes: 0 };

  for (const scenario of scenarios) {
    const payload = searchIconCatalog(indexes, scenario.args);
    const bytes = toolResponseBytes(toTextToolResponse(payload));
    if (bytes > largest.bytes) {
      largest = { label: scenario.label, bytes };
    }
  }

  return largest;
}

function pickLargestGetComponentApiResponse(manifest, installRegistry, patternRegistry) {
  const indexes = buildIndexes(manifest);
  const hugePrefix = 'x'.repeat(2000);
  const patterns =
    patternRegistry?.patterns && typeof patternRegistry.patterns === 'object'
      ? patternRegistry.patterns
      : {};
  const relatedMap = buildRelatedComponentMap(installRegistry, patterns);

  let largest = { label: 'get_component_api', bytes: 0 };

  for (const decl of indexes.decls) {
    const canonicalTag = typeof decl?.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
    if (!canonicalTag) continue;
    const modulePath = indexes.modulePathByTag.get(canonicalTag);

    for (const prefix of [undefined, hugePrefix]) {
      const api = serializeApi(decl, modulePath, prefix);
      const relatedComponents = getRelatedComponentsForTag({
        canonicalTagName: canonicalTag,
        installRegistry,
        relatedMap,
        prefix,
      });
      if (relatedComponents.length > 0) {
        api.relatedComponents = relatedComponents;
      }
      const accessibilityChecklist = extractAccessibilityChecklist(decl, { prefix });
      if (accessibilityChecklist) {
        api.accessibilityChecklist = accessibilityChecklist;
      }

      const bytes = toolResponseBytes(buildJsonToolResponse(api, { env: {} }));
      if (bytes > largest.bytes) {
        const prefixLabel = prefix ? 'prefix=huge' : 'prefix=default';
        largest = {
          label: `get_component_api(tagName="${canonicalTag}", ${prefixLabel})`,
          bytes,
        };
      }
    }
  }

  return largest;
}

function pickLargestGetComponentApiSummaryPayload(manifest, installRegistry, patternRegistry) {
  const indexes = buildIndexes(manifest);
  const hugePrefix = 'x'.repeat(2000);
  const patterns =
    patternRegistry?.patterns && typeof patternRegistry.patterns === 'object'
      ? patternRegistry.patterns
      : {};
  const relatedMap = buildRelatedComponentMap(installRegistry, patterns);

  let largestPayload = {};
  let largestBytes = 0;

  for (const decl of indexes.decls) {
    const canonicalTag = typeof decl?.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
    if (!canonicalTag) continue;
    const modulePath = indexes.modulePathByTag.get(canonicalTag);

    for (const prefix of [undefined, hugePrefix]) {
      const payload = serializeApi(decl, modulePath, prefix);
      const relatedComponents = getRelatedComponentsForTag({
        canonicalTagName: canonicalTag,
        installRegistry,
        relatedMap,
        prefix,
      });
      if (relatedComponents.length > 0) {
        payload.relatedComponents = relatedComponents;
      }
      const accessibilityChecklist = extractAccessibilityChecklist(decl, { prefix });
      if (accessibilityChecklist) {
        payload.accessibilityChecklist = accessibilityChecklist;
      }
      const bytes = Buffer.byteLength(JSON.stringify(payload, null, 2), 'utf8');
      if (bytes > largestBytes) {
        largestBytes = bytes;
        largestPayload = payload;
      }
    }
  }

  return largestPayload;
}

function pickLargestAccessibilityDocsResponse(manifest, guidelinesIndex) {
  const indexes = buildIndexes(manifest);
  const hugePrefix = 'x'.repeat(2000);
  let largest = { label: 'get_accessibility_docs', bytes: 0 };

  for (const prefix of [undefined, hugePrefix]) {
    const entries = buildAccessibilityIndex(indexes, guidelinesIndex, { prefix });
    const scenarios = [
      { label: 'get_accessibility_docs(default)', args: {} },
      { label: 'get_accessibility_docs(wcagLevel=A)', args: { wcagLevel: 'A', maxResults: 100 } },
      { label: 'get_accessibility_docs(wcagLevel=AA)', args: { wcagLevel: 'AA', maxResults: 100 } },
      { label: 'get_accessibility_docs(topic=labels)', args: { topic: 'labels', maxResults: 100 } },
      {
        label: 'get_accessibility_docs(component=dads-button, wcagLevel=all)',
        args: {
          componentTagName: prefix ? `${prefix.slice(0, 64)}-button` : 'dads-button',
          wcagLevel: 'all',
          maxResults: 100,
        },
      },
    ];

    for (const scenario of scenarios) {
      const payload = queryAccessibilityIndex(entries, scenario.args);
      const bytes = toolResponseBytes(buildJsonToolResponse(payload, { env: {} }));
      if (bytes > largest.bytes) {
        const prefixLabel = prefix ? ', prefix=huge' : '';
        largest = {
          label: `${scenario.label}${prefixLabel}`,
          bytes,
        };
      }
    }
  }

  return largest;
}

function pickLargestGuidelineResponse(guidelinesIndex) {
  const queries = ['', 'a', 'e', 'accessibility', 'design', 'component', 'token', 'ui', 'ガイド'];
  const topics = [undefined, 'all', 'css', 'patterns', 'accessibility'];

  let largest = { label: 'search_guidelines', bytes: 0 };

  for (const query of queries) {
    for (const topic of topics) {
      const payload = searchGuidelinesPayload(guidelinesIndex, query, topic, MAX_GUIDELINE_RESULTS);
      const bytes = toolResponseBytes(buildJsonToolResponse(payload, { env: {} }));
      if (bytes > largest.bytes) {
        const topicLabel = topic ?? 'all';
        largest = { label: `search_guidelines(query="${query}", topic="${topicLabel}", maxResults=20)`, bytes };
      }
    }
  }

  return largest;
}

function pickLargestSummaryResponse({
  manifest,
  installRegistry,
  patternRegistry,
  designTokens,
  guidelinesIndex,
}) {
  const indexes = buildIndexes(manifest);
  const api = pickLargestGetComponentApiSummaryPayload(manifest, installRegistry, patternRegistry);

  const listComponentsPayload = buildComponentSummaries(indexes, {}).items;
  const designTokensPayload = getDesignTokensPayload(designTokens);
  const guidelinesPayload = searchGuidelinesPayload(guidelinesIndex, 'focus', 'all', MAX_GUIDELINE_RESULTS);

  const scenarios = [
    { label: 'list_components(summary=true)', payload: listComponentsPayload },
    { label: 'get_component_api(summary=true)', payload: api },
    { label: 'get_design_tokens(summary=true)', payload: designTokensPayload },
    { label: 'search_guidelines(summary=true)', payload: guidelinesPayload },
  ];

  let largest = { label: 'summary_mode', bytes: 0 };
  for (const scenario of scenarios) {
    const response = buildSummaryToolResponse(scenario.label, scenario.payload, { env: {} });
    const bytes = toolResponseBytes(response);
    if (bytes > largest.bytes) {
      largest = { label: scenario.label, bytes };
    }
  }

  return largest;
}

async function main() {
  const [manifest, designTokens, guidelinesIndex, installRegistry, patternRegistry] = await Promise.all([
    loadJson('custom-elements.json'),
    loadJson('design-tokens.json'),
    loadJson('guidelines-index.json'),
    loadJson('install-registry.json'),
    loadJson('pattern-registry.json'),
  ]);

  const checks = [
    pickLargestListComponentsResponse(manifest),
    pickLargestSearchIconsResponse(manifest),
    pickLargestGetComponentApiResponse(manifest, installRegistry, patternRegistry),
    {
      label: 'get_design_tokens(all)',
      bytes: toolResponseBytes(buildJsonToolResponse(getDesignTokensPayload(designTokens), { env: {} })),
    },
    {
      label: 'get_design_tokens(limit=200,offset=200)',
      bytes: toolResponseBytes(buildJsonToolResponse({
        ...getDesignTokensPayload(designTokens),
        limit: 200,
        offset: 200,
        hasMore: true,
        tokens: (Array.isArray(designTokens?.tokens) ? designTokens.tokens : []).slice(200, 400),
      }, { env: {} })),
    },
    pickLargestGetDesignTokenDetailResponse(designTokens),
    pickLargestAccessibilityDocsResponse(manifest, guidelinesIndex),
    pickLargestGuidelineResponse(guidelinesIndex),
    pickLargestSummaryResponse({
      manifest,
      installRegistry,
      patternRegistry,
      designTokens,
      guidelinesIndex,
    }),
  ];

  let failed = false;
  for (const check of checks) {
    const status = check.bytes > MAX_RESPONSE_BYTES ? 'NG' : 'OK';
    console.log(`${status} ${check.label}: ${formatKb(check.bytes)} (${check.bytes} bytes)`);
    if (status === 'NG') failed = true;
  }

  if (failed) {
    console.error(`\nResponse size check failed: limit is ${MAX_RESPONSE_BYTES} bytes (100KB).`);
    process.exit(1);
  }

  console.log('\nResponse size check passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

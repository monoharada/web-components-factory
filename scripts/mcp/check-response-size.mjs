#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MAX_TOOL_RESULT_BYTES,
  buildComponentSummaries,
  buildIndexes,
  buildJsonToolResponse,
  measureToolResultBytes,
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
    { label: 'list_components(all, prefix=huge)', args: { prefix: hugePrefix } },
    { label: 'list_components(limit=200)', args: { limit: 200 } },
    { label: 'list_components(query="a", limit=200)', args: { query: 'a', limit: 200 } },
    { label: 'list_components(category="Form", limit=200)', args: { category: 'Form', limit: 200 } },
    { label: 'list_components(limit=200, prefix=huge)', args: { limit: 200, prefix: hugePrefix } },
  ];

  let largest = { label: 'list_components', bytes: 0 };

  for (const scenario of scenarios) {
    const payload = buildComponentSummaries(indexes, scenario.args).items;
    const bytes = toolResponseBytes(toTextToolResponse(payload));
    if (bytes > largest.bytes) {
      largest = { label: scenario.label, bytes };
    }
  }

  return largest;
}

function getDesignTokensPayload(designTokens) {
  const tokens = Array.isArray(designTokens?.tokens) ? designTokens.tokens : [];
  return {
    total: tokens.length,
    tokens,
    summary: designTokens?.summary,
  };
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

async function main() {
  const [manifest, designTokens, guidelinesIndex] = await Promise.all([
    loadJson('custom-elements.json'),
    loadJson('design-tokens.json'),
    loadJson('guidelines-index.json'),
  ]);

  const checks = [
    pickLargestListComponentsResponse(manifest),
    pickLargestSearchIconsResponse(manifest),
    {
      label: 'get_design_tokens(all)',
      bytes: toolResponseBytes(buildJsonToolResponse(getDesignTokensPayload(designTokens), { env: {} })),
    },
    pickLargestGuidelineResponse(guidelinesIndex),
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

#!/usr/bin/env node

import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  MAX_TOOL_RESULT_BYTES,
  buildDesignTokenDetailPayload,
  buildAccessibilityIndex,
  buildComponentSummaries,
  buildFullPageHtml,
  buildRelatedComponentMap,
  buildIndexes,
  buildJsonToolResponse,
  extractAccessibilityChecklist,
  extractPrefixFromIndexes,
  getRelatedComponentsForTag,
  measureToolResultBytes,
  queryAccessibilityIndex,
  resolveComponentClosure,
  serializeApi,
  searchIconCatalog,
} from '../../packages/mcp-server/core.mjs';
import { PACKAGE_VERSION } from '../../packages/mcp-server/core/constants.mjs';
import { loadJsonDataWithFallback } from '../../packages/mcp-server/runtime-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const MAX_RESPONSE_BYTES = MAX_TOOL_RESULT_BYTES;
const MAX_GUIDELINE_RESULTS = 20;
const P95_THRESHOLD_MS = 1000;

function timed(fn) {
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;
  return { ...result, elapsedMs: elapsed };
}

function computeP95(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[Math.max(0, idx)];
}

async function loadJson(fileName) {
  return loadJsonDataWithFallback(fileName, { repoRoot: ROOT });
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

function pickLargestKnowledgeSearchResponse(manifest, designTokens, guidelinesIndex, patternRegistry, skillsRegistry) {
  const indexes = buildIndexes(manifest);
  const patterns =
    patternRegistry?.patterns && typeof patternRegistry.patterns === 'object'
      ? patternRegistry.patterns
      : {};
  const skills = Array.isArray(skillsRegistry?.skills) ? skillsRegistry.skills : [];
  const queries = ['spacing', 'button', 'css', 'layout', 'token'];
  const sourcesList = [
    ['components', 'patterns', 'guidelines', 'tokens', 'skills'],
    ['guidelines', 'tokens'],
    ['skills'],
  ];

  let largest = { label: 'search_design_system_knowledge', bytes: 0 };

  for (const query of queries) {
    const q = query.toLowerCase();
    const terms = [q];
    for (const sources of sourcesList) {
      const results = [];

      if (sources.includes('components')) {
        const page = buildComponentSummaries(indexes, { query: q, limit: 200 });
        for (const item of page.items) {
          results.push({
            source: 'components',
            id: item.tagName,
            title: item.tagName,
            description: item.description ?? '',
          });
        }
      }

      if (sources.includes('patterns')) {
        for (const pattern of Object.values(patterns)) {
          const blob = `${pattern?.id ?? ''} ${pattern?.title ?? ''} ${pattern?.description ?? ''}`.toLowerCase();
          if (!terms.some((term) => blob.includes(term))) continue;
          results.push({
            source: 'patterns',
            id: pattern?.id,
            title: pattern?.title ?? pattern?.id,
            description: pattern?.description ?? '',
          });
        }
      }

      if (sources.includes('guidelines')) {
        const docs = Array.isArray(guidelinesIndex?.documents) ? guidelinesIndex.documents : [];
        for (const doc of docs) {
          for (const section of doc.sections ?? []) {
            const blob = `${doc?.title ?? ''} ${section?.heading ?? ''} ${section?.snippet ?? ''}`.toLowerCase();
            if (!terms.some((term) => blob.includes(term))) continue;
            results.push({
              source: 'guidelines',
              id: `${doc?.id}:${section?.heading ?? ''}`,
              title: section?.heading ?? doc?.title,
              description: section?.snippet ?? '',
            });
          }
        }
      }

      if (sources.includes('tokens')) {
        for (const token of designTokens?.tokens ?? []) {
          const blob = `${token?.name ?? ''} ${token?.cssVariable ?? ''} ${token?.type ?? ''} ${token?.category ?? ''}`.toLowerCase();
          if (!terms.some((term) => blob.includes(term))) continue;
          results.push({
            source: 'tokens',
            id: token?.name,
            title: token?.name,
            description: `${token?.type ?? ''}/${token?.category ?? ''}: ${token?.value ?? ''}`,
          });
        }
      }

      if (sources.includes('skills')) {
        for (const skill of skills) {
          const blob = `${skill?.name ?? ''} ${skill?.description ?? ''} ${(skill?.tags ?? []).join(' ')}`.toLowerCase();
          if (!terms.some((term) => blob.includes(term))) continue;
          results.push({
            source: 'skills',
            id: skill?.name,
            title: skill?.name,
            description: skill?.description ?? '',
          });
        }
      }

      const payload = {
        query,
        sources,
        totalHits: results.length,
        results: results.slice(0, 10),
      };
      const bytes = toolResponseBytes(buildJsonToolResponse(payload, { env: {} }));
      if (bytes > largest.bytes) {
        largest = {
          label: `search_design_system_knowledge(query="${query}", sources="${sources.join(',')}")`,
          bytes,
        };
      }
    }
  }

  return largest;
}

function getDesignSystemOverviewPayload(manifest, installRegistry, patternRegistry) {
  const indexes = buildIndexes(manifest);
  const patterns =
    patternRegistry?.patterns && typeof patternRegistry.patterns === 'object'
      ? patternRegistry.patterns
      : {};
  const patternList = Object.values(patterns).map((p) => ({ id: p?.id, title: p?.title }));
  const categoryCount = {};
  for (const decl of indexes.decls) {
    const cat = decl?.custom?.category ?? 'Other';
    categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
  }
  return {
    name: 'DADS Web Components (wcf)',
    version: PACKAGE_VERSION,
    prefix: 'dads',
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
        '{ "imports": { "dads-button": "./<dir>/components/button.js" } }',
        '</script>',
        '<script type="module" src="./<dir>/boot.js"></script>',
      ].join('\n'),
      noscriptGuidance: 'WCF components require JavaScript.',
      noCDN: true,
      deliveryModel: 'vendor-local',
      importMapHint: 'WCF uses <script type="importmap"> for module resolution.',
      bootScript: '<dir>/boot.js',
      detectedPrefix: 'dads',
      vendorSetup: { init: 'wcf init --prefix dads --dir <dir>', add: 'wcf add <componentId> --prefix dads --out <dir>', workflow: '...' },
      htmlSetup: '<script type="importmap">...</script><script type="module" src="./<dir>/boot.js"></script>',
    },
  };
}

function getInstallRecipePayload(_manifest, installRegistry) {
  const components = installRegistry?.components && typeof installRegistry.components === 'object' ? installRegistry.components : {};
  let largest = { label: 'get_install_recipe', bytes: 0 };
  for (const [componentId, meta] of Object.entries(components)) {
    if (!meta || typeof meta !== 'object') continue;
    const deps = Array.isArray(meta.deps) ? meta.deps : [];
    const tags = Array.isArray(meta.tags) ? meta.tags.map((t) => String(t).toLowerCase()) : [componentId];
    const transitiveDeps = resolveComponentClosure({ installRegistry }, [componentId]).filter((id) => id !== componentId);
    const payload = {
      componentId,
      tagNames: tags,
      deps,
      transitiveDeps,
      define: String(meta.define ?? '').trim(),
      source: meta.source,
      usageSnippet: `<dads-${componentId}>...</dads-${componentId}>`,
      usageContext: 'body-only',
      installHint: `wcf add ${componentId}`,
      vendorHint: (() => {
        const im = JSON.stringify({ imports: Object.fromEntries(tags.map((t) => [t, `./<dir>/components/${t.replace(/^[^-]+-/, '')}.js`])) });
        return {
          install: `wcf add ${componentId} --prefix <prefix> --out <dir>`,
          importMap: im,
          importmap: im,
          boot: '<dir>/boot.js',
        };
      })(),
    };
    const bytes = toolResponseBytes(toTextToolResponse(payload));
    if (bytes > largest.bytes) {
      largest = { label: `get_install_recipe(component="${componentId}")`, bytes };
    }
  }
  return largest;
}

function getPatternRecipePayload(installRegistry, patternRegistry) {
  const patterns =
    patternRegistry?.patterns && typeof patternRegistry.patterns === 'object'
      ? patternRegistry.patterns
      : {};
  const components = installRegistry?.components && typeof installRegistry.components === 'object' ? installRegistry.components : {};
  let largest = { label: 'get_pattern_recipe', bytes: 0 };
  for (const pat of Object.values(patterns)) {
    const requires = Array.isArray(pat.requires) ? pat.requires : [];
    const closure = resolveComponentClosure({ installRegistry }, requires);
    const install = Object.fromEntries(
      closure.map((cid) => [cid, components[cid]]).filter(([, meta]) => meta && typeof meta === 'object'),
    );
    const entryHints = Array.isArray(pat.entryHints) ? [...pat.entryHints] : ['boot'];
    const importMapEntries = Object.fromEntries(
      closure.flatMap((cid) => {
        const meta = components[cid];
        const tags = Array.isArray(meta?.tags) ? meta.tags : [cid];
        return tags.map((t) => {
          const lower = String(t).toLowerCase();
          const suffix = lower.replace(/^[^-]+-/, '');
          return [lower, `./<dir>/components/${suffix}.js`];
        });
      }),
    );
    const payload = {
      pattern: { id: pat.id, title: pat.title, description: pat.description },
      prefix: 'dads',
      requires,
      components: closure,
      install,
      html: String(pat.html ?? ''),
      canonicalHtml: String(pat.html ?? ''),
      installHint: closure.length > 0 ? `wcf add ${closure.join(' ')}` : undefined,
      entryHints,
      scaffoldHint: {
        doctype: '<!DOCTYPE html>',
        importMap: `<script type="importmap">\n${JSON.stringify({ imports: importMapEntries }, null, 2)}\n</script>`,
        bootScript: '<script type="module" src="./<dir>/boot.js"></script>',
        noscript: '<noscript>このページの機能にはJavaScriptが必要です。</noscript>',
        serveOverHttp: 'Import maps require HTTP/HTTPS. Use a local dev server.',
      },
    };
    const bytes = toolResponseBytes(toTextToolResponse(payload));
    if (bytes > largest.bytes) {
      largest = { label: `get_pattern_recipe(patternId="${pat.id}")`, bytes };
    }
  }
  return largest;
}

export async function collectResponseSizeReport() {
  const [manifest, designTokens, guidelinesIndex, installRegistry, patternRegistry, selectorGuide, skillsRegistry] = await Promise.all([
    loadJson('custom-elements.json'),
    loadJson('design-tokens.json'),
    loadJson('guidelines-index.json'),
    loadJson('install-registry.json'),
    loadJson('pattern-registry.json'),
    loadJson('component-selector-guide.json').catch(() => null),
    loadJson('skills-registry.json').catch(() => null),
  ]);

  const indexes = buildIndexes(manifest);

  const timedChecks = [
    timed(() => pickLargestListComponentsResponse(manifest)),
    timed(() => pickLargestSearchIconsResponse(manifest)),
    timed(() => pickLargestGetComponentApiResponse(manifest, installRegistry, patternRegistry)),
    timed(() => ({
      label: 'get_design_tokens(all)',
      bytes: toolResponseBytes(buildJsonToolResponse(getDesignTokensPayload(designTokens), { env: {} })),
    })),
    timed(() => pickLargestGetDesignTokenDetailResponse(designTokens)),
    timed(() => pickLargestAccessibilityDocsResponse(manifest, guidelinesIndex)),
    timed(() => pickLargestGuidelineResponse(guidelinesIndex)),
    timed(() => pickLargestKnowledgeSearchResponse(manifest, designTokens, guidelinesIndex, patternRegistry, skillsRegistry)),
    timed(() => ({
      label: 'get_design_system_overview',
      bytes: toolResponseBytes(toTextToolResponse(getDesignSystemOverviewPayload(manifest, installRegistry, patternRegistry))),
    })),
    timed(() => getInstallRecipePayload(manifest, installRegistry)),
    timed(() => getPatternRecipePayload(installRegistry, patternRegistry)),
    // v0.4.0 new tools
    timed(() => {
      const cemIndex = new Map(indexes.decls.map((d) => [d.tagName, d]));
      const fragment = '<dads-button variant="solid">OK</dads-button><dads-card>Content</dads-card>';
      const { fullHtml, importEntries } = buildFullPageHtml({ html: fragment, prefix: 'dads', cemIndex });
      const payload = { fullHtml, componentCount: Object.keys(importEntries).length, importMapEntries: importEntries };
      return { label: 'generate_full_page_html(2 components)', bytes: toolResponseBytes(toTextToolResponse(payload)) };
    }),
    timed(() => {
      if (!selectorGuide) return { label: 'get_component_selector_guide(skipped)', bytes: 0 };
      const payload = { totalCategories: selectorGuide.categories?.length ?? 0, categories: selectorGuide.categories ?? [] };
      return { label: 'get_component_selector_guide(all)', bytes: toolResponseBytes(buildJsonToolResponse(payload, { env: {} })) };
    }),
  ];

  const checks = timedChecks.map((check) => ({
    ...check,
    status: check.bytes > MAX_RESPONSE_BYTES ? 'NG' : 'OK',
    sizeKb: Number((check.bytes / 1024).toFixed(1)),
  }));

  const timings = checks.map((c) => c.elapsedMs);
  const p95 = computeP95(timings);
  const p95Status = p95 > P95_THRESHOLD_MS ? 'NG' : 'OK';
  const failedChecks = checks.filter((check) => check.status === 'NG').length;
  const failed = failedChecks > 0 || p95Status === 'NG';

  return {
    schemaVersion: '1.0',
    packageVersion: PACKAGE_VERSION,
    thresholds: {
      maxResponseBytes: MAX_RESPONSE_BYTES,
      p95ThresholdMs: P95_THRESHOLD_MS,
    },
    summary: {
      status: failed ? 'NG' : 'OK',
      totalChecks: checks.length,
      failedChecks,
      p95Status,
      p95Ms: Number(p95.toFixed(1)),
    },
    checks: checks.map((check) => ({
      label: check.label,
      status: check.status,
      bytes: check.bytes,
      sizeKb: check.sizeKb,
      elapsedMs: Number(check.elapsedMs.toFixed(1)),
    })),
  };
}

export function formatResponseSizeReport(report) {
  const lines = [];
  for (const check of report.checks) {
    lines.push(`${check.status} ${check.label}: ${formatKb(check.bytes)} (${check.bytes} bytes) [${check.elapsedMs.toFixed(1)}ms]`);
  }
  lines.push('');
  lines.push(`${report.summary.p95Status} p95 latency: ${report.summary.p95Ms.toFixed(1)}ms (threshold: ${report.thresholds.p95ThresholdMs}ms)`);
  lines.push('');
  lines.push(
    report.summary.status === 'OK'
      ? 'Response size and performance check passed.'
      : 'Response size/performance check failed.',
  );
  return lines.join('\n');
}

export async function main(argv = process.argv.slice(2)) {
  const json = argv.includes('--json');
  const report = await collectResponseSizeReport();
  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatResponseSizeReport(report));
  }
  if (report.summary.status !== 'OK') {
    process.exit(1);
  }
}

const directRunArg = process.argv[1];
const isDirectRun =
  typeof directRunArg === 'string' &&
  pathToFileURL(path.resolve(directRunArg)).href === import.meta.url;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

/**
 * core/cem.mjs — CEM index, icon catalog, accessibility, related components, and pattern helpers.
 */

import { CANONICAL_PREFIX } from './constants.mjs';
import { normalizePrefix, withPrefix, toCanonicalTagName, getCategory, suggestUnknownElementTagName } from './prefix.mjs';
import { normalizeTokenIdentifier } from './tokens.mjs';

// Single-module constants (DD-14)
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

const WCAG_LEVELS = Object.freeze(new Set(['A', 'AA', 'AAA', 'all']));

// Icon alias table: common alias → canonical icon names (DD-18)
const ICON_ALIAS_TABLE = new Map([
  ['x', ['close', 'cancel']],
  ['trash', ['delete']],
  ['pencil', ['edit']],
  ['magnifying', ['search']],
  ['gear', ['settings']],
  ['plus', ['add']],
  ['minus', ['subtract']],
  ['tick', ['check', 'checkmark']],
  ['alert', ['warning', 'attention']],
  ['info', ['information', 'help']],
  ['hamburger', ['menu']],
  ['back', ['arrowBack', 'arrowLeft']],
  ['forward', ['arrowForward', 'arrowRight']],
  ['eye', ['visibility']],
  ['user', ['person']],
  ['file', ['document']],
  ['bell', ['notification']],
]);

// Interaction examples for form components (P-04 / #206)
const INTERACTION_EXAMPLES_MAP = Object.freeze({
  'dads-input-text': [
    { scenario: 'Set value programmatically', trigger: 'property', code: 'el.value = "hello";' },
    { scenario: 'Show validation error', trigger: 'attribute', code: 'el.error = true; el.errorText = "この項目は入力が必須です";' },
    { scenario: 'Clear validation error', trigger: 'attribute', code: 'el.error = false; el.errorText = "";' },
    { scenario: 'Listen to value change', trigger: 'event', code: "el.addEventListener('change', (e) => { console.log(e.target.value); });" },
  ],
  'dads-textarea': [
    { scenario: 'Set value programmatically', trigger: 'property', code: 'el.value = "long text...";' },
    { scenario: 'Show validation error', trigger: 'attribute', code: 'el.error = true; el.errorText = "入力できる文字数を超えています";' },
    { scenario: 'Listen to input event', trigger: 'event', code: "el.addEventListener('input', (e) => { console.log(e.target.value); });" },
  ],
  'dads-select': [
    { scenario: 'Set selected value', trigger: 'property', code: 'el.value = "option1";' },
    { scenario: 'Show validation error', trigger: 'attribute', code: 'el.error = true; el.errorText = "この項目は入力が必須です";' },
    { scenario: 'Listen to change event', trigger: 'event', code: "el.addEventListener('change', (e) => { console.log(e.target.value); });" },
  ],
  'dads-checkbox': [
    { scenario: 'Set checked state', trigger: 'property', code: 'el.checked = true;' },
    { scenario: 'Show validation error', trigger: 'attribute', code: 'el.error = true; el.errorText = "この項目は入力が必須です";' },
    { scenario: 'Listen to change event', trigger: 'event', code: "el.addEventListener('change', (e) => { console.log(e.target.checked); });" },
  ],
  'dads-radio': [
    { scenario: 'Set checked state', trigger: 'property', code: 'el.checked = true;' },
    { scenario: 'Listen to change event', trigger: 'event', code: "el.addEventListener('change', (e) => { console.log(e.target.value); });" },
  ],
  'dads-combobox': [
    { scenario: 'Set value programmatically', trigger: 'property', code: 'el.value = "selected-option";' },
    { scenario: 'Show validation error', trigger: 'attribute', code: 'el.error = true; el.errorText = "この項目は入力が必須です";' },
    { scenario: 'Listen to change event', trigger: 'event', code: "el.addEventListener('change', (e) => { console.log(e.target.value); });" },
  ],
  'dads-date-picker': [
    { scenario: 'Set date value', trigger: 'property', code: 'el.value = "2024-01-15";' },
    { scenario: 'Show validation error', trigger: 'attribute', code: 'el.error = true; el.errorText = "この項目は入力が必須です";' },
    { scenario: 'Listen to change event', trigger: 'event', code: "el.addEventListener('change', (e) => { console.log(e.target.value); });" },
  ],
  'dads-file-upload': [
    { scenario: 'Listen to file selection', trigger: 'event', code: "el.addEventListener('change', (e) => { console.log(e.target.files); });" },
    { scenario: 'Show validation error', trigger: 'attribute', code: 'el.error = true; el.errorText = "この項目は入力が必須です";' },
  ],
});

// Layout behavior metadata for layout/display components (P-05 / #207)
const LAYOUT_BEHAVIOR_MAP = Object.freeze({
  'dads-layout-shell': {
    responsive: {
      breakpoints: { desktop: '80rem', tablet: '48rem' },
      modes: ['auto', 'desktop', 'tablet', 'mobile'],
      defaultMode: 'auto',
      description: 'Automatically switches between desktop/tablet/mobile layouts based on viewport width when mode="auto".',
    },
    overflow: {
      strategy: 'slot-driven',
      description: 'Slots (header, sidebar, aside, footer) are auto-hidden when empty. Sidebar collapses to rail on tablet.',
    },
    constraints: {
      patterns: ['website', 'app-shell', 'master-detail', 'left-header-pane', 'three-pane', 'three-pane-shell'],
      defaultPattern: 'app-shell',
      mobileSidebarOptions: ['hidden', 'top', 'bottom'],
      description: 'Choose a pattern attribute to control layout structure. Pair with mode and mobile-sidebar for full control.',
    },
  },
  'dads-layout-sidebar': {
    responsive: {
      description: 'Designed to be placed inside dads-layout-shell sidebar slot. Width is controlled by the parent shell.',
    },
    constraints: {
      description: 'Simple container for sidebar content. Use inside dads-layout-shell for responsive behavior.',
    },
  },
  'dads-device-mock': {
    responsive: {
      devices: ['desktop', 'tablet', 'mobile'],
      defaultDevice: 'mobile',
      description: 'Renders a device frame (desktop/tablet/mobile) around slotted content. Set device attribute to switch.',
    },
    constraints: {
      visibleHeight: 'Use visible-height attribute to clip the mock to a specific height (e.g. "220px").',
      description: 'Display-only component for previewing content in device frames. Not a layout container.',
    },
  },
});

/**
 * Generic fallback values for common attributes when CEM default is missing.
 */
const SNIPPET_FALLBACK_VALUES = {
  label: 'ラベル',
  name: 'field1',
  value: 'サンプル値',
  'support-text': '説明テキスト',
};

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

/**
 * Extracts the primary component prefix from CEM indexes.
 */
export function extractPrefixFromIndexes(indexes) {
  const counts = new Map();
  for (const { tagName } of indexes.decls) {
    const i = tagName.indexOf('-');
    if (i > 0) {
      const p = tagName.slice(0, i);
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }
  let best = CANONICAL_PREFIX;
  let bestCount = 0;
  for (const [p, c] of counts) {
    if (c > bestCount) { best = p; bestCount = c; }
  }
  return best;
}

/**
 * Build a full HTML page from a fragment.
 */
export function buildFullPageHtml({ html, prefix, cemIndex }) {
  const tagRe = /<([a-z][a-z0-9]*-[a-z0-9-]*)\b/gi;
  const tags = new Set();
  let m;
  while ((m = tagRe.exec(html))) {
    tags.add(String(m[1]).toLowerCase());
  }

  const importEntries = {};
  for (const tag of tags) {
    if (cemIndex.has(tag)) {
      const suffix = tag.replace(/^[^-]+-/, '');
      importEntries[tag] = `./<dir>/components/${suffix}.js`;
    }
  }

  const importMapJson = JSON.stringify({ imports: importEntries }, null, 2);

  const lines = [
    '<!DOCTYPE html>',
    `<html lang="ja">`,
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    `  <title>WCF Preview</title>`,
    `  <link rel="stylesheet" href="./<dir>/styles/tokens.css">`,
    `  <script type="importmap">`,
    importMapJson,
    `  </script>`,
    '</head>',
    '<body>',
    html,
    `  <script type="module" src="./<dir>/boot.js"></script>`,
    '</body>',
    '</html>',
  ];

  return { fullHtml: lines.join('\n'), importEntries };
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
      default: a?.default ?? null,
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
    if (isBoolean) {
      lines.push(`  ${name}`);
    } else {
      let defaultVal;
      if (typeof a.default === 'string') {
        defaultVal = a.default.replace(/^['"]|['"]$/g, '');
      } else if (SNIPPET_FALLBACK_VALUES[name] !== undefined) {
        defaultVal = SNIPPET_FALLBACK_VALUES[name];
      } else {
        const enumMatch = t.match(/^'([^']+)'/);
        if (enumMatch) {
          defaultVal = enumMatch[1];
        } else {
          const desc = String(a.description ?? '');
          const descEnum = desc.match(/\(([^)]+)\)/);
          if (descEnum) {
            const first = descEnum[1].split(/\s*[|｜]\s*/)[0]?.trim();
            defaultVal = first || '';
          } else {
            defaultVal = '';
          }
        }
      }
      lines.push(`  ${name}="${defaultVal}"`);
    }
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

/**
 * Build a frequency map: componentId → count of patterns that require it.
 */
export function buildPatternFrequencyMap(patterns) {
  const freq = new Map();
  if (!patterns || typeof patterns !== 'object') return freq;
  for (const pat of Object.values(patterns)) {
    const requires = Array.isArray(pat?.requires) ? pat.requires : [];
    for (const id of requires) {
      const key = String(id ?? '').trim();
      if (key) freq.set(key, (freq.get(key) ?? 0) + 1);
    }
  }
  return freq;
}

export function buildComponentSummaries(indexes, { category, query, limit, offset, prefix, patternId, sort, patterns, installRegistry, patternFrequency } = {}) {
  const p = normalizePrefix(prefix);
  const q = typeof query === 'string' ? query.trim().toLowerCase() : '';
  const limitExplicit = Number.isInteger(limit);
  const pageSize = limitExplicit ? Math.max(1, Math.min(limit, 200)) : 20;
  const pageOffset = Number.isInteger(offset) ? Math.max(0, offset) : 0;

  /**
   * Convert a tag from the current prefix to canonical prefix using string ops.
   */
  const toCanonicalTag = (tag, currentPrefix) => {
    const cp = `${currentPrefix}-`;
    if (tag.startsWith(cp)) {
      return `${CANONICAL_PREFIX}-${tag.slice(cp.length)}`;
    }
    return tag;
  };

  let items = indexes.decls.map(({ decl, tagName, modulePath }) => ({
    tagName: withPrefix(tagName, p),
    className: typeof decl?.name === 'string' ? decl.name : undefined,
    description: typeof decl?.description === 'string' ? decl.description : undefined,
    category: getCategory(tagName),
    modulePath,
  }));

  // patternId filter
  if (typeof patternId === 'string' && patternId.trim()) {
    const pats = patterns && typeof patterns === 'object' ? patterns : {};
    const pat = pats[patternId.trim()];
    if (pat && Array.isArray(pat.requires)) {
      const requiredIds = new Set(pat.requires.map((r) => String(r ?? '').trim()).filter(Boolean));
      const tags = installRegistry?.tags && typeof installRegistry.tags === 'object' ? installRegistry.tags : {};
      items = items.filter((item) => {
        const canonicalTag = toCanonicalTag(item.tagName, p);
        const componentId = tags[canonicalTag];
        return componentId && requiredIds.has(componentId);
      });
    } else {
      items = [];
    }
  }

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

  // frequency sort
  if (sort === 'frequency') {
    const freq = patternFrequency instanceof Map ? patternFrequency : new Map();
    const tags = installRegistry?.tags && typeof installRegistry.tags === 'object' ? installRegistry.tags : {};
    items = items.map((item) => {
      const canonicalTag = toCanonicalTag(item.tagName, p);
      const componentId = tags[canonicalTag] ?? '';
      return { ...item, frequency: freq.get(componentId) ?? 0 };
    });
    items.sort((a, b) => b.frequency - a.frequency);
  }

  const total = items.length;
  const paged = items.slice(pageOffset, pageOffset + pageSize);

  const result = {
    total,
    limit: pageSize,
    offset: pageOffset,
    hasMore: pageOffset + paged.length < total,
    items: paged,
  };

  // DIG-19: Add migration notice when limit is not explicitly provided
  if (!limitExplicit && total > pageSize) {
    result._notice = 'Default pagination changed to 20 items. Set limit:200 for all results.';
  }

  return result;
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
    const searchTerms = [q];
    const aliases = ICON_ALIAS_TABLE.get(q);
    if (aliases) {
      for (const alias of aliases) {
        if (!searchTerms.includes(alias)) searchTerms.push(alias);
      }
    }
    icons = icons.filter((icon) => {
      const name = icon.name.toLowerCase();
      return searchTerms.some((term) => name.includes(term));
    });
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
    const patternIdVal = String(pattern?.id ?? '').trim() || 'pattern';
    const requires = [...new Set((Array.isArray(pattern?.requires) ? pattern.requires : []).map((id) => String(id ?? '').trim()).filter(Boolean))];

    for (const fromId of requires) {
      for (const toId of requires) {
        addRelation(fromId, toId, patternIdVal);
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

// Helpers used by register.mjs — exported for internal use
export { INTERACTION_EXAMPLES_MAP, LAYOUT_BEHAVIOR_MAP };

export function buildComponentsResourcePayload(indexes) {
  const page = buildComponentSummaries(indexes, { limit: 200 });
  const componentsByCategory = {};
  for (const item of page.items) {
    const cat = String(item?.category ?? 'Other');
    componentsByCategory[cat] = (componentsByCategory[cat] ?? 0) + 1;
  }
  return {
    total: page.total,
    componentsByCategory,
    components: page.items,
  };
}

export function resolveDeclByComponent(indexes, component, prefix) {
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

  const byComponentId = findDeclByComponentId(indexes, component);
  if (byComponentId) return byComponentId;

  // Auto-prefix: try with canonical prefix if bare name was given (DIG-15)
  const comp = typeof component === 'string' ? component.trim().toLowerCase() : '';
  const p = normalizePrefix(prefix);
  if (comp && !comp.startsWith(p)) {
    const prefixed = `${p}-${comp}`;
    const byPrefixed = pickDecl(indexes, { tagName: prefixed, prefix: p });
    if (byPrefixed) {
      const canonicalTag = typeof byPrefixed.tagName === 'string' ? byPrefixed.tagName.toLowerCase() : undefined;
      return {
        decl: byPrefixed,
        modulePath: canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : undefined,
      };
    }
  }

  return undefined;
}

export function buildComponentNotFoundError(component, indexes, prefix) {
  const comp = typeof component === 'string' ? component.trim() : '';
  const p = normalizePrefix(prefix);
  const suggestions = [];

  if (comp && !comp.toLowerCase().startsWith(p)) {
    const prefixed = `${p}-${comp.toLowerCase()}`;
    if (indexes.byTag.has(prefixed)) {
      suggestions.push(prefixed);
    }
  }

  const suggested = suggestUnknownElementTagName(comp.includes('-') ? comp : `${p}-${comp}`, indexes.byTag);
  if (suggested && !suggestions.includes(suggested)) {
    suggestions.push(suggested);
  }

  const msg = suggestions.length > 0
    ? `Component not found: ${comp}. Did you mean: ${suggestions.join(', ')}?`
    : `Component not found: ${comp}`;
  return { content: [{ type: 'text', text: msg }], isError: true };
}

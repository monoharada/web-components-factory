import fs from 'node:fs/promises';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { collectCemCustomElements, validateTextAgainstCem } from '../wc/validator-core.mjs';

const CANONICAL_PREFIX = 'dads';
const DEFAULT_CEM_PATH = path.resolve(process.cwd(), 'custom-elements.json');
const DEFAULT_INSTALL_REGISTRY_PATH = path.resolve(process.cwd(), 'registry/install-registry.json');
const DEFAULT_PATTERN_REGISTRY_PATH = path.resolve(process.cwd(), 'registry/pattern-registry.json');

function normalizePrefix(prefix) {
  if (typeof prefix !== 'string' || prefix.trim() === '') return CANONICAL_PREFIX;
  return prefix.trim().toLowerCase();
}

function withPrefix(tagName, prefix) {
  if (typeof tagName !== 'string') return tagName;
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return tagName;
  const from = `${CANONICAL_PREFIX}-`;
  if (!tagName.startsWith(from)) return tagName;
  return `${p}-${tagName.slice(from.length)}`;
}

function toCanonicalTagName(tagName, prefix) {
  if (typeof tagName !== 'string') return undefined;
  const raw = tagName.trim().toLowerCase();
  if (!raw) return undefined;
  if (raw.startsWith(`${CANONICAL_PREFIX}-`)) return raw;

  const p = normalizePrefix(prefix);
  if (p !== CANONICAL_PREFIX && raw.startsWith(`${p}-`)) {
    return `${CANONICAL_PREFIX}-${raw.slice(p.length + 1)}`;
  }

  return raw;
}

function findCustomElementDeclarations(manifest) {
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

function buildIndexes(manifest) {
  const decls = findCustomElementDeclarations(manifest);

  /** @type {Map<string, any>} */
  const byTag = new Map();
  /** @type {Map<string, any>} */
  const byClass = new Map();
  /** @type {Map<string, string | undefined>} */
  const modulePathByTag = new Map();

  for (const { decl, tagName, modulePath } of decls) {
    if (!byTag.has(tagName)) byTag.set(tagName, decl);
    if (typeof decl?.name === 'string' && !byClass.has(decl.name)) byClass.set(decl.name, decl);
    if (!modulePathByTag.has(tagName)) modulePathByTag.set(tagName, modulePath);
  }

  return { byTag, byClass, modulePathByTag, decls };
}

function pickDecl({ byTag, byClass }, { tagName, className, prefix }) {
  if (typeof tagName === 'string' && tagName.trim() !== '') {
    const canonical = toCanonicalTagName(tagName, prefix);
    if (canonical && byTag.has(canonical)) return byTag.get(canonical);
  }

  if (typeof className === 'string' && className.trim() !== '' && byClass.has(className.trim())) {
    return byClass.get(className.trim());
  }

  return undefined;
}

function serializeApi(decl, modulePath, prefix) {
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

function generateSnippet(api, prefix) {
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

function findDeclByComponentId(indexes, componentIdRaw) {
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

function applyPrefixToCemIndex(cemIndex, prefix) {
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return cemIndex;

  /** @type {Map<string, { attributes: Set<string> }>} */
  const out = new Map();

  for (const [tag, meta] of cemIndex.entries()) {
    const nextTag = withPrefix(tag, p);
    out.set(nextTag, meta);
  }

  return out;
}

async function loadCem(cemPath) {
  const abs = path.resolve(process.cwd(), cemPath);
  const text = await fs.readFile(abs, 'utf8');
  return JSON.parse(text);
}

async function loadJson(absPath) {
  const text = await fs.readFile(absPath, 'utf8');
  return JSON.parse(text);
}

function applyPrefixToHtml(html, prefix) {
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return String(html ?? '');
  const from = `${CANONICAL_PREFIX}-`;
  const to = `${p}-`;

  // Patterns are constrained to plain HTML snippets without <script>/<style>,
  // so a tag-level replace is sufficient and deterministic.
  return String(html ?? '').replace(
    new RegExp(`<\\s*(\\/?)\\s*${from}([a-z0-9-]+)(?=[\\s/>])`, 'gi'),
    (_m, slash, rest) => `<${slash ?? ''}${to}${String(rest).toLowerCase()}`,
  );
}

function loadPatternRegistryShape(raw) {
  if (!raw || typeof raw !== 'object') return { patterns: {} };
  const patterns = raw.patterns && typeof raw.patterns === 'object' ? raw.patterns : {};
  return { patterns };
}

function resolveComponentClosure({ installRegistry }, componentIds) {
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

async function main() {
  const manifest = await loadCem(DEFAULT_CEM_PATH);
  const indexes = buildIndexes(manifest);
  const canonicalCemIndex = collectCemCustomElements(manifest);
  const installRegistry = await loadJson(DEFAULT_INSTALL_REGISTRY_PATH);
  const patternRegistry = await loadJson(DEFAULT_PATTERN_REGISTRY_PATH);
  const { patterns } = loadPatternRegistryShape(patternRegistry);

  const server = new McpServer({
    name: 'web-components-factory-design-system',
    version: '0.1.0',
  });

  server.registerTool(
    'list_components',
    {
      description: 'List custom elements in the design system (from custom-elements.json).',
      inputSchema: {
        prefix: z.string().optional(),
      },
    },
    async ({ prefix }) => {
      const p = normalizePrefix(prefix);
      const list = indexes.decls.map(({ decl, tagName, modulePath }) => ({
        tagName: withPrefix(tagName, p),
        className: typeof decl?.name === 'string' ? decl.name : undefined,
        description: typeof decl?.description === 'string' ? decl.description : undefined,
        modulePath,
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(list, null, 2) }],
      };
    },
  );

  server.registerTool(
    'get_component_api',
    {
      description:
        'Get a single component API (attributes/slots/events/cssParts/cssProperties) by tagName or className.',
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
              text: `Component not found (tagName=${String(tagName ?? '')}, className=${String(
                className ?? '',
              )})`,
            },
          ],
          isError: true,
        };
      }

      const canonicalTag = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : undefined;
      const modulePath = canonicalTag ? indexes.modulePathByTag.get(canonicalTag) : undefined;
      const api = serializeApi(decl, modulePath, prefix);

      return {
        content: [{ type: 'text', text: JSON.stringify(api, null, 2) }],
      };
    },
  );

  server.registerTool(
    'generate_usage_snippet',
    {
      description: 'Generate a minimal usage snippet for a component.',
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

  server.registerTool(
    'get_install_recipe',
    {
      description:
        'Get an install recipe (componentId/deps/define + usage snippet) from CEM custom metadata.',
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
              text:
                'Install metadata not found in CEM. Run `npm run cem:analyze` and ensure `decl.custom.install` is injected.',
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

  server.registerTool(
    'validate_markup',
    {
      description:
        'Validate an HTML snippet against CEM (unknownElement=error, unknownAttribute=warning).',
      inputSchema: {
        html: z.string(),
        prefix: z.string().optional(),
      },
    },
    async ({ html, prefix }) => {
      const p = normalizePrefix(prefix);
      // When a prefix is specified, allow validating both:
      // - canonical tags (dads-*)
      // - prefixed tags (<prefix>-*)
      let cemIndex = canonicalCemIndex;
      if (p !== CANONICAL_PREFIX) {
        const combined = new Map(canonicalCemIndex);
        const prefixed = applyPrefixToCemIndex(canonicalCemIndex, p);
        for (const [tag, meta] of prefixed.entries()) combined.set(tag, meta);
        cemIndex = combined;
      }

      const diagnostics = validateTextAgainstCem({
        filePath: '<markup>',
        text: html,
        cem: cemIndex,
        severity: {
          unknownElement: 'error',
          unknownAttribute: 'warning',
        },
      }).map((d) => ({
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

  server.registerTool(
    'list_patterns',
    {
      description: 'List UI patterns (recipes) from registry/pattern-registry.json.',
      inputSchema: {
        // reserved for future filtering
      },
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

  server.registerTool(
    'get_pattern_recipe',
    {
      description:
        'Get a pattern recipe (required componentIds + resolved HTML snippet). Use this to drive wcf installs + UI composition.',
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

  server.registerTool(
    'generate_pattern_snippet',
    {
      description: 'Generate a pattern HTML snippet. (Same as get_pattern_recipe().html)',
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

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

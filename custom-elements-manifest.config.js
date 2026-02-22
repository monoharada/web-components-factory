import { cemValidatorPlugin } from '@wc-toolkit/cem-validator';
import { cemInheritancePlugin } from '@wc-toolkit/cem-inheritance';
import { cemSorterPlugin } from '@wc-toolkit/cem-sorter';
import { modulePathResolverPlugin } from '@wc-toolkit/module-path-resolver';
import { readFileSync } from 'node:fs';
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const A11Y_ANNOTATIONS_PATH = new URL('./docs/knowledge/a11y-annotations.json', import.meta.url);
const A11Y_ANNOTATIONS = JSON.parse(readFileSync(A11Y_ANNOTATIONS_PATH, 'utf-8'));
const OVERRIDES_PATH = new URL('./registry/overrides.json', import.meta.url);
const CANONICAL_PREFIX = 'dads';

function loadOverrides() {
  try {
    const raw = JSON.parse(readFileSync(OVERRIDES_PATH, 'utf-8'));
    const schemaVersion = Number(raw?.schemaVersion);
    if (schemaVersion !== 1) return { schemaVersion: 1, components: {} };
    const components = raw?.components && typeof raw.components === 'object' ? raw.components : {};
    return { schemaVersion: 1, components };
  } catch {
    return { schemaVersion: 1, components: {} };
  }
}

const OVERRIDES = loadOverrides();

function listComponentIds() {
  const base = path.resolve(process.cwd(), 'packages/components');
  if (!existsSync(base)) return [];
  const entries = readdirSync(base, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    // Convention: componentId is the directory name under packages/components/
    out.push(e.name);
  }
  out.sort();
  return out;
}

const KNOWN_COMPONENT_IDS = new Set(listComponentIds());

function inferComponentIdFromModulePath(modulePath) {
  if (typeof modulePath !== 'string') return undefined;
  // modulePath is normalized to posix + "./" by modulePathResolverPlugin.
  const m = modulePath.match(/^(?:\.\/)?packages\/components\/([^/]+)\//);
  return m?.[1];
}

function isCustomElementDecl(decl) {
  const tagName = typeof decl?.tagName === 'string' ? decl.tagName.trim().toLowerCase() : '';
  const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
  return isCustomElement && tagName.length > 0;
}

function isCanonicalTag(tagName) {
  return typeof tagName === 'string' && tagName.startsWith(`${CANONICAL_PREFIX}-`);
}

function walkFiles(dirAbs, predicate) {
  /** @type {string[]} */
  const out = [];
  const entries = readdirSync(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dirAbs, e.name);
    if (e.isDirectory()) {
      out.push(...walkFiles(p, predicate));
      continue;
    }
    if (!e.isFile()) continue;
    if (predicate(p)) out.push(p);
  }
  return out;
}

function pickDefineFile(componentId) {
  const dirAbs = path.resolve(process.cwd(), 'packages/components', componentId);
  const preferred = path.join(dirAbs, `${componentId}-define.ts`);
  if (existsSync(preferred) && statSync(preferred).isFile()) return preferred;

  const files = walkFiles(dirAbs, (p) => p.endsWith('-define.ts') && !p.endsWith('.test.ts') && !p.endsWith('-define-base.ts'));
  files.sort();
  return files[0];
}

function pickDefineExportName(text) {
  if (typeof text !== 'string') return undefined;
  const re = /export function (define[A-Za-z0-9_]*)\s*\(/g;
  const names = [];
  for (let m = re.exec(text); m; m = re.exec(text)) {
    names.push(m[1]);
  }
  for (const n of names) {
    if (!n.startsWith('defineDefault')) return n;
  }
  return undefined;
}

function inferDefineCallStyle(defineText, defineName) {
  if (typeof defineText !== 'string' || typeof defineName !== 'string') return 'none';

  const sourceFile = ts.createSourceFile('define.ts', defineText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  /** @type {import('typescript').FunctionDeclaration | undefined} */
  let target;

  sourceFile.forEachChild((node) => {
    if (target) return;
    if (!ts.isFunctionDeclaration(node)) return;
    if (!node.name || node.name.text !== defineName) return;
    target = node;
  });

  // If we can't find a concrete function declaration (unexpected), fall back to a permissive heuristic.
  if (!target) {
    if (new RegExp(`\\b${defineName}\\b`).test(defineText) && /\bprefix\b/.test(defineText) && /\bregistry\b/.test(defineText)) {
      return 'prefix-registry';
    }
    if (new RegExp(`\\b${defineName}\\b`).test(defineText) && /\bregistry\b/.test(defineText)) return 'registry';
    return 'none';
  }

  const params = Array.isArray(target.parameters) ? target.parameters : [];
  if (params.length === 0) return 'none';

  const paramNames = params.map((p) => (ts.isIdentifier(p.name) ? p.name.text : p.name.getText(sourceFile)));
  const first = String(paramNames[0] ?? '');

  if (first === 'prefix') return 'prefix-registry';
  if (first === 'registry') return 'registry';

  // We enforce a stable calling convention. Non-standard signatures must be documented via overrides.
  if (paramNames.includes('prefix') || paramNames.includes('registry')) {
    throw new Error(
      `wcf-install-metadata: unsupported define signature for ${defineName}(${paramNames.join(', ')}). ` +
        'Expected first param to be "prefix" or "registry". Use registry/overrides.json for exceptions.',
    );
  }

  return 'none';
}

function extractDepsFromText(text, componentId) {
  const deps = new Set();
  if (typeof text !== 'string') return deps;

  // Catch both static imports and dynamic imports that refer to "*-define.js".
  // Examples:
  //  - "../menu-list/menu-list-define.js"
  //  - "../calendar/calendar-lite-define.js"
  const re = /['"]\.\.\/([^/'"]+)\/[^'"]*?-define(?:-[^'"]+)?\.js['"]/g;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const dep = String(m[1] ?? '').trim();
    if (!dep || dep === componentId) continue;
    if (!KNOWN_COMPONENT_IDS.has(dep)) continue;
    deps.add(dep);
  }
  return deps;
}

function inferDeps(componentId) {
  const dirAbs = path.resolve(process.cwd(), 'packages/components', componentId);
  const files = walkFiles(dirAbs, (p) => p.endsWith('.ts') && !p.endsWith('.test.ts'));
  files.sort();
  const deps = new Set();

  for (const fileAbs of files) {
    const text = readFileSync(fileAbs, 'utf-8');
    const found = extractDepsFromText(text, componentId);
    for (const d of found) deps.add(d);
  }

  return Array.from(deps).sort();
}

function applyComponentOverride(componentId, inferred) {
  const o = OVERRIDES?.components?.[componentId];
  if (!o || typeof o !== 'object') return inferred;

  const hasAnyOverride = o.define || o.deps || o.source;
  if (hasAnyOverride && (typeof o.reason !== 'string' || o.reason.trim() === '')) {
    throw new Error(`overrides.json: components.${componentId} is missing a required "reason"`);
  }

  const out = { ...inferred };

  if (typeof o.define === 'string' && o.define.trim() !== '') out.define = o.define.trim();
  if (Array.isArray(o.deps)) {
    const next = new Set(out.deps);
    for (const d of o.deps) {
      if (typeof d !== 'string') continue;
      const dep = d.trim();
      if (!dep || dep === componentId) continue;
      if (!KNOWN_COMPONENT_IDS.has(dep)) continue;
      next.add(dep);
    }
    out.deps = Array.from(next).sort();
  }
  if (o.source && typeof o.source === 'object') {
    const componentDir = typeof o.source.componentDir === 'string' ? o.source.componentDir.trim() : '';
    if (componentDir) out.source = { componentDir };
  }

  return out;
}

/**
 * Extract `--dads-{component}-*` CSS custom properties from token/style files
 * and inject them into `decl.cssProperties`.
 *
 * Naming convention:
 *   `--dads-{component}-*` → public API (included in CEM)
 *   `--{component}-*`      → internal (excluded)
 *   `--spacing-*` etc.     → global tokens (excluded)
 *
 * JSDoc `@cssprop` entries take priority — tokens from files are only
 * added when no existing entry with the same name exists.
 */
function extractPublicCssProperties(componentDir, componentId) {
  const cwd = process.cwd();
  const dirAbs = path.resolve(cwd, componentDir);
  const candidates = [
    path.join(dirAbs, `${componentId}-tokens.ts`),
    path.join(dirAbs, `${componentId}-styles.ts`),
  ];

  /** @type {Map<string, string>} name → description */
  const found = new Map();

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;
    const text = readFileSync(filePath, 'utf-8');

    // Match lines like:
    //   --dads-button-background: ...;
    //   --dads-button-background: ...; /* description */
    // Also match in var() references for :host definitions:
    //   var(--dads-button-width, auto)
    // We use a broad regex first, then deduplicate.
    const varRe = /--dads-[\w-]+/g;
    for (let m = varRe.exec(text); m; m = varRe.exec(text)) {
      const name = m[0];
      if (found.has(name)) continue;
      found.set(name, '');
    }

    // Extract descriptions from same-line inline comments.
    // Pattern 1: Token declaration — --dads-foo-bar: value; /* Description */
    const declLineRe = /^\s*(--dads-[\w-]+)\s*:\s*[^;\n]*;[ \t]*\/\*\s*(.+?)\s*\*\//gm;
    for (let m = declLineRe.exec(text); m; m = declLineRe.exec(text)) {
      const name = m[1];
      const desc = m[2]?.trim() ?? '';
      if (desc && found.has(name) && !found.get(name)) {
        found.set(name, desc);
      }
    }

    // Pattern 2: Usage in var() — property: var(--dads-foo-bar, fallback); /* Description */
    const varUsageRe = /var\((--dads-[\w-]+)[^)]*\)[^;\n]*;[ \t]*\/\*\s*(.+?)\s*\*\//gm;
    for (let m = varUsageRe.exec(text); m; m = varUsageRe.exec(text)) {
      const name = m[1];
      const desc = m[2]?.trim() ?? '';
      if (desc && found.has(name) && !found.get(name)) {
        found.set(name, desc);
      }
    }

    // NOTE: Preceding-line comments (/* ... */ above the declaration) are NOT
    // extracted because they often contain section headers or implementation
    // notes rather than property descriptions. Use inline comments only.
  }

  // Filter to only properties that start with the component-specific prefix.
  // e.g. for componentId "button", keep only --dads-button-*
  // Some components use a shorter prefix (e.g. "input-text" → "--dads-input-*").
  // We try the full prefix first, then fall back to shorter segments.
  const fullPrefix = `--dads-${componentId}-`;
  let componentPrefix = fullPrefix;
  const hasFullMatch = [...found.keys()].some((n) => n.startsWith(fullPrefix));
  if (!hasFullMatch) {
    // Try shorter prefixes: "input-text" → try "--dads-input-"
    const segments = componentId.split('-');
    for (let i = segments.length - 1; i >= 1; i--) {
      const shorter = `--dads-${segments.slice(0, i).join('-')}-`;
      if ([...found.keys()].some((n) => n.startsWith(shorter))) {
        componentPrefix = shorter;
        break;
      }
    }

    // Guard: warn if the shorter prefix could match other known componentIds.
    if (componentPrefix !== fullPrefix) {
      const shorterBase = componentPrefix.replace('--dads-', '').replace(/-$/, '');
      const conflicting = [...KNOWN_COMPONENT_IDS].filter(
        (id) => id !== componentId && id.startsWith(`${shorterBase}-`),
      );
      if (conflicting.length > 0) {
        console.warn(
          `  [wcf-css-properties-from-tokens] WARNING: ${componentId} uses shorter prefix "${componentPrefix}" ` +
            `which may conflict with: ${conflicting.join(', ')}. Consider renaming tokens to ${fullPrefix}*.`,
        );
      }
    }
  }

  /** @type {{ name: string, description?: string }[]} */
  const result = [];
  for (const [name, description] of found) {
    if (!name.startsWith(componentPrefix)) continue;
    const entry = { name };
    if (description) entry.description = description;
    result.push(entry);
  }

  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

function injectCssPropertiesFromTokens(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];
  let injectedCount = 0;

  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!isCustomElementDecl(decl)) continue;
      const componentId = decl.custom?.componentId;
      const componentDir = decl.custom?.install?.source?.componentDir;
      if (!componentId || !componentDir) continue;

      const extracted = extractPublicCssProperties(componentDir, componentId);
      if (extracted.length === 0) continue;

      // Merge: JSDoc-sourced entries take priority.
      const existing = new Map();
      for (const entry of (decl.cssProperties ?? [])) {
        existing.set(entry.name, entry);
      }

      let added = 0;
      for (const entry of extracted) {
        if (existing.has(entry.name)) continue;
        existing.set(entry.name, entry);
        added++;
      }

      if (added > 0) {
        decl.cssProperties = Array.from(existing.values()).sort((a, b) => a.name.localeCompare(b.name));
        injectedCount++;
      }
    }
  }

  if (injectedCount > 0) {
    console.log(`  [wcf-css-properties-from-tokens] Injected cssProperties for ${injectedCount} declarations`);
  }
}

function injectInstallMetadata(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];

  /** @type {Map<string, Set<string>>} */
  const tagsByComponentId = new Map();
  /** @type {Set<string>} */
  const usedComponentIds = new Set();

  // 1) Discover tags grouped by componentId (from module path).
  for (const mod of modules) {
    const modulePath = typeof mod?.path === 'string' ? mod.path : undefined;
    const componentId = inferComponentIdFromModulePath(modulePath);
    if (!componentId) continue;
    if (!KNOWN_COMPONENT_IDS.has(componentId)) continue;

    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!isCustomElementDecl(decl)) continue;
      const tagName = decl.tagName.trim().toLowerCase();
      if (!isCanonicalTag(tagName)) continue;

      usedComponentIds.add(componentId);
      if (!tagsByComponentId.has(componentId)) tagsByComponentId.set(componentId, new Set());
      tagsByComponentId.get(componentId).add(tagName);
    }
  }

  // 2) Infer define/deps/source per componentId.
  /** @type {Map<string, { define: string, deps: string[], source: { componentDir: string }, tags: string[] }>} */
  const installByComponentId = new Map();

  for (const componentId of Array.from(usedComponentIds).sort()) {
    const tags = Array.from(tagsByComponentId.get(componentId) ?? []).sort();
    const componentDirRel = `packages/components/${componentId}`;

    const defineFile = pickDefineFile(componentId);
    if (!defineFile) {
      throw new Error(
        `wcf-install-metadata: missing "*-define.ts" for componentId="${componentId}" (${componentDirRel})`,
      );
    }

    const defineText = readFileSync(defineFile, 'utf-8');
    const define = pickDefineExportName(defineText);
    if (!define) {
      throw new Error(
        `wcf-install-metadata: could not infer exported define*() from ${path.relative(process.cwd(), defineFile)}`,
      );
    }

    const deps = inferDeps(componentId);
    const call = inferDefineCallStyle(defineText, define);
    const inferred = { id: componentId, define, call, deps, source: { componentDir: componentDirRel }, tags };
    const resolved = applyComponentOverride(componentId, inferred);

    // Final sanity: source must stay within packages/components/<id>
    if (typeof resolved?.source?.componentDir !== 'string' || resolved.source.componentDir.trim() === '') {
      throw new Error(`wcf-install-metadata: invalid source for componentId="${componentId}"`);
    }

    // Keep it deterministic.
    resolved.tags = Array.from(new Set(resolved.tags)).sort();
    resolved.deps = Array.from(new Set(resolved.deps)).sort();
    resolved.define = String(resolved.define);

    installByComponentId.set(componentId, resolved);
  }

  // 3) Inject per-declaration metadata.
  for (const mod of modules) {
    const modulePath = typeof mod?.path === 'string' ? mod.path : undefined;
    const componentId = inferComponentIdFromModulePath(modulePath);
    if (!componentId) continue;
    const install = installByComponentId.get(componentId);
    if (!install) continue;

    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!isCustomElementDecl(decl)) continue;
      const tagName = decl.tagName.trim().toLowerCase();
      if (!isCanonicalTag(tagName)) continue;

      decl.custom = { ...(decl.custom ?? {}), componentId, install };
    }
  }
}

function normalizePosixPath(p) {
  return p.replaceAll('\\', '/');
}

function ensureDotSlash(p) {
  if (p.startsWith('./')) return p;
  return `./${p}`;
}

function sanitizeCustomElementsManifest(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];

  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;

      // Stabilize member object key order for deterministic diffs across Node versions.
      // (The analyzer output can differ in where `inheritedFrom` is inserted relative to `default`.)
      if (Array.isArray(decl.members)) {
        for (const member of decl.members) {
          if (!member || typeof member !== 'object') continue;
          if (!('inheritedFrom' in member) || !('default' in member)) continue;
          const inheritedFrom = member.inheritedFrom;
          // Move `inheritedFrom` to the end of the object.
          delete member.inheritedFrom;
          member.inheritedFrom = inheritedFrom;
        }
      }

      // The analyzer marks any class extending HTMLElement as `customElement: true`.
      // Base classes without a tagName should not be treated as custom elements.
      if (decl.customElement === true) {
        const tagName = typeof decl.tagName === 'string' ? decl.tagName.trim() : '';
        if (!tagName) delete decl.customElement;
      }

      if (typeof decl.tagName === 'string' && decl.tagName.trim() === '') {
        delete decl.tagName;
      }

      // The analyzer currently infers events by inspecting `dispatchEvent(new CustomEvent(...))`.
      // In our base class `emitEvent(type, ...)`, the first argument is an identifier (`type`),
      // which can be misinterpreted as an event name and then inherited to all components.
      if (Array.isArray(decl.events) && decl.events.length > 0) {
        decl.events = decl.events.filter((e) => {
          if (!e || typeof e !== 'object') return false;
          if (e.name !== 'type') return true;
          if (e?.type?.text !== 'CustomEvent') return true;
          const inheritedFrom = e?.inheritedFrom?.name;
          const isFromWebComponent = inheritedFrom === 'WebComponent' || decl.name === 'WebComponent';
          return !isFromWebComponent;
        });
      }
    }
  }
}

function injectA11yAnnotations(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];

  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;
      const tagName = typeof decl.tagName === 'string' ? decl.tagName.trim() : '';
      if (!tagName) continue;
      const annotations = A11Y_ANNOTATIONS[tagName];
      if (!annotations) continue;
      decl.custom = { ...(decl.custom ?? {}), a11yAnnotations: annotations };
      if (Array.isArray(decl.members)) {
        decl.members = decl.members.filter((member) => member?.name !== 'a11yAnnotations');
      }
    }
  }
}

export default {
  globs: ['packages/**/*.ts'],
  exclude: [
    '**/*.test.ts',
    'tests/**',
    'src/**',
    'packages/autoload/**',
  ],
  // We manage package.json "customElements" ourselves for stable diffs.
  packagejson: false,
  plugins: [
    {
      name: 'force-schema-version',
      packageLinkPhase({ customElementsManifest }) {
        // The analyzer currently outputs schemaVersion "1.0.0".
        // Tooling (e.g. cem-validator) expects the latest version string.
        customElementsManifest.schemaVersion = '2.1.0';
      },
    },
    // NOTE: This is intentionally conservative for now (normalize + ensure "./").
    // When we have a formal build output layout, we can map to dist/**/*.js here.
    modulePathResolverPlugin({
      modulePathTemplate(modulePath) {
        return ensureDotSlash(normalizePosixPath(modulePath));
      },
      definitionPathTemplate(modulePath) {
        return ensureDotSlash(normalizePosixPath(modulePath));
      },
      typeDefinitionPathTemplate(modulePath) {
        return ensureDotSlash(normalizePosixPath(modulePath));
      },
    }),
    cemInheritancePlugin(),
    {
      name: 'wcf-a11y-annotations',
      packageLinkPhase({ customElementsManifest }) {
        injectA11yAnnotations(customElementsManifest);
      },
    },
    {
      name: 'wcf-sanitize-manifest',
      packageLinkPhase({ customElementsManifest }) {
        sanitizeCustomElementsManifest(customElementsManifest);
      },
    },
    {
      name: 'wcf-install-metadata',
      packageLinkPhase({ customElementsManifest }) {
        injectInstallMetadata(customElementsManifest);
      },
    },
    {
      name: 'wcf-css-properties-from-tokens',
      packageLinkPhase({ customElementsManifest }) {
        injectCssPropertiesFromTokens(customElementsManifest);
      },
    },
    {
      name: 'wcf-css-properties-coverage',
      packageLinkPhase({ customElementsManifest }) {
        const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];
        const warnings = [];
        for (const mod of modules) {
          for (const decl of (mod.declarations ?? [])) {
            if (!isCustomElementDecl(decl)) continue;
            const componentId = decl.custom?.componentId;
            const componentDir = decl.custom?.install?.source?.componentDir;
            if (!componentId || !componentDir) continue;

            const dirAbs = path.resolve(process.cwd(), componentDir);
            const tokensFile = path.join(dirAbs, `${componentId}-tokens.ts`);
            const stylesFile = path.join(dirAbs, `${componentId}-styles.ts`);
            const hasCssProps = Array.isArray(decl.cssProperties) && decl.cssProperties.length > 0;
            if (hasCssProps) continue;

            // Check whether the source files actually contain --dads-* declarations.
            let sourceWithDads = '';
            for (const f of [tokensFile, stylesFile]) {
              if (!existsSync(f)) continue;
              const text = readFileSync(f, 'utf-8');
              if (/--dads-[\w-]+/.test(text)) { sourceWithDads = path.basename(f); break; }
            }
            if (sourceWithDads) {
              warnings.push(`${decl.tagName}: has --dads-* in ${sourceWithDads} but no cssProperties in CEM`);
            }
          }
        }
        if (warnings.length > 0) {
          console.warn(`  [wcf-css-properties-coverage] ${warnings.length} warning(s):`);
          for (const w of warnings) console.warn(`    ⚠ ${w}`);
        }
      },
    },
    cemValidatorPlugin({
      cemFileName: 'custom-elements.json',
      packageJsonPath: './package.json',
      logErrors: true,
      exclude: [
        // Base classes (not custom elements)
        'WebComponent',
        'TypographyWebComponent',
        'TypographyFormComponent',
      ],
      rules: {
        packageJson: {
          packageType: 'error',
          customElementsProperty: 'error',
          main: 'off',
          module: 'off',
          types: 'off',
          exports: 'off',
          publishedCem: 'off',
        },
        manifest: {
          schemaVersion: 'error',
          tagName: 'error',
          modulePath: 'off',
          definitionPath: 'off',
          typeDefinitionPath: 'off',
          exportTypes: 'off',
        },
      },
    }),
    cemSorterPlugin(),
  ],
};

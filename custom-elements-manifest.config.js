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
const AUTHORING_GUIDANCE_PATH = new URL('./docs/knowledge/authoring-guidance.json', import.meta.url);
const AUTHORING_GUIDANCE = JSON.parse(readFileSync(AUTHORING_GUIDANCE_PATH, 'utf-8'));
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
    out.push(e.name);
  }
  out.sort();
  return out;
}

const KNOWN_COMPONENT_IDS = new Set(listComponentIds());

function inferComponentIdFromModulePath(modulePath) {
  if (typeof modulePath !== 'string') return undefined;
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

  let target;

  sourceFile.forEachChild((node) => {
    if (target) return;
    if (!ts.isFunctionDeclaration(node)) return;
    if (!node.name || node.name.text !== defineName) return;
    target = node;
  });

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

const CSS_PROPERTY_PREFIX_OVERRIDES = new Map([
  ['input-text', '--dads-input-'],
]);

function extractPublicCssProperties(componentDir, componentId) {
  const cwd = process.cwd();
  const dirAbs = path.resolve(cwd, componentDir);
  const candidates = [
    path.join(dirAbs, `${componentId}-tokens.ts`),
    path.join(dirAbs, `${componentId}-styles.ts`),
  ];

  const componentPrefix = CSS_PROPERTY_PREFIX_OVERRIDES.get(componentId) ?? `--dads-${componentId}-`;
  const found = new Map();

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;
    const text = readFileSync(filePath, 'utf-8');

    const varRe = /--dads-[\w-]+/g;
    for (let m = varRe.exec(text); m; m = varRe.exec(text)) {
      const name = m[0];
      if (!name.startsWith(componentPrefix)) continue;
      if (found.has(name)) continue;
      found.set(name, '');
    }

    const declLineRe = /^\s*(--dads-[\w-]+)\s*:\s*[^;\n]*;[ \t]*\/\*\s*(.+?)\s*\*\//gm;
    for (let m = declLineRe.exec(text); m; m = declLineRe.exec(text)) {
      const name = m[1];
      if (!name.startsWith(componentPrefix)) continue;
      const desc = m[2]?.trim() ?? '';
      if (desc && found.has(name) && !found.get(name)) {
        found.set(name, desc);
      }
    }

    const varUsageRe = /var\((--dads-[\w-]+)[^)]*\)[^;\n]*;[ \t]*\/\*\s*(.+?)\s*\*\//gm;
    for (let m = varUsageRe.exec(text); m; m = varUsageRe.exec(text)) {
      const name = m[1];
      if (!name.startsWith(componentPrefix)) continue;
      const desc = m[2]?.trim() ?? '';
      if (desc && found.has(name) && !found.get(name)) {
        found.set(name, desc);
      }
    }
  }

  const result = [];
  for (const [name, description] of found) {
    const entry = { name };
    if (description) entry.description = description;
    result.push(entry);
  }

  result.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
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
        decl.cssProperties = Array.from(existing.values()).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        injectedCount++;
      }
    }
  }

  if (injectedCount > 0) {
    console.log(`  [wcf-css-properties-from-tokens] Injected cssProperties for ${injectedCount} declarations`);
  }
}

function inferInstallMetadata(decl) {
  const tagName = typeof decl?.tagName === 'string' ? decl.tagName.trim().toLowerCase() : '';
  const modulePath = typeof decl?.modulePath === 'string' ? decl.modulePath : undefined;
  const componentId = inferComponentIdFromModulePath(modulePath);
  if (!tagName || !componentId || !KNOWN_COMPONENT_IDS.has(componentId) || !isCanonicalTag(tagName)) return undefined;

  const override = OVERRIDES.components?.[componentId];
  if (override) {
    return {
      id: componentId,
      define: override.define ?? undefined,
      call: override.call ?? undefined,
      deps: Array.isArray(override.deps) ? override.deps : [],
      source: {
        componentDir: `packages/components/${componentId}`,
      },
      tags: [tagName],
    };
  }

  const defineFile = pickDefineFile(componentId);
  if (!defineFile) return { id: componentId, deps: [], source: { componentDir: `packages/components/${componentId}` }, tags: [tagName] };

  const defineText = readFileSync(defineFile, 'utf-8');
  const defineName = pickDefineExportName(defineText);
  if (!defineName) {
    throw new Error(
      `wcf-install-metadata: could not infer exported define*() from ${path.relative(process.cwd(), defineFile)}`,
    );
  }
  const deps = inferDeps(componentId);
  const call = inferDefineCallStyle(defineText, defineName);
  const inferred = { id: componentId, define: defineName, call, deps, source: { componentDir: `packages/components/${componentId}` }, tags: [tagName] };
  return applyComponentOverride(componentId, inferred);
}

function injectInstallMetadata(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];
  const tagsByComponentId = new Map();
  const usedComponentIds = new Set();

  for (const mod of modules) {
    const modulePath = typeof mod?.path === 'string' ? mod.path : undefined;
    const componentId = inferComponentIdFromModulePath(modulePath);
    if (!componentId || !KNOWN_COMPONENT_IDS.has(componentId)) continue;

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

  const installByComponentId = new Map();
  for (const componentId of Array.from(usedComponentIds).sort()) {
    const tags = Array.from(tagsByComponentId.get(componentId) ?? []).sort();
    const install = inferInstallMetadata({
      tagName: tags[0],
      modulePath: `./packages/components/${componentId}/`,
    });
    if (!install) continue;
    install.tags = Array.from(new Set(tags)).sort();
    install.deps = Array.from(new Set(install.deps)).sort();
    install.define = String(install.define);
    installByComponentId.set(componentId, install);
  }

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
      if (Array.isArray(decl.members)) {
        for (const member of decl.members) {
          if (!member || typeof member !== 'object') continue;
          if (!('inheritedFrom' in member) || !('default' in member)) continue;
          const inheritedFrom = member.inheritedFrom;
          delete member.inheritedFrom;
          member.inheritedFrom = inheritedFrom;
        }
      }

      if (decl.customElement === true) {
        const tagName = typeof decl.tagName === 'string' ? decl.tagName.trim() : '';
        if (!tagName) delete decl.customElement;
      }

      if (typeof decl.tagName === 'string' && decl.tagName.trim() === '') {
        delete decl.tagName;
      }

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

const USAGE_SNIPPET_MAP = {
  'dads-tab': `<dads-tab orientation="top">
  <div data-tab-label="タブ1">タブ1の内容</div>
  <div data-tab-label="タブ2">タブ2の内容</div>
  <div data-tab-label="タブ3">タブ3の内容</div>
</dads-tab>`,
  'dads-table': `<!-- 基本テーブル -->
<dads-table>
  <table>
    <thead>
      <tr>
        <th scope="col">項目</th>
        <th scope="col">値</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>サンプル</td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</dads-table>

<!-- ソート + 行選択 -->
<dads-table selectable hover sort-behavior="dom">
  <table>
    <thead>
      <tr>
        <th scope="col"><input type="checkbox" data-select-all aria-label="表示中の行をすべて選択" /></th>
        <th scope="col" data-sort-type="string"><button type="button" data-sort>氏名</button></th>
        <th scope="col" data-sort-type="number"><button type="button" data-sort>金額</button></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="checkbox" data-select-row aria-label="行を選択: A001" /></td>
        <td>山田 太郎</td>
        <td data-sort-value="1200">1,200</td>
      </tr>
    </tbody>
  </table>
</dads-table>`,
  'dads-heading': `<!-- ページ見出し -->
<dads-heading level="1" size="36">申請一覧</dads-heading>

<!-- typeset コンテナ内の節見出し -->
<main data-dads-typeset>
  <dads-heading level="2" size="24" margin="top">基本情報</dads-heading>
</main>`,
  'dads-resource-list': `<dads-resource-list
  href="/files/guide.pdf"
  download
  data-interaction="whole"
  data-style="frame"
>
  <span slot="title">申請ガイド（PDF）</span>
  <span slot="support">PDF 1.2MB</span>
</dads-resource-list>`,
};

function injectUsageSnippets(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!isCustomElementDecl(decl)) continue;
      const tagName = typeof decl.tagName === 'string' ? decl.tagName.trim().toLowerCase() : '';
      const snippet = USAGE_SNIPPET_MAP[tagName];
      if (!snippet) continue;
      decl.custom = { ...(decl.custom ?? {}), usageSnippet: snippet };
    }
  }
}

function injectAuthoringGuidance(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!isCustomElementDecl(decl)) continue;
      const tagName = typeof decl.tagName === 'string' ? decl.tagName.trim().toLowerCase() : '';
      const guidance = AUTHORING_GUIDANCE[tagName];
      if (!guidance) continue;
      decl.custom = { ...(decl.custom ?? {}), authoringGuidance: guidance };
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
    '**/node_modules/**',
    'tests/**',
    'src/**',
    'packages/autoload/**',
  ],
  packagejson: false,
  plugins: [
    {
      name: 'force-schema-version',
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest.schemaVersion = '2.1.0';
      },
    },
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
      name: 'wcf-usage-snippets',
      packageLinkPhase({ customElementsManifest }) {
        injectUsageSnippets(customElementsManifest);
      },
    },
    {
      name: 'wcf-authoring-guidance',
      packageLinkPhase({ customElementsManifest }) {
        injectAuthoringGuidance(customElementsManifest);
      },
    },
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

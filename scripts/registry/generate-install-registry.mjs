import fs from 'node:fs/promises';
import path from 'node:path';

const CANONICAL_PREFIX = 'dads-';

function getArgValue(argv, name) {
  const idx = argv.findIndex((a) => a === `--${name}`);
  if (idx < 0) return undefined;
  return argv[idx + 1];
}

function isCustomElementDecl(decl) {
  if (!decl || typeof decl !== 'object') return false;
  const isCustomElement = decl.customElement === true || decl.kind === 'custom-element';
  return isCustomElement && typeof decl.tagName === 'string' && decl.tagName.trim() !== '';
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.map((t) => String(t).trim().toLowerCase()).filter((t) => t !== '').sort();
}

function stableJsonStringify(data) {
  return JSON.stringify(data, null, 2) + '\n';
}

function buildInstallRegistryFromCem(cem) {
  const modules = Array.isArray(cem?.modules) ? cem.modules : [];

  /** @type {Map<string, any>} */
  const components = new Map();
  /** @type {Map<string, string>} */
  const tags = new Map();

  for (const mod of modules) {
    const decls = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of decls) {
      if (!isCustomElementDecl(decl)) continue;
      const tagName = String(decl.tagName).trim().toLowerCase();
      if (!tagName.startsWith(CANONICAL_PREFIX)) continue;

      const install = decl?.custom?.install;
      if (!install || typeof install !== 'object') {
        throw new Error(`Missing decl.custom.install for <${tagName}>`);
      }

      const id = String(install.id ?? '').trim();
      if (!id) throw new Error(`Missing install.id for <${tagName}>`);

      const next = {
        id,
        tags: normalizeTags(install.tags),
        define: String(install.define ?? '').trim(),
        call: String(install.call ?? '').trim(),
        deps: Array.isArray(install.deps) ? install.deps.map((d) => String(d).trim()).filter(Boolean).sort() : [],
        source: install.source ?? {},
      };

      if (!next.define) throw new Error(`Missing install.define for componentId="${id}" (<${tagName}>)`);

      const prev = components.get(id);
      if (!prev) components.set(id, next);
      else if (stableJsonStringify(prev) !== stableJsonStringify(next)) {
        throw new Error(`Inconsistent install metadata within componentId="${id}"`);
      }

      tags.set(tagName, id);
    }
  }

  const componentIds = Array.from(components.keys()).sort();
  const tagsSorted = Array.from(tags.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const out = {
    schemaVersion: 1,
    canonicalPrefix: 'dads',
    components: Object.fromEntries(componentIds.map((id) => [id, components.get(id)])),
    tags: Object.fromEntries(tagsSorted),
  };

  return out;
}

async function main() {
  const argv = process.argv.slice(2);
  const cemPath = getArgValue(argv, 'cem') ?? 'custom-elements.json';
  const outPath = getArgValue(argv, 'out') ?? 'registry/install-registry.json';
  const check = argv.includes('--check');

  const absCem = path.resolve(process.cwd(), cemPath);
  const absOut = path.resolve(process.cwd(), outPath);

  const cemText = await fs.readFile(absCem, 'utf8');
  const cem = JSON.parse(cemText);

  const registry = buildInstallRegistryFromCem(cem);
  const nextText = stableJsonStringify(registry);

  if (check) {
    let cur = '';
    try {
      cur = await fs.readFile(absOut, 'utf8');
    } catch {
      // missing
    }
    if (cur !== nextText) {
      console.error('[registry] install-registry.json is out of date. Run: npm run registry:generate');
      process.exit(1);
    }
    console.log('[registry] install registry OK');
    return;
  }

  await fs.mkdir(path.dirname(absOut), { recursive: true });
  await fs.writeFile(absOut, nextText, 'utf8');
  console.log(`[registry] wrote ${path.relative(process.cwd(), absOut)}`);
}

main().catch((err) => {
  console.error(err?.message ?? String(err));
  process.exit(1);
});


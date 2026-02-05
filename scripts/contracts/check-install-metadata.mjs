import fs from 'node:fs/promises';
import path from 'node:path';

const CANONICAL_PREFIX = 'dads-';
const VALID_CALL_STYLES = new Set(['none', 'registry', 'prefix-registry']);

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

function inferComponentIdFromModulePath(modulePath) {
  if (typeof modulePath !== 'string') return undefined;
  const m = modulePath.match(/^(?:\.\/)?packages\/components\/([^/]+)\//);
  return m?.[1];
}

async function listComponentIds() {
  const base = path.resolve(process.cwd(), 'packages/components');
  const entries = await fs.readdir(base, { withFileTypes: true });
  const out = [];
  for (const e of entries) if (e.isDirectory()) out.push(e.name);
  out.sort();
  return out;
}

async function dirExists(p) {
  try {
    const st = await fs.stat(p);
    return st.isDirectory();
  } catch {
    return false;
  }
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.map((t) => String(t).trim().toLowerCase()).filter((t) => t !== '').sort();
}

async function main() {
  const argv = process.argv.slice(2);
  const cemPath = getArgValue(argv, 'cem') ?? 'custom-elements.json';
  const absCem = path.resolve(process.cwd(), cemPath);

  const knownComponentIds = new Set(await listComponentIds());

  const text = await fs.readFile(absCem, 'utf8');
  const manifest = JSON.parse(text);
  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];

  /** @type {string[]} */
  const errors = [];
  /** @type {Map<string, string>} */
  const tagsById = new Map();

  for (const mod of modules) {
    const modulePath = typeof mod?.path === 'string' ? mod.path : undefined;
    const componentId = inferComponentIdFromModulePath(modulePath);
    if (!componentId) continue;
    if (!knownComponentIds.has(componentId)) continue;

    const decls = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of decls) {
      if (!isCustomElementDecl(decl)) continue;
      const tagName = String(decl.tagName).trim().toLowerCase();
      if (!tagName.startsWith(CANONICAL_PREFIX)) continue;

      const install = decl?.custom?.install;
      if (!install || typeof install !== 'object') {
        errors.push(`missing decl.custom.install for <${tagName}> (componentId=${componentId})`);
        continue;
      }

      const id = String(install.id ?? '').trim();
      if (id !== componentId) {
        errors.push(`install.id mismatch for <${tagName}>: expected "${componentId}", got "${id}"`);
      }

      const define = String(install.define ?? '').trim();
      if (!define) {
        errors.push(`missing install.define for <${tagName}> (componentId=${componentId})`);
      }

      const call = String(install.call ?? '').trim();
      if (!VALID_CALL_STYLES.has(call)) {
        errors.push(
          `invalid/missing install.call for <${tagName}> (componentId=${componentId}): expected one of ${Array.from(VALID_CALL_STYLES)
            .map((s) => `"${s}"`)
            .join(', ')}, got "${call || '(missing)'}"`,
        );
      }

      const tags = normalizeTags(install.tags);
      if (tags.length === 0) {
        errors.push(`missing/empty install.tags for <${tagName}> (componentId=${componentId})`);
      } else if (!tags.includes(tagName)) {
        errors.push(`install.tags does not include "${tagName}" (componentId=${componentId})`);
      }

      const tagsKey = JSON.stringify(tags);
      const prev = tagsById.get(componentId);
      if (!prev) tagsById.set(componentId, tagsKey);
      else if (prev !== tagsKey) {
        errors.push(`install.tags differs within componentId="${componentId}"`);
      }

      const deps = Array.isArray(install.deps) ? install.deps : [];
      for (const d of deps) {
        const dep = String(d ?? '').trim();
        if (!dep) continue;
        if (!knownComponentIds.has(dep)) {
          errors.push(`unknown dep "${dep}" in install.deps for componentId="${componentId}"`);
          continue;
        }
        const depDir = path.resolve(process.cwd(), 'packages/components', dep);
        // eslint-disable-next-line no-await-in-loop
        if (!(await dirExists(depDir))) {
          errors.push(`dep directory missing: packages/components/${dep} (referenced by "${componentId}")`);
        }
      }

      const componentDir = String(install?.source?.componentDir ?? '').trim();
      const expectedDir = `packages/components/${componentId}`;
      if (componentDir !== expectedDir) {
        errors.push(`install.source.componentDir mismatch for "${componentId}": expected "${expectedDir}", got "${componentDir}"`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('[contracts] install metadata errors:');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log('[contracts] install metadata OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

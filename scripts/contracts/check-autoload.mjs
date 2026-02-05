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

async function fileExists(p) {
  try {
    const st = await fs.stat(p);
    return st.isFile();
  } catch {
    return false;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const cemPath = getArgValue(argv, 'cem') ?? 'custom-elements.json';
  const absCem = path.resolve(process.cwd(), cemPath);

  const text = await fs.readFile(absCem, 'utf8');
  const manifest = JSON.parse(text);
  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];

  /** @type {Set<string>} */
  const tags = new Set();

  for (const mod of modules) {
    const decls = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of decls) {
      if (!isCustomElementDecl(decl)) continue;
      const tag = String(decl.tagName).trim().toLowerCase();
      if (!tag.startsWith(CANONICAL_PREFIX)) continue;
      tags.add(tag);
    }
  }

  const missing = [];
  const sortedTags = Array.from(tags).sort();

  for (const tag of sortedTags) {
    const suffix = tag.slice(CANONICAL_PREFIX.length);
    const rel = path.posix.join('packages', 'autoload', 'dads', `${suffix}.ts`);
    const abs = path.resolve(process.cwd(), rel);
    // eslint-disable-next-line no-await-in-loop
    if (!(await fileExists(abs))) missing.push(rel);
  }

  if (missing.length > 0) {
    console.error('[contracts] Missing autoload adapters for canonical tags:');
    for (const p of missing) console.error(`- ${p}`);
    console.error('');
    console.error('Add `packages/autoload/dads/<tag-suffix>.ts` for each missing tag.');
    process.exit(1);
  }

  console.log(`[contracts] autoload adapters OK (${sortedTags.length} tags)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


#!/usr/bin/env node
/**
 * wcf - Web Components Factory installer (shadcn-like)
 *
 * Goal:
 * - Install components into a vendor directory (not node_modules)
 * - No-build friendly (importmap) output: ESM .js files
 * - Deterministic, AI-friendly metadata derived from CEM (custom-elements.json)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import process from 'node:process';
import ts from 'typescript';

const DEFAULT_REPO = 'monoharada/web-components-factory';
const DEFAULT_REF = 'main';
const OWNER_SHARED = '__shared__';
const OWNER_META = '__meta__';

function usage() {
  console.log(
    [
      'wcf - Web Components Factory installer',
      '',
      'Usage:',
      '  wcf init [--prefix dads] [--lang js|ts] [--out vendor/components/<prefix>] [--repo owner/name] [--ref main] [--embed-cem]',
      '  wcf list [--repo owner/name] [--ref main]',
      '  wcf add [componentId...] [--pattern <patternId[,patternId...]>] [--prefix dads] [--lang js|ts] [--out vendor/components/<prefix>] [--repo owner/name] [--ref main] [--embed-cem]',
      '  wcf attach <componentId...>',
      '  wcf remove <componentId...>',
      '  wcf detach <componentId...>',
      '',
      'Notes:',
      '  - This CLI reads install metadata from the upstream install registry (registry/install-registry.json).',
      '  - UI patterns are read from registry/pattern-registry.json. Use --pattern to install by recipe.',
      '  - By default, CEM files are NOT written into vendor. Use --embed-cem if you need local CEM snapshots.',
      '  - Use --force to overwrite locally modified managed files (otherwise detach or attach as appropriate).',
      '  - Default output is no-build friendly ESM (.js) files + importmap snippet.',
      '  - --lang ts vendors TypeScript sources (for bundler/tsc workflows; not directly runnable in browsers).',
    ].join('\n'),
  );
}

function parseArgs(argv) {
  const args = [];
  const flags = Object.create(null);

  function setFlag(name, value) {
    const existing = flags[name];
    if (existing === undefined) {
      flags[name] = value;
      return;
    }
    if (Array.isArray(existing)) {
      existing.push(value);
      return;
    }
    flags[name] = [existing, value];
  }

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--') {
      args.push(...argv.slice(i + 1));
      break;
    }
    if (!a.startsWith('-')) {
      args.push(a);
      continue;
    }
    if (a.startsWith('--')) {
      const name = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        setFlag(name, next);
        i++;
      } else {
        setFlag(name, true);
      }
      continue;
    }
    // short flags not implemented (keep CLI simple)
    setFlag(a.slice(1), true);
  }

  return { args, flags };
}

async function readJson(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

async function writeJson(filePath, data) {
  const text = JSON.stringify(data, null, 2) + '\n';
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, text, 'utf8');
}

async function pathExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function isSubPath(childAbs, parentAbs) {
  const rel = path.relative(parentAbs, childAbs);
  if (rel === '' || rel === '.') return false;
  if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
  return true;
}

function resolveOutDir(outDir, { allowOutsideProject }) {
  const raw = String(outDir ?? '').trim();
  if (!raw) throw new Error('Invalid --out (empty)');

  const cwdAbs = path.resolve(process.cwd());
  const outAbs = path.resolve(cwdAbs, raw);
  const inside = isSubPath(outAbs, cwdAbs);

  if (!inside && !allowOutsideProject) {
    throw new Error(
      `Refusing --out outside the project: ${raw}\n` +
        `- Use a project-relative path (recommended), or pass --allow-outside-project explicitly.`,
    );
  }

  if (outAbs === cwdAbs) {
    throw new Error(`Refusing --out pointing to project root: ${raw}`);
  }

  return { outAbs, outDir: raw, insideProject: inside };
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function normalizePosix(p) {
  return p.replaceAll('\\', '/');
}

function relFromCwd(absPath) {
  return normalizePosix(path.relative(process.cwd(), absPath));
}

function isValidPrefix(prefix) {
  return /^[a-z][a-z0-9-]*$/.test(prefix);
}

function normalizeLang(lang) {
  const v = String(lang ?? 'js').trim().toLowerCase();
  if (v === 'js' || v === 'ts') return v;
  return undefined;
}

function canonicalToPrefixedTag(tagName, prefix) {
  const raw = String(tagName ?? '').trim().toLowerCase();
  if (!raw) return raw;
  if (!raw.startsWith('dads-')) return raw;
  if (!prefix || prefix === 'dads') return raw;
  return `${prefix}-${raw.slice('dads-'.length)}`;
}

function transformCemPrefix(manifest, prefix) {
  if (!prefix || prefix === 'dads') return manifest;
  const out = structuredClone(manifest);
  const modules = Array.isArray(out?.modules) ? out.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;
      if (typeof decl.tagName !== 'string') continue;
      decl.tagName = canonicalToPrefixedTag(decl.tagName, prefix);
    }
  }
  return out;
}

function collectInstallIndex(cem) {
  const modules = Array.isArray(cem?.modules) ? cem.modules : [];
  /** @type {Map<string, any>} */
  const byId = new Map();

  for (const mod of modules) {
    const decls = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of decls) {
      const tagName = typeof decl?.tagName === 'string' ? decl.tagName.trim().toLowerCase() : '';
      const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
      if (!isCustomElement || !tagName.startsWith('dads-')) continue;

      const install = decl?.custom?.install;
      const id = typeof install?.id === 'string' ? install.id.trim() : '';
      if (!id) continue;

      if (!byId.has(id)) byId.set(id, install);
    }
  }

  return byId;
}

function collectInstallIndexFromRegistry(registry) {
  const components = registry?.components && typeof registry.components === 'object' ? registry.components : {};
  /** @type {Map<string, any>} */
  const byId = new Map();
  for (const id of Object.keys(components).sort()) {
    const install = components[id];
    if (!install || typeof install !== 'object') continue;
    if (typeof install.id !== 'string' || install.id.trim() === '') continue;
    byId.set(id, install);
  }
  return byId;
}

function upstreamRegistryUrl(repo, ref) {
  return `https://raw.githubusercontent.com/${repo}/${ref}/registry/install-registry.json`;
}

function upstreamPatternRegistryUrl(repo, ref) {
  return `https://raw.githubusercontent.com/${repo}/${ref}/registry/pattern-registry.json`;
}

async function fetchInstallRegistry({ repo, ref }) {
  const url = upstreamRegistryUrl(repo, ref);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download install registry: ${url} (${res.status})`);
  return JSON.parse(await res.text());
}

async function fetchPatternRegistry({ repo, ref }) {
  const url = upstreamPatternRegistryUrl(repo, ref);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download pattern registry: ${url} (${res.status})`);
  return JSON.parse(await res.text());
}

function parseCsvFlag(value, flagName) {
  if (value === undefined) return [];
  if (value === true) throw new Error(`Missing value for --${flagName}`);
  if (Array.isArray(value)) return value.flatMap((v) => parseCsvFlag(v, flagName));
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function collectPatternRequires(patternRegistry, patternIds) {
  if (!patternIds || patternIds.length === 0) return [];
  const patterns =
    patternRegistry?.patterns && typeof patternRegistry.patterns === 'object' ? patternRegistry.patterns : undefined;
  if (!patterns) throw new Error('Invalid pattern registry (missing "patterns" object).');

  /** @type {string[]} */
  const requires = [];
  for (const rawId of patternIds) {
    const id = String(rawId ?? '').trim();
    if (!id) throw new Error('Invalid --pattern (missing value).');
    const pat = patterns[id];
    if (!pat) throw new Error(`Unknown patternId: ${id}`);
    const req = Array.isArray(pat.requires) ? pat.requires : [];
    for (const r of req) requires.push(String(r));
  }
  return requires;
}

function resolveClosure(requestedIds, byId) {
  /** @type {Set<string>} */
  const out = new Set();
  /** @type {string[]} */
  const queue = [];

  for (const id of requestedIds) {
    if (!id) continue;
    queue.push(id);
  }

  while (queue.length > 0) {
    const id = queue.pop();
    if (!id || out.has(id)) continue;
    const install = byId.get(id);
    if (!install) throw new Error(`Unknown componentId: ${id}`);
    out.add(id);
    const deps = Array.isArray(install.deps) ? install.deps : [];
    for (const d of deps) queue.push(String(d));
  }

  return Array.from(out).sort();
}

function run(cmd, args, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'pipe' });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += String(d)));
    child.stderr.on('data', (d) => (err += String(d)));
    child.on('close', (code) => {
      if (code === 0) resolve({ out, err });
      else reject(new Error(`${cmd} ${args.join(' ')} failed (${code})\n${err}`));
    });
  });
}

function assertTarListingSafe(listingText, { archiveUrl }) {
  const lines = String(listingText ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  for (const p of lines) {
    const n = path.posix.normalize(p.replaceAll('\\', '/'));
    if (!n || n === '.' || n.startsWith('/')) {
      throw new Error(`Unsafe tar entry (absolute/empty): "${p}" from ${archiveUrl}`);
    }
    if (n.split('/').includes('..')) {
      throw new Error(`Unsafe tar entry (..): "${p}" from ${archiveUrl}`);
    }
  }
}

function assertTarNoSymlinks(longListingText, { archiveUrl }) {
  const lines = String(longListingText ?? '')
    .split('\n')
    .map((l) => l.trimEnd())
    .filter(Boolean);

  // Typical: "lrwxr-xr-x ... link -> target"
  for (const line of lines) {
    if (line.startsWith('l') || line.includes(' -> ')) {
      throw new Error(`Refusing to extract tar with symlinks: ${archiveUrl}`);
    }
  }
}

async function fetchUpstreamToTemp({ repo, ref }) {
  const tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-'));
  const dest = path.join(tmpBase, 'upstream');

  // Prefer git (fast, supports refs).
  try {
    await run('git', ['--version']);
    await run('git', ['clone', '--depth', '1', '--branch', ref, `https://github.com/${repo}.git`, dest]);
    return { tmpBase, dest };
  } catch {
    // Fallback: GitHub tarball (assumes ref is a branch/tag/sha resolvable by GitHub).
    const url = `https://codeload.github.com/${repo}/tar.gz/${ref}`;
    const archive = path.join(tmpBase, 'src.tgz');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download upstream tarball: ${url} (${res.status})`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(archive, buf);
    await fs.mkdir(dest, { recursive: true });

    // Safety preflight (tar is an external tool + archive extraction is a common footgun).
    // - refuse absolute/.. entries
    // - refuse symlinks
    const list = await run('tar', ['-tzf', archive]);
    assertTarListingSafe(list.out, { archiveUrl: url });
    const longList = await run('tar', ['-tvzf', archive]);
    assertTarNoSymlinks(longList.out, { archiveUrl: url });

    await run('tar', ['-xzf', archive, '-C', dest, '--strip-components=1']);
    return { tmpBase, dest };
  }
}

async function cleanupTemp(tmpBase) {
  try {
    await fs.rm(tmpBase, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

async function listFilesRecursive(dirAbs) {
  /** @type {string[]} */
  const out = [];
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dirAbs, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFilesRecursive(p)));
      continue;
    }
    if (e.isFile()) out.push(p);
  }
  out.sort();
  return out;
}

async function pickDefineModuleRelFromUpstream(upstreamDir, componentId) {
  const componentDirAbs = path.join(upstreamDir, 'packages/components', componentId);
  const preferred = path.join(componentDirAbs, `${componentId}-define.ts`);
  try {
    const st = await fs.stat(preferred);
    if (st.isFile()) return normalizePosix(path.relative(upstreamDir, preferred));
  } catch {
    // ignore
  }

  const files = await listFilesRecursive(componentDirAbs);
  const candidates = files
    .filter((p) => p.endsWith('-define.ts'))
    .filter((p) => !p.endsWith('.test.ts'))
    .filter((p) => !p.endsWith('-define-base.ts'))
    .sort();

  if (candidates.length === 0) return undefined;
  return normalizePosix(path.relative(upstreamDir, candidates[0]));
}

function transpileTsToEsmJs(tsText, fileName) {
  const res = ts.transpileModule(tsText, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      // Force ESM output for browsers (NodeNext may emit CJS without package context).
      module: ts.ModuleKind.ES2020,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      sourceMap: false,
      inlineSourceMap: false,
      inlineSources: false,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
      preserveValueImports: false,
    },
    fileName,
    reportDiagnostics: true,
  });

  if (Array.isArray(res.diagnostics) && res.diagnostics.length > 0) {
    // Keep it strict; failures should be loud.
    const msgs = res.diagnostics
      .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
      .slice(0, 5)
      .join('\n');
    throw new Error(`TypeScript transpile diagnostics for ${fileName}:\n${msgs}`);
  }

  return res.outputText;
}

async function writeManagedFile(lock, relPath, content, ownerId) {
  const absPath = path.resolve(process.cwd(), relPath);
  const key = relFromCwd(absPath);
  if (lock.detachedIds?.includes(ownerId)) return;

  const existingMeta = lock.files?.[key];
  if (existingMeta && existingMeta.detached !== true) {
    try {
      const onDisk = await fs.readFile(absPath, 'utf8');
      const onDiskHash = sha256(onDisk);
      if (existingMeta.sha256 && onDiskHash !== existingMeta.sha256 && lock.force !== true) {
        throw new Error(
          `Refusing to overwrite locally modified file: ${key}\n` +
            `- If you intended to edit it, run: wcf detach ${ownerId}\n` +
            `- If you want to overwrite anyway, re-run with: --force`,
        );
      }
    } catch (err) {
      // If the file doesn't exist, it's safe to write.
      if (!(err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT')) throw err;
    }
  }
  const hash = sha256(content);
  lock.files[key] = { ownerId, sha256: hash, detached: lock.detachedIds.includes(ownerId) };
  await fs.mkdir(path.dirname(absPath), { recursive: true });
  await fs.writeFile(absPath, content, 'utf8');
}

async function installToVendor({
  upstreamDir,
  outDir,
  prefix,
  lang,
  componentIds,
  byId,
  embedCem,
  cem,
  lock,
}) {
  const outExt = lang === 'ts' ? '.ts' : '.js';
  const outAbs = path.resolve(process.cwd(), outDir);
  const vendorRoot = outAbs;
  const wcfRoot = path.join(vendorRoot, 'wcf');
  const autoloadRoot = path.join(vendorRoot, 'autoload');
  const cemRoot = path.join(vendorRoot, 'cem');

  await fs.mkdir(wcfRoot, { recursive: true });
  await fs.mkdir(autoloadRoot, { recursive: true });
  if (embedCem) await fs.mkdir(cemRoot, { recursive: true });

  /** @type {Map<string, string>} */
  const defineModuleRelById = new Map();
  for (const id of componentIds) {
    // Prefer importing directly from the *-define module to avoid relying on index.ts re-exports.
    // This also stays stable across component index refactors.
    // eslint-disable-next-line no-await-in-loop
    const rel = await pickDefineModuleRelFromUpstream(upstreamDir, id);
    if (!rel) throw new Error(`Missing "*-define.ts" for componentId="${id}" in upstream`);
    defineModuleRelById.set(id, rel);
  }

  // 1) Copy/transpile core shared code (always needed for any component).
  const sharedEntries = [
    'packages/core',
    'packages/styles',
    'packages/utils',
    'packages/config.ts',
    'packages/system.ts',
  ];

  // 2) Copy/transpile selected components.
  const componentEntries = componentIds.map((id) => `packages/components/${id}`);

  const entries = [...sharedEntries, ...componentEntries];

  for (const entry of entries) {
    const srcAbs = path.join(upstreamDir, entry);
    if (!(await pathExists(srcAbs))) throw new Error(`Upstream path missing: ${entry}`);

    const st = await fs.stat(srcAbs);
    const files = st.isDirectory() ? await listFilesRecursive(srcAbs) : [srcAbs];

    for (const fileAbs of files) {
      const relFromUpstream = normalizePosix(path.relative(upstreamDir, fileAbs));
      const relOutBase = normalizePosix(path.join('wcf', relFromUpstream));
      const destAbsBase = path.join(vendorRoot, relOutBase);
      const destKeyBase = relFromCwd(destAbsBase);

      // ownerId: componentId for component files, otherwise "__shared__"
      const ownerId = relFromUpstream.startsWith('packages/components/')
        ? relFromUpstream.split('/')[2]
        : OWNER_SHARED;

      if (lock.detachedIds?.includes(ownerId)) continue;

      const buf = await fs.readFile(fileAbs);
      if (fileAbs.endsWith('.ts') && lang !== 'ts') {
        const jsText = transpileTsToEsmJs(buf.toString('utf8'), relFromUpstream);
        const destAbs = destAbsBase.replace(/\.ts$/, '.js');
        const destKey = relFromCwd(destAbs);
        await writeManagedFile(lock, destKey, jsText, ownerId);
        continue;
      }

      await writeManagedFile(lock, destKeyBase, buf.toString('utf8'), ownerId);
    }
  }

  // 3) (Optional) Write CEM snapshots (canonical + prefixed).
  if (embedCem) {
    await writeManagedFile(
      lock,
      relFromCwd(path.join(cemRoot, 'custom-elements.json')),
      JSON.stringify(cem, null, 2) + '\n',
      OWNER_META,
    );
    const prefixedCem = transformCemPrefix(cem, prefix);
    await writeManagedFile(
      lock,
      relFromCwd(path.join(cemRoot, `custom-elements.${prefix}.json`)),
      JSON.stringify(prefixedCem, null, 2) + '\n',
      OWNER_META,
    );
  }

  // 4) Generate autoload wrappers (one per componentId).
  for (const id of componentIds) {
    if (lock.detachedIds?.includes(id)) continue;
    const install = byId.get(id);
    const define = String(install?.define ?? '').trim();
    if (!define) throw new Error(`Missing install.define for componentId="${id}"`);
    const call = String(install?.call ?? '').trim();
    const defineModuleRel = defineModuleRelById.get(id);
    if (!defineModuleRel) throw new Error(`Missing define module path for componentId="${id}"`);
    const defineModuleOut = defineModuleRel.replace(/\.ts$/, outExt);

    const callLine =
      call === 'registry'
        ? `${define}(customElements);`
        : call === 'none'
          ? `${define}();`
          : `${define}("${prefix}");`;

    const out = [
      `/**`,
      ` * wcf autoload: ${id}`,
      ` * - Installs into vendor (editable)`,
      ` * - Defines custom elements with prefix "${prefix}"`,
      ` */`,
      `import { ${define} } from "../wcf/${defineModuleOut}";`,
      ``,
      callLine,
      ``,
      `export {};`,
      ``,
    ].join('\n');

    const rel = path.join(autoloadRoot, `${id}${outExt}`);
    const relKey = relFromCwd(rel);
    await writeManagedFile(lock, relKey, out, id);
  }

  // 5) Generate index.js importing all autoloads.
  const indexJs = componentIds.map((id) => `import "./autoload/${id}${outExt}";`).join('\n') + '\n';
  await writeManagedFile(
    lock,
    relFromCwd(path.join(vendorRoot, `index${outExt}`)),
    indexJs,
    OWNER_META,
  );

  // 6) Importmap snippet (js-only).
  if (lang !== 'ts') {
    const imports = Object.fromEntries(
      [
        ['@wcf', `./${normalizePosix(path.join(outDir, 'index.js'))}`],
        ...componentIds.map((id) => [`@wcf/${id}`, `./${normalizePosix(path.join(outDir, 'autoload', `${id}.js`))}`]),
      ],
    );
    const snippet = JSON.stringify({ imports }, null, 2) + '\n';
    await writeManagedFile(
      lock,
      relFromCwd(path.join(vendorRoot, 'importmap.snippet.json')),
      snippet,
      OWNER_META,
    );
  }
}

function defaultOutDir(prefix) {
  return `vendor/components/${prefix}`;
}

async function loadConfig() {
  const configPath = path.resolve(process.cwd(), '.wcf/config.json');
  if (!(await pathExists(configPath))) {
    throw new Error('Missing .wcf/config.json. Run `wcf init` first.');
  }
  const config = await readJson(configPath);
  config.lang ??= 'js';
  config.embedCem ??= false;
  config.allowOutsideProject ??= false;
  return { configPath, config };
}

async function loadLock() {
  const lockPath = path.resolve(process.cwd(), '.wcf/lock.json');
  if (!(await pathExists(lockPath))) {
    const initial = {
      schemaVersion: 1,
      repo: DEFAULT_REPO,
      ref: DEFAULT_REF,
      lang: 'js',
      prefix: 'dads',
      outDir: defaultOutDir('dads'),
      installed: [],
      detachedIds: [],
      allowOutsideProject: false,
      files: {},
    };
    await writeJson(lockPath, initial);
  }
  const lock = await readJson(lockPath);
  lock.lang ??= 'js';
  lock.embedCem ??= false;
  lock.detachedIds ??= [];
  lock.allowOutsideProject ??= false;
  lock.files ??= {};
  return { lockPath, lock };
}

async function cmdInit(flags) {
  const prefix = String(flags.prefix ?? 'dads').toLowerCase();
  if (!isValidPrefix(prefix)) throw new Error(`Invalid --prefix: ${String(flags.prefix ?? '')}`);

  const lang = normalizeLang(flags.lang ?? 'js');
  if (!lang) throw new Error(`Invalid --lang: ${String(flags.lang ?? '')} (expected "js" or "ts")`);

  const embedCem = Boolean(flags['embed-cem'] ?? false);
  const allowOutsideProject = Boolean(flags['allow-outside-project'] ?? false);

  const repo = String(flags.repo ?? DEFAULT_REPO);
  const ref = String(flags.ref ?? DEFAULT_REF);
  const outDir = String(flags.out ?? defaultOutDir(prefix));
  resolveOutDir(outDir, { allowOutsideProject });

  const configPath = path.resolve(process.cwd(), '.wcf/config.json');
  const lockPath = path.resolve(process.cwd(), '.wcf/lock.json');

  if (await pathExists(configPath)) throw new Error('.wcf/config.json already exists');

  await writeJson(configPath, {
    schemaVersion: 1,
    mode: lang === 'ts' ? 'ts' : 'importmap',
    lang,
    prefix,
    outDir,
    embedCem,
    allowOutsideProject,
    registry: { type: 'github', repo, ref },
  });
  await writeJson(lockPath, {
    schemaVersion: 1,
    repo,
    ref,
    lang,
    prefix,
    outDir,
    embedCem,
    allowOutsideProject,
    installed: [],
    detachedIds: [],
    force: false,
    files: {},
  });

  console.log(
    `✅ Initialized .wcf/ (prefix=${prefix}, lang=${lang}, outDir=${outDir}, repo=${repo}@${ref}, embedCem=${embedCem})`,
  );
}

async function cmdList(flags) {
  function toList(byId) {
    return Array.from(byId.entries())
      .map(([id, install]) => ({
        id,
        tags: install.tags,
        deps: install.deps,
        define: install.define,
        call: install.call,
        source: install.source,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  const local = flags.local ? path.resolve(process.cwd(), String(flags.local)) : undefined;
  if (local) {
    const registryPath = path.join(local, 'registry', 'install-registry.json');
    const byId = (await pathExists(registryPath))
      ? collectInstallIndexFromRegistry(await readJson(registryPath))
      : collectInstallIndex(await readJson(path.join(local, 'custom-elements.json')));
    console.log(JSON.stringify(toList(byId), null, 2));
    return;
  }

  const repo = String(flags.repo ?? DEFAULT_REPO);
  const ref = String(flags.ref ?? DEFAULT_REF);

  try {
    const registry = await fetchInstallRegistry({ repo, ref });
    const byId = collectInstallIndexFromRegistry(registry);
    console.log(JSON.stringify(toList(byId), null, 2));
  } catch (err) {
    // Compatibility fallback: older refs may not have the install registry yet.
    const { tmpBase, dest } = await fetchUpstreamToTemp({ repo, ref });
    try {
      const cem = await readJson(path.join(dest, 'custom-elements.json'));
      const byId = collectInstallIndex(cem);
      console.log(JSON.stringify(toList(byId), null, 2));
    } finally {
      await cleanupTemp(tmpBase);
    }
  }
}

async function cmdAdd(ids, flags) {
  const { config } = await loadConfig();
  const { lockPath, lock } = await loadLock();

  const prefix = String(flags.prefix ?? config.prefix ?? 'dads').toLowerCase();
  if (!isValidPrefix(prefix)) throw new Error(`Invalid --prefix: ${String(flags.prefix ?? '')}`);

  const lang = normalizeLang(flags.lang ?? config.lang ?? lock.lang ?? 'js');
  if (!lang) throw new Error(`Invalid --lang: ${String(flags.lang ?? '')} (expected "js" or "ts")`);

  const allowOutsideProject = Boolean(flags['allow-outside-project'] ?? config.allowOutsideProject ?? lock.allowOutsideProject ?? false);
  const outDir = String(flags.out ?? config.outDir ?? defaultOutDir(prefix));
  resolveOutDir(outDir, { allowOutsideProject });
  const embedCem = Boolean(flags['embed-cem'] ?? config.embedCem ?? lock.embedCem ?? false);
  const force = Boolean(flags.force ?? false);

  const patternIds = parseCsvFlag(flags.pattern, 'pattern');

  const local = flags.local ? path.resolve(process.cwd(), String(flags.local)) : undefined;
  const repo = String(flags.repo ?? config.registry?.repo ?? DEFAULT_REPO);
  const ref = String(flags.ref ?? config.registry?.ref ?? DEFAULT_REF);

  if (local) {
    const patternRegistryPath = path.join(local, 'registry', 'pattern-registry.json');
    const registryPath = path.join(local, 'registry', 'install-registry.json');
    const registry = (await pathExists(registryPath)) ? await readJson(registryPath) : undefined;
    const cem = registry ? undefined : await readJson(path.join(local, 'custom-elements.json'));
    const byId = registry ? collectInstallIndexFromRegistry(registry) : collectInstallIndex(cem);
    const patternRegistry =
      patternIds.length > 0
        ? (await pathExists(patternRegistryPath))
          ? await readJson(patternRegistryPath)
          : undefined
        : undefined;
    if (patternIds.length > 0 && !patternRegistry) {
      throw new Error(`Pattern registry not found at: ${patternRegistryPath}`);
    }
    const patternRequires = patternRegistry ? collectPatternRequires(patternRegistry, patternIds) : [];
    if (ids.length === 0 && patternRequires.length === 0) {
      throw new Error('Missing componentId(s). Example: wcf add button OR wcf add --pattern search-form');
    }
    const closure = resolveClosure([...ids, ...patternRequires].map(String), byId);

    const nextInstalled = Array.from(new Set([...(lock.installed ?? []), ...closure])).sort();
    lock.repo = repo;
    lock.ref = ref;
    lock.lang = lang;
    lock.prefix = prefix;
    lock.outDir = outDir;
    lock.embedCem = embedCem;
    lock.allowOutsideProject = allowOutsideProject;
    lock.installed = nextInstalled;
    lock.detachedIds ??= [];
    if (force) lock.force = true;
    lock.files ??= {};

    const componentIds = resolveClosure(nextInstalled, byId);
    await installToVendor({
      upstreamDir: local,
      outDir,
      prefix,
      lang,
      componentIds,
      byId,
      embedCem,
      cem: embedCem ? await readJson(path.join(local, 'custom-elements.json')) : undefined,
      lock,
    });

    if ('force' in lock) delete lock.force;
    await writeJson(lockPath, lock);
    const via = patternIds.length > 0 ? `, patterns=${patternIds.join(',')}` : '';
    console.log(`✅ Installed: ${closure.join(', ')} (prefix=${prefix}, outDir=${outDir}${via})`);
    return;
  }

  const { tmpBase, dest } = await fetchUpstreamToTemp({ repo, ref });
  try {
    const registryPath = path.join(dest, 'registry', 'install-registry.json');
    const patternRegistryPath = path.join(dest, 'registry', 'pattern-registry.json');
    const byId = (await pathExists(registryPath))
      ? collectInstallIndexFromRegistry(await readJson(registryPath))
      : collectInstallIndex(await readJson(path.join(dest, 'custom-elements.json')));
    let patternRegistry;
    if (patternIds.length > 0) {
      try {
        patternRegistry = await fetchPatternRegistry({ repo, ref });
      } catch {
        patternRegistry = (await pathExists(patternRegistryPath)) ? await readJson(patternRegistryPath) : undefined;
      }
      if (!patternRegistry) {
        throw new Error(
          `Pattern registry not found in upstream (${repo}@${ref}). Use componentId(s) or update ref.`,
        );
      }
    }
    const patternRequires = patternRegistry ? collectPatternRequires(patternRegistry, patternIds) : [];
    if (ids.length === 0 && patternRequires.length === 0) {
      throw new Error('Missing componentId(s). Example: wcf add button OR wcf add --pattern search-form');
    }
    const closure = resolveClosure([...ids, ...patternRequires].map(String), byId);

    // Merge installed list (keeping existing).
    const nextInstalled = Array.from(new Set([...(lock.installed ?? []), ...closure])).sort();
    lock.repo = repo;
    lock.ref = ref;
    lock.lang = lang;
    lock.prefix = prefix;
    lock.outDir = outDir;
    lock.embedCem = embedCem;
    lock.allowOutsideProject = allowOutsideProject;
    lock.installed = nextInstalled;
    lock.detachedIds ??= [];
    if (force) lock.force = true;
    lock.files ??= {};

    const componentIds = resolveClosure(nextInstalled, byId);
    await installToVendor({
      upstreamDir: dest,
      outDir,
      prefix,
      lang,
      componentIds,
      byId,
      embedCem,
      cem: embedCem ? await readJson(path.join(dest, 'custom-elements.json')) : undefined,
      lock,
    });

    if ('force' in lock) delete lock.force;
    await writeJson(lockPath, lock);
    const via = patternIds.length > 0 ? `, patterns=${patternIds.join(',')}` : '';
    console.log(`✅ Installed: ${closure.join(', ')} (prefix=${prefix}, outDir=${outDir}${via})`);
  } finally {
    await cleanupTemp(tmpBase);
  }
}

async function cmdDetach(ids) {
  if (ids.length === 0) throw new Error('Missing componentId(s). Example: wcf detach button');
  const { lockPath, lock } = await loadLock();
  lock.detachedIds ??= [];
  for (const id of ids) {
    if (!lock.detachedIds.includes(id)) lock.detachedIds.push(id);
  }
  lock.detachedIds.sort();

  // Mark owned files as detached (best-effort).
  for (const [p, meta] of Object.entries(lock.files ?? {})) {
    if (ids.includes(meta.ownerId)) meta.detached = true;
  }

  await writeJson(lockPath, lock);
  console.log(`✅ Detached (management-only): ${ids.join(', ')}`);
}

async function cmdAttach(ids) {
  if (ids.length === 0) throw new Error('Missing componentId(s). Example: wcf attach button');
  const { lockPath, lock } = await loadLock();
  lock.detachedIds ??= [];
  const toAttach = new Set(ids.map(String));
  lock.detachedIds = lock.detachedIds.filter((id) => !toAttach.has(id));

  // Mark owned files as managed again (best-effort).
  for (const meta of Object.values(lock.files ?? {})) {
    if (toAttach.has(meta.ownerId)) meta.detached = false;
  }

  await writeJson(lockPath, lock);
  console.log(`✅ Attached (managed again): ${ids.join(', ')}`);
}

async function cmdRemove(ids) {
  if (ids.length === 0) throw new Error('Missing componentId(s). Example: wcf remove button');
  const { lockPath, lock } = await loadLock();
  lock.installed ??= [];
  lock.detachedIds ??= [];
  lock.files ??= {};

  const vendorRootAbs = path.resolve(process.cwd(), String(lock.outDir ?? defaultOutDir(lock.prefix ?? 'dads')));
  const cwdAbs = path.resolve(process.cwd());
  const vendorInsideProject = isSubPath(vendorRootAbs, cwdAbs);
  if (!vendorInsideProject && !lock.allowOutsideProject) {
    throw new Error(
      `Refusing to remove with --out outside the project (outDir=${String(lock.outDir ?? '')}).\n` +
        `- Re-init with --allow-outside-project if you really need this.`,
    );
  }

  const toRemove = new Set(ids.map(String));
  const nextInstalled = lock.installed.filter((id) => !toRemove.has(id));
  lock.installed = nextInstalled;

  // Delete managed files owned by removed components, unless detached.
  const fileEntries = Object.entries(lock.files);
  for (const [rel, meta] of fileEntries) {
    if (!toRemove.has(meta.ownerId)) continue;
    if (meta.detached === true) continue;
    const abs = path.resolve(process.cwd(), rel);
    if (!isSubPath(abs, vendorRootAbs) && abs !== vendorRootAbs) {
      // Hard guard: never delete outside the configured vendor root.
      continue;
    }
    try {
      await fs.rm(abs, { force: true, recursive: false });
    } catch {
      // ignore
    }
    delete lock.files[rel];
  }

  await writeJson(lockPath, lock);
  console.log(`✅ Removed (managed files only): ${ids.join(', ')}`);
}

async function main() {
  const { args, flags } = parseArgs(process.argv.slice(2));
  const cmd = args[0];
  const rest = args.slice(1);

  if (!cmd || cmd === 'help' || flags.help) {
    usage();
    return;
  }

  if (cmd === 'init') return cmdInit(flags);
  if (cmd === 'list') return cmdList(flags);
  if (cmd === 'add') return cmdAdd(rest, flags);
  if (cmd === 'attach') return cmdAttach(rest);
  if (cmd === 'detach') return cmdDetach(rest);
  if (cmd === 'remove') return cmdRemove(rest);

  throw new Error(`Unknown command: ${cmd}`);
}

main().catch((err) => {
  console.error(err?.message ?? String(err));
  process.exit(1);
});

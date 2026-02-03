#!/usr/bin/env node
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync, brotliCompressSync, constants as zlibConstants } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const out = { entries: [], includeDynamic: false, ref: null, json: false, root: null };
  const flagSet = new Set(['--include-dynamic', '--json']);
  const valueFlags = new Map([
    ['--entry', 'entries'],
    ['--ref', 'ref'],
    ['--root', 'root'],
  ]);

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (flagSet.has(arg)) {
      if (arg === '--include-dynamic') out.includeDynamic = true;
      if (arg === '--json') out.json = true;
      continue;
    }
    const target = valueFlags.get(arg);
    if (!target) continue;
    const value = argv[i + 1];
    if (target === 'entries') {
      out.entries.push(value);
    } else {
      out[target] = value;
    }
    i += 1;
  }
  return out;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function compressSizes(buf) {
  const gzip = gzipSync(buf, { level: 9 });
  const br = brotliCompressSync(buf, {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
      [zlibConstants.BROTLI_PARAM_MODE]: zlibConstants.BROTLI_MODE_TEXT,
    },
  });
  return { raw: buf.byteLength, gzip: gzip.byteLength, brotli: br.byteLength };
}

function isRelative(spec) {
  return spec.startsWith('.') || spec.startsWith('..');
}

function parseImports(source) {
  const staticSpecs = new Set();
  const dynamicSpecs = new Set();

  const addAll = (re, set) => {
    for (const m of source.matchAll(re)) {
      const spec = m[1];
      if (typeof spec === 'string') set.add(spec);
    }
  };

  // NOTE: Treat TS type-only imports/exports as non-runtime deps.
  addAll(/import\s+(?!type\s)[\s\S]*?\sfrom\s*['"](.+?)['"]/g, staticSpecs);
  addAll(/export\s+(?!type\s)[\s\S]*?\sfrom\s*['"](.+?)['"]/g, staticSpecs);
  addAll(/import\s*\(\s*['"](.+?)['"]\s*\)/g, dynamicSpecs);

  return { staticSpecs, dynamicSpecs };
}

async function exists(filePath) {
  try {
    const st = await stat(filePath);
    return st.isFile() || st.isFIFO();
  } catch {
    return false;
  }
}

async function resolveSpec(fromFile, spec) {
  const fromDir = path.dirname(fromFile);
  const resolved = path.resolve(fromDir, spec);

  // If explicit extension exists, try mapping .js -> .ts (repo pattern)
  if (/\.(mjs|cjs|js|ts|tsx|jsx)$/.test(resolved)) {
    if (resolved.endsWith('.js')) {
      const tsCandidate = resolved.slice(0, -3) + '.ts';
      if (await exists(tsCandidate)) return tsCandidate;
    }
    if (await exists(resolved)) return resolved;
  }

  // Try direct TS first (repo is TS-first)
  const candidates = [
    `${resolved}.ts`,
    `${resolved}.tsx`,
    `${resolved}.js`,
    `${resolved}.mjs`,
    path.join(resolved, 'index.ts'),
    path.join(resolved, 'index.js'),
  ];

  for (const c of candidates) {
    if (await exists(c)) return c;
  }

  return null;
}

function readFromGit(ref, repoRoot, filePath) {
  const rel = path.relative(repoRoot, filePath).split(path.sep).join('/');
  const spec = `${ref}:${rel}`;
  return execFileSync('git', ['show', spec], { cwd: repoRoot, encoding: 'utf8' });
}

async function readSource({ filePath, ref, repoRoot }) {
  if (!ref) return await readFile(filePath, 'utf8');
  return readFromGit(ref, repoRoot, filePath);
}

async function collectGraph({ entryFile, includeDynamic, ref, repoRoot }) {
  const visited = new Set();
  const queue = [entryFile];

  while (queue.length > 0) {
    const filePath = queue.pop();
    if (!filePath) continue;
    if (visited.has(filePath)) continue;
    visited.add(filePath);

    let source = '';
    try {
      source = await readSource({ filePath, ref, repoRoot });
    } catch {
      continue;
    }

    const { staticSpecs, dynamicSpecs } = parseImports(source);
    const toFollow = new Set(staticSpecs);
    if (includeDynamic) {
      for (const s of dynamicSpecs) toFollow.add(s);
    }

    for (const spec of toFollow) {
      if (!isRelative(spec)) continue;
      const resolved = await resolveSpec(filePath, spec);
      if (!resolved) continue;
      // Stay inside repo root
      if (!resolved.startsWith(repoRoot + path.sep)) continue;
      queue.push(resolved);
    }
  }

  return visited;
}

async function measureEntry({ entry, includeDynamic, ref, repoRoot }) {
  const entryFile = path.resolve(repoRoot, entry);
  const files = await collectGraph({ entryFile, includeDynamic, ref, repoRoot });

  let rawTotal = 0;
  let gzipTotal = 0;
  let brotliTotal = 0;

  const perFile = [];
  for (const filePath of files) {
    const source = await readSource({ filePath, ref, repoRoot });
    const buf = Buffer.from(source, 'utf8');
    const sizes = compressSizes(buf);
    rawTotal += sizes.raw;
    gzipTotal += sizes.gzip;
    brotliTotal += sizes.brotli;
    perFile.push({
      file: path.relative(repoRoot, filePath),
      ...sizes,
    });
  }

  perFile.sort((a, b) => b.raw - a.raw);

  return {
    entry,
    ref: ref ?? 'WORKTREE',
    includeDynamic,
    fileCount: files.size,
    total: { raw: rawTotal, gzip: gzipTotal, brotli: brotliTotal },
    topFiles: perFile.slice(0, 10),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(args.root ?? path.resolve(__dirname, '..', '..'));

  if (args.entries.length === 0) {
    console.error('Usage: node scripts/size/measure-esm.mjs --entry <path> [--ref <git-ref>] [--include-dynamic] [--json]');
    process.exit(1);
  }

  const results = [];
  for (const entry of args.entries) {
    results.push(await measureEntry({ entry, includeDynamic: args.includeDynamic, ref: args.ref, repoRoot }));
  }

  if (args.json) {
    process.stdout.write(JSON.stringify({ repoRoot, results }, null, 2));
    process.stdout.write('\n');
    return;
  }

  for (const r of results) {
    process.stdout.write(`\n# ${r.entry} (${r.ref})\n`);
    process.stdout.write(`- files: ${r.fileCount}\n`);
    process.stdout.write(
      `- total: raw ${formatBytes(r.total.raw)} | gzip ${formatBytes(r.total.gzip)} | brotli ${formatBytes(r.total.brotli)}\n`
    );
    process.stdout.write(`- includeDynamic: ${r.includeDynamic}\n`);
    process.stdout.write('\nTop files (raw):\n');
    for (const f of r.topFiles) {
      process.stdout.write(
        `- ${f.file}: raw ${formatBytes(f.raw)} | gzip ${formatBytes(f.gzip)} | brotli ${formatBytes(f.brotli)}\n`
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

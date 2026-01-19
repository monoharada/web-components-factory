#!/usr/bin/env node

/**
 * Expand a (usually large) Figma node into its child nodes and add them to
 * resources/dads/components/<slug>/figma/config.json.
 *
 * This is useful when you captured a big SECTION (e.g. "Examples") and want
 * per-frame screenshots for each sub-section.
 *
 * Requirements:
 * - FIGMA_ACCESS_TOKEN (or FIGMA_TOKEN)
 *
 * Usage:
 *   npm run dads:figma:expand -- --component step-navigation --from 17934:43545
 *
 * Options:
 *   --types FRAME,SECTION,...   (default: FRAME)
 *   --depth 1                  (default: 1)
 *   --scale 1                  (optional: force scale for all added nodes)
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { component: null, from: null, depth: 1, types: ['FRAME'], scale: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--component' || a === '-c') args.component = argv[++i];
    else if (a === '--from' || a === '--node' || a === '-f') args.from = argv[++i];
    else if (a === '--depth' || a === '-d') args.depth = Number(argv[++i]);
    else if (a === '--types' || a === '-t') args.types = String(argv[++i]).split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--scale' || a === '-s') args.scale = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      // eslint-disable-next-line no-console
      console.log(
        'Usage: npm run dads:figma:expand -- --component <slug> --from <nodeId> [--types FRAME] [--depth 1] [--scale 1]',
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }
  if (!args.component) throw new Error('Missing --component');
  if (!args.from) throw new Error('Missing --from');
  if (!Number.isFinite(args.depth) || args.depth < 1) throw new Error('Invalid --depth (must be >= 1)');
  if (args.types.length === 0) throw new Error('Invalid --types');
  if (args.scale !== null && (!Number.isFinite(args.scale) || args.scale <= 0)) throw new Error('Invalid --scale (must be > 0)');
  return args;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function curlJson(url, headers = []) {
  const { spawnSync } = require('child_process');
  const args = ['-sS', '-L', ...headers.flatMap((h) => ['-H', h]), url];
  const res = spawnSync('curl', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error((res.stderr || '').trim() || `curl failed: ${url}`);
  const stdout = (res.stdout || '').trim();
  if (!stdout) throw new Error(`Empty response: ${url}`);
  return JSON.parse(stdout);
}

function normalizeNodeId(nodeId) {
  const raw = String(nodeId || '').trim();
  if (!raw) throw new Error('Missing node id');
  return raw.replace(/-/g, ':');
}

function figmaNodeUrl(baseUrl, nodeId) {
  if (!baseUrl) return null;
  const dashId = String(nodeId).replace(/:/g, '-');
  return `${baseUrl}?node-id=${encodeURIComponent(dashId)}&m=dev`;
}

function walkChildren(root, depth) {
  const out = [];
  const queue = [{ node: root, d: 0 }];
  while (queue.length > 0) {
    const { node, d } = queue.shift();
    if (d >= depth) continue;
    const kids = Array.isArray(node.children) ? node.children : [];
    for (const k of kids) {
      out.push(k);
      queue.push({ node: k, d: d + 1 });
    }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..', '..');
  const componentRoot = path.join(repoRoot, 'resources', 'dads', 'components', args.component);
  const figmaDir = path.join(componentRoot, 'figma');
  const configPath = path.join(figmaDir, 'config.json');

  if (!exists(configPath)) throw new Error(`Missing config.json: ${path.relative(repoRoot, configPath)}`);

  ensureDir(figmaDir);
  const cfg = readJson(configPath);
  const fileKey = cfg.fileKey;
  if (!fileKey || typeof fileKey !== 'string') throw new Error('Invalid config.json: fileKey is required');

  const token = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN || null;
  if (!token) throw new Error('Missing FIGMA_ACCESS_TOKEN (or FIGMA_TOKEN)');
  const headers = [`X-Figma-Token: ${token}`];

  const fromId = normalizeNodeId(args.from);
  const nodesJson = curlJson(
    `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}/nodes?ids=${encodeURIComponent(fromId)}`,
    headers,
  );
  const fromDoc = nodesJson.nodes?.[fromId]?.document || null;
  if (!fromDoc) {
    throw new Error(`Node not found via Figma API: ${fromId}`);
  }

  const children = walkChildren(fromDoc, args.depth);
  const pick = children.filter((n) => args.types.includes(n.type));

  cfg.nodes = Array.isArray(cfg.nodes) ? cfg.nodes : [];
  cfg.export = cfg.export || { format: 'png', scale: 2 };

  const defaultScaleRaw = cfg.export.scale ?? 2;
  const defaultScale = Number.isFinite(Number(defaultScaleRaw)) && Number(defaultScaleRaw) > 0 ? Number(defaultScaleRaw) : 2;
  const baseLabel = fromDoc.name || fromId;
  const existing = new Set(cfg.nodes.map((n) => n.id));

  const toAdd = [];
  for (const n of pick) {
    if (!n?.id || existing.has(n.id)) continue;

    let scale = args.scale;
    if (scale === null) {
      const w = n.absoluteBoundingBox?.width;
      scale = typeof w === 'number' && w >= 1000 ? 1 : defaultScale;
    }

    const node = {
      id: n.id,
      label: `${baseLabel} / ${n.name || n.id}`,
      parentId: fromId,
    };

    const url = figmaNodeUrl(cfg.baseUrl, n.id);
    if (url) node.url = url;
    if (scale !== defaultScale) node.export = { scale };

    toAdd.push(node);
    existing.add(n.id);
  }

  const insertAt = Math.max(0, cfg.nodes.findIndex((n) => n.id === fromId) + 1);
  cfg.nodes.splice(insertAt, 0, ...toAdd);
  writeJson(configPath, cfg);

  // eslint-disable-next-line no-console
  console.log(`✅ Updated: ${path.relative(repoRoot, configPath)}`);
  // eslint-disable-next-line no-console
  console.log(`- from: ${fromId} (${fromDoc.type} / ${fromDoc.name})`);
  // eslint-disable-next-line no-console
  console.log(`- added: ${toAdd.length}`);
  // eslint-disable-next-line no-console
  console.log(`- types: ${args.types.join(', ')}, depth: ${args.depth}`);
}

main();

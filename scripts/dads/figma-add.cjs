#!/usr/bin/env node

/**
 * Add Figma nodes to DADS resources config.
 *
 * This repo cannot discover the right Figma nodes automatically.
 * Provide one or more Figma URLs and this script will extract:
 * - fileKey
 * - node-id
 *
 * Usage:
 *   npm run dads:figma:add -- --component step-navigation --url "https://www.figma.com/design/<fileKey>/...?...node-id=1-2&m=dev"
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { component: null, urls: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--component' || a === '-c') args.component = argv[++i];
    else if (a === '--url' || a === '-u') args.urls.push(argv[++i]);
    else if (a === '--help' || a === '-h') {
      // eslint-disable-next-line no-console
      console.log('Usage: npm run dads:figma:add -- --component <slug> --url "<figma-url>" [--url "<figma-url>"]');
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }
  if (!args.component) throw new Error('Missing --component');
  if (args.urls.length === 0) throw new Error('Missing --url');
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

function normalizeNodeId(nodeId) {
  const raw = String(nodeId || '').trim();
  if (!raw) throw new Error('Missing node-id in URL');
  return raw.replace(/-/g, ':');
}

function parseFigmaUrl(urlStr) {
  let u;
  try {
    u = new URL(urlStr);
  } catch {
    throw new Error(`Invalid URL: ${urlStr}`);
  }

  const parts = u.pathname.split('/').filter(Boolean);
  let fileKey = null;

  if (parts[0] === 'design' || parts[0] === 'file' || parts[0] === 'proto') {
    fileKey = parts[1] || null;
  } else if (parts[0] === 'community' && parts[1] === 'file') {
    fileKey = parts[2] || null;
  }

  if (!fileKey) throw new Error(`Failed to extract fileKey from URL: ${urlStr}`);

  const nodeId = normalizeNodeId(u.searchParams.get('node-id') || u.searchParams.get('node_id'));
  const baseUrl = `${u.origin}${u.pathname}`;
  return { fileKey, nodeId, baseUrl, url: urlStr };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..', '..');
  const componentRoot = path.join(repoRoot, 'resources', 'dads', 'components', args.component);
  const figmaDir = path.join(componentRoot, 'figma');
  const configPath = path.join(figmaDir, 'config.json');

  ensureDir(figmaDir);

  const parsed = args.urls.map(parseFigmaUrl);
  const fileKey = parsed[0].fileKey;

  let cfg;
  if (exists(configPath)) {
    cfg = readJson(configPath);
    if (cfg.fileKey && cfg.fileKey !== fileKey) {
      throw new Error(`config.json fileKey mismatch: ${cfg.fileKey} (existing) vs ${fileKey} (url)`);
    }
  } else {
    cfg = {
      schemaVersion: 1,
      fileKey,
      baseUrl: parsed[0].baseUrl,
      export: { format: 'png', scale: 2 },
      nodes: [],
    };
  }

  cfg.fileKey = fileKey;
  cfg.baseUrl = cfg.baseUrl || parsed[0].baseUrl;
  cfg.export = cfg.export || { format: 'png', scale: 2 };
  cfg.nodes = Array.isArray(cfg.nodes) ? cfg.nodes : [];

  const byId = new Map(cfg.nodes.map((n) => [n.id, n]));
  let added = 0;
  let updated = 0;
  for (const p of parsed) {
    const existing = byId.get(p.nodeId) || null;
    if (existing) {
      if (!existing.url) {
        existing.url = p.url;
        updated++;
      }
      continue;
    }

    const node = { id: p.nodeId, label: `Figma node ${p.nodeId}`, url: p.url };
    cfg.nodes.push(node);
    byId.set(p.nodeId, node);
    added++;
  }

  writeJson(configPath, cfg);

  // eslint-disable-next-line no-console
  console.log(`✅ Updated: ${path.relative(repoRoot, configPath)}`);
  // eslint-disable-next-line no-console
  console.log(`- fileKey: ${cfg.fileKey}`);
  // eslint-disable-next-line no-console
  console.log(`- nodes: ${cfg.nodes.length} (${added} added, ${updated} updated)`);
}

main();

#!/usr/bin/env node

/**
 * DADS resources sync
 *
 * - DADS公式サイト: overview/usage/accessibility を保存（HTML/テキスト/画像/キャプチャ）
 * - DADS HTML版 Storybook: docs/story を保存（UI + canvas 画像、iframe HTML）
 * - 上流（design-system-example-components-html）: 対象コンポーネント関連ソースを保存（存在する場合）
 *
 * Usage:
 *   node scripts/dads/sync.cjs --component file-upload [--force]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

function parseArgs(argv) {
  const args = { component: null, force: false, viewport: { width: 1440, height: 900 } };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--component' || a === '-c') args.component = argv[++i];
    else if (a === '--force') args.force = true;
    else if (a === '--viewport') {
      const raw = argv[++i];
      const m = /^(\d+)x(\d+)$/.exec(raw || '');
      if (!m) throw new Error(`Invalid --viewport: ${raw} (expected 1440x900)`);
      args.viewport = { width: Number(m[1]), height: Number(m[2]) };
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }
  if (!args.component) throw new Error('Missing --component');
  return args;
}

function printHelp() {
  // eslint-disable-next-line no-console
  console.log(
    [
      'DADS resources sync',
      '',
      'Usage:',
      '  npm run dads:sync -- --component file-upload [--force] [--viewport 1440x900]',
      '',
      'Options:',
      '  --component, -c   DADS component slug (e.g. input-text)',
      '  --force           Overwrite existing files',
      '  --viewport        Screenshot viewport size (default: 1440x900)',
    ].join('\n'),
  );
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
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

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  if (res.error) throw res.error;
  if (res.status !== 0) {
    const stderr = (res.stderr || '').trim();
    const stdout = (res.stdout || '').trim();
    throw new Error([`${cmd} ${args.join(' ')}`, stderr, stdout].filter(Boolean).join('\n'));
  }
  return res;
}

function tryRunJson(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  const stdout = (res.stdout || '').trim();
  if (res.error) return { ok: false, error: String(res.error) };
  let json = null;
  try {
    json = stdout ? JSON.parse(stdout) : null;
  } catch (e) {
    return { ok: false, error: `Failed to parse JSON: ${String(e)}\n${stdout}` };
  }
  if (res.status !== 0) {
    return { ok: false, error: json?.error || (res.stderr || '').trim() || 'Command failed', json };
  }
  if (json && json.success === false) return { ok: false, error: json.error || 'agent-browser failed', json };
  return { ok: true, json };
}

function summarizeAgentBrowserError(err) {
  const s = String(err || '').replace(/\s+/g, ' ').trim();
  if (!s) return 'unknown error';
  if (s.includes('Validation error: action: Invalid discriminator value')) {
    return 'Validation error: agent-browser action unsupported in this environment';
  }
  return s.length > 220 ? s.slice(0, 220) + '…' : s;
}

function slugify(s) {
  const v = String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return v || 'unknown';
}

function shortHash(s) {
  return crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 8);
}

function fetchUrlToFile(url, outPath, { force }) {
  if (!force && exists(outPath)) return { status: 200, skipped: true };
  ensureDir(path.dirname(outPath));
  const tmp = `${outPath}.tmp`;

  const res = spawnSync('curl', ['-sS', '-L', '-o', tmp, '-w', '%{http_code}', url], { encoding: 'utf8' });
  if (res.error) return { status: null, error: String(res.error) };
  if (res.status !== 0) {
    try {
      fs.rmSync(tmp, { force: true });
    } catch {
      // ignore
    }
    return { status: null, error: (res.stderr || '').trim() || 'curl failed' };
  }

  const httpStatus = Number(String(res.stdout || '').trim());
  if (httpStatus !== 200) {
    try {
      fs.rmSync(tmp, { force: true });
    } catch {
      // ignore
    }
    return { status: httpStatus };
  }

  fs.renameSync(tmp, outPath);
  return { status: httpStatus };
}

function downloadFile(url, outPath, { force }) {
  if (!force && exists(outPath)) return { ok: true, skipped: true };
  ensureDir(path.dirname(outPath));
  const res = spawnSync('curl', ['-sS', '-L', '-o', outPath, url], { encoding: 'utf8' });
  if (res.error) return { ok: false, error: String(res.error) };
  if (res.status !== 0) return { ok: false, error: (res.stderr || '').trim() || 'curl failed' };
  return { ok: true };
}

function updateIndexJson(indexPath, slug, manifest) {
  const now = new Date().toISOString();
  let index = { schemaVersion: 1, generatedAt: null, components: {} };
  if (exists(indexPath)) {
    try {
      index = readJson(indexPath);
    } catch {
      // ignore and overwrite
    }
  }
  index.schemaVersion = 1;
  index.generatedAt = now;
  index.components = index.components || {};
  index.components[slug] = {
    updatedAt: now,
    docs: manifest.docs,
    storybook: manifest.storybook,
    upstream: manifest.upstream,
    figma: manifest.figma,
  };
  writeJson(indexPath, index);
}

function curlJson(url, headers = []) {
  const args = ['-sS', '-L', ...headers.flatMap((h) => ['-H', h]), url];
  // NOTE: Some responses (e.g. Figma nodes) can exceed Node's default spawnSync maxBuffer.
  const res = spawnSync('curl', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error((res.stderr || '').trim() || `curl failed: ${url}`);
  const stdout = (res.stdout || '').trim();
  if (!stdout) throw new Error(`Empty response: ${url}`);
  return JSON.parse(stdout);
}

function safeFigmaId(id) {
  return String(id).replace(/:/g, '-');
}

function titleFromSlug(slug) {
  return String(slug || '')
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(' ');
}

function normalizeStringArray(v) {
  if (typeof v === 'string') return [v].map((s) => String(s).trim()).filter(Boolean);
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  return null;
}

function extractFigmaInstances(root, { includeNameIncludes, excludeNameIncludes }) {
  const includes = includeNameIncludes || [];
  const excludes = excludeNameIncludes || [];
  const instances = [];

  // Capture "top-level" matching instances: once an instance matches, we do not
  // traverse into its children (avoids collecting internal building blocks).
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;

    if (node.type === 'INSTANCE') {
      const name = String(node.name || '');
      const includeOk = includes.length === 0 || includes.some((t) => name.includes(t));
      const excludeOk = excludes.length === 0 || !excludes.some((t) => name.includes(t));
      if (includeOk && excludeOk) {
        instances.push({
          id: node.id,
          name: node.name || null,
          componentId: node.componentId || null,
          absoluteBoundingBox: node.absoluteBoundingBox || null,
          componentProperties: node.componentProperties || null,
        });
        continue;
      }
    }

    const children = node.children;
    if (Array.isArray(children) && children.length > 0) {
      for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
    }
  }

  return instances;
}

function syncFigma({ componentRoot, manifest, force, previousFigma }) {
  const cfgPath = path.join(componentRoot, 'figma', 'config.json');
  if (!exists(cfgPath)) {
    const slug = manifest.component?.slug || '<slug>';
    manifest.figma = {
      status: 'unconfigured',
      reason: 'missing_config',
      hint: `Provide Figma URLs and run: npm run dads:figma:add -- --component ${slug} --url "<figma-url>"`,
    };
    return;
  }

  const cfg = readJson(cfgPath);
  const fileKey = cfg.fileKey;
  const exportFormat = String(cfg.export?.format || 'png');
  const exportScaleRaw = cfg.export?.scale ?? 2;
  const exportScale = Number.isFinite(Number(exportScaleRaw)) && Number(exportScaleRaw) > 0 ? Number(exportScaleRaw) : 2;
  const nodes = Array.isArray(cfg.nodes) ? cfg.nodes : [];

  manifest.figma = {
    status: 'configured',
    config: { fileKey, nodes },
    export: { format: exportFormat, scale: exportScale },
    files: { config: path.relative(componentRoot, cfgPath) },
  };

  const token = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN || null;
  if (!token) {
    if (previousFigma && previousFigma.status === 'ok') {
      manifest.figma = previousFigma;
      manifest.notes = manifest.notes || [];
      manifest.notes.push('figma sync skipped (missing token); preserved previous figma resources');
      return;
    }
    manifest.figma.status = 'skipped';
    manifest.figma.reason = 'missing_env';
    manifest.figma.requiredEnv = ['FIGMA_ACCESS_TOKEN (recommended)', 'FIGMA_TOKEN (legacy)'];
    return;
  }

  if (!fileKey || typeof fileKey !== 'string') {
    manifest.figma.status = 'error';
    manifest.figma.error = 'Invalid figma config: fileKey is required';
    return;
  }
  if (nodes.length === 0) {
    manifest.figma.status = 'error';
    manifest.figma.error = 'Invalid figma config: nodes[] is required';
    return;
  }

  const figmaRoot = path.join(componentRoot, 'figma');
  const imagesDir = path.join(figmaRoot, 'images');
  const nodesDir = path.join(figmaRoot, 'nodes');
  ensureDir(imagesDir);
  if (force && exists(nodesDir)) fs.rmSync(nodesDir, { recursive: true, force: true });
  ensureDir(nodesDir);
  const legacyNodesJsonPath = path.join(nodesDir, 'nodes.json');
  if (exists(legacyNodesJsonPath)) fs.rmSync(legacyNodesJsonPath, { force: true });

  const headers = [`X-Figma-Token: ${token}`];
  const ids = nodes.map((n) => n.id);

  // Figma nodes JSON can get very large. Instead of saving a monolithic file,
  // we extract only "usage" instances and store per-node JSON under figma/nodes/.
  const match = {
    includeNameIncludes:
      normalizeStringArray(cfg.extract?.instanceNameIncludes) ||
      normalizeStringArray(cfg.instanceNameIncludes) ||
      normalizeStringArray(titleFromSlug(manifest.component?.slug)),
    excludeNameIncludes:
      normalizeStringArray(cfg.extract?.excludeNameIncludes) || normalizeStringArray(cfg.excludeNameIncludes) || [],
  };

  const nodeMeta = {};
  const nodeExtractIndex = {
    schemaVersion: 1,
    generatedAt: manifest.generatedAt,
    fileKey,
    nodes: [],
    match,
  };

  try {
    const chunkSize = 10;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunkIds = ids.slice(i, i + chunkSize);
      const chunkParam = chunkIds.join(',');
      const nodesJson = curlJson(
        `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}/nodes?ids=${encodeURIComponent(chunkParam)}`,
        headers,
      );

      for (const id of chunkIds) {
        const doc = nodesJson.nodes?.[id]?.document || null;
        if (!doc) continue;

        nodeMeta[id] = { name: doc.name, type: doc.type };

        const extract = {
          schemaVersion: 1,
          generatedAt: manifest.generatedAt,
          fileKey,
          root: {
            id,
            name: doc.name || null,
            type: doc.type || null,
            url: nodes.find((n) => n.id === id)?.url || null,
          },
          match,
          instances: extractFigmaInstances(doc, match),
        };

        const fileName = `${safeFigmaId(id)}.json`;
        const out = path.join(nodesDir, fileName);
        if (force || !exists(out)) writeJson(out, extract);
        nodeExtractIndex.nodes.push({
          id,
          name: doc.name || null,
          type: doc.type || null,
          file: path.relative(componentRoot, out),
          instances: extract.instances.length,
        });
      }
    }

    const indexPath = path.join(nodesDir, 'index.json');
    writeJson(indexPath, nodeExtractIndex);
    manifest.figma.files.nodes = path.relative(componentRoot, indexPath);
    manifest.figma.nodeMeta = nodeMeta;
  } catch (e) {
    manifest.figma.notes = manifest.figma.notes || [];
    manifest.figma.notes.push(`figma nodes fetch failed (ignored): ${e instanceof Error ? e.message : String(e)}`);
  }

  manifest.figma.status = 'ok';
  manifest.figma.assets = [];

  const exportGroups = new Map();
  for (const node of nodes) {
    const fmt = String(node.export?.format || exportFormat);
    const scaleRaw = node.export?.scale ?? exportScale;
    const scale = Number.isFinite(Number(scaleRaw)) && Number(scaleRaw) > 0 ? Number(scaleRaw) : exportScale;
    const key = `${fmt}:${scale}`;
    if (!exportGroups.has(key)) exportGroups.set(key, { format: fmt, scale, nodes: [] });
    exportGroups.get(key).nodes.push(node);
  }

  for (const group of exportGroups.values()) {
    const groupIds = group.nodes.map((n) => n.id).join(',');
    let imagesJson = null;
    try {
      imagesJson = curlJson(
        `https://api.figma.com/v1/images/${encodeURIComponent(fileKey)}?ids=${encodeURIComponent(groupIds)}&format=${encodeURIComponent(group.format)}&scale=${encodeURIComponent(String(group.scale))}`,
        headers,
      );
    } catch (e) {
      manifest.figma.status = 'error';
      manifest.figma.error = `figma images fetch failed: ${e instanceof Error ? e.message : String(e)}`;
      return;
    }

    const images = imagesJson.images || {};
    for (const node of group.nodes) {
      const id = node.id;
      const url = images[id] || null;
      const baseName = `${safeFigmaId(id)}@${group.scale}x.${group.format}`;
      const outPath = path.join(imagesDir, baseName);

      const asset = {
        id,
        label: node.label || null,
        url,
        export: { format: group.format, scale: group.scale },
        file: path.relative(componentRoot, outPath),
        status: 'skipped',
      };

      if (!url) {
        asset.status = 'missing';
        manifest.figma.assets.push(asset);
        continue;
      }

      if (!force && exists(outPath)) {
        asset.status = 'ok';
        asset.skipped = true;
        manifest.figma.assets.push(asset);
        continue;
      }

      const dl = downloadFile(url, outPath, { force: true });
      asset.status = dl.ok ? 'ok' : 'error';
      asset.error = dl.ok ? null : dl.error;
      manifest.figma.assets.push(asset);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..', '..');
  const resourcesRoot = path.join(repoRoot, 'resources', 'dads');
  const componentSlug = args.component;
  const componentRoot = path.join(resourcesRoot, 'components', componentSlug);

  ensureDir(componentRoot);

  const manifestPath = path.join(componentRoot, 'manifest.json');
  let previousManifest = null;
  if (exists(manifestPath)) {
    try {
      previousManifest = readJson(manifestPath);
    } catch {
      previousManifest = null;
    }
  }

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    component: { slug: componentSlug },
    sources: {
      dadsDocs: {
        baseUrl: `https://design.digital.go.jp/dads/components/${componentSlug}/`,
        overviewUrl: `https://design.digital.go.jp/dads/components/${componentSlug}/`,
        usageUrl: `https://design.digital.go.jp/dads/components/${componentSlug}/usage/`,
        accessibilityUrl: `https://design.digital.go.jp/dads/components/${componentSlug}/accessibility/`,
      },
      dadsHtmlStorybook: {
        baseUrl: 'https://design.digital.go.jp/dads/html/',
        indexUrl: 'https://design.digital.go.jp/dads/html/index.json',
      },
      upstreamHtmlRepo: {
        repoUrl: 'https://github.com/digital-go-jp/design-system-example-components-html.git',
        ref: 'main',
      },
    },
    docs: {},
    storybook: {},
    upstream: {},
    notes: [],
  };

  // NOTE: agent-browser has an upper bound on session name length; keep it short.
  const session = `dads-sync-${componentSlug}`;
  const ab = {
    tryJson: (abArgs) => tryRunJson('agent-browser', ['--session', session, ...abArgs, '--json']),
    run: (abArgs, opts = {}) => run('agent-browser', ['--session', session, ...abArgs, '--json'], opts),
  };

  function stabilizePage() {
    // Prevent transitions/animations from affecting screenshot diffs.
    const js = `(() => {
      try {
        const id = '__dads_sync_stabilize';
        if (document.getElementById(id)) return true;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = [
          '*{animation:none !important;transition:none !important;scroll-behavior:auto !important;}',
          'html:focus-within{scroll-behavior:auto !important;}',
        ].join('\\n');
        (document.head || document.documentElement).appendChild(style);
        return true;
      } catch (e) {
        return false;
      }
    })()`;
    ab.tryJson(['eval', js]);
  }

  // Browser session setup (stable screenshots)
  ab.run(['set', 'viewport', String(args.viewport.width), String(args.viewport.height)], { stdio: 'pipe' });
  {
    const media = ab.tryJson(['set', 'media', 'light', 'reduced-motion']);
    if (!media.ok) manifest.notes.push(`agent-browser set media failed (ignored): ${summarizeAgentBrowserError(media.error)}`);
  }

  function openAndWaitForContent(url) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const opened = ab.tryJson(['open', url]);
      if (!opened.ok) return { ok: false, error: opened.error };

      const waitMain = ab.tryJson(['wait', 'main']);
      if (waitMain.ok) {
        stabilizePage();
        return { ok: true, selector: 'main' };
      }

      const waitMainContents = ab.tryJson(['wait', '#mainContents']);
      if (waitMainContents.ok) {
        stabilizePage();
        return { ok: true, selector: '#mainContents' };
      }

      manifest.notes.push(`openAndWaitForContent retry ${attempt} failed: ${url}`);
    }

    return { ok: false, error: 'Failed to find main/#mainContents (visible) after retries' };
  }

  // --- docs (overview/usage/accessibility) ---------------------------------
  const docsPages = [
    { key: 'overview', url: manifest.sources.dadsDocs.overviewUrl },
    { key: 'usage', url: manifest.sources.dadsDocs.usageUrl },
    { key: 'accessibility', url: manifest.sources.dadsDocs.accessibilityUrl },
  ];

  for (const page of docsPages) {
    const outDir = path.join(componentRoot, 'docs', page.key);
    const htmlPath = path.join(outDir, 'page.html');
    const textPath = path.join(outDir, 'page.txt');
    const screenshotPath = path.join(outDir, 'screenshot.png');
    const imagesDir = path.join(outDir, 'images');

    ensureDir(outDir);

    const htmlRes = fetchUrlToFile(page.url, htmlPath, { force: args.force });
    if (htmlRes.error) {
      manifest.docs[page.key] = { status: 'error', url: page.url, error: htmlRes.error };
      continue;
    }
    if (htmlRes.status !== 200) {
      manifest.docs[page.key] = { status: 'missing', url: page.url, httpStatus: htmlRes.status };
      continue;
    }

    const pageInfo = {
      status: 'ok',
      url: page.url,
      httpStatus: 200,
      files: { html: path.relative(componentRoot, htmlPath) },
      images: [],
    };

    // Visible text
    if (args.force || !exists(textPath)) {
      const opened = openAndWaitForContent(page.url);
      if (!opened.ok) {
        pageInfo.status = 'error';
        pageInfo.error = opened.error;
        manifest.docs[page.key] = pageInfo;
        continue;
      }

      ab.run(['wait', '250'], { stdio: 'pipe' });

      const textRes = ab.tryJson(['get', 'text', opened.selector]);
      if (!textRes.ok) {
        pageInfo.status = 'error';
        pageInfo.error = textRes.error;
        manifest.docs[page.key] = pageInfo;
        continue;
      }
      fs.writeFileSync(textPath, `${textRes.json.data.text}\n`);
    }

    // Screenshot
    if (args.force || !exists(screenshotPath)) {
      const opened = openAndWaitForContent(page.url);
      if (opened.ok) {
        ab.run(['wait', '250'], { stdio: 'pipe' });
        ab.run(['screenshot', '--full', screenshotPath], { stdio: 'pipe' });
      }
    }

    // Images in main
    ensureDir(imagesDir);
    {
      const opened = openAndWaitForContent(page.url);
      if (opened.ok) {
        ab.run(['wait', '250'], { stdio: 'pipe' });
        const imgsRes = ab.tryJson([
          'eval',
          "(() => { const roots = [document.querySelector('main'), document.querySelector('#mainContents')].filter(Boolean); const srcs = []; for (const r of roots) { srcs.push(...Array.from(r.querySelectorAll('img')).map(img => img.getAttribute('src')).filter(Boolean)); } return Array.from(new Set(srcs)); })()",
        ]);
        if (imgsRes.ok) {
          for (const src of imgsRes.json.data.result) {
            const abs = new URL(src, page.url).toString();
            const fileName = path.basename(new URL(abs).pathname);
            const out = path.join(imagesDir, fileName);
            const dl = downloadFile(abs, out, { force: args.force });
            pageInfo.images.push({
              src,
              url: abs,
              file: path.relative(componentRoot, out),
              status: dl.ok ? 'ok' : 'error',
              error: dl.ok ? null : dl.error,
            });
          }
        }
      }
    }

    pageInfo.files = {
      ...pageInfo.files,
      ...(exists(textPath) ? { text: path.relative(componentRoot, textPath) } : {}),
      ...(exists(screenshotPath) ? { screenshot: path.relative(componentRoot, screenshotPath) } : {}),
    };
    manifest.docs[page.key] = pageInfo;
  }

  // --- storybook (html) ----------------------------------------------------
  const storybookDir = path.join(componentRoot, 'storybook');
  const storybookIndexPath = path.join(resourcesRoot, 'html-storybook', 'index.json');
  ensureDir(path.dirname(storybookIndexPath));

  const sbIndexRes = fetchUrlToFile(manifest.sources.dadsHtmlStorybook.indexUrl, storybookIndexPath, {
    force: args.force,
  });
  if (sbIndexRes.status !== 200) {
    manifest.storybook = {
      status: 'error',
      error: sbIndexRes.error || `Failed to fetch index.json (http ${sbIndexRes.status})`,
    };
  } else {
    let sbIndex = null;
    try {
      sbIndex = readJson(storybookIndexPath);
    } catch (e) {
      sbIndex = null;
      manifest.storybook = { status: 'error', error: `Failed to parse storybook index.json: ${String(e)}` };
    }

    if (sbIndex) {
      const entries = Object.values(sbIndex.entries || {}).filter((e) => String(e.importPath || '').includes(`./src/components/${componentSlug}/`));
      ensureDir(storybookDir);
      const entriesPath = path.join(storybookDir, 'entries.json');
      writeJson(entriesPath, { component: componentSlug, generatedAt: new Date().toISOString(), entries });

      if (entries.length === 0) {
        manifest.storybook = {
          status: 'not_found',
          reason: `No storybook entries found for ./src/components/${componentSlug}/`,
          entries: [],
          files: { entries: path.relative(componentRoot, entriesPath) },
        };
      } else {
        const uiDir = path.join(storybookDir, 'ui');
        const canvasDir = path.join(storybookDir, 'canvas');
        const htmlDir = path.join(storybookDir, 'html');
        ensureDir(uiDir);
        ensureDir(canvasDir);
        ensureDir(htmlDir);

        const captured = [];
        for (const e of entries) {
          const type = e.type === 'docs' ? 'docs' : 'story';
          const fileBase = `${type}--${slugify(e.name)}--${shortHash(e.id)}`;
          const uiPng = path.join(uiDir, `${fileBase}.png`);
          const canvasPng = path.join(canvasDir, `${fileBase}.png`);
          const canvasHtml = path.join(htmlDir, `${fileBase}.html`);

          const uiUrl = `${manifest.sources.dadsHtmlStorybook.baseUrl}?path=/${type}/${encodeURIComponent(e.id)}`;
          const iframeUrl = `${manifest.sources.dadsHtmlStorybook.baseUrl}iframe.html?id=${encodeURIComponent(e.id)}`;
          const canvasRootSelector = type === 'docs' ? '#storybook-docs' : '#storybook-root';

          const entry = {
            id: e.id,
            type,
            name: e.name,
            title: e.title,
            uiUrl,
            iframeUrl,
            status: 'ok',
            error: null,
            ui: { status: 'skipped', error: null },
            canvas: { status: 'skipped', error: null },
            files: {
              uiPng: path.relative(componentRoot, uiPng),
              canvasPng: path.relative(componentRoot, canvasPng),
              canvasHtml: path.relative(componentRoot, canvasHtml),
            },
          };

          // UI screenshot
          if (!args.force && exists(uiPng)) {
            entry.ui.status = 'ok';
            entry.ui.skipped = true;
          } else {
            const opened = ab.tryJson(['open', uiUrl]);
            if (!opened.ok) {
              entry.ui.status = 'error';
              entry.ui.error = summarizeAgentBrowserError(opened.error);
              entry.status = 'error';
            } else {
              stabilizePage();
              const waited = ab.tryJson(['wait', '#storybook-preview-iframe']);
              if (!waited.ok) manifest.notes.push(`storybook ui wait failed (${e.id}): ${summarizeAgentBrowserError(waited.error)}`);
              try {
                ab.run(['wait', '300'], { stdio: 'pipe' });
                ab.run(['screenshot', '--full', uiPng], { stdio: 'pipe' });
                entry.ui.status = 'ok';
              } catch (err) {
                entry.ui.status = 'error';
                entry.ui.error = summarizeAgentBrowserError(err instanceof Error ? err.message : String(err));
                entry.status = 'error';
              }
            }
          }

          // Canvas screenshot + HTML
          if (!args.force && exists(canvasPng) && exists(canvasHtml)) {
            entry.canvas.status = 'ok';
            entry.canvas.skipped = true;
          } else {
            const opened = ab.tryJson(['open', iframeUrl]);
            if (!opened.ok) {
              entry.canvas.status = 'error';
              entry.canvas.error = summarizeAgentBrowserError(opened.error);
              entry.status = 'error';
            } else {
              stabilizePage();
              const waited = ab.tryJson(['wait', canvasRootSelector]);
              if (!waited.ok) {
                entry.canvas.status = 'error';
                entry.canvas.error = summarizeAgentBrowserError(waited.error);
                entry.status = 'error';
              } else {
                try {
                  ab.run(['wait', '250'], { stdio: 'pipe' });
                  if (args.force || !exists(canvasPng)) ab.run(['screenshot', '--full', canvasPng], { stdio: 'pipe' });
                  if (args.force || !exists(canvasHtml)) {
                    const htmlRes = ab.tryJson(['get', 'html', canvasRootSelector]);
                    if (htmlRes.ok) fs.writeFileSync(canvasHtml, `${htmlRes.json.data.html}\n`);
                  }
                  entry.canvas.status = 'ok';
                } catch (err) {
                  entry.canvas.status = 'error';
                  entry.canvas.error = summarizeAgentBrowserError(err instanceof Error ? err.message : String(err));
                  entry.status = 'error';
                }
              }
            }
          }

          if (entry.status !== 'ok') {
            entry.error = [entry.ui.error, entry.canvas.error].filter(Boolean).join(' / ') || 'storybook capture failed';
          }

          captured.push(entry);
        }

        manifest.storybook = {
          status: 'ok',
          entries: captured,
          files: { entries: path.relative(componentRoot, entriesPath) },
        };
      }
    }
  }

  // --- upstream html repo --------------------------------------------------
  const upstreamTmp = path.join(repoRoot, '.context', 'upstreams', 'design-system-example-components-html');
  ensureDir(path.dirname(upstreamTmp));

  if (!exists(upstreamTmp)) {
    run('git', ['clone', '--depth', '1', manifest.sources.upstreamHtmlRepo.repoUrl, upstreamTmp], { stdio: 'pipe' });
  } else {
    run('git', ['-C', upstreamTmp, 'fetch', '--depth', '1', 'origin', manifest.sources.upstreamHtmlRepo.ref], { stdio: 'pipe' });
    run('git', ['-C', upstreamTmp, 'reset', '--hard', `origin/${manifest.sources.upstreamHtmlRepo.ref}`], { stdio: 'pipe' });
  }

  let upstreamCommit = null;
  try {
    upstreamCommit = run('git', ['-C', upstreamTmp, 'rev-parse', 'HEAD'], { stdio: 'pipe' }).stdout.trim();
  } catch {
    upstreamCommit = null;
  }

  const upstreamComponentPath = path.join(upstreamTmp, 'src', 'components', componentSlug);
  const upstreamOutRoot = path.join(componentRoot, 'upstream', 'design-system-example-components-html');
  const upstreamMetaPath = path.join(upstreamOutRoot, 'META.json');
  ensureDir(upstreamOutRoot);
  writeJson(upstreamMetaPath, {
    repoUrl: manifest.sources.upstreamHtmlRepo.repoUrl,
    ref: manifest.sources.upstreamHtmlRepo.ref,
    commit: upstreamCommit,
    syncedAt: new Date().toISOString(),
  });

  const upstreamLicenseSrc = path.join(upstreamTmp, 'LICENSE');
  const upstreamLicenseDest = path.join(upstreamOutRoot, 'LICENSE');
  if (exists(upstreamLicenseSrc) && (args.force || !exists(upstreamLicenseDest))) {
    fs.copyFileSync(upstreamLicenseSrc, upstreamLicenseDest);
  }

  if (!exists(upstreamComponentPath)) {
    manifest.upstream = {
      status: 'missing',
      reason: `No upstream path: src/components/${componentSlug}`,
      commit: upstreamCommit,
      files: {
        meta: path.relative(componentRoot, upstreamMetaPath),
        ...(exists(upstreamLicenseDest) ? { license: path.relative(componentRoot, upstreamLicenseDest) } : {}),
      },
    };
  } else {
    const dest = path.join(upstreamOutRoot, 'src', 'components', componentSlug);
    if (args.force && exists(dest)) fs.rmSync(dest, { recursive: true, force: true });
    if (!exists(dest)) {
      ensureDir(path.dirname(dest));
      run('cp', ['-R', upstreamComponentPath, dest], { stdio: 'pipe' });
    }

    // Copy minimal shared dependencies that are required to understand/run the snapshot.
    const copied = [path.relative(componentRoot, dest)];
    const extraFiles = [
      { src: path.join(upstreamTmp, 'src', 'global.css'), dest: path.join(upstreamOutRoot, 'src', 'global.css') },
      {
        src: path.join(upstreamTmp, 'src', 'helpers', 'html-fragment.ts'),
        dest: path.join(upstreamOutRoot, 'src', 'helpers', 'html-fragment.ts'),
      },
    ];
    for (const f of extraFiles) {
      if (!exists(f.src)) continue;
      if (args.force || !exists(f.dest)) {
        ensureDir(path.dirname(f.dest));
        fs.copyFileSync(f.src, f.dest);
      }
      copied.push(path.relative(componentRoot, f.dest));
    }

    manifest.upstream = {
      status: 'ok',
      commit: upstreamCommit,
      copied,
      files: {
        meta: path.relative(componentRoot, upstreamMetaPath),
        ...(exists(upstreamLicenseDest) ? { license: path.relative(componentRoot, upstreamLicenseDest) } : {}),
      },
    };
  }

  // --- figma (optional; requires config + token) ---------------------------
  try {
    syncFigma({ componentRoot, manifest, force: args.force, previousFigma: previousManifest?.figma || null });
  } catch (e) {
    manifest.figma = {
      status: 'error',
      error: e instanceof Error ? e.message : String(e),
    };
  }

  // Write manifest + update global index
  writeJson(manifestPath, manifest);
  updateIndexJson(path.join(resourcesRoot, 'index.json'), componentSlug, manifest);

  {
    const closed = ab.tryJson(['close']);
    if (!closed.ok) manifest.notes.push(`agent-browser close failed (ignored): ${closed.error}`);
    writeJson(manifestPath, manifest);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Synced DADS resources: ${componentSlug}`);
  // eslint-disable-next-line no-console
  console.log(`- manifest: ${path.relative(repoRoot, manifestPath)}`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(`❌ dads:sync failed: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});

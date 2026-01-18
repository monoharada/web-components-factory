#!/usr/bin/env node

/**
 * Validate synced DADS resources for a component.
 *
 * Usage:
 *   node scripts/dads/validate.cjs --component file-upload
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { component: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--component' || a === '-c') args.component = argv[++i];
    else if (a === '--help' || a === '-h') {
      // eslint-disable-next-line no-console
      console.log('Usage: npm run dads:validate -- --component <slug>');
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }
  if (!args.component) throw new Error('Missing --component');
  return args;
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

function assertFile(p, label, errors) {
  if (!exists(p)) errors.push(`Missing ${label}: ${p}`);
  else if (fs.statSync(p).size === 0) errors.push(`Empty ${label}: ${p}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..', '..');
  const resourcesRoot = path.join(repoRoot, 'resources', 'dads');
  const componentRoot = path.join(resourcesRoot, 'components', args.component);
  const manifestPath = path.join(componentRoot, 'manifest.json');

  const errors = [];

  assertFile(path.join(resourcesRoot, 'README.md'), 'resources README', errors);
  assertFile(path.join(resourcesRoot, 'index.json'), 'resources index.json', errors);
  assertFile(manifestPath, 'component manifest', errors);

  if (!exists(manifestPath)) {
    // eslint-disable-next-line no-console
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const manifest = readJson(manifestPath);

  // docs
  for (const key of ['overview', 'usage', 'accessibility']) {
    const page = manifest.docs?.[key];
    if (!page) {
      errors.push(`manifest.docs.${key} is missing`);
      continue;
    }

    if (page.status !== 'ok') continue;

    const files = page.files || {};
    assertFile(path.join(componentRoot, files.html || ''), `docs.${key}.html`, errors);
    assertFile(path.join(componentRoot, files.text || ''), `docs.${key}.text`, errors);
    assertFile(path.join(componentRoot, files.screenshot || ''), `docs.${key}.screenshot`, errors);

    for (const img of page.images || []) {
      if (img.status !== 'ok') continue;
      assertFile(path.join(componentRoot, img.file || ''), `docs.${key}.image`, errors);
    }
  }

  // storybook
  const sb = manifest.storybook;
  if (!sb) errors.push('manifest.storybook is missing');
  else if (sb.status === 'ok') {
    for (const entry of sb.entries || []) {
      const files = entry.files || {};
      assertFile(path.join(componentRoot, files.uiPng || ''), 'storybook ui screenshot', errors);
      assertFile(path.join(componentRoot, files.canvasPng || ''), 'storybook canvas screenshot', errors);
      assertFile(path.join(componentRoot, files.canvasHtml || ''), 'storybook canvas html', errors);
    }
  }

  // upstream
  const up = manifest.upstream;
  if (!up) errors.push('manifest.upstream is missing');
  else {
    if (up.files?.meta) assertFile(path.join(componentRoot, up.files.meta), 'upstream META.json', errors);
    if (up.status === 'ok') {
      for (const rel of up.copied || []) assertFile(path.join(componentRoot, rel), 'upstream copied path', errors);
    }
  }

  // figma (optional)
  const figma = manifest.figma;
  if (figma && figma.status === 'ok') {
    if (figma.files?.config) assertFile(path.join(componentRoot, figma.files.config), 'figma config.json', errors);
    if (figma.files?.nodes) {
      const nodesIndexPath = path.join(componentRoot, figma.files.nodes);
      assertFile(nodesIndexPath, 'figma nodes index.json', errors);
      if (exists(nodesIndexPath)) {
        try {
          const nodesIndex = readJson(nodesIndexPath);
          if (Array.isArray(nodesIndex.nodes)) {
            for (const n of nodesIndex.nodes) {
              if (!n?.file) continue;
              assertFile(path.join(componentRoot, n.file), `figma node json (${n.id || 'unknown'})`, errors);
            }
          }
        } catch (e) {
          errors.push(`Failed to parse figma nodes index.json: ${nodesIndexPath}`);
        }
      }
    }
    for (const asset of figma.assets || []) {
      if (asset.status !== 'ok') continue;
      assertFile(path.join(componentRoot, asset.file || ''), 'figma asset', errors);
    }
  }

  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`❌ DADS resources validation failed for ${args.component}\n` + errors.map((e) => `- ${e}`).join('\n'));
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ DADS resources validation passed for ${args.component}`);
}

main();

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
  if (!exists(p)) {
    errors.push(`Missing ${label}: ${p}`);
    return;
  }

  const stat = fs.statSync(p);
  if (!stat.isFile()) {
    errors.push(`Not a file ${label}: ${p}`);
    return;
  }

  if (stat.size === 0) errors.push(`Empty ${label}: ${p}`);
}

function assertPath(p, label, errors) {
  if (!exists(p)) errors.push(`Missing ${label}: ${p}`);
}

function assertRelPath(rel, label, errors) {
  if (!rel || typeof rel !== 'string' || rel.trim() === '') {
    errors.push(`Missing ${label} path in manifest`);
    return null;
  }

  if (path.isAbsolute(rel)) {
    errors.push(`Invalid ${label} path (must be relative): ${rel}`);
    return null;
  }

  // Prevent traversing outside of componentRoot.
  const normalized = rel.replace(/\\/g, '/');
  if (normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) {
    errors.push(`Invalid ${label} path (path traversal): ${rel}`);
    return null;
  }

  return rel;
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

    if (page.status === 'missing') continue;
    if (page.status === 'error') {
      errors.push(`docs.${key} failed: ${page.error || 'unknown error'}`);
      continue;
    }
    if (page.status !== 'ok') {
      errors.push(`docs.${key} has unknown status: ${page.status}`);
      continue;
    }

    const files = page.files || {};
    {
      const rel = assertRelPath(files.html, `docs.${key}.html`, errors);
      if (rel) assertFile(path.join(componentRoot, rel), `docs.${key}.html`, errors);
    }
    {
      const rel = assertRelPath(files.text, `docs.${key}.text`, errors);
      if (rel) assertFile(path.join(componentRoot, rel), `docs.${key}.text`, errors);
    }
    {
      const rel = assertRelPath(files.screenshot, `docs.${key}.screenshot`, errors);
      if (rel) assertFile(path.join(componentRoot, rel), `docs.${key}.screenshot`, errors);
    }

    for (const img of page.images || []) {
      if (img.status !== 'ok') continue;
      const rel = assertRelPath(img.file, `docs.${key}.image`, errors);
      if (rel) assertFile(path.join(componentRoot, rel), `docs.${key}.image`, errors);
    }
  }

  // storybook
  const sb = manifest.storybook;
  if (!sb) errors.push('manifest.storybook is missing');
  else {
    const sbEntriesRel = sb.files?.entries;
    if (sbEntriesRel) {
      const rel = assertRelPath(sbEntriesRel, 'storybook entries.json', errors);
      if (rel) assertFile(path.join(componentRoot, rel), 'storybook entries.json', errors);
    }

    if (sb.status === 'not_found') {
      // acceptable: no storybook entries for this component
    } else if (sb.status === 'error') {
      errors.push(`storybook failed: ${sb.error || 'unknown error'}`);
    } else if (sb.status === 'ok') {
      for (const entry of sb.entries || []) {
        const entryStatus = entry.status || 'ok';
        if (entryStatus !== 'ok') {
          errors.push(`storybook entry failed (${entry.id || 'unknown'}): ${entry.error || entryStatus}`);
        }

        const files = entry.files || {};
        {
          const rel = assertRelPath(files.uiPng, 'storybook ui screenshot', errors);
          if (rel) assertFile(path.join(componentRoot, rel), 'storybook ui screenshot', errors);
        }
        {
          const rel = assertRelPath(files.canvasPng, 'storybook canvas screenshot', errors);
          if (rel) assertFile(path.join(componentRoot, rel), 'storybook canvas screenshot', errors);
        }
        {
          const rel = assertRelPath(files.canvasHtml, 'storybook canvas html', errors);
          if (rel) assertFile(path.join(componentRoot, rel), 'storybook canvas html', errors);
        }
      }
    } else {
      errors.push(`manifest.storybook has unknown status: ${sb.status}`);
    }
  }

  // upstream
  const up = manifest.upstream;
  if (!up) errors.push('manifest.upstream is missing');
  else {
    if (up.files?.meta) assertFile(path.join(componentRoot, up.files.meta), 'upstream META.json', errors);
    {
      const licensePath = path.join(componentRoot, 'upstream', 'design-system-example-components-html', 'LICENSE');
      assertFile(licensePath, 'upstream LICENSE', errors);
    }
    if (up.status === 'ok') {
      for (const rel of up.copied || []) {
        const safe = assertRelPath(rel, 'upstream copied path', errors);
        if (!safe) continue;
        assertPath(path.join(componentRoot, safe), 'upstream copied path', errors);
      }
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

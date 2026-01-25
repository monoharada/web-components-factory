import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  collectCemCustomElements,
  isGlobLike,
  matchesGlob,
  validateTextAgainstCem,
} from './validator-core.mjs';

const DEFAULT_CONFIG_PATH = path.resolve(process.cwd(), 'wc.config.js');

// Viewer-only demo components (not part of the public design system API).
const IGNORE_TAGS = Object.freeze(new Set(['reset-card', 'minimal-reset-card', 'no-reset-card']));

async function loadConfig(configPath) {
  const resolved = path.resolve(process.cwd(), configPath);
  const mod = await import(pathToFileURL(resolved).href);
  const cfg = mod?.default ?? mod;
  if (!cfg || typeof cfg !== 'object') {
    throw new Error(`Invalid config export: ${configPath}`);
  }
  return cfg;
}

async function main() {
  const argv = process.argv.slice(2);
  const configFlagIndex = argv.findIndex((a) => a === '--config' || a === '-c');
  const configPath =
    configFlagIndex >= 0 && argv[configFlagIndex + 1]
      ? argv[configFlagIndex + 1]
      : DEFAULT_CONFIG_PATH;

  const cfg = await loadConfig(configPath);

  const include = Array.isArray(cfg.include) ? cfg.include : [];
  const exclude = Array.isArray(cfg.exclude) ? cfg.exclude : [];
  const manifestSrc = typeof cfg.manifestSrc === 'string' ? cfg.manifestSrc : './custom-elements.json';
  const diagnosticSeverity = cfg.diagnosticSeverity ?? {};

  const patterns = argv.filter((a, i) => i !== configFlagIndex && i !== configFlagIndex + 1);
  const targets = patterns.length > 0 ? patterns : include;

  if (targets.length === 0) {
    console.error('No files specified (and config.include is empty).');
    process.exit(2);
  }

  // This script intentionally does not implement glob expansion yet.
  // Keeping it deterministic and dependency-free is preferred for CI.
  if (targets.some(isGlobLike)) {
    console.error('Glob patterns are not supported yet. Use explicit file paths for now.');
    process.exit(2);
  }

  const manifestPath = path.resolve(process.cwd(), manifestSrc);
  const manifestText = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestText);
  const cem = collectCemCustomElements(manifest);

  const allDiagnostics = [];

  for (const t of targets) {
    const abs = path.resolve(process.cwd(), t);
    const rel = path.relative(process.cwd(), abs);

    const isExcluded = exclude.some((pat) => matchesGlob(rel, pat));
    if (isExcluded) continue;

    const text = await fs.readFile(abs, 'utf8');
    const diags = validateTextAgainstCem({
      filePath: rel,
      text,
      cem,
      severity: diagnosticSeverity,
      ignoreTags: IGNORE_TAGS,
    });
    if (diags.length > 0) allDiagnostics.push(...diags);
  }

  const errors = allDiagnostics.filter((d) => d.severity === 'error');
  const warnings = allDiagnostics.filter((d) => d.severity === 'warning');

  if (allDiagnostics.length === 0) {
    console.log('✅ validate:wc: no issues found.');
    process.exit(0);
  }

  for (const d of allDiagnostics) {
    const loc = `${d.file}:${d.line}:${d.col}`;
    console.log(`${loc}  ${d.severity}  ${d.code}  ${d.message}`);
  }

  console.log(
    `\nFound ${errors.length} error(s) and ${warnings.length} warning(s) in ${targets.length} file(s).`,
  );

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

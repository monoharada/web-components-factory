#!/usr/bin/env node
/**
 * migrate-skills-registry-v2.mjs
 *
 * Migrates registry/skills-registry.json from schemaVersion 1 to schemaVersion 2.
 *
 * New fields per skill:
 *   - tags, dependencies, requiredCapabilities, sections, sizeBytes
 * New top-level fields:
 *   - compat (minVersion per client)
 *   - lastUpdated
 *
 * Usage:
 *   node scripts/migrate-skills-registry-v2.mjs
 */

import { readFileSync, writeFileSync, renameSync, readdirSync, statSync, existsSync, unlinkSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

const REGISTRY_PATH = join(REPO_ROOT, 'registry', 'skills-registry.json');
const BACKUP_PATH = join(REPO_ROOT, 'registry', 'skills-registry.v1.backup.json');
const TMP_PATH = REGISTRY_PATH + '.tmp';

const TODAY = '2026-03-04';

const DEFAULT_COMPAT = {
  minVersion: {
    claude_code: '1.0',
    cursor: '0.50',
    codex: '0.1',
  },
};

// ---------------------------------------------------------------------------
// Preset mappings
// ---------------------------------------------------------------------------

const TAG_MAP = {
  'component-design-study':    ['spec', 'workflow'],
  'css-writing-rules':         ['spec', 'token'],
  'headless-component-design': ['spec'],
  'wcf-compose':               ['workflow'],
  'wcf-discovery':             ['workflow'],
  'wcf-install':               ['workflow'],
  'wcf-ui-builder':            ['workflow'],
  'wcf-validate':              ['audit'],
};

const DEPS_MAP = {
  'component-design-study':    [],
  'css-writing-rules':         [],
  'headless-component-design': [],
  'wcf-compose':               ['wcf-install'],
  'wcf-discovery':             [],
  'wcf-install':               ['wcf-discovery'],
  'wcf-ui-builder':            ['wcf-discovery', 'wcf-install', 'wcf-compose', 'wcf-validate'],
  'wcf-validate':              [],
};

const CAPABILITIES_MAP = {
  'component-design-study':    ['read_repo', 'web_fetch'],
  'css-writing-rules':         ['read_repo'],
  'headless-component-design': ['read_repo'],
  'wcf-compose':               ['read_repo', 'write_repo'],
  'wcf-discovery':             ['read_repo', 'mcp_tools'],
  'wcf-install':               ['read_repo', 'run_commands'],
  'wcf-ui-builder':            ['read_repo', 'write_repo', 'mcp_tools'],
  'wcf-validate':              ['read_repo', 'mcp_tools'],
};

const SECTIONS_MAP = {
  'component-design-study':    ['overview', 'workflow', 'do_dont', 'references'],
  'css-writing-rules':         ['overview', 'workflow', 'do_dont', 'references'],
  'headless-component-design': ['overview', 'do_dont', 'references'],
  'wcf-compose':               ['overview', 'workflow'],
  'wcf-discovery':             ['overview', 'workflow'],
  'wcf-install':               ['overview', 'workflow'],
  'wcf-ui-builder':            ['overview', 'workflow'],
  'wcf-validate':              ['overview', 'workflow', 'do_dont'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively calculate total size of all files in a directory.
 * @param {string} dirPath - Absolute path to the directory
 * @returns {number} Total bytes
 */
function calcDirSize(dirPath) {
  if (!existsSync(dirPath)) {
    return 0;
  }

  let total = 0;
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      total += calcDirSize(fullPath);
    } else if (entry.isFile()) {
      total += statSync(fullPath).size;
    }
  }

  return total;
}

/**
 * Abort with message and exit code 1.
 * @param {string} message
 */
function abort(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

/**
 * Restore from backup if it exists, then abort.
 * @param {string} message
 */
function restoreAndAbort(message) {
  console.error(`VALIDATION FAILED: ${message}`);
  if (existsSync(BACKUP_PATH)) {
    try {
      const backup = readFileSync(BACKUP_PATH, 'utf-8');
      writeFileSync(REGISTRY_PATH, backup, 'utf-8');
      console.error('Restored from backup.');
    } catch (restoreErr) {
      console.error(`Failed to restore from backup: ${restoreErr.message}`);
    }
  }
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // 1. Read registry
  if (!existsSync(REGISTRY_PATH)) {
    abort(`File not found: ${REGISTRY_PATH}`);
  }

  let raw;
  try {
    raw = readFileSync(REGISTRY_PATH, 'utf-8');
  } catch (err) {
    abort(`Failed to read registry: ${err.message}`);
  }

  let registry;
  try {
    registry = JSON.parse(raw);
  } catch (err) {
    abort(`Invalid JSON in registry: ${err.message}`);
  }

  // 2. Validate schemaVersion === 1
  if (registry.schemaVersion !== 1) {
    abort(`Expected schemaVersion 1, got ${registry.schemaVersion}. Aborting.`);
  }

  // 3. Create backup
  try {
    writeFileSync(BACKUP_PATH, raw, 'utf-8');
    console.log(`Backup created: ${BACKUP_PATH}`);
  } catch (err) {
    abort(`Failed to create backup: ${err.message}`);
  }

  // 4. Set schemaVersion = 2
  registry.schemaVersion = 2;

  // 5. Migrate each skill — add 5 new fields: tags, version, dependencies, compat, manifest
  if (!Array.isArray(registry.skills)) {
    restoreAndAbort('registry.skills is not an array');
  }

  for (const skill of registry.skills) {
    const name = skill.name;

    if (!(name in TAG_MAP)) {
      console.warn(`WARNING: Unknown skill "${name}" — using default mappings`);
    }

    // tags
    skill.tags = TAG_MAP[name] ?? [];

    // version
    skill.version = '1.0.0';

    // dependencies
    skill.dependencies = DEPS_MAP[name] ?? [];

    // compat (per-skill)
    skill.compat = {
      minVersion: { ...DEFAULT_COMPAT.minVersion },
      capabilities: CAPABILITIES_MAP[name] ?? ['read_repo'],
    };

    // manifest
    const skillDir = join(REPO_ROOT, skill.path);
    skill.manifest = {
      author: 'wcf-team',
      license: 'MIT',
      entryFormat: 'markdown',
      sections: SECTIONS_MAP[name] ?? ['overview'],
      sizeBytes: calcDirSize(skillDir),
      lastUpdated: TODAY,
    };
  }

  // 6. Serialize with 2-space indent + trailing newline
  const output = JSON.stringify(registry, null, 2) + '\n';

  // 7. Validate migrated data before writing
  try {
    const parsed = JSON.parse(output);
    if (parsed.schemaVersion !== 2) {
      restoreAndAbort('Migrated schemaVersion is not 2');
    }
    if (!Array.isArray(parsed.skills) || parsed.skills.length === 0) {
      restoreAndAbort('Migrated skills array is empty or missing');
    }
    for (const skill of parsed.skills) {
      if (!Array.isArray(skill.tags)) {
        restoreAndAbort(`Skill "${skill.name}" missing tags array`);
      }
      if (typeof skill.version !== 'string') {
        restoreAndAbort(`Skill "${skill.name}" missing version string`);
      }
      if (!Array.isArray(skill.dependencies)) {
        restoreAndAbort(`Skill "${skill.name}" missing dependencies array`);
      }
      if (!skill.compat || !Array.isArray(skill.compat.capabilities)) {
        restoreAndAbort(`Skill "${skill.name}" missing compat.capabilities`);
      }
      if (!skill.manifest || typeof skill.manifest.sizeBytes !== 'number') {
        restoreAndAbort(`Skill "${skill.name}" missing manifest.sizeBytes`);
      }
      if (!Array.isArray(skill.manifest.sections)) {
        restoreAndAbort(`Skill "${skill.name}" missing manifest.sections`);
      }
    }
  } catch (err) {
    if (err.code === undefined) {
      // JSON.parse error vs validation abort (which calls process.exit)
      restoreAndAbort(`Output validation failed: ${err.message}`);
    }
    throw err;
  }

  // 8. Atomic write: write to .tmp then rename
  try {
    writeFileSync(TMP_PATH, output, 'utf-8');
    renameSync(TMP_PATH, REGISTRY_PATH);
  } catch (err) {
    // Clean up tmp file if rename failed
    if (existsSync(TMP_PATH)) {
      try { unlinkSync(TMP_PATH); } catch { /* ignore */ }
    }
    restoreAndAbort(`Atomic write failed: ${err.message}`);
  }

  console.log(`Migration complete: schemaVersion 1 -> 2`);
  console.log(`  Skills migrated: ${registry.skills.length}`);
  console.log(`  Last updated: ${TODAY}`);
}

main();

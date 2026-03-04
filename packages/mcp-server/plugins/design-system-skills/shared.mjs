/**
 * Shared utilities for design-system-skills plugin.
 * Single source of truth for registry loading, defaults, and error responses.
 */

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const REPO_ROOT = resolve(__dirname, '..', '..', '..', '..');
export const REGISTRY_PATH = resolve(REPO_ROOT, 'registry', 'skills-registry.json');

/** v2 defaults for v1 skill entries */
export const V2_DEFAULTS = {
  tags: [],
  version: '0.0.0',
  dependencies: [],
  compat: {},
  manifest: {},
};

/**
 * Load skills registry from disk.
 * @returns {Promise<object|null>}
 */
export async function loadRegistry() {
  try {
    const raw = await readFile(REGISTRY_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Normalize a raw skill entry from the registry, applying v2 defaults.
 * @param {object} skill - Raw skill entry
 * @returns {object} Normalized skill fields
 */
export function normalizeSkillEntry(skill) {
  return {
    name: skill.name,
    description: skill.description ?? '',
    status: skill.status ?? 'active',
    path: skill.path ?? '',
    entry: skill.entry ?? 'SKILL.md',
    clients: Array.isArray(skill.clients) ? skill.clients : [],
    tags: Array.isArray(skill.tags) ? skill.tags : V2_DEFAULTS.tags,
    version: typeof skill.version === 'string' ? skill.version : V2_DEFAULTS.version,
    dependencies: Array.isArray(skill.dependencies) ? skill.dependencies : V2_DEFAULTS.dependencies,
    compat: skill.compat ?? V2_DEFAULTS.compat,
    manifest: skill.manifest ?? V2_DEFAULTS.manifest,
  };
}

/**
 * Build an MCP error response.
 * @param {string} code
 * @param {string} message
 * @returns {object}
 */
export function buildErrorResponse(code, message) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: { code, message } }, null, 2),
      },
    ],
    isError: true,
  };
}

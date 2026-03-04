/**
 * get_skill_manifest plugin tool for wcf-mcp.
 * Returns skill metadata (manifest) from skills-registry v2.
 * Supports metadata-only, full content, and section extraction modes.
 * Plugin Contract v1.0+ (content modes require v1.1+)
 */

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..', '..', '..', '..');
const REGISTRY_PATH = resolve(REPO_ROOT, 'registry', 'skills-registry.json');

/** Maximum safe response size in bytes (95KB) */
const MAX_SAFE_RESPONSE = 95 * 1024;

/** v2 defaults for v1 skill entries */
const V2_DEFAULTS = {
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
async function loadRegistry() {
  try {
    const raw = await readFile(REGISTRY_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Build a full manifest object from a skill entry, applying v2 defaults.
 * @param {object} skill - Raw skill entry from the registry
 * @returns {object}
 */
function buildManifest(skill) {
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
 * Detect sections (H1/H2 headings) from markdown content.
 * @param {string} content
 * @returns {Array<{level: number, text: string, normalized: string}>}
 */
function detectSections(content) {
  const sections = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,2})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const normalized = text
        .toLowerCase()
        .replace(/[^a-z0-9\s_]/g, '')
        .replace(/\s+/g, '_');
      sections.push({ level, text, normalized });
    }
  }
  return sections;
}

/**
 * Extract a specific section from markdown content by normalized heading name.
 * @param {string} content
 * @param {string} sectionName
 * @returns {string|null}
 */
function extractSection(content, sectionName) {
  const lines = content.split('\n');
  let startLine = -1;
  let startLevel = 0;
  let endLine = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,2})\s+(.+)/);
    if (!match) continue;
    const level = match[1].length;
    const normalized = match[2]
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s_]/g, '')
      .replace(/\s+/g, '_');

    if (startLine === -1 && normalized.startsWith(sectionName)) {
      startLine = i;
      startLevel = level;
    } else if (startLine !== -1 && level <= startLevel) {
      endLine = i;
      break;
    }
  }

  if (startLine === -1) return null;
  return lines.slice(startLine, endLine).join('\n').trim();
}

/**
 * Build an MCP error response.
 * @param {string} code
 * @param {string} message
 * @returns {object}
 */
function buildErrorResponse(code, message) {
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

export default {
  name: 'design-system-skills-manifest',
  version: '1.0.0',
  tools: [
    {
      name: 'get_skill_manifest',
      description:
        'Return skill metadata (manifest) from skills-registry v2. When: retrieving full skill details, reading SKILL.md content, extracting specific sections. Returns: {manifest, content?, section_content?, content_size?, available_sections?, truncated?}. After: use skill content to guide implementation. Args: skill_id (required, e.g. "css-writing-rules"), include_content? (boolean, requires Contract v1.1+), section? (overview|workflow|do_dont|references|quick_reference|token_architecture|error_contract|procedure).',
      inputSchema: {},
      async handler(args, { helpers }) {
        // 1. Load registry
        const registry = await loadRegistry();
        if (!registry || !Array.isArray(registry.skills)) {
          return buildErrorResponse(
            'SKILLS_REGISTRY_UNAVAILABLE',
            'Skills registry data not available.',
          );
        }

        // 2. Find skill by name
        const { skill_id, include_content, section } = args;
        const skill = registry.skills.find((s) => s.name === skill_id);
        if (!skill) {
          return buildErrorResponse(
            'SKILL_NOT_FOUND',
            `Skill '${skill_id}' not found in registry.`,
          );
        }

        // 3. Build manifest with v2 defaults
        const manifest = buildManifest(skill);

        // 4. Mode 1: Metadata Only
        const wantsContent = include_content === true;
        const wantsSection = typeof section === 'string' && section.length > 0;

        if (!wantsContent && !wantsSection) {
          return helpers.buildJsonToolResponse({ manifest });
        }

        // 5. Modes 2 & 3 require loadTextData (Contract v1.1+)
        if (typeof helpers.loadTextData !== 'function') {
          return buildErrorResponse(
            'CONTRACT_VERSION_ERROR',
            'Content retrieval requires Contract v1.1+. loadTextData helper is not available.',
          );
        }

        // 6. Read SKILL.md from disk
        const skillFilePath = resolve(REPO_ROOT, skill.path ?? '', skill.entry ?? 'SKILL.md');
        let fileContent;
        try {
          fileContent = await readFile(skillFilePath, 'utf-8');
        } catch {
          const relPath = `${skill.path ?? ''}/${skill.entry ?? 'SKILL.md'}`;
          return buildErrorResponse(
            'SKILL_CONTENT_NOT_FOUND',
            `SKILL.md not found at ${relPath}`,
          );
        }

        // 7. Detect available sections
        const detectedSections = detectSections(fileContent);
        const available_sections = detectedSections.map((s) => s.normalized);

        // 8. Build response payload
        const payload = { manifest };
        let totalContentSize = 0;

        // Mode 2: Full content
        if (wantsContent) {
          const contentBytes = new TextEncoder().encode(fileContent).length;
          totalContentSize += contentBytes;
          payload.content = fileContent;
          payload.content_size = contentBytes;
        }

        // Mode 3: Section extraction
        if (wantsSection) {
          const sectionContent = extractSection(fileContent, section);
          if (sectionContent === null) {
            return buildErrorResponse(
              'SECTION_NOT_FOUND',
              `Section '${section}' not found in ${skill_id} SKILL.md. Available: [${available_sections.join(', ')}]`,
            );
          }
          const sectionBytes = new TextEncoder().encode(sectionContent).length;
          totalContentSize += sectionBytes;
          payload.section_content = sectionContent;
          payload.content_size = payload.content_size ?? sectionBytes;
        }

        payload.available_sections = available_sections;

        // 9. Truncation check
        const responseJson = JSON.stringify(payload);
        const responseBytes = new TextEncoder().encode(responseJson).length;
        if (responseBytes > MAX_SAFE_RESPONSE) {
          // Truncate content to fit within MAX_SAFE_RESPONSE
          if (payload.content) {
            const overhead = responseBytes - totalContentSize;
            const availableBytes = MAX_SAFE_RESPONSE - overhead - 200; // leave margin for truncated flag
            const truncated = new TextDecoder().decode(
              new TextEncoder().encode(payload.content).slice(0, Math.max(0, availableBytes)),
            );
            payload.content = truncated;
            payload.content_size = new TextEncoder().encode(truncated).length;
          }
          payload.truncated = true;
        } else {
          payload.truncated = false;
        }

        return helpers.buildJsonToolResponse(payload);
      },
    },
  ],
};

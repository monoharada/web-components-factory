/**
 * get_skill_manifest plugin tool for wcf-mcp.
 * Returns skill metadata (manifest) from skills-registry v2.
 * Supports metadata-only, full content, and section extraction modes.
 * Plugin Contract v1.0+ (content modes require v1.1+)
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  REPO_ROOT,
  loadRegistry,
  normalizeSkillEntry,
  buildErrorResponse,
} from './shared.mjs';

/** Maximum safe response size in bytes (95KB) */
const MAX_SAFE_RESPONSE = 95 * 1024;

/**
 * Normalize a heading text to a slug for section matching.
 * @param {string} text
 * @returns {string}
 */
function normalizeHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_');
}

/**
 * Detect sections (H1/H2 headings) from markdown content.
 * @param {string} content
 * @returns {{ sections: Array<{level: number, text: string, normalized: string, line: number}>, lines: string[] }}
 */
function parseMarkdownSections(content) {
  const lines = content.split('\n');
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,2})\s+(.+)/);
    if (match) {
      sections.push({
        level: match[1].length,
        text: match[2].trim(),
        normalized: normalizeHeading(match[2]),
        line: i,
      });
    }
  }
  return { sections, lines };
}

/**
 * Extract a specific section from parsed markdown by normalized heading name.
 * @param {{ sections: Array<{level: number, normalized: string, line: number}>, lines: string[] }} parsed
 * @param {string} sectionName
 * @returns {string|null}
 */
function extractSection(parsed, sectionName) {
  const idx = parsed.sections.findIndex((s) =>
    s.normalized === sectionName,
  );
  if (idx === -1) return null;

  const startLine = parsed.sections[idx].line;
  const startLevel = parsed.sections[idx].level;
  const nextSection = parsed.sections
    .slice(idx + 1)
    .find((s) => s.level <= startLevel);
  const endLine = nextSection ? nextSection.line : parsed.lines.length;

  return parsed.lines.slice(startLine, endLine).join('\n').trim();
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
        const manifest = normalizeSkillEntry(skill);

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

        // 7. Parse sections once (reused for detection and extraction)
        const parsed = parseMarkdownSections(fileContent);
        const available_sections = parsed.sections.map((s) => s.normalized);

        // 8. Build response payload
        const payload = { manifest };
        let totalContentSize = 0;

        // Mode 2: Full content
        if (wantsContent) {
          const contentBytes = Buffer.byteLength(fileContent, 'utf8');
          totalContentSize += contentBytes;
          payload.content = fileContent;
          payload.content_size = contentBytes;
        }

        // Mode 3: Section extraction
        if (wantsSection) {
          const sectionContent = extractSection(parsed, section);
          if (sectionContent === null) {
            return buildErrorResponse(
              'SECTION_NOT_FOUND',
              `Section '${section}' not found in ${skill_id} SKILL.md. Available: [${available_sections.join(', ')}]`,
            );
          }
          const sectionBytes = Buffer.byteLength(sectionContent, 'utf8');
          totalContentSize += sectionBytes;
          payload.section_content = sectionContent;
          payload.content_size = payload.content_size ?? sectionBytes;
        }

        payload.available_sections = available_sections;

        // 9. Truncation check
        const responseJson = JSON.stringify(payload);
        const responseBytes = Buffer.byteLength(responseJson, 'utf8');
        if (responseBytes > MAX_SAFE_RESPONSE) {
          if (payload.content) {
            const overhead = responseBytes - totalContentSize;
            const availableBytes = MAX_SAFE_RESPONSE - overhead - 200;
            // Estimate char limit from byte ratio
            const ratio = Math.max(0, availableBytes) / Buffer.byteLength(payload.content, 'utf8');
            const charLimit = Math.floor(payload.content.length * Math.min(1, ratio));
            payload.content = payload.content.slice(0, charLimit);
            payload.content_size = Buffer.byteLength(payload.content, 'utf8');
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

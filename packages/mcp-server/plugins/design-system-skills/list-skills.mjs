/**
 * list_skills plugin tool for wcf-mcp.
 * Lists registered skills from skills-registry.json with filtering support.
 * Plugin Contract v1.0+
 */

import { loadRegistry, normalizeSkillEntry, buildErrorResponse } from './shared.mjs';

/**
 * Project a full skill entry to a lightweight summary (excludes compat/manifest).
 */
function toSummary(skill) {
  const { compat, manifest, ...summary } = normalizeSkillEntry(skill);
  return summary;
}

export default {
  name: 'design-system-skills-list',
  version: '1.0.0',
  tools: [
    {
      name: 'list_skills',
      description:
        'List registered Claude Code / Cursor / Codex skills from skills-registry.json. When: discovering available skills, checking skill metadata, filtering skills by client/tags. Returns: {total, skills[]} where each skill has name, description, status, clients, tags, version, dependencies, path, entry. After: use get_skill_manifest for full content. Args: client? (claude_code|cursor|codex), tags? (spec|token|audit|drift|workflow, AND logic), status? (active|deprecated|experimental), query? (free-text substring search).',
      inputSchema: {},
      async handler(args = {}, { helpers }) {
        const registry = await loadRegistry();
        if (!registry || !Array.isArray(registry.skills)) {
          return buildErrorResponse(
            'SKILLS_REGISTRY_UNAVAILABLE',
            'Skills registry data not available.',
          );
        }

        const { client, tags, status, query } = args;
        let matched = registry.skills;

        // Filter by status
        if (status) {
          matched = matched.filter(
            (s) => String(s.status ?? 'active') === status,
          );
        }

        // Filter by client
        if (client) {
          matched = matched.filter(
            (s) => Array.isArray(s.clients) && s.clients.includes(client),
          );
        }

        // Filter by tags (AND logic)
        if (Array.isArray(tags) && tags.length > 0) {
          matched = matched.filter((s) => {
            const skillTags = Array.isArray(s.tags) ? s.tags : [];
            return tags.every((t) => skillTags.includes(t));
          });
        }

        // Filter by free-text query
        if (typeof query === 'string' && query.trim() !== '') {
          const q = query.toLowerCase();
          matched = matched.filter((s) => {
            const name = String(s.name ?? '').toLowerCase();
            const desc = String(s.description ?? '').toLowerCase();
            return name.includes(q) || desc.includes(q);
          });
        }

        const skills = matched.map(toSummary);
        return helpers.buildJsonToolResponse({
          total: skills.length,
          skills,
        });
      },
    },
  ],
};

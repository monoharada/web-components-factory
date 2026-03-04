/**
 * Design System Skills plugin bundle for wcf-mcp.
 * Aggregates list_skills, get_skill_manifest, and check_drift tools.
 */

import listSkillsPlugin from './list-skills.mjs';
import getSkillManifestPlugin from './get-skill-manifest.mjs';
import checkDriftPlugin from './check-drift.mjs';

const allTools = [
  ...listSkillsPlugin.tools,
  ...getSkillManifestPlugin.tools,
  ...checkDriftPlugin.tools,
];

export default {
  name: 'design-system-skills',
  version: '1.0.0',
  tools: allTools,
};

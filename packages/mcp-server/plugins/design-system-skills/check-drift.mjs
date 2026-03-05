/**
 * check_drift plugin tool for wcf-mcp.
 * Checks consistency across 4 data sources (CEM, install-registry,
 * skills-registry, pattern-registry) and detects drift (divergence).
 * Phase 1: JSON comparison only (no SKILL.md content analysis).
 * Plugin Contract v1.0+
 */

import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { REPO_ROOT, loadRegistry } from './shared.mjs';

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/**
 * Simple string hash for generating drift IDs.
 * @param {string} str
 * @returns {string} 8-char hex string
 */
function hashId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8);
}

/**
 * Generate a unique drift ID from rule + detail string.
 * @param {string} ruleId
 * @param {string} detail
 * @returns {string}
 */
function driftId(ruleId, detail) {
  return `DRIFT-${ruleId}-${hashId(detail)}`;
}

/**
 * Create a drift report entry.
 * @param {string} ruleId
 * @param {string} severity  HIGH | MEDIUM | LOW
 * @param {string} source    Data source name
 * @param {string} target    Target data source name
 * @param {string} message   Human-readable description
 * @param {object} [details] Additional context
 * @returns {object}
 */
function createDrift(ruleId, severity, source, target, message, details = {}) {
  return {
    id: driftId(ruleId, message),
    ruleId,
    severity,
    source,
    target,
    message,
    details,
  };
}

/**
 * Create a suggestion entry tied to a drift.
 * @param {string} id        The drift ID this suggestion relates to
 * @param {string} action    add | remove | update | document | investigate
 * @param {string} description  Human-readable suggestion
 * @param {string} target    File or data source to act on
 * @param {string} [priority]   recommended | optional
 * @returns {object}
 */
function createSuggestion(id, action, description, target, priority = 'recommended') {
  return { driftId: id, action, description, target, priority };
}

// ---------------------------------------------------------------------------
// Data extraction helpers
// ---------------------------------------------------------------------------

/**
 * Extract custom-element-definition tags from CEM.
 * @param {object|null} cem
 * @returns {Map<string, string>} tagName -> modulePath
 */
function extractCemTags(cem) {
  const tags = new Map();
  if (!cem?.modules) return tags;
  for (const mod of cem.modules) {
    if (!Array.isArray(mod.exports)) continue;
    for (const exp of mod.exports) {
      if (exp.kind === 'custom-element-definition' && exp.name) {
        tags.set(exp.name, mod.path);
      }
    }
  }
  return tags;
}

/**
 * Extract dads-* tag names from an HTML string.
 * @param {string} html
 * @returns {string[]} Unique sorted tag names
 */
function extractDadsTags(html) {
  const matches = [...String(html).matchAll(/<(dads-[a-z][a-z0-9-]*)/g)];
  return [...new Set(matches.map((m) => m[1]))].sort();
}

// ---------------------------------------------------------------------------
// Rule implementations
// Each returns { drifts: DriftReport[], suggestions: DriftSuggestion[] }
// ---------------------------------------------------------------------------

/**
 * CIR01 - CEM component missing from install-registry.
 * For each CEM dads-* tag, verify it exists in install-registry tags.
 */
function ruleCIR01(cemTags, irTags) {
  const drifts = [];
  const suggestions = [];
  for (const [tag] of cemTags) {
    if (!tag.startsWith('dads-')) continue;
    if (!(tag in irTags)) {
      const d = createDrift(
        'CIR01',
        'HIGH',
        'custom-elements.json',
        'install-registry.json',
        `CEM tag "${tag}" is missing from install-registry tags`,
        { tag },
      );
      drifts.push(d);
      suggestions.push(
        createSuggestion(d.id, 'add', `Add "${tag}" to install-registry tags section`, 'registry/install-registry.json'),
      );
    }
  }
  return { drifts, suggestions };
}

/**
 * CIR02 - Non-standard tags in CEM.
 * CEM exports with kind=custom-element-definition where name does NOT match dads-*.
 */
function ruleCIR02(cemTags) {
  const drifts = [];
  const suggestions = [];
  for (const [tag, modulePath] of cemTags) {
    if (!tag.startsWith('dads-')) {
      const d = createDrift(
        'CIR02',
        'LOW',
        'custom-elements.json',
        'custom-elements.json',
        `CEM tag "${tag}" does not follow the dads-* naming convention`,
        { tag, modulePath },
      );
      drifts.push(d);
      suggestions.push(
        createSuggestion(d.id, 'investigate', `Verify if "${tag}" should follow the dads-* naming convention`, 'custom-elements.json', 'optional'),
      );
    }
  }
  return { drifts, suggestions };
}

/**
 * CIT01 - install-registry tag missing from CEM.
 * For each install-registry tags key, verify it exists in CEM exports.
 */
function ruleCIT01(cemTags, irTags) {
  const drifts = [];
  const suggestions = [];
  for (const tag of Object.keys(irTags)) {
    if (!cemTags.has(tag)) {
      const d = createDrift(
        'CIT01',
        'HIGH',
        'install-registry.json',
        'custom-elements.json',
        `install-registry tag "${tag}" is not defined in CEM`,
        { tag, componentId: irTags[tag] },
      );
      drifts.push(d);
      suggestions.push(
        createSuggestion(d.id, 'remove', `Remove "${tag}" from install-registry or add its CEM definition`, 'registry/install-registry.json'),
      );
    }
  }
  return { drifts, suggestions };
}

/**
 * CIT02 - install-registry component tags mismatch with CEM.
 * For each install-registry component, compare its tags array with CEM-derived
 * tags for that component (by checking which CEM tags map to install-registry component IDs).
 */
function ruleCIT02(cemTags, irTags, irComponents) {
  const drifts = [];
  const suggestions = [];

  // Build reverse map: componentId -> Set<tag> from irTags
  const tagsByComponent = {};
  for (const [tag, compId] of Object.entries(irTags)) {
    if (!tagsByComponent[compId]) tagsByComponent[compId] = new Set();
    tagsByComponent[compId].add(tag);
  }

  for (const [compId, comp] of Object.entries(irComponents)) {
    if (!Array.isArray(comp.tags)) continue;
    const declaredTags = new Set(comp.tags);
    const registeredTags = tagsByComponent[compId] ?? new Set();

    // Check tags in component.tags that are not in the tags section
    for (const tag of declaredTags) {
      if (!registeredTags.has(tag)) {
        const d = createDrift(
          'CIT02',
          'MEDIUM',
          'install-registry.json',
          'install-registry.json',
          `Component "${compId}" declares tag "${tag}" but it is not in the tags section`,
          { componentId: compId, tag },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'update', `Add "${tag}" to install-registry tags section mapping to "${compId}"`, 'registry/install-registry.json'),
        );
      }
    }

    // Check tags in tags section that are not in component.tags
    for (const tag of registeredTags) {
      if (!declaredTags.has(tag)) {
        const d = createDrift(
          'CIT02',
          'MEDIUM',
          'install-registry.json',
          'install-registry.json',
          `Tag "${tag}" maps to "${compId}" in tags section but is not in component.tags`,
          { componentId: compId, tag },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'update', `Add "${tag}" to component "${compId}" tags array`, 'registry/install-registry.json'),
        );
      }
    }
  }
  return { drifts, suggestions };
}

/**
 * IRD01 - Broken internal dependency in install-registry.
 * For each component's deps[], verify dep ID exists in components.
 */
function ruleIRD01(irComponents) {
  const drifts = [];
  const suggestions = [];
  const componentIds = new Set(Object.keys(irComponents));

  for (const [compId, comp] of Object.entries(irComponents)) {
    if (!Array.isArray(comp.deps)) continue;
    for (const dep of comp.deps) {
      if (!componentIds.has(dep)) {
        const d = createDrift(
          'IRD01',
          'HIGH',
          'install-registry.json',
          'install-registry.json',
          `Component "${compId}" depends on "${dep}" which does not exist in components`,
          { componentId: compId, dependency: dep },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'update', `Fix dependency "${dep}" in component "${compId}" or add the missing component`, 'registry/install-registry.json'),
        );
      }
    }
  }
  return { drifts, suggestions };
}

/**
 * IRT01 - install-registry tags/components inconsistency.
 * tags keys must map to valid component IDs, and component tags must be in tags section.
 */
function ruleIRT01(irTags, irComponents) {
  const drifts = [];
  const suggestions = [];
  const componentIds = new Set(Object.keys(irComponents));

  // Check tags section: each value must be a valid component ID
  for (const [tag, compId] of Object.entries(irTags)) {
    if (!componentIds.has(compId)) {
      const d = createDrift(
        'IRT01',
        'HIGH',
        'install-registry.json',
        'install-registry.json',
        `Tag "${tag}" maps to component "${compId}" which does not exist`,
        { tag, componentId: compId },
      );
      drifts.push(d);
      suggestions.push(
        createSuggestion(d.id, 'update', `Fix tag "${tag}" mapping or add component "${compId}"`, 'registry/install-registry.json'),
      );
    }
  }

  // Check components section: each tag must be in tags section
  for (const [compId, comp] of Object.entries(irComponents)) {
    if (!Array.isArray(comp.tags)) continue;
    for (const tag of comp.tags) {
      if (!(tag in irTags)) {
        const d = createDrift(
          'IRT01',
          'HIGH',
          'install-registry.json',
          'install-registry.json',
          `Component "${compId}" tag "${tag}" is missing from tags section`,
          { componentId: compId, tag },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'add', `Add "${tag}": "${compId}" to install-registry tags section`, 'registry/install-registry.json'),
        );
      }
    }
  }
  return { drifts, suggestions };
}

/**
 * CPR01 - pattern requires references missing component.
 * pattern.requires[] components must exist in install-registry components.
 */
function ruleCPR01(patterns, irComponents) {
  const drifts = [];
  const suggestions = [];
  const componentIds = new Set(Object.keys(irComponents));

  for (const [patId, pat] of Object.entries(patterns)) {
    if (!Array.isArray(pat.requires)) continue;
    for (const req of pat.requires) {
      if (!componentIds.has(req)) {
        const d = createDrift(
          'CPR01',
          'HIGH',
          'pattern-registry.json',
          'install-registry.json',
          `Pattern "${patId}" requires component "${req}" which is not in install-registry`,
          { patternId: patId, requirement: req },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'add', `Add component "${req}" to install-registry or remove it from pattern "${patId}" requires`, 'registry/install-registry.json'),
        );
      }
    }
  }
  return { drifts, suggestions };
}

/**
 * CPT01 - pattern HTML contains unknown CEM tags.
 * Extract dads-* tags from pattern HTML, verify each exists in CEM.
 */
function ruleCPT01(patterns, cemTags) {
  const drifts = [];
  const suggestions = [];

  for (const [patId, pat] of Object.entries(patterns)) {
    if (!pat.html) continue;
    const tags = extractDadsTags(pat.html);
    for (const tag of tags) {
      if (!cemTags.has(tag)) {
        const d = createDrift(
          'CPT01',
          'HIGH',
          'pattern-registry.json',
          'custom-elements.json',
          `Pattern "${patId}" HTML uses tag "${tag}" which is not defined in CEM`,
          { patternId: patId, tag },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'investigate', `Verify tag "${tag}" in pattern "${patId}" HTML or add its CEM definition`, 'registry/pattern-registry.json'),
        );
      }
    }
  }
  return { drifts, suggestions };
}

/**
 * CPT02 - pattern HTML uses tags not declared in requires.
 * dads-* tags in pattern HTML -> reverse lookup to component ID -> must be in pattern.requires.
 */
function ruleCPT02(patterns, irTags) {
  const drifts = [];
  const suggestions = [];

  for (const [patId, pat] of Object.entries(patterns)) {
    if (!pat.html || !Array.isArray(pat.requires)) continue;
    const tags = extractDadsTags(pat.html);
    const requiresSet = new Set(pat.requires);

    for (const tag of tags) {
      const compId = irTags[tag];
      if (compId && !requiresSet.has(compId)) {
        const d = createDrift(
          'CPT02',
          'MEDIUM',
          'pattern-registry.json',
          'pattern-registry.json',
          `Pattern "${patId}" HTML uses tag "${tag}" (component "${compId}") but "${compId}" is not in requires`,
          { patternId: patId, tag, componentId: compId },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'add', `Add "${compId}" to pattern "${patId}" requires array`, 'registry/pattern-registry.json'),
        );
      }
    }
  }
  return { drifts, suggestions };
}

/**
 * CPC01 - Pattern coverage of components.
 * Count how many install-registry components are referenced by at least one pattern's requires.
 */
function ruleCPC01(patterns, irComponents) {
  const drifts = [];
  const suggestions = [];
  const componentIds = Object.keys(irComponents);
  if (componentIds.length === 0) return { drifts, suggestions };

  // Collect all component IDs referenced by any pattern
  const coveredComponents = new Set();
  for (const pat of Object.values(patterns)) {
    if (!Array.isArray(pat.requires)) continue;
    for (const req of pat.requires) {
      coveredComponents.add(req);
    }
  }

  const totalComponents = componentIds.length;
  const uncoveredIds = [];
  for (const id of componentIds) {
    if (!coveredComponents.has(id)) uncoveredIds.push(id);
  }
  const coveredCount = totalComponents - uncoveredIds.length;
  const coveragePercent = Math.round((coveredCount / totalComponents) * 100);
  const severity = coveragePercent < 50 ? 'MEDIUM' : 'LOW';

  if (uncoveredIds.length > 0) {
    const d = createDrift(
      'CPC01',
      severity,
      'pattern-registry.json',
      'install-registry.json',
      `Pattern coverage: ${coveredCount}/${totalComponents} components (${coveragePercent}%). ${uncoveredIds.length} components not used in any pattern.`,
      {
        coverage: coveragePercent,
        coveredCount,
        totalComponents,
        uncoveredComponents: uncoveredIds,
      },
    );
    drifts.push(d);
    suggestions.push(
      createSuggestion(d.id, 'document', `Consider adding patterns for uncovered components: ${uncoveredIds.slice(0, 5).join(', ')}${uncoveredIds.length > 5 ? '...' : ''}`, 'registry/pattern-registry.json', 'optional'),
    );
  }
  return { drifts, suggestions };
}

/**
 * SIR01 - skills-registry path existence.
 * For each skill, verify skill.path + '/' + skill.entry file exists on disk.
 */
async function ruleSIR01(skillsRegistry) {
  const drifts = [];
  const suggestions = [];
  if (!skillsRegistry?.skills) return { drifts, suggestions };

  for (const skill of skillsRegistry.skills) {
    const entry = skill.entry ?? 'SKILL.md';
    const fullPath = resolve(REPO_ROOT, skill.path, entry);
    try {
      await access(fullPath);
    } catch {
      const d = createDrift(
        'SIR01',
        'HIGH',
        'skills-registry.json',
        'filesystem',
        `Skill "${skill.name}" entry file not found at "${skill.path}/${entry}"`,
        { skillName: skill.name, path: skill.path, entry, expected: fullPath },
      );
      drifts.push(d);
      suggestions.push(
        createSuggestion(d.id, 'add', `Create "${entry}" at "${skill.path}/" or update the skill registry path`, 'registry/skills-registry.json'),
      );
    }
  }
  return { drifts, suggestions };
}

/**
 * SID01 - Skills dependency existence (v2 only).
 * Each skill.dependencies[] name must exist as another skill.name in the registry.
 */
function ruleSID01(skillsRegistry) {
  const drifts = [];
  const suggestions = [];
  if (!skillsRegistry?.skills) return { drifts, suggestions };

  const skillNames = new Set(skillsRegistry.skills.map((s) => s.name));

  for (const skill of skillsRegistry.skills) {
    if (!Array.isArray(skill.dependencies)) continue;
    for (const dep of skill.dependencies) {
      const depName = typeof dep === 'string' ? dep : dep?.name;
      if (depName && !skillNames.has(depName)) {
        const d = createDrift(
          'SID01',
          'HIGH',
          'skills-registry.json',
          'skills-registry.json',
          `Skill "${skill.name}" depends on "${depName}" which does not exist in the registry`,
          { skillName: skill.name, dependency: depName },
        );
        drifts.push(d);
        suggestions.push(
          createSuggestion(d.id, 'add', `Add skill "${depName}" to the registry or remove the dependency from "${skill.name}"`, 'registry/skills-registry.json'),
        );
      }
    }
  }
  return { drifts, suggestions };
}

// ---------------------------------------------------------------------------
// Token rules
// ---------------------------------------------------------------------------

/**
 * TKN01 - Token source file existence check.
 * Verify packages/styles/tokens.ts exists on disk.
 */
async function ruleTKN01() {
  const drifts = [];
  const suggestions = [];
  const filePath = resolve(REPO_ROOT, 'packages', 'styles', 'tokens.ts');
  try {
    await access(filePath);
  } catch {
    const d = createDrift(
      'TKN01',
      'HIGH',
      'filesystem',
      'packages/styles/tokens.ts',
      'Token source file "packages/styles/tokens.ts" is missing',
      { expected: filePath },
    );
    drifts.push(d);
    suggestions.push(
      createSuggestion(d.id, 'add', 'Create or restore packages/styles/tokens.ts', 'packages/styles/tokens.ts'),
    );
  }
  return { drifts, suggestions };
}

/**
 * TKN02 - Spacing tokens source file existence check.
 * Verify packages/styles/spacing-tokens.ts exists on disk.
 * tokens.ts imports spacing-tokens.ts, so its absence causes build errors.
 */
async function ruleTKN02() {
  const drifts = [];
  const suggestions = [];
  const filePath = resolve(REPO_ROOT, 'packages', 'styles', 'spacing-tokens.ts');
  try {
    await access(filePath);
  } catch {
    const d = createDrift(
      'TKN02',
      'HIGH',
      'filesystem',
      'packages/styles/spacing-tokens.ts',
      'Spacing tokens source file "packages/styles/spacing-tokens.ts" is missing — tokens.ts depends on it',
      { expected: filePath },
    );
    drifts.push(d);
    suggestions.push(
      createSuggestion(d.id, 'add', 'Create or restore packages/styles/spacing-tokens.ts', 'packages/styles/spacing-tokens.ts'),
    );
  }
  return { drifts, suggestions };
}

// ---------------------------------------------------------------------------
// Scope mapping
// ---------------------------------------------------------------------------

const SCOPE_RULES = {
  all: ['CIR01', 'CIR02', 'CIT01', 'CIT02', 'IRD01', 'IRT01', 'CPR01', 'CPT01', 'CPT02', 'CPC01', 'SIR01', 'SID01', 'TKN01', 'TKN02'],
  cem: ['CIR01', 'CIR02', 'CIT01', 'CIT02', 'IRD01', 'IRT01'],
  skills: ['SIR01', 'SID01'],
  tokens: ['TKN01', 'TKN02'],
  patterns: ['CPR01', 'CPT01', 'CPT02', 'CPC01'],
  audit: ['CIR01', 'CIT01', 'IRD01', 'IRT01', 'CPR01', 'CPT01', 'SIR01', 'SID01', 'TKN01', 'TKN02'],
};

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

/**
 * @param {object} args
 * @param {{ helpers: { loadJsonData: Function, buildJsonToolResponse: Function } }} ctx
 */
async function checkDriftHandler(args, { helpers }) {
  const scope = args?.scope ?? 'all';
  const activeRules = new Set(SCOPE_RULES[scope] ?? SCOPE_RULES.all);
  const drifts = [];
  const suggestions = [];
  const rulesExecuted = [];

  // -----------------------------------------------------------------------
  // Load data sources
  // -----------------------------------------------------------------------
  const [cem, ir, pr, sr] = await Promise.all([
    helpers.loadJsonData('custom-elements.json'),
    helpers.loadJsonData('install-registry.json'),
    helpers.loadJsonData('pattern-registry.json'),
    loadRegistry(),
  ]);

  // -----------------------------------------------------------------------
  // Extract commonly used data
  // -----------------------------------------------------------------------
  const cemTags = extractCemTags(cem);
  const irTags = ir?.tags ?? {};
  const irComponents = ir?.components ?? {};
  const patterns = pr?.patterns ?? {};

  // -----------------------------------------------------------------------
  // Execute rules based on scope
  // -----------------------------------------------------------------------

  /** Collect results from a synchronous rule function */
  function runSync(ruleId, fn) {
    if (!activeRules.has(ruleId)) return;
    rulesExecuted.push(ruleId);
    const result = fn();
    drifts.push(...result.drifts);
    suggestions.push(...result.suggestions);
  }

  /** Collect results from an async rule function */
  async function runAsync(ruleId, fn) {
    if (!activeRules.has(ruleId)) return;
    rulesExecuted.push(ruleId);
    const result = await fn();
    drifts.push(...result.drifts);
    suggestions.push(...result.suggestions);
  }

  // CEM <-> install-registry rules
  runSync('CIR01', () => ruleCIR01(cemTags, irTags));
  runSync('CIR02', () => ruleCIR02(cemTags));
  runSync('CIT01', () => ruleCIT01(cemTags, irTags));
  runSync('CIT02', () => ruleCIT02(cemTags, irTags, irComponents));
  runSync('IRD01', () => ruleIRD01(irComponents));
  runSync('IRT01', () => ruleIRT01(irTags, irComponents));

  // Pattern rules
  runSync('CPR01', () => ruleCPR01(patterns, irComponents));
  runSync('CPT01', () => ruleCPT01(patterns, cemTags));
  runSync('CPT02', () => ruleCPT02(patterns, irTags));
  runSync('CPC01', () => ruleCPC01(patterns, irComponents));

  // Skills rules — require skills-registry for scopes that include skill rules
  const hasSkillRules = ['SIR01', 'SID01'].some((id) => activeRules.has(id));
  if (hasSkillRules && !sr) {
    const d = createDrift(
      'SIR01',
      'HIGH',
      'skills-registry.json',
      'filesystem',
      'skills-registry.json is missing or corrupted — all skill rules skipped',
      {},
    );
    drifts.push(d);
    suggestions.push(
      createSuggestion(d.id, 'add', 'Create or restore registry/skills-registry.json', 'registry/skills-registry.json'),
    );
    rulesExecuted.push(...['SIR01', 'SID01'].filter((id) => activeRules.has(id)));
  } else {
    await runAsync('SIR01', () => ruleSIR01(sr));
    runSync('SID01', () => ruleSID01(sr));
  }

  // Token rules
  await runAsync('TKN01', () => ruleTKN01());
  await runAsync('TKN02', () => ruleTKN02());

  // -----------------------------------------------------------------------
  // Build output
  // -----------------------------------------------------------------------
  const summary = { total: drifts.length, high: 0, medium: 0, low: 0, ignored: 0 };
  for (const d of drifts) {
    if (d.severity === 'HIGH') summary.high++;
    else if (d.severity === 'MEDIUM') summary.medium++;
    else if (d.severity === 'LOW') summary.low++;
  }

  const meta = {
    phase: 1,
    scope,
    rulesExecuted,
    timestamp: new Date().toISOString(),
  };

  return helpers.buildJsonToolResponse({ drifts, suggestions, summary, meta });
}

// ---------------------------------------------------------------------------
// Plugin export
// ---------------------------------------------------------------------------

export default {
  name: 'design-system-skills-drift',
  version: '1.0.0',
  tools: [
    {
      name: 'check_drift',
      description:
        'Check consistency across CEM, install-registry, skills-registry, pattern-registry, and token source files. Detects drift (divergence) between data sources. When: before PR, after registry updates, periodic audits. Returns: {drifts[], suggestions[], summary{total,high,medium,low,ignored}, meta{phase,scope,rulesExecuted,timestamp}}. Args: scope? (all|cem|skills|tokens|patterns|audit, default: all). 14 rules across 6 scopes. audit scope runs HIGH-severity rules only.',
      inputSchema: {},
      handler: checkDriftHandler,
    },
  ],
};

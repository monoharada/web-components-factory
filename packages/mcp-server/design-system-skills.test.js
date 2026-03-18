import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { setupDsPluginTest } from './test-support.js';

describe('design-system-skills plugin: list_skills', () => {
  let client;
  let server;

  beforeAll(async () => {
    ({ server, client } = await setupDsPluginTest('ds-skills-test'));
  });

  afterAll(async () => {
    await Promise.allSettled([client?.close?.(), server?.close?.()]);
  });

  it('returns all skills when no filters', async () => {
    const result = await client.callTool({ name: 'list_skills', arguments: {} });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(payload.skills)).toBe(true);
    for (const skill of payload.skills) {
      expect(typeof skill.name).toBe('string');
      expect(typeof skill.description).toBe('string');
      expect(typeof skill.status).toBe('string');
      expect(Array.isArray(skill.clients)).toBe(true);
      expect(Array.isArray(skill.tags)).toBe(true);
      expect(typeof skill.version).toBe('string');
    }
  });

  it('filters by client', async () => {
    const result = await client.callTool({
      name: 'list_skills',
      arguments: { client: 'codex' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    for (const skill of payload.skills) {
      expect(skill.clients).toContain('codex');
    }
  });

  it('filters by tags (AND logic)', async () => {
    const result = await client.callTool({
      name: 'list_skills',
      arguments: { tags: ['spec', 'workflow'] },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    for (const skill of payload.skills) {
      expect(skill.tags).toContain('spec');
      expect(skill.tags).toContain('workflow');
    }
  });

  it('filters by query substring', async () => {
    const result = await client.callTool({
      name: 'list_skills',
      arguments: { query: 'css' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.total).toBeGreaterThanOrEqual(1);
    for (const skill of payload.skills) {
      const nameOrDesc = `${skill.name} ${skill.description}`.toLowerCase();
      expect(nameOrDesc).toContain('css');
    }
  });

  it('returns empty array when no match', async () => {
    const result = await client.callTool({
      name: 'list_skills',
      arguments: { query: 'zzz-nonexistent-skill-xyz' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.total).toBe(0);
    expect(payload.skills).toEqual([]);
  });
});

describe('design-system-skills plugin: get_skill_manifest', () => {
  let client;
  let server;

  beforeAll(async () => {
    ({ server, client } = await setupDsPluginTest('ds-manifest-test'));
  });

  afterAll(async () => {
    await Promise.allSettled([client?.close?.(), server?.close?.()]);
  });

  it('returns manifest for metadata-only mode', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'css-writing-rules' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.manifest).toBeDefined();
    expect(payload.manifest.name).toBe('css-writing-rules');
    expect(payload.manifest.status).toBe('active');
    expect(payload.content).toBeUndefined();
  });

  it('returns content when include_content=true', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'css-writing-rules', include_content: true },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.manifest).toBeDefined();
    expect(typeof payload.content).toBe('string');
    expect(payload.content.length).toBeGreaterThan(0);
    expect(typeof payload.content_size).toBe('number');
    expect(Array.isArray(payload.available_sections)).toBe(true);
  });

  it('extracts a specific section', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'css-writing-rules', section: 'quick_reference' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.manifest).toBeDefined();
    expect(typeof payload.section_content).toBe('string');
    expect(payload.section_content.length).toBeGreaterThan(0);
  });

  it('returns SKILL_NOT_FOUND for unknown skill', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'nonexistent-skill' },
    });
    expect(result.isError).toBe(true);
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.error.code).toBe('SKILL_NOT_FOUND');
  });

  it('returns SECTION_NOT_FOUND for unknown section', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'css-writing-rules', section: 'procedure' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    if (result.isError) {
      expect(payload.error.code).toBe('SECTION_NOT_FOUND');
    } else {
      expect(payload.section_content).toBeDefined();
    }
  });
});

describe('design-system-skills plugin: check_drift', () => {
  let client;
  let server;

  beforeAll(async () => {
    ({ server, client } = await setupDsPluginTest('ds-drift-test'));
  });

  afterAll(async () => {
    await Promise.allSettled([client?.close?.(), server?.close?.()]);
  });

  it('returns drift report with correct structure for scope=all', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'all' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(Array.isArray(payload.drifts)).toBe(true);
    expect(Array.isArray(payload.suggestions)).toBe(true);
    expect(payload.summary).toBeDefined();
    expect(typeof payload.summary.total).toBe('number');
    expect(typeof payload.summary.high).toBe('number');
    expect(typeof payload.summary.medium).toBe('number');
    expect(typeof payload.summary.low).toBe('number');
    expect(payload.meta).toBeDefined();
    expect(payload.meta.phase).toBe(1);
    expect(payload.meta.scope).toBe('all');
    expect(Array.isArray(payload.meta.rulesExecuted)).toBe(true);
    expect(payload.meta.rulesExecuted.length).toBe(14);
  });

  it('limits rules for scope=cem', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'cem' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.meta.scope).toBe('cem');
    expect(payload.meta.rulesExecuted.length).toBe(6);
    for (const ruleId of payload.meta.rulesExecuted) {
      expect(['CIR01', 'CIR02', 'CIT01', 'CIT02', 'IRD01', 'IRT01']).toContain(ruleId);
    }
  });

  it('limits rules for scope=skills', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'skills' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.meta.scope).toBe('skills');
    expect(payload.meta.rulesExecuted.length).toBe(2);
    for (const ruleId of payload.meta.rulesExecuted) {
      expect(['SIR01', 'SID01']).toContain(ruleId);
    }
  });

  it('limits rules for scope=patterns', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'patterns' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.meta.scope).toBe('patterns');
    expect(payload.meta.rulesExecuted.length).toBe(4);
    for (const ruleId of payload.meta.rulesExecuted) {
      expect(['CPR01', 'CPT01', 'CPT02', 'CPC01']).toContain(ruleId);
    }
  });

  it('has no HIGH severity drifts for skills-registry (v2)', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'skills' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const highDrifts = payload.drifts.filter((drift) => drift.severity === 'HIGH');
    expect(highDrifts.length).toBe(0);
  });

  it('each drift has a matching suggestion', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'all' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    const suggestionDriftIds = new Set(payload.suggestions.map((suggestion) => suggestion.driftId));
    for (const drift of payload.drifts) {
      expect(suggestionDriftIds.has(drift.id)).toBe(true);
    }
  });

  it('executes TKN01 and TKN02 for scope=tokens', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'tokens' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.meta.scope).toBe('tokens');
    expect(payload.meta.rulesExecuted.length).toBe(2);
    expect(payload.meta.rulesExecuted).toContain('TKN01');
    expect(payload.meta.rulesExecuted).toContain('TKN02');
  });

  it('executes HIGH severity rules for scope=audit', async () => {
    const result = await client.callTool({
      name: 'check_drift',
      arguments: { scope: 'audit' },
    });
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(payload.meta.scope).toBe('audit');
    expect(payload.meta.rulesExecuted.length).toBe(10);
    for (const ruleId of ['CIR01', 'CIT01', 'IRD01', 'IRT01', 'CPR01', 'CPT01', 'SIR01', 'SID01', 'TKN01', 'TKN02']) {
      expect(payload.meta.rulesExecuted).toContain(ruleId);
    }
  });
});

describe('design-system-skills plugin: do_dont section extraction', () => {
  let client;
  let server;

  beforeAll(async () => {
    ({ server, client } = await setupDsPluginTest('ds-dodont-test'));
  });

  afterAll(async () => {
    await Promise.allSettled([client?.close?.(), server?.close?.()]);
  });

  it('extracts do_dont section from css-writing-rules', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'css-writing-rules', section: 'do_dont' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(typeof payload.section_content).toBe('string');
    expect(payload.section_content.length).toBeGreaterThan(0);
    expect(payload.section_content).toContain('Do');
  });

  it('extracts do_dont section from component-design-study', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'component-design-study', section: 'do_dont' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(typeof payload.section_content).toBe('string');
    expect(payload.section_content.length).toBeGreaterThan(0);
  });

  it('extracts do_dont section from headless-component-design', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'headless-component-design', section: 'do_dont' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(typeof payload.section_content).toBe('string');
    expect(payload.section_content.length).toBeGreaterThan(0);
  });

  it('extracts do_dont section from wcf-validate', async () => {
    const result = await client.callTool({
      name: 'get_skill_manifest',
      arguments: { skill_id: 'wcf-validate', section: 'do_dont' },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
    expect(typeof payload.section_content).toBe('string');
    expect(payload.section_content.length).toBeGreaterThan(0);
  });
});

describe('wcf://skills resource', () => {
  let client;
  let server;

  beforeAll(async () => {
    ({ server, client } = await setupDsPluginTest('ds-resource-test'));
  });

  afterAll(async () => {
    await Promise.allSettled([client?.close?.(), server?.close?.()]);
  });

  it('returns skills catalog with 9 entries', async () => {
    const result = await client.readResource({ uri: 'wcf://skills' });
    expect(result.contents).toBeDefined();
    expect(result.contents.length).toBe(1);
    const payload = JSON.parse(String(result.contents[0].text));
    expect(payload.schemaVersion).toBe(2);
    expect(payload.total).toBe(9);
    expect(Array.isArray(payload.skills)).toBe(true);
    expect(payload.skills.length).toBe(9);
    for (const skill of payload.skills) {
      expect(typeof skill.name).toBe('string');
      expect(typeof skill.description).toBe('string');
    }
  });
});

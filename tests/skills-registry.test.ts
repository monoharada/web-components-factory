import fs from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  loadAndValidateSkillsRegistry,
  selectSkillNames,
  validateSkillsRegistry,
} from '../scripts/codex/list-skills-from-registry.mjs';
import { checkSkillsRegistry } from '../scripts/registry/check-skills-registry.mjs';

const CURRENT_REPO_ROOT = process.cwd();

describe('skills registry', () => {
  it('loads and validates current registry and resolves active codex skills', async () => {
    const { registry } = await loadAndValidateSkillsRegistry({
      repoRoot: CURRENT_REPO_ROOT,
      registryPath: 'registry/skills-registry.json',
      checkFiles: true,
    });

    const skills = selectSkillNames(registry, {
      client: 'codex',
      includeDeprecated: false,
    });

    expect(skills).toEqual([
      'css-writing-rules',
      'headless-component-design',
      'wcf-compose',
      'wcf-discovery',
      'wcf-install',
      'wcf-ui-builder',
      'wcf-validate',
    ]);
  });

  it('excludes deprecated skills by default and includes them only when requested', async () => {
    const registry = {
      schemaVersion: 1,
      sourceOfTruth: '.claude/skills',
      clients: {
        codex: { description: 'codex' },
        claude_code: { description: 'claude' },
        cursor: { description: 'cursor' },
      },
      skills: [
        {
          name: 'alpha-skill',
          path: '.claude/skills/alpha-skill',
          entry: 'SKILL.md',
          clients: ['codex'],
          status: 'active',
          description: 'active',
        },
        {
          name: 'beta-skill',
          path: '.claude/skills/beta-skill',
          entry: 'SKILL.md',
          clients: ['codex'],
          status: 'deprecated',
          description: 'deprecated',
        },
      ],
    };

    await validateSkillsRegistry(registry, {
      repoRoot: CURRENT_REPO_ROOT,
      registryPath: '<inline>',
      checkFiles: false,
    });

    expect(selectSkillNames(registry, { client: 'codex' })).toEqual(['alpha-skill']);
    expect(selectSkillNames(registry, { client: 'codex', includeDeprecated: true })).toEqual([
      'alpha-skill',
      'beta-skill',
    ]);
  });

  it('fails when path is not .claude/skills/<name>', async () => {
    const invalidRegistry = {
      schemaVersion: 1,
      sourceOfTruth: '.claude/skills',
      clients: {
        codex: { description: 'codex' },
        claude_code: { description: 'claude' },
        cursor: { description: 'cursor' },
      },
      skills: [
        {
          name: 'wcf-install',
          path: '.claude/skills/wrong-name',
          entry: 'SKILL.md',
          clients: ['codex'],
          status: 'active',
          description: 'invalid',
        },
      ],
    };

    await expect(
      validateSkillsRegistry(invalidRegistry, {
        repoRoot: CURRENT_REPO_ROOT,
        registryPath: '<inline>',
        checkFiles: false,
      }),
    ).rejects.toThrow(/must be ".claude\/skills\/wcf-install"/);
  });

  it('fails check when codex has no active skills', async () => {
    const tmpRoot = path.join(CURRENT_REPO_ROOT, '.tmp');
    await fs.mkdir(tmpRoot, { recursive: true });
    const tmpDir = await fs.mkdtemp(path.join(tmpRoot, 'skills-registry-check-'));
    const registryFile = path.join(tmpDir, 'skills-registry.json');
    const registry = {
      schemaVersion: 1,
      sourceOfTruth: '.claude/skills',
      clients: {
        codex: { description: 'codex' },
        claude_code: { description: 'claude' },
        cursor: { description: 'cursor' },
      },
      skills: [
        {
          name: 'wcf-install',
          path: '.claude/skills/wcf-install',
          entry: 'SKILL.md',
          clients: ['codex'],
          status: 'deprecated',
          description: 'deprecated only',
        },
      ],
    };

    try {
      await fs.writeFile(registryFile, JSON.stringify(registry, null, 2), 'utf8');
      await expect(
        checkSkillsRegistry({
          registryPath: registryFile,
          repoRoot: CURRENT_REPO_ROOT,
        }),
      ).rejects.toThrow(/No active skills found for client "codex"/);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

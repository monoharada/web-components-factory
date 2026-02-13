import { fileURLToPath } from 'node:url';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { afterEach, describe, expect, test } from 'vitest';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'scripts', 'dads-template', 'cli.js');

type StubConfig = {
  runs?: Record<string, { code?: number; stdout?: string; stderr?: string }>;
  authStatus?: { code?: number; stdout?: string; stderr?: string };
  issueList?: Record<string, { code?: number; json?: unknown; stdout?: string; stderr?: string }>;
  issueListFallback?: { code?: number; json?: unknown; stdout?: string; stderr?: string };
  issueCreate?: Array<{ code?: number; stdout?: string; stderr?: string }>;
};

type GapFile = {
  schemaVersion: number;
  generatedAt: string;
  gaps: Array<{
    id: string;
    type: string;
    scope: string;
    proposedComponentId: string;
    title: string;
    summary: string;
    evidence: string[];
    acceptanceCriteria: string[];
    priority: 'P1' | 'P2' | 'P3';
    dedupeKey?: string;
  }>;
};

let tempDir: string | undefined;

function runNode(
  args: string[],
  options: {
    cwd: string;
    env?: Record<string, string>;
  },
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk);
    });
    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('close', (code) => {
      resolve({
        code: Number(code ?? 0),
        stdout,
        stderr,
      });
    });
  });
}

function parseLastJson(raw: string): unknown {
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    try {
      return JSON.parse(lines[i]);
    } catch {
      // continue
    }
  }
  return {};
}

async function makeTempDir(prefix: string): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), `${prefix}-`));
}

async function writeFixtureFile(filePath: string, content: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf8');
}

async function makeWorkspace(
  customElements: unknown,
  patternRegistry: unknown,
  wcConfig?: unknown,
  includeFiles?: Record<string, string>,
): Promise<string> {
  const workspace = await makeTempDir('dads-template-cli');

  await writeFixtureFile(path.join(workspace, 'custom-elements.json'), `${JSON.stringify(customElements, null, 2)}\n`);
  await writeFixtureFile(
    path.join(workspace, 'registry', 'pattern-registry.json'),
    `${JSON.stringify(patternRegistry, null, 2)}\n`,
  );
  if (wcConfig) {
    await writeFixtureFile(path.join(workspace, 'wc.config.js'), `export default ${JSON.stringify(wcConfig, null, 2)};\n`);
  }
  if (includeFiles) {
    for (const [relativePath, content] of Object.entries(includeFiles)) {
      await writeFixtureFile(path.join(workspace, relativePath), content);
    }
  }

  tempDir = workspace;
  return workspace;
}

async function setupStubs(workspace: string, config: StubConfig) {
  const binDir = path.join(workspace, '.stub-bin');
  const statePath = path.join(workspace, '.stub-state.json');
  const configPath = path.join(workspace, '.stub-config.json');

  await mkdir(binDir, { recursive: true });

  const npmScript = `#!/usr/bin/env node
const fs = require('node:fs');
const configPath = process.env.CLI_STUB_CONFIG;
const statePath = process.env.CLI_STUB_STATE;
const config = configPath ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
const args = process.argv.slice(2);
const state = statePath && fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : { npmCalls: [] };

state.npmCalls = state.npmCalls || [];
state.npmCalls.push(args.join(' '));

if (args[0] === 'run' && args[1]) {
  const response = config.runs?.[args[1]];
  if (response) {
    if (response.stdout) process.stdout.write(response.stdout);
    if (response.stderr) process.stderr.write(response.stderr);
    if (statePath) fs.writeFileSync(statePath, JSON.stringify(state));
    process.exit(response.code ?? 0);
  }
}

if (statePath) fs.writeFileSync(statePath, JSON.stringify(state));
  console.error('Unhandled npm command:', args.join(' '));
process.exit(1);
`;

  const ghScript = `#!/usr/bin/env node
const fs = require('node:fs');
const configPath = process.env.CLI_STUB_CONFIG;
const statePath = process.env.CLI_STUB_STATE;
const config = configPath ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
const args = process.argv.slice(2);
const state = statePath && fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : { ghCalls: [], issueList: {}, issueCreateIndex: 0 };

state.ghCalls = state.ghCalls || [];
state.issueList = state.issueList || {};
state.issueCreateIndex = state.issueCreateIndex || 0;
state.ghCalls.push(args.join(' '));

const emit = (response) => {
  if (response.stdout) process.stdout.write(response.stdout);
  if (response.stderr) process.stderr.write(response.stderr);
  if (statePath) fs.writeFileSync(statePath, JSON.stringify(state));
  process.exit(response.code ?? 0);
};

if (args[0] === 'auth' && args[1] === 'status') {
  emit(config.authStatus || { code: 0 });
}

if (args[0] === 'issue' && args[1] === 'list') {
  const searchIndex = args.indexOf('--search');
  const query = searchIndex >= 0 ? args[searchIndex + 1] : '';
  const response = config.issueList?.[query] || config.issueListFallback || { code: 0, json: [] };
  const output = Object.prototype.hasOwnProperty.call(response, 'json')
    ? JSON.stringify(response.json)
    : JSON.stringify([]);
  emit({ ...(response || {}), stdout: response.stdout || output });
}

if (args[0] === 'issue' && args[1] === 'create') {
  const responses = Array.isArray(config.issueCreate) ? config.issueCreate : [{ code: 0, stdout: 'https://example.com/issues/1' }];
  const index = state.issueCreateIndex;
  const response = responses[Math.min(index, Math.max(0, responses.length - 1))] || { code: 0, stdout: '' };
  state.issueCreateIndex = index + 1;
  emit(response);
}

  console.error('Unhandled gh command:', args.join(' '));
emit({ code: 1 });
`;

  await writeFile(path.join(binDir, 'npm'), npmScript, { mode: 0o755, encoding: 'utf8' });
  await writeFile(path.join(binDir, 'gh'), ghScript, { mode: 0o755, encoding: 'utf8' });
  await writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
  await writeFile(statePath, JSON.stringify({}), 'utf8');

  return { binDir, configPath, statePath };
}

async function readGapFile(filePath: string): Promise<GapFile> {
  const text = await readFile(filePath, 'utf8');
  return JSON.parse(text) as GapFile;
}

function stableGapId(type: string, scope: string, proposedComponentId: string, title: string): string {
  return crypto.createHash('sha1').update(`${type}|${scope}|${proposedComponentId}|${title}`).digest('hex');
}

async function cleanup() {
  if (!tempDir) return;
  await rm(tempDir, { recursive: true, force: true });
  tempDir = undefined;
}

describe('dads-template CLI', () => {
  afterEach(async () => {
    await cleanup();
  });

  test('validate templates quick/full runs expected scripts', async () => {
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const stub = await setupStubs(cwd, {
      runs: {
        'patterns:check': { code: 0, stdout: 'patterns ok\n' },
        'validate:wc': { code: 0, stdout: 'wc ok\n' },
        'vendor:check': { code: 0, stdout: 'vendor ok\n' },
        'wcf:docs:check': { code: 0, stdout: 'docs ok\n' },
      },
    });

    const env = {
      ...process.env,
      PATH: `${stub.binDir}${path.delimiter}${process.env.PATH}`,
      CLI_STUB_CONFIG: stub.configPath,
      CLI_STUB_STATE: stub.statePath,
    } as Record<string, string>;

    const quick = await runNode([CLI, 'validate', 'templates', '--mode', 'quick'], { cwd, env });
    expect(quick.code).toBe(0);
    expect(quick.stdout).toContain('"mode":"quick"');

    const full = await runNode([CLI, 'validate', 'templates', '--mode', 'full'], { cwd, env });
    expect(full.code).toBe(0);
    expect(full.stdout).toContain('"mode":"full"');
  });

  test('validate templates reports VALIDATION_FAILED on failed subprocess', async () => {
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const stub = await setupStubs(cwd, {
      runs: {
        'patterns:check': { code: 2, stderr: 'patterns broken\n' },
        'validate:wc': { code: 0, stdout: 'wc ok\n' },
      },
    });

    const env = {
      ...process.env,
      PATH: `${stub.binDir}${path.delimiter}${process.env.PATH}`,
      CLI_STUB_CONFIG: stub.configPath,
      CLI_STUB_STATE: stub.statePath,
    } as Record<string, string>;

    const result = await runNode([CLI, 'validate', 'templates', '--mode', 'quick'], { cwd, env });
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('VALIDATION_FAILED');
  });

  test('collect patterns outputs gap schema and gap type mapping', async () => {
    const cwd = await makeWorkspace(
      {
        schemaVersion: 1,
        modules: [
          {
            kind: 'javascript-module',
            path: 'components',
            declarations: [
              {
                kind: 'custom-element',
                customElement: true,
                tagName: 'dads-heading',
                attributes: [{ name: 'level' }],
              },
            ],
          },
        ],
      },
      {
        schemaVersion: 1,
        patterns: {
          sample: {
            id: 'sample',
            html: '<dads-heading level="1">見出し</dads-heading>\n<dads-unknown></dads-unknown>\n<dads-heading placeholder="x"></dads-heading>\n<h2>見出し</h2>',
          },
        },
      },
    );

    const result = await runNode([CLI, 'collect', 'gaps', '--scope', 'patterns', '--out', 'tmp/gaps.json'], {
      cwd,
      env: process.env as Record<string, string>,
    });
    expect(result.code).toBe(0);

    const payload = await readGapFile(path.join(cwd, 'tmp', 'gaps.json'));
    expect(payload.schemaVersion).toBe(1);
    const types = new Set(payload.gaps.map((gap) => gap.type));
    expect(types.has('component-gap')).toBe(true);
    expect(types.has('api-gap')).toBe(true);
    expect(types.has('expression-gap')).toBe(true);
  });

  test('collect marks selected gap as expression-gap', async () => {
    const cwd = await makeWorkspace(
      {
        schemaVersion: 1,
        modules: [
          {
            kind: 'javascript-module',
            path: 'components',
            declarations: [
              {
                kind: 'custom-element',
                customElement: true,
                tagName: 'dads-heading',
                attributes: [{ name: 'level' }],
              },
            ],
          },
        ],
      },
      {
        schemaVersion: 1,
        patterns: {
          sample: {
            id: 'sample',
            html: '<dads-heading unknown="x" level="1"></dads-heading>',
          },
        },
      },
    );

    const before = await runNode([CLI, 'collect', 'gaps', '--scope', 'patterns', '--out', 'tmp/before.json'], {
      cwd,
      env: process.env as Record<string, string>,
    });
    expect(before.code).toBe(0);

    const beforePayload = await readGapFile(path.join(cwd, 'tmp', 'before.json'));
    const apiGap = beforePayload.gaps.find((gap) => gap.type === 'api-gap');
    expect(apiGap).toBeDefined();

    const marked = await runNode(
      [
        CLI,
        'collect',
        'gaps',
        '--scope',
        'patterns',
        '--out',
        'tmp/after.json',
        '--mark-expression-gap',
        apiGap!.id,
      ],
      { cwd, env: process.env as Record<string, string> },
    );
    expect(marked.code).toBe(0);

    const afterPayload = await readGapFile(path.join(cwd, 'tmp', 'after.json'));
    expect(afterPayload.gaps.find((gap) => gap.id === apiGap!.id)?.type).toBe('expression-gap');
  });

  test('collect viewer scope reads wc.config include paths', async () => {
    const cwd = await makeWorkspace(
      {
        schemaVersion: 1,
        modules: [],
      },
      {
        schemaVersion: 1,
        patterns: {},
      },
      {
        include: ['src/viewer.html'],
      },
      {
        'src/viewer.html': '<dads-unknown></dads-unknown>',
      },
    );

    const result = await runNode([CLI, 'collect', 'gaps', '--scope', 'viewer', '--out', 'tmp/viewer.json'], {
      cwd,
      env: process.env as Record<string, string>,
    });
    expect(result.code).toBe(0);
    const payload = await readGapFile(path.join(cwd, 'tmp', 'viewer.json'));
    expect(payload.gaps.some((gap) => gap.type === 'component-gap')).toBe(true);
  });

  test('collect viewer scope fails with INPUT_INVALID when include file is missing', async () => {
    const cwd = await makeWorkspace(
      {
        schemaVersion: 1,
        modules: [],
      },
      {
        schemaVersion: 1,
        patterns: {},
      },
      {
        include: ['src/missing-viewer.html'],
      },
    );

    const result = await runNode([CLI, 'collect', 'gaps', '--scope', 'viewer', '--out', 'tmp/viewer-missing.json'], {
      cwd,
      env: process.env as Record<string, string>,
    });
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('INPUT_INVALID');
  });

  test('global --help shows usage', async () => {
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const result = await runNode([CLI, '--help'], { cwd, env: process.env as Record<string, string> });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Usage:');
  });

  test('escalate dry-run generates plan only', async () => {
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      gaps: [
        {
          id: stableGapId('component-gap', 'patterns', 'dads-foo', 'Add component'),
          type: 'component-gap',
          scope: 'patterns',
          proposedComponentId: 'dads-foo',
          title: 'Add component dads-foo',
          summary: 'Missing component',
          evidence: ['sample:1:1'],
          acceptanceCriteria: ['Provide component'],
          priority: 'P1' as const,
          dedupeKey: 'component-gap:patterns:dads-foo',
        },
      ],
    };
    await writeFixtureFile(path.join(cwd, 'tmp', 'gaps.json'), `${JSON.stringify(payload, null, 2)}\n`);

    const result = await runNode([CLI, 'escalate', 'gaps', '--input', 'tmp/gaps.json'], { cwd, env: process.env as Record<string, string> });
    expect(result.code).toBe(0);
    const summary = parseLastJson(result.stdout) as { mode?: string; items?: Array<{ action?: string }> };
    expect(summary.mode).toBe('dry-run');
    expect(summary.items?.[0]?.action).toBe('dry-run:plan');
    await expect(readFile(path.join(cwd, 'tmp', 'template-gaps.retry.json')).rejects.toThrow();
  });

  test('escalate dry-run fails when item is invalid', async () => {
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      gaps: [
        {
          invalid: true,
        } as never,
      ],
    };
    await writeFixtureFile(path.join(cwd, 'tmp', 'gaps-invalid.json'), `${JSON.stringify(payload, null, 2)}\n`);

    const result = await runNode([CLI, 'escalate', 'gaps', '--input', 'tmp/gaps-invalid.json'], {
      cwd,
      env: process.env as Record<string, string>,
    });
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('INPUT_INVALID');
    expect(result.stderr).not.toContain('tmp/template-gaps.retry.json');
    await expect(readFile(path.join(cwd, 'tmp', 'template-gaps.retry.json')).rejects.toThrow();
  });

  test('escalate create requires gh auth', async () => {
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      gaps: [],
    };
    await writeFixtureFile(path.join(cwd, 'tmp', 'gaps.json'), `${JSON.stringify(payload, null, 2)}\n`);

    const stub = await setupStubs(cwd, {
      authStatus: { code: 1, stderr: 'not logged in' },
    });

    const env = {
      ...process.env,
      PATH: `${stub.binDir}${path.delimiter}${process.env.PATH}`,
      CLI_STUB_CONFIG: stub.configPath,
      CLI_STUB_STATE: stub.statePath,
    } as Record<string, string>;

    const result = await runNode([CLI, 'escalate', 'gaps', '--input', 'tmp/gaps.json', '--create'], { cwd, env });
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('GH_AUTH_REQUIRED');
  });

  test('escalate create skips existing issue by dedupe key', async () => {
    const dedupeKey = 'component-gap:patterns:dads-foo';
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      gaps: [
        {
          id: stableGapId('component-gap', 'patterns', 'dads-foo', 'Add component'),
          type: 'component-gap',
          scope: 'patterns',
          proposedComponentId: 'dads-foo',
          title: 'Add component dads-foo',
          summary: 'Missing component',
          evidence: ['sample:1:1'],
          acceptanceCriteria: ['Provide component'],
          priority: 'P1' as const,
          dedupeKey,
        },
        {
          id: stableGapId('component-gap', 'patterns', 'dads-foo', 'Add component duplicate'),
          type: 'component-gap',
          scope: 'patterns',
          proposedComponentId: 'dads-foo',
          title: 'Add component dads-foo duplicate',
          summary: 'Missing component',
          evidence: ['sample:2:1'],
          acceptanceCriteria: ['Provide component'],
          priority: 'P1' as const,
          dedupeKey,
        },
      ],
    };
    await writeFixtureFile(path.join(cwd, 'tmp', 'gaps.json'), `${JSON.stringify(payload, null, 2)}\n`);

    const stub = await setupStubs(cwd, {
      authStatus: { code: 0 },
      issueList: {
        [dedupeKey]: {
          code: 0,
          json: [{ number: 1, body: `dedupe key: ${dedupeKey}` }],
        },
      },
    });

    const env = {
      ...process.env,
      PATH: `${stub.binDir}${path.delimiter}${process.env.PATH}`,
      CLI_STUB_CONFIG: stub.configPath,
      CLI_STUB_STATE: stub.statePath,
    } as Record<string, string>;

    const result = await runNode([CLI, 'escalate', 'gaps', '--input', 'tmp/gaps.json', '--create'], {
      cwd,
      env,
    });
    expect(result.code).toBe(0);
    const summary = parseLastJson(result.stdout) as { items?: Array<{ status?: string }> };
    expect(summary.items?.every((item) => item.status === 'skipped-existing')).toBe(true);
    const state = JSON.parse(await readFile(stub.statePath, 'utf8')) as { issueCreateIndex?: number };
    expect(state.issueCreateIndex).toBe(0);
  });

  test('escalate create emits ISSUE_CREATE_FAILED and retry json on partial failure', async () => {
    const cwd = await makeWorkspace({ schemaVersion: 1, modules: [] }, { schemaVersion: 1, patterns: {} });
    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      gaps: [
        {
          id: 'one',
          type: 'component-gap',
          scope: 'patterns',
          proposedComponentId: 'dads-foo',
          title: 'Add component dads-foo',
          summary: 'Missing component',
          evidence: ['sample:1:1'],
          acceptanceCriteria: ['Provide component'],
          priority: 'P1' as const,
          dedupeKey: 'component-gap:patterns:dads-foo',
        },
        {
          id: 'two',
          type: 'component-gap',
          scope: 'patterns',
          proposedComponentId: 'dads-bar',
          title: 'Add component dads-bar',
          summary: 'Missing component',
          evidence: ['sample:2:1'],
          acceptanceCriteria: ['Provide component'],
          priority: 'P1' as const,
          dedupeKey: 'component-gap:patterns:dads-bar',
        },
      ],
    };
    await writeFixtureFile(path.join(cwd, 'tmp', 'gaps.json'), `${JSON.stringify(payload, null, 2)}\n`);

    const stub = await setupStubs(cwd, {
      authStatus: { code: 0 },
      issueListFallback: { code: 0, json: [] },
      issueCreate: [
        { code: 0, stdout: 'https://example.com/issues/1' },
        { code: 1, stderr: 'issue create failed\n' },
      ],
    });

    const env = {
      ...process.env,
      PATH: `${stub.binDir}${path.delimiter}${process.env.PATH}`,
      CLI_STUB_CONFIG: stub.configPath,
      CLI_STUB_STATE: stub.statePath,
    } as Record<string, string>;

    const result = await runNode([CLI, 'escalate', 'gaps', '--input', 'tmp/gaps.json', '--create'], {
      cwd,
      env,
    });
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('ISSUE_CREATE_FAILED');

    const retry = JSON.parse(await readFile(path.join(cwd, 'tmp', 'template-gaps.retry.json'), 'utf8')) as { failed: number };
    expect(retry.failed).toBe(1);
  });
});

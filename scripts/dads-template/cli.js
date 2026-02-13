#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

import { collectCemCustomElements, validateTextAgainstCem } from '../wc/validator-core.mjs';

const ERROR_CODES = Object.freeze({
  INPUT_INVALID: 'INPUT_INVALID',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  GH_AUTH_REQUIRED: 'GH_AUTH_REQUIRED',
  ISSUE_CREATE_FAILED: 'ISSUE_CREATE_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

const GAP_SCHEMA_VERSION = 1;
const CLI_ROOT = path.resolve(process.cwd());
const RETRY_PATH = path.join(CLI_ROOT, 'tmp', 'template-gaps.retry.json');

const VALIDATION_SETS = Object.freeze({
  quick: ['patterns:check', 'validate:wc'],
  full: ['patterns:check', 'vendor:check', 'wcf:docs:check', 'validate:wc'],
});

const VALID_PRIORITIES = Object.freeze(['P1', 'P2', 'P3']);

function normalize(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => (typeof item === 'string' ? item.split(',') : [])).map((v) => normalize(v)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((v) => normalize(v)).filter(Boolean);
  }

  return [];
}

function sha1Hex(text) {
  return crypto.createHash('sha1').update(String(text)).digest('hex');
}

function makeGapId(type, scope, proposedComponentId, title) {
  return sha1Hex(`${type}|${scope}|${proposedComponentId}|${title}`);
}

function makeDedupeKey(type, scope, proposedComponentId) {
  return `${type}:${scope}:${proposedComponentId}`;
}

function slugify(input) {
  const base = normalize(input, 'gap').toLowerCase();
  return base
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') || 'expr-gap';
}

function parseArgs(argv) {
  const result = {
    cmd: null,
    sub: null,
    opts: {},
    rest: [],
    errors: [],
  };

  if (argv.length === 0) {
    return result;
  }

  const args = argv;
  let isCmdResolved = false;
  let isSubResolved = false;
  for (let i = 0; i < args.length; i += 1) {
    const current = args[i];
    if (!current?.startsWith('--')) {
      if (!isCmdResolved) {
        result.cmd = current;
        isCmdResolved = true;
        continue;
      }

      if (!isSubResolved) {
        result.sub = current;
        isSubResolved = true;
        continue;
      }

      result.rest.push(current);
      continue;
    }

    const raw = current.slice(2);
    if (raw === 'help' || raw === 'h') {
      result.opts.help = true;
      continue;
    }

    if (raw === 'create') {
      result.opts.create = true;
      continue;
    }

    const [flag, inline] = raw.split('=', 2);
    const next = args[i + 1];

    if (inline === undefined && (!next || (typeof next === 'string' && next.startsWith('--')))) {
      result.errors.push(`Missing value for --${flag}`);
      continue;
    }

    const value = inline === undefined ? next : inline;
    if (inline === undefined) {
      i += 1;
    }

    if (flag === 'mark-expression-gap') {
      result.opts.markExpressionGap = normalizeList(result.opts.markExpressionGap ?? []);
      for (const candidate of normalizeList(value)) {
        result.opts.markExpressionGap.push(candidate);
      }
      continue;
    }

    result.opts[flag] = normalize(value);
  }

  return result;
}

function printUsage() {
  const lines = [
    'Usage:',
    '  node scripts/dads-template/cli.js validate templates --mode quick|full',
    '  node scripts/dads-template/cli.js collect gaps --scope patterns|viewer|all --out <path> [--mark-expression-gap <id> ...]',
    '  node scripts/dads-template/cli.js escalate gaps --input <path> [--create]',
    '',
    'Options:',
    '  --mark-expression-gap <id>   collect済み gap id を expression-gap に上書き（複数可）',
    '  --out <path>                 gap JSON の保存先',
    '  --input <path>               gap JSON の入力',
    '  --scope <patterns|viewer|all> 収集対象',
    '  --mode <quick|full>          検証モード',
    '  --create                     GitHub Issue を作成する（ローカルのみ）',
  ];
  console.log(lines.join('\n'));
}

function runCommand(command, args, { cwd = process.cwd() } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', (err) => {
      reject({
        code: 'SPAWN_ERROR',
        message: err?.message ?? String(err),
        command,
        args,
        stderr,
      });
    });

    child.on('close', (code) => {
      const exitCode = Number(code ?? 0);
      if (exitCode === 0) {
        resolve({ code: 0, stdout, stderr });
        return;
      }
      reject({
        code: exitCode,
        message: `${command} ${args.join(' ')} failed with exit code ${exitCode}`,
        command,
        args,
        stdout,
        stderr,
      });
    });
  });
}

async function loadJson(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

function fallbackIncludePaths() {
  return [
    'viewer.html',
    'src/demos.ts',
    'src/demos/shared.ts',
    'src/demos/showcase-form.ts',
    'src/demos/showcase-date.ts',
    'src/demos/showcase-components.ts',
    'src/demos/showcase-navigation.ts',
    'src/demos/extra.ts',
    'src/entry.ts',
  ];
}

async function loadWcIncludePaths(root) {
  const configPath = path.resolve(root, 'wc.config.js');
  try {
    const config = await import(pathToFileURL(configPath).href);
    const resolved = config?.default || config;
    const include = Array.isArray(resolved?.include) ? resolved.include : null;
    if (Array.isArray(include) && include.length > 0) return include;
  } catch {
    // fallback to defaults if wc.config.js is missing/invalid.
  }
  return fallbackIncludePaths();
}

function buildGap({ type, scope, proposedComponentId, title, summary, evidence, acceptanceCriteria, priority, fallbackFile }) {
  const normalizedType = normalize(type);
  const normalizedScope = normalize(scope);
  const normalizedComponent = normalize(proposedComponentId, 'expr:manual');
  const normalizedTitle = normalize(title, 'Gap');
  const id = makeGapId(normalizedType, normalizedScope, normalizedComponent, normalizedTitle);
  const dedupeKey = makeDedupeKey(normalizedType, normalizedScope, normalizedComponent);

  const criteria =
    acceptanceCriteria && acceptanceCriteria.length > 0
      ? acceptanceCriteria
      : [
          normalizedType === 'component-gap'
            ? `Add declaration and installer metadata for ${normalizedComponent}.`
            : normalizedType === 'api-gap'
              ? `Support missing API element: ${normalizedTitle}.`
              : `Update template expression to satisfy DADS constraints: ${normalizedTitle}.`,
          'Validate with the template gap workflow before closing.',
        ];

  return {
    id,
    type: normalizedType,
    scope: normalizedScope,
    proposedComponentId: normalizedComponent,
    title: normalizedTitle,
    summary: normalize(summary) || 'TBD',
    evidence: Array.isArray(evidence) && evidence.length > 0 ? evidence : [normalize(fallbackFile, 'unknown:1:1')],
    acceptanceCriteria: criteria,
    priority: VALID_PRIORITIES.includes(normalize(priority, 'P2')) ? normalize(priority, 'P2') : 'P2',
    dedupeKey,
  };
}

function diagnosticToGap(diagnostic, scope) {
  const tagName = normalize(diagnostic?.tagName, 'dads-unknown');
  const attrName = normalize(diagnostic?.attrName);
  const file = normalize(diagnostic?.file, 'unknown');
  const range = diagnostic?.range?.start || {};
  const location = `${file}:${range.line || 1}:${range.col || 1}`;

  if (diagnostic?.code === 'unknownElement') {
    return buildGap({
      type: 'component-gap',
      scope,
      proposedComponentId: tagName,
      title: `Add custom element ${tagName}`,
      summary: `CEM validation found unknown element <${tagName}> in ${scope}.`,
      evidence: [location],
      priority: diagnostic.severity === 'error' ? 'P1' : 'P2',
      fallbackFile: file,
      acceptanceCriteria: [
        `Define custom element <${tagName}> in CEM and ensure install metadata exists.`,
        'Keep canonical tag as `dads-*`.',
      ],
    });
  }

  if (diagnostic?.code === 'unknownAttribute' || diagnostic?.code === 'forbiddenAttribute') {
    const proposal = attrName ? `${tagName}#${attrName}` : tagName;
    return buildGap({
      type: 'api-gap',
      scope,
      proposedComponentId: proposal,
      title: `Support ${proposal}`,
      summary: `API validation failed for <${tagName}>: ${normalize(diagnostic?.message, 'Unknown API').trim()}`,
      evidence: [location],
      priority: diagnostic.severity === 'error' ? 'P1' : 'P2',
      fallbackFile: file,
      acceptanceCriteria: [
        `Document and allow the required API used for <${tagName}>.`,
        `If attribute is intentionally unsupported, update template expression in this scope.`,
      ],
    });
  }

  return buildGap({
    type: 'expression-gap',
    scope,
    proposedComponentId: `expr:${slugify(`${tagName}:${diagnostic?.code || 'other'}`)}`,
    title: `Handle expression in ${file}`,
    summary: normalize(diagnostic?.message, 'Unmapped validation result.').trim(),
    evidence: [location],
    priority: 'P3',
    fallbackFile: file,
    acceptanceCriteria: [`Resolve non-API/非要素差分 in ${scope} as template expression gap.`],
  });
}

function mergeById(gaps) {
  const map = new Map();
  for (const gap of gaps || []) {
    if (!gap || typeof gap !== 'object') continue;

    const existing = map.get(gap.id);
    const normalized = {
      ...gap,
      evidence: Array.isArray(gap.evidence) ? [...gap.evidence] : [normalize(gap.evidence, 'unknown:1:1')],
      acceptanceCriteria: Array.isArray(gap.acceptanceCriteria) ? [...gap.acceptanceCriteria] : ['TBD'],
    };

    if (!existing) {
      map.set(gap.id, normalized);
      continue;
    }

    map.set(gap.id, {
      ...existing,
      evidence: Array.from(new Set([...(existing.evidence || []), ...(normalized.evidence || [])])),
      acceptanceCriteria: Array.from(new Set([...(existing.acceptanceCriteria || []), ...(normalized.acceptanceCriteria || [])])),
    });
  }

  return Array.from(map.values()).sort((a, b) =>
    `${a.type}:${a.scope}:${a.proposedComponentId}:${a.title}`.localeCompare(
      `${b.type}:${b.scope}:${b.proposedComponentId}:${b.title}`,
    ),
  );
}

async function collectPatternScope({ root, cemIndex }) {
  const patternPath = path.resolve(root, 'registry/pattern-registry.json');
  const patterns = await loadJson(patternPath);
  const entries = Object.entries(patterns?.patterns || {});

  const result = [];

  for (const [patternId, raw] of entries) {
    const html = normalize(raw?.html);
    const filePath = `pattern:${patternId}`;

    if (!html) {
      result.push(
        buildGap({
          type: 'expression-gap',
          scope: 'patterns',
          proposedComponentId: `expr:${slugify(`missing-html-${patternId}`)}`,
          title: `Fix pattern html for ${patternId}`,
          summary: `Pattern ${patternId} has no html.`,
          evidence: [filePath],
          priority: 'P1',
          fallbackFile: filePath,
        }),
      );
      continue;
    }

    const diagnostics = validateTextAgainstCem({
      filePath,
      text: html,
      cem: cemIndex,
      severity: {
        unknownElement: 'error',
        unknownAttribute: 'warning',
      },
    });

    for (const diagnostic of diagnostics) {
      result.push(diagnosticToGap(diagnostic, 'patterns'));
    }

    const hasDadsElement = /<\s*dads-[a-z0-9-]+/i.test(html);
    if (hasDadsElement && !/data-dads-typeset/i.test(html)) {
      result.push(
        buildGap({
          type: 'expression-gap',
          scope: 'patterns',
          proposedComponentId: `expr:${slugify(`${patternId}-typeset`)}`,
          title: `Add data-dads-typeset to pattern ${patternId}`,
          summary: `Pattern ${patternId} uses DADS components but is missing data-dads-typeset.`,
          evidence: [`${filePath}:1:1`],
          priority: 'P2',
          fallbackFile: filePath,
        }),
      );
    }

    const hasNativeHeading = /<\s*h[1-6]\b/i.test(html);
    const hasDadsHeading = /<\s*dads-heading\b/i.test(html);
    if (hasNativeHeading && !hasDadsHeading) {
      result.push(
        buildGap({
          type: 'expression-gap',
          scope: 'patterns',
          proposedComponentId: `expr:${slugify(`${patternId}-heading`)}`,
          title: `Use dads-heading in pattern ${patternId}`,
          summary: `Pattern ${patternId} uses native heading elements in DADS context.`,
          evidence: [`${filePath}:1:1`],
          priority: 'P2',
          fallbackFile: filePath,
        }),
      );
    }
  }

  return result;
}

async function collectViewerScope({ root, cemIndex }) {
  const include = await loadWcIncludePaths(root);
  const result = [];

  for (const includePath of include) {
    const abs = path.resolve(root, includePath);
    let text = '';
    try {
      text = await fs.readFile(abs, 'utf8');
    } catch (error) {
      throw {
        errorCode: ERROR_CODES.INPUT_INVALID,
        message: `viewer include file not found: ${includePath}`,
        details: error?.message || String(error),
      };
    }
    const diagnostics = validateTextAgainstCem({
      filePath: includePath,
      text,
      cem: cemIndex,
      severity: {
        unknownElement: 'error',
        unknownAttribute: 'warning',
      },
    });

    for (const diagnostic of diagnostics) {
      result.push(diagnosticToGap(diagnostic, 'viewer'));
    }
  }

  return result;
}

function markGapsAsExpression(gaps, idsToMark = []) {
  const markSet = new Set(normalizeList(idsToMark));
  if (markSet.size === 0) return gaps;

  return gaps.map((gap) => {
    if (!gap || !markSet.has(gap.id)) return gap;

    const proposal =
      gap.proposedComponentId && gap.proposedComponentId.startsWith('expr:')
        ? gap.proposedComponentId
        : `expr:${slugify(`${gap.scope}-${gap.proposedComponentId}-${gap.title}`)}`;

    const rewritten = buildGap({
      type: 'expression-gap',
      scope: gap.scope,
      proposedComponentId: proposal,
      title: `Expression gap: ${gap.title}`,
      summary: gap.summary,
      evidence: Array.isArray(gap.evidence) ? gap.evidence : [String(gap.evidence)],
      priority: gap.priority,
      fallbackFile: `gap:${gap.id}`,
      acceptanceCriteria: Array.isArray(gap.acceptanceCriteria) ? gap.acceptanceCriteria : ['TBD'],
    });

    return { ...rewritten, id: gap.id, dedupeKey: rewritten.dedupeKey };
  });
}

async function runCollect(args, root = CLI_ROOT) {
  const out = normalize(args.out);
  const scope = normalize(args.scope);

  if (!['patterns', 'viewer', 'all'].includes(scope)) {
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: 'collect gaps requires --scope patterns|viewer|all.',
    };
  }

  if (!out) {
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: 'collect gaps requires --out <path>.',
    };
  }

  const customElementsPath = path.resolve(root, 'custom-elements.json');
  let cem;
  try {
    cem = await loadJson(customElementsPath);
  } catch (error) {
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: `Failed to load ${path.relative(root, customElementsPath)}: ${error?.message || String(error)}`,
    };
  }

  const cemIndex = collectCemCustomElements(cem);
  let gaps = [];

  if (scope === 'patterns' || scope === 'all') {
    gaps = gaps.concat(await collectPatternScope({ root, cemIndex }));
  }
  if (scope === 'viewer' || scope === 'all') {
    gaps = gaps.concat(await collectViewerScope({ root, cemIndex }));
  }

  const mapped = markGapsAsExpression(gaps, args.markExpressionGap);
  const dedupe = mergeById(mapped);

  const payload = {
    schemaVersion: GAP_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    gaps: dedupe,
  };

  const outPath = path.resolve(root, out);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify(payload, null, 2));
  return payload;
}

function sanitizeEvidence(evidences) {
  if (!Array.isArray(evidences)) return [];
  return evidences
    .map((entry) =>
      String(entry)
        .replace(/https?:\/\/[^\s)]+/g, '<url>')
        .replace(/[A-Za-z0-9+/=]{24,}/g, '<token>'),
    )
    .filter(Boolean);
}

function validateGapRecord(rawGap) {
  const issues = [];

  if (!rawGap || typeof rawGap !== 'object') {
    return {
      ok: false,
      reason: 'Gap item must be an object.',
      dedupeKey: 'unknown',
      id: 'unknown',
    };
  }

  const type = normalize(rawGap.type);
  const scope = normalize(rawGap.scope);
  const proposedComponentId = normalize(rawGap.proposedComponentId);
  const title = normalize(rawGap.title);

  if (!type) issues.push('type');
  if (!scope) issues.push('scope');
  if (!proposedComponentId) issues.push('proposedComponentId');
  if (!title) issues.push('title');

  if (issues.length > 0) {
    return {
      ok: false,
      reason: `Missing required gap fields: ${issues.join(', ')}`,
      dedupeKey: makeDedupeKey(type || 'unknown', scope || 'unknown', proposedComponentId || 'unknown'),
      id: rawGap.id || makeGapId(type || 'unknown', scope || 'unknown', proposedComponentId || 'unknown', title || 'Unknown'),
    };
  }

  return {
    ok: true,
    dedupeKey: makeDedupeKey(type, scope, proposedComponentId),
    id: rawGap.id || makeGapId(type, scope, proposedComponentId, title),
  };
}

async function checkGhAuth() {
  try {
    await runCommand('gh', ['auth', 'status']);
    return true;
  } catch {
    return false;
  }
}

async function hasExistingIssue(dedupeKey) {
  const result = await runCommand('gh', [
    'issue',
    'list',
    '--state',
    'open',
    '--search',
    dedupeKey,
    '--json',
    'number,title,body',
  ]);

  const text = result.stdout.trim();
  if (!text) return [];
  const items = JSON.parse(text);
  if (!Array.isArray(items)) return [];

  return items.filter((item) => normalize(item?.body).includes(dedupeKey));
}

async function createIssueFromGap(gap, { cwd }) {
  const dedupeKey = gap.dedupeKey || makeDedupeKey(gap.type, gap.scope, gap.proposedComponentId);
  const title = `[template-gap][${gap.type}][${gap.scope}][${gap.proposedComponentId}] ${gap.title}`;
  const evidence = sanitizeEvidence(gap.evidence || []);

  const body = [
    `## Gap`,
    `- Type: ${gap.type}`,
    `- Scope: ${gap.scope}`,
    `- Proposed Component ID: ${gap.proposedComponentId}`,
    `- Priority: ${gap.priority}`,
    `- Dedupe key: ${dedupeKey}`,
    '',
    `## Summary`,
    gap.summary,
    '',
    '## Evidence',
    ...evidence.map((line) => `- ${line}`),
    '',
    '## Acceptance Criteria',
    ...(Array.isArray(gap.acceptanceCriteria) && gap.acceptanceCriteria.length > 0
      ? gap.acceptanceCriteria.map((line) => `- ${line}`)
      : ['- TBD']),
  ].join('\n');

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'template-gap-body-'));
  const bodyPath = path.join(tmpDir, 'body.md');
  await fs.writeFile(bodyPath, body, 'utf8');

  try {
    const issue = await runCommand('gh', [
      'issue',
      'create',
      '--title',
      title,
      '--body-file',
      bodyPath,
      '--label',
      'enhancement',
    ], { cwd });
    return {
      ok: true,
      id: gap.id,
      dedupeKey,
      output: (issue.stdout || '').trim(),
    };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function runEscalate(args, root = CLI_ROOT) {
  const input = normalize(args.input);
  if (!input) {
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: 'escalate gaps requires --input <path>.',
    };
  }

  const payloadPath = path.resolve(root, input);
  let payload;
  try {
    payload = await loadJson(payloadPath);
  } catch (error) {
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: `Failed to load gap JSON ${path.relative(root, payloadPath)}: ${error?.message || String(error)}`,
    };
  }

  if (payload?.schemaVersion !== GAP_SCHEMA_VERSION || !Array.isArray(payload.gaps)) {
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: 'Invalid gap JSON schema. expected { schemaVersion: 1, gaps: [...] }',
    };
  }

  const create = !!args.create;
  if (create) {
    const ok = await checkGhAuth();
    if (!ok) {
      throw {
        errorCode: ERROR_CODES.GH_AUTH_REQUIRED,
        message: 'gh auth required. Run `gh auth login` first.',
      };
    }
  }

  const items = [];
  let failed = 0;
  const failedItems = [];
  const seenDedupes = new Set();

  for (const rawGap of payload.gaps) {
    const validation = validateGapRecord(rawGap);
    if (!validation.ok) {
      const reason = validation.reason || 'invalid-gap-item';
      failed += 1;
      failedItems.push({
        id: validation.id,
        dedupeKey: validation.dedupeKey,
        reason,
      });
      items.push({
        ...rawGap,
        id: validation.id,
        dedupeKey: validation.dedupeKey,
        status: 'failed',
        reason,
        action: create ? 'validation-failed' : 'dry-run-validation-failed',
      });
      continue;
    }

    const gap = {
      ...rawGap,
      dedupeKey: rawGap.dedupeKey || validation.dedupeKey,
      id: rawGap.id || validation.id,
      evidence: sanitizeEvidence(rawGap.evidence),
    };
    if (seenDedupes.has(gap.dedupeKey)) {
      items.push({ ...gap, action: 'skipped-existing', status: 'skipped-existing', issueCount: 0 });
      continue;
    }
    seenDedupes.add(gap.dedupeKey);

    if (!create) {
      items.push({ ...gap, action: 'dry-run:plan', status: 'would-create' });
      continue;
    }

    try {
      const existing = await hasExistingIssue(gap.dedupeKey);
      if (existing.length > 0) {
        items.push({ ...gap, action: 'skipped-existing', status: 'skipped-existing', issueCount: existing.length });
        continue;
      }

      const created = await createIssueFromGap(gap, { cwd: root });
      items.push({ ...gap, action: 'created', status: 'created', issue: created.output || null });
    } catch (error) {
      failed += 1;
      const record = {
        id: gap.id,
        dedupeKey: gap.dedupeKey,
        reason: error?.message || String(error),
      };
      failedItems.push(record);
      items.push({ ...gap, status: 'failed', reason: record.reason, action: 'create-failed' });
    }
  }

  if (failed > 0 && create) {
    await fs.mkdir(path.dirname(RETRY_PATH), { recursive: true });
    const retryPayload = {
      schemaVersion: GAP_SCHEMA_VERSION,
      generatedAt: new Date().toISOString(),
      failed,
      items: failedItems,
    };
    await fs.writeFile(RETRY_PATH, `${JSON.stringify(retryPayload, null, 2)}\n`, 'utf8');
  } else {
    await fs.rm(RETRY_PATH, { force: true }).catch(() => {});
  }

  const summary = {
    schemaVersion: GAP_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    mode: create ? 'create' : 'dry-run',
    total: payload.gaps.length,
    create,
    failed,
    items,
  };
  console.log(JSON.stringify(summary, null, 2));

  if (failed > 0) {
    throw {
      errorCode: create ? ERROR_CODES.ISSUE_CREATE_FAILED : ERROR_CODES.INPUT_INVALID,
      message: `Failed to process ${failed} item(s) during escalation. See ${path.relative(CLI_ROOT, RETRY_PATH)}`,
    };
  }
}

async function runValidateTemplates(args) {
  const mode = normalize(args.mode);
  const commands = VALIDATION_SETS[mode];
  if (!commands) {
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: 'validate templates requires --mode quick|full.',
    };
  }

  try {
    for (const command of commands) {
      await runCommand('npm', ['run', command]);
    }
    console.log(JSON.stringify({ ok: true, mode, commands }, null, 2));
  } catch (error) {
    throw {
      errorCode: ERROR_CODES.VALIDATION_FAILED,
      message: `Validation failed while running ${error?.command ? `${error.command} ${normalize(error?.args?.join(' '), 'unknown')}` : 'unknown command'}`,
      details: error?.stderr || error?.stdout || error?.message,
    };
  }
}

function emitError(code, message, details) {
  if (message) {
    console.error(`${code}: ${message}`);
  }
  if (details) {
    console.error(String(details));
  }
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.opts.help) {
    printUsage();
    return;
  }

  if (parsed.errors.length > 0) {
    parsed.errors.forEach((error) => emitError(ERROR_CODES.INPUT_INVALID, error));
    printUsage();
    process.exit(1);
  }

  if (!parsed.cmd) {
    printUsage();
    emitError(ERROR_CODES.INPUT_INVALID, 'missing command');
    process.exit(1);
  }

  try {
    if (parsed.cmd === 'validate' && parsed.sub === 'templates') {
      await runValidateTemplates(parsed.opts);
      return;
    }

    if (parsed.cmd === 'collect' && parsed.sub === 'gaps') {
      await runCollect(parsed.opts, CLI_ROOT);
      return;
    }

    if (parsed.cmd === 'escalate' && parsed.sub === 'gaps') {
      await runEscalate(parsed.opts, CLI_ROOT);
      return;
    }

    printUsage();
    throw {
      errorCode: ERROR_CODES.INPUT_INVALID,
      message: `Unknown command: ${parsed.cmd} ${parsed.sub || ''}`.trim(),
    };
  } catch (error) {
    if (error && typeof error === 'object' && error.errorCode) {
      emitError(error.errorCode, error.message, error.details);
      process.exit(1);
      return;
    }

    emitError(ERROR_CODES.INTERNAL_ERROR, error?.message || String(error));
    process.exit(1);
  }
}

main();

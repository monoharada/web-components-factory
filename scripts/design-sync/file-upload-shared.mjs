import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';

export const REQUIRED_STATES = Object.freeze([
  'default',
  'error-required',
  'disabled',
  'button-only',
  'fullscreen-dragover',
]);

export const CRITICAL_PARTS = Object.freeze(['dropzone', 'browse-button', 'error-text']);

export const THRESHOLDS = Object.freeze({
  diffRatio: 0.05,
  partDiffRatio: 0.03,
});

export const BASELINE_MISSING_FAIL_FROM = '2026-02-21T00:00:00+09:00';

export const EXIT_CODES = Object.freeze({
  success: 0,
  captureFailure: 10,
  fidelityFailure: 20,
  opsFailure: 30,
});

export const DEFAULT_CAPTURE_JSON_PATH = 'tmp/design-sync/file-upload/capture/capture.json';
export const DEFAULT_CAPTURE_STATES_DIR = 'tmp/design-sync/file-upload/capture/states';
export const DEFAULT_REPORT_JSON_PATH = 'tmp/design-sync/file-upload/report/report.json';
export const DEFAULT_REPORT_OVERLAYS_DIR = 'tmp/design-sync/file-upload/report/overlays';
export const DEFAULT_OPS_DIR = 'tmp/design-sync/file-upload/ops';
export const DEFAULT_BASELINES_JSON_PATH = 'resources/dads/components/file-upload/fidelity/baselines.json';

const ajv = new Ajv({ allErrors: true, strict: false });

const numberSchema = { type: 'number' };

const rectSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['x', 'y', 'width', 'height'],
  properties: {
    x: numberSchema,
    y: numberSchema,
    width: numberSchema,
    height: numberSchema,
  },
};

const styleMapSchema = {
  type: 'object',
  additionalProperties: {
    type: 'string',
  },
};

const attributeMapSchema = {
  type: 'object',
  additionalProperties: {
    type: 'string',
  },
};

const partCaptureSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['exists', 'bbox', 'relativeBBox', 'text', 'computedStyle'],
  properties: {
    exists: { type: 'boolean' },
    bbox: { anyOf: [rectSchema, { type: 'null' }] },
    relativeBBox: { anyOf: [rectSchema, { type: 'null' }] },
    text: { type: 'string' },
    computedStyle: styleMapSchema,
    attributes: attributeMapSchema,
  },
};

const stateCaptureSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'screenshotPath', 'host', 'parts'],
  properties: {
    name: { type: 'string' },
    screenshotPath: { type: 'string' },
    host: {
      type: 'object',
      additionalProperties: false,
      required: ['bbox', 'text', 'computedStyle', 'attributes'],
      properties: {
        bbox: rectSchema,
        text: { type: 'string' },
        computedStyle: styleMapSchema,
        attributes: attributeMapSchema,
      },
    },
    parts: {
      type: 'object',
      additionalProperties: partCaptureSchema,
    },
    notes: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

const stateReportSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'status', 'baseline', 'diffRatio', 'parts', 'gate', 'messages'],
  properties: {
    name: { type: 'string' },
    status: { enum: ['pass', 'warn', 'fail'] },
    baseline: {
      type: 'object',
      additionalProperties: false,
      required: ['path', 'source', 'missing'],
      properties: {
        path: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        source: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        missing: { type: 'boolean' },
      },
    },
    diffRatio: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    parts: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: false,
        required: ['diffRatio', 'pass', 'reason'],
        properties: {
          diffRatio: { anyOf: [{ type: 'number' }, { type: 'null' }] },
          pass: { type: 'boolean' },
          reason: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        },
      },
    },
    gate: {
      type: 'object',
      additionalProperties: false,
      required: ['globalPass', 'partsPass', 'pass'],
      properties: {
        globalPass: { type: 'boolean' },
        partsPass: { type: 'boolean' },
        pass: { type: 'boolean' },
      },
    },
    messages: {
      type: 'array',
      items: { type: 'string' },
    },
    overlayPaths: {
      type: 'object',
      additionalProperties: false,
      required: ['alpha', 'diff'],
      properties: {
        alpha: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        diff: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
    },
  },
};

export const captureSchemaV1 = Object.freeze({
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'generatedAt',
    'component',
    'sourceUrl',
    'requiredStates',
    'criticalParts',
    'states',
  ],
  properties: {
    schemaVersion: { const: 1 },
    generatedAt: { type: 'string' },
    component: { const: 'dads-file-upload' },
    sourceUrl: { type: 'string' },
    requiredStates: {
      type: 'array',
      minItems: REQUIRED_STATES.length,
      items: { type: 'string' },
    },
    criticalParts: {
      type: 'array',
      minItems: CRITICAL_PARTS.length,
      items: { type: 'string' },
    },
    viewport: {
      type: 'object',
      additionalProperties: false,
      required: ['width', 'height'],
      properties: {
        width: { type: 'number' },
        height: { type: 'number' },
      },
    },
    states: {
      type: 'object',
      additionalProperties: stateCaptureSchema,
    },
  },
});

export const reportSchemaV1 = Object.freeze({
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'generatedAt',
    'component',
    'capturePath',
    'thresholds',
    'baselinePolicy',
    'requiredStates',
    'criticalParts',
    'states',
    'summary',
  ],
  properties: {
    schemaVersion: { const: 1 },
    generatedAt: { type: 'string' },
    component: { const: 'dads-file-upload' },
    capturePath: { type: 'string' },
    thresholds: {
      type: 'object',
      additionalProperties: false,
      required: ['diffRatio', 'partDiffRatio'],
      properties: {
        diffRatio: { type: 'number' },
        partDiffRatio: { type: 'number' },
      },
    },
    baselinePolicy: {
      type: 'object',
      additionalProperties: false,
      required: ['pocEndDate', 'failFrom', 'failOnMissingEnabled'],
      properties: {
        pocEndDate: { type: 'string' },
        failFrom: { type: 'string' },
        failOnMissingEnabled: { type: 'boolean' },
      },
    },
    requiredStates: {
      type: 'array',
      minItems: REQUIRED_STATES.length,
      items: { type: 'string' },
    },
    criticalParts: {
      type: 'array',
      minItems: CRITICAL_PARTS.length,
      items: { type: 'string' },
    },
    states: {
      type: 'object',
      additionalProperties: stateReportSchema,
    },
    summary: {
      type: 'object',
      additionalProperties: false,
      required: ['pass', 'failedStates', 'warnStates', 'missingBaselines', 'exitCode'],
      properties: {
        pass: { type: 'boolean' },
        failedStates: { type: 'array', items: { type: 'string' } },
        warnStates: { type: 'array', items: { type: 'string' } },
        missingBaselines: { type: 'array', items: { type: 'string' } },
        exitCode: { type: 'number' },
      },
    },
  },
});

const validateCaptureCompiled = ajv.compile(captureSchemaV1);
const validateReportCompiled = ajv.compile(reportSchemaV1);

export function validateCaptureJson(value) {
  const ok = validateCaptureCompiled(value);
  return {
    valid: Boolean(ok),
    errors: validateCaptureCompiled.errors ?? [],
  };
}

export function validateReportJson(value) {
  const ok = validateReportCompiled(value);
  return {
    valid: Boolean(ok),
    errors: validateReportCompiled.errors ?? [],
  };
}

export async function readJson(filePath) {
  const text = await fs.readFile(path.resolve(process.cwd(), filePath), 'utf8');
  return JSON.parse(text);
}

export async function writeJson(filePath, data) {
  const abs = path.resolve(process.cwd(), filePath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, stableJson(data), 'utf8');
}

export function stableJson(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function ensureDir(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  await fs.mkdir(abs, { recursive: true });
  return abs;
}

export async function fileExists(filePath) {
  try {
    await fs.access(path.resolve(process.cwd(), filePath));
    return true;
  } catch {
    return false;
  }
}

export function normalizeText(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/\s+/g, ' ').trim();
}

export function sanitizeStateName(state) {
  return String(state)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-{2,}/g, '-');
}

export function toRelativeRect(rect, hostRect) {
  if (!rect || !hostRect) return null;
  if (hostRect.width <= 0 || hostRect.height <= 0) return null;
  return {
    x: clamp01((rect.x - hostRect.x) / hostRect.width),
    y: clamp01((rect.y - hostRect.y) / hostRect.height),
    width: clamp01(rect.width / hostRect.width),
    height: clamp01(rect.height / hostRect.height),
  };
}

function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function formatAjvErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return 'unknown schema validation error';
  return errors
    .map((err) => {
      const at = err.instancePath ? err.instancePath : '/';
      return `${at} ${err.message ?? 'invalid'}`;
    })
    .join('; ');
}

export function parseCsvList(rawValue, fallback = []) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') return [...fallback];
  return rawValue
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

export function parseKeyValueMap(rawValue) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') return {};
  const map = {};
  for (const token of rawValue.split(',')) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0 || idx >= trimmed.length - 1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!key || !value) continue;
    map[key] = value;
  }
  return map;
}

export function parseArgValue(argv, key, fallback) {
  const i = argv.findIndex((arg) => arg === `--${key}`);
  if (i < 0) return fallback;
  const value = argv[i + 1];
  if (!value || value.startsWith('--')) return fallback;
  return value;
}

export function lintOpsText(text) {
  const errors = [];
  const lineRegex = /^([A-Za-z_$][A-Za-z0-9_$]*\s*=\s*)?(I|C|U|R|M|D|G)\(.*\)\s*;?$/;

  const lines = String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!lineRegex.test(line)) {
      errors.push(`Line ${i + 1}: invalid operation syntax`);
    }
  }

  return { valid: errors.length === 0, errors, lineCount: lines.length };
}

export function relPathFromCwd(absPath) {
  const rel = path.relative(process.cwd(), absPath);
  if (!rel || rel.startsWith('..')) return absPath;
  return rel;
}


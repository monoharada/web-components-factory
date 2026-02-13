import { describe, expect, it } from 'vitest';

import {
  CRITICAL_PARTS,
  REQUIRED_STATES,
  lintOpsText,
  parseKeyValueMap,
  validateCaptureJson,
  validateReportJson,
} from '../scripts/design-sync/file-upload-shared.mjs';

function makeRect() {
  return { x: 0, y: 0, width: 640, height: 320 };
}

function makePart() {
  return {
    exists: true,
    bbox: makeRect(),
    relativeBBox: { x: 0.1, y: 0.1, width: 0.8, height: 0.2 },
    text: 'sample',
    computedStyle: {},
    attributes: {},
  };
}

function makeCaptureState(name: string, screenshotPath: string) {
  const parts = Object.fromEntries(CRITICAL_PARTS.map((part) => [part, makePart()]));
  return {
    name,
    screenshotPath,
    host: {
      bbox: makeRect(),
      text: 'host',
      computedStyle: {},
      attributes: {},
    },
    parts,
    notes: [],
  };
}

function makeReportState(name: string) {
  const parts = Object.fromEntries(
    CRITICAL_PARTS.map((part) => [
      part,
      {
        diffRatio: 0.01,
        pass: true,
        reason: null,
      },
    ]),
  );

  return {
    name,
    status: 'pass',
    baseline: {
      path: `resources/${name}.png`,
      source: 'test',
      missing: false,
    },
    diffRatio: 0.01,
    parts,
    gate: {
      globalPass: true,
      partsPass: true,
      pass: true,
    },
    messages: [],
    overlayPaths: {
      alpha: `tmp/${name}-alpha.png`,
      diff: `tmp/${name}-diff.png`,
    },
  };
}

describe('design-sync file-upload shared validators', () => {
  it('accepts valid capture.json schema', () => {
    const states = Object.fromEntries(
      REQUIRED_STATES.map((name) => [name, makeCaptureState(name, `tmp/${name}.png`)]),
    );
    const capture = {
      schemaVersion: 1,
      generatedAt: '2026-02-13T00:00:00.000Z',
      component: 'dads-file-upload',
      sourceUrl: 'http://localhost:3000/?nosw=1&component=fileUpload',
      requiredStates: [...REQUIRED_STATES],
      criticalParts: [...CRITICAL_PARTS],
      viewport: { width: 1280, height: 960 },
      states,
    };

    const validated = validateCaptureJson(capture);
    expect(validated.valid).toBe(true);
  });

  it('accepts valid report.json schema', () => {
    const states = Object.fromEntries(REQUIRED_STATES.map((name) => [name, makeReportState(name)]));
    const report = {
      schemaVersion: 1,
      generatedAt: '2026-02-13T00:00:00.000Z',
      component: 'dads-file-upload',
      capturePath: 'tmp/design-sync/file-upload/capture/capture.json',
      thresholds: {
        diffRatio: 0.05,
        partDiffRatio: 0.03,
      },
      baselinePolicy: {
        pocEndDate: '2026-02-20',
        failFrom: '2026-02-21T00:00:00+09:00',
        failOnMissingEnabled: false,
      },
      requiredStates: [...REQUIRED_STATES],
      criticalParts: [...CRITICAL_PARTS],
      states,
      summary: {
        pass: true,
        failedStates: [],
        warnStates: [],
        missingBaselines: [],
        exitCode: 0,
      },
    };

    const validated = validateReportJson(report);
    expect(validated.valid).toBe(true);
  });
});

describe('design-sync file-upload ops lint', () => {
  it('accepts one-line operation syntax', () => {
    const text = [
      'root=I(document, {"type":"frame","name":"root"})',
      'state=I(root, {"type":"text","content":"state"})',
      'U("abc123", {"content":"ok"})',
      'D("deadbeef")',
    ].join('\n');
    const lint = lintOpsText(text);
    expect(lint.valid).toBe(true);
    expect(lint.lineCount).toBe(4);
  });

  it('rejects invalid operation lines', () => {
    const lint = lintOpsText('const a = 1\nI()');
    expect(lint.valid).toBe(false);
    expect(lint.errors.length).toBeGreaterThan(0);
  });
});

describe('design-sync file-upload map parser', () => {
  it('parses comma separated key-value map', () => {
    const parsed = parseKeyValueMap('default=A,loading=B,error=C,empty=D');
    expect(parsed.default).toBe('A');
    expect(parsed.loading).toBe('B');
    expect(parsed.error).toBe('C');
    expect(parsed.empty).toBe('D');
  });
});


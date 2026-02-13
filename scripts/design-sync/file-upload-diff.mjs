#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import {
  BASELINE_MISSING_FAIL_FROM,
  CRITICAL_PARTS,
  DEFAULT_BASELINES_JSON_PATH,
  DEFAULT_CAPTURE_JSON_PATH,
  DEFAULT_REPORT_JSON_PATH,
  DEFAULT_REPORT_OVERLAYS_DIR,
  EXIT_CODES,
  REQUIRED_STATES,
  THRESHOLDS,
  ensureDir,
  fileExists,
  formatAjvErrors,
  parseArgValue,
  readJson,
  relPathFromCwd,
  stableJson,
  validateCaptureJson,
  validateReportJson,
} from './file-upload-shared.mjs';

const PIXEL_THRESHOLD = 16;
const BASELINE_POC_END_DATE = '2026-02-20';

function parseCli(argv) {
  return {
    captureJsonPath: parseArgValue(argv, 'capture-json', DEFAULT_CAPTURE_JSON_PATH),
    baselinesJsonPath: parseArgValue(argv, 'baselines-json', DEFAULT_BASELINES_JSON_PATH),
    reportJsonPath: parseArgValue(argv, 'report-json', DEFAULT_REPORT_JSON_PATH),
    overlaysDir: parseArgValue(argv, 'overlays-dir', DEFAULT_REPORT_OVERLAYS_DIR),
    threshold: Number.parseFloat(parseArgValue(argv, 'threshold', String(THRESHOLDS.diffRatio))),
    partThreshold: Number.parseFloat(parseArgValue(argv, 'part-threshold', String(THRESHOLDS.partDiffRatio))),
  };
}

function toBase64(pngBuffer) {
  return pngBuffer.toString('base64');
}

async function loadBuffer(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  return fs.readFile(abs);
}

function normalizePartRect(relativeRect, width, height) {
  if (!relativeRect) return null;
  const x = Math.max(0, Math.min(width - 1, Math.floor(relativeRect.x * width)));
  const y = Math.max(0, Math.min(height - 1, Math.floor(relativeRect.y * height)));
  const w = Math.max(1, Math.min(width - x, Math.ceil(relativeRect.width * width)));
  const h = Math.max(1, Math.min(height - y, Math.ceil(relativeRect.height * height)));
  return { x, y, width: w, height: h };
}

async function computeDiff(page, baselinePng, renderedPng, target, partRects) {
  const baselineB64 = toBase64(baselinePng);
  const renderedB64 = toBase64(renderedPng);

  return page.evaluate(
    async ({ baselineImageB64, renderedImageB64, width, height, threshold, parts }) => {
      const loadImage = (b64) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Image decode failed'));
          img.src = `data:image/png;base64,${b64}`;
        });

      const [baselineImg, renderedImg] = await Promise.all([
        loadImage(baselineImageB64),
        loadImage(renderedImageB64),
      ]);

      const createCanvas = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Missing canvas context');
        return { canvas, ctx };
      };

      const baselineCanvas = createCanvas();
      baselineCanvas.ctx.fillStyle = '#ffffff';
      baselineCanvas.ctx.fillRect(0, 0, width, height);
      baselineCanvas.ctx.drawImage(baselineImg, 0, 0, width, height);

      const renderedCanvas = createCanvas();
      renderedCanvas.ctx.fillStyle = '#ffffff';
      renderedCanvas.ctx.fillRect(0, 0, width, height);
      renderedCanvas.ctx.drawImage(renderedImg, 0, 0, width, height);

      const baselineData = baselineCanvas.ctx.getImageData(0, 0, width, height).data;
      const renderedData = renderedCanvas.ctx.getImageData(0, 0, width, height).data;

      let diffPixels = 0;
      for (let i = 0; i < baselineData.length; i += 4) {
        const dr = Math.abs(baselineData[i] - renderedData[i]);
        const dg = Math.abs(baselineData[i + 1] - renderedData[i + 1]);
        const db = Math.abs(baselineData[i + 2] - renderedData[i + 2]);
        const da = Math.abs(baselineData[i + 3] - renderedData[i + 3]);
        if (dr > threshold || dg > threshold || db > threshold || da > threshold) diffPixels += 1;
      }

      const totalPixels = width * height;
      const diffRatio = totalPixels > 0 ? diffPixels / totalPixels : 1;

      const partResults = {};
      for (const [name, rect] of Object.entries(parts)) {
        if (!rect) {
          partResults[name] = null;
          continue;
        }

        const startX = Math.max(0, Math.min(width - 1, rect.x));
        const startY = Math.max(0, Math.min(height - 1, rect.y));
        const endX = Math.min(width, startX + Math.max(1, rect.width));
        const endY = Math.min(height, startY + Math.max(1, rect.height));

        let regionDiff = 0;
        let regionPixels = 0;

        for (let y = startY; y < endY; y += 1) {
          for (let x = startX; x < endX; x += 1) {
            const idx = (y * width + x) * 4;
            const dr = Math.abs(baselineData[idx] - renderedData[idx]);
            const dg = Math.abs(baselineData[idx + 1] - renderedData[idx + 1]);
            const db = Math.abs(baselineData[idx + 2] - renderedData[idx + 2]);
            const da = Math.abs(baselineData[idx + 3] - renderedData[idx + 3]);
            if (dr > threshold || dg > threshold || db > threshold || da > threshold) regionDiff += 1;
            regionPixels += 1;
          }
        }

        partResults[name] = regionPixels > 0 ? regionDiff / regionPixels : 1;
      }

      const alphaCanvas = createCanvas();
      alphaCanvas.ctx.fillStyle = '#ffffff';
      alphaCanvas.ctx.fillRect(0, 0, width, height);
      alphaCanvas.ctx.globalAlpha = 0.55;
      alphaCanvas.ctx.drawImage(baselineImg, 0, 0, width, height);
      alphaCanvas.ctx.globalAlpha = 0.55;
      alphaCanvas.ctx.drawImage(renderedImg, 0, 0, width, height);
      alphaCanvas.ctx.globalAlpha = 1;

      const diffCanvas = createCanvas();
      diffCanvas.ctx.fillStyle = '#ffffff';
      diffCanvas.ctx.fillRect(0, 0, width, height);
      diffCanvas.ctx.drawImage(baselineImg, 0, 0, width, height);
      diffCanvas.ctx.globalCompositeOperation = 'difference';
      diffCanvas.ctx.drawImage(renderedImg, 0, 0, width, height);
      diffCanvas.ctx.globalCompositeOperation = 'source-over';

      return {
        diffRatio,
        partResults,
        alphaDataUrl: alphaCanvas.canvas.toDataURL('image/png'),
        diffDataUrl: diffCanvas.canvas.toDataURL('image/png'),
      };
    },
    {
      baselineImageB64: baselineB64,
      renderedImageB64: renderedB64,
      width: target.width,
      height: target.height,
      threshold: PIXEL_THRESHOLD,
      parts: partRects,
    },
  );
}

function decodeDataUrl(dataUrl) {
  const encoded = String(dataUrl).split(',')[1] ?? '';
  return Buffer.from(encoded, 'base64');
}

function isBaselineMissingFailEnabled(now = Date.now()) {
  const failFrom = Date.parse(BASELINE_MISSING_FAIL_FROM);
  return Number.isFinite(failFrom) ? now >= failFrom : false;
}

async function main() {
  const cli = parseCli(process.argv.slice(2));
  const capture = await readJson(cli.captureJsonPath);
  const captureShape = validateCaptureJson(capture);
  if (!captureShape.valid) {
    throw new Error(`Invalid capture.json schema: ${formatAjvErrors(captureShape.errors)}`);
  }

  const baselines = await readJson(cli.baselinesJsonPath);
  const overlaysAbsDir = await ensureDir(cli.overlaysDir);

  const failOnMissingBaseline = isBaselineMissingFailEnabled();
  const statesReport = {};
  const failedStates = [];
  const warnStates = [];
  const missingBaselines = [];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');

  try {
    const requiredStates = Array.isArray(capture.requiredStates) ? capture.requiredStates : REQUIRED_STATES;

    for (const stateName of requiredStates) {
      const captureState = capture.states?.[stateName];
      const baselineDef = baselines?.states?.[stateName];
      const stateMessages = [];

      if (!captureState) {
        statesReport[stateName] = {
          name: stateName,
          status: 'fail',
          baseline: {
            path: baselineDef?.path ?? null,
            source: baselineDef?.source ?? null,
            missing: !baselineDef,
          },
          diffRatio: null,
          parts: Object.fromEntries(CRITICAL_PARTS.map((part) => [part, { diffRatio: null, pass: false, reason: 'capture missing' }])),
          gate: { globalPass: false, partsPass: false, pass: false },
          messages: ['capture.json に状態が存在しません'],
          overlayPaths: { alpha: null, diff: null },
        };
        failedStates.push(stateName);
        continue;
      }

      const baselinePath = baselineDef?.path ? String(baselineDef.path) : null;
      const baselineSource = baselineDef?.source ? String(baselineDef.source) : null;
      const baselineExists = baselinePath ? await fileExists(baselinePath) : false;

      if (!baselinePath || !baselineExists) {
        const missingMessage = baselinePath
          ? `baseline not found: ${baselinePath}`
          : 'baseline path is not defined';
        stateMessages.push(missingMessage);
        missingBaselines.push(stateName);

        const shouldFail = failOnMissingBaseline;
        statesReport[stateName] = {
          name: stateName,
          status: shouldFail ? 'fail' : 'warn',
          baseline: {
            path: baselinePath,
            source: baselineSource,
            missing: true,
          },
          diffRatio: null,
          parts: Object.fromEntries(
            CRITICAL_PARTS.map((part) => [part, { diffRatio: null, pass: !shouldFail, reason: 'baseline missing' }]),
          ),
          gate: { globalPass: !shouldFail, partsPass: !shouldFail, pass: !shouldFail },
          messages: stateMessages,
          overlayPaths: { alpha: null, diff: null },
        };

        if (shouldFail) failedStates.push(stateName);
        else warnStates.push(stateName);
        continue;
      }

      const hostRect = captureState.host?.bbox;
      if (!hostRect || hostRect.width <= 0 || hostRect.height <= 0) {
        statesReport[stateName] = {
          name: stateName,
          status: 'fail',
          baseline: {
            path: baselinePath,
            source: baselineSource,
            missing: false,
          },
          diffRatio: null,
          parts: Object.fromEntries(CRITICAL_PARTS.map((part) => [part, { diffRatio: null, pass: false, reason: 'invalid host bbox' }])),
          gate: { globalPass: false, partsPass: false, pass: false },
          messages: ['capture host bbox が不正です'],
          overlayPaths: { alpha: null, diff: null },
        };
        failedStates.push(stateName);
        continue;
      }

      const renderedPath = captureState.screenshotPath;
      const renderedExists = await fileExists(renderedPath);
      if (!renderedExists) {
        statesReport[stateName] = {
          name: stateName,
          status: 'fail',
          baseline: {
            path: baselinePath,
            source: baselineSource,
            missing: false,
          },
          diffRatio: null,
          parts: Object.fromEntries(CRITICAL_PARTS.map((part) => [part, { diffRatio: null, pass: false, reason: 'rendered image missing' }])),
          gate: { globalPass: false, partsPass: false, pass: false },
          messages: [`rendered image not found: ${renderedPath}`],
          overlayPaths: { alpha: null, diff: null },
        };
        failedStates.push(stateName);
        continue;
      }

      const target = {
        width: Math.max(1, Math.round(hostRect.width)),
        height: Math.max(1, Math.round(hostRect.height)),
      };

      const partRects = {};
      for (const partName of CRITICAL_PARTS) {
        const relRect = captureState.parts?.[partName]?.relativeBBox ?? null;
        partRects[partName] = normalizePartRect(relRect, target.width, target.height);
      }

      const [baselinePng, renderedPng] = await Promise.all([
        loadBuffer(baselinePath),
        loadBuffer(renderedPath),
      ]);

      const diff = await computeDiff(page, baselinePng, renderedPng, target, partRects);

      const overlayAlphaPath = path.join(overlaysAbsDir, `${stateName}-alpha.png`);
      const overlayDiffPath = path.join(overlaysAbsDir, `${stateName}-diff.png`);
      await fs.writeFile(overlayAlphaPath, decodeDataUrl(diff.alphaDataUrl));
      await fs.writeFile(overlayDiffPath, decodeDataUrl(diff.diffDataUrl));

      const globalPass = diff.diffRatio <= cli.threshold;
      if (!globalPass) {
        stateMessages.push(`diffRatio ${diff.diffRatio.toFixed(4)} > ${cli.threshold.toFixed(4)}`);
      }

      const partsResult = {};
      let partsPass = true;
      for (const partName of CRITICAL_PARTS) {
        const ratio = diff.partResults?.[partName];
        const partExistsInCapture = Boolean(captureState.parts?.[partName]?.exists);
        if (!partExistsInCapture) {
          partsResult[partName] = {
            diffRatio: null,
            pass: false,
            reason: 'part not captured',
          };
          partsPass = false;
          stateMessages.push(`critical part missing in capture: ${partName}`);
          continue;
        }

        if (typeof ratio !== 'number' || !Number.isFinite(ratio)) {
          partsResult[partName] = {
            diffRatio: null,
            pass: false,
            reason: 'part diff unavailable',
          };
          partsPass = false;
          stateMessages.push(`critical part diff unavailable: ${partName}`);
          continue;
        }

        const pass = ratio <= cli.partThreshold;
        if (!pass) {
          stateMessages.push(`part ${partName} diff ${ratio.toFixed(4)} > ${cli.partThreshold.toFixed(4)}`);
        }
        partsResult[partName] = {
          diffRatio: ratio,
          pass,
          reason: pass ? null : 'threshold exceeded',
        };
        if (!pass) partsPass = false;
      }

      const pass = globalPass && partsPass;
      statesReport[stateName] = {
        name: stateName,
        status: pass ? 'pass' : 'fail',
        baseline: {
          path: baselinePath,
          source: baselineSource,
          missing: false,
        },
        diffRatio: diff.diffRatio,
        parts: partsResult,
        gate: {
          globalPass,
          partsPass,
          pass,
        },
        messages: stateMessages,
        overlayPaths: {
          alpha: relPathFromCwd(overlayAlphaPath),
          diff: relPathFromCwd(overlayDiffPath),
        },
      };

      if (!pass) failedStates.push(stateName);
    }
  } finally {
    await browser.close();
  }

  const exitCode = failedStates.length > 0 ? EXIT_CODES.fidelityFailure : EXIT_CODES.success;
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    component: 'dads-file-upload',
    capturePath: cli.captureJsonPath,
    thresholds: {
      diffRatio: cli.threshold,
      partDiffRatio: cli.partThreshold,
    },
    baselinePolicy: {
      pocEndDate: BASELINE_POC_END_DATE,
      failFrom: BASELINE_MISSING_FAIL_FROM,
      failOnMissingEnabled: isBaselineMissingFailEnabled(),
    },
    requiredStates: REQUIRED_STATES,
    criticalParts: CRITICAL_PARTS,
    states: statesReport,
    summary: {
      pass: exitCode === EXIT_CODES.success,
      failedStates,
      warnStates,
      missingBaselines,
      exitCode,
    },
  };

  const reportShape = validateReportJson(report);
  if (!reportShape.valid) {
    throw new Error(`Invalid report.json schema: ${formatAjvErrors(reportShape.errors)}`);
  }

  const reportAbsPath = path.resolve(process.cwd(), cli.reportJsonPath);
  await fs.mkdir(path.dirname(reportAbsPath), { recursive: true });
  await fs.writeFile(reportAbsPath, stableJson(report), 'utf8');

  console.log(`[design-sync:file-upload:diff] wrote ${relPathFromCwd(reportAbsPath)}`);
  console.log(`[design-sync:file-upload:diff] failed: ${failedStates.length}, warnings: ${warnStates.length}`);
  if (missingBaselines.length > 0) {
    console.log(`[design-sync:file-upload:diff] missing baselines: ${missingBaselines.join(', ')}`);
  }

  process.exit(exitCode);
}

main().catch((err) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  console.error(`[design-sync:file-upload:diff] ${message}`);
  process.exit(EXIT_CODES.fidelityFailure);
});


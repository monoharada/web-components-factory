#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DEFAULT_CAPTURE_JSON_PATH,
  DEFAULT_OPS_DIR,
  DEFAULT_REPORT_JSON_PATH,
  EXIT_CODES,
  THRESHOLDS,
  formatAjvErrors,
  lintOpsText,
  normalizeText,
  parseArgValue,
  readJson,
  relPathFromCwd,
  validateCaptureJson,
  validateReportJson,
} from './file-upload-shared.mjs';

function parseCli(argv) {
  return {
    captureJsonPath: parseArgValue(argv, 'capture-json', DEFAULT_CAPTURE_JSON_PATH),
    reportJsonPath: parseArgValue(argv, 'report-json', DEFAULT_REPORT_JSON_PATH),
    opsDir: parseArgValue(argv, 'ops-dir', DEFAULT_OPS_DIR),
    reusableId: parseArgValue(argv, 'reusable-id', '__REUSABLE_ID__'),
    defaultVariantId: parseArgValue(argv, 'default-variant-id', ''),
    errorVariantId: parseArgValue(argv, 'error-variant-id', ''),
    disabledVariantId: parseArgValue(argv, 'disabled-variant-id', ''),
    buttonOnlyVariantId: parseArgValue(argv, 'button-only-variant-id', ''),
    fullscreenVariantId: parseArgValue(argv, 'fullscreen-variant-id', ''),
  };
}

function asNodeString(value, fallback) {
  const text = normalizeText(String(value ?? ''));
  return text.length > 0 ? text : fallback;
}

function inferCopyText(capture, key, fallback) {
  const defaultState = capture.states?.default;
  const errorState = capture.states?.['error-required'];

  if (key === 'label') return asNodeString(defaultState?.host?.attributes?.label, fallback);
  if (key === 'support') return asNodeString(defaultState?.host?.attributes?.['support-text'], fallback);
  if (key === 'browse')
    return asNodeString(defaultState?.parts?.['browse-button']?.text, fallback);
  if (key === 'dropHint')
    return asNodeString(defaultState?.host?.attributes?.['drop-hint'], fallback);
  if (key === 'emptyText')
    return asNodeString(defaultState?.host?.attributes?.['empty-text'], fallback);
  if (key === 'errorText')
    return asNodeString(errorState?.parts?.['error-text']?.text, fallback);
  return fallback;
}

function buildReusableOps(capture) {
  const defaultState = capture.states?.default;
  const hostWidth = Math.max(480, Math.round(defaultState?.host?.bbox?.width ?? 768));
  const dropzoneStyle = defaultState?.parts?.dropzone?.computedStyle ?? {};

  const labelText = inferCopyText(capture, 'label', 'ファイルアップロード');
  const supportText = inferCopyText(capture, 'support', 'PDF / JPEG / PNG をアップロードできます。');
  const browseText = inferCopyText(capture, 'browse', 'ファイルを選択');
  const dropHintText = inferCopyText(capture, 'dropHint', 'または、このエリア内にドラッグ＆ドロップ');
  const emptyText = inferCopyText(capture, 'emptyText', 'ファイルが選択されていません');
  const errorText = inferCopyText(capture, 'errorText', 'ファイルを選択してください');

  const strokeColor = asNodeString(dropzoneStyle.borderTopColor, '#8c8c8c');
  const dropzoneBg = asNodeString(dropzoneStyle.backgroundColor, '#ffffff');

  const ops = [
    `kitRoot=I(document, ${JSON.stringify({
      type: 'frame',
      name: 'fallback-file-upload-kit',
      layout: 'vertical',
      gap: 16,
      padding: 24,
      width: hostWidth + 80,
      placeholder: true,
    })})`,
    `fileUploadComp=I(kitRoot, ${JSON.stringify({
      type: 'frame',
      name: 'dads-file-upload',
      reusable: true,
      layout: 'vertical',
      gap: 10,
      padding: 16,
      width: hostWidth,
      placeholder: true,
      stroke: '#d1d5db',
      cornerRadius: 8,
      fill: '#ffffff',
    })})`,
    `label=I(fileUploadComp, ${JSON.stringify({
      type: 'text',
      name: 'label',
      content: labelText,
      fontSize: 16,
      fontWeight: '700',
      textColor: '#1f2937',
    })})`,
    `support=I(fileUploadComp, ${JSON.stringify({
      type: 'text',
      name: 'support-text',
      content: supportText,
      fontSize: 14,
      textColor: '#4b5563',
    })})`,
    `dropzone=I(fileUploadComp, ${JSON.stringify({
      type: 'frame',
      name: 'dropzone',
      layout: 'vertical',
      gap: 12,
      padding: 16,
      width: 'fill_container',
      placeholder: true,
      stroke: strokeColor,
      cornerRadius: 8,
      fill: dropzoneBg,
    })})`,
    `dropMain=I(dropzone, ${JSON.stringify({
      type: 'frame',
      name: 'drop-main',
      layout: 'horizontal',
      gap: 12,
      width: 'fill_container',
      placeholder: true,
    })})`,
    `browseButton=I(dropMain, ${JSON.stringify({
      type: 'frame',
      name: 'browse-button',
      layout: 'horizontal',
      padding: 10,
      fill: '#1d4ed8',
      cornerRadius: 8,
      placeholder: true,
    })})`,
    `browseLabel=I(browseButton, ${JSON.stringify({
      type: 'text',
      name: 'browse-label',
      content: browseText,
      fontSize: 14,
      fontWeight: '700',
      textColor: '#ffffff',
    })})`,
    `dropHint=I(dropMain, ${JSON.stringify({
      type: 'text',
      name: 'drop-hint',
      content: dropHintText,
      fontSize: 14,
      textColor: '#374151',
    })})`,
    `errorText=I(dropzone, ${JSON.stringify({
      type: 'text',
      name: 'error-text',
      content: errorText,
      fontSize: 14,
      textColor: '#b42318',
    })})`,
    `emptyText=I(fileUploadComp, ${JSON.stringify({
      type: 'text',
      name: 'empty-text',
      content: emptyText,
      fontSize: 14,
      textColor: '#111827',
    })})`,
    `fileList=I(fileUploadComp, ${JSON.stringify({
      type: 'frame',
      name: 'file-list',
      layout: 'vertical',
      gap: 8,
      width: 'fill_container',
      placeholder: true,
      padding: 8,
      stroke: '#e5e7eb',
      cornerRadius: 6,
    })})`,
  ];

  return ops.join('\n');
}

function buildInsertStatesOps(variants, capture, report) {
  const defaultWidth = Math.max(480, Math.round(capture.states?.default?.host?.bbox?.width ?? 768));
  const fidelityHint =
    report.summary?.pass === true
      ? `fidelity <= ${THRESHOLDS.diffRatio}`
      : `needs-fidelity-fix (target ${THRESHOLDS.diffRatio})`;

  const ops = [
    `statesRoot=I(document, ${JSON.stringify({
      type: 'frame',
      name: 'fallback-file-upload-required-states',
      layout: 'vertical',
      gap: 16,
      padding: 24,
      width: 2 * defaultWidth + 96,
      placeholder: true,
      fill: '#f8fafc',
      cornerRadius: 12,
    })})`,
    `fidelityNote=I(statesRoot, ${JSON.stringify({
      type: 'text',
      name: 'fidelity-note',
      content: fidelityHint,
      fontSize: 12,
      textColor: '#374151',
    })})`,
    `rowTop=I(statesRoot, ${JSON.stringify({
      type: 'frame',
      name: 'states-row-top',
      layout: 'horizontal',
      gap: 16,
      width: 'fill_container',
      placeholder: true,
    })})`,
    `rowBottom=I(statesRoot, ${JSON.stringify({
      type: 'frame',
      name: 'states-row-bottom',
      layout: 'horizontal',
      gap: 16,
      width: 'fill_container',
      placeholder: true,
    })})`,
    `cardDefault=I(rowTop, ${JSON.stringify({
      type: 'frame',
      name: 'state-default',
      layout: 'vertical',
      gap: 8,
      width: 'fill_container',
      padding: 12,
      placeholder: true,
      stroke: '#cbd5e1',
      cornerRadius: 8,
      fill: '#ffffff',
    })})`,
    `titleDefault=I(cardDefault, ${JSON.stringify({ type: 'text', content: 'default', fontSize: 14, fontWeight: '700' })})`,
    `instanceDefault=I(cardDefault, ${JSON.stringify({ type: 'ref', ref: String(variants.default), width: 'fill_container' })})`,
    `cardError=I(rowTop, ${JSON.stringify({
      type: 'frame',
      name: 'state-error-required',
      layout: 'vertical',
      gap: 8,
      width: 'fill_container',
      padding: 12,
      placeholder: true,
      stroke: '#fecaca',
      cornerRadius: 8,
      fill: '#fff7ed',
    })})`,
    `titleError=I(cardError, ${JSON.stringify({ type: 'text', content: 'error-required', fontSize: 14, fontWeight: '700' })})`,
    `instanceError=I(cardError, ${JSON.stringify({ type: 'ref', ref: String(variants.errorRequired), width: 'fill_container' })})`,
    `cardDisabled=I(rowBottom, ${JSON.stringify({
      type: 'frame',
      name: 'state-disabled',
      layout: 'vertical',
      gap: 8,
      width: 'fill_container',
      padding: 12,
      placeholder: true,
      stroke: '#cbd5e1',
      cornerRadius: 8,
      fill: '#f8fafc',
    })})`,
    `titleDisabled=I(cardDisabled, ${JSON.stringify({ type: 'text', content: 'disabled', fontSize: 14, fontWeight: '700' })})`,
    `instanceDisabled=I(cardDisabled, ${JSON.stringify({ type: 'ref', ref: String(variants.disabled), width: 'fill_container' })})`,
    `cardButtonOnly=I(rowBottom, ${JSON.stringify({
      type: 'frame',
      name: 'state-button-only',
      layout: 'vertical',
      gap: 8,
      width: 'fill_container',
      padding: 12,
      placeholder: true,
      stroke: '#cbd5e1',
      cornerRadius: 8,
      fill: '#ffffff',
    })})`,
    `titleButtonOnly=I(cardButtonOnly, ${JSON.stringify({ type: 'text', content: 'button-only', fontSize: 14, fontWeight: '700' })})`,
    `instanceButtonOnly=I(cardButtonOnly, ${JSON.stringify({ type: 'ref', ref: String(variants.buttonOnly), width: 'fill_container' })})`,
    `cardDragover=I(statesRoot, ${JSON.stringify({
      type: 'frame',
      name: 'state-fullscreen-dragover',
      layout: 'vertical',
      gap: 8,
      width: 'fill_container',
      padding: 12,
      placeholder: true,
      stroke: '#93c5fd',
      cornerRadius: 8,
      fill: '#eff6ff',
    })})`,
    `titleDragover=I(cardDragover, ${JSON.stringify({
      type: 'text',
      content: 'fullscreen-dragover',
      fontSize: 14,
      fontWeight: '700',
    })})`,
    `instanceDragover=I(cardDragover, ${JSON.stringify({ type: 'ref', ref: String(variants.fullscreenDragover), width: 'fill_container' })})`,
  ];

  return ops.join('\n');
}

async function writeOpsFile(filePath, text) {
  const lint = lintOpsText(text);
  if (!lint.valid) {
    throw new Error(`Invalid ops syntax: ${lint.errors.join('; ')}`);
  }
  if (lint.lineCount > 25) {
    throw new Error(`Ops limit exceeded: ${lint.lineCount} lines (max 25)`);
  }
  const abs = path.resolve(process.cwd(), filePath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, `${text.trim()}\n`, 'utf8');
  return abs;
}

async function main() {
  const cli = parseCli(process.argv.slice(2));
  const [capture, report] = await Promise.all([readJson(cli.captureJsonPath), readJson(cli.reportJsonPath)]);

  const captureShape = validateCaptureJson(capture);
  if (!captureShape.valid) {
    throw new Error(`Invalid capture.json: ${formatAjvErrors(captureShape.errors)}`);
  }
  const reportShape = validateReportJson(report);
  if (!reportShape.valid) {
    throw new Error(`Invalid report.json: ${formatAjvErrors(reportShape.errors)}`);
  }

  const variants = {
    default: cli.defaultVariantId || cli.reusableId,
    errorRequired: cli.errorVariantId || cli.reusableId,
    disabled: cli.disabledVariantId || cli.reusableId,
    buttonOnly: cli.buttonOnlyVariantId || cli.reusableId,
    fullscreenDragover: cli.fullscreenVariantId || cli.reusableId,
  };

  const createReusableText = buildReusableOps(capture);
  const insertStatesText = buildInsertStatesOps(variants, capture, report);

  const createReusablePath = path.join(cli.opsDir, '01-create-reusable.ops');
  const insertStatesPath = path.join(cli.opsDir, '02-insert-states.ops');

  const [createAbs, insertAbs] = await Promise.all([
    writeOpsFile(createReusablePath, createReusableText),
    writeOpsFile(insertStatesPath, insertStatesText),
  ]);

  console.log(`[design-sync:file-upload:ops] wrote ${relPathFromCwd(createAbs)}`);
  console.log(`[design-sync:file-upload:ops] wrote ${relPathFromCwd(insertAbs)}`);
}

main().catch((err) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  console.error(`[design-sync:file-upload:ops] ${message}`);
  process.exit(EXIT_CODES.opsFailure);
});

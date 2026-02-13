#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DEFAULT_OPS_DIR,
  EXIT_CODES,
  lintOpsText,
  parseArgValue,
  parseKeyValueMap,
  relPathFromCwd,
} from './file-upload-shared.mjs';

function parseCli(argv) {
  return {
    parentMapRaw: parseArgValue(argv, 'parent-map', ''),
    variantMapRaw: parseArgValue(argv, 'variant-map', ''),
    outputPath: parseArgValue(argv, 'output', path.join(DEFAULT_OPS_DIR, '03-chat-compose-replace.ops')),
  };
}

function requireParentMap(map) {
  const required = ['default', 'loading', 'error', 'empty'];
  const missing = required.filter((key) => !map[key]);
  if (missing.length > 0) {
    throw new Error(`--parent-map is missing keys: ${missing.join(', ')}`);
  }
}

function buildVariantMap(rawMap) {
  const parsed = parseKeyValueMap(rawMap);
  return {
    default: parsed.default ?? '__FILE_UPLOAD_DEFAULT_VARIANT_ID__',
    disabled: parsed.disabled ?? '__FILE_UPLOAD_DISABLED_VARIANT_ID__',
    'error-required': parsed['error-required'] ?? '__FILE_UPLOAD_ERROR_REQUIRED_VARIANT_ID__',
  };
}

function buildOps(parentMap, variants) {
  const entries = [
    { state: 'default', parent: parentMap.default, variant: variants.default, title: 'state-default / file-upload' },
    { state: 'loading', parent: parentMap.loading, variant: variants.disabled, title: 'state-loading / file-upload(disabled)' },
    { state: 'error', parent: parentMap.error, variant: variants['error-required'], title: 'state-error / file-upload(error-required)' },
    { state: 'empty', parent: parentMap.empty, variant: variants.default, title: 'state-empty / file-upload(default)' },
  ];

  const ops = [];

  for (const entry of entries) {
    const key = entry.state.replace(/[^a-z0-9]+/gi, '');
    ops.push(
      `slot${key}=I(${JSON.stringify(entry.parent)}, ${JSON.stringify({
        type: 'frame',
        name: `fallback-file-upload-slot-${entry.state}`,
        layout: 'vertical',
        gap: 8,
        width: 'fill_container',
        placeholder: true,
      })})`,
    );
    ops.push(
      `title${key}=I(slot${key}, ${JSON.stringify({
        type: 'text',
        name: `fallback-file-upload-label-${entry.state}`,
        content: entry.title,
        fontSize: 12,
        textColor: '#4b5563',
      })})`,
    );
    ops.push(
      `fileUpload${key}=I(slot${key}, ${JSON.stringify({
        type: 'ref',
        ref: entry.variant,
        width: 'fill_container',
      })})`,
    );
  }

  return ops.join('\n');
}

async function writeOps(filePath, text) {
  const lint = lintOpsText(text);
  if (!lint.valid) {
    throw new Error(`invalid ops syntax: ${lint.errors.join('; ')}`);
  }
  if (lint.lineCount > 25) {
    throw new Error(`ops line count exceeds 25: ${lint.lineCount}`);
  }

  const abs = path.resolve(process.cwd(), filePath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, `${text.trim()}\n`, 'utf8');
  return abs;
}

async function main() {
  const cli = parseCli(process.argv.slice(2));
  const parentMap = parseKeyValueMap(cli.parentMapRaw);
  requireParentMap(parentMap);

  const variantMap = buildVariantMap(cli.variantMapRaw);
  const opsText = buildOps(parentMap, variantMap);
  const outputAbs = await writeOps(cli.outputPath, opsText);

  console.log(`[design-sync:file-upload:chat-ops] wrote ${relPathFromCwd(outputAbs)}`);
  console.log(
    `[design-sync:file-upload:chat-ops] mapping loading->${variantMap.disabled}, error->${variantMap['error-required']}`,
  );
}

main().catch((err) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  console.error(`[design-sync:file-upload:chat-ops] ${message}`);
  process.exit(EXIT_CODES.opsFailure);
});


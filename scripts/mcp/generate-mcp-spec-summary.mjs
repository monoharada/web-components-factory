#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FIGMA_TO_WCF_PROMPT, BUILD_PAGE_PROMPT, PACKAGE_VERSION, WCF_RESOURCE_URIS } from '../../packages/mcp-server/core/constants.mjs';
import { BUILTIN_TOOL_NAMES } from '../../packages/mcp-server/core/plugins.mjs';
import { collectResponseSizeReport } from './check-response-size.mjs';
import { verifyReadmeExamples } from './verify-readme-examples.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
export const DEFAULT_OUTPUT = path.join(ROOT, 'packages/mcp-server/mcp-spec-test/summary/v3-final.json');

function parseArgs(argv) {
  let write = false;
  let check = false;
  let outputPath = DEFAULT_OUTPUT;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      write = true;
      continue;
    }
    if (arg === '--check') {
      check = true;
      continue;
    }
    if (arg === '--out') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--out requires a file path');
      }
      outputPath = path.resolve(value);
      index += 1;
      continue;
    }
    if (arg.startsWith('--out=')) {
      outputPath = path.resolve(arg.slice('--out='.length));
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return { write, check, outputPath };
}

export async function buildMcpSpecSummary() {
  const [responseSize, readmeExamples] = await Promise.all([
    collectResponseSizeReport(),
    verifyReadmeExamples(),
  ]);

  return {
    schemaVersion: '1.0',
    package: {
      name: '@monoharada/wcf-mcp',
      version: PACKAGE_VERSION,
    },
    inventory: {
      tools: [...BUILTIN_TOOL_NAMES].sort(),
      toolCount: BUILTIN_TOOL_NAMES.size,
      prompts: [BUILD_PAGE_PROMPT, FIGMA_TO_WCF_PROMPT],
      promptCount: 2,
      resources: Object.values(WCF_RESOURCE_URIS).sort(),
      resourceCount: Object.keys(WCF_RESOURCE_URIS).length,
    },
    checks: {
      responseSize: {
        schemaVersion: responseSize.schemaVersion,
        thresholds: responseSize.thresholds,
        summary: {
          status: responseSize.summary.status,
          totalChecks: responseSize.summary.totalChecks,
          failedChecks: responseSize.summary.failedChecks,
          p95Status: responseSize.summary.p95Status,
        },
        checks: responseSize.checks.map((check) => ({
          label: check.label,
          status: check.status,
          bytes: check.bytes,
          sizeKb: check.sizeKb,
        })),
      },
      readmeExamples: {
        status: readmeExamples.errorCount === 0 ? 'OK' : 'NG',
        blocksChecked: readmeExamples.blocksChecked,
        requestBlocks: readmeExamples.requestBlocks,
        errorCount: readmeExamples.errorCount,
      },
    },
  };
}

async function writeSummary(summary, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
}

async function checkSummary(summary, outputPath) {
  const actual = await fs.readFile(outputPath, 'utf8');
  const normalizedActual = JSON.stringify(JSON.parse(actual));
  const normalizedExpected = JSON.stringify(summary);
  if (normalizedActual !== normalizedExpected) {
    throw new Error(`Summary drift detected: ${outputPath}`);
  }
}

export async function main(argv = process.argv.slice(2)) {
  const { write, check, outputPath } = parseArgs(argv);
  const summary = await buildMcpSpecSummary();

  if (check) {
    await checkSummary(summary, outputPath);
    console.log(`MCP summary is up to date: ${outputPath}`);
    return;
  }

  if (write) {
    await writeSummary(summary, outputPath);
    console.log(`Wrote MCP summary: ${outputPath}`);
    return;
  }

  console.log(JSON.stringify(summary, null, 2));
}

const directRunArg = process.argv[1];
const isDirectRun =
  typeof directRunArg === 'string' &&
  pathToFileURL(path.resolve(directRunArg)).href === import.meta.url;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

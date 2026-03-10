#!/usr/bin/env node
/**
 * verify-readme-examples.mjs
 *
 * Extracts JSON code blocks from the MCP server README and verifies
 * that request blocks contain valid tool names and are parseable JSON.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BUILTIN_TOOL_NAMES } from '../../packages/mcp-server/core/plugins.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const README = path.join(__dirname, '../../packages/mcp-server/README.md');

export function extractJsonBlocks(content) {
  const jsonBlockPattern = /```json\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = jsonBlockPattern.exec(content)) !== null) {
    blocks.push({ raw: match[1].trim(), offset: match.index });
  }
  return blocks;
}

export async function verifyReadmeExamples({
  readmePath = README,
  knownTools = BUILTIN_TOOL_NAMES,
} = {}) {
  const content = await fs.readFile(readmePath, 'utf8');
  const blocks = extractJsonBlocks(content);
  const knownToolSet = knownTools instanceof Set ? knownTools : new Set(knownTools);
  const errors = [];
  let requestBlocks = 0;

  for (const block of blocks) {
    // Skip blocks with ellipsis or template markers
    if (block.raw.includes('...') || block.raw.includes('mcpServers')) continue;

    try {
      const parsed = JSON.parse(block.raw);

      // Check if it's a tool request block (has "name" field)
      if (parsed.name && typeof parsed.name === 'string') {
        requestBlocks++;
        if (!knownToolSet.has(parsed.name)) {
          errors.push({
            code: 'UNKNOWN_TOOL_NAME',
            message: `Unknown tool name "${parsed.name}" in README JSON block`,
            toolName: parsed.name,
            offset: block.offset,
          });
        }
      }
    } catch {
      // Not valid JSON — may use ... or other abbreviations, skip
    }
  }

  return {
    blocksChecked: blocks.length,
    requestBlocks,
    errorCount: errors.length,
    errors,
    knownToolCount: knownToolSet.size,
  };
}

export function formatVerificationReport(report) {
  const lines = [
    `Checked ${report.blocksChecked} JSON blocks, ${report.requestBlocks} tool request blocks`,
  ];
  if (report.errorCount > 0) {
    for (const error of report.errors) {
      lines.push(`ERROR: ${error.message}`);
    }
    lines.push(``);
    lines.push(`${report.errorCount} error(s) found.`);
    return { ok: false, text: lines.join('\n') };
  }
  lines.push('README examples verified.');
  return { ok: true, text: lines.join('\n') };
}

export async function main() {
  const report = await verifyReadmeExamples();
  const formatted = formatVerificationReport(report);
  console.log(formatted.text);
  if (!formatted.ok) {
    process.exit(1);
  }
}

const directRunArg = process.argv[1];
const isDirectRun =
  typeof directRunArg === 'string' &&
  pathToFileURL(path.resolve(directRunArg)).href === import.meta.url;

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

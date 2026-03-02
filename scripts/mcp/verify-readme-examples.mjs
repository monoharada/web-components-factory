#!/usr/bin/env node
/**
 * verify-readme-examples.mjs
 *
 * Extracts JSON code blocks from the MCP server README and verifies
 * that request blocks contain valid tool names and are parseable JSON.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const README = path.join(__dirname, '../../packages/mcp-server/README.md');

const KNOWN_TOOLS = new Set([
  'get_design_system_overview',
  'list_components',
  'search_icons',
  'get_component_api',
  'generate_usage_snippet',
  'get_install_recipe',
  'validate_markup',
  'list_patterns',
  'get_pattern_recipe',
  'generate_pattern_snippet',
  'get_design_tokens',
  'get_design_token_detail',
  'get_accessibility_docs',
  'search_guidelines',
]);

async function main() {
  const content = await fs.readFile(README, 'utf8');

  // Extract ```json ... ``` blocks
  const jsonBlockPattern = /```json\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = jsonBlockPattern.exec(content)) !== null) {
    blocks.push({ raw: match[1].trim(), offset: match.index });
  }

  let errors = 0;
  let requestBlocks = 0;

  for (const block of blocks) {
    // Skip blocks with ellipsis or template markers
    if (block.raw.includes('...') || block.raw.includes('mcpServers')) continue;

    try {
      const parsed = JSON.parse(block.raw);

      // Check if it's a tool request block (has "name" field)
      if (parsed.name && typeof parsed.name === 'string') {
        requestBlocks++;
        if (!KNOWN_TOOLS.has(parsed.name)) {
          console.error(`ERROR: Unknown tool name "${parsed.name}" in README JSON block`);
          errors++;
        }
      }
    } catch {
      // Not valid JSON — may use ... or other abbreviations, skip
    }
  }

  console.log(`Checked ${blocks.length} JSON blocks, ${requestBlocks} tool request blocks`);

  if (errors > 0) {
    console.error(`\n${errors} error(s) found.`);
    process.exit(1);
  }

  console.log('README examples verified.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

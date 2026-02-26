#!/usr/bin/env node
/**
 * extract-design-tokens.mjs
 *
 * Extracts CSS custom properties from design token TypeScript source files
 * and generates a structured JSON file for the MCP server.
 *
 * Input:
 *   - packages/styles/design-tokens/index.ts
 *   - packages/styles/spacing-tokens.ts
 *
 * Output:
 *   - packages/mcp-server/data/design-tokens.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const OUTPUT = path.join(ROOT, 'packages/mcp-server/data/design-tokens.json');

// ---------------------------------------------------------------------------
// Source files
// ---------------------------------------------------------------------------

const SOURCES = [
  path.join(ROOT, 'packages/styles/design-tokens/index.ts'),
  path.join(ROOT, 'packages/styles/spacing-tokens.ts'),
];

// ---------------------------------------------------------------------------
// Type classification
// ---------------------------------------------------------------------------

function classifyType(name) {
  if (name.startsWith('--color-')) return 'color';
  if (name.startsWith('--spacing-')) return 'spacing';
  if (name.startsWith('--font-') || name.startsWith('--line-height-')) return 'typography';
  if (name.startsWith('--border-radius-')) return 'radius';
  if (name.startsWith('--elevation-')) return 'shadow';
  if (name.startsWith('--component-')) {
    // Component alias tokens — classify by the value they reference
    if (name.includes('font') || name.includes('line-height')) return 'typography';
    if (name.includes('radius')) return 'radius';
    if (name.includes('shadow')) return 'shadow';
    return 'color';
  }
  return 'color'; // fallback
}

// ---------------------------------------------------------------------------
// Category classification
// ---------------------------------------------------------------------------

function classifyCategory(name) {
  // Primitive colors
  if (name.startsWith('--color-primitive-')) return 'primitive';
  if (name.startsWith('--color-neutral-')) return 'primitive';

  // Semantic colors
  if (name.startsWith('--color-semantic-')) return 'semantic';
  if (name.startsWith('--color-text-')) return 'semantic';
  if (name.startsWith('--color-border-')) return 'semantic';
  if (name.startsWith('--color-background-')) return 'semantic';
  if (name.startsWith('--color-primary')) return 'semantic';
  if (name.startsWith('--color-success')) return 'semantic';
  if (name.startsWith('--color-error')) return 'semantic';
  if (name.startsWith('--color-warning')) return 'semantic';

  // Component alias tokens → semantic
  if (name.startsWith('--component-')) return 'semantic';

  // Spacing scale (unitless) → primitive
  if (name.startsWith('--spacing-scale-')) return 'primitive';
  if (name.startsWith('--spacing-root-font-size')) return 'primitive';
  if (name.startsWith('--spacing-factor')) return 'primitive';

  // Spacing rem/px → derived
  if (name.startsWith('--spacing-')) return 'derived';

  // Typography, radius, shadow → primitive (direct values)
  return 'primitive';
}

// ---------------------------------------------------------------------------
// Group extraction (for color tokens)
// ---------------------------------------------------------------------------

function extractGroup(name) {
  // --color-primitive-blue-500 → "blue"
  const primitiveMatch = name.match(/^--color-primitive-([a-z-]+?)-\d+$/);
  if (primitiveMatch) return primitiveMatch[1];

  // --color-neutral-solid-gray-500 → "neutral-solid-gray"
  const neutralMatch = name.match(/^--color-neutral-(.+?)-\d+$/);
  if (neutralMatch) return `neutral-${neutralMatch[1]}`;

  // --color-neutral-white → "neutral"
  if (name.startsWith('--color-neutral-')) return 'neutral';

  // --spacing-scale-4 → "scale"
  if (name.startsWith('--spacing-scale-')) return 'scale';

  // --spacing-4-px → "px"
  if (name.match(/--spacing-.*-px$/)) return 'px';

  // --spacing-4 → "rem"
  if (name.startsWith('--spacing-') && !name.includes('scale') && !name.endsWith('-px')) return 'rem';

  return undefined;
}

// ---------------------------------------------------------------------------
// Token extraction via regex
// ---------------------------------------------------------------------------

function extractTokensFromSource(source) {
  const tokens = [];
  // Match CSS custom property declarations: --name: value;
  // Handles multi-line values (e.g. box-shadow, calc expressions)
  const regex = /\s*--([\w-]+)\s*:\s*([^;]+);/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    const name = `--${match[1]}`;
    const value = match[2].trim().replace(/\s+/g, ' ');

    tokens.push({
      name,
      value,
      type: classifyType(name),
      category: classifyCategory(name),
      cssVariable: `var(${name})`,
      group: extractGroup(name),
    });
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const allTokens = [];

  for (const src of SOURCES) {
    try {
      const content = await fs.readFile(src, 'utf8');
      const tokens = extractTokensFromSource(content);
      allTokens.push(...tokens);
    } catch (err) {
      console.error(`Warning: could not read ${path.relative(ROOT, src)}: ${err.message}`);
    }
  }

  // De-duplicate by name (first occurrence wins)
  const seen = new Set();
  const uniqueTokens = [];
  for (const token of allTokens) {
    if (!seen.has(token.name)) {
      seen.add(token.name);
      uniqueTokens.push(token);
    }
  }

  // Summary
  const summary = { color: 0, spacing: 0, typography: 0, radius: 0, shadow: 0 };
  for (const token of uniqueTokens) {
    if (token.type in summary) {
      summary[token.type]++;
    }
  }

  const output = {
    version: '0.1.0',
    extractedAt: new Date().toISOString(),
    tokens: uniqueTokens,
    summary,
  };

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const sizeKb = (Buffer.byteLength(JSON.stringify(output), 'utf8') / 1024).toFixed(1);
  console.log(`Extracted ${uniqueTokens.length} tokens (${sizeKb} KB)`);
  console.log(`  color: ${summary.color}, spacing: ${summary.spacing}, typography: ${summary.typography}, radius: ${summary.radius}, shadow: ${summary.shadow}`);
  console.log(`  → ${path.relative(ROOT, OUTPUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

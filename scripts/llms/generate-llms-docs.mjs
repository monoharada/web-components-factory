#!/usr/bin/env node

/**
 * CEM (custom-elements.json) から AI エージェント向けドキュメントを自動生成する。
 *
 * 生成物:
 *   - llms-full.txt       全コンポーネントの完全APIリファレンス
 *   - docs/llms/*.md      コンポーネント別のAIドキュメント
 *
 * 使い方:
 *   node scripts/llms/generate-llms-docs.mjs
 *   node scripts/llms/generate-llms-docs.mjs --check   # 差分チェックのみ
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const CEM_PATH = path.join(ROOT, 'custom-elements.json');
const INSTALL_REGISTRY_PATH = path.join(ROOT, 'registry/install-registry.json');
const PATTERN_REGISTRY_PATH = path.join(ROOT, 'registry/pattern-registry.json');
const LLMS_FULL_PATH = path.join(ROOT, 'llms-full.txt');
const LLMS_DIR = path.join(ROOT, 'docs/llms');

const CHECK_MODE = process.argv.includes('--check');

// ---------------------------------------------------------------------------
// CEM 読み込みとパース
// ---------------------------------------------------------------------------

/** @returns {{ tagName: string, className: string, description: string, superclass: string, attributes: Array, slots: Array, cssParts: Array, cssProperties: Array, events: Array, modulePath: string }[]} */
function extractDeclarations(cem) {
  const results = [];
  for (const mod of cem.modules ?? []) {
    for (const decl of mod.declarations ?? []) {
      if (!decl.tagName) continue;
      // a11y-annotate はドキュメンテーション専用なのでスキップ
      if (decl.tagName === 'a11y-annotate') continue;
      // mock系もスキップ
      if (decl.tagName === 'dads-device-mock' || decl.tagName === 'dads-mobile-mock') continue;

      results.push({
        tagName: decl.tagName,
        className: decl.name ?? '',
        description: decl.description ?? '',
        superclass: decl.superclass?.name ?? '',
        attributes: (decl.attributes ?? []).map(a => ({
          name: a.name,
          type: a.type?.text ?? '',
          default: a.default ?? '',
          description: a.description ?? '',
        })),
        slots: (decl.slots ?? []).map(s => ({
          name: s.name || 'default',
          description: s.description ?? '',
        })),
        cssParts: (decl.cssParts ?? []).map(p => ({
          name: p.name,
          description: p.description ?? '',
        })),
        cssProperties: (decl.cssProperties ?? []).map(p => ({
          name: p.name,
          default: p.default ?? '',
          description: p.description ?? '',
        })),
        events: (decl.events ?? []).map(e => ({
          name: e.name,
          type: e.type?.text ?? '',
          description: e.description ?? '',
        })),
        modulePath: mod.path ?? '',
      });
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// カテゴリ分類
// ---------------------------------------------------------------------------

const CATEGORY_MAP = {
  'dads-input-text': 'Form',
  'dads-textarea': 'Form',
  'dads-select': 'Form',
  'dads-checkbox': 'Form',
  'dads-radio': 'Form',
  'dads-switch': 'Form',
  'dads-combobox': 'Form',
  'dads-date-picker': 'Form',
  'dads-file-upload': 'Form',
  'dads-fieldset': 'Form',
  'dads-search-box': 'Form',
  'dads-calendar': 'Form',
  'dads-button': 'Actions',
  'dads-dialog': 'Actions',
  'dads-drawer': 'Actions',
  'dads-disclosure': 'Actions',
  'dads-accordion-details': 'Actions',
  'dads-accordion-item-details': 'Actions',
  'dads-breadcrumb': 'Navigation',
  'dads-breadcrumb-item': 'Navigation',
  'dads-page-navigation': 'Navigation',
  'dads-step-navigation': 'Navigation',
  'dads-step-navigation-item': 'Navigation',
  'dads-menu-list': 'Navigation',
  'dads-menu-list-item': 'Navigation',
  'dads-menu-list-box': 'Navigation',
  'dads-global-menu': 'Navigation',
  'dads-global-menu-item': 'Navigation',
  'dads-language-selector': 'Navigation',
  'dads-hamburger-menu-button': 'Navigation',
  'dads-utility-link': 'Navigation',
  'dads-mobile-menu': 'Navigation',
  'dads-card': 'Content',
  'dads-heading': 'Content',
  'dads-text': 'Content',
  'dads-blockquote': 'Content',
  'dads-code-block': 'Content',
  'dads-divider': 'Content',
  'dads-list': 'Content',
  'dads-list-item': 'Content',
  'dads-description-list': 'Content',
  'dads-resource-list': 'Content',
  'dads-table': 'Content',
  'dads-table-control': 'Content',
  'dads-avatar': 'Display',
  'dads-icon': 'Display',
  'dads-chip-label': 'Display',
  'dads-chip-tag': 'Display',
  'dads-notification-banner': 'Display',
  'dads-emergency-banner': 'Display',
  'dads-carousel': 'Display',
  'dads-layout-shell': 'Layout',
  'dads-layout-sidebar': 'Layout',
  'dads-layout-aside': 'Layout',
  'dads-header-container': 'Layout',
};

function getCategory(tagName) {
  return CATEGORY_MAP[tagName] ?? 'Other';
}

// ---------------------------------------------------------------------------
// llms-full.txt 生成
// ---------------------------------------------------------------------------

function renderAttributeTable(attrs) {
  if (attrs.length === 0) return 'None\n';
  const lines = ['| Attribute | Type | Default | Description |', '|-----------|------|---------|-------------|'];
  for (const a of attrs) {
    const type = a.type.replace(/\|/g, '\\|');
    lines.push(`| \`${a.name}\` | ${type || '-'} | ${a.default || '-'} | ${a.description} |`);
  }
  return lines.join('\n') + '\n';
}

function renderSlotTable(slots) {
  if (slots.length === 0) return 'None\n';
  const lines = ['| Slot | Description |', '|------|-------------|'];
  for (const s of slots) {
    lines.push(`| \`${s.name}\` | ${s.description} |`);
  }
  return lines.join('\n') + '\n';
}

function renderPartsTable(parts) {
  if (parts.length === 0) return 'None\n';
  const lines = ['| Part | Description |', '|------|-------------|'];
  for (const p of parts) {
    lines.push(`| \`${p.name}\` | ${p.description} |`);
  }
  return lines.join('\n') + '\n';
}

function renderCssPropertiesTable(props) {
  if (props.length === 0) return 'None\n';
  const lines = ['| CSS Custom Property | Default | Description |', '|---------------------|---------|-------------|'];
  for (const p of props) {
    lines.push(`| \`${p.name}\` | ${p.default || '-'} | ${p.description} |`);
  }
  return lines.join('\n') + '\n';
}

function renderEventsTable(events) {
  if (events.length === 0) return 'None\n';
  const lines = ['| Event | Type | Description |', '|-------|------|-------------|'];
  for (const e of events) {
    lines.push(`| \`${e.name}\` | ${e.type || 'Event'} | ${e.description} |`);
  }
  return lines.join('\n') + '\n';
}

function generateUsageSnippet(decl) {
  const tag = decl.tagName;
  const attrPriority = ['label', 'support-text', 'value', 'name', 'type', 'variant', 'size', 'required', 'disabled'];
  const attrByName = new Map(decl.attributes.map(a => [a.name, a]));
  const attrLines = [];

  for (const name of attrPriority) {
    const a = attrByName.get(name);
    if (!a) continue;
    const isBoolean = a.type.toLowerCase().includes('boolean');
    attrLines.push(isBoolean ? `  ${name}` : `  ${name}=""`);
    if (attrLines.length >= 4) break;
  }

  const namedSlots = decl.slots.filter(s => s.name !== 'default');
  const slotLines = namedSlots.map(s => `  <div slot="${s.name}"><!-- ${s.description} --></div>`);
  const content = slotLines.length > 0 ? '\n' + slotLines.join('\n') + '\n' : '...';

  if (attrLines.length > 0) {
    return `<${tag}\n${attrLines.join('\n')}\n>${content}</${tag}>`;
  }
  return `<${tag}>${content}</${tag}>`;
}

function generateLlmsFull(declarations, installRegistry, patternRegistry) {
  const lines = [];

  lines.push('# Web Components Factory (DADS) — Complete API Reference');
  lines.push('');
  lines.push('> Complete API documentation for all components in the DADS Web Components library.');
  lines.push('> This file is optimized for consumption by LLMs and AI coding agents.');
  lines.push('> For a concise overview, see llms.txt.');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');
  const categories = new Map();
  for (const decl of declarations) {
    const cat = getCategory(decl.tagName);
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat).push(decl);
  }
  for (const [cat, decls] of categories) {
    lines.push(`### ${cat}`);
    for (const d of decls) {
      lines.push(`- [${d.tagName}](#${d.tagName}): ${d.description.split('\n')[0]}`);
    }
    lines.push('');
  }

  // Component API sections
  lines.push('---');
  lines.push('');
  lines.push('## Component API Reference');
  lines.push('');

  for (const decl of declarations) {
    const category = getCategory(decl.tagName);
    const isForm = decl.superclass.includes('Form');

    lines.push(`### ${decl.tagName}`);
    lines.push('');
    lines.push(`**${decl.description.split('\n')[0]}**`);
    lines.push('');
    lines.push(`- Category: ${category}`);
    lines.push(`- Class: \`${decl.className}\``);
    lines.push(`- Extends: \`${decl.superclass}\``);
    if (isForm) lines.push('- Form-associated: yes');
    lines.push(`- Source: \`${decl.modulePath}\``);
    lines.push('');

    // Attributes
    lines.push('#### Attributes');
    lines.push('');
    lines.push(renderAttributeTable(decl.attributes));
    lines.push('');

    // Slots
    lines.push('#### Slots');
    lines.push('');
    lines.push(renderSlotTable(decl.slots));
    lines.push('');

    // CSS Parts
    lines.push('#### CSS Parts');
    lines.push('');
    lines.push(renderPartsTable(decl.cssParts));
    lines.push('');

    // CSS Custom Properties
    if (decl.cssProperties.length > 0) {
      lines.push('#### CSS Custom Properties');
      lines.push('');
      lines.push(renderCssPropertiesTable(decl.cssProperties));
      lines.push('');
    }

    // Events
    if (decl.events.length > 0) {
      lines.push('#### Events');
      lines.push('');
      lines.push(renderEventsTable(decl.events));
      lines.push('');
    }

    // Usage
    lines.push('#### Usage');
    lines.push('');
    lines.push('```html');
    lines.push(generateUsageSnippet(decl));
    lines.push('```');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // UI Patterns section
  const patterns = patternRegistry?.patterns ?? {};
  const patternList = Object.values(patterns);

  if (patternList.length > 0) {
    lines.push('## UI Patterns (Blocks)');
    lines.push('');
    lines.push('Pre-built compositions for common screens. Use `get_pattern_recipe` MCP tool or wcf CLI.');
    lines.push('');

    for (const pat of patternList) {
      lines.push(`### ${pat.id}`);
      lines.push('');
      lines.push(`**${pat.title}**: ${pat.description}`);
      lines.push('');
      lines.push(`Requires: ${(pat.requires ?? []).map(r => `\`${r}\``).join(', ')}`);
      lines.push('');
      lines.push('```html');
      lines.push(pat.html?.trim() ?? '');
      lines.push('```');
      lines.push('');
    }
  }

  // Styling reference
  lines.push('## Styling Reference');
  lines.push('');
  lines.push('### Spacing Tokens');
  lines.push('');
  lines.push('Always use spacing tokens instead of hardcoded px values:');
  lines.push('');
  lines.push('| Token | px |');
  lines.push('|-------|-----|');
  const spacings = [
    ['--spacing-0', '0'], ['--spacing-0-5', '2px'], ['--spacing-1', '4px'],
    ['--spacing-1-5', '6px'], ['--spacing-2', '8px'], ['--spacing-2-5', '10px'],
    ['--spacing-3', '12px'], ['--spacing-3-5', '14px'], ['--spacing-4', '16px'],
    ['--spacing-5', '20px'], ['--spacing-6', '24px'], ['--spacing-8', '32px'],
    ['--spacing-10', '40px'], ['--spacing-12', '48px'], ['--spacing-15', '60px'],
    ['--spacing-16', '64px'], ['--spacing-20', '80px'],
  ];
  for (const [token, px] of spacings) {
    lines.push(`| \`${token}\` | ${px} |`);
  }
  lines.push('');

  lines.push('### Customization Pattern');
  lines.push('');
  lines.push('```css');
  lines.push('/* Method 1: CSS custom properties */');
  lines.push('dads-button {');
  lines.push('  --dads-button-background: var(--color-primary-solid-800);');
  lines.push('}');
  lines.push('');
  lines.push('/* Method 2: ::part() selectors */');
  lines.push('dads-card::part(base) {');
  lines.push('  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);');
  lines.push('}');
  lines.push('```');
  lines.push('');

  lines.push('### CSS Rules');
  lines.push('');
  lines.push('- No `!important` — use `@layer` for specificity');
  lines.push('- `::part()` instead of classes for Shadow DOM styling');
  lines.push('- State via HTML attributes (`[open]`, `[aria-expanded="true"]`), not classes');
  lines.push('- Max 1 level of nesting (except `@layer`, pseudo-classes, media queries)');
  lines.push('- Use global design tokens (e.g., `var(--color-neutral-black)`)');
  lines.push('');

  // Install registry info
  lines.push('## Installation');
  lines.push('');
  lines.push('### Via wcf CLI');
  lines.push('');
  lines.push('```bash');
  lines.push('# Initialize project');
  lines.push('npx wcf init --prefix myui --dir vendor/components/myui');
  lines.push('');
  lines.push('# Add components');
  lines.push('npx wcf vendor install --prefix myui --dir vendor/components/myui --component button');
  lines.push('npx wcf vendor install --prefix myui --dir vendor/components/myui --component input-text');
  lines.push('```');
  lines.push('');

  lines.push('### Component Dependencies');
  lines.push('');
  const components = installRegistry?.components ?? {};
  const withDeps = Object.entries(components).filter(([, meta]) => (meta.deps ?? []).length > 0);
  if (withDeps.length > 0) {
    lines.push('Components that depend on others (auto-resolved by wcf CLI):');
    lines.push('');
    lines.push('| Component | Dependencies |');
    lines.push('|-----------|-------------|');
    for (const [id, meta] of withDeps) {
      lines.push(`| \`${id}\` | ${meta.deps.map(d => `\`${d}\``).join(', ')} |`);
    }
    lines.push('');
  }

  // MCP Server
  lines.push('## MCP Server');
  lines.push('');
  lines.push('An MCP server exposes the design system to AI agents:');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run mcp:design-system');
  lines.push('```');
  lines.push('');
  lines.push('| Tool | Description |');
  lines.push('|------|-------------|');
  lines.push('| `list_components` | List all custom elements |');
  lines.push('| `get_component_api` | Get component API (attributes/slots/events/cssParts) |');
  lines.push('| `generate_usage_snippet` | Generate minimal HTML snippet |');
  lines.push('| `get_install_recipe` | Get install metadata and dependencies |');
  lines.push('| `validate_markup` | Validate HTML against CEM |');
  lines.push('| `list_patterns` | List UI patterns |');
  lines.push('| `get_pattern_recipe` | Get pattern with resolved HTML |');
  lines.push('| `generate_pattern_snippet` | Generate pattern HTML |');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// docs/llms/*.md 個別ファイル生成
// ---------------------------------------------------------------------------

function tagToId(tagName) {
  return tagName.replace(/^dads-/, '');
}

function generateComponentDoc(decl, installRegistry) {
  const id = tagToId(decl.tagName);
  const isForm = decl.superclass.includes('Form');
  const category = getCategory(decl.tagName);
  const components = installRegistry?.components ?? {};
  const installMeta = components[id];
  const deps = installMeta?.deps ?? [];

  const lines = [];

  lines.push(`# ${decl.tagName}`);
  lines.push('');
  lines.push(`> ${decl.description.split('\n')[0]}`);
  lines.push('');
  lines.push(`- **Category**: ${category}`);
  lines.push(`- **Class**: \`${decl.className}\``);
  lines.push(`- **Extends**: \`${decl.superclass}\``);
  if (isForm) lines.push('- **Form-associated**: yes');
  if (deps.length > 0) lines.push(`- **Dependencies**: ${deps.map(d => `\`${d}\``).join(', ')}`);
  lines.push(`- **Source**: \`${decl.modulePath}\``);
  lines.push('');

  // Install
  lines.push('## Install');
  lines.push('');
  lines.push('```bash');
  lines.push(`npx wcf vendor install --prefix myui --dir vendor/components/myui --component ${id}`);
  lines.push('```');
  lines.push('');

  // Usage
  lines.push('## Usage');
  lines.push('');
  lines.push('```html');
  lines.push(generateUsageSnippet(decl));
  lines.push('```');
  lines.push('');

  // Attributes
  lines.push('## Attributes');
  lines.push('');
  lines.push(renderAttributeTable(decl.attributes));
  lines.push('');

  // Slots
  lines.push('## Slots');
  lines.push('');
  lines.push(renderSlotTable(decl.slots));
  lines.push('');

  // CSS Parts
  lines.push('## CSS Parts');
  lines.push('');
  lines.push(renderPartsTable(decl.cssParts));
  lines.push('');

  // CSS Custom Properties
  if (decl.cssProperties.length > 0) {
    lines.push('## CSS Custom Properties');
    lines.push('');
    lines.push(renderCssPropertiesTable(decl.cssProperties));
    lines.push('');
  }

  // Events
  if (decl.events.length > 0) {
    lines.push('## Events');
    lines.push('');
    lines.push(renderEventsTable(decl.events));
    lines.push('');
  }

  // Styling
  lines.push('## Styling');
  lines.push('');
  lines.push('```css');
  lines.push(`/* Custom properties */`);
  lines.push(`${decl.tagName} {`);
  lines.push(`  /* Override component tokens here */`);
  lines.push(`}`);
  lines.push('');
  if (decl.cssParts.length > 0) {
    lines.push(`/* ::part() selectors */`);
    lines.push(`${decl.tagName}::part(${decl.cssParts[0].name}) {`);
    lines.push(`  /* Style the ${decl.cssParts[0].description} */`);
    lines.push(`}`);
  }
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}

function generateIndexDoc(declarations) {
  const lines = [];
  lines.push('# DADS Web Components — AI Documentation Index');
  lines.push('');
  lines.push('> Per-component API reference optimized for LLM consumption.');
  lines.push('> Generated from custom-elements.json (CEM v2.1.0).');
  lines.push('');

  const categories = new Map();
  for (const decl of declarations) {
    const cat = getCategory(decl.tagName);
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat).push(decl);
  }

  for (const [cat, decls] of categories) {
    lines.push(`## ${cat}`);
    lines.push('');
    for (const d of decls) {
      const id = tagToId(d.tagName);
      lines.push(`- [${d.tagName}](./${id}.md): ${d.description.split('\n')[0]}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// メイン
// ---------------------------------------------------------------------------

function main() {
  const cem = JSON.parse(fs.readFileSync(CEM_PATH, 'utf8'));
  const installRegistry = JSON.parse(fs.readFileSync(INSTALL_REGISTRY_PATH, 'utf8'));
  const patternRegistry = JSON.parse(fs.readFileSync(PATTERN_REGISTRY_PATH, 'utf8'));
  const declarations = extractDeclarations(cem);

  console.log(`Extracted ${declarations.length} component declarations from CEM`);

  // llms-full.txt
  const fullContent = generateLlmsFull(declarations, installRegistry, patternRegistry);

  // docs/llms/ 個別ファイル
  const componentDocs = new Map();
  for (const decl of declarations) {
    const id = tagToId(decl.tagName);
    const fileName = `${id}.md`;
    componentDocs.set(fileName, generateComponentDoc(decl, installRegistry));
  }
  componentDocs.set('index.md', generateIndexDoc(declarations));

  if (CHECK_MODE) {
    let dirty = false;

    // llms-full.txt チェック
    if (fs.existsSync(LLMS_FULL_PATH)) {
      const existing = fs.readFileSync(LLMS_FULL_PATH, 'utf8');
      if (existing !== fullContent) {
        console.error('llms-full.txt is out of date. Run: node scripts/llms/generate-llms-docs.mjs');
        dirty = true;
      }
    } else {
      console.error('llms-full.txt does not exist. Run: node scripts/llms/generate-llms-docs.mjs');
      dirty = true;
    }

    // docs/llms/ チェック
    for (const [fileName, content] of componentDocs) {
      const filePath = path.join(LLMS_DIR, fileName);
      if (fs.existsSync(filePath)) {
        const existing = fs.readFileSync(filePath, 'utf8');
        if (existing !== content) {
          console.error(`docs/llms/${fileName} is out of date`);
          dirty = true;
        }
      } else {
        console.error(`docs/llms/${fileName} does not exist`);
        dirty = true;
      }
    }

    if (dirty) {
      process.exit(1);
    } else {
      console.log('All AI docs are up to date');
    }
    return;
  }

  // 書き込み
  fs.writeFileSync(LLMS_FULL_PATH, fullContent, 'utf8');
  console.log(`  Written: llms-full.txt (${(fullContent.length / 1024).toFixed(1)} KB)`);

  fs.mkdirSync(LLMS_DIR, { recursive: true });
  for (const [fileName, content] of componentDocs) {
    const filePath = path.join(LLMS_DIR, fileName);
    fs.writeFileSync(filePath, content, 'utf8');
  }
  console.log(`  Written: docs/llms/ (${componentDocs.size} files)`);

  console.log('Done');
}

main();

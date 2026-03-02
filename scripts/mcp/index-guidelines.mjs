#!/usr/bin/env node
/**
 * index-guidelines.mjs
 *
 * Builds a searchable index of design system guidelines from Markdown files.
 * Sections are split on `##` headings, keywords extracted, and snippets
 * truncated to 500 characters.
 *
 * Output:
 *   - packages/mcp-server/data/guidelines-index.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const OUTPUT = path.join(ROOT, 'packages/mcp-server/data/guidelines-index.json');

const MAX_SNIPPET = 500;

// ---------------------------------------------------------------------------
// Topic assignment
// ---------------------------------------------------------------------------

const TOPIC_RULES = [
  { pattern: /^docs\/rules\//, topic: 'patterns' },
  { pattern: /^docs\/adr\//, topic: 'patterns' },
  { pattern: /^docs\/css-variable-pattern\.md$/, topic: 'css' },
  { pattern: /^docs\/design-tokens-management\.md$/, topic: 'css' },
  { pattern: /^docs\/typography-system\.md$/, topic: 'css' },
  { pattern: /^docs\/accessibility-annotations\.md$/, topic: 'accessibility' },
  { pattern: /^docs\/knowledge\/accessibility-guidelines\.md$/, topic: 'accessibility' },
  { pattern: /^\.claude\/skills\/css-writing-rules\/references\//, topic: 'css' },
];

function assignTopic(relativePath) {
  for (const rule of TOPIC_RULES) {
    if (rule.pattern.test(relativePath)) return rule.topic;
  }
  return 'all';
}

// ---------------------------------------------------------------------------
// Source file discovery
// ---------------------------------------------------------------------------

const DIRS = [
  'docs/rules',
  'docs/adr',
  'docs',
  '.claude/skills/css-writing-rules/references',
];

const EXTRA_FILES = [
  'docs/knowledge/accessibility-guidelines.md',
];

async function discoverMarkdownFiles() {
  const files = new Set();

  for (const dir of DIRS) {
    const abs = path.join(ROOT, dir);
    try {
      const entries = await fs.readdir(abs, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
        const relPath = path.join(dir, entry.name);
        files.add(relPath);
      }
    } catch {
      // Directory may not exist
    }
  }

  for (const relPath of EXTRA_FILES) {
    const abs = path.join(ROOT, relPath);
    try {
      const stat = await fs.stat(abs);
      if (stat.isFile() && relPath.endsWith('.md')) {
        files.add(relPath);
      }
    } catch {
      // File may not exist
    }
  }

  return [...files].sort();
}

// ---------------------------------------------------------------------------
// Keyword extraction
// ---------------------------------------------------------------------------

function extractKeywords(text) {
  // Extract meaningful words (3+ chars, no markdown syntax)
  const cleaned = text
    .replace(/[#*`\[\]\(\){}|>]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]/g, ' ');

  const words = cleaned.split(/\s+/).filter((w) => w.length >= 3);

  // Deduplicate and take top keywords
  const unique = [...new Set(words.map((w) => w.toLowerCase()))];
  return unique.slice(0, 20);
}

// ---------------------------------------------------------------------------
// Section parsing
// ---------------------------------------------------------------------------

function stripCodeBlocks(text) {
  return text.replace(/```[\s\S]*?```/g, '').replace(/\s+/g, ' ').trim();
}

function parseSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentHeading = null;
  let currentBody = [];
  let currentStartLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^##\s+(.+)/);

    if (headingMatch) {
      // Save previous section
      if (currentHeading !== null) {
        const body = currentBody.join('\n').trim();
        const strippedBody = stripCodeBlocks(body);
        sections.push({
          heading: currentHeading,
          keywords: extractKeywords(`${currentHeading} ${body}`),
          snippet: body.slice(0, MAX_SNIPPET),
          body: strippedBody.slice(0, MAX_SNIPPET),
          startLine: currentStartLine,
        });
      }

      currentHeading = headingMatch[1].trim();
      currentBody = [];
      currentStartLine = i + 1;
    } else {
      currentBody.push(line);
    }
  }

  // Save last section
  if (currentHeading !== null) {
    const body = currentBody.join('\n').trim();
    const strippedBody = stripCodeBlocks(body);
    sections.push({
      heading: currentHeading,
      keywords: extractKeywords(`${currentHeading} ${body}`),
      snippet: body.slice(0, MAX_SNIPPET),
      body: strippedBody.slice(0, MAX_SNIPPET),
      startLine: currentStartLine,
    });
  }

  // If no ## headings found, treat the whole document as one section
  if (sections.length === 0 && content.trim().length > 0) {
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Document';
    const strippedBody = stripCodeBlocks(content.trim());
    sections.push({
      heading: title,
      keywords: extractKeywords(content),
      snippet: content.trim().slice(0, MAX_SNIPPET),
      body: strippedBody.slice(0, MAX_SNIPPET),
      startLine: 1,
    });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Title extraction
// ---------------------------------------------------------------------------

function extractTitle(content, fileName) {
  const titleMatch = content.match(/^#\s+(.+)/m);
  if (titleMatch) return titleMatch[1].trim();
  // Fallback: use filename without extension
  return path.basename(fileName, '.md').replace(/[-_]/g, ' ');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const files = await discoverMarkdownFiles();
  const documents = [];

  for (const relPath of files) {
    const abs = path.join(ROOT, relPath);
    try {
      const content = await fs.readFile(abs, 'utf8');
      const title = extractTitle(content, relPath);
      const topic = assignTopic(relPath);
      const sections = parseSections(content);

      if (sections.length === 0) continue;

      documents.push({
        id: relPath,
        title,
        topic,
        sections,
      });
    } catch {
      // Skip unreadable files
    }
  }

  // Add 6 DADS official guideline topics (DIG-02, DIG-18)
  const dadsTopics = [
    {
      id: 'dads:keyboard-navigation',
      title: 'Keyboard Navigation',
      topic: 'accessibility',
      sections: [{
        heading: 'Keyboard Navigation',
        keywords: ['keyboard', 'navigation', 'focus', 'tab', 'tabindex', 'key event', 'focus trap', 'focus management', 'arrow keys'],
        snippet: 'All interactive elements must be operable via keyboard. Use tabindex="0" for custom interactive elements. Implement arrow key navigation within composite widgets. Ensure focus is visible and follows a logical order.',
        body: 'All interactive elements must be operable via keyboard. Use tabindex="0" for custom interactive elements. Implement arrow key navigation within composite widgets. Ensure focus is visible and follows a logical order. Avoid tabindex values greater than 0. Use focus trap for modal dialogs.',
        startLine: 1,
      }],
    },
    {
      id: 'dads:focus-management',
      title: 'Focus Management',
      topic: 'accessibility',
      sections: [{
        heading: 'Focus Management',
        keywords: ['focus', 'focus management', 'focus trap', 'focus visible', 'focus-visible', 'focus ring', 'outline', 'tabindex'],
        snippet: 'Manage focus programmatically when content changes dynamically. Move focus to new content when it appears (e.g., modal open). Return focus to trigger when content is dismissed. Use :focus-visible for keyboard-only focus styles.',
        body: 'Manage focus programmatically when content changes dynamically. Move focus to new content when it appears (e.g., modal open). Return focus to trigger when content is dismissed. Use :focus-visible for keyboard-only focus styles. Ensure focus indicator has at least 3:1 contrast ratio.',
        startLine: 1,
      }],
    },
    {
      id: 'dads:contrast-color',
      title: 'Contrast and Color',
      topic: 'accessibility',
      sections: [{
        heading: 'Contrast and Color',
        keywords: ['contrast', 'color', 'wcag', 'color contrast', 'contrast ratio', 'aa', 'aaa', 'text contrast'],
        snippet: 'Text must have at least 4.5:1 contrast ratio (WCAG AA). Large text (18px+ or 14px+ bold) requires 3:1. UI components and graphical objects require 3:1 against adjacent colors. Do not use color alone to convey information.',
        body: 'Text must have at least 4.5:1 contrast ratio against background (WCAG AA). Large text (18px+ or 14px+ bold) requires 3:1 minimum. UI components and graphical objects require 3:1 against adjacent colors. Do not use color alone to convey information. Use design tokens for consistent accessible colors.',
        startLine: 1,
      }],
    },
    {
      id: 'dads:form-validation',
      title: 'Form Validation',
      topic: 'accessibility',
      sections: [{
        heading: 'Form Validation',
        keywords: ['form', 'validation', 'error', 'required', 'label', 'aria-invalid', 'aria-describedby', 'input', 'error message'],
        snippet: 'Use aria-invalid="true" to indicate validation errors. Connect error messages via aria-describedby. Do not use aria-live for error text. Provide clear error messages in Japanese. Mark required fields with aria-required="true".',
        body: 'Use aria-invalid="true" to indicate validation errors. Connect error messages via aria-describedby. Do not use aria-live or role="alert" for error text as it interrupts screen reader users. Provide clear error messages. Mark required fields with aria-required="true" and visual indicator.',
        startLine: 1,
      }],
    },
    {
      id: 'dads:heading-hierarchy',
      title: 'Heading Hierarchy',
      topic: 'accessibility',
      sections: [{
        heading: 'Heading Hierarchy',
        keywords: ['heading', 'heading hierarchy', 'h1', 'h2', 'h3', 'heading level', 'document structure', 'semantic'],
        snippet: 'Use heading elements (h1-h6) in proper hierarchical order. Each page should have exactly one h1. Do not skip heading levels (e.g., h2 to h4). Use headings to create a meaningful document outline.',
        body: 'Use heading elements (h1-h6) in proper hierarchical order. Each page should have exactly one h1. Do not skip heading levels. Use headings to create a meaningful document outline that screen reader users can navigate.',
        startLine: 1,
      }],
    },
    {
      id: 'dads:skip-navigation',
      title: 'Skip Navigation',
      topic: 'accessibility',
      sections: [{
        heading: 'Skip Navigation',
        keywords: ['skip-navigation', 'skip-link', 'skip nav', 'landmark', 'main content', 'navigation', 'dads-layout-shell'],
        snippet: 'Provide a skip navigation link as the first focusable element on the page. The link should jump to the main content area. Use dads-layout-shell for built-in skip navigation support. Ensure landmarks (main, nav, aside) are properly defined.',
        body: 'Provide a skip navigation link as the first focusable element on the page. The link should jump to the main content area. Use dads-layout-shell component which provides built-in skip navigation. Define ARIA landmarks (main, nav, aside) for screen reader navigation.',
        startLine: 1,
      }],
    },
  ];

  for (const topic of dadsTopics) {
    documents.push(topic);
  }

  // Topic counts
  const topicCounts = {};
  for (const doc of documents) {
    topicCounts[doc.topic] = (topicCounts[doc.topic] ?? 0) + 1;
  }

  const output = {
    version: '0.1.0',
    indexedAt: new Date().toISOString(),
    documents,
    topicCounts,
  };

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const sizeKb = (Buffer.byteLength(JSON.stringify(output), 'utf8') / 1024).toFixed(1);
  console.log(`Indexed ${documents.length} documents (${sizeKb} KB)`);
  console.log(`  Topics: ${JSON.stringify(topicCounts)}`);
  console.log(`  → ${path.relative(ROOT, OUTPUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

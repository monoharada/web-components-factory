import fs from 'node:fs/promises';
import path from 'node:path';
import { collectCemCustomElements, validateTextAgainstCem } from '../wc/validator-core.mjs';

const PATTERN_REGISTRY_PATH = path.resolve(process.cwd(), 'registry/pattern-registry.json');
const INSTALL_REGISTRY_PATH = path.resolve(process.cwd(), 'registry/install-registry.json');
const CEM_PATH = path.resolve(process.cwd(), 'custom-elements.json');

function fail(message) {
  console.error(`[patterns] ${message}`);
  process.exit(1);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeId(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function assertNoScripts(html, id) {
  const lower = String(html).toLowerCase();
  if (lower.includes('<script')) fail(`${id}: pattern html must not include <script>`);
  if (lower.includes('<style')) fail(`${id}: pattern html must not include <style>`);
}

function assertNoInlineEventHandlers(html, id) {
  if (/\son[a-z]+\s*=/i.test(String(html))) {
    fail(`${id}: pattern html must not include inline event handlers (on*="...")`);
  }
}

function assertNoJavascriptUrls(html, id) {
  const text = String(html);
  if (/(?:href|src)\s*=\s*["']\s*javascript:/i.test(text)) {
    fail(`${id}: pattern html must not include javascript: URLs`);
  }
  if (/\ssrcdoc\s*=/i.test(text)) {
    fail(`${id}: pattern html must not include srcdoc=`);
  }
}

async function loadJson(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

function collectUnknownElementErrors({ html, cemIndex }) {
  return validateTextAgainstCem({
    filePath: '<pattern>',
    text: html,
    cem: cemIndex,
    severity: {
      unknownElement: 'error',
      unknownAttribute: 'warning',
    },
  }).filter((d) => d.severity === 'error' && d.code === 'unknownElement');
}

function assertCanonicalPrefixUsage(html, canonicalPrefix, id) {
  const canonical = `${canonicalPrefix}-`;
  const matches = new Set(
    [...String(html).matchAll(/<\s*\/?\s*([a-z0-9-]+)(?=[\s/>])/gi)].map((m) =>
      String(m[1]).toLowerCase(),
    ),
  );

  for (const tag of matches) {
    // Allow native + non-custom tags.
    if (!tag.includes('-')) continue;
    if (tag.startsWith(canonical)) continue;
    // Disallow other custom elements inside patterns to keep recipes portable.
    // (If you need them, add a new installable component and reference it here.)
    fail(`${id}: pattern html must use only "${canonicalPrefix}-*" custom tags (found <${tag}>)`);
  }
}

async function main() {
  const [patternRegistry, installRegistry, cem] = await Promise.all([
    loadJson(PATTERN_REGISTRY_PATH),
    loadJson(INSTALL_REGISTRY_PATH),
    loadJson(CEM_PATH),
  ]);

  if (!isPlainObject(patternRegistry)) fail('pattern-registry.json must be an object');
  if (!isPlainObject(installRegistry)) fail('install-registry.json must be an object');

  const schemaVersion = patternRegistry.schemaVersion;
  if (schemaVersion !== 1) fail(`unsupported schemaVersion: ${String(schemaVersion)}`);

  const canonicalPrefix = normalizeId(patternRegistry.canonicalPrefix) || 'dads';
  if (canonicalPrefix !== String(installRegistry.canonicalPrefix ?? '').trim()) {
    fail(
      `canonicalPrefix mismatch (patterns=${canonicalPrefix}, install=${String(
        installRegistry.canonicalPrefix ?? '',
      ).trim()})`,
    );
  }

  const patterns = patternRegistry.patterns;
  if (!isPlainObject(patterns)) fail('patterns must be an object');

  const components = isPlainObject(installRegistry.components) ? installRegistry.components : {};
  const cemIndex = collectCemCustomElements(cem);

  for (const [key, raw] of Object.entries(patterns)) {
    if (!isPlainObject(raw)) fail(`${key}: pattern must be an object`);

    const id = normalizeId(raw.id) || normalizeId(key);
    if (!id) fail(`${key}: missing id`);
    if (id !== key) fail(`${key}: key must match id (expected "${key}", got "${id}")`);

    const title = normalizeId(raw.title);
    if (!title) fail(`${id}: missing title`);

    const requires = Array.isArray(raw.requires) ? raw.requires.map(normalizeId).filter(Boolean) : [];
    if (requires.length === 0) fail(`${id}: requires[] must be non-empty`);
    for (const dep of requires) {
      if (!components[dep]) fail(`${id}: requires unknown componentId: ${dep}`);
    }

    const html = typeof raw.html === 'string' ? raw.html : '';
    if (!html.trim()) fail(`${id}: missing html`);
    assertNoScripts(html, id);
    assertNoInlineEventHandlers(html, id);
    assertNoJavascriptUrls(html, id);
    assertCanonicalPrefixUsage(html, canonicalPrefix, id);

    const errors = collectUnknownElementErrors({ html, cemIndex });
    if (errors.length > 0) {
      const uniq = [...new Set(errors.map((e) => String(e.tagName ?? '').trim()).filter(Boolean))];
      fail(`${id}: contains unknownElement(s): ${uniq.join(', ')}`);
    }
  }

  console.log(`[patterns] pattern registry OK (${Object.keys(patterns).length} patterns)`);
}

main().catch((err) => fail(err?.stack ?? String(err)));

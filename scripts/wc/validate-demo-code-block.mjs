import fs from 'node:fs/promises';
import path from 'node:path';

const BASELINE_PATH = path.resolve(process.cwd(), 'scripts/wc/demo-keys-baseline.json');
const DEMOS_PATH = path.resolve(process.cwd(), 'src/demos.ts');

function asStringArray(v) {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === 'string');
}

function extractDemosBlock(text) {
  const start = text.indexOf('export const demos = {');
  if (start < 0) {
    throw new Error('Could not find `export const demos = {` in src/demos.ts');
  }

  const typeIdx = text.indexOf('export type DemoName');
  if (typeIdx < 0) {
    throw new Error('Could not find `export type DemoName` in src/demos.ts');
  }

  const end = text.lastIndexOf('\n};', typeIdx);
  if (end < 0 || end <= start) {
    throw new Error('Could not find end of demos object (`};`) in src/demos.ts');
  }

  return { start, end, block: text.slice(start, end) };
}

function extractDemoEntries(blockText, baseOffset) {
  const re = /^\s*([A-Za-z_$][\w$]*)\s*:\s*\(\)\s*=>/gm;
  const matches = Array.from(blockText.matchAll(re)).map((m) => ({
    key: String(m[1]),
    start: baseOffset + (m.index ?? 0),
  }));

  return matches;
}

function sliceForKey(text, entries, idx) {
  const entry = entries[idx];
  const next = entries[idx + 1];
  const start = entry.start;
  const end = next ? next.start : text.length;
  return text.slice(start, end);
}

function shouldRequireCodeBlock(key) {
  if (key === 'empty') return false;
  if (key.endsWith('Fidelity')) return false;
  return true;
}

async function main() {
  const [baselineText, demosText] = await Promise.all([
    fs.readFile(BASELINE_PATH, 'utf8'),
    fs.readFile(DEMOS_PATH, 'utf8'),
  ]);

  const baseline = JSON.parse(baselineText);
  const baselineKeys = new Set(asStringArray(baseline?.keys));

  const { start: blockStart, block } = extractDemosBlock(demosText);
  const entries = extractDemoEntries(block, blockStart);

  if (entries.length === 0) {
    console.log('✅ validate:demo-code-block: no demo entries found (skipped).');
    return;
  }

  const currentKeys = entries.map((e) => e.key);
  const newKeys = currentKeys.filter((k) => !baselineKeys.has(k));

  const failures = [];
  for (const k of newKeys) {
    if (!shouldRequireCodeBlock(k)) continue;

    const idx = entries.findIndex((e) => e.key === k);
    if (idx < 0) continue;
    const slice = sliceForKey(demosText, entries, idx);

    if (!slice.includes('<dads-code-block')) {
      failures.push(k);
    }
  }

  if (failures.length === 0) {
    console.log('✅ validate:demo-code-block: OK.');
    return;
  }

  console.error('❌ validate:demo-code-block: missing <dads-code-block> in new demo(s):');
  for (const k of failures) {
    console.error(`- ${k}`);
  }
  console.error('\nAdd a Usage (HTML) section using:');
  console.error('<dads-code-block><template>...</template></dads-code-block>');
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

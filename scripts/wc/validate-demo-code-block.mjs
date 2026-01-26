import fs from 'node:fs/promises';
import path from 'node:path';

const BASELINE_PATH = path.resolve(process.cwd(), 'scripts/wc/demo-keys-baseline.json');
const DEMOS_DIR = path.resolve(process.cwd(), 'src/demos');

function asStringArray(v) {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === 'string');
}

function extractDemoEntries(text) {
  const re = /^\s*([A-Za-z_$][\w$]*)\s*:\s*\(\)\s*=>/gm;
  const matches = Array.from(text.matchAll(re)).map((m) => ({
    key: String(m[1]),
    start: m.index ?? 0,
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
  const baselineText = await fs.readFile(BASELINE_PATH, 'utf8');
  const dirEntries = await fs.readdir(DEMOS_DIR, { withFileTypes: true });
  const demoFiles = dirEntries
    .filter((ent) => ent.isFile() && ent.name.endsWith('.ts') && ent.name !== 'shared.ts')
    .map((ent) => path.join(DEMOS_DIR, ent.name))
    .sort();

  const demoTexts = await Promise.all(demoFiles.map((file) => fs.readFile(file, 'utf8')));

  const baseline = JSON.parse(baselineText);
  const baselineKeys = new Set(asStringArray(baseline?.keys));

  const slicesByKey = new Map();

  for (let i = 0; i < demoFiles.length; i++) {
    const filePath = demoFiles[i];
    const text = demoTexts[i];
    const entries = extractDemoEntries(text);
    if (entries.length === 0) continue;

    for (let idx = 0; idx < entries.length; idx++) {
      const { key } = entries[idx];
      if (slicesByKey.has(key)) {
        throw new Error(`Duplicate demo key: ${key}`);
      }
      slicesByKey.set(key, sliceForKey(text, entries, idx));
    }
  }

  const currentKeys = Array.from(slicesByKey.keys());
  if (currentKeys.length === 0) {
    console.log('✅ validate:demo-code-block: no demo entries found (skipped).');
    return;
  }

  const newKeys = currentKeys.filter((k) => !baselineKeys.has(k));

  const failures = [];
  for (const k of newKeys) {
    if (!shouldRequireCodeBlock(k)) continue;

    const slice = slicesByKey.get(k) ?? '';

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

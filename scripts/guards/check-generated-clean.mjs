import { execFileSync } from 'node:child_process';

const GENERATED_FILES = ['custom-elements.json', 'registry/install-registry.json'];

function readChangedGeneratedFiles() {
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', ...GENERATED_FILES], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[agents] Failed to check generated files with git diff.');
    console.error(msg);
    process.exit(1);
  }
}

const changedFiles = readChangedGeneratedFiles();

if (changedFiles.length === 0) {
  console.log('[agents] generated files are clean');
  process.exit(0);
}

console.error('[agents] Generated files are not clean against HEAD:');
for (const file of changedFiles) console.error(`- ${file}`);
console.error('');
console.error('Include generated file updates in the same PR before pushing.');
console.error('Run: npm run agents:pre-pr');
process.exit(1);

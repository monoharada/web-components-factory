import fs from 'node:fs/promises';
import path from 'node:path';

function getArgValue(argv, name, short) {
  const longIndex = argv.findIndex((a) => a === `--${name}`);
  const shortIndex = short ? argv.findIndex((a) => a === `-${short}`) : -1;
  const index = longIndex >= 0 ? longIndex : shortIndex;
  if (index < 0) return undefined;
  return argv[index + 1];
}

function hasFlag(argv, name, short) {
  return argv.includes(`--${name}`) || (short ? argv.includes(`-${short}`) : false);
}

function isValidPrefix(prefix) {
  return /^[a-z][a-z0-9-]*$/.test(prefix);
}

function transformManifestPrefix(manifest, { fromPrefix, toPrefix }) {
  const from = `${fromPrefix}-`;
  const to = `${toPrefix}-`;

  const out = structuredClone(manifest);
  const modules = Array.isArray(out?.modules) ? out.modules : [];

  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;
      if (typeof decl.tagName !== 'string') continue;
      if (decl.tagName.startsWith(from)) {
        decl.tagName = to + decl.tagName.slice(from.length);
      }
    }
  }

  return out;
}

function printHelp() {
  console.log(
    [
      'Usage:',
      '  node scripts/cem/transform-prefix.mjs --prefix <toPrefix> [options]',
      '',
      'Options:',
      '  --prefix, -p   Target prefix to apply (required)',
      '  --from         Source prefix to replace (default: dads)',
      '  --in, -i       Input CEM path (default: custom-elements.json)',
      '  --out, -o      Output path (default: custom-elements.<prefix>.json)',
      '  --help, -h     Show this help',
      '',
      'Notes:',
      '  - Only tagName fields that start with "<from>-" are rewritten.',
      '  - This is intended for prefix-customized consumers (canonical CEM uses "dads-*").',
    ].join('\n'),
  );
}

async function main() {
  const argv = process.argv.slice(2);

  if (hasFlag(argv, 'help', 'h')) {
    printHelp();
    process.exit(0);
  }

  const toPrefixRaw = getArgValue(argv, 'prefix', 'p');
  if (!toPrefixRaw) {
    console.error('Missing required flag: --prefix <toPrefix>');
    printHelp();
    process.exit(2);
  }

  const toPrefix = toPrefixRaw.toLowerCase();
  if (!isValidPrefix(toPrefix)) {
    console.error(`Invalid prefix: ${toPrefixRaw}`);
    process.exit(2);
  }

  const fromPrefixRaw = getArgValue(argv, 'from');
  const fromPrefix = (fromPrefixRaw ? String(fromPrefixRaw) : 'dads').toLowerCase();
  if (!isValidPrefix(fromPrefix)) {
    console.error(`Invalid --from prefix: ${fromPrefixRaw}`);
    process.exit(2);
  }

  const inputPath = getArgValue(argv, 'in', 'i') ?? 'custom-elements.json';
  const outputPath = getArgValue(argv, 'out', 'o') ?? `custom-elements.${toPrefix}.json`;

  const absIn = path.resolve(process.cwd(), inputPath);
  const absOut = path.resolve(process.cwd(), outputPath);

  const inputText = await fs.readFile(absIn, 'utf8');
  const manifest = JSON.parse(inputText);

  const transformed = transformManifestPrefix(manifest, { fromPrefix, toPrefix });

  await fs.mkdir(path.dirname(absOut), { recursive: true });
  await fs.writeFile(absOut, JSON.stringify(transformed, null, 2) + '\n', 'utf8');

  console.log(`✅ Wrote ${path.relative(process.cwd(), absOut)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


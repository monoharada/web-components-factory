import { pathToFileURL } from 'node:url';
import { DEFAULT_REGISTRY_PATH, loadAndValidateSkillsRegistry, selectSkillNames } from '../codex/list-skills-from-registry.mjs';

function usage() {
  return [
    'Validate skills registry and skill file consistency.',
    '',
    'Usage:',
    '  node scripts/registry/check-skills-registry.mjs [--registry registry/skills-registry.json] [--repo-root .]',
  ].join('\n');
}

function parseArgs(argv) {
  const options = {
    registryPath: DEFAULT_REGISTRY_PATH,
    repoRoot: process.cwd(),
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--help' || token === '-h') {
      options.help = true;
      continue;
    }
    if (token === '--registry') {
      options.registryPath = argv[++i] ?? '';
      continue;
    }
    if (token === '--repo-root') {
      options.repoRoot = argv[++i] ?? '';
      continue;
    }
    throw new Error(`[skills] Unknown option: ${token}`);
  }

  return options;
}

export async function checkSkillsRegistry({ registryPath = DEFAULT_REGISTRY_PATH, repoRoot = process.cwd() } = {}) {
  const { registry } = await loadAndValidateSkillsRegistry({
    registryPath,
    repoRoot,
    checkFiles: true,
  });

  const codexActive = selectSkillNames(registry, {
    client: 'codex',
    includeDeprecated: false,
  });
  if (codexActive.length === 0) {
    throw new Error('[skills] No active skills found for client "codex"');
  }

  return {
    totalSkills: registry.skills.length,
    codexActiveSkills: codexActive.length,
  };
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(usage());
    return;
  }

  const result = await checkSkillsRegistry({
    registryPath: options.registryPath,
    repoRoot: options.repoRoot,
  });

  console.log(`[skills] registry OK (${result.totalSkills} skills)`);
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) {
  main().catch((error) => {
    console.error(error?.message ?? String(error));
    process.exit(1);
  });
}

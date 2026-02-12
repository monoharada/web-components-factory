import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const DEFAULT_REGISTRY_PATH = 'registry/skills-registry.json';
export const REQUIRED_CLIENTS = ['codex', 'claude_code', 'cursor'];

const VALID_CLIENTS = new Set(REQUIRED_CLIENTS);
const VALID_STATUS = new Set(['active', 'deprecated']);
const VALID_FORMATS = new Set(['plain', 'json']);
const SKILL_NAME_RE = /^[a-z0-9-]+$/;

function usage() {
  return [
    'List installable skills from registry.',
    '',
    'Usage:',
    '  node scripts/codex/list-skills-from-registry.mjs [--client codex] [--format plain|json]',
    '    [--registry registry/skills-registry.json] [--repo-root .] [--include-deprecated]',
  ].join('\n');
}

function parseArgs(argv) {
  const options = {
    client: 'codex',
    format: 'plain',
    registryPath: DEFAULT_REGISTRY_PATH,
    repoRoot: process.cwd(),
    includeDeprecated: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '-h' || token === '--help') {
      options.help = true;
      continue;
    }
    if (token === '--client') {
      options.client = argv[++i] ?? '';
      continue;
    }
    if (token === '--format') {
      options.format = argv[++i] ?? '';
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
    if (token === '--include-deprecated') {
      options.includeDeprecated = true;
      continue;
    }
    throw new Error(`[skills] Unknown option: ${token}`);
  }

  return options;
}

function assert(condition, message) {
  if (!condition) throw new Error(`[skills] ${message}`);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizePath(inputPath) {
  return String(inputPath).replaceAll('\\', '/');
}

function resolveRegistryPath(repoRoot, registryPath) {
  if (!registryPath) throw new Error('[skills] Missing --registry value');
  if (path.isAbsolute(registryPath)) return path.normalize(registryPath);
  return path.resolve(repoRoot, registryPath);
}

async function assertInsideRepo(absTargetPath, repoRoot, label) {
  const relativePath = path.relative(repoRoot, absTargetPath);
  assert(relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath), `${label} is outside repo root`);
}

export async function validateSkillsRegistry(registry, { repoRoot, registryPath, checkFiles }) {
  assert(isPlainObject(registry), 'registry must be an object');
  assert(Number(registry.schemaVersion) === 1, `unsupported schemaVersion: ${String(registry.schemaVersion)}`);

  const sourceOfTruth = String(registry.sourceOfTruth ?? '').trim();
  assert(sourceOfTruth === '.claude/skills', `sourceOfTruth must be ".claude/skills" (got "${sourceOfTruth}")`);

  const clients = registry.clients;
  assert(isPlainObject(clients), 'clients must be an object');
  for (const requiredClient of REQUIRED_CLIENTS) {
    const metadata = clients[requiredClient];
    assert(isPlainObject(metadata), `clients.${requiredClient} must be an object`);
    assert(typeof metadata.description === 'string' && metadata.description.trim() !== '', `clients.${requiredClient}.description is required`);
  }
  for (const key of Object.keys(clients)) {
    assert(VALID_CLIENTS.has(key), `clients contains unsupported key: ${key}`);
  }

  const skills = registry.skills;
  assert(Array.isArray(skills), 'skills must be an array');
  assert(skills.length > 0, 'skills must not be empty');

  const names = [];
  const uniqueNames = new Set();
  for (const [index, raw] of skills.entries()) {
    const prefix = `skills[${index}]`;
    assert(isPlainObject(raw), `${prefix} must be an object`);

    const name = String(raw.name ?? '').trim();
    assert(SKILL_NAME_RE.test(name), `${prefix}.name must match ^[a-z0-9-]+$`);
    assert(!uniqueNames.has(name), `duplicate skill name: ${name}`);
    uniqueNames.add(name);
    names.push(name);

    const skillPath = String(raw.path ?? '').trim();
    assert(skillPath !== '', `${prefix}.path is required`);
    assert(!path.isAbsolute(skillPath), `${prefix}.path must be relative`);
    const normalizedSkillPath = normalizePath(skillPath);
    const segments = normalizedSkillPath.split('/');
    assert(!segments.includes('..'), `${prefix}.path must not contain ".."`);
    assert(normalizedSkillPath === `${sourceOfTruth}/${name}`, `${prefix}.path must be "${sourceOfTruth}/${name}"`);

    const entry = String(raw.entry ?? '').trim();
    assert(entry === 'SKILL.md', `${prefix}.entry must be "SKILL.md"`);

    const status = String(raw.status ?? '').trim();
    assert(VALID_STATUS.has(status), `${prefix}.status must be one of ${Array.from(VALID_STATUS).join(', ')}`);

    const description = String(raw.description ?? '').trim();
    assert(description !== '', `${prefix}.description is required`);

    const skillClients = raw.clients;
    assert(Array.isArray(skillClients) && skillClients.length > 0, `${prefix}.clients must be a non-empty array`);
    for (const client of skillClients) {
      assert(typeof client === 'string' && VALID_CLIENTS.has(client), `${prefix}.clients contains unsupported client: ${String(client)}`);
    }

    if (!checkFiles) continue;

    const absSkillDir = path.resolve(repoRoot, normalizedSkillPath);
    const absSkillEntry = path.resolve(absSkillDir, entry);
    await assertInsideRepo(absSkillDir, repoRoot, `${prefix}.path`);
    await assertInsideRepo(absSkillEntry, repoRoot, `${prefix}.entry`);

    try {
      await fs.access(absSkillEntry);
    } catch {
      throw new Error(`[skills] Missing ${entry}: ${normalizedSkillPath}/${entry}`);
    }
  }

  const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
  const sameOrder = names.length === sortedNames.length && names.every((name, idx) => name === sortedNames[idx]);
  assert(sameOrder, 'skills must be sorted by name in ascending order');

  const absSourceOfTruth = path.resolve(repoRoot, sourceOfTruth);
  await assertInsideRepo(absSourceOfTruth, repoRoot, 'sourceOfTruth');
  if (checkFiles) {
    try {
      await fs.access(absSourceOfTruth);
    } catch {
      throw new Error(`[skills] Missing sourceOfTruth directory: ${sourceOfTruth}`);
    }
  }

  if (registryPath) {
    const absRegistryPath = path.resolve(registryPath);
    await assertInsideRepo(absRegistryPath, repoRoot, 'registry path');
  }
}

export function selectSkillNames(registry, { client = 'codex', includeDeprecated = false } = {}) {
  if (!VALID_CLIENTS.has(client)) throw new Error(`[skills] Unsupported client: ${client}`);

  const skills = Array.isArray(registry?.skills) ? registry.skills : [];
  return skills
    .filter((skill) => {
      const status = String(skill?.status ?? '').trim();
      const clients = Array.isArray(skill?.clients) ? skill.clients : [];
      if (!clients.includes(client)) return false;
      if (!includeDeprecated && status === 'deprecated') return false;
      return true;
    })
    .map((skill) => String(skill.name).trim());
}

export async function loadAndValidateSkillsRegistry({
  registryPath = DEFAULT_REGISTRY_PATH,
  repoRoot = process.cwd(),
  checkFiles = true,
} = {}) {
  assert(typeof repoRoot === 'string' && repoRoot.trim() !== '', 'repoRoot is required');

  const absRepoRoot = path.resolve(repoRoot);
  const absRegistryPath = resolveRegistryPath(absRepoRoot, registryPath);

  let registryText;
  try {
    registryText = await fs.readFile(absRegistryPath, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[skills] Failed to read registry: ${absRegistryPath}\n${message}`);
  }

  let registry;
  try {
    registry = JSON.parse(registryText);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[skills] Invalid JSON in registry: ${absRegistryPath}\n${message}`);
  }

  await validateSkillsRegistry(registry, {
    repoRoot: absRepoRoot,
    registryPath: absRegistryPath,
    checkFiles,
  });

  return { registry, absRegistryPath, absRepoRoot };
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(usage());
    return;
  }

  assert(VALID_CLIENTS.has(options.client), `--client must be one of: ${Array.from(VALID_CLIENTS).join(', ')}`);
  assert(VALID_FORMATS.has(options.format), `--format must be one of: ${Array.from(VALID_FORMATS).join(', ')}`);

  const { registry } = await loadAndValidateSkillsRegistry({
    registryPath: options.registryPath,
    repoRoot: options.repoRoot,
    checkFiles: true,
  });

  const skills = selectSkillNames(registry, {
    client: options.client,
    includeDeprecated: options.includeDeprecated,
  });

  if (options.format === 'plain') {
    if (skills.length > 0) console.log(skills.join('\n'));
    return;
  }

  console.log(JSON.stringify({ skills }, null, 2));
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) {
  main().catch((error) => {
    console.error(error?.message ?? String(error));
    process.exit(1);
  });
}

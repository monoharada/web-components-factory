#!/usr/bin/env node

import process from 'node:process';

import {
  buildImportMap,
  createPage,
  getPattern,
  initProject,
  initAgentKit,
  listPatterns,
  printImportMap,
  vendorAdd,
  vendorInstall,
} from './core.js';
import {
  addExtension,
  removeExtension,
  listExtensions,
  showExtension,
} from './extension.js';
import { CHANNEL_DELEGATED_ENV, normalizeChannel, runDelegatedChannel } from './channel.js';

function printHelp() {
  // eslint-disable-next-line no-console
  console.log(
    [
      'wcf',
      '',
      'Usage:',
      '  wcf init --prefix myui --dir . --pattern search-results [--entry @wcf|index|boot] [--file index.html] [--vendor-dir vendor/components/myui] [--force]',
      '  wcf vendor install --prefix myui --dir vendor/components/myui [--pattern search-results] [--component heading ...] [--no-deps] [--force] [--registry ./ext.json]',
      '  wcf vendor add --prefix myui --dir vendor/components/myui [--pattern search-results] [--component heading ...] [--no-deps] [--force] [--registry ./ext.json]',
      '  wcf vendor print-importmap --prefix myui --dir vendor/components/myui [--pattern search-results] [--format json|html] [--component ...] [--no-deps]',
      '  wcf page create --pattern search-results --prefix myui --dir . [--entry @wcf|index|boot] [--vendor-dir vendor/components/myui]',
      '  wcf agent init --prefix myui --dir . [--pattern search-results]',
      '  wcf extension add <source> [--name <name>] [--namespace <ns>] [--force]',
      '  wcf extension list [--format json]',
      '  wcf extension remove <name>',
      '  wcf extension show <name>',
      '  wcf patterns',
      '  wcf patterns show <name>',
      '  wcf blocks list',
      '  wcf blocks show <name>',
      '',
      'Options:',
      '  --prefix <prefix>       custom element prefix (required for vendor commands)',
      '  --dir <path>            output directory / importmap base directory (required for vendor commands)',
      '  --pattern <name>        component pattern name from vendor-runtime/registry.json',
      '  --component <suffix>    add component suffix manually (repeatable)',
      '  --no-deps               do not resolve component dependencies for --component (default: include deps)',
      '  --entry <@wcf|index|boot>  page entry mode (default: boot)',
      '  --channel <local|stable>   execution channel (default: local)',
      '  --vendor-dir <path>     vendor directory path for page scaffolding',
      '  --file <path>           output html file name (default: index.html)',
      '  --format <json|html>    print-importmap output format (default: json)',
      '  --registry <path>       external registry JSON file (repeatable)',
      '  --name <name>           extension name (for extension add)',
      '  --namespace <ns>        extension namespace (for extension add)',
      '  --force                 overwrite existing files',
      '  -h, --help              show this help',
      '',
    ].join('\n'),
  );
}

function printWarnings(warnings) {
  if (!Array.isArray(warnings) || warnings.length === 0) return;
  for (const warning of warnings) {
    // eslint-disable-next-line no-console
    console.error(String(warning));
  }
}

function parseArgs(argv) {
  const result = {
    command: [],
    prefix: null,
    dir: null,
    pattern: null,
    components: [],
    registries: [],
    name: null,
    namespace: null,
    format: null,
    entry: 'boot',
    channel: 'local',
    vendorDir: null,
    file: 'index.html',
    force: false,
    includeDeps: true,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      result.help = true;
      continue;
    }

    if (a === '--prefix') {
      result.prefix = argv[++i];
      continue;
    }
    if (a === '--dir') {
      result.dir = argv[++i];
      continue;
    }
    if (a === '--pattern') {
      result.pattern = argv[++i];
      continue;
    }
    if (a === '--component') {
      result.components.push(argv[++i]);
      continue;
    }
    if (a === '--registry') {
      result.registries.push(argv[++i]);
      continue;
    }
    if (a === '--name') {
      result.name = argv[++i];
      continue;
    }
    if (a === '--namespace') {
      result.namespace = argv[++i];
      continue;
    }
    if (a === '--no-deps') {
      result.includeDeps = false;
      continue;
    }
    if (a === '--format') {
      result.format = argv[++i] ?? null;
      continue;
    }
    if (a === '--entry') {
      result.entry = argv[++i] ?? 'boot';
      continue;
    }
    if (a === '--channel') {
      const value = argv[++i];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing required option: --channel');
      }
      result.channel = value;
      continue;
    }
    if (a === '--vendor-dir') {
      result.vendorDir = argv[++i];
      continue;
    }
    if (a === '--file') {
      result.file = argv[++i] ?? 'index.html';
      continue;
    }
    if (a === '--force') {
      result.force = true;
      continue;
    }

    if (a.startsWith('-')) {
      throw new Error(`Unknown option: ${a}`);
    }

    result.command.push(a);
  }

  return result;
}

function requireValue(value, flagName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required option: ${flagName}`);
  }
  return value;
}

async function runPatterns(cmd) {
  if (cmd[1] === 'show') {
    const name = cmd[2];
    if (!name) throw new Error('Usage: wcf patterns show <name>');
    const detail = await getPattern(name);
    printWarnings(detail.warnings);
    // eslint-disable-next-line no-console
    console.log(
      [
        `name: ${detail.name}`,
        `title: ${detail.title}`,
        `description: ${detail.description}`,
        `stability: ${detail.stability}`,
        `contractVersion: ${detail.contractVersion}`,
        `entryHints: ${detail.entryHints.join(', ')}`,
        `components: ${detail.components.join(', ')}`,
        `requiredComponents: ${detail.requiredComponents.join(', ')}`,
      ].join('\n'),
    );
    return;
  }

  const patterns = await listPatterns();
  // eslint-disable-next-line no-console
  console.log(
    patterns
      .map((p) => `${p.name}\t${p.title}\t${p.stability}\t[${p.components.join(', ')}]`)
      .join('\n'),
  );
}

async function runBlocks(cmd) {
  if (!cmd[1] || cmd[1] === 'list') {
    await runPatterns(['patterns']);
    return;
  }
  if (cmd[1] === 'show') {
    await runPatterns(['patterns', 'show', cmd[2]]);
    return;
  }
  throw new Error('Usage: wcf blocks <list|show <name>>');
}

async function runVendor(cmd, args) {
  const sub = cmd[1];
  if (sub === 'install') {
    const prefix = requireValue(args.prefix, '--prefix');
    const dir = requireValue(args.dir, '--dir');

    const res = await vendorInstall({
      prefix,
      outDir: dir,
      pattern: args.pattern,
      components: args.components,
      includeDeps: args.includeDeps,
      force: args.force,
      registries: args.registries,
    });
    printWarnings(res.warnings);

    // eslint-disable-next-line no-console
    console.log(
      [
        `Installed to: ${res.outDir}`,
        `prefix: ${res.prefix}`,
        `components: ${res.components.join(', ')}`,
      ].join('\n'),
    );
    return;
  }

  if (sub === 'add') {
    const prefix = requireValue(args.prefix, '--prefix');
    const dir = requireValue(args.dir, '--dir');
    const res = await vendorAdd({
      prefix,
      outDir: dir,
      pattern: args.pattern,
      components: args.components,
      includeDeps: args.includeDeps,
      force: args.force,
      registries: args.registries,
    });
    printWarnings(res.warnings);
    // eslint-disable-next-line no-console
    console.log(
      [
        `Updated vendor: ${res.outDir}`,
        `prefix: ${res.prefix}`,
        `addedComponents: ${res.addedComponents.join(', ')}`,
        `totalComponents: ${res.totalComponents}`,
      ].join('\n'),
    );
    return;
  }

  if (sub === 'print-importmap') {
    const prefix = requireValue(args.prefix, '--prefix');
    const dir = requireValue(args.dir, '--dir');
    const text = await printImportMap({
      prefix,
      dir,
      pattern: args.pattern,
      components: args.components,
      includeDeps: args.includeDeps,
      format: args.format ?? 'json',
    });
    // eslint-disable-next-line no-console
    console.log(text.trimEnd());
    return;
  }

  throw new Error('Usage: wcf vendor <install|add|print-importmap> ...');
}

async function runAgent(cmd, args) {
  const sub = cmd[1];
  if (sub !== 'init') {
    throw new Error('Usage: wcf agent init --prefix myui --dir . [--pattern search-results]');
  }

  const prefix = requireValue(args.prefix, '--prefix');
  const dir = requireValue(args.dir, '--dir');
  const res = await initAgentKit({
    prefix,
    outDir: dir,
    pattern: args.pattern ?? 'search-results',
  });
  printWarnings(res.warnings);

  // eslint-disable-next-line no-console
  console.log(
    [
      `Agent kit generated in: ${res.outDir}`,
      `prefix: ${res.prefix}`,
      `pattern: ${res.pattern}`,
      `files: ${res.files.join(', ')}`,
    ].join('\n'),
  );
}

async function runPage(cmd, args) {
  const sub = cmd[1];
  if (sub !== 'create') {
    throw new Error(
      'Usage: wcf page create --pattern search-results --prefix myui --dir . [--entry @wcf|index|boot] [--vendor-dir vendor/components/myui]',
    );
  }

  const prefix = requireValue(args.prefix, '--prefix');
  const pattern = requireValue(args.pattern, '--pattern');
  const dir = args.dir ?? '.';
  const res = await createPage({
    prefix,
    pattern,
    dir,
    entry: args.entry,
    vendorDir: args.vendorDir,
    file: args.file,
    force: args.force,
  });
  printWarnings(res.warnings);
  // eslint-disable-next-line no-console
  console.log(
    [`Page created: ${res.file}`, `pattern: ${res.pattern}`, `entry: ${res.entry}`, `vendorDir: ${res.vendorDir}`].join(
      '\n',
    ),
  );
}

async function runInit(args) {
  const prefix = requireValue(args.prefix, '--prefix');
  const dir = args.dir ?? '.';
  const pattern = requireValue(args.pattern, '--pattern');
  const res = await initProject({
    prefix,
    dir,
    pattern,
    entry: args.entry,
    vendorDir: args.vendorDir,
    file: args.file,
    force: args.force,
  });
  printWarnings(res.warnings);
  // eslint-disable-next-line no-console
  console.log(
    [
      `Project initialized: ${res.dir}`,
      `file: ${res.file}`,
      `pattern: ${res.pattern}`,
      `entry: ${res.entry}`,
      `vendorDir: ${res.vendorDir}`,
      `components: ${res.components.join(', ')}`,
    ].join('\n'),
  );
}

async function runExtension(cmd, args) {
  const sub = cmd[1];
  const projectRoot = process.cwd();

  if (sub === 'add') {
    const source = cmd[2];
    if (!source) throw new Error('Usage: wcf extension add <source> [--name <name>] [--namespace <ns>] [--force]');

    const res = await addExtension(projectRoot, {
      source,
      name: args.name,
      namespace: args.namespace,
      force: args.force,
    });

    // eslint-disable-next-line no-console
    console.log(
      [
        `拡張レジストリを追加しました: ${res.name} (コンポーネント: ${res.componentCount}, パターン: ${res.patternCount})`,
        '',
        '\u26a0 vendor ディレクトリを更新するには以下を実行してください:',
        '  wcf vendor install --prefix <prefix> --dir <dir> --force',
      ].join('\n'),
    );
    return;
  }

  if (sub === 'list') {
    const extensions = await listExtensions(projectRoot);
    if (extensions.length === 0) {
      // eslint-disable-next-line no-console
      console.log('登録されている拡張レジストリはありません。');
      return;
    }

    if (args.format === 'json') {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(extensions, null, 2));
    } else {
      // Default: TSV table output (format is null or non-json)
      for (const ext of extensions) {
        // eslint-disable-next-line no-console
        console.log(`${ext.name}\t${ext.source}\t${ext.addedAt ?? ''}`);
      }
    }
    return;
  }

  if (sub === 'remove') {
    const name = cmd[2];
    if (!name) throw new Error('Usage: wcf extension remove <name>');
    const removed = await removeExtension(projectRoot, name);
    // eslint-disable-next-line no-console
    console.log(`拡張レジストリを削除しました: ${removed.name}`);
    return;
  }

  if (sub === 'show') {
    const name = cmd[2];
    if (!name) throw new Error('Usage: wcf extension show <name>');
    const detail = await showExtension(projectRoot, name);
    // eslint-disable-next-line no-console
    console.log(
      [
        `name: ${detail.name}`,
        `source: ${detail.source}`,
        `components: ${detail.components.join(', ')}`,
        `patterns: ${detail.patterns.join(', ')}`,
        `addedAt: ${detail.addedAt ?? ''}`,
        detail.loadError ? '(warning: レジストリファイルの読み込みに失敗しました)' : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
    return;
  }

  throw new Error('Usage: wcf extension <add|list|remove|show> ...');
}

async function main() {
  const rawArgv = process.argv.slice(2);
  const args = parseArgs(rawArgv);
  args.channel = normalizeChannel(args.channel);
  if (args.help || args.command.length === 0) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  if (args.channel !== 'local' && process.env[CHANNEL_DELEGATED_ENV] !== '1') {
    const delegated = await runDelegatedChannel({
      channel: args.channel,
      rawArgv,
    });
    printWarnings(delegated.warnings);
    process.exit(delegated.exitCode);
  }

  if (args.command[0] === 'patterns') {
    await runPatterns(args.command);
    process.exit(0);
  }

  if (args.command[0] === 'blocks') {
    await runBlocks(args.command);
    process.exit(0);
  }

  if (args.command[0] === 'vendor') {
    await runVendor(args.command, args);
    process.exit(0);
  }

  if (args.command[0] === 'init') {
    await runInit(args);
    process.exit(0);
  }

  if (args.command[0] === 'page') {
    await runPage(args.command, args);
    process.exit(0);
  }

  if (args.command[0] === 'agent') {
    await runAgent(args.command, args);
    process.exit(0);
  }

  if (args.command[0] === 'extension') {
    await runExtension(args.command, args);
    process.exit(0);
  }

  // quick validation helper for scripts/pipelines
  if (args.command[0] === 'vendor-importmap-json') {
    const prefix = requireValue(args.prefix, '--prefix');
    const dir = requireValue(args.dir, '--dir');
    const map = await buildImportMap({
      prefix,
      dir,
      pattern: args.pattern,
      components: args.components,
      includeDeps: args.includeDeps,
    });
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ imports: map.imports }, null, 2));
    process.exit(0);
  }

  throw new Error(`Unknown command: ${args.command.join(' ')}`);
}

main().catch((error) => {
  if (
    error?.code &&
    (String(error.code).startsWith('E_CHANNEL_') || String(error.code).startsWith('E_EXTENSION_'))
  ) {
    // eslint-disable-next-line no-console
    console.error(String(error?.message ?? error));
  } else {
    // eslint-disable-next-line no-console
    console.error(String(error?.stack ?? error));
  }
  process.exit(1);
});

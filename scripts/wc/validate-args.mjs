/**
 * Parse CLI args for `validate:wc`.
 *
 * NOTE: This file is intentionally importable (no side effects) for unit testing.
 */

export function parseValidateArgs(argv, { defaultConfigPath }) {
  const configFlagIndex = argv.findIndex((a) => a === '--config' || a === '-c');

  const configPath =
    configFlagIndex >= 0 && argv[configFlagIndex + 1] ? argv[configFlagIndex + 1] : defaultConfigPath;

  const excludeIndexes = new Set();
  if (configFlagIndex >= 0) {
    excludeIndexes.add(configFlagIndex);
    if (argv[configFlagIndex + 1]) excludeIndexes.add(configFlagIndex + 1);
  }

  const patterns = argv.filter((_, i) => !excludeIndexes.has(i));

  return { configPath, patterns };
}


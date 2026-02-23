import fs from 'node:fs/promises';
import path from 'node:path';

function sortStrings(values: Iterable<string>): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe('vendor-runtime registry coverage', () => {
  it('matches autoload dads suffixes exactly', async () => {
    const autoloadRoot = path.resolve(process.cwd(), 'packages/autoload/dads');
    const registryPath = path.resolve(process.cwd(), 'vendor-runtime/registry.json');

    const entries = await fs.readdir(autoloadRoot, { withFileTypes: true });
    const autoloadSuffixes = sortStrings(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
        .map((entry) => entry.name.replace(/\.ts$/, '')),
    );

    const registry = JSON.parse(await fs.readFile(registryPath, 'utf8')) as {
      components?: Record<string, unknown>;
    };
    const registrySuffixes = sortStrings(Object.keys(registry.components ?? {}));

    expect(registrySuffixes).toEqual(autoloadSuffixes);
    expect(registrySuffixes.length).toBe(60);
  });

  it('generates one element entrypoint per runtime component', async () => {
    const registryPath = path.resolve(process.cwd(), 'vendor-runtime/registry.json');
    const elementsRoot = path.resolve(process.cwd(), 'vendor-runtime/elements');
    const registry = JSON.parse(await fs.readFile(registryPath, 'utf8')) as {
      components?: Record<string, unknown>;
    };

    const expectedCount = Object.keys(registry.components ?? {}).length;
    const entries = await fs.readdir(elementsRoot, { withFileTypes: true });
    const elementFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.js'));

    expect(elementFiles.length).toBe(expectedCount);
    expect(elementFiles.length).toBe(60);
  });
});

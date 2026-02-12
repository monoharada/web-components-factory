import fs from 'node:fs/promises';
import path from 'node:path';

function sortStrings(values: Iterable<string>): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

describe('pattern registry sync', () => {
  it('keeps vendor-runtime registry patterns in sync with pattern-registry SoT', async () => {
    const patternRegistryPath = path.resolve(process.cwd(), 'registry/pattern-registry.json');
    const vendorRegistryPath = path.resolve(process.cwd(), 'vendor-runtime/registry.json');

    const patternRegistry = JSON.parse(await fs.readFile(patternRegistryPath, 'utf8')) as {
      patterns?: Record<string, unknown>;
    };
    const vendorRegistry = JSON.parse(await fs.readFile(vendorRegistryPath, 'utf8')) as {
      patterns?: Record<string, unknown>;
    };

    const expectedIds = sortStrings(Object.keys(patternRegistry.patterns ?? {}));
    const actualIds = sortStrings(Object.keys(vendorRegistry.patterns ?? {}));

    expect(actualIds).toEqual(expectedIds);
  });

  it('includes new mockup patterns', async () => {
    const vendorRegistryPath = path.resolve(process.cwd(), 'vendor-runtime/registry.json');
    const vendorRegistry = JSON.parse(await fs.readFile(vendorRegistryPath, 'utf8')) as {
      patterns?: Record<string, unknown>;
    };
    const ids = new Set(Object.keys(vendorRegistry.patterns ?? {}));

    expect(ids.has('mockup-website')).toBe(true);
    expect(ids.has('mockup-app-shell')).toBe(true);
    expect(ids.has('mockup-mobile-form')).toBe(true);
  });
});

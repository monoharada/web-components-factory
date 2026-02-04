import { createRequire } from 'node:module';
import { describe, expect, test } from 'vitest';

const require = createRequire(import.meta.url);
const { staticPageAssets } = require('../scripts/build-pages-assets.cjs');

describe('build-pages assets', () => {
  test('includes averageCase runtime files', () => {
    expect(staticPageAssets).toContain('averageCase.runtime.js');
    expect(staticPageAssets).toContain('averageCase.runtime-utils.js');
  });
});

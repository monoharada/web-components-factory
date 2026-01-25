import { describe, it, expect } from 'vitest';
import { matchesGlob } from '../scripts/wc/validator-core.mjs';

describe('matchesGlob', () => {
  it('treats "foo/**" as a path-boundary prefix match', () => {
    expect(matchesGlob('dist/file.js', 'dist/**')).toBe(true);
    expect(matchesGlob('dist', 'dist/**')).toBe(true);
    expect(matchesGlob('dist-pages/file.js', 'dist/**')).toBe(false);
  });

  it('supports the "**/suffix" fast path', () => {
    expect(matchesGlob('a/b/c.ts', '**/c.ts')).toBe(true);
    expect(matchesGlob('a/b/c.ts', '**/d.ts')).toBe(false);
  });
});


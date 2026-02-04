import { describe, expect, test } from 'vitest';
import { resolveMinifiedSpecifier } from '../averageCase.runtime-utils.js';

describe('resolveMinifiedSpecifier', () => {
  const baseURI = 'http://localhost:3000/averageCase.html';
  const importMap = {
    'local-mod': './dist/local-mod.js',
    'abs-mod': 'https://cdn.example.com/abs-mod.js',
    'hash-mod': './dist/hash-mod.js?min=0#section',
  };

  test('returns original specifier when minify is disabled', () => {
    const result = resolveMinifiedSpecifier({
      specifier: 'local-mod',
      importMap,
      shouldMinify: false,
      baseURI,
    });

    expect(result).toBe('local-mod');
  });

  test('adds min=1 for relative mapping', () => {
    const result = resolveMinifiedSpecifier({
      specifier: 'local-mod',
      importMap,
      shouldMinify: true,
      baseURI,
    });

    expect(result).toBe('/dist/local-mod.js?min=1');
  });

  test('preserves absolute origin and overrides min', () => {
    const result = resolveMinifiedSpecifier({
      specifier: 'abs-mod',
      importMap,
      shouldMinify: true,
      baseURI,
    });

    expect(result).toBe('https://cdn.example.com/abs-mod.js?min=1');
  });

  test('preserves hash and overrides min', () => {
    const result = resolveMinifiedSpecifier({
      specifier: 'hash-mod',
      importMap,
      shouldMinify: true,
      baseURI,
    });

    expect(result).toBe('/dist/hash-mod.js?min=1#section');
  });
});

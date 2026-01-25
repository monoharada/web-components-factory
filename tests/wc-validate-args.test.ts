import { describe, it, expect } from 'vitest';
import { parseValidateArgs } from '../scripts/wc/validate-args.mjs';

describe('validate:wc CLI args', () => {
  it('keeps the first arg when no --config is provided', () => {
    const { configPath, patterns } = parseValidateArgs(['viewer.html'], {
      defaultConfigPath: 'wc.config.js',
    });

    expect(configPath).toBe('wc.config.js');
    expect(patterns).toEqual(['viewer.html']);
  });

  it('removes --config and its value from patterns', () => {
    const { configPath, patterns } = parseValidateArgs(['--config', 'wc.config.js', 'viewer.html'], {
      defaultConfigPath: 'default.js',
    });

    expect(configPath).toBe('wc.config.js');
    expect(patterns).toEqual(['viewer.html']);
  });

  it('removes -c and its value from patterns', () => {
    const { configPath, patterns } = parseValidateArgs(['-c', 'wc.config.js', 'viewer.html'], {
      defaultConfigPath: 'default.js',
    });

    expect(configPath).toBe('wc.config.js');
    expect(patterns).toEqual(['viewer.html']);
  });
});


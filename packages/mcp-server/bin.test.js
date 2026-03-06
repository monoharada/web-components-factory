import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { USAGE, parseArgs } from './bin.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('bin CLI argument parsing', () => {
  it('uses stdio transport by default', () => {
    expect(parseArgs([])).toEqual({
      help: false,
      transport: 'stdio',
      port: 3100,
      configPath: undefined,
    });
  });

  it('accepts http transport, port, and config path', () => {
    expect(parseArgs(['--transport=http', '--port=4100', '--config=./wcf-mcp.config.json'])).toEqual({
      help: false,
      transport: 'http',
      port: 4100,
      configPath: './wcf-mcp.config.json',
    });
  });

  it('returns help output without requiring other arguments', () => {
    expect(parseArgs(['--help'])).toEqual({
      help: true,
      transport: 'stdio',
      port: 3100,
    });
    expect(USAGE).toContain('wcf-mcp --config=./wcf-mcp.config.json');
  });

  it('rejects missing transport values', () => {
    expect(() => parseArgs(['--transport'])).toThrow('--transport requires a value (stdio|http)');
  });

  it('rejects unknown transports', () => {
    expect(() => parseArgs(['--transport=tcp'])).toThrow('Invalid transport: tcp (expected: stdio or http)');
  });

  it('rejects out-of-range ports', () => {
    expect(() => parseArgs(['--port=70000'])).toThrow('Invalid port: 70000 (expected: integer 1-65535)');
  });
});

describe('bin transport wiring', () => {
  it('keeps both transport implementations in the CLI entry', async () => {
    const binSrc = await fs.readFile(path.join(__dirname, 'bin.mjs'), 'utf8');
    expect(binSrc).toContain('StdioServerTransport');
    expect(binSrc).toContain('StreamableHTTPServerTransport');
    expect(binSrc).toContain('--transport=');
    expect(binSrc).toContain('--port=');
    expect(binSrc).toContain('127.0.0.1');
  });
});

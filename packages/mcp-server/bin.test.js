import { describe, expect, it } from 'vitest';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { USAGE, buildHttpTransportOptions, createHttpRequestHandler, parseArgs } from './bin.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BIN_PATH = path.join(__dirname, 'bin.mjs');

function sendHttpRequest({ port, pathName = '/mcp', method = 'GET', headers = {} }) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port,
      path: pathName,
      method,
      headers,
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

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
    const binSrc = await fs.readFile(BIN_PATH, 'utf8');
    expect(binSrc).toContain('StdioServerTransport');
    expect(binSrc).toContain('StreamableHTTPServerTransport');
    expect(binSrc).toContain('--transport=');
    expect(binSrc).toContain('--port=');
    expect(binSrc).toContain('127.0.0.1');
  });

  it('prints help when invoked through a symlinked CLI path', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-mcp-bin-'));
    const symlinkPath = path.join(tmpDir, 'wcf-mcp');

    try {
      await fs.symlink(BIN_PATH, symlinkPath, 'file');

      const result = spawnSync(process.execPath, [symlinkPath, '--help'], {
        encoding: 'utf8',
        timeout: 10_000,
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('wcf-mcp --help');
      expect(result.stderr).toBe('');
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('HTTP transport handler', () => {
  it('builds stateless transport options with localhost security guards', () => {
    expect(buildHttpTransportOptions({ port: 3100 })).toEqual({
      sessionIdGenerator: undefined,
      allowedHosts: ['127.0.0.1:3100', 'localhost:3100'],
      allowedOrigins: ['http://127.0.0.1:3100', 'http://localhost:3100'],
      enableDnsRebindingProtection: true,
    });
  });

  it('handles repeated requests without reusing a stateless transport', async () => {
    let handleRequest;
    const httpServer = http.createServer((req, res) => {
      void handleRequest(req, res);
    });
    await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
    const address = httpServer.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    handleRequest = createHttpRequestHandler({ port });

    try {
      const first = await sendHttpRequest({ port });
      const second = await sendHttpRequest({ port });

      expect(first.statusCode).toBe(406);
      expect(second.statusCode).toBe(406);
    } finally {
      await new Promise((resolve) => httpServer.close(resolve));
    }
  });

  it('rejects disallowed origins in HTTP mode', async () => {
    let handleRequest;
    const httpServer = http.createServer((req, res) => {
      void handleRequest(req, res);
    });
    await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
    const address = httpServer.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    handleRequest = createHttpRequestHandler({ port });

    try {
      const response = await sendHttpRequest({
        port,
        headers: { Origin: 'http://evil.example' },
      });
      expect(response.statusCode).toBe(403);
    } finally {
      await new Promise((resolve) => httpServer.close(resolve));
    }
  });
});

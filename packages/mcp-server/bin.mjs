#!/usr/bin/env node
/**
 * bin.mjs — CLI entry-point for the wcf-mcp server.
 *
 * Usage:
 *   wcf-mcp                        # stdio (default)
 *   wcf-mcp --transport=http       # HTTP on 127.0.0.1:3100
 *   wcf-mcp --transport=http --port=4000
 */

import { createServer } from './server.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export const USAGE = [
  'Usage:',
  '  wcf-mcp',
  '  wcf-mcp --transport=stdio',
  '  wcf-mcp --transport=http [--port=3100]',
  '  wcf-mcp --config=./wcf-mcp.config.json',
  '  wcf-mcp --help',
].join('\n');

export function parseArgs(argv) {
  let transport = 'stdio';
  let port = 3100;
  let configPath;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      return { help: true, transport, port };
    }

    if (arg === '--transport') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--transport requires a value (stdio|http)');
      }
      transport = value;
      index += 1;
      continue;
    }

    if (arg.startsWith('--transport=')) {
      transport = arg.slice('--transport='.length);
      continue;
    }

    if (arg === '--port') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--port requires a number between 1 and 65535');
      }
      port = Number(value);
      index += 1;
      continue;
    }

    if (arg === '--config') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--config requires a file path');
      }
      configPath = value;
      index += 1;
      continue;
    }

    if (arg.startsWith('--port=')) {
      port = Number(arg.slice('--port='.length));
      continue;
    }

    if (arg.startsWith('--config=')) {
      configPath = arg.slice('--config='.length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (transport !== 'stdio' && transport !== 'http') {
    throw new Error(`Invalid transport: ${transport} (expected: stdio or http)`);
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port: ${String(port)} (expected: integer 1-65535)`);
  }

  return { help: false, transport, port, configPath };
}

export function buildHttpTransportOptions({ host = '127.0.0.1', port }) {
  const allowedHosts = new Set([
    `${host}:${port}`,
  ]);
  if (host === '127.0.0.1') {
    allowedHosts.add(`localhost:${port}`);
  }
  if (host === 'localhost') {
    allowedHosts.add(`127.0.0.1:${port}`);
  }

  return {
    sessionIdGenerator: undefined,
    allowedHosts: [...allowedHosts],
    allowedOrigins: [...allowedHosts].map((value) => `http://${value}`),
    enableDnsRebindingProtection: true,
  };
}

function sendJsonRpcError(res, status, message) {
  if (res.headersSent) return;
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({
    jsonrpc: '2.0',
    error: {
      code: -32603,
      message,
    },
    id: null,
  }));
}

export function createHttpRequestHandler({
  port,
  host = '127.0.0.1',
  configPath,
  createServerImpl = createServer,
} = {}) {
  const transportOptions = buildHttpTransportOptions({ host, port });

  return async function handleHttpRequest(req, res) {
    let server;
    let transport;
    let cleanedUp = false;
    const cleanup = async () => {
      if (cleanedUp) return;
      cleanedUp = true;
      await Promise.allSettled([
        transport?.close?.(),
        server?.close?.(),
      ]);
    };

    res.on('close', () => {
      void cleanup();
    });

    try {
      ({ server } = await createServerImpl({ configPath }));
      const { StreamableHTTPServerTransport } = await import(
        '@modelcontextprotocol/sdk/server/streamableHttp.js'
      );
      transport = new StreamableHTTPServerTransport(transportOptions);
      await server.connect(transport);
      await transport.handleRequest(req, res);
      if (res.writableEnded) {
        await cleanup();
      }
    } catch (error) {
      await cleanup();
      const message = error instanceof Error ? error.message : String(error);
      if (res.headersSent) {
        res.destroy(error instanceof Error ? error : new Error(message));
        return;
      }
      sendJsonRpcError(res, 500, message);
    }
  };
}

function isDirectRun(metaUrl = import.meta.url, argv = process.argv) {
  const entryPath = argv[1];
  if (!entryPath) return false;

  const resolveFilePath = (value) => {
    const resolvedPath = path.resolve(value);
    try {
      return fs.realpathSync.native?.(resolvedPath) ?? fs.realpathSync(resolvedPath);
    } catch {
      return resolvedPath;
    }
  };

  return resolveFilePath(entryPath) === resolveFilePath(fileURLToPath(metaUrl));
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error('');
    console.error(USAGE);
    process.exit(1);
  }

  if (parsed.help) {
    console.log(USAGE);
    return;
  }

  if (parsed.transport === 'http') {
    const { createServer: createHttpServer } = await import('node:http');
    const handleHttpRequest = createHttpRequestHandler({
      port: parsed.port,
      configPath: parsed.configPath,
    });
    const httpServer = createHttpServer((req, res) => {
      void handleHttpRequest(req, res);
    });
    httpServer.listen(parsed.port, '127.0.0.1', () => {
      console.error(`MCP HTTP server listening on http://127.0.0.1:${parsed.port}/mcp`);
    });
  } else {
    const { server } = await createServer({ configPath: parsed.configPath });
    await server.connect(new StdioServerTransport());
  }
}

if (isDirectRun()) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

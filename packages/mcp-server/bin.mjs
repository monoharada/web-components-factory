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
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const args = process.argv.slice(2);
const transport = args.find((a) => a.startsWith('--transport='))?.split('=')[1] ?? 'stdio';
const port = parseInt(args.find((a) => a.startsWith('--port='))?.split('=')[1] ?? '3100', 10);

async function main() {
  const { server } = await createServer();

  if (transport === 'http') {
    const { StreamableHTTPServerTransport } = await import(
      '@modelcontextprotocol/sdk/server/streamableHttp.js'
    );
    const { createServer: createHttpServer } = await import('node:http');
    const httpTransport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(httpTransport);
    const httpServer = createHttpServer((req, res) => httpTransport.handleRequest(req, res));
    httpServer.listen(port, '127.0.0.1', () => {
      console.error(`MCP HTTP server listening on http://127.0.0.1:${port}/mcp`);
    });
  } else {
    await server.connect(new StdioServerTransport());
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

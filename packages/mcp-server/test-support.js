import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createMcpServer } from './core.mjs';
import { loadJsonDataWithFallback, loadTextDataWithFallback } from './runtime-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

export async function loadBundledJson(fileName) {
  return loadJsonDataWithFallback(fileName, {
    bundledDir: __dirname,
    repoRoot: REPO_ROOT,
  });
}

export async function loadBundledText(fileName) {
  return loadTextDataWithFallback(fileName, {
    bundledDir: __dirname,
    repoRoot: REPO_ROOT,
  });
}

export async function createPluginTestPair({
  clientName = 'wcf-mcp-test-client',
  plugins = [],
} = {}) {
  const { server } = await createMcpServer(
    loadBundledJson,
    async () => import('./validator.mjs'),
    {
      loadTextData: loadBundledText,
      plugins,
    },
  );
  const client = new Client(
    { name: clientName, version: '0.0.0' },
    { capabilities: {} },
  );
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);
  return { client, server };
}

export async function setupDsPluginTest(clientName) {
  const dsPlugin = (await import('./plugins/design-system-skills/index.mjs')).default;
  return createPluginTestPair({
    clientName,
    plugins: [dsPlugin],
  });
}

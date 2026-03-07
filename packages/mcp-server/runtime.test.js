import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  PLUGIN_CONTRACT_VERSION,
  buildPluginDataSourceMap,
  createMcpServer,
  normalizePlugins,
} from './core.mjs';
import { createServer, loadWcfMcpRuntimeConfig } from './server.mjs';
import { createPluginTestPair, loadBundledJson, loadBundledText } from './test-support.js';

describe('plugin extensibility', () => {
  it('exports PLUGIN_CONTRACT_VERSION as semver string', () => {
    expect(PLUGIN_CONTRACT_VERSION).toBe('1.1.0');
    expect(typeof PLUGIN_CONTRACT_VERSION).toBe('string');
  });

  it('normalizes plugin tools and blocks builtin tool name collisions', () => {
    const normalized = normalizePlugins([
      {
        name: 'sample-plugin',
        version: '0.1.0',
        tools: [
          {
            name: 'sample_tool',
            staticPayload: { ok: true },
          },
        ],
      },
    ]);
    expect(normalized).toHaveLength(1);
    expect(normalized[0].tools[0].name).toBe('sample_tool');
    expect(normalized[0].tools[0].description).toContain('contract v1');

    expect(() => normalizePlugins([
      {
        name: 'bad-plugin',
        version: '0.1.0',
        tools: [{ name: 'list_components', staticPayload: {} }],
      },
    ])).toThrow(/tool name collision/);
  });

  it('handler wins when both handler and staticPayload are specified', () => {
    const normalized = normalizePlugins([
      {
        name: 'both-plugin',
        version: '1.0.0',
        tools: [
          {
            name: 'both_tool',
            handler: () => ({ fromHandler: true }),
            staticPayload: { fromStatic: true },
          },
        ],
      },
    ]);
    expect(normalized).toHaveLength(1);
    const tool = normalized[0].tools[0];
    expect(typeof tool.handler).toBe('function');
    expect(tool.name).toBe('both_tool');
  });

  it('builds plugin data source map and rejects duplicate file overrides', () => {
    const map = buildPluginDataSourceMap([
      {
        name: 'plugin-a',
        dataSources: [{ fileName: 'guidelines-index.json', path: '/tmp/guidelines-a.json' }],
      },
    ]);

    expect(map.get('guidelines-index.json')).toMatchObject({
      path: '/tmp/guidelines-a.json',
      pluginName: 'plugin-a',
    });

    expect(() => buildPluginDataSourceMap([
      {
        name: 'plugin-a',
        dataSources: [{ fileName: 'guidelines-index.json', path: '/tmp/guidelines-a.json' }],
      },
      {
        name: 'plugin-b',
        dataSources: [{ fileName: 'guidelines-index.json', path: '/tmp/guidelines-b.json' }],
      },
    ])).toThrow(/Duplicate data source override/);
  });

  it('uses loadJsonDataFromPath when plugin data source override is configured', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-mcp-plugin-'));
    const customGuidelinesPath = path.join(tmpDir, 'guidelines-index.override.json');
    await fs.writeFile(customGuidelinesPath, JSON.stringify({
      version: 1,
      documents: [],
      topicCounts: {},
    }), 'utf8');

    const fileLoadCalls = [];
    const pathLoadCalls = [];
    const loadJsonData = async (fileName) => {
      fileLoadCalls.push(fileName);
      return loadBundledJson(fileName);
    };
    const loadJsonDataFromPath = async (sourcePath, fileName, pluginName) => {
      pathLoadCalls.push({ sourcePath, fileName, pluginName });
      const text = await fs.readFile(sourcePath, 'utf8');
      return JSON.parse(text);
    };
    const loadValidator = async () => ({
      collectCemCustomElements: () => new Map(),
      validateTextAgainstCem: () => [],
      detectTokenMisuseInInlineStyles: () => [],
      detectAccessibilityMisuseInMarkup: () => [],
    });

    try {
      const result = await createMcpServer(loadJsonData, loadValidator, {
        plugins: [{
          name: 'override-plugin',
          version: '0.1.0',
          dataSources: [{ fileName: 'guidelines-index.json', path: customGuidelinesPath }],
          tools: [],
        }],
        loadJsonDataFromPath,
      });

      expect(result.pluginRuntime).toMatchObject({
        pluginCount: 1,
        pluginToolCount: 0,
      });
      expect(pathLoadCalls.some((call) => (
        call.fileName === 'guidelines-index.json'
        && call.sourcePath === customGuidelinesPath
        && call.pluginName === 'override-plugin'
      ))).toBe(true);
      expect(fileLoadCalls).toContain('custom-elements.json');
      expect(fileLoadCalls).toContain('install-registry.json');
      expect(fileLoadCalls).toContain('pattern-registry.json');
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('rejects plugin without name', () => {
    expect(() => normalizePlugins([{ version: '1.0.0' }])).toThrow();
  });

  it('rejects plugin without version', () => {
    expect(() => normalizePlugins([{ name: 'no-version' }])).toThrow();
  });

  it('rejects duplicate plugin names', () => {
    expect(() => normalizePlugins([
      { name: 'dup', version: '1.0.0' },
      { name: 'dup', version: '2.0.0' },
    ])).toThrow(/duplicate/i);
  });

  it('registers plugin tool with handler via MCP', async () => {
    let handlerCalled = false;
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'handler-test-plugin',
        version: '1.0.0',
        tools: [{
          name: 'handler_test_tool',
          description: 'Test tool with handler',
          async handler(args, ctx) {
            handlerCalled = true;
            return { received: args, pluginName: ctx.plugin.name };
          },
        }],
      }],
    });
    try {
      const result = await client.callTool({ name: 'handler_test_tool', arguments: { foo: 'bar' } });
      expect(handlerCalled).toBe(true);
      const text = result.content?.[0]?.text;
      expect(text).toBeTruthy();
      const payload = JSON.parse(text);
      expect(payload.pluginName).toBe('handler-test-plugin');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('provides helpers.loadJsonData in handler context (contract v1)', async () => {
    let receivedHelpers = null;
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'helpers-test-plugin',
        version: '1.0.0',
        tools: [{
          name: 'helpers_context_test',
          description: 'Verify helpers shape',
          async handler(_args, ctx) {
            receivedHelpers = ctx.helpers;
            return { ok: true };
          },
        }],
      }],
    });
    try {
      await client.callTool({ name: 'helpers_context_test', arguments: {} });
      expect(receivedHelpers).toBeTruthy();
      expect(typeof receivedHelpers.loadJsonData).toBe('function');
      expect(typeof receivedHelpers.buildJsonToolResponse).toBe('function');
      expect(typeof receivedHelpers.normalizePrefix).toBe('function');
      expect(typeof receivedHelpers.withPrefix).toBe('function');
      expect(typeof receivedHelpers.toCanonicalTagName).toBe('function');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('provides helpers.loadTextData in handler context (contract v1.1)', async () => {
    let receivedHelpers = null;
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'text-helpers-test-plugin',
        version: '1.0.0',
        tools: [{
          name: 'text_helpers_context_test',
          description: 'Verify loadTextData in helpers',
          async handler(_args, ctx) {
            receivedHelpers = ctx.helpers;
            return { ok: true };
          },
        }],
      }],
    });
    try {
      await client.callTool({ name: 'text_helpers_context_test', arguments: {} });
      expect(receivedHelpers).toBeTruthy();
      expect(typeof receivedHelpers.loadTextData).toBe('function');
      expect(typeof receivedHelpers.loadJsonData).toBe('function');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('loadTextData returns text content via plugin handler', async () => {
    let textContent = null;
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'text-read-test-plugin',
        version: '1.0.0',
        tools: [{
          name: 'text_read_test',
          description: 'Read text via loadTextData',
          async handler(_args, ctx) {
            textContent = await ctx.helpers.loadTextData('llms-full.txt');
            return { length: textContent.length };
          },
        }],
      }],
    });
    try {
      await client.callTool({ name: 'text_read_test', arguments: {} });
      expect(typeof textContent).toBe('string');
      expect(textContent.length).toBeGreaterThan(0);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

describe('runtime config loader', () => {
  it('createServer resolves the default config from the provided cwd', async () => {
    const tmpDir = await fs.mkdtemp(path.join(process.cwd(), '.tmp-wcf-mcp-loaders-'));
    try {
      const configPath = path.join(tmpDir, 'wcf-mcp.config.json');
      await fs.writeFile(configPath, JSON.stringify({
        plugins: [
          {
            name: 'cwd-static-plugin',
            version: '1.0.0',
            staticTools: [
              {
                name: 'cwd_tool',
                payload: { ok: true },
              },
            ],
          },
        ],
      }), 'utf8');

      const runtime = await createServer({ cwd: tmpDir });
      expect(runtime.pluginRuntime).toMatchObject({
        pluginCount: 1,
        pluginToolCount: 1,
      });
      await runtime.server.close();
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('returns empty plugins when default config is absent', async () => {
    const tmpDir = await fs.mkdtemp(path.join(process.cwd(), '.tmp-wcf-mcp-config-'));
    try {
      const result = await loadWcfMcpRuntimeConfig({ cwd: tmpDir });
      expect(Array.isArray(result.plugins)).toBe(true);
      expect(result.plugins).toHaveLength(0);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('throws when explicit config path does not exist', async () => {
    const tmpDir = await fs.mkdtemp(path.join(process.cwd(), '.tmp-wcf-mcp-config-'));
    try {
      await expect(loadWcfMcpRuntimeConfig({
        cwd: tmpDir,
        configPath: path.join(tmpDir, 'missing-config.json'),
      })).rejects.toThrow(/Config file not found/);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('loads module plugin and static plugin from config file', async () => {
    const tmpDir = await fs.mkdtemp(path.join(process.cwd(), '.tmp-wcf-mcp-config-'));
    const pluginDir = path.join(tmpDir, 'plugins');
    await fs.mkdir(pluginDir, { recursive: true });
    const pluginFile = path.join(pluginDir, 'module-plugin.mjs');
    const pluginGuidelinesPath = path.join(pluginDir, 'guidelines.plugin.json');
    const configFile = path.join(tmpDir, 'wcf-mcp.config.json');
    const rootDesignTokensPath = path.join(tmpDir, 'design-tokens.local.json');

    await fs.writeFile(pluginGuidelinesPath, JSON.stringify({}), 'utf8');
    await fs.writeFile(rootDesignTokensPath, JSON.stringify({}), 'utf8');

    await fs.writeFile(pluginFile, `
export default {
  name: 'module-plugin',
  version: '0.2.0',
  dataSources: [
    {
      fileName: 'guidelines-index.json',
      path: './guidelines.plugin.json'
    }
  ],
  tools: [
    {
      name: 'module_tool',
      description: 'module plugin tool',
      staticPayload: { ok: true }
    }
  ]
};
`, 'utf8');

    await fs.writeFile(configFile, JSON.stringify({
      dataSources: {
        'design-tokens.json': './design-tokens.local.json',
      },
      plugins: [
        { module: './plugins/module-plugin.mjs' },
        {
          name: 'static-plugin',
          version: '0.5.0',
          staticTools: [{ name: 'static_healthcheck', payload: { ok: true } }],
        },
      ],
    }), 'utf8');

    try {
      const result = await loadWcfMcpRuntimeConfig({
        cwd: tmpDir,
        configPath: configFile,
      });
      expect(result.plugins.length).toBe(3);
      expect(result.plugins.some((plugin) => plugin.name === 'config-data-sources')).toBe(true);
      expect(result.plugins.some((plugin) => plugin.name === 'module-plugin')).toBe(true);
      expect(result.plugins.some((plugin) => plugin.name === 'static-plugin')).toBe(true);

      const rootPlugin = result.plugins.find((plugin) => plugin.name === 'config-data-sources');
      expect(rootPlugin?.dataSources?.[0]).toMatchObject({
        fileName: 'design-tokens.json',
        path: rootDesignTokensPath,
      });

      const modulePlugin = result.plugins.find((plugin) => plugin.name === 'module-plugin');
      expect(modulePlugin?.dataSources?.[0]).toMatchObject({
        fileName: 'guidelines-index.json',
        path: pluginGuidelinesPath,
      });
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

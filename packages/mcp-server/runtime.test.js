import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { z } from 'zod';
import {
  MAX_TOOL_RESULT_BYTES,
  PLUGIN_CONTRACT_VERSION,
  buildPluginDataSourceMap,
  createMcpServer,
  measureToolResultBytes,
  normalizePlugins,
} from './core.mjs';
import { createServer, loadTextDataFromPath, loadWcfMcpRuntimeConfig } from './server.mjs';
import { createPluginTestPair, loadBundledJson, loadBundledText } from './test-support.js';

describe('plugin extensibility', () => {
  it('exports PLUGIN_CONTRACT_VERSION as semver string', () => {
    expect(PLUGIN_CONTRACT_VERSION).toBe('1.4.0');
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

  it('accepts extended data source keys for selector guide, skills registry, and llms text', () => {
    const normalized = normalizePlugins([
      {
        name: 'extended-data-plugin',
        version: '1.0.0',
        dataSources: [
          { fileName: 'component-selector-guide.json', path: '/tmp/component-selector-guide.json' },
          { fileName: 'skills-registry.json', path: '/tmp/skills-registry.json' },
          { fileName: 'llms-full.txt', path: '/tmp/llms-full.txt' },
        ],
      },
    ]);

    expect(normalized[0].dataSources).toHaveLength(3);
  });

  it('normalizes validator hooks and rejects invalid validators', () => {
    const normalized = normalizePlugins([
      {
        name: 'validator-plugin',
        version: '1.0.0',
        validators: [
          {
            name: 'heading_rule',
            handler: () => [],
          },
        ],
      },
    ]);

    expect(normalized[0].validators).toHaveLength(1);
    expect(normalized[0].validators[0].name).toBe('heading_rule');

    expect(() => normalizePlugins([
      {
        name: 'bad-validator-plugin',
        version: '1.0.0',
        validators: [{ name: 'missing_handler' }],
      },
    ])).toThrow(/needs handler/);
  });

  it('normalizes plugin prompts/resources and rejects collisions', () => {
    const normalized = normalizePlugins([
      {
        name: 'prompt-resource-plugin',
        version: '1.0.0',
        prompts: [
          { name: 'custom_prompt', argsSchema: z.object({ audience: z.string().optional() }), text: 'hello' },
        ],
        resources: [
          { name: 'custom_resource', uri: 'plugin://custom', text: 'world' },
        ],
        resourceTemplates: [
          { name: 'custom_template', uriTemplate: 'plugin://custom/{slug}', text: 'template body' },
        ],
      },
    ]);

    expect(normalized[0].prompts).toHaveLength(1);
    expect(normalized[0].resources).toHaveLength(1);
    expect(normalized[0].resourceTemplates).toHaveLength(1);

    expect(() => normalizePlugins([
      {
        name: 'bad-prompt-plugin',
        version: '1.0.0',
        prompts: [{ name: 'figma_to_wcf', text: 'collision' }],
      },
    ])).toThrow(/prompt name collision/);

    expect(() => normalizePlugins([
      {
        name: 'bad-resource-plugin',
        version: '1.0.0',
        resources: [{ name: 'dup', uri: 'wcf://components', text: 'collision' }],
      },
    ])).toThrow(/resource uri collision/);

    expect(() => normalizePlugins([
      {
        name: 'bad-resource-template-plugin',
        version: '1.0.0',
        resourceTemplates: [{ name: 'dup-template', uriTemplate: 'wcf://guidelines/{topic}', text: 'collision' }],
      },
    ])).toThrow(/resourceTemplate uri collision/);
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

  it('uses text data source override for llms-full resource', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-mcp-plugin-text-'));
    const customLlmsPath = path.join(tmpDir, 'llms-full.override.txt');
    await fs.writeFile(customLlmsPath, 'custom llms text', 'utf8');

    const loadJsonData = async (fileName) => loadBundledJson(fileName);
    const loadValidator = async () => ({
      collectCemCustomElements: () => new Map(),
      validateTextAgainstCem: () => [],
      detectTokenMisuseInInlineStyles: () => [],
      detectAccessibilityMisuseInMarkup: () => [],
    });

    try {
      const { server } = await createMcpServer(loadJsonData, loadValidator, {
        plugins: [{
          name: 'text-override-plugin',
          version: '1.0.0',
          dataSources: [{ fileName: 'llms-full.txt', path: customLlmsPath }],
          tools: [],
        }],
        loadTextData: loadBundledText,
        loadTextDataFromPath,
      });
      const client = new Client(
        { name: 'wcf-mcp-runtime-test', version: '0.0.0' },
        { capabilities: {} },
      );
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

      await Promise.all([
        server.connect(serverTransport),
        client.connect(clientTransport),
      ]);

      const resource = await client.readResource({ uri: 'wcf://llms-full' });
      expect(resource.contents?.[0]?.text).toBe('custom llms text');

      await Promise.allSettled([client?.close?.(), server?.close?.()]);
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

  it('runs validator hook during validate_markup', async () => {
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'validator-hook-plugin',
        version: '1.0.0',
        validators: [{
          name: 'heading_validator',
          handler() {
            return [{
              code: 'pluginHeadingCheck',
              message: 'Custom heading issue',
            }];
          },
        }],
      }],
    });
    try {
      const result = await client.callTool({
        name: 'validate_markup',
        arguments: { html: '<dads-button>OK</dads-button>' },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      const diag = payload.diagnostics.find((item) => item.code === 'pluginHeadingCheck');
      expect(diag).toBeDefined();
      expect(diag.plugin).toBe('validator-hook-plugin');
      expect(diag.validator).toBe('heading_validator');
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('runs validator hook during validate_files', async () => {
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'validator-hook-plugin',
        version: '1.0.0',
        validators: [{
          name: 'file_validator',
          handler({ filePath }) {
            return [{
              file: filePath,
              code: 'pluginFileCheck',
              message: 'Custom file issue',
            }];
          },
        }],
      }],
    });
    try {
      const result = await client.callTool({
        name: 'validate_files',
        arguments: {
          files: [{ path: 'inline.html', content: '<dads-button>OK</dads-button>' }],
        },
      });
      const payload = JSON.parse(String(result.content?.[0]?.text ?? '{}'));
      expect(payload.files[0].diagnostics.some((item) => item.code === 'pluginFileCheck')).toBe(true);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('registers plugin prompt and static resource via MCP', async () => {
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'prompt-resource-plugin',
        version: '1.0.0',
        prompts: [{
          name: 'custom_prompt',
          title: 'Custom Prompt',
          argsSchema: {
            audience: z.string().optional(),
          },
          text: 'Use the custom workflow.',
        }],
        resources: [{
          name: 'custom_resource',
          uri: 'plugin://custom-resource',
          mimeType: 'text/plain',
          text: 'Custom resource body',
        }],
        resourceTemplates: [{
          name: 'custom_template',
          uriTemplate: 'plugin://custom-template/{slug}',
          complete: {
            slug: ['alpha', 'beta'],
          },
          async handler({ uri, variables }) {
            return {
              contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({ slug: variables.slug }, null, 2),
              }],
            };
          },
        }],
      }],
    });
    try {
      const prompts = await client.listPrompts();
      expect(prompts.prompts.some((item) => item.name === 'custom_prompt')).toBe(true);
      const customPrompt = prompts.prompts.find((item) => item.name === 'custom_prompt');
      expect(customPrompt.arguments?.some((arg) => arg.name === 'audience')).toBe(true);

      const prompt = await client.getPrompt({ name: 'custom_prompt', arguments: {} });
      const text = prompt.messages.map((message) => message.content.type === 'text' ? message.content.text : '').join('\n');
      expect(text).toContain('custom workflow');

      const resource = await client.readResource({ uri: 'plugin://custom-resource' });
      expect(resource.contents?.[0]?.text).toBe('Custom resource body');

      const templates = await client.listResourceTemplates();
      expect(templates.resourceTemplates.some((item) => item.uriTemplate === 'plugin://custom-template/{slug}')).toBe(true);
      const templated = await client.readResource({ uri: 'plugin://custom-template/alpha' });
      expect(templated.contents?.[0]?.text).toContain('"alpha"');
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

  it('bounds oversized raw MCP results returned by plugin handlers', async () => {
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'raw-result-plugin',
        version: '1.0.0',
        tools: [{
          name: 'raw_result_test',
          description: 'Return a raw MCP result',
          async handler() {
            return {
              content: [{
                type: 'text',
                text: 'x'.repeat(120 * 1024),
              }],
            };
          },
        }],
      }],
    });
    try {
      const result = await client.callTool({ name: 'raw_result_test', arguments: {} });
      expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
      expect(result.isError).toBeUndefined();
      expect(result.structuredContent).toEqual({
        warning: {
          code: 'TOOL_RESULT_TOO_LARGE',
          message: 'Tool result exceeded the response size limit; returning metadata only.',
          actualBytes: expect.any(Number),
          limitBytes: MAX_TOOL_RESULT_BYTES,
        },
      });
      expect(JSON.parse(String(result.content?.[0]?.text ?? '{}'))).toEqual(result.structuredContent);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });

  it('preserves isError when oversized raw MCP error results are bounded', async () => {
    const { client, server } = await createPluginTestPair({
      plugins: [{
        name: 'raw-error-result-plugin',
        version: '1.0.0',
        tools: [{
          name: 'raw_error_result_test',
          description: 'Return an oversized raw MCP error result',
          async handler() {
            return {
              content: [{
                type: 'text',
                text: 'x'.repeat(120 * 1024),
              }],
              isError: true,
            };
          },
        }],
      }],
    });
    try {
      const result = await client.callTool({ name: 'raw_error_result_test', arguments: {} });
      expect(measureToolResultBytes(result)).toBeLessThanOrEqual(MAX_TOOL_RESULT_BYTES);
      expect(result.isError).toBe(true);
      expect(result.structuredContent).toEqual({
        warning: {
          code: 'TOOL_RESULT_TOO_LARGE',
          message: 'Tool result exceeded the response size limit; returning metadata only.',
          actualBytes: expect.any(Number),
          limitBytes: MAX_TOOL_RESULT_BYTES,
        },
      });
      expect(JSON.parse(String(result.content?.[0]?.text ?? '{}'))).toEqual(result.structuredContent);
    } finally {
      await Promise.allSettled([client?.close?.(), server?.close?.()]);
    }
  });
});

describe('runtime config loader', () => {
  it('createServer resolves the default config from the provided cwd', async () => {
    const tmpDir = await fs.mkdtemp(path.join(process.cwd(), '.tmp-wcf-mcp-loaders-'));
    try {
      const registryDir = path.join(tmpDir, 'registry');
      const configPath = path.join(tmpDir, 'wcf-mcp.config.json');
      await fs.mkdir(registryDir, { recursive: true });
      await Promise.all([
        fs.copyFile(path.join(process.cwd(), 'custom-elements.json'), path.join(tmpDir, 'custom-elements.json')),
        fs.copyFile(path.join(process.cwd(), 'registry', 'install-registry.json'), path.join(registryDir, 'install-registry.json')),
        fs.copyFile(path.join(process.cwd(), 'registry', 'pattern-registry.json'), path.join(registryDir, 'pattern-registry.json')),
      ]);
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

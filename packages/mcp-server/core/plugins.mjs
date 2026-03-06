/**
 * core/plugins.mjs — Plugin runtime: normalization, validation, and data source mapping.
 */

import { z } from 'zod';
import { PLUGIN_TOOL_NOTICE } from './constants.mjs';

export const PLUGIN_CONTRACT_VERSION = '1.1.0';

// Single-module constants (DD-14)
const PLUGIN_DATA_SOURCE_KEYS = Object.freeze(new Set([
  'custom-elements.json',
  'install-registry.json',
  'pattern-registry.json',
  'design-tokens.json',
  'guidelines-index.json',
]));
const BUILTIN_TOOL_NAMES = Object.freeze(new Set([
  'get_design_system_overview',
  'list_components',
  'search_icons',
  'get_component_api',
  'generate_usage_snippet',
  'get_install_recipe',
  'validate_markup',
  'list_patterns',
  'get_pattern_recipe',
  'generate_pattern_snippet',
  'get_design_tokens',
  'get_design_token_detail',
  'get_accessibility_docs',
  'search_guidelines',
  'generate_full_page_html',
  'get_component_selector_guide',
]));

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toPluginErrorMessage(name, reason) {
  return `Invalid plugin (${name}): ${reason}`;
}

/**
 * Convert a plugin tool's inputSchema to a passthrough Zod schema.
 * Handles three cases:
 *  - Already a Zod schema instance (has _def or _zod) → apply .passthrough()
 *  - Plain object (raw shape map) → wrap with z.object().passthrough()
 *  - Falsy / empty → z.object({}).passthrough()
 */
export function toPassthroughSchema(schema) {
  if (schema && (schema._def || schema._zod)) {
    // Already a Zod schema — apply passthrough if it's an object type
    return typeof schema.passthrough === 'function'
      ? schema.passthrough()
      : schema;
  }
  return z.object(schema ?? {}).passthrough();
}

function normalizePluginDataSources(pluginName, dataSources) {
  if (!Array.isArray(dataSources)) return [];
  const out = [];
  for (const entry of dataSources) {
    if (!isPlainObject(entry)) {
      throw new Error(toPluginErrorMessage(pluginName, 'dataSources entries must be objects'));
    }
    const fileName = String(entry.fileName ?? '').trim();
    const sourcePath = String(entry.path ?? '').trim();
    if (!fileName || !sourcePath) {
      throw new Error(toPluginErrorMessage(pluginName, 'dataSources entries require fileName and path'));
    }
    if (!PLUGIN_DATA_SOURCE_KEYS.has(fileName)) {
      throw new Error(toPluginErrorMessage(pluginName, `unsupported data source key: ${fileName}`));
    }
    out.push({ fileName, path: sourcePath });
  }
  return out;
}

function normalizePluginTools(pluginName, tools) {
  if (!Array.isArray(tools)) return [];
  const out = [];
  for (const rawTool of tools) {
    if (!isPlainObject(rawTool)) {
      throw new Error(toPluginErrorMessage(pluginName, 'tools entries must be objects'));
    }
    const name = String(rawTool.name ?? '').trim();
    if (!name) throw new Error(toPluginErrorMessage(pluginName, 'tool.name is required'));
    const hasHandler = typeof rawTool.handler === 'function';
    const hasStaticPayload = Object.prototype.hasOwnProperty.call(rawTool, 'staticPayload');
    if (!hasHandler && !hasStaticPayload) {
      throw new Error(toPluginErrorMessage(pluginName, `tool "${name}" needs handler or staticPayload`));
    }
    // When both are specified, handler takes priority (contract v1: handler-wins)
    // staticPayload is ignored silently.
    const description = String(rawTool.description ?? '').trim() ||
      `Plugin tool provided by ${pluginName}. ${PLUGIN_TOOL_NOTICE}`;
    const inputSchema = isPlainObject(rawTool.inputSchema) ? rawTool.inputSchema : {};
    out.push({
      name,
      description,
      inputSchema,
      handler: hasHandler ? rawTool.handler : undefined,
      staticPayload: hasStaticPayload ? rawTool.staticPayload : undefined,
    });
  }
  return out;
}

export function normalizePlugins(plugins = []) {
  if (!Array.isArray(plugins)) throw new Error('Invalid plugin configuration: plugins must be an array');
  const normalized = [];
  const seenPluginNames = new Set();
  const seenToolNames = new Set(BUILTIN_TOOL_NAMES);

  for (const rawPlugin of plugins) {
    if (!isPlainObject(rawPlugin)) throw new Error('Invalid plugin configuration: each plugin must be an object');
    const name = String(rawPlugin.name ?? '').trim();
    const version = String(rawPlugin.version ?? '').trim();
    if (!name || !version) throw new Error('Invalid plugin configuration: plugin.name and plugin.version are required');
    if (seenPluginNames.has(name)) throw new Error(`Duplicate plugin name: ${name}`);
    seenPluginNames.add(name);

    const tools = normalizePluginTools(name, rawPlugin.tools);
    for (const tool of tools) {
      if (seenToolNames.has(tool.name)) {
        throw new Error(toPluginErrorMessage(name, `tool name collision: ${tool.name}`));
      }
      seenToolNames.add(tool.name);
    }

    const dataSources = normalizePluginDataSources(name, rawPlugin.dataSources);
    normalized.push({ name, version, tools, dataSources });
  }

  return normalized;
}

export function buildPluginDataSourceMap(plugins = []) {
  const out = new Map();
  for (const plugin of plugins) {
    const pluginName = String(plugin?.name ?? 'unknown-plugin');
    const dataSources = Array.isArray(plugin?.dataSources) ? plugin.dataSources : [];
    for (const source of dataSources) {
      const fileName = String(source?.fileName ?? '').trim();
      const sourcePath = String(source?.path ?? '').trim();
      if (!fileName || !sourcePath) continue;
      if (out.has(fileName)) {
        const prev = out.get(fileName);
        throw new Error(`Duplicate data source override for ${fileName} (${prev.pluginName}, ${pluginName})`);
      }
      out.set(fileName, { path: sourcePath, pluginName });
    }
  }
  return out;
}

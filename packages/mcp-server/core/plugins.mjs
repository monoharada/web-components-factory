/**
 * core/plugins.mjs — Plugin runtime: normalization, validation, and data source mapping.
 */

import { z } from 'zod';
import { PLUGIN_TOOL_NOTICE } from './constants.mjs';

export const PLUGIN_CONTRACT_VERSION = '1.4.0';

// Single-module constants (DD-14)
const PLUGIN_DATA_SOURCE_KEYS = Object.freeze(new Set([
  'custom-elements.json',
  'install-registry.json',
  'pattern-registry.json',
  'component-selector-guide.json',
  'design-tokens.json',
  'guidelines-index.json',
  'skills-registry.json',
  'llms-full.txt',
]));
export const BUILTIN_TOOL_NAMES = Object.freeze(new Set([
  'get_design_system_overview',
  'list_components',
  'search_icons',
  'get_component_api',
  'generate_usage_snippet',
  'get_install_recipe',
  'validate_markup',
  'validate_files',
  'validate_project',
  'list_patterns',
  'get_pattern_recipe',
  'generate_pattern_snippet',
  'get_design_tokens',
  'get_design_token_detail',
  'get_accessibility_docs',
  'search_guidelines',
  'search_design_system_knowledge',
  'generate_full_page_html',
  'get_component_selector_guide',
]));
const BUILTIN_PROMPT_NAMES = Object.freeze(new Set([
  'figma_to_wcf',
  'build_page',
]));
const BUILTIN_RESOURCE_URIS = Object.freeze(new Set([
  'wcf://components',
  'wcf://tokens',
  'wcf://guidelines/{topic}',
  'wcf://llms-full',
  'wcf://skills',
]));
const BUILTIN_RESOURCE_TEMPLATE_URIS = Object.freeze(new Set([
  'wcf://guidelines/{topic}',
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

function normalizePluginValidators(pluginName, validators) {
  if (!Array.isArray(validators)) return [];
  const out = [];
  const seen = new Set();
  for (const rawValidator of validators) {
    if (!isPlainObject(rawValidator)) {
      throw new Error(toPluginErrorMessage(pluginName, 'validators entries must be objects'));
    }
    const name = String(rawValidator.name ?? '').trim();
    if (!name) throw new Error(toPluginErrorMessage(pluginName, 'validator.name is required'));
    if (seen.has(name)) {
      throw new Error(toPluginErrorMessage(pluginName, `duplicate validator name: ${name}`));
    }
    seen.add(name);
    if (typeof rawValidator.handler !== 'function') {
      throw new Error(toPluginErrorMessage(pluginName, `validator "${name}" needs handler`));
    }
    out.push({
      name,
      description: String(rawValidator.description ?? '').trim() || `Validator hook provided by ${pluginName}.`,
      handler: rawValidator.handler,
    });
  }
  return out;
}

function normalizePluginPrompts(pluginName, prompts) {
  if (!Array.isArray(prompts)) return [];
  const out = [];
  const seen = new Set();
  for (const rawPrompt of prompts) {
    if (!isPlainObject(rawPrompt)) {
      throw new Error(toPluginErrorMessage(pluginName, 'prompts entries must be objects'));
    }
    const name = String(rawPrompt.name ?? '').trim();
    if (!name) throw new Error(toPluginErrorMessage(pluginName, 'prompt.name is required'));
    if (seen.has(name)) {
      throw new Error(toPluginErrorMessage(pluginName, `duplicate prompt name: ${name}`));
    }
    seen.add(name);
    const hasHandler = typeof rawPrompt.handler === 'function';
    const hasStaticText = typeof rawPrompt.text === 'string';
    if (!hasHandler && !hasStaticText) {
      throw new Error(toPluginErrorMessage(pluginName, `prompt "${name}" needs handler or text`));
    }
    out.push({
      name,
      title: String(rawPrompt.title ?? name).trim(),
      description: String(rawPrompt.description ?? '').trim() || `Prompt provided by ${pluginName}.`,
      argsSchema: isPlainObject(rawPrompt.argsSchema) ? rawPrompt.argsSchema : {},
      handler: hasHandler ? rawPrompt.handler : undefined,
      text: hasStaticText ? rawPrompt.text : undefined,
    });
  }
  return out;
}

function normalizePluginResources(pluginName, resources) {
  if (!Array.isArray(resources)) return [];
  const out = [];
  const seenNames = new Set();
  const seenUris = new Set();
  for (const rawResource of resources) {
    if (!isPlainObject(rawResource)) {
      throw new Error(toPluginErrorMessage(pluginName, 'resources entries must be objects'));
    }
    const name = String(rawResource.name ?? '').trim();
    const uri = String(rawResource.uri ?? '').trim();
    if (!name) throw new Error(toPluginErrorMessage(pluginName, 'resource.name is required'));
    if (!uri) throw new Error(toPluginErrorMessage(pluginName, `resource "${name}" needs uri`));
    if (seenNames.has(name)) {
      throw new Error(toPluginErrorMessage(pluginName, `duplicate resource name: ${name}`));
    }
    if (seenUris.has(uri)) {
      throw new Error(toPluginErrorMessage(pluginName, `duplicate resource uri: ${uri}`));
    }
    seenNames.add(name);
    seenUris.add(uri);
    const hasHandler = typeof rawResource.handler === 'function';
    const hasText = typeof rawResource.text === 'string';
    const hasPayload = Object.prototype.hasOwnProperty.call(rawResource, 'payload');
    if (!hasHandler && !hasText && !hasPayload) {
      throw new Error(toPluginErrorMessage(pluginName, `resource "${name}" needs handler, text, or payload`));
    }
    out.push({
      name,
      uri,
      title: String(rawResource.title ?? name).trim(),
      description: String(rawResource.description ?? '').trim() || `Resource provided by ${pluginName}.`,
      mimeType: String(rawResource.mimeType ?? '').trim() || undefined,
      handler: hasHandler ? rawResource.handler : undefined,
      text: hasText ? rawResource.text : undefined,
      payload: hasPayload ? rawResource.payload : undefined,
    });
  }
  return out;
}

function normalizePluginResourceTemplates(pluginName, resourceTemplates) {
  if (!Array.isArray(resourceTemplates)) return [];
  const out = [];
  const seenNames = new Set();
  const seenTemplates = new Set();
  for (const rawTemplate of resourceTemplates) {
    if (!isPlainObject(rawTemplate)) {
      throw new Error(toPluginErrorMessage(pluginName, 'resourceTemplates entries must be objects'));
    }
    const name = String(rawTemplate.name ?? '').trim();
    const uriTemplate = String(rawTemplate.uriTemplate ?? '').trim();
    if (!name) throw new Error(toPluginErrorMessage(pluginName, 'resourceTemplate.name is required'));
    if (!uriTemplate) throw new Error(toPluginErrorMessage(pluginName, `resourceTemplate "${name}" needs uriTemplate`));
    if (seenNames.has(name)) throw new Error(toPluginErrorMessage(pluginName, `duplicate resourceTemplate name: ${name}`));
    if (seenTemplates.has(uriTemplate)) throw new Error(toPluginErrorMessage(pluginName, `duplicate resourceTemplate uriTemplate: ${uriTemplate}`));
    seenNames.add(name);
    seenTemplates.add(uriTemplate);
    const hasHandler = typeof rawTemplate.handler === 'function';
    const hasText = typeof rawTemplate.text === 'string';
    const hasPayload = Object.prototype.hasOwnProperty.call(rawTemplate, 'payload');
    if (!hasHandler && !hasText && !hasPayload) {
      throw new Error(toPluginErrorMessage(pluginName, `resourceTemplate "${name}" needs handler, text, or payload`));
    }
    out.push({
      name,
      uriTemplate,
      title: String(rawTemplate.title ?? name).trim(),
      description: String(rawTemplate.description ?? '').trim() || `Resource template provided by ${pluginName}.`,
      mimeType: String(rawTemplate.mimeType ?? '').trim() || undefined,
      handler: hasHandler ? rawTemplate.handler : undefined,
      text: hasText ? rawTemplate.text : undefined,
      payload: hasPayload ? rawTemplate.payload : undefined,
      list: Array.isArray(rawTemplate.list) ? rawTemplate.list : undefined,
      complete: isPlainObject(rawTemplate.complete) ? rawTemplate.complete : undefined,
    });
  }
  return out;
}

export function normalizePlugins(plugins = []) {
  if (!Array.isArray(plugins)) throw new Error('Invalid plugin configuration: plugins must be an array');
  const normalized = [];
  const seenPluginNames = new Set();
  const seenToolNames = new Set(BUILTIN_TOOL_NAMES);
  const seenPromptNames = new Set(BUILTIN_PROMPT_NAMES);
  const seenResourceUris = new Set(BUILTIN_RESOURCE_URIS);
  const seenResourceTemplateUris = new Set(BUILTIN_RESOURCE_TEMPLATE_URIS);

  for (const rawPlugin of plugins) {
    if (!isPlainObject(rawPlugin)) throw new Error('Invalid plugin configuration: each plugin must be an object');
    const name = String(rawPlugin.name ?? '').trim();
    const version = String(rawPlugin.version ?? '').trim();
    if (!name || !version) throw new Error('Invalid plugin configuration: plugin.name and plugin.version are required');
    if (seenPluginNames.has(name)) throw new Error(`Duplicate plugin name: ${name}`);
    seenPluginNames.add(name);

    const tools = normalizePluginTools(name, rawPlugin.tools);
    const validators = normalizePluginValidators(name, rawPlugin.validators);
    const prompts = normalizePluginPrompts(name, rawPlugin.prompts);
    const resources = normalizePluginResources(name, rawPlugin.resources);
    const resourceTemplates = normalizePluginResourceTemplates(name, rawPlugin.resourceTemplates);
    for (const tool of tools) {
      if (seenToolNames.has(tool.name)) {
        throw new Error(toPluginErrorMessage(name, `tool name collision: ${tool.name}`));
      }
      seenToolNames.add(tool.name);
    }
    for (const prompt of prompts) {
      if (seenPromptNames.has(prompt.name)) {
        throw new Error(toPluginErrorMessage(name, `prompt name collision: ${prompt.name}`));
      }
      seenPromptNames.add(prompt.name);
    }
    for (const resource of resources) {
      if (seenResourceUris.has(resource.uri)) {
        throw new Error(toPluginErrorMessage(name, `resource uri collision: ${resource.uri}`));
      }
      seenResourceUris.add(resource.uri);
    }
    for (const resourceTemplate of resourceTemplates) {
      if (seenResourceTemplateUris.has(resourceTemplate.uriTemplate)) {
        throw new Error(toPluginErrorMessage(name, `resourceTemplate uri collision: ${resourceTemplate.uriTemplate}`));
      }
      seenResourceTemplateUris.add(resourceTemplate.uriTemplate);
    }

    const dataSources = normalizePluginDataSources(name, rawPlugin.dataSources);
    normalized.push({ name, version, tools, validators, prompts, resources, resourceTemplates, dataSources });
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

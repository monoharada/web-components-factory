/**
 * core/constants.mjs — Shared constants used across multiple core modules.
 *
 * Single-module constants live in their respective module (DD-14).
 */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageMeta = require('../package.json');

export const CANONICAL_PREFIX = 'dads';
export const MAX_PREFIX_LENGTH = 64;
export const STRUCTURED_CONTENT_DISABLE_FLAG = 'WCF_MCP_DISABLE_STRUCTURED_CONTENT';
export const MAX_TOOL_RESULT_BYTES = 100 * 1024;
export const PLUGIN_TOOL_NOTICE = 'Plugin tool (contract v1.4).';
export const PACKAGE_VERSION = String(packageMeta?.version ?? '0.0.0');

export const CATEGORY_MAP = {
  'dads-input-text': 'Form',
  'dads-textarea': 'Form',
  'dads-select': 'Form',
  'dads-checkbox': 'Form',
  'dads-radio': 'Form',
  'dads-switch': 'Form',
  'dads-combobox': 'Form',
  'dads-date-picker': 'Form',
  'dads-file-upload': 'Form',
  'dads-fieldset': 'Form',
  'dads-search-box': 'Form',
  'dads-calendar': 'Form',
  'dads-button': 'Actions',
  'dads-dialog': 'Actions',
  'dads-drawer': 'Actions',
  'dads-disclosure': 'Actions',
  'dads-accordion-details': 'Actions',
  'dads-accordion-item-details': 'Actions',
  'dads-breadcrumb': 'Navigation',
  'dads-breadcrumb-item': 'Navigation',
  'dads-page-navigation': 'Navigation',
  'dads-step-navigation': 'Navigation',
  'dads-step-navigation-item': 'Navigation',
  'dads-menu-list': 'Navigation',
  'dads-menu-list-item': 'Navigation',
  'dads-menu-list-box': 'Navigation',
  'dads-tab': 'Navigation',
  'dads-global-menu': 'Navigation',
  'dads-global-menu-item': 'Navigation',
  'dads-language-selector': 'Navigation',
  'dads-hamburger-menu-button': 'Navigation',
  'dads-utility-link': 'Navigation',
  'dads-mobile-menu': 'Navigation',
  'dads-card': 'Content',
  'dads-heading': 'Content',
  'dads-text': 'Content',
  'dads-blockquote': 'Content',
  'dads-code-block': 'Content',
  'dads-divider': 'Content',
  'dads-list': 'Content',
  'dads-list-item': 'Content',
  'dads-description-list': 'Content',
  'dads-resource-list': 'Content',
  'dads-table': 'Content',
  'dads-table-control': 'Content',
  'dads-avatar': 'Display',
  'dads-icon': 'Display',
  'dads-chip-label': 'Display',
  'dads-chip-tag': 'Display',
  'dads-notification-banner': 'Display',
  'dads-emergency-banner': 'Display',
  'dads-carousel': 'Display',
  'dads-layout-shell': 'Layout',
  'dads-layout-sidebar': 'Layout',
  'dads-layout-aside': 'Layout',
  'dads-header-container': 'Layout',
  'dads-device-mock': 'Display',
  'dads-progress-indicator': 'Display',
  'dads-spinner': 'Display',
  'dads-progress-bar': 'Display',
  'dads-loading-icon': 'Display',
};

export const FIGMA_TO_WCF_PROMPT = 'figma_to_wcf';
export const BUILD_PAGE_PROMPT = 'build_page';
export const WCF_RESOURCE_URIS = Object.freeze({
  components: 'wcf://components',
  tokens: 'wcf://tokens',
  guidelinesTemplate: 'wcf://guidelines/{topic}',
  llmsFull: 'wcf://llms-full',
  skills: 'wcf://skills',
});

const NPX_TEMPLATE = Object.freeze({
  command: 'npx',
  args: ['@monoharada/wcf-mcp'],
});

/**
 * Build the server-level instructions string sent to MCP clients on initialization.
 * This enables AI agents to immediately understand what the server offers and how to
 * build pages without any prior knowledge.
 */
export function buildServerInstructions(prefix, installRegistry, patterns) {
  const components = installRegistry?.components && typeof installRegistry.components === 'object'
    ? installRegistry.components : {};
  const componentIds = Object.keys(components).sort();
  const patternIds = patterns && typeof patterns === 'object'
    ? Object.keys(patterns).sort() : [];

  return [
    '# wcf-mcp: DADS Web Components Design System MCP Server',
    '',
    '## Capabilities',
    'This server provides a no-build / no-CDN Web Components design system.',
    'You can generate complete HTML pages using MCP tools alone — no CLI installation required.',
    '',
    '## Quickest Workflow (build a page)',
    '1. get_pattern_recipe({ patternId: "<id>", include: ["fullPage"] })',
    '   → Returns a complete <!DOCTYPE html> page in one call',
    '2. validate_markup({ html: "<the full page HTML>" }) → Validate the full page (catches missing importmap / boot script)',
    '3. Save the fullPageHtml result to a file and serve via HTTP',
    '',
    `## Available Pattern IDs (${patternIds.length})`,
    patternIds.length > 0 ? patternIds.join(', ') : '(none)',
    '',
    `## Available Component IDs (${componentIds.length})`,
    componentIds.length > 0 ? componentIds.join(', ') : '(none)',
    '',
    '## Custom Page Construction',
    '1. generate_usage_snippet({ component: "<componentId>" }) → Get HTML for each component',
    '2. generate_full_page_html({ html: "<combined fragments>" }) → Wrap into a complete page',
    '3. validate_markup({ html: "<the full page HTML>" }) → Validate the full page (catches missing importmap / boot script)',
    '',
    '## Important Notes',
    '- No CDN exists. All files are served from a local vendor directory.',
    `- CLI setup: npm install web-components-factory → npx wcf init --prefix ${prefix}`,
    '- file:// protocol does not work. An HTTP server is required.',
    '',
    '## Prompts',
    '- build_page: Guided prompt for building a no-build HTML page',
    '- figma_to_wcf: Convert Figma designs to WCF implementation',
  ].join('\n');
}

export const IDE_SETUP_TEMPLATES = Object.freeze([
  {
    ide: 'Claude Desktop',
    configPath: 'claude_desktop_config.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
  {
    ide: 'Claude Code',
    configPath: '.mcp.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
  {
    ide: 'Cursor',
    configPath: '.cursor/mcp.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
  {
    ide: 'VS Code (GitHub Copilot)',
    configPath: '.vscode/mcp.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
  {
    ide: 'Windsurf',
    configPath: '.windsurf/mcp_config.json',
    snippet: {
      mcpServers: {
        wcf: NPX_TEMPLATE,
      },
    },
  },
]);

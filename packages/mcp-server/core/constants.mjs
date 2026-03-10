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

import { describe, expect, it } from 'vitest';
import { BUILTIN_TOOL_NAMES } from './core/plugins.mjs';
import { FIGMA_TO_WCF_PROMPT, WCF_RESOURCE_URIS } from './core/constants.mjs';
import { buildMcpSpecSummary } from '../../scripts/mcp/generate-mcp-spec-summary.mjs';
import { collectResponseSizeReport } from '../../scripts/mcp/check-response-size.mjs';
import { verifyReadmeExamples } from '../../scripts/mcp/verify-readme-examples.mjs';

describe('mcp tooling scripts', () => {
  it('verify-readme-examples tracks the current built-in tool inventory', async () => {
    const report = await verifyReadmeExamples();
    expect(report.errorCount).toBe(0);
    expect(report.requestBlocks).toBeGreaterThan(0);
    expect(report.knownToolCount).toBe(BUILTIN_TOOL_NAMES.size);
  });

  it('check-response-size returns machine-readable summary', async () => {
    const report = await collectResponseSizeReport();
    expect(report.schemaVersion).toBe('1.0');
    expect(report.summary.totalChecks).toBe(report.checks.length);
    expect(report.thresholds.maxResponseBytes).toBeGreaterThan(0);
    expect(report.summary.status).toBe('OK');
  });

  it('generate-mcp-spec-summary reflects the current MCP inventory', async () => {
    const summary = await buildMcpSpecSummary();
    expect(summary.inventory.toolCount).toBe(BUILTIN_TOOL_NAMES.size);
    expect(summary.inventory.tools).toContain('generate_full_page_html');
    expect(summary.inventory.tools).toContain('get_component_selector_guide');
    expect(summary.inventory.prompts).toEqual([FIGMA_TO_WCF_PROMPT]);
    expect(summary.inventory.resourceCount).toBe(Object.keys(WCF_RESOURCE_URIS).length);
    expect(summary.checks.readmeExamples.status).toBe('OK');
    expect(summary.checks.responseSize.summary.status).toBe('OK');
  });
});

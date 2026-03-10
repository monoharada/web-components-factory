/**
 * Sample plugin for wcf-mcp (Plugin Contract v1).
 * Demonstrates:
 *  - Custom tool with handler
 *  - Validator hook used by validate_markup / validate_files / validate_project
 *  - Static prompt and resource hooks
 *  - Resource template hook
 *  - Custom tool using handler context (helpers.loadJsonData)
 *  - dataSources override for guidelines-index.json
 */

function detectSkippedHeadingLevel(html = '') {
  const headingMatches = [...String(html).matchAll(/<h([1-6])\b/gi)];
  const levels = headingMatches.map((match) => Number(match[1]));
  const diagnostics = [];
  for (let index = 1; index < levels.length; index += 1) {
    const prev = levels[index - 1];
    const curr = levels[index];
    if (curr > prev + 1) {
      diagnostics.push({
        code: 'skippedHeadingLevel',
        message: `Heading level jumps from h${prev} to h${curr}.`,
        index,
      });
    }
  }
  return diagnostics;
}

export default {
  name: 'custom-validation-plugin',
  version: '0.2.0',
  dataSources: [
    {
      fileName: 'guidelines-index.json',
      path: './custom-guidelines.json',
    },
  ],
  validators: [
    {
      name: 'heading_structure',
      description: 'Warn on skipped heading levels during validate_* flows.',
      async handler({ text, filePath }) {
        const diagnostics = detectSkippedHeadingLevel(text).map((item) => ({
          file: filePath,
          severity: 'warning',
          code: item.code,
          message: item.message,
          hint: 'Use sequential heading levels (e.g. h2 -> h3).',
        }));
        return { diagnostics };
      },
    },
  ],
  prompts: [
    {
      name: 'custom_validation_workflow',
      title: 'Custom Validation Workflow',
      argsSchema: {
        audience: {
          type: 'string',
          description: 'Optional audience label',
        },
      },
      text: 'Run validate_markup, then validate_files for page-level issues, then inspect custom guidelines.',
    },
  ],
  resources: [
    {
      name: 'custom_validation_notes',
      uri: 'plugin://custom-validation/notes',
      mimeType: 'text/plain',
      text: 'Custom validation plugin loaded. Use validate_heading_structure for manual checks.',
    },
  ],
  resourceTemplates: [
    {
      name: 'custom_guideline_template',
      uriTemplate: 'plugin://custom-validation/guidelines/{slug}',
      complete: {
        slug: ['headings', 'forms'],
      },
      async handler({ uri, variables }) {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              slug: variables?.slug ?? '',
              note: 'Custom guideline template resource',
            }, null, 2),
          }],
        };
      },
    },
  ],
  tools: [
    {
      name: 'validate_heading_structure',
      description:
        'Validate heading order in HTML. When: reviewing content hierarchy. Returns: diagnostics for skipped heading levels. After: fix heading structure before publication.',
      inputSchema: {},
      async handler(args = {}) {
        const html = String(args?.html ?? '');
        const diagnostics = detectSkippedHeadingLevel(html);
        return {
          diagnostics,
          total: diagnostics.length,
          ok: diagnostics.length === 0,
        };
      },
    },
    {
      name: 'list_custom_guidelines',
      description:
        'List custom organization guidelines. When: discovering org-specific guidelines. Returns: guideline document titles and topics.',
      async handler(_args, { helpers }) {
        const data = await helpers.loadJsonData('guidelines-index.json');
        const documents = Array.isArray(data?.documents) ? data.documents : [];
        return {
          total: documents.length,
          documents: documents.map((doc) => ({
            id: doc.id,
            title: doc.title,
            topic: doc.topic,
          })),
        };
      },
    },
  ],
};

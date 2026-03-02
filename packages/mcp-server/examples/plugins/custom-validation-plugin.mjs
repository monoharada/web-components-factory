/**
 * Sample plugin for wcf-mcp (Plugin Contract v1).
 * Demonstrates:
 *  - Custom tool with handler
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

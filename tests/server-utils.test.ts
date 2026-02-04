import { describe, expect, test } from 'vitest';
import { rewriteModuleSpecifiers } from '../server-utils';

describe('rewriteModuleSpecifiers', () => {
  test('adds min=1 to relative and absolute specifiers only', () => {
    const input = [
      "import x from './mod.js';",
      "export { y } from '/abs/mod.js';",
      "import { z } from 'lit';",
      "import('./dyn.js');",
    ].join('\n');

    const output = rewriteModuleSpecifiers(input);

    expect(output).toContain("import x from './mod.js?min=1';");
    expect(output).toContain("export { y } from '/abs/mod.js?min=1';");
    expect(output).toContain("import { z } from 'lit';");
    expect(output).toContain("import('./dyn.js?min=1');");
  });

  test('overrides existing min and preserves hash', () => {
    const input = "import mod from './mod.js?min=0#hash';";
    const output = rewriteModuleSpecifiers(input);

    expect(output).toContain("import mod from './mod.js?min=1#hash';");
  });

  test('handles minified import/export without spaces', () => {
    const input = [
      'import{a}from\"./a.js\";',
      'export*from\"/b.js\";',
    ].join('\\n');

    const output = rewriteModuleSpecifiers(input);

    expect(output).toContain('import{a}from\"./a.js?min=1\";');
    expect(output).toContain('export*from\"/b.js?min=1\";');
  });
});

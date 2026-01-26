import { describe, it, expect } from 'vitest';
import { validateTextAgainstCem } from '../scripts/wc/validator-core.mjs';

describe('validateTextAgainstCem diagnostics schema', () => {
  it('returns unknownElement with file+range+code+message+tagName', () => {
    const cem = new Map();
    const diags = validateTextAgainstCem({
      filePath: 'x.html',
      text: '<dads-unknown></dads-unknown>',
      cem,
      severity: { unknownElement: 'error' },
    });

    expect(diags).toHaveLength(1);
    expect(diags[0]).toMatchObject({
      file: 'x.html',
      severity: 'error',
      code: 'unknownElement',
      tagName: 'dads-unknown',
    });
    expect(diags[0].range.start).toEqual({ line: 1, col: 2 });
    expect(diags[0].range.end).toEqual({ line: 1, col: 14 });
  });

  it('returns unknownAttribute with file+range+code+message+tagName+attrName', () => {
    const cem = new Map([['dads-foo', { attributes: new Set(['bar']) }]]);
    const diags = validateTextAgainstCem({
      filePath: 'x.html',
      text: '<dads-foo baz></dads-foo>',
      cem,
      severity: { unknownAttribute: 'warning' },
    });

    expect(diags).toHaveLength(1);
    expect(diags[0]).toMatchObject({
      file: 'x.html',
      severity: 'warning',
      code: 'unknownAttribute',
      tagName: 'dads-foo',
      attrName: 'baz',
    });
    expect(diags[0].range.start).toEqual({ line: 1, col: 11 });
    expect(diags[0].range.end).toEqual({ line: 1, col: 14 });
  });

  it('handles attributes that start at the beginning of a new line (regression)', () => {
    const cem = new Map([['dads-foo', { attributes: new Set(['bar']) }]]);
    const diags = validateTextAgainstCem({
      filePath: 'x.html',
      text: '<dads-foo\nbaz></dads-foo>',
      cem,
      severity: { unknownAttribute: 'warning' },
    });

    expect(diags).toHaveLength(1);
    expect(diags[0]).toMatchObject({
      file: 'x.html',
      severity: 'warning',
      code: 'unknownAttribute',
      tagName: 'dads-foo',
      attrName: 'baz',
    });
    expect(diags[0].range.start).toEqual({ line: 2, col: 1 });
    expect(diags[0].range.end).toEqual({ line: 2, col: 4 });
  });

  it('returns forbiddenAttribute with file+range+code+message+tagName+attrName', () => {
    const cem = new Map();
    const diags = validateTextAgainstCem({
      filePath: 'x.html',
      text: '<input placeholder="x">',
      cem,
      severity: { unknownElement: 'error', unknownAttribute: 'warning' },
    });

    expect(diags).toHaveLength(1);
    expect(diags[0]).toMatchObject({
      file: 'x.html',
      severity: 'error',
      code: 'forbiddenAttribute',
      tagName: 'input',
      attrName: 'placeholder',
    });
    expect(diags[0].message).toContain('Forbidden attribute');
    expect(diags[0].range.start).toEqual({ line: 1, col: 8 });
    expect(diags[0].range.end).toEqual({ line: 1, col: 19 });
  });
});

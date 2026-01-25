import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

describe('custom-elements.json (CEM) sanity', () => {
  it('does not contain bogus inherited "type" events', async () => {
    const text = await fs.readFile(path.resolve(process.cwd(), 'custom-elements.json'), 'utf8');
    const cem = JSON.parse(text);

    for (const mod of cem.modules ?? []) {
      for (const decl of mod.declarations ?? []) {
        const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
        if (!isCustomElement) continue;

        const events = Array.isArray(decl.events) ? decl.events : [];
        const hasBogusTypeEvent = events.some((e: unknown) => {
          if (!e || typeof e !== 'object') return false;
          return (e as { name?: unknown }).name === 'type';
        });
        expect(hasBogusTypeEvent, `${decl.tagName ?? decl.name ?? '<unknown>'} has event "type"`).toBe(
          false,
        );
      }
    }
  });

  it('ensures custom elements always have a non-empty tagName', async () => {
    const text = await fs.readFile(path.resolve(process.cwd(), 'custom-elements.json'), 'utf8');
    const cem = JSON.parse(text);

    for (const mod of cem.modules ?? []) {
      for (const decl of mod.declarations ?? []) {
        const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
        if (!isCustomElement) continue;

        const tagName = typeof decl.tagName === 'string' ? decl.tagName.trim() : '';
        expect(tagName, `${decl.name ?? '<unknown>'} is missing tagName`).not.toBe('');
      }
    }
  });
});

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { A11yAnnotations } from '../../packages/utils/a11y-annotations.js';

let cached: Map<string, A11yAnnotations> | null = null;

function loadCemAnnotations(): Map<string, A11yAnnotations> {
  if (cached) return cached;
  const cemPath = join(process.cwd(), 'custom-elements.json');
  const manifest = JSON.parse(readFileSync(cemPath, 'utf-8'));
  const map = new Map<string, A11yAnnotations>();
  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;
      const tagName = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : '';
      if (!tagName) continue;
      const spec = decl?.custom?.a11yAnnotations;
      if (spec && spec.version === 1) map.set(tagName, spec);
    }
  }
  cached = map;
  return map;
}

export function getCemA11yAnnotations(tagName: string): A11yAnnotations | null {
  const map = loadCemAnnotations();
  return map.get(tagName.toLowerCase()) ?? null;
}

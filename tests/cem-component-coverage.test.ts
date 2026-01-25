/**
 * CEM Component Coverage Test
 *
 * packages/components/ に存在する全コンポーネントディレクトリが
 * CEM (custom-elements.json) に対応する tagName を持っていることを検証します。
 *
 * これにより、新規コンポーネントを追加した際に JSDoc 不備などで
 * CEM から漏れることを防ぎます。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * ディレクトリ名から期待される tagName パターンへのマッピング
 * 特殊なケース（prefix が異なる、名前が異なる等）を定義
 */
const DIRECTORY_TO_TAG_MAPPING: Record<string, string | string[]> = {
  // annotate は a11y-annotate（dads- prefix ではない）
  annotate: 'a11y-annotate',
  // typography は dads-text
  typography: 'dads-text',
  // 複数コンポーネントを含むディレクトリ
  accordion: ['dads-accordion-details', 'dads-accordion-item-details'],
  'menu-list': ['dads-menu-list', 'dads-menu-list-item'],
  'step-navigation': ['dads-step-navigation', 'dads-step-navigation-item'],
};

/**
 * CEM から tagName 一覧を抽出
 */
async function getCemTagNames(): Promise<Set<string>> {
  const cemPath = path.resolve(process.cwd(), 'custom-elements.json');
  const cemText = await fs.readFile(cemPath, 'utf8');
  const cem = JSON.parse(cemText) as {
    modules?: Array<{
      declarations?: Array<{
        tagName?: string;
        customElement?: boolean;
        kind?: string;
      }>;
    }>;
  };

  const tagNames = new Set<string>();
  for (const mod of cem.modules ?? []) {
    for (const decl of mod.declarations ?? []) {
      const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
      if (isCustomElement && typeof decl?.tagName === 'string' && decl.tagName.trim()) {
        tagNames.add(decl.tagName.toLowerCase());
      }
    }
  }
  return tagNames;
}

/**
 * packages/components/ 下のディレクトリ一覧を取得
 */
async function getComponentDirectories(): Promise<string[]> {
  const componentsDir = path.resolve(process.cwd(), 'packages/components');
  const entries = await fs.readdir(componentsDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

describe('CEM component coverage', () => {
  it('all component directories have corresponding tagName(s) in CEM', async () => {
    const tagNames = await getCemTagNames();
    const componentDirs = await getComponentDirectories();

    const missing: Array<{ directory: string; expected: string | string[] }> = [];

    for (const dir of componentDirs) {
      // 特殊マッピングがあればそれを使用
      const expectedTags = DIRECTORY_TO_TAG_MAPPING[dir];

      if (expectedTags) {
        // 特殊マッピングのケース
        const tagsToCheck = Array.isArray(expectedTags) ? expectedTags : [expectedTags];
        const allPresent = tagsToCheck.every((t) => tagNames.has(t.toLowerCase()));
        if (!allPresent) {
          missing.push({ directory: dir, expected: expectedTags });
        }
      } else {
        // デフォルト: dads-<directory-name> または dads-<directory-name>-* のパターン
        const expectedPattern = `dads-${dir}`;
        const hasMatch = [...tagNames].some(
          (t) => t === expectedPattern || t.startsWith(`${expectedPattern}-`),
        );
        if (!hasMatch) {
          missing.push({ directory: dir, expected: expectedPattern });
        }
      }
    }

    if (missing.length > 0) {
      const details = missing
        .map((m) => `  - ${m.directory}: expected ${JSON.stringify(m.expected)}`)
        .join('\n');
      expect.fail(
        `The following component directories are missing from CEM:\n${details}\n\n` +
          'Please ensure each component has proper JSDoc annotations (@customElement, @tagname) ' +
          'and run "npm run cem:analyze" to update custom-elements.json.',
      );
    }
  });

  it('CEM tagNames follow canonical prefix convention', async () => {
    const tagNames = await getCemTagNames();

    // 許可されるプレフィックス
    const allowedPrefixes = ['dads-', 'a11y-'];

    const violations: string[] = [];
    for (const tagName of tagNames) {
      const hasAllowedPrefix = allowedPrefixes.some((p) => tagName.startsWith(p));
      if (!hasAllowedPrefix) {
        violations.push(tagName);
      }
    }

    expect(
      violations,
      `The following tagNames do not follow prefix convention (dads-* or a11y-*): ${violations.join(', ')}`,
    ).toEqual([]);
  });
});

import { describe, it, expect } from 'vitest';
import { demos } from './showcase-components.js';

describe('showcase-components (chipTag demo)', () => {
  it('lead-icon 同期スクリプトは module ではなく通常 script を使う', () => {
    const html = demos.chipTag();
    expect(html).not.toContain('<script type="module">');
  });

  it('チップタグ作例に宛先と2件のラベルが含まれる', () => {
    const html = demos.chipTag();
    const expectedLabels = ['宛先', 'CC', 'デジ田 太郎', 'デジ濱 実', 'デジ山 ひかり'];
    for (const label of expectedLabels) {
      expect(html).toContain(label);
    }
  });

  it('Events テーブルに chip-tag のイベントが含まれる', () => {
    const html = demos.chipTag();
    expect(html).toContain('dads-chip-tag-remove');
    expect(html).toContain('dads-chip-tag-click');
  });

  it('commandfor 作例が含まれる', () => {
    const html = demos.chipTag();
    expect(html).toContain('メールアプリの宛先欄（作例）');
    expect(html).toContain('command="clear-recipients"');
    expect(html).toContain('commandfor="#mail-to-row"');
    expect(html).toContain('commandfor="#mail-cc-row"');
  });
});

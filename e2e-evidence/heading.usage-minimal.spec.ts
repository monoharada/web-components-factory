import { expect, test } from '@playwright/test';

type Preset = 'default' | 'chip' | 'shoulder' | 'icon' | 'shoulder-chip';

async function readCodeBlockText(root: import('@playwright/test').Locator): Promise<string> {
  const codeBlock = root.locator('dads-code-block[data-api-code]');
  await expect(codeBlock).toHaveCount(1);

  const read = async (): Promise<string> => {
    // Code is rendered into shadowRoot <code id="code">.
    // The code block may be inside a collapsed disclosure (hidden); read it directly.
    return await codeBlock.evaluate((el) => {
      const host = el as HTMLElement & { shadowRoot?: ShadowRoot | null };
      const code = host.shadowRoot?.querySelector('#code');
      return (code?.textContent ?? '').replace(/\r\n?/g, '\n').trim();
    });
  };

  await expect.poll(read).not.toBe('');
  return await read();
}

function expectDoesNotContainInternalAttrs(code: string): void {
  const forbidden = [
    'data-api-',
    'data-has-',
    'data-sa-component',
    'role=',
    'aria-level=',
    'data-demo-variant',
  ];

  for (const needle of forbidden) expect(code).not.toContain(needle);
}

function expectPresetMarkup(code: string, preset: Preset): void {
  if (preset === 'default') {
    expect(code).toContain('<dads-heading');
    expect(code).toContain('>見出しテキスト</dads-heading>');
    expect(code).not.toContain('slot="shoulder"');
    expect(code).not.toContain('slot="icon"');
    expect(code).not.toMatch(/\schip(\s|>)/);
    return;
  }

  if (preset === 'chip') {
    expect(code).toContain('<dads-heading');
    expect(code).toContain(' chip');
    expect(code).toContain('>見出しテキスト</dads-heading>');
    expect(code).not.toContain('slot="shoulder"');
    expect(code).not.toContain('slot="icon"');
    return;
  }

  if (preset === 'shoulder') {
    expect(code).toContain('<span slot="shoulder">');
    expect(code).toContain('ショルダー');
    expect(code).toContain('見出しテキスト');
    expect(code).not.toContain('slot="icon"');
    expect(code).not.toMatch(/\schip(\s|>)/);
    return;
  }

  if (preset === 'icon') {
    expect(code).toContain('slot="icon"');
    expect(code).toContain('<svg');
    expect(code).toContain('<path');
    expect(code).toContain('見出しテキスト');
    expect(code).not.toContain('slot="shoulder"');
    expect(code).not.toMatch(/\schip(\s|>)/);
    return;
  }

  // preset === 'shoulder-chip'
  expect(code).toContain('<span slot="shoulder">');
  expect(code).toContain(' chip');
  expect(code).toContain('見出しテキスト');
  expect(code).not.toContain('slot="icon"');
}

async function setPreset(
  page: import('@playwright/test').Page,
  panel: import('@playwright/test').Locator,
  presetSelect: import('@playwright/test').Locator,
  preset: Preset
): Promise<string> {
  await presetSelect.selectOption(preset);
  // The demo's init script listens to change to apply preset.
  await presetSelect.dispatchEvent('change');
  // Usage update is async via event listeners; small settle helps stability.
  await page.waitForTimeout(50);

  const code = await readCodeBlockText(panel);
  expectDoesNotContainInternalAttrs(code);
  return code;
}

test.describe('dads-heading usage snippet', () => {
  test('keeps markup minimal per preset (no unintended slot/attr mixing)', async ({ page }) => {
    await page.goto('/?nosw=1&component=heading');

    const panel = page.locator('.wc-api-panel');
    await expect(panel).toBeVisible();

    const presetSelect = panel.locator('select[data-api-attr="data-demo-variant"]');
    await expect(presetSelect).toBeVisible();

    const presets: Preset[] = ['default', 'chip', 'shoulder', 'icon', 'shoulder-chip'];
    for (const preset of presets) {
      const code = await setPreset(page, panel, presetSelect, preset);
      expectPresetMarkup(code, preset);
    }
  });
});

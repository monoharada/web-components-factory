/**
 * 設定モジュール テスト
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getConfig,
  setConfig,
  resetConfig,
  getComponentName,
  getPrefix,
} from '../packages/config';

describe('config - 設定モジュール', () => {
  beforeEach(() => {
    // 各テストの前にリセット
    resetConfig();
  });

  describe('getConfig', () => {
    it('デフォルト設定を返す', () => {
      const config = getConfig();
      expect(config.prefix).toBe('dads');
      expect(config.registry).toBe(customElements);
    });

    it('読み取り専用オブジェクトを返す', () => {
      const config = getConfig();
      expect(Object.isFrozen(config)).toBe(true);
    });
  });

  describe('setConfig', () => {
    it('prefixを変更できる', () => {
      setConfig({ prefix: 'my-ui' });
      const config = getConfig();
      expect(config.prefix).toBe('my-ui');
    });

    it('部分的な更新ができる', () => {
      setConfig({ prefix: 'custom' });
      const config = getConfig();
      expect(config.prefix).toBe('custom');
      expect(config.registry).toBe(customElements);
    });

    it('undefinedの値は無視される', () => {
      setConfig({ prefix: 'initial' });
      // undefinedを渡しても既存値は保持される
      setConfig({ prefix: undefined });
      const config = getConfig();
      expect(config.prefix).toBe('initial');
    });

    it('undefinedが混在しても有効な値のみ適用される', () => {
      setConfig({ prefix: 'first' });
      setConfig({ prefix: undefined, registry: customElements });
      const config = getConfig();
      expect(config.prefix).toBe('first'); // undefinedなので変更されない
      expect(config.registry).toBe(customElements);
    });
  });

  describe('resetConfig', () => {
    it('デフォルト値にリセットできる', () => {
      setConfig({ prefix: 'changed' });
      resetConfig();
      const config = getConfig();
      expect(config.prefix).toBe('dads');
    });
  });

  describe('getComponentName', () => {
    it('デフォルトprefixでコンポーネント名を生成する', () => {
      const name = getComponentName('button');
      expect(name).toBe('dads-button');
    });

    it('設定変更後のprefixを使用する', () => {
      setConfig({ prefix: 'my-ui' });
      const name = getComponentName('button');
      expect(name).toBe('my-ui-button');
    });

    it('オーバーライドprefixを使用できる', () => {
      const name = getComponentName('button', 'custom');
      expect(name).toBe('custom-button');
    });

    it('オーバーライドは設定変更より優先される', () => {
      setConfig({ prefix: 'my-ui' });
      const name = getComponentName('button', 'override');
      expect(name).toBe('override-button');
    });
  });

  describe('SSR環境対応', () => {
    let originalCustomElements: typeof customElements | undefined;

    beforeEach(() => {
      // customElementsを保存
      originalCustomElements = globalThis.customElements;
    });

    afterEach(() => {
      // customElementsを復元
      if (originalCustomElements) {
        (globalThis as Record<string, unknown>).customElements = originalCustomElements;
      }
      resetConfig();
    });

    it('customElements不在時にgetConfig()がエラーを投げる', () => {
      // customElementsを削除してSSR環境をシミュレート
      delete (globalThis as Record<string, unknown>).customElements;
      resetConfig(); // registryをnullにリセット

      expect(() => getConfig()).toThrow('CustomElementRegistryが利用できない環境です');
    });

    it('setConfig({ registry })で明示的に設定すればcustomElements不在でも動作する', () => {
      // モックレジストリを作成
      const mockRegistry = {
        get: () => undefined,
        define: () => {},
      } as unknown as CustomElementRegistry;

      // customElementsを削除
      delete (globalThis as Record<string, unknown>).customElements;
      resetConfig();

      // 明示的にregistryを設定
      setConfig({ registry: mockRegistry });

      // エラーなく設定を取得できる
      const config = getConfig();
      expect(config.prefix).toBe('dads');
      expect(config.registry).toBe(mockRegistry);
    });

    it('getPrefix()はcustomElements不在でも動作する', () => {
      // customElementsを削除
      delete (globalThis as Record<string, unknown>).customElements;
      resetConfig();

      // prefixはSSR環境でも取得可能
      expect(getPrefix()).toBe('dads');

      // setConfigで変更しても取得可能
      setConfig({ prefix: 'ssr-prefix' });
      expect(getPrefix()).toBe('ssr-prefix');
    });
  });
});

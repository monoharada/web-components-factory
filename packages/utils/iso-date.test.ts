import { describe, expect, it } from 'vitest';
import { parseIsoDate, toIsoDateOrEmpty } from './iso-date';

describe('iso-date.ts', () => {
  describe('parseIsoDate', () => {
    it('validなISO日付をパースできる', () => {
      expect(parseIsoDate('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 });
      expect(parseIsoDate('2024-12-31')).toEqual({ year: 2024, month: 12, day: 31 });
    });

    it('invalidなISO日付はnullを返す', () => {
      expect(parseIsoDate('2023-02-29')).toBeNull(); // うるう年ではない
      expect(parseIsoDate('2024-13-01')).toBeNull();
      expect(parseIsoDate('2024-00-01')).toBeNull();
      expect(parseIsoDate('2024-01-00')).toBeNull();
      expect(parseIsoDate('0000-01-01')).toBeNull();
      expect(parseIsoDate('2024-1-01')).toBeNull();
      expect(parseIsoDate('2024-01-1')).toBeNull();
    });
  });

  describe('toIsoDateOrEmpty', () => {
    it('validな年月日はISO日付文字列を返す', () => {
      expect(toIsoDateOrEmpty(2024, 2, 29)).toBe('2024-02-29');
      expect(toIsoDateOrEmpty(2001, 1, 1)).toBe('2001-01-01');
    });

    it('invalidな年月日は空文字を返す', () => {
      expect(toIsoDateOrEmpty(0, 1, 1)).toBe('');
      // Dateコンストラクタは 0-99 の年を 1900-1999 として扱うため、0001年等は不正扱いになる
      expect(toIsoDateOrEmpty(1, 1, 1)).toBe('');
      expect(toIsoDateOrEmpty(2023, 2, 29)).toBe('');
      expect(toIsoDateOrEmpty(2024, 13, 1)).toBe('');
    });
  });
});

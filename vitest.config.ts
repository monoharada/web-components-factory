import { defineConfig } from 'vitest/config';

const reporterEnv = (process.env.VITEST_REPORTER ?? '').trim();
const reporter = (reporterEnv ? reporterEnv : 'verbose').split(',')[0].trim();

export default defineConfig({
  test: {
    // 高速化設定
    isolate: true,
    
    // テスト環境設定
    environment: 'happy-dom',
    
    // グローバル設定
    globals: true,
    
    // セットアップファイル
    setupFiles: ['./tests/setup.ts'],

    // テストファイルパターン
    include: [
      'tests/**/*.{test,spec}.{js,ts}',
      'src/**/*.{test,spec}.{js,ts}',
      'packages/**/*.{test,spec}.{js,ts}'
    ],

    // 意図的に除外するテスト
    // - 現状 `src/` 側に参照先が存在せず import 解決で落ちるため（復旧は別PRで扱う）
    exclude: ['tests/adaptive-card*.{test,spec}.{js,ts}'],
    
    // ファイル監視無効化（CIモード用、手動実行時は --watch で有効化）
    watch: false,
    
    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    },

    // レポーター設定
    reporter,
    
    // タイムアウト設定
    testTimeout: 5000,
    
    // 並列実行設定
    maxConcurrency: 5,
    
    // Mock設定
    mockReset: true,
    restoreMocks: true,
    
    // Shadow DOM対応
    pool: 'forks'
  },
  
  // Vite設定
  esbuild: {
    target: 'es2022'
  },
  
  // TypeScript設定
  define: {
    __DEV__: true
  }
});

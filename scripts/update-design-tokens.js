#!/usr/bin/env node
/**
 * デジタル庁デザイントークン自動更新スクリプト
 * @digital-go-jp/design-tokens パッケージから最新のトークンを取得し、
 * packages/styles/design-tokens/index.ts を自動生成する
 * 
 * 使用法:
 * node scripts/update-design-tokens.js
 * npm run update-tokens (package.jsonにスクリプトを追加後)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const TEMP_DIR = '/tmp/dads-tokens-update';
const TARGET_FILE = path.join(__dirname, '../packages/styles/design-tokens/index.ts');
const PACKAGE_NAME = '@digital-go-jp/design-tokens';

async function updateDesignTokens() {
  console.log('🎨 デジタル庁デザイントークンの更新を開始...');
  
  try {
    // 1. 一時ディレクトリの準備
    console.log('📁 一時ディレクトリを準備中...');
    execSync(`mkdir -p ${TEMP_DIR}`, { stdio: 'inherit' });
    
    // 2. 最新パッケージのインストール
    console.log(`📦 ${PACKAGE_NAME} の最新版をインストール中...`);
    execSync(`cd ${TEMP_DIR} && npm install ${PACKAGE_NAME}`, { stdio: 'inherit' });
    
    // 3. パッケージ情報の取得
    const packageInfo = JSON.parse(
      execSync(`cd ${TEMP_DIR} && npm view ${PACKAGE_NAME} --json`, { encoding: 'utf8' })
    );
    const version = packageInfo.version;
    console.log(`✅ バージョン ${version} を取得`);
    
    // 4. tokens.cssの読み込み
    const tokensPath = path.join(TEMP_DIR, `node_modules/${PACKAGE_NAME}/dist/tokens.css`);
    const tokensCSS = fs.readFileSync(tokensPath, 'utf8');
    
    // 5. CSSからトークンを抽出
    console.log('🔍 CSSトークンを解析中...');
    const tokens = extractTokensFromCSS(tokensCSS);
    
    // 6. TypeScriptファイルを生成
    console.log('📝 TypeScriptファイルを生成中...');
    const generatedContent = generateTypeScriptContent(tokens, version);
    
    // 7. ファイルを書き込み
    fs.writeFileSync(TARGET_FILE, generatedContent);
    console.log(`✅ ${TARGET_FILE} を更新完了`);
    
    // 8. クリーンアップ
    console.log('🧹 一時ファイルをクリーンアップ中...');
    execSync(`rm -rf ${TEMP_DIR}`);
    
    console.log('🎉 デザイントークンの更新が完了しました！');
    console.log(`📋 更新されたバージョン: ${version}`);
    console.log(`📄 生成されたファイル: ${TARGET_FILE}`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    // クリーンアップ
    execSync(`rm -rf ${TEMP_DIR}`, { stdio: 'ignore' });
    process.exit(1);
  }
}

/**
 * CSSからトークンを抽出する
 */
function extractTokensFromCSS(cssContent) {
  const tokens = {};
  const lines = cssContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && trimmed.includes(':')) {
      const [property, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').replace(';', '').trim();
      tokens[property.trim()] = value;
    }
  });
  
  return tokens;
}

/**
 * TypeScriptコンテンツを生成する
 */
function generateTypeScriptContent(tokens, version) {
  const tokenEntries = Object.entries(tokens);
  const colorTokens = tokenEntries.filter(([key]) => key.includes('color'));
  const fontTokens = tokenEntries.filter(([key]) => key.includes('font'));
  const sizeTokens = tokenEntries.filter(([key]) => key.includes('size'));
  const lineHeightTokens = tokenEntries.filter(([key]) => key.includes('line-height'));
  const borderTokens = tokenEntries.filter(([key]) => key.includes('border-radius'));
  const elevationTokens = tokenEntries.filter(([key]) => key.includes('elevation'));
  
  return `/**
 * デジタル庁デザインシステム（DADS） - デザイントークン
 * Digital Agency Design System
 * ${PACKAGE_NAME} v${version} に準拠
 * 
 * ※ このファイルは自動生成されています
 * ※ 手動で編集しないでください
 * ※ 更新: node scripts/update-design-tokens.js
 */

import { css } from '../../core/web-components.js';

/**
 * デジタル庁の公式デザイントークンをShadow DOM内で使用可能にする
 * CSSカスタムプロパティをホスト要素に適用
 */
export function applyDADSTokens() {
  return css\`
    :host {
      /* ==========================================
       * Color Tokens
       * ========================================== */
      ${colorTokens.map(([key, value]) => `      ${key}: ${value};`).join('\n')}
      
      /* ==========================================
       * Typography Tokens
       * ========================================== */
      ${fontTokens.map(([key, value]) => `      ${key}: ${value};`).join('\n')}
      ${sizeTokens.map(([key, value]) => `      ${key}: ${value};`).join('\n')}
      ${lineHeightTokens.map(([key, value]) => `      ${key}: ${value};`).join('\n')}
      
      /* ==========================================
       * Spacing & Layout Tokens
       * ========================================== */
      ${borderTokens.map(([key, value]) => `      ${key}: ${value};`).join('\n')}
      
      /* ==========================================
       * Elevation Tokens
       * ========================================== */
      ${elevationTokens.map(([key, value]) => `      ${key}: ${value};`).join('\n')}
      
      /* ==========================================
       * Component Alias Tokens
       * ========================================== */
      
      /* Primary Colors */
      --color-primary: var(--color-primitive-blue-1000);
      --color-primary-hover: var(--color-primitive-blue-900);
      --color-primary-active: var(--color-primitive-blue-1100);
      
      /* Text Colors */
      --color-text-primary: var(--color-neutral-solid-gray-900);
      --color-text-secondary: var(--color-neutral-solid-gray-600);
      --color-text-disabled: var(--color-neutral-solid-gray-400);
      
      /* Border Colors */
      --color-border: var(--color-neutral-solid-gray-420);
      --color-border-light: var(--color-neutral-solid-gray-200);
      --color-border-focus: var(--color-primitive-blue-600);
      
      /* Background Colors */
      --color-background: var(--color-neutral-white);
      --color-background-hover: var(--color-neutral-solid-gray-50);
      --color-background-active: var(--color-neutral-solid-gray-100);
      
      /* Status Colors */
      --color-success: var(--color-semantic-success-1);
      --color-error: var(--color-semantic-error-1);
      --color-warning: var(--color-semantic-warning-orange-1);
      
      /* Component Defaults */
      --component-font-family: var(--font-family-sans);
      --component-font-size: var(--font-size-16);
      --component-line-height: var(--line-height-150);
      --component-border-radius: var(--border-radius-8);
      --component-shadow: var(--elevation-2);
    }
  \`;
}

/**
 * Legacy export - componentTokensは既にapplyDADSTokens()内に統合済み
 * 互換性のため残しているが、直接applyDADSTokens()を使用することを推奨
 */
export const componentTokens = css\`
  :host {
    /* このトークンはapplyDADSTokens()に統合されました */
    /* 互換性のため空のスタイルシートとして残しています */
  }
\`;

/**
 * 現在のトークンバージョン情報
 */
export const DADS_TOKENS_VERSION = '${version}';
export const LAST_UPDATED = '${new Date().toISOString()}';
`;
}

// スクリプト実行
if (require.main === module) {
  updateDesignTokens();
}

module.exports = { updateDesignTokens };
/**
 * エントリーポイント - すべてのWeb Componentsを定義
 */

// グローバル型拡張（デバッグ用）
declare global {
  interface Window {
    componentDemos?: typeof demos;
  }
}

// アコーディオンコンポーネント
import { defineDefaultAccordion } from '../packages/components/accordion/index.js';

// ボタンコンポーネント
import { defineDefaultButton } from '../packages/components/button/index.js';

// リセットCSSデモコンポーネント
import '../packages/components/reset-card-demo.js';

// コンポーネント登録
defineDefaultAccordion();
defineDefaultButton();

// コンポーネントのデモマークアップを返す関数
export const demos = {
  accordion: () => `
    <dads-accordion-details>
      <dads-accordion-item-details>
        <span slot="header">デジタル庁について</span>
        <div slot="content">
          デジタル庁は、2021年9月1日に設置された日本の行政機関です。
          デジタル社会形成の司令塔として、国・地方行政のデジタル化を推進しています。
        </div>
      </dads-accordion-item-details>
      
      <dads-accordion-item-details>
        <span slot="header">利用可能なサービス</span>
        <div slot="content">
          マイナポータル、e-Tax、各種オンライン申請など、
          様々な行政サービスをデジタルで利用できます。
        </div>
      </dads-accordion-item-details>
      
      <dads-accordion-item-details>
        <span slot="header">お問い合わせ</span>
        <div slot="content">
          ご不明な点がございましたら、公式ウェブサイトのお問い合わせフォームよりご連絡ください。
        </div>
      </dads-accordion-item-details>
    </dads-accordion-details>
  `,
  
  resetCss: () => `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 30px; color: #333;">リセットCSS比較デモ</h2>
      
      <div style="display: grid; gap: 30px; max-width: 1200px;">
        <!-- 既存サイトのスタイル影響テスト -->
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
          <h3 style="color: #666; margin-bottom: 15px;">既存サイトのスタイル（グローバルCSS）</h3>
          <p style="margin: 10px 0; line-height: 1.8;">
            これは既存サイトの段落です。フォントサイズ、行間、マージンなどが設定されています。
          </p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 5px 0;">既存サイトのリスト項目1</li>
            <li style="margin: 5px 0;">既存サイトのリスト項目2</li>
          </ul>
          <button style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            既存のボタンスタイル
          </button>
        </div>
        
        <!-- Web Components（Shadow DOM隔離） -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <!-- フルリセット適用 -->
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">フルリセット適用（kiso.css）</h3>
            <reset-card>
              <span slot="title">Shadow DOM内でリセット</span>
              <span slot="description">
                kiso.cssのフルリセットがShadow DOM内にのみ適用されます。
                既存サイトのスタイルには影響しません。
              </span>
              <span slot="action">詳細を見る</span>
            </reset-card>
          </div>
          
          <!-- 最小限リセット -->
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">最小限リセット</h3>
            <minimal-reset-card>
              <span slot="title">軽量リセット版</span>
              <span slot="description">
                最小限のリセットCSSのみ適用。
                パフォーマンスを重視する場合に適しています。
              </span>
              <span slot="action">詳細を見る</span>
            </minimal-reset-card>
          </div>
          
          <!-- リセットなし -->
          <div>
            <h3 style="color: #333; margin-bottom: 10px;">リセットなし（比較用）</h3>
            <no-reset-card>
              <span slot="title">リセットCSS未適用</span>
              <span slot="description">
                リセットCSSを使用していない状態。
                ブラウザのデフォルトスタイルが適用されます。
              </span>
              <span slot="action">詳細を見る</span>
            </no-reset-card>
          </div>
        </div>
        
        <!-- 解説 -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-bottom: 10px;">重要なポイント</h3>
          <ul style="color: #856404; line-height: 1.8; padding-left: 20px;">
            <li><strong>Shadow DOM の隔離性:</strong> リセットCSSはコンポーネント内部にのみ適用され、外部に影響しません</li>
            <li><strong>既存サイトとの共存:</strong> 上記の「既存サイトのスタイル」セクションが崩れていないことを確認してください</li>
            <li><strong>選択的適用:</strong> withReset()ヘルパーでコンポーネントごとにリセットを選択できます</li>
            <li><strong>::part()によるカスタマイズ:</strong> 外部からのスタイル調整も可能です</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  
  // ボタンデモ
  button: () => `
    <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ボタンコンポーネント</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステムv2.7.0準拠のボタンコンポーネント。TDD（テスト駆動開発）で実装。
      </p>
      
      <!-- バリアント -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">バリアント</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-button variant="solid">Solid（塗り）</dads-button>
          <dads-button variant="outlined">Outlined（枠線）</dads-button>
          <dads-button variant="text">Text（テキスト）</dads-button>
        </div>
      </section>
      
      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ（最小44px高）</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-button size="x-small">X-Small</dads-button>
          <dads-button size="small">Small</dads-button>
          <dads-button size="medium">Medium</dads-button>
          <dads-button size="large">Large</dads-button>
        </div>
      </section>
      
      <!-- 実際の使用例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">実際の使用例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9;">
          <form style="max-width: 400px;">
            <div style="margin-bottom: 16px;">
              <label for="demo-email" style="display: block; margin-bottom: 4px; font-weight: 500;">
                メールアドレス
              </label>
	              <input 
	                id="demo-email" 
	                type="email" 
	                aria-describedby="demo-email-hint"
	                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"
	              >
	              <p id="demo-email-hint" style="margin: 4px 0 0; font-size: 14px; color: #666;">
	                例: example@email.com
	              </p>
	            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <dads-button variant="text" type="button">キャンセル</dads-button>
              <dads-button variant="solid" type="submit">送信</dads-button>
            </div>
          </form>
        </div>
      </section>
      
      <!-- フルワイド -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">フルワイドボタン</h3>
        <div style="max-width: 400px;">
          <dads-button variant="solid" full-width>幅100%のボタン</dads-button>
        </div>
      </section>
      
      <!-- 無効状態（非推奨） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">無効状態（デジタル庁では非推奨）</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-button variant="solid" disabled>無効化されたボタン</dads-button>
          <span style="color: #dc3545; font-size: 14px;">
            ※ デジタル庁ガイドラインでは、disabled属性の使用は推奨されていません
          </span>
        </div>
      </section>
      
      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li>🎯 <strong>WCAG 2.2 AA準拠:</strong> 最小44x44pxタップターゲット</li>
          <li>🎨 <strong>デザイントークン:</strong> セマンティック & ローカルトークンの2層構造</li>
          <li>📏 <strong>Figmaデザイン準拠:</strong> ピクセルパーフェクトな実装</li>
          <li>✅ <strong>TDD開発:</strong> 100%テストカバレッジ</li>
          <li>⚡ <strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
        </ul>
      </div>
    </div>
  `,
  
  // 他のデモを追加
  empty: () => `
    <div style="padding: 40px; text-align: center; color: #666;">
      コンポーネントを選択してください
    </div>
  `
};

// ビューワーの初期化関数
export function initViewer(): void {
  const selector = document.getElementById('component') as HTMLSelectElement;
  const container = document.getElementById('component-container');
  
  if (!selector || !container) {
    console.error('Required elements not found');
    return;
  }
  
  // URLパラメータから初期値を取得
  const params = new URLSearchParams(window.location.search);
  const initialComponent = params.get('component');
  
  // nullチェック後の変数を保持（型ナローイングのため）
  const componentContainer = container;

  // コンポーネントを表示
  function showComponent(name: string): void {
    const demoFn = demos[name as keyof typeof demos] || demos.empty;
    componentContainer.innerHTML = demoFn();
  }
  
  // セレクタの変更を監視
  selector.addEventListener('change', (e) => {
    const value = (e.target as HTMLSelectElement).value;
    
    // URLパラメータを更新
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('component', value);
    } else {
      url.searchParams.delete('component');
    }
    window.history.pushState({}, '', url);
    
    // コンポーネントを表示
    showComponent(value || 'empty');
  });
  
  // 初期表示
  if (initialComponent) {
    selector.value = initialComponent;
    showComponent(initialComponent);
  } else {
    showComponent('empty');
  }
}

// グローバルに公開（デバッグ用）
window.componentDemos = demos;

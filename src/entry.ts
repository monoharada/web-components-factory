/**
 * エントリーポイント - すべてのWeb Componentsを定義
 */

// アコーディオンコンポーネント
import './dads-accordion-details.js';

// 他のコンポーネントがあれば追加
// import './other-component.ts';

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
  
  // コンポーネントを表示
  function showComponent(name: string): void {
    const demoFn = demos[name as keyof typeof demos] || demos.empty;
    container.innerHTML = demoFn();
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
(window as any).componentDemos = demos;
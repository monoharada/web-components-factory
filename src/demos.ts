/**
 * コンポーネントのデモマークアップ定義
 * autoloaderと組み合わせて使用される
 */

export const demos = {
  blockquote: () => `
    <div style="padding: 40px; max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">引用ブロックコンポーネント</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム準拠の引用ブロックコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      <!-- 基本（デフォルトスロットのみ） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本（デフォルトスロット）</h3>
        <dads-blockquote>
          <p>デジタル庁は、2021年9月1日に設置された日本の行政機関です。デジタル社会形成の司令塔として、国・地方行政のデジタル化を推進しています。</p>
        </dads-blockquote>
      </section>

      <!-- 3スロット構造 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">3スロット構造（lead / default / close）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ lead（冒頭）、デフォルト（本文）、close（締め括り）の3スロットでコンテンツを構造化。CSS Gridのgapで余白制御。
        </p>
        <dads-blockquote>
          <p slot="lead">これは冒頭の段落です。最初に表示されます。</p>
          <p>これは本文の段落1です。デフォルトスロットに配置されます。</p>
          <p>これは本文の段落2です。複数の段落を配置可能です。</p>
          <p slot="close">これは締め括りの段落です。最後に表示されます。</p>
        </dads-blockquote>
      </section>

      <!-- 本文のみ（3段落） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">本文のみ（3段落）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ lead/closeスロットが空の場合、非表示になり余分なgapが発生しません。
        </p>
        <dads-blockquote>
          <p>これは引用文の例です。デジタル庁デザインシステムでは、アクセシビリティファーストの原則に基づいて、すべてのユーザーが利用しやすいサービスの提供を目指しています。</p>
          <p>デジタル社会の形成は、国民の利便性向上を第一に考え、誰一人取り残されないよう配慮することが重要です。</p>
          <p>私たちは、これらの理念を実現するために、継続的な改善と研究・実践を行っています。</p>
        </dads-blockquote>
      </section>

      <!-- リスト付き -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">リスト付き</h3>
        <dads-blockquote>
          <p slot="lead">デジタル庁が推進する主な取り組み：</p>
          <ul>
            <li>マイナンバーカードの普及促進</li>
            <li>行政手続きのオンライン化</li>
            <li>データ連携基盤の整備</li>
          </ul>
        </dads-blockquote>
      </section>

      <!-- cite属性付き -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">cite属性付き</h3>
        <dads-blockquote cite="https://www.digital.go.jp/">
          <p>デジタル庁は、デジタル社会形成基本法に基づき、デジタル社会の形成に関する施策を迅速かつ重点的に推進することを目的として設置されました。</p>
        </dads-blockquote>
        <p style="margin-top: 10px; font-size: 14px; color: #666;">
          ※ cite属性は視覚的には表示されませんが、内部のblockquote要素に引用元URLとして設定されます。
        </p>
      </section>

      <!-- 自動スロット割り当て（3要素以上） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">自動スロット割り当て（3要素以上）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ slot属性なしで自動振り分け：最初→lead, 中間→body, 最後→close
        </p>
        <dads-blockquote>
          <p>これは最初の段落です。自動的にleadスロットに配置。</p>
          <p>これは中間の段落です。bodyスロットに配置。</p>
          <p>これは最後の段落です。自動的にcloseスロットに配置。</p>
        </dads-blockquote>
      </section>

      <!-- 自動スロット割り当て（2要素） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">自動スロット割り当て（2要素）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ 2要素の場合：最初→lead, 最後→body
        </p>
        <dads-blockquote>
          <p>これは最初の段落です。leadスロットに配置。</p>
          <p>これは最後の段落です。bodyスロットに配置。</p>
        </dads-blockquote>
      </section>

      <!-- 自動スロット割り当て（1要素） -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">自動スロット割り当て（1要素）</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ 1要素の場合：lead に配置
        </p>
        <dads-blockquote>
          <p>これは唯一の段落です。leadスロットに配置。</p>
        </dads-blockquote>
      </section>

      <!-- 明示的slot指定と自動振り分けの混在 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">明示的slot指定と自動振り分けの混在</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          ※ slot属性を明示指定した要素は尊重され、残りの要素は自動振り分け
        </p>
        <dads-blockquote>
          <p slot="lead">明示的にlead指定</p>
          <p>自動振り分け1</p>
          <p>自動振り分け2</p>
          <p slot="close">明示的にclose指定</p>
        </dads-blockquote>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-top: 40px;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>DADS準拠:</strong> デジタル庁デザインシステムのスタイルに準拠</li>
          <li><strong>3スロット構造:</strong> lead（冒頭）/ default（本文）/ close（締め括り）</li>
          <li><strong>自動スロット割り当て:</strong> slot属性なしで最初→lead, 中間→body, 最後→close</li>
          <li><strong>空スロット非表示:</strong> 使用しないスロットは自動的に非表示</li>
          <li><strong>CSS Grid + gap:</strong> !importantを使わずに余白制御</li>
          <li><strong>cite属性サポート:</strong> 引用元URLを内部blockquoteに転送</li>
          <li><strong>::part()スタイリング:</strong> 外部からの柔軟なカスタマイズ</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
          <li><strong>TDD開発:</strong> テスト駆動開発で品質を担保</li>
        </ul>
      </div>
    </div>
  `,

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
          <dads-button variant="solid">既存のボタンスタイル</dads-button>
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

  textarea: () => `
    <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">テキストエリアコンポーネント</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム準拠のテキストエリアコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      <!-- 基本 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">基本</h3>
        <div style="max-width: 500px;">
          <dads-textarea
            label="お問い合わせ内容"
            placeholder="内容を入力してください"
          ></dads-textarea>
        </div>
      </section>

      <!-- サポートテキスト・要否ラベル -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サポートテキスト・要否ラベル</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea
            label="必須項目"
            support-text="入力が必須です"
            required
          ></dads-textarea>

          <dads-textarea
            label="任意項目"
            support-text="入力は任意です"
          ></dads-textarea>
        </div>
      </section>

      <!-- 文字数カウンター -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">文字数カウンター</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea
            label="入力制限あり"
            support-text="500文字以内で入力してください"
            show-counter
            maxlength="500"
          ></dads-textarea>

          <dads-textarea
            label="目安表示のみ"
            support-text="200文字程度を目安に入力してください"
            show-counter
            counter-max="200"
          ></dads-textarea>
        </div>
      </section>

      <!-- エラー状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">エラー状態</h3>
        <div style="max-width: 500px;">
          <dads-textarea
            label="お問い合わせ内容"
            required
            error
            error-text="入力内容を確認してください"
            value="不正な入力"
          ></dads-textarea>
        </div>
      </section>

      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea label="Small" size="sm" placeholder="小サイズ"></dads-textarea>
          <dads-textarea label="Medium（デフォルト）" size="md" placeholder="中サイズ"></dads-textarea>
          <dads-textarea label="Large" size="lg" placeholder="大サイズ"></dads-textarea>
        </div>
      </section>

      <!-- 行数 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">行数</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea label="3行（デフォルト）" rows="3" placeholder="デフォルトの行数"></dads-textarea>
          <dads-textarea label="5行" rows="5" placeholder="5行表示"></dads-textarea>
        </div>
      </section>

      <!-- 状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">状態</h3>
        <div style="display: grid; gap: 24px; max-width: 500px;">
          <dads-textarea
            label="無効状態"
            disabled
            value="編集できません"
          ></dads-textarea>

          <dads-textarea
            label="ユーザーID"
            readonly
            support-text="この項目は編集できません。"
            value="user-12345678"
          ></dads-textarea>
        </div>
      </section>

      <!-- 実際の使用例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">実際の使用例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9;">
          <form style="max-width: 600px;">
            <h4 style="font-size: 18px; margin-bottom: 20px; color: #333;">お問い合わせフォーム</h4>

            <div style="margin-bottom: 16px;">
              <label for="demo-subject" style="display: block; margin-bottom: 4px; font-weight: 500;">
                件名
              </label>
              <input
                id="demo-subject"
                type="text"
                placeholder="件名を入力してください"
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box;"
              >
            </div>

            <dads-textarea
              label="お問い合わせ内容"
              support-text="具体的な内容をご記入ください（500文字以内）"
              required
              show-counter
              maxlength="500"
              rows="5"
              placeholder="ご質問やご要望をお書きください"
              style="margin-bottom: 24px;"
            ></dads-textarea>

            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <dads-button variant="text" type="button">キャンセル</dads-button>
              <dads-button variant="solid" type="submit">送信</dads-button>
            </div>
          </form>
        </div>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>WCAG 2.2 AA準拠:</strong> ラベル関連付け、aria-describedby、フォーカス管理</li>
          <li><strong>文字数カウンター:</strong> 「0/100」形式、aria-describedbyで関連付け</li>
          <li><strong>エラー状態:</strong> aria-describedbyで関連付け（DADSガイドライン準拠）</li>
          <li><strong>Form Associated:</strong> ネイティブフォームに参加</li>
          <li><strong>スロット対応:</strong> label、support-text、error-textをスロットでカスタマイズ可能</li>
          <li><strong>::part()スタイリング:</strong> 外部からの柔軟なカスタマイズ</li>
        </ul>
      </div>
    </div>
  `,

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
                placeholder="example@email.com"
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"
              >
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
          <li><strong>WCAG 2.2 AA準拠:</strong> 最小44x44pxタップターゲット</li>
          <li><strong>デザイントークン:</strong> セマンティック & ローカルトークンの2層構造</li>
          <li><strong>Figmaデザイン準拠:</strong> ピクセルパーフェクトな実装</li>
          <li><strong>TDD開発:</strong> 100%テストカバレッジ</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
        </ul>
      </div>
    </div>
  `,

  textareaValidation: () => `
    <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
      <h2 style="font-size: 24px; margin-bottom: 20px; color: #333;">Textarea Validation Test</h2>
      <p style="color: #666; margin-bottom: 30px;">
        auto-validate属性による自動バリデーション機能のテスト
      </p>

      <form id="validation-form">
        <!-- 15文字制限（E2Eテスト用） -->
        <section style="margin-bottom: 32px;">
          <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">文字数バリデーション（15文字）</h3>
          <dads-textarea
            id="test-overflow"
            label="文字数テスト"
            support-text="15文字以内で入力してください。超えるとblur時にエラー表示されます。"
            maxlength="15"
            show-counter
            auto-validate
          ></dads-textarea>
        </section>

        <!-- 必須バリデーション -->
        <section style="margin-bottom: 32px;">
          <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">必須バリデーション</h3>
          <dads-textarea
            id="test-required"
            label="必須項目"
            support-text="空のまま送信するとエラー表示されます。"
            required
            auto-validate
          ></dads-textarea>
        </section>

        <!-- カスタムメッセージ -->
        <section style="margin-bottom: 32px;">
          <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">カスタムエラーメッセージ</h3>
          <dads-textarea
            id="test-custom"
            label="カスタムメッセージ"
            support-text="スロットでエラーメッセージをカスタマイズ"
            required
            maxlength="10"
            show-counter
            auto-validate
          >
            <span slot="required-error">入力してください（カスタム）</span>
            <span slot="overflow-error">10文字までです（カスタム）</span>
          </dads-textarea>
        </section>

        <!-- 複合テスト -->
        <section style="margin-bottom: 32px;">
          <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">複合テスト（必須 + 文字数制限）</h3>
          <dads-textarea
            id="test-combined"
            label="お問い合わせ内容"
            support-text="必須項目です。100文字以内で入力してください。"
            required
            maxlength="100"
            show-counter
            auto-validate
          ></dads-textarea>
        </section>

        <!-- バリデーション無効（比較用） -->
        <section style="margin-bottom: 32px;">
          <h3 style="font-size: 16px; margin-bottom: 12px; color: #555;">バリデーション無効（比較用）</h3>
          <dads-textarea
            id="test-no-validate"
            label="auto-validateなし"
            support-text="auto-validate属性がないため、blur/submitでバリデーションされません。"
            required
            maxlength="10"
            show-counter
          ></dads-textarea>
        </section>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
          <dads-button variant="outlined" type="button" onclick="this.closest('form').reset()">リセット</dads-button>
          <dads-button variant="solid" type="submit">送信</dads-button>
        </div>
      </form>

      <div style="margin-top: 40px; background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-bottom: 10px;">テスト手順</h3>
        <ol style="color: #856404; line-height: 1.8; padding-left: 20px;">
          <li>「文字数テスト」に16文字以上入力し、フォーカスを外す → エラー表示</li>
          <li>文字を削減して入力 → エラークリア</li>
          <li>「必須項目」を空のまま「送信」ボタン → エラー表示</li>
          <li>カスタムメッセージの表示確認</li>
          <li>auto-validateなしのフィールドでは、バリデーションが発生しないことを確認</li>
        </ol>
      </div>
    </div>
  `,

  empty: () => `
    <div style="padding: 40px; text-align: center; color: #666;">
      コンポーネントを選択してください
    </div>
  `
};

export type DemoName = keyof typeof demos;

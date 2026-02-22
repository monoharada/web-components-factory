export type TopTemplateVariant = 'prefecture-multi-depth' | 'prefecture-single-level' | 'municipal-quick-access';
export type ContactTemplateVariant = 'prefecture-contact-center' | 'municipal-streamlined-form' | 'prefecture-issue-specific';
export type ServiceTemplateVariant = 'emergency-resilience-service' | 'digital-application-service' | 'basic-info-service';
export type HubTemplateVariant = 'card-portal' | 'highlight-carousel' | 'streamlined-news';
export type ArticleTemplateVariant = 'meta-update' | 'service-flow' | 'news-stream';

export type TopTemplateOptions = Readonly<{
  id: string;
  variant: TopTemplateVariant;
  navVariant: 'dropdown' | 'horizontal' | 'drawer';
  searchVariant: 'header' | 'full' | 'tabbed';
  emergencyPosition: 'header_banner' | 'content_notice' | 'none';
  shortcutMode: 'quick-task' | 'hub-cards';
  carouselEnabled: boolean;
}>;

export type ContactTemplateOptions = Readonly<{
  id: string;
  variant: ContactTemplateVariant;
  formVariant: 'external' | 'multi_step' | 'simple' | 'none';
  channelFocus: 'phone_email' | 'all_channels';
  filterMode: 'department' | 'page_id' | 'both';
}>;

export type ServiceTemplateOptions = Readonly<{
  id: string;
  variant: ServiceTemplateVariant;
  emergencyMode: 'header_banner' | 'content_notice' | 'none';
  onlineApplyVendor: 'internal' | 'external';
  attachmentsVariant: 'pdf' | 'doc' | 'xls' | 'mixed' | 'none';
  faqEnabled: boolean;
}>;

export type HubTemplateOptions = Readonly<{
  id: string;
  variant: HubTemplateVariant;
  searchVariant: 'header' | 'full' | 'tabbed';
  hubCardsVariant: 'category_list' | 'card_grid' | 'icon' | 'text';
  hubCardsEnabled: boolean;
  carouselEnabled: boolean;
  localNavEnabled: boolean;
  emergencyAssist: 'none' | 'inline' | 'banner';
}>;

export type ArticleTemplateOptions = Readonly<{
  id: string;
  variant: ArticleTemplateVariant;
  metaLevel: 'full' | 'minimal';
  attachmentsVariant: 'pdf' | 'doc' | 'xls' | 'mixed' | 'none';
  contactFormVariant: 'simple' | 'multi_step' | 'external' | 'none';
  tocEnabled: boolean;
  localNavEnabled: boolean;
  newsStreamMode: 'list_focus' | 'article_focus';
}>;

type MenuDepth = 'single' | 'multi';
type SearchVariant = 'header' | 'full' | 'tabbed';

type TopCard = Readonly<{
  title: string;
  summary: string;
  href: string;
}>;

type NewsItem = Readonly<{
  date: string;
  datetime: string;
  title: string;
  href: string;
}>;

const TOP_CARDS: readonly TopCard[] = [
  {
    title: '転入・転出の手続き',
    summary: '引越しに必要な届け出をオンラインで確認できます。',
    href: '#',
  },
  {
    title: '住民票・戸籍の請求',
    summary: '証明書の取得方法と手数料を案内します。',
    href: '#',
  },
  {
    title: '子育て支援の申請',
    summary: '児童手当や保育関連の手続きをまとめています。',
    href: '#',
  },
  {
    title: '防災情報',
    summary: '避難所・ハザードマップ・防災アプリの案内です。',
    href: '#',
  },
];

const NEWS_ITEMS: readonly NewsItem[] = [
  {
    date: '2026年2月18日',
    datetime: '2026-02-18',
    title: '令和8年度 住民税申告の受付開始について',
    href: '#',
  },
  {
    date: '2026年2月14日',
    datetime: '2026-02-14',
    title: '公共施設予約システムのメンテナンス予定',
    href: '#',
  },
  {
    date: '2026年2月10日',
    datetime: '2026-02-10',
    title: '災害時避難行動要支援者制度の登録更新',
    href: '#',
  },
];

const ATTACHMENT_ITEMS = {
  pdf: [{ title: '申請様式（PDF）', support: 'PDF / 240KB' }],
  doc: [{ title: '申請様式（Word）', support: 'DOCX / 96KB' }],
  xls: [{ title: '申請様式（Excel）', support: 'XLSX / 120KB' }],
  mixed: [
    { title: '申請様式（PDF）', support: 'PDF / 240KB' },
    { title: '記入例（Word）', support: 'DOCX / 96KB' },
    { title: '集計表（Excel）', support: 'XLSX / 120KB' },
  ],
} as const;

function renderSkipLink(mainId: string): string {
  return `<a class="municipal-template__skip-link" href="#${mainId}">本文へ移動</a>`;
}

function renderSearchBox(id: string, variant: SearchVariant): string {
  const scopeOptions = variant === 'tabbed'
    ? `
      <optgroup label="くらし">
        <option value="life">くらし・手続き</option>
        <option value="childcare">子育て</option>
      </optgroup>
      <optgroup label="行政情報">
        <option value="department">部署案内</option>
        <option value="faq">よくある質問</option>
      </optgroup>
    `
    : `
      <option value="all">すべて</option>
      <option value="department">部署</option>
      <option value="faq">よくある質問</option>
      <option value="page">ページID</option>
    `;

  const tabs = variant === 'tabbed'
    ? `
      <div class="municipal-template__search-tabs" aria-label="検索カテゴリ">
        <button type="button" aria-pressed="true">横断検索</button>
        <button type="button" aria-pressed="false">くらし検索</button>
        <button type="button" aria-pressed="false">手続き検索</button>
      </div>
    `
    : '';

  return `
    <form class="municipal-template__search-form" role="search" aria-label="サイト内検索">
      <dads-search-box id="${id}" class="municipal-template__search-box">
        ${scopeOptions}
      </dads-search-box>
      ${tabs}
    </form>
  `;
}

function renderGlobalMenu(depth: MenuDepth): string {
  if (depth === 'single') {
    return `
      <dads-global-menu slot="global-menu" aria-label="グローバルナビゲーション">
        <dads-global-menu-item href="#" current>ホーム</dads-global-menu-item>
        <dads-global-menu-item href="#">くらし・手続き</dads-global-menu-item>
        <dads-global-menu-item href="#">事業者向け</dads-global-menu-item>
        <dads-global-menu-item href="#">市政情報</dads-global-menu-item>
      </dads-global-menu>
    `;
  }

  return `
    <dads-global-menu slot="global-menu" aria-label="グローバルナビゲーション">
      <dads-global-menu-item href="#" current>ホーム</dads-global-menu-item>
      <dads-global-menu-item>
        くらし・手続き
        <dads-menu-list-box label="くらし・手続き">
          <dads-menu-list-item href="#">妊娠・出産</dads-menu-list-item>
          <dads-menu-list-item href="#">子育て</dads-menu-list-item>
          <dads-menu-list-item href="#">引越し</dads-menu-list-item>
          <dads-menu-list-item href="#">税金</dads-menu-list-item>
        </dads-menu-list-box>
      </dads-global-menu-item>
      <dads-global-menu-item>
        防災・安全
        <dads-menu-list-box label="防災・安全">
          <dads-menu-list-item href="#">避難情報</dads-menu-list-item>
          <dads-menu-list-item href="#">ハザードマップ</dads-menu-list-item>
          <dads-menu-list-item href="#">災害対策本部</dads-menu-list-item>
        </dads-menu-list-box>
      </dads-global-menu-item>
      <dads-global-menu-item href="#">市政情報</dads-global-menu-item>
    </dads-global-menu>
  `;
}

function renderMobileMenu(): string {
  return `
    <dads-mobile-menu slot="hamburger-menu" aria-label="モバイルメニュー">
      <dads-menu-list-item href="#">ホーム</dads-menu-list-item>
      <dads-menu-list-item href="#">くらし・手続き</dads-menu-list-item>
      <dads-menu-list-item href="#">防災・安全</dads-menu-list-item>
      <dads-menu-list-item href="#">市政情報</dads-menu-list-item>
      <dads-menu-list-item href="#">お問い合わせ</dads-menu-list-item>
    </dads-mobile-menu>
  `;
}

function renderHeader(options: Readonly<{
  id: string;
  siteName: string;
  menuDepth: MenuDepth;
  includeGlobalNav: boolean;
  utilitySearchVariant: SearchVariant | 'none';
}>): string {
  const utilityContent = options.utilitySearchVariant === 'header'
    ? renderSearchBox(`${options.id}-header-search`, 'header')
    : `<dads-utility-link href="#">サイト内検索</dads-utility-link>`;

  return `
    <header slot="header" class="municipal-template__header">
      <dads-header-container mode="auto" aria-label="自治体サイトヘッダー">
        <a slot="logo" href="#">${options.siteName}</a>
        ${options.includeGlobalNav ? renderGlobalMenu(options.menuDepth) : ''}
        ${renderMobileMenu()}
        <div slot="utility" class="municipal-template__header-utility">
          ${utilityContent}
        </div>
      </dads-header-container>
    </header>
  `;
}

function renderFooter(mainId: string): string {
  return `
    <footer slot="footer" class="municipal-template__footer" data-dads-typeset>
      <p>© デジタル市役所</p>
      <nav aria-label="フッターナビゲーション" class="municipal-template__footer-links">
        <dads-utility-link href="#${mainId}">本文先頭へ戻る</dads-utility-link>
        <dads-utility-link href="#">プライバシーポリシー</dads-utility-link>
        <dads-utility-link href="#">ウェブアクセシビリティ</dads-utility-link>
      </nav>
    </footer>
  `;
}

function renderTemplateFrame(pageType: string, variant: string, id: string, body: string, header: string): string {
  const mainId = `${id}-main`;
  return `
    <article class="municipal-template municipal-template--${pageType}" data-page-type="${pageType}" data-template-variant="${variant}">
      ${renderSkipLink(mainId)}
      <dads-layout-shell class="municipal-template__shell" pattern="website" mode="auto" data-dads-typeset>
        ${header}
        <main id="${mainId}" class="municipal-template__main" data-dads-typeset>
          ${body}
        </main>
        ${renderFooter(mainId)}
      </dads-layout-shell>
    </article>
  `;
}

function renderEmergency(mode: 'header_banner' | 'content_notice' | 'none', id: string): string {
  if (mode === 'none') return '';
  if (mode === 'content_notice') {
    return `
      <dads-notification-banner
        class="municipal-template__notice"
        type="warning"
        variant="standard"
        aria-label="注意喚起"
      >
        <span slot="title">重要なお知らせ</span>
        <p>窓口の混雑を避けるため、オンライン手続きを優先してご利用ください。</p>
      </dads-notification-banner>
    `;
  }

  return `
    <dads-emergency-banner
      id="${id}-emergency"
      class="municipal-template__emergency"
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      prefix-mode="manual"
      prefix-label="【緊急】"
    >
      <span slot="heading">災害対応情報を確認してください</span>
      <time slot="timestamp" datetime="2026-02-19T09:00:00+09:00">2026年2月19日 09:00 更新</time>
      <p>避難情報・交通情報・ライフライン情報を随時更新しています。</p>
      <span slot="action">防災ポータルへ</span>
    </dads-emergency-banner>
  `;
}

function renderCardGrid(cards: readonly TopCard[], heading: string): string {
  const rows = cards
    .map((card) => `
      <li>
        <dads-card class="municipal-template__card">
          <h3><a href="${card.href}" data-dads-card-primary data-dads-card-delegate>${card.title}</a></h3>
          <p>${card.summary}</p>
        </dads-card>
      </li>
    `)
    .join('');

  return `
    <section class="municipal-template__section">
      <h2>${heading}</h2>
      <ul class="municipal-template__card-grid">
        ${rows}
      </ul>
    </section>
  `;
}

function renderNewsSection(heading = '新着情報'): string {
  const rows = NEWS_ITEMS
    .map((item) => `
      <dads-resource-list class="municipal-template__resource-item">
        <a slot="title" href="${item.href}">${item.title}</a>
        <time slot="sub" datetime="${item.datetime}">${item.date}</time>
      </dads-resource-list>
    `)
    .join('');

  return `
    <section class="municipal-template__section" aria-label="${heading}">
      <h2>${heading}</h2>
      <div class="municipal-template__resource-list">
        ${rows}
      </div>
    </section>
  `;
}

function renderLifecycleNav(): string {
  return `
    <aside class="municipal-template__section" aria-label="ライフステージ">
      <h2>ライフステージから探す</h2>
      <dads-list marker="none" class="municipal-template__list-nav">
        <dads-list-item><dads-utility-link href="#">妊娠・出産</dads-utility-link></dads-list-item>
        <dads-list-item><dads-utility-link href="#">子育て・教育</dads-utility-link></dads-list-item>
        <dads-list-item><dads-utility-link href="#">就職・退職</dads-utility-link></dads-list-item>
        <dads-list-item><dads-utility-link href="#">介護・福祉</dads-utility-link></dads-list-item>
      </dads-list>
    </aside>
  `;
}

function renderContactInfoBlock(): string {
  return `
    <section class="municipal-template__section" aria-label="代表連絡先">
      <h2>代表連絡先</h2>
      <dads-description-list>
        <div>
          <dt>電話</dt>
          <dd><a href="tel:0312345678">03-1234-5678</a></dd>
        </div>
        <div>
          <dt>住所</dt>
          <dd>東京都デジタル市1-2-3</dd>
        </div>
        <div>
          <dt>受付時間</dt>
          <dd>平日 9:00-17:00</dd>
        </div>
      </dads-description-list>
    </section>
  `;
}

function renderCarousel(id: string, label: string): string {
  return `<dads-carousel class="municipal-template__carousel" data-municipal-carousel="${id}" aria-label="${label}"></dads-carousel>`;
}

function renderBreadcrumb(currentLabel: string): string {
  return `
    <dads-breadcrumb aria-label="パンくず">
      <dads-breadcrumb-item home href="#">ホーム</dads-breadcrumb-item>
      <dads-breadcrumb-item href="#">くらし・手続き</dads-breadcrumb-item>
      <dads-breadcrumb-item>${currentLabel}</dads-breadcrumb-item>
    </dads-breadcrumb>
  `;
}

function renderAttachmentSection(variant: 'pdf' | 'doc' | 'xls' | 'mixed' | 'none'): string {
  if (variant === 'none') return '';
  const items = ATTACHMENT_ITEMS[variant];
  const rows = items
    .map((item) => `
      <dads-resource-list class="municipal-template__resource-item">
        <a slot="title" href="#" download>${item.title}</a>
        <span slot="support">${item.support}</span>
      </dads-resource-list>
    `)
    .join('');

  return `
    <section class="municipal-template__section" aria-label="添付資料">
      <h2>添付資料</h2>
      <div class="municipal-template__resource-list">
        ${rows}
      </div>
    </section>
  `;
}

function renderContactForm(variant: 'simple' | 'multi_step' | 'external' | 'none', id: string): string {
  if (variant === 'none') {
    return `
      <section class="municipal-template__section" aria-label="問い合わせフォームなし">
        <h2>お問い合わせ方法</h2>
        <p>電話・メール窓口で受け付けています。フォーム受付は行っていません。</p>
      </section>
    `;
  }

  if (variant === 'external') {
    return `
      <section class="municipal-template__section" aria-label="外部フォーム案内">
        <h2>オンラインお問い合わせ</h2>
        <dads-card class="municipal-template__card">
          <h3>外部フォームを利用する</h3>
          <p>入力完了後、外部サイトで送信確認が表示されます。</p>
          <dads-button type="button" variant="outlined" size="small">
            <a href="https://example.com/form" target="_blank" rel="noopener noreferrer">外部フォームへ</a>
          </dads-button>
        </dads-card>
      </section>
    `;
  }

  if (variant === 'multi_step') {
    return `
      <section class="municipal-template__section" aria-label="ステップフォーム">
        <h2>お問い合わせフォーム（ステップ）</h2>
        <dads-step-navigation orientation="horizontal" size="normal" aria-label="入力ステップ" status-live="off">
          <span slot="status">全3ステップ中、2ステップ目です</span>
          <dads-step-navigation-item state="completed">
            <span slot="title">分類選択</span>
            <span slot="description">完了</span>
          </dads-step-navigation-item>
          <dads-step-navigation-item state="editing" aria-current="step">
            <span slot="title">内容入力</span>
            <span slot="description">入力中</span>
          </dads-step-navigation-item>
          <dads-step-navigation-item state="error">
            <span slot="title">確認・送信</span>
            <span slot="description">未完了</span>
          </dads-step-navigation-item>
        </dads-step-navigation>
        <dads-fieldset legend="お問い合わせ内容" support-text="必須項目を入力してください。">
          <dads-input-text label="件名" required></dads-input-text>
          <dads-textarea label="お問い合わせ本文" required error error-text="本文を入力してください"></dads-textarea>
          <dads-file-upload label="参考資料" support-text="PDF / JPEG / PNG" mode="button-only"></dads-file-upload>
        </dads-fieldset>
      </section>
    `;
  }

  return `
    <section class="municipal-template__section" aria-label="シンプルフォーム">
      <h2>お問い合わせフォーム</h2>
      <dads-fieldset legend="入力" support-text="折り返し連絡のための情報を入力してください。">
        <dads-input-text label="氏名" required></dads-input-text>
        <dads-input-text label="メールアドレス" type="email" required></dads-input-text>
        <dads-textarea label="お問い合わせ内容" required></dads-textarea>
      </dads-fieldset>
      <div class="municipal-template__actions">
        <dads-button type="button" variant="outlined">下書き保存</dads-button>
        <dads-button type="button">内容を確認する</dads-button>
      </div>
    </section>
  `;
}

function renderConsentSection(id: string): string {
  return `
    <section class="municipal-template__section" aria-label="個人情報同意">
      <h2>個人情報の取り扱い</h2>
      <p id="${id}-privacy-note">送信前に個人情報保護方針を確認してください。</p>
      <dads-checkbox aria-describedby="${id}-privacy-note" required>
        個人情報保護方針に同意します
      </dads-checkbox>
    </section>
  `;
}

function renderDepartmentTable(): string {
  return `
    <section class="municipal-template__section" aria-label="担当部署一覧">
      <h2>担当部署一覧</h2>
      <dads-table>
        <table data-cell-border="bottom">
          <thead>
            <tr>
              <th scope="col">部署</th>
              <th scope="col">担当</th>
              <th scope="col">電話</th>
              <th scope="col">メール</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">市民課</th>
              <td>住民票・戸籍</td>
              <td><a href="tel:0311110001">03-1111-0001</a></td>
              <td><a href="mailto:shiminka@example.jp">shiminka@example.jp</a></td>
            </tr>
            <tr>
              <th scope="row">福祉課</th>
              <td>障害福祉・介護</td>
              <td><a href="tel:0311110002">03-1111-0002</a></td>
              <td><a href="mailto:fukushi@example.jp">fukushi@example.jp</a></td>
            </tr>
          </tbody>
        </table>
      </dads-table>
    </section>
  `;
}

function renderChannelCards(focus: 'phone_email' | 'all_channels'): string {
  const allCards = [
    {
      title: '電話で問い合わせ',
      body: '<a href="tel:0312345678">03-1234-5678</a>（平日 9:00-17:00）',
    },
    {
      title: 'メールで問い合わせ',
      body: '<a href="mailto:inquiry@example.jp">inquiry@example.jp</a>',
    },
    {
      title: 'フォームで問い合わせ',
      body: '<a href="#">フォーム入力へ進む</a>',
    },
    {
      title: 'FAXで問い合わせ',
      body: '03-1234-9999',
    },
  ] as const;

  const cards = focus === 'phone_email'
    ? [allCards[0], allCards[1]]
    : allCards;

  const rows = cards
    .map((card) => `
      <li>
        <dads-card class="municipal-template__card">
          <h3>${card.title}</h3>
          <p>${card.body}</p>
        </dads-card>
      </li>
    `)
    .join('');

  return `
    <section class="municipal-template__section" aria-label="問い合わせチャネル">
      <h2>問い合わせチャネル</h2>
      <ul class="municipal-template__card-grid">
        ${rows}
      </ul>
    </section>
  `;
}

function renderLocalNav(title: string, open = true): string {
  const openAttr = open ? ' open' : '';
  return `
    <aside class="municipal-template__section" aria-label="ローカルナビゲーション">
      <h2>${title}</h2>
      <dads-disclosure${openAttr}>
        <span slot="summary">カテゴリ一覧</span>
        <div slot="content">
          <dads-list marker="none" class="municipal-template__list-nav">
            <dads-list-item><dads-utility-link href="#">申請手続き</dads-utility-link></dads-list-item>
            <dads-list-item><dads-utility-link href="#">制度案内</dads-utility-link></dads-list-item>
            <dads-list-item><dads-utility-link href="#">関連FAQ</dads-utility-link></dads-list-item>
          </dads-list>
        </div>
        <span slot="back-link">カテゴリ一覧の先頭へ戻る</span>
      </dads-disclosure>
    </aside>
  `;
}

export function renderTopTemplate(options: TopTemplateOptions): string {
  const heading = options.shortcutMode === 'quick-task' ? 'よく使う手続き' : '目的別メニュー';
  const searchSection = options.searchVariant === 'header'
    ? ''
    : `
      <section class="municipal-template__section" aria-label="検索">
        <h2>サイト内検索</h2>
        ${renderSearchBox(`${options.id}-main-search`, options.searchVariant)}
      </section>
    `;

  const emergencySection = renderEmergency(options.emergencyPosition, options.id);
  const carouselSection = options.carouselEnabled
    ? `
      <section class="municipal-template__section" aria-label="ピックアップカルーセル">
        <h2>注目情報（カルーセル）</h2>
        ${renderCarousel(`${options.id}-top`, 'トップページ注目情報')}
      </section>
    `
    : '';

  const header = renderHeader({
    id: options.id,
    siteName: 'デジタル市',
    menuDepth: options.variant === 'prefecture-single-level' ? 'single' : 'multi',
    includeGlobalNav: options.navVariant !== 'drawer',
    utilitySearchVariant: options.searchVariant === 'header' ? 'header' : 'none',
  });

  const body = `
    <header class="municipal-template__section" aria-label="ページタイトル">
      <h1>トップページ</h1>
      <div class="municipal-template__meta">
        <dads-chip-label>${options.variant}</dads-chip-label>
        <dads-chip-label>${options.navVariant}</dads-chip-label>
        <dads-chip-label>${options.searchVariant}</dads-chip-label>
      </div>
    </header>
    ${emergencySection}
    ${searchSection}
    ${renderCardGrid(TOP_CARDS, heading)}
    ${renderLifecycleNav()}
    ${renderNewsSection('新着情報')}
    <section class="municipal-template__section" aria-label="ピックアップ">
      <h2>ピックアップ</h2>
      <dads-card class="municipal-template__card">
        <h3><a href="#" data-dads-card-primary data-dads-card-delegate>確定申告特集</a></h3>
        <p>申告手順・必要書類・オンライン申請の流れを確認できます。</p>
      </dads-card>
    </section>
    ${carouselSection}
    ${renderContactInfoBlock()}
  `;

  return renderTemplateFrame('top', options.variant, options.id, body, header);
}

export function renderContactTemplate(options: ContactTemplateOptions): string {
  const header = renderHeader({
    id: options.id,
    siteName: 'デジタル市',
    menuDepth: 'single',
    includeGlobalNav: true,
    utilitySearchVariant: 'none',
  });

  const filterDepartment = options.filterMode === 'department' || options.filterMode === 'both'
    ? `
      <dads-select label="部署で絞り込み" size="md full">
        <option value="">すべて</option>
        <option value="shiminka">市民課</option>
        <option value="fukushi">福祉課</option>
      </dads-select>
    `
    : '';

  const filterPageId = options.filterMode === 'page_id' || options.filterMode === 'both'
    ? '<dads-input-text label="ページID" placeholder="例: KENKOU-001"></dads-input-text>'
    : '';

  const filterExpanded = options.filterMode === 'both' ? 'true' : 'false';
  const detailsOpen = options.filterMode === 'both' ? ' open' : '';

  const body = `
    <header class="municipal-template__section" aria-label="ページタイトル">
      <h1>お問い合わせ</h1>
      <div class="municipal-template__meta">
        <dads-chip-label>${options.variant}</dads-chip-label>
        <dads-chip-label>${options.formVariant}</dads-chip-label>
        <dads-chip-label>${options.filterMode}</dads-chip-label>
      </div>
    </header>
    ${renderBreadcrumb('お問い合わせ')}
    ${options.variant === 'prefecture-issue-specific' ? renderLocalNav('分野別ナビ', true) : ''}

    <section class="municipal-template__section" aria-label="問い合わせ先の絞り込み">
      <h2>問い合わせ先を絞り込む</h2>
      <button type="button" aria-expanded="${filterExpanded}" class="municipal-template__toggle-button">詳細条件</button>
      <details${detailsOpen}>
        <summary>絞り込み条件</summary>
        <div class="municipal-template__filters">
          ${filterDepartment}
          ${filterPageId}
          <dads-button type="button" variant="outlined">検索</dads-button>
        </div>
      </details>
    </section>

    ${renderDepartmentTable()}
    ${renderChannelCards(options.channelFocus)}
    ${renderContactForm(options.formVariant, options.id)}
    ${options.formVariant === 'none' ? '' : renderConsentSection(options.id)}
    ${renderAttachmentSection('mixed')}

    <section class="municipal-template__section" aria-label="受付時間">
      <h2>受付時間</h2>
      <dads-description-list>
        <div>
          <dt>電話</dt>
          <dd>平日 9:00-17:00（祝日を除く）</dd>
        </div>
        <div>
          <dt>メール</dt>
          <dd>24時間受付（回答は開庁時間内）</dd>
        </div>
        <div>
          <dt>代表窓口</dt>
          <dd><a href="tel:0312345678">03-1234-5678</a></dd>
        </div>
      </dads-description-list>
    </section>
  `;

  return renderTemplateFrame('contact', options.variant, options.id, body, header);
}

export function renderServiceTemplate(options: ServiceTemplateOptions): string {
  const header = renderHeader({
    id: options.id,
    siteName: 'デジタル市',
    menuDepth: options.variant === 'basic-info-service' ? 'single' : 'multi',
    includeGlobalNav: true,
    utilitySearchVariant: 'none',
  });

  const emergencySection = renderEmergency(options.emergencyMode, options.id);

  const onlineApplyVendorName = options.onlineApplyVendor === 'external'
    ? 'Gov e-Apply（外部ベンダー）'
    : '市公式オンライン申請システム';

  const vendorNote = options.onlineApplyVendor === 'external'
    ? `<p>${onlineApplyVendorName}へ移動します（新しいタブで開きます）。</p>`
    : `<p>${onlineApplyVendorName}から手続きできます。</p>`;

  const applyAction = options.onlineApplyVendor === 'external'
    ? `
      <dads-button type="button">
        <a href="https://example.com/external-apply" target="_blank" rel="noopener noreferrer">外部申請サイトへ進む</a>
      </dads-button>
    `
    : '<dads-button type="button">申請ページへ進む</dads-button>';

  const faqSection = options.faqEnabled
    ? `
      <section class="municipal-template__section" aria-label="FAQ">
        <h2>よくある質問</h2>
        <dads-accordion-details>
          <dads-accordion-item-details expanded>
            <span slot="header">代理申請はできますか？</span>
            <div slot="content">委任状と本人確認書類があれば可能です。</div>
          </dads-accordion-item-details>
          <dads-accordion-item-details>
            <span slot="header">郵送申請は可能ですか？</span>
            <div slot="content">可能です。必要書類を同封して担当課へ送付してください。</div>
          </dads-accordion-item-details>
        </dads-accordion-details>
      </section>
    `
    : '';

  const body = `
    <header class="municipal-template__section" aria-label="ページタイトル">
      <h1>手続き詳細</h1>
      <div class="municipal-template__meta">
        <dads-chip-label>${options.variant}</dads-chip-label>
        <dads-chip-label>${options.onlineApplyVendor}</dads-chip-label>
        <dads-chip-label>${options.attachmentsVariant}</dads-chip-label>
      </div>
    </header>
    ${renderBreadcrumb('手続き詳細')}
    ${emergencySection}

    <section class="municipal-template__section" aria-label="概要">
      <h2>概要</h2>
      <dads-text>このページでは、対象者・必要書類・手数料・処理期間・申請手順を確認できます。</dads-text>
    </section>

    <section class="municipal-template__section" aria-label="手続き要件">
      <h2>対象者・必要書類・費用</h2>
      <dads-description-list>
        <div>
          <dt>対象者</dt>
          <dd>市内在住で、対象制度の要件を満たす方</dd>
        </div>
        <div>
          <dt>手数料</dt>
          <dd>300円（減免制度あり）</dd>
        </div>
        <div>
          <dt>処理期間</dt>
          <dd>受付から5開庁日</dd>
        </div>
      </dads-description-list>
      <dads-table>
        <table data-cell-border="bottom">
          <thead>
            <tr>
              <th scope="col">必要書類</th>
              <th scope="col">必須</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">本人確認書類</th>
              <td>必須</td>
            </tr>
            <tr>
              <th scope="row">委任状</th>
              <td>代理申請時のみ</td>
            </tr>
          </tbody>
        </table>
      </dads-table>
    </section>

    <section class="municipal-template__section" aria-label="手続きステップ">
      <h2>手続きの流れ</h2>
      <dads-step-navigation orientation="horizontal" size="normal" aria-label="手続きステップ" status-live="off">
        <span slot="status">全3ステップです。</span>
        <dads-step-navigation-item state="reached" aria-current="step">
          <span slot="title">申請内容入力</span>
          <span slot="description">ステップ1</span>
        </dads-step-navigation-item>
        <dads-step-navigation-item state="editing">
          <span slot="title">書類添付</span>
          <span slot="description">ステップ2</span>
        </dads-step-navigation-item>
        <dads-step-navigation-item>
          <span slot="title">送信完了</span>
          <span slot="description">ステップ3</span>
        </dads-step-navigation-item>
      </dads-step-navigation>
    </section>

    <section class="municipal-template__section" aria-label="オンライン申請">
      <h2>オンライン申請</h2>
      <dads-card class="municipal-template__card">
        <h3>オンラインで申請する（${onlineApplyVendorName}）</h3>
        ${vendorNote}
        ${applyAction}
      </dads-card>
    </section>

    ${faqSection}

    <section class="municipal-template__section" aria-label="更新履歴">
      <h2>更新履歴</h2>
      <dads-table>
        <table data-cell-border="bottom">
          <thead>
            <tr>
              <th scope="col">更新日</th>
              <th scope="col">更新内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><time datetime="2026-02-10">2026年2月10日</time></th>
              <td>必要書類の説明を更新</td>
            </tr>
            <tr>
              <th scope="row"><time datetime="2026-01-15">2026年1月15日</time></th>
              <td>申請受付期間を更新</td>
            </tr>
          </tbody>
        </table>
      </dads-table>
    </section>

    ${renderAttachmentSection(options.attachmentsVariant)}
    ${renderNewsSection('関連ニュース・イベント')}
    ${renderContactInfoBlock()}
  `;

  return renderTemplateFrame('service', options.variant, options.id, body, header);
}

function renderHubCards(variant: 'category_list' | 'card_grid' | 'icon' | 'text'): string {
  const rows = TOP_CARDS
    .map((card) => `
      <li>
        <dads-card class="municipal-template__card" data-hub-cards-variant="${variant}">
          <h3><a href="#" data-dads-card-primary data-dads-card-delegate>${card.title}</a></h3>
          <p>${card.summary}</p>
        </dads-card>
      </li>
    `)
    .join('');

  return `
    <section class="municipal-template__section" aria-label="カテゴリカード">
      <h2>カテゴリカード</h2>
      <ul class="municipal-template__card-grid">
        ${rows}
      </ul>
    </section>
  `;
}

export function renderHubTemplate(options: HubTemplateOptions): string {
  const header = renderHeader({
    id: options.id,
    siteName: 'デジタル市',
    menuDepth: options.variant === 'streamlined-news' ? 'single' : 'multi',
    includeGlobalNav: options.variant !== 'streamlined-news',
    utilitySearchVariant: options.searchVariant === 'header' ? 'header' : 'none',
  });

  const searchSection = options.searchVariant === 'header'
    ? ''
    : `
      <section class="municipal-template__section" aria-label="ハブ検索">
        <h2>カテゴリ内検索</h2>
        ${renderSearchBox(`${options.id}-search`, options.searchVariant)}
      </section>
    `;

  const pickupSection = `
    <section class="municipal-template__section" aria-label="注目導線">
      <h2>注目導線</h2>
      <dads-card class="municipal-template__card">
        <h3><a href="#" data-dads-card-primary data-dads-card-delegate>新年度の申請スケジュール</a></h3>
        <p>年度更新が必要な手続きを分野別に案内しています。</p>
      </dads-card>
      ${options.carouselEnabled ? renderCarousel(`${options.id}-hub`, 'ハブページ注目導線') : ''}
    </section>
  `;

  const emergencyAssist = options.emergencyAssist === 'banner'
    ? renderEmergency('content_notice', options.id)
    : options.emergencyAssist === 'inline'
      ? '<p class="municipal-template__inline-note">災害情報は防災ポータルで確認できます。</p>'
      : '';

  const body = `
    <header class="municipal-template__section" aria-label="ページタイトル">
      <h1>カテゴリハブ</h1>
      <div class="municipal-template__meta">
        <dads-chip-label>${options.variant}</dads-chip-label>
        <dads-chip-label>${options.hubCardsVariant}</dads-chip-label>
        <dads-chip-label>${options.searchVariant}</dads-chip-label>
      </div>
    </header>

    ${renderBreadcrumb('カテゴリハブ')}
    ${searchSection}
    ${pickupSection}
    ${options.hubCardsEnabled ? renderHubCards(options.hubCardsVariant) : ''}
    ${renderNewsSection('カテゴリの更新情報')}
    ${options.localNavEnabled ? renderLocalNav('関連カテゴリ', true) : ''}

    <section class="municipal-template__section" aria-label="サポート窓口">
      <h2>サポート窓口</h2>
      ${emergencyAssist}
      <dads-description-list>
        <div>
          <dt>電話</dt>
          <dd><a href="tel:0312345678">03-1234-5678</a></dd>
        </div>
        <div>
          <dt>メール</dt>
          <dd><a href="mailto:support@example.jp">support@example.jp</a></dd>
        </div>
      </dads-description-list>
    </section>
  `;

  return renderTemplateFrame('hub', options.variant, options.id, body, header);
}

function renderArticleMeta(level: 'full' | 'minimal'): string {
  if (level === 'minimal') {
    return `
      <section class="municipal-template__section" aria-label="記事メタ情報">
        <h2>記事情報</h2>
        <p><time datetime="2026-02-19">2026年2月19日 公開</time></p>
      </section>
    `;
  }

  return `
    <section class="municipal-template__section" aria-label="記事メタ情報">
      <h2>記事情報</h2>
      <div class="municipal-template__meta">
        <dads-chip-tag>防災</dads-chip-tag>
        <dads-chip-tag>手続き</dads-chip-tag>
        <dads-chip-label>担当: 危機管理課</dads-chip-label>
      </div>
      <p>
        <time datetime="2026-02-19">2026年2月19日 公開</time>
        /
        <time datetime="2026-02-20">2026年2月20日 更新</time>
      </p>
    </section>
  `;
}

function renderTocSection(id: string, enabled: boolean): string {
  if (!enabled) return '';
  return `
    <nav class="municipal-template__section" aria-label="目次" id="${id}-toc">
      <h2>目次</h2>
      <dads-list marker="none" class="municipal-template__list-nav">
        <dads-list-item><dads-utility-link href="#${id}-article-overview">概要</dads-utility-link></dads-list-item>
        <dads-list-item><dads-utility-link href="#${id}-article-body-steps">手順</dads-utility-link></dads-list-item>
        <dads-list-item><dads-utility-link href="#${id}-article-body-notes">注意事項</dads-utility-link></dads-list-item>
      </dads-list>
    </nav>
  `;
}

function renderArticleBody(id: string): string {
  return `
    <article class="municipal-template__section" aria-label="本文" id="${id}-article-body" data-dads-typeset>
      <h2 id="${id}-article-overview">概要</h2>
      <p>制度改定に伴い、申請時に提出する書類と確認項目が変更されました。</p>

      <h2 id="${id}-article-body-steps">手順</h2>
      <dads-list marker="none" class="municipal-template__list-nav">
        <dads-list-item>対象要件を確認する</dads-list-item>
        <dads-list-item>必要書類を準備する</dads-list-item>
        <dads-list-item>窓口またはオンラインで申請する</dads-list-item>
      </dads-list>

      <h2 id="${id}-article-body-notes">注意事項</h2>
      <dads-blockquote>申請内容に不備がある場合、審査開始までに時間を要します。</dads-blockquote>
      <dads-table>
        <table data-cell-border="bottom">
          <thead>
            <tr>
              <th scope="col">項目</th>
              <th scope="col">内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">受付期間</th>
              <td>2026年3月1日から</td>
            </tr>
            <tr>
              <th scope="row">申請方法</th>
              <td>窓口 / 郵送 / オンライン</td>
            </tr>
          </tbody>
        </table>
      </dads-table>
    </article>
  `;
}

function renderArticleContactForm(variant: 'simple' | 'multi_step' | 'external' | 'none', id: string): string {
  if (variant === 'none') return '';
  if (variant === 'external') {
    return `
      <section class="municipal-template__section" aria-label="外部問い合わせフォーム">
        <h2>お問い合わせフォーム</h2>
        <p>外部フォームで受け付けます。</p>
        <dads-button type="button">
          <a href="https://example.com/contact" target="_blank" rel="noopener noreferrer">外部フォームを開く</a>
        </dads-button>
      </section>
    `;
  }

  if (variant === 'multi_step') {
    return `
      <section class="municipal-template__section" aria-label="問い合わせフォーム（ステップ）">
        <h2>お問い合わせフォーム</h2>
        <dads-step-navigation orientation="horizontal" size="normal" aria-label="入力ステップ" status-live="off">
          <span slot="status">全2ステップ中、1ステップ目です。</span>
          <dads-step-navigation-item state="editing" aria-current="step">
            <span slot="title">入力</span>
            <span slot="description">ステップ1</span>
          </dads-step-navigation-item>
          <dads-step-navigation-item>
            <span slot="title">確認</span>
            <span slot="description">ステップ2</span>
          </dads-step-navigation-item>
        </dads-step-navigation>
        <dads-fieldset legend="お問い合わせ内容" support-text="必須項目を入力してください。">
          <dads-input-text label="氏名" required></dads-input-text>
          <dads-textarea label="内容" required error error-text="内容を入力してください"></dads-textarea>
          <dads-checkbox aria-describedby="${id}-article-form-note">個人情報の取り扱いに同意する</dads-checkbox>
          <p id="${id}-article-form-note">同意がない場合は送信できません。</p>
        </dads-fieldset>
      </section>
    `;
  }

  return `
    <section class="municipal-template__section" aria-label="問い合わせフォーム">
      <h2>お問い合わせフォーム</h2>
      <dads-fieldset legend="入力" support-text="必須項目を入力してください。">
        <dads-input-text label="氏名" required></dads-input-text>
        <dads-input-text label="メールアドレス" type="email" required></dads-input-text>
        <dads-textarea label="内容" required></dads-textarea>
      </dads-fieldset>
    </section>
  `;
}

export function renderArticleTemplate(options: ArticleTemplateOptions): string {
  const header = renderHeader({
    id: options.id,
    siteName: 'デジタル市',
    menuDepth: options.variant === 'news-stream' ? 'single' : 'multi',
    includeGlobalNav: true,
    utilitySearchVariant: 'none',
  });

  const relatedNewsSection = renderNewsSection('関連記事');
  const contactSection = `
    <section class="municipal-template__section" aria-label="担当窓口">
      <h2>担当窓口</h2>
      <dads-description-list>
        <div>
          <dt>担当課</dt>
          <dd>危機管理課</dd>
        </div>
        <div>
          <dt>電話</dt>
          <dd><a href="tel:0312340000">03-1234-0000</a></dd>
        </div>
        <div>
          <dt>メール</dt>
          <dd><a href="mailto:kiki@example.jp">kiki@example.jp</a></dd>
        </div>
      </dads-description-list>
    </section>
  `;

  const articleBodyAndAfter = `
    ${renderArticleBody(options.id)}
    ${renderAttachmentSection(options.attachmentsVariant)}
    ${contactSection}
    ${renderArticleContactForm(options.contactFormVariant, options.id)}
  `;

  const body = `
    <header class="municipal-template__section" aria-label="ページタイトル">
      <h1>記事詳細</h1>
      <div class="municipal-template__meta">
        <dads-chip-label>${options.variant}</dads-chip-label>
        <dads-chip-label>${options.metaLevel}</dads-chip-label>
        <dads-chip-label>${options.contactFormVariant}</dads-chip-label>
      </div>
    </header>

    ${renderBreadcrumb('記事詳細')}
    ${renderArticleMeta(options.metaLevel)}

    <section class="municipal-template__section" aria-label="記事検索">
      <h2>記事内検索</h2>
      ${renderSearchBox(`${options.id}-article-search`, 'full')}
    </section>

    ${renderTocSection(options.id, options.tocEnabled)}
    ${options.newsStreamMode === 'list_focus' ? relatedNewsSection : ''}
    ${articleBodyAndAfter}
    ${options.newsStreamMode === 'article_focus' ? relatedNewsSection : ''}
    ${options.localNavEnabled ? renderLocalNav('関連メニュー', false) : ''}
  `;

  return renderTemplateFrame('article', options.variant, options.id, body, header);
}

import {
  API_TABLE_CSS_VARS_HEADER,
  API_TABLE_CSS_VARS_NOTE,
  API_TABLE_PROPS_HEADER,
  API_TABLE_PROPS_WITH_TYPE_HEADER,
  CHIP_LABEL_ICON_SVG,
  CHIP_TAG_ICON_SVG,
  CHIP_TAG_ICON_OPTIONS,
  MAIL_CLEAR_ICON_SVG,
  dadsColHeaderLine,
  dadsColHeaderLines,
  dadsDataCellLines,
  dadsDataRows,
  dadsHeaderRow,
  dadsRowHeaderRows,
  modulePreloadScript,
  renderAllChipLabels,
  renderApiPanelWrapper,
  repeatLines,
  renderA11ySectionHeader,
  renderAnnotationToggleBlock,
} from './shared.js';

import { headingDemo } from './heading.js';
import { iconPaths } from '../../packages/utils/icons.js';

const CHIP_TAG_ICON_MAP = Object.fromEntries(
  CHIP_TAG_ICON_OPTIONS.map((option) => [option.value, option.svg]),
);
const CHIP_TAG_ICON_OPTIONS_HTML = CHIP_TAG_ICON_OPTIONS
  .map((option) => `<option value="${option.value}"${option.value === 'dummy' ? ' selected' : ''}>${option.label}</option>`)
  .join('');
const CHIP_TAG_EXAMPLE_SEPARATOR = '1px solid var(--color-neutral-solid-gray-420, #949494)';
const CHIP_TAG_EXAMPLE_ROW_STYLE = `
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px 0;
`;
const CHIP_TAG_EXAMPLE_LABEL_STYLE = `
  font-family: var(--font-family-sans);
  font-size: var(--font-size-20, 20px);
  font-weight: var(--font-weight-700, 700);
  line-height: 1.5;
  letter-spacing: 0.4px;
  color: var(--color-neutral-solid-gray-800, #333);
  width: 64px;
`;
const CHIP_TAG_EXAMPLE_CHIP_LIST_STYLE = `
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;
const BUTTON_MATERIAL_ICON_PATHS = {
  dummy: iconPaths.dummy,
  login: iconPaths.login,
  logout: iconPaths.logout,
  settings: iconPaths.settings,
} as const;
const BUTTON_MATERIAL_ICON_OPTIONS_HTML = Object.keys(BUTTON_MATERIAL_ICON_PATHS)
  .map((name) => `<option value="${name}">${name}</option>`)
  .join('');
const CHIP_TAG_PERSON_ICON = `
  <span slot="start-icon" style="padding: 2px; box-sizing: content-box; display: block;">
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="currentcolor" aria-hidden="true">
      <path d="M27 14C27 17.866 23.866 21 20 21C16.134 21 13 17.866 13 14C13 10.134 16.134 7 20 7C23.866 7 27 10.134 27 14Z" />
      <path d="M4.26562 32.3465C7.68269 27.3096 13.4549 24 20.0001 24C26.5458 24 32.3184 27.31 35.7353 32.3475C32.0736 37.0071 26.3868 40 20.0009 40C13.6145 40 7.92729 37.0067 4.26562 32.3465Z" />
      <path d="M39 20C39 9.50659 30.4934 1 20 1C9.50659 1 1 9.50659 1 20C1 30.4934 9.50659 39 20 39L20.0009 40C8.95518 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0466 40 20.0009 40L20 39C30.4934 39 39 30.4934 39 20Z" />
    </svg>
  </span>
`;
const CHIP_TAG_PERSON_CHIP_STYLE = '--dads-chip-tag-icon-size: 40px;';
const renderChipTagPersonChip = (label: string) => `
  <dads-chip-tag style="${CHIP_TAG_PERSON_CHIP_STYLE}" value="${label}">
    ${CHIP_TAG_PERSON_ICON}
    ${label}
  </dads-chip-tag>
`;

const CARD_DEMO_IMAGE_BASE =
  './resources/dads/components/card/upstream/design-system-example-components-html/src/components/card';
const CARD_EXAMPLE_2_IMAGE_1 = `${CARD_DEMO_IMAGE_BASE}/card-2.jpg`;
const CARD_EXAMPLE_2_IMAGE_2 = `${CARD_DEMO_IMAGE_BASE}/card-6.jpg`;
const CARD_EXAMPLE_2_IMAGE_3 = `${CARD_DEMO_IMAGE_BASE}/card-2.jpg`;
const CARD_EXAMPLE_3_AVATAR_IMAGE = `${CARD_DEMO_IMAGE_BASE}/card-3-1.png`;
const CARD_EXAMPLE_3_SUB_IMAGE = `${CARD_DEMO_IMAGE_BASE}/card-3-2.png`;
const CARD_EXAMPLE_5_HERO_IMAGE = './resources/dads/components/card/local/card-5-hero-960x640.jpg';

const RESOURCE_LIST_DEMO_ICON_SVG = `
  <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
    <path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z"/>
  </svg>
`;

const RESOURCE_LIST_ACTION_ICON_SVG = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
    <circle cx="12" cy="4.5" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="12" cy="19.5" r="1.5"/>
  </svg>
`;

const RESOURCE_LIST_ACTION_DOWNLOAD_ICON_SVG = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
    <path d="M12 3a1 1 0 0 1 1 1v8.58l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42L11 12.58V4a1 1 0 0 1 1-1Zm-6 14a1 1 0 0 1 1 1v2h10v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/>
  </svg>
`;

const RESOURCE_LIST_AVATAR_ICON_SVG = `
  <svg slot="icon" width="40" height="40" viewBox="0 0 40 40" fill="currentcolor" aria-hidden="true">
    <path d="M27 14C27 17.866 23.866 21 20 21C16.134 21 13 17.866 13 14C13 10.134 16.134 7 20 7C23.866 7 27 10.134 27 14Z"/>
    <path d="M4.26562 32.3465C7.68269 27.3096 13.4549 24 20.0001 24C26.5458 24 32.3184 27.31 35.7353 32.3475C32.0736 37.0071 26.3868 40 20.0009 40C13.6145 40 7.92729 37.0067 4.26562 32.3465Z"/>
    <path d="M39 20C39 9.50659 30.4934 1 20 1C9.50659 1 1 9.50659 1 20C1 30.4934 9.50659 39 20 39L20.0009 40C8.95518 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0466 40 20.0009 40L20 39C30.4934 39 39 30.4934 39 20Z"/>
  </svg>
`;

type ResourceListControlKind = 'checkbox' | 'radio';
type ResourceListActionKind = 'menu' | 'download';

type ResourceListDemoRow = Readonly<{
  style?: 'list' | 'frame';
  interaction?: 'inline' | 'whole';
  className?: string;
  href?: string;
  title: string;
  titleHref?: string;
  label?: string;
  labelHtml?: string;
  support?: string;
  supportHtml?: string;
  sub?: string;
  subHtml?: string;
  iconHtml?: string;
  control?: ResourceListControlKind;
  controlChecked?: boolean;
  controlDisabled?: boolean;
  controlName?: string;
  controlAriaLabel?: string;
  controlAriaLabelledby?: string;
  action?: ResourceListActionKind;
  actionHtml?: string;
  actionAriaLabel?: string;
  componentAttrs?: string;
}>;

type ResourceListControlRenderOptions = Readonly<{
  ariaLabelledby?: string;
}>;

function injectSlotIdIfMissing(markup: string, slotName: string, id: string): string {
  if (!markup.includes(`slot="${slotName}"`)) return markup;
  if (/\sid=/.test(markup)) return markup;
  return markup.replace(`slot="${slotName}"`, `slot="${slotName}" id="${id}"`);
}

function renderResourceListControl(
  row: ResourceListDemoRow,
  options: ResourceListControlRenderOptions = {}
): string {
  if (row.control === 'checkbox') {
    const checked = row.controlChecked ? ' checked' : '';
    const disabled = row.controlDisabled ? ' disabled' : '';
    const ariaLabel = row.controlAriaLabel?.trim();
    const ariaLabelledby = (row.controlAriaLabelledby ?? options.ariaLabelledby)?.trim();
    const ariaLabelAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
    const ariaLabelledbyAttr = !ariaLabel && ariaLabelledby ? ` aria-labelledby="${ariaLabelledby}"` : '';
    return `<dads-checkbox slot="control"${checked}${disabled}${ariaLabelAttr}${ariaLabelledbyAttr}></dads-checkbox>`;
  }
  if (row.control === 'radio') {
    const checked = row.controlChecked ? ' checked' : '';
    const disabled = row.controlDisabled ? ' disabled' : '';
    const name = row.controlName ?? 'resource-list-demo-radio';
    const ariaLabel = row.controlAriaLabel?.trim();
    const ariaLabelledby = (row.controlAriaLabelledby ?? options.ariaLabelledby)?.trim();
    const ariaLabelAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
    const ariaLabelledbyAttr = !ariaLabel && ariaLabelledby ? ` aria-labelledby="${ariaLabelledby}"` : '';
    return `<dads-radio slot="control" name="${name}"${checked}${disabled}${ariaLabelAttr}${ariaLabelledbyAttr}></dads-radio>`;
  }
  return '';
}

function renderResourceListAction(row: ResourceListDemoRow): string {
  if (row.actionHtml) return row.actionHtml;

  if (row.action === 'menu') {
    const ariaLabel = row.actionAriaLabel ?? 'メニュー';
    return `<button slot="action" type="button" aria-label="${ariaLabel}">${RESOURCE_LIST_ACTION_ICON_SVG}</button>`;
  }
  if (row.action === 'download') {
    const ariaLabel = row.actionAriaLabel ?? 'ダウンロード';
    return `<button slot="action" type="button" aria-label="${ariaLabel}">${RESOURCE_LIST_ACTION_DOWNLOAD_ICON_SVG}</button>`;
  }
  return '';
}

function renderResourceListActionMenu(
  menuId: string,
  menuLabel: string,
  menuItems: readonly string[],
  triggerLabel = `${menuLabel}を開く`,
): string {
  const summaryLabel = triggerLabel.trim() || 'メニューを開く';
  return `
    <details slot="action" class="resource-list-account-menu">
      <summary aria-label="${summaryLabel}" aria-haspopup="menu" aria-controls="${menuId}">
        ${RESOURCE_LIST_ACTION_ICON_SVG}
      </summary>
      <ul id="${menuId}" role="menu" aria-label="${menuLabel}">
        ${menuItems.map((item) => `<li role="none"><button type="button" role="menuitem">${item}</button></li>`).join('')}
      </ul>
    </details>
  `;
}

function renderResourceListAccountActionMenu(menuId: string, accountName: string): string {
  const contextualLabel = `${accountName}のアカウント操作`;
  return renderResourceListActionMenu(menuId, contextualLabel, [
    'プロフィールを見る',
    '権限を変更',
    '招待を再送',
  ], `${contextualLabel}を開く`);
}

function renderResourceListDemoRow(row: ResourceListDemoRow, rowKey = 'resource-list-row'): string {
  const attrs = [
    `data-style="${row.style ?? 'list'}"`,
    `data-interaction="${row.interaction ?? 'inline'}"`,
  ];

  if (row.className) attrs.push(`class="${row.className}"`);
  if (row.href) attrs.push(`href="${row.href}"`);
  if (row.componentAttrs) attrs.push(row.componentAttrs.trim());

  const titleId = `${rowKey}-title`;
  const supportId = `${rowKey}-support`;
  const controlAriaLabelledby =
    row.control && (row.support || row.supportHtml)
      ? `${titleId} ${supportId}`
      : row.control
        ? titleId
        : undefined;

  const titleMarkup = row.titleHref
    ? `<a slot="title" id="${titleId}" href="${row.titleHref}">${row.title}</a>`
    : `<span slot="title" id="${titleId}">${row.title}</span>`;

  const labelMarkup = row.labelHtml
    ? row.labelHtml
    : (row.label ? `<span slot="label">${row.label}</span>` : '');

  const supportMarkup = row.supportHtml
    ? injectSlotIdIfMissing(row.supportHtml, 'support', supportId)
    : (row.support ? `<span slot="support" id="${supportId}">${row.support}</span>` : '');

  const subMarkup = row.subHtml
    ? row.subHtml
    : (row.sub ? `<span slot="sub">${row.sub}</span>` : '');

  return `
    <dads-resource-list ${attrs.join(' ')}>
      ${renderResourceListControl(row, { ariaLabelledby: controlAriaLabelledby })}
      ${row.iconHtml ?? ''}
      ${titleMarkup}
      ${labelMarkup}
      ${supportMarkup}
      ${subMarkup}
      ${renderResourceListAction(row)}
    </dads-resource-list>
  `;
}

const NOTIFICATION_BANNER_TYPES = ['success', 'error', 'warning', 'info-1', 'info-2'] as const;
type NotificationBannerDemoType = (typeof NOTIFICATION_BANNER_TYPES)[number];

const NOTIFICATION_BANNER_COPY: Record<NotificationBannerDemoType, { title: string }> = {
  success: { title: '登録手続きは全て完了しました' },
  error: { title: '操作を完了できませんでした' },
  warning: { title: '偽SNSアカウントにご注意ください' },
  'info-1': { title: '登録期間が延長されました' },
  'info-2': { title: '重要なお知らせ' },
};

const NOTIFICATION_BANNER_API_COPY: Record<
  NotificationBannerDemoType,
  {
    title: string;
    meta: string;
    description: string;
    secondaryAction: string;
    primaryAction: string;
  }
> = {
  success: {
    title: '登録手続きは全て完了しました',
    meta: '2024年7月1日',
    description: '申請の受付が完了しました。続けて申請状況をご確認ください。',
    secondaryAction: '詳細',
    primaryAction: '確認',
  },
  error: {
    title: '操作を完了できませんでした',
    meta: '2024年7月1日',
    description: '通信状況をご確認のうえ、時間をおいて再度お試しください。',
    secondaryAction: 'ヘルプ',
    primaryAction: '再試行',
  },
  warning: {
    title: '偽SNSアカウントにご注意ください',
    meta: '2024年7月1日',
    description: '公式情報は自治体ポータルから確認し、不審なリンクは開かないでください。',
    secondaryAction: '注意事項',
    primaryAction: '確認しました',
  },
  'info-1': {
    title: '登録期間が延長されました',
    meta: '2024年7月1日',
    description: '期限が延長されたため、期日までに必要な手続きを行ってください。',
    secondaryAction: '対象を確認',
    primaryAction: '手続きを進める',
  },
  'info-2': {
    title: '重要なお知らせ',
    meta: '2024年7月1日',
    description: '制度更新に伴い、提出書類の要件が一部変更されています。',
    secondaryAction: '変更点を見る',
    primaryAction: '詳細を確認',
  },
};

const NOTIFICATION_BANNER_BACKGROUND_COPY: Record<
  NotificationBannerDemoType,
  {
    title: string;
    description: string;
  }
> = {
  success: {
    title: '登録手続きは全て完了しました',
    description: 'ダミーテキストは、デザインの作成時に使用される仮の文章です。',
  },
  error: {
    title: '操作を完了できませんでした',
    description: 'ダミーテキストは、デザインの作成時に使用される仮の文章です。',
  },
  warning: {
    title: '偽SNSアカウントにご注意ください',
    description: 'ダミーテキストは、デザインの作成時に使用される仮の文章です。',
  },
  'info-1': {
    title: '登録期間が延長されました',
    description: 'ダミーテキストは、デザインの作成時に使用される仮の文章です。',
  },
  'info-2': {
    title: '重要なお知らせ',
    description: 'ダミーテキストは、デザインの作成時に使用される仮の文章です。',
  },
};

type NotificationBannerDemoOptions = {
  variant?: 'standard' | 'color-chip';
  dense?: boolean;
  compactClose?: boolean;
  dismissMode?: 'hide' | 'collapse';
  restoreLabel?: string;
};

const renderNotificationBannerDemoItem = (
  type: NotificationBannerDemoType,
  options: NotificationBannerDemoOptions = {}
): string => {
  const copy = NOTIFICATION_BANNER_COPY[type];
  const variant = options.variant ?? 'standard';
  const denseAttr = options.dense ? ' dense' : '';
  const closeStyleAttr = options.compactClose ? ' close-style="compact"' : '';
  const dismissModeAttr = options.dismissMode ? ` dismiss-mode="${options.dismissMode}"` : '';
  const restoreLabelAttr = options.restoreLabel ? ` restore-label="${options.restoreLabel}"` : '';
  const buttonSize = options.dense ? 'small' : 'medium';

  return `
    <dads-notification-banner type="${type}" variant="${variant}" dismissible${denseAttr}${closeStyleAttr}${dismissModeAttr}${restoreLabelAttr}>
      <span slot="title">${copy.title}</span>
      <time slot="meta" datetime="2024-07-01">年月日</time>
      <p>バナーデスクリプション</p>
      <dads-button slot="actions" variant="outlined" size="${buttonSize}">ラベル</dads-button>
      <dads-button slot="actions" variant="solid" size="${buttonSize}">アクションボタン</dads-button>
    </dads-notification-banner>
  `;
};

const renderNotificationBannerDemoItems = (
  options: NotificationBannerDemoOptions = {}
): string =>
  NOTIFICATION_BANNER_TYPES.map((type) => renderNotificationBannerDemoItem(type, options)).join('');

export const demos = {

  heading: headingDemo,

  divider: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ディバイダー</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS互換の <code>data-color</code> / <code>data-style</code> / <code>data-width</code> を持つ区切り線コンポーネントです。
        既定で上下余白（8px）を持ち、<code>orientation=&quot;vertical&quot;</code> は左右区切り線として利用できます。
      </p>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Preview</h3>
        <div style="display: grid; gap: 24px;">
          <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <p style="margin: 0;">セクション A</p>
            <dads-divider></dads-divider>
            <p style="margin: 0;">セクション B</p>
          </div>

          <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>印刷</span>
              <dads-divider orientation="vertical" style="--dads-divider-vertical-length: 1.25rem;"></dads-divider>
              <span>CSVダウンロード</span>
              <dads-divider orientation="vertical" data-style="dashed" style="--dads-divider-vertical-length: 1.25rem;"></dads-divider>
              <span>新規追加</span>
            </div>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          属性とCSS変数を操作して表示を確認できます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-divider',
            'dads-table',
            'dads-input-text',
          ],
          rootAttrs: 'data-divider-api-panel',
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <div data-divider-preview style="display: grid; gap: 0;">
                  <p data-divider-before style="margin: 0;">上段コンテンツ</p>
                  <dads-divider data-api-target></dads-divider>
                  <p data-divider-after style="margin: 0;">下段コンテンツ</p>
                </div>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-divider
                      data-color="solid-gray-420"
                      data-style="solid"
                      data-width="1"
                      orientation="horizontal"
                    ></dads-divider>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>orientation</code></th>
                        <td><code>attr</code></td>
                        <td><code>'horizontal' | 'vertical'</code></td>
                        <td><code>horizontal</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="orientation" data-api-attr="orientation" data-default="horizontal">
                              <option value="horizontal" selected>horizontal</option>
                              <option value="vertical">vertical</option>
                            </select>
                          </div>
                        </td>
                        <td>区切り方向</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>data-color</code></th>
                        <td><code>attr</code></td>
                        <td><code>'solid-gray-420' | 'solid-gray-536' | 'black'</code></td>
                        <td><code>solid-gray-420</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="data-color" data-api-attr="data-color" data-default="solid-gray-420">
                              <option value="solid-gray-420" selected>solid-gray-420</option>
                              <option value="solid-gray-536">solid-gray-536</option>
                              <option value="black">black</option>
                            </select>
                          </div>
                        </td>
                        <td>線色（DADS互換）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>data-style</code></th>
                        <td><code>attr</code></td>
                        <td><code>'solid' | 'dashed'</code></td>
                        <td><code>solid</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="data-style" data-api-attr="data-style" data-default="solid">
                              <option value="solid" selected>solid</option>
                              <option value="dashed">dashed</option>
                            </select>
                          </div>
                        </td>
                        <td>線種（DADS互換）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>data-width</code></th>
                        <td><code>attr</code></td>
                        <td><code>'1' | '2' | '3' | '4'</code></td>
                        <td><code>1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="data-width" data-api-attr="data-width" data-default="1">
                              <option value="1" selected>1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                          </div>
                        </td>
                        <td>線幅（DADS互換）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-divider-color</code></th>
                        <td><code>--color-neutral-solid-gray-420</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-divider-color" value="" data-api-css-var="--dads-divider-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>線色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-divider-margin</code></th>
                        <td><code>8px 0</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-divider-margin" value="" data-api-css-var="--dads-divider-margin" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>区切り余白（shorthand・推奨）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-divider-margin-vertical</code></th>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-divider-margin-vertical" value="" data-api-css-var="--dads-divider-margin-vertical" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>vertical 専用上書き（必要時のみ）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-divider-margin-block</code></th>
                        <td><code>--spacing-2</code>（8px）</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-divider-margin-block" value="" data-api-css-var="--dads-divider-margin-block" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>上下余白（主に horizontal）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-divider-margin-inline</code></th>
                        <td><code>0</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-divider-margin-inline" value="" data-api-css-var="--dads-divider-margin-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右余白（主に vertical）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-divider-vertical-length</code></th>
                        <td><code>30px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-divider-vertical-length" value="" data-api-css-var="--dads-divider-vertical-length" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>垂直方向時の線長</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <script type="module">
        await Promise.all([
          import('dads-divider'),
          import('dads-table'),
          import('dads-input-text'),
          import('dads-code-block'),
        ]);

        const panel = document.querySelector('[data-divider-api-panel]');
        const preview = panel?.querySelector('[data-divider-preview]');
        const divider = panel?.querySelector('dads-divider[data-api-target]');
        const before = panel?.querySelector('[data-divider-before]');
        const after = panel?.querySelector('[data-divider-after]');

        const updatePreviewLayout = () => {
          if (!preview || !divider || !before || !after) return;

          const isVertical = divider.getAttribute('orientation') === 'vertical';
          preview.style.display = isVertical ? 'flex' : 'grid';
          preview.style.alignItems = isVertical ? 'center' : '';
          preview.style.gap = '0';
          before.textContent = isVertical ? '左コンテンツ' : '上段コンテンツ';
          after.textContent = isVertical ? '右コンテンツ' : '下段コンテンツ';
        };

        if (divider) {
          const observer = new MutationObserver(updatePreviewLayout);
          observer.observe(divider, { attributes: true, attributeFilter: ['orientation'] });
        }

        const orientationControl = panel?.querySelector('[data-api-attr="orientation"]');
        orientationControl?.addEventListener('change', updatePreviewLayout);
        orientationControl?.addEventListener('dads-change', updatePreviewLayout);
        updatePreviewLayout();
      </script>
    </div>
  `,

  blockquote: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">引用ブロック</h2>
      <p style="color: #666; margin-bottom: 32px;">
        デジタル庁デザインシステム準拠の引用ブロックコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈（a11y-annotate） -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate target-selector="dads-blockquote">
          <div style="padding: 60px 0;">
            <dads-blockquote>
              <p slot="lead">これは冒頭の段落です。</p>
              <p>本文の段落です。デジタル庁デザインシステムのスタイルに準拠しています。</p>
              <p slot="close">締め括りの段落です。</p>
            </dads-blockquote>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-blockquote',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-blockquote data-api-target>
                  <p slot="lead">これは冒頭の段落です。</p>
                  <p>本文の段落です。</p>
                  <p slot="close">締め括りの段落です。</p>
                </dads-blockquote>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-blockquote>
                      <p slot="lead">これは冒頭の段落です。</p>
                      <p>本文の段落です。</p>
                      <p slot="close">締め括りの段落です。</p>
                    </dads-blockquote>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>cite</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="cite"
                              value=""
                              data-api-attr="cite"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>引用元URL</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-blockquote-gap</code></th>
                        <td><code>--spacing-4</code><br><small class="wc-api-table__meta">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-gap" value="" data-api-css-var="--dads-blockquote-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>段落間の余白</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-margin-inline</code></th>
                        <td><code>--spacing-10</code><br><small class="wc-api-table__meta">(40px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-margin-inline" value="" data-api-css-var="--dads-blockquote-margin-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右マージン</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-padding-inline-start</code></th>
                        <td><code>--spacing-6</code><br><small class="wc-api-table__meta">(24px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-padding-inline-start" value="" data-api-css-var="--dads-blockquote-padding-inline-start" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-padding-inline-end</code></th>
                        <td><code>--spacing-4</code><br><small class="wc-api-table__meta">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-padding-inline-end" value="" data-api-css-var="--dads-blockquote-padding-inline-end" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-border-width</code></th>
                        <td><code>8px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-border-width" value="" data-api-css-var="--dads-blockquote-border-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左ボーダー幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-border-color</code></th>
                        <td><code>--color-neutral-solid-gray-536</code><br><small class="wc-api-table__meta">(#767676)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-border-color" value="" data-api-css-var="--dads-blockquote-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左ボーダー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-font-size</code></th>
                        <td><code>1.0625rem</code><br><small class="wc-api-table__meta">(17px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-font-size" value="" data-api-css-var="--dads-blockquote-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-blockquote-color</code></th>
                        <td><code>--color-neutral-solid-gray-800</code><br><small class="wc-api-table__meta">(#333)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-blockquote-color" value="" data-api-css-var="--dads-blockquote-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>

          `,
        })}
      </section>

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

    ${modulePreloadScript(['dads-blockquote', 'dads-switch'])}
  `,


  button: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">ボタン</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステムv2.7.0準拠のボタンコンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate target-selector="dads-button">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-button variant="solid" size="medium">ボタンテキスト</dads-button>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          テーブル内の操作が、同じパネル内のターゲット要素へ即時反映されます。
          以降のコンポーネントデモへ横展開するための作例です。
        </p>

        ${renderApiPanelWrapper({
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-button
                  data-api-target
                  variant="solid"
                  size="medium"
                >
                  <svg slot="icon-start" data-api-button-icon-start width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" hidden>
                    <path d="M10 17L5 12L10 7L11.4 8.4L8.8 11H20V13H8.8L11.4 15.6L10 17ZM13 21Q12.175 21 11.588 20.413Q11 19.825 11 19V15H13V19H21V5H13V9H11V5Q11 4.175 11.588 3.588Q12.175 3 13 3H21Q21.825 3 22.413 3.588Q23 4.175 23 5V19Q23 19.825 22.413 20.413Q21.825 21 21 21H13Z" fill="currentcolor" />
                  </svg>
                  <span data-api-button-label>ボタンテキスト</span>
                  <svg slot="icon-end" data-api-button-icon-end width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" hidden>
                    <path d="M16 17L14.6 15.6L17.2 13H5V11H17.2L14.6 8.4L16 7L21 12L16 17ZM7 21Q6.175 21 5.588 20.413Q5 19.825 5 19V15H7V19H15V21H7ZM5 9V5Q5 4.175 5.588 3.588Q6.175 3 7 3H15V5H7V9H5Z" fill="currentcolor" />
                  </svg>
                </dads-button>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code></dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>"solid" | "outlined" | "text"</code></td>
                        <td><code>solid</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="variant" data-api-attr="variant" data-default="solid">
                              <option value="solid" selected>solid</option>
                              <option value="outlined">outlined</option>
                              <option value="text">text</option>
                            </select>
                          </div>
                        </td>
                        <td>見た目のバリアント</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>"x-small" | "small" | "medium" | "large"</code></td>
                        <td><code>medium</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="medium">
                              <option value="x-small">x-small</option>
                              <option value="small">small</option>
                              <option value="medium" selected>medium</option>
                              <option value="large">large</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ（最小44px高）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>full-width</code></th>
                        <td><code>attr</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="full-width" data-api-attr="full-width" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>幅100%（親要素基準）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>disabled</code></th>
                        <td><code>prop</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="disabled" data-api-prop="disabled" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>無効状態（デジタル庁では非推奨）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>textContent</code></th>
                        <td><code>prop</code></td>
                        <td><code>string</code></td>
                        <td><code>"ボタンテキスト"</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="textContent"
                              value="ボタンテキスト"
                              data-api-prop="textContent"
                              data-api-target-selector="[data-api-button-label]"
                              data-default="ボタンテキスト"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>デフォルトスロット（ラベル文字列）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>icon-start</code></th>
                        <td><code>slot</code></td>
                        <td><code>"none" | "dummy" | "login" | "logout" | "settings"</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="icon-start"
                              data-button-icon-start
                              data-default="none"
                            >
                              <option value="none" selected>none</option>
                              ${BUTTON_MATERIAL_ICON_OPTIONS_HTML}
                            </select>
                          </div>
                        </td>
                        <td>先頭（リード）アイコン。テキスト付きボタン向け。例: <code>&lt;svg slot="icon-start"&gt;</code></td>
                      </tr>

                      <tr>
                        <th scope="row"><code>icon-end</code></th>
                        <td><code>slot</code></td>
                        <td><code>"none" | "dummy" | "login" | "logout" | "settings"</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select
                              aria-label="icon-end"
                              data-button-icon-end
                              data-default="none"
                            >
                              <option value="none" selected>none</option>
                              ${BUTTON_MATERIAL_ICON_OPTIONS_HTML}
                            </select>
                          </div>
                        </td>
                        <td>末尾（テール）アイコン。テキスト付きボタン向け。例: <code>&lt;svg slot="icon-end"&gt;</code></td>
                      </tr>

                      <tr>
                        <th scope="row"><code>aria-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="aria-label"
                              value=""
                              data-api-attr="aria-label"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>アクセシブルネーム（必要時のみ）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                <p class="wc-api-panel__section-note">
                  ※ 制御は <code>data-api-attr</code> / <code>data-api-prop</code> に宣言し、イベント（<code>dads-input</code>/<code>dads-change</code>）で反映します。
                </p>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-button-background</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-background"
                              value=""
                              data-api-css-var="--dads-button-background"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-button-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-color"
                              value=""
                              data-api-css-var="--dads-button-color"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>文字色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-button-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-border-color"
                              value=""
                              data-api-css-var="--dads-button-border-color"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>枠線色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-button-border-radius</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="--dads-button-border-radius"
                              value=""
                              data-api-css-var="--dads-button-border-radius"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

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

      <!-- アイコン -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">アイコン付き（Material Symbols）</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <dads-button variant="outlined" size="medium">
            <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 17L5 12L10 7L11.4 8.4L8.8 11H20V13H8.8L11.4 15.6L10 17ZM13 21Q12.175 21 11.588 20.413Q11 19.825 11 19V15H13V19H21V5H13V9H11V5Q11 4.175 11.588 3.588Q12.175 3 13 3H21Q21.825 3 22.413 3.588Q23 4.175 23 5V19Q23 19.825 22.413 20.413Q21.825 21 21 21H13Z" fill="currentcolor" />
            </svg>
            ログイン
          </dads-button>
          <dads-button variant="solid" size="medium">
            ログアウト
            <svg slot="icon-end" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 17L14.6 15.6L17.2 13H5V11H17.2L14.6 8.4L16 7L21 12L16 17ZM7 21Q6.175 21 5.588 20.413Q5 19.825 5 19V15H7V19H15V21H7ZM5 9V5Q5 4.175 5.588 3.588Q6.175 3 7 3H15V5H7V9H5Z" fill="currentcolor" />
            </svg>
          </dads-button>
          <dads-button variant="text" size="medium">
            <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.825 22Q10.35 22 9.938 21.725Q9.525 21.45 9.375 20.975L9 19.725Q8.675 19.6 8.362 19.425Q8.05 19.25 7.8 19L6.575 19.35Q6.1 19.475 5.675 19.3Q5.25 19.125 5 18.7L3.8 16.625Q3.55 16.2 3.587 15.725Q3.625 15.25 3.975 14.9L4.925 13.95Q4.875 13.625 4.85 13.3Q4.825 12.975 4.825 12.65Q4.825 12.325 4.85 12Q4.875 11.675 4.925 11.35L3.975 10.4Q3.625 10.05 3.587 9.575Q3.55 9.1 3.8 8.675L5 6.6Q5.25 6.175 5.675 6Q6.1 5.825 6.575 5.95L7.8 6.3Q8.05 6.05 8.362 5.875Q8.675 5.7 9 5.575L9.375 4.325Q9.525 3.85 9.938 3.575Q10.35 3.3 10.825 3.3H13.175Q13.65 3.3 14.062 3.575Q14.475 3.85 14.625 4.325L15 5.575Q15.325 5.7 15.638 5.875Q15.95 6.05 16.2 6.3L17.425 5.95Q17.9 5.825 18.325 6Q18.75 6.175 19 6.6L20.2 8.675Q20.45 9.1 20.413 9.575Q20.375 10.05 20.025 10.4L19.075 11.35Q19.125 11.675 19.15 12Q19.175 12.325 19.175 12.65Q19.175 12.975 19.15 13.3Q19.125 13.625 19.075 13.95L20.025 14.9Q20.375 15.25 20.413 15.725Q20.45 16.2 20.2 16.625L19 18.7Q18.75 19.125 18.325 19.3Q17.9 19.475 17.425 19.35L16.2 19Q15.95 19.25 15.638 19.425Q15.325 19.6 15 19.725L14.625 20.975Q14.475 21.45 14.062 21.725Q13.65 22 13.175 22H10.825ZM12 15.8Q13.3 15.8 14.225 14.875Q15.15 13.95 15.15 12.65Q15.15 11.35 14.225 10.425Q13.3 9.5 12 9.5Q10.7 9.5 9.775 10.425Q8.85 11.35 8.85 12.65Q8.85 13.95 9.775 14.875Q10.7 15.8 12 15.8Z" fill="currentcolor" />
            </svg>
            設定
          </dads-button>
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
          <li><strong>WCAG 2.2 AA準拠:</strong> 最小44x44pxタップターゲット</li>
          <li><strong>デザイントークン:</strong> セマンティック & ローカルトークンの2層構造</li>
          <li><strong>Figmaデザイン準拠:</strong> ピクセルパーフェクトな実装</li>
          <li><strong>TDD開発:</strong> 100%テストカバレッジ</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
        </ul>
      </div>
    </div>

    <script>
      (function() {
        var currentScript = document.currentScript;
        Promise.all([customElements.whenDefined('dads-button')]).then(function() {
          var root = currentScript?.parentElement;
          if (!root) return;
          var target = root.querySelector('dads-button[data-api-target]');
          if (!target) return;
          var iconPaths = ${JSON.stringify(BUTTON_MATERIAL_ICON_PATHS)};
          var startSelect = root.querySelector('[data-button-icon-start]');
          var endSelect = root.querySelector('[data-button-icon-end]');

          var syncIcon = function(select, selector) {
            if (!select) return;
            var icon = target.querySelector(selector);
            if (!icon) return;
            var path = icon.querySelector('path');
            if (!path) return;

            var value = String(select.value || 'none');
            var nextPath = iconPaths[value];
            if (!nextPath) {
              icon.setAttribute('hidden', '');
              return;
            }
            path.setAttribute('d', nextPath);
            icon.removeAttribute('hidden');
          };

          var syncAll = function() {
            syncIcon(startSelect, '[data-api-button-icon-start]');
            syncIcon(endSelect, '[data-api-button-icon-end]');
          };

          if (startSelect) startSelect.addEventListener('change', syncAll);
          if (endSelect) endSelect.addEventListener('change', syncAll);

          var resetButton = root.querySelector('[data-api-reset]');
          if (resetButton) {
            resetButton.addEventListener('click', function() {
              if (startSelect) startSelect.value = startSelect.getAttribute('data-default') || 'none';
              if (endSelect) endSelect.value = endSelect.getAttribute('data-default') || 'none';
              syncAll();
            });
          }

          syncAll();
        });
      })();
    </script>
  `,

  card: () => `
    <div class="card-page">
      <header class="card-page__header">
        <h2 class="card-page__title">カード</h2>
        <p class="card-page__lead">
          デジタル庁デザインシステム（DADS）準拠のカードコンポーネント。カードの構成ルール（コンテナ/メイン/イメージ/サブ）をWeb Componentsとして提供します。
        </p>
      </header>

      ${renderAnnotationToggleBlock()}

      <style>
        .card-page {
          padding: var(--spacing-10, 2.5rem) var(--spacing-6, 1.5rem);
          max-width: 1440px;
          margin: 0 auto;
        }

        .card-page__header {
          display: grid;
          gap: var(--spacing-3, 0.75rem);
          margin-bottom: var(--spacing-8, 2rem);
        }

        .card-page__title {
          margin: 0;
          color: var(--color-neutral-solid-gray-900, #1a1a1c);
          font-size: var(--font-size-32, 2rem);
          font-weight: var(--font-weight-700, 700);
          line-height: var(--line-height-140, 1.4);
          letter-spacing: 0.02em;
        }

        .card-page__lead {
          margin: 0;
          color: var(--color-neutral-solid-gray-700, #555555);
          line-height: var(--line-height-170, 1.7);
          max-width: 72rem;
        }

        .card-demo-section {
          margin-bottom: var(--spacing-10, 2.5rem);
        }

        .card-demo-subsection {
          margin-top: var(--spacing-10, 2.5rem);
        }

        .card-section__title {
          margin: 0 0 var(--spacing-4, 1rem);
          color: var(--color-neutral-solid-gray-900, #1a1a1c);
          font-size: var(--font-size-20, 1.25rem);
          font-weight: var(--font-weight-700, 700);
          line-height: var(--line-height-150, 1.5);
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: var(--spacing-3, 0.75rem);
        }

        .card-section__title::before {
          content: '';
          width: calc(4 / 16 * 1rem);
          height: calc(20 / 16 * 1rem);
          border-radius: calc(2 / 16 * 1rem);
          background: var(--color-primitive-blue-900, #0017c1);
          flex-shrink: 0;
        }

        .card-section__note {
          margin: 0 0 var(--spacing-4, 1rem);
          font-size: var(--font-size-14, 0.875rem);
          color: var(--color-neutral-solid-gray-700, #555555);
          line-height: var(--line-height-170, 1.7);
        }

        @media (max-width: 900px) {
          .card-page {
            padding: var(--spacing-8, 2rem) var(--spacing-4, 1rem);
          }
        }

        /* カードデモ共通: リンク下線スタイル */
        .card-demo-section dads-card h2 a {
          color: inherit;
          text-decoration: underline;
          text-decoration-thickness: calc(1 / 16 * 1rem);
          text-underline-offset: calc(3 / 16 * 1rem);
        }

        @media (hover: hover) {
          .card-demo-section dads-card[data-dads-card-delegate]:hover h2 a,
          .card-demo-section dads-card h2 a:hover {
            text-decoration-thickness: calc(3 / 16 * 1rem);
          }

          .card-demo-section dads-card[data-dads-card-delegate]:has(
            :is(
              dads-button,
              button,
              [role="button"],
              input,
              select,
              textarea,
              a:not([data-dads-card-primary])
            ):hover
          )
            h2
            a {
            text-decoration-thickness: calc(1 / 16 * 1rem);
          }
        }
      </style>

      <!-- アクセシビリティ注釈 -->
      <section class="card-demo-section">
        ${renderA11ySectionHeader({ titleClassName: "card-section__title", noteClassName: "card-section__note" })}
        <a11y-annotate target-selector="dads-card">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-card style="width: min(420px, 100%);">
              <div slot="media" style="aspect-ratio: 3/2; background: linear-gradient(114deg, var(--color-primitive-cyan-400) 0%, var(--color-primitive-purple-500) 100%); display: grid; place-content: center; color: white; font-weight: 700;">
                Media
              </div>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>主リンク（カード面クリックON）</a></h2>
              <p>クリックは主リンクへ委譲されます（テキスト選択/内部ボタン操作は阻害しません）。</p>
              <div slot="sub" style="display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap;">
                <dads-button size="small" variant="outlined">関連情報</dads-button>
                <dads-button size="small" variant="solid">詳しくみる</dads-button>
              </div>
            </dads-card>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section class="card-demo-section">
        <h3 class="card-section__title">API / 操作</h3>
        <p class="card-section__note">
          <code>layout</code> と CSS vars を変更し、見た目のカスタマイズを確認できます。
          "カード面クリック"は主リンク要素に <code>data-dads-card-delegate</code> を付けることで有効化します。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-card',
            'dads-accordion-details',
            'dads-accordion-item-details',
          ],
          body: `
            <h4 class="wc-api-panel__section-title">Preview</h4>
            <div style="display: grid; gap: 24px; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
              <dads-card data-api-target style="width: min(420px, 100%);">
                <div slot="media" style="aspect-ratio: 3/2; background: var(--color-neutral-solid-gray-100); display: grid; place-content: center; color: #333;">
                  Media
                </div>
                <h2><a href="#" data-demo-card-title data-dads-card-primary data-dads-card-delegate>主リンク（delegate）</a></h2>
                <p data-demo-card-content>layout と CSS vars を調整して確認してください。</p>
                <div slot="sub" style="display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap;">
                  <dads-button size="small" variant="outlined" data-demo-card-sub-button-1>関連情報</dads-button>
                  <dads-button size="small" variant="solid" data-demo-card-sub-button-2>詳しくみる</dads-button>
                </div>
              </dads-card>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                <p style="margin: 0; color: #666; font-size: 12px;">
                  ※ 主リンクから <code>data-dads-card-delegate</code> を外すと、カード面クリックはOFFになります（リンク自体は通常どおりクリック/Enter可能）。
                </p>
              </div>
            </div>

            <dads-accordion-details allow-multiple>
              <dads-accordion-item-details>
                <span slot="header">Usage (HTML)</span>
                <div slot="content">
                  <dads-code-block data-api-code data-api-code-collapse="off">
                    <template>
                      <dads-card>
                        <div slot="media">...</div>
                        <h2><a href="#" data-demo-card-title data-dads-card-primary data-dads-card-delegate>主リンク（delegate）</a></h2>
                        <p data-demo-card-content>layout と CSS vars を調整して確認してください。</p>
                        <div slot="sub" style="display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap;">
                          <dads-button size="small" variant="outlined" data-demo-card-sub-button-1>関連情報</dads-button>
                          <dads-button size="small" variant="solid" data-demo-card-sub-button-2>詳しくみる</dads-button>
                        </div>
                      </dads-card>
                    </template>
                  </dads-code-block>
                </div>
              </dads-accordion-item-details>

              <dads-accordion-item-details>
                <span slot="header">Content (Demo)</span>
                <div slot="content">
                  <dads-table>
                      <table class="wc-api-table" data-cell-border="bottom">
                        ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                        <tbody>
                          <tr>
                            <th scope="row"><code>slot:title</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>主リンク（delegate）</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="title text"
                                  value="主リンク（delegate）"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-title]"
                                  data-default="主リンク（delegate）"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>主リンクのテキスト（デフォルトスロット内）</td>
                          </tr>

                          <tr>
                            <th scope="row"><code>slot:content</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>layout と CSS vars を調整して確認してください。</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="content text"
                                  value="layout と CSS vars を調整して確認してください。"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-content]"
                                  data-default="layout と CSS vars を調整して確認してください。"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>メイン本文のテキスト（デフォルトスロット内）</td>
                          </tr>

                          <tr>
                            <th scope="row"><code>slot:sub (button 1)</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>関連情報</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="sub button 1"
                                  value="関連情報"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-sub-button-1]"
                                  data-default="関連情報"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>サブエリア（slot="sub"）1つ目のボタンラベル</td>
                          </tr>

                          <tr>
                            <th scope="row"><code>slot:sub (button 2)</code></th>
                            <td><code>prop</code></td>
                            <td><code>string</code></td>
                            <td><code>詳しくみる</code></td>
                            <td>
                              <div class="wc-api-control">
                                <dads-input-text
                                  label="sub button 2"
                                  value="詳しくみる"
                                  data-api-prop="textContent"
                                  data-api-target-selector="dads-card [data-demo-card-sub-button-2]"
                                  data-default="詳しくみる"
                                ></dads-input-text>
                              </div>
                            </td>
                            <td>サブエリア（slot="sub"）2つ目のボタンラベル</td>
                          </tr>
                        </tbody>
                      </table>
                  </dads-table>
                  <p class="wc-api-panel__section-note">
                    ※ slot 内の要素へ <code>textContent</code> を適用してテキストを差し替えます（デモ用）。
                  </p>
                </div>
              </dads-accordion-item-details>

              <dads-accordion-item-details>
                <span slot="header">Props / Attrs</span>
                <div slot="content">
                  <dads-table>
                    <table class="wc-api-table" data-cell-border="bottom">
                      ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                      <tbody>
                        <tr>
                          <th scope="row"><code>layout</code></th>
                          <td><code>attr</code></td>
                          <td><code>"vertical" | "horizontal"</code></td>
                          <td><code>vertical</code></td>
                          <td>
                            <div class="wc-api-control">
                              <select aria-label="layout" data-api-attr="layout" data-default="">
                                <option value="" selected>vertical (default)</option>
                                <option value="horizontal">horizontal</option>
                              </select>
                            </div>
                          </td>
                          <td>レイアウト（縦/横）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>data-dads-card-primary</code></th>
                          <td><code>attr</code></td>
                          <td><code>boolean</code></td>
                          <td><code>true</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-switch
                                aria-label="data-dads-card-primary"
                                data-api-attr="data-dads-card-primary"
                                data-api-target-selector="dads-card [data-demo-card-title]"
                                data-default="true"
                                checked
                              >
                                <span slot="label-left">Off</span>
                                <span slot="label-right">On</span>
                              </dads-switch>
                            </div>
                          </td>
                          <td>主リンク要素を指定（主リンクは1つ）。主リンクに付与します。</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>data-dads-card-delegate</code></th>
                          <td><code>attr</code></td>
                          <td><code>boolean</code></td>
                          <td><code>true</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-switch
                                aria-label="data-dads-card-delegate"
                                data-api-attr="data-dads-card-delegate"
                                data-api-target-selector="dads-card [data-demo-card-title]"
                                data-default="true"
                                checked
                              >
                                <span slot="label-left">Off</span>
                                <span slot="label-right">On</span>
                              </dads-switch>
                            </div>
                          </td>
                          <td>カード面クリック（pointer）を主リンクへ委譲します（主リンクに付与）。</td>
                        </tr>
                      </tbody>
                    </table>
                  </dads-table>
                </div>
              </dads-accordion-item-details>

              <dads-accordion-item-details>
                <span slot="header">CSS vars</span>
                <div slot="content">
                  <dads-table>
                    <table class="wc-api-table" data-cell-border="bottom">
                      ${API_TABLE_CSS_VARS_HEADER}
                      <tbody>
                        <tr>
                          <th scope="row"><code>--dads-card-background</code></th>
                          <td><code>--color-neutral-white</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-background" value="" data-api-css-var="--dads-card-background" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>背景色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-border-color</code></th>
                          <td><code>--color-neutral-solid-gray-420</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-border-color" value="" data-api-css-var="--dads-card-border-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>外周色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-border-width</code></th>
                          <td><code>1px</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-border-width" value="" data-api-css-var="--dads-card-border-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>外周の線幅</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-border-radius</code></th>
                          <td><code>--border-radius-16</code><br><small class="wc-api-table__meta">(16px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-border-radius" value="" data-api-css-var="--dads-card-border-radius" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>角丸</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-divider-color</code></th>
                          <td><code>--color-neutral-solid-gray-420</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-divider-color" value="" data-api-css-var="--dads-card-divider-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>エリア間の区切り線色（media/sub の境界）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-divider-width</code></th>
                          <td><code>1px</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-divider-width" value="" data-api-css-var="--dads-card-divider-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>エリア間の区切り線幅</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-media-width</code></th>
                          <td><code>calc(352 / 16 * 1rem)</code><br><small class="wc-api-table__meta">(352px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-media-width" value="" data-api-css-var="--dads-card-media-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>layout="horizontal" のメディア列幅</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-media-aspect-ratio</code></th>
                          <td><code>auto</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-media-aspect-ratio" value="" data-api-css-var="--dads-card-media-aspect-ratio" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>メディア領域の aspect-ratio（未指定は slot 側に委譲）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-padding-block</code></th>
                          <td><code>--spacing-4</code><br><small class="wc-api-table__meta">(16px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-padding-block" value="" data-api-css-var="--dads-card-padding-block" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>上下パディング（main/sub/media overlay）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-padding-inline</code></th>
                          <td><code>--spacing-6</code><br><small class="wc-api-table__meta">(24px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-padding-inline" value="" data-api-css-var="--dads-card-padding-inline" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>左右パディング</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-gap</code></th>
                          <td><code>--spacing-4</code><br><small class="wc-api-table__meta">(16px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-gap" value="" data-api-css-var="--dads-card-gap" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>エリア内の余白（見出し/本文/ボタン等）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-color</code></th>
                          <td><code>--color-neutral-solid-gray-800</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-color" value="" data-api-css-var="--dads-card-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>本文/ラベルなどの文字色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-color</code></th>
                          <td><code>--color-neutral-solid-gray-900</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-color" value="" data-api-css-var="--dads-card-title-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトル文字色</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-font-size</code></th>
                          <td><code>--font-size-20</code><br><small class="wc-api-table__meta">(1.25rem)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-font-size" value="" data-api-css-var="--dads-card-title-font-size" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトル文字サイズ</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-font-weight</code></th>
                          <td><code>--font-weight-700</code><br><small class="wc-api-table__meta">(700)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-font-weight" value="" data-api-css-var="--dads-card-title-font-weight" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトルの太さ</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-line-height</code></th>
                          <td><code>1.5</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-line-height" value="" data-api-css-var="--dads-card-title-line-height" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>タイトルの行高</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-underline-offset</code></th>
                          <td><code>calc(3 / 16 * 1rem)</code><br><small class="wc-api-table__meta">(3px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-underline-offset" value="" data-api-css-var="--dads-card-title-underline-offset" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>主リンク時の下線オフセット</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-underline-thickness</code></th>
                          <td><code>calc(1 / 16 * 1rem)</code><br><small class="wc-api-table__meta">(1px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-underline-thickness" value="" data-api-css-var="--dads-card-title-underline-thickness" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>主リンク時の下線太さ</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-title-underline-thickness-hover</code></th>
                          <td><code>calc(3 / 16 * 1rem)</code><br><small class="wc-api-table__meta">(3px)</small></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-title-underline-thickness-hover" value="" data-api-css-var="--dads-card-title-underline-thickness-hover" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>ホバー時の下線太さ（主リンク時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-outline-color</code></th>
                          <td><code>--dads-focus-outline-color</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-outline-color" value="" data-api-css-var="--dads-card-focus-outline-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスアウトライン色（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-outline-width</code></th>
                          <td><code>--dads-focus-outline-width</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-outline-width" value="" data-api-css-var="--dads-card-focus-outline-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスアウトライン幅（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-outline-offset</code></th>
                          <td><code>--dads-focus-outline-offset</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-outline-offset" value="" data-api-css-var="--dads-card-focus-outline-offset" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスアウトラインのオフセット（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-ring-color</code></th>
                          <td><code>--dads-focus-ring-color</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-ring-color" value="" data-api-css-var="--dads-card-focus-ring-color" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスリング色（委譲ON時）</td>
                        </tr>

                        <tr>
                          <th scope="row"><code>--dads-card-focus-ring-width</code></th>
                          <td><code>--dads-focus-ring-width</code></td>
                          <td>
                            <div class="wc-api-control">
                              <dads-input-text label="--dads-card-focus-ring-width" value="" data-api-css-var="--dads-card-focus-ring-width" data-default=""></dads-input-text>
                            </div>
                          </td>
                          <td>フォーカスリング幅（委譲ON時）</td>
                        </tr>
                      </tbody>
                    </table>
                  </dads-table>
                  ${API_TABLE_CSS_VARS_NOTE}
                </div>
              </dads-accordion-item-details>
            </dads-accordion-details>
`,
        })}
      </section>

      <!-- カード作例1（DADS公式） -->
      <section class="card-demo-section">
        <h3 class="card-section__title">カード作例1（DADS公式）</h3>
        <p class="card-section__note">
          DADS HTML Storybook の「作例1」を <code>&lt;dads-card&gt;</code> で再現しています。
        </p>

        <style>
          .card-example-1-list {
            /* DADS: card example 1 */
            --card-example-1-gap: calc(24 / 16 * 1rem);
            --card-example-1-card-width: calc(352 / 16 * 1rem);
            --card-example-1-border-width: 1px;
            --card-example-1-main-overlap: calc(-24 / 16 * 1rem);
            --card-example-1-main-row-gap: calc(16 / 16 * 1rem);
            --card-example-1-main-padding-block: calc(16 / 16 * 1rem);
            --card-example-1-main-padding-inline: calc(24 / 16 * 1rem);
            --card-example-1-icon-size: calc(64 / 16 * 1rem);
            --card-example-1-icon-offset: calc(-12 / 16 * 1rem);

            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: var(--card-example-1-gap);
            padding: 0;
            list-style: none;
          }

          .card-example-1-list > li {
            display: flex;
            min-width: 0;
          }

          dads-card.card-example-1 {
            box-sizing: border-box;
            min-width: 0;
            width: var(--card-example-1-card-width);
            max-width: 100%;
            --dads-card-border-width: var(--spacing-0-px, 0px);
            --dads-card-divider-width: var(--spacing-0-px, 0px);
            --dads-card-padding-block: var(--spacing-0, 0);
            --dads-card-padding-inline: var(--spacing-0, 0);
            --dads-card-gap: var(--spacing-0, 0);
            --dads-card-background: transparent;
            --dads-card-media-aspect-ratio: 3 / 2;

            --card-example-1-media-overlay: color-mix(
              in srgb,
              var(--color-neutral-white) 10%,
              transparent
            );
          }

          dads-card.card-example-1::part(media) {
            position: relative;
            box-sizing: content-box;
            border: var(--card-example-1-border-width) solid var(--dads-card-border-color);
            border-start-start-radius: var(--dads-card-border-radius);
            border-start-end-radius: var(--dads-card-border-radius);
            background:
              linear-gradient(
                0deg,
                var(--card-example-1-media-overlay) 0%,
                var(--card-example-1-media-overlay) 100%
              ),
              linear-gradient(
                114deg,
                var(--color-primitive-cyan-400) 0%,
                var(--color-primitive-purple-500) 100%
              );
            display: grid;
            place-content: center;
            color: var(--color-neutral-white);
            aspect-ratio: var(--dads-card-media-aspect-ratio);
          }

          .card-example-1__icon {
            width: var(--card-example-1-icon-size);
            height: var(--card-example-1-icon-size);
            translate: 0 var(--card-example-1-icon-offset);
          }

          dads-card.card-example-1::part(main) {
            position: relative;
            margin-top: var(--card-example-1-main-overlap);
            display: grid;
            align-content: start;
            row-gap: var(--card-example-1-main-row-gap);
            border: var(--card-example-1-border-width) solid var(--dads-card-border-color);
            border-radius: var(--dads-card-border-radius);
            background-color: var(--color-neutral-white);
            padding: var(--card-example-1-main-padding-block) var(--card-example-1-main-padding-inline);
          }

          .card-example-1__content {
            color: var(--color-neutral-solid-gray-800);
            font-weight: var(--font-weight-400);
            font-size: var(--font-size-16);
            line-height: var(--line-height-170);
          }

          /* 作例1固有: リンク下線スタイル */
          dads-card.card-example-1 h2 a {
            color: inherit;
            text-decoration: underline;
            text-decoration-thickness: calc(1 / 16 * 1rem);
            text-underline-offset: calc(3 / 16 * 1rem);
          }

          @media (hover: hover) {
            dads-card.card-example-1:hover h2 a {
              text-decoration-thickness: calc(3 / 16 * 1rem);
            }
          }
        </style>

        <ul class="card-example-1-list">
          <li>
            <dads-card class="card-example-1">
              <svg
                slot="media"
                class="card-example-1__icon"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M29.9 8C31.2 6.1 33 6.1 34 8c1.1 1.9 2.2 5 2.2 8.8v6.1l20.5 12.3c1 .8 1.9 2.1 1.9 3.5v4l-23-7.5-.9 12.1-3 2.6h.7l-.5.3-.3-.2-1.7 1.4 2-1.2 6.1 3.7Q39.7 55 40 57l-16 .2q.1-2 1.9-3.4l3.7-2.3L28.3 35l-23 7.8v-4q.1-2.2 1.9-3.5l20.5-12.3v-6.1c0-3.7 1.1-7 2.2-8.8"
                  fill="currentcolor"
                ></path>
              </svg>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>機内サービス</a></h2>
              <p class="card-example-1__content">快適なシートや機内食で空の旅をより快適にお過ごしいただけます</p>
            </dads-card>
          </li>

          <li>
            <dads-card class="card-example-1">
              <svg
                slot="media"
                class="card-example-1__icon"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M32 31.6q2 0 3.4-1.4 1.5-1.4 1.4-3.4 0-2-1.4-3.4Q34 22 32 22q-2 0-3.4 1.4-1.4 1.5-1.4 3.4 0 2 1.4 3.4 1.4 1.5 3.4 1.4m0 25.8A85 85 0 0 1 16.9 41q-5-7.5-5-13.8 0-9.1 6-15 6-5.6 14.1-5.6t14.2 5.7q6 5.7 6 15 0 6.2-5.1 13.7T32 57.4"
                  fill="currentcolor"
                ></path>
              </svg>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>乗り継ぎサポート</a></h2>
              <p class="card-example-1__content">お乗り継ぎ時の際に日本人のガイドがご案内いたします</p>
            </dads-card>
          </li>

          <li>
            <dads-card class="card-example-1">
              <svg
                slot="media"
                class="card-example-1__icon"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M40 5.3H24v8H13.3v40h7q-.4.7-.3 1.4c0 2.1 1.9 4 4 4s4-1.9 4-4q0-.7-.3-1.4h8.6q-.4.7-.3 1.4c0 2.1 1.9 4 4 4s4-1.9 4-4q0-.7-.3-1.4h7v-40H40zM25.3 44h-2.6V24h2.6zm8 0h-2.6V24h2.6zM36 13.3h-8v-4h8zM41.3 24v20h-2.6V24z"
                  fill="currentcolor"
                ></path>
              </svg>
              <h2><a href="#" data-dads-card-primary data-dads-card-delegate>機内持ち込み手荷物検査</a></h2>
              <p class="card-example-1__content">機内にお持ち込みいただける手荷物について係員が検査いたします</p>
            </dads-card>
          </li>
        </ul>

        <!-- カード作例2（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例2（DADS公式）</h3>
          <p class="card-section__note">DADS HTML Storybook の「作例2」を再現。横型レイアウトで左に画像、右にコンテンツを配置し、ホバー/フォーカス時にスタイル変化</p>

          <style>
            .card-example-2-list {
              list-style: none;
              padding: 0;
              margin: 0;
              margin-top: var(--spacing-4, 1rem);
              display: grid;
              gap: var(--spacing-6, 1.5rem);
            }

            .card-example-2-list > li {
              display: flex;
              align-items: stretch;
            }

            dads-card.card-example-2 {
              max-width: 64rem;
              --dads-card-media-width: minmax(auto, min(50%, 22rem));
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-6, 1.5rem);
              --dads-card-gap: var(--spacing-4, 1rem);
              --dads-card-divider-width: 1px;
              --dads-card-border-radius: 0;
              width: 100%;
            }

            dads-card.card-example-2::part(media) {
              aspect-ratio: 3 / 2;
            }

            dads-card.card-example-2::part(base) {
              overflow: visible;
            }

            .card-example-2__header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: var(--spacing-4, 1rem);
              margin-right: calc(-1 * var(--spacing-6, 1.5rem));
            }

            .card-example-2__heading {
              margin: 0;
              min-width: 0;
              padding-top: var(--spacing-1, 0.25rem);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              font-weight: bold;
              font-size: var(--font-size-20, 1.25rem);
              line-height: 1.5;
              letter-spacing: 0.02em;
            }

            .card-example-2__menu-button {
              flex-shrink: 0;
              background-color: var(--color-neutral-white, #ffffff);
              border: 1px solid transparent;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 2.75rem;
              height: 2.75rem;
              color: var(--color-neutral-solid-gray-800, #414143);
              padding: 0;
              border-radius: var(--spacing-1-5, 0.375rem);
            }

            @media (hover: hover) {
              .card-example-2__menu-button:hover {
                border-color: var(--color-neutral-black, #000000);
                background-color: var(--color-neutral-solid-gray-50, #f8f8fb);
              }
            }

            .card-example-2__menu-button:focus-visible {
              outline: var(--spacing-1, 0.25rem) solid var(--color-neutral-black, #000000);
              outline-offset: var(--spacing-0-5, 0.125rem);
              box-shadow: 0 0 0 var(--spacing-0-5, 0.125rem) var(--color-primitive-yellow-300, #ffd43d);
            }

            .card-example-2__contents {
              margin: 0;
              min-width: 0;
            }

            .card-example-2__divider {
              padding-block: var(--spacing-2, 0.5rem);
              border-top: 1px solid var(--color-neutral-solid-gray-536, #757578);
            }

            .card-example-2__links {
              display: flex;
              column-gap: var(--spacing-4, 1rem);
              justify-content: end;
            }

            .card-example-2__learn-more:any-link {
              display: flex;
              border: 4px double transparent;
              padding: var(--spacing-1-5, 0.375rem) var(--spacing-2, 0.5rem);
              background: var(--color-primitive-light-blue-900, #004098);
              color: var(--color-neutral-white, #ffffff);
              text-decoration: none;
              font-weight: normal;
              font-size: var(--font-size-16, 1rem);
              line-height: 1;
              letter-spacing: 0.02em;
              cursor: pointer;
            }

            @media (hover: hover) {
              .card-example-2__learn-more:any-link:hover {
                background: var(--color-primitive-light-blue-1000, #002d6c);
                text-decoration: underline;
                text-decoration-thickness: 1px;
                text-underline-offset: 3px;
              }
            }

            .card-example-2__learn-more:focus-visible {
              outline: var(--spacing-1, 0.25rem) solid var(--color-neutral-black, #000000);
              outline-offset: var(--spacing-0-5, 0.125rem);
              border-radius: var(--spacing-1, 0.25rem);
              box-shadow: 0 0 0 var(--spacing-0-5, 0.125rem) var(--color-primitive-yellow-300, #ffd43d);
            }
          </style>

          <ul class="card-example-2-list">
            <li>
              <dads-card class="card-example-2" layout="horizontal">
                <img slot="media"
                     src="${CARD_EXAMPLE_2_IMAGE_1}"
                     width="352" height="235"
                     alt="満開の桜の枝が青い水面を背景に咲き誇る春の風景写真">
                <div class="card-example-2__header">
                  <h2 class="card-example-2__heading">地域緑化事業</h2>
                  <button class="card-example-2__menu-button" aria-label="メニュー">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="presentation">
                      <circle cx="12" cy="4.5" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="12" cy="19.5" r="1.5"/>
                    </svg>
                  </button>
                </div>
                <p class="card-example-2__contents">住民の皆さまが参加できる地域緑化事業を行っています。地域交流を促進するとともに、地域の景観美化を目的としています。</p>
                <div class="card-example-2__divider"></div>
                <div class="card-example-2__links">
                  <a href="#" class="card-example-2__learn-more">詳しくみる</a>
                </div>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-2" layout="horizontal">
                <img slot="media"
                     src="${CARD_EXAMPLE_2_IMAGE_2}"
                     width="352" height="235"
                     alt="子どもたちが一緒に遊んでいる公園の風景">
                <div class="card-example-2__header">
                  <h2 class="card-example-2__heading">子育て支援プログラム</h2>
                  <button class="card-example-2__menu-button" aria-label="メニュー">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="presentation">
                      <circle cx="12" cy="4.5" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="12" cy="19.5" r="1.5"/>
                    </svg>
                  </button>
                </div>
                <p class="card-example-2__contents">子育て世代の皆さまを応援する包括的なサポートプログラムです。育児相談から保育サービスまで幅広い支援を提供しています。</p>
                <div class="card-example-2__divider"></div>
                <div class="card-example-2__links">
                  <a href="#" class="card-example-2__learn-more">詳しくみる</a>
                </div>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-2" layout="horizontal">
                <img slot="media"
                     src="${CARD_EXAMPLE_2_IMAGE_3}"
                     width="352" height="235"
                     alt="パソコンで作業をしている様子">
                <div class="card-example-2__header">
                  <h2 class="card-example-2__heading">デジタル化推進事業</h2>
                  <button class="card-example-2__menu-button" aria-label="メニュー">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="presentation">
                      <circle cx="12" cy="4.5" r="1.5"/>
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="12" cy="19.5" r="1.5"/>
                    </svg>
                  </button>
                </div>
                <p class="card-example-2__contents">市民サービスのデジタル化を推進し、より便利で効率的な行政サービスの提供を目指しています。オンライン申請やAI相談など最新技術を活用しています。</p>
                <div class="card-example-2__divider"></div>
                <div class="card-example-2__links">
                  <a href="#" class="card-example-2__learn-more">詳しくみる</a>
                </div>
              </dads-card>
            </li>
          </ul>
        </section>

        <!-- カード作例3（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例3（DADS公式）</h3>
          <p class="card-section__note">
            DADS HTML Storybook の「作例3」を再現。縦型カードでヘッダー・説明・画像・アクションを配置。
          </p>

          <style>
            /* ========================================
             * Card Example 3 - DADS公式作例3
             * ======================================== */

            /* リストコンテナ - subgridで高さ揃え */
            .card-example-3-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(auto, calc(354 / 16 * 1rem)));
              gap: var(--spacing-8, 2rem) var(--spacing-6, 1.5rem);
            }

            /* 各リストアイテム - subgridで親の行を継承 */
            .card-example-3-list > li {
              display: grid;
              grid-row: span 2;
              grid-template-rows: subgrid;
              min-width: 0;
            }

            /* カード本体 - subgridで高さ揃え */
            dads-card.card-example-3 {
              position: relative;
              z-index: 0;
              box-sizing: border-box;
              display: grid;
              grid-row: span 2;
              row-gap: 0;
              width: 100%;
              max-width: 100%;

              color: var(--color-neutral-solid-gray-800, #333333);
              font-family: var(--font-family-sans);
              font-size: var(--font-size-16, 1rem);
              font-weight: var(--font-weight-400, 400);
              line-height: var(--line-height-170, 1.7);
              letter-spacing: 0.02em;

              /* カードトークン */
              --dads-card-border-width: 1px;
              --dads-card-border-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-border-radius: var(--border-radius-16, 1rem);
              --dads-card-divider-width: 0;
              --dads-card-background: var(--color-neutral-white, #ffffff);
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-6, 1.5rem);
              --dads-card-gap: var(--spacing-4, 1rem);
              --dads-card-color: var(--color-neutral-solid-gray-800, #333333);
            }

            /* フォーカスリング表示 */
            dads-card.card-example-3::part(base) {
              overflow: visible;
            }

            /* main上部のパディング調整 */
            dads-card.card-example-3::part(main) {
              padding-bottom: 0;
            }

            /* ヘッダー（アバター + heading） */
            .card-example-3__header {
              display: flex;
              align-items: start;
              column-gap: var(--spacing-4, 1rem);
              min-width: 0;
            }

            /* heading: ラベル + タイトル（上からラベル、タイトル） */
            .card-example-3__heading {
              display: flex;
              flex-direction: column;
              row-gap: var(--spacing-2, 0.5rem);
              min-width: 0;
              font-weight: var(--font-weight-400, 400);
              font-size: var(--font-size-16, 1rem);
              line-height: var(--line-height-170, 1.7);
              letter-spacing: 0.02em;
            }

            /* ラベル（カテゴリ） */
            .card-example-3__label {
              order: -1;
            }

            /* タイトル */
            .card-example-3__title {
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              font-size: var(--font-size-20, 1.25rem);
              font-weight: var(--font-weight-700, 700);
              line-height: var(--line-height-150, 1.5);
              letter-spacing: 0.02em;
              margin: 0;
              min-width: 0;
            }

            /* タイトルリンク */
            .card-example-3__title a:any-link {
              color: var(--color-primitive-blue-1000, #00118f);
              text-decoration: underline;
              text-decoration-thickness: calc(1 / 16 * 1rem);
              text-underline-offset: calc(3 / 16 * 1rem);
            }

            .card-example-3__title a:visited {
              color: var(--color-primitive-magenta-900, #8b008b);
            }

            @media (hover: hover) {
              .card-example-3__title a:hover {
                color: var(--color-primitive-blue-900, #0017c1);
                text-decoration-thickness: calc(3 / 16 * 1rem);
              }
            }

            .card-example-3__title a:active {
              color: var(--color-primitive-orange-800, #c74700);
              text-decoration-thickness: calc(1 / 16 * 1rem);
            }

            .card-example-3__title a:focus-visible {
              outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black, #000000);
              outline-offset: calc(2 / 16 * 1rem);
              box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300, #ffd43d);
              border-radius: calc(4 / 16 * 1rem);
            }

            /* アバター */
            .card-example-3__avatar {
              border-radius: 0;
              object-fit: cover;
              flex-shrink: 0;
              order: -1;
            }

            /* 説明文 */
            .card-example-3__contents {
              display: flex;
              flex-direction: column;
              row-gap: var(--spacing-4, 1rem);
              min-width: 0;
            }

            .card-example-3__contents > p {
              margin: 0;
            }

            .card-example-3__contents img {
              display: block;
              max-width: 100%;
              height: auto;
            }

            /* アクション */
            .card-example-3__actions {
              margin: 0;
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-end;
              gap: var(--spacing-4, 1rem);
              align-items: center;
              padding: 0;
              list-style: none;
            }
          </style>

          <ul class="card-example-3-list">
            <li>
              <dads-card class="card-example-3">
                <!-- main スロット（デフォルト）: ヘッダー + 説明 -->
                <div class="card-example-3__header">
                  <div class="card-example-3__heading">
                    <h2 class="card-example-3__title">
                      <a href="#">郵送する際のポイント</a>
                    </h2>
                    <span class="card-example-3__label">お役立ち情報</span>
                  </div>
                  <img
                    class="card-example-3__avatar"
                    src="${CARD_EXAMPLE_3_AVATAR_IMAGE}"
                    width="64" height="64"
                    alt="著者のアイコン"
                  >
                </div>
                <div class="card-example-3__contents">
                  <p>重要な書類を郵送する際に注意すべきポイントをご紹介します</p>
                </div>
                <div slot="sub" class="card-example-3__contents">
                  <p>
                    <img
                      src="${CARD_EXAMPLE_3_SUB_IMAGE}"
                      width="304" height="235"
                      alt="ポストに書類を投函する人物のイラスト"
                    >
                  </p>
                </div>

                <!-- sub スロット: お気に入りボタン -->
                <ul slot="sub" class="card-example-3__actions">
                  <li>
                    <dads-button variant="outlined" size="small">
                      <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 21-1.4-1.3a113 113 0 0 1-6.8-6.9 9 9 0 0 1-1.4-2.4Q2 9.3 2 8.2q0-2.4 1.6-4Q5 2.7 7.5 2.7a6 6 0 0 1 4.5 2 6 6 0 0 1 4.5-2q2.4 0 4 1.5 1.5 1.5 1.5 4 0 1.1-.4 2.2-.3 1-1.4 2.4t-2.6 3l-4.2 3.9zm0-2.7 6.4-6.4q.9-1 1.3-2l.3-1.7a3.4 3.4 0 0 0-3.5-3.5A4 4 0 0 0 12.9 7h-1.8q-.5-1-1.4-1.7-1-.6-2.2-.6A3.4 3.4 0 0 0 4 8.2l.3 1.7q.4 1 1.3 2 .9 1.2 2.5 2.7z" fill="currentcolor"/>
                      </svg>
                      お気に入り
                    </dads-button>
                  </li>
                </ul>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-3">
                <!-- main スロット（デフォルト）: ヘッダー + 説明 -->
                <div class="card-example-3__header">
                  <div class="card-example-3__heading">
                    <h2 class="card-example-3__title">
                      <a href="#">オンライン申請の手順</a>
                    </h2>
                    <span class="card-example-3__label">手続きガイド</span>
                  </div>
                  <img
                    class="card-example-3__avatar"
                    src="${CARD_EXAMPLE_3_AVATAR_IMAGE}"
                    width="64" height="64"
                    alt="著者のアイコン"
                  >
                </div>
                <div class="card-example-3__contents">
                  <p>マイナンバーカードを使った各種オンライン申請の基本的な手順を分かりやすく解説します</p>
                </div>
                <div slot="sub" class="card-example-3__contents">
                  <p>
                    <img
                      src="${CARD_EXAMPLE_3_SUB_IMAGE}"
                      width="304" height="235"
                      alt="パソコンでオンライン申請をする人物のイラスト"
                    >
                  </p>
                </div>

                <!-- sub スロット: お気に入りボタン -->
                <ul slot="sub" class="card-example-3__actions">
                  <li>
                    <dads-button variant="outlined" size="small">
                      <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 21-1.4-1.3a113 113 0 0 1-6.8-6.9 9 9 0 0 1-1.4-2.4Q2 9.3 2 8.2q0-2.4 1.6-4Q5 2.7 7.5 2.7a6 6 0 0 1 4.5 2 6 6 0 0 1 4.5-2q2.4 0 4 1.5 1.5 1.5 1.5 4 0 1.1-.4 2.2-.3 1-1.4 2.4t-2.6 3l-4.2 3.9zm0-2.7 6.4-6.4q.9-1 1.3-2l.3-1.7a3.4 3.4 0 0 0-3.5-3.5A4 4 0 0 0 12.9 7h-1.8q-.5-1-1.4-1.7-1-.6-2.2-.6A3.4 3.4 0 0 0 4 8.2l.3 1.7q.4 1 1.3 2 .9 1.2 2.5 2.7z" fill="currentcolor"/>
                      </svg>
                      お気に入り
                    </dads-button>
                  </li>
                </ul>
              </dads-card>
            </li>
            <li>
              <dads-card class="card-example-3">
                <!-- main スロット（デフォルト）: ヘッダー + 説明 -->
                <div class="card-example-3__header">
                  <div class="card-example-3__heading">
                    <h2 class="card-example-3__title">
                      <a href="#">よくある質問と回答</a>
                    </h2>
                    <span class="card-example-3__label">FAQ</span>
                  </div>
                  <img
                    class="card-example-3__avatar"
                    src="${CARD_EXAMPLE_3_AVATAR_IMAGE}"
                    width="64" height="64"
                    alt="著者のアイコン"
                  >
                </div>
                <div class="card-example-3__contents">
                  <p>お客様からよくお寄せいただくご質問とその回答をまとめました</p>
                </div>
                <div slot="sub" class="card-example-3__contents">
                  <p>
                    <img
                      src="${CARD_EXAMPLE_3_SUB_IMAGE}"
                      width="304" height="235"
                      alt="よくある質問に答えるサポートスタッフのイラスト"
                    >
                  </p>
                </div>

                <!-- sub スロット: お気に入りボタン -->
                <ul slot="sub" class="card-example-3__actions">
                  <li>
                    <dads-button variant="outlined" size="small">
                      <svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 21-1.4-1.3a113 113 0 0 1-6.8-6.9 9 9 0 0 1-1.4-2.4Q2 9.3 2 8.2q0-2.4 1.6-4Q5 2.7 7.5 2.7a6 6 0 0 1 4.5 2 6 6 0 0 1 4.5-2q2.4 0 4 1.5 1.5 1.5 1.5 4 0 1.1-.4 2.2-.3 1-1.4 2.4t-2.6 3l-4.2 3.9zm0-2.7 6.4-6.4q.9-1 1.3-2l.3-1.7a3.4 3.4 0 0 0-3.5-3.5A4 4 0 0 0 12.9 7h-1.8q-.5-1-1.4-1.7-1-.6-2.2-.6A3.4 3.4 0 0 0 4 8.2l.3 1.7q.4 1 1.3 2 .9 1.2 2.5 2.7z" fill="currentcolor"/>
                      </svg>
                      お気に入り
                    </dads-button>
                  </li>
                </ul>
              </dads-card>
            </li>
          </ul>
        </section>

        <!-- カード作例4（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例4（DADS公式）</h3>
          <p class="card-section__note">
            ダッシュボード用途を想定したカード。JSONの値を受け取って表示します。
          </p>

          <style>
            .card-example-4 {
              width: min(calc(360 / 16 * 1rem), 100%);
              min-width: 0;
              --dads-card-border-width: 1px;
              --dads-card-border-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-border-radius: var(--border-radius-16, 1rem);
              --dads-card-background: var(--color-neutral-white, #ffffff);
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-5, 1.25rem);
              --dads-card-gap: var(--spacing-5, 1.25rem);
              --dads-card-color: var(--color-neutral-solid-gray-800, #333333);
            }

            .card-example-4__layout {
              display: grid;
              row-gap: var(--spacing-4, 1rem);
            }

            .card-example-4__title {
              margin: 0;
              font-size: var(--font-size-20, 1.25rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
            }

            .card-example-4__title-link {
              display: block;
              width: 100%;
              color: inherit;
              font-weight: inherit;
              text-decoration: underline;
              text-decoration-thickness: calc(1 / 16 * 1rem);
              text-underline-offset: calc(4 / 16 * 1rem);
            }

            @media (any-hover: hover) {
              .card-example-4__title-link:hover {
                text-decoration-thickness: calc(2 / 16 * 1rem);
              }
            }

            .card-example-4__title-link:focus-visible {
              text-decoration-thickness: calc(2 / 16 * 1rem);
            }

            .card-example-4__value {
              display: flex;
              align-items: baseline;
              gap: var(--spacing-2, 0.5rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              line-height: 1.4;
            }

            .card-example-4__value-number {
              font-size: calc(64 / 16 * 1rem);
              letter-spacing: 0.01em;
            }

            .card-example-4__value-unit {
              font-size: calc(28 / 16 * 1rem);
            }

            .card-example-4__metrics {
              display: grid;
            }

            .card-example-4__delta {
              display: flex;
              align-items: center;
              gap: var(--spacing-2, 0.5rem);
              color: var(--color-primitive-blue-900, #0017c1);
              font-weight: var(--font-weight-700, 700);
              font-size: var(--font-size-18, 1.125rem);
              line-height: 1.4;
            }

            .card-example-4__delta svg {
              width: calc(20 / 16 * 1rem);
              height: calc(20 / 16 * 1rem);
              flex-shrink: 0;
            }

            .card-example-4__delta-label {
              color: var(--color-neutral-solid-gray-700, #555555);
              font-weight: var(--font-weight-600, 600);
            }

            .card-example-4__progress-group {
              display: grid;
              row-gap: var(--spacing-1, 0.25rem);
            }

            .card-example-4__progress-label {
              font-size: var(--font-size-14, 0.875rem);
              font-weight: var(--font-weight-600, 600);
              color: var(--color-neutral-solid-gray-700, #555555);
            }

            .card-example-4__progress-row {
              display: grid;
              grid-template-columns: minmax(0, 1fr) auto;
              align-items: center;
              gap: var(--spacing-3, 0.75rem);
            }

            .card-example-4__progress {
              position: relative;
              height: calc(10 / 16 * 1rem);
              background: var(--color-primitive-blue-100, #d9e6ff);
              border-radius: 999px;
              overflow: hidden;
            }

            .card-example-4__progress-fill {
              position: absolute;
              inset: 0;
              width: 0;
              background: var(--color-primitive-blue-900, #0017c1);
              border-radius: inherit;
            }

            .card-example-4__count {
              font-size: var(--font-size-18, 1.125rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              white-space: nowrap;
            }

            .card-example-4__divider {
              border-top: 1px solid var(--color-neutral-solid-gray-420, #949494);
              margin-block: var(--spacing-2, 0.5rem);
            }

            .card-example-4__description {
              margin: 0;
              font-size: var(--font-size-18, 1.125rem);
              line-height: var(--line-height-160, 1.6);
              color: var(--color-neutral-solid-gray-800, #333333);
            }

            .card-example-4__footer {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: var(--spacing-4, 1rem);
              flex-wrap: wrap;
              margin-top: var(--spacing-2, 0.5rem);
            }

            .card-example-4__chips {
              display: flex;
              flex-wrap: wrap;
              gap: var(--spacing-2, 0.5rem);
            }

            .card-example-4__updated {
              display: inline-flex;
              align-items: center;
              gap: var(--spacing-2, 0.5rem);
              color: var(--color-neutral-solid-gray-700, #555555);
              font-size: var(--font-size-16, 1rem);
            }

            .card-example-4__updated svg {
              width: calc(20 / 16 * 1rem);
              height: calc(20 / 16 * 1rem);
            }
          </style>

          <script type="application/json" data-card-example-4-json>
            {
              "title": "導入企業の割合",
              "value": 68.5,
              "unit": "%",
              "delta": 12,
              "deltaLabel": "先月比",
              "progress": 0.685,
              "countLabel": "886/1294件",
              "description": "導入企業の割合を業種・地域ごとにグラフで確認いただけます",
              "chips": ["Android", "iOS"],
              "updatedLabel": "17日前"
            }
          </script>

          <dads-card class="card-example-4">
            <div class="card-example-4__layout">
              <h4 class="card-example-4__title">
                <a class="card-example-4__title-link" href="#" data-card-example-4-title></a>
              </h4>

              <div class="card-example-4__metrics">
                <div class="card-example-4__value">
                  <span class="card-example-4__value-number" data-card-example-4-value></span>
                  <span class="card-example-4__value-unit" data-card-example-4-unit></span>
                </div>

                <div class="card-example-4__delta">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 4 4 12l1.4 1.4L11 7.8V20h2V7.8l5.6 5.6L20 12Z" fill="currentColor"/>
                  </svg>
                  <span data-card-example-4-delta></span>
                  <span class="card-example-4__delta-label" data-card-example-4-delta-label></span>
                </div>
              </div>

              <div class="card-example-4__progress-group">
                <div class="card-example-4__progress-label">進捗</div>
                <div class="card-example-4__progress-row">
                  <div
                    class="card-example-4__progress"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    data-card-example-4-progress
                  >
                    <div class="card-example-4__progress-fill" data-card-example-4-progress-fill></div>
                  </div>
                  <div class="card-example-4__count" data-card-example-4-count></div>
                </div>
              </div>

              <div class="card-example-4__divider" aria-hidden="true"></div>

              <p class="card-example-4__description" data-card-example-4-description></p>

              <div class="card-example-4__footer">
                <div class="card-example-4__chips" data-card-example-4-chips></div>
                <div class="card-example-4__updated">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 4a8 8 0 1 1-8 8 8 8 0 0 1 8-8m0-2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm.5 5H11v6l5 3 .8-1.3-4.3-2.6Z" fill="currentColor"/>
                  </svg>
                  <span data-card-example-4-updated></span>
                </div>
              </div>
            </div>
          </dads-card>

          <script>
            (function() {
              var currentScript = document.currentScript;
              var root = currentScript?.parentElement;
              if (!root) return;

              var jsonScript = root.querySelector('[data-card-example-4-json]');
              if (!jsonScript) return;

              var data = {};
              try {
                data = JSON.parse(jsonScript.textContent || '{}');
              } catch (error) {
                return;
              }

              var setText = function(selector, value) {
                var target = root.querySelector(selector);
                if (!target || value === undefined || value === null) return;
                target.textContent = String(value);
              };

              var deltaText = data.delta;
              if (typeof data.delta === 'number' && Number.isFinite(data.delta)) {
                deltaText = data.delta + '%';
              } else if (typeof data.delta === 'string') {
                var trimmedDelta = data.delta.trim();
                if (trimmedDelta !== '' && Number.isFinite(Number(trimmedDelta))) {
                  deltaText = Number(trimmedDelta) + '%';
                }
              }
              [
                ['[data-card-example-4-title]', data.title],
                ['[data-card-example-4-value]', data.value],
                ['[data-card-example-4-unit]', data.unit],
                ['[data-card-example-4-delta]', deltaText],
                ['[data-card-example-4-delta-label]', data.deltaLabel],
                ['[data-card-example-4-count]', data.countLabel],
                ['[data-card-example-4-description]', data.description],
                ['[data-card-example-4-updated]', data.updatedLabel],
              ].forEach(function(entry) {
                setText(entry[0], entry[1]);
              });

              var progress = Number(data.progress);
              if (!Number.isNaN(progress)) {
                var clamped = Math.min(1, Math.max(0, progress));
                var fill = root.querySelector('[data-card-example-4-progress-fill]');
                var progressEl = root.querySelector('[data-card-example-4-progress]');
                if (fill) {
                  fill.style.width = Math.round(clamped * 1000) / 10 + '%';
                }
                if (progressEl) {
                  progressEl.setAttribute('aria-valuenow', String(Math.round(clamped * 100)));
                }
              }

              if (Array.isArray(data.chips)) {
                var chipsWrap = root.querySelector('[data-card-example-4-chips]');
                if (chipsWrap) {
                  chipsWrap.textContent = '';
                  data.chips.forEach(function(label) {
                    var chip = document.createElement('dads-chip-label');
                    chip.setAttribute('variant', 'filled-outline');
                    chip.setAttribute('color', 'cyan');
                    chip.textContent = String(label);
                    chipsWrap.appendChild(chip);
                  });
                }
              }
            })();
          <\/script>
        </section>

        <!-- カード作例5（DADS公式） -->
        <section class="card-demo-subsection">
          <h3 class="card-section__title">カード作例5（DADS公式）</h3>
          <p class="card-section__note">
            DADS HTML Storybook の「作例5」を再現。スイッチで縦/横レイアウトを切り替えます。
          </p>

          <div class="card-example-5__toggle">
            <span class="card-example-5__toggle-label">レイアウト</span>
            <dads-switch data-card-example-5-toggle>
              <span slot="label-left">縦</span>
              <span slot="label-right">横</span>
            </dads-switch>
          </div>

          <style>
            .card-example-5__toggle {
              display: flex;
              align-items: center;
              gap: var(--spacing-4, 1rem);
              margin-bottom: var(--spacing-6, 1.5rem);
            }

            .card-example-5__toggle-label {
              font-size: var(--font-size-14, 0.875rem);
              font-weight: var(--font-weight-600, 600);
              color: var(--color-neutral-solid-gray-800, #333333);
            }

            .card-example-5-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: grid;
              gap: var(--spacing-6, 1.5rem);
              grid-template-columns: repeat(auto-fit, minmax(calc(300 / 16 * 1rem), 1fr));
            }

            .card-example-5-list[data-layout-horizontal] {
              grid-template-columns: minmax(0, 1fr);
              width: 100%;
              max-width: calc(940 / 16 * 1rem);
              margin-inline: auto;
            }

            .card-example-5-list > li {
              display: flex;
              min-width: 0;
            }

            dads-card.card-example-5 {
              width: 100%;
              min-width: 0;
              --card-example-5-actions-justify: flex-end;
              --card-example-5-actions-wrap: wrap;
              --dads-card-border-width: 1px;
              --dads-card-border-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-border-radius: var(--border-radius-16, 1rem);
              --dads-card-divider-width: 1px;
              --dads-card-divider-color: var(--color-neutral-solid-gray-420, #949494);
              --dads-card-background: var(--color-neutral-white, #ffffff);
              --dads-card-padding-block: var(--spacing-4, 1rem);
              --dads-card-padding-inline: var(--spacing-6, 1.5rem);
              --dads-card-gap: var(--spacing-3, 0.75rem);
              --dads-card-media-aspect-ratio: 16 / 9;
            }

            dads-card.card-example-5[layout="horizontal"] {
              --card-example-5-actions-wrap: nowrap;
              --card-example-5-actions-width: calc(320 / 16 * 1rem);
              --card-example-5-main-min: calc(360 / 16 * 1rem);
              --dads-card-media-width: calc(360 / 16 * 1rem);
              --dads-card-media-aspect-ratio: 3 / 2;
            }

            dads-card.card-example-5[layout="horizontal"]::part(base) {
              grid-template-columns:
                minmax(0, var(--dads-card-media-width))
                minmax(var(--card-example-5-main-min), 1fr)
                minmax(0, var(--card-example-5-actions-width));
              grid-template-areas: "media main sub";
              grid-template-rows: auto;
            }

            dads-card.card-example-5[layout="horizontal"]::part(sub) {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            dads-card.card-example-5::part(media) {
              position: relative;
            }

            .card-example-5__media {
              position: relative;
              width: 100%;
              height: 100%;
            }

            .card-example-5__media img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .card-example-5__date {
              position: absolute;
              top: var(--spacing-4, 1rem);
              left: var(--spacing-4, 1rem);
              background: var(--color-neutral-white, #ffffff);
              border-radius: var(--border-radius-8, 0.5rem);
              padding: var(--spacing-2, 0.5rem) var(--spacing-3, 0.75rem);
              text-align: center;
              line-height: 1;
            }

            .card-example-5__month {
              display: block;
              font-size: var(--font-size-14, 0.875rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-primitive-blue-900, #0017c1);
            }

            .card-example-5__day {
              display: block;
              margin-top: var(--spacing-1, 0.25rem);
              font-size: var(--font-size-24, 1.5rem);
              font-weight: var(--font-weight-700, 700);
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
            }

            .card-example-5__meta {
              font-size: var(--font-size-14, 0.875rem);
              color: var(--color-neutral-solid-gray-700, #555555);
            }

            .card-example-5__title {
              margin: 0;
              color: var(--color-neutral-solid-gray-900, #1a1a1c);
              font-size: var(--font-size-20, 1.25rem);
              font-weight: var(--font-weight-700, 700);
              line-height: var(--line-height-150, 1.5);
              letter-spacing: 0.02em;
            }

            .card-example-5__title a:any-link {
              display: block;
              width: 100%;
              color: var(--color-primitive-blue-1000, #00118f);
              text-decoration: underline;
              text-decoration-thickness: calc(1 / 16 * 1rem);
              text-underline-offset: calc(3 / 16 * 1rem);
            }

            .card-example-5__title a:visited {
              color: var(--color-primitive-magenta-900, #8b008b);
            }

            @media (hover: hover) {
              .card-example-5__title a:hover {
                color: var(--color-primitive-blue-900, #0017c1);
                text-decoration-thickness: calc(3 / 16 * 1rem);
              }
            }

            .card-example-5__title a:active {
              color: var(--color-primitive-orange-800, #c74700);
              text-decoration-thickness: calc(1 / 16 * 1rem);
            }

            .card-example-5__description {
              margin: 0;
              color: var(--color-neutral-solid-gray-800, #333333);
              font-size: var(--font-size-16, 1rem);
              line-height: var(--line-height-170, 1.7);
              letter-spacing: 0.02em;
            }

            .card-example-5__actions {
              display: flex;
              width: 100%;
              justify-content: var(--card-example-5-actions-justify, flex-end);
              gap: var(--spacing-4, 1rem);
              flex-wrap: var(--card-example-5-actions-wrap, wrap);
              --card-example-5-cyan-50: var(--color-primitive-cyan-50, #e9f7f9);
              --card-example-5-cyan-100: var(--color-primitive-cyan-100, #c8f8ff);
              --card-example-5-cyan-900: var(--color-primitive-cyan-900, #006f83);
              --card-example-5-cyan-1000: var(--color-primitive-cyan-1000, #006173);
              --card-example-5-cyan-1100: var(--color-primitive-cyan-1100, #004c59);
              --card-example-5-cyan-1200: var(--color-primitive-cyan-1200, #003741);
              --card-example-5-white: var(--color-primitive-white, #ffffff);
            }

            .card-example-5__actions dads-button[variant="outlined"] {
              --dads-button-background: var(--card-example-5-white);
              --dads-button-background-hover: var(--card-example-5-cyan-50);
              --dads-button-background-active: var(--card-example-5-cyan-100);
              --dads-button-color: var(--card-example-5-cyan-900);
              --dads-button-color-hover: var(--card-example-5-cyan-1000);
              --dads-button-color-active: var(--card-example-5-cyan-1100);
              --dads-button-border-color: var(--card-example-5-cyan-900);
              --dads-button-border-color-hover: var(--card-example-5-cyan-1000);
              --dads-button-border-color-active: var(--card-example-5-cyan-1100);
            }

            .card-example-5__actions dads-button[variant="solid"] {
              --dads-button-background: var(--card-example-5-cyan-900);
              --dads-button-background-hover: var(--card-example-5-cyan-1000);
              --dads-button-background-active: var(--card-example-5-cyan-1200);
              --dads-button-color: var(--card-example-5-white);
              --dads-button-border-color: var(--card-example-5-cyan-900);
              --dads-button-border-color-hover: var(--card-example-5-cyan-1000);
              --dads-button-border-color-active: var(--card-example-5-cyan-1200);
            }

          </style>

          <ul class="card-example-5-list" data-card-example-5-list>
            <li>
              <dads-card class="card-example-5" data-card-example-5>
                <div slot="media" class="card-example-5__media">
                  <img
                    src="${CARD_EXAMPLE_5_HERO_IMAGE}"
                    width="960" height="640"
                    alt="雪原と空が広がる冬の風景写真"
                  >
                  <div class="card-example-5__date" aria-hidden="true">
                    <span class="card-example-5__month">12月</span>
                    <span class="card-example-5__day">27</span>
                  </div>
                </div>
                <div class="card-example-5__meta">トラベル情報</div>
                <h2 class="card-example-5__title">
                  <a href="#" data-dads-card-primary>鳥の野鳥観察ツアー</a>
                </h2>
                <p class="card-example-5__description">
                  大自然の中で野鳥を観察できます。ガイド付きで安心してご参加いただけます。
                </p>
                <div slot="sub" class="card-example-5__actions">
                  <dads-button size="small" variant="outlined">共有する</dads-button>
                  <dads-button size="small" variant="solid">あとで読む</dads-button>
                </div>
              </dads-card>
            </li>

            <li>
              <dads-card class="card-example-5" data-card-example-5>
                <div slot="media" class="card-example-5__media">
                  <img
                    src="${CARD_EXAMPLE_5_HERO_IMAGE}"
                    width="960" height="640"
                    alt="雪景色が広がる湖畔の風景写真"
                  >
                  <div class="card-example-5__date" aria-hidden="true">
                    <span class="card-example-5__month">1月</span>
                    <span class="card-example-5__day">15</span>
                  </div>
                </div>
                <div class="card-example-5__meta">宿泊情報</div>
                <h2 class="card-example-5__title">
                  <a href="#" data-dads-card-primary>温泉リゾート滞在プラン</a>
                </h2>
                <p class="card-example-5__description">
                  美しい山間の温泉で心身ともにリフレッシュ。地元の食材を使った料理もお楽しみいただけます。
                </p>
                <div slot="sub" class="card-example-5__actions">
                  <dads-button size="small" variant="outlined">共有する</dads-button>
                  <dads-button size="small" variant="solid">あとで読む</dads-button>
                </div>
              </dads-card>
            </li>

            <li>
              <dads-card class="card-example-5" data-card-example-5>
                <div slot="media" class="card-example-5__media">
                  <img
                    src="${CARD_EXAMPLE_5_HERO_IMAGE}"
                    width="960" height="640"
                    alt="雪の平原を望む冬の風景写真"
                  >
                  <div class="card-example-5__date" aria-hidden="true">
                    <span class="card-example-5__month">2月</span>
                    <span class="card-example-5__day">3</span>
                  </div>
                </div>
                <div class="card-example-5__meta">文化体験</div>
                <h2 class="card-example-5__title">
                  <a href="#" data-dads-card-primary>古都散策ウォーキング</a>
                </h2>
                <p class="card-example-5__description">
                  歴史ある街並みをゆっくりと歩きながら、伝統文化と建築美を堪能できるコースです。
                </p>
                <div slot="sub" class="card-example-5__actions">
                  <dads-button size="small" variant="outlined">共有する</dads-button>
                  <dads-button size="small" variant="solid">あとで読む</dads-button>
                </div>
              </dads-card>
            </li>
          </ul>

          <script>
            (function() {
              var currentScript = document.currentScript;
              customElements.whenDefined('dads-switch').then(function() {
                var root = currentScript?.parentElement;
                if (!root || !root.isConnected) return;

                var toggle = root.querySelector('[data-card-example-5-toggle]');
                var list = root.querySelector('[data-card-example-5-list]');
                var cards = root.querySelectorAll('[data-card-example-5]');
                if (!toggle || !list || cards.length === 0) return;

                var applyLayout = function() {
                  var isHorizontal = toggle.hasAttribute('checked');
                  list.toggleAttribute('data-layout-horizontal', isHorizontal);
                  for (var i = 0; i < cards.length; i++) {
                    if (isHorizontal) {
                      cards[i].setAttribute('layout', 'horizontal');
                    } else {
                      cards[i].removeAttribute('layout');
                    }
                  }
                };

                toggle.addEventListener('dads-change', applyLayout);
                applyLayout();
              });
            })();
          <\/script>
        </section>
      </section>
    </div>
  `,

  list: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">箇条書きリスト</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS準拠の箇条書きリスト。<code>&lt;ol&gt;</code> や CSS カウンターは使わず、項番は地のテキストとして扱います。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈（a11y-annotate） -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate
          target-selector="dads-list"
          style="
            --a11y-annotate-callout-lane-offset: 128px;
            --a11y-annotate-callout-gutter: clamp(6rem, 16vw, 14rem);
          "
        >
          <div style="padding: 80px 140px;">
            <dads-list variant="marker" spacing="md">
              <dads-list-item>項目1</dads-list-item>
              <dads-list-item>
                項目2（入れ子あり）
                <dads-list variant="marker" spacing="md">
                  <dads-list-item>入れ子項目A</dads-list-item>
                  <dads-list-item>入れ子項目B</dads-list-item>
                </dads-list>
              </dads-list-item>
              <dads-list-item>項目3</dads-list-item>
            </dads-list>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-list',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-list data-api-target variant="marker" spacing="md">
                  <dads-list-item>
                    <span slot="marker">1.</span>
                    項目1
                  </dads-list-item>
                  <dads-list-item>
                    <span slot="marker">2.</span>
                    項目2（入れ子あり）
                    <dads-list variant="marker" spacing="md">
                      <dads-list-item>
                        <span slot="marker">2-1.</span>
                        入れ子項目A
                      </dads-list-item>
                      <dads-list-item>
                        <span slot="marker">2-2.</span>
                        入れ子項目B
                      </dads-list-item>
                    </dads-list>
                  </dads-list-item>
                  <dads-list-item>
                    <span slot="marker">3.</span>
                    項目3
                  </dads-list-item>
                </dads-list>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-list variant="marker" spacing="md">
                      <dads-list-item>項目1</dads-list-item>
                      <dads-list-item>
                        項目2（入れ子あり）
                        <dads-list variant="marker" spacing="md">
                          <dads-list-item>入れ子項目A</dads-list-item>
                          <dads-list-item>入れ子項目B</dads-list-item>
                        </dads-list>
                      </dads-list-item>
                      <dads-list-item>項目3</dads-list-item>
                    </dads-list>

                    <!-- 項番タイプ（<ol>は使わず、項番は地のテキストとして記載） -->
                    <dads-list variant="number" spacing="md" marker-width="2">
                      <dads-list-item><span slot="marker">1.</span>項目1</dads-list-item>
                      <dads-list-item><span slot="marker">2.</span>項目2</dads-list-item>
                    </dads-list>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>marker</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="variant" size="md 240" value="marker" data-api-attr="variant" data-default="marker">
                              <option value="marker">marker</option>
                              <option value="number">number</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>リストマーク / 項番</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>spacing</code></th>
                        <td><code>attr</code></td>
                        <td><code>md</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="spacing" size="md 240" value="md" data-api-attr="spacing" data-default="md">
                              <option value="lg">lg</option>
                              <option value="md">md</option>
                              <option value="sm">sm</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>項目間隔（12/8/4）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>marker-width</code></th>
                        <td><code>attr</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="marker-width"
                              value=""
                              data-api-attr="marker-width"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>項番タイプのマーカー幅（全角n文字相当）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-list-marker-gap</code></th>
                        <td><code>--spacing-2</code><br><small class="wc-api-table__meta">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-list-marker-gap" value="" data-api-css-var="--dads-list-marker-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>マーカー列と本文列の間隔</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-list-marker-width</code></th>
                        <td><code>2em</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-list-marker-width" value="" data-api-css-var="--dads-list-marker-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>マーカー列の幅（例: <code>2em</code>）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-list-marker-color</code></th>
                        <td><code>--color-neutral-solid-gray-800</code><br><small class="wc-api-table__meta">(#333)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-list-marker-color" value="" data-api-css-var="--dads-list-marker-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>マーカー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-list-marker-size</code></th>
                        <td><code>6px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-list-marker-size" value="" data-api-css-var="--dads-list-marker-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>マーカー記号のサイズ（markerタイプ向け）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-list-marker-content-1</code></th>
                        <td><code>'●'</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-list-marker-content-1" value="" data-api-css-var="--dads-list-marker-content-1" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>マーカー種別1（入力はクォート込み）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-list-marker-content-2</code></th>
                        <td><code>'○'</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-list-marker-content-2" value="" data-api-css-var="--dads-list-marker-content-2" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>マーカー種別2（depth2-4）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-list-marker-content-3</code></th>
                        <td><code>'■'</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-list-marker-content-3" value="" data-api-css-var="--dads-list-marker-content-3" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>マーカー種別3（depth5+）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
          `,
        })}
      </section>
    </div>
  `,

  descriptionList: () => `
    <div data-dads-typeset style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">説明リスト</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS準拠の説明リスト。<code>dt</code> / <code>dd</code> の組を使って「項目名: 説明」を表現します。
        <br>※ <code>div</code> ラップは任意です。<code>dt</code> / <code>dd</code> を直接書いた場合も内部で <code>dl</code> を構築します。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈（a11y-annotate） -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate
          target-selector="dads-description-list"
          style="
            --a11y-annotate-callout-lane-offset: 40px;
            --a11y-annotate-callout-gutter: clamp(3rem, 8vw, 6rem);
          "
        >
          <div style="padding: 48px 24px;">
            <div style="max-width: 760px; margin-inline: auto;">
              <style>
                dads-description-list[data-a11y-demo='description-list'] dt {
                  display: inline-block;
                }
              </style>
              <dads-description-list data-a11y-demo="description-list" marker="none">
                <div>
                  <dt>項目名1</dt>
                  <dd>これは項目1の説明文です。説明リストは用語とその説明を対応付ける用途に適しています。</dd>
                </div>
                <div>
                  <dt>項目名2</dt>
                  <dd>これは項目2の説明文です。確認画面や詳細画面の情報表示に使えます。</dd>
                </div>
              </dads-description-list>
            </div>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-description-list',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-description-list data-api-target marker="none">
                  <div>
                    <dt>項目名1</dt>
                    <dd>これは項目1の説明文です。説明リストは用語と説明の対を表すのに適しています。</dd>
                  </div>
                  <div>
                    <dt><span>2.</span>項目名2</dt>
                    <dd>これは項目2の説明文です。確認画面・審査画面などで頻繁に使われます。</dd>
                  </div>
                </dads-description-list>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <!-- 通常 -->
                    <dads-description-list marker="none">
                      <div>
                        <dt>項目名1</dt>
                        <dd>これは項目1の説明文です。</dd>
                      </div>
                      <div>
                        <dt>項目名2</dt>
                        <dd>これは項目2の説明文です。</dd>
                      </div>
                    </dads-description-list>

                    <!-- ブレット -->
                    <dads-description-list marker="bullet">
                      <div>
                        <dt>項目名1</dt>
                        <dd>これは項目1の説明文です。</dd>
                      </div>
                    </dads-description-list>

                    <!-- カスタムマーカー -->
                    <dads-description-list marker="custom">
                      <div>
                        <dt><span>1.</span>項目名1</dt>
                        <dd>これは項目1の説明文です。</dd>
                      </div>
                    </dads-description-list>

                    <!-- DADS HTML 互換属性 -->
                    <dads-description-list data-marker="bullet">
                      <div>
                        <dt>項目名</dt>
                        <dd>data-marker 属性も利用できます。</dd>
                      </div>
                    </dads-description-list>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>marker</code></th>
                        <td><code>attr</code></td>
                        <td><code>"none" | "bullet" | "custom"</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="marker" size="md 240" value="none" data-api-attr="marker" data-default="none">
                              <option value="none">none</option>
                              <option value="bullet">bullet</option>
                              <option value="custom">custom</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>マーカー表示種別</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>data-marker</code></th>
                        <td><code>attr</code></td>
                        <td><code>"none" | "bullet" | "custom"</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="data-marker" size="md 240" value="none" data-api-attr="data-marker" data-default="none">
                              <option value="none">none</option>
                              <option value="bullet">bullet</option>
                              <option value="custom">custom</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>DADS HTML 互換属性（marker と同期）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-description-list-margin-block</code></th>
                        <td><code>--spacing-4</code><br><small class="wc-api-table__meta">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-description-list-margin-block" value="" data-api-css-var="--dads-description-list-margin-block" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ブロック方向マージン</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-description-list-item-gap</code></th>
                        <td><code>--spacing-2</code><br><small class="wc-api-table__meta">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-description-list-item-gap" value="" data-api-css-var="--dads-description-list-item-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>項目間の行間</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-description-list-indent</code></th>
                        <td><code>--spacing-8</code><br><small class="wc-api-table__meta">(32px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-description-list-indent" value="" data-api-css-var="--dads-description-list-indent" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>インデント幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-description-list-term-font-weight</code></th>
                        <td><code>--font-weight-700</code><br><small class="wc-api-table__meta">(700)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-description-list-term-font-weight" value="" data-api-css-var="--dads-description-list-term-font-weight" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>用語（dt）の文字ウェイト</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-description-list-overflow-wrap</code></th>
                        <td><code>anywhere</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-description-list-overflow-wrap" value="" data-api-css-var="--dads-description-list-overflow-wrap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>折り返し規則</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>
    </div>
  `,

  resourceList: () => {
    const annotateLinkRow = renderResourceListDemoRow({
      style: 'frame',
      interaction: 'whole',
      className: 'resource-list-figma-item',
      href: '/resource-list-demo',
      iconHtml: RESOURCE_LIST_DEMO_ICON_SVG,
      title: 'リストタイトル',
      label: 'ラベル',
      support: 'サポートテキスト',
      sub: 'サブラベル',
      action: 'menu',
      actionAriaLabel: 'メニュー',
    }, 'resource-list-annotate-link');

    const annotateControlRow = renderResourceListDemoRow({
      style: 'frame',
      interaction: 'whole',
      className: 'resource-list-figma-item',
      control: 'checkbox',
      controlChecked: true,
      iconHtml: RESOURCE_LIST_DEMO_ICON_SVG,
      title: 'リストタイトル',
      label: 'ラベル',
      support: 'サポートテキスト',
      sub: 'サブラベル',
      action: 'menu',
      actionAriaLabel: 'メニュー',
    }, 'resource-list-annotate-control');

    const examRows: ResourceListDemoRow[] = [
      { style: 'frame', className: 'resource-list-figma-item', title: '健康診断', support: '2025年度', sub: '受診日：2025/04/30' },
      { style: 'frame', className: 'resource-list-figma-item', title: '健康診断', support: '2024年度', sub: '受診日：2024/11/24' },
      { style: 'frame', className: 'resource-list-figma-item', title: '健康診断', support: '2023年度', sub: '受診日：2023/10/13' },
    ];

    const payrollRows: ResourceListDemoRow[] = [
      { style: 'frame', className: 'resource-list-figma-item resource-list-figma-item--payroll', title: '給与明細', support: '2025年10月分', sub: '支給日：2025/11/14', action: 'download' },
      { style: 'frame', className: 'resource-list-figma-item resource-list-figma-item--payroll', title: '給与明細', support: '2025年9月分', sub: '支給日：2025/10/15', action: 'download' },
      { style: 'frame', className: 'resource-list-figma-item resource-list-figma-item--payroll', title: '給与明細', support: '2025年8月分', sub: '支給日：2025/9/15', action: 'download' },
    ];

    const accountRows: ResourceListDemoRow[] = [
      {
        style: 'list',
        className: 'resource-list-figma-item resource-list-figma-item--account',
        title: 'デジ田 太郎',
        titleHref: '#',
        support: 'taro-dejita@example.com',
        sub: '招待中',
        actionHtml: renderResourceListAccountActionMenu('resource-list-account-menu-1', 'デジ田 太郎'),
      },
      {
        style: 'list',
        className: 'resource-list-figma-item resource-list-figma-item--account',
        title: 'デジ山 ひかり',
        titleHref: '#',
        support: 'hikari-dejiyama@example.com',
        actionHtml: renderResourceListAccountActionMenu('resource-list-account-menu-2', 'デジ山 ひかり'),
      },
      {
        style: 'list',
        className: 'resource-list-figma-item resource-list-figma-item--account',
        title: '出而足 長一郎',
        titleHref: '#',
        support: 'choichiro-dejitaru@example.com',
        actionHtml: renderResourceListAccountActionMenu('resource-list-account-menu-3', '出而足 長一郎'),
      },
    ];

    const paymentRows: ResourceListDemoRow[] = [
      {
        style: 'frame',
        interaction: 'whole',
        className: 'resource-list-figma-item',
        control: 'radio',
        controlName: 'resource-list-payment',
        controlChecked: true,
        title: 'クレジットカード払い',
        label: 'おすすめ',
        support: 'VISA, Master、JCB対応',
      },
      {
        style: 'frame',
        interaction: 'whole',
        className: 'resource-list-figma-item',
        control: 'radio',
        controlName: 'resource-list-payment',
        title: '銀行振込',
        supportHtml: '<span slot="support">入金確認後の商品発送となります。<br>振り込み手数料はお客様負担となります。</span>',
      },
      {
        style: 'frame',
        interaction: 'whole',
        className: 'resource-list-figma-item',
        control: 'radio',
        controlName: 'resource-list-payment',
        title: 'コンビニ決済',
        supportHtml: '<span slot="support">入金確認後の商品発送となります。<br>全国のコンビニで利用可能です。</span>',
      },
    ];

    const roomRows: ResourceListDemoRow[] = [
      {
        style: 'frame',
        interaction: 'whole',
        className: 'resource-list-figma-item resource-list-figma-item--room-menu',
        control: 'radio',
        controlName: 'resource-list-room',
        controlChecked: true,
        title: '会議室A',
        support: '25階North',
        actionHtml: renderResourceListActionMenu('resource-list-room-menu-1', '会議室Aのサブアクション', [
          '空き状況を確認',
          '予約を変更',
          '設備を表示',
        ]),
      },
      {
        style: 'frame',
        interaction: 'whole',
        className: 'resource-list-figma-item resource-list-figma-item--room-menu',
        control: 'radio',
        controlName: 'resource-list-room',
        title: '会議室B',
        support: '25階West',
        sub: '利用中',
        actionHtml: renderResourceListActionMenu('resource-list-room-menu-2', '会議室Bのサブアクション', [
          '利用状況を見る',
          '予約を依頼',
          '設備を表示',
        ]),
      },
      {
        style: 'frame',
        interaction: 'whole',
        className: 'resource-list-figma-item resource-list-figma-item--room-menu',
        control: 'radio',
        controlName: 'resource-list-room',
        title: '会議室C',
        support: '27階East',
        actionHtml: renderResourceListActionMenu('resource-list-room-menu-3', '会議室Cのサブアクション', [
          '空き状況を確認',
          '予約を依頼',
          '設備を表示',
        ]),
      },
    ];

    const userRows: ResourceListDemoRow[] = [
      {
        style: 'list',
        interaction: 'inline',
        className: 'resource-list-figma-item',
        control: 'checkbox',
        iconHtml: RESOURCE_LIST_AVATAR_ICON_SVG,
        title: '電磁 多留子',
        support: '開発部',
        sub: '管理者',
      },
      {
        style: 'list',
        interaction: 'inline',
        className: 'resource-list-figma-item',
        control: 'checkbox',
        controlChecked: true,
        iconHtml: RESOURCE_LIST_AVATAR_ICON_SVG,
        title: 'デジ田 太郎',
        support: 'マーケティング部',
        sub: 'メンバー',
      },
      {
        style: 'list',
        interaction: 'inline',
        className: 'resource-list-figma-item',
        control: 'checkbox',
        iconHtml: RESOURCE_LIST_AVATAR_ICON_SVG,
        title: 'デジ山 ひかり',
        support: 'CEO',
        sub: 'オーナー',
      },
    ];

    const searchRows: ResourceListDemoRow[] = [
      {
        style: 'list',
        className: 'resource-list-figma-item resource-list-figma-item--search',
        title: 'エンタメ領域におけるマイナンバーカードの利用シーン拡大を目指し、不正転売防止等に関する実証実験を実施します',
        titleHref: '#',
        supportHtml: '<span slot="support">エンタメ領域におけるマイナンバーカードの利用シーン拡大を目指し、不正転売防止等に関する実証実験を実施します エンタメ領域におけるマイナンバーカードの利用シーン拡大を目指し、不正転売防止等に関する実証実験を実施します...</span>',
      },
      {
        style: 'list',
        className: 'resource-list-figma-item resource-list-figma-item--search',
        title: '民間事業者に対してマイナンバーカード（ICチップ）の空き領域の利用に関する告示を行いました',
        titleHref: '#',
        supportHtml: '<span slot="support">民間事業者に対してマイナンバーカード（ICチップ）の空き領域の利用に関する告示を行いました 民間事業者に対してマイナンバーカード（ICチップ）の空...項第4号の規定に基づきモバイルクリエイト株式会社がマイナンバーカード（ICチップ...</span>',
      },
      {
        style: 'list',
        className: 'resource-list-figma-item resource-list-figma-item--search',
        title: 'マイナンバー（個人番号）制度・マイナンバーカード',
        titleHref: '#',
        supportHtml: '<span slot="support">...手続等における特定の個人を識別するための制度です。行政機関等の間での情報連携により、各種の行政手続における添付書類の省略などが可能となります。また、マイナンバーカードは、民間サービスでの本人確認等にも利用できます...</span>',
      },
    ];

    const noticeRows: ResourceListDemoRow[] = [
      {
        style: 'frame',
        className: 'resource-list-figma-item resource-list-figma-item--notice',
        componentAttrs: 'style="--dads-resource-list-border-color: var(--color-neutral-opacity-gray-420, rgba(0,0,0,0.42));"',
        title: '【注意喚起】年金事務所を騙り、マイナポータルの偽サイト・偽アプリへ誘導される事案について',
        titleHref: '#',
        labelHtml: '<dads-chip-label slot="label" variant="filled-outline" color="red">重要</dads-chip-label>',
        support: '2024年3月26日',
      },
      {
        style: 'frame',
        className: 'resource-list-figma-item',
        title: 'アプリの画面デザインとアプリアイコンを刷新しました',
        support: '2023年8月23日',
      },
      {
        style: 'frame',
        className: 'resource-list-figma-item',
        title: '本ページを公開しました',
        support: '2023年8月23日',
      },
    ];

    const renderRows = (rows: readonly ResourceListDemoRow[], sectionKey: string) =>
      rows.map((row, index) => renderResourceListDemoRow(row, `${sectionKey}-row-${index + 1}`)).join('');

    const exampleSections = [
      { title: '受診記録一覧', stackClass: 'resource-list-stack--frame', rows: examRows },
      { title: '給与明細一覧', stackClass: 'resource-list-stack--frame', rows: payrollRows },
      { title: 'アカウント一覧', stackClass: 'resource-list-stack--list', rows: accountRows },
      { title: '支払い方法選択', stackClass: 'resource-list-stack--frame', rows: paymentRows },
      { title: '会議室選択', stackClass: 'resource-list-stack--frame', rows: roomRows },
      { title: 'ユーザー選択', stackClass: 'resource-list-stack--list', rows: userRows },
      { title: '検索結果一覧', stackClass: 'resource-list-stack--list', rows: searchRows },
      { title: 'お知らせ一覧', stackClass: 'resource-list-stack--frame', rows: noticeRows },
    ] as const;

    const renderExampleSections = (): string => {
      const rendered: string[] = [];
      for (const [index, section] of exampleSections.entries()) {
        rendered.push(`
          <article class="resource-list-example-card">
            <h4 class="resource-list-example-title">${section.title}</h4>
            <div class="${section.stackClass}">${renderRows(section.rows, `resource-list-section-${index + 1}`)}</div>
          </article>
        `);

        if (index < exampleSections.length - 1) {
          rendered.push(
            '<dads-divider class="resource-list-example-divider" data-color="solid-gray-420" data-style="dashed" data-width="1"></dads-divider>'
          );
        }
      }
      return rendered.join('');
    };

    return `
    <div data-dads-typeset style="padding: 40px; max-width: 1600px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">リソースリスト</h2>
      <p style="color: #666; margin-bottom: 32px;">
        DADS準拠のリソースリスト。カード状の1行要素として、リンク・選択コントロール・補足ラベル・アクションを組み合わせられます。
      </p>

      ${renderAnnotationToggleBlock()}

      <style>
        .resource-list-figma-item {
          --dads-resource-list-padding-block: calc(16 / 16 * 1rem);
          --dads-resource-list-padding-inline: calc(16 / 16 * 1rem);
          --dads-resource-list-gap: calc(16 / 16 * 1rem);
          --dads-resource-list-action-width: calc(44 / 16 * 1rem);
        }

        .resource-list-figma-item [slot='title'] {
          margin: 0;
        }

        .resource-list-figma-item--search {
          --dads-resource-list-padding-block: calc(24 / 16 * 1rem);
          --dads-resource-list-padding-inline: 0;
          --dads-resource-list-content-gap: calc(16 / 16 * 1rem);
        }

        .resource-list-figma-item--search [slot='support'] {
          line-height: 1.7;
          letter-spacing: 0.02em;
        }

        .resource-list-figma-item--notice [slot='label'] {
          display: inline-flex;
          align-items: center;
        }

        .resource-list-figma-item--payroll {
          --dads-resource-list-border-radius: 0;
        }

        .resource-list-figma-item--account::part(action) {
          overflow: visible;
          z-index: 2;
        }

        .resource-list-figma-item--account::part(base) {
          overflow: visible;
        }

        .resource-list-figma-item--account {
          position: relative;
          z-index: 0;
        }

        .resource-list-figma-item--account:has(.resource-list-account-menu[open]) {
          z-index: 4;
        }

        .resource-list-figma-item--room-menu::part(action) {
          overflow: visible;
          z-index: 2;
        }

        .resource-list-figma-item--room-menu::part(base) {
          overflow: visible;
        }

        .resource-list-figma-item--room-menu {
          position: relative;
          z-index: 0;
        }

        .resource-list-figma-item--room-menu:has(.resource-list-account-menu[open]) {
          z-index: 4;
        }

        .resource-list-account-menu {
          position: relative;
          display: block;
          inline-size: var(--dads-resource-list-action-width);
          min-inline-size: var(--dads-resource-list-action-width);
          block-size: 100%;
          border-start-end-radius: inherit;
          border-end-end-radius: inherit;
        }

        .resource-list-account-menu > summary {
          display: flex;
          align-items: center;
          justify-content: center;
          inline-size: 100%;
          block-size: 100%;
          list-style: none;
          cursor: pointer;
          color: inherit;
          background: transparent;
          border: 0;
          border-start-start-radius: 0;
          border-end-start-radius: 0;
          border-start-end-radius: var(--dads-resource-list-border-radius, calc(16 / 16 * 1rem));
          border-end-end-radius: var(--dads-resource-list-border-radius, calc(16 / 16 * 1rem));
        }

        .resource-list-account-menu > summary::-webkit-details-marker {
          display: none;
        }

        .resource-list-account-menu > summary:focus-visible {
          outline: var(--dads-resource-list-focus-outline-width, calc(4 / 16 * 1rem))
            solid var(--dads-resource-list-focus-outline-color, var(--color-neutral-black, #000000));
          outline-offset: calc(-3 / 16 * 1rem);
          background: var(--dads-resource-list-focus-ring-color, var(--color-primitive-yellow-300, #ffd43d));
          box-shadow: none;
          border-start-start-radius: 0;
          border-end-start-radius: 0;
          border-start-end-radius: var(--dads-resource-list-border-radius, calc(16 / 16 * 1rem));
          border-end-end-radius: var(--dads-resource-list-border-radius, calc(16 / 16 * 1rem));
        }

        .resource-list-account-menu > [role='menu'] {
          position: absolute;
          inset-inline-start: calc(100% + 4px);
          inset-inline-end: auto;
          inset-block-start: 0;
          display: none;
          margin: 0;
          padding: 4px 0;
          min-inline-size: 11.5rem;
          list-style: none;
          border: 1px solid var(--color-neutral-solid-gray-420, #949494);
          border-radius: var(--border-radius-8, 0.5rem);
          background: var(--color-neutral-white, #ffffff);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
          z-index: 3;
        }

        .resource-list-account-menu[open] > [role='menu'] {
          display: grid;
        }

        .resource-list-account-menu [role='menuitem'] {
          display: block;
          inline-size: 100%;
          margin: 0;
          padding: 10px 12px;
          border: 0;
          background: transparent;
          color: var(--color-neutral-solid-gray-800, #333333);
          font: inherit;
          line-height: 1.4;
          text-align: start;
          cursor: pointer;
        }

        @media (any-hover: hover) {
          .resource-list-account-menu [role='menuitem']:hover {
            background: var(--color-neutral-solid-gray-50, #f2f2f2);
          }
        }

        .resource-list-account-menu [role='menuitem']:focus-visible {
          outline: 2px solid var(--color-neutral-black, #000000);
          outline-offset: -2px;
          background: var(--color-primitive-yellow-300, #ffd43d);
        }

        .resource-list-annotate-stack {
          display: grid;
          gap: 24px;
        }

        .resource-list-annotate-variant-title,
        .resource-list-example-title {
          margin: 0 0 12px;
          color: #333;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.5;
        }

        .resource-list-example-grid {
          display: grid;
          gap: 0;
          grid-template-columns: minmax(0, 1fr);
        }

        .resource-list-example-card {
          display: grid;
          gap: 16px;
          align-content: start;
          padding-block: 24px;
        }

        .resource-list-example-divider {
          --dads-divider-margin: 0;
          --dads-divider-margin-block: 0;
          --dads-divider-margin-inline: 0;
        }

        .resource-list-stack--frame {
          display: grid;
          gap: 16px;
        }

        .resource-list-stack--list {
          display: grid;
          gap: 0;
        }
      </style>

      <!-- アクセシビリティ注釈（a11y-annotate） -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <div class="resource-list-annotate-stack">
          <div>
            <p class="resource-list-annotate-variant-title">リンク版</p>
            <a11y-annotate
              target-selector="dads-resource-list"
              style="
                --a11y-annotate-callout-lane-offset: 48px;
                --a11y-annotate-callout-gutter: clamp(4rem, 10vw, 8rem);
              "
            >
              <div style="padding: 60px 24px;">
                <div style="max-width: 840px; margin-inline: auto;">
                  ${annotateLinkRow}
                </div>
              </div>
            </a11y-annotate>
          </div>

          <div>
            <p class="resource-list-annotate-variant-title">フォームコントロール版</p>
            <a11y-annotate
              target-selector="dads-resource-list"
              style="
                --a11y-annotate-callout-lane-offset: 48px;
                --a11y-annotate-callout-gutter: clamp(4rem, 10vw, 8rem);
              "
            >
              <div style="padding: 60px 24px;">
                <div style="max-width: 840px; margin-inline: auto;">
                  ${annotateControlRow}
                </div>
              </div>
            </a11y-annotate>
          </div>
        </div>
      </section>

      <script>
        (function() {
          var root = document.currentScript?.parentElement;
          if (!root || !root.isConnected) return;

          var getMenus = function() {
            return Array.from(root.querySelectorAll('.resource-list-account-menu'));
          };

          root.addEventListener(
            'toggle',
            function(event) {
              var target = event.target;
              if (!(target instanceof HTMLDetailsElement)) return;
              if (!target.classList.contains('resource-list-account-menu')) return;
              if (!target.open) return;
              for (const menu of getMenus()) {
                if (menu === target) continue;
                menu.removeAttribute('open');
              }
            },
            true
          );

          root.addEventListener('click', function(event) {
            var target = event.target;
            if (!(target instanceof Node)) return;
            for (const menu of getMenus()) {
              if (menu.contains(target)) continue;
              menu.removeAttribute('open');
            }
          });

          root.addEventListener('keydown', function(event) {
            if (event.key !== 'Escape') return;
            for (const menu of getMenus()) {
              menu.removeAttribute('open');
            }
          });
        })();
      </script>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-resource-list',
            'dads-divider',
            'dads-select',
            'dads-switch',
            'dads-checkbox',
            'dads-radio',
            'dads-chip-label',
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-resource-list
                  data-api-target
                  data-resource-list-api-preview
                  data-style="list"
                  data-interaction="inline"
                >
                  ${RESOURCE_LIST_DEMO_ICON_SVG}
                  <a slot="title" href="#">デジ田 太郎</a>
                  <span slot="label">管理者</span>
                  <span slot="support">taro-dejita@example.com</span>
                  <span slot="sub">招待中</span>
                  <button slot="action" type="button" aria-label="メニュー">
                    ${RESOURCE_LIST_ACTION_ICON_SVG}
                  </button>
                </dads-resource-list>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <!-- リンク型 -->
                    <dads-resource-list data-style="list" data-interaction="whole" href="/example">
                      ${RESOURCE_LIST_DEMO_ICON_SVG}
                      <span slot="title">リストタイトル</span>
                      <span slot="label">ラベル</span>
                      <span slot="support">サポートテキスト</span>
                      <span slot="sub">サブラベル</span>
                    </dads-resource-list>

                    <!-- コントロール型 -->
                    <dads-resource-list data-style="frame" data-interaction="whole">
                      <dads-checkbox slot="control" checked aria-labelledby="resource-list-user-title resource-list-user-support"></dads-checkbox>
                      <span id="resource-list-user-title" slot="title">デジ田 太郎</span>
                      <span slot="label">管理者</span>
                      <span id="resource-list-user-support" slot="support">taro-dejita@example.com</span>
                    </dads-resource-list>

                    <!-- コントロール型（radio） -->
                    <dads-resource-list data-style="frame" data-interaction="whole">
                      <dads-radio slot="control" name="payment-method" checked aria-labelledby="resource-list-payment-title resource-list-payment-support"></dads-radio>
                      <span id="resource-list-payment-title" slot="title">クレジットカード払い</span>
                      <span id="resource-list-payment-support" slot="support">Visa、Master、JCB対応</span>
                    </dads-resource-list>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>data-style</code></th>
                        <td><code>attr</code></td>
                        <td><code>"list" | "frame"</code></td>
                        <td><code>list</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="data-style" size="md 240" value="list" data-api-attr="data-style" data-default="list">
                              <option value="list">list</option>
                              <option value="frame">frame</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>リスト表示スタイル</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>data-interaction</code></th>
                        <td><code>attr</code></td>
                        <td><code>"inline" | "whole"</code></td>
                        <td><code>inline</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="data-interaction" size="md 240" value="inline" data-api-attr="data-interaction" data-default="inline">
                              <option value="inline">inline</option>
                              <option value="whole">whole</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>インタラクション方式</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>slot="control"</code></th>
                        <td><code>slot</code></td>
                        <td><code>"none" | "checkbox" | "radio"</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="control type" size="md 240" value="none" data-resource-list-control-kind data-default="none">
                              <option value="none">none</option>
                              <option value="checkbox">checkbox</option>
                              <option value="radio">radio</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>Preview の control slot にフォームコントロールを挿入（デモ専用）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>control.checked</code></th>
                        <td><code>demo</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="control checked" data-resource-list-control-checked data-default="false">
                              <span slot="label-left">false</span>
                              <span slot="label-right">true</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>挿入した checkbox/radio の選択状態を切り替え</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>control.disabled</code></th>
                        <td><code>demo</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="control disabled" data-resource-list-control-disabled data-default="false">
                              <span slot="label-left">false</span>
                              <span slot="label-right">true</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>挿入した checkbox/radio の無効状態を切り替え</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>href</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="href" value="" data-api-attr="href" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>wholeリンク時の遷移先</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>target</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="target" size="md 240" value="" data-api-attr="target" data-default="">
                              <option value="">(empty)</option>
                              <option value="_self">_self</option>
                              <option value="_blank">_blank</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>wholeリンク時のターゲット</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>rel</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>(empty)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="rel" value="" data-api-attr="rel" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>wholeリンク時のrel属性</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>download</code></th>
                        <td><code>attr</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="download" size="md 240" value="" data-api-attr="download" data-default="">
                              <option value="">false</option>
                              <option value="download">true</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>wholeリンク時にdownload属性を付与</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-resource-list-background</code></th>
                        <td><code>--color-neutral-white</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-resource-list-background" value="" data-api-css-var="--dads-resource-list-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-resource-list-border-color</code></th>
                        <td><code>--color-neutral-solid-gray-420</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-resource-list-border-color" value="" data-api-css-var="--dads-resource-list-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>境界線色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-resource-list-title-color</code></th>
                        <td><code>--color-neutral-solid-gray-900</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-resource-list-title-color" value="" data-api-css-var="--dads-resource-list-title-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>タイトル色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-resource-list-title-link-color</code></th>
                        <td><code>--color-primitive-blue-1000</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-resource-list-title-link-color" value="" data-api-css-var="--dads-resource-list-title-link-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>タイトルリンク色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-resource-list-padding-inline</code></th>
                        <td><code>1rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-resource-list-padding-inline" value="" data-api-css-var="--dads-resource-list-padding-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右余白</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-resource-list-action-width</code></th>
                        <td><code>2.75rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-resource-list-action-width" value="" data-api-css-var="--dads-resource-list-action-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>右端アクション幅</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}

        <script>
          (function() {
            var currentScript = document.currentScript;
            Promise.all([
              customElements.whenDefined('dads-resource-list'),
              customElements.whenDefined('dads-select'),
              customElements.whenDefined('dads-switch'),
              customElements.whenDefined('dads-checkbox'),
              customElements.whenDefined('dads-radio'),
            ]).then(function() {
              var root = currentScript?.parentElement;
              if (!root || !root.isConnected) return;

              var panel = root.querySelector('.wc-api-panel');
              if (!panel) return;

              var preview = panel.querySelector('dads-resource-list[data-resource-list-api-preview]');
              var kindControl = panel.querySelector('[data-resource-list-control-kind]');
              var checkedControl = panel.querySelector('[data-resource-list-control-checked]');
              var disabledControl = panel.querySelector('[data-resource-list-control-disabled]');
              var resetButton = panel.querySelector('[data-api-reset]');
              if (!preview || !kindControl || !checkedControl || !disabledControl) return;

              var syncLock = false;

              var readControlValue = function(control) {
                if (!control) return '';
                if (typeof control.value === 'string' && control.value.length > 0) {
                  return control.value;
                }
                return control.getAttribute('value') || '';
              };

              var readControlChecked = function(control) {
                if (!control) return false;
                if (typeof control.checked === 'boolean') return control.checked;
                return control.hasAttribute('checked');
              };

              var setSelectValue = function(control, value) {
                if (!control) return;
                if (typeof control.value === 'string') control.value = value;
                control.setAttribute('value', value);
              };

              var setSwitchState = function(control, checked, disabled) {
                if (!control) return;
                if (typeof control.checked === 'boolean') control.checked = checked;
                if (typeof control.disabled === 'boolean') control.disabled = disabled;
                control.toggleAttribute('checked', checked);
                control.toggleAttribute('disabled', disabled);
              };

              var removeDemoControl = function() {
                preview
                  .querySelectorAll('[slot="control"][data-resource-list-demo-control]')
                  .forEach(function(node) {
                    node.remove();
                  });
              };

              var createDemoControl = function(kind, checked, disabled) {
                var control = null;
                if (kind === 'checkbox') {
                  control = document.createElement('dads-checkbox');
                } else if (kind === 'radio') {
                  control = document.createElement('dads-radio');
                  control.setAttribute('name', 'resource-list-api-control');
                }
                if (!control) return null;

                control.setAttribute('slot', 'control');
                control.setAttribute('data-resource-list-demo-control', '');
                control.toggleAttribute('checked', checked);
                control.toggleAttribute('disabled', disabled);
                if (disabled) control.setAttribute('aria-disabled', 'true');
                else control.removeAttribute('aria-disabled');
                return control;
              };

              var syncDemoControl = function() {
                if (syncLock) return;
                syncLock = true;

                var kind = readControlValue(kindControl) || 'none';
                var hasControl = kind === 'checkbox' || kind === 'radio';
                var checked = readControlChecked(checkedControl);
                var disabled = readControlChecked(disabledControl);

                removeDemoControl();
                if (hasControl) {
                  var control = createDemoControl(kind, checked, disabled);
                  if (control) preview.insertBefore(control, preview.firstChild);
                }

                setSwitchState(checkedControl, hasControl && checked, !hasControl);
                setSwitchState(disabledControl, hasControl && disabled, !hasControl);
                syncLock = false;
              };

              var applyDefaults = function() {
                var defaultKind = kindControl.getAttribute('data-default') || 'none';
                var defaultChecked = checkedControl.getAttribute('data-default') === 'true';
                var defaultDisabled = disabledControl.getAttribute('data-default') === 'true';
                setSelectValue(kindControl, defaultKind);
                setSwitchState(checkedControl, defaultChecked, defaultKind === 'none');
                setSwitchState(disabledControl, defaultDisabled, defaultKind === 'none');
                syncDemoControl();
              };

              var syncLater = function() {
                queueMicrotask(syncDemoControl);
              };

              kindControl.addEventListener('dads-change', syncLater);
              kindControl.addEventListener('change', syncLater);
              checkedControl.addEventListener('dads-change', syncLater);
              checkedControl.addEventListener('change', syncLater);
              disabledControl.addEventListener('dads-change', syncLater);
              disabledControl.addEventListener('change', syncLater);
              if (resetButton) resetButton.addEventListener('click', function() { queueMicrotask(applyDefaults); });

              applyDefaults();
            });
          })();
        </script>
      </section>

      <!-- Figma作例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Figma作例（12692:1434）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          公式作例の文言・組み合わせ（frame/list・control・action・selected）を同構成で再現しています。
        </p>

        <div class="resource-list-example-grid">
          ${renderExampleSections()}
        </div>
      </section>
    </div>
  `;
  },

  chipLabel: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">チップラベル</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム（DADS）HTML版 chip-label.css と同一の見た目になるよう実装したWeb Components版です。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate target-selector="dads-chip-label">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-chip-label variant="filled-outline" color="purple">
              ${CHIP_LABEL_ICON_SVG}
              ラベル
            </dads-chip-label>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-chip-label',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-chip-label data-api-target variant="filled-outline" color="purple">
                  ${CHIP_LABEL_ICON_SVG}
                  ラベル
                </dads-chip-label>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-chip-label variant="filled-outline" color="purple">
                      ${CHIP_LABEL_ICON_SVG}
                      ラベル
                    </dads-chip-label>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>filled-outline</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="variant" data-api-attr="variant" data-default="filled-outline">
                              <option value="text">text</option>
                              <option value="outline">outline</option>
                              <option value="filled-outline" selected>filled-outline</option>
                              <option value="fill">fill</option>
                            </select>
                          </div>
                        </td>
                        <td>見た目</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>color</code></th>
                        <td><code>attr</code></td>
                        <td><code>purple</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="color" data-api-attr="color" data-default="purple">
                              <option value="gray">gray</option>
                              <option value="blue">blue</option>
                              <option value="light-blue">light-blue</option>
                              <option value="cyan">cyan</option>
                              <option value="green">green</option>
                              <option value="lime">lime</option>
                              <option value="yellow">yellow</option>
                              <option value="orange">orange</option>
                              <option value="red">red</option>
                              <option value="magenta">magenta</option>
                              <option value="purple" selected>purple</option>
                            </select>
                          </div>
                        </td>
                        <td>カラーバリエーション</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-chip-label-min-height</code></th>
                        <td><code>--spacing-8</code><br><small class="wc-api-table__meta">(32px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-min-height" value="" data-api-css-var="--dads-chip-label-min-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-border-radius</code></th>
                        <td><code>--spacing-2</code><br><small class="wc-api-table__meta">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-border-radius" value="" data-api-css-var="--dads-chip-label-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-padding-block</code></th>
                        <td><code>3px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-padding-block" value="" data-api-css-var="--dads-chip-label-padding-block" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>上下パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-padding-inline</code></th>
                        <td><code>7px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-padding-inline" value="" data-api-css-var="--dads-chip-label-padding-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-font-size</code></th>
                        <td><code>--font-size-16</code><br><small class="wc-api-table__meta">(16px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-font-size" value="" data-api-css-var="--dads-chip-label-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-font-weight</code></th>
                        <td><code>400</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-font-weight" value="" data-api-css-var="--dads-chip-label-font-weight" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>太さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-label-icon-gap</code></th>
                        <td><code>--spacing-1</code><br><small class="wc-api-table__meta">(4px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-label-icon-gap" value="" data-api-css-var="--dads-chip-label-icon-gap" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコンとテキストの間隔</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-chip-label>ラベル</dads-chip-label>
          <dads-chip-label>
            ${CHIP_LABEL_ICON_SVG}
            ラベル（アイコンあり）
          </dads-chip-label>
        </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">全チップラベル</h3>
        <div style="background: white; border: 1px solid #ddd; border-radius: 12px; padding: 40px;">
          <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: center;">
            ${renderAllChipLabels()}
          </div>
        </div>
      </section>
    </div>

    <script type="module">
      // custom element定義前にプロパティへ触ると、upgrade後に「自前プロパティ」が残り挙動が壊れるため先に読み込む
      await Promise.all([import('dads-chip-label'), import('dads-switch'), import('a11y-annotate')]);
    </script>
  `,

  chipTag: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">チップタグ</h2>
      <p style="color: #666; margin-bottom: 40px;">
        アイテム化した任意の情報を、表示・削除しやすくするための要素です。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- アクセシビリティ注釈 -->
      <section style="margin-bottom: 40px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate target-selector="dads-chip-tag">
          <div style="display: grid; place-content: center; padding: 60px 0;">
            <dads-chip-tag data-chip-tag-lead-target>
              ${CHIP_TAG_ICON_SVG}
              ラベル
            </dads-chip-tag>
          </div>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'dads-chip-tag',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-chip-tag data-api-target value="ラベル" size="md">
                  ${CHIP_TAG_ICON_SVG}
                  ラベル
                </dads-chip-tag>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-chip-tag value="ラベル" size="md">
                      ${CHIP_TAG_ICON_SVG}
                      ラベル
                    </dads-chip-tag>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>action</code></th>
                        <td><code>attr</code></td>
                        <td><code>remove</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="action" data-api-attr="action" data-default="remove">
                              <option value="remove" selected>remove</option>
                              <option value="none">none</option>
                            </select>
                          </div>
                        </td>
                        <td>末尾アクションの表示</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>remove-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>削除</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="remove-label" value="" data-api-attr="remove-label" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>末尾アクションのaria-label</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td><code>ラベル</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="value" value="ラベル" data-api-attr="value" data-default="ラベル"></dads-input-text>
                          </div>
                        </td>
                        <td>任意の値（イベントdetail）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>md</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="md">
                              <option value="sm">sm</option>
                              <option value="md" selected>md</option>
                              <option value="lg">lg</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ（sm / md / lg）</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>lead-icon</code></th>
                        <td><code>demo</code></td>
                        <td><code>dummy</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="lead-icon" data-chip-tag-lead-icon data-default="dummy">
                              <option value="none">none</option>
                              ${CHIP_TAG_ICON_OPTIONS_HTML}
                            </select>
                          </div>
                        </td>
                        <td>リードアイコンの表示</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">Events</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">When</th>
                        <th scope="col">Detail</th>
                        <th scope="col">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><code>dads-chip-tag-remove</code></th>
                        <td><code>action="remove"</code> かつ末尾ボタン押下</td>
                        <td><code>{ label, value, remove() }</code></td>
                        <td>
                          <div>cancelable / bubbles / composed</div>
                          <div><code>event.preventDefault()</code> で自動削除を止められます</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dads-chip-tag-click</code></th>
                        <td><code>action="none"</code> で本体押下</td>
                        <td><code>{ label, value }</code></td>
                        <td>bubbles / composed</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-chip-tag-min-height</code></th>
                        <td><code>--spacing-8</code><br><small class="wc-api-table__meta">(32px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-tag-min-height" value="" data-api-css-var="--dads-chip-tag-min-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>最小高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-tag-border-radius</code></th>
                        <td><code>--border-radius-full</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-tag-border-radius" value="" data-api-css-var="--dads-chip-tag-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>角丸</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-tag-padding-block</code></th>
                        <td><code>--spacing-1</code><br><small class="wc-api-table__meta">(4px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-tag-padding-block" value="" data-api-css-var="--dads-chip-tag-padding-block" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>上下パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-tag-padding-inline</code></th>
                        <td><code>--spacing-2</code><br><small class="wc-api-table__meta">(8px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-tag-padding-inline" value="" data-api-css-var="--dads-chip-tag-padding-inline" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-chip-tag-icon-size</code></th>
                        <td><code>--spacing-6</code><br><small class="wc-api-table__meta">(24px)</small></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-chip-tag-icon-size" value="" data-api-css-var="--dads-chip-tag-icon-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコンサイズ</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <dads-chip-tag>
            ${CHIP_TAG_ICON_SVG}
            ラベル
          </dads-chip-tag>
          <dads-chip-tag action="none">
            ${CHIP_TAG_ICON_SVG}
            クリック可能
          </dads-chip-tag>
        </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">メールアプリの宛先欄（作例）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          <code>commandfor</code> / <code>command</code> を使って、行単位の「すべて削除」を宣言的に接続します。
        </p>
        <div
          style="
            border-top: ${CHIP_TAG_EXAMPLE_SEPARATOR};
            border-bottom: ${CHIP_TAG_EXAMPLE_SEPARATOR};
          "
        >
          <div
            id="mail-to-row"
            data-mail-row
            style="
              ${CHIP_TAG_EXAMPLE_ROW_STYLE}
            "
          >
            <span
              style="
                ${CHIP_TAG_EXAMPLE_LABEL_STYLE}
              "
            >
              宛先
            </span>
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap; justify-content: space-between; width: 100%;">
              <div style="${CHIP_TAG_EXAMPLE_CHIP_LIST_STYLE}">
                ${renderChipTagPersonChip('デジ田 太郎')}
                ${renderChipTagPersonChip('デジ濱 実')}
              </div>
              <dads-button
                variant="outlined"
                size="small"
                commandfor="#mail-to-row"
                command="clear-recipients"
                aria-label="宛先をすべて削除"
              >
                ${MAIL_CLEAR_ICON_SVG}
                すべて削除
              </dads-button>
            </div>
          </div>

          <div
            id="mail-cc-row"
            data-mail-row
            style="
              ${CHIP_TAG_EXAMPLE_ROW_STYLE}
              border-top: ${CHIP_TAG_EXAMPLE_SEPARATOR};
            "
          >
            <span
              style="
                ${CHIP_TAG_EXAMPLE_LABEL_STYLE}
              "
            >
              CC
            </span>
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap; justify-content: space-between; width: 100%;">
              <div style="${CHIP_TAG_EXAMPLE_CHIP_LIST_STYLE}">
                ${renderChipTagPersonChip('デジ山 ひかり')}
              </div>
              <dads-button
                variant="outlined"
                size="small"
                commandfor="#mail-cc-row"
                command="clear-recipients"
                aria-label="CCをすべて削除"
              >
                ${MAIL_CLEAR_ICON_SVG}
                すべて削除
              </dads-button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <script>
      (function() {
        var currentScript = document.currentScript;
        Promise.all([
          customElements.whenDefined('dads-chip-tag'),
          customElements.whenDefined('dads-switch'),
          customElements.whenDefined('a11y-annotate'),
        ]).then(function() {
          var root = currentScript?.parentElement;
          if (!root) return;

          import('./packages/utils/command-store.js').then(function(mod) {
            if (mod && mod.defaultCommandStore && mod.defaultCommandStore.bind) {
              mod.defaultCommandStore.bind(root);

              if (!root.hasAttribute('data-command-store-mail-demo')) {
                root.setAttribute('data-command-store-mail-demo', 'true');
                if (mod.defaultCommandStore.on) {
                  mod.defaultCommandStore.on('clear-recipients', function(detail) {
                    var target = detail && detail.target;
                    if (!target) return;
                    var chips = target.querySelectorAll('dads-chip-tag');
                    for (var i = 0; i < chips.length; i++) {
                      chips[i].dispatchEvent(new CustomEvent('dads-command', {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                        detail: {
                          command: 'remove',
                          invoker: detail.invoker,
                          target: chips[i],
                          value: null,
                          originalEvent: detail.originalEvent || null,
                        },
                      }));
                    }
                  });
                }
              }
            }
          }).catch(function() {});

          var preview = root.querySelector('dads-chip-tag[data-api-target]');
          var annotateTarget = root.querySelector('dads-chip-tag[data-chip-tag-lead-target]');
          var select = root.querySelector('[data-chip-tag-lead-icon]');
          var iconMap = ${JSON.stringify(CHIP_TAG_ICON_MAP)};
          var targets = [preview, annotateTarget].filter(Boolean);
          if (targets.length > 0 && select) {
            var defaultValue = select.getAttribute('data-default') || 'dummy';
            var syncIcon = function() {
              var value = select.value;
              for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                if (!target) continue;
                var existing = target.querySelector('[slot=\"start-icon\"]');
                if (existing) existing.remove();
                if (value === 'none') continue;
                var svg = iconMap[value];
                if (!svg) continue;
                var wrapper = document.createElement('span');
                wrapper.innerHTML = svg;
                var icon = wrapper.querySelector('[slot=\"start-icon\"]');
                if (icon) target.prepend(icon);
              }
            };
            select.addEventListener('change', syncIcon);
            var resetButton = root.querySelector('[data-api-reset]');
            if (resetButton) {
              resetButton.addEventListener('click', function() {
                select.value = defaultValue;
                syncIcon();
              });
            }
            syncIcon();
          }
        });
      })();
    </script>
  `,


  table: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">テーブル／データテーブル</h2>
      <p style="color: #666; margin-bottom: 40px;">
        ネイティブの&lt;table&gt;をそのまま使い、DADS準拠の見た目とページ利用時の利便性（水平スクロール、行選択、ソートUI）を提供します。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- 基本 -->
      <section class="table-annotate-basic" style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">基本</h3>

        <a11y-annotate target-selector="dads-table">
          <dads-table hover>
            <table>
              <caption>テーブルタイトル</caption>
              <thead>
                <tr>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ1</td>
                  <td>データ2</td>
                  <td>データ3</td>
                </tr>
                <tr>
                  <td>データ4</td>
                  <td>データ5</td>
                  <td>データ6</td>
                </tr>
              </tbody>
            </table>
          </dads-table>

          <style>
            .table-annotate-basic a11y-annotate {
              display: block;
              --a11y-annotate-preview-min-height: 360px;
            }
          </style>
        </a11y-annotate>
      </section>

      <!-- データテーブル（行選択 + ソート + ストライプ） -->
      <section class="table-annotate-section" style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">データテーブル（行選択・ソート）</h3>

        <a11y-annotate target-selector="dads-table">
          <dads-table selectable striped hover sort-behavior="dom">
            <table>
              <caption>利用者一覧</caption>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" data-select-all aria-label="すべて選択" />
                  </th>
                  <th scope="col" data-column="id">
                    <button type="button" data-sort>利用者ID</button>
                  </th>
                  <th scope="col" data-column="name">
                    <button type="button" data-sort>氏名</button>
                  </th>
                  <th scope="col">電話番号</th>
                  <th scope="col" data-column="createdAt" data-sort-type="date">
                    <button type="button" data-sort>登録日</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr data-row-id="A003">
                  <td><input type="checkbox" data-select-row aria-label="行を選択: A003" /></td>
                  <td>A003</td>
                  <td>鈴木 次郎</td>
                  <td>03-9999-0000</td>
                  <td>2026-01-03</td>
                </tr>
                <tr data-row-id="A001">
                  <td><input type="checkbox" data-select-row aria-label="行を選択: A001" /></td>
                  <td>A001</td>
                  <td>山田 太郎</td>
                  <td>03-1234-5678</td>
                  <td>2026-01-01</td>
                </tr>
                <tr data-row-id="A002">
                  <td><input type="checkbox" data-select-row aria-label="行を選択: A002" /></td>
                  <td>A002</td>
                  <td>佐藤 花子</td>
                  <td>03-2222-3333</td>
                  <td>2026-01-02</td>
                </tr>
              </tbody>
            </table>
          </dads-table>

          <style>
            .table-annotate-section a11y-annotate {
              display: block;
              /* プレビュー領域を広げる */
              --a11y-annotate-preview-min-height: 520px;
            }

            .table-annotate-section dads-table {
              max-width: 1100px;
            }
          </style>
        </a11y-annotate>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; overflow-x: auto;">
                <dads-table data-api-target selectable striped hover sort-behavior="dom">
                  <table style="min-width: 520px;">
                    <caption>利用者一覧（サンプル）</caption>
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" data-select-all aria-label="すべて選択" />
                        </th>
                        <th scope="col" data-column="id">
                          <button type="button" data-sort>利用者ID</button>
                        </th>
                        <th scope="col" data-column="name">
                          <button type="button" data-sort>氏名</button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr data-row-id="A001">
                        <td><input type="checkbox" data-select-row aria-label="行を選択: A001" /></td>
                        <td>A001</td>
                        <td>山田 太郎</td>
                      </tr>
                      <tr data-row-id="A002">
                        <td><input type="checkbox" data-select-row aria-label="行を選択: A002" /></td>
                        <td>A002</td>
                        <td>佐藤 花子</td>
                      </tr>
                      <tr data-row-id="A003">
                        <td><input type="checkbox" data-select-row aria-label="行を選択: A003" /></td>
                        <td>A003</td>
                        <td>鈴木 次郎</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-table selectable striped hover sort-behavior="dom">
                      <table>
                        <caption>利用者一覧（サンプル）</caption>
                        <thead>
                          <tr>
                            <th>
                              <input type="checkbox" data-select-all aria-label="すべて選択" />
                            </th>
                            <th scope="col" data-column="id">
                              <button type="button" data-sort>利用者ID</button>
                            </th>
                            <th scope="col" data-column="name">
                              <button type="button" data-sort>氏名</button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr data-row-id="A001">
                            <td><input type="checkbox" data-select-row aria-label="行を選択: A001" /></td>
                            <td>A001</td>
                            <td>山田 太郎</td>
                          </tr>
                          <tr data-row-id="A002">
                            <td><input type="checkbox" data-select-row aria-label="行を選択: A002" /></td>
                            <td>A002</td>
                            <td>佐藤 花子</td>
                          </tr>
                          <tr data-row-id="A003">
                            <td><input type="checkbox" data-select-row aria-label="行を選択: A003" /></td>
                            <td>A003</td>
                            <td>鈴木 次郎</td>
                          </tr>
                        </tbody>
                      </table>
                    </dads-table>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>hover</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="hover" data-api-attr="hover" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>行ホバー</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>striped</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="striped" data-api-attr="striped" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>交互行背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>selectable</code></th>
                        <td><code>attr</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="selectable" data-api-attr="selectable" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>行選択</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>sort-behavior</code></th>
                        <td><code>attr</code></td>
                        <td><code>dom</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="sort-behavior" data-api-attr="sort-behavior" data-default="dom">
                              <option value="">（unset）</option>
                              <option value="dom" selected>dom</option>
                            </select>
                          </div>
                        </td>
                        <td>ソート挙動</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="">
                              <option value="" selected>default</option>
                              <option value="sm">sm</option>
                              <option value="dense">dense</option>
                            </select>
                          </div>
                        </td>
                        <td>密度（padding/line-height）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-table-header-background</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-header-background" value="" data-api-css-var="--dads-table-header-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ヘッダー背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-border-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-border-color" value="" data-api-css-var="--dads-table-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ボーダー色</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-row-background-hover</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-row-background-hover" value="" data-api-css-var="--dads-table-row-background-hover" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ホバー背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-cell-padding-x</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-cell-padding-x" value="" data-api-css-var="--dads-table-cell-padding-x" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>左右パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-cell-padding-y</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-cell-padding-y" value="" data-api-css-var="--dads-table-cell-padding-y" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>上下パディング</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-table-font-size</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-table-font-size" value="" data-api-css-var="--dads-table-font-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>文字サイズ</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <!-- オーバーフロー（横スクロール） -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">オーバーフロー（横スクロール）</h3>
        <div style="max-width: 520px; border: 1px dashed #ccc; padding: 16px;">
          <dads-table hover>
            <table>
              <caption>横幅が足りない場合の例</caption>
              <thead>
                <tr>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                  <th scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
              </tbody>
            </table>
          </dads-table>
        </div>
      </section>

      <!-- DADS公式（HTML Storybook）作例 -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">DADS公式（HTML Storybook）作例</h3>
        <p style="color: #666; margin-bottom: 0;">
          公式のHTML作例（<code>.dads-table</code> / <code>data-*</code> 属性 / <code>data-js-*</code> セレクタ）を
          <code>&lt;dads-table&gt;</code> の中へ貼り付けて動作する形で網羅しています。
        </p>
      </section>

      <!-- Playground -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Playground</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table">
              <thead>
${dadsHeaderRow(4)}
              </thead>
              <tbody>
${dadsDataRows(4, 4)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Plain -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Plain</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table">
              <tbody>
${dadsDataRows(4, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- First Row As Header Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">First Row As Header Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody data-cell-border="bottom">
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- First Column As Header Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">First Column As Header Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-cell-border="right">
              <tbody>
${dadsRowHeaderRows(4, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- First Row And Column As Header Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">First Row And Column As Header Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
                <tr>
                  <td data-bg="solid-gray-100" data-border="right"></td>
${dadsColHeaderLines(5)}
                </tr>
              </thead>
              <tbody>
${dadsRowHeaderRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Condensed Table -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Condensed Table</h3>
        <dads-table>
          <div class="dads-table" data-size="dense">
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Border On Row And Column -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Border On Row And Column</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-border="hidden" data-cell-border>
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Table Header With Colspan -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Table Header With Colspan</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-border data-cell-border="bottom">
              <thead data-cell-border="right">
                <tr>
${repeatLines(dadsColHeaderLine("親ラベル", 'colspan="3"'), 2)}
                </tr>
                <tr>
${dadsColHeaderLines(6, "子ラベル")}
                </tr>
              </thead>
              <tbody>
${dadsDataRows(3, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Table Header With Rowspan -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Table Header With Rowspan</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-border data-cell-border="bottom">
              <tbody>
                <tr>
                  <th class="dads-table__row-header" scope="row" rowspan="2" data-border="right">親ラベル</th>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
                <tr>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
                <tr>
                  <th class="dads-table__row-header" scope="row" rowspan="2" data-border="right">親ラベル</th>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
                <tr>
                  <th class="dads-table__row-header" scope="row">子ラベル</th>
${dadsDataCellLines(4)}
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Indented Rows -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Indented Rows</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-cell-border="bottom">
              <col style="width: calc(32 / 16 * 1rem);">
              <thead>
                <tr>
                  <td class="dads-table__col-header"></td>
                  <td class="dads-table__col-header"></td>
                  <th class="dads-table__col-header" scope="col">代表者名</th>
                  <th class="dads-table__col-header" scope="col">電話番号</th>
                  <th class="dads-table__col-header" scope="col">住所</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" colspan="2">東京本社</th>
                  <td>山田太郎</td>
                  <td>03-1234-5678</td>
                  <td>東京都新宿区1-2-3</td>
                </tr>
                <tr>
                  <th scope="row"><span class="dads-u-visually-hidden">東京本社</span></th>
                  <th scope="row">営業部</th>
                  <td>佐藤花子</td>
                  <td>03-2345-6789</td>
                  <td>東京都渋谷区4-5-6</td>
                </tr>
                <tr>
                  <th scope="row"><span class="dads-u-visually-hidden">東京本社</span></th>
                  <th scope="row">開発部</th>
                  <td>鈴木一郎</td>
                  <td>03-3456-7890</td>
                  <td>東京都港区7-8-9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Stripe Table -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Stripe Table</h3>
        <dads-table>
          <div class="dads-table" data-row-stripe>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(6, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Highlight Hovered Row -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Highlight Hovered Row</h3>
        <dads-table>
          <div class="dads-table" data-row-stripe data-row-hover-highlight>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
${dadsHeaderRow(6)}
              </thead>
              <tbody>
${dadsDataRows(6, 6)}
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Selectable Table -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Selectable Table</h3>
        <dads-table>
          <div class="dads-table" data-size="dense" data-selectable data-js-indeterminate-example>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
                <tr>
                  <th class="dads-table__col-header" scope="col">
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" aria-label="行を選択" aria-description="すべての行を選択する" data-js-check-all>
                      </span>
                    </label>
                  </th>
                  <th class="dads-table__col-header" scope="col">タイトル</th>
                  <th class="dads-table__col-header" scope="col">状態</th>
                  <th class="dads-table__col-header" scope="col">コメント数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" aria-labelledby="selectable-table-title-1" data-js-check>
                      </span>
                    </label>
                  </td>
                  <td id="selectable-table-title-1">記事タイトル1</td>
                  <td>公開中</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" checked aria-labelledby="selectable-table-title-2" data-js-check>
                      </span>
                    </label>
                  </td>
                  <td id="selectable-table-title-2">記事タイトル2</td>
                  <td>下書き</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>
                    <label class="dads-checkbox" data-size="sm">
                      <span class="dads-checkbox__checkbox">
                        <input class="dads-checkbox__input" type="checkbox" aria-labelledby="selectable-table-title-3" data-js-check>
                      </span>
                    </label>
                  </td>
                  <td id="selectable-table-title-3">記事タイトル3</td>
                  <td>非公開</td>
                  <td>3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Sortable Header -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Sortable Header</h3>
        <dads-table sort-behavior="dom">
          <div class="dads-table" data-js-sortable-table>
            <table class="dads-table__table" data-border data-cell-border>
              <thead>
                <tr>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="number">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                      <button class="dads-table__action" type="button" aria-haspopup="true">
                        <svg class="dads-table__action-svg" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="img" aria-label="列メニュー">
                          <circle cx="12" cy="4.5" r="1.5"/>
                          <circle cx="12" cy="12" r="1.5"/>
                          <circle cx="12" cy="19.5" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="date">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>記事タイトルA</td>
                  <td>10</td>
                  <td>2026-01-03</td>
                  <td>公開中</td>
                  <td>担当C</td>
                </tr>
                <tr>
                  <td>記事タイトルB</td>
                  <td>2</td>
                  <td>2026-01-01</td>
                  <td>下書き</td>
                  <td>担当A</td>
                </tr>
                <tr>
                  <td>記事タイトルC</td>
                  <td>30</td>
                  <td>2026-01-02</td>
                  <td>非公開</td>
                  <td>担当B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Sortable Header Dense -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Sortable Header Dense</h3>
        <dads-table sort-behavior="dom">
          <div class="dads-table" data-size="dense" data-js-sortable-table>
            <table class="dads-table__table" data-border data-cell-border>
              <thead>
                <tr>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="number">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.12L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM14 8.92L11.73 11L9 8.52V20H6V8.52L3.27 11L1 8.93L7.5 3L14 8.93Z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                      <button class="dads-table__action" type="button" aria-haspopup="true">
                        <svg class="dads-table__action-svg" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" role="img" aria-label="列メニュー">
                          <circle cx="12" cy="4.5" r="1.5"/>
                          <circle cx="12" cy="12" r="1.5"/>
                          <circle cx="12" cy="19.5" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header data-sort-type="date">
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                  <th class="dads-table__sort-header" scope="col" data-js-sort-header>
                    <div class="dads-table__sort-inner">
                      <div class="dads-table__sort-label">
                        <button class="dads-table__sort-button" data-js-sort>
                          ラベル
                          <span class="dads-table__sort-icon">
                            <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                              <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>記事タイトルA</td>
                  <td>10</td>
                  <td>2026-01-03</td>
                  <td>公開中</td>
                  <td>担当C</td>
                </tr>
                <tr>
                  <td>記事タイトルB</td>
                  <td>2</td>
                  <td>2026-01-01</td>
                  <td>下書き</td>
                  <td>担当A</td>
                </tr>
                <tr>
                  <td>記事タイトルC</td>
                  <td>30</td>
                  <td>2026-01-02</td>
                  <td>非公開</td>
                  <td>担当B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- Linked Text In Cell -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Linked Text In Cell</h3>
        <dads-table>
          <div class="dads-table">
            <table class="dads-table__table" data-width="full" data-layout="fixed" data-cell-border="bottom">
              <thead>
                <tr>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a class="dads-link" href="#">デジタル庁</a></td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>
                    <ul class="dads-list">
                      <li class="dads-list__item"><a class="dads-link" href="#">デジタル庁</a></li>
                      <li class="dads-list__item"><a class="dads-link" href="#">デジタル庁デザインシステム</a></li>
                    </ul>
                  </td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </dads-table>
      </section>

      <!-- With Caption -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">With Caption</h3>
        <dads-table>
          <figure class="dads-table">
            <figcaption class="dads-table__caption">表1: テーブルキャプション</figcaption>
            <table class="dads-table__table" data-cell-border="bottom">
              <thead>
                <tr>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                  <th class="dads-table__col-header" scope="col">ラベル</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
                <tr>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                  <td>データ</td>
                </tr>
              </tbody>
            </table>
          </figure>
        </dads-table>
      </section>

      <!-- Overflow On Mobile -->
      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Overflow On Mobile</h3>
        <div style="max-width: 520px; border: 1px dashed #ccc; padding: 16px;">
          <dads-table>
            <div class="dads-table">
              <table class="dads-table__table" data-cell-border="bottom" style="min-width: calc(640 / 16 * 1rem);">
                <thead>
                  <tr>
                    <th class="dads-table__col-header" scope="col" style="width: 25%;">項目</th>
                    <th class="dads-table__col-header" scope="col">例</th>
                    <th class="dads-table__col-header" scope="col">説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>チャネルの種類</td>
                    <td>オンラインポータル、電話サポート、メール窓口、情報パンフ、動画案内、SNSアカウント、イベント告知、FAQページ</td>
                    <td>市民は自分に適した手段で情報取得やサービス利用が可能で、行政も効果的なコミュニケーションとサポートを提供できます</td>
                  </tr>
                  <tr>
                    <td>プロバイダー</td>
                    <td>光ファイバー、DSL、ケーブル、ワイヤレスなど</td>
                    <td>ユーザーは異なるプロバイダータイプから、自分のニーズに合った高速インターネット接続を選択できます</td>
                  </tr>
                  <tr>
                    <td>サービスを提供する地域</td>
                    <td>
                      <ol class="dads-list">
                        <li class="dads-list__item">りんご区</li>
                        <li class="dads-list__item">みかん区</li>
                        <li class="dads-list__item">ぶどう区</li>
                        <li class="dads-list__item">いちご区</li>
                        <li class="dads-list__item">なし区</li>
                      </ol>
                    </td>
                    <td>特有のニーズに応えながら、高品質かつ効率的なサポートを目指しています。地元のコミュニティと密接に連携し、信頼性とアクセシビリティを大切にしています。</td>
                  </tr>
                  <tr>
                    <td>チャネルアイコン</td>
                    <td>テレビ、ラジオ、スマートフォン、パソコン、ニュース、ゲーム、料理、アート、音楽、カメラ</td>
                    <td>これらのアイコンは利用者が興味を持ちそうなチャンネルを素早く特定し、アクセスしやすくするのに役立ちます。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </dads-table>
        </div>
      </section>
    </div>
  `,

  notificationBanner: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">ノティフィケーションバナー</h2>
      <p style="color: var(--color-neutral-solid-gray-700, #4d4d4d); margin-bottom: 32px;">
        DADS仕様（type/variant/close/actions）の通知バナー。重要度の高い情報をページ内で提示します。
      </p>

      ${renderAnnotationToggleBlock()}

      <section style="margin-bottom: 48px;">
        ${renderA11ySectionHeader()}
        <a11y-annotate
          target-selector="dads-notification-banner"
          style="
            --a11y-annotate-callout-gutter: clamp(4rem, 10vw, 7rem);
            --a11y-annotate-callout-lane-offset: 40px;
          "
        >
          <div style="padding: 60px 0;">
            <div style="max-width: 880px; margin: 0 auto;">
              <dads-notification-banner type="info-2" variant="standard" dismissible close-label="閉じる">
                <span slot="title">バナータイトル</span>
                <time slot="meta" datetime="2024-07-01">年月日</time>
                <p>バナーデスクリプション</p>
                <dads-button slot="actions" variant="solid" size="medium">ボタン</dads-button>
              </dads-notification-banner>
            </div>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">API / 操作</h3>
        ${renderApiPanelWrapper({
          imports: [
            'dads-notification-banner',
            'dads-button',
            'dads-input-text',
            'dads-switch',
            'dads-select',
            'dads-table',
            'dads-code-block',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed var(--color-neutral-solid-gray-200, #cccccc); border-radius: 12px;">
                <dads-notification-banner data-api-target type="info-1" variant="standard" dismissible close-label="閉じる" actions-layout="horizontal">
                  <span slot="title" data-api-copy="title">登録期間が延長されました</span>
                  <time slot="meta" datetime="2024-07-01" data-api-copy="meta">2024年7月1日</time>
                  <p data-api-copy="description">期限が延長されたため、期日までに必要な手続きを行ってください。</p>
                  <dads-button slot="actions" variant="outlined" size="medium" data-api-copy="secondary-action">対象を確認</dads-button>
                  <dads-button slot="actions" variant="solid" size="medium" data-api-copy="primary-action">手続きを進める</dads-button>
                </dads-notification-banner>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-notification-banner type="info-1" variant="standard" dismissible actions-layout="horizontal">
                      <span slot="title">登録期間が延長されました</span>
                      <time slot="meta" datetime="2024-07-01">2024年7月1日</time>
                      <p>期限が延長されたため、期日までに必要な手続きを行ってください。</p>
                      <dads-button slot="actions" variant="outlined">対象を確認</dads-button>
                      <dads-button slot="actions" variant="solid">手続きを進める</dads-button>
                    </dads-notification-banner>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>type</code></th>
                        <td><code>attr</code></td>
                        <td><code>'success' | 'error' | 'warning' | 'info-1' | 'info-2'</code></td>
                        <td><code>info-1</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="type" size="md 240" value="info-1" data-api-attr="type" data-default="info-1">
                              <option value="success">サクセス（success）</option>
                              <option value="error">エラー（error）</option>
                              <option value="warning">警告（warning）</option>
                              <option value="info-1">情報提示 1（info-1）</option>
                              <option value="info-2">情報提示 2（info-2）</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>通知の意味タイプ</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>variant</code></th>
                        <td><code>attr</code></td>
                        <td><code>'standard' | 'color-chip'</code></td>
                        <td><code>standard</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="variant" size="md 240" value="standard" data-api-attr="variant" data-default="standard">
                              <option value="standard">standard</option>
                              <option value="color-chip">color-chip</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>表示スタイル</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dismissible</code></th>
                        <td><code>attr</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="dismissible" size="md 240" value="" data-api-attr="dismissible" data-default="">
                              <option value="">false</option>
                              <option value="true">true</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>閉じるボタンの表示</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dense</code></th>
                        <td><code>attr</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="dense" size="md 240" value="" data-api-attr="dense" data-default="">
                              <option value="">false</option>
                              <option value="true">true</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>省スペース表示（モバイル向け）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>close-style</code></th>
                        <td><code>attr</code></td>
                        <td><code>'default' | 'compact'</code></td>
                        <td><code>default</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="close-style" size="md 240" value="default" data-api-attr="close-style" data-default="default">
                              <option value="default">default</option>
                              <option value="compact">compact</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>閉じるボタン見た目</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>actions-layout</code></th>
                        <td><code>attr</code></td>
                        <td><code>'vertical' | 'horizontal'</code></td>
                        <td><code>horizontal</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="actions-layout" size="md 240" value="horizontal" data-api-attr="actions-layout" data-default="horizontal">
                              <option value="vertical">vertical（垂直）</option>
                              <option value="horizontal">horizontal（水平）</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>アクションボタンの並び方向（垂直/水平）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>interaction</code></th>
                        <td><code>attr</code></td>
                        <td><code>'none' | 'title-and-actions' | 'whole' | 'actions-only'</code></td>
                        <td><code>none</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="interaction" size="md 240" value="none" data-api-attr="interaction" data-default="none">
                              <option value="none">none</option>
                              <option value="title-and-actions">title-and-actions</option>
                              <option value="whole">whole</option>
                              <option value="actions-only">actions-only</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>リンク委譲領域</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>dismiss-mode</code></th>
                        <td><code>attr</code></td>
                        <td><code>'hide' | 'collapse'</code></td>
                        <td><code>hide</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="dismiss-mode" size="md 240" value="hide" data-api-attr="dismiss-mode" data-default="hide">
                              <option value="hide">hide</option>
                              <option value="collapse">collapse</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>閉じる押下時の挙動</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>close-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>閉じる</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="close-label" value="閉じる" data-api-attr="close-label" data-default="閉じる"></dads-input-text>
                          </div>
                        </td>
                        <td>閉じるラベル</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>restore-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>再表示</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="restore-label" value="再表示" data-api-attr="restore-label" data-default="再表示"></dads-input-text>
                          </div>
                        </td>
                        <td>再表示ボタンラベル（dismiss-mode=&quot;collapse&quot;時）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-notification-banner-border-color</code></th>
                        <td><code>(type依存)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-notification-banner-border-color" value="" data-api-css-var="--dads-notification-banner-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>外枠色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-notification-banner-background</code></th>
                        <td><code>#fff</code></td>
                        <td>
                          <div class="wc-api-control">
                            <div style="display: grid; gap: 8px;">
                              <dads-select
                                label="背景色プリセット"
                                size="md 240"
                                value=""
                                data-api-css-var="--dads-notification-banner-background"
                                data-default=""
                              >
                                <option value="">デフォルト（トークン）</option>
                                <option value="var(--color-primitive-green-50, #e6f5ec)">サクセス（淡色）</option>
                                <option value="var(--color-primitive-red-50, #fdeeee)">エラー（淡色）</option>
                                <option value="var(--color-primitive-yellow-50, #fbf5e0)">警告（淡色）</option>
                                <option value="var(--color-primitive-blue-50, #e8f1fe)">情報提示 1（淡色）</option>
                                <option value="var(--color-neutral-solid-gray-50, #f2f2f2)">情報提示 2（淡色）</option>
                              </dads-select>
                              <dads-input-text label="--dads-notification-banner-background" value="" data-api-css-var="--dads-notification-banner-background" data-default=""></dads-input-text>
                            </div>
                          </div>
                        </td>
                        <td>背景色（プリセットまたは直接入力）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-notification-banner-title-color</code></th>
                        <td><code>#1a1a1a</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-notification-banner-title-color" value="" data-api-css-var="--dads-notification-banner-title-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>タイトル文字色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-notification-banner-action-color</code></th>
                        <td><code>(type依存)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-notification-banner-action-color" value="" data-api-css-var="--dads-notification-banner-action-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アクション色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">Standard（Desktop）</h3>
        <div style="display: grid; gap: 16px;">
          ${renderNotificationBannerDemoItems({ variant: 'standard' })}
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">Color Chip（Desktop）</h3>
        <div style="display: grid; gap: 16px;">
          ${renderNotificationBannerDemoItems({ variant: 'color-chip' })}
        </div>
      </section>

      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">背景色を使用した作例</h3>
        <p style="font-size: 14px; line-height: 1.7; color: var(--color-neutral-solid-gray-800, #333333); margin: 0 0 16px;">
          type を切り替えると、作例のタイトル・説明・背景色が連動して更新されます。
        </p>
        <div style="margin: 0 0 16px;">
          <dads-select
            label="タイプ"
            size="md 240"
            value="success"
            data-background-demo-type
          >
            <option value="success">サクセス</option>
            <option value="error">エラー</option>
            <option value="warning">警告</option>
            <option value="info-1">情報提示 1</option>
            <option value="info-2">情報提示 2</option>
          </dads-select>
        </div>
        <div style="box-shadow: 0 0 0 1px var(--color-neutral-solid-gray-420, #949494); background: var(--color-neutral-white, #ffffff); padding: clamp(20px, 4vw, 48px);">
          <div style="display: grid; gap: 24px; max-width: 860px; margin: 0 auto;">
            <dads-notification-banner
              data-background-demo-banner
              type="success"
              variant="standard"
              style="--dads-notification-banner-background: var(--color-primitive-green-50, #e6f5ec);"
            >
              <span slot="title" data-background-demo-title>登録手続きは全て完了しました</span>
              <p data-background-demo-description>ダミーテキストは、デザインの作成時に使用される仮の文章です。</p>
            </dads-notification-banner>

            <dads-notification-banner
              data-background-demo-banner
              type="success"
              variant="color-chip"
              style="--dads-notification-banner-background: var(--color-primitive-green-50, #e6f5ec);"
            >
              <span slot="title" data-background-demo-title>登録手続きは全て完了しました</span>
              <p data-background-demo-description>ダミーテキストは、デザインの作成時に使用される仮の文章です。</p>
            </dads-notification-banner>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">特定のコンテンツに付随する場合の作例</h3>
        <p style="font-size: 14px; line-height: 1.7; color: var(--color-neutral-solid-gray-800, #333333); margin: 0 0 24px;">
          ノティフィケーションバナーが特定のコンテンツに付随する場合はそのコンテンツセクション内に配置される場合があります。これにより、通知が必要となる情報の単位ごとに、的確な告知が可能となります。
        </p>

        <div style="box-shadow: 0 0 0 1px var(--color-neutral-solid-gray-420, #949494); background: var(--color-neutral-solid-gray-50, #f2f2f2); padding: clamp(20px, 4vw, 40px);">
          <div data-attached-notification-demo style="max-width: 360px; width: 100%;">
            <article data-attached-demo-panel="single" style="background: var(--color-neutral-white, #ffffff); border: 1px solid var(--color-neutral-solid-gray-500, #7f7f7f); padding: 16px;">
              <div style="height: 38px; border-radius: 8px; background: var(--color-neutral-solid-gray-100, #e6e6e6); margin-bottom: 16px;"></div>
              <h4 style="font-size: 18px; margin: 0 0 12px; line-height: 1.4;">〇〇の利用に関して</h4>
              <ul style="margin: 0 0 16px; padding-left: 20px; line-height: 1.7;">
                <li>コピー、出版、配布、送信する。</li>
                <li>編集する。</li>
                <li>商業的および非商業的に利用する。</li>
              </ul>

              <dads-notification-banner data-attached-before-banner data-mobile-demo type="warning" variant="standard" dismissible close-style="compact">
                <span slot="title">ご利用には出典やクレジットの記載が必要となりました</span>
                <p>全ての利用において、出典やクレジットを記載することが必要となりました。これに従わない場合、付与されたライセンスの権利は自動的に終了します。</p>
                <dads-button slot="actions" variant="solid" size="small" data-attached-ack>了解しました</dads-button>
              </dads-notification-banner>

              <dads-notification-banner data-attached-after-banner data-mobile-demo type="warning" variant="standard" hidden>
                <span slot="title">ご利用には出典やクレジットの記載が必要となりました</span>
              </dads-notification-banner>

              <h4 style="font-size: 18px; margin: 16px 0 8px; line-height: 1.4;">ライセンスが適用されない場合</h4>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.7;">
                <li>素材を独立したファイルとして配布する場合</li>
                <li>素材自体を商品として再販売する場合</li>
              </ul>
            </article>
          </div>
        </div>

        <p style="font-size: 14px; line-height: 1.7; color: var(--color-neutral-solid-gray-800, #333333); margin: 24px 0 0;">
          この作例では「了解しました」または「閉じる」を押下すると、同一コンテンツ内で詳細表示から簡易表示へ実際に切り替わります。
        </p>
        <p style="margin: 12px 0 0;">
          <dads-button variant="outlined" size="small" data-attached-demo-reset>作例を初期状態に戻す</dads-button>
        </p>
      </section>
    </div>

    <script>
      (function() {
        var currentScript = document.currentScript;
        customElements.whenDefined('dads-notification-banner').then(function() {
          var root = currentScript?.parentElement;
          if (!root || !root.isConnected) return;

          var query = function(selector, parent) {
            var scope = parent || root;
            return scope ? scope.querySelector(selector) : null;
          };
          var queryAll = function(selector, parent) {
            var scope = parent || root;
            return scope ? scope.querySelectorAll(selector) : [];
          };
          var addValueChangeListeners = function(control, handler) {
            if (!control) return;
            control.addEventListener('dads-change', handler);
            control.addEventListener('change', handler);
          };
          var readControlValue = function(control, fallback) {
            if (!control) return fallback;
            if (typeof control.value === 'string' && control.value.length > 0) {
              return control.value;
            }
            var attrValue = control.getAttribute('value');
            return attrValue || fallback;
          };

          var preview = query('dads-notification-banner[data-api-target]');
          if (!preview) return;

          var copyByType = ${JSON.stringify(NOTIFICATION_BANNER_API_COPY)};
          var copyTargets = {
            title: query('[data-api-copy="title"]', preview),
            meta: query('[data-api-copy="meta"]', preview),
            description: query('[data-api-copy="description"]', preview),
            secondaryAction: query('[data-api-copy="secondary-action"]', preview),
            primaryAction: query('[data-api-copy="primary-action"]', preview),
          };

          var resolveCopy = function(typeValue) {
            if (typeof typeValue !== 'string') return copyByType['info-1'];
            return copyByType[typeValue] || copyByType['info-1'];
          };

          var syncCopyByType = function() {
            var copy = resolveCopy(preview.getAttribute('type'));
            if (copyTargets.title) copyTargets.title.textContent = copy.title;
            if (copyTargets.meta) copyTargets.meta.textContent = copy.meta;
            if (copyTargets.description) copyTargets.description.textContent = copy.description;
            if (copyTargets.secondaryAction) copyTargets.secondaryAction.textContent = copy.secondaryAction;
            if (copyTargets.primaryAction) copyTargets.primaryAction.textContent = copy.primaryAction;
          };

          var observer = new MutationObserver(function(records) {
            for (var index = 0; index < records.length; index += 1) {
              var record = records[index];
              if (record.type === 'attributes' && record.attributeName === 'type') {
                syncCopyByType();
                return;
              }
            }
          });
          observer.observe(preview, { attributes: true, attributeFilter: ['type'] });

          var resetButton = query('[data-api-reset]');
          if (resetButton) {
            resetButton.addEventListener('click', function() {
              queueMicrotask(syncCopyByType);
            });
          }

          var backgroundTypeSelect = query('[data-background-demo-type]');
          var backgroundBanners = queryAll('dads-notification-banner[data-background-demo-banner]');
          var backgroundTitles = queryAll('[data-background-demo-title]');
          var backgroundDescriptions = queryAll('[data-background-demo-description]');
          var backgroundCopyByType = ${JSON.stringify(NOTIFICATION_BANNER_BACKGROUND_COPY)};
          var backgroundColorByType = {
            success: 'var(--color-primitive-green-50, #e6f5ec)',
            error: 'var(--color-primitive-red-50, #fdeeee)',
            warning: 'var(--color-primitive-yellow-50, #fbf5e0)',
            'info-1': 'var(--color-primitive-blue-50, #e8f1fe)',
            'info-2': 'var(--color-neutral-solid-gray-50, #f2f2f2)',
          };

          var syncBackgroundDemo = function() {
            var selectedType = readControlValue(backgroundTypeSelect, 'success');
            var copy = backgroundCopyByType[selectedType] || backgroundCopyByType['info-1'];
            var backgroundColor = backgroundColorByType[selectedType] || backgroundColorByType['info-1'];

            backgroundBanners.forEach(function(banner) {
              banner.setAttribute('type', selectedType);
              banner.style.setProperty('--dads-notification-banner-background', backgroundColor);
            });
            backgroundTitles.forEach(function(title) {
              title.textContent = copy.title;
            });
            backgroundDescriptions.forEach(function(description) {
              description.textContent = copy.description;
            });
          };

          addValueChangeListeners(backgroundTypeSelect, syncBackgroundDemo);

          var attachedDemo = query('[data-attached-notification-demo]');
          if (attachedDemo) {
            var beforeBanner = query('dads-notification-banner[data-attached-before-banner]', attachedDemo);
            var afterBanner = query('dads-notification-banner[data-attached-after-banner]', attachedDemo);
            var ackButton = query('[data-attached-ack]', attachedDemo);
            var attachedResetButton = query('[data-attached-demo-reset]');

            var activateAfterState = function() {
              if (beforeBanner) beforeBanner.hidden = true;
              if (afterBanner) afterBanner.hidden = false;
            };

            var resetAttachedState = function() {
              if (beforeBanner) {
                beforeBanner.hidden = false;
                beforeBanner.removeAttribute('data-dismissed');
              }
              if (afterBanner) {
                afterBanner.hidden = true;
                afterBanner.removeAttribute('data-dismissed');
              }
            };

            if (beforeBanner) {
              beforeBanner.addEventListener('dads-notification-banner-close', function() {
                activateAfterState();
              });
            }
            if (ackButton) {
              ackButton.addEventListener('click', function(event) {
                event.preventDefault();
                activateAfterState();
              });
            }
            if (attachedResetButton) {
              attachedResetButton.addEventListener('click', function(event) {
                event.preventDefault();
                resetAttachedState();
              });
            }

            resetAttachedState();
          }

          syncCopyByType();
          syncBackgroundDemo();
        });
      })();
    </script>
  `,

  emergencyBanner: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">緊急時バナー</h2>
      <p style="color: var(--color-neutral-solid-gray-700, #4d4d4d); margin-bottom: 32px;">
        DADSの緊急時バナーをWeb Components化した実装です。接頭辞切替、更新日時、本文、CTAを提供します。
      </p>

      ${renderAnnotationToggleBlock()}

      <section style="margin-bottom: 48px;">
        ${renderA11ySectionHeader()}
<a11y-annotate
          target-selector="dads-emergency-banner"
          callout-lane="top"
          style="
            --a11y-annotate-callout-gutter: clamp(8rem, 22vw, 20rem);
            --a11y-annotate-callout-lane-offset: 168px;
            --a11y-annotate-callout-lane-gap: 12px;
          "
        >
          <div style="padding: 96px 160px;">
            <div style="max-width: 1240px; margin: 0 auto;">
              <dads-emergency-banner href="https://example.com/evacuation" target="_blank">
                <span slot="heading">〇〇地区に避難準備情報が発令されました</span>
                <time slot="timestamp" datetime="2024-01-01T06:00:00+09:00">2024年1月1日 06:00更新</time>
                <p>1時23分に〇〇地区に対して避難準備情報が発令されました。指定避難所への避難を開始してください。</p>
                <span slot="action">指定避難所を確認する</span>
              </dads-emergency-banner>
            </div>
          </div>
        </a11y-annotate>
      </section>

      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">API / 操作</h3>
        ${renderApiPanelWrapper({
          imports: [
            'dads-emergency-banner',
            'dads-select',
            'dads-input-text',
            'dads-table',
            'dads-code-block',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="padding: 24px; border: 1px dashed var(--color-neutral-solid-gray-200, #cccccc); border-radius: 12px;">
                <dads-emergency-banner
                  data-api-target
                  heading-level="2"
                  prefix-mode="auto"
                  prefix-label="【緊急】"
                  href="https://example.com/evacuation"
                  target="_blank"
                >
                  <span slot="heading">〇〇地区に避難準備情報が発令されました</span>
                  <time slot="timestamp" datetime="2024-01-01T06:00:00+09:00">2024年1月1日 06:00更新</time>
                  <p>1時23分に〇〇地区に対して避難準備情報が発令されました。指定避難所への避難を開始してください。</p>
                  <span slot="action">指定避難所を確認する</span>
                </dads-emergency-banner>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-emergency-banner href="https://example.com/evacuation" target="_blank">
                      <span slot="heading">〇〇地区に避難準備情報が発令されました</span>
                      <time slot="timestamp" datetime="2024-01-01T06:00:00+09:00">2024年1月1日 06:00更新</time>
                      <p>1時23分に〇〇地区に対して避難準備情報が発令されました。指定避難所への避難を開始してください。</p>
                      <span slot="action">指定避難所を確認する</span>
                    </dads-emergency-banner>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>heading-level</code></th>
                        <td><code>attr</code></td>
                        <td><code>'2' | '3' | '4' | '5' | '6'</code></td>
                        <td><code>2</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="heading-level" size="md 240" value="2" data-api-attr="heading-level" data-default="2">
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>見出しレベル</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>prefix-mode</code></th>
                        <td><code>attr</code></td>
                        <td><code>'auto' | 'manual'</code></td>
                        <td><code>auto</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="prefix-mode" size="md 240" value="auto" data-api-attr="prefix-mode" data-default="auto">
                              <option value="auto">auto</option>
                              <option value="manual">manual</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>接頭辞表示モード</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>prefix-label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>【緊急】</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="prefix-label" value="【緊急】" data-api-attr="prefix-label" data-default="【緊急】"></dads-input-text>
                          </div>
                        </td>
                        <td>接頭辞テキスト</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>href</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>https://example.com/evacuation</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="href" value="https://example.com/evacuation" data-api-attr="href" data-default="https://example.com/evacuation"></dads-input-text>
                          </div>
                        </td>
                        <td>CTAリンク先（未指定時はCTA非表示）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>target</code></th>
                        <td><code>attr</code></td>
                        <td><code>'_self' | '_blank'</code></td>
                        <td><code>_self</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-select label="target" size="md 240" value="_blank" data-api-attr="target" data-default="_self">
                              <option value="_self">_self</option>
                              <option value="_blank">_blank</option>
                            </dads-select>
                          </div>
                        </td>
                        <td>CTAリンクターゲット</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>rel</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>''（空）</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="rel" value="" data-api-attr="rel" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>CTAリンクrel（_blank時に未指定なら自動補完）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">Slots</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><code>slot="heading"</code></th>
                        <td><code>named</code></td>
                        <td>見出し本文（接頭辞は <code>prefix-mode</code> / <code>prefix-label</code> で制御）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>slot="timestamp"</code></th>
                        <td><code>named</code></td>
                        <td>更新日時</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>default slot</code></th>
                        <td><code>default</code></td>
                        <td>本文</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>slot="action"</code></th>
                        <td><code>named</code></td>
                        <td>CTAラベル（<code>href</code> 未指定または空の場合は非表示）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS Parts</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><th scope="row"><code>base</code></th><td>ルート</td></tr>
                      <tr><th scope="row"><code>header</code></th><td>ヘッダー領域</td></tr>
                      <tr><th scope="row"><code>heading</code></th><td>見出し領域</td></tr>
                      <tr><th scope="row"><code>prefix</code></th><td>接頭辞</td></tr>
                      <tr><th scope="row"><code>timestamp</code></th><td>更新日時領域</td></tr>
                      <tr><th scope="row"><code>body</code></th><td>本文領域</td></tr>
                      <tr><th scope="row"><code>action</code></th><td>CTAコンテナ</td></tr>
                      <tr><th scope="row"><code>action-link</code></th><td>CTAリンク</td></tr>
                      <tr><th scope="row"><code>action-label</code></th><td>CTAラベル</td></tr>
                      <tr><th scope="row"><code>action-icon</code></th><td>新規タブアイコン</td></tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">Events</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">When</th>
                        <th scope="col">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><code>なし（独自イベントなし）</code></th>
                        <td>CTAリンク押下時</td>
                        <td>ネイティブのリンク遷移（<code>click</code> / <code>keydown Enter</code>）を利用</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-border-color</code></th>
                        <td><code>var(--color-semantic-warning-orange-1)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-border-color" value="" data-api-css-var="--dads-emergency-banner-border-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>外枠色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-background</code></th>
                        <td><code>#fff</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-background" value="" data-api-css-var="--dads-emergency-banner-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-color</code></th>
                        <td><code>#333</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-color" value="" data-api-css-var="--dads-emergency-banner-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>本文文字色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-heading-color</code></th>
                        <td><code>#1a1a1a</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-heading-color" value="" data-api-css-var="--dads-emergency-banner-heading-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>見出し文字色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-action-background</code></th>
                        <td><code>var(--color-semantic-error-1)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-action-background" value="" data-api-css-var="--dads-emergency-banner-action-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>CTA背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-action-background-hover</code></th>
                        <td><code>var(--color-semantic-error-2)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-action-background-hover" value="" data-api-css-var="--dads-emergency-banner-action-background-hover" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>CTAホバー背景色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-action-color</code></th>
                        <td><code>#fff</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-action-color" value="" data-api-css-var="--dads-emergency-banner-action-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>CTA文字色</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-emergency-banner-action-border-radius</code></th>
                        <td><code>0.75rem</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-emergency-banner-action-border-radius" value="" data-api-css-var="--dads-emergency-banner-action-border-radius" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>CTA角丸</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--color-neutral-solid-gray-900, #1a1a1a);">プレビュー</h3>
        <div style="display: grid; gap: 24px;">
          <dads-emergency-banner href="https://example.com/evacuation" target="_blank">
            <span slot="heading">〇〇地区に避難準備情報が発令されました</span>
            <time slot="timestamp" datetime="2024-01-01T06:00:00+09:00">2024年1月1日 06:00更新</time>
            <p>1時23分に〇〇地区に対して避難準備情報が発令されました。お年寄りの方等避難に時間がかかる方は、直ちに指定避難所へ避難してください。</p>
            <span slot="action">指定避難所を確認する</span>
          </dads-emergency-banner>

          <dads-emergency-banner prefix-mode="manual" href="https://example.com/evacuation">
            <span slot="heading">【緊急】河川水位の上昇に伴う避難情報</span>
            <time slot="timestamp" datetime="2024-01-01T08:30:00+09:00">2024年1月1日 08:30更新</time>
            <p>洪水の危険性が高まっています。対象地域の方は避難行動を開始してください。</p>
            <span slot="action">避難行動判定フローを見る</span>
          </dads-emergency-banner>
        </div>
      </section>
    </div>
  `,


  switch: () => `
    <div style="padding: 40px; max-width: 1280px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">スイッチ</h2>
      <p style="color: #666; margin-bottom: 40px;">
        デジタル庁デザインシステム準拠のスイッチ（トグル）コンポーネント。TDD（テスト駆動開発）で実装。
      </p>

      ${renderAnnotationToggleBlock()}

      <!-- 基本（アクセシビリティ注釈付き） -->
      <section style="margin-bottom: 60px;">
        <h3 style="font-size: 20px; margin-bottom: 24px; color: #333;">基本（アクセシビリティ注釈付き）</h3>
        <style>
          /* 注釈プレビューを大きくする */
          .switch-annotate-section a11y-annotate {
            /* コールアウトの配置距離を広げる */
            --spacing-6: 64px;
          }
          .switch-annotate-section [part="preview"] {
            padding: 120px 160px;
            min-height: 320px;
            display: flex;
            align-items: center;
            justify-content: center;
            /* コールアウトがはみ出せる領域を広げる */
            --a11y-annotate-callout-gutter: 100px;
          }
          .switch-annotate-section [part="preview-inner"] {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .switch-annotate-section [part="layout"] {
            gap: 32px;
          }
        </style>
        <div class="switch-annotate-section">
          <a11y-annotate target-selector="dads-switch">
            <dads-switch checked>
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </a11y-annotate>
        </div>
      </section>

      <!-- API / 操作 -->
      <section style="margin-bottom: 48px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">API / 操作</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          Props/Attrs と CSS vars の変更が Preview に即時反映されます。
        </p>

        ${renderApiPanelWrapper({
          imports: [
            'a11y-annotate',
          ],
          body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-switch data-api-target checked size="md">
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code>
                  <template>
                    <dads-switch checked size="md">
                      <span slot="label-left">OFF</span>
                      <span slot="label-right">ON</span>
                    </dads-switch>
                  </template>
                </dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>checked</code></th>
                        <td><code>prop</code></td>
                        <td><code>true</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="checked" data-api-prop="checked" data-default="true" checked>
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>ON/OFF</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>disabled</code></th>
                        <td><code>attr</code></td>
                        <td><code>false</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-switch aria-label="disabled" data-api-attr="disabled" data-default="false">
                              <span slot="label-left">Off</span>
                              <span slot="label-right">On</span>
                            </dads-switch>
                          </div>
                        </td>
                        <td>無効化</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>md</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="md">
                              <option value="sm">sm</option>
                              <option value="md" selected>md</option>
                              <option value="lg">lg</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>name</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="name" value="" data-api-attr="name" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーム名</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>value</code></th>
                        <td><code>attr</code></td>
                        <td><code>(unset)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="value" value="" data-api-attr="value" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>フォーム値（チェック時）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-switch-track-bg</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-track-bg" value="" data-api-css-var="--dads-switch-track-bg" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-track-width</code></th>
                        <td><code>48px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-track-width" value="" data-api-css-var="--dads-switch-track-width" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック幅</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-track-height</code></th>
                        <td><code>24px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-track-height" value="" data-api-css-var="--dads-switch-track-height" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>トラック高さ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-knob-size</code></th>
                        <td><code>20px</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-knob-size" value="" data-api-css-var="--dads-switch-knob-size" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ノブサイズ</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-knob-bg</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-knob-bg" value="" data-api-css-var="--dads-switch-knob-bg" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ノブ背景</td>
                      </tr>

                      <tr>
                        <th scope="row"><code>--dads-switch-label-color</code></th>
                        <td><code>(token)</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-switch-label-color" value="" data-api-css-var="--dads-switch-label-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>ラベル色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>
            </div>
          `,
        })}
      </section>

      <!-- 日本語ラベル -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">日本語ラベル</h3>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
          <dads-switch>
            <span slot="label-left">オフ</span>
            <span slot="label-right">オン</span>
          </dads-switch>
          <dads-switch checked>
            <span slot="label-left">オフ</span>
            <span slot="label-right">オン</span>
          </dads-switch>
        </div>
      </section>

      <!-- サイズ -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">サイズ</h3>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: monospace; color: #666;">sm:</span>
            <dads-switch size="sm">
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: monospace; color: #666;">md:</span>
            <dads-switch size="md">
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: monospace; color: #666;">lg:</span>
            <dads-switch size="lg">
              <span slot="label-left">OFF</span>
              <span slot="label-right">ON</span>
            </dads-switch>
          </div>
        </div>
      </section>

      <!-- 無効状態 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">無効状態</h3>
        <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
          <dads-switch disabled>
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
          <dads-switch disabled checked>
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
        </div>
      </section>

      <!-- 実際の使用例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">実際の使用例</h3>
        <div style="border: 1px solid #ddd; padding: 24px; border-radius: 8px; background: #f9f9f9; max-width: 500px;">
          <form id="switch-demo-form">
            <h4 style="font-size: 18px; margin-bottom: 20px; color: #333;">通知設定</h4>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <label for="email-notify">メール通知</label>
                <dads-switch id="email-notify" name="email-notify" value="enabled" checked>
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <label for="push-notify">プッシュ通知</label>
                <dads-switch id="push-notify" name="push-notify" value="enabled">
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <label for="weekly-report">週次レポート</label>
                <dads-switch id="weekly-report" name="weekly-report" value="enabled" checked>
                  <span slot="label-left">OFF</span>
                  <span slot="label-right">ON</span>
                </dads-switch>
              </div>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px;">
              <dads-button variant="text" type="reset">リセット</dads-button>
              <dads-button variant="solid" type="submit">保存</dads-button>
            </div>
          </form>
        </div>
      </section>

      <!-- イベントテスト -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 20px; color: #333;">イベントテスト</h3>
        <div style="display: flex; gap: 16px; align-items: center;">
          <dads-switch id="event-test-switch">
            <span slot="label-left">OFF</span>
            <span slot="label-right">ON</span>
          </dads-switch>
          <span id="event-status" style="font-family: monospace; color: #666;">状態: false</span>
        </div>
        <script>
          // カスタム要素の定義を待ってからイベントリスナーを設定
          customElements.whenDefined('dads-switch').then(() => {
            const switchEl = document.getElementById('event-test-switch');
            const statusEl = document.getElementById('event-status');
            if (switchEl && statusEl) {
              switchEl.addEventListener('dads-change', (e) => {
                statusEl.textContent = '状態: ' + e.detail.checked;
              });
            }
          });
        </script>
      </section>

      <!-- 特徴 -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <h3 style="color: #1565c0; margin-bottom: 10px;">特徴</h3>
        <ul style="color: #1565c0; line-height: 1.8; padding-left: 20px;">
          <li><strong>WCAG 2.2 AA準拠:</strong> role="switch"、aria-checked、フォーカス管理</li>
          <li><strong>キーボード操作:</strong> Enter/Space（トグル）、←（OFF）、→（ON）</li>
          <li><strong>サイズバリエーション:</strong> sm (40x20px) / md (48x24px) / lg (56x28px)</li>
          <li><strong>デザイントークン:</strong> セマンティック & ローカルトークンの2層構造</li>
          <li><strong>Form Associated:</strong> ネイティブフォームに参加</li>
          <li><strong>ラベルスロット:</strong> label-left / label-right（必須）</li>
          <li><strong>::part()スタイリング:</strong> wrapper, switch, track, knob, checkbox, label-left, label-right</li>
          <li><strong>Shadow DOM:</strong> スタイルの完全な隔離</li>
          <li><strong>TDD開発:</strong> 32テストケースで品質担保</li>
        </ul>
      </div>
    </div>
  `,

  icon: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">アイコン</h2>
      <p style="color: #666; margin-bottom: 24px;">
        <code>iconPaths</code> に登録されたSVGアイコンを宣言的に表示する汎用コンポーネントです。
        ボタンやメニューなど他コンポーネントのスロットに配置可能です。
      </p>

      <!-- API Panel -->
      ${renderApiPanelWrapper({
        imports: [
          'dads-icon',
        ],
        body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-icon
                  data-api-target
                  name="search"
                  size="24"
                ></dads-icon>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code></dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>name</code></th>
                        <td><code>attr</code></td>
                        <td><code>IconName</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="name" data-api-attr="name" data-default="search">
                              ${Object.keys(iconPaths).map((n) => `<option value="${n}"${n === 'search' ? ' selected' : ''}>${n}</option>`).join('\n                              ')}
                            </select>
                          </div>
                        </td>
                        <td>アイコン名</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>20</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="24">
                              <option value="16">16</option>
                              <option value="20">20</option>
                              <option value="24" selected>24</option>
                              <option value="32">32</option>
                              <option value="48">48</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ（px）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value=""
                              data-api-attr="label"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>アクセシブルラベル（指定時: role="img"）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-icon-color</code></th>
                        <td><code>currentColor</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-icon-color" value="" data-api-css-var="--dads-icon-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>アイコン色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS Parts</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Part</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><code>svg</code></th>
                        <td>SVG要素</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
        `,
      })}

      <!-- アイコン一覧 -->
      <section style="margin-top: 40px; margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">利用可能なアイコン（${Object.keys(iconPaths).length}種）</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 24px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          ${Object.keys(iconPaths).map((name) => `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 80px;">
              <dads-icon name="${name}" size="24"></dads-icon>
              <code style="font-size: 11px; color: #666;">${name}</code>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 作例 -->
      <section style="margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">作例</h3>

        <h4 style="font-size: 16px; margin-bottom: 12px; color: #555;">サイズ</h4>
        <div style="display: flex; align-items: end; gap: 24px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-icon name="search" size="16"></dads-icon>
            <code style="font-size: 11px; color: #666;">16</code>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-icon name="search" size="20"></dads-icon>
            <code style="font-size: 11px; color: #666;">20 (default)</code>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-icon name="search" size="24"></dads-icon>
            <code style="font-size: 11px; color: #666;">24</code>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-icon name="search" size="32"></dads-icon>
            <code style="font-size: 11px; color: #666;">32</code>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-icon name="search" size="48"></dads-icon>
            <code style="font-size: 11px; color: #666;">48</code>
          </div>
        </div>

        <h4 style="font-size: 16px; margin-bottom: 12px; color: #555;">アクセシビリティ</h4>
        <div style="display: flex; gap: 32px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-icon name="search" size="24"></dads-icon>
            <code style="font-size: 11px; color: #666;">装飾的（デフォルト）</code>
            <span style="font-size: 11px; color: #999;">aria-hidden="true"</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-icon name="search" size="24" label="検索"></dads-icon>
            <code style="font-size: 11px; color: #666;">情報的（label指定）</code>
            <span style="font-size: 11px; color: #999;">role="img"</span>
          </div>
        </div>

        <h4 style="font-size: 16px; margin-bottom: 12px; color: #555;">ボタン内スロット</h4>
        <div style="display: flex; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <dads-button>
            <dads-icon slot="icon-start" name="search"></dads-icon>
            検索
          </dads-button>
          <dads-button variant="outlined">
            <dads-icon slot="icon-start" name="add"></dads-icon>
            追加
          </dads-button>
          <dads-button variant="text">
            <dads-icon slot="icon-start" name="download"></dads-icon>
            ダウンロード
          </dads-button>
        </div>
      </section>
    </div>
  `,

  avatar: () => `
    <div style="padding: 40px; max-width: 1100px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">アバター</h2>
      <p style="color: #666; margin-bottom: 24px;">
        テキストイニシャルまたは写真を円形で表示するアバターです。
        コンボボックスの人名選択などでアイコンとして使用可能です。
      </p>

      <!-- API Panel -->
      ${renderApiPanelWrapper({
        imports: [
          'dads-avatar',
        ],
        body: `
            <div>
              <h4 class="wc-api-panel__section-title">Preview</h4>
              <div style="display: grid; place-content: center; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px;">
                <dads-avatar
                  data-api-target
                  initials="太"
                  color="--color-primitive-blue-600"
                  size="40"
                ></dads-avatar>
              </div>
              <div style="margin-top: 16px;">
                <h4 class="wc-api-panel__section-title">Usage (HTML)</h4>
                <dads-code-block data-api-code></dads-code-block>
              </div>
            </div>

            <div class="wc-api-panel__tables">
              <div>
                <h4 class="wc-api-panel__section-title">Props / Attrs</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_PROPS_WITH_TYPE_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>src</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="src"
                              value=""
                              data-api-attr="src"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>写真URL（指定時は写真モード）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>initials</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="initials"
                              value="太"
                              data-api-attr="initials"
                              data-default="太"
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>表示文字（1〜2文字、写真未指定時）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>color</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>--color-neutral-solid-gray-420</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="color" data-api-attr="color" data-default="--color-primitive-blue-600">
                              <option value="--color-primitive-blue-600" selected>blue-600</option>
                              <option value="--color-primitive-red-600">red-600</option>
                              <option value="--color-primitive-green-600">green-600</option>
                              <option value="--color-primitive-orange-600">orange-600</option>
                              <option value="--color-primitive-purple-600">purple-600</option>
                              <option value="--color-primitive-cyan-700">cyan-700</option>
                              <option value="">（デフォルト）</option>
                            </select>
                          </div>
                        </td>
                        <td>背景色（CSSカスタムプロパティ名）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>size</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td><code>32</code></td>
                        <td>
                          <div class="wc-api-control">
                            <select aria-label="size" data-api-attr="size" data-default="40">
                              <option value="24">24</option>
                              <option value="32">32</option>
                              <option value="40" selected>40</option>
                              <option value="48">48</option>
                              <option value="64">64</option>
                            </select>
                          </div>
                        </td>
                        <td>サイズ（px）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>label</code></th>
                        <td><code>attr</code></td>
                        <td><code>string</code></td>
                        <td>—</td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text
                              label="label"
                              value=""
                              data-api-attr="label"
                              data-default=""
                            ></dads-input-text>
                          </div>
                        </td>
                        <td>アクセシブルラベル（指定時: role="img"）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS vars</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    ${API_TABLE_CSS_VARS_HEADER}
                    <tbody>
                      <tr>
                        <th scope="row"><code>--dads-avatar-background</code></th>
                        <td><code>--color-neutral-solid-gray-420</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-avatar-background" value="" data-api-css-var="--dads-avatar-background" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>背景色（color未指定時のフォールバック）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>--dads-avatar-text-color</code></th>
                        <td><code>white</code></td>
                        <td>
                          <div class="wc-api-control">
                            <dads-input-text label="--dads-avatar-text-color" value="" data-api-css-var="--dads-avatar-text-color" data-default=""></dads-input-text>
                          </div>
                        </td>
                        <td>テキスト色</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
                ${API_TABLE_CSS_VARS_NOTE}
              </div>

              <div>
                <h4 class="wc-api-panel__section-title">CSS Parts</h4>
                <dads-table>
                  <table class="wc-api-table" data-cell-border="bottom">
                    <thead>
                      <tr>
                        <th scope="col">Part</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row"><code>svg</code></th>
                        <td>SVG要素（イニシャルモード）</td>
                      </tr>
                      <tr>
                        <th scope="row"><code>img</code></th>
                        <td>img要素（写真モード）</td>
                      </tr>
                    </tbody>
                  </table>
                </dads-table>
              </div>
            </div>
        `,
      })}

      <!-- 作例 -->
      <section style="margin-top: 40px; margin-bottom: 40px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">作例</h3>

        <h4 style="font-size: 16px; margin-bottom: 12px; color: #555;">カラーバリエーション</h4>
        <div style="display: flex; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; align-items: center; margin-bottom: 24px;">
          <dads-avatar initials="太" color="--color-primitive-blue-600" size="40"></dads-avatar>
          <dads-avatar initials="花" color="--color-primitive-red-600" size="40"></dads-avatar>
          <dads-avatar initials="一" color="--color-primitive-green-600" size="40"></dads-avatar>
          <dads-avatar initials="と" color="--color-primitive-orange-600" size="40"></dads-avatar>
          <dads-avatar initials="二" color="--color-primitive-purple-600" size="40"></dads-avatar>
          <dads-avatar initials="AB" color="--color-primitive-cyan-700" size="40"></dads-avatar>
        </div>

        <h4 style="font-size: 16px; margin-bottom: 12px; color: #555;">サイズ</h4>
        <div style="display: flex; align-items: end; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-avatar initials="太" color="--color-primitive-blue-600" size="24"></dads-avatar>
            <code style="font-size: 11px; color: #666;">24</code>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-avatar initials="太" color="--color-primitive-blue-600" size="32"></dads-avatar>
            <code style="font-size: 11px; color: #666;">32 (default)</code>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-avatar initials="太" color="--color-primitive-blue-600" size="48"></dads-avatar>
            <code style="font-size: 11px; color: #666;">48</code>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <dads-avatar initials="太" color="--color-primitive-blue-600" size="64"></dads-avatar>
            <code style="font-size: 11px; color: #666;">64</code>
          </div>
        </div>

        <h4 style="font-size: 16px; margin-bottom: 12px; color: #555;">デフォルト色（color未指定時）</h4>
        <div style="display: flex; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; align-items: center;">
          <dads-avatar initials="D" size="40"></dads-avatar>
          <span style="font-size: 14px; color: #666;">--dads-avatar-background: var(--color-neutral-solid-gray-420)</span>
        </div>
      </section>
    </div>
  `,
} as const;

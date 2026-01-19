import type { Meta, StoryObj } from '@storybook/web-components';
import { defineTable } from './table-define';

defineTable();

function renderExample(markup: string): HTMLElement {
  const host = document.createElement('dads-table');
  host.innerHTML = markup.trim();
  return host;
}

type TablePlaygroundArgs = {
  tableBorder: boolean;
  tableBorderValue: string[];
  tableCellBorder: boolean;
  tableCellBorderValue: string[];
  theadCellBorder: boolean;
  theadCellBorderValue: string[];
  tbodyCellBorder: boolean;
  tbodyCellBorderValue: string[];
  tdBorder: boolean;
  tdBorderValue: string[];
  dense: boolean;
  fullWidth: boolean;
  fixedWidth: boolean;
  rowStripe: boolean;
  hoverHighlight: boolean;
};

const EXAMPLE_PLAYGROUND = `
  <div class="dads-table">
    <table class="dads-table__table">
      <thead>
        <tr>
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
        </tr>
        <tr>
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
        </tr>
        <tr>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

const EXAMPLE_PLAIN = `
  <div class="dads-table">
    <table class="dads-table__table">
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
  </div>
`;

const EXAMPLE_FIRST_ROW_AS_HEADER_CELL = `
  <div class="dads-table">
    <table class="dads-table__table">
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
      <tbody data-cell-border="bottom">
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
  </div>
`;

const EXAMPLE_FIRST_COLUMN_AS_HEADER_CELL = `
  <div class="dads-table">
    <table class="dads-table__table" data-cell-border="right">
      <tbody>
        <tr>
          <th class="dads-table__row-header" scope="row">データ</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row">データ</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row">データ</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row">データ</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

const EXAMPLE_FIRST_ROW_AND_COLUMN_AS_HEADER_CELL = `
  <div class="dads-table">
    <table class="dads-table__table" data-cell-border="bottom">
      <thead>
        <tr>
          <td data-bg="solid-gray-100" data-border="right"></td>
          <th class="dads-table__col-header" scope="col">ラベル</th>
          <th class="dads-table__col-header" scope="col">ラベル</th>
          <th class="dads-table__col-header" scope="col">ラベル</th>
          <th class="dads-table__col-header" scope="col">ラベル</th>
          <th class="dads-table__col-header" scope="col">ラベル</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="dads-table__row-header" scope="row">データ</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row">データ</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row">データ</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

const EXAMPLE_CONDENSED_TABLE = `
  <div class="dads-table" data-size="dense">
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
  </div>
`;

const EXAMPLE_BORDER_ON_ROW_AND_COLUMN = `
  <div class="dads-table">
    <table class="dads-table__table" data-border="hidden" data-cell-border>
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
  </div>
`;

const EXAMPLE_TABLE_HEADER_WITH_COLSPAN = `
  <div class="dads-table">
    <table class="dads-table__table" data-border data-cell-border="bottom">
      <thead data-cell-border="right">
        <tr>
          <th class="dads-table__col-header" scope="col" colspan="3">親ラベル</th>
          <th class="dads-table__col-header" scope="col" colspan="3">親ラベル</th>
        </tr>
        <tr>
          <th class="dads-table__col-header" scope="col">子ラベル</th>
          <th class="dads-table__col-header" scope="col">子ラベル</th>
          <th class="dads-table__col-header" scope="col">子ラベル</th>
          <th class="dads-table__col-header" scope="col">子ラベル</th>
          <th class="dads-table__col-header" scope="col">子ラベル</th>
          <th class="dads-table__col-header" scope="col">子ラベル</th>
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
  </div>
`;

const EXAMPLE_TABLE_HEADER_WITH_ROWSPAN = `
  <div class="dads-table">
    <table class="dads-table__table" data-border data-cell-border="bottom">
      <tbody>
        <tr>
          <th class="dads-table__row-header" scope="row" rowspan="2" data-border="right">親ラベル</th>
          <th class="dads-table__row-header" scope="row">子ラベル</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row">子ラベル</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row" rowspan="2" data-border="right">親ラベル</th>
          <th class="dads-table__row-header" scope="row">子ラベル</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
        <tr>
          <th class="dads-table__row-header" scope="row">子ラベル</th>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
          <td>データ</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

const EXAMPLE_INDENTED_ROWS = `
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
`;

const EXAMPLE_STRIPE_TABLE = `
  <div class="dads-table" data-row-stripe>
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
  </div>
`;

const EXAMPLE_HIGHLIGHT_HOVERED_ROW = `
  <div class="dads-table" data-row-stripe data-row-hover-highlight>
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
  </div>
`;

const EXAMPLE_SELECTABLE_TABLE = `
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
`;

const EXAMPLE_SORTABLE_HEADER = `
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
`;

const EXAMPLE_SORTABLE_HEADER_DENSE = `
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
`;

const EXAMPLE_AUTO_SORT_DOM = `
  <div class="dads-table" data-js-sortable-table>
    <table class="dads-table__table" data-border data-cell-border>
      <thead>
        <tr>
          <th class="dads-table__sort-header" scope="col" data-sort-type="number" data-js-sort-header>
            <div class="dads-table__sort-inner">
              <div class="dads-table__sort-label">
                <button class="dads-table__sort-button" data-js-sort>
                  数値
                  <span class="dads-table__sort-icon">
                    <svg class="dads-table__sort-svg" width="24" height="24" fill="currentcolor" aria-hidden="true">
                      <path d="M17 18.11L21.27 14L22 14.7L16.5 20L11 14.7L11.73 14L16 18.12V4H17V18.12ZM8 5.88L12.27 10L13 9.3L7.5 4L2 9.3L2.73 10L7 5.88V20H8V5.88Z"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </th>
          <th class="dads-table__col-header" scope="col">ラベル</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2</td>
          <td>行B</td>
        </tr>
        <tr>
          <td>10</td>
          <td>行C</td>
        </tr>
        <tr>
          <td>1</td>
          <td>行A</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

const EXAMPLE_LINKED_TEXT_IN_CELL = `
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
`;

const EXAMPLE_WITH_CAPTION = `
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
`;

const meta: Meta = {
  title: 'Components/テーブル／データテーブル',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# テーブル／データテーブル（Web Components版）

\`<dads-table>\` は **light DOM** でネイティブの \`<table>\` マークアップをそのまま使い、DADS準拠の見た目と、ページ利用時の利便性（水平スクロール、行選択、ソートUI）を提供します。

## 公式HTML版（data-* 属性API）互換

公式スニペットで使われる \`data-*\` も併用できます（\`<dads-table>\` 自身、または内側の \`.dads-table\` に付与）。

- \`data-size="dense"\`
- \`data-row-stripe\` / \`data-row-hover-highlight\` / \`data-selectable\`
- \`data-border\` / \`data-cell-border\` / \`data-bg\`
- \`data-width="full"\` / \`data-layout="fixed"\`

## JS互換セレクタ

- 行選択: \`data-select-all\`/\`data-select-row\` に加えて \`data-js-check-all\`/\`data-js-check\` もサポート
- ソート: \`data-sort\` に加えて \`data-js-sort\`（および \`data-js-sort-header\` を含む公式マークアップ）をサポート
        `.trim(),
      },
    },
  },
};

export default meta;

export const Playground: StoryObj<TablePlaygroundArgs> = {
  render: (args) => {
    const host = document.createElement('dads-table');
    host.innerHTML = EXAMPLE_PLAYGROUND.trim();

    const root = host.querySelector<HTMLElement>('.dads-table') ?? host;
    const table = host.querySelector<HTMLTableElement>('table');
    const thead = host.querySelector<HTMLTableSectionElement>('thead');
    const tbody = host.querySelector<HTMLTableSectionElement>('tbody');
    const td = host.querySelector<HTMLTableCellElement>('tbody > tr:nth-child(2) > td:nth-child(2)');

    if (!table || !thead || !tbody || !td) return host;

    if (args.dense) root.setAttribute('data-size', 'dense');
    else root.removeAttribute('data-size');

    if (args.fullWidth) table.setAttribute('data-width', 'full');
    else table.removeAttribute('data-width');

    if (args.fullWidth && args.fixedWidth) table.setAttribute('data-layout', 'fixed');
    else table.removeAttribute('data-layout');

    if (args.rowStripe) root.setAttribute('data-row-stripe', '');
    else root.removeAttribute('data-row-stripe');

    if (args.hoverHighlight) root.setAttribute('data-row-hover-highlight', '');
    else root.removeAttribute('data-row-hover-highlight');

    if (args.tableBorder) table.setAttribute('data-border', args.tableBorderValue.join(' '));
    else table.removeAttribute('data-border');

    if (args.tableCellBorder) table.setAttribute('data-cell-border', args.tableCellBorderValue.join(' '));
    else table.removeAttribute('data-cell-border');

    if (args.theadCellBorder) thead.setAttribute('data-cell-border', args.theadCellBorderValue.join(' '));
    else thead.removeAttribute('data-cell-border');

    if (args.tbodyCellBorder) tbody.setAttribute('data-cell-border', args.tbodyCellBorderValue.join(' '));
    else tbody.removeAttribute('data-cell-border');

    if (args.tdBorder) td.setAttribute('data-border', args.tdBorderValue.join(' '));
    else td.removeAttribute('data-border');

    td.textContent = '長いテキスト長いテキスト長いテキスト';

    return host;
  },
  argTypes: {
    tableBorder: {
      name: 'table[data-border]',
      description: '`<table>`にボーダーを表示する',
      control: 'boolean',
      table: { category: 'ボーダー' },
    },
    tableBorderValue: {
      name: 'table[data-border="?"]',
      description:
        '`<table>`にボーダーを表示する。`hidden`を指定すると、以降の指定にかかわらず`<table>`のボーダーを非表示にする',
      if: { arg: 'tableBorder' },
      control: 'inline-check',
      options: ['hidden'],
      table: { category: 'ボーダー' },
    },
    tableCellBorder: {
      name: 'table[data-cell-border]',
      description: '全ての`<td>`および`<th>`にボーダーを表示する',
      control: 'boolean',
      table: { category: 'ボーダー' },
    },
    tableCellBorderValue: {
      name: 'table[data-cell-border="?"]',
      description: '全ての`<td>`および`<th>`のボーダーを指定する',
      if: { arg: 'tableCellBorder' },
      control: 'inline-check',
      options: ['top', 'bottom', 'left', 'right'],
      table: { category: 'ボーダー' },
    },
    theadCellBorder: {
      name: 'thead[data-cell-border]',
      description: '`<thead>`以下の`<td>`および`<th>`にボーダーを表示する',
      control: 'boolean',
      table: { category: 'ボーダー' },
    },
    theadCellBorderValue: {
      name: 'thead[data-cell-border="?"]',
      description: '`<thead>`以下の`<td>`および`<th>`のボーダーを指定する',
      if: { arg: 'theadCellBorder' },
      control: 'inline-check',
      options: ['top', 'bottom', 'left', 'right'],
      table: { category: 'ボーダー' },
    },
    tbodyCellBorder: {
      name: 'tbody[data-cell-border]',
      description: '`<tbody>`以下の`<td>`および`<th>`にボーダーを表示する',
      control: 'boolean',
      table: { category: 'ボーダー' },
    },
    tbodyCellBorderValue: {
      name: 'tbody[data-cell-border="?"]',
      description: '`<tbody>`以下の`<td>`および`<th>`のボーダーを指定する',
      if: { arg: 'tbodyCellBorder' },
      control: 'inline-check',
      options: ['top', 'bottom', 'left', 'right'],
      table: { category: 'ボーダー' },
    },
    tdBorder: {
      name: 'td[data-border]',
      description: '任意のセルにボーダーを表示する',
      control: 'boolean',
      table: { category: 'ボーダー' },
    },
    tdBorderValue: {
      name: 'td[data-border="?"]',
      description:
        '任意のセルのボーダーを指定する。`hidden`または`*-hidden`を指定すると、以上の指定にかかわらず任意のセルのボーダーを非表示にする',
      if: { arg: 'tdBorder' },
      control: 'inline-check',
      options: ['top', 'bottom', 'left', 'right', 'hidden', 'top-hidden', 'bottom-hidden', 'left-hidden', 'right-hidden'],
      table: { category: 'ボーダー' },
    },
    dense: {
      description: 'テーブルの行の高さを小さくし、データテーブルの表示にする',
      control: 'boolean',
      table: { category: 'その他' },
    },
    fullWidth: {
      description: 'テーブルの幅をコンテナ幅まで広げる',
      control: 'boolean',
      table: { category: 'その他' },
    },
    fixedWidth: {
      description: 'テーブルレイアウトを固定（`table-layout: fixed`）に設定する',
      if: { arg: 'fullWidth' },
      control: 'boolean',
      table: { category: 'その他' },
    },
    rowStripe: {
      description: '偶数行に背景色を付けてストライプ表示にする',
      control: 'boolean',
      table: { category: 'その他' },
    },
    hoverHighlight: {
      description: '行にホバーした際のハイライト表示を有効にする',
      control: 'boolean',
      table: { category: 'その他' },
    },
  },
  args: {
    tableBorder: true,
    tableBorderValue: ['hidden'],
    tableCellBorder: true,
    tableCellBorderValue: [],
    theadCellBorder: false,
    theadCellBorderValue: [],
    tbodyCellBorder: false,
    tbodyCellBorderValue: [],
    tdBorder: false,
    tdBorderValue: [],
    dense: false,
    fullWidth: false,
    fixedWidth: false,
    rowStripe: false,
    hoverHighlight: false,
  },
};

export const Plain = () => renderExample(EXAMPLE_PLAIN);
export const FirstRowAsHeaderCell = () => renderExample(EXAMPLE_FIRST_ROW_AS_HEADER_CELL);
export const FirstColumnAsHeaderCell = () => renderExample(EXAMPLE_FIRST_COLUMN_AS_HEADER_CELL);
export const FirstRowAndColumnAsHeaderCell = () => renderExample(EXAMPLE_FIRST_ROW_AND_COLUMN_AS_HEADER_CELL);
export const CondensedTable = () => renderExample(EXAMPLE_CONDENSED_TABLE);
export const BorderOnRowAndColumn = () => renderExample(EXAMPLE_BORDER_ON_ROW_AND_COLUMN);
export const TableHeaderWithColspan = () => renderExample(EXAMPLE_TABLE_HEADER_WITH_COLSPAN);
export const TableHeaderWithRowspan = () => renderExample(EXAMPLE_TABLE_HEADER_WITH_ROWSPAN);
export const IndentedRows = () => renderExample(EXAMPLE_INDENTED_ROWS);
export const StripeTable = () => renderExample(EXAMPLE_STRIPE_TABLE);
export const HighlightHoveredRow = () => renderExample(EXAMPLE_HIGHLIGHT_HOVERED_ROW);
export const SelectableTable = () => renderExample(EXAMPLE_SELECTABLE_TABLE);
export const SortableHeader = () => {
  const host = renderExample(EXAMPLE_SORTABLE_HEADER);
  host.setAttribute('sort-behavior', 'dom');
  return host;
};
export const SortableHeaderDense = () => {
  const host = renderExample(EXAMPLE_SORTABLE_HEADER_DENSE);
  host.setAttribute('sort-behavior', 'dom');
  return host;
};
export const AutoSortDom = () => {
  const host = renderExample(EXAMPLE_AUTO_SORT_DOM);
  host.setAttribute('sort-behavior', 'dom');
  return host;
};
export const LinkedTextInCell = () => renderExample(EXAMPLE_LINKED_TEXT_IN_CELL);
export const WithCaption = () => renderExample(EXAMPLE_WITH_CAPTION);

export const OverflowOnMobile = () => {
  const wrapper = document.createElement('div');
  wrapper.style.maxWidth = '520px';
  wrapper.style.border = '1px dashed #ccc';
  wrapper.style.padding = '16px';

  const host = document.createElement('dads-table');
  host.innerHTML = `
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
  `.trim();

  wrapper.appendChild(host);
  return wrapper;
};

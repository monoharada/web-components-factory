# dads-calendar

> カレンダーコンポーネント

- **Category**: Form
- **Class**: `DadsCalendar`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/calendar/calendar-impl.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component calendar
```

## Usage

```html
<dads-calendar>...</dads-calendar>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | - | - |  |
| `aria-labelledby` | - | - |  |
| `max-date` | string | - | 最大日付（YYYY-MM-DD） |
| `min-date` | string | - | 最小日付（YYYY-MM-DD） |
| `range` | string | - | 範囲選択モード（値の有無で有効化） |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `controls` | 上部コントロール |
| `date` | 日付ボタン |
| `footer` | フッター |
| `navigation` | 月移動ナビゲーション |
| `range` | 期間選択表示 |
| `table` | カレンダーテーブル（role="grid"） |
| `year-select` | 年セレクト |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `date-range-selected` | CustomEvent | 範囲選択時に発火（detail: { startDate: Date | null, endDate: Date | null }） |
| `date-selected` | CustomEvent | 日付選択時に発火（detail: { date: Date | null }） |


## Styling

```css
/* Custom properties */
dads-calendar {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-calendar::part(controls) {
  /* Style the 上部コントロール */
}
```

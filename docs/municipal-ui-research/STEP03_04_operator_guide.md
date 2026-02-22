# STEP03+04 オペレータガイド

## 概要

270自治体のURL探索（STEP03）+ 浅観測（STEP04）を、41バッチに分割して並列実行する。

---

## 事前準備

### 必要ファイル

| ファイル | パス (repo root: `kabul/`) | 用途 |
|---------|---------------------------|------|
| 統合実行プロンプト | `docs/municipal-ui-research/STEP03_04_combined_execution_prompt.md` | セッションに貼り付け |
| バッチCSV | `docs/municipal-ui-research/data/batches/batch_B{NN}.csv` | 各バッチの入力データ |
| 進捗管理台帳 | `docs/municipal-ui-research/data/batches/batch_manifest.csv` | ステータス管理 |

---

## 実行手順

### 1. バッチを選択

`batch_manifest.csv` を確認し、`step03_status=pending` のバッチを選ぶ。

### 2. セッションを開始

新しい Claude Code セッションを起動し、`STEP03_04_combined_execution_prompt.md` の内容を貼り付ける。

### 3. バッチデータを挿入

プロンプト内の `{BATCH_DATA}` を、選択したバッチCSV（例: `batch_B01.csv`）の全内容に置換する。

```
以下のバッチデータでSTEP03+04を実行してください。

{batch_B01.csv の内容をここに貼り付け}
```

### 4. 実行を監視

- 各自治体の処理完了を確認
- WebFetch 404 や timeout が発生した場合、セッション内でリトライ
- コンテキスト切れの前に部分CSV が保存されていることを確認

### 5. 出力を回収

セッション完了後、以下の2ファイルを `docs/municipal-ui-research/data/batches/` に保存:

| ファイル | 命名規則 | 内容 |
|---------|---------|------|
| URL roster | `batch_B{NN}_urls.csv` | 15列、自治体数行 |
| Observations | `batch_B{NN}_observations.csv` | 45列、ページ数行 |

### 6. manifest を更新

```csv
# batch_manifest.csv の該当行を更新
B01,hokkaido,7,"S0050;S0052;...",complete,complete,32,
```

- `step03_status` → `complete`
- `step04_status` → `complete`
- `observations_rows` → 実際の観測行数

---

## バッチ一覧

### リージョン別バッチ割り当て

| リージョン | バッチ | 件数 |
|-----------|--------|------|
| hokkaido | B01-B02 | 7+7 = 14 |
| tohoku | B03-B07 | 7+7+7+7+3 = 31 |
| kanto | B08-B15 | 7×7+6 = 55 |
| chubu | B16-B22 | 7×6+4 = 46 |
| kinki | B23-B28 | 7×6 = 42 |
| chugoku | B29-B32 | 7+7+7+4 = 25 |
| shikoku | B33-B35 | 7+7+4 = 18 |
| kyushu_okinawa | B36-B41 | 7×5+4 = 39 |
| **合計** | **B01-B41** | **270** |

### 推奨並列実行プラン

| セッション | リージョン | バッチ | 見積り時間 |
|-----------|-----------|--------|-----------|
| 1 | hokkaido | B01-B02 | 1h |
| 2 | tohoku | B03-B07 | 2.5h |
| 3 | kanto (A) | B08-B11 | 2h |
| 4 | kanto (B) | B12-B15 | 2h |
| 5 | chubu | B16-B22 | 3.5h |
| 6 | kinki | B23-B28 | 3h |
| 7 | chugoku+shikoku | B29-B35 | 3.5h |
| 8 | kyushu_okinawa | B36-B41 | 3h |

---

## バッチ検証チェックリスト

各バッチ完了後、以下を確認:

### URL roster (`batch_B{NN}_urls.csv`)
- [ ] 15列 × 自治体数行（ヘッダー含む）
- [ ] `sample_id` がバッチ割り当てと一致
- [ ] URLドメインが `official_site_url` と一致
- [ ] `top_page_url` が全行埋まっている

### Observations (`batch_B{NN}_observations.csv`)
- [ ] **45列**（`observation_shallow_schema.csv` 準拠）
- [ ] boolean カラム（18個）が全て `true` / `false`（空欄なし）
- [ ] `sample_id + page_type` の組み合わせが一意
- [ ] `http_status` が 200/301/302/403/404/timeout/dns_error のいずれか
- [ ] HTTP 200 のページで `contrast_risk_hint` が埋まっている
- [ ] `notes` に true 判定のエビデンスが記録されている

### 簡易検証コマンド

```bash
python3 -c "
import csv
with open('batch_B{NN}_observations.csv', 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))
header = reader[0]
data = reader[1:]
print(f'Columns: {len(header)}')
print(f'Rows: {len(data)}')
# Boolean check
bool_cols = [14,15,16,18,20,21,22,24,25,26,27,29,30,32,33,35,36,37]
invalid = [(i+2, header[c], r[c]) for i, r in enumerate(data) for c in bool_cols if r[c] not in ('true','false')]
print(f'Invalid booleans: {len(invalid)}')
# Uniqueness check
pairs = [(r[0], r[5]) for r in data]
print(f'Unique (sample_id, page_type) pairs: {len(set(pairs))}/{len(pairs)}')
"
```

---

## トラブルシューティング

### コンテキスト切れ

- 各自治体の処理後に即時CSV書き込みを指示済み
- 途中で切れた場合: manifest の `observations_rows` を確認し、未完了分のみ再実行

### WebFetch 404

- 1回目の404: 別ページタイプのURL探索を先に進め、後でリトライ
- 2回目の404: NOT_FOUND として記録、次の自治体へ

### WebFetch sibling error

- 並列 WebFetch で1つが失敗すると他も巻き添えになる場合がある
- 対策: 失敗した呼び出しを個別にリトライ

### DNS error

- ドメインが解決できない場合、その自治体の全ページをスキップ
- `http_status=dns_error`、notes に記録

---

## マージ手順（全バッチ完了後）

### 1. manifest 確認

```bash
python3 -c "
import csv
with open('docs/municipal-ui-research/data/batches/batch_manifest.csv', 'r') as f:
    reader = list(csv.DictReader(f))
pending = [r['batch_id'] for r in reader if r['step04_status'] != 'complete']
print(f'Pending batches: {pending}')
total_rows = sum(int(r['observations_rows']) for r in reader if r['observations_rows'])
print(f'Total observation rows: {total_rows}')
"
```

### 2. 結合

```bash
# Observations の結合
python3 -c "
import csv, glob
files = sorted(glob.glob('docs/municipal-ui-research/data/batches/batch_B*_observations.csv'))
all_rows = []
header = None
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        reader = list(csv.reader(fh))
        if header is None:
            header = reader[0]
        all_rows.extend(reader[1:])
with open('docs/municipal-ui-research/data/observations_shallow_270.csv', 'w', encoding='utf-8', newline='') as fh:
    writer = csv.writer(fh)
    writer.writerow(header)
    writer.writerows(all_rows)
print(f'Merged: {len(all_rows)} rows from {len(files)} files')
"
```

### 3. パイロットとの統合

```bash
python3 -c "
import csv
# Read pilot
with open('docs/municipal-ui-research/data/observations_shallow_pilot.csv', 'r', encoding='utf-8') as f:
    pilot = list(csv.reader(f))
# Read 270
with open('docs/municipal-ui-research/data/observations_shallow_270.csv', 'r', encoding='utf-8') as f:
    new = list(csv.reader(f))
# Merge (pilot header + pilot data + new data)
header = pilot[0]
all_data = pilot[1:] + new[1:]
with open('docs/municipal-ui-research/data/observations_shallow.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(all_data)
print(f'Final: {len(all_data)} rows (pilot {len(pilot)-1} + new {len(new)-1})')
"
```

### 4. 正本へコピー

```bash
cp docs/municipal-ui-research/data/observations_shallow.csv .context/municipal-ui-research/data/derived/
cp docs/municipal-ui-research/data/roster_300_with_pages.csv .context/municipal-ui-research/data/derived/
```

---

*このガイドは Municipal UI Research STEP03+04 統合実行用です。*

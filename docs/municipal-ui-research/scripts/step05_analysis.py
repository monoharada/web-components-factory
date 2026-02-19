#!/usr/bin/env python3
"""Municipal UI Research STEP05 analysis and roster_50 selection."""

from __future__ import annotations

import argparse
import csv
import re
import statistics
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

BOOLEAN_COLUMNS = [
    "has_skip_link",
    "has_header_brand",
    "has_global_nav",
    "has_search",
    "has_breadcrumb",
    "has_local_nav",
    "has_emergency_notice",
    "has_news_list",
    "has_pickup",
    "has_carousel",
    "has_hub_cards",
    "has_footer_policies",
    "has_accessibility_link",
    "has_contact_info",
    "has_contact_form",
    "has_article_meta",
    "has_toc",
    "has_attachments",
]

VARIANT_COLUMNS = [
    "global_nav_variant",
    "search_variant",
    "emergency_variant",
    "hub_cards_variant",
    "contact_form_variant",
    "attachments_variant",
]

PAGE_TYPE_ORDER = ["top", "contact", "service", "hub", "article"]
REGION_BLOCK_ORDER = [
    "hokkaido",
    "tohoku",
    "kanto",
    "chubu",
    "kinki",
    "chugoku",
    "shikoku",
    "kyushu_okinawa",
]
POPULATION_ORDER = ["A", "B", "C", "D", "unknown"]
MAJOR_CMS = ["SMART_CMS", "WordPress", "Joruri", "KanaboWeb", "FI"]

QUALITY_ALLOWED = {
    "heading_outline_score": {"good", "fair", "poor"},
    "keyboard_nav_risk": {"low", "medium", "high"},
    "contrast_risk_hint": {"low", "medium", "high"},
}

ROSTER_COLUMNS = [
    "sample_id",
    "municipality_code",
    "prefecture",
    "municipality_name",
    "layer",
    "population_category",
    "region_block",
    "official_site_url",
    "top_page_url",
    "contact_page_url",
    "service_page_url",
    "hub_page_url",
    "article_page_url",
    "selection_reason",
    "notes",
]


@dataclass(frozen=True)
class MunicipalityRecord:
    sample_id: str
    municipality_name: str
    layer: str
    population_category: str
    region_block: str
    cms_fingerprint: str
    a11y_maturity_score: int
    cluster_id: int
    all_pages_failed: bool
    partial_pages_failed: bool
    roster_row: dict[str, str]


def read_csv(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        return rows, list(reader.fieldnames or [])


def read_roster_sample_ids(path: Path) -> set[str]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return {row["sample_id"] for row in csv.DictReader(f)}


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def is_http_success(status: str) -> bool:
    return (status or "").strip() == "200"


def normalize_quality_value(column: str, value: str) -> str:
    normalized = (value or "").strip().lower()
    return normalized if normalized in QUALITY_ALLOWED[column] else "unknown"


def normalize_cms_fingerprint(value: str) -> str:
    raw = (value or "").strip()
    if not raw:
        return "unknown"

    lower = raw.lower()

    if lower in {"smart cms", "smart_cms"} or "smart_cms" in lower or "smart cms" in lower:
        return "SMART_CMS"
    if "wordpress" in lower:
        return "WordPress"
    if "joruri" in lower:
        return "Joruri"
    if "kanaboweb" in lower:
        return "KanaboWeb"

    tokens = [token for token in re.split(r"[^a-z0-9_]+", lower) if token]
    if lower == "fi" or lower == "fi.jquery" or "fi.jquery" in lower or "fi" in tokens:
        return "FI"

    if lower == "readspeaker;custom":
        return "custom"
    if lower == "custom;google_cse":
        return "custom"
    if "custom" in lower:
        return "custom"

    return raw


def choose_best(
    candidates: list[MunicipalityRecord],
    score_fn: Callable[[MunicipalityRecord], tuple[float, ...]],
) -> tuple[MunicipalityRecord, tuple[float, ...]]:
    best: MunicipalityRecord | None = None
    best_score: tuple[float, ...] | None = None
    for candidate in sorted(candidates, key=lambda r: r.sample_id):
        score = score_fn(candidate)
        if best is None or score > best_score:
            best = candidate
            best_score = score
    if best is None or best_score is None:
        raise RuntimeError("No candidate available to choose from.")
    return best, best_score


def page_type_sort_key(page_type: str) -> tuple[int, str]:
    if page_type in PAGE_TYPE_ORDER:
        return PAGE_TYPE_ORDER.index(page_type), page_type
    return len(PAGE_TYPE_ORDER), page_type


def vector_style_description(top_components: list[str]) -> str:
    top_set = set(top_components)
    if {"has_carousel", "has_hub_cards", "has_pickup"}.issubset(top_set):
        return "リッチUI型"
    if {"has_carousel", "has_hub_cards"}.issubset(top_set):
        return "標準UI型"
    if "has_hub_cards" in top_set:
        return "シンプルUI型"
    return "最小UI型"


def initialize_output_directories(root: Path) -> None:
    (root / ".context/municipal-ui-research/data/derived/shallow_stats").mkdir(
        parents=True,
        exist_ok=True,
    )
    (root / "docs/municipal-ui-research/scripts").mkdir(parents=True, exist_ok=True)


def parse_args(root: Path) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Municipal UI Research STEP05 analysis runner",
    )
    parser.add_argument(
        "--observations-path",
        default=str(root / ".context/municipal-ui-research/data/derived/observations_shallow.csv"),
        help="Input observations CSV path",
    )
    parser.add_argument(
        "--roster-path",
        default=str(root / ".context/municipal-ui-research/data/derived/roster_300_with_pages.csv"),
        help="Input roster CSV path",
    )
    parser.add_argument(
        "--shallow-stats-dir",
        default=str(root / ".context/municipal-ui-research/data/derived/shallow_stats"),
        help="Output directory for shallow stats CSV files",
    )
    parser.add_argument(
        "--roster50-path",
        default=str(root / ".context/municipal-ui-research/data/derived/roster_50.csv"),
        help="Output path for selected 50 roster CSV",
    )
    parser.add_argument(
        "--report-path",
        default=str(root / ".context/municipal-ui-research/data/derived/selection_report_50.md"),
        help="Output path for selection report markdown",
    )
    parser.add_argument(
        "--baseline-roster50-path",
        default="",
        help="Optional baseline roster_50.csv path for stability comparison",
    )
    parser.add_argument(
        "--min-jaccard",
        type=float,
        default=None,
        help="Optional minimum Jaccard threshold against baseline roster",
    )
    return parser.parse_args()


def validate_and_normalize_observations(
    obs_rows: list[dict[str, str]],
    obs_headers: list[str],
    roster_rows: list[dict[str, str]],
) -> tuple[
    list[dict[str, object]],
    dict[str, list[dict[str, object]]],
    dict[str, dict[str, object]],
    list[str],
    list[str],
    dict[str, Counter],
]:
    roster_ids = {row["sample_id"] for row in roster_rows}
    obs_ids = {row["sample_id"] for row in obs_rows}

    unknown_sample_ids = sorted(obs_ids - roster_ids)
    if unknown_sample_ids:
        raise RuntimeError(
            "observations に roster 未登録 sample_id が含まれています: "
            + ", ".join(unknown_sample_ids)
        )

    if len(obs_headers) != 45:
        raise RuntimeError(f"observations の列数が45ではありません: {len(obs_headers)}")

    invalid_boolean_values: dict[str, Counter] = defaultdict(Counter)
    normalized_rows: list[dict[str, object]] = []
    by_sample_id: dict[str, list[dict[str, object]]] = defaultdict(list)

    for row in obs_rows:
        normalized = dict(row)

        for bool_col in BOOLEAN_COLUMNS:
            raw = (row.get(bool_col) or "").strip().lower()
            if raw not in {"true", "false"}:
                invalid_boolean_values[bool_col][row.get(bool_col) or ""] += 1
            normalized[bool_col] = raw == "true"

        for quality_col in QUALITY_ALLOWED:
            normalized[quality_col] = normalize_quality_value(
                quality_col,
                row.get(quality_col) or "",
            )

        normalized["http_status"] = (row.get("http_status") or "").strip()
        normalized_rows.append(normalized)
        by_sample_id[str(normalized["sample_id"])].append(normalized)

    top_rows: dict[str, dict[str, object]] = {}
    for roster_row in roster_rows:
        sample_id = roster_row["sample_id"]
        top_candidates = [
            row for row in by_sample_id.get(sample_id, []) if row.get("page_type") == "top"
        ]
        if not top_candidates:
            raise RuntimeError(f"sample_id={sample_id} に top ページ行がありません")
        top_rows[sample_id] = top_candidates[0]

    all_failed = []
    partial_failed = []
    for sample_id, rows in by_sample_id.items():
        successes = [is_http_success(str(row.get("http_status", ""))) for row in rows]
        if rows and all(not success for success in successes):
            all_failed.append(sample_id)
        elif any(successes) and any(not success for success in successes):
            partial_failed.append(sample_id)

    return (
        normalized_rows,
        by_sample_id,
        top_rows,
        sorted(all_failed),
        sorted(partial_failed),
        invalid_boolean_values,
    )


def task2_prevalence_by_page_type(
    normalized_rows: list[dict[str, object]],
) -> list[dict[str, object]]:
    rows_by_page_type: dict[str, list[dict[str, object]]] = defaultdict(list)
    for row in normalized_rows:
        rows_by_page_type[str(row["page_type"])].append(row)

    output_rows: list[dict[str, object]] = []
    page_types = sorted(rows_by_page_type.keys(), key=page_type_sort_key)

    for page_type in page_types:
        rows = rows_by_page_type[page_type]
        total = len(rows)
        for component in BOOLEAN_COLUMNS:
            true_count = sum(1 for row in rows if bool(row[component]))
            prevalence = true_count / total if total else 0.0
            output_rows.append(
                {
                    "page_type": page_type,
                    "component": component,
                    "true_count": true_count,
                    "total_count": total,
                    "prevalence": f"{prevalence:.3f}",
                }
            )

    return output_rows


def task3_variant_distribution(
    normalized_rows: list[dict[str, object]],
) -> list[dict[str, object]]:
    counts: Counter = Counter()

    for row in normalized_rows:
        page_type = str(row["page_type"])
        for variant_col in VARIANT_COLUMNS:
            raw = (row.get(variant_col) or "").strip()
            value = raw if raw else "unknown"
            counts[(page_type, variant_col, value)] += 1

    output_rows: list[dict[str, object]] = []
    for (page_type, variant_col, value), count in sorted(
        counts.items(),
        key=lambda item: (
            page_type_sort_key(item[0][0]),
            VARIANT_COLUMNS.index(item[0][1]),
            -item[1],
            item[0][2],
        ),
    ):
        output_rows.append(
            {
                "page_type": page_type,
                "variant_column": variant_col,
                "variant_value": value,
                "count": count,
            }
        )

    return output_rows


def task4_cms_distribution(top_rows: dict[str, dict[str, object]]) -> list[dict[str, object]]:
    cms_counts: Counter = Counter()

    for top_row in top_rows.values():
        normalized = normalize_cms_fingerprint(str(top_row.get("cms_fingerprint", "")))
        cms_counts[normalized] += 1

    output_rows = [
        {"cms_fingerprint": cms, "count": count}
        for cms, count in sorted(cms_counts.items(), key=lambda x: (-x[1], x[0]))
    ]
    return output_rows


def task5_a11y_maturity(
    roster_rows: list[dict[str, str]],
    by_sample_id: dict[str, list[dict[str, object]]],
    top_rows: dict[str, dict[str, object]],
) -> tuple[list[dict[str, object]], dict[str, int]]:
    output_rows: list[dict[str, object]] = []
    score_map: dict[str, int] = {}

    for roster_row in sorted(roster_rows, key=lambda r: r["sample_id"]):
        sample_id = roster_row["sample_id"]
        rows = by_sample_id[sample_id]
        top_row = top_rows[sample_id]

        has_skip_link_any = any(bool(row["has_skip_link"]) for row in rows)
        has_accessibility_link_any = any(bool(row["has_accessibility_link"]) for row in rows)
        heading_quality_good = top_row["heading_outline_score"] == "good"
        keyboard_risk_low = top_row["keyboard_nav_risk"] == "low"
        contrast_risk_low = top_row["contrast_risk_hint"] == "low"

        score = sum(
            [
                has_skip_link_any,
                has_accessibility_link_any,
                heading_quality_good,
                keyboard_risk_low,
                contrast_risk_low,
            ]
        )

        score_map[sample_id] = int(score)
        output_rows.append(
            {
                "sample_id": sample_id,
                "municipality_name": roster_row["municipality_name"],
                "a11y_maturity_score": int(score),
                "has_skip_link_any": str(has_skip_link_any).lower(),
                "has_accessibility_link_any": str(has_accessibility_link_any).lower(),
                "heading_quality_good": str(heading_quality_good).lower(),
                "keyboard_risk_low": str(keyboard_risk_low).lower(),
                "contrast_risk_low": str(contrast_risk_low).lower(),
            }
        )

    return output_rows, score_map


def task6_7_vectors_and_clustering(
    roster_rows: list[dict[str, str]],
    top_rows: dict[str, dict[str, object]],
    a11y_score_map: dict[str, int],
) -> tuple[
    list[dict[str, object]],
    dict[str, int],
    list[dict[str, object]],
    int,
    float,
]:
    ordered_roster = sorted(roster_rows, key=lambda r: r["sample_id"])

    vector_rows: list[dict[str, object]] = []
    matrix: list[list[int]] = []
    sample_ids: list[str] = []

    for roster_row in ordered_roster:
        sample_id = roster_row["sample_id"]
        top_row = top_rows[sample_id]

        cms = normalize_cms_fingerprint(str(top_row.get("cms_fingerprint", "")))

        if is_http_success(str(top_row.get("http_status", ""))):
            vector = [1 if bool(top_row[col]) else 0 for col in BOOLEAN_COLUMNS]
        else:
            vector = [0] * len(BOOLEAN_COLUMNS)

        vector_rows.append(
            {
                "sample_id": sample_id,
                "municipality_name": roster_row["municipality_name"],
                "layer": roster_row["layer"],
                "population_category": roster_row["population_category"],
                "region_block": roster_row["region_block"],
                "cms_fingerprint": cms,
                "a11y_maturity_score": a11y_score_map[sample_id],
                **{BOOLEAN_COLUMNS[i]: vector[i] for i in range(len(BOOLEAN_COLUMNS))},
                "cluster_id": -1,
            }
        )

        matrix.append(vector)
        sample_ids.append(sample_id)

    x = np.array(matrix, dtype=float)

    best_model: KMeans | None = None
    best_labels: np.ndarray | None = None
    best_k: int | None = None
    best_silhouette = float("-inf")

    for k in range(5, 11):
        model = KMeans(
            n_clusters=k,
            random_state=42,
            n_init=10,
            max_iter=300,
        )
        labels = model.fit_predict(x)

        if len(set(labels)) <= 1:
            silhouette = -1.0
        else:
            silhouette = float(silhouette_score(x, labels))

        if silhouette > best_silhouette:
            best_silhouette = silhouette
            best_model = model
            best_labels = labels
            best_k = k

    if best_model is None or best_labels is None or best_k is None:
        raise RuntimeError("クラスタリングに失敗しました")

    raw_centers = best_model.cluster_centers_
    sorted_old_ids = sorted(
        range(best_k),
        key=lambda old_id: tuple(-raw_centers[old_id, i] for i in range(len(BOOLEAN_COLUMNS))),
    )

    old_to_new = {old_id: new_id for new_id, old_id in enumerate(sorted_old_ids)}
    reordered_centers = np.array([raw_centers[old_id] for old_id in sorted_old_ids])

    cluster_by_sample_id: dict[str, int] = {}
    for sample_id, old_label in zip(sample_ids, best_labels):
        cluster_by_sample_id[sample_id] = old_to_new[int(old_label)]

    for row in vector_rows:
        row["cluster_id"] = cluster_by_sample_id[str(row["sample_id"])]

    cluster_sizes = Counter(cluster_by_sample_id.values())
    cluster_summary_rows: list[dict[str, object]] = []

    for cluster_id in range(best_k):
        center = reordered_centers[cluster_id]
        top_components = [
            BOOLEAN_COLUMNS[i]
            for i in np.argsort(center)[::-1]
            if center[i] >= 0.5
        ]
        if not top_components:
            top_components = [BOOLEAN_COLUMNS[i] for i in np.argsort(center)[::-1][:3]]

        missing_components = [
            BOOLEAN_COLUMNS[i] for i, value in enumerate(center) if value <= 0.2
        ]

        cluster_summary_rows.append(
            {
                "cluster_id": cluster_id,
                "size": cluster_sizes[cluster_id],
                "description": vector_style_description(top_components),
                "top_components": ",".join(top_components[:6]),
                "missing_components": ",".join(missing_components[:6]),
            }
        )

    return vector_rows, cluster_by_sample_id, cluster_summary_rows, best_k, best_silhouette


def build_municipality_records(
    roster_rows: list[dict[str, str]],
    top_rows: dict[str, dict[str, object]],
    a11y_score_map: dict[str, int],
    cluster_by_sample_id: dict[str, int],
    all_failed_ids: list[str],
    partial_failed_ids: list[str],
) -> list[MunicipalityRecord]:
    all_failed_set = set(all_failed_ids)
    partial_failed_set = set(partial_failed_ids)

    records = []
    for roster_row in sorted(roster_rows, key=lambda r: r["sample_id"]):
        sample_id = roster_row["sample_id"]
        top_row = top_rows[sample_id]
        records.append(
            MunicipalityRecord(
                sample_id=sample_id,
                municipality_name=roster_row["municipality_name"],
                layer=roster_row["layer"],
                population_category=roster_row["population_category"] or "unknown",
                region_block=roster_row["region_block"],
                cms_fingerprint=normalize_cms_fingerprint(str(top_row.get("cms_fingerprint", ""))),
                a11y_maturity_score=int(a11y_score_map[sample_id]),
                cluster_id=int(cluster_by_sample_id[sample_id]),
                all_pages_failed=sample_id in all_failed_set,
                partial_pages_failed=sample_id in partial_failed_set,
                roster_row=dict(roster_row),
            )
        )
    return records


def count_selected(selected: list[MunicipalityRecord]) -> dict[str, Counter]:
    return {
        "population": Counter(r.population_category for r in selected),
        "region": Counter(r.region_block for r in selected),
        "cluster": Counter(r.cluster_id for r in selected),
        "cms": Counter(r.cms_fingerprint for r in selected),
        "a11y": Counter(r.a11y_maturity_score for r in selected),
    }


def select_prefectures(
    records: list[MunicipalityRecord],
) -> tuple[list[MunicipalityRecord], dict[str, str], dict[str, str]]:
    candidates = [r for r in records if r.layer == "prefecture" and not r.all_pages_failed]

    selected: list[MunicipalityRecord] = []
    selected_ids: set[str] = set()
    short_reason: dict[str, str] = {}
    detail_reason: dict[str, str] = {}

    used_cms: Counter = Counter()
    used_cluster: Counter = Counter()

    for region in REGION_BLOCK_ORDER:
        pool = [c for c in candidates if c.region_block == region and c.sample_id not in selected_ids]
        if not pool:
            continue

        median_a11y = statistics.median(c.a11y_maturity_score for c in pool)

        def score_fn(c: MunicipalityRecord) -> tuple[float, ...]:
            cms_new = 1.0 if used_cms[c.cms_fingerprint] == 0 else 0.0
            cluster_new = 1.0 if used_cluster[c.cluster_id] == 0 else 0.0
            a11y_extreme = abs(c.a11y_maturity_score - median_a11y)
            partial_bonus = 0.5 if c.partial_pages_failed else 0.0
            return (cms_new + cluster_new, a11y_extreme, partial_bonus, c.a11y_maturity_score)

        chosen, _ = choose_best(pool, score_fn)
        selected.append(chosen)
        selected_ids.add(chosen.sample_id)
        used_cms[chosen.cms_fingerprint] += 1
        used_cluster[chosen.cluster_id] += 1

        short_reason[chosen.sample_id] = "pref_region_rep"
        detail_reason[chosen.sample_id] = (
            f"地域代表（{region}）として選定。"
            f"cluster={chosen.cluster_id}, a11y={chosen.a11y_maturity_score}, cms={chosen.cms_fingerprint}。"
            f"地域内中央値からの乖離を優先し多様性を確保。"
        )

    while len(selected) < 10:
        pool = [c for c in candidates if c.sample_id not in selected_ids]
        if not pool:
            raise RuntimeError("都道府県候補が不足しています")

        counts = count_selected(selected)

        def score_fn(c: MunicipalityRecord) -> tuple[float, ...]:
            cms_new = 1.0 if counts["cms"][c.cms_fingerprint] == 0 else 0.0
            cluster_rarity = -float(counts["cluster"][c.cluster_id])
            region_rarity = -float(counts["region"][c.region_block])
            a11y_extreme = abs(c.a11y_maturity_score - 2.5)
            return (cms_new, cluster_rarity, region_rarity, a11y_extreme)

        chosen, _ = choose_best(pool, score_fn)
        selected.append(chosen)
        selected_ids.add(chosen.sample_id)

        short_reason[chosen.sample_id] = "pref_balance_slot"
        detail_reason[chosen.sample_id] = (
            "偏り補正枠として追加。"
            f"region={chosen.region_block}, cluster={chosen.cluster_id}, "
            f"a11y={chosen.a11y_maturity_score}, cms={chosen.cms_fingerprint}。"
            "既選定のクラスタ/CMS偏りを緩和。"
        )

    return selected, short_reason, detail_reason


def allocate_step_a_cluster_quota(
    candidates: list[MunicipalityRecord],
    total: int,
) -> dict[int, int]:
    cluster_sizes = Counter(c.cluster_id for c in candidates)
    quota = {cluster_id: min(2, size) for cluster_id, size in cluster_sizes.items()}

    remaining = total - sum(quota.values())
    if remaining < 0:
        raise RuntimeError("Step A の最小クラスタ配分が total を超えています")

    while remaining > 0:
        assignable = [
            cluster_id
            for cluster_id, size in cluster_sizes.items()
            if quota[cluster_id] < size
        ]
        if not assignable:
            break

        best_cluster = max(
            assignable,
            key=lambda cid: (
                cluster_sizes[cid] - quota[cid],
                cluster_sizes[cid],
                -cid,
            ),
        )
        quota[best_cluster] += 1
        remaining -= 1

    return quota


def select_municipalities(
    records: list[MunicipalityRecord],
) -> tuple[
    list[MunicipalityRecord],
    list[MunicipalityRecord],
    list[MunicipalityRecord],
    dict[str, str],
    dict[str, str],
]:
    candidates = [r for r in records if r.layer == "municipality" and not r.all_pages_failed]

    selected: list[MunicipalityRecord] = []
    selected_ids: set[str] = set()

    step_a_selected: list[MunicipalityRecord] = []
    step_b_selected: list[MunicipalityRecord] = []
    step_c_selected: list[MunicipalityRecord] = []

    short_reason: dict[str, str] = {}
    detail_reason: dict[str, str] = {}

    quota = allocate_step_a_cluster_quota(candidates, total=25)

    for cluster_id in sorted(quota.keys()):
        for _ in range(quota[cluster_id]):
            pool = [
                c
                for c in candidates
                if c.cluster_id == cluster_id and c.sample_id not in selected_ids
            ]
            if not pool:
                continue

            counts = count_selected(selected)

            def score_fn(c: MunicipalityRecord) -> tuple[float, ...]:
                pop_need = 1.0 / (1.0 + counts["population"][c.population_category])
                region_need = 1.0 / (1.0 + counts["region"][c.region_block])
                cms_need = 1.0 / (1.0 + counts["cms"][c.cms_fingerprint])
                a11y_extreme = abs(c.a11y_maturity_score - 2.5) / 2.5
                partial_bonus = 0.2 if c.partial_pages_failed else 0.0
                return (
                    pop_need + region_need + cms_need + partial_bonus,
                    pop_need,
                    region_need,
                    cms_need,
                    a11y_extreme,
                )

            chosen, _ = choose_best(pool, score_fn)
            selected.append(chosen)
            step_a_selected.append(chosen)
            selected_ids.add(chosen.sample_id)

            short_reason[chosen.sample_id] = "muni_stepA_cluster_rep"
            detail_reason[chosen.sample_id] = (
                f"Step A（クラスタ代表）で選定。cluster={chosen.cluster_id}, "
                f"pop={chosen.population_category}, region={chosen.region_block}, "
                f"a11y={chosen.a11y_maturity_score}, cms={chosen.cms_fingerprint}。"
                "人口カテゴリ/地域の偏りが小さくなる候補を優先。"
            )

    pop_target = {"A": 3, "B": 5, "C": 5, "D": 3}
    region_target = {region: 2 for region in REGION_BLOCK_ORDER}

    for _ in range(10):
        pool = [c for c in candidates if c.sample_id not in selected_ids]
        if not pool:
            break

        counts = count_selected(selected)
        pop_deficit = {
            key: max(0, pop_target[key] - counts["population"][key]) for key in pop_target
        }
        region_deficit = {
            key: max(0, region_target[key] - counts["region"][key]) for key in region_target
        }

        def score_fn(c: MunicipalityRecord) -> tuple[float, ...]:
            pop_gap = float(pop_deficit.get(c.population_category, 0))
            region_gap = float(region_deficit.get(c.region_block, 0))
            cluster_rarity = 1.0 / (1.0 + counts["cluster"][c.cluster_id])
            cms_rarity = 1.0 / (1.0 + counts["cms"][c.cms_fingerprint])
            a11y_edge = 1.0 if c.a11y_maturity_score in (0, 5) else 0.0
            return (
                pop_gap + region_gap,
                pop_gap,
                region_gap,
                cluster_rarity,
                cms_rarity,
                a11y_edge,
            )

        chosen, _ = choose_best(pool, score_fn)
        selected.append(chosen)
        step_b_selected.append(chosen)
        selected_ids.add(chosen.sample_id)

        counts_after = count_selected(selected)
        pop_hit = pop_target.get(chosen.population_category)
        region_hit = region_target.get(chosen.region_block)
        covered = []
        if pop_hit is not None and counts_after["population"][chosen.population_category] <= pop_hit:
            covered.append(f"pop {chosen.population_category}")
        if region_hit is not None and counts_after["region"][chosen.region_block] <= region_hit:
            covered.append(f"region {chosen.region_block}")
        covered_text = ", ".join(covered) if covered else "多様性補完"

        short_reason[chosen.sample_id] = "muni_stepB_strata_fill"
        detail_reason[chosen.sample_id] = (
            f"Step B（層化条件補充）で選定。{covered_text} を補強。"
            f"cluster={chosen.cluster_id}, a11y={chosen.a11y_maturity_score}, cms={chosen.cms_fingerprint}。"
        )

    for _ in range(5):
        pool = [c for c in candidates if c.sample_id not in selected_ids]
        if not pool:
            break

        counts = count_selected(selected)
        missing_major_cms = {cms for cms in MAJOR_CMS if counts["cms"][cms] < 1}
        low_gap = max(0, 2 - sum(v for k, v in counts["a11y"].items() if k <= 1))
        high_gap = max(0, 2 - counts["a11y"][5])

        def score_fn(c: MunicipalityRecord) -> tuple[float, ...]:
            cms_need = 1.0 if c.cms_fingerprint in missing_major_cms else 0.0
            low_need = 1.0 if low_gap > 0 and c.a11y_maturity_score <= 1 else 0.0
            high_need = 1.0 if high_gap > 0 and c.a11y_maturity_score == 5 else 0.0
            cluster_rarity = 1.0 / (1.0 + counts["cluster"][c.cluster_id])
            region_rarity = 1.0 / (1.0 + counts["region"][c.region_block])
            pop_rarity = 1.0 / (1.0 + counts["population"][c.population_category])
            return (
                cms_need + low_need + high_need,
                cms_need,
                low_need,
                high_need,
                cluster_rarity,
                region_rarity,
                pop_rarity,
            )

        chosen, _ = choose_best(pool, score_fn)
        selected.append(chosen)
        step_c_selected.append(chosen)
        selected_ids.add(chosen.sample_id)

        tags = []
        if chosen.cms_fingerprint in missing_major_cms:
            tags.append(f"CMS:{chosen.cms_fingerprint}")
        if low_gap > 0 and chosen.a11y_maturity_score <= 1:
            tags.append("a11y_low")
        if high_gap > 0 and chosen.a11y_maturity_score == 5:
            tags.append("a11y_high")
        tag_text = ", ".join(tags) if tags else "多様性補完"

        short_reason[chosen.sample_id] = "muni_stepC_diversity_fill"
        detail_reason[chosen.sample_id] = (
            f"Step C（多様性補完）で選定。{tag_text} を補強。"
            f"cluster={chosen.cluster_id}, pop={chosen.population_category}, region={chosen.region_block}。"
        )

    if len(selected) < 40:
        # ソフト制約は既に反映済みなので、残りは総合多様性で補完
        while len(selected) < 40:
            pool = [c for c in candidates if c.sample_id not in selected_ids]
            if not pool:
                break
            counts = count_selected(selected)

            def score_fn(c: MunicipalityRecord) -> tuple[float, ...]:
                return (
                    1.0 / (1.0 + counts["cluster"][c.cluster_id]),
                    1.0 / (1.0 + counts["cms"][c.cms_fingerprint]),
                    1.0 / (1.0 + counts["region"][c.region_block]),
                    1.0 / (1.0 + counts["population"][c.population_category]),
                )

            chosen, _ = choose_best(pool, score_fn)
            selected.append(chosen)
            step_c_selected.append(chosen)
            selected_ids.add(chosen.sample_id)
            short_reason[chosen.sample_id] = "muni_stepC_backfill"
            detail_reason[chosen.sample_id] = (
                "Step C 補完で選定。"
                f"cluster={chosen.cluster_id}, cms={chosen.cms_fingerprint}, "
                f"a11y={chosen.a11y_maturity_score}。"
            )

    if len(selected) != 40:
        raise RuntimeError(f"市区町村選定数が40件になりませんでした: {len(selected)}")

    return step_a_selected, step_b_selected, step_c_selected, short_reason, detail_reason


def build_roster_50_rows(
    selected_records: list[MunicipalityRecord],
    short_reason: dict[str, str],
) -> list[dict[str, str]]:
    output_rows: list[dict[str, str]] = []

    for record in selected_records:
        row = {col: record.roster_row.get(col, "") for col in ROSTER_COLUMNS}
        row["selection_reason"] = short_reason.get(record.sample_id, row.get("selection_reason", ""))

        notes = (row.get("notes") or "").strip()
        step_note = f"STEP05:{row['selection_reason']}"
        row["notes"] = f"{notes} | {step_note}" if notes else step_note

        output_rows.append(row)

    return output_rows


def markdown_table(headers: list[str], rows: list[list[object]]) -> str:
    head = "| " + " | ".join(headers) + " |"
    sep = "| " + " | ".join(["---"] * len(headers)) + " |"
    body = ["| " + " | ".join(str(cell) for cell in row) + " |" for row in rows]
    return "\n".join([head, sep, *body])


def build_selection_report(
    report_path: Path,
    normalized_rows: list[dict[str, object]],
    prevalence_rows: list[dict[str, object]],
    cms_distribution_rows: list[dict[str, object]],
    cluster_summary_rows: list[dict[str, object]],
    best_k: int,
    best_silhouette: float,
    records: list[MunicipalityRecord],
    all_failed_ids: list[str],
    prefecture_selected: list[MunicipalityRecord],
    municipality_step_a: list[MunicipalityRecord],
    municipality_step_b: list[MunicipalityRecord],
    municipality_step_c: list[MunicipalityRecord],
    detail_reason: dict[str, str],
    stability_info: dict[str, object] | None = None,
) -> None:
    selected_municipalities = municipality_step_a + municipality_step_b + municipality_step_c
    selected_all = prefecture_selected + selected_municipalities

    overall_total = len(normalized_rows)
    overall_component_prevalence = []
    for comp in BOOLEAN_COLUMNS:
        true_count = sum(1 for row in normalized_rows if bool(row[comp]))
        overall_component_prevalence.append((comp, true_count, true_count / overall_total))

    overall_component_prevalence.sort(key=lambda x: x[2], reverse=True)
    top_components = overall_component_prevalence[:5]
    bottom_components = sorted(overall_component_prevalence, key=lambda x: x[2])[:5]

    page_type_patterns = []
    for page_type in sorted({str(r["page_type"]) for r in normalized_rows}, key=page_type_sort_key):
        page_rows = [r for r in prevalence_rows if r["page_type"] == page_type]
        page_rows_sorted = sorted(page_rows, key=lambda r: float(str(r["prevalence"])), reverse=True)
        top3 = ", ".join(r["component"] for r in page_rows_sorted[:3])
        page_type_patterns.append((page_type, top3))

    cms_top10 = cms_distribution_rows[:10]

    cross_counter = Counter((r.cluster_id, r.population_category) for r in records)
    cluster_ids = sorted({r.cluster_id for r in records})

    cluster_cross_rows = []
    for cluster_id in cluster_ids:
        row = [cluster_id]
        total = 0
        for pop in POPULATION_ORDER:
            value = cross_counter[(cluster_id, pop)]
            row.append(value)
            total += value
        row.append(total)
        cluster_cross_rows.append(row)

    pref_rows = []
    for r in prefecture_selected:
        pref_rows.append(
            [
                r.sample_id,
                r.municipality_name,
                r.region_block,
                r.cluster_id,
                r.a11y_maturity_score,
                r.cms_fingerprint,
                detail_reason[r.sample_id],
            ]
        )

    def municipality_rows_table(rows: list[MunicipalityRecord]) -> list[list[object]]:
        return [
            [
                r.sample_id,
                r.municipality_name,
                r.population_category,
                r.region_block,
                r.cluster_id,
                r.a11y_maturity_score,
                r.cms_fingerprint,
                detail_reason[r.sample_id],
            ]
            for r in rows
        ]

    selected_counts = count_selected(selected_all)
    municipality_counts = count_selected(selected_municipalities)

    layer_counts = Counter(r.layer for r in selected_all)

    soft_checks: list[tuple[str, str, str]] = []

    for pop in POPULATION_ORDER:
        count = selected_counts["population"][pop]
        status = "達成" if count >= 1 else "未達"
        reason = "" if status == "達成" else "候補不足または優先度調整"
        soft_checks.append((f"population_category {pop} >= 1", status, reason))

    for region in REGION_BLOCK_ORDER:
        count = selected_counts["region"][region]
        status = "達成" if count >= 1 else "未達"
        reason = "" if status == "達成" else "候補不足または優先度調整"
        soft_checks.append((f"region_block {region} >= 1", status, reason))

    for cluster_id in range(best_k):
        count = selected_counts["cluster"][cluster_id]
        status = "達成" if count >= 2 else "未達"
        reason = "" if status == "達成" else "選定可能候補が少数"
        soft_checks.append((f"cluster {cluster_id} >= 2", status, reason))

    for cms in MAJOR_CMS:
        count = selected_counts["cms"][cms]
        status = "達成" if count >= 1 else "未達"
        reason = "" if status == "達成" else "候補不足または他制約優先"
        soft_checks.append((f"CMS {cms} >= 1", status, reason))

    low_count = sum(v for k, v in selected_counts["a11y"].items() if k <= 1)
    high_count = selected_counts["a11y"][5]
    soft_checks.append(("a11y 0-1 >= 2", "達成" if low_count >= 2 else "未達", "" if low_count >= 2 else "候補不足"))
    soft_checks.append(("a11y 5 >= 2", "達成" if high_count >= 2 else "未達", "" if high_count >= 2 else "候補不足"))

    report_lines = [
        "# STEP05 50自治体選定レポート",
        "",
        "## 1. 集計サマリー",
        f"- 入力観測行数: {len(normalized_rows)}",
        f"- 除外（全ページ取得失敗）: {len(all_failed_ids)} 件（{', '.join(all_failed_ids) if all_failed_ids else 'なし'}）",
        "- UIコンポーネント出現率 上位5:",
    ]

    for comp, count, prev in top_components:
        report_lines.append(f"  - {comp}: {count}/{overall_total} ({prev:.3f})")

    report_lines.append("- UIコンポーネント出現率 下位5:")
    for comp, count, prev in bottom_components:
        report_lines.append(f"  - {comp}: {count}/{overall_total} ({prev:.3f})")

    report_lines.append("- ページタイプ別の特徴（上位3コンポーネント）:")
    for page_type, tops in page_type_patterns:
        report_lines.append(f"  - {page_type}: {tops}")

    report_lines.append("- CMS分布上位10:")
    for row in cms_top10:
        report_lines.append(f"  - {row['cms_fingerprint']}: {row['count']}")

    report_lines.extend(
        [
            "",
            "## 2. クラスタリング結果",
            f"- 最適クラスタ数: {best_k}",
            f"- シルエットスコア: {best_silhouette:.4f}",
            "",
            markdown_table(
                ["cluster_id", "size", "description", "top_components", "missing_components"],
                [
                    [
                        row["cluster_id"],
                        row["size"],
                        row["description"],
                        row["top_components"],
                        row["missing_components"],
                    ]
                    for row in cluster_summary_rows
                ],
            ),
            "",
            "- クラスタ × population_category クロス集計:",
            "",
            markdown_table(
                ["cluster", *POPULATION_ORDER, "total"],
                cluster_cross_rows,
            ),
            "",
            "## 3. 都道府県 10件の選定",
            "",
            markdown_table(
                [
                    "sample_id",
                    "municipality_name",
                    "region_block",
                    "cluster_id",
                    "a11y_score",
                    "cms",
                    "選定理由",
                ],
                pref_rows,
            ),
            "",
            "- 地域バランス（都道府県10件）:",
            "",
            markdown_table(
                ["region_block", "count"],
                [
                    [region, Counter(r.region_block for r in prefecture_selected)[region]]
                    for region in REGION_BLOCK_ORDER
                ],
            ),
            "",
            "## 4. 市区町村 40件の選定",
            "",
            "### Step A: クラスタ代表（25件）",
            "",
            markdown_table(
                [
                    "sample_id",
                    "municipality_name",
                    "pop",
                    "region",
                    "cluster",
                    "a11y",
                    "cms",
                    "選定理由",
                ],
                municipality_rows_table(municipality_step_a),
            ),
            "",
            "### Step B: 層化条件充足（10件）",
            "",
            markdown_table(
                [
                    "sample_id",
                    "municipality_name",
                    "pop",
                    "region",
                    "cluster",
                    "a11y",
                    "cms",
                    "選定理由",
                ],
                municipality_rows_table(municipality_step_b),
            ),
            "",
            "### Step C: 多様性補完（5件）",
            "",
            markdown_table(
                [
                    "sample_id",
                    "municipality_name",
                    "pop",
                    "region",
                    "cluster",
                    "a11y",
                    "cms",
                    "選定理由",
                ],
                municipality_rows_table(municipality_step_c),
            ),
            "",
            "## 5. 手動調整履歴",
            "- 差し替え: なし（自動選定ロジックで完結）",
            "",
            "## 6. 層化条件の最終確認",
            f"- layer 分布: prefecture={layer_counts['prefecture']}, municipality={layer_counts['municipality']}",
            "",
            "- population_category 分布（50件）:",
            "",
            markdown_table(
                ["category", "count"],
                [[cat, selected_counts["population"][cat]] for cat in POPULATION_ORDER],
            ),
            "",
            "- region_block 分布（50件）:",
            "",
            markdown_table(
                ["region_block", "count"],
                [[region, selected_counts["region"][region]] for region in REGION_BLOCK_ORDER],
            ),
            "",
            "- cluster 分布（50件）:",
            "",
            markdown_table(
                ["cluster_id", "count"],
                [[cid, selected_counts["cluster"][cid]] for cid in sorted(selected_counts["cluster"].keys())],
            ),
            "",
            "- CMS 分布（50件）:",
            "",
            markdown_table(
                ["cms", "count"],
                [
                    [cms, selected_counts["cms"][cms]]
                    for cms, _ in sorted(
                        selected_counts["cms"].items(),
                        key=lambda x: (-x[1], x[0]),
                    )
                ],
            ),
            "",
            "- a11y_maturity_score 分布（50件）:",
            "",
            markdown_table(
                ["score", "count"],
                [
                    [score, selected_counts["a11y"][score]]
                    for score in sorted(selected_counts["a11y"].keys())
                ],
            ),
            "",
            "- 市区町村40件の補助分布（Step要件確認）:",
            "",
            markdown_table(
                ["population_category", "count"],
                [[cat, municipality_counts["population"][cat]] for cat in POPULATION_ORDER],
            ),
            "",
            markdown_table(
                ["region_block", "count"],
                [[region, municipality_counts["region"][region]] for region in REGION_BLOCK_ORDER],
            ),
            "",
            "- ソフト制約の達成状況:",
            "",
            markdown_table(
                ["constraint", "status", "note"],
                [[constraint, status, note] for constraint, status, note in soft_checks],
            ),
            "",
            "- 選定安定性（前回比較）:",
            "",
            markdown_table(
                ["metric", "value"],
                (
                    [
                        ["baseline_path", stability_info["baseline_path"]],
                        ["jaccard", f"{stability_info['jaccard']:.4f}"],
                        ["diff_out", stability_info["diff_out"]],
                        ["diff_in", stability_info["diff_in"]],
                    ]
                    if stability_info
                    else [["baseline_path", "none"], ["jaccard", "n/a"], ["diff_out", "n/a"], ["diff_in", "n/a"]]
                ),
            ),
            "",
        ]
    )

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(report_lines), encoding="utf-8")


def main() -> None:
    root = Path(__file__).resolve().parents[3]
    initialize_output_directories(root)
    args = parse_args(root)

    observations_path = Path(args.observations_path)
    roster_path = Path(args.roster_path)

    shallow_stats_dir = Path(args.shallow_stats_dir)
    roster_50_path = Path(args.roster50_path)
    report_path = Path(args.report_path)

    obs_rows, obs_headers = read_csv(observations_path)
    roster_rows, roster_headers = read_csv(roster_path)

    if len(roster_headers) != 15:
        raise RuntimeError(f"roster の列数が15ではありません: {len(roster_headers)}")

    (
        normalized_rows,
        by_sample_id,
        top_rows,
        all_failed_ids,
        partial_failed_ids,
        invalid_boolean_values,
    ) = validate_and_normalize_observations(obs_rows, obs_headers, roster_rows)

    if invalid_boolean_values:
        print("[warn] boolean列に不正値あり（falseとして扱い）")
        for col, values in invalid_boolean_values.items():
            detail = ", ".join(f"{repr(k)}:{v}" for k, v in values.items())
            print(f"  - {col}: {detail}")

    prevalence_rows = task2_prevalence_by_page_type(normalized_rows)
    write_csv(
        shallow_stats_dir / "prevalence_by_page_type.csv",
        ["page_type", "component", "true_count", "total_count", "prevalence"],
        prevalence_rows,
    )

    variant_rows = task3_variant_distribution(normalized_rows)
    write_csv(
        shallow_stats_dir / "variant_distribution.csv",
        ["page_type", "variant_column", "variant_value", "count"],
        variant_rows,
    )

    cms_distribution_rows = task4_cms_distribution(top_rows)
    write_csv(
        shallow_stats_dir / "cms_distribution.csv",
        ["cms_fingerprint", "count"],
        cms_distribution_rows,
    )

    a11y_rows, a11y_score_map = task5_a11y_maturity(roster_rows, by_sample_id, top_rows)
    write_csv(
        shallow_stats_dir / "a11y_maturity.csv",
        [
            "sample_id",
            "municipality_name",
            "a11y_maturity_score",
            "has_skip_link_any",
            "has_accessibility_link_any",
            "heading_quality_good",
            "keyboard_risk_low",
            "contrast_risk_low",
        ],
        a11y_rows,
    )

    (
        vector_rows,
        cluster_by_sample_id,
        cluster_summary_rows,
        best_k,
        best_silhouette,
    ) = task6_7_vectors_and_clustering(roster_rows, top_rows, a11y_score_map)

    write_csv(
        shallow_stats_dir / "ui_structure_vectors.csv",
        [
            "sample_id",
            "municipality_name",
            "layer",
            "population_category",
            "region_block",
            "cms_fingerprint",
            "a11y_maturity_score",
            *BOOLEAN_COLUMNS,
            "cluster_id",
        ],
        vector_rows,
    )

    write_csv(
        shallow_stats_dir / "cluster_summary.csv",
        ["cluster_id", "size", "description", "top_components", "missing_components"],
        cluster_summary_rows,
    )

    records = build_municipality_records(
        roster_rows,
        top_rows,
        a11y_score_map,
        cluster_by_sample_id,
        all_failed_ids,
        partial_failed_ids,
    )

    prefecture_selected, pref_short_reason, pref_detail_reason = select_prefectures(records)
    municipality_step_a, municipality_step_b, municipality_step_c, muni_short_reason, muni_detail_reason = select_municipalities(records)

    municipality_selected = municipality_step_a + municipality_step_b + municipality_step_c
    selected_all = prefecture_selected + municipality_selected

    if len(selected_all) != 50:
        raise RuntimeError(f"最終選定件数が50件ではありません: {len(selected_all)}")

    layer_counts = Counter(r.layer for r in selected_all)
    if layer_counts["prefecture"] != 10 or layer_counts["municipality"] != 40:
        raise RuntimeError(
            "ハード制約違反: "
            f"prefecture={layer_counts['prefecture']} municipality={layer_counts['municipality']}"
        )

    short_reason = {**pref_short_reason, **muni_short_reason}
    detail_reason = {**pref_detail_reason, **muni_detail_reason}

    selected_ids = {record.sample_id for record in selected_all}
    baseline_path: Path | None = None
    if args.baseline_roster50_path:
        baseline_path = Path(args.baseline_roster50_path)
    elif roster_50_path.exists():
        baseline_path = roster_50_path

    stability_info: dict[str, object] | None = None
    if baseline_path and baseline_path.exists():
        baseline_ids = read_roster_sample_ids(baseline_path)
        union_count = len(selected_ids | baseline_ids)
        intersect_count = len(selected_ids & baseline_ids)
        jaccard = intersect_count / union_count if union_count else 1.0
        diff_out = len(baseline_ids - selected_ids)
        diff_in = len(selected_ids - baseline_ids)
        stability_info = {
            "baseline_path": str(baseline_path),
            "jaccard": jaccard,
            "diff_out": diff_out,
            "diff_in": diff_in,
        }

        if args.min_jaccard is not None and jaccard < args.min_jaccard:
            raise RuntimeError(
                f"Jaccard({jaccard:.4f}) が閾値 {args.min_jaccard:.4f} を下回りました"
            )

    roster_50_rows = build_roster_50_rows(selected_all, short_reason)
    write_csv(roster_50_path, ROSTER_COLUMNS, roster_50_rows)

    build_selection_report(
        report_path=report_path,
        normalized_rows=normalized_rows,
        prevalence_rows=prevalence_rows,
        cms_distribution_rows=cms_distribution_rows,
        cluster_summary_rows=cluster_summary_rows,
        best_k=best_k,
        best_silhouette=best_silhouette,
        records=records,
        all_failed_ids=all_failed_ids,
        prefecture_selected=prefecture_selected,
        municipality_step_a=municipality_step_a,
        municipality_step_b=municipality_step_b,
        municipality_step_c=municipality_step_c,
        detail_reason=detail_reason,
        stability_info=stability_info,
    )

    print("STEP05 analysis completed")
    print(f"- roster_50: {roster_50_path}")
    print(f"- selection_report_50: {report_path}")
    print(f"- shallow_stats dir: {shallow_stats_dir}")
    print(f"- excluded all-failed sample_ids: {', '.join(all_failed_ids) if all_failed_ids else 'none'}")
    print(f"- chosen_k={best_k}, silhouette={best_silhouette:.4f}")
    if stability_info:
        print(
            "- stability: "
            f"jaccard={stability_info['jaccard']:.4f} "
            f"diff_out={stability_info['diff_out']} "
            f"diff_in={stability_info['diff_in']} "
            f"baseline={stability_info['baseline_path']}"
        )


if __name__ == "__main__":
    main()

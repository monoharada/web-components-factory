#!/usr/bin/env python3
"""Retry shallow observations for specific sample_ids and output a patched CSV."""

from __future__ import annotations

import argparse
import csv
import re
import socket
import ssl
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from bs4 import BeautifulSoup

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

USER_AGENT = "Mozilla/5.0 (compatible; municipal-ui-step05-retry/1.0)"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        default=".context/municipal-ui-research/data/derived/observations_shallow.csv",
        help="Input observations CSV path",
    )
    parser.add_argument(
        "--output",
        default=".context/municipal-ui-research/data/derived/observations_shallow_retried.csv",
        help="Output observations CSV path",
    )
    parser.add_argument(
        "--sample-ids",
        default="S0225,S0244",
        help="Comma separated sample_id list to retry",
    )
    parser.add_argument("--timeout", type=int, default=20, help="Per-request timeout seconds")
    parser.add_argument(
        "--retry-only-failed",
        dest="retry_only_failed",
        action="store_true",
        default=True,
        help="Retry only rows whose http_status is not 200 (default)",
    )
    parser.add_argument(
        "--retry-all-target-rows",
        dest="retry_only_failed",
        action="store_false",
        help="Retry all rows for target sample_ids",
    )
    parser.add_argument(
        "--on-retry-failure",
        choices=["keep_original", "normalize"],
        default="keep_original",
        help="How to handle rows when retry fails",
    )
    return parser.parse_args()


def decode_html(raw: bytes, headers: Any) -> str:
    charset = ""
    try:
        charset = headers.get_content_charset() or ""
    except Exception:
        charset = ""

    if not charset:
        head = raw[:5000]
        match = re.search(br"charset\s*=\s*[\"']?([a-zA-Z0-9_\-]+)", head, re.IGNORECASE)
        if match:
            charset = match.group(1).decode("ascii", errors="ignore")

    candidates = [charset, "utf-8", "cp932", "shift_jis", "euc-jp"]
    seen = set()
    for cand in candidates:
        if not cand:
            continue
        key = cand.lower()
        if key in seen:
            continue
        seen.add(key)
        try:
            return raw.decode(cand, errors="strict")
        except Exception:
            continue
    return raw.decode("utf-8", errors="ignore")


def build_candidate_urls(url: str) -> list[str]:
    parsed = urllib.parse.urlparse(url)
    candidates = [url]
    if parsed.scheme.lower() == "https":
        http_url = parsed._replace(scheme="http").geturl()
        if http_url not in candidates:
            candidates.append(http_url)
    return candidates


def fetch_url_with_fallback(url: str, timeout: int) -> dict[str, str]:
    errors: list[str] = []

    for candidate in build_candidate_urls(url):
        request = urllib.request.Request(candidate, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                status_code = str(getattr(response, "status", "") or response.getcode() or "")
                body = response.read()
                html = decode_html(body, response.headers)
                return {
                    "http_status": status_code or "200",
                    "final_url": response.geturl() or candidate,
                    "html": html,
                    "error": "",
                }
        except urllib.error.HTTPError as e:
            body = b""
            try:
                body = e.read()
            except Exception:
                body = b""
            html = decode_html(body, e.headers) if body else ""
            return {
                "http_status": str(e.code),
                "final_url": e.geturl() or candidate,
                "html": html,
                "error": f"HTTPError:{e.code}",
            }
        except urllib.error.URLError as e:
            reason = str(e.reason)
            errors.append(f"{candidate}:URLError:{reason}")
            continue
        except TimeoutError:
            errors.append(f"{candidate}:TimeoutError")
            continue
        except ssl.SSLError as e:
            errors.append(f"{candidate}:SSLError:{e}")
            continue
        except socket.gaierror as e:
            errors.append(f"{candidate}:gaierror:{e}")
            continue
        except Exception as e:  # noqa: BLE001
            errors.append(f"{candidate}:{type(e).__name__}:{e}")
            continue

    return {
        "http_status": "dns_error",
        "final_url": "",
        "html": "",
        "error": "; ".join(errors[:4]),
    }


def normalize_text(value: str) -> str:
    return " ".join((value or "").split())


def text_in_links(soup: BeautifulSoup) -> str:
    return " ".join(normalize_text(a.get_text(" ", strip=True)) for a in soup.select("a"))


def attr_blob(tag: Any) -> str:
    attrs = []
    for key in ["id", "class", "role", "aria-label"]:
        value = tag.get(key)
        if isinstance(value, list):
            attrs.extend(str(v) for v in value)
        elif value:
            attrs.append(str(value))
    return " ".join(attrs).lower()


def detect_flags(soup: BeautifulSoup, html: str) -> dict[str, bool]:
    doc_text = normalize_text(soup.get_text(" ", strip=True))
    links_text = normalize_text(text_in_links(soup))
    html_lower = html.lower()

    def has_keyword_attr(keywords: list[str], tag_name: str | None = None) -> bool:
        tags = soup.find_all(tag_name) if tag_name else soup.find_all(True)
        for tag in tags:
            blob = attr_blob(tag)
            if any(k in blob for k in keywords):
                return True
        return False

    has_skip_link = False
    for a in soup.select("a[href]"):
        href = (a.get("href") or "").strip()
        if not href.startswith("#"):
            continue
        text = normalize_text(a.get_text(" ", strip=True))
        if not text:
            continue
        if any(k in text for k in ["本文", "メイン", "先頭"]) or "skip" in text.lower():
            has_skip_link = True
            break

    has_header_brand = bool(
        soup.select_one("header")
        or has_keyword_attr(["logo", "brand", "site-title", "site_name"])
    )

    nav_tags = soup.select("nav")
    has_global_nav = any(len(nav.select("a[href]")) >= 3 for nav in nav_tags) or has_keyword_attr(
        ["global", "gnav", "main-nav", "gmenu"],
        "nav",
    )

    has_search = bool(
        soup.select_one("input[type='search']")
        or soup.select_one("form[action*='search']")
        or soup.select_one("input[name='q']")
        or soup.select_one("input[name='s']")
        or has_keyword_attr(["search", "kensaku"])
    )

    has_breadcrumb = bool(
        has_keyword_attr(["breadcrumb", "pankuzu", "bread"], "nav")
        or soup.select_one("ol.breadcrumb")
        or soup.select_one("ul.breadcrumb")
        or soup.select_one("nav[aria-label*='パンくず']")
    )

    has_local_nav = has_keyword_attr(["local", "side", "subnav", "sidenav"], "nav")

    has_emergency_notice = any(k in doc_text for k in ["緊急", "災害", "重要なお知らせ", "防災情報"]) or bool(
        has_keyword_attr(["alert", "emergency", "disaster", "saigai"]) 
    )

    has_news_list = any(k in doc_text for k in ["新着", "お知らせ", "ニュース"]) or bool(
        has_keyword_attr(["news", "oshirase", "whatsnew"])
    )

    has_pickup = has_keyword_attr(["pickup", "pick-up", "feature"])

    has_carousel = bool(
        has_keyword_attr(["carousel", "slider", "swiper", "slick"]) or "camera.min.js" in html_lower
    )

    has_hub_cards = has_keyword_attr(["card", "tile", "panel", "feature-list"]) and len(
        soup.select("a[href]")
    ) >= 8

    has_footer_policies = bool(
        soup.select_one("footer")
        and any(k in links_text for k in ["個人情報", "利用規約", "著作権", "サイトポリシー", "privacy", "policy"])
    )

    has_accessibility_link = any(k in links_text for k in ["アクセシビリティ", "ウェブアクセシビリティ", "accessibility"])

    has_contact_info = bool(
        re.search(r"\b\d{2,4}-\d{2,4}-\d{3,4}\b", doc_text)
        or "mailto:" in html_lower
        or "お問い合わせ" in doc_text
    )

    has_contact_form = False
    for form in soup.select("form"):
        inputs = " ".join((i.get("name") or "") for i in form.select("input[name],textarea[name]"))
        action = (form.get("action") or "").lower()
        if any(k in inputs.lower() for k in ["name", "mail", "email", "message", "inquiry", "toiawase"]):
            has_contact_form = True
            break
        if any(k in action for k in ["contact", "inquiry", "toiawase"]):
            has_contact_form = True
            break

    has_article_meta = bool(
        soup.select_one("time")
        or has_keyword_attr(["date", "updated", "post-meta", "article-meta"])
        or any(k in doc_text for k in ["更新日", "公開日", "投稿日"])
    )

    has_toc = bool(
        has_keyword_attr(["toc", "table-of-contents", "mokuji"])
        or "目次" in doc_text
    )

    has_attachments = any(
        (a.get("href") or "").lower().split("?")[0].endswith(
            (".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip")
        )
        for a in soup.select("a[href]")
    ) or any(k in doc_text for k in ["添付", "ダウンロード", "資料"])

    return {
        "has_skip_link": has_skip_link,
        "has_header_brand": has_header_brand,
        "has_global_nav": has_global_nav,
        "has_search": has_search,
        "has_breadcrumb": has_breadcrumb,
        "has_local_nav": has_local_nav,
        "has_emergency_notice": has_emergency_notice,
        "has_news_list": has_news_list,
        "has_pickup": has_pickup,
        "has_carousel": has_carousel,
        "has_hub_cards": has_hub_cards,
        "has_footer_policies": has_footer_policies,
        "has_accessibility_link": has_accessibility_link,
        "has_contact_info": has_contact_info,
        "has_contact_form": has_contact_form,
        "has_article_meta": has_article_meta,
        "has_toc": has_toc,
        "has_attachments": has_attachments,
    }


def detect_variants(soup: BeautifulSoup, html: str, flags: dict[str, bool]) -> dict[str, str]:
    variants = {
        "global_nav_variant": "",
        "search_variant": "",
        "emergency_variant": "",
        "hub_cards_variant": "",
        "contact_form_variant": "",
        "attachments_variant": "",
    }

    if flags["has_global_nav"]:
        if soup.select("nav ul ul"):
            variants["global_nav_variant"] = "dropdown"
        else:
            variants["global_nav_variant"] = "horizontal"

    if flags["has_search"]:
        html_lower = html.lower()
        if "google.com/cse" in html_lower or "gsc-search" in html_lower:
            variants["search_variant"] = "google_cse"
        elif soup.select_one("header form"):
            variants["search_variant"] = "header_form"
        else:
            variants["search_variant"] = "onsite_form"

    if flags["has_emergency_notice"]:
        if soup.select("[class*='alert'],[class*='banner'],[id*='alert']"):
            variants["emergency_variant"] = "banner"
        else:
            variants["emergency_variant"] = "inline"

    if flags["has_hub_cards"]:
        if soup.select("[class*='grid'],[class*='row'],[class*='col']"):
            variants["hub_cards_variant"] = "grid"
        else:
            variants["hub_cards_variant"] = "list"

    if flags["has_contact_form"]:
        variants["contact_form_variant"] = "embedded"

    if flags["has_attachments"]:
        variants["attachments_variant"] = "file_links"

    return variants


def infer_heading_outline_score(soup: BeautifulSoup) -> str:
    headings = [int(h.name[1]) for h in soup.find_all(re.compile(r"^h[1-6]$"))]
    if not headings:
        return "poor"
    if headings.count(1) == 0:
        return "poor"

    jump = False
    for prev, cur in zip(headings, headings[1:]):
        if cur - prev > 1:
            jump = True
            break
    if jump:
        return "fair"
    return "good"


def infer_keyboard_nav_risk(flags: dict[str, bool]) -> str:
    if flags["has_skip_link"] and flags["has_global_nav"]:
        return "low"
    if flags["has_global_nav"]:
        return "medium"
    return "high"


def infer_cms_fingerprint(html: str, existing: str) -> str:
    lower = html.lower()
    if "wp-content" in lower or "wordpress" in lower:
        return "WordPress"
    if "joruri" in lower:
        return "Joruri"
    if "kanaboweb" in lower:
        return "KanaboWeb"
    if "smart_cms" in lower or "smart cms" in lower:
        return "SMART CMS"
    if re.search(r"\bfi\.js\b|\bfi\b", lower):
        return "FI"
    return existing or "custom"


def to_bool_str(value: bool) -> str:
    return "true" if value else "false"


def should_retry_row(row: dict[str, str], retry_only_failed: bool) -> bool:
    if not retry_only_failed:
        return True
    return (row.get("http_status") or "").strip() != "200"


def normalize_failed_row(
    original_row: dict[str, str],
    result: dict[str, str],
) -> dict[str, str]:
    row = dict(original_row)
    row["captured_at"] = now_iso()
    row["http_status"] = result["http_status"]
    row["final_url"] = result["final_url"]
    row["page_title"] = ""
    row["lang_attr"] = ""
    row["cms_fingerprint"] = "unknown"
    row["theme_vendor_hint"] = ""
    row["accessibility_url"] = ""
    row["heading_outline_score"] = "unknown"
    row["keyboard_nav_risk"] = "unknown"
    row["contrast_risk_hint"] = "unknown"
    row["evidence_dom_snippets_path"] = ""
    row["screenshot_path"] = ""
    row["notes"] = f"retry_failed:{result['error']}"

    for col in BOOLEAN_COLUMNS:
        row[col] = "false"
    for col in VARIANT_COLUMNS:
        row[col] = ""

    return row


def patch_row(row: dict[str, str], timeout: int, on_retry_failure: str) -> dict[str, str]:
    original_row = dict(row)
    page_url = (original_row.get("page_url") or "").strip()
    if not page_url:
        return original_row

    result = fetch_url_with_fallback(page_url, timeout)

    row = dict(original_row)
    row["captured_at"] = now_iso()
    row["http_status"] = result["http_status"]
    row["final_url"] = result["final_url"]

    if result["http_status"] != "200":
        if on_retry_failure == "normalize":
            return normalize_failed_row(original_row, result)
        return original_row

    soup = BeautifulSoup(result["html"], "html.parser")

    row["page_title"] = normalize_text(soup.title.get_text(" ", strip=True)) if soup.title else ""
    html_tag = soup.find("html")
    row["lang_attr"] = (html_tag.get("lang") or "") if html_tag else ""

    flags = detect_flags(soup, result["html"])
    for col in BOOLEAN_COLUMNS:
        row[col] = to_bool_str(flags[col])

    variants = detect_variants(soup, result["html"], flags)
    row.update(variants)

    row["heading_outline_score"] = infer_heading_outline_score(soup)
    row["keyboard_nav_risk"] = infer_keyboard_nav_risk(flags)
    row["contrast_risk_hint"] = row.get("contrast_risk_hint") or "medium"

    row["cms_fingerprint"] = infer_cms_fingerprint(result["html"], row.get("cms_fingerprint", ""))
    row["notes"] = "retry_success:targeted_reprobe"

    return row


def main() -> None:
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)
    target_ids = {sid.strip() for sid in args.sample_ids.split(",") if sid.strip()}

    with input_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    patched_rows: list[dict[str, str]] = []
    touched = 0
    attempted = 0
    success = 0
    skipped = 0

    for row in rows:
        sample_id = row.get("sample_id", "")
        if sample_id in target_ids:
            touched += 1
            if should_retry_row(row, args.retry_only_failed):
                attempted += 1
                patched = patch_row(row, args.timeout, args.on_retry_failure)
                if patched.get("http_status") == "200":
                    success += 1
                patched_rows.append(patched)
            else:
                skipped += 1
                patched_rows.append(row)
        else:
            patched_rows.append(row)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(patched_rows)

    print(f"input: {input_path}")
    print(f"output: {output_path}")
    print(f"target_ids: {sorted(target_ids)}")
    print(f"touched_rows: {touched}")
    print(f"attempted_retry_rows: {attempted}")
    print(f"skipped_rows: {skipped}")
    print(f"http_200_rows_after_retry: {success}")


if __name__ == "__main__":
    main()

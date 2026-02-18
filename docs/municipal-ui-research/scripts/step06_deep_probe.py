#!/usr/bin/env python3
"""STEP06 Deep Probe runner for 50 municipalities."""

from __future__ import annotations

import argparse
import csv
import random
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib import error as urlerror
from urllib import parse as urlparse
from urllib import request as urlrequest
from urllib.robotparser import RobotFileParser

import yaml
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[3]
REQUIRED_PAGE_TYPES = ("top", "contact", "service")

BOOL_COLUMNS = {
    "has_mega_menu",
    "audience_segmentation",
    "life_event_nav",
    "disaster_portal_link",
    "evacuation_info_link",
    "multilingual_emergency",
    "event_calendar_link",
    "garbage_schedule_link",
    "open_data_link",
    "map_embed",
    "chatbot_present",
    "page_feedback_present",
    "print_button_present",
    "share_buttons_present",
    "service_has_overview",
    "service_has_eligibility",
    "service_has_required_docs",
    "service_has_steps",
    "service_has_fee",
    "service_has_processing_time",
    "service_has_online_apply",
    "service_has_revision_history",
    "service_has_faq",
    "contact_has_department_list",
    "contact_has_hours",
    "contact_has_location_map",
    "contact_privacy_consent",
    "article_valid_until_field",
    "a11y_test_result_published",
}

INT_COLUMNS = {
    "nav_depth_estimate",
    "global_nav_count",
    "task_shortcuts_count",
    "contact_form_steps",
    "attachments_count",
}

QUALITY_RISK_TO_LEVEL = {
    "low": "good",
    "medium": "fair",
    "high": "poor",
}

SNS_PATTERNS = [
    ("x", re.compile(r"(x\.com|twitter\.com|twitter)", re.IGNORECASE)),
    ("facebook", re.compile(r"(facebook\.com|facebook)", re.IGNORECASE)),
    ("instagram", re.compile(r"(instagram\.com|instagram)", re.IGNORECASE)),
    ("line", re.compile(r"(line\.me|line\.com|line)", re.IGNORECASE)),
    ("youtube", re.compile(r"(youtube\.com|youtu\.be|youtube)", re.IGNORECASE)),
    ("tiktok", re.compile(r"(tiktok\.com|tiktok)", re.IGNORECASE)),
    ("note", re.compile(r"(note\.com|note)", re.IGNORECASE)),
]

SEARCH_SCOPE_PATTERNS = [
    ("keyword", re.compile(r"(検索|キーワード|search)", re.IGNORECASE)),
    ("page_id", re.compile(r"(ページID|page[\s_-]?id)", re.IGNORECASE)),
    ("category", re.compile(r"(カテゴリ|分類|分野|category)", re.IGNORECASE)),
    ("department", re.compile(r"(組織|部署|部局|soshiki|department)", re.IGNORECASE)),
    ("faq", re.compile(r"(FAQ|よくある質問)", re.IGNORECASE)),
]

ONLINE_APPLY_VENDORS = [
    ("LoGoフォーム", re.compile(r"(logoform|logo-form|logoform\.jp)", re.IGNORECASE)),
    ("Graffer", re.compile(r"(graffer|graffer\.jp)", re.IGNORECASE)),
    ("自治体電子申請", re.compile(r"(e[-_]?shinsei|電子申請|ぴったりサービス)", re.IGNORECASE)),
    ("GoogleForms", re.compile(r"(forms\.gle|docs\.google\.com/forms)", re.IGNORECASE)),
]

MISSING_TEXT_TOKENS = {"unknown"}
UNKNOWN_IS_MISSING_COLUMNS = {
    "nav_depth_estimate",
    "global_nav_count",
    "search_scope_options",
    "breadcrumb_pattern",
    "local_nav_pattern",
    "emergency_location",
    "news_categories",
    "sns_links",
    "contact_channels",
    "skip_link_quality",
    "focus_visible_quality",
    "form_label_quality",
    "error_handling_quality",
    "a11y_statement_level",
    "notes",
}


@dataclass
class CrawlConfig:
    user_agent: str
    respect_robots_txt: bool
    concurrency: int
    per_origin_concurrency: int
    timeout_ms: int
    retry: int
    delay_min_ms: int
    delay_max_ms: int
    save_html: bool
    save_screenshot: bool


@dataclass
class FetchResult:
    request_url: str
    final_url: str
    status_code: int
    html: str
    blocked_by_robots: bool
    error: str

    @property
    def is_success(self) -> bool:
        return self.status_code == 200 and bool(self.html)


@dataclass(frozen=True)
class ProbeTask:
    index: int
    sample_id: str
    page_type: str
    roster_row: dict[str, str]


class WebFetcher:
    def __init__(self, config: CrawlConfig) -> None:
        self.config = config
        self._robot_cache: dict[str, RobotFileParser | None] = {}
        self._last_request_by_origin: dict[str, float] = {}
        self._state_lock = threading.Lock()
        self._origin_semaphores: dict[str, threading.BoundedSemaphore] = {}

    @staticmethod
    def _origin(url: str) -> str:
        parsed = urlparse.urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"

    def _load_robot_parser(self, origin: str) -> RobotFileParser | None:
        with self._state_lock:
            if origin in self._robot_cache:
                return self._robot_cache[origin]

        robots_url = origin.rstrip("/") + "/robots.txt"
        parser = RobotFileParser()

        try:
            req = urlrequest.Request(
                robots_url,
                headers={"User-Agent": self.config.user_agent},
                method="GET",
            )
            with urlrequest.urlopen(req, timeout=max(self.config.timeout_ms / 1000, 5)) as resp:
                body = resp.read().decode("utf-8", errors="ignore")
            parser.parse(body.splitlines())
            with self._state_lock:
                self._robot_cache[origin] = parser
            return parser
        except Exception:
            with self._state_lock:
                self._robot_cache[origin] = None
            return None

    def _respect_delay(self, origin: str) -> None:
        wait_sec = random.uniform(self.config.delay_min_ms, self.config.delay_max_ms) / 1000.0
        with self._state_lock:
            last = self._last_request_by_origin.get(origin)
        now = time.monotonic()
        if last is not None:
            elapsed = now - last
            remain = wait_sec - elapsed
            if remain > 0:
                time.sleep(remain)
        with self._state_lock:
            self._last_request_by_origin[origin] = time.monotonic()

    def _origin_semaphore(self, origin: str) -> threading.BoundedSemaphore:
        limit = max(1, self.config.per_origin_concurrency)
        with self._state_lock:
            semaphore = self._origin_semaphores.get(origin)
            if semaphore is None:
                semaphore = threading.BoundedSemaphore(limit)
                self._origin_semaphores[origin] = semaphore
            return semaphore

    def _can_fetch(self, url: str) -> bool:
        if not self.config.respect_robots_txt:
            return True

        origin = self._origin(url)
        parser = self._load_robot_parser(origin)
        if parser is None:
            return True
        return parser.can_fetch(self.config.user_agent, url)

    def fetch(self, url: str) -> FetchResult:
        url = (url or "").strip()
        if not url:
            return FetchResult("", "", 0, "", False, "URL_EMPTY")

        if not re.match(r"^https?://", url, re.IGNORECASE):
            return FetchResult(url, url, 0, "", False, "URL_NOT_HTTP")

        if not self._can_fetch(url):
            return FetchResult(url, url, 0, "", True, "BLOCKED_BY_ROBOTS")

        origin = self._origin(url)
        headers = {
            "User-Agent": self.config.user_agent,
            "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
        }

        timeout_sec = max(self.config.timeout_ms / 1000.0, 1.0)
        attempts = max(self.config.retry, 0) + 1
        last_error = ""
        semaphore = self._origin_semaphore(origin)

        with semaphore:
            for attempt in range(1, attempts + 1):
                self._respect_delay(origin)
                req = urlrequest.Request(url, headers=headers, method="GET")
                try:
                    with urlrequest.urlopen(req, timeout=timeout_sec) as resp:
                        raw = resp.read()
                        status = int(resp.getcode() or 0)
                        final_url = resp.geturl() or url
                        charset = resp.headers.get_content_charset() or "utf-8"
                        try:
                            html = raw.decode(charset, errors="replace")
                        except LookupError:
                            html = raw.decode("utf-8", errors="replace")
                        return FetchResult(url, final_url, status, html, False, "")
                except urlerror.HTTPError as e:
                    status = int(e.code or 0)
                    final_url = e.geturl() or url
                    last_error = f"HTTP_{status}"
                    retryable = status in {429, 500, 502, 503, 504}
                    if retryable and attempt < attempts:
                        continue
                    # 非200レスポンス本文は観測汚染の原因となるため解析しない。
                    return FetchResult(url, final_url, status, "", False, last_error)
                except Exception as e:
                    last_error = f"{type(e).__name__}:{e}"
                    if attempt < attempts:
                        continue
                    return FetchResult(url, url, 0, "", False, last_error)

        return FetchResult(url, url, 0, "", False, last_error or "FETCH_FAILED")


def is_missing_value(column: str, value: str, row: dict[str, str]) -> bool:
    cleaned = (value or "").strip()
    if column == "screenshot_path":
        # 証跡は evidence_dom_snippets_path または screenshot_path のどちらかで充足。
        if (row.get("evidence_dom_snippets_path") or "").strip():
            return False
        return not cleaned or cleaned.lower() in MISSING_TEXT_TOKENS
    if not cleaned:
        return True
    if column in BOOL_COLUMNS or column in INT_COLUMNS:
        return False
    if cleaned.lower() in MISSING_TEXT_TOKENS and column in UNKNOWN_IS_MISSING_COLUMNS:
        return True
    return False


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="STEP06 Deep Probe")
    parser.add_argument(
        "--roster-path",
        default=str(ROOT / ".context/municipal-ui-research/data/derived/roster_50.csv"),
    )
    parser.add_argument(
        "--schema-path",
        default=str(ROOT / ".context/municipal-ui-research/schemas/observation_deep_schema.csv"),
    )
    parser.add_argument(
        "--shallow-path",
        default=str(ROOT / ".context/municipal-ui-research/data/derived/observations_shallow.csv"),
    )
    parser.add_argument(
        "--config-path",
        default=str(ROOT / ".context/municipal-ui-research/config/research_params.yaml"),
    )
    parser.add_argument(
        "--output-path",
        default=str(ROOT / ".context/municipal-ui-research/data/derived/observations_deep.csv"),
    )
    parser.add_argument(
        "--qc-report-path",
        default=str(ROOT / ".context/municipal-ui-research/data/derived/deep_probe_qc_report.md"),
    )
    parser.add_argument(
        "--evidence-dir",
        default=str(ROOT / ".context/municipal-ui-research/data/raw/deep_probe"),
    )
    parser.add_argument(
        "--url-overrides-path",
        default=str(ROOT / ".context/municipal-ui-research/data/derived/deep_probe_url_overrides.csv"),
        help="Optional CSV with columns: sample_id,page_type,override_url,reason",
    )
    return parser.parse_args()


def read_csv(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        return rows, list(reader.fieldnames or [])


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def load_schema_headers(path: Path) -> list[str]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        try:
            return next(reader)
        except StopIteration as e:
            raise RuntimeError(f"Schema header is empty: {path}") from e


def load_config(path: Path) -> CrawlConfig:
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    crawl = data.get("crawl") or {}
    delay_range = crawl.get("delay_ms_range") or [300, 900]
    if not isinstance(delay_range, list) or len(delay_range) != 2:
        delay_range = [300, 900]

    capture = crawl.get("capture") or {}
    return CrawlConfig(
        user_agent=str(crawl.get("user_agent") or "MunicipalUITemplateResearchBot/1.0"),
        respect_robots_txt=bool(crawl.get("respect_robots_txt", True)),
        concurrency=int(crawl.get("concurrency") or 1),
        per_origin_concurrency=int(crawl.get("per_origin_concurrency") or 1),
        timeout_ms=int(crawl.get("timeout_ms") or 20000),
        retry=int(crawl.get("retry") or 2),
        delay_min_ms=int(delay_range[0]),
        delay_max_ms=int(delay_range[1]),
        save_html=bool(capture.get("save_html", False)),
        save_screenshot=bool(capture.get("save_screenshot", False)),
    )


def str_bool(value: bool) -> str:
    return "true" if value else "false"


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def load_url_overrides(path: Path) -> dict[tuple[str, str], str]:
    if not path.exists():
        return {}

    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        required = {"sample_id", "page_type", "override_url"}
        headers = set(reader.fieldnames or [])
        if not required.issubset(headers):
            raise RuntimeError(
                f"url overrides file missing required columns: {required - headers}"
            )
        overrides: dict[tuple[str, str], str] = {}
        for row in reader:
            sid = (row.get("sample_id") or "").strip()
            page_type = (row.get("page_type") or "").strip()
            override_url = (row.get("override_url") or "").strip()
            if sid and page_type and override_url:
                overrides[(sid, page_type)] = override_url
        return overrides


def pick_page_url(
    roster_row: dict[str, str],
    page_type: str,
    url_overrides: dict[tuple[str, str], str],
) -> str:
    sample_id = (roster_row.get("sample_id") or "").strip()
    if sample_id:
        override = url_overrides.get((sample_id, page_type))
        if override:
            return override

    direct = (roster_row.get(f"{page_type}_page_url") or "").strip()
    if direct:
        return direct
    top = (roster_row.get("top_page_url") or "").strip()
    if top:
        return top
    return (roster_row.get("official_site_url") or "").strip()


def shallow_index(rows: list[dict[str, str]]) -> dict[tuple[str, str], dict[str, str]]:
    idx: dict[tuple[str, str], dict[str, str]] = {}
    for row in rows:
        key = ((row.get("sample_id") or "").strip(), (row.get("page_type") or "").strip())
        if not key[0] or not key[1]:
            continue
        if key not in idx:
            idx[key] = row
    return idx


def count_nav_depth(soup: BeautifulSoup) -> int:
    depth = 1
    nav_candidates = soup.find_all("nav")
    for nav in nav_candidates[:8]:
        for ul in nav.find_all("ul"):
            current = ul
            d = 1
            while current:
                current = current.find("ul")
                if current:
                    d += 1
            depth = max(depth, d)
    return max(1, min(depth, 8))


def find_nav_link_count(soup: BeautifulSoup) -> int:
    nav_candidates = soup.find_all("nav")
    for nav in nav_candidates:
        links = nav.find_all("a", href=True)
        if len(links) >= 3:
            return min(len(links), 200)
    header = soup.find("header")
    if header:
        return min(len(header.find_all("a", href=True)), 200)
    return min(len(soup.find_all("a", href=True)), 200)


def has_mega_menu(soup: BeautifulSoup, html_lower: str, nav_count: int, nav_depth: int) -> bool:
    if "mega" in html_lower or "globalnav--mega" in html_lower:
        return True
    return nav_count >= 10 and nav_depth >= 2


def detect_audience_segmentation(text: str) -> bool:
    keys = ["市民", "事業者", "観光", "移住", "子育て", "高齢", "外国人", "法人"]
    return sum(1 for k in keys if k in text) >= 2


def detect_life_event_nav(text: str) -> bool:
    pattern = re.compile(
        r"(ライフイベント|妊娠|出産|子育て|入園|入学|結婚|離婚|引っ越し|転入|転出|死亡)",
    )
    return bool(pattern.search(text))


def detect_task_shortcuts(anchors: list[tuple[str, str]]) -> int:
    pattern = re.compile(r"(申請|手続|届出|証明|予約|相談|ごみ|子育て|防災)")
    count = 0
    for text, _ in anchors:
        if pattern.search(text):
            count += 1
    return min(count, 200)


def detect_search_scopes(text: str, html_lower: str) -> str:
    options: list[str] = []
    for label, pat in SEARCH_SCOPE_PATTERNS:
        if pat.search(text) or pat.search(html_lower):
            options.append(label)
    if not options:
        return "none"
    return "|".join(sorted(set(options)))


def detect_breadcrumb(soup: BeautifulSoup, text: str) -> str:
    if soup.select("nav[aria-label*='パンくず'], .breadcrumb, .pankuzu, ol.breadcrumb, ul.breadcrumb"):
        return "hierarchical"
    if ">" in text and "ホーム" in text:
        return "symbolic"
    return "none"


def detect_local_nav_pattern(soup: BeautifulSoup, html_lower: str) -> str:
    if soup.select(".local-nav, .sidenav, .side-nav, [class*='localnav'], [class*='sidemenu']"):
        return "sidebar"
    if soup.find_all("details"):
        return "accordion"
    if "tab" in html_lower:
        return "tabs"
    return "none"


def detect_emergency_location(text: str, html_lower: str) -> str:
    emergency_words = ["緊急", "災害", "警報", "避難", "防災"]
    if not any(w in text for w in emergency_words):
        return "none"
    if "header" in html_lower and ("緊急" in text or "災害" in text):
        return "header_banner"
    return "content_notice"


def detect_disaster_link(anchors: list[tuple[str, str]]) -> bool:
    pat = re.compile(r"(防災|災害|disaster)", re.IGNORECASE)
    return any(pat.search(text) or pat.search(href) for text, href in anchors)


def detect_evacuation_link(anchors: list[tuple[str, str]]) -> bool:
    pat = re.compile(r"(避難|避難所|evacuation)", re.IGNORECASE)
    return any(pat.search(text) or pat.search(href) for text, href in anchors)


def detect_multilingual(text: str) -> bool:
    terms = ["English", "中文", "한국어", "やさしい日本語", "Portuguese", "Español", "翻訳"]
    return sum(1 for t in terms if t in text) >= 1


def detect_news_categories(text: str) -> str:
    candidates = [
        ("お知らせ", r"お知らせ"),
        ("新着情報", r"新着情報"),
        ("イベント", r"イベント"),
        ("報道発表", r"報道"),
        ("募集", r"募集"),
    ]
    found = [name for name, pat in candidates if re.search(pat, text)]
    return "|".join(found) if found else "none"


def detect_boolean_link(anchors: list[tuple[str, str]], keyword: str) -> bool:
    return any(keyword in text or keyword in href for text, href in anchors)


def detect_map_embed(soup: BeautifulSoup, html_lower: str) -> bool:
    if soup.select("iframe[src*='maps'], iframe[src*='google.com/maps'], iframe[src*='map']"):
        return True
    return "leaflet" in html_lower or "mapbox" in html_lower


def detect_chatbot(html_lower: str, text: str) -> bool:
    terms = ["chatbot", "チャットボット", "kuzen", "ibm watson", "dialogflow", "botui"]
    combined = f"{html_lower} {text.lower()}"
    return any(term.lower() in combined for term in terms)


def detect_sns_links(anchors: list[tuple[str, str]]) -> str:
    hits: list[str] = []
    for text, href in anchors:
        blob = f"{text} {href}"
        for sns_name, pat in SNS_PATTERNS:
            if pat.search(blob):
                hits.append(sns_name)
    unique = sorted(set(hits))
    return "|".join(unique) if unique else "none"


def detect_page_feedback(text: str) -> bool:
    return bool(re.search(r"(ご意見|お問い合わせ|アンケート|このページに関する)", text))


def detect_print_button(html_lower: str, text: str) -> bool:
    return "print" in html_lower or "印刷" in text


def detect_share_buttons(html_lower: str, text: str) -> bool:
    return "share" in html_lower or "シェア" in text


def detect_service_flags(text: str, anchors: list[tuple[str, str]], html_lower: str) -> dict[str, str]:
    def has(pattern: str) -> str:
        return str_bool(bool(re.search(pattern, text)))

    result = {
        "service_has_overview": has(r"(概要|制度概要|制度案内)"),
        "service_has_eligibility": has(r"(対象者|対象児童|受給資格|支給対象)"),
        "service_has_required_docs": has(r"(必要書類|添付書類|申請書|持ち物)"),
        "service_has_steps": has(r"(手続き|申請方法|申請手順|届出方法)"),
        "service_has_fee": has(r"(手数料|費用|料金|無料)"),
        "service_has_processing_time": has(r"(支給日|処理期間|審査期間|交付まで)"),
        "service_has_online_apply": has(r"(オンライン申請|電子申請|ぴったりサービス|LoGoフォーム|Graffer)"),
        "service_has_revision_history": has(r"(更新日|改定|履歴|最終更新)"),
        "service_has_faq": has(r"(FAQ|よくある質問)"),
        "service_online_apply_vendor": "none",
    }

    apply_blob = html_lower + " " + " ".join([f"{t} {h}" for t, h in anchors[:500]])
    for vendor, pat in ONLINE_APPLY_VENDORS:
        if pat.search(apply_blob):
            result["service_online_apply_vendor"] = vendor
            break
    if result["service_has_online_apply"] == "true" and result["service_online_apply_vendor"] == "none":
        result["service_online_apply_vendor"] = "other"
    return result


def detect_contact_fields(text: str, soup: BeautifulSoup, anchors: list[tuple[str, str]], html_lower: str) -> dict[str, str]:
    tel = bool(re.search(r"(tel:|電話|☎)", html_lower + " " + text))
    mail = bool(re.search(r"(mailto:|メール|e-mail)", html_lower + " " + text, re.IGNORECASE))
    form = bool(re.search(r"(問い合わせフォーム|お問合せフォーム|フォーム|form)", text, re.IGNORECASE))
    fax = bool(re.search(r"(fax|ＦＡＸ|ファクス)", text, re.IGNORECASE))
    chat = bool(re.search(r"(チャット|chat)", text, re.IGNORECASE))
    channels: list[str] = []
    if tel:
        channels.append("phone")
    if mail:
        channels.append("email")
    if form:
        channels.append("form")
    if fax:
        channels.append("fax")
    if chat:
        channels.append("chat")
    if not channels:
        channels.append("none")

    has_form = bool(soup.find("form")) or form
    form_steps = 0
    if has_form:
        step_labels = soup.select("[class*='step'], [id*='step']")
        if step_labels:
            form_steps = max(1, len(step_labels))
        else:
            form_steps = 1

    dept = bool(re.search(r"(各課|部署一覧|組織一覧|担当課)", text))
    hours = bool(re.search(r"(受付時間|開庁時間|営業日|平日)", text))
    location_map = detect_map_embed(soup, html_lower) or bool(re.search(r"(アクセス|所在地|地図)", text))
    privacy = bool(re.search(r"(個人情報|プライバシー|同意)", text))

    return {
        "contact_channels": "|".join(channels),
        "contact_has_department_list": str_bool(dept),
        "contact_has_hours": str_bool(hours),
        "contact_has_location_map": str_bool(location_map),
        "contact_form_steps": str(form_steps),
        "contact_privacy_consent": str_bool(privacy),
    }


def detect_article_fields(text: str, anchors: list[tuple[str, str]]) -> dict[str, str]:
    fields = []
    if re.search(r"(公開日|掲載日|配信日)", text):
        fields.append("published_date")
    if re.search(r"(更新日|最終更新)", text):
        fields.append("updated_date")
    if re.search(r"(担当課|問い合わせ先|連絡先)", text):
        fields.append("department")
    if re.search(r"(ページID|記事ID)", text):
        fields.append("page_id")
    if re.search(r"(カテゴリ|分類|分野)", text):
        fields.append("category")
    valid_until = bool(re.search(r"(有効期限|掲載期限|掲載終了|valid until)", text, re.IGNORECASE))
    attachment_count = 0
    for a_text, href in anchors:
        blob = f"{a_text} {href}"
        if re.search(r"\.(pdf|docx?|xlsx?|pptx?|zip)(\?|$)", href, re.IGNORECASE):
            attachment_count += 1
        elif re.search(r"(PDF|添付|ダウンロード)", blob, re.IGNORECASE):
            attachment_count += 1

    return {
        "article_meta_fields": "|".join(fields) if fields else "none",
        "article_valid_until_field": str_bool(valid_until),
        "attachments_count": str(min(attachment_count, 500)),
    }


def detect_form_label_quality(soup: BeautifulSoup, text: str) -> tuple[str, str]:
    form = soup.find("form")
    if not form:
        if re.search(r"(フォーム|入力)", text):
            return "fair", "fair"
        return "unknown", "unknown"

    controls = [
        el
        for el in form.find_all(["input", "select", "textarea"])
        if (el.get("type") or "").lower() not in {"hidden", "submit", "button", "reset"}
    ]
    if not controls:
        return "unknown", "unknown"

    labeled = 0
    for ctrl in controls:
        if ctrl.get("aria-label") or ctrl.get("aria-labelledby"):
            labeled += 1
            continue
        ctrl_id = ctrl.get("id")
        if ctrl_id and form.find("label", attrs={"for": ctrl_id}):
            labeled += 1
            continue
        parent = ctrl.parent
        if parent and parent.name == "label":
            labeled += 1

    ratio = labeled / len(controls)
    if ratio >= 0.8:
        label_quality = "good"
    elif ratio >= 0.5:
        label_quality = "fair"
    else:
        label_quality = "poor"

    if re.search(r"(必須|エラー|入力してください|未入力)", text):
        error_quality = "good"
    elif ratio >= 0.5:
        error_quality = "fair"
    else:
        error_quality = "poor"
    return label_quality, error_quality


def detect_a11y_statement_level(text: str, shallow_row: dict[str, str] | None) -> tuple[str, str]:
    has_link = False
    if shallow_row:
        has_link = (shallow_row.get("has_accessibility_link") or "").strip().lower() == "true"
    if re.search(r"(アクセシビリティ方針|ウェブアクセシビリティ|usability)", text, re.IGNORECASE):
        has_link = True

    if re.search(r"(JIS X 8341|WCAG|試験結果|達成基準)", text, re.IGNORECASE):
        return "detailed", "true"
    if has_link:
        return "basic", "false"
    return "none", "false"


def skip_link_quality(soup: BeautifulSoup, shallow_row: dict[str, str] | None) -> str:
    if shallow_row:
        raw = (shallow_row.get("has_skip_link") or "").strip().lower()
        if raw == "true":
            return "good"
    links = soup.find_all("a", href=True)
    for a in links[:200]:
        text = normalize_space(a.get_text(" "))
        href = a.get("href", "")
        if href.startswith("#") and re.search(r"(スキップ|本文|main|content)", text, re.IGNORECASE):
            return "good"
    return "poor"


def focus_quality_from_shallow(shallow_row: dict[str, str] | None) -> str:
    if not shallow_row:
        return "unknown"
    risk = (shallow_row.get("keyboard_nav_risk") or "").strip().lower()
    return QUALITY_RISK_TO_LEVEL.get(risk, "unknown")


def build_notes(row: dict[str, str]) -> str:
    return (
        "テンプレ仕様示唆: "
        f"{row['page_type']}ではナビ深さ{row['nav_depth_estimate']}・検索スコープ[{row['search_scope_options']}]"
        f"・緊急導線[{row['emergency_location']}]・問い合わせ導線[{row['contact_channels']}]"
        "を可変トークン化し、共通レイアウトで再利用できる設計が有効。"
    )


def write_evidence(
    evidence_dir: Path,
    sample_id: str,
    page_type: str,
    fetch: FetchResult,
    title: str,
    anchors: list[tuple[str, str]],
    note: str,
) -> str:
    evidence_dir.mkdir(parents=True, exist_ok=True)
    file_path = evidence_dir / f"{sample_id}_{page_type}.txt"
    top_links = anchors[:20]
    lines = [
        f"sample_id: {sample_id}",
        f"page_type: {page_type}",
        f"request_url: {fetch.request_url}",
        f"final_url: {fetch.final_url}",
        f"status_code: {fetch.status_code}",
        f"blocked_by_robots: {fetch.blocked_by_robots}",
        f"error: {fetch.error}",
        f"title: {title}",
        "",
        "top_links:",
    ]
    for text, href in top_links:
        lines.append(f"- {text} :: {href}")
    lines.extend(["", "note:", note])
    file_path.write_text("\n".join(lines), encoding="utf-8")
    return str(file_path.relative_to(ROOT))


def write_raw_html(
    evidence_dir: Path,
    sample_id: str,
    page_type: str,
    fetch: FetchResult,
) -> str:
    html_dir = evidence_dir / "html"
    html_dir.mkdir(parents=True, exist_ok=True)
    file_path = html_dir / f"{sample_id}_{page_type}.html"
    file_path.write_text(fetch.html, encoding="utf-8")
    return str(file_path.relative_to(ROOT))


def blank_safe(value: str | None, fallback: str = "unknown") -> str:
    text = (value or "").strip()
    return text if text else fallback


def initialize_base_row(
    headers: list[str],
    roster_row: dict[str, str],
    page_type: str,
    page_url: str,
) -> dict[str, str]:
    row: dict[str, str] = {}
    for col in headers:
        if col in BOOL_COLUMNS:
            row[col] = "false"
        elif col in INT_COLUMNS:
            row[col] = "0"
        else:
            row[col] = "unknown"

    row["sample_id"] = blank_safe(roster_row.get("sample_id"))
    row["prefecture"] = blank_safe(roster_row.get("prefecture"))
    row["municipality_name"] = blank_safe(roster_row.get("municipality_name"))
    row["layer"] = blank_safe(roster_row.get("layer"))
    row["population_category"] = blank_safe(roster_row.get("population_category"))
    row["page_type"] = page_type
    row["page_url"] = page_url or "unknown"
    row["captured_at"] = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    row["service_online_apply_vendor"] = "none"
    row["search_scope_options"] = "none"
    row["breadcrumb_pattern"] = "none"
    row["local_nav_pattern"] = "none"
    row["emergency_location"] = "none"
    row["emergency_persistence"] = "none"
    row["news_categories"] = "none"
    row["sns_links"] = "none"
    row["contact_channels"] = "none"
    row["article_meta_fields"] = "none"
    row["skip_link_quality"] = "unknown"
    row["focus_visible_quality"] = "unknown"
    row["form_label_quality"] = "unknown"
    row["error_handling_quality"] = "unknown"
    row["a11y_statement_level"] = "none"
    row["notes"] = "テンプレ仕様示唆: 情報不足のため再観測候補。"
    row["evidence_dom_snippets_path"] = ""
    row["screenshot_path"] = ""
    return row


def enrich_row_from_html(
    row: dict[str, str],
    fetch: FetchResult,
    shallow_row: dict[str, str] | None,
) -> tuple[dict[str, str], str, list[tuple[str, str]], str]:
    html = fetch.html or ""
    if not html:
        row["notes"] = (
            "テンプレ仕様示唆: ページ取得失敗時にも必須導線（検索・緊急・問い合わせ）を"
            "フェールセーフ表示できるテンプレを用意する。"
        )
        if fetch.blocked_by_robots:
            row["emergency_persistence"] = "robots_blocked"
        return row, "", [], ""

    soup = BeautifulSoup(html, "html.parser")
    text = normalize_space(soup.get_text(" ", strip=True))
    html_lower = html.lower()
    title = normalize_space(soup.title.get_text(" ", strip=True) if soup.title else "")
    anchors = []
    for a in soup.find_all("a", href=True):
        a_text = normalize_space(a.get_text(" ", strip=True))
        href = normalize_space(a.get("href") or "")
        if a_text or href:
            anchors.append((a_text[:160], href[:400]))

    nav_depth = count_nav_depth(soup)
    nav_count = find_nav_link_count(soup)

    row["nav_depth_estimate"] = str(nav_depth)
    row["global_nav_count"] = str(nav_count)
    row["has_mega_menu"] = str_bool(has_mega_menu(soup, html_lower, nav_count, nav_depth))
    row["audience_segmentation"] = str_bool(detect_audience_segmentation(text))
    row["life_event_nav"] = str_bool(detect_life_event_nav(text))
    row["task_shortcuts_count"] = str(detect_task_shortcuts(anchors))
    row["search_scope_options"] = detect_search_scopes(text, html_lower)
    row["breadcrumb_pattern"] = detect_breadcrumb(soup, text)
    row["local_nav_pattern"] = detect_local_nav_pattern(soup, html_lower)
    row["emergency_location"] = detect_emergency_location(text, html_lower)
    row["emergency_persistence"] = (
        "top_only" if row["page_type"] == "top" and row["emergency_location"] != "none" else "sectional"
    )
    row["disaster_portal_link"] = str_bool(detect_disaster_link(anchors))
    row["evacuation_info_link"] = str_bool(detect_evacuation_link(anchors))
    row["multilingual_emergency"] = str_bool(detect_multilingual(text))
    row["news_categories"] = detect_news_categories(text)
    row["event_calendar_link"] = str_bool(detect_boolean_link(anchors, "イベント"))
    row["garbage_schedule_link"] = str_bool(
        detect_boolean_link(anchors, "ごみ") or detect_boolean_link(anchors, "分別")
    )
    row["open_data_link"] = str_bool(
        detect_boolean_link(anchors, "オープンデータ") or detect_boolean_link(anchors, "open-data")
    )
    row["map_embed"] = str_bool(detect_map_embed(soup, html_lower))
    row["chatbot_present"] = str_bool(detect_chatbot(html_lower, text))
    row["sns_links"] = detect_sns_links(anchors)
    row["page_feedback_present"] = str_bool(detect_page_feedback(text))
    row["print_button_present"] = str_bool(detect_print_button(html_lower, text))
    row["share_buttons_present"] = str_bool(detect_share_buttons(html_lower, text))

    service_flags = detect_service_flags(text, anchors, html_lower)
    row.update(service_flags)

    contact_fields = detect_contact_fields(text, soup, anchors, html_lower)
    row.update(contact_fields)

    article_fields = detect_article_fields(text, anchors)
    row.update(article_fields)

    row["skip_link_quality"] = skip_link_quality(soup, shallow_row)
    row["focus_visible_quality"] = focus_quality_from_shallow(shallow_row)
    label_quality, error_quality = detect_form_label_quality(soup, text)
    row["form_label_quality"] = label_quality
    row["error_handling_quality"] = error_quality

    a11y_level, a11y_result = detect_a11y_statement_level(text, shallow_row)
    row["a11y_statement_level"] = a11y_level
    row["a11y_test_result_published"] = a11y_result

    if shallow_row:
        variant = (shallow_row.get("global_nav_variant") or "").strip()
        if variant == "mega":
            row["has_mega_menu"] = "true"
        if row["focus_visible_quality"] == "unknown":
            row["focus_visible_quality"] = focus_quality_from_shallow(shallow_row)

    row["notes"] = build_notes(row)
    return row, title, anchors, text


def normalize_row(headers: list[str], row: dict[str, str]) -> dict[str, str]:
    normalized: dict[str, str] = {}
    for col in headers:
        value = row.get(col, "")
        if isinstance(value, bool):
            value = str_bool(value)
        elif isinstance(value, int):
            value = str(value)
        else:
            value = str(value)
        if col in BOOL_COLUMNS:
            v = value.strip().lower()
            if v not in {"true", "false"}:
                v = "false"
            normalized[col] = v
        elif col in INT_COLUMNS:
            match = re.search(r"-?\d+", value)
            normalized[col] = match.group(0) if match else "0"
        elif col in {"evidence_dom_snippets_path", "screenshot_path"}:
            normalized[col] = value.strip()
        else:
            cleaned = value.strip()
            normalized[col] = cleaned if cleaned else "unknown"
    return normalized


def build_qc_report(
    report_path: Path,
    headers: list[str],
    rows: list[dict[str, str]],
    roster_rows: list[dict[str, str]],
    fetch_issues: dict[str, list[str]],
    first_pass_failed_ids: list[str],
    retried_ids: list[str],
) -> tuple[bool, dict[str, float], list[str]]:
    total_rows = len(rows)
    total_cells = total_rows * len(headers) if total_rows and headers else 0
    missing_cells = 0
    for row in rows:
        for h in headers:
            if is_missing_value(h, row.get(h, ""), row):
                missing_cells += 1

    missing_rate = (missing_cells / total_cells) if total_cells else 1.0
    notes_filled = sum(1 for r in rows if (r.get("notes") or "").strip())
    notes_rate = notes_filled / total_rows if total_rows else 0.0
    evidence_filled = sum(
        1
        for r in rows
        if (r.get("evidence_dom_snippets_path") or "").strip() or (r.get("screenshot_path") or "").strip()
    )
    evidence_rate = evidence_filled / total_rows if total_rows else 0.0

    unique_pairs = {(r["sample_id"], r["page_type"]) for r in rows}
    unique_ok = len(unique_pairs) == len(rows)
    coverage = len({r["sample_id"] for r in rows})
    expected_coverage = len({r["sample_id"] for r in roster_rows})
    coverage_ok = coverage == expected_coverage == 50
    row_count_ok = total_rows >= 150
    fetch_issue_count = sum(1 for reasons in fetch_issues.values() if reasons)
    fetch_issue_ok = fetch_issue_count == 0

    gate_pass = (
        coverage_ok
        and row_count_ok
        and missing_rate <= 0.03
        and notes_rate >= 0.90
        and evidence_rate >= 0.90
        and unique_ok
        and fetch_issue_ok
    )

    municipalities_by_id = {r["sample_id"]: r["municipality_name"] for r in roster_rows}
    rerun_ids: list[str] = []
    for sample_id, reasons in sorted(fetch_issues.items()):
        if reasons:
            rerun_ids.append(sample_id)
    rerun_labels = [f"{sid} ({municipalities_by_id.get(sid, 'unknown')})" for sid in rerun_ids]
    first_pass_labels = [f"{sid} ({municipalities_by_id.get(sid, 'unknown')})" for sid in first_pass_failed_ids]
    retried_labels = [f"{sid} ({municipalities_by_id.get(sid, 'unknown')})" for sid in retried_ids]

    lines = [
        "# STEP06 Deep Probe QC Report",
        "",
        f"- generated_at: {datetime.now(timezone.utc).astimezone().isoformat(timespec='seconds')}",
        f"- total_rows: {total_rows}",
        f"- unique_sample_page_pairs: {len(unique_pairs)}",
        f"- uniqueness_ok: {str(unique_ok).lower()}",
        f"- municipality_coverage: {coverage}/{expected_coverage}",
        f"- missing_rate: {missing_rate:.4%}",
        f"- notes_fill_rate: {notes_rate:.4%}",
        f"- evidence_fill_rate: {evidence_rate:.4%}",
        f"- fetch_issue_municipality_count: {fetch_issue_count}",
        f"- first_pass_failed_municipality_count: {len(first_pass_failed_ids)}",
        f"- retried_municipality_count: {len(retried_ids)}",
        "",
        "## Gate G06",
        f"- coverage_100: {str(coverage_ok).lower()}",
        f"- row_count_ge_150: {str(row_count_ok).lower()}",
        f"- missing_rate_le_3pct: {str(missing_rate <= 0.03).lower()}",
        f"- notes_rate_ge_90pct: {str(notes_rate >= 0.90).lower()}",
        f"- evidence_rate_ge_90pct: {str(evidence_rate >= 0.90).lower()}",
        f"- unique_key_ok: {str(unique_ok).lower()}",
        f"- rerun_targets_none: {str(fetch_issue_ok).lower()}",
        f"- gate_result: {'PASS' if gate_pass else 'FAIL'}",
        "",
        "## Retry Summary",
    ]
    if first_pass_labels:
        lines.append("- first_pass_failed_targets:")
        for label in first_pass_labels:
            lines.append(f"  - {label}")
    else:
        lines.append("- first_pass_failed_targets: none")

    if retried_labels:
        lines.append("- retried_targets:")
        for label in retried_labels:
            lines.append(f"  - {label}")
    else:
        lines.append("- retried_targets: none")

    lines.extend(
        [
            "",
        "## Fetch Issues",
        ]
    )
    if rerun_labels:
        lines.append("- rerun_targets:")
        for label in rerun_labels:
            reasons = ", ".join(fetch_issues.get(label.split(" ")[0], []))
            lines.append(f"  - {label}: {reasons}")
    else:
        lines.append("- rerun_targets: none")

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    metrics = {
        "total_rows": float(total_rows),
        "missing_rate": missing_rate,
        "notes_rate": notes_rate,
        "evidence_rate": evidence_rate,
        "coverage": float(coverage),
        "fetch_issue_municipality_count": float(fetch_issue_count),
        "first_pass_failed_municipality_count": float(len(first_pass_failed_ids)),
        "retried_municipality_count": float(len(retried_ids)),
    }
    return gate_pass, metrics, rerun_labels


def main() -> None:
    random.seed(42)
    args = parse_args()

    roster_path = Path(args.roster_path)
    schema_path = Path(args.schema_path)
    shallow_path = Path(args.shallow_path)
    config_path = Path(args.config_path)
    output_path = Path(args.output_path)
    qc_report_path = Path(args.qc_report_path)
    evidence_dir = Path(args.evidence_dir)
    url_overrides_path = Path(args.url_overrides_path)

    headers = load_schema_headers(schema_path)
    roster_rows, _ = read_csv(roster_path)
    if len(roster_rows) != 50:
        raise RuntimeError(f"roster_50.csv row count must be 50, got: {len(roster_rows)}")

    shallow_rows, _ = read_csv(shallow_path)
    shallow_idx = shallow_index(shallow_rows)
    url_overrides = load_url_overrides(url_overrides_path)

    config = load_config(config_path)
    if config.save_screenshot:
        raise RuntimeError(
            "save_screenshot=true は未対応です。スクリーンショットが必要な場合は Playwright 実装へ切り替えてください。"
        )

    fetcher = WebFetcher(config)

    tasks: list[ProbeTask] = []
    index = 0
    for roster_row in roster_rows:
        sample_id = roster_row["sample_id"]
        for page_type in REQUIRED_PAGE_TYPES:
            tasks.append(
                ProbeTask(
                    index=index,
                    sample_id=sample_id,
                    page_type=page_type,
                    roster_row=roster_row,
                )
            )
            index += 1

    def process_task(task: ProbeTask) -> tuple[int, str, str | None, dict[str, str]]:
        page_url = pick_page_url(task.roster_row, task.page_type, url_overrides)
        base_row = initialize_base_row(headers, task.roster_row, task.page_type, page_url)
        shallow_row = shallow_idx.get((task.sample_id, task.page_type))

        fetch = fetcher.fetch(page_url)
        issue: str | None = None
        if not fetch.is_success:
            reason = fetch.error or f"HTTP_{fetch.status_code}"
            issue = f"{task.page_type}:{reason}"

        enriched, title, anchors, _text = enrich_row_from_html(base_row, fetch, shallow_row)
        evidence_path = write_evidence(
            evidence_dir=evidence_dir,
            sample_id=task.sample_id,
            page_type=task.page_type,
            fetch=fetch,
            title=title,
            anchors=anchors,
            note=enriched["notes"],
        )
        enriched["evidence_dom_snippets_path"] = evidence_path
        enriched["screenshot_path"] = ""

        if config.save_html and fetch.is_success:
            write_raw_html(
                evidence_dir=evidence_dir,
                sample_id=task.sample_id,
                page_type=task.page_type,
                fetch=fetch,
            )

        normalized = normalize_row(headers, enriched)
        return task.index, task.sample_id, issue, normalized

    def run_tasks(input_tasks: list[ProbeTask]) -> list[tuple[int, str, str | None, dict[str, str]]]:
        results: list[tuple[int, str, str | None, dict[str, str]]] = []
        max_workers = max(1, int(config.concurrency))
        if max_workers == 1:
            for task in input_tasks:
                results.append(process_task(task))
        else:
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                futures = [executor.submit(process_task, task) for task in input_tasks]
                for future in as_completed(futures):
                    results.append(future.result())
        return results

    first_pass_results = run_tasks(tasks)
    first_pass_issues: dict[str, list[str]] = {row["sample_id"]: [] for row in roster_rows}
    result_by_key: dict[tuple[str, str], tuple[int, str, str | None, dict[str, str]]] = {}
    for item in first_pass_results:
        idx, sample_id, issue, row = item
        key = (sample_id, row["page_type"])
        result_by_key[key] = item
        if issue:
            first_pass_issues[sample_id].append(issue)

    first_pass_failed_ids = sorted([sid for sid, reasons in first_pass_issues.items() if reasons])
    retried_ids: list[str] = []
    if first_pass_failed_ids:
        retry_id_set = set(first_pass_failed_ids)
        retry_tasks = [task for task in tasks if task.sample_id in retry_id_set]
        retried_ids = sorted(retry_id_set)
        retry_results = run_tasks(retry_tasks)
        for item in retry_results:
            _idx, sample_id, _issue, row = item
            key = (sample_id, row["page_type"])
            result_by_key[key] = item

    fetch_issues: dict[str, list[str]] = {row["sample_id"]: [] for row in roster_rows}
    ordered_results = sorted(result_by_key.values(), key=lambda item: item[0])
    output_rows: list[dict[str, str]] = []
    for _idx, sample_id, issue, row in ordered_results:
        if issue:
            fetch_issues[sample_id].append(issue)
        output_rows.append(row)

    write_csv(output_path, headers, output_rows)
    gate_pass, metrics, rerun_targets = build_qc_report(
        report_path=qc_report_path,
        headers=headers,
        rows=output_rows,
        roster_rows=roster_rows,
        fetch_issues=fetch_issues,
        first_pass_failed_ids=first_pass_failed_ids,
        retried_ids=retried_ids,
    )

    print(f"rows={int(metrics['total_rows'])}")
    print(f"missing_rate={metrics['missing_rate']:.4%}")
    print(f"notes_rate={metrics['notes_rate']:.4%}")
    print(f"evidence_rate={metrics['evidence_rate']:.4%}")
    print(
        "first_pass_failed_municipalities="
        f"{int(metrics['first_pass_failed_municipality_count'])}"
    )
    print(f"retried_municipalities={int(metrics['retried_municipality_count'])}")
    print(f"gate_g06={'PASS' if gate_pass else 'FAIL'}")
    if rerun_targets:
        print("rerun_targets=" + "; ".join(rerun_targets))
    else:
        print("rerun_targets=none")


if __name__ == "__main__":
    main()

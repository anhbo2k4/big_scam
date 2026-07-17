#!/usr/bin/env python3
"""
Extract user/admin visible texts from source files and generate manual i18n JSON.

Scans: .js, .css, .ejs, .html across the repository (including controllers/models).
Outputs:
  - config/i18n-text-catalog.generated.json
  - config/i18n-manual-template.generated.json

Template format is compatible with utils/i18n.js loadManualTemplate():
{
  "vi": {"source text": "source text"},
  "en": {"source text": ""},
  "zh": {"source text": ""}
}
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from pathlib import Path
from typing import Any, DefaultDict, Dict, Iterable, List, Set, Tuple

SKIP_DIRS = {
    "node_modules",
    ".git",
    ".vscode",
    ".idea",
    "coverage",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".cache",
}

TARGET_EXTS = {".js", ".css", ".ejs", ".html"}

ATTR_PATTERN = re.compile(
    r"(placeholder|title|aria-label|alt|value|data-title|data-label)\s*=\s*([\"'])([\s\S]*?)\2",
    re.IGNORECASE,
)

STRING_PATTERN = re.compile(
    r"'([^'\\]*(?:\\.[^'\\]*)*)'|\"([^\"\\]*(?:\\.[^\"\\]*)*)\"",
    re.MULTILINE,
)

TEMPLATE_PATTERN = re.compile(r"`([^`$]*(?:\$\{[^}]*\}[^`]*)*)`", re.MULTILINE)

CSS_CONTENT_PATTERN = re.compile(r"content\s*:\s*([\"'])([\s\S]*?)\1", re.IGNORECASE)


def norm(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def has_letters(text: str) -> bool:
    return bool(re.search(r"[A-Za-zÀ-ỹ一-龥]", text))


def looks_like_code(text: str) -> bool:
    t = text.strip()
    if not t:
        return True
    if len(t) < 2 or len(t) > 280:
        return True
    if t.startswith(("http://", "https://", "/", "./", "../")):
        return True
    if re.match(r"^[A-Za-z0-9_.:/#?&=%+\-{}<>\[\]$]+$", t) and " " not in t and not has_letters(t.replace("_", "")):
        return True
    if re.match(r"^[0-9.,:%+\-/ ]+$", t):
        return True
    if re.match(r"^(function|return|const|let|var|if|else|for|while|switch|case|break)\b", t):
        return True
    if re.match(r"^[A-Z0-9_\-]{3,}$", t):
        return True
    return False


def keep_text(raw: str) -> bool:
    t = norm(raw)
    if not t:
        return False
    if looks_like_code(t):
        return False
    if not has_letters(t):
        return False
    return True


def add_text(store: DefaultDict[str, Set[str]], text: str, rel_path: str) -> None:
    t = norm(text)
    if keep_text(t):
        store[t].add(rel_path.replace("\\", "/"))


def strip_ejs_blocks(content: str) -> str:
    return re.sub(r"<%[\s\S]*?%>", " ", content)


def extract_embedded_blocks(content: str) -> Tuple[List[str], List[str]]:
    scripts = re.findall(r"<script[^>]*>([\s\S]*?)<\/script>", content, flags=re.IGNORECASE)
    styles = re.findall(r"<style[^>]*>([\s\S]*?)<\/style>", content, flags=re.IGNORECASE)
    return scripts, styles


def extract_markup(content: str, rel_path: str, store: DefaultDict[str, Set[str]]) -> None:
    src = strip_ejs_blocks(content)

    scripts, styles = extract_embedded_blocks(src)
    for block in scripts:
        extract_js(block, rel_path, store)
    for block in styles:
        extract_css(block, rel_path, store)

    src = re.sub(r"<script[\s\S]*?<\/script>", " ", src, flags=re.IGNORECASE)
    src = re.sub(r"<style[\s\S]*?<\/style>", " ", src, flags=re.IGNORECASE)

    for m in re.finditer(r">([^<>]+)<", src):
        add_text(store, m.group(1), rel_path)

    for m in ATTR_PATTERN.finditer(src):
        add_text(store, m.group(3), rel_path)


def unescape_js_string(s: str) -> str:
    return (
        s.replace("\\n", " ")
        .replace("\\r", " ")
        .replace("\\t", " ")
        .replace("\\'", "'")
        .replace('\\"', '"')
    )


def extract_js(content: str, rel_path: str, store: DefaultDict[str, Set[str]]) -> None:
    for m in STRING_PATTERN.finditer(content):
        val = m.group(1) if m.group(1) is not None else m.group(2)
        add_text(store, unescape_js_string(val), rel_path)

    for m in TEMPLATE_PATTERN.finditer(content):
        raw = m.group(1)
        pure = re.sub(r"\$\{[^}]*\}", " ", raw)
        add_text(store, unescape_js_string(pure), rel_path)


def extract_css(content: str, rel_path: str, store: DefaultDict[str, Set[str]]) -> None:
    for m in CSS_CONTENT_PATTERN.finditer(content):
        add_text(store, m.group(2), rel_path)


def scan_files(root: Path) -> Iterable[Path]:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            p = Path(dirpath) / fn
            if p.suffix.lower() in TARGET_EXTS:
                yield p


def build_catalog(root: Path) -> Tuple[List[Dict[str, object]], Dict[str, Dict[str, str]]]:
    store: DefaultDict[str, Set[str]] = defaultdict(set)

    for file_path in scan_files(root):
        rel = str(file_path.relative_to(root)).replace("\\", "/")
        try:
            content = file_path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        ext = file_path.suffix.lower()
        if ext in {".ejs", ".html"}:
            extract_markup(content, rel, store)
        if ext == ".js":
            extract_js(content, rel, store)
        if ext == ".css":
            extract_css(content, rel, store)

    items = [
        {"text": text, "files": sorted(list(paths))}
        for text, paths in store.items()
    ]
    items.sort(key=lambda x: x["text"])

    template = {
        "vi": {},
        "en": {},
        "zh": {},
        "note": "Fill en/zh manually. Keys are source texts collected from code.",
    }

    for item in items:
        text = item["text"]
        template["vi"][text] = text
        template["en"][text] = ""
        template["zh"][text] = ""

    return items, template


def load_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def sort_dict_keys(d: Dict[str, str]) -> Dict[str, str]:
    return {k: d[k] for k in sorted(d.keys(), key=lambda x: x.lower())}


def merge_active_template(active: Dict[str, Any], generated: Dict[str, Any]) -> Dict[str, Any]:
    active_vi = active.get("vi") if isinstance(active.get("vi"), dict) else {}
    active_en = active.get("en") if isinstance(active.get("en"), dict) else {}
    active_zh = active.get("zh") if isinstance(active.get("zh"), dict) else {}

    generated_vi = generated.get("vi") if isinstance(generated.get("vi"), dict) else {}

    all_keys = set(active_vi.keys()) | set(generated_vi.keys())
    out_vi: Dict[str, str] = {}
    out_en: Dict[str, str] = {}
    out_zh: Dict[str, str] = {}

    for key in all_keys:
        vi_val = norm(str(active_vi.get(key, "") or ""))
        out_vi[key] = vi_val if vi_val else key
        out_en[key] = norm(str(active_en.get(key, "") or ""))
        out_zh[key] = norm(str(active_zh.get(key, "") or ""))

    return {
        "vi": sort_dict_keys(out_vi),
        "en": sort_dict_keys(out_en),
        "zh": sort_dict_keys(out_zh),
        "note": "Fill en/zh manually. Keys are source texts collected from code.",
    }


def build_translation_todo(catalog: List[Dict[str, object]], merged_template: Dict[str, Any]) -> Dict[str, object]:
    text_to_files: Dict[str, List[str]] = {}
    for item in catalog:
        txt = str(item.get("text", ""))
        files = item.get("files", [])
        if txt:
            text_to_files[txt] = files if isinstance(files, list) else []

    en = merged_template.get("en") if isinstance(merged_template.get("en"), dict) else {}
    zh = merged_template.get("zh") if isinstance(merged_template.get("zh"), dict) else {}

    missing_en = []
    missing_zh = []

    for text in sorted(text_to_files.keys(), key=lambda x: x.lower()):
        if not norm(str(en.get(text, "") or "")):
            missing_en.append({"text": text, "files": text_to_files.get(text, [])})
        if not norm(str(zh.get(text, "") or "")):
            missing_zh.append({"text": text, "files": text_to_files.get(text, [])})

    return {
        "summary": {
            "sourceTexts": len(text_to_files),
            "missingEn": len(missing_en),
            "missingZh": len(missing_zh),
        },
        "missing": {
            "en": missing_en,
            "zh": missing_zh,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="Project root")
    parser.add_argument("--out-dir", default="config", help="Output directory")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out_dir = (root / args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    catalog, template = build_catalog(root)

    catalog_generated_path = out_dir / "i18n-text-catalog.generated.json"
    template_generated_path = out_dir / "i18n-manual-template.generated.json"
    catalog_active_path = out_dir / "i18n-text-catalog.json"
    template_active_path = out_dir / "i18n-manual-template.json"
    todo_generated_path = out_dir / "i18n-translation-todo.generated.json"

    catalog_generated_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    template_generated_path.write_text(json.dumps(template, ensure_ascii=False, indent=2), encoding="utf-8")

    # Keep active catalog in sync for admin tooling that reads non-generated file.
    catalog_active_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")

    active_template = load_json(template_active_path)
    merged_template = merge_active_template(active_template, template)
    template_active_path.write_text(json.dumps(merged_template, ensure_ascii=False, indent=2), encoding="utf-8")

    todo = build_translation_todo(catalog, merged_template)
    todo_generated_path.write_text(json.dumps(todo, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Extracted {len(catalog)} entries")
    print(f"Catalog (generated): {catalog_generated_path}")
    print(f"Template (generated): {template_generated_path}")
    print(f"Catalog (active): {catalog_active_path}")
    print(f"Template (active, merged): {template_active_path}")
    print(f"Translation TODO: {todo_generated_path}")
    print(f"Missing EN: {todo['summary']['missingEn']}")
    print(f"Missing ZH: {todo['summary']['missingZh']}")


if __name__ == "__main__":
    main()

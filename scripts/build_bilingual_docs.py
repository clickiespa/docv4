#!/usr/bin/env python3
"""Build bilingual markdown copies without modifying original sources.

Outputs:
- docs/api-es/** : Spanish translation of docs/api/** (original English kept intact)
- docs/en/**     : English translation of docs/** excluding docs/api/**
"""

from __future__ import annotations

import argparse
import re
import shutil
import time
from pathlib import Path
from typing import Dict

from deep_translator import GoogleTranslator


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
API_SRC = DOCS_DIR / "api"
API_ES_DST = DOCS_DIR / "api-es"
EN_DST = DOCS_DIR / "en"

TOKEN_RE = re.compile(r"@@PH(\d+)@@")
CODE_BLOCK_RE = re.compile(r"```[\s\S]*?```", re.MULTILINE)
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)\n]+)\)")
DIRECTIVE_LINE_RE = re.compile(r"^:::[^\n]*$", re.MULTILINE)
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?", re.DOTALL)


class TranslatorCache:
    def __init__(self, source: str, target: str) -> None:
        self.translator = GoogleTranslator(source=source, target=target)
        self.cache: Dict[str, str] = {}

    def translate(self, text: str) -> str:
        raw = text
        if not raw.strip():
            return raw
        if raw in self.cache:
            return self.cache[raw]

        translated = raw
        for attempt in range(4):
            try:
                translated = self.translator.translate(raw)
                break
            except Exception:
                if attempt == 3:
                    translated = raw
                else:
                    time.sleep(1.2 * (attempt + 1))

        self.cache[raw] = translated
        return translated


def _replace_with_tokens(text: str, regex: re.Pattern, stash: list[str], fn=None) -> str:
    def repl(match: re.Match) -> str:
        value = fn(match) if fn else match.group(0)
        stash.append(value)
        return f"@@PH{len(stash) - 1}@@"

    return regex.sub(repl, text)


def _restore_tokens(text: str, stash: list[str]) -> str:
    def repl(match: re.Match) -> str:
        idx = int(match.group(1))
        if idx < 0 or idx >= len(stash):
            return match.group(0)
        return stash[idx]

    restored = text
    for _ in range(8):
        next_restored = TOKEN_RE.sub(repl, restored)
        if next_restored == restored or not TOKEN_RE.search(next_restored):
            return next_restored
        restored = next_restored
    return restored


def _normalize_markdown_artifacts(text: str) -> str:
    """Fix small formatting artifacts introduced by machine translation."""
    normalized = re.sub(r"(?m)^(```+|~~~+)(#{1,6}\s+)", r"\1\n\2", text)
    normalized = re.sub(r"(?m)([^#\n])(?=#{1,6}\s+)", r"\1\n", normalized)
    normalized = re.sub(r"(?m)^(#{1,6}\s+[^|\n]+)\|", r"\1\n|", normalized)
    normalized = re.sub(
        r"(?m)^(#{1,6}\s+[^`\n]+?)(Cuando\s+`|When\s+`)",
        r"\1\n\n\2",
        normalized,
    )
    return normalized


def _normalize_api_terms(text: str) -> str:
    replacements = {
        "Puntos finales": "Endpoints",
        "puntos finales": "endpoints",
        "Punto final": "Endpoint",
        "punto final": "endpoint",
        "Terminales": "Endpoints",
        "terminales": "endpoints",
    }

    normalized = text
    for source, target in replacements.items():
        normalized = normalized.replace(source, target)
    return normalized


def _translate_in_chunks(text: str, cache: TranslatorCache, max_chunk: int = 3500) -> str:
    if not text.strip():
        return text

    chunks: list[str] = []
    current = ""

    for part in re.split(r"(\n\n+)", text):
        if len(current) + len(part) > max_chunk and current:
            chunks.append(current)
            current = part
        else:
            current += part

    if current:
        chunks.append(current)

    translated_chunks = [cache.translate(chunk) if chunk.strip() else chunk for chunk in chunks]
    return "".join(translated_chunks)


def _translate_markdown_text(body: str, cache: TranslatorCache) -> str:
    placeholders: list[str] = []

    text = body
    text = _replace_with_tokens(text, CODE_BLOCK_RE, placeholders)
    text = _replace_with_tokens(text, INLINE_CODE_RE, placeholders)
    text = _replace_with_tokens(text, DIRECTIVE_LINE_RE, placeholders)

    def link_replacer(match: re.Match) -> str:
        label = match.group(1)
        url = match.group(2)
        translated_label = cache.translate(label)
        return f"[{translated_label}]({url})"

    text = _replace_with_tokens(text, LINK_RE, placeholders, fn=link_replacer)
    text = _translate_in_chunks(text, cache)
    text = _restore_tokens(text, placeholders)
    text = re.sub(r"(?m)^(#+)([^\s#])", r"\1 \2", text)
    text = re.sub(r"(?m)^(\s*[-*+])\[(\S)", r"\1 [\2", text)
    text = re.sub(r"(?m)^(\s*\d+\.)\[(\S)", r"\1 [\2", text)
    return _normalize_api_terms(_normalize_markdown_artifacts(text))


def translate_markdown_file(src_path: Path, dst_path: Path, cache: TranslatorCache) -> None:
    raw = src_path.read_text(encoding="utf-8")
    dst_path.parent.mkdir(parents=True, exist_ok=True)

    frontmatter_match = FRONTMATTER_RE.match(raw)
    if frontmatter_match:
        frontmatter_block = frontmatter_match.group(1)
        body = raw[frontmatter_match.end() :]

        fm_lines = frontmatter_block.splitlines()
        translated_lines = []
        for line in fm_lines:
            if line.strip().startswith("title:"):
                match = re.match(r'^(\s*title:\s*")(.+?)("\s*)$', line)
                if match:
                    translated_lines.append(
                        f'{match.group(1)}{cache.translate(match.group(2))}{match.group(3)}'
                    )
                else:
                    translated_lines.append(line)
            else:
                translated_lines.append(line)

        translated_fm = "---\n" + "\n".join(translated_lines) + "\n---\n"
        translated_body = _translate_markdown_text(body, cache)
        dst_path.write_text(translated_fm + translated_body, encoding="utf-8")
        return

    translated = _translate_markdown_text(raw, cache)
    dst_path.write_text(translated, encoding="utf-8")


def _clear_directory(target: Path) -> None:
    if target.exists():
        shutil.rmtree(target)
    target.mkdir(parents=True, exist_ok=True)


def build_api_es() -> None:
    if not API_SRC.exists():
        raise SystemExit(f"Missing source directory: {API_SRC}")

    _clear_directory(API_ES_DST)
    cache = TranslatorCache(source="en", target="es")

    for src in sorted(API_SRC.rglob("*")):
        rel = src.relative_to(API_SRC)
        dst = API_ES_DST / rel

        if src.is_dir():
            dst.mkdir(parents=True, exist_ok=True)
            continue

        if src.suffix.lower() == ".md":
            translate_markdown_file(src, dst, cache)
        else:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)


def build_manual_en() -> None:
    _clear_directory(EN_DST)
    cache = TranslatorCache(source="es", target="en")

    for src in sorted(DOCS_DIR.rglob("*.md")):
        rel = src.relative_to(DOCS_DIR)
        rel_posix = rel.as_posix()
        if rel_posix.startswith("api/") or rel_posix.startswith("api-es/") or rel_posix.startswith("en/"):
            continue

        dst = EN_DST / rel
        translate_markdown_file(src, dst, cache)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate bilingual docs copies.")
    parser.add_argument(
        "--only",
        choices=["api-es", "en", "all"],
        default="all",
        help="Generate only one target language set",
    )
    args = parser.parse_args()

    if args.only in ("api-es", "all"):
        build_api_es()
    if args.only in ("en", "all"):
        build_manual_en()

    print(f"Generated: {API_ES_DST} and {EN_DST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

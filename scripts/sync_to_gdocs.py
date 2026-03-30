#!/usr/bin/env python3
"""Synchronize Markdown docs into a single Google Doc.

Features:
- Reads Markdown files from /docs (ordered by mkdocs.yml nav when available)
- Converts Markdown to Google Docs content
- Preserves H1/H2/H3, lists, and links
- Replaces the target Google Doc content idempotently
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import yaml
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from markdown_it import MarkdownIt
from markdown_it.token import Token

SCOPES = ["https://www.googleapis.com/auth/documents"]
HEADING_STYLE_BY_LEVEL = {
    1: "HEADING_1",
    2: "HEADING_2",
    3: "HEADING_3",
}
BULLET_PRESET = "BULLET_DISC_CIRCLE_SQUARE"
ORDERED_PRESET = "NUMBERED_DECIMAL_ALPHA_ROMAN"


@dataclass
class InlineLink:
    start: int
    end: int
    url: str


@dataclass
class ParagraphBlock:
    text: str
    named_style_type: Optional[str] = None
    bullet_preset: Optional[str] = None
    links: List[InlineLink] = field(default_factory=list)


class MarkdownToBlocksConverter:
    def __init__(self) -> None:
        self.md = MarkdownIt("commonmark")

    def convert(self, markdown_text: str) -> List[ParagraphBlock]:
        tokens = self.md.parse(markdown_text)
        blocks: List[ParagraphBlock] = []
        list_stack: List[str] = []
        idx = 0

        while idx < len(tokens):
            token = tokens[idx]

            if token.type == "bullet_list_open":
                list_stack.append("bullet")
                idx += 1
                continue

            if token.type == "ordered_list_open":
                list_stack.append("ordered")
                idx += 1
                continue

            if token.type in {"bullet_list_close", "ordered_list_close"}:
                if list_stack:
                    list_stack.pop()
                idx += 1
                continue

            if token.type == "heading_open":
                level = int(token.tag[1])
                inline = tokens[idx + 1] if idx + 1 < len(tokens) else None
                text, links = self._inline_to_text(inline)
                blocks.append(
                    ParagraphBlock(
                        text=text,
                        named_style_type=HEADING_STYLE_BY_LEVEL.get(level, "NORMAL_TEXT"),
                        links=links,
                    )
                )
                idx += 3
                continue

            if token.type == "paragraph_open":
                inline = tokens[idx + 1] if idx + 1 < len(tokens) else None
                text, links = self._inline_to_text(inline)
                bullet = None
                if list_stack:
                    bullet = BULLET_PRESET if list_stack[-1] == "bullet" else ORDERED_PRESET

                blocks.append(ParagraphBlock(text=text, bullet_preset=bullet, links=links))
                idx += 3
                continue

            if token.type in {"fence", "code_block"}:
                code_text = token.content.rstrip("\n")
                if not code_text:
                    blocks.append(ParagraphBlock(text=""))
                else:
                    for line in code_text.splitlines():
                        blocks.append(ParagraphBlock(text=line))
                idx += 1
                continue

            if token.type == "hr":
                blocks.append(ParagraphBlock(text=""))
                idx += 1
                continue

            idx += 1

        return blocks

    def _inline_to_text(self, inline_token: Optional[Token]) -> tuple[str, List[InlineLink]]:
        if not inline_token or not inline_token.children:
            return "", []

        pieces: List[str] = []
        links: List[InlineLink] = []
        link_stack: List[tuple[str, int]] = []

        def current_length() -> int:
            return len("".join(pieces))

        for child in inline_token.children:
            if child.type == "link_open":
                url = child.attrGet("href") or ""
                link_stack.append((url, current_length()))
                continue

            if child.type == "link_close":
                if not link_stack:
                    continue
                url, start = link_stack.pop()
                end = current_length()
                if url and end > start:
                    links.append(InlineLink(start=start, end=end, url=url))
                continue

            if child.type == "text":
                pieces.append(child.content)
                continue

            if child.type == "code_inline":
                pieces.append(child.content)
                continue

            if child.type in {"softbreak", "hardbreak"}:
                pieces.append(" ")
                continue

            if child.type == "image":
                alt_text = child.content or child.attrGet("alt") or ""
                if alt_text:
                    pieces.append(alt_text)
                continue

        text = "".join(pieces)
        text = " ".join(text.split())
        return text, links


class GoogleDocsPayloadBuilder:
    def __init__(self) -> None:
        self.cursor = 1
        self.text_parts: List[str] = []
        self.paragraph_styles: List[Dict[str, Any]] = []
        self.bullets: List[Dict[str, Any]] = []
        self.link_styles: List[Dict[str, Any]] = []

    def append_block(self, block: ParagraphBlock) -> None:
        line_text = block.text or ""
        start = self.cursor
        payload = f"{line_text}\n"
        self.text_parts.append(payload)
        end = start + len(payload)

        if block.named_style_type and line_text.strip():
            self.paragraph_styles.append(
                {
                    "range": {"startIndex": start, "endIndex": end},
                    "paragraphStyle": {"namedStyleType": block.named_style_type},
                    "fields": "namedStyleType",
                }
            )

        if block.bullet_preset and line_text.strip():
            self.bullets.append(
                {
                    "range": {"startIndex": start, "endIndex": end},
                    "bulletPreset": block.bullet_preset,
                }
            )

        for link in block.links:
            if link.end <= link.start:
                continue
            self.link_styles.append(
                {
                    "range": {
                        "startIndex": start + link.start,
                        "endIndex": start + link.end,
                    },
                    "textStyle": {"link": {"url": link.url}},
                    "fields": "link",
                }
            )

        self.cursor = end

    def build(self, blocks: Iterable[ParagraphBlock]) -> tuple[str, List[Dict[str, Any]]]:
        for block in blocks:
            self.append_block(block)

        full_text = "".join(self.text_parts)
        if not full_text:
            full_text = "\n"

        requests: List[Dict[str, Any]] = []
        requests.extend({"createParagraphBullets": bullet} for bullet in self.bullets)
        requests.extend({"updateParagraphStyle": style} for style in self.paragraph_styles)
        requests.extend({"updateTextStyle": style} for style in self.link_styles)
        return full_text, requests


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync Markdown docs to Google Docs")
    parser.add_argument("--docs-dir", default=os.getenv("DOCS_DIR", "docs"), help="Markdown docs directory")
    parser.add_argument(
        "--mkdocs-config",
        default=os.getenv("MKDOCS_CONFIG", "mkdocs.yml"),
        help="Path to mkdocs.yml",
    )
    parser.add_argument(
        "--doc-id",
        default=os.getenv("GOOGLE_DOC_ID", ""),
        help="Target Google Docs document ID",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate parsing/merge and print summary without calling Google Docs API",
    )
    return parser.parse_args()


def read_mkdocs_nav_order(mkdocs_config_path: Path) -> List[str]:
    if not mkdocs_config_path.exists():
        return []

    config = yaml.safe_load(mkdocs_config_path.read_text(encoding="utf-8")) or {}
    nav = config.get("nav", [])
    ordered_paths: List[str] = []

    def collect(items: Any) -> None:
        if isinstance(items, str):
            ordered_paths.append(items)
            return

        if isinstance(items, list):
            for item in items:
                collect(item)
            return

        if isinstance(items, dict):
            for value in items.values():
                collect(value)

    collect(nav)
    return ordered_paths


def resolve_markdown_files(docs_dir: Path, mkdocs_config_path: Path) -> List[Path]:
    nav_paths = read_mkdocs_nav_order(mkdocs_config_path)
    files: List[Path] = []
    seen: set[Path] = set()

    for nav_path in nav_paths:
        candidate = (docs_dir / nav_path).resolve()
        if candidate.exists() and candidate.suffix.lower() == ".md" and candidate not in seen:
            files.append(candidate)
            seen.add(candidate)

    for candidate in sorted(docs_dir.rglob("*.md")):
        resolved = candidate.resolve()
        if resolved not in seen:
            files.append(resolved)
            seen.add(resolved)

    if not nav_paths:
        files = []
        seen = set()
        fallback_sections = [
            docs_dir / "index.md",
            docs_dir / "conceptos",
            docs_dir / "analisis",
            docs_dir / "automatizacion",
            docs_dir / "modelado",
            docs_dir / "organizacion",
            docs_dir / "configuracion",
            docs_dir / "changelog.md",
        ]

        for section in fallback_sections:
            if not section.exists():
                continue
            if section.is_file():
                resolved = section.resolve()
                if resolved not in seen and resolved.suffix.lower() == ".md":
                    files.append(resolved)
                    seen.add(resolved)
                continue

            for candidate in sorted(section.rglob("*.md")):
                resolved = candidate.resolve()
                if resolved not in seen:
                    files.append(resolved)
                    seen.add(resolved)

        for candidate in sorted(docs_dir.rglob("*.md")):
            resolved = candidate.resolve()
            if resolved not in seen:
                files.append(resolved)
                seen.add(resolved)

    return files


def load_service_account_credentials():
    raw_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    file_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "").strip()

    def from_json_text(text: str, source_label: str):
        try:
            info = json.loads(text)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"{source_label} no contiene JSON valido") from exc
        return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)

    if raw_json:
        try:
            return from_json_text(raw_json, "GOOGLE_SERVICE_ACCOUNT_JSON")
        except RuntimeError as raw_exc:
            # Allow Base64-encoded JSON for CI secrets that store one-line credentials.
            try:
                decoded = base64.b64decode(raw_json, validate=True).decode("utf-8")
            except Exception:
                raise RuntimeError(
                    "GOOGLE_SERVICE_ACCOUNT_JSON no contiene JSON valido (ni Base64 JSON valido)"
                ) from raw_exc
            return from_json_text(decoded, "GOOGLE_SERVICE_ACCOUNT_JSON (Base64)")

    if file_path:
        service_file = Path(file_path)
        if not service_file.exists():
            raise RuntimeError(f"No existe GOOGLE_SERVICE_ACCOUNT_FILE: {service_file}")
        file_content = service_file.read_text(encoding="utf-8").strip()
        if not file_content:
            raise RuntimeError(f"GOOGLE_SERVICE_ACCOUNT_FILE esta vacio: {service_file}")
        return from_json_text(file_content, "GOOGLE_SERVICE_ACCOUNT_FILE")

    raise RuntimeError(
        "Falta autenticacion. Define GOOGLE_SERVICE_ACCOUNT_JSON o GOOGLE_SERVICE_ACCOUNT_FILE."
    )


def merge_markdown_sources(markdown_files: List[Path]) -> str:
    def strip_frontmatter(markdown_text: str) -> str:
        if not markdown_text.startswith("---\n"):
            return markdown_text

        lines = markdown_text.splitlines()
        if not lines or lines[0].strip() != "---":
            return markdown_text

        for idx in range(1, len(lines)):
            if lines[idx].strip() == "---":
                return "\n".join(lines[idx + 1 :]).lstrip("\n")
        return markdown_text

    def strip_web_directives(markdown_text: str) -> str:
        cleaned_lines: List[str] = []
        for line in markdown_text.splitlines():
            if line.strip().startswith(":::"):
                continue
            cleaned_lines.append(line)
        return "\n".join(cleaned_lines)

    chunks: List[str] = []
    for idx, file_path in enumerate(markdown_files):
        raw_content = file_path.read_text(encoding="utf-8")
        content = strip_web_directives(strip_frontmatter(raw_content)).strip()
        if not content:
            continue
        chunks.append(content)
        if idx < len(markdown_files) - 1:
            chunks.append("\n---\n")
    return "\n\n".join(chunks).strip()


def replace_google_doc_content(service, doc_id: str, text: str, style_requests: List[Dict[str, Any]]) -> None:
    doc = service.documents().get(documentId=doc_id).execute()
    end_index = doc.get("body", {}).get("content", [{}])[-1].get("endIndex", 1)

    requests: List[Dict[str, Any]] = []
    # Google Docs requires startIndex < endIndex.
    # On nearly-empty docs end_index is usually 2, so end_index - 1 == 1 (empty range).
    delete_end = end_index - 1
    if delete_end > 1:
        requests.append(
            {
                "deleteContentRange": {
                    "range": {
                        "startIndex": 1,
                        "endIndex": delete_end,
                    }
                }
            }
        )

    requests.append(
        {
            "insertText": {
                "location": {"index": 1},
                "text": text,
            }
        }
    )
    requests.extend(style_requests)

    service.documents().batchUpdate(documentId=doc_id, body={"requests": requests}).execute()


def main() -> int:
    args = parse_args()

    if not args.doc_id and not args.dry_run:
        print("ERROR: falta GOOGLE_DOC_ID o --doc-id", file=sys.stderr)
        return 1

    docs_dir = Path(args.docs_dir)
    mkdocs_config = Path(args.mkdocs_config)

    if not docs_dir.exists():
        print(f"ERROR: no existe el directorio de docs: {docs_dir}", file=sys.stderr)
        return 1

    markdown_files = resolve_markdown_files(docs_dir=docs_dir, mkdocs_config_path=mkdocs_config)
    if not markdown_files:
        print(f"ERROR: no se encontraron archivos Markdown en {docs_dir}", file=sys.stderr)
        return 1

    merged_markdown = merge_markdown_sources(markdown_files)
    converter = MarkdownToBlocksConverter()
    blocks = converter.convert(merged_markdown)

    payload_builder = GoogleDocsPayloadBuilder()
    text, style_requests = payload_builder.build(blocks)

    if args.dry_run:
        print(f"Dry run OK. Parsed {len(markdown_files)} markdown files.")
        for file_path in markdown_files:
            print(f"- {file_path}")
        print(f"Generated payload chars: {len(text)}")
        print(f"Generated style requests: {len(style_requests)}")
        return 0

    try:
        credentials = load_service_account_credentials()
        service = build("docs", "v1", credentials=credentials)
        replace_google_doc_content(service=service, doc_id=args.doc_id, text=text, style_requests=style_requests)
    except RuntimeError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    except HttpError as exc:
        status = getattr(exc.resp, "status", "unknown")
        print(f"ERROR: Google Docs API devolvio HTTP {status}. {exc}", file=sys.stderr)
        if status == 403:
            print(
                "Sugerencia: comparte el documento con el service account "
                "(permiso Editor) y verifica que la API de Google Docs este habilitada.",
                file=sys.stderr,
            )
        elif status == 404:
            print(
                "Sugerencia: verifica GOOGLE_DOC_ID. Debe ser el ID del documento (sin URL completa).",
                file=sys.stderr,
            )
        return 1
    except Exception as exc:
        print(f"ERROR: fallo inesperado durante el sync a Google Docs: {exc}", file=sys.stderr)
        return 1

    print(f"Synced {len(markdown_files)} markdown files into Google Doc {args.doc_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

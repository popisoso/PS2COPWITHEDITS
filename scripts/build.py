#!/usr/bin/env python3
"""Assemble the single-page site.

Reads src/shell.html and every pages/<route>.html fragment, wraps each fragment in a
<template data-route="<route>"> and writes:
  index.html     - the full website (open directly, or serve the folder / GitHub Pages)
  artifact.html  - the same page without the <html>/<head>/<body> wrapper, for publishing
                   as a claude.ai Artifact (the Artifact host adds its own skeleton)
Run:  python3 scripts/build.py
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ORDER = [
    "home", "organizations", "map", "org-vbl", "org-reva", "events", "blog", "blog-entry",
    "guide", "guide-location", "guide-structure", "guide-frictions", "guide-balance",
    "guide-generations", "faq", "contact", "media", "about", "terms", "privacy", "cookies",
]


def load_pages():
    pages = {p.stem: p for p in (ROOT / "pages").glob("*.html")}
    ordered = [r for r in ORDER if r in pages] + sorted(r for r in pages if r not in ORDER)
    out = []
    for route in ordered:
        text = pages[route].read_text(encoding="utf-8").strip()
        m = re.match(r"<!--\s*title:\s*(.*?)\s*-->", text)
        title = m.group(1) if m else route.replace("-", " ").title()
        out.append(
            f'<template data-route="{route}" data-title="{html.escape(title, quote=True)}">\n'
            f'<div class="page page-{route}">\n{text}\n</div>\n</template>'
        )
    return out


def main():
    shell = (ROOT / "src" / "shell.html").read_text(encoding="utf-8")
    full = shell.replace("{{TEMPLATES}}", "\n\n".join(load_pages()))
    (ROOT / "index.html").write_text(full, encoding="utf-8")

    # Artifact variant: keep only what sits between the markers, minus head/body tags.
    start = full.index("<!--ARTIFACT-START-->") + len("<!--ARTIFACT-START-->")
    end = full.index("<!--BODY-END-->")
    body = full[start:end]
    body = body.replace("<!--HEAD-END-->\n</head>\n<body>", "")
    (ROOT / "artifact.html").write_text(body.strip() + "\n", encoding="utf-8")
    print(f"Built index.html and artifact.html with {len(load_pages())} pages")


if __name__ == "__main__":
    main()

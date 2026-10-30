"""Converts the Copilot source documents that are not Markdown (two Word files and the HTML handbook) to Markdown, so that
seed-copilot-docs.mjs can load them. Output goes to data/copilot-converted/ (git-ignored).
Usage: python scripts/convert-copilot-sources.py "<Github Copilot folder>"
"""
import html
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

import docx  # python-docx

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / "data" / "copilot-converted"
out.mkdir(parents=True, exist_ok=True)


def docx_to_md(path: Path) -> str:
    d = docx.Document(str(path))
    lines = []
    body = d.element.body
    paragraphs = {p._p: p for p in d.paragraphs}
    tables = {t._tbl: t for t in d.tables}
    for el in body.iterchildren():
        if el in paragraphs:
            p = paragraphs[el]
            text = p.text.strip()
            if not text:
                continue
            style = (p.style.name or "").lower()
            m = re.match(r"heading (\d)", style)
            if style == "title":
                lines.append(f"# {text}")
            elif m:
                lines.append("#" * min(int(m.group(1)) + 1, 6) + f" {text}")
            elif p.runs and all(r.bold for r in p.runs if r.text.strip()) and len(text) < 90:
                lines.append(f"### {text}")
            elif "list" in style:
                lines.append(f"- {text}")
            else:
                lines.append(text)
            lines.append("")
        elif el in tables:
            t = tables[el]
            rows = [[c.text.strip().replace("\n", " ").replace("|", "/") for c in r.cells] for r in t.rows]
            if rows:
                lines.append("| " + " | ".join(rows[0]) + " |")
                lines.append("|" + "---|" * len(rows[0]))
                for r in rows[1:]:
                    lines.append("| " + " | ".join(r) + " |")
                lines.append("")
    return "\n".join(lines)


class Handbook(HTMLParser):
    """Keeps headings, paragraphs, list items, tables and code blocks; drops the page chrome, scripts and styles."""

    def __init__(self):
        super().__init__()
        self.out, self.buf, self.skip, self.pre, self.tag = [], [], 0, False, None
        self.row = []

    def flush(self, prefix=""):
        text = re.sub(r"[ \t]+", " ", "".join(self.buf)).strip()
        if text:
            self.out.append(f"{prefix}{text}\n")
        self.buf = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "nav", "button", "svg", "head"):
            self.skip += 1
        elif tag == "pre":
            self.flush()
            self.pre = True
        elif tag in ("h1", "h2", "h3", "h4", "p", "li", "td", "th", "tr"):
            self.flush()
            self.tag = tag

    def handle_endtag(self, tag):
        if tag in ("script", "style", "nav", "button", "svg", "head"):
            self.skip = max(0, self.skip - 1)
        elif tag == "pre":
            self.out.append("```\n" + "".join(self.buf).strip("\n") + "\n```\n")
            self.buf, self.pre = [], False
        elif tag in ("h1", "h2", "h3", "h4"):
            self.flush("#" * int(tag[1]) + " ")
        elif tag == "p":
            self.flush()
        elif tag == "li":
            self.flush("- ")
        elif tag in ("td", "th"):
            self.row.append(re.sub(r"\s+", " ", "".join(self.buf)).strip().replace("|", "/"))
            self.buf = []
        elif tag == "tr":
            if self.row:
                self.out.append("| " + " | ".join(self.row) + " |")
                if len(self.out) >= 1 and tag == "tr" and not any(o.startswith("|---") for o in self.out[-3:]):
                    self.out.append("|" + "---|" * len(self.row))
            self.row = []

    def handle_data(self, data):
        if not self.skip:
            self.buf.append(data if self.pre else html.unescape(data))


for name, target in [
    ("AI Enabled Development Guide.docx", "ai-enabled-development-guide.md"),
    ("GitHub Copilot Training Program.docx", "github-copilot-training-program.md"),
    # Docs folder. The three "for Director" plans are deliberately not converted.
    ("Docs/GitHub Copilot Training - Day 7 Gate - A Participant Handout.docx", "day-7-gate-a-participant-handout.md"),
    ("Docs/GitHub Copilot Training - Day 7 Gate - B Facilitator Scoring Guide.docx", "day-7-gate-b-facilitator-scoring-guide.md"),
]:
    (out / target).write_text(docx_to_md(src / name), encoding="utf-8")
    print("converted", name)

h = Handbook()
h.feed((src / "AI-Development-Handbook 1.html").read_text(encoding="utf-8"))
h.flush()
body = "\n".join(h.out)
first = re.search(r"^# ", body, re.M)  # the page's own title; everything before it is the sidebar navigation text
(out / "ai-development-handbook.md").write_text(body[first.start():] if first else body, encoding="utf-8")
print("converted AI-Development-Handbook 1.html")

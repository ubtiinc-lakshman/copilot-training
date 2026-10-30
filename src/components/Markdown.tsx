import type { ReactNode } from "react";
import CopyButton from "@/components/CopyButton";

// A small Markdown renderer for the course documents: headings, paragraphs, lists, tables, fenced code (with a Copy button), bold, italics, inline code, links.
// Plain React elements (no HTML injection), so document text can never run script.
// `resolveHref` turns a link to another document ("Core_Principles.md") into a page on the site, or null when that document is not available to this reader.
type Resolve = (href: string) => string | null;

function inline(text: string, resolve?: Resolve): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const key = m.index;
    if (m[1]) out.push(<code key={key} className="rounded bg-black/5 px-1 font-mono text-[0.9em] dark:bg-white/10">{t.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={key}>{t.slice(2, -2)}</strong>);
    else if (m[3]) out.push(<em key={key}>{t.slice(1, -1)}</em>);
    else {
      const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!;
      const local = resolve?.(href.trim());
      if (/^https?:\/\//.test(href)) out.push(<a key={key} href={href} className="link" target="_blank" rel="noreferrer">{label}</a>);
      else if (local) out.push(<a key={key} href={local} className="link">{label}</a>);
      else out.push(label); // a link to a file that is not on the site (or not for this reader): keep the words
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const isTableRow = (l: string) => l.trim().startsWith("|") && l.trim().endsWith("|");
const cells = (l: string) => l.trim().slice(1, -1).split("|").map((c) => c.trim());
// A heading such as "main.bicep" or "models/staging/schema.yml" names the file the next code block belongs to.
const looksLikeFile = (h: string) => /^[\w./ -]+\.[A-Za-z0-9]+$/.test(h) || h.includes("/");

export default function Markdown({ source, resolveHref }: { source: string; resolveHref?: Resolve }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let heading = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const key = i;
    const fence = /^(`{3,})(.*)$/.exec(line);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(fence[1])) code.push(lines[i++]);
      i++;
      const text = code.join("\n");
      const label = looksLikeFile(heading) ? heading : fence[2].trim() || "Text";
      nodes.push(
        <div key={key} className="overflow-hidden rounded-xl border border-line">
          <div className="flex items-center justify-between gap-3 bg-black/5 px-3 py-1.5 dark:bg-white/10">
            <span className="truncate font-mono text-xs font-semibold">{label}</span>
            <CopyButton text={text} label="Copy" />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap bg-[#0f1220] p-4 font-mono text-sm leading-relaxed text-slate-100">{text}</pre>
        </div>,
      );
    } else if (/^#{1,6}\s/.test(line)) {
      const level = line.indexOf(" ");
      const cls = ["", "text-2xl font-extrabold", "text-xl font-bold", "text-lg font-bold", "font-bold", "font-semibold", "font-semibold"][level];
      heading = line.slice(level + 1).trim();
      nodes.push(<p key={key} className={`${cls} mt-4`}>{inline(heading, resolveHref)}</p>);
      i++;
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s/, ""));
      const Tag = ordered ? "ol" : "ul";
      nodes.push(
        <Tag key={key} className={`ml-5 space-y-1 text-sm ${ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((it, n) => <li key={n}>{inline(it, resolveHref)}</li>)}
        </Tag>,
      );
    } else if (isTableRow(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]));
      nodes.push(
        <div key={key} className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-line">{head.map((h, n) => <th key={n} className="p-2">{inline(h, resolveHref)}</th>)}</tr></thead>
            <tbody>{rows.map((r, n) => <tr key={n} className="border-b border-line last:border-0">{r.map((c, m) => <td key={m} className="p-2 align-top">{inline(c, resolveHref)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
    } else if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      nodes.push(<hr key={key} className="border-line" />);
      i++;
    } else if (!line.trim()) {
      i++;
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|`{3,}|\s*([-*]|\d+\.)\s)/.test(lines[i]) && !isTableRow(lines[i])) para.push(lines[i++]);
      if (!para.length) para.push(lines[i++]); // never loop on a line nothing else accepts
      nodes.push(<p key={key} className="text-sm leading-relaxed">{inline(para.join(" "), resolveHref)}</p>);
    }
  }
  return <div className="space-y-3">{nodes}</div>;
}

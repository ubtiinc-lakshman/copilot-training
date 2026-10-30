import type { ReactNode } from "react";

// A small Markdown renderer for the course documents: headings, paragraphs, lists, tables, fenced code, bold, italics, inline code, links.
// Plain React elements (no HTML injection), so document text can never run script.
function inline(text: string): ReactNode[] {
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
      // Only absolute web links are kept; links between the original files do not exist on the site.
      out.push(/^https?:\/\//.test(href) ? <a key={key} href={href} className="link" target="_blank" rel="noreferrer">{label}</a> : label);
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const isTableRow = (l: string) => l.trim().startsWith("|") && l.trim().endsWith("|");
const cells = (l: string) => l.trim().slice(1, -1).split("|").map((c) => c.trim());

export default function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
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
      nodes.push(
        <pre key={key} className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#0f1220] p-4 font-mono text-sm leading-relaxed text-slate-100">
          {code.join("\n")}
        </pre>,
      );
    } else if (/^#{1,6}\s/.test(line)) {
      const level = line.indexOf(" ");
      const cls = ["", "text-2xl font-extrabold", "text-xl font-bold", "text-lg font-bold", "font-bold", "font-semibold", "font-semibold"][level];
      nodes.push(<p key={key} className={`${cls} mt-4`}>{inline(line.slice(level + 1))}</p>);
      i++;
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s/, ""));
      const Tag = ordered ? "ol" : "ul";
      nodes.push(
        <Tag key={key} className={`ml-5 space-y-1 text-sm ${ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((it, n) => <li key={n}>{inline(it)}</li>)}
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
            <thead><tr className="border-b border-line">{head.map((h, n) => <th key={n} className="p-2">{inline(h)}</th>)}</tr></thead>
            <tbody>{rows.map((r, n) => <tr key={n} className="border-b border-line last:border-0">{r.map((c, m) => <td key={m} className="p-2 align-top">{inline(c)}</td>)}</tr>)}</tbody>
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
      nodes.push(<p key={key} className="text-sm leading-relaxed">{inline(para.join(" "))}</p>);
    }
  }
  return <div className="space-y-3">{nodes}</div>;
}

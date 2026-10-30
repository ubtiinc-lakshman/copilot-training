"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

// Top navigation links with the current section highlighted.
export function NavLinks({ items }: { items: NavItem[] }) {
  const path = usePathname();
  // The most specific matching link is the active one, so "/courses/copilot" is not lit on "/courses/copilot/library".
  const best = items.filter((n) => path === n.href || (n.href !== "/" && path.startsWith(n.href + "/"))).sort((a, b) => b.href.length - a.href.length)[0];
  return (
    <>
      {items.map((n) => {
        const active = n === best;
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-brand-soft text-brand" : "text-muted hover:bg-brand-soft hover:text-brand"}`}
          >
            {n.label}
          </Link>
        );
      })}
    </>
  );
}

// Course menu: groups of links, vertical on wide screens (left sidebar) and a scrolling strip on narrow ones.
// The most specific matching link across all groups is the active one.
export function SideNavLinks({ groups }: { groups: { label?: string; items: NavItem[] }[] }) {
  const path = usePathname();
  const all = groups.flatMap((g) => g.items);
  const best = all.filter((n) => path === n.href || path.startsWith(n.href + "/")).sort((a, b) => b.href.length - a.href.length)[0];
  return (
    <div className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
      {groups.map((g, gi) => (
        <div key={g.label ?? gi} className="flex shrink-0 gap-1 lg:mt-4 lg:flex-col lg:gap-0.5 lg:first:mt-0">
          {g.label && <p className="hidden px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted lg:block">{g.label}</p>}
          {g.items.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={n === best ? "page" : undefined}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${n === best ? "bg-brand-soft text-brand" : "text-muted hover:bg-brand-soft hover:text-brand"}`}
            >
              {n.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

// Avatar button with a dropdown. The panel content is rendered on the server and passed in as children.
export function AccountMenu({ initials, children }: { initials: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const path = usePathname();
  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) ref.current?.removeAttribute("open");
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  useEffect(() => ref.current?.removeAttribute("open"), [path]);
  return (
    <details ref={ref} className="relative">
      <summary
        aria-label="Account menu"
        className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full text-sm font-bold text-white ring-2 ring-transparent transition hover:ring-brand/40 [&::-webkit-details-marker]:hidden"
        style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}
      >
        {initials}
      </summary>
      <div className="card absolute right-0 mt-2 w-72 p-2 shadow-lg">{children}</div>
    </details>
  );
}

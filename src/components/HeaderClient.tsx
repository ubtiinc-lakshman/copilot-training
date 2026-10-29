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

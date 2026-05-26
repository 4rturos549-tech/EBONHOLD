"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { primaryNav, secondaryNav, utilityLinks } from "@/config/nav";
import { brand } from "@/config/brand";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => document.body.classList.remove("drawer-open");
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="lg:hidden p-2 text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] transition-colors"
      >
        <Menu size={24} strokeWidth={1.5} />
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-50 transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Menú de navegación"
      >
        <div className="h-full overflow-y-auto bg-[var(--color-bg)] border-l border-[var(--color-border)]">
          <div className="sticky top-0 flex items-center justify-between px-5 py-4 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-border)]">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <Logo size={24} withGlow={false} />
              <span className="font-display text-base tracking-[0.25em] text-accent-gradient">
                {brand.fullName}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="p-2 text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] transition-colors"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="px-5 py-4">
            {[...primaryNav, ...secondaryNav].map((group) => (
              <details key={group.label} className="group/details mb-2">
                <summary className="cursor-pointer list-none flex items-center justify-between py-3 font-display uppercase tracking-wider text-sm text-[var(--color-accent)] border-b border-[var(--color-border)]/60">
                  <span>{group.label}</span>
                  <ChevronRight
                    size={16}
                    className="transition-transform duration-200 group-open/details:rotate-90"
                  />
                </summary>
                <ul className="py-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const cls =
                      "flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-[var(--color-text)] hover:text-[var(--color-accent-bright)] hover:bg-[var(--color-bg-elevated)] rounded transition-colors";
                    return item.external ? (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          <span className="flex items-center gap-3">
                            {Icon && (
                              <Icon
                                size={16}
                                strokeWidth={1.5}
                                className="text-[var(--color-accent-dim)] shrink-0"
                              />
                            )}
                            {item.label}
                          </span>
                          <ExternalLink size={12} className="opacity-50" />
                        </a>
                      </li>
                    ) : (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          <span className="flex items-center gap-3">
                            {Icon && (
                              <Icon
                                size={16}
                                strokeWidth={1.5}
                                className="text-[var(--color-accent-dim)] shrink-0"
                              />
                            )}
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}

            <div className="divider-ornate my-4" />

            <ul className="grid grid-cols-3 gap-2">
              {utilityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-center py-3 px-2 font-display uppercase tracking-wide text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] border border-[var(--color-border)] rounded hover:border-[var(--color-border-hover)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

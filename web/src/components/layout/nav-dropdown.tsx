import Link from "next/link";
import { ChevronDown, ExternalLink, ChevronRight } from "lucide-react";
import type { NavItem } from "@/config/nav";

/**
 * Dropdown 100% CSS via group-hover. Server component (cero JS al cliente).
 * El top-level boton es solo texto + chevron para mantener el header compacto.
 * Los iconos viven solo dentro del dropdown (alli aportan a la jerarquia visual).
 */
export function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: NavItem[];
}) {
  return (
    <div className="group relative">
      <button type="button" className="nav-item">
        <span>{label}</span>
        <ChevronDown
          size={11}
          strokeWidth={2}
          className="transition-transform duration-200 group-hover:rotate-180"
        />
      </button>

      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full pt-2 z-50 transition-all duration-150">
        <div className="panel min-w-[18rem] py-2">
          {items.map((item) => {
            const ItemIcon = item.icon;
            const inner = (
              <>
                <span className="flex items-center gap-3">
                  {ItemIcon && (
                    <ItemIcon
                      size={16}
                      strokeWidth={1.5}
                      className="text-[var(--color-accent-dim)] group-hover/item:text-[var(--color-accent)] shrink-0"
                    />
                  )}
                  <span>{item.label}</span>
                </span>
                {item.external ? (
                  <ExternalLink size={12} className="opacity-50 shrink-0" />
                ) : (
                  <ChevronRight
                    size={14}
                    className="opacity-30 group-hover/item:opacity-100 group-hover/item:text-[var(--color-accent)] shrink-0"
                  />
                )}
              </>
            );
            const className =
              "group/item flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-bright)] transition-colors";
            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

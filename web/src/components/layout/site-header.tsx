import Link from "next/link";
import { NavDropdown } from "./nav-dropdown";
import { MobileNav } from "./mobile-nav";
import { Logo } from "@/components/ui/logo";
import { primaryNav, secondaryNav, utilityLinks } from "@/config/nav";
import { brand } from "@/config/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center px-4 lg:px-6 gap-4">
        <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
          {primaryNav.map((group) => (
            <NavDropdown
              key={group.label}
              label={group.label}
              items={group.items}
            />
          ))}
        </nav>

        <Link
          href="/"
          className="group lg:mx-auto flex items-center gap-2 sm:gap-3 whitespace-nowrap"
          aria-label="Inicio"
        >
          <Logo
            size={32}
            className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[8deg] animate-logo-float"
          />
          <span className="font-display text-base sm:text-xl lg:text-2xl font-bold tracking-[0.25em] sm:tracking-[0.3em] lg:tracking-[0.35em] text-accent-gradient">
            {brand.fullName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
          {secondaryNav.map((group) => (
            <NavDropdown
              key={group.label}
              label={group.label}
              items={group.items}
            />
          ))}
          {utilityLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-item">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto lg:hidden">
          <MobileNav />
        </div>
      </div>
      <div className="divider-ornate" />
    </header>
  );
}

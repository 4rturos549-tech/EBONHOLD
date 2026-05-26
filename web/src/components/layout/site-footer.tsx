import { brand } from "@/config/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/80 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-[var(--color-text-dim)]">
        <p className="font-display uppercase tracking-[0.3em] text-[var(--color-accent-dim)]">
          {brand.fullName} · {brand.tagline}
        </p>
        <p className="mt-3 max-w-2xl mx-auto">
          Servidor privado sin ánimo de lucro. World of Warcraft© es marca
          registrada de Blizzard Entertainment, Inc. Este proyecto no está
          afiliado ni patrocinado por Blizzard.
        </p>
        <p className="mt-3 text-[var(--color-text-dim)]/70">
          © {new Date().getFullYear()} {brand.name} — Forjado por {brand.founder}.
        </p>
      </div>
    </footer>
  );
}

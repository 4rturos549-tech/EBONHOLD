import { Package, CheckCircle2 } from "lucide-react";

export function PatchesPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-8">
      <header className="mb-6 animate-fade-in-up">
        <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
          Cliente
        </p>
        <h1 className="font-display text-3xl text-accent-gradient mt-2">Parches</h1>
        <div className="divider-ornate mt-4" />
      </header>

      <div className="panel p-10 text-center animate-fade-in-up stagger-1">
        <Package size={48} className="mx-auto text-[var(--color-accent-dim)] mb-4" />
        <h2 className="font-display text-xl text-[var(--color-accent)] mb-2 uppercase tracking-wide">
          Sin parches pendientes
        </h2>
        <p className="text-sm text-[var(--color-text-dim)] mb-6">
          Tu cliente está al día con la última versión del contenido custom.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-[var(--color-secondary-bright)] bg-[var(--color-secondary-dim)]/20 px-3 py-1.5 rounded border border-[var(--color-secondary-dim)]">
          <CheckCircle2 size={14} />
          Cliente verificado
        </div>
      </div>
    </div>
  );
}

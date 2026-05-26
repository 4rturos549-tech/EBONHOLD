import { NewsList } from "@/components/features/NewsList";

export function NewsPage() {
  return (
    <div className="h-full overflow-y-auto px-10 py-8">
      <header className="mb-6 animate-fade-in-up">
        <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
          Comunidad
        </p>
        <h1 className="font-display text-3xl text-accent-gradient mt-2">Noticias</h1>
        <div className="divider-ornate mt-4" />
      </header>
      <NewsList />
    </div>
  );
}

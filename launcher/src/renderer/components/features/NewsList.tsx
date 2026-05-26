import { ArrowUpRight } from "lucide-react";

const placeholder = [
  { id: 1, title: "Bienvenido a Ebonhold", date: "Próximamente", excerpt: "Estamos preparando el lanzamiento. Únete al Discord para enterarte primero." },
  { id: 2, title: "Roadmap publicado", date: "Próximamente", excerpt: "Consulta el plan de desarrollo en la web." },
  { id: 3, title: "Comunidad creciendo", date: "Próximamente", excerpt: "Ya somos un equipo activo trabajando en el contenido custom." },
];

export function NewsList() {
  return (
    <div className="space-y-3">
      {placeholder.map((n, i) => (
        <article
          key={n.id}
          className={`panel panel-hover p-4 cursor-default animate-fade-in-up stagger-${i + 1}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-accent-dim)]">
                {n.date}
              </p>
              <h3 className="mt-1 font-display text-sm text-[var(--color-text)]">{n.title}</h3>
              <p className="mt-1 text-xs text-[var(--color-text-dim)] leading-relaxed">
                {n.excerpt}
              </p>
            </div>
            <ArrowUpRight
              size={14}
              className="text-[var(--color-accent-dim)] shrink-0 mt-1"
            />
          </div>
        </article>
      ))}
    </div>
  );
}

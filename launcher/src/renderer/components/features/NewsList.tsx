import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { fetchNews, type ApiNewsItem } from "@/lib/api";

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function NewsList({ limit = 5 }: { limit?: number }) {
  const [items, setItems] = useState<ApiNewsItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchNews(limit).then((data) => {
      if (alive) setItems(data);
    });
    return () => {
      alive = false;
    };
  }, [limit]);

  if (items === null) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="panel p-4">
            <div className="h-3 w-20 bg-[var(--color-bg-elevated)] rounded animate-pulse" />
            <div className="h-4 w-3/4 mt-2 bg-[var(--color-bg-elevated)] rounded animate-pulse" />
            <div className="h-3 w-full mt-2 bg-[var(--color-bg-elevated)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="panel p-6 text-center">
        <p className="text-sm text-[var(--color-text-dim)]">
          No hay noticias disponibles. Verifica tu conexión.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <article
          key={item.id}
          onClick={() => window.api.app.openExternal(item.url)}
          className={`panel panel-hover p-4 cursor-pointer animate-fade-in-up stagger-${i + 1}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-accent-dim)]">
                {formatDate(item.date)}
              </p>
              <h3 className="mt-1 font-display text-sm text-[var(--color-text)]">{item.title}</h3>
              <p className="mt-1 text-xs text-[var(--color-text-dim)] leading-relaxed line-clamp-3">
                {item.excerpt}
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

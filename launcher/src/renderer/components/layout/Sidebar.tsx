import { Home, Newspaper, UserPlus, Package, Settings, Info, MessageSquare, Globe } from "lucide-react";
import type { Route } from "@/App";
import { brand } from "@shared/brand";

const items: { id: Route; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "news", label: "Noticias", icon: Newspaper },
  { id: "register", label: "Crear cuenta", icon: UserPlus },
  { id: "patches", label: "Parches", icon: Package },
  { id: "settings", label: "Ajustes", icon: Settings },
  { id: "about", label: "Acerca de", icon: Info },
];

export function Sidebar({
  active,
  onChange,
}: {
  active: Route;
  onChange: (r: Route) => void;
}) {
  return (
    <aside className="w-56 flex flex-col bg-[var(--color-bg)]/60 border-r border-[var(--color-border)]">
      <nav className="flex-1 p-3 space-y-1 mt-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`sidebar-item w-full text-left animate-fade-in-up stagger-${i + 1} ${active === item.id ? "active" : ""}`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)] space-y-1">
        <button
          onClick={() => window.api.app.openExternal(brand.webUrl)}
          className="sidebar-item w-full text-left"
        >
          <Globe size={14} strokeWidth={1.5} />
          <span>Web</span>
        </button>
        <button
          onClick={() => window.api.app.openExternal(brand.discord)}
          className="sidebar-item w-full text-left"
        >
          <MessageSquare size={14} strokeWidth={1.5} />
          <span>Discord</span>
        </button>
      </div>
    </aside>
  );
}

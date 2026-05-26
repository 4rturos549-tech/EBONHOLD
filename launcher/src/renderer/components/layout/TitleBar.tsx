import { useEffect, useState } from "react";
import { Minus, Square, Copy, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { brand } from "@shared/brand";

export function TitleBar() {
  const [version, setVersion] = useState<string>("");
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    window.api.app.getVersion().then(setVersion);
    window.api.window.isMaximized().then(setMaximized);
  }, []);

  async function toggleMaximize() {
    await window.api.window.maximize();
    setMaximized(await window.api.window.isMaximized());
  }

  return (
    <div className="titlebar">
      <Logo size={18} withGlow={false} className="animate-logo-float" />
      <span className="font-display text-xs tracking-[0.3em] text-accent-gradient">
        {brand.fullName}
      </span>
      <span className="text-[10px] text-[var(--color-text-muted)] ml-1">
        v{version || "—"}
      </span>

      <div className="flex-1" />

      <button
        className="titlebar-button"
        onClick={() => window.api.window.minimize()}
        aria-label="Minimizar"
      >
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <button
        className="titlebar-button"
        onClick={toggleMaximize}
        aria-label={maximized ? "Restaurar" : "Maximizar"}
      >
        {maximized ? (
          <Copy size={12} strokeWidth={1.5} />
        ) : (
          <Square size={12} strokeWidth={1.5} />
        )}
      </button>
      <button
        className="titlebar-button close"
        onClick={() => window.api.window.close()}
        aria-label="Cerrar"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Play, FolderOpen, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { RealmStatus } from "@/components/features/RealmStatus";
import { NewsList } from "@/components/features/NewsList";
import { brand } from "@shared/brand";
import type { LauncherConfig } from "@shared/types";

export function HomePage() {
  const [config, setConfig] = useState<LauncherConfig | null>(null);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.api.config.get().then(setConfig);
  }, []);

  async function pickGamePath() {
    const path = await window.api.game.pickGamePath();
    if (!path) return;
    const valid = await window.api.game.verifyGamePath(path);
    if (!valid) {
      setError("No se encontró Wow.exe en esa carpeta. Selecciona la carpeta raíz del juego.");
      return;
    }
    const next = await window.api.config.set({ gamePath: path });
    setConfig(next);
    setError(null);
  }

  async function launch() {
    if (!config?.gamePath) return;
    setLaunching(true);
    setError(null);
    const result = await window.api.game.launch({
      realmlist: brand.realmlist,
      gamePath: config.gamePath,
    });
    if (!result.ok) setError(result.error ?? "Error desconocido al lanzar el juego");
    setTimeout(() => setLaunching(false), 1500);
  }

  const hasGame = !!config?.gamePath;

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero con background animado */}
      <section className="relative px-10 pt-10 pb-8 overflow-hidden">
        <div className="hero-bg" />
        <div className="relative flex items-center gap-6 animate-fade-in-up">
          <Logo size={72} className="animate-logo-float" />
          <div>
            <p className="font-display uppercase tracking-[0.3em] text-xs text-[var(--color-accent-dim)]">
              {brand.tagline}
            </p>
            <h1 className="font-display text-5xl text-accent-gradient leading-none mt-2">
              {brand.fullName}
            </h1>
            <p className="text-sm text-[var(--color-text-dim)] mt-2">
              {brand.expansion}
            </p>
          </div>
        </div>
      </section>

      <div className="px-10 pb-8 grid grid-cols-[1fr_280px] gap-8">
        {/* Columna principal: PLAY + Noticias */}
        <div className="space-y-6">
          {/* Botón PLAY */}
          <div className="panel p-6 animate-fade-in-up stagger-2">
            {hasGame ? (
              <>
                <p className="text-xs uppercase tracking-widest text-[var(--color-accent-dim)] mb-2">
                  Cliente detectado
                </p>
                <p className="text-xs text-[var(--color-text-dim)] mb-4 truncate" title={config?.gamePath ?? ""}>
                  {config?.gamePath}
                </p>
                <button
                  onClick={launch}
                  disabled={launching}
                  className="btn-play w-full py-4 inline-flex items-center justify-center gap-3"
                >
                  <Play size={22} strokeWidth={2} fill="currentColor" />
                  {launching ? "Lanzando…" : "Jugar"}
                </button>
                <button
                  onClick={pickGamePath}
                  className="mt-3 text-xs text-[var(--color-text-dim)] hover:text-[var(--color-accent)] inline-flex items-center gap-1"
                >
                  <FolderOpen size={12} />
                  Cambiar carpeta del juego
                </button>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest text-[var(--color-accent-dim)] mb-2">
                  Primer paso
                </p>
                <h2 className="font-display text-xl text-[var(--color-text)] mb-2">
                  Localiza tu cliente WoW 3.3.5a
                </h2>
                <p className="text-xs text-[var(--color-text-dim)] mb-4">
                  Selecciona la carpeta donde tienes <code className="text-[var(--color-accent-bright)]">Wow.exe</code>.
                  El launcher configurará el realmlist automáticamente.
                </p>
                <button
                  onClick={pickGamePath}
                  className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2"
                >
                  <FolderOpen size={16} strokeWidth={1.5} />
                  Seleccionar carpeta
                </button>
              </>
            )}

            {error && (
              <div className="mt-4 p-3 border border-red-800/60 bg-red-950/40 rounded text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>

          {/* Noticias */}
          <div className="animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-sm uppercase tracking-widest text-[var(--color-accent)]">
                Últimas Noticias
              </h2>
              <button
                onClick={() => window.api.app.openExternal(`${brand.webUrl}/desarrollo/changelog`)}
                className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
              >
                Ver todo →
              </button>
            </div>
            <div className="divider-ornate mb-4" />
            <NewsList />
          </div>
        </div>

        {/* Sidebar derecho */}
        <aside className="space-y-4 animate-fade-in-up stagger-4">
          <RealmStatus />

          <div className="panel p-4">
            <h3 className="font-display uppercase tracking-wide text-xs text-[var(--color-accent)] mb-3">
              Acceso Rápido
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => window.api.app.openExternal(`${brand.webUrl}/registrarse`)}
                  className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] flex items-center gap-2"
                >
                  → Crear cuenta
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.api.app.openExternal(`${brand.webUrl}/reglas`)}
                  className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] flex items-center gap-2"
                >
                  → Reglas del servidor
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.api.app.openExternal(`${brand.webUrl}/donar`)}
                  className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] flex items-center gap-2"
                >
                  → Donar
                </button>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

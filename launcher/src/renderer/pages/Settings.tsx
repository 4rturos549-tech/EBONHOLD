import { useEffect, useState } from "react";
import { FolderOpen, RefreshCw, Download } from "lucide-react";
import type { LauncherConfig, UpdateInfo } from "@shared/types";

export function SettingsPage() {
  const [config, setConfig] = useState<LauncherConfig | null>(null);
  const [checking, setChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    window.api.config.get().then(setConfig);
  }, []);

  async function save(patch: Partial<LauncherConfig>) {
    const next = await window.api.config.set(patch);
    setConfig(next);
  }

  async function pickGame() {
    const path = await window.api.game.pickGamePath();
    if (path) await save({ gamePath: path });
  }

  async function checkUpdate() {
    setChecking(true);
    const info = await window.api.updater.check();
    setUpdateInfo(info);
    setChecking(false);
  }

  if (!config) return null;

  return (
    <div className="h-full overflow-y-auto px-10 py-8 max-w-3xl">
      <header className="mb-6 animate-fade-in-up">
        <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
          Configuración
        </p>
        <h1 className="font-display text-3xl text-accent-gradient mt-2">Ajustes</h1>
        <div className="divider-ornate mt-4" />
      </header>

      <div className="space-y-4">
        {/* Carpeta del juego */}
        <section className="panel p-6 animate-fade-in-up stagger-1">
          <h2 className="font-display text-sm uppercase tracking-wide text-[var(--color-accent)] mb-3">
            Cliente WoW
          </h2>
          <p className="text-xs text-[var(--color-text-dim)] mb-3">Carpeta donde está Wow.exe</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={config.gamePath ?? "(no configurado)"}
              readOnly
              className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)]"
            />
            <button onClick={pickGame} className="btn-primary px-4 py-2 inline-flex items-center gap-2">
              <FolderOpen size={14} />
              Cambiar
            </button>
          </div>
        </section>

        {/* Idioma cliente */}
        <section className="panel p-6 animate-fade-in-up stagger-2">
          <h2 className="font-display text-sm uppercase tracking-wide text-[var(--color-accent)] mb-3">
            Idioma del cliente
          </h2>
          <p className="text-xs text-[var(--color-text-dim)] mb-3">
            Define dónde se escribe realmlist.wtf
          </p>
          <div className="flex gap-2">
            {(["esES", "enUS"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => save({ language: lang })}
                className={`px-4 py-2 rounded text-xs font-display uppercase tracking-wider border transition-colors ${
                  config.language === lang
                    ? "border-[var(--color-accent)] text-[var(--color-accent-bright)] bg-[var(--color-bg-elevated)]"
                    : "border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-border-hover)]"
                }`}
              >
                {lang === "esES" ? "Español" : "English"}
              </button>
            ))}
          </div>
        </section>

        {/* Updater */}
        <section className="panel p-6 animate-fade-in-up stagger-3">
          <h2 className="font-display text-sm uppercase tracking-wide text-[var(--color-accent)] mb-3">
            Actualizaciones del launcher
          </h2>
          <p className="text-xs text-[var(--color-text-dim)] mb-3">
            El launcher se actualiza automáticamente. También puedes comprobar manualmente.
          </p>
          <button
            onClick={checkUpdate}
            disabled={checking}
            className="btn-primary px-4 py-2 inline-flex items-center gap-2"
          >
            <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
            {checking ? "Comprobando…" : "Buscar actualizaciones"}
          </button>

          {updateInfo && (
            <div className="mt-4 p-3 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] rounded text-xs">
              {updateInfo.available ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--color-secondary-bright)]">
                    Nueva versión disponible: v{updateInfo.version}
                  </span>
                  <button
                    onClick={() => window.api.updater.download()}
                    className="btn-primary px-3 py-1.5 inline-flex items-center gap-1.5"
                  >
                    <Download size={12} />
                    Descargar
                  </button>
                </div>
              ) : (
                <span className="text-[var(--color-text-dim)]">Estás en la última versión.</span>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

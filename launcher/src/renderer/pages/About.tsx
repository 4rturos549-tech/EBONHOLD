import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { brand } from "@shared/brand";

export function AboutPage() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.api.app.getVersion().then(setVersion);
  }, []);

  return (
    <div className="h-full overflow-y-auto px-10 py-12 flex flex-col items-center text-center">
      <Logo size={96} className="animate-logo-float mb-6" />
      <h1 className="font-display text-4xl text-accent-gradient">{brand.fullName}</h1>
      <p className="font-display uppercase tracking-[0.3em] text-xs text-[var(--color-accent-dim)] mt-2">
        {brand.tagline}
      </p>
      <div className="divider-ornate w-64 my-6" />

      <p className="text-sm text-[var(--color-text)] max-w-md">
        Launcher oficial de Ebonhold para {brand.expansion}.
      </p>
      <p className="text-xs text-[var(--color-text-dim)] mt-2">v{version}</p>

      <div className="mt-8 panel p-5 max-w-sm w-full">
        <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
          World of Warcraft© es marca registrada de Blizzard Entertainment, Inc.
          Este launcher es un proyecto sin ánimo de lucro hecho por la comunidad.
        </p>
      </div>

      <div className="mt-6 flex gap-3 text-xs">
        <button
          onClick={() => window.api.app.openExternal(brand.webUrl)}
          className="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)]"
        >
          Web oficial
        </button>
        <span className="text-[var(--color-border)]">·</span>
        <button
          onClick={() => window.api.app.openExternal(brand.discord)}
          className="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)]"
        >
          Discord
        </button>
        <span className="text-[var(--color-border)]">·</span>
        <button
          onClick={() =>
            window.api.app.openExternal("https://github.com/4rturos549-tech/EBONHOLD")
          }
          className="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)]"
        >
          GitHub
        </button>
      </div>
    </div>
  );
}

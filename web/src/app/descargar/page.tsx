import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { brand } from "@/config/brand";

export const metadata = { title: "Descargar" };

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Descargar"
        subtitle={`Cliente de ${brand.expansion} preconfigurado para conectar a ${brand.name}.`}
      />

      <Panel className="p-8 mb-6">
        <h2 className="font-display text-2xl uppercase tracking-wide text-[var(--color-accent)] mb-3">
          Launcher Oficial (recomendado)
        </h2>
        <p className="text-[var(--color-text-dim)] mb-6">
          Descarga el launcher: instala el cliente, gestiona parches y se
          actualiza solo. Disponible para Windows.
        </p>
        <div className="flex gap-3 flex-wrap">
          <span className="btn-primary px-6 py-3 font-display uppercase tracking-wider opacity-50 cursor-not-allowed">
            Windows · Próximamente
          </span>
          <span className="btn-primary px-6 py-3 font-display uppercase tracking-wider opacity-50 cursor-not-allowed">
            macOS · Próximamente
          </span>
        </div>
      </Panel>

      <Panel className="p-8">
        <h2 className="font-display text-2xl uppercase tracking-wide text-[var(--color-accent)] mb-3">
          Cliente manual
        </h2>
        <p className="text-[var(--color-text-dim)]">
          Si ya tienes un cliente WoW 3.3.5a limpio, sigue la guía en{" "}
          <a
            href="/comenzar"
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] underline"
          >
            Cómo Empezar
          </a>
          .
        </p>
      </Panel>
    </div>
  );
}

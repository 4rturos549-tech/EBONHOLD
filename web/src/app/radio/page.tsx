import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";

export const metadata = { title: "Radio" };

export default function RadioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Radio"
        subtitle="Música y voz de la comunidad. 24/7."
      />
      <Panel className="p-8 text-center">
        <div className="text-6xl mb-4">📻</div>
        <h2 className="font-display text-2xl uppercase tracking-wide text-[var(--color-accent)] mb-2">
          Próximamente
        </h2>
        <p className="text-[var(--color-text-dim)]">
          Conectaremos un stream de Icecast/Shoutcast en cuanto la radio esté operativa.
        </p>
      </Panel>
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";

export const metadata = { title: "Carta Abierta a Blizzard" };

export default function OpenLetterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Carta Abierta a Blizzard Entertainment"
        subtitle="Un mensaje de la comunidad."
      />
      <Panel className="p-8 prose-wow">
        <p className="text-[var(--color-text)] leading-relaxed">
          A los desarrolladores de Blizzard Entertainment,
        </p>
        <p className="text-[var(--color-text-dim)] leading-relaxed mt-4">
          World of Warcraft cambió la vida de millones de jugadores. Lo que en
          su día abrió las puertas a Azeroth, sigue siendo recordado con cariño
          por una comunidad enorme que no encuentra ya en el juego oficial la
          experiencia que la enamoró.
        </p>
        <p className="text-[var(--color-text-dim)] leading-relaxed mt-4">
          Este proyecto nace del amor a un mundo que ustedes crearon. No
          buscamos competir, sino preservar y expandir esa magia para las
          generaciones que llegan tarde a la fiesta.
        </p>
        <p className="text-[var(--color-text-dim)] leading-relaxed mt-4">
          Gracias por Azeroth.
        </p>
        <p className="text-[var(--color-accent)] mt-6 font-display uppercase tracking-wider">
          — La comunidad de Ebonhold
        </p>
      </Panel>
    </div>
  );
}

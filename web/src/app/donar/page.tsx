import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { brand } from "@/config/brand";

export const metadata = { title: "Donar" };

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Donar"
        subtitle={`${brand.name} es un proyecto sin ánimo de lucro. Las donaciones cubren costes de servidor, dominio y desarrollo.`}
      />

      <Panel className="p-8">
        <h2 className="font-display text-2xl uppercase tracking-wide text-[var(--color-accent)] mb-3">
          Sin pay-to-win
        </h2>
        <p className="text-[var(--color-text-dim)] mb-6">
          Las donaciones son <strong>voluntarias</strong> y nunca otorgan ventaja en
          el juego. Sólo recompensas cosméticas (transmog, monturas decorativas,
          mascotas) o sin impacto en el balance.
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-[var(--color-accent)] mb-3">
          A qué se destina
        </h2>
        <ul className="list-disc list-inside text-[var(--color-text-dim)] space-y-1 pl-2 mb-6">
          <li>Alquiler del servidor de juego (CPU/RAM/red)</li>
          <li>Dominios y certificados SSL</li>
          <li>Backups y almacenamiento (Cloudflare R2)</li>
          <li>Herramientas de desarrollo y diseño</li>
        </ul>

        <p className="text-[var(--color-text-dim)]">
          Plataformas de donación próximamente (Ko-fi, PayPal, Stripe).
        </p>
      </Panel>
    </div>
  );
}

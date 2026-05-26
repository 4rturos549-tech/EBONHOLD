import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";

export const metadata = { title: "Base de Datos" };

export default function DatabasePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        breadcrumb="Desarrollo"
        title="Base de Datos"
        subtitle="Buscador de items, NPCs, quests y spells del servidor."
      />
      <ComingSoon message="La base de datos pública se publicará cuando el servidor esté operativo." />
    </div>
  );
}

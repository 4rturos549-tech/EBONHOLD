import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";

export const metadata = { title: "Rastreador de Errores" };

export default function BugsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        breadcrumb="Desarrollo"
        title="Rastreador de Errores"
        subtitle="Reporta bugs o consulta el estado de los conocidos."
      />
      <ComingSoon message="Próximamente integraremos el tracker (probablemente issues de GitHub embebidos)." />
    </div>
  );
}

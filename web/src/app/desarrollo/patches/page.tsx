import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";

export const metadata = { title: "Content Patches" };

export default function PatchesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        breadcrumb="Desarrollo"
        title="Content Patches"
        subtitle="Listado de parches de contenido custom desplegados en el servidor."
      />
      <ComingSoon message="Los parches de contenido se documentarán aquí cuando se publique el primero." />
    </div>
  );
}

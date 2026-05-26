import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Personajes" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Personajes" subtitle="Razas, clases y opciones de personalización disponibles." />
      <ComingSoon />
    </div>
  );
}

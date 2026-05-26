import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Zonas" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Zonas" subtitle="Mapas y regiones explorables del Reino del Este, Kalimdor, Terrallende y Rasganorte." />
      <ComingSoon />
    </div>
  );
}

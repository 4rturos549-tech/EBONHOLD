import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Transporte" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Transporte" subtitle="Monturas, vuelos, barcos, portales y otros métodos de viaje." />
      <ComingSoon />
    </div>
  );
}

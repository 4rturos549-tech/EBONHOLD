import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Eventos" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Eventos" subtitle="Eventos del servidor: estacionales, semanales y especiales." />
      <ComingSoon />
    </div>
  );
}

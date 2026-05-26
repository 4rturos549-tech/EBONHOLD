import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Interfaz del Cliente" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Interfaz del Cliente" subtitle="Addons recomendados, configuración y mejoras de UI." />
      <ComingSoon />
    </div>
  );
}

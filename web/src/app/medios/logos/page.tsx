import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Logotipos" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Medios" title="Logotipos" subtitle="Recursos gráficos oficiales para streamers y creadores de contenido." />
      <ComingSoon />
    </div>
  );
}

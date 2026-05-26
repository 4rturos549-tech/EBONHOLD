import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Incursiones y Mazmorras" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Incursiones y Mazmorras" subtitle="Contenido PvE de grupo: 5-man, 10-man y 25-man." />
      <ComingSoon />
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Obras de Arte Oficiales" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Medios" title="Obras de Arte Oficiales" subtitle="Wallpapers, ilustraciones y arte conceptual del servidor." />
      <ComingSoon />
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Desafíos de Nivelación" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Desafíos de Nivelación" subtitle="Modos hardcore, ironman y otros desafíos opcionales." />
      <ComingSoon />
    </div>
  );
}

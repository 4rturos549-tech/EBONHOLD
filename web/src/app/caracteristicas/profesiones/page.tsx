import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Profesiones" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Características" title="Profesiones" subtitle="Las 11 profesiones primarias y secundarias de WoTLK." />
      <ComingSoon />
    </div>
  );
}

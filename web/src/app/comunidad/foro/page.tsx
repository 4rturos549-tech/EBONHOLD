import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";
export const metadata = { title: "Foro" };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader breadcrumb="Comunidad" title="Foro" subtitle="Discusión, soporte y comunidad." />
      <ComingSoon message="Próximamente integraremos un foro (Discourse o propio)." />
    </div>
  );
}

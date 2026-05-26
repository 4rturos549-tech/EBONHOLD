import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/features/coming-soon";

export const metadata = { title: "Calculadora de Talentos" };

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        breadcrumb="Clases"
        title="Calculadora de Talentos"
        subtitle="Diseña tus builds de talentos para WoTLK 3.3.5a y comparte URLs."
      />
      <ComingSoon message="Próximamente: calculadora interactiva con los árboles de talentos de las 9 clases." />
    </div>
  );
}

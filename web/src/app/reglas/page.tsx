import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";

export const metadata = { title: "Reglas" };

type Rule = { title: string; description: string };

const rules: Rule[] = [
  {
    title: "Respeto a la comunidad",
    description:
      "Insultos, discriminación, acoso o discurso de odio resultan en sanción inmediata.",
  },
  {
    title: "Sin cheats ni exploits",
    description:
      "Cualquier modificación del cliente, bots o abuso de bugs implica suspensión permanente.",
  },
  {
    title: "Sin compra-venta real",
    description:
      "Está prohibida la venta de cuentas, oro o items por dinero real. Reportar al staff.",
  },
  {
    title: "Nombres apropiados",
    description:
      "Los nombres de personajes y guilds deben ser coherentes con el universo Warcraft y no ofensivos.",
  },
  {
    title: "Idioma común",
    description:
      "En chats globales y soporte, español. En chats locales y privados, libre.",
  },
  {
    title: "El staff tiene la última palabra",
    description:
      "Las decisiones del equipo son finales. Las apelaciones se realizan vía ticket en Discord.",
  },
];

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Reglas del Servidor"
        subtitle="Para mantener una comunidad sana y divertida."
      />
      <div className="space-y-4">
        {rules.map((rule, i) => (
          <Panel key={i} className="p-6">
            <h2 className="font-display text-xl text-[var(--color-accent)] mb-2">
              {String(i + 1).padStart(2, "0")}. {rule.title}
            </h2>
            <p className="text-[var(--color-text-dim)]">{rule.description}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}

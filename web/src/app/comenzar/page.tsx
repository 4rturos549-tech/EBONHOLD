import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { brand } from "@/config/brand";

export const metadata = { title: "Cómo Empezar" };

const steps = [
  {
    n: 1,
    title: "Crea tu cuenta",
    body: "Regístrate desde la web. Es gratis y solo necesitas un email.",
  },
  {
    n: 2,
    title: "Descarga el cliente",
    body: "Usa el launcher oficial o descarga manualmente el cliente 3.3.5a.",
  },
  {
    n: 3,
    title: "Configura el realmlist",
    body: `Edita Data/esES/realmlist.wtf con: set realmlist ${brand.realmlist}`,
  },
  {
    n: 4,
    title: "Inicia sesión",
    body: "Abre Wow.exe, usa tu cuenta y elige el reino. ¡Bienvenido a Azeroth!",
  },
];

export default function StartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Cómo Empezar"
        subtitle="En cuatro pasos estarás dentro del juego."
      />
      <div className="space-y-4">
        {steps.map((step) => (
          <Panel key={step.n} className="p-6 flex gap-4 items-start">
            <div className="font-display text-4xl text-accent-gradient leading-none w-12 flex-shrink-0">
              {String(step.n).padStart(2, "0")}
            </div>
            <div>
              <h2 className="font-display text-xl text-[var(--color-accent)] mb-1">
                {step.title}
              </h2>
              <p className="text-[var(--color-text-dim)]">{step.body}</p>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

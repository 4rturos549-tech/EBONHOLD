import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";

export const metadata = { title: "Roadmap" };

type Phase = {
  version: string;
  title: string;
  status: "completado" | "en-progreso" | "planeado";
  items: string[];
};

const phases: Phase[] = [
  {
    version: "0.0.x",
    title: "Bootstrap del proyecto",
    status: "en-progreso",
    items: [
      "Estructura del monorepo",
      "Web base con Next.js",
      "Docker-compose de AzerothCore listo",
      "Bitácora de desarrollo en /desarrollo",
    ],
  },
  {
    version: "0.1.0",
    title: "Server jugable + web pública",
    status: "planeado",
    items: [
      "Server arrancado con cuenta GM funcional",
      "API /api/realms conectada a la BD",
      "Formulario de registro real (SRP6)",
      "Despliegue en Vercel + dominio",
    ],
  },
  {
    version: "0.2.0",
    title: "Launcher",
    status: "planeado",
    items: [
      "Launcher Electron con auto-update",
      "Descarga del cliente desde Cloudflare R2",
      "Verificación de integridad con SHA-256",
      "Noticias integradas",
    ],
  },
  {
    version: "0.3.0",
    title: "Primer contenido custom",
    status: "planeado",
    items: [
      "Módulo Eluna con NPCs custom",
      "Patch MPQ con items nuevos",
      "Primer evento del servidor",
      "Calculadora de talentos funcional",
    ],
  },
  {
    version: "1.0.0",
    title: "Apertura pública",
    status: "planeado",
    items: [
      "Servidor estable 24/7",
      "Foro funcional",
      "Sistema de tickets/soporte",
      "Donaciones activas (cosméticas)",
    ],
  },
];

const statusStyles: Record<Phase["status"], string> = {
  completado: "border-green-600 text-green-400",
  "en-progreso": "border-yellow-600 text-yellow-400",
  planeado: "border-[var(--color-border)] text-[var(--color-text-dim)]",
};

const statusLabel: Record<Phase["status"], string> = {
  completado: "Completado",
  "en-progreso": "En progreso",
  planeado: "Planeado",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        breadcrumb="Desarrollo"
        title="Roadmap"
        subtitle="Hacia dónde vamos. Las fases pueden cambiar según las prioridades de la comunidad."
      />

      <div className="space-y-4">
        {phases.map((phase) => (
          <Panel key={phase.version} className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
              <div>
                <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
                  Versión {phase.version}
                </p>
                <h2 className="font-display text-2xl text-[var(--color-accent)] mt-1">
                  {phase.title}
                </h2>
              </div>
              <span
                className={`px-3 py-1 text-xs uppercase tracking-wider border rounded ${statusStyles[phase.status]}`}
              >
                {statusLabel[phase.status]}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[var(--color-text-dim)] pl-2">
              {phase.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}

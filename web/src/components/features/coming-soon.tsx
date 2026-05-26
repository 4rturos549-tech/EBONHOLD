import { Panel } from "@/components/ui/panel";

export function ComingSoon({
  message = "Esta sección está en construcción. Vuelve pronto.",
}: {
  message?: string;
}) {
  return (
    <Panel className="p-10 text-center">
      <div className="text-5xl mb-4">⚒️</div>
      <h2 className="font-display text-2xl uppercase tracking-wide text-[var(--color-accent)] mb-2">
        Próximamente
      </h2>
      <p className="text-[var(--color-text-dim)] max-w-xl mx-auto">{message}</p>
    </Panel>
  );
}

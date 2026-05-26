import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";

export const metadata = { title: "Registrarse" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <PageHeader
        title="Crear cuenta"
        subtitle="Crea tu cuenta para empezar a jugar."
      />
      <Panel className="p-8">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-display uppercase tracking-wider text-[var(--color-accent-dim)] mb-1"
            >
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              minLength={3}
              maxLength={16}
              pattern="[a-zA-Z0-9_]+"
              disabled
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-display uppercase tracking-wider text-[var(--color-accent-dim)] mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-display uppercase tracking-wider text-[var(--color-accent-dim)] mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              disabled
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled
            className="btn-secondary w-full px-6 py-3 font-display uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear cuenta
          </button>
          <p className="text-xs text-[var(--color-text-dim)] text-center">
            El registro estará activo cuando el servidor esté operativo.
          </p>
        </form>
      </Panel>
    </div>
  );
}

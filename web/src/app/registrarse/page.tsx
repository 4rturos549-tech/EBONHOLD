import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { RegisterForm } from "@/components/features/register-form";

export const metadata = { title: "Registrarse" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <PageHeader
        title="Crear cuenta"
        subtitle="Crea tu cuenta para empezar a jugar."
      />
      <Panel className="p-8">
        <RegisterForm />
      </Panel>
      <p className="mt-4 text-xs text-[var(--color-text-dim)] text-center">
        Al crear una cuenta aceptas las{" "}
        <a href="/reglas" className="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] underline">
          reglas del servidor
        </a>
        .
      </p>
    </div>
  );
}

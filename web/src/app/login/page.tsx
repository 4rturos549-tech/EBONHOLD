import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { LoginForm } from "@/components/features/login-form";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <PageHeader
        title="Iniciar sesión"
        subtitle="Verifica tus credenciales de juego."
      />
      <Panel className="p-8">
        <LoginForm />
      </Panel>
      <p className="mt-4 text-center text-sm text-[var(--color-text-dim)]">
        ¿No tienes cuenta?{" "}
        <Link
          href="/registrarse"
          className="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] underline"
        >
          Crear una
        </Link>
      </p>
    </div>
  );
}

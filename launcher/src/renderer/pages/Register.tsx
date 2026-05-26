import { useState } from "react";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { brand } from "@shared/brand";

type Result = { ok: true; username: string } | { ok: false; error: string };

/**
 * Vista de registro del launcher.
 *
 * Hace fetch directo al endpoint publico de la web:
 *   https://ebonhold.vercel.app/api/auth/register
 *
 * La web a su vez proxya al bridge (con el BRIDGE_KEY que vive en Vercel).
 * Asi el launcher nunca tiene que conocer secretos.
 */
export function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    const password2 = String(form.get("password2") ?? "");
    const email = String(form.get("email") ?? "");

    if (password !== password2) {
      setResult({ ok: false, error: "Las contraseñas no coinciden" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${brand.webUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = (await res.json()) as Result;
      setResult(data);
      if (data.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setResult({ ok: false, error: "No se pudo conectar con el servidor" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto px-10 py-8 max-w-2xl">
      <header className="mb-6 animate-fade-in-up">
        <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
          Cuenta
        </p>
        <h1 className="font-display text-3xl text-accent-gradient mt-2">
          Crear cuenta
        </h1>
        <div className="divider-ornate mt-4" />
      </header>

      <div className="panel p-6 animate-fade-in-up stagger-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field name="username" label="Usuario" required minLength={3} maxLength={16} pattern="[a-zA-Z0-9_]+" placeholder="Mi_Usuario" />
          <Field name="email" type="email" label="Email (opcional)" placeholder="tu@email.com" />
          <Field name="password" type="password" label="Contraseña" required minLength={6} maxLength={64} placeholder="Mínimo 6 caracteres" />
          <Field name="password2" type="password" label="Confirmar contraseña" required minLength={6} />

          <button
            type="submit"
            disabled={submitting}
            className="btn-secondary w-full px-6 py-3 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creando…
              </>
            ) : (
              <>
                <UserPlus size={16} strokeWidth={1.5} />
                Crear cuenta
              </>
            )}
          </button>

          {result && (
            <div
              className={
                result.ok
                  ? "flex items-start gap-2 p-3 rounded border border-[var(--color-secondary-dim)] bg-[var(--color-secondary-dim)]/15 text-[var(--color-secondary-bright)] text-sm"
                  : "flex items-start gap-2 p-3 rounded border border-red-800/60 bg-red-950/30 text-red-300 text-sm"
              }
            >
              {result.ok ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <div>
                {result.ok ? (
                  <>
                    <strong>¡Cuenta creada!</strong> Usuario:{" "}
                    <code className="bg-black/30 px-1 rounded">{result.username}</code>.
                    Ya puedes usarla en el botón <strong>JUGAR</strong>.
                  </>
                ) : (
                  result.error
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-[var(--color-text-dim)] text-center pt-2">
            ¿Problemas con el registro? Visita{" "}
            <button
              type="button"
              onClick={() => window.api.app.openExternal(`${brand.webUrl}/registrarse`)}
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] underline"
            >
              la web
            </button>
            .
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  ...props
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-display uppercase tracking-wider text-[var(--color-accent-dim)] mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(110,200,240,0.15)] outline-none transition-all"
      />
    </div>
  );
}

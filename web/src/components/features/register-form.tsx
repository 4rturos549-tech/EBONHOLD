"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Result = { ok: true; username: string } | { ok: false; error: string };

export function RegisterForm() {
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
      const res = await fetch("/api/auth/register", {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        id="username"
        name="username"
        label="Usuario"
        placeholder="Mi_Usuario"
        required
        minLength={3}
        maxLength={16}
        pattern="[a-zA-Z0-9_]+"
      />
      <Field
        id="email"
        name="email"
        type="email"
        label="Email (opcional)"
        placeholder="tu@email.com"
      />
      <Field
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        required
        minLength={6}
        maxLength={64}
      />
      <Field
        id="password2"
        name="password2"
        type="password"
        label="Confirmar contraseña"
        required
        minLength={6}
      />

      <button
        type="submit"
        disabled={submitting}
        className="btn-secondary w-full px-6 py-3 font-display uppercase tracking-wider inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creando…
          </>
        ) : (
          "Crear cuenta"
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
                Ya puedes iniciar sesión en el cliente.
              </>
            ) : (
              result.error
            )}
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-display uppercase tracking-wider text-[var(--color-accent-dim)] mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="input-field"
      />
    </div>
  );
}

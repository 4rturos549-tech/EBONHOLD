"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, LogIn } from "lucide-react";

type Result =
  | { ok: true; username: string; accountId: number }
  | { ok: false; error: string };

export function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as Result;
      setResult(data);
    } catch {
      setResult({ ok: false, error: "No se pudo conectar con el servidor" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          required
          minLength={3}
          maxLength={16}
          className="input-field"
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
          minLength={6}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full px-6 py-3 font-display uppercase tracking-wider inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Verificando…
          </>
        ) : (
          <>
            <LogIn size={16} strokeWidth={1.5} />
            Iniciar sesión
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
                <strong>Bienvenido, {result.username}.</strong> Credenciales correctas.
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function OlvideContrasenaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cuenta/restablecer-contrasena`,
    });

    if (error) {
      setError("No pudimos enviar el email. Probá de nuevo.");
      setCargando(false);
      return;
    }

    setEnviado(true);
    setCargando(false);
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-sm px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-tinta">Revisá tu email</h1>
        <p className="mt-3 text-tinta/70">
          Si existe una cuenta con ese email, te enviamos un link para elegir
          una contraseña nueva.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="font-display text-3xl text-tinta">Recuperar contraseña</h1>
      <p className="mt-3 text-sm text-tinta/70">
        Ingresá tu email y te mandamos un link para elegir una contraseña
        nueva.
      </p>
      <form onSubmit={manejarSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-medium text-tinta">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-linea bg-crema-alta px-3 py-2 text-sm outline-none focus:border-oliva"
          />
        </label>

        {error && <p className="text-sm text-ciruela">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="mt-2 rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro disabled:opacity-60"
        >
          {cargando ? "Enviando…" : "Enviar link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-tinta/70">
        <Link
          href="/cuenta/login"
          className="text-ciruela underline underline-offset-4"
        >
          Volver a ingresar
        </Link>
      </p>
    </div>
  );
}

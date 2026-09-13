"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [revisarEmail, setRevisarEmail] = useState(false);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Ese email ya tiene una cuenta."
          : "No pudimos crear la cuenta. Probá de nuevo."
      );
      setCargando(false);
      return;
    }

    // Si Supabase pide confirmar el mail antes de dar sesión activa
    if (data.user && !data.session) {
      setRevisarEmail(true);
      setCargando(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  if (revisarEmail) {
    return (
      <div className="mx-auto max-w-sm px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-tinta">Revisá tu email</h1>
        <p className="mt-3 text-tinta/70">
          Te enviamos un link para confirmar tu cuenta antes de poder comprar.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="font-display text-3xl text-tinta">Creá tu cuenta</h1>
      <form onSubmit={manejarSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-medium text-tinta">
          Nombre
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-linea bg-crema-alta px-3 py-2 text-sm outline-none focus:border-oliva"
          />
        </label>
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
        <label className="text-sm font-medium text-tinta">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-linea bg-crema-alta px-3 py-2 text-sm outline-none focus:border-oliva"
          />
        </label>

        {error && <p className="text-sm text-ciruela">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="mt-2 rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro disabled:opacity-60"
        >
          {cargando ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-tinta/70">
        ¿Ya tenés cuenta?{" "}
        <Link
          href={`/cuenta/login?redirect=${encodeURIComponent(redirect)}`}
          className="text-ciruela underline underline-offset-4"
        >
          Ingresá acá
        </Link>
      </p>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  );
}

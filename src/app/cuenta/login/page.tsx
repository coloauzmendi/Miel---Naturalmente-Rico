"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos.");
      setCargando(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="font-display text-3xl text-tinta">Ingresá a tu cuenta</h1>
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
          {cargando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>

      <p className="mt-6 text-sm text-tinta/70">
        ¿No tenés cuenta?{" "}
        <Link
          href={`/cuenta/registro?redirect=${encodeURIComponent(redirect)}`}
          className="text-ciruela underline underline-offset-4"
        >
          Creá una acá
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

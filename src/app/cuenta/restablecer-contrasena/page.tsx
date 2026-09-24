"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RestablecerContrasenaPage() {
  const router = useRouter();
  const [listo, setListo] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  // El link del email deja a la persona logueada temporalmente para que
  // pueda elegir una contraseña nueva. Esperamos a que Supabase procese
  // ese link (evento PASSWORD_RECOVERY) antes de mostrar el formulario.
  useEffect(() => {
    const supabase = createClient();

    const { data: suscripcion } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "PASSWORD_RECOVERY") {
        setListo(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setListo(true);
    });

    return () => suscripcion.subscription.unsubscribe();
  }, []);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("No pudimos actualizar la contraseña. Probá de nuevo.");
      setCargando(false);
      return;
    }

    setExito(true);
    setCargando(false);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 2000);
  }

  if (exito) {
    return (
      <div className="mx-auto max-w-sm px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-tinta">
          ¡Contraseña actualizada!
        </h1>
        <p className="mt-3 text-tinta/70">Ya podés seguir comprando.</p>
      </div>
    );
  }

  if (!listo) {
    return (
      <div className="mx-auto max-w-sm px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-tinta">
          Abrí el link desde tu email
        </h1>
        <p className="mt-3 text-tinta/70">
          Si llegaste a esta página sin tocar el link del email, o el link ya
          venció, pedí uno nuevo.
        </p>
        <Link
          href="/cuenta/olvide-contrasena"
          className="mt-6 inline-block rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        >
          Pedir un link nuevo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="font-display text-3xl text-tinta">
        Elegí tu contraseña nueva
      </h1>
      <form onSubmit={manejarSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-medium text-tinta">
          Contraseña nueva
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
          {cargando ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
}

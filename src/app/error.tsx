"use client";

import { useEffect } from "react";
import Link from "next/link";

// Se muestra si algo falla al cargar una página (por ejemplo, la base no
// responde). "Probar de nuevo" vuelve a cargar solo esa parte.
export default function ErrorPagina({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Queda en la consola y en los logs de Vercel.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-display text-2xl text-tinta">Algo salió mal</h1>
      <p className="mt-3 text-tinta/70">
        Tuvimos un problema al cargar esta página. Probá de nuevo en unos
        segundos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        >
          Probar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-full border border-oliva px-6 py-3 text-sm font-medium text-oliva hover:bg-oliva hover:text-crema-alta"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

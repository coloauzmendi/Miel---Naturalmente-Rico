import Link from "next/link";

// Se muestra cuando la dirección no existe o el producto ya no está.
export default function NoEncontrada() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="font-display text-6xl text-marron">404</p>
      <h1 className="mt-4 font-display text-2xl text-tinta">
        No encontramos esta página
      </h1>
      <p className="mt-3 text-tinta/70">
        Puede que el link esté mal escrito o que el producto ya no esté
        disponible.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/productos"
          className="rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        >
          Ver productos
        </Link>
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

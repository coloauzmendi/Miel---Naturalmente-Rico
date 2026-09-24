import Link from "next/link";
import CerrarSesionBoton from "@/components/CerrarSesionBoton";

const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigurado) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-tinta">
          Todavía falta conectar Supabase
        </h1>
        <p className="mt-3 text-tinta/70">
          El panel de administración necesita la base de datos configurada.
          Completá las variables <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en tu archivo{" "}
          <code>.env.local</code> (ver README) y volvé a intentar.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:flex-row md:gap-8 md:py-10">
      <aside className="w-full md:w-48 md:shrink-0">
        <p className="mb-3 font-display text-xl text-tinta md:mb-4">Panel</p>
        {/* En el celular es una fila de pestañas que se puede deslizar; en
            computadora es la lista vertical de siempre. */}
        <nav className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 text-sm text-tinta/70 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0">
          <Link
            href="/admin"
            className="shrink-0 rounded-full border border-linea px-4 py-2 hover:bg-crema-alta hover:text-tinta md:rounded-lg md:border-0 md:px-3 md:py-2"
          >
            Resumen
          </Link>
          <Link
            href="/admin/productos"
            className="shrink-0 rounded-full border border-linea px-4 py-2 hover:bg-crema-alta hover:text-tinta md:rounded-lg md:border-0 md:px-3 md:py-2"
          >
            Productos
          </Link>
          <Link
            href="/admin/pedidos"
            className="shrink-0 rounded-full border border-linea px-4 py-2 hover:bg-crema-alta hover:text-tinta md:rounded-lg md:border-0 md:px-3 md:py-2"
          >
            Pedidos
          </Link>
        </nav>
        <div className="mt-4 md:mt-6 md:px-3">
          <CerrarSesionBoton />
        </div>
      </aside>
      {/* min-w-0 es lo que deja que el contenido se achique en vez de
          empujar la página entera hacia afuera de la pantalla. */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

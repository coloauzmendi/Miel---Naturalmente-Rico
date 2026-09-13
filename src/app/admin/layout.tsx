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
    <div className="mx-auto flex max-w-6xl gap-8 px-5 py-10">
      <aside className="w-48 shrink-0">
        <p className="mb-4 font-display text-xl text-tinta">Panel</p>
        <nav className="flex flex-col gap-1 text-sm text-tinta/70">
          <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-crema-alta hover:text-tinta">
            Resumen
          </Link>
          <Link
            href="/admin/productos"
            className="rounded-lg px-3 py-2 hover:bg-crema-alta hover:text-tinta"
          >
            Productos
          </Link>
          <Link
            href="/admin/pedidos"
            className="rounded-lg px-3 py-2 hover:bg-crema-alta hover:text-tinta"
          >
            Pedidos
          </Link>
        </nav>
        <div className="mt-6 px-3">
          <CerrarSesionBoton />
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}

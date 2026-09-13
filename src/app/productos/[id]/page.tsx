import { notFound } from "next/navigation";
import { obtenerProductoPorId } from "@/lib/productos";
import { formatearPrecio } from "@/lib/formato";
import BotonAgregar from "@/components/BotonAgregar";

export default async function ProductoDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producto = await obtenerProductoPorId(id);

  if (!producto) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-linea bg-crema-alta">
          {producto.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-oliva/40">
              <span className="font-display text-2xl">Miel</span>
            </div>
          )}
        </div>

        <div>
          <span className="inline-block rounded-full bg-crema-alta px-3 py-1 text-xs text-oliva">
            {producto.categoria === "congelados" ? "Congelado" : "Cocido, para hoy"}
          </span>
          <h1 className="mt-3 font-display text-3xl text-tinta">{producto.nombre}</h1>
          <p className="mt-2 font-display text-2xl text-ciruela">
            {formatearPrecio(producto.precio)}
          </p>
          <p className="mt-5 text-tinta/70">{producto.descripcion}</p>

          <div className="mt-8">
            <BotonAgregar producto={producto} />
          </div>

          <p className="mt-4 text-sm text-tinta/50">
            {producto.stock > 0
              ? `${producto.stock} unidades disponibles`
              : "Sin stock por el momento"}
          </p>
        </div>
      </div>
    </div>
  );
}

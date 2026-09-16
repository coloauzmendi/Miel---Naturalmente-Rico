"use client";

import Link from "next/link";
import { useState } from "react";
import { Producto } from "@/types";
import { formatearPrecio } from "@/lib/formato";
import { useCarrito } from "@/components/CarritoContext";
import { Plus, Snowflake, Flame } from "lucide-react";

export default function ProductoCard({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);
  const sinStock = producto.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-linea bg-crema-alta transition-shadow hover:shadow-[0_8px_24px_-8px_rgba(43,36,32,0.25)]">
      <Link
        href={`/productos/${producto.id}`}
        className="block aspect-[4/3] overflow-hidden bg-linea/60"
      >
        {producto.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-oliva/40">
            <span className="font-display text-lg">Miel</span>
          </div>
        )}
      </Link>

      {producto.stock > 0 && producto.stock <= 5 && (
        <span className="absolute mt-3 ml-3 w-fit rounded-full bg-boton px-2.5 py-1 text-xs font-medium text-tinta">
          Últimas unidades
        </span>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-crema px-2.5 py-1 text-xs text-oliva">
          {producto.categoria === "congelados" ? (
            <Snowflake size={12} />
          ) : (
            <Flame size={12} />
          )}
          {producto.categoria === "congelados"
            ? "Congelado"
            : "Cocido, para hoy"}
        </span>

        <Link href={`/productos/${producto.id}`}>
          <h3 className="font-display text-lg leading-snug text-tinta">
            {producto.nombre}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-tinta/70">
          {producto.descripcion}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg text-ciruela">
            {formatearPrecio(producto.precio)}
          </span>
          <button
            onClick={() => {
              agregar(producto, 1);
              setAgregado(true);
              window.setTimeout(() => setAgregado(false), 1600);
            }}
            disabled={sinStock}
            className="flex items-center gap-1 rounded-full bg-oliva px-3 py-2 text-sm text-crema-alta transition-colors hover:bg-oliva-claro disabled:cursor-not-allowed disabled:bg-linea disabled:text-tinta/50"
          >
            <Plus size={16} />
            {sinStock ? "Sin stock" : agregado ? "Agregado" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

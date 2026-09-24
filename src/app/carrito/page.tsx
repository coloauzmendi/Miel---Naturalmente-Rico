"use client";

import Link from "next/link";
import { useCarrito } from "@/components/CarritoContext";
import { formatearPrecio } from "@/lib/formato";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CarritoPage() {
  const { items, actualizarCantidad, quitar, total } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl text-tinta">
          Tu carrito está vacío
        </h1>
        <p className="mt-3 text-tinta/70">
          Todavía no agregaste ningún producto.
        </p>
        <Link
          href="/#productos"
          className="mt-6 inline-block rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl text-tinta">Tu carrito</h1>

      <div className="mt-8 divide-y divide-linea border-y border-linea">
        {items.map(({ producto, cantidad, sabor }) => (
          <div
            key={`${producto.id}::${sabor ?? ""}`}
            className="flex flex-wrap items-center gap-3 py-5 sm:flex-nowrap sm:gap-4"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-linea bg-crema-alta">
              {producto.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-oliva/30">
                  <span className="font-display text-xs">Miel</span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/productos/${producto.id}`}
                className="font-medium text-tinta"
              >
                {producto.nombre}
              </Link>
              {sabor && (
                <p className="text-xs text-tinta/50">Sabor: {sabor}</p>
              )}
              <p className="text-sm text-tinta/60">
                {formatearPrecio(producto.precio)} c/u
              </p>
            </div>

            <div className="ml-[5.5rem] flex items-center gap-3 rounded-full border border-linea px-2.5 py-1.5 sm:ml-0">
              <button
                onClick={() => actualizarCantidad(producto.id, cantidad - 1, sabor)}
                aria-label="Restar"
                className="text-tinta/70 hover:text-tinta"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-sm">{cantidad}</span>
              <button
                onClick={() => actualizarCantidad(producto.id, cantidad + 1, sabor)}
                aria-label="Sumar"
                className="text-tinta/70 hover:text-tinta"
              >
                <Plus size={14} />
              </button>
            </div>

            <p className="ml-auto w-auto text-right font-medium text-tinta sm:w-24">
              {formatearPrecio(producto.precio * cantidad)}
            </p>

            <button
              onClick={() => quitar(producto.id, sabor)}
              aria-label="Quitar producto"
              className="text-tinta/40 hover:text-ciruela"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-2">
        <p className="text-tinta/70">
          Total:{" "}
          <span className="font-display text-2xl text-ciruela">
            {formatearPrecio(total)}
          </span>
        </p>
        <Link
          href="/checkout"
          className="mt-2 rounded-full bg-boton px-8 py-3 text-sm font-medium text-tinta hover:bg-boton-oscuro"
        >
          Continuar con la compra
        </Link>
      </div>
    </div>
  );
}

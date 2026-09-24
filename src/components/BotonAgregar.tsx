"use client";

import { useState } from "react";
import { Producto } from "@/types";
import { useCarrito } from "@/components/CarritoContext";
import { formatearPrecio } from "@/lib/formato";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function BotonAgregar({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const sabores = producto.sabores ?? [];
  const [nombreSabor, setNombreSabor] = useState("");
  const saborElegido = sabores.find((s) => s.nombre === nombreSabor) ?? null;

  if (producto.stock <= 0) {
    return (
      <button
        disabled
        className="rounded-full bg-linea px-6 py-3 text-sm text-tinta/50"
      >
        Sin stock
      </button>
    );
  }

  const faltaElegirSabor = sabores.length > 0 && !saborElegido;

  return (
    <div className="flex flex-col gap-4">
      {sabores.length > 0 && (
        <label className="block text-sm font-medium text-tinta">
          Elegí el sabor
          <select
            value={nombreSabor}
            onChange={(e) => setNombreSabor(e.target.value)}
            className="mt-1 block w-full max-w-xs rounded-lg border border-linea bg-crema-alta px-3 py-2 text-sm text-tinta outline-none focus:border-oliva"
          >
            <option value="" disabled>
              Seleccioná una opción
            </option>
            {sabores.map((opcion) => (
              <option key={opcion.nombre} value={opcion.nombre}>
                {opcion.nombre} — {formatearPrecio(opcion.precio)}
              </option>
            ))}
          </select>
          {saborElegido && (
            <span className="mt-1 block font-display text-lg text-ciruela">
              {formatearPrecio(saborElegido.precio)}
            </span>
          )}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-linea px-3 py-2">
          <button
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            aria-label="Restar"
            className="text-tinta/70 hover:text-tinta"
          >
            <Minus size={16} />
          </button>
          <span className="w-4 text-center">{cantidad}</span>
          <button
            onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
            aria-label="Sumar"
            className="text-tinta/70 hover:text-tinta"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => {
            // Si el sabor elegido tiene su propio precio, ese es el precio
            // que queda guardado en esta línea del carrito.
            const productoAAgregar = saborElegido
              ? { ...producto, precio: saborElegido.precio }
              : producto;
            agregar(productoAAgregar, cantidad, saborElegido?.nombre ?? null);
            setAgregado(true);
            setTimeout(() => setAgregado(false), 1800);
          }}
          disabled={faltaElegirSabor}
          className="rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta transition-colors hover:bg-oliva-claro disabled:cursor-not-allowed disabled:bg-linea disabled:text-tinta/50"
        >
          {agregado ? "Agregado ✓" : "Agregar al carrito"}
        </button>

        {agregado && (
          <Link href="/carrito" className="text-sm text-ciruela underline underline-offset-4">
            Ver carrito
          </Link>
        )}
      </div>
    </div>
  );
}

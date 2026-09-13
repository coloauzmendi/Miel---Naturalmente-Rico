"use client";

import { useState } from "react";
import { Producto } from "@/types";
import { useCarrito } from "@/components/CarritoContext";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function BotonAgregar({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

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

  return (
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
          agregar(producto, cantidad);
          setAgregado(true);
          setTimeout(() => setAgregado(false), 1800);
        }}
        className="rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta transition-colors hover:bg-oliva-claro"
      >
        {agregado ? "Agregado ✓" : "Agregar al carrito"}
      </button>

      {agregado && (
        <Link href="/carrito" className="text-sm text-ciruela underline underline-offset-4">
          Ver carrito
        </Link>
      )}
    </div>
  );
}

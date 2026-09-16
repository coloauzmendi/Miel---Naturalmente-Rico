"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { useCarrito } from "@/components/CarritoContext";
import { formatearPrecio } from "@/lib/formato";

export default function CarritoFlotante() {
  const { cantidadTotal, total } = useCarrito();

  if (cantidadTotal === 0) return null;

  return (
    <Link
      href="/carrito"
      className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-2xl bg-marron px-4 py-3 text-crema-alta shadow-[0_12px_30px_-12px_rgba(43,36,32,0.65)] transition-transform hover:-translate-y-1 sm:left-auto sm:right-6 sm:w-72"
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        <ShoppingBasket size={19} />
        {cantidadTotal} {cantidadTotal === 1 ? "producto" : "productos"}
      </span>
      <span className="font-display text-lg">{formatearPrecio(total)}</span>
    </Link>
  );
}

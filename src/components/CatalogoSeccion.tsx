"use client";

import { useMemo, useState } from "react";
import { Producto, Categoria } from "@/types";
import ProductoCard from "@/components/ProductoCard";

const FILTROS: { valor: Categoria | "todos"; etiqueta: string }[] = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "cocidos", etiqueta: "Cocidos" },
  { valor: "congelados", etiqueta: "Congelados" },
];

export default function CatalogoSeccion({ productos }: { productos: Producto[] }) {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");

  const visibles = useMemo(
    () => (filtro === "todos" ? productos : productos.filter((p) => p.categoria === filtro)),
    [productos, filtro]
  );

  return (
    <section id="productos" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl text-tinta">Nuestros productos</h2>
          <p className="mt-1 text-tinta/70">
            Cocinado esta semana, sin conservantes ni aditivos.
          </p>
        </div>

        <div className="flex gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filtro === f.valor
                  ? "border-oliva bg-oliva text-crema-alta"
                  : "border-linea text-tinta/70 hover:border-oliva"
              }`}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-linea bg-crema-alta p-10 text-center text-tinta/60">
          Por ahora no hay productos en esta categoría. Volvé a pasar pronto.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </section>
  );
}

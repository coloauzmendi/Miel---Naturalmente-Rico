"use client";

import { useMemo, useState } from "react";
import { Producto } from "@/types";
import ProductoCard from "@/components/ProductoCard";
import { Search } from "lucide-react";

type Filtro = "todos" | "almuerzos-cenas" | "desayunos-meriendas";

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  {
    valor: "todos",
    etiqueta: "Todos",
  },
  {
    valor: "almuerzos-cenas",
    etiqueta: "Almuerzos y cenas",
  },
  {
    valor: "desayunos-meriendas",
    etiqueta: "Desayunos y meriendas",
  },
];

export default function CatalogoSeccion({
  productos,
  mostrarTitulo = true,
}: {
  productos: Producto[];
  mostrarTitulo?: boolean;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    const filtrados = productos.filter((producto) => {
      const coincideCategoria =
        filtro === "todos" || producto.categoria === filtro;

      const coincideTexto =
        !texto ||
        `${producto.nombre} ${producto.descripcion ?? ""}`
          .toLowerCase()
          .includes(texto);

      return coincideCategoria && coincideTexto;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "precio-asc") {
        return a.precio - b.precio;
      }

      if (orden === "precio-desc") {
        return b.precio - a.precio;
      }

      return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    });
  }, [productos, filtro, busqueda, orden]);

  return (
    <section id="productos" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 flex flex-col gap-5">
        {mostrarTitulo && (
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
              Catálogo
            </p>

            <h2 className="mt-2 font-display text-3xl text-tinta">
              Nuestros productos
            </h2>

            <p className="mt-1 text-tinta/70">
              Elegí tus favoritos y armá tu pedido.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block flex-1 lg:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta/45"
              size={18}
            />

            <span className="sr-only">Buscar productos</span>

            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o ingrediente"
              className="h-11 w-full rounded-xl border border-linea bg-crema-alta pl-10 pr-3 text-sm text-tinta outline-none focus:border-marron"
            />
          </label>

          <label className="sr-only" htmlFor="orden-productos">
            Ordenar productos
          </label>

          <select
            id="orden-productos"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="h-11 rounded-xl border border-linea bg-crema-alta px-3 text-sm text-tinta outline-none focus:border-marron"
          >
            <option value="recientes">Más recientes</option>

            <option value="precio-asc">Precio: menor a mayor</option>

            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              onClick={() => setFiltro(f.valor)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
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
          No encontramos productos con esos filtros. Probá con otra búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Producto } from "@/types";
import { formatearPrecio } from "@/lib/formato";
import { useCarrito } from "@/components/CarritoContext";
import { etiquetaCategoria } from "@/lib/categorias";
import { Plus, Sun, Moon } from "lucide-react";

const DURACION_ROTACION = 3000;

export default function ProductoCard({ producto }: { producto: Producto }) {
  const router = useRouter();
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);
  const [avisoSabor, setAvisoSabor] = useState(false);
  const sinStock = producto.stock <= 0;
  const tieneSabores = (producto.sabores?.length ?? 0) > 0;

  const imagenes =
    producto.imagenes ?? (producto.imagen_url ? [producto.imagen_url] : []);
  const [indiceFoto, setIndiceFoto] = useState(0);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const temporizador = window.setInterval(() => {
      setIndiceFoto((i) => (i + 1) % imagenes.length);
    }, DURACION_ROTACION);
    return () => window.clearInterval(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo depende de cuántas fotos hay, no de su contenido
  }, [imagenes.length]);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-linea bg-crema-alta transition-shadow hover:shadow-[0_8px_24px_-8px_rgba(43,36,32,0.25)]">
      <Link
        href={`/productos/${producto.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-linea/60"
      >
        {imagenes.length > 0 ? (
          imagenes.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={producto.nombre}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                i === indiceFoto ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
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
          {producto.categoria === "desayunos-meriendas" ? (
            <Sun size={12} />
          ) : (
            <Moon size={12} />
          )}
          {etiquetaCategoria(producto.categoria)}
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
          {sinStock ? (
            <button
              disabled
              className="flex items-center gap-1 rounded-full bg-linea px-3 py-2 text-sm text-tinta/50"
            >
              <Plus size={16} />
              Sin stock
            </button>
          ) : tieneSabores ? (
            <button
              onClick={() => {
                setAvisoSabor(true);
                window.setTimeout(() => router.push(`/productos/${producto.id}`), 900);
              }}
              className="flex items-center gap-1 rounded-full bg-oliva px-3 py-2 text-center text-sm text-crema-alta transition-colors hover:bg-oliva-claro"
            >
              <Plus size={16} />
              {avisoSabor ? "¡Entrá y elegí el sabor!" : "Elegir"}
            </button>
          ) : (
            <button
              onClick={() => {
                agregar(producto, 1);
                setAgregado(true);
                window.setTimeout(() => setAgregado(false), 1600);
              }}
              className="flex items-center gap-1 rounded-full bg-oliva px-3 py-2 text-sm text-crema-alta transition-colors hover:bg-oliva-claro"
            >
              <Plus size={16} />
              {agregado ? "Agregado" : "Agregar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

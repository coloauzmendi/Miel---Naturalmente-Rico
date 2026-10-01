import { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Categoria } from "@/types";
import { CATEGORIAS } from "@/lib/categorias";
import TarjetaCategoria from "@/components/TarjetaCategoria";
import fotoAlmuerzos from "@/img/dos-tartas.jpeg";
import fotoDesayunos from "@/img/pancakes-granola.jpeg";

const FOTOS: Record<Categoria, StaticImageData> = {
  "almuerzos-cenas": fotoAlmuerzos,
  "desayunos-meriendas": fotoDesayunos,
};

/**
 * Vista corta del catálogo para la página principal: las dos categorías,
 * bien grandes. El catálogo completo vive en /productos.
 */
export default function ProductosInicio() {
  return (
    <section
      id="productos"
      className="mx-auto max-w-6xl scroll-mt-[calc(var(--nav-h)_+_1rem)] px-5 py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
            Catálogo
          </p>
          <h2 className="mt-2 font-display text-3xl text-tinta">
            Nuestros productos
          </h2>
          <p className="mt-1 text-tinta/70">
            Elegí una categoría y armá tu pedido.
          </p>
        </div>
        <Link
          href="/productos"
          className="hidden items-center gap-1.5 text-sm font-medium text-marron underline-offset-4 hover:underline sm:flex"
        >
          Ver todos los productos <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {CATEGORIAS.map(({ valor, etiqueta }) => (
          <TarjetaCategoria
            key={valor}
            href={`/productos?categoria=${valor}`}
            etiqueta={etiqueta}
            foto={FOTOS[valor]}
          />
        ))}
      </div>
    </section>
  );
}

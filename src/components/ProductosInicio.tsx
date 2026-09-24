import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Categoria, Producto } from "@/types";
import { CATEGORIAS } from "@/lib/categorias";
import fotoAlmuerzos from "@/img/dos-tartas.jpeg";
import fotoDesayunos from "@/img/pancakes-granola.jpeg";

const DETALLE: Record<Categoria, { texto: string; foto: StaticImageData }> = {
  "almuerzos-cenas": {
    texto: "Tartas, pizzas, malfattis y más, listos en minutos.",
    foto: fotoAlmuerzos,
  },
  "desayunos-meriendas": {
    texto: "Pancakes, muffins, panes, granola y mermeladas.",
    foto: fotoDesayunos,
  },
};

/**
 * Vista corta del catálogo para la página principal: las dos categorías,
 * bien grandes y con efectos al pasar el mouse. El catálogo completo vive
 * en /productos.
 */
export default function ProductosInicio({
  productos,
}: {
  productos: Producto[];
}) {
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
        {CATEGORIAS.map(({ valor, etiqueta }) => {
          const cantidad = productos.filter(
            (p) => p.categoria === valor,
          ).length;
          const { texto, foto } = DETALLE[valor];

          return (
            <Link
              key={valor}
              href={`/productos?categoria=${valor}`}
              className="group relative flex aspect-[4/3] overflow-hidden rounded-3xl bg-marron/20 shadow-sm transition-shadow duration-300 hover:shadow-2xl sm:aspect-[5/4] lg:aspect-[16/11]"
            >
              <Image
                src={foto}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-60"
              />

              {/* Brillo que cruza la foto en diagonal al pasar el mouse */}
              <div className="pointer-events-none absolute -inset-y-10 -left-1/3 w-1/3 -skew-x-12 bg-crema-alta/25 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />

              <div className="absolute inset-0 bg-gradient-to-t from-tinta/85 via-tinta/30 to-transparent transition-colors duration-300 group-hover:from-tinta/95 group-hover:via-tinta/60" />

              {/* Borde dorado que aparece en hover */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-crema-alta/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-boton/80" />

              <div className="relative mt-auto flex w-full flex-col p-5 text-crema-alta sm:p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-crema-alta/80">
                  {cantidad} {cantidad === 1 ? "producto" : "productos"}
                </p>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl">
                  {etiqueta}
                </h3>
                <p className="mt-1 max-w-sm text-sm text-crema-alta/85">
                  {texto}
                </p>
                <span className="mt-4 inline-flex w-fit translate-y-3 items-center gap-1.5 rounded-full bg-boton px-4 py-2 text-sm font-medium text-tinta opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Ver productos <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

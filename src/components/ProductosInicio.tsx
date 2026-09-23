import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Categoria, Producto } from "@/types";
import { CATEGORIAS } from "@/lib/categorias";
import ProductoCard from "@/components/ProductoCard";
import fotoAlmuerzos from "@/img/carrusel-tartas.jpeg";
import fotoDesayunos from "@/img/carrusel-pancakes.jpeg";

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

const MAX_DESTACADOS = 3;

/**
 * Vista corta del catálogo para la página principal: las dos categorías y
 * unos pocos destacados. El catálogo completo vive en /productos.
 */
export default function ProductosInicio({
  productos,
}: {
  productos: Producto[];
}) {
  // Si todavía no marcaron ninguno como destacado, mostramos los más nuevos.
  const marcados = productos.filter((p) => p.destacado);
  const destacados = (marcados.length > 0 ? marcados : productos).slice(
    0,
    MAX_DESTACADOS,
  );

  return (
    <section id="productos" className="mx-auto max-w-6xl px-5 py-16">
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
        {CATEGORIAS.map(({ valor, etiqueta }) => {
          const cantidad = productos.filter((p) => p.categoria === valor).length;
          return (
            <Link
              key={valor}
              href={`/productos?categoria=${valor}`}
              className="group relative flex aspect-[4/3] overflow-hidden rounded-2xl bg-marron/20 sm:aspect-[5/4] lg:aspect-[16/11]"
            >
              <Image
                src={DETALLE[valor].foto}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 via-tinta/25 to-transparent" />
              <div className="relative mt-auto w-full p-5 text-crema-alta sm:p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-crema-alta/80">
                  {cantidad} {cantidad === 1 ? "producto" : "productos"}
                </p>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl">
                  {etiqueta}
                </h3>
                <p className="mt-1 max-w-sm text-sm text-crema-alta/85">
                  {DETALLE[valor].texto}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-boton px-4 py-2 text-sm font-medium text-tinta transition-colors group-hover:bg-boton-oscuro">
                  Ver productos <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {destacados.length > 0 && (
        <div className="mt-14">
          <h3 className="font-display text-2xl text-tinta">Destacados</h3>
          {/* En el celular se deslizan de costado para no alargar la página. */}
          <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {destacados.map((producto) => (
              <div
                key={producto.id}
                className="w-[78%] shrink-0 snap-start sm:w-auto"
              >
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 rounded-full border border-oliva px-6 py-3 text-sm font-medium text-oliva transition-colors hover:bg-oliva hover:text-crema-alta"
        >
          Ver todos los productos <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

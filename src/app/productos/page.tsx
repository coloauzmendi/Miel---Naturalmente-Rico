import { obtenerProductos } from "@/lib/productos";
import { esCategoria } from "@/lib/categorias";
import CatalogoSeccion from "@/components/CatalogoSeccion";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const [productos, { categoria }] = await Promise.all([
    obtenerProductos(),
    searchParams,
  ]);

  return (
    <main className="min-h-screen bg-crema-alta">
      <section className="mx-auto max-w-6xl px-5 pb-2 pt-12">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
          Catálogo completo
        </p>

        <h1 className="mt-2 font-display text-4xl text-tinta">
          Nuestros productos
        </h1>

        <p className="mt-3 max-w-2xl text-tinta/70">
          Opciones ricas y prácticas para tus almuerzos, cenas, desayunos y
          meriendas.
        </p>
      </section>

      <CatalogoSeccion
        key={categoria ?? "todos"}
        productos={productos}
        mostrarTitulo={false}
        filtroInicial={esCategoria(categoria) ? categoria : "todos"}
      />
    </main>
  );
}

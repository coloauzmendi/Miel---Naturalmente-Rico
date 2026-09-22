import { obtenerProductos } from "@/lib/productos";
import CatalogoSeccion from "@/components/CatalogoSeccion";

export default async function ProductosPage() {
  const productos = await obtenerProductos();

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

      <CatalogoSeccion productos={productos} mostrarTitulo={false} />
    </main>
  );
}

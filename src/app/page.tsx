import Link from "next/link";
import Image from "next/image";
import { obtenerProductos } from "@/lib/productos";
import CatalogoSeccion from "@/components/CatalogoSeccion";
import CarruselNosotras from "@/components/CarruselNosotras";
import { Leaf, Snowflake, ShieldCheck } from "lucide-react";
import logoMiel from "@/img/53944b0b-fe6c-4e3a-ae8d-300a6751904d.jpg";

export default async function Home() {
  const productos = await obtenerProductos();

  return (
    <>
      <section className="border-b border-linea bg-crema-alta">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="mb-4 text-sm text-dorado-oscuro">
              Alimentos cocidos y congelados
            </p>
            <h1 className="font-display text-4xl leading-[1.05] text-tinta md:text-5xl">
              Comida casera de verdad,
              <br />
              lista cuando la necesites.
            </h1>
            <p className="mt-5 max-w-md text-tinta/70">
              Sol y Abril cocinan cada semana con ingredientes de estación. Sin
              conservantes, sin aditivos: lo que le darías a tu familia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#productos"
                className="rounded-full bg-boton px-6 py-3 text-sm font-medium text-tinta transition-colors hover:bg-boton-oscuro"
              >
                Ver productos
              </a>
              <a
                href="https://wa.me/5493410000000"
                className="rounded-full border border-oliva px-6 py-3 text-sm font-medium text-oliva transition-colors hover:bg-oliva hover:text-crema-alta"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-2xl border border-linea bg-crema">
            <Image
              src={logoMiel}
              alt="Miel, naturalmente rico"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Leaf className="mt-1 shrink-0 text-oliva" size={22} />
            <div>
              <p className="font-medium text-tinta">Sin aditivos</p>
              <p className="text-sm text-tinta/70">
                Ingredientes simples, de estación.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Snowflake className="mt-1 shrink-0 text-oliva" size={22} />
            <div>
              <p className="font-medium text-tinta">Cocido o congelado</p>
              <p className="text-sm text-tinta/70">
                Vos elegís cómo lo querés recibir.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-oliva" size={22} />
            <div>
              <p className="font-medium text-tinta">Sin conservantes</p>
              <p className="text-sm text-tinta/70">
                Se conserva por frío, no por químicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CatalogoSeccion productos={productos} />

      <section id="nosotras" className="bg-oliva/5">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:items-center">
          <CarruselNosotras />
          <div>
            <h2 className="font-display text-3xl text-tinta">
              Sobre Sol y Abril
            </h2>
            <p className="mt-4 text-tinta/70">
              Empezamos cocinando para amigos y familia, y hoy Miel es nuestro
              trabajo de todos los días. Elegimos ingredientes de estación,
              cocinamos en tandas chicas y congelamos lo que se entrega en los
              días siguientes para que llegue tan fresco como salió de la olla.
            </p>
            <Link
              href="#contacto"
              className="mt-6 inline-block text-sm font-medium text-ciruela underline underline-offset-4"
            >
              Escribinos si tenés dudas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

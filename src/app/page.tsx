import Link from "next/link";
import { obtenerProductos } from "@/lib/productos";
import ProductosInicio from "@/components/ProductosInicio";
import CarruselNosotras from "@/components/CarruselNosotras";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";
import HeroFotos from "@/components/HeroFotos";
import ComoFunciona from "@/components/ComoFunciona";
import ComunidadMiel from "@/components/ComunidadMiel";
import { Leaf, Snowflake, ShieldCheck } from "lucide-react";

export default async function Home() {
  const productos = await obtenerProductos();

  return (
    <>
      <HeroFotos>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-crema-alta">
          Alimentos cocidos y congelados
        </p>
        <h1 className="font-display text-[clamp(1.75rem,6vw,3.5rem)] leading-[1.25] text-white">
          Comida{" "}
          <span className="relative inline-block">
            <em className="font-display italic text-dorado">
              casera de verdad
            </em>
            {/* Trazo a mano alzada, bien fino, como subrayado decorativo */}
            <svg
              className="pointer-events-none absolute -bottom-0.5 left-0 w-full text-marron"
              viewBox="0 0 200 8"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M3 5C45 1.5 130 1.5 197 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          ,
          <br />
          lista cuando la necesites.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-crema-alta/85
        ">
          Alimentos ricos y nutricionalmente altos para acompañar tus comidas.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#productos"
            className="rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta transition-colors hover:bg-oliva-claro"
          >
            Ver productos
          </a>
          <a
            href="https://wa.me/5493410000000"
            className="rounded-full border border-crema-alta/50 bg-crema-alta/10 px-6 py-3 text-sm font-medium text-crema-alta backdrop-blur-sm transition-colors hover:bg-crema-alta/20"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </HeroFotos>

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

      <ComoFunciona />

      <ProductosInicio productos={productos} />

      <ComunidadMiel />

      <section id="nosotras" className="scroll-mt-[var(--nav-h)] bg-oliva/5">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:items-center">
          <CarruselNosotras />
          <div>
            <h2 className="font-display text-3xl text-tinta">Sobre nosotras</h2>
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

      <section className="mx-auto max-w-3xl px-5 py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
              Antes de pedir
            </p>
            <h2 className="mt-2 font-display text-3xl text-tinta">
              Preguntas frecuentes
            </h2>
          </div>
          <a
            href="https://wa.me/5493413456530"
            className="hidden text-sm font-medium text-marron underline underline-offset-4 sm:block"
          >
            ¿Tenés otra duda?
          </a>
        </div>
        <PreguntasFrecuentes />
      </section>
    </>
  );
}

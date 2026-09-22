import Link from "next/link";
import { obtenerProductos } from "@/lib/productos";
import CatalogoSeccion from "@/components/CatalogoSeccion";
import CarruselNosotras from "@/components/CarruselNosotras";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";
import HeroFotos from "@/components/HeroFotos";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  House,
  Leaf,
  MapPin,
  Snowflake,
  ShieldCheck,
} from "lucide-react";

export default async function Home() {
  const productos = await obtenerProductos();

  return (
    <>
      <HeroFotos>
        <p className="mb-4 text-sm text-dorado-oscuro">
          Alimentos cocidos y congelados
        </p>
        <h1 className="font-display text-4xl leading-[1.05] text-tinta md:text-5xl">
          Comida casera de verdad,
          <br className="hidden sm:block" />
          lista cuando la necesites.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-tinta/70">
          Alimentos ricos y nutricionalmente altos para acompañar tus comidas.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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

      <section className="border-y border-linea bg-crema-alta">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
              Comprar es simple
            </p>
            <h2 className="mt-2 font-display text-3xl text-tinta">
              Cómo funciona
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Leaf,
                titulo: "Elegís",
                texto: "Explorá el catálogo y sumá tus favoritos al carrito.",
              },
              {
                icon: CheckCircle2,
                titulo: "Pagás",
                texto: "Completá tus datos y pagá de forma segura.",
              },
              {
                icon: House,
                titulo: "Recibís",
                texto: "Coordinamos la entrega.",
              },
            ].map(({ icon: Icono, titulo, texto }, indice) => (
              <div
                key={titulo}
                className="relative rounded-2xl border border-linea bg-crema p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marron text-crema-alta">
                    <Icono size={20} />
                  </span>
                  <div>
                    <p className="font-display text-xl text-tinta">{titulo}</p>
                    <p className="text-sm text-tinta/65">Paso {indice + 1}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-tinta/70">
                  {texto}
                </p>
                {indice < 2 && (
                  <ArrowRight
                    className="absolute -right-3 top-8 z-10 hidden text-marron md:block"
                    size={20}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-marron/10 p-4 text-sm text-tinta/75">
            <Clock3 className="mt-0.5 shrink-0 text-marron" size={18} />
            <p>
              Pedidos y entregas se coordinan por WhatsApp según disponibilidad.
            </p>
          </div>
        </div>
      </section>

      <CatalogoSeccion productos={productos} />

      <section className="border-y border-linea bg-crema-alta">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
              Entregas
            </p>
            <h2 className="mt-2 font-display text-3xl text-tinta">
              Comida rica, cerca de casa
            </h2>
            <p className="mt-4 max-w-xl text-tinta/70">
              Retirás o recibís tu pedido en Carcarañá y alrededores. Una vez
              confirmado, te escribimos para coordinar el día y el horario.
            </p>
          </div>
          <div className="rounded-2xl border border-linea bg-crema p-5">
            <div className="flex items-center gap-3">
              <MapPin className="text-marron" size={22} />
              <p className="font-medium text-tinta">Zonas de entrega</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-tinta/70">
              <li>Carcarañá</li>
              <li>Localidades cercanas, a coordinar por WhatsApp</li>
              <li>Retiro a convenir</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
            Comunidad Miel
          </p>
          <h2 className="mt-2 font-display text-3xl text-tinta">
            Tu experiencia también cuenta
          </h2>
          <p className="mt-3 text-tinta/70">
            Después de recibir tu pedido, contanos cómo te fue. Tus fotos y
            comentarios, siempre con tu permiso, ayudan a que otras personas nos
            conozcan.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            "¿Qué producto probaste?",
            "¿Qué fue lo que más te gustó?",
            "¿Nos autorizás a compartirlo?",
          ].map((texto, indice) => (
            <div
              key={texto}
              className="rounded-2xl border border-linea bg-crema-alta p-5"
            >
              <p className="font-display text-2xl text-marron">0{indice + 1}</p>
              <p className="mt-3 text-sm text-tinta/70">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="nosotras" className="bg-oliva/5">
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

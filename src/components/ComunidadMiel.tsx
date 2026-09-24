"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share2, UtensilsCrossed } from "lucide-react";

const preguntas = [
  {
    Icono: UtensilsCrossed,
    numero: "01",
    titulo: "¿Qué producto probaste?",
    texto: "Contanos cuál de nuestras recetas llegó a tu mesa.",
  },
  {
    Icono: Heart,
    numero: "02",
    titulo: "¿Qué fue lo que más te gustó?",
    texto: "El sabor, la textura, lo fácil que fue prepararlo... todo suma.",
  },
  {
    Icono: Share2,
    numero: "03",
    titulo: "¿Nos autorizás a compartirlo?",
    texto:
      "Con tu permiso, mostramos tu foto y tu comentario en nuestras redes.",
  },
];

export default function ComunidadMiel() {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Dispara las animaciones de entrada recién cuando la sección aparece en
  // pantalla, no apenas carga la página.
  useEffect(() => {
    const elemento = contenedorRef.current;
    if (!elemento) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observador.observe(elemento);

    // Red de seguridad: si en algún celular el detector nunca dispara,
    // mostramos igual el contenido en vez de dejarlo invisible para siempre.
    const resguardo = setTimeout(() => setVisible(true), 4000);

    return () => {
      observador.disconnect();
      clearTimeout(resguardo);
    };
  }, []);

  return (
    <section className="relative flex min-h-[calc(100dvh_-_var(--nav-h))] flex-col justify-center overflow-hidden border-y border-linea bg-crema-alta py-14">
      {/* Manchas de color de fondo, puramente decorativas */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-boton/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-oliva/15 blur-3xl" />

      <div ref={contenedorRef} className="relative mx-auto w-full max-w-6xl px-5">
        <div
          className={`max-w-xl transition-all duration-700 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
            Comunidad Miel
          </p>
          <h2 className="mt-2 font-display text-3xl text-tinta sm:text-4xl">
            Tu experiencia también cuenta
          </h2>
          <p className="mt-3 text-tinta/70">
            Después de recibir tu pedido, contanos cómo te fue. Tus fotos y
            comentarios, siempre con tu permiso, ayudan a que otras personas
            nos conozcan.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {preguntas.map(({ Icono, numero, titulo, texto }, indice) => (
            <div
              key={titulo}
              style={{
                transitionDelay: visible ? `${indice * 150}ms` : "0ms",
              }}
              className={`group relative overflow-hidden rounded-3xl border border-linea bg-crema p-6 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-10 scale-95 opacity-0"
              }`}
            >
              {/* Número gigante de fondo, apenas visible */}
              <span
                className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-8xl font-semibold text-marron/5 transition-colors duration-500 group-hover:text-marron/10"
                aria-hidden="true"
              >
                {numero}
              </span>

              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-marron text-crema-alta transition-transform duration-500 ease-out group-hover:rotate-6 group-hover:scale-110">
                <Icono size={22} />
              </span>

              <p className="relative mt-4 font-display text-xl text-tinta">
                {titulo}
              </p>
              <p className="relative mt-2 text-sm leading-relaxed text-tinta/70">
                {texto}
              </p>

              {/* Línea que se dibuja de izquierda a derecha en hover */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-boton transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </div>
          ))}
        </div>

        <div
          style={{ transitionDelay: visible ? "450ms" : "0ms" }}
          className={`mt-10 flex justify-center transition-all duration-700 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <a
            href="https://wa.me/5493413456530?text=Hola!%20Quiero%20contarles%20mi%20experiencia%20con%20Miel"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta transition-colors hover:bg-oliva-claro"
          >
            <MessageCircle size={18} /> Contanos tu experiencia
          </a>
        </div>
      </div>
    </section>
  );
}

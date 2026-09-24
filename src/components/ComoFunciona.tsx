"use client";

import { useEffect, useRef, useState } from "react";

const pasos = [
  {
    emoji: "🛒",
    titulo: "Explorá nuestros productos",
    texto:
      'Agregá al carrito todos los productos que quieras. Cuando termines, ingresá al carrito y hacé clic en "Continuar con la compra".',
  },
  {
    emoji: "💳",
    titulo: "Elegí método de pago",
    texto:
      "Podés pagar a través de Mercado Pago o abonar en efectivo cuando tengas tu pedido en mano. ¡No olvides enviarnos el comprobante de transferencia!",
  },
  {
    emoji: "📲",
    titulo: "Coordinamos la entrega",
    texto:
      "Una vez realizada la compra, vas a ver un botón que te redirige a nuestro chat de WhatsApp, donde coordinamos juntas la entrega de tu pedido.",
  },
  {
    emoji: "🍽️",
    titulo: "Disfrutá",
    texto: "Comer rico, saludable y rápido, ahora más fácil que nunca. ¡Buen provecho!",
  },
];

export default function ComoFunciona() {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Dispara la animación de entrada recién cuando la sección aparece en
  // pantalla (no apenas carga la página, que todavía no se ve).
  useEffect(() => {
    const elemento = contenedorRef.current;
    if (!elemento) return;

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
    return () => observador.disconnect();
  }, []);

  return (
    <section
      id="como-funciona"
      className="scroll-mt-[calc(var(--nav-h)_+_1rem)] border-y border-linea bg-crema-alta"
    >
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-dorado-oscuro">
            Comprar es simple
          </p>
          <h2 className="mt-2 font-display text-3xl text-tinta">
            Cómo funciona
          </h2>
        </div>

        {/* pt/pb extra para que las cards tengan lugar de crecer al hacer
            hover sin que la fila de arriba/abajo las recorte */}
        <div
          ref={contenedorRef}
          className="mt-8 grid gap-5 py-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pasos.map(({ emoji, titulo, texto }, indice) => (
            <div
              key={titulo}
              style={visible ? { animationDelay: `${indice * 1000}ms` } : undefined}
              className={`group relative flex flex-col rounded-2xl border border-linea bg-crema p-6 shadow-sm transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-110 hover:shadow-lg sm:aspect-[3/4] ${
                visible ? "animar-tarjeta" : "opacity-0"
              }`}
            >
              <span className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-marron font-display text-lg text-crema-alta shadow-sm">
                {indice + 1}
              </span>
              <span
                className="text-4xl transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              >
                {emoji}
              </span>
              <p className="mt-4 font-display text-xl text-tinta">{titulo}</p>
              <p className="mt-3 text-sm leading-relaxed text-tinta/70">
                {texto}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-tinta/70">
          Ante cualquier inquietud, no dudes en enviarnos un mensaje.
        </p>
      </div>
    </section>
  );
}

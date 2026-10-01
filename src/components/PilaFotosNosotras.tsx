"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Hand } from "lucide-react";
import foto1 from "@/img/1.jpeg";
import foto2 from "@/img/2.jpeg";
import foto3 from "@/img/3.jpeg";
import foto4 from "@/img/4.jpeg";
import foto5 from "@/img/5.jpeg";

const fotos: { src: StaticImageData; alt: string }[] = [
  { src: foto1, alt: "Sol y Abril" },
  { src: foto2, alt: "Sol y Abril" },
  { src: foto3, alt: "Sol y Abril" },
  { src: foto4, alt: "Sol y Abril" },
  { src: foto5, alt: "Sol y Abril" },
];

// Cada foto tiene su propia inclinación, como polaroids tiradas en una mesa.
const ROTACIONES = [-5, 4, -3, 6, -6];

const UMBRAL_DESLIZAR = 90; // px que hay que arrastrar para pasar de foto
const DURACION_SALIDA = 380; // ms
const INTERVALO_AUTO = 4500; // ms

/**
 * Pila de fotos tipo polaroid para "Sobre nosotras". La foto de arriba se
 * desliza con el dedo (o se arrastra con el mouse) y vuelve al fondo de la
 * pila. Si nadie la toca, pasa sola cada unos segundos.
 */
export default function PilaFotosNosotras() {
  // orden[0] es la foto que está arriba de la pila.
  const [orden, setOrden] = useState(() => fotos.map((_, i) => i));
  const [arrastre, setArrastre] = useState<{ dx: number; dy: number } | null>(
    null,
  );
  const [salida, setSalida] = useState<-1 | 1 | null>(null);
  const [usada, setUsada] = useState(false);

  const inicio = useRef<{ x: number; y: number; t: number } | null>(null);
  const pausaHasta = useRef(0);
  const marco = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  // Evita que el pase automático y uno manual se pisen.
  const saliendo = useRef(false);

  const pasar = useCallback((direccion: -1 | 1) => {
    if (saliendo.current) return;
    saliendo.current = true;
    setSalida(direccion);
    setArrastre(null);
    window.setTimeout(() => {
      setOrden((o) => [...o.slice(1), o[0]]);
      setSalida(null);
      saliendo.current = false;
    }, DURACION_SALIDA);
  }, []);

  function volver() {
    if (saliendo.current) return;
    setOrden((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  }

  function interaccion() {
    setUsada(true);
    pausaHasta.current = Date.now() + 5000;
  }

  // Pasa solo, pero únicamente si la pila está a la vista y nadie la tocó
  // hace poco.
  useEffect(() => {
    const el = marco.current;
    const observador =
      el && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entrada]) => (visible.current = entrada.isIntersecting),
            { threshold: 0.5 },
          )
        : null;
    if (el && observador) observador.observe(el);
    else visible.current = true;

    const intervalo = window.setInterval(() => {
      if (visible.current && Date.now() > pausaHasta.current) pasar(1);
    }, INTERVALO_AUTO);

    return () => {
      window.clearInterval(intervalo);
      observador?.disconnect();
    };
  }, [pasar]);

  function alApretar(e: React.PointerEvent<HTMLDivElement>) {
    if (saliendo.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    inicio.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    setArrastre({ dx: 0, dy: 0 });
    interaccion();
  }

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    if (!inicio.current) return;
    setArrastre({
      dx: e.clientX - inicio.current.x,
      dy: (e.clientY - inicio.current.y) * 0.4,
    });
  }

  function alSoltar() {
    if (!inicio.current || !arrastre) return;
    const { dx } = arrastre;
    const velocidad = Math.abs(dx) / Math.max(1, Date.now() - inicio.current.t);
    inicio.current = null;

    if (Math.abs(dx) > UMBRAL_DESLIZAR || (Math.abs(dx) > 30 && velocidad > 0.5)) {
      pasar(dx > 0 ? 1 : -1);
    } else if (Math.abs(dx) < 5) {
      // Un toque/clic sin arrastrar también pasa a la siguiente.
      pasar(1);
    } else {
      setArrastre(null);
    }
  }

  // El navegador cancela el gesto cuando la persona en realidad está
  // scrolleando la página: ahí la foto vuelve a su lugar sin pasar.
  function alCancelar() {
    inicio.current = null;
    setArrastre(null);
  }

  function alTeclado(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      interaccion();
      pasar(1);
    } else if (e.key === "ArrowLeft") {
      interaccion();
      volver();
    }
  }

  const actual = orden[0];

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={marco}
        role="group"
        aria-roledescription="carrusel"
        aria-label="Fotos de Sol y Abril"
        tabIndex={0}
        onKeyDown={alTeclado}
        className="relative aspect-[4/5] w-full max-w-[22rem] rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-boton sm:max-w-sm"
      >
        {orden.map((indiceFoto, profundidad) => {
          const foto = fotos[indiceFoto];
          const esArriba = profundidad === 0;
          const rotacion = ROTACIONES[indiceFoto % ROTACIONES.length];

          let transform: string;
          let transicion = `transform ${DURACION_SALIDA}ms cubic-bezier(.2,.8,.2,1), opacity 300ms`;

          if (esArriba && salida !== null) {
            transform = `translate(${salida * 140}%, -8%) rotate(${salida * 28}deg)`;
          } else if (esArriba && arrastre) {
            transform = `translate(${arrastre.dx}px, ${arrastre.dy}px) rotate(${rotacion * 0.3 + arrastre.dx / 14}deg)`;
            transicion = "none";
          } else if (esArriba) {
            transform = `rotate(${rotacion * 0.3}deg)`;
          } else {
            // Las de abajo se asoman un poco: más chicas, más abajo y giradas.
            const p = Math.min(profundidad, 3);
            transform = `translateY(${p * 10}px) scale(${1 - p * 0.05}) rotate(${rotacion}deg)`;
          }

          return (
            <div
              key={indiceFoto}
              onPointerDown={esArriba ? alApretar : undefined}
              onPointerMove={esArriba ? alMover : undefined}
              onPointerUp={esArriba ? alSoltar : undefined}
              onPointerCancel={esArriba ? alCancelar : undefined}
              aria-hidden={!esArriba}
              className={`absolute inset-x-[6%] top-[3%] select-none rounded-md bg-white p-3 pb-14 shadow-[0_18px_40px_-12px_rgba(43,36,32,0.45)] ${
                esArriba ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""
              }`}
              style={{
                zIndex: fotos.length - profundidad,
                transform,
                transition: transicion,
                opacity: profundidad > 3 ? 0 : 1,
              }}
            >
              {/* Cinta que "pega" la foto de arriba */}
              {esArriba && (
                <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-sm bg-boton/60 shadow-sm" />
              )}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-crema-alta">
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  draggable={false}
                  priority={indiceFoto === 0}
                  sizes="(min-width: 768px) 384px, 80vw"
                  className="pointer-events-none object-cover"
                />
              </div>
              <p className="absolute inset-x-0 bottom-4 text-center font-display text-lg italic text-tinta/75">
                Sol &amp; Abril
              </p>
            </div>
          );
        })}

        {/* Pista para el celular, hasta que la persona toque la pila */}
        <div
          className={`pointer-events-none absolute -bottom-2 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-tinta/80 px-3 py-1.5 text-xs text-crema-alta transition-opacity duration-500 md:hidden ${
            usada ? "opacity-0" : "opacity-100"
          }`}
        >
          <Hand size={14} className="animate-pulse" /> Deslizá las fotos
        </div>
      </div>

      <div className="flex gap-1.5" aria-hidden>
        {fotos.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === actual ? "w-5 bg-marron" : "w-1.5 bg-marron/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

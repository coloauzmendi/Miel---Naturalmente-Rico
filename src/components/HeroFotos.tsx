"use client";

import Image, { StaticImageData } from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import tartas from "@/img/carrusel-tartas.jpeg";
import pizza from "@/img/carrusel-pizzas.jpeg";
import malfattis from "@/img/carrusel-malfattis.jpeg";
import pancakes from "@/img/carrusel-pancakes.jpeg";
import muffins from "@/img/carrusel-muffins.jpeg";
import panes from "@/img/carrusel-panes.jpeg";
import mermeladas from "@/img/carrusel-mermeladas.jpeg";
import waffles from "@/img/carrusel-waffles.jpeg";

type Foto = {
  imagen: StaticImageData;
  alt: string;
};

const fotos: Foto[] = [
  { imagen: pancakes, alt: "Pancakes caseros de Miel" },
  { imagen: tartas, alt: "Tartas integrales individuales" },
  { imagen: pizza, alt: "Pizza de masa integral" },
  { imagen: malfattis, alt: "Malfattis de ricota y acelga" },
  { imagen: muffins, alt: "Muffins de carrot y cítricos" },
  { imagen: panes, alt: "Pan integral" },
  { imagen: mermeladas, alt: "Mermelada de estación" },
  { imagen: waffles, alt: "Waffles belgas" },
];

const DURACION = 5000;

export default function HeroFotos({ children }: { children: ReactNode }) {
  const [indice, setIndice] = useState(0);
  const inicioToque = useRef<number | null>(null);

  // Se reinicia en cada cambio para que, al tocar una flecha, la próxima
  // foto espere el tiempo completo.
  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      setIndice((actual) => (actual + 1) % fotos.length);
    }, DURACION);
    return () => window.clearTimeout(temporizador);
  }, [indice]);

  const anterior = () =>
    setIndice((actual) => (actual - 1 + fotos.length) % fotos.length);
  const siguiente = () => setIndice((actual) => (actual + 1) % fotos.length);

  function cambiarPorGestos(evento: React.TouchEvent<HTMLDivElement>) {
    if (inicioToque.current === null) return;
    const distancia = inicioToque.current - evento.changedTouches[0].clientX;
    inicioToque.current = null;
    if (Math.abs(distancia) < 35) return;
    if (distancia > 0) siguiente();
    else anterior();
  }

  return (
    <section
      className="relative border-b border-linea bg-crema-alta"
      aria-label="Productos de Miel"
    >
      <div
        className="relative h-[24rem] overflow-hidden sm:h-[30rem] md:absolute md:inset-0 md:h-auto"
        onTouchStart={(evento) => {
          inicioToque.current = evento.touches[0].clientX;
        }}
        onTouchEnd={cambiarPorGestos}
      >
        {fotos.map((foto, fotoIndice) => (
          <Image
            key={foto.imagen.src}
            src={foto.imagen}
            alt={foto.alt}
            fill
            preload={fotoIndice === 0}
            sizes="100vw"
            aria-hidden={fotoIndice !== indice}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              fotoIndice === indice ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* En escritorio el texto va sobre la foto: este degradé lo hace legible. */}
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-l from-crema-alta/95 from-30% via-crema-alta/75 via-50% to-transparent to-75% md:block" />

        <button
          type="button"
          onClick={anterior}
          aria-label="Foto anterior"
          className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-crema-alta/90 text-tinta shadow-md transition-colors hover:bg-crema-alta md:left-5 md:h-14 md:w-14"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={siguiente}
          aria-label="Foto siguiente"
          className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-crema-alta/90 text-tinta shadow-md transition-colors hover:bg-crema-alta md:right-5 md:h-14 md:w-14"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-tinta/45 px-2.5 py-1.5 backdrop-blur-sm md:hidden">
          {fotos.map((foto, fotoIndice) => (
            <button
              key={foto.imagen.src}
              type="button"
              onClick={() => setIndice(fotoIndice)}
              aria-label={`Ver foto ${fotoIndice + 1}`}
              className={`h-2 rounded-full transition-all ${
                fotoIndice === indice ? "w-5 bg-boton" : "w-2 bg-crema-alta/80"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[100rem] px-5 py-12 md:min-h-[36rem] md:items-center md:justify-end md:py-16 md:pl-10 md:pr-24 lg:min-h-[40rem] lg:pr-32">
        <div className="mx-auto w-full max-w-md text-center md:mx-0 md:max-w-lg">
          {children}
        </div>
      </div>
    </section>
  );
}

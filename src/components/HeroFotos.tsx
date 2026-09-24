"use client";

import Image, { StaticImageData } from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero2 from "@/img/hero-2.jpeg";
import hero3 from "@/img/hero-3.jpeg";
import hero4 from "@/img/hero-4.jpeg";
import hero6 from "@/img/hero-6.jpeg";
import hero7 from "@/img/hero-7.jpeg";
import hero8 from "@/img/hero-8.jpeg";
import hero10 from "@/img/hero-10.jpeg";

type Foto = {
  imagen: StaticImageData;
  alt: string;
  // Fotos que en el celular no se muestran (se ven mejor en pantalla ancha).
  ocultaEnMovil?: boolean;
};

const fotos: Foto[] = [
  { imagen: hero2, alt: "Producto casero de Miel" },
  { imagen: hero3, alt: "Producto casero de Miel" },
  { imagen: hero4, alt: "Producto casero de Miel" },
  { imagen: hero6, alt: "Producto casero de Miel", ocultaEnMovil: true },
  { imagen: hero7, alt: "Producto casero de Miel" },
  { imagen: hero8, alt: "Producto casero de Miel", ocultaEnMovil: true },
  { imagen: hero10, alt: "Producto casero de Miel" },
];

const DURACION = 5000;

export default function HeroFotos({ children }: { children: ReactNode }) {
  const [esMovil, setEsMovil] = useState(false);
  const [indice, setIndice] = useState(0);
  const inicioToque = useRef<number | null>(null);

  // Detecta el tamaño de pantalla en el navegador (en el server todavía no
  // se sabe), para armar la lista de fotos que corresponde.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const actualizar = () => setEsMovil(mediaQuery.matches);
    actualizar();
    mediaQuery.addEventListener("change", actualizar);
    return () => mediaQuery.removeEventListener("change", actualizar);
  }, []);

  const fotosVisibles = esMovil
    ? fotos.filter((foto) => !foto.ocultaEnMovil)
    : fotos;

  // Si cambia la cantidad de fotos disponibles (por ejemplo al girar el
  // celular cruzando el breakpoint), volvemos a arrancar del principio.
  useEffect(() => {
    setIndice(0);
  }, [fotosVisibles.length]);

  // Se reinicia en cada cambio para que, al tocar una flecha, la próxima
  // foto espere el tiempo completo.
  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      setIndice((actual) => (actual + 1) % fotosVisibles.length);
    }, DURACION);
    return () => window.clearTimeout(temporizador);
  }, [indice, fotosVisibles.length]);

  const anterior = () =>
    setIndice(
      (actual) => (actual - 1 + fotosVisibles.length) % fotosVisibles.length,
    );
  const siguiente = () =>
    setIndice((actual) => (actual + 1) % fotosVisibles.length);

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
      className="relative overflow-hidden border-b border-linea"
      aria-label="Miel, naturalmente rico"
    >
      {/*
        La sección ocupa exactamente lo que queda de pantalla debajo del
        header y la barra de anuncios: la foto llena todo ese espacio de
        punta a punta y el texto va centrado arriba, con un velo oscuro
        para que se lea bien sobre cualquiera de las fotos.
      */}
      <div
        className="relative h-[calc(100dvh_-_var(--nav-h)_-_var(--marquee-h))] w-full"
        onTouchStart={(evento) => {
          inicioToque.current = evento.touches[0].clientX;
        }}
        onTouchEnd={cambiarPorGestos}
      >
        {fotosVisibles.map((foto, fotoIndice) => (
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

        {/* Velo semitransparente: da contraste al texto sin tapar la foto */}
        <div className="pointer-events-none absolute inset-0 bg-tinta/70" />

        <div className="relative z-10 flex h-full w-full items-center justify-center px-5">
          <div className="mx-auto w-full max-w-4xl text-center text-crema-alta">
            {children}
          </div>
        </div>

        {/* En el celular las flechas quedaban arriba del texto centrado;
            en pantallas chicas alcanza con deslizar el dedo (swipe). */}
        <button
          type="button"
          onClick={anterior}
          aria-label="Foto anterior"
          className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-crema-alta/20 text-crema-alta backdrop-blur-sm transition-colors hover:bg-crema-alta/35 md:flex md:left-6 md:h-12 md:w-12"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={siguiente}
          aria-label="Foto siguiente"
          className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-crema-alta/20 text-crema-alta backdrop-blur-sm transition-colors hover:bg-crema-alta/35 md:flex md:right-6 md:h-12 md:w-12"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-tinta/40 px-2.5 py-1.5 backdrop-blur-sm">
          {fotosVisibles.map((foto, fotoIndice) => (
            <button
              key={foto.imagen.src}
              type="button"
              onClick={() => setIndice(fotoIndice)}
              aria-label={`Ver foto ${fotoIndice + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                fotoIndice === indice
                  ? "w-4 bg-marron"
                  : "w-1.5 bg-crema-alta/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

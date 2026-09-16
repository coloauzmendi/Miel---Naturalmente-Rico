"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import foto1 from "@/img/hero1.jpeg";
import foto2 from "@/img/hero2.jpeg";
import foto3 from "@/img/hero3.jpeg";
import foto4 from "@/img/hero4.jpeg";
import foto5 from "@/img/hero5.jpeg";
import foto6 from "@/img/hero6.jpeg";
import foto7 from "@/img/hero7.jpeg";
import foto8 from "@/img/hero8.jpeg";
import foto9 from "@/img/hero9.jpeg";
import foto10 from "@/img/hero10.jpeg";

const fotos: StaticImageData[] = [
  foto1,
  foto2,
  foto3,
  foto4,
  foto5,
  foto6,
  foto7,
  foto8,
  foto9,
  foto10,
];

export default function HeroMovil() {
  const [indice, setIndice] = useState(0);
  const inicioToque = useRef<number | null>(null);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setIndice((actual) => (actual + 1) % fotos.length);
    }, 4500);
    return () => window.clearInterval(intervalo);
  }, []);

  function cambiarPorGestos(evento: React.TouchEvent<HTMLDivElement>) {
    if (inicioToque.current === null) return;
    const distancia = inicioToque.current - evento.changedTouches[0].clientX;
    if (Math.abs(distancia) < 35) return;
    setIndice((actual) =>
      distancia > 0
        ? (actual + 1) % fotos.length
        : (actual - 1 + fotos.length) % fotos.length,
    );
    inicioToque.current = null;
  }

  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[1.75rem] border-4 border-crema bg-marron/10 p-2 shadow-[0_18px_35px_-18px_rgba(43,36,32,0.5)]"
      onTouchStart={(evento) => {
        inicioToque.current = evento.touches[0].clientX;
      }}
      onTouchEnd={cambiarPorGestos}
      aria-label="Galería de productos de Miel"
    >
      <div className="relative h-[22rem] overflow-hidden rounded-2xl sm:h-[28rem]">
        {fotos.map((foto, fotoIndice) => (
          <div
            key={foto.src}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              fotoIndice === indice
                ? "translate-x-0 scale-100 opacity-100"
                : fotoIndice === (indice + 1) % fotos.length
                  ? "translate-x-[76%] scale-90 opacity-70"
                  : "-translate-x-[76%] scale-90 opacity-0"
            }`}
          >
            <Image
              src={foto}
              alt={`Producto casero de Miel ${fotoIndice + 1}`}
              fill
              priority={fotoIndice === 0}
              className="rounded-2xl object-cover"
              sizes="90vw"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-marron/80 px-2 py-1.5">
        <button
          type="button"
          onClick={() =>
            setIndice((actual) => (actual - 1 + fotos.length) % fotos.length)
          }
          aria-label="Foto anterior"
          className="text-crema-alta"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-1.5">
          {fotos.map((foto, fotoIndice) => (
            <button
              key={foto.src}
              type="button"
              onClick={() => setIndice(fotoIndice)}
              aria-label={`Ver foto ${fotoIndice + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                fotoIndice === indice
                  ? "w-5 bg-crema-alta"
                  : "w-1.5 bg-crema-alta/50"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIndice((actual) => (actual + 1) % fotos.length)}
          aria-label="Foto siguiente"
          className="text-crema-alta"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

"use client";

import Image, { StaticImageData } from "next/image";
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

export default function CarruselNosotras() {
  return (
    <div
      className="carrusel-marco relative aspect-square overflow-hidden rounded-2xl border border-linea bg-crema-alta"
      aria-label="Fotos de Sol y Abril"
    >
      <div className="carrusel-pista flex h-full w-[1000%]">
        {[...fotos, ...fotos].map((foto, indice) => (
          <div
            key={`${foto.src.src}-${indice}`}
            className="relative h-full w-[10%] shrink-0"
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              priority={indice === 0}
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

/**
 * Tarjeta grande de categoría para el inicio.
 *
 * En compu los efectos salen con el mouse (hover). En el celular no hay
 * hover, así que la tarjeta se "activa" sola cuando queda bien a la vista
 * al scrollear: la foto hace zoom, pasa el brillo y aparece el borde.
 */
export default function TarjetaCategoria({
  href,
  etiqueta,
  foto,
}: {
  href: string;
  etiqueta: string;
  foto: StaticImageData;
}) {
  const tarjeta = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = tarjeta.current;
    if (
      !el ||
      typeof IntersectionObserver === "undefined" ||
      !window.matchMedia("(hover: none)").matches
    ) {
      return;
    }

    // Se marca directo en el DOM (data-activa) en vez de usar estado:
    // así no re-renderizamos la tarjeta en cada scroll.
    const observador = new IntersectionObserver(
      ([entrada]) => el.toggleAttribute("data-activa", entrada.isIntersecting),
      { threshold: 0.6 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <Link
      ref={tarjeta}
      href={href}
      className="group relative flex aspect-[4/3] overflow-hidden rounded-3xl bg-marron/20 shadow-sm transition-[box-shadow,transform] duration-300 hover:shadow-2xl active:scale-[0.98] data-activa:shadow-xl sm:aspect-[5/4] lg:aspect-[16/11]"
    >
      <Image
        src={foto}
        alt=""
        fill
        sizes="(min-width: 640px) 50vw, 100vw"
        className="object-cover saturate-[1.25] contrast-[1.05] transition-transform duration-[1200ms] ease-out group-hover:scale-110 group-data-activa:scale-110"
      />

      {/* Degradé negro: fuerte abajo para que resalte el título, casi nada arriba */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-35% to-transparent to-65%" />

      {/* Brillo que cruza la foto en diagonal */}
      <div className="pointer-events-none absolute -inset-y-10 -left-1/3 w-1/3 -skew-x-12 bg-crema-alta/25 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[420%] group-data-activa:translate-x-[420%]" />

      {/* Borde dorado */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-crema-alta/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-boton/80 group-data-activa:ring-2 group-data-activa:ring-boton/80" />

      <h3 className="relative mt-auto w-full p-5 font-display text-3xl uppercase leading-none tracking-wide text-crema-alta drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:p-6 sm:text-4xl">
        {etiqueta}
      </h3>
    </Link>
  );
}

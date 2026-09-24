"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DURACION = 4500;

export default function GaleriaProducto({
  imagenes,
  nombre,
}: {
  imagenes: string[];
  nombre: string;
}) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const temporizador = window.setTimeout(() => {
      setIndice((actual) => (actual + 1) % imagenes.length);
    }, DURACION);
    return () => window.clearTimeout(temporizador);
  }, [indice, imagenes.length]);

  if (imagenes.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-linea bg-crema-alta text-oliva/40">
        <span className="font-display text-2xl">Miel</span>
      </div>
    );
  }

  const anterior = () =>
    setIndice((actual) => (actual - 1 + imagenes.length) % imagenes.length);
  const siguiente = () => setIndice((actual) => (actual + 1) % imagenes.length);

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-linea bg-crema-alta">
      {imagenes.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt={`${nombre} ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out ${
            i === indice ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {imagenes.length > 1 && (
        <>
          <button
            type="button"
            onClick={anterior}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-crema-alta/90 text-tinta shadow-md transition-colors hover:bg-crema-alta"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={siguiente}
            aria-label="Foto siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-crema-alta/90 text-tinta shadow-md transition-colors hover:bg-crema-alta"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-tinta/45 px-2.5 py-1.5 backdrop-blur-sm">
            {imagenes.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setIndice(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === indice ? "w-4 bg-boton" : "w-1.5 bg-crema-alta/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import type { Encuadre } from "@/types";
import {
  ENCUADRE_CENTRADO,
  ZOOM_MAXIMO,
  estiloEncuadre,
} from "@/lib/encuadre";

/**
 * Editor del panel para encuadrar una foto: se toca (o arrastra) sobre la
 * foto entera el punto que tiene que quedar en el centro, y con la barra
 * se acerca. Al costado se ve en vivo cómo queda en la tarjeta del
 * catálogo y en la página del producto.
 */
export default function EditorEncuadre({
  url,
  inicial,
  onListo,
  onCerrar,
}: {
  url: string;
  inicial?: Encuadre;
  onListo: (encuadre: Encuadre) => void;
  onCerrar: () => void;
}) {
  const [encuadre, setEncuadre] = useState<Encuadre>(
    inicial ?? ENCUADRE_CENTRADO,
  );
  const foto = useRef<HTMLDivElement>(null);
  const arrastrando = useRef(false);

  function ubicar(e: React.PointerEvent<HTMLDivElement>) {
    const caja = foto.current?.getBoundingClientRect();
    if (!caja) return;
    const x = ((e.clientX - caja.left) / caja.width) * 100;
    const y = ((e.clientY - caja.top) / caja.height) * 100;
    setEncuadre((actual) => ({
      ...actual,
      x: Math.round(Math.min(100, Math.max(0, x))),
      y: Math.round(Math.min(100, Math.max(0, y))),
    }));
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-tinta/60 p-0 sm:items-center sm:p-5"
      onClick={onCerrar}
    >
      <div
        className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-crema p-4 shadow-2xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-tinta">Ajustar foto</h2>
            <p className="text-sm text-tinta/60">
              Tocá o arrastrá sobre lo más importante de la foto: ese punto
              queda en el centro. Con la barra la acercás.
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="text-tinta/50 hover:text-tinta"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr]">
          {/* Foto entera, sin recortar, con el punto elegido */}
          <div className="flex justify-center rounded-xl bg-tinta/5 p-2">
            <div
              ref={foto}
              className="relative cursor-crosshair touch-none select-none"
              onPointerDown={(e) => {
                arrastrando.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                ubicar(e);
              }}
              onPointerMove={(e) => arrastrando.current && ubicar(e)}
              onPointerUp={() => (arrastrando.current = false)}
              onPointerCancel={() => (arrastrando.current = false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                draggable={false}
                className="block max-h-[45vh] w-auto max-w-full rounded-lg"
              />
              <span
                className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-boton/50 shadow-[0_0_0_2px_rgba(43,36,32,0.5)]"
                style={{ left: `${encuadre.x}%`, top: `${encuadre.y}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm text-tinta">
              Zoom
              <input
                type="range"
                min={1}
                max={ZOOM_MAXIMO}
                step={0.05}
                value={encuadre.zoom}
                onChange={(e) =>
                  setEncuadre((actual) => ({
                    ...actual,
                    zoom: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full accent-marron"
              />
            </label>

            <div className="flex items-end gap-3">
              <div className="flex-[4]">
                <p className="mb-1 text-xs text-tinta/60">Tarjeta del catálogo</p>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-linea bg-linea/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                    style={estiloEncuadre(encuadre)}
                  />
                </div>
              </div>
              <div className="flex-[3]">
                <p className="mb-1 text-xs text-tinta/60">Página del producto</p>
                <div className="aspect-square overflow-hidden rounded-lg border border-linea bg-linea/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                    style={estiloEncuadre(encuadre)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onListo(encuadre)}
                className="rounded-full bg-oliva px-5 py-2 text-sm text-crema-alta hover:bg-oliva-claro"
              >
                Listo
              </button>
              <button
                type="button"
                onClick={() => setEncuadre(ENCUADRE_CENTRADO)}
                className="rounded-full border border-linea px-5 py-2 text-sm text-tinta/70 hover:bg-white"
              >
                Centrar de nuevo
              </button>
            </div>
            <p className="text-xs text-tinta/50">
              Después de tocar &quot;Listo&quot;, acordate de tocar
              &quot;Guardar&quot; en el producto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";
import type { Encuadre } from "@/types";

export const ENCUADRE_CENTRADO: Encuadre = { x: 50, y: 50, zoom: 1 };
export const ZOOM_MAXIMO = 3;

/**
 * Estilo para un <img> con object-cover: centra la foto en el punto
 * elegido (x, y en %) y la acerca con el zoom, tomando ese mismo punto
 * como centro. Funciona igual en cualquier proporción de recuadro, así
 * que el mismo encuadre sirve para la tarjeta (4:3) y la galería (1:1).
 */
export function estiloEncuadre(encuadre?: Encuadre | null): CSSProperties {
  if (!encuadre) return {};
  const origen = `${encuadre.x}% ${encuadre.y}%`;
  return {
    objectPosition: origen,
    transformOrigin: origen,
    transform: encuadre.zoom > 1 ? `scale(${encuadre.zoom})` : undefined,
  };
}

const acotar = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/**
 * Valida lo que llega del panel: solo se guardan encuadres de fotos que
 * siguen en el producto, con números dentro de rango.
 */
export function limpiarEncuadres(
  valor: unknown,
  imagenes: string[],
): Record<string, Encuadre> | null {
  if (!valor || typeof valor !== "object") return null;

  const resultado: Record<string, Encuadre> = {};
  for (const url of imagenes) {
    const e = (valor as Record<string, Partial<Encuadre>>)[url];
    if (!e) continue;
    const x = Number(e.x);
    const y = Number(e.y);
    const zoom = Number(e.zoom);
    if (![x, y, zoom].every(Number.isFinite)) continue;
    resultado[url] = {
      x: acotar(x, 0, 100),
      y: acotar(y, 0, 100),
      zoom: acotar(zoom, 1, ZOOM_MAXIMO),
    };
  }
  return Object.keys(resultado).length ? resultado : null;
}

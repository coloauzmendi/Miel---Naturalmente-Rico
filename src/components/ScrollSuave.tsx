"use client";

import { useEffect } from "react";

// ⚙️ Cuánto tarda en llegar a la sección, en milisegundos.
// Más alto = más lento y suave (ej: 1500). Más bajo = más rápido (ej: 800).
const DURACION_SCROLL = 1200;

// Arranca despacio, acelera en el medio y frena despacio al llegar.
function suavizado(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function irASeccion(seccion: HTMLElement) {
  // Se descuenta la altura real del header fijo, para que el título de la
  // sección no quede tapado.
  const alturaHeader = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  const inicio = window.scrollY;
  const destino = seccion.getBoundingClientRect().top + inicio - alturaHeader;
  const distancia = destino - inicio;
  const comienzo = performance.now();

  function paso(ahora: number) {
    const progreso = Math.min(1, (ahora - comienzo) / DURACION_SCROLL);
    window.scrollTo({ top: inicio + distancia * suavizado(progreso), behavior: "instant" });
    if (progreso < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

/**
 * Hace que todos los enlaces a secciones de la misma página ("#productos",
 * "/#contacto", etc.) bajen con un desplazamiento suave y con la duración
 * de arriba, en vez del "smooth" del navegador, que no se puede regular.
 * Se monta una sola vez en el layout.
 */
export default function ScrollSuave() {
  useEffect(() => {
    function alHacerClic(evento: MouseEvent) {
      if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;

      const enlace = (evento.target as HTMLElement).closest("a");
      const href = enlace?.getAttribute("href");
      if (!href || !(href.startsWith("#") || href.startsWith("/#"))) return;
      // "/#seccion" desde otra página tiene que navegar al inicio normalmente.
      if (href.startsWith("/#") && window.location.pathname !== "/") return;

      const seccion = document.getElementById(href.slice(href.indexOf("#") + 1));
      if (!seccion) return;

      evento.preventDefault();
      irASeccion(seccion);
      window.history.pushState(null, "", href.slice(href.indexOf("#")));
    }

    // En fase de captura, antes que los <Link> de Next, para que no
    // salten ellos primero.
    document.addEventListener("click", alHacerClic, true);
    return () => document.removeEventListener("click", alHacerClic, true);
  }, []);

  return null;
}

"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import styles from "./StoryCarousel.module.css";
import tartas from "@/img/carrusel-tartas.jpeg";
import pizza from "@/img/carrusel-pizzas.jpeg";
import malfattis from "@/img/carrusel-malfattis.jpeg";
import pancakes from "@/img/carrusel-pancakes.jpeg";
import muffins from "@/img/carrusel-muffins.jpeg";
import panes from "@/img/carrusel-panes.jpeg";
import mermeladas from "@/img/carrusel-mermeladas.jpeg";
import granolas from "@/img/carrusel-granolas.jpeg";
import waffles from "@/img/carrusel-waffles.jpeg";

type Historia = {
  titulo: string;
  texto: string;
  imagen: StaticImageData;
};

const historias: Historia[] = [
  {
    titulo: "Tartas integrales individuales",
    texto:
      "Prácticas, ricas y nutritivas.\nListas en 5 minutos.",
    imagen: tartas,
  },
  {
    titulo: "Pizza de masa integral",
    texto:
      "Del freezer al plato en 10 minutos.",
    imagen: pizza,
  },
  {
    titulo: "Malfattis",
    texto: "Livianos, proteicos, riquísimos.\nRicota y acelga.",
    imagen: malfattis,
  },
  {
    titulo: "Pancakes",
    texto: "Nuestro producto estrella.\nVariedad de sabores, todos únicos.",
    imagen: pancakes,
  },
  {
    titulo: "Muffins",
    texto:
      "Carrot y cítricos.\nHúmedos, frescos, crocantes.",
    imagen: muffins,
  },
  {
    titulo: "Pan integral",
    texto: "100% a base de harina integral.\nCongelado y fraccionado.",
    imagen: panes,
  },
  {
    titulo: "Mermelada de estación",
    texto: "Mas de 24hs de preparación.\nEl aliado de tus meriendas.",
    imagen: mermeladas,
  },
  {
    titulo: "Granola",
    texto: "Acompañando desayunos y meriendas.",
    imagen: granolas,
  },
  {
    titulo: "Waffles belgas",
    texto: "Extremadamente versátil y rico.\nMiles de opciones para acompañarlos.",
    imagen: waffles,
  },
];

export default function StoryCarousel() {
  const [productoActual, setProductoActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const historia = historias[productoActual];

  useEffect(() => {
    if (pausado) return;

    const intervalo = window.setTimeout(() => {
      setProductoActual((producto) => (producto + 1) % historias.length);
    }, 5000);

    return () => window.clearTimeout(intervalo);
  }, [pausado, productoActual]);

  return (
    <section
      className={`${styles.carousel} ${pausado ? styles.paused : ""}`}
      aria-label="Historias de nuestros productos"
      onPointerEnter={(evento) => {
        if (evento.pointerType === "mouse") setPausado(true);
      }}
      onPointerLeave={(evento) => {
        if (evento.pointerType === "mouse") setPausado(false);
      }}
    >
      <div className={styles.visual}>
        <div
          key={historia.titulo}
          className={`${styles.mainImage} ${styles.slideChange}`}
        >
          <Image
            src={historia.imagen}
            alt={historia.titulo}
            fill
            priority={productoActual === 0}
            sizes="(min-width: 768px) 60vw, 90vw"
          />
        </div>
      </div>

      <div
        key={`content-${historia.titulo}`}
        className={`${styles.content} ${styles.slideChange}`}
      >
        <h2>{historia.titulo}</h2>
        <p>{historia.texto}</p>
      </div>

      <div
        key={productoActual}
        className={styles.progress}
        aria-hidden="true"
      />
    </section>
  );
}

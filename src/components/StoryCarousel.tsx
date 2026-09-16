"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import styles from "./StoryCarousel.module.css";
import tartas from "@/img/carrusel-tartas.jpeg";
import pizza from "@/img/carrusel-pizzas.jpeg";
import malfattis from "@/img/carrusel-malfattis.jpeg";
import pancakes from "@/img/carrusel-frutos-rojos.jpeg";
import pancakes2 from "@/img/carrusel-chocochips.jpeg";
import pancakes3 from "@/img/carrusel-pancakes-bananachip.jpeg";
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
      "Acelga, caprese, choclo, cebolla y queso, cebolla y roquefort, jamón y queso",
    imagen: tartas,
  },
  {
    titulo: "Pizza de masa integral",
    texto:
      "Muzzarella, muzzarella y jamón, muzzarella y choclo, muzzarella y roquefort",
    imagen: pizza,
  },
  {
    titulo: "Malfattis",
    texto: "Ricota y acelga. 10 unidades",
    imagen: malfattis,
  },
  {
    titulo: "Pancakes harina integral + harina de almendras",
    texto: "Banana, frutos rojos, clásico con nuez",
    imagen: pancakes,
  },
  {
    titulo: "Pancakes harina de avena + harina de almendras",
    texto: "Choco Chips",
    imagen: pancakes2,
  },
  {
    titulo: "Pancakes 100% harina de almendras",
    texto: "Manzana, banana con chips o una opción salada con queso y quinoa.",
    imagen: pancakes3,
  },
  {
    titulo: "Muffins",
    texto:
      "Carrot cake (harina integral y de almendras) o cítricos (100% harina de almendras)",
    imagen: muffins,
  },
  {
    titulo: "Pan integral",
    texto: "100% harina integral",
    imagen: panes,
  },
  {
    titulo: "Mermelada de estación",
    texto: "Naranja o frutilla",
    imagen: mermeladas,
  },
  {
    titulo: "Granola x300g",
    texto: "Natural, pasta de maní y chocolate, chocolate, arándanos y coco",
    imagen: granolas,
  },
  {
    titulo: "Waffles belgas",
    texto: "Vainilla, nuez, pasas, cacao + chips, coco, salados",
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

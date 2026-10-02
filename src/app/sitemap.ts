import type { MetadataRoute } from "next";
import { obtenerProductos } from "@/lib/productos";
import { CATEGORIAS } from "@/lib/categorias";
import { SITIO_URL } from "@/lib/sitio";

/**
 * /sitemap.xml: la lista de páginas que Google tiene que conocer. Incluye
 * cada producto visible, así que se actualiza solo al cargar productos.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await obtenerProductos();

  return [
    { url: SITIO_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO_URL}/productos`, changeFrequency: "weekly", priority: 0.9 },
    ...CATEGORIAS.map(({ valor }) => ({
      url: `${SITIO_URL}/productos?categoria=${valor}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productos.map((producto) => ({
      url: `${SITIO_URL}/productos/${producto.id}`,
      lastModified: producto.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

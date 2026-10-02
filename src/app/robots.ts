import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/lib/sitio";

// /robots.txt: Google puede leer todo menos las páginas privadas o que no
// tiene sentido mostrar en una búsqueda.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/cuenta", "/carrito", "/checkout", "/wa"],
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,
  };
}

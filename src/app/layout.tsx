  import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CarritoProvider } from "@/components/CarritoContext";
import CarritoFlotante from "@/components/CarritoFlotante";
import Marquee from "@/components/Marquee";
import ScrollSuave from "@/components/ScrollSuave";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  GOOGLE_ANALYTICS_ID,
  GOOGLE_SITE_VERIFICATION,
  SITIO_DESCRIPCION,
  SITIO_NOMBRE,
  SITIO_URL,
} from "@/lib/sitio";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: {
    default: `${SITIO_NOMBRE} | Comida casera cocida y congelada`,
    // Las páginas que definen su propio título (ej: un producto) quedan
    // como "Pancakes de almendras | Miel, naturalmente rico".
    template: `%s | ${SITIO_NOMBRE}`,
  },
  description: SITIO_DESCRIPCION,
  openGraph: {
    title: SITIO_NOMBRE,
    description: SITIO_DESCRIPCION,
    url: SITIO_URL,
    siteName: SITIO_NOMBRE,
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITIO_NOMBRE,
    description: SITIO_DESCRIPCION,
  },
  // Verificación de Search Console (método "etiqueta HTML").
  verification: { google: GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- regla pensada para Pages Router; en App Router cargar fuentes en el layout raíz es el patrón correcto */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <CarritoProvider>
          <Navbar />
          <Marquee />
          <main className="flex-1">{children}</main>
          <Footer />
          <CarritoFlotante />
          <ScrollSuave />
        </CarritoProvider>
      </body>
      {/* Solo en producción, para no sumar visitas al probar en localhost */}
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  );
}

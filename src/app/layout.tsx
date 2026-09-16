import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CarritoProvider } from "@/components/CarritoContext";
import CarritoFlotante from "@/components/CarritoFlotante";

export const metadata: Metadata = {
  title: "Miel, naturalmente rico | Comida casera cocida y congelada",
  description:
    "Alimentos cocidos y congelados, sin conservantes ni aditivos. Pedí online y recibí en tu casa.",
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
          <main className="flex-1">{children}</main>
          <Footer />
          <CarritoFlotante />
        </CarritoProvider>
      </body>
    </html>
  );
}

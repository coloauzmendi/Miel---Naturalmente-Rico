"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBasket, User, Menu } from "lucide-react";
import { useCarrito } from "@/components/CarritoContext";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const { cantidadTotal } = useCarrito();
  const [sesionActiva, setSesionActiva] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setSesionActiva(Boolean(data.user)));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSesionActiva(Boolean(session?.user)),
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const enlaces = [
    { href: "/#productos", label: "Productos" },
    { href: "/#como-funciona", label: "Cómo comprar" },
    { href: "/#nosotras", label: "Nosotras" },
    { href: "/#contacto", label: "Contacto" },
  ];

  // Scrollea a mano, midiendo la altura real del header en ese momento, en
  // vez de confiar en un margen fijo: así no importa si el header cambia de
  // tamaño o si el navegador calcula distinto el "scroll-margin-top" nativo.
  function irASeccion(evento: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("/#")) return;
    if (window.location.pathname !== "/") return;

    const id = href.slice(2);
    const seccion = document.getElementById(id);
    if (!seccion) return;

    evento.preventDefault();
    const header = document.querySelector("header");
    const alturaHeader = header?.getBoundingClientRect().height ?? 0;
    const y = seccion.getBoundingClientRect().top + window.scrollY - alturaHeader;

    window.scrollTo({ top: y, behavior: "smooth" });
    window.history.pushState(null, "", href);
    evento.currentTarget.closest("details")?.removeAttribute("open");
  }

  return (
    <div className="relative z-40">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-marron bg-marron/95 text-crema-alta backdrop-blur">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            className="whitespace-nowrap font-display text-2xl tracking-tight text-crema-alta"
          >
            Miel
            <span className="ml-1 align-middle text-[0.5rem] font-sans font-medium uppercase tracking-[0.1em] text-dorado sm:ml-2 sm:text-[0.6rem] sm:tracking-[0.18em]">
              naturalmente rico
            </span>
          </Link>

          <nav className="hidden items-center gap-8 font-sans text-sm text-crema-alta md:flex">
            {enlaces.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                onClick={(e) => irASeccion(e, enlace.href)}
                className="transition-colors hover:text-dorado"
              >
                {enlace.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href={sesionActiva ? "/cuenta/pedidos" : "/cuenta/login"}
              className="hidden items-center gap-1.5 text-sm text-crema-alta transition-colors hover:text-dorado md:flex"
            >
              <User size={18} />
              {sesionActiva ? "Mi cuenta" : "Ingresar"}
            </Link>

            <Link
              href="/carrito"
              className="relative flex items-center gap-1.5 rounded-full bg-crema-alta px-4 py-2 text-sm font-medium text-marron transition-colors hover:bg-white"
            >
              <ShoppingBasket size={18} />
              Carrito
              {cantidadTotal > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-marron text-xs text-crema-alta">
                  {cantidadTotal}
                </span>
              )}
            </Link>

            <details className="relative md:hidden">
              <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center text-crema-alta [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Abrir menú</span>
                <Menu size={24} />
              </summary>
              <nav
                id="menu-movil"
                className="menu-movil-panel flex flex-col gap-1 border-t border-marron bg-marron px-5 py-3 font-sans text-sm text-crema-alta shadow-lg"
              >
                {enlaces.map((enlace) => (
                  <a
                    key={enlace.href}
                    href={enlace.href}
                    onClick={(e) => irASeccion(e, enlace.href)}
                    className="py-3"
                  >
                    {enlace.label}
                  </a>
                ))}
                <Link
                  href={sesionActiva ? "/cuenta/pedidos" : "/cuenta/login"}
                  className="py-3"
                >
                  {sesionActiva ? "Mi cuenta" : "Ingresar"}
                </Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </div>
  );
}

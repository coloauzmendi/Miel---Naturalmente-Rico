"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShoppingBasket, User, Menu } from "lucide-react";
import { useCarrito } from "@/components/CarritoContext";
import { createClient } from "@/lib/supabase/client";
import { SECCIONES } from "@/lib/navegacion";

export default function Navbar() {
  const { cantidadTotal } = useCarrito();
  const [sesionActiva, setSesionActiva] = useState(false);
  const menuMovil = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  function cerrarMenu() {
    menuMovil.current?.removeAttribute("open");
  }

  // Al cambiar de página (por ejemplo tocando el logo o el carrito con el
  // menú abierto) el header no se vuelve a montar, así que lo cerramos acá.
  useEffect(cerrarMenu, [pathname]);

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
            {SECCIONES.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
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

            <details ref={menuMovil} className="relative md:hidden">
              <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center text-crema-alta [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Abrir menú</span>
                <Menu size={24} />
              </summary>
              <nav
                id="menu-movil"
                // Cualquier enlace del menú lo cierra, lleve adonde lleve.
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a")) cerrarMenu();
                }}
                className="menu-movil-panel flex flex-col gap-1 border-t border-marron bg-marron px-5 py-3 font-sans text-sm text-crema-alta shadow-lg"
              >
                {SECCIONES.map((enlace) => (
                  <a
                    key={enlace.href}
                    href={enlace.href}
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

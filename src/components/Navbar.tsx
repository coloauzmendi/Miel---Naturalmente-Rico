"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBasket, User, Menu, X } from "lucide-react";
import { useCarrito } from "@/components/CarritoContext";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const { cantidadTotal } = useCarrito();
  const [sesionActiva, setSesionActiva] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setSesionActiva(Boolean(data.user)));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSesionActiva(Boolean(session?.user));
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const enlaces = [
    { href: "/#productos", label: "Productos" },
    { href: "/#nosotras", label: "Nosotras" },
    { href: "/#contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-marron bg-marron/95 text-crema-alta backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-crema-alta"
        >
          Miel
          <span className="ml-2 align-middle text-[0.6rem] font-sans font-medium uppercase tracking-[0.18em] text-dorado">
            naturalmente rico
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-sans text-sm text-crema-alta md:flex">
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="transition-colors hover:text-dorado"
            >
              {e.label}
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
            className="relative flex items-center gap-1.5 rounded-full bg-boton px-4 py-2 text-sm font-medium text-tinta transition-colors hover:bg-boton-oscuro"
          >
            <ShoppingBasket size={18} />
            Carrito
            {cantidadTotal > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-boton text-xs text-tinta">
                {cantidadTotal}
              </span>
            )}
          </Link>

          <button
            className="text-crema-alta md:hidden"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú"
          >
            {menuAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav className="flex flex-col gap-1 border-t border-marron bg-marron px-5 py-3 font-sans text-sm text-crema-alta md:hidden">
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="py-2"
              onClick={() => setMenuAbierto(false)}
            >
              {e.label}
            </a>
          ))}
          <Link
            href={sesionActiva ? "/cuenta/pedidos" : "/cuenta/login"}
            className="py-2"
          >
            {sesionActiva ? "Mi cuenta" : "Ingresar"}
          </Link>
        </nav>
      )}
    </header>
  );
}

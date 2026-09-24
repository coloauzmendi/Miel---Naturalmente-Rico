"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCarrito } from "@/components/CarritoContext";
import { formatearPrecio } from "@/lib/formato";
import type { User } from "@supabase/supabase-js";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, vaciar } = useCarrito();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user);
      setCargandoSesion(false);
    });
  }, []);

  if (!cargandoSesion && items.length === 0) {
    router.replace("/carrito");
    return null;
  }

  if (!cargandoSesion && !usuario) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-tinta">
          Necesitás una cuenta para continuar
        </h1>
        <p className="mt-3 text-tinta/70">
          Así podés ver el estado de tu pedido y tu historial de compras.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/cuenta/login?redirect=/checkout"
            className="rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
          >
            Ingresar
          </Link>
          <Link
            href="/cuenta/registro?redirect=/checkout"
            className="rounded-full border border-oliva px-6 py-3 text-sm font-medium text-oliva hover:bg-oliva hover:text-crema-alta"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  async function confirmarPedido() {
    setError(null);
    if (!direccion.trim() || !telefono.trim()) {
      setError("Completá la dirección y el teléfono de contacto.");
      return;
    }
    setEnviando(true);
    try {
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            producto_id: i.producto.id,
            nombre_producto: i.producto.nombre,
            precio_unitario: i.producto.precio,
            cantidad: i.cantidad,
            sabor: i.sabor,
          })),
          direccion_entrega: direccion,
          telefono_contacto: telefono,
          notas,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.error ?? "No pudimos iniciar el pago. Probá de nuevo.");
        setEnviando(false);
        return;
      }

      vaciar();
      window.location.href = datos.init_point;
    } catch {
      setError("Hubo un problema de conexión. Probá de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-3xl text-tinta">Finalizar compra</h1>

      <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-marron">
        <span className="rounded-full bg-marron px-2.5 py-1 text-crema-alta">
          1
        </span>
        Datos de entrega
        <span className="h-px w-8 bg-linea" />
        <span className="rounded-full border border-linea px-2.5 py-1 text-tinta/50">
          2
        </span>
        Pago
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-tinta">
            Dirección de entrega
            <input
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, barrio, ciudad"
              className="mt-1 min-h-12 w-full rounded-lg border border-linea bg-crema-alta px-3 py-2 text-sm outline-none focus:border-oliva"
            />
          </label>

          <label className="text-sm font-medium text-tinta">
            Teléfono de contacto
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="341 000-0000"
              className="mt-1 min-h-12 w-full rounded-lg border border-linea bg-crema-alta px-3 py-2 text-sm outline-none focus:border-oliva"
            />
          </label>

          <label className="text-sm font-medium text-tinta">
            Notas para la entrega (opcional)
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Timbre, horario preferido, etc."
              className="mt-1 w-full rounded-lg border border-linea bg-crema-alta px-3 py-2 text-sm outline-none focus:border-oliva"
            />
          </label>

          {error && <p className="text-sm text-ciruela">{error}</p>}

          <button
            onClick={confirmarPedido}
            disabled={enviando}
            className="mt-2 rounded-full bg-boton px-6 py-3 text-sm font-medium text-tinta hover:bg-boton-oscuro disabled:opacity-60"
          >
            {enviando
              ? "Redirigiendo a Mercado Pago…"
              : "Pagar con Mercado Pago"}
          </button>
        </div>

        <div className="h-fit rounded-2xl border border-linea bg-crema-alta p-5 md:sticky md:top-24">
          <p className="mb-3 font-medium text-tinta">Resumen del pedido</p>
          <div className="flex flex-col gap-2 text-sm">
            {items.map((i) => (
              <div
                key={`${i.producto.id}::${i.sabor ?? ""}`}
                className="flex justify-between text-tinta/70"
              >
                <span>
                  {i.cantidad}× {i.producto.nombre}
                  {i.sabor ? ` (${i.sabor})` : ""}
                </span>
                <span>{formatearPrecio(i.producto.precio * i.cantidad)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-linea pt-3 font-medium text-tinta">
            <span>Total</span>
            <span>{formatearPrecio(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

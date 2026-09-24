"use client";

import { useState } from "react";
import { EstadoPedido, Pedido, PedidoItem } from "@/types";
import { formatearPrecio } from "@/lib/formato";

const ESTADOS: EstadoPedido[] = [
  "pendiente_pago",
  "pagado",
  "en_preparacion",
  "en_camino",
  "entregado",
  "cancelado",
];

const ETIQUETAS: Record<EstadoPedido, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  en_preparacion: "En preparación",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

type PedidoConItems = Pedido & { pedido_items: PedidoItem[] };

export default function AdminPedidosClient({
  pedidosIniciales,
}: {
  pedidosIniciales: PedidoConItems[];
}) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);

  async function cambiarEstado(id: string, estado: EstadoPedido) {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
    await fetch(`/api/admin/pedidos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
  }

  if (pedidos.length === 0) {
    return <p className="mt-6 text-tinta/60">Todavía no hay pedidos.</p>;
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {pedidos.map((pedido) => (
        <div key={pedido.id} className="rounded-2xl border border-linea bg-crema-alta p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-tinta/60">
                {new Date(pedido.created_at).toLocaleString("es-AR")}
              </p>
              <p className="font-display text-lg text-tinta">{formatearPrecio(pedido.total)}</p>
              <p className="text-sm text-tinta/70">
                {pedido.telefono_contacto} · {pedido.direccion_entrega}
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  pedido.metodo_pago === "efectivo"
                    ? "bg-dorado/20 text-dorado-oscuro"
                    : "bg-oliva/15 text-oliva"
                }`}
              >
                {pedido.metodo_pago === "efectivo" ? "Efectivo" : "Mercado Pago"}
              </span>
              {pedido.notas && <p className="text-sm text-tinta/50">Nota: {pedido.notas}</p>}
            </div>

            <select
              value={pedido.estado}
              onChange={(e) => cambiarEstado(pedido.id, e.target.value as EstadoPedido)}
              className="rounded-full border border-linea bg-white px-3 py-1.5 text-sm outline-none focus:border-oliva"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {ETIQUETAS[e]}
                </option>
              ))}
            </select>
          </div>

          <ul className="mt-3 divide-y divide-linea border-t border-linea pt-3 text-sm text-tinta/70">
            {pedido.pedido_items.map((item) => (
              <li key={item.id} className="flex justify-between py-1">
                <span>
                  {item.cantidad}× {item.nombre_producto}
                  {item.sabor ? ` (${item.sabor})` : ""}
                </span>
                <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

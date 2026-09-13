import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatearPrecio } from "@/lib/formato";
import { EstadoPedido } from "@/types";
import CerrarSesionBoton from "@/components/CerrarSesionBoton";

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  en_preparacion: "En preparación",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const COLOR_ESTADO: Record<EstadoPedido, string> = {
  pendiente_pago: "bg-dorado/20 text-dorado-oscuro",
  pagado: "bg-oliva/15 text-oliva",
  en_preparacion: "bg-oliva/15 text-oliva",
  en_camino: "bg-oliva/15 text-oliva",
  entregado: "bg-oliva text-crema-alta",
  cancelado: "bg-ciruela/15 text-ciruela",
};

const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function MisPedidosPage() {
  if (!supabaseConfigurado) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-tinta">Todavía falta conectar Supabase</h1>
        <p className="mt-3 text-tinta/70">
          Las cuentas y el historial de pedidos necesitan la base de datos
          configurada. Completá tu archivo <code>.env.local</code> (ver README)
          y volvé a intentar.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cuenta/login?redirect=/cuenta/pedidos");

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*, pedido_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-tinta">Mis pedidos</h1>
        <CerrarSesionBoton />
      </div>

      {!pedidos || pedidos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-linea bg-crema-alta p-10 text-center text-tinta/60">
          Todavía no hiciste ningún pedido.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="rounded-2xl border border-linea bg-crema-alta p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-tinta/60">
                    Pedido del {new Date(pedido.created_at).toLocaleDateString("es-AR")}
                  </p>
                  <p className="font-display text-lg text-tinta">
                    {formatearPrecio(pedido.total)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${COLOR_ESTADO[pedido.estado as EstadoPedido]}`}
                >
                  {ETIQUETAS_ESTADO[pedido.estado as EstadoPedido]}
                </span>
              </div>

              <ul className="mt-4 divide-y divide-linea border-t border-linea pt-3 text-sm">
                {pedido.pedido_items?.map((item: { id: string; cantidad: number; nombre_producto: string; precio_unitario: number }) => (
                  <li key={item.id} className="flex justify-between py-1.5 text-tinta/70">
                    <span>
                      {item.cantidad}× {item.nombre_producto}
                    </span>
                    <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-xs text-tinta/50">
                Entrega en: {pedido.direccion_entrega}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

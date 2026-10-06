import { createClient } from "@/lib/supabase/server";
import { formatearPrecio } from "@/lib/formato";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: pedidos } = await supabase.from("pedidos").select("total, estado, metodo_pago");
  const { count: totalProductos } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true });

  // Solo cuentan como venta los pedidos cobrados o en curso: los que siguen
  // en "pendiente_pago" (por ejemplo, alguien que fue a Mercado Pago y no
  // pagó) y los cancelados no suman.
  const ventasTotales =
    pedidos
      ?.filter((p) => p.estado !== "cancelado" && p.estado !== "pendiente_pago")
      .reduce((acc, p) => acc + p.total, 0) ?? 0;
  // Por preparar: los pagados y los de transferencia o efectivo recién
  // hechos (quedan en "pendiente_pago" hasta que se confirma el cobro).
  const pedidosPendientes =
    pedidos?.filter(
      (p) =>
        p.estado === "pagado" ||
        p.estado === "en_preparacion" ||
        (p.estado === "pendiente_pago" && p.metodo_pago !== "mercadopago"),
    ).length ?? 0;

  return (
    <div>
      <h1 className="font-display text-3xl text-tinta">Resumen</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-linea bg-crema-alta p-5">
          <p className="text-sm text-tinta/60">Ventas totales</p>
          <p className="mt-1 font-display text-2xl text-ciruela">
            {formatearPrecio(ventasTotales)}
          </p>
        </div>
        <div className="rounded-2xl border border-linea bg-crema-alta p-5">
          <p className="text-sm text-tinta/60">Pedidos por preparar</p>
          <p className="mt-1 font-display text-2xl text-tinta">{pedidosPendientes}</p>
        </div>
        <div className="rounded-2xl border border-linea bg-crema-alta p-5">
          <p className="text-sm text-tinta/60">Productos cargados</p>
          <p className="mt-1 font-display text-2xl text-tinta">{totalProductos ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

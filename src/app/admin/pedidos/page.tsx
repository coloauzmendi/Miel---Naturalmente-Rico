import { createClient } from "@/lib/supabase/server";
import AdminPedidosClient from "@/components/AdminPedidosClient";

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*, pedido_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-tinta">Pedidos</h1>
      <AdminPedidosClient pedidosIniciales={pedidos ?? []} />
    </div>
  );
}

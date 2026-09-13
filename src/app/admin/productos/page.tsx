import { createClient } from "@/lib/supabase/server";
import AdminProductosClient from "@/components/AdminProductosClient";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-tinta">Productos</h1>
      <AdminProductosClient productosIniciales={productos ?? []} />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { productosDemo } from "@/lib/productos-demo";
import { Producto } from "@/types";

const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function obtenerProductos(): Promise<Producto[]> {
  if (!supabaseConfigurado) return productosDemo;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: false });

  if (error || !data) return productosDemo;
  return data as Producto[];
}

export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
  if (!supabaseConfigurado) {
    return productosDemo.find((p) => p.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Producto;
}

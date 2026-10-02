import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { Producto } from "@/types";

export async function obtenerProductos(): Promise<Producto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    // Queda en los logs de Vercel. Mostramos el catálogo vacío antes que
    // productos que no existen.
    console.error("No se pudieron cargar los productos:", error);
    return [];
  }
  return data as Producto[];
}

// Con cache(), si la metadata y la página piden el mismo producto en la
// misma carga, se consulta la base una sola vez.
export const obtenerProductoPorId = cache(async function obtenerProductoPorId(
  id: string,
): Promise<Producto | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Producto;
});

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

// Busca un producto por su slug ("croquetas-de-papa-y-mung"). Con
// cache(), si la metadata y la página piden el mismo producto en la misma
// carga, se consulta la base una sola vez.
export const obtenerProducto = cache(async function obtenerProducto(
  slug: string,
): Promise<Producto | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as Producto;
});

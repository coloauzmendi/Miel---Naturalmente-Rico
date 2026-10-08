import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * "Pancakes 100% harina de almendras (Limón)" → "pancakes-100-harina-de-almendras-limon"
 * Es la parte de la dirección de cada producto: /productos/<slug>.
 */
export function slugificar(texto: string): string {
  return (
    texto
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // saca tildes: "limón" → "limon"
      .toLowerCase()
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .replace(/-+$/g, "") || "producto"
  );
}

/**
 * Slug libre para un producto: si ya existe otro con el mismo, le agrega
 * "-2", "-3", etc.
 */
export async function slugUnico(
  supabase: SupabaseClient,
  nombre: string,
): Promise<string> {
  const base = slugificar(nombre);
  const { data } = await supabase
    .from("productos")
    .select("slug")
    .like("slug", `${base}%`);
  const usados = new Set((data ?? []).map((p) => p.slug));

  if (!usados.has(base)) return base;
  for (let n = 2; ; n++) {
    if (!usados.has(`${base}-${n}`)) return `${base}-${n}`;
  }
}

// Dirección de un producto. Si por algún motivo no tiene slug (por
// ejemplo, una copia vieja guardada en un carrito), lleva al catálogo en
// vez de a una página que no existe.
export function urlProducto(producto: { slug?: string | null }): string {
  return producto.slug ? `/productos/${producto.slug}` : "/productos";
}

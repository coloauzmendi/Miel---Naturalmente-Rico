import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { limpiarEncuadres } from "@/lib/encuadre";
import { slugUnico } from "@/lib/slug";

async function requiereAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { autorizado: false as const };

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  return { autorizado: perfil?.rol === "admin", supabase };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { autorizado, supabase } = await requiereAdmin();
  if (!autorizado || !supabase) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const imagenes: string[] = Array.isArray(body.imagenes) ? body.imagenes : [];

  // El slug no cambia al renombrar (para no romper links). Solo se crea si
  // el producto todavía no tenía uno.
  const { data: actual } = await supabase
    .from("productos")
    .select("slug")
    .eq("id", id)
    .single();
  const slug = actual?.slug || (await slugUnico(supabase, String(body.nombre ?? "")));

  const { data, error } = await supabase
    .from("productos")
    .update({
      slug,
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: body.precio,
      categoria: body.categoria,
      imagen_url: imagenes[0] ?? null,
      imagenes: imagenes.length ? imagenes : null,
      stock: body.stock,
      activo: body.activo,
      destacado: body.destacado ?? false,
      sabores: body.sabores?.length ? body.sabores : null,
      encuadres: limpiarEncuadres(body.encuadres, imagenes),
    })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { autorizado, supabase } = await requiereAdmin();
  if (!autorizado || !supabase) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const { data, error } = await supabase
    .from("productos")
    .update({
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

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

export async function POST(request: NextRequest) {
  const { autorizado, supabase } = await requiereAdmin();
  if (!autorizado || !supabase) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: body.precio,
      categoria: body.categoria,
      imagen_url: body.imagen_url || null,
      stock: body.stock,
      activo: body.activo ?? true,
      destacado: body.destacado ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

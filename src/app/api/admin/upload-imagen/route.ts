import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

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

  return { autorizado: perfil?.rol === "admin" };
}

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5MB, igual que el bucket

export async function POST(request: NextRequest) {
  const { autorizado } = await requiereAdmin();
  if (!autorizado) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const formData = await request.formData();
  const archivo = formData.get("archivo");

  if (!(archivo instanceof File)) {
    return NextResponse.json(
      { error: "No llegó ningún archivo." },
      { status: 400 },
    );
  }
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return NextResponse.json(
      { error: "Solo se aceptan imágenes (JPG, PNG, WEBP o GIF)." },
      { status: 400 },
    );
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return NextResponse.json(
      { error: "La imagen pesa más de 5MB." },
      { status: 400 },
    );
  }

  const extension = archivo.name.split(".").pop()?.toLowerCase() || "jpg";
  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const supabaseAdmin = createServiceClient();
  const { error } = await supabaseAdmin.storage
    .from("productos")
    .upload(nombreArchivo, archivo, {
      contentType: archivo.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage
    .from("productos")
    .getPublicUrl(nombreArchivo);

  return NextResponse.json({ url: data.publicUrl });
}

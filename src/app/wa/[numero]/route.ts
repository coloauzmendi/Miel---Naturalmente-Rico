import { NextRequest, NextResponse } from "next/server";

/**
 * /wa/5493410000000 → abre el chat de WhatsApp con ese número.
 *
 * Lo usa el botón "Escribirle al cliente" del aviso de pedidos nuevos:
 * Meta no permite links a wa.me en los botones de las plantillas, así que
 * el botón apunta acá y redirigimos nosotros.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ numero: string }> }
) {
  const { numero } = await params;

  // Solo dígitos: así esto no sirve para redirigir a cualquier otro sitio.
  if (!/^\d{8,15}$/.test(numero)) {
    return NextResponse.json({ error: "Número inválido" }, { status: 400 });
  }

  return NextResponse.redirect(`https://wa.me/${numero}`);
}

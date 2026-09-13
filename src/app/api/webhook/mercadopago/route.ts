import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Mercado Pago llama a esta URL cada vez que cambia el estado de un pago.
 * Configurá esta URL como "notification_url" en tu cuenta de Mercado Pago
 * (ya se envía automáticamente al crear la preferencia en /api/checkout).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body?.data?.id ?? request.nextUrl.searchParams.get("id");

    if (!paymentId || !process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({ ok: true });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
    const payment = await new Payment(client).get({ id: paymentId });

    const pedidoId = payment.external_reference;
    if (!pedidoId) return NextResponse.json({ ok: true });

    const nuevoEstado =
      payment.status === "approved"
        ? "pagado"
        : payment.status === "rejected"
          ? "cancelado"
          : "pendiente_pago";

    const supabase = createServiceClient();
    await supabase
      .from("pedidos")
      .update({
        estado: nuevoEstado,
        mp_payment_id: String(payment.id),
      })
      .eq("id", pedidoId);

    return NextResponse.json({ ok: true });
  } catch {
    // Mercado Pago reintenta si no devolvemos 200, así que devolvemos
    // 200 igual y confiamos en los reintentos para casos raros.
    return NextResponse.json({ ok: true });
  }
}

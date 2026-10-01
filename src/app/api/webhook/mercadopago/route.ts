import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createServiceClient } from "@/lib/supabase/server";
import { avisarPedidoPorWhatsapp } from "@/lib/avisos";

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

    const supabase = createServiceClient();

    const { data: pedido } = await supabase
      .from("pedidos")
      .select("total")
      .eq("id", pedidoId)
      .single();
    if (!pedido) return NextResponse.json({ ok: true });

    // Solo lo damos por pagado si se cobró el total completo del pedido.
    const montoCorrecto = Number(payment.transaction_amount) >= pedido.total;

    const nuevoEstado =
      payment.status === "approved" && montoCorrecto
        ? "pagado"
        : ["rejected", "cancelled", "refunded", "charged_back"].includes(
              payment.status ?? ""
            )
          ? "cancelado"
          : "pendiente_pago";

    const mpPaymentId = String(payment.id);

    if (nuevoEstado === "pagado") {
      // Mercado Pago avisa varias veces el mismo pago: solo pasamos a
      // "pagado" (y avisamos por WhatsApp) la primera vez. Así tampoco
      // pisamos un estado posterior, como "en_preparacion".
      const { data: actualizados } = await supabase
        .from("pedidos")
        .update({ estado: "pagado", mp_payment_id: mpPaymentId })
        .eq("id", pedidoId)
        .in("estado", ["pendiente_pago", "cancelado"])
        .select("id");

      if (actualizados && actualizados.length > 0) {
        await avisarPedidoPorWhatsapp(pedidoId);
      }
    } else if (nuevoEstado === "cancelado") {
      await supabase
        .from("pedidos")
        .update({ estado: "cancelado", mp_payment_id: mpPaymentId })
        .eq("id", pedidoId);
    } else {
      // Pago en proceso: solo guardamos el ID, sin tocar el estado.
      await supabase
        .from("pedidos")
        .update({ mp_payment_id: mpPaymentId })
        .eq("id", pedidoId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Mercado Pago reintenta si no devolvemos 200, así que devolvemos
    // 200 igual y confiamos en los reintentos para casos raros.
    return NextResponse.json({ ok: true });
  }
}

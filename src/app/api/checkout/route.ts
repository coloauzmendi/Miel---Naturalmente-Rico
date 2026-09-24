import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

interface ItemRecibido {
  producto_id: string;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  sabor?: string | null;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Necesitás iniciar sesión." }, { status: 401 });
  }

  const body = await request.json();
  const items: ItemRecibido[] = body.items;
  const { direccion_entrega, telefono_contacto, notas } = body;
  const metodo_pago: "mercadopago" | "efectivo" =
    body.metodo_pago === "efectivo" ? "efectivo" : "mercadopago";

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (!direccion_entrega || !telefono_contacto) {
    return NextResponse.json(
      { error: "Falta la dirección o el teléfono de contacto." },
      { status: 400 }
    );
  }

  const total = items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0);

  // 1. Crear el pedido en estado "pendiente_pago"
  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .insert({
      user_id: user.id,
      estado: "pendiente_pago",
      total,
      direccion_entrega,
      telefono_contacto,
      notas: notas || null,
      metodo_pago,
    })
    .select()
    .single();

  if (errorPedido || !pedido) {
    return NextResponse.json(
      { error: "No pudimos crear el pedido. Probá de nuevo." },
      { status: 500 }
    );
  }

  // 2. Guardar los items del pedido
  const { error: errorItems } = await supabase.from("pedido_items").insert(
    items.map((i) => ({
      pedido_id: pedido.id,
      producto_id: i.producto_id,
      nombre_producto: i.nombre_producto,
      precio_unitario: i.precio_unitario,
      cantidad: i.cantidad,
      sabor: i.sabor ?? null,
    }))
  );

  if (errorItems) {
    return NextResponse.json(
      { error: "No pudimos guardar los productos del pedido." },
      { status: 500 }
    );
  }

  // Pago en efectivo: no hay nada que gestionar con Mercado Pago, el
  // pedido queda creado y el cliente coordina la entrega por WhatsApp.
  if (metodo_pago === "efectivo") {
    return NextResponse.json({ pedido_id: pedido.id });
  }

  // Si todavía no configuraste Mercado Pago, devolvemos un link de éxito
  // de prueba para que puedas ver el flujo completo igual.
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json({
      init_point: `/checkout/exito?pedido=${pedido.id}&demo=1`,
    });
  }

  // 3. Crear la preferencia de pago en Mercado Pago
  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  const preference = new Preference(client);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const resultado = await preference.create({
      body: {
        items: items.map((i) => ({
          id: i.producto_id,
          title: i.sabor ? `${i.nombre_producto} (${i.sabor})` : i.nombre_producto,
          quantity: i.cantidad,
          unit_price: i.precio_unitario,
          currency_id: "ARS",
        })),
        payer: { email: user.email ?? undefined },
        back_urls: {
          success: `${siteUrl}/checkout/exito?pedido=${pedido.id}`,
          failure: `${siteUrl}/checkout/error?pedido=${pedido.id}`,
          pending: `${siteUrl}/checkout/exito?pedido=${pedido.id}&pendiente=1`,
        },
        auto_return: "approved",
        external_reference: pedido.id,
        notification_url: `${siteUrl}/api/webhook/mercadopago`,
      },
    });

    await supabase
      .from("pedidos")
      .update({ mp_preference_id: resultado.id })
      .eq("id", pedido.id);

    return NextResponse.json({ init_point: resultado.init_point });
  } catch {
    return NextResponse.json(
      { error: "No pudimos conectar con Mercado Pago. Probá de nuevo." },
      { status: 502 }
    );
  }
}

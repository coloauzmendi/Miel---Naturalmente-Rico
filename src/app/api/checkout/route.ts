import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { avisarPedidoPorWhatsapp } from "@/lib/avisos";
import type { Producto } from "@/types";

// Del navegador solo aceptamos qué productos y cuántos: el nombre y el
// precio se sacan siempre de la base, así nadie puede pagar menos
// modificando lo que manda su navegador.
interface ItemRecibido {
  producto_id: string;
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

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const items: ItemRecibido[] = body.items;
  // Recortamos espacios y largo para que no se guarde basura en la base.
  const texto = (valor: unknown, maximo: number) =>
    typeof valor === "string" ? valor.trim().slice(0, maximo) : "";
  const direccion_entrega = texto(body.direccion_entrega, 300);
  const telefono_contacto = texto(body.telefono_contacto, 40);
  const notas = texto(body.notas, 500);
  const metodo_pago: "mercadopago" | "efectivo" =
    body.metodo_pago === "efectivo" ? "efectivo" : "mercadopago";

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (items.length > 50) {
    return NextResponse.json({ error: "El pedido tiene demasiados productos." }, { status: 400 });
  }
  if (!direccion_entrega || !telefono_contacto) {
    return NextResponse.json(
      { error: "Falta la dirección o el teléfono de contacto." },
      { status: 400 }
    );
  }

  // Los pedidos se crean con la service key: los usuarios ya no tienen
  // permiso para insertarlos directo (ver migración pedidos-solo-servidor).
  const admin = createServiceClient();

  const { data: productos } = await admin
    .from("productos")
    .select("*")
    .in("id", items.map((i) => i.producto_id))
    .eq("activo", true);

  const itemsPedido = [];
  for (const i of items) {
    const producto = (productos as Producto[] | null)?.find(
      (p) => p.id === i.producto_id
    );
    if (!producto || !Number.isInteger(i.cantidad) || i.cantidad < 1) {
      return NextResponse.json(
        { error: "Algún producto del carrito ya no está disponible. Revisá tu carrito." },
        { status: 400 }
      );
    }
    // Stock en 0 = agotado (se maneja a mano desde el panel).
    if (producto.stock <= 0) {
      return NextResponse.json(
        { error: `${producto.nombre} está agotado por ahora. Sacalo del carrito para seguir.` },
        { status: 400 }
      );
    }

    const sabores = producto.sabores ?? [];
    let precio = producto.precio;
    let sabor: string | null = null;
    if (sabores.length > 0) {
      const elegido = sabores.find((s) => s.nombre === i.sabor);
      if (!elegido) {
        return NextResponse.json(
          { error: `Elegí un sabor válido para ${producto.nombre}.` },
          { status: 400 }
        );
      }
      precio = elegido.precio;
      sabor = elegido.nombre;
    }

    itemsPedido.push({
      producto_id: producto.id,
      nombre_producto: producto.nombre,
      precio_unitario: precio,
      cantidad: i.cantidad,
      sabor,
    });
  }

  const total = itemsPedido.reduce(
    (acc, i) => acc + i.precio_unitario * i.cantidad,
    0
  );

  // 1. Crear el pedido en estado "pendiente_pago"
  const { data: pedido, error: errorPedido } = await admin
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
  const { error: errorItems } = await admin
    .from("pedido_items")
    .insert(itemsPedido.map((i) => ({ ...i, pedido_id: pedido.id })));

  if (errorItems) {
    // Sin productos el pedido no sirve: lo borramos para que no quede vacío.
    await admin.from("pedidos").delete().eq("id", pedido.id);
    return NextResponse.json(
      { error: "No pudimos guardar los productos del pedido." },
      { status: 500 }
    );
  }

  // Pago en efectivo: no hay nada que gestionar con Mercado Pago, el
  // pedido queda creado y el cliente coordina la entrega por WhatsApp.
  if (metodo_pago === "efectivo") {
    await avisarPedidoPorWhatsapp(pedido.id);
    return NextResponse.json({ pedido_id: pedido.id });
  }

  // Sin la clave de Mercado Pago no se puede cobrar: avisamos el error en
  // vez de dar el pedido por hecho.
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.error("Falta MERCADOPAGO_ACCESS_TOKEN: no se puede cobrar con Mercado Pago.");
    return NextResponse.json(
      { error: "El pago con Mercado Pago no está disponible en este momento. Probá en efectivo o escribinos por WhatsApp." },
      { status: 503 }
    );
  }

  // 3. Crear la preferencia de pago en Mercado Pago
  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  const preference = new Preference(client);

  // Sin barra final: "https://sitio.com/" + "/api/..." daría "//api/...",
  // que redirige, y Mercado Pago no sigue redirecciones al avisar pagos.
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/+$/, "");

  try {
    const resultado = await preference.create({
      body: {
        items: itemsPedido.map((i) => ({
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

    await admin
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

import { createServiceClient } from "@/lib/supabase/server";
import { formatearPrecio } from "@/lib/formato";
import type { Pedido, PedidoItem } from "@/types";

/**
 * Manda un WhatsApp a la tienda con el detalle de un pedido, usando la
 * API oficial de WhatsApp (Cloud API de Meta).
 *
 * Como el mensaje lo inicia la tienda, WhatsApp exige usar una plantilla
 * aprobada. La plantilla (por defecto "nuevo_pedido") tiene que tener
 * estas 8 variables en el cuerpo, en este orden:
 *   {{1}} código  {{2}} estado  {{3}} total  {{4}} productos
 *   {{5}} cliente {{6}} teléfono {{7}} entrega {{8}} notas
 * y un botón de URL dinámica ".../wa/{{1}}" (escribirle al cliente; ver
 * src/app/wa/[numero]/route.ts).
 *
 * Variables de entorno:
 *   WHATSAPP_TOKEN            token permanente (usuario del sistema)
 *   WHATSAPP_PHONE_NUMBER_ID  ID del número que envía
 *   WHATSAPP_AVISO_DESTINOS   números que reciben el aviso, separados por coma
 *   WHATSAPP_PLANTILLA        nombre de la plantilla (opcional)
 *   WHATSAPP_PLANTILLA_IDIOMA código de idioma de la plantilla (opcional)
 *
 * Nunca tira error: si el aviso falla, el pedido sigue igual.
 */
export async function avisarPedidoPorWhatsapp(pedidoId: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const destinos = (process.env.WHATSAPP_AVISO_DESTINOS ?? "")
    .split(",")
    .map((d) => d.replace(/\D/g, ""))
    .filter(Boolean);
  if (!token || !phoneNumberId || destinos.length === 0) return;

  try {
    const variables = await armarVariables(pedidoId);
    if (!variables) return;

    const version = process.env.WHATSAPP_API_VERSION ?? "v25.0";
    await Promise.all(
      destinos.map(async (destino) => {
        const respuesta = await fetch(
          `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: destino,
              type: "template",
              template: {
                name: process.env.WHATSAPP_PLANTILLA ?? "nuevo_pedido",
                language: {
                  code: process.env.WHATSAPP_PLANTILLA_IDIOMA ?? "es_AR",
                },
                components: [
                  {
                    type: "body",
                    parameters: variables.cuerpo.map((text) => ({
                      type: "text",
                      text,
                    })),
                  },
                  {
                    // Botón "Escribirle al cliente": la plantilla tiene la
                    // URL https://www.mielnaturalmenterico.com.ar/wa/{{1}}
                    // (Meta no deja poner wa.me directo en un botón) y acá
                    // completamos el número; /wa redirige al chat.
                    type: "button",
                    sub_type: "url",
                    index: "0",
                    parameters: [{ type: "text", text: variables.whatsappCliente }],
                  },
                ],
              },
            }),
            signal: AbortSignal.timeout(8000),
          }
        );
        if (!respuesta.ok) {
          // Queda en los logs de Vercel para poder ver por qué falló.
          console.error(
            `Aviso de WhatsApp a ${destino} falló:`,
            await respuesta.text()
          );
        }
      })
    );
  } catch (error) {
    // El aviso es un extra: si falla, no rompemos el checkout ni el webhook.
    console.error("Aviso de WhatsApp falló:", error);
  }
}

// WhatsApp rechaza variables vacías, con saltos de línea, tabs o más de
// 4 espacios seguidos (error 132018).
function limpiar(texto: string | null | undefined) {
  const limpio = (texto ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
  return limpio || "-";
}

/**
 * Pasa un teléfono argentino escrito como sea ("341 15 335-4101",
 * "0341 3354101", "+54 9 341...") al formato que usa WhatsApp:
 * 549 + característica + número, sin el 0 ni el 15.
 */
export function telefonoParaWhatsapp(telefono: string) {
  let numero = telefono.replace(/\D/g, "").replace(/^00/, "");
  if (numero.startsWith("54")) numero = numero.slice(2).replace(/^9/, "");
  numero = numero.replace(/^0/, "");

  // Con el 15 después de la característica (de 2 a 4 dígitos) sobran 2.
  if (numero.length === 12) {
    for (const largoCaracteristica of [2, 3, 4]) {
      if (numero.slice(largoCaracteristica, largoCaracteristica + 2) === "15") {
        numero =
          numero.slice(0, largoCaracteristica) +
          numero.slice(largoCaracteristica + 2);
        break;
      }
    }
  }

  // Número local sin característica: asumimos la de la zona (Rosario, 341).
  if (numero.length === 9 && numero.startsWith("15")) numero = numero.slice(2);
  if (numero.length === 7) numero = `341${numero}`;

  return numero.length === 10 ? `549${numero}` : numero || "-";
}

async function armarVariables(
  pedidoId: string
): Promise<{ cuerpo: string[]; whatsappCliente: string } | null> {
  const supabase = createServiceClient();

  const { data: pedido } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id", pedidoId)
    .single<Pedido>();
  if (!pedido) return null;

  const [{ data: items }, { data: perfil }, { data: usuario }] =
    await Promise.all([
      supabase
        .from("pedido_items")
        .select("*")
        .eq("pedido_id", pedidoId)
        .returns<PedidoItem[]>(),
      supabase
        .from("perfiles")
        .select("nombre")
        .eq("id", pedido.user_id)
        .maybeSingle(),
      supabase.auth.admin.getUserById(pedido.user_id),
    ]);

  const productos = (items ?? [])
    .map(
      (i) =>
        `${i.cantidad}x ${i.nombre_producto}${i.sabor ? ` (${i.sabor})` : ""} ${formatearPrecio(i.precio_unitario * i.cantidad)}`
    )
    .join(" | ");

  const cliente = [perfil?.nombre, usuario?.user?.email]
    .filter(Boolean)
    .join(" - ");

  const whatsappCliente = telefonoParaWhatsapp(pedido.telefono_contacto);

  const cuerpo = [
    pedido.id.slice(0, 8).toUpperCase(),
    pedido.metodo_pago === "mercadopago"
      ? "PAGADO con Mercado Pago"
      : "A COBRAR en efectivo",
    formatearPrecio(pedido.total),
    productos,
    cliente,
    // Con formato internacional WhatsApp lo reconoce y se puede tocar.
    whatsappCliente.startsWith("549")
      ? `+${whatsappCliente}`
      : pedido.telefono_contacto,
    pedido.direccion_entrega,
    pedido.notas ?? "",
  ].map(limpiar);

  return { cuerpo, whatsappCliente };
}

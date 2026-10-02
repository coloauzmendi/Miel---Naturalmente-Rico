import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import VaciarCarrito from "@/components/VaciarCarrito";
import { createClient } from "@/lib/supabase/server";
import { formatearPrecio } from "@/lib/formato";
import { linkWhatsapp } from "@/lib/contacto";
import type { Pedido, PedidoItem } from "@/types";

// Arma el mensaje que el cliente nos manda por WhatsApp después de pagar
// con Mercado Pago, con los datos del pedido tal como quedaron en la base.
async function linkPedidoPorWhatsapp(
  pedidoId: string,
  pendiente: boolean,
): Promise<string | null> {
  const supabase = await createClient();
  const { data: pedido } = await supabase
    .from("pedidos")
    .select("*, pedido_items(*)")
    .eq("id", pedidoId)
    .maybeSingle<Pedido & { pedido_items: PedidoItem[] }>();
  if (!pedido || pedido.metodo_pago !== "mercadopago") return null;

  const detalle = pedido.pedido_items
    .map(
      (i) =>
        `${i.cantidad}x ${i.nombre_producto}${i.sabor ? ` (${i.sabor})` : ""} - ${formatearPrecio(i.precio_unitario * i.cantidad)}`,
    )
    .join("\n");

  // Emojis como código Unicode para que no se rompan en el camino.
  const canasta = "\u{1F9FA}"; // 🧺
  const dinero = "\u{1F4B0}"; // 💰
  const pin = "\u{1F4CD}"; // 📍
  const ok = "\u{2705}"; // ✅

  const codigo = pedido.id.slice(0, 8).toUpperCase();
  const pago = pendiente
    ? "lo pagué con Mercado Pago (el pago está en revisión)"
    : `lo pagué con Mercado Pago ${ok}`;

  return linkWhatsapp(
    `Hola! Acabo de hacer el pedido #${codigo} y ${pago}\n\n` +
      `${canasta} Pedido:\n${detalle}\n\n` +
      `${dinero} Total: ${formatearPrecio(pedido.total)}\n` +
      `${pin} Entrega: ${pedido.direccion_entrega}` +
      (pedido.notas ? `\nNotas: ${pedido.notas}` : ""),
  );
}

export default async function CheckoutExito({
  searchParams,
}: {
  searchParams: Promise<{
    pedido?: string;
    pendiente?: string;
    demo?: string;
    efectivo?: string;
    wsp?: string;
  }>;
}) {
  const { pedido, pendiente, demo, efectivo, wsp } = await searchParams;

  const wspMercadoPago =
    pedido && !efectivo
      ? await linkPedidoPorWhatsapp(pedido, Boolean(pendiente))
      : null;
  const linkWsp = efectivo ? wsp : wspMercadoPago;

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <VaciarCarrito />
      <CheckCircle2 className="mx-auto text-oliva" size={48} />
      <h1 className="mt-4 font-display text-3xl text-tinta">
        {pendiente ? "Tu pago está en revisión" : "¡Gracias por tu pedido!"}
      </h1>
      <p className="mt-3 text-tinta/70">
        {efectivo
          ? "Ya te escribimos un mensaje armado en WhatsApp: mandalo para confirmar tu pedido y coordinar el pago en efectivo."
          : linkWsp
            ? "Último paso: mandanos tu pedido por WhatsApp para coordinar la entrega. El mensaje ya está armado, solo tenés que enviarlo."
            : pendiente
              ? "Te avisamos apenas se confirme el pago."
              : "Ya recibimos tu pedido y te vamos a avisar cuando esté en preparación."}
      </p>
      {demo && (
        <p className="mt-3 rounded-lg bg-crema-alta p-3 text-sm text-dorado-oscuro">
          Estás viendo el flujo de demostración: todavía no configuraste
          MERCADOPAGO_ACCESS_TOKEN en el archivo .env.
        </p>
      )}
      {linkWsp && (
        <a
          href={linkWsp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        >
          <MessageCircle size={18} />
          {efectivo ? "Abrir WhatsApp" : "Enviar mi pedido por WhatsApp"}
        </a>
      )}
      <Link
        href="/cuenta/pedidos"
        className={
          linkWsp
            ? "mt-4 block text-sm text-tinta/60 underline underline-offset-2 hover:text-tinta"
            : "mt-8 inline-block rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        }
      >
        Ver mis pedidos
      </Link>
    </div>
  );
}

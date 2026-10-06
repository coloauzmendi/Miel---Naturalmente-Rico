import Link from "next/link";
import { CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import VaciarCarrito from "@/components/VaciarCarrito";
import BotonCopiar from "@/components/BotonCopiar";
import { createClient } from "@/lib/supabase/server";
import { codigoPedido, formatearPrecio } from "@/lib/formato";
import {
  ALIAS_TRANSFERENCIA,
  TITULAR_TRANSFERENCIA,
  linkWhatsapp,
} from "@/lib/contacto";
import type { Pedido, PedidoItem } from "@/types";

// Busca el pedido en la base (con la sesión del cliente) para mostrar el
// total real y armar el mensaje de WhatsApp con el comprobante.
async function datosTransferencia(pedidoId: string) {
  const supabase = await createClient();
  const { data: pedido } = await supabase
    .from("pedidos")
    .select("*, pedido_items(*)")
    .eq("id", pedidoId)
    .maybeSingle<Pedido & { pedido_items: PedidoItem[] }>();
  if (!pedido) return null;

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
  const abajo = "\u{1F447}"; // 👇

  const mensaje =
    `Hola! Hice el pedido ${codigoPedido(pedido.id)} y lo pagué por transferencia.\n\n` +
    `${canasta} Pedido:\n${detalle}\n\n` +
    `${dinero} Total: ${formatearPrecio(pedido.total)}\n` +
    `${pin} Entrega: ${pedido.direccion_entrega}\n\n` +
    `Les envío el comprobante de la transferencia ${abajo}`;

  return {
    codigo: codigoPedido(pedido.id),
    total: pedido.total,
    linkWsp: linkWhatsapp(mensaje),
  };
}

export default async function CheckoutExito({
  searchParams,
}: {
  searchParams: Promise<{
    pedido?: string;
    pendiente?: string;
    efectivo?: string;
    transferencia?: string;
    wsp?: string;
  }>;
}) {
  const { pedido, pendiente, efectivo, transferencia, wsp } = await searchParams;

  if (transferencia) {
    const datos = pedido ? await datosTransferencia(pedido) : null;
    const linkWsp =
      datos?.linkWsp ??
      linkWhatsapp(
        "Hola! Hice un pedido y lo pagué por transferencia. Les envío el comprobante.",
      );

    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center sm:py-20">
        <VaciarCarrito />
        <CheckCircle2 className="mx-auto text-oliva" size={48} />
        <h1 className="mt-4 font-display text-3xl text-tinta">
          ¡Recibimos tu pedido!
        </h1>
        <p className="mt-3 text-tinta/70">
          {datos ? `Pedido ${datos.codigo}. ` : ""}Para confirmarlo, transferí
          el total a esta cuenta:
        </p>

        <div className="mt-6 rounded-2xl border border-linea bg-crema-alta p-5 text-left">
          {datos && (
            <div className="flex items-baseline justify-between gap-3 border-b border-linea pb-4">
              <span className="text-sm text-tinta/60">Total a transferir</span>
              <span className="font-display text-2xl text-ciruela">
                {formatearPrecio(datos.total)}
              </span>
            </div>
          )}
          <div className={`flex items-center justify-between gap-3 ${datos ? "pt-4" : ""}`}>
            <div className="min-w-0">
              <p className="text-sm text-tinta/60">Alias</p>
              <p className="break-all font-medium text-tinta">
                {ALIAS_TRANSFERENCIA}
              </p>
            </div>
            <BotonCopiar texto={ALIAS_TRANSFERENCIA} />
          </div>
          <div className="pt-3">
            <p className="text-sm text-tinta/60">Titular de la cuenta</p>
            <p className="font-medium text-tinta">{TITULAR_TRANSFERENCIA}</p>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-lg bg-dorado/15 p-3 text-left text-sm text-dorado-oscuro">
          <ShieldCheck size={18} className="mt-0.5 shrink-0" />
          <span>
            Antes de confirmar la transferencia, corroborá que el alias sea{" "}
            <strong>{ALIAS_TRANSFERENCIA}</strong> y que el titular sea{" "}
            <strong>{TITULAR_TRANSFERENCIA}</strong>.
          </span>
        </p>

        <ol className="mt-6 flex flex-col gap-2 text-left text-sm text-tinta/75">
          <li>
            <strong className="text-tinta">1.</strong> Transferí el total desde
            tu banco o billetera virtual.
          </li>
          <li>
            <strong className="text-tinta">2.</strong> Tocá el botón de abajo:
            se abre WhatsApp con tu pedido ya escrito. Envialo.
          </li>
          <li>
            <strong className="text-tinta">3.</strong> En ese mismo chat,
            mandanos el <strong className="text-tinta">comprobante</strong> de
            la transferencia.
          </li>
        </ol>

        <a
          href={linkWsp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        >
          <MessageCircle size={18} />
          Enviar comprobante por WhatsApp
        </a>
        <Link
          href="/cuenta/pedidos"
          className="mt-4 block text-sm text-tinta/60 underline underline-offset-2 hover:text-tinta"
        >
          Ver mis pedidos
        </Link>
      </div>
    );
  }

  // Solo en efectivo: el mensaje armado para coordinar el pago.
  const linkWsp = efectivo ? wsp : null;

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
          : pendiente
            ? "Te avisamos apenas se confirme el pago."
            : "Ya recibimos tu pedido y te vamos a avisar cuando esté en preparación."}
      </p>
      {linkWsp && (
        <a
          href={linkWsp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
        >
          <MessageCircle size={18} />
          Abrir WhatsApp
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

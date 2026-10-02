import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import VaciarCarrito from "@/components/VaciarCarrito";

export default async function CheckoutExito({
  searchParams,
}: {
  searchParams: Promise<{
    pedido?: string;
    pendiente?: string;
    efectivo?: string;
    wsp?: string;
  }>;
}) {
  const { pendiente, efectivo, wsp } = await searchParams;
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

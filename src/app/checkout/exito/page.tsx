import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutExito({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string; pendiente?: string; demo?: string }>;
}) {
  const { pendiente, demo } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <CheckCircle2 className="mx-auto text-oliva" size={48} />
      <h1 className="mt-4 font-display text-3xl text-tinta">
        {pendiente ? "Tu pago está en revisión" : "¡Gracias por tu pedido!"}
      </h1>
      <p className="mt-3 text-tinta/70">
        {pendiente
          ? "Te avisamos apenas se confirme el pago."
          : "Ya recibimos tu pedido y te vamos a avisar cuando esté en preparación."}
      </p>
      {demo && (
        <p className="mt-3 rounded-lg bg-crema-alta p-3 text-sm text-dorado-oscuro">
          Estás viendo el flujo de demostración: todavía no configuraste
          MERCADOPAGO_ACCESS_TOKEN en el archivo .env.
        </p>
      )}
      <Link
        href="/cuenta/pedidos"
        className="mt-8 inline-block rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
      >
        Ver mis pedidos
      </Link>
    </div>
  );
}

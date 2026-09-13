import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutError() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <XCircle className="mx-auto text-ciruela" size={48} />
      <h1 className="mt-4 font-display text-3xl text-tinta">El pago no se completó</h1>
      <p className="mt-3 text-tinta/70">
        No te preocupes, no se realizó ningún cobro. Podés volver a intentarlo
        cuando quieras.
      </p>
      <Link
        href="/carrito"
        className="mt-8 inline-block rounded-full bg-oliva px-6 py-3 text-sm font-medium text-crema-alta hover:bg-oliva-claro"
      >
        Volver al carrito
      </Link>
    </div>
  );
}

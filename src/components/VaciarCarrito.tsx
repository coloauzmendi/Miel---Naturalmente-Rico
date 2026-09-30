"use client";

import { useEffect } from "react";
import { useCarrito } from "@/components/CarritoContext";

// Vacía el carrito al llegar a la página de éxito. Se hace acá y no antes
// de ir a Mercado Pago para que, si la persona vuelve sin pagar, sus
// productos sigan en el carrito.
export default function VaciarCarrito() {
  const { vaciar } = useCarrito();

  useEffect(() => {
    vaciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo una vez al entrar
  }, []);

  return null;
}

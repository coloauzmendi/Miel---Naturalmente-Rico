"use client";

import { useEffect } from "react";
import { useCarrito } from "@/components/CarritoContext";

// Vacía el carrito al llegar a la página de éxito, una vez que el pedido
// ya quedó creado.
export default function VaciarCarrito() {
  const { vaciar } = useCarrito();

  useEffect(() => {
    vaciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo una vez al entrar
  }, []);

  return null;
}

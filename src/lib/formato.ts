import type { MetodoPago } from "@/types";

export const ETIQUETA_METODO_PAGO: Record<MetodoPago, string> = {
  transferencia: "Transferencia",
  efectivo: "Efectivo",
  mercadopago: "Mercado Pago",
};

// Código corto del pedido, el mismo que va en los mensajes de WhatsApp.
export function codigoPedido(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio);
}

// Siempre en hora argentina: en Vercel el servidor corre en UTC y, sin
// esto, las fechas y horas se correrían 3 horas.
const ZONA_HORARIA = "America/Argentina/Buenos_Aires";

export function formatearFechaHora(fecha: string | Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: ZONA_HORARIA,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(fecha));
}

export function formatearFecha(fecha: string | Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: ZONA_HORARIA,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(fecha));
}

// WhatsApp Business de la tienda. Si cambia el número, se cambia solo acá.
export const WHATSAPP_TIENDA = "5493416149016";
export const WHATSAPP_TIENDA_VISIBLE = "341 614-9016";

export const EMAIL_TIENDA = "mielnaturalmenterico@gmail.com";

// Cuenta para los pagos por transferencia.
export const ALIAS_TRANSFERENCIA = "mielnaturalmenterico";
export const TITULAR_TRANSFERENCIA = "Abril Tesan";

// Link para abrir el chat con la tienda, opcionalmente con un mensaje armado.
export function linkWhatsapp(mensaje?: string) {
  const base = `https://wa.me/${WHATSAPP_TIENDA}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

// WhatsApp Business de la tienda. Si cambia el número, se cambia solo acá.
export const WHATSAPP_TIENDA = "5493412665455";
export const WHATSAPP_TIENDA_VISIBLE = "341 266-5455";

// Link para abrir el chat con la tienda, opcionalmente con un mensaje armado.
export function linkWhatsapp(mensaje?: string) {
  const base = `https://wa.me/${WHATSAPP_TIENDA}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

// Secciones de la página principal. Las usan el menú del header y el
// footer: si agregás o cambiás una, se actualiza en los dos lugares.
export const SECCIONES = [
  { href: "/#productos", label: "Productos" },
  { href: "/#como-funciona", label: "Cómo comprar" },
  { href: "/#nosotras", label: "Nosotras" },
  { href: "/#contacto", label: "Contacto" },
];

// Para el "?redirect=" del login y el registro: solo se aceptan rutas de
// esta misma tienda ("/checkout", "/cuenta/pedidos"...). Una dirección
// externa ("https://otro-sitio.com" o "//otro-sitio.com") se ignora, así
// nadie puede usar un link nuestro para mandar a alguien a una página falsa.
export function rutaSegura(ruta: string | null): string {
  if (!ruta || !ruta.startsWith("/") || ruta.startsWith("//") || ruta.startsWith("/\\")) {
    return "/";
  }
  return ruta;
}

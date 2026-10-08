export type Categoria = "almuerzos-cenas" | "desayunos-meriendas";

export interface SaborProducto {
  nombre: string;
  // Precio final de esta variante (reemplaza al precio base del producto).
  precio: number;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number; // en ARS, guardado en centavos evitado por simplicidad -> pesos enteros
  categoria: Categoria;
  imagen_url: string | null;
  // Todas las fotos del producto, en orden. imagen_url es la primera.
  imagenes: string[] | null;
  stock: number;
  activo: boolean;
  destacado: boolean;
  // Variantes que el cliente elige antes de comprar (ej: sabores, tipos de
  // relleno), cada una con su propio precio. null o [] significa que el
  // producto no tiene variantes.
  sabores: SaborProducto[] | null;
  // Cómo encuadrar cada foto, por URL. Las fotos sin encuadre se ven
  // centradas y sin zoom.
  encuadres?: Record<string, Encuadre> | null;
  // Parte legible de la dirección (/productos/<slug>). Puede faltar en
  // copias viejas guardadas en un carrito.
  slug?: string | null;
  created_at?: string;
}

export interface Encuadre {
  // Punto de la foto que queda en el centro del recuadro, en % (0 a 100).
  x: number;
  y: number;
  // 1 = sin zoom.
  zoom: number;
}

export type EstadoPedido =
  | "pendiente_pago"
  | "pagado"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

// "mercadopago" ya no se ofrece en el checkout, pero queda por los pedidos
// viejos y por si se vuelve a activar.
export type MetodoPago = "transferencia" | "efectivo" | "mercadopago";

export interface Pedido {
  id: string;
  user_id: string;
  estado: EstadoPedido;
  total: number;
  direccion_entrega: string;
  telefono_contacto: string;
  notas: string | null;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  metodo_pago: MetodoPago;
  created_at: string;
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  producto_id: string;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  sabor: string | null;
}

export interface Perfil {
  id: string;
  nombre: string;
  telefono: string | null;
  rol: "cliente" | "admin";
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  // Variante elegida (ej: "Acelga"). null si el producto no tiene sabores.
  sabor: string | null;
}

export type Categoria = "almuerzos-cenas" | "desayunos-meriendas";

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number; // en ARS, guardado en centavos evitado por simplicidad -> pesos enteros
  categoria: Categoria;
  imagen_url: string | null;
  stock: number;
  activo: boolean;
  destacado: boolean;
  // Variantes que el cliente elige antes de comprar (ej: sabores, tipos de
  // relleno). null o [] significa que el producto no tiene variantes.
  sabores: string[] | null;
  created_at?: string;
}

export type EstadoPedido =
  | "pendiente_pago"
  | "pagado"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

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

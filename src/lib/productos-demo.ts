import { Producto } from "@/types";

/**
 * Productos de muestra. Se usan únicamente si todavía no conectaste
 * Supabase (ver README). En cuanto configures las variables de entorno,
 * la tienda va a mostrar los productos reales cargados desde el panel
 * de administración.
 */
export const productosDemo: Producto[] = [
  {
    id: "demo-1",
    nombre: "Tarta de zapallo y jengibre",
    descripcion:
      "Masa casera, relleno de zapallo asado, cebolla caramelizada y un toque de jengibre fresco. Se entrega congelada, lista para horno.",
    precio: 8900,
    categoria: "congelados",
    imagen_url: null,
    stock: 12,
    activo: true,
    destacado: true,
  },
  {
    id: "demo-2",
    nombre: "Guiso de lentejas ahumado",
    descripcion:
      "Lentejas, vegetales de estación y un ahumado suave de pimentón. Porción individual, cocido y enfriado el mismo día.",
    precio: 6200,
    categoria: "cocidos",
    imagen_url: null,
    stock: 20,
    activo: true,
    destacado: true,
  },
  {
    id: "demo-3",
    nombre: "Empanadas de humita (x6)",
    descripcion:
      "Choclo fresco, cebolla de verdeo y un toque de albahaca. Congeladas crudas para que las hornees vos en el momento.",
    precio: 7400,
    categoria: "congelados",
    imagen_url: null,
    stock: 15,
    activo: true,
    destacado: false,
  },
  {
    id: "demo-4",
    nombre: "Caldo de hueso casero (500ml)",
    descripcion:
      "Cocción lenta de 12 horas, sin sal agregada. Ideal como base de sopas o para tomar solo.",
    precio: 4300,
    categoria: "congelados",
    imagen_url: null,
    stock: 30,
    activo: true,
    destacado: false,
  },
  {
    id: "demo-5",
    nombre: "Pollo al disco con vegetales",
    descripcion:
      "Pollo cocido a fuego lento con batata, morrón y cebolla. Se entrega recién hecho, para consumir en el día.",
    precio: 9800,
    categoria: "cocidos",
    imagen_url: null,
    stock: 8,
    activo: true,
    destacado: true,
  },
  {
    id: "demo-6",
    nombre: "Sopa de calabaza y coco",
    descripcion:
      "Cremosa, sin lácteos. Un clásico de estación sin conservantes ni aditivos.",
    precio: 5100,
    categoria: "cocidos",
    imagen_url: null,
    stock: 18,
    activo: true,
    destacado: false,
  },
];
